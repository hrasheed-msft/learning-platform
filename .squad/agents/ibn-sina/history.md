# Ibn Sina — Frontend Dev

**Focus:** React component development, user flows, performance optimization, audio/video UI, gaming frontend

## Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Learnings

### Authenticated E2E Testing — Playwright Against Production (2026-07-10T16:40:00Z)
- **Infrastructure Added:** `frontend/playwright.config.ts`, `frontend/e2e/authenticated-enrollment.spec.ts`, `frontend/.env.e2e.example`, `docs/e2e-authenticated-testing.md`
- **Credential Strategy:** Test email/password passed via `process.env.TEST_EMAIL` / `process.env.TEST_PASSWORD` (env vars only, never in source code)
- **Test Account:** hassan.rasheed1@live.com (designated production account for E2E)
- **Workflow:** Log in with test credentials, enroll child in Maktab An Naṣīḥah, verify stage display renders
- **Status:** ✅ Production E2E PASS 1/1 in 9.7s
- **Pattern for Future Work:** All feature work now requires authenticated E2E test before completion claim

### Program Service Routes Must Match Backend Exactly (2026-07-10T16:40:00Z)
- **Root Cause:** Frontend `program.service.ts` routes differed from backend:
  - Frontend (WRONG): `/programs/enrollments`, `/programs/${slug}`, `/programs/stage-summary/member/{id}`
  - Backend (CORRECT): `/programs/${programId}/enroll`, `/programs/slug/${slug}`, `/programs/enrollment/${id}`, `/programs/enrollment/${id}/stage-summary`
- **Fix:** Updated all routes in `frontend/src/services/program.service.ts` to match backend exactly
- **Learning:** Always cross-reference backend `routes.ts` when building frontend service methods. Route mismatch is a silent failure (API returns 404 but frontend may not surface the error clearly)
- **Related Decision:** Decision #49 documents all 4 enrollment bugs and their fixes

### ProgramCatalog Must Fetch Family Members on Mount (2026-07-09T22:53:10-05:00)
- `EnrollModal` in `ProgramCatalog.tsx` builds its learner list from `useFamilyStore().members`. When a parent navigates directly to `/programs` via the Maktab sidebar link, the family store is empty → no learner buttons render → `selectedMemberId` stays `''` → "Start the Journey" stays disabled.
- Fix: call `fetchMembers(family.id)` on mount in `ProgramCatalog`, where `family` comes from `useAuthStore()`. Guard with `if (family?.id)`.
- App-wide pattern: CourseDetail, GamesHub, FamilyDashboard all use this exact shape.
- Also added empty-state message in `EnrollModal` when `learners.length === 0`: "Add a learner in Settings first" with a `/settings` link.

---

## Quick Status (Most Recent)

**Prod Deploy Gap — SWA Cache-Control Fix (2026-07-10T02:35:34Z):** ✅ COMPLETE
- **Context:** New frontend features (ChildDuaProgressPage, ChildNamesProgressPage, GradeDashboard, Maktab section) not visible in production despite successful CI/CD.
- **Root Cause:** `frontend/public/staticwebapp.config.json` had no `Cache-Control` headers. Azure SWA + CDN served cached old index.html referencing old JS chunks.
- **Fix:** Added `no-cache, no-store, must-revalidate` for HTML routes and `public, max-age=31536000, immutable` for `/assets/*`. Deleted orphan `frontend/staticwebapp.config.json` (root level, never deployed by Vite). Added `skip_app_build: true` to CI SWA deploy steps.
- **Commit:** 96b3a01 pushed to main.
- **Relevant to:** All future frontend deployments must ensure SPA cache headers are correct to prevent stale app shells.

---

**Maktab Nav Entry Point (2026-07-09T21:58:27-05:00):** ✅ COMPLETE
- **Problem:** Parents couldn't find the evening/weekend learning-path selector. The feature existed in `ProgramCatalog`'s `EnrollModal` but had no sidebar link.
- **Fix:** Added `GraduationCap` icon import and `{ name: 'Maktab 🕌', href: '/programs', icon: GraduationCap }` entry to the `navigation` array in `frontend/src/components/layouts/MainLayout.tsx`, placed after "Courses".
- **Key Learning:** The evening (After-School) vs Weekend learning-path selector lives inside `ProgramCatalog`'s `EnrollModal` (rendered at `/programs`). The only thing missing was the sidebar nav entry. Active-state highlighting uses `location.pathname.startsWith('/programs')` which correctly highlights for both `/programs` and `/program/:slug`.
- `npx tsc --noEmit` passes clean.

---

**Anti-Rush Frontend: Cooldown Countdown + Delayed Answer Reveal (2026-06-20T17:18:56-05:00):** ✅ COMPLETE
- `CooldownStatus` type added to `assessment.ts`
- `getCooldownStatus(unitId)` method added to `assessmentService.ts` → `GET /assessments/units/:unitId/cooldown-status`
- On page load: cooldown status checked concurrently with questions fetch; if active, pre-quiz "Quiz Locked" screen shown
- On submit failure (`passed: false`): cooldown status fetched from backend to get authoritative `retryAt`; falls back to `now + 15min` if endpoint fails
- 429 handling: parses `retryAt`/`retryAfterMinutes` from error response body
- Countdown useEffect ticks every second from `cooldownEndsAt` → `cooldownSecondsLeft`
- "Try Again" button only visible when `cooldownSecondsLeft === 0`; replaced by amber countdown card while waiting
- Review panel gated by `passed`: failed students see ✅/❌ + their own answer only; passed students get full `correctAnswer` + `explanation` reveal
- `npx tsc --noEmit` passes clean

---

**Quiz Answer Security Fix (2026-06-20T14:01:24-05:00):** ✅ COMPLETE
- Removed `correctAnswer`/`explanation` from GET question flow
- Score and review panel now driven by `submitQuiz()` response
- `QuizSubmissionResponse` type aligned with actual backend shape
- `npx tsc --noEmit` passes clean

---
- Created `SyncedTextContent` component for inline highlighting
- Refactored `UnitAudioButton` to emit sync state via callback
- Updated `UnitViewer` to coordinate highlighting from audio playback
- Build passes; tests passing
- Decision #20 created

---

## Key Recent Learnings (2026-06-05 onwards)

### Maktab Nav Entry — Path Selection Lives in EnrollModal (2026-07-09T21:58:27-05:00)
- The AFTER_SCHOOL vs WEEKEND learning-path picker is inside `ProgramCatalog`'s `EnrollModal` at `/programs`.
- Parents previously had no route to this page from the sidebar — the feature was invisible despite being fully built.
- Fix is always a single-line nav entry: `{ name: 'Maktab 🕌', href: '/programs', icon: GraduationCap }` in `MainLayout`'s `navigation` array.
- `startsWith('/programs')` active-state check correctly highlights for both the catalog page and individual program slug pages (`/program/:slug`).

### Quiz Answer Security — Submit-Response-Driven Grading (2026-06-20T14:01:24-05:00)
- `getQuestions()` intentionally omits `correctAnswer`/`explanation` — never trust GET data for grading.
- Score, `isCorrect`, `correctAnswer`, and `explanation` all come exclusively from `submitQuiz()` response (`answers[]` array).
- Pattern: add `submitResult: QuizSubmissionResponse | null` state; populate it from the submit response; review panel does `.find(a => a.questionId === q.id)` to correlate with rendered questions.
- Graceful degradation: if submit fails, show zeros for score and a "Results unavailable" note in review panel — never expose correctAnswers client-side before submission.
- `QuizSubmissionResponse` was mismatched against the backend (`results` vs `answers`, extra fields `attemptNumber/bestScore/masteryThreshold`); fixed to `{id, score, passed, correctCount, totalQuestions, pointsEarned, answers: GradedAnswer[]}`.
- Added `GradedAnswer` interface to `frontend/src/types/assessment.ts`.
- Key files: `frontend/src/pages/courses/QuizPage.tsx`, `frontend/src/types/assessment.ts`, `backend/src/services/assessment.service.ts`.

### Interactive Lesson CTA Surfacing (2026-06-06T17:09:20-05:00)
- `UnitViewer` already renders `unit.content.text` HTML directly (raw when idle, parsed/preserved through `SyncedTextContent` during audio sync), so backend-authored lesson `<a>` tags work without extra frontend parsing changes.
- For al-Masār units, add a dedicated top-of-content CTA only when the HTML content already references `/lessons/masaar-irab-sarf/week-N.html`; derive the canonical button URL from `orderIndex + 1` so the button stays consistent even if inline copy changes.
- Style inline lesson anchors explicitly inside `.unit-content` so backend-provided links remain obvious and tappable within long-form lesson text.

### 2026-06-06T17:42:46Z — al-Masār HTML Lessons Complete (Weeks 1–8)
✅ **ALL EIGHT HTML LESSONS DELIVERED** (Parallel with Khwarizmi seed generation)

**Architecture Notes:**
- Each HTML file is self-contained (no external JS dependencies beyond basic HTML5)
- Markup structure ready for platform ingestion (matches maktab-coursebook-html semantic format)
- Grammar metadata baked into HTML `data-*` attributes for word-level lookup
- Platform linkage ready for routing decision

---

## Session History (Recent)

### 2026-05-24 — Audio Text Sync Ownership & Inline Highlighting
**Orchestration Log:** `.squad/orchestration-log/2026-05-24T14-34-31Z-ibn-sina.md`

✅ **COMPLETE**

**Deliverables:**
- `SyncedTextContent.tsx` — Parses lesson HTML, applies word-level highlighting
- Refactored `UnitAudioButton` — Owns playback controls only; emits sync state via callback
- Updated `UnitViewer` — Accepts sync state and coordinates highlighting

**Key Changes:**
- Removed embedded TextHighlight popup (eliminated duplicate text surface)
- Keeps audio player compact in Study Aids card
- Learners follow highlighted words in the context of existing lesson body
- Component tests ✅, integration tests ✅, build ✅

**Decision Created:** #20 — Inline Audio Sync — Ownership and Page-Level Content Highlighting (2026-05-24)

---

## Archived History

For detailed history prior to 2026-06-20, see history-archive-2026-07-09.md
