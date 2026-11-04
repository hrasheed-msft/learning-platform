import { PrismaClient } from '@prisma/client';
import { seedMaktabAssessments } from './helpers/maktab-assessment';
import { NURANIYYAH_LESSONS } from './helpers/nuraniyyah-lessons';

const prisma = new PrismaClient();

/**
 * Nūrāniyyah — Learn to Read the Qur'ān (Nūrānī Qā'idah)
 * Source: the Nūrāniyyah primer, pages 6–19 (11 lessons), with the "Qaidah Nuraniyyah" CD.
 *
 * Every Arabic example carries a pronunciation guide (generated from the vowelled Arabic by
 * helpers/nuraniyyah-arabic.ts) and most can be tapped to hear the teacher on the CD
 * (clips built by tools/nuraniyyah-audio). The course is linked to Maktab Foundation 1 and
 * Foundation 2 by seed-maktab-program.ts.
 *
 * Re-running is safe: it also removes units left over from earlier editions of the course.
 *
 * Can be run independently: npx ts-node prisma/seed-nuraniyyah.ts
 */

export const NURANIYYAH_COURSE_SLUG = 'nuraniyyah-qaidah';

export { NURANIYYAH_LESSONS };

const COURSE_TITLE = 'Nūrāniyyah — Learn to Read the Qur\'ān';
const COURSE_DESCRIPTION =
  'Learn to read the Qur\'ān with the Nūrāniyyah (Nūrānī Qā\'idah) method. ' +
  'Eleven step-by-step lessons follow the book page by page: the 29 Arabic letters, joined letters, ' +
  'the separately recited letters, short vowels, tanwīn, the small alif, madd and līn, and sukūn with qalqalah. ' +
  'Every Arabic example comes with a pronunciation guide, and most can be tapped to hear the teacher.';

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

  // Earlier editions had more lessons and their own assessments (re-created below). Remove those units, then
  // park the rest on negative positions so the new order never collides with the old one.
  const slugs = NURANIYYAH_LESSONS.map((l) => l.slug);
  const removed = await prisma.unit.deleteMany({ where: { courseId: course.id, slug: { notIn: slugs } } });
  if (removed.count > 0) console.log(`🧹 Removed ${removed.count} unit(s) from earlier editions`);
  await prisma.$executeRawUnsafe(
    `UPDATE units SET "orderIndex" = -("orderIndex" + 1) WHERE "courseId" = $1`,
    course.id,
  );

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
        orderIndex: index,
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

    const questionIds: string[] = [];
    for (const [qIndex, q] of lesson.quiz.entries()) {
      const externalId = `${lesson.slug}-q${qIndex + 1}`;
      questionIds.push(externalId);
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
    await prisma.question.deleteMany({
      where: { unitId: unit.id, externalId: { notIn: questionIds } },
    });

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
    4, // firstHalfLastOrderIndex: unit 4 (Lesson 5 — Tanwīn)
    10, // originalMaxOrderIndex: unit 10 (Lesson 11 — Exercises on the Sukūn)
    [
      { externalId: 'nuraniyyah-my-q1', type: 'MULTIPLE_CHOICE', questionText: 'How many letters are in the Nūrāniyyah alphabet (counting hamzah)?', options: ['26', '28', '29', '30'], correctAnswer: '29', explanation: 'The Nūrāniyyah teaches 29 letters: the 28 letters from alif to yāʾ plus the hamzah.' },
      { externalId: 'nuraniyyah-my-q2', type: 'MULTIPLE_CHOICE', questionText: 'Which of these letters is a heavy letter?', options: ['ب (bāʾ)', 'ت (tāʾ)', 'ص (ṣād)', 'س (sīn)'], correctAnswer: 'ص (ṣād)', explanation: 'The heavy letters are خ ص ض ط ظ غ ق — remembered as خُصَّ ضَغْطٍ قِظْ.' },
      { externalId: 'nuraniyyah-my-q3', type: 'MULTIPLE_CHOICE', questionText: 'How is بُ read?', options: ['ba', 'bi', 'bu', 'bū'], correctAnswer: 'bu', explanation: 'The ḍammah gives the short sound "u": bu.' },
      { externalId: 'nuraniyyah-my-q4', type: 'MULTIPLE_CHOICE', questionText: 'What does tanwīn add to the end of a word?', options: ['A noon sound', 'A long vowel', 'A resting sound', 'A doubled letter'], correctAnswer: 'A noon sound', explanation: 'Tanwīn is an implied noon: ban, bin, bun. It is pronounced but not written as a letter.' },
      { externalId: 'nuraniyyah-my-q5', type: 'MULTIPLE_CHOICE', questionText: 'Which letters do not join to the letter after them?', options: ['ا د ذ ر ز و', 'ب ت ث ن ي', 'ك ل م ن ه', 'ج ح خ ع غ'], correctAnswer: 'ا د ذ ر ز و', explanation: 'Alif, dāl, dhāl, rāʾ, zāy and wāw join to the letter before them but never to the one after.' },
      { externalId: 'nuraniyyah-my-q6', type: 'MULTIPLE_CHOICE', questionText: 'How is الٓمٓ recited at the start of Sūrat al-Baqarah?', options: ['Alif Lām Mīm', 'Alam', 'Alm', 'Ilm'], correctAnswer: 'Alif Lām Mīm', explanation: 'The separately recited letters are read by their names, one at a time.' },
    ],
    [
      { externalId: 'nuraniyyah-ca-q1', type: 'MULTIPLE_CHOICE', questionText: 'For how many ḥarakāt is the natural madd stretched?', options: ['One', 'Two', 'Four', 'Six'], correctAnswer: 'Two', explanation: 'The natural madd (madd ṭabīʿī) is held for two ḥarakāt.' },
      { externalId: 'nuraniyyah-ca-q2', type: 'MULTIPLE_CHOICE', questionText: 'Which ḥarakah must come before the madd letter wāw (و)?', options: ['Fatḥah', 'Kasrah', 'Ḍammah', 'Sukūn'], correctAnswer: 'Ḍammah', explanation: 'Alif follows a fatḥah, yāʾ follows a kasrah and wāw follows a ḍammah.' },
      { externalId: 'nuraniyyah-ca-q3', type: 'MULTIPLE_CHOICE', questionText: 'How is بَيْ read?', options: ['bī', 'bay', 'bā', 'bi'], correctAnswer: 'bay', explanation: 'A yāʾ with sukūn after a fatḥah is a līn letter and gives the sound "ay".' },
      { externalId: 'nuraniyyah-ca-q4', type: 'MULTIPLE_CHOICE', questionText: 'How is the letter with a small alif بَٰ read?', options: ['ba', 'bā', 'bi', 'bū'], correctAnswer: 'bā', explanation: 'A small alif after a fatḥah stretches the vowel: bā.' },
      { externalId: 'nuraniyyah-ca-q5', type: 'MULTIPLE_CHOICE', questionText: 'What is a sukūn?', options: ['A long vowel', 'A resting sound', 'A doubled letter', 'A noon sound'], correctAnswer: 'A resting sound', explanation: 'The sukūn replaces the ḥarakah: the letter rests and is read without a vowel.' },
      { externalId: 'nuraniyyah-ca-q6', type: 'MULTIPLE_CHOICE', questionText: 'Which five letters are the qalqalah (bouncing) letters?', options: ['ق ط ب ج د', 'ن م ل ر و', 'ء ه ع ح غ خ', 'ا و ي'], correctAnswer: 'ق ط ب ج د', explanation: 'The bouncing letters are qāf, ṭāʾ, bāʾ, jīm and dāl — قُطْبُ جَدٍّ.' },
      { externalId: 'nuraniyyah-ca-q7', type: 'TRUE_FALSE', questionText: 'Līn is a weaker form of madd.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Līn letters (wāw or yāʾ with sukūn after a fatḥah) are softer than the madd letters.' },
      { externalId: 'nuraniyyah-ca-q8', type: 'MULTIPLE_CHOICE', questionText: 'How is the word أَنْتَ read?', options: ['ʾanta', 'ʾanata', 'ʾunta', 'ʾinta'], correctAnswer: 'ʾanta', explanation: 'The nūn rests (sukūn), so the word is ʾan-ta.' },
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
