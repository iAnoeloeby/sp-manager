import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { SpinnerGapIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { resolveValidUrl } from "@/features/shortcuts/services/shortcutService";

/**
 * @typedef {import("../services/dockItemsService").DockItemType} DockItemType
 */

const TYPE_OPTIONS =
    /** @type {{ value: DockItemType, label: string, hint: string }[]} */ ([
        {
            value: "shortcut",
            label: "Shortcut",
            hint: "Tile dengan icon & nama, click membuka URL.",
        },
        {
            value: "link",
            label: "Link",
            hint: "Anchor sederhana, click membuka URL.",
        },
        {
            value: "button",
            label: "Button",
            hint: "Tombol aksi (config menyusul).",
        },
    ]);

/** @type {Record<DockItemType, { name: string, url: string }>} */
const emptyForm = {
    shortcut: { name: "", url: "" },
    link: { name: "", url: "" },
    button: { name: "", url: "" },
};

export default function DockItemAdd({
    open,
    onOpenChange,
    onSave,
    defaultType = "shortcut",
}) {
    const [type, setType] = useState(/** @type {DockItemType} */ (defaultType));
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        if (!open) {
            setType(defaultType);
            setName("");
            setUrl("");
            setError("");
            setIsChecking(false);
        } else {
            setType(defaultType);
        }
    }, [open, defaultType]);

    async function handleSubmit(event) {
        event.preventDefault();
        if (isChecking) return;

        const trimmedName = name.trim();
        if (!trimmedName) {
            setError("Nama tidak boleh kosong.");
            return;
        }

        if (type !== "button" && !url.trim()) {
            setError("URL tidak boleh kosong untuk tipe ini.");
            return;
        }

        setError("");
        setIsChecking(true);

        try {
            let resolvedUrl = "";
            if (type === "button") {
                if (url.trim()) {
                    const result = await resolveValidUrl(url);
                    if (!result.url) {
                        setError(
                            result.reason === "format"
                                ? "Format URL tidak valid."
                                : "URL tidak dapat diakses.",
                        );
                        return;
                    }
                    resolvedUrl = result.url;
                }
            } else {
                const result = await resolveValidUrl(url);
                if (!result.url) {
                    setError(
                        result.reason === "format"
                            ? "Format URL tidak valid."
                            : "URL tidak dapat diakses.",
                    );
                    return;
                }
                resolvedUrl = result.url;
            }

            onSave({ type, name: trimmedName, url: resolvedUrl });
            onOpenChange(false);
        } finally {
            setIsChecking(false);
        }
    }

    const placeholders = emptyForm[type] || emptyForm.shortcut;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Dock Item</DialogTitle>
                    <DialogDescription>
                        Add a new item to your dock. You can choose between
                        different types of items, each with its own behavior and
                        appearance.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="dock-item-form"
                    className="space-y-4"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="space-y-1.5">
                        <label
                            htmlFor="dock-item-type"
                            className="text-sm font-medium"
                        >
                            Type
                        </label>
                        <div
                            id="dock-item-type"
                            role="radiogroup"
                            className="grid grid-cols-3 gap-2"
                        >
                            {TYPE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={type === opt.value}
                                    onClick={() => setType(opt.value)}
                                    className={
                                        "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors " +
                                        (type === opt.value
                                            ? "border-foreground/40 bg-foreground/5 text-foreground"
                                            : "border-border bg-background/40 text-muted-foreground hover:text-foreground")
                                    }
                                >
                                    <div className="text-sm">{opt.label}</div>
                                    <div className="mt-0.5 text-[11px] font-normal leading-tight text-muted-foreground">
                                        {opt.hint}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="dock-item-name"
                            className="text-sm font-medium"
                        >
                            Name
                        </label>
                        <input
                            id="dock-item-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={`e.g. ${placeholders.name || "My item"}`}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="dock-item-url"
                            className="text-sm font-medium"
                        >
                            URL{type === "button" ? " (optional)" : ""}
                        </label>
                        <input
                            id="dock-item-url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={
                                placeholders.url || "https://example.com"
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                            required={type !== "button"}
                        />
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                            <WarningCircleIcon
                                weight="bold"
                                className="mt-0.5 shrink-0"
                            />
                            <span>{error}</span>
                        </div>
                    )}
                </form>

                <DialogFooter showCloseButton>
                    <Button
                        type="submit"
                        form="dock-item-form"
                        disabled={isChecking}
                    >
                        {isChecking ? (
                            <>
                                <SpinnerGapIcon className="animate-spin" />
                                Checking...
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
