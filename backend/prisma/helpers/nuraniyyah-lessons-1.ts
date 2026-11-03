import { HARAKAT, LETTERS, NON_CONNECTING, spell, transliterate } from './nuraniyyah-arabic';
import {
  LessonDef,
  PRONUNCIATION_KEY,
  ar,
  arabicGrid,
  arabicLine,
  exampleBox,
  item,
  items,
  quranVerse,
  table,
  tipBox,
  vowelGrid,
  warnBox,
} from './nuraniyyah-html';

const { fatha: F, damma: D, kasra: K } = HARAKAT;

const L = (ch: string) => LETTERS.find((l) => l.ch === ch)!;

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 1 — The Arabic Alphabet
// ─────────────────────────────────────────────────────────────────────────────

const HEAVY = ['خ', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];

const lesson1: LessonDef = {
  slug: 'nuraniyyah-lesson-1',
  title: 'Lesson 1: The Arabic Alphabet — الحُرُوفُ العَرَبِيَّةُ',
  description: 'Meet the 29 Arabic letters, hear how each one sounds, and learn which letters are heavy and which share the same makhraj.',
  html: `
<h2>Welcome to the Nūrāniyyah 🌟</h2>
<p>The <strong>Nūrāniyyah</strong> (also called <em>Nūrānī Qā'idah</em>) is a step-by-step primer that teaches you to <strong>read the Qur'ān correctly with tajwīd</strong>. Every Arabic example in this course comes with a <strong>pronunciation guide</strong> underneath it, so you can read, say it aloud, and check yourself. Where the example is from the Qur'ān, you can also <strong>listen to a recitation</strong>, and cards marked 🔊 can be <strong>tapped to hear the teacher say them</strong>.</p>
<p>The book gives you good news: you only need to learn <strong>five major rules</strong> to read the Qur'ān with tajwīd. Let's begin with the letters!</p>

<h3>How to read the pronunciation guide</h3>
${PRONUNCIATION_KEY}

<h2>The Arabic Alphabet — ${ar('الْحُرُوفُ الْعَرَبِيَّةُ')}</h2>
<p>Arabic is read from <strong>right to left</strong>, so start at the top right corner of the grid below. There are <strong>29 letters</strong> (28 letters plus the hamzah ${ar('ء')}).</p>
${arabicGrid(LETTERS.map((l) => item(l.ch, `${l.name}`)), { min: 100, size: '3rem' })}

<h3>How each letter sounds</h3>
${table(
  ['Letter', 'Name', 'Pronounced', 'How to say it'],
  LETTERS.map((l) => [ar(l.ch, '2rem'), ar(l.nameAr, '1.4rem'), `<em>${l.name}</em>`, l.how]),
)}

<h2>Heavy Letters — ${ar('الْحُرُوفُ الْمُفَخَّمَةُ')}</h2>
<p>Seven letters are always pronounced <strong>heavy</strong> (with a full, round mouth). Rāʾ ${ar('ر')} is heavy only in certain cases, which you will meet later in tajwīd. The heavy letters are remembered with this phrase:</p>
${arabicLine('خُصَّ ضَغْطٍ قِظْ', transliterate('خُصَّ ضَغْطٍ قِظْ'))}
${arabicGrid(HEAVY.map((c) => item(c, L(c).name)), { min: 90, size: '2.5rem' })}
${tipBox('Try it', '<p>Say <em>ṭā</em> and <em>tā</em> one after the other. Feel how the back of your tongue rises and your mouth fills for the heavy ṭāʾ.</p>')}

<h2>Neighbouring Letters — ${ar('الْحُرُوفُ الْقَرِيبَةُ مَخْرَجًا')}</h2>
<p>These are groups of letters that come from <strong>the same makhraj</strong> (the place in the mouth or throat where the sound is made). They sound close, so practise telling them apart.</p>
${arabicGrid(
  ['فوبم', 'تدط', 'ثذظ', 'جشي', 'حع', 'خغ', 'لنر', 'زسص', 'ءه'].map((g, i) =>
    item([...g].map((c) => (c === 'ء' ? 'أ' : c)).join(' ، '), `${i + 1}. ${spell(g)}`),
  ),
  { min: 200, size: '2.25rem' },
)}
`.trim(),
  terms: [
    { arabic: 'حَرْف', transliteration: 'ḥarf', translation: 'letter' },
    { arabic: 'الْحُرُوفُ الْهِجَائِيَّة', transliteration: 'al-ḥurūf al-hijāʾiyyah', translation: 'the alphabet' },
    { arabic: 'مَخْرَج', transliteration: 'makhraj', translation: 'the exit point of a letter in the mouth or throat' },
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
      category: 'rule',
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
      explanation: 'Arabic is read from right to left, so we start at the top right of every page and grid.',
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
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'What does "makhraj" mean?',
      options: ['The length of a vowel', 'The exit point of a letter', 'A resting sound', 'A doubled letter'],
      correctAnswer: 'The exit point of a letter',
      explanation: 'The makhraj is the place in the mouth or throat from which a letter comes out.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 2 — Combined Letters
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

const combinedExamples = ['كب', 'كا', 'بكت', 'تكث', 'بج', 'يح', 'تم', 'نم', 'نس', 'تس', 'شل', 'سل', 'نبل', 'تنل', 'بيل', 'يتل'];

const lesson2: LessonDef = {
  slug: 'nuraniyyah-lesson-2',
  title: 'Lesson 2: Combined Letters — حُرُوفٌ مَمْزُوجَةٌ',
  description: 'See how letters change shape when they join together, practise reading joined letters, and recite Sūrat an-Nās with the letters you now know.',
  html: `
<h2>Combined Letters — ${ar('حُرُوفٌ مَمْزُوجَةٌ')}</h2>
<p>When letters sit next to each other in a word they <strong>join</strong>, and most letters change their shape a little depending on where they are: at the <strong>start</strong>, in the <strong>middle</strong>, or at the <strong>end</strong> of a joined group. The long dash (ـ) shows where a letter joins.</p>

<h3>Letters that join on both sides</h3>
${table(['Letter', 'Alone', 'Start', 'Middle', 'End'], connectingForms)}

<h3>Letters that do not join to the next letter</h3>
<p>These letters can join to the letter <em>before</em> them but <strong>never to the letter after them</strong>, so the next letter starts a fresh shape:</p>
${table(['Letter', 'Alone', 'Start', 'Middle', 'End'], nonConnectingForms)}
${exampleBox(
  'Lām-alif — لا',
  `<p>When lām ${ar('ل')} is followed by alif ${ar('ا')} they are always written as one joined shape: ${ar('لا', '2rem')} — <em>lām – alif</em>. Alone it is written ${ar('لا', '2rem')} and after a joining letter it is ${ar('ـلا', '2rem')}.</p>`,
)}

<h3>Practise reading joined letters</h3>
<p>Read each group slowly from right to left, saying the name of each letter. The guide spells the letters for you.</p>
${arabicGrid(combinedExamples.map((c) => item(c, spell(c))), { min: 170, size: '2.5rem' })}

<h2>Letter Recognition — ${ar('مَعْرِفَةُ وَتَمْيِيزُ الْحُرُوفِ')}</h2>
<p>Now that you can recognise the letters, here is a short passage from the Qur'ān to look at. You are not expected to read it fluently yet — just <strong>spot the letters you know</strong>, and listen. Every lesson that follows will help you read it properly.</p>
${quranVerse({ ref: '1:1', surah: 1, ayah: 1, label: 'Basmalah', ar: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', tr: 'bismillāhir-raḥmānir-raḥīm' })}
${quranVerse({ ref: '114:1', surah: 114, ayah: 1, label: 'Sūrat an-Nās — verse 1', ar: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ', tr: 'qul aʿūdhu birabbin-nās' })}
${quranVerse({ ref: '114:2', surah: 114, ayah: 2, label: 'Verse 2', ar: 'مَلِكِ ٱلنَّاسِ', tr: 'malikin-nās' })}
${quranVerse({ ref: '114:3', surah: 114, ayah: 3, label: 'Verse 3', ar: 'إِلَٰهِ ٱلنَّاسِ', tr: 'ilāhin-nās' })}
${quranVerse({ ref: '114:4', surah: 114, ayah: 4, label: 'Verse 4', ar: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ', tr: 'min sharril-waswāsil-khannās' })}
${quranVerse({ ref: '114:5', surah: 114, ayah: 5, label: 'Verse 5', ar: 'ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ', tr: 'alladhī yuwaswisu fī ṣudūrin-nās' })}
${quranVerse({ ref: '114:6', surah: 114, ayah: 6, label: 'Verse 6', ar: 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ', tr: 'minal-jinnati wan-nās' })}
${tipBox('Good news!', '<p>You have finished recognising the letters. You only need to learn <strong>five major rules</strong> to read the Qur\'ān with tajwīd — and the next lessons will teach them one at a time.</p>')}
`.trim(),
  terms: [
    { arabic: 'حُرُوفٌ مَمْزُوجَة', transliteration: 'ḥurūfun mamzūjah', translation: 'mixed or combined letters' },
    { arabic: 'لَا', transliteration: 'lām-alif', translation: 'the joined shape of lām and alif' },
  ],
  cards: [
    {
      front: 'Which letters do NOT join to the letter after them?',
      back: 'alif, dāl, dhāl, rāʾ, zāy, wāw',
      backArabic: 'ا د ذ ر ز و',
      category: 'rule',
      tags: ['nuraniyyah', 'combined-letters'],
    },
    {
      front: 'How is lām followed by alif written?',
      back: 'As one joined shape: lām-alif',
      backArabic: 'لا',
      category: 'definition',
      tags: ['nuraniyyah', 'combined-letters'],
    },
    {
      front: 'How do you read this group of letters?',
      frontArabic: 'كب',
      back: spell('كب'),
      category: 'example',
      tags: ['nuraniyyah', 'combined-letters'],
    },
    {
      front: 'How do you read this group of letters?',
      frontArabic: 'نبل',
      back: spell('نبل'),
      category: 'example',
      tags: ['nuraniyyah', 'combined-letters'],
    },
    {
      front: 'What are the three positions a joined letter can take?',
      back: 'Start, middle and end of a joined group (and alone).',
      category: 'definition',
      tags: ['nuraniyyah', 'combined-letters'],
    },
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
// LESSON 3 — Short Vowels (Ḥarakāt)
// ─────────────────────────────────────────────────────────────────────────────

const vowelLetters = ['ا', ...LETTERS.map((l) => l.ch).filter((c) => !['ا', 'ء'].includes(c))].map((c) =>
  c === 'ا' ? 'أ' : c,
);

const lesson3: LessonDef = {
  slug: 'nuraniyyah-lesson-3',
  title: 'Lesson 3: Short Vowels — الْحَرَكَاتُ',
  description: 'Learn the three short vowels — fatḥah, kasrah and ḍammah — and read every letter with each of them.',
  html: `
<h2>Vowels — ${ar('الْحَرَكَاتُ')}</h2>
<p>A <strong>ḥarakah</strong> (${ar('حَرَكَة')}) is a short movement of sound. Arabic has <strong>three short vowels</strong>. They are small marks written above or below a letter, and they tell you which sound to say after the letter.</p>
${table(
  ['Name', 'Mark', 'Sound', 'Where it is written', 'Example'],
  [
    [`Fatḥah ${ar('فَتْحَة')}`, ar('ـَ', '2rem'), '<strong>a</strong> (as in "cat")', 'above the letter', `${ar('بَ', '2rem')} <em>ba</em>`],
    [`Kasrah ${ar('كَسْرَة')}`, ar('ـِ', '2rem'), '<strong>i</strong> (as in "sit")', 'below the letter', `${ar('بِ', '2rem')} <em>bi</em>`],
    [`Ḍammah ${ar('ضَمَّة')}`, ar('ـُ', '2rem'), '<strong>u</strong> (as in "put")', 'above the letter', `${ar('بُ', '2rem')} <em>bu</em>`],
  ],
)}
${exampleBox('Remember', '<p><strong>Ḥarakāt are short sounds.</strong> A letter with a ḥarakah is read together with its vowel in one quick beat: <em>ba</em>, <em>bu</em>, <em>bi</em>.</p>')}

<h3>Read every letter with its three vowels</h3>
<p>Each card shows <strong>fatḥah · ḍammah · kasrah</strong>, read from right to left. The alif row is written with hamzah (${ar('أ')}) because a vowel needs a letter to carry it.</p>
${arabicGrid(vowelGrid(vowelLetters, [F, D, K]), { min: 210, size: '2.25rem' })}
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
// LESSON 4 — Tanwīn
// ─────────────────────────────────────────────────────────────────────────────

const lesson4: LessonDef = {
  slug: 'nuraniyyah-lesson-4',
  title: 'Lesson 4: Tanwīn — التَّنْوِينُ',
  description: 'Learn tanwīn — the "implied noon" that is pronounced but not written — and read it on every letter.',
  html: `
<h2>Tanwīn (Implied Noon) — ${ar('التَّنْوِينُ')}</h2>
<p><strong>Tanwīn</strong> is a noon sound (${ar('ن')}) added to the end of a word after a ḥarakah. It is <strong>pronounced but not written</strong> as a letter. Instead of one mark, the ḥarakah is written <strong>twice</strong>.</p>
${table(
  ['Name', 'Mark', 'Sound', 'Example'],
  [
    [`Fatḥatayn ${ar('فَتْحَتَيْنِ')}`, ar('ـً', '2rem'), '<strong>an</strong>', `${ar('بً', '2rem')} <em>ban</em>`],
    [`Kasratayn ${ar('كَسْرَتَيْنِ')}`, ar('ـٍ', '2rem'), '<strong>in</strong>', `${ar('بٍ', '2rem')} <em>bin</em>`],
    [`Ḍammatayn ${ar('ضَمَّتَيْنِ')}`, ar('ـٌ', '2rem'), '<strong>un</strong>', `${ar('بٌ', '2rem')} <em>bun</em>`],
  ],
)}
${exampleBox('Remember', '<p><strong>Ḥarakāt are short sounds, and tanwīn is adding a noon to the ḥarakāt.</strong> So بَ is <em>ba</em>, but بً is <em>ban</em>.</p>')}
${tipBox(
  'Fatḥatayn and alif',
  `<p>Fatḥatayn is usually written together with an alif: ${ar('أَبَدًا', '2rem')} — <em>${transliterate('أَبَدًا')}</em>. The alif is <strong>not pronounced</strong>; you simply say <em>an</em>.</p>`,
)}

<h3>Read every letter with tanwīn</h3>
<p>Each card shows <strong>fatḥatayn · ḍammatayn · kasratayn</strong>, read from right to left.</p>
${arabicGrid(vowelGrid(vowelLetters, [HARAKAT.fathatan, HARAKAT.dammatan, HARAKAT.kasratan]), { min: 210, size: '2.25rem' })}
`.trim(),
  terms: [
    { arabic: 'تَنْوِين', transliteration: 'tanwīn', translation: 'adding a noon sound to the end of a word' },
    { arabic: 'فَتْحَتَيْن', transliteration: 'fatḥatayn', translation: 'double fatḥah — the sound "an"' },
    { arabic: 'كَسْرَتَيْن', transliteration: 'kasratayn', translation: 'double kasrah — the sound "in"' },
    { arabic: 'ضَمَّتَيْن', transliteration: 'ḍammatayn', translation: 'double ḍammah — the sound "un"' },
  ],
  cards: [
    { front: 'What is tanwīn?', back: 'An implied noon added after a ḥarakah — pronounced but not written.', backArabic: 'تَنْوِين', category: 'definition', tags: ['nuraniyyah', 'tanween'] },
    { front: 'Read this letter', frontArabic: 'بً', back: 'ban', category: 'example', tags: ['nuraniyyah', 'tanween'] },
    { front: 'Read this letter', frontArabic: 'بٍ', back: 'bin', category: 'example', tags: ['nuraniyyah', 'tanween'] },
    { front: 'Read this letter', frontArabic: 'بٌ', back: 'bun', category: 'example', tags: ['nuraniyyah', 'tanween'] },
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
// LESSON 5 — Exercises on Ḥarakāt and Tanwīn
// ─────────────────────────────────────────────────────────────────────────────

const lesson5Words = items([
  'أَبَدًا', 'أَحَدُ', 'أَخَذَ', 'أَذِنَ', 'أَمَرَ', 'أَنَا',
  'بَخِلَ', 'بَرَرَةٍ', 'جَعَلَ', 'جَمَعَ', 'حَسَدَ', 'حَشَرَ',
  'خَشِيَ', 'خَلَقَ', 'خُلِقَ', 'ذَكَرَ', 'رَفَعَ', 'رَقَبَةٍ',
  'سُرُرٌ', 'سَفَرَةٍ', 'صُحُفًا', 'وَسَطًا', 'طَبَقًا', 'طَبَقٍ',
  'طُوًى', 'عَبَسَ', 'عَدَلَ', 'عَلَقٍ', 'عَمِدَ', 'عِنَبًا',
  'غَبَرَةٌ', 'فَعَلَ', 'قَتَرَةٌ', 'قُتِلَ', 'قَدَرَ', 'قُرِئَ',
]);
const lesson5More = items([
  'قَسَمُ', 'كَبَدٍ', 'كُتُبٌ', 'كَسَبَ', 'كَفَرَ', 'كُفُوًا',
  'لُبَدًا', 'لُمَزَةٍ', 'لَهَبٍ', 'مَسَدٍ', 'نَخِرَةً', 'وَجَدَ',
  'وَسَقَ', 'وَقَبَ', 'وَلَدَ', 'وَهَبَ', 'هُمَزَةٍ', 'هُدًى',
]);

const lesson5: LessonDef = {
  slug: 'nuraniyyah-lesson-5',
  title: 'Lesson 5: Exercises — تَدْرِيبَاتٌ',
  description: 'Put the letters, ḥarakāt and tanwīn together by reading real Arabic words, one letter at a time.',
  html: `
<h2>Exercises — ${ar('تَدْرِيبَاتٌ')}</h2>
<p>Now you can read words! Take each word <strong>from right to left</strong>, say each letter with its ḥarakah, and then join the sounds together. Check yourself with the pronunciation underneath.</p>
${tipBox('Remember', '<p><strong>Ḥarakāt are short sounds, and tanwīn is adding a noon to the ḥarakāt.</strong></p>')}
${arabicGrid(lesson5Words, { min: 130, size: '2.5rem' })}

<h3>More practice</h3>
${arabicGrid(lesson5More, { min: 130, size: '2.5rem' })}
${warnBox(
  'Reading on and stopping',
  `<p>The pronunciations here show each word <strong>as written, when you keep reading</strong>. When you <em>stop</em> on a word, you drop the final vowel or tanwīn, and a final ${ar('ة')} is read as <em>h</em> — for example ${ar('رَقَبَةٌ')} is read <em>raqabah</em> when you stop.</p>`,
)}
`.trim(),
  terms: [{ arabic: 'تَدْرِيبَات', transliteration: 'tadrībāt', translation: 'exercises' }],
  cards: [
    ...[lesson5Words[0], lesson5Words[6], lesson5Words[13], lesson5Words[21], lesson5Words[28], lesson5Words[33]].map((w) => ({
      front: 'Read this word',
      frontArabic: w.ar,
      back: w.tr,
      category: 'example' as const,
      tags: ['nuraniyyah', 'exercises'],
    })),
  ],
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
// LESSON 6 — Madd Letters
// ─────────────────────────────────────────────────────────────────────────────

const madd1Letters = ['ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض'];
// Alif carrying hamzah is written آ / إِي / أُو when stretched
const madd1Cards = [{ ar: 'آ إِي أُو', tr: 'ā · ī · ū' }, ...vowelGrid(madd1Letters, [F + 'ا', K + 'ي', D + 'و'])];
const lesson6: LessonDef = {
  slug: 'nuraniyyah-lesson-6',
  title: 'Lesson 6: Madd Letters — حُرُوفُ الْمَدِّ',
  description: 'Learn the three letters of stretching and the natural madd, which is held for two ḥarakāt.',
  html: `
<h2>Madd Letters — ${ar('حُرُوفُ الْمَدِّ')}</h2>
<p><strong>Madd</strong> (${ar('مَدّ')}) means <strong>stretching</strong>. There are three madd letters, and each one needs the right ḥarakah before it:</p>
${table(
  ['Madd letter', 'Needs before it', 'Read as', 'Example'],
  [
    [`Alif ${ar('ا', '2rem')}`, 'a fatḥah', 'ā', `${ar('بَا', '2rem')} <em>bā</em>`],
    [`Yāʾ ${ar('ي', '2rem')}`, 'a kasrah', 'ī', `${ar('بِي', '2rem')} <em>bī</em>`],
    [`Wāw ${ar('و', '2rem')}`, 'a ḍammah', 'ū', `${ar('بُو', '2rem')} <em>bū</em>`],
  ],
)}
${exampleBox(
  `Natural madd — ${ar('الْمَدُّ الطَّبِيعِيُّ')}`,
  `<p><strong>Whenever a fatḥah is followed by an alif, a ḍammah by a wāw, and a kasrah by a yāʾ, then one ḥarakah is stretched to two ḥarakāt.</strong></p>
<p>A ḥarakah is one beat — about the time it takes to open or close a finger. The natural madd is held for <strong>two beats</strong>.</p>`,
)}
${arabicGrid(items(['قَالَ', 'يَقُولُ', 'قِيلَ']), { min: 150, size: '2.75rem' })}

<h3>Read each letter with its madd</h3>
<p>Each card shows <strong>fatḥah + alif · kasrah + yāʾ · ḍammah + wāw</strong>. Hold each long sound for two beats.</p>
${arabicGrid(madd1Cards, { min: 210, size: '2.25rem' })}
${tipBox('Counting the beat', '<p>Tap your finger once for each beat: <em>ba</em> (1) — <em>bā</em> (1 … 2). Do not rush it and do not drag it out past two!</p>')}
`.trim(),
  terms: [
    { arabic: 'مَدّ', transliteration: 'madd', translation: 'stretching a sound' },
    { arabic: 'حُرُوفُ الْمَدّ', transliteration: 'ḥurūf al-madd', translation: 'the letters of stretching: alif, wāw and yāʾ' },
    { arabic: 'الْمَدُّ الطَّبِيعِيّ', transliteration: 'al-madd aṭ-ṭabīʿī', translation: 'the natural madd — held for two ḥarakāt' },
  ],
  cards: [
    { front: 'How long is the natural madd held?', back: 'Two ḥarakāt (two beats).', category: 'rule', tags: ['nuraniyyah', 'madd'] },
    { front: 'Which three letters are the madd letters?', back: 'Alif after a fatḥah, wāw after a ḍammah, yāʾ after a kasrah.', backArabic: 'ا و ي', category: 'rule', tags: ['nuraniyyah', 'madd'] },
    { front: 'Read this madd', frontArabic: 'بَا', back: 'bā', category: 'example', tags: ['nuraniyyah', 'madd'] },
    { front: 'Read this madd', frontArabic: 'بِي', back: 'bī', category: 'example', tags: ['nuraniyyah', 'madd'] },
    { front: 'Read this madd', frontArabic: 'بُو', back: 'bū', category: 'example', tags: ['nuraniyyah', 'madd'] },
    { front: 'Read this word', frontArabic: 'قَالَ', back: 'qāla', category: 'example', tags: ['nuraniyyah', 'madd'] },
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
      questionText: 'How is يَقُولُ read?',
      options: ['yaqulu', 'yaqūlu', 'yaqālu', 'yaqīlu'],
      correctAnswer: 'yaqūlu',
      explanation: 'The ḍammah on the qāf is followed by a wāw, so it is stretched: yaqūlu.',
      difficulty: 'MEDIUM',
    },
  ],
};

export const LESSONS_PART_1: LessonDef[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6];
