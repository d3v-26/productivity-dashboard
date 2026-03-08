# pl

A calm, offline-first productivity dashboard. Daily habits with streak tracking, todos with priorities, and a monthly calendar — all stored in your browser, no account needed.

---

## Features

| Feature | Description |
|---------|-------------|
| **Daily Habits** | Recurring tasks that auto-reset at midnight. Tracks streaks and seeds 5 defaults on first load. |
| **To-Do List** | Tasks with low/medium/high priority, categories, due dates, and filter/sort controls. |
| **Calendar** | Monthly grid with event creation, colored dot indicators, and day-click to add events. |

---

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · date-fns · localStorage

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Build & Deploy

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

Deployment is automatic via GitHub Actions. Push to `main` and the app deploys to GitHub Pages.

**First-time GitHub setup:**
1. Go to repo **Settings → Pages → Source → GitHub Actions**
2. Push to `main`
3. Live at `https://<your-username>.github.io/pl/`

---

## Project Structure

```
pl/
├── src/
│   ├── components/
│   │   ├── habits/       # HabitList, HabitItem, HabitForm
│   │   ├── todos/        # TodoList, TodoItem, TodoForm, TodoFilters
│   │   ├── calendar/     # CalendarGrid, CalendarDay, EventForm, EventList
│   │   ├── layout/       # Sidebar, BottomNav, Header
│   │   └── ui/           # Button, Modal, Input, Badge, Checkbox
│   ├── hooks/            # useHabits, useTodos, useCalendar
│   ├── lib/              # storage.ts, dates.ts, defaults.ts
│   ├── types/            # TypeScript interfaces
│   └── App.tsx
├── docs/                 # Full documentation suite
├── .claude/commands/     # Claude Code slash commands
└── .github/workflows/    # GitHub Actions deploy workflow
```

---

## Data

Everything is stored in `localStorage` under `pl_` keys — no server, no sync, no tracking. Export your data anytime from the settings panel.

---

## Documentation

Full specs in [`docs/`](./docs/):

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — tech decisions and file structure
- [`docs/FEATURES.md`](./docs/FEATURES.md) — detailed feature specs
- [`docs/DESIGN.md`](./docs/DESIGN.md) — color palette and component patterns
- [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) — localStorage schema
- [`docs/AGENTS.md`](./docs/AGENTS.md) — Claude sub-agent build prompts
- [`docs/SKILLS.md`](./docs/SKILLS.md) — Claude slash command reference
