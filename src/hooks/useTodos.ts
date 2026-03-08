import { useState, useEffect, useMemo } from 'react'
import { nanoid } from 'nanoid'
import { getStore, setStore } from '../lib/storage'
import type { Todo, TodoStore } from '../types'

export type FilterStatus   = 'all' | 'active' | 'completed'
export type FilterPriority = 'all' | 'low' | 'medium' | 'high'
export type SortBy         = 'created' | 'dueDate' | 'priority'

export interface FilterState {
  status:   FilterStatus
  priority: FilterPriority
  category: string // 'all' | 'Personal' | 'Work' | …
}

const PRIORITY_ORDER: Record<Todo['priority'], number> = { high: 0, medium: 1, low: 2 }

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() =>
    getStore<TodoStore>('pl_todos').todos
  )

  const [filterState, setFilterState] = useState<FilterState>({
    status:   'all',
    priority: 'all',
    category: 'all',
  })

  const [sortBy, setSortBy] = useState<SortBy>('created')

  useEffect(() => {
    setStore<TodoStore>('pl_todos', { todos, version: 1 })
  }, [todos])

  const filteredTodos = useMemo(() => {
    let result = [...todos]

    if (filterState.status === 'active')    result = result.filter(t => !t.completed)
    if (filterState.status === 'completed') result = result.filter(t =>  t.completed)
    if (filterState.priority !== 'all')     result = result.filter(t => t.priority === filterState.priority)
    if (filterState.category !== 'all')     result = result.filter(t => t.category === filterState.category)

    result.sort((a, b) => {
      if (sortBy === 'priority') {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      // 'created' — newest first
      return b.createdAt.localeCompare(a.createdAt)
    })

    return result
  }, [todos, filterState, sortBy])

  function addTodo(data: Omit<Todo, 'id' | 'createdAt' | 'completed' | 'completedAt'>) {
    const todo: Todo = {
      ...data,
      id:          nanoid(),
      completed:   false,
      completedAt: null,
      createdAt:   new Date().toISOString(),
    }
    setTodos(prev => [todo, ...prev])
  }

  function updateTodo(id: string, data: Partial<Todo>) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)))
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function toggleTodo(id: string) {
    setTodos(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const completed = !t.completed
        return { ...t, completed, completedAt: completed ? new Date().toISOString() : null }
      })
    )
  }

  return {
    todos,
    filteredTodos,
    filterState,
    setFilterState,
    sortBy,
    setSortBy,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  }
}
