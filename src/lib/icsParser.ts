import { nanoid } from 'nanoid'
import type { CalendarEvent } from '../types'

// Unfold ICS lines (RFC 5545: CRLF + whitespace = continuation)
function unfold(text: string): string {
  return text.replace(/\r?\n[ \t]/g, '')
}

// Get the property name (before ; or :)
function propName(line: string): string {
  const colon = line.indexOf(':')
  const semi = line.indexOf(';')
  const end = semi >= 0 && semi < colon ? semi : colon
  return end >= 0 ? line.slice(0, end).toUpperCase() : line.toUpperCase()
}

// Get the property value (everything after the first colon)
function propValue(line: string): string {
  const colon = line.indexOf(':')
  return colon >= 0 ? line.slice(colon + 1) : ''
}

// Unescape ICS text values (\n \, \\)
function unescape(value: string): string {
  return value.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\\\/g, '\\')
}

// Parse ICS datetime string to { date: "YYYY-MM-DD", time: "HH:MM" }
// Handles: 20260310T090000Z, 20260310T090000, 20260310 (all-day)
function parseICSDate(value: string): { date: string; time: string } {
  const clean = value.replace('Z', '').split('T')
  const datePart = clean[0]
  const timePart = clean[1] ?? ''

  const year = datePart.slice(0, 4)
  const month = datePart.slice(4, 6)
  const day = datePart.slice(6, 8)
  const date = `${year}-${month}-${day}`

  if (timePart.length >= 4) {
    const hour = timePart.slice(0, 2)
    const minute = timePart.slice(2, 4)
    return { date, time: `${hour}:${minute}` }
  }

  return { date, time: '' }
}

export function parseICS(text: string): CalendarEvent[] {
  const unfolded = unfold(text)
  const lines = unfolded.split(/\r?\n/)

  const events: CalendarEvent[] = []
  let inEvent = false
  let block: Record<string, string> = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === 'BEGIN:VEVENT') {
      inEvent = true
      block = {}
    } else if (trimmed === 'END:VEVENT') {
      inEvent = false

      const summary = unescape(block['SUMMARY'] ?? 'Untitled')
      const description = unescape(block['DESCRIPTION'] ?? '')
      const uid = block['UID'] ?? nanoid()

      const startRaw = block['DTSTART'] ?? ''
      const endRaw = block['DTEND'] ?? startRaw

      if (!startRaw) continue

      const { date, time: startTime } = parseICSDate(startRaw)
      const { time: endTime } = parseICSDate(endRaw)

      events.push({
        id: nanoid(),
        title: summary,
        date,
        startTime,
        endTime,
        color: '#94a3b8',
        description,
        source: 'imported',
        externalId: uid,
        isReadOnly: true,
      })
    } else if (inEvent) {
      const name = propName(trimmed)
      const value = propValue(trimmed)
      // Only store first occurrence (some props repeat)
      if (!(name in block)) {
        block[name] = value
      }
    }
  }

  return events
}
