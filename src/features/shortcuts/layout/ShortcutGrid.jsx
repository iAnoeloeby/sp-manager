import React from "react";
import { PlusIcon } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { ItemGrid } from "@/components/ui/ItemGrid";
import { cn } from "@/utils/cn";

/**
 * @typedef {import("../components/ShortcutMenu").Shortcut} Shortcut
 */

/**
 * @typedef {Object} ShortcutGridProps
 * @property {Shortcut[]} shortcuts
 * @property {(s: Shortcut) => void} [onEdit]
 * @property {(s: Shortcut) => void} [onCopy]
 * @property {(id: string) => void} [onDelete]
 * @property {() => void} [onAdd]
 * @property {string} [className]
 */

/**
 * Grid untuk semua shortcut.
 *
 * - Jika `shortcuts` kosong → render `EmptyState` (bukan grid) dengan tombol "+"
 *   yang aman dari `onAdd` undefined.
 * - Jika ada item → render `ItemGrid` dengan handler diteruskan.
 *
 * @param {ShortcutGridProps} props
 */
export default function ShortcutGrid({
    shortcuts,
    onEdit,
    onCopy,
    onDelete,
    onAdd,
    className = "",
}) {
    if (!shortcuts.length) {
        // Guard: kalau `onAdd` undefined, tetap render EmptyState tanpa crash.
        const handleEmptyAdd = () => {
            if (onAdd) onAdd();
        };

        return (
            <EmptyState
                title="No shortcuts yet"
                description="Add your favorite sites for fast access from every new tab."
                action={
                    <Button onClick={handleEmptyAdd} aria-label="Add shortcut">
                        <PlusIcon />
                    </Button>
                }
            />
        );
    }

    return (
        <ItemGrid
            items={shortcuts}
            className={cn(
                "grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] ",
                className,
            )}
            onAdd={onAdd}
            onEdit={onEdit}
            onCopy={onCopy}
            onDelete={onDelete}
        />
    );
}

{
    /* Legacy: dulunya render manual dengan animasi `layoutId`.
       Sekarang sudah di-delegate ke ItemGrid. */
}
{
    /* <div
            className={
                "grid grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] gap-3 " +
                className
            }
            onMouseLeave={() => setHoveredIndex(null)}
        >
            {shortcuts.map((shortcut, idx) => (
                <div
                    key={shortcut.id}
                    className="relative inline-block h-fit w-fit aspect-square p-1.5 z-1"
                    onMouseEnter={() => setHoveredIndex(idx)}
                >
                    <ShortcutCard
                        shortcut={shortcut}
                        onEdit={onEdit}
                        onCopy={onCopy}
                        onDelete={onDelete}
                        isHovered={hoveredIndex === idx}
                    />
                </div>
            ))}
        </div> */
}
