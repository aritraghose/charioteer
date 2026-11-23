import { readStored, writeStored } from '@/lib/storage'

/** One finished or ended-early session. Kept on this device only. */
export type PracticeEntry = {
  sessionId: string
  /** ISO timestamp of when the session ended. */
  at: string
  /** Seconds actually practised. */
  seconds: number
  completed: boolean
}

const KEY = 'practice-log'
const MAX_ENTRIES = 2000

export function readPracticeLog() {
  return readStored<PracticeEntry[]>(KEY, [])
}

export function logPractice(entry: PracticeEntry) {
  writeStored(KEY, [...readPracticeLog(), entry].slice(-MAX_ENTRIES))
}

/** How many different days a session was completed on. */
export function daysPractised(log: PracticeEntry[], sessionId: string) {
  const days = new Set(
    log
      .filter((entry) => entry.sessionId === sessionId && entry.completed)
      .map((entry) => new Date(entry.at).toDateString()),
  )
  return days.size
}

/** "Not practised yet", "Practised on 1 day", "Practised on 3 days". */
export function daysLabel(days: number) {
  if (days === 0) return 'Not practised yet'
  return days === 1 ? 'Practised on 1 day' : `Practised on ${days} days`
}

export const PRACTICE_LOG_KEY = KEY
export const COURSE_WEEK_KEY = 'course-week'
