import React, { useMemo, useState } from 'react'
import PageShell from '../components/layout/PageShell'
import Card from '../components/ui/Card'
import IconButton from '../components/ui/IconButton'
import SearchBar from '../features/search/components/SearchBar'
import Greeting from '../features/greeting/components/Greeting'
import ClockWidget from '../features/clock/components/ClockWidget'
import ShortcutGrid from '../features/shortcuts/components/ShortcutGrid'
import ShortcutForm from '../features/shortcuts/components/ShortcutForm'
import SettingsPanel from '../features/settings/components/SettingsPanel'
import { buildBackgroundImage } from '../features/settings/utils/backgroundUtils'

export default function AppLayout({
    settings,
    shortcuts,
    onSettingsChange,
    onSettingsReset,
    onAddShortcut,
    onUpdateShortcut,
    onDeleteShortcut,
}) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isShortcutFormOpen, setIsShortcutFormOpen] = useState(false)
    const [editingShortcut, setEditingShortcut] = useState(null)
    const isImageBackground = settings.background?.type === 'image' && Boolean(settings.background?.imageUrl)

    const pageStyle = useMemo(
        () => {
            const imageBackgroundStyle = isImageBackground
                ? {
                      backgroundSize: 'cover',
                      backgroundPosition: 'center center',
                      backgroundRepeat: 'no-repeat',
                      backgroundAttachment: 'fixed',
                  }
                : {}

            return {
                backgroundImage: buildBackgroundImage(settings.background, settings.mode),
                ...imageBackgroundStyle,
            }
        },
        [isImageBackground, settings.background, settings.mode],
    )

    function openShortcutForm(shortcut = null) {
        setEditingShortcut(shortcut)
        setIsShortcutFormOpen(true)
    }

    function closeShortcutForm() {
        setIsShortcutFormOpen(false)
        setEditingShortcut(null)
    }

    function saveShortcut(nextShortcut) {
        if (editingShortcut) {
            onUpdateShortcut(editingShortcut.id, nextShortcut)
        } else {
            onAddShortcut(nextShortcut)
        }

        closeShortcutForm()
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground" style={pageStyle}>
            <IconButton
                label="Open settings"
                onClick={() => setIsSettingsOpen(true)}
                className="absolute right-6 top-6 z-20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 fill-current">
                    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A112.1,112.1,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.08,8.08,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8.08,8.08,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z">
                    </path>
                </svg>
            </IconButton>

            <div className="relative z-10 min-h-screen bg-background/20 backdrop-blur-xs">
                <PageShell className="relative min-h-screen py-6 pt-20 sm:py-8 sm:pt-20">
                    <div className="space-y-6">
                        <ClockWidget format={settings.clockFormat} showSeconds={settings.showSeconds} />

                        <main className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] mt-[8rem]">
                            <section className="space-y-6">
                                <Card className="border-border/70 bg-surface/85">
                                    <SearchBar engineId={settings.searchEngine} />
                                </Card>

                                <Card className="border-border/70 bg-surface/85">
                                    <ShortcutGrid
                                        shortcuts={shortcuts}
                                        onEdit={openShortcutForm}
                                        onDelete={onDeleteShortcut}
                                        onAdd={() => openShortcutForm()}
                                    />
                                </Card>
                            </section>

                            <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
                                <Card className="border-border/70 bg-surface/85">
                                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">Personalization</p>
                                    <div className="mt-3 space-y-3 text-sm leading-6 text-foreground/90">
                                        <p>Search, shortcuts, clock, greeting, and background preferences are all stored locally on this device.</p>
                                        <p>Use settings to keep the look controlled while still matching your preferred color and spacing language.</p>
                                    </div>
                                </Card>

                                <Card className="border-border/70 bg-surface/85">
                                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">Quick note</p>
                                    <div className="mt-3 text-sm leading-6 text-muted">
                                        Keep the design restrained and functional; the premium feel comes from spacing, contrast, and consistency.
                                    </div>
                                </Card>
                            </aside>
                        </main>
                    </div>
                </PageShell>
            </div>

            <ShortcutForm
                open={isShortcutFormOpen}
                shortcut={editingShortcut}
                onClose={closeShortcutForm}
                onSave={saveShortcut}
            />

            <SettingsPanel
                open={isSettingsOpen}
                settings={settings}
                onClose={() => setIsSettingsOpen(false)}
                onChange={onSettingsChange}
                onReset={onSettingsReset}
            />
        </div>
    )
}
