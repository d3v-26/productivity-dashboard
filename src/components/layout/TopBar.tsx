import { Settings } from 'lucide-react'
import { format } from 'date-fns'

interface TopBarProps {
  completedHabits: number
  totalHabits: number
  activeTasks: number
  totalTasks: number
  onSettingsClick: () => void
}

export default function TopBar({ completedHabits, totalHabits, activeTasks, totalTasks, onSettingsClick }: TopBarProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const completedTasks = totalTasks - activeTasks
  const habitPct = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0
  const taskPct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.05] bg-surface/60 backdrop-blur-sm shrink-0">
      <div>
        <p className="text-text font-medium">{greeting}</p>
        <p className="text-muted text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
      </div>
      <div className="flex items-center gap-6">
        {/* Habits progress */}
        <div className="flex items-center gap-2">
          <span className="text-muted text-xs">Habits</span>
          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#7C5CFC] rounded-full transition-all" style={{ width: `${habitPct}%` }} />
          </div>
          <span className="text-[#7C5CFC] text-xs font-medium">{completedHabits}/{totalHabits}</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        {/* Tasks remaining */}
        <div className="flex items-center gap-2">
          <span className="text-muted text-xs">Tasks left</span>
          <span className="text-text text-xs font-medium">{activeTasks}</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        {/* Completed ratio */}
        <div className="flex items-center gap-2">
          <span className="text-muted text-xs">Done</span>
          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#A78BFA] rounded-full transition-all" style={{ width: `${taskPct}%` }} />
          </div>
          <span className="text-[#A78BFA] text-xs font-medium">{completedTasks}/{totalTasks}</span>
        </div>
        {/* Settings */}
        <button
          onClick={onSettingsClick}
          aria-label="Open settings"
          className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-all"
        >
          <Settings size={15} />
        </button>
      </div>
    </div>
  )
}
