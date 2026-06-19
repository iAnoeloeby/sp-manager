import React from "react";

import { cn } from "@/lib/utils";
import {
    FieldDescription,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";

/**
 * @param {{
 *   title: string,
 *   description?: string,
 *   children: React.ReactNode,
 *   className?: string,
 * }} props
 */
export default function SettingsSection({
    title,
    description,
    children,
    className,
}) {
    return (
        <FieldSet className={cn("gap-0", className)}>
            <FieldTitle className="text-lg font-medium">{title}</FieldTitle>
            <FieldDescription className="mb-8">{description}</FieldDescription>

            <FieldGroup>
                <FieldSeparator />

                {children}
            </FieldGroup>
        </FieldSet>
    );
}
