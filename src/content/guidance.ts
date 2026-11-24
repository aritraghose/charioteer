/**
 * Predefined, stateless self-help matching categories and plain-English
 * psychoeducation. Nothing is asked, typed, diagnosed, or stored—this simply
 * matches a common state of mind to an evidence-based practice.
 */

export type TimeBudget = 'short' | 'medium' | 'long'

export type GuidanceTarget =
  | { to: '/calm/now' }
  | { to: '/calm/delay' }
  | { to: '/calm/ground' }
  | { to: '/calm/breathe' }
  | { to: '/focus' }
  | { to: '/ladder' }
  | { to: '/practice' }
  | { to: '/session/$sessionId'; params: { sessionId: string } }

export type GuidanceOption = {
  label: string
  detail: string
  duration: string
  target: GuidanceTarget
}

export type GuidanceCategory = {
  id: string
  /** Plain description of what feels loudest right now. */
  label: string
  /** Evidence-based family name, kept plain. */
  method: string
  /** Short 2-sentence explanation of why this method works. */
  why: string
  /** Optional clinical guardrail (e.g., why not to soothe a compulsive urge). */
  caution?: string
  /** Best matched practice for each time budget. */
  byTime: Record<TimeBudget, GuidanceOption>
  /** One quiet alternative if the primary method isn't right today. */
  alternative: GuidanceOption
}

export const TIME_BUDGETS: { key: TimeBudget; label: string }[] = [
  { key: 'short', label: '2–3 min' },
  { key: 'medium', label: '5–10 min' },
  { key: 'long', label: '15+ min' },
]

export const GUIDANCE_CATEGORIES: GuidanceCategory[] = [
  {
    id: 'looping',
    label: 'Looping thoughts or "what ifs"',
    method: 'Cognitive defusion & naming',
    why: 'Arguing with or trying to disprove a looping thought signals danger to the brain, making it return louder. Naming the kind of thought and leaving it unanswered lets the alarm lose fuel.',
    byTime: {
      short: {
        label: 'Notice, name & leave unanswered',
        detail: 'Step out of the loop in three calm beats without debating it.',
        duration: '2–3 min',
        target: { to: '/calm/now' },
      },
      medium: {
        label: 'Step back from a sticky thought',
        detail:
          'Guided defusion practice: see the thought as mental noise, not an order.',
        duration: '6 min',
        target: { to: '/session/$sessionId', params: { sessionId: 'defusion' } },
      },
      long: {
        label: 'Naming thoughts',
        detail: 'Ten quiet minutes of one-word labelling and returning.',
        duration: '10 min',
        target: {
          to: '/session/$sessionId',
          params: { sessionId: 'naming-thoughts' },
        },
      },
    },
    alternative: {
      label: 'Park stray thoughts on Focus',
      detail: 'Set a repeating worry down in one line so you can stop holding it.',
      duration: '1 min',
      target: { to: '/focus' },
    },
  },
  {
    id: 'urge',
    label: 'Strong urge to check, fix, or ask',
    method: 'Urge delay & response prevention',
    why: 'Quick relief from checking or asking for reassurance teaches the brain the threat was real. Waiting without acting lets you watch the urge peak and fall by itself—which weakens the loop.',
    caution:
      'Avoid using calming exercises to push an intrusive urge away; trying to soothe it on purpose can become another compulsion. Waiting without acting is the practice.',
    byTime: {
      short: {
        label: 'Delay the urge',
        detail: 'Wait 5 minutes without checking, fixing, or asking—watch what happens.',
        duration: '5 min',
        target: { to: '/calm/delay' },
      },
      medium: {
        label: 'Delay the urge',
        detail: 'Sit with the wave for 10 minutes without answering the compulsion.',
        duration: '10 min',
        target: { to: '/calm/delay' },
      },
      long: {
        label: 'Exposure ladder',
        detail: 'Practise facing triggers step by step without the compulsion.',
        duration: '10–20 min',
        target: { to: '/ladder' },
      },
    },
    alternative: {
      label: 'Letting it be',
      detail: 'Guided practice in staying with physical discomfort without fixing it.',
      duration: '11 min',
      target: {
        to: '/session/$sessionId',
        params: { sessionId: 'letting-it-be' },
      },
    },
  },
  {
    id: 'body',
    label: 'Body tense, panicky, or overloaded',
    method: 'Somatic grounding & paced breath',
    why: 'When your body is in fight-or-flight, trying to think your way calm rarely works. A longer out-breath or eyes-open sensory grounding signals safety directly through the body.',
    byTime: {
      short: {
        label: '2-minute breathing pacer',
        detail: 'Double-inhale sigh, longer exhale, or box breathing with a live pacer.',
        duration: '1–3 min',
        target: { to: '/calm/breathe' },
      },
      medium: {
        label: '5-4-3-2-1 sensory grounding',
        detail:
          'Eyes-open reset using what you can see, touch, and hear right now.',
        duration: '3–5 min',
        target: { to: '/calm/ground' },
      },
      long: {
        label: 'Body scan',
        detail: 'Move attention slowly from feet to head without trying to force relaxation.',
        duration: '8 min',
        target: { to: '/session/$sessionId', params: { sessionId: 'body-scan' } },
      },
    },
    alternative: {
      label: '5-4-3-2-1 eyes-open grounding',
      detail: 'Better than breathwork if focusing on breathing makes you feel tighter.',
      duration: '3 min',
      target: { to: '/calm/ground' },
    },
  },
  {
    id: 'frozen',
    label: 'Frozen or avoiding a task',
    method: 'Micro-start (behavioural activation)',
    why: 'Perfectionism and avoidance make a task feel enormous before you start. Committing to five rough minutes lowers the wall—momentum usually follows action, not the other way round.',
    byTime: {
      short: {
        label: '5-minute tiny start',
        detail: 'Pick one embarrassingly small first step—you can stop after 5 minutes.',
        duration: '5 min',
        target: { to: '/focus' },
      },
      medium: {
        label: '15-minute steady focus',
        detail: 'One intention, an optional 3-breath arrival, and thought parking.',
        duration: '15 min',
        target: { to: '/focus' },
      },
      long: {
        label: '25-minute steady focus',
        detail: 'Work steadily with gentle drift returns and mid-session support.',
        duration: '25 min',
        target: { to: '/focus' },
      },
    },
    alternative: {
      label: '2-minute box breathing first',
      detail: 'Settle jittery energy for two minutes before starting the task.',
      duration: '2 min',
      target: { to: '/calm/breathe' },
    },
  },
  {
    id: 'critic',
    label: 'Beating myself up / harsh inner voice',
    method: 'Self-compassion & RAIN',
    why: 'Harsh self-criticism sets off the same threat alarm as an outside attack, making loops worse. Speaking plainly—"this is hard"—calms the nervous system without excusing anything.',
    byTime: {
      short: {
        label: 'RAIN pause for a hard moment',
        detail: 'Recognise, allow, feel where it sits, and meet yourself plainly.',
        duration: '4 min',
        target: {
          to: '/session/$sessionId',
          params: { sessionId: 'rain-pause' },
        },
      },
      medium: {
        label: 'Kindness toward yourself',
        detail: 'Offer yourself the steadiness and patience you would give a friend.',
        duration: '10 min',
        target: { to: '/session/$sessionId', params: { sessionId: 'kindness' } },
      },
      long: {
        label: 'Open awareness, longer',
        detail: 'Watch harsh thoughts pass like weather without joining the verdict.',
        duration: '14 min',
        target: {
          to: '/session/$sessionId',
          params: { sessionId: 'open-awareness-long' },
        },
      },
    },
    alternative: {
      label: 'Step back from a sticky thought',
      detail: 'Hear the inner critic like a radio playing in the next room.',
      duration: '6 min',
      target: { to: '/session/$sessionId', params: { sessionId: 'defusion' } },
    },
  },
  {
    id: 'night',
    label: "Can't switch off / late-night mind",
    method: 'Cognitive offload & somatic unwind',
    why: 'At night the mind tries to hold tomorrow’s unfinished worries in memory. Placing them aside and resting in physical heaviness lets the body downshift without forcing sleep.',
    byTime: {
      short: {
        label: 'Longer exhale breathing',
        detail: 'Two minutes of unhurried 4-in, 6-out breaths to downshift.',
        duration: '2 min',
        target: { to: '/calm/breathe' },
      },
      medium: {
        label: 'Set the day down',
        detail: 'Place tomorrow’s worries on a shelf and settle into physical weight.',
        duration: '7 min',
        target: {
          to: '/session/$sessionId',
          params: { sessionId: 'evening-unwind' },
        },
      },
      long: {
        label: 'Body scan',
        detail: 'Slowly move attention from feet to head while lying still.',
        duration: '8 min',
        target: { to: '/session/$sessionId', params: { sessionId: 'body-scan' } },
      },
    },
    alternative: {
      label: 'Park tomorrow’s thoughts',
      detail: 'Write a nagging reminder in one line so your head does not have to hold it.',
      duration: '1 min',
      target: { to: '/focus' },
    },
  },
]

/** Plain-language principles behind the self-help tools in Charioteer. */
export const HOW_IT_WORKS: { title: string; detail: string }[] = [
  {
    title: 'Wandering is not failure',
    detail:
      'Meditation is not about emptying your mind. Each time you notice you drifted and gently come back, that single return is one repetition of the skill.',
  },
  {
    title: 'Waiting weakens urges',
    detail:
      'Checking, fixing, or asking for reassurance brings brief relief that convinces the brain the alarm was real. Waiting without acting lets the wave rise and fade on its own.',
  },
  {
    title: 'Start smaller than motivation',
    detail:
      'When anxiety freezes you, waiting to feel ready rarely works. Five rough minutes on one tiny physical step breaks avoidance faster than planning.',
  },
  {
    title: 'Eyes-open grounding is always valid',
    detail:
      'Closing your eyes or watching the breath can sometimes intensify panic. Anchoring in what you see, feel, and hear in the room is an equally valid reset.',
  },
]
