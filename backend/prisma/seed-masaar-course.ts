import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type MasaarUnit = {
  week: number;
  englishTitle: string;
  arabicTitle: string;
  passageTopicEn: string;
  passageTopicAr: string;
};

const MASAAR_COURSE_ID = 'masaar-irab-sarf';

const masaarUnits: MasaarUnit[] = [
  {
    week: 1,
    englishTitle: "Foundations of I'rab",
    arabicTitle: 'أساسيات الإعراب',
    passageTopicEn: "Usul al-Shashi opening foundations: defining legal indication and introducing core I'rab analysis habits for structured reading.",
    passageTopicAr: 'مدخل أصول الشاشي: تعريف الدلالة الشرعية وبناء عادات الإعراب الأساسية للقراءة المنهجية.',
  },
  {
    week: 2,
    englishTitle: 'The Quran as Evidence',
    arabicTitle: 'الكتاب كدليل شرعي',
    passageTopicEn: 'Usul al-Shashi on the Quran as a legal source: textual indication types and conditions for deriving rulings from the text.',
    passageTopicAr: 'باب الكتاب في أصول الشاشي: أنواع دلالات النص وشروط استنباط الأحكام من القرآن.',
  },
  {
    week: 3,
    englishTitle: 'The Prophetic Tradition',
    arabicTitle: 'السنة ومراتبها',
    passageTopicEn: 'Usul al-Shashi discussion of Sunnah categories (mutawatir, mashhur, ahad) and their evidentiary implications.',
    passageTopicAr: 'باب السنة ومراتبها في أصول الشاشي: المتواتر والمشهور والآحاد وأثرها في الاستدلال.',
  },
  {
    week: 4,
    englishTitle: 'Commands & Prohibitions',
    arabicTitle: 'الأمر والنهي',
    passageTopicEn: 'Usul al-Shashi treatment of command and prohibition language, with contextual indicators for obligation and permissibility.',
    passageTopicAr: 'باب الأمر والنهي في أصول الشاشي: دلالات الصيغ وقرائن الوجوب والإباحة.',
  },
  {
    week: 5,
    englishTitle: 'General & Specific',
    arabicTitle: 'العام والخاص',
    passageTopicEn: 'Usul al-Shashi section on general wording and specification mechanisms across legal texts.',
    passageTopicAr: 'باب العام والخاص في أصول الشاشي: ألفاظ العموم وطرائق التخصيص في النصوص.',
  },
  {
    week: 6,
    englishTitle: 'Unrestricted & Restricted',
    arabicTitle: 'المطلق والمقيد',
    passageTopicEn: 'Usul al-Shashi analysis of unrestricted and restricted expressions and when restriction carries across evidences.',
    passageTopicAr: 'باب المطلق والمقيد في أصول الشاشي: ضوابط حمل المطلق على المقيد بين الأدلة.',
  },
  {
    week: 7,
    englishTitle: 'Ambiguous & Clarified',
    arabicTitle: 'المجمل والمبيّن',
    passageTopicEn: 'Usul al-Shashi on ambiguity and clarification, including how Sunnah and Quran explain one another.',
    passageTopicAr: 'باب المجمل والمبين في أصول الشاشي: وجوه البيان وشرح النصوص بعضها ببعض.',
  },
  {
    week: 8,
    englishTitle: 'Analogy & Independent Reasoning',
    arabicTitle: 'القياس والاجتهاد',
    passageTopicEn: 'Usul al-Shashi capstone on qiyas and ijtihad: pillars of analogy and disciplined legal reasoning.',
    passageTopicAr: 'خاتمة القياس والاجتهاد في أصول الشاشي: أركان القياس ومسالك الاجتهاد المنضبط.',
  },
];

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
    await prisma.unit.upsert({
      where: {
        courseId_orderIndex: {
          courseId: course.id,
          orderIndex: unit.week - 1,
        },
      },
      update: {
        title: `Week ${unit.week} — ${unit.englishTitle}`,
        description: `${unit.arabicTitle} | Placeholder bilingual lesson shell`,
        content: `
          <section>
            <h2>Week ${unit.week} — ${unit.englishTitle}</h2>
            <div class="bilingual-text">
              <div class="arabic-original" dir="rtl" lang="ar">
                <p>${unit.passageTopicAr}</p>
              </div>
              <div class="english-translation">
                <p><em>[AI-Generated Translation]</em> ${unit.passageTopicEn}</p>
              </div>
            </div>
            <p><strong>Placeholder:</strong> Full five-part circuit content for this week will be added in subsequent seed files.</p>
          </section>
        `.trim(),
      },
      create: {
        courseId: course.id,
        orderIndex: unit.week - 1,
        title: `Week ${unit.week} — ${unit.englishTitle}`,
        description: `${unit.arabicTitle} | Placeholder bilingual lesson shell`,
        content: `
          <section>
            <h2>Week ${unit.week} — ${unit.englishTitle}</h2>
            <div class="bilingual-text">
              <div class="arabic-original" dir="rtl" lang="ar">
                <p>${unit.passageTopicAr}</p>
              </div>
              <div class="english-translation">
                <p><em>[AI-Generated Translation]</em> ${unit.passageTopicEn}</p>
              </div>
            </div>
            <p><strong>Placeholder:</strong> Full five-part circuit content for this week will be added in subsequent seed files.</p>
          </section>
        `.trim(),
      },
    });

    console.log(`✅ Upserted Unit ${unit.week - 1}: Week ${unit.week} — ${unit.englishTitle}`);
  }

  console.log('');
  console.log("🎉 al-Masār course shell seed completed!");
  console.log('📊 Summary:');
  console.log("   - 1 Course: al-Masār: I'rab & Sarf — Reading Classical Arabic");
  console.log('   - 8 Units (Weeks 1-8) with bilingual placeholder content');
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
