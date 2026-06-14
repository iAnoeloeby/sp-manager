import React from "react";
import { Item } from "@/components/ui/Item";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/ContextMenu";
import {
    Popover,
    PopoverContent,
    PopoverItem,
    PopoverTrigger,
} from "@/components/ui/Popover";
import {
    CopySimpleIcon,
    PencilSimpleIcon,
    DotsThreeIcon,
    TrashIcon,
} from "@phosphor-icons/react";
import { ShortcutIcon } from "./ShortcutIcon";

export default function ShortcutItem({ shortcut, onEdit, onCopy, onDelete }) {
    const menuItems = [
        {
            id: "edit",
            icon: <PencilSimpleIcon />,
            label: "Edit",
            onSelect() {
                onEdit(shortcut);
            },
        },
        {
            id: "copy",
            icon: <CopySimpleIcon />,
            label: "Copy URL",
            onSelect() {
                onCopy(shortcut);
            },
        },
        {
            id: "delete",
            icon: <TrashIcon />,
            label: "Delete",
            onSelect() {
                onDelete(shortcut);
            },
        },
    ];
    return (
        <ContextMenu>
            <Popover>
                <ContextMenuTrigger asChild>
                    <Item onClick={(e) => e.stopPropagation()}>
                        <ShortcutIcon shortcut={shortcut} />

                        <PopoverTrigger
                            asChild
                            className="absolute -top-2 -right-2 opacity-75 group/item:hover:opacity-100 z-5 size-4"
                        >
                            <DotsThreeIcon
                                weight="bold"
                                size={12}
                                className="fill-foreground/70 hover:fill-foreground"
                            />
                        </PopoverTrigger>
                    </Item>
                </ContextMenuTrigger>
                <PopoverContent
                    align="end"
                    sideOffset={4}
                    className="w-40 gap-0 p-1"
                >
                    {menuItems.map((item, index) => (
                        <PopoverItem key={index} onSelect={item.onSelect}>
                            {item.icon}
                            {item.label}
                        </PopoverItem>
                    ))}
                </PopoverContent>
            </Popover>

            <ContextMenuContent>
                {menuItems.map((item, index) => (
                    <ContextMenuItem key={index} onSelect={item.onSelect}>
                        {item.icon}
                        {item.label}
                    </ContextMenuItem>
                ))}
            </ContextMenuContent>
        </ContextMenu>
    );
}
