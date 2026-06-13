import React from "react";
import { cn } from "@/lib/utils";

export default function Item({ className = "", children }) {
    return (
        <div
            className={cn(
                "relative inline-flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-surface p-2 dark:border-white/20 z-10",
                className,
            )}
        >
            {children}
        </div>
    );
}

Item;
