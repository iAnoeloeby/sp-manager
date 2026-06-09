import React, { useEffect, useState } from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { normalizeUrl } from '../../../utils/urlUtils'

const emptyForm = {
    id: '',
    title: '',
    url: '',
}

export default function ShortcutForm({ open, shortcut, onSave, onClose }) {
    const [form, setForm] = useState(emptyForm)

    useEffect(() => {
        if (shortcut) {
            setForm({
                id: shortcut.id || '',
                title: shortcut.title || '',
                url: shortcut.url || '',
            })
            return
        }

        setForm(emptyForm)
    }, [shortcut, open])

    function handleSubmit(event) {
        event.preventDefault()

        onSave({
            id: form.id,
            title: form.title.trim(),
            url: normalizeUrl(form.url),
        })
    }

    return (
        <Modal
            open={open}
            title={shortcut ? 'Edit shortcut' : 'Add shortcut'}
            onClose={onClose}
            footer={
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose} className="border border-border bg-background text-foreground hover:bg-background/80">
                        Cancel
                    </Button>
                    <Button type="submit" form="shortcut-form">
                        Save shortcut
                    </Button>
                </div>
            }
        >
            <form id="shortcut-form" className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="shortcut-title">
                        Title
                    </label>
                    <input
                        id="shortcut-title"
                        type="text"
                        required
                        value={form.title}
                        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                        className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                        placeholder="GitHub"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium" htmlFor="shortcut-url">
                        URL
                    </label>
                    <input
                        id="shortcut-url"
                        type="url"
                        required
                        value={form.url}
                        onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                        className="w-full rounded-theme border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:ring-4 focus:ring-accent/20"
                        placeholder="github.com"
                    />
                </div>
            </form>
        </Modal>
    )
}
