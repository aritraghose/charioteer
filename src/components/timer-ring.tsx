import { type ReactNode, useId } from 'react'
import { cn } from '@/lib/utils'

const RADIUS = 50
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** A quiet progress ring. `progress` runs from 0 (empty) to 1 (full). */
export function TimerRing({
  progress,
  className,
  children,
}: Readonly<{ progress: number; className?: string; children?: ReactNode }>) {
  const arcId = useId()
  const clamped = Math.min(1, Math.max(0, progress))

  return (
    <div
      className={cn(
        'relative flex size-40 shrink-0 items-center justify-center',
        className,
      )}
    >
      <svg
        viewBox="0 0 120 120"
        aria-hidden
        className="absolute inset-0 size-full -rotate-90"
      >
        <defs>
          <linearGradient id={arcId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--flame-top)" />
            <stop offset="100%" stopColor="var(--flame)" />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="7"
        />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={`url(#${arcId})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - clamped)}
          className="transition-[stroke-dashoffset] duration-300 ease-linear motion-reduce:transition-none"
        />
      </svg>
      <div className="relative">{children}</div>
    </div>
  )
}
