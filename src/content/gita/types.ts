/**
 * Data shapes for the Gita reader.
 *
 * Rules for this content:
 * - The Sanskrit text is the source of truth.
 * - `translation` is literal and is built only from the word glosses.
 * - Key terms stay in Sanskrit and link to the glossary through `term`.
 * - Nothing is copied from copyrighted translations.
 */

export type Speaker = 'krishna' | 'arjuna' | 'sanjaya' | 'dhritarashtra'

/** One word, or one compound, of a verse with its meaning. */
export type VerseWord = {
  /** The word in transliteration, with sandhi undone. */
  sa: string
  /** Its literal meaning in this verse. */
  en: string
  /** Glossary id, when this is a key term kept in Sanskrit. */
  term?: string
}

export type Verse = {
  chapter: number
  verse: number
  speaker: Speaker
  /** The verse in Devanagari, one string per printed line (two or four). */
  devanagari: string[]
  /** The same lines in IAST transliteration. */
  iast: string[]
  words: VerseWord[]
  /** Literal translation, built from the word glosses. */
  translation: string
  /** The same verse in natural English, for reading straight through. */
  plain?: string
  /** Where the Sanskrit can be read another way, said plainly. */
  notes?: string[]
  /** A session id that puts this verse into practice, if there is one. */
  practice?: { sessionId: string; label: string }
}

export type GlossaryTerm = {
  id: string
  /** The term in transliteration and in Devanagari. */
  sa: string
  devanagari: string
  /** The range of meanings, in plain English. */
  meaning: string
}

export type Chapter = {
  chapter: number
  /** Traditional chapter name in transliteration. */
  name: string
  /** Plain description of the chapter name. */
  about: string
  /** Number of verses in the full chapter. */
  length: number
}

/** A way into the text from a problem, not a chapter number. */
export type Facing = {
  id: string
  /** The problem in the reader's own words. */
  label: string
  /** Verses that speak to it, as "chapter.verse". */
  verses: string[]
}
