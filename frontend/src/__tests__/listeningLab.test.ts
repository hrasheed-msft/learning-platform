// @ts-nocheck -- reads the exported wav clips with Node's fs, and the frontend project has no Node typings
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { dtw, mfcc } from '@/lib/listening/features';
import { classify, distances, referenceFeatures, sameLetterFamily, type Reference } from '@/lib/listening/score';
import { parseWav16 } from '@/lib/listening/recorder';

const lab = join(__dirname, '../../public/listening-lab');
const wav = (name: string) => {
  const b = readFileSync(join(lab, 'syllables', `${name}.wav`));
  return parseWav16(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};

describe('listening lab features', () => {
  // expected values come from tools/listening-spike/features.py on the same clips
  it('matches the Python MFCC reference implementation', () => {
    const f = mfcc(wav('t-a'));
    expect(f).toHaveLength(40);
    expect(f[0]).toHaveLength(24);
    [-1.3752, 0.8578, -0.2721, 0.1426, 2.2823, -0.3804].forEach((v, i) => expect(f[0][i]).toBeCloseTo(v, 2));
    [[0, -0.0334], [5, 0.2316], [12, -0.1177], [20, 0.3862]].forEach(([d, v]) => expect(f[5][d]).toBeCloseTo(v, 2));
    const warped = mfcc(wav('t-a'), 1.3);
    [0.6752, -1.5354, -1.1243, 0.3676, -0.0918].forEach((v, i) => expect(warped[3][i]).toBeCloseTo(v, 2));
  });

  it('matches the Python DTW distances', () => {
    const a = mfcc(wav('t-a'));
    expect(dtw(a, a)).toBeCloseTo(0, 6);
    expect(dtw(a, mfcc(wav('t-i')))).toBeCloseTo(0.44057, 3);
    expect(dtw(a, mfcc(wav('th-a')))).toBeCloseTo(0.4245, 3);
    expect(dtw(mfcc(wav('t-a'), 1.3), mfcc(wav('t-i')))).toBeCloseTo(0.51014, 3);
  });
});

describe('listening lab classification', () => {
  const names = ['t-a', 't-i', 't-u', 'th-a', 'th-i', 'th-u', 'j-a', 'j-i', 'j-u'];
  const refs: Reference[] = names.map((n) => {
    const [l, v] = n.split('-');
    const letter = { t: 'ت', th: 'ث', j: 'ج' }[l]!;
    return { id: n, letter, vowel: v as Reference['vowel'], features: referenceFeatures(wav(n)) };
  });
  const verdict = (said: string, target: string) => {
    const dist = distances(wav(said), refs, [1.0]);
    return classify(dist, refs, names.indexOf(target));
  };

  it('accepts the teacher\'s own clip', () => {
    expect(verdict('t-i', 't-i').kind).toBe('match');
  });

  it('tells a wrong vowel from a wrong letter', () => {
    expect(verdict('t-u', 't-a').kind).toBe('wrong-vowel');
    expect(verdict('j-a', 't-a').kind).toBe('wrong-letter');
    expect(verdict('j-u', 't-a').kind).toBe('not-close');
  });

  it('says it cannot judge a recording that is far from every clip', () => {
    const noise = Float32Array.from({ length: 8000 }, (_, i) => Math.sin(i * 0.9) * 0.2 * Math.sin(i * 0.002));
    const dist = distances(noise, refs, [1.0]);
    expect(classify(dist, refs, 0, { maxDistance: 0.01 }).kind).toBe('unclear');
  });

  it('forgives a near tie in favour of the target, but not a clear miss', () => {
    const rs: Reference[] = [
      { id: 'a', letter: 'ت', vowel: 'a', features: [] },
      { id: 'b', letter: 'ث', vowel: 'a', features: [] },
    ];
    expect(classify([0.4, 0.38], rs, 0).kind).toBe('match'); // 5% behind the closest clip
    expect(classify([0.4, 0.3], rs, 0).kind).toBe('wrong-letter');
    expect(classify([0.4, 0.38], rs, 0, { tolerance: 0 }).kind).toBe('wrong-letter');
  });

  it('treats letters with a very close pronunciation point as the same in v1', () => {
    expect(sameLetterFamily('ق', 'ك')).toBe(true);
    expect(sameLetterFamily('ع', 'ء')).toBe(true);
    expect(sameLetterFamily('ت', 'ث')).toBe(false);
  });
});
