import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Flame } from '@/components/flame'
import { CALM_ITEM, NAV_ITEMS } from '@/lib/nav'
import { SITE_DESCRIPTION, SITE_NAME, seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/')({
  head: () => ({
    meta: seo({ title: SITE_NAME, description: SITE_DESCRIPTION }),
  }),
  component: Today,
})

const sections = NAV_ITEMS.slice(1)

function Today() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-5 pt-10 pb-16 sm:pt-16">
      <section className="flex flex-col gap-6">
        <div className="relative w-fit">
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 size-44 -translate-1/2 rounded-full bg-(image:--grad-dawn) opacity-45 blur-3xl"
          />
          <Flame settle className="relative h-24" />
        </div>
        <h1 className="w-fit bg-(image:--grad-dawn) bg-clip-text pb-1 text-5xl leading-[1.05] font-semibold tracking-tight text-balance text-transparent sm:text-7xl">
          When the mind wanders, bring it back.
        </h1>
        <p className="max-w-[50ch] text-lg leading-relaxed text-pretty text-muted-foreground">
          That is the whole practice. Charioteer gives you guided meditation,
          focus sessions, and help for the moments your thoughts will not stop.
        </p>
      </section>

      <nav aria-label="Sections" className="flex flex-col gap-4">
        <Link
          to={CALM_ITEM.to}
          className={cn(
            'group flex items-center gap-4 rounded-3xl p-5 text-white shadow-(--tile-shadow) transition-[filter] hover:brightness-110 sm:p-6',
            CALM_ITEM.gradient,
          )}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <CALM_ITEM.icon className="size-6" strokeWidth={1.75} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-xl font-semibold">{CALM_ITEM.label}</span>
            <span className="text-pretty text-white/90">
              {CALM_ITEM.description}
            </span>
          </span>
          <ArrowRight
            aria-hidden
            className="size-5 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Link>

        <ul className="grid gap-4 sm:grid-cols-3">
          {sections.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="group flex h-full flex-col gap-4 rounded-3xl border bg-card p-5 shadow-(--tile-shadow) backdrop-blur-md transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
              >
                <span
                  className={cn(
                    'flex size-12 items-center justify-center rounded-2xl text-white',
                    item.gradient,
                  )}
                >
                  <item.icon className="size-6" strokeWidth={1.75} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-xl font-semibold">{item.label}</span>
                  <span className="text-pretty text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex max-w-[58ch] flex-col gap-3 text-sm leading-relaxed text-pretty text-muted-foreground">
        <p>
          There is no account and nothing to sign up for. What you do here
          stays on this device.
        </p>
        <p>
          Charioteer is practice, not therapy. If you are in danger or in
          crisis, call your local emergency number or a crisis line now.
        </p>
      </div>
    </main>
  )
}
