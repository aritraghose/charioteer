import { Link } from '@tanstack/react-router'
import { ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { type Verse, getTerm } from '@/content/gita'
import { getSession } from '@/content/sessions'
import type { EnglishStyle } from '@/lib/gita-reading'
import { sessionMinutes } from '@/lib/session-timeline'
import { cn } from '@/lib/utils'

/**
 * Interactive word-by-word breakdown, inline glossary definitions, alternate
 * translation, reading notes, and linked practice for a single verse.
 * Used both inline inside the chapter scroll and on the single-verse page.
 */
export function WordStudy({
  verse,
  englishStyle,
  compact = false,
  showFullVerseLink = false,
  className,
}: Readonly<{
  verse: Verse
  /** When provided in compact/inline mode, shows the alternate English rendering for comparison. */
  englishStyle?: EnglishStyle
  compact?: boolean
  showFullVerseLink?: boolean
  className?: string
}>) {
  const [openTerm, setOpenTerm] = useState<string | null>(null)
  const term = openTerm ? getTerm(openTerm) : undefined
  const practice = verse.practice && getSession(verse.practice.sessionId)

  const alternateEnglish =
    compact && verse.plain && englishStyle
      ? englishStyle === 'plain'
        ? { label: 'Literal translation', text: verse.translation }
        : { label: 'In plain English', text: verse.plain }
      : null

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {alternateEnglish && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-pink-ink">
            {alternateEnglish.label}
          </p>
          <p className="max-w-[60ch] text-sm leading-relaxed text-pretty text-muted-foreground">
            {alternateEnglish.text}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <h3
              className={cn(
                'font-medium tracking-[-0.02em] text-foreground',
                compact ? 'text-sm' : 'text-2xl tracking-[-0.025em]',
              )}
            >
              Word by word
            </h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              In the order of the verse. Tap an outlined word for its range of
              meaning.
            </p>
          </div>
          {showFullVerseLink && (
            <Link
              to="/gita/$chapter/$verse"
              params={{
                chapter: String(verse.chapter),
                verse: String(verse.verse),
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-pink-ink hover:underline sm:text-sm"
            >
              Open verse page
              <ChevronRight aria-hidden className="size-3.5" strokeWidth={2} />
            </Link>
          )}
        </div>

        <ul className="flex flex-wrap gap-2">
          {verse.words.map((word, index) => {
            const content = (
              <>
                <span
                  className={cn(
                    'font-medium text-foreground',
                    compact && 'text-sm',
                  )}
                  lang="sa-Latn"
                >
                  {word.sa}
                </span>
                <span
                  className={cn(
                    'leading-snug text-muted-foreground',
                    compact ? 'text-xs' : 'text-sm',
                  )}
                >
                  {word.en}
                </span>
              </>
            )
            const key = `${word.sa}-${index}`
            if (!word.term) {
              return (
                <li
                  key={key}
                  className={cn(
                    'flex max-w-56 flex-col gap-0.5 rounded-2xl bg-card ring-1 ring-border',
                    compact ? 'px-3 py-2' : 'px-4 py-2.5',
                  )}
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
                  onClick={() =>
                    setOpenTerm(isOpen ? null : (word.term ?? null))
                  }
                  className={cn(
                    'flex max-w-56 cursor-pointer flex-col gap-0.5 rounded-2xl bg-yellow-soft text-left ring-1 ring-yellow-ink/40 transition-colors hover:bg-pink-soft',
                    compact ? 'px-3 py-2' : 'px-4 py-2.5',
                    isOpen && 'bg-pink-soft ring-primary',
                  )}
                >
                  {content}
                </button>
              </li>
            )
          })}
        </ul>

        <div aria-live="polite">
          {term && (
            <div className="flex flex-col gap-2 rounded-2xl border border-primary/40 bg-card p-4 shadow-(--surface-shadow) sm:p-5">
              <div className="flex items-center gap-3">
                <h4 className="text-base font-medium text-foreground sm:text-lg">
                  {term.sa}
                </h4>
                <span lang="sa" className="font-serif text-muted-foreground">
                  {term.devanagari}
                </span>
                <button
                  type="button"
                  aria-label="Close term meaning"
                  onClick={() => setOpenTerm(null)}
                  className="ml-auto flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
              <p className="max-w-[58ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
                {term.meaning}
              </p>
            </div>
          )}
        </div>
      </div>

      {verse.notes && verse.notes.length > 0 && (
        <div className="flex flex-col gap-1.5 border-l-2 border-primary/50 pl-4">
          <h4 className="text-xs font-medium text-pink-ink sm:text-sm">
            Another way to read this
          </h4>
          <ul className="flex max-w-[58ch] flex-col gap-2 text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            {verse.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {practice && verse.practice && (
        <Link
          to="/session/$sessionId"
          params={{ sessionId: practice.id }}
          className={cn(
            'group flex items-center gap-4 border border-border bg-(image:--grad-sanctuary) transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 motion-reduce:transition-none',
            compact
              ? 'rounded-2xl px-4 py-3.5'
              : 'rounded-[28px] p-6 shadow-(--surface-shadow)',
          )}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-xs font-medium text-pink-ink sm:text-sm">
              Put this verse into practice
            </span>
            <span
              className={cn(
                'font-medium tracking-[-0.02em] text-foreground',
                compact ? 'text-base' : 'text-lg',
              )}
            >
              {verse.practice.label}, {sessionMinutes(practice)} minutes
            </span>
          </span>
          <ChevronRight
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none sm:size-5"
          />
        </Link>
      )}
    </div>
  )
}
