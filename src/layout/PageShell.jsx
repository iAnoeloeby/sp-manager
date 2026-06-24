import React from "react";

import SearchBar from "@/features/search/components/SearchBar";
import ClockWidget from "@/features/clock/components/ClockWidget";
import WorkspaceFrame from "@/features/workspaceFrame/components/WorkspaceFrame";

import { cn } from "@/lib/utils";

export default function PageShell({ className = "" }) {
    return (
        <div
            className={cn(
                "mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8",
                className,
            )}
        >
            <div className="flex min-h-[calc(100vh-8rem)] min-w-0 flex-col gap-6 xl:gap-8 items-center">
                <div className="flex min-w-0 items-end justify-center pt-40">
                    <ClockWidget />
                </div>

                <section className="py-10">
                    <SearchBar />
                </section>

                <section className="min-w-0 w-full max-w-4xl pb-[10rem]">
                    <WorkspaceFrame />
                </section>
            </div>
        </div>
    );
}
