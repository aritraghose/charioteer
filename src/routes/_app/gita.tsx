import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltYet, Page } from '@/components/page'
import { NAV_ITEMS } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/gita')({
  head: () => ({
    meta: seo({
      title: `Gita | ${SITE_NAME}`,
      description: NAV_ITEMS[3].description,
    }),
  }),
  component: GitaPage,
})

const wordByWord = [
  { sanskrit: 'yathā', meaning: 'just as', tint: 'bg-yellow-soft/80' },
  { sanskrit: 'dīpaḥ', meaning: 'a lamp', tint: 'bg-pink-soft/80' },
  {
    sanskrit: 'nivāta-sthaḥ',
    meaning: 'in a windless place',
    tint: 'bg-peach-soft/80',
  },
  {
    sanskrit: 'na iṅgate',
    meaning: 'does not flicker',
    tint: 'bg-yellow-soft/80',
  },
] as const

function GitaPage() {
  return (
    <Page
      title="Gita"
      lede={NAV_ITEMS[3].description}
      icon={NAV_ITEMS[3].icon}
      badgeClass={NAV_ITEMS[3].badgeClass}
    >
      <article className="flex flex-col gap-7 overflow-hidden rounded-[28px] border border-border bg-(image:--grad-folio) p-6 shadow-(--surface-shadow) sm:p-9">
        <p className="inline-flex w-fit rounded-full bg-yellow-soft px-3 py-1 text-xs font-medium text-yellow-ink ring-1 ring-border">
          Chapter 6, Verse 19
        </p>

        <div className="flex flex-col gap-2">
          <p
            lang="sa"
            className="font-serif text-2xl leading-relaxed text-foreground sm:text-3xl"
          >
            यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता ।
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground italic sm:text-base">
            yathā dīpo nivāta-stho neṅgate sopamā smṛtā
          </p>
        </div>

        <p className="max-w-[48ch] font-serif text-xl leading-relaxed text-pretty text-foreground sm:text-2xl">
          “Like a lamp in a windless place, that does not flicker — such is the
          simile recalled for the steady mind.”
        </p>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {wordByWord.map((entry) => (
            <div
              key={entry.sanskrit}
              className={cn(
                'flex flex-col gap-0.5 rounded-2xl px-4 py-3 ring-1 ring-border',
                entry.tint,
              )}
            >
              <dt className="text-sm font-medium text-foreground">
                {entry.sanskrit}
              </dt>
              <dd className="text-xs leading-relaxed text-muted-foreground">
                {entry.meaning}
              </dd>
            </div>
          ))}
        </dl>
      </article>

      <NotBuiltYet>
        The full reader is not built yet. Each verse will include the Sanskrit
        text, transliteration, word-by-word meanings, and plain reflections you
        can carry into everyday life.
      </NotBuiltYet>
    </Page>
  )
}
