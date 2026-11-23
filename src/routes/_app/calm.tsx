import { Link, createFileRoute } from '@tanstack/react-router'
import { Page } from '@/components/page'
import { Button } from '@/components/ui/button'
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

const steps = [
  {
    badge: 'bg-pink-soft text-pink-ink',
    title: 'Notice the loop',
    detail:
      'Take one slow exhale and spot that a thought is repeating, without trying to force it away.',
  },
  {
    badge: 'bg-peach-soft text-peach-ink',
    title: 'Name it without arguing',
    detail:
      'Treat the thought as a false alarm from a sensitive nervous system rather than a problem you must solve right now.',
  },
  {
    badge: 'bg-yellow-soft text-yellow-ink',
    title: 'Return to the body',
    detail:
      'Feel your feet, your hands, and the room around you until the wave of urgency softens.',
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
      <section className="overflow-hidden rounded-[28px] border border-border bg-(image:--grad-sanctuary) p-6 shadow-(--surface-shadow) sm:p-8">
        <ol className="divide-y divide-border">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 py-5 first:pt-0 last:pb-0 sm:gap-5"
            >
              <span
                className={cn(
                  'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ring-1 ring-border',
                  step.badge,
                )}
              >
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-medium tracking-[-0.02em] text-foreground">
                  {step.title}
                </h2>
                <p className="max-w-[50ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild className="h-12 rounded-full px-8 text-base">
            <Link to="/calm/now">Start now</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full px-8 text-base"
          >
            <Link to="/calm/delay">Delay an urge</Link>
          </Button>
        </div>
        <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground">
          Start now walks you through these three steps at your own pace.
          Delay an urge is for a pull to check, fix or ask for reassurance: you
          wait a few minutes and watch what the urge does.
        </p>
        <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground">
          This is practice, not therapy. If you are in danger or in crisis,
          call your local emergency number or a crisis line now.
        </p>
      </div>
    </Page>
  )
}
