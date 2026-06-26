import React from "react";

import { fetchWeather } from "@/features/weatherWidget/services/weatherService";

/**
 * Hook to fetch weather data.
 * Returns the weather payload along with loading/error states and a refetch trigger.
 *
 * @returns {{
 *   weather: import("@/features/weatherWidget/services/weatherService").WeatherData | null,
 *   loading: boolean,
 *   error: string | null,
 *   refetch: () => void,
 * }}
 */
export function useWeather() {
    const [weather, setWeather] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchWeather();
            setWeather(data);
        } catch (err) {
            setError(err?.message ?? "Failed to load weather data");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        load();
    }, [load]);

    return { weather, loading, error, refetch: load };
}
