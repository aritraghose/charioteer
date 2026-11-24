import { Link, useNavigate } from '@tanstack/react-router'
import {
  AlignJustify,
  BookOpen,
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GitaSearch } from '@/components/gita/gita-search'
import { ReadingOptionsBar } from '@/components/gita/reading-options'
import { useSavedVerses } from '@/components/gita/save-button'
import {
  CHAPTERS,
  type Chapter,
  getChapter,
  loadVerse,
  neighbours,
  parseRef,
  verseRef,
} from '@/content/gita'
import type { ReadingOptions } from '@/lib/gita-reading'
import { cn } from '@/lib/utils'

type Panel = 'flipper' | 'display' | null
type FlipperTab = 'contents' | 'search' | 'saved'

/**
 * Quiet sticky book bar for both chapter scroll mode and single-verse page-turn
 * mode. Keeps chapter/verse flipping, display options, mode switching, and
 * prev/next navigation within one tap without leaving the reading flow.
 */
export function BookBar({
  mode,
  chapter,
  activeVerse,
  options,
  onOptionsChange,
  onJumpToVerse,
}: Readonly<{
  mode: 'chapter' | 'verse'
  chapter: Chapter
  activeVerse: number
  options: ReadingOptions
  onOptionsChange: (next: ReadingOptions) => void
  /** In chapter mode, smoothly scroll to a verse on the current page. */
  onJumpToVerse?: (verse: number) => void
}>) {
  const navigate = useNavigate()
  const [panel, setPanel] = useState<Panel>(null)
  const [tab, setTab] = useState<FlipperTab>('contents')
  const [previewChapter, setPreviewChapter] = useState(chapter.chapter)
  const [saved] = useSavedVerses()
  const [savedSnippets, setSavedSnippets] = useState<Record<string, string>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // Keep the previewed chapter synced when navigating between chapters.
  useEffect(() => {
    setPreviewChapter(chapter.chapter)
  }, [chapter.chapter])

  // Close open panels on Escape or outside click.
  useEffect(() => {
    if (!panel) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setPanel(null)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [panel])

  // Lazily load snippets for saved verses only when the Saved tab opens.
  useEffect(() => {
    if (panel !== 'flipper' || tab !== 'saved' || saved.length === 0) return
    let cancelled = false
    void Promise.all(
      saved.map(async (ref) => {
        const parsed = parseRef(ref)
        const found = await loadVerse(parsed)
        return [ref, found?.plain ?? found?.translation ?? ''] as const
      }),
    ).then((pairs) => {
      if (cancelled) return
      setSavedSnippets(Object.fromEntries(pairs))
    })
    return () => {
      cancelled = true
    }
  }, [panel, tab, saved])

  const progress = Math.min(1, Math.max(0, activeVerse / chapter.length))
  const chapterPrev = getChapter(chapter.chapter - 1)
  const chapterNext = getChapter(chapter.chapter + 1)
  const verseNeighbours = neighbours({
    chapter: chapter.chapter,
    verse: activeVerse,
  })
  const selectedChapter = getChapter(previewChapter) ?? chapter
  const savedSet = new Set(saved)

  const togglePanel = (next: Exclude<Panel, null>) => {
    setPanel((current) => (current === next ? null : next))
  }

  const goToVerse = (targetChapter: number, targetVerse: number) => {
    setPanel(null)
    if (mode === 'chapter' && targetChapter === chapter.chapter && onJumpToVerse) {
      onJumpToVerse(targetVerse)
      return
    }
    if (mode === 'verse') {
      void navigate({
        to: '/gita/$chapter/$verse',
        params: {
          chapter: String(targetChapter),
          verse: String(targetVerse),
        },
      })
      return
    }
    void navigate({
      to: '/gita/$chapter',
      params: { chapter: String(targetChapter) },
      hash: `v${targetVerse}`,
    })
  }

  const goToChapter = (targetChapter: number) => {
    setPanel(null)
    if (mode === 'verse') {
      void navigate({
        to: '/gita/$chapter/$verse',
        params: { chapter: String(targetChapter), verse: '1' },
      })
      return
    }
    void navigate({
      to: '/gita/$chapter',
      params: { chapter: String(targetChapter) },
    })
  }

  return (
    <div ref={containerRef} className="sticky top-3 z-20 -mx-1 sm:mx-0">
      <div className="relative overflow-hidden rounded-2xl border border-book-bar-border bg-book-bar shadow-(--book-bar-shadow) backdrop-blur-md">
        <div className="flex items-center gap-1 px-2 py-1.5 sm:gap-1.5 sm:px-2.5">
          {/* Previous chapter or previous verse */}
          {mode === 'chapter' ? (
            chapterPrev ? (
              <Link
                to="/gita/$chapter"
                params={{ chapter: String(chapterPrev.chapter) }}
                aria-label={`Previous: Chapter ${chapterPrev.chapter}`}
                title={`Chapter ${chapterPrev.chapter}: ${chapterPrev.name}`}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
              >
                <ChevronLeft aria-hidden className="size-4" strokeWidth={2} />
              </Link>
            ) : (
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center text-muted-foreground/30"
              >
                <ChevronLeft className="size-4" strokeWidth={2} />
              </span>
            )
          ) : verseNeighbours.previous ? (
            <Link
              to="/gita/$chapter/$verse"
              params={{
                chapter: String(verseNeighbours.previous.chapter),
                verse: String(verseNeighbours.previous.verse),
              }}
              aria-label={`Previous verse ${verseRef(verseNeighbours.previous)}`}
              title={`Verse ${verseRef(verseNeighbours.previous)}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
            >
              <ChevronLeft aria-hidden className="size-4" strokeWidth={2} />
            </Link>
          ) : (
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center text-muted-foreground/30"
            >
              <ChevronLeft className="size-4" strokeWidth={2} />
            </span>
          )}

          {/* Center location trigger -> opens Chapter & Verse Flipper */}
          <button
            type="button"
            aria-expanded={panel === 'flipper'}
            aria-controls="gita-book-panel"
            onClick={() => togglePanel('flipper')}
            className={cn(
              'flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm transition-colors hover:bg-surface-blush-hover',
              panel === 'flipper' && 'bg-surface-blush-hover',
            )}
          >
            <span className="truncate font-medium text-foreground">
              Ch. {chapter.chapter}
              <span className="hidden font-normal text-muted-foreground sm:inline">
                {' '}
                · {chapter.name}
              </span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {activeVerse}/{chapter.length}
            </span>
            <ChevronDown
              aria-hidden
              className={cn(
                'size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none',
                panel === 'flipper' && 'rotate-180',
              )}
            />
          </button>

          {/* Switch between Chapter scroll and Single-verse page-turn mode */}
          {mode === 'chapter' ? (
            <Link
              to="/gita/$chapter/$verse"
              params={{
                chapter: String(chapter.chapter),
                verse: String(activeVerse),
              }}
              aria-label="Switch to single-verse view"
              title="Read one verse at a time"
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
            >
              <BookOpen aria-hidden className="size-4" strokeWidth={1.8} />
              <span className="hidden sm:inline">Verse</span>
            </Link>
          ) : (
            <Link
              to="/gita/$chapter"
              params={{ chapter: String(chapter.chapter) }}
              hash={`v${activeVerse}`}
              aria-label="Switch to chapter scroll view"
              title="Read full chapter"
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
            >
              <AlignJustify aria-hidden className="size-4" strokeWidth={1.8} />
              <span className="hidden sm:inline">Chapter</span>
            </Link>
          )}

          {/* Reading display options (Aa) */}
          <button
            type="button"
            aria-expanded={panel === 'display'}
            aria-controls="gita-display-panel"
            aria-label="Reading display options"
            title="Reading display options"
            onClick={() => togglePanel('display')}
            className={cn(
              'flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-xl px-2.5 font-serif text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground',
              panel === 'display' && 'bg-pink-soft text-pink-ink',
            )}
          >
            Aa
          </button>

          {/* Next chapter or next verse */}
          {mode === 'chapter' ? (
            chapterNext ? (
              <Link
                to="/gita/$chapter"
                params={{ chapter: String(chapterNext.chapter) }}
                aria-label={`Next: Chapter ${chapterNext.chapter}`}
                title={`Chapter ${chapterNext.chapter}: ${chapterNext.name}`}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
              >
                <ChevronRight aria-hidden className="size-4" strokeWidth={2} />
              </Link>
            ) : (
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center text-muted-foreground/30"
              >
                <ChevronRight className="size-4" strokeWidth={2} />
              </span>
            )
          ) : verseNeighbours.next ? (
            <Link
              to="/gita/$chapter/$verse"
              params={{
                chapter: String(verseNeighbours.next.chapter),
                verse: String(verseNeighbours.next.verse),
              }}
              aria-label={`Next verse ${verseRef(verseNeighbours.next)}`}
              title={`Verse ${verseRef(verseNeighbours.next)}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
            >
              <ChevronRight aria-hidden className="size-4" strokeWidth={2} />
            </Link>
          ) : (
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center text-muted-foreground/30"
            >
              <ChevronRight className="size-4" strokeWidth={2} />
            </span>
          )}
        </div>

        {/* Quiet chapter progress hairline */}
        <div
          aria-hidden
          className="h-0.5 w-full bg-border/60"
        >
          <div
            className="h-full origin-left bg-primary/70 transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>

      {/* Display options popover */}
      {panel === 'display' && (
        <div
          id="gita-display-panel"
          className="absolute inset-x-0 top-full z-30 mt-2 rounded-2xl border border-border bg-popover p-4 shadow-(--surface-shadow) sm:p-5"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">
              Reading display
            </p>
            <button
              type="button"
              aria-label="Close display options"
              onClick={() => setPanel(null)}
              className="flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>
          <ReadingOptionsBar options={options} onChange={onOptionsChange} />
        </div>
      )}

      {/* Chapter & Verse Flipper drawer */}
      {panel === 'flipper' && (
        <div
          id="gita-book-panel"
          className="absolute inset-x-0 top-full z-30 mt-2 flex max-h-[75svh] flex-col overflow-hidden rounded-2xl border border-border bg-popover shadow-(--surface-shadow)"
        >
          {/* Tabs header */}
          <div className="flex items-center gap-1 border-b border-border px-3 py-2.5">
            {(
              [
                { key: 'contents', label: 'Contents', icon: BookOpen },
                { key: 'search', label: 'Search', icon: Search },
                {
                  key: 'saved',
                  label: saved.length > 0 ? `Saved (${saved.length})` : 'Saved',
                  icon: Bookmark,
                },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={tab === item.key}
                onClick={() => setTab(item.key)}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground sm:text-sm',
                  tab === item.key && 'bg-pink-soft text-pink-ink',
                )}
              >
                <item.icon aria-hidden className="size-3.5" strokeWidth={1.9} />
                {item.label}
              </button>
            ))}

            <Link
              to="/gita"
              onClick={() => setPanel(null)}
              className="ml-auto hidden rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground sm:inline-flex"
            >
              Book overview
            </Link>
            <button
              type="button"
              aria-label="Close navigator"
              onClick={() => setPanel(null)}
              className="ml-auto flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-blush-hover hover:text-foreground sm:ml-1"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>

          {/* Tab body */}
          <div className="overflow-y-auto p-4 sm:p-5">
            {tab === 'contents' && (
              <div className="flex flex-col gap-5">
                {/* Verse number grid for the selected chapter */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      Chapter {selectedChapter.chapter}: {selectedChapter.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => goToChapter(selectedChapter.chapter)}
                      className="cursor-pointer text-xs font-medium text-pink-ink hover:underline"
                    >
                      Open chapter {selectedChapter.chapter}
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-10">
                    {Array.from(
                      { length: selectedChapter.length },
                      (_, i) => i + 1,
                    ).map((num) => {
                      const isCurrent =
                        selectedChapter.chapter === chapter.chapter &&
                        num === activeVerse
                      const isSaved = savedSet.has(
                        `${selectedChapter.chapter}.${num}`,
                      )
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => goToVerse(selectedChapter.chapter, num)}
                          aria-label={`Chapter ${selectedChapter.chapter}, verse ${num}${isSaved ? ' (saved)' : ''}`}
                          className={cn(
                            'relative flex h-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-xs font-medium text-foreground tabular-nums transition-colors hover:bg-surface-blush-hover',
                            isCurrent &&
                              'border-primary bg-pink-soft text-pink-ink',
                          )}
                        >
                          {num}
                          {isSaved && (
                            <span
                              aria-hidden
                              className="absolute top-1 right-1 size-1.5 rounded-full bg-primary"
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* All 18 chapters selector */}
                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Chapters — tap a chapter to pick a verse
                  </p>
                  <ol className="grid gap-1 sm:grid-cols-2">
                    {CHAPTERS.map((item) => {
                      const isSelected = item.chapter === selectedChapter.chapter
                      const isReadingHere = item.chapter === chapter.chapter
                      return (
                        <li key={item.chapter}>
                          <button
                            type="button"
                            onClick={() => setPreviewChapter(item.chapter)}
                            className={cn(
                              'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface-blush-hover',
                              isSelected && 'bg-pink-soft/80',
                            )}
                          >
                            <span
                              className={cn(
                                'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums ring-1 ring-border',
                                isReadingHere
                                  ? 'bg-pink-soft text-pink-ink'
                                  : 'bg-card text-muted-foreground',
                              )}
                            >
                              {item.chapter}
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate text-sm font-medium text-foreground">
                                {item.name}
                              </span>
                              <span className="truncate text-xs text-muted-foreground">
                                {item.about} · {item.length}
                              </span>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              </div>
            )}

            {tab === 'search' && (
              <div onClick={(event) => {
                if ((event.target as HTMLElement).closest('a')) setPanel(null)
              }}>
                <GitaSearch />
              </div>
            )}

            {tab === 'saved' && (
              <div className="flex flex-col gap-3">
                {saved.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No saved verses yet. Tap the bookmark icon on any verse to
                    keep it here.
                  </p>
                ) : (
                  <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                    {saved.map((ref) => {
                      const parsed = parseRef(ref)
                      const snippet = savedSnippets[ref]
                      return (
                        <li key={ref}>
                          <button
                            type="button"
                            onClick={() =>
                              goToVerse(parsed.chapter, parsed.verse)
                            }
                            className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-blush-hover"
                          >
                            <span className="w-11 shrink-0 pt-0.5 text-sm font-medium text-peach-ink tabular-nums">
                              {ref}
                            </span>
                            <span className="line-clamp-2 min-w-0 flex-1 text-sm leading-relaxed text-pretty text-foreground">
                              {snippet || `Chapter ${parsed.chapter}, verse ${parsed.verse}`}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
