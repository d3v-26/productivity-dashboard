# Architecture

## Tech Decisions

### Vite
Fast dev server with HMR and optimized production builds. Outputs to `dist/` which GitHub Pages serves directly. Config sets `base` to the repository name for correct asset paths.

### React 18 + TypeScript
Component-based UI with full type safety. TypeScript interfaces defined in `src/types/index.ts` are the single source of truth for all data shapes.

### Tailwind CSS
Utility-first styling with custom design tokens defined as CSS variables in `src/index.css`. Tailwind's `theme.extend` maps these variables to utility classes. Dark mode via `class` strategy.

### date-fns
Lightweight date manipulation. Used for: habit completion date keys, calendar grid generation, streak calculation, and display formatting.

### localStorage
No backend constraint means all persistence lives in the browser. The `src/lib/storage.ts` wrapper provides typed reads/writes with versioning to enable future migrations. Data is namespaced with `pl_` prefix.

### nanoid
Tiny unique ID generator for habit, todo, and event IDs.

---

## File Structure

```
pl/
├── src/
│   ├── components/
│   │   ├── habits/
│   │   │   ├── HabitList.tsx
│   │   │   ├── HabitItem.tsx
│   │   │   └── HabitForm.tsx
│   │   ├── todos/
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── TodoFilters.tsx
│   │   ├── calendar/
│   │   │   ├── CalendarGrid.tsx
│   │   │   ├── CalendarDay.tsx
│   │   │   ├── EventForm.tsx
│   │   │   └── EventList.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── Header.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       └── Checkbox.tsx
│   ├── hooks/
│   │   ├── useHabits.ts
│   │   ├── useTodos.ts
│   │   └── useCalendar.ts
│   ├── lib/
│   │   ├── storage.ts
│   │   ├── dates.ts
│   │   └── defaults.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── docs/
├── .claude/commands/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

---

## GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**Vite base config** must match repo name:
```ts
export default defineConfig({
  base: '/pl/',
  plugins: [react()],
})
```

---

## State Management

No external state library. Each feature has a custom hook that reads from localStorage on mount and writes back on every change via `useEffect`. App-level view state lives in `App.tsx` as simple `useState`.
