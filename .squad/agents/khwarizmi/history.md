# Khwarizmi — Implementation Agent

**Focus:** Coursebook HTML-to-Prisma seed generation, bilingual classical text integration

## Current Status (2026-05-16)

**Batch 2 Completion:**
- seed-maktab-coursebook6boys.ts (1171 lines, 44 quizzes, 54 flashcards, 34 Arabic terms)
- seed-maktab-coursebook6girls.ts (1382 lines, 46 quizzes, 54 flashcards, 37 Arabic terms)
- seed-maktab-coursebook7.ts (1529 lines, 43 quizzes, 40 flashcards, 25 Arabic terms)
- seed-maktab-coursebook8.ts (1157 lines, 44 quizzes, 54 flashcards, 29 Arabic terms)
- seed-maktab-further-studies-nw.ts (2414 lines, 56 quizzes, 66 flashcards, 36 Arabic terms)
- seed-quduri-taharah.ts (2092 lines, 65 quizzes, 53 flashcards, 68 Arabic terms, bilingual)

**Prior Batches (CB1-CB5):** 5 seeds completed with consistent patterns

**In Progress:** khwarizmi-wire (wiring all seeds into main seed.ts)

## Implementation Patterns Established

### HTML-to-Prisma Conversion
- Subject-based course architecture (one Course per subject per coursebook level)
- Units represent individual topics/lessons with full HTML content
- Consistent ID naming: \coursebook{N}-{subject}-{slug}\
- Upsert pattern for idempotent re-running

### Quiz Generation
- Primary: Direct migration from parent guides (high-quality educator-written questions)
- Fallback: AI-generated from content for sparse coverage
- Question types: MULTIPLE_CHOICE, TRUE_FALSE, MATCHING, FILL_BLANK
- Difficulty mapping: Books 1-2 (EASY), Books 3-5 (MEDIUM), Books 6-8 (HARD), FurtherStudies (HARD)

### Flashcard System
- 5-8 cards per unit, 3 categories: vocabulary, definition, rule
- Includes Arabic text (arabicText, transliteration, translation)
- Uses SM-2 algorithm (easeFactor, interval, repetitions)
- Per-unit orderIndex (not global; aligns with schema @@unique[unitId, orderIndex])

### Arabic Text Handling
- UTF-8 preservation with diacritics intact
- OCR artifact cleaning: \#\ → \ḥ\, \}\ → \ḍ\, \|\ → \ī\, etc.
- Bilingual layout introduced (Quduri Taharah): side-by-side \<div class="bilingual-text">\
- All Arabic terms include transliteration

### Gender-Differentiated Content
- CB6 Books: Separate courses for Boys/Girls
- Content differences reflected in Fiqh (menstruation rulings), Ādāb (ḥijāb sections)
- All other subjects identical across gender variants

### Quduri Taharah (Classical Text Innovation)
- Bilingual format: side-by-side Arabic/English sections
- Target: TEEN/ADULT audiences
- Translation disclaimer: \[AI-Generated Translation]\
- Question difficulty: MEDIUM/HARD (targets scholarly comprehension)

## Known Issues & Resolutions

- OCR artifacts systematized and cleaned in all seeds
- Parent guide quiz quality varies (auto-generated low-quality questions rejected; hand-crafted)
- Image embedding: Filenames preserved in HTML; defer CDN migration to Phase 2
- Classical text scholarly attribution: Deferred; AI translations marked for future scholarly review

## Schema Integration

Models used: Course, Unit, Question, FlashCard, FlashCardProgress (SM-2), ArabicTerm, CourseEnrollment, UnitProgress

Key fields standardized:
- \content\: Full HTML (@db.Text)
- \difficulty\: Enum (EASY/MEDIUM/HARD)
- \iGenerated\: Boolean (tracks AI questions)
- \rontArabic\, \ackArabic\: Arabic flashcard sides

## Metrics Summary

- **Total Seed Files:** 11 (CB1-8 + CB6B/6G + FurtherStudies + Quduri)
- **Total Lines:** ~15,000 lines of TypeScript seed code
- **Total Courses:** 50+ (multiple subjects per book)
- **Total Units:** 62+
- **Total Questions:** 450+
- **Total Flashcards:** 530+
- **Total Arabic Terms:** 318+
- **Average Questions/Unit:** 7-8
- **Average Flashcards/Unit:** 8-9

## Next Steps

- Complete khwarizmi-wire: Integrate all seeds into main seed.ts
- Test database seeding (development and staging)
- UI validation: Bilingual rendering, Arabic diacritics, flashcard SM-2 progress
- Performance: Verify seed execution time and database indexes
