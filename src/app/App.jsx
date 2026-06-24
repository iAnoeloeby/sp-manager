import React from "react";

import AppLayout from "@/app/AppLayout";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { LayoutProvider } from "@/contexts/Layout.context";

export default function App() {
    const { settings, loading: settingsLoading } = useSettings();

    if (settingsLoading || !settings) {
        return null;
    }

    return (
        <LayoutProvider>
            <AppLayout />
        </LayoutProvider>
    );
}
