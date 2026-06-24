import React from "react";
import {
    ContextMenuItem,
    ContextMenuSeparator,
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
 * @typedef {Object} ShortcutContextMenuProps
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
 * @param {ShortcutContextMenuProps} props
 */
export default function ShortcutContextMenu({ item, open, setOpen }) {
    /** @param {SelectEvent} e */
    const runEdit = (e) => {
        e.preventDefault?.();
        onEdit?.(item);
    };
    /** @param {SelectEvent} e */
    const runCopy = (e) => {
        e.preventDefault?.();
        onCopy?.(item);
    };
    /** @param {SelectEvent} e */
    const runDelete = (e) => {
        e.preventDefault?.();
        onDelete?.(item.id);
    };

    return (
        <>
            <ContextMenuItem onSelect={runEdit}>
                <PencilSimpleIcon aria-hidden="true" />
                Edit Shortcut
            </ContextMenuItem>

            <ContextMenuItem onSelect={runCopy}>
                <CopyIcon aria-hidden="true" />
                Copy URL
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem onSelect={runDelete} variant="destructive">
                <TrashSimpleIcon aria-hidden="true" />
                Delete Shortcut
            </ContextMenuItem>
        </>
    );
}
