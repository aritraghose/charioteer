import {
  Link,
  createFileRoute,
  notFound,
  useNavigate,
} from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type TouchEvent, useEffect, useRef } from 'react'
import { BookBar } from '@/components/gita/book-bar'
import { useReadingOptions } from '@/components/gita/reading-options'
import {
  SaveButton,
  toggleSaved,
  useSavedVerses,
} from '@/components/gita/save-button'
import { TranslationReviewNote } from '@/components/gita/translation-review-note'
import { WordStudy } from '@/components/gita/word-study'
import {
  SPEAKER_NAME,
  getChapter,
  loadVerse,
  neighbours,
  verseRef,
} from '@/content/gita'
import { useStored } from '@/hooks/use-stored'
import {
  LAST_READ_KEY,
  type LastRead,
  SIZE_CLASSES,
} from '@/lib/gita-reading'
import { SITE_NAME, seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_app/gita_/$chapter_/$verse')({
  loader: async ({ params }) => {
    const verse = await loadVerse({
      chapter: Number(params.chapter),
      verse: Number(params.verse),
    })
    if (!verse) throw notFound()
    return { verse }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? seo({
          title: `Gita ${verseRef(loaderData.verse)} | ${SITE_NAME}`,
          description: loaderData.verse.plain ?? loaderData.verse.translation,
        })
      : [],
  }),
  component: VersePage,
})

function VersePage() {
  const { verse } = Route.useLoaderData()
  const [options, setOptions] = useReadingOptions()
  const [saved, setSaved] = useSavedVerses()
  const [, setLastRead] = useStored<LastRead | null>(LAST_READ_KEY, null)
  const navigate = useNavigate()
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const reference = verseRef(verse)
  const chapter = getChapter(verse.chapter)
  const { previous, next } = neighbours(verse)
  const size = SIZE_CLASSES[options.size]

  // Remember this verse as the bookmark ribbon position.
  useEffect(() => {
    setLastRead({ chapter: verse.chapter, verse: verse.verse })
  }, [verse.chapter, verse.verse, setLastRead])

  // Left and right arrow keys turn pages smoothly between verses.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (
        event.target instanceof Element &&
        event.target.closest('input, textarea, select, [contenteditable]')
      )
        return
      const to =
        event.key === 'ArrowLeft'
          ? previous
          : event.key === 'ArrowRight'
            ? next
            : undefined
      if (!to) return
      void navigate({
        to: '/gita/$chapter/$verse',
        params: { chapter: String(to.chapter), verse: String(to.verse) },
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // previous and next are fully determined by the verse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verse.chapter, verse.verse, navigate])

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (!touchStart.current) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchStart.current.x
    const dy = touch.clientY - touchStart.current.y
    touchStart.current = null
    // Require a deliberate mostly-horizontal swipe so normal scrolling never triggers page turns.
    if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.6) return
    const target = dx < 0 ? next : previous
    if (!target) return
    void navigate({
      to: '/gita/$chapter/$verse',
      params: {
        chapter: String(target.chapter),
        verse: String(target.verse),
      },
    })
  }

  const primaryEnglish =
    options.english === 'plain' && verse.plain
      ? { label: 'In plain English', text: verse.plain }
      : { label: 'Literal translation', text: verse.translation }

  const secondaryEnglish =
    verse.plain && options.translation
      ? options.english === 'plain'
        ? { label: 'Literal translation', text: verse.translation }
        : { label: 'In plain English', text: verse.plain }
      : null

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-5 pt-4 pb-24 sm:px-8 sm:pt-8">
      {chapter && (
        <BookBar
          mode="verse"
          chapter={chapter}
          activeVerse={verse.verse}
          options={options}
          onOptionsChange={setOptions}
        />
      )}

      <header className="flex flex-col gap-2 pt-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="font-serif text-sm text-yellow-ink italic">
              — {SPEAKER_NAME[verse.speaker]}
            </p>
            <h1 className="font-serif text-3xl leading-[1.12] font-medium tracking-[-0.025em] text-foreground sm:text-4xl">
              Chapter {verse.chapter}, verse {verse.verse}
            </h1>
          </div>
          <SaveButton
            withLabel
            reference={reference}
            saved={saved.includes(reference)}
            onToggle={(ref) => setSaved((current) => toggleSaved(current, ref))}
            className="mt-1 shrink-0 border border-border bg-card"
          />
        </div>
        {chapter && (
          <p className="text-sm text-muted-foreground sm:text-base">
            {chapter.name} · {chapter.about}
          </p>
        )}
      </header>

      {/* Main verse folio page — swipeable on touch screens */}
      <article
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="flex flex-col gap-7 rounded-[28px] border border-border bg-(image:--grad-folio) p-6 shadow-(--surface-shadow) sm:p-9"
      >
        {(options.sanskrit || options.transliteration) && (
          <div className="flex flex-col gap-3">
            {options.sanskrit && (
              <p
                lang="sa"
                className={cn('font-serif text-foreground/95', size.sa)}
              >
                {verse.devanagari.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            )}
            {options.transliteration && (
              <p
                lang="sa-Latn"
                className="leading-relaxed text-muted-foreground italic"
              >
                {verse.iast.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            )}
          </div>
        )}

        {options.translation && (
          <div
            className={cn(
              'flex flex-col gap-2',
              (options.sanskrit || options.transliteration) &&
                'border-t border-border/75 pt-6',
            )}
          >
            <h2 className="text-xs font-medium text-pink-ink sm:text-sm">
              {primaryEnglish.label}
            </h2>
            <p
              className={cn(
                'font-serif text-pretty text-foreground',
                options.size === 's'
                  ? 'text-lg leading-relaxed sm:text-xl'
                  : options.size === 'l'
                    ? 'text-2xl leading-relaxed sm:text-3xl'
                    : 'text-xl leading-relaxed sm:text-2xl',
              )}
            >
              {primaryEnglish.text}
            </p>
          </div>
        )}

        {secondaryEnglish && (
          <div className="flex flex-col gap-1.5 border-t border-border/75 pt-5">
            <h2 className="text-xs font-medium text-muted-foreground">
              {secondaryEnglish.label}
            </h2>
            <p className="max-w-[60ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
              {secondaryEnglish.text}
            </p>
          </div>
        )}

        <TranslationReviewNote className="border-t border-border/60 pt-4" />

        {/* Tactile page-turn controls right at the foot of the folio */}
        <nav
          aria-label="Turn verse page"
          className="flex items-center justify-between gap-3 border-t border-border/75 pt-5 text-sm font-medium"
        >
          {previous ? (
            <Link
              to="/gita/$chapter/$verse"
              params={{
                chapter: String(previous.chapter),
                verse: String(previous.verse),
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-foreground transition-colors hover:bg-surface-blush-hover"
            >
              <ChevronLeft aria-hidden className="size-4 text-muted-foreground" />
              <span className="tabular-nums">
                {previous.chapter !== verse.chapter
                  ? `Ch. ${previous.chapter} · ${verseRef(previous)}`
                  : verseRef(previous)}
              </span>
            </Link>
          ) : (
            <span />
          )}

          <span className="hidden text-xs text-muted-foreground/80 sm:inline">
            ← → keys turn pages
          </span>

          {next ? (
            <Link
              to="/gita/$chapter/$verse"
              params={{
                chapter: String(next.chapter),
                verse: String(next.verse),
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-foreground transition-colors hover:bg-surface-blush-hover"
            >
              <span className="tabular-nums">
                {next.chapter !== verse.chapter
                  ? `Ch. ${next.chapter} · ${verseRef(next)}`
                  : verseRef(next)}
              </span>
              <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
            </Link>
          ) : (
            <Link
              to="/gita"
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-pink-ink transition-colors hover:bg-surface-blush-hover"
            >
              Finish book
            </Link>
          )}
        </nav>
      </article>

      {/* Word-by-word glosses, glossary definitions, reading notes & linked practice */}
      <WordStudy key={reference} verse={verse} />

      <nav
        aria-label="Chapter context"
        className="flex items-center justify-between gap-4 border-t border-border/80 pt-6 text-sm font-medium"
      >
        <Link
          to="/gita/$chapter"
          params={{ chapter: String(verse.chapter) }}
          hash={`v${verse.verse}`}
          className="inline-flex items-center gap-1 text-pink-ink hover:underline"
        >
          <ChevronLeft aria-hidden className="size-4" />
          Read chapter {verse.chapter} continuously
        </Link>
        <Link
          to="/gita"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          All chapters
        </Link>
      </nav>
    </main>
  )
}
