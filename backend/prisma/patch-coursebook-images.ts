import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const COURSEBOOK_HTML_DIR = path.join(__dirname, '../../maktab-coursebook-html');
// Images are served by the backend at /coursebook-images; Vite proxies this path to localhost:3000
const IMAGES_BASE_URL = '/coursebook-images';

const COURSE_TITLE_MAP: Record<string, string> = {
  Coursebook1: 'Maktab Coursebook 1',
  Coursebook2: 'Maktab Coursebook 2',
  Coursebook3: 'Maktab Coursebook 3',
  Coursebook4: 'Maktab Coursebook 4',
  Coursebook5: 'Maktab Coursebook 5',
  Coursebook6Boys: 'An Nasihah Coursebook 6 (Boys)',
  Coursebook6Girls: 'An Nasihah Coursebook 6 (Girls)',
  Coursebook7: 'Maktab Coursebook 7',
  Coursebook8: 'An Nasihah Coursebook 8',
};

const SUBJECT_UNIT_MAP: Record<string, string> = {
  'fiqh': 'Fiqh',
  'a--d-th': 'Aḥādīth',
  's-rah': 'Sīrah',
  't-r-kh': 'Tārīkh',
  'aq--id': 'Aqā',
  'akhl-q': 'Akhlāq',
  '-d-b': 'Ādāb',
};

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'this', 'that', 'are', 'was',
  'has', 'have', 'its', 'into', 'here', 'about', 'before', 'after',
  'how', 'why', 'what', 'when', 'who', 'not',
]);

/** Strip the old "Visual Diagrams" block appended by the previous patch run. */
function stripOldDiagramsBlock(content: string): string {
  return content.replace(/<h2>Visual Diagrams<\/h2>[\s\S]*$/, '').trimEnd();
}

/** Extract meaningful keywords from an HTML heading string. */
function headingKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s:,;()''""\-–—]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Find the best-matching <h3> heading in dbContent for a given HTML article heading.
 * Returns the raw heading text (as it appears between <h3>…</h3>) or null if no match.
 * Already-used headings are skipped to prevent inserting multiple diagrams at the same spot.
 */
function findMatchingH3(
  htmlH3Text: string,
  dbContent: string,
  usedHeadings: Set<string>,
): string | null {
  const h3Regex = /<h3>([^<]+)<\/h3>/g;
  const candidates: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = h3Regex.exec(dbContent)) !== null) {
    if (!usedHeadings.has(m[1])) candidates.push(m[1]);
  }

  const keywords = headingKeywords(htmlH3Text);
  if (keywords.length === 0) return null;

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const candidate of candidates) {
    const lower = candidate.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = candidate;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

/** Insert diagramHtml immediately after the first occurrence of <h3>{h3Text}</h3>. */
function insertAfterH3(content: string, h3Text: string, diagramHtml: string): string {
  const tag = `<h3>${h3Text}</h3>`;
  const idx = content.indexOf(tag);
  if (idx === -1) return content;
  const insertAt = idx + tag.length;
  return content.slice(0, insertAt) + '\n' + diagramHtml + content.slice(insertAt);
}

/**
 * Insert diagramHtml at the top of the content body — right before the first <h3>,
 * used as a fallback when no heading keyword match is found.
 */
function insertBeforeFirstH3(content: string, diagramHtml: string): string {
  const idx = content.indexOf('<h3>');
  if (idx === -1) return content + '\n' + diagramHtml;
  return content.slice(0, idx) + diagramHtml + '\n' + content.slice(idx);
}

async function patchCourseBookImages() {
  let totalPatched = 0;
  let totalSkipped = 0;

  for (const [htmlBase, courseTitle] of Object.entries(COURSE_TITLE_MAP)) {
    const htmlPath = path.join(COURSEBOOK_HTML_DIR, `${htmlBase}.html`);
    if (!fs.existsSync(htmlPath)) {
      console.warn(`⚠️  HTML file not found: ${htmlPath}`);
      continue;
    }

    const html = fs.readFileSync(htmlPath, 'utf-8');

    const course = await prisma.course.findFirst({
      where: { title: { contains: courseTitle } },
    });
    if (!course) {
      console.warn(`⚠️  Course not found in DB: "${courseTitle}"`);
      continue;
    }

    // Match each <section class="subject" id="…"> block
    const sectionRegex =
      /<section[^>]+class="subject"[^>]+id="([^"]+)"[^>]*>([\s\S]*?)(?=<section[^>]+class="subject"|$)/g;
    let sectionMatch: RegExpExecArray | null;

    while ((sectionMatch = sectionRegex.exec(html)) !== null) {
      const subjectId = sectionMatch[1];
      const sectionHtml = sectionMatch[2];
      const unitKeyword = SUBJECT_UNIT_MAP[subjectId];
      if (!unitKeyword) continue;

      // Collect diagram articles: each <article> that contains a <div class="diagram">
      const articleRegex =
        /<article[^>]+id="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g;
      type DiagramArticle = { articleId: string; h3Text: string; filename: string; alt: string };
      const articles: DiagramArticle[] = [];
      let artMatch: RegExpExecArray | null;

      while ((artMatch = articleRegex.exec(sectionHtml)) !== null) {
        const articleId = artMatch[1];
        const articleBody = artMatch[2];
        if (!articleBody.includes('class="diagram"')) continue;

        // An article can have multiple diagrams; collect each one
        const imgRegex =
          /<div[^>]+class="diagram"[^>]*>\s*<img[^>]+src="images\/([^"]+)"[^>]*alt="([^"]*)"[^>]*/g;
        let imgMatch: RegExpExecArray | null;
        while ((imgMatch = imgRegex.exec(articleBody)) !== null) {
          const h3Match = articleBody.match(/<h3>([^<]+)<\/h3>/);
          const h3Text = h3Match ? h3Match[1] : articleId;
          articles.push({
            articleId,
            h3Text,
            filename: imgMatch[1],
            alt: imgMatch[2],
          });
        }
      }

      if (articles.length === 0) continue;

      const unit = await prisma.unit.findFirst({
        where: {
          courseId: course.id,
          title: { contains: unitKeyword },
        },
      });

      if (!unit) {
        console.warn(`⚠️  Unit not found: "${unitKeyword}" in "${courseTitle}"`);
        continue;
      }

      // Strip any previously appended "Visual Diagrams" block, then patch inline
      let content = stripOldDiagramsBlock(unit.content ?? '');
      const usedHeadings = new Set<string>();
      let insertedCount = 0;

      for (const article of articles) {
        const diagramHtml = `<div class="diagram"><img src="${IMAGES_BASE_URL}/${article.filename}" alt="${article.alt}" loading="lazy"></div>`;

        const matchedH3 = findMatchingH3(article.h3Text, content, usedHeadings);
        if (matchedH3) {
          content = insertAfterH3(content, matchedH3, diagramHtml);
          usedHeadings.add(matchedH3);
        } else {
          // Fallback: place before the first <h3> (section intro area)
          console.log(`  ℹ️  No heading match for "${article.h3Text}" — inserting at top`);
          content = insertBeforeFirstH3(content, diagramHtml);
        }
        insertedCount++;
      }

      await prisma.unit.update({
        where: { id: unit.id },
        data: { content },
      });

      console.log(`✅ Patched ${insertedCount} image(s) inline: ${courseTitle} — ${unit.title}`);
      totalPatched++;
    }
  }

  console.log('');
  console.log(`🎉 Done. Patched ${totalPatched} unit(s), skipped ${totalSkipped} already-patched unit(s).`);
}

patchCourseBookImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
