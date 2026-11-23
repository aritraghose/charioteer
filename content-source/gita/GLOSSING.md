# How to gloss a verse

Each batch file in `glosses/` is a JSON object keyed by verse number:

```json
{
  "35": {
    "words": [
      { "sa": "asaṁśayam", "en": "without doubt" },
      { "sa": "mahā-bāho", "en": "O mighty-armed one" },
      { "sa": "manaḥ", "en": "the mind", "term": "manas" },
      { "sa": "durnigraham", "en": "hard to restrain" },
      { "sa": "calam", "en": "moving" },
      { "sa": "abhyāsena", "en": "by practice", "term": "abhyasa" },
      { "sa": "tu", "en": "but" },
      { "sa": "kaunteya", "en": "O son of Kuntī" },
      { "sa": "vairāgyeṇa", "en": "by dispassion", "term": "vairagya" },
      { "sa": "ca", "en": "and" },
      { "sa": "gṛhyate", "en": "it is held" }
    ],
    "translation": "Without doubt, O mighty-armed one, the mind is hard to restrain and moving. But by practice, O son of Kuntī, and by dispassion, it is held."
  }
}
```

That example is chapter 6, verse 35:
`असंशयं महाबाहो मनो दुर्निग्रहं चलम् । / अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥`

## Rules

1. The Sanskrit in `chapter-NN.txt` is the source of truth. Work only from it.
   Each line there is `verse|speaker|line / line`.
2. `words` covers every word of the verse, in the order of the verse.
   - `sa` is the word in IAST transliteration with sandhi undone (so `mano`
     becomes `manaḥ`, `'nityās` becomes `anityāḥ`). Use `ṁ` for anusvāra.
   - Keep a compound as one entry with hyphens between its members
     (`śīta-uṣṇa-sukha-duḥkha-dāḥ`).
   - Repeated words get repeated entries.
3. `en` is the literal meaning of that word in this verse: short, lower case
   except names, with its case meaning included ("by practice", "of the
   self", "in action"). Vocatives are "O ...".
4. `term` is optional. Add it only when the word is, or is built on, one of
   these key terms, using exactly these ids:
   `yoga` (yoga, yogī, yukta), `atman` (ātman), `manas` (manas),
   `buddhi` (buddhi), `karma` (karman), `sanga` (saṅga), `kama` (kāma),
   `samatva` (sama, samatva), `titiksha`, `sthitadhi` (sthita-dhī,
   sthita-prajña), `abhyasa`, `vairagya`, `dharma`, `brahman`, `guna`
   (guṇa, sattva, rajas, tamas), `prajna` (prajñā), `samadhi`, `sankhya`,
   `sannyasa`, `indriya` (the senses), `shanti` (śānti), `dehin` (dehin,
   śarīrin: the embodied one).
5. `translation` is a literal English rendering built only from the word
   glosses. Plain modern English, full sentences, nothing added and nothing
   left out.
   - Leave these words in Sanskrit inside the translation: yoga, yogī,
     buddhi, dharma, brahman, sāṅkhya, samādhi, nirvāṇa, the Vedas, and the
     three guṇas by name. Translate everything else.
   - Translate ātman as "the self" every time.
   - Keep vocatives and epithets literal ("O son of Pṛthā", "O slayer of
     Madhu"). Write names with IAST diacritics (Kṛṣṇa, Arjuna, Kuntī).
   - No interpretation, no commentary, no brackets explaining doctrine.
   - Do not use dashes as punctuation. Use commas, colons or full stops.
6. Never copy wording from any published translation. Do not look anything
   up on the web. Work from your own knowledge of Sanskrit grammar.
7. Where a verse can genuinely be read two ways, pick the more literal
   reading and list the verse under "ambiguous" in your final report with
   one line on the alternative.
8. A sentence that runs across verses: end the earlier verse's translation
   with a comma and start the next one in lower case. On the first verse of
   the run add the note "Verses N to M are one sentence in the Sanskrit."
9. `notes` is an optional list of strings on a verse, shown to readers under
   "Another way to read this". Add one only for a real alternative reading
   that changes the meaning. Write it in plain English with no grammar
   jargon, and begin it by quoting the exact phrase from your translation in
   double quotes, for example:
   `"notes": ["\"The means\" can also be read as \"the cause\"."]`
   Most verses need no note.

A verse with notes looks like this:

```json
"3": {
  "words": [ ... ],
  "translation": "...",
  "notes": ["\"The means\" can also be read as \"the cause\"."]
}
```
