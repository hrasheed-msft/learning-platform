import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Database State Check ===\n');
  
  // Count flashcards
  const flashCardCount = await prisma.flashCard.count();
  console.log(`Total FlashCards: ${flashCardCount}`);
  
  // Get courses
  const courses = await prisma.course.findMany({
    select: { id: true, title: true },
    take: 3
  });
  console.log('\nCourses:');
  courses.forEach(c => console.log(`  - ${c.id}: ${c.title}`));
  
  // Get units with flashcard counts
  const units = await prisma.unit.findMany({
    select: { 
      id: true, 
      title: true, 
      courseId: true,
      _count: { select: { flashCards: true } }
    },
    take: 10
  });
  console.log('\nUnits (with flashcard counts):');
  units.forEach(u => console.log(`  - ${u.id}: ${u.title} (${u._count.flashCards} cards)`));
  
  // Get sample flashcard
  const sampleCard = await prisma.flashCard.findFirst();
  if (sampleCard) {
    console.log('\nSample FlashCard:');
    console.log(`  ID: ${sampleCard.id}`);
    console.log(`  Front: ${sampleCard.front}`);
    console.log(`  Back: ${sampleCard.back}`);
    console.log(`  CourseId: ${sampleCard.courseId}`);
    console.log(`  UnitId: ${sampleCard.unitId}`);
  }
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
