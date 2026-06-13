import React from "react";
import { cn } from "@/lib/utils";

export default function RightRail({ children, className = "" }) {
    return (
        <aside
            className={cn(
                "hidden flex-col gap-1 w-fit md:flex items-center my-2",
                className,
            )}
        >
            {children}
        </aside>
    );
}
