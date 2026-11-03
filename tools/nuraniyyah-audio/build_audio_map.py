"""Build the word -> clip map for the course and publish the matched clips.

1. Lesson 1 letters: the 30 single-letter clips of track 002 follow the book's alphabet order.
2. Lesson 2 letter combinations: matched on spelled letter names against track 003.
3. All other practice words: monotonic alignment of the Whisper labels (see align.py).

Outputs
  work/audio-map.json                    {arabic: {lesson, track, clip, sim}}
  <repo>/frontend/public/audio/nuraniyyah/cdNN-CCC.mp3   the clips that are used
  <repo>/backend/prisma/helpers/nuraniyyah-audio.ts       WORD_AUDIO lookup (generated)
"""
import json, os, re, shutil, glob, difflib
from align import WORK, norm, skel, align, load_track
import export_clips as ex

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
PUBLIC = os.path.join(REPO, 'frontend', 'public', 'audio', 'nuraniyyah')
TS_OUT = os.path.join(REPO, 'backend', 'prisma', 'helpers', 'nuraniyyah-audio.ts')
SPLIT = ex.DEST

MIN_SIM = 0.85
NAME_SIM = 0.9
# Practice words are only matched against the CD tracks that cover the same book pages.
ALLOWED_TRACKS = {
    'nuraniyyah-lesson-5': ['007'],
    'nuraniyyah-lesson-8': ['010'],
    'nuraniyyah-lesson-10': ['013'],
    'nuraniyyah-lesson-11': ['014', '015'],
    'nuraniyyah-lesson-12': ['015'],
    'nuraniyyah-lesson-13': ['016', '017'],
    'nuraniyyah-lesson-14': ['017', '018'],
    'nuraniyyah-lesson-15': ['018'],
}
NAMES = {'ا': 'الف', 'أ': 'الف', 'ب': 'با', 'ت': 'تا', 'ث': 'ثا', 'ج': 'جيم', 'ح': 'حا', 'خ': 'خا', 'د': 'دال', 'ذ': 'ذال',
         'ر': 'را', 'ز': 'زا', 'س': 'سين', 'ش': 'شين', 'ص': 'صاد', 'ض': 'ضاد', 'ط': 'طا', 'ظ': 'ظا', 'ع': 'عين', 'غ': 'غين',
         'ف': 'فا', 'ق': 'قاف', 'ك': 'كاف', 'ل': 'لام', 'م': 'ميم', 'ن': 'نون', 'و': 'واو', 'ه': 'ها', 'ء': 'همزة', 'ي': 'يا', 'ى': 'يا', 'ة': 'تا'}


def usable_word(it):
    return len(norm(it['ar'])) >= 2 and ' · ' not in it['tr']


def accept(word, clip_text):
    sw, sc = skel(word), skel(clip_text)
    if len(sw) < 3:
        return norm(word) == norm(clip_text)
    return len(sc) >= len(sw)


def main():
    words = json.load(open(os.path.join(WORK, 'words.json'), encoding='utf-8'))
    tracks = sorted(t for t in ex.LESSONS)
    data = {t: load_track(t) for t in tracks if os.path.exists(os.path.join(WORK, t + '.json'))}
    amap = {}
    log = []

    # 1. letters
    t002 = data['002']
    letters = [it for it in words['nuraniyyah-lesson-1'][:29]]
    for k, it in enumerate(letters):
        clip = 3 + k if k <= 27 else 32
        amap[it['ar']] = {'lesson': 'nuraniyyah-lesson-1', 'track': '002', 'clip': clip, 'sim': 1.0}
        log.append(f"L1 {it['ar']} -> 002 clip {clip} [{t002[clip]['text']}]")

    # 2. letter combinations (Lesson 2): compare spelled names with the Whisper labels
    t003 = data['003']
    for it in words['nuraniyyah-lesson-2']:
        if ' – ' not in it['tr']:
            continue
        target = ''.join(NAMES[c] for c in it['ar'])
        best = (0, None)
        for c in t003[2:-1]:
            if not c['text']:
                continue
            s = difflib.SequenceMatcher(None, norm(target).replace('ء', ''), norm(c['text']).replace('ء', '')).ratio()
            if s > best[0]:
                best = (s, c)
        if best[1] is not None and best[0] >= NAME_SIM:
            amap[it['ar']] = {'lesson': 'nuraniyyah-lesson-2', 'track': '003', 'clip': best[1]['i'], 'sim': round(best[0], 2)}
            log.append(f"L2 {it['ar']} -> 003 clip {best[1]['i']} sim {best[0]:.2f} [{best[1]['text']}]")
        else:
            log.append(f"L2 {it['ar']} -> no confident match (best {best[0]:.2f})")

    # 3. practice words
    exercise_tracks_all = [t for t in data if t not in ('002', '003', '004')]
    for slug, items in words.items():
        exercise_tracks = [t for t in ALLOWED_TRACKS.get(slug, []) if t in exercise_tracks_all]
        if not exercise_tracks:
            continue
        uniq = []
        for it in items:
            if usable_word(it) and it['ar'] not in [u['ar'] for u in uniq] and it['ar'] not in amap:
                uniq.append(it)
        if not uniq:
            continue
        taken_by_track = {t: set() for t in exercise_tracks}
        found = {}
        # best track first, then fill the rest from the other tracks
        order = sorted(exercise_tracks, key=lambda t: -len(align([u['ar'] for u in uniq], data[t], set())))
        for t in order:
            remaining = [u for u in uniq if u['ar'] not in found]
            if not remaining:
                break
            res = align([u['ar'] for u in remaining], data[t], taken_by_track[t])
            for idx, (j, s) in res.items():
                u = remaining[idx]
                c = data[t][j]
                if s >= MIN_SIM and accept(u['ar'], c['text']):
                    found[u['ar']] = {'lesson': slug, 'track': t, 'clip': c['i'], 'sim': s}
                    taken_by_track[t].add(c['i'])
                    log.append(f"{slug[-9:]} {u['ar']} ({u['tr']}) -> {t} clip {c['i']} sim {s} [{c['text']}]")
        amap.update(found)
        log.append(f"== {slug}: {len(found)}/{len(uniq)} words matched")

    # A clip can only be one word: when two words claim the same clip, the better match keeps it.
    claims = {}
    for ar, m in amap.items():
        claims.setdefault((m['track'], m['clip']), []).append((m['sim'], ar))
    for key, group in claims.items():
        if len(group) > 1 and not (key[0] == '002'):
            group.sort(reverse=True)
            for _, ar in group[1:]:
                log.append(f'dropped {ar}: clip {key} is a better match for {group[0][1]}')
                del amap[ar]

    json.dump(amap, open(os.path.join(WORK, 'audio-map.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    open(os.path.join(WORK, 'map-report.txt'), 'w', encoding='utf-8').write('\n'.join(log))

    # publish clips + generated lookup
    os.makedirs(PUBLIC, exist_ok=True)
    for f in glob.glob(os.path.join(PUBLIC, '*.mp3')):
        os.remove(f)
    lookup = {}
    for ar, m in amap.items():
        num, slug = ex.LESSONS[m['track']]
        src = os.path.join(SPLIT, f'lesson-{num:02d}-{slug}', f"{m['clip'] + 1:03d}.mp3")
        name = f"cd{num:02d}-{m['clip'] + 1:03d}.mp3"
        shutil.copyfile(src, os.path.join(PUBLIC, name))
        lookup[ar] = f'/audio/nuraniyyah/{name}'
    body = ',\n'.join(f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v)}" for k, v in sorted(lookup.items()))
    open(TS_OUT, 'w', encoding='utf-8', newline='\n').write(
        "/**\n * Pronunciation clips for the Nūrāniyyah course.\n *\n"
        " * GENERATED by tools/nuraniyyah-audio (build_audio_map.py) from the \"Qaidah Nuraniyyah\" CD tracks.\n"
        " * Keys are the exact Arabic strings shown in the lessons; values are URLs under /audio/nuraniyyah/.\n */\n"
        f"export const WORD_AUDIO: Record<string, string> = {{\n{body},\n}};\n")
    print('mapped', len(amap), 'items;', len(set(lookup.values())), 'clips published')


if __name__ == '__main__':
    main()
