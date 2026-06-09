import React from 'react'
import { cn } from '../../utils/cn'

export default function IconButton({ children, onClick, label, className = '', ...props }) {
    return (
        <button
            aria-label={label}
            onClick={onClick}
            className={cn(
                'inline-flex h-11 w-11 shrink-0 aspect-square items-center justify-center rounded-theme border border-border/70 bg-surface/90 p-0 text-lg leading-none text-foreground shadow-[0_14px_28px_-22px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-px hover:bg-background focus:outline-none focus:ring-4 focus:ring-accent/20',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    )
}
