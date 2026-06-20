import React from "react";

import { Separator } from "@/components/ui/separator";

export default function About() {
    const { name, version, description, permissions } =
        chrome.runtime.getManifest();

    return (
        <>
            <div className="space-y-4">
                <header className="flex items-start gap-3">
                    <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/25 text-foreground text-base font-semibold"
                        aria-hidden="true"
                    >
                        {name
                            .split(/\s+/)
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-foreground">
                                {name}
                            </h3>
                            <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted">
                                v{version}
                            </span>
                        </div>
                        <p className="text-xs">{description}</p>
                    </div>
                </header>

                <Separator />

                <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-xs">
                    <dt className="text-muted">Permissions</dt>
                    <dd className="text-foreground">
                        {permissions.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {permissions.map((p) => (
                                    <span
                                        key={p}
                                        className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted"
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-muted">None</span>
                        )}
                    </dd>
                </dl>

                <Separator />

                <footer className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span>&copy; 2026 {name} by iAnoeloeby</span>
                    <span className="text-muted-foreground">MIT License</span>
                </footer>
            </div>
        </>
    );
}
