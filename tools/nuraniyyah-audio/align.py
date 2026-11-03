"""Align the course's practice words to the labelled clips of the lesson MP3s.

Usage: python align.py            -> writes work/audio-map.json and work/align-report.txt
Words are matched to clips by a consonant-skeleton similarity of the Whisper label, in book
order (monotonic dynamic programming). Only confident matches are kept.
"""
import json, os, re, sys, difflib, glob

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.join(HERE, 'work')
THR = float(os.environ.get('THR', '0.74'))

DIAC = re.compile('[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]')
MARKERS = re.compile('فتح|كسر|ضم|سكون|شد|تنوين|حركة|صغير|الدرس|الحروف')


def norm(s):
    s = DIAC.sub('', s)
    s = re.sub('[أإآٱ]', 'ا', s).replace('ى', 'ي').replace('ة', 'ه').replace('ؤ', 'و').replace('ئ', 'ي')
    return re.sub(r'[^\u0621-\u064A]', '', s)


def skel(s):
    return re.sub('[اويء]', '', norm(s))


def sim(a, b):
    sa, sb = skel(a), skel(b)
    if len(sa) < 2 or len(sb) < 2:
        return 0.0
    if sa[0] != sb[0]:
        return 0.0
    return difflib.SequenceMatcher(None, sa, sb).ratio()


def load_track(track):
    return json.load(open(os.path.join(WORK, track + '.json'), encoding='utf-8'))


def align(words, clips, taken):
    """Monotonic alignment. words: list[str]; clips: list[dict]; taken: set of clip indexes already used."""
    n, m = len(words), len(clips)
    S = [[0.0] * m for _ in range(n)]
    for i, w in enumerate(words):
        for j, c in enumerate(clips):
            if c['i'] in taken or c['dur'] > 6 or not c['text'] or MARKERS.search(c['text']):
                continue
            s = sim(w, c['text'])
            if s >= THR:
                S[i][j] = s + 1e-4 * j  # prefer the later clip when a word is repeated while being spelled out
    dp = [[0.0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            best = max(dp[i - 1][j], dp[i][j - 1])
            if S[i - 1][j - 1] > 0:
                best = max(best, dp[i - 1][j - 1] + S[i - 1][j - 1])
            dp[i][j] = best
    i, j, out = n, m, {}
    while i > 0 and j > 0:
        if S[i - 1][j - 1] > 0 and abs(dp[i][j] - (dp[i - 1][j - 1] + S[i - 1][j - 1])) < 1e-9:
            out[i - 1] = (j - 1, round(S[i - 1][j - 1], 2))
            i, j = i - 1, j - 1
        elif dp[i][j] == dp[i - 1][j]:
            i -= 1
        else:
            j -= 1
    return out


if __name__ == '__main__':
    words = json.load(open(os.path.join(WORK, 'words.json'), encoding='utf-8'))
    tracks = sorted(os.path.basename(p)[:3] for p in glob.glob(os.path.join(WORK, '???.json')) if os.path.basename(p)[:3].isdigit())
    data = {t: load_track(t) for t in tracks}
    report = []
    for slug, items in words.items():
        uniq = []
        for it in items:
            if it['ar'] not in [u['ar'] for u in uniq] and len(norm(it['ar'])) >= 2:
                uniq.append(it)
        if not uniq:
            continue
        results = {}
        for t in tracks:
            res = align([u['ar'] for u in uniq], data[t], set())
            results[t] = res
        ranked = sorted(tracks, key=lambda t: -len(results[t]))
        report.append(f'## {slug}: {len(uniq)} words; matches by track: ' + ', '.join(f'{t}={len(results[t])}' for t in ranked[:4]))
    open(os.path.join(WORK, 'align-report.txt'), 'w', encoding='utf-8').write('\n'.join(report))
