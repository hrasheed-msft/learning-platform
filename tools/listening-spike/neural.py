"""Neural scorer for the spike: frames from a Whisper encoder, compared with DTW (cosine distance).

Whisper's encoder maps speech to features that are largely speaker independent, so it may tell a child's 'at' from 'ath'
better than MFCCs. It is a much heavier option (tens of MB of model, run in the browser with ONNX/WebGPU or on a server).
Only the models already in the local Hugging Face cache are used; nothing is downloaded.
"""
import numpy as np
from faster_whisper import WhisperModel
from features import dtw, trim

SR = 16000


class WhisperScorer:
    def __init__(self, size):
        self.name = f'whisper-{size}'
        self.model = WhisperModel(size, device='cpu', compute_type='int8', cpu_threads=8, local_files_only=True)

    def embed(self, x):
        x = trim(x, pad=0.05).astype(np.float32)
        feats = self.model.feature_extractor(x)  # (80, frames), padded to 30 s
        import ctranslate2
        out = self.model.model.encode(ctranslate2.StorageView.from_array(feats[None].astype(np.float32)), to_cpu=True)
        e = np.array(out)[0]
        frames = min(len(e), int(len(x) / SR * 50) + 2)  # encoder frames are 20 ms
        e = e[:frames]
        return e - e.mean(axis=0)  # remove the per-utterance offset (speaker / channel)

    def ref(self, x):
        return self.embed(x)

    def distances(self, q, refs):
        e = self.embed(q)
        return np.array([dtw(e, r, metric='cosine') for r in refs])
