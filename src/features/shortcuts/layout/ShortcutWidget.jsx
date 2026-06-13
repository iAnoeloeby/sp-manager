import React, { useCallback, useState } from "react";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@phosphor-icons/react";
import ShortcutGrid from "@/features/shortcuts/layout/ShortcutGrid";
import ShortcutForm from "@/features/shortcuts/components/ShortcutDialog";
import WorkspaceFrame from "@/components/layout/WorkspaceFrame";

/**
 * @typedef {import("../components/ShortcutMenu").Shortcut} Shortcut
 */

/**
 * @typedef {Object} ShortcutWidgetProps
 * @property {Shortcut[]} shortcuts
 * @property {(s: Shortcut) => void} onAddShortcut
 * @property {(id: string, patch: Partial<Shortcut>) => void} onUpdateShortcut
 * @property {(id: string) => void} onDeleteShortcut
 */

/**
 * Top-level widget yang menggabungkan grid + animasi hover + popover + context menu.
 *
 * Struktur:
 *   <>
 *     {shortcuts.length ? <ShortcutGrid /> : <EmptyState />}
 *     <ShortcutForm open={isShortcutFormOpen} ... />  <-- selalu di-mount
 *   </>
 *
 * `ShortcutForm` HARUS di-render di return utama (bukan di dalam `action`),
 * supaya saat grid berisi item, klik tile "+" / context-menu Edit bisa
 * membuka dialog. Kalau cuma di dalam `action` EmptyState, dialog baru
 * muncul saat grid kosong.
 *
 * @param {ShortcutWidgetProps} props
 */
export default function ShortcutWidget({
    shortcuts,
    onAddShortcut,
    onUpdateShortcut,
    onDeleteShortcut,
}) {
    const [isShortcutFormOpen, setIsShortcutFormOpen] = useState(false);
    const [editingShortcut, setEditingShortcut] = useState(
        /** @type {Shortcut | null} */ (null),
    );

    /**
     * Buka dialog dalam mode ADD.
     * @type {() => void}
     */
    const handleAdd = useCallback(() => {
        setEditingShortcut(null);
        setIsShortcutFormOpen(true);
    }, []);

    /**
     * Buka dialog dalam mode EDIT.
     * @type {(s: Shortcut) => void}
     */
    const handleEdit = useCallback((shortcut) => {
        setEditingShortcut(shortcut);
        setIsShortcutFormOpen(true);
    }, []);

    const closeShortcutForm = useCallback(() => {
        setIsShortcutFormOpen(false);
        setEditingShortcut(null);
    }, []);

    /**
     * @param {boolean} nextOpen
     * @type {(nextOpen: boolean) => void}
     */
    const handleDialogOpenChange = useCallback(
        (nextOpen) => {
            if (!nextOpen) closeShortcutForm();
        },
        [closeShortcutForm],
    );

    /**
     * @param {Shortcut} nextShortcut
     * @type {(s: Shortcut) => void}
     */
    const saveShortcut = useCallback(
        (nextShortcut) => {
            if (editingShortcut) {
                onUpdateShortcut(editingShortcut.id, nextShortcut);
            } else {
                onAddShortcut(nextShortcut);
            }

            closeShortcutForm();
        },
        [editingShortcut, onAddShortcut, onUpdateShortcut, closeShortcutForm],
    );

    /**
     * Salin URL ke clipboard. Dipakai oleh Popover & ContextMenu.
     * @param {Shortcut} shortcut
     * @type {(s: Shortcut) => Promise<void>}
     */
    const copyShortcutUrl = useCallback(async (shortcut) => {
        try {
            await navigator.clipboard.writeText(shortcut.url);
        } catch {
            // Fallback untuk browser/ekstensi yang membatasi Clipboard API.
            const input = document.createElement("input");
            input.value = shortcut.url;
            document.body.appendChild(input);
            input.select();
            try {
                document.execCommand("copy");
            } catch {
                /* noop */
            }
            document.body.removeChild(input);
        }
    }, []);

    return (
        <>
            {shortcuts.length === 0 ? (
                <EmptyState
                    title="No shortcuts yet"
                    description="Add your favorite sites for fast access from every new tab."
                    action={
                        <Button
                            label="Add shortcut"
                            variant="outline"
                            size="icon-lg"
                            onClick={handleAdd}
                        >
                            <PlusIcon
                                weight="bold"
                                size={30}
                                color="currentColor"
                            />
                        </Button>
                    }
                />
            ) : (
                <ShortcutGrid
                    shortcuts={shortcuts}
                    onEdit={handleEdit}
                    onCopy={copyShortcutUrl}
                    onDelete={onDeleteShortcut}
                    onAdd={handleAdd}
                />
            )}

            <ShortcutForm
                open={isShortcutFormOpen}
                shortcut={editingShortcut}
                onClose={closeShortcutForm}
                onOpenChange={handleDialogOpenChange}
                onSave={saveShortcut}
            />
        </>
    );
}
