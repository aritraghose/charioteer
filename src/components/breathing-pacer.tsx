import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { BreathCircle } from '@/components/breath-circle'
import { QuietScreen } from '@/components/quiet-screen'
import { Button } from '@/components/ui/button'
import { ringBell, unlockBell } from '@/lib/bell'
import { devSpeed } from '@/lib/dev-speed'
import { REST_SCALE } from '@/lib/session-timeline'
import { cn } from '@/lib/utils'

type BreathStage = {
  label: string
  seconds: number
  from: number
  to: number
}

type BreathPreset = {
  id: 'exhale' | 'sigh' | 'box'
  name: string
  rhythm: string
  about: string
  stages: BreathStage[]
}

const PRESETS: BreathPreset[] = [
  {
    id: 'exhale',
    name: 'Longer exhale',
    rhythm: '4 in · 6 out',
    about: 'Gently slows a fast heart rate and settles general tension.',
    stages: [
      { label: 'Breathe in gently', seconds: 4, from: REST_SCALE, to: 1 },
      { label: 'Breathe out slowly', seconds: 6, from: 1, to: REST_SCALE },
    ],
  },
  {
    id: 'sigh',
    name: 'Physiological sigh',
    rhythm: '2 in · +1 top-up · 6 out',
    about:
      'Two nose inhales then one long sigh out. Rapid downshift for acute stress spikes.',
    stages: [
      { label: 'Inhale through the nose', seconds: 2.2, from: REST_SCALE, to: 0.88 },
      { label: 'Small top-up inhale', seconds: 1.0, from: 0.88, to: 1 },
      { label: 'Long, slow sigh out', seconds: 6.0, from: 1, to: REST_SCALE },
    ],
  },
  {
    id: 'box',
    name: 'Box breath',
    rhythm: '4 · 4 · 4 · 4',
    about: 'Even, steady rhythm—helpful right before focus or a hard task.',
    stages: [
      { label: 'Breathe in', seconds: 4, from: REST_SCALE, to: 1 },
      { label: 'Hold gently', seconds: 4, from: 1, to: 1 },
      { label: 'Breathe out', seconds: 4, from: 1, to: REST_SCALE },
      { label: 'Rest empty', seconds: 4, from: REST_SCALE, to: REST_SCALE },
    ],
  },
]

const MINUTE_OPTIONS = [1, 2, 3] as const
const bigButton = 'h-12 rounded-full px-8 text-base'

export function BreathingPacer() {
  const [presetId, setPresetId] = useState<BreathPreset['id']>('exhale')
  const [minutes, setMinutes] = useState<number>(2)
  const [status, setStatus] = useState<'ready' | 'running' | 'done'>('ready')
  const [scale, setScale] = useState(REST_SCALE)
  const [cue, setCue] = useState('')
  const [progress, setProgress] = useState(0)

  const preset = PRESETS.find((item) => item.id === presetId) ?? PRESETS[0]
  const cycleSeconds = preset.stages.reduce((sum, s) => sum + s.seconds, 0)

  useEffect(() => {
    if (status !== 'running') return
    const totalSeconds = (minutes * 60) / devSpeed()
    let frame = 0
    let elapsed = 0
    let previous = performance.now()

    const tick = (now: number) => {
      elapsed += Math.min((now - previous) / 1000, 0.25)
      previous = now

      if (elapsed >= totalSeconds) {
        ringBell()
        setScale(REST_SCALE)
        setProgress(1)
        setStatus('done')
        return
      }

      const pos = elapsed % cycleSeconds
      let cursor = 0
      let current = preset.stages[0]
      for (const stage of preset.stages) {
        if (pos < cursor + stage.seconds) {
          current = stage
          break
        }
        cursor += stage.seconds
      }
      const stageProgress = Math.min(
        1,
        Math.max(0, (pos - cursor) / current.seconds),
      )
      const eased = (1 - Math.cos(Math.PI * stageProgress)) / 2
      setScale(current.from + (current.to - current.from) * eased)
      setCue(current.label)
      setProgress(elapsed / totalSeconds)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [status, minutes, preset, cycleSeconds])

  const start = () => {
    unlockBell()
    setProgress(0)
    setStatus('running')
  }

  return (
    <QuietScreen leaveTo="/calm">
      <BreathCircle scale={status === 'running' ? scale : REST_SCALE} />

      <div aria-live="polite" className="flex flex-col items-center gap-7">
        {status === 'ready' && (
          <>
            <div className="flex flex-col items-center gap-2.5">
              <h1 className="text-3xl leading-[1.12] font-medium tracking-[-0.03em] text-balance sm:text-4xl">
                Breathing pacer
              </h1>
              <p className="max-w-[44ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                {preset.about}
              </p>
            </div>

            <fieldset className="flex flex-col items-center gap-3">
              <legend className="sr-only">Breathing rhythm</legend>
              <div className="flex flex-wrap justify-center gap-2">
                {PRESETS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={presetId === option.id}
                    onClick={() => setPresetId(option.id)}
                    className={cn(
                      'flex cursor-pointer flex-col items-center rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-blush-hover',
                      presetId === option.id &&
                        'border-primary bg-pink-soft text-pink-ink',
                    )}
                  >
                    <span>{option.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {option.rhythm}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex items-center gap-2">
              <legend className="sr-only">Length</legend>
              {MINUTE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={minutes === option}
                  onClick={() => setMinutes(option)}
                  className={cn(
                    'cursor-pointer rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:bg-surface-blush-hover',
                    minutes === option &&
                      'border-primary bg-pink-soft text-pink-ink',
                  )}
                >
                  {option} min
                </button>
              ))}
            </fieldset>

            <div className="flex flex-col items-center gap-3">
              <Button className={bigButton} onClick={start}>
                Begin
              </Button>
              <p className="max-w-[44ch] text-xs leading-relaxed text-pretty text-muted-foreground sm:text-sm">
                If watching your breath makes you feel tighter, try{' '}
                <Link
                  to="/calm/ground"
                  className="font-medium text-pink-ink underline-offset-4 hover:underline"
                >
                  eyes-open 5-4-3-2-1 grounding
                </Link>{' '}
                instead.
              </p>
            </div>
          </>
        )}

        {status === 'running' && (
          <>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                {preset.name} · {preset.rhythm}
              </p>
              <p
                aria-live="off"
                className="text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl"
              >
                {cue}
              </p>
            </div>
            <div className="flex w-full max-w-xs flex-col items-center gap-2">
              <div
                role="progressbar"
                aria-label="Breathing progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                className="h-1 w-64 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full origin-left rounded-full bg-(image:--grad-lifeline)"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
            </div>
            <Button
              variant="ghost"
              className="h-11 rounded-full px-6 text-base"
              onClick={() => setStatus('ready')}
            >
              Stop
            </Button>
          </>
        )}

        {status === 'done' && (
          <>
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-3xl leading-[1.12] font-medium tracking-[-0.03em] text-balance sm:text-4xl">
                Done. Let the breath return to its own pace.
              </h1>
              <p className="max-w-[44ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                Notice your shoulders, jaw, and hands for a moment before moving
                on.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className={bigButton}>
                <Link to="/">Back to my day</Link>
              </Button>
              <Button
                variant="outline"
                className={bigButton}
                onClick={() => setStatus('ready')}
              >
                Another round
              </Button>
            </div>
          </>
        )}
      </div>
    </QuietScreen>
  )
}
