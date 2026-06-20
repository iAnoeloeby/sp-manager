import { useCallback, useEffect, useState } from "react";

import {
    loadShortcuts,
    saveShortcuts,
    upsertShortcut,
    updateShortcut,
    removeShortcut,
} from "@/features/shortcuts/services/shortcutService";


export function useShortcuts() {
    const [shortcuts, setShortcuts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        loadShortcuts().then((items) => {
            if (!active) return;
            setShortcuts(items);
            setLoading(false);
        });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (loading) return;
        saveShortcuts(shortcuts);
    }, [loading, shortcuts]);

    const addShortcut = useCallback((shortcut) => {
        setShortcuts((current) => upsertShortcut(current, shortcut));
    }, []);

    const updateShortcutById = useCallback((shortcutId, patch) => {
        setShortcuts((current) => updateShortcut(current, shortcutId, patch));
    }, []);

    const deleteShortcut = useCallback((shortcutId) => {
        setShortcuts((current) => removeShortcut(current, shortcutId));
    }, []);

    return {
        shortcuts,
        loading,
        addShortcut,
        updateShortcut: updateShortcutById,
        deleteShortcut,
    };
}
