import React from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/ContextMenu";
import {
    PencilSimpleIcon,
    CopyIcon,
    TrashSimpleIcon,
} from "@phosphor-icons/react";

/**
 * @typedef {Object} Shortcut
 * @property {string} id
 * @property {string} url
 * @property {string} [title]
 */

/**
 * Event object Radix lempar ke `onSelect`.
 * @typedef {Object} SelectEvent
 * @property {boolean} [defaultPrevented]
 * @property {() => void} [preventDefault]
 */

/**
 * @typedef {Object} ShortcutMenuProps
 * @property {React.ReactNode} children
 * @property {Shortcut} shortcut
 * @property {(s: Shortcut) => void} [onEdit]
 * @property {(s: Shortcut) => void} [onCopy]
 * @property {(id: string) => void} [onDelete]
 */

/**
 * Context-menu wrapper untuk sebuah shortcut.
 * Membungkus `children` jadi trigger (right-click / long-press)
 * dan menyediakan menu Edit / Copy URL / Delete.
 *
 * @param {ShortcutMenuProps} props
 */
export default function ShortcutMenu({
    children,
    shortcut,
    onEdit,
    onCopy,
    onDelete,
}) {
    /** @param {SelectEvent} e */
    const runEdit = (e) => {
        e.preventDefault?.();
        onEdit?.(shortcut);
    };
    /** @param {SelectEvent} e */
    const runCopy = (e) => {
        e.preventDefault?.();
        onCopy?.(shortcut);
    };
    /** @param {SelectEvent} e */
    const runDelete = (e) => {
        e.preventDefault?.();
        onDelete?.(shortcut.id);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-40">
                <ContextMenuItem onSelect={runEdit}>
                    <PencilSimpleIcon />
                    Edit Shortcut
                </ContextMenuItem>
                <ContextMenuItem onSelect={runCopy}>
                    <CopyIcon />
                    Copy URL
                </ContextMenuItem>
                <ContextMenuSeparator />

                <ContextMenuItem variant="destructive" onSelect={runDelete}>
                    <TrashSimpleIcon />
                    Delete Shortcut
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
