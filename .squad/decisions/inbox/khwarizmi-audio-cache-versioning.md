# Audio cache versioning

- Date: 2026-05-24T16:05:42.973-05:00
- Author: Khwarizmi
- Status: Proposed

## Decision
Add a nullable `cacheVersion` field to `backend/prisma/schema.prisma` for `AudioCache`, set it on new TTS writes, and treat any row without the current version as stale.

## Why
The Arabic term formatting fix changed how English TTS should speak embedded Arabic terms. Existing cached audio rows still point to older narration, so they must be invalidated without bulk-regenerating every unit.

## Consequences
- Old audio cache rows automatically miss after deploy and regenerate on demand.
- New audio filenames include the cache version so refreshed URLs do not reuse older asset paths.
- An admin invalidation endpoint can clear cached rows in bulk when future TTS changes land.
