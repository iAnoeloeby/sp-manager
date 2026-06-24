import { storageKeys } from "@/constants/storageKeys";
import storageService from "@/services/storageService";
import { normalizeUrl } from "@/services/urlService";

function createId() {
    return `shortcut-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
