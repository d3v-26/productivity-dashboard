import { Plus } from 'lucide-react'
import type { Habit } from '../../types'
import { HabitItem } from './HabitItem'
import { HabitForm } from './HabitForm'
import { Button } from '../ui'

interface HabitListProps {
  habits: Habit[]
  todayCompletions: Set<string>
  streaks: Record<string, number>
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  showForm: boolean
  onShowForm: () => void
  onCloseForm: () => void
  onAdd: (title: string, icon: string, category: string) => void
  onSelectHabit?: (habit: Habit) => void
  selectedHabitId?: string | null
}

export function HabitList({
  habits,
  todayCompletions,
  streaks,
  onToggle,
  onDelete,
  showForm,
  onShowForm,
  onCloseForm,
  onAdd,
  onSelectHabit,
  selectedHabitId,
}: HabitListProps) {
  const completed  = habits.filter(h =>  todayCompletions.has(h.id))
  const incomplete = habits.filter(h => !todayCompletions.has(h.id))
  const sorted     = [...incomplete, ...completed]

  const completedCount = completed.length
  const total          = habits.length

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted tabular-nums">
          {completedCount}/{total} done
        </span>
        <Button variant="primary" size="sm" onClick={onShowForm}>
          <Plus size={13} />
          Add habit
        </Button>
      </div>

      {/* List */}
      {habits.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <p className="text-3xl opacity-20">◎</p>
          <p className="text-xs text-muted uppercase tracking-widest">No habits yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((habit, i) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              isCompleted={todayCompletions.has(habit.id)}
              streak={streaks[habit.id] ?? 0}
              onToggle={() => onToggle(habit.id)}
              onDelete={() => onDelete(habit.id)}
              index={i}
              onSelect={() => onSelectHabit?.(habit)}
              isSelected={selectedHabitId === habit.id}
            />
          ))}
        </div>
      )}

      {showForm && (
        <HabitForm
          onSubmit={onAdd}
          onClose={onCloseForm}
        />
      )}
    </div>
  )
}
