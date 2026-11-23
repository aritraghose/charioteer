import { createFileRoute } from '@tanstack/react-router'
import { SITE_DESCRIPTION, SITE_NAME, seo } from '@/lib/seo'

export const Route = createFileRoute('/_public/')({
  head: () => ({
    meta: seo({ title: SITE_NAME, description: SITE_DESCRIPTION }),
  }),
  component: Landing,
})

function Landing() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">{SITE_NAME}</h1>
      <p className="text-muted-foreground">Work in progress.</p>
    </main>
  )
}
