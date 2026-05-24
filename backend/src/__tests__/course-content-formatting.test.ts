import { describe, expect, it, vi } from 'vitest';
import {
  formatArabicTermForCourseText,
  resolveArabicTermTranslation,
} from '../utils/arabic-term-formatting';
import {
  normalizeCourseContentHtml,
  syncCourseTextFormatting,
} from '../services/course-content-formatting.service';

describe('Course content Arabic term formatting', () => {
  it('formats common prayer vocabulary with concise translation, Arabic, and transliteration', () => {
    const result = normalizeCourseContentHtml(
      '<p>Salah requires Wudu before each Rakah.</p>',
      [
        { arabicText: 'صلاة', transliteration: 'Salah', translation: 'Prayer - the formal Islamic worship performed five times daily' },
        { arabicText: 'وضوء', transliteration: 'Wudu', translation: 'Ritual ablution - washing specific body parts before prayer' },
        { arabicText: 'ركعة', transliteration: "Rak'ah", translation: 'One complete unit of prayer' },
      ]
    );

    expect(result).toContain('Prayer صلاة/(Salah)');
    expect(result).toContain('Ablution وضوء/(Wudu)');
    expect(result).toContain("Unit of prayer ركعة/(Rak'ah)");
    expect(result).not.toContain('>Salah<');
  });

  it('does not double-format terms that are already normalized', () => {
    const result = normalizeCourseContentHtml(
      '<p>Prayer صلاة/(Salah) begins after Ablution وضوء/(Wudu).</p>',
      [
        { arabicText: 'صلاة', transliteration: 'Salah', translation: 'Prayer - the formal Islamic worship performed five times daily' },
        { arabicText: 'وضوء', transliteration: 'Wudu', translation: 'Ritual ablution - washing specific body parts before prayer' },
      ]
    );

    expect(result).toBe('<p>Prayer صلاة/(Salah) begins after Ablution وضوء/(Wudu).</p>');
  });

  it('falls back to a concise translation when no glossary override exists', () => {
    const translation = resolveArabicTermTranslation({
      arabicText: 'طواف',
      transliteration: 'Tawaf',
      translation: "Circling the Ka'bah seven times - a rite of pilgrimage",
    });

    expect(translation).toBe("Circling the Ka'bah seven times");
    expect(formatArabicTermForCourseText({
      arabicText: 'طواف',
      transliteration: 'Tawaf',
      translation: "Circling the Ka'bah seven times - a rite of pilgrimage",
    })).toBe("Circling the Ka'bah seven times طواف/(Tawaf)");
  });
});

describe('syncCourseTextFormatting', () => {
  it('returns updated unit, normalized term, and cleared cache counts', async () => {
    const unitUpdate = vi.fn().mockResolvedValue(undefined);
    const deleteMany = vi.fn().mockResolvedValue({ count: 3 });
    const prisma = {
      unit: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'unit-1',
            content: '<p>Salah and Wudu.</p>',
            arabicTerms: [
              { arabicText: 'صلاة', transliteration: 'Salah', translation: 'Prayer - the formal Islamic worship performed five times daily' },
              { arabicText: 'وضوء', transliteration: 'Wudu', translation: 'Ritual ablution - washing specific body parts before prayer' },
            ],
          },
          {
            id: 'unit-2',
            content: '<p>Already normalized Prayer صلاة/(Salah).</p>',
            arabicTerms: [
              { arabicText: 'صلاة', transliteration: 'Salah', translation: 'Prayer - the formal Islamic worship performed five times daily' },
            ],
          },
        ]),
        update: unitUpdate,
      },
      audioCache: {
        deleteMany,
      },
    };

    const result = await syncCourseTextFormatting(prisma as never);

    expect(result.scannedUnits).toBe(2);
    expect(result.updatedUnits).toBe(1);
    expect(result.normalizedTerms).toBe(2);
    expect(result.invalidatedAudioEntries).toBe(3);
    expect(result.updatedUnitIds).toEqual(['unit-1']);
    expect(unitUpdate).toHaveBeenCalledTimes(1);
    expect(deleteMany).toHaveBeenCalledWith({ where: { unitId: { in: ['unit-1'] } } });
  });

  it('is idempotent when units are already normalized', async () => {
    const unitUpdate = vi.fn().mockResolvedValue(undefined);
    const deleteMany = vi.fn().mockResolvedValue({ count: 0 });
    const prisma = {
      unit: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'unit-1',
            content: '<p>Prayer صلاة/(Salah) starts after Ablution وضوء/(Wudu).</p>',
            arabicTerms: [
              { arabicText: 'صلاة', transliteration: 'Salah', translation: 'Prayer - the formal Islamic worship performed five times daily' },
              { arabicText: 'وضوء', transliteration: 'Wudu', translation: 'Ritual ablution - washing specific body parts before prayer' },
            ],
          },
        ]),
        update: unitUpdate,
      },
      audioCache: {
        deleteMany,
      },
    };

    const result = await syncCourseTextFormatting(prisma as never);

    expect(result.updatedUnits).toBe(0);
    expect(result.normalizedTerms).toBe(0);
    expect(result.invalidatedAudioEntries).toBe(0);
    expect(result.updatedUnitIds).toEqual([]);
    expect(unitUpdate).not.toHaveBeenCalled();
    expect(deleteMany).not.toHaveBeenCalled();
  });
});
