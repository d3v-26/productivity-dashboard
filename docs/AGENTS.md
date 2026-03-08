# Build Agents

Complete sub-agent prompts for building `pl` in 7 sequential phases.

---

## Phase 1 — Project Scaffold

**Creates:** `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `src/index.css`, `src/App.tsx`, `src/main.tsx`, `index.html`, `.github/workflows/deploy.yml`

**Prompt:**

```
You are building a static productivity app called "pl". Set up the complete project scaffold.

Read docs/ARCHITECTURE.md and docs/DESIGN.md before starting.

Tasks:
1. Initialize a Vite + React + TypeScript project in the current directory (not a subdirectory).
   Run: npm create vite@latest . -- --template react-ts --overwrite

2. Install dependencies:
   - npm install
   - npm install date-fns nanoid lucide-react
   - npm install -D tailwindcss @tailwindcss/vite

3. Configure tailwind.config.ts with the full color token mapping from docs/DESIGN.md. Set darkMode: 'class'.

4. Create src/index.css with @tailwind directives, all CSS custom properties from docs/DESIGN.md, and keyframe animations (check, slide-up, fade-in).

5. Update vite.config.ts: base '/pl/', add tailwindcss() plugin.

6. Update index.html: title "pl", add Inter Google Fonts link (400/500/600).

7. Create src/App.tsx: shell with activeView state, placeholder divs per view, bg-bg min-h-screen text-text.

8. Create src/types/index.ts: all interfaces from docs/DATA_MODEL.md.

9. Create .github/workflows/deploy.yml from docs/ARCHITECTURE.md.

10. Create src/lib/storage.ts: getStore<T>, setStore<T>, exportAllData, clearAllData.

11. Create src/lib/dates.ts: todayKey(), calculateStreak(), pruneCompletions().

12. Create src/lib/defaults.ts: DEFAULT_HABITS array with 5 seed habits from docs/FEATURES.md.

Verify npm run dev starts without errors.
```

---

## Phase 2 — Design System

**Creates:** `src/components/ui/Button.tsx`, `Modal.tsx`, `Input.tsx`, `Badge.tsx`, `Checkbox.tsx`, `index.ts`

**Prompt:**

```
You are implementing the UI component library for "pl". Read docs/DESIGN.md fully before writing any code.

Create the following in src/components/ui/:

1. Button.tsx
   Props: variant ('primary' | 'secondary' | 'ghost'), size ('sm' | 'md'), onClick, children, disabled, type
   - primary: bg-sage text-white hover:opacity-90 transition-colors rounded-xl font-medium
   - secondary: bg-lavender/10 text-lavender border border-lavender/20 hover:bg-lavender/20 transition-colors rounded-xl font-medium
   - ghost: text-muted hover:text-text hover:bg-border/30 transition-colors rounded-xl
   - sm: px-3 py-1.5 text-sm | md: px-4 py-2 text-sm

2. Checkbox.tsx
   Props: checked, onChange, label (optional)
   - Div-based (not native input): w-5 h-5 rounded-md border-2 border-border cursor-pointer transition-all
   - checked: bg-sage border-sage, shows white SVG checkmark with checkbox-check animation class
   - Flex row with optional label text-sm text-text

3. Input.tsx
   Props: label, value, onChange, placeholder, type, required, className
   - Label: block text-sm font-medium text-text mb-1
   - Input: w-full bg-surface border border-border rounded-xl px-3 py-2 text-base
   - Focus: outline-none ring-2 ring-sage/30 border-sage (use onFocus/onBlur state)

4. Badge.tsx
   Props: variant ('low' | 'medium' | 'high' | 'category'), children
   - low: bg-sage/10 text-sage | medium: bg-amber/10 text-amber | high: bg-lavender/10 text-lavender | category: bg-border/50 text-muted
   - All: text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center

5. Modal.tsx
   Props: isOpen, onClose, title, children
   - Use ReactDOM.createPortal into document.body
   - When open: backdrop (fixed inset-0 bg-text/20 backdrop-blur-sm z-40, click to close)
   - Card: fixed bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center z-50
   - Inner card: w-full md:max-w-md bg-surface rounded-t-3xl md:rounded-2xl p-6 animate-slide-up
   - Header: flex justify-between items-center mb-4 — title text-lg font-semibold + X button (ghost)

6. src/components/ui/index.ts — re-export all five components.

All components: only Tailwind classes, no inline styles, no hardcoded colors.
```

---

## Phase 3 — Daily Habits

**Creates:** `src/hooks/useHabits.ts`, `src/components/habits/HabitList.tsx`, `HabitItem.tsx`, `HabitForm.tsx`

**Prompt:**

```
You are building the Daily Habits feature for "pl". Read docs/FEATURES.md (Habits section) and docs/DATA_MODEL.md fully before writing code.

1. src/hooks/useHabits.ts
   - Init from getStore('pl_habits') and getStore('pl_habit_completions')
   - Seed DEFAULT_HABITS if pl_habits is empty on first load
   - Persist habits and completions on change (prune completions >90 days before writing)
   - todayCompletions: Set<string> of habitIds completed today
   - streaks: Record<string, number> map of habitId → streak
   - Actions: addHabit(title, icon, category), deleteHabit(id), toggleHabit(id)
   - Return: { habits, todayCompletions, streaks, addHabit, deleteHabit, toggleHabit }

2. src/components/habits/HabitItem.tsx
   - Props: habit, isCompleted, streak, onToggle, onDelete
   - Card: bg-surface border border-border rounded-2xl shadow-sm px-4 py-3
   - Row: icon (text-2xl) + title (flex-1 text-base font-medium) + streak badge (🔥 N if >0) + Checkbox
   - Completed: title line-through text-muted
   - Delete button (Trash2) visible on hover: opacity-0 group-hover:opacity-100

3. src/components/habits/HabitForm.tsx
   - Props: onSubmit(title, icon, category), onClose
   - Inside Modal component
   - Fields: icon (text input, default "✨"), title (required), category (select)
   - Category options: Health, Work, Learning, Personal, Other

4. src/components/habits/HabitList.tsx
   - Uses useHabits hook
   - Progress bar: completed/total count + sage-colored bar (bg-border base, bg-sage fill)
   - Sort: incomplete first, completed at bottom
   - "Add habit" button → HabitForm modal
   - Empty state message if no habits

Wire into App.tsx: render HabitList when activeView === 'habits'.
```

---

## Phase 4 — To-Do List

**Creates:** `src/hooks/useTodos.ts`, `src/components/todos/TodoList.tsx`, `TodoItem.tsx`, `TodoForm.tsx`, `TodoFilters.tsx`

**Prompt:**

```
You are building the To-Do List feature for "pl". Read docs/FEATURES.md (To-Do section) and docs/DATA_MODEL.md fully before writing code.

1. src/hooks/useTodos.ts
   - Init from getStore('pl_todos'), persist on change
   - filterState: { priority: 'all'|'low'|'medium'|'high', category: string, status: 'all'|'active'|'completed' }
   - sortBy: 'created' | 'dueDate' | 'priority'
   - filteredTodos: computed from todos + filterState + sortBy
   - Actions: addTodo(data), updateTodo(id, data), deleteTodo(id), toggleTodo(id)
   - toggleTodo: flip completed, set completedAt to ISO string or null
   - Return all state and actions

2. src/components/todos/TodoFilters.tsx
   - Horizontal pill buttons for status: All / Active / Done
   - Select for priority and category
   - Select for sort order

3. src/components/todos/TodoItem.tsx
   - Props: todo, onToggle, onEdit, onDelete
   - Card: bg-surface border border-border rounded-2xl shadow-sm px-4 py-3
   - Row: Checkbox + title + priority Badge + due date text
   - Completed: title line-through text-muted
   - Overdue due date (past today, not completed): text-error
   - Click title → onEdit

4. src/components/todos/TodoForm.tsx
   - Props: todo (Todo | null), onSubmit, onClose, onDelete (if editing)
   - Fields: title (required), description (textarea), priority (select), category (select), dueDate (date input)
   - Pre-fill when todo prop provided
   - Ghost delete button (text-error) shown only when editing

5. src/components/todos/TodoList.tsx
   - Uses useTodos hook
   - TodoFilters above list
   - FAB (+) or header button → new TodoForm modal
   - Empty state for no todos / no matches

Wire into App.tsx: render TodoList when activeView === 'todos'.
```

---

## Phase 5 — Calendar

**Creates:** `src/hooks/useCalendar.ts`, `src/components/calendar/CalendarGrid.tsx`, `CalendarDay.tsx`, `EventForm.tsx`, `EventList.tsx`

**Prompt:**

```
You are building the Calendar feature for "pl". Read docs/FEATURES.md (Calendar section) and docs/DATA_MODEL.md fully before writing code.

1. src/hooks/useCalendar.ts
   - Init events from getStore('pl_events'), persist on change
   - currentMonth: Date (default today)
   - selectedDate: string | null
   - calendarDays: array of { date: Date, dateKey: string, isToday, isCurrentMonth, events: CalendarEvent[] }
     Fill grid from Sunday of first week to Saturday of last week
   - selectedDateEvents: CalendarEvent[] for selected date, sorted by startTime
   - Actions: prevMonth(), nextMonth(), goToToday(), selectDate(key), addEvent(data), updateEvent(id, data), deleteEvent(id)

2. src/components/calendar/CalendarDay.tsx
   - Props: day (day object), isSelected, onClick
   - Today: ring-2 ring-sage on date number span, rounded-full
   - Selected: bg-sage/10 rounded-xl on cell
   - Not current month: opacity-40
   - Event dots: up to 3 colored dots, then "+N" text in text-xs text-muted

3. src/components/calendar/CalendarGrid.tsx
   - Uses useCalendar hook
   - Header: formatted month/year + ChevronLeft / ChevronRight / Today button
   - Day-of-week row: Su Mo Tu We Th Fr Sa (text-xs text-muted text-center)
   - 6×7 grid of CalendarDay cells
   - EventList panel below grid for selected date

4. src/components/calendar/EventList.tsx
   - Props: date, events, onAdd, onEdit
   - Header: formatted date + "+" Button (primary sm)
   - Events sorted by startTime, each with colored left border (border-l-4), title, time range
   - Empty state: "No events"

5. src/components/calendar/EventForm.tsx
   - Props: event (CalendarEvent | null), defaultDate, onSubmit, onClose, onDelete
   - Fields: title (required), date, startTime, endTime, color (6 swatch buttons), description
   - Pre-fill when event provided
   - Delete button for existing events

Wire into App.tsx: render CalendarGrid when activeView === 'calendar'.
```

---

## Phase 6 — Integration & Navigation

**Updates:** `src/App.tsx`, **Creates:** `src/components/layout/Sidebar.tsx`, `BottomNav.tsx`, `Header.tsx`

**Prompt:**

```
You are wiring together all features of "pl" into a polished layout. Read docs/ARCHITECTURE.md and docs/DESIGN.md before starting.

1. src/components/layout/Sidebar.tsx
   - hidden md:flex flex-col, w-48, bg-surface border-r border-border, fixed left-0 top-0 h-full
   - Logo: "pl" text-xl font-semibold text-sage + "your day, your way" text-xs text-muted
   - Nav items: Habits (Home), Todos (CheckSquare), Calendar (Calendar icon)
   - Active: bg-sage/10 text-sage font-medium rounded-xl | Inactive: text-muted hover:text-text hover:bg-border/20 rounded-xl
   - Settings link at bottom
   - Props: activeView, onNavigate

2. src/components/layout/BottomNav.tsx
   - md:hidden, fixed bottom-0, w-full, bg-surface border-t border-border, pb-4
   - Three tabs with icons + labels, active: text-sage, inactive: text-muted
   - Props: activeView, onNavigate

3. src/components/layout/Header.tsx
   - md:hidden, sticky top-0, bg-surface/80 backdrop-blur border-b border-border, px-4 py-3
   - Current view title (capitalize) + Settings icon button on right
   - Props: title, onSettingsClick

4. Settings panel (Modal):
   - Theme toggle: light/dark — adds/removes 'dark' class on document.documentElement, persists to pl_settings
   - Default view selector
   - Export data button → downloadBackup() from storage.ts
   - Reset all data button → confirm dialog → clearAllData() → window.location.reload()

5. Rewrite src/App.tsx:
   - Import all three feature components + layout components
   - State: activeView, showSettings
   - On mount: read pl_settings, apply theme class, set activeView from defaultView setting
   - Layout: md: flex row (Sidebar w-48 fixed + main ml-48) | mobile: flex col (Header + main pb-16 + BottomNav)
   - Wrap each view in key={activeView} for animate-fade-in

Verify all three views navigate and render correctly.
```

---

## Phase 7 — Polish & Deploy

**Prompt:**

```
You are polishing and deploying "pl". Read docs/DESIGN.md and docs/FEATURES.md before reviewing.

1. Review all components in src/components/ against docs/DESIGN.md:
   - Every card: bg-surface border border-border rounded-2xl shadow-sm
   - No hardcoded colors anywhere
   - Buttons match the three defined variants
   - Modals use backdrop-blur and animate-slide-up

2. Run npm run build and fix ALL TypeScript errors. Do not use 'any'.

3. Verify responsive layout at mobile and desktop breakpoints.

4. Verify localStorage: all reads via getStore(), all writes via setStore(), correct key names.

5. Verify first-load habit seeding works correctly.

6. Check .github/workflows/deploy.yml is valid.

7. Final: npm run dev — all three tabs work, data persists on reload. npm run build — exits 0.

Print a summary of issues found and fixed, then print the expected GitHub Pages URL.
```
