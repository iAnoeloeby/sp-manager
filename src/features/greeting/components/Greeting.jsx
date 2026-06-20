import React from "react";

import { getGreeting } from "@/features/greeting/utils/greetingUtils";

export default function Greeting({ displayName = "" }) {
    return (
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            {getGreeting(new Date(), displayName)}
        </p>
    );
}
