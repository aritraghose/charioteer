import { COURSE_SESSIONS } from '@/content/course-sessions'
import type { Session, SessionStep } from '@/content/sessions-types'

/**
 * Guided sessions, written as data. The player turns each one into a timeline.
 *
 * Writing rules for scripts:
 * - Never ask the listener to stop, suppress or control a thought. The framing
 *   is always: notice, name, don't answer, return.
 * - Wandering is never a mistake. Every return counts as the practice.
 * - Every session works with eyes open.
 */

export type { Session, SessionStep }

/** Short sessions that can be done at any time. */
export const SESSIONS: Session[] = [
  {
    id: 'settle',
    title: 'Settle the nervous system',
    note: 'A short exhale-focused reset for moments when everything feels too loud.',
    intro:
      'Slow breathing with a longer out-breath. Follow the circle: it grows as you breathe in and shrinks as you breathe out.',
    pill: 'bg-yellow-soft text-yellow-ink',
    steps: [
      {
        kind: 'say',
        text: 'Sit or stand however is comfortable. Eyes open or closed, either is fine.',
        seconds: 8,
      },
      {
        kind: 'say',
        text: 'Let your shoulders drop. Unclench your jaw.',
        seconds: 8,
      },
      {
        kind: 'breathe',
        text: 'In through the nose. Let the out-breath be longer.',
        cycles: 12,
        inhale: 4,
        exhale: 6,
      },
      {
        kind: 'say',
        text: 'Let the breath go back to its own pace.',
        seconds: 10,
      },
      {
        kind: 'rest',
        text: 'Feel your feet, your hands, the room around you.',
        seconds: 20,
      },
      {
        kind: 'say',
        text: 'That is all. You can carry on with your day.',
        seconds: 8,
      },
    ],
  },
  {
    id: 'breath-anchor',
    title: 'Steady breath anchor',
    note: 'Gentle practice in noticing a wandering thought and returning without frustration.',
    intro:
      'You rest attention on the breath, notice when the mind has wandered, and come back. The coming back is the practice.',
    pill: 'bg-peach-soft text-peach-ink',
    steps: [
      {
        kind: 'say',
        text: 'Settle into a position you can hold for a few minutes. Eyes open or closed.',
        seconds: 10,
      },
      {
        kind: 'breathe',
        text: 'Three slower breaths to arrive.',
        cycles: 3,
        inhale: 4,
        exhale: 6,
      },
      {
        kind: 'say',
        text: 'Now let the breath be natural. Find where you feel it most: nostrils, chest or belly.',
        seconds: 12,
      },
      { kind: 'rest', text: 'Rest your attention there.', seconds: 45 },
      {
        kind: 'say',
        text: 'At some point the mind will wander. That is not a mistake. Noticing it is the practice.',
        seconds: 12,
      },
      {
        kind: 'rest',
        text: 'When you notice you have drifted, come back to the breath. No scolding.',
        seconds: 50,
      },
      {
        kind: 'say',
        text: 'Wandered again? Good. Come back again. Each return is one repetition.',
        seconds: 10,
      },
      {
        kind: 'rest',
        text: 'Breath. Wander. Notice. Return.',
        seconds: 60,
      },
      {
        kind: 'say',
        text: 'If a thought feels urgent, you do not have to answer it now. It can wait.',
        seconds: 10,
      },
      { kind: 'rest', text: 'Back to the breath.', seconds: 45 },
      {
        kind: 'say',
        text: 'Let go of the breath as an anchor. Notice the room around you.',
        seconds: 10,
      },
      {
        kind: 'say',
        text: 'Done. You practised coming back.',
        seconds: 8,
      },
    ],
  },
  {
    id: 'open-awareness',
    title: 'Open awareness',
    note: 'Let thoughts pass like weather in the sky while staying grounded in the body.',
    intro:
      'There is nothing to hold on to here. You notice sounds, sensations and thoughts as they come, label them, and let them pass.',
    pill: 'bg-pink-soft text-pink-ink',
    steps: [
      {
        kind: 'say',
        text: 'Sit comfortably. Keep your eyes open and soft if closing them feels uneasy.',
        seconds: 10,
      },
      {
        kind: 'breathe',
        text: 'Three slower breaths to arrive.',
        cycles: 3,
        inhale: 4,
        exhale: 6,
      },
      {
        kind: 'say',
        text: 'In this practice you are only noticing what shows up.',
        seconds: 12,
      },
      {
        kind: 'rest',
        text: 'Sounds first. Near ones, far ones. Let them come and go.',
        seconds: 60,
      },
      {
        kind: 'say',
        text: 'Now sensations in the body. Pressure, warmth, tingling. No need to change any of it.',
        seconds: 12,
      },
      { kind: 'rest', text: 'Notice, and let it be.', seconds: 80 },
      {
        kind: 'say',
        text: 'Now thoughts. When one appears, label it quietly: "thinking". Then let it pass, like weather.',
        seconds: 14,
      },
      { kind: 'rest', text: 'Thinking. And it passes.', seconds: 100 },
      {
        kind: 'say',
        text: 'Some thoughts are loud or upsetting. They are still thoughts. You do not have to argue with them or push them away.',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'Let it be there. Label it. Stay.',
        seconds: 110,
      },
      {
        kind: 'say',
        text: 'If you were pulled into a story, that is fine. Notice, label, and widen out again.',
        seconds: 12,
      },
      {
        kind: 'rest',
        text: 'Sounds, body, thoughts. All passing through.',
        seconds: 100,
      },
      {
        kind: 'say',
        text: 'Take one deeper breath. Feel your feet and your hands.',
        seconds: 12,
      },
      {
        kind: 'say',
        text: 'Done. Thoughts came and went, and you stayed.',
        seconds: 10,
      },
    ],
  },
]

/**
 * A longer version of a session: the quiet stretches are lengthened and the
 * spoken guidance is left as it is.
 */
function stretch(
  session: Session,
  factor: number,
  overrides: Pick<Session, 'id' | 'title' | 'note'>,
): Session {
  return {
    ...session,
    ...overrides,
    steps: session.steps.map((step) =>
      step.kind === 'rest'
        ? { ...step, seconds: Math.round((step.seconds * factor) / 10) * 10 }
        : step,
    ),
  }
}

const openAwareness = SESSIONS.find((session) => session.id === 'open-awareness')

const ALL_SESSIONS: Session[] = [
  ...SESSIONS,
  ...COURSE_SESSIONS,
  ...(openAwareness
    ? [
        stretch(openAwareness, 1.7, {
          id: 'open-awareness-long',
          title: 'Open awareness, longer',
          note: 'The open awareness practice with longer quiet stretches.',
        }),
      ]
    : []),
]

export function getSession(id: string) {
  return ALL_SESSIONS.find((session) => session.id === id)
}
