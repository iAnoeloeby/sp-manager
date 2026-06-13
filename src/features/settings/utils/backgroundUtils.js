export function buildBackgroundImage(background = {}) {
    const type = background.type || "gradient";
    const value =
        background.value === "default"
            ? "var(--background)"
            : background.value || "var(--background)";
    const value2 = background.value2 || "var(--primary)";
    const imageUrl = String(background.imageUrl || "").trim();
    const overlay = Number.isFinite(Number(background.overlay))
        ? Number(background.overlay)
        : 0.45;

    if (type === "default") {
        return `linear-gradient(var(--background), var(--background))`;
    }

    if (type === "image" && imageUrl) {
        return `linear-gradient(rgba(2, 6, 23, ${overlay}), rgba(2, 6, 23, ${overlay})), url("${imageUrl}")`;
    }

    if (type === "solid") {
        return `linear-gradient(${value}, ${value})`;
    }

    return `linear-gradient(135deg, ${value}, ${value2})`;
}
