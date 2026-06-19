export function getBackgroundMode(background = {}) {
    if (!background) return "default";

    switch (background.mode) {
        case "solid-background":
            return "solid-background";

        case "gradient-background":
            return "gradient-background";

        case "image-background":
            return background.source === "live-wallpaper"
                ? "live-wallpaper-background"
                : "custom-wallpaper-background";

        default:
            return "default";
    }
}

export function buildBackgroundImage(background = {}) {
    const mode = background.mode || "default";
    const value =
        background.value === "default"
            ? "var(--background)"
            : background.value || "var(--background)";
    const value2 = background.value2 || "var(--primary)";
    const imageUrl = String(background.imageUrl || "").trim();
    const overlay = Number.isFinite(Number(background.overlay))
        ? Number(background.overlay)
        : 0.45;

    if (mode === "image-background" && imageUrl) {
        return `linear-gradient(rgba(2, 6, 23, ${overlay}), rgba(2, 6, 23, ${overlay})), url("${imageUrl}")`;
    }

    if (mode === "gradient-background") {
        return `linear-gradient(135deg, ${value}, ${value2})`;
    }

    if (mode === "solid-background") {
        return `linear-gradient(${value}, ${value})`;
    }

    return `linear-gradient(var(--background), var(--background))`;
}
