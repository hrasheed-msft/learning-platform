# Course text Arabic-term normalization + targeted audio invalidation

- **Date:** 2026-05-24T16:09:47.032-05:00
- **Author:** Khwarizmi
- **Status:** Proposed

## Context

TTS already normalizes many Arabic transliterations during synthesis, but the stored `units.content` HTML still contains legacy text like `Salah`, `Wudu`, and `Ruku` without inline translations. That hurts readability for learners and leaves stale `AudioCache` rows pointing at speech generated from older formatting rules.

## Decision

1. Add one shared backend formatter for Arabic terms so course text normalization and TTS narration use the same transliteration matching rules.
2. Normalize stored lesson HTML to `Translation Arabic/(Transliteration)` by walking units with linked `arabicTerms` and updating only content that actually changes.
3. Invalidate audio only for affected units instead of deleting every cache row globally.
4. Keep an explicit admin repair path (`POST /api/v1/admin/invalidate-audio-cache`) plus the existing unit-scoped admin route alias for operations.

## Impact

- Fresh seeds produce learner-facing text that is easier to read.
- Existing environments can be repaired with `npm run db:normalize:arabic-terms`.
- Audio regeneration cost stays bounded because only updated units lose cache rows.
