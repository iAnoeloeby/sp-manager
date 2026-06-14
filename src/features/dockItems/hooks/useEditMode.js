import { useCallback, useState } from "react";

/**
 * Manages edit-mode state for the dock layout areas.
 *
 * Two notions of "edit mode" coexist:
 *
 * 1. **Global** — toggled by the edit button at the left of the bottom dock.
 *    When enabled, ALL three manageable areas (left-rail, right-rail,
 *    bottom-dock) enter edit mode at once.
 *
 * 2. **Per-slot** — toggled by choosing "Manage" from the right-click
 *    context menu of a single area. Only that area is editable.
 *
 * A slot is editable when either its own `editingSlots[slot]` is true OR
 * the global `editingAll` flag is true.
 *
 * @returns {{
 *   editingAll: boolean,
 *   editingSlots: { leftRail: boolean, rightRail: boolean, bottomDock: boolean },
 *   isSlotEditing: (slot: "leftRail" | "rightRail" | "bottomDock") => boolean,
 *   startGlobalEdit: () => void,
 *   stopGlobalEdit: () => void,
 *   toggleGlobalEdit: () => void,
 *   startSlotEdit: (slot: "leftRail" | "rightRail" | "bottomDock") => void,
 *   stopSlotEdit: (slot: "leftRail" | "rightRail" | "bottomDock") => void,
 *   toggleSlotEdit: (slot: "leftRail" | "rightRail" | "bottomDock") => void,
 *   stopAll: () => void,
 * }}
 */
export function useEditMode() {
    const [editingAll, setEditingAll] = useState(false);
    const [editingSlots, setEditingSlots] = useState({
        leftRail: false,
        rightRail: false,
        bottomDock: false,
    });

    /** @type {("leftRail" | "rightRail" | "bottomDock")[]} */
    const slotKeys = ["leftRail", "rightRail", "bottomDock"];

    /** @type {(slot: "leftRail" | "rightRail" | "bottomDock") => boolean} */
    const isSlotEditing = useCallback(
        (slot) => Boolean(editingAll || editingSlots[slot]),
        [editingAll, editingSlots],
    );

    const startGlobalEdit = useCallback(() => setEditingAll(true), []);
    const stopGlobalEdit = useCallback(() => setEditingAll(false), []);
    const toggleGlobalEdit = useCallback(() => {
        setEditingAll((v) => !v);
    }, []);

    /** @type {(slot: "leftRail" | "rightRail" | "bottomDock") => void} */
    const startSlotEdit = useCallback((slot) => {
        setEditingSlots((prev) => ({ ...prev, [slot]: true }));
    }, []);

    /** @type {(slot: "leftRail" | "rightRail" | "bottomDock") => void} */
    const stopSlotEdit = useCallback((slot) => {
        setEditingSlots((prev) => ({ ...prev, [slot]: false }));
    }, []);

    /** @type {(slot: "leftRail" | "rightRail" | "bottomDock") => void} */
    const toggleSlotEdit = useCallback((slot) => {
        setEditingSlots((prev) => ({ ...prev, [slot]: !prev[slot] }));
    }, []);

    const stopAll = useCallback(() => {
        setEditingAll(false);
        setEditingSlots({ leftRail: false, rightRail: false, bottomDock: false });
    }, []);

    return {
        editingAll,
        editingSlots,
        isSlotEditing,
        startGlobalEdit,
        stopGlobalEdit,
        toggleGlobalEdit,
        startSlotEdit,
        stopSlotEdit,
        toggleSlotEdit,
        stopAll,
    };
}
