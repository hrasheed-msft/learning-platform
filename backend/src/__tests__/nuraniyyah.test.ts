import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { transliterate, spell, LETTERS } from '../../prisma/helpers/nuraniyyah-arabic';
import { WORD_AUDIO } from '../../prisma/helpers/nuraniyyah-audio';
import { LESSONS_PART_1 } from '../../prisma/helpers/nuraniyyah-lessons-1';
import { LESSONS_PART_2 } from '../../prisma/helpers/nuraniyyah-lessons-2';
import { LESSONS_PART_3 } from '../../prisma/helpers/nuraniyyah-lessons-3';

const LESSONS = [...LESSONS_PART_1, ...LESSONS_PART_2, ...LESSONS_PART_3];
const readPrisma = (file: string) => readFileSync(join(__dirname, '../../prisma', file), 'utf-8');

describe('Nūrāniyyah course content', () => {
  it('has 17 lessons plus the summary, with unique slugs', () => {
    expect(LESSONS).toHaveLength(18);
    expect(new Set(LESSONS.map((l) => l.slug)).size).toBe(18);
    expect(LESSONS[17].slug).toBe('nuraniyyah-summary');
  });

  it('gives every lesson Arabic text, flashcards and quiz questions', () => {
    for (const lesson of LESSONS) {
      expect(lesson.html, lesson.slug).toMatch(/lang="ar"/);
      expect(lesson.cards.length, lesson.slug).toBeGreaterThan(0);
      expect(lesson.quiz.length, lesson.slug).toBeGreaterThanOrEqual(2);
      for (const q of lesson.quiz) {
        if (q.options) expect(q.options, lesson.slug).toContain(q.correctAnswer);
      }
    }
  });

  it('shows a pronunciation under every Arabic card', () => {
    for (const lesson of LESSONS) {
      const cards = lesson.html.match(/<p lang="ar"[^>]*>[^<]*<\/p>/g) ?? [];
      const pronunciations = lesson.html.match(/<p dir="ltr"[^>]*>[^<]+(?:<span[^>]*>[^<]*<\/span>)?<\/p>/g) ?? [];
      expect(pronunciations.length, lesson.slug).toBeGreaterThanOrEqual(cards.length);
    }
  });

  it('never leaks template placeholders or empty pronunciations', () => {
    for (const lesson of LESSONS) {
      expect(lesson.html, lesson.slug).not.toMatch(/undefined|\[object|\$\{/);
      expect(lesson.html, lesson.slug).not.toMatch(/<p dir="ltr"[^>]*><\/p>/);
    }
  });

  it('adds Qur\'ān recitation audio to the lessons with Qur\'ānic examples', () => {
    const withAudio = LESSONS.filter((l) => l.html.includes('<audio')).map((l) => l.slug);
    for (const n of [2, 13, 14, 15, 16, 17]) expect(withAudio).toContain(`nuraniyyah-lesson-${n}`);
    expect(withAudio).toContain('nuraniyyah-summary');
    for (const lesson of LESSONS) {
      for (const [, url] of lesson.html.matchAll(/<source src="([^"]+)"/g)) {
        expect(url).toMatch(/^https:\/\/everyayah\.com\/data\/khalefa_al_tunaiji_64kbps\/\d{6}\.mp3$/);
      }
    }
  });
});

describe('Nūrāniyyah pronunciation clips', () => {
  const publicDir = join(__dirname, '../../../frontend/public');

  it('points every WORD_AUDIO entry at a clip that exists', () => {
    const urls = Object.values(WORD_AUDIO);
    expect(urls.length).toBeGreaterThan(100);
    for (const url of urls) {
      expect(url, url).toMatch(/^\/audio\/nuraniyyah\/cd\d{2}-\d{3}\.mp3$/);
      expect(existsSync(join(publicDir, url)), url).toBe(true);
    }
  });

  it('makes every alphabet letter playable and renders clips as tappable cards', () => {
    const lesson1 = LESSONS[0].html;
    for (const letter of LETTERS) expect(WORD_AUDIO[letter.ch], letter.ch).toBeDefined();
    expect(lesson1).toContain('data-audio="/audio/nuraniyyah/');
    expect(lesson1).toContain('role="button"');
  });

  it('only attaches clips to lessons that have recorded words', () => {
    const playable = LESSONS.filter((l) => l.html.includes('data-audio=')).map((l) => l.slug);
    for (const n of [1, 2, 5, 8, 10, 12, 13]) expect(playable).toContain(`nuraniyyah-lesson-${n}`);
  });
});

describe('Nūrāniyyah program wiring', () => {
  it('links the course to both Foundation 1 and Foundation 2', () => {
    const program = readPrisma('seed-maktab-program.ts');
    expect(program).toMatch(/stageNumber:\s*1,[\s\S]{0,400}?courseSlugs:\s*\['maktab-foundation-1',\s*NURANIYYAH_SLUG\]/);
    expect(program).toMatch(/stageNumber:\s*2,[\s\S]{0,400}?courseSlugs:\s*\['maktab-foundation-2',\s*NURANIYYAH_SLUG\]/);
    expect(program).toContain("NURANIYYAH_SLUG = 'nuraniyyah-qaidah'");
    expect(readPrisma('seed-nuraniyyah.ts')).toContain("NURANIYYAH_COURSE_SLUG = 'nuraniyyah-qaidah'");
  });

  it('runs the course seed before the program seed', () => {
    for (const file of ['seed.ts', 'seed-production.ts']) {
      const source = readPrisma(file);
      expect(source.indexOf('await seedNuraniyyahCourse()'), file).toBeGreaterThan(-1);
      expect(source.indexOf('await seedNuraniyyahCourse()'), file).toBeLessThan(source.indexOf('await seedMaktabProgram()'));
    }
  });
});

describe('Nūrāniyyah transliteration', () => {
  const cases: Array<[string, string]> = [
    ['أَبَدًا', 'ʾabadan'],
    ['أَنَا', 'ʾanā'],
    ['بَرَرَةٍ', 'bararatin'],
    ['طُوًى', 'ṭuwan'],
    ['هُدًى', 'hudan'],
    ['عِنَبًا', 'ʿinaban'],
    ['قُرِئَ', 'quriʾa'],
    ['دَاوُودَ', 'dāwūda'],
    ['أَيْنَ', 'ʾayna'],
    ['كَيْفَ', 'kayfa'],
    ['إِيلَافِ', 'ʾīlāfi'],
    ['آمَنَ', 'ʾāmana'],
    ['جَاءَ', 'jāʾa'],
    ['سُوءٍ', 'sūʾin'],
    ['شَيْءٍ', 'shayʾin'],
    ['مَاءٍ', 'māʾin'],
    ['يَقُولُ', 'yaqūlu'],
    ['قِيلَ', 'qīla'],
    ['وَعَمِلُوا', 'waʿamilū'],
    ['قُرَيْشٍ', 'qurayshin'],
    ['وُجُوهٌ', 'wujūhun'],
    ['ضَالًّا', 'ḍāllan'],
    ['رَبِّ', 'rabbi'],
    ['جَنَّةٌ', 'jannatun'],
    ['أَنْتَ', 'ʾanta'],
    ['هٰذَا', 'hādhā'],
    ['آ', 'ʾā'],
  ];

  for (const [arabic, expected] of cases) {
    it(`${arabic} → ${expected}`, () => {
      expect(transliterate(arabic)).toBe(expected);
    });
  }

  it('refuses alif waṣlah text without a manual pronunciation', () => {
    expect(() => transliterate('ٱلْحَمْدُ')).toThrow();
  });

  it('spells letters by name', () => {
    expect(spell('كب')).toBe('kāf – bāʾ');
    expect(spell('الم')).toBe('alif – lām – mīm');
  });

  it('defines all 29 letters', () => {
    expect(LETTERS).toHaveLength(29);
    expect(LETTERS.filter((l) => l.heavy).map((l) => l.ch).join('')).toBe('خصضطظغق');
  });
});
