import React from "react";
import { Button } from "../../../components/ui/Button";
import * as Phosphor from "@phosphor-icons/react";
import { searchEngines } from "../../../constants/searchEngines";
import BackgroundPicker from "./BackgroundPicker";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

export default function SettingsPanel({
    open,
    settings,
    onClose,
    onChange,
    onReset,
}) {
    function updateBackground(nextBackground) {
        onChange({ background: nextBackground });
    }

    const accentPreview = settings.mode === "dark" ? "#3f3f46" : "#f5f5f5";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                <div className="-mx-4 no-scrollbar max-h-[70vh] overflow-y-auto px-4 space-y-4">
                    <section className="rounded-lg border border-border/70 bg-background/35 p-4">
                        <div className="space-y-1">
                            <div className="inline-flex rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                                Appearance
                            </div>
                            <h3 className="text-base font-semibold">
                                Theme and page styling
                            </h3>
                            <p className="text-sm text-muted">
                                Keep the visual system controlled, clean, and
                                easy to use.
                            </p>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-medium"
                                    htmlFor="settings-mode"
                                >
                                    Mode
                                </label>
                                <select
                                    id="settings-mode"
                                    value={settings.mode}
                                    onChange={(event) =>
                                        onChange({ mode: event.target.value })
                                    }
                                    className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                                >
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-medium"
                                    htmlFor="settings-accent"
                                >
                                    Accent color
                                </label>
                                <input
                                    id="settings-accent"
                                    type="color"
                                    value={settings.accent || accentPreview}
                                    onChange={(event) =>
                                        onChange({ accent: event.target.value })
                                    }
                                    className="h-12 w-full rounded-theme border border-border bg-surface p-1 accent-accent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-medium"
                                    htmlFor="settings-radius"
                                >
                                    Corner radius
                                </label>
                                <input
                                    id="settings-radius"
                                    type="number"
                                    min="8"
                                    max="28"
                                    value={settings.radius}
                                    onChange={(event) =>
                                        onChange({
                                            radius: Number(event.target.value),
                                        })
                                    }
                                    className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-lg border border-border/70 bg-background/35 p-4">
                        <div className="space-y-1">
                            <div className="inline-flex rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                                Start page
                            </div>
                            <h3 className="text-base font-semibold">
                                Greeting, search, and clock preferences
                            </h3>
                            <p className="text-sm text-muted">
                                Small preferences that keep the homepage
                                personal and focused.
                            </p>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-medium"
                                    htmlFor="settings-name"
                                >
                                    Display name
                                </label>
                                <input
                                    id="settings-name"
                                    type="text"
                                    value={settings.displayName}
                                    onChange={(event) =>
                                        onChange({
                                            displayName: event.target.value,
                                        })
                                    }
                                    className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-medium"
                                    htmlFor="settings-engine"
                                >
                                    Search engine
                                </label>
                                <select
                                    id="settings-engine"
                                    value={settings.searchEngine}
                                    onChange={(event) =>
                                        onChange({
                                            searchEngine: event.target.value,
                                        })
                                    }
                                    className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                                >
                                    {searchEngines.map((engine) => (
                                        <option
                                            key={engine.id}
                                            value={engine.id}
                                        >
                                            {engine.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-medium"
                                    htmlFor="settings-clock-format"
                                >
                                    Clock format
                                </label>
                                <select
                                    id="settings-clock-format"
                                    value={settings.clockFormat}
                                    onChange={(event) =>
                                        onChange({
                                            clockFormat: event.target.value,
                                        })
                                    }
                                    className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                                >
                                    <option value="24h">24-hour</option>
                                    <option value="12h">12-hour</option>
                                </select>
                            </div>

                            <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface/60 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={settings.showSeconds}
                                    onChange={(event) =>
                                        onChange({
                                            showSeconds: event.target.checked,
                                        })
                                    }
                                    className="accent-accent"
                                />
                                <span className="text-sm font-medium">
                                    Show seconds
                                </span>
                            </label>
                        </div>
                    </section>

                    <section className="rounded-lg border border-border/70 bg-background/35 p-4">
                        <div className="space-y-1">
                            <div className="inline-flex rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                                Background
                            </div>
                            <h3 className="text-base font-semibold">
                                Choose default, solid, gradient, or live
                                wallpaper
                            </h3>
                            <p className="text-sm text-muted">
                                Default follows the active theme. Solid is for
                                custom colors. Live Wallpaper uses a remote URL,
                                while Custom Wallpaper lets you use your own
                                URL.
                            </p>
                        </div>
                        <div className="mt-4">
                            <BackgroundPicker
                                background={settings.background}
                                mode={settings.mode}
                                onChange={updateBackground}
                            />
                        </div>
                    </section>
                </div>

                <DialogFooter className="sm:justify-between gap-3">
                    <Button onClick={onReset} variant="outline" size="lg">
                        Reset
                    </Button>
                    <Button onClick={onClose} variant="default" size="lg">
                        <span>Save</span>
                        <Phosphor.CheckCircleIcon
                            weight="fill"
                            className="size-5"
                        />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
