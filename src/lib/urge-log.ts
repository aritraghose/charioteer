import { readStored, writeStored } from '@/lib/storage'

export type UrgeAfter = 'same' | 'weaker' | 'gone'

/** One finished urge delay. Kept on this device only. */
export type UrgeEntry = {
  /** ISO timestamp of when the delay ended. */
  at: string
  minutes: number
  /** How the urge felt once the time was up. */
  after: UrgeAfter
}

const KEY = 'urge-log'
const MAX_ENTRIES = 2000

export function readUrgeLog() {
  return readStored<UrgeEntry[]>(KEY, [])
}

export function logUrge(entry: UrgeEntry) {
  writeStored(KEY, [...readUrgeLog(), entry].slice(-MAX_ENTRIES))
}
