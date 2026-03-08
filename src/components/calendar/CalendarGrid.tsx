import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalendarDay as CalendarDayType } from '../../hooks/useCalendar'
import { CalendarDay } from './CalendarDay'
import { EventList } from './EventList'
import { EventForm } from './EventForm'
import { Button } from '../ui'
import type { CalendarEvent } from '../../types'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

interface CalendarGridProps {
  currentMonth: Date
  selectedDate: string | null
  calendarDays: CalendarDayType[]
  selectedDateEvents: CalendarEvent[]
  prevMonth: () => void
  nextMonth: () => void
  goToToday: () => void
  selectDate: (key: string) => void
  addEvent: (data: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: string, data: Omit<CalendarEvent, 'id'>) => void
  deleteEvent: (id: string) => void
}

export function CalendarGrid({
  currentMonth,
  selectedDate,
  calendarDays,
  selectedDateEvents,
  prevMonth,
  nextMonth,
  goToToday,
  selectDate,
  addEvent,
  updateEvent,
  deleteEvent,
}: CalendarGridProps) {

  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  function handleAdd() {
    setEditingEvent(null)
    setShowForm(true)
  }

  function handleEdit(event: CalendarEvent) {
    setEditingEvent(event)
    setShowForm(true)
  }

  function handleFormSubmit(data: Omit<CalendarEvent, 'id'>) {
    if (editingEvent) {
      updateEvent(editingEvent.id, data)
    } else {
      addEvent(data)
    }
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingEvent(null)
  }

  function handleDelete() {
    if (editingEvent) {
      deleteEvent(editingEvent.id)
    }
  }

  const defaultDate = selectedDate ?? format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-3">
      {/* Month header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="sm" onClick={goToToday} className="px-2 py-1 text-[11px]">
            Today
          </Button>
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-[10px] text-muted text-center py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map(day => (
          <CalendarDay
            key={day.dateKey}
            day={day}
            isSelected={selectedDate === day.dateKey}
            onClick={() => selectDate(day.dateKey)}
          />
        ))}
      </div>

      {/* Event list panel */}
      <EventList
        date={selectedDate}
        events={selectedDateEvents}
        onAdd={handleAdd}
        onEdit={handleEdit}
      />

      {/* Event form modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          defaultDate={defaultDate}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
          onDelete={editingEvent ? handleDelete : undefined}
        />
      )}
    </div>
  )
}
