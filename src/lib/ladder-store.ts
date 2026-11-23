/**
 * The exposure ladder: triggers the person lists from easiest to hardest and
 * practises facing without doing the compulsion. This follows exposure and
 * response prevention, the standard therapy for OCD. Everything stays on this
 * device.
 */

export const LADDER_KEY = 'ladder-steps'
export const EXPOSURE_LOG_KEY = 'exposure-log'

/** One trigger on the ladder. */
export type LadderStep = {
  id: string
  text: string
  /** How hard the person expects it to be, 0 (nothing) to 10 (the worst). */
  rating: number
  createdAt: number
}

/** One finished exposure practice. */
export type ExposureEntry = {
  stepId: string
  /** ISO timestamp of when the practice ended. */
  at: string
  minutes: number
  /** Anxiety from 0 to 10 at the start and at the end. */
  before: number
  after: number
}

export const EXPOSURE_MINUTES = [5, 10, 20] as const

/** A good place to start: hard enough to matter, easy enough to finish. */
export const START_RATING = { min: 3, max: 4 }

export function newLadderStep(text: string, rating: number): LadderStep {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    rating,
    createdAt: Date.now(),
  }
}

/** Easiest first. */
export function sortLadder(steps: LadderStep[]) {
  return [...steps].sort(
    (a, b) => a.rating - b.rating || a.createdAt - b.createdAt,
  )
}

export function entriesFor(log: ExposureEntry[], stepId: string) {
  return log.filter((entry) => entry.stepId === stepId)
}
