import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import WidgetGrid from "@/widgets/components/WidgetGrid";

export function WorkspaceRenderer({ sections, settings }) {
    return (
        <TabsContent key={sections.id} value={sections.id}>
            <WidgetGrid
                items={sections.items}
                style={{
                    "--workspace-columns": settings.workspace.columns,
                    "--workspace-cell-size": `${settings.workspace.cellSize}px`,
                    "--workspace-gap": `${settings.workspace.gap}px`,
                }}
                features={{ dropdown: true, contextMenu: true }}
            />
        </TabsContent>
    );
}
