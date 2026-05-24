# Skill: TTS Preprocessing Pattern

> Make educational narration pronounce Arabic terms correctly without sacrificing English flow.

## When to Use

Use when lesson content is authored in HTML, includes transliterated Arabic terms, and is narrated through SSML/TTS. Especially useful when the voice engine supports Arabic and English separately but the source content mixes them in one stream.

## Core Pattern

1. **Preprocess HTML before SSML building.** Strip tags only after converting structural elements (like headings) into explicit pause markers.
2. **Map transliterations through canonical term data.** Use backend term records with `arabicText`, `transliteration`, and `translation` so authored variants like `Ṣalāh` or `Wuḍūʾ` normalize to a spoken-friendly form.
3. **Emit spoken order as meaning → Arabic → simple transliteration.** Example: `Prayer صلاة Salah`.
4. **Mark forced Arabic spans.** Wrap inserted Arabic text with markers (for example `[[ar]]...[[/ar]]`) so the SSML builder can force an Arabic voice switch even for a single word.
5. **Preserve heading cadence.** Convert heading tags into explicit break markers before building voice elements.
6. **Keep block extraction HTML-aware.** If audio can be generated per block, extract whole heading/paragraph nodes rather than splitting on raw tags.

## Example

- Preprocess input: `<h2>Ṣalāh</h2><p>Wuḍūʾ is required.</p>`
- Intermediate text: `[[break:800ms]] Prayer [[ar]]صلاة[[/ar]] Salah [[break:500ms]] Ablution [[ar]]وضوء[[/ar]] Wudu is required.`
- SSML builder outcome: break element + English voice + forced Arabic voice + English transliteration.

## Anti-Patterns

- **Do not rely on plain HTML stripping alone.** You lose heading semantics and term metadata.
- **Do not trust an English voice to pronounce inline Arabic or diacritic transliterations correctly.** Force the Arabic segment explicitly.
- **Do not split block audio by removing tags first.** That erases whether content was a heading or paragraph.

## References

- `backend/src/services/tts.service.ts`
- `backend/src/__tests__/audio.test.ts`
- Learned on Islamic Learning Platform: 2026-05-24T09:13:41.427-05:00
