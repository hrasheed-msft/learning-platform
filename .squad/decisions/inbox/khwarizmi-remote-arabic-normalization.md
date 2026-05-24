# Remote Arabic-term normalization endpoint

- Date: 2026-05-24T17:15:40.834-05:00
- Author: Khwarizmi
- Status: Proposed

## Decision
Expose the existing `syncCourseTextFormatting()` repair flow through a parent-authenticated admin endpoint at `POST /api/v1/admin/normalize-arabic-terms` instead of relying on SSH access or container-local npm scripts.

## Why
Arabic-term narration fixes now require both content normalization and targeted audio cache invalidation in production. A remote endpoint lets hrasheed trigger the exact same idempotent backend flow safely from outside the container.

## Consequences
- Production repairs can be run with normal parent credentials.
- The endpoint returns counts for updated units, normalized term occurrences, and cleared audio cache entries.
- Repeated calls are safe because already-normalized units are skipped and their audio cache rows are not deleted.
