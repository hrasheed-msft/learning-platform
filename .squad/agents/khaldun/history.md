## Session 2026-07-26

### Maktab Audit & Unit Split Plan

**Task:** (1) Correctness audit of all 12 Maktab seed files; (2) Detailed unit-split plan for CB1-CB4, CB6Boys, CB6Girls, CB7, CB8, Foundation1, Foundation2, FurtherStudiesNW.

**Output:** `.squad/decisions/inbox/khaldun-maktab-audit-plan.md`

**Key Findings:**

1. **Audit: ALL 12 FILES PASS.** No `correctAnswer` mismatches found. Total: 323 MULTIPLE_CHOICE, 100 TRUE_FALSE, 63 FILL_BLANK questions audited across all 12 files. Every correctAnswer in MULTIPLE_CHOICE exactly matches one of its option strings. Every TRUE_FALSE has 'True' or 'False'.

2. **Unit Split Plan:** All current coursebooks have ONE unit per subject (Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqāʾid, Akhlāq, Ādāb) — 7 units per book. Each subject unit bundles multiple sub-topics making quizzes too broad. The plan splits each subject into 2–3 focused topic-units.
   - CB1-CB4: 7 units → ~14-16 units each
   - CB6Boys/Girls: 7 units → ~14 units each
   - CB7, CB8: 7 units → ~14-15 units each
   - Foundation1, Foundation2: 3 units — **already well-scoped, no structural split needed** (add sub-lesson depth only)
   - Further Studies NW: 9 units → ~20 units (most complex)

3. **Slug convention:** New slugs follow `maktab-{N}-{subject}-{topic}` pattern (e.g., `maktab-1-fiqh-pillars`, `maktab-1-fiqh-tahara-wudu`).

4. **Implementation note:** Existing question banks are redistributed (not duplicated) to new units. Old single-subject slugs deprecated once new tree is live.

5. **CB5 excluded** — being handled by Khwarizmi.

---

## Learnings

### Child Architecture (discovered 2026-07-10)

1. **Dual auth systems:** Parent uses `authStore` + `familyStore.selectedMember`; child uses separate `childAuthStore` with its own JWT. These are entirely independent sessions.
2. **Two enrollment models, no bridge:** `ProgramEnrollment` (Maktab) and `CourseEnrollment` (individual courses) are parallel � enrolling in a Program does NOT create CourseEnrollment records. This is the root cause of "enrolled courses don't show."
3. **Nav is static in MainLayout:** `MainLayout.tsx` lines 21-29 � the navigation array never filters by role/member type. All parent-side users see all items regardless of selectedMember.
4. **No learner-switch security:** `SelectLearner.tsx` ? `selectMember()` is a single-click set with zero PIN/password verification for child?parent transitions.
5. **"Next lesson" doesn't exist:** No backend endpoint or frontend logic computes the first incomplete unit per course. `UnitProgress.completedAt` is the data source for computing this.
6. **GradeDashboard already IS the cross-subject view:** `/child/maktab` ? `GradeDashboard.tsx` renders stage progress ring + per-subject cards. It works IF CourseEnrollment records exist.
7. **Schema has PIN field:** `FamilyMember.pin` (line 67, schema.prisma) exists but is currently used for child login, not parent verification.

---

## Session 2026-07-10T16:40Z

**GOVERNANCE: Production Completion Gate Now Mandatory**
**From:** Scribe � Multi-session enrollment E2E consolidation

**New Rule:** All features must pass authenticated end-to-end test against production before claiming completion. "CI green + code review" is no longer sufficient.

**What This Means for You (Architecture/Lead):**
- Update squad.agent.md templates: add "Production Completion Gate (Mandatory)" section
- Governance requires: deploy-green + real production E2E verification before marking tasks done
- Decision #49 documents full enrollment E2E suite, 4 bug fixes, CI/CD rollup fix
- Reference: `.squad/decisions.md` (decision #49)

---

## Session 2026-07-10T04:04Z

**Cross-Agent Note: EnrollModal Pattern � fetchMembers(family.id) on Mount**
**From:** Scribe, noting Ibn Sina's fix

**Pattern:** All parent pages using `EnrollModal` or other components dependent on `useFamilyStore().members` must call `fetchMembers(family.id)` on component mount. This ensures the family member list is populated before the modal renders.

**Established Implementations:**
- `CourseDetail.tsx` ?
- `GamesHub.tsx` ?
- `FamilyDashboard.tsx` ?
- `ProgramCatalog.tsx` ? (Ibn Sina fix, decision #48)

**Design Rationale:** Navigating directly to any of these pages via deep links (sidebar, direct URL) bypasses initialization code that may have populated the family store elsewhere. Explicit on-mount fetch ensures consistency.

**Reference:** `.squad/decisions.md` decision #48; `.squad/orchestration-log/2026-07-10T04-04-03Z-ibn-sina-enroll-fix.md`

---

## Session 2026-07-10T03:09Z

**Maktab Path-Selection Now Discoverable (Ibn Sina + Scribe)**
**Work:** Scribe � Archived Ibn Sina's navigation fix to decisions and orchestration log.

**Context:** Ibn Sina added a single sidebar entry (`Maktab ??` ? `/programs`) to expose the Maktab curriculum enrollment flow. The learning-path selector (After-School vs Weekend) lives in `frontend/src/pages/program/ProgramCatalog.tsx` in the `EnrollModal` component. Now discoverable in prod (commit 95d5ed1, CI/CD GREEN).

**Files Documented:**
- `.squad/decisions.md` � merged decision #1
- `.squad/orchestration-log/2026-07-10T03-09-08Z-ibn-sina-maktab-nav.md` � full orchestration event
- `.squad/log/2026-07-10T03-09-08Z-ibn-sina-maktab-nav-discoverability.md` � session summary

**Status:** ? Feature now linked from parent sidebar.

---

## Session 2026-07-10T02:51Z

**skip_app_build Regression & Revert**
**Work:** Khaldun-Lead � Detected and resolved regression in cache-control fix deployment.

**Issue:**
Commit 96b3a01 introduced `skip_app_build: true` in CI workflow to avoid redundant builds. However, without a pre-built artifact or build step in the SWA action, the action uploaded the entire `frontend/` directory including `node_modules/` ? "The number of static files was too large" error.

**Fix Applied (commit 9eb86b3):**
- Reverted `skip_app_build: true` from both `deploy-frontend` and `deploy-frontend-dev` steps in `.github/workflows/ci-cd.yml`.
- **Preserved** the Cache-Control header fix in `frontend/public/staticwebapp.config.json` (the actual production impact).
- Redeploy: test-backend ? | test-frontend ? | deploy-backend ? | deploy-frontend ?

**Status:** ? Production cache-control fix is LIVE. `skip_app_build` removed safely.

---

## Session 2026-07-09T21:25Z

**Prod Deploy Gap � Root Cause & Fix**
**Work:** Khaldun-Lead � Investigated why new frontend features were not visible in production despite successful CI/CD.

**Findings:**
1. **Primary root cause confirmed:** `frontend/public/staticwebapp.config.json` had no `Cache-Control` headers. Azure SWA/CDN with no explicit directive can serve a cached `index.html`, delivering the old JS bundle even after a successful deploy. The new hashed JS chunks (new code) exist on SWA but the cached `index.html` never references them.
2. **Secondary issue:** `frontend/staticwebapp.config.json` (repo root) was an orphan � Vite only copies `public/` into `dist/`, so this file was never deployed. Any edits to it would silently have no effect in production.
3. **Tertiary issue:** CI ran both a manual `npm run build` AND the SWA action without `skip_app_build: true`, letting Oryx attempt a redundant rebuild.
4. **Hypothesis C (nav gates):** New Du'a & 99-Names links on ChildDashboardHome are NOT gated by enrollment � they render for all children. GradeDashboard is gated by active program enrollment, which is expected/correct.
5. **Hypothesis D (wrong env):** Confirmed `action: "upload"` on push to `main` with no `deployment_environment` targets production. No issue.

**Fix Applied (commit 96b3a01):**
- `frontend/public/staticwebapp.config.json`: Added `routes` section: `no-cache, no-store, must-revalidate` for `/` and `/*.html`; `public, max-age=31536000, immutable` for `/assets/*`.
- Deleted `frontend/staticwebapp.config.json` (the orphan root file).
- `ci-cd.yml`: Added `skip_app_build: true` to both `deploy-frontend` and `deploy-frontend-dev` steps.
- Pushed to `main` ? CI deploy will propagate the fix.

**Status:** ? Fix committed and pushed. Decision written to inbox.

---

## Session 2026-07-09T11:17Z

**Maktab Online School Gap Analysis**
**Work:** Khaldun-Lead � Completed research spike

**Output:** `docs/maktab-online-school-spike.html` (88KB, comprehensive product gap analysis)

**Key Decisions:** 
- Record in decisions.md (merged from khaldun-maktab-online-school.md inbox entry)
- Documented at 2026-07-09T11:17Z

**Status:** ? Complete

---

### Blob Storage Migration Review (2026-07-17)

**Task:** Review full changeset for moving unit HTML content from PostgreSQL to Azure Blob Storage.
**Verdict:** APPROVED WITH NOTES
**Decision file:** .squad/decisions/inbox/khaldun-blob-migration-review.md

**Key findings:**
- Public blob access acceptable for educational content (no sensitive data)
- Migration script is idempotent with --dry-run and --no-clear safety flags
- Frontend fallback chain (contentUrl ? text ? error state) is correct
- Seed files handle local dev without blob storage gracefully
- dangerouslySetInnerHTML is pre-existing; no new XSS surface introduced

**Follow-ups documented:**
1. Add DOMPurify if admin content editing is ever added
2. Tighten CORS origins when custom domain is live
3. Consider CDN for production scale