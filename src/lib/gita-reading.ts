/** Reading preferences, place and saved verses. Kept on this device only. */

export const READING_KEY = 'gita-reading'
export const LAST_READ_KEY = 'gita-last-read'
export const SAVED_KEY = 'gita-saved'

export type TextSize = 's' | 'm' | 'l'

/** Which English version to read: natural prose, or word-for-word. */
export type EnglishStyle = 'plain' | 'literal'

export type ReadingOptions = {
  sanskrit: boolean
  transliteration: boolean
  translation: boolean
  english: EnglishStyle
  size: TextSize
}

export const DEFAULT_READING: ReadingOptions = {
  sanskrit: true,
  transliteration: false,
  translation: true,
  english: 'plain',
  size: 'm',
}

export type LastRead = { chapter: number; verse: number }

/** Type sizes for the Sanskrit and the English at each reading size. */
export const SIZE_CLASSES: Record<TextSize, { sa: string; en: string }> = {
  s: { sa: 'text-xl leading-[1.7]', en: 'text-base leading-relaxed' },
  m: { sa: 'text-2xl leading-[1.7]', en: 'text-lg leading-relaxed' },
  l: { sa: 'text-3xl leading-[1.7]', en: 'text-xl leading-relaxed' },
}
