import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import format from "@/utils/format";
import { cn } from "@/utils/cn";

/**
 * Single fixture row within the scoreboard.
 * Horizontal layout: home (short + logo) | kickoff date+time | away (logo + short).
 *
 * The `fixture` prop follows the service data shape:
 *   { id, kickoff, home: { short, logo }, away: { short, logo } }
 *
 * @param {{
 *   fixture: { id: string|number, kickoff: string|Date, home: { short: string, logo: string }, away: { short: string, logo: string } },
 *   variant?: "default" | "compact"
 * }} props
 */
export default function FixtureRow({ fixture, variant = "default" }) {
    const compact = variant === "compact";

    return (
        <div
            className={cn(
                "grid grid-cols-[1fr_auto_1fr] gap-2 bg-muted/10 rounded-lg px-3 py-2",
                compact && "py-1.5 px-2",
            )}
        >
            <div className="flex items-center justify-end gap-2">
                <span className="font-medium text-sm tracking-wide">
                    {fixture.home.short}
                </span>
                <Avatar className="size-5 rounded-none after:border-none">
                    <AvatarImage
                        src={fixture.home.logo}
                        className="rounded-none"
                    />
                </Avatar>
            </div>
            <div className="px-4 text-center min-w-20 -my-2">
                <div className="flex flex-col bg-muted/10 lining-nums px-3 py-2 rounded-lg">
                    <span className="text-[10px] text-muted-foreground -mt-1 -mb-0.5">
                        {format.datetime.short.date(fixture.kickoff, {
                            numeric: true,
                        })}
                    </span>
                    <span className="text-sm font-semibold -mb-1">
                        {format.datetime.short.time(fixture.kickoff)}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Avatar className="size-5 rounded-none after:border-none">
                    <AvatarImage
                        src={fixture.away.logo}
                        className="rounded-none"
                    />
                </Avatar>
                <span className="font-medium text-sm tracking-wide">
                    {fixture.away.short}
                </span>
            </div>
        </div>
    );
}
