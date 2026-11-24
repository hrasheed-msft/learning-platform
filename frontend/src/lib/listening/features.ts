/**
 * Speech features for the listening lab: a port of tools/listening-spike/features.py (same maths, so results can be
 * compared with the Python evaluation). Pure functions, no browser APIs.
 */
export const SAMPLE_RATE = 16000;
const FRAME = 400; // 25 ms
const HOP = 160; // 10 ms
const NFFT = 512;
const NMEL = 40;

/** Cut leading and trailing silence (energy relative to the loudest 20 ms). */
export function trim(x: Float32Array, db = -35, padSeconds = 0.02): Float32Array {
  const n = 320;
  const m = Math.floor(x.length / n);
  if (m === 0) return x;
  const e = new Float64Array(m);
  let max = -Infinity;
  for (let i = 0; i < m; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += x[i * n + j] * x[i * n + j];
    e[i] = 20 * Math.log10(Math.sqrt(s / n) + 1e-9);
    if (e[i] > max) max = e[i];
  }
  let first = -1;
  let last = -1;
  for (let i = 0; i < m; i++) {
    if (e[i] > max + db) {
      if (first < 0) first = i;
      last = i;
    }
  }
  if (first < 0) return x;
  const pad = Math.floor(padSeconds * SAMPLE_RATE);
  return x.slice(Math.max(0, first * n - pad), Math.min(x.length, (last + 1) * n + pad));
}

const mel = (f: number) => 2595 * Math.log10(1 + f / 700);
const imel = (m: number) => 700 * (10 ** (m / 2595) - 1);

const filterbankCache = new Map<number, Float64Array[]>();

/** Triangular mel filters; warp > 1 moves the centres up (vocal-tract length normalisation of the query). */
export function filterbank(warp = 1): Float64Array[] {
  const cached = filterbankCache.get(warp);
  if (cached) return cached;
  const lo = mel(80);
  const hi = mel(7600);
  const bins: number[] = [];
  for (let i = 0; i < NMEL + 2; i++) {
    const f = imel(lo + ((hi - lo) * i) / (NMEL + 1));
    const w = Math.min(Math.max(f * warp, 0), SAMPLE_RATE / 2 - 1);
    bins.push(Math.floor(((NFFT + 1) * w) / SAMPLE_RATE));
  }
  const fb: Float64Array[] = [];
  for (let i = 0; i < NMEL; i++) {
    const row = new Float64Array(NFFT / 2 + 1);
    const [l, c, r] = [bins[i], bins[i + 1], bins[i + 2]];
    if (c > l) for (let k = l; k < c; k++) row[k] = (k - l) / (c - l);
    if (r > c) for (let k = c; k < r; k++) row[k] = (r - k) / (r - c);
    fb.push(row);
  }
  filterbankCache.set(warp, fb);
  return fb;
}

/** In-place radix-2 FFT. */
function fft(re: Float64Array, im: Float64Array) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1;
      let ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k;
        const b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci;
        const ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr;
        im[b] = im[a] - ti;
        re[a] += tr;
        im[a] += ti;
        const nr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = nr;
      }
    }
  }
}

const hamming = Float64Array.from({ length: FRAME }, (_, i) => 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (FRAME - 1)));

/** Power spectra of every frame (pre-emphasised, Hamming-windowed). Independent of the warp, so it is computed once. */
export function powerSpectra(signal: Float32Array): Float64Array[] {
  const x = new Float64Array(Math.max(signal.length, FRAME));
  x[0] = signal[0] ?? 0;
  for (let i = 1; i < signal.length; i++) x[i] = signal[i] - 0.97 * signal[i - 1];
  const frames = 1 + Math.floor((x.length - FRAME) / HOP);
  const out: Float64Array[] = [];
  const re = new Float64Array(NFFT);
  const im = new Float64Array(NFFT);
  for (let t = 0; t < frames; t++) {
    re.fill(0);
    im.fill(0);
    for (let i = 0; i < FRAME; i++) re[i] = x[t * HOP + i] * hamming[i];
    fft(re, im);
    const p = new Float64Array(NFFT / 2 + 1);
    for (let k = 0; k <= NFFT / 2; k++) p[k] = re[k] * re[k] + im[k] * im[k];
    out.push(p);
  }
  return out;
}

const NCEP = 13;
const dctBasis = Array.from({ length: NCEP }, (_, k) =>
  Float64Array.from({ length: NMEL }, (_, n) => Math.cos((Math.PI * k * (2 * n + 1)) / (2 * NMEL)) * Math.sqrt(2 / NMEL)),
);

/** MFCCs (c1..c12) normalised per utterance, plus delta features: frames x 24. */
export function mfccFromSpectra(spectra: Float64Array[], warp = 1): Float64Array[] {
  const fb = filterbank(warp);
  const cep: Float64Array[] = spectra.map((p) => {
    const logmel = new Float64Array(NMEL);
    for (let m = 0; m < NMEL; m++) {
      let s = 0;
      const f = fb[m];
      for (let k = 0; k < f.length; k++) if (f[k] !== 0) s += p[k] * f[k];
      logmel[m] = Math.log(s + 1e-8);
    }
    const c = new Float64Array(NCEP - 1);
    for (let k = 1; k < NCEP; k++) {
      let s = 0;
      for (let n = 0; n < NMEL; n++) s += logmel[n] * dctBasis[k][n];
      c[k - 1] = s;
    }
    return c;
  });
  const dims = NCEP - 1;
  const mean = new Float64Array(dims);
  const sd = new Float64Array(dims);
  for (const c of cep) for (let d = 0; d < dims; d++) mean[d] += c[d] / cep.length;
  for (const c of cep) for (let d = 0; d < dims; d++) sd[d] += (c[d] - mean[d]) ** 2 / cep.length;
  for (let d = 0; d < dims; d++) sd[d] = Math.sqrt(sd[d]);
  for (const c of cep) for (let d = 0; d < dims; d++) c[d] = (c[d] - mean[d]) / (sd[d] + 1e-6);
  const at = (t: number) => cep[Math.min(Math.max(t, 0), cep.length - 1)];
  return cep.map((c, t) => {
    const out = new Float64Array(dims * 2);
    out.set(c);
    for (let d = 0; d < dims; d++) out[dims + d] = (at(t + 2)[d] - at(t - 2)[d] + 2 * (at(t + 1)[d] - at(t - 1)[d])) / 10;
    return out;
  });
}

export function mfcc(signal: Float32Array, warp = 1): Float64Array[] {
  return mfccFromSpectra(powerSpectra(trim(signal)), warp);
}

/** Length-normalised DTW distance between two feature sequences. */
export function dtw(a: Float64Array[], b: Float64Array[], band = 0.4): number {
  const n = a.length;
  const m = b.length;
  const dims = a[0].length;
  const w = Math.max(Math.floor(band * Math.max(n, m)), Math.abs(n - m) + 2);
  let prev = new Float64Array(m + 1).fill(Infinity);
  let cur = new Float64Array(m + 1);
  prev[0] = 0;
  for (let i = 1; i <= n; i++) {
    cur.fill(Infinity);
    const lo = Math.max(1, i - w);
    const hi = Math.min(m, i + w);
    for (let j = lo; j <= hi; j++) {
      let s = 0;
      for (let d = 0; d < dims; d++) {
        const diff = a[i - 1][d] - b[j - 1][d];
        s += diff * diff;
      }
      const cost = Math.sqrt(s) / Math.sqrt(dims);
      cur[j] = cost + Math.min(prev[j], cur[j - 1], prev[j - 1]);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[m] / (n + m);
}
