import React from "react";

import WidgetCell from "@/widgets/components/WidgetCell";
import WidgetRenderer from "@/widgets/components/WidgetRenderer";
import { widgetRegistry } from "@/widgets/registry/widgetRegistry";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} WidgetGridFeatures
 * @property {boolean=} dropdown
 * @property {boolean=} contextMenu
 */

/**
 * @param {{
 *   items: any[],
 *   startItems?: any[],
 *   endItems?: any[],
 *   className?: string,
 *   style?: React.CSSProperties,
 *   features?: WidgetGridFeatures
 * }} props
 */
export default function WidgetGrid({
    items,
    startItems = [],
    endItems = [],
    className,
    style = {},
    features = {},
}) {
    const [hoveredId, setHoveredId] = React.useState(null);

    const { dropdown = false, contextMenu = false } = features;

    const cells = [...startItems, ...items, ...endItems];

    return (
        <div
            key="widget-grid"
            className={cn("w-full h-full min-w-0 grid gap-4", className)}
            style={{
                gridTemplateColumns:
                    "repeat(var(--workspace-columns), var(--workspace-cell-size))",
                gridAutoRows: "var(--workspace-cell-size)",
                gap: "var(--workspace-gap)",
                ...style,
            }}
        >
            {cells.map((cell) => {
                if (cell.render) {
                    return (
                        <WidgetCell
                            key={cell.id}
                            item={cell}
                            cols={cell.cols}
                            rows={cell.rows}
                            isHovered={hoveredId === cell.id}
                            onMouseEnter={() => setHoveredId(cell.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {cell.render()}
                        </WidgetCell>
                    );
                }

                const definition = widgetRegistry[cell.type];

                if (!definition) {
                    console.warn(
                        `Widget type "${cell.type}" not found in registry.`,
                    );
                    return null;
                }

                return (
                    <WidgetCell
                        key={cell.id}
                        item={cell}
                        cols={cell.cols ?? definition.cols}
                        rows={cell.rows ?? definition.rows}
                        isHovered={hoveredId === cell.id}
                        onMouseEnter={() => setHoveredId(cell.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        enableDropdown={dropdown}
                        enableContextMenu={contextMenu}
                        dropdownMenu={definition.dropdownMenu}
                        contextMenu={definition.contextMenu}
                    >
                        <WidgetRenderer item={cell} />
                    </WidgetCell>
                );
            })}
        </div>
    );
}
