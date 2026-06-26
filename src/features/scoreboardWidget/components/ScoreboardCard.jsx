import React from "react";

import { MapPinIcon } from "@phosphor-icons/react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import FixtureRow from "./FixtureRow";

import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */

/**
 * Loading skeleton for the scoreboard card.
 * Renders two placeholder sections: team matches and league matches.
 */
function ScoreboardCardSkeleton() {
    return (
        <Card className="w-full h-full justify-between rounded-lg py-2 border-border/70 gap-4">
            {/* Header */}
            <CardHeader className="w-full flex justify-between items-center gap-0 px-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
            </CardHeader>

            {/* League matches section */}
            <CardContent className="flex flex-col px-4 gap-2">
                <Skeleton className="h-3 w-24" />
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-center rounded-lg bg-muted/20 px-3 py-2.5 gap-3"
                        >
                            <div className="flex gap-2 items-center">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="size-5" />
                            </div>
                            <span className="text-xs text-muted-foreground/50">
                                vs
                            </span>
                            <div className="flex gap-2 items-center">
                                <Skeleton className="size-5" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col rounded-lg bg-muted/10 h-20 gap-2"></div>
            </CardContent>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

/**
 * Scoreboard card component.
 * Displays team info and fixture list.
 *
 * @param {{ scoreboard: import("@/features/scoreboardWidget/services/scoreboardService").ScoreboardData | null }} props
 */
function ScoreboardCard({ scoreboard }) {
    if (!scoreboard) return <ScoreboardCardSkeleton />;

    const { team, fixtures } = scoreboard;

    return (
        <Card
            className={cn(
                "top-1 justify-between rounded-lg py-2 border-border/70 gap-2",
                "w-full h-full",
            )}
        >
            <CardHeader className="w-full gap-0 px-4 grid-cols-[1fr_auto] items-end">
                <CardTitle className="text-base flex items-center gap-1.5">
                    {team.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                    <MapPinIcon size={12} className="text-muted-foreground" />
                    {team.league}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col px-4 gap-2">
                {fixtures.map((fixture) => (
                    <FixtureRow key={fixture.id} fixture={fixture} />
                ))}
            </CardContent>
        </Card>
    );
}

export { ScoreboardCard, ScoreboardCardSkeleton };
