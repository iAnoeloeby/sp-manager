import React from "react";

import { DropSimpleIcon, WindIcon } from "@phosphor-icons/react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import WeatherIcon from "@/features/weatherWidget/components/WeatherIcon";

/**
 * Loading skeleton for the weather card.
 */
export function WeatherCardSkeleton() {
    return (
        <Card className="w-full h-full rounded-lg py-3 border-border/70">
            <CardHeader className="w-full flex justify-between gap-0 px-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-15 rounded-full" />
                    <Skeleton className="h-6 w-12" />
                </div>
                <div className="flex flex-col items-end">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24 mt-2" />
                    <div className="flex gap-2">
                        <Skeleton className="h-3 w-12 mt-1" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex px-4 justify-between gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton className="h-3 w-20" />
                ))}
            </CardContent>
        </Card>
    );
}

/**
 * Main weather card component.
 * Displays current conditions and a multi-day forecast.
 *
 * @param {{ weather: {
 *   location: string,
 *   temperature: number,
 *   feelsLike: number,
 *   humidity: number,
 *   windSpeed: number,
 *   condition: string,
 *   description: string,
 *   forecast: Array<{ day: string, high: number, low: number, condition: string }>
 * } | null }} props
 */
export function WeatherCard({ weather }) {
    if (!weather) return <WeatherCardSkeleton />;

    const {
        location,
        temperature,
        feelsLike,
        humidity,
        windSpeed,
        condition,
        description,
        forecast,
    } = weather;

    return (
        <Card className="w-full h-full justify-between rounded-lg py-2 border-border/70">
            {/* Header: location & description */}
            <CardHeader className="w-full gap-0 px-4 grid-cols-[auto_1fr]">
                <div className="flex flex-col items-end">
                    <div className="flex items-end-safe">
                        <WeatherIcon
                            condition={condition}
                            size={60}
                            weight="duotone"
                            className="text-amber-400 shrink-0 -mb-1"
                        />
                        <div className="text-4xl font-semibold leading-none tracking-tight">
                            {temperature}°
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <CardTitle className="text-base">{location}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                    {/* Detail row */}
                    <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <DropSimpleIcon
                                size={14}
                                weight="fill"
                                className="text-blue-400"
                            />
                            {humidity}%
                        </span>
                        <span className="flex items-center gap-1">
                            <WindIcon size={14} />
                            {windSpeed} km/h
                        </span>
                    </div>
                </div>
            </CardHeader>

            {/* Body: icon & temperature */}
            <CardContent className="flex flex-col px-4">
                {/* Forecast row */}
                {forecast && forecast.length > 0 && (
                    <div className="flex gap-2 w-full">
                        {forecast.map((day) => (
                            <div
                                key={day.day}
                                className="flex flex-col items-center flex-1 rounded-lg bg-muted/20 py-2 px-1 relative"
                            >
                                <span className="absolute top-1 right-1 text-[10px] font-medium">
                                    {day.high}°
                                </span>
                                <WeatherIcon
                                    condition={day.condition}
                                    size={20}
                                    weight="regular"
                                    className="mt-1"
                                />
                                <span className="mt-1 text-[10px] text-muted-foreground font-medium">
                                    {day.day}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
