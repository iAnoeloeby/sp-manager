import React from "react";
import { buildBackgroundImage } from "../utils/backgroundUtils";
import { refreshDailyWallpaper } from "../../../services/wallpaperService";

const typeOptions = [
    { value: "default", label: "Default" },
    { value: "gradient", label: "Gradient" },
    { value: "solid", label: "Solid" },
    { value: "live", label: "Live Wallpaper" },
    { value: "custom", label: "Custom Wallpaper" },
];

export default function BackgroundPicker({
    background,
    mode = "light",
    onChange,
}) {
    async function useLiveWallpaper() {
        const wallpaper = await refreshDailyWallpaper(true);
        if (wallpaper?.url) {
            onChange({
                ...background,
                type: "image",
                source: "live",
                imageUrl: wallpaper.url,
            });
        }
    }

    async function getNewOneWallpaper() {
        const wallpaper = await refreshDailyWallpaper(true, {
            forceNewSeed: true,
        });
        if (wallpaper?.url) {
            onChange({
                ...background,
                type: "image",
                source: "live",
                imageUrl: wallpaper.url,
            });
        }
    }

    function useCustomWallpaper() {
        onChange({
            ...background,
            type: "image",
            source: "custom",
        });
    }

    async function handleTypeChange(value) {
        if (value === "live") {
            await useLiveWallpaper();
            return;
        }

        if (value === "custom") {
            useCustomWallpaper();
            return;
        }

        onChange({
            ...background,
            type: value,
            source: undefined,
        });
    }

    const selectedType =
        background.type === "image"
            ? background.source === "live"
                ? "live"
                : "custom"
            : background.type;

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-border/70 bg-background/40 p-3 shadow-inner">
                <div
                    className="h-24 rounded-2xl border border-border/70 bg-surface/80 shadow-sm"
                    style={{
                        backgroundImage: buildBackgroundImage(background),
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            </div>

            <div className="space-y-2">
                <label
                    className="block text-sm font-medium"
                    htmlFor="background-type"
                >
                    Background type
                </label>
                <select
                    id="background-type"
                    value={selectedType}
                    onChange={(event) => handleTypeChange(event.target.value)}
                    className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                >
                    {typeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {background.type === "solid" ? (
                <div className="space-y-2">
                    <div className="space-y-2 pt-1">
                        <label
                            className="block text-sm font-medium"
                            htmlFor="background-solid-custom"
                        >
                            Custom solid color
                        </label>
                        <input
                            id="background-solid-custom"
                            type="color"
                            value={background.value}
                            onChange={(event) =>
                                onChange({
                                    ...background,
                                    value: event.target.value,
                                })
                            }
                            className="h-12 w-full rounded-theme border border-border bg-surface p-1 accent-accent"
                        />
                    </div>
                </div>
            ) : null}

            {background.type === "default" ? (
                <div className="space-y-3 rounded-3xl border border-border/70 bg-background/40 p-4">
                    <div>
                        <div className="text-sm font-medium">
                            Default background
                        </div>
                        <div className="mt-1 text-sm text-muted">
                            {mode === "dark" ? "Neutral 900" : "Neutral 200"}
                        </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl border border-border/70 bg-surface px-4 py-3 text-sm text-muted">
                            Light mode preview:{" "}
                            <span className="text-foreground">#ffffff</span>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-surface px-4 py-3 text-sm text-muted">
                            Dark mode preview:{" "}
                            <span className="text-foreground">#111827</span>
                        </div>
                    </div>
                </div>
            ) : null}

            {background.type === "gradient" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label
                            className="block text-sm font-medium"
                            htmlFor="background-value-1"
                        >
                            Gradient start
                        </label>
                        <input
                            id="background-value-1"
                            type="color"
                            value={background.value}
                            onChange={(event) =>
                                onChange({
                                    ...background,
                                    value: event.target.value,
                                })
                            }
                            className="h-12 w-full rounded-theme border border-border bg-surface p-1 accent-accent"
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            className="block text-sm font-medium"
                            htmlFor="background-value-2"
                        >
                            Gradient end
                        </label>
                        <input
                            id="background-value-2"
                            type="color"
                            value={background.value2}
                            onChange={(event) =>
                                onChange({
                                    ...background,
                                    value2: event.target.value,
                                })
                            }
                            className="h-12 w-full rounded-theme border border-border bg-surface p-1 accent-accent"
                        />
                    </div>
                </div>
            ) : null}

            {background.type === "image" ? (
                <div className="space-y-3">
                    {background.source === "live" ? (
                        <div className="rounded-3xl border border-border/70 bg-background/40 p-4 text-sm text-muted">
                            Daily wallpaper is sourced from a remote image URL
                            and refreshed automatically.
                        </div>
                    ) : null}

                    {background.source === "live" ? (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={useLiveWallpaper}
                                className="rounded-theme border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background/60"
                            >
                                Refresh current wallpaper
                            </button>
                            <button
                                type="button"
                                onClick={getNewOneWallpaper}
                                className="rounded-theme border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background/60"
                            >
                                Generate new wallpaper
                            </button>
                        </div>
                    ) : null}

                    {background.source === "custom" ? (
                        <div className="space-y-2">
                            <label
                                className="block text-sm font-medium"
                                htmlFor="background-image-url"
                            >
                                Image URL
                            </label>
                            <input
                                id="background-image-url"
                                type="url"
                                value={background.imageUrl}
                                onChange={(event) =>
                                    onChange({
                                        ...background,
                                        imageUrl: event.target.value,
                                    })
                                }
                                className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                                placeholder="https://example.com/background.jpg"
                            />
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <label
                            className="block text-sm font-medium"
                            htmlFor="background-overlay"
                        >
                            Overlay strength
                        </label>
                        <input
                            id="background-overlay"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={background.overlay}
                            onChange={(event) =>
                                onChange({
                                    ...background,
                                    overlay: Number(event.target.value),
                                })
                            }
                            className="w-full accent-accent"
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
