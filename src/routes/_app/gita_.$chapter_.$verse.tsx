import {
  Link,
  createFileRoute,
  notFound,
  useNavigate,
} from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  SPEAKER_NAME,
  getChapter,
  getTerm,
  loadVerse,
  neighbours,
  verseRef,
} from '@/content/gita'
import {
  SaveButton,
  toggleSaved,
  useSavedVerses,
} from '@/components/gita/save-button'
import { getSession } from '@/content/sessions'
import { useStored } from '@/hooks/use-stored'
import { LAST_READ_KEY, type LastRead } from '@/lib/gita-reading'
import { SITE_NAME, seo } from '@/lib/seo'
import { sessionMinutes } from '@/lib/session-timeline'
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
  const [openTerm, setOpenTerm] = useState<string | null>(null)
  const [saved, setSaved] = useSavedVerses()
  const [, setLastRead] = useStored<LastRead | null>(LAST_READ_KEY, null)
  const navigate = useNavigate()
  const reference = verseRef(verse)

  const chapter = getChapter(verse.chapter)
  const { previous, next } = neighbours(verse)
  const term = openTerm ? getTerm(openTerm) : undefined
  const practice = verse.practice && getSession(verse.practice.sessionId)

  // Remember this as the place to continue from, and close any open term card.
  useEffect(() => {
    setLastRead({ chapter: verse.chapter, verse: verse.verse })
    setOpenTerm(null)
  }, [verse.chapter, verse.verse, setLastRead])

  // Left and right arrow keys move between verses.
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

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-9 px-5 pt-10 pb-20 sm:px-8 sm:pt-16">
      <header className="flex flex-col gap-3">
        <Link
          to="/gita/$chapter"
          params={{ chapter: String(verse.chapter) }}
          hash={`v${verse.verse}`}
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft aria-hidden className="size-4" />
          Chapter {verse.chapter}
        </Link>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-4xl leading-[1.06] font-medium tracking-[-0.036em] sm:text-5xl">
            Chapter {verse.chapter}, verse {verse.verse}
          </h1>
          <SaveButton
            withLabel
            reference={reference}
            saved={saved.includes(reference)}
            onToggle={(ref) => setSaved((current) => toggleSaved(current, ref))}
            className="mt-1 shrink-0 border border-border bg-card"
          />
        </div>
        <p className="text-muted-foreground">
          {chapter && `${chapter.name}. ${chapter.about}. `}
          {SPEAKER_NAME[verse.speaker]} speaks.
        </p>
      </header>

      <article className="flex flex-col gap-7 rounded-[28px] border border-border bg-(image:--grad-folio) p-6 shadow-(--surface-shadow) sm:p-9">
        <div className="flex flex-col gap-3">
          <p
            lang="sa"
            className="font-serif text-2xl leading-[1.7] text-foreground sm:text-3xl sm:leading-[1.7]"
          >
            {verse.devanagari.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
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
        </div>

        {verse.plain && (
          <div className="flex flex-col gap-2 border-t border-border/80 pt-6">
            <h2 className="text-sm font-medium text-pink-ink">
              In plain English
            </h2>
            <p className="font-serif text-xl leading-relaxed text-pretty sm:text-2xl sm:leading-relaxed">
              {verse.plain}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-border/80 pt-6">
          <h2 className="text-sm font-medium text-pink-ink">
            Literal translation
          </h2>
          <p
            className={
              verse.plain
                ? 'max-w-[60ch] leading-relaxed text-pretty text-muted-foreground'
                : 'font-serif text-xl leading-relaxed text-pretty sm:text-2xl sm:leading-relaxed'
            }
          >
            {verse.translation}
          </p>
        </div>
      </article>

      <section aria-labelledby="words-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2
            id="words-heading"
            className="text-2xl font-medium tracking-[-0.025em]"
          >
            Word by word
          </h2>
          <p className="text-sm text-muted-foreground">
            In the order of the verse. Tap an outlined word to see its range of
            meaning.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2.5">
          {verse.words.map((word, index) => {
            const content = (
              <>
                <span className="font-medium" lang="sa-Latn">
                  {word.sa}
                </span>
                <span className="text-sm leading-snug text-muted-foreground">
                  {word.en}
                </span>
              </>
            )
            const key = `${word.sa}-${index}`
            if (!word.term) {
              return (
                <li
                  key={key}
                  className="flex max-w-56 flex-col gap-0.5 rounded-2xl bg-card px-4 py-2.5 ring-1 ring-border"
                >
                  {content}
                </li>
              )
            }
            const isOpen = openTerm === word.term
            return (
              <li key={key} className="flex">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls="term-card"
                onClick={() => setOpenTerm(isOpen ? null : (word.term ?? null))}
                className={cn(
                  'flex max-w-56 cursor-pointer flex-col gap-0.5 rounded-2xl bg-yellow-soft px-4 py-2.5 text-left ring-1 ring-yellow-ink/40 transition-colors hover:bg-pink-soft',
                  isOpen && 'bg-pink-soft ring-primary',
                )}
              >
                {content}
              </button>
              </li>
            )
          })}
        </ul>

        <div id="term-card" aria-live="polite">
          {term && (
            <div className="flex flex-col gap-2 rounded-[22px] border border-primary/40 bg-card p-5 shadow-(--surface-shadow)">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium">{term.sa}</h3>
                <span lang="sa" className="font-serif text-muted-foreground">
                  {term.devanagari}
                </span>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpenTerm(null)}
                  className="ml-auto flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-surface-blush-hover hover:text-foreground"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
              <p className="max-w-[58ch] leading-relaxed text-pretty text-muted-foreground">
                {term.meaning}
              </p>
            </div>
          )}
        </div>
      </section>

      {verse.notes && verse.notes.length > 0 && (
        <section className="flex flex-col gap-2 border-l-2 border-primary/50 pl-4">
          <h2 className="text-sm font-medium text-pink-ink">
            Another way to read this
          </h2>
          <ul className="flex max-w-[58ch] flex-col gap-2 leading-relaxed text-pretty text-muted-foreground">
            {verse.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      {practice && verse.practice && (
        <Link
          to="/session/$sessionId"
          params={{ sessionId: practice.id }}
          className="group flex items-center gap-4 rounded-[28px] border border-border bg-(image:--grad-sanctuary) p-6 shadow-(--surface-shadow) transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 motion-reduce:transition-none"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-sm font-medium text-pink-ink">
              Put this verse into practice
            </span>
            <span className="text-lg font-medium tracking-[-0.02em]">
              {verse.practice.label}, {sessionMinutes(practice)} minutes
            </span>
          </span>
          <ChevronRight
            aria-hidden
            className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      )}

      <nav
        aria-label="Verses"
        className="flex items-center justify-between gap-4 border-t border-border/80 pt-6 text-sm font-medium"
      >
        {previous ? (
          <Link
            to="/gita/$chapter/$verse"
            params={{
              chapter: String(previous.chapter),
              verse: String(previous.verse),
            }}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft aria-hidden className="size-4" />
            {verseRef(previous)}
          </Link>
        ) : (
          <span />
        )}
        <Link
          to="/gita/$chapter"
          params={{ chapter: String(verse.chapter) }}
          hash={`v${verse.verse}`}
          className="text-pink-ink"
        >
          Read chapter {verse.chapter}
        </Link>
        {next ? (
          <Link
            to="/gita/$chapter/$verse"
            params={{ chapter: String(next.chapter), verse: String(next.verse) }}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            {verseRef(next)}
            <ChevronRight aria-hidden className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  )
}
