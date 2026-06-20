import {
    searchEngines,
    defaultSearchEngineId,
} from "@/constants/searchEngines";

function getEngine(engineId) {
    return (
        searchEngines.find((engine) => engine.id === engineId) ||
        searchEngines.find((engine) => engine.id === defaultSearchEngineId)
    );
}

export function buildSearchUrl(query, engineId = defaultSearchEngineId) {
    const trimmed = String(query || "").trim();
    if (!trimmed) return "";

    const engine = getEngine(engineId);
    return `${engine.baseUrl}${encodeURIComponent(trimmed)}`;
}

export function executeSearch(query, engineId = defaultSearchEngineId) {
    const url = buildSearchUrl(query, engineId);
    if (url) {
        window.location.assign(url);
    }

    return url;
}
