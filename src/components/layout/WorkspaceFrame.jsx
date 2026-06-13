import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function WorkspaceFrame({
    title = "Workspace",
    action = null,
    children,
    className = "",
}) {
    return (
        <Card className={cn("border-border/70 bg-surface/85", className)}>
            {(title || action) && (
                <CardHeader className="flex items-center justify-between">
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
            <CardContent>{children}</CardContent>
        </Card>
    );
}
