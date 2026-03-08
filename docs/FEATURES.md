# Features

## Daily Habits

### Data Shapes

```typescript
interface Habit {
  id: string
  title: string
  icon: string        // emoji
  category: string
  createdAt: string   // ISO string
}

interface HabitCompletion {
  habitId: string
  completedDate: string // "YYYY-MM-DD"
}
```

### Reset Logic
On app load, check if `completedDate === todayKey()`. Older entries = incomplete for today.

### Streak Calculation
Consecutive days ending today (or yesterday) with a completion entry. Completions older than 90 days are pruned on write.

### Default Habits (Seeded on First Load)

| Icon | Title | Category |
|------|-------|----------|
| 💼 | Apply to LinkedIn | Work |
| 💊 | Take multivitamin | Health |
| 💧 | Drink 8 glasses of water | Health |
| 🏃 | 30 min exercise | Health |
| 📖 | Read for 20 min | Learning |

### User Actions
- Toggle complete, Add habit, Delete habit, (Reorder — phase 2)

---

## To-Do List

### Data Shape

```typescript
interface Todo {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  category: "Personal" | "Work" | "Health" | "Learning" | "Other"
  dueDate: string | null
  completed: boolean
  completedAt: string | null
  createdAt: string
}
```

### Priority Colors
- low → Sage (`--color-sage`)
- medium → Amber (`--color-amber`)
- high → Lavender (`--color-lavender`)

### Filters & Sorting
Filter by: priority, category, status (all/active/completed)
Sort by: due date, priority, created (default)

---

## Calendar

### Data Shape

```typescript
interface CalendarEvent {
  id: string
  title: string
  date: string        // "YYYY-MM-DD"
  startTime: string   // "HH:MM"
  endTime: string     // "HH:MM"
  color: string       // hex
  description: string
}
```

### Features
- Monthly grid, prev/next navigation, Today button
- Today highlighted with sage ring
- Colored dot indicators (up to 3, then "+N")
- Click day → event list panel → click "+" → EventForm modal

### Event Colors
Sage `#7A9E7E`, Lavender `#9B8EC4`, Amber `#D4904A`, Rose `#C4635A`, Sky `#6BA3BE`, Warm gray `#8B7D74`
