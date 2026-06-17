"use client";
import * as React from "react";
import { useColorStateSlice, useBackgroundStateSlice } from "../context";
import { formatColor } from "../lib/color";
import { cn } from "@/lib/utils";

const CHECKERBOARD =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><rect width='6' height='6' fill='%23ccc'/><rect x='6' y='6' width='6' height='6' fill='%23ccc'/></svg>\")";

export const Preview = React.forwardRef(function Preview(
    { className, ...rest },
    ref,
) {
    // P6: subscribe to color + background only. P7: derive the P3 strings on
    // demand (only the user-visible string matters for the preview; a CSS
    // string is essentially free to re-render).
    const color = useColorStateSlice((s) => s.color);
    const background = useBackgroundStateSlice((s) => s.background);
    const fg = formatColor(color, "p3");
    const bg = formatColor(background, "p3");
    return (
        <div
            ref={ref}
            data-slot="color-picker-preview"
            role="img"
            aria-label="Color preview over background"
            className={cn(
                "relative size-10 shrink-0 overflow-hidden rounded-md border border-border",
                className,
            )}
            style={{
                backgroundImage: CHECKERBOARD,
                backgroundSize: "12px 12px",
            }}
            {...rest}
        >
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: bg }}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: fg }}
            />
        </div>
    );
});
