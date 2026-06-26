import React from "react";

import {
    ScoreboardCard,
    ScoreboardCardSkeleton,
} from "@/features/scoreboardWidget/components/ScoreboardCard";
import { useScoreboard } from "@/features/scoreboardWidget/hooks/useScoreboard";

/**
 * Scoreboard widget layout.
 * Fetches data via useScoreboard hook and renders ScoreboardCard
 * with loading and error states handled.
 *
 * @param {{ [key: string]: any }} props
 */
export default function ScoreboardWidget(props) {
    const { scoreboard, loading, error } = useScoreboard();

    if (loading) {
        return <ScoreboardCardSkeleton />;
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {error}
            </div>
        );
    }

    return <ScoreboardCard scoreboard={scoreboard} {...props} />;
}
