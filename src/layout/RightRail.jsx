import React from "react";

import { GearSixIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import DockItemGrid from "@/features/dockItems/components/DockItemGrid";

import { cn } from "@/lib/utils";

export default function RightRail({ workspace, className = "" }) {
    return (
        <aside
            className={cn(
                "hidden flex-col gap-2 w-fit md:flex items-center my-2 px-2",
                className,
            )}
        >
            <Button
                variant="ghost"
                size="icon-xl"
                onClick={() => workspace.setOpenSettings(true)}
                className="text-foreground hover:text-foreground/70"
            >
                <GearSixIcon weight="regular" className="text-current" />
            </Button>
            <DockItemGrid
                area="rightRail"
                items={workspace.item}
                onAdd={(item) => workspace.addToSlot("rightRailItems", item)}
                onDelete={(id) =>
                    workspace.deleteFromSlot("rightRailItems", id)
                }
                className="grid-cols-1"
            />
        </aside>
    );
}
