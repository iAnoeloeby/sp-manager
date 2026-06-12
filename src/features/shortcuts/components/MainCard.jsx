import React, { useState } from "react";
import EmptyState from "../../../components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import ShortcutGrid from "@/features/shortcuts/components/ShortcutGrid";
import ShortcutForm from "@/features/shortcuts/components/ShortcutDialog";

export default function MainCard({
    shortcuts,
    onAddShortcut,
    onUpdateShortcut,
    onDeleteShortcut,
}) {
    const [isShortcutFormOpen, setIsShortcutFormOpen] = useState(false);
    const [editingShortcut, setEditingShortcut] = useState(null);

    function openShortcutForm(shortcut = null) {
        setEditingShortcut(shortcut);
        setIsShortcutFormOpen(true);
    }

    function closeShortcutForm() {
        setIsShortcutFormOpen(false);
        setEditingShortcut(null);
    }

    function handleDialogOpenChange(nextOpen) {
        if (!nextOpen) {
            closeShortcutForm();
        }
    }

    function saveShortcut(nextShortcut) {
        if (editingShortcut) {
            onUpdateShortcut(editingShortcut.id, nextShortcut);
        } else {
            onAddShortcut(nextShortcut);
        }

        closeShortcutForm();
    }

    if (!shortcuts.length) {
        return (
            <EmptyState
                title="No shortcuts yet"
                description="Add your favorite sites for fast access from every new tab."
                action={
                    <div className="flex items-center gap-3">
                        <Button
                            label="Add shortcut"
                            variant="outline"
                            size="icon-lg"
                            onClick={() => openShortcutForm()}
                        >
                            <PlusIcon weight="bold" size={30} color="currentColor" />
                        </Button>
                        <ShortcutForm
                            open={isShortcutFormOpen}
                            shortcut={editingShortcut}
                            onClose={closeShortcutForm}
                            onOpenChange={handleDialogOpenChange}
                            onSave={saveShortcut}
                        />
                    </div>
                }
            />
        );
    }

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="inline-flex rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                        Quick access
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        label="Add shortcut"
                        variant="outline"
                        size="icon-lg"
                        onClick={() => openShortcutForm()}
                    >
                        <PlusIcon weight="bold" size={30} color="currentColor" />
                    </Button>
                    <ShortcutForm
                        open={isShortcutFormOpen}
                        shortcut={editingShortcut}
                        onClose={closeShortcutForm}
                        onOpenChange={handleDialogOpenChange}
                        onSave={saveShortcut}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ShortcutGrid
                    shortcuts={shortcuts}
                    onEdit={openShortcutForm}
                    onDelete={onDeleteShortcut}
                />
            </CardContent>
        </Card>
    );
}
