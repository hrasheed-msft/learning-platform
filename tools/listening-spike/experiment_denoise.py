"""Does spectral subtraction help the noisy child conditions?  python experiment_denoise.py"""
import numpy as np
from scipy.fftpack import dct
import features as F
from augment import channel, noise, voice
from dataset import read_wav, WORK
from evaluate import CONDITIONS, load_set, summarise
from features import dtw, trim

WARPS = [1.0, 1.2, 1.4, 1.6, 1.8]


def power_spectra(x):
    x = np.append(x[0], x[1:] - 0.97 * x[:-1])
    if len(x) < F.FRAME:
        x = np.pad(x, (0, F.FRAME - len(x)))
    n = 1 + (len(x) - F.FRAME) // F.HOP
    idx = np.arange(F.FRAME)[None, :] + F.HOP * np.arange(n)[:, None]
    return np.abs(np.fft.rfft(x[idx] * np.hamming(F.FRAME), F.NFFT)) ** 2


def feats(spec, warp, subtract):
    if subtract:
        floor = np.percentile(spec, 15, axis=0, keepdims=True)  # the quietest frames are the background
        spec = np.maximum(spec - subtract * floor, 0.05 * spec)
    c = dct(np.log(spec @ F.filterbank(warp=warp).T + 1e-8), type=2, axis=1, norm='ortho')[:, 1:13]
    c = (c - c.mean(0)) / (c.std(0) + 1e-6)
    p = np.pad(c, ((2, 2), (0, 0)), mode='edge')
    d = (p[4:] - p[:-4] + 2 * (p[3:-1] - p[1:-3])) / 10
    return np.hstack([c, d])


def main():
    index, clips = load_set()
    rng = np.random.default_rng(7)
    refs_spec = [power_spectra(trim(x)) for x in clips]
    for cond in CONDITIONS[3:]:
        name, shift, tempo, snr = cond
        qs = [noise(channel(voice(x, shift, tempo), rng), snr, rng) for x in clips]
        for subtract in (0, 1.0, 1.5):
            refs = [feats(s, 1.0, 0) for s in refs_spec]  # teacher clips are clean
            D = []
            for q in qs:
                sp = power_spectra(trim(q))
                fs = [feats(sp, w, subtract) for w in WARPS]
                D.append([min(dtw(f, r) for f in fs) for r in refs])
            r = summarise(np.array(D), index)
            print(f"{name:34s} subtract {subtract}: syllable {r['syllable']:.2f} letter {r['letter']:.2f} vowel {r['vowel']:.2f} "
                  f"AUC letter {r['auc_wrong_letter']:.2f} vowel {r['auc_wrong_vowel']:.2f}", flush=True)


if __name__ == '__main__':
    main()
