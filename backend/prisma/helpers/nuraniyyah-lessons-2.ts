import { LETTERS, transliterate } from './nuraniyyah-arabic';
import {
  DAMMA as D,
  FATHA as F,
  KASRA as K,
  SHADDA,
  SUKUN as S,
  LessonDef,
  ar,
  arabicGrid,
  arabicLine,
  exampleBox,
  formGrid,
  item,
  items,
  table,
  tipBox,
  warnBox,
} from './nuraniyyah-html';

const wordCard = (w: { ar: string; tr: string }, tag: string) => ({
  front: 'Read this word',
  frontArabic: w.ar,
  back: w.tr,
  category: 'example' as const,
  tags: ['nuraniyyah', tag],
});

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 7 — Madd letters continued
// ─────────────────────────────────────────────────────────────────────────────

const madd2Letters = ['ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه'];
const lesson7Words = items(['قَالُوا', 'جَاءُوا', 'آمَنُوا', 'كَانُوا', 'يَعْلَمُونَ', 'يَقُولُونَ', 'عِبَادِي', 'ذَٰلِكَ']);

const lesson7: LessonDef = {
  slug: 'nuraniyyah-lesson-7',
  title: 'Lesson 7: Stretch (Madd) Letters Continued — الْمَدُّ',
  description: 'Keep practising the madd letters, including the wāw-alif ending that appears in many Qur\'ānic verbs.',
  html: `
<h2>Stretch (Madd) Letters Continued — ${ar('حُرُوفُ الْمَدِّ')}</h2>
<p>Remember the three madd letters: ${ar('ـَا')} alif after fatḥah, ${ar('ـُو')} wāw after ḍammah, and ${ar('ـِي')} yāʾ after kasrah. Each is held for <strong>two ḥarakāt</strong>.</p>
${exampleBox(
  'The silent alif',
  `<p>At the end of many verbs, a wāw of madd is followed by an alif that is <strong>not pronounced</strong>: ${ar('بُوا', '2rem')} is read <em>bū</em>, not <em>bū-ā</em>. Just stretch the wāw for two beats and stop.</p>`,
)}

<h3>Read each letter with its madd</h3>
<p>Each card shows <strong>fatḥah + alif · ḍammah + wāw + alif · kasrah + yāʾ</strong>, read from right to left.</p>
${arabicGrid(formGrid(madd2Letters, (l) => [l + F + 'ا', l + D + 'وا', l + K + 'ي']), { min: 210, size: '2.25rem' })}

<h3>Madd in words</h3>
${arabicGrid(lesson7Words, { min: 150, size: '2.5rem' })}
${tipBox('Practise', '<p>Read each word aloud and tap two beats on every stretched sound. The pronunciation guide shows each stretch with a line above the vowel (ā, ī, ū).</p>')}
`.trim(),
  terms: [{ arabic: 'وَاو الْجَمَاعَة', transliteration: 'wāw al-jamāʿah', translation: 'the wāw that ends many plural verbs, followed by a silent alif' }],
  cards: [
    { front: 'Is the alif after the wāw in ـُوا pronounced?', back: 'No — it is silent. Stretch the wāw for two beats: bū.', category: 'rule', tags: ['nuraniyyah', 'madd'] },
    { front: 'Read this', frontArabic: 'بُوا', back: 'bū', category: 'example', tags: ['nuraniyyah', 'madd'] },
    wordCard(lesson7Words[0], 'madd'),
    wordCard(lesson7Words[2], 'madd'),
    wordCard(lesson7Words[4], 'madd'),
    wordCard(lesson7Words[6], 'madd'),
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word قَالُوا read?',
      options: ['qālū', 'qālu', 'qālūā', 'qalū'],
      correctAnswer: 'qālū',
      explanation: 'The wāw after the ḍammah is stretched two beats and the final alif is silent: qālū.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'The alif at the end of ـُوا (wāw + alif) is pronounced as a separate long "ā".',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'That alif is silent. Only the wāw is stretched.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is طِي read?',
      options: ['ṭi', 'ṭī', 'ṭay', 'ṭu'],
      correctAnswer: 'ṭī',
      explanation: 'Kasrah + yāʾ is a madd, so it is stretched for two beats: ṭī.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 8 — Līn and extra Madd
// ─────────────────────────────────────────────────────────────────────────────

const leenLetters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه'];

const lesson8Words = items([
  'آمَنَ', 'آوَى', 'آنِيَةٍ', 'إِيلَافِ', 'أَيْنَ', 'بِهِ',
  'جَاءَ', 'جُوعٍ', 'خَوْفٍ', 'خَيْرٌ', 'دَاوُودَ', 'ذَٰلِكَ',
  'شَاءَ', 'مَلِكٍ', 'شَيْءٍ', 'طَغَى', 'طَغَوْا', 'طَيْرًا',
  'عَادٍ', 'عَلَى', 'عَيْنٌ', 'فِيهِ', 'قَالَ', 'قَوْلٌ',
  'كَانَ', 'كَيْفَ', 'كَيْدًا', 'لَوْحٍ', 'لَيْسَ', 'مَالًا',
  'نَارًا', 'مَاءٍ', 'وَيْلٌ', 'يَوْمٍ', 'يَرَهُ', 'حَاسِدٍ',
  'حَافِظٍ', 'دَافِقٍ', 'شَاهِدٍ', 'عَابِدٌ',
]);
const lesson8More = items([
  'نَاصِرٍ', 'غَاسِقٍ', 'وَالِدٍ', 'أَعُوذُ', 'أَكِيدُ', 'رَحِيقٌ',
  'عَظِيمٌ', 'كَرِيمٌ', 'شَهِيدٌ', 'مَجِيدٌ', 'نَعِيمٌ', 'يَتِيمًا',
  'يَسِيرًا', 'رُوَيْدًا', 'قُرَيْشٍ', 'مُحِيطٌ', 'وُجُوهٌ', 'أَلِيمٌ',
  'بَصِيرًا', 'خَبِيرًا', 'قُعُودٌ', 'أَثِيمٌ', 'مَهْدًا', 'نَبَاتًا',
  'وِفَاقًا', 'ثُبُورًا', 'رَسُولٌ', 'شُهُودٌ', 'عِيشَةٍ', 'وَعَمِلُوا',
  'مَوْضُوعَةٌ',
]);

const lesson8: LessonDef = {
  slug: 'nuraniyyah-lesson-8',
  title: 'Lesson 8: Līn and Extra Madd — اللِّينُ',
  description: 'Learn the soft līn letters, the longer madd of four ḥarakāt, and read a long set of words that use them.',
  html: `
<h2>Līn — ${ar('اللِّينُ')}</h2>
<p>When a <strong>wāw (و)</strong> or a <strong>yāʾ (ي)</strong> carries a <strong>sukūn</strong> and comes after a <strong>fatḥah</strong>, it is called a <strong>līn letter</strong> (${ar('حُرُوفُ اللِّينِ')}) — the "soft" letters. They give the sounds <em>aw</em> and <em>ay</em>, and they are <strong>weaker than the madd letters</strong>.</p>
${table(
  ['Līn letter', 'Written', 'Read as'],
  [
    [`Wāw ${ar('و')}`, ar('بَوْ', '2rem'), '<em>baw</em>'],
    [`Yāʾ ${ar('ي')}`, ar('بَيْ', '2rem'), '<em>bay</em>'],
  ],
)}
${exampleBox('Remember', '<p><strong>Madd is stretched to two ḥarakāt, and līn is the weaker form of madd.</strong> When you stop on a word that ends with a līn letter (such as ' + ar('قُرَيْشٍ') + ' → ' + ar('قُرَيْشْ') + '), the līn sound may be held for about two beats.</p>')}

<h3>Read each letter with līn</h3>
<p>Each card shows <strong>wāw līn · yāʾ līn</strong>, read from right to left.</p>
${arabicGrid(formGrid(leenLetters, (l) => [l + F + 'و' + S, l + F + 'ي' + S]), { min: 150, size: '2.25rem' })}

<h2>Extra Madd — ${ar('الْمَدُّ الْمُتَّصِلُ وَالْمُنْفَصِلُ')}</h2>
${warnBox(
  'Four ḥarakāt',
  '<p><strong>Whenever a hamzah (ء) comes after the letters of madd (ا ، و ، ي), they are stretched to FOUR ḥarakāt.</strong></p>',
)}
${table(
  ['Type', 'When it happens', 'Examples'],
  [
    [
      `Madd Muttaṣil<br>${ar('الْمَدُّ الْمُتَّصِلُ')}`,
      'The madd letter and the hamzah are <strong>in one word</strong>',
      `${ar('جَاءَ', '1.8rem')} <em>jāʾa</em><br>${ar('سُوءٍ', '1.8rem')} <em>sūʾin</em><br>${ar('مَاءٍ', '1.8rem')} <em>māʾin</em>`,
    ],
    [
      `Madd Munfaṣil<br>${ar('الْمَدُّ الْمُنْفَصِلُ')}`,
      'The madd letter is at the end of one word and the hamzah <strong>starts the next word</strong>',
      `${ar('بِمَا أُنْزِلَ', '1.8rem')} <em>${transliterate('بِمَا أُنْزِلَ')}</em><br>${ar('فِي أَنْفُسِكُمْ', '1.8rem')} <em>${transliterate('فِي أَنْفُسِكُمْ')}</em>`,
    ],
  ],
)}

<h2>Exercises — ${ar('تَدْرِيبَاتٌ')}</h2>
<p>Read these words using everything you have learned: ḥarakāt, tanwīn, madd, līn and the longer madd before hamzah.</p>
${arabicGrid(lesson8Words, { min: 140, size: '2.5rem' })}
<h3>More practice</h3>
${arabicGrid(lesson8More, { min: 140, size: '2.5rem' })}
`.trim(),
  terms: [
    { arabic: 'اللِّين', transliteration: 'al-līn', translation: 'softness — the soft letters wāw and yāʾ with sukūn after a fatḥah' },
    { arabic: 'الْمَدُّ الْمُتَّصِل', transliteration: 'al-madd al-muttaṣil', translation: 'connected madd — madd and hamzah in the same word (four ḥarakāt)' },
    { arabic: 'الْمَدُّ الْمُنْفَصِل', transliteration: 'al-madd al-munfaṣil', translation: 'separated madd — madd at the end of one word and hamzah at the start of the next (four ḥarakāt)' },
  ],
  cards: [
    { front: 'What are the līn letters?', back: 'Wāw or yāʾ with a sukūn after a fatḥah: aw and ay.', backArabic: 'بَوْ بَيْ', category: 'rule', tags: ['nuraniyyah', 'leen'] },
    { front: 'How many ḥarakāt is a madd stretched when a hamzah follows it?', back: 'Four ḥarakāt.', category: 'rule', tags: ['nuraniyyah', 'madd'] },
    { front: 'What is madd muttaṣil?', back: 'Madd and hamzah in the same word, e.g. jāʾa.', backArabic: 'جَاءَ', category: 'definition', tags: ['nuraniyyah', 'madd'] },
    { front: 'What is madd munfaṣil?', back: 'Madd at the end of one word and hamzah at the start of the next, e.g. bimā ʾunzila.', backArabic: 'بِمَا أُنْزِلَ', category: 'definition', tags: ['nuraniyyah', 'madd'] },
    { front: 'Read this', frontArabic: 'بَيْ', back: 'bay', category: 'example', tags: ['nuraniyyah', 'leen'] },
    wordCard(lesson8Words[4], 'leen'),
    wordCard(lesson8Words[25], 'leen'),
    wordCard(lesson8Words[6], 'madd'),
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many ḥarakāt is a madd stretched when a hamzah comes after it?',
      options: ['Two', 'Three', 'Four', 'Six'],
      correctAnswer: 'Four',
      explanation: 'A madd followed by a hamzah (madd muttaṣil or munfaṣil) is stretched four ḥarakāt.',
      difficulty: 'MEDIUM',
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
      type: 'MULTIPLE_CHOICE',
      questionText: 'In جَاءَ, the madd and the hamzah are in the same word. Which madd is this?',
      options: ['Madd muttaṣil', 'Madd munfaṣil', 'Natural madd', 'Madd lāzim'],
      correctAnswer: 'Madd muttaṣil',
      explanation: 'When the madd letter and hamzah are in one word, it is madd muttaṣil.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'Līn is a weaker form of madd.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Līn letters are softer than the madd letters.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word كَيْفَ read?',
      options: ['kayfa', 'kīfa', 'kayfā', 'kifa'],
      correctAnswer: 'kayfa',
      explanation: 'Yāʾ with sukūn after a fatḥah is līn: kay-fa.',
      difficulty: 'MEDIUM',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 9 — Sukūn and Qalqalah
// ─────────────────────────────────────────────────────────────────────────────

const sukunLetters = ['ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه'];
const qalqalahWords = items(['قَدْ', 'يَقْطَعُونَ', 'يَجْعَلُونَ', 'يَدْخُلُونَ', 'أَبْرَارٌ', 'فَلَقْ', 'أَحَدْ']);

const lesson9: LessonDef = {
  slug: 'nuraniyyah-lesson-9',
  title: 'Lesson 9: Sukūn and Qalqalah — السُّكُونُ',
  description: 'Learn the sukūn (resting sound) and the five bouncing letters of qalqalah.',
  html: `
<h2>Resting Sound — ${ar('السُّكُونُ ( ْـ )')}</h2>
<p>A <strong>ḥarakah</strong> means to <em>move</em> the sound in the direction of a fatḥah, kasrah or ḍammah. When the ḥarakah is taken away, it is replaced by a <strong>sukūn</strong> (${ar('ـْ', '1.6rem')}), which is a <strong>resting sound</strong>: the letter is pronounced <em>without any vowel</em>, and flows straight into the next letter.</p>
${exampleBox('Compare', `<p>${ar('بَ', '2rem')} <em>ba</em> (with a vowel) &nbsp;→&nbsp; ${ar('أَبْ', '2rem')} <em>ab</em> (the bāʾ rests, so it is just "b").</p>`)}

<h3>Read every letter with sukūn</h3>
<p>Each card shows the letter resting after <strong>fatḥah · kasrah · ḍammah</strong>, read from right to left.</p>
${arabicGrid(formGrid(sukunLetters, (l) => ['أَ' + l + S, 'إِ' + l + S, 'أُ' + l + S]), { min: 210, size: '2.25rem' })}

<h2>Bouncing Letters — ${ar('حُرُوفُ الْقَلْقَلَةِ')}</h2>
<p>If one of these <strong>five letters</strong> comes with a sukūn, it produces a <strong>bouncing sound</strong> — a small echo, as if you lightly bounce the sound off the place it comes from. This is called <strong>qalqalah</strong>.</p>
${arabicLine('قُطْبُ جَدٍّ', transliterate('قُطْبُ جَدٍّ'))}
${arabicGrid(['ق', 'ط', 'ب', 'ج', 'د'].map((c) => item(c, LETTERS.find((l) => l.ch === c)!.name)), { min: 90, size: '2.75rem' })}
<h3>Qalqalah in words</h3>
${arabicGrid(qalqalahWords, { min: 150, size: '2.5rem' })}
${tipBox('Careful!', '<p>The bounce is <strong>light</strong> — do not add a vowel. Say <em>qad</em>, not <em>qada</em>. The last two examples show the bounce when you stop at the end of a word.</p>')}
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
    wordCard(qalqalahWords[0], 'qalqalah'),
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
// LESSON 10 — Exercises on Sukūn and Hamzat al-Waṣl
// ─────────────────────────────────────────────────────────────────────────────

const lesson10Words = items([
  'أَنْتَ', 'إِهْدِ', 'بَعْدُ', 'بَطْشَ', 'سَعْيَ', 'كُنْتُ',
  'لَسْتَ', 'أَمْرٍ', 'بَرْدًا', 'جَمْعًا', 'حَبْلٌ', 'خُسْرٍ',
  'خَلْقًا', 'سَبْحًا', 'سَبْقًا', 'شَأْنٌ', 'صُبْحًا', 'ضَبْحًا',
  'عَبْدًا', 'عَدْنٍ', 'عَشْرٍ', 'عَصْفٍ', 'غَرْقًا', 'غَلْبًا',
  'فَصْلٌ', 'قَدْحًا', 'قَضْبًا', 'كَأْسًا', 'كَدْحًا', 'لَغْوًا',
  'مِسْكٌ', 'نَخْلًا', 'نَشْطًا', 'نَفْسٍ', 'نَقْعًا', 'يُسْرًا',
  'أَبْقَى', 'تَرْضَى', 'تَنْسَى', 'يَخْشَى', 'يَسْعَى', 'يَتْلُوا',
  'يَدْعُوا', 'تَجْرِي', 'يَهْدِي', 'يُغْنِي',
]);
const lesson10More = items([
  'أَخْرَجَ', 'أَرْسَلَ', 'أَغْطَشَ', 'أَفْلَحَ', 'أَكْرَمَ', 'أَلْهَمَ',
  'أَنْشَرَ', 'أَنْقَضَ', 'دَمْدَمَ', 'عَسْعَسَ', 'أَعْبُدُ', 'نَعْبُدُ',
  'يَخْرُجُ', 'يَحْسُبُ', 'يَشْرَبُ', 'يَشْهَدُ', 'تَرْهَقُ', 'تَعْرِفُ',
  'أُقْسِمُ', 'يُبْدِئُ', 'يُنْفِخُ', 'يَنْقَلِبُ', 'يُوَسْوِسُ', 'حُشِرَتْ',
  'سُطِحَتْ', 'كُشِطَتْ', 'نُشِرَتْ', 'نُصِبَتْ', 'فَرَغْتَ', 'تَأْتُونَ',
  'رُفِعْنَا', 'وَضَعْنَا', 'نُطْفَةٍ', 'عِبْرَةٍ', 'زَجْرَةٍ', 'تَذْكِرَةٍ',
  'مُسْفِرَةٍ', 'مَسْغَبَةٍ',
]);

const waslMiddle = [item('وَٱنْحَرْ', 'wanḥar'), item('فَٱرْغَبْ', 'farghab'), item('فَٱنصَبْ', 'fanṣab')];
const waslLam = [item('ٱلْحَمْدُ', 'alḥamdu'), item('ٱلْقَدْرِ', 'alqadri'), item('ٱلْفَجْرِ', 'alfajri')];
const waslDamma = [item('ٱنْظُرْ', 'unẓur'), item('ٱدْعُ', 'udʿu'), item('ٱقْتُلُوا', 'uqtulū')];
const waslKasra = [item('ٱهْدِنَا', 'ihdinā'), item('ٱقْرَأْ', 'iqraʾ'), item('ٱصْبِرْ', 'iṣbir')];

const lesson10: LessonDef = {
  slug: 'nuraniyyah-lesson-10',
  title: 'Lesson 10: Exercises — Sukūn and Hamzat al-Waṣl — هَمْزَةُ الْوَصْلِ',
  description: 'Read words full of sukūn, then learn when the hamzat al-waṣl is dropped and which vowel it takes.',
  html: `
<h2>Exercises — ${ar('تَدْرِيبَاتٌ')}</h2>
<p>Read each word, keeping the sukūn at rest. Qalqalah letters (${ar('قُطْبُ جَدٍّ')}) bounce lightly.</p>
${arabicGrid(lesson10Words, { min: 130, size: '2.5rem' })}
<h3>More practice</h3>
${arabicGrid(lesson10More, { min: 140, size: '2.5rem' })}

<h2>Reading Hamzat al-Waṣl — ${ar('هَمْزَةُ الْوَصْلِ ( ٱ )')}</h2>
<p>The <strong>hamzat al-waṣl</strong> is the small alif written ${ar('ٱ')} at the beginning of some words. It is pronounced only when you <em>begin</em> with it.</p>
${table(
  ['When?', 'What to do'],
  [
    ['<strong>1. Middle</strong> — it comes in the middle of a word or phrase', '<strong>Skip it.</strong> It is not pronounced at all.'],
    ['<strong>2. Beginning</strong> — you start with it, and the next letter is <strong>lām</strong> (ال)', 'Read it with a <strong>fatḥah</strong>.'],
    ['<strong>3. Beginning</strong> — the next letter is not lām: <strong>look at the third letter</strong>', 'If the third letter has a <strong>ḍammah</strong>, the hamzat al-waṣl takes a <strong>ḍammah</strong>. In all other cases it takes a <strong>kasrah</strong>.'],
  ],
)}

<h3>1. In the middle — skipped</h3>
${arabicGrid(waslMiddle, { min: 160, size: '2.5rem' })}
<h3>2. At the beginning, before lām — fatḥah</h3>
${arabicGrid(waslLam, { min: 160, size: '2.5rem' })}
<h3>3. At the beginning, third letter has a ḍammah — ḍammah</h3>
${arabicGrid(waslDamma, { min: 160, size: '2.5rem' })}
<h3>3. At the beginning, any other case — kasrah</h3>
${arabicGrid(waslKasra, { min: 160, size: '2.5rem' })}
`.trim(),
  terms: [{ arabic: 'هَمْزَةُ الْوَصْل', transliteration: 'hamzat al-waṣl', translation: 'the connecting hamzah — pronounced only when you begin with it' }],
  cards: [
    { front: 'What do you do with the hamzat al-waṣl in the middle of a phrase?', back: 'Skip it — it is not pronounced.', category: 'rule', tags: ['nuraniyyah', 'hamzat-al-wasl'] },
    { front: 'Which vowel does the hamzat al-waṣl take before "ال"?', back: 'Fatḥah — e.g. alḥamdu.', backArabic: 'ٱلْحَمْدُ', category: 'rule', tags: ['nuraniyyah', 'hamzat-al-wasl'] },
    { front: 'When does the hamzat al-waṣl take a ḍammah?', back: 'When you begin with it and the third letter has a ḍammah — e.g. unẓur.', backArabic: 'ٱنْظُرْ', category: 'rule', tags: ['nuraniyyah', 'hamzat-al-wasl'] },
    { front: 'Which vowel does the hamzat al-waṣl take in all other cases?', back: 'Kasrah — e.g. ihdinā.', backArabic: 'ٱهْدِنَا', category: 'rule', tags: ['nuraniyyah', 'hamzat-al-wasl'] },
    wordCard(lesson10Words[0], 'exercises'),
    wordCard(lesson10Words[8], 'exercises'),
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'What do you do with the hamzat al-waṣl when it comes in the middle of a phrase?',
      options: ['Skip it', 'Read it with fatḥah', 'Read it with kasrah', 'Stretch it'],
      correctAnswer: 'Skip it',
      explanation: 'The hamzat al-waṣl is only pronounced when you begin with it. In the middle you skip it.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How do you begin reading ٱلْحَمْدُ?',
      options: ['alḥamdu', 'ilḥamdu', 'ulḥamdu', 'ḥamdu'],
      correctAnswer: 'alḥamdu',
      explanation: 'Before lām (ال), the hamzat al-waṣl takes a fatḥah.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How do you begin reading ٱنْظُرْ (the third letter has a ḍammah)?',
      options: ['anẓur', 'inẓur', 'unẓur', 'nẓur'],
      correctAnswer: 'unẓur',
      explanation: 'The third letter (ظُ) has a ḍammah, so the hamzat al-waṣl takes a ḍammah.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How do you begin reading ٱهْدِنَا?',
      options: ['ahdinā', 'ihdinā', 'uhdinā', 'hdinā'],
      correctAnswer: 'ihdinā',
      explanation: 'The third letter (دِ) has a kasrah, so the hamzat al-waṣl takes a kasrah.',
      difficulty: 'MEDIUM',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 11 — Shaddah
// ─────────────────────────────────────────────────────────────────────────────

const shaddahLetters = ['ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'ه'];
const lesson11Words = [
  ...items(['رَبِّ', 'حَقٌّ', 'مَدَّ', 'كَذَّبَ', 'عَلَّمَ', 'قَدَّمَ', 'صَدَّقَ', 'رَبَّنَا', 'حَجٌّ', 'جَدٌّ']),
  item('ٱللَّهُ', 'allāhu'),
];

const lesson11: LessonDef = {
  slug: 'nuraniyyah-lesson-11',
  title: 'Lesson 11: Shaddah — الشَّدَّةُ',
  description: 'Learn the shaddah — the doubled letter — and read it with every vowel.',
  html: `
<h2>Emphasis — ${ar('الشَّدَّةُ ( ـّ )')}</h2>
<p>The <strong>shaddah</strong> (${ar('ـّ', '1.6rem')}) means a letter is <strong>doubled</strong>. When you combine a <strong>sākin letter</strong> (a letter at rest) with a <strong>vowelled letter</strong> of the same kind, it adds <strong>emphasis and pressure</strong> to the letter. It is written once with the shaddah on top.</p>
${exampleBox(
  'How to read a shaddah',
  `<p>${ar('أَبَّ', '2rem')} is really <em>ab</em> + <em>ba</em>: the first bāʾ rests (<em>ab</em>) and the second carries the vowel (<em>ba</em>). Press the sound on the letter, then release: <strong><em>ab-ba</em></strong>.</p>`,
)}

<h3>Read every letter with shaddah</h3>
<p>Each card shows the shaddah with <strong>fatḥah · kasrah · ḍammah</strong>, read from right to left. (Nūn and mīm are practised in the next lesson.)</p>
${arabicGrid(formGrid(shaddahLetters, (l) => ['أَ' + l + SHADDA + F, 'أَ' + l + SHADDA + K, 'أَ' + l + SHADDA + D]), { min: 230, size: '2.25rem' })}

<h3>Shaddah in words</h3>
${arabicGrid(lesson11Words, { min: 140, size: '2.5rem' })}
`.trim(),
  terms: [{ arabic: 'شَدَّة', transliteration: 'shaddah', translation: 'a mark showing that a letter is doubled and pronounced with emphasis' }],
  cards: [
    { front: 'What does a shaddah show?', back: 'That a letter is doubled — the first rests and the second carries the vowel.', backArabic: 'شَدَّة', category: 'definition', tags: ['nuraniyyah', 'shaddah'] },
    { front: 'Read this', frontArabic: 'أَبَّ', back: 'abba', category: 'example', tags: ['nuraniyyah', 'shaddah'] },
    { front: 'Read this', frontArabic: 'أَتِّ', back: 'atti', category: 'example', tags: ['nuraniyyah', 'shaddah'] },
    wordCard(lesson11Words[0], 'shaddah'),
    wordCard(lesson11Words[4], 'shaddah'),
    wordCard(lesson11Words[10], 'shaddah'),
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'What does the shaddah show?',
      options: ['The letter is silent', 'The letter is doubled', 'The vowel is long', 'The letter bounces'],
      correctAnswer: 'The letter is doubled',
      explanation: 'A shaddah means the letter is doubled — one resting letter and one vowelled letter.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is أَبَّ read?',
      options: ['aba', 'abba', 'ab', 'aaba'],
      correctAnswer: 'abba',
      explanation: 'The bāʾ is doubled: ab + ba.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word رَبِّ read?',
      options: ['rabi', 'rabbi', 'rabbu', 'rab'],
      correctAnswer: 'rabbi',
      explanation: 'Rāʾ with fatḥah, then a doubled bāʾ with kasrah: rab-bi.',
      difficulty: 'MEDIUM',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 12 — Ghunnah (Nūn and Mīm with Shaddah)
// ─────────────────────────────────────────────────────────────────────────────

const ghunnahCards = formGrid(['ن', 'م'], (l) => ['أَ' + l + SHADDA + F, 'إِ' + l + SHADDA + K, 'أُ' + l + SHADDA + D]);
const lesson12Words = items(['إِنَّ', 'أَنَّ', 'ثُمَّ', 'جَنَّةٌ', 'عَمَّ', 'لَمَّا', 'يَظُنُّ', 'هَمَّ']);
const lesson12Exercises = items([
  'بُرِّزَ', 'حُصِّلَ', 'صَدَّقَ', 'عَدَّدَ', 'قَدَّرَ', 'كَذَّبَ',
  'نَعَّمَ', 'يَظُنُّ', 'يَحُضُّ', 'جَنَّةٍ', 'ذَرَّةٍ',
]);
const lesson12More = items([
  'قُوَّةٍ', 'كَرَّةٍ', 'سُعِّرَتْ', 'قُدِّمَتْ', 'كُذِّبَتْ', 'زُوِّجَتْ',
  'سُجِّرَتْ', 'فُجِّرَتْ', 'سُيِّرَتْ', 'عُطِّلَتْ', 'كُوِّرَتْ', 'قَيِّمَةٌ',
  'عَشِيَّةً', 'مُذَكِّرٌ', 'أَيَّانَ', 'إِيَّاكَ', 'تَجَلَّى', 'تَصَدَّى',
  'تَزَكَّى', 'تَوَلَّى',
]);

const lesson12: LessonDef = {
  slug: 'nuraniyyah-lesson-12',
  title: 'Lesson 12: Ghunnah — Nūn and Mīm with Shaddah — الْغُنَّةُ',
  description: 'Learn to hold the nasal ghunnah on a nūn or mīm with shaddah, and practise shaddah in many words.',
  html: `
<h2>Ghunnah — ${ar('حَرْفُ غُنَّةٍ مُشَدَّدٌ: نّ ـ مّ')}</h2>
<p><strong>Whenever the letters Nūn (${ar('ن')}) and Mīm (${ar('م')}) come with a shaddah, make ghunnah.</strong> Ghunnah is a <strong>nasal sound</strong> — it comes from the nose — and it is <strong>held for two ḥarakāt</strong>.</p>
${exampleBox(
  'How to feel ghunnah',
  `<p>Hum the sound "mmm" and notice the air passing through your nose. Now say ${ar('إِنَّ', '2rem')} <em>inna</em> and let the doubled nūn hum for two beats before the vowel.</p>`,
)}

<h3>Nūn and mīm with shaddah</h3>
<p>Each card shows <strong>fatḥah · kasrah · ḍammah</strong>, read from right to left.</p>
${arabicGrid(ghunnahCards, { min: 230, size: '2.25rem' })}

<h3>Words with ghunnah</h3>
${arabicGrid(lesson12Words, { min: 140, size: '2.5rem' })}

<h2>Exercises — ${ar('تَدْرِيبَاتٌ')}</h2>
<p>Read these words with shaddah. Remember the ghunnah on every nūn and mīm with shaddah.</p>
${arabicGrid(lesson12Exercises, { min: 140, size: '2.5rem' })}
<h3>More practice</h3>
${arabicGrid(lesson12More, { min: 140, size: '2.5rem' })}
`.trim(),
  terms: [
    { arabic: 'غُنَّة', transliteration: 'ghunnah', translation: 'a nasal sound held for two ḥarakāt' },
    { arabic: 'حَرْفُ غُنَّةٍ مُشَدَّد', transliteration: 'ḥarf ghunnah mushaddad', translation: 'a nūn or mīm with shaddah, which requires ghunnah' },
  ],
  cards: [
    { front: 'Which two letters need ghunnah when they have a shaddah?', back: 'Nūn and mīm.', backArabic: 'نّ  مّ', category: 'rule', tags: ['nuraniyyah', 'ghunnah'] },
    { front: 'What is ghunnah?', back: 'A nasal sound, from the nose, held for two ḥarakāt.', backArabic: 'غُنَّة', category: 'definition', tags: ['nuraniyyah', 'ghunnah'] },
    { front: 'Read this', frontArabic: 'أَنَّ', back: 'anna — hold the nūn for two beats', category: 'example', tags: ['nuraniyyah', 'ghunnah'] },
    wordCard(lesson12Words[0], 'ghunnah'),
    wordCard(lesson12Words[3], 'ghunnah'),
    wordCard(lesson12Words[2], 'ghunnah'),
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which letters require ghunnah when they carry a shaddah?',
      options: ['Nūn and mīm', 'Lām and rāʾ', 'Bāʾ and tāʾ', 'Qāf and kāf'],
      correctAnswer: 'Nūn and mīm',
      explanation: 'A nūn or mīm with shaddah (ḥarf ghunnah mushaddad) must be pronounced with ghunnah.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'For how many ḥarakāt is ghunnah held?',
      options: ['One', 'Two', 'Four', 'Six'],
      correctAnswer: 'Two',
      explanation: 'Ghunnah is a nasal sound held for two ḥarakāt.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word جَنَّةٌ read?',
      options: ['janatun', 'jannatun', 'janna', 'jannatan'],
      correctAnswer: 'jannatun',
      explanation: 'Doubled nūn with ghunnah, then tāʾ marbūṭah with ḍammatayn: jan-na-tun.',
      difficulty: 'MEDIUM',
    },
  ],
};

export const LESSONS_PART_2: LessonDef[] = [lesson7, lesson8, lesson9, lesson10, lesson11, lesson12];
