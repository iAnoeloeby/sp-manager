import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export default function BottomDock({ children, className = "" }) {
    return (
        <section className="fixed inset-x-0 bottom-0 z-30 mx-auto">
            <Card className={cn("w-full rounded-none p-2", className)}>
                {children}
            </Card>
        </section>
    );
}
