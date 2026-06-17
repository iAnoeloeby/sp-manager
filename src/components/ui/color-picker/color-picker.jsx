"use client";
import { Root } from "./parts/root";
import { Area } from "./parts/area";
import { Hue } from "./parts/hue";
import { Lightness } from "./parts/lightness";
import { Alpha } from "./parts/alpha";
import { CssInput } from "./parts/css-input";
import { FormatSwitcher } from "./parts/format-switcher";
import { ChannelInput } from "./parts/channel-input";
import { Swatches } from "./parts/swatches";
import { GamutBadge } from "./parts/gamut-badge";
import { ContrastReadout } from "./parts/contrast-readout";
import { Preview } from "./parts/preview";
import { EyeDropper } from "./parts/eye-dropper";

export { useColorPicker } from "./hooks/use-color-picker";
export {
    parseColor,
    formatColor,
    formatAll,
    gamutInfo,
    toGamut,
    contrast,
    getWcagContrast,
    getApcaContrast,
    apcaContrast,
    isValidColor,
} from "./lib/color";
export { colorChannels, setColorChannel } from "./lib/channels";

/**
 * Compositional color picker. Compose `<ColorPicker.Root>` with the named
 * parts to build the layout you want. Following shadcn convention there is
 * no kitchen-sink default component — see the docs for a copy-paste recipe
 * of the canonical layout.
 */
export const ColorPicker = {
    Root,
    Area,
    Hue,
    Lightness,
    Alpha,
    CssInput,
    FormatSwitcher,
    ChannelInput,
    Swatches,
    GamutBadge,
    ContrastReadout,
    Preview,
    EyeDropper,
};
