import { Link, useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import {
  MAX_HITS,
  type SearchHit,
  parseReference,
  searchGita,
  warmSearch,
} from '@/lib/gita-search'

/**
 * Find a verse by reference ("2.47"), by English words, or by Sanskrit in
 * either script. Accents are optional, so "krsna" finds "Kṛṣṇa".
 */
export function GitaSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<{
    hits: SearchHit[]
    total: number
  } | null>(null)

  const reference = parseReference(query)
  const trimmed = query.trim()

  useEffect(() => {
    if (trimmed.length < 2 || reference) {
      setResult(null)
      return
    }
    let cancelled = false
    const timer = window.setTimeout(() => {
      void searchGita(trimmed).then((found) => {
        if (!cancelled) setResult(found)
      })
    }, 200)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
    // `reference` is derived from `query`, so `trimmed` covers it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const target = reference ?? result?.hits[0]
    if (!target) return
    void navigate({
      to: '/gita/$chapter/$verse',
      params: { chapter: String(target.chapter), verse: String(target.verse) },
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={submit} role="search" className="relative">
        <label htmlFor="gita-search" className="sr-only">
          Search the Bhagavad Gita
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="gita-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={warmSearch}
          autoComplete="off"
          placeholder="Search by verse (2.47), word or Sanskrit"
          className="h-12 w-full rounded-full border border-input bg-card pr-4 pl-11 text-base text-ellipsis outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </form>

      <div aria-live="polite">
        {reference && (
          <Link
            to="/gita/$chapter/$verse"
            params={{
              chapter: String(reference.chapter),
              verse: String(reference.verse),
            }}
            className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-3.5 font-medium transition-colors hover:bg-surface-blush-hover"
          >
            Go to chapter {reference.chapter}, verse {reference.verse}
            <span className="text-sm text-peach-ink tabular-nums">
              {reference.chapter}.{reference.verse}
            </span>
          </Link>
        )}

        {result && result.total === 0 && (
          <p className="px-1 text-sm text-muted-foreground">
            Nothing found for "{trimmed}". Try a different word, or a verse
            number such as 6.35.
          </p>
        )}

        {result && result.total > 0 && (
          <div className="flex flex-col gap-2">
            <p className="px-1 text-sm text-muted-foreground">
              {result.total === 1 ? '1 verse' : `${result.total} verses`}
              {result.total > MAX_HITS && `, showing the first ${MAX_HITS}`}
            </p>
            <ol className="divide-y divide-border overflow-hidden rounded-[22px] border border-border bg-card">
              {result.hits.map((hit) => (
                <li key={`${hit.chapter}.${hit.verse}`}>
                  <Link
                    to="/gita/$chapter/$verse"
                    params={{
                      chapter: String(hit.chapter),
                      verse: String(hit.verse),
                    }}
                    className="flex gap-4 px-5 py-3.5 transition-colors hover:bg-surface-blush-hover"
                  >
                    <span className="w-11 shrink-0 text-sm font-medium text-peach-ink tabular-nums">
                      {hit.chapter}.{hit.verse}
                    </span>
                    <span className="line-clamp-2 text-sm leading-relaxed text-pretty">
                      {hit.translation}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
