import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Checkbox } from '../ui'
import type { Habit } from '../../types'

interface HabitItemProps {
  habit: Habit
  isCompleted: boolean
  streak: number
  onToggle: () => void
  onDelete: () => void
  index: number
  onSelect?: () => void
  isSelected?: boolean
}

export function HabitItem({ habit, isCompleted, streak, onToggle, onDelete, index, onSelect, isSelected }: HabitItemProps) {
  const [streakAnimating, setStreakAnimating] = useState(false)

  return (
    <div
      className={[
        'group glass glass-hover rounded-2xl px-4 py-3 flex items-center gap-3 animate-habit-enter cursor-pointer',
        isCompleted ? 'glass-lit opacity-60' : '',
        isSelected ? 'ring-1 ring-[#7C5CFC]/40' : '',
      ].join(' ')}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onSelect?.()}
    >
      {/* Checkbox */}
      <div className="shrink-0" onClick={e => { e.stopPropagation(); if (!isCompleted) { setStreakAnimating(true); setTimeout(() => setStreakAnimating(false), 400) } onToggle() }}>
        <Checkbox checked={isCompleted} onChange={() => {}} />
      </div>

      {/* Emoji */}
      <span
        className={[
          'text-base leading-none select-none transition-all duration-300 shrink-0',
          isCompleted ? 'grayscale opacity-30' : '',
        ].join(' ')}
      >
        {habit.icon}
      </span>

      {/* Title + category */}
      <div className="flex-1 min-w-0">
        <p
          className={[
            'text-sm font-medium tracking-wide transition-all duration-300',
            isCompleted ? 'line-through text-muted' : 'text-text',
          ].join(' ')}
        >
          {habit.title}
        </p>
        <p className="text-xs text-muted mt-0.5 uppercase tracking-widest font-light">
          {habit.category}
        </p>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <span
          className={[
            'font-mono text-xs font-medium text-[#F59E0B] flex items-center gap-1 shrink-0',
            streakAnimating ? 'animate-streak-pop' : '',
          ].join(' ')}
        >
          🔥 <span className="tabular-nums">{streak}</span>
        </span>
      )}

      {/* Delete — hover-reveal */}
      <button
        onClick={e => { e.stopPropagation(); onDelete() }}
        aria-label={`Delete ${habit.title}`}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted hover:text-[#F87171] hover:bg-[#F87171]/10 transition-all duration-150 shrink-0"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
