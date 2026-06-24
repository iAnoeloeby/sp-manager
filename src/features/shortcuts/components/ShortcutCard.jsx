import React from "react";

import { Item } from "@/components/ui/Item";
import { ShortcutIcon } from "@/features/shortcuts/components/ShortcutIcon";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton untuk shortcut card.
 */
export function ShortcutCardSkeleton() {
    return (
        <Item>
            <Skeleton className="size-7.5 aspect-square rounded-full" />
        </Item>
    );
}

/**
 * ShortcutCard
 *
 * Dipakai oleh:
 *   1. `WidgetRenderer` (melalui `widgetRegistry`) — mengirim prop `item`
 *   2. `ShortcutGrid` (di tests/legacy) — mengirim prop `shortcut`
 *
 * Karena itu, terima dua-duanya (`shortcut ?? item`) supaya widget
 * ini bisa dipakai dari kedua jalur.
 *
 * @param {{
 *   shortcut?: object,
 *   item?: object,
 *   onEdit?: (s: object) => void,
 *   onCopy?: (s: object) => void,
 *   onDelete?: (s: object) => void,
 *   variant?: "default" | "extended"
 * }} props
 */
export default function ShortcutCard({ shortcut, item, variant = "default" }) {
    const data = shortcut ?? item;

    // Guard: kalau `data` undefined, render placeholder.
    // Terjadi saat grid render data belum siap / race condition.
    if (!data || typeof data !== "object") {
        return (
            <div aria-hidden="true" className="size-10 rounded-lg bg-muted" />
        );
    }

    return (
        <Item onClick={(e) => e.stopPropagation()}>
            <ShortcutIcon shortcut={data} />
        </Item>
    );
}
