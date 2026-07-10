# Archived Decisions — 2026-05-24 Audio Fixes + Production Bugs

## Archive Date
- Archived: 2026-07-09
- Original Date Range: 2026-05-24
- Reason: Older than 30 days

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
