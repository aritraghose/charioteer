// Builds src/content/gita/chapters/ from the files in content-source/gita/.
//
//   content-source/gita/chapter-NN.txt   the Sanskrit source, one verse per line
//   content-source/gita/glosses/NN-*.json  word meanings and translations
//
// The Devanagari comes straight from the source file and the transliteration
// is generated from it, so neither can drift from the published text. Run with
// `pnpm gita`. It fails if a gloss file breaks the rules it can check.

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'content-source/gita')
const glossDir = join(sourceDir, 'glosses')
const outDir = join(root, 'src/content/gita/chapters')

const SPEAKERS = { K: 'krishna', A: 'arjuna', S: 'sanjaya', D: 'dhritarashtra' }

const TERM_IDS = new Set([
  'yoga', 'atman', 'manas', 'buddhi', 'karma', 'sanga', 'kama', 'samatva',
  'titiksha', 'sthitadhi', 'abhyasa', 'vairagya', 'dharma', 'brahman', 'guna',
  'prajna', 'samadhi', 'sankhya', 'sannyasa', 'indriya', 'shanti', 'dehin',
])

// --- Devanagari to IAST ---------------------------------------------------

const VOWELS = {
  अ: 'a', आ: 'ā', इ: 'i', ई: 'ī', उ: 'u', ऊ: 'ū', ऋ: 'ṛ', ॠ: 'ṝ', ऌ: 'ḷ',
  ए: 'e', ऐ: 'ai', ओ: 'o', औ: 'au',
}
const SIGNS = {
  'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū', 'ृ': 'ṛ', 'ॄ': 'ṝ',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
}
const CONSONANTS = {
  क: 'k', ख: 'kh', ग: 'g', घ: 'gh', ङ: 'ṅ', च: 'c', छ: 'ch', ज: 'j', झ: 'jh',
  ञ: 'ñ', ट: 'ṭ', ठ: 'ṭh', ड: 'ḍ', ढ: 'ḍh', ण: 'ṇ', त: 't', थ: 'th', द: 'd',
  ध: 'dh', न: 'n', प: 'p', फ: 'ph', ब: 'b', भ: 'bh', म: 'm', य: 'y', र: 'r',
  ल: 'l', व: 'v', श: 'ś', ष: 'ṣ', स: 's', ह: 'h',
}
const OTHER = { 'ं': 'ṁ', 'ँ': 'm̐', 'ः': 'ḥ', 'ऽ': "'", 'ॐ': 'oṁ' }
const VIRAMA = '्'

export function toIast(text) {
  const chars = [...text]
  let out = ''
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    if (ch in CONSONANTS) {
      out += CONSONANTS[ch]
      const next = chars[i + 1]
      if (next === VIRAMA) i++
      else if (next in SIGNS) {
        out += SIGNS[next]
        i++
      } else out += 'a'
    } else if (ch in VOWELS) out += VOWELS[ch]
    else if (ch in OTHER) out += OTHER[ch]
    else if (ch === '।' || ch === '॥') continue
    else if (ch === ' ' || ch === '-') out += ch
    else throw new Error(`Cannot transliterate "${ch}" in: ${text}`)
  }
  return out.replace(/\s+/g, ' ').trim()
}

// --- Read the source ------------------------------------------------------

const problems = []
const verses = []

// Plain notes on verses that can be read another way, keyed "chapter.verse".
const notes = JSON.parse(readFileSync(join(sourceDir, 'notes.json'), 'utf8'))

const chapterFiles = readdirSync(sourceDir)
  .filter((name) => /^chapter-\d+\.txt$/.test(name))
  .sort()

for (const file of chapterFiles) {
  const chapter = Number(file.match(/\d+/)[0])
  const glosses = {}
  for (const name of readdirSync(glossDir).sort()) {
    if (!name.startsWith(String(chapter).padStart(2, '0') + '-')) continue
    const data = JSON.parse(readFileSync(join(glossDir, name), 'utf8'))
    for (const [verse, gloss] of Object.entries(data)) {
      if (glosses[verse]) problems.push(`${chapter}.${verse}: glossed twice (${name})`)
      glosses[verse] = gloss
    }
  }

  const lines = readFileSync(join(sourceDir, file), 'utf8').trim().split('\n')
  for (const line of lines) {
    const [number, speakerCode, text] = line.split('|')
    const ref = `${chapter}.${number}`
    const gloss = glosses[number]
    if (!gloss) continue // Not glossed yet, so not in the reader yet.

    const devanagari = text.split(' / ').map((part) => part.replace(/\s+/g, ' ').trim())
    const words = gloss.words ?? []
    if (words.length === 0) problems.push(`${ref}: no words`)
    for (const word of words) {
      if (!word.sa || !word.en) problems.push(`${ref}: a word is missing "sa" or "en"`)
      if (word.term && !TERM_IDS.has(word.term))
        problems.push(`${ref}: unknown term "${word.term}" on ${word.sa}`)
    }
    if (!gloss.translation) problems.push(`${ref}: no translation`)
    else if (/[—–]/.test(gloss.translation)) problems.push(`${ref}: dash in translation`)

    const verseNotes = [...(notes[ref] ?? []), ...(gloss.notes ?? [])]
    for (const note of verseNotes) {
      const quoted = note.match(/^"([^"]+)"/)
      if (quoted && !gloss.translation?.toLowerCase().includes(quoted[1].toLowerCase()))
        problems.push(`${ref}: note quotes "${quoted[1]}" but the translation does not say that`)
    }

    verses.push({
      chapter,
      verse: Number(number),
      speaker: SPEAKERS[speakerCode],
      devanagari,
      iast: gloss.iast ?? devanagari.map(toIast),
      words: words.map(({ sa, en, term }) => (term ? { sa, en, term } : { sa, en })),
      translation: gloss.translation,
      ...(verseNotes.length ? { notes: verseNotes } : {}),
      ...(gloss.practice ? { practice: gloss.practice } : {}),
    })
  }
  for (const verse of Object.keys(glosses)) {
    if (!lines.some((line) => line.startsWith(`${verse}|`)))
      problems.push(`${chapter}.${verse}: glossed but not in the source`)
  }
}

for (const ref of Object.keys(notes)) {
  if (!verses.some((verse) => `${verse.chapter}.${verse.verse}` === ref))
    problems.push(`${ref}: has a note but is not in the reader`)
}

if (problems.length) {
  console.error(`${problems.length} problem(s):\n` + problems.join('\n'))
  process.exit(1)
}

// One file per chapter, so a page only loads the chapter it shows.
const header = `// Generated by scripts/build-gita.mjs from content-source/gita/. Do not edit by hand:
// change the gloss files there and run \`pnpm gita\`.
import type { Verse } from '@/content/gita/types'

export const VERSES: Verse[] = `

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
const perChapter = {}
for (const verse of verses) (perChapter[verse.chapter] ??= []).push(verse)
for (const [chapter, list] of Object.entries(perChapter)) {
  const name = `chapter-${String(chapter).padStart(2, '0')}.ts`
  writeFileSync(join(outDir, name), header + JSON.stringify(list, null, 2) + '\n')
}

console.log(
  `Wrote ${verses.length} verses:`,
  Object.fromEntries(Object.entries(perChapter).map(([chapter, list]) => [chapter, list.length])),
)
