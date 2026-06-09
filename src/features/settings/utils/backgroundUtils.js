function resolveDefaultSolid(mode) {
  return mode === "dark" ? "#111827" : "#e5e7eb";
}

export function buildBackgroundImage(background = {}, mode = "light") {
  const type = background.type || "gradient";
  const value =
    background.value === "default"
      ? resolveDefaultSolid(mode)
      : background.value || resolveDefaultSolid(mode);
  const value2 = background.value2 || "#1d4ed8";
  const imageUrl = String(background.imageUrl || "").trim();
  const overlay = Number.isFinite(Number(background.overlay))
    ? Number(background.overlay)
    : 0.45;

  if (type === "default") {
    return `linear-gradient(${resolveDefaultSolid(mode)}, ${resolveDefaultSolid(mode)})`;
  }

  if (type === "image" && imageUrl) {
    return `linear-gradient(rgba(2, 6, 23, ${overlay}), rgba(2, 6, 23, ${overlay})), url("${imageUrl}")`;
  }

  if (type === "solid") {
    return `linear-gradient(${value}, ${value})`;
  }

  return `linear-gradient(135deg, ${value}, ${value2})`;
}
