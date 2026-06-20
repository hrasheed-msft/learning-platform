/**
 * Backfill script: populate slug/externalId fields added in migration
 * 20260620211248_add_content_slugs_versioning.
 *
 * Run after applying the migration:
 *   npx ts-node --project tsconfig.json prisma/backfill-slugs.ts
 *
 * Idempotent — rows that already have values are skipped.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

function toKebab(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")   // strip special chars (keep word chars, spaces, hyphens)
    .replace(/[\s_]+/g, "-")    // spaces / underscores → hyphens
    .replace(/-{2,}/g, "-")     // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");   // trim leading/trailing hyphens
}

function truncate(s: string, max = 80): string {
  return s.length <= max ? s : s.slice(0, max).replace(/-[^-]*$/, "");
}

// ---------------------------------------------------------------------------
// Backfill courses
// ---------------------------------------------------------------------------

async function backfillCourses(): Promise<Map<string, string>> {
  const courses = await prisma.course.findMany({
    where: { slug: null },
    select: { id: true, title: true },
  });

  console.log(`Courses without slug: ${courses.length}`);

  // De-duplicate generated slugs within this run
  const usedSlugs = new Set<string>(
    (await prisma.course.findMany({ where: { slug: { not: null } }, select: { slug: true } }))
      .map((c) => c.slug as string)
  );

  const courseSlugMap = new Map<string, string>(); // id → slug

  for (const course of courses) {
    let base = toKebab(course.title);
    let candidate = base;
    let suffix = 2;
    while (usedSlugs.has(candidate)) {
      candidate = `${base}-${suffix++}`;
    }
    usedSlugs.add(candidate);
    courseSlugMap.set(course.id, candidate);
  }

  // Upsert in a transaction
  await prisma.$transaction(
    [...courseSlugMap.entries()].map(([id, slug]) =>
      prisma.course.update({ where: { id }, data: { slug } })
    )
  );

  console.log(`  ✓ Backfilled ${courseSlugMap.size} course slugs`);

  // Merge with existing slugs for downstream use
  const all = await prisma.course.findMany({ select: { id: true, slug: true } });
  const fullMap = new Map<string, string>();
  for (const c of all) {
    if (c.slug) fullMap.set(c.id, c.slug);
  }
  return fullMap;
}

// ---------------------------------------------------------------------------
// Backfill units
// ---------------------------------------------------------------------------

async function backfillUnits(
  courseSlugMap: Map<string, string>
): Promise<Map<string, string>> {
  const units = await prisma.unit.findMany({
    where: { slug: null },
    select: { id: true, title: true, courseId: true, orderIndex: true },
    orderBy: [{ courseId: "asc" }, { orderIndex: "asc" }],
  });

  console.log(`Units without slug: ${units.length}`);

  // Track used (courseId, slug) pairs to avoid composite-unique collisions
  const used = new Set<string>(
    (
      await prisma.unit.findMany({
        where: { slug: { not: null } },
        select: { courseId: true, slug: true },
      })
    ).map((u) => `${u.courseId}:${u.slug}`)
  );

  const unitSlugMap = new Map<string, string>(); // id → slug

  for (const unit of units) {
    const courseSlug = courseSlugMap.get(unit.courseId) ?? "course";
    const base = truncate(`${courseSlug}-${toKebab(unit.title)}`);
    let candidate = base;
    let suffix = 2;
    const key = (s: string) => `${unit.courseId}:${s}`;
    while (used.has(key(candidate))) {
      candidate = `${base}-${suffix++}`;
    }
    used.add(key(candidate));
    unitSlugMap.set(unit.id, candidate);
  }

  await prisma.$transaction(
    [...unitSlugMap.entries()].map(([id, slug]) =>
      prisma.unit.update({ where: { id }, data: { slug } })
    )
  );

  console.log(`  ✓ Backfilled ${unitSlugMap.size} unit slugs`);

  // Full map for downstream use
  const all = await prisma.unit.findMany({ select: { id: true, slug: true } });
  const fullMap = new Map<string, string>();
  for (const u of all) {
    if (u.slug) fullMap.set(u.id, u.slug);
  }
  return fullMap;
}

// ---------------------------------------------------------------------------
// Backfill questions
// ---------------------------------------------------------------------------

async function backfillQuestions(unitSlugMap: Map<string, string>): Promise<void> {
  const questions = await prisma.question.findMany({
    where: { externalId: null },
    select: { id: true, unitId: true, createdAt: true },
    orderBy: [{ unitId: "asc" }, { createdAt: "asc" }],
  });

  console.log(`Questions without externalId: ${questions.length}`);

  const used = new Set<string>(
    (
      await prisma.question.findMany({
        where: { externalId: { not: null } },
        select: { externalId: true },
      })
    ).map((q) => q.externalId as string)
  );

  // Group questions by unit to assign sequential indices
  const byUnit = new Map<string, typeof questions>();
  for (const q of questions) {
    const list = byUnit.get(q.unitId) ?? [];
    list.push(q);
    byUnit.set(q.unitId, list);
  }

  // Determine starting index per unit (account for already-backfilled questions)
  const unitStartIndex = new Map<string, number>();
  for (const unitId of byUnit.keys()) {
    const existing = await prisma.question.count({
      where: { unitId, externalId: { not: null } },
    });
    unitStartIndex.set(unitId, existing + 1);
  }

  const updates: Array<{ id: string; externalId: string }> = [];

  for (const [unitId, qs] of byUnit.entries()) {
    const unitSlug = unitSlugMap.get(unitId) ?? unitId.slice(0, 8);
    let counter = unitStartIndex.get(unitId) ?? 1;

    for (const q of qs) {
      let candidate = `${unitSlug}-q${counter}`;
      while (used.has(candidate)) {
        counter++;
        candidate = `${unitSlug}-q${counter}`;
      }
      used.add(candidate);
      updates.push({ id: q.id, externalId: candidate });
      counter++;
    }
  }

  // Batch in chunks to avoid huge transactions
  const CHUNK = 500;
  for (let i = 0; i < updates.length; i += CHUNK) {
    const chunk = updates.slice(i, i + CHUNK);
    await prisma.$transaction(
      chunk.map(({ id, externalId }) =>
        prisma.question.update({ where: { id }, data: { externalId } })
      )
    );
  }

  console.log(`  ✓ Backfilled ${updates.length} question externalIds`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Slug backfill starting ===\n");

  try {
    const courseSlugMap = await backfillCourses();
    const unitSlugMap = await backfillUnits(courseSlugMap);
    await backfillQuestions(unitSlugMap);

    console.log("\n=== Backfill complete ✓ ===");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
