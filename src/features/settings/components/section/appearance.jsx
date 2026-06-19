import React from "react";

import { cn } from "@/lib/utils";

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldTitle,
} from "@/components/ui/field";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggleGroup";
import * as Phosphor from "@phosphor-icons/react";
import DialogColorPicker from "@/features/settings/components/DialogColorPicker";
import { Button } from "@/components/ui/Button";

import RadiusCustom from "@/features/settings/components/RadiusCustom";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import BackgroundSetting from "../BackgroundSetting";
import { getBackgroundMode } from "@/features/settings/utils/backgroundUtils";

const radiusOptions = [
    {
        value: "default",
        label: "Default",
        radius: "rounded-tr-[6px]",
    },
    {
        value: "none",
        label: "None",
        radius: "rounded-none",
    },
    {
        value: "sm",
        label: "SM",
        radius: "rounded-tr-sm",
    },
    {
        value: "md",
        label: "MD",
        radius: "rounded-tr-md",
    },
    {
        value: "lg",
        label: "LG",
        radius: "rounded-tr-lg",
    },
    {
        value: "xl",
        label: "XL",
        radius: "rounded-tr-xl",
    },
    {
        value: "custom",
        label: "Custom",
        icon: Phosphor.CornersOutIcon,
        custom: true,
    },
];

const typeOptions = [
    {
        value: "default",
        label: "Default",
        description: "Use the default background provided by browser.",
    },
    {
        value: "solid-background",
        label: "Solid",
        description: "Set a single color as background.",
    },
    {
        value: "gradient-background",
        label: "Gradient",
        description: "Use a gradient background with multiple colors.",
    },
    {
        value: "live-wallpaper-background",
        label: "Live Wallpaper",
        description:
            "Automatically background update with a new wallpaper every day.",
    },
    {
        value: "custom-wallpaper-background",
        label: "Custom Wallpaper",
        description: "Set own image as the background.",
    },
];

/**
 * @param {{
 *   settings: any,
 *   onChange: (patch: Record<string, any>) => void,
 * }} props
 */
export default function Appearance({ settings, onChange }) {
    const { copyToClipboard, isCopied } = useCopyToClipboard();

    const activeBackgroundMode = getBackgroundMode(settings.background);
    const selectedType = typeOptions.find(
        (option) => option.value === activeBackgroundMode,
    );

    function updateBackground(nextBackground) {
        onChange({ background: nextBackground });
    }

    function setRadius(mode) {
        if (!mode) return;

        onChange({
            borderRadius: {
                ...settings.borderRadius,
                mode,
            },
        });
    }

    function updateCorner(corner, value) {
        if (value === "") {
            value = null;
        } else {
            value = Math.min(Number(value), 100);
        }

        onChange({
            borderRadius: {
                ...settings.borderRadius,
                [corner]: value,
            },
        });
    }

    const setMode = (value) => onChange({ mode: value });

    function saveAccent(hex) {
        onChange({ accent: hex });
    }

    function setBackgroundMode(mode) {
        onChange((prev) => {
            switch (mode) {
                case "default":
                    return {
                        ...prev,
                        background: {
                            ...prev.background,
                            mode: "default",
                            source: undefined,
                        },
                    };

                case "solid-background":
                    return {
                        ...prev,
                        background: {
                            ...prev.background,
                            mode: "solid-background",
                            source: undefined,
                        },
                    };

                case "gradient-background":
                    return {
                        ...prev,
                        background: {
                            ...prev.background,
                            mode: "gradient-background",
                            source: undefined,
                        },
                    };

                case "live-wallpaper-background":
                    return {
                        ...prev,
                        background: {
                            ...prev.background,
                            mode: "image-background",
                            source: "live-wallpaper",
                        },
                    };

                case "custom-wallpaper-background":
                    return {
                        ...prev,
                        background: {
                            ...prev.background,
                            mode: "image-background",
                            source: "custom-wallpaper",
                        },
                    };

                default:
                    return prev;
            }
        });
    }

    return (
        <>
            <FieldGroup>
                <FieldTitle>Theme</FieldTitle>
                <Field orientation="horizontal">
                    <FieldLabel htmlFor="settings-engine">Mode</FieldLabel>
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        value={settings.mode}
                        onValueChange={setMode}
                        className="active"
                    >
                        <ToggleGroupItem value="system">
                            <Phosphor.DesktopIcon />
                            System
                        </ToggleGroupItem>
                        <ToggleGroupItem value="light">
                            <Phosphor.SunIcon />
                            Light
                        </ToggleGroupItem>
                        <ToggleGroupItem value="dark">
                            <Phosphor.MoonStarsIcon />
                            Dark
                        </ToggleGroupItem>
                    </ToggleGroup>
                </Field>

                <Field orientation="horizontal">
                    <FieldLabel htmlFor="settings-accent">
                        Accent color
                    </FieldLabel>

                    <div className="inline-flex border rounded-lg p-1 items-center group/accent-info">
                        <div
                            className="size-6 rounded-md border"
                            style={{ backgroundColor: settings.accent }}
                        />
                        <span className="text-base tabular-nums slashed-zero px-2 w-32 truncate">
                            {settings.accent}
                        </span>
                        <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => copyToClipboard(settings.accent)}
                            className="opacity-0 group-hover/accent-info:opacity-100 transition-opacity rounded-sm"
                        >
                            {isCopied ? (
                                <Phosphor.CheckIcon />
                            ) : (
                                <Phosphor.CopyIcon />
                            )}
                        </Button>
                    </div>
                    <DialogColorPicker
                        value={settings.accent}
                        onChange={(v) => {
                            saveAccent(v);
                        }}
                    >
                        <Button>Choose</Button>
                    </DialogColorPicker>
                </Field>

                <Field>
                    <FieldLabel htmlFor="settings-radius">
                        Border radius
                    </FieldLabel>

                    <ToggleGroup
                        type="single"
                        value={settings.borderRadius.mode}
                        onValueChange={(value) => setRadius(value)}
                        variant="outline"
                        spacing={2}
                        size="lg"
                    >
                        {radiusOptions.map((item) => (
                            <ToggleGroupItem
                                key={item.value}
                                value={item.value}
                                aria-label={item.label}
                                className="flex size-16 flex-col items-center justify-center rounded-lg gap-0"
                            >
                                <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded bg-muted/10">
                                    {item.icon ? (
                                        <item.icon className="size-6" />
                                    ) : (
                                        <div
                                            className={cn(
                                                "size-4 border-2 border-muted-foreground/50 border-t-foreground border-r-foreground",
                                                item.radius,
                                            )}
                                        />
                                    )}
                                </div>

                                <span className="mt-1 text-xs font-mono">
                                    {item.label}
                                </span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>

                    {settings.borderRadius.mode === "custom" && (
                        <RadiusCustom
                            borderRadius={settings.borderRadius}
                            updateCorner={updateCorner}
                        />
                    )}
                </Field>
            </FieldGroup>

            <FieldSeparator />

            <FieldGroup>
                <FieldTitle>Background</FieldTitle>

                <Field>
                    <FieldLabel htmlFor="background-type">
                        Background Mode
                    </FieldLabel>
                    <Select
                        id="background-type"
                        value={activeBackgroundMode}
                        onValueChange={(mode) => setBackgroundMode(mode)}
                    >
                        <SelectTrigger className="w-60 [&_small]:hidden">
                            <SelectValue placeholder="Select Background Mode">
                                {selectedType && (
                                    <span className="flex flex-col items-start gap-px">
                                        <span className="font-medium">
                                            {selectedType.label}
                                        </span>
                                    </span>
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectGroup>
                                {typeOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="[&_svg]:text-primary"
                                    >
                                        <span className="flex flex-col items-start gap-px">
                                            <span className="font-medium">
                                                {option.label}
                                            </span>
                                            <small className="text-muted-foreground/75 text-xs">
                                                {option.description}
                                            </small>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <BackgroundSetting
                        background={settings.background}
                        onChange={updateBackground}
                    />
                </Field>
            </FieldGroup>
        </>
    );
}
