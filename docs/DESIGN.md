# Design System

A warm, chill lofi aesthetic.

---

## Color Palette

```css
:root {
  --color-bg:         #F7F3EE;
  --color-surface:    #FFFAF5;
  --color-border:     #E8E0D5;
  --color-text:       #3D3530;
  --color-text-muted: #8B7D74;
  --color-sage:       #7A9E7E;
  --color-sage-light: #B5CEB8;
  --color-lavender:   #9B8EC4;
  --color-amber:      #D4904A;
  --color-error:      #C4635A;
}
.dark {
  --color-bg:         #1E1A17;
  --color-surface:    #2A2420;
  --color-border:     #3D3530;
  --color-text:       #F7F3EE;
  --color-text-muted: #8B7D74;
}
```

### Tailwind Config Mapping
```ts
colors: {
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  border: 'var(--color-border)',
  text: 'var(--color-text)',
  muted: 'var(--color-text-muted)',
  sage: 'var(--color-sage)',
  'sage-light': 'var(--color-sage-light)',
  lavender: 'var(--color-lavender)',
  amber: 'var(--color-amber)',
  error: 'var(--color-error)',
}
```

---

## Typography

Font: Inter (Google Fonts), weights 400/500/600

| Class | Size | Use |
|-------|------|-----|
| `text-xs` | 12px | Timestamps, metadata |
| `text-sm` | 14px | Secondary text, badges |
| `text-base` | 16px | Body text, inputs |
| `text-lg` | 20px | Card titles |
| `text-xl` | 24px | Section headers |

---

## Component Patterns

### Cards
```
bg-surface border border-border rounded-2xl shadow-sm p-4
```

### Buttons
- **Primary:** `bg-sage text-white rounded-xl px-4 py-2 text-sm font-medium hover:opacity-90 transition-colors`
- **Secondary:** `bg-lavender/10 text-lavender border border-lavender/20 rounded-xl px-4 py-2 text-sm font-medium hover:bg-lavender/20 transition-colors`
- **Ghost:** `text-muted hover:text-text hover:bg-border/30 rounded-xl px-4 py-2 text-sm transition-colors`

### Checkbox
`w-5 h-5 rounded-md border-2 border-border` → checked: `bg-sage border-sage` with SVG checkmark + `checkbox-check` animation class

### Modals
- Backdrop: `fixed inset-0 bg-text/20 backdrop-blur-sm z-40`
- Card: `fixed bottom-0 left-0 right-0 md:relative md:max-w-md md:mx-auto bg-surface rounded-t-3xl md:rounded-2xl p-6 z-50 animate-slide-up`
- Use `ReactDOM.createPortal` into `document.body`

### Priority Badges
- low: `bg-sage/10 text-sage text-xs font-medium px-2 py-0.5 rounded-full`
- medium: `bg-amber/10 text-amber text-xs font-medium px-2 py-0.5 rounded-full`
- high: `bg-lavender/10 text-lavender text-xs font-medium px-2 py-0.5 rounded-full`

### Streak Badge
`flex items-center gap-1 text-xs text-amber font-medium` → 🔥 N

---

## Layout

Desktop (≥640px): fixed sidebar (w-48) + main content (ml-48)
Mobile (<640px): sticky header + scrollable content + fixed bottom nav

### Sidebar
- Active: `bg-sage/10 text-sage font-medium rounded-xl`
- Inactive: `text-muted hover:text-text hover:bg-border/20 rounded-xl`

### Animations
- `animate-slide-up` — modal entrance
- `animate-fade-in` — view transitions
- `checkbox-check` — habit completion

---

## Icons
Lucide React: `Home`, `CheckSquare`, `Calendar`, `Plus`, `Trash2`, `Edit2`, `ChevronLeft`, `ChevronRight`, `Settings`, `Download`, `Moon`, `Sun`, `X`
