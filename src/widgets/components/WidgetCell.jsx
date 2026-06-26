import React from "react";

import { DotsThreeIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from "@/components/ui/ContextMenu";

import { cn } from "@/lib/utils";

const colSpanClass = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
};

const rowSpanClass = {
    1: "row-span-1",
    2: "row-span-2",
    3: "row-span-3",
    4: "row-span-4",
};


export default function WidgetCell({
    item,
    cols = 1,
    rows = 1,
    children,
    onMouseEnter,
    onMouseLeave,
    isHovered,
    enableDropdown,
    enableContextMenu,
    dropdownMenu,
    contextMenu,
}) {
    const [openDropdown, setOpenDropdown] = React.useState(false);
    const [openContext, setOpenContext] = React.useState(false);

    const active = isHovered || openDropdown || openContext;

    const hasDropdown = enableDropdown && Boolean(dropdownMenu);
    const hasContextMenu = enableContextMenu && Boolean(contextMenu);
    const ContextMenuComponents = contextMenu;
    const DropdownMenuComponent = dropdownMenu;

    return (
        <div
            key={item.id}
            className={cn(
                colSpanClass[cols],
                rowSpanClass[rows],

                "relative group/item inset-0",
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <AnimatePresence>
                {active && (
                    <motion.span
                        className="absolute inset-0 h-full w-full bg-muted-foreground/10 block rounded-xl pointer-events-none z-1"
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

            {hasContextMenu ? (
                <ContextMenu open={openContext} onOpenChange={setOpenContext}>
                    <ContextMenuTrigger asChild>
                        <div className="relative flex h-full w-full items-center justify-center z-10">
                            {children}
                        </div>
                    </ContextMenuTrigger>

                    <ContextMenuContent>
                        {ContextMenuComponents && (
                            <ContextMenuComponents
                                item={item}
                                open={openContext}
                                setOpen={setOpenContext}
                            />
                        )}
                    </ContextMenuContent>
                </ContextMenu>
            ) : (
                <div className="relative flex h-full w-full items-center justify-center z-10">
                    {children}
                </div>
            )}

            {hasDropdown && (
                <DropdownMenu
                    open={openDropdown}
                    onOpenChange={setOpenDropdown}
                >
                    <DropdownMenuTrigger asChild>
                        {active && (
                            <button className="absolute right-1 top-1 z-20 opacity-0 group-hover/item:opacity-100">
                                <DotsThreeIcon />
                            </button>
                        )}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40 gap-0 p-1">
                        {DropdownMenuComponent && (
                            <DropdownMenuComponent
                                item={item}
                                open={openDropdown}
                                setOpen={setOpenDropdown}
                            />
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}
