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
import {
    CheckCircleIcon,
    WarningCircleIcon,
    SpinnerGapIcon,
} from "@phosphor-icons/react";
import { resolveValidUrl } from "../services/shortcutService";

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
    const [error, setError] = useState("");
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        if (shortcut) {
            setForm({
                id: shortcut.id || "",
                title: shortcut.title || "",
                url: shortcut.url || "",
            });
        } else {
            setForm(emptyForm);
        }
        setError("");
        setIsChecking(false);
    }, [shortcut, open]);

    async function handleSubmit(event) {
        event.preventDefault();
        if (isChecking) return;

        setError("");
        setIsChecking(true);

        try {
            const result = await resolveValidUrl(form.url);

            if (!result.url) {
                if (result.reason === "format") {
                    setError(
                        "Format URL tidak valid. Contoh: tokopedia.com atau www.tokopedia.com",
                    );
                } else {
                    setError(
                        "URL tidak dapat diakses. Periksa koneksi Anda atau pastikan alamat website benar.",
                    );
                }
                return;
            }

            onSave({
                id: form.id,
                title: form.title.trim(),
                url: result.url,
            });
        } finally {
            setIsChecking(false);
        }
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
                    noValidate
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
                            type="text"
                            required
                            value={form.url}
                            onChange={(event) => {
                                if (error) setError("");
                                setForm((current) => ({
                                    ...current,
                                    url: event.target.value,
                                }));
                            }}
                            aria-invalid={error ? "true" : "false"}
                            className={`w-full rounded-theme border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 ${
                                error
                                    ? "border-destructive focus:ring-destructive/20"
                                    : "border-border focus:ring-accent/20"
                            }`}
                            placeholder="github.com"
                        />
                        {error ? (
                            <p
                                role="alert"
                                className="flex items-start gap-1.5 text-xs text-destructive"
                            >
                                <WarningCircleIcon
                                    size={14}
                                    weight="fill"
                                    className="mt-0.5 shrink-0"
                                />
                                <span>{error}</span>
                            </p>
                        ) : null}
                    </div>
                </form>

                <DialogFooter className="sm:justify-between">
                    <Button
                        onClick={onClose}
                        disabled={isChecking}
                        className="border border-border bg-background text-foreground hover:bg-background/80"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="shortcut-form"
                        disabled={isChecking}
                        className="group"
                    >
                        {isChecking ? (
                            <>
                                Checking
                                <SpinnerGapIcon
                                    weight="bold"
                                    className="animate-spin"
                                />
                            </>
                        ) : (
                            <>
                                {shortcut ? "Update shortcut" : "Save shortcut"}
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
