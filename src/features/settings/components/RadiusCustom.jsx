import React from "react";

import { cn } from "@/lib/utils";

import { Field, FieldTitle } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupText,
} from "@/components/ui/input-group";

const corners = [
    {
        key: "topLeft",
        id: "top-left-radius",
        rounded: "rounded-tl-md",
        border: "border-t-foreground border-l-foreground",
    },
    {
        key: "topRight",
        id: "top-right-radius",
        rounded: "rounded-tr-md",
        border: "border-t-foreground border-r-foreground",
    },
    {
        key: "bottomLeft",
        id: "bottom-left-radius",
        rounded: "rounded-bl-md",
        border: "border-b-foreground border-l-foreground",
    },
    {
        key: "bottomRight",
        id: "bottom-right-radius",
        rounded: "rounded-br-md",
        border: "border-b-foreground border-r-foreground",
    },
];

export default function RadiusCustom({ borderRadius, updateCorner }) {
    const handleChange = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        updateCorner(value);
    };

    return (
        <div className="grid grid-cols-2 gap-4 px-10">
            {corners.map((corner) => (
                <>
                    <Field orientation="horizontal">
                        <FieldTitle>
                            <div className="size-8.5 shrink-0 rounded-md bg-muted/10 border flex items-center justify-center">
                                <div
                                    className={cn(
                                        "size-4 border-2 border-muted-foreground/50",
                                        corner.rounded,
                                        corner.border,
                                    )}
                                />
                            </div>
                        </FieldTitle>

                        <InputGroup>
                            <InputGroupInput
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={borderRadius[corner.key] ?? ""}
                                onChange={handleChange}
                            />
                            <InputGroupAddon align="inline-end">
                                <InputGroupText>px</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                </>
            ))}
        </div>
    );
}
