/**
 * Maktab Seed Source Validation Tests
 *
 * These tests validate the static source content of all Maktab seed files
 * without requiring a live database. They catch regressions in:
 *
 * 1. Stage names (must use level identifiers, not coursebook titles)
 * 2. Assessment presence (each relevant seed must call seedMaktabAssessments exactly once)
 * 3. Assessment slug determinism (slugs follow the established naming pattern)
 * 4. Question externalId uniqueness (no collisions across all seed files)
 * 5. Minimum question counts (both mid-year and completion assessments have real questions)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const PRISMA_DIR = join(__dirname, '../../prisma');

function readSeed(filename: string): string {
  return readFileSync(join(PRISMA_DIR, filename), 'utf-8');
}

// ────────────────────────────────────────────────────────────────────────────
// Helper: extract all string literals matching a pattern from source text
// ────────────────────────────────────────────────────────────────────────────

function extractStringLiterals(source: string, pattern: RegExp): string[] {
  const results: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(pattern.source, 'g');
  while ((match = re.exec(source)) !== null) {
    results.push(match[1]);
  }
  return results;
}

// ────────────────────────────────────────────────────────────────────────────
// Test data: all seed files that must have exactly one assessment call
// ────────────────────────────────────────────────────────────────────────────

const COURSEBOOK_SEEDS = [
  { file: 'seed-maktab-coursebook1.ts', prefix: 'maktab-1' },
  { file: 'seed-maktab-coursebook2.ts', prefix: 'maktab-2' },
  { file: 'seed-maktab-coursebook3.ts', prefix: 'maktab-3' },
  { file: 'seed-maktab-coursebook4.ts', prefix: 'maktab-4' },
  { file: 'seed-maktab-coursebook5.ts', prefix: 'maktab-5' },
  { file: 'seed-maktab-coursebook6boys.ts', prefix: 'maktab-6b' },
  { file: 'seed-maktab-coursebook6girls.ts', prefix: 'maktab-6g' },
  { file: 'seed-maktab-coursebook7.ts', prefix: 'maktab-7' },
  { file: 'seed-maktab-coursebook8.ts', prefix: 'maktab-8' },
  { file: 'seed-maktab-foundation1.ts', prefix: 'maktab-f1' },
  { file: 'seed-maktab-foundation2.ts', prefix: 'maktab-f2' },
  { file: 'seed-maktab-further-studies-nw.ts', prefix: 'maktab-fs' },
];

// ────────────────────────────────────────────────────────────────────────────
// 1. Stage names must use level identifiers, not coursebook names
// ────────────────────────────────────────────────────────────────────────────

describe('Maktab program stages use level identifiers, not coursebook names', () => {
  const programSource = readSeed('seed-maktab-program.ts');

  it('stages 3–10 are named "Stage N", not "Coursebook N"', () => {
    // Extract every name: '...' adjacent to a stageNumber field in the STAGES array.
    // We check by looking for "Coursebook" in stage names directly in the source.
    const coursebookNameMatch = /stageNumber:\s*([3-9]|10),[\s\S]{0,200}?name:\s*'([^']*Coursebook[^']*)'/;
    expect(programSource).not.toMatch(coursebookNameMatch);
  });

  it('stages 3–10 include the word "Stage" followed by their number', () => {
    for (let n = 3; n <= 10; n++) {
      // Pattern: stageNumber: N, ... name: 'Stage N'
      const pattern = new RegExp(
        `stageNumber:\\s*${n},[\\s\\S]{0,300}?name:\\s*'Stage ${n}'`,
      );
      expect(programSource).toMatch(pattern);
    }
  });

  it('stages 1 and 2 retain their "Foundation N" names', () => {
    expect(programSource).toMatch(/stageNumber:\s*1,[\s\S]{0,300}?name:\s*'Foundation 1'/);
    expect(programSource).toMatch(/stageNumber:\s*2,[\s\S]{0,300}?name:\s*'Foundation 2'/);
  });

  it('stage 11 is named "Further Studies"', () => {
    expect(programSource).toMatch(/stageNumber:\s*11,[\s\S]{0,300}?name:\s*'Further Studies'/);
  });

  it('stage 12 is named "Quran Memorization"', () => {
    expect(programSource).toMatch(/stageNumber:\s*12,[\s\S]{0,300}?name:\s*'Quran Memorization'/);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Each relevant seed calls seedMaktabAssessments exactly once
// ────────────────────────────────────────────────────────────────────────────

describe('Each Maktab seed calls seedMaktabAssessments exactly once', () => {
  for (const { file } of COURSEBOOK_SEEDS) {
    it(`${file} has exactly one assessment call`, () => {
      const source = readSeed(file);
      const calls = (source.match(/seedMaktabAssessments\s*\(/g) ?? []).length;
      expect(calls).toBe(1);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Assessment slugs follow the deterministic naming pattern
// ────────────────────────────────────────────────────────────────────────────

describe('Assessment slugs are deterministic and follow naming convention', () => {
  for (const { file, prefix } of COURSEBOOK_SEEDS) {
    it(`${file} uses slugs '${prefix}-midyear-assessment' and '${prefix}-completion-assessment'`, () => {
      const source = readSeed(file);
      expect(source).toContain(`'${prefix}-midyear-assessment'`);
      expect(source).toContain(`'${prefix}-completion-assessment'`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Assessment question externalIds are unique across all seed files
//    (scoped to the assessment-specific -my-qN / -ca-qN pattern only)
//
// NOTE: A broader uniqueness violation was found in the foundation seed files
// (pre-existing per-unit quiz question IDs duplicated within those files).
// That defect is tracked separately as a reviewer finding for Khwarizmi.
// ────────────────────────────────────────────────────────────────────────────

describe('Assessment question externalIds are unique across all seed files', () => {
  it('no two assessment questions share the same externalId', () => {
    const allAssessmentIds: string[] = [];

    for (const { file, prefix } of COURSEBOOK_SEEDS) {
      const source = readSeed(file);
      // Only collect assessment-specific IDs (mid-year: -my-qN, completion: -ca-qN).
      const midYearIds = extractStringLiterals(source, new RegExp(`externalId:\\s*'(${prefix}-my-q\\d+)'`));
      const completionIds = extractStringLiterals(source, new RegExp(`externalId:\\s*'(${prefix}-ca-q\\d+)'`));
      allAssessmentIds.push(...midYearIds, ...completionIds);
    }

    const uniqueIds = new Set(allAssessmentIds);
    if (uniqueIds.size !== allAssessmentIds.length) {
      const counts = new Map<string, number>();
      for (const id of allAssessmentIds) {
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
      const duplicates = [...counts.entries()].filter(([, c]) => c > 1).map(([id]) => id);
      throw new Error(`Duplicate assessment externalIds found: ${duplicates.join(', ')}`);
    }

    expect(uniqueIds.size).toBe(allAssessmentIds.length);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Minimum question counts
// ────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
// 6. Coursebook 7 seed must not use obsolete UnitProgress fields
// ────────────────────────────────────────────────────────────────────────────

describe('seed-maktab-coursebook7.ts does not use obsolete UnitProgress fields', () => {
  const cb7Source = readSeed('seed-maktab-coursebook7.ts');

  it('does not use the removed userId_unitId unique constraint', () => {
    expect(cb7Source).not.toContain('userId_unitId');
  });

  it('does not use the removed completed field on UnitProgress', () => {
    // Guard against re-introducing `completed: true` / `completed: false` on unitProgress upsert
    expect(cb7Source).not.toMatch(/unitProgress\s*\.\s*upsert[\s\S]{0,300}completed\s*:/);
  });

  it('does not use the removed score field on UnitProgress', () => {
    expect(cb7Source).not.toMatch(/unitProgress\s*\.\s*upsert[\s\S]{0,300}score\s*:/);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Minimum question counts
// ────────────────────────────────────────────────────────────────────────────

describe('Each assessment has at least the required number of questions', () => {
  for (const { file, prefix } of COURSEBOOK_SEEDS) {
    it(`${file} has ≥4 mid-year and ≥6 completion questions`, () => {
      const source = readSeed(file);

      // Count externalIds that match the mid-year pattern (<prefix>-my-qN)
      const midYearIds = extractStringLiterals(source, new RegExp(`externalId:\\s*'(${prefix}-my-q\\d+)'`));
      // Count externalIds that match the completion pattern (<prefix>-ca-qN)
      const completionIds = extractStringLiterals(source, new RegExp(`externalId:\\s*'(${prefix}-ca-q\\d+)'`));

      expect(midYearIds.length).toBeGreaterThanOrEqual(4);
      expect(completionIds.length).toBeGreaterThanOrEqual(6);
    });
  }
});
