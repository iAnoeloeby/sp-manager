import React from "react";

import { ToolboxIcon } from "@phosphor-icons/react";

import { Item } from "@/components/ui/Item";

export function ToolText({ item }) {
    return (
        <Item className="w-full h-full rounded-lg bg-muted/50 flex items-center justify-center px-3">
            <span className="text-xs font-medium text-foreground/80 truncate">
                {item.title}
            </span>
        </Item>
    );
}

export function ToolCardText({ item }) {
    return (
        <Item className="w-full h-full rounded-lg bg-muted/50 flex items-center justify-center gap-2 px-3">
            {/* ponytail: replace with Phosphor dynamic icon when designed */}
            <span className="size-4 rounded bg-foreground/20" />
            <span className="text-xs font-medium text-foreground/80 truncate">
                {item.title}
            </span>
        </Item>
    );
}

export function ToolCard() {
    return (
        <Item className="rounded-full bg-muted/50 flex items-center justify-center">
            <ToolboxIcon />
        </Item>
    );
}
