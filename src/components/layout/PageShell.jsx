import React from 'react'
import { cn } from '../../utils/cn'

export default function PageShell({ children, className = '' }) {
    return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}
