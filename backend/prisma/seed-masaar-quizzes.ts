import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedMasaarQuizzes() {
  console.log("📝 Adding al-Masār I'rab & Sarf quizzes...");
  console.log('');

  const course = await prisma.course.findUnique({
    where: { id: 'masaar-irab-sarf' },
    include: { units: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!course || course.units.length === 0) {
    console.log("⚠️  al-Masār course not found. Run seed-masaar-course.ts first.");
    return;
  }

  if (course.units.length < 8) {
    console.log(`⚠️  Expected 8 units for al-Masār, found ${course.units.length}.`);
    return;
  }

  console.log(`✅ Found al-Masār course with ${course.units.length} units`);

  const [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8] = course.units;

  await prisma.question.deleteMany({
    where: { unitId: { in: course.units.map((u) => u.id) } },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In the sentence "حضرَ الطالبُ الدرسَ"، which word is مرفوع؟',
        options: JSON.stringify(['الطالبُ', 'الدرسَ', 'حضرَ', 'جميعها']),
        correctAnswer: 'الطالبُ',
        explanation:
          'الطالبُ is the فاعل, and the فاعل is always in the nominative (مرفوع) state. Its visible sign is the ḍammah at the end.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] Which phrase shows a noun in the مجرور state?',
        options: JSON.stringify(['في المسجدِ', 'رأيتُ الطالبَ', 'جاء المعلمُ', 'كان الجوُّ']),
        correctAnswer: 'في المسجدِ',
        explanation:
          'After the preposition في, the noun becomes مجرور. المسجدِ carries kasrah, which is the basic sign of الجر.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "رأيتُ معلماً"، the word "معلماً" is:',
        options: JSON.stringify(['فاعل', 'مفعول به منصوب', 'مبتدأ', 'مضاف إليه']),
        correctAnswer: 'مفعول به منصوب',
        explanation:
          'معلماً receives the action of seeing, so it is the direct object (مفعول به). The direct object is منصوب, here marked by fatḥatayn.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "المسلمون صادقون"، what is the sign of رفع on "المسلمون"؟',
        options: JSON.stringify(['الضمة', 'الواو', 'الياء', 'الفتحة']),
        correctAnswer: 'الواو',
        explanation:
          'المسلمون is جمع مذكر سالم. Its nominative sign is wāw, not ḍammah, which is one of the key signs students must recognize.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] Which word is an example of مزيد rather than مجرد؟',
        options: JSON.stringify(['كتب', 'علم', 'أكرم', 'جلس']),
        correctAnswer: 'أكرم',
        explanation:
          'أكرم is on Form IV and includes an added hamzah, so it is مزيد. The others are basic three-letter roots in their mujarrad pattern.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the root (الجذر) of "استغفر"؟',
        options: JSON.stringify(['غ-ف-ر', 'س-ت-غ', 'ا-س-ت', 'غ-ر-ف']),
        correctAnswer: 'غ-ف-ر',
        explanation:
          'استغفر has added letters from the pattern استفعل, but its original radicals are غ ف ر. Root extraction removes augmentation and keeps core radicals.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] The verb "تعلّم" returns to which مجرد base root-pattern verb?',
        options: JSON.stringify(['عَلِمَ', 'عَلَّمَ', 'أَعْلَمَ', 'تَعَالَمَ']),
        correctAnswer: 'عَلِمَ',
        explanation:
          'تعلّم is a derived form based on the root ع-ل-م. Returning to the mujarrad base gives عَلِمَ as the simplest core form.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] In the word "مستخرج"، which set represents the added letters?',
        options: JSON.stringify(['م-س-ت', 'خ-ر-ج', 'س-خ-ر', 'م-خ-ج']),
        correctAnswer: 'م-س-ت',
        explanation:
          'مستخرج comes from خ-ر-ج with the pattern مستفعل. The letters م س ت are additional while خ ر ج remain the root radicals.',
        difficulty: 'EASY',
      },
    ],
  });
  console.log('✅ Added 8 questions for Unit 1');

  await prisma.question.createMany({
    data: [
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "كَتَبَ الطالبُ الدرسَ"، who is the فاعل؟',
        options: JSON.stringify(['الطالبُ', 'الدرسَ', 'كتبَ', 'لا يوجد']),
        correctAnswer: 'الطالبُ',
        explanation:
          'The doer of the action "wrote" is الطالبُ, so it is the فاعل. The فاعل is مرفوع and appears with ḍammah here.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "كُتِبَ الدرسُ"، the word "الدرسُ" is:',
        options: JSON.stringify(['فاعل', 'نائب الفاعل', 'مفعول به', 'حال']),
        correctAnswer: 'نائب الفاعل',
        explanation:
          'The verb is passive, so the original object is raised to become نائب الفاعل. Therefore الدرسُ is مرفوع as the deputy subject.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] Which sentence is in the passive voice (مبني للمجهول)؟',
        options: JSON.stringify(['فتحَ الحارسُ البابَ', 'فُتِحَ البابُ', 'يحفظُ الطالبُ الدرسَ', 'سافرَ التاجرُ']),
        correctAnswer: 'فُتِحَ البابُ',
        explanation:
          'فُتِحَ follows the passive pattern in the past tense and omits the named doer. البابُ then appears as نائب الفاعل.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "أكرمَ المعلمُ الطالبَ"، what is "الطالبَ"؟',
        options: JSON.stringify(['مبتدأ', 'نائب فاعل', 'مفعول به', 'خبر']),
        correctAnswer: 'مفعول به',
        explanation:
          'الطالبَ receives the action of honoring, so it is the direct object. The direct object is منصوب, shown here with fatḥah.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the passive past form of "عَلِمَ"؟',
        options: JSON.stringify(['عَلَّمَ', 'عُلِمَ', 'يُعْلَمُ', 'عَالَمَ']),
        correctAnswer: 'عُلِمَ',
        explanation:
          'In strong triliteral verbs, passive past commonly takes the pattern فُعِلَ. Thus عَلِمَ becomes عُلِمَ in the passive.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the passive present form of "عَلِمَ"؟',
        options: JSON.stringify(['يَعْلَمُ', 'يُعْلَمُ', 'أَعْلَمُ', 'يَعْلِمُ']),
        correctAnswer: 'يُعْلَمُ',
        explanation:
          'The passive present of Form I follows يُفْعَلُ in many strong verbs. Therefore the correct passive present is يُعْلَمُ.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] The passive past of the hollow verb "قالَ" is:',
        options: JSON.stringify(['قَالَ', 'قِيلَ', 'يُقَالُ', 'قُولَ']),
        correctAnswer: 'قِيلَ',
        explanation:
          'Hollow verbs show vowel transformation in passive forms. قالَ becomes قِيلَ in the passive past by established سماعي pattern.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] The passive present of "قالَ" is:',
        options: JSON.stringify(['يَقُولُ', 'يُقَالُ', 'يُقْوَلُ', 'يَقَالُ']),
        correctAnswer: 'يُقَالُ',
        explanation:
          'For the hollow verb قال, the passive present is يُقَالُ. This matches the well-known pair قِيلَ / يُقَالُ taught for passive hollow patterns.',
        difficulty: 'EASY',
      },
    ],
  });
  console.log('✅ Added 8 questions for Unit 2');

  await prisma.question.createMany({
    data: [
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "في المسجدِ إمامٌ قائمٌ"، which part is الخبر المقدّم؟',
        options: JSON.stringify(['في المسجدِ', 'إمامٌ', 'قائمٌ', 'لا يوجد خبر']),
        correctAnswer: 'في المسجدِ',
        explanation:
          'The prepositional phrase comes first and functions as the predicate, so it is خبر مقدّم. إمامٌ is the delayed subject (مبتدأ مؤخر).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "العلمُ نافعٌ لأهله"، what is the مبتدأ؟',
        options: JSON.stringify(['العلمُ', 'نافعٌ', 'لأهله', 'أهله']),
        correctAnswer: 'العلمُ',
        explanation:
          'The sentence begins with العلمُ, which is the topic being described. It is therefore the مبتدأ and is مرفوع.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "للطالبِ كتابٌ جديدٌ"، what is "كتابٌ"؟',
        options: JSON.stringify(['خبر مقدّم', 'مبتدأ مؤخر', 'مفعول به', 'اسم كان']),
        correctAnswer: 'مبتدأ مؤخر',
        explanation:
          'للطالبِ is the fronted predicate (خبر مقدّم). كتابٌ is the postponed مبتدأ, so it remains مرفوع.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "زيدٌ أبوه قائمٌ"، the خبر of "زيدٌ" is:',
        options: JSON.stringify(['أبوه', 'قائمٌ', 'الجملة الاسمية "أبوه قائمٌ"', 'لا خبر']),
        correctAnswer: 'الجملة الاسمية "أبوه قائمٌ"',
        explanation:
          'Sometimes the khabar is a full nominal sentence. Here "أبوه قائمٌ" together completes the meaning of زيدٌ, so it is the الخبر.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the present tense (مضارع) of "وَعَدَ"؟',
        options: JSON.stringify(['يَوْعِدُ', 'يَعِدُ', 'وَعِدَ', 'يُوعِدُ']),
        correctAnswer: 'يَعِدُ',
        explanation:
          'وعد is a مثال واوي verb, and its initial wāw drops in common present usage. Thus the correct form is يَعِدُ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the imperative (أمر) form for singular masculine from "وَعَدَ"؟',
        options: JSON.stringify(['وَعِدْ', 'عِدْ', 'يَعِدْ', 'أَوْعِدْ']),
        correctAnswer: 'عِدْ',
        explanation:
          'The imperative is formed from the jussive present, and the weak initial wāw is dropped. This yields the concise command عِدْ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] Why does the initial واو drop in forms like "يَعِدُ"؟',
        options: JSON.stringify([
          'Because the verb is always passive',
          'Because it is a proper noun',
          'Because it is مثال واوي with a kasrah pattern in the present',
          'Because Arabic forbids initial واو in all verbs',
        ]),
        correctAnswer: 'Because it is مثال واوي with a kasrah pattern in the present',
        explanation:
          'In many مثال واوي verbs, the initial wāw is omitted in certain present and imperative patterns. The kasrah environment helps trigger this established conjugational behavior.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] The verb "وَصَلَ" is classified as:',
        options: JSON.stringify(['أجوف', 'ناقص', 'مثال واوي', 'مضاعف']),
        correctAnswer: 'مثال واوي',
        explanation:
          'A verb with a weak first radical is called مثال. Since the first radical here is wāw, it is specifically مثال واوي.',
        difficulty: 'MEDIUM',
      },
    ],
  });
  console.log('✅ Added 8 questions for Unit 3');

  await prisma.question.createMany({
    data: [
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "كانَ الجوُّ معتدلاً"، what is اسم كان؟',
        options: JSON.stringify(['كانَ', 'الجوُّ', 'معتدلاً', 'الجوَّ']),
        correctAnswer: 'الجوُّ',
        explanation:
          'كان and its sisters raise their subject and lower their predicate. So الجوُّ is اسم كان and stays مرفوع.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "كانَ الجوُّ معتدلاً"، what is خبر كان؟',
        options: JSON.stringify(['الجوُّ', 'كانَ', 'معتدلاً', 'لا يوجد']),
        correctAnswer: 'معتدلاً',
        explanation:
          'The descriptive part after كان is its predicate. خبر كان is منصوب, and معتدلاً carries the accusative ending.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] Which particle is a جازم that makes one present verb majzūm?',
        options: JSON.stringify(['لن', 'لم', 'سوف', 'إنَّ']),
        correctAnswer: 'لم',
        explanation:
          'لم is a jazm particle for one present verb and negates past meaning. It causes the following مضارع to become مجزوم.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "لم يكتبْ الطالبُ"، what is the sign of jazm on "يكتبْ"؟',
        options: JSON.stringify(['الضمة', 'الفتحة', 'السكون', 'حذف النون']),
        correctAnswer: 'السكون',
        explanation:
          'The verb is sound and singular, so its jazm sign is sukun. This is visible at the end of يكتبْ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the imperative of "كتبَ" (2nd person masculine singular)?',
        options: JSON.stringify(['اُكْتُبْ', 'اِكْتَبَ', 'يكتبْ', 'كُتِبَ']),
        correctAnswer: 'اُكْتُبْ',
        explanation:
          'For a sound triliteral, the imperative is built from the jussive present with hamzat al-waṣl. The correct command form is اُكْتُبْ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the imperative form of the hollow verb "قالَ"؟',
        options: JSON.stringify(['قَالْ', 'قُلْ', 'يَقُلْ', 'قِيلْ']),
        correctAnswer: 'قُلْ',
        explanation:
          'Hollow verbs contract in the imperative. قالَ gives قُلْ, preserving meaning while reflecting hollow-verb morphology.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the imperative of the defective verb "رَمَى"؟',
        options: JSON.stringify(['اِرْمِ', 'اِرْمِي', 'رَمْ', 'يَرْمِ']),
        correctAnswer: 'اِرْمِ',
        explanation:
          'Defective verbs often lose the final weak radical in jussive-like imperative formation. Hence رمى becomes اِرْمِ for direct command.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] Which statement about imperative formation is correct?',
        options: JSON.stringify([
          'All imperative verbs keep every weak letter',
          'Imperatives are always passive',
          'Weak verbs may drop or alter weak letters in command forms',
          'Imperatives are formed only from past tense',
        ]),
        correctAnswer: 'Weak verbs may drop or alter weak letters in command forms',
        explanation:
          'The command form depends on verb type and often mirrors jussive behavior. Hollow and defective verbs regularly show deletion or vowel shift in imperative.',
        difficulty: 'MEDIUM',
      },
    ],
  });
  console.log('✅ Added 8 questions for Unit 4');

  await prisma.question.createMany({
    data: [
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "إنَّ الطالبَ مجتهدٌ"، what is اسم إنَّ؟',
        options: JSON.stringify(['الطالبَ', 'مجتهدٌ', 'إنَّ', 'الطالبُ']),
        correctAnswer: 'الطالبَ',
        explanation:
          'إنَّ and its sisters make their noun منصوب and their predicate مرفوع. So الطالبَ is اسم إنَّ in the accusative.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] Which pair is correct regarding اسم إنّ and اسم كان؟',
        options: JSON.stringify([
          'اسم إنّ مرفوع، واسم كان منصوب',
          'اسم إنّ منصوب، واسم كان مرفوع',
          'Both are مجرور',
          'Both are منصوب',
        ]),
        correctAnswer: 'اسم إنّ منصوب، واسم كان مرفوع',
        explanation:
          'This contrast is foundational in nahw: إنّ lowers its noun while كان raises its noun. Remembering this avoids frequent parsing errors.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] Which particle from أخوات إنّ primarily indicates hope/expectation (ترجٍّ)؟',
        options: JSON.stringify(['لكنّ', 'ليت', 'لعلّ', 'كأنّ']),
        correctAnswer: 'لعلّ',
        explanation:
          'لعلّ is commonly used for hope, expectation, or fear depending on context. Grammatically it behaves like إنّ by making its noun منصوب.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "ليتَ الشبابَ يعودُ"، what is اسم ليت؟',
        options: JSON.stringify(['ليتَ', 'الشبابَ', 'يعودُ', 'الشبابُ']),
        correctAnswer: 'الشبابَ',
        explanation:
          'ليت is one of the sisters of إنّ, so its noun takes nasb. Therefore الشبابَ is correctly parsed as اسم ليت منصوب.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] The verb "صامَ" is:',
        options: JSON.stringify(['أجوف واوي', 'أجوف يائي', 'ناقص واوي', 'مثال واوي']),
        correctAnswer: 'أجوف واوي',
        explanation:
          'صامَ has a weak middle radical and its أصل is صَوَمَ, indicating wāw origin. That makes it an ajwaf wāwī verb.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the present form of "باعَ"؟',
        options: JSON.stringify(['يَبُوعُ', 'يَبِيعُ', 'يَبَاعُ', 'يَبْعُ']),
        correctAnswer: 'يَبِيعُ',
        explanation:
          'باعَ is ajwaf yāʾī, and in the present the middle weak radical appears as ي in this pattern. So the standard form is يَبِيعُ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the imperative of "باعَ" (you, singular masculine)?',
        options: JSON.stringify(['بِعْ', 'بِيعْ', 'بَعْ', 'اِبَعْ']),
        correctAnswer: 'بِعْ',
        explanation:
          'The imperative of this hollow verb contracts to a short form. For باعَ, the command is بِعْ with adjusted vowel and dropped long structure.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the imperative of "صامَ"؟',
        options: JSON.stringify(['صَامْ', 'صُمْ', 'صِمْ', 'اِصَامْ']),
        correctAnswer: 'صُمْ',
        explanation:
          'Like other hollow verbs, imperative formation causes contraction. The correct command from صامَ is صُمْ.',
        difficulty: 'MEDIUM',
      },
    ],
  });
  console.log('✅ Added 8 questions for Unit 5');

  await prisma.question.createMany({
    data: [
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "جاء الطالبُ مسرعًا"، what is "مسرعًا"؟',
        options: JSON.stringify(['تمييز', 'حال', 'مفعول مطلق', 'مبتدأ']),
        correctAnswer: 'حال',
        explanation:
          'حال describes the state of the subject at the time of the action. Here it explains how the student came: مسرعًا.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "اشتريتُ عشرين كتابًا"، what is "كتابًا"؟',
        options: JSON.stringify(['حال', 'تمييز', 'مفعول مطلق', 'اسم إنّ']),
        correctAnswer: 'تمييز',
        explanation:
          'After counted numbers like عشرين, the following noun clarifies the quantity. That clarifying role is تمييز منصوب.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "ضربتُه ضربًا شديدًا"، what is "ضربًا"؟',
        options: JSON.stringify(['حال', 'مفعول به', 'مفعول مطلق', 'خبر']),
        correctAnswer: 'مفعول مطلق',
        explanation:
          'مفعول مطلق is a verbal noun from the same root used to emphasize or quantify the action. ضربًا matches the verb ضربتُ and serves this function.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "ازداد المؤمنُ إيمانًا"، the word "إيمانًا" is best analyzed as:',
        options: JSON.stringify(['حال', 'تمييز', 'مضاف إليه', 'نائب فاعل']),
        correctAnswer: 'تمييز',
        explanation:
          'The increase needs clarification of what increased. إيمانًا removes ambiguity and functions as تمييز منصوب.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] The verb "دعا" is classified as:',
        options: JSON.stringify(['ناقص واوي', 'ناقص يائي', 'أجوف', 'مثال']),
        correctAnswer: 'ناقص واوي',
        explanation:
          'A verb with weak final radical is ناقص. Since the root ends with wāw origin (دعو), it is ناقص واوي.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the present tense of "رمى"؟',
        options: JSON.stringify(['يَرْمُو', 'يَرْمِي', 'يَرْمَى', 'يَرْمَأُ']),
        correctAnswer: 'يَرْمِي',
        explanation:
          'رمى is ناقص يائي, and its present commonly shows yāʾ at the end. Therefore يَرْمِي is the correct conjugation.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] In jussive after "لم"، what is the correct form: ______ (from يدعو).',
        options: JSON.stringify(['لم يدعو', 'لم يدعُ', 'لم يدعى', 'لم يدعُو']),
        correctAnswer: 'لم يدعُ',
        explanation:
          'In the jussive of a defective verb, the final weak letter is dropped. So يدعو becomes يدعُ after لم.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] In jussive after "لم"، what is the correct form from "يرمي"؟',
        options: JSON.stringify(['لم يرمي', 'لم يرمِ', 'لم يرمى', 'لم يرمو']),
        correctAnswer: 'لم يرمِ',
        explanation:
          'For ناقص يائي verbs, jussive removes the final weak letter. Thus يرمي changes to يرمِ after لم.',
        difficulty: 'MEDIUM',
      },
    ],
  });
  console.log('✅ Added 8 questions for Unit 6');

  await prisma.question.createMany({
    data: [
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "بابُ بيتِ الطالبِ"، what is "الطالبِ"؟',
        options: JSON.stringify(['مضاف', 'مضاف إليه', 'حال', 'تمييز']),
        correctAnswer: 'مضاف إليه',
        explanation:
          'In an iḍāfah chain, the second term is genitive as مضاف إليه. Here الطالبِ is governed by بيتِ and takes kasrah.',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "كتابُ طالبِ علمٍ نافعٌ"، how many مضاف إليه nouns are present in the chain?',
        options: JSON.stringify(['واحد', 'اثنان', 'ثلاثة', 'لا شيء']),
        correctAnswer: 'اثنان',
        explanation:
          'طالبِ is mudāf ilayh to كتابُ, and علمٍ is mudāf ilayh to طالبِ. This creates a layered iḍāfah chain with two genitive nouns.',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] Which expression is a common example of إضافة لفظية?',
        options: JSON.stringify(['كتابُ الطالبِ', 'ضارِبُ زيدٍ', 'بابُ البيتِ', 'نورُ العلمِ']),
        correctAnswer: 'ضارِبُ زيدٍ',
        explanation:
          'إضافة لفظية often appears with active/passive participles mainly for phonetic/lightness purposes. "ضارِبُ زيدٍ" is a classic instructional example.',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] Which phrase best represents إضافة معنوية (ownership/specification)?',
        options: JSON.stringify(['ضارِبُ زيدٍ', 'مُكرِمُ الضيفِ', 'كتابُ الطالبِ', 'قائمُ الليلِ']),
        correctAnswer: 'كتابُ الطالبِ',
        explanation:
          'In إضافة معنوية, the relation gives clear possession or specification. "كتابُ الطالبِ" expresses meaningful attribution, not just phonetic linking.',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] The verb "وَقَى" is classified as:',
        options: JSON.stringify(['لفيف مفروق', 'لفيف مقرون', 'مضاعف', 'أجوف']),
        correctAnswer: 'لفيف مفروق',
        explanation:
          'وقى contains two weak radicals in first and last positions. Because they are separated, it is called لفيف مفروق.',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] What is the present tense of "وقى"؟',
        options: JSON.stringify(['يوقي', 'يقي', 'يقو', 'يواقي']),
        correctAnswer: 'يقي',
        explanation:
          'The weak initial radical drops in this conjugational pattern. The accepted present form is يقي.',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] Why does "مَدَّ" appear with shaddah in many forms?',
        options: JSON.stringify([
          'Because it is passive',
          'Because it is quadriliteral',
          'Because it is a مضاعف verb and the last two radicals merge by إدغام',
          'Because it contains hamzat al-qatʿ',
        ]),
        correctAnswer: 'Because it is a مضاعف verb and the last two radicals merge by إدغام',
        explanation:
          'In مضاعف verbs the second and third radicals are identical. Arabic often merges them through إدغام, represented by shaddah.',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] Which form shows فك الإدغام for the root م-د-د؟',
        options: JSON.stringify(['مَدَّ', 'يَمُدُّ', 'مَدَدْتُ', 'مُدَّ']),
        correctAnswer: 'مَدَدْتُ',
        explanation:
          'When certain suffixes are attached, the doubled consonant can separate. In مَدَدْتُ the underlying two د letters are explicitly shown (فك الإدغام).',
        difficulty: 'HARD',
      },
    ],
  });
  console.log('✅ Added 8 questions for Unit 7');

  await prisma.question.createMany({
    data: [
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "لَمَّا قِيلَ الحقُّ سكتَ المعاندُ"، what is "الحقُّ" in the passive clause?',
        options: JSON.stringify(['فاعل', 'نائب الفاعل', 'مفعول به', 'مضاف إليه']),
        correctAnswer: 'نائب الفاعل',
        explanation:
          'قِيلَ is passive, so the element spoken is raised as نائب الفاعل. Therefore الحقُّ is parsed as nominative deputy subject.',
        difficulty: 'HARD',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "في الفصلِ طلابُ علمٍ مجتهدون"، which word is the مبتدأ المؤخر؟',
        options: JSON.stringify(['في الفصلِ', 'طلابُ', 'علمٍ', 'مجتهدون']),
        correctAnswer: 'طلابُ',
        explanation:
          'The fronted phrase في الفصلِ serves as a contextual khabar element. The delayed nominative topic is طلابُ, while علمٍ is linked by iḍāfah.',
        difficulty: 'HARD',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "عادَ المجاهدُ صابرًا"، what is "صابرًا"؟',
        options: JSON.stringify(['حال', 'تمييز', 'مفعول مطلق', 'خبر كان']),
        correctAnswer: 'حال',
        explanation:
          'صابرًا describes the condition of the subject at return. This is the essential role of حال: a temporary state tied to the action.',
        difficulty: 'HARD',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[IRAB] In "كانَ طالبُ العلمِ ثابتًا"، the phrase "طالبُ العلمِ" is:',
        options: JSON.stringify(['خبر كان', 'اسم كان مركب إضافي', 'مفعول به', 'نائب فاعل']),
        correctAnswer: 'اسم كان مركب إضافي',
        explanation:
          'كان raises its noun, and here that noun is an iḍāfah phrase. طالبُ is the head noun and العلمِ is its mudāf ilayh, together forming اسم كان.',
        difficulty: 'HARD',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] The form "يَقِي" should be analyzed as:',
        options: JSON.stringify([
          'مضاعف with fixed shaddah',
          'لفيف مفروق with weak-letter adjustment in conjugation',
          'أجوف يائي passive',
          'ناقص واوي in past only',
        ]),
        correctAnswer: 'لفيف مفروق with weak-letter adjustment in conjugation',
        explanation:
          'يقي comes from وقى, a لفيف مفروق verb. Its conjugation reflects weak-letter behavior, including dropping/altering radicals in derived forms.',
        difficulty: 'HARD',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] In "لم يَدْعُ"، what explains the final shape of the verb?',
        options: JSON.stringify([
          'It is a strong verb with sukun only',
          'It is ناقص واوي and the final weak letter is dropped in jazm',
          'It is passive present',
          'It is built on fathah because of لم',
        ]),
        correctAnswer: 'It is ناقص واوي and the final weak letter is dropped in jazm',
        explanation:
          'The base form is يدعو, a defective verb ending in a weak radical. Under jazm with لم, that weak letter is removed, yielding يَدْعُ.',
        difficulty: 'HARD',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] The passive form "قِيلَ" is best described as:',
        options: JSON.stringify([
          'A strong triliteral passive with no change',
          'An imperative of a doubled verb',
          'Passive of an ajwaf verb with internal vowel transformation',
          'A noun, not a verb',
        ]),
        correctAnswer: 'Passive of an ajwaf verb with internal vowel transformation',
        explanation:
          'قِيلَ comes from قالَ, which is an ajwaf verb. In passive, hollow verbs undergo characteristic internal vowel change rather than simple pattern copying.',
        difficulty: 'HARD',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '[SARF] The verb form "مُدَّ" demonstrates which principle?',
        options: JSON.stringify([
          'Initial weak-letter dropping in مثال',
          'Idghām in a doubled verb where two identical radicals merge',
          'Final weak-letter deletion in ناقص',
          'No morphological process; it is irregular only',
        ]),
        correctAnswer: 'Idghām in a doubled verb where two identical radicals merge',
        explanation:
          'The root م-د-د is مضاعف because the second and third radicals are the same. Their merger is represented by shaddah, illustrating إدغام clearly.',
        difficulty: 'HARD',
      },
    ],
  });
  console.log('✅ Added 8 questions for Unit 8');

  console.log('');
  console.log("🎉 Successfully added al-Masār quiz questions!");
  console.log('📊 Summary:');
  console.log('   - 8 units seeded');
  console.log("   - 64 MULTIPLE_CHOICE questions (32 I'rab + 32 Sarf)");
  console.log('');
}

async function main() {
  try {
    await seedMasaarQuizzes();
  } catch (error) {
    console.error("❌ Error seeding al-Masār quizzes:", error);
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
