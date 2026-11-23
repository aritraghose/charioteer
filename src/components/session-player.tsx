import { Link } from '@tanstack/react-router'
import { Bell, BellOff, Pause, Play, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Flame } from '@/components/flame'
import { Button } from '@/components/ui/button'
import type { Session } from '@/content/sessions'
import { useSessionPlayer } from '@/hooks/use-session-player'
import { sessionMinutes } from '@/lib/session-timeline'

const PHASE_LABEL = {
  inhale: 'Breathe in',
  exhale: 'Breathe out',
  still: '',
} as const

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

function minutesLabel(seconds: number) {
  const minutes = Math.round(seconds / 60)
  if (minutes < 1) return 'Less than a minute'
  return minutes === 1 ? '1 minute' : `${minutes} minutes`
}

export function SessionPlayer({ session }: Readonly<{ session: Session }>) {
  const player = useSessionPlayer(session)
  const reducedMotion = usePrefersReducedMotion()
  const { status, segment } = player
  const active = status === 'playing' || status === 'paused'
  const remaining = player.total - player.elapsed

  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link to="/practice">
            <X aria-hidden className="size-4" />
            {active ? 'Leave' : 'Practice'}
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          aria-pressed={player.bellOn}
          onClick={player.toggleBell}
        >
          {player.bellOn ? (
            <Bell aria-hidden className="size-4" />
          ) : (
            <BellOff aria-hidden className="size-4" />
          )}
          {player.bellOn ? 'Bell on' : 'Bell off'}
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-5 pb-10 text-center sm:px-8">
        {status === 'ready' && (
          <>
            <BreathCircle scale={0.62} reducedMotion={reducedMotion} />
            <div className="flex flex-col items-center gap-4">
              <p className="rounded-full bg-yellow-soft px-3.5 py-1 text-xs font-medium text-yellow-ink ring-1 ring-border">
                {minutesLabel(sessionMinutes(session) * 60)}
              </p>
              <h1 className="text-4xl leading-[1.06] font-medium tracking-[-0.036em] text-balance sm:text-5xl">
                {session.title}
              </h1>
              <p className="max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground">
                {session.intro}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                className="h-12 rounded-full px-8 text-base"
                onClick={player.begin}
              >
                Begin
              </Button>
              <p className="max-w-[44ch] text-sm leading-relaxed text-pretty text-muted-foreground">
                A bell sounds when there is something new to read, so you can
                close your eyes in between. You can pause or leave at any time.
              </p>
            </div>
          </>
        )}

        {active && (
          <>
            <BreathCircle scale={player.scale} reducedMotion={reducedMotion} />
            <div
              aria-live="polite"
              className="flex min-h-36 flex-col items-center gap-3"
            >
              <p className="h-6 text-sm font-medium text-pink-ink">
                {status === 'paused' ? 'Paused' : PHASE_LABEL[segment.phase]}
              </p>
              <p className="max-w-[30ch] text-2xl leading-snug font-medium tracking-[-0.02em] text-balance sm:text-3xl sm:leading-snug">
                {segment.text}
              </p>
            </div>
          </>
        )}

        {status === 'done' && (
          <>
            <BreathCircle scale={0.62} reducedMotion={reducedMotion} />
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-4xl leading-[1.06] font-medium tracking-[-0.036em] text-balance sm:text-5xl">
                {player.completed ? 'Done.' : 'Ended early.'}
              </h1>
              <p className="max-w-[44ch] text-lg leading-relaxed text-pretty text-muted-foreground">
                {player.completed
                  ? `You practised for ${minutesLabel(player.total).toLowerCase()}. Every time you came back counted.`
                  : 'That is fine. Whatever you did still counts, and the session will be here when you want it.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 rounded-full px-8 text-base">
                <Link to="/practice">Back to Practice</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-full px-8 text-base"
                onClick={player.begin}
              >
                Start again
              </Button>
            </div>
          </>
        )}
      </main>

      {active && (
        <footer className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-5 pb-8 sm:px-8">
          <div className="flex items-center gap-3">
            {status === 'playing' ? (
              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-full px-7 text-base"
                onClick={player.pause}
              >
                <Pause aria-hidden className="size-4" />
                Pause
              </Button>
            ) : (
              <Button
                size="lg"
                className="h-12 rounded-full px-7 text-base"
                onClick={player.resume}
              >
                <Play aria-hidden className="size-4" />
                Resume
              </Button>
            )}
            <Button
              variant="ghost"
              size="lg"
              className="h-12 rounded-full px-6 text-base"
              onClick={player.end}
            >
              End session
            </Button>
          </div>
          <div className="flex w-full max-w-sm flex-col items-center gap-2">
            <div
              role="progressbar"
              aria-label="Session progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((player.elapsed / player.total) * 100)}
              className="h-1 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full origin-left rounded-full bg-(image:--grad-lifeline)"
                style={{
                  transform: `scaleX(${player.elapsed / player.total})`,
                }}
              />
            </div>
            {/* Whole minutes only, so there is no ticking clock to watch. */}
            <p className="text-xs text-muted-foreground">
              {remaining < 60
                ? 'Less than a minute left'
                : `About ${minutesLabel(remaining).toLowerCase()} left`}
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}

/** The medallion from the home page, sized by the breath. */
function BreathCircle({
  scale,
  reducedMotion,
}: Readonly<{ scale: number; reducedMotion: boolean }>) {
  // With reduced motion the rings stay put and brighten with the in-breath instead.
  const fill = (scale - 0.62) / 0.38
  const ringStyle = (depth: number) =>
    reducedMotion
      ? { opacity: 0.55 + 0.45 * fill }
      : { transform: `scale(${1 - (1 - scale) * depth})` }

  return (
    <div
      aria-hidden
      className="relative flex size-64 items-center justify-center sm:size-72"
    >
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-(image:--grad-orb) blur-3xl" />
      <span
        className="absolute inset-0 rounded-full bg-surface-sun shadow-(--medallion-ring) will-change-transform"
        style={ringStyle(1)}
      />
      <span
        className="absolute inset-[13%] rounded-full bg-pink-soft shadow-(--medallion-ring) will-change-transform"
        style={ringStyle(0.6)}
      />
      <span className="absolute inset-[30%] rounded-full bg-card shadow-(--medallion-core)" />
      <Flame className="relative h-16" />
    </div>
  )
}
