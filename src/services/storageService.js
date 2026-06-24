/**
 * @file Domain storage API.
 * Layer above storageAdapter — knows about zones, sections, and items.
 * Pure functions (upsert/update/remove) are testable without storage.
 *
 * Flow:  Component → storageService → storageAdapter → chrome.storage / localStorage
 */

import storageAdapter from "./storageAdapter";
import { storageKeys } from "@/constants/storageKeys";

// ── Zone mapping ────────────────────────────────

/** @type {Record<string, string>} Maps zone name → storage key. */
const ZONE_KEY = {
    leftRail: storageKeys.leftRailItems,
    rightRail: storageKeys.rightRailItems,
    dock: storageKeys.dockItems,
    workspace: storageKeys.workspaceItems,
};

// ── Single value ops ────────────────────────────

/**
 * Read a value by storage key.
 *
 * @param {string} key
 * @param {any} [fallback=null]
 * @returns {Promise<any>}
 */
export async function get(key, fallback = null) {
    return storageAdapter.getItem(key, fallback);
}

/**
 * Write a value by storage key.
 *
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
export async function set(key, value) {
    return storageAdapter.setItem(key, value);
}

/**
 * Delete a value by storage key.
 *
 * @param {string} key
 * @returns {Promise<void>}
 */
export async function remove(key) {
    return storageAdapter.removeItem(key);
}

// ── Zone ops ────────────────────────────────────

/** @typedef {"leftRail"|"rightRail"|"dock"|"workspace"} Zone */

/**
 * Load all items/sections stored in a single zone.
 *
 * @param {Zone} zone
 * @returns {Promise<Array>}
 */
export async function loadZone(zone) {
    const key = ZONE_KEY[zone];
    return storageAdapter.getItem(key, []);
}

/**
 * Save all items/sections for a single zone.
 *
 * @param {Zone} zone
 * @param {Array} items
 * @returns {Promise<void>}
 */
export async function saveZone(zone, items) {
    const key = ZONE_KEY[zone];
    return storageAdapter.setItem(key, items);
}

/**
 * Load every zone in parallel.
 *
 * @returns {Promise<Record<string, Array>>}
 */
export async function loadAllZones() {
    const results = await Promise.all(
        Object.keys(ZONE_KEY).map(async (zone) => {
            const items = await loadZone(/** @type {Zone} */ (zone));
            return { zone, items };
        }),
    );
    return Object.fromEntries(results.map((r) => [r.zone, r.items]));
}

/**
 * Save every zone in parallel.
 *
 * @param {Record<string, Array>} zones
 * @returns {Promise<void>}
 */
export async function saveAllZones(zones) {
    await Promise.all(
        Object.entries(zones).map(([zone, items]) => saveZone(/** @type {Zone} */ (zone), items)),
    );
}

// ── Item ops (pure, no storage) ─────────────────

let _idCounter = 0;

/** @returns {string} */
function uid() {
    return `${Date.now()}-${++_idCounter}`;
}

/**
 * Add or update an item by id.
 * Appends when id is not found, merges when it is.
 * Generates an id when the item has none.
 *
 * @param {import("@/contexts/LayoutContext").LayoutItem[]} items
 * @param {import("@/contexts/LayoutContext").LayoutItem} item
 * @returns {import("@/contexts/LayoutContext").LayoutItem[]}
 */
export function upsertItem(items, item) {
    const exists = items.some((i) => i.id === item.id);
    if (!exists) return [...items, { ...item, id: item.id || uid() }];
    return items.map((i) => (i.id === item.id ? { ...i, ...item } : i));
}

/**
 * Patch an item by id.
 *
 * @param {import("@/contexts/LayoutContext").LayoutItem[]} items
 * @param {string} id
 * @param {Partial<import("@/contexts/LayoutContext").LayoutItem>} patch
 * @returns {import("@/contexts/LayoutContext").LayoutItem[]}
 */
export function updateItemById(items, id, patch) {
    return items.map((i) => (i.id === id ? { ...i, ...patch } : i));
}

/**
 * Remove an item by id.
 *
 * @param {import("@/contexts/LayoutContext").LayoutItem[]} items
 * @param {string} id
 * @returns {import("@/contexts/LayoutContext").LayoutItem[]}
 */
export function removeItemById(items, id) {
    return items.filter((i) => i.id !== id);
}

// ── Section ops (workspace-specific) ────────────

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {string} label
 * @property {import("@/contexts/LayoutContext").LayoutItem[]} items
 */

/**
 * Add or update a section by id.
 *
 * @param {Section[]} sections
 * @param {Section} section
 * @returns {Section[]}
 */
export function upsertSection(sections, section) {
    const exists = sections.some((s) => s.id === section.id);
    if (!exists) return [...sections, { ...section, items: section.items || [] }];
    return sections.map((s) => (s.id === section.id ? { ...s, ...section } : s));
}

/**
 * Remove a section by id.
 *
 * @param {Section[]} sections
 * @param {string} sectionId
 * @returns {Section[]}
 */
export function removeSection(sections, sectionId) {
    return sections.filter((s) => s.id !== sectionId);
}

/**
 * Add or update an item inside a section.
 *
 * @param {Section[]} sections
 * @param {string} sectionId
 * @param {import("@/contexts/LayoutContext").LayoutItem} item
 * @returns {Section[]}
 */
export function addItemToSection(sections, sectionId, item) {
    return sections.map((s) =>
        s.id === sectionId
            ? { ...s, items: upsertItem(s.items, item) }
            : s,
    );
}

/**
 * Remove an item from a section.
 *
 * @param {Section[]} sections
 * @param {string} sectionId
 * @param {string} itemId
 * @returns {Section[]}
 */
export function removeItemFromSection(sections, sectionId, itemId) {
    return sections.map((s) =>
        s.id === sectionId
            ? { ...s, items: removeItemById(s.items, itemId) }
            : s,
    );
}

/**
 * Patch an item inside a section.
 *
 * @param {Section[]} sections
 * @param {string} sectionId
 * @param {string} itemId
 * @param {Partial<import("@/contexts/LayoutContext").LayoutItem>} patch
 * @returns {Section[]}
 */
export function updateItemInSection(sections, sectionId, itemId, patch) {
    return sections.map((s) =>
        s.id === sectionId
            ? { ...s, items: updateItemById(s.items, itemId, patch) }
            : s,
    );
}

// ── Default export (named imports preferred) ────

const storageService = {
    get,
    set,
    remove,
    loadZone,
    saveZone,
    loadAllZones,
    saveAllZones,
    upsertItem,
    updateItemById,
    removeItemById,
    upsertSection,
    removeSection,
    addItemToSection,
    removeItemFromSection,
    updateItemInSection,
};

export default storageService;
