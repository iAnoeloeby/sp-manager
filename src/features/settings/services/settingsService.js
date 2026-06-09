import { defaultSettings } from "../../../constants/defaultSettings";
import {
  defaultSearchEngineId,
  searchEngines,
} from "../../../constants/searchEngines";
import { storageKeys } from "../../../constants/storageKeys";
import storageService from "../../../services/storageService";
import { buildBackgroundImage } from "../utils/backgroundUtils";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeMode(value) {
  return value === "light" ? "light" : "dark";
}

function normalizeBackground(background = {}) {
  const type =
    background.type === "default" ||
    background.type === "solid" ||
    background.type === "image"
      ? background.type
      : "gradient";

  const source = background.source === "live" ? "live" : "custom";

  return {
    type,
    source: type === "image" ? source : undefined,
    value:
      typeof background.value === "string" &&
      background.value.trim() &&
      background.value !== "default"
        ? background.value.trim()
        : defaultSettings.background.value,
    value2:
      typeof background.value2 === "string" && background.value2.trim()
        ? background.value2.trim()
        : defaultSettings.background.value2,
    imageUrl:
      typeof background.imageUrl === "string" ? background.imageUrl.trim() : "",
    overlay: Number.isFinite(Number(background.overlay))
      ? Math.min(1, Math.max(0, Number(background.overlay)))
      : defaultSettings.background.overlay,
  };
}

export function createDefaultSettings() {
  return clone(defaultSettings);
}

export function normalizeSettings(input = {}) {
  const searchEngine = searchEngines.some(
    (engine) => engine.id === input.searchEngine,
  )
    ? input.searchEngine
    : defaultSearchEngineId;

  return {
    ...clone(defaultSettings),
    ...input,
    mode: normalizeMode(input.mode),
    accent:
      typeof input.accent === "string" && input.accent.trim()
        ? input.accent.trim()
        : defaultSettings.accent,
    radius: Number.isFinite(Number(input.radius))
      ? Number(input.radius)
      : defaultSettings.radius,
    displayName:
      typeof input.displayName === "string" ? input.displayName.trim() : "",
    searchEngine,
    clockFormat: input.clockFormat === "12h" ? "12h" : "24h",
    showSeconds: Boolean(input.showSeconds),
    background: normalizeBackground(input.background),
  };
}

export async function loadSettings() {
  const stored = await storageService.getItem(storageKeys.settings, null);
  return normalizeSettings(stored || {});
}

export async function saveSettings(settings) {
  const normalized = normalizeSettings(settings);
  await storageService.setItem(storageKeys.settings, normalized);
  return normalized;
}

export function applySettingsToDocument(settings) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const normalized = normalizeSettings(settings);

  root.classList.toggle("dark", normalized.mode === "dark");

  root.style.setProperty(
    "--brand-accent",
    normalized.accent || "var(--accent)",
  );
  root.style.setProperty(
    "--brand-accent-foreground",
    normalized.accent ? "oklch(98.5% 0 0)" : "var(--accent-foreground)",
  );
  root.style.setProperty(
    "--app-accent",
    normalized.accent || "var(--accent)",
  );
  root.style.setProperty("--app-radius", `${normalized.radius}px`);
  root.style.setProperty("--radius", `${normalized.radius / 16}rem`);
  root.style.setProperty(
    "--page-background",
    buildBackgroundImage(normalized.background, normalized.mode),
  );
}
