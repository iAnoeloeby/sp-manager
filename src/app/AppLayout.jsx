import React from "react";

import PageShell from "@/layout/PageShell";
import LeftRail from "@/layout/LeftRail";
import RightRail from "@/layout/RightRail";
import BottomDock from "@/layout/BottomDock";
import SettingsPanel from "@/features/settings/layout/SettingsPanel";

import { useSettings } from "@/features/settings/hooks/useSettings";
import { buildBackgroundImage } from "@/features/settings/utils/backgroundUtils";

export default function AppLayout() {
    const { settings } = useSettings();
    const [openSettings, setOpenSettings] = React.useState(false);

    const isImageBackground =
        settings.background?.mode === "image-background" &&
        Boolean(settings.background?.imageUrl);

    const pageStyle = React.useMemo(() => {
        const imageBackgroundStyle = isImageBackground
            ? {
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed",
              }
            : {};

        return {
            backgroundImage: buildBackgroundImage(settings.background),
            ...imageBackgroundStyle,
        };
    }, [isImageBackground, settings.background]);

    return (
        <div
            className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground"
            style={pageStyle}
        >
            <div className="flex w-full min-w-0 bg-background/20 backdrop-blur-xs">
                <LeftRail />
                <PageShell className="relative min-h-screen" />
                <RightRail onOpenSettings={() => setOpenSettings(true)} />
            </div>

            <BottomDock />

            <SettingsPanel
                open={openSettings}
                onClose={() => setOpenSettings(false)}
            />
        </div>
    );
}
