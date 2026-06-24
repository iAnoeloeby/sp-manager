import React from "react";

import { Card } from "@/components/ui/Card";
import { WidgetGrid } from "@/widgets";
import AddWidgetDialog from "@/widgets/components/AddWidgetDialog";

import { WIDGET_TYPES } from "@/widgets/constants/widgetTypes";

import { useLayout } from "@/contexts/Layout.context";
import { cn } from "@/lib/utils";

const settings = {
    bottomDock: {
        columns: 22,
        cellSize: 60,
        gap: 2,
    },
};

export default function BottomDock({ className = "" }) {
    const { dockItems, deleteItem } = useLayout();

    return (
        <section className="fixed inset-x-0 bottom-0 z-30 mx-auto p-2">
            <Card className={cn("w-full rounded-md p-1", className)}>
                <div className="flex items-center justify-between gap-3">
                    <WidgetGrid
                        items={dockItems}
                        style={{
                            "--workspace-columns": settings.bottomDock.columns,
                            "--workspace-cell-size": `${settings.bottomDock.cellSize}px`,
                            "--workspace-gap": `${settings.bottomDock.gap}px`,
                        }}
                        features={{
                            contextMenu: true,
                        }}
                        endItems={[
                            {
                                id: "add",
                                render: () => (
                                    <AddWidgetDialog
                                        zone="dock"
                                        allowedTypes={[
                                            WIDGET_TYPES.ACTION,
                                            WIDGET_TYPES.SHORTCUT,
                                            WIDGET_TYPES.TOOL,
                                        ]}
                                    />
                                ),
                                cols: 1,
                                rows: 1,
                            },
                        ]}
                    />
                </div>
            </Card>
        </section>
    );
}
