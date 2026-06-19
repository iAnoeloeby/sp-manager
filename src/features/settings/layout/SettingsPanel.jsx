import React, { useState } from "react";

import * as Phosphor from "@phosphor-icons/react";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/Button";
import SettingsSection from "@/features/settings/layout/SettingsSection";

import GeneralBody from "@/features/settings/components/section/general";
import AppearanceBody from "@/features/settings/components/section/appearance";
import ExtensionBody from "@/features/settings/components/section/extension";
import AboutBody from "@/features/settings/components/section/about";

/**
 * @typedef {{
 *   key: string,
 *   icon: React.ComponentType<{ className?: string }>,
 *   footer: boolean,
 *   section: { title: string, description: string },
 *   Body: React.ComponentType<{ settings: any, onChange: (patch: Record<string, any>) => void }>,
 * }} SettingsSectionConfig
 */

const SECTIONS = /** @type {SettingsSectionConfig[]} */ ([
    {
        key: "general",
        icon: Phosphor.CirclesFourIcon,
        footer: false,
        section: {
            title: "General Settings",
            description:
                "Small preferences that keep the homepage personal and focused.",
        },
        Body: GeneralBody,
    },
    {
        key: "appearance",
        icon: Phosphor.PaintBrushIcon,
        footer: false,
        section: {
            title: "Appearance Settings",
            description:
                "Keep the visual system controlled, clean, and easy to use.",
        },
        Body: AppearanceBody,
    },
    {
        key: "extension",
        icon: Phosphor.PuzzlePieceIcon,
        footer: false,
        section: {
            title: "Extension preferences",
            description: "Configure how the extension behaves.",
        },
        Body: ExtensionBody,
    },
    {
        key: "about",
        icon: Phosphor.InfoIcon,
        footer: true,
        section: {
            title: "About this extension",
            description: "Version, credits, and helpful links.",
        },
        Body: AboutBody,
    },
]);

/**
 * @param {{
 *   open: boolean,
 *   settings: any,
 *   onClose: () => void,
 *   onChange: (patch: Record<string, any>) => void,
 *   onReset: () => void,
 * }} props
 */
export default function SettingsPanel({
    open,
    settings,
    onClose,
    onChange,
    onReset,
}) {
    const [activeKey, setActiveKey] = useState("general");
    const activeSection =
        SECTIONS.find((s) => s.key === activeKey) ?? SECTIONS[0];
    const ActiveBody = activeSection.Body;
    const mainSections = SECTIONS.filter((s) => !s.footer);
    const footerSections = SECTIONS.filter((s) => s.footer);

    /**
     * @param {SettingsSectionConfig} section
     */
    function renderMenuItem(section) {
        const Icon = section.icon;
        return (
            <SidebarMenuItem key={section.key}>
                <SidebarMenuButton
                    isActive={activeKey === section.key}
                    onClick={() => setActiveKey(section.key)}
                    className="capitalize"
                >
                    <Icon />
                    {section.key}
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                <main className="h-[70vh] max-h-[70vh] overflow-x-visible flex">
                    <Sidebar>
                        <SidebarContent>
                            <SidebarMenu>
                                {mainSections.map(renderMenuItem)}
                            </SidebarMenu>
                        </SidebarContent>
                        <SidebarFooter className="p-0">
                            <SidebarMenu>
                                {footerSections.map(renderMenuItem)}
                            </SidebarMenu>
                        </SidebarFooter>
                    </Sidebar>
                    <SidebarInset className="no-scrollbar flex-1 max-h-full overflow-y-auto space-y-4 ml-8 px-[1.25rem] py-[1rem] rounded-lg">
                        <SettingsSection
                            title={activeSection.section.title}
                            description={activeSection.section.description}
                        >
                            <ActiveBody
                                settings={settings}
                                onChange={onChange}
                            />
                        </SettingsSection>
                    </SidebarInset>
                </main>

                <DialogFooter className="sm:justify-between gap-3">
                    <Button onClick={onReset} variant="outline" size="lg">
                        Reset
                    </Button>
                    <Button onClick={onClose} variant="default" size="lg">
                        <span>Save</span>
                        <Phosphor.CheckCircleIcon
                            weight="fill"
                            className="size-5"
                        />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
