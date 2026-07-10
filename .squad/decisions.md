# Squad Decisions

## Active Decisions

### 2. Quduri Taharah Seed — Bilingual Content Format (2026-07-14)
**Author:** Khwarizmi

Implemented seed file for Mukhtasar al-Quduri's Kitab al-Taharah targeting TEEN/ADULT audiences.

**Key Decisions:**
- **Bilingual Format:** Side-by-side `<div class="bilingual-text">` layout (unlike CB1-2 inline Arabic). Rationale: Classical texts require direct Arabic-English pairing
- **FlashCard orderIndex:** Per-unit reset (not global). Aligns with schema's @@unique[unitId, orderIndex] constraint
- **Translation Disclaimers:** All English translations marked `[AI-Generated Translation]` for clarity and future scholarly attribution
- **Question Difficulty:** MEDIUM/HARD (targets teens/adults; tests legal conditions, exceptions, scholarly differences)

**Status:** Implemented in `backend/prisma/seed-quduri-taharah.ts` (2092 lines)

---

### 8. Quduri Salah Seed — Bilingual Content Format (2026-07-14)
**Author:** Khwarizmi

Implemented seed file for Mukhtasar al-Quduri's Kitab al-Salah targeting TEEN/ADULT audiences, following the exact pattern of Decision #2 (Taharah seed).

**Key Decisions:**
- **Same Format as Taharah:** Reuses bilingual `<div class="bilingual-text">` layout, `[AI-Generated Translation]` disclaimers, per-unit orderIndex reset for flashcards
- **8 Units:** Awqat al-Salah, Adhan, Shurut al-Salah, Fara'id al-Salah, Sifat al-Salah, Al-Jama'ah, Salat al-Musafir, Salat al-Jumu'ah wa al-'Idayn
- **Hanafi-Distinctive Rulings:** Highlighted in questions — double shadow for Dhuhr end, white shafaq for Maghrib, qahqahah breaking wudu', min Jumu'ah 3 besides imam, qunut in Witr year-round, muhazat al-mar'ah invalidating man's prayer
- **Totals:** 42 questions, 35 flashcards, 55 Arabic terms

**Status:** Implemented in `backend/prisma/seed-quduri-salah.ts` (1318 lines); wired into `seed.ts`

---

### 40. Maktab Online School — 4 Key Decisions Confirmed (2026-07-09)
**By:** hrasheed (via Copilot)

**Decision 1 — Foundation UI: Build child-first UI**
hrasheed confirmed: build a new child-first UI for ages 4–6 (not just adapt existing ChildDashboard). Higher quality path chosen over faster adaptation.

**Decision 2 — Longer surahs (CB5–8): Build them out**
hrasheed confirmed: DO NOT skip longer surahs. Build out the content for longer surahs (Yāsīn, As-Sajdah, Al-Mulk, Al-Wāqi'ah, Ar-Raḥmān, Al-Kahf first 10) using the same approach as the Juz Amma seed (per-ayah units with Arabic text, transliteration, translation, audio from everyayah.com).

**Decision 3 — Du'ā audio: Plan for MP3s**
hrasheed confirmed: Assume we will have MP3 files for du'ā recitation. hrasheed can record them personally if no other source is found. Design the system to reference MP3 audio files. No TTS fallback needed.

**Decision 4 — Teacher role: Phase 2**
hrasheed confirmed: Teacher/facilitator role is Phase 2. Not blocking MVP definition.

**Why:** These 4 decisions were surfaced in the Maktab Online School research spike (docs/maktab-online-school-spike.html) as blockers for Sprint 1 planning.

---

### 41. Ibn Sina Decision — Program Enrollment UI + Grade Dashboard (2026-07-09)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Built the complete Program Enrollment UI and Grade Dashboard for the Maktab An Naṣīḥah curriculum. The backend (Khwarizmi) is building the Program/ProgramStage/ProgramEnrollment API concurrently; these components are type-safe against the agreed schema.

**Key Decisions:**

#### 1. TypeScript-first, API-ready with graceful fallback
- All components type against `frontend/src/types/program.ts` interfaces aligned with Khwarizmi's schema decision
- `ProgramCatalog` ships static `DEFAULT_STAGES` and `PLACEHOLDER_PROGRAM` constants so the page renders beautifully even before the backend API is live — no hard dependency on `/api/programs` being ready.
- `GradeDashboard` falls back to `currentStage.courses` (embedded in enrollment response) when `stageSummary` is unavailable.

#### 2. Separate Zustand store (`programStore.ts`)
- Program state is isolated from course state — different domain, different lifecycle.
- `isEnrolling` is a separate boolean from `isLoading` so the enrollment modal can show a spinner independently of page-level loading states.

#### 3. Child-first design decisions
- All interactive elements have `min-h-[44px]` for touch-friendly tap targets.
- Subject cards use large category emojis as the primary visual identifier — kids 4–7 recognize emoji faster than text labels.
- `ProgressRing` SVG component gives a circular visual for overall stage progress (more engaging than a bar at the top level).
- Encouraging copy in `GradeDashboard` adapts based on progress bracket: <30%, 30-60%, >60%.

#### 4. Routing strategy
- `/programs` and `/program/:slug` added under parent `ProtectedRoute` (parents browse and enroll).
- `/child/maktab` added under `ChildProtectedRoute` (kids view their own dashboard).
- Both use `lazy()` import for code splitting.

#### 5. Age-based stage auto-detection in enrollment modal
- `detectStageNumber()` iterates `program.stages` and finds the first stage where `ageMin <= member.age <= ageMax`.
- Displayed inline on each member card in the modal so parents can see the recommended stage before confirming.

**Files Created/Modified:**
- **Created:** `frontend/src/types/program.ts`
- **Created:** `frontend/src/services/program.service.ts`
- **Created:** `frontend/src/stores/programStore.ts`
- **Created:** `frontend/src/pages/program/ProgramCatalog.tsx`
- **Created:** `frontend/src/pages/program/GradeDashboard.tsx`
- **Modified:** `frontend/src/pages/child/ChildDashboardHome.tsx` (added My Maktab section)
- **Modified:** `frontend/src/App.tsx` (added routes)
- **Modified:** `frontend/src/stores/index.ts` (exported programStore)
- **Modified:** `frontend/src/services/index.ts` (exported programService)

**Validation:** `npx tsc --noEmit` passes clean.

---

### 42. Maktab Foundation Seed Files (2026-07-09)
**Author:** Khwarizmi (Backend Dev)
**Status:** Implemented

Created two new maktab seed files (`seed-maktab-foundation1.ts`, `seed-maktab-foundation2.ts`) for the pre-coursebook foundation stages (ages 4–6).

**Key Choices:**

#### flashcardIndex resets per unit
Each unit's flashcards start at `orderIndex = 0`. The composite unique key `unitId_orderIndex` ensures no collisions. This differs from the coursebook seeds which use a single running `flashcardIndex` across all units in the file, but is correct here because the uniqueness constraint is per-unit.

#### Foundation 2 ageLevels includes both EARLY_CHILD and CHILD
Foundation 2 spans ages 5–6, which straddles the boundary. Both levels are included so it surfaces correctly for both age groups in the catalogue.

#### Both courses use category FIQH
All maktab curriculum courses use `FIQH` as their category. The broader du'ā and Qur'ān subject matter fits within this category label consistent with team convention.

#### Foundation seeds called before Coursebook 1 in seed.ts
Age ordering: Foundation 1 (4–5) → Foundation 2 (5–6) → Coursebook 1 (6–7) → ... Coursebook 8. The call order in `seed.ts` reflects this natural age progression.

**Files Created:**
- `backend/prisma/seed-maktab-foundation1.ts`
- `backend/prisma/seed-maktab-foundation2.ts`

**Files Modified:**
- `backend/prisma/seed.ts` — imports + calls added before `seedMaktabCoursebook1`

---

### 43. Quran Memorization — Longer Surahs Seed (2026-07-09)
**Author:** Khwarizmi (Backend Dev)

**Context:**
The maktab syllabus CB5–CB8 requires memorization of longer surahs by older students. The existing Juz Amma course (`seed-quran-memorization.ts`) covers short surahs (Al-Fatiha + surahs 93–114). A second standalone seed is needed.

**Decisions Made:**

#### 1. Exclude surahs 93 and 94 from the new course
Surahs 93 (Ad-Duha) and 94 (Ash-Sharh) appear in the CB5 syllabus but are already fully seeded in the Juz Amma course. Duplicating them would create two courses with identical units for the same content, leading to double-counting of completion and confusing students. **They are skipped.**

#### 2. Al-Kahf partial-surah via client-side slice
The api.quran.com v4 API does not support a stable `per_page`/`from_ayah` offset that guarantees exactly 10 results across all pagination implementations. Rather than craft a fragile pagination URL, we fetch all 110 verses and slice `[:10]` client-side. This is safe because the full chapter is ~11 KB JSON — negligible overhead. The `limitToAyahs` parameter on `fetchSurahData()` keeps the logic self-contained.

#### 3. Reuse exact same pattern as Juz Amma seed
No new abstractions introduced. The new file is a deliberate copy-and-adapt to keep both seeds independently readable and runnable. Shared helpers (HTML builders, slug generation, audio URL builder) are inlined rather than extracted to a shared module — this avoids a new dependency that would force both seeds to import from a third file.

#### 4. ageLevels: `['CHILD', 'PRE_TEEN', 'TEEN']`
The CB5–CB8 syllabus targets ages 10–14. Including CHILD (10+) covers CB5 students who may appear in the CHILD age category depending on their profile.

**Files Affected:**
- `backend/prisma/seed-quran-longer-surahs.ts` — new file
- `backend/prisma/seed.ts` — import + call added after `seedQuranMemorizationCourse()`

---

### 44. Program/ProgramStage/ProgramEnrollment Schema + API (2026-07-09)
**Author:** Khwarizmi (Backend Dev)
**Status:** Implemented — pending migration

**Context:**
Online Maktab requires a curriculum-level abstraction above the existing `Course` model. A `Program` is a named curriculum (e.g., "Maktab An Nasihah"), a `ProgramStage` is a year/grade within it, and `ProgramEnrollment` tracks which child is in which program on which learning path.

**Decisions:**

#### 1. `LearningPath` and `Gender` as first-class enums
Both become PostgreSQL native enums via Prisma. This makes invalid values a hard DB-level error rather than a silent string mismatch.

#### 2. `ProgramEnrollment.status` stays `String`, not enum
Mirrors `CourseEnrollment.status`. Keeps flexibility to add statuses (e.g., `GRADUATED`) without a migration for every edge case.

#### 3. Course ↔ ProgramStage is an implicit M2M
No join model. Prisma's implicit join table (`_CourseToProgamStage`) is adequate until we need to store ordering or additional metadata on the relationship.

#### 4. `GET /programs/:slug` served at `/programs/slug/:slug`
The Express router cannot distinguish `/programs/some-slug` (string) from `/programs/:programId` (UUID) purely by regex without reordering. Using a dedicated `/slug/` prefix eliminates the ambiguity cleanly.

#### 5. `Unit.includedInPaths` — empty array = all paths
An empty array means the unit is available on every learning path. A non-empty array restricts to listed paths only. Frontend must filter units by the enrolled member's `path` before displaying them.

#### 6. `FlashCard.stageTag` / `subjectTag` — nullable Strings
Kept as plain strings (e.g., `"F1"`, `"DUA"`) rather than enums. Stage codes are not stable enough to model as DB-level enums; filtering is done at query-time by the frontend or service layer.

#### 7. Migration not run
`prisma generate` succeeded. The actual `migrate dev` / `migrate deploy` will be executed once the team has reviewed the schema and scheduled a maintenance window.

**Impact:**
- **Frontend (Ibn Sina):** New `/api/v1/programs` endpoints available. Enroll via `POST /programs/:programId/enroll`. Use stage-summary endpoint for grade-level progress UI.
- **Seed scripts:** Can now reference `Program` and `ProgramStage` models.
- **FamilyMember:** Now carries optional `gender` — seed scripts and registration flow can optionally populate this.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
