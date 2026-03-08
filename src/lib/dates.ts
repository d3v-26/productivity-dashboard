import { format, subDays, parseISO, isValid } from 'date-fns'
import type { HabitCompletion } from '../types'

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function calculateStreak(completions: HabitCompletion[], habitId: string): number {
  const habitCompletions = completions
    .filter(c => c.habitId === habitId)
    .map(c => c.completedDate)
    .sort()
    .reverse()

  if (habitCompletions.length === 0) return 0

  const today = todayKey()
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  // Streak must include today or yesterday to be "active"
  if (habitCompletions[0] !== today && habitCompletions[0] !== yesterday) return 0

  let streak = 0
  let checkDate = habitCompletions[0] === today ? new Date() : subDays(new Date(), 1)

  for (let i = 0; i < habitCompletions.length; i++) {
    const expected = format(checkDate, 'yyyy-MM-dd')
    const dateObj = parseISO(habitCompletions[i])
    if (!isValid(dateObj)) break
    if (habitCompletions[i] === expected) {
      streak++
      checkDate = subDays(checkDate, 1)
    } else {
      break
    }
  }

  return streak
}

export function pruneCompletions(completions: HabitCompletion[]): HabitCompletion[] {
  const cutoff = format(subDays(new Date(), 90), 'yyyy-MM-dd')
  return completions.filter(c => c.completedDate >= cutoff)
}
