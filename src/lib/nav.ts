import { BookOpen, House, Timer, Waves, Wind } from 'lucide-react'

export const NAV_ITEMS = [
  {
    to: '/',
    label: 'Today',
    badgeClass: 'bg-pink-soft text-pink-ink',
    icon: House,
    description: 'Where you start.',
  },
  {
    to: '/practice',
    label: 'Practice',
    badgeClass: 'bg-pink-soft text-pink-ink',
    icon: Wind,
    description: 'Short, gentle guided meditations, from three minutes up.',
  },
  {
    to: '/focus',
    label: 'Focus',
    badgeClass: 'bg-yellow-soft text-yellow-ink',
    icon: Timer,
    description:
      'One intention, a calm timer, and a quiet place to park stray thoughts.',
  },
  {
    to: '/gita',
    label: 'Bhagavad Gita',
    badgeClass: 'bg-peach-soft text-peach-ink',
    icon: BookOpen,
    description:
      'Read the Bhagavad Gita word by word from the Sanskrit, for steadiness in daily life.',
  },
] as const

/** Always in reach: help for the moment thoughts will not stop. */
export const CALM_ITEM = {
  to: '/calm',
  label: 'Mind racing?',
  shortLabel: 'Calm',
  icon: Waves,
  description:
    'A few quiet minutes to step out of a thought loop and settle your nervous system.',
} as const
