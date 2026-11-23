import { cn } from '@/lib/utils'

/**
 * The lamp that does not flicker in a windless place (Gita 6.19).
 * With `settle`, the flame wavers once when it appears and then holds still.
 */
export function Flame({
  className,
  settle = false,
}: Readonly<{ className?: string; settle?: boolean }>) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      aria-hidden
      className={cn('h-8 w-auto', className)}
    >
      <g className={cn(settle && 'flame-settle')}>
        <path
          d="M12 1.5s7.5 8.2 7.5 14.2a7.5 7.5 0 0 1-15 0C4.5 9.7 12 1.5 12 1.5Z"
          className="fill-flame"
        />
        <path
          d="M12 10s3.5 4 3.5 6.9a3.5 3.5 0 0 1-7 0C8.5 14 12 10 12 10Z"
          className="fill-flame-core"
        />
      </g>
      <path
        d="M12 23.4v4.1M4.5 27.5h15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
