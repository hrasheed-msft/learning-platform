## Session 2026-07-10T04:04Z

**Cross-Agent Note: EnrollModal Pattern — fetchMembers(family.id) on Mount**
**From:** Scribe, noting Ibn Sina's fix

**Pattern:** All parent pages using `EnrollModal` or other components dependent on `useFamilyStore().members` must call `fetchMembers(family.id)` on component mount. This ensures the family member list is populated before the modal renders.

**Established Implementations:**
- `CourseDetail.tsx` ✓
- `GamesHub.tsx` ✓
- `FamilyDashboard.tsx` ✓
- `ProgramCatalog.tsx` ✓ (Ibn Sina fix, decision #48)

**Design Rationale:** Navigating directly to any of these pages via deep links (sidebar, direct URL) bypasses initialization code that may have populated the family store elsewhere. Explicit on-mount fetch ensures consistency.

**Reference:** `.squad/decisions.md` decision #48; `.squad/orchestration-log/2026-07-10T04-04-03Z-ibn-sina-enroll-fix.md`

---

## Session 2026-07-10T03:09Z

**Maktab Path-Selection Now Discoverable (Ibn Sina + Scribe)**
**Work:** Scribe — Archived Ibn Sina's navigation fix to decisions and orchestration log.

**Context:** Ibn Sina added a single sidebar entry (`Maktab 🕌` → `/programs`) to expose the Maktab curriculum enrollment flow. The learning-path selector (After-School vs Weekend) lives in `frontend/src/pages/program/ProgramCatalog.tsx` in the `EnrollModal` component. Now discoverable in prod (commit 95d5ed1, CI/CD GREEN).

**Files Documented:**
- `.squad/decisions.md` — merged decision #1
- `.squad/orchestration-log/2026-07-10T03-09-08Z-ibn-sina-maktab-nav.md` — full orchestration event
- `.squad/log/2026-07-10T03-09-08Z-ibn-sina-maktab-nav-discoverability.md` — session summary

**Status:** ✅ Feature now linked from parent sidebar.

---

## Session 2026-07-10T02:51Z

**skip_app_build Regression & Revert**
**Work:** Khaldun-Lead — Detected and resolved regression in cache-control fix deployment.

**Issue:**
Commit 96b3a01 introduced `skip_app_build: true` in CI workflow to avoid redundant builds. However, without a pre-built artifact or build step in the SWA action, the action uploaded the entire `frontend/` directory including `node_modules/` → "The number of static files was too large" error.

**Fix Applied (commit 9eb86b3):**
- Reverted `skip_app_build: true` from both `deploy-frontend` and `deploy-frontend-dev` steps in `.github/workflows/ci-cd.yml`.
- **Preserved** the Cache-Control header fix in `frontend/public/staticwebapp.config.json` (the actual production impact).
- Redeploy: test-backend ✅ | test-frontend ✅ | deploy-backend ✅ | deploy-frontend ✅

**Status:** ✅ Production cache-control fix is LIVE. `skip_app_build` removed safely.

---

## Session 2026-07-09T21:25Z

**Prod Deploy Gap — Root Cause & Fix**
**Work:** Khaldun-Lead — Investigated why new frontend features were not visible in production despite successful CI/CD.

**Findings:**
1. **Primary root cause confirmed:** `frontend/public/staticwebapp.config.json` had no `Cache-Control` headers. Azure SWA/CDN with no explicit directive can serve a cached `index.html`, delivering the old JS bundle even after a successful deploy. The new hashed JS chunks (new code) exist on SWA but the cached `index.html` never references them.
2. **Secondary issue:** `frontend/staticwebapp.config.json` (repo root) was an orphan — Vite only copies `public/` into `dist/`, so this file was never deployed. Any edits to it would silently have no effect in production.
3. **Tertiary issue:** CI ran both a manual `npm run build` AND the SWA action without `skip_app_build: true`, letting Oryx attempt a redundant rebuild.
4. **Hypothesis C (nav gates):** New Du'ā & 99-Names links on ChildDashboardHome are NOT gated by enrollment — they render for all children. GradeDashboard is gated by active program enrollment, which is expected/correct.
5. **Hypothesis D (wrong env):** Confirmed `action: "upload"` on push to `main` with no `deployment_environment` targets production. No issue.

**Fix Applied (commit 96b3a01):**
- `frontend/public/staticwebapp.config.json`: Added `routes` section: `no-cache, no-store, must-revalidate` for `/` and `/*.html`; `public, max-age=31536000, immutable` for `/assets/*`.
- Deleted `frontend/staticwebapp.config.json` (the orphan root file).
- `ci-cd.yml`: Added `skip_app_build: true` to both `deploy-frontend` and `deploy-frontend-dev` steps.
- Pushed to `main` → CI deploy will propagate the fix.

**Status:** ✅ Fix committed and pushed. Decision written to inbox.

---

## Session 2026-07-09T11:17Z

**Maktab Online School Gap Analysis**
**Work:** Khaldun-Lead — Completed research spike

**Output:** `docs/maktab-online-school-spike.html` (88KB, comprehensive product gap analysis)

**Key Decisions:** 
- Record in decisions.md (merged from khaldun-maktab-online-school.md inbox entry)
- Documented at 2026-07-09T11:17Z

**Status:** ✅ Complete
