"""Build the audio plan for the Nuraniyyah course from the labelled CD clips.

Reads  work/content.json  (from export-content.ts) and work/<NNN>.json  (from transcribe_all.py)
Writes backend/prisma/helpers/nuraniyyah-audio.ts  and  work/plan.json

* Lesson 2 cells   : monotonic alignment of the spelled letter names against the clip labels (track 003).
* Exercise words   : lessons 6, 9, 11 (tracks 007, 010, 013): monotonic alignment of each word against the
                     clip labels, then words between two confident matches that sit on consecutive clips
                     are filled in (most words are read as a single clip).
* Lesson 10 groups : track 011 reads each letter as spelled clips followed by short clips for a/i/u;
                     the three short tail clips are joined into one clip per letter.
Everything else (letters, harakat, tanween, madd, leen ...) is placed by position in the TS content.
"""
import difflib, json, os, re
from align import WORK, align, load_track, norm, skel

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
TS_OUT = os.path.join(REPO, 'backend', 'prisma', 'helpers', 'nuraniyyah-audio.ts')

NAMES = {'ا': 'الف', 'أ': 'همزة', 'ب': 'با', 'ت': 'تا', 'ث': 'ثا', 'ج': 'جيم', 'ح': 'حا', 'خ': 'خا', 'د': 'دال', 'ذ': 'ذال',
         'ر': 'را', 'ز': 'زا', 'س': 'سين', 'ش': 'شين', 'ص': 'صاد', 'ض': 'ضاد', 'ط': 'طا', 'ظ': 'ظا', 'ع': 'عين', 'غ': 'غين',
         'ف': 'فا', 'ق': 'قاف', 'ك': 'كاف', 'ل': 'لام', 'م': 'ميم', 'ن': 'نون', 'و': 'واو', 'ه': 'ها', 'ء': 'همزة', 'ي': 'يا',
         'ى': 'يا', 'ة': 'تا', 'ؤ': 'واو', 'ئ': 'يا'}
EXERCISE_TRACKS = {6: '007', 9: '010', 11: '013'}
MIN_CELL = 0.72
MIN_WORD = 0.85


def sk(s):
    return re.sub('[اويءى]', '', norm(s))


def cell_sim(cell, label):
    target = ''.join(NAMES.get(c, '') for c in cell if c not in 'ـ')
    a, b = sk(target), sk(label)
    if not a or not b:
        return 0.0
    return difflib.SequenceMatcher(None, a, b).ratio()


def align_cells(cells, clips):
    n, m = len(cells), len(clips)
    S = [[0.0] * m for _ in range(n)]
    for i, c in enumerate(cells):
        for j, cl in enumerate(clips):
            if cl['text']:
                s = cell_sim(c, cl['text'])
                if s >= MIN_CELL:
                    S[i][j] = s
    dp = [[0.0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            best = max(dp[i - 1][j], dp[i][j - 1])
            if S[i - 1][j - 1] > 0:
                best = max(best, dp[i - 1][j - 1] + S[i - 1][j - 1])
            dp[i][j] = best
    out, i, j = [None] * n, n, m
    while i > 0 and j > 0:
        if S[i - 1][j - 1] > 0 and abs(dp[i][j] - (dp[i - 1][j - 1] + S[i - 1][j - 1])) < 1e-9:
            out[i - 1] = (clips[j - 1]['i'], round(S[i - 1][j - 1], 2))
            i, j = i - 1, j - 1
        elif dp[i][j] == dp[i - 1][j]:
            i -= 1
        else:
            j -= 1
    return out


def accept(word, label):
    sw, sc = skel(word), skel(label)
    if len(sw) < 3:
        return norm(word) == norm(label)
    return len(sc) >= len(sw)


def exercise_plan(words, clips):
    res = align(words, clips, set())
    anchors = {i: j for i, (j, s) in res.items() if s >= MIN_WORD and accept(words[i], clips[j]['text'])}
    out = {i: clips[j]['i'] for i, j in anchors.items()}
    filled = 0
    order = sorted(anchors)
    for a, b in zip(order, order[1:]):
        ia, ib = clips[anchors[a]]['i'], clips[anchors[b]]['i']
        if b - a > 1 and ib - ia == b - a:
            for k in range(a + 1, b):
                out[k] = ia + (k - a)
                filled += 1
    return out, len(anchors), filled


def sukoon_groups(clips):
    """Each letter opens with two long spelled clips (fatḥah, kasrah); the ḍammah is the last long clip."""
    long_ = {c['i'] for c in clips if c['dur'] >= 2.3}
    starts = [i for i in sorted(long_) if i + 1 in long_ and i - 1 not in long_ and i >= 2]
    last_real = clips[-1]['i'] - 1  # the final clip is the closing jingle
    groups = []
    for k, s in enumerate(starts):
        end = (starts[k + 1] - 1) if k + 1 < len(starts) else last_real
        damma = max(i for i in range(s, end + 1) if i in long_)
        groups.append((s, damma, end))
    return groups


def main():
    content = json.load(open(os.path.join(WORK, 'content.json'), encoding='utf-8'))
    report = []

    # Lesson 2
    t3 = load_track('003')
    cells = [c['ar'] for c in content['l2Cells']]
    res = align_cells(cells, [c for c in t3 if 2 <= c['i'] <= 128])
    l2 = [r[0] if r else None for r in res]
    report.append(f"L2: {sum(1 for r in l2 if r is not None)}/{len(cells)} cells matched")
    for i, r in enumerate(res):
        if r:
            report.append(f"   {cells[i]:8s} -> {r[0]:3d} sim {r[1]}  [{t3[r[0]]['text']}]")

    # Exercise words
    word_clips = {}
    for lesson, track in EXERCISE_TRACKS.items():
        words = content['words'][str(lesson)]
        clips = load_track(track)
        plan, anchors, filled = exercise_plan(words, clips)
        word_clips[lesson] = {words[i]: c for i, c in plan.items()}
        report.append(f"L{lesson}: {len(plan)}/{len(words)} words ({anchors} matched, {filled} filled by position)")
        for i in sorted(plan):
            report.append(f"   {words[i]:12s} -> {plan[i]:3d}  [{clips[plan[i]]['text']}]")

    # Lesson 10 groups
    t11 = load_track('011')
    groups = sukoon_groups(t11)
    urls, recipes = [], {}
    for k, (s, damma, e) in enumerate(groups):
        tail = list(range(damma + 1, e + 1))
        if len(tail) == 1:
            urls.append(f'/audio/nuraniyyah/cd10-{tail[0] + 1:03d}.mp3')
            report.append(f"L10 group {k + 1}: clips {s}-{e} -> clip {tail[0]} ({t11[tail[0]]['dur']}s)")
        else:
            name = f'/audio/nuraniyyah/cd10-grp-{k + 1:02d}.mp3'
            urls.append(name)
            recipes[name] = {'track': '011', 'clips': tail}
            report.append(f"L10 group {k + 1}: clips {s}-{e} -> joined {tail} ({[t11[t]['dur'] for t in tail]})")
    report.append(f'L10: {len(groups)} groups found (expect 16)')

    json.dump({'l2': l2, 'words': {str(k): v for k, v in word_clips.items()}, 'sukoonUrls': urls, 'recipes': recipes},
              open(os.path.join(WORK, 'plan.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    open(os.path.join(WORK, 'plan-report.txt'), 'w', encoding='utf-8').write('\n'.join(report))

    word_ts = ',\n'.join(
        f"  {k}: {{\n" + ',\n'.join(f"    {json.dumps(w, ensure_ascii=False)}: {c}" for w, c in v.items()) + ',\n  }'
        for k, v in word_clips.items())
    ts = (
        "/**\n * Audio plan for the Nūrāniyyah course — GENERATED by tools/nuraniyyah-audio/build_audio_plan.py.\n *\n"
        " * Clip numbers are 0-based positions inside a CD track (see clipUrl in nuraniyyah-html.ts).\n */\n\n"
        "/** Lesson 2 (CD track 003): clip for each cell of L2_CELLS, or null when none could be matched. */\n"
        f"export const L2_CELL_CLIPS: Array<number | null> = {json.dumps(l2)};\n\n"
        "/** Exercise lessons: Arabic word -> clip, keyed by book lesson number (6, 9, 11). */\n"
        f"export const WORD_CLIPS: Record<number, Record<string, number>> = {{\n{word_ts},\n}};\n\n"
        "/** Lesson 10 (CD track 011): the clip that reads each letter's three forms together. */\n"
        f"export const SUKOON_GROUP_URLS: string[] = {json.dumps(urls, indent=2)};\n")
    open(TS_OUT, 'w', encoding='utf-8', newline='\n').write(ts)
    print('\n'.join(r for r in report if not r.startswith('   ')))


if __name__ == '__main__':
    main()
