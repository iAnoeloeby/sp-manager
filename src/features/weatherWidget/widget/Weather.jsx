import React from "react";

import WeatherWidget from "@/features/weatherWidget/layout/WeatherWidget";

/**
 * Weather widget entry point.
 * Passes all props through to the layout component.
 *
 * @param {{ [key: string]: any }} props
 */
export default function Weather(props) {
    return <WeatherWidget {...props} />;
}
