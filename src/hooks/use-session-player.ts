import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Session } from '@/content/sessions'
import { ringBell, unlockBell } from '@/lib/bell'
import { logPractice } from '@/lib/practice-log'
import {
  buildTimeline,
  circleScale,
  segmentAt,
  totalSeconds,
} from '@/lib/session-timeline'
import { readStored, writeStored } from '@/lib/storage'
import { devSpeed } from '@/lib/dev-speed'

export type PlayerStatus = 'ready' | 'playing' | 'paused' | 'done'

/** Sessions shorter than this are not worth logging when ended early. */
const MIN_LOGGED_SECONDS = 10

export function useSessionPlayer(session: Session) {
  const timeline = useMemo(() => buildTimeline(session), [session])
  const total = totalSeconds(timeline)

  const [status, setStatus] = useState<PlayerStatus>('ready')
  const [elapsed, setElapsed] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [bellOn, setBellOn] = useState(true)

  const elapsedRef = useRef(0)
  const bellOnRef = useRef(true)
  const lastStepRef = useRef(-1)

  useEffect(() => {
    const stored = readStored('bell-on', true)
    bellOnRef.current = stored
    setBellOn(stored)
  }, [])

  const bell = useCallback(() => {
    if (bellOnRef.current) ringBell()
  }, [])

  const finish = useCallback(
    (didComplete: boolean) => {
      setCompleted(didComplete)
      setStatus('done')
      if (didComplete) bell()
      if (didComplete || elapsedRef.current >= MIN_LOGGED_SECONDS) {
        logPractice({
          sessionId: session.id,
          at: new Date().toISOString(),
          seconds: Math.round(Math.min(elapsedRef.current, total)),
          completed: didComplete,
        })
      }
    },
    [bell, session.id, total],
  )

  // The clock. It only advances while the page is visible, so switching tabs
  // or locking the phone pauses the session instead of skipping guidance.
  useEffect(() => {
    if (status !== 'playing') return
    const speed = devSpeed()
    let frame = 0
    let previous = performance.now()

    const tick = (now: number) => {
      const delta = Math.min((now - previous) / 1000, 0.25)
      previous = now
      const next = elapsedRef.current + delta * speed
      elapsedRef.current = next

      if (next >= total) {
        setElapsed(total)
        finish(true)
        return
      }

      // A bell marks new guidance after a quiet stretch, so eyes can stay closed.
      const { segment } = segmentAt(timeline, next)
      if (segment.stepIndex !== lastStepRef.current) {
        const previousStep = session.steps[lastStepRef.current]
        const step = session.steps[segment.stepIndex]
        if (previousStep && previousStep.kind !== 'say' && step.kind === 'say') {
          bell()
        }
        lastStepRef.current = segment.stepIndex
      }

      setElapsed(next)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [status, timeline, total, session.steps, bell, finish])

  // Keep the screen awake while a session plays, where the browser allows it.
  useEffect(() => {
    if (status !== 'playing' || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | null = null
    let cancelled = false
    navigator.wakeLock
      .request('screen')
      .then((sentinel) => {
        if (cancelled) void sentinel.release()
        else lock = sentinel
      })
      .catch(() => {})
    return () => {
      cancelled = true
      void lock?.release()
    }
  }, [status])

  const begin = useCallback(() => {
    unlockBell()
    elapsedRef.current = 0
    lastStepRef.current = -1
    setElapsed(0)
    setCompleted(false)
    setStatus('playing')
    // The audio context needs a moment to start after the tap.
    window.setTimeout(bell, 150)
  }, [bell])

  const pause = useCallback(() => setStatus('paused'), [])
  const resume = useCallback(() => setStatus('playing'), [])
  const end = useCallback(() => finish(false), [finish])

  const toggleBell = useCallback(() => {
    const next = !bellOnRef.current
    bellOnRef.current = next
    setBellOn(next)
    writeStored('bell-on', next)
    if (next) {
      unlockBell()
      window.setTimeout(ringBell, 150)
    }
  }, [])

  const { segment, progress } = segmentAt(timeline, Math.min(elapsed, total))

  return {
    status,
    completed,
    elapsed,
    total,
    segment,
    scale: circleScale(segment.phase, progress),
    bellOn,
    begin,
    pause,
    resume,
    end,
    toggleBell,
  }
}
