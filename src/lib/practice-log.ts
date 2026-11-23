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
