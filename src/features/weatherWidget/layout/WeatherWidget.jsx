import React from "react";

import {
    WeatherCard,
    WeatherCardSkeleton,
} from "@/features/weatherWidget/components/WeatherCard";
import { useWeather } from "@/features/weatherWidget/hooks/useWeather";

/**
 * Weather widget layout.
 * Fetches data via useWeather hook and renders WeatherCard
 * with loading and error states handled.
 *
 * @param {{ [key: string]: any }} props
 */
export default function WeatherWidget(props) {
    const { weather, loading, error } = useWeather();

    if (loading) {
        return <WeatherCardSkeleton />;
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {error}
            </div>
        );
    }

    return <WeatherCard weather={weather} {...props} />;
}
