import React from "react";
import { widgetRegistry } from "@/widgets/registry/widgetRegistry";
import { cn } from "@/lib/utils";

export default function WidgetRenderer({ className = "", item }) {
    const definition = widgetRegistry[item.type];

    if (!definition) {
        return null;
    }

    const Component = definition.component;

    if (item.url) {
        return (
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("select-none w-fit h-fit", className)}
            >
                <Component item={item} />
            </a>
        );
    }

    if (item.onClick) {
        return (
            <button
                className={cn(
                    "pointer-events-none select-none w-fit h-fit",
                    className,
                )}
                onClick={item.onClick}
            >
                <Component item={item} />
            </button>
        );
    }

    return <Component item={item} />;
}
