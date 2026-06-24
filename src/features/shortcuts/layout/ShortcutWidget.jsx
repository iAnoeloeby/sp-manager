import React from "react";
import ShortcutCard, {
    ShortcutCardSkeleton,
} from "@/features/shortcuts/components/ShortcutCard";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";

/**
 * @typedef {import("../components/ShortcutContextMenu").Shortcut} Shortcut
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
export default function ShortcutWidget() {
    const { loading } = useShortcuts();

    if (loading) {
        return <ShortcutCardSkeleton />;
    }

    return <ShortcutCard />;
}
