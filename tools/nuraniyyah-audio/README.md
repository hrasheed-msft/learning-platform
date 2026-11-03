# Nūrāniyyah audio tooling

Turns the "Qaidah Nuraniyyah" CD tracks into per-clip MP3s and wires the matching words into the course.

## What the CD contains

Tracks `002`–`011` and `013`–`018` are the CD lessons 1–16 (`001` / `012` are the opening du'ā). A teacher
says each cell of the book and leaves a pause for the student. In the exercise lessons each word is first
spelled out letter by letter ("hamza fatḥah a", "bā fatḥah ba", … ) and then read, so a word is the
*last* clip of its group. The CD lesson order differs from the course's book order (for example the CD's
lesson 3, the disjointed letters, is lesson 17 of the book).

## Pipeline

```powershell
pip install -r requirements.txt
$env:NURANIYYAH_MP3_DIR = 'C:\path\to\Nuraniyyah-MP3'

python transcribe_all.py      # silence-split each track + label every clip with Whisper (slow: ~1 h on CPU)
python export_clips.py        # writes <MP3 dir>\split\lesson-NN-<slug>\NNN.mp3 + manifest.json
cd ..\..\backend; npx ts-node --transpile-only ../tools/nuraniyyah-audio/export-words.ts; cd ..\tools\nuraniyyah-audio
python build_audio_map.py     # matches course words to clips, copies them to frontend/public/audio/nuraniyyah
                              # and regenerates backend/prisma/helpers/nuraniyyah-audio.ts
```

`export-words.ts` needs `TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","moduleResolution":"node"}'`
when run from `backend/`.

## How words are matched

* **Lesson 1:** the 30 single-letter clips of track `002` follow the book's alphabet order.
* **Lesson 2:** spelled letter names are compared with the clip labels.
* **Practice words:** a monotonic alignment of each word to the clip labels of the tracks that cover the same
  pages (see `ALLOWED_TRACKS`), using a consonant-skeleton similarity. Only confident matches (similarity
  ≥ 0.85) are kept, and a clip can belong to only one word. Unmatched words simply have no 🔊 button.

Whisper labels are approximate, so review `work/map-report.txt` after a run. Grid lessons (vowels, tanwīn,
madd, sukūn, shaddah grids) are not mapped: the course shows systematic letter × vowel grids whereas the CD
follows the book's own cell order.
