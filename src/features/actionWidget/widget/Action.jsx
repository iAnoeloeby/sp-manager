import React from "react";

import { FunctionIcon } from "@phosphor-icons/react";

import { Item } from "@/components/ui/Item";

/**
 * Placeholder — design TBD.
 * Renders icon from Phosphor based on item.icon, or fallback char.
 *
 * @param {{ item: import("@/contexts/Layout.context").LayoutItem }} props
 */
export default function ActionWidget({ item }) {
    return (
        <Item className="rounded-full bg-muted/50 flex items-center justify-center">
            <FunctionIcon />
        </Item>
    );
}
