import { createFileRoute } from '@tanstack/react-router'
import { SensoryGrounding } from '@/components/sensory-grounding'
import { SITE_NAME, seo } from '@/lib/seo'

/** Eyes-open 5-4-3-2-1 sensory grounding on its own quiet screen. */
export const Route = createFileRoute('/calm_/ground')({
  head: () => ({
    meta: seo({
      title: `5-4-3-2-1 Grounding | ${SITE_NAME}`,
      description:
        'An eyes-open sensory grounding exercise for panic, tightness, or overwhelm.',
    }),
  }),
  component: SensoryGrounding,
})
