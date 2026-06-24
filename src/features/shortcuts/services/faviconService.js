const faviconBuild = {
    duckduckgo(hostname) {
        return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
    },

    google(hostname) {
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    },

    besticon(hostname) {
        return `https://besticon-demo.herokuapp.com/icon?url=${hostname}&size=80..120..200`;
    },

    iconHorse(hostname) {
        return `https://icon.horse/icon/${hostname}`;
    },

    faviconExtractor(hostname) {
        return `https://www.faviconextractor.com/favicon/${hostname}`;
    },
};

/**
 * @param {string | URL} url
 * @param {"duckduckgo" | "google" | "besticon" | "iconHorse" | "faviconExtractor"} provider
 *
 * @returns {Promise<string | null>}
 */
export async function resolveFavicon(url, provider = "duckduckgo") {
    try {
        const hostname = new URL(url).hostname;

        return await (
            faviconBuild[provider] ?? faviconBuild.duckduckgo
        )(hostname);
    } catch {
        return null;
    }
}
