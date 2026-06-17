import {
    parse as culoriParse,
    converter,
    formatHex,
    formatHex8,
    formatRgb,
    formatCss,
    toGamut as culoriToGamut,
    wcagContrast,
} from "culori";

const toOklch = converter("oklch");
const toRgb = converter("rgb");
const toHsl = converter("hsl");
const toHsv = converter("hsv");
const toOklab = converter("oklab");
const toP3 = converter("p3");

const GAMUT_EPSILON = 1e-4;

function channelsInRange(c) {
    if (!c) return false;
    const r = c.r ?? 0;
    const g = c.g ?? 0;
    const b = c.b ?? 0;
    return (
        r >= -GAMUT_EPSILON &&
        r <= 1 + GAMUT_EPSILON &&
        g >= -GAMUT_EPSILON &&
        g <= 1 + GAMUT_EPSILON &&
        b >= -GAMUT_EPSILON &&
        b <= 1 + GAMUT_EPSILON
    );
}

const toRec2020 = converter("rec2020");

function isInSrgb(ok) {
    return channelsInRange(toRgb(ok));
}
function isInP3(ok) {
    return channelsInRange(toP3(ok));
}
function isInRec2020(ok) {
    return channelsInRange(toRec2020(ok));
}

/**
 * Parse a CSS color string into the canonical OKLCH form.
 * Returns null when the string can't be parsed.
 */
export function parseColor(input) {
    if (!input || typeof input !== "string") return null;
    const parsed = culoriParse(input.trim());
    if (!parsed) return null;
    const oklch = toOklch(parsed);
    if (!oklch) return null;
    return {
        l: clamp(oklch.l ?? 0, 0, 1),
        c: Math.max(oklch.c ?? 0, 0),
        h: Number.isFinite(oklch.h) ? oklch.h : 0,
        alpha: oklch.alpha ?? 1,
    };
}

export function isValidColor(input) {
    return parseColor(input) !== null;
}

/** Convert canonical OKLCH back to a culori Color in the requested mode. */
function toCulori(c, mode) {
    const base = { mode: "oklch", l: c.l, c: c.c, h: c.h, alpha: c.alpha };
    switch (mode) {
        case "oklch":
            return base;
        case "rgb":
            return toRgb(base);
        case "p3":
            return toP3(base);
        case "oklab":
            return toOklab(base);
        case "hsl":
            return toHsl(base);
        case "hsv":
            return toHsv(base);
    }
}

/**
 * Serialize a canonical OKLCH color to a CSS string in the chosen format.
 * For sRGB-targeted formats (hex/rgb/hsl/hsb) the color is gamut-mapped to sRGB first.
 * For P3 the color is gamut-mapped to P3.
 * OKLCH/OKLab outputs are unbounded.
 */
export function formatColor(color, format) {
    switch (format) {
        case "hex": {
            const mapped = mapToGamutColor(color, "srgb");
            const rgb = toRgb({ mode: "oklch", ...oklchObj(mapped) });
            if (!rgb) return "#000000";
            return (
                color.alpha < 1 ? formatHex8(rgb) : formatHex(rgb)
            ).toUpperCase();
        }
        case "rgb": {
            const mapped = mapToGamutColor(color, "srgb");
            const rgb = toRgb({ mode: "oklch", ...oklchObj(mapped) });
            return rgb ? formatRgb(rgb) : "rgb(0 0 0)";
        }
        case "hsl": {
            const mapped = mapToGamutColor(color, "srgb");
            const hsl = toHsl({ mode: "oklch", ...oklchObj(mapped) });
            return hsl ? formatCss(hsl) : "hsl(0 0% 0%)";
        }
        case "hsb": {
            const mapped = mapToGamutColor(color, "srgb");
            const hsv = toHsv({ mode: "oklch", ...oklchObj(mapped) });
            if (!hsv) return "hsv(0 0% 0%)";
            // CSS does not standardize hsb(); emit hsv() (alias) for clarity, but tests just check parseable
            return formatCss(hsv);
        }
        case "oklch": {
            const { l, c, h, alpha } = color;
            const lStr = round(l, 4);
            const cStr = round(c, 4);
            const hStr = round(h, 2);
            return alpha < 1
                ? `oklch(${lStr} ${cStr} ${hStr} / ${round(alpha, 3)})`
                : `oklch(${lStr} ${cStr} ${hStr})`;
        }
        case "oklab": {
            const lab = toOklab({ mode: "oklch", ...oklchObj(color) });
            return lab ? formatCss(lab) : "oklab(0 0 0)";
        }
        case "p3": {
            const mapped = mapToGamutColor(color, "p3");
            const p3 = toP3({ mode: "oklch", ...oklchObj(mapped) });
            return p3 ? formatCss(p3) : "color(display-p3 0 0 0)";
        }
    }
}

/** Convenience: pull bare OKLCH numeric fields. */
function oklchObj(c) {
    return { l: c.l, c: c.c, h: c.h, alpha: c.alpha };
}

const ALL_FORMATS = ["hex", "rgb", "hsl", "hsb", "oklch", "oklab", "p3"];

/**
 * Serialize an OKLCH color to every supported output format at once.
 * Useful when consumers need both the canonical lossless form (oklch) and
 * a fallback string (hex) without re-running format selection.
 */
export function formatAll(color) {
    const out = {};
    for (const f of ALL_FORMATS) out[f] = formatColor(color, f);
    return out;
}

/**
 * Continuous signed distance from the target gamut surface.
 *  - 0 on the boundary
 *  - <0 inside the gamut (any channel exceeds [0,1] by the most-negative amount)
 *  - >0 outside the gamut (channels exceed by the most-positive amount)
 *
 * Drives the marching-squares boundary line. We use inline OKLab → linear RGB
 * math (zero crossings unchanged from gamma-encoded RGB) so the per-grid-point
 * cost stays under a microsecond — at 128² × 2 lines per OKLCH-mode repaint
 * the culori path was the new perf hot spot.
 */
export function gamutSignedDistance(color, gamut) {
    const lin = oklchToLinearSrgb(color.l, color.c, color.h);
    const target =
        gamut === "srgb"
            ? lin
            : gamut === "p3"
              ? linSrgbToLinP3(lin)
              : linSrgbToLinRec2020(lin);
    const lo = -Math.min(target.r, target.g, target.b);
    const hi = Math.max(target.r, target.g, target.b) - 1;
    return Math.max(lo, hi);
}

/**
 * OKLCH → linear sRGB via Björn Ottosson's OKLab matrix. Output channels can
 * be negative or >1 for colors outside sRGB; that's the point — wider gamuts
 * are just `linSrgbToLinP3` / `linSrgbToLinRec2020` away.
 */
export function oklchToLinearSrgb(l, c, hDeg) {
    const h = (hDeg * Math.PI) / 180;
    const a = c * Math.cos(h);
    const b = c * Math.sin(h);

    const lp = l + 0.3963377774 * a + 0.2158037573 * b;
    const mp = l - 0.1055613458 * a - 0.0638541728 * b;
    const sp = l - 0.0894841775 * a - 1.291485548 * b;

    const L = lp * lp * lp;
    const M = mp * mp * mp;
    const S = sp * sp * sp;

    return {
        r: 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
        g: -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
        b: -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
    };
}

/* Linear sRGB → linear Display-P3 (CSS Color 4 reference matrix). */
export function linSrgbToLinP3(c) {
    return {
        r: 0.8224621 * c.r + 0.177538 * c.g + 0.0 * c.b,
        g: 0.0331942 * c.r + 0.9668058 * c.g + 0.0 * c.b,
        b: 0.0170828 * c.r + 0.0723976 * c.g + 0.9105196 * c.b,
    };
}

/* Linear sRGB → linear Rec.2020 (CSS Color 4 reference matrix). */
export function linSrgbToLinRec2020(c) {
    return {
        r: 0.6274039 * c.r + 0.329283 * c.g + 0.0433131 * c.b,
        g: 0.0690973 * c.r + 0.9195404 * c.g + 0.0113623 * c.b,
        b: 0.0163914 * c.r + 0.0880133 * c.g + 0.8955953 * c.b,
    };
}

/**
 * Bisect for the maximum OKLCH chroma at this lightness and hue that still
 * fits inside the target gamut. Returns 0 at L=0 or L=1 (those are achromatic
 * by definition). Cost: ~12 iterations × 3 matrix-mults per call.
 *
 * `epsilon` controls the bisection's strictness — a positive value relaxes
 * the in-gamut check (allows channels out by `epsilon`); zero is strict; a
 * negative value shrinks the gamut. Default 0 is strict so the returned
 * chroma is *guaranteed* in-gamut; the area's bead-clamp re-pin and
 * culori-based `gamutInfo` (which use their own `GAMUT_EPSILON` tolerance)
 * will then never tip the picked color out.
 *
 * The `marginalChroma` knob trims an absolute amount off the final result
 * to absorb bisection precision (~5e-5) plus OKLab matrix drift. Without it,
 * the result can sit on the strict surface where the round-trip via culori's
 * `toGamut` and the area's hue re-pin can push it out by float ULPs.
 */
export function findMaxChroma(l, hDeg, gamut, options = {}) {
    if (l <= 0 || l >= 1) return 0;
    const iterations = options.iterations ?? 14;
    const eps = options.epsilon ?? 0;
    const marginalChroma = options.marginalChroma ?? 1e-3;

    const inGamut = (c) => {
        const lin = oklchToLinearSrgb(l, c, hDeg);
        const target =
            gamut === "srgb"
                ? lin
                : gamut === "p3"
                  ? linSrgbToLinP3(lin)
                  : linSrgbToLinRec2020(lin);
        return (
            target.r >= -eps &&
            target.r <= 1 + eps &&
            target.g >= -eps &&
            target.g <= 1 + eps &&
            target.b >= -eps &&
            target.b <= 1 + eps
        );
    };

    // Find an upper bound that is definitely outside. 0.5 covers Rec.2020 reds
    // (max chroma ≈ 0.4 in OKLCH); double until out, capped at 2.0 for safety.
    let hi = 0.5;
    while (inGamut(hi) && hi < 2) hi *= 2;
    let lo = 0;
    for (let i = 0; i < iterations; i++) {
        const mid = (lo + hi) / 2;
        if (inGamut(mid)) lo = mid;
        else hi = mid;
    }
    return Math.max(0, lo - marginalChroma);
}

/**
 * Find the OKLCH "cusp" for a given hue and gamut — the (L, C) point of
 * maximum chroma. Used by the `hsv-sv` Area mode to map (S, V) onto a fully
 * gamut-filling square: V=1, S=1 lands on the cusp; V=1, S=0 is white;
 * V=0 is black.
 *
 * Two-stage search: a 32-step coarse sweep over L, then a 20-step fine sweep
 * around the best candidate. ~52 `findMaxChroma` calls per cusp lookup,
 * which is cheap enough to call once per repaint per active hue.
 */
/**
 * Map an output format to the gamut whose surface fills the picker's area
 * and bounds the lossless saturation-preserving updates from the hue and
 * lightness sliders. OKLCH and OKLab are unbounded as serialization formats
 * but still need a finite picking gamut — Rec.2020 covers everything that
 * fits inside `<canvas colorSpace="display-p3">` plus the slice that won't
 * paint accurately on any current monitor.
 */
/**
 * Hue of an OKLCH color in HSL's hue scale (degrees). Used by the Hue slider
 * when the active format is `hsl` so the slider position matches what the
 * channel input shows — OKLCH hue and HSL hue diverge for the same color
 * (red is OKLCH ~29° but HSL 0°). Returns the OKLCH hue as a fallback when
 * the conversion fails (achromatic colors where culori returns NaN).
 */
export function hslHue(color) {
    const c = toHsl({ mode: "oklch", l: color.l, c: color.c, h: color.h });
    return c?.h ?? color.h;
}

/**
 * Hue of an OKLCH color in HSB/HSV's hue scale (degrees). See `hslHue`.
 */
export function hsbHue(color) {
    const c = toHsv({ mode: "oklch", l: color.l, c: color.c, h: color.h });
    return c?.h ?? color.h;
}

export function gamutFromFormat(f) {
    switch (f) {
        case "hex":
        case "rgb":
        case "hsl":
        case "hsb":
            return "srgb";
        case "p3":
            return "p3";
        case "oklch":
        case "oklab":
            return "rec2020";
    }
}

export function findCusp(hDeg, gamut) {
    let bestL = 0.5;
    let bestC = 0;
    for (let i = 1; i < 32; i++) {
        const l = i / 32;
        const c = findMaxChroma(l, hDeg, gamut);
        if (c > bestC) {
            bestC = c;
            bestL = l;
        }
    }
    const lo = Math.max(0.001, bestL - 1 / 32);
    const hi = Math.min(0.999, bestL + 1 / 32);
    for (let i = 0; i <= 20; i++) {
        const l = lo + ((hi - lo) * i) / 20;
        const c = findMaxChroma(l, hDeg, gamut);
        if (c > bestC) {
            bestC = c;
            bestL = l;
        }
    }
    return { l: bestL, c: bestC };
}

export function gamutInfo(color) {
    const ok = { mode: "oklch", ...oklchObj(color) };
    return {
        inSrgb: isInSrgb(ok),
        inP3: isInP3(ok),
        inRec2020: isInRec2020(ok),
    };
}

/**
 * Gamut-map an OKLCH color to the target gamut using CSS Color 4's
 * chroma-reduction-in-OKLCH algorithm (culori `toGamut`).
 * Returns canonical OKLCH form.
 */
export function toGamut(color, gamut) {
    return mapToGamutColor(color, gamut);
}

function mapToGamutColor(color, gamut) {
    const ok = { mode: "oklch", ...oklchObj(color) };
    const targetMode =
        gamut === "srgb" ? "rgb" : gamut === "p3" ? "p3" : "rec2020";
    const mapper = culoriToGamut(targetMode, "oklch");
    const mapped = mapper(ok);
    if (!mapped) return color;
    const back = toOklch(mapped);
    if (!back) return color;
    return {
        l: back.l ?? color.l,
        c: Math.max(back.c ?? 0, 0),
        h: Number.isFinite(back.h) ? back.h : color.h,
        alpha: color.alpha,
    };
}

/** Convert an OKLCH color to linear-light sRGB (0..1 floats). */
function toLinearSrgbFromOklch(c) {
    const rgb = toRgb({ mode: "oklch", l: c.l, c: c.c, h: c.h });
    if (!rgb) return { r: 0, g: 0, b: 0 };
    return {
        r: srgbToLinear(rgb.r ?? 0),
        g: srgbToLinear(rgb.g ?? 0),
        b: srgbToLinear(rgb.b ?? 0),
    };
}

function srgbToLinear(v) {
    const x = clamp(v, 0, 1);
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

/** Linear-light alpha composite: fg over bgLin, returns linear-light sRGB. */
function compositeLinearFg(fg, bgLin) {
    const fgLin = toLinearSrgbFromOklch(fg);
    if (fg.alpha >= 1) return fgLin;
    const a = fg.alpha;
    return {
        r: fgLin.r * a + bgLin.r * (1 - a),
        g: fgLin.g * a + bgLin.g * (1 - a),
        b: fgLin.b * a + bgLin.b * (1 - a),
    };
}

function wcagRelativeLuminance(lin) {
    return 0.2126 * lin.r + 0.7152 * lin.g + 0.0722 * lin.b;
}

function wcagRatio(fgLin, bgLin) {
    const l1 = wcagRelativeLuminance(fgLin);
    const l2 = wcagRelativeLuminance(bgLin);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function apcaLcFromLinear(fgLin, bgLin) {
    const Ytxt =
        SA98G.Rco * Math.pow(fgLin.r, SA98G.mainTRC) +
        SA98G.Gco * Math.pow(fgLin.g, SA98G.mainTRC) +
        SA98G.Bco * Math.pow(fgLin.b, SA98G.mainTRC);
    const Ybg =
        SA98G.Rco * Math.pow(bgLin.r, SA98G.mainTRC) +
        SA98G.Gco * Math.pow(bgLin.g, SA98G.mainTRC) +
        SA98G.Bco * Math.pow(bgLin.b, SA98G.mainTRC);
    return sapcContrast(Ytxt, Ybg) * 100;
}

/** Build the shared linear-light fg/bg pair for contrast metrics. */
function linearFgBg(fg, bg) {
    const bgOpaque = { ...bg, alpha: 1 };
    const bgLin = toLinearSrgbFromOklch(bgOpaque);
    const fgLin = compositeLinearFg(fg, bgLin);
    return { fgLin, bgLin };
}

export function getWcagContrast(fg, bg) {
    const { fgLin, bgLin } = linearFgBg(fg, bg);
    const ratio = wcagRatio(fgLin, bgLin);
    const safe = Number.isFinite(ratio) ? ratio : 1;
    return {
        wcag: round(safe, 2),
        wcagLevel: {
            aaNormal: safe >= 4.5,
            aaLarge: safe >= 3,
            aaaNormal: safe >= 7,
            aaaLarge: safe >= 4.5,
        },
    };
}

export function getApcaContrast(fg, bg) {
    const { fgLin, bgLin } = linearFgBg(fg, bg);
    return round(apcaLcFromLinear(fgLin, bgLin), 2);
}

/** Back-compat: combined WCAG + APCA. Used only by code paths that need both. */
export function contrast(fg, bg) {
    const { fgLin, bgLin } = linearFgBg(fg, bg);
    const ratio = wcagRatio(fgLin, bgLin);
    const safe = Number.isFinite(ratio) ? ratio : 1;
    return {
        wcag: round(safe, 2),
        wcagLevel: {
            aaNormal: safe >= 4.5,
            aaLarge: safe >= 3,
            aaaNormal: safe >= 7,
            aaaLarge: safe >= 4.5,
        },
        apca: round(apcaLcFromLinear(fgLin, bgLin), 2),
    };
}

/**
 * APCA Lc value per APCA-W3 0.1.9 (SACAM 0.98G).
 * Reference: https://github.com/Myndex/SAPC-APCA
 * Returned value is rounded to 2 decimals.
 *  - Positive Lc: dark text on light bg
 *  - Negative Lc: light text on dark bg
 */
export function apcaContrast(fg, bg) {
    const fgLin = toLinearSrgbFromOklch(fg);
    const bgLin = toLinearSrgbFromOklch(bg);
    return round(apcaLcFromLinear(fgLin, bgLin), 2);
}

const SA98G = {
    mainTRC: 2.4,
    Rco: 0.2126729,
    Gco: 0.7151522,
    Bco: 0.072175,
    normBG: 0.56,
    normTXT: 0.57,
    revTXT: 0.62,
    revBG: 0.65,
    blkThrs: 0.022,
    blkClmp: 1.414,
    scaleBoW: 1.14,
    scaleWoB: 1.14,
    loBoWoffset: 0.027,
    loWoBoffset: 0.027,
    deltaYmin: 0.0005,
    loClip: 0.1,
};

function sapcLuminance(r, g, b) {
    const R = clamp(r, 0, 1) ** SA98G.mainTRC;
    const G = clamp(g, 0, 1) ** SA98G.mainTRC;
    const B = clamp(b, 0, 1) ** SA98G.mainTRC;
    return SA98G.Rco * R + SA98G.Gco * G + SA98G.Bco * B;
}

function sapcContrast(Ytxt, Ybg) {
    const txt =
        Ytxt < SA98G.blkThrs
            ? Ytxt + (SA98G.blkThrs - Ytxt) ** SA98G.blkClmp
            : Ytxt;
    const bg =
        Ybg < SA98G.blkThrs
            ? Ybg + (SA98G.blkThrs - Ybg) ** SA98G.blkClmp
            : Ybg;

    if (Math.abs(bg - txt) < SA98G.deltaYmin) return 0;

    let SAPC = 0;
    let outputContrast = 0;

    if (bg > txt) {
        // Dark text on light background
        SAPC = (bg ** SA98G.normBG - txt ** SA98G.normTXT) * SA98G.scaleBoW;
        outputContrast = SAPC < SA98G.loClip ? 0 : SAPC - SA98G.loBoWoffset;
    } else {
        // Light text on dark background
        SAPC = (bg ** SA98G.revBG - txt ** SA98G.revTXT) * SA98G.scaleWoB;
        outputContrast = SAPC > -SA98G.loClip ? 0 : SAPC + SA98G.loWoBoffset;
    }

    return outputContrast * 100;
}

function clamp(x, lo, hi) {
    return Math.min(Math.max(x, lo), hi);
}

function round(x, dp) {
    const f = 10 ** dp;
    return Math.round(x * f) / f;
}
