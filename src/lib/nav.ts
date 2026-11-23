import { BookOpen, House, Timer, Waves, Wind } from 'lucide-react'

export const NAV_ITEMS = [
  {
    to: '/',
    label: 'Today',
    gradient: 'bg-(image:--grad-active)',
    icon: House,
    description: 'Where you start.',
  },
  {
    to: '/practice',
    label: 'Practice',
    gradient: 'bg-(image:--grad-practice)',
    icon: Wind,
    description: 'Guided meditation, from five minutes up.',
  },
  {
    to: '/focus',
    label: 'Focus',
    gradient: 'bg-(image:--grad-focus)',
    icon: Timer,
    description: 'One task, one timer, and a place to park stray thoughts.',
  },
  {
    to: '/gita',
    label: 'Gita',
    gradient: 'bg-(image:--grad-gita)',
    icon: BookOpen,
    description: 'The Bhagavad Gita, read from the Sanskrit, word by word.',
  },
] as const

/** Always in reach: help for the moment thoughts will not stop. */
export const CALM_ITEM = {
  to: '/calm',
  label: 'Mind racing?',
  shortLabel: 'Calm',
  gradient: 'bg-(image:--grad-calm)',
  icon: Waves,
  description: 'A few minutes to step out of a thought loop.',
} as const
