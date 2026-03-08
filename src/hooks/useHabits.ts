import { useState, useEffect, useMemo } from 'react'
import { nanoid } from 'nanoid'
import { getStore, setStore } from '../lib/storage'
import { todayKey, calculateStreak, pruneCompletions } from '../lib/dates'
import { DEFAULT_HABITS } from '../lib/defaults'
import type { Habit, HabitStore, CompletionStore } from '../types'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const store = getStore<HabitStore>('pl_habits')
    // Seed defaults on first load
    if (store.habits.length === 0) return DEFAULT_HABITS
    return store.habits
  })

  const [completions, setCompletions] = useState(() =>
    getStore<CompletionStore>('pl_habit_completions').completions
  )

  // Persist habits
  useEffect(() => {
    setStore<HabitStore>('pl_habits', { habits, version: 1 })
  }, [habits])

  // Persist completions (pruned)
  useEffect(() => {
    setStore<CompletionStore>('pl_habit_completions', {
      completions: pruneCompletions(completions),
      version: 1,
    })
  }, [completions])

  const today = todayKey()

  const todayCompletions = useMemo<Set<string>>(
    () => new Set(completions.filter(c => c.completedDate === today).map(c => c.habitId)),
    [completions, today]
  )

  const streaks = useMemo<Record<string, number>>(
    () => Object.fromEntries(habits.map(h => [h.id, calculateStreak(completions, h.id)])),
    [completions, habits]
  )

  function addHabit(title: string, icon: string, category: string) {
    const habit: Habit = {
      id: nanoid(),
      title,
      icon: icon || '✨',
      category,
      createdAt: new Date().toISOString(),
    }
    setHabits(prev => [...prev, habit])
  }

  function deleteHabit(id: string) {
    setHabits(prev => prev.filter(h => h.id !== id))
    setCompletions(prev => prev.filter(c => c.habitId !== id))
  }

  function toggleHabit(id: string) {
    if (todayCompletions.has(id)) {
      setCompletions(prev => prev.filter(c => !(c.habitId === id && c.completedDate === today)))
    } else {
      setCompletions(prev => [...prev, { habitId: id, completedDate: today }])
    }
  }

  return { habits, todayCompletions, streaks, addHabit, deleteHabit, toggleHabit }
}
