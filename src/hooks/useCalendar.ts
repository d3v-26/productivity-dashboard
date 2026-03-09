import { useState, useCallback } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns'
import { nanoid } from 'nanoid'
import { getStore, setStore } from '../lib/storage'
import type { CalendarEvent, EventStore, ImportedEventStore } from '../types'

export interface CalendarDay {
  date: Date
  dateKey: string
  isToday: boolean
  isCurrentMonth: boolean
  events: CalendarEvent[]
}

function loadEvents(): CalendarEvent[] {
  return getStore<EventStore>('pl_events').events
}

function loadImportedEvents(): CalendarEvent[] {
  return getStore<ImportedEventStore>('pl_imported_events').events
}

function persist(events: CalendarEvent[]): void {
  setStore<EventStore>('pl_events', { events, version: 1 })
}

function persistImported(events: CalendarEvent[]): void {
  setStore<ImportedEventStore>('pl_imported_events', {
    events,
    importedAt: events.length > 0 ? new Date().toISOString() : null,
  })
}

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents)
  const [importedEvents, setImportedEvents] = useState<CalendarEvent[]>(loadImportedEvents)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const allEvents = [...events, ...importedEvents]

  // Derived: 42-cell calendar grid (Sunday–Saturday, 6 weeks)
  const calendarDays: CalendarDay[] = (() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

    // Pad to exactly 42 cells if needed
    while (days.length < 42) {
      const last = days[days.length - 1]
      const next = new Date(last)
      next.setDate(last.getDate() + 1)
      days.push(next)
    }

    return days.slice(0, 42).map(date => {
      const dateKey = format(date, 'yyyy-MM-dd')
      return {
        date,
        dateKey,
        isToday: isToday(date),
        isCurrentMonth: isSameMonth(date, currentMonth),
        events: allEvents.filter(e => e.date === dateKey),
      }
    })
  })()

  // Derived: events for selected date, sorted by startTime
  const selectedDateEvents: CalendarEvent[] = selectedDate
    ? allEvents
        .filter(e => e.date === selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    : []

  const prevMonth = useCallback(() => {
    setCurrentMonth(m => subMonths(m, 1))
  }, [])

  const nextMonth = useCallback(() => {
    setCurrentMonth(m => addMonths(m, 1))
  }, [])

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date())
  }, [])

  const selectDate = useCallback((key: string) => {
    setSelectedDate(prev => (prev === key ? null : key))
  }, [])

  const addEvent = useCallback((data: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...data, id: nanoid() }
    setEvents(prev => {
      const updated = [...prev, newEvent]
      persist(updated)
      return updated
    })
  }, [])

  const updateEvent = useCallback((id: string, data: Omit<CalendarEvent, 'id'>) => {
    setEvents(prev => {
      const updated = prev.map(e => (e.id === id ? { ...data, id } : e))
      persist(updated)
      return updated
    })
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => {
      const updated = prev.filter(e => e.id !== id)
      persist(updated)
      return updated
    })
  }, [])

  const importEvents = useCallback((incoming: CalendarEvent[]) => {
    setImportedEvents(prev => {
      const existingIds = new Set(prev.map(e => e.externalId).filter(Boolean))
      const newEvents = incoming.filter(e => !e.externalId || !existingIds.has(e.externalId))
      const updated = [...prev, ...newEvents]
      persistImported(updated)
      return updated
    })
  }, [])

  const clearImportedEvents = useCallback(() => {
    setImportedEvents([])
    persistImported([])
  }, [])

  return {
    events,
    importedEvents,
    allEvents,
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
    importEvents,
    clearImportedEvents,
  }
}
