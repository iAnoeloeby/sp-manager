import React, { useMemo, useState } from "react";
import IconButton from "../../../components/ui/IconButton";
import Button from "../../../components/ui/Button";

function getHost(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch (error) {
        return url;
    }
}

function getFaviconUrl(url) {
    try {
        return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(url)}`;
    } catch (error) {
        return "";
    }
}

function ShortcutLogo({ shortcut }) {
    const [failed, setFailed] = useState(false);
    const host = useMemo(() => getHost(shortcut.url), [shortcut.url]);
    const fallback =
        (shortcut.title || host || "?").trim().charAt(0).toUpperCase() || "?";
    const faviconUrl = getFaviconUrl(shortcut.url);

    if (!faviconUrl || failed) {
        return (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface text-base font-semibold text-foreground shadow-sm">
                {fallback}
            </div>
        );
    }

    return (
        <img
            src={faviconUrl}
            alt=""
            className="h-10 w-10 object-contain"
            onError={() => setFailed(true)}
        />
    );
}

export default function ShortcutCard({ shortcut, onEdit, onDelete }) {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <article
            className="group relative overflow-visible aspect-square rounded-3xl border border-border/75 bg-surface/90 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.42)] transition-all duration-200 hover:-translate-y-1 hover:border-border hover:shadow-[0_26px_50px_-32px_rgba(15,23,42,0.5)]"
            onMouseLeave={() => setOpenMenu(false)}
        >
            <IconButton
                type="button"
                className="absolute right-1 top-1 z-20 h-fit w-fit opacity-0 transition-opacity duration-200 p-1.5 group-hover:opacity-100 fill-foreground/50 hover:fill-foreground bg-transparent hover:bg-surface/90 border border-transparent hover:border-border/70"
                label="Shortcut settings"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenu((prev) => !prev);
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    className="size-4 transition-colors"
                >
                    <path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-16-84a16,16,0,1,1-16-16A16,16,0,0,1,112,128Zm64,0a16,16,0,1,1-16-16A16,16,0,0,1,176,128Z" />
                </svg>
            </IconButton>

            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/35 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

            <a
                href={shortcut.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpenMenu(false)}
                className="relative z-10 flex min-w-0 flex-col items-center text-center outline-none p-4"
            >
                <ShortcutLogo shortcut={shortcut} />

                <div className="mt-4 text-base font-semibold text-foreground">
                    {shortcut.title}
                </div>
            </a>

            <div
                className={`absolute right-2 top-12 z-30 w-full origin-top-right rounded-2xl border border-border bg-background p-2 shadow-xl transition-all duration-150 ${
                    openMenu
                        ? "pointer-events-auto scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0"
                }`}
            >
                <Button
                    className="flex w-full items-center gap-2 justify-start"
                    label={`Edit ${shortcut.title}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(false);
                        onEdit(shortcut);
                    }}
                >
                    <span aria-hidden="true">✎</span>
                    <span>Edit shortcut</span>
                </Button>

                <Button
                    className="mt-1 flex w-full items-center gap-2 justify-start"
                    label={`Delete ${shortcut.title}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(false);
                        onDelete(shortcut.id);
                    }}
                >
                    <span aria-hidden="true">×</span>
                    <span>Delete shortcut</span>
                </Button>
            </div>
        </article>
    );
}
