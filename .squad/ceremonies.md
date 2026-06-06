# Ceremonies

> Team meetings that happen before or after work. Each squad configures their own.

## Design Review

| Field | Value |
|-------|-------|
| **Trigger** | auto |
| **When** | before |
| **Condition** | multi-agent task involving 2+ agents modifying shared systems |
| **Facilitator** | lead |
| **Participants** | all-relevant |
| **Time budget** | focused |
| **Enabled** | ✅ yes |

**Agenda:**
1. Review the task and requirements
2. Agree on interfaces and contracts between components
3. Identify risks and edge cases
4. Assign action items

---

## Retrospective

| Field | Value |
|-------|-------|
| **Trigger** | auto |
| **When** | after |
| **Condition** | build failure, test failure, or reviewer rejection |
| **Facilitator** | lead |
| **Participants** | all-involved |
| **Time budget** | focused |
| **Enabled** | ✅ yes |

**Agenda:**
1. What happened? (facts only)
2. Root cause analysis
3. What should change?
4. Action items for next iteration


---

## Retrospective with Enforcement

| Field | Value |
|-------|-------|
| **Trigger** | auto |
| **When** | weekly |
| **Condition** | No *retrospective* log in .squad/log/ within the last 7 days |
| **Facilitator** | lead |
| **Participants** | all |
| **Time budget** | focused |
| **Enabled** | yes |
| **Enforcement skill** | retro-enforcement |

**Agenda:**
1. What shipped this week? (closed issues, merged PRs)
2. What did not ship? (open issues, blockers)
3. Root cause on any failures
4. Action items -- each MUST become a GitHub Issue labeled retro-action

**Coordinator integration:**
At round start, call Test-RetroOverdue (see skill retro-enforcement). If overdue, run this ceremony before the work queue.

**Why GitHub Issues, not markdown:**
Production data: 0% completion across 6 retros using markdown checklists, 100% after switching to GitHub Issues.

---

## Code Review Gate

| Field | Value |
|-------|-------|
| **Trigger** | auto |
| **When** | before-commit |
| **Condition** | Any agent produces code changes (backend, frontend, infra, migrations, Docker) |
| **Facilitator** | lead |
| **Participants** | biruni OR khaldun (never the author) |
| **Time budget** | focused |
| **Enabled** | ✅ yes |

**Protocol:**
1. Coding agent outputs `REVIEW_REQUEST` block (files changed, logic summary, migration/deploy impacts)
2. Reviewer checks against the Review Checklist (see decision `khaldun-review-gate.md`)
3. APPROVE → commit proceeds
4. REJECT → author fixes, resubmits; after 2 rejections, Khaldun pairs to resolve

**Review Checklist (minimum):**
- Migrations present for schema changes and runnable
- API field names match between frontend ↔ backend
- No children in void JSX elements
- Interceptors/middleware don't cause unrelated side effects
- Docker COPY paths and env vars resolve correctly
- TypeScript types align with Prisma schema

**Spawning directive (include in all coding agent prompts):**
```
REVIEW GATE: Do NOT commit directly. After completing code changes, output a
REVIEW_REQUEST block listing: (1) all files changed, (2) logic summary,
(3) migration/deploy impacts. Await reviewer approval before committing.
```
