import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Page } from '@/components/page'
import { Button } from '@/components/ui/button'
import { COURSE, DAYS_PER_WEEK, getWeek } from '@/content/course'
import { getSession } from '@/content/sessions'
import { useStored } from '@/hooks/use-stored'
import { NAV_ITEMS } from '@/lib/nav'
import {
  COURSE_WEEK_KEY,
  PRACTICE_LOG_KEY,
  type PracticeEntry,
  daysLabel,
  daysPractised,
} from '@/lib/practice-log'
import { SITE_NAME, seo } from '@/lib/seo'
import { sessionMinutes } from '@/lib/session-timeline'

export const Route = createFileRoute('/_app/practice_/$week')({
  loader: ({ params }) => {
    const week = getWeek(Number(params.week))
    if (!week) throw notFound()
    return { week: week.week, title: week.title, theme: week.theme }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? seo({
          title: `Week ${loaderData.week}: ${loaderData.title} | ${SITE_NAME}`,
          description: loaderData.theme,
        })
      : [],
  }),
  component: WeekPage,
})

function WeekPage() {
  const { week: weekParam } = Route.useParams()
  const [currentWeek, setCurrentWeek, loaded] = useStored<number>(
    COURSE_WEEK_KEY,
    1,
  )
  const [log] = useStored<PracticeEntry[]>(PRACTICE_LOG_KEY, [])

  const item = getWeek(Number(weekParam))
  const session = item && getSession(item.sessionId)
  if (!item || !session) return null

  const days = daysPractised(log, item.sessionId)
  const isCurrent = currentWeek === item.week
  const previous = getWeek(item.week - 1)
  const next = getWeek(item.week + 1)

  return (
    <Page
      title={`Week ${item.week}: ${item.title}`}
      lede={item.theme}
      icon={NAV_ITEMS[1].icon}
      badgeClass={NAV_ITEMS[1].badgeClass}
    >
      <section className="flex flex-col gap-6 rounded-[28px] border border-border bg-(image:--grad-sanctuary) p-6 shadow-(--surface-shadow) sm:p-8">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-sm font-medium text-pink-ink">
            This week's practice
          </h2>
          <p className="text-2xl font-medium tracking-[-0.025em]">
            {session.title}
          </p>
          <p className="max-w-[50ch] leading-relaxed text-pretty text-muted-foreground">
            {session.intro}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button asChild className="h-12 rounded-full px-8 text-base">
            <Link to="/session/$sessionId" params={{ sessionId: session.id }}>
              Begin, {sessionMinutes(session)} minutes
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">{daysLabel(days)}</p>
        </div>
      </section>

      <section className="flex flex-col gap-1.5 border-l-2 border-primary/50 pl-4">
        <h2 className="text-sm font-medium text-pink-ink">In daily life</h2>
        <p className="max-w-[56ch] leading-relaxed text-pretty">{item.daily}</p>
      </section>

      <section className="flex flex-col gap-4">
        <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground">
          Stay with this week for about {DAYS_PER_WEEK} days of practice, in
          your own time. Days do not need to be in a row, and you can repeat a
          week as long as you like.
        </p>
        {loaded && !isCurrent && (
          <Button
            variant="outline"
            className="h-11 w-fit rounded-full px-6 text-base"
            onClick={() => setCurrentWeek(item.week)}
          >
            Make this my week now
          </Button>
        )}
        {loaded && isCurrent && next && (
          <Button
            variant="outline"
            className="h-11 w-fit rounded-full px-6 text-base"
            onClick={() => setCurrentWeek(next.week)}
          >
            Move on to week {next.week}
          </Button>
        )}
      </section>

      <nav
        aria-label="Weeks"
        className="flex items-center justify-between gap-4 border-t border-border/80 pt-6 text-sm font-medium"
      >
        {previous ? (
          <Link
            to="/practice/$week"
            params={{ week: String(previous.week) }}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft aria-hidden className="size-4" />
            Week {previous.week}
          </Link>
        ) : (
          <span />
        )}
        <Link to="/practice" className="text-pink-ink">
          All {COURSE.length} weeks
        </Link>
        {next ? (
          <Link
            to="/practice/$week"
            params={{ week: String(next.week) }}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            Week {next.week}
            <ChevronRight aria-hidden className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </Page>
  )
}
