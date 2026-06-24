import { WIDGET_TYPES } from "../constants/widgetTypes";

import ShortcutCard from "@/features/shortcuts/components/ShortcutCard";
import ShortcutContextMenu from "@/features/shortcuts/components/ShortcutContextMenu";
import ShortcutDropdownMenu from "@/features/shortcuts/components/ShortcutDropdownMenu";
import { ShortcutFormContent } from "@/features/shortcuts/components/ShortcutDialog";
import WeatherWidget from "@/features/weatherWidget/widget/Weather";
import ScoreboardWidget from "@/features/scoreboardWidget/widget/Scoreboard";
import ActionWidget from "@/features/actionWidget/widget/ActionWidget";
import ToolWidget from "@/features/toolWidget/widget/ToolWidget";

export const widgetRegistry = {
    [WIDGET_TYPES.SHORTCUT]: {
        component: ShortcutCard,
        dialogComponent: ShortcutFormContent,
        dropdownMenu: ShortcutDropdownMenu,
        contextMenu: ShortcutContextMenu,
        wrapper: "link",
        cols: 1,
        rows: 1,
    },

    [WIDGET_TYPES.SHORTCUT_GROUP]: {
        component: null, // ShortcutGroup
        dropdownMenu: ShortcutDropdownMenu,
        contextMenu: ShortcutContextMenu,
        wrapper: "none",
        cols: 2,
        rows: 2,
    },

    [WIDGET_TYPES.ACTION]: {
        component: ActionWidget,
        cols: 1,
        rows: 1,
    },

    [WIDGET_TYPES.TOOL]: {
        component: ToolWidget,
        cols: 1,
        rows: 1,
    },

    [WIDGET_TYPES.WEATHER]: {
        component: WeatherWidget,
        dropdownMenu: ShortcutDropdownMenu,
        contextMenu: ShortcutContextMenu,
        wrapper: "none",
        cols: 4,
        rows: 2,
    },

    [WIDGET_TYPES.PLANNER]: {
        component: null, // PlannerCard
        dropdownMenu: ShortcutDropdownMenu,
        contextMenu: ShortcutContextMenu,
        wrapper: "none",
        cols: 4,
        rows: 2,
    },

    [WIDGET_TYPES.CALENDAR]: {
        component: null, // CalendarCard
        dropdownMenu: ShortcutDropdownMenu,
        contextMenu: ShortcutContextMenu,
        wrapper: "none",
        cols: 4,
        rows: 2,
    },

    [WIDGET_TYPES.SCOREBOARD]: {
        component: ScoreboardWidget,
        dropdownMenu: ShortcutDropdownMenu,
        contextMenu: ShortcutContextMenu,
        wrapper: "none",
        cols: 4,
        rows: 2,
    },
};
