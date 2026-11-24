"""Score simulated 'other voices' against the teacher's clips and report how well each scorer tells right from wrong.

For every syllable (letter x vowel) the query is a transformed copy of the clip (higher voice, different tempo, noise);
the references are the 30 original clips. A good scorer puts the query's own syllable first, and when it does not, we want
to know whether it confused the letter or the vowel (the two kinds of feedback the app must tell apart).

Usage: python evaluate.py [scorer ...]      scorers: mfcc, mfcc-vtln, whisper-tiny, whisper-base, whisper-small
"""
import json, os, sys, time
import numpy as np
from augment import channel, noise, voice
from dataset import WORK, read_wav
from features import dtw, mfcc

CONDITIONS = [
    # name, voice shift, tempo, SNR dB (None = clean); every condition except the first also changes the microphone
    ('same voice, slower, clean', 1.0, 0.8, None),
    ('same voice, other mic, 20 dB', 1.0, 0.9, 20),
    ('adult woman (x1.3), 20 dB', 1.3, 0.9, 20),
    ('child (x1.45), 20 dB', 1.45, 0.8, 20),
    ('child (x1.45), 10 dB noisy room', 1.45, 0.8, 10),
    ('young child (x1.65), 15 dB', 1.65, 0.7, 15),
    ('very young child (x1.85), 15 dB', 1.85, 0.7, 15),
]
VTLN_WARPS = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8]


def load_set():
    index = json.load(open(os.path.join(WORK, 'syllables.json'), encoding='utf-8'))
    return index, [read_wav(os.path.join(WORK, 'syllables', i['name'] + '.wav')) for i in index]


class Mfcc:
    name = 'mfcc'

    def ref(self, x):
        return mfcc(x)

    def distances(self, q, refs):
        f = mfcc(q)
        return np.array([dtw(f, r) for r in refs])


class MfccVtln(Mfcc):
    """Try several vocal-tract warps of the query and keep the best, so a child's higher formants are tolerated."""
    name = 'mfcc-vtln'

    def distances(self, q, refs):
        feats = [mfcc(q, warp=w) for w in VTLN_WARPS]
        return np.array([min(dtw(f, r) for f in feats) for r in refs])


def make_scorer(name):
    if name == 'mfcc':
        return Mfcc()
    if name == 'mfcc-vtln':
        return MfccVtln()
    if name.startswith('whisper-'):
        from neural import WhisperScorer
        return WhisperScorer(name.split('-', 1)[1])
    raise SystemExit(f'unknown scorer {name}')


def summarise(D, index):
    """D[q, r] distances. Returns accuracy and the AUCs of 'own syllable' against each kind of mistake."""
    n = len(index)
    letters = np.array([i['letter'] for i in index])
    vowels = np.array([i['vowel'] for i in index])
    top = D.argmin(axis=1)
    res = {
        'syllable': float(np.mean(top == np.arange(n))),
        'letter': float(np.mean(letters[top] == letters)),
        'vowel': float(np.mean(vowels[top] == vowels)),
    }
    wl, wv, wb = [], [], []
    for q in range(n):
        own = D[q, q]
        for r in range(n):
            if r == q:
                continue
            same_l, same_v = letters[r] == letters[q], vowels[r] == vowels[q]
            (wv if same_l else wl if same_v else wb).append(own < D[q, r])
    res['auc_wrong_vowel'] = float(np.mean(wv))
    res['auc_wrong_letter'] = float(np.mean(wl))
    res['auc_both_wrong'] = float(np.mean(wb))
    # when the first choice is wrong, which kind of mistake is it?
    wrong = [(q, top[q]) for q in range(n) if top[q] != q]
    res['err_vowel_only'] = sum(letters[r] == letters[q] for q, r in wrong)
    res['err_letter_only'] = sum(letters[r] != letters[q] and vowels[r] == vowels[q] for q, r in wrong)
    res['err_both'] = sum(letters[r] != letters[q] and vowels[r] != vowels[q] for q, r in wrong)
    return res


def main():
    names = sys.argv[1:] or ['mfcc', 'mfcc-vtln']
    index, clips = load_set()
    rng = np.random.default_rng(7)
    queries = {}
    for cname, shift, tempo, snr in CONDITIONS:
        qs = []
        for x in clips:
            y = voice(x, shift, tempo)
            if snr is not None:
                y = noise(channel(y, rng), snr, rng)
            qs.append(y)
        queries[cname] = qs
    report = {}
    for name in names:
        scorer = make_scorer(name)
        t0 = time.time()
        refs = [scorer.ref(x) for x in clips]
        report[name] = {}
        for cname, qs in queries.items():
            D = np.array([scorer.distances(q, refs) for q in qs])
            np.save(os.path.join(WORK, f'D-{name}-{CONDITIONS.index(next(c for c in CONDITIONS if c[0] == cname))}.npy'), D)
            report[name][cname] = summarise(D, index)
            r = report[name][cname]
            print(f"{name:13s} {cname:34s} syllable {r['syllable']:.2f} letter {r['letter']:.2f} vowel {r['vowel']:.2f} | "
                  f"AUC vowel-mistake {r['auc_wrong_vowel']:.2f} letter-mistake {r['auc_wrong_letter']:.2f} | "
                  f"errors: vowel {r['err_vowel_only']} letter {r['err_letter_only']} both {r['err_both']}", flush=True)
        print(f'  ({name}: {time.time() - t0:.0f} s)')
    out = os.path.join(WORK, 'report-' + '-'.join(names) + '.json')
    json.dump(report, open(out, 'w', encoding='utf-8'), indent=1)


if __name__ == '__main__':
    main()
