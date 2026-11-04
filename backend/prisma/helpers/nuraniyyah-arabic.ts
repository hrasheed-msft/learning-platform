/**
 * Arabic helpers for the Nūrāniyyah course seed.
 *
 * - `transliterate()` converts fully-vowelled Arabic into a pronunciation guide
 *   so that every Arabic example shown in the course carries its pronunciation.
 * - `spell()` spells an unvowelled letter sequence by letter names.
 * - `LETTERS` holds the 29 letters taught in Lesson 1.
 */

const FATHA = '\u064E';
const DAMMA = '\u064F';
const KASRA = '\u0650';
const FATHATAN = '\u064B';
const DAMMATAN = '\u064C';
const KASRATAN = '\u064D';
const SHADDA = '\u0651';
const SUKUN = '\u0652';
const DAGGER_ALIF = '\u0670';
const ALIF_WASLA = '\u0671';
const TATWEEL = '\u0640';
const MADDAH_ABOVE = '\u0653';
const SMALL_WAW = '\u06E5';
const SMALL_YA = '\u06E6';

const MARKS = new Set([FATHA, DAMMA, KASRA, FATHATAN, DAMMATAN, KASRATAN, SHADDA, SUKUN, DAGGER_ALIF, MADDAH_ABOVE, SMALL_WAW, SMALL_YA]);

const CONSONANTS: Record<string, string> = {
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'ḥ', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
  'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 'ṣ', 'ض': 'ḍ', 'ط': 'ṭ', 'ظ': 'ẓ',
  'ع': 'ʿ', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'ء': 'ʾ', 'أ': 'ʾ', 'إ': 'ʾ', 'ؤ': 'ʾ', 'ئ': 'ʾ',
};

const SHORT_VOWELS: Record<string, string> = { [FATHA]: 'a', [DAMMA]: 'u', [KASRA]: 'i' };
const TANWEEN: Record<string, string> = { [FATHATAN]: 'an', [DAMMATAN]: 'un', [KASRATAN]: 'in' };
const LONG_VOWELS: Record<string, string> = { a: 'ā', u: 'ū', i: 'ī' };

interface Cluster {
  ch: string;
  marks: Set<string>;
}

function toClusters(text: string): Cluster[] {
  const clusters: Cluster[] = [];
  for (const ch of text.normalize('NFC')) {
    if (ch === TATWEEL) continue;
    if (MARKS.has(ch) && clusters.length > 0) {
      clusters[clusters.length - 1].marks.add(ch);
    } else {
      clusters.push({ ch, marks: new Set() });
    }
  }
  return clusters;
}

function hasVowel(marks: Set<string>): boolean {
  return [...marks].some((m) => m in SHORT_VOWELS || m in TANWEEN || m === DAGGER_ALIF);
}

/**
 * Transliterate fully-vowelled Arabic into a pronunciation guide.
 * Text containing the alif waṣlah (ٱ) must be supplied with a manual
 * pronunciation instead, because its sound depends on the surrounding words.
 */
export function transliterate(text: string): string {
  if (text.includes(ALIF_WASLA)) {
    throw new Error(`Provide a manual pronunciation for text containing alif waṣlah: ${text}`);
  }

  const clusters = toClusters(text);
  let out = '';
  let lastVowel: 'a' | 'u' | 'i' | null = null;
  let lastWasMaddWaw = false;

  const isWordEnd = (i: number) => i + 1 >= clusters.length || clusters[i + 1].ch === ' ';

  for (let i = 0; i < clusters.length; i++) {
    const { ch, marks } = clusters[i];
    const wasMaddWaw = lastWasMaddWaw;
    lastWasMaddWaw = false;

    if (ch === ' ') {
      out += ' ';
      lastVowel = null;
      continue;
    }

    const shortVowel = [...marks].map((m) => SHORT_VOWELS[m]).find(Boolean) as 'a' | 'u' | 'i' | undefined;
    const tanween = [...marks].map((m) => TANWEEN[m]).find(Boolean);
    const sukun = marks.has(SUKUN);
    const shadda = marks.has(SHADDA);
    const dagger = marks.has(DAGGER_ALIF);
    const bare = !hasVowel(marks) && !sukun && !shadda;

    // Alif madda: hamzah followed by a long ā
    if (ch === 'آ') {
      out += 'ʾā';
      lastVowel = null;
      continue;
    }

    // Plain alif: lengthens a preceding fatḥah, otherwise it is a silent seat
    if (ch === 'ا' && bare) {
      if (wasMaddWaw && isWordEnd(i)) continue;
      if (out.endsWith('an') && lastVowel === null) continue;
      if (lastVowel === 'a') {
        out = out.slice(0, -1) + 'ā';
        lastVowel = null;
      }
      continue;
    }

    // Alif maqṣūrah
    if (ch === 'ى' && bare) {
      if (out.endsWith('an') && lastVowel === null) continue;
      if (lastVowel === 'a') {
        out = out.slice(0, -1) + 'ā';
        lastVowel = null;
      }
      continue;
    }

    // Weak letters acting as madd or līn letters
    if ((ch === 'و' || ch === 'ي') && !tanween && !shortVowel && !dagger && !shadda) {
      const maddVowel = ch === 'و' ? 'u' : 'i';
      const diphthong = ch === 'و' ? 'aw' : 'ay';
      if (bare && lastVowel === maddVowel) {
        out = out.slice(0, -1) + LONG_VOWELS[maddVowel];
        lastVowel = null;
        if (ch === 'و') lastWasMaddWaw = true;
        continue;
      }
      if (sukun && lastVowel === 'a') {
        out = out.slice(0, -1) + diphthong;
        lastVowel = null;
        continue;
      }
    }

    let consonant: string;
    if (ch === 'ة') {
      consonant = hasVowel(marks) ? 't' : 'h';
    } else if (ch === 'و') {
      consonant = 'w';
    } else if (ch === 'ي' || ch === 'ى') {
      consonant = 'y';
    } else if (ch === 'ا') {
      consonant = 'ʾ';
    } else if (ch in CONSONANTS) {
      consonant = CONSONANTS[ch];
    } else {
      throw new Error(`Unsupported character U+${ch.codePointAt(0)!.toString(16)} in "${text}"`);
    }

    out += shadda ? consonant + consonant : consonant;

    if (tanween) {
      out += tanween;
      lastVowel = null;
    } else if (dagger) {
      out += 'ā';
      lastVowel = null;
    } else if (shortVowel) {
      out += shortVowel;
      lastVowel = shortVowel;
      // Small yā / small wāw written above the letter lengthen kasrah / ḍammah
      if (marks.has(SMALL_YA) || marks.has(SMALL_WAW)) {
        out = out.slice(0, -1) + (marks.has(SMALL_YA) ? 'ī' : 'ū');
        lastVowel = null;
      }
    } else {
      lastVowel = null;
    }
  }

  return out;
}

export interface LetterInfo {
  ch: string;
  /** Letter name as written in the book */
  nameAr: string;
  /** Transliterated letter name */
  name: string;
  /** Consonant value used when the letter carries a vowel */
  sound: string;
  /** Plain-English description of how it is pronounced */
  how: string;
  heavy?: boolean;
}

export const LETTERS: LetterInfo[] = [
  { ch: 'ا', nameAr: 'أَلِف', name: 'alif', sound: 'ā', how: 'A long "aa" sound (as in "father") when it follows a fatḥah; it is also the seat that carries hamzah.' },
  { ch: 'ب', nameAr: 'بَا', name: 'bāʾ', sound: 'b', how: 'Like "b" in "bat".' },
  { ch: 'ت', nameAr: 'تَا', name: 'tāʾ', sound: 't', how: 'Like "t" in "tea", with the tip of the tongue touching the top front teeth.' },
  { ch: 'ث', nameAr: 'ثَا', name: 'thāʾ', sound: 'th', how: 'Like "th" in "think".' },
  { ch: 'ج', nameAr: 'جِيم', name: 'jīm', sound: 'j', how: 'Like "j" in "jam".' },
  { ch: 'ح', nameAr: 'حَا', name: 'ḥāʾ', sound: 'ḥ', how: 'A soft, breathy "h" squeezed from the middle of the throat (like fogging a mirror).' },
  { ch: 'خ', nameAr: 'خَا', name: 'khāʾ', sound: 'kh', how: 'A rough sound from the back of the throat, like "ch" in Scottish "loch".', heavy: true },
  { ch: 'د', nameAr: 'دَال', name: 'dāl', sound: 'd', how: 'Like "d" in "door".' },
  { ch: 'ذ', nameAr: 'ذَال', name: 'dhāl', sound: 'dh', how: 'Like "th" in "this".' },
  { ch: 'ر', nameAr: 'رَا', name: 'rāʾ', sound: 'r', how: 'A rolled "r" with the tip of the tongue.' },
  { ch: 'ز', nameAr: 'زَاي', name: 'zāy', sound: 'z', how: 'Like "z" in "zoo".' },
  { ch: 'س', nameAr: 'سِين', name: 'sīn', sound: 's', how: 'Like "s" in "sun".' },
  { ch: 'ش', nameAr: 'شِين', name: 'shīn', sound: 'sh', how: 'Like "sh" in "ship".' },
  { ch: 'ص', nameAr: 'صَاد', name: 'ṣād', sound: 'ṣ', how: 'A heavy, full "s" — the mouth is rounded and the tongue is raised.', heavy: true },
  { ch: 'ض', nameAr: 'ضَاد', name: 'ḍād', sound: 'ḍ', how: 'A heavy, full "d" — the side of the tongue presses the upper molars.', heavy: true },
  { ch: 'ط', nameAr: 'طَا', name: 'ṭāʾ', sound: 'ṭ', how: 'A heavy, full "t" — the mouth is rounded and the tongue is raised.', heavy: true },
  { ch: 'ظ', nameAr: 'ظَا', name: 'ẓāʾ', sound: 'ẓ', how: 'A heavy, full "th" as in "this".', heavy: true },
  { ch: 'ع', nameAr: 'عَين', name: 'ʿayn', sound: 'ʿ', how: 'A deep, squeezed sound from the middle of the throat; there is no English equivalent.' },
  { ch: 'غ', nameAr: 'غَين', name: 'ghayn', sound: 'gh', how: 'A gargling sound from the top of the throat, like the French "r".', heavy: true },
  { ch: 'ف', nameAr: 'فَا', name: 'fāʾ', sound: 'f', how: 'Like "f" in "fish".' },
  { ch: 'ق', nameAr: 'قَاف', name: 'qāf', sound: 'q', how: 'A heavy "k" made from the very back of the tongue, deep in the throat.', heavy: true },
  { ch: 'ك', nameAr: 'كَاف', name: 'kāf', sound: 'k', how: 'Like "k" in "kite".' },
  { ch: 'ل', nameAr: 'لَام', name: 'lām', sound: 'l', how: 'Like "l" in "lamp".' },
  { ch: 'م', nameAr: 'مِيم', name: 'mīm', sound: 'm', how: 'Like "m" in "moon".' },
  { ch: 'ن', nameAr: 'نُون', name: 'nūn', sound: 'n', how: 'Like "n" in "noon".' },
  { ch: 'و', nameAr: 'وَاو', name: 'wāw', sound: 'w', how: 'Like "w" in "water" (also the madd letter for ḍammah).' },
  { ch: 'ه', nameAr: 'هَا', name: 'hāʾ', sound: 'h', how: 'A light "h" from the bottom of the throat, like "h" in "hat".' },
  { ch: 'ء', nameAr: 'هَمْزَة', name: 'hamzah', sound: 'ʾ', how: 'A short stop in the throat, like the break in "uh-oh".' },
  { ch: 'ي', nameAr: 'يَا', name: 'yāʾ', sound: 'y', how: 'Like "y" in "yes" (also the madd letter for kasrah).' },
];

/** Letters that connect to the letter that follows them. */
export const NON_CONNECTING = new Set(['ا', 'د', 'ذ', 'ر', 'ز', 'و', 'ء']);

const LETTER_NAMES: Record<string, string> = {
  ...Object.fromEntries(LETTERS.map((l) => [l.ch, l.name])),
  'أ': 'alif',
  'ؤ': 'wāw with hamzah',
  'ئ': 'yāʾ with hamzah',
  'ى': 'yāʾ',
  'ة': 'tāʾ marbūṭah',
};

/** Spell an unvowelled sequence of letters by name, e.g. "كب" → "kāf – bāʾ". */
export function spell(text: string): string {
  return [...text.normalize('NFC')]
    .filter((c) => c !== ' ' && !MARKS.has(c) && c !== TATWEEL)
    .map((c) => {
      const name = LETTER_NAMES[c];
      if (!name) throw new Error(`No letter name for "${c}" in "${text}"`);
      return name;
    })
    .join(' – ');
}

/** The base-letter sequence a letter is vowelled on: alif is written with hamzah (أ). */
export function vowelBase(letter: LetterInfo): string {
  return letter.ch === 'ا' ? 'أ' : letter.ch;
}

export const HARAKAT = { fatha: FATHA, damma: DAMMA, kasra: KASRA, fathatan: FATHATAN, dammatan: DAMMATAN, kasratan: KASRATAN, shadda: SHADDA, sukun: SUKUN };
