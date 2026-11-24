"""Second-pass Whisper labels for the exercise lessons (CD tracks 007, 010, 013).

The first pass (transcribe_all.py) packs all clips of a track into one stream, so neighbouring clips bleed
into each other. Here every clip is transcribed on its own, and Whisper is given the words expected near that
position in the book as a vocabulary prompt. The result is written next to the first pass:

    work/<NNN>.v2.json -> [{i, text}]

Usage: python relabel.py TRACK[:a-b,c-d] ...   e.g.  python relabel.py 010:9-30,76-87 013:36-38
Only the listed clip ranges are (re)labelled and merged into the existing file; no range = the whole track.
Needs work/content.json (export-content.ts) and work/plan.json (build_audio_plan.py) for the rough position.
"""
import glob, json, os, re, sys
from analyze import SR, load
from align import WORK, load_track, norm
from faster_whisper import WhisperModel

SRC = os.environ.get('NURANIYYAH_MP3_DIR', r'C:\Users\hrasheed\Dropbox\Nuraniyyah-MP3')
TRACK_LESSON = {'007': 6, '010': 9, '011': 10, '013': 11}
WINDOW = 14
PAD = 0.15


def expected_index(clips, plan_words, words):
    """Rough word index for every clip, interpolated between the words already placed by the first pass."""
    anchors = sorted((c, words.index(w)) for w, c in plan_words.items() if w in words)
    if not anchors:
        return {c['i']: int(len(words) * c['i'] / len(clips)) for c in clips}
    out = {}
    for c in clips:
        i = c['i']
        before = [a for a in anchors if a[0] <= i]
        after = [a for a in anchors if a[0] >= i]
        if before and after:
            (c0, w0), (c1, w1) = before[-1], after[0]
            out[i] = w0 if c1 == c0 else round(w0 + (w1 - w0) * (i - c0) / (c1 - c0))
        elif before:
            out[i] = before[-1][1] + (i - before[-1][0]) // 2
        else:
            out[i] = max(0, after[0][1] - (after[0][0] - i) // 2)
    return out


def main():
    specs = sys.argv[1:] or ['007', '010', '013']
    content = json.load(open(os.path.join(WORK, 'content.json'), encoding='utf-8'))
    plan = json.load(open(os.path.join(WORK, 'plan.json'), encoding='utf-8'))
    model = WhisperModel(os.environ.get('WHISPER', 'small'), device='cpu', compute_type='int8',
                         cpu_threads=int(os.environ.get('THREADS', '4')))
    for spec in specs:
        track, _, ranges = spec.partition(':')
        lesson = TRACK_LESSON[track]
        out = os.path.join(WORK, track + '.v2.json')
        wanted = None
        if ranges:
            wanted = {i for r in ranges.split(',') for i in range(int(r.split('-')[0]), int(r.split('-')[-1]) + 1)}
        done = {r['i']: r for r in json.load(open(out, encoding='utf-8'))} if os.path.exists(out) else {}
        words = content['words'][str(lesson)]
        plain = [norm(w) for w in words]
        clips = load_track(track)
        idx = expected_index(clips, plan['words'].get(str(lesson), {}), words)
        src = glob.glob(os.path.join(SRC, track + '-*.mp3'))[0]
        x = load(src)
        for c in clips:
            if (wanted is not None and c['i'] not in wanted) or (wanted is None and c['i'] in done):
                continue
            k = idx[c['i']]
            near = plain[max(0, k - WINDOW): k + WINDOW + 1]
            prompt = 'كلمات: ' + ' '.join(near)
            a, b = max(0, c['start'] - PAD), c['end'] + PAD
            seg, _ = model.transcribe(x[int(a * SR): int(b * SR)], language='ar', beam_size=3, temperature=0,
                                      condition_on_previous_text=False, initial_prompt=prompt, vad_filter=False)
            text = ' '.join(s.text.strip() for s in seg)
            done[c['i']] = {'i': c['i'], 'text': text}
            print(track, c['i'], c['dur'], text, flush=True)
            json.dump([done[k] for k in sorted(done)], open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)


if __name__ == '__main__':
    main()
