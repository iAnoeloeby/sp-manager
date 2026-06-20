import { storageKeys } from "@/constants/storageKeys";
import { normalizeUrl } from "@/features/shortcuts/services/shortcutService";

import storageService from "@/services/storageService";

/**
 * @typedef {"button" | "link" | "shortcut"} DockItemType
 *
 * Reserved for button-specific configuration. Shape TBD.
 * @typedef {Record<string, any>} DockItemConfig
 *
 * @typedef {Object} DockItem
 * @property {string} id
 * @property {DockItemType} type
 * @property {string} name
 * @property {string} url
 * @property {DockItemConfig} config
 *
 * Each layout area persists its own list of items under its own
 * storage key (see `storageKeys`).
 *
 * @typedef {Object} DockItemsBundle
 * @property {DockItem[]} leftRailItems
 * @property {DockItem[]} rightRailItems
 * @property {DockItem[]} dockItems
 * @property {DockItem[]} workspaceItems
 */

/** @type {DockItemType[]} */
export const DOCK_ITEM_TYPES = ["button", "link", "shortcut"];

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isPlainObject(value) {
    return value != null && typeof value === "object" && !Array.isArray(value);
}

/**
 * @returns {string}
 */
function createId() {
    return `dock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * @param {unknown} value
 * @returns {DockItemType | null}
 */
function normalizeType(value) {
    if (typeof value !== "string") return null;
    return DOCK_ITEM_TYPES.some((t) => t === value)
        ? /** @type {DockItemType} */ (value)
        : null;
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeName(value) {
    if (typeof value !== "string") return "";
    return value.trim();
}

/**
 * Normalize a single dock item.
 *
 * Required shape:
 *   { id, type, name, url }
 *
 * - `type` is one of: "button" | "link" | "shortcut"
 * - `url` is normalized to a canonical full https URL (or null if invalid)
 * - `config` is reserved for button-specific configuration and is left as-is
 *   for now (shape TBD). It is always an object.
 *
 * Returns null when the input is invalid.
 *
 * @param {Partial<DockItem> & { type?: string }} item
 * @returns {DockItem | null}
 */
export function normalizeDockItem(item = {}) {
    if (!isPlainObject(item)) return null;

    const type = normalizeType(item.type);
    if (!type) return null;

    const name = normalizeName(item.name);
    // For "shortcut"/"link" we require a valid URL; for "button" we allow
    // an empty URL (button may not navigate), but reject invalid formats.
    /** @type {string} */
    let url = "";
    if (type === "button") {
        url = normalizeUrl(item.url) || "";
        if (item.url && !url) return null;
    } else {
        const normalized = normalizeUrl(item.url);
        if (!normalized) return null;
        url = normalized;
    }

    /** @type {Record<string, any>} */
    const config = isPlainObject(item.config)
        ? { .../** @type {Record<string, any>} */ (item.config) }
        : {};

    return {
        id: typeof item.id === "string" && item.id ? item.id : createId(),
        type,
        name,
        url,
        config,
    };
}

/**
 * @param {unknown} items
 * @returns {DockItem[]}
 */
export function normalizeDockItems(items = []) {
    if (!Array.isArray(items)) return [];
    return items
        .map((item) => normalizeDockItem(item))
        .filter((item) => item != null);
}

/**
 * @param {keyof DockItemsBundle} slot
 * @returns {string}
 */
function getStorageKey(slot) {
    switch (slot) {
        case "leftRailItems":
            return storageKeys.leftRailItems;
        case "rightRailItems":
            return storageKeys.rightRailItems;
        case "dockItems":
            return storageKeys.dockItems;
        case "workspaceItems":
            return storageKeys.workspaceItems;
        default:
            return "";
    }
}

/**
 * @param {keyof DockItemsBundle} slot
 * @returns {Promise<DockItem[]>}
 */
export async function loadSlotItems(slot) {
    const key = getStorageKey(slot);
    if (!key) return [];
    const stored = await storageService.getItem(key, null);
    return normalizeDockItems(stored || []);
}

/**
 * @param {keyof DockItemsBundle} slot
 * @param {DockItem[]} items
 * @returns {Promise<DockItem[]>}
 */
export async function saveSlotItems(slot, items) {
    const key = getStorageKey(slot);
    if (!key) return [];
    const normalized = normalizeDockItems(items);
    await storageService.setItem(key, normalized);
    return normalized;
}

/**
 * Add or update a single item inside a slot's item list.
 * Returns a new list (immutable update).
 *
 * @param {DockItem[]} items
 * @param {Partial<DockItem> & { type: DockItemType }} nextItem
 * @returns {DockItem[]}
 */
export function upsertSlotItem(items, nextItem) {
    const normalized = normalizeDockItem(nextItem);
    if (!normalized) return items;

    const list = Array.isArray(items) ? items : [];
    const exists = list.some((entry) => entry.id === normalized.id);
    if (exists) {
        return list.map((entry) =>
            entry.id === normalized.id ? normalized : entry,
        );
    }
    return [...list, normalized];
}

/**
 * Patch a single item inside a slot's item list.
 * @param {DockItem[]} items
 * @param {string} itemId
 * @param {Partial<DockItem>} patch
 * @returns {DockItem[]}
 */
export function updateSlotItem(items, itemId, patch) {
    if (!itemId) return items;
    const list = Array.isArray(items) ? items : [];
    return list
        .map((entry) => {
            if (entry.id !== itemId) return entry;
            return normalizeDockItem({ ...entry, ...patch, id: entry.id });
        })
        .filter((entry) => entry != null);
}

/**
 * Remove a single item from a slot's item list.
 * @param {DockItem[]} items
 * @param {string} itemId
 * @returns {DockItem[]}
 */
export function removeSlotItem(items, itemId) {
    if (!itemId) return items;
    const list = Array.isArray(items) ? items : [];
    return list.filter((entry) => entry.id !== itemId);
}

const dockItemsService = {
    DOCK_ITEM_TYPES,
    loadSlotItems,
    saveSlotItems,
    normalizeDockItem,
    normalizeDockItems,
    upsertSlotItem,
    updateSlotItem,
    removeSlotItem,
};

export default dockItemsService;
