/** The shape of a guided session. See `sessions.ts` for the writing rules. */

export type SessionStep =
  /** Guidance to read, held on screen for `seconds`. */
  | { kind: 'say'; text: string; seconds: number }
  /** A stretch of practice with one short cue left on screen. */
  | { kind: 'rest'; text: string; seconds: number }
  /** Paced breathing. Times are in seconds per breath. */
  | {
      kind: 'breathe'
      text: string
      cycles: number
      inhale: number
      exhale: number
    }

export type Session = {
  id: string
  title: string
  /** One line for the Practice list. */
  note: string
  /** Shown on the screen before the session starts. */
  intro: string
  /** Short, plain-English explanation of why this evidence-based method helps. */
  why?: string
  /** Plain method tag for scannability (e.g. "Breathing", "Defusion", "Evening"). */
  kind?: string
  /** Colour classes for the duration pill. */
  pill: string
  steps: SessionStep[]
}
