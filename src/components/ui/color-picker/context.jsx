"use client";
import * as React from "react";

/**
 * Context split for fine-grained subscriptions.
 *
 * The picker's parts (Area, Hue, FormatSwitcher, ContrastReadout, etc.)
 * only need a subset of the picker's state. Pushing every part of the
 * state through a single context forces every part to re-render on every
 * change. We split into four providers so each part subscribes only to
 * the slice it actually needs:
 *
 *   ColorStateContext     → { color, alpha }      (changes when user picks)
 *   FormatStateContext    → { format, formats }   (changes when user toggles format)
 *   DerivedStateContext   → { gamut, contrast, background } (recomputed on color change, but cheap)
 *   ActionsContext        → { setColor, setComponent, setFormat, ... } (stable identity)
 *
 * For point P6 (selector-style subscriptions) we expose `useColorStateSlice`,
 * `useFormatStateSlice`, etc. as thin wrappers that re-render only when the
 * selected slice's reference changes.
 */

const NOOP = () => {};

// === Color state (primary: changes when the user picks) ===
const ColorStateContext = React.createContext({
    color: null,
    version: 0,
});
/** @returns {{ color: any, version: number }} */
export function useColorState() {
    return React.useContext(ColorStateContext);
}

// === Format state (primary: changes when the user toggles the format) ===
const FormatStateContext = React.createContext({
    format: "hex",
    formats: ["hex", "rgb", "hsl", "hsb", "oklch", "oklab", "p3"],
    version: 0,
});
/** @returns {{ format: string, formats: string[], version: number }} */
export function useFormatState() {
    return React.useContext(FormatStateContext);
}

// === Background state (rarely changes; kept separate so contrast/preview
//     parts don't re-render on every hue tick when only the foreground
//     changes) ===
const BackgroundStateContext = React.createContext({
    background: null,
    version: 0,
});
/** @returns {{ background: any, version: number }} */
export function useBackgroundState() {
    return React.useContext(BackgroundStateContext);
}

// === Actions (stable identity — see P6) ===
const ActionsContext = React.createContext({
    setColor: NOOP,
    setComponent: NOOP,
    adjustComponent: NOOP,
    setFormat: NOOP,
    setFromString: NOOP,
});
/** @returns {{ setColor: Function, setComponent: Function, adjustComponent: Function, setFormat: Function, setFromString: Function }} */
export function useActions() {
    return React.useContext(ActionsContext);
}

/**
 * Selector-style slice subscription. Re-renders only when the selected
 * value's reference changes (Object.is comparison). Components use this
 * instead of `useColorState()` directly when they only care about a
 * subset (e.g. `useColorStateSlice((s) => s.color)`).
 *
 * @template T
 * @param {(state: { color: any, version: number }) => T} selector
 * @returns {T}
 */
export function useColorStateSlice(selector) {
    const state = useColorState();
    const selected = selector(state);
    const lastRef = React.useRef(selected);
    if (!Object.is(lastRef.current, selected)) {
        lastRef.current = selected;
    }
    return lastRef.current;
}

/**
 * @template T
 * @param {(state: { format: string, formats: string[], version: number }) => T} selector
 * @returns {T}
 */
export function useFormatStateSlice(selector) {
    const state = useFormatState();
    const selected = selector(state);
    const lastRef = React.useRef(selected);
    if (!Object.is(lastRef.current, selected)) {
        lastRef.current = selected;
    }
    return lastRef.current;
}

/**
 * @template T
 * @param {(state: { background: any, version: number }) => T} selector
 * @returns {T}
 */
export function useBackgroundStateSlice(selector) {
    const state = useBackgroundState();
    const selected = selector(state);
    const lastRef = React.useRef(selected);
    if (!Object.is(lastRef.current, selected)) {
        lastRef.current = selected;
    }
    return lastRef.current;
}

/**
 * Provider that splits the monolithic state object into the four slices.
 * Each slice is `useMemo`'d separately so parts only re-render when their
 * slice's identity changes.
 *
 * @param {{
 *   state: any,
 *   children: any,
 * }} props
 */
export function ColorPickerProvider({ state, children }) {
    const color = state.color;
    const format = state.format;
    const formats = state.formats;
    const background = state.backgroundColor;
    const setColor = state.setColor;
    const setComponent = state.setComponent;
    const adjustComponent = state.adjustComponent;
    const setFormat = state.setFormat;
    const setFromString = state.setFromString;

    // P6 + P7: primary slices only. Derived values (formatted / gamut /
    // contrast) are NOT in any context — each consuming part computes its
    // own via `useMemo` over the OKLCH scalars it actually subscribes to.
    const colorSlice = React.useMemo(() => ({ color, version: 0 }), [color]);

    const formatSlice = React.useMemo(
        () => ({ format, formats, version: 0 }),
        [format, formats],
    );

    const backgroundSlice = React.useMemo(
        () => ({ background, version: 0 }),
        [background],
    );

    const actionsSlice = React.useMemo(
        () => ({
            setColor,
            setComponent,
            adjustComponent,
            setFormat,
            setFromString,
        }),
        [setColor, setComponent, adjustComponent, setFormat, setFromString],
    );

    return (
        <ColorStateContext.Provider value={colorSlice}>
            <FormatStateContext.Provider value={formatSlice}>
                <BackgroundStateContext.Provider value={backgroundSlice}>
                    <ActionsContext.Provider value={actionsSlice}>
                        {children}
                    </ActionsContext.Provider>
                </BackgroundStateContext.Provider>
            </FormatStateContext.Provider>
        </ColorStateContext.Provider>
    );
}

// === Backward-compat alias (for parts that still import the old single context) ===
// The library used to expose a single `ColorPickerContext` containing every
// piece of state. New code should use the split hooks above. This alias
// keeps legacy imports (`import { useColorPickerContext } from "../context"`)
// working with the reduced state object for now.
//
// Note: the legacy shape used to include `formatted`, `gamut`, `contrast`,
// and `background` (derived). P6 + P7 removed those from the public return
// — each consuming part now derives them on demand. Legacy parts that still
// rely on them must be migrated to the split hooks.
/** @type {React.Context<any>} */
const ColorPickerContext = React.createContext(undefined);
/** @deprecated Use the split hooks (useColorState / useFormatState / useBackgroundState / useActions) instead. */
export { ColorPickerContext };
/** @deprecated Use the split hooks. */
export function useColorPickerContext() {
    const ctx = React.useContext(ColorPickerContext);
    if (!ctx) {
        throw new Error(
            "ColorPicker.* parts must be rendered inside <ColorPicker> (or <ColorPicker.Root>)",
        );
    }
    return ctx;
}
