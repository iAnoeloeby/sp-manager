/**
 * @file URL normalization, reachability check, and extraction.
 */

/**
 * Normalize a user-entered URL to `https://www.{host}{path}`.
 * Strips protocol and www, validates host format, returns null on bad input.
 *
 * @param {string} input - "github.com", "https://www.notion.so/path", etc.
 * @returns {string | null} Canonical URL or null
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
 * Check if a URL is reachable via `fetch` with `mode: "no-cors"`.
 * Returns true if the host responds, false on timeout or DNS failure.
 *
 * @param {string} url - Full URL to check
 * @param {number} [timeoutMs=6000]
 * @returns {Promise<boolean>}
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
 * Resolve user input to a reachable URL.
 * Tries `https://www.{host}` first, falls back to `https://{host}` if www variant is unreachable.
 *
 * @param {string} input - Raw user input
 * @param {number} [timeoutMs=6000]
 * @returns {Promise<{ url: string | null, reason: "format" | "unreachable" | null }>}
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

/**
 * Extract bare hostname from user input. "github.com/tailwind" → "github.com".
 * Pure / sync. Safe to call during render.
 *
 * @param {string} input
 * @returns {string | null} Hostname without www, or null
 */
export function extractHostname(input) {
    const full = normalizeUrl(input);
    if (!full) return null;
    try {
        return new URL(full).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
}
