"use client";
import * as React from "react";
import { useFormatStateSlice, useActions } from "../context";
import { cn } from "@/lib/utils";

export const FormatSwitcher = React.forwardRef(function FormatSwitcher(
    { formats: formatsProp, className, ...rest },
    ref,
) {
    // P6: subscribe to format slice + setFormat action only. No re-render
    // when the user drags hue, chroma, or alpha — those are different slices.
    const format = useFormatStateSlice((s) => s.format);
    const ctxFormats = useFormatStateSlice((s) => s.formats);
    const setFormat = useActions().setFormat;
    const formats = formatsProp ?? ctxFormats;

    return (
        <div
            data-slot="color-picker-format-switcher"
            className={cn("relative inline-flex items-center", className)}
        >
            <select
                ref={ref}
                data-slot="color-picker-format-switcher-select"
                aria-label="Color format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className={cn(
                    "h-8 w-full appearance-none rounded-md border border-input bg-transparent pl-2.5 pr-7 font-mono text-xs uppercase tracking-wide shadow-xs outline-none",
                    "focus-visible:ring-1 focus-visible:ring-ring",
                    "cursor-pointer",
                )}
                {...rest}
            >
                {formats.map((f) => (
                    <option key={f} value={f}>
                        {f}
                    </option>
                ))}
            </select>
            <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className="pointer-events-none absolute right-2 size-3 text-muted-foreground"
            >
                <path
                    d="M3 4.5l3 3 3-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
});
