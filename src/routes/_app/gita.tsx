import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { GitaSearch } from '@/components/gita/gita-search'
import { useSavedVerses } from '@/components/gita/save-button'
import { Page } from '@/components/page'
import {
  CHAPTERS,
  FACING,
  GLOSSARY,
  TOTAL_VERSES,
  getChapter,
  hasVerse,
  parseRef,
} from '@/content/gita'
import { useStored } from '@/hooks/use-stored'
import { LAST_READ_KEY, type LastRead } from '@/lib/gita-reading'
import { NAV_ITEMS } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'

export const Route = createFileRoute('/_app/gita')({
  head: () => ({
    meta: seo({
      title: `Gita | ${SITE_NAME}`,
      description: NAV_ITEMS[3].description,
    }),
  }),
  component: GitaPage,
})

const sectionHeading = 'text-2xl font-medium tracking-[-0.025em]'
const sectionNote =
  'max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base'

function VerseChip({ reference }: Readonly<{ reference: string }>) {
  const verse = parseRef(reference)
  if (!hasVerse(verse)) return null
  return (
    <Link
      to="/gita/$chapter/$verse"
      params={{ chapter: String(verse.chapter), verse: String(verse.verse) }}
      className="rounded-full bg-yellow-soft px-3 py-1 text-sm font-medium text-yellow-ink tabular-nums ring-1 ring-border transition-colors hover:bg-pink-soft hover:text-pink-ink"
    >
      {reference}
    </Link>
  )
}

function GitaPage() {
  const [stored] = useStored<LastRead | null>(LAST_READ_KEY, null)
  const [saved] = useSavedVerses()
  // The saved place, if there is a valid one. Otherwise reading starts at 1.1.
  const lastRead = stored && hasVerse(stored) ? stored : null
  const place = lastRead ?? { chapter: 1, verse: 1 }
  const placeChapter = getChapter(place.chapter) ?? CHAPTERS[0]

  return (
    <Page
      title="Gita"
      lede={NAV_ITEMS[3].description}
      icon={NAV_ITEMS[3].icon}
      badgeClass={NAV_ITEMS[3].badgeClass}
    >
      <section aria-label="Find a verse" className="flex flex-col gap-4">
        <GitaSearch />

        <Link
          to="/gita/$chapter"
          params={{ chapter: String(place.chapter) }}
          hash={lastRead ? `v${lastRead.verse}` : undefined}
          className="group flex items-center gap-4 rounded-[28px] border border-border bg-(image:--grad-folio) p-6 shadow-(--surface-shadow) transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 motion-reduce:transition-none"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-sm font-medium text-pink-ink">
              {lastRead ? 'Continue reading' : 'Start reading'}
            </span>
            <span className="text-xl font-medium tracking-[-0.02em]">
              Chapter {place.chapter}, verse {place.verse}
            </span>
            <span className="text-sm text-muted-foreground">
              {placeChapter.name}. {placeChapter.about}.
            </span>
          </span>
          <ChevronRight
            aria-hidden
            className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </section>

      <section aria-labelledby="chapters-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 id="chapters-heading" className={sectionHeading}>
            Chapters
          </h2>
          <p className={sectionNote}>
            All eighteen chapters, {TOTAL_VERSES} verses. Each chapter opens as
            one page you can read straight through.
          </p>
        </div>
        <ol className="divide-y divide-border overflow-hidden rounded-[28px] border border-border bg-card shadow-(--surface-shadow)">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.chapter}>
              <Link
                to="/gita/$chapter"
                params={{ chapter: String(chapter.chapter) }}
                className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-blush-hover sm:px-6"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-peach-soft text-sm font-medium text-peach-ink tabular-nums ring-1 ring-border">
                  {chapter.chapter}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-medium">{chapter.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {chapter.about}. {chapter.length} verses.
                  </span>
                </span>
                <ChevronRight
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground/60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
                  strokeWidth={2}
                />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {saved.length > 0 && (
        <section aria-labelledby="saved-heading" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 id="saved-heading" className={sectionHeading}>
              Saved verses
            </h2>
            <p className={sectionNote}>Kept on this device.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {saved.map((reference) => (
              <VerseChip key={reference} reference={reference} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="facing-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 id="facing-heading" className={sectionHeading}>
            Start from what you are facing
          </h2>
          <p className={sectionNote}>
            Each line leads to the verses that speak to it most directly.
          </p>
        </div>
        <ul className="divide-y divide-border rounded-[28px] border border-border bg-(image:--grad-folio) px-5 shadow-(--surface-shadow) sm:px-7">
          {FACING.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 py-4"
            >
              <span className="font-medium">{item.label}</span>
              <span className="flex flex-wrap gap-2">
                {item.verses.map((reference) => (
                  <VerseChip key={reference} reference={reference} />
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="terms-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 id="terms-heading" className={sectionHeading}>
            Words kept in Sanskrit
          </h2>
          <p className={sectionNote}>
            Some words have no single English equivalent, so the translation
            leaves them as they are. Each one opens to show its range of
            meaning.
          </p>
        </div>
        <div className="divide-y divide-border rounded-[28px] border border-border bg-card shadow-(--surface-shadow)">
          {GLOSSARY.map((term) => (
            <details key={term.id} id={`term-${term.id}`} className="group">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-blush-hover sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="font-medium">{term.sa}</span>
                <span lang="sa" className="font-serif text-muted-foreground">
                  {term.devanagari}
                </span>
                <ChevronRight
                  aria-hidden
                  className="ml-auto size-4 text-muted-foreground/60 transition-transform group-open:rotate-90 motion-reduce:transition-none"
                  strokeWidth={2}
                />
              </summary>
              <p className="max-w-[60ch] px-5 pb-5 leading-relaxed text-pretty text-muted-foreground sm:px-6">
                {term.meaning}
              </p>
            </details>
          ))}
        </div>
      </section>

      <p className="max-w-[58ch] border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-pretty text-muted-foreground">
        The Sanskrit text is the source. Each verse has two English versions:
        a plain one for reading straight through, and a literal one that
        follows the Sanskrit word by word. Where a verse can be read in more
        than one way, its page says so.
      </p>
    </Page>
  )
}
