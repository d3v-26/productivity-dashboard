# pl — Personal Productivity Dashboard

A static, offline-first productivity dashboard with daily habits, todos, and a calendar. Hosted on GitHub Pages with no backend required.

---

## Elevator Pitch

`pl` is a calm, focused productivity tool that lives entirely in your browser. No accounts, no sync, no distractions — just your habits, tasks, and schedule, stored locally and always available.

---

## Features

| Feature | Description |
|---------|-------------|
| **Daily Habits** | Recurring tasks that auto-reset at midnight with streak tracking |
| **To-Do List** | Persistent tasks with priorities, categories, and due dates |
| **Calendar** | Monthly view with event creation and dot indicators |

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Build & Deploy

```bash
npm run build
npm run preview
```

Deployment is handled automatically via GitHub Actions. Push to `main` to trigger a build and deploy to GitHub Pages.

---

## Tech Stack

| Technology | Role |
|------------|------|
| **Vite** | Build tool, dev server |
| **React 18** | UI component framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling with custom design tokens |
| **date-fns** | Date manipulation for habit resets and calendar |
| **nanoid** | Unique ID generation |
| **localStorage** | Client-side data persistence (no backend) |

---

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech decisions, file structure, CI/CD setup |
| [FEATURES.md](./FEATURES.md) | Detailed feature specifications |
| [DESIGN.md](./DESIGN.md) | Color palette, typography, component patterns |
| [DATA_MODEL.md](./DATA_MODEL.md) | localStorage schema and type definitions |
| [SKILLS.md](./SKILLS.md) | Claude Code slash commands for development |
| [AGENTS.md](./AGENTS.md) | Complete sub-agent prompts for building the app |
