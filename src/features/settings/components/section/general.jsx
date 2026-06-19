import React from "react";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldTitle,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { searchEngines } from "@/constants/searchEngines";

/**
 * @param {{
 *   settings: any,
 *   onChange: (patch: Record<string, any>) => void,
 * }} props
 */
export default function General({ settings, onChange }) {
    const setSeconds = (checked) => onChange({ showSeconds: checked });

    return (
        <>
            <FieldGroup>
                <FieldTitle className="font-medium">Search Bar</FieldTitle>
                <Field>
                    <FieldLabel htmlFor="settings-engine">
                        Search Engine
                    </FieldLabel>
                    <FieldDescription>
                        Set default search engine did you want to use
                    </FieldDescription>
                    <Select defaultValue={settings.searchEngine}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position={"item-aligned"}>
                            <SelectGroup>
                                {searchEngines.map((engine) => (
                                    <SelectItem
                                        key={engine.id}
                                        value={engine.id}
                                    >
                                        {engine.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </FieldGroup>

            <FieldSeparator />

            <FieldGroup>
                <FieldTitle>Search Engine</FieldTitle>
                <Field>
                    <FieldLabel htmlFor="settings-clock-format">
                        Clock format
                    </FieldLabel>
                    <Select defaultValue={settings.clockFormat}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position={"item-aligned"}>
                            <SelectGroup>
                                <SelectItem key="24h" value="24h">
                                    24-hour
                                </SelectItem>
                                <SelectItem key="12h" value="12h">
                                    12-hour
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>

                <Field orientation="horizontal">
                    <FieldLabel htmlFor="settings-show-seconds">
                        Show seconds
                    </FieldLabel>
                    <Switch
                        id="settings-show-seconds"
                        checked={settings.showSeconds}
                        onCheckedChange={setSeconds}
                    />
                </Field>
            </FieldGroup>
        </>
    );
}
