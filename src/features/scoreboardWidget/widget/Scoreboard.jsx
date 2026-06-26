import React from "react";

import ScoreboardWidget from "@/features/scoreboardWidget/layout/ScoreboardWidget";

/**
 * Scoreboard widget entry point.
 * Passes all props through to the layout component.
 *
 * @param {{ [key: string]: any }} props
 */
export default function Scoreboard(props) {
    return <ScoreboardWidget {...props} />;
}
