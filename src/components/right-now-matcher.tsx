import { Link } from '@tanstack/react-router'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  GUIDANCE_CATEGORIES,
  type GuidanceTarget,
  TIME_BUDGETS,
  type TimeBudget,
} from '@/content/guidance'
import { cn } from '@/lib/utils'

function TargetLink({
  target,
  className,
  children,
}: Readonly<{
  target: GuidanceTarget
  className?: string
  children: React.ReactNode
}>) {
  if (target.to === '/session/$sessionId') {
    return (
      <Link
        to="/session/$sessionId"
        params={target.params}
        className={className}
      >
        {children}
      </Link>
    )
  }
  return (
    <Link to={target.to} className={className}>
      {children}
    </Link>
  )
}

/**
 * Stateless, zero-personal-data matcher: pick what feels loudest right now
 * and how much time you have, and get one evidence-based practice plus a
 * plain-English note on why it works.
 */
export function RightNowMatcher({
  className,
}: Readonly<{ className?: string }>) {
  const [selectedId, setSelectedId] = useState<string>(
    GUIDANCE_CATEGORIES[0].id,
  )
  const [time, setTime] = useState<TimeBudget>('short')
  const [showWhy, setShowWhy] = useState(false)

  const category =
    GUIDANCE_CATEGORIES.find((item) => item.id === selectedId) ??
    GUIDANCE_CATEGORIES[0]
  const match = category.byTime[time]

  return (
    <section
      aria-labelledby="matcher-heading"
      className={cn(
        'flex flex-col gap-6 rounded-[28px] border border-border bg-(image:--grad-sanctuary) p-6 shadow-(--surface-shadow) sm:p-8',
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h2
          id="matcher-heading"
          className="text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl"
        >
          What feels loudest right now?
        </h2>
        <p className="max-w-[54ch] text-sm leading-relaxed text-pretty text-muted-foreground">
          Pick the closest match—nothing is typed or saved. It will point you to
          one grounded method that fits this moment.
        </p>
      </div>

      {/* Step 1: Predefined states */}
      <fieldset className="flex flex-col gap-2.5">
        <legend className="sr-only">What is happening right now</legend>
        <div className="flex flex-wrap gap-2">
          {GUIDANCE_CATEGORIES.map((item) => {
            const active = item.id === category.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSelectedId(item.id)
                  setShowWhy(false)
                }}
                className={cn(
                  'cursor-pointer rounded-full border border-border bg-card px-4 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-surface-blush-hover',
                  active && 'border-primary bg-pink-soft text-pink-ink',
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Step 2: Optional time budget */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Time you have
        </span>
        <div
          role="group"
          aria-label="Time you have"
          className="flex rounded-full border border-border bg-card p-0.5"
        >
          {TIME_BUDGETS.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={time === option.key}
              onClick={() => setTime(option.key)}
              className={cn(
                'cursor-pointer rounded-full px-3.5 py-1 text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground sm:text-sm',
                time === option.key && 'bg-pink-soft text-pink-ink',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matched recommendation card */}
      <div
        aria-live="polite"
        className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-pink-ink">
            {category.method}
          </span>
          <span className="rounded-full bg-yellow-soft px-3 py-0.5 text-xs font-medium text-yellow-ink ring-1 ring-border">
            {match.duration}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-medium tracking-[-0.02em] text-foreground">
            {match.label}
          </h3>
          <p className="max-w-[50ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            {match.detail}
          </p>
        </div>

        {category.caution && (
          <p className="max-w-[54ch] border-l-2 border-primary/50 pl-3.5 text-xs leading-relaxed text-pretty text-muted-foreground sm:text-sm">
            {category.caution}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button asChild className="h-11 rounded-full px-6 text-sm sm:text-base">
            <TargetLink target={match.target}>
              Start this practice
              <ChevronRight aria-hidden className="size-4" strokeWidth={2} />
            </TargetLink>
          </Button>
          <TargetLink
            target={category.alternative.target}
            className="inline-flex h-11 items-center rounded-full border border-border bg-background/60 px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
          >
            Or: {category.alternative.label}
          </TargetLink>
        </div>

        {/* Optional plain-English psychoeducation */}
        <div className="border-t border-border/75 pt-3">
          <button
            type="button"
            aria-expanded={showWhy}
            onClick={() => setShowWhy((open) => !open)}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            <span>Why this works</span>
            <ChevronDown
              aria-hidden
              className={cn(
                'size-3.5 transition-transform duration-200 motion-reduce:transition-none',
                showWhy && 'rotate-180',
              )}
            />
          </button>
          {showWhy && (
            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-pretty text-muted-foreground">
              {category.why}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
