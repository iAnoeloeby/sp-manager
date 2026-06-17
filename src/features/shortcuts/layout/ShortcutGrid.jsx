import React from "react";
import { PlusIcon } from "@phosphor-icons/react";
import {Button} from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { ItemGrid } from "@/components/ui/ItemGrid";
import { ShortcutIcon } from "@/features/shortcuts/components/ShortcutIcon";
import { cn } from "@/utils/cn";
import ShortcutItem from "../components/ShortcutItem";
import { ItemAdd } from "@/components/ui/Item";

export default function ShortcutGrid({
    shortcuts,
    onAdd,
    onEdit,
    onCopy,
    onDelete,
    className = "",
}) {
    const finalItems = [
        ...shortcuts.map((shortcut) => ({
            type: "url",
            url: shortcut.url,
            content: (
                <ShortcutItem
                    shortcut={shortcut}
                    onEdit={onEdit}
                    onCopy={onCopy}
                    onDelete={onDelete}
                />
            ),
        })),
        {
            type: "action",
            onClick: onAdd,
            content: <ItemAdd actions={onAdd} />,
        },
    ];

    if (!shortcuts.length) {
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
            items={finalItems}
            className={cn(
                "grid-cols-[repeat(auto-fill,minmax(4rem,1fr))]",
                className,
            )}
        />
    );
}
