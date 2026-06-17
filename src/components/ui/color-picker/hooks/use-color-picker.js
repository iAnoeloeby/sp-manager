"use client";
import * as React from "react";
// P6 + P7: `formatColor` is still imported because `commitColor` emits the
// formatted string alongside the color. The other derived helpers
// (`gamutInfo`, `contrast`) moved out — each consuming part now computes
// its own derivation with `useMemo` over the OKLCH scalars.
import {
    parseColor,
    formatColor,
    gamutFromFormat,
    gamutInfo,
    toGamut,
} from "../lib/color";

const ALL_FORMATS = ["hex", "rgb", "hsl", "hsb", "oklch", "oklab", "p3"];

const BLACK = { l: 0, c: 0, h: 0, alpha: 1 };
const WHITE = { l: 1, c: 0, h: 0, alpha: 1 };

function coerce(input, fallback) {
    if (!input) return fallback;
    if (typeof input === "string") {
        return parseColor(input) ?? fallback;
    }
    return input;
}

function clamp(x, lo, hi) {
    return Math.min(Math.max(x, lo), hi);
}

function wrapHue(h) {
    const m = h % 360;
    return m < 0 ? m + 360 : m;
}

const HUE_EPS = 1e-4;
function isAchromatic(c) {
    return c.c <= HUE_EPS || c.l <= HUE_EPS || c.l >= 1 - HUE_EPS;
}

function applyComponent(c, key, raw) {
    switch (key) {
        case "l":
            return { ...c, l: clamp(raw, 0, 1) };
        case "c":
            return { ...c, c: Math.max(raw, 0) };
        case "h":
            return { ...c, h: wrapHue(raw) };
        case "alpha":
            return { ...c, alpha: clamp(raw, 0, 1) };
    }
}

export function useColorPicker(props = {}) {
    const {
        value: controlledValue,
        defaultValue,
        onValueChange,
        format: controlledFormat,
        defaultFormat = "p3",
        onFormatChange,
        formats: formatsProp,
        backgroundColor,
    } = props;

    const formats = React.useMemo(
        () =>
            formatsProp && formatsProp.length > 0 ? formatsProp : ALL_FORMATS,
        [formatsProp],
    );
    const initialFormat = formats.includes(defaultFormat)
        ? defaultFormat
        : formats[0];

    const [internalColor, setInternalColor] = React.useState(() =>
        coerce(defaultValue, BLACK),
    );
    const [internalFormat, setInternalFormat] = React.useState(initialFormat);

    const isControlledColor = controlledValue !== undefined;
    const isControlledFormat = controlledFormat !== undefined;

    // Hue is undefined for achromatic colors (c=0, pure black, pure white) so
    // any string round-trip through hex/rgb erases it. Remember the last hue
    // observed on a chromatic, mid-lightness color and substitute it back when
    // the resolved color lands on an achromatic edge — keeps the area picker
    // from snapping the hue to 0 when the user drags toward gray/black/white.
    const initialHue = coerce(defaultValue, BLACK).h || 0;
    const lastGoodHueRef = React.useRef(initialHue);

    const isControlledStringInput =
        isControlledColor && typeof controlledValue === "string";
    const rawColor = isControlledColor
        ? coerce(controlledValue, BLACK)
        : internalColor;
    if (!isAchromatic(rawColor)) lastGoodHueRef.current = rawColor.h;
    // Only substitute on string-controlled inputs: those are the ones that
    // round-trip through a CSS format and lose the hue. Object-controlled or
    // uncontrolled state already carries the hue verbatim, including explicit
    // user assignments like setComponent("h", 0) on a black/white color.
    const color =
        isControlledStringInput && isAchromatic(rawColor)
            ? { ...rawColor, h: lastGoodHueRef.current }
            : rawColor;
    const format = isControlledFormat ? controlledFormat : internalFormat;

    // P6 + P7: derived values (formatted / gamut / contrast / background) are
    // *not* in the public return anymore. Each part that needs one of them
    // computes it on-demand with `useMemo` over the OKLCH scalars. The benefit
    // is re-render scoping: the `<Hue>` doesn't re-render when the user
    // toggles the format, the `<Area>` doesn't re-render when the contrast
    // recomputes, the `<GamutBadge>` doesn't re-render when the user types
    // in the CSS input. Each part only subscribes to the slices it reads.

    // Refs that mirror `format` and `onValueChange` during render so chained
    // commits within a single event handler — e.g. `setFormat` calling
    // `commitColor` after a gamut clamp in the same tick — see the updated
    // values instead of the closure snapshot from the previous render. Without
    // this, `setFormat`'s clamp call emits `formatted` in the *old* format.
    const formatRef = React.useRef(format);
    formatRef.current = format;
    const onValueChangeRef = React.useRef(onValueChange);
    onValueChangeRef.current = onValueChange;
    const isControlledColorRef = React.useRef(isControlledColor);
    isControlledColorRef.current = isControlledColor;

    // P2 + P3: emit (color, formatted) only. `formatAll` is gone from the public
    // path; callers that previously read `formats` from the third arg must call
    // `formatColor(color, "hex" | "rgb" | ...)` themselves. The picker's
    // internal onValueChange signature becomes (color, formatted) — the legacy
    // 3-arg shape was only consumed by ExampleColorPicker which now reads the
    // 2nd arg only.
    const commitColor = React.useCallback((next) => {
        if (!isControlledColorRef.current) setInternalColor(next);
        const cb = onValueChangeRef.current;
        if (cb) {
            cb(next, formatColor(next, formatRef.current));
        }
    }, []);

    const setColor = React.useCallback(
        (next) => {
            const parsed = coerce(next, color);
            commitColor(parsed);
        },
        [color, commitColor],
    );

    const setComponent = React.useCallback(
        (key, val) => {
            commitColor(applyComponent(color, key, val));
        },
        [color, commitColor],
    );

    const adjustComponent = React.useCallback(
        (key, delta) => {
            const current =
                key === "l"
                    ? color.l
                    : key === "c"
                      ? color.c
                      : key === "h"
                        ? color.h
                        : color.alpha;
            commitColor(applyComponent(color, key, current + delta));
        },
        [color, commitColor],
    );

    const setFormat = React.useCallback(
        (f) => {
            // Switching formats is also a switch of *picking* gamut. If the current
            // OKLCH state lives outside the new format's gamut (e.g. user authored
            // a wide P3 chroma in OKLCH mode, then toggled to hex), the displayed
            // string would be gamut-mapped at format time but the underlying state
            // — and the gamut badge — would still report out-of-gamut. Clamp on
            // the way in so state and display agree. Hue is pinned per the picker's
            // "chroma is the only lossy axis" invariant.
            const targetGamut = gamutFromFormat(f);
            const info = gamutInfo(color);
            const alreadyIn =
                targetGamut === "srgb"
                    ? info.inSrgb
                    : targetGamut === "p3"
                      ? info.inP3
                      : info.inRec2020;
            // Update the format ref first so the synchronous `commitColor` below
            // emits `formatted` in the *new* format. The state update for
            // `internalFormat` happens after the commit and would otherwise leave a
            // one-call lag where the emitted formatted string is in the prior format.
            formatRef.current = f;
            if (!alreadyIn) {
                const targetHue = color.h;
                const clamped = toGamut(color, targetGamut);
                commitColor({ ...clamped, h: targetHue });
            }
            if (!isControlledFormat) setInternalFormat(f);
            onFormatChange?.(f);
        },
        [color, commitColor, isControlledFormat, onFormatChange],
    );

    const setFromString = React.useCallback(
        (s) => {
            const parsed = parseColor(s);
            if (!parsed) return false;
            commitColor(parsed);
            return true;
        },
        [commitColor],
    );

    return {
        // Primary state. Changing these is what the picker "remembers".
        color,
        format,
        formats,
        backgroundColor,
        // Actions. Stable identity across renders (see P6 — `commitColor` is
        // stable; `setColor`/`setComponent` close over `color` and update when
        // it does, which is the point).
        setColor,
        setComponent,
        adjustComponent,
        setFormat,
        setFromString,
    };
}
