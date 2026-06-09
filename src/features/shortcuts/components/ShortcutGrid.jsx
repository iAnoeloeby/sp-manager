import React from "react";
import IconButton from "../../../components/ui/IconButton";
import EmptyState from "../../../components/ui/EmptyState";
import ShortcutCard from "./ShortcutCard";

export default function ShortcutGrid({ shortcuts, onEdit, onDelete, onAdd }) {
    if (!shortcuts.length) {
        return (
            <EmptyState
                title="No shortcuts yet"
                description="Add your favorite sites for fast access from every new tab."
                action={
                    <IconButton label="Add shortcut" onClick={onAdd}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256"
                            className="h-5 w-5 fill-current"
                        >
                            <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                        </svg>
                    </IconButton>
                }
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="inline-flex rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                        Quick access
                    </div>
                </div>
                <IconButton label="Add shortcut" onClick={onAdd}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                        className="h-5 w-5 fill-current"
                    >
                        <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                    </svg>
                </IconButton>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {shortcuts.map((shortcut) => (
                    <ShortcutCard
                        key={shortcut.id}
                        shortcut={shortcut}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}
