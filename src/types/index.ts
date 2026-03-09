// ─── Habits ───────────────────────────────────────────────────────────────────

export interface Habit {
  id: string
  title: string
  icon: string
  category: string
  createdAt: string
}

export interface HabitStore {
  habits: Habit[]
  version: 1
}

export interface HabitCompletion {
  habitId: string
  completedDate: string // "YYYY-MM-DD"
}

export interface CompletionStore {
  completions: HabitCompletion[]
  version: 1
}

// ─── Todos ────────────────────────────────────────────────────────────────────

export interface Todo {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  category: 'Personal' | 'Work' | 'Health' | 'Learning' | 'Other'
  dueDate: string | null
  completed: boolean
  completedAt: string | null
  createdAt: string
}

export interface TodoStore {
  todos: Todo[]
  version: 1
}

// ─── Calendar Events ──────────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string
  title: string
  date: string        // "YYYY-MM-DD"
  startTime: string   // "HH:MM"
  endTime: string     // "HH:MM"
  color: string       // hex
  description: string
  source?: 'local' | 'imported'
  externalId?: string  // UID from ICS (for dedup)
  isReadOnly?: boolean // true for imported events
}

export interface EventStore {
  events: CalendarEvent[]
  version: 1
}

export interface ImportedEventStore {
  events: CalendarEvent[]
  importedAt: string | null
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface Settings {
  theme: 'light' | 'dark'
  habitResetTime: '00:00'
  defaultView: 'habits' | 'todos' | 'calendar'
  version: 1
}
