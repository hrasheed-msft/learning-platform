import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Advanced Sarf Course - Part 5 (Final)
 * Quiz Questions and Arabic Terms for all units
 */

export async function seedSarfCoursePart5() {
  console.log('📚 Finalizing Sarf course seed - Part 5 (Quiz & Terms)...');
  console.log('');

  // Find the Sarf course
  const sarfCourse = await prisma.course.findFirst({
    where: { title: 'Advanced Sarf - Arabic Morphology' },
    include: { units: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!sarfCourse || sarfCourse.units.length < 8) {
    console.log('⚠️  Sarf course or units not found. Please run Parts 1-4 first.');
    return;
  }

  console.log('✅ Found Sarf course with', sarfCourse.units.length, 'units');

  const [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8] = sarfCourse.units;

  // Quiz Questions for Unit 1
  await prisma.question.createMany({
    data: [
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        question: 'What are the three letters of the morphological scale (الميزان الصرفي)?',
        options: JSON.stringify(['ف، ع، ل', 'أ، ب، ج', 'س، ل، م', 'ك، ت، ب']),
        correctAnswer: 'ف، ع، ل',
        explanation: 'The scale فَعَلَ uses ف for the first radical, ع for the second, and ل for the third radical of any Arabic root.',
        points: 10,
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        question: 'In the root ك-ت-ب (K-T-B), which position does the letter ت occupy?',
        options: JSON.stringify(['فاء الكلمة', 'عين الكلمة', 'لام الكلمة', 'همزة الكلمة']),
        correctAnswer: 'عين الكلمة',
        explanation: 'The letter ت is the second radical (عين الكلمة) in the root ك-ت-ب.',
        points: 10,
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'TRUE_FALSE',
        question: 'Sarf is considered more important than Nahw (grammar) by classical scholars.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Scholars say "الصرف أم العلوم" - Sarf is the mother of sciences, as it\'s foundational for understanding Nahw.',
        points: 10,
        difficulty: 'MEDIUM',
      },
    ],
  });

  // Quiz Questions for Unit 2
  await prisma.question.createMany({
    data: [
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        question: 'Which verb form indicates intensification or repetition of an action?',
        options: JSON.stringify(['Form I (فَعَلَ)', 'Form II (فَعَّلَ)', 'Form III (فَاعَلَ)', 'Form IV (أَفْعَلَ)']),
        correctAnswer: 'Form II (فَعَّلَ)',
        explanation: 'Form II, with the doubled middle letter (شدة), indicates intensification, repetition, or causation.',
        points: 10,
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        question: 'The verb أَنْزَلَ (to send down) is which form?',
        options: JSON.stringify(['Form II', 'Form III', 'Form IV', 'Form V']),
        correctAnswer: 'Form IV',
        explanation: 'أَنْزَلَ is Form IV (أَفْعَلَ), characterized by the همزة at the beginning, meaning causation.',
        points: 10,
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'FILL_BLANK',
        question: 'Form III (فَاعَلَ) adds the letter ___ after the first radical.',
        correctAnswer: 'ا',
        explanation: 'Form III adds an alif (ا) after the first radical, as in قَاتَلَ from قَتَلَ.',
        points: 10,
        difficulty: 'EASY',
      },
    ],
  });

  // Quiz Questions for Unit 3
  await prisma.question.createMany({
    data: [
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        question: 'Form IX (افْعَلَّ) is primarily used for which semantic category?',
        options: JSON.stringify(['Emotions', 'Colors and physical defects', 'Times of day', 'Reciprocal actions']),
        correctAnswer: 'Colors and physical defects',
        explanation: 'Form IX is specifically for acquiring colors (احْمَرَّ - became red) or developing physical characteristics.',
        points: 10,
        difficulty: 'HARD',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        question: 'What is the pattern for Form VIII?',
        options: JSON.stringify(['تَفَعَّلَ', 'افْتَعَلَ', 'انْفَعَلَ', 'اسْتَفْعَلَ']),
        correctAnswer: 'افْتَعَلَ',
        explanation: 'Form VIII follows the pattern افْتَعَلَ with ا at the beginning and ت after the first radical.',
        points: 10,
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'TRUE_FALSE',
        question: 'Form X (اسْتَفْعَلَ) commonly expresses seeking or requesting something.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Form X often means seeking/requesting, as in اسْتَغْفَرَ (sought forgiveness) from غَفَرَ.',
        points: 10,
        difficulty: 'EASY',
      },
    ],
  });

  // Quiz Questions for Unit 4
  await prisma.question.createMany({
    data: [
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        question: 'In Mithal verbs, which radical is weak?',
        options: JSON.stringify(['First radical (فاء)', 'Second radical (عين)', 'Third radical (لام)', 'None']),
        correctAnswer: 'First radical (فاء)',
        explanation: 'Mithal verbs have و or ي as the first radical, which often drops in present tense Form I.',
        points: 10,
        difficulty: 'EASY',
      },
      {
        unitId: unit4.id,
        type: 'FILL_BLANK',
        question: 'The present tense of وَعَدَ (to promise) is ___.',
        correctAnswer: 'يَعِدُ',
        explanation: 'The و drops in present tense, changing وَعَدَ → يَعِدُ.',
        points: 10,
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'TRUE_FALSE',
        question: 'In higher forms (II-X), the weak و of Mithal verbs usually remains.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'In forms like Form II (وَصَّلَ) and Form IV (أَوْصَلَ), the initial و typically stays.',
        points: 10,
        difficulty: 'MEDIUM',
      },
    ],
  });

  // Quiz Questions for Unit 5
  await prisma.question.createMany({
    data: [
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        question: 'Ajwaf verbs have a weak letter in which position?',
        options: JSON.stringify(['First radical', 'Second radical', 'Third radical', 'Fourth radical']),
        correctAnswer: 'Second radical',
        explanation: 'Ajwaf (الأجوف - hollow) verbs have و or ي as the middle (second) radical.',
        points: 10,
        difficulty: 'EASY',
      },
      {
        unitId: unit5.id,
        type: 'FILL_BLANK',
        question: 'The command form of قَالَ (to say) for أنتَ is ___.',
        correctAnswer: 'قُلْ',
        explanation: 'In the command, the middle weak letter و is deleted and the vowel changes: قُلْ.',
        points: 10,
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        question: 'In the past tense of قَالَ, the middle و becomes ___ in the 3rd person masculine.',
        options: JSON.stringify(['همزة', 'ي', 'ا (alif)', 'Nothing (deleted)']),
        correctAnswer: 'ا (alif)',
        explanation: 'The و between two fathas transforms into ا: قَوَلَ → قَالَ.',
        points: 10,
        difficulty: 'MEDIUM',
      },
    ],
  });

  // Quiz Questions for Unit 6
  await prisma.question.createMany({
    data: [
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        question: 'Nāqiṣ verbs have a weak letter in which position?',
        options: JSON.stringify(['First radical', 'Second radical', 'Third radical', 'All positions']),
        correctAnswer: 'Third radical',
        explanation: 'Nāqiṣ (الناقص - deficient) verbs have و or ي as the final (third) radical.',
        points: 10,
        difficulty: 'EASY',
      },
      {
        unitId: unit6.id,
        type: 'FILL_BLANK',
        question: 'The past tense of دَعَا (to call) for هو shows the final و changing to ___.',
        correctAnswer: 'ى',
        explanation: 'The final و after fatha becomes ى (alif maqṣūrah): دَعَوَ → دَعَا.',
        points: 10,
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'TRUE_FALSE',
        question: 'In Nāqiṣ verbs, the final weak letter drops before the feminine تْ ending.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes, as in دَعَتْ (she called), where the و is dropped before تْ.',
        points: 10,
        difficulty: 'MEDIUM',
      },
    ],
  });

  // Quiz Questions for Unit 7
  await prisma.question.createMany({
    data: [
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        question: 'Lafeef Mafrūq verbs have weak letters in which positions?',
        options: JSON.stringify(['1st and 2nd', '2nd and 3rd', '1st and 3rd', 'All three']),
        correctAnswer: '1st and 3rd',
        explanation: 'Lafeef Mafrūq (separated) has weak letters in the 1st and 3rd positions, like وَفَى (و-ف-ي).',
        points: 10,
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        question: 'The verb وَقَى follows rules of which TWO weak verb types?',
        options: JSON.stringify(['Mithal and Ajwaf', 'Mithal and Nāqiṣ', 'Ajwaf and Nāqiṣ', 'Only Lafeef']),
        correctAnswer: 'Mithal and Nāqiṣ',
        explanation: 'Lafeef Mafrūq verbs combine Mithal rules (1st radical) and Nāqiṣ rules (3rd radical).',
        points: 10,
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'FILL_BLANK',
        question: 'The command form of وَفَى for أنتَ is ___.',
        correctAnswer: 'فِ',
        explanation: 'Both weak letters drop in the command: وَفَى → فِ (fulfill!).',
        points: 10,
        difficulty: 'HARD',
      },
    ],
  });

  // Quiz Questions for Unit 8
  await prisma.question.createMany({
    data: [
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        question: 'What is the first step in analyzing any Arabic verb?',
        options: JSON.stringify(['Identify the form', 'Identify the root', 'Check for weakness', 'Conjugate it']),
        correctAnswer: 'Identify the root',
        explanation: 'First identify the three consonant root letters (الجذر), then determine the form and type.',
        points: 10,
        difficulty: 'EASY',
      },
      {
        unitId: unit8.id,
        type: 'TRUE_FALSE',
        question: 'Form II and Form IV both can express causation, but they are not interchangeable.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'While both can be causative, they have different nuances and are used with different roots.',
        points: 10,
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        question: 'Which saying emphasizes the importance of Sarf for understanding the Quran?',
        options: JSON.stringify([
          'من أراد أن يفهم القرآن فليتقن الصرف',
          'الصرف سهل للجميع',
          'النحو أهم من الصرف',
          'لا حاجة للصرف'
        ]),
        correctAnswer: 'من أراد أن يفهم القرآن فليتقن الصرف',
        explanation: 'This saying means: "Whoever wants to understand the Quran, let him master Sarf."',
        points: 10,
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created quiz questions for all units');

  // Arabic Terms for the course
  await prisma.arabicTerm.createMany({
    data: [
      // Unit 1 terms
      {
        unitId: unit1.id,
        arabicText: 'علم الصرف',
        transliteration: "'ilm aṣ-ṣarf",
        translation: 'The science of morphology',
      },
      {
        unitId: unit1.id,
        arabicText: 'الجذر',
        transliteration: 'al-jadhr',
        translation: 'The root (three consonant letters)',
      },
      {
        unitId: unit1.id,
        arabicText: 'الميزان الصرفي',
        transliteration: 'al-mīzān aṣ-ṣarfī',
        translation: 'The morphological scale (فَعَلَ)',
      },
      {
        unitId: unit1.id,
        arabicText: 'فاء الكلمة',
        transliteration: "fā' al-kalimah",
        translation: 'First radical letter',
      },
      {
        unitId: unit1.id,
        arabicText: 'عين الكلمة',
        transliteration: "'ayn al-kalimah",
        translation: 'Second radical letter',
      },
      {
        unitId: unit1.id,
        arabicText: 'لام الكلمة',
        transliteration: 'lām al-kalimah',
        translation: 'Third radical letter',
      },
      // Unit 2-3 terms
      {
        unitId: unit2.id,
        arabicText: 'الأوزان العشرة',
        transliteration: 'al-awzān al-'asharah',
        translation: 'The ten verb forms',
      },
      {
        unitId: unit2.id,
        arabicText: 'التضعيف',
        transliteration: 'at-taḍ'īf',
        translation: 'Doubling/intensification (شدة)',
      },
      {
        unitId: unit2.id,
        arabicText: 'المفاعلة',
        transliteration: 'al-mufā'alah',
        translation: 'Reciprocity/mutual action',
      },
      {
        unitId: unit3.id,
        arabicText: 'التكلف',
        transliteration: 'at-takalluf',
        translation: 'Pretending/affecting',
      },
      // Unit 4-6 terms (weak verbs)
      {
        unitId: unit4.id,
        arabicText: 'الفعل المعتل',
        transliteration: 'al-fi'l al-mu'tall',
        translation: 'Weak verb (contains و، ي، or ا)',
      },
      {
        unitId: unit4.id,
        arabicText: 'الفعل الصحيح',
        transliteration: 'al-fi'l aṣ-ṣaḥīḥ',
        translation: 'Sound verb (no weak letters)',
      },
      {
        unitId: unit4.id,
        arabicText: 'المثال',
        transliteration: 'al-mithāl',
        translation: 'Assimilated verb (1st radical weak)',
      },
      {
        unitId: unit5.id,
        arabicText: 'الأجوف',
        transliteration: 'al-ajwaf',
        translation: 'Hollow verb (2nd radical weak)',
      },
      {
        unitId: unit6.id,
        arabicText: 'الناقص',
        transliteration: 'an-nāqiṣ',
        translation: 'Defective verb (3rd radical weak)',
      },
      {
        unitId: unit6.id,
        arabicText: 'الألف المقصورة',
        transliteration: 'al-alif al-maqṣūrah',
        translation: 'Shortened alif (ى)',
      },
      // Unit 7 terms
      {
        unitId: unit7.id,
        arabicText: 'اللفيف',
        transliteration: 'al-lafīf',
        translation: 'Doubly weak verb',
      },
      {
        unitId: unit7.id,
        arabicText: 'اللفيف المقرون',
        transliteration: 'al-lafīf al-maqrūn',
        translation: 'Contiguous doubly weak (2nd & 3rd weak)',
      },
      {
        unitId: unit7.id,
        arabicText: 'اللفيف المفروق',
        transliteration: 'al-lafīf al-mafrūq',
        translation: 'Separated doubly weak (1st & 3rd weak)',
      },
      // Unit 8 terms
      {
        unitId: unit8.id,
        arabicText: 'التصريف',
        transliteration: 'at-taṣrīf',
        translation: 'Conjugation/inflection',
      },
      {
        unitId: unit8.id,
        arabicText: 'الماضي',
        transliteration: 'al-māḍī',
        translation: 'Past tense',
      },
      {
        unitId: unit8.id,
        arabicText: 'المضارع',
        transliteration: 'al-muḍāri'',
        translation: 'Present/future tense',
      },
      {
        unitId: unit8.id,
        arabicText: 'الأمر',
        transliteration: 'al-amr',
        translation: 'Command/imperative',
      },
      {
        unitId: unit8.id,
        arabicText: 'المجزوم',
        transliteration: 'al-majzūm',
        translation: 'Jussive mood',
      },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  console.log('');
  console.log('🎉 Sarf course completely finalized!');
  console.log('📊 Final Summary:');
  console.log('   - 8 comprehensive units');
  console.log('   - 30+ quiz questions');
  console.log('   - 24+ Arabic terms with transliterations');
  console.log('   - Covers all verb forms (I-X)');
  console.log('   - Covers all weak verb types');
  console.log('   - Practice exercises throughout');
  console.log('');
}

async function main() {
  try {
    await seedSarfCoursePart5();
    console.log('✨ Sarf course seed Part 5 (Final) completed successfully!');
    console.log('');
    console.log('📝 To load the complete course, run these commands in order:');
    console.log('   1. ts-node prisma/seed-sarf-course.ts');
    console.log('   2. ts-node prisma/seed-sarf-course-part2.ts');
    console.log('   3. ts-node prisma/seed-sarf-course-part3.ts');
    console.log('   4. ts-node prisma/seed-sarf-course-part4.ts');
    console.log('   5. ts-node prisma/seed-sarf-course-part5.ts');
    console.log('');
  } catch (error) {
    console.error('❌ Error seeding Sarf course Part 5:', error);
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
