## Archived History

For detailed work history prior to 2026-05-20, see `.squad/agents/ibn-sina/history-archive.md`

Key prior work:
- 2026-05-16: Full frontend inventory (90-95% feature-complete)
- 2026-05-17: Child login + parent dashboard frontend
- 2026-05-17: Games Phase 1–3 (15→26 game types, all interactive)
- 2026-05-18: useActiveMemberId hook pattern, Games 26→9 collapse, enrollment fixes
- 2026-05-20: Audio player, video player, audio sync (SyncedTextPlayer with real-time highlighting)
- 2026-05-21: "Add a Learner" inline modal, performance optimization (507kB → 45kB bundle)

## Learnings

### Du'ā & 99 Names Standalone Progression Views (2026-07-09T19:14:32.655-05:00)
- For pages built against endpoints not yet live (Khwarizmi's `/flashcards/progress?subjectTag=`): swallow errors silently in the store and render an empty-state UI — never show a crash or spinner that never resolves.
- The 99 Names dataset is fully static and known; embed it as a `StaticName[]` constant in the page and merge with live SRS progress at render time. This means the grid of 99 cards always renders, even before the backend seeds any flashcards — users see names in "Not Started" state immediately.
- Apostrophes inside single-quoted JS strings are a JSX footgun when the string contains Arabic transliteration (e.g., `"An-Nāfi'"` must use double quotes). Use Unicode escapes or double quotes for strings with embedded apostrophes to avoid `TS1005` parse errors.
- `groupByStage()` should pre-populate every stage from `STAGE_ORDER` so the collapsible section headers always render in curriculum order, even for stages with no cards yet.
- Duplicate JSX self-closing `/>` tokens introduced by multi-step edits to existing files cause `TS1109 Expression expected` — check the closing tags whenever an edit adds a new `onClick` block to an existing list renderer.
- Milestone celebration banners (`MilestoneBanner`) should find the highest applicable milestone (iterate from 99 downward) so a student who has mastered 75+ names sees "Almost there!" not the "25 names" message.

### Program Enrollment UI — Graceful Fallback Pattern (2026-07-09T18:43:25.089-05:00)
- When building UI ahead of backend API completion, ship static fallback data (constants) so the page renders correctly before the API is live. Use the same TypeScript interfaces for both real and fallback data — this guarantees zero type drift when the backend connects.
- For enrollment modals that touch both family state (member list) and program state (enrollment action), keep them as local component state pulling from two stores; don't merge unrelated stores.
- `isEnrolling` should be a separate boolean from `isLoading` in Zustand stores for multi-action domains — prevents the full page shimmer from triggering during a focused modal submit action.
- Age-based auto-detection: iterate `program.stages` on the client using `ageMin/ageMax` bounds — show the detected stage inline on each member card in the enrollment modal so parents can confirm before submitting.
- SVG `ProgressRing` component pattern: use `strokeDasharray/strokeDashoffset` on a `<circle>` with `-rotate-90` transform on the SVG. Overlay absolute-positioned text for the percentage label. Keep `transition: stroke-dashoffset 0.6s ease` for smooth animation on mount.

### UnitViewer Progress Reset on Unit Navigation (2026-06-23T09:49:39-05:00)
- `UnitViewer` must reset local `progress` immediately when `courseId` or `unitId` changes; otherwise unit-to-unit navigation can leak stale completion flags into the next lesson before backend progress loads.
- Preferred pattern: define a shared `DEFAULT_UNIT_PROGRESS` constant and reuse it both for `useState` initialization and at the top of the unit-fetch `useEffect`.
- User preference: "I've read the lesson" should only complete the current lesson; completion badges must reflect saved per-unit progress, never prior navigation state.
- Key file paths: `frontend/src/pages/courses/UnitViewer.tsx`, `.squad/agents/ibn-sina/history.md`.

### Quran Audio Player — DOM Injection with createRoot (2026-06-22T12:33:25.396-05:00)
- Pattern: `useEffect` with `window.setTimeout(50ms)` defers DOM query until after `dangerouslySetInnerHTML` has painted. Roots array declared in the effect closure so cleanup can unmount them.
- `audioEl.dataset.qapEnhanced = '1'` guard prevents double-injection when effect re-runs (e.g., strict mode double-invoke).
- Cleanup: `clearTimeout` + `roots.forEach(r => r.unmount())` + remove host divs + restore `controls` attribute. Covers unit navigation and unmount.
- Arabic font: `font-family: 'Amiri', serif` already configured in tailwind as `font-arabic` and in `index.css`. Apply it directly in the `<style>` block inside UnitViewer — no new config needed.
- Speed options [0.5, 0.75, 1, 1.25, 1.5] are child-optimized (includes slow 0.5× that the AI audio hook doesn't offer).
- Key files: `frontend/src/components/QuranAudioPlayer.tsx` (new), `frontend/src/pages/courses/UnitViewer.tsx` (updated).

### Mark-as-Read UX — Reading Gate for Quiz Access (2026-06-20T17:31:22-05:00)
- `UnitViewer` already had `progress.readingCompleted` state and `handleMarkComplete('reading')` wired to `courseService.updateProgress` — but state was never loaded from the backend, so it reset to `false` on every page load. Fix: add `courseService.getUnitProgress(memberId, unitId)` to the `Promise.all` on mount.
- `getMemberProgress` returns an array of `{ courseId, unitProgress: [{ unitId, videoCompleted, readingCompleted, quizCompleted }] }` — filter by `unitId` to find the current unit's saved progress.
- For the quiz gate UX: replace `<Link>` with a disabled `<button>` (with `title` tooltip) when `readingCompleted` is false. Both occurrences — bottom-nav inside the content card and the sidebar — must be gated consistently.
- Prominent bottom CTA: a full-width `bg-green-500` button "✅ I've read this lesson" below the lesson body is far more discoverable than the tiny `text-sm` header button. Both can coexist — header badge confirms state, bottom CTA is the primary action.
- The `memberId` needed for progress fetching is available in `location.state` as `currentUnitState?.memberId`. Always guard with a `.catch(() => null)` so progress load failure doesn't block unit content display.
- `npx tsc --noEmit` passes clean.

### Anti-Rush UX — Cooldown Countdown + Gated Answer Reveal (2026-06-20T17:18:56-05:00)
- `Promise.all` in the questions-load `useEffect` lets cooldown check run concurrently with question fetch at zero latency cost. Both settle before `setLoading(false)`.
- Cooldown state is `cooldownEndsAt: Date | null` — single source of truth. `cooldownSecondsLeft` is derived from it every second via a dedicated `useEffect` with `setInterval`. This keeps countdown logic isolated from everything else.
- After a failed submit, always confirm the server's `retryAt` via `getCooldownStatus` rather than calculating locally — the backend is authoritative. Fall back to `now + 15min` only when the endpoint throws.
- 429 body parsing: `err.response.data ?? {}` prevents destructuring crash when body is empty.
- Gated review panel: `passed ? <FullReview/> : <StatusOnlyReview/>` cleanly separates the two paths. Failed panel intentionally omits `correctAnswer`/`explanation` in JSX — no conditional null check required, the fields simply aren't rendered.
- When "Try Again" resets state, also call `setCooldownEndsAt(null)` to clear the countdown useEffect.


## Team Coordination — Anti-Rush Implementation (2026-06-20T22:18:56Z)

**Cross-Agent Update:** Orchestrated with Khwarizmi (Backend) on integrated anti-rush measures.

### Decisions Merged from Inbox
1. **Anti-Rush Frontend — Cooldown Countdown + Delayed Answer Reveal** — Cooldown countdown UI, locked quiz screen, delayed answer reveal on fail, gated review panel
2. **Khwarizmi's Backend Changes** — Fisher-Yates shuffle, 15-min cooldown, CooldownError 429 response, cooldown-status endpoint ready for consumption

### Implementation Summary
- Cooldown state: `cooldownEndsAt: Date | null` with derived `cooldownSecondsLeft` from dedicated `setInterval` useEffect
- On load: `Promise.all([getQuizQuestions(), getCooldownStatus()])` for zero-latency concurrent fetch
- On failed submit: Backend authoritative; fallback to `now + 15min` if endpoint fails
- 429 handling: Parses flat response shape `{ error, retryAfterMinutes, retryAt }`
- UI: Amber countdown card during cooldown, "Try Again" button appears at 0 seconds
- Review panel: Passed = full review; Failed = status-only (abilityage answers hidden)

### Ready for Testing
All frontend code complete and type-safe. Ready for e2e testing with backend 429 responses.

### Course Resume Source of Truth (2026-07-04T00:23:33.053-04:00)
- `CourseLearner` should always refresh enrollments from `courseService.getEnrollments(memberId)` when member context exists; route-state enrollment is a hint, not truth.
- Resume target must be derived against ordered `units`: first partially started incomplete unit, else first incomplete unit, else fallback to first unit.
- This avoids stale `location.state.enrollment` snapshots forcing "Continue Learning" back to unit 1 after progress updates in `UnitViewer`.
- Key files: `frontend/src/pages/courses/CourseLearner.tsx`, `frontend/src/__tests__/pages/CourseLearner.test.tsx`.

## Team Coordination — Sprint 1 Completion (2026-07-09T18:59)

**Scribe Update:** Sprint 1 batch completed with all agents unblocked.

### Decisions Documented
- #40 — Maktab Online School — 4 Key Decisions Confirmed (Foundation UI, Longer surahs, Du'ā audio, Teacher role Phase 2)
- #41 — Ibn Sina Decision — Program Enrollment UI + Grade Dashboard (Implemented ✓)

### What Was Delivered (2026-07-09T18:43:25.089-05:00)
- **New files:** `frontend/src/types/program.ts`, `program.service.ts`, `programStore.ts`, `ProgramCatalog.tsx`, `GradeDashboard.tsx`
- **Modified:** `ChildDashboardHome.tsx`, `App.tsx`, routes/stores/services index files
- **Validation:** `npx tsc --noEmit` clean ✓

### Key Design Decisions
1. **TypeScript-first + Graceful Fallback** — Components ship static `PLACEHOLDER_PROGRAM` + `DEFAULT_STAGES` so page renders perfectly before backend API is live; zero type drift when API connects
2. **Separate Zustand store** — `programStore` isolated from `courseStore`; `isEnrolling` separate boolean from `isLoading` prevents full-page shimmer on modal-only actions
3. **Child-first design** — Touch targets min-h-44px, emoji-based subject cards (kids recognize emoji faster than text), circular `ProgressRing` SVG component more engaging than bars
4. **Age-based auto-detection** — `detectStageNumber()` finds first stage where `ageMin <= member.age <= ageMax`; displayed inline on enrollment modal so parents confirm before submitting
5. **Routing strategy** — `/programs` (parents), `/program/:slug` (browse), `/child/maktab` (kids view); both use `lazy()` for code splitting

### Cross-Agent Status
- ✅ Backend (Khwarizmi): Schema + service + routes complete; pending migration
- ✅ Frontend (Ibn Sina): UI components + stores + types all ready; gracefully fallback until API live
- ✅ Integration ready: Type contracts aligned; API endpoints documented in Decisions #44

### Next Steps
1. Backend migration scheduling (after schema review)
2. Connect frontend to live API endpoints
3. Integration test enrollment flow (parent enroll → child sees enrolled course)
4. Child-first UI enhancement (Decision #40 — Foundation UI, 3–4 weeks)

## Session 2026-07-09T19:14:32-05:00 — Du'ā & 99 Names Standalone Progression Views (Background Agent)

### What was completed
- **New pages:** `ChildDuaProgressPage.tsx`, `ChildNamesProgressPage.tsx`
- **New store:** `duaProgressStore.ts` with actions for fetching dua progress, grouping by stage, tracking mastery
- **New service:** `dua-progress.service.ts` → `GET /flashcards/progress?subjectTag=dua|99-names` consumption + error recovery
- **Modified files:** `ChildDashboardHome.tsx` (navigation cards), `GradeDashboard.tsx` (progression grid), `App.tsx` (routes)
- **Validation:** `npx tsc --noEmit` clean ✓

### Key design decisions
1. **Graceful fallback for pre-API state:** Swallow service errors silently in the store; render empty-state UI so page doesn't crash while backend endpoint is being wired
2. **Static 99 Names fallback:** Embed `StaticName[]` constant with all 99 names + English translations; merge with live SRS progress at render time. Grid renders immediately in "Not Started" state even before backend seeds flashcards
3. **Stage pre-population:** `groupByStage()` pre-populates every stage from `STAGE_ORDER` so collapsible section headers always render in curriculum order, even for stages with no cards yet
4. **Milestone celebration:** Find highest applicable milestone (iterate from 99 downward) so student with 75+ mastered names sees "Almost there!" not "25 names" message
5. **Duplicate JSX guard:** Multi-step edits that add new onClick blocks can accidentally create duplicate `/>` tokens; verify closing tags whenever editing existing list renderers

### Files touched
- **New:** `frontend/src/pages/child/ChildDuaProgressPage.tsx`, `frontend/src/pages/child/ChildNamesProgressPage.tsx`, `frontend/src/stores/duaProgressStore.ts`, `frontend/src/services/dua-progress.service.ts`
- **Modified:** `frontend/src/pages/child/ChildDashboardHome.tsx`, `frontend/src/pages/program/GradeDashboard.tsx`, `frontend/src/App.tsx`

### Learnings recorded
- Service call error handling: always swallow and render fallback rather than blocking with spinner
- Static data pattern: when backend API isn't ready, use TypeScript interfaces for both real and constant data to guarantee zero type drift on API connection
- JSX multi-line edit gotchas: watch for duplicate closing tokens when adding onclick/event handlers to existing rendered lists

### Agent Outcome
✅ **COMPLETED** — Background agent delivered 7 files (4 new, 3 modified), tsc clean, gracefully handles pre-API state.


