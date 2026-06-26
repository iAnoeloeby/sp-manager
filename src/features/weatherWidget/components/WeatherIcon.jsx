import React from "react";

import {
    SunIcon,
    CloudSunIcon,
    CloudRainIcon,
    CloudIcon,
    CloudLightningIcon,
    CloudSnowIcon,
    CloudFogIcon,
} from "@phosphor-icons/react";

/** @typedef {import("@phosphor-icons/react").Icon} Icon */
/** @typedef {import("@phosphor-icons/react").IconWeight} IconWeight */

/**
 * Map a weather condition string to a Phosphor icon component.
 *
 * @param {string} condition
 * @returns {Icon}
 */
function resolveIcon(condition) {
    switch (condition) {
        case "sunny":
        case "clear":
            return SunIcon;
        case "partly-cloudy":
            return CloudSunIcon;
        case "cloudy":
        case "overcast":
            return CloudIcon;
        case "rainy":
        case "rain":
            return CloudRainIcon;
        case "storm":
        case "thunderstorm":
            return CloudLightningIcon;
        case "snow":
        case "snowy":
            return CloudSnowIcon;
        case "fog":
        case "foggy":
            return CloudFogIcon;
        default:
            return SunIcon;
    }
}

/**
 * Weather icon component backed by Phosphor Icons.
 * Resolves the icon based on the condition string.
 *
 * @param {{ condition: string, size?: number, weight?: IconWeight, className?: string }} props
 */
export default function WeatherIcon({
    condition,
    size = 24,
    weight = "regular",
    className = "",
}) {
    const Icon = resolveIcon(condition);
    return <Icon size={size} weight={weight} className={className} />;
}
