import { readStored, writeStored } from '@/lib/storage'

/** Storage keys. Everything here stays on this device. */
export const FOCUS_ACTIVE_KEY = 'focus-active'
export const PARKED_KEY = 'parked-thoughts'
const LOG_KEY = 'focus-log'
const MAX_ENTRIES = 2000

export const FOCUS_MINUTES = [5, 15, 25, 45] as const

/** Gentle one-tap starters for moments when writing an intention feels heavy. */
export const FOCUS_INTENTION_PRESETS = [
  'Start one avoided task',
  'Work imperfectly',
  'Read without checking phone',
  'One small step',
] as const

/** The focus session that is running or paused right now. */
export type ActiveFocus = {
  intention: string
  minutes: number
  /** Real length in milliseconds (shorter than `minutes` only in dev speed-ups). */
  totalMs: number
  startedAt: number
  /** Clock time the session ends, or null while paused. */
  endsAt: number | null
  /** Time left when paused, or null while running. */
  pausedRemainingMs: number | null
  /** Times the person noticed they drifted and came back. */
  returns: number
  /** Optional 3-breath arrival beat before the countdown starts. */
  arriveFirst?: boolean
}

/** A thought set down to deal with later. */
export type ParkedThought = { id: string; text: string; at: number }

/** One finished or ended-early focus session. */
export type FocusEntry = {
  at: string
  intention: string
  minutes: number
  focusedSeconds: number
  completed: boolean
  returns: number
}

export function remainingMs(active: ActiveFocus, now: number) {
  if (active.pausedRemainingMs !== null) return active.pausedRemainingMs
  return Math.max(0, (active.endsAt ?? now) - now)
}

export function logFocus(entry: FocusEntry) {
  const log = readStored<FocusEntry[]>(LOG_KEY, [])
  writeStored(LOG_KEY, [...log, entry].slice(-MAX_ENTRIES))
}

export function newParkedThought(text: string): ParkedThought {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    at: Date.now(),
  }
}

/** mm:ss for the timer face. */
export function clockLabel(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
