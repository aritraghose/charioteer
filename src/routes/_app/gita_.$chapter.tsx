import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
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
  type ReadingOptions,
  SIZE_CLASSES,
  bindDanda,
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
          title: `Bhagavad Gita chapter ${loaderData.chapter.chapter}: ${loaderData.chapter.name} | ${SITE_NAME}`,
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

  // Track which verse is near the top of the reading viewport. An observer
  // only wakes when a verse crosses the line, so scrolling itself runs no code.
  useEffect(() => {
    const visible = new Set<number>()
    let saveTimer = 0
    let first = true
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const num = Number((entry.target as HTMLElement).dataset.verse)
          if (entry.isIntersecting) visible.add(num)
          else visible.delete(num)
        }
        // The landing position is not a reading position yet.
        const landing = first
        first = false
        if (visible.size === 0) return
        const top = Math.min(...visible)
        setActiveVerse(top)
        if (landing) return
        window.clearTimeout(saveTimer)
        saveTimer = window.setTimeout(() => {
          setLastRead({ chapter: chapter.chapter, verse: top })
        }, 350)
      },
      // Start below the sticky book bar.
      { rootMargin: '-110px 0px 0px 0px' },
    )
    for (const block of document.querySelectorAll('[data-verse]')) {
      observer.observe(block)
    }
    return () => {
      observer.disconnect()
      window.clearTimeout(saveTimer)
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

  const toggleStudy = useCallback(
    (verseNum: number) => {
      setOpenVerse((current) => (current === verseNum ? null : verseNum))
      if (loadedChapterRef.current === chapter.chapter) return
      // Word glosses load once per chapter, on the first study tap.
      loadedChapterRef.current = chapter.chapter
      setLoadingWords(true)
      loadChapter(chapter.chapter)
        .then((loaded) => {
          if (loadedChapterRef.current !== chapter.chapter) return
          setFullVerses(new Map(loaded.map((item) => [item.verse, item])))
        })
        .catch(() => {
          if (loadedChapterRef.current === chapter.chapter) {
            loadedChapterRef.current = null
          }
        })
        .finally(() => setLoadingWords(false))
    },
    [chapter.chapter],
  )

  const toggleSave = useCallback(
    (reference: string) =>
      setSaved((current) => toggleSaved(current, reference)),
    [setSaved],
  )

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
        {verses.map((verse, index) => (
          <VerseBlock
            key={verse.verse}
            chapter={chapter.chapter}
            verse={verse}
            speakerChanged={
              index === 0 || verses[index - 1].speaker !== verse.speaker
            }
            first={index === 0}
            open={openVerse === verse.verse}
            saved={saved.includes(`${chapter.chapter}.${verse.verse}`)}
            fullVerse={
              openVerse === verse.verse
                ? fullVerses?.get(verse.verse)
                : undefined
            }
            loadingWords={loadingWords && openVerse === verse.verse}
            sanskrit={options.sanskrit}
            transliteration={options.transliteration}
            translation={options.translation}
            english={options.english}
            size={options.size}
            onToggleStudy={toggleStudy}
            onToggleSave={toggleSave}
          />
        ))}
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

type ChapterVerse = Pick<
  Verse,
  'verse' | 'speaker' | 'devanagari' | 'iast' | 'translation' | 'plain'
> & { hasNotes: boolean }

/**
 * One verse of the chapter. Memoised so scrolling (which only moves the active
 * verse in the book bar) never re-renders the list.
 */
const VerseBlock = memo(function VerseBlock({
  chapter,
  verse,
  speakerChanged,
  first,
  open: isOpen,
  saved: isSaved,
  fullVerse,
  loadingWords,
  sanskrit,
  transliteration,
  translation,
  english,
  size: sizeKey,
  onToggleStudy,
  onToggleSave,
}: Readonly<{
  chapter: number
  verse: ChapterVerse
  speakerChanged: boolean
  first: boolean
  open: boolean
  saved: boolean
  fullVerse: Verse | undefined
  loadingWords: boolean
  sanskrit: boolean
  transliteration: boolean
  translation: boolean
  english: ReadingOptions['english']
  size: ReadingOptions['size']
  onToggleStudy: (verse: number) => void
  onToggleSave: (reference: string) => void
}>) {
  const reference = `${chapter}.${verse.verse}`
  const size = SIZE_CLASSES[sizeKey]

  return (
    <li
      id={`v${verse.verse}`}
      data-verse={verse.verse}
      className={cn(
        'group/verse verse-block flex scroll-mt-24 flex-col gap-3.5 border-b border-border/55 py-7 first:pt-0 last:border-b-0',
        speakerChanged && !first && 'pt-10',
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
          params={{ chapter: String(chapter), verse: String(verse.verse) }}
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
            onClick={() => onToggleStudy(verse.verse)}
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
            onToggle={onToggleSave}
            className="h-8 w-8"
          />
        </span>
      </div>

      {sanskrit && (
        <p lang="sa" className={cn('font-serif text-foreground/92', size.sa)}>
          {verse.devanagari.map((line) => (
            <span key={line} className="block">
              {bindDanda(line)}
            </span>
          ))}
        </p>
      )}

      {transliteration && (
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

      {translation && (
        <p className={cn('font-serif text-pretty text-foreground', size.en)}>
          {english === 'plain'
            ? (verse.plain ?? verse.translation)
            : verse.translation}
        </p>
      )}

      <TranslationReviewNote className="pt-0.5 opacity-80" />

      {/* Inline word-by-word study drawer — stay right in the chapter */}
      {isOpen && (
        <div className="mt-2 rounded-2xl border border-border bg-(image:--grad-sanctuary) p-4 sm:p-5">
          {fullVerse ? (
            <WordStudy
              verse={fullVerse}
              englishStyle={english}
              compact
              showFullVerseLink
            />
          ) : loadingWords ? (
            <p className="text-sm text-muted-foreground">
              Loading word glosses…
            </p>
          ) : null}
        </div>
      )}
    </li>
  )
})
