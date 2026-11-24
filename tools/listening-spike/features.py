"""Audio features and DTW for the listening spike (numpy only, so the same maths can be ported to the browser)."""
import numpy as np
from scipy.fftpack import dct

SR = 16000
FRAME, HOP, NFFT = 400, 160, 512  # 25 ms / 10 ms


def trim(x, db=-35.0, pad=0.02):
    """Cut leading and trailing silence (energy threshold relative to the loudest 20 ms)."""
    n = 320
    m = len(x) // n
    if m == 0:
        return x
    e = 20 * np.log10(np.sqrt((x[: m * n].reshape(m, n) ** 2).mean(axis=1)) + 1e-9)
    idx = np.where(e > e.max() + db)[0]
    a, b = max(0, idx[0] * n - int(pad * SR)), min(len(x), (idx[-1] + 1) * n + int(pad * SR))
    return x[a:b]


def mel(f):
    return 2595 * np.log10(1 + f / 700)


def imel(m):
    return 700 * (10 ** (m / 2595) - 1)


def filterbank(nmel=40, lo=80.0, hi=7600.0, warp=1.0):
    """Triangular mel filters. warp > 1 moves the centres up (vocal-tract length normalisation of the query)."""
    pts = imel(np.linspace(mel(lo), mel(hi), nmel + 2))
    pts = np.clip(pts * warp, 0, SR / 2 - 1)
    bins = np.floor((NFFT + 1) * pts / SR).astype(int)
    fb = np.zeros((nmel, NFFT // 2 + 1))
    for i in range(nmel):
        l, c, r = bins[i], bins[i + 1], bins[i + 2]
        if c > l:
            fb[i, l:c] = (np.arange(l, c) - l) / (c - l)
        if r > c:
            fb[i, c:r] = (r - np.arange(c, r)) / (r - c)
    return fb


def logmel(x, warp=1.0, nmel=40):
    x = np.append(x[0], x[1:] - 0.97 * x[:-1])
    if len(x) < FRAME:
        x = np.pad(x, (0, FRAME - len(x)))
    n = 1 + (len(x) - FRAME) // HOP
    idx = np.arange(FRAME)[None, :] + HOP * np.arange(n)[:, None]
    frames = x[idx] * np.hamming(FRAME)
    spec = np.abs(np.fft.rfft(frames, NFFT)) ** 2
    return np.log(spec @ filterbank(nmel, warp=warp).T + 1e-8)


def mfcc(x, warp=1.0, ncep=13, deltas=True, cmvn=True):
    c = dct(logmel(trim(x), warp), type=2, axis=1, norm='ortho')[:, 1:ncep]
    if cmvn:
        c = (c - c.mean(axis=0)) / (c.std(axis=0) + 1e-6)
    if deltas:
        p = np.pad(c, ((2, 2), (0, 0)), mode='edge')
        d = (p[4:] - p[:-4] + 2 * (p[3:-1] - p[1:-3])) / 10
        c = np.hstack([c, d])
    return c


def dtw(a, b, band=0.4, metric='euclid'):
    """Length-normalised DTW distance between two feature sequences (frames x dims)."""
    n, m = len(a), len(b)
    if metric == 'cosine':
        an = a / (np.linalg.norm(a, axis=1, keepdims=True) + 1e-9)
        bn = b / (np.linalg.norm(b, axis=1, keepdims=True) + 1e-9)
        cost = 1 - an @ bn.T
    else:
        cost = np.sqrt(((a[:, None, :] - b[None, :, :]) ** 2).sum(axis=2)) / np.sqrt(a.shape[1])
    w = max(int(band * max(n, m)), abs(n - m) + 2)
    acc = np.full((n + 1, m + 1), np.inf)
    acc[0, 0] = 0
    for i in range(1, n + 1):
        lo, hi = max(1, i - w), min(m, i + w)
        for j in range(lo, hi + 1):
            acc[i, j] = cost[i - 1, j - 1] + min(acc[i - 1, j], acc[i, j - 1], acc[i - 1, j - 1])
    return acc[n, m] / (n + m)
