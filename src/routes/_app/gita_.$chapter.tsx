import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
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
  type Verse,
  getChapter,
  loadChapter,
} from '@/content/gita'
import { useStored } from '@/hooks/use-stored'
import {
  LAST_READ_KEY,
  type LastRead,
  SIZE_CLASSES,
} from '@/lib/gita-reading'
import { SITE_NAME, seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

/** A whole chapter on one page, designed like an interactive printed folio. */
export const Route = createFileRoute('/_app/gita_/$chapter')({
  loader: async ({ params }) => {
    const chapter = getChapter(Number(params.chapter))
    if (!chapter) throw notFound()
    const verses = await loadChapter(chapter.chapter)
    return {
      chapter,
      // Keep the SSR payload light; full word glosses load lazily on first inline study tap.
      verses: verses.map(
        ({ verse, speaker, devanagari, iast, translation, plain, notes }) => ({
          verse,
          speaker,
          devanagari,
          iast,
          translation,
          plain,
          hasNotes: !!notes?.length,
        }),
      ),
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? seo({
          title: `Gita chapter ${loaderData.chapter.chapter}: ${loaderData.chapter.name} | ${SITE_NAME}`,
          description: `${loaderData.chapter.about}. ${loaderData.chapter.length} verses in Sanskrit with a literal English translation.`,
        })
      : [],
  }),
  component: ChapterPage,
})

function ChapterPage() {
  const { chapter, verses } = Route.useLoaderData()
  const [options, setOptions] = useReadingOptions()
  const [saved, setSaved] = useSavedVerses()
  const [, setLastRead] = useStored<LastRead | null>(LAST_READ_KEY, null)

  const [activeVerse, setActiveVerse] = useState(1)
  const [openVerse, setOpenVerse] = useState<number | null>(null)
  const [fullVerses, setFullVerses] = useState<Map<number, Verse> | null>(null)
  const [loadingWords, setLoadingWords] = useState(false)
  const loadedChapterRef = useRef<number | null>(null)

  const size = SIZE_CLASSES[options.size]
  const previous = getChapter(chapter.chapter - 1)
  const next = getChapter(chapter.chapter + 1)

  // Reset inline study state when switching chapters.
  useEffect(() => {
    setOpenVerse(null)
    setActiveVerse(1)
    if (loadedChapterRef.current !== chapter.chapter) {
      setFullVerses(null)
      loadedChapterRef.current = null
    }
  }, [chapter.chapter])

  // Sync active verse if landing on a hash anchor like #v19.
  useEffect(() => {
    const match = window.location.hash.match(/^#v(\d+)$/)
    if (!match) return
    const num = Number(match[1])
    if (num >= 1 && num <= chapter.length) {
      setActiveVerse(num)
    }
  }, [chapter.chapter, chapter.length])

  // Track which verse is near the top of the reading viewport as the user scrolls.
  useEffect(() => {
    let saveTimer = 0
    let frame = 0
    const detectTopVerse = () => {
      const blocks = document.querySelectorAll<HTMLElement>('[data-verse]')
      for (const block of blocks) {
        if (block.getBoundingClientRect().bottom > 110) {
          return Number(block.dataset.verse)
        }
      }
      return 1
    }
    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          frame = 0
          setActiveVerse(detectTopVerse())
        })
      }
      window.clearTimeout(saveTimer)
      saveTimer = window.setTimeout(() => {
        setLastRead({
          chapter: chapter.chapter,
          verse: detectTopVerse(),
        })
      }, 350)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(saveTimer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [chapter.chapter, setLastRead])

  const jumpToVerse = useCallback(
    (num: number) => {
      setActiveVerse(num)
      setLastRead({ chapter: chapter.chapter, verse: num })
      const element = document.getElementById(`v${num}`)
      if (element) {
        const reduced = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        element.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start',
        })
      }
    },
    [chapter.chapter, setLastRead],
  )

  const toggleStudy = async (verseNum: number) => {
    if (openVerse === verseNum) {
      setOpenVerse(null)
      return
    }
    setOpenVerse(verseNum)
    if (loadedChapterRef.current === chapter.chapter && fullVerses) return
    setLoadingWords(true)
    try {
      const loaded = await loadChapter(chapter.chapter)
      loadedChapterRef.current = chapter.chapter
      setFullVerses(new Map(loaded.map((item) => [item.verse, item])))
    } finally {
      setLoadingWords(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-9 px-5 pt-4 pb-24 sm:px-8 sm:pt-8">
      <BookBar
        mode="chapter"
        chapter={chapter}
        activeVerse={activeVerse}
        options={options}
        onOptionsChange={setOptions}
        onJumpToVerse={jumpToVerse}
      />

      {/* Chapter title opener — calm like a printed chapter heading */}
      <header className="flex flex-col gap-3 border-b border-border/80 pt-3 pb-8">
        <p className="text-sm font-medium text-pink-ink">
          Chapter {chapter.chapter} of 18
        </p>
        <h1 className="font-serif text-4xl leading-[1.1] font-medium tracking-[-0.02em] text-balance text-foreground sm:text-5xl">
          {chapter.name}
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          {chapter.about} · {chapter.length} verses
        </p>
      </header>

      <ol className="flex flex-col">
        {verses.map((verse, index) => {
          const reference = `${chapter.chapter}.${verse.verse}`
          const speakerChanged =
            index === 0 || verses[index - 1].speaker !== verse.speaker
          const isOpen = openVerse === verse.verse
          const fullVerse = fullVerses?.get(verse.verse)
          const isSaved = saved.includes(reference)

          return (
            <li
              key={verse.verse}
              id={`v${verse.verse}`}
              data-verse={verse.verse}
              className={cn(
                'group/verse flex scroll-mt-24 flex-col gap-3.5 border-b border-border/55 py-7 first:pt-0 last:border-b-0',
                speakerChanged && index > 0 && 'pt-10',
              )}
            >
              {speakerChanged && (
                <p className="font-serif text-sm text-yellow-ink italic">
                  — {SPEAKER_NAME[verse.speaker]}
                </p>
              )}

              {/* Quiet verse reference + subtle study/bookmark controls */}
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/gita/$chapter/$verse"
                  params={{
                    chapter: String(chapter.chapter),
                    verse: String(verse.verse),
                  }}
                  title={`Open verse ${reference}`}
                  className="text-xs font-medium text-muted-foreground tabular-nums transition-colors hover:text-peach-ink"
                >
                  {reference}
                </Link>

                <span
                  className={cn(
                    'flex items-center gap-0.5 transition-opacity duration-200',
                    isOpen || isSaved
                      ? 'opacity-100'
                      : 'opacity-75 group-hover/verse:opacity-100 sm:opacity-55 sm:focus-within:opacity-100',
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => void toggleStudy(verse.verse)}
                    className={cn(
                      'inline-flex h-8 cursor-pointer items-center gap-1 rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground',
                      isOpen && 'bg-pink-soft text-pink-ink',
                    )}
                  >
                    <span>Word by word</span>
                    {verse.hasNotes && (
                      <span
                        aria-label="has a reading note"
                        className="size-1.5 rounded-full bg-primary"
                      />
                    )}
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        'size-3.5 transition-transform duration-200 motion-reduce:transition-none',
                        isOpen && 'rotate-180',
                      )}
                    />
                  </button>
                  <SaveButton
                    reference={reference}
                    saved={isSaved}
                    onToggle={(ref) =>
                      setSaved((current) => toggleSaved(current, ref))
                    }
                    className="h-8 w-8"
                  />
                </span>
              </div>

              {options.sanskrit && (
                <p
                  lang="sa"
                  className={cn('font-serif text-foreground/92', size.sa)}
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

              {options.translation && (
                <p
                  className={cn(
                    'font-serif text-pretty text-foreground',
                    size.en,
                  )}
                >
                  {options.english === 'plain'
                    ? (verse.plain ?? verse.translation)
                    : verse.translation}
                </p>
              )}

              <TranslationReviewNote className="pt-0.5 text-[11px] opacity-80" />

              {/* Inline word-by-word study drawer — stay right in the chapter */}
              {isOpen && (
                <div className="mt-2 rounded-2xl border border-border bg-(image:--grad-sanctuary) p-4 sm:p-5">
                  {loadingWords && !fullVerse ? (
                    <p className="text-sm text-muted-foreground">
                      Loading word glosses…
                    </p>
                  ) : fullVerse ? (
                    <WordStudy
                      verse={fullVerse}
                      englishStyle={options.english}
                      compact
                      showFullVerseLink
                    />
                  ) : null}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {/* End-of-chapter page turn */}
      <footer className="flex flex-col gap-5 border-t border-border/80 pt-8">
        {next ? (
          <Link
            to="/gita/$chapter"
            params={{ chapter: String(next.chapter) }}
            className="group flex items-center gap-4 rounded-[28px] border border-border bg-(image:--grad-folio) p-6 shadow-(--surface-shadow) transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 motion-reduce:transition-none sm:p-7"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-xs font-medium text-pink-ink sm:text-sm">
                Next chapter · Chapter {next.chapter} of 18
              </span>
              <span className="font-serif text-2xl font-medium tracking-[-0.02em] text-foreground">
                {next.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {next.about} · {next.length} verses
              </span>
            </span>
            <ChevronRight
              aria-hidden
              className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
            />
          </Link>
        ) : (
          <div className="flex flex-col gap-2 rounded-[28px] border border-border bg-(image:--grad-folio) p-6 shadow-(--surface-shadow) sm:p-7">
            <p className="text-sm font-medium text-pink-ink">
              End of the Bhagavad Gita
            </p>
            <p className="font-serif text-xl text-foreground">
              Chapter 18, verse 78 completes the eighteen chapters.
            </p>
          </div>
        )}

        <nav
          aria-label="Chapters"
          className="flex items-center justify-between gap-4 text-sm font-medium"
        >
          {previous ? (
            <Link
              to="/gita/$chapter"
              params={{ chapter: String(previous.chapter) }}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft aria-hidden className="size-4" />
              Chapter {previous.chapter}
            </Link>
          ) : (
            <span />
          )}
          <Link to="/gita" className="text-pink-ink hover:underline">
            Table of contents
          </Link>
          {next ? (
            <Link
              to="/gita/$chapter"
              params={{ chapter: String(next.chapter) }}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              Chapter {next.chapter}
              <ChevronRight aria-hidden className="size-4" />
            </Link>
          ) : (
            <Link
              to="/gita/$chapter"
              params={{ chapter: '1' }}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              Back to Chapter 1
              <ChevronRight aria-hidden className="size-4" />
            </Link>
          )}
        </nav>
      </footer>
    </main>
  )
}
