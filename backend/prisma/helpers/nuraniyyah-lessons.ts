import { HARAKAT, LETTERS, NON_CONNECTING, spell, transliterate } from './nuraniyyah-arabic';
import { L2_CELL_CLIPS, SUKOON_GROUP_URLS, WORD_CLIPS } from './nuraniyyah-audio';
import {
  EXERCISE_WORDS,
  L10_LETTERS,
  L1_CELL_LETTERS,
  L2_CELLS,
  L3_CELLS,
  L4_SINGLES,
  L4_SPELLED,
  L5_LAST,
  L5_SINGLES,
  L5_SPELLED,
  L7_AUDIO_COUNT,
  L7_SMALL_ALIF,
  L8_LEEN_SINGLES,
  L8_LEEN_SPELLED_A,
  L8_LEEN_SPELLED_B,
  L8_MADD_SINGLES,
  L8_MADD_SPELLED_A,
  L8_MADD_SPELLED_B,
  L9_EXTRA_WORDS,
  MANUAL_TRANSLITERATION,
} from './nuraniyyah-data';
import {
  LessonDef,
  PRONUNCIATION_KEY,
  PracticeItem,
  ar,
  arabicGrid,
  arabicLine,
  clipUrl,
  exampleBox,
  item,
  quranVerse,
  stripHamza,
  table,
  tipBox,
  warnBox,
} from './nuraniyyah-html';

const F = HARAKAT.fatha;
const D = HARAKAT.damma;
const K = HARAKAT.kasra;
const SUK = HARAKAT.sukun;
const FATHATAN = HARAKAT.fathatan;
const KASRATAN = HARAKAT.kasratan;
const DAMMATAN = HARAKAT.dammatan;
const DAGGER = '\u0670';
const SMALL_YA = '\u06E6';
const SMALL_WAW = '\u06E5';

const L = (ch: string) => LETTERS.find((l) => l.ch === ch);
const page = (n: string) =>
  `<p style="font-size:0.8rem;color:#9ca3af;margin:0 0 0.5rem;">Book page ${n}</p>`;

/** A card showing several forms of one letter, e.g. "ba · bi · bu", with the hamzah dropped from the guide. */
function formsCard(forms: string[], audio?: string): PracticeItem {
  return {
    ar: forms.join(' '),
    tr: forms.map((f) => stripHamza(transliterate(f))).join(' · '),
    audio,
  };
}

/** Hamzah sits under the alif when it carries a kasrah. */
const seat = (l: string, vowel: string) => (l === 'أ' && (vowel === K || vowel === KASRATAN) ? 'إ' : l);

const wordCard = (ar_: string, tag: string, back?: string) => ({
  front: 'Read this word',
  frontArabic: ar_,
  back: back ?? MANUAL_TRANSLITERATION[ar_] ?? transliterate(ar_),
  category: 'example' as const,
  tags: ['nuraniyyah', tag],
});

function exerciseGrid(lesson: 6 | 9 | 11, words: string[] = EXERCISE_WORDS[lesson], min = 130): string {
  const clips = WORD_CLIPS[lesson] ?? {};
  return arabicGrid(
    words.map((w) => item(w, MANUAL_TRANSLITERATION[w], clips[w] !== undefined ? clipUrl(lesson, clips[w]) : undefined)),
    { min, size: '2.5rem' },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 1 — The single letters (page 6)
// ─────────────────────────────────────────────────────────────────────────────

const HEAVY = ['خ', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];

const lesson1Items = L1_CELL_LETTERS.map((ch, k) => {
  const info = L(ch === 'ى' ? 'ي' : ch)!;
  return item(ch, info.name, clipUrl(1, 3 + k));
});

const lesson1: LessonDef = {
  slug: 'nuraniyyah-lesson-1',
  title: 'Lesson 1: The Single Letters — حُرُوفُ الْهِجَاءِ الْمُفْرَدَةُ',
  description: 'Meet the 29 Arabic letters, tap each one to hear its name, and learn how each sounds.',
  html: `
<h2>Welcome to the Nūrāniyyah 🌟</h2>
<p>The <strong>Nūrāniyyah</strong> (<em>Nūrānī Qā'idah</em>) is a step-by-step primer that teaches you to <strong>read the Qur'ān correctly</strong>. Every Arabic example in this course comes with a <strong>pronunciation guide</strong> underneath, and cards marked 🔊 can be <strong>tapped to hear the teacher say them</strong> — the lessons follow the book page by page.</p>
<p>Begin every lesson with the Basmalah:</p>
${arabicLine('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 'bismillāhir-raḥmānir-raḥīm')}

<h3>How to read the pronunciation guide</h3>
${PRONUNCIATION_KEY}

<h2>The Single Letters — ${ar('حُرُوفُ الْهِجَاءِ الْمُفْرَدَةُ')}</h2>
${page('6')}
<p>Arabic is read from <strong>right to left</strong>, so start at the top right corner. The book shows each letter on its own, with its name written above it. There are <strong>29 letters</strong> (28 letters plus the hamzah ${ar('ء')}); yāʾ is shown twice because it is written in two ways. <strong>Tap a letter to hear its name.</strong></p>
${arabicGrid(lesson1Items, { min: 100, size: '3.25rem' })}

<h3>How each letter sounds</h3>
${table(
  ['Letter', 'Name', 'Pronounced', 'How to say it'],
  LETTERS.map((l) => [ar(l.ch, '2rem'), ar(l.nameAr, '1.4rem'), `<em>${l.name}</em>`, l.how]),
)}

<h2>Heavy Letters — ${ar('الْحُرُوفُ الْمُفَخَّمَةُ')}</h2>
<p>Seven letters are always pronounced <strong>heavy</strong>, with a full, round mouth. They are remembered with the phrase:</p>
${arabicLine('خُصَّ ضَغْطٍ قِظْ', transliterate('خُصَّ ضَغْطٍ قِظْ'))}
${arabicGrid(HEAVY.map((c) => item(c, L(c)!.name)), { min: 90, size: '2.5rem' })}
${tipBox('Try it', '<p>Say <em>ṭā</em> and <em>tā</em> one after the other. Feel how the back of your tongue rises and your mouth fills for the heavy ṭāʾ.</p>')}
`.trim(),
  terms: [
    { arabic: 'حَرْف', transliteration: 'ḥarf', translation: 'letter' },
    { arabic: 'الْحُرُوفُ الْهِجَائِيَّة', transliteration: 'al-ḥurūf al-hijāʾiyyah', translation: 'the alphabet' },
    { arabic: 'حُرُوفُ الْهِجَاءِ الْمُفْرَدَة', transliteration: 'ḥurūf al-hijāʾ al-mufradah', translation: 'the single (separate) letters' },
    { arabic: 'الْحُرُوفُ الْمُفَخَّمَة', transliteration: 'al-ḥurūf al-mufakhkhamah', translation: 'the heavy letters' },
  ],
  cards: [
    ...LETTERS.map((l) => ({
      front: 'What is this letter called?',
      frontArabic: l.ch,
      back: `${l.name} — ${l.how}`,
      backArabic: l.nameAr,
      category: 'vocabulary' as const,
      tags: ['nuraniyyah', 'letters'],
    })),
    {
      front: 'Which seven letters are always heavy?',
      back: 'khuṣṣa ḍaghṭin qiẓ — kh ṣ ḍ ṭ ẓ gh q',
      backArabic: 'خُصَّ ضَغْطٍ قِظْ',
      category: 'rule' as const,
      tags: ['nuraniyyah', 'heavy-letters'],
    },
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many letters are taught in the Nūrāniyyah alphabet (counting hamzah)?',
      options: ['26', '28', '29', '30'],
      correctAnswer: '29',
      explanation: 'The Nūrāniyyah teaches 29 letters: the 28 letters from alif to yāʾ plus the hamzah.',
      difficulty: 'EASY',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'Arabic is read from right to left.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Arabic is read from right to left, so we start at the top right of every page.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of these letters is NOT a heavy letter?',
      options: ['ص (ṣād)', 'ط (ṭāʾ)', 'ب (bāʾ)', 'ق (qāf)'],
      correctAnswer: 'ب (bāʾ)',
      explanation: 'The heavy letters are خ ص ض ط ظ غ ق. Bāʾ is a light letter.',
      difficulty: 'MEDIUM',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 2 — Combined letters (pages 7–9)
// ─────────────────────────────────────────────────────────────────────────────

const connectingForms = LETTERS.filter((l) => !NON_CONNECTING.has(l.ch)).map((l) => [
  `<em>${l.name}</em>`,
  ar(l.ch, '1.8rem'),
  ar(`${l.ch}ـ`, '1.8rem'),
  ar(`ـ${l.ch}ـ`, '1.8rem'),
  ar(`ـ${l.ch}`, '1.8rem'),
]);
const nonConnectingForms = LETTERS.filter((l) => NON_CONNECTING.has(l.ch)).map((l) => [
  `<em>${l.name}</em>`,
  ar(l.ch, '1.8rem'),
  '—',
  '—',
  l.ch === 'ء' ? '—' : ar(`ـ${l.ch}`, '1.8rem'),
]);

const lesson2Items = L2_CELLS.map((c, k) => {
  const clip = L2_CELL_CLIPS[k];
  return item(c, spell(c), clip !== null && clip !== undefined ? clipUrl(2, clip) : undefined);
});

const lesson2: LessonDef = {
  slug: 'nuraniyyah-lesson-2',
  title: 'Lesson 2: Combined Letters — حُرُوفُ الْهِجَاءِ الْمُرَكَّبَةُ',
  description: 'See how letters change shape when they join, and practise reading joined letters, saying each letter by name.',
  html: `
<h2>Combined Letters — ${ar('حُرُوفُ الْهِجَاءِ الْمُرَكَّبَةُ')}</h2>
<p>When letters sit next to each other in a word they <strong>join</strong>, and most letters change their shape a little depending on where they are: at the <strong>start</strong>, in the <strong>middle</strong> or at the <strong>end</strong> of a joined group. The long dash (ـ) shows where a letter joins.</p>

<h3>Letters that join on both sides</h3>
${table(['Letter', 'Alone', 'Start', 'Middle', 'End'], connectingForms)}

<h3>Letters that do not join to the next letter</h3>
<p>These letters can join to the letter <em>before</em> them but <strong>never to the letter after them</strong>, so the next letter starts a fresh shape:</p>
${table(['Letter', 'Alone', 'Start', 'Middle', 'End'], nonConnectingForms)}
${exampleBox('Lām-alif — لا', `<p>When lām ${ar('ل')} is followed by alif ${ar('ا')} they are always written as one joined shape: ${ar('لا', '2rem')} — <em>lām – alif</em>.</p>`)}

<h3>Practise reading joined letters</h3>
${page('7 – 9')}
<p>Read each group slowly from <strong>right to left</strong>, saying the <strong>name of each letter</strong>. The guide spells the letters for you, and the teacher reads the cells on the recording — tap 🔊 to hear them.</p>
${arabicGrid(lesson2Items, { min: 110, size: '2.5rem' })}
${tipBox('You can do it!', '<p>After Lessons 2 and 3 you should be able to recognise and tell apart <strong>any letter of the Qur\'ān without hesitation</strong>. Keep practising these pages until the shapes feel familiar.</p>')}
`.trim(),
  terms: [
    { arabic: 'حُرُوفُ الْهِجَاءِ الْمُرَكَّبَة', transliteration: 'ḥurūf al-hijāʾ al-murakkabah', translation: 'the combined (joined) letters' },
    { arabic: 'لَا', transliteration: 'lām-alif', translation: 'the joined shape of lām and alif' },
  ],
  cards: [
    { front: 'Which letters do NOT join to the letter after them?', back: 'alif, dāl, dhāl, rāʾ, zāy, wāw', backArabic: 'ا د ذ ر ز و', category: 'rule', tags: ['nuraniyyah', 'combined-letters'] },
    { front: 'How is lām followed by alif written?', back: 'As one joined shape: lām-alif', backArabic: 'لا', category: 'definition', tags: ['nuraniyyah', 'combined-letters'] },
    { front: 'How do you read this group of letters?', frontArabic: 'كب', back: spell('كب'), category: 'example', tags: ['nuraniyyah', 'combined-letters'] },
    { front: 'How do you read this group of letters?', frontArabic: 'نبل', back: spell('نبل'), category: 'example', tags: ['nuraniyyah', 'combined-letters'] },
    { front: 'What are the positions a joined letter can take?', back: 'Start, middle and end of a joined group (and alone).', category: 'definition', tags: ['nuraniyyah', 'combined-letters'] },
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which group contains only letters that do NOT join to the letter after them?',
      options: ['ا د ذ ر ز و', 'ب ت ث ن ي', 'ك ل م ن ه', 'ج ح خ ع غ'],
      correctAnswer: 'ا د ذ ر ز و',
      explanation: 'Alif, dāl, dhāl, rāʾ, zāy and wāw join to the letter before them but never to the one after.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'Most Arabic letters change shape depending on whether they are at the start, middle or end of a joined group.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Most letters have different start, middle, end and stand-alone forms.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which two letters make the joined shape لا?',
      options: ['lām and alif', 'kāf and alif', 'nūn and alif', 'bāʾ and alif'],
      correctAnswer: 'lām and alif',
      explanation: 'The joined shape لا is lām followed by alif.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 3 — The separately recited letters (page 9)
// ─────────────────────────────────────────────────────────────────────────────

const lesson3Items = L3_CELLS.map((c, k) => item(c, spell(c), clipUrl(3, 2 + k)));

const lesson3: LessonDef = {
  slug: 'nuraniyyah-lesson-3',
  title: 'Lesson 3: The Separately Recited Letters — الْحُرُوفُ الْمُقَطَّعَةُ',
  description: 'Read the letters that open some sūrahs of the Qur\'ān — recited by their names — and listen to the teacher recite each one.',
  html: `
<h2>The Separately Recited Letters — ${ar('الْحُرُوفُ الْمُقَطَّعَةُ')}</h2>
${page('9')}
<p>Some sūrahs of the Qur'ān begin with letters that are <strong>recited by their names</strong>, one at a time — not as a word. For example ${ar('الٓمٓ')} is read <em>Alif Lām Mīm</em>, not "alm". Allāh knows best their meaning. They are written with a small madd mark (${ar('ٓ')}) above the letter, and they are recited slowly and stretched. <strong>Tap each one to hear it.</strong></p>
${arabicGrid(lesson3Items, { min: 190, size: '2.5rem' })}

<h3>Your first test</h3>
<p>The book ends the lesson with a challenge. After Lessons 2 and 3 you should be able to recognise <strong>any letter of the Qur'ān without hesitation</strong>. For example, the words in this verse are read letter by letter, without hesitating:</p>
${quranVerse({ ref: '78:1', surah: 78, ayah: 1, label: 'Sūrat an-Naba’ — verse 1', ar: 'عَمَّ يَتَسَاءَلُونَ', tr: 'ʿamma yatasāʾalūn' })}
${arabicLine('ع م ي ت س ا ء ل و ن', spell('عميتساءلون'))}
`.trim(),
  terms: [{ arabic: 'الْحُرُوفُ الْمُقَطَّعَة', transliteration: 'al-ḥurūf al-muqaṭṭaʿah', translation: 'the separately recited letters that open some sūrahs' }],
  cards: [
    { front: 'How are the opening letters of sūrahs like الٓمٓ recited?', back: 'By their names, one at a time: Alif Lām Mīm.', backArabic: 'الٓمٓ', category: 'rule', tags: ['nuraniyyah', 'muqattaat'] },
    { front: 'How is this read?', frontArabic: 'كٓهيعٓصٓ', back: spell('كهيعص'), category: 'example', tags: ['nuraniyyah', 'muqattaat'] },
    { front: 'How is this read?', frontArabic: 'يسٓ', back: spell('يس'), category: 'example', tags: ['nuraniyyah', 'muqattaat'] },
    { front: 'How is this read?', frontArabic: 'عٓسٓقٓ', back: spell('عسق'), category: 'example', tags: ['nuraniyyah', 'muqattaat'] },
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is الٓمٓ recited?',
      options: ['Alif Lām Mīm', 'Alam', 'Alm', 'Ilm'],
      correctAnswer: 'Alif Lām Mīm',
      explanation: 'These letters are read by their names, one at a time.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is يسٓ read?',
      options: ['Yā Sīn', 'Yasin', 'Yis', 'Yāsin'],
      correctAnswer: 'Yā Sīn',
      explanation: 'The two letters yāʾ and sīn are read by name: Yā Sīn.',
      difficulty: 'EASY',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'The separately recited letters are read as one word.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'They are read letter by letter, each by its name.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 4 — Short vowels (page 10)
// ─────────────────────────────────────────────────────────────────────────────

const harakat = (l: string) => [seat(l, F) + F, seat(l, K) + K, seat(l, D) + D];

const lesson4Items = [
  ...L4_SPELLED.map((l, g) => formsCard(harakat(l), clipUrl(4, 10 + 5 * g))),
  ...L4_SINGLES.map((l, k) => formsCard(harakat(l), clipUrl(4, 46 + k))),
];

const lesson4: LessonDef = {
  slug: 'nuraniyyah-lesson-4',
  title: 'Lesson 4: The Moving Letters — الْحُرُوفُ الْمُتَحَرِّكَةُ (الْحَرَكَاتُ)',
  description: 'Learn the three short vowels — fatḥah, kasrah and ḍammah — and read every letter with each of them.',
  html: `
<h2>The Moving Letters — ${ar('الْحُرُوفُ الْمُتَحَرِّكَةُ (الْحَرَكَاتُ)')}</h2>
${page('10')}
<p>A <strong>ḥarakah</strong> (${ar('حَرَكَة')}) is a short movement of sound. Arabic has <strong>three short vowels</strong>: small marks written above or below a letter that tell you which sound to say after it. Tap a name to hear it.</p>
${table(
  ['Name', 'Mark', 'Sound', 'Where it is written', 'Example'],
  [
    [`Fatḥah ${ar('فَتْحَة')} <span data-audio="${clipUrl(4, 3)}" role="button" tabindex="0" aria-label="Play fatḥah" style="cursor:pointer;">🔊</span>`, ar('ـَ', '2rem'), '<strong>a</strong> (as in "cat")', 'above the letter', `${ar('بَ', '2rem')} <em>ba</em>`],
    [`Kasrah ${ar('كَسْرَة')} <span data-audio="${clipUrl(4, 4)}" role="button" tabindex="0" aria-label="Play kasrah" style="cursor:pointer;">🔊</span>`, ar('ـِ', '2rem'), '<strong>i</strong> (as in "sit")', 'below the letter', `${ar('بِ', '2rem')} <em>bi</em>`],
    [`Ḍammah ${ar('ضَمَّة')} <span data-audio="${clipUrl(4, 5)}" role="button" tabindex="0" aria-label="Play ḍammah" style="cursor:pointer;">🔊</span>`, ar('ـُ', '2rem'), '<strong>u</strong> (as in "put")', 'above the letter', `${ar('بُ', '2rem')} <em>bu</em>`],
  ],
)}
${exampleBox('Remember', '<p><strong>Ḥarakāt are short sounds.</strong> A letter with a ḥarakah is read together with its vowel in one quick beat: <em>ba</em>, <em>bi</em>, <em>bu</em>.</p>')}

<h3>Read every letter with its three vowels</h3>
<p>Each card shows <strong>fatḥah · kasrah · ḍammah</strong>, from right to left, in the order the book prints them. The alif is written with a hamzah (${ar('أ')} / ${ar('إ')}) because a vowel needs a letter to carry it. Tap a card to hear all three.</p>
${arabicGrid(lesson4Items, { min: 210, size: '2.25rem' })}
${warnBox('Mind the heavy letters', '<p>The heavy letters خ ص ض ط ظ غ ق keep their full, round sound with every vowel. Say <em>ṭa</em> and <em>ta</em> carefully — they are different!</p>')}
`.trim(),
  terms: [
    { arabic: 'حَرَكَة', transliteration: 'ḥarakah', translation: 'a short vowel (plural: ḥarakāt)' },
    { arabic: 'فَتْحَة', transliteration: 'fatḥah', translation: 'the short vowel "a", written above a letter' },
    { arabic: 'كَسْرَة', transliteration: 'kasrah', translation: 'the short vowel "i", written below a letter' },
    { arabic: 'ضَمَّة', transliteration: 'ḍammah', translation: 'the short vowel "u", written above a letter' },
  ],
  cards: [
    { front: 'What sound does a fatḥah make?', frontArabic: 'بَ', back: 'a — as in "ba"', category: 'rule', tags: ['nuraniyyah', 'harakat'] },
    { front: 'What sound does a kasrah make?', frontArabic: 'بِ', back: 'i — as in "bi"', category: 'rule', tags: ['nuraniyyah', 'harakat'] },
    { front: 'What sound does a ḍammah make?', frontArabic: 'بُ', back: 'u — as in "bu"', category: 'rule', tags: ['nuraniyyah', 'harakat'] },
    { front: 'What is a ḥarakah?', back: 'A short vowel — a small mark above or below a letter.', backArabic: 'حَرَكَة', category: 'definition', tags: ['nuraniyyah', 'harakat'] },
    { front: 'Read this letter', frontArabic: 'قُ', back: 'qu', category: 'example', tags: ['nuraniyyah', 'harakat'] },
    { front: 'Read this letter', frontArabic: 'طِ', back: 'ṭi', category: 'example', tags: ['nuraniyyah', 'harakat'] },
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is بِ read?',
      options: ['ba', 'bi', 'bu', 'b'],
      correctAnswer: 'bi',
      explanation: 'The kasrah gives the sound "i", so بِ is read "bi".',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which ḥarakah is written below the letter?',
      options: ['Fatḥah', 'Kasrah', 'Ḍammah', 'Sukūn'],
      correctAnswer: 'Kasrah',
      explanation: 'The kasrah is the only short vowel written below the letter.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is كُ read?',
      options: ['ka', 'ki', 'ku', 'ko'],
      correctAnswer: 'ku',
      explanation: 'The ḍammah gives the sound "u", so كُ is read "ku".',
      difficulty: 'EASY',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'Ḥarakāt are long vowels.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Ḥarakāt are SHORT vowels — one quick beat each.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 5 — Tanwīn (pages 11–12)
// ─────────────────────────────────────────────────────────────────────────────

const tanween = (l: string) =>
  l === 'أ'
    ? ['أً', 'إٍ', 'أٌ']
    : [`${l}${FATHATAN}ا`, `${l}${KASRATAN}`, `${l}${DAMMATAN}`];

const lesson5Items = [
  ...L5_SPELLED.map((l, g) => formsCard(tanween(l), clipUrl(5, 10 + 5 * g))),
  ...L5_SINGLES.map((l, k) => formsCard(tanween(l), clipUrl(5, 36 + k))),
  formsCard(tanween(L5_LAST), clipUrl(5, 61)),
];

const lesson5: LessonDef = {
  slug: 'nuraniyyah-lesson-5',
  title: 'Lesson 5: The Letters with Tanwīn — الْحُرُوفُ الْمُنَوَّنَةُ',
  description: 'Learn tanwīn — the "implied noon" that is pronounced but not written — and read it on every letter.',
  html: `
<h2>The Letters with Tanwīn — ${ar('الْحُرُوفُ الْمُنَوَّنَةُ (التَّنْوِينُ)')}</h2>
${page('11 – 12')}
<p><strong>Tanwīn</strong> is a noon sound (${ar('ن')}) added to the end of a word after a ḥarakah. It is <strong>pronounced but not written</strong> as a letter. Instead, the ḥarakah is written <strong>twice</strong>. Tap a name to hear it.</p>
${table(
  ['Name', 'Mark', 'Sound', 'Example'],
  [
    [`Fatḥatayn ${ar('فَتْحَتَيْنِ')} <span data-audio="${clipUrl(5, 3)}" role="button" tabindex="0" aria-label="Play fatḥatayn" style="cursor:pointer;">🔊</span>`, ar('ـً', '2rem'), '<strong>an</strong>', `${ar('بًا', '2rem')} <em>ban</em>`],
    [`Kasratayn ${ar('كَسْرَتَيْنِ')} <span data-audio="${clipUrl(5, 4)}" role="button" tabindex="0" aria-label="Play kasratayn" style="cursor:pointer;">🔊</span>`, ar('ـٍ', '2rem'), '<strong>in</strong>', `${ar('بٍ', '2rem')} <em>bin</em>`],
    [`Ḍammatayn ${ar('ضَمَّتَيْنِ')} <span data-audio="${clipUrl(5, 5)}" role="button" tabindex="0" aria-label="Play ḍammatayn" style="cursor:pointer;">🔊</span>`, ar('ـٌ', '2rem'), '<strong>un</strong>', `${ar('بٌ', '2rem')} <em>bun</em>`],
  ],
)}
${exampleBox('Remember', '<p><strong>Ḥarakāt are short sounds, and tanwīn is adding a noon to the ḥarakāt.</strong> So بَ is <em>ba</em>, but بً is <em>ban</em>.</p>')}
${tipBox('Fatḥatayn and alif', `<p>Fatḥatayn is usually written with an alif: ${ar('بًا', '2rem')} — <em>ban</em>. The alif is <strong>not pronounced</strong>; you simply say <em>an</em>.</p>`)}

<h3>Read every letter with tanwīn</h3>
<p>Each card shows <strong>fatḥatayn · kasratayn · ḍammatayn</strong>, from right to left. Tap a card to hear all three.</p>
${arabicGrid(lesson5Items, { min: 210, size: '2.25rem' })}

<h3>Where the letters come from</h3>
<p>The book ends the page by grouping the letters by the part of the mouth they come from:</p>
${table(
  ['Group', 'Letters'],
  [
    [`Throat letters ${ar('الْحُرُوفُ الْحَلْقِيَّةُ')}`, ar('أ ه ع ح غ خ', '1.8rem')],
    [`Lip letters ${ar('الْحُرُوفُ الشَّفَوِيَّةُ')}`, ar('ف و ب م', '1.8rem')],
    [`Tongue letters ${ar('الْحُرُوفُ اللِّسَانِيَّةُ')}`, ar('ق ك ج ش ي ض ل ن ر ط د ت ص س ز ظ ذ ث', '1.8rem')],
  ],
)}
`.trim(),
  terms: [
    { arabic: 'تَنْوِين', transliteration: 'tanwīn', translation: 'adding a noon sound to the end of a word' },
    { arabic: 'فَتْحَتَيْن', transliteration: 'fatḥatayn', translation: 'double fatḥah — the sound "an"' },
    { arabic: 'كَسْرَتَيْن', transliteration: 'kasratayn', translation: 'double kasrah — the sound "in"' },
    { arabic: 'ضَمَّتَيْن', transliteration: 'ḍammatayn', translation: 'double ḍammah — the sound "un"' },
  ],
  cards: [
    { front: 'What is tanwīn?', back: 'An implied noon added after a ḥarakah — pronounced but not written.', backArabic: 'تَنْوِين', category: 'definition', tags: ['nuraniyyah', 'tanween'] },
    { front: 'Read this letter', frontArabic: 'بًا', back: 'ban', category: 'example', tags: ['nuraniyyah', 'tanween'] },
    { front: 'Read this letter', frontArabic: 'بٍ', back: 'bin', category: 'example', tags: ['nuraniyyah', 'tanween'] },
    { front: 'Read this letter', frontArabic: 'بٌ', back: 'bun', category: 'example', tags: ['nuraniyyah', 'tanween'] },
    { front: 'Which letters are the throat letters?', back: 'alif (hamzah), hāʾ, ʿayn, ḥāʾ, ghayn, khāʾ', backArabic: 'أ ه ع ح غ خ', category: 'definition', tags: ['nuraniyyah', 'makhraj'] },
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which sound does tanwīn add to the ḥarakah?',
      options: ['A noon sound (n)', 'A meem sound (m)', 'A long vowel', 'A resting sound'],
      correctAnswer: 'A noon sound (n)',
      explanation: 'Tanwīn is an implied noon: ban, bin, bun.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is بٍ read?',
      options: ['bi', 'bin', 'ban', 'bun'],
      correctAnswer: 'bin',
      explanation: 'Kasratayn gives the sound "in", so بٍ is read "bin".',
      difficulty: 'EASY',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'The noon of tanwīn is written as the letter ن.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The noon of tanwīn is pronounced but NOT written — the ḥarakah is simply written twice.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 6 — Exercises on harakat and tanwīn (pages 12–13)
// ─────────────────────────────────────────────────────────────────────────────

const lesson6: LessonDef = {
  slug: 'nuraniyyah-lesson-6',
  title: 'Lesson 6: Exercises on the Ḥarakāt and Tanwīn — تَدْرِيبَاتٌ عَلَى الْحَرَكَاتِ وَالتَّنْوِينِ',
  description: 'Put the letters, ḥarakāt and tanwīn together by reading real Arabic words, one letter at a time.',
  html: `
<h2>Exercises on the Ḥarakāt and Tanwīn — ${ar('تَدْرِيبَاتٌ عَلَى الْحَرَكَاتِ وَالتَّنْوِينِ')}</h2>
${page('12 – 13')}
<p>Now you can read words! Take each word <strong>from right to left</strong>, say each letter with its ḥarakah, and then join the sounds together. Check yourself with the pronunciation underneath, and tap 🔊 to hear the teacher read the word.</p>
${tipBox('Remember', '<p><strong>Ḥarakāt are short sounds, and tanwīn is adding a noon to the ḥarakāt.</strong></p>')}
${exerciseGrid(6)}
${warnBox(
  'Reading on and stopping',
  `<p>The pronunciations here show each word <strong>as written, when you keep reading</strong>. When you <em>stop</em> on a word, you drop the final vowel or tanwīn, and a final ${ar('ة')} is read as <em>h</em> — for example ${ar('رَقَبَةٌ')} is read <em>raqabah</em> when you stop.</p>`,
)}
`.trim(),
  terms: [{ arabic: 'تَدْرِيبَات', transliteration: 'tadrībāt', translation: 'exercises' }],
  cards: ['أَبَدًا', 'بَخِلَ', 'خَلَقَ', 'سَفَرَةٍ', 'طُوًى', 'قُتِلَ'].map((w) => wordCard(w, 'exercises')),
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word أَبَدًا read?',
      options: ['ʾabadan', 'ʾabadun', 'ʾibadan', 'ʾabdan'],
      correctAnswer: 'ʾabadan',
      explanation: 'أَ = ʾa, بَ = ba, دًا = dan (fatḥatayn), so the word is ʾabadan.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word خَلَقَ read?',
      options: ['khalaqa', 'khuliqa', 'khalaqi', 'kalaqa'],
      correctAnswer: 'khalaqa',
      explanation: 'Every letter carries a fatḥah: kha-la-qa.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word قُتِلَ read?',
      options: ['qatala', 'qutila', 'qutala', 'qitila'],
      correctAnswer: 'qutila',
      explanation: 'Ḍammah, kasrah, fatḥah: qu-ti-la.',
      difficulty: 'MEDIUM',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 7 — The small alif, small yāʾ and small wāw (page 13)
// ─────────────────────────────────────────────────────────────────────────────

const smallAlif = (l: string) => `${l === 'ء' ? 'أ' : l}${F}${DAGGER}`;

const lesson7Items = L7_SMALL_ALIF.map((l, k) =>
  item(smallAlif(l), undefined, k < L7_AUDIO_COUNT ? clipUrl(7, 4 + k) : undefined),
);
const lesson7Extra = [
  item(`إ${K}${SMALL_YA}`, undefined, clipUrl(7, 18)),
  item(`ه${K}${SMALL_YA}`, undefined, clipUrl(7, 19)),
  item(`أ${D}${SMALL_WAW}`, undefined, clipUrl(7, 20)),
  item(`ه${D}${SMALL_WAW}`, undefined, clipUrl(7, 21)),
];

const lesson7: LessonDef = {
  slug: 'nuraniyyah-lesson-7',
  title: 'Lesson 7: The Small Alif, Small Yāʾ and Small Wāw — الْأَلِفُ الصَّغِيرَةُ وَالْيَاءُ الصَّغِيرَةُ وَالْوَاوُ الصَّغِيرَةُ',
  description: 'Learn the tiny alif, yāʾ and wāw written above and below a letter, which stretch the vowel for two beats.',
  html: `
<h2>The Small Alif, Small Yāʾ and Small Wāw — ${ar('الْأَلِفُ الصَّغِيرَةُ وَالْيَاءُ الصَّغِيرَةُ وَالْوَاوُ الصَّغِيرَةُ')}</h2>
${page('13')}
<p>Sometimes a <strong>very small alif</strong> (${ar('ـَٰ')}) is written above a letter instead of a full-size one. It is read exactly like an alif after a fatḥah: the vowel is <strong>stretched for two beats</strong>. In the same way a <strong>small yāʾ</strong> (${ar('ـِۦ')}) after a kasrah gives <em>ī</em> and a <strong>small wāw</strong> (${ar('ـُۥ')}) after a ḍammah gives <em>ū</em>.</p>
${table(
  ['Small letter', 'Written', 'Read as'],
  [
    [`Small alif ${ar('الْأَلِفُ الصَّغِيرَةُ')}`, ar('بَٰ', '2rem'), '<em>bā</em>'],
    [`Small yāʾ ${ar('الْيَاءُ الصَّغِيرَةُ')}`, ar('هِۦ', '2rem'), '<em>hī</em>'],
    [`Small wāw ${ar('الْوَاوُ الصَّغِيرَةُ')}`, ar('هُۥ', '2rem'), '<em>hū</em>'],
  ],
)}

<h3>Letters with the small alif</h3>
<p>Read each cell from right to left. The teacher reads the first fourteen on the recording — tap 🔊 to hear them.</p>
${arabicGrid(lesson7Items, { min: 100, size: '2.75rem' })}

<h3>Small yāʾ and small wāw</h3>
<p>The book ends the page with the hamzah and hāʾ carrying a small yāʾ or a small wāw:</p>
${arabicGrid(lesson7Extra, { min: 120, size: '2.75rem' })}
${tipBox('In the Qur\'ān', `<p>You will meet these in words like ${ar('بِهِۦ')} (<em>bihī</em>), ${ar('لَهُۥ')} (<em>lahū</em>) and ${ar('إِنَّهُۥ')} (<em>innahū</em>): the small mark tells you to stretch the vowel of the hāʾ for two beats.</p>`)}
`.trim(),
  terms: [
    { arabic: 'الْأَلِفُ الصَّغِيرَة', transliteration: 'al-alif aṣ-ṣaghīrah', translation: 'the small alif' },
    { arabic: 'الْيَاءُ الصَّغِيرَة', transliteration: 'al-yāʾ aṣ-ṣaghīrah', translation: 'the small yāʾ' },
    { arabic: 'الْوَاوُ الصَّغِيرَة', transliteration: 'al-wāw aṣ-ṣaghīrah', translation: 'the small wāw' },
  ],
  cards: [
    { front: 'How is a letter with a small alif read?', frontArabic: 'بَٰ', back: 'bā — the vowel is stretched for two beats', category: 'rule', tags: ['nuraniyyah', 'small-alif'] },
    { front: 'Read this', frontArabic: 'هِۦ', back: 'hī', category: 'example', tags: ['nuraniyyah', 'small-alif'] },
    { front: 'Read this', frontArabic: 'هُۥ', back: 'hū', category: 'example', tags: ['nuraniyyah', 'small-alif'] },
    { front: 'Read this', frontArabic: 'مَٰ', back: 'mā', category: 'example', tags: ['nuraniyyah', 'small-alif'] },
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the letter with a small alif بَٰ read?',
      options: ['ba', 'bā', 'bi', 'bū'],
      correctAnswer: 'bā',
      explanation: 'A small alif after a fatḥah stretches the vowel: bā.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is هُۥ (ḍammah with a small wāw) read?',
      options: ['hu', 'hū', 'hi', 'hī'],
      correctAnswer: 'hū',
      explanation: 'The small wāw after a ḍammah stretches it: hū.',
      difficulty: 'EASY',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'A small alif is read for two beats, just like a full-size alif.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The small alif, yāʾ and wāw all lengthen the vowel for two beats.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 8 — Madd letters and līn (pages 14–16)
// ─────────────────────────────────────────────────────────────────────────────

const maddForms = (l: string) =>
  l === 'ء' ? ['آ', 'أُوا', 'إِي'] : [`${l}${F}ا`, `${l}${D}وا`, `${l}${K}ي`];

const maddItems = [
  ...L8_MADD_SPELLED_A.map((l, g) => formsCard(maddForms(l), clipUrl(8, 7 + 5 * g))),
  ...L8_MADD_SINGLES.map((l, k) => formsCard(maddForms(l), clipUrl(8, 58 + k))),
  ...L8_MADD_SPELLED_B.map((l, g) => formsCard(maddForms(l), clipUrl(8, 77 + 5 * g))),
];

const leenForms = (l: string) => (l === 'ء' ? ['أَوْ', 'أَيْ'] : [`${l}${F}و${SUK}`, `${l}${F}ي${SUK}`]);

const leenItems = [
  ...L8_LEEN_SPELLED_A.map((l, g) => formsCard(leenForms(l), clipUrl(8, 86 + 3 * g))),
  ...L8_LEEN_SINGLES.map((l, k) => formsCard(leenForms(l), clipUrl(8, 114 + k))),
  ...L8_LEEN_SPELLED_B.map((l, g) => formsCard(leenForms(l), clipUrl(8, 131 + 3 * g))),
];

const lesson8: LessonDef = {
  slug: 'nuraniyyah-lesson-8',
  title: 'Lesson 8: The Letters of Madd and Līn — حُرُوفُ الْمَدِّ وَاللِّينِ',
  description: 'Learn the three letters of stretching, the natural madd held for two ḥarakāt, and the softer līn letters.',
  html: `
<h2>The Letters of Madd and Līn — ${ar('حُرُوفُ الْمَدِّ وَاللِّينِ')}</h2>
${page('14 – 15')}
<p><strong>Madd</strong> (${ar('مَدّ')}) means <strong>stretching</strong>. There are three madd letters, and each one needs the right ḥarakah before it:</p>
${table(
  ['Madd letter', 'Needs before it', 'Read as', 'Example'],
  [
    [`Alif ${ar('ا', '2rem')}`, 'a fatḥah', 'ā', `${ar('بَا', '2rem')} <em>bā</em>`],
    [`Wāw ${ar('و', '2rem')}`, 'a ḍammah', 'ū', `${ar('بُو', '2rem')} <em>bū</em>`],
    [`Yāʾ ${ar('ي', '2rem')}`, 'a kasrah', 'ī', `${ar('بِي', '2rem')} <em>bī</em>`],
  ],
)}
${exampleBox(
  `Natural madd — ${ar('الْمَدُّ الطَّبِيعِيُّ')}`,
  `<p><strong>Whenever a fatḥah is followed by an alif, a ḍammah by a wāw, and a kasrah by a yāʾ, then one ḥarakah is stretched to two ḥarakāt.</strong></p>
<p>A ḥarakah is one beat — about the time it takes to open or close a finger. The natural madd is held for <strong>two beats</strong>.</p>`,
)}
${warnBox('Silent alif', `<p>After a wāw of madd the alif is <strong>not pronounced</strong>: ${ar('بُوا', '2rem')} is read <em>bū</em>, not <em>bū-ā</em>.</p>`)}

<h3>Read each letter with its madd</h3>
<p>Each card shows <strong>fatḥah + alif · ḍammah + wāw · kasrah + yāʾ</strong>, from right to left. Hold each long sound for two beats. Tap a card to hear it.</p>
${arabicGrid(maddItems, { min: 210, size: '2.25rem' })}

<h2>Līn — ${ar('اللِّينُ')}</h2>
${page('15 – 16')}
<p>When a <strong>wāw (و)</strong> or a <strong>yāʾ (ي)</strong> carries a <strong>sukūn</strong> and comes after a <strong>fatḥah</strong>, it is called a <strong>līn letter</strong> (${ar('حُرُوفُ اللِّينِ')}) — the "soft" letters. They give the sounds <em>aw</em> and <em>ay</em>, and they are <strong>weaker than the madd letters</strong>.</p>
${table(
  ['Līn letter', 'Written', 'Read as'],
  [
    [`Wāw ${ar('و')}`, ar('بَوْ', '2rem'), '<em>baw</em>'],
    [`Yāʾ ${ar('ي')}`, ar('بَيْ', '2rem'), '<em>bay</em>'],
  ],
)}
${exampleBox('Remember', '<p><strong>Madd is stretched to two ḥarakāt, and līn is the weaker form of madd.</strong></p>')}
<p>Each card shows <strong>wāw līn · yāʾ līn</strong>, from right to left.</p>
${arabicGrid(leenItems, { min: 150, size: '2.25rem' })}
`.trim(),
  terms: [
    { arabic: 'مَدّ', transliteration: 'madd', translation: 'stretching a sound' },
    { arabic: 'حُرُوفُ الْمَدّ', transliteration: 'ḥurūf al-madd', translation: 'the letters of stretching: alif, wāw and yāʾ' },
    { arabic: 'الْمَدُّ الطَّبِيعِيّ', transliteration: 'al-madd aṭ-ṭabīʿī', translation: 'the natural madd — held for two ḥarakāt' },
    { arabic: 'اللِّين', transliteration: 'al-līn', translation: 'softness — wāw or yāʾ with sukūn after a fatḥah' },
  ],
  cards: [
    { front: 'How long is the natural madd held?', back: 'Two ḥarakāt (two beats).', category: 'rule', tags: ['nuraniyyah', 'madd'] },
    { front: 'Which three letters are the madd letters?', back: 'Alif after a fatḥah, wāw after a ḍammah, yāʾ after a kasrah.', backArabic: 'ا و ي', category: 'rule', tags: ['nuraniyyah', 'madd'] },
    { front: 'Read this madd', frontArabic: 'بَا', back: 'bā', category: 'example', tags: ['nuraniyyah', 'madd'] },
    { front: 'Read this madd', frontArabic: 'بِي', back: 'bī', category: 'example', tags: ['nuraniyyah', 'madd'] },
    { front: 'Read this madd', frontArabic: 'بُو', back: 'bū', category: 'example', tags: ['nuraniyyah', 'madd'] },
    { front: 'What are the līn letters?', back: 'Wāw or yāʾ with a sukūn after a fatḥah: aw and ay. Līn is the weaker form of madd.', backArabic: 'بَوْ بَيْ', category: 'rule', tags: ['nuraniyyah', 'leen'] },
    { front: 'Read this', frontArabic: 'بَيْ', back: 'bay', category: 'example', tags: ['nuraniyyah', 'leen'] },
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'For how many ḥarakāt is the natural madd stretched?',
      options: ['One', 'Two', 'Four', 'Six'],
      correctAnswer: 'Two',
      explanation: 'The natural madd (madd ṭabīʿī) is stretched for two ḥarakāt.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which ḥarakah must come before the madd letter wāw (و)?',
      options: ['Fatḥah', 'Kasrah', 'Ḍammah', 'Sukūn'],
      correctAnswer: 'Ḍammah',
      explanation: 'Alif follows a fatḥah, yāʾ follows a kasrah and wāw follows a ḍammah.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is بِي read?',
      options: ['bi', 'bī', 'bay', 'bu'],
      correctAnswer: 'bī',
      explanation: 'A kasrah followed by a yāʾ is a madd, so it is stretched: bī.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is بَيْ read?',
      options: ['bī', 'bay', 'bā', 'bi'],
      correctAnswer: 'bay',
      explanation: 'A yāʾ with sukūn after a fatḥah is a līn letter and gives the sound "ay".',
      difficulty: 'EASY',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'Līn is a weaker form of madd.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Līn letters are softer than the madd letters.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 9 — Exercises on tanwīn and the three madd letters (pages 16–18)
// ─────────────────────────────────────────────────────────────────────────────

const SUN_LETTERS = 'ط ث ص ر ت ض ذ ن د س ظ ز ش ل';
const MOON_LETTERS = 'ا ب غ ح ج ك و خ ف ع ق ي م ه';

const lesson9: LessonDef = {
  slug: 'nuraniyyah-lesson-9',
  title: 'Lesson 9: Exercises on Tanwīn, the Three Madd Letters and Līn — تَدْرِيبَاتٌ عَلَى التَّنْوِينِ وَحُرُوفِ الْمَدِّ الثَّلَاثَةِ وَحَرْفَيِ اللِّينِ',
  description: 'Read a long set of words that use tanwīn, madd and līn, and learn the sun and moon letters.',
  html: `
<h2>Exercises on Tanwīn, the Three Madd Letters and Līn — ${ar('تَدْرِيبَاتٌ عَلَى التَّنْوِينِ وَحُرُوفِ الْمَدِّ الثَّلَاثَةِ وَحَرْفَيِ اللِّينِ')}</h2>
${page('16 – 18')}
<p>Read these words using everything you have learned: ḥarakāt, tanwīn, madd and līn. Tap 🔊 to hear the teacher read a word, and check yourself with the pronunciation underneath.</p>
${exerciseGrid(9, EXERCISE_WORDS[9], 140)}

<h3>Two more words from the book</h3>
${arabicGrid(L9_EXTRA_WORDS.map((w) => item(w)), { min: 180, size: '2.75rem' })}

<h3>Sun letters and moon letters</h3>
<p>The book lists the letters in two groups. Before the sun letters the lām of ${ar('ال')} is not pronounced and the next letter is doubled; before the moon letters the lām is pronounced clearly.</p>
${table(
  ['Group', 'Letters', 'Example'],
  [
    [`Sun letters ${ar('الْحُرُوفُ الشَّمْسِيَّةُ')}`, ar(SUN_LETTERS, '1.8rem'), `${ar('الشَّمْسُ')} <em>ash-shamsu</em>`],
    [`Moon letters ${ar('الْحُرُوفُ الْقَمَرِيَّةُ')}`, ar(MOON_LETTERS, '1.8rem'), `${ar('الْقَمَرُ')} <em>al-qamaru</em>`],
  ],
)}
`.trim(),
  terms: [
    { arabic: 'الْحُرُوفُ الشَّمْسِيَّة', transliteration: 'al-ḥurūf ash-shamsiyyah', translation: 'the sun letters' },
    { arabic: 'الْحُرُوفُ الْقَمَرِيَّة', transliteration: 'al-ḥurūf al-qamariyyah', translation: 'the moon letters' },
  ],
  cards: [
    ...['جَاءَ', 'خَوْفٍ', 'قَالَ', 'كَيْفَ', 'عَظِيمٌ', 'مَجِيدٌ'].map((w) => wordCard(w, 'exercises')),
    { front: 'Name two sun letters', back: 'for example ش (shīn) and س (sīn): ash-shamsu, as-samāʾu', backArabic: SUN_LETTERS, category: 'definition' as const, tags: ['nuraniyyah', 'sun-moon'] },
    { front: 'Name two moon letters', back: 'for example ق (qāf) and م (mīm): al-qamaru, al-masjidu', backArabic: MOON_LETTERS, category: 'definition' as const, tags: ['nuraniyyah', 'sun-moon'] },
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word كَيْفَ read?',
      options: ['kayfa', 'kīfa', 'kayfā', 'kifa'],
      correctAnswer: 'kayfa',
      explanation: 'Yāʾ with sukūn after a fatḥah is līn: kay-fa.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word عَظِيمٌ read?',
      options: ['ʿaẓīmun', 'ʿaẓimun', 'ʿuẓīmun', 'ʿaẓaman'],
      correctAnswer: 'ʿaẓīmun',
      explanation: 'The kasrah followed by yāʾ is a madd — stretch it for two beats — and the tanwīn gives -un.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'In جَاءَ the alif is stretched. How is the word read?',
      options: ['jāʾa', 'jaʾa', 'jāa', 'jaʾā'],
      correctAnswer: 'jāʾa',
      explanation: 'The fatḥah on the jīm is followed by an alif, so it is stretched: jā-ʾa.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of these is a sun letter?',
      options: ['ش', 'ق', 'م', 'ب'],
      correctAnswer: 'ش',
      explanation: 'Shīn is a sun letter: ash-shamsu. Qāf, mīm and bāʾ are moon letters.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 10 — Sukūn (page 18)
// ─────────────────────────────────────────────────────────────────────────────

const lesson10Items = L10_LETTERS.map((l, k) => {
  return formsCard([`أَ${l}${SUK}`, `إِ${l}${SUK}`, `أُ${l}${SUK}`], SUKOON_GROUP_URLS[k]);
});

const lesson10: LessonDef = {
  slug: 'nuraniyyah-lesson-10',
  title: 'Lesson 10: The Resting Sound — السُّكُونُ',
  description: 'Learn the sukūn (resting sound) and the letters that bounce when they rest.',
  html: `
<h2>The Resting Sound — ${ar('السُّكُونُ ( ْـ )')}</h2>
${page('18')}
<p>A <strong>ḥarakah</strong> means to <em>move</em> the sound in the direction of a fatḥah, kasrah or ḍammah. When the ḥarakah is taken away, it is replaced by a <strong>sukūn</strong> (${ar('ـْ', '1.6rem')}), which is a <strong>resting sound</strong>: the letter is pronounced <em>without any vowel</em>, and flows straight into the next letter.</p>
${exampleBox('Compare', `<p>${ar('بَ', '2rem')} <em>ba</em> (with a vowel) &nbsp;→&nbsp; ${ar('أَبْ', '2rem')} <em>ab</em> (the bāʾ rests, so it is just "b").</p>`)}

<h3>Read each letter with sukūn</h3>
<p>Each card shows the letter resting after <strong>fatḥah · kasrah · ḍammah</strong>, from right to left. The letters are coloured in the book by how firmly they stop; tap a card to hear it.</p>
${arabicGrid(lesson10Items, { min: 210, size: '2.25rem' })}

<h3>Strong, medium and soft letters</h3>
<p>The book groups the letters by how they sound when they rest:</p>
${table(
  ['Group', 'Letters', 'How they rest'],
  [
    [`Strong ${ar('الْحُرُوفُ الشَّدِيدَةُ')}`, ar('أ ج د ق ط ب ك ت', '1.8rem'), 'The sound stops completely.'],
    [`Medium ${ar('الْحُرُوفُ الْبَيْنِيَّةُ')}`, ar('ل ن ع م ر', '1.8rem'), 'The sound is half held.'],
    [`Soft ${ar('الْحُرُوفُ الرَّخْوَةُ')}`, '<em>all the remaining letters</em>', 'The sound flows on.'],
  ],
)}

<h3>Bouncing letters — ${ar('حُرُوفُ الْقَلْقَلَةِ')}</h3>
<p>If one of <strong>five letters</strong> comes with a sukūn, it produces a <strong>bouncing sound</strong> — a small echo, as if you lightly bounce the sound off the place it comes from. This is called <strong>qalqalah</strong>.</p>
${arabicLine('قُطْبُ جَدٍّ', transliterate('قُطْبُ جَدٍّ'))}
${arabicGrid(['ق', 'ط', 'ب', 'ج', 'د'].map((c) => item(c, L(c)!.name)), { min: 90, size: '2.75rem' })}
${tipBox('Careful!', '<p>The bounce is <strong>light</strong> — do not add a vowel. Say <em>ab</em> with a tiny echo on the bāʾ, not <em>aba</em>.</p>')}
`.trim(),
  terms: [
    { arabic: 'سُكُون', transliteration: 'sukūn', translation: 'a resting sound — a letter pronounced without a vowel' },
    { arabic: 'حُرُوفُ الْقَلْقَلَة', transliteration: 'ḥurūf al-qalqalah', translation: 'the bouncing letters: qāf, ṭāʾ, bāʾ, jīm, dāl' },
    { arabic: 'قَلْقَلَة', transliteration: 'qalqalah', translation: 'a bouncing or echoing sound' },
  ],
  cards: [
    { front: 'What is a sukūn?', back: 'A resting sound — the letter is read without a vowel.', backArabic: 'سُكُون', category: 'definition', tags: ['nuraniyyah', 'sukoon'] },
    { front: 'Which five letters are the bouncing (qalqalah) letters?', back: 'qāf, ṭāʾ, bāʾ, jīm, dāl — quṭbu jadd', backArabic: 'قُطْبُ جَدٍّ', category: 'rule', tags: ['nuraniyyah', 'qalqalah'] },
    { front: 'What happens to a qalqalah letter that has a sukūn?', back: 'It produces a light bouncing sound.', category: 'rule', tags: ['nuraniyyah', 'qalqalah'] },
    { front: 'Read this', frontArabic: 'أَبْ', back: 'ab', category: 'example', tags: ['nuraniyyah', 'sukoon'] },
    { front: 'Read this', frontArabic: 'إِطْ', back: 'iṭ', category: 'example', tags: ['nuraniyyah', 'sukoon'] },
    { front: 'Which letters are the strong letters?', back: 'The sound stops completely on them.', backArabic: 'أ ج د ق ط ب ك ت', category: 'definition', tags: ['nuraniyyah', 'sukoon'] },
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is a sukūn?',
      options: ['A long vowel', 'A resting sound', 'A doubled letter', 'A noon sound'],
      correctAnswer: 'A resting sound',
      explanation: 'The sukūn replaces the ḥarakah: the letter rests and is read without a vowel.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which are the five qalqalah (bouncing) letters?',
      options: ['ق ط ب ج د', 'ق ك ط ب د', 'ج ح خ ع غ', 'ب ت ث ن ي'],
      correctAnswer: 'ق ط ب ج د',
      explanation: 'The bouncing letters are qāf, ṭāʾ, bāʾ, jīm and dāl — remembered as قُطْبُ جَدٍّ.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is أَبْ read?',
      options: ['aba', 'ab', 'abu', 'ib'],
      correctAnswer: 'ab',
      explanation: 'The bāʾ has a sukūn, so it rests: ab.',
      difficulty: 'EASY',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'When a qalqalah letter has a sukūn, it produces a bouncing sound.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'A qalqalah letter with sukūn is pronounced with a light bounce.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 11 — Exercises on sukūn (page 19)
// ─────────────────────────────────────────────────────────────────────────────

const lesson11: LessonDef = {
  slug: 'nuraniyyah-lesson-11',
  title: 'Lesson 11: Exercises on the Sukūn — تَدْرِيبَاتٌ عَلَى السُّكُونِ',
  description: 'Read words full of sukūn, keeping each resting letter at rest, with the bouncing letters echoing lightly.',
  html: `
<h2>Exercises on the Sukūn — ${ar('تَدْرِيبَاتٌ عَلَى السُّكُونِ')}</h2>
${page('19')}
<p>Read each word, keeping the sukūn at rest. The bouncing letters (${ar('قُطْبُ جَدٍّ')}) echo lightly. Tap 🔊 to hear the teacher read a word.</p>
${exerciseGrid(11, EXERCISE_WORDS[11], 140)}
${warnBox('The silent alif at the start', `<p>In ${ar('فَٱرْغَبْ')} and ${ar('فَٱنصَبْ')} the small alif of ${ar('ٱ')} is <strong>not pronounced</strong> when you read on from the letter before it: <em>farghab</em>, <em>fanṣab</em>.</p>`)}

<h3>Looking ahead</h3>
<p>The book's later lessons build on what you have learned here. The letters to remember for them are:</p>
${table(
  ['Topic', 'Letters'],
  [
    [`Change ${ar('الْإِقْلَابُ')}`, ar('ب', '1.8rem')],
    [`Merge ${ar('الْإِدْغَامُ')}`, ar('ي ر م ل و ن', '1.8rem')],
    [`Show ${ar('الْإِظْهَارُ')}`, ar('ء ه ع ح غ خ', '1.8rem')],
    [`Hide ${ar('الْإِخْفَاءُ')}`, ar('ص ذ ث ك ج ش ق س د ط ز ف ت ض ظ', '1.8rem')],
    [`Bounce ${ar('الْقَلْقَلَةُ')}`, ar('ق ط ب ج د', '1.8rem')],
  ],
)}
${tipBox('Well done!', `<p>You can now read the whole alphabet with every ḥarakah, tanwīn, madd, līn and sukūn. Keep practising, and make this du'ā often:</p>`)}
${quranVerse({ ref: '20:114', surah: 20, ayah: 114, label: 'Du\'ā for knowledge', ar: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', tr: 'wa qur-rabbi zidnī ʿilmā — "My Lord, increase me in knowledge."' })}
`.trim(),
  terms: [{ arabic: 'تَدْرِيبَاتٌ عَلَى السُّكُون', transliteration: 'tadrībāt ʿalā s-sukūn', translation: 'exercises on the sukūn' }],
  cards: ['أَنْتَ', 'بَعْدُ', 'حَبْلٌ', 'يَسْعَى', 'تَجْرِي', 'إِقْرَأْ'].map((w) => wordCard(w, 'exercises')),
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word أَنْتَ read?',
      options: ['ʾanta', 'ʾanata', 'ʾunta', 'ʾinta'],
      correctAnswer: 'ʾanta',
      explanation: 'The nūn rests (sukūn), so the word is ʾan-ta.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word يَسْعَى read?',
      options: ['yasʿā', 'yasaʿā', 'yasʿa', 'yasʿī'],
      correctAnswer: 'yasʿā',
      explanation: 'The sīn rests, and the final alif maqṣūrah after a fatḥah is stretched: yas-ʿā.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'In بَعْدُ which letter is the resting letter?',
      options: ['ʿayn (ع)', 'bāʾ (ب)', 'dāl (د)', 'None'],
      correctAnswer: 'ʿayn (ع)',
      explanation: 'The ʿayn carries the sukūn: baʿ-du.',
      difficulty: 'EASY',
    },
  ],
};

export const NURANIYYAH_LESSONS: LessonDef[] = [
  lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9, lesson10, lesson11,
];
