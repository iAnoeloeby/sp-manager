export function openLink(url, target = "_blank") {
    if (typeof window === "undefined") return;

    window.open(
        url,
        target,
        target === "_blank" ? "noopener,noreferrer" : undefined,
    );
}
