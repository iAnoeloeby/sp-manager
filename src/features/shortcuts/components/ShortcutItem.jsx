import React, { useMemo, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { DotsThreeCircleIcon } from "@phosphor-icons/react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/Popover";

function getHost(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch (error) {
        return url;
    }
}

function getFaviconUrl(url) {
    try {
        // return `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(url)}`;
        return `https://icons.duckduckgo.com/ip3/${getHost(url)}.ico`;
    } catch (error) {
        return "";
    }
}

export function ShortcutLogo({ shortcut }) {
    const [failed, setFailed] = useState(false);
    const host = useMemo(() => getHost(shortcut.url), [shortcut.url]);
    const fallback =
        (shortcut.title || host || "?").trim().charAt(0).toUpperCase() || "?";
    const faviconUrl = getFaviconUrl(shortcut.url);

    if (!faviconUrl || failed) {
        return fallback;
    }

    return (
        <img
            src={faviconUrl}
            alt=""
            className="h-10 w-10 object-contain z-11"
            onError={() => setFailed(true)}
        />
    );
}

export default function ShortcutCard({ shortcut, onEdit, onDelete }) {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <article className="group relative overflow-visible aspect-square rounded-lg border border-border/75 bg-surface/90 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.42)] transition-all duration-200 hover:-translate-y-1 hover:border-border hover:shadow-[0_26px_50px_-32px_rgba(15,23,42,0.5)]">
            <Popover open={openMenu} onOpenChange={setOpenMenu} modal={false}>
                <PopoverTrigger
                    aria-label="Shortcut settings"
                    className="absolute right-1 top-1 z-20 inline-flex h-fit w-fit items-center justify-center rounded-4xl border border-transparent bg-transparent p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-surface/90 hover:fill-foreground hover:border-border/70 fill-foreground/50"
                >
                    <DotsThreeCircleIcon
                        size={20}
                        className="fill-foreground"
                        weight="regular"
                    />
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    sideOffset={4}
                    className="w-40 gap-0 p-1"
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
                </PopoverContent>
            </Popover>

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
        </article>
    );
}
