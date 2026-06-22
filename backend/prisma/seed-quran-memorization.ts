import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Quran Memorization — Short Surahs (Juz Amma) Course Seed
 *
 * Covers Al-Fatiha (1) first, then surahs 114 → 93 in reverse order.
 * Each ayah becomes its own Unit with Arabic text, audio, transliteration,
 * and Saheeh International translation fetched live from api.quran.com.
 *
 * Audio recitation: Sheikh Khalefa Al-Tunaiji via everyayah.com
 *
 * Can be run independently with: npx ts-node prisma/seed-quran-memorization.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SurahInfo {
  number: number;
  name: string;
  ayahCount: number;
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

const COURSE_TITLE = 'Quran Memorization — Short Surahs (Juz Amma)';

const SURAHS: SurahInfo[] = [
  { number: 1,   name: 'Al-Fatiha',   ayahCount: 7  },
  { number: 114, name: 'An-Nas',      ayahCount: 6  },
  { number: 113, name: 'Al-Falaq',    ayahCount: 5  },
  { number: 112, name: 'Al-Ikhlas',   ayahCount: 4  },
  { number: 111, name: 'Al-Masad',    ayahCount: 5  },
  { number: 110, name: 'An-Nasr',     ayahCount: 3  },
  { number: 109, name: 'Al-Kafirun',  ayahCount: 6  },
  { number: 108, name: 'Al-Kawthar',  ayahCount: 3  },
  { number: 107, name: "Al-Ma'un",    ayahCount: 7  },
  { number: 106, name: 'Quraysh',     ayahCount: 4  },
  { number: 105, name: 'Al-Fil',      ayahCount: 5  },
  { number: 104, name: 'Al-Humazah',  ayahCount: 9  },
  { number: 103, name: 'Al-Asr',      ayahCount: 3  },
  { number: 102, name: 'At-Takathur', ayahCount: 8  },
  { number: 101, name: "Al-Qari'ah",  ayahCount: 11 },
  { number: 100, name: 'Al-Adiyat',   ayahCount: 11 },
  { number: 99,  name: 'Az-Zalzalah', ayahCount: 8  },
  { number: 98,  name: 'Al-Bayyinah', ayahCount: 8  },
  { number: 97,  name: 'Al-Qadr',     ayahCount: 5  },
  { number: 96,  name: 'Al-Alaq',     ayahCount: 19 },
  { number: 95,  name: 'At-Tin',      ayahCount: 8  },
  { number: 94,  name: 'Ash-Sharh',   ayahCount: 8  },
  { number: 93,  name: 'Ad-Duha',     ayahCount: 11 },
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

// ---------------------------------------------------------------------------
// API fetching
// ---------------------------------------------------------------------------

async function fetchSurahData(surahNumber: number): Promise<SurahData> {
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

  return {
    arabicTexts: arabicData.verses.map(v => v.text_uthmani),
    transliterations: translitData.translations.map(t => t.text),
    translations: translationData.translations.map(t => stripHtml(t.text)),
  };
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

export async function seedQuranMemorizationCourse() {
  console.log('📖 Starting Quran Memorization — Short Surahs (Juz Amma) course seed...');
  console.log('');

  const demoFamily = await prisma.family.findFirst({
    where: { name: 'Ahmad Family' },
  });

  if (!demoFamily) {
    console.log('⚠️  Demo family not found. Please run main seed first.');
    return;
  }

  console.log('✅ Found demo family:', demoFamily.name);

  const existingCourse = await prisma.course.findFirst({
    where: { title: COURSE_TITLE },
  });

  if (existingCourse) {
    console.log('⚠️  Quran Memorization course already exists. Deleting old version...');
    await prisma.course.delete({ where: { id: existingCourse.id } });
    console.log('✅ Deleted old version');
  }

  const course = await prisma.course.create({
    data: {
      title: COURSE_TITLE,
      description:
        'Memorize the short surahs of Juz Amma one ayah at a time. This course covers ' +
        'Al-Fatiha and surahs 93–114, presented in a child-friendly sequence with Arabic ' +
        'text, audio recitation by Sheikh Khalefa Al-Tunaiji, transliteration, and ' +
        'Saheeh International translation. Perfect for ages 3–10.',
      category: 'QURAN',
      ageLevels: ['EARLY_CHILD', 'CHILD'],
      thumbnailUrl: '/images/courses/quran-memorization-short-surahs.jpg',
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);
  console.log('');

  let globalOrderIndex = 0;
  let totalUnits = 0;

  for (const surah of SURAHS) {
    console.log(
      `   📖 Surah ${surah.number} — ${surah.name} (${surah.ayahCount} ayahs) — fetching...`,
    );

    let surahData: SurahData;
    try {
      surahData = await fetchSurahData(surah.number);
    } catch (err) {
      console.error(
        `❌ Failed to fetch data for Surah ${surah.number} (${surah.name}):`,
        err,
      );
      throw err;
    }

    for (let ayahIndex = 0; ayahIndex < surah.ayahCount; ayahIndex++) {
      const ayahNum = ayahIndex + 1;
      const arabic = surahData.arabicTexts[ayahIndex] ?? '';
      const translit = surahData.transliterations[ayahIndex] ?? '';
      const translation = surahData.translations[ayahIndex] ?? '';
      const audio = buildAudioUrl(surah.number, ayahNum);

      const unit = await prisma.unit.create({
        data: {
          courseId: course.id,
          title: `${surah.name} - Ayah ${ayahNum}`,
          description: `Memorize Ayah ${ayahNum} of Surah ${surah.name} (${surah.number}:${ayahNum})`,
          orderIndex: globalOrderIndex,
          content: buildUnitContent(arabic, audio, translit, translation),
        },
      });

      await prisma.audioResource.create({
        data: {
          unitId: unit.id,
          title: `${surah.name} — Ayah ${ayahNum} (Khalefa Al-Tunaiji)`,
          url: audio,
          orderIndex: 0,
        },
      });

      await prisma.arabicTerm.create({
        data: {
          unitId: unit.id,
          arabicText: arabic,
          transliteration: translit,
          translation: translation,
          audioUrl: audio,
        },
      });

      globalOrderIndex++;
      totalUnits++;
    }

    console.log(`   ✅ ${surah.name}: ${surah.ayahCount} units created`);

    // Be polite to the quran.com API — 300ms between surahs
    await sleep(300);
  }

  console.log('');
  console.log(
    `✅ Quran Memorization course complete — ${totalUnits} units across ${SURAHS.length} surahs`,
  );
}

// Allow standalone execution
if (require.main === module) {
  seedQuranMemorizationCourse()
    .catch(err => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
