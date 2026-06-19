import React from "react";
import {
    ColorPicker as Picker,
    parseColor,
} from "@/components/ui/color-picker/color-picker";

/**
 * Self-contained accent-color picker.
 *
 * Design:
 *  - Stores its own OklchColor internally so drags are smooth (no parent
 *    re-render cascade, no CSS var invalidation, no storage write per tick).
 *  - Optionally notifies the parent via `onCommit(hexString)` — called once
 *    when the user finishes interacting (a short idle window after the
 *    last `onValueChange` tick). This matches the semantics of the native
 *    `<input type="color">` (silent during drag, single `change` on commit).
 *  - `defaultValue` is read once at mount for the initial state. To change
 *    the picker's color from outside (e.g. a "reset accent" button), pass
 *    a new `key` prop to remount — or use the new `externalValue` + the
 *    same key trick.
 *
 * @param {{
 *   defaultValue?: string,                  // Initial CSS color string (any CSS Color 4 form)
 *   onCommit?: (hexString: string) => void, // Fired once on interaction settle (idle ~120ms)
 *   backgroundColor?: string,               // Optional contrast background override
 * }} props
 */
export default function ColorPicker({
    defaultValue = "",
    onCommit,
    backgroundColor = "#FFFFFF",
}) {
    // Fallback used only when `defaultValue` is empty/invalid so the picker always has a valid OklchColor.
    const fallback = React.useMemo(
        () => parseColor("#E5E5E5") ?? parseColor("oklch(0.9219 0 0)"),
        [],
    );

    const initialColor = React.useMemo(() => {
        const parsed = defaultValue ? parseColor(defaultValue) : null;
        return parsed ?? fallback;
    }, [defaultValue, fallback]);

    // Internal state — drag updates this only, not the parent.
    const [color, setColor] = React.useState(initialColor);

    // Commit-notify: fire `onCommit(hex)` after a short idle window. The picker
    // calls onValueChange on every pointermove; we debounce so the parent only
    // gets a single update per interaction. This mirrors the native
    // <input type="color">'s change event (pointer-up / blur).
    const onCommitRef = React.useRef(onCommit);
    onCommitRef.current = onCommit;
    const timerRef = React.useRef(0);

    // Cleanup pending timer on unmount.
    React.useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = 0;
            }
        };
    }, []);

    // onValueChange signature: (color, formatted). With defaultFormat pinned
    // to "hex" below, `formatted` is the hex string — no extra formatColor
    // call needed in this wrapper.
    const handleChange = React.useCallback((nextColor, formatted) => {
        setColor(nextColor);
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            timerRef.current = 0;
            onCommitRef.current?.(formatted);
        }, 120);
    }, []);

    return (
        <Picker.Root
            value={color}
            onValueChange={handleChange}
            backgroundColor={backgroundColor}
            defaultFormat="hex"
        >
            <div className="flex items-stretch gap-2">
                <Picker.ContrastReadout
                    metrics={["apca", "wcag"]}
                    showLabel={false}
                    className="w-auto flex-1 justify-center"
                />
            </div>
            <Picker.Area mode="hsv-sv" softProof />
            <div className="flex flex-col gap-1.5">
                <Picker.Hue />
            </div>
            <div className="flex items-center gap-2">
                <Picker.FormatSwitcher className="flex-1" />
            </div>
            <Picker.ChannelInput showFormat={false} />
            {/* <Picker.Swatches presets={presets} onAdd={(_c, hex) => savePreset(hex)} /> */}
        </Picker.Root>
    );
}
