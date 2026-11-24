import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { parseWav16, recordUtterance } from '@/lib/listening/recorder';
import {
  classify,
  DEFAULT_OPTIONS,
  distances,
  referenceFeatures,
  VTLN_WARPS,
  type Reference,
  type Verdict,
} from '@/lib/listening/score';

interface Syllable extends Reference {
  name: string;
}

const VOWEL_MARK = { a: '\u064E', i: '\u0650', u: '\u064F' } as const;
const HAMZA = { a: 'أ', i: 'إ', u: 'أ' } as const;
const VOWEL_NAME = { a: 'fatḥah', i: 'kasrah', u: 'ḍammah' } as const;

/** أَتْ — the shape the book uses for a letter at rest after each vowel. */
const arabic = (s: Reference) => `${HAMZA[s.vowel]}${VOWEL_MARK[s.vowel]}${s.letter}\u0652`;
const base = '/listening-lab';

interface Attempt {
  target: string;
  verdict: string;
  heard: string | null;
  bestDistance: number;
  ownDistance: number;
  warps: boolean;
  userAgent: string;
}

function describe(v: Verdict): { icon: string; tone: string; title: string; detail: string } {
  switch (v.kind) {
    case 'match':
      return { icon: '🌟', tone: 'bg-green-50 border-green-300 text-green-900', title: 'Well done!', detail: 'That sounded right.' };
    case 'wrong-vowel':
      return {
        icon: '🔤',
        tone: 'bg-amber-50 border-amber-300 text-amber-900',
        title: 'Right letter — check the vowel',
        detail: `It sounded like ${VOWEL_NAME[v.heard.vowel]} (${arabic(v.heard)}). Listen again and copy the vowel.`,
      };
    case 'wrong-letter':
      return {
        icon: '👂',
        tone: 'bg-orange-50 border-orange-300 text-orange-900',
        title: 'That sounded like a different letter',
        detail: `It sounded closer to ${v.heard.letter}. Listen again to the first sound.`,
      };
    case 'not-close':
      return { icon: '🔁', tone: 'bg-red-50 border-red-300 text-red-900', title: 'Not close yet', detail: 'Listen once more, then try again.' };
    default:
      return {
        icon: '🎤',
        tone: 'bg-gray-50 border-gray-300 text-gray-800',
        title: 'I could not hear that clearly',
        detail: 'Try again a little closer to the microphone, in a quiet spot.',
      };
  }
}

export default function ListeningLab() {
  const [syllables, setSyllables] = useState<Syllable[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'recording' | 'scoring'>('idle');
  const [level, setLevel] = useState(0);
  const [result, setResult] = useState<{ verdict: Verdict; dist: number[] } | null>(null);
  const [useWarps, setUseWarps] = useState(true);
  const [maxDistance, setMaxDistance] = useState(DEFAULT_OPTIONS.maxDistance);
  const [tolerance, setTolerance] = useState(DEFAULT_OPTIONS.tolerance);
  const [showDetails, setShowDetails] = useState(false);
  const [log, setLog] = useState<Attempt[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const index: Array<{ name: string; letter: string; vowel: 'a' | 'i' | 'u' }> = await (await fetch(`${base}/syllables.json`)).json();
        const loaded = await Promise.all(
          index.map(async (s) => {
            const wav = parseWav16(await (await fetch(`${base}/syllables/${s.name}.wav`)).arrayBuffer());
            return { id: s.name, name: s.name, letter: s.letter, vowel: s.vowel, features: referenceFeatures(wav) };
          }),
        );
        if (!cancelled) setSyllables(loaded);
      } catch {
        if (!cancelled) setError('Could not load the teacher clips.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const current = syllables[target];
  const listen = useCallback(() => {
    if (!current) return;
    audioRef.current?.pause();
    audioRef.current = new Audio(`${base}/syllables/${current.name}.wav`);
    void audioRef.current.play();
  }, [current]);

  const say = useCallback(async () => {
    if (!current || phase !== 'idle') return;
    setResult(null);
    setError(null);
    setPhase('recording');
    try {
      const rec = await recordUtterance({ onLevel: setLevel });
      setPhase('scoring');
      // yield so the "thinking" state paints before the (synchronous) scoring work
      await new Promise((r) => setTimeout(r, 20));
      const usable = rec.heardSpeech && rec.samples.length > 1600;
      const dist = usable ? distances(rec.samples, syllables, useWarps ? VTLN_WARPS : [1]) : syllables.map(() => Infinity);
      const verdict = classify(dist, syllables, target, { maxDistance, tolerance });
      setResult({ verdict, dist });
      const best = dist.indexOf(Math.min(...dist));
      setLog((l) => [
        ...l,
        {
          target: current.name,
          verdict: verdict.kind,
          heard: 'heard' in verdict ? verdict.heard.id : verdict.kind === 'match' ? current.name : null,
          bestDistance: Number(dist[best].toFixed(3)),
          ownDistance: Number(dist[target].toFixed(3)),
          warps: useWarps,
          userAgent: navigator.userAgent,
        },
      ]);
    } catch (e) {
      setError(
        e instanceof Error && e.name === 'NotAllowedError'
          ? 'The microphone is blocked. Allow it in the browser settings and try again.'
          : 'Recording is not available on this device.',
      );
    } finally {
      setPhase('idle');
      setLevel(0);
    }
  }, [current, phase, syllables, target, useWarps, maxDistance, tolerance]);

  const ranking = useMemo(() => {
    if (!result) return [];
    return syllables
      .map((s, i) => ({ s, d: result.dist[i] }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 6);
  }, [result, syllables]);

  const desc = result ? describe(result.verdict) : null;

  return (
    <main className="mx-auto max-w-xl p-4 text-center">
      <h1 className="text-xl font-bold text-gray-800">
        Listening lab <span className="text-sm font-normal text-amber-700">(experimental)</span>
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Listen to the teacher, then say it yourself. Everything is checked on this device — your voice is never uploaded or saved.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-700">
          {error}
        </p>
      )}
      {!current && !error && <p className="mt-8 text-gray-500">Loading the teacher clips…</p>}

      {current && (
        <>
          <div className="mt-6 rounded-2xl border bg-amber-50/60 p-6" style={{ borderColor: '#e0d5b7' }}>
            <p lang="ar" dir="rtl" className="leading-tight" style={{ fontFamily: "'Amiri', serif", fontSize: '6rem' }}>
              {arabic(current)}
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button type="button" onClick={listen} className="rounded-full border border-gray-300 bg-white px-5 py-3 text-lg shadow">
                🔊 Listen
              </button>
              <button
                type="button"
                onClick={say}
                disabled={phase !== 'idle'}
                className="rounded-full bg-primary-600 px-5 py-3 text-lg text-white shadow disabled:opacity-60"
              >
                {phase === 'recording' ? '🎤 Listening…' : phase === 'scoring' ? '… thinking' : '🎤 Say it'}
              </button>
            </div>
            {phase === 'recording' && (
              <div className="mx-auto mt-3 h-2 w-48 rounded bg-gray-200" aria-hidden="true">
                <div className="h-2 rounded bg-primary-600 transition-all" style={{ width: `${Math.min(100, level * 600)}%` }} />
              </div>
            )}
          </div>

          {desc && (
            <div role="status" className={`mt-4 rounded-2xl border p-4 ${desc.tone}`}>
              <p className="text-3xl" aria-hidden="true">
                {desc.icon}
              </p>
              <p className="text-lg font-semibold">{desc.title}</p>
              <p className="text-sm">{desc.detail}</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <button
              type="button"
              className="rounded border px-3 py-1"
              onClick={() => {
                setTarget((t) => (t + 1) % syllables.length);
                setResult(null);
              }}
            >
              Next ▶
            </button>
            <label className="flex items-center gap-1">
              Practise
              <select
                value={target}
                onChange={(e) => {
                  setTarget(Number(e.target.value));
                  setResult(null);
                }}
                className="rounded border px-2 py-1"
                aria-label="Syllable to practise"
              >
                {syllables.map((s, i) => (
                  <option key={s.id} value={i}>
                    {arabic(s)} ({s.name})
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="text-gray-600 underline" onClick={() => setShowDetails((v) => !v)}>
              {showDetails ? 'Hide' : 'Show'} details
            </button>
          </div>

          {showDetails && (
            <section className="mt-4 rounded border p-3 text-left text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={useWarps} onChange={(e) => setUseWarps(e.target.checked)} />
                Adapt to child voices (vocal-tract warping)
              </label>
              <label className="mt-2 flex items-center gap-2">
                Not clear above {maxDistance.toFixed(2)}
                <input type="range" min={0.3} max={0.8} step={0.01} value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} />
              </label>
              <label className="mt-2 flex items-center gap-2">
                Forgiveness {Math.round(tolerance * 100)}%
                <input type="range" min={0} max={0.2} step={0.01} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} />
              </label>
              {ranking.length > 0 && (
                <table className="mt-3 w-full">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left">Closest clips</th>
                      <th className="text-right">distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map(({ s, d }) => (
                      <tr key={s.id} className={s === current ? 'font-semibold' : ''}>
                        <td>
                          <span lang="ar" style={{ fontFamily: "'Amiri', serif", fontSize: '1.4rem' }}>
                            {arabic(s)}
                          </span>{' '}
                          {s.name}
                        </td>
                        <td className="text-right">{isFinite(d) ? d.toFixed(3) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {log.length > 0 && (
                <button
                  type="button"
                  className="mt-3 rounded border px-3 py-1"
                  onClick={() => void navigator.clipboard?.writeText(JSON.stringify(log, null, 1))}
                >
                  Copy {log.length} attempt{log.length === 1 ? '' : 's'} (no audio) for feedback
                </button>
              )}
            </section>
          )}
        </>
      )}
    </main>
  );
}
