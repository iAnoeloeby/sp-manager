/// <reference lib="webworker" />
/**
 * Color-picker heavy-render worker (P4).
 *
 * Two responsibilities, both offloaded from the main thread so a hue-axis
 * change doesn't stall the pointer:
 *
 *   - `paintGradient`  : 25 600 pixels × 1 OKLab matrix + soft-proof LUT read.
 *   - `computeGamutPaths` : 128² marching-squares per warning line, each cell
 *     calling the gamut signed-distance function (which itself runs an
 *     OKLab → linear-RGB matrix). 2 lines per active gamut = ~32K evaluations.
 *
 * The gradient job transfers the `Uint8ClampedArray` ImageData buffer back as
 * a `Transferable` so there's no structured-clone copy. Paths travel back as
 * plain string arrays.
 *
 * Self-contained on purpose: we re-declare `oklchToLinearSrgb`,
 * `linSrgbToLinP3`, `srgbEncode`, `findMaxChroma`, `findCusp`,
 * `gamutSignedDistance`, and the full marching-squares + polyline-walk
 * machinery here rather than import them from `../lib/color`. Reasons:
 *
 *   1. The worker bundle stays small and has no culori dependency to ship
 *      (the operations we use are pure linear algebra + a binary-search
 *      bisection — none of culori's gamut-mapper is needed here, that lives
 *      in `formatColor` on the main thread).
 *   2. We avoid the worker startup overhead of a heavyweight `culori` import.
 *
 * If `lib/color` ever needs to share this code, extract it into
 * `lib/oklch-math.js` and import from both sides. Until then, keeping the
 * worker standalone keeps the surface area small.
 */

function clampByte(x) {
    return x < 0 ? 0 : x > 255 ? 255 : Math.round(x);
}

function oklchToLinearSrgb(l, c, hDeg) {
    const h = (hDeg * Math.PI) / 180;
    const a = c * Math.cos(h);
    const b = c * Math.sin(h);

    const lp = l + 0.3963377774 * a + 0.2158037573 * b;
    const mp = l - 0.1055613458 * a - 0.0638541728 * b;
    const sp = l - 0.0894841775 * a - 1.291485548 * b;

    const L = lp * lp * lp;
    const M = mp * mp * mp;
    const S = sp * sp * sp;

    return {
        r: 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
        g: -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
        b: -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
    };
}

function linSrgbToLinP3(c) {
    return {
        r: 0.8224621 * c.r + 0.177538 * c.g,
        g: 0.0331942 * c.r + 0.9668058 * c.g,
        b: 0.0170828 * c.r + 0.0723976 * c.g + 0.9105196 * c.b,
    };
}

function srgbEncode(v) {
    // Linear sRGB → gamma-encoded sRGB. CSS Color 4 transfer function.
    const a = 0.055;
    return v <= 0.0031308 ? v * 12.92 : (1 + a) * Math.pow(v, 1 / 2.4) - a;
}

function linSrgbToLinRec2020(c) {
    return {
        r: 0.6274039 * c.r + 0.329283 * c.g + 0.0433131 * c.b,
        g: 0.0690973 * c.r + 0.9195404 * c.g + 0.0113623 * c.b,
        b: 0.0163914 * c.r + 0.0880133 * c.g + 0.8955953 * c.b,
    };
}

function gamutSignedDistance(color, gamut) {
    const lin = oklchToLinearSrgb(color.l, color.c, color.h);
    const target =
        gamut === "srgb"
            ? lin
            : gamut === "p3"
              ? linSrgbToLinP3(lin)
              : linSrgbToLinRec2020(lin);
    const lo = -Math.min(target.r, target.g, target.b);
    const hi = Math.max(target.r, target.g, target.b) - 1;
    return Math.max(lo, hi);
}

function findMaxChroma(l, hDeg, gamut) {
    if (l <= 0 || l >= 1) return 0;
    const marginalChroma = 1e-3;
    const inGamut = (c) => {
        const lin = oklchToLinearSrgb(l, c, hDeg);
        const target =
            gamut === "srgb"
                ? lin
                : gamut === "p3"
                  ? linSrgbToLinP3(lin)
                  : linSrgbToLinRec2020(lin);
        return (
            target.r >= 0 &&
            target.r <= 1 &&
            target.g >= 0 &&
            target.g <= 1 &&
            target.b >= 0 &&
            target.b <= 1
        );
    };
    let hi = 0.5;
    while (inGamut(hi) && hi < 2) hi *= 2;
    let lo = 0;
    for (let i = 0; i < 14; i++) {
        const mid = (lo + hi) / 2;
        if (inGamut(mid)) lo = mid;
        else hi = mid;
    }
    return Math.max(0, lo - marginalChroma);
}

function findCusp(hDeg, gamut) {
    let bestL = 0.5;
    let bestC = 0;
    for (let i = 1; i < 32; i++) {
        const l = i / 32;
        const c = findMaxChroma(l, hDeg, gamut);
        if (c > bestC) {
            bestC = c;
            bestL = l;
        }
    }
    const lo = Math.max(0.001, bestL - 1 / 32);
    const hi = Math.min(0.999, bestL + 1 / 32);
    for (let i = 0; i <= 20; i++) {
        const l = lo + ((hi - lo) * i) / 20;
        const c = findMaxChroma(l, hDeg, gamut);
        if (c > bestC) {
            bestC = c;
            bestL = l;
        }
    }
    return { l: bestL, c: bestC };
}

function buildWarpContext(mode, base, gamut, w, h) {
    if (gamut === "none") return { kind: "none" };
    switch (mode) {
        case "oklch-cl": {
            const lut = new Float32Array(h);
            for (let j = 0; j < h; j++) {
                const l = 1 - j / (h - 1);
                lut[j] = findMaxChroma(l, base.h, gamut);
            }
            return { kind: "lut-y", lut };
        }
        case "oklch-hc": {
            const lut = new Float32Array(w);
            for (let i = 0; i < w; i++) {
                const hue = (i / (w - 1)) * 360;
                lut[i] = findMaxChroma(base.l, hue, gamut);
            }
            return { kind: "lut-x", lut };
        }
        case "hsv-sv":
            return { kind: "cusp", cusp: findCusp(base.h, gamut) };
    }
}

function displayMaxChroma(ctx, mode, l, xPx, yPx) {
    switch (ctx.kind) {
        case "none":
            return Number.POSITIVE_INFINITY;
        case "lut-y":
            return ctx.lut[yPx];
        case "lut-x":
            return ctx.lut[xPx];
        case "cusp": {
            if (mode !== "hsv-sv") return Number.POSITIVE_INFINITY;
            const { l: cl, c: cc } = ctx.cusp;
            if (l <= cl) return cc * (l / Math.max(cl, 1e-6));
            return cc * ((1 - l) / Math.max(1 - cl, 1e-6));
        }
    }
}

function isWiderThan(a, b) {
    const rank = { none: 99, rec2020: 3, p3: 2, srgb: 1 };
    return rank[a] > rank[b];
}

function warpedSample(ctx, mode, base, chromaMax, xn, yn, xPx, yPx) {
    if (ctx.kind === "none") {
        switch (mode) {
            case "oklch-cl":
                return [1 - yn, xn * chromaMax, base.h];
            case "hsv-sv": {
                const v = 1 - yn;
                return [v, xn * v * chromaMax, base.h];
            }
            case "oklch-hc":
                return [base.l, (1 - yn) * chromaMax, xn * 360];
        }
    }
    switch (mode) {
        case "oklch-cl": {
            const l = 1 - yn;
            const maxC = ctx.lut[yPx];
            return [l, xn * maxC, base.h];
        }
        case "hsv-sv": {
            const cusp = ctx.cusp;
            const V = 1 - yn;
            const S = xn;
            const l = V * (1 - S * (1 - cusp.l));
            const c = V * S * cusp.c;
            return [l, c, base.h];
        }
        case "oklch-hc": {
            const hue = xn * 360;
            const maxC = ctx.lut[xPx];
            return [base.l, (1 - yn) * maxC, hue];
        }
    }
}

function paintGradient(
    img,
    w,
    h,
    mode,
    base,
    chromaMax,
    gamut,
    canvasIsP3,
    softProof,
) {
    const data = img.data;
    const ctx = buildWarpContext(mode, base, gamut, w, h);
    const displayCap = gamut === "none" ? "none" : canvasIsP3 ? "p3" : "srgb";
    const needsSoftProof =
        softProof && gamut !== "none" && isWiderThan(gamut, displayCap);
    const displayCtx = needsSoftProof
        ? buildWarpContext(mode, base, displayCap, w, h)
        : null;

    for (let yPx = 0; yPx < h; yPx++) {
        const yn = yPx / (h - 1);
        for (let xPx = 0; xPx < w; xPx++) {
            const xn = xPx / (w - 1);
            const [l, c, hue] = warpedSample(
                ctx,
                mode,
                base,
                chromaMax,
                xn,
                yn,
                xPx,
                yPx,
            );
            const cClamped = displayCtx
                ? Math.min(c, displayMaxChroma(displayCtx, mode, l, xPx, yPx))
                : c;
            const lin = oklchToLinearSrgb(l, cClamped, hue);
            const targetLin = canvasIsP3 ? linSrgbToLinP3(lin) : lin;
            const idx = (yPx * w + xPx) * 4;
            data[idx] = clampByte(srgbEncode(targetLin.r) * 255);
            data[idx + 1] = clampByte(srgbEncode(targetLin.g) * 255);
            data[idx + 2] = clampByte(srgbEncode(targetLin.b) * 255);
            data[idx + 3] = 255;
        }
    }
}

/**
 * Raw sampler (no warping) for the `activeGamut === "none"` branch. Mirror of
 * the main thread's `sampleRaw`. Returns a tuple `[l, c, h]` for fast
 * destructuring inside the marching-squares inner loop.
 */
function sampleRaw(mode, base, chromaMax, xn, yn) {
    switch (mode) {
        case "oklch-cl":
            return [1 - yn, xn * chromaMax, base.h];
        case "hsv-sv": {
            const v = 1 - yn;
            return [v, xn * v * chromaMax, base.h];
        }
        case "oklch-hc":
            return [base.l, (1 - yn) * chromaMax, xn * 360];
    }
}

/**
 * Warped sampler for the warning-line marching squares. Mirrors the main
 * thread's `sampleWarpedForLine`; the only difference is that we take the
 * `cusp` as an argument so the caller can reuse one findCusp() result for
 * the whole 16K-cell field. Returns a tuple `[l, c, h]`.
 */
function sampleWarpedForLine(mode, base, activeGamut, xn, yn, cusp) {
    switch (mode) {
        case "oklch-cl": {
            const l = 1 - yn;
            const maxC = findMaxChroma(l, base.h, activeGamut);
            return [l, xn * maxC, base.h];
        }
        case "hsv-sv": {
            const V = 1 - yn;
            const S = xn;
            const l = V * (1 - S * (1 - cusp.l));
            const c = V * S * cusp.c;
            return [l, c, base.h];
        }
        case "oklch-hc": {
            const h = xn * 360;
            const maxC = findMaxChroma(base.l, h, activeGamut);
            return [base.l, (1 - yn) * maxC, h];
        }
    }
}

/**
 * Full marching-squares + polyline-walk. Mirrors the main thread's
 * `computeGamutPaths` exactly so the worker output is byte-identical to
 * the sync version. Returns an array of SVG path `d` strings.
 */
function computeGamutPaths(mode, base, chromaMax, warningGamut, activeGamut) {
    const N = 128;
    const stride = N + 1;
    const sd = new Float32Array(stride * stride);
    // Precompute hsv-sv's cusp once; without this the 16 384 grid samples
    // would each rebuild it (52 findMaxChroma calls each → ~850 K total).
    const cusp =
        mode === "hsv-sv" && activeGamut !== "none"
            ? findCusp(base.h, activeGamut)
            : null;
    for (let j = 0; j <= N; j++) {
        const yn = j / N;
        for (let i = 0; i <= N; i++) {
            const xn = i / N;
            const [l, c, h] =
                activeGamut === "none"
                    ? sampleRaw(mode, base, chromaMax, xn, yn)
                    : sampleWarpedForLine(
                          mode,
                          base,
                          activeGamut,
                          xn,
                          yn,
                          cusp,
                      );
            sd[j * stride + i] = gamutSignedDistance(
                { l, c, h, alpha: 1 },
                warningGamut,
            );
        }
    }

    const interp = (ax, ay, av, bx, by, bv) => {
        const t = av / (av - bv);
        return [ax + (bx - ax) * t, ay + (by - ay) * t];
    };

    const segs = []; // flat: [ax, ay, bx, by, ax, ay, bx, by, ...]
    const pushSeg = (a, b) => {
        if (a[0] === b[0] && a[1] === b[1]) return;
        segs.push(a[0], a[1], b[0], b[1]);
    };
    for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
            const aTL = sd[j * stride + i];
            const aTR = sd[j * stride + i + 1];
            const aBL = sd[(j + 1) * stride + i];
            const aBR = sd[(j + 1) * stride + i + 1];
            const code =
                (aTL > 0 ? 8 : 0) |
                (aTR > 0 ? 4 : 0) |
                (aBR > 0 ? 2 : 0) |
                (aBL > 0 ? 1 : 0);
            if (code === 0 || code === 15) continue;
            const x0 = i / N;
            const y0 = j / N;
            const x1 = (i + 1) / N;
            const y1 = (j + 1) / N;
            const top = () => interp(x0, y0, aTL, x1, y0, aTR);
            const right = () => interp(x1, y0, aTR, x1, y1, aBR);
            const bottom = () => interp(x0, y1, aBL, x1, y1, aBR);
            const left = () => interp(x0, y0, aTL, x0, y1, aBL);
            switch (code) {
                case 1:
                case 14:
                    pushSeg(left(), bottom());
                    break;
                case 2:
                case 13:
                    pushSeg(bottom(), right());
                    break;
                case 3:
                case 12:
                    pushSeg(left(), right());
                    break;
                case 4:
                case 11:
                    pushSeg(top(), right());
                    break;
                case 6:
                case 9:
                    pushSeg(top(), bottom());
                    break;
                case 7:
                case 8:
                    pushSeg(left(), top());
                    break;
                case 5:
                    pushSeg(left(), top());
                    pushSeg(bottom(), right());
                    break;
                case 10:
                    pushSeg(left(), bottom());
                    pushSeg(top(), right());
                    break;
            }
        }
    }

    const segCount = segs.length / 4;
    if (segCount === 0) return [];

    // Build endpoint map keyed by quantized coords. Endpoints from adjacent cells
    // share the same `interp` inputs along their shared edge, so they collide
    // exactly — quantization only protects against float ULP drift.
    const Q = 1_000_000;
    const key = (x, y) => `${(x * Q) | 0},${(y * Q) | 0}`;
    const endpointMap = new Map();
    const addEp = (k, e) => {
        const arr = endpointMap.get(k);
        if (arr) arr.push(e);
        else endpointMap.set(k, [e]);
    };
    for (let s = 0; s < segCount; s++) {
        const o = s * 4;
        addEp(key(segs[o], segs[o + 1]), { seg: s, end: 0 });
        addEp(key(segs[o + 2], segs[o + 3]), { seg: s, end: 1 });
    }

    const used = new Uint8Array(segCount);
    const popEndpointAt = (k) => {
        const arr = endpointMap.get(k);
        if (!arr) return null;
        while (arr.length > 0) {
            const e = arr.pop();
            if (!used[e.seg]) return e;
        }
        return null;
    };

    const polylines = [];
    for (let start = 0; start < segCount; start++) {
        if (used[start]) continue;
        used[start] = 1;
        const o = start * 4;
        const pts = [segs[o], segs[o + 1], segs[o + 2], segs[o + 3]];

        // Extend forward off the tail.
        while (true) {
            const tx = pts[pts.length - 2];
            const ty = pts[pts.length - 1];
            const e = popEndpointAt(key(tx, ty));
            if (!e) break;
            used[e.seg] = 1;
            const no = e.seg * 4;
            if (e.end === 0) pts.push(segs[no + 2], segs[no + 3]);
            else pts.push(segs[no], segs[no + 1]);
        }
        // Extend backward off the head.
        while (true) {
            const hx = pts[0];
            const hy = pts[1];
            const e = popEndpointAt(key(hx, hy));
            if (!e) break;
            used[e.seg] = 1;
            const no = e.seg * 4;
            if (e.end === 0) pts.unshift(segs[no + 2], segs[no + 3]);
            else pts.unshift(segs[no], segs[no + 1]);
        }

        polylines.push(pts);
    }

    const fmt = (v) => v.toFixed(5);
    return polylines.map((pts) => {
        const last = pts.length;
        const closed =
            last >= 4 && pts[0] === pts[last - 2] && pts[1] === pts[last - 1];
        let d = `M${fmt(pts[0])},${fmt(pts[1])}`;
        for (let i = 2; i < last; i += 2) {
            d += `L${fmt(pts[i])},${fmt(pts[i + 1])}`;
        }
        if (closed) d += "Z";
        return d;
    });
}

self.onmessage = (e) => {
    const { type, id, payload } = e.data;
    if (type === "paintGradient") {
        const {
            buffer,
            w,
            h,
            mode,
            base,
            chromaMax,
            gamut,
            canvasIsP3,
            softProof,
        } = payload;
        const data = new Uint8ClampedArray(buffer);
        const img = { data, width: w, height: h };
        paintGradient(
            img,
            w,
            h,
            mode,
            base,
            chromaMax,
            gamut,
            canvasIsP3,
            softProof,
        );
        // Transfer the buffer back so the main thread gets a zero-copy handoff.
        self.postMessage(
            { type: "paintGradient", id, buffer: data.buffer, w, h },
            [data.buffer],
        );
        return;
    }
    if (type === "computeGamutPaths") {
        const { mode, base, chromaMax, warningGamut, activeGamut } = payload;
        const paths = computeGamutPaths(
            mode,
            base,
            chromaMax,
            warningGamut,
            activeGamut,
        );
        self.postMessage({ type: "computeGamutPaths", id, paths });
        return;
    }
};
