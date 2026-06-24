import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { WorkspaceRenderer } from "@/features/workspaceFrame/components/WorkspaceRenderer";

import { cn } from "@/lib/utils";
import { useLayout } from "@/contexts/LayoutContext";

export default function WorkspaceFrame({
    title = "Workspace",
    className = "",
}) {
    const { workspaceItems } = useLayout();

    const [activeTabId, setActiveTabId] = React.useState(null);
    const activeSection =
        workspaceItems.find((s) => s.id === activeTabId) ?? workspaceItems[0];

    const action = null; // TODO: add "Add Section" button

    return (
        <Card
            className={cn(
                "min-h-[10rem] bg-surface border-border drop-shadow-md",
                className,
            )}
        >
            {(title || action) && (
                <CardHeader className="flex flex-col items-center justify-between">
                    {title ? (
                        <div className="space-y-1">
                            <div className="inline-flex rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                                {title}
                            </div>
                        </div>
                    ) : (
                        <div />
                    )}

                    {action}
                </CardHeader>
            )}
            <CardContent>
                {activeSection && (
                <Tabs
                    defaultValue={activeSection.id}
                        onValueChange={setActiveTabId}
                    className="w-full"
                >
                    <TabsList className="">
                        {workspaceItems.map((section) => (
                            <TabsTrigger
                                key={section.id}
                                value={section.id}
                                className="px-8"
                            >
                                {section.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {workspaceItems.map((section) => (
                        <WorkspaceRenderer
                            key={section.id}
                            sections={section}
                            settings={{
                                workspace: {
                                    columns: 8,
                                    cellSize: 80,
                                    gap: 12,
                                },
                            }}
                        />
                    ))}
                </Tabs>
                )}
            </CardContent>
        </Card>
    );
}
