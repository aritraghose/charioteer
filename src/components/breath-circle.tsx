import { useEffect, useState } from 'react'
import { Logo } from '@/components/logo'
import { type Phase, REST_SCALE, circleScale } from '@/lib/session-timeline'

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

/**
 * The medallion from the home page, sized by the breath: `scale` runs from
 * REST_SCALE (empty lungs) to 1 (full).
 */
export function BreathCircle({
  scale = REST_SCALE,
}: Readonly<{ scale?: number }>) {
  const reducedMotion = usePrefersReducedMotion()
  // With reduced motion the rings stay put and brighten with the in-breath instead.
  const fill = (scale - REST_SCALE) / (1 - REST_SCALE)
  const ringStyle = (depth: number) =>
    reducedMotion
      ? { opacity: 0.55 + 0.45 * fill }
      : { transform: `scale(${1 - (1 - scale) * depth})` }

  return (
    <div
      aria-hidden
      className="relative flex size-64 shrink-0 items-center justify-center sm:size-72"
    >
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-(image:--grad-orb) blur-3xl" />
      <span
        className="absolute inset-0 rounded-full bg-medallion-outer shadow-(--medallion-ring) will-change-transform"
        style={ringStyle(1)}
      />
      <span
        className="absolute inset-[13%] rounded-full bg-medallion-mid shadow-(--medallion-ring) will-change-transform"
        style={ringStyle(0.6)}
      />
      <span className="absolute inset-[30%] rounded-full bg-medallion-inner shadow-(--medallion-core)" />
      <Logo className="relative size-16" />
    </div>
  )
}

/**
 * A steady breathing pace that loops for as long as `running` is true.
 * Returns the circle size and whether the breath is going in or out.
 */
export function useBreathLoop({
  inhale = 4,
  exhale = 6,
  running = true,
}: { inhale?: number; exhale?: number; running?: boolean } = {}) {
  const [state, setState] = useState<{ phase: Phase; scale: number }>({
    phase: 'still',
    scale: REST_SCALE,
  })

  useEffect(() => {
    if (!running) return
    let frame = 0
    let elapsed = 0
    let previous = performance.now()
    const tick = (now: number) => {
      elapsed += Math.min((now - previous) / 1000, 0.25)
      previous = now
      const position = elapsed % (inhale + exhale)
      const phase: Phase = position < inhale ? 'inhale' : 'exhale'
      const progress =
        phase === 'inhale' ? position / inhale : (position - inhale) / exhale
      setState({ phase, scale: circleScale(phase, progress) })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inhale, exhale, running])

  return state
}

export const PHASE_LABEL = {
  inhale: 'Breathe in',
  exhale: 'Breathe out',
  still: '',
} as const
