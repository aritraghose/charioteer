import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * The lamp that does not flicker in a windless place (Bhagavad Gita 6.19).
 * With `settle`, the flame wavers once when it appears and then holds still.
 */
export function Flame({
  className,
  settle = false,
}: Readonly<{ className?: string; settle?: boolean }>) {
  const gradientId = useId()

  return (
    <svg
      viewBox="0 0 28 36"
      fill="none"
      aria-hidden
      className={cn('h-8 w-auto', className)}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="14"
          y1="2"
          x2="14"
          y2="27"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--flame-top)" />
          <stop offset="58%" stopColor="var(--flame)" />
          <stop offset="100%" stopColor="var(--flame)" />
        </linearGradient>
      </defs>
      <g className={cn(settle && 'flame-settle')}>
        <path
          d="M14 2.2C14 2.2 22.5 11.1 22.5 17.8C22.5 22.5 18.7 26.3 14 26.3C9.3 26.3 5.5 22.5 5.5 17.8C5.5 11.1 14 2.2 14 2.2Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M14 11.6C14 11.6 18 16 18 19.3C18 21.5 16.2 23.3 14 23.3C11.8 23.3 10 21.5 10 19.3C10 16 14 11.6 14 11.6Z"
          className="fill-flame-core"
        />
      </g>
      <path
        d="M7 31.2H21"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
