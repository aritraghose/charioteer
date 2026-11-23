/**
 * The eight-week foundation course. Each week has one core practice, done on
 * as many days as the person manages, and one small thing to try in daily
 * life. The order follows the structure of the clinically studied eight-week
 * mindfulness programmes: anchor, body, returning, naming, staying, opening,
 * kindness, independence.
 */

export type CourseWeek = {
  week: number
  title: string
  /** What this week trains and why, in two or three sentences. */
  theme: string
  /** The core session for the week. */
  sessionId: string
  /** One small practice for ordinary moments. */
  daily: string
}

export const COURSE: CourseWeek[] = [
  {
    week: 1,
    title: 'Arriving',
    theme:
      'You learn the basic move: rest attention on the breath, notice when it has wandered, and come back. Wandering is expected. The coming back is what you are training.',
    sessionId: 'breath-anchor',
    daily:
      'Once a day, take three slow breaths before you start something: a meal, a message, a task.',
  },
  {
    week: 2,
    title: 'The body',
    theme:
      'Racing thoughts pull you up into your head. This week you practise moving attention through the body, which gives the mind somewhere steady to stand.',
    sessionId: 'body-scan',
    daily:
      'When you notice you are lost in thought, feel your feet on the floor for one breath.',
  },
  {
    week: 3,
    title: 'Coming back',
    theme:
      'You count returns instead of distractions. A mind that wanders fifty times gives you fifty repetitions, so there is no way to fail this week.',
    sessionId: 'counting-returns',
    daily:
      'While doing one ordinary thing, such as washing up or walking, say "back" whenever you notice you have drifted.',
  },
  {
    week: 4,
    title: 'Naming',
    theme:
      'You give thoughts a one-word name, such as "planning" or "worrying", and leave them unanswered. Naming the kind of thought loosens its grip without arguing with what it says.',
    sessionId: 'naming-thoughts',
    daily:
      'When a thought keeps returning during the day, name it once and carry on with what you were doing.',
  },
  {
    week: 5,
    title: 'Letting it be',
    theme:
      'You practise staying with discomfort and urges without fixing them. Left alone, they rise, peak and fade. Seeing that for yourself is what weakens the urge to react.',
    sessionId: 'letting-it-be',
    daily:
      'Once a day, when you feel a small urge such as checking your phone, wait one minute and watch what the urge does.',
  },
  {
    week: 6,
    title: 'Opening up',
    theme:
      'With no single anchor, you notice sounds, sensations and thoughts as they come and go. Thoughts become one more thing passing through, not something you have to follow.',
    sessionId: 'open-awareness-long',
    daily:
      'Pause once a day and notice three sounds, two sensations and one thought, without doing anything about them.',
  },
  {
    week: 7,
    title: 'Kindness',
    theme:
      'A struggling mind often comes with a harsh inner voice. This week you practise speaking to yourself with the patience you would offer a friend.',
    sessionId: 'kindness',
    daily:
      'When you catch yourself being harsh with yourself, say "this is hard" once, and leave it there.',
  },
  {
    week: 8,
    title: 'Your own practice',
    theme:
      'The guidance steps back. You choose your anchor and sit through long quiet stretches, using everything from the earlier weeks. This is the practice you keep.',
    sessionId: 'your-own-practice',
    daily:
      'Decide when and where you will keep practising after this week. A small regular time works better than a long rare one.',
  },
]

export function getWeek(week: number) {
  return COURSE.find((item) => item.week === week)
}

/** Roughly how many days of practice a week is meant to have. */
export const DAYS_PER_WEEK = 7
