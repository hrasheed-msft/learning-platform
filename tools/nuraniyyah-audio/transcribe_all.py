"""Segment every lesson MP3 on silence, then label each clip with Whisper (Arabic).

To keep Whisper fast, the speech clips of a lesson are packed back-to-back (separated by
short silences) into one stream and transcribed with word timestamps; every recognised word is
then assigned to the clip it overlaps most.

Output: work/<NNN>.json -> [{i, start, end, dur, text}]
"""
import glob, json, os, sys
import numpy as np
from analyze import load, segments, SR
from faster_whisper import WhisperModel

SRC = os.environ.get('NURANIYYAH_MP3_DIR', r'C:\Users\hrasheed\Dropbox\Nuraniyyah-MP3')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'work')
os.makedirs(OUT, exist_ok=True)
only = set(sys.argv[1:])
PAD, GAP = 0.12, 0.6

model = WhisperModel(os.environ.get('WHISPER', 'small'), device='cpu', compute_type='int8')

for f in sorted(glob.glob(os.path.join(SRC, '*.mp3'))):
    n = os.path.basename(f)[:3]
    if n in ('001', '012') or (only and n not in only):
        continue
    out = os.path.join(OUT, n + '.json')
    if os.path.exists(out):
        continue
    x = load(f)
    segs, _ = segments(x, -35, 0.3)
    pieces, spans, cursor = [], [], 0.0
    gap = np.zeros(int(GAP * SR), dtype=np.float32)
    for s, e in segs:
        a, b = max(0, s - PAD), min(len(x) / SR, e + PAD)
        clip = x[int(a * SR): int(b * SR)]
        pieces += [clip, gap]
        spans.append((cursor, cursor + len(clip) / SR))
        cursor += len(clip) / SR + GAP
    stream = np.concatenate(pieces)
    words, _ = model.transcribe(stream, language='ar', beam_size=1, temperature=0, word_timestamps=True,
                                condition_on_previous_text=False, vad_filter=False)
    texts = [[] for _ in segs]
    for seg in words:
        for w in (seg.words or []):
            mid = (w.start + w.end) / 2
            best = min(range(len(spans)), key=lambda k: 0 if spans[k][0] <= mid <= spans[k][1] else min(abs(mid - spans[k][0]), abs(mid - spans[k][1])))
            texts[best].append(w.word.strip())
    rows = [{'i': i, 'start': round(s, 3), 'end': round(e, 3), 'dur': round(e - s, 3), 'text': ' '.join(texts[i])} for i, (s, e) in enumerate(segs)]
    with open(out, 'w', encoding='utf-8') as fh:
        json.dump(rows, fh, ensure_ascii=False, indent=0)
    print('done', n, len(rows), 'clips', round(cursor / 60, 1), 'min stream', flush=True)
