import { dtw, mfccFromSpectra, powerSpectra, trim } from './features';

export interface Reference {
  id: string;
  letter: string;
  vowel: 'a' | 'i' | 'u';
  features: Float64Array[];
}

/** Vocal-tract warps tried on the query so a child's (or a woman's) higher formants still line up with the teacher's. */
export const VTLN_WARPS = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8];

/** Letters whose sounds are too close to tell apart reliably in v1; they are accepted for one another. */
export const LENIENT_LETTER_GROUPS: string[][] = [
  ['ق', 'ك'],
  ['ع', 'ء', 'أ'],
  ['ح', 'ه'],
];

export const sameLetterFamily = (a: string, b: string) =>
  a === b || LENIENT_LETTER_GROUPS.some((g) => g.includes(a) && g.includes(b));

export function referenceFeatures(signal: Float32Array): Float64Array[] {
  return mfccFromSpectra(powerSpectra(trim(signal)));
}

/** Distance from the recording to every reference (smaller = closer), keeping the best vocal-tract warp per reference. */
export function distances(signal: Float32Array, refs: Reference[], warps = VTLN_WARPS): number[] {
  const spectra = powerSpectra(trim(signal));
  const feats = warps.map((w) => mfccFromSpectra(spectra, w));
  return refs.map((r) => Math.min(...feats.map((f) => dtw(f, r.features))));
}

export type Verdict =
  | { kind: 'match' }
  | { kind: 'wrong-vowel'; heard: Reference }
  | { kind: 'wrong-letter'; heard: Reference }
  | { kind: 'not-close'; heard: Reference }
  | { kind: 'unclear' };

export interface ClassifyOptions {
  /** Above this distance the recording is not clear enough to judge (too noisy, too short, not speech). */
  maxDistance: number;
  /**
   * Accept the target when its distance is within this fraction of the closest clip's. Children and noisy rooms make
   * near-ties common; a small tolerance trades a few accepted look-alikes for far fewer wrongly rejected right answers.
   */
  tolerance: number;
}

/** Calibrated on simulated voices (tools/listening-spike): speech lands at 0.30-0.45, noise and hum at 0.47-0.54. */
export const DEFAULT_OPTIONS: ClassifyOptions = { maxDistance: 0.5, tolerance: 0.06 };

/**
 * Decide what the child said by finding the closest teacher clip. Mistakes are told apart by what the closest clip is:
 * the same letter with another vowel ("check the vowel"), another letter with the same vowel ("different letter"),
 * or neither ("not close").
 */
export function classify(
  dist: number[],
  refs: Reference[],
  target: number,
  options: Partial<ClassifyOptions> = {},
): Verdict {
  const { maxDistance, tolerance } = { ...DEFAULT_OPTIONS, ...options };
  let best = 0;
  dist.forEach((d, i) => {
    if (d < dist[best]) best = i;
  });
  if (!isFinite(dist[best]) || dist[best] > maxDistance) return { kind: 'unclear' };
  if (dist[target] <= dist[best] * (1 + tolerance)) return { kind: 'match' };
  const want = refs[target];
  const heard = refs[best];
  if (sameLetterFamily(heard.letter, want.letter) && heard.vowel === want.vowel) return { kind: 'match' };
  if (sameLetterFamily(heard.letter, want.letter)) return { kind: 'wrong-vowel', heard };
  if (heard.vowel === want.vowel) return { kind: 'wrong-letter', heard };
  return { kind: 'not-close', heard };
}
