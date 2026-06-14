import React, { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { PlusIcon } from "@phosphor-icons/react";

const itemVariants = cva(
    "group/item relative inline-flex shrink-0 p-2 items-center justify-center rounded-lg border border-transparent bg-clip-padding transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: "bg-surface text-primary-foreground",
                ghost: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-transparent dark:hover:bg-input/30",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
            },
            size: {
                default: "size-12 [&_svg:not([class*='size-'])]:size-6",
                xs: "size-8 [&_svg:not([class*='size-'])]:size-4",
                sm: "size-10 [&_svg:not([class*='size-'])]:size-5",
                lg: "size-14 [&_svg:not([class*='size-'])]:size-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

/**
 * @typedef {Object} ItemProps
 * @property {boolean} [asChild]
 * @property {React.MouseEventHandler<HTMLDivElement>} [onClick]
 * @property {React.ReactNode} children
 * @property {string} [className]
 * @property {"default" | "ghost" | "secondary"} [variant]
 * @property {"xs"|"sm"|"default"|"lg"} [size]
 */

/** @type {React.ForwardRefRenderFunction<HTMLDivElement, ItemProps>} */
const Item = forwardRef(
    (
        {
            asChild = false,
            className = "",
            variant = "default",
            size = "default",
            ...props
        },
        ref,
    ) => {
        return (
            <div
                ref={ref}
                className={cn(itemVariants({ variant, size }), className)}
                {...props}
            />
        );
    },
);

Item.displayName = "Item";

function ItemAdd({ actions }) {
    return (
        <Item
            onClick={actions}
            variant="secondary"
            className="relative z-2 bg-surface/50 group-hover:border-border"
        >
            <PlusIcon size={20} weight="bold" aria-hidden="true" />
        </Item>
    );
}

export { Item, ItemAdd };
