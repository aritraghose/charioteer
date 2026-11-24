import { Check, Clock, Plus } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { useStored } from '@/hooks/use-stored'
import { ringBell, unlockBell } from '@/lib/bell'
import { devSpeed } from '@/lib/dev-speed'
import {
  PARKED_KEY,
  type ParkedThought,
  clockLabel,
  newParkedThought,
} from '@/lib/focus-store'
import { cn } from '@/lib/utils'

const MAX_LENGTH = 140
const WORRY_WINDOW_MINUTES = 5

/**
 * A place to set a thought down in one line so it does not have to be held in
 * the head or acted on right away. Optionally offers a bounded 5-minute review
 * ("worry window") so looking over parked worries never spirals.
 */
export function ThoughtParking({
  since,
  emptyText,
  allowWorryWindow = false,
  className,
}: Readonly<{
  /** Only show thoughts parked after this time (for the running session). */
  since?: number
  emptyText: string
  allowWorryWindow?: boolean
  className?: string
}>) {
  const [parked, setParked] = useStored<ParkedThought[]>(PARKED_KEY, [])
  const [draft, setDraft] = useState('')
  const [windowEndsAt, setWindowEndsAt] = useState<number | null>(null)
  const [windowDone, setWindowDone] = useState(false)
  const [now, setNow] = useState(0)

  const visible = since ? parked.filter((item) => item.at >= since) : parked

  useEffect(() => {
    if (windowEndsAt === null) return
    const check = () => {
      const current = Date.now()
      setNow(current)
      if (current >= windowEndsAt) {
        ringBell()
        setWindowEndsAt(null)
        setWindowDone(true)
      }
    }
    check()
    const timer = window.setInterval(check, 500)
    return () => window.clearInterval(timer)
  }, [windowEndsAt])

  const startWorryWindow = () => {
    unlockBell()
    const current = Date.now()
    setNow(current)
    setWindowDone(false)
    setWindowEndsAt(current + (WORRY_WINDOW_MINUTES * 60_000) / devSpeed())
  }

  const add = (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setParked((current) => [...current, newParkedThought(text)])
    setDraft('')
  }

  const leftMs = windowEndsAt ? Math.max(0, windowEndsAt - now) : 0

  return (
    <div className={cn('flex flex-col gap-4 text-left', className)}>
      <form onSubmit={add} className="flex items-center gap-2">
        <label htmlFor="park-thought" className="sr-only">
          Park a thought
        </label>
        <input
          id="park-thought"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={MAX_LENGTH}
          autoComplete="off"
          placeholder="Park a thought in one line"
          className="h-11 min-w-0 flex-1 rounded-full border border-input bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Park this thought"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:cursor-default disabled:opacity-40"
        >
          <Plus aria-hidden className="size-5" />
        </button>
      </form>

      {/* Bounded 5-minute worry review window */}
      {allowWorryWindow && windowEndsAt !== null && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-pink-soft px-4 py-3 text-xs sm:text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-pink-ink tabular-nums">
              Review window · {clockLabel(leftMs)} left
            </span>
            <span className="text-muted-foreground">
              Tick off what you can; stop when the bell sounds.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setWindowEndsAt(null)}
            className="shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground"
          >
            End
          </button>
        </div>
      )}

      {allowWorryWindow && windowDone && (
        <p className="rounded-2xl border border-border bg-card px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
          Review window finished. Set the rest aside until tomorrow’s window.
        </p>
      )}

      {visible.length === 0 ? (
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-1.5">
            {visible.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded-2xl bg-card py-1.5 pr-1.5 pl-4 text-sm ring-1 ring-border"
              >
                <span className="min-w-0 flex-1 break-words">{item.text}</span>
                <button
                  type="button"
                  aria-label={`Clear "${item.text}"`}
                  onClick={() =>
                    setParked((current) =>
                      current.filter((other) => other.id !== item.id),
                    )
                  }
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
                >
                  <Check aria-hidden className="size-4" />
                </button>
              </li>
            ))}
          </ul>

          {allowWorryWindow && windowEndsAt === null && (
            <button
              type="button"
              onClick={startWorryWindow}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
            >
              <Clock aria-hidden className="size-3.5" strokeWidth={1.9} />
              <span>Open 5-minute worry review</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
