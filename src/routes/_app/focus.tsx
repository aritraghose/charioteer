import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltYet, Page } from '@/components/page'
import { NAV_ITEMS } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'

export const Route = createFileRoute('/_app/focus')({
  head: () => ({
    meta: seo({ title: `Focus | ${SITE_NAME}`, description: "One task, one timer, and a place to park stray thoughts." }),
  }),
  component: FocusPage,
})

function FocusPage() {
  return (
    <Page
      title="Focus"
      lede="One task, one timer, and a place to park stray thoughts."
      icon={NAV_ITEMS[2].icon}
      gradient={NAV_ITEMS[2].gradient}
    >
      <NotBuiltYet>Focus sessions are not built yet. You will set one intention, start a timer, and note distractions without acting on them.</NotBuiltYet>
    </Page>
  )
}
