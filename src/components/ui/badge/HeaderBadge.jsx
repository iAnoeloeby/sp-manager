import React from 'react'

function HeaderBadge(children) {
    return <div className="inline-flex rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-muted">
        {children}
    </div>
}

export default HeaderBadge
