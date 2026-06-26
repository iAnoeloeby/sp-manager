import React from "react";

import {
    ToolCard,
    ToolCardText,
    ToolText,
} from "@/features/toolWidget/components/ToolCard";

/**
 * Placeholder — design TBD.
 * future Variants:
 *   - icon      : 1x1 (default)
 *   - text       : 1x2, uses item.title
 *   - icon-text  : 1x2, uses item.icon + item.title
 *
 * @param {{ item: import("@/contexts/Layout.context").LayoutItem }} props
 */
export default function ToolWidget({ item }) {
    const variant = item.variant || "icon";

    if (variant === "text") {
        return <ToolText item={item} />;
    }

    if (variant === "icon-text") {
        return <ToolCardText item={item} />;
    }

    // icon variant (default)
    return <ToolCard />;
}
