import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  BreathCircle,
  PHASE_LABEL,
  useBreathLoop,
} from '@/components/breath-circle'
import { QuietScreen } from '@/components/quiet-screen'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Plain names for a looping thought. Picking one is only for the person: it is
 * not saved anywhere, and the thought itself is never typed in or discussed,
 * because arguing with it or checking it would feed the loop.
 */
const LABELS = [
  'a worry',
  'a what-if',
  'an urge to check',
  'a memory',
  'a harsh thought about me',
  'something else',
] as const

type Stage = 'notice' | 'name' | 'leave' | 'return' | 'close'
const STAGES: Stage[] = ['notice', 'name', 'leave', 'return', 'close']

const bigButton = 'h-12 rounded-full px-8 text-base'

export function CalmFlow() {
  const [stage, setStage] = useState<Stage>('notice')
  const [label, setLabel] = useState<(typeof LABELS)[number] | null>(null)
  const breath = useBreathLoop()
  const stageNumber = STAGES.indexOf(stage) + 1

  const restart = () => {
    setLabel(null)
    setStage('notice')
  }

  return (
    <QuietScreen
      leaveTo="/calm"
      footer={
        <p className="text-xs text-muted-foreground">
          Step {stageNumber} of {STAGES.length}. Take as long as you need.
        </p>
      }
    >
      <BreathCircle scale={breath.scale} />

      <div aria-live="polite" className="flex flex-col items-center gap-8">
        <p aria-live="off" className="h-5 text-sm font-medium text-pink-ink">
          {PHASE_LABEL[breath.phase]}
        </p>

        {stage === 'notice' && (
          <Step
            title="A thought is looping."
            body="You do not have to make it stop. Breathe out slowly, and just see that it is repeating."
          >
            <Button className={bigButton} onClick={() => setStage('name')}>
              I see it
            </Button>
          </Step>
        )}

        {stage === 'name' && (
          <Step
            title="Give it a plain name."
            body="Not what it says. Only what kind of thought it is. This stays with you and is not saved."
          >
            <div className="flex max-w-md flex-wrap justify-center gap-2.5">
              {LABELS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={label === option}
                  onClick={() => setLabel(option)}
                  className={cn(
                    'cursor-pointer rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-blush-hover',
                    label === option &&
                      'border-primary bg-pink-soft text-pink-ink',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            <Button
              className={bigButton}
              disabled={!label}
              onClick={() => setStage('leave')}
            >
              That is its name
            </Button>
          </Step>
        )}

        {stage === 'leave' && (
          <Step
            title={`It is ${label ?? 'a thought'}. A false alarm, not a task.`}
            body="It wants an answer, a check or some reassurance. You can leave it unanswered. Not answering is the practice."
          >
            <Button className={bigButton} onClick={() => setStage('return')}>
              Leave it unanswered
            </Button>
          </Step>
        )}

        {stage === 'return' && (
          <Step
            title="Come back to the body."
            body="Feel your feet on the floor. Your hands. The room around you. Follow the circle for a few breaths, and stay as long as you like."
          >
            <Button className={bigButton} onClick={() => setStage('close')}>
              I am here
            </Button>
          </Step>
        )}

        {stage === 'close' && (
          <Step
            title="That is the whole practice."
            body="The thought may still be around. That is fine. You noticed it, named it and did not answer it."
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className={bigButton}>
                <Link to="/">Back to my day</Link>
              </Button>
              <Button asChild variant="outline" className={bigButton}>
                <Link to="/calm/delay">Delay an urge</Link>
              </Button>
            </div>
            <button
              type="button"
              onClick={restart}
              className="cursor-pointer text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Go through it again
            </button>
          </Step>
        )}
      </div>
    </QuietScreen>
  )
}

function Step({
  title,
  body,
  children,
}: Readonly<{ title: string; body: string; children: React.ReactNode }>) {
  return (
    <div className="flex flex-col items-center gap-7">
      <div className="flex flex-col items-center gap-3">
        <h1 className="max-w-[22ch] text-3xl leading-[1.12] font-medium tracking-[-0.03em] text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-[44ch] text-lg leading-relaxed text-pretty text-muted-foreground">
          {body}
        </p>
      </div>
      {children}
    </div>
  )
}
