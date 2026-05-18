import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyFlashcards() {
  console.log('🔍 Verifying Flashcard Data...\n');

  try {
    // Find the Sarf course
    const sarfCourse = await prisma.course.findFirst({
      where: { title: { contains: 'Sarf' } },
      include: {
        units: {
          orderBy: { orderIndex: 'asc' },
          include: {
            flashCards: true
          }
        }
      }
    });

    if (!sarfCourse) {
      console.error('❌ Sarf course not found!');
      return;
    }

    console.log(`✓ Found course: ${sarfCourse.title}`);
    console.log(`  Course ID: ${sarfCourse.id}`);
    console.log(`  Total units: ${sarfCourse.units.length}\n`);

    let totalFlashcards = 0;

    for (const unit of sarfCourse.units) {
      const flashcardCount = unit.flashCards.length;
      totalFlashcards += flashcardCount;
      
      console.log(`📚 Unit: ${unit.title}`);
      console.log(`   Unit ID: ${unit.id}`);
      console.log(`   Flashcards: ${flashcardCount}`);
      
      if (flashcardCount > 0) {
        console.log(`   Sample flashcard:`);
        const sample = unit.flashCards[0];
        console.log(`     Front: ${sample.front}`);
        console.log(`     Back: ${sample.back}`);
        console.log(`     Category: ${sample.category}`);
        console.log(`     Difficulty: ${sample.difficulty}`);
      }
      console.log('');
    }

    console.log(`\n✅ Total flashcards found: ${totalFlashcards}`);

    // Also check all flashcards across all courses
    const allFlashcards = await prisma.flashCard.findMany({
      include: {
        course: { select: { title: true } },
        unit: { select: { title: true } }
      }
    });

    console.log(`\n📊 Database Summary:`);
    console.log(`   Total flashcards in database: ${allFlashcards.length}`);
    
    if (allFlashcards.length > 0) {
      console.log(`\n   Flashcards by course:`);
      const byCourse = allFlashcards.reduce((acc, fc) => {
        const courseName = fc.course.title;
        acc[courseName] = (acc[courseName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(byCourse).forEach(([course, count]) => {
        console.log(`     ${course}: ${count} flashcards`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyFlashcards();
