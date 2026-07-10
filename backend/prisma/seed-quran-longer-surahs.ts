import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Quran Memorization — Longer Surahs Course Seed
 *
 * Covers the longer surahs from the maktab syllabus (CB5–CB8) for older students:
 *   - Al-Kahf (first 10 ayahs only) — CB5
 *   - Yasin (83 ayahs)              — CB6
 *   - As-Sajdah (30 ayahs)          — CB7
 *   - Al-Mulk (30 ayahs)            — CB7
 *   - Al-Waqi'ah (96 ayahs)         — CB8
 *   - Ar-Rahman (78 ayahs)          — CB8
 *
 * Surahs 93 (Ad-Duha) and 94 (Ash-Sharh) are intentionally excluded — they are
 * already covered in the Juz Amma course.
 *
 * Each ayah becomes its own Unit with Arabic text, audio, transliteration, and
 * Saheeh International translation fetched live from api.quran.com.
 * Audio recitation: Sheikh Khalefa Al-Tunaiji via everyayah.com
 *
 * Can be run independently with: npx ts-node prisma/seed-quran-longer-surahs.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SurahInfo {
  number: number;
  name: string;
  ayahCount: number; // number of ayahs to include (may be less than full surah)
}

interface QuranVerseResponse {
  verses: Array<{ text_uthmani: string }>;
}

interface QuranTranslationResponse {
  translations: Array<{ text: string }>;
}

interface SurahData {
  arabicTexts: string[];
  transliterations: string[];
  translations: string[];
}

// ---------------------------------------------------------------------------
// Course definition
// ---------------------------------------------------------------------------

const COURSE_TITLE = 'Quran Memorization — Longer Surahs';

const SURAHS: SurahInfo[] = [
  // CB5 — Age 10-11 (first 10 ayahs of Al-Kahf only)
  { number: 18, name: 'Al-Kahf (First 10 Ayat)', ayahCount: 10 },

  // CB6 — Age 11-12
  { number: 36, name: 'Yasin',      ayahCount: 83 },

  // CB7 — Age 12-13
  { number: 32, name: 'As-Sajdah',  ayahCount: 30 },
  { number: 67, name: 'Al-Mulk',    ayahCount: 30 },

  // CB8 — Age 13-14
  { number: 56, name: "Al-Waqi'ah", ayahCount: 96 },
  { number: 55, name: 'Ar-Rahman',  ayahCount: 78 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pad3(n: number): string {
  return String(n).padStart(3, '0');
}

function buildAudioUrl(surahNum: number, ayahNum: number): string {
  return `https://everyayah.com/data/khalefa_al_tunaiji_64kbps/${pad3(surahNum)}${pad3(ayahNum)}.mp3`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildUnitContent(
  arabicText: string,
  audioSrc: string,
  transliteration: string,
  translation: string,
): string {
  return `<div class="quran-verse">
  <p class="arabic-large" dir="rtl" lang="ar">${arabicText}</p>
  <audio controls style="width:100%; margin-top: 1rem;">
    <source src="${audioSrc}" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
</div>

<h3>Transliteration</h3>
<p style="font-size: 1.1rem; color: #4b5563; font-style: italic;">${transliteration}</p>

<h3>Translation</h3>
<p style="font-size: 1.1rem; color: #374151;">${translation}</p>`;
}

function buildSurahReviewContent(
  surahName: string,
  surahData: SurahData,
  surahNumber: number,
): string {
  // Continuous Arabic text block — all ayahs together
  const arabicBlock = surahData.arabicTexts
    .map((text, i) => `<span>${text}</span> <span style="color:#9ca3af;font-size:0.7em;">(${i + 1})</span>`)
    .join(' ');

  // Transliteration + translation listed per ayah below
  const ayahDetails = surahData.arabicTexts
    .map((_, index) => {
      const transliteration = surahData.transliterations[index] ?? '';
      const translation = surahData.translations[index] ?? '';
      return `<div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb;">
  <p style="font-size: 0.85rem; color: #6b7280; margin-bottom: 0.25rem;">Ayah ${index + 1}</p>
  <p style="font-size: 1.1rem; color: #4b5563; font-style: italic;">${transliteration}</p>
  <p style="font-size: 1.05rem; color: #374151; margin-top: 0.5rem;">${translation}</p>
</div>`;
    })
    .join('\n');

  const firstAudioSrc = buildAudioUrl(surahNumber, 1);
  const allAudioUrls = surahData.arabicTexts
    .map((_, i) => buildAudioUrl(surahNumber, i + 1))
    .join(',');

  return `<h2>Full Surah Review: ${surahName}</h2>
<p style="margin-bottom: 1.5rem;">Review the complete surah. Listen to the full recitation, follow along, and check your memorization.</p>

<div class="quran-verse">
  <p class="arabic-large" dir="rtl" lang="ar" style="line-height: 2.5;">${arabicBlock}</p>
  <audio controls style="width:100%; margin-top: 1.5rem;" data-playlist="${allAudioUrls}">
    <source src="${firstAudioSrc}" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
</div>

<h3 style="margin-top: 2rem;">Transliteration &amp; Translation</h3>
${ayahDetails}

<p style="margin-top: 1.5rem; font-weight: 600;">Listen to the complete surah, review your memorization, then click &ldquo;Surah Completed&rdquo; below.</p>`;
}

// ---------------------------------------------------------------------------
// API fetching
// ---------------------------------------------------------------------------

async function fetchSurahData(surahNumber: number, limitToAyahs?: number): Promise<SurahData> {
  const [arabicRes, translitRes, translationRes] = await Promise.all([
    fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahNumber}`),
    fetch(`https://api.quran.com/api/v4/quran/translations/57?chapter_number=${surahNumber}`),
    fetch(`https://api.quran.com/api/v4/quran/translations/20?chapter_number=${surahNumber}`),
  ]);

  if (!arabicRes.ok) {
    throw new Error(`Arabic API failed for surah ${surahNumber}: HTTP ${arabicRes.status}`);
  }
  if (!translitRes.ok) {
    throw new Error(`Transliteration API failed for surah ${surahNumber}: HTTP ${translitRes.status}`);
  }
  if (!translationRes.ok) {
    throw new Error(`Translation API failed for surah ${surahNumber}: HTTP ${translationRes.status}`);
  }

  const arabicData = (await arabicRes.json()) as QuranVerseResponse;
  const translitData = (await translitRes.json()) as QuranTranslationResponse;
  const translationData = (await translationRes.json()) as QuranTranslationResponse;

  let arabicTexts = arabicData.verses.map(v => v.text_uthmani);
  let transliterations = translitData.translations.map(t => t.text);
  let translations = translationData.translations.map(t => stripHtml(t.text));

  // If limitToAyahs is set (e.g. Al-Kahf first 10), slice client-side
  if (limitToAyahs !== undefined && limitToAyahs > 0) {
    arabicTexts = arabicTexts.slice(0, limitToAyahs);
    transliterations = transliterations.slice(0, limitToAyahs);
    translations = translations.slice(0, limitToAyahs);
  }

  return { arabicTexts, transliterations, translations };
}

// ---------------------------------------------------------------------------
// Slug generation — stable identifiers that survive re-seeds
// ---------------------------------------------------------------------------

function surahSlug(surahName: string): string {
  return surahName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ayahSlug(surahName: string, ayahNum: number): string {
  return `${surahSlug(surahName)}-ayah-${ayahNum}`;
}

function reviewSlug(surahName: string): string {
  return `${surahSlug(surahName)}-review`;
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

export async function seedQuranLongerSurahs() {
  console.log('📖 Starting Quran Memorization — Longer Surahs course seed...');
  console.log('   Mode: UPSERT (preserves enrollments and progress)');
  console.log('');

  const demoFamily = await prisma.family.findFirst({
    where: { name: 'Ahmad Family' },
  });

  if (!demoFamily) {
    console.log('⚠️  Demo family not found. Please run main seed first.');
    return;
  }

  console.log('✅ Found demo family:', demoFamily.name);

  // Upsert the course — find by title, create if missing, update if exists
  let course = await prisma.course.findFirst({
    where: { title: COURSE_TITLE },
  });

  if (course) {
    console.log('✅ Found existing course — updating in place (enrollments preserved)');
    course = await prisma.course.update({
      where: { id: course.id },
      data: {
        description:
          'Memorize the longer surahs of the Quran one ayah at a time. This course covers ' +
          'Al-Kahf (first 10 ayahs), Yasin, As-Sajdah, Al-Mulk, Al-Waqi\'ah, and Ar-Rahman, ' +
          'presented with Arabic text, audio recitation by Sheikh Khalefa Al-Tunaiji, ' +
          'transliteration, and Saheeh International translation. Designed for students ages 10–14 ' +
          'following the maktab CB5–CB8 syllabus.',
        category: 'QURAN',
        ageLevels: ['CHILD', 'PRE_TEEN', 'TEEN'],
        thumbnailUrl: '/images/courses/quran-memorization-longer-surahs.jpg',
        isPublished: true,
        contentVersion: { increment: 1 },
      },
    });
  } else {
    console.log('✅ Creating new course');
    course = await prisma.course.create({
      data: {
        title: COURSE_TITLE,
        description:
          'Memorize the longer surahs of the Quran one ayah at a time. This course covers ' +
          'Al-Kahf (first 10 ayahs), Yasin, As-Sajdah, Al-Mulk, Al-Waqi\'ah, and Ar-Rahman, ' +
          'presented with Arabic text, audio recitation by Sheikh Khalefa Al-Tunaiji, ' +
          'transliteration, and Saheeh International translation. Designed for students ages 10–14 ' +
          'following the maktab CB5–CB8 syllabus.',
        category: 'QURAN',
        ageLevels: ['CHILD', 'PRE_TEEN', 'TEEN'],
        thumbnailUrl: '/images/courses/quran-memorization-longer-surahs.jpg',
        isPublished: true,
      },
    });
  }

  console.log(`   Course ID: ${course.id}`);
  console.log('');

  // Pre-cleanup: remove units without slugs (legacy format) to free orderIndex slots
  const legacyUnits = await prisma.unit.findMany({
    where: { courseId: course.id, slug: null },
    select: { id: true, title: true },
  });
  if (legacyUnits.length > 0) {
    console.log(`   🧹 Removing ${legacyUnits.length} legacy units (no slug) from previous seed format...`);
    await prisma.unit.deleteMany({
      where: { id: { in: legacyUnits.map(u => u.id) } },
    });
    console.log('   ✅ Legacy units removed');
    console.log('');
  }

  let globalOrderIndex = 0;
  let created = 0;
  let updated = 0;
  const activeUnitSlugs: string[] = [];

  for (const surah of SURAHS) {
    console.log(
      `   📖 Surah ${surah.number} — ${surah.name} (${surah.ayahCount} ayahs) — fetching...`,
    );

    // For Al-Kahf we fetch all verses but slice to the first 10 client-side
    const limitToAyahs = surah.number === 18 ? surah.ayahCount : undefined;

    let surahData: SurahData;
    try {
      surahData = await fetchSurahData(surah.number, limitToAyahs);
    } catch (err) {
      console.error(
        `❌ Failed to fetch data for Surah ${surah.number} (${surah.name}):`,
        err,
      );
      throw err;
    }

    // Upsert each ayah unit
    for (let ayahIndex = 0; ayahIndex < surah.ayahCount; ayahIndex++) {
      const ayahNum = ayahIndex + 1;
      const arabic = surahData.arabicTexts[ayahIndex] ?? '';
      const translit = surahData.transliterations[ayahIndex] ?? '';
      const translation = surahData.translations[ayahIndex] ?? '';
      const audio = buildAudioUrl(surah.number, ayahNum);
      const slug = ayahSlug(surah.name, ayahNum);
      activeUnitSlugs.push(slug);

      const existingUnit = await prisma.unit.findFirst({
        where: { courseId: course.id, slug },
      });

      let unitId: string;
      if (existingUnit) {
        await prisma.unit.update({
          where: { id: existingUnit.id },
          data: {
            title: `${surah.name} - Ayah ${ayahNum}`,
            description: `Memorize Ayah ${ayahNum} of Surah ${surah.name} (${surah.number}:${ayahNum})`,
            orderIndex: globalOrderIndex,
            content: buildUnitContent(arabic, audio, translit, translation),
          },
        });
        unitId = existingUnit.id;
        updated++;
      } else {
        const newUnit = await prisma.unit.create({
          data: {
            courseId: course.id,
            slug,
            title: `${surah.name} - Ayah ${ayahNum}`,
            description: `Memorize Ayah ${ayahNum} of Surah ${surah.name} (${surah.number}:${ayahNum})`,
            orderIndex: globalOrderIndex,
            content: buildUnitContent(arabic, audio, translit, translation),
          },
        });
        unitId = newUnit.id;
        created++;
      }

      // Upsert audio resource and arabic term (delete old, create new for simplicity)
      await prisma.audioResource.deleteMany({ where: { unitId } });
      await prisma.audioResource.create({
        data: {
          unitId,
          title: `${surah.name} — Ayah ${ayahNum} (Khalefa Al-Tunaiji)`,
          url: audio,
          orderIndex: 0,
        },
      });

      await prisma.arabicTerm.deleteMany({ where: { unitId } });
      await prisma.arabicTerm.create({
        data: {
          unitId,
          arabicText: arabic,
          transliteration: translit,
          translation,
          audioUrl: audio,
        },
      });

      globalOrderIndex++;
    }

    // Upsert surah review unit
    const revSlug = reviewSlug(surah.name);
    activeUnitSlugs.push(revSlug);

    const existingReview = await prisma.unit.findFirst({
      where: { courseId: course.id, slug: revSlug },
    });

    let reviewUnitId: string;
    if (existingReview) {
      await prisma.unit.update({
        where: { id: existingReview.id },
        data: {
          title: `${surah.name} - Full Surah Review`,
          description:
            `Review the complete Surah ${surah.name}. ` +
            `Listen to the full recitation and check your memorization.`,
          orderIndex: globalOrderIndex,
          content: buildSurahReviewContent(surah.name, surahData, surah.number),
        },
      });
      reviewUnitId = existingReview.id;
      updated++;
    } else {
      const newReview = await prisma.unit.create({
        data: {
          courseId: course.id,
          slug: revSlug,
          title: `${surah.name} - Full Surah Review`,
          description:
            `Review the complete Surah ${surah.name}. ` +
            `Listen to the full recitation and check your memorization.`,
          orderIndex: globalOrderIndex,
          content: buildSurahReviewContent(surah.name, surahData, surah.number),
        },
      });
      reviewUnitId = newReview.id;
      created++;
    }

    // Refresh audio/arabic for review unit
    await prisma.audioResource.deleteMany({ where: { unitId: reviewUnitId } });
    await prisma.arabicTerm.deleteMany({ where: { unitId: reviewUnitId } });

    await Promise.all(
      surahData.arabicTexts.map((arabicText, index) => {
        const ayahNum = index + 1;
        const audio = buildAudioUrl(surah.number, ayahNum);

        return Promise.all([
          prisma.audioResource.create({
            data: {
              unitId: reviewUnitId,
              title: `${surah.name} — Full Review Ayah ${ayahNum} (Khalefa Al-Tunaiji)`,
              url: audio,
              orderIndex: index,
            },
          }),
          prisma.arabicTerm.create({
            data: {
              unitId: reviewUnitId,
              arabicText,
              transliteration: surahData.transliterations[index] ?? '',
              translation: surahData.translations[index] ?? '',
              audioUrl: audio,
            },
          }),
        ]);
      }),
    );

    globalOrderIndex++;

    console.log(`   ✅ ${surah.name}: ${surah.ayahCount + 1} units processed`);

    // Be polite to the quran.com API — 300ms between surahs
    await sleep(300);
  }

  // Clean up orphaned units (units in this course that no longer have a valid slug)
  const orphanedUnits = await prisma.unit.findMany({
    where: {
      courseId: course.id,
      OR: [
        { slug: null },
        { slug: { notIn: activeUnitSlugs } },
      ],
    },
    select: { id: true, title: true },
  });

  if (orphanedUnits.length > 0) {
    console.log(`   🧹 Removing ${orphanedUnits.length} orphaned units from previous format...`);
    for (const orphan of orphanedUnits) {
      console.log(`      - ${orphan.title}`);
    }
    await prisma.unit.deleteMany({
      where: { id: { in: orphanedUnits.map(u => u.id) } },
    });
  }

  console.log('');
  console.log(
    `✅ Quran Memorization — Longer Surahs course complete — ${created} created, ${updated} updated, ${orphanedUnits.length} removed`,
  );
  console.log(`   Total active units: ${activeUnitSlugs.length} across ${SURAHS.length} surahs`);
}

// Allow standalone execution
if (require.main === module) {
  seedQuranLongerSurahs()
    .catch(err => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
