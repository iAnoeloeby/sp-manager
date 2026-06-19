import { defaultSearchEngineId } from "./searchEngines";

export const defaultSettings = {
    displayName: "",
    mode: "light",
    accent: "",
    radius: 10,
    borderRadius: {
        mode: "default", //default(md) | none | sm | md | lg | xl | custom
        topLeft: null,
        topRight: null,
        bottomLeft: null,
        bottomRight: null,
    },
    searchEngine: defaultSearchEngineId,
    clockFormat: "24h",
    showSeconds: false,
    background: {
        mode: "default",
        value: "",
        value2: "",
        imageUrl: "",
        overlay: 0.45,
    },
};
