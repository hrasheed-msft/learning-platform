"""Build the audio plan for the Nuraniyyah course from the labelled CD clips.

Reads  work/content.json  (from export-content.ts), work/<NNN>.json  (transcribe_all.py) and, when present,
       work/<NNN>.v2.json  (relabel.py)
Writes backend/prisma/helpers/nuraniyyah-audio.ts  and  work/plan.json

The CD reads the book in order, so the plan is built from the *sequence*, not from isolated matches:

* Lesson 2 cells   : the teacher reads every cell once, in order (track 003 = 2 intro clips + one clip per cell
                     + closing jingle). The counts must agree, so cell k is clip k + 2.
* Exercise words   : lessons 6, 9, 11 (tracks 007, 010, 013). A word the teacher spells out takes 2n - 1 clips (n
                     letters-with-ḥarakah: each letter spelled, then a reading of everything so far) and the last
                     clip reads the whole word; any other word is a single clip. structure.structural_plan walks the
                     track word by word with that rule, so each word's clip follows from the previous one. The walk
                     must end on the last clip before the closing jingle; the Whisper labels (align2) only
                     cross-check it.
* Lesson 10 groups : track 011 reads each letter as spelled clips followed by short clips for a/i/u;
                     the three short tail clips are joined into one clip per letter.
Everything else (letters, harakat, tanween, madd, leen ...) is placed by position in the TS content.
"""
import difflib, json, os, re
from align import WORK, load_track, norm, skel
from align2 import align_lesson, label_sim
from structure import structural_plan

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
TS_OUT = os.path.join(REPO, 'backend', 'prisma', 'helpers', 'nuraniyyah-audio.ts')

NAMES = {'ا': 'الف', 'أ': 'همزة', 'ب': 'با', 'ت': 'تا', 'ث': 'ثا', 'ج': 'جيم', 'ح': 'حا', 'خ': 'خا', 'د': 'دال', 'ذ': 'ذال',
         'ر': 'را', 'ز': 'زا', 'س': 'سين', 'ش': 'شين', 'ص': 'صاد', 'ض': 'ضاد', 'ط': 'طا', 'ظ': 'ظا', 'ع': 'عين', 'غ': 'غين',
         'ف': 'فا', 'ق': 'قاف', 'ك': 'كاف', 'ل': 'لام', 'م': 'ميم', 'ن': 'نون', 'و': 'واو', 'ه': 'ها', 'ء': 'همزة', 'ي': 'يا',
         'ى': 'يا', 'ة': 'تا', 'ؤ': 'واو', 'ئ': 'يا'}
EXERCISE_TRACKS = {6: '007', 9: '010', 11: '013'}


def sk(s):
    return re.sub('[اويءى]', '', norm(s))


def cell_sim(cell, label):
    target = ''.join(NAMES.get(c, '') for c in cell if c not in 'ـ')
    a, b = sk(target), sk(label)
    if not a or not b:
        return 0.0
    return difflib.SequenceMatcher(None, a, b).ratio()


def l2_positional(cells, clips):
    """Cell k is clip k + 2 (two intro clips first). Returns (clip per cell, similarity per cell)."""
    if len(clips) != len(cells) + 3:
        raise SystemExit(f'Lesson 2: {len(cells)} cells but {len(clips)} clips; expected cells + 3 '
                         '(2 intro clips, 1 closing jingle). Check the transcribed cells against the book.')
    return [k + 2 for k in range(len(cells))], [
        cell_sim(c, clips[k + 2]['text']) if clips[k + 2]['text'] else None for k, c in enumerate(cells)]


def exercise_plan(words, track):
    """Every word gets the clip the structural walk gives it; the Whisper labels only cross-check it."""
    res, clips, labels = align_lesson(words, track)
    walk, starts = structural_plan(words, clips, labels, res[0][0])
    return walk, starts, res, clips, labels


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
    l2, l2_sims = l2_positional(cells, t3)
    weak = [k for k, s in enumerate(l2_sims) if s is not None and s < 0.5]
    report.append(f"L2: {len(l2)}/{len(cells)} cells placed by order; {len(weak)} disagree with their label: {weak}")
    for i, c in enumerate(l2):
        report.append(f"   {i:3d} {cells[i]:8s} -> {c:3d} sim {l2_sims[i] if l2_sims[i] is None else round(l2_sims[i], 2)}  [{t3[c]['text']}]")

    # Exercise words
    word_clips = {}
    for lesson, track in EXERCISE_TRACKS.items():
        words = content['words'][str(lesson)]
        plan, starts, res, clips, labels = exercise_plan(words, track)
        word_clips[lesson] = {words[i]: c for i, c in plan.items()}
        sims = {i: label_sim(w, [t for t in labels.get(plan[i], []) if t]) for i, w in enumerate(words)}
        weak = [words[i] for i in sims if sims[i] < 0.5]
        differs = [words[i] for i in plan if i in res and res[i][0] != plan[i]]
        report.append(f"L{lesson}: {len(plan)}/{len(words)} words published; last word ends at clip {plan[len(words) - 1]} "
                      f"of {len(clips)}; label disagrees: {weak}; differs from the best label match: {len(differs)}")
        # lessons 6 and 9 end with their last word; lesson 11 is followed by extra reading practice
        if lesson in (6, 9) and plan[len(words) - 1] != len(clips) - 2:
            raise SystemExit(f'Lesson {lesson}: the walk ends at clip {plan[len(words) - 1]}, expected {len(clips) - 2}')
        for i, w in enumerate(words):
            report.append(f"   {i:3d} {w:12s} -> clips {starts[i]:3d}-{plan[i]:3d} sim {sims[i]:.2f} {labels.get(plan[i])}")

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
