import React from "react";

import {
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
} from "@/services/storageService";
import {
    defaultDockItems,
    defaultLeftRailItems,
    defaultRightRailItems,
    defaultWorkspaceItems,
} from "@/constants/defaultLayoutItems";

// ponytail: single effect saves all zones any time anything changes.
// Per-zone save effects if storage-write profiling shows a need.

/** @typedef {"leftRail"|"rightRail"|"dock"|"workspace"} Zone */

/**
 * @typedef {Object} LayoutItem
 * @property {string} id
 * @property {"shortcut"|"tool"|"action"|string} type
 * @property {string} title
 * @property {string} [icon]
 * @property {string} [url]
 * @property {string} [onClick]
 * @property {string} [dataUrl]
 * @property {Record<string,any>} [options]
 * @property {Record<string,any>} [config]
 * @property {number} [cols]
 * @property {number} [rows]
 * @property {string} [variant]   -- "icon"|"text"|"icon-text" for tool widgets
 */

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {string} label
 * @property {LayoutItem[]} items
 */

const ZONE_DEFAULTS = {
    leftRail: /** @type {LayoutItem[]} */ (defaultLeftRailItems),
    rightRail: /** @type {LayoutItem[]} */ (defaultRightRailItems),
    dock: /** @type {LayoutItem[]} */ (defaultDockItems),
    workspace: /** @type {Section[]} */ (defaultWorkspaceItems),
};

/**
 * @typedef {Object} LayoutContextValue
 * @property {boolean} loading
 * @property {LayoutItem[]} leftRailItems
 * @property {LayoutItem[]} rightRailItems
 * @property {LayoutItem[]} dockItems
 * @property {Section[]} workspaceItems
 * @property {(zone: Zone, item: Partial<LayoutItem>) => void} addItem
 * @property {(zone: Zone, id: string) => void} deleteItem
 * @property {(zone: Zone, id: string, patch: Partial<LayoutItem>) => void} updateItem
 * @property {(section: Section) => void} addSection
 * @property {(sectionId: string) => void} deleteSection
 * @property {(sectionId: string, item: Partial<LayoutItem>) => void} addSectionItem
 * @property {(sectionId: string, itemId: string) => void} deleteSectionItem
 * @property {(sectionId: string, itemId: string, patch: Partial<LayoutItem>) => void} updateSectionItem
 */

const LayoutContext = React.createContext(
    /** @type {LayoutContextValue|null} */ (null),
);

export function LayoutProvider({ children }) {
    const [loading, setLoading] = React.useState(true);
    const [items, setItems] = React.useState(
        /** @type {{ leftRail: LayoutItem[], rightRail: LayoutItem[], dock: LayoutItem[], workspace: Section[] }} */ ({
            leftRail: [],
            rightRail: [],
            dock: [],
            workspace: [],
        }),
    );

    // Load all zones from storage on mount, fall back to defaults
    React.useEffect(() => {
        let active = true;
        (async () => {
            const stored = await loadAllZones();
            if (!active) return;

            // Merge with defaults — stored value wins if non-empty
            const zones = /** @type {Zone[]} */ (Object.keys(ZONE_DEFAULTS));
            const merged = Object.fromEntries(
                zones.map((zone) => [
                    zone,
                    Array.isArray(stored[zone]) && stored[zone].length > 0
                        ? stored[zone]
                        : ZONE_DEFAULTS[zone],
                ]),
            );

            setItems(/** @type {{ leftRail: LayoutItem[], rightRail: LayoutItem[], dock: LayoutItem[], workspace: Section[] }} */ (merged));
            setLoading(false);
        })();
        return () => {
            active = false;
        };
    }, []);

    // ponytail: single effect writes all zones any time items changes.
    const firstLoad = React.useRef(true);
    React.useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        if (loading) return;
        saveAllZones(items);
    }, [loading, items]);

    // ── Flat zone ops ────────────────────────────────

    /** @type {(zone: Zone, item: Partial<LayoutItem>) => void} */
    const addItem = React.useCallback((zone, item) => {
        setItems((prev) => ({
            ...prev,
            [zone]: upsertItem(prev[zone], item),
        }));
    }, []);

    /** @type {(zone: Zone, id: string) => void} */
    const deleteItem = React.useCallback((zone, id) => {
        setItems((prev) => ({
            ...prev,
            [zone]: removeItemById(prev[zone], id),
        }));
    }, []);

    /** @type {(zone: Zone, id: string, patch: Partial<LayoutItem>) => void} */
    const updateItem = React.useCallback((zone, id, patch) => {
        setItems((prev) => ({
            ...prev,
            [zone]: updateItemById(prev[zone], id, patch),
        }));
    }, []);

    // ── Workspace section ops ────────────────────────

    /** @type {(section: Section) => void} */
    const addSection = React.useCallback((section) => {
        setItems((prev) => ({
            ...prev,
            workspace: upsertSection(prev.workspace, section),
        }));
    }, []);

    /** @type {(sectionId: string) => void} */
    const deleteSection = React.useCallback((sectionId) => {
        setItems((prev) => ({
            ...prev,
            workspace: removeSection(prev.workspace, sectionId),
        }));
    }, []);

    /** @type {(sectionId: string, item: Partial<LayoutItem>) => void} */
    const addSectionItem = React.useCallback((sectionId, item) => {
        setItems((prev) => ({
            ...prev,
            workspace: addItemToSection(prev.workspace, sectionId, item),
        }));
    }, []);

    /** @type {(sectionId: string, itemId: string) => void} */
    const deleteSectionItem = React.useCallback((sectionId, itemId) => {
        setItems((prev) => ({
            ...prev,
            workspace: removeItemFromSection(prev.workspace, sectionId, itemId),
        }));
    }, []);

    /** @type {(sectionId: string, itemId: string, patch: Partial<LayoutItem>) => void} */
    const updateSectionItem = React.useCallback((sectionId, itemId, patch) => {
        setItems((prev) => ({
            ...prev,
            workspace: updateItemInSection(prev.workspace, sectionId, itemId, patch),
        }));
    }, []);

    const value = React.useMemo(
        () => ({
            loading,
            leftRailItems: items.leftRail,
            rightRailItems: items.rightRail,
            dockItems: items.dock,
            workspaceItems: items.workspace,
            addItem,
            deleteItem,
            updateItem,
            addSection,
            deleteSection,
            addSectionItem,
            deleteSectionItem,
            updateSectionItem,
        }),
        [loading, items, addItem, deleteItem, updateItem, addSection, deleteSection, addSectionItem, deleteSectionItem, updateSectionItem],
    );

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
}

/**
 * Hook to access layout items and actions from any component.
 * @returns {LayoutContextValue}
 */
export function useLayout() {
    const ctx = React.useContext(LayoutContext);
    if (!ctx) {
        throw new Error("useLayout must be used inside <LayoutProvider>");
    }
    return ctx;
}
