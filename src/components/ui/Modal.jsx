import React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'

export default function Modal({ open, title, children, footer, onClose, className = '' }) {
    if (!open) return null

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-md sm:items-center">
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={cn(
                    'w-full max-w-2xl overflow-hidden rounded-3xl border border-border/70 bg-surface/95 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.65)]',
                    className,
                )}
            >
                <div className="flex items-center justify-between border-b border-border/70 bg-background/30 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <p className="mt-1 text-sm text-muted">Make quick changes without leaving the page.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-theme px-3 py-1 text-sm text-muted transition-colors hover:bg-background/60 hover:text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20"
                    >
                        Close
                    </button>
                </div>
                <div className="max-h-[80vh] overflow-auto px-5 py-5">{children}</div>
                {footer ? <div className="border-t border-border/70 bg-background/30 px-5 py-4">{footer}</div> : null}
            </div>
        </div>,
        document.body,
    )
}
