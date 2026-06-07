import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type MasaarUnit = {
  week: number;
  englishTitle: string;
  arabicTitle: string;
  passageTopicEn: string;
  passageTopicAr: string;
  translationSummary: string;
  grammarPoints: string[];
};

const MASAAR_COURSE_ID = 'a1b2c3d4-e5f6-4890-abcd-ef1234567001';
const LESSON_BASE_PATH = '/lessons/masaar-irab-sarf';
const LESSON_PUBLIC_ORIGIN = 'https://learn.hrasheed.net';

const masaarUnits: MasaarUnit[] = [
  {
    week: 1,
    englishTitle: "Foundations of I'rab",
    arabicTitle: 'أساسيات الإعراب',
    passageTopicEn: 'Definitions of fiqh and usul with opening technical vocabulary from Usul al-Shashi.',
    passageTopicAr: 'تعريف الفقه وأصوله من افتتاح أصول الشاشي مع تدريب على المصطلحات الأولى.',
    translationSummary:
      'Fiqh is presented as understanding practical divine rulings from detailed evidences, while usul al-fiqh names the principles that make disciplined deduction possible.',
    grammarPoints: [
      'Differentiate اسم أنَّ from an ordinary مبتدأ/خبر structure while tracking how definition clauses shift function.',
      'Review the core divisions of الإعراب so case endings are read as meaning-bearing signals, not decoration.',
      'Warm up with فَعِلَ يَفْعَلُ and the أجوف واوي pattern in قَالَ to recognize vowel changes inside the passage.',
    ],
  },
  {
    week: 2,
    englishTitle: 'The Quran as Evidence',
    arabicTitle: 'الكتاب كدليل شرعي',
    passageTopicEn: 'The Quran as legal proof, with attention to textual indication and derivation of rulings.',
    passageTopicAr: 'الكتاب بوصفه دليلاً شرعياً مع النظر في دلالة الألفاظ وطرق استنباط الحكم.',
    translationSummary:
      'The lesson frames the Quran as a binding source of law whose wording, indication, and qualifying context guide how jurists derive rulings responsibly.',
    grammarPoints: [
      'Practice المبني للمجهول so you can identify when the doer is suppressed and meaning shifts to the action itself.',
      'Separate الفاعل from المفعول به in dense legal prose where word order may feel less familiar than textbook examples.',
      'Use نائب الفاعل patterns to read passive legal statements without losing syntactic control of the sentence.',
    ],
  },
  {
    week: 3,
    englishTitle: 'The Prophetic Tradition',
    arabicTitle: 'السنة ومراتبها',
    passageTopicEn: 'Categories of Sunnah transmission and how their ranks affect evidentiary force.',
    passageTopicAr: 'مراتب السنة من حيث النقل وأثر ذلك في قوة الاستدلال والاحتجاج.',
    translationSummary:
      'The Sunnah is studied as an explanatory and authoritative source whose categories—mutawatir, mashhur, and ahad—shape legal confidence and application.',
    grammarPoints: [
      'Drill أفعال المثال to catch weak-initial verbs before they disappear behind familiar surface forms.',
      'Stabilize المبتدأ والخبر analysis so classificatory statements about hadith ranks read cleanly and quickly.',
      'Track nominal sentence balance when descriptive clauses stack in succession across usul terminology.',
    ],
  },
  {
    week: 4,
    englishTitle: 'Commands & Prohibitions',
    arabicTitle: 'الأمر والنهي',
    passageTopicEn: 'Default legal force of command and prohibition, and the contextual clues that redirect them.',
    passageTopicAr: 'دلالة الأمر والنهي في الأصل وما يصرفهما إلى الندب أو الإباحة أو غير ذلك بالقرائن.',
    translationSummary:
      'An unrestricted command points to obligation and an unrestricted prohibition points to refraining, unless context introduces a valid indicator that redirects the force.',
    grammarPoints: [
      'Build imperative and prohibitive forms across sound, hollow, and defective verbs to support live reading.',
      'Recognize كان وأخواتها and how they reassign the case roles inside doctrinal definitions.',
      'Use الناسخ analysis to distinguish the default usul rule from the contextual exception attached to it.',
    ],
  },
  {
    week: 5,
    englishTitle: 'General & Specific',
    arabicTitle: 'العام والخاص',
    passageTopicEn: 'General wording, scope, and the legal mechanisms that specify and narrow it.',
    passageTopicAr: 'ألفاظ العموم في النصوص والطرق التي يثبت بها التخصيص وتقييد سعة اللفظ.',
    translationSummary:
      'General wording includes every member of a class until a valid specification narrows the scope, so careful syntax becomes essential for legal precision.',
    grammarPoints: [
      'Review hollow verb behavior again so weakened middles do not distract from scope analysis in the text.',
      'Use إنَّ وأخواتها to identify emphatic framing and the accusative noun / nominative predicate relationship.',
      'Read specification statements by tracing how particles and clause structure restrict what looked universal at first glance.',
    ],
  },
  {
    week: 6,
    englishTitle: 'Unrestricted & Restricted',
    arabicTitle: 'المطلق والمقيد',
    passageTopicEn: 'How unrestricted expressions are qualified when another proof supplies a relevant restriction.',
    passageTopicAr: 'ضوابط حمل المطلق على المقيد إذا ورد دليل آخر بقيد معتبر يغيّر سعة اللفظ.',
    translationSummary:
      'An unrestricted expression remains open until a related proof introduces a qualifying description that legitimately carries the wording into a restricted reading.',
    grammarPoints: [
      'Drill defective verbs and the dropping of weak letters in jussive and imperative forms before reading.',
      'Connect the lesson to الحال والتمييز so descriptive clarification and specification are felt syntactically.',
      'Use broader المنصوبات awareness to tell true restrictions apart from nearby explanatory accusatives.',
    ],
  },
  {
    week: 7,
    englishTitle: 'Ambiguous & Clarified',
    arabicTitle: 'المجمل والمبيّن',
    passageTopicEn: 'Ambiguous wording and the forms of clarification that expose the intended ruling.',
    passageTopicAr: 'المجمل الذي يحتاج إلى بيان ووجوه التوضيح التي تكشف المراد من النص.',
    translationSummary:
      'Ambiguous wording must be clarified before it can govern action, and the Quran and Sunnah work together to unveil intended meanings with precision.',
    grammarPoints: [
      'Practice اللفيف and المضاعف forms so unusual weak-letter behavior does not slow advanced parsing.',
      'Use الإضافة to read tightly packed technical phrases where meaning hangs on ownership, linkage, and restriction.',
      'Track مجرورات carefully because clarification often arrives in attached phrases rather than separate sentences.',
    ],
  },
  {
    week: 8,
    englishTitle: 'Analogy & Independent Reasoning',
    arabicTitle: 'القياس والاجتهاد',
    passageTopicEn: 'Capstone treatment of qiyas, its pillars, and disciplined ijtihad in extending rulings.',
    passageTopicAr: 'خاتمة في القياس والاجتهاد تشرح الأصل والفرع والعلة والحكم ومسالك النظر المنضبط.',
    translationSummary:
      'Qiyas extends a ruling from an original case to a new case through a shared effective cause, while ijtihad applies that method with discipline and restraint.',
    grammarPoints: [
      'Work through a mixed morphology review spanning sound, weak, doubled, and defective verbs with minimal prompting.',
      'Perform full-sentence I\'rab so each pillar of qiyas is located syntactically before it is discussed conceptually.',
      'Read capstone legal reasoning by keeping cause, original case, derivative case, and ruling distinct in both grammar and meaning.',
    ],
  },
];

function buildUnitContent(unit: MasaarUnit): string {
  const lessonPath = `${LESSON_BASE_PATH}/week-${unit.week}.html`;
  const lessonUrl = `${LESSON_PUBLIC_ORIGIN}${lessonPath}`;
  const grammarList = unit.grammarPoints.map((point) => `<li>${point}</li>`).join('');

  return `
    <section class="lesson-summary masaar-unit-summary">
      <h2>Week ${unit.week} — ${unit.englishTitle}</h2>
      <p dir="rtl" lang="ar"><strong>موضوع النص:</strong> ${unit.passageTopicAr}</p>
      <p><strong>English translation:</strong> ${unit.translationSummary}</p>
      <p><strong>Reading focus:</strong> ${unit.passageTopicEn}</p>
      <ul>
        ${grammarList}
      </ul>
      <p><strong>Lesson URL:</strong> <a href="${lessonPath}" target="_blank" rel="noopener noreferrer">${lessonUrl}</a></p>
      <p><a href="${lessonPath}" target="_blank" rel="noopener noreferrer"><strong>Open Full Interactive Lesson →</strong></a></p>
    </section>
  `.trim();
}

export async function seedMasaarCourse() {
  console.log("📚 Starting al-Masār: I'rab & Sarf course seed...");
  console.log('');

  const course = await prisma.course.upsert({
    where: { id: MASAAR_COURSE_ID },
    update: {
      title: "al-Masār: I'rab & Sarf — Reading Classical Arabic",
      description:
        "A comprehensive 8-week course integrating I'rab (grammatical case analysis) and Sarf (morphology) through reading passages from Usul al-Shashi, with grammar connections from Qatr al-Nada.",
      category: 'ARABIC',
      ageLevels: ['TEEN', 'ADULT'],
      isPublished: true,
    },
    create: {
      id: MASAAR_COURSE_ID,
      title: "al-Masār: I'rab & Sarf — Reading Classical Arabic",
      description:
        "A comprehensive 8-week course integrating I'rab (grammatical case analysis) and Sarf (morphology) through reading passages from Usul al-Shashi, with grammar connections from Qatr al-Nada.",
      category: 'ARABIC',
      ageLevels: ['TEEN', 'ADULT'],
      isPublished: true,
    },
  });

  console.log(`✅ Upserted course: ${course.title}`);
  console.log('🧱 Upserting weekly units...');

  for (const unit of masaarUnits) {
    const content = buildUnitContent(unit);

    await prisma.unit.upsert({
      where: {
        courseId_orderIndex: {
          courseId: course.id,
          orderIndex: unit.week - 1,
        },
      },
      update: {
        title: `Week ${unit.week} — ${unit.englishTitle}`,
        description: `${unit.arabicTitle} | Interactive lesson summary with full HTML workbook link`,
        content,
      },
      create: {
        courseId: course.id,
        orderIndex: unit.week - 1,
        title: `Week ${unit.week} — ${unit.englishTitle}`,
        description: `${unit.arabicTitle} | Interactive lesson summary with full HTML workbook link`,
        content,
      },
    });

    console.log(`✅ Upserted Unit ${unit.week - 1}: Week ${unit.week} — ${unit.englishTitle}`);
  }

  console.log('');
  console.log("🎉 al-Masār course shell seed completed!");
  console.log('📊 Summary:');
  console.log("   - 1 Course: al-Masār: I'rab & Sarf — Reading Classical Arabic");
  console.log('   - 8 Units (Weeks 1-8) with linked HTML lesson summaries');
}

async function main() {
  try {
    await seedMasaarCourse();
    console.log("✨ al-Masār course seed completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding al-Masār course:", error);
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
