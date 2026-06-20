import React from "react";

import { GearSixIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import DockItemGrid from "@/features/dockItems/components/DockItemGrid";
import DockItemAdd from "@/features/dockItems/components/DockItemAdd";

import { cn } from "@/lib/utils";

export default function BottomDock({ workspace, className = "" }) {
    return (
        <section className="fixed inset-x-0 bottom-0 z-30 mx-auto">
            <Card className={cn("w-full rounded-none p-2", className)}>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon-xl"
                            onClick={() => workspace.setOpenSettings(true)}
                            className="text-foreground hover:text-foreground/70"
                        >
                            <GearSixIcon
                                weight="regular"
                                className="text-current"
                            />
                        </Button>
                        <Button
                            variant={
                                workspace.editMode.editingAll
                                    ? "secondary"
                                    : "ghost"
                            }
                            size="icon-xl"
                            aria-pressed={workspace.editMode.editingAll}
                            onClick={workspace.editMode.toggleGlobalEdit}
                            className="text-foreground hover:text-foreground/70"
                        >
                            <PencilSimpleIcon
                                weight="regular"
                                className="text-current"
                            />
                        </Button>
                    </div>
                    <DockItemGrid
                        area="bottomDock"
                        items={workspace.item}
                        onAdd={() => workspace.openGlobalEditor("dockItems")}
                        onDelete={(id) =>
                            workspace.deleteFromSlot("dockItems", id)
                        }
                        className="grid-cols-12 grid-rows-none"
                    />
                </div>
                <DockItemAdd
                    open={workspace.globalEditorOpen}
                    onOpenChange={workspace.setGlobalEditorOpen}
                    onSave={workspace.handleGlobalSave}
                />
            </Card>
        </section>
    );
}
