import React from "react";

import { GearSixIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import DockItemGrid from "@/features/dockItems/components/DockItemGrid";

import { cn } from "@/lib/utils";

export default function LeftRail({ workspace, className = "" }) {
    return (
        <aside
            className={cn(
                "hidden flex-col gap-2 md:flex md:w-fit items-center my-2 px-2",
                className,
            )}
        >
            {/* <Button
                variant="ghost"
                size="icon-xl"
                onClick={() => workspace.setOpenSettings(true)}
                className="text-foreground hover:text-foreground/70"
            >
                <GearSixIcon weight="regular" className="text-current" />
            </Button> */}
            <DockItemGrid
                area="leftRail"
                items={workspace.item}
                onAdd={(item) => workspace.addToSlot("leftRailItems", item)}
                onDelete={(id) => workspace.deleteFromSlot("leftRailItems", id)}
                className="grid-cols-1"
            />
        </aside>
    );
}
