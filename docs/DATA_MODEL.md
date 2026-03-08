# Data Model

All data stored in `localStorage` under `pl_` prefixed keys. All access goes through `src/lib/storage.ts`.

## Storage Keys

| Key | Contents |
|-----|----------|
| `pl_habits` | Habit definitions |
| `pl_habit_completions` | Daily completion records |
| `pl_todos` | Todo items |
| `pl_events` | Calendar events |
| `pl_settings` | App settings |

## TypeScript Interfaces

```typescript
interface HabitStore { habits: Habit[]; version: 1 }
interface Habit { id: string; title: string; icon: string; category: string; createdAt: string }

interface CompletionStore { completions: HabitCompletion[]; version: 1 }
interface HabitCompletion { habitId: string; completedDate: string } // "YYYY-MM-DD"

interface TodoStore { todos: Todo[]; version: 1 }
interface Todo {
  id: string; title: string; description: string
  priority: "low" | "medium" | "high"
  category: "Personal" | "Work" | "Health" | "Learning" | "Other"
  dueDate: string | null; completed: boolean
  completedAt: string | null; createdAt: string
}

interface EventStore { events: CalendarEvent[]; version: 1 }
interface CalendarEvent {
  id: string; title: string; date: string
  startTime: string; endTime: string; color: string; description: string
}

interface Settings {
  theme: "light" | "dark"; habitResetTime: "00:00"
  defaultView: "habits" | "todos" | "calendar"; version: 1
}
```

## storage.ts API

```typescript
export function getStore<T>(key: StoreKey): T
export function setStore<T>(key: StoreKey, data: T): void
export function exportAllData(): string
export function clearAllData(): void
```

- All reads wrapped in try/catch — corrupt JSON returns default
- Completions pruned to last 90 days on every write
- `version: 1` on every store enables future migrations
