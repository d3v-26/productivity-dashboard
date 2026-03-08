import { Plus } from 'lucide-react'
import type { Todo } from '../../types'
import type { FilterState, SortBy } from '../../hooks/useTodos'
import { TodoItem } from './TodoItem'
import { TodoForm } from './TodoForm'
import { TodoFilters } from './TodoFilters'
import { Button } from '../ui'

type TodoData = Omit<Todo, 'id' | 'createdAt' | 'completed' | 'completedAt'>

interface TodoListProps {
  filteredTodos: Todo[]
  filterState: FilterState
  sortBy: SortBy
  onFilterChange: (patch: Partial<FilterState>) => void
  onSortChange: (sort: SortBy) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAdd: (data: TodoData) => void
  onUpdate: (id: string, data: Partial<Todo>) => void
  onSelect: (todo: Todo) => void
  selectedId: string | null
  showForm: boolean
  editingTodo: Todo | null
  onShowForm: (todo?: Todo | null) => void
  onCloseForm: () => void
}

export function TodoList({
  filteredTodos,
  filterState,
  sortBy,
  onFilterChange,
  onSortChange,
  onToggle,
  onDelete,
  onAdd,
  onUpdate,
  onSelect,
  selectedId,
  showForm,
  editingTodo,
  onShowForm,
  onCloseForm,
}: TodoListProps) {
  function handleSubmit(data: TodoData) {
    if (editingTodo) {
      onUpdate(editingTodo.id, data)
    } else {
      onAdd(data)
    }
  }

  const activeCount = filteredTodos.filter(t => !t.completed).length

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted tabular-nums">
          {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
        </span>
        <Button variant="primary" size="sm" onClick={() => onShowForm(null)}>
          <Plus size={13} />
          Add task
        </Button>
      </div>

      {/* Filters */}
      <TodoFilters
        filterState={filterState}
        sortBy={sortBy}
        onChange={onFilterChange}
        onSortChange={onSortChange}
      />

      {/* List */}
      {filteredTodos.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <p className="text-3xl opacity-20">◎</p>
          <p className="text-xs text-muted uppercase tracking-widest">No tasks</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTodos.map((todo, i) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={i}
              onToggle={() => onToggle(todo.id)}
              onEdit={() => onShowForm(todo)}
              onDelete={() => onDelete(todo.id)}
              onSelect={() => onSelect(todo)}
              isSelected={selectedId === todo.id}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <TodoForm
          todo={editingTodo}
          onSubmit={handleSubmit}
          onClose={onCloseForm}
          onDelete={editingTodo ? () => onDelete(editingTodo.id) : undefined}
        />
      )}
    </div>
  )
}
