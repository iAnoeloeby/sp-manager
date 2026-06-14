import React, { useCallback, useState } from "react";
import { PlusIcon, WrenchIcon } from "@phosphor-icons/react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/ContextMenu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import DockItemAdd from "./DockItemAdd";
import { cn } from "@/lib/utils";

/**
 * @typedef {import("../services/dockItemsService").DockItem} DockItem
 * @typedef {import("../services/dockItemsService").DockItemType} DockItemType
 *
 * @typedef {(
 *   "leftRail" | "rightRail" | "bottomDock"
 * )} EditableSlotId
 *
 * @typedef {Object} EditableSlotRenderOpts
 * @property {boolean} isEditing
 * @property {boolean} isGloballyEditing
 * @property {(item: { type: DockItemType, name: string, url: string }) => void} onAdd
 * @property {(id: string) => void} onDelete
 *
 * @typedef {{ type: DockItemType, name: string, url: string }} NewDockItemInput
 *
 * @typedef {Object} EditableSlotProps
 * @property {EditableSlotId} slotId
 * @property {string} label
 * @property {DockItem[]} items
 * @property {boolean} [isEditing]
 * @property {boolean} [isGloballyEditing]
 * @property {(slot: EditableSlotId) => void} onToggleSlotEdit
 * @property {(item: NewDockItemInput) => void} onAdd
 * @property {(id: string) => void} onDelete
 * @property {string} [className]
 * @property {(
 *   items: DockItem[],
 *   opts: EditableSlotRenderOpts
 * ) => React.ReactNode} renderItems
 */

/**
 * Shell yang membungkus sebuah layout slot (left rail / right rail / bottom
 * dock / workspace) dengan:
 *   1. Context menu (klik-kanan di area kosong / di dalam slot) untuk
 *      masuk/keluar mode edit dan menghapus semua item.
 *   2. Dialog Add Item (DockItemAdd) ketika user memilih "Add item".
 *   3. Dialog konfirmasi "Remove all".
 *   4. Render-prop `renderItems` yang menerima daftar item + opsi edit
 *      supaya parent bebas memilih renderer (DockItemGrid, DockItemList,
 *      dsb.) tanpa membocorkan logika edit ke renderer.
 *
 * Komponen ini TIDAK mengelola state item — itu tugas parent
 * (AppLayout) lewat prop `items` + callback `onAdd` / `onDelete`.
 *
 * @param {EditableSlotProps} props
 */
export default function EditableSlot({
    slotId,
    label,
    items,
    isEditing = false,
    isGloballyEditing = false,
    onToggleSlotEdit,
    onAdd,
    onDelete,
    className = "",
    renderItems,
}) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

    const editing = isEditing || isGloballyEditing;

    /** @type {() => void} */
    const handleOpenAdd = useCallback(() => {
        if (!editing) return;
        setIsAddOpen(true);
    }, [editing]);

    /** Wrapper `() => void` untuk diteruskan ke komponen turunan
     *  (`ItemAdd` / `DockItemGrid` / `DockItemList`) yang mengharapkan
     *  callback tanpa argumen. */
    const onAddNoArgs = useCallback(() => {
        handleOpenAdd();
    }, [handleOpenAdd]);

    /** @type {(open: boolean) => void} */
    const handleAddOpenChange = useCallback((open) => {
        if (!open) setIsAddOpen(false);
    }, []);

    /**
     * Wrapper untuk membuka dialog Add Item. Tipe `() => void` supaya
     * cocok dengan `ItemAdd` / `DockItemGrid` yang mengharapkan callback
     * tanpa argumen.
     * @type {() => void}
     */
    const openAddDialog = useCallback(() => {
        if (!editing) return;
        setIsAddOpen(true);
    }, [editing]);

    const handleSaveNewItem = useCallback(
        /**
         * @param {NewDockItemInput} item
         */
        (item) => {
            onAdd?.(item);
            setIsAddOpen(false);
        },
        [onAdd],
    );

    /** @type {() => void} */
    const handleAskReset = useCallback(() => {
        if (!items.length) return;
        setIsConfirmResetOpen(true);
    }, [items.length]);

    /** @type {() => void} */
    const handleConfirmReset = useCallback(() => {
        items.forEach(
            /** @param {DockItem} item */
            (item) => onDelete?.(item.id),
        );
        setIsConfirmResetOpen(false);
    }, [items, onDelete]);

    /**
     * @param {EditableSlotId} slot
     * @type {() => void}
     */
    const handleToggleManage = useCallback(() => {
        onToggleSlotEdit?.(slotId);
    }, [onToggleSlotEdit, slotId]);

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <div className={cn("relative", className)}>
                        {renderItems?.(items, {
                            isEditing,
                            isGloballyEditing,
                            onAdd: onAddNoArgs,
                            onDelete,
                        })}
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onSelect={handleToggleManage}>
                        <WrenchIcon />
                        {isEditing
                            ? `Stop managing ${label}`
                            : `Manage ${label}`}
                    </ContextMenuItem>
                    {editing && (
                        <>
                            <ContextMenuItem
                                onSelect={handleOpenAdd}
                                disabled={!onAdd}
                            >
                                <PlusIcon />
                                Add item
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem
                                variant="destructive"
                                onSelect={handleAskReset}
                                disabled={items.length === 0}
                            >
                                Remove all
                            </ContextMenuItem>
                        </>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            <DockItemAdd
                open={isAddOpen}
                onOpenChange={handleAddOpenChange}
                onSave={handleSaveNewItem}
            />

            <Dialog
                open={isConfirmResetOpen}
                onOpenChange={setIsConfirmResetOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus semua item?</DialogTitle>
                        <DialogDescription>
                            Semua item di {label} akan dihapus. Tindakan ini
                            tidak bisa dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter showCloseButton>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmReset}
                        >
                            Hapus semua
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
