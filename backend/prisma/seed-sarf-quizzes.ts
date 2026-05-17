import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Comprehensive Quiz Questions for Advanced Sarf Course
 * 10-15 questions per unit covering all key concepts
 */

export async function seedSarfQuizzes() {
  console.log('📝 Adding comprehensive quiz questions for Sarf course...');
  console.log('');

  // Find the Sarf course and its units
  const sarfCourse = await prisma.course.findFirst({
    where: { title: 'Advanced Sarf - Arabic Morphology' },
    include: { units: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!sarfCourse || sarfCourse.units.length === 0) {
    console.log('⚠️  Sarf course not found. Please run seed-sarf-simple.ts first.');
    return;
  }

  console.log('✅ Found Sarf course with', sarfCourse.units.length, 'units');

  const [unit1, unit2, unit3, unit4, unit5, unit6, unit7] = sarfCourse.units;

  // Delete existing questions to avoid duplicates
  await prisma.question.deleteMany({
    where: { unitId: { in: sarfCourse.units.map(u => u.id) } }
  });

  // ========== UNIT 1: Introduction to Sarf ==========
  await prisma.question.createMany({
    data: [
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three letters of the morphological scale (الميزان الصرفي)?',
        options: JSON.stringify(['ف، ع، ل', 'أ، ب، ج', 'س، ل، م', 'ك، ت، ب']),
        correctAnswer: 'ف، ع، ل',
        explanation: 'The scale فَعَلَ uses ف for the first radical, ع for the second, and ل for the third radical of any Arabic root.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the root ك-ت-ب (K-T-B), which position does the letter ت occupy on the morphological scale?',
        options: JSON.stringify(['فاء الكلمة', 'عين الكلمة', 'لام الكلمة', 'همزة الكلمة']),
        correctAnswer: 'عين الكلمة',
        explanation: 'The letter ت is the second radical (عين الكلمة) in the root ك-ت-ب, corresponding to the ع in the scale فَعَلَ.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'TRUE_FALSE',
        questionText: 'Sarf is considered more fundamental than Nahw (grammar) by classical scholars.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Scholars say "الصرف أم العلوم" - Sarf is the mother of sciences, as mastering it is foundational for understanding Nahw.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the mnemonic for remembering added letters (الحروف الزائدة) in Arabic?',
        options: JSON.stringify(['سَأَلْتُمُونِيهَا', 'فَعَلَ', 'كَتَبَ', 'الْحَمْدُ لِلَّهِ']),
        correctAnswer: 'سَأَلْتُمُونِيهَا',
        explanation: 'سَأَلْتُمُونِيهَا (sa\'altumūnīhā - "You asked me about it") contains all the added letters used in Arabic morphology.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'A Ṣaḥīḥ (صحيح) verb is one that:',
        options: JSON.stringify(['Contains weak letters', 'Has only strong consonants', 'Is derived from Form II', 'Means "correct" in meaning']),
        correctAnswer: 'Has only strong consonants',
        explanation: 'Ṣaḥīḥ verbs have all three radicals as strong consonants, with no weak letters (و، ي، or ا).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit1.id,
        type: 'FILL_BLANK',
        questionText: 'The science of Arabic morphology is called علم _____.',
        correctAnswer: 'الصرف',
        explanation: 'علم الصرف (\'ilm aṣ-ṣarf) is the science of Arabic morphology that studies word structure and changes.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which type of verb contains one or more weak letters as radicals?',
        options: JSON.stringify(['صحيح', 'معتل', 'مجرد', 'مزيد']),
        correctAnswer: 'معتل',
        explanation: 'Mu\'tall (معتل) verbs contain one or more weak letters (و، ي، or ا) as radical consonants.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'TRUE_FALSE',
        questionText: 'The morphological scale can be used to analyze words from any Arabic root.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The فَعَلَ scale is universal and can be applied to any Arabic three-letter root for morphological analysis.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the scale فَعَلَ, what does the letter ل (lām) represent?',
        options: JSON.stringify(['First radical', 'Second radical', 'Third radical', 'Added letter']),
        correctAnswer: 'Third radical',
        explanation: 'In the morphological scale, ل represents the third radical letter (لام الكلمة) of any root.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The root of the word دَرَسَ (to study) is:',
        options: JSON.stringify(['د-ر-س', 'د-س-ر', 'ر-د-س', 'س-د-ر']),
        correctAnswer: 'د-ر-س',
        explanation: 'The three-letter root of دَرَسَ is د-ر-س, following the order of radicals in the word.',
        difficulty: 'EASY',
      },
    ],
  });
  console.log('✅ Added 10 questions for Unit 1');

  // ========== UNIT 2: Verb Forms I-V ==========
  await prisma.question.createMany({
    data: [
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which verb form indicates intensification or repetition of an action?',
        options: JSON.stringify(['Form I (فَعَلَ)', 'Form II (فَعَّلَ)', 'Form III (فَاعَلَ)', 'Form IV (أَفْعَلَ)']),
        correctAnswer: 'Form II (فَعَّلَ)',
        explanation: 'Form II, with the doubled middle letter (شدة), indicates intensification, repetition, or causation of the base action.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb عَلَّمَ (to teach) is which form?',
        options: JSON.stringify(['Form I', 'Form II', 'Form III', 'Form IV']),
        correctAnswer: 'Form II',
        explanation: 'عَلَّمَ is Form II (فَعَّلَ) - the causative of Form I عَلِمَ (to know), meaning "to cause to know" = to teach.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'FILL_BLANK',
        questionText: 'Form III (فَاعَلَ) adds the letter _____ after the first radical.',
        correctAnswer: 'ا',
        explanation: 'Form III adds an alif (ا) after the first radical, as in قَاتَلَ (to fight with) from قَتَلَ (to kill).',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the primary meaning of Form III (فَاعَلَ)?',
        options: JSON.stringify(['Intensification', 'Reciprocity/doing with someone', 'Causation', 'Colors and defects']),
        correctAnswer: 'Reciprocity/doing with someone',
        explanation: 'Form III primarily indicates reciprocal action or doing something with/to someone, like قَاتَلَ (to fight with).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb أَنْزَلَ (to send down/reveal) is which form?',
        options: JSON.stringify(['Form II', 'Form III', 'Form IV', 'Form V']),
        correctAnswer: 'Form IV',
        explanation: 'أَنْزَلَ is Form IV (أَفْعَلَ), characterized by the hamza at the beginning, often indicating causation.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'TRUE_FALSE',
        questionText: 'Form IV (أَفْعَلَ) and Form II (فَعَّلَ) both can express causation.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Both forms can express causation, though they may have different nuances and are used with different roots.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Form V (تَفَعَّلَ) is primarily the reflexive of which form?',
        options: JSON.stringify(['Form I', 'Form II', 'Form III', 'Form IV']),
        correctAnswer: 'Form II',
        explanation: 'Form V (تَفَعَّلَ) is typically the reflexive of Form II, like تَعَلَّمَ (to learn) from عَلَّمَ (to teach).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which form is كَسَّرَ (to shatter/break intensively)?',
        options: JSON.stringify(['Form I', 'Form II', 'Form III', 'Form IV']),
        correctAnswer: 'Form II',
        explanation: 'كَسَّرَ is Form II, showing intensification of كَسَرَ (Form I - to break).',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb تَكَبَّرَ (to act arrogantly) is which form?',
        options: JSON.stringify(['Form II', 'Form III', 'Form IV', 'Form V']),
        correctAnswer: 'Form V',
        explanation: 'تَكَبَّرَ is Form V (تَفَعَّلَ), indicating pretending or affecting a quality (acting with pride).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'TRUE_FALSE',
        questionText: 'Form I (فَعَلَ) is the only form that can have different vowel patterns in the present tense.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Form I can have يَفْعُلُ، يَفْعِلُ، or يَفْعَلُ in the present, while higher forms have fixed patterns.',
        difficulty: 'HARD',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the Quran, أَنْزَلَ is used to mean:',
        options: JSON.stringify(['To ascend', 'To send down/reveal', 'To break', 'To teach']),
        correctAnswer: 'To send down/reveal',
        explanation: 'أَنْزَلَ (Form IV) is frequently used in the Quran for sending down revelation, as in أَنْزَلَ القُرْآنَ.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'FILL_BLANK',
        questionText: 'The distinguishing feature of Form II is the _____ (doubling) of the middle radical.',
        correctAnswer: 'شدة',
        explanation: 'Form II (فَعَّلَ) is characterized by the شدة (shadda/doubling) on the middle radical letter.',
        difficulty: 'EASY',
      },
    ],
  });
  console.log('✅ Added 12 questions for Unit 2');

  // ========== UNIT 3: Verb Forms VI-X ==========
  await prisma.question.createMany({
    data: [
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Form IX (افْعَلَّ) is primarily used for which semantic category?',
        options: JSON.stringify(['Emotions', 'Colors and physical defects', 'Times of day', 'Reciprocal actions']),
        correctAnswer: 'Colors and physical defects',
        explanation: 'Form IX is specifically for acquiring colors (احْمَرَّ - became red) or developing physical characteristics.',
        difficulty: 'HARD',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the pattern for Form VIII?',
        options: JSON.stringify(['تَفَعَّلَ', 'افْتَعَلَ', 'انْفَعَلَ', 'اسْتَفْعَلَ']),
        correctAnswer: 'افْتَعَلَ',
        explanation: 'Form VIII follows the pattern افْتَعَلَ with hamza at the beginning and tā\' (ت) after the first radical.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'TRUE_FALSE',
        questionText: 'Form X (اسْتَفْعَلَ) commonly expresses seeking or requesting something.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Form X often means seeking/requesting, as in اسْتَغْفَرَ (sought forgiveness) from غَفَرَ (to forgive).',
        difficulty: 'EASY',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb تَجَاهَلَ (to feign ignorance) is which form?',
        options: JSON.stringify(['Form V', 'Form VI', 'Form VII', 'Form VIII']),
        correctAnswer: 'Form VI',
        explanation: 'تَجَاهَلَ is Form VI (تَفَاعَلَ), which can mean pretending or affecting a quality.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Form VII (انْفَعَلَ) typically expresses:',
        options: JSON.stringify(['Active causation', 'Passive/reflexive meaning', 'Seeking', 'Colors']),
        correctAnswer: 'Passive/reflexive meaning',
        explanation: 'Form VII often expresses passive or reflexive meanings, like انْكَسَرَ (to be broken) from كَسَرَ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'FILL_BLANK',
        questionText: 'اسْتَغْفَرَ means "to _____ forgiveness."',
        correctAnswer: 'seek',
        explanation: 'اسْتَغْفَرَ (Form X) means to seek or request forgiveness from Allah, derived from غَفَرَ (to forgive).',
        difficulty: 'EASY',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which form is اجْتَمَعَ (to gather together)?',
        options: JSON.stringify(['Form VI', 'Form VII', 'Form VIII', 'Form X']),
        correctAnswer: 'Form VIII',
        explanation: 'اجْتَمَعَ is Form VIII (افْتَعَلَ), expressing reflexive or mutual gathering from جَمَعَ (to collect).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'TRUE_FALSE',
        questionText: 'Form IX (افْعَلَّ) is one of the most commonly used verb forms in Arabic.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Form IX is actually quite rare and specialized, used mainly for colors and physical defects.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb اكْتَسَبَ (to earn for oneself) is which form?',
        options: JSON.stringify(['Form VI', 'Form VII', 'Form VIII', 'Form X']),
        correctAnswer: 'Form VIII',
        explanation: 'اكْتَسَبَ is Form VIII, expressing acquisition or earning for oneself from كَسَبَ (to earn).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which form means "to cooperate with each other"?',
        options: JSON.stringify(['تَعَاوَنَ (Form VI)', 'تَعَلَّمَ (Form V)', 'اتَّعَظَ (Form VIII)', 'اسْتَعَانَ (Form X)']),
        correctAnswer: 'تَعَاوَنَ (Form VI)',
        explanation: 'تَعَاوَنَ (Form VI) expresses mutual cooperation, from عَوَنَ/أَعَانَ (to help).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'احْمَرَّ (to become red) is which rare form?',
        options: JSON.stringify(['Form VII', 'Form VIII', 'Form IX', 'Form X']),
        correctAnswer: 'Form IX',
        explanation: 'احْمَرَّ is Form IX (افْعَلَّ), used for acquiring colors, from the root ح-م-ر.',
        difficulty: 'EASY',
      },
      {
        unitId: unit3.id,
        type: 'TRUE_FALSE',
        questionText: 'Form X (اسْتَفْعَلَ) can also mean "to deem" or "to consider."',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Besides seeking, Form X can mean considering something a certain way, like اسْتَحْسَنَ (to deem good).',
        difficulty: 'MEDIUM',
      },
    ],
  });
  console.log('✅ Added 12 questions for Unit 3');

  // ========== UNIT 4: Mithal Verbs ==========
  await prisma.question.createMany({
    data: [
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In Mithal verbs, which radical is weak?',
        options: JSON.stringify(['First radical (فاء)', 'Second radical (عين)', 'Third radical (لام)', 'None']),
        correctAnswer: 'First radical (فاء)',
        explanation: 'Mithal (المثال) verbs have و or ي as the first radical (فاء الكلمة).',
        difficulty: 'EASY',
      },
      {
        unitId: unit4.id,
        type: 'FILL_BLANK',
        questionText: 'The present tense of وَعَدَ (to promise) is _____.',
        correctAnswer: 'يَعِدُ',
        explanation: 'The initial و drops in Form I present tense when the middle vowel is kasra: وَعَدَ → يَعِدُ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'TRUE_FALSE',
        questionText: 'In higher forms (II-X), the weak و of Mithal verbs usually remains.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'In forms like Form II (وَصَّلَ) and Form IV (أَوْصَلَ), the initial و typically stays.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb وَجَدَ (to find) becomes _____ in the present tense.',
        options: JSON.stringify(['يَوْجِدُ', 'يَجِدُ', 'يَجْدُ', 'يُوجَدُ']),
        correctAnswer: 'يَجِدُ',
        explanation: 'Following the Mithal rule, the و drops: وَجَدَ → يَجِدُ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of these is a Mithal verb?',
        options: JSON.stringify(['كَتَبَ', 'وَصَلَ', 'قَالَ', 'دَعَا']),
        correctAnswer: 'وَصَلَ',
        explanation: 'وَصَلَ (to arrive/connect) has و as the first radical, making it a Mithal verb.',
        difficulty: 'EASY',
      },
      {
        unitId: unit4.id,
        type: 'TRUE_FALSE',
        questionText: 'The weak و always drops in Mithal verbs in the present tense.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'It only drops when the middle vowel is kasra (ِ). If the vowel is fatha or damma, it may stay.',
        difficulty: 'HARD',
      },
      {
        unitId: unit4.id,
        type: 'FILL_BLANK',
        questionText: 'The command form of وَعَدَ for أنتَ is _____.',
        correctAnswer: 'عِدْ',
        explanation: 'In the command, the initial و drops: عِدْ (promise!).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The Form IV of وَصَلَ (to arrive) is:',
        options: JSON.stringify(['وَصَّلَ', 'أَوْصَلَ', 'تَوَصَّلَ', 'اتَّصَلَ']),
        correctAnswer: 'أَوْصَلَ',
        explanation: 'أَوْصَلَ (to cause to arrive/deliver) is Form IV, where the initial و is retained.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Mithal verbs are called المثال because:',
        options: JSON.stringify(['They are examples', 'The weak letter resembles (مَاثَلَ) the following letter', 'They are rare', 'They have three weak letters']),
        correctAnswer: 'The weak letter resembles (مَاثَلَ) the following letter',
        explanation: 'The term المثال comes from resemblance - the initial weak letter is assimilated or resembles what follows.',
        difficulty: 'HARD',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which Mithal verb means "to stand"?',
        options: JSON.stringify(['وَجَدَ', 'وَقَفَ', 'وَعَدَ', 'وَصَلَ']),
        correctAnswer: 'وَقَفَ',
        explanation: 'وَقَفَ means to stand, and becomes يَقِفُ in present tense (و drops).',
        difficulty: 'EASY',
      },
    ],
  });
  console.log('✅ Added 10 questions for Unit 4');

  // ========== UNIT 5: Ajwaf Verbs ==========
  await prisma.question.createMany({
    data: [
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Ajwaf verbs have a weak letter in which position?',
        options: JSON.stringify(['First radical', 'Second radical', 'Third radical', 'Fourth radical']),
        correctAnswer: 'Second radical',
        explanation: 'Ajwaf (الأجوف - hollow) verbs have و or ي as the middle (second) radical (عين الكلمة).',
        difficulty: 'EASY',
      },
      {
        unitId: unit5.id,
        type: 'FILL_BLANK',
        questionText: 'The command form of قَالَ (to say) for أنتَ is _____.',
        correctAnswer: 'قُلْ',
        explanation: 'In the command, the middle weak letter و is deleted and the vowel changes: قُلْ (Say!).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the past tense of قَالَ, what happens to the middle و?',
        options: JSON.stringify(['It becomes همزة', 'It becomes ي', 'It becomes ا (alif)', 'It is deleted']),
        correctAnswer: 'It becomes ا (alif)',
        explanation: 'The و between two fathas transforms into ا (alif): قَوَلَ → قَالَ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The present tense of قَالَ (he said) is:',
        options: JSON.stringify(['يَقَالُ', 'يَقُولُ', 'يَقِيلُ', 'يَقْوُلُ']),
        correctAnswer: 'يَقُولُ',
        explanation: 'In Ajwaf verbs, the middle radical creates a long vowel in the present: يَقُولُ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'TRUE_FALSE',
        questionText: 'The Quranic command قُلْ (Say) shows the deletion of the middle weak letter.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'قُلْ from قَالَ demonstrates how the middle و drops completely in the command form of Ajwaf verbs.',
        difficulty: 'EASY',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of these is an Ajwaf verb?',
        options: JSON.stringify(['كَتَبَ', 'وَعَدَ', 'صَامَ', 'دَعَا']),
        correctAnswer: 'صَامَ',
        explanation: 'صَامَ (to fast) has و as the middle radical (ص-و-م), making it Ajwaf.',
        difficulty: 'EASY',
      },
      {
        unitId: unit5.id,
        type: 'FILL_BLANK',
        questionText: 'Ajwaf verbs are called الأجوف meaning "_____" because the middle is weak.',
        correctAnswer: 'hollow',
        explanation: 'الأجوف means "hollow" - referring to the weakness in the middle of these verbs.',
        difficulty: 'EASY',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb بَاعَ (to sell) has which weak letter as the middle radical?',
        options: JSON.stringify(['و', 'ي', 'ا', 'ء']),
        correctAnswer: 'ي',
        explanation: 'بَاعَ comes from the root ب-ي-ع, with ي as the middle radical.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In Form IV, قَامَ becomes:',
        options: JSON.stringify(['قَوَّمَ', 'أَقَامَ', 'تَقَوَّمَ', 'انْقَامَ']),
        correctAnswer: 'أَقَامَ',
        explanation: 'أَقَامَ (to establish/perform) is the Form IV causative of قَامَ (to stand up).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'TRUE_FALSE',
        questionText: 'Ajwaf verbs are more regular in higher forms (II-X) than in Form I.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Higher forms of Ajwaf verbs follow more predictable patterns than Form I.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The root of سَارَ (to walk/travel) is:',
        options: JSON.stringify(['س-ا-ر', 'س-ي-ر', 'س-و-ر', 'س-ر-ر']),
        correctAnswer: 'س-ي-ر',
        explanation: 'The root is س-ي-ر with ي as the middle weak radical.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'FILL_BLANK',
        questionText: 'The past tense "I fasted" using صَامَ is _____.',
        correctAnswer: 'صُمْتُ',
        explanation: 'When conjugating with suffixes starting with consonants, the long vowel shortens: صُمْتُ.',
        difficulty: 'HARD',
      },
    ],
  });
  console.log('✅ Added 12 questions for Unit 5');

  // ========== UNIT 6: Naqis Verbs ==========
  await prisma.question.createMany({
    data: [
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Nāqiṣ verbs have a weak letter in which position?',
        options: JSON.stringify(['First radical', 'Second radical', 'Third radical', 'All positions']),
        correctAnswer: 'Third radical',
        explanation: 'Nāqiṣ (الناقص - deficient) verbs have و or ي as the final (third) radical (لام الكلمة).',
        difficulty: 'EASY',
      },
      {
        unitId: unit6.id,
        type: 'FILL_BLANK',
        questionText: 'The past tense of دَعَا (to call) for هو shows the final و changing to _____.',
        correctAnswer: 'ى',
        explanation: 'The final و after fatha becomes ى (alif maqṣūrah) in 3rd person masculine singular: دَعَا.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'TRUE_FALSE',
        questionText: 'In Nāqiṣ verbs, the final weak letter drops before the feminine تْ ending.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes, as in دَعَتْ (she called), where the final weak letter is dropped before تْ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb رَمَى (to throw) becomes _____ in the past tense masculine plural.',
        options: JSON.stringify(['رَمَيُوا', 'رَمَوْا', 'رَمَّوْا', 'رَامُوا']),
        correctAnswer: 'رَمَوْا',
        explanation: 'In masculine plural past, the final ي changes to و: رَمَوْا (they threw).',
        difficulty: 'HARD',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of these is a Nāqiṣ verb?',
        options: JSON.stringify(['قَالَ', 'وَعَدَ', 'مَشَى', 'كَتَبَ']),
        correctAnswer: 'مَشَى',
        explanation: 'مَشَى (to walk) has ي as the third radical (م-ش-ي), making it Nāqiṣ.',
        difficulty: 'EASY',
      },
      {
        unitId: unit6.id,
        type: 'FILL_BLANK',
        questionText: 'The present tense of دَعَا (he called) is _____.',
        correctAnswer: 'يَدْعُو',
        explanation: 'The present tense is يَدْعُو with the final و visible.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'TRUE_FALSE',
        questionText: 'The letter ى in دَعَا is called alif maqṣūrah (shortened alif).',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'الألف المقصورة (alif maqṣūrah) is the ى that appears when a final weak letter follows fatha.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The command form of دَعَا for أنتَ is:',
        options: JSON.stringify(['اُدْعُ', 'دْعُ', 'اُدْعِ', 'اُدْعُوَ']),
        correctAnswer: 'اُدْعُ',
        explanation: 'The command is اُدْعُ (Call!/Invoke!), following the pattern for Nāqiṣ verbs.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which Quranic phrase uses a Nāqiṣ verb in command form?',
        options: JSON.stringify(['قُلْ', 'وَادْعُ', 'اقْرَأْ', 'اكْتُبْ']),
        correctAnswer: 'وَادْعُ',
        explanation: 'وَادْعُ (And call) from the verb دَعَا is a Nāqiṣ verb in command form.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb تَلَا (to recite) belongs to which category?',
        options: JSON.stringify(['Mithal', 'Ajwaf', 'Nāqiṣ', 'Sound']),
        correctAnswer: 'Nāqiṣ',
        explanation: 'تَلَا has و as the final radical (ت-ل-و), making it Nāqiṣ.',
        difficulty: 'EASY',
      },
      {
        unitId: unit6.id,
        type: 'TRUE_FALSE',
        questionText: 'Nāqiṣ verbs in Form VIII can be written as اشْتَرَى (to buy).',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'اشْتَرَى is Form VIII of a Nāqiṣ root (ش-ر-ي), ending with alif maqṣūrah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'FILL_BLANK',
        questionText: 'The past tense "you (m) walked" using مَشَى is _____.',
        correctAnswer: 'مَشَيْتَ',
        explanation: 'When suffixes are added, the final weak letter reappears: مَشَيْتَ.',
        difficulty: 'MEDIUM',
      },
    ],
  });
  console.log('✅ Added 12 questions for Unit 6');

  // ========== UNIT 7: Lafeef & Practice ==========
  await prisma.question.createMany({
    data: [
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Lafīf Mafrūq verbs have weak letters in which positions?',
        options: JSON.stringify(['1st and 2nd', '2nd and 3rd', '1st and 3rd', 'All three']),
        correctAnswer: '1st and 3rd',
        explanation: 'Lafīf Mafrūq (المفروق - separated) has weak letters in the 1st and 3rd positions, like وَفَى (و-ف-ي).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb وَقَى (to protect) follows rules of which TWO weak verb types?',
        options: JSON.stringify(['Mithal and Ajwaf', 'Mithal and Nāqiṣ', 'Ajwaf and Nāqiṣ', 'Only Lafīf']),
        correctAnswer: 'Mithal and Nāqiṣ',
        explanation: 'Lafīf Mafrūq verbs combine Mithal rules (1st radical) and Nāqiṣ rules (3rd radical).',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'FILL_BLANK',
        questionText: 'The command form of وَفَى for أنتَ is _____.',
        correctAnswer: 'فِ',
        explanation: 'Both weak letters drop in the command: وَفَى → فِ (fulfill!). An extremely short form!',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Lafīf Maqrūn means the weak letters are:',
        options: JSON.stringify(['Far apart', 'Adjacent/contiguous', 'At the beginning', 'All the same']),
        correctAnswer: 'Adjacent/contiguous',
        explanation: 'المقرون means "contiguous" - the 2nd and 3rd radicals are both weak and adjacent.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb رَوَى (to narrate) is which type of Lafīf?',
        options: JSON.stringify(['Lafīf Mafrūq', 'Lafīf Maqrūn', 'Not Lafīf', 'Mithal only']),
        correctAnswer: 'Lafīf Maqrūn',
        explanation: 'رَوَى has both 2nd and 3rd radicals weak (ر-و-ي), making it Lafīf Maqrūn.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'TRUE_FALSE',
        questionText: 'Lafīf verbs are among the most challenging verb types to conjugate.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Because they combine rules from multiple weak verb types, Lafīf verbs are indeed challenging.',
        difficulty: 'EASY',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the first step in analyzing any Arabic verb?',
        options: JSON.stringify(['Identify the form', 'Identify the root', 'Check for weakness', 'Conjugate it']),
        correctAnswer: 'Identify the root',
        explanation: 'Always start by identifying the three-consonant root (الجذر) before anything else.',
        difficulty: 'EASY',
      },
      {
        unitId: unit7.id,
        type: 'TRUE_FALSE',
        questionText: 'Form II and Form IV both can express causation, but they are not interchangeable.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'While both can be causative, they have different nuances and are used with different roots.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which saying emphasizes the importance of Sarf for understanding the Quran?',
        options: JSON.stringify([
          'من أراد أن يفهم القرآن فليتقن الصرف',
          'الصرف سهل للجميع',
          'النحو أهم من الصرف',
          'لا حاجة للصرف'
        ]),
        correctAnswer: 'من أراد أن يفهم القرآن فليتقن الصرف',
        explanation: 'This saying means: "Whoever wants to understand the Quran, let him master Sarf."',
        difficulty: 'EASY',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The verb نَوَى (to intend) is which type?',
        options: JSON.stringify(['Sound', 'Mithal', 'Lafīf Maqrūn', 'Lafīf Mafrūq']),
        correctAnswer: 'Lafīf Maqrūn',
        explanation: 'نَوَى has adjacent weak radicals in positions 2 and 3 (ن-و-ي), making it Lafīf Maqrūn.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'FILL_BLANK',
        questionText: 'A student cannot master _____ until he masters Sarf.',
        correctAnswer: 'Nahw',
        explanation: 'The saying goes: "لا يجيد الطالب علم النحو حتى يتقن علم الصرف" - Nahw cannot be mastered without Sarf.',
        difficulty: 'EASY',
      },
      {
        unitId: unit7.id,
        type: 'TRUE_FALSE',
        questionText: 'Mastering Sarf requires memorizing verb paradigms and practicing with authentic texts.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'True mastery comes from memorizing paradigms and practicing with the Quran, Hadith, and classical texts.',
        difficulty: 'EASY',
      },
    ],
  });
  console.log('✅ Added 12 questions for Unit 7');

  console.log('');
  console.log('🎉 Successfully added comprehensive quiz questions!');
  console.log('📊 Summary:');
  console.log('   - Unit 1: 10 questions');
  console.log('   - Unit 2: 12 questions');
  console.log('   - Unit 3: 12 questions');
  console.log('   - Unit 4: 10 questions');
  console.log('   - Unit 5: 12 questions');
  console.log('   - Unit 6: 12 questions');
  console.log('   - Unit 7: 12 questions');
  console.log('   - Total: 80 questions across all units');
  console.log('');
}

async function main() {
  try {
    await seedSarfQuizzes();
  } catch (error) {
    console.error('❌ Error seeding Sarf quizzes:', error);
    throw error;
  }
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}