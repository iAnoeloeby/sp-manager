import React from 'react'
import { cn } from '../../utils/cn'

export default function Card({ children, className = '', ...props }) {
    return (
        <div
            className={cn(
                'rounded-3xl border border-border/70 bg-surface/90 p-5 text-foreground shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-shadow duration-200',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}
