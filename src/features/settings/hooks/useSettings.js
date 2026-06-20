import { useCallback, useEffect, useRef, useState } from "react";

import {
    loadSettings,
    saveSettings,
    normalizeSettings,
    applySettingsToDocument,
    createDefaultSettings,
} from "@/features/settings/services/settingsService";
import {
    getCurrentWallpaper,
    refreshDailyWallpaper,
    wallpaperStorageKey,
} from "@/services/wallpaperService";

export function useSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const hydrated = useRef(false);

    useEffect(() => {
        let active = true;

        loadSettings().then(async (nextSettings) => {
            if (!active) return;

            if (
                nextSettings?.background?.mode === "image-background" &&
                nextSettings.background.source === "live-wallpaper"
            ) {
                const wallpaper =
                    (await getCurrentWallpaper()) ||
                    (await refreshDailyWallpaper(false));

                if (wallpaper?.url) {
                    nextSettings = normalizeSettings({
                        ...nextSettings,
                        background: {
                            ...nextSettings.background,
                            imageUrl: wallpaper.url,
                        },
                    });
                }
            }

            setSettings(nextSettings);
            setLoading(false);
            hydrated.current = true;
        });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!settings) return;
        applySettingsToDocument(settings);

        if (!hydrated.current) return;
        saveSettings(settings);
    }, [settings]);

    useEffect(() => {
        if (
            !settings ||
            settings.background.mode !== "image-background" ||
            settings.background.source !== "live-wallpaper"
        )
            return;

        if (
            typeof chrome === "undefined" ||
            !chrome.storage ||
            !chrome.storage.onChanged
        )
            return;

        const handleChanged = (changes, areaName) => {
            if (areaName !== "sync" || !changes[wallpaperStorageKey]) return;

            const nextWallpaper = changes[wallpaperStorageKey].newValue;
            if (!nextWallpaper?.url) return;

            setSettings((current) => {
                if (
                    !current ||
                    settings.background.mode !== "image-background" ||
                    settings.background.source !== "live-wallpaper"
                )
                    return current;

                return normalizeSettings({
                    ...current,
                    background: {
                        ...current.background,
                        imageUrl: nextWallpaper.url,
                    },
                });
            });
        };

        chrome.storage.onChanged.addListener(handleChanged);
        return () => chrome.storage.onChanged.removeListener(handleChanged);
    }, [settings]);

    const updateSettings = useCallback((patch) => {
        setSettings((current) => {
            const base = current || createDefaultSettings();
            const next =
                typeof patch === "function"
                    ? patch(base)
                    : { ...base, ...patch };
            return normalizeSettings(next);
        });
    }, []);

    const resetSettings = useCallback(() => {
        setSettings(createDefaultSettings());
    }, []);

    return {
        settings,
        loading,
        updateSettings,
        resetSettings,
    };
}
