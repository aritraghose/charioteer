import { createFileRoute } from '@tanstack/react-router'
import { BreathingPacer } from '@/components/breathing-pacer'
import { SITE_NAME, seo } from '@/lib/seo'

/** Short physiological breathing pacer on its own quiet screen. */
export const Route = createFileRoute('/calm_/breathe')({
  head: () => ({
    meta: seo({
      title: `Breathing pacer | ${SITE_NAME}`,
      description:
        'A two-minute paced breathing reset: longer exhale, physiological sigh, or box breathing.',
    }),
  }),
  component: BreathingPacer,
})
