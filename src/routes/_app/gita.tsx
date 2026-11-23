import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltYet, Page } from '@/components/page'
import { NAV_ITEMS } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'

export const Route = createFileRoute('/_app/gita')({
  head: () => ({
    meta: seo({ title: `Gita | ${SITE_NAME}`, description: "The Bhagavad Gita, read from the Sanskrit, word by word." }),
  }),
  component: GitaPage,
})

function GitaPage() {
  return (
    <Page
      title="Gita"
      lede="The Bhagavad Gita, read from the Sanskrit, word by word."
      icon={NAV_ITEMS[3].icon}
      gradient={NAV_ITEMS[3].gradient}
    >
      <NotBuiltYet>The reader is not built yet. Each verse will show the Sanskrit, its transliteration, a word-by-word meaning and a literal translation.</NotBuiltYet>
    </Page>
  )
}
