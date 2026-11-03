import { PrismaClient } from '@prisma/client';
import { seedMaktabAssessments } from './helpers/maktab-assessment';
import { LessonDef } from './helpers/nuraniyyah-html';
import { LESSONS_PART_1 } from './helpers/nuraniyyah-lessons-1';
import { LESSONS_PART_2 } from './helpers/nuraniyyah-lessons-2';
import { LESSONS_PART_3 } from './helpers/nuraniyyah-lessons-3';

const prisma = new PrismaClient();

/**
 * Nūrāniyyah — Learn to Read the Qur'ān (Nūrānī Qā'idah)
 * Source: "Nuraniyah" tajweed primer — 17 lessons plus a summary of tajweed rules.
 *
 * Every Arabic example carries a pronunciation guide (generated from the vowelled
 * Arabic by helpers/nuraniyyah-arabic.ts), and Qur'ānic examples include recitation
 * audio. The course is linked to Maktab Foundation 1 and Foundation 2 by seed-maktab-program.ts.
 *
 * Can be run independently: npx ts-node prisma/seed-nuraniyyah.ts
 */

export const NURANIYYAH_COURSE_SLUG = 'nuraniyyah-qaidah';

export const NURANIYYAH_LESSONS: LessonDef[] = [...LESSONS_PART_1, ...LESSONS_PART_2, ...LESSONS_PART_3];

const COURSE_TITLE = 'Nūrāniyyah — Learn to Read the Qur\'ān';
const COURSE_DESCRIPTION =
  'Learn to read the Qur\'ān with tajwīd using the Nūrāniyyah (Nūrānī Qā\'idah) method. ' +
  'Seventeen step-by-step lessons take you from the 29 Arabic letters, short vowels and tanwīn, ' +
  'through madd, sukūn, qalqalah, shaddah and ghunnah, to the rules of noon sākinah and mīm sākinah. ' +
  'Every Arabic example comes with a pronunciation guide, and Qur\'ānic examples include audio recitation.';

export async function seedNuraniyyahCourse() {
  console.log('📖 Starting Nūrāniyyah course seed...');
  console.log('');

  const course = await prisma.course.upsert({
    where: { slug: NURANIYYAH_COURSE_SLUG },
    create: {
      slug: NURANIYYAH_COURSE_SLUG,
      title: COURSE_TITLE,
      description: COURSE_DESCRIPTION,
      category: 'QURAN',
      ageLevels: ['EARLY_CHILD', 'CHILD'],
      isPublished: true,
    },
    update: {
      title: COURSE_TITLE,
      description: COURSE_DESCRIPTION,
      category: 'QURAN',
      ageLevels: ['EARLY_CHILD', 'CHILD'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // orderIndex is only set on create: seedMaktabAssessments below shifts the
  // second half of the units, and re-writing the original index on a re-run
  // would collide with the assessment units.
  for (const [index, lesson] of NURANIYYAH_LESSONS.entries()) {
    const unit = await prisma.unit.upsert({
      where: { courseId_slug: { courseId: course.id, slug: lesson.slug } },
      create: {
        slug: lesson.slug,
        courseId: course.id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.html,
        orderIndex: index,
      },
      update: {
        title: lesson.title,
        description: lesson.description,
        content: lesson.html,
      },
    });

    await prisma.arabicTerm.deleteMany({ where: { unitId: unit.id } });
    if (lesson.terms.length > 0) {
      await prisma.arabicTerm.createMany({
        data: lesson.terms.map((term) => ({
          unitId: unit.id,
          arabicText: term.arabic,
          transliteration: term.transliteration,
          translation: term.translation,
        })),
      });
    }

    for (const [orderIndex, card] of lesson.cards.entries()) {
      const data = {
        front: card.front,
        back: card.back,
        frontArabic: card.frontArabic ?? null,
        backArabic: card.backArabic ?? null,
        category: card.category,
        tags: card.tags,
        difficulty: 'EASY' as const,
        subjectTag: 'QURAN',
        stageTag: null,
      };
      await prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unit.id, orderIndex } },
        create: { ...data, unitId: unit.id, courseId: course.id, orderIndex },
        update: data,
      });
    }
    await prisma.flashCard.deleteMany({
      where: { unitId: unit.id, orderIndex: { gte: lesson.cards.length } },
    });

    for (const [qIndex, q] of lesson.quiz.entries()) {
      const externalId = `${lesson.slug}-q${qIndex + 1}`;
      const data = {
        type: q.type,
        questionText: q.questionText,
        options: q.options ? JSON.stringify(q.options) : undefined,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      };
      await prisma.question.upsert({
        where: { externalId },
        create: { ...data, externalId, unitId: unit.id },
        update: { ...data, unitId: unit.id },
      });
    }

    console.log(`✅ Unit ${index + 1}: ${lesson.title} (${lesson.cards.length} flashcards, ${lesson.quiz.length} questions)`);
  }

  console.log('');
  console.log('📝 Adding assessments...');
  await seedMaktabAssessments(
    prisma,
    course.id,
    'nuraniyyah-midyear-assessment',
    'nuraniyyah-completion-assessment',
    'Mid-Year Assessment — Nūrāniyyah',
    'Completion Assessment — Nūrāniyyah',
    8, // firstHalfLastOrderIndex: unit 8 (Lesson 9 — Sukūn and Qalqalah)
    17, // originalMaxOrderIndex: unit 17 (Summary of Tajweed Rules)
    [
      { externalId: 'nuraniyyah-my-q1', type: 'MULTIPLE_CHOICE', questionText: 'How many letters are in the Nūrāniyyah alphabet (counting hamzah)?', options: ['26', '28', '29', '30'], correctAnswer: '29', explanation: 'The Nūrāniyyah teaches 29 letters: the 28 letters from alif to yāʾ plus the hamzah.' },
      { externalId: 'nuraniyyah-my-q2', type: 'MULTIPLE_CHOICE', questionText: 'Which of these letters is a heavy letter?', options: ['ب (bāʾ)', 'ت (tāʾ)', 'ص (ṣād)', 'س (sīn)'], correctAnswer: 'ص (ṣād)', explanation: 'The heavy letters are خ ص ض ط ظ غ ق — remembered as خُصَّ ضَغْطٍ قِظْ.' },
      { externalId: 'nuraniyyah-my-q3', type: 'MULTIPLE_CHOICE', questionText: 'How is بُ read?', options: ['ba', 'bi', 'bu', 'bū'], correctAnswer: 'bu', explanation: 'The ḍammah gives the short sound "u": bu.' },
      { externalId: 'nuraniyyah-my-q4', type: 'MULTIPLE_CHOICE', questionText: 'What does tanwīn add to the end of a word?', options: ['A noon sound', 'A long vowel', 'A resting sound', 'A doubled letter'], correctAnswer: 'A noon sound', explanation: 'Tanwīn is an implied noon: ban, bin, bun. It is pronounced but not written as a letter.' },
      { externalId: 'nuraniyyah-my-q5', type: 'MULTIPLE_CHOICE', questionText: 'For how many ḥarakāt is the natural madd stretched?', options: ['One', 'Two', 'Four', 'Six'], correctAnswer: 'Two', explanation: 'The natural madd (madd ṭabīʿī) is held for two ḥarakāt.' },
      { externalId: 'nuraniyyah-my-q6', type: 'MULTIPLE_CHOICE', questionText: 'Which five letters are the qalqalah (bouncing) letters?', options: ['ق ط ب ج د', 'ن م ل ر و', 'ء ه ع ح غ خ', 'ا و ي'], correctAnswer: 'ق ط ب ج د', explanation: 'The bouncing letters are qāf, ṭāʾ, bāʾ, jīm and dāl — قُطْبُ جَدٍّ.' },
    ],
    [
      { externalId: 'nuraniyyah-ca-q1', type: 'MULTIPLE_CHOICE', questionText: 'How do you begin reading ٱهْدِنَا (hamzat al-waṣl, third letter has a kasrah)?', options: ['ahdinā', 'ihdinā', 'uhdinā', 'hdinā'], correctAnswer: 'ihdinā', explanation: 'When the third letter does not have a ḍammah, the hamzat al-waṣl takes a kasrah.' },
      { externalId: 'nuraniyyah-ca-q2', type: 'MULTIPLE_CHOICE', questionText: 'What does a shaddah show?', options: ['The letter is silent', 'The letter is doubled', 'The vowel is long', 'The letter bounces'], correctAnswer: 'The letter is doubled', explanation: 'A shaddah means the letter is doubled — one resting letter and one vowelled letter.' },
      { externalId: 'nuraniyyah-ca-q3', type: 'MULTIPLE_CHOICE', questionText: 'Which letters need ghunnah when they carry a shaddah?', options: ['Nūn and mīm', 'Lām and rāʾ', 'Bāʾ and tāʾ', 'Qāf and kāf'], correctAnswer: 'Nūn and mīm', explanation: 'A nūn or mīm with shaddah must be read with a two-beat nasal ghunnah.' },
      { externalId: 'nuraniyyah-ca-q4', type: 'MULTIPLE_CHOICE', questionText: 'How many ḥarakāt is madd lāzim stretched?', options: ['Two', 'Four', 'Five', 'Six'], correctAnswer: 'Six', explanation: 'Madd lāzim (a madd letter followed by a sukūn or shaddah) is stretched six ḥarakāt.' },
      { externalId: 'nuraniyyah-ca-q5', type: 'MULTIPLE_CHOICE', questionText: 'A noon sākinah is followed by the letter ب. Which rule applies?', options: ['Show (iẓhār)', 'Merge (idghām)', 'Hide (ikhfāʾ)', 'Change (iqlāb)'], correctAnswer: 'Change (iqlāb)', explanation: 'Before bāʾ the noon changes into a mīm and is hidden with ghunnah.' },
      { externalId: 'nuraniyyah-ca-q6', type: 'MULTIPLE_CHOICE', questionText: 'Which letters make you merge a noon sākinah (idghām)?', options: ['ي ر م ل و ن', 'ء ه ع ح غ خ', 'ت ث ج د ذ', 'ب only'], correctAnswer: 'ي ر م ل و ن', explanation: 'The merging letters are ي ر م ل و ن (yarmalūn).' },
      { externalId: 'nuraniyyah-ca-q7', type: 'TRUE_FALSE', questionText: 'When a mīm sākinah is followed by a bāʾ, it is hidden with ghunnah.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Before bāʾ, the mīm sākinah is hidden softly with ghunnah (ikhfāʾ shafawī).' },
      { externalId: 'nuraniyyah-ca-q8', type: 'MULTIPLE_CHOICE', questionText: 'How is الٓمٓ recited at the start of Sūrat al-Baqarah?', options: ['Alif Lām Mīm', 'Alam', 'Alm', 'Ilm'], correctAnswer: 'Alif Lām Mīm', explanation: 'The separately recited letters are read by their names, one at a time.' },
    ],
  );

  console.log('✅ Nūrāniyyah course seed complete!');
  console.log('');
}

if (require.main === module) {
  seedNuraniyyahCourse()
    .catch((e) => {
      console.error('❌ Nūrāniyyah seed failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
