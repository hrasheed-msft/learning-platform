# Squad Decisions

## Active Decisions

### 1. Maktab Coursebook Conversion Strategy (2026-05-16)
**Prepared by:** Khaldun (Lead Architect)

Architectural blueprint for converting 10 Maktab coursebook HTML files into structured platform courses with quizzes and flashcards.

**Key Decisions:**
- **HTML-to-Prisma Mapping:** Subject-based course architecture (one Course per subject per level, with Units representing lessons)
- **Quiz Generation:** Direct migration from parent guides + AI gap-filling for sparse coverage
- **Flashcard Rules:** Extract from content with 5-8 per unit; difficulty mapped to coursebook level (Book 1 = EASY, Books 6-8 = HARD)
- **Seed Pattern:** IDs use kebab-case with coursebook identifier; upsert for idempotence; batch creation pattern
- **Arabic Handling:** Preserve Unicode with diacritics; store as arabicText + transliteration + translation
- **Coursebook Order:** Books 1-2 first (validation), then 4, 6B, 5, 3, 7, 8, 6G, FurtherStudies NW
- **Unresolved:** Image hosting deferred to Phase 2; gender-variant courses as separate entities

**Files:** .squad/decisions/archive/ → Preserved for reference

---

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

### 3. Rate Limiter & Error Handling Fix (2026-05-16)
**Author:** Khwarizmi

Fixed login error caused by rate limiter exhaustion and frontend error extraction failure.

**Key Decisions:**
- **Health check moved above rate limiter** in `backend/src/index.ts` — ensures `/health` is always reachable even when rate limit is exhausted.
- **Frontend error extraction fixed** in `frontend/src/services/api.ts` — `getErrorMessage()` now handles both `{error: "string"}` and `{error: {message: string}}` response shapes.
- **Dev rate limit bumped** from 100 → 1000 in `.env`.
- **Convention:** Backend error responses should use `{message: "..."}` for consistency. The rate limiter's `{error: "..."}` shape is the exception, now handled.

**Impact:** Frontend devs can trust error message extraction; DevOps monitoring won't get false negatives on health checks.

---

### 4. Games, Parent Dashboard, and Child Auth — Integrated Feature Design (2026-05-17)
**Author:** Khaldun (Lead Architect)  
**Status:** PROPOSAL — Pending team review

Comprehensive design document for three interconnected features transforming the platform from content-delivery to engagement-driven family learning.

**Key Decisions:**

#### Feature 1: Games (13 types designed)
- **Course-Integrated (7 types):** Term Match, Ayah Completion, Fiqh Scenario Tree, Hadith Chain Builder, Word Search Grid, Arabic Number Bingo, Verse Memorization Quest
- **Standalone/Hub (6 types):** Expedition City (build city through games), Prophet Story Progression, Quran Juz Challenge, Leaderboard Duels, Achievement Vault, Skill Simulator
- **Content Source:** Auto-generated from existing Questions, FlashCards, ArabicTerms; 100% in Phase 1 (manual authoring deferred to Phase 2)
- **SRS Integration:** Games count as reviews, reducing review burden (major engagement lever)
- **Difficulty Scaling:** 3 tiers (EASY, MEDIUM, HARD) mapped to content; age-aware presentation (EARLY_CHILD with hints → TEEN/ADULT timed mode)
- **New Prisma Models:** Game, GameSession, GameScore, GameRound, Leaderboard, Achievement, UserAchievement, StreamAchievement, UserStreakRecord, BadgeDefinition

#### Feature 2: Parent Dashboard
- **Metrics:** Per-child stats (avg quiz score, study time, streak, game performance), family summary aggregates, activity feed
- **Notifications:** In-app alerts for milestones (course completion, streak reached, score improvement, new badges)
- **Comparative Views:** Per-child performance, category strength (radar chart), time-series study patterns
- **Email Digest:** Deferred to Phase 2 (SMTP not configured; in-app notifications Phase 1)
- **New Prisma Models:** FamilySummary, MemberStats, ActivityEvent, Notification, DashboardSettings

#### Feature 3: Child/Teen Login (Username-Only Auth)
- **Auth Flow:** Parent creates child credentials; child logs in with username+password; receives JWT with role=CHILD, memberId, familyId, ageCategory
- **Scope:** Child sees own courses, progress, games, flashcards, reviews; no family management, billing, or sibling data
- **Credentials Management:** Stored on FamilyMember model (Option A chosen — simpler than separate ChildCredential model)
- **Username Uniqueness:** Globally unique (simpler auth lookup, no family context needed at login)
- **Route Matrix:** Child routes scoped by activeMemberId; parent-only routes (family/*, /dashboard/*, /notifications) blocked
- **API Endpoints:** `POST /api/v1/family/members/:memberId/credentials`, `POST /api/v1/auth/child-login`, `GET/PUT /api/v1/child/me`
- **ChildLayout:** Simplified navigation (My Dashboard, My Courses, My Games, My Flashcards, Achievements) — no settings/family management

**Implementation Order:**
1. Child Auth (unblocks child-specific features)
2. Parent Dashboard (depends on child data)
3. Games Phase 1 (engagement driver; auto-generated content only)
4. Games Phase 2+ (manual scenarios, social features) — scope creep risk

**Open Questions (8):**
1. Child usernames: globally unique or family-scoped? → **Globally unique** (recommendation)
2. Child login page: `/child-login` route or subdomain? → **Same domain, different route**
3. Game content: auto-generated vs. manually authored? → **Phase 1: 100% auto-generated**
4. Games write to SRS? → **Yes** (counts as reviews)
5. Email digest Phase 1? → **No** (defer to Phase 2)
6. Credentials storage: FamilyMember fields (A) or separate model (B)? → **Option A**
7. Child password policy? → **Minimum 6 chars, no complexity**
8. Deprecate PIN field? → **Not yet** (backward compatibility; could support younger children on parent device)

**Effort:** Games Phase 1 (L), Child Auth (M), Parent Dashboard (L-M). Phase 2+ XL with scope creep risk.

**Files:** Complete design with 10 new Prisma models, API specs, UI wireframes, and migration strategy in `.squad/decisions/inbox/khaldun-games-dashboard-childauth-research.md`

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
