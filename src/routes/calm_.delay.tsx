import { createFileRoute } from '@tanstack/react-router'
import { UrgeDelay } from '@/components/urge-delay'
import { SITE_NAME, seo } from '@/lib/seo'

/** The urge-delay timer, on its own screen without the app navigation. */
export const Route = createFileRoute('/calm_/delay')({
  head: () => ({
    meta: seo({
      title: `Delay an urge | ${SITE_NAME}`,
      description:
        'Put an urge to check, fix or seek reassurance off for a few minutes and see what happens to it.',
    }),
  }),
  component: UrgeDelay,
})
