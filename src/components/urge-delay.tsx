import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  BreathCircle,
  PHASE_LABEL,
  useBreathLoop,
} from '@/components/breath-circle'
import { QuietScreen } from '@/components/quiet-screen'
import { Button } from '@/components/ui/button'
import { ringBell, unlockBell } from '@/lib/bell'
import { type UrgeAfter, logUrge } from '@/lib/urge-log'
import { cn } from '@/lib/utils'
import { devSpeed } from '@/lib/dev-speed'

const MINUTE_OPTIONS = [5, 10, 15] as const

/** Shown one at a time while waiting. None of them argue with the urge. */
const CUES = [
  'Urges rise, peak and fall, like a wave. You only have to wait.',
  'It may still feel strong. That does not mean you are doing it wrong.',
  'Nothing needs solving for these few minutes.',
  'Feel your feet on the floor and your hands where they rest.',
  'You are not refusing forever. Only for now.',
]
const CUE_SECONDS = 40

const AFTER_OPTIONS: { value: UrgeAfter; label: string; reply: string }[] = [
  {
    value: 'gone',
    label: 'Gone',
    reply: 'It passed without you doing anything. Remember that this can happen.',
  },
  {
    value: 'weaker',
    label: 'Weaker',
    reply: 'It eased, and you did nothing to make it ease. That is how urges work.',
  },
  {
    value: 'same',
    label: 'About the same',
    reply: 'That happens. You still sat with it for the whole time, and that is the skill being trained.',
  },
]

const bigButton = 'h-12 rounded-full px-8 text-base'

type Stage = 'choose' | 'waiting' | 'check' | 'after'

export function UrgeDelay() {
  const [stage, setStage] = useState<Stage>('choose')
  const [minutes, setMinutes] = useState<number>(10)
  const [endsAt, setEndsAt] = useState(0)
  const [startedAt, setStartedAt] = useState(0)
  const [now, setNow] = useState(0)
  const [after, setAfter] = useState<UrgeAfter | null>(null)
  const breath = useBreathLoop({ running: stage === 'waiting' })

  // The wait runs on the clock, so it still ends on time if the phone is
  // locked or the tab is in the background.
  useEffect(() => {
    if (stage !== 'waiting') return
    const check = () => {
      const current = Date.now()
      setNow(current)
      if (current >= endsAt) {
        ringBell()
        setStage('check')
      }
    }
    check()
    const interval = window.setInterval(check, 500)
    document.addEventListener('visibilitychange', check)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', check)
    }
  }, [stage, endsAt])

  const start = () => {
    unlockBell()
    const begin = Date.now()
    setStartedAt(begin)
    setNow(begin)
    setEndsAt(begin + (minutes * 60_000) / devSpeed())
    setAfter(null)
    setStage('waiting')
  }

  const answer = (value: UrgeAfter) => {
    setAfter(value)
    logUrge({ at: new Date().toISOString(), minutes, after: value })
    setStage('after')
  }

  const length = Math.max(1, endsAt - startedAt)
  const progress = Math.min(1, Math.max(0, (now - startedAt) / length))
  const minutesLeft = Math.ceil((1 - progress) * minutes)
  const cue =
    CUES[Math.floor((progress * minutes * 60) / CUE_SECONDS) % CUES.length]

  return (
    <QuietScreen leaveTo="/calm">
      <BreathCircle scale={stage === 'waiting' ? breath.scale : undefined} />

      <div aria-live="polite" className="flex flex-col items-center gap-8">
        {stage === 'choose' && (
          <>
            <Heading
              title="Put the urge off for a while."
              body="Feel a pull to check, fix, ask or repeat? You do not have to refuse it forever. Wait a few minutes and see what happens to it."
            />
            <fieldset className="flex flex-col items-center gap-3">
              <legend className="sr-only">How long to wait</legend>
              <div className="flex gap-2.5">
                {MINUTE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={minutes === option}
                    onClick={() => setMinutes(option)}
                    className={cn(
                      'cursor-pointer rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface-blush-hover',
                      minutes === option &&
                        'border-primary bg-pink-soft text-pink-ink',
                    )}
                  >
                    {option} minutes
                  </button>
                ))}
              </div>
            </fieldset>
            <Button className={bigButton} onClick={start}>
              Start waiting
            </Button>
          </>
        )}

        {stage === 'waiting' && (
          <>
            <p aria-live="off" className="h-5 text-sm font-medium text-pink-ink">
              {PHASE_LABEL[breath.phase]}
            </p>
            <p className="max-w-[30ch] text-2xl leading-snug font-medium tracking-[-0.02em] text-balance sm:text-3xl sm:leading-snug">
              {cue}
            </p>
            <div className="flex w-full max-w-sm flex-col items-center gap-2">
              <div
                role="progressbar"
                aria-label="Waiting time"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                className="h-1 w-full min-w-64 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full origin-left rounded-full bg-(image:--grad-lifeline) transition-transform duration-500 ease-linear"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {minutesLeft <= 1
                  ? 'Less than a minute left'
                  : `About ${minutesLeft} minutes left`}
              </p>
            </div>
            <Button
              variant="ghost"
              className="h-11 rounded-full px-6 text-base"
              onClick={() => setStage('choose')}
            >
              Stop waiting
            </Button>
          </>
        )}

        {stage === 'check' && (
          <>
            <Heading
              title="Time is up. Notice the urge now."
              body="No right answer here. How does it feel compared with when you started?"
            />
            <div className="flex flex-wrap justify-center gap-2.5">
              {AFTER_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className={bigButton}
                  onClick={() => answer(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </>
        )}

        {stage === 'after' && (
          <>
            <Heading
              title="You waited the whole time."
              body={
                AFTER_OPTIONS.find((option) => option.value === after)?.reply ??
                ''
              }
            />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className={bigButton}>
                <Link to="/">Back to my day</Link>
              </Button>
              <Button
                variant="outline"
                className={bigButton}
                onClick={() => setStage('choose')}
              >
                Wait again
              </Button>
            </div>
          </>
        )}
      </div>
    </QuietScreen>
  )
}

function Heading({ title, body }: Readonly<{ title: string; body: string }>) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="max-w-[22ch] text-3xl leading-[1.12] font-medium tracking-[-0.03em] text-balance sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-[44ch] text-lg leading-relaxed text-pretty text-muted-foreground">
        {body}
      </p>
    </div>
  )
}
