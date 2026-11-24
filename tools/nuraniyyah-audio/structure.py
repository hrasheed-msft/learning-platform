"""Structure check for the spelled-out words of the exercise lessons.

When a word is spelled out, the CD reads one clip per letter-with-ḥarakah ("unit") and, from the second unit on, a
clip that reads everything so far: n units give n + (n - 1) = 2n - 1 clips and the *last* one is the whole word.
A read-only word is a single clip. So the distance between the reading clips of two consecutive words tells how many
clips the second word took, and it can be compared with 2n - 1.

Usage: python structure.py [6|9|11]
"""
import json, os, re, sys
from align import WORK, load_track, norm
from align2 import align_lesson, label_sim, load_labels

HARAKAT = '\u064E\u064F\u0650\u064B\u064C\u064D'
MADD = {'\u064E': 'اى', '\u064B': 'اى', '\u064F': 'و', '\u0650': 'ي'}


def units(word):
    """Number of letter-with-ḥarakah units the teacher spells for this word."""
    word = word.replace('\u0671', '\u0627')
    n, prev_vowel, i = 0, None, 0
    chars = [c for c in word if c != 'ـ']
    while i < len(chars):
        c = chars[i]
        if not ('\u0621' <= c <= '\u064A' or c == '\u0671'):
            i += 1
            continue
        j = i + 1
        marks = ''
        while j < len(chars) and not ('\u0621' <= chars[j] <= '\u064A'):
            marks += chars[j]
            j += 1
        vowel = next((m for m in marks if m in HARAKAT), None)
        if c == '\u0622':  # آ = hamzah + alif: one unit
            n += 1
            prev_vowel = '\u064E'
        elif vowel is None and c == '\u0627' and n:
            pass  # a silent alif (after tanwīn fatḥ, wāw al-jamāʿah, alif waṣl) is not spelled
        elif vowel is None and prev_vowel and c in MADD.get(prev_vowel, '') and '\u0670' not in marks:
            pass  # madd letter or small alif maqsūrah: part of the previous unit
        elif vowel is None and n:
            pass  # a resting letter (sukūn, līn, or a letter after alif waṣl) joins the previous unit
        else:
            n += 1
            prev_vowel = vowel
        i = j
    return n


def spelled_like(texts):
    """True when a clip's label sounds like the teacher naming a letter and its ḥarakah (garbled by Whisper)."""
    return any(re.search('فت|كسر|ضم|سكون|سقون|تين|تان|صغير|سكن', norm(t)) for t in texts if t)


def structural_plan(words, clips, labels, first_clip):
    """Walk the track word by word. Returns ({word index: clip}, first clip of each word's group).

    first_clip: the reading clip of the first word (the intro is too short to find the group start reliably).
    A word is read on its own (one clip) when the clip after the previous word is not a spelled-out letter;
    otherwise it takes 2n - 1 clips and the last one reads the whole word.
    """
    by_i = {c['i']: c for c in clips}
    p = first_clip - (2 * units(words[0]) - 1 if spelled_like(labels.get(first_clip - 1, [])) else 1)
    out, starts = {}, {}
    for k, w in enumerate(words):
        nxt = p + 1
        texts = [t for t in labels.get(nxt, []) if t]
        own = label_sim(w, texts) if texts else 0.0
        # a spelled-out letter is long (>= 1.45 s) or names a letter and its ḥarakah; a clip that already reads
        # the word is not part of a group
        spelled = (spelled_like(texts) or by_i[nxt]['dur'] >= 1.45) and own < 0.8
        c = p + 2 * units(w) - 1 if spelled else nxt
        out[k], starts[k] = c, nxt
        p = c
    return out, starts


if __name__ == '__main__':
    lesson = sys.argv[1]
    track = {'6': '007', '9': '010', '11': '013'}[lesson]
    words = json.load(open(os.path.join(WORK, 'content.json'), encoding='utf-8'))['words'][lesson]
    clips = load_track(track)
    labels = load_labels(track)
    first = align_lesson(words, track)[0][0][0]
    plan, starts = structural_plan(words, clips, labels, first)
    low = 0
    for k, w in enumerate(words):
        c = plan[k]
        s = label_sim(w, [t for t in labels.get(c, []) if t])
        low += s < 0.5
        print(f'{k:3d} {w:12s} group {starts[k]:3d}-{c:3d} sim {s:.2f} {labels.get(c)}{"   <-- check" if s < 0.5 else ""}')
    print(f'last word ends at clip {plan[len(words) - 1]}, track has {len(clips)} clips (the last one is the jingle); '
          f'{low} labels disagree')
