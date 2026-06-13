import React from "react";
import { cn } from "@/lib/utils";

export default function LeftRail({ children, className = "" }) {
    return (
        <aside
            className={cn(
                "hidden flex-col gap-1 md:flex md:w-fit items-center my-2",
                className,
            )}
        >
            {children}
        </aside>
    );
}
