import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Item } from "./Item";
import { cn } from "@/lib/utils";
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

export function ItemGrid({ items, className = ""  }) {
    const [hoveredIndex, setHoveredIndex] = useState(
        /** @type {number | null} */ (null),
    );
    const [addHovered, setAddHovered] = useState(false);

    return (
        <div className={cn("grid gap-4", className)}>
            {items.map((item, idx) => (
                <div
                    key={item?.id || idx}
                    className="relative group/item inline-block h-fit w-fit aspect-square -m-1.5 p-1.5"
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
                                    transition: {
                                        duration: 0.15,
                                        delay: 0.2,
                                    },
                                }}
                            />
                        )}
                    </AnimatePresence>

                    <ItemWrapper item={item}>{item.content}</ItemWrapper>
                </div>
            ))}
        </div>
    );
}

function ItemWrapper({ item, children }) {
    if (item?.type === "url") {
        return (
            <a
                href={item.url}
                rel="noopener noreferrer"
                className="block h-full w-full"
            >
                {children}
            </a>
        );
    }

    return (
        <button
            type="button"
            onClick={item?.onClick}
            className="block h-full w-full"
        >
            {children}
        </button>
    );
}
