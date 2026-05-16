# Decisions Archive

**Last Updated:** 2026-05-16T08:36:20-05:00  
**Total Decisions:** 5  
**Source:** Merged from .squad/decisions/inbox/ on 2026-05-16

---

## Decision: Architecture Inventory Key Findings

**Author:** Khaldun (Lead/Architect)  
**Date:** 2026-05-16  
**Status:** Informational — awareness for all agents

### Context

Completed a comprehensive architectural inventory of the full platform. The codebase is more mature than expected — all major features have real implementations (not stubs), the backend has 65+ API endpoints, and the frontend has 15+ fully-built pages.

### Key Findings Requiring Team Awareness

#### 1. Directus CMS is Scaffolded, Not Integrated
Docker config exists but the app doesn't use Directus at all. All content is managed through Prisma seed files. Any future CMS work starts from zero integration.

#### 2. Gamification is Schema-Only
The Achievement model exists and there's an endpoint to read achievements, but no logic anywhere awards them. Streaks/points fields exist on FamilyMember but nothing increments them beyond seed data.

#### 3. Dual SRS Systems
MemorizationItem (general SRS with AYAH/HADITH/DUA/TERM types) and FlashCardProgress (flashcard-specific SM-2) are separate systems with overlapping concerns. Both have SM-2 implementations. This needs consolidation or clear separation of purpose.

#### 4. Seed Files Are Fragmented
Main seed.ts creates 6 courses. Five additional seed files create 5 more courses independently. They're not connected — no orchestration, no single command to seed everything.

#### 5. Maktab Coursebooks Are Ready for Ingestion
10 well-structured HTML coursebooks (ages 6-adult) with semantic CSS classes (.subject, .topic, .arabic) are in maktab-coursebook-html/. These are the primary content source for upcoming course creation. The HTML structure is parseable.

### No Decision Required
This is an informational record. Specific decisions on consolidation, gamification activation, and Maktab ingestion strategy should be made when those workstreams begin.

---

## Decision: Frontend Gaps to Address

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-05-16

### Context
Full frontend inventory completed. The codebase is ~90-95% built out, but several gaps exist between what the README promises and what's implemented.

### Key Gaps Requiring Team Discussion

1. **No 404 page** — catch-all silently redirects to dashboard. Should we build a proper NotFound page?
2. **Missing utils/ and hooks/ directories** — Vite aliases exist for `@utils` and `@hooks` but the directories don't exist. Should we create them or remove the aliases?
3. **Family admin invite flow unimplemented** — `familyService` stubs exist (`getAdmins`, `inviteAdmin`, etc.) but no UI or backend. Is this on the roadmap?
4. **AI-powered quiz generation** — README advertises it but no frontend UI exists. Backend status unknown.
5. **Gamification page missing** — ChildDashboard shows locked badges, but there's no achievements/leaderboard page. Is this planned?
6. **Orphaned review/ReviewSession.tsx** — Not routed anywhere; `/reviews` uses `flashcards/ReviewSessionPage` instead. Should we consolidate or remove?
7. **Review streak uses localStorage** — Should this be persisted to backend instead?

### Recommendation
Items 1-2 are quick fixes I can handle immediately. Items 3-7 need product direction before frontend work begins.

---

## Decision Proposal: Fix Sarf Seed / Schema Mismatch

**Author:** Khwarizmi (Backend Dev)  
**Date:** 2026-05-16

### Context

`seed-sarf-course.ts` uses fields that don't exist in the current Prisma schema:
- `descriptionArabic`, `titleArabic` on Course/Unit
- `level`, `ageCategory` (as single string), `estimatedHours` on Course
- `category: 'LANGUAGE'` (not in the Course.category enum values)

Running `db:seed:sarf` will fail at runtime with Prisma validation errors.

### Options

1. **Update Prisma schema** to add these fields (descriptionArabic, titleArabic, level, estimatedHours) and add 'LANGUAGE' to category values. Requires a new migration.
2. **Fix the seed file** to only use existing schema fields. Loses Arabic text and metadata.
3. **Both** — add the useful fields to the schema AND fix seed consistency.

### Recommendation

Option 3. The Arabic text fields and level/estimatedHours are genuinely useful for all courses, not just Sarf. Add them to the schema with a migration, then audit all seed files for consistency.

### Status

Proposed — awaiting team discussion.

---

## Decision Proposal: Consolidate Dual SRS Systems

**Author:** Khwarizmi (Backend Dev)  
**Date:** 2026-05-16

### Context

The backend has two independent spaced repetition systems:

1. **MemorizationItem + ReviewLog** (`srs.service.ts`) — uses simplified SM-2 with fixed interval table [0,1,3,7,14,30,60,120,240]. Tracks AYAH/HADITH/DUA/TERM items per FamilyMember.
2. **FlashCard + FlashCardProgress** (`flashcard/` services) — uses full SM-2 algorithm with ease factor adjustment, status transitions (NEW→LEARNING→REVIEWING→MASTERED), and richer analytics.

Both serve the same purpose (spaced repetition review) for different content types. The FlashCard system is more mature and feature-rich.

### Proposal

Consolidate onto the FlashCard SRS system as the single spaced repetition engine. Migrate MemorizationItem content types (AYAH, HADITH, DUA, TERM) to work through the FlashCard model.

### Impact

- Reduces code duplication and maintenance surface
- Gives all content types access to the better SM-2 implementation
- Requires migration of existing MemorizationItem data
- Frontend SRS components would need to point at FlashCard endpoints

### Status

Proposed — awaiting team discussion.

---

## Decision: Critical Security & Quality Fixes Needed

**Author:** Biruni (QA)  
**Date:** 2026-05-16  
**Status:** Proposed

### Context

Full quality audit revealed 3 critical security issues and several high-severity gaps that should block any production deployment.

### Critical Items Requiring Immediate Action

1. **Rotate OpenAI API key** — real key exposed in `backend/.env`. Must rotate in OpenAI dashboard and scrub from git history.
2. **Remove auth console.log** — `frontend/src/services/authService.ts` lines 20-23 log email, API URL, and full login response (including tokens) to browser console.
3. **Implement logout token invalidation** — `backend/src/services/auth.service.ts` logout() is a no-op. Stolen refresh tokens remain valid for 30 days.

### High-Severity Items for This Sprint

4. Add `*.timestamp-*.mjs` to frontend/.gitignore and remove 44 stale files.
5. Make JWT secrets required (throw if env vars missing, not fallback to weak defaults).
6. Hash child PINs with bcrypt (currently plaintext).
7. Add React Error Boundary to App.tsx.
8. Add pagination to 5+ unbounded list endpoints.

### Recommendation

Items 1-3 should be addressed before any further feature work. Items 4-8 should be completed this sprint. Full report at `.squad/agents/biruni/quality-report-2026-05-16.md`.

