import { createFileRoute } from '@tanstack/react-router'
import { FocusSession } from '@/components/focus-session'
import { SITE_NAME, seo } from '@/lib/seo'

/** The running focus session, on its own screen without the app navigation. */
export const Route = createFileRoute('/focus_/now')({
  head: () => ({
    meta: seo({ title: `Focusing | ${SITE_NAME}`, noindex: true }),
  }),
  component: FocusSession,
})
