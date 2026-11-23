import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { NotBuiltYet, Page } from '@/components/page'
import { SESSIONS } from '@/content/sessions'
import { NAV_ITEMS } from '@/lib/nav'
import { sessionMinutes } from '@/lib/session-timeline'
import { SITE_NAME, seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/practice')({
  head: () => ({
    meta: seo({
      title: `Practice | ${SITE_NAME}`,
      description: NAV_ITEMS[1].description,
    }),
  }),
  component: PracticePage,
})

function PracticePage() {
  return (
    <Page
      title="Practice"
      lede={NAV_ITEMS[1].description}
      icon={NAV_ITEMS[1].icon}
      badgeClass={NAV_ITEMS[1].badgeClass}
    >
      <section className="rounded-[28px] border border-border bg-(image:--grad-sanctuary) p-6 shadow-(--surface-shadow) sm:p-8">
        <ul className="divide-y divide-border">
          {SESSIONS.map((session) => (
            <li key={session.id}>
              <Link
                to="/session/$sessionId"
                params={{ sessionId: session.id }}
                className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-5 transition-colors hover:bg-card sm:gap-6"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h2 className="text-lg font-medium tracking-[-0.02em] text-foreground">
                    {session.title}
                  </h2>
                  <p className="max-w-[48ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
                    {session.note}
                  </p>
                </div>
                <span
                  className={cn(
                    'w-fit shrink-0 rounded-full px-3.5 py-1 text-xs font-medium ring-1 ring-border',
                    session.pill,
                  )}
                >
                  {sessionMinutes(session)} min
                </span>
                <ChevronRight
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground/60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
                  strokeWidth={2}
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <NotBuiltYet title="More to come">
        These three sessions are the start. The full course, a daily sequence
        with no streaks or pressure, is still being written.
      </NotBuiltYet>
    </Page>
  )
}
