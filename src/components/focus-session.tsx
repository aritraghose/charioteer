import { Link } from '@tanstack/react-router'
import { Pause, Play, Undo2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { QuietScreen } from '@/components/quiet-screen'
import { ThoughtParking } from '@/components/thought-parking'
import { TimerRing } from '@/components/timer-ring'
import { Button } from '@/components/ui/button'
import { useStored } from '@/hooks/use-stored'
import { ringBell, unlockBell } from '@/lib/bell'
import {
  type ActiveFocus,
  FOCUS_ACTIVE_KEY,
  clockLabel,
  logFocus,
  remainingMs,
} from '@/lib/focus-store'

const bigButton = 'h-12 rounded-full px-7 text-base'

type Summary = {
  intention: string
  focusedMinutes: number
  returns: number
  completed: boolean
  startedAt: number
}

export function FocusSession() {
  const [active, setActive, loaded] = useStored<ActiveFocus | null>(
    FOCUS_ACTIVE_KEY,
    null,
  )
  const [now, setNow] = useState(() => Date.now())
  const [summary, setSummary] = useState<Summary | null>(null)
  const finishedRef = useRef(false)

  const paused = active?.pausedRemainingMs != null
  const left = active ? remainingMs(active, now) : 0

  const finish = (session: ActiveFocus, completed: boolean) => {
    if (finishedRef.current) return
    finishedRef.current = true
    const focusedMs = session.totalMs - remainingMs(session, Date.now())
    // Scale back up so a dev speed-up still reports the chosen length.
    const share = Math.min(1, Math.max(0, focusedMs / session.totalMs))
    const focusedSeconds = Math.round(share * session.minutes * 60)
    if (completed) ringBell()
    logFocus({
      at: new Date().toISOString(),
      intention: session.intention,
      minutes: session.minutes,
      focusedSeconds,
      completed,
      returns: session.returns,
    })
    setSummary({
      intention: session.intention,
      focusedMinutes: Math.round(focusedSeconds / 60),
      returns: session.returns,
      completed,
      startedAt: session.startedAt,
    })
    setActive(null)
  }

  // The session runs on the clock, so it still ends on time in a background
  // tab or with the phone locked.
  useEffect(() => {
    if (!active || paused) return
    const check = () => {
      const current = Date.now()
      setNow(current)
      if (remainingMs(active, current) <= 0) finish(active, true)
    }
    check()
    const interval = window.setInterval(check, 250)
    document.addEventListener('visibilitychange', check)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', check)
    }
    // `finish` only reads refs and the session passed to it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused])

  if (summary) {
    return (
      <QuietScreen leaveTo="/focus" leaveLabel="Focus">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl leading-[1.06] font-medium tracking-[-0.036em] text-balance sm:text-5xl">
            {summary.completed ? 'Session complete.' : 'Ended early.'}
          </h1>
          <p className="max-w-[44ch] text-lg leading-relaxed text-pretty text-muted-foreground">
            {summary.focusedMinutes < 1
              ? 'Less than a minute'
              : summary.focusedMinutes === 1
                ? '1 minute'
                : `${summary.focusedMinutes} minutes`}{' '}
            with: {summary.intention}.
            {summary.returns > 0 &&
              ` You drifted and came back ${summary.returns === 1 ? 'once' : `${summary.returns} times`}. Each one counts.`}
            {!summary.completed &&
              ' Stopping is fine. What you did still counts.'}
          </p>
        </div>
        <div className="flex w-full max-w-md flex-col gap-3">
          <h2 className="text-sm font-medium text-pink-ink">
            Parked while you worked
          </h2>
          <ThoughtParking
            since={summary.startedAt}
            emptyText="Nothing was parked this session."
          />
        </div>
        <Button asChild className={bigButton}>
          <Link to="/focus">Back to Focus</Link>
        </Button>
      </QuietScreen>
    )
  }

  if (!loaded) return <QuietScreen leaveTo="/focus">{null}</QuietScreen>

  if (!active) {
    return (
      <QuietScreen leaveTo="/focus" leaveLabel="Focus">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl leading-[1.12] font-medium tracking-[-0.03em] text-balance sm:text-4xl">
            No focus session is running.
          </h1>
          <p className="max-w-[40ch] text-lg leading-relaxed text-pretty text-muted-foreground">
            Pick one thing and a length, and start from the Focus page.
          </p>
        </div>
        <Button asChild className={bigButton}>
          <Link to="/focus">Go to Focus</Link>
        </Button>
      </QuietScreen>
    )
  }

  const pause = () => {
    unlockBell()
    setActive({ ...active, endsAt: null, pausedRemainingMs: left })
  }
  const resume = () => {
    unlockBell()
    const current = Date.now()
    setNow(current)
    setActive({
      ...active,
      endsAt: current + (active.pausedRemainingMs ?? 0),
      pausedRemainingMs: null,
    })
  }
  const cameBack = () => {
    unlockBell()
    setActive({ ...active, returns: active.returns + 1 })
  }

  return (
    <QuietScreen
      leaveTo="/focus"
      leaveLabel="Focus"
      footer={
        <div className="flex items-center gap-3">
          {paused ? (
            <Button className={bigButton} onClick={resume}>
              <Play aria-hidden className="size-4" />
              Resume
            </Button>
          ) : (
            <Button variant="outline" className={bigButton} onClick={pause}>
              <Pause aria-hidden className="size-4" />
              Pause
            </Button>
          )}
          <Button
            variant="ghost"
            className="h-12 rounded-full px-6 text-base"
            onClick={() => finish(active, false)}
          >
            End session
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-3">
        <p className="h-5 text-sm font-medium text-pink-ink">
          {paused ? 'Paused' : 'Focusing on'}
        </p>
        <h1 className="max-w-[24ch] text-2xl leading-snug font-medium tracking-[-0.02em] text-balance break-words sm:text-3xl">
          {active.intention}
        </h1>
      </div>

      <TimerRing progress={left / active.totalMs} className="size-56 sm:size-64">
        <p
          role="timer"
          className="text-5xl font-medium tracking-[-0.04em] tabular-nums sm:text-6xl"
        >
          {clockLabel(left)}
        </p>
      </TimerRing>

      <div className="flex flex-col items-center gap-2">
        <Button
          variant="outline"
          className="h-11 rounded-full px-6 text-base"
          onClick={cameBack}
        >
          <Undo2 aria-hidden className="size-4" />I drifted and came back
        </Button>
        <p aria-live="polite" className="h-5 text-sm text-muted-foreground">
          {active.returns > 0 &&
            `Came back ${active.returns === 1 ? 'once' : `${active.returns} times`}. Each one counts.`}
        </p>
      </div>

      <ThoughtParking
        since={active.startedAt}
        className="w-full max-w-md"
        emptyText="A thought pulling at you? Set it down here and go back to your one thing."
      />
    </QuietScreen>
  )
}
