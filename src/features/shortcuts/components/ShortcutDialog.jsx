import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { CheckCircleIcon } from "@phosphor-icons/react";

const emptyForm = {
    id: "",
    title: "",
    url: "",
};

export default function ShortcutForm({
    open,
    shortcut,
    onSave,
    onClose,
    onOpenChange,
}) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (shortcut) {
            setForm({
                id: shortcut.id || "",
                title: shortcut.title || "",
                url: shortcut.url || "",
            });
            return;
        }

        setForm(emptyForm);
    }, [shortcut, open]);

    function handleSubmit(event) {
        event.preventDefault();

        onSave({
            id: form.id,
            title: form.title.trim(),
            url: form.url,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {shortcut ? "Edit shortcut" : "Add shortcut"}
                    </DialogTitle>
                    <DialogDescription>
                        {shortcut
                            ? "Update the shortcut title and destination."
                            : "Add a shortcut for fast access from every new tab."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="shortcut-form"
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div className="space-y-2">
                        <label
                            className="block text-sm font-medium"
                            htmlFor="shortcut-title"
                        >
                            Shortcut Name
                        </label>
                        <input
                            id="shortcut-title"
                            type="text"
                            required
                            value={form.title}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    title: event.target.value,
                                }))
                            }
                            className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                            placeholder="GitHub"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="block text-sm font-medium"
                            htmlFor="shortcut-url"
                        >
                            URL
                        </label>
                        <input
                            id="shortcut-url"
                            type="url"
                            required
                            value={form.url}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    url: event.target.value,
                                }))
                            }
                            className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                            placeholder="github.com"
                        />
                    </div>
                </form>

                <DialogFooter className="flex sm:justify-between">
                    <Button
                        onClick={onClose}
                        className="border border-border bg-background text-foreground hover:bg-background/80"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="shortcut-form"
                        className="group"
                    >
                        {shortcut ? "Update shortcut" : "Save shortcut"}

                        <CheckCircleIcon
                            weight="fill"
                            className="fill-white group-hover:fill-green-500 transition-colors duration-150"
                        />
                        {/* <CheckCircleIcon
                            weight="regular"
                            className="block group-hover:hidden fill-white"
                        />
                        <CheckCircleIcon
                            weight="fill"
                            className="hidden group-hover:block fill-green-400"
                        /> */}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
