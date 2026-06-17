import React, { useMemo, useState } from "react";
import { GearSixIcon, PencilSimpleIcon } from "@phosphor-icons/react";

import BottomDock from "../components/layout/BottomDock";
import LeftRail from "../components/layout/LeftRail";
import PageShell from "../components/layout/PageShell";
import RightRail from "../components/layout/RightRail";
import { Button } from "@/components/ui/Button";

import SearchBar from "../features/search/components/SearchBar";
import ClockWidget from "../features/clock/components/ClockWidget";
import SettingsPanel from "../features/settings/components/SettingsPanel";
import WorkspaceFrame from "../components/layout/WorkspaceFrame";
import ShortcutWidget from "../features/shortcuts/layout/ShortcutWidget";
import { buildBackgroundImage } from "../features/settings/utils/backgroundUtils";
import DockItemGrid from "@/features/dockItems/components/DockItemGrid";
import DockItemEditor from "@/features/dockItems/components/DockItemAdd";
import { useEditMode } from "@/features/dockItems/hooks/useEditMode";

/**
 * @typedef {import("@/features/dock-items/services/dockItemsService").DockItem} DockItem
 * @typedef {import("@/features/dock-items/services/dockItemsService").DockItemType} DockItemType
 * @typedef {import("@/features/dock-items/hooks/useDockItems").DockItemsKey} DockItemsKey
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
            className="relative min-h-screen bg-background text-foreground"
            style={pageStyle}
        >
            <div className="min-w-screen flex bg-background/20 backdrop-blur-xs">
                <LeftRail>
                    <Button
                        variant="ghost"
                        size="icon-xl"
                        label="Open settings"
                        onClick={() => setOpenSettings(true)}
                        className="text-foreground hover:text-foreground/70"
                    >
                        <GearSixIcon
                            weight="regular"
                            className="text-current"
                        />
                    </Button>
                    <DockItemGrid
                        area="leftRail"
                        items={leftRailItems}
                        onAdd={(item) => addToSlot("leftRailItems", item)}
                        onDelete={(id) => deleteFromSlot("leftRailItems", id)}
                        className="grid-cols-1"
                    />
                </LeftRail>

                <PageShell className="relative min-h-screen">
                    <div className="min-h-[calc(100vh-7rem)] items-center justify-center grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_fit-content]">
                        <div className="flex items-center justify-center">
                            <ClockWidget
                                format={settings.clockFormat}
                                showSeconds={settings.showSeconds}
                            />
                        </div>

                        <section>
                            <SearchBar engineId={settings.searchEngine} />
                        </section>

                        <section>
                            <WorkspaceFrame title="Main workspace">
                                {workspaceItems.length > 0 ? (
                                    <DockItemGrid
                                        area="workspace"
                                        items={workspaceItems}
                                        className="grid grid-cols-12"
                                    />
                                ) : (
                                    <ShortcutWidget
                                        shortcuts={shortcuts}
                                        onAddShortcut={onAddShortcut}
                                        onUpdateShortcut={onUpdateShortcut}
                                        onDeleteShortcut={onDeleteShortcut}
                                    />
                                )}
                            </WorkspaceFrame>
                        </section>
                    </div>
                </PageShell>

                <RightRail>
                    <Button
                        variant="ghost"
                        size="icon-xl"
                        label="Open settings"
                        onClick={() => setOpenSettings(true)}
                        className="text-foreground hover:text-foreground/70"
                    >
                        <GearSixIcon
                            weight="regular"
                            className="text-current"
                        />
                    </Button>
                    <DockItemGrid
                        area="rightRail"
                        items={rightRailItems}
                        onAdd={(item) => addToSlot("rightRailItems", item)}
                        onDelete={(id) => deleteFromSlot("rightRailItems", id)}
                        className="grid-cols-1"
                    />
                </RightRail>
            </div>

            <BottomDock>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon-xl"
                            label="Open settings"
                            onClick={() => setOpenSettings(true)}
                            className="text-foreground hover:text-foreground/70"
                        >
                            <GearSixIcon
                                weight="regular"
                                className="text-current"
                            />
                        </Button>
                        <Button
                            variant={
                                editMode.editingAll ? "secondary" : "ghost"
                            }
                            size="icon-xl"
                            label={
                                editMode.editingAll
                                    ? "Stop editing docks"
                                    : "Edit docks"
                            }
                            aria-pressed={editMode.editingAll}
                            onClick={editMode.toggleGlobalEdit}
                            className="text-foreground hover:text-foreground/70"
                        >
                            <PencilSimpleIcon
                                weight="regular"
                                className="text-current"
                            />
                        </Button>
                    </div>
                    <DockItemGrid
                        area="bottomDock"
                        items={dockItems}
                        onAdd={() => openGlobalEditor("dockItems")}
                        onDelete={(id) => deleteFromSlot("dockItems", id)}
                        className="grid-cols-12 grid-rows-none"
                    />
                </div>
            </BottomDock>

            <DockItemEditor
                open={globalEditorOpen}
                onOpenChange={setGlobalEditorOpen}
                onSave={handleGlobalSave}
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
