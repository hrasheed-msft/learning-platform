import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const COURSEBOOK_HTML_DIR = path.join(__dirname, '../../maktab-coursebook-html');
const IMAGES_BASE_URL = '/coursebook-images';

// Map HTML filename (without .html) to the course title stored in the DB
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

// Map HTML <section> id to a keyword present in the corresponding DB unit title
const SUBJECT_UNIT_MAP: Record<string, string> = {
  'fiqh': 'Fiqh',
  'a--d-th': 'Aḥādīth',
  's-rah': 'Sīrah',
  't-r-kh': 'Tārīkh',
  'aq--id': 'Aqā',
  'akhl-q': 'Akhlāq',
  '-d-b': 'Ādāb',
};

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

    // Match each <section class="subject" id="..."> block
    const sectionRegex =
      /<section[^>]+class="subject"[^>]+id="([^"]+)"[^>]*>([\s\S]*?)(?=<section[^>]+class="subject"|$)/g;
    let sectionMatch: RegExpExecArray | null;

    while ((sectionMatch = sectionRegex.exec(html)) !== null) {
      const subjectId = sectionMatch[1];
      const sectionHtml = sectionMatch[2];
      const unitKeyword = SUBJECT_UNIT_MAP[subjectId];
      if (!unitKeyword) continue;

      // Extract all diagram img tags in this section
      const imgRegex =
        /<div[^>]+class="diagram"[^>]*>\s*<img[^>]+src="images\/([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g;
      const images: Array<{ filename: string; alt: string }> = [];
      let imgMatch: RegExpExecArray | null;

      while ((imgMatch = imgRegex.exec(sectionHtml)) !== null) {
        images.push({ filename: imgMatch[1], alt: imgMatch[2] });
      }

      if (images.length === 0) continue;

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

      if (unit.content?.includes('coursebook-images')) {
        console.log(`⏭️  Already patched: ${courseTitle} — ${unit.title}`);
        totalSkipped++;
        continue;
      }

      const diagramsHtml =
        `\n\n<h2>Visual Diagrams</h2>\n<div class="diagrams-grid">\n` +
        images
          .map(
            (img) =>
              `  <div class="diagram">\n    <img src="${IMAGES_BASE_URL}/${img.filename}" alt="${img.alt}" loading="lazy">\n  </div>`,
          )
          .join('\n') +
        `\n</div>`;

      await prisma.unit.update({
        where: { id: unit.id },
        data: { content: (unit.content ?? '') + diagramsHtml },
      });

      console.log(
        `✅ Patched ${images.length} image(s): ${courseTitle} — ${unit.title}`,
      );
      totalPatched++;
    }
  }

  console.log('');
  console.log(`🎉 Done. Patched ${totalPatched} unit(s), skipped ${totalSkipped} already-patched unit(s).`);
}

patchCourseBookImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
