import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltYet, Page } from '@/components/page'
import { CALM_ITEM } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'

export const Route = createFileRoute('/_app/calm')({
  head: () => ({
    meta: seo({ title: `Mind racing? | ${SITE_NAME}`, description: "A few minutes to step out of a thought loop." }),
  }),
  component: CalmPage,
})

function CalmPage() {
  return (
    <Page
      title="Mind racing?"
      lede="A few minutes to step out of a thought loop."
      icon={CALM_ITEM.icon}
      gradient={CALM_ITEM.gradient}
    >
      <NotBuiltYet>This tool is not built yet. It will guide you through noticing the thought, naming it, and returning, without arguing with it.</NotBuiltYet>
    </Page>
  )
}
