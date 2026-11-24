import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * The Charioteer mark: a focused center dot with calm concentric rings.
 * With `settle`, the outer rings ease quietly into alignment around the still
 * center once on arrival, then rest.
 */
export function Logo({
  className,
  settle = false,
}: Readonly<{ className?: string; settle?: boolean }>) {
  const dotGradientId = useId()

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn('size-6 shrink-0', className)}
    >
      <defs>
        <linearGradient
          id={dotGradientId}
          x1="11.5"
          y1="11.5"
          x2="20.5"
          y2="20.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--flame-top)" />
          <stop offset="100%" stopColor="var(--flame)" />
        </linearGradient>
      </defs>
      <circle
        cx="16"
        cy="16"
        r="14.2"
        stroke="var(--flame)"
        strokeOpacity="0.26"
        strokeWidth="1.25"
        className={cn(settle && 'ring-settle-outer')}
      />
      <circle
        cx="16"
        cy="16"
        r="9.4"
        stroke="var(--flame)"
        strokeOpacity="0.56"
        strokeWidth="1.5"
        className={cn(settle && 'ring-settle-inner')}
      />
      <circle cx="16" cy="16" r="4.3" fill={`url(#${dotGradientId})`} />
    </svg>
  )
}
