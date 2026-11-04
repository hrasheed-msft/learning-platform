import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { transliterate, spell, LETTERS } from '../../prisma/helpers/nuraniyyah-arabic';
import { L2_CELL_CLIPS, SUKOON_GROUP_URLS, WORD_CLIPS } from '../../prisma/helpers/nuraniyyah-audio';
import {
  EXERCISE_WORDS,
  L10_LETTERS,
  L1_CELL_LETTERS,
  L2_CELLS,
  L3_CELLS,
  L4_SINGLES,
  L4_SPELLED,
  L5_SINGLES,
  L5_SPELLED,
  L7_SMALL_ALIF,
  L8_LEEN_SINGLES,
  L8_LEEN_SPELLED_A,
  L8_LEEN_SPELLED_B,
  L8_MADD_SINGLES,
  L8_MADD_SPELLED_A,
  L8_MADD_SPELLED_B,
} from '../../prisma/helpers/nuraniyyah-data';
import { NURANIYYAH_LESSONS as LESSONS } from '../../prisma/helpers/nuraniyyah-lessons';

const prismaDir = join(__dirname, '../../prisma');
const publicDir = join(__dirname, '../../../frontend/public');
const readPrisma = (file: string) => readFileSync(join(prismaDir, file), 'utf-8');

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
    ['يَقُولُ', 'yaqūlu'],
    ['وَعَمِلُوا', 'waʿamilū'],
    ['قُرَيْشٍ', 'qurayshin'],
    ['وُجُوهٌ', 'wujūhun'],
    ['أَنْتَ', 'ʾanta'],
    ['بَٰ', 'bā'],
    ['هِۦ', 'hī'],
    ['هُۥ', 'hū'],
    ['بًا', 'ban'],
    ['بَا بُوا بِي', 'bā bū bī'],
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
    expect(spell('الٓمٓ')).toBe('alif – lām – mīm');
  });

  it('defines all 29 letters', () => {
    expect(LETTERS).toHaveLength(29);
    expect(LETTERS.filter((l) => l.heavy).map((l) => l.ch).join('')).toBe('خصضطظغق');
  });
});

describe('Nūrāniyyah source data follows the book', () => {
  it('has the book\'s cell counts', () => {
    expect(L1_CELL_LETTERS).toHaveLength(30);
    expect(L2_CELLS.length).toBeGreaterThan(120);
    expect(L3_CELLS).toHaveLength(15);
    expect(L7_SMALL_ALIF).toHaveLength(28);
    expect(EXERCISE_WORDS[6]).toHaveLength(54);
    expect(EXERCISE_WORDS[11]).toHaveLength(51);
  });

  it('covers every letter once in each letter-by-letter lesson', () => {
    const l4 = [...L4_SPELLED, ...L4_SINGLES];
    const l5 = [...L5_SPELLED, ...L5_SINGLES, 'أ'];
    const madd = [...L8_MADD_SPELLED_A, ...L8_MADD_SINGLES, ...L8_MADD_SPELLED_B];
    const leen = [...L8_LEEN_SPELLED_A, ...L8_LEEN_SINGLES, ...L8_LEEN_SPELLED_B];
    for (const list of [l4, l5, madd, leen]) {
      expect(list).toHaveLength(28);
      expect(new Set(list).size).toBe(28);
    }
    expect(L10_LETTERS).toHaveLength(16);
  });

  it('can pronounce every exercise word', () => {
    for (const words of Object.values(EXERCISE_WORDS)) {
      for (const w of words) {
        if (w.includes('ٱ')) continue; // given a manual pronunciation
        expect(transliterate(w).length, w).toBeGreaterThan(1);
      }
    }
  });
});

describe('Nūrāniyyah course content', () => {
  it('has the book\'s 11 lessons in order, with unique slugs', () => {
    expect(LESSONS).toHaveLength(11);
    expect(LESSONS.map((l) => l.slug)).toEqual(Array.from({ length: 11 }, (_, i) => `nuraniyyah-lesson-${i + 1}`));
  });

  it('gives every lesson Arabic text, flashcards and valid quiz questions', () => {
    for (const lesson of LESSONS) {
      expect(lesson.html, lesson.slug).toMatch(/lang="ar"/);
      expect(lesson.cards.length, lesson.slug).toBeGreaterThan(0);
      expect(lesson.quiz.length, lesson.slug).toBeGreaterThanOrEqual(3);
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
      expect(lesson.html, lesson.slug).not.toMatch(/undefined|\[object|\$\{|NaN/);
      expect(lesson.html, lesson.slug).not.toMatch(/<p dir="ltr"[^>]*><\/p>/);
    }
  });

  it('adds recitation audio to the lessons with Qur\'ānic examples', () => {
    for (const n of [3, 11]) {
      expect(LESSONS[n - 1].html, `lesson ${n}`).toContain('<audio');
    }
    for (const lesson of LESSONS) {
      for (const [, url] of lesson.html.matchAll(/<source src="([^"]+)"/g)) {
        expect(url).toMatch(/^https:\/\/everyayah\.com\/data\/khalefa_al_tunaiji_64kbps\/\d{6}\.mp3$/);
      }
    }
  });
});

describe('Nūrāniyyah pronunciation clips', () => {
  const urls = (html: string) => [...html.matchAll(/data-audio="([^"]+)"/g)].map((m) => m[1]);

  it('points every tappable card at a clip that exists', () => {
    const all = LESSONS.flatMap((l) => urls(l.html));
    expect(all.length).toBeGreaterThan(300);
    for (const url of all) {
      expect(url, url).toMatch(/^\/audio\/nuraniyyah\/cd\d{2}-(\d{3}|grp-\d{2})\.mp3$/);
      expect(existsSync(join(publicDir, url)), url).toBe(true);
    }
  });

  it('makes every letter of the alphabet tappable in Lesson 1', () => {
    expect(urls(LESSONS[0].html).length).toBeGreaterThanOrEqual(30);
  });

  it('makes the letter-by-letter lessons fully tappable', () => {
    for (const [lesson, count] of [[3, 15], [4, 28], [5, 28], [8, 56], [10, 16]] as const) {
      expect(urls(LESSONS[lesson - 1].html).length, `lesson ${lesson}`).toBeGreaterThanOrEqual(count);
    }
  });

  it('has an audio plan covering most of the exercise words and Lesson 2 cells', () => {
    expect(L2_CELL_CLIPS).toHaveLength(L2_CELLS.length);
    expect(L2_CELL_CLIPS.filter((c) => c !== null).length).toBeGreaterThan(80);
    for (const lesson of [6, 9, 11]) {
      const matched = Object.keys(WORD_CLIPS[lesson] ?? {}).length;
      expect(matched / EXERCISE_WORDS[lesson].length, `lesson ${lesson}`).toBeGreaterThan(0.6);
    }
    expect(SUKOON_GROUP_URLS).toHaveLength(16);
  });

  it('never assigns the same clip to two different words', () => {
    for (const lesson of [6, 9, 11]) {
      const clips = Object.values(WORD_CLIPS[lesson] ?? {});
      expect(new Set(clips).size, `lesson ${lesson}`).toBe(clips.length);
    }
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

  it('places the assessments around the book\'s lessons', () => {
    const seed = readPrisma('seed-nuraniyyah.ts');
    expect(seed).toMatch(/4,\s*\/\/ firstHalfLastOrderIndex/);
    expect(seed).toMatch(/10,\s*\/\/ originalMaxOrderIndex/);
  });
});
