import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Weekend Path Content Tagging — Idempotent Post-Processing Seed
 * Created: 2026-07-09
 *
 * Tags maktab units with `includedInPaths` to differentiate after-school-only
 * content from content shared by both learning paths (AFTER_SCHOOL + WEEKEND).
 *
 * Architecture:
 *   - Empty array `[]`          → included in ALL paths (default, backwards-compatible)
 *   - `['AFTER_SCHOOL']`        → after-school only (excluded from weekend path)
 *   - `['AFTER_SCHOOL','WEEKEND']` → explicit both (functionally same as [], but explicit)
 *
 * MVP scope: unit-level tagging only. Per-topic filtering within a subject
 * (e.g., Fiqh "keep first 4 topics") requires splitting units and is deferred.
 *
 * What gets excluded from the Weekend path:
 *   1. Tārīkh (Islamic History)  — ALL units, ALL coursebooks
 *   2. Aqā'id (Beliefs/Creed)   — ALL units, ALL coursebooks
 *   3. Further Studies NW subjects: Faith & Belief, A Muslim Identity,
 *      Money & Wealth, Contemporary Matters
 *
 * Can be run independently: npx ts-node prisma/seed-weekend-path-tags.ts
 */

export async function seedWeekendPathTags() {
  console.log('🏷️  Applying weekend path tags to maktab units...');

  // Step 1: Reset all maktab units to [] (included in all paths).
  // This makes the script fully idempotent — re-running always produces the
  // same final state regardless of what previous runs may have set.
  const resetResult = await prisma.unit.updateMany({
    where: { slug: { startsWith: 'maktab-' } },
    data: { includedInPaths: [] },
  });
  console.log(`   ↺ Reset ${resetResult.count} maktab unit(s) to [] (all paths)`);

  // Step 2: Tārīkh (Islamic History) — after-school only across all coursebooks.
  // Slugs: maktab-1-tarikh … maktab-8-tarikh, maktab-6b-tarikh, maktab-6g-tarikh
  const tarikhResult = await prisma.unit.updateMany({
    where: { slug: { endsWith: '-tarikh' } },
    data: { includedInPaths: ['AFTER_SCHOOL'] },
  });
  console.log(`   ✖ ${tarikhResult.count} Tārīkh unit(s) → AFTER_SCHOOL only`);

  // Step 3: Aqā'id (Beliefs/Creed) — after-school only across all coursebooks.
  // Slugs: maktab-1-aqaid … maktab-8-aqaid, maktab-6b-aqaid, maktab-6g-aqaid
  const aqaidResult = await prisma.unit.updateMany({
    where: { slug: { endsWith: '-aqaid' } },
    data: { includedInPaths: ['AFTER_SCHOOL'] },
  });
  console.log(`   ✖ ${aqaidResult.count} Aqā'id unit(s) → AFTER_SCHOOL only`);

  // Step 4: Further Studies NW — four subjects are after-school only.
  //   maktab-fs-faith        → Faith & Belief
  //   maktab-fs-identity     → A Muslim Identity
  //   maktab-fs-money        → Money & Wealth
  //   maktab-fs-contemporary → Contemporary Matters
  const fsAfterSchoolSlugs = [
    'maktab-fs-faith',
    'maktab-fs-identity',
    'maktab-fs-money',
    'maktab-fs-contemporary',
  ];
  const fsResult = await prisma.unit.updateMany({
    where: { slug: { in: fsAfterSchoolSlugs } },
    data: { includedInPaths: ['AFTER_SCHOOL'] },
  });
  console.log(`   ✖ ${fsResult.count} Further Studies unit(s) → AFTER_SCHOOL only`);

  const totalTagged = tarikhResult.count + aqaidResult.count + fsResult.count;
  console.log(`✅ Weekend path tags applied — ${totalTagged} unit(s) restricted to AFTER_SCHOOL`);
  console.log('   All other maktab units remain available on both paths.');
  console.log('');
}

// Allow standalone execution
if (require.main === module) {
  seedWeekendPathTags()
    .catch((e) => {
      console.error('❌ Weekend path tagging failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
