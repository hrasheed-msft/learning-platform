# Nūrāniyyah audio tooling

Turns the "Qaidah Nuraniyyah" CD tracks into per-clip MP3s and wires them into the course (book pages 6–19,
lessons 1–11).

## What the CD contains

Tracks `002`–`011` and `013` are CD lessons 1–11, which are the same as the book's lessons 1–11 (`001` / `012`
are the opening du'ā; `014`–`018` cover later pages that the course does not include). A teacher says each
cell of the book and leaves a pause for the student. Letter-by-letter lessons are read in groups: the letters
spelled out (fatḥah, kasrah, ḍammah), then the combined reading. In the exercise lessons each word is first
spelled out letter by letter and then read.

## Pipeline

```powershell
pip install -r requirements.txt
$env:NURANIYYAH_MP3_DIR = 'C:\path\to\Nuraniyyah-MP3'
$env:TS_NODE_COMPILER_OPTIONS = '{"module":"commonjs","moduleResolution":"node"}'

python transcribe_all.py      # silence-split each track + label every clip with Whisper (slow: ~1 h on CPU)
python export_clips.py        # writes <MP3 dir>\split\lesson-NN-<slug>\NNN.mp3 + manifest.json
cd ..\..\backend
npx ts-node --transpile-only ../tools/nuraniyyah-audio/export-content.ts   # dump the course cells and words
cd ..\tools\nuraniyyah-audio
python build_audio_plan.py    # decides which clip belongs to which cell, regenerates
                              # backend/prisma/helpers/nuraniyyah-audio.ts
cd ..\..\backend
npx ts-node --transpile-only ../tools/nuraniyyah-audio/export-content.ts   # re-run so the dump sees the plan
cd ..\tools\nuraniyyah-audio
python publish_clips.py       # copies the clips the course uses to frontend/public/audio/nuraniyyah
```

## How clips are matched

* **Letter-by-letter lessons (1, 3, 4, 5, 7, 8):** by position in the CD's fixed structure; see the position
  tables in `build_audio_plan.py`.
* **Lesson 2:** each cell's spelled letter names are aligned to the clip labels of track `003`.
* **Exercise words (lessons 6, 9, 11):** a monotonic alignment of each word to the Whisper labels (similarity
  ≥ 0.85); words between two anchors on consecutive clips are filled by position.
* **Lesson 10 (sukūn):** each letter group's combined reading is a single clip, or the short tail clips joined
  with ffmpeg into `cd10-grp-NN.mp3`.

Whisper labels are approximate and the matched clips have not been auditioned, so spot-check a few cards after
a run. Cells without a match simply have no 🔊 button.
