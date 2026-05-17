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

## Learnings

### Login/Auth Debugging (2026-05-16)
- **Rate limiter placement matters:** Global `app.use(limiter)` was applied before health check, blocking diagnostics when limit was exhausted. Health check now lives above the rate limiter in `backend/src/index.ts`.
- **Dev rate limit:** `.env` had `RATE_LIMIT_MAX_REQUESTS=100` (config default is 1000). Vite HMR + frontend polling can burn through 100 fast. Bumped to 1000 for dev.
- **Error shape mismatch:** Rate limiter returns `{error: "string"}`, but frontend `getErrorMessage()` in `frontend/src/services/api.ts` only handled `{error: {message: string}}`. Fixed to check `typeof data.error === 'string'` first.
- **express-rate-limit uses in-memory store by default** — counter resets on server restart. No Redis store configured.
- **Key file paths for auth flow:** `backend/src/services/auth.service.ts` (login logic, bcrypt, JWT), `backend/src/routes/auth.routes.ts` (validation), `backend/src/controllers/auth.controller.ts` (thin controller), `frontend/src/services/api.ts` (axios interceptors, error extraction), `frontend/src/services/authService.ts` (API calls), `frontend/src/stores/authStore.ts` (Zustand state).
- **API versioning:** Backend routes are at `/api/v1/*`, Vite proxy forwards `/api/v1` → `localhost:3000`.

### Session Summary (2026-05-17T02:05:32Z)
**Status:** Login error bug fixed and documented in decisions.md #3.
- Health check moved above rate limiter middleware (always reachable for monitoring)
- Frontend error extraction fixed to handle both error response shapes
- Dev rate limit increased from 100 → 1000
- Orchestration log: `2026-05-17T020532Z-khwarizmi.md`
- Session log: `2026-05-17T020532Z-login-fix.md`

### Course Catalog Not Loading — Pagination Limit Fix (2026-05-17)
- **Root cause:** Frontend `courseStore.ts` had `defaultFilters.limit = 12`, but there are 17 published courses. The `CourseCatalog.tsx` page calls `fetchCourses()` with no args, inheriting the 12-course limit. No pagination UI exists, so the remaining 5 courses were silently invisible.
- **Secondary issue:** Rate limiter (in-memory store) was exhausted again from Vite HMR traffic, causing `{"error":"Too many requests"}` on the courses endpoint. Restarting the backend cleared the counter.
- **Fix:** Changed `defaultFilters.limit` from 12 → 50 in `frontend/src/stores/courseStore.ts`. With 17 published courses, all now load on a single page.
- **DB state:** 17 courses total, all `isPublished: true`. The backend service defaults to `limit = 20` but the frontend was overriding with 12.
- **Pattern:** When a catalog page has no pagination UI, the default fetch limit must exceed the total item count. Consider adding pagination UI if course count grows past 50.
- **Rate limiter note:** In-memory store means restart clears the counter. For dev, consider switching to Redis store or exempting read-only public endpoints from rate limiting.

### Games, Parent Dashboard & Child Auth Design Ready (2026-05-17)

**Parallel Work from Khaldun:** Design document delivered, 700+ lines covering three interconnected features.

**What This Enables for Backend:**
1. **Child Auth Implementation (Phase 1):** You can now implement username/password login on FamilyMember with JWT role branching. Schema additions documented; 8 open questions resolved with recommendations.
2. **Parent Dashboard API:** ActivityEvent model captures all learning activity for dashboard stats/feed. Can be integrated alongside existing assessment result logging.
3. **Games API Layer:** 13 game types designed; all auto-generated from existing Question/FlashCard/ArabicTerm data in Phase 1. SRS writeback from games is confirmed as engagement lever (game result feeds back to SM-2 reviews).

**Implementation Order:** Child Auth → Parent Dashboard → Games Phase 1

**Next Steps for Backend:**
- Review design doc for 8 open questions (team consensus needed)
- Once approved: Child Auth implementation sprint
- Catalog fix (this session) ensures courses load smoothly for game content integration

### Seed Loading Fix + Child Auth + Parent Dashboard (2026-05-17)

**Seed Loading Bug Fix:**
- **Root cause:** 12 of 23 seed files were standalone scripts (no `export`, direct `main()` call) — not wired into `seed.ts`. Only the 11 maktab/quduri seeds were imported.
- **Fix:** Added `export` to all 12 missing seed functions, wrapped bottom-level `main()` calls in `if (require.main === module)` guard (matching maktab pattern). Imported and called all from `seed.ts`.
- **Missing seeds now wired:** tazkiyah, habits, rawai-hadaratina, hujjatullah, sarf-course (parts 1-5), sarf-quizzes, sarf-flashcards.
- **Note:** `seed-sarf-simple.ts` is a standalone alternative to the multi-part sarf approach — NOT wired into seed.ts to avoid duplicate course creation.
- **Pattern rule:** All seed files must `export` their main function and guard standalone execution with `require.main === module`.

**Child Auth (Phase 1):**
- Schema: Added `username String? @unique`, `passwordHash String?`, `loginEnabled Boolean @default(false)` to FamilyMember model.
- JWT dual-token: `authenticate` middleware now handles both parent tokens (`userId` claim) and child tokens (`sub` = memberId, `role: "CHILD"`).
- New middleware: `requireChild`, `requireParent` (distinct from `requireParentRole`).
- API endpoints: `POST /api/v1/auth/child-login`, `POST /api/v1/family/members/:memberId/credentials`, `GET/PUT /api/v1/child/me`.
- Password policy: min 6 chars, bcrypt-hashed, username globally unique, lowercase-normalized.
- Key files: `services/child-auth.service.ts`, `controllers/child-auth.controller.ts`, `routes/child-auth.routes.ts`.

**Parent Dashboard Backend:**
- New models: `ActivityEvent` (enum: QUIZ_COMPLETED, COURSE_STARTED, etc.), `Notification` (enum: MILESTONE, ALERT, WEEKLY_SUMMARY).
- Dashboard endpoints: `GET /api/v1/dashboard/children`, `GET /api/v1/dashboard/children/:memberId/stats`, `GET /api/v1/dashboard/children/:memberId/activity`, `GET /api/v1/dashboard/family/summary`.
- Notification endpoints: `GET /api/v1/notifications`, `PUT /api/v1/notifications/:id/read`.
- `recordActivity()` helper wired into quiz completion flow in `assessment.service.ts`.
- Key files: `services/dashboard.service.ts`, `services/notification.service.ts`, `services/activity.service.ts`.

**Migration:** `20260517110850_add_child_auth_and_dashboard` applied. Includes new tables: `activity_events`, `notifications`, plus FamilyMember schema additions.

