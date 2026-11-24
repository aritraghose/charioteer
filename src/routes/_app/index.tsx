import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { GITHUB_REPO_URL, GitHubIcon } from '@/components/brand-icons'
import { TranslationReviewNote } from '@/components/gita/translation-review-note'
import { Logo } from '@/components/logo'
import { CALM_ITEM, NAV_ITEMS } from '@/lib/nav'
import { SITE_DESCRIPTION, SITE_NAME, seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/')({
  head: () => ({
    meta: seo({ title: SITE_NAME, description: SITE_DESCRIPTION }),
  }),
  component: Today,
})

const practiceItem = NAV_ITEMS[1]
const focusItem = NAV_ITEMS[2]
const gitaItem = NAV_ITEMS[3]

function Today() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-14 px-5 pt-10 pb-20 sm:px-8 sm:pt-16">
      {/* Calm hero paired with the concentric stillness medallion */}
      <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1.25fr_0.75fr] md:gap-10">
        <div className="flex flex-col gap-5">
          <h1 className="max-w-[14ch] text-5xl leading-[1.03] font-medium tracking-[-0.042em] text-balance text-foreground sm:text-6xl lg:text-7xl">
            When the mind wanders, bring it back.
          </h1>
          <p className="max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl sm:leading-relaxed">
            A quiet space for OCD, racing thoughts and a sensitive nervous
            system. Gentle meditation, steady focus, and the Bhagavad Gita.
          </p>
        </div>

        {/* Stillness medallion: soft rings breathe slowly around a flame that holds still. */}
        <div
          aria-hidden
          className="relative mx-auto flex size-56 items-center justify-center sm:size-64 md:mr-0 md:ml-auto lg:size-72"
        >
          <div className="pointer-events-none absolute -inset-6 bg-(image:--grad-orb) sm:-inset-10" />
          <span className="ring-breathe absolute inset-0 rounded-full bg-medallion-outer shadow-(--medallion-ring)" />
          <span className="ring-breathe absolute inset-[13%] rounded-full bg-medallion-mid shadow-(--medallion-ring) [animation-delay:-3s]" />
          <span className="absolute inset-[27%] rounded-full bg-medallion-inner shadow-(--medallion-core)" />

          <Logo settle className="relative size-20 lg:size-24" />
        </div>
      </section>

      {/* Two bespoke sculptural surfaces: sanctuary left, Gita folio right */}
      <section
        aria-label="Spaces"
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-stretch"
      >
        {/* Left: Calm sanctuary surface */}
        <div className="flex flex-col justify-between gap-5 overflow-hidden rounded-[28px] border border-border bg-(image:--grad-sanctuary) p-4 shadow-(--surface-shadow) sm:p-8">
          <Link
            to={CALM_ITEM.to}
            className="group flex flex-col gap-5 rounded-2xl border border-lifeline-border bg-(image:--lifeline-surface) p-6 text-lifeline-ink shadow-(--lifeline-shadow) transition-[background-image,border-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-(image:--lifeline-surface-hover) active:translate-y-0 active:scale-[0.99] motion-reduce:transition-none sm:flex-row sm:items-center sm:gap-5"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-lifeline-badge text-lifeline-badge-ink">
              <CALM_ITEM.icon className="size-5" strokeWidth={1.9} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-xl font-medium tracking-[-0.02em] text-foreground">
                {CALM_ITEM.label}
              </span>
              <span className="max-w-[40ch] text-sm leading-relaxed text-pretty text-muted-foreground">
                {CALM_ITEM.description}
              </span>
            </span>
            <span className="flex size-9 shrink-0 items-center justify-center self-start rounded-full bg-lifeline-arrow text-lifeline-arrow-ink transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none sm:self-center">
              <ChevronRight aria-hidden className="size-4" strokeWidth={2.1} />
            </span>
          </Link>

          <div className="grid flex-1 grid-cols-1 divide-y divide-border rounded-2xl bg-card ring-1 ring-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {[practiceItem, focusItem].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex flex-col justify-between gap-5 p-5 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-surface-blush-hover sm:p-6 sm:first:rounded-l-2xl sm:first:rounded-tr-none sm:last:rounded-r-2xl sm:last:rounded-bl-none"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'flex size-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none',
                      item.badgeClass,
                    )}
                  >
                    <item.icon className="size-[1.1rem]" strokeWidth={1.9} />
                  </span>
                  <ChevronRight
                    aria-hidden
                    className="size-4 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-medium tracking-[-0.02em] text-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm leading-relaxed text-pretty text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Sunlit butter-yellow & blossom Bhagavad Gita folio */}
        <Link
          to={gitaItem.to}
          className="group flex flex-col justify-between gap-8 rounded-[28px] border border-border bg-(image:--grad-folio) p-6 shadow-(--surface-shadow) transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 motion-reduce:transition-none sm:p-8"
        >
          <div className="flex items-center">
            <span className="inline-flex items-center gap-2.5 text-sm font-medium text-foreground">
              <span
                className={cn(
                  'flex size-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none',
                  gitaItem.badgeClass,
                )}
              >
                <gitaItem.icon className="size-[1.1rem]" strokeWidth={1.9} />
              </span>
              <span>Bhagavad Gita</span>
            </span>
          </div>

          <figure className="flex flex-col gap-3.5">
            <p
              lang="sa"
              className="font-serif text-xl leading-relaxed text-foreground/85"
            >
              यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता ।
            </p>
            <p lang="sa-Latn" className="-mt-1.5 text-sm text-muted-foreground italic">
              yathā dīpo nivāta-stho neṅgate sopamā smṛtā
            </p>
            <blockquote className="font-serif text-xl leading-relaxed text-pretty text-foreground sm:text-2xl">
              “Like a lamp in a windless place, that does not flicker.”
            </blockquote>
            <figcaption className="inline-flex w-fit rounded-full bg-yellow-soft px-3 py-0.5 text-xs font-medium text-yellow-ink">
              Chapter 6, Verse 19
            </figcaption>
            <TranslationReviewNote className="pt-0.5" />
          </figure>

          <div className="flex flex-col gap-2 border-t border-border/80 pt-5">
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
              {gitaItem.description}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-pink-ink">
              Open Bhagavad Gita reader
              <ChevronRight
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                strokeWidth={2.2}
              />
            </span>
          </div>
        </Link>
      </section>

      <footer className="flex flex-col justify-between gap-3 border-t border-border/75 pt-7 text-sm leading-relaxed text-pretty text-muted-foreground sm:flex-row sm:items-center sm:gap-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p>No account. Everything you do here stays on this device.</p>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground/85 transition-colors hover:text-foreground"
          >
            <GitHubIcon className="size-3.5" />
            <span>GitHub</span>
          </a>
        </div>
        <p className="text-xs sm:text-right sm:text-sm">
          Practice, not therapy. In crisis, call your local emergency line.
        </p>
      </footer>
    </main>
  )
}
