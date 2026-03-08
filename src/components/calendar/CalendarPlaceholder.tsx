import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function CalendarPlaceholder() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()

  const monthName = now.toLocaleString('default', { month: 'long' })
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-4">
      {/* Month header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text">
          {monthName} {year}
        </span>
        <div className="flex gap-0.5">
          <button
            disabled
            className="p-1.5 rounded-lg text-muted opacity-30 cursor-not-allowed"
            aria-label="Previous month"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            disabled
            className="p-1.5 rounded-lg text-muted opacity-30 cursor-not-allowed"
            aria-label="Next month"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {/* Day-of-week headers */}
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-xs text-muted font-light py-1.5">
            {d}
          </div>
        ))}

        {/* Date cells */}
        {cells.map((day, i) => (
          <div
            key={i}
            className={[
              'aspect-square flex items-center justify-center rounded-lg text-xs',
              day === null
                ? ''
                : day === today
                  ? 'bg-[#7C5CFC]/20 ring-1 ring-[#7C5CFC]/40 text-[#7C5CFC] font-medium'
                  : 'text-muted',
            ].join(' ')}
          >
            {day ?? ''}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 pt-3 flex items-center gap-2 text-xs text-muted">
        <Clock size={12} className="shrink-0" />
        <span>No events scheduled</span>
      </div>
    </div>
  )
}
