"""Dataset for the listening-mode spike: single syllables cut from CD track 011 (lesson 10, sukūn).

The teacher reads every letter as  أَبْ  إِبْ  أُبْ  and, for ten of the sixteen letters, also as three separate short
clips (ab / ib / ub). Those 30 clips are a small, clean test set for the two mistakes a child can make:

  * wrong letter  (same vowel, different consonant, e.g. at / ath)   -> "that was a different letter"
  * wrong vowel   (same consonant, different vowel, e.g. at / it)    -> "right letter, check the vowel"

Output: work/syllables/<letter>-<vowel>.wav (16 kHz mono) and work/syllables.json
"""
import json, os, shutil, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.join(HERE, '..', 'nuraniyyah-audio')
sys.path.insert(0, TOOLS)
from analyze import SR, load  # noqa: E402
from align import load_track  # noqa: E402
from build_audio_plan import sukoon_groups  # noqa: E402

WORK = os.path.join(HERE, 'work')
SRC = os.environ.get('NURANIYYAH_MP3_DIR', r'C:\Users\hrasheed\Dropbox\Nuraniyyah-MP3')
LETTERS = ['ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ']
NAMES = {'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's',
         'ش': 'sh', 'ص': 'S', 'ض': 'D', 'ط': 'T', 'ظ': 'Z'}
VOWELS = ['a', 'i', 'u']
PAD = 0.04


def write_wav(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


def read_wav(path):
    with wave.open(path, 'rb') as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768.0


def main():
    import glob
    clips = load_track('011')
    x = load(glob.glob(os.path.join(SRC, '011-*.mp3'))[0])
    os.makedirs(os.path.join(WORK, 'syllables'), exist_ok=True)
    index = []
    for k, (s, damma, e) in enumerate(sukoon_groups(clips)):
        tail = list(range(damma + 1, e + 1))
        if len(tail) != 3:
            continue
        for v, c in zip(VOWELS, tail):
            a, b = max(0, clips[c]['start'] - PAD), clips[c]['end'] + PAD
            name = f'{NAMES[LETTERS[k]]}-{v}'
            write_wav(os.path.join(WORK, 'syllables', name + '.wav'), x[int(a * SR): int(b * SR)])
            index.append({'name': name, 'letter': LETTERS[k], 'latin': NAMES[LETTERS[k]], 'vowel': v, 'clip': c,
                          'dur': clips[c]['dur']})
    json.dump(index, open(os.path.join(WORK, 'syllables.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    # the same clips are the teacher references of the in-browser listening lab
    lab = os.path.join(HERE, '..', '..', 'frontend', 'public', 'listening-lab')
    os.makedirs(os.path.join(lab, 'syllables'), exist_ok=True)
    for i in index:
        shutil.copyfile(os.path.join(WORK, 'syllables', i['name'] + '.wav'), os.path.join(lab, 'syllables', i['name'] + '.wav'))
    json.dump([{k: i[k] for k in ('name', 'letter', 'vowel')} for i in index],
              open(os.path.join(lab, 'syllables.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(index), 'syllables,', len({i['letter'] for i in index}), 'letters; durations',
          round(min(i['dur'] for i in index), 2), '-', round(max(i['dur'] for i in index), 2), 's')


if __name__ == '__main__':
    main()
