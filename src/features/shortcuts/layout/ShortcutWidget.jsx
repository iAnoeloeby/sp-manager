import React from "react";
import ShortcutCard from "@/features/shortcuts/components/ShortcutCard";

/**
 * @typedef {Object} ShortcutWidgetProps
 * @property {Shortcut[]} shortcuts
 * @property {(s: Shortcut) => void} onAddShortcut
 * @property {(id: string, patch: Partial<Shortcut>) => void} onUpdateShortcut
 * @property {(id: string) => void} onDeleteShortcut
 *
 * @param {ShortcutWidgetProps} props
 */
export default function ShortcutWidget() {
    return <ShortcutCard />;
}
