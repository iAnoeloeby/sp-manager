import React, { useEffect, useState } from "react";

import { resolveFavicon } from "@/features/shortcuts/services/faviconService";

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
 * Status internal untuk async URL resolution.
 *
 * - "loading" : sedang cek reachability + extract hostname
 * - "ok"      : URL valid, host tersedia
 * - "empty"   : input kosong / tidak valid
 * - "failed"  : network / format error
 *
 * @typedef {"loading" | "ok" | "empty" | "failed"} ResolveStatus
 */

/**
 * Logo favicon untuk sebuah shortcut. Kalau favicon gagal di-load
 * (error / host tidak punya ikon), fallback ke huruf pertama dari
 * judul / hostname.
 *
 * @param {{ shortcut: Shortcut }} props
 */
export function ShortcutIcon({ shortcut }) {
    const [faviconUrl, setFaviconUrl] = useState(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let active = true;

        setFailed(false);
        setFaviconUrl(null);

        if (!shortcut?.url) return;

        resolveFavicon(shortcut.url).then((url) => {
            if (!active) return;
            setFaviconUrl(url);
        });

        return () => {
            active = false;
        };
    }, [shortcut?.url]);

    if (!faviconUrl || failed) {
        const fallbackChar =
            (shortcut?.title ?? shortcut?.url ?? "")
                .trim()
                .charAt(0)
                .toUpperCase() || "?";

        return (
            <div className="h-7.5 w-7.5 aspect-square rounded-full bg-muted/40 flex items-center justify-center z-1">
                <span className="text-md font-extrabold text-foreground/80">
                    {fallbackChar}
                </span>
            </div>
        );
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
