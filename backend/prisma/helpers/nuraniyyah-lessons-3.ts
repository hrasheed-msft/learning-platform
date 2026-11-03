import { transliterate } from './nuraniyyah-arabic';
import {
  LessonDef,
  ar,
  arabicGrid,
  exampleBox,
  item,
  items,
  quranVerse,
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
// LESSON 13 — Exercises on Shaddah
// ─────────────────────────────────────────────────────────────────────────────

const lesson13Words = [
  ...items(['مَرُّوا', 'رَبِّي', 'مُدَّتْ', 'حُقَّتْ', 'خَفَّتْ', 'تَبَّتْ', 'تَخَلَّتْ', 'قَدَّمَتْ', 'سِجِّيلٍ', 'سِجِّينٍ', 'مُنْفَكِّينَ', 'يَزَّكَّى', 'يَذَّكَّرُ']),
  item('وَٱلصُّبْحِ', 'waṣ-ṣubḥi'),
  item('وَٱلشَّمْسِ', 'wash-shamsi'),
  item('وَٱلشَّفْعِ', 'wash-shafʿi'),
  item('بِٱلصَّبْرِ', 'biṣ-ṣabri'),
  item('وَٱلصَّيْفِ', 'waṣ-ṣayfi'),
  item('وَٱللَّيْلِ', 'wal-layli'),
  item('وَٱلتِّينِ', 'wat-tīni'),
  item('وَٱلزَّيْتُونِ', 'waz-zaytūni'),
  item('لِحُبِّ ٱلْخَيْرِ', 'liḥubbil-khayri'),
  item('فَإِنَّ ٱلْجَنَّةَ', 'fa-inna l-jannata'),
];

const lesson13: LessonDef = {
  slug: 'nuraniyyah-lesson-13',
  title: 'Lesson 13: Exercises — Shaddah in Words and Verses',
  description: 'Practise shaddah in words from the Qur\'ān and recite three verses with their audio.',
  html: `
<h2>Exercises — ${ar('تَدْرِيبَاتٌ')}</h2>
<p>These words and phrases all come from the Qur'ān. Read each slowly and press on every shaddah.</p>
${arabicGrid(lesson13Words, { min: 160, size: '2.5rem' })}
${tipBox(
  'Sun letters',
  `<p>Look at ${ar('وَٱلشَّمْسِ')} → <em>wash-shamsi</em>. The lām of ${ar('ال')} is <strong>not pronounced</strong> before many letters (such as ش ص ت ز ل ن ر د ذ ث ض ط ظ س); instead the next letter is doubled with a shaddah. Follow the pronunciation guide and you will hear it.</p>`,
)}

<h3>Listen and read along</h3>
${quranVerse({ ref: '95:1', surah: 95, ayah: 1, label: 'Sūrat at-Tīn — verse 1', ar: 'وَٱلتِّينِ وَٱلزَّيْتُونِ', tr: 'wat-tīni waz-zaytūn' })}
${quranVerse({ ref: '84:1', surah: 84, ayah: 1, label: 'Sūrat al-Inshiqāq — verse 1', ar: 'إِذَا ٱلسَّمَآءُ ٱنشَقَّتْ', tr: 'idhas-samāʾu-nshaqqat' })}
${quranVerse({ ref: '86:3', surah: 86, ayah: 3, label: 'Sūrat aṭ-Ṭāriq — verse 3', ar: 'ٱلنَّجْمُ ٱلثَّاقِبُ', tr: 'an-najmuth-thāqib' })}
`.trim(),
  terms: [],
  cards: [
    wordCard(lesson13Words[0], 'shaddah'),
    wordCard(lesson13Words[8], 'shaddah'),
    wordCard(lesson13Words[10], 'shaddah'),
    wordCard(lesson13Words[14], 'shaddah'),
    wordCard(lesson13Words[19], 'shaddah'),
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word مُنْفَكِّينَ read?',
      options: ['munfakkīna', 'munfakīna', 'manfakkīna', 'munfakkina'],
      correctAnswer: 'munfakkīna',
      explanation: 'Mu-n-fa-kkī-na: the kāf has a shaddah and the yāʾ after the kasrah is stretched.',
      difficulty: 'HARD',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is وَٱلشَّمْسِ read?',
      options: ['wal-shamsi', 'wash-shamsi', 'wa-shamsi', 'wash-shimsi'],
      correctAnswer: 'wash-shamsi',
      explanation: 'The lām of ال is silent before shīn, and the shīn is doubled: wash-shamsi.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word تَبَّتْ read?',
      options: ['tabbat', 'tabat', 'tubbat', 'tabbit'],
      correctAnswer: 'tabbat',
      explanation: 'Tāʾ with fatḥah, then a doubled bāʾ with fatḥah, then tāʾ with sukūn: tab-bat.',
      difficulty: 'MEDIUM',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 14 — Exercises: shaddah and madd in longer words
// ─────────────────────────────────────────────────────────────────────────────

const lesson14Words = [
  ...items(['عِلِّيُّونَ', 'عِلِّيِّينَ']),
  item('ٱلْمُدَّثِّرُ', 'al-muddaththiru'),
  item('ٱلْمُزَّمِّلُ', 'al-muzzammilu'),
  item('إِنَّ ٱلَّذِينَ', 'inna lladhīna'),
  item('إِلَّا ٱلَّذِينَ', 'illal-ladhīna'),
  item('مِن شَرِّ ٱلنَّفَّٰثَٰتِ', 'min sharrin-naffāthāti'),
  item('فَعَّالٌ لِّمَا يُرِيدُ', 'faʿʿālun limā yurīdu'),
  item('مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ', 'min sharril-waswāsil-khannās'),
  item('ٱلثَّاقِبُ', 'ath-thāqibu'),
];

const lesson14: LessonDef = {
  slug: 'nuraniyyah-lesson-14',
  title: 'Lesson 14: Exercises — Longer Words and Phrases',
  description: 'Bring shaddah, ghunnah and madd together in longer words and recite a verse from Sūrat al-Burūj.',
  html: `
<h2>Exercises — ${ar('تَدْرِيبَاتٌ')}</h2>
<p>These longer words combine everything from the last few lessons: shaddah, ghunnah and madd. Take them slowly, syllable by syllable, and use the pronunciation guide to check yourself.</p>
${arabicGrid(lesson14Words, { min: 200, size: '2.25rem' })}
${warnBox('Watch for ghunnah', '<p>Every <strong>nūn or mīm with a shaddah</strong> (for example in ' + ar('ٱلْخَنَّاسِ') + ' and ' + ar('ٱلنَّفَّٰثَٰتِ') + ') needs a two-beat nasal ghunnah.</p>')}

<h3>Listen and read along</h3>
${quranVerse({ ref: '85:16', surah: 85, ayah: 16, label: 'Sūrat al-Burūj — verse 16', ar: 'فَعَّالٌ لِّمَا يُرِيدُ', tr: 'faʿʿālun limā yurīd' })}
`.trim(),
  terms: [],
  cards: [wordCard(lesson14Words[0], 'shaddah'), wordCard(lesson14Words[2], 'shaddah'), wordCard(lesson14Words[7], 'shaddah')],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How is the word عِلِّيُّونَ read?',
      options: ['ʿilliyyūna', 'ʿiliyūna', 'ʿalliyyūna', 'ʿilliyyuna'],
      correctAnswer: 'ʿilliyyūna',
      explanation: 'Doubled lām and doubled yāʾ, then the wāw after the ḍammah is stretched: ʿil-liy-yū-na.',
      difficulty: 'HARD',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'A nūn with a shaddah needs ghunnah.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Nūn and mīm with shaddah are always read with a two-beat nasal ghunnah.',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 15 — Madd Lāzim
// ─────────────────────────────────────────────────────────────────────────────

const lesson15Words = [
  ...items(['ضَالًّا', 'دَابَّةٍ', 'حَاجَّكَ', 'حَاجُّوكَ', 'أَتُحَاجُّونِّي', 'لَا تَحَاضُّونَ']),
  item('ٱلضَّالِّينَ', 'aḍ-ḍāllīna'),
  item('ٱلصَّاخَّةُ', 'aṣ-ṣākhkhatu'),
  item('ٱلطَّامَّةُ', 'aṭ-ṭāmmatu'),
  item('ٱلصَّافَّاتِ', 'aṣ-ṣāffāti'),
  item('ٱلْحَآقَّةُ', 'al-ḥāqqatu'),
];

const lesson15: LessonDef = {
  slug: 'nuraniyyah-lesson-15',
  title: 'Lesson 15: Madd Lāzim — الْمَدُّ اللَّازِمُ',
  description: 'Learn the longest madd — six ḥarakāt — when a madd letter is followed by a sukūn or shaddah.',
  html: `
<h2>Madd Lāzim — ${ar('الْمَدُّ اللَّازِمُ')}</h2>
${warnBox(
  'Six ḥarakāt',
  `<p><strong>Whenever the letters of madd (${ar('ا ، و ، ي')}) are followed by a sukūn (${ar('ـْ')}), they are stretched to SIX ḥarakāt.</strong></p>
<p><em>Note:</em> a shaddah (${ar('ـّ')}) is <strong>two letters</strong> — the first carries a sukūn and the second carries a ḥarakah or tanwīn. So a madd letter followed by a letter with a shaddah is also followed by a sukūn, and is stretched six beats.</p>`,
)}
${exampleBox(
  'Counting the madds',
  `<p>Read the same madd letter four ways and feel the difference in length:</p>
${table(
  ['Beats', 'Type', 'Example'],
  [
    ['1', 'Ḥarakah (short vowel)', `${ar('بَ', '1.8rem')} <em>ba</em>`],
    ['2', 'Natural madd', `${ar('بَا', '1.8rem')} <em>bā</em>`],
    ['4', 'Madd before hamzah', `${ar('جَاءَ', '1.8rem')} <em>jāʾa</em>`],
    ['6', 'Madd lāzim', `${ar('دَابَّةٍ', '1.8rem')} <em>dābbatin</em>`],
  ],
)}`,
)}

<h3>Practise madd lāzim</h3>
${arabicGrid(lesson15Words, { min: 170, size: '2.5rem' })}

<h3>Listen and read along</h3>
${quranVerse({ ref: '80:33', surah: 80, ayah: 33, label: 'Sūrat ʿAbasa — verse 33', ar: 'فَإِذَا جَآءَتِ ٱلصَّآخَّةُ', tr: 'fa-idhā jāʾatiṣ-ṣākhkhah' })}
${quranVerse({ ref: '79:34', surah: 79, ayah: 34, label: 'Sūrat an-Nāziʿāt — verse 34', ar: 'فَإِذَا جَآءَتِ ٱلطَّآمَّةُ ٱلْكُبْرَىٰ', tr: 'fa-idhā jāʾatiṭ-ṭāmmatul-kubrā' })}
${quranVerse({ ref: '1:7', surah: 1, ayah: 7, label: 'Sūrat al-Fātiḥah — verse 7', ar: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ', tr: 'ṣirāṭal-ladhīna anʿamta ʿalayhim ghayril-maghḍūbi ʿalayhim wa laḍ-ḍāllīn' })}
`.trim(),
  terms: [{ arabic: 'الْمَدُّ اللَّازِم', transliteration: 'al-madd al-lāzim', translation: 'the necessary madd — a madd letter followed by a sukūn or shaddah (six ḥarakāt)' }],
  cards: [
    { front: 'For how many ḥarakāt is madd lāzim stretched?', back: 'Six ḥarakāt.', category: 'rule', tags: ['nuraniyyah', 'madd-lazim'] },
    { front: 'When does madd lāzim occur?', back: 'When a madd letter is followed by a sukūn or a shaddah (which contains a sukūn).', category: 'rule', tags: ['nuraniyyah', 'madd-lazim'] },
    wordCard(lesson15Words[1], 'madd-lazim'),
    wordCard(lesson15Words[6], 'madd-lazim'),
    wordCard(lesson15Words[7], 'madd-lazim'),
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many ḥarakāt is a madd lāzim stretched?',
      options: ['Two', 'Four', 'Five', 'Six'],
      correctAnswer: 'Six',
      explanation: 'Madd lāzim is the longest madd: six ḥarakāt.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'When does madd lāzim happen?',
      options: [
        'A madd letter followed by a sukūn or shaddah',
        'A madd letter followed by a hamzah',
        'A madd letter alone',
        'A noon followed by a bāʾ',
      ],
      correctAnswer: 'A madd letter followed by a sukūn or shaddah',
      explanation: 'A sukūn or a shaddah (which contains a sukūn) after a madd letter makes it madd lāzim.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which word contains a madd lāzim?',
      options: ['دَابَّةٍ', 'قَالَ', 'جَاءَ', 'بَا'],
      correctAnswer: 'دَابَّةٍ',
      explanation: 'In دَابَّةٍ the alif is followed by a bāʾ with shaddah, so it is stretched six beats.',
      difficulty: 'MEDIUM',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 16 — Rules of Noon Sākinah and Mīm Sākinah
// ─────────────────────────────────────────────────────────────────────────────

const izharNoon = [
  item('مَنْ آمَنَ'), item('مِنْ هَادٍ'), item('أَنْعَمْتَ'), item('مِنْ حَيْثُ'), item('مِنْ غِلٍّ'), item('مِنْ خَيْرٍ'), item('عَلِيمٌ حَكِيمٌ'),
];
const idghamNoon = [
  item('مَنْ يَقُولُ', 'may-yaqūlu'), item('مِنْ رَبِّهِمْ', 'mir-rabbihim'), item('مِنْ مَالٍ', 'mim-mālin'),
  item('مِنْ لَدُنْهُ', 'mil-ladunhu'), item('مِنْ وَالٍ', 'miw-wālin'), item('مِنْ نِعْمَةٍ', 'minniʿmatin'),
  item('غَفُورٌ رَحِيمٌ', 'ghafūrur-raḥīmun'),
];
const iqlabNoon = [item('مِنْ بَعْدِ', 'mim baʿdi'), item('أَنْبِئْهُمْ', 'ʾambiʾhum'), item('سَمِيعٌ بَصِيرٌ', 'samīʿum baṣīrun')];
const ikhfaNoon = [
  item('مِنْ قَبْلِ'), item('أَنْتَ'), item('مَنْثُورًا'), item('أَنْجَيْنَا'), item('أَنْدَادًا'),
  item('مَنْصُورًا'), item('يَنْظُرُونَ'), item('مِنْ شَرِّ'), item('مِنْ ذَكَرٍ'), item('مِنْ فَضْلِ'),
  item('مِنْ كُلِّ'), item('جَنَّاتٍ تَجْرِي'),
];
const idghamMeem = [item('لَهُمْ مَا', 'lahum-mā'), item('أَمْ مَنْ', 'ʾam-man')];
const ikhfaMeem = [item('تَرْمِيهِمْ بِحِجَارَةٍ'), item('رَبَّهُمْ بِهِمْ'), item('هُمْ بِهَا')];
const izharMeem = [item('لَكُمْ دِينُكُمْ'), item('هُمْ فِيهَا'), item('أَنْعَمْتَ'), item('عَلَيْهِمْ غَيْرِ')];

const lesson16: LessonDef = {
  slug: 'nuraniyyah-lesson-16',
  title: 'Lesson 16: Rules of Noon Sākinah and Mīm Sākinah — أَحْكَامُ النُّونِ السَّاكِنَةِ',
  description: 'Learn the four rules for a noon sākinah or tanwīn — showing, merging, hiding and changing — and the three rules for a mīm sākinah.',
  html: `
<h2>Rules of Noon Sākinah — ${ar('أَحْكَامُ النُّونِ السَّاكِنَةِ')}</h2>
<p><strong>Whenever you see a Noon Sākinah (${ar('نْ')}) or Tanwīn (${ar('ـً ـٍ ـٌ')}), you must look at the next letter.</strong> Depending on which group the letter belongs to, you apply the matching rule.</p>
${table(
  ['Rule', 'The next letter is…', 'What to do'],
  [
    [`<strong>Show</strong><br>${ar('الْإِظْهَارُ')}`, `${ar('ء ه ع ح غ خ', '1.8rem')}`, 'Pronounce the noon clearly, with no ghunnah.'],
    [`<strong>Merge</strong><br>${ar('الْإِدْغَامُ')}`, `${ar('ي ر م ل و ن', '1.8rem')}`, 'The noon merges into the next letter. Ghunnah for ي م و ن; no ghunnah for ر ل.'],
    [`<strong>Hide</strong><br>${ar('الْإِخْفَاءُ')}`, `${ar('ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك', '1.8rem')}<br><em>(all the remaining letters)</em>`, 'Hide the noon softly with ghunnah, without touching the tongue to the roof of the mouth.'],
    [`<strong>Change</strong><br>${ar('الْإِقْلَابُ')}`, `${ar('ب', '1.8rem')}`, `Change the noon into a ${ar('م')} (mīm) and hide it with ghunnah.`],
  ],
)}

<h3>Show (iẓhār) — ${ar('ء ه ع ح غ خ')}</h3>
${arabicGrid(izharNoon, { min: 170, size: '2.25rem' })}
<h3>Merge (idghām) — ${ar('ي ر م ل و ن')}</h3>
<p>The pronunciation guide shows how the noon blends into the next letter.</p>
${arabicGrid(idghamNoon, { min: 170, size: '2.25rem' })}
<h3>Change (iqlāb) — ${ar('ب')}</h3>
${arabicGrid(iqlabNoon, { min: 170, size: '2.25rem' })}
<h3>Hide (ikhfāʾ) — all the remaining letters</h3>
<p>Here the noon is hidden with a nasal ghunnah, so the guide shows the plain spelling; listen to the recitations below to hear the hiding.</p>
${arabicGrid(ikhfaNoon, { min: 170, size: '2.25rem' })}

<h2>Rules of Mīm Sākinah — ${ar('أَحْكَامُ الْمِيمِ السَّاكِنَةِ')}</h2>
<p><strong>Whenever you see a Mīm Sākinah (${ar('مْ')}), you must look at the next letter.</strong></p>
${table(
  ['Rule', 'The next letter is…', 'What to do'],
  [
    [`<strong>Merge</strong><br>${ar('الْإِدْغَامُ')}`, ar('م', '1.8rem'), 'Merge the two mīms with ghunnah.'],
    [`<strong>Hide</strong><br>${ar('الْإِخْفَاءُ')}`, ar('ب', '1.8rem'), 'Hide the mīm softly with ghunnah (with the lips together, lightly).'],
    [`<strong>Show</strong><br>${ar('الْإِظْهَارُ')}`, '<em>all the remaining letters</em>', 'Pronounce the mīm clearly.'],
  ],
)}
<h3>Merge — ${ar('م')}</h3>
${arabicGrid(idghamMeem, { min: 170, size: '2.25rem' })}
<h3>Hide — ${ar('ب')}</h3>
${arabicGrid(ikhfaMeem, { min: 200, size: '2.25rem' })}
<h3>Show — the remaining letters</h3>
${arabicGrid(izharMeem, { min: 170, size: '2.25rem' })}

<h3>Listen and read along</h3>
${quranVerse({ ref: '99:7', surah: 99, ayah: 7, label: 'Sūrat az-Zalzalah — verse 7 (merge)', ar: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ', tr: 'famay-yaʿmal mithqāla dharratin khayray-yarah' })}
${quranVerse({ ref: '114:4', surah: 114, ayah: 4, label: 'Sūrat an-Nās — verse 4 (hide)', ar: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ', tr: 'min sharril-waswāsil-khannās' })}
${quranVerse({ ref: '100:11', surah: 100, ayah: 11, label: 'Sūrat al-ʿĀdiyāt — verse 11 (mīm sākinah and tanwīn)', ar: 'إِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَّخَبِيرٌ', tr: 'inna rabbahum bihim yawmaʾidhil-lakhabīr' })}
${quranVerse({ ref: '1:7', surah: 1, ayah: 7, label: 'Sūrat al-Fātiḥah — verse 7 (show)', ar: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ', tr: 'ṣirāṭal-ladhīna anʿamta ʿalayhim ghayril-maghḍūbi ʿalayhim wa laḍ-ḍāllīn' })}
`.trim(),
  terms: [
    { arabic: 'نُون سَاكِنَة', transliteration: 'nūn sākinah', translation: 'a noon with sukūn' },
    { arabic: 'مِيم سَاكِنَة', transliteration: 'mīm sākinah', translation: 'a mīm with sukūn' },
    { arabic: 'الْإِظْهَار', transliteration: 'al-iẓhār', translation: 'showing — pronouncing a letter clearly' },
    { arabic: 'الْإِدْغَام', transliteration: 'al-idghām', translation: 'merging one letter into the next' },
    { arabic: 'الْإِخْفَاء', transliteration: 'al-ikhfāʾ', translation: 'hiding — a soft sound with ghunnah' },
    { arabic: 'الْإِقْلَاب', transliteration: 'al-iqlāb', translation: 'changing — a noon becomes a mīm' },
  ],
  cards: [
    { front: 'What are the four rules of noon sākinah and tanwīn?', back: 'Show (iẓhār), merge (idghām), hide (ikhfāʾ), change (iqlāb).', category: 'rule', tags: ['nuraniyyah', 'noon-sakinah'] },
    { front: 'Which letters make you SHOW a noon sākinah (iẓhār)?', back: 'The six throat letters.', backArabic: 'ء ه ع ح غ خ', category: 'rule', tags: ['nuraniyyah', 'noon-sakinah'] },
    { front: 'Which letters make you MERGE a noon sākinah (idghām)?', back: 'The six letters of yarmalūn.', backArabic: 'ي ر م ل و ن', category: 'rule', tags: ['nuraniyyah', 'noon-sakinah'] },
    { front: 'Which letter makes you CHANGE a noon sākinah (iqlāb)?', back: 'Bāʾ — the noon changes into a mīm.', backArabic: 'ب', category: 'rule', tags: ['nuraniyyah', 'noon-sakinah'] },
    { front: 'When do you HIDE a noon sākinah (ikhfāʾ)?', back: 'Before the remaining 15 letters.', category: 'rule', tags: ['nuraniyyah', 'noon-sakinah'] },
    { front: 'What are the rules of mīm sākinah?', back: 'Merge before mīm; hide before bāʾ; show before all other letters.', category: 'rule', tags: ['nuraniyyah', 'meem-sakinah'] },
    wordCard(idghamNoon[0], 'noon-sakinah'),
    wordCard(iqlabNoon[0], 'noon-sakinah'),
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'A noon sākinah is followed by the letter ب. Which rule applies?',
      options: ['Show (iẓhār)', 'Merge (idghām)', 'Hide (ikhfāʾ)', 'Change (iqlāb)'],
      correctAnswer: 'Change (iqlāb)',
      explanation: 'Before bāʾ the noon changes into a mīm and is hidden with ghunnah: مِنْ بَعْدِ → mim baʿdi.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which rule applies when a noon sākinah is followed by ع?',
      options: ['Show (iẓhār)', 'Merge (idghām)', 'Hide (ikhfāʾ)', 'Change (iqlāb)'],
      correctAnswer: 'Show (iẓhār)',
      explanation: 'ʿayn is one of the six throat letters ء ه ع ح غ خ, so the noon is shown clearly.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which letters make you merge a noon sākinah (idghām)?',
      options: ['ي ر م ل و ن', 'ء ه ع ح غ خ', 'ت ث ج د ذ', 'ب only'],
      correctAnswer: 'ي ر م ل و ن',
      explanation: 'The merging letters are ي ر م ل و ن (yarmalūn).',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'A mīm sākinah is followed by ب. What do you do?',
      options: ['Hide it with ghunnah', 'Show it', 'Merge it into the bāʾ', 'Change it into a noon'],
      correctAnswer: 'Hide it with ghunnah',
      explanation: 'Before bāʾ, the mīm sākinah is hidden softly with ghunnah (ikhfāʾ shafawī).',
      difficulty: 'MEDIUM',
    },
    {
      type: 'TRUE_FALSE',
      questionText: 'When a mīm sākinah is followed by another mīm, the two merge with ghunnah.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Mīm sākinah merges into a following mīm with ghunnah (e.g. lahum-mā).',
      difficulty: 'EASY',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 17 — Separately Recited Letters
// ─────────────────────────────────────────────────────────────────────────────

const muqattaat: Array<{ ar: string; tr: string; surah: number; ayah: number; name: string }> = [
  { ar: 'الٓمٓ', tr: 'Alif Lām Mīm', surah: 2, ayah: 1, name: 'Al-Baqarah' },
  { ar: 'الٓمٓصٓ', tr: 'Alif Lām Mīm Ṣād', surah: 7, ayah: 1, name: 'Al-Aʿrāf' },
  { ar: 'الٓرٰ', tr: 'Alif Lām Rā', surah: 10, ayah: 1, name: 'Yūnus' },
  { ar: 'الٓمٓرٰ', tr: 'Alif Lām Mīm Rā', surah: 13, ayah: 1, name: 'Ar-Raʿd' },
  { ar: 'كٓهيعٓصٓ', tr: 'Kāf Hā Yā ʿAyn Ṣād', surah: 19, ayah: 1, name: 'Maryam' },
  { ar: 'طه', tr: 'Ṭā Hā', surah: 20, ayah: 1, name: 'Ṭā Hā' },
  { ar: 'طسٓمٓ', tr: 'Ṭā Sīn Mīm', surah: 26, ayah: 1, name: 'Ash-Shuʿarāʾ' },
  { ar: 'طسٓ', tr: 'Ṭā Sīn', surah: 27, ayah: 1, name: 'An-Naml' },
  { ar: 'يسٓ', tr: 'Yā Sīn', surah: 36, ayah: 1, name: 'Yā Sīn' },
  { ar: 'صٓ', tr: 'Ṣād', surah: 38, ayah: 1, name: 'Ṣād' },
  { ar: 'حمٓ', tr: 'Ḥā Mīm', surah: 40, ayah: 1, name: 'Ghāfir' },
  { ar: 'عٓسٓقٓ', tr: 'ʿAyn Sīn Qāf', surah: 42, ayah: 2, name: 'Ash-Shūrā' },
  { ar: 'نٓ', tr: 'Nūn', surah: 68, ayah: 1, name: 'Al-Qalam' },
  { ar: 'قٓ', tr: 'Qāf', surah: 50, ayah: 1, name: 'Qāf' },
];

const lesson17: LessonDef = {
  slug: 'nuraniyyah-lesson-17',
  title: 'Lesson 17: Separately Recited Letters — الْحُرُوفُ الْمُقَطَّعَةُ',
  description: 'Read the letters that open fourteen Qur\'ānic verses — pronounced by their names — and listen to each one recited.',
  html: `
<h2>Separately Recited Letters — ${ar('الْحُرُوفُ الْمُقَطَّعَةُ')}</h2>
<p>Some sūrahs of the Qur'ān begin with letters that are <strong>recited by their names</strong>, one at a time — not as a word. For example ${ar('الٓمٓ')} is read <em>Alif Lām Mīm</em>, not "alm". Allāh knows best their meaning.</p>
${exampleBox(
  'How long to stretch them',
  `<p>A small madd mark (${ar('ٓ')}) is written above these letters. A letter whose name has a madd followed by a sukūn — like ${ar('لَام')} (<em>lām</em>), ${ar('مِيم')} (<em>mīm</em>), ${ar('سِين')} (<em>sīn</em>), ${ar('صَاد')} (<em>ṣād</em>) and ${ar('قَاف')} (<em>qāf</em>) — is a madd lāzim, stretched <strong>six ḥarakāt</strong> (Lesson 15). Letters with only a madd, such as ${ar('حَا')}, ${ar('يَا')}, ${ar('طَا')}, ${ar('هَا')} and ${ar('رَا')}, take the natural <strong>two ḥarakāt</strong>. The letter ʿayn is normally held four to six beats.</p>`,
)}

<h3>Listen and read along</h3>
${muqattaat
  .map((m) =>
    quranVerse({
      ref: `${m.surah}:${m.ayah}`,
      surah: m.surah,
      ayah: m.ayah,
      label: `Sūrat ${m.name}`,
      ar: m.ar,
      tr: m.tr,
    }),
  )
  .join('\n')}
`.trim(),
  terms: [
    { arabic: 'الْحُرُوفُ الْمُقَطَّعَة', transliteration: 'al-ḥurūf al-muqaṭṭaʿah', translation: 'the separately recited letters that open some sūrahs' },
  ],
  cards: [
    { front: 'How are the opening letters of sūrahs like الٓمٓ recited?', back: 'By their names, one at a time: Alif Lām Mīm.', backArabic: 'الٓمٓ', category: 'rule', tags: ['nuraniyyah', 'muqattaat'] },
    ...[muqattaat[4], muqattaat[8], muqattaat[11]].map((m) => ({
      front: 'How is this read?',
      frontArabic: m.ar,
      back: `${m.tr} (Sūrat ${m.name})`,
      category: 'example' as const,
      tags: ['nuraniyyah', 'muqattaat'],
    })),
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
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many ḥarakāt is the lām in الٓمٓ stretched?',
      options: ['Two', 'Four', 'Six', 'One'],
      correctAnswer: 'Six',
      explanation: 'The name lām has a madd followed by a sukūn, so it is a madd lāzim: six ḥarakāt.',
      difficulty: 'HARD',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 18 — Summary of Tajweed Rules
// ─────────────────────────────────────────────────────────────────────────────

const lesson18: LessonDef = {
  slug: 'nuraniyyah-summary',
  title: 'Summary of Tajweed Rules — خُلَاصَةُ أَحْكَامِ التَّجْوِيدِ',
  description: 'A one-page summary of every rule in the Nūrāniyyah: letters, madd, bouncing letters, ghunnah, noon sākinah and mīm sākinah.',
  html: `
<h2>Summary of Tajweed Rules — ${ar('خُلَاصَةُ أَحْكَامِ التَّجْوِيدِ')}</h2>
<p>Congratulations! You have met every rule you need to read the Qur'ān with tajwīd. Keep this page as your quick reference.</p>

<h3>The letters</h3>
${table(
  ['Topic', 'Rule'],
  [
    ['Arabic letters', '<strong>29</strong> letters (28 plus hamzah)'],
    [`Heavy letters ${ar('الْحُرُوفُ الْمُفَخَّمَةُ')}`, `${ar('خُصَّ ضَغْطٍ قِظْ', '1.6rem')} <em>${transliterate('خُصَّ ضَغْطٍ قِظْ')}</em> — plus ${ar('ر')} (rāʾ) in certain cases`],
    [`Bouncing letters ${ar('حُرُوفُ الْقَلْقَلَةِ')}`, `${ar('قُطْبُ جَدٍّ', '1.6rem')} <em>${transliterate('قُطْبُ جَدٍّ')}</em> — bounce lightly when they have a sukūn`],
    [`Ghunnah ${ar('حَرْفُ غُنَّةٍ مُشَدَّدٌ')}`, `${ar('نّ ـ مّ', '1.6rem')} — a nūn or mīm with shaddah, held for two beats`],
  ],
)}

<h3>Counting the madd</h3>
${table(
  ['Beats', 'Type', 'Example'],
  [
    ['1', 'Ḥarakah', `${ar('بَ', '1.8rem')} <em>ba</em> · ${ar('بِ', '1.8rem')} <em>bi</em> · ${ar('بُ', '1.8rem')} <em>bu</em>`],
    ['2', 'Natural madd and līn', `${ar('بَا', '1.8rem')} <em>bā</em> · ${ar('بِي', '1.8rem')} <em>bī</em> · ${ar('بُو', '1.8rem')} <em>bū</em> · ${ar('بَوْ', '1.8rem')} <em>baw</em>`],
    ['4', 'Madd before a hamzah', `${ar('جَاءَ', '1.8rem')} <em>jāʾa</em> · ${ar('سُوءٍ', '1.8rem')} <em>sūʾin</em> · ${ar('بِمَا أُنْزِلَ', '1.8rem')} <em>${transliterate('بِمَا أُنْزِلَ')}</em>`],
    ['6', 'Madd lāzim (before sukūn or shaddah)', `${ar('دَابَّةٍ', '1.8rem')} <em>dābbatin</em> · ${ar('ضَالًّا', '1.8rem')} <em>ḍāllan</em>`],
  ],
)}

<h3>Noon sākinah and tanwīn — look at the next letter</h3>
${table(
  ['Rule', 'Letters'],
  [
    [`Merge ${ar('الْإِدْغَامُ')}`, ar('ي ر م ل و ن', '1.8rem')],
    [`Show ${ar('الْإِظْهَارُ')}`, ar('ء ه ع ح غ خ', '1.8rem')],
    [`Hide ${ar('الْإِخْفَاءُ')}`, '<em>The remaining letters</em>'],
    [`Change ${ar('الْإِقْلَابُ')}`, `${ar('ب', '1.8rem')} — the noon changes into a ${ar('م')}`],
  ],
)}

<h3>Mīm sākinah — look at the next letter</h3>
${table(
  ['Rule', 'Letters'],
  [
    [`Merge ${ar('الْإِدْغَامُ')}`, ar('م', '1.8rem')],
    [`Hide (with ghunnah) ${ar('الْإِخْفَاءُ')}`, ar('ب', '1.8rem')],
    [`Show ${ar('الْإِظْهَارُ')}`, '<em>The remaining letters</em>'],
  ],
)}

<h3>Hamzat al-waṣl</h3>
<ul>
  <li><strong>Middle:</strong> skip it.</li>
  <li><strong>Beginning, before lām:</strong> fatḥah (${ar('ٱلْحَمْدُ')} → <em>alḥamdu</em>).</li>
  <li><strong>Beginning, third letter has ḍammah:</strong> ḍammah (${ar('ٱنْظُرْ')} → <em>unẓur</em>).</li>
  <li><strong>Beginning, all other cases:</strong> kasrah (${ar('ٱهْدِنَا')} → <em>ihdinā</em>).</li>
</ul>

${tipBox('What next?', '<p>Keep reading! Listen to a recitation, follow along in the Qur\'ān, and apply these rules. Make this du\'ā often:</p>')}
${quranVerse({ ref: '20:114', surah: 20, ayah: 114, label: 'Du\'ā for knowledge', ar: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', tr: 'wa qur-rabbi zidnī ʿilmā — "My Lord, increase me in knowledge."' })}
`.trim(),
  terms: [
    { arabic: 'التَّجْوِيد', transliteration: 'tajwīd', translation: 'reading the Qur\'ān with the correct pronunciation of every letter and rule' },
  ],
  cards: [
    { front: 'How many beats is a madd before a hamzah?', back: 'Four ḥarakāt.', category: 'rule', tags: ['nuraniyyah', 'summary'] },
    { front: 'How many beats is a madd lāzim?', back: 'Six ḥarakāt.', category: 'rule', tags: ['nuraniyyah', 'summary'] },
    { front: 'Which letters are the bouncing letters?', back: 'qāf, ṭāʾ, bāʾ, jīm, dāl — quṭbu jadd', backArabic: 'قُطْبُ جَدٍّ', category: 'rule', tags: ['nuraniyyah', 'summary'] },
    { front: 'Which letters are the heavy letters?', back: 'khuṣṣa ḍaghṭin qiẓ', backArabic: 'خُصَّ ضَغْطٍ قِظْ', category: 'rule', tags: ['nuraniyyah', 'summary'] },
    { front: 'What is tajwīd?', back: 'Reading the Qur\'ān with the correct pronunciation of every letter and rule.', backArabic: 'التَّجْوِيد', category: 'definition', tags: ['nuraniyyah', 'summary'] },
  ],
  quiz: [
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Match the madd to its length: natural madd, madd before hamzah, madd lāzim.',
      options: ['2, 4, 6 ḥarakāt', '1, 2, 4 ḥarakāt', '2, 6, 4 ḥarakāt', '4, 4, 6 ḥarakāt'],
      correctAnswer: '2, 4, 6 ḥarakāt',
      explanation: 'Natural madd = 2, madd before hamzah = 4, madd lāzim = 6.',
      difficulty: 'MEDIUM',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which letters are the ghunnah letters (with shaddah)?',
      options: ['نّ and مّ', 'لّ and رّ', 'بّ and تّ', 'قّ and كّ'],
      correctAnswer: 'نّ and مّ',
      explanation: 'A nūn or mīm with shaddah is ḥarf ghunnah mushaddad.',
      difficulty: 'EASY',
    },
    {
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which letters bounce when they have a sukūn?',
      options: ['ق ط ب ج د', 'ن م ل ر و', 'ء ه ع ح غ خ', 'ا و ي'],
      correctAnswer: 'ق ط ب ج د',
      explanation: 'These are the qalqalah letters, remembered as قُطْبُ جَدٍّ.',
      difficulty: 'EASY',
    },
  ],
};

export const LESSONS_PART_3: LessonDef[] = [lesson13, lesson14, lesson15, lesson16, lesson17, lesson18];

