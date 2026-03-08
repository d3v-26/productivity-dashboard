import { useState } from 'react'
import { Modal, Input, Button } from '../ui'

const CATEGORIES = ['Health', 'Work', 'Learning', 'Personal', 'Other']

const SUGGESTED_ICONS = ['✦', '◎', '⬡', '△', '💧', '🏃', '📖', '💊', '🧘', '🎯', '🌿', '💪']

interface HabitFormProps {
  onSubmit: (title: string, icon: string, category: string) => void
  onClose: () => void
}

export function HabitForm({ onSubmit, onClose }: HabitFormProps) {
  const [title,    setTitle]    = useState('')
  const [icon,     setIcon]     = useState('✦')
  const [category, setCategory] = useState('Health')
  const [error,    setError]    = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Name required'); return }
    onSubmit(title.trim(), icon, category)
    onClose()
  }

  return (
    <Modal isOpen onClose={onClose} title="New habit">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Icon grid */}
        <div>
          <p className="text-xs text-muted uppercase tracking-widest mb-2">Icon</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {SUGGESTED_ICONS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={[
                  'w-9 h-9 rounded-xl text-base transition-all duration-150',
                  icon === emoji
                    ? 'glass-lit bg-[#7C5CFC]/10 text-[#7C5CFC] scale-105 shadow-[0_0_12px_rgba(124,92,252,0.2)]'
                    : 'glass text-text hover:bg-white/5',
                ].join(' ')}
              >
                {emoji}
              </button>
            ))}
          </div>
          <Input
            value={icon}
            onChange={setIcon}
            placeholder="Or paste any emoji…"
          />
        </div>

        {/* Name */}
        <div>
          <Input
            label="Habit name"
            value={title}
            onChange={v => { setTitle(v); setError('') }}
            placeholder="e.g. Read for 20 minutes"
            required
          />
          {error && <p className="text-xs text-[#F87171] mt-1.5">{error}</p>}
        </div>

        {/* Category */}
        <div>
          <p className="text-xs text-muted uppercase tracking-widest mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={[
                  'px-3 py-1.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-150',
                  category === cat
                    ? 'bg-[#7C5CFC] text-white shadow-[0_0_12px_rgba(124,92,252,0.25)]'
                    : 'glass text-muted hover:text-text hover:border-white/15',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="submit" variant="primary" className="flex-1">Add habit</Button>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  )
}
