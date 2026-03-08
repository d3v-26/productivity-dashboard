import type { Habit } from '../types'

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'default-1',
    title: 'Apply to LinkedIn',
    icon: '💼',
    category: 'Work',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-2',
    title: 'Take multivitamin',
    icon: '💊',
    category: 'Health',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-3',
    title: 'Drink 8 glasses of water',
    icon: '💧',
    category: 'Health',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-4',
    title: '30 min exercise',
    icon: '🏃',
    category: 'Health',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-5',
    title: 'Read for 20 min',
    icon: '📖',
    category: 'Learning',
    createdAt: new Date().toISOString(),
  },
]
