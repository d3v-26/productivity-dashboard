import { X, Trash2, Edit2, CheckCircle2, Circle, Calendar, Tag, Flame, Check } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import type { Todo, Habit } from '../../types'
import { Button } from '../ui'

export type SelectedItem =
  | { type: 'todo'; item: Todo }
  | { type: 'habit'; habit: Habit; streak: number; isCompleted: boolean }

interface DetailPanelProps {
  selected: SelectedItem
  onClose: () => void
  onEditTodo?: (todo: Todo) => void
  onDeleteTodo?: (id: string) => void
  onToggleTodo?: (id: string) => void
  onToggleHabit?: (id: string) => void
  onDeleteHabit?: (id: string) => void
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-[#7C5CFC] bg-[#7C5CFC]/10',
  medium: 'text-[#F59E0B] bg-[#F59E0B]/10',
  high: 'text-rose-400 bg-rose-400/10',
}

export default function DetailPanel({
  selected,
  onClose,
  onEditTodo,
  onDeleteTodo,
  onToggleTodo,
  onToggleHabit,
  onDeleteHabit,
}: DetailPanelProps) {
  return (
    <div className="animate-fade-in bg-surface border border-border rounded-2xl p-4 mb-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted uppercase tracking-wider font-medium">
          {selected.type === 'todo' ? 'Task detail' : 'Habit detail'}
        </span>
        <button onClick={onClose} className="text-muted hover:text-text transition-colors p-0.5 rounded-lg hover:bg-white/5">
          <X size={15} />
        </button>
      </div>

      {selected.type === 'todo' && (
        <TodoDetail
          todo={selected.item}
          onEdit={() => onEditTodo?.(selected.item)}
          onDelete={() => onDeleteTodo?.(selected.item.id)}
          onToggle={() => onToggleTodo?.(selected.item.id)}
        />
      )}

      {selected.type === 'habit' && (
        <HabitDetail
          habit={selected.habit}
          streak={selected.streak}
          isCompleted={selected.isCompleted}
          onToggle={() => onToggleHabit?.(selected.habit.id)}
          onDelete={() => onDeleteHabit?.(selected.habit.id)}
        />
      )}
    </div>
  )
}

function TodoDetail({
  todo,
  onEdit,
  onDelete,
  onToggle,
}: {
  todo: Todo
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const isOverdue = todo.dueDate && !todo.completed && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate))

  return (
    <div className="space-y-3">
      {/* Title + checkbox */}
      <div className="flex items-start gap-2">
        <button onClick={onToggle} className="mt-0.5 text-muted hover:text-[#7C5CFC] transition-colors shrink-0">
          {todo.completed ? <CheckCircle2 size={17} className="text-[#7C5CFC]" /> : <Circle size={17} />}
        </button>
        <h3 className={`text-text font-medium text-sm leading-snug ${todo.completed ? 'line-through text-muted' : ''}`}>
          {todo.title}
        </h3>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {todo.priority && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[todo.priority] ?? ''}`}>
            {todo.priority}
          </span>
        )}
        {todo.category && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-muted flex items-center gap-1">
            <Tag size={10} /> {todo.category}
          </span>
        )}
      </div>

      {/* Due date */}
      {todo.dueDate && (
        <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-rose-400' : 'text-muted'}`}>
          <Calendar size={12} />
          <span>{isOverdue ? 'Overdue · ' : ''}{format(new Date(todo.dueDate), 'MMM d, yyyy')}</span>
        </div>
      )}

      {/* Description */}
      {todo.description && (
        <p className="text-muted text-xs leading-relaxed border-t border-white/[0.05] pt-3">{todo.description}</p>
      )}

      {/* Created */}
      <p className="text-white/20 text-xs">Created {format(new Date(todo.createdAt), 'MMM d')}</p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant="secondary" size="sm" onClick={onEdit} className="flex items-center gap-1.5 flex-1">
          <Edit2 size={12} /> Edit
        </Button>
        <button onClick={onDelete} className="text-muted hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-400/10">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

function HabitDetail({
  habit,
  streak,
  isCompleted,
  onToggle,
  onDelete,
}: {
  habit: Habit
  streak: number
  isCompleted: boolean
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{habit.icon}</span>
        <div>
          <h3 className="text-text font-medium text-sm">{habit.title}</h3>
          {habit.category && <p className="text-muted text-xs">{habit.category}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/[0.04] rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Flame size={13} className="text-[#F59E0B]" />
            <span className="text-text font-semibold text-lg">{streak}</span>
          </div>
          <p className="text-muted text-xs">day streak</p>
        </div>
        <div className={`rounded-xl p-3 text-center ${isCompleted ? 'bg-[#7C5CFC]/10' : 'bg-white/[0.04]'}`}>
          <div className="flex items-center justify-center mb-0.5">
            {isCompleted
              ? <Check size={18} className="text-[#7C5CFC]" />
              : <Circle size={18} className="text-muted" />}
          </div>
          <p className="text-muted text-xs">{isCompleted ? 'Done today' : 'Not done'}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant={isCompleted ? 'secondary' : 'primary'} size="sm" onClick={onToggle} className="flex-1">
          {isCompleted ? 'Mark undone' : 'Mark done'}
        </Button>
        <button onClick={onDelete} className="text-muted hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-400/10">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
