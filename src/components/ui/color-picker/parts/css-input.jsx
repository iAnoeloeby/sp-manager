"use client";
import * as React from "react";
import {
    useColorStateSlice,
    useFormatStateSlice,
    useActions,
} from "../context";
import { formatColor } from "../lib/color";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const CssInput = React.forwardRef(function CssInput(
    { className, ...rest },
    ref,
) {
    // P6 + P7: derive `formatted` on demand from color + format. No re-render
    // on background or actions changes.
    const color = useColorStateSlice((s) => s.color);
    const format = useFormatStateSlice((s) => s.format);
    const formatted = React.useMemo(
        () => formatColor(color, format),
        [color.l, color.c, color.h, color.alpha, format],
    );
    const setFromString = useActions().setFromString;
    // Sync draft when canonical value changes externally (slider drags etc.)
    // via in-render adjustment — no useEffect needed.
    const [draft, setDraft] = React.useState(formatted);
    const [prevFormatted, setPrevFormatted] = React.useState(formatted);
    const [error, setError] = React.useState(false);
    if (formatted !== prevFormatted) {
        setPrevFormatted(formatted);
        setDraft(formatted);
        setError(false);
    }

    const commit = (value) => {
        const ok = setFromString(value.trim());
        setError(!ok);
    };

    return (
        <Input
            ref={ref}
            data-slot="color-picker-input"
            type="text"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            value={draft}
            aria-invalid={error || undefined}
            aria-label="Color value"
            onChange={(e) => {
                setDraft(e.target.value);
                setError(false);
            }}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    commit(e.currentTarget.value);
                } else if (e.key === "Escape") {
                    setDraft(formatted);
                    setError(false);
                }
            }}
            className={cn("h-8 px-2 font-mono text-xs", className)}
            {...rest}
        />
    );
});
