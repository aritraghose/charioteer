import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'
import { Page } from '@/components/page'
import { ThoughtParking } from '@/components/thought-parking'
import { TimerRing } from '@/components/timer-ring'
import { Button } from '@/components/ui/button'
import { useStored } from '@/hooks/use-stored'
import { unlockBell } from '@/lib/bell'
import { devSpeed } from '@/lib/dev-speed'
import {
  type ActiveFocus,
  FOCUS_ACTIVE_KEY,
  FOCUS_MINUTES,
  clockLabel,
} from '@/lib/focus-store'
import { NAV_ITEMS } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/focus')({
  head: () => ({
    meta: seo({
      title: `Focus | ${SITE_NAME}`,
      description: NAV_ITEMS[2].description,
    }),
  }),
  component: FocusPage,
})

const MAX_INTENTION = 80

function FocusPage() {
  const navigate = useNavigate()
  const [minutes, setMinutes] = useStored<number>('focus-minutes', 25)
  const [active, setActive] = useStored<ActiveFocus | null>(
    FOCUS_ACTIVE_KEY,
    null,
  )
  const [intention, setIntention] = useState('')

  const start = (event: FormEvent) => {
    event.preventDefault()
    unlockBell()
    const now = Date.now()
    const totalMs = (minutes * 60_000) / devSpeed()
    setActive({
      intention: intention.trim() || 'One thing at a time',
      minutes,
      totalMs,
      startedAt: now,
      endsAt: now + totalMs,
      pausedRemainingMs: null,
      returns: 0,
    })
    void navigate({ to: '/focus/now' })
  }

  return (
    <Page
      title="Focus"
      lede={NAV_ITEMS[2].description}
      icon={NAV_ITEMS[2].icon}
      badgeClass={NAV_ITEMS[2].badgeClass}
    >
      <section className="grid overflow-hidden rounded-[28px] border border-border bg-card shadow-(--surface-shadow) sm:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={start}
          className="flex flex-col items-center gap-6 bg-(image:--grad-sanctuary) p-7 text-center sm:border-r sm:border-border sm:p-8"
        >
          <TimerRing progress={1}>
            <p className="text-4xl font-medium tracking-[-0.04em] text-foreground tabular-nums">
              {clockLabel(minutes * 60_000)}
            </p>
          </TimerRing>

          <fieldset disabled={!!active} className="flex flex-col gap-2">
            <legend className="sr-only">Session length</legend>
            <div className="flex gap-2">
              {FOCUS_MINUTES.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={minutes === option}
                  onClick={() => setMinutes(option)}
                  className={cn(
                    'cursor-pointer rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-surface-blush-hover disabled:cursor-default',
                    minutes === option &&
                      'border-primary bg-pink-soft text-pink-ink',
                  )}
                >
                  {option} min
                </button>
              ))}
            </div>
          </fieldset>

          {active ? (
            <div className="flex w-full flex-col items-center gap-3">
              <p className="max-w-[26ch] text-sm leading-relaxed text-pretty text-muted-foreground">
                A session is already going: {active.intention}
              </p>
              <Button asChild className="h-11 w-full rounded-full text-base">
                <Link to="/focus/now">Go back to it</Link>
              </Button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-3">
              <label htmlFor="intention" className="sr-only">
                Your one intention
              </label>
              <input
                id="intention"
                value={intention}
                onChange={(event) => setIntention(event.target.value)}
                maxLength={MAX_INTENTION}
                autoComplete="off"
                placeholder="What is the one thing?"
                className="h-11 w-full rounded-full border border-input bg-card px-4 text-center text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              />
              <Button type="submit" className="h-11 w-full rounded-full text-base">
                Start focusing
              </Button>
            </div>
          )}
        </form>

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium tracking-[-0.02em] text-foreground">
              Thought parking
            </h2>
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
              When an intrusive or urgent thought arrives, set it down in one
              line so you do not have to hold it in your head or act on it
              right away.
            </p>
          </div>
          <ThoughtParking
            className="border-t border-border/80 pt-5"
            emptyText="Nothing parked. Tick a thought off once you have dealt with it or no longer need it."
          />
        </div>
      </section>

      <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground">
        Your intention and parked thoughts stay on this device. A soft bell
        marks the end of a session, and there are no alarms.
      </p>
    </Page>
  )
}
