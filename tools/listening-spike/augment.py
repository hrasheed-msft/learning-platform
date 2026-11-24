"""Simulated 'other voices' for the spike: formant/pitch shift, tempo change and noise.

A real child is not just a shifted adult, so these numbers are an optimistic proxy until real recordings exist.
"""
import subprocess
import numpy as np
import imageio_ffmpeg

SR = 16000
FF = imageio_ffmpeg.get_ffmpeg_exe()


def voice(x, shift=1.0, tempo=1.0):
    """shift > 1 raises pitch and formants together (a smaller vocal tract); tempo < 1 slows the speech down."""
    if shift == 1.0 and tempo == 1.0:
        return x.copy()
    # asetrate raises pitch+formants and shortens the clip to D/shift; atempo then brings it to D/tempo
    t = tempo / shift
    chain = []  # atempo accepts 0.5-2.0 per stage
    while t > 2.0:
        chain.append(2.0)
        t /= 2.0
    while t < 0.5:
        chain.append(0.5)
        t /= 0.5
    chain.append(t)
    flt = f'asetrate={int(SR * shift)},aresample={SR},' + ','.join(f'atempo={c:.4f}' for c in chain)
    p = subprocess.run([FF, '-v', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', flt,
                        '-f', 's16le', '-ar', str(SR), '-ac', '1', '-'],
                       input=(np.clip(x, -1, 1) * 32767).astype('<i2').tobytes(), capture_output=True, check=True)
    return np.frombuffer(p.stdout, dtype='<i2').astype(np.float32) / 32768.0


def noise(x, snr_db, rng, kind='room'):
    """Add background noise at the given SNR; 'room' is low-passed noise (fan / classroom hum), 'white' is hiss."""
    n = rng.standard_normal(len(x) + 400).astype(np.float32)
    if kind == 'room':
        k = np.exp(-np.arange(80) / 12.0)
        n = np.convolve(n, k / k.sum(), mode='same')
    n = n[: len(x)]
    px = np.mean(x ** 2) + 1e-12
    pn = np.mean(n ** 2) + 1e-12
    return x + n * np.sqrt(px / (pn * 10 ** (snr_db / 10)))


def channel(x, rng):
    """A different microphone: a random gentle tilt and a high-pass, like a tablet or laptop mic versus the CD."""
    from scipy.signal import butter, lfilter
    b, a = butter(1, rng.uniform(80, 250) / (SR / 2), btype='high')
    y = lfilter(b, a, x)
    lo, hi = rng.uniform(-6, 6), rng.uniform(-6, 6)
    spec = np.fft.rfft(y)
    f = np.linspace(0, 1, len(spec))
    gain = 10 ** ((lo + (hi - lo) * f) / 20)
    return np.fft.irfft(spec * gain, len(y)).astype(np.float32)
