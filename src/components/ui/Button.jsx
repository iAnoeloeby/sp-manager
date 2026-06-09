import React from 'react'
import { cn } from '../../utils/cn'

export default function Button({ children, className = '', type = 'button', ...props }) {
    return (
        <button
            type={type}
            className={cn(
                'inline-flex min-h-11 items-center justify-center gap-2 rounded-theme border border-transparent bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-md transition-all duration-200 hover:-translate-y-px hover:opacity-95 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    )
}
