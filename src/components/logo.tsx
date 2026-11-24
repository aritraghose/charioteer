import { useId } from 'react'
import { cn } from '@/lib/utils'

const ringHover =
  'transition-[stroke-opacity] duration-500 ease-out motion-reduce:transition-none'
const dotMotion =
  'origin-center transition-transform duration-500 ease-out [transform-box:fill-box] motion-reduce:transition-none'

/**
 * The Charioteer mark: a focused center dot with calm concentric rings.
 * With `settle`, the outer rings ease quietly into alignment around the still
 * center once on arrival, then rest.
 * With `interactive`, the rings pulse gently in and out all the time, and
 * brighten while a parent marked `group/logo` is hovered or pressed.
 * With `spin`, each ring opens a small gap and turns slowly around the dot,
 * the two rings in opposite directions.
 */
export function Logo({
  className,
  settle = false,
  interactive = false,
  spin = false,
}: Readonly<{
  className?: string
  settle?: boolean
  interactive?: boolean
  spin?: boolean
}>) {
  const dotGradientId = useId()

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn('size-6 shrink-0 overflow-visible', className)}
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
      {/* Turning, pulsing and settling each get their own layer so they combine. */}
      <g className={cn(spin && 'logo-spin')}>
        <g className={cn(interactive && 'logo-breathe')}>
          <circle
            cx="16"
            cy="16"
            r="14.2"
            stroke="var(--flame)"
            strokeOpacity="0.26"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeDasharray={spin ? '77.2 12' : undefined}
            className={cn(
              settle && 'ring-settle-outer',
              interactive &&
                cn(
                  ringHover,
                  'group-hover/logo:[stroke-opacity:0.5] group-active/logo:[stroke-opacity:0.65]',
                ),
            )}
          />
        </g>
      </g>
      <g className={cn(spin && 'logo-spin-reverse')}>
        <g className={cn(interactive && 'logo-breathe [animation-delay:-1.4s]')}>
          <circle
            cx="16"
            cy="16"
            r="9.4"
            stroke="var(--flame)"
            strokeOpacity="0.56"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={spin ? '50.5 8.56' : undefined}
            className={cn(
              settle && 'ring-settle-inner',
              interactive &&
                cn(
                  ringHover,
                  'group-hover/logo:[stroke-opacity:0.9] group-active/logo:[stroke-opacity:1]',
                ),
            )}
          />
        </g>
      </g>
      <circle
        cx="16"
        cy="16"
        r="4.3"
        fill={`url(#${dotGradientId})`}
        className={cn(
          interactive &&
            cn(
              dotMotion,
              'group-hover/logo:scale-[1.2] group-active/logo:scale-90',
            ),
        )}
      />
    </svg>
  )
}
