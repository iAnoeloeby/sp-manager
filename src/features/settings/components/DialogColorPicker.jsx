"use client";
import React from "react";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";

import ColorPicker from "@/features/settings/components/ColorPicker";
import { Button } from "@/components/ui/Button";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";

export default function DialogColorPicker({ value, onChange, children }) {
    const color = value ?? "#E5E5E5";

    const [open, setOpen] = React.useState(false);
    const [draft, setDraft] = React.useState(value);

    const hasChanges = draft !== color;

    React.useEffect(() => {
        if (open) {
            setDraft(color);
        }
    }, [open, color]);

    const cancel = () => {
        setOpen(false);
    };

    const applyColor = () => {
        onChange(draft);
        setOpen(false);
    };

    const revertChanges = () => {
        setDraft(color);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-xl p-4 h-[70vh] max-h-[70vh] flex flex-col shadow-sm">
                <DialogHeader>
                    <DialogTitle className="mt-4">Pick a color</DialogTitle>
                </DialogHeader>
                <main className="w-full h-full border-2 rounded-xl p-1">
                    <div
                        className="w-full h-full flex items-center justify-center gap-2 rounded-lg relative"
                        style={{ backgroundColor: draft ?? "transparent" }}
                    >
                        <ColorPicker defaultValue={draft} onCommit={setDraft} />
                        <Button
                            onClick={revertChanges}
                            variant="outline"
                            size="icon"
                            className="absolute -top-px -right-px"
                        >
                            <ArrowCounterClockwiseIcon />
                        </Button>
                    </div>
                </main>
                <DialogFooter className="sm:justify-between gap-3">
                    <Button onClick={cancel} variant="ghost" size="lg">
                        Cancel
                    </Button>
                    <Button
                        disabled={!hasChanges}
                        onClick={applyColor}
                        variant="default"
                        size="lg"
                    >
                        Apply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
