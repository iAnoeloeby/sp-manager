import React from 'react'

import AppLayout from "@/app/AppLayout";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { useDockItems } from "@/features/dockItems/hooks/useDockItems";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";

export default function App() {
    const {
        settings,
        loading: settingsLoading,
        updateSettings,
        resetSettings,
    } = useSettings();
    const {
        shortcuts,
        loading: shortcutsLoading,
        addShortcut,
        updateShortcut,
        deleteShortcut,
    } = useShortcuts();
    const {
        leftRailItems,
        rightRailItems,
        dockItems,
        workspaceItems,
        loading: dockItemsLoading,
        addItem,
        deleteItem,
    } = useDockItems();

    if (settingsLoading || shortcutsLoading || dockItemsLoading || !settings) {
        return null;
    }

    return (
        <AppLayout
            settings={settings}
            shortcuts={shortcuts}
            leftRailItems={leftRailItems}
            rightRailItems={rightRailItems}
            dockItems={dockItems}
            workspaceItems={workspaceItems}
            onAddDockItem={addItem}
            onDeleteDockItem={deleteItem}
            onSettingsChange={updateSettings}
            onSettingsReset={resetSettings}
            onAddShortcut={addShortcut}
            onUpdateShortcut={updateShortcut}
            onDeleteShortcut={deleteShortcut}
        />
    );
}
