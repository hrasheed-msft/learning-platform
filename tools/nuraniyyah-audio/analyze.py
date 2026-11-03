"""Silence analysis helper for the Nuraniyyah MP3s."""
import subprocess, sys, numpy as np, imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
SR = 16000


def load(path):
    p = subprocess.run([FF, '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, dtype=np.int16).astype(np.float32) / 32768.0


def envelope(x, win=0.02):
    n = int(SR * win)
    m = len(x) // n
    return np.sqrt((x[: m * n].reshape(m, n) ** 2).mean(axis=1) + 1e-12), win


def segments(x, thresh_db=-40.0, min_sil=0.25, min_seg=0.08):
    env, win = envelope(x)
    db = 20 * np.log10(env)
    ref = np.percentile(db, 99)
    active = db > (ref + thresh_db)
    segs, start, last_active = [], None, None
    for i, a in enumerate(active):
        t = i * win
        if a:
            if start is None:
                start = t
            last_active = t + win
        elif start is not None and t - last_active >= min_sil:
            segs.append((start, last_active))
            start = None
    if start is not None:
        segs.append((start, last_active))
    return [(s, e) for s, e in segs if e - s >= min_seg], ref


if __name__ == '__main__':
    path, thr, sil = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
    x = load(path)
    segs, ref = segments(x, thr, sil)
    print('duration', len(x) / SR, 'ref dB', round(ref, 1), 'segments', len(segs))
    gaps = [segs[i + 1][0] - segs[i][1] for i in range(len(segs) - 1)]
    for i, (s, e) in enumerate(segs[:70]):
        print(i + 1, round(s, 2), round(e, 2), 'len', round(e - s, 2), 'gap_after', round(gaps[i], 2) if i < len(gaps) else '')
