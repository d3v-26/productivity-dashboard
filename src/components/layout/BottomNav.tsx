import { Flame, CheckSquare, CalendarDays } from 'lucide-react'

export default function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-white/[0.05] pb-[env(safe-area-inset-bottom,0px)]"
      style={{ background: 'var(--color-bg)' }}
    >
      <a
        href="#habits"
        className="flex flex-col items-center gap-1 py-3 flex-1 text-[10px] uppercase tracking-widest font-medium text-muted hover:text-text transition-colors"
      >
        <Flame size={18} />
        Habits
      </a>
      <a
        href="#todos"
        className="flex flex-col items-center gap-1 py-3 flex-1 text-[10px] uppercase tracking-widest font-medium text-muted hover:text-text transition-colors"
      >
        <CheckSquare size={18} />
        Tasks
      </a>
      <a
        href="#calendar"
        className="flex flex-col items-center gap-1 py-3 flex-1 text-[10px] uppercase tracking-widest font-medium text-muted hover:text-text transition-colors"
      >
        <CalendarDays size={18} />
        Calendar
      </a>
    </nav>
  )
}
