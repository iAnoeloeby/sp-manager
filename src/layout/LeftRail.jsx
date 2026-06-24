import React from "react";

import { WidgetGrid } from "@/widgets";
import AddWidgetDialog from "@/widgets/components/AddWidgetDialog";

import { WIDGET_TYPES } from "@/widgets/constants/widgetTypes";

import { useLayout } from "@/contexts/Layout.context";
import { cn } from "@/lib/utils";

const settings = {
    leftRail: {
        columns: 1,
        cellSize: 60,
        gap: 2,
    },
};

export default function LeftRail({ className = "" }) {
    const { leftRailItems, deleteItem } = useLayout();

    return (
        <aside
            className={cn(
                "hidden flex-col gap-2 md:flex md:w-fit items-center my-2 pt-[62px] px-2",
                className,
            )}
        >
            <WidgetGrid
                items={leftRailItems}
                style={{
                    "--workspace-columns": settings.leftRail.columns,
                    "--workspace-cell-size": `${settings.leftRail.cellSize}px`,
                    "--workspace-gap": `${settings.leftRail.gap}px`,
                }}
                features={{
                    contextMenu: true,
                }}
                endItems={[
                    {
                        id: "add",
                        render: () => (
                            <AddWidgetDialog
                                zone="leftRail"
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
        </aside>
    );
}
