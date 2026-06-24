import React from "react";

import { CheckCircleIcon, SpinnerGapIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

/**
 * @param {{
 *   open: boolean,
 *   onOpenChange: (open: boolean) => void,
 *   onClose: () => void,
 *   onSave: (data: any) => Promise<void> | void,
 *   title: string,
 *   description?: string,
 *   isEditing?: boolean,
 *   saving?: boolean,
 *   children: React.ReactNode,
 *   formId?: string,
 * }} props
 */
export default function WidgetDialog({
    open,
    onOpenChange,
    onClose,
    onSave,
    title,
    description,
    isEditing = false,
    saving = false,
    formId,
    children,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                <main className="h-[35vh] max-h-[50vh] overflow-x-visible flex flex-col">
                    {children}
                </main>

                <DialogFooter className="sm:justify-between">
                    <Button
                        onClick={onClose}
                        disabled={saving}
                        className="border border-border bg-background text-foreground hover:bg-background/80"
                    >
                        Cancel
                    </Button>
                    <Button
                        type={formId ? "submit" : "button"}
                        form={formId}
                        onClick={formId ? undefined : () => onSave()}
                        disabled={saving}
                        className="group"
                    >
                        {saving ? (
                            <>
                                Saving
                                <SpinnerGapIcon
                                    weight="bold"
                                    className="animate-spin"
                                />
                            </>
                        ) : (
                            <>
                                {isEditing ? "Update" : "Save"}
                                <CheckCircleIcon
                                    weight="fill"
                                    className="fill-background group-hover:fill-green-500 transition-colors duration-150"
                                />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
