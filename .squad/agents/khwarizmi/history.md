For detailed work history prior to 2026-07-09, see `.squad/agents/khwarizmi/history-archive.md`

Key prior work:
- 2026-05-16: Seed data (50+ courses, 62+ units, 450+ questions, 530+ flashcards)
- 2026-05-17: Games backend (all 26 game types with type-specific engines)
- 2026-05-17: Parent dashboard + child auth APIs
- 2026-05-18: Game engine collapse (26→9 types, migration written)
- 2026-05-20: TTS/audiobook integration, video generation pipeline
- 2026-05-21: Coursebook images → Azure Blob Storage
- 2026-06-20: Content slugs & versioning schema, anti-rush backend (Fisher-Yates, cooldown), migration + backfill script
- 2026-07-04: Resume progress payload ordering + learner fallback for active unit determination
- 2026-07-09: Foundation 1 & 2 seed files, weekend path tagging, flashcard tag backfill, quran longer surahs, program/programstage/programenrollment schema + API

## Quick Status (Most Recent)

**Program/ProgramStage/ProgramEnrollment Schema + API (2026-07-09):** ✅ COMPLETE
- Maktab curriculum abstraction: Program (named curriculum), ProgramStage (year/grade), ProgramEnrollment (child enrollment tracking)
- Added `LearningPath` (AFTER_SCHOOL, WEEKEND) and `Gender` (MALE, FEMALE) enums
- Added `Program`, `ProgramStage`, `ProgramEnrollment` models; extended `Unit` with `includedInPaths`, `FamilyMember` with `gender`, `FlashCard` with `stageTag`/`subjectTag`
- Created `program.service.ts` (listPrograms, getProgramBySlug, enrollMember, getMemberEnrollments, getStageSummary) and `program.routes.ts` (5 endpoints)
- Wired into main routes at `/api/v1/programs`; routes use `/slug/:slug` to avoid UUID regex collision
- Ran `prisma generate` clean, `tsc --noEmit` zero errors; migration pending team review
- Key decisions: `ProgramEnrollment.status` stays String for flexibility; M2M implicit join table; `ageMax: 99` for open-ended ranges

**Foundation 1 & 2 Seed Files (2026-07-09):** ✅ COMPLETE
- `seed-maktab-foundation1.ts`: ages 4–5, 3 units (quran/dua/99-names), 16 questions, 18 flashcards, category FIQH
- `seed-maktab-foundation2.ts`: ages 5–6 (ageLevels both EARLY_CHILD/CHILD), 3 units, 18 questions, 20 flashcards
- Wired before `seedMaktabCoursebook1` in seed.ts (correct age ordering); idempotent upsert pattern; flashcardIndex resets per unit
- All 17/14 du'ās per syllabus

**Quran Longer Surahs Seed (2026-07-09):** ✅ COMPLETE
- `seed-quran-longer-surahs.ts`: Al-Kahf (first 10 ayahs via client-side slice), Yasin, As-Sajdah, Al-Mulk, Al-Waqi'ah, Ar-Rahman
- Surahs 93–94 excluded (already in Juz Amma); Al-Kahf partial via `limitToAyahs` param on `fetchSurahData()`
- Wired into seed.ts after `seedQuranMemorizationCourse()`; ageLevels: ['CHILD', 'PRE_TEEN', 'TEEN'] for CB5–CB8 ages 10–14
- Same pattern/no new abstractions as Juz Amma seed (deliberate copy-and-adapt for independent readability)

**FlashCard Tag Backfill (2026-07-09):** ✅ COMPLETE
- `seed-flashcard-tags.ts`: idempotent post-processing backfill for `FlashCard.stageTag` and `FlashCard.subjectTag`
- Scopes to maktab flashcards by `course.slug startsWith 'maktab-'` (catches Foundation 1/2 despite unit slug pattern)
- Slug parsing explicit/fail-fast; Foundation mapping (F1/F2), Coursebook (CB*), Further Studies normalization (faith→AQAID, essentials/devotional/money/contemporary→FIQH)
- Idempotent via overwrite semantics; batched/chunked updates
- Wired into seed.ts immediately after `seedWeekendPathTags()`

**Weekend Path Content Tagging (2026-07-09):** ✅ COMPLETE
- `seed-weekend-path-tags.ts`: fully idempotent post-processing, resets all maktab units to `[]` then applies AFTER_SCHOOL restrictions
- Three categories restricted: Tārīkh (slug `-tarikh`), Aqā'id (slug `-aqaid`), Further Studies (faith/identity/money/contemporary)
- Uses `endsWith` pattern matching to avoid false positives; wired after `seedGames()` at end of content seeding
- Supports standalone `npx ts-node` execution

## Learnings

- Idempotent seed pattern: upsert-based with explicit slug/composite keys for safe re-runs and student data preservation
- M2M implicit join tables adequate until metadata on relations is needed
- Open-ended age bands modeled with explicit integer caps (e.g., `ageMax: 99`)
- Program seeding is final step — depends on all course slugs existing first
- Backend ready for Sprint 1: schema generated, services complete, routes wired
