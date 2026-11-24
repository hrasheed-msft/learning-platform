"""Writes 'fake microphone' wav files for tools/listening-spike/browser_check.mjs.

Each case is a child-like voice (x1.45, other microphone, 20 dB room noise) saying either the target syllable or the same
letter with another vowel, preceded by 0.8 s of near silence and followed by 3 s, like a real recording.
"""
import json, os, random
import numpy as np
from augment import channel, noise, voice
from dataset import WORK, read_wav, write_wav

OUT = os.path.join(WORK, 'fake2')


def main():
    index = json.load(open(os.path.join(WORK, 'syllables.json'), encoding='utf-8'))
    names = [i['name'] for i in index]
    rng = np.random.default_rng(11)
    random.seed(5)
    os.makedirs(OUT, exist_ok=True)

    def quiet(seconds):
        return noise(np.zeros(int(16000 * seconds), dtype=np.float32) + 1e-3, 40, rng)

    cases = []
    for target in random.sample(names, 12):
        letter = target.split('-')[0]
        wrong = random.choice([n for n in names if n.startswith(letter + '-') and n != target])
        for kind, said in (('right', target), ('wrong-vowel', wrong)):
            x = read_wav(os.path.join(WORK, 'syllables', said + '.wav'))
            y = noise(channel(voice(x, 1.45, 0.9), rng), 20, rng)
            path = os.path.join(OUT, f'{kind}-{target}-{said}.wav')
            write_wav(path, np.concatenate([quiet(0.8), y * 1.5, quiet(3.0)]))
            cases.append({'file': os.path.abspath(path), 'target': target, 'said': said, 'kind': kind})
    json.dump(cases, open(os.path.join(OUT, 'cases.json'), 'w'), indent=1)
    print(len(cases), 'cases')


if __name__ == '__main__':
    main()
