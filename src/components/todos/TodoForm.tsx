import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { Todo } from '../../types'
import { Modal, Input, Button } from '../ui'

const PRIORITIES = ['low', 'medium', 'high'] as const
const CATEGORIES = ['Personal', 'Work', 'Health', 'Learning', 'Other'] as const

type TodoData = Omit<Todo, 'id' | 'createdAt' | 'completed' | 'completedAt'>

interface TodoFormProps {
  todo?:     Todo | null
  onSubmit:  (data: TodoData) => void
  onClose:   () => void
  onDelete?: () => void
}

export function TodoForm({ todo, onSubmit, onClose, onDelete }: TodoFormProps) {
  const [title,       setTitle]       = useState(todo?.title       ?? '')
  const [description, setDescription] = useState(todo?.description ?? '')
  const [priority,    setPriority]    = useState<Todo['priority']>(todo?.priority ?? 'medium')
  const [category,    setCategory]    = useState<Todo['category']>(todo?.category ?? 'Personal')
  const [dueDate,     setDueDate]     = useState(todo?.dueDate     ?? '')
  const [error,       setError]       = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title required'); return }
    onSubmit({ title: title.trim(), description: description.trim(), priority, category, dueDate: dueDate || null })
    onClose()
  }

  const priorityActiveClass: Record<Todo['priority'], string> = {
    high:   'border border-[#A78BFA]/40 bg-[#A78BFA]/20 text-[#A78BFA]',
    medium: 'border border-[#F59E0B]/40 bg-[#F59E0B]/20 text-[#F59E0B]',
    low:    'border border-[#7C5CFC]/40 bg-[#7C5CFC]/20 text-[#7C5CFC]',
  }

  return (
    <Modal isOpen onClose={onClose} title={todo ? 'Edit task' : 'New task'}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <Input
            label="Task"
            value={title}
            onChange={v => { setTitle(v); setError('') }}
            placeholder="What needs to be done?"
            required
          />
          {error && <p className="text-xs text-[#F87171] mt-1.5">{error}</p>}
        </div>

        {/* Notes */}
        <div>
          <p className="text-xs text-muted uppercase tracking-widest mb-1.5">Notes</p>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional details…"
            rows={2}
            className="w-full glass rounded-xl px-3.5 py-2.5 text-sm text-text placeholder:text-muted resize-none outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(124,92,252,0.08)]"
          />
        </div>

        {/* Priority */}
        <div>
          <p className="text-xs text-muted uppercase tracking-widest mb-2">Priority</p>
          <div className="flex gap-2">
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={[
                  'flex-1 py-1.5 rounded-xl text-xs font-medium capitalize transition-all duration-150',
                  priority === p
                    ? priorityActiveClass[p]
                    : 'glass text-muted hover:text-text',
                ].join(' ')}
              >
                {p}
              </button>
            ))}
          </div>
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
                    : 'glass text-muted hover:text-text',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Due date */}
        <div>
          <p className="text-xs text-muted uppercase tracking-widest mb-1.5">Due date</p>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className="w-full glass rounded-xl px-3.5 py-2.5 text-sm text-text outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(124,92,252,0.08)]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button type="submit" variant="primary" className="flex-1">
            {todo ? 'Save changes' : 'Add task'}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          {todo && onDelete && (
            <button
              type="button"
              onClick={() => { onDelete(); onClose() }}
              className="p-2 rounded-xl text-muted hover:text-[#F87171] hover:bg-[#F87171]/10 transition-all duration-150"
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

      </form>
    </Modal>
  )
}
