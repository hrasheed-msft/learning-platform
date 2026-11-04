/**
 * Exports what the audio tooling needs to work/content.json: every cell/word of the lessons in book order,
 * and the URLs of the clips the lessons reference.
 *
 *   cd backend
 *   $env:TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","moduleResolution":"node"}'
 *   npx ts-node --transpile-only ../tools/nuraniyyah-audio/export-content.ts
 */
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { spell } from '../../backend/prisma/helpers/nuraniyyah-arabic';
import { EXERCISE_WORDS, L2_CELLS } from '../../backend/prisma/helpers/nuraniyyah-data';
import { NURANIYYAH_LESSONS } from '../../backend/prisma/helpers/nuraniyyah-lessons';

const urls = new Set<string>();
for (const lesson of NURANIYYAH_LESSONS) {
  for (const m of lesson.html.matchAll(/data-audio="([^"]+)"/g)) urls.add(m[1]);
}

const content = {
  l2Cells: L2_CELLS.map((c) => ({ ar: c, spelled: spell(c) })),
  words: EXERCISE_WORDS,
  urls: [...urls].filter((u) => u.startsWith('/audio/nuraniyyah/')).sort(),
};

const dir = join(__dirname, 'work');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'content.json'), JSON.stringify(content), 'utf8');
console.log(`${content.l2Cells.length} L2 cells, ${Object.values(content.words).flat().length} words, ${content.urls.length} clip URLs`);
