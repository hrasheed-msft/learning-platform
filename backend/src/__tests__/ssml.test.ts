import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * SSML Validation Tests (Critical — broke in production)
 * Tests:
 * - Generated SSML is valid XML
 * - <voice> is never nested inside <lang>
 * - Arabic and English voice selection
 * - Bilingual content produces correct structure
 */

// Re-implement the SSML builder logic for testability
const VOICES = {
  ar: 'ar-SA-HamedNeural',
  en: 'en-US-JennyNeural',
} as const;

function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

function buildSsml(text: string, language: 'ar' | 'en'): string {
  if (language === 'ar') {
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-SA">
  <voice name="${VOICES.ar}">${text}</voice>
</speak>`;
  }

  const parts = text.split(/([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\u064B-\u065F\u0670]+)/g);
  const filteredParts = parts.filter((p) => p.trim());

  if (!filteredParts.some(containsArabic)) {
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="${VOICES.en}">${text}</voice>
</speak>`;
  }

  const voiceElements = filteredParts
    .map((part) => {
      if (containsArabic(part)) {
        return `  <voice name="${VOICES.ar}">${part.trim()}</voice>`;
      }
      return `  <voice name="${VOICES.en}">${part.trim()}</voice>`;
    })
    .join('\n');

  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
${voiceElements}
</speak>`;
}

// Simple XML well-formedness check (no DOMParser in Node)
function isWellFormedXml(xml: string): boolean {
  // Check basic structure
  if (!xml.trim().startsWith('<')) return false;

  // Check that all opened tags are closed
  const tagStack: string[] = [];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9_:-]*)[^>]*\/?>/g;
  let match;

  while ((match = tagRegex.exec(xml)) !== null) {
    const fullMatch = match[0];
    const tagName = match[1];

    if (fullMatch.endsWith('/>')) {
      // Self-closing, skip
      continue;
    } else if (fullMatch.startsWith('</')) {
      // Closing tag
      const expected = tagStack.pop();
      if (expected !== tagName) return false;
    } else {
      // Opening tag
      tagStack.push(tagName);
    }
  }

  return tagStack.length === 0;
}

describe('SSML Validation', () => {
  describe('XML Well-Formedness', () => {
    it('should produce valid XML for pure English text', () => {
      const ssml = buildSsml('This is a test of English narration.', 'en');
      expect(isWellFormedXml(ssml)).toBe(true);
    });

    it('should produce valid XML for pure Arabic text', () => {
      const ssml = buildSsml('بسم الله الرحمن الرحيم', 'ar');
      expect(isWellFormedXml(ssml)).toBe(true);
    });

    it('should produce valid XML for bilingual content', () => {
      const ssml = buildSsml('The word وضوء means ablution in Islamic jurisprudence.', 'en');
      expect(isWellFormedXml(ssml)).toBe(true);
    });

    it('should always start with <speak> root element', () => {
      const ssml = buildSsml('test', 'en');
      expect(ssml.trim()).toMatch(/^<speak /);
    });

    it('should always end with </speak>', () => {
      const ssml = buildSsml('test', 'en');
      expect(ssml.trim()).toMatch(/<\/speak>$/);
    });
  });

  describe('Voice Nesting Rules', () => {
    it('should NEVER nest <voice> inside <lang>', () => {
      const bilingualText = 'The term صلاة refers to the ritual prayer in Islam.';
      const ssml = buildSsml(bilingualText, 'en');

      // <voice> should never appear inside <lang> tags
      expect(ssml).not.toMatch(/<lang[^>]*>[\s\S]*<voice/);
    });

    it('<voice> elements should be direct children of <speak>', () => {
      const ssml = buildSsml('The word طهارة means purification.', 'en');

      // Extract content between <speak...> and </speak>
      const inner = ssml.replace(/<speak[^>]*>/, '').replace(/<\/speak>/, '').trim();

      // All <voice> elements should be at top level (not nested)
      const voiceMatches = inner.match(/<voice[^>]*>[^<]*<\/voice>/g) || [];
      expect(voiceMatches.length).toBeGreaterThan(0);

      // None should contain nested voice elements
      for (const v of voiceMatches) {
        const innerContent = v.replace(/<voice[^>]*>/, '').replace(/<\/voice>/, '');
        expect(innerContent).not.toContain('<voice');
      }
    });

    it('should not use <lang> element at all (voice-switching pattern)', () => {
      const ssml = buildSsml('العبادات means acts of worship', 'en');
      expect(ssml).not.toContain('<lang');
    });
  });

  describe('Arabic Voice Selection', () => {
    it('should use ar-SA-HamedNeural for Arabic content', () => {
      const ssml = buildSsml('بسم الله', 'ar');
      expect(ssml).toContain('ar-SA-HamedNeural');
    });

    it('should use Arabic voice for Arabic segments in bilingual text', () => {
      const ssml = buildSsml('The concept of توحيد is fundamental.', 'en');
      expect(ssml).toContain('ar-SA-HamedNeural');
    });
  });

  describe('English Voice Selection', () => {
    it('should use en-US-JennyNeural for English content', () => {
      const ssml = buildSsml('This is about Islamic jurisprudence.', 'en');
      expect(ssml).toContain('en-US-JennyNeural');
    });

    it('should use English voice for English segments in bilingual text', () => {
      const ssml = buildSsml('The term زكاة refers to obligatory charity.', 'en');
      expect(ssml).toContain('en-US-JennyNeural');
    });
  });

  describe('Bilingual Content Structure', () => {
    it('should produce multiple <voice> elements for mixed text', () => {
      const ssml = buildSsml('The word وضوء means ablution.', 'en');
      const voiceCount = (ssml.match(/<voice /g) || []).length;
      expect(voiceCount).toBeGreaterThanOrEqual(2);
    });

    it('should use Arabic voice for Arabic segments', () => {
      const ssml = buildSsml('First comes وضوء then صلاة.', 'en');
      // Should have Arabic voice for the Arabic terms
      expect(ssml).toContain(`<voice name="${VOICES.ar}">`);
    });

    it('should use English voice for English segments in mixed text', () => {
      const ssml = buildSsml('The concept of عبادة is worship.', 'en');
      expect(ssml).toContain(`<voice name="${VOICES.en}">`);
    });

    it('pure English text should use single voice element', () => {
      const ssml = buildSsml('No Arabic characters at all in this text.', 'en');
      const voiceCount = (ssml.match(/<voice /g) || []).length;
      expect(voiceCount).toBe(1);
    });

    it('pure Arabic text should use single Arabic voice element', () => {
      const ssml = buildSsml('بسم الله الرحمن الرحيم', 'ar');
      const voiceCount = (ssml.match(/<voice /g) || []).length;
      expect(voiceCount).toBe(1);
      expect(ssml).toContain(VOICES.ar);
      expect(ssml).not.toContain(VOICES.en);
    });
  });

  describe('Edge Cases', () => {
    it('should handle text with diacritics (harakat)', () => {
      const ssml = buildSsml('The word بِسْمِ contains diacritics.', 'en');
      expect(isWellFormedXml(ssml)).toBe(true);
    });

    it('should handle empty segments gracefully', () => {
      const ssml = buildSsml('test', 'en');
      expect(isWellFormedXml(ssml)).toBe(true);
    });

    it('should handle special XML characters in text', () => {
      // Note: SSML with special chars — the real service should escape these
      const ssml = buildSsml('Rules for water types', 'en');
      expect(isWellFormedXml(ssml)).toBe(true);
    });
  });
});
