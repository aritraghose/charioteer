# How to write the plain-English rendering

The reader shows two English versions of every verse:

- the **literal** translation, already written, which follows the Sanskrit word
  by word and often reads stiffly;
- the **plain** rendering, which you are writing: the same verse in natural
  modern English that someone can read straight through, chapter by chapter.

Your source is the digest file for the chapter (`digest/chapter-NN.txt`). For
each verse it gives the reference and speaker, the Sanskrit, the literal
translation (`LIT:`), the word-by-word meanings (`WORDS:`) and any reading
notes (`NOTE:`). Trust the Sanskrit and the word list over the literal
sentence if they ever disagree.

## Output

One JSON object per batch, keyed by verse number, each value a string:

```json
{
  "34": "The mind is restless, Kṛṣṇa: turbulent, strong and stubborn. Holding it back seems to me as hard as holding back the wind.",
  "35": "No doubt, mighty-armed one, the mind is restless and hard to hold. But with practice, son of Kuntī, and with dispassion, it can be held."
}
```

## Rules

1. **Say what the verse says.** You may reorder words, join clauses, pick the
   natural English word and repeat a noun for clarity. You may not add an idea,
   an explanation, a doctrine or a softening that is not in the verse, and you
   may not leave anything out.
2. **Read naturally.** Plain modern English, full sentences, the way a careful
   writer would put it. Read each verse aloud in your head: if it sounds like a
   translation, rewrite it. Prefer short sentences to one long one.
3. **Connect the verses.** Read the whole chapter before writing. Each verse
   should follow from the one before, using "and", "so", "but", "for" or a
   pronoun where the Sanskrit links them. But every verse must also be complete
   sentences on its own: start with a capital, end with a full stop or question
   mark. Where a Sanskrit sentence runs across several verses, split it into
   complete sentences, one verse each, keeping each verse's own content in that
   verse.
4. **Keep these words in Sanskrit**, as the literal translation does: yoga,
   yogī, buddhi, dharma, brahman, sāṅkhya, samādhi, nirvāṇa, the Vedas, and
   sattva, rajas and tamas. Write "guṇas" for the three together.
5. **ātman is "the self"**, except where it plainly just means "oneself",
   "himself" or "his own", where natural English is fine.
6. **Keep every form of address and epithet**, but phrase it naturally. Drop
   the "O" ("son of Kuntī", not "O son of Kuntī"). Keep names with their
   diacritics (Kṛṣṇa, Arjuna, Pṛthā).
7. **People in general** are "one", "a person" or "those who", not "he", unless
   a particular man is meant.
8. **No dashes as punctuation, no brackets, no quotation marks around speech,
   no footnotes.** Use commas, colons and full stops.
9. Where a note gives two readings, follow the reading the literal translation
   chose.
10. Never copy wording from any published translation, and do not look
    anything up on the web. Write it fresh from the digest.
11. Keep each rendering about as long as the literal one. Do not pad.
