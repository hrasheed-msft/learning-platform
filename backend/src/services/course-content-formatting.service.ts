import { Prisma, PrismaClient } from '@prisma/client';
import {
  ArabicTermFormatInput,
  formatArabicTermForCourseText,
  replaceTransliteratedTerms,
} from '../utils/arabic-term-formatting';

export interface SyncCourseTextFormattingOptions {
  courseId?: string;
  unitIds?: string[];
}

export interface SyncCourseTextFormattingResult {
  scannedUnits: number;
  updatedUnits: number;
  invalidatedAudioEntries: number;
  updatedUnitIds: string[];
}

type PrismaLike = PrismaClient | Prisma.TransactionClient;

type UnitWithArabicTerms = {
  id: string;
  content: string | null;
  arabicTerms: ArabicTermFormatInput[];
};

export function normalizeCourseContentHtml(content: string, arabicTerms: ArabicTermFormatInput[]): string {
  return replaceTransliteratedTerms(content, arabicTerms, formatArabicTermForCourseText);
}

export async function invalidateAudioCache(
  prisma: PrismaLike,
  unitIds?: string[]
): Promise<number> {
  const result = await prisma.audioCache.deleteMany({
    where: unitIds && unitIds.length > 0 ? { unitId: { in: unitIds } } : {},
  });

  return result.count;
}

export async function syncCourseTextFormatting(
  prisma: PrismaLike,
  options: SyncCourseTextFormattingOptions = {}
): Promise<SyncCourseTextFormattingResult> {
  const where: Prisma.UnitWhereInput = {
    content: { not: null },
    ...(options.courseId ? { courseId: options.courseId } : {}),
    ...(options.unitIds && options.unitIds.length > 0 ? { id: { in: options.unitIds } } : {}),
  };

  const units = await prisma.unit.findMany({
    where,
    select: {
      id: true,
      content: true,
      arabicTerms: {
        select: {
          arabicText: true,
          transliteration: true,
          translation: true,
        },
      },
    },
  }) as UnitWithArabicTerms[];

  const updatedUnitIds: string[] = [];

  for (const unit of units) {
    if (!unit.content || unit.arabicTerms.length === 0) {
      continue;
    }

    const normalizedContent = normalizeCourseContentHtml(unit.content, unit.arabicTerms);
    if (normalizedContent === unit.content) {
      continue;
    }

    await prisma.unit.update({
      where: { id: unit.id },
      data: { content: normalizedContent },
    });

    updatedUnitIds.push(unit.id);
  }

  const invalidatedAudioEntries = updatedUnitIds.length > 0
    ? await invalidateAudioCache(prisma, updatedUnitIds)
    : 0;

  return {
    scannedUnits: units.length,
    updatedUnits: updatedUnitIds.length,
    invalidatedAudioEntries,
    updatedUnitIds,
  };
}
