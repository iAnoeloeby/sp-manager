import { useCallback, useEffect, useState } from "react";
import {
    loadSlotItems,
    saveSlotItems,
    upsertSlotItem,
    updateSlotItem,
    removeSlotItem,
} from "@/features/dockItems/services/dockItemsService";

/**
 * @typedef {import("../services/dockItemsService").DockItem} DockItem
 */

/**
 * @typedef {"leftRailItems" | "rightRailItems" | "dockItems" | "workspaceItems"} DockItemsKey
 *
 * @typedef {Object} UseDockItemsResult
 * @property {DockItem[]} leftRailItems
 * @property {DockItem[]} rightRailItems
 * @property {DockItem[]} dockItems
 * @property {DockItem[]} workspaceItems
 * @property {boolean} loading
 * @property {(slot: DockItemsKey) => DockItem[]} getSlot
 * @property {(slot: DockItemsKey, item: Partial<DockItem> & { type: DockItem["type"] }) => void} addItem
 * @property {(slot: DockItemsKey, itemId: string, patch: Partial<DockItem>) => void} updateItem
 * @property {(slot: DockItemsKey, itemId: string) => void} deleteItem
 * @property {(slot: DockItemsKey) => void} resetSlot
 */

/** @type {DockItemsKey[]} */
const SLOT_KEYS = [
    "leftRailItems",
    "rightRailItems",
    "dockItems",
    "workspaceItems",
];

/**
 * Hook for managing persisted dock items per layout area.
 * Each area (left-rail, right-rail, bottom-dock, workspace-frame) has
 * its own storage key and its own state slice.
 *
 * @returns {UseDockItemsResult}
 */
export function useDockItems() {
    const [leftRailItems, setLeftRailItems] = useState(
        /** @type {DockItem[]} */ ([]),
    );
    const [rightRailItems, setRightRailItems] = useState(
        /** @type {DockItem[]} */ ([]),
    );
    const [dockItems, setDockItems] = useState(
        /** @type {DockItem[]} */ ([]),
    );
    const [workspaceItems, setWorkspaceItems] = useState(
        /** @type {DockItem[]} */ ([]),
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        Promise.all(SLOT_KEYS.map((key) => loadSlotItems(key))).then(
            (results) => {
                if (!active) return;
                setLeftRailItems(results[0] || []);
                setRightRailItems(results[1] || []);
                setDockItems(results[2] || []);
                setWorkspaceItems(results[3] || []);
                setLoading(false);
            },
        );

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (loading) return;
        saveSlotItems("leftRailItems", leftRailItems);
    }, [loading, leftRailItems]);

    useEffect(() => {
        if (loading) return;
        saveSlotItems("rightRailItems", rightRailItems);
    }, [loading, rightRailItems]);

    useEffect(() => {
        if (loading) return;
        saveSlotItems("dockItems", dockItems);
    }, [loading, dockItems]);

    useEffect(() => {
        if (loading) return;
        saveSlotItems("workspaceItems", workspaceItems);
    }, [loading, workspaceItems]);

    /**
     * @type {(slot: DockItemsKey) => DockItem[]}
     */
    const getSlot = useCallback(
        (slot) => {
            switch (slot) {
                case "leftRailItems":
                    return leftRailItems;
                case "rightRailItems":
                    return rightRailItems;
                case "dockItems":
                    return dockItems;
                case "workspaceItems":
                    return workspaceItems;
                default:
                    return [];
            }
        },
        [leftRailItems, rightRailItems, dockItems, workspaceItems],
    );

    /**
     * @param {DockItemsKey} slot
     * @returns {React.Dispatch<React.SetStateAction<DockItem[]>>}
     */
    const setterFor = (slot) => {
        switch (slot) {
            case "leftRailItems":
                return setLeftRailItems;
            case "rightRailItems":
                return setRightRailItems;
            case "dockItems":
                return setDockItems;
            case "workspaceItems":
                return setWorkspaceItems;
            default:
                /** @type {React.Dispatch<React.SetStateAction<DockItem[]>>} */
                const noop = () => {};
                return noop;
        }
    };

    /** @type {(slot: DockItemsKey, item: Partial<DockItem> & { type: DockItem["type"] }) => void} */
    const addItem = useCallback((slot, item) => {
        const setter = setterFor(slot);
        setter((current) => upsertSlotItem(current, item));
    }, []);

    /** @type {(slot: DockItemsKey, itemId: string, patch: Partial<DockItem>) => void} */
    const updateItem = useCallback((slot, itemId, patch) => {
        const setter = setterFor(slot);
        setter((current) => updateSlotItem(current, itemId, patch));
    }, []);

    /** @type {(slot: DockItemsKey, itemId: string) => void} */
    const deleteItem = useCallback((slot, itemId) => {
        const setter = setterFor(slot);
        setter((current) => removeSlotItem(current, itemId));
    }, []);

    /** @type {(slot: DockItemsKey) => void} */
    const resetSlot = useCallback((slot) => {
        const setter = setterFor(slot);
        setter(/** @type {DockItem[]} */ ([]));
    }, []);

    return {
        leftRailItems,
        rightRailItems,
        dockItems,
        workspaceItems,
        loading,
        getSlot,
        addItem,
        updateItem,
        deleteItem,
        resetSlot,
    };
}
