import React from "react";
import ShortcutCard from "@/features/shortcuts/components/ShortcutItem";

export default function ShortcutGrid({ shortcuts, onEdit, onDelete }) {
    return (
        <div className="flex justify-around">
            {shortcuts.map((shortcut) => (
                <ShortcutCard
                    key={shortcut.id}
                    shortcut={shortcut}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
