import { useState } from 'react'
import { format, addDays, endOfWeek, parseISO, isAfter, isBefore, startOfDay } from 'date-fns'
import { LayoutGrid, CalendarDays, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { clearAllData } from '../../lib/storage'
import type { CalendarEvent } from '../../types'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  events: CalendarEvent[]
}

export default function Sidebar({ collapsed, onToggle, events }: SidebarProps) {
  const [confirmReset, setConfirmReset] = useState(false)

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todayEvents = events
    .filter(e => e.date === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 4)

  // Upcoming: tomorrow through end of this week (Saturday)
  const tomorrow = startOfDay(addDays(new Date(), 1))
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 })
  const upcomingEvents = events
    .filter(e => {
      const d = parseISO(e.date)
      return !isBefore(d, tomorrow) && !isAfter(d, weekEnd)
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 5)

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 3000)
    } else {
      clearAllData()
      window.location.reload()
    }
  }

  return (
    <aside
      className={[
        'fixed left-0 top-0 h-full flex flex-col border-r border-white/[0.05] z-40',
        'transition-[width] duration-200 ease-in-out overflow-hidden',
        collapsed ? 'w-[60px]' : 'w-[220px]',
      ].join(' ')}
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Logo row */}
      <div className="flex items-center gap-2.5 px-3 py-5 border-b border-white/[0.05] justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#7C5CFC] flex items-center justify-center flex-shrink-0">
            <LayoutGrid size={14} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm text-text tracking-wide whitespace-nowrap">pl</span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="text-muted hover:text-text transition-colors p-1 rounded-lg hover:bg-white/5 flex-shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Events */}
      <div className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">

        {/* Today */}
        <div>
          <div className={['px-3 mb-2', collapsed ? 'flex justify-center' : ''].join(' ')}>
            {collapsed ? (
              <CalendarDays size={15} className="text-muted" />
            ) : (
              <span className="text-xs font-medium text-muted uppercase tracking-wider">Today</span>
            )}
          </div>
          {todayEvents.length === 0 ? (
            !collapsed && <p className="px-3 text-xs text-muted">No events</p>
          ) : (
            <div className="space-y-0.5">
              {todayEvents.map(event => (
                <div
                  key={event.id}
                  className={['flex items-center gap-2 px-3 py-1.5 rounded-lg', collapsed ? 'justify-center' : ''].join(' ')}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: event.color }} />
                  {!collapsed && (
                    <div className="min-w-0">
                      <p className="text-xs text-text truncate">{event.title}</p>
                      <p className="text-xs text-muted">{event.startTime}–{event.endTime}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming this week */}
        {!collapsed && (
          <div>
            <div className="px-3 mb-2">
              <span className="text-xs font-medium text-muted uppercase tracking-wider">This week</span>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="px-3 text-xs text-muted">Nothing coming up</p>
            ) : (
              <div className="space-y-0.5">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: event.color }} />
                    <div className="min-w-0">
                      <p className="text-xs text-text truncate">{event.title}</p>
                      <p className="text-xs text-muted">{format(parseISO(event.date), 'EEE')} · {event.startTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-white/[0.05] pt-3 space-y-0.5">
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="font-mono text-xs text-muted">
              {format(new Date(), 'EEE, MMM d')}
            </p>
          </div>
        )}
        <button
          onClick={handleReset}
          title={collapsed ? (confirmReset ? 'Are you sure?' : 'Reset all data') : undefined}
          className={[
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
            collapsed ? 'justify-center' : '',
            confirmReset
              ? 'text-rose-400 bg-rose-400/10'
              : 'text-muted hover:text-rose-400 hover:bg-rose-400/5',
          ].join(' ')}
        >
          <Trash2 size={15} className="shrink-0" />
          {!collapsed && (confirmReset ? 'Are you sure?' : 'Reset all data')}
        </button>
      </div>
    </aside>
  )
}
