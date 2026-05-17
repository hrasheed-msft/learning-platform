/**
 * Seed Flashcards for Sarf Course
 * 
 * Creates flashcards for the first few units of the Sarf (Arabic Morphology) course
 */

import { PrismaClient, FlashCardDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSarfFlashcards() {
  console.log('🌱 Seeding Sarf Course Flashcards...\n');

  // Find the Sarf course
  const sarfCourse = await prisma.course.findFirst({
    where: {
      title: {
        contains: 'Sarf',
      },
    },
    include: {
      units: {
        orderBy: { orderIndex: 'asc' },
        take: 5, // First 5 units
      },
    },
  });

  if (!sarfCourse) {
    console.error('❌ Sarf course not found. Please run seed-sarf-simple.ts first.');
    return;
  }

  console.log(`✓ Found course: ${sarfCourse.title}`);
  console.log(`✓ Found ${sarfCourse.units.length} units\n`);

  let totalCreated = 0;

  // Unit 1: Introduction to Sarf - Basic Verb Forms
  if (sarfCourse.units[0]) {
    const unit1 = sarfCourse.units[0];
    console.log(`Creating flashcards for Unit 1: ${unit1.title}`);

    const unit1Cards = [
      {
        front: 'What is the Arabic word for morphology/conjugation?',
        frontArabic: 'ما هو الصرف؟',
        back: 'Sarf (صَرْف)',
        backArabic: 'صَرْف',
        category: 'terminology',
        difficulty: FlashCardDifficulty.EASY,
        tags: ['basic', 'terminology'],
      },
      {
        front: 'What is the root form of an Arabic verb called?',
        back: 'The three-letter root (الجذر الثلاثي)',
        backArabic: 'الجذر الثلاثي',
        category: 'terminology',
        difficulty: FlashCardDifficulty.EASY,
        tags: ['basic', 'root'],
      },
      {
        front: 'What are the three root letters of فَعَلَ?',
        frontArabic: 'ما هي الأحرف الأصلية لـ فَعَلَ؟',
        back: 'ف (faa), ع (ayn), ل (laam)',
        backArabic: 'ف، ع، ل',
        category: 'root-letters',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['root', 'letters'],
      },
      {
        front: 'Translate: فَعَلَ',
        frontArabic: 'فَعَلَ',
        back: 'He did/acted (past tense, 3rd person masculine singular)',
        backArabic: 'فعل (ماضي)',
        category: 'vocabulary',
        difficulty: FlashCardDifficulty.EASY,
        tags: ['past-tense', 'verb'],
      },
      {
        front: 'What is the present tense form of فَعَلَ for "he"?',
        frontArabic: 'ما هو المضارع من فَعَلَ للغائب؟',
        back: 'يَفْعَلُ (yaf\'alu)',
        backArabic: 'يَفْعَلُ',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['present-tense', 'verb'],
      },
      {
        front: 'How many standard verb patterns (أوزان) are there in Arabic?',
        back: 'Ten (10) patterns',
        backArabic: 'عشرة أوزان',
        category: 'patterns',
        difficulty: FlashCardDifficulty.EASY,
        tags: ['patterns', 'awzan'],
      },
    ];

    for (let i = 0; i < unit1Cards.length; i++) {
      await prisma.flashCard.create({
        data: {
          ...unit1Cards[i],
          courseId: sarfCourse.id,
          unitId: unit1.id,
          orderIndex: i,
        },
      });
      totalCreated++;
    }
    console.log(`  ✓ Created ${unit1Cards.length} flashcards\n`);
  }

  // Unit 2: Past Tense Conjugations
  if (sarfCourse.units[1]) {
    const unit2 = sarfCourse.units[1];
    console.log(`Creating flashcards for Unit 2: ${unit2.title}`);

    const unit2Cards = [
      {
        front: 'Conjugate فَعَلَ for "I" (past tense)',
        frontArabic: 'صرّف فَعَلَ للمتكلم',
        back: 'فَعَلْتُ (fa\'altu)',
        backArabic: 'فَعَلْتُ',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['past-tense', 'first-person'],
      },
      {
        front: 'Conjugate فَعَلَ for "you (masculine singular)" (past tense)',
        frontArabic: 'صرّف فَعَلَ للمخاطب المذكر',
        back: 'فَعَلْتَ (fa\'alta)',
        backArabic: 'فَعَلْتَ',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['past-tense', 'second-person'],
      },
      {
        front: 'Conjugate فَعَلَ for "she" (past tense)',
        frontArabic: 'صرّف فَعَلَ للغائبة',
        back: 'فَعَلَتْ (fa\'alat)',
        backArabic: 'فَعَلَتْ',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['past-tense', 'third-person', 'feminine'],
      },
      {
        front: 'Conjugate فَعَلَ for "they (masculine)" (past tense)',
        frontArabic: 'صرّف فَعَلَ للغائبين',
        back: 'فَعَلُوا (fa\'alū)',
        backArabic: 'فَعَلُوا',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.HARD,
        tags: ['past-tense', 'third-person', 'plural'],
      },
      {
        front: 'What is the past tense marker for "I" and "you"?',
        back: 'تُ (tu) for "I", تَ (ta) for "you (masc.)", تِ (ti) for "you (fem.)"',
        backArabic: 'تُ، تَ، تِ',
        category: 'grammar',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['past-tense', 'markers'],
      },
    ];

    for (let i = 0; i < unit2Cards.length; i++) {
      await prisma.flashCard.create({
        data: {
          ...unit2Cards[i],
          courseId: sarfCourse.id,
          unitId: unit2.id,
          orderIndex: i,
        },
      });
      totalCreated++;
    }
    console.log(`  ✓ Created ${unit2Cards.length} flashcards\n`);
  }

  // Unit 3: Present Tense Conjugations
  if (sarfCourse.units[2]) {
    const unit3 = sarfCourse.units[2];
    console.log(`Creating flashcards for Unit 3: ${unit3.title}`);

    const unit3Cards = [
      {
        front: 'Conjugate يَفْعَلُ for "I" (present tense)',
        frontArabic: 'صرّف يَفْعَلُ للمتكلم',
        back: 'أَفْعَلُ (af\'alu)',
        backArabic: 'أَفْعَلُ',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['present-tense', 'first-person'],
      },
      {
        front: 'Conjugate يَفْعَلُ for "you (masculine singular)" (present tense)',
        frontArabic: 'صرّف يَفْعَلُ للمخاطب المذكر',
        back: 'تَفْعَلُ (taf\'alu)',
        backArabic: 'تَفْعَلُ',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['present-tense', 'second-person'],
      },
      {
        front: 'Conjugate يَفْعَلُ for "she" (present tense)',
        frontArabic: 'صرّف يَفْعَلُ للغائبة',
        back: 'تَفْعَلُ (taf\'alu)',
        backArabic: 'تَفْعَلُ',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['present-tense', 'third-person', 'feminine'],
      },
      {
        front: 'What are the present tense prefixes for the three persons?',
        back: 'أ (alif) for "I", ت (taa) for "you/she", ي (yaa) for "he", ن (noon) for "we"',
        backArabic: 'أ، ت، ي، ن',
        category: 'grammar',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['present-tense', 'prefixes'],
      },
      {
        front: 'What is the present tense suffix for "they (masculine)"?',
        back: 'ون (ūna) - يَفْعَلُونَ',
        backArabic: 'ون',
        category: 'grammar',
        difficulty: FlashCardDifficulty.HARD,
        tags: ['present-tense', 'suffixes', 'plural'],
      },
    ];

    for (let i = 0; i < unit3Cards.length; i++) {
      await prisma.flashCard.create({
        data: {
          ...unit3Cards[i],
          courseId: sarfCourse.id,
          unitId: unit3.id,
          orderIndex: i,
        },
      });
      totalCreated++;
    }
    console.log(`  ✓ Created ${unit3Cards.length} flashcards\n`);
  }

  // Unit 4: Verb Forms (أوزان)
  if (sarfCourse.units[3]) {
    const unit4 = sarfCourse.units[3];
    console.log(`Creating flashcards for Unit 4: ${unit4.title}`);

    const unit4Cards = [
      {
        front: 'What is Form I (الوزن الأول) of the verb?',
        back: 'فَعَلَ - The basic, simple form',
        backArabic: 'فَعَلَ - الفعل المجرد',
        category: 'patterns',
        difficulty: FlashCardDifficulty.EASY,
        tags: ['form-1', 'patterns'],
      },
      {
        front: 'What is Form II (الوزن الثاني) pattern?',
        back: 'فَعَّلَ - Double middle letter (intensive/causative)',
        backArabic: 'فَعَّلَ - تضعيف العين',
        category: 'patterns',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['form-2', 'patterns'],
      },
      {
        front: 'What is Form III (الوزن الثالث) pattern?',
        back: 'فَاعَلَ - Long alif after first letter',
        backArabic: 'فَاعَلَ - المفاعلة',
        category: 'patterns',
        difficulty: FlashCardDifficulty.MEDIUM,
        tags: ['form-3', 'patterns'],
      },
      {
        front: 'What does Form II typically indicate?',
        back: 'Causative or intensive meaning (e.g., دَرَّسَ "to teach" from دَرَسَ "to study")',
        backArabic: 'التعدية أو التكثير',
        category: 'patterns',
        difficulty: FlashCardDifficulty.HARD,
        tags: ['form-2', 'meaning'],
      },
      {
        front: 'Give an example of Form III',
        back: 'كَاتَبَ (to correspond) from كَتَبَ (to write)',
        backArabic: 'كَاتَبَ من كَتَبَ',
        category: 'patterns',
        difficulty: FlashCardDifficulty.HARD,
        tags: ['form-3', 'examples'],
      },
    ];

    for (let i = 0; i < unit4Cards.length; i++) {
      await prisma.flashCard.create({
        data: {
          ...unit4Cards[i],
          courseId: sarfCourse.id,
          unitId: unit4.id,
          orderIndex: i,
        },
      });
      totalCreated++;
    }
    console.log(`  ✓ Created ${unit4Cards.length} flashcards\n`);
  }

  // Unit 5: Command Form (الأمر)
  if (sarfCourse.units[4]) {
    const unit5 = sarfCourse.units[4];
    console.log(`Creating flashcards for Unit 5: ${unit5.title}`);

    const unit5Cards = [
      {
        front: 'What is the command form (imperative) for "you (masc. sing.)" from فَعَلَ?',
        frontArabic: 'ما هو الأمر من فَعَلَ؟',
        back: 'اِفْعَلْ (if\'al)',
        backArabic: 'اِفْعَلْ',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.HARD,
        tags: ['imperative', 'command'],
      },
      {
        front: 'How is the command form derived?',
        back: 'Remove the present tense prefix (ت or ي) and adjust vowels',
        backArabic: 'بحذف حرف المضارعة',
        category: 'grammar',
        difficulty: FlashCardDifficulty.HARD,
        tags: ['imperative', 'derivation'],
      },
      {
        front: 'What is the command form for "you (fem. sing.)" from فَعَلَ?',
        back: 'اِفْعَلِي (if\'alī)',
        backArabic: 'اِفْعَلِي',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.HARD,
        tags: ['imperative', 'feminine'],
      },
      {
        front: 'What is the command form for "you (plural masc.)" from فَعَلَ?',
        back: 'اِفْعَلُوا (if\'alū)',
        backArabic: 'اِفْعَلُوا',
        category: 'conjugation',
        difficulty: FlashCardDifficulty.HARD,
        tags: ['imperative', 'plural'],
      },
    ];

    for (let i = 0; i < unit5Cards.length; i++) {
      await prisma.flashCard.create({
        data: {
          ...unit5Cards[i],
          courseId: sarfCourse.id,
          unitId: unit5.id,
          orderIndex: i,
        },
      });
      totalCreated++;
    }
    console.log(`  ✓ Created ${unit5Cards.length} flashcards\n`);
  }

  console.log(`\n✅ Successfully created ${totalCreated} flashcards for Sarf course!`);
}

if (require.main === module) {
  seedSarfFlashcards()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error('❌ Error seeding flashcards:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
