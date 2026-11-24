import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/logo'
import { QuietScreen } from '@/components/quiet-screen'
import { RatingScale } from '@/components/rating-scale'
import { Button } from '@/components/ui/button'
import { useStored } from '@/hooks/use-stored'
import { ringBell, unlockBell } from '@/lib/bell'
import { devSpeed } from '@/lib/dev-speed'
import {
  EXPOSURE_LOG_KEY,
  EXPOSURE_MINUTES,
  type ExposureEntry,
  LADDER_KEY,
  type LadderStep,
  entriesFor,
} from '@/lib/ladder-store'
import { cn } from '@/lib/utils'

/**
 * Shown one at a time during the practice. They never offer reassurance or a
 * way to bring the anxiety down, because calming on purpose during an exposure
 * works like a compulsion. There is no breathing guide here for the same reason.
 */
const CUES = [
  'Let the anxiety be here. You do not need to bring it down.',
  'No checking. No asking. No going over it in your head.',
  'If you catch yourself reviewing or reassuring, drop it and come back to the trigger.',
  'The discomfort is the practice working, not a sign of danger.',
  'You are only staying. Nothing else is asked of you.',
]
const CUE_SECONDS = 45

const bigButton = 'h-12 rounded-full px-8 text-base'

type Stage = 'before' | 'facing' | 'after' | 'done'

export function ExposurePractice({ stepId }: Readonly<{ stepId: string }>) {
  const [steps, , loaded] = useStored<LadderStep[]>(LADDER_KEY, [])
  const [log, setLog] = useStored<ExposureEntry[]>(EXPOSURE_LOG_KEY, [])
  const step = steps.find((item) => item.id === stepId)

  const [stage, setStage] = useState<Stage>('before')
  const [minutes, setMinutes] = useState<number>(10)
  const [before, setBefore] = useState<number | null>(null)
  const [after, setAfter] = useState<number | null>(null)
  const [startedAt, setStartedAt] = useState(0)
  const [endsAt, setEndsAt] = useState(0)
  const [now, setNow] = useState(0)

  // Runs on the clock, so it ends on time with the phone locked.
  useEffect(() => {
    if (stage !== 'facing') return
    const check = () => {
      const current = Date.now()
      setNow(current)
      if (current >= endsAt) {
        ringBell()
        setStage('after')
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

  if (!loaded) return <QuietScreen leaveTo="/ladder">{null}</QuietScreen>

  if (!step) {
    return (
      <QuietScreen leaveTo="/ladder" leaveLabel="Ladder">
        <Heading
          title="This step is not on your ladder."
          body="It may have been removed. Go back to your ladder to pick another."
        />
        <Button asChild className={bigButton}>
          <Link to="/ladder">Go to my ladder</Link>
        </Button>
      </QuietScreen>
    )
  }

  const start = () => {
    unlockBell()
    const begin = Date.now()
    setStartedAt(begin)
    setNow(begin)
    setEndsAt(begin + (minutes * 60_000) / devSpeed())
    setStage('facing')
  }

  const save = () => {
    if (before === null || after === null) return
    setLog((current) => [
      ...current,
      { stepId, at: new Date().toISOString(), minutes, before, after },
    ])
    setStage('done')
  }

  const length = Math.max(1, endsAt - startedAt)
  const progress = Math.min(1, Math.max(0, (now - startedAt) / length))
  const minutesLeft = Math.ceil((1 - progress) * minutes)
  const cue =
    CUES[Math.floor((progress * minutes * 60) / CUE_SECONDS) % CUES.length]
  const history = entriesFor(log, stepId)

  return (
    <QuietScreen leaveTo="/ladder" leaveLabel="Ladder">
      <Logo className="size-16" />

      <div aria-live="polite" className="flex flex-col items-center gap-8">
        {stage === 'before' && (
          <>
            <Heading title={step.text} body="How anxious are you right now?" />
            <RatingScale
              label="Anxiety right now"
              value={before}
              onChange={setBefore}
              className="w-full max-w-md"
            />
            <fieldset className="flex flex-col items-center gap-3">
              <legend className="mb-3 text-sm font-medium">
                How long will you stay with it?
              </legend>
              <div className="flex gap-2.5">
                {EXPOSURE_MINUTES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={minutes === option}
                    onClick={() => setMinutes(option)}
                    className={cn(
                      'cursor-pointer rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-surface-blush-hover',
                      minutes === option &&
                        'border-primary bg-pink-soft text-pink-ink',
                    )}
                  >
                    {option} minutes
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col items-center gap-3">
              <Button
                className={bigButton}
                disabled={before === null}
                onClick={start}
              >
                Face it now
              </Button>
              <p className="max-w-[46ch] text-sm leading-relaxed text-pretty text-muted-foreground">
                Bring the trigger close, in real life or in your mind, and do
                not do the compulsion. You can leave at any time.
              </p>
            </div>
          </>
        )}

        {stage === 'facing' && (
          <>
            <p className="max-w-[26ch] text-lg font-medium text-pink-ink text-balance break-words">
              {step.text}
            </p>
            <p className="max-w-[30ch] text-2xl leading-snug font-medium tracking-[-0.02em] text-balance sm:text-3xl sm:leading-snug">
              {cue}
            </p>
            <div className="flex w-full max-w-sm flex-col items-center gap-2">
              <div
                role="progressbar"
                aria-label="Time staying with it"
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
              onClick={() => setStage('after')}
            >
              Stop here
            </Button>
          </>
        )}

        {stage === 'after' && (
          <>
            <Heading
              title="How anxious are you now?"
              body="No right answer. Rate it as it is."
            />
            <RatingScale
              label="Anxiety now"
              value={after}
              onChange={setAfter}
              className="w-full max-w-md"
            />
            <Button
              className={bigButton}
              disabled={after === null}
              onClick={save}
            >
              Save this practice
            </Button>
          </>
        )}

        {stage === 'done' && before !== null && after !== null && (
          <>
            <Heading
              title={`${before} at the start, ${after} now.`}
              body={
                after < before
                  ? 'It came down without the compulsion. That is your brain learning the alarm was false.'
                  : 'It did not come down this time, and that is common. You stayed without the compulsion, and that is what teaches the brain. Repeating the same step is how it eases.'
              }
            />
            {history.length > 1 && (
              <p className="max-w-[46ch] text-sm leading-relaxed text-pretty text-muted-foreground">
                This step so far:{' '}
                {history
                  .slice(-6)
                  .map((entry) => `${entry.before} then ${entry.after}`)
                  .join(', ')}
                . Move up the ladder once the starting number stays low.
              </p>
            )}
            <Button asChild className={bigButton}>
              <Link to="/ladder">Back to my ladder</Link>
            </Button>
          </>
        )}
      </div>
    </QuietScreen>
  )
}

function Heading({ title, body }: Readonly<{ title: string; body: string }>) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="max-w-[22ch] text-3xl leading-[1.12] font-medium tracking-[-0.03em] text-balance break-words sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground">
        {body}
      </p>
    </div>
  )
}
