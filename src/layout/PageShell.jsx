import React from "react";
import SearchBar from "@/features/search/components/SearchBar";
import ClockWidget from "@/features/clock/components/ClockWidget";
import WorkspaceFrame from "@/features/workspaceFrame/components/WorkspaceFrame";
import DockItemGrid from "@/features/dockItems/components/DockItemGrid";
import ShortcutWidget from "@/features/shortcuts/layout/ShortcutWidget";
import { cn } from "@/lib/utils";

export default function PageShell({ workspace, settings, className = "" }) {
    return (
        <div
            className={cn(
                "mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8",
                className,
            )}
        >
            <div className="min-h-[calc(100vh-7rem)] w-full min-w-0 items-center justify-center grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_fit-content] xl:gap-8">
                <div className="flex min-w-0 items-center justify-center">
                    <ClockWidget
                        format={settings.clockFormat}
                        showSeconds={settings.showSeconds}
                    />
                </div>

                <section className="min-w-0">
                    <SearchBar engineId={settings.searchEngine} />
                </section>

                <section className="min-w-0">
                    <WorkspaceFrame title="Main workspace">
                        {workspace.item.length > 0 ? (
                            <DockItemGrid
                                area="workspace"
                                items={workspace.item}
                                className="grid grid-cols-12"
                            />
                        ) : (
                            <ShortcutWidget
                                shortcuts={workspace.shortcuts}
                                onAddShortcut={workspace.onAddShortcut}
                                onUpdateShortcut={workspace.onUpdateShortcut}
                                onDeleteShortcut={workspace.onDeleteShortcut}
                            />
                        )}
                    </WorkspaceFrame>
                </section>
            </div>
        </div>
    );
}
