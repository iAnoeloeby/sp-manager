import React from "react";
import { formatDate, formatTime } from "../../../utils/dateUtils";
import { useClock } from "../hooks/useClock";

function timeChars(timeText) {
    return Array.from(timeText).map((char, index) => {
        const isDigit = /\d/.test(char);
        const isSeparator = char === ":" || char === " ";

        return (
            <span
                key={`${char}-${index}`}
                aria-hidden="true"
                className={[
                    "inline-flex items-center justify-center align-baseline",
                    isDigit ? "w-[0.65em]" : "",
                    isSeparator ? "w-[0.35em]" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                {char}
            </span>
        );
    });
}

export default function ClockWidget({ format = "24h", showSeconds = true }) {
    const now = useClock();
    const timeText = formatTime(now, format, showSeconds);

    return (
        <div className="flex flex-col gap-2 text-center">
            <div className="text-sm font-medium text-neutral-700">
                {formatDate(now)}
            </div>
            <div
                className="font-clock -mt-4 font-extralight text-5xl leading-none tracking-tight text-foreground whitespace-nowrap sm:text-6xl lg:text-[3.75rem]"
                aria-label={timeText}
                role="text"
            >
                {timeChars(timeText)}
            </div>
        </div>
    );
}
