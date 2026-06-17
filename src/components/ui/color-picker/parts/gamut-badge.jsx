"use client";
import * as React from "react";
import { useColorStateSlice } from "../context";
import { gamutInfo } from "../lib/color";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const GamutBadge = React.forwardRef(function GamutBadge(
    { showLabel = true, className, ...rest },
    ref,
) {
    // P6: subscribe to color only. P7: derive the gamut info on demand via
    // `useMemo` over the OKLCH scalars — gamut info only depends on (l, c, h),
    // not on alpha, format, or background.
    const color = useColorStateSlice((s) => s.color);
    const gamut = React.useMemo(
        () => gamutInfo(color),
        [color.l, color.c, color.h],
    );

    let label = "sRGB";
    if (!gamut.inSrgb && gamut.inP3) label = "P3";
    else if (!gamut.inP3 && gamut.inRec2020) label = "Rec.2020";
    else if (!gamut.inRec2020) label = "Out of gamut";

    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        ref={ref}
                        data-slot="color-picker-gamut-badge"
                        role="status"
                        aria-live="polite"
                        tabIndex={0}
                        className={cn(
                            "inline-flex w-full cursor-default items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5 text-xs",
                            className,
                        )}
                        {...rest}
                    >
                        {showLabel && (
                            <span className="text-muted-foreground">Gamut</span>
                        )}
                        <span className="font-mono font-medium">{label}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>Color in {label} color space</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
});
