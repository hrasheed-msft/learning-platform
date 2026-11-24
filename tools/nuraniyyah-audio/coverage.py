"""Coverage audit: which clips of each CD track does the course use, and which does it leave out?

Every clip the course does not use should be explainable: intro, the teacher spelling a letter out, a repeat,
or the closing jingle. A *reading* clip that is unused (short, not a spelled-out name) means a cell or word is
missing from the transcribed content, or was matched to the wrong clip.

Usage: python coverage.py [lesson ...]      (needs work/content.json, work/<NNN>.json)
"""
import json, os, re, sys
from align import WORK, load_track

TRACKS = {1: '002', 2: '003', 3: '004', 4: '005', 5: '006', 6: '007', 7: '008', 8: '009', 9: '010', 10: '011', 11: '013'}


def main():
    content = json.load(open(os.path.join(WORK, 'content.json'), encoding='utf-8'))
    plan = json.load(open(os.path.join(WORK, 'plan.json'), encoding='utf-8'))
    used = {}
    for u in content['urls']:
        m = re.search(r'cd(\d\d)-(\d{3})\.mp3', u)
        if m:
            used.setdefault(int(m.group(1)), set()).add(int(m.group(2)) - 1)
    for recipe in plan['recipes'].values():
        used.setdefault(10, set()).update(recipe['clips'])
    only = {int(a) for a in sys.argv[1:]}
    for lesson, track in TRACKS.items():
        if only and lesson not in only:
            continue
        clips = load_track(track)
        u = used.get(lesson, set())
        left = [c for c in clips[:-1] if c['i'] not in u]
        print(f'L{lesson} (track {track}): {len(clips)} clips, {len(u)} used, {len(left)} unused (jingle excluded)')
        for c in left:
            print(f"    {c['i']:3d} {c['dur']:5.2f}s  {c['text']}")


if __name__ == '__main__':
    main()
