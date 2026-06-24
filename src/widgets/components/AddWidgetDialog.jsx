import React, { useState } from "react";

import { ItemAdd } from "@/components/ui/Item";
import { useLayout } from "@/contexts/LayoutContext";
import { widgetRegistry } from "@/widgets/registry/widgetRegistry";
import WidgetDialog from "@/widgets/components/WidgetDialog";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";

/**
 * @param {{
 *   zone: import("@/contexts/LayoutContext").Zone,
 *   allowedTypes?: string[]
 * }} props
 */
export default function AddWidgetDialog({ zone, allowedTypes }) {
    const { addItem } = useLayout();
    const [open, setOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const types = allowedTypes
        ? allowedTypes.filter((t) => widgetRegistry[t])
        : Object.keys(widgetRegistry);

    const definition = selectedType ? widgetRegistry[selectedType] : null;
    const DialogForm = definition?.dialogComponent;
    const PreviewComponent = definition?.component;

    function handleSave(payload) {
        if (!selectedType) return;
        addItem(zone, { type: selectedType, ...payload });
        setSelectedType(null);
        setOpen(false);
    }

    function handleClose() {
        setSelectedType(null);
        setOpen(false);
    }

    if (!open) {
        return <ItemAdd onClick={() => setOpen(true)} />;
    }

    return (
        <WidgetDialog
            open
            onOpenChange={(v) => {
                if (!v) handleClose();
            }}
            onClose={handleClose}
            onSave={handleSave}
            title="Create Widget for your Workspace"
            description="Choose a widget type to add."
            formId={selectedType && DialogForm ? "add-widget-form" : undefined}
        >
            <div className="mb-4 flex flex-wrap gap-2">
                {types.map((type) => (
                    <Button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        data-selected={type === selectedType || undefined}
                        variant="outline"
                        size="lg"
                        className="data-selected:border-border data-selected:bg-muted/50 data-selected:text-accent-foreground"
                    >
                        {type}
                    </Button>
                ))}
            </div>

            {selectedType && (
                <>
                    <Separator className="mb-4" />

                    <div className="flex gap-6">
                        <div className="min-w-0 flex-1">
                            {DialogForm ? (
                                <DialogForm
                                    onSave={handleSave}
                                    formId="add-widget-form"
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    A new {selectedType} widget will be added
                                    with default settings.
                                </p>
                            )}
                        </div>

                        {PreviewComponent && (
                            <div className="flex shrink-0 w-fit flex-col items-center gap-2">
                                <p className="text-xs text-muted-foreground">
                                    Preview
                                </p>
                                <div
                                    className="bg-muted-foreground/20 flex items-center justify-center rounded"
                                    style={{
                                        width: definition.cols
                                            ? `${definition.cols * 100}px`
                                            : "100px",
                                        height: definition.rows
                                            ? `${definition.rows * 100}px`
                                            : "100px",
                                    }}
                                >
                                    <PreviewComponent
                                        item={{
                                            id: "preview",
                                            type: selectedType,
                                            title: `${selectedType}`,
                                            cols: definition.cols,
                                            rows: definition.rows,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </WidgetDialog>
    );
}
