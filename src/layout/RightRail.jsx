import React from "react";
import { cn } from "@/lib/utils";

export default function RightRail({ children, className = "" }) {
    return (
        <aside
            className={cn(
                "hidden flex-col gap-2 w-fit md:flex items-center my-2 px-2",
                className,
            )}
        >
            {children}
        </aside>
    );
}
