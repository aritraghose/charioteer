import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Clock, Eye, Waves, Wind } from 'lucide-react'
import { Page } from '@/components/page'
import { RightNowMatcher } from '@/components/right-now-matcher'
import { CALM_ITEM } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/calm')({
  head: () => ({
    meta: seo({
      title: `Mind racing? | ${SITE_NAME}`,
      description: CALM_ITEM.description,
    }),
  }),
  component: CalmPage,
})

const directTools = [
  {
    to: '/calm/now' as const,
    icon: Waves,
    badge: 'bg-pink-soft text-pink-ink',
    title: 'Notice & name a loop',
    detail: 'Spot a repeating thought, name its kind, and leave it unanswered.',
  },
  {
    to: '/calm/delay' as const,
    icon: Clock,
    badge: 'bg-peach-soft text-peach-ink',
    title: 'Delay an urge',
    detail: 'Wait 5–15 minutes before checking, fixing, or asking for reassurance.',
  },
  {
    to: '/calm/ground' as const,
    icon: Eye,
    badge: 'bg-yellow-soft text-yellow-ink',
    title: '5-4-3-2-1 grounding',
    detail: 'Eyes-open reset using what you can see, touch, and hear right now.',
  },
  {
    to: '/calm/breathe' as const,
    icon: Wind,
    badge: 'bg-yellow-soft text-yellow-ink',
    title: '2-minute breathing pacer',
    detail: 'Longer exhale, physiological sigh, or box breath with a live pacer.',
  },
] as const

function CalmPage() {
  return (
    <Page
      title="Mind racing?"
      lede={CALM_ITEM.description}
      icon={CALM_ITEM.icon}
      accent="lifeline"
    >
      <RightNowMatcher />

      <section aria-labelledby="direct-tools-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2
            id="direct-tools-heading"
            className="text-xl font-medium tracking-[-0.02em] text-foreground"
          >
            Or jump straight to a tool
          </h2>
          <p className="text-sm text-muted-foreground">
            Short, self-guided resets you can use at any time, with eyes open.
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-[28px] border border-border bg-card shadow-(--surface-shadow) sm:grid-cols-2 sm:divide-y-0">
          {directTools.map((tool, index) => (
            <Link
              key={tool.to}
              to={tool.to}
              className={cn(
                'group flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-surface-blush-hover sm:p-6',
                index < 2 && 'sm:border-b sm:border-border',
                index % 2 === 0 && 'sm:border-r sm:border-border',
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-xl',
                    tool.badge,
                  )}
                >
                  <tool.icon className="size-[1.1rem]" strokeWidth={1.9} />
                </span>
                <ChevronRight
                  aria-hidden
                  className="size-4 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
                  strokeWidth={2}
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-medium tracking-[-0.015em] text-foreground sm:text-lg">
                  {tool.title}
                </h3>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                  {tool.detail}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <p className="max-w-[56ch] border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-pretty text-muted-foreground">
        This is evidence-based self-help practice, not medical care or therapy.
        Nothing here asks for personal details or diagnoses you. If you are in
        danger or in crisis, call your local emergency number or a crisis line
        now.
      </p>
    </Page>
  )
}
