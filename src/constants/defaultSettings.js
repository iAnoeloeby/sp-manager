import { defaultSearchEngineId } from "./searchEngines";

export const defaultSettings = {
  displayName: "",
  mode: "light",
  accent: "",
  radius: 10,
  searchEngine: defaultSearchEngineId,
  clockFormat: "24h",
  showSeconds: false,
  background: {
    type: "default",
    value: "",
    value2: "",
    imageUrl: "",
    overlay: 0.45,
  },
};
