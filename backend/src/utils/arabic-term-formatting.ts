export interface ArabicTermFormatInput {
  arabicText: string;
  transliteration: string;
  translation: string;
}

const TRANSLITERATION_SEPARATOR_RE = /[\s\-–—_]+/;
const TRANSLITERATION_CHAR_VARIANTS: Record<string, string> = {
  a: 'aāáàâäãăą',
  b: 'b',
  c: 'cçč',
  d: 'dḍďđḏ',
  e: 'eēéèêë',
  f: 'f',
  g: 'gġğ',
  h: 'hḥḩẖ',
  i: 'iīíìîï',
  j: 'jǧ',
  k: 'kḳķ',
  l: 'lḷļ',
  m: 'm',
  n: 'nñṇ',
  o: 'oōóòôö',
  p: 'p',
  q: 'q',
  r: 'rṛŕ',
  s: 'sṣśš',
  t: 'tṭţťṯ',
  u: 'uūúùûü',
  v: 'v',
  w: 'wẇ',
  x: 'x',
  y: 'yýȳ',
  z: 'zẓžźż',
};

const CANONICAL_TRANSLATIONS: Record<string, string> = {
  salah: 'Prayer',
  wudu: 'Ablution',
  rakah: 'Unit of prayer',
  rakahs: 'Units of prayer',
  sunnah: 'Prophetic tradition',
  fard: 'Obligatory',
  haram: 'Forbidden',
  halal: 'Permissible',
  zakah: 'Obligatory charity',
  zakat: 'Obligatory charity',
  sawm: 'Fasting',
  hajj: 'Pilgrimage',
  shahadah: 'Testimony of faith',
  iman: 'Faith',
  ihsan: 'Spiritual excellence',
  tawbah: 'Repentance',
  dhikr: 'Remembrance of Allah',
  khushu: 'Focused humility',
  dua: 'Supplication',
  sadaqah: 'Voluntary charity',
  ummah: 'Muslim community',
  masjid: 'Mosque',
  qibla: 'Direction of prayer',
  adhan: 'Call to prayer',
  iqamah: 'Call to start prayer',
  imam: 'Prayer leader',
  muezzin: 'Caller to prayer',
  muadhdhin: 'Caller to prayer',
  takbir: 'Declaration of Allah’s greatness',
  ruku: 'Bowing',
  sujud: 'Prostration',
  tashahhud: 'Testimony recited in prayer',
  taslim: 'Final greeting',
  qunut: 'Special supplication',
  witr: 'Odd-numbered prayer',
  tarawih: 'Night prayer in Ramadan',
  jumuah: 'Friday prayer',
  khutbah: 'Sermon',
  janazah: 'Funeral prayer',
  ghusl: 'Full ritual bath',
  tayammum: 'Dry ablution',
  najasah: 'Impurity',
  taharah: 'Purity',
  niyyah: 'Intention',
  bismillah: 'In the name of Allah',
  alhamdulillah: 'All praise is for Allah',
  subhanallah: 'Glory be to Allah',
  astaghfirullah: 'I seek Allah’s forgiveness',
  deen: 'Way of life',
  fitrah: 'Natural disposition',
  taqwa: 'God-consciousness',
  shukr: 'Gratitude',
  sabr: 'Patience',
  tawakkul: 'Trust in Allah',
  ikhlas: 'Sincerity',
  hidayah: 'Guidance',
  barakah: 'Blessing',
  rizq: 'Provision',
  qadr: 'Divine decree',
  akhirah: 'Hereafter',
  dunya: 'Worldly life',
  jannah: 'Paradise',
  jahannam: 'Hellfire',
  sirat: 'Bridge over Hellfire',
  mizan: 'Scale of deeds',
  shafaah: 'Intercession',
  maktab: 'Islamic school',
};

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export function simplifyTransliteration(text: string): string {
  return normalizeWhitespace(
    decodeHtmlEntities(text)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ʿʾʻʼ']/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .toLowerCase()
  );
}

export function toDisplayTransliteration(text: string): string {
  const cleaned = normalizeWhitespace(
    decodeHtmlEntities(text)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ʿʾʻʼ]/g, "'")
      .replace(/(^|[\s-])'+/g, '$1')
      .replace(/'+(?=$|[\s-])/g, '')
      .replace(/[^\p{L}\p{N}' -]+/gu, ' ')
  );

  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function stripLeadingArticle(key: string): string {
  return key.replace(/^(al|ad|an|ar|as|ash|at|az)\s+/, '');
}

export function resolveArabicTermTranslation(term: ArabicTermFormatInput): string {
  const key = simplifyTransliteration(term.transliteration);
  const canonical = CANONICAL_TRANSLATIONS[key] || CANONICAL_TRANSLATIONS[stripLeadingArticle(key)];
  if (canonical) {
    return canonical;
  }

  const concise = normalizeWhitespace(term.translation)
    .split(/\s+[—–/-]\s+/)[0]
    ?.trim();

  return concise || normalizeWhitespace(term.translation);
}

export function buildTransliterationRegex(transliteration: string): RegExp | null {
  const simplified = simplifyTransliteration(transliteration);
  if (!simplified) return null;

  const pattern = simplified
    .split(TRANSLITERATION_SEPARATOR_RE)
    .filter(Boolean)
    .map((segment) => Array.from(segment).map((char) => {
      const variants = TRANSLITERATION_CHAR_VARIANTS[char] || char;
      return `[${escapeRegExp(variants)}]`;
    }).join(''))
    .join(String.raw`(?:[\s\-–—_'’ʿʾʻʼ]+)`);

  if (!pattern) return null;
  return new RegExp(`(^|[^\\p{L}])(${pattern}(?:['’ʿʾʻʼ])?)(?=$|[^\\p{L}])`, 'giu');
}

export function replaceTransliteratedTerms(
  text: string,
  arabicTerms: ArabicTermFormatInput[],
  formatter: (term: ArabicTermFormatInput) => string
): string {
  return arabicTerms
    .filter((term) => term.arabicText && term.transliteration && term.translation)
    .sort((a, b) => simplifyTransliteration(b.transliteration).length - simplifyTransliteration(a.transliteration).length)
    .reduce((currentText, term) => {
      const transliterationRe = buildTransliterationRegex(term.transliteration);
      if (!transliterationRe) return currentText;

      return currentText.replace(
        transliterationRe,
        (match: string, prefix: string, _termMatch: string, offset: number, source: string) => {
          const termStart = offset + prefix.length;
          if (source.slice(Math.max(0, termStart - 2), termStart) === '/(') {
            return match;
          }

          return `${prefix}${formatter(term)}`;
        }
      );
    }, text);
}

export function formatArabicTermForCourseText(term: ArabicTermFormatInput): string {
  return `${resolveArabicTermTranslation(term)} ${term.arabicText}/(${toDisplayTransliteration(term.transliteration)})`;
}
