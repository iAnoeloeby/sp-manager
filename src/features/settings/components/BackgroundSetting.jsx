import React from "react";

import * as Phosphor from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/Card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggleGroup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldLegend,
    FieldTitle,
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { openLink } from "@/hooks/useOpenLink";

import DialogColorPicker from "@/features/settings/components/DialogColorPicker";
import {
    getBackgroundMode,
    buildBackgroundImage,
} from "@/features/settings/utils/backgroundUtils";

import { refreshDailyWallpaper } from "@/services/wallpaperService";

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

export default function BackgroundSetting({
    background,
    theme = "light",
    onChange,
}) {
    const activeMode = getBackgroundMode(background);

    function toSlider(value) {
        return Math.round((value ?? 0) * 100);
    }

    function fromSlider(value) {
        return value / 100;
    }

    const overlayStrength = React.useMemo(
        () => Math.round((background.overlay ?? 0.45) * 100),
        [background.overlay],
    );

    function setOverlayStrength(value) {
        onChange({
            ...background,
            overlay: fromSlider(value),
        });
    }

    const Preview = () => {
        return (
            <Card
                card-spacing={2}
                className="rounded-xl [--card-spacing:--spacing(4)] bg-muted/10"
            >
                <CardContent className="">
                    <div
                        className="h-60 rounded-lg border border-border/70 bg-surface/80 shadow-sm"
                        style={{
                            backgroundImage: buildBackgroundImage(background),
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                </CardContent>
            </Card>
        );
    };

    const OverlayStrengthComponent = () => {
        return (
            <Field>
                <FieldTitle className="flex items-end justify-between">
                    Overlay strength
                    <FieldLabel className="font-mono text-xs">
                        {overlayStrength}%
                    </FieldLabel>
                </FieldTitle>
                <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[toSlider(background.overlay)]}
                    onValueChange={([value]) => setOverlayStrength(value)}
                />
                <FieldLegend />
            </Field>
        );
    };

    function renderDefault() {
        return (
            <>
                <Field>
                    <FieldDescription>
                        Applies the default neutral background color.
                    </FieldDescription>
                    <FieldDescription>
                        Used:{" "}
                        <code className="relative rounded bg-muted/10 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            color-neutral-200
                        </code>
                    </FieldDescription>
                    <Field className="flex flex-row gap-4">
                        <div className="space-y-2 flex flex-col">
                            <h2 className="font-medium">Light Mode</h2>
                            <div className="h-[4rem] rounded-lg border-2 flex items-center justify-center bg-background dark:bg-foreground">
                                <span className="w-full text-center px-[0.7rem] py-[0.2rem] font-mono text-foreground dark:text-background">
                                    #ffffff
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <h2 className="font-medium">Dark Mode</h2>
                            <div className="h-[4rem] rounded-lg border-2 flex items-center justify-center bg-foreground dark:bg-background">
                                <span className="w-full text-center px-[0.7rem] py-[0.2rem] font-mono text-background dark:text-foreground">
                                    #111827
                                </span>
                            </div>
                        </div>
                    </Field>
                </Field>
            </>
        );
    }

    function renderSolid() {
        function setSolidBackground(value) {
            onChange({
                ...background,
                value: value,
            });
        }

        return (
            <>
                <Field>
                    <FieldContent className="grid grid-cols-2 gap-4">
                        <Field
                            className="w-full"
                            // className="flex items-center justify-between"
                        >
                            <FieldLabel>Colors</FieldLabel>
                            <div
                                className="h-[4rem] rounded-lg border-2"
                                style={{
                                    background: background.value,
                                }}
                            />

                            <DialogColorPicker
                                value={background.value}
                                onChange={(value) => setSolidBackground(value)}
                            >
                                <Button variant="outline" size="sm">
                                    Choose
                                </Button>
                            </DialogColorPicker>
                        </Field>

                        <Field
                            className="w-full"
                            // className="flex items-center justify-between"
                        >
                            <FieldLabel>Template Colors</FieldLabel>

                            <ToggleGroup
                                type="single"
                                value={2}
                                // value={settings.borderRadius.mode}
                                // onValueChange={(value) => setRadius(value)}
                                variant="ghost"
                                spacing={1}
                                size="lg"
                                className="w-full"
                            >
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <ToggleGroupItem
                                        key={i}
                                        value={i}
                                        // key={item.value}
                                        // value={item.value}
                                        // aria-label={item.label}
                                        className="flex-col h-fit border-none rounded-lg gap-0 aspect-square flex items-center justify-center border border-muted-foreground/50 size-15"
                                    >
                                        <div
                                            className="size-8 mt-1 shrink-0 rounded-md"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg,#3b82f6,#0f172a)",
                                            }}
                                        />

                                        <span className="mt-0.5 text-xs font-mono">
                                            {/* {item.label} */}
                                            {i + 1}
                                        </span>
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </Field>
                    </FieldContent>
                </Field>
            </>
        );
    }

    function renderGradient() {
        function setGradientBackground(value, value2) {
            onChange({
                ...background,
                value: value,
                value2: value2,
            });
        }

        return (
            <>
                <Tabs defaultValue="preset" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="preset">Default Preset</TabsTrigger>
                        <TabsTrigger value="custom">Custom</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preset">
                        <Field>
                            <FieldLabel>Gradient Presets</FieldLabel>
                            <ToggleGroup
                                type="single"
                                value={2}
                                // value={settings.borderRadius.mode}
                                // onValueChange={(value) => setRadius(value)}
                                variant="ghost"
                                spacing={1}
                                size="lg"
                            >
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <ToggleGroupItem
                                        key={i}
                                        value={i}
                                        // key={item.value}
                                        // value={item.value}
                                        // aria-label={item.label}
                                        className="flex-col h-fit border-none rounded-lg gap-0 aspect-square flex items-center justify-center border border-muted-foreground/50 size-15"
                                    >
                                        <div
                                            className="size-8 mt-1 shrink-0 rounded-md"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg,#3b82f6,#0f172a)",
                                            }}
                                        />

                                        <span className="mt-0.5 text-xs font-mono">
                                            {/* {item.label} */}
                                            {i + 1}
                                        </span>
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </Field>
                    </TabsContent>
                    <TabsContent value="custom">
                        {/* Colors */}
                        <Field>
                            <FieldLabel>Colors</FieldLabel>
                            <FieldContent className="flex flex-row gap-4">
                                <Field
                                    className="w-full"
                                    // className="flex items-center justify-between"
                                >
                                    <FieldLabel>Primary</FieldLabel>

                                    <div className="space-y-2 flex flex-col">
                                        <div
                                            className="h-[4rem] rounded-lg border-2"
                                            style={{
                                                background: background.value,
                                            }}
                                        />

                                        <DialogColorPicker
                                            value={background.value}
                                            onChange={(value) =>
                                                setGradientBackground(
                                                    value,
                                                    background.value2,
                                                )
                                            }
                                        >
                                            <Button variant="outline" size="sm">
                                                Choose
                                            </Button>
                                        </DialogColorPicker>
                                    </div>
                                </Field>
                                <Field
                                    className="w-full"
                                    // className="flex items-center justify-between"
                                >
                                    <FieldLabel>Secondary</FieldLabel>

                                    <div className="space-y-2 flex flex-col">
                                        <div
                                            className="h-[4rem] rounded-lg border-2"
                                            style={{
                                                background: background.value2,
                                            }}
                                        />

                                        <DialogColorPicker
                                            value={background.value2}
                                            onChange={(value) =>
                                                setGradientBackground(
                                                    background.value,
                                                    value,
                                                )
                                            }
                                        >
                                            <Button variant="outline" size="sm">
                                                Choose
                                            </Button>
                                        </DialogColorPicker>
                                    </div>
                                </Field>
                            </FieldContent>

                            <div className="flex items-center gap-3">
                                <Checkbox />
                                <Label>Use accent color</Label>
                            </div>
                        </Field>
                    </TabsContent>
                </Tabs>

                <Field className="w-full">
                    <FieldContent className="flex-row gap-4">
                        {/* Direction */}
                        <div className="w-full space-y-2">
                            <Label>Direction</Label>

                            <ToggleGroup
                                type="single"
                                variant="outline"
                                size="icon"
                                className="grid grid-cols-3 w-fit"
                            >
                                <ToggleGroupItem value="135">
                                    <Phosphor.ArrowUpLeftIcon />
                                </ToggleGroupItem>

                                <ToggleGroupItem value="180">
                                    <Phosphor.ArrowUpIcon />
                                </ToggleGroupItem>

                                <ToggleGroupItem value="225">
                                    <Phosphor.ArrowUpRightIcon />
                                </ToggleGroupItem>

                                <ToggleGroupItem value="90">
                                    <Phosphor.ArrowLeftIcon />
                                </ToggleGroupItem>

                                <ToggleGroupItem
                                    disabled
                                    className="invisible"
                                />

                                <ToggleGroupItem value="270">
                                    <Phosphor.ArrowRightIcon />
                                </ToggleGroupItem>

                                <ToggleGroupItem value="45">
                                    <Phosphor.ArrowDownLeftIcon />
                                </ToggleGroupItem>

                                <ToggleGroupItem value="0">
                                    <Phosphor.ArrowDownIcon />
                                </ToggleGroupItem>

                                <ToggleGroupItem value="315">
                                    <Phosphor.ArrowDownRightIcon />
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* <Separator orientation="vertical" /> */}
                        <div className="w-full flex flex-col justify-between">
                            <div className="space-y-2">
                                <Label>Style</Label>
                                <ToggleGroup
                                    type="single"
                                    value="linear"
                                    variant="outline"
                                >
                                    <ToggleGroupItem value="linear">
                                        Linear
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="radial">
                                        Radial
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div className="flex gap-2">
                                <Button>
                                    <Phosphor.SparkleIcon />
                                    Generate
                                </Button>
                                <Button variant="outline">Reset</Button>
                            </div>
                        </div>
                    </FieldContent>
                </Field>
            </>
        );
    }

    function renderLiveWallpaper() {
        async function setLiveWallpaper({ forceNewSeed = false } = {}) {
            const wallpaper = await refreshDailyWallpaper(true, {
                forceNewSeed,
            });

            if (wallpaper?.url) {
                onChange({
                    ...background,
                    imageUrl: wallpaper.url,
                });
            }
        }

        return (
            <>
                <Field>
                    <FieldDescription>
                        Daily wallpaper is sourced from a remote image URL and
                        refreshed automatically.
                    </FieldDescription>

                    {/* Background Mode Preview */}
                    <Preview />

                    <Field className="mt-4">
                        <FieldLabel htmlFor="background-image-url">
                            Image URL
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="background-image-url"
                                value={background.imageUrl || ""}
                                placeholder="https://example.com/background.jpg"
                                readOnly
                            />
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                    aria-label="Link"
                                    title="Link to image"
                                    size="icon-xs"
                                    onClick={() => {
                                        openLink(background.imageUrl);
                                    }}
                                >
                                    <Phosphor.ArrowUpRightIcon />
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                </Field>

                <OverlayStrengthComponent />

                <div className="flex flex-wrap justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setLiveWallpaper()}
                    >
                        <Phosphor.ArrowCounterClockwiseIcon />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setLiveWallpaper({ forceNewSeed: true })}
                    >
                        <Phosphor.SparkleIcon />
                        Generate new wallpaper
                    </Button>
                </div>
            </>
        );
    }

    function renderCustomWallpaper() {
        async function setCustomWallpaperFromDevices(event) {
            const file = event.target.files?.[0];
            if (!file) return;

            try {
                const dataUrl = await readFileAsDataUrl(file);
                onChange({
                    ...background,
                    imageUrl: dataUrl,
                });
            } catch (err) {
                console.error("Failed to read wallpaper file", err);
            }
        }

        return (
            <>
                <Field>
                    <FieldDescription>
                        Upload an image from your device or paste an image URL.
                    </FieldDescription>

                    {/* Background Mode Preview */}
                    <Preview />
                </Field>

                <Field orientation="horizontal">
                    <FieldLabel
                        htmlFor="background-image-file"
                        className="shrink-0 whitespace-nowrap"
                    >
                        Select File
                    </FieldLabel>
                    <Input
                        id="background-image-file"
                        type="file"
                        accept="image/*"
                        onChange={setCustomWallpaperFromDevices}
                        className="text-muted-foreground file:border-input file:text-foreground p-0 pr-3 italic file:mr-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="background-image-url">
                        Image URL
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            id="background-image-url"
                            value={background.imageUrl || ""}
                            placeholder="https://example.com/background.jpg"
                        />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                aria-label="Link"
                                title="Link to image"
                                size="icon-xs"
                                onClick={() => {
                                    openLink(background.imageUrl);
                                }}
                            >
                                <Phosphor.ArrowUpRightIcon />
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </Field>

                <OverlayStrengthComponent />
            </>
        );
    }

    switch (activeMode) {
        case "solid-background":
            return renderSolid();

        case "gradient-background":
            return renderGradient();

        case "live-wallpaper-background":
            return renderLiveWallpaper();

        case "custom-wallpaper-background":
            return renderCustomWallpaper();

        case "default":
        default:
            return renderDefault();
    }
}
