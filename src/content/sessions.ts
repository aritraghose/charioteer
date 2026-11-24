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
    why: 'Lengthening the out-breath gently activates the brake side of your nervous system, lowering physical urgency without needing to think your way calm.',
    kind: 'Breathing',
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
    id: 'defusion',
    title: 'Step back from a sticky thought',
    note: 'See a repeating thought as a passing event in the mind rather than an order.',
    intro:
      'You practise putting a little space around a loud thought—without arguing with it, proving it wrong, or forcing it away.',
    why: 'Arguing with an intrusive or anxious thought tells the brain it is an emergency. Stepping back ("I am having the thought that…") breaks fusion so the thought loses its command.',
    kind: 'Defusion',
    pill: 'bg-pink-soft text-pink-ink',
    steps: [
      {
        kind: 'say',
        text: 'Sit comfortably with your eyes open or soft. You do not need to share or solve the thought.',
        seconds: 10,
      },
      {
        kind: 'breathe',
        text: 'Three unhurried breaths to arrive.',
        cycles: 3,
        inhale: 4,
        exhale: 6,
      },
      {
        kind: 'say',
        text: 'Notice whatever thought is pulling at you most right now. Notice how close and urgent it feels.',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'Let it be there for a moment without answering it.',
        seconds: 35,
      },
      {
        kind: 'say',
        text: 'Now quietly add a short prefix in front of it: "I am having the thought that…"',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'I am having the thought that…',
        seconds: 50,
      },
      {
        kind: 'say',
        text: 'Step one notch further back: "I notice my mind is running the story that…"',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'My mind is running a story. I am the one noticing it.',
        seconds: 55,
      },
      {
        kind: 'say',
        text: 'Picture the mind like a radio playing in the next room. You can hear it, and you do not have to obey it or turn it off.',
        seconds: 16,
      },
      {
        kind: 'rest',
        text: 'Radio in the next room. Feet on the floor.',
        seconds: 65,
      },
      {
        kind: 'say',
        text: 'If you got pulled back into debating it, that is normal. Step back and notice the radio again.',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'Notice the room around you. Let the thought sit in the background.',
        seconds: 45,
      },
      {
        kind: 'say',
        text: 'Done. The thought can stay or go; either way, you do not have to obey it.',
        seconds: 10,
      },
    ],
  },
  {
    id: 'rain-pause',
    title: 'RAIN pause for a hard moment',
    note: 'Recognise, allow, feel it in the body, and meet yourself with plain kindness.',
    intro:
      'A short four-step pause for moments of shame, harsh self-criticism, or heavy emotion. Nothing to fix—only meeting what is already here.',
    why: 'Beating yourself up triggers the same threat alarm as an outside danger. Meeting a hard feeling with calm recognition lets the wave pass faster than fighting it.',
    kind: 'Compassion',
    pill: 'bg-peach-soft text-peach-ink',
    steps: [
      {
        kind: 'say',
        text: 'Pause where you are. Eyes open or closed. Let your shoulders settle.',
        seconds: 10,
      },
      {
        kind: 'breathe',
        text: 'Two slow breaths to land.',
        cycles: 2,
        inhale: 4,
        exhale: 6,
      },
      {
        kind: 'say',
        text: 'First, Recognise. Silently name what is strongest right now: "overwhelm", "fear", "shame", or simply "a hard moment".',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'Recognise what is here, in one plain word.',
        seconds: 30,
      },
      {
        kind: 'say',
        text: 'Second, Allow. You do not have to like this feeling. For the next half minute, stop wrestling with the fact that it is here.',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'This is what is here right now. Let it be here.',
        seconds: 40,
      },
      {
        kind: 'say',
        text: 'Third, Investigate gently. Where does this sit in your body? Throat, chest, stomach, jaw? Just sense it without analysing why.',
        seconds: 15,
      },
      {
        kind: 'rest',
        text: 'Feel where it sits in the body. Breathe around it.',
        seconds: 45,
      },
      {
        kind: 'say',
        text: 'Fourth, Nurture. Place a hand on your chest or hold your own hands if that feels okay. Say plainly: "This is hard. I do not have to attack myself for it."',
        seconds: 16,
      },
      {
        kind: 'rest',
        text: 'This is hard. May I be steady and patient with myself.',
        seconds: 50,
      },
      {
        kind: 'say',
        text: 'Feel the ground under your feet. Done. Carry that gentler tone into your next step.',
        seconds: 10,
      },
    ],
  },
  {
    id: 'evening-unwind',
    title: 'Set the day down',
    note: 'A quiet transition for late-night overthinking and a mind still solving tomorrow.',
    intro:
      'Shift attention out of tomorrow’s plans and into the physical weight of resting. You are not trying to force sleep—only letting the day end.',
    why: 'Trying to force sleep creates performance pressure that keeps you awake. Mentally shelving unfinished tasks and resting in physical heaviness lets the body downshift on its own.',
    kind: 'Evening',
    pill: 'bg-yellow-soft text-yellow-ink',
    steps: [
      {
        kind: 'say',
        text: 'Sit or lie down comfortably. Dim the screen if you like. There is nothing left to prove tonight.',
        seconds: 12,
      },
      {
        kind: 'breathe',
        text: 'Four unhurried breaths. Let each out-breath feel heavy.',
        cycles: 4,
        inhale: 4,
        exhale: 6,
      },
      {
        kind: 'say',
        text: 'Notice any unfinished tasks or worries still buzzing. Picture placing them on a shelf outside the room until morning.',
        seconds: 16,
      },
      {
        kind: 'rest',
        text: 'Tomorrow’s problems belong to tomorrow. Set them on the shelf.',
        seconds: 50,
      },
      {
        kind: 'say',
        text: 'Feel the back of your body where it is supported—heels, legs, hips, back, shoulders, head.',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'Let the bed or chair hold your full weight.',
        seconds: 70,
      },
      {
        kind: 'say',
        text: 'Unclench your jaw. Let your tongue rest on the floor of your mouth. Soften the space behind your eyes.',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'Jaw soft. Shoulders heavy. Breath moving by itself.',
        seconds: 75,
      },
      {
        kind: 'say',
        text: 'If a thought pops up about what you forgot or need to solve, tell it quietly: "Not tonight," and return to the weight of your body.',
        seconds: 16,
      },
      {
        kind: 'rest',
        text: 'Not tonight. Just resting.',
        seconds: 90,
      },
      {
        kind: 'say',
        text: 'Done. Rest is enough, whether sleep comes right away or slowly.',
        seconds: 10,
      },
    ],
  },
  {
    id: 'breath-anchor',
    title: 'Steady breath anchor',
    note: 'Gentle practice in noticing a wandering thought and returning without frustration.',
    intro:
      'You rest attention on the breath, notice when the mind has wandered, and come back. The coming back is the practice.',
    why: 'Attention is trained like a muscle: every time you notice drift and gently return without scolding yourself, you strengthen the exact skill that pulls you out of rumination.',
    kind: 'Anchor',
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
    why: 'Watching sounds, sensations, and thoughts as passing events trains metacognitive awareness—seeing that a scary thought is just mental weather, not reality.',
    kind: 'Awareness',
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
