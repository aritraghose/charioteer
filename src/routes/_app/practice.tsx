import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Compass, ShieldCheck } from 'lucide-react'
import { Page } from '@/components/page'
import { COURSE, getWeek } from '@/content/course'
import { HOW_IT_WORKS } from '@/content/guidance'
import { SESSIONS, getSession } from '@/content/sessions'
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
  const [currentWeek] = useStored<number>(COURSE_WEEK_KEY, 1)
  const [log] = useStored<PracticeEntry[]>(PRACTICE_LOG_KEY, [])
  const current = getWeek(currentWeek) ?? COURSE[0]
  const currentSession = getSession(current.sessionId)

  return (
    <Page
      title="Practice"
      lede={NAV_ITEMS[1].description}
      icon={NAV_ITEMS[1].icon}
      badgeClass={NAV_ITEMS[1].badgeClass}
    >
      {/* Quick signposting to the stateless matcher when someone isn't sure where to start */}
      <Link
        to="/calm"
        className="group flex items-center gap-4 rounded-[28px] border border-lifeline-border bg-(image:--lifeline-surface) p-5 shadow-(--lifeline-shadow) transition-[background-image,transform] duration-200 hover:-translate-y-0.5 hover:bg-(image:--lifeline-surface-hover) motion-reduce:transition-none sm:px-6"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-lifeline-badge text-lifeline-badge-ink">
          <Compass aria-hidden className="size-5" strokeWidth={1.9} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-medium text-foreground">
            Not sure what fits right now?
          </span>
          <span className="text-sm text-muted-foreground">
            Pick what feels loudest in two taps—get one matched practice.
          </span>
        </span>
        <ChevronRight
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
          strokeWidth={2}
        />
      </Link>

      <section aria-labelledby="anytime-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2
            id="anytime-heading"
            className="text-2xl font-medium tracking-[-0.025em]"
          >
            Any time
          </h2>
          <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            Short, evidence-based sessions for specific moments—looping
            thoughts, harsh self-criticism, tense evenings, or steady daily
            practice.
          </p>
        </div>
        <div className="rounded-[28px] border border-border bg-(image:--grad-sanctuary) p-6 shadow-(--surface-shadow) sm:p-8">
          <ul className="divide-y divide-border">
            {SESSIONS.map((session) => (
              <li key={session.id}>
                <Link
                  to="/session/$sessionId"
                  params={{ sessionId: session.id }}
                  className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-4 transition-colors hover:bg-card sm:gap-6 sm:py-5"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-medium tracking-[-0.02em] text-foreground">
                        {session.title}
                      </h3>
                      {session.kind && (
                        <span className="text-xs font-medium text-muted-foreground">
                          · {session.kind}
                        </span>
                      )}
                    </div>
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
        </div>
      </section>

      <section aria-labelledby="course-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2
            id="course-heading"
            className="text-2xl font-medium tracking-[-0.025em]"
          >
            The eight-week course
          </h2>
          <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            One core practice a week, from five minutes up to twenty. Do it on
            the days you can. There are no streaks, and a missed day changes
            nothing.
          </p>
        </div>

        <Link
          to="/practice/$week"
          params={{ week: String(current.week) }}
          className="group flex flex-col gap-4 rounded-[28px] border border-border bg-(image:--grad-sanctuary) p-6 shadow-(--surface-shadow) transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 motion-reduce:transition-none sm:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-pink-soft px-3.5 py-1 text-xs font-medium text-pink-ink ring-1 ring-border">
              Your week now
            </span>
            <span className="text-sm text-muted-foreground">
              {daysLabel(daysPractised(log, current.sessionId))}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-2xl font-medium tracking-[-0.025em]">
              Week {current.week}: {current.title}
            </h3>
            <p className="max-w-[52ch] leading-relaxed text-pretty text-muted-foreground">
              {current.theme}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-pink-ink">
            Open week {current.week}
            {currentSession && `, ${sessionMinutes(currentSession)} minutes`}
            <ChevronRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
              strokeWidth={2.2}
            />
          </span>
        </Link>

        <ol className="divide-y divide-border rounded-[28px] border border-border bg-card shadow-(--surface-shadow)">
          {COURSE.map((item) => {
            const session = getSession(item.sessionId)
            const days = daysPractised(log, item.sessionId)
            return (
              <li key={item.week}>
                <Link
                  to="/practice/$week"
                  params={{ week: String(item.week) }}
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-blush-hover sm:px-6"
                >
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ring-1 ring-border',
                      item.week === current.week
                        ? 'bg-pink-soft text-pink-ink'
                        : 'bg-card text-muted-foreground',
                    )}
                  >
                    {item.week}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {session ? `${sessionMinutes(session)} min` : ''}
                      {days > 0 && `, ${daysLabel(days).toLowerCase()}`}
                    </span>
                  </span>
                  <ChevronRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground/60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
                    strokeWidth={2}
                  />
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="tracks-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2
            id="tracks-heading"
            className="text-2xl font-medium tracking-[-0.025em]"
          >
            For intrusive thoughts
          </h2>
          <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            A separate method for OCD-style loops, alongside the course.
          </p>
        </div>
        <Link
          to="/ladder"
          className="group flex items-center gap-4 rounded-[28px] border border-border bg-card p-6 shadow-(--surface-shadow) transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 motion-reduce:transition-none sm:p-8"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-peach-soft text-peach-ink">
            <ShieldCheck aria-hidden className="size-5" strokeWidth={1.9} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-lg font-medium tracking-[-0.02em]">
              Facing intrusive thoughts
            </span>
            <span className="text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
              Build a ladder of triggers, from easiest to hardest, and practise
              facing them without the compulsion.
            </span>
          </span>
          <ChevronRight
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground/60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
            strokeWidth={2}
          />
        </Link>
      </section>

      {/* Plain-English psychoeducation — learn how these self-help methods work */}
      <section aria-labelledby="how-works-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2
            id="how-works-heading"
            className="text-2xl font-medium tracking-[-0.025em]"
          >
            How these methods work
          </h2>
          <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            Understanding the loop makes it easier to practise on your own.
          </p>
        </div>
        <div className="divide-y divide-border rounded-[28px] border border-border bg-card shadow-(--surface-shadow)">
          {HOW_IT_WORKS.map((item) => (
            <details key={item.title} className="group">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-blush-hover sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="font-medium text-foreground">{item.title}</span>
                <ChevronRight
                  aria-hidden
                  className="ml-auto size-4 text-muted-foreground/60 transition-transform group-open:rotate-90 motion-reduce:transition-none"
                  strokeWidth={2}
                />
              </summary>
              <p className="max-w-[60ch] px-5 pb-5 text-sm leading-relaxed text-pretty text-muted-foreground sm:px-6 sm:text-base">
                {item.detail}
              </p>
            </details>
          ))}
        </div>
      </section>
    </Page>
  )
}
