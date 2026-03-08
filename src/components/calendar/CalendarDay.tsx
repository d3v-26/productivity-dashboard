import type { CalendarDay as CalendarDayType } from '../../hooks/useCalendar'

interface CalendarDayProps {
  day: CalendarDayType
  isSelected: boolean
  onClick: () => void
}

export function CalendarDay({ day, isSelected, onClick }: CalendarDayProps) {
  const { date, isToday, isCurrentMonth, events } = day

  const visibleEvents = events.slice(0, 3)
  const overflow = events.length - visibleEvents.length

  return (
    <div
      onClick={onClick}
      className={[
        'aspect-square flex flex-col items-center justify-start pt-1.5',
        'rounded-xl cursor-pointer transition-all duration-150',
        !isCurrentMonth ? 'opacity-30' : '',
        isSelected ? 'bg-[#7C5CFC]/10' : 'hover:bg-white/5',
      ].join(' ')}
    >
      {/* Date number */}
      {isToday ? (
        <span className="w-5 h-5 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center text-xs font-medium">
          {date.getDate()}
        </span>
      ) : (
        <span className="text-xs text-muted">{date.getDate()}</span>
      )}

      {/* Event dots */}
      <div className="flex items-center gap-0.5 mt-0.5 flex-wrap justify-center">
        {visibleEvents.map(event => (
          <span
            key={event.id}
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: event.color }}
          />
        ))}
        {overflow > 0 && (
          <span className="text-[10px] text-muted leading-none">+{overflow}</span>
        )}
      </div>
    </div>
  )
}
