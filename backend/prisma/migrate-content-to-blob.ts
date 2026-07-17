/**
 * migrate-content-to-blob.ts
 *
 * Migrates unit HTML content from the DB text column to Azure Blob Storage.
 * Safe to run multiple times — skips units that already have contentUrl set.
 *
 * Usage: AZURE_STORAGE_CONNECTION_STRING="..." DATABASE_URL="..." npx ts-node prisma/migrate-content-to-blob.ts
 *
 * Options:
 *   --dry-run   Show what would be migrated without making changes
 *   --no-clear  Upload to blob but keep content column populated (for testing)
 */

import { PrismaClient } from '@prisma/client';
import { uploadUnitContent, isBlobStorageAvailable } from './helpers/blob-upload';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');
const KEEP_CONTENT = process.argv.includes('--no-clear');

async function main() {
  console.log('🗄️  Content → Blob Migration');
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log(`   Clear content column after upload: ${KEEP_CONTENT ? 'No' : 'Yes'}`);
  console.log('');

  if (!isBlobStorageAvailable()) {
    console.error('❌ AZURE_STORAGE_CONNECTION_STRING is not set. Cannot upload to blob.');
    process.exit(1);
  }

  // Find all units with content but no contentUrl
  const units = await prisma.unit.findMany({
    where: {
      content: { not: null },
      contentUrl: null,
    },
    select: { id: true, title: true, content: true },
  });

  console.log(`Found ${units.length} unit(s) to migrate.`);
  if (units.length === 0) {
    console.log('✅ Nothing to migrate.');
    return;
  }

  let success = 0;
  let failed = 0;

  for (const unit of units) {
    if (!unit.content) continue;

    try {
      if (DRY_RUN) {
        const sizeKb = (Buffer.byteLength(unit.content, 'utf8') / 1024).toFixed(1);
        console.log(`  [dry-run] Would upload: ${unit.title} (${sizeKb} KB) → unit-${unit.id}.html`);
        success++;
        continue;
      }

      const url = await uploadUnitContent(unit.id, unit.content);
      console.log(`  ✅ ${unit.title} → ${url}`);

      await prisma.unit.update({
        where: { id: unit.id },
        data: {
          contentUrl: url,
          content: KEEP_CONTENT ? unit.content : null,
        },
      });

      success++;
    } catch (err) {
      console.error(`  ❌ Failed: ${unit.title}`, err);
      failed++;
    }
  }

  console.log('');
  console.log(`Migration complete: ${success} succeeded, ${failed} failed.`);
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
