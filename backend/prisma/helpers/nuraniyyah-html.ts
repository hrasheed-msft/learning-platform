import { transliterate } from './nuraniyyah-arabic';

/** Shared types and HTML builders for the Nūrāniyyah course content. */

export interface PracticeItem {
  /** Arabic text shown to the learner */
  ar: string;
  /** Pronunciation guide (auto-generated from the Arabic unless supplied) */
  tr: string;
  /** Recorded pronunciation clip, when one exists */
  audio?: string;
}

export interface TermDef {
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface CardDef {
  front: string;
  back: string;
  frontArabic?: string;
  backArabic?: string;
  category: 'vocabulary' | 'definition' | 'rule' | 'example';
  tags: string[];
}

export interface QuizDef {
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK';
  questionText: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface LessonDef {
  slug: string;
  title: string;
  description: string;
  html: string;
  terms: TermDef[];
  cards: CardDef[];
  quiz: QuizDef[];
}

/** Item with its pronunciation auto-generated, or supplied for text that needs a manual guide. */
export function item(ar: string, tr?: string, audio?: string): PracticeItem {
  return { ar, tr: tr ?? transliterate(ar), audio };
}

/** URL of a clip cut from the CD: cd is the CD lesson number, clip the 0-based position in that track. */
export const clipUrl = (cd: number, clip: number): string =>
  `/audio/nuraniyyah/cd${String(cd).padStart(2, '0')}-${String(clip + 1).padStart(3, '0')}.mp3`;

export const items = (list: string[]): PracticeItem[] => list.map((a) => item(a));

/** "ʾab" → "ab": syllable grids drop the hamzah carried by the alif. */
export const stripHamza = (tr: string) => tr.replace(/ʾ/g, '');

/** One card per letter built from a function, e.g. أَبْ · إِبْ · أُبْ. */
export function formGrid(letters: string[], build: (letter: string) => string[]): PracticeItem[] {
  return letters.map((l) => {
    const forms = build(l);
    return {
      ar: forms.join(' '),
      tr: forms.map((f) => stripHamza(transliterate(f))).join(' · '),
    };
  });
}

export const FATHA = '\u064E';
export const DAMMA = '\u064F';
export const KASRA = '\u0650';
export const SHADDA = '\u0651';
export const SUKUN = '\u0652';
export function vowelGrid(letters: string[], marks: string[]): PracticeItem[] {
  return letters.map((l) => {
    const forms = marks.map((m) => {
      // Hamzah sits under the alif for kasrah / kasratayn
      const base = l === 'أ' && (m === '\u0650' || m === '\u064D' || m.startsWith('\u0650')) ? 'إ' : l;
      return `${base}${m}`;
    });
    return {
      ar: forms.join(' '),
      tr: forms.map((f) => stripHamza(transliterate(f))).join(' · '),
    };
  });
}

const CARD_STYLE =
  'background:#fffdf5;border:1px solid #e0d5b7;border-radius:0.5rem;padding:0.5rem 0.25rem;text-align:center;';
const AR_STYLE = "font-family:'Amiri',serif;color:#1f2937;margin:0;";
const TR_STYLE = 'font-size:0.85rem;color:#6b7280;font-style:italic;margin:0;';

/** Grid of Arabic cards, laid out right-to-left like the book, each with its pronunciation. */
export function arabicGrid(list: PracticeItem[], opts: { min?: number; size?: string } = {}): string {
  const min = opts.min ?? 120;
  const size = opts.size ?? '2.25rem';
  const cards = list
    .map((it) => {
      const playable = it.audio
        ? ` data-audio="${it.audio}" role="button" tabindex="0" aria-label="Play pronunciation of ${it.tr}" title="Tap to hear it"`
        : '';
      const cursor = it.audio ? 'cursor:pointer;' : '';
      const speaker = it.audio ? ' <span aria-hidden="true">🔊</span>' : '';
      return `  <div${playable} style="${CARD_STYLE}${cursor}">
    <p lang="ar" style="${AR_STYLE}font-size:${size};line-height:1.7;">${it.ar}</p>
    <p dir="ltr" style="${TR_STYLE}">${it.tr}${speaker}</p>
  </div>`;
    })
    .join('\n');
  return `<div dir="rtl" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(${min}px,1fr));gap:0.5rem;margin:1rem 0;">
${cards}
</div>`;
}

/** Large centred Arabic line with pronunciation underneath. */
export function arabicLine(ar: string, tr: string): string {
  return `<div style="text-align:center;margin:1rem 0;">
  <p dir="rtl" lang="ar" class="arabic-large" style="margin:0;">${ar}</p>
  <p style="${TR_STYLE}font-size:1.05rem;">${tr}</p>
</div>`;
}

export function audioUrl(surah: number, ayah: number): string {
  const pad = (n: number) => String(n).padStart(3, '0');
  return `https://everyayah.com/data/khalefa_al_tunaiji_64kbps/${pad(surah)}${pad(ayah)}.mp3`;
}

/** Qur'ānic text with pronunciation and recitation audio (picked up by the app's Qur'ān audio player). */
export function quranVerse(opts: {
  ref: string;
  surah: number;
  ayah: number;
  ar: string;
  tr: string;
  label?: string;
}): string {
  const label = opts.label ? `<p style="${TR_STYLE}margin-bottom:0.25rem;">${opts.label}</p>` : '';
  return `<div class="quran-verse">
  ${label}<p class="arabic-large" dir="rtl" lang="ar">${opts.ar}</p>
  <p style="${TR_STYLE}font-size:1.05rem;">${opts.tr}</p>
  <p style="font-size:0.8rem;color:#9ca3af;margin:0.25rem 0 0;">Qur'ān ${opts.ref}</p>
  <audio controls style="width:100%;margin-top:1rem;">
    <source src="${audioUrl(opts.surah, opts.ayah)}" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
</div>`;
}

export const exampleBox = (title: string, body: string) =>
  `<div class="example-box">\n<h4>${title}</h4>\n${body}\n</div>`;
export const tipBox = (title: string, body: string) =>
  `<div class="activity-box">\n<h4>${title}</h4>\n${body}\n</div>`;
export const warnBox = (title: string, body: string) =>
  `<div class="warning-box">\n<h4>${title}</h4>\n${body}\n</div>`;

export function table(headers: string[], rows: string[][]): string {
  const head = headers.map((h) => `<th>${h}</th>`).join('');
  const body = rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('\n');
  return `<table>\n<thead><tr>${head}</tr></thead>\n<tbody>\n${body}\n</tbody>\n</table>`;
}

/** Inline Arabic span for use inside tables and paragraphs. */
export const ar = (text: string, size = '1.6rem') =>
  `<span lang="ar" dir="rtl" style="font-family:'Amiri',serif;font-size:${size};">${text}</span>`;

const bigSymbol = (s: string) => `<span style="font-size:1.4rem;">${s}</span>`;

/** Pronunciation key shown on early lessons. */
export const PRONUNCIATION_KEY = table(
  ['Symbol', 'Meaning'],
  [
    [bigSymbol('ā  ī  ū'), 'Long vowels — hold the sound for two beats'],
    [bigSymbol('ḥ'), 'The soft, breathy ح from the middle of the throat'],
    [bigSymbol('ṣ  ḍ  ṭ  ẓ'), 'The four full-mouth (heavy) letters ص ض ط ظ'],
    [bigSymbol('kh  gh  q'), 'The heavy throat letters خ غ ق'],
    [bigSymbol('th  dh  sh'), 'Like "th" in "think", "th" in "this" and "sh" in "ship"'],
    [bigSymbol('ʿ'), 'The deep throat letter ع (ʿayn)'],
    [bigSymbol('ʾ'), 'The hamzah ء — a short stop in the throat'],
  ],
);
