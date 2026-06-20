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

### 2026-06-06T17:05:11-05:00: Enrollment QA template coverage
**By:** Biruni
**What:** New course deployment QA should include a route-level enrollment template that mounts `course.routes.ts` with real validation middleware, mocked auth, and mocked course services.
**Why:** This catches UUID validation regressions like slug-based course IDs returning 422, while also verifying 200/201/404/409 behavior for course lookup, units, enrollment, and duplicate handling without touching production data.


### 2026-06-06T17:05:11-05:00: User directive
**By:** Hamza Rasheed (via Copilot)
**What:** New courses must include enrollment tests as part of the QA process before going live.
**Why:** User request — captured for team memory


### 2026-06-20T12:10:14-05:00: User directive
**By:** hrasheed (via Copilot)
**What:** Hide audio buttons across all courses until we figure out how to get faithful pronunciation of Arabic words.
**Why:** User request — pronunciation quality not yet acceptable for production use.


### 2026-06-06T17:09:20-05:00: Unit lesson CTA gating
**By:** Ibn Sina
**What:** The unit detail page should keep rendering backend-authored lesson HTML links as-is, but also surface a dedicated `Open Full Interactive Lesson` CTA above the content only when `unit.content.text` already includes the `/lessons/masaar-irab-sarf/week-N.html` pattern. The CTA URL is derived from `orderIndex + 1` using the canonical `/lessons/masaar-irab-sarf/week-{N}.html` route and opens in a new tab.
**Why:** This preserves backend control over which units expose standalone HTML lessons while giving learners a highly visible, consistent launch affordance on al-Masār unit pages.


# Decision: Quiz Answer Flow — Submit-Response-Driven Grading

**Date:** 2026-06-20T14:01:24-05:00  
**Author:** Ibn Sina (Frontend Dev)  
**Status:** Implemented

## Context

Khwarizmi's security fix removed `correctAnswer` and `explanation` from the backend
`getQuestions()` endpoint. These fields are now withheld until after submission to
prevent answer leakage to the client before the quiz is completed.

## Decision

**All grading logic in `QuizPage.tsx` must be driven exclusively by the `submitQuiz()` response.**

Specifically:
1. The local `Question` interface and the shared `QuizQuestion` type no longer carry
   `correctAnswer` or `explanation`.
2. Score calculation (`calculateScore`) reads from `submitResult.score`,
   `submitResult.correctCount`, and `submitResult.totalQuestions`.
3. The "Review Your Answers" panel reads `correctAnswer` and `explanation` from
   `submitResult.answers[]` (the `GradedAnswer` array).
4. `passed` is read from `submitResult.passed`, not recomputed on the client.
5. If `submitQuiz()` throws, the results screen still renders (graceful degradation)
   but shows zero score and a "Results unavailable" message — **no correctAnswers
   are ever inferred client-side**.

## Type Changes

- `QuizQuestion`: removed `correctAnswer?` and `explanation?` fields entirely.
- `QuizResult` interface: **removed** (was wrong shape; replaced by `GradedAnswer`).
- `GradedAnswer` interface: **added** — `{questionId, answer, isCorrect, correctAnswer?, explanation?}`.
- `QuizSubmissionResponse`: corrected to `{id, score, passed, correctCount, totalQuestions, pointsEarned, answers: GradedAnswer[]}`.

## Rationale

Keeping `correctAnswer` in the GET type or computing `isCorrect` client-side would
re-introduce the vulnerability that Khwarizmi's fix closed. The source of truth for
all graded data is the server.

## Key Files

- `frontend/src/pages/courses/QuizPage.tsx`
- `frontend/src/types/assessment.ts`
- `backend/src/services/assessment.service.ts` (read-only reference)


# Course Improvements Architecture

**Prepared by:** Khaldun (Lead Architect)  
**Date:** 2026-06-20  
**Status:** PROPOSAL — Pending hrasheed approval  
**Covers:** Question difficulty, anti-rush mechanisms, course versioning

---

## Concern 1: Harder Maktab Course Questions

### Current State

Analyzed CB1, CB2, CB3 (as representative sample) across all maktab seed files.

**Difficulty distribution in CB3 (typical across all books):**
- ~85% of questions: `difficulty: 'EASY'`
- ~12% of questions: `difficulty: 'MEDIUM'`
- ~3% of questions: `difficulty: 'HARD'` (barely any)

**Root problems identified:**

1. **Direct recall dominates.** Almost every question tests whether a student can retrieve a fact that appears verbatim in the lesson. Example: *"How long did the boycott of Banū Hāshim last?"* — the answer "Three years" is literally in the preceding paragraph. A student who speed-reads the last sentence before quizzing can answer correctly.

2. **True/False questions are 50/50 by design.** They're trivial to guess. There are too many of them relative to the question pool.

3. **Multiple-choice distractors are weak.** Options like `['Farmer', 'Idol-maker', 'Merchant', 'Blacksmith']` for *"What was the occupation of Āzar?"* require no reasoning — the correct answer is the only one that sounds like it fits the story. A child who only read the title "Ibrahim and the idols" can eliminate three distractors without reading the unit.

4. **No application-layer questions.** No questions that ask a student to *apply* a ruling to a scenario, *compare* two concepts, *explain why* something is the case, or *sequence* events from memory (without the text in front of them).

5. **No Arabic/transliteration recall.** Questions about Arabic terminology never ask students to recall the Arabic word from its meaning, only to match an already-presented English label to a definition.

---

### Proposed Solution

**Strategy: Tiered question pools with mandatory hard-tier exposure**

Each unit should hold questions across three tiers:

| Tier | Difficulty | % of Pool | Question Style |
|------|-----------|-----------|----------------|
| Tier 1 | EASY | 40% | Direct recall from text; true/false for basic facts |
| Tier 2 | MEDIUM | 40% | Inference, comparison, sequencing, "which of these is NOT" |
| Tier 3 | HARD | 20% | Scenario application, Arabic recall, multi-step reasoning |

**For each existing EASY question, add at least one harder companion.** Examples:

*Existing (EASY):* "How many farā'iḍ are there in ghusl?" → Answer: "Three"  
*New companion (MEDIUM):* "If a person washes their entire body and rinses their nose but forgets to gargle their mouth, is their ghusl valid?" → Answer: "No — gargling the mouth is a farḍ of ghusl"

*Existing (EASY):* "What is Najāsah Ghalīẓah?" → Recognition from a list  
*New (HARD):* "A child's trousers have a stain of ḥalāl animal urine covering one-quarter of the garment. Can they pray in these trousers according to the Ḥanafī ruling?" → Applies Najāsah Khafīfah + quarter rule

*Existing (EASY):* "How many prophets are mentioned in the Qur'ān?" → "25"  
*New (HARD):* "Name four prophets sent before Ibrāhīm عليه السلام in chronological order." → Tests recall without a hint list

**New question types to introduce:**

1. **SEQUENCE / ORDERING** — "Place these events of al-Isrā' wal-Mi'rāj in order: Sidrah al-Muntahā, Masjid al-Aqṣā, meeting Ādam عليه السلام, meeting Ibrāhīm عليه السلام." (Frontend: drag-and-drop)

2. **ARABIC RECALL** — "What is the Arabic term for an action that Allāh has absolutely forbidden?" (Answer: حَرَام / Ḥarām). This forces engagement with the Arabic terminology sections.

3. **SCENARIO-BASED** — "Zayd is praying and realises he forgot to face the Qiblah. He has already completed two rak'āt. What should he do?" (Tests applied fiqh understanding)

4. **NEGATIVE-FORM** — "Which of the following is NOT a minor sign of the Day of Judgement?" — adds thinking load vs. simple recognition

**Minimum targets per unit (replacing the current all-EASY model):**
- Minimum 8 questions per unit (currently ~5–7)
- At least 2 HARD questions
- At least 3 MEDIUM questions
- True/False capped at 20% of questions per unit
- At least 1 FILL_BLANK per unit

---

### Trade-offs & Complexity

| Factor | Assessment |
|--------|-----------|
| Content quality | High cost — each harder question needs careful Islamic content review |
| Implementation complexity | LOW for schema (difficulty already exists), MEDIUM for new question types (SEQUENCE requires frontend work) |
| Risk of frustration | Medium — must tune carefully for age range; CB1 (age 6-7) should stay mostly EASY |
| Time estimate | 3–4 days per book for question expansion |

**Age-gated difficulty targets:**
- CB1–2 (ages 6–9): pool can stay EASY-dominant; add 1–2 MEDIUM per unit
- CB3–5 (ages 8–12): introduce MEDIUM and begin HARD
- CB6–8 (ages 12+): full three-tier with scenario questions

---

### Implementation Order

1. Khaldun defines question templates for each new type (this doc)
2. Khwarizmi adds SEQUENCE question type handling to the schema and assessment service
3. Ibn Sina builds SEQUENCE/ordering UI in QuizPage
4. Content expansion of CB3 first (pilot, then replicate to all books)

**Owner:** Khwarizmi (schema + service changes), Ibn Sina (QuizPage ordering UI), content author (question writing — hrasheed or designated reviewer)

---

## Concern 2: Anti-Rush Mechanism

### Current State — Critical Issues Found

After analyzing `assessment.service.ts`, `assessment.controller.ts`, and `QuizPage.tsx`:

**Issue 1 — CRITICAL: Correct answers are sent to the client.**
`AssessmentService.getQuestions()` includes `correctAnswer` in the select clause and sends it in the API response. Any child can open DevTools → Network tab → see all correct answers before answering a single question. This is a fundamental security gap.

**Issue 2: Same question set every attempt.**
No randomization. Questions are returned in database insertion order (`findMany` with no `orderBy` shuffle). A child who fails, sees the answers on the results screen, and immediately retries will see questions in the exact same order — making memorization trivial after 2 attempts.

**Issue 3: Results screen exposes all correct answers immediately after failure.**
`QuizPage.tsx` renders a full "Review Your Answers" panel with `correctAnswer` and `explanation` for every question — right after the failed attempt. The "Try Again" button sits next to this panel. The pathway is: fail → read answers → click Try Again → pass.

**Issue 4: No attempt cooldown.**
`QuizPage.tsx` lines 301–313: the "Try Again" button resets all state and immediately allows another attempt. There is no server-side or client-side delay.

**Issue 5: No minimum time-on-lesson enforcement.**
`UnitProgress.readingCompleted` exists on the schema but the quiz submit endpoint (`POST /assessment/submit`) does NOT verify that the student has marked reading as complete before accepting a quiz submission. A student can navigate directly to `/courses/:id/units/:id/quiz` without ever opening the lesson.

**Issue 6: No attempt count limit.**
There is no rate limiting on `POST /assessment/submit` beyond the global rate limiter. A student can submit unlimited quiz attempts in rapid succession.

---

### Proposed Solution

These are ordered from highest to lowest impact-to-effort ratio:

#### Fix 1 — Strip `correctAnswer` from `getQuestions` response (Priority: CRITICAL, 30 min)

`AssessmentService.getQuestions()` must remove `correctAnswer` and `explanation` from the select. These fields are only needed server-side during grading. The frontend does not need them until after submission.

```typescript
// BEFORE (exposes answers to client)
select: {
  id, type, questionText, options, difficulty,
  correctAnswer,  // ← DELETE THIS
  explanation,    // ← DELETE THIS
}

// AFTER
select: {
  id, type, questionText, options, difficulty
  // correctAnswer and explanation served only in QuizResult.answers
}
```

The results panel in `QuizPage.tsx` should draw correct answers from the `QuizResult.answers` array returned by the submit endpoint — which already includes `correctAnswer` and `explanation` per graded answer. The frontend already receives this from `assessmentService.submitQuiz()`.

#### Fix 2 — Question randomization + pool sampling (Priority: HIGH, 1–2 days)

**Backend:** `getQuestions()` should shuffle and optionally sample:
```typescript
// Shuffle all questions for this unit
const shuffled = questions.sort(() => Math.random() - 0.5);
// If pool > quiz size, sample (e.g. pick 8 from 12)
const sampled = shuffled.slice(0, quizSize);
return sampled;
```

**Longer term:** With the expanded question pool (Concern 1), implement stratified sampling — always pick N_easy + N_medium + N_hard — so each attempt has a different but difficulty-balanced set.

**Schema change needed:** Add `quizPoolSize: Int? @default(null)` to `Unit` model — lets admin configure how many questions to draw per attempt. If null, all questions used.

#### Fix 3 — Attempt cooldown (Priority: HIGH, 1 day)

**Schema change:** Add a `cooldownMinutes` field to `Unit` OR implement it as application logic using `QuizResult.createdAt`.

**Service logic:** In `AssessmentService.submitQuiz()`, before grading, check if the member has a recent failed attempt on this unit:

```typescript
const lastAttempt = await prisma.quizResult.findFirst({
  where: { memberId, unitId },
  orderBy: { createdAt: 'desc' },
});

const COOLDOWN_MINUTES = 30; // configurable
if (lastAttempt && !lastAttempt.passed) {
  const minutesSince = (Date.now() - lastAttempt.createdAt.getTime()) / 60000;
  if (minutesSince < COOLDOWN_MINUTES) {
    throw new TooManyRequestsError(
      `You must wait ${Math.ceil(COOLDOWN_MINUTES - minutesSince)} minutes before retrying.`
    );
  }
}
```

**Frontend:** The "Try Again" button should check the last attempt's `createdAt` and show a countdown timer instead of being immediately available.

**Suggested cooldowns by age:**
- EARLY_CHILD / CHILD: 15 minutes
- PRE_TEEN: 30 minutes
- TEEN / ADULT: 60 minutes

Since `FamilyMember.ageCategory` is known at submit time, the service can use it to set the right cooldown.

#### Fix 4 — Reading completion gate (Priority: MEDIUM, 1 day)

`submitQuiz()` should verify `readingCompleted` before accepting a submission:

```typescript
if (enrollment) {
  const unitProg = await prisma.unitProgress.findUnique({
    where: { enrollmentId_unitId: { enrollmentId: enrollment.id, unitId } },
  });
  if (!unitProg?.readingCompleted) {
    throw new BadRequestError('You must complete the lesson reading before taking the quiz.');
  }
}
```

**What this requires upstream:** The course unit page must actually set `readingCompleted = true` when the student scrolls to the bottom or explicitly marks it done. Check whether this is currently implemented in the frontend lesson page — if not, Ibn Sina needs to add a "Mark as Read" / scroll-to-bottom trigger that hits `PATCH /courses/:id/progress`.

**Edge case:** First-time visitors who have never had a UnitProgress row. The gate should only apply when an enrollment exists (existing students) to avoid blocking new learners on their first pass.

#### Fix 5 — Delayed answer reveal (Priority: MEDIUM, half day)

On the results screen, don't show the full "Review Your Answers" panel with correct answers until:
- The student has passed, OR
- After the cooldown period has elapsed

When the student fails, show only their score and "Wait X minutes, then review your answers." This removes the memorization exploit without removing educational value — students can still review after the cooldown expires.

This is a frontend-only change in `QuizPage.tsx`.

#### Fix 6 — Attempt counter & max attempts per day (Priority: LOW, 1 day)

For parents who want stronger controls, add a `maxDailyAttempts: Int @default(3)` to the `Unit` model or use `GameParentalSettings` as a pattern for a `QuizParentalSettings` model. Count today's attempts from `QuizResult` filtered by `createdAt >= today`.

---

### Trade-offs

| Fix | Impact | Complexity | Risk |
|-----|--------|-----------|------|
| Strip `correctAnswer` from GET | Critical security fix | 30 min | Frontend must source from submit response |
| Randomization | High anti-rush | 1–2 days | Requires pool expansion to be meaningful |
| Cooldown | High anti-rush | 1 day | Age-category detection adds coupling |
| Reading gate | High anti-rush | 1 day | Requires `readingCompleted` to be reliably set |
| Delayed answer reveal | Medium anti-rush | 0.5 day | Pure frontend |
| Max daily attempts | Low, parental control | 1 day | Schema migration needed |

**Recommended minimum viable anti-rush set:** Fix 1 + Fix 2 (partial randomization) + Fix 3 (cooldown) + Fix 5 (delayed reveal). This covers the core exploit without requiring reading-gate plumbing.

---

### Implementation Owner

- Khwarizmi: Fixes 1, 3, 4, 6 (all backend)
- Ibn Sina: Fixes 2 (shuffle in getQuestions call), 3 (cooldown countdown UI), 5 (delayed answer reveal)
- Review gate: Biruni reviews assessment.service.ts changes before merge (Fix 1 is a security change)

---

## Concern 3: Course Versioning & Data Preservation

### Current State — Severe Problems Found

**Problem 1: seed.ts nukes all student data.**

`seed.ts` lines 40–58 execute `deleteMany()` in this order:
```
notifications → activityEvents → reviewLogs → memorizationItems →
achievements → quizResults → flashCardProgress → unitProgress →
courseEnrollments → questions → arabicTerms → audioResources →
videoResources → units → courses → familyMembers → users → families
```

This is total destruction of all student progress, enrollments, quiz history, and family accounts. Running `npx prisma db seed` on a live database would wipe every family currently using the platform. The intent is "dev reset," but there is no guard preventing it from running in production.

**Problem 2: Individual seed files use find-first-skip, not upsert.**

Every maktab seed file follows this pattern:
```typescript
const existing = await prisma.course.findFirst({
  where: { title: 'Maktab Coursebook 3' },
});
if (existing) {
  console.log('⏭️  Already exists — skipping.');
  return;
}
```

This means once a course is seeded, it can **never be updated** via the seed system. Improved question content, corrected errors, new questions — none of these can be pushed to existing installations without manual database surgery.

**Problem 3: No version tracking.**

The `Course`, `Unit`, and `Question` models have no `version`, `contentHash`, or `updatedAt` fields that would allow a seed to detect "this question has changed since it was last seeded."

**Problem 4: No stable IDs for content.**

Questions and units are created with auto-generated UUIDs (`@id @default(uuid())`). If a unit is deleted and recreated, all `UnitProgress` records referencing the old UUID become orphans. There is no concept of a "canonical course slug" that survives re-seeding.

---

### Proposed Solution

Three layers of protection needed: **safe seed architecture**, **upsert-based content updates**, and **schema versioning**.

#### Layer 1 — Separate dev-reset from content seeding

Split seed.ts into two distinct scripts:

**`seed-dev-reset.ts`** — Wipes everything, creates demo data. Only runs in `NODE_ENV=development`. Guards:
```typescript
if (process.env.NODE_ENV !== 'development') {
  throw new Error('seed-dev-reset.ts must not run in production. Use seed-content.ts instead.');
}
```

**`seed-content.ts`** — Runs all course seeds using upsert logic. Safe for production. No `deleteMany()` at the top.

Wire the Prisma `seed` command to `seed-content.ts` so a production `prisma db seed` is always safe.

#### Layer 2 — Stable slug IDs + upsert content

**Schema change:** Add a `slug` field to `Course` and `Unit`:
```prisma
model Course {
  slug  String  @unique  // e.g. "maktab-coursebook-3"
  ...
}

model Unit {
  slug  String  // e.g. "maktab-3-fiqh"
  // @@unique([courseId, slug])
  ...
}
```

Slugs are static, assigned by the seed author, and survive re-seeding. UUIDs remain the runtime primary key, but slugs are the seed's stable reference.

**Seed upsert pattern for courses:**
```typescript
const course = await prisma.course.upsert({
  where: { slug: 'maktab-coursebook-3' },
  create: { slug: 'maktab-coursebook-3', title: 'Maktab Coursebook 3', ... },
  update: { title: 'Maktab Coursebook 3', description: '...', isPublished: true },
  // Never touch enrollments, progress, or quiz results
});
```

**For Units** — upsert by `[courseId, slug]` (add composite unique):
```typescript
const unit = await prisma.unit.upsert({
  where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-fiqh' } },
  create: { ..., slug: 'maktab-3-fiqh', courseId: course.id },
  update: { title: '...', content: '...', description: '...' },
  // orderIndex update is safe; never touches UnitProgress
});
```

**For Questions** — upsert by stable external key. Add a `externalId` field:
```prisma
model Question {
  externalId  String?  @unique  // e.g. "maktab-3-fiqh-q1"
  ...
}
```

Seed upsert:
```typescript
await prisma.question.upsert({
  where: { externalId: 'maktab-3-fiqh-q1' },
  create: { externalId: 'maktab-3-fiqh-q1', unitId: unit.id, ... },
  update: { questionText: '...', options: ..., correctAnswer: '...', difficulty: 'HARD' },
  // Updating a question does NOT affect QuizResult.answers (those are snapshots)
});
```

**Why `QuizResult.answers` is safe to ignore during updates:** The `answers` JSON already stores `{ questionId, answer, isCorrect, correctAnswer, explanation }` as a snapshot. A question update doesn't retroactively change a student's historical result. Only future attempts use the new question text. This is correct behavior — a student's past score remains valid.

#### Layer 3 — Course version field for compatibility signaling

Add a `contentVersion: Int @default(1)` to `Course`. The seed increments this when a breaking change is made (e.g., a unit is removed or its orderIndex fundamentally changes). Application code can check: "Student's enrollment progress was last computed against version N. Course is now version M. Show a 'course has been updated' notice." This is a soft notification, not destructive.

```prisma
model Course {
  contentVersion  Int  @default(1)
  ...
}
```

No action required on `CourseEnrollment` — the existing `progress` percentage remains valid. Only surfaced as a UI notice.

#### Layer 4 — Enrollment & progress preservation guarantee

The upsert pattern at Layer 2 naturally preserves:
- `CourseEnrollment` — not touched by seed (references courseId, not slug)
- `UnitProgress` — not touched by seed (references unitId UUID, which persists via upsert)
- `QuizResult` — not touched by seed (references unitId UUID)
- `FlashCardProgress` — not touched by seed (references flashCardId UUID)

The only risk is if a unit is **deleted** from the course. In that case, its UUID is gone and progress is orphaned. Mitigation: never delete units via seed — instead set a `isPublished: Boolean @default(true)` on `Unit` and use `update: { isPublished: false }` to hide deprecated content. The orphan progress stays valid and the student retains their completion.

---

### Migration Plan

**Step 1 — Schema migration (Khwarizmi, ~2 hrs):**
- Add `Course.slug String @unique`
- Add `Unit.slug String` + `@@unique([courseId, slug])`
- Add `Question.externalId String? @unique`
- Add `Course.contentVersion Int @default(1)`
- Write Prisma migration file

**Step 2 — Backfill slugs (Khwarizmi, ~1 hr):**
Write a one-time migration script that generates slugs for all existing `Course` and `Unit` rows from their titles (kebab-case conversion). Assign `externalId` to existing `Question` rows using `unitId + orderIndex` as a deterministic basis.

**Step 3 — Refactor seed files (Khwarizmi, ~1 day):**
Convert each maktab seed file from `find-first-skip` + `create` to `upsert` with slugs. Add the dev-reset guard to `seed.ts`.

**Step 4 — Validate (Biruni, ~half day):**
Test that running the refactored seeds twice produces no duplicate rows, that existing `UnitProgress` records survive a re-seed, and that updated question text appears in a new quiz attempt.

---

### Trade-offs

| Approach | Pro | Con |
|----------|-----|-----|
| Slug + upsert | Simple, safe, preserves data | One-time backfill migration needed |
| contentVersion | Lightweight versioning signal | Doesn't auto-migrate student progress |
| `externalId` on Question | Enables question-level updates | Manual burden on seed authors to assign stable IDs |
| Hard delete of units | Simplest content removal | Orphans UnitProgress; prefer isPublished=false |

---

## Recommended Implementation Order

Priority order accounts for urgency, dependencies, and safety.

| Priority | Item | Why | Owner | Est |
|----------|------|-----|-------|-----|
| 1 | Strip `correctAnswer` from GET questions | Security — live exploit right now | Khwarizmi | 30 min |
| 2 | Dev-reset guard on seed.ts | Safety — prevent accidental prod data loss | Khwarizmi | 30 min |
| 3 | Schema: slug + externalId + contentVersion | Enables everything else in Concern 3 | Khwarizmi | 2 hrs |
| 4 | Refactor all maktab seeds to upsert | Preserves student data going forward | Khwarizmi | 1 day |
| 5 | Question randomization in getQuestions | Anti-rush; requires pool to be worth randomizing | Khwarizmi | 1 hr |
| 6 | Attempt cooldown (service + UI) | Core anti-rush mechanism | Khwarizmi + Ibn Sina | 1.5 days |
| 7 | Delayed answer reveal | Removes memorization exploit | Ibn Sina | 0.5 day |
| 8 | Question difficulty expansion — CB3 pilot | Content work, not code | Content author | 2–3 days |
| 9 | Reading completion gate | Requires readingCompleted to be reliably set | Khwarizmi + Ibn Sina | 1 day |
| 10 | Expand hard questions to all maktab books | Content work at scale | Content author | 2–3 days/book |
| 11 | SEQUENCE question type (UI + service) | New question type for ordering | Khwarizmi + Ibn Sina | 2 days |

**Total engineering estimate:** ~10 days (items 1–9, excluding content authoring)

---

## Summary

| Concern | Core Fix | Risk Level |
|---------|----------|-----------|
| Harder questions | Tiered pool with mandatory MEDIUM/HARD, new question types | Low code, high content effort |
| Anti-rush | Fix GET response (critical), randomize, cooldown, delayed reveal | Items 1+2 are trivial; full solution is 3–4 days |
| Versioning | Slug+upsert pattern, separate dev-reset script, contentVersion signal | Schema migration required; backfill needed once |

The anti-rush item 1 (stripping correctAnswer from the GET endpoint) should be treated as an emergency fix — it is live right now.


### 2026-06-06T17:09:20-05:00: Canonical al-Masār lesson asset routing
**By:** Khwarizmi
**What:** al-Masār standalone HTML workbooks should be published as static frontend assets under `frontend/public/lessons/masaar-irab-sarf/week-{N}.html`, and backend unit `content` should store only concise summary HTML plus links to that canonical route instead of embedding the full lesson payload.
**Why:** This keeps database lesson bodies lightweight, preserves rich interactive HTML as deployable static artifacts, and gives both backend and frontend one stable URL convention for launching the full lesson experience.


# Decision: Strip correctAnswer from GET /questions + seed.ts Production Guard

**Date:** 2026-06-20T14:01:24-05:00
**Author:** Khwarizmi
**Status:** Implemented

---

## Decision 1 — Never expose correctAnswer/explanation in GET questions response

**Context:**
`AssessmentService.getQuestions()` was including `correctAnswer` and `explanation` in the Prisma select, returning them to the client on the initial question fetch. Students could read all answers in browser DevTools before submitting.

**Decision:**
Remove `correctAnswer` and `explanation` from the `getQuestions()` select clause. These fields must only travel over the wire as part of the graded `submitQuiz()` response, which already includes `correctAnswer` and `explanation` per answer in the `gradedAnswers` array.

**Frontend impact (action required by Ibn Sina):**
`QuizPage.tsx` currently:
1. Reads `q.correctAnswer` from the GET response for the `calculateScore()` function (local client-side grading).
2. Shows `q.correctAnswer` and `q.explanation` in the post-quiz review panel.
3. Calls `await assessmentService.submitQuiz(...)` but **discards the return value**.

Ibn Sina must update `QuizPage.tsx` to:
- Capture the `submitQuiz()` response: `const result = await assessmentService.submitQuiz(...)`
- Map `result.answers` (array of `{ questionId, correctAnswer, explanation, isCorrect }`) back to the local `questions` array for the review panel.
- Derive `calculateScore()` from `result.answers` or `result.score` instead of `q.correctAnswer`.

**Files changed:** `backend/src/services/assessment.service.ts`

---

## Decision 2 — Seed.ts must never run in production (NODE_ENV guard)

**Context:**
`seed.ts` opens with a cascade of `deleteMany()` calls that wipe all user data, enrollments, and progress. There was no guard preventing it from running against a production database.

**Decision:**
Add a hard abort at the top of `main()`:
- `NODE_ENV === 'production'` → throw an error immediately, no destructive work done.
- Any other `NODE_ENV` (including unset) → print a loud ⚠️ warning banner and proceed.

This is a minimal, surgical guard — not a refactor of the seed system. A full content-only seed system is a separate future task.

**Files changed:** `backend/prisma/seed.ts`

---

# Decision: Anti-Rush Backend — Question Randomization & Retry Cooldown

**Date:** 2026-06-20T17:20:27-05:00  
**Author:** Khwarizmi (Backend Dev)  
**Status:** Implemented

---

## Context

Students were able to memorize answer positions across quiz retries (questions returned in insertion order, options always in the same sequence) and could retry failed quizzes immediately with no delay.

---

## Decisions Made

### 1. Fisher-Yates shuffle for questions and options

- Questions are shuffled after DB fetch using an unbiased Fisher-Yates algorithm (not `sort(() => Math.random() - 0.5)`).
- The `options` array within each question is also shuffled independently.
- Only applied to `getQuestions()` (the GET endpoint) — grading in `submitQuiz()` still looks up by `questionId`, so shuffled order has no effect on correctness.

### 2. 15-minute cooldown after failed attempts

- `COOLDOWN_MINUTES = 15` — flat rate for all quizzes, no per-unit configuration yet.
- Cooldown only applies after a **failed** attempt. Passed quizzes have no cooldown (retaking a passed quiz is review, not gaming).
- First attempt has no cooldown.
- Cooldown is enforced in `submitQuiz()` before grading (not just on the GET questions endpoint, which would be easy to bypass).

### 3. CooldownError — custom error class with flat response shape

- New `CooldownError extends AppError` (429) added to `error.middleware.ts`.
- Carries `retryAfterMinutes` and `retryAt` (ISO string) as first-class fields.
- The `errorHandler` detects `CooldownError` and emits a flat shape: `{ error, retryAfterMinutes, retryAt }` instead of the usual `{ success: false, error: { message } }`.
- Rationale: the flat shape is intentional — the frontend needs to destructure these fields directly to drive a countdown timer, not dig into a nested `error` object.

### 4. Cooldown status endpoint

- `GET /api/assessment/units/:unitId/cooldown-status` returns `{ onCooldown, retryAfterMinutes, retryAt }`.
- Frontend can poll this before rendering the quiz start button to show a live countdown without needing to attempt a submission.
- Requires auth + active member (same middleware chain as all other assessment routes).

---

## Impact on Other Agents

- **Ibn Sina (Frontend):** The quiz retry flow must now handle HTTP 429 from `POST /submit` with the flat `{ error, retryAfterMinutes, retryAt }` shape. The `GET /units/:unitId/cooldown-status` endpoint is available for proactive UI (disable "Retry" button + show countdown before the student clicks submit).

---

## Files Changed

- `backend/src/services/assessment.service.ts`
- `backend/src/controllers/assessment.controller.ts`
- `backend/src/routes/assessment.routes.ts`
- `backend/src/middleware/error.middleware.ts`

---

# Decision: Anti-Rush Frontend — Cooldown Countdown + Delayed Answer Reveal

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-06-20T17:18:56-05:00  
**Status:** Implemented

---

## Context

After a failed quiz attempt students could immediately retry, and the review panel exposed all correct answers — making it trivial to memorize and re-submit. Khwarizmi is adding a 15-minute backend cooldown (429 on retry during window). This decision captures the matching frontend treatment.

---

## Decisions

### 1. Cooldown state modeled as `cooldownEndsAt: Date | null`
- Single authoritative timestamp. `cooldownSecondsLeft` is derived via a dedicated `setInterval` useEffect — no drift, no duplicate logic.

### 2. Cooldown checked concurrently with questions on page load
- `Promise.all([getQuizQuestions(), getCooldownStatus()])` — zero added latency. If the cooldown endpoint fails, it is silently swallowed (non-blocking). Quiz continues normally.

### 3. After failed submit: backend is the source of truth for `retryAt`
- After `submitQuiz()` returns `passed: false`, immediately call `getCooldownStatus()` to get the server's authoritative `retryAt` ISO timestamp. Fall back to `now + 15 minutes` only if that call throws.

### 4. 429 from submit sets cooldown from error body
- If a student somehow bypasses the frontend guard, the 429 body's `retryAt` / `retryAfterMinutes` is parsed and `cooldownEndsAt` is set. Graceful degradation: `err.response.data ?? {}` prevents crash on empty body.

### 5. "Try Again" button only visible when `cooldownSecondsLeft === 0`
- While countdown is active: amber countdown card shown ("Retry available in MM:SS"). Once countdown hits 0, "Try Again" button appears. `setCooldownEndsAt(null)` called on retry to clear the countdown interval.

### 6. Review panel gated by `passed`
- **Passed:** Full review — `correctAnswer` + `explanation` for every question.  
- **Failed:** Status-only review — ✅/❌ indicator + student's own answer. `correctAnswer` and `explanation` intentionally not rendered. Message: "Review your lesson and try again after the cooldown period."

**Rationale:** Failed students know *what* they got wrong, but not *what the right answer is*. This forces return to lesson material rather than answer memorization.

---

## Files Changed
- `frontend/src/types/assessment.ts` — added `CooldownStatus` interface
- `frontend/src/services/assessmentService.ts` — added `getCooldownStatus(unitId)` → `GET /assessments/units/:unitId/cooldown-status`
- `frontend/src/pages/courses/QuizPage.tsx` — cooldown state, countdown useEffect, pre-quiz locked screen, results page with gated review

---

# Decision: Content Slugs & Versioning Schema

**Author:** Khwarizmi  
**Date:** 2026-06-20T16:12:48-05:00  
**Status:** Implemented (migration created, not yet applied)  
**Relates to:** Course Improvements Architecture — Item 3

---

## Summary

Added stable content identifiers to Course, Unit, and Question models so that seed files can upsert content without destroying student progress data.

## Changes Made

| Model    | Field            | Type            | Notes                                        |
|----------|------------------|-----------------|----------------------------------------------|
| Course   | `slug`           | `String? @unique` | Nullable; backfill before making required  |
| Course   | `contentVersion` | `Int @default(1)` | Increment on breaking content changes      |
| Unit     | `slug`           | `String?`       | Nullable; composite unique with `courseId`   |
| Question | `externalId`     | `String? @unique` | Nullable; e.g. "maktab-3-fiqh-q1"         |

## Key Design Decision: Nullable vs Default Empty String

All new fields are nullable (`String?`) rather than defaulting to empty string.

**Rationale:** Postgres treats NULLs as distinct values in unique indexes. This means:
- `courses_slug_key` (`slug`) allows many rows with NULL slug — no collision
- `units_courseId_slug_key` (`courseId, slug`) allows many units in the same course to all have NULL slug — no collision

Using `@default("")` instead would cause an immediate constraint violation on apply: every existing unit in the same course would get `slug=""`, violating the composite unique.

## Migration File

`backend/prisma/migrations/20260620211248_add_content_slugs_versioning/migration.sql`

**Not applied yet.** Apply manually with `npx prisma migrate deploy` (or `migrate dev` interactively).

## Backfill Script

`backend/prisma/backfill-slugs.ts`

Run after applying the migration:
```bash
npx ts-node --project tsconfig.json prisma/backfill-slugs.ts
```

Slug generation rules:
- **Course slug:** kebab-case of title, de-duplicated with `-2`, `-3` suffix if needed
- **Unit slug:** `{course-slug}-{unit-title-kebab}`, truncated to 80 chars
- **Question externalId:** `{unit-slug}-q{n}` where n is sequential within the unit

## Next Steps (for seed files)

After applying migration + backfill, seed files can upsert using:
- `Course`: `upsert` on `slug`
- `Unit`: `upsert` on `{ courseId_slug: { courseId, slug } }`
- `Question`: `upsert` on `externalId`

---

# Decision: Maktab Seed Files — Idempotent Upsert Pattern

**Date:** 2026-06-20T16:18:48-05:00  
**Author:** Khwarizmi  
**Status:** Implemented

## Context

All 10 maktab seed files used a "find-first-skip" guard that made them non-idempotent: a second run would silently skip every seed. With the addition of `Course.slug`, `Unit.slug`, and `Question.externalId` unique fields (migration `20260620211248_add_content_slugs_versioning`), we now have stable keys to drive proper upserts.

## Decision

Convert all 10 maktab seed files from:
```typescript
const existing = await prisma.course.findFirst({ where: { title: '...' } });
if (existing) { console.log('⏭️ Already exists — skipping.'); return; }
const course = await prisma.course.create({ ... });
```

To an idempotent upsert chain:
```typescript
const course = await prisma.course.upsert({ where: { slug }, create: { slug, ... }, update: { ... } });
const unit = await prisma.unit.upsert({ where: { courseId_slug: { courseId: course.id, slug } }, ... });
await Promise.all(questions.map(q => prisma.question.upsert({ where: { externalId }, ... })));
await Promise.all(flashcards.map(fc => prisma.flashCard.upsert({ where: { unitId_orderIndex }, ... })));
await prisma.arabicTerm.deleteMany({ where: { unitId } });
await prisma.arabicTerm.createMany({ data: [...] });
```

## Rationale

- **Preserves student data**: `CourseEnrollment`, `UnitProgress`, `QuizResult`, `FlashCardProgress` are never touched.
- **Safe re-runs**: Curriculum content (questions, flashcards) can be corrected in seed files and re-run without losing student progress.
- **ArabicTerm exception**: No unique constraint on `ArabicTerm`, so `deleteMany` + `createMany` is used per-unit. No student data references `ArabicTerm` directly.
- **FlashCard safe**: `FlashCardProgress` references by `flashCardId`. Since we upsert by `unitId_orderIndex` (not by text), the same `id` UUID is preserved on update, so student progress remains intact.

## Slug Assignments

| File | Course slug | Unit slug prefix |
|------|-------------|-----------------|
| CB1 | `maktab-coursebook-1` | `maktab-1-` |
| CB2 | `maktab-coursebook-2` | `maktab-2-` |
| CB3 | `maktab-coursebook-3` | `maktab-3-` |
| CB4 | `maktab-coursebook-4` | `maktab-4-` |
| CB5 | `maktab-coursebook-5` | `maktab-5-` |
| CB6 Boys | `maktab-coursebook-6-boys` | `maktab-6b-` |
| CB6 Girls | `maktab-coursebook-6-girls` | `maktab-6g-` |
| CB7 | `maktab-coursebook-7` | `maktab-7-` |
| CB8 | `maktab-coursebook-8` | `maktab-8-` |
| Further Studies NW | `maktab-further-studies-nw` | `maktab-fs-` |

Unit slugs: `{prefix}fiqh`, `{prefix}ahadith`, `{prefix}sirah`, `{prefix}tarikh`, `{prefix}aqaid`, `{prefix}akhlaq`, `{prefix}adab`  
Further Studies units: `maktab-fs-essentials-1`, `maktab-fs-essentials-2`, `maktab-fs-faith`, `maktab-fs-devotional`, `maktab-fs-identity`, `maktab-fs-living`, `maktab-fs-money`, `maktab-fs-contemporary`, `maktab-fs-hadith`

## Question externalId Pattern

`{unit-slug}-q{N}` where N is 1-indexed within the unit's question array.

## Files Changed

- `backend/prisma/seed-maktab-coursebook1.ts`
- `backend/prisma/seed-maktab-coursebook2.ts`
- `backend/prisma/seed-maktab-coursebook3.ts`
- `backend/prisma/seed-maktab-coursebook4.ts`
- `backend/prisma/seed-maktab-coursebook5.ts`
- `backend/prisma/seed-maktab-coursebook6boys.ts`
- `backend/prisma/seed-maktab-coursebook6girls.ts`
- `backend/prisma/seed-maktab-coursebook7.ts`
- `backend/prisma/seed-maktab-coursebook8.ts`
- `backend/prisma/seed-maktab-further-studies-nw.ts`

