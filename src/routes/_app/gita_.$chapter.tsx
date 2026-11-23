import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import {
  ReadingOptionsBar,
  useReadingOptions,
} from '@/components/gita/reading-options'
import {
  SaveButton,
  toggleSaved,
  useSavedVerses,
} from '@/components/gita/save-button'
import {
  SPEAKER_NAME,
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

/** A whole chapter on one page, for reading straight through. */
export const Route = createFileRoute('/_app/gita_/$chapter')({
  loader: async ({ params }) => {
    const chapter = getChapter(Number(params.chapter))
    if (!chapter) throw notFound()
    const verses = await loadChapter(chapter.chapter)
    return {
      chapter,
      // The word-by-word lists stay on the verse pages, to keep this page light.
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
  const size = SIZE_CLASSES[options.size]
  const previous = getChapter(chapter.chapter - 1)
  const next = getChapter(chapter.chapter + 1)

  // Remember the verse at the top of the screen as the reader scrolls, so
  // "Continue reading" can bring them back to it.
  useEffect(() => {
    let timer = 0
    const onScroll = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        const blocks = document.querySelectorAll<HTMLElement>('[data-verse]')
        for (const block of blocks) {
          if (block.getBoundingClientRect().bottom > 140) {
            setLastRead({
              chapter: chapter.chapter,
              verse: Number(block.dataset.verse),
            })
            break
          }
        }
      }, 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [chapter.chapter, setLastRead])

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-5 pt-10 pb-20 sm:px-8 sm:pt-16">
      <header className="flex flex-col gap-3">
        <Link
          to="/gita"
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft aria-hidden className="size-4" />
          Gita
        </Link>
        <p className="text-sm font-medium text-pink-ink">
          Chapter {chapter.chapter} of 18
        </p>
        <h1 className="text-4xl leading-[1.06] font-medium tracking-[-0.036em] text-balance sm:text-5xl">
          {chapter.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {chapter.about}. {chapter.length} verses.
        </p>
      </header>

      <ReadingOptionsBar
        options={options}
        onChange={setOptions}
        className="border-y border-border/80 py-4"
      />

      <ol className="flex flex-col">
        {verses.map((verse, index) => {
          const reference = `${chapter.chapter}.${verse.verse}`
          const speakerChanged =
            index === 0 || verses[index - 1].speaker !== verse.speaker
          return (
            <li
              key={verse.verse}
              id={`v${verse.verse}`}
              data-verse={verse.verse}
              className="flex scroll-mt-6 flex-col gap-4 border-b border-border/70 py-8 first:pt-0 last:border-b-0"
            >
              {speakerChanged && (
                <p className="w-fit rounded-full bg-yellow-soft px-3 py-1 text-xs font-medium text-yellow-ink ring-1 ring-border">
                  {SPEAKER_NAME[verse.speaker]} speaks
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/gita/$chapter/$verse"
                  params={{
                    chapter: String(chapter.chapter),
                    verse: String(verse.verse),
                  }}
                  className="text-sm font-medium text-peach-ink tabular-nums hover:underline"
                >
                  {reference}
                </Link>
                <span className="flex items-center gap-1">
                  <Link
                    to="/gita/$chapter/$verse"
                    params={{
                      chapter: String(chapter.chapter),
                      verse: String(verse.verse),
                    }}
                    className="inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
                  >
                    Word by word
                    {verse.hasNotes && (
                      <span
                        aria-label="has a reading note"
                        className="ml-1.5 size-1.5 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                  <SaveButton
                    reference={reference}
                    saved={saved.includes(reference)}
                    onToggle={(ref) =>
                      setSaved((current) => toggleSaved(current, ref))
                    }
                  />
                </span>
              </div>

              {options.sanskrit && (
                <p lang="sa" className={cn('font-serif', size.sa)}>
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
                <p className={cn('font-serif text-pretty', size.en)}>
                  {options.english === 'plain'
                    ? (verse.plain ?? verse.translation)
                    : verse.translation}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <nav
        aria-label="Chapters"
        className="flex items-center justify-between gap-4 border-t border-border/80 pt-6 text-sm font-medium"
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
        <Link to="/gita" className="text-pink-ink">
          All chapters
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
          <span />
        )}
      </nav>
    </main>
  )
}
