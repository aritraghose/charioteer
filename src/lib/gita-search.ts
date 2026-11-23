import { CHAPTERS, type Verse, hasVerse, loadChapter } from '@/content/gita'

export type SearchHit = {
  chapter: number
  verse: number
  /** The plain rendering (or the literal one), for showing under the reference. */
  translation: string
}

type Entry = SearchHit & {
  /** Both English versions, for ranking matches in the English first. */
  english: string
  /** Everything searchable: English, transliteration, word list, Devanagari. */
  all: string
}

/** Lower case with accents removed, so "krsna" finds "Kṛṣṇa". */
export function fold(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

let index: Promise<Entry[]> | null = null

/** Loads every chapter once, the first time someone searches. */
function loadIndex() {
  index ??= Promise.all(
    CHAPTERS.map((chapter) => loadChapter(chapter.chapter)),
  ).then((chapters) =>
    chapters.flat().map((verse: Verse) => ({
      chapter: verse.chapter,
      verse: verse.verse,
      translation: verse.plain ?? verse.translation,
      english: fold(`${verse.plain ?? ''} ${verse.translation}`),
      all: [
        fold(`${verse.plain ?? ''} ${verse.translation}`),
        fold(verse.iast.join(' ')),
        fold(verse.words.map((word) => `${word.sa} ${word.en}`).join(' ')),
        verse.devanagari.join(' '),
      ].join(' \n '),
    })),
  )
  return index
}

/** Start loading in the background, for example when the search box is focused. */
export function warmSearch() {
  void loadIndex()
}

/** "2.47", "2:47" or "2 47" as a direct reference. */
export function parseReference(query: string) {
  const match = query.trim().match(/^(\d{1,2})\s*[.:\s]\s*(\d{1,2})$/)
  if (!match) return undefined
  const ref = { chapter: Number(match[1]), verse: Number(match[2]) }
  return hasVerse(ref) ? ref : undefined
}

export const MAX_HITS = 40

export async function searchGita(query: string): Promise<{
  hits: SearchHit[]
  total: number
}> {
  const words = fold(query).split(/\s+/).filter(Boolean)
  // Devanagari is not changed by folding, so the raw query is matched too.
  const raw = query.trim()
  if (words.length === 0) return { hits: [], total: 0 }

  const entries = await loadIndex()
  const inEnglish: Entry[] = []
  const elsewhere: Entry[] = []
  for (const entry of entries) {
    if (words.every((word) => entry.english.includes(word))) inEnglish.push(entry)
    else if (words.every((word) => entry.all.includes(word)) || entry.all.includes(raw))
      elsewhere.push(entry)
  }
  const all = [...inEnglish, ...elsewhere]
  return {
    hits: all.slice(0, MAX_HITS).map(({ chapter, verse, translation }) => ({
      chapter,
      verse,
      translation,
    })),
    total: all.length,
  }
}
