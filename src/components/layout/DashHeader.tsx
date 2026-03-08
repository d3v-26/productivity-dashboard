import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { Button } from '../ui'

interface DashHeaderProps {
  completedCount: number
  total: number
  onAddHabit: () => void
}

export function DashHeader({ completedCount, total, onAddHabit }: DashHeaderProps) {
  const progressPct = total === 0 ? 0 : Math.round((completedCount / total) * 100)

  return (
    <nav className="glass sticky top-0 z-30 flex items-center gap-4 px-6 py-3 border-b border-white/5">
      {/* Brand + date */}
      <div className="flex items-center gap-3 mr-auto">
        <span className="font-mono text-sm font-medium text-[#7C5CFC] tracking-widest">pl</span>
        <span className="text-xs text-muted font-light hidden sm:block">
          {format(new Date(), 'EEEE, MMM d')}
        </span>
      </div>

      {/* Anchor nav */}
      <div className="hidden md:flex items-center gap-1">
        {(['habits', 'todos', 'calendar'] as const).map(id => (
          <a
            key={id}
            href={`#${id}`}
            className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-widest uppercase text-muted hover:text-text hover:bg-white/5 transition-all duration-200"
          >
            {id}
          </a>
        ))}
      </div>

      {/* Progress chip + add */}
      <div className="flex items-center gap-3 ml-auto">
        {total > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7C5CFC] rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="font-mono text-xs text-[#7C5CFC] tabular-nums">
              {completedCount}<span className="text-muted">/{total}</span>
            </span>
          </div>
        )}
        <Button variant="secondary" size="sm" onClick={onAddHabit}>
          <Plus size={13} />
          New
        </Button>
      </div>
    </nav>
  )
}
