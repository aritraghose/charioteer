import { cn } from '@/lib/utils'

const VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/** A 0 to 10 scale picked with one tap. */
export function RatingScale({
  label,
  value,
  onChange,
  lowLabel = 'None',
  highLabel = 'The worst',
  className,
}: Readonly<{
  label: string
  value: number | null
  onChange: (value: number) => void
  lowLabel?: string
  highLabel?: string
  className?: string
}>) {
  return (
    <fieldset className={cn('flex flex-col gap-2', className)}>
      <legend className="sr-only">{label}</legend>
      <div className="flex flex-wrap justify-center gap-1.5">
        {VALUES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            aria-label={`${option} out of 10`}
            onClick={() => onChange(option)}
            className={cn(
              'flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-sm font-medium tabular-nums transition-colors hover:bg-surface-blush-hover',
              value === option && 'border-primary bg-pink-soft text-pink-ink',
            )}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 {lowLabel}</span>
        <span>10 {highLabel}</span>
      </div>
    </fieldset>
  )
}
