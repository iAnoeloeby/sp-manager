import React, { useMemo, useState } from "react";

import PageShell from "@/layout/PageShell";
import LeftRail from "@/layout/LeftRail";
import RightRail from "@/layout/RightRail";
import BottomDock from "@/layout/BottomDock";
import SettingsPanel from "@/features/settings/layout/SettingsPanel";

import { useEditMode } from "@/features/dockItems/hooks/useEditMode";
import { buildBackgroundImage } from "@/features/settings/utils/backgroundUtils";

/**
 * @typedef {import("@/features/dockItems/services/dockItemsService").DockItem} DockItem
 * @typedef {import("@/features/dockItems/services/dockItemsService").DockItemType} DockItemType
 * @typedef {import("@/features/dockItems/hooks/useDockItems").DockItemsKey} DockItemsKey
 */

/**
 * @param {{
 *   settings: any,
 *   shortcuts: any[],
 *   leftRailItems: DockItem[],
 *   rightRailItems: DockItem[],
 *   dockItems: DockItem[],
 *   workspaceItems: DockItem[],
 *   onAddDockItem: (slot: DockItemsKey, item: Partial<DockItem> & { type: DockItemType }) => void,
 *   onDeleteDockItem: (slot: DockItemsKey, id: string) => void,
 *   onSettingsChange: (settings: any) => void,
 *   onSettingsReset: () => void,
 *   onAddShortcut: (shortcut: any) => void,
 *   onUpdateShortcut: (id: string, patch: any) => void,
 *   onDeleteShortcut: (id: string) => void,
 * }} props
 */
export default function AppLayout({
    settings,
    shortcuts,
    leftRailItems,
    rightRailItems,
    dockItems,
    workspaceItems,
    onAddDockItem,
    onDeleteDockItem,
    onSettingsChange,
    onSettingsReset,
    onAddShortcut,
    onUpdateShortcut,
    onDeleteShortcut,
}) {
    const [openSettings, setOpenSettings] = useState(false);
    const editMode = useEditMode();
    const [globalEditorOpen, setGlobalEditorOpen] = useState(false);
    const [globalEditorSlot, setGlobalEditorSlot] = useState(
        /** @type {DockItemsKey | null} */ (null),
    );

    const isImageBackground =
        settings.background?.type === "image" &&
        Boolean(settings.background?.imageUrl);

    const pageStyle = useMemo(() => {
        const imageBackgroundStyle = isImageBackground
            ? {
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed",
              }
            : {};

        return {
            backgroundImage: buildBackgroundImage(settings.background),
            ...imageBackgroundStyle,
        };
    }, [isImageBackground, settings.background]);

    /**
     * @param {DockItemsKey} slot
     * @param {{ type: DockItemType, name: string, url: string }} item
     */
    function addToSlot(slot, item) {
        onAddDockItem(slot, item);
    }

    /**
     * @param {DockItemsKey} slot
     * @param {string} id
     */
    function deleteFromSlot(slot, id) {
        onDeleteDockItem(slot, id);
    }

    /**
     * @param {DockItemsKey} slot
     */
    function openGlobalEditor(slot) {
        setGlobalEditorSlot(slot);
        setGlobalEditorOpen(true);
    }

    /** @param {{ type: DockItemType, name: string, url: string }} item */
    function handleGlobalSave(item) {
        if (!globalEditorSlot) return;
        onAddDockItem(globalEditorSlot, item);
    }

    return (
        <div
            className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground"
            style={pageStyle}
        >
            <div className="flex w-full min-w-0 bg-background/20 backdrop-blur-xs">
                <LeftRail
                    workspace={{
                        item: leftRailItems,
                        addToSlot,
                        deleteFromSlot,
                        setOpenSettings,
                    }}
                />

                <PageShell
                    workspace={{
                        item: workspaceItems,
                        setOpenSettings,
                        shortcuts,
                        onAddShortcut,
                        onUpdateShortcut,
                        onDeleteShortcut,
                    }}
                    settings={settings}
                    className="relative min-h-screen"
                />

                <RightRail
                    workspace={{
                        item: rightRailItems,
                        addToSlot,
                        deleteFromSlot,
                        setOpenSettings,
                    }}
                />
            </div>

            <BottomDock
                workspace={{
                    item: dockItems,
                    setOpenSettings,
                    editMode,
                    openGlobalEditor,
                    deleteFromSlot,
                    handleGlobalSave,
                    globalEditorOpen,
                    setGlobalEditorOpen,
                }}
            />

            <SettingsPanel
                open={openSettings}
                settings={settings}
                onClose={() => setOpenSettings(false)}
                onChange={onSettingsChange}
                onReset={onSettingsReset}
            />
        </div>
    );
}
