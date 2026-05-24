import { PrismaClient } from '@prisma/client';
import { syncCourseTextFormatting } from '../src/services/course-content-formatting.service';

const prisma = new PrismaClient();

async function main() {
  const result = await syncCourseTextFormatting(prisma);

  console.log('✅ Arabic term formatting sync complete');
  console.log(`   - Scanned units: ${result.scannedUnits}`);
  console.log(`   - Updated units: ${result.updatedUnits}`);
  console.log(`   - Invalidated audio cache entries: ${result.invalidatedAudioEntries}`);
}

main()
  .catch((error) => {
    console.error('❌ Failed to sync course content formatting:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
