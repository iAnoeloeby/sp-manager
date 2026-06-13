import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Item from "./Item";
import { cn } from "@/lib/utils";
import { ShortcutLogo } from "@/features/shortcuts/components/ShortcutLogo";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "./ContextMenu";
import {
    CopyIcon,
    PencilSimpleIcon,
    PlusIcon,
    TrashSimpleIcon,
} from "@phosphor-icons/react";

/**
 * @typedef {import("@/features/shortcuts/components/ShortcutLogo").Shortcut} Shortcut
 */

/**
 * Event object Radix lempar ke `onSelect`.
 * @typedef {Object} SelectEvent
 * @property {boolean} [defaultPrevented]
 * @property {() => void} [preventDefault]
 */

/**
 * @typedef {Object} ItemGridProps
 * @property {Shortcut[]} items
 * @property {string} [className]
 * @property {() => void} [onAdd]        Handler ketika tile "+" diklik.
 * @property {(item: Shortcut) => void} [onEdit]
 * @property {(item: Shortcut) => void} [onCopy]
 * @property {(id: string) => void} [onDelete]
 */

/**
 * Grid generik untuk deretan item (saat ini dipakai untuk shortcut).
 * Otomatis menambahkan 1 tile terakhir berupa tombol "+" (add),
 * yang visualnya konsisten dengan item lain (border, rounded, hover).
 *
 * Catatan teknis:
 * - Tile "+" menggunakan `<button>` NATIVE (bukan komponen `Button`),
 *   supaya tidak mewarisi variant `default` (primary) yang akan
 *   terlihat sangat kontras dengan item shortcut yang soft/transparan.
 * - Border `dashed` + `bg-transparent` memberi cue visual "tambah di sini".
 * - `addHovered` di-handle via state lokal (tidak bergantung `hoveredIndex`),
 *   karena `hoveredIndex` hanya mencakup item 0..items.length-1.
 *
 * @param {ItemGridProps} props
 */
export const ItemGrid = ({
    items,
    className = "",
    onAdd,
    onEdit,
    onCopy,
    onDelete,
}) => {
    const [hoveredIndex, setHoveredIndex] = useState(
        /** @type {number | null} */ (null),
    );
    const [addHovered, setAddHovered] = useState(false);

    return (
        <div className={cn("grid", className)}>
            {items.map((item, idx) => (
                <a
                    href={item?.url}
                    key={item?.id || idx}
                    className="relative group inline-block h-fit w-fit aspect-square p-1.5 z-1"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-muted/10 block rounded-xl pointer-events-none z-1"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>

                    <ContextMenu>
                        <ContextMenuTrigger>
                            <Item className="relative z-2">
                                <ShortcutLogo shortcut={item} />
                            </Item>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuGroup>
                                <ContextMenuItem
                                    onSelect={runOnSelect(onEdit, item)}
                                >
                                    <PencilSimpleIcon />
                                    Edit Shortcut
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onSelect={runOnSelect(onCopy, item)}
                                >
                                    <CopyIcon />
                                    Copy URL
                                </ContextMenuItem>
                            </ContextMenuGroup>
                            <ContextMenuSeparator />
                            <ContextMenuGroup>
                                <ContextMenuItem
                                    variant="destructive"
                                    onSelect={runOnSelectById(onDelete, item)}
                                >
                                    <TrashSimpleIcon />
                                    Delete Shortcut
                                </ContextMenuItem>
                            </ContextMenuGroup>
                        </ContextMenuContent>
                    </ContextMenu>
                </a>
            ))}

            {/* ===== Add tile (selalu di akhir) ===== */}
            <button
                type="button"
                key="__add__"
                aria-label="Add new shortcut"
                onClick={() => onAdd?.()}
                onMouseEnter={() => setAddHovered(true)}
                onMouseLeave={() => setAddHovered(false)}
                className="
                    relative group inline-flex items-center justify-center
                    h-fit w-fit aspect-square p-1.5 z-1
                    bg-transparent
                    text-muted-foreground hover:text-foreground
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50
                "
            >
                <AnimatePresence>
                    {addHovered && (
                        <motion.span
                            className="absolute inset-0 h-full w-full bg-muted/10 block rounded-xl pointer-events-none z-1"
                            layoutId="hoverBackground"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { duration: 0.15 },
                            }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.15, delay: 0.2 },
                            }}
                        />
                    )}
                </AnimatePresence>

                <Item
                    className="
                        relative z-2
                        border-dashed
                        bg-transparent
                        group-hover:border-border
                    "
                >
                    <PlusIcon
                        size={20}
                        weight="bold"
                        aria-hidden="true"
                    />
                </Item>
            </button>
        </div>
    );
};

/* ---------- helpers (typed) ---------- */

/**
 * @param {((s: Shortcut) => void) | undefined} fn
 * @param {Shortcut} item
 * @returns {(e: SelectEvent) => void}
 */
function runOnSelect(fn, item) {
    return (e) => {
        e.preventDefault?.();
        if (fn) fn(item);
    };
}

/**
 * @param {((id: string) => void) | undefined} fn
 * @param {Shortcut} item
 * @returns {(e: SelectEvent) => void}
 */
function runOnSelectById(fn, item) {
    return (e) => {
        e.preventDefault?.();
        if (fn) fn(item.id);
    };
}

{
    /*
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
        <span className="hidden pointer-fine:inline-block">
          Right click here
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Long press here
        </span>
    </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <CopyIcon />
            Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <ScissorsIcon />
            Cut
          </ContextMenuItem>
          <ContextMenuItem>
            <ClipboardPasteIcon />
            Paste
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
    */
}
