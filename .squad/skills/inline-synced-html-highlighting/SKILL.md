---
name: "inline-synced-html-highlighting"
description: "Render audio-synced word highlighting inside existing HTML lesson content without losing markup structure."
domain: "frontend"
confidence: "high"
source: "earned"
tools:
  - name: "edit"
    description: "Refactor page and component ownership for sync state and inline rendering."
    when: "When synced playback needs to move from a standalone widget into an existing content surface."
---

## Context
Use this pattern when lesson or article content is already stored as HTML and audio controls live elsewhere on the page, but the active spoken word should be highlighted inside the existing reading area.

## Patterns
- Keep playback controls and audio element ownership in the control component.
- Expose sync state upward with a callback such as `onSyncStateChange`.
- Parse the HTML content and preserve its DOM structure while wrapping token-level text nodes in spans.
- Only count words that match the active language script so mixed Arabic/English content does not drift as badly during playback.
- Reuse consistent highlight colors by language: amber for English, emerald for Arabic.

## Examples
- `frontend/src/components/UnitAudioButton.tsx` emits `UnitAudioSyncState` from synced playback controls.
- `frontend/src/components/SyncedTextContent.tsx` parses lesson HTML and highlights the active token inline.
- `frontend/src/pages/courses/UnitViewer.tsx` keeps Study Aids controls separate from the highlighted lesson content.

## Anti-Patterns
- Rendering a second mini-reader below the controls when the page already has a reading surface.
- Replacing stored HTML with a plain-text audio transcript.
- Tightly coupling playback controls and text rendering so the page cannot decide where highlighting appears.
