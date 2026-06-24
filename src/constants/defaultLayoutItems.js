// ponytail: seed data for each layout zone when localStorage is empty.
// Type "tool" items use icon+onClick, "action" uses options, "shortcut" uses url.
// Add new items here when a new widget type needs a default in a zone.

/** @type {import("@/contexts/Layout.context").LayoutItem[]} */
export const defaultLeftRailItems = [
    {
        id: "mode-switch",
        type: "action",
        title: "Mode Switch",
        options: {
            light: "SunIcon",
            dark: "MoonStarsIcon",
        },
    },
];

/** @type {import("@/contexts/Layout.context").LayoutItem[]} */
export const defaultRightRailItems = [
    {
        id: "gmail",
        type: "shortcut",
        title: "Gmail",
        url: "https://mail.google.com",
    },
];

/** @type {import("@/contexts/Layout.context").LayoutItem[]} */
export const defaultDockItems = [
    {
        id: "youtube",
        type: "shortcut",
        title: "YouTube",
        url: "https://youtube.com",
    },
    {
        id: "todos",
        type: "tool",
        title: "Todos",
        icon: "ListChecksIcon",
        onClick: "action.open.todos",
    },
    {
        id: "notes",
        type: "tool",
        title: "Notes",
        icon: "NoteIcon",
        onClick: "action.open.notes",
    },
    {
        id: "reminders",
        type: "tool",
        title: "Reminders",
        icon: "BellRingingIcon",
        onClick: "action.open.reminders",
    },
];

/** @type {import("@/contexts/Layout.context").LayoutItem[]} */
export const defaultWorkspaceItems = [];
