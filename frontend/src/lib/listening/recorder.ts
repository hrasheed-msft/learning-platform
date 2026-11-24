const WAV_HEADER = 44;

/** Reads the 16-bit mono PCM wav files exported by tools/listening-spike/dataset.py (exact samples, no resampling). */
export function parseWav16(buffer: ArrayBuffer): Float32Array {
  const view = new DataView(buffer);
  const out = new Float32Array((buffer.byteLength - WAV_HEADER) / 2);
  for (let i = 0; i < out.length; i++) out[i] = view.getInt16(WAV_HEADER + i * 2, true) / 32768;
  return out;
}

/** Mixes a decoded recording down to mono and resamples it to 16 kHz. */
export async function toMono16k(audio: AudioBuffer): Promise<Float32Array> {
  const target = 16000;
  const length = Math.max(1, Math.round((audio.duration * target)));
  const ctx = new OfflineAudioContext(1, length, target);
  const src = ctx.createBufferSource();
  src.buffer = audio;
  src.connect(ctx.destination);
  src.start();
  const rendered = await ctx.startRendering();
  return rendered.getChannelData(0).slice();
}

export interface RecordingOptions {
  /** Stop this long after the child stops talking. */
  silenceMs?: number;
  /** Never record longer than this. */
  maxMs?: number;
  /** Give up if nothing is said for this long. */
  waitMs?: number;
  onLevel?: (level: number) => void;
}

export interface Recording {
  samples: Float32Array;
  /** Loudest 20 ms of the recording as a fraction of full scale (to tell "too quiet" from "unclear"). */
  peak: number;
  heardSpeech: boolean;
}

/**
 * Records from the microphone until the child has said something and stopped (or time runs out).
 * Uses MediaRecorder + decodeAudioData because that works on iPad Safari (audio/mp4) as well as Chrome (webm/opus).
 * Must be called from a tap/click handler: iOS only allows microphone access and audio contexts from a user gesture.
 */
export async function recordUtterance(options: RecordingOptions = {}): Promise<Recording> {
  const { silenceMs = 600, maxMs = 4000, waitMs = 5000, onLevel } = options;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
  });
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  await ctx.resume();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  ctx.createMediaStreamSource(stream).connect(analyser);

  const recorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const stopped = new Promise<void>((resolve) => (recorder.onstop = () => resolve()));
  recorder.start();

  const buf = new Float32Array(analyser.fftSize);
  const started = performance.now();
  let spokeAt = 0;
  let lastLoud = 0;
  let heardSpeech = false;
  // Speech = clearly above the quietest level seen so far
  let floor = 1;
  await new Promise<void>((resolve) => {
    const tick = () => {
      analyser.getFloatTimeDomainData(buf);
      let s = 0;
      for (const v of buf) s += v * v;
      const rms = Math.sqrt(s / buf.length);
      floor = Math.min(floor, Math.max(rms, 1e-4));
      onLevel?.(rms);
      const now = performance.now();
      if (rms > Math.max(floor * 4, 0.02)) {
        if (!heardSpeech) spokeAt = now;
        heardSpeech = true;
        lastLoud = now;
      }
      const done =
        now - started > maxMs + (heardSpeech ? 0 : waitMs - maxMs) ||
        (heardSpeech && now - lastLoud > silenceMs && now - spokeAt > 150);
      if (done) resolve();
      else setTimeout(tick, 30);
    };
    tick();
  });

  recorder.stop();
  await stopped;
  stream.getTracks().forEach((t) => t.stop());
  const blob = new Blob(chunks, { type: recorder.mimeType });
  const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
  const samples = await toMono16k(decoded);
  await ctx.close();
  let peak = 0;
  for (const v of samples) peak = Math.max(peak, Math.abs(v));
  return { samples, peak, heardSpeech };
}
