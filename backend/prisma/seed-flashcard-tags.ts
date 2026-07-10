import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UPDATE_CHUNK_SIZE = 500;
const STAGE_ORDER = ['F1', 'F2', 'CB1', 'CB2', 'CB3', 'CB4', 'CB5', 'CB6B', 'CB6G', 'CB7', 'CB8', 'FS'];
const SUBJECT_ORDER = ['DUA', '99NAMES', 'QURAN', 'FIQH', 'AHADITH', 'SIRAH', 'TARIKH', 'AQAID', 'AKHLAQ', 'ADAB'];

const COURSEBOOK_SUBJECT_TAGS: Record<string, string> = {
  fiqh: 'FIQH',
  ahadith: 'AHADITH',
  sirah: 'SIRAH',
  tarikh: 'TARIKH',
  aqaid: 'AQAID',
  akhlaq: 'AKHLAQ',
  adab: 'ADAB',
};

const FOUNDATION_SUBJECT_TAGS: Record<string, string> = {
  quran: 'QURAN',
  dua: 'DUA',
  '99-names': '99NAMES',
};

const FURTHER_STUDIES_SUBJECT_TAGS: Record<string, string> = {
  'essentials-1': 'FIQH',
  'essentials-2': 'FIQH',
  faith: 'AQAID',
  devotional: 'FIQH',
  identity: 'AKHLAQ',
  living: 'ADAB',
  money: 'FIQH',
  contemporary: 'FIQH',
  hadith: 'AHADITH',
};

type DerivedTags = {
  stageTag: string;
  subjectTag: string;
};

function incrementCount(counts: Map<string, number>, key: string) {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function getFoundationSubjectTag(unitSlug: string, prefix: string) {
  const suffix = unitSlug.slice(prefix.length);
  const subjectTag = FOUNDATION_SUBJECT_TAGS[suffix];

  if (!subjectTag) {
    throw new Error(`Unrecognized foundation unit slug: ${unitSlug}`);
  }

  return subjectTag;
}

function deriveFlashcardTags(unitSlug: string | null, courseSlug: string | null): DerivedTags {
  if (!courseSlug) {
    throw new Error('FlashCard belongs to a course without a slug');
  }

  if (!unitSlug) {
    throw new Error(`FlashCard in course "${courseSlug}" belongs to a unit without a slug`);
  }

  if (courseSlug === 'maktab-foundation-1' || unitSlug.startsWith('foundation-1-')) {
    return {
      stageTag: 'F1',
      subjectTag: getFoundationSubjectTag(unitSlug, 'foundation-1-'),
    };
  }

  if (courseSlug === 'maktab-foundation-2' || unitSlug.startsWith('foundation-2-')) {
    return {
      stageTag: 'F2',
      subjectTag: getFoundationSubjectTag(unitSlug, 'foundation-2-'),
    };
  }

  const coursebookMatch = unitSlug.match(/^maktab-(1|2|3|4|5|6b|6g|7|8)-(fiqh|ahadith|sirah|tarikh|aqaid|akhlaq|adab)$/);
  if (coursebookMatch) {
    const stageCode = coursebookMatch[1];
    const subjectCode = coursebookMatch[2];

    return {
      stageTag: `CB${stageCode.toUpperCase()}`,
      subjectTag: COURSEBOOK_SUBJECT_TAGS[subjectCode],
    };
  }

  if (unitSlug.startsWith('maktab-fs-')) {
    const suffix = unitSlug.slice('maktab-fs-'.length);
    const subjectTag = FURTHER_STUDIES_SUBJECT_TAGS[suffix];

    if (!subjectTag) {
      throw new Error(`Unrecognized Further Studies unit slug: ${unitSlug}`);
    }

    return {
      stageTag: 'FS',
      subjectTag,
    };
  }

  throw new Error(`Unrecognized maktab unit slug: ${unitSlug}`);
}

function chunkItems<T>(items: T[], chunkSize: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

function logCounts(label: string, counts: Map<string, number>, preferredOrder: string[]) {
  console.log(`   ${label}:`);

  const orderedKeys = preferredOrder.filter((key) => (counts.get(key) ?? 0) > 0);
  const remainingKeys = [...counts.keys()]
    .filter((key) => !preferredOrder.includes(key))
    .sort();

  for (const key of [...orderedKeys, ...remainingKeys]) {
    console.log(`     - ${key}: ${counts.get(key)}`);
  }
}

/**
 * FlashCard Stage/Subject Tag Backfill — Idempotent Post-Processing Seed
 * Created: 2026-07-09T19:58:03-05:00
 *
 * Backfills `stageTag` and `subjectTag` for all existing FlashCards that belong
 * to maktab curriculum courses. Re-running is safe and always overwrites the
 * current tags from slug-derived rules.
 *
 * Important nuance: Foundation unit slugs are `foundation-1-*` / `foundation-2-*`
 * (not `maktab-*`), so the query scopes by course slug (`maktab-*`) and then
 * derives tags from the joined unit slug.
 *
 * Can be run independently: npx ts-node prisma/seed-flashcard-tags.ts
 */
export async function seedFlashcardTags() {
  console.log('🏷️  Backfilling maktab flashcard stage/subject tags...');

  const flashcards = await prisma.flashCard.findMany({
    where: {
      course: {
        slug: {
          startsWith: 'maktab-',
        },
      },
    },
    select: {
      id: true,
      unit: {
        select: {
          slug: true,
        },
      },
      course: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (flashcards.length === 0) {
    console.log('   No maktab flashcards found. Nothing to tag.');
    console.log('');
    return;
  }

  const updatesByTagPair = new Map<string, string[]>();
  const stageCounts = new Map<string, number>();
  const subjectCounts = new Map<string, number>();

  for (const flashcard of flashcards) {
    const { stageTag, subjectTag } = deriveFlashcardTags(flashcard.unit.slug, flashcard.course.slug);
    const key = `${stageTag}|${subjectTag}`;

    incrementCount(stageCounts, stageTag);
    incrementCount(subjectCounts, subjectTag);

    const ids = updatesByTagPair.get(key) ?? [];
    ids.push(flashcard.id);
    updatesByTagPair.set(key, ids);
  }

  let updatedCount = 0;

  for (const [tagPair, ids] of updatesByTagPair.entries()) {
    const separatorIndex = tagPair.indexOf('|');
    const stageTag = tagPair.slice(0, separatorIndex);
    const subjectTag = tagPair.slice(separatorIndex + 1);

    for (const chunk of chunkItems(ids, UPDATE_CHUNK_SIZE)) {
      const result = await prisma.flashCard.updateMany({
        where: { id: { in: chunk } },
        data: { stageTag, subjectTag },
      });

      updatedCount += result.count;
    }
  }

  console.log(`   ✓ Tagged ${updatedCount} flashcard(s) across ${updatesByTagPair.size} stage/subject group(s)`);
  logCounts('By stage', stageCounts, STAGE_ORDER);
  logCounts('By subject', subjectCounts, SUBJECT_ORDER);
  console.log('✅ Flashcard stage/subject tags backfilled');
  console.log('');
}

if (require.main === module) {
  seedFlashcardTags()
    .catch((error) => {
      console.error('❌ Flashcard tag backfill failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
