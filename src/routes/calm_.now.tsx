import { createFileRoute } from '@tanstack/react-router'
import { CalmFlow } from '@/components/calm-flow'
import { CALM_ITEM } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'

/** The Mind racing flow, on its own screen without the app navigation. */
export const Route = createFileRoute('/calm_/now')({
  head: () => ({
    meta: seo({
      title: `Mind racing? | ${SITE_NAME}`,
      description: CALM_ITEM.description,
    }),
  }),
  component: CalmFlow,
})
