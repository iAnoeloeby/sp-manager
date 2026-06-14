import React, { useMemo, useState } from "react";
import { useShortcuts } from "../hooks/useShortcuts";

/**
 * Bentuk minimal sebuah shortcut yang dibutuhkan oleh komponen ini.
 * Disalin di sini (bukan di-import dari `ShortcutMenu.jsx`) supaya file
 * `ShortcutLogo` tidak punya dependensi tak-terlihat.
 *
 * @typedef {Object} Shortcut
 * @property {string} id
 * @property {string} url
 * @property {string} [title]
 */

/**
 * Logo favicon untuk sebuah shortcut. Kalau favicon gagal di-load
 * (error / host tidak punya ikon), fallback ke huruf pertama dari
 * judul / hostname.
 *
 * @param {{ shortcut: Shortcut }} props
 */
export function ShortcutIcon({ shortcut }) {
    const [failed, setFailed] = useState(false);
    const host = useMemo(() => getHost(shortcut.url), [shortcut.url]);
    const fallback =
        (shortcut.title || host || "?").trim().charAt(0).toUpperCase() || "?";
    const faviconUrl = getFaviconUrl(shortcut.url);

    if (!faviconUrl || failed) {
        return fallback;
    }

    return (
        <img
            src={faviconUrl}
            alt=""
            className="h-10 w-10 object-contain z-1"
            onError={() => setFailed(true)}
        />
    );
}

/**
 *
 * @typedef {Object} ShortcutLogoProps
 * @property {Shortcut} shortcut
 * @returns {JSX.Element}
 */

/**
 * Ambil hostname kanonik dari sebuah URL (strip "www.").
 * @param {string} url
 * @returns {string}
 */
function getHost(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

/**
 * Bangun URL favicon via DuckDuckGo.
 * @param {string} url
 * @returns {string}
 */
function getFaviconUrl(url) {
    try {
        return `https://icons.duckduckgo.com/ip3/${getHost(url)}.ico`;
    } catch {
        return "";
    }
}
