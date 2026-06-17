"use client";
/**
 * Worker bridge for the heavy area-rendering jobs (P4).
 *
 * The Web Worker is spawned lazily — only on the first paint after mount —
 * and reused across all jobs. Each request is keyed by a monotonic `id`
 * so an out-of-order response (e.g. a slow gradient from hue=N-1 arriving
 * after the user has already moved to hue=N) can be discarded on the main
 * thread. The latest-id gate is enforced inside `area.jsx`, not here, so
 * this module stays stateless.
 *
 * Messages are typed with `type` and `id`. The two supported jobs are:
 *
 *   paintGradient:     transfer the ImageData buffer in, get it back painted.
 *   computeGamutPaths: send a small payload, get an array of SVG `d` strings.
 *
 * If `Worker` isn't available (SSR, very old browsers, sandboxed iframes
 * without the API) we expose a `null` worker; the area falls back to its
 * inline main-thread implementation. The fallback path is identical to the
 * legacy behavior — no feature loss.
 */

let _worker = null;
let _nextId = 1;
const _listeners = new Set();

function getWorker() {
    if (_worker) return _worker;
    if (typeof Worker === "undefined") return null;
    try {
        // Vite's `new Worker(new URL(..., import.meta.url))` pattern is the
        // documented way to ship a worker that participates in HMR + the
        // asset graph. Plain `new Worker("./render-worker.js")` would
        // resolve relative to the document, not the module, and would not
        // get a hashed URL.
        _worker = new Worker(new URL("./render-worker.js", import.meta.url), {
            type: "module",
        });
        _worker.onmessage = (e) => {
            for (const cb of _listeners) cb(e.data);
        };
        _worker.onerror = (err) => {
            // Workers are non-critical. If the worker crashes, drop it and
            // fall back to main-thread rendering on the next paint. Don't
            // try to respawn inside this callback — `onerror` is sync and
            // some browsers deadlock if you spawn during it.
            console.error("[color-picker] worker error", err);
            _worker?.terminate();
            _worker = null;
        };
        return _worker;
    } catch (err) {
        console.error("[color-picker] failed to spawn worker", err);
        return null;
    }
}

export function getRenderBridge() {
    return {
        worker: getWorker(),
        nextId: () => _nextId++,
        post: (msg, transfer) => {
            const w = getWorker();
            if (!w) return false;
            w.postMessage(msg, transfer ?? []);
            return true;
        },
        onMessage: (cb) => {
            _listeners.add(cb);
            return () => _listeners.delete(cb);
        },
        terminate: () => {
            _worker?.terminate();
            _worker = null;
        },
    };
}
