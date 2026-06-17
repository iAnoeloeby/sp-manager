"use client";
import * as React from "react";
import { EyedropperSampleIcon } from "@phosphor-icons/react";
import { useActions } from "../context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const subscribeNoop = () => () => {};
const getEyeDropperSupportClient = () =>
    typeof window !== "undefined" && typeof window.EyeDropper === "function";
const getEyeDropperSupportServer = () => false;

export const EyeDropper = React.forwardRef(function EyeDropper(
    { className, ...rest },
    ref,
) {
    // P6: EyeDropper only needs the `setColor` action. Subscribing to just the
    // actions slice means we never re-render when the user picks a color — the
    // resulting setColor call writes to the actions provider, but `setColor`'s
    // identity is stable (it only changes if `color` changes, which it does,
    // but the action still does what we need regardless of identity).
    const setColor = useActions().setColor;
    // Client-only feature detection without a hydration mismatch and without the
    // two-paint flash that an `useEffect(setState)` pattern introduces. The
    // server snapshot returns `false` (matching SSR's empty render); the client
    // snapshot reads the real value during hydration's reconciliation pass.
    const supported = React.useSyncExternalStore(
        subscribeNoop,
        getEyeDropperSupportClient,
        getEyeDropperSupportServer,
    );

    if (!supported) return null;

    const onClick = async () => {
        try {
            const ed = new window.EyeDropper();
            const result = await ed.open();
            if (result?.sRGBHex) setColor(result.sRGBHex);
        } catch {
            // user cancelled
        }
    };

    return (
        <Button
            ref={ref}
            data-slot="color-picker-eye-dropper"
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Pick color from screen"
            onClick={onClick}
            className={cn("cursor-pointer", className)}
            {...rest}
        >
            <EyedropperSampleIcon weight="fill" className="size-4" />
        </Button>
    );
});
