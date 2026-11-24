import { Link, createFileRoute } from '@tanstack/react-router'
import { Bookmark, BookOpen, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GitaSearch } from '@/components/gita/gita-search'
import {
  SaveButton,
  toggleSaved,
  useSavedVerses,
} from '@/components/gita/save-button'
import { TranslationReviewNote } from '@/components/gita/translation-review-note'
import { Page } from '@/components/page'
import {
  CHAPTERS,
  FACING,
  GLOSSARY,
  TOTAL_VERSES,
  type Verse,
  getChapter,
  hasVerse,
  loadVerse,
  parseRef,
} from '@/content/gita'
import {
  BOOK_SHAPE,
  OTHER_NAMES,
  READING_NOTE,
  STORY_SO_FAR,
  VOICES,
} from '@/content/gita/guide'
import { useStored } from '@/hooks/use-stored'
import { LAST_READ_KEY, type LastRead } from '@/lib/gita-reading'
import { NAV_ITEMS } from '@/lib/nav'
import { SITE_NAME, seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/gita')({
  head: () => ({
    meta: seo({
      title: `Bhagavad Gita | ${SITE_NAME}`,
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

const startSummary =
  'flex cursor-pointer list-none items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-blush-hover sm:px-6 [&::-webkit-details-marker]:hidden'
const startBody = 'flex flex-col gap-4 px-5 pt-1 pb-6 sm:px-6'
const startProse =
  'max-w-[62ch] text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground sm:text-base'

function StartChevron() {
  return (
    <ChevronRight
      aria-hidden
      className="ml-auto size-4 shrink-0 text-muted-foreground/60 transition-transform group-open:rotate-90 motion-reduce:transition-none"
      strokeWidth={2}
    />
  )
}

function GitaPage() {
  const [stored] = useStored<LastRead | null>(LAST_READ_KEY, null)
  const [saved, setSaved] = useSavedVerses()
  const [ribbonVerse, setRibbonVerse] = useState<Verse | null>(null)
  const [savedExcerpts, setSavedExcerpts] = useState<Record<string, string>>({})

  // The saved place, if there is a valid one. Otherwise reading starts at 1.1.
  const lastRead = stored && hasVerse(stored) ? stored : null
  const place = lastRead ?? { chapter: 1, verse: 1 }
  const placeChapter = getChapter(place.chapter) ?? CHAPTERS[0]

  // Lazily load the excerpt for the bookmark ribbon.
  useEffect(() => {
    let cancelled = false
    void loadVerse(place).then((found) => {
      if (!cancelled) setRibbonVerse(found ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [place.chapter, place.verse])

  // Lazily load excerpts for saved verses so bookmarks read like dog-eared pages.
  useEffect(() => {
    if (saved.length === 0) {
      setSavedExcerpts({})
      return
    }
    let cancelled = false
    void Promise.all(
      saved.map(async (ref) => {
        const parsed = parseRef(ref)
        const found = await loadVerse(parsed)
        return [ref, found?.plain ?? found?.translation ?? ''] as const
      }),
    ).then((pairs) => {
      if (!cancelled) setSavedExcerpts(Object.fromEntries(pairs))
    })
    return () => {
      cancelled = true
    }
  }, [saved])

  const ribbonExcerpt = ribbonVerse?.plain ?? ribbonVerse?.translation

  return (
    <Page
      title="Bhagavad Gita"
      lede={NAV_ITEMS[3].description}
      icon={NAV_ITEMS[3].icon}
      badgeClass={NAV_ITEMS[3].badgeClass}
    >
      <section aria-label="Find a verse" className="flex flex-col gap-5">
        <GitaSearch />

        {/* Bookmark ribbon card — shows your actual place in the text */}
        <div className="flex flex-col gap-5 rounded-[28px] border border-border bg-(image:--grad-folio) p-6 shadow-(--surface-shadow) sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-pink-ink sm:text-sm">
                <Bookmark aria-hidden className="size-3.5" strokeWidth={2} />
                {lastRead ? 'Your reading ribbon' : 'Begin the book'}
              </span>
              <p className="font-serif text-xl font-medium tracking-[-0.015em] text-foreground sm:text-2xl">
                Chapter {place.chapter}, verse {place.verse}
              </p>
              <p className="text-sm text-muted-foreground">
                {placeChapter.name} · {placeChapter.about}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground tabular-nums ring-1 ring-border">
              {place.verse} / {placeChapter.length}
            </span>
          </div>

          {ribbonExcerpt && (
            <p className="line-clamp-2 border-l-2 border-primary/45 pl-4 font-serif text-base leading-relaxed text-pretty text-foreground/90 sm:text-lg">
              “{ribbonExcerpt}”
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Link
              to="/gita/$chapter"
              params={{ chapter: String(place.chapter) }}
              hash={lastRead ? `v${place.verse}` : undefined}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <span>{lastRead ? 'Continue chapter' : 'Read chapter 1'}</span>
              <ChevronRight aria-hidden className="size-4" strokeWidth={2} />
            </Link>
            <Link
              to="/gita/$chapter/$verse"
              params={{
                chapter: String(place.chapter),
                verse: String(place.verse),
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-blush-hover"
            >
              <BookOpen aria-hidden className="size-3.5 text-muted-foreground" />
              <span>Verse by verse</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Everything a first-time reader needs before verse 1.1 */}
      <section
        id="start-here"
        aria-labelledby="start-heading"
        className="flex scroll-mt-6 flex-col gap-5"
      >
        <div className="flex flex-col gap-1.5">
          <h2 id="start-heading" className={sectionHeading}>
            New to the Bhagavad Gita? Start here
          </h2>
          <p className={sectionNote}>
            The book is a conversation. It is much easier to follow once you
            know who is talking and what has just happened. Every chapter also
            opens with where things stand and closes with a short summary.
          </p>
        </div>
        <div className="divide-y divide-border overflow-hidden rounded-[28px] border border-border bg-card shadow-(--surface-shadow)">
          <details className="group" open>
            <summary className={startSummary}>
              <span className="font-medium">The story so far</span>
              <StartChevron />
            </summary>
            <div className={startBody}>
              {STORY_SO_FAR.map((paragraph) => (
                <p key={paragraph} className={startProse}>
                  {paragraph}
                </p>
              ))}
            </div>
          </details>

          <details className="group">
            <summary className={startSummary}>
              <span className="font-medium">The four voices</span>
              <StartChevron />
            </summary>
            <dl className={startBody}>
              {VOICES.map((voice) => (
                <div key={voice.speaker} className="flex flex-col gap-1">
                  <dt className="flex flex-wrap items-baseline gap-x-2.5">
                    <span className="font-medium text-foreground">
                      {voice.name}
                    </span>
                    <span className="text-sm text-yellow-ink">{voice.role}</span>
                  </dt>
                  <dd className={startProse}>{voice.about}</dd>
                </div>
              ))}
            </dl>
          </details>

          <details className="group">
            <summary className={startSummary}>
              <span className="font-medium">
                Other names for Arjuna and Kṛṣṇa
              </span>
              <StartChevron />
            </summary>
            <div className={startBody}>
              <p className={startProse}>
                Both are addressed by many names. No new character is arriving:
                it is always one of these two.
              </p>
              {OTHER_NAMES.map((group) => (
                <div key={group.of} className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium text-pink-ink">
                    {group.of}
                  </h3>
                  <dl className="grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2">
                    {group.names.map((item) => (
                      <div
                        key={item.name}
                        className="flex flex-wrap items-baseline gap-x-2 text-sm"
                      >
                        <dt className="font-medium text-foreground">
                          {item.name}
                        </dt>
                        <dd className="text-muted-foreground">{item.means}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </details>

          <details className="group">
            <summary className={startSummary}>
              <span className="font-medium">How the book unfolds</span>
              <StartChevron />
            </summary>
            <div className={startBody}>
              <ol className="flex flex-col gap-3.5">
                {BOOK_SHAPE.map((part) => (
                  <li key={part.from} className="flex gap-4">
                    <Link
                      to="/gita/$chapter"
                      params={{ chapter: String(part.from) }}
                      className="h-fit w-16 shrink-0 rounded-full bg-peach-soft px-2 py-0.5 text-center text-xs font-medium text-peach-ink tabular-nums ring-1 ring-border transition-colors hover:bg-pink-soft hover:text-pink-ink"
                    >
                      {part.from === part.to
                        ? `Ch. ${part.from}`
                        : `Ch. ${part.from}–${part.to}`}
                    </Link>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="font-medium text-foreground">
                        {part.title}
                      </span>
                      <span className="text-sm leading-relaxed text-pretty text-muted-foreground">
                        {part.about}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className={cn(startProse, 'border-t border-border/80 pt-4')}>
                {READING_NOTE}
              </p>
            </div>
          </details>
        </div>
      </section>

      {saved.length > 0 && (
        <section aria-labelledby="saved-heading" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 id="saved-heading" className={sectionHeading}>
              Saved verses
            </h2>
            <p className={sectionNote}>
              Dog-eared pages kept on this device.
            </p>
          </div>
          <ol className="divide-y divide-border overflow-hidden rounded-[28px] border border-border bg-card shadow-(--surface-shadow)">
            {saved.map((reference) => {
              const parsed = parseRef(reference)
              if (!hasVerse(parsed)) return null
              const excerpt = savedExcerpts[reference]
              return (
                <li key={reference} className="flex items-center gap-2 pr-3">
                  <Link
                    to="/gita/$chapter/$verse"
                    params={{
                      chapter: String(parsed.chapter),
                      verse: String(parsed.verse),
                    }}
                    className="group flex min-w-0 flex-1 items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-blush-hover sm:px-6"
                  >
                    <span className="w-11 shrink-0 pt-0.5 text-sm font-medium text-peach-ink tabular-nums">
                      {reference}
                    </span>
                    <span className="line-clamp-2 min-w-0 flex-1 font-serif text-base leading-relaxed text-pretty text-foreground">
                      {excerpt ||
                        `Chapter ${parsed.chapter}, verse ${parsed.verse}`}
                    </span>
                  </Link>
                  <SaveButton
                    reference={reference}
                    saved
                    onToggle={(ref) =>
                      setSaved((current) => toggleSaved(current, ref))
                    }
                    className="shrink-0"
                  />
                </li>
              )
            })}
          </ol>
        </section>
      )}

      {/* Compact 2-column Table of Contents on desktop */}
      <section aria-labelledby="chapters-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 id="chapters-heading" className={sectionHeading}>
            Table of contents
          </h2>
          <p className={sectionNote}>
            All eighteen chapters, {TOTAL_VERSES} verses. Read a whole chapter
            straight through or flip verse by verse.
          </p>
        </div>
        <ol className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-[28px] border border-border bg-card shadow-(--surface-shadow) sm:grid-cols-2 sm:divide-y-0">
          {CHAPTERS.map((chapter, index) => {
            const isHere = lastRead?.chapter === chapter.chapter
            return (
              <li
                key={chapter.chapter}
                className={cn(
                  'sm:border-b sm:border-border',
                  index % 2 === 0 && 'sm:border-r',
                  index >= CHAPTERS.length - 2 && 'sm:border-b-0',
                )}
              >
                <Link
                  to="/gita/$chapter"
                  params={{ chapter: String(chapter.chapter) }}
                  className="group flex h-full items-center gap-3.5 px-5 py-4 transition-colors hover:bg-surface-blush-hover"
                >
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium tabular-nums ring-1 ring-border',
                      isHere
                        ? 'bg-pink-soft text-pink-ink'
                        : 'bg-peach-soft text-peach-ink',
                    )}
                  >
                    {chapter.chapter}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium text-foreground">
                      {chapter.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground sm:text-sm">
                      {chapter.about} · {chapter.length}
                    </span>
                  </span>
                  <ChevronRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
                    strokeWidth={2}
                  />
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

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

      <div className="flex flex-col gap-3 border-l-2 border-primary/50 pl-4">
        <TranslationReviewNote />
        <p className="max-w-[58ch] text-sm leading-relaxed text-pretty text-muted-foreground">
          The Sanskrit text is the source. Each verse has two English versions: a
          plain one for reading straight through, and a literal one that follows
          the Sanskrit word by word. Where a verse can be read in more than one
          way, its page says so.
        </p>
      </div>
    </Page>
  )
}
