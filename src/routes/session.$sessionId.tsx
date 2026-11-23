import { createFileRoute, notFound } from '@tanstack/react-router'
import { SessionPlayer } from '@/components/session-player'
import { getSession } from '@/content/sessions'
import { SITE_NAME, seo } from '@/lib/seo'

/** A session plays on its own screen, without the app navigation. */
export const Route = createFileRoute('/session/$sessionId')({
  loader: ({ params }) => {
    const session = getSession(params.sessionId)
    if (!session) throw notFound()
    return { title: session.title, note: session.note }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? seo({
          title: `${loaderData.title} | ${SITE_NAME}`,
          description: loaderData.note,
        })
      : [],
  }),
  component: SessionRoute,
})

function SessionRoute() {
  const { sessionId } = Route.useParams()
  const session = getSession(sessionId)
  if (!session) return null
  return <SessionPlayer key={session.id} session={session} />
}
