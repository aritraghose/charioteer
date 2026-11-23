import type { Session, SessionStep } from '@/content/sessions-types'

/**
 * The core practice for each week of the foundation course. Week 1 uses the
 * short "Steady breath anchor" session, so it is not repeated here.
 *
 * The same writing rules apply as for every session: notice, name, don't
 * answer, return. Wandering is never a mistake, and eyes can stay open.
 */

const arrive: SessionStep[] = [
  {
    kind: 'say',
    text: 'Settle into a position you can hold for a while. Eyes open or closed.',
    seconds: 10,
  },
  {
    kind: 'breathe',
    text: 'Three slower breaths to arrive.',
    cycles: 3,
    inhale: 4,
    exhale: 6,
  },
]

export const COURSE_SESSIONS: Session[] = [
  {
    id: 'body-scan',
    title: 'Body scan',
    note: 'Move attention slowly through the body, noticing without fixing.',
    intro:
      'You move attention through the body from the feet to the head. There is nothing to relax or fix. You are only noticing what is there.',
    pill: 'bg-yellow-soft text-yellow-ink',
    steps: [
      {
        kind: 'say',
        text: 'Sit or lie down. Eyes open or closed.',
        seconds: 10,
      },
      arrive[1],
      {
        kind: 'say',
        text: 'We will move attention slowly through the body. Nothing to fix or relax. Only noticing.',
        seconds: 12,
      },
      {
        kind: 'rest',
        text: 'Feet and toes. Whatever is there: warmth, pressure, or nothing at all.',
        seconds: 45,
      },
      { kind: 'rest', text: 'Lower legs and knees.', seconds: 45 },
      {
        kind: 'rest',
        text: 'Thighs and hips. The weight of the body where it rests.',
        seconds: 45,
      },
      {
        kind: 'say',
        text: 'If the mind has wandered, that is fine. Come back to the part we are on.',
        seconds: 10,
      },
      {
        kind: 'rest',
        text: 'Belly and lower back. The breath moving here.',
        seconds: 45,
      },
      { kind: 'rest', text: 'Chest and upper back.', seconds: 45 },
      {
        kind: 'rest',
        text: 'Hands, arms and shoulders. Let the shoulders be however they are.',
        seconds: 45,
      },
      { kind: 'rest', text: 'Neck, jaw, face and scalp.', seconds: 45 },
      {
        kind: 'say',
        text: 'Now the whole body at once, sitting and breathing.',
        seconds: 10,
      },
      { kind: 'rest', text: 'The whole body, as it is.', seconds: 60 },
      {
        kind: 'say',
        text: 'Take a deeper breath. Move your fingers and toes.',
        seconds: 10,
      },
      {
        kind: 'say',
        text: 'Done. You spent this time in the body instead of in thought.',
        seconds: 8,
      },
    ],
  },
  {
    id: 'counting-returns',
    title: 'Counting returns',
    note: 'Say "back" each time you notice the mind has wandered.',
    intro:
      'Each time you notice the mind has wandered, you say "back" quietly and return to the breath. A busy mind just gives you more repetitions.',
    pill: 'bg-peach-soft text-peach-ink',
    steps: [
      ...arrive,
      {
        kind: 'say',
        text: 'Today you count returns. Each time you notice the mind has wandered, say "back" quietly and return to the breath.',
        seconds: 14,
      },
      { kind: 'rest', text: 'Breath. When you drift: "back".', seconds: 100 },
      {
        kind: 'say',
        text: 'There is no good or bad number. A busy mind just gives you more repetitions.',
        seconds: 12,
      },
      { kind: 'rest', text: 'Notice. "Back." Breath.', seconds: 120 },
      {
        kind: 'say',
        text: 'Notice how you come back. If there is a harsh voice, soften it. A plain "back" is enough.',
        seconds: 12,
      },
      { kind: 'rest', text: 'Gently: "back".', seconds: 130 },
      {
        kind: 'say',
        text: 'The moment of noticing is the moment you are awake. That moment is the skill.',
        seconds: 12,
      },
      {
        kind: 'rest',
        text: 'Breath. Drift. Notice. Back.',
        seconds: 130,
      },
      {
        kind: 'say',
        text: 'Let the breath go. Notice the room around you.',
        seconds: 10,
      },
      {
        kind: 'say',
        text: 'Done. Every "back" was one repetition.',
        seconds: 8,
      },
    ],
  },
  {
    id: 'naming-thoughts',
    title: 'Naming thoughts',
    note: 'Give a thought a one-word name, leave it unanswered, and come back.',
    intro:
      'When a thought pulls you away, you give it a one-word name such as "planning" or "worrying", and return to the breath. You name the kind of thought, not what it says.',
    pill: 'bg-pink-soft text-pink-ink',
    steps: [
      ...arrive,
      {
        kind: 'say',
        text: 'Today you give thoughts a one-word name when they pull you away. "Planning." "Worrying." "Remembering." "Judging."',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'Breath. When a thought pulls: name it, come back.',
        seconds: 100,
      },
      {
        kind: 'say',
        text: 'Name the kind of thought, not what it says. You do not need to work out whether it is true.',
        seconds: 14,
      },
      { kind: 'rest', text: 'One word. Then the breath.', seconds: 120 },
      {
        kind: 'say',
        text: 'If the same thought returns, give it the same name. "Worrying" again. It needs no answer.',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'Name it. Leave it unanswered. Breath.',
        seconds: 130,
      },
      {
        kind: 'say',
        text: 'If no word fits, "thinking" always works.',
        seconds: 12,
      },
      { kind: 'rest', text: 'Thinking. Back to the breath.', seconds: 120 },
      {
        kind: 'say',
        text: 'Let the breath go. Notice the sounds in the room.',
        seconds: 10,
      },
      {
        kind: 'say',
        text: 'Done. You named thoughts without following them.',
        seconds: 8,
      },
    ],
  },
  {
    id: 'letting-it-be',
    title: 'Letting it be',
    note: 'Stay with an uncomfortable feeling or urge without fixing it.',
    intro:
      'You practise staying with something uncomfortable, such as an itch, restlessness or an urge, without fixing it. You can open your eyes and return to the breath at any point.',
    pill: 'bg-yellow-soft text-yellow-ink',
    steps: [
      ...arrive,
      {
        kind: 'say',
        text: 'Today you practise staying with something uncomfortable without fixing it. An itch, restlessness, an urge to move or check.',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'Rest on the breath until something uncomfortable shows up.',
        seconds: 100,
      },
      {
        kind: 'say',
        text: 'When it does, turn toward it. Where is it in the body? Tight, hot, buzzing? Let the breath continue around it.',
        seconds: 16,
      },
      { kind: 'rest', text: 'Feel it. Do nothing about it yet.', seconds: 130 },
      {
        kind: 'say',
        text: 'Sensations and urges rise, peak and fade when they are left alone. You are watching that happen.',
        seconds: 16,
      },
      { kind: 'rest', text: 'Let it rise. Let it change.', seconds: 140 },
      {
        kind: 'say',
        text: 'If it becomes too much, open your eyes, feel your feet, and come back to the breath. That is always allowed.',
        seconds: 14,
      },
      {
        kind: 'rest',
        text: 'Stay with what is here, or rest on the breath.',
        seconds: 130,
      },
      {
        kind: 'say',
        text: 'Notice what the discomfort is like now, compared with when it began.',
        seconds: 12,
      },
      { kind: 'rest', text: 'The whole body, breathing.', seconds: 60 },
      {
        kind: 'say',
        text: 'Take a deeper breath. Move if you want to.',
        seconds: 10,
      },
      {
        kind: 'say',
        text: 'Done. You stayed, and it changed without you fixing it.',
        seconds: 10,
      },
    ],
  },
  {
    id: 'kindness',
    title: 'Kindness toward yourself',
    note: 'Offer yourself the patience you would offer a friend.',
    intro:
      'You offer a few kind words to yourself, and then to someone else who struggles. It can feel awkward at first. You are only offering the words, not forcing a feeling.',
    pill: 'bg-peach-soft text-peach-ink',
    steps: [
      ...arrive,
      {
        kind: 'say',
        text: 'Today is kindness toward yourself. It may feel awkward. That is fine. You are only offering the words.',
        seconds: 14,
      },
      {
        kind: 'say',
        text: 'Bring to mind how hard your mind has been working lately. The worry, the checking, the effort.',
        seconds: 12,
      },
      { kind: 'rest', text: 'Notice how that feels in the body.', seconds: 60 },
      {
        kind: 'say',
        text: 'Silently offer these words to yourself: "This is hard. Many people struggle like this. May I be patient with myself."',
        seconds: 16,
      },
      {
        kind: 'rest',
        text: 'This is hard. May I be patient with myself.',
        seconds: 110,
      },
      {
        kind: 'say',
        text: 'If the mind argues, or says you do not deserve it, name that "judging" and offer the words again.',
        seconds: 14,
      },
      { kind: 'rest', text: 'May I be patient with myself.', seconds: 120 },
      {
        kind: 'say',
        text: 'Now think of someone else who struggles with their mind. Offer them the same: "May you be patient with yourself."',
        seconds: 14,
      },
      { kind: 'rest', text: 'May you be patient with yourself.', seconds: 100 },
      {
        kind: 'say',
        text: 'And back to you. Rest one hand on your chest if that feels all right.',
        seconds: 12,
      },
      { kind: 'rest', text: 'May I be patient with myself.', seconds: 100 },
      {
        kind: 'say',
        text: 'Take a deeper breath. Feel your feet.',
        seconds: 10,
      },
      {
        kind: 'say',
        text: 'Done. You spoke to yourself the way you would to a friend.',
        seconds: 10,
      },
    ],
  },
  {
    id: 'your-own-practice',
    title: 'Your own practice',
    note: 'Long quiet stretches with your own choice of anchor.',
    intro:
      'This is mostly quiet. You choose the anchor, whether breath, body, sounds or open awareness, and use what the earlier weeks taught you.',
    pill: 'bg-pink-soft text-pink-ink',
    steps: [
      ...arrive,
      {
        kind: 'say',
        text: 'This is your own practice now. Choose an anchor: the breath, the body, sounds, or open awareness. You know how each works.',
        seconds: 16,
      },
      { kind: 'rest', text: 'Rest with your anchor.', seconds: 240 },
      {
        kind: 'say',
        text: 'Wandered? You know what to do. Notice, name it if that helps, and come back.',
        seconds: 12,
      },
      { kind: 'rest', text: 'Notice. Return.', seconds: 270 },
      {
        kind: 'say',
        text: 'If something uncomfortable is here, you can stay with it or rest on the anchor. Either is practice.',
        seconds: 12,
      },
      { kind: 'rest', text: 'Stay, or return.', seconds: 270 },
      {
        kind: 'say',
        text: 'A little kindness for the mind that keeps wandering. It is doing what minds do.',
        seconds: 10,
      },
      { kind: 'rest', text: 'Rest with your anchor.', seconds: 240 },
      {
        kind: 'say',
        text: 'Let go of the anchor. Sit for a moment with nothing to do.',
        seconds: 12,
      },
      { kind: 'rest', text: 'Nothing to do.', seconds: 40 },
      {
        kind: 'say',
        text: 'Done. Eight weeks of coming back. The practice is yours to keep.',
        seconds: 12,
      },
    ],
  },
]
