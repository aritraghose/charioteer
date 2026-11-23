import type {
  Chapter,
  Facing,
  GlossaryTerm,
  Speaker,
  Verse,
} from '@/content/gita/types'
import { VERSES } from '@/content/gita/verses'

export { VERSES }
export type { Chapter, Facing, GlossaryTerm, Speaker, Verse }

/** The chapters that have verses in the reader so far. */
export const CHAPTERS: Chapter[] = [
  {
    chapter: 2,
    name: 'Sāṅkhya Yoga',
    about: 'The yoga of understanding',
    length: 72,
  },
  {
    chapter: 6,
    name: 'Dhyāna Yoga',
    about: 'The yoga of meditation',
    length: 47,
  },
]

export const SPEAKER_NAME: Record<Speaker, string> = {
  krishna: 'Kṛṣṇa',
  arjuna: 'Arjuna',
  sanjaya: 'Sañjaya',
  dhritarashtra: 'Dhṛtarāṣṭra',
}

/**
 * Words kept in Sanskrit because no single English word carries them. Each
 * entry gives the range of meaning instead of choosing one.
 */
export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'yoga',
    sa: 'yoga',
    devanagari: 'योग',
    meaning:
      'Literally "yoking" or "joining". In the Gita it means a discipline or method, and also the steady state that discipline leads to. Verse 2.48 defines it as evenness of mind. It does not mean physical postures here.',
  },
  {
    id: 'atman',
    sa: 'ātman',
    devanagari: 'आत्मन्',
    meaning:
      'The self. Sanskrit uses the same word for "oneself" in the everyday sense, for the mind, and for the innermost self. In verses 6.5 and 6.6 it shifts between these, which is why the translation keeps "the self" each time.',
  },
  {
    id: 'manas',
    sa: 'manas',
    devanagari: 'मनस्',
    meaning:
      'The mind as the faculty that attends, wants, doubts and wanders. It is what gets called restless. It is distinct from buddhi, the faculty that decides.',
  },
  {
    id: 'buddhi',
    sa: 'buddhi',
    devanagari: 'बुद्धि',
    meaning:
      'The faculty of understanding and decision: discernment, judgement, resolve. It is what can tell what matters from what does not, and it stands above manas, the wandering mind.',
  },
  {
    id: 'karma',
    sa: 'karman',
    devanagari: 'कर्मन्',
    meaning:
      'Action: anything done, and especially action that is one\'s duty or work. In these verses it does not mean fate or the results of past lives.',
  },
  {
    id: 'sanga',
    sa: 'saṅga',
    devanagari: 'सङ्ग',
    meaning:
      'Clinging or attachment: the mind sticking to an object, an outcome or a result. Literally "contact" or "coming together".',
  },
  {
    id: 'kama',
    sa: 'kāma',
    devanagari: 'काम',
    meaning:
      'Desire or craving: wanting something for oneself. In verse 2.62 it is the wanting that grows out of dwelling on something.',
  },
  {
    id: 'samatva',
    sa: 'samatva',
    devanagari: 'समत्व',
    meaning:
      'Evenness or sameness: staying the same in success and failure, gain and loss. Verse 2.48 gives this as the definition of yoga.',
  },
  {
    id: 'titiksha',
    sa: 'titikṣā',
    devanagari: 'तितिक्षा',
    meaning:
      'Endurance or forbearance: bearing what comes without complaint and without trying to push it away. Verse 2.14 uses the verb form, "endure them".',
  },
  {
    id: 'sthitadhi',
    sa: 'sthita-dhī',
    devanagari: 'स्थितधी',
    meaning:
      'One whose understanding is steady, from sthita (standing firm) and dhī (understanding). The same person is called sthita-prajña, "of steady wisdom", in the surrounding verses.',
  },
  {
    id: 'abhyasa',
    sa: 'abhyāsa',
    devanagari: 'अभ्यास',
    meaning:
      'Practice: repeated effort to bring the mind back and keep it steady. The stress is on repetition over a long time.',
  },
  {
    id: 'vairagya',
    sa: 'vairāgya',
    devanagari: 'वैराग्य',
    meaning:
      'Dispassion: the fading of craving for things, literally "freedom from colouring or passion". It means not being pulled, and does not mean coldness or dislike.',
  },
]

/** Ways into the text from a problem, not a chapter number. */
export const FACING: Facing[] = [
  {
    id: 'restless',
    label: 'My mind will not settle',
    verses: ['6.34', '6.35', '6.26'],
  },
  {
    id: 'unbearable',
    label: 'A feeling seems unbearable',
    verses: ['2.14'],
  },
  {
    id: 'outcomes',
    label: 'I am stuck on how things will turn out',
    verses: ['2.47', '2.48'],
  },
  {
    id: 'dwelling',
    label: 'I keep dwelling on something',
    verses: ['2.62', '2.63'],
  },
  {
    id: 'harsh',
    label: 'I am being hard on myself',
    verses: ['6.5', '6.6'],
  },
  {
    id: 'steady',
    label: 'I want to know what a steady mind is like',
    verses: ['2.56', '6.19'],
  },
]

export const verseRef = (verse: Pick<Verse, 'chapter' | 'verse'>) =>
  `${verse.chapter}.${verse.verse}`

export function getVerse(chapter: number, verse: number) {
  return VERSES.find(
    (item) => item.chapter === chapter && item.verse === verse,
  )
}

export function getVerseByRef(ref: string) {
  const [chapter, verse] = ref.split('.').map(Number)
  return getVerse(chapter, verse)
}

export function getTerm(id: string) {
  return GLOSSARY.find((term) => term.id === id)
}

export function getChapter(chapter: number) {
  return CHAPTERS.find((item) => item.chapter === chapter)
}

/** The verses before and after this one, among those in the reader. */
export function neighbours(verse: Verse) {
  const index = VERSES.indexOf(verse)
  return { previous: VERSES[index - 1], next: VERSES[index + 1] }
}
