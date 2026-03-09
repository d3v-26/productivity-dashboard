import type {
  HabitStore,
  CompletionStore,
  TodoStore,
  EventStore,
  ImportedEventStore,
  Settings,
} from '../types'

const DEFAULTS = {
  pl_habits: { habits: [], version: 1 } as HabitStore,
  pl_habit_completions: { completions: [], version: 1 } as CompletionStore,
  pl_todos: { todos: [], version: 1 } as TodoStore,
  pl_events: { events: [], version: 1 } as EventStore,
  pl_imported_events: { events: [], importedAt: null } as ImportedEventStore,
  pl_settings: {
    theme: 'light',
    habitResetTime: '00:00',
    defaultView: 'habits',
    version: 1,
  } as Settings,
}

type StoreKey = keyof typeof DEFAULTS

export function getStore<T>(key: StoreKey): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return DEFAULTS[key] as T
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return DEFAULTS[key] as T
    return parsed as T
  } catch {
    return DEFAULTS[key] as T
  }
}

export function setStore<T>(key: StoreKey, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function exportAllData(): string {
  const allData: Record<string, unknown> = {}
  for (const key of Object.keys(DEFAULTS) as StoreKey[]) {
    allData[key] = getStore(key)
  }
  return JSON.stringify(allData, null, 2)
}

export function clearAllData(): void {
  for (const key of Object.keys(DEFAULTS) as StoreKey[]) {
    localStorage.removeItem(key)
  }
}
