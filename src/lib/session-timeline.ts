import type { Session } from '@/content/sessions'

/** What the breathing circle is doing during a segment. */
export type Phase = 'still' | 'inhale' | 'exhale'

/** One stretch of the session with a fixed cue and breathing phase. */
export type Segment = {
  /** Seconds from the start of the session. */
  start: number
  end: number
  phase: Phase
  text: string
  /** Index of the step this segment came from, for progress dots and bells. */
  stepIndex: number
}

/** Flattens a session's steps into back-to-back segments. */
export function buildTimeline(session: Session): Segment[] {
  const segments: Segment[] = []
  let cursor = 0
  const push = (
    seconds: number,
    phase: Phase,
    text: string,
    stepIndex: number,
  ) => {
    segments.push({ start: cursor, end: cursor + seconds, phase, text, stepIndex })
    cursor += seconds
  }

  session.steps.forEach((step, stepIndex) => {
    if (step.kind === 'breathe') {
      for (let cycle = 0; cycle < step.cycles; cycle++) {
        push(step.inhale, 'inhale', step.text, stepIndex)
        push(step.exhale, 'exhale', step.text, stepIndex)
      }
    } else {
      push(step.seconds, 'still', step.text, stepIndex)
    }
  })

  return segments
}

export function totalSeconds(timeline: Segment[]) {
  return timeline.length ? timeline[timeline.length - 1].end : 0
}

/** Length of a session rounded to whole minutes, for labels. */
export function sessionMinutes(session: Session) {
  return Math.max(1, Math.round(totalSeconds(buildTimeline(session)) / 60))
}

/** The segment playing at `elapsed` seconds, and how far through it we are (0 to 1). */
export function segmentAt(timeline: Segment[], elapsed: number) {
  const index = timeline.findIndex((segment) => elapsed < segment.end)
  const segment = timeline[index === -1 ? timeline.length - 1 : index]
  const length = segment.end - segment.start
  const progress = Math.min(1, Math.max(0, (elapsed - segment.start) / length))
  return { segment, progress }
}

const REST_SCALE = 0.62

/**
 * Size of the breathing circle, from REST_SCALE (empty lungs) to 1 (full).
 * Eased so the breath turns around gently at the top and bottom.
 */
export function circleScale(phase: Phase, progress: number) {
  if (phase === 'still') return REST_SCALE
  const eased = (1 - Math.cos(Math.PI * progress)) / 2
  const fill = phase === 'inhale' ? eased : 1 - eased
  return REST_SCALE + (1 - REST_SCALE) * fill
}
