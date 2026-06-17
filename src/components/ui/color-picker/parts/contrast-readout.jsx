"use client";
import * as React from "react";
import { useColorStateSlice, useBackgroundStateSlice } from "../context";
import { getWcagContrast, getApcaContrast, formatColor } from "../lib/color";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { XCircleIcon, CheckCircleIcon } from "@phosphor-icons/react";

const CHECKERBOARD =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'><rect width='4' height='4' fill='%23ccc'/><rect x='4' y='4' width='4' height='4' fill='%23ccc'/></svg>\")";

const DEFAULT_METRICS = ["wcag"];

export const ContrastReadout = React.forwardRef(function ContrastReadout(
    {
        metrics = DEFAULT_METRICS,
        defaultMetric,
        showLabel = true,
        showValue = true,
        showBadges = true,
        className,
        ...rest
    },
    ref,
) {
    // P6: subscribe to color + background only.
    const color = useColorStateSlice((s) => s.color);
    const background = useBackgroundStateSlice((s) => s.background);

    // Defer the canonical color so pointer drags don't drive the heavy
    // contrast work at the same priority as the body label. The body still
    // re-renders immediately (using the live `color`); only the contrast
    // computation and tooltip payload run on React's deferred lane.
    const deferredColor = React.useDeferredValue(color);

    const initial =
        defaultMetric && metrics.includes(defaultMetric)
            ? defaultMetric
            : metrics[0];
    const [active, setActive] = React.useState(initial);

    // If the parent narrows `metrics` so the previously-active option is no
    // longer offered, fall back to the first one. Adjusting state during
    // rendering — no useEffect needed; React re-renders synchronously and the
    // updated state is visible to the rest of this render pass.
    if (!metrics.includes(active)) {
        setActive(metrics[0]);
    }

    const togglable = metrics.length > 1;
    const cycle = () => {
        const i = metrics.indexOf(active);
        setActive(metrics[(i + 1) % metrics.length]);
    };

    // P8: only compute the active metric. Cache key includes OKLCH scalars
    // of fg + bg (cheap structural-compare deps) + the metric name.
    const wcag = React.useMemo(
        () =>
            active === "wcag"
                ? getWcagContrast(deferredColor, background)
                : null,
        [
            active,
            deferredColor.l,
            deferredColor.c,
            deferredColor.h,
            deferredColor.alpha,
            background.l,
            background.c,
            background.h,
        ],
    );
    const apca = React.useMemo(
        () =>
            active === "apca"
                ? getApcaContrast(deferredColor, background)
                : null,
        [
            active,
            deferredColor.l,
            deferredColor.c,
            deferredColor.h,
            deferredColor.alpha,
            background.l,
            background.c,
            background.h,
        ],
    );

    // Tooltip "open" tracking. Radix Tooltip doesn't expose onOpenChange on
    // the uncontrolled component, so we control it via Tooltip
    // `open`+`onOpenChange` — this lets us skip computing fgCss/bgCss and
    // the popover payload until the user actually hovers/focuses.
    const [tooltipOpen, setTooltipOpen] = React.useState(false);

    // Lazy tooltip content: only format the CSS strings and build the popover
    // payload when the tooltip is open. The popover value is derived from the
    // same deferred contrast pair, so it stays consistent with the body.
    const tooltipPayload = React.useMemo(() => {
        if (!tooltipOpen) return null;
        const fgCss = formatColor(deferredColor, "p3");
        const bgCss = formatColor(background, "p3");
        const popover =
            active === "wcag" && wcag
                ? wcagPopover(
                      wcag.wcag,
                      wcag.wcagLevel.aaNormal,
                      wcag.wcagLevel.aaaNormal,
                  )
                : active === "apca" && apca !== null
                  ? apcaPopover(apca)
                  : null;
        if (!popover) return null;
        return {
            title: popover.title,
            rows: popover.rows,
            fg: fgCss,
            bg: bgCss,
        };
    }, [
        tooltipOpen,
        active,
        wcag,
        apca,
        deferredColor.l,
        deferredColor.c,
        deferredColor.h,
        deferredColor.alpha,
        background.l,
        background.c,
        background.h,
    ]);

    const baseClass =
        "flex w-full items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5 text-xs";

    const body =
        active === "wcag" && wcag ? (
            <WcagBody
                wcag={wcag.wcag}
                aa={wcag.wcagLevel.aaNormal}
                aaa={wcag.wcagLevel.aaaNormal}
                showLabel={showLabel}
                showValue={showValue}
                showBadges={showBadges}
            />
        ) : active === "apca" && apca !== null ? (
            <ApcaBody
                lc={apca}
                showLabel={showLabel}
                showValue={showValue}
                showBadges={showBadges}
            />
        ) : null;

    if (togglable) {
        const nextMetric =
            metrics[(metrics.indexOf(active) + 1) % metrics.length];
        return (
            <TooltipProvider delayDuration={150}>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger asChild>
                        <button
                            ref={ref}
                            data-slot="color-picker-contrast-readout"
                            type="button"
                            onClick={cycle}
                            aria-label={`Contrast (${active.toUpperCase()}). Click to switch to ${nextMetric.toUpperCase()}.`}
                            className={cn(
                                baseClass,
                                "cursor-pointer text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                className,
                            )}
                            {...rest}
                        >
                            {body}
                            <span
                                aria-hidden="true"
                                className="ml-auto text-muted-foreground"
                            >
                                ⇅
                            </span>
                        </button>
                    </TooltipTrigger>
                    {tooltipPayload && (
                        <TooltipContent
                            side="top"
                            align="center"
                            className="max-w-[260px] bg-popover p-2.5 text-popover-foreground shadow-md"
                        >
                            <PopoverPanel
                                title={tooltipPayload.title}
                                rows={tooltipPayload.rows}
                                fg={tooltipPayload.fg}
                                bg={tooltipPayload.bg}
                                footer={`Click to switch to ${nextMetric.toUpperCase()}`}
                            />
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                    <div
                        ref={ref}
                        data-slot="color-picker-contrast-readout"
                        role="group"
                        tabIndex={0}
                        aria-label="Contrast against background"
                        className={cn(
                            baseClass,
                            "cursor-default outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            className,
                        )}
                        {...rest}
                    >
                        {body}
                    </div>
                </TooltipTrigger>
                {tooltipPayload && (
                    <TooltipContent
                        side="top"
                        align="center"
                        className="max-w-[260px] bg-popover p-2.5 text-popover-foreground shadow-md"
                    >
                        <PopoverPanel
                            title={tooltipPayload.title}
                            rows={tooltipPayload.rows}
                            fg={tooltipPayload.fg}
                            bg={tooltipPayload.bg}
                        />
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
});

const WcagBody = React.memo(function WcagBody({
    wcag,
    aa,
    aaa,
    showLabel,
    showValue,
    showBadges,
}) {
    return (
        <>
            {(showLabel || showValue) && (
                <div className="flex items-center gap-1.5">
                    {showLabel && (
                        <span className="text-muted-foreground">WCAG</span>
                    )}
                    {showValue && (
                        <span className="font-mono font-medium">
                            {wcag.toFixed(2)}:1
                        </span>
                    )}
                </div>
            )}
            {showBadges && (
                <div className="flex items-center gap-1">
                    <Badge ok={aa}>AA</Badge>
                    <Badge ok={aaa}>AAA</Badge>
                </div>
            )}
        </>
    );
});

const ApcaBody = React.memo(function ApcaBody({
    lc,
    showLabel,
    showValue,
    showBadges,
}) {
    const abs = Math.abs(lc);
    const level = abs >= 75 ? "headline" : abs >= 60 ? "body" : "fail";
    return (
        <>
            {(showLabel || showValue) && (
                <div className="flex items-center gap-1.5">
                    {showLabel && (
                        <span className="text-muted-foreground">APCA</span>
                    )}
                    {showValue && (
                        <span className="font-mono font-medium">
                            Lc {lc.toFixed(1)}
                        </span>
                    )}
                </div>
            )}
            {showBadges && (
                <div className="flex items-center gap-1">
                    <Badge ok={level !== "fail"}>
                        {level === "headline"
                            ? "headline"
                            : level === "body"
                              ? "body"
                              : "fail"}
                    </Badge>
                </div>
            )}
        </>
    );
});

function Badge({ ok, children }) {
    return (
        <span
            aria-label={
                typeof children === "string"
                    ? `${children} ${ok ? "passes" : "fails"}`
                    : undefined
            }
            className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                ok
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "bg-red-500/15 text-red-700 dark:text-red-400",
            )}
        >
            {children}
        </span>
    );
}

const PopoverPanel = React.memo(function PopoverPanel({
    title,
    rows,
    fg,
    bg,
    footer,
}) {
    return (
        <div className="flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {title}
                </div>
                <div
                    aria-hidden
                    className="flex shrink-0 overflow-hidden rounded border border-border"
                    title={`fg ${fg} on bg ${bg}`}
                >
                    <Chip color={fg} />
                    <Chip color={bg} />
                </div>
            </div>
            <ul className="flex flex-col gap-1.5">
                {rows.map((r) => (
                    <li key={r.label} className="flex items-start gap-2">
                        <span
                            aria-hidden
                            className={cn(
                                "mt-0.5 inline-flex size-3.5 shrink-0 items-center justify-center rounded-full",
                                r.ok
                                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                    : "bg-red-500/20 text-red-600 dark:text-red-400",
                            )}
                        >
                            {r.ok ? (
                                <CheckCircleIcon
                                    weight="bold"
                                    className="size-2.5"
                                />
                            ) : (
                                <XCircleIcon
                                    weight="bold"
                                    className="size-2.5"
                                />
                            )}
                        </span>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium leading-tight">
                                {r.label}
                            </span>
                            <span className="text-[11px] leading-snug text-muted-foreground">
                                {r.detail}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
            {footer && (
                <div className="border-t border-border pt-1.5 text-[11px] text-muted-foreground">
                    {footer}
                </div>
            )}
        </div>
    );
});

function Chip({ color }) {
    return (
        <span
            className="block size-4"
            style={{ backgroundImage: CHECKERBOARD, backgroundSize: "8px 8px" }}
        >
            <span className="block size-full" style={{ background: color }} />
        </span>
    );
}

function wcagPopover(ratio, aa, aaa) {
    return {
        title: `WCAG ${ratio.toFixed(2)}:1`,
        rows: [
            {
                ok: aa,
                label: aa ? "Passes AA" : "Fails AA",
                detail: "Body text needs ≥ 4.5:1",
            },
            {
                ok: aaa,
                label: aaa ? "Passes AAA" : "Fails AAA",
                detail: "Enhanced body text needs ≥ 7:1",
            },
        ],
    };
}

function apcaPopover(lc) {
    const abs = Math.abs(lc);
    const passesBody = abs >= 60;
    const passesHeadline = abs >= 75;
    return {
        title: `APCA Lc ${lc.toFixed(1)}`,
        rows: [
            {
                ok: passesBody,
                label: passesBody ? "Passes body text" : "Fails body text",
                detail: "Body text needs |Lc| ≥ 60",
            },
            {
                ok: passesHeadline,
                label: passesHeadline ? "Passes headlines" : "Fails headlines",
                detail: "Headline / large text needs |Lc| ≥ 75",
            },
        ],
    };
}
