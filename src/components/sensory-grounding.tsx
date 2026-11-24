import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { QuietScreen } from '@/components/quiet-screen'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type GroundStep = {
  count: number
  sense: string
  prompt: string
  hint: string
}

/**
 * Eyes-open 5-4-3-2-1 sensory grounding. Especially useful when closing the
 * eyes or focusing on the breath feels tight or increases panic. Nothing is
 * typed or stored—tap each circle as you notice one plain thing around you.
 */
const STEPS: GroundStep[] = [
  {
    count: 5,
    sense: 'Sight',
    prompt: 'Look slowly around the room and spot five plain things you can see.',
    hint: 'A corner of a desk, a shadow on the wall, a colour, a light switch. Tap a dot as you notice each one.',
  },
  {
    count: 4,
    sense: 'Touch',
    prompt: 'Notice four physical things you can feel right now.',
    hint: 'Your feet pressing the floor, the back of the chair, fabric on your sleeves, the temperature of your hands.',
  },
  {
    count: 3,
    sense: 'Sound',
    prompt: 'Listen for three separate sounds, near or far.',
    hint: 'Traffic outside, a fan or hum, birds, the quiet sound of your own breath.',
  },
  {
    count: 2,
    sense: 'Air & smell',
    prompt: 'Notice two subtle scents—or simply the feel of the air as you breathe in.',
    hint: 'Cool air at your nose, soap, coffee, paper, or just clean neutral air.',
  },
  {
    count: 1,
    sense: 'Right here',
    prompt: 'Take one slow out-breath and name one solid fact about where you are.',
    hint: 'For example: "My feet are on the floor. I am in this room right now."',
  },
]

const bigButton = 'h-12 rounded-full px-8 text-base'

export function SensoryGrounding() {
  const [stepIndex, setStepIndex] = useState(0)
  const [tapped, setTapped] = useState(0)
  const [done, setDone] = useState(false)

  const step = STEPS[stepIndex]

  const tapCircle = (index: number) => {
    const next = index + 1 === tapped ? index : index + 1
    setTapped(next)
  }

  const advance = () => {
    if (stepIndex + 1 < STEPS.length) {
      setStepIndex((i) => i + 1)
      setTapped(0)
    } else {
      setDone(true)
    }
  }

  const restart = () => {
    setStepIndex(0)
    setTapped(0)
    setDone(false)
  }

  return (
    <QuietScreen
      leaveTo="/calm"
      footer={
        !done && (
          <p className="text-xs text-muted-foreground">
            Step {stepIndex + 1} of {STEPS.length} · Eyes open. Go at your own
            pace.
          </p>
        )
      }
    >
      <Logo className="size-14" />

      {done ? (
        <div
          aria-live="polite"
          className="flex flex-col items-center gap-7"
        >
          <div className="flex flex-col items-center gap-3">
            <h1 className="max-w-[22ch] text-3xl leading-[1.12] font-medium tracking-[-0.03em] text-balance sm:text-4xl">
              You are back in the room.
            </h1>
            <p className="max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground">
              The thoughts or tension do not have to disappear completely. Your
              body has concrete proof that you are here right now.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className={bigButton}>
              <Link to="/">Back to my day</Link>
            </Button>
            <Button asChild variant="outline" className={bigButton}>
              <Link to="/calm/breathe">2-min breathing</Link>
            </Button>
          </div>
          <button
            type="button"
            onClick={restart}
            className="cursor-pointer text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Go through it again
          </button>
        </div>
      ) : (
        <div
          aria-live="polite"
          className="flex flex-col items-center gap-8"
        >
          <div className="flex flex-col items-center gap-3">
            <p className="rounded-full bg-yellow-soft px-3.5 py-1 text-xs font-medium text-yellow-ink ring-1 ring-border">
              {step.count} · {step.sense}
            </p>
            <h1 className="max-w-[24ch] text-3xl leading-[1.14] font-medium tracking-[-0.03em] text-balance sm:text-4xl">
              {step.prompt}
            </h1>
            <p className="max-w-[46ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {step.hint}
            </p>
          </div>

          {/* Tactile tap-as-you-notice counters */}
          <div
            role="group"
            aria-label={`Mark up to ${step.count} things noticed`}
            className="flex items-center justify-center gap-3"
          >
            {Array.from({ length: step.count }, (_, idx) => {
              const checked = idx < tapped
              return (
                <button
                  key={idx}
                  type="button"
                  aria-pressed={checked}
                  aria-label={`Noticed ${idx + 1} of ${step.count}`}
                  onClick={() => tapCircle(idx)}
                  className={cn(
                    'flex size-12 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-sm font-medium tabular-nums transition-colors hover:bg-surface-blush-hover',
                    checked && 'border-primary bg-pink-soft text-pink-ink',
                  )}
                >
                  {checked ? (
                    <Check aria-hidden className="size-4" strokeWidth={2.2} />
                  ) : (
                    idx + 1
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col items-center gap-3">
            <Button className={bigButton} onClick={advance}>
              {stepIndex + 1 < STEPS.length
                ? tapped >= step.count
                  ? `Next: ${STEPS[stepIndex + 1].count} · ${STEPS[stepIndex + 1].sense}`
                  : 'Continue to next'
                : 'I am here'}
            </Button>
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => {
                  setStepIndex((i) => i - 1)
                  setTapped(0)
                }}
                className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Previous step
              </button>
            )}
          </div>
        </div>
      )}
    </QuietScreen>
  )
}
