import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltYet, Page } from '@/components/page'
import { NAV_ITEMS } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'

export const Route = createFileRoute('/_app/practice')({
  head: () => ({
    meta: seo({ title: `Practice | ${SITE_NAME}`, description: "Guided meditation, from five minutes up." }),
  }),
  component: PracticePage,
})

function PracticePage() {
  return (
    <Page
      title="Practice"
      lede="Guided meditation, from five minutes up."
      icon={NAV_ITEMS[1].icon}
      gradient={NAV_ITEMS[1].gradient}
    >
      <NotBuiltYet>The course is still being written. Sessions will appear here, starting with a short daily practice.</NotBuiltYet>
    </Page>
  )
}
