import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Modal, Input, Button } from '../ui'
import type { CalendarEvent } from '../../types'

const EVENT_COLORS = [
  '#7C5CFC',
  '#A78BFA',
  '#F59E0B',
  '#34D399',
  '#F87171',
  '#60A5FA',
]

const GLASS_INPUT_CLASS = [
  'w-full glass rounded-xl px-3.5 py-2.5 text-sm text-text outline-none',
  'transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(124,92,252,0.08)]',
  'placeholder:text-muted',
].join(' ')

const FIELD_LABEL_CLASS = 'text-xs text-muted uppercase tracking-widest mb-1.5 block'

interface EventFormProps {
  event: CalendarEvent | null
  defaultDate: string
  onSubmit: (data: Omit<CalendarEvent, 'id'>) => void
  onClose: () => void
  onDelete?: () => void
}

export function EventForm({ event, defaultDate, onSubmit, onClose, onDelete }: EventFormProps) {
  const [title, setTitle] = useState(event?.title ?? '')
  const [date, setDate] = useState(event?.date ?? defaultDate)
  const [startTime, setStartTime] = useState(event?.startTime ?? '')
  const [endTime, setEndTime] = useState(event?.endTime ?? '')
  const [color, setColor] = useState(event?.color ?? EVENT_COLORS[0])
  const [description, setDescription] = useState(event?.description ?? '')

  const isEditing = event !== null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), date, startTime, endTime, color, description })
    onClose()
  }

  return (
    <Modal isOpen title={isEditing ? 'Edit event' : 'New event'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <Input
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="Event title"
          required
        />

        {/* Date */}
        <div>
          <label className={FIELD_LABEL_CLASS}>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{ colorScheme: 'dark' }}
            className={GLASS_INPUT_CLASS}
          />
        </div>

        {/* Start / End time */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={FIELD_LABEL_CLASS}>From</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className={GLASS_INPUT_CLASS}
            />
          </div>
          <div className="flex-1">
            <label className={FIELD_LABEL_CLASS}>To</label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className={GLASS_INPUT_CLASS}
            />
          </div>
        </div>

        {/* Color swatches */}
        <div>
          <label className={FIELD_LABEL_CLASS}>Color</label>
          <div className="flex gap-2 flex-wrap">
            {EVENT_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={[
                  'w-6 h-6 rounded-full transition-all',
                  color === c ? 'ring-2 ring-offset-1 ring-offset-[#12121F] ring-current' : 'opacity-70 hover:opacity-100',
                ].join(' ')}
                style={{ background: c, color: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={FIELD_LABEL_CLASS}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            placeholder="Optional notes…"
            style={{ colorScheme: 'dark' }}
            className={[GLASS_INPUT_CLASS, 'resize-none'].join(' ')}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={() => { onDelete(); onClose() }}
              className="p-2 rounded-xl text-muted hover:text-[#F87171] hover:bg-[#F87171]/10 transition-colors"
              aria-label="Delete event"
            >
              <Trash2 size={15} />
            </button>
          )}
          <div className="flex gap-2 flex-1 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {isEditing ? 'Save' : 'Add event'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
