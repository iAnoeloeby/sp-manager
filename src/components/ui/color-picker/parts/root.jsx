"use client";
import * as React from "react";
import { useColorPicker } from "../hooks/use-color-picker";
import { ColorPickerProvider, ColorPickerContext } from "../context";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} RootProps
 * @property {any} [value]
 * @property {any} [defaultValue]
 * @property {(color: any, formatted: string) => void} [onValueChange]
 * @property {string} [format]
 * @property {string} [defaultFormat]
 * @property {(format: string) => void} [onFormatChange]
 * @property {string[]} [formats]
 * @property {any} [backgroundColor]
 * @property {string} [className]
 * @property {any} [children]
 * @property {any} [ref]
 */

/**
 * @param {RootProps} props
 * @param {React.Ref<HTMLDivElement>} ref
 */
function RootImpl(props, ref) {
    const {
        value,
        defaultValue,
        onValueChange,
        format,
        defaultFormat,
        onFormatChange,
        formats,
        backgroundColor,
        className,
        children,
        ...rest
    } = props;

    const state = useColorPicker({
        value,
        defaultValue,
        onValueChange,
        format,
        defaultFormat,
        onFormatChange,
        formats,
        backgroundColor,
    });

    return (
        <ColorPickerProvider state={state}>
            {/* Legacy single-context provider retained for any third-party code
                that still imports `useColorPickerContext()`. The picker
                library itself uses the split hooks (useColorState /
                useFormatState / useBackgroundState / useActions and the
                selector slices) for fine-grained subscriptions. P6 + P7:
                derived values (formatted / gamut / contrast) are not in any
                context — each consuming part computes them on demand. */}
            <ColorPickerContext.Provider value={state}>
                <div
                    ref={ref}
                    data-slot="color-picker"
                    className={cn(
                        "flex w-full max-w-[350px] flex-col gap-2 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-sm",
                        className,
                    )}
                    {...rest}
                >
                    {children}
                </div>
            </ColorPickerContext.Provider>
        </ColorPickerProvider>
    );
}

export const Root = React.forwardRef(RootImpl);
