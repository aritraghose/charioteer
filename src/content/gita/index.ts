import type {
  Chapter,
  Facing,
  GlossaryTerm,
  Speaker,
  Verse,
} from '@/content/gita/types'

export type { Chapter, Facing, GlossaryTerm, Speaker, Verse }

/** All eighteen chapters, with their traditional names. */
export const CHAPTERS: Chapter[] = [
  { chapter: 1, name: 'Arjuna Viṣāda Yoga', about: "Arjuna's despair", length: 47 },
  { chapter: 2, name: 'Sāṅkhya Yoga', about: 'The yoga of understanding', length: 72 },
  { chapter: 3, name: 'Karma Yoga', about: 'The yoga of action', length: 43 },
  { chapter: 4, name: 'Jñāna Karma Saṁnyāsa Yoga', about: 'Knowledge and the renunciation of action', length: 42 },
  { chapter: 5, name: 'Karma Saṁnyāsa Yoga', about: 'The renunciation of action', length: 29 },
  { chapter: 6, name: 'Dhyāna Yoga', about: 'The yoga of meditation', length: 47 },
  { chapter: 7, name: 'Jñāna Vijñāna Yoga', about: 'Knowledge and realisation', length: 30 },
  { chapter: 8, name: 'Akṣara Brahma Yoga', about: 'The imperishable brahman', length: 28 },
  { chapter: 9, name: 'Rāja Vidyā Rāja Guhya Yoga', about: 'The royal knowledge and the royal secret', length: 34 },
  { chapter: 10, name: 'Vibhūti Yoga', about: 'The divine manifestations', length: 42 },
  { chapter: 11, name: 'Viśvarūpa Darśana Yoga', about: 'The vision of the universal form', length: 55 },
  { chapter: 12, name: 'Bhakti Yoga', about: 'The yoga of devotion', length: 20 },
  { chapter: 13, name: 'Kṣetra Kṣetrajña Vibhāga Yoga', about: 'The field and the knower of the field', length: 35 },
  { chapter: 14, name: 'Guṇatraya Vibhāga Yoga', about: 'The three guṇas', length: 27 },
  { chapter: 15, name: 'Puruṣottama Yoga', about: 'The supreme person', length: 20 },
  { chapter: 16, name: 'Daivāsura Sampad Vibhāga Yoga', about: 'The divine and the demonic natures', length: 24 },
  { chapter: 17, name: 'Śraddhātraya Vibhāga Yoga', about: 'The three kinds of faith', length: 28 },
  { chapter: 18, name: 'Mokṣa Saṁnyāsa Yoga', about: 'Liberation and renunciation', length: 78 },
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
      'Literally "yoking" or "joining". In the Bhagavad Gita it means a discipline or method, and also the steady state that discipline leads to. Verse 2.48 defines it as evenness of mind. It does not mean physical postures here.',
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
  {
    id: 'dharma',
    sa: 'dharma',
    devanagari: 'धर्म',
    meaning:
      'What holds things in place: duty, right conduct, the order of things, and also a person\'s own proper work or nature (sva-dharma). In chapter 2 it is mostly Arjuna\'s duty as a warrior.',
  },
  {
    id: 'brahman',
    sa: 'brahman',
    devanagari: 'ब्रह्मन्',
    meaning:
      'The absolute: the ultimate reality behind everything. It is not the god Brahmā and not the priestly class, which are different words.',
  },
  {
    id: 'guna',
    sa: 'guṇa',
    devanagari: 'गुण',
    meaning:
      'Literally "strand" or "quality". The three guṇas, sattva (clarity), rajas (drive) and tamas (inertia), are the strands that make up nature and colour the mind.',
  },
  {
    id: 'prajna',
    sa: 'prajñā',
    devanagari: 'प्रज्ञा',
    meaning:
      'Wisdom or insight: knowing clearly, as opposed to having information. When it is "established", a person is called sthita-prajña.',
  },
  {
    id: 'samadhi',
    sa: 'samādhi',
    devanagari: 'समाधि',
    meaning:
      'Literally "placing together": the mind fully collected and settled on one thing, in deep concentration.',
  },
  {
    id: 'sankhya',
    sa: 'sāṅkhya',
    devanagari: 'साङ्ख्य',
    meaning:
      'The way of understanding or analysis: seeing clearly what is the self and what is not. In the Bhagavad Gita it is paired with yoga, the way of disciplined action.',
  },
  {
    id: 'sannyasa',
    sa: 'saṁnyāsa',
    devanagari: 'संन्यास',
    meaning:
      'Renunciation: literally "laying down completely". In chapter 6 it means giving up self-centred intentions, not giving up action.',
  },
  {
    id: 'indriya',
    sa: 'indriya',
    devanagari: 'इन्द्रिय',
    meaning:
      'A sense or faculty: seeing, hearing, smelling, tasting and touching, and in some lists the faculties of action as well. The senses are what pull the mind outward.',
  },
  {
    id: 'shanti',
    sa: 'śānti',
    devanagari: 'शान्ति',
    meaning:
      'Peace: the quiet that comes when craving and agitation have settled. It is a result of steadiness, not a mood to be produced.',
  },
  {
    id: 'dehin',
    sa: 'dehin',
    devanagari: 'देहिन्',
    meaning:
      'The embodied one: the one who has a body (deha), as distinct from the body. The word śarīrin means the same.',
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

export const TOTAL_VERSES = CHAPTERS.reduce(
  (sum, chapter) => sum + chapter.length,
  0,
)

type Ref = { chapter: number; verse: number }

export const verseRef = (verse: Ref) => `${verse.chapter}.${verse.verse}`

export function parseRef(ref: string): Ref {
  const [chapter, verse] = ref.split('.').map(Number)
  return { chapter, verse }
}

export function getChapter(chapter: number) {
  return CHAPTERS.find((item) => item.chapter === chapter)
}

export function hasVerse({ chapter, verse }: Ref) {
  const found = getChapter(chapter)
  return !!found && Number.isInteger(verse) && verse >= 1 && verse <= found.length
}

// Each chapter is its own file, loaded only when a page needs it.
const chapterFiles = import.meta.glob<{ VERSES: Verse[] }>(
  './chapters/chapter-*.ts',
)

export async function loadChapter(chapter: number): Promise<Verse[]> {
  const file = `./chapters/chapter-${String(chapter).padStart(2, '0')}.ts`
  const load = chapterFiles[file]
  return load ? (await load()).VERSES : []
}

export async function loadVerse(ref: Ref) {
  if (!hasVerse(ref)) return undefined
  const verses = await loadChapter(ref.chapter)
  return verses.find((item) => item.verse === ref.verse)
}

export function getTerm(id: string) {
  return GLOSSARY.find((term) => term.id === id)
}

/** The verses before and after this one, crossing chapter boundaries. */
export function neighbours({ chapter, verse }: Ref): {
  previous?: Ref
  next?: Ref
} {
  const current = getChapter(chapter)
  if (!current) return {}
  const before = getChapter(chapter - 1)
  const after = getChapter(chapter + 1)
  return {
    previous:
      verse > 1
        ? { chapter, verse: verse - 1 }
        : before && { chapter: before.chapter, verse: before.length },
    next:
      verse < current.length
        ? { chapter, verse: verse + 1 }
        : after && { chapter: after.chapter, verse: 1 },
  }
}
