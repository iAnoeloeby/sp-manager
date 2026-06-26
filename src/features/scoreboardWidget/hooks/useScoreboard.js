import React from "react";

import { fetchScoreboard } from "@/features/scoreboardWidget/services/scoreboardService";

/**
 * Hook to fetch scoreboard data.
 * Returns the full scoreboard payload along with loading/error states and a refetch trigger.
 *
 * @returns {{
 *   scoreboard: import("@/features/scoreboardWidget/services/scoreboardService").ScoreboardData | null,
 *   loading: boolean,
 *   error: string | null,
 *   refetch: () => void,
 * }}
 */
export function useScoreboard() {
    const [scoreboard, setScoreboard] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchScoreboard();
            setScoreboard(data);
        } catch (err) {
            setError(err?.message ?? "Failed to load scoreboard data");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        load();
    }, [load]);

    return { scoreboard, loading, error, refetch: load };
}
