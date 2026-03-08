import { Trash2 } from 'lucide-react'
import { format, isPast, isToday, parseISO } from 'date-fns'
import type { Todo } from '../../types'
import { Checkbox, Badge } from '../ui'

interface TodoItemProps {
  todo:       Todo
  index:      number
  onToggle:   () => void
  onEdit:     () => void
  onDelete:   () => void
  onSelect?:  () => void
  isSelected?: boolean
}

export function TodoItem({ todo, index, onToggle, onDelete, onSelect, isSelected }: TodoItemProps) {
  const parsedDue   = todo.dueDate ? parseISO(todo.dueDate) : null
  const isOverdue   = parsedDue && !todo.completed && isPast(parsedDue) && !isToday(parsedDue)
  const formattedDue = parsedDue
    ? isToday(parsedDue)
      ? 'Today'
      : format(parsedDue, 'MMM d')
    : null

  return (
    <div
      className={[
        'group glass glass-hover rounded-2xl px-4 py-3 flex items-center gap-3 animate-habit-enter',
        isSelected ? 'ring-1 ring-[#7C5CFC]/40' : '',
      ].join(' ')}
      style={{ animationDelay: `${index * 35}ms` }}
    >
      <div onClick={e => e.stopPropagation()}>
        <Checkbox checked={todo.completed} onChange={onToggle} />
      </div>

      {/* Text — clickable area opens detail */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelect?.()}>
        <p className={[
          'text-sm font-medium truncate transition-all duration-200',
          todo.completed ? 'line-through text-muted' : 'text-text',
        ].join(' ')}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-xs text-muted truncate mt-0.5">{todo.description}</p>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 shrink-0">
        {formattedDue && (
          <span className={[
            'font-mono text-xs tabular-nums',
            isOverdue ? 'text-[#F87171]' : 'text-muted',
          ].join(' ')}>
            {formattedDue}
          </span>
        )}
        <Badge variant={todo.priority}>{todo.priority}</Badge>
      </div>

      {/* Delete — hover-reveal */}
      <button
        onClick={e => { e.stopPropagation(); onDelete() }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted hover:text-[#F87171] hover:bg-[#F87171]/10 transition-all duration-150"
        aria-label="Delete task"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
