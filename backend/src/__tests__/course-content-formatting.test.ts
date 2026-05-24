import { describe, expect, it } from 'vitest';
import {
  formatArabicTermForCourseText,
  resolveArabicTermTranslation,
} from '../utils/arabic-term-formatting';
import { normalizeCourseContentHtml } from '../services/course-content-formatting.service';

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
      translation: 'Circling the Ka\'bah seven times - a rite of pilgrimage',
    });

    expect(translation).toBe('Circling the Ka\'bah seven times');
    expect(formatArabicTermForCourseText({
      arabicText: 'طواف',
      transliteration: 'Tawaf',
      translation: 'Circling the Ka\'bah seven times - a rite of pilgrimage',
    })).toBe('Circling the Ka\'bah seven times طواف/(Tawaf)');
  });
});
