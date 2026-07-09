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

### 18. User Directive — Arabic Term Formatting and Audio UX (2026-05-24)
**Requested by:** hrasheed (via Copilot)

User directive capturing three related feature requests for improving audio and text UX:

**Key Decisions:**
1. Arabic transliterated terms in audio/text should follow the pattern: "English Translation <Arabic Word>/(English transliteration)" — e.g., "Prayer صلاة/(Salah)" instead of bare transliterations with diacritics.
2. Text highlighting during audio playback should occur in the existing content/text window, NOT in a separate small popup below the audio control.
3. Add punctuation (pauses) around headings so the TTS audio pauses appropriately at section breaks.

**Rationale:** Improves audio clarity and reading UX for Islamic education content. Directive captured from team feedback and implementation results.

---

### 20. Inline Audio Sync — Ownership and Page-Level Content Highlighting (2026-05-24)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Synced audio highlighting was rendering in a separate popup below the audio controls, which duplicated the lesson text and split the reading flow.

**Key Decisions:**
- **Component ownership:** UnitAudioButton owns playback controls only and emits word-sync state via onSyncStateChange. UnitViewer owns inline highlighting of the existing lesson body via SyncedTextContent.
- **Rationale:** Keeps Study Aids compact, removes duplicate text windows, lets learners follow the highlighted word inside the same content area they are already reading.
- **Convention:** Future synced readers should prefer page-level content highlighting over embedding a second text surface inside the control component.

**Impact:** Improves reading flow and removes UI duplication.

---

### 23. TTS Arabic Term Normalization + Heading Breaks (2026-05-24)
**Author:** Khwarizmi (Backend Dev)
**Component:** `backend/src/services/tts.service.ts`
**Status:** Implemented

English narration was reading transliterated Arabic terms like `Ṣalāh` and `Wuḍūʾ` with English phonetics, and section headings flowed into body text without enough pause.

**Key Decisions:**
1. **Preprocess HTML** using `preprocessTtsHtml()` instead of plain `stripHtml()`.
2. **Normalize transliterations** against `unit.arabicTerms` so transliterated terms become `Translation + Arabic script + simple transliteration` in spoken order.
3. **Mark inserted Arabic text explicitly** with `[[ar]]...[[/ar]]` so `buildVoiceElements()` always emits an Arabic voice element for the term.
4. **Convert headings into pause markers** (`[[break:800ms]]` before, `[[break:500ms]]` after) before voice-element construction.
5. **Preserve headings for block audio** by replacing regex splitting with `extractSynthesisBlocks()` that keeps `<h1>`-`<h6>` blocks intact.

**Trade-off:** Spoken pattern more verbose but pronunciation quality much better for educational vocabulary. Transliteration matching is heuristic-based targeting common Islamic-studies diacritic variants.

**Validation:** `npx vitest run src/__tests__/audio.test.ts`, `npm run test:ci`, `npm run build`.

---


---

### 24. Mandatory Code Review Gate + Spec-Kit Evaluation (2026-05-24)
**Author:** Khaldun (Lead)
**Status:** ADOPTED (Review gate approved by hrasheed)

Architectural response to 5 production bugs shipped in a single session — all preventable by peer review.

**Problem Statement:**
- Bug 1: Prisma migration not running (cacheVersion missing)
- Bug 2: Audio nav crash (401 redirect loop)
- Bug 3: React #137 (void elements with children)
- Bug 4: Game stats 0% (wrong field name)
- Bug 5: Docker build context wrong

All five are logic errors detectable by reading code.

**Decision 1: Mandatory Review Gate**

**Process:** Agent codes → Review Gate → Approved? → Commit

**Rules:**
- Who reviews: Biruni (Tester) or Khaldun (Lead). Never the author.
- When: Before ANY commit to main. No exceptions for "small fixes."
- Scope: All code changes (backend, frontend, infra, migrations, Docker).
- Time budget: 5-10 minutes (not a design review).

**Review Checklist:**
- [ ] **Migrations:** Any schema change has a corresponding migration file; migration runs cleanly
- [ ] **API contracts:** Request/response field names match between frontend and backend
- [ ] **JSX validity:** No children in void elements (`<br>`, `<hr>`, `<img>`, `<input>`)
- [ ] **Side effects:** Interceptors, middleware, and global handlers don't affect unrelated flows
- [ ] **Docker/Deploy:** COPY paths resolve; env vars referenced are defined; startup scripts execute migrations
- [ ] **Type alignment:** TypeScript interfaces match Prisma schema field names exactly
- [ ] **No regressions:** Existing tests still pass (or are intentionally updated)

**Decision 2: Spec-Kit Evaluation — NOT NOW**

Spec-Kit is interesting but solves the wrong problem. Our bugs are caught by code review, not by better specs. Revisit in Q3 2026 if we find ourselves building wrong features (spec problem) rather than building features wrong (execution problem).

---

### 25. Audio E2E Verification (2026-05-24)
**Author:** Biruni (Tester)
**Status:** Verified — All checks pass

Comprehensive end-to-end audit of audio generation flow after 4 prior failed fixes.

**Test Results:** Frontend 158 tests ✅ PASS | Backend unit 211 tests ✅ PASS | Integration ⚠️ env-only (no test DB)

**All Bug Fixes Verified:**
1. No navigation away from unit page ✅ FIXED
2. Audio API 404 handling ✅ FIXED
3. React #137 void elements ✅ FIXED
4. Axios interceptor redirects ✅ FIXED

**Remaining Risks:** Integration tests need live DB; no E2E test for full click-to-player flow; SyncedTextContent lacks void-element test cases.

---

### 26. Void Element Handling in SyncedTextContent (2026-05-24)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

React #137 crash during audio word-highlighting. `SyncedTextContent` passed children to void elements (`<img>`, `<br>`, `<hr>`).

**Solution:**
1. `VOID_ELEMENTS` set prevents children on void tags
2. Try-catch fallback to `dangerouslySetInnerHTML` on parse failure
3. Error extraction for better backend messages

**Note:** GET audio 404 is expected (no cache yet); POST endpoint works correctly.

---

### 27. Audio Navigation Guard (2026-05-24)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Proposed

Audio CTA could submit parent forms, navigating away from lesson.

**Decision:** Set all audio controls to `type="button"` and call `preventDefault()`.

---

### 28. Inline Audio Controls Self-Contained (2026-05-24)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Audio controls still vulnerable to submit behavior or parent handlers.

**Decision:** All audio/page actions use `type="button"` with `preventDefault()` and `stopPropagation()`.

---

### 29. Audio UX Calibration — Sync Lag + Floating Controls (2026-05-24)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Proposed

Word highlighting ahead of narration; pause controls unreachable when scrolled away.

**Decisions:**
1. Apply `300ms` playback lag for sync
2. Sync on `playing`, `timeupdate`, `seeked` events
3. Floating transport appears when Study Aids scrolls out of view (IntersectionObserver)

---

### 30. Child Course Enrollment Identity Resolution (2026-05-24)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Child logins don't see enrolled courses. Enrollment stored on `CourseEnrollment.memberId` but child auth not populating `req.user`.

**Decision:** Treat child as first-class learner. Use child token for API calls; resolve identity from `req.child`; block cross-sibling access.

---

### 31. Enrollment Member Picker Always Shows Family Roster (2026-05-24)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Enrollment UI removed visibility into newly added family members.

**Decision:** Keep member selector visible; preselect current learner but allow parent to enroll any family member.

---

### 32. Floating Audio Affordance for Long Lesson Pages (2026-05-24)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Long pages: learners scroll away from Study Aids audio controls.

**Decision:** Floating compact transport (play/pause/stop) when playback active and Study Aids scrolled out of view.

---

### 33. Audio Cache Versioning (2026-05-24)
**Author:** Khwarizmi (Backend Dev)
**Status:** Proposed

Arabic formatting fix invalidated old cached audio. New cache rows need versioning to auto-invalidate stale entries.

**Decision:** Add `cacheVersion` field to `AudioCache`; treat rows without current version as stale. New filenames include version; URLs don't reuse old assets.

---

### 34. Course Text Arabic-Term Normalization + Targeted Audio Invalidation (2026-05-24)
**Author:** Khwarizmi (Backend Dev)
**Status:** Proposed

Stored HTML has legacy transliterations (`Salah`, `Wudu`) leaving stale audio cache.

**Decision:**
1. Shared formatter for Arabic terms (course text + TTS aligned)
2. Normalize stored HTML to `Translation Arabic/(Transliteration)`
3. Invalidate audio only for affected units
4. Admin endpoint: `POST /api/v1/admin/invalidate-audio-cache`

---

### 35. PAIR_MATCH Game Stats Fix (2026-05-24)
**Author:** Khwarizmi (Backend Dev)
**Status:** Implemented
**Commit:** e4e369e

Child played pair-match game (2 wrong) but system showed 0% accuracy everywhere.

**Root Cause:** Contract mismatch — frontend sent `{ matched: [] }` but backend read `answer.matches`.

**Fix:**
- Frontend sends `{ matches: [{ termId, definitionId }] }`
- Backend accepts both formats for backward compatibility
- **Pattern:** Compound-answer games need explicit contract comment in `gradeAnswer()`

---

### 36. Prisma Migrate on Backend Startup (2026-05-24)
**Author:** Khwarizmi (Backend Dev)
**Status:** Proposed

Production missed migration, causing runtime failures. Backend built Prisma client but didn't guarantee migrations ran on deploy.

**Decision:** Run `prisma migrate deploy` from container entrypoint before launching Node API. Keep `prisma` in production dependencies.

**Impact:** Every deployment applies pending migrations; startup fails fast if incompatible.

---

### 37. Child Progress Identity Fix (2026-05-24)
**Author:** Khwarizmi (Backend Dev)
**Status:** Implemented

Child progress writes used wrong identity; reads used `FamilyMember.id`. Broke lesson/quiz completion visibility.

**Decision:** Resolve identity from child token or active-member header; recompute enrollment progress on quiz completion.

---

### 38. Remote Arabic-Term Normalization Endpoint (2026-05-24)
**Author:** Khwarizmi (Backend Dev)
**Status:** Proposed

Arabic fixes need content normalization + cache invalidation. Expose via `POST /api/v1/admin/normalize-arabic-terms` instead of SSH access.

**Impact:** Safe remote repairs. Returns updated unit count, term occurrences, cleared cache entries. Safe to repeat.

---

### 39. Temporary Video Generation Rollback (2026-05-24)
**Author:** Khwarizmi (Backend Dev)
**Status:** Implemented

Site hanging; lessons not loading. Video generation non-essential vs. audio/lesson APIs.

**Decision:** Disable video endpoints; return 503 `VIDEO_GENERATION_DISABLED`. Prevents heavyweight Puppeteer/ffmpeg paths.

**Impact:**
- Video generation endpoints disabled
- Audio/lesson APIs untouched
- Reversible rollback while production stabilizes

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction



### 2026-07-04T00:23:33.053-04:00: Refresh learner progress from API on resume
**By:** Biruni
**What:** CourseLearner should re-fetch the active member's enrollments when the learner page loads and prefer the fresh enrollment over any enrollment object passed in router state.
**Why:** Child course links carry an enrollment snapshot in navigation state. After a learner makes progress inside a unit, that snapshot can be stale on return, causing “Continue where you left off” to point back to unit 1 even though newer `unitProgress` exists server-side.

# Decision: Custom Quran Audio Player for Memorization Units

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-06-22T12:33:25.396-05:00  
**Status:** Implemented

## Decision

Added a `QuranAudioPlayer` React component that replaces the native `<audio controls>` element inside any `.quran-verse` container with a child-friendly custom player featuring loop/repeat, playback speed (0.5×–1.5×), a seek bar, and restart.

## Approach

**DOM injection via `createRoot`** — after content renders, a `useEffect` in `UnitViewer` queries `.quran-verse audio` elements within a `contentContainerRef`, hides native controls, and mounts `<QuranAudioPlayer audioEl={el} />` into a host div inserted after each audio element. Cleanup unmounts React roots and restores native controls on unit navigation.

This was chosen over modifying `SyncedTextContent` (would require threading audio player logic through the parser) and over a full "replace native player" approach (would require duplicating audio element or using media sessions API).

## Key Details

- **New file:** `frontend/src/components/QuranAudioPlayer.tsx`
- **Modified:** `frontend/src/pages/courses/UnitViewer.tsx`
  - Imports: `useRef`, `createRoot`, `QuranAudioPlayer`
  - CSS: `.arabic-large` → 2.75rem (3rem on md+), `line-height: 2`, `font-family: 'Amiri', serif`
  - Injection effect deps: `[loading, unit]`
- **Speed options:** `[0.5, 0.75, 1, 1.25, 1.5]` — includes 0.5× for slow recitation practice
- **Loop icon:** Active state uses green ring + bg to give clear visual feedback
- **Guard:** `data-qap-enhanced` attribute prevents double-injection in React Strict Mode

## Scope

Works for **any unit** that has `.quran-verse` containers with `<audio>` elements — not tied to a specific course.

# Decision: Mark-as-Read UX + Quiz Gate in UnitViewer

**Date:** 2026-06-20T17:31:22-05:00  
**Author:** Ibn Sina (Frontend Dev)  
**Status:** Implemented

---

## Context

The backend (Item 9 — Backend) is adding a gate that blocks quiz submissions unless `readingCompleted` is true for the unit. The frontend needed a reliable, discoverable way for students to mark a lesson as read, and needed to surface the quiz gate as a UX hint.

## Decisions

### 1. Persist Reading Status Across Page Loads
- On mount, `UnitViewer` now calls `courseService.getUnitProgress(memberId, unitId)` concurrently via `Promise.all` alongside the existing unit + units fetches.
- This uses the existing `GET /courses/progress/member/:memberId` endpoint, filtering by `unitId`.
- A load failure is caught silently (`.catch(() => null)`) so it never blocks content display.

### 2. Prominent "Mark as Read" Bottom CTA
- Added a large `bg-green-500` button "✅ I've read this lesson" at the bottom of the lesson body — this is the **primary** action surface.
- The existing small header button remains as a secondary/quick shortcut and now shows a green "Read ✅" badge when already completed instead of disappearing.
- When completed, the bottom CTA becomes a muted "Lesson completed ✅" banner (non-clickable).

### 3. Quiz Button Gating (UX Hint Only)
- Both "Take Quiz" surfaces (bottom-nav inside the content card and the sidebar card) are conditionally rendered:
  - `readingCompleted === true` → active `<Link>` styled normally
  - `readingCompleted === false` → disabled `<button>` with `title="Complete the lesson reading first"` and gray styling
- This is a **UX hint only**. The backend enforces the real gate via the quiz submission endpoint.

## Files Changed
- `frontend/src/services/courseService.ts` — added `getUnitProgress(memberId, unitId)` method
- `frontend/src/pages/courses/UnitViewer.tsx` — progress fetch on mount, bottom CTA, quiz gate

## Verification
- `npx tsc --noEmit` passes clean

# Decision: Resume highlight must mirror Continue Learning target

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-07-04T00:55:10-04:00  
**Status:** Proposed

## Context
Course landing page could show the resume highlight as locked (or effectively hide the resume badge) when the true resume target was a later in-progress unit. Meanwhile, **Continue Learning** already navigated to that later unit.

## Decision
When rendering the unit list, treat the computed `resumeUnit` as unlocked for UI gating so the highlighted row and resume badge always represent the same unit that **Continue Learning** opens.

Implementation detail in `CourseLearner.tsx`:
- Lock calculation now excludes the resume target: previous-unit lock applies only when `!isResumeTarget`.

## Why
Learners need one consistent source of truth for “where to continue.” If CTA and row highlight diverge, trust is lost and navigation feels broken.

## Validation
Updated `CourseLearner.test.tsx` with a mismatch regression case (earlier unit incomplete, later unit in-progress) asserting:
1. Resume badge highlights Unit 3 (true resume target)
2. Unit 2 is not highlighted
3. Continue Learning navigates to Unit 3

### 2026-07-04T00:23:33.053-04:00: Refresh learner enrollment before selecting resume unit
**By:** Ibn Sina
**What:** On `CourseLearner` load, always fetch enrollments for the active learner when `memberId` is available, then derive the resume target from ordered course units plus fresh `unitProgress`.
**Why:** Enrollment objects passed through route state can be stale after lesson progress updates, which incorrectly sends learners back to unit 1 instead of where they left off.

# Decision: Maktab Online School — Architecture Decisions

**Author:** Khaldun (Lead Architect)  
**Date:** 2026-07-09T11:20:00.559-05:00  
**Status:** Proposed — awaiting hrasheed confirmation on 4 open items  
**Spike document:** `docs/maktab-online-school-spike.html`

---

## Context

hrasheed wants to launch a structured "Online Maktab" product built on top of the existing platform, aligned to the An Nasihah Islamic Curriculum (12 stages, ages 4–14+, two learning paths).

A full gap analysis confirmed ~82% content coverage exists. The following architecture decisions are required to launch MVP.

---

## Decision 1: New Schema Models — Program/Stage/Enrollment

**Decision:** Introduce three new Prisma models:
- `Program` — the maktab curriculum wrapper (slug, name, learningPaths[], stages[])
- `ProgramStage` — one per year level (stageNumber, name, ageMin/Max, courses[], orderIndex)  
- `ProgramEnrollment` — links a FamilyMember to a Program+Stage+Path (familyMemberId, programId, currentStageId, path: LearningPath, status)

**Rationale:** The existing Course model is an atomic learning unit, not a curriculum program. Repurposing it would require adding nullable fields to a model with 11 existing consumers. A clean Program hierarchy is the correct abstraction.

**Impact:** Migration required. Non-destructive additions only. No existing data affected.

---

## Decision 2: LearningPath Filtering at Unit Level

**Decision:** Add `LearningPath` enum (AFTER_SCHOOL, WEEKEND) and `Unit.includedInPaths: LearningPath[]`. An empty array means "included in all paths." Weekend-excluded units are tagged `[AFTER_SCHOOL]`. Courses remain neutral; filtering is unit-level.

**Rationale:** Tārīkh and Aqā'id are dropped entirely for weekend (all units excluded). Other subjects have partial topic reduction (some units excluded). Unit-level tagging handles both cases with a single mechanism. No content duplication.

**Impact:** One seed script per coursebook (`seed-weekend-tags-cb*.ts`). Query adds `WHERE includedInPaths = '{}' OR 'WEEKEND' = ANY(includedInPaths)` for weekend-path learners.

---

## Decision 3: Du'ā and 99 Names — Reuse FlashCard SRS, No New Models

**Decision:** Add `stageTag: String?` and `subjectTag: String?` to FlashCard. Tag existing maktab flashcards with `subjectTag = 'DUA'` or `subjectTag = '99NAMES'` and `stageTag = 'CB1'` etc. Build `/child/duas` and `/child/99-names` views that query FlashCard by subjectTag and aggregate FlashCardProgress (SRS status).

**Rationale:** The SM-2 SRS system is already implemented and working. Du'ā review naturally benefits from spaced repetition. No new model needed — two nullable fields on FlashCard unlock the entire progression view. Avoids a separate DuaProgress model with duplicate SRS logic.

---

## Decision 4: CB6 Gender Routing

**Decision:** Add `gender: Gender?` (MALE | FEMALE) to FamilyMember. At ProgramEnrollment Stage 6 advancement, the service checks `familyMember.gender` and auto-enrolls in `maktab-coursebook-6-boys` or `maktab-coursebook-6-girls`. If gender is null, the API returns a `GENDER_REQUIRED` response and the parent is prompted to set it before advancing.

**Rationale:** Both CB6 variants are already seeded. Gender routing is a one-time enrollment decision, not a content delivery concern. Storing gender on FamilyMember is minimal and enables the routing without additional session state.

---

## Open Items (hrasheed to confirm before Sprint 1)

1. **Foundation UI approach:** Full new child-first UI (higher quality, 3–4 weeks extra) vs. adapted existing UI (faster, lower quality for 4–5 year olds)?
2. **Longer surahs for CB5–8:** Block advancement until seeded, or note as a known gap in the dashboard?
3. **Du'ā audio:** TTS for MVP, or source human recitation audio? Significant timeline impact.
4. **Teacher/Facilitator role:** Confirmed Phase 2 and not in MVP scope?

---

## Sprint 1 Plan (2 weeks)

See spike document §7 for full backlog. Summary:
- Week 1: Khwarizmi — Schema migration + Program seed + API endpoints
- Week 2: Ibn Sina — Enrollment wizard UI + Grade dashboard + Parent Maktab widget
- Parallel: Weekend path CB1 pilot tags

# Resume Progress Source of Truth

- **Author:** Khaldun
- **Date:** 2026-07-04T00:23:33.053-04:00

## Decision
Course resume behavior must treat route state and in-memory enrollment snapshots as hints, not the source of truth. `CourseLearner` should always refresh the active learner's enrollment from the backend on load when a member context is available, then derive the resume target from ordered course units.

## Rationale
The bug was caused by stale enrollment snapshots being reused after progress changed inside a unit flow. That left `unitProgress` empty or outdated on the learn page, so "Continue where you left off" fell back to the first unit even though the backend already had the correct progress.

## Implementation Notes
- Refresh enrollments in `frontend/src/pages/courses/CourseLearner.tsx` using the active learner/member context.
- Match by `enrollmentId` when present; otherwise by `courseId`.
- Choose the resume unit by walking the ordered `units` list: first partially started unit, else first incomplete unit, else unit 1.
- No backend API change is required because `/courses/enrollments/member/:memberId` already returns `unitProgress`.

## Key Files
- `frontend/src/pages/courses/CourseLearner.tsx`
- `frontend/src/__tests__/pages/CourseLearner.test.tsx`
- `frontend/src/services/courseService.ts`
- `backend/src/services/course.service.ts`

# Decision: Dev Azure Environment + CI/CD Multi-Environment

**Agent:** Khwarizmi  
**Date:** 2026-06-22T12:40:20-05:00  
**Status:** Accepted

---

## Context

The project had a single Azure environment (`islamic-learning`) deployed from `main`. The team needed a separate dev environment wired to a `dev` branch for safe iteration before promoting to prod.

---

## Decision

### 1. GitHub Environments for secret scoping (not separate workflow files)

Use the GitHub [Environments](https://docs.github.com/actions/deployment/targeting-different-environments/using-environments-for-deployment) feature to scope secrets. A single workflow file (`ci-cd.yml`) handles both environments — jobs select the correct secret set by declaring `environment: dev` or `environment: prod`.

**Alternatives considered:**
- Separate workflow files (`ci-cd-dev.yml`, `ci-cd-prod.yml`) — rejected; duplicates workflow logic and creates drift risk
- Separate repos — rejected; overkill for two environments

### 2. Resource names moved to environment-scoped secrets

The three previously hardcoded resource names (`cr34odstpjgaabg`, `ca-api-islamic-learning`, `rg-islamic-learning-centralus`) are now `ACR_NAME`, `CONTAINER_APP_NAME`, and `RESOURCE_GROUP` secrets inside each GitHub environment. This means:
- The workflow YAML contains zero environment-specific strings
- Dev and prod deploy jobs are structurally identical (DRY)
- Adding a third environment (e.g., staging) requires no YAML changes

### 3. azd `environmentName` is the single source of truth for resource naming

The Bicep template uses `resourceToken = toLower(uniqueString(subscription().id, environmentName, location))` to generate stable but unique suffixes. Two environments with different `environmentName` values are guaranteed to produce non-colliding resource names within the same subscription.

### 4. Prod migration is non-breaking

Existing secret names (`AZURE_CREDENTIALS`, `SWA_DEPLOYMENT_TOKEN`) are preserved. The operator moves them from repo-level → `prod` environment. The YAML secret references are unchanged. CI passes as long as the `prod` environment exists with the correct secrets.

---

## Consequences

- CI/CD is now multi-environment by default; adding staging = create GitHub environment + run `azd provision`
- Prod deployments require the `prod` GitHub environment to be configured (one-time migration step)
- `az acr build` (remote build in ACR) is retained for both environments — no local Docker daemon required in CI
- `docs/dev-environment-setup.md` is the authoritative provisioning runbook

---

## Files Changed

- `.github/workflows/ci-cd.yml` — primary change
- `docs/dev-environment-setup.md` — new provisioning guide
- `azure.yaml` — no change needed

# Decision: Quran Memorization Seed — Design Choices

**Author:** Khwarizmi
**Date:** 2026-06-22
**File:** `backend/prisma/seed-quran-memorization.ts`

---

## What was built

A live-data seed script for a "Quran Memorization — Short Surahs (Juz Amma)" course targeting `EARLY_CHILD` and `CHILD` age levels under category `QURAN`.

The course covers 23 surahs (Al-Fatiha first, then An-Nas down to Ad-Duha), with each ayah as its own Unit — **171 units total**.

---

## Key Decisions

### 1. Live API fetch at seed time

Arabic text, transliteration (resource 57), and Saheeh International translation (resource 20) are fetched from `api.quran.com` during seeding rather than being hardcoded. This ensures accuracy and keeps the file a manageable size.

**Trade-off:** Seed requires internet access. Mitigated by explicit HTTP error handling that throws with clear messages so failures are obvious.

### 2. Three parallel fetches per surah, one surah at a time

Each surah fires all three API calls concurrently (`Promise.all`), then the loop proceeds to the next surah with a 300ms `sleep()` between surahs. This is polite to quran.com while still being reasonably fast (~7 seconds for 23 surahs).

### 3. One Unit per ayah — not one Unit per surah

The brief specified ayah-level granularity so children can memorize one short verse at a time, track progress per ayah, and revisit individual verses. Grouping by surah would lose that granularity.

### 4. AudioResource + ArabicTerm per unit

Each unit gets:
- An `AudioResource` pointing to the everyayah.com Khalefa Al-Tunaiji recording — consumed by the audio player UI
- An `ArabicTerm` with arabicText, transliteration, translation, and audioUrl — consumed by the TTS normalization service and games engine

This follows the data contract established in `seed-habits-course.ts` and the broader seed pattern.

### 5. HTML template uses `.quran-verse` and `.arabic-large` CSS classes

These classes are expected by the frontend renderer. Using `dir="rtl" lang="ar"` on the `<p>` tag ensures correct RTL layout even if the parent container is LTR.

### 6. Translation HTML stripping

Saheeh International (resource 20) returns text with `<sup>` footnote markers and occasional inline tags. A simple regex `/<[^>]+>/g` strips all tags cleanly. Footnote content is lost but the translation text remains accurate.

### 7. Course title used as delete key (not slug)

Follows the `seed-habits-course.ts` find-first-delete pattern rather than the newer upsert pattern. Rationale: this is a brand-new course with no student data to preserve yet. If the course is promoted to production and gets enrollments, it should be converted to the upsert pattern at that time (see maktab upsert migration, 2026-06-20).

---

## Surah coverage

Al-Fatiha (1), then surahs 114 → 93 in reverse:
An-Nas, Al-Falaq, Al-Ikhlas, Al-Masad, An-Nasr, Al-Kafirun, Al-Kawthar, Al-Ma'un, Quraysh, Al-Fil, Al-Humazah, Al-Asr, At-Takathur, Al-Qari'ah, Al-Adiyat, Az-Zalzalah, Al-Bayyinah, Al-Qadr, Al-Alaq, At-Tin, Ash-Sharh, Ad-Duha.

Total: **23 surahs, 171 units**.

# Decision: Reading Completion Gate for Quiz Submission

**Date:** 2026-06-20T17:31:22-05:00  
**Author:** Khwarizmi (Backend Dev)  
**Status:** Implemented

---

## Decision

Enrolled students are blocked from submitting a quiz attempt until they have marked the lesson reading as complete (`UnitProgress.readingCompleted = true`). Unenrolled users browsing freely are not blocked.

## Rationale

Students were bypassing lesson content by navigating directly to quiz URLs. The gate enforces pedagogical sequencing: read → quiz.

## Implementation

**Gate location:** `submitQuiz()` in `backend/src/services/assessment.service.ts`, immediately after member-family verification and **before** the cooldown check.

**Error response:** HTTP 400 `BadRequestError` — "You must complete the lesson reading before taking the quiz."

**Edge cases:**
- No enrollment → gate skipped (free exploration allowed)
- Enrollment + no `UnitProgress` row → blocked (no row = not read)
- `readingCompleted: false` → blocked
- `readingCompleted: true` → allowed

## Frontend Contract (for Ibn Sina)

**Mark reading complete:**
```
POST /api/v1/courses/progress
Authorization: Bearer <token>
Body: { "unitId": "<uuid>", "readingCompleted": true }
```

Call this before or when the student finishes reading (e.g., on scroll-to-bottom or explicit "Mark as Read" button). The quiz submit button / navigation should only activate after this call succeeds.

**Quiz blocked response (400):**
```json
{ "error": "You must complete the lesson reading before taking the quiz." }
```

Ibn Sina should display this message and surface the "Mark as Read" CTA if the student hits it.

# Decision: Resume target must be latest active progress

**Date:** 2026-07-04T00:23:33.053-04:00  
**Author:** Khwarizmi (Backend Dev)  
**Status:** Implemented

## Context
Learners returning to a course kept landing on Unit 1 because resume logic effectively favored the first in-order incomplete unit. When older units remain partially complete, this masks the most recent work.

## Decision
Backend enrollment payloads now return `unitProgress` ordered by latest activity (`updatedAt`, then `createdAt`) and include lightweight unit metadata (`orderIndex`). Frontend resume selection must prioritize the most recently active incomplete unit from that ordered progress list, then fall back to first incomplete by course order.

## Impact
- “Continue where you left off” now reflects recent learner activity.
- Resume behavior is deterministic across API consumers.
- Contract expectation is now test-covered in backend service tests.

# Decision: Quran Memorization Surah Review Units

**Author:** Khwarizmi
**Date:** 2026-06-23T09:49:39-05:00
**File:** `backend/prisma/seed-quran-memorization.ts`

---

## Decision

After the last ayah unit of each surah in the Quran memorization seed, create one additional review unit titled `{SurahName} - Full Surah Review`.

## Why

The ayah-by-ayah flow is good for memorization, but learners also need a final per-surah checkpoint that presents the complete text and recitation sequence in one place before they mark the surah complete.

## Implementation notes

- Keep `buildUnitContent()` for single-ayah units and add a separate `buildSurahReviewContent()` helper for aggregate surah HTML.
- Insert the review unit immediately after the surah's last ayah and increment `globalOrderIndex` so unit ordering remains stable across the whole course.
- Reuse the existing everyayah Khalefa Al-Tunaiji URL pattern for each ayah audio clip in the review unit rather than introducing a new audio source format.
- Seed `AudioResource` and `ArabicTerm` rows for the review unit as well, one per ayah, so backend consumers still have structured access to the same verse-level data.
