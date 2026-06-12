import React, { useMemo, useState } from "react"
import PageShell from "../components/layout/PageShell"
import Button from "@/components/ui/Button";
import {Card} from "../components/ui/Card"
import IconButton from "../components/ui/IconButton"
import SearchBar from "../features/search/components/SearchBar"
import Greeting from "../features/greeting/components/Greeting"
import ClockWidget from "../features/clock/components/ClockWidget"
import ShortcutGrid from "../features/shortcuts/components/ShortcutGrid"
import SettingsPanel from "../features/settings/components/SettingsPanel"
import { buildBackgroundImage } from "../features/settings/utils/backgroundUtils"
import { GearSixIcon } from "@phosphor-icons/react";

export default function AppLayout({
    settings,
    shortcuts,
    onSettingsChange,
    onSettingsReset,
    onAddShortcut,
    onUpdateShortcut,
    onDeleteShortcut,
}) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isShortcutFormOpen, setIsShortcutFormOpen] = useState(false);
    const [editingShortcut, setEditingShortcut] = useState(null);
    const isImageBackground =
        settings.background?.type === "image" &&
        Boolean(settings.background?.imageUrl);

    const pageStyle = useMemo(() => {
        const imageBackgroundStyle = isImageBackground
            ? {
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed",
              }
            : {};

        return {
            backgroundImage: buildBackgroundImage(
                settings.background,
                settings.mode,
            ),
            ...imageBackgroundStyle,
        };
    }, [isImageBackground, settings.background, settings.mode]);

    function openShortcutForm(shortcut = null) {
        setEditingShortcut(shortcut);
        setIsShortcutFormOpen(true);
    }

    function closeShortcutForm() {
        setIsShortcutFormOpen(false);
        setEditingShortcut(null);
    }

    function saveShortcut(nextShortcut) {
        if (editingShortcut) {
            onUpdateShortcut(editingShortcut.id, nextShortcut);
        } else {
            onAddShortcut(nextShortcut);
        }

        closeShortcutForm();
    }

    return (
        <div
            className="relative min-h-screen bg-background text-foreground"
            style={pageStyle}
        >
            <div className="min-h-screen min-w-screen flex bg-background/20 backdrop-blur-xs">
                <aside className="max-md:hidden flex flex-col my-2">
                    <div className="flex flex-col items-center px-2">
                        <Button
                            variant="ghost"
                            size="icon-xl"
                            label="Open settings"
                            onClick={() => setIsSettingsOpen(true)}
                            className="text-foreground hover:text-foreground/70"
                        >
                            <GearSixIcon
                                weight="regular"
                                className="text-current"
                            />
                        </Button>
                    </div>
                </aside>

                <main className="relative flex-1 min-h-screen">
                    <PageShell className="relative min-h-screen py-6 pt-20 md:py-8 md:pt-20">
                        <div className="space-y-6">
                            <ClockWidget
                                format={settings.clockFormat}
                                showSeconds={settings.showSeconds}
                            />

                            <div className="flex flex-col">
                                <section className="mt-[5.25rem] mb-[5.25rem]">
                                    <SearchBar
                                        engineId={settings.searchEngine}
                                    />
                                </section>

                                <section>
                                    <Card className="border-border/70 bg-surface/85">
                                        <ShortcutGrid
                                            shortcuts={shortcuts}
                                            onEdit={openShortcutForm}
                                            onDelete={onDeleteShortcut}
                                            onAdd={() => openShortcutForm()}
                                        />
                                    </Card>
                                </section>
                            </div>
                        </div>
                    </PageShell>
                </main>

                <aside className="max-md:hidden flex flex-col my-2">
                    <div className="sticky flex flex-col items-center px-2">
                        <Button
                            variant="ghost"
                            size="icon-xl"
                            label="Open settings"
                            onClick={() => setIsSettingsOpen(true)}
                            className="text-foreground hover:text-foreground/70"
                        >
                            <GearSixIcon
                                weight="regular"
                                className="text-current"
                            />
                        </Button>
                    </div>
                </aside>
            </div>

            <div className="md:hidden">
                <div className="fixed right-2 top-4 z-20 flex flex-col items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon-xl"
                        label="Open settings"
                        onClick={() => setIsSettingsOpen(true)}
                        className="text-foreground hover:text-foreground/70"
                    >
                        <GearSixIcon
                            weight="regular"
                            className="text-current"
                        />
                    </Button>
                </div>
            </div>

            <SettingsPanel
                open={isSettingsOpen}
                settings={settings}
                onClose={() => setIsSettingsOpen(false)}
                onChange={onSettingsChange}
                onReset={onSettingsReset}
            />
        </div>
    );
}
