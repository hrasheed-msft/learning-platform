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
python relabel.py 010:9-35     # optional: re-label clips whose first-pass label is poor (vocabulary prompt)
python build_audio_plan.py    # decides which clip belongs to which cell, regenerates
                              # backend/prisma/helpers/nuraniyyah-audio.ts and work/plan-report.txt
cd ..\..\backend
npx ts-node --transpile-only ../tools/nuraniyyah-audio/export-content.ts   # re-run so the dump sees the plan
cd ..\tools\nuraniyyah-audio
python coverage.py            # which clips are unused? (should be intros, spelled letters and partial readings)
python publish_clips.py       # copies the clips the course uses to frontend/public/audio/nuraniyyah
```

## How clips are matched

The CD reads the book in order, so the plan follows the sequence; Whisper labels only cross-check it.

* **Letter-by-letter lessons (1, 3, 4, 5, 7, 8):** by position in the CD's fixed structure.
* **Lesson 2:** one clip per cell, in order: cell `k` is clip `k + 2`. `build_audio_plan.py` stops if the number of
  clips does not equal cells + 3 (two intro clips and the closing jingle).
* **Exercise words (lessons 6, 9, 11):** a spelled-out word takes `2n − 1` clips (n letters-with-ḥarakah) and the last
  one reads the whole word; any other word is a single clip (`structure.py`). The walk must finish on the last clip
  before the jingle (lessons 6 and 9). `align2.py` (forced Whisper-label alignment) is only a cross-check.
* **Lesson 10 (sukūn):** each letter group's combined reading is a single clip, or the short tail clips joined
  with ffmpeg into `cd10-grp-NN.mp3`.

If a cell or word has no clip, or a clip is left over, the transcribed content probably differs from the book (a
missing or swapped cell), so compare the page image with `nuraniyyah-data.ts` first.

Whisper labels are approximate and the matched clips have not been auditioned, so spot-check a few cards after
a run.
