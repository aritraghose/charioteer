import type { Speaker } from '@/content/gita/types'

/**
 * The reading guide: what a first-time reader needs in order to follow the
 * Bhagavad Gita as a conversation. It is commentary, written for this app, and
 * is kept apart from the verses so the two are never confused.
 *
 * Rules for this content:
 * - It explains who is speaking, to whom and why. It does not add doctrine.
 * - Where traditions read a passage differently, it says so instead of choosing.
 * - Every passage and teaching points at the verses it is describing.
 */

/** A run of verses that belong together, with what is happening in them. */
export type GuidePassage = {
  from: number
  to: number
  title: string
  /** Who is speaking, to whom, and what they are getting at. */
  about: string
}

/** One thing to carry away from a chapter, with the verses it rests on. */
export type GuideTeaching = {
  title: string
  text: string
  /** Verses in this chapter that say it most directly. */
  verses: number[]
}

export type ChapterGuide = {
  chapter: number
  /** Where the conversation stands as the chapter opens. */
  setting: string
  /** The whole chapter, in order, with no verse left out. */
  passages: GuidePassage[]
  /** The chapter in a few sentences. */
  summary: string
  teachings: GuideTeaching[]
}

/** How each voice is introduced when it starts speaking. */
export const SPEAKER_CUE: Record<Speaker, string> = {
  krishna: 'Kṛṣṇa speaks',
  arjuna: 'Arjuna speaks',
  sanjaya: 'Sañjaya narrates',
  dhritarashtra: 'Dhṛtarāṣṭra asks',
}

/** The story that has already happened when verse 1.1 begins. */
export const STORY_SO_FAR: string[] = [
  'The Bhagavad Gita is a conversation that takes place inside a much longer story, the Mahābhārata. That story is about one royal family split in two: the five Pāṇḍava brothers, and their cousins the Kauravas, the hundred sons of the blind king Dhṛtarāṣṭra.',
  'The eldest Kaurava, Duryodhana, took the Pāṇḍavas’ half of the kingdom through a rigged game of dice and sent them into exile for thirteen years. When they came back and asked for it, he refused to return even five villages. Every attempt at peace failed, the last of them led by Kṛṣṇa himself.',
  'So the two sides have gathered their armies on the field of Kurukṣetra. Arjuna, the third Pāṇḍava, is the finest archer alive. Kṛṣṇa, his cousin and closest friend, has promised not to fight, and has agreed to drive Arjuna’s chariot instead. That is why he is called the charioteer.',
  'The Gita begins in the last minutes before the battle. Arjuna asks to be driven between the two armies, sees his own teachers, uncles and cousins on the other side, and cannot go on. Everything that follows is Kṛṣṇa answering him.',
]

/** The four people who speak in the book. */
export const VOICES: {
  speaker: Speaker
  name: string
  role: string
  about: string
}[] = [
  {
    speaker: 'dhritarashtra',
    name: 'Dhṛtarāṣṭra',
    role: 'The blind king',
    about:
      'Father of the Kauravas. He is in his palace, far from the field, and cannot see. He speaks only once, in the very first verse, to ask what is happening.',
  },
  {
    speaker: 'sanjaya',
    name: 'Sañjaya',
    role: 'The narrator',
    about:
      'The king’s adviser, who has been given the power to see and hear the battlefield from a distance. He reports everything to the king. Whenever he speaks, he is describing the scene or telling the king what was said.',
  },
  {
    speaker: 'arjuna',
    name: 'Arjuna',
    role: 'The one who asks',
    about:
      'A warrior about to fight a war he believes is just, against people he loves. His questions are the reader’s questions: what should I do, how do I steady my mind, and who are you really?',
  },
  {
    speaker: 'krishna',
    name: 'Kṛṣṇa',
    role: 'The teacher',
    about:
      'Arjuna’s friend and charioteer. He begins as a friend giving advice. From chapter 4 on he speaks more and more openly as the divine itself, and in chapter 11 Arjuna sees it.',
  },
]

/**
 * The same two people are called by many names. Knowing them saves a first
 * reader from thinking new characters keep arriving.
 */
export const OTHER_NAMES: { of: string; names: { name: string; means: string }[] }[] =
  [
    {
      of: 'Arjuna',
      names: [
        { name: 'Pārtha', means: 'son of Pṛthā, his mother' },
        { name: 'Kaunteya', means: 'son of Kuntī, another name of his mother' },
        { name: 'Bhārata', means: 'descendant of Bharata' },
        { name: 'Pāṇḍava', means: 'son of Pāṇḍu' },
        { name: 'Dhanañjaya', means: 'winner of wealth' },
        { name: 'Guḍākeśa', means: 'master of sleep, or thick-haired' },
        { name: 'Parantapa', means: 'scorcher of foes' },
      ],
    },
    {
      of: 'Kṛṣṇa',
      names: [
        { name: 'Keśava', means: 'the long-haired one' },
        { name: 'Mādhava', means: 'descendant of Madhu' },
        { name: 'Govinda', means: 'herdsman, finder of cows' },
        { name: 'Madhusūdana', means: 'slayer of the demon Madhu' },
        { name: 'Hṛṣīkeśa', means: 'lord of the senses' },
        { name: 'Janārdana', means: 'mover of people' },
        { name: 'Vāsudeva', means: 'son of Vasudeva' },
        { name: 'Acyuta', means: 'the unfallen, the unfailing' },
        { name: 'Vārṣṇeya', means: 'of the Vṛṣṇi clan' },
      ],
    },
  ]

/** The arc of the eighteen chapters, so a reader knows where they are. */
export const BOOK_SHAPE: { from: number; to: number; title: string; about: string }[] =
  [
    {
      from: 1,
      to: 1,
      title: 'The crisis',
      about:
        'Arjuna sees who he must fight, argues himself out of it and puts down his bow.',
    },
    {
      from: 2,
      to: 2,
      title: 'The whole teaching in brief',
      about:
        'Kṛṣṇa’s first answer. Nearly every later theme appears here in a few verses.',
    },
    {
      from: 3,
      to: 6,
      title: 'How to act and how to steady the mind',
      about:
        'Work without clinging to results, what knowledge changes, and the practice of meditation.',
    },
    {
      from: 7,
      to: 12,
      title: 'Who Kṛṣṇa is',
      about:
        'Kṛṣṇa speaks as the source of everything, shows Arjuna his universal form, and teaches devotion.',
    },
    {
      from: 13,
      to: 17,
      title: 'How a person is put together',
      about:
        'The body and the one who knows it, the three guṇas that shape every mind, and what they do to faith, food and conduct.',
    },
    {
      from: 18,
      to: 18,
      title: 'The summing up',
      about:
        'Everything gathered into one chapter, Kṛṣṇa’s last word, and Arjuna’s decision.',
    },
  ]

/** A short honest note on how the book has been read. */
export const READING_NOTE =
  'The setting is a real battlefield in the story, and Arjuna’s question is a real one about duty. Readers have also long taken the field as a picture of the struggle inside a person. This guide stays with what the verses say and points out where they are read in more than one way.'

/** The passage a verse belongs to. */
export function passageFor(guide: ChapterGuide, verse: number) {
  return guide.passages.find(
    (passage) => verse >= passage.from && verse <= passage.to,
  )
}

// The chapter guides are one separate file, loaded only by the reader pages.
export async function loadGuide(
  chapter: number,
): Promise<ChapterGuide | undefined> {
  const { CHAPTER_GUIDES } = await import('@/content/gita/guide-chapters')
  return CHAPTER_GUIDES.find((guide) => guide.chapter === chapter)
}
