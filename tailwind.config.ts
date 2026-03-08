import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:           'var(--color-bg)',
        surface:      'var(--color-surface)',
        border:       'var(--color-border)',
        text:         'var(--color-text)',
        muted:        'var(--color-text-muted)',
        sage:         'var(--color-sage)',
        'sage-light': 'var(--color-sage-light)',
        lavender:     'var(--color-lavender)',
        amber:        'var(--color-amber)',
        error:        'var(--color-error)',
      },
      fontFamily: {
        sans:  ["'Inter'", 'system-ui', 'sans-serif'],
        mono:  ["'JetBrains Mono'", "'Fira Code'", 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
