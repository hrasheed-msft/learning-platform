# Squad Decisions Archive

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

### 5. Games Engine Backend Implementation (2026-05-17)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED  
**Related:** `khaldun-games-detailed-design.md`

Backend implementation of the game engine with 14 Prisma models, 8 enums, and full gamification layer.

**Key Decisions:**
- **Schema:** 14 models, 8 enums (all 15 GameType values defined upfront, 5 active in Phase 1)
- **Content Selection Priority:** SRS-due items → recently incorrect → unseen → random fill
- **SRS Writeback:** Game answers feed into flashcard SRS via SM-2 algorithm (correct=rating 4, incorrect=rating 2, fast correct=rating 5)
- **Scoring Formula:** BASE_POINTS(100) + SPEED_BONUS(max 50) × STREAK_MULTIPLIER(1x/1.5x/2x/3x); Stars: ≥90%=3★, ≥75%=2★, ≥50%=1★; XP = score×0.1 + stars×25
- **Parental Controls:** Whitelist model—empty array = all allowed, non-empty = whitelist; includes time budget, difficulty cap, optional enforce-after-hour
- **Achievement System:** Decoupled check after game completion; 11 triggers defined
- **Daily Challenge:** Date-based seed shuffle; one attempt per member per day enforced via constraint

**Files Created:** ~13 files, 3390 lines total
- `prisma/schema.prisma`: +~350 lines, 8 enums, 14 models
- `services/game.service.ts`: ~1095 lines (core engine)
- `services/achievement.service.ts`: ~210 lines
- `controllers/game.controller.ts`: ~260 lines
- `routes/game.routes.ts`: ~135 lines
- 15 API endpoints; migration applied; commit a43888a

---

### 6. Games Feature Frontend Architecture (2026-05-18)
**Author:** Ibn Sina (Frontend Dev)  
**Status:** IMPLEMENTED  
**Related:** `khaldun-games-detailed-design.md`

Frontend implementation of games feature with 25 new files: 6 playable game types, 10 shared UI components, Games Hub page, routing, navigation updates.

**Key Decisions:**
- **Barrel Re-exports:** Explicit named re-exports in `types/index.ts` to avoid StreakInfo/progress.ts conflicts
- **GamePlay Router Pattern:** Single `GamePlay.tsx` component mapping URL slugs (e.g., `term-match`) to game components
- **Shared Game Components:** 10 reusable components (timer, score, progress bar, stars, game over, difficulty selector, hint button, streak indicator, time bar, blocked screen)
- **Parental Controls Integration:** Every game checks parental settings; `GameBlockedScreen` handles 4 block reasons (TIME_LIMIT, NOT_ALLOWED, OUTSIDE_HOURS, DIFFICULTY_EXCEEDED); `DifficultySelector` respects `maxDifficulty`
- **Dual-Layout Routing:** Parent (`/games/*`) and child (`/child/games/*`) layouts; child routes via `ChildProtectedRoute`

**Game Types (Phase 1):** Term Match, Speed Quiz, Flashcard Flip, Daily Challenge, Escape Room, Maze Navigator

**API Contracts:** All follow `ApiResponse<T>` pattern; key endpoints: `/games/available`, `/games/:gameId/sessions`, `/games/sessions/:sessionId/rounds`, `/games/daily-challenge`, `/games/leaderboards`, `/games/scores`, `/games/achievements`, `/family/members/:memberId/game-settings`

**Files:** 34 files, 3667 lines; build clean

---

### 7. Games Engine Detailed Design (2026-05-17)
**Author:** Khaldun (Lead Architect)  
**Status:** PROPOSAL — Implementation blueprint  
**Reference:** Full 2960-line document at `.squad/decisions/inbox/khaldun-games-detailed-design.md`

Comprehensive implementation blueprint for Games feature specifying all game types, data models, engine architecture, auto-generation pipeline, API design, frontend components, placement strategy, gamification layer, and testing strategy.

**Summary:**
- **Game Type Catalog:** 15 types total (8 course-integrated, 6 standalone/hub, 1 shared); Phase 1 focuses on 5 core types with auto-generated content
- **Data Model:** 14 Prisma models (Game, GameSession, GameScore, GameRound, Leaderboard, Achievement, UserAchievement, StreamAchievement, UserStreakRecord, BadgeDefinition, parental control models)
- **Auto-Generation Pipeline:** Extract content from existing Questions, FlashCards, ArabicTerms; difficulty-tier mapping; age-aware presentation (EARLY_CHILD with hints → TEEN/ADULT timed mode)
- **Engine Architecture:** Content selection (SRS-priority), session lifecycle, SM-2 SRS writeback, streak tracking, scoring with multipliers, achievement triggers, daily challenge seeding
- **Placement Strategy:** Course-integrated games embed within Units; standalone games accessible via Games Hub; visual cues distinguish game availability
- **Gamification:** Streaks, badges, leaderboards, XP progression, daily challenges; achievement system with 11 trigger types
- **Phase 1 Scope:** 5 game types (Term Match, Speed Quiz, Flashcard Flip, Daily Challenge, Word Search) + auto-generated content only
- **Phase 2 Scope:** Remaining game types, manual scenario authoring, social features, email digests; scope creep risk identified

**Key Principles:**
- 100% content auto-generated from existing platform data (Phase 1)
- Games count as SRS reviews, reducing review burden (engagement lever)
- Difficulty scaling: 3 tiers mapped to age categories and content metadata
- Parental control enforcement at session start

---

### 9. Test Suite Architecture & CI Convention (2026-05-20)
**Author:** Biruni (Tester)  
**Status:** IMPLEMENTED

Comprehensive automated regression testing targeting critical production failure modes (auth refresh loops, rate limiter blocking, SSML errors, broken image paths).

**Key Decisions:**
- **Backend unit tests mock all external services** (Prisma, Redis, Azure Speech) — runnable without infrastructure
- **Integration tests excluded from default `vitest run`** via `--exclude="**/integration/**"`; only run in CI with test database
- **SSML tests duplicate buildSsml() logic** — validates contract independently from implementation
- **Frontend auth tests validate refresh-loop-prevention pattern** (isRefreshing, subscriber queue, _retry, authApi separation)
- **CI scripts:** `test:ci` runs `vitest run --reporter=verbose`; backend adds `--forceExit` for safety

**Impact:** 244 new tests (202 backend + 42 frontend); all passing; critical production bugs now covered.

---

### 10. Game Start API – Object Params with Fallback gameType (2026-05-18)
**Author:** Ibn Sina (Frontend)  
**Status:** IMPLEMENTED

Refactored `gameService.startGame()` from positional args to single params object to handle missing `gameId` gracefully.

**Key Decisions:**
- **Params object:** `{ gameId?: string; gameType?: string; memberId: string; courseId?: string; difficulty: GameDifficulty }`
- **gameType derivation:** `useGameRunner` derives `gameType` from URL slug via `SLUG_TO_TYPE`, ensuring backend always gets valid identifier
- **Truthy-only inclusion:** Only non-null values included in request body
- **No game row case:** New courses without pre-existing Game row can start via `gameType` + `courseId`

**Impact:** All 9 game components work without changes; courses without Game rows now functional.

---

### 11. Auth Refresh Loop Prevention Pattern (2026-05-20)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED

All auth-critical API calls MUST use separate `authApi` axios instance without response interceptor.

**Key Decisions:**
- **Separate authApi instance** — bare axios (no interceptors) used exclusively by `refreshToken()` and `logout()`
- **isRefreshing flag** — prevents concurrent refresh attempts; queues 401 responses during in-flight refresh
- **No-token shortcut** — if both tokens null, redirect to login immediately
- **Backend exemption** — `/auth/logout` and `/auth/refresh` excluded from auth rate limiter via `skip` function

**Rationale:** Main instance's 401 interceptor calling `refreshToken()` on main instance → infinite loop → rate limiter blocks user.

**Impact:** Frontend: `api.ts`, `authService.ts`; Backend: `index.ts` (rate limiter config).

---

### 12. CI/CD Pipeline with Test Gates (2026-05-20)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED

Two-workflow GitHub Actions setup with automated test gates preventing unvalidated deployments.

**Key Decisions:**
- **`ci-cd.yml`** — Full pipeline on push to `main` and PRs; tests must pass before deploy
- **`test.yml`** — Lightweight PR-only workflow (tests + lint) for fast feedback
- **Deploy gated:** `needs: [test-backend, test-frontend]` — if either fails, no deployment
- **Vitest in CI mode** — `vitest run --reporter=verbose`, no watch mode
- **Prisma generate in CI** — required before tests (generated client not committed)
- **Parallel test jobs** — independent for speed
- **Separate test-only workflow** — PRs get fast feedback without deploy noise

**Action Required:** Add secrets (`AZURE_CREDENTIALS`, `SWA_DEPLOYMENT_TOKEN`); enable branch protection on `main`.

**Impact:** No code reaches production without passing tests; PRs show pass/fail inline.

---

### 13. TTS SSML Chunking — Voice Element Limit Fix (2026-05-20)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED

Azure Speech Service rejects SSML with >50 `<voice>` elements. Chunked voices into groups of ≤25 per request.

**Key Decisions:**
- **Chunk size:** 25 voice elements per SSML request (50% headroom under 50-element limit)
- **buildVoiceElements()** returns raw voice strings (decoupled from `<speak>` wrapper)
- **chunkSsmlElements()** splits into groups of 25, wraps each in valid `<speak>` document
- **Sequential synthesis** with 200ms inter-chunk delay (rate limit courtesy)
- **Per-chunk retry:** Up to 2 retries with 400ms backoff on failure
- **MP3 concatenation:** Frames self-contained, no re-encoding needed
- **synthesizeToFile exported:** Shared by both audiobook endpoint and video narration

**Files Changed:** `backend/src/services/tts.service.ts`, `backend/src/services/videoService.ts`

**Commit:** `01c5163` — `fix: chunk TTS SSML to stay under 50 voice-element limit`

---

### 14. TTS/Audiobook Backend Implementation (2026-05-20)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED

Implemented TTS/Audiobook API following pre-generation model with SSML chunking and bilingual support.

**Key Decisions:**
- **Endpoint:** `POST /api/v1/units/:unitId/audio` with `{ language: "ar" | "en", contentBlockId?: string }`
- **Behavior:** Returns cached URL if exists; synthesizes on-demand and caches otherwise
- **Voice Selection:** Arabic: `ar-SA-HamedNeural` (MSA, educational); English: `en-US-JennyNeural` (natural, clear)
- **Bilingual:** SSML `<lang>` tag switches voice mid-narration for inline Arabic
- **Storage (Phase 1):** Local filesystem `public/audio/{unitId}-{language}-{blockIndex}.mp3`; served as static files
- **Caching:** `AudioCache` Prisma model with `@@unique([unitId, language, blockIndex])`; `blockIndex=-1` for full-unit
- **Azure Resource:** `speech-islamic-learning` (F0 free tier, 5 hours/month, centralus region)

**Files Created/Modified:**
- `backend/src/services/tts.service.ts` — synthesis engine
- `backend/src/controllers/audio.controller.ts` — request validation
- `backend/src/routes/audio.routes.ts` — route registration
- `backend/src/config/index.ts` — Azure Speech config
- `backend/prisma/schema.prisma` — AudioCache model
- `.env.example` — documented env vars

**Team Notes:** First call per unit/language takes 2–5s (synthesis); subsequent calls instant (cached). Phase 3 will integrate licensed Quran recitation.

---

### 15. Round Metadata Must Match Frontend Destructuring (2026-05-18)
**Author:** Khwarizmi  
**Status:** IMPLEMENTED  
**Commit:** `60e7e41`

Backend round metadata field names are dictated by frontend component destructuring.

**Key Decisions:**
- **WORD_SEARCH:** Added `targetWords` field (frontend reads `c.targetWords`); kept `words` for backward-compat. Grader accepts `{ foundWords }` submission shape.
- **CLOZE:** Restructured from multi-blank-per-round (`sentence` + `blanks[]`) to one-blank-per-round (`questionText` with `{blank}` marker, `correctAnswer` string, `options` array). Matches frontend single-input-per-round UX.
- **Contract:** Frontend component destructuring IS the contract; backend formatters must match exactly.

**Impact:** Both games work with existing frontend components; no frontend changes needed. Future game types must read frontend destructuring before writing backend formatter.

---

### 16. Pre-Generated Audio with Synchronized Text Highlighting — Architecture Design (2026-05-20)
**Author:** Khaldun (Lead Architect)  
**Status:** PROPOSAL — Architecture Decision

Comprehensive design for pre-generated audio files with real-time text highlighting (karaoke-style), addressing timeout errors, lack of text sync, and repetitive TTS calls.

**Key Decisions:**

#### Data Model — Word-Level Timestamps Storage
- **Extend audioCache** with new `textSync` column containing word boundary metadata
- **TextSync JSON Schema:** `{ version: "1.0", words: WordBoundary[], chunkOffsets?: ChunkOffset[] }`
- **WordBoundary fields:** `wordIndex`, `text`, `textWithDiacritics`, `startMs`, `endMs`, `sectionId`, `language`
- **Rationale:** Keeps audio + metadata atomic; word boundaries always generated alongside audio

#### Pre-Generation Pipeline — Background Job
- **Queue:** Bull/Redis with admin UI trigger (no automatic generation initially)
- **Stages:** Trigger → Fetch → Split → Generate → Align → Store → Notify
- **Per-chunk retry:** Up to 2 retries with exponential backoff
- **Job Payload:** `{ unitId, language, voiceId, sections[], priority, triggeredBy }`

#### Timestamp Format — Cumulative Offsets
- **Word-level granularity** — enables individual word highlighting during playback
- **Chunk offset tracking** — allows re-generation strategy changes without breaking alignment
- **Diacritics preservation** — Arabic stored with diacritics for accurate display

#### API Contract — Frontend-Facing Endpoints
- **GET `/api/v1/content/units/:unitId/audio`** — returns pre-gen audio + sync data; 412 if not ready (can auto-trigger job)
- **GET `/api/v1/content/units/:unitId/audio/fallback`** — streams on-demand TTS (no sync data)
- **Signed URLs** — Azure Blob SAS tokens for security
- **Cache Headers** — Long TTL (1 year) on static blob URLs

#### Arabic Handling — RTL, Diacritics, Word Splitting
- **Preserve diacritics in storage**, use unicode word segmentation, render with RTL CSS
- **Strip diacritics for matching logic** — separates display text from match/search logic
- **Frontend:** CSS `direction: rtl` for Arabic sections; `textWithDiacritics` for display

#### When Pre-Generation Happens
- **Primary:** Manual admin trigger via admin UI
- **Phase 2:** Auto-trigger on unit publish
- **Cost control:** Admin chooses which units to pre-generate

#### Testing Strategy
- **Unit tests:** Word boundary extraction, cumulative offset calculation, diacritics handling, TextSync schema validation
- **Integration tests:** End-to-end pre-gen job, audio + sync stored correctly, fallback TTS works
- **E2E (Frontend):** Real-time highlighting, Arabic RTL rendering, instant seek sync, speed changes

#### Migration Path
1. Deploy audioCache schema (no breaking change)
2. Deploy background job service
3. Deploy admin endpoints (auth-gated)
4. Deploy frontend components (feature-flagged)
5. Enable feature flag (gradual rollout)

**Phase 1 Scope:** AudioCache extension, background job pipeline, word boundary extraction, API endpoints, frontend AudioPlayer/TextHighlight, Arabic handling, cumulative offset strategy

**Deferred to Phase 2:** Auto-trigger on publish, batch pre-gen UI, cost analytics, Redis in-memory sync, CDN integration

**Risks:** Word boundary extraction timing data accuracy, audio concatenation frame boundaries, re-generation strategy changes.

---

### 17. Multimodal Architecture — Video Generation & TTS/Audiobook (2026-05-20)
**Author:** Khaldun (Lead Architect)  
**Status:** PROPOSAL — Pending team review

Comprehensive multimodal feature design addressing high-value requests for automatic video generation and TTS/audiobook with full Arabic support.

**Feature 1: Automatic Video Generation**

#### Options Considered
- **Option A (Avatar APIs):** HeyGen, D-ID, Synthesia, Azure TTS Avatar — Rejected due to Islamic appropriateness concerns (realistic human representations) and content control limitations
- **Option B (Text-to-Video AI):** Sora, Runway, Pika, Kling — Rejected (no Arabic rendering, poor educational content control, expensive)
- **Option C (Narrated Slide-Deck):** RECOMMENDED — Programmatic construction from unit content

#### Option C: Narrated Slide-Deck Video (Recommended)
- **Components:** Azure AI Speech TTS → MP3 narration; Puppeteer (headless Chrome) → PNG slides; ffmpeg → MP4 video
- **Video structure:** Title card + content slides (key paragraphs) + Arabic term slides + summary
- **Advantages:** Full Arabic text fidelity, Islamically appropriate (no human images, geometric art), controllable, cheap (~TTS cost only), works offline
- **Slide format:** 1280×720 HD, 25fps; Islamic geometric backgrounds (CC0); Noto Naskh Arabic + Inter fonts
- **Timing:** Each slide duration = audio segment duration; SSML `<bookmark>` tags for word-level timing

#### Generation Trigger & Frequency
- **Trigger:** Content-admin action ("Generate Video" button), not automatic
- **Frequency:** Once per unit, on content publish; re-generated if content changes (hash-based invalidation)
- **Background processing:** PostgreSQL-backed job table; worker loop in Container App (MVP uses async worker thread)
- **Storage:** `media/videos/{unitId}/{hash}.mp4` in Azure Blob Storage (Hot tier); publicly readable via CDN

**Feature 2: TTS / Audiobook**

#### Pre-generate vs. On-the-Fly Analysis
- **Pre-generate:** Zero latency (CDN), no per-user API calls, predictable cost, works offline
- **Decision: Pre-generate** — content stable; cost of Blob Storage ($0.018/GB/month) negligible at scale

#### Arabic Language Strategy
- **Arabic content:** `ar-SA-HamedNeural` (male, MSA, educational)
- **Arabic terms in English:** SSML `<lang xml:lang="ar-SA">` tag switches voice mid-narration
- **English:** `en-US-JennyNeural` or `en-US-GuyNeural`
- **Quranic recitation note:** NOT suitable for TTS; either skip Arabic ayat in audio or use disclaimer. Phase 3 integrates licensed recitation (EveryAyah.com API or Quran.com)

#### "Listen" Button UX Flow
1. Click "Listen" button on Unit page (language toggle: EN/AR)
2. Fetch pre-generated MP3 from `/api/v1/units/:unitId/audio`
3. If READY: stream from CDN (immediate); if PENDING/GENERATING: show "being prepared" message; if FAILED: retry option
4. Minimal floating player: play/pause, speed control (0.75×/1×/1.5×/2×), progress bar

#### Data Model Changes
- **Extend AudioResource:** Add `language`, `voiceId`, `status`, `textHash`, `sizeBytes`, `generatedAt`, `errorMessage`
- **Extend VideoResource:** Add `generationType` (MANUAL|SLIDE_DECK|AVATAR), `status`, `textHash`, `sizeBytes`, `generatedAt`, `errorMessage`
- **New MediaGenerationJob:** Track async generation jobs (QUEUED|PROCESSING|DONE|FAILED)
- **Extend UnitProgress:** Add `audioListened` boolean

#### New Azure Resources Required
- **Azure AI Speech (S0 tier):** TTS for audio generation + batch avatar (Phase 3). F0 free tier: 0.5M neural chars/month (dev/low usage); S0 production: pay-as-you-go
- **Azure Blob Storage `media` container:** Hot tier, LRS redundancy, public read for CDN; sub-paths: `media/audio/{unitId}/`, `media/video/{unitId}/`
- **Azure CDN (Standard Microsoft):** Low-latency global MP3/MP4 delivery; far-future cache headers (1 year) for hash-addressed files
- **No new compute Phase 1–2:** Backend Container App gains `MediaGenerationService` + `SlideRenderService`; Puppeteer/ffmpeg added to Dockerfile; may need resource increase (1→2 vCPU, 2→4 GB RAM) for video generation

#### Cost Estimates
- **TTS one-time:** 200 units × 10K chars = 2M chars ≈ $32 (free tier saves ~$8); **net ~$24**
- **Blob storage:** 1 GB audio (200×5MB) ≈ $0.018/mo; 10 GB video Phase 2 ≈ $0.18/mo; **total ~$0.20/mo**
- **CDN delivery:** 100 learners × 10 units/week × 5MB audio = 5GB/week ≈ 20GB/mo ≈ $1.74/mo
- **Phase 2 (audio+video):** 100 learners + 50MB videos ≈ +200GB/mo ≈ $17.40/mo
- **Phase 1 total:** ~$2–5/mo at 100 learners; **Phase 2 total:** ~$20–25/mo

#### Implementation Phases

**Phase 1: TTS Audiobook (4–6 days)**
- Provision Azure AI Speech (S0); store key in Key Vault
- `MediaGenerationService.generateAudio()`: strip HTML → plain text → SSML build → Azure TTS → MP3 → Blob Storage
- Job queue: `POST /api/v1/admin/units/:unitId/generate-audio`; `GET /api/v1/units/:unitId/audio`
- Schema extension (migration)
- Frontend: AudioPlayer component, "Listen" button, language toggle, status polling
- Admin trigger: Directus "Generate Audio" action; bulk action per course

**Phase 2: Slide-Deck Video Generation (1–2 weeks)**
- Add Puppeteer + Chrome Headless + ffmpeg to Dockerfile
- `SlideGenerationService`: parse content HTML → slide scripts → Puppeteer render PNGs → per-slide TTS → ffmpeg assemble
- Increase Container App resources (2 vCPU/4 GB RAM)
- Schema extensions (migration)
- Video template design (geometric art, Arabic fonts, 1280×720 HD, 25fps)
- Progress tracking: `videoCompleted` in UnitProgress

**Phase 3: Per-Term Audio + Quranic Integration (Future)**
- Pre-generate TTS for each `ArabicTerm.audioUrl`
- Licensed Quran recitation (EveryAyah.com or Quran.com APIs)
- Optional: Azure TTS Avatar for admin-created premium content (opt-in disclosure)
- Offline download: package audio/video for PWA

#### Open Questions
1. **Admin trigger vs. auto-trigger:** Explicit trigger (Phase 1) or auto-generate on publish (Phase 2)?
2. **Arabic voice gender:** Preferences per member (male/female) or universal default?
3. **Video backgrounds:** Curate ~20 CC0 Islamic geometric art images for Phase 2
4. **Container App sizing:** Video generation worker isolation (dedicated Container App job, scale-to-zero) or main container?
5. **Multilingual expansion:** Urdu (`ur-PK-AsadNeural`) for South Asian audience — Phase 3 roadmap

**Key Principles:**
- Full Arabic text fidelity (RTL, diacritics, Quranic fonts)
- Islamically appropriate (no photorealistic avatars)
- Cost-viable (TTS ~$24 one-time, ~$2–25/mo ongoing)
- Works offline/PWA-friendly

**Risks:** Arabic quality on classical text (test ar-SA-HamedNeural first), Puppeteer/ffmpeg image size + startup (mitigate with dedicated worker Phase 2), content changes invalidate cache (use textHash), viral traffic CDN costs (cheap + caching means minimal Blob egress), user expectations on Quran recitation (clear UI label "AI-generated").

---

### 22. TTS Prosody Fragmentation Fix (2026-05-20)
**Author:** Khwarizmi (Backend Dev)
**Component:** `backend/src/services/tts.service.ts` — `buildVoiceElements()`
**Status:** Implemented

English audio narration was reading "one word at a time with pauses" because `buildVoiceElements()` created a separate `<voice>` element for every Arabic fragment, no matter how small. Azure Speech resets prosody at each voice boundary, causing audible gaps.

**Key Decisions:**
- **Removed `\s` from Arabic regex** — whitespace no longer gets captured as Arabic, preventing spurious fragmentation.
- **4-word threshold** — Arabic segments with ≤4 words stay inline within the English voice element. Only substantial passages (>4 words) trigger a voice switch to `ar-SA-HamedNeural`. Covers 99% of cases (inline terms like "wudu", "الوضوء", "salah").
- **Prosody boost:** English voice elements get 5% speed boost (`<prosody rate="1.05">`) to address "too slow" feedback.

**Trade-off:** Short Arabic terms rendered by English voice won't have perfect Arabic pronunciation. Accepted because fluency >> isolated accuracy for learning content.

---

### 19. Route-level Lazy Loading + Inline Modals for Pre-Auth Pages (2026-05-21)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Two frontend issues required structural changes:

1. The "Add a learner" button tried to navigate to `/settings` but got blocked by `ProtectedRoute` (requires `selectedMember`).
2. Initial page load was ~507kB — all routes eagerly imported.

**Key Decisions:**
- **Inline modal pattern:** Pages rendered before a member is selected (like `/select-learner`) cannot navigate to protected routes. Actions like "Add a learner" use inline modals that call the API directly.
- **Rule:** If a page exists outside the `ProtectedRoute` wrapper, it must be self-contained — no navigating to protected pages.
- **Lazy loading convention:** Eager imports: Layouts, LoginPage, RegisterPage, SelectLearner (critical path). Lazy imports: Everything else via React.lazy().
- **Vite code splitting:** Manual chunks: vendor-react, vendor-state, vendor-ui, vendor-content.

**Impact:** Initial bundle: 507kB → 45kB (91% reduction). "Add a learner" now functional without navigating away.

---

### 21. Coursebook Images — Served from Azure Blob Storage (2026-05-21)
**Author:** Khwarizmi (Backend Dev)
**Status:** Implemented

Coursebook images (~188MB in `public/coursebook-images/`) were excluded from Docker builds via `.dockerignore` to keep image size manageable. This broke image display in production for all Maktab courses.

**Key Decisions:**
- Serve coursebook images from Azure Blob Storage instead of bundling them in Docker.
- **Storage:** Account `stislamiclearning`, new container `coursebook-images`, public blob access.
- **URL pattern:** https://stislamiclearning.blob.core.windows.net/coursebook-images/{filename}
- **Backend:** `/coursebook-images/*` route redirects to blob storage in production, serves locally in dev. Course controller rewrites `src="/coursebook-images/..."` → direct blob URL.

**Impact:** No database migration or frontend changes required. Image paths in DB content remain relative; URLs rewritten server-side.

---




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


