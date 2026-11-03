/**
 * Exports every Arabic practice item shown in the Nūrāniyyah lessons to work/words.json so
 * build_audio_map.py can match them to the recorded clips.
 *
 *   cd backend && npx ts-node --transpile-only ../tools/nuraniyyah-audio/export-words.ts
 */
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { LESSONS_PART_1 } from '../../backend/prisma/helpers/nuraniyyah-lessons-1';
import { LESSONS_PART_2 } from '../../backend/prisma/helpers/nuraniyyah-lessons-2';
import { LESSONS_PART_3 } from '../../backend/prisma/helpers/nuraniyyah-lessons-3';

const out: Record<string, Array<{ ar: string; tr: string }>> = {};
const card = /<p lang="ar"[^>]*>([^<]*)<\/p>\s*<p dir="ltr"[^>]*>([^<]*)/g;

for (const lesson of [...LESSONS_PART_1, ...LESSONS_PART_2, ...LESSONS_PART_3]) {
  out[lesson.slug] = [];
  for (const m of lesson.html.matchAll(card)) {
    out[lesson.slug].push({ ar: m[1].trim(), tr: m[2].replace('🔊', '').trim() });
  }
}

const dir = join(__dirname, 'work');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'words.json'), JSON.stringify(out), 'utf8');
console.log(`Exported ${Object.values(out).reduce((n, l) => n + l.length, 0)} items to ${join(dir, 'words.json')}`);
