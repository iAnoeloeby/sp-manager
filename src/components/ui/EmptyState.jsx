import React from 'react'

export default function EmptyState({ title, description, action }) {
    return (
        <div className="rounded-3xl border border-dashed border-border/70 bg-background/30 p-6 text-center backdrop-blur-sm">
            <div className="text-base font-semibold text-foreground">{title}</div>
            <div className="mt-2 text-sm leading-6 text-muted">{description}</div>
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    )
}
