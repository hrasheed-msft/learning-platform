"""Forced, order-preserving alignment of the book's exercise words to the clips of a CD track.

The CD reads the book in order, so every word must have exactly one "reading" clip and those clips appear in
the same order as the words. Instead of keeping only confident Whisper matches, this assigns *every* word to a
clip (monotonic, one clip per word) maximising the total similarity, and then reports how trustworthy each
assignment is:

  sure   - the Whisper label of the clip is similar to the word
  order  - the label is poor, but exactly one reading-type clip lies between the neighbouring sure matches,
           so the order of the book decides it
  weak   - neither; not published

Usage: python align2.py [006|009|011] -> prints a table (used by build_audio_plan.py as a library).
"""
import difflib, json, os, re, sys
from align import WORK, load_track, norm, skel

# Words the teacher says while spelling a word out: harakat, "sukūn", "madd", tanwīn, "small" ...
SPELL = re.compile(r'^(فت|كسر|سكون|سقون|سكن|صغير|تين|تان|قصر|مد|الف|ضم)')
SURE = 0.62
# Letters Whisper commonly swaps with each other; compared as one class so a ذ heard as د still matches
CONFUSABLE = str.maketrans('ذضظصثطقه', 'ددزسستكح')


def label_sim(word, labels):
    """Best similarity of the word to any of the Whisper labels of a clip."""
    best = 0.0
    for label in labels:
        a, b = norm(word).translate(CONFUSABLE), norm(label).translate(CONFUSABLE)
        if not a or not b:
            continue
        full = difflib.SequenceMatcher(None, a, b).ratio()
        sa, sb = skel(word).translate(CONFUSABLE), skel(label).translate(CONFUSABLE)
        core = difflib.SequenceMatcher(None, sa, sb).ratio() if sa and sb else 0.0
        if len(sa) >= 2 and len(sb) >= 2 and sa[0] != sb[0]:
            core *= 0.5
        s = 0.6 * core + 0.4 * full
        # the teacher reads the first syllables of a spelled-out word before the whole word
        if len(b) < len(a) and a.startswith(b):
            s -= 0.1
        best = max(best, s)
    return best


def is_spelling(labels):
    """True when the clip is the teacher spelling a letter out ("bā fatḥah alif ṣaghīrah bā")."""
    for label in labels:
        toks = re.sub('[\u064B-\u065F\u0670]', '', label).split()
        if any(SPELL.match(norm(t)) for t in toks if norm(t)):
            return True
    return False


def read_like(clip, labels):
    return not is_spelling(labels.get(clip['i'], [])) and clip['dur'] <= 4.0


def forced_align(words, clips, labels, first=0):
    """clips: list of clip dicts; labels: {clip index: [texts]}. Returns {word index: (clip index, sim)}."""
    n, m = len(words), len(clips)
    NEG = -1e9
    S = [[NEG] * m for _ in range(n)]
    for i, w in enumerate(words):
        for j, c in enumerate(clips):
            if c['i'] < first or c['dur'] > 4.5:
                continue
            t = [x for x in labels.get(c['i'], []) if x.strip()]
            s = label_sim(w, t) if t else 0.15
            if is_spelling(t):
                s -= 0.3
            S[i][j] = s
    dp = [[NEG] * (m + 1) for _ in range(n + 1)]
    for j in range(m + 1):
        dp[0][j] = 0.0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            best = dp[i][j - 1]
            if S[i - 1][j - 1] > NEG / 2 and dp[i - 1][j - 1] > NEG / 2:
                best = max(best, dp[i - 1][j - 1] + S[i - 1][j - 1])
            dp[i][j] = best
    out, i, j = {}, n, m
    while i > 0 and j > 0:
        if S[i - 1][j - 1] > NEG / 2 and abs(dp[i][j] - (dp[i - 1][j - 1] + S[i - 1][j - 1])) < 1e-9:
            out[i - 1] = (clips[j - 1]['i'], max(0.0, S[i - 1][j - 1]))
            i, j = i - 1, j - 1
        elif dp[i][j] == dp[i][j - 1]:
            j -= 1
        else:
            i -= 1
    return out


def classify(words, clips, labels, assign):
    """Returns {word index: (clip, sim, 'sure'|'order'|'weak')}."""
    by_i = {c['i']: c for c in clips}
    res = {}
    for i, (c, s) in assign.items():
        res[i] = (c, s, 'sure' if s >= SURE else 'weak')
    # a weak run between two sure matches is decided by order when the clips in between are unambiguous
    idx = sorted(res)
    status = {i: res[i][2] for i in idx}
    for k, i in enumerate(idx):
        if status[i] != 'weak':
            continue
        lo = next((res[p][0] for p in reversed(idx[:k]) if status[p] == 'sure'), None)
        hi = next((res[p][0] for p in idx[k + 1:] if status[p] == 'sure'), None)
        if lo is None or hi is None:
            continue
        run = [p for p in idx if lo < res[p][0] < hi and status[p] == 'weak']
        cand = [c['i'] for c in clips if lo < c['i'] < hi and read_like(c, labels)]
        if len(cand) == len(run):
            res[i] = (res[i][0], res[i][1], 'order')
    return res


def load_labels(track):
    """{clip index: [first-pass label, second-pass label (relabel.py) when there is one]}"""
    labels = {c['i']: [c['text']] for c in load_track(track)}
    p = os.path.join(WORK, track + '.v2.json')
    if os.path.exists(p):
        for r in json.load(open(p, encoding='utf-8')):
            labels[r['i']].append(r['text'])
    return labels


def align_lesson(words, track, first=0):
    clips = load_track(track)
    labels = load_labels(track)
    res = classify(words, clips, labels, forced_align(words, clips, labels, first))
    return res, clips, labels


if __name__ == '__main__':
    lesson, track = {'6': ('6', '007'), '9': ('9', '010'), '11': ('11', '013')}[sys.argv[1]]
    words = json.load(open(os.path.join(WORK, 'content.json'), encoding='utf-8'))['words'][lesson]
    res, clips, labels = align_lesson(words, track)
    for i, w in enumerate(words):
        if i in res:
            c, s, k = res[i]
            print(f'{i:3d} {w:12s} clip {c:3d} {clips[c]["dur"]:.2f}s sim {s:.2f} {k:5s} {labels[c]}')
        else:
            print(f'{i:3d} {w:12s} -')
    from collections import Counter
    print(Counter(r[2] for r in res.values()), 'of', len(words))


