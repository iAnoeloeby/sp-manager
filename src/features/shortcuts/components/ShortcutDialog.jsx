import React, { useEffect, useState } from "react";

import { WarningCircleIcon } from "@phosphor-icons/react";
import { resolveValidUrl } from "@/services/urlService";
import WidgetDialog from "@/widgets/components/WidgetDialog";

const emptyForm = {
    id: "",
    title: "",
    url: "",
};

/**
 * Inner form fields for shortcut add/edit.
 * Designed to be rendered inside WidgetDialog (src/widgets/components/WidgetDialog).
 *
 * @param {{
 *   item?: import("@/contexts/LayoutContext").LayoutItem | null,
 *   onSave: (data: any) => void,
 *   formId?: string,
 * }} props
 */
export function ShortcutFormContent({
    item,
    onSave,
    formId = "shortcut-form",
}) {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        if (item) {
            setForm({
                id: item.id || "",
                title: item.title || "",
                url: item.url || "",
            });
        } else {
            setForm(emptyForm);
        }
        setError("");
        setIsChecking(false);
    }, [item]);

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
        <form
            id={formId}
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
    );
}

/**
 * Legacy wrapper — kept for backward compat.
 * New code should use WidgetDialog + ShortcutFormContent instead.
 */
export default function ShortcutForm({
    open,
    shortcut,
    onSave,
    onClose,
    onOpenChange,
}) {
    return (
        <WidgetDialog
            open={open}
            onOpenChange={onOpenChange}
            onClose={onClose}
            onSave={(data) => onSave(data)}
            title={shortcut ? "Edit shortcut" : "Add shortcut"}
            description={
                shortcut
                    ? "Update the shortcut title and destination."
                    : "Add a shortcut for fast access from every new tab."
            }
            isEditing={Boolean(shortcut)}
            formId="shortcut-form"
        >
            <ShortcutFormContent
                item={shortcut}
                onSave={onSave}
                formId="shortcut-form"
            />
        </WidgetDialog>
    );
}
