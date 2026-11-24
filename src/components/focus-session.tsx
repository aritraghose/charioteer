import { Link } from '@tanstack/react-router'
import { Pause, Play, Undo2, Waves, Wind } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  BreathCircle,
  PHASE_LABEL,
  useBreathLoop,
} from '@/components/breath-circle'
import { QuietScreen } from '@/components/quiet-screen'
import { ThoughtParking } from '@/components/thought-parking'
import { TimerRing } from '@/components/timer-ring'
import { Button } from '@/components/ui/button'
import { useStored } from '@/hooks/use-stored'
import { ringBell, unlockBell } from '@/lib/bell'
import { devSpeed } from '@/lib/dev-speed'
import {
  type ActiveFocus,
  FOCUS_ACTIVE_KEY,
  clockLabel,
  logFocus,
  remainingMs,
} from '@/lib/focus-store'
import { cn } from '@/lib/utils'

const bigButton = 'h-12 rounded-full px-7 text-base'

type Summary = {
  intention: string
  focusedMinutes: number
  returns: number
  completed: boolean
  startedAt: number
}

type HelperMode = null | 'menu' | 'breathe' | 'urge'

type CheckInKey = 'steadier' | 'hard' | 'loud'
const CHECK_INS: { key: CheckInKey; label: string; reply: string }[] = [
  {
    key: 'steadier',
    label: 'Steadier than expected',
    reply:
      'Starting is often the heaviest wall. Remember this the next time avoidance says it will be unbearable.',
  },
  {
    key: 'hard',
    label: 'Hard, but I stayed',
    reply:
      'Staying while the mind pulled at you is the real training—hard sessions build just as much steadiness as calm ones.',
  },
  {
    key: 'loud',
    label: 'Too loud today',
    reply:
      'That happens on heavy days. Stopping without attacking yourself is a skill too—a short grounding reset can help.',
  },
]

export function FocusSession() {
  const [active, setActive, loaded] = useStored<ActiveFocus | null>(
    FOCUS_ACTIVE_KEY,
    null,
  )
  const [now, setNow] = useState(() => Date.now())
  const [summary, setSummary] = useState<Summary | null>(null)
  const [checkIn, setCheckIn] = useState<CheckInKey | null>(null)
  const [helper, setHelper] = useState<HelperMode>(null)
  const [helperSecondsLeft, setHelperSecondsLeft] = useState(0)
  const [arriveSecondsLeft, setArriveSecondsLeft] = useState(30)
  const finishedRef = useRef(false)

  const arriving = Boolean(active?.arriveFirst)
  const paused = active?.pausedRemainingMs != null
  const left = active ? remainingMs(active, now) : 0
  const breath = useBreathLoop({
    running: arriving || helper === 'breathe',
  })

  const beginClockAfterArrive = () => {
    if (!active) return
    unlockBell()
    const current = Date.now()
    setNow(current)
    const remaining = active.pausedRemainingMs ?? active.totalMs
    setActive({
      ...active,
      arriveFirst: false,
      endsAt: current + remaining,
      pausedRemainingMs: null,
    })
  }

  // Optional 3-breath arrival countdown (~30s) before starting the focus clock.
  useEffect(() => {
    if (!arriving || !active) return
    const total = Math.max(3, Math.round(30 / devSpeed()))
    setArriveSecondsLeft(total)
    const started = Date.now()
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000)
      const rem = total - elapsed
      if (rem <= 0) {
        window.clearInterval(timer)
        ringBell()
        beginClockAfterArrive()
      } else {
        setArriveSecondsLeft(rem)
      }
    }, 250)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arriving, active?.startedAt])

  // Mid-session helper countdown (30s breath or 60s urge wave).
  useEffect(() => {
    if (helper !== 'breathe' && helper !== 'urge') return
    const duration = helper === 'breathe' ? 30 : 60
    const scaled = Math.max(3, Math.round(duration / devSpeed()))
    setHelperSecondsLeft(scaled)
    const started = Date.now()
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000)
      const rem = scaled - elapsed
      if (rem <= 0) {
        window.clearInterval(timer)
        ringBell()
        setHelperSecondsLeft(0)
      } else {
        setHelperSecondsLeft(rem)
      }
    }, 250)
    return () => window.clearInterval(timer)
  }, [helper])

  const finish = (session: ActiveFocus, completed: boolean) => {
    if (finishedRef.current) return
    finishedRef.current = true
    const focusedMs = session.totalMs - remainingMs(session, Date.now())
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

  // The session runs on the clock, so it still ends on time in a background tab.
  useEffect(() => {
    if (!active || paused || arriving) return
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused, arriving])

  if (summary) {
    const selectedReply = CHECK_INS.find((c) => c.key === checkIn)
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

        {/* Stateless, judgment-free post-session check-in */}
        <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">
            How did that feel? (optional, not saved)
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {CHECK_INS.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={checkIn === option.key}
                onClick={() => setCheckIn(option.key)}
                className={cn(
                  'cursor-pointer rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-blush-hover sm:text-sm',
                  checkIn === option.key &&
                    'border-primary bg-pink-soft text-pink-ink',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {selectedReply && (
            <p className="max-w-[42ch] pt-1 text-sm leading-relaxed text-pretty text-muted-foreground">
              {selectedReply.reply}
            </p>
          )}
          {checkIn === 'loud' && (
            <Link
              to="/calm/ground"
              className="text-sm font-medium text-pink-ink hover:underline"
            >
              Try eyes-open 5-4-3-2-1 grounding
            </Link>
          )}
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

  if (arriving) {
    return (
      <QuietScreen leaveTo="/focus" leaveLabel="Focus">
        <BreathCircle scale={breath.scale} />
        <div aria-live="polite" className="flex flex-col items-center gap-4">
          <p aria-live="off" className="h-5 text-sm font-medium text-pink-ink">
            {PHASE_LABEL[breath.phase] || 'Three slow breaths to arrive'}
          </p>
          <h1 className="max-w-[24ch] text-2xl leading-snug font-medium tracking-[-0.02em] text-balance sm:text-3xl">
            {active.intention}
          </h1>
          <p className="text-sm text-muted-foreground tabular-nums">
            Starting timer in {arriveSecondsLeft}s
          </p>
          <Button
            variant="outline"
            className="mt-2 h-11 rounded-full px-6 text-sm"
            onClick={beginClockAfterArrive}
          >
            Start timer now
          </Button>
        </div>
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
    setHelper(null)
    setActive({
      ...active,
      endsAt: current + (active.pausedRemainingMs ?? left),
      pausedRemainingMs: null,
    })
  }
  const openHelper = () => {
    if (!paused) pause()
    setHelper('menu')
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

      {/* Mid-session grounding / urge helper without losing the focus timer */}
      {helper ? (
        <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-[28px] border border-border bg-card p-6 shadow-(--surface-shadow)">
          {helper === 'menu' && (
            <>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-medium text-foreground">
                  Mind pulling at you?
                </h2>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                  Your timer is paused safely. Take a short reset without
                  leaving your session.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setHelper('breathe')}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 text-left transition-colors hover:bg-surface-blush-hover"
                >
                  <Wind className="size-4 shrink-0 text-yellow-ink" />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      Take 3 slow breaths (30s)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Settle physical tension before returning
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setHelper('urge')}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 text-left transition-colors hover:bg-surface-blush-hover"
                >
                  <Waves className="size-4 shrink-0 text-pink-ink" />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      Ride out a checking urge (60s)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Wait one minute without checking or switching tabs
                    </span>
                  </span>
                </button>
              </div>
              <Button variant="outline" className="h-10 rounded-full px-6" onClick={resume}>
                Back to timer
              </Button>
            </>
          )}

          {helper === 'breathe' && (
            <>
              <BreathCircle scale={breath.scale} />
              <p className="text-sm font-medium text-pink-ink">
                {helperSecondsLeft > 0
                  ? `${PHASE_LABEL[breath.phase] || 'Breathe slowly'} · ${helperSecondsLeft}s`
                  : 'Ready to return.'}
              </p>
              <Button className="h-10 rounded-full px-6" onClick={resume}>
                Return to focus
              </Button>
            </>
          )}

          {helper === 'urge' && (
            <>
              <p className="text-xs font-medium text-pink-ink">
                Urge surfing · 1 minute
              </p>
              <p className="text-4xl font-medium tracking-[-0.04em] tabular-nums">
                {helperSecondsLeft}s
              </p>
              <p className="max-w-[34ch] text-sm leading-relaxed text-pretty text-muted-foreground">
                {helperSecondsLeft > 0
                  ? 'Notice the pull to check, fix, or look away. You do not need to answer it for this one minute.'
                  : 'You waited through the wave without acting on it.'}
              </p>
              <Button className="h-10 rounded-full px-6" onClick={resume}>
                Return to focus
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          <TimerRing
            progress={left / active.totalMs}
            className="size-56 sm:size-64"
          >
            <p
              role="timer"
              className="text-5xl font-medium tracking-[-0.04em] tabular-nums sm:text-6xl"
            >
              {clockLabel(left)}
            </p>
          </TimerRing>

          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                className="h-11 rounded-full px-6 text-base"
                onClick={cameBack}
              >
                <Undo2 aria-hidden className="size-4" />I drifted and came back
              </Button>
              <Button
                variant="ghost"
                className="h-11 rounded-full px-4 text-sm text-muted-foreground"
                onClick={openHelper}
              >
                Mind pulling at me?
              </Button>
            </div>
            <p aria-live="polite" className="h-5 text-sm text-muted-foreground">
              {active.returns > 0 &&
                `Came back ${active.returns === 1 ? 'once' : `${active.returns} times`}. Each one counts.`}
            </p>
          </div>
        </>
      )}

      <ThoughtParking
        since={active.startedAt}
        className="w-full max-w-md"
        emptyText="A thought pulling at you? Set it down here and go back to your one thing."
      />
    </QuietScreen>
  )
}
