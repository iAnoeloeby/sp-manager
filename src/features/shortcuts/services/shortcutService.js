import { storageKeys } from "@/constants/storageKeys";
import storageService from "@/services/storageService";

function createId() {
    return `shortcut-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Normalize user-entered URL into a canonical full URL.
 * - Accepts inputs with or without protocol (https://)
 * - Accepts inputs with or without "www." prefix
 * - Always returns a full https://... URL, or null if invalid format
 */
export function normalizeUrl(input) {
    if (input == null) return null;

    let url = String(input).trim();
    if (!url) return null;

    // Strip leading protocol (http/https/etc)
    url = url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");

    // Split host and the rest (path, query, fragment)
    const match = url.match(/^([^/?#\s]+)([\s\S]*)?$/);
    if (!match) return null;

    let host = match[1];
    let rest = match[2] || "";

    // Strip leading "www." from host (we re-add it canonically)
    host = host.replace(/^www\./i, "");

    // Host must have at least one dot and only valid chars
    if (
        !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(
            host,
        )
    ) {
        return null;
    }

    // Trim trailing slashes from rest
    rest = rest.replace(/\/+$/, "");

    const fullUrl = `https://www.${host}${rest}`;

    // Final sanity check using URL parser
    try {
        // eslint-disable-next-line no-new
        new URL(fullUrl);
    } catch (error) {
        return null;
    }

    return fullUrl;
}

/**
 * Check if a URL is reachable. Uses fetch with `mode: "no-cors"`
 * to bypass CORS restrictions — any reachable host will resolve
 * (with an opaque response), while DNS / network / timeout errors
 * will reject.
 */
export async function checkUrlReachable(url, timeoutMs = 6000) {
    if (!url) return false;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        await fetch(url, {
            mode: "no-cors",
            cache: "no-store",
            redirect: "follow",
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Resolve a user input into a working, full URL.
 * Tries `https://www.X` first (canonical form), then falls back to
 * `https://X` if the www variant is not reachable. This is needed
 * for sites that don't serve the www subdomain.
 *
 * Returns:
 *   { url: string|null, reason: "format" | "unreachable" | null }
 */
export async function resolveValidUrl(input, timeoutMs = 6000) {
    const withWww = normalizeUrl(input);
    if (!withWww) return { url: null, reason: "format" };

    if (await checkUrlReachable(withWww, timeoutMs)) {
        return { url: withWww, reason: null };
    }

    const withoutWww = withWww.replace("https://www.", "https://");
    if (withoutWww !== withWww) {
        if (await checkUrlReachable(withoutWww, timeoutMs)) {
            return { url: withoutWww, reason: null };
        }
    }

    return { url: null, reason: "unreachable" };
}

export function normalizeShortcut(shortcut = {}) {
    const title = String(shortcut.title || "").trim();
    const url = normalizeUrl(shortcut.url);

    if (!title || !url) return null;

    return {
        id: shortcut.id || createId(),
        title,
        url,
    };
}

export function normalizeShortcuts(shortcuts = []) {
    return Array.isArray(shortcuts)
        ? shortcuts
              .map((shortcut) => normalizeShortcut(shortcut))
              .filter(Boolean)
        : [];
}

export async function loadShortcuts() {
    const stored = await storageService.getItem(storageKeys.shortcuts, []);
    return normalizeShortcuts(stored);
}

export async function saveShortcuts(shortcuts) {
    const normalized = normalizeShortcuts(shortcuts);
    await storageService.setItem(storageKeys.shortcuts, normalized);
    return normalized;
}

export function upsertShortcut(shortcuts, nextShortcut) {
    const normalized = normalizeShortcut(nextShortcut);
    if (!normalized) return shortcuts;

    const exists = shortcuts.some((shortcut) => shortcut.id === normalized.id);
    if (!exists) return [...shortcuts, normalized];

    return shortcuts.map((shortcut) =>
        shortcut.id === normalized.id ? normalized : shortcut,
    );
}

export function updateShortcut(shortcuts, shortcutId, patch) {
    return shortcuts
        .map((shortcut) => {
            if (shortcut.id !== shortcutId) return shortcut;
            return normalizeShortcut({
                ...shortcut,
                ...patch,
                id: shortcut.id,
            });
        })
        .filter(Boolean);
}

export function removeShortcut(shortcuts, shortcutId) {
    return shortcuts.filter((shortcut) => shortcut.id !== shortcutId);
}
