import React from "react";

import { GearSixIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import { WidgetGrid } from "@/widgets";
import AddWidgetDialog from "@/widgets/components/AddWidgetDialog";

import { WIDGET_TYPES } from "@/widgets/constants/widgetTypes";

import { useLayout } from "@/contexts/Layout.context";
import { cn } from "@/lib/utils";

const settings = {
    rightRail: {
        columns: 1,
        cellSize: 60,
        gap: 2,
    },
};

export default function RightRail({ onOpenSettings, className = "" }) {
    const { rightRailItems, deleteItem } = useLayout();

    return (
        <aside
            className={cn(
                "hidden flex-col gap-1 w-fit md:flex items-center my-2 px-2",
                className,
            )}
        >
            <WidgetGrid
                items={rightRailItems}
                style={{
                    "--workspace-columns": settings.rightRail.columns,
                    "--workspace-cell-size": `${settings.rightRail.cellSize}px`,
                    "--workspace-gap": `${settings.rightRail.gap}px`,
                }}
                features={{
                    contextMenu: true,
                }}
                startItems={[
                    {
                        id: "open-settings",
                        render: () => (
                            <Button
                                variant="ghost"
                                size="icon-2xl"
                                onClick={() => onOpenSettings()}
                                className="text-foreground hover:text-foreground/70"
                            >
                                <GearSixIcon
                                    weight="regular"
                                    className="text-current"
                                />
                            </Button>
                        ),
                        cols: 1,
                        rows: 1,
                    },
                ]}
                endItems={[
                    {
                        id: "add",
                        render: () => (
                            <AddWidgetDialog
                                zone="rightRail"
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
