import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltYet, Page } from '@/components/page'
import { NAV_ITEMS } from '@/lib/nav'
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

const plannedSessions = [
  {
    duration: '3 min',
    pill: 'bg-yellow-soft text-yellow-ink',
    title: 'Settle the nervous system',
    note: 'A short exhale-focused reset for moments when everything feels too loud.',
  },
  {
    duration: '5 min',
    pill: 'bg-peach-soft text-peach-ink',
    title: 'Steady breath anchor',
    note: 'Gentle practice in noticing a wandering thought and returning without frustration.',
  },
  {
    duration: '10 min',
    pill: 'bg-pink-soft text-pink-ink',
    title: 'Open awareness',
    note: 'Let thoughts pass like weather in the sky while staying grounded in the body.',
  },
] as const

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
          {plannedSessions.map((session) => (
            <li
              key={session.title}
              className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div className="flex flex-col gap-1">
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
                {session.duration}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <NotBuiltYet>
        The guided sessions are still being written. They will open here as a
        quiet daily sequence you can return to anytime, with no streaks or
        pressure.
      </NotBuiltYet>
    </Page>
  )
}
