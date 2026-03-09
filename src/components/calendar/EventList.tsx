import { format, parseISO } from 'date-fns'
import { Plus, Lock } from 'lucide-react'
import { Button } from '../ui'
import type { CalendarEvent } from '../../types'

interface EventListProps {
  date: string | null
  events: CalendarEvent[]
  onAdd: () => void
  onEdit: (event: CalendarEvent) => void
}

export function EventList({ date, events, onAdd, onEdit }: EventListProps) {
  if (!date) {
    return (
      <div className="pt-3 border-t border-white/5">
        <p className="text-xs text-muted">Select a day to see events</p>
      </div>
    )
  }

  const formattedDate = format(parseISO(date), 'EEE, MMM d')

  return (
    <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text">{formattedDate}</span>
        <Button variant="primary" size="sm" onClick={onAdd} className="gap-1">
          <Plus size={12} />
          Add event
        </Button>
      </div>

      {/* Events */}
      {events.length === 0 ? (
        <p className="text-xs text-muted">No events</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {events.map(event => (
            <div
              key={event.id}
              onClick={() => !event.isReadOnly && onEdit(event)}
              className={[
                'flex flex-col pl-3 py-1.5 rounded-lg transition-colors border-l-2',
                event.isReadOnly
                  ? 'cursor-default opacity-80'
                  : 'hover:bg-white/5 cursor-pointer',
              ].join(' ')}
              style={{ borderColor: event.color }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-text leading-snug">{event.title}</span>
                {event.isReadOnly && (
                  <Lock size={10} className="text-muted shrink-0" />
                )}
              </div>
              {(event.startTime || event.endTime) && (
                <span className="text-xs text-muted">
                  {event.startTime}
                  {event.endTime ? ` – ${event.endTime}` : ''}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
