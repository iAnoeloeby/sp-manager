import React from 'react'
import AppLayout from './AppLayout'
import { useSettings } from '../features/settings/hooks/useSettings'
import { useShortcuts } from '../features/shortcuts/hooks/useShortcuts'

export default function App() {
    const { settings, loading: settingsLoading, updateSettings, resetSettings } = useSettings()
    const {
        shortcuts,
        loading: shortcutsLoading,
        addShortcut,
        updateShortcut,
        deleteShortcut,
    } = useShortcuts()

    if (settingsLoading || shortcutsLoading || !settings) {
        return null
    }

    return (
        <AppLayout
            settings={settings}
            shortcuts={shortcuts}
            onSettingsChange={updateSettings}
            onSettingsReset={resetSettings}
            onAddShortcut={addShortcut}
            onUpdateShortcut={updateShortcut}
            onDeleteShortcut={deleteShortcut}
        />
    )
}