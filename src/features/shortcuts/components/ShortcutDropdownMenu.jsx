import React from "react";
import {
    DotsThreeCircleIcon,
    PencilSimpleIcon,
    CopyIcon,
    TrashSimpleIcon,
} from "@phosphor-icons/react";
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdownMenu";

/**
 * @typedef {import("./ShortcutContextMenu").Shortcut} Shortcut
 */

/**
 * @typedef {Object} ShortcutDropdownMenuProps
 * @property {boolean} open
 * @property {(b: boolean) => void} setOpen
 * @property {Shortcut} shortcut
 * @property {(s: Shortcut) => void} [onEdit]
 * @property {(s: Shortcut) => void} [onCopy]
 * @property {(id: string) => void} [onDelete]
 */

/**
 * Tombol "⋯" di pojok kanan atas tiap shortcut card.
 * Hanya muncul saat card di-hover.
 *
 * @param {ShortcutDropdownMenuProps} props
 */
export default function ShortcutDropdownMenu({ item, open, setOpen }) {
    const close = () => setOpen(false);

    /** @param {React.MouseEvent} e */
    const handleEdit = (e) => {
        e.stopPropagation();
        close();
        onEdit?.(item);
    };
    /** @param {React.MouseEvent} e */
    const handleCopy = (e) => {
        e.stopPropagation();
        close();
        onCopy?.(item);
    };
    /** @param {React.MouseEvent} e */
    const handleDelete = (e) => {
        e.stopPropagation();
        close();
        onDelete?.(item.id);
    };
    return (
        <>
            <DropdownMenuItem onSelect={handleEdit}>
                <PencilSimpleIcon aria-hidden="true" />
                Edit shortcut
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={handleCopy}>
                <CopyIcon aria-hidden="true" />
                <span>Copy URL</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={handleDelete} variant="destructive">
                <TrashSimpleIcon aria-hidden="true" />
                Delete shortcut
            </DropdownMenuItem>
        </>
    );

    // return (
    //     <Popover open={open} onOpenChange={setOpen} modal={false}>
    //         <PopoverTrigger
    //             aria-label="Shortcut settings"
    //             className="absolute right-1 top-1 z-20 inline-flex h-fit w-fit items-center justify-center rounded-4xl border border-transparent bg-transparent p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-surface/90 hover:fill-foreground hover:border-border/70 fill-foreground/50"
    //         >
    //             <DotsThreeCircleIcon
    //                 size={20}
    //                 className="fill-foreground"
    //                 weight="regular"
    //             />
    //         </PopoverTrigger>
    //         <PopoverContent
    //             align="end"
    //             sideOffset={4}
    //             className="w-40 gap-0 p-1"
    //         >
    //             <Button
    //                 className="flex w-full items-center gap-2 justify-start"
    //                 label={`Edit ${shortcut.title ?? shortcut.url}`}
    //                 onClick={handleEdit}
    //             >
    //                 <PencilSimpleIcon size={16} aria-hidden="true" />
    //                 <span>Edit shortcut</span>
    //             </Button>

    //             <Button
    //                 className="mt-1 flex w-full items-center gap-2 justify-start"
    //                 label={`Copy ${shortcut.url}`}
    //                 onClick={handleCopy}
    //             >
    //                 <CopyIcon size={16} aria-hidden="true" />
    //                 <span>Copy URL</span>
    //             </Button>

    //             <Button
    //                 className="mt-1 flex w-full items-center gap-2 justify-start text-destructive hover:bg-destructive/10"
    //                 label={`Delete ${shortcut.title ?? shortcut.url}`}
    //                 onClick={handleDelete}
    //             >
    //                 <TrashSimpleIcon size={16} aria-hidden="true" />
    //                 <span>Delete shortcut</span>
    //             </Button>
    //         </PopoverContent>
    //     </Popover>
    // );
}
