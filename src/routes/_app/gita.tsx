import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Page } from '@/components/page'
import {
  CHAPTERS,
  FACING,
  GLOSSARY,
  VERSES,
  getVerseByRef,
} from '@/content/gita'
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
  const verse = getVerseByRef(reference)
  if (!verse) return null
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
  return (
    <Page
      title="Gita"
      lede={NAV_ITEMS[3].description}
      icon={NAV_ITEMS[3].icon}
      badgeClass={NAV_ITEMS[3].badgeClass}
    >
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

      <section aria-labelledby="verses-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 id="verses-heading" className={sectionHeading}>
            Verses
          </h2>
          <p className={sectionNote}>
            The reader begins with {VERSES.length} verses on the restless mind.
            The rest of these two chapters, and then the other sixteen, are
            being added.
          </p>
        </div>
        {CHAPTERS.map((chapter) => {
          const verses = VERSES.filter(
            (verse) => verse.chapter === chapter.chapter,
          )
          return (
            <div key={chapter.chapter} className="flex flex-col gap-3">
              <h3 className="flex flex-wrap items-baseline gap-x-3 text-lg font-medium">
                Chapter {chapter.chapter}: {chapter.name}
                <span className="text-sm font-normal text-muted-foreground">
                  {chapter.about}. {verses.length} of {chapter.length} verses.
                </span>
              </h3>
              <ol className="divide-y divide-border rounded-[28px] border border-border bg-card shadow-(--surface-shadow)">
                {verses.map((verse) => (
                  <li key={verse.verse}>
                    <Link
                      to="/gita/$chapter/$verse"
                      params={{
                        chapter: String(verse.chapter),
                        verse: String(verse.verse),
                      }}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-blush-hover sm:px-6"
                    >
                      <span className="w-10 shrink-0 text-sm font-medium text-peach-ink tabular-nums">
                        {verse.chapter}.{verse.verse}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span
                          lang="sa"
                          className="truncate font-serif text-lg leading-relaxed"
                        >
                          {verse.devanagari[0]}
                        </span>
                        <span className="truncate text-sm text-muted-foreground">
                          {verse.translation}
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
            </div>
          )
        })}
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
        The Sanskrit text is the source. The English is a literal working
        translation built word by word, so it reads more plainly than a
        polished one. Where a verse can be read in more than one way, the word
        meanings show the choice that was made.
      </p>
    </Page>
  )
}
