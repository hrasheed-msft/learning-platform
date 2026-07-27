import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 4 — Islamic Curriculum Seed (Restructured)
 * Source: An Nasihah Publications, Age Range: 9–10 years
 *
 * 14 focused units — each covering exactly ONE main topic.
 * Subjects: Fiqh (3), Ahadith (2), Sirah (2), Tarikh (2),
 *           Aqaid (2), Akhlaq (2), Adab (1)
 */

export async function seedMaktabCoursebook4() {
  console.log('📚 Starting Maktab Coursebook 4 seed...');
  console.log('');

  const demoFamily = await prisma.family.findFirst({
    where: { name: 'Ahmad Family' },
  });

  if (!demoFamily) {
    console.log('⚠️  Demo family not found. Please run main seed first.');
    return;
  }

  console.log('✅ Found demo family:', demoFamily.name);

  // ─────────────────────────────────────────────
  // COURSE
  // ─────────────────────────────────────────────

  const course = await prisma.course.upsert({
    where: { slug: 'maktab-coursebook-4' },
    create: {
      slug: 'maktab-coursebook-4',
      title: 'Maktab Coursebook 4',
      description: 'An Islamic curriculum for learners aged 9-10 years covering masah on khuffayn, wajib acts and sajdah as-sahw, sawm and tarawih, ahadith on charity and character, trust dhikr and dua, the hijrah to Madinah, brotherhood treaties and the battle of the Trench, the story of Prophet Yusuf, major signs of Qiyamah, protection from Dajjal, akhlaq of amanah and neighbours, and adab of dua dressing guests and istinja. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 4',
      description: 'An Islamic curriculum for learners aged 9-10 years covering masah on khuffayn, wajib acts and sajdah as-sahw, sawm and tarawih, ahadith on charity and character, trust dhikr and dua, the hijrah to Madinah, brotherhood treaties and the battle of the Trench, the story of Prophet Yusuf, major signs of Qiyamah, protection from Dajjal, akhlaq of amanah and neighbours, and adab of dua dressing guests and istinja. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ─────────────────────────────────────────────
  // CLEANUP: Remove old broad-subject units
  // ─────────────────────────────────────────────
  const oldSlugs = ['maktab-4-fiqh', 'maktab-4-ahadith', 'maktab-4-sirah', 'maktab-4-tarikh', 'maktab-4-aqaid', 'maktab-4-akhlaq', 'maktab-4-adab'];
  for (const slug of oldSlugs) {
    const old = await prisma.unit.findFirst({ where: { courseId: course.id, slug } });
    if (old) {
      await prisma.question.deleteMany({ where: { unitId: old.id } });
      await prisma.unitProgress.deleteMany({ where: { unitId: old.id } });
      await prisma.unit.delete({ where: { id: old.id } });
    }
  }

  // ═════════════════════════════════════════════
  // FIQH UNITS (3 focused units)
  // ═════════════════════════════════════════════

  // ─────────────────────────────────────────────
  // UNIT 1: FIQH — Masah alal Khuffayn
  // ─────────────────────────────────────────────

  const masahContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain what masah alal khuffayn is, state the conditions, duration, and method, identify what invalidates masah, and describe masah on wounds (jabirah).</p>

<h2>Masah alal Khuffayn — Wiping on Leather Socks</h2>

<h3>What Is Masah alal Khuffayn?</h3>
<p>Masah alal khuffayn means wiping over leather socks (khuffayn) or thick footwear instead of washing the feet during wudu. Allah has made this a concession to make the religion easy for us. The Prophet ﷺ practised and permitted this.</p>

<h3>Conditions for Masah to Be Valid</h3>
<ul>
  <li>The khuffs must have been put on <strong>while already in a state of wudu</strong>.</li>
  <li>The khuffs must cover the ankles completely.</li>
  <li>The khuffs must not have a hole larger than three small toes.</li>
  <li>They must be able to stay on the foot without needing to be tied.</li>
</ul>

<h3>Duration of Masah</h3>
<p>The duration begins from the <em>first time wudu breaks</em> after putting on the khuffs:</p>
<ul>
  <li><strong>Resident (Muqim):</strong> One day and one night — 24 hours.</li>
  <li><strong>Traveller (Musafir):</strong> Three days and three nights — 72 hours.</li>
</ul>

<h3>How to Perform Masah</h3>
<ol>
  <li>Wet the fingers of both hands.</li>
  <li>Place the fingers on the toes of each khuff.</li>
  <li>Wipe from the toes upward and forward towards the shin.</li>
  <li>Wipe the <em>top</em> of the foot only — not the sole or back.</li>
  <li>Each foot is wiped just once with wet hands.</li>
</ol>

<h3>What Invalidates Masah</h3>
<ul>
  <li>Removing the khuff from either foot.</li>
  <li>The duration of masah coming to an end.</li>
  <li>Anything that requires a full ghusl (ritual bath), such as major ritual impurity.</li>
</ul>
<p>Note: If only wudu breaks (e.g., passing wind), you renew wudu and may wipe again — the masah itself is not invalidated yet.</p>

<h3>Masah on Wounds — Jabirah</h3>
<p>If a person has a bandage, cast, or dressing on a wound (jabirah), they may wipe over it during wudu or ghusl instead of washing the area, provided that removing it would cause harm or delay healing. There is no time limit for this masah on wounds.</p>
`.trim();

  const unitMasah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-fiqh-masah' } },
    create: {
      slug: 'maktab-4-fiqh-masah',
      courseId: course.id,
      orderIndex: 1,
      title: 'Fiqh — Masah alal Khuffayn',
      description: 'What masah alal khuffayn is, the conditions for its validity, duration for resident vs traveller, how to perform it, what invalidates it, and masah on wounds (jabirah).',
      content: masahContent,
    },
    update: {
      title: 'Fiqh — Masah alal Khuffayn',
      description: 'What masah alal khuffayn is, the conditions for its validity, duration for resident vs traveller, how to perform it, what invalidates it, and masah on wounds (jabirah).',
      content: masahContent,
      orderIndex: 1,
    },
  });

  console.log('✅ Unit 1:', unitMasah.title);

  // ─────────────────────────────────────────────
  // UNIT 2: FIQH — Wajib Acts & Sajdah as-Sahw
  // ─────────────────────────────────────────────

  const wajibContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to list the wajib acts of salah, explain what happens if they are missed intentionally or forgetfully, and describe how to perform sajdah as-sahw.</p>

<h2>Wajib Acts in Salah</h2>

<h3>What Is a Wajib Act?</h3>
<p>A wajib act is one that is obligatory but ranks <em>below</em> fard (compulsory). If a wajib act is omitted:</p>
<ul>
  <li><strong>Intentionally:</strong> The salah is invalid and must be repeated.</li>
  <li><strong>Forgetfully:</strong> The salah is not repeated, but sajdah as-sahw (prostration of forgetfulness) must be performed.</li>
</ul>

<h3>List of Wajib Acts in Salah</h3>
<ol>
  <li>Saying <em>Allahu Akbar</em> for every change of posture (except the opening takbir which is fard).</li>
  <li>Reciting Surah al-Fatihah in every rakah.</li>
  <li>Reciting a surah or three short verses after al-Fatihah in the first two rakahs.</li>
  <li>Performing ruku and sujud with <em>tama'ninah</em> (stillness and calm).</li>
  <li>Sitting for the first qadah in three- or four-rakah prayers.</li>
  <li>Reciting the full tashahhud in every qadah.</li>
  <li>Ending the salah with the salam (taslim).</li>
  <li>Reciting the Qunut dua in Witr salah.</li>
  <li>Saying the extra takbirs in Eid salah.</li>
</ol>

<h3>What Is Sajdah as-Sahw?</h3>
<p>Sajdah as-sahw means the prostration of forgetfulness. It is performed to compensate for accidentally missing a wajib act in salah.</p>

<h3>How to Perform Sajdah as-Sahw</h3>
<ol>
  <li>After completing the final tashahhud, turn only to the <em>right</em> for one salam: <em>Assalamu alaykum wa rahmatullah</em>.</li>
  <li>Then perform two sujuds (prostrations), each with the standard tasbih: <em>Subhana Rabbiyal Ala</em>.</li>
  <li>Sit up after the two sujuds and recite the full tashahhud again.</li>
  <li>End the salah with the full two salams (right and left).</li>
</ol>
<p>Sajdah as-sahw is only performed at the <em>end</em> of salah, not in the middle.</p>
`.trim();

  const unitWajib = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-fiqh-wajib-sajda' } },
    create: {
      slug: 'maktab-4-fiqh-wajib-sajda',
      courseId: course.id,
      orderIndex: 2,
      title: 'Fiqh — Wajib Acts & Sajdah as-Sahw',
      description: 'The wajib acts of salah, consequences of omitting them intentionally vs forgetfully, and how to perform sajdah as-sahw (prostration of forgetfulness).',
      content: wajibContent,
    },
    update: {
      title: 'Fiqh — Wajib Acts & Sajdah as-Sahw',
      description: 'The wajib acts of salah, consequences of omitting them intentionally vs forgetfully, and how to perform sajdah as-sahw (prostration of forgetfulness).',
      content: wajibContent,
      orderIndex: 2,
    },
  });

  console.log('✅ Unit 2:', unitWajib.title);

  // ─────────────────────────────────────────────
  // UNIT 3: FIQH — Sawm & Tarawih
  // ─────────────────────────────────────────────

  const sawmContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the conditions of fasting, identify what breaks the fast and the consequences, name things that do not break the fast, describe who is excused, define fidyah, and describe Tarawih salah.</p>

<h2>Sawm — Fasting in Ramadan</h2>

<h3>Conditions of Fasting (Sawm)</h3>
<ul>
  <li>Making the intention (niyyah) before the time of Fajr.</li>
  <li>Being Muslim, sane, and mature (baligh).</li>
  <li>Not being in a state requiring ghusl at the start of the fast.</li>
</ul>

<h3>What Breaks the Fast — Requiring Qada Only</h3>
<p>These actions require the person to make up only the missed day (qada) — no further penalty:</p>
<ul>
  <li>Eating or drinking forgetfully, then <em>continuing to eat</em> when reminded.</li>
  <li>Eating by mistake (e.g., thinking it is not yet Fajr or that Maghrib has already set in).</li>
  <li>Water accidentally entering the throat while gargling.</li>
  <li>Vomiting and swallowing the vomit (involuntarily).</li>
</ul>

<h3>What Breaks the Fast — Requiring Qada AND Kaffarah</h3>
<p>These actions require the person to make up the day <em>AND</em> perform kaffarah (heavy atonement):</p>
<ul>
  <li><strong>Intentionally eating or drinking</strong> during the fasting hours.</li>
  <li><strong>Intentional sexual intercourse</strong> during the fasting hours.</li>
</ul>
<p><strong>Kaffarah options</strong> (in order of preference):</p>
<ol>
  <li>Free a slave (if applicable in historical context).</li>
  <li>Fast 60 consecutive days.</li>
  <li>Feed 60 poor people a full meal.</li>
</ol>

<h3>Things That Do NOT Break the Fast</h3>
<ul>
  <li>Sleeping during the day.</li>
  <li>Swimming (as long as no water is swallowed).</li>
  <li>Eye drops (they do not reach the stomach directly).</li>
  <li>Injections that are not for nourishment.</li>
  <li>Brushing teeth or using miswak without swallowing anything.</li>
  <li>Eating or drinking forgetfully (as long as you stop immediately when reminded).</li>
</ul>

<h3>People Excused from Fasting</h3>
<ul>
  <li><strong>Sick person:</strong> May break the fast and make it up later when recovered.</li>
  <li><strong>Traveller (musafir):</strong> May break the fast and make up the days after Ramadan.</li>
  <li><strong>Pregnant or nursing woman:</strong> May miss fasts and make them up.</li>
  <li><strong>Elderly (permanently unable):</strong> Not required to fast; must pay fidyah instead.</li>
</ul>

<h3>Fidyah — Compensation</h3>
<p>Fidyah is a monetary compensation paid by a person who is <em>permanently unable</em> to fast and cannot make up the days (e.g., an elderly person or someone with a chronic illness). They pay the equivalent of feeding one poor person for each missed day.</p>

<h2>Tarawih — The Night Prayer of Ramadan</h2>
<p>Tarawih is a special salah performed in Ramadan:</p>
<ul>
  <li>Performed after Isha salah each night in Ramadan.</li>
  <li>Consists of <strong>20 rakahs</strong>.</li>
  <li>It is sunnah muakkadah (strongly emphasised sunnah).</li>
  <li>The Quran is typically recited in full over the month of Ramadan (khatm).</li>
  <li>The Prophet ﷺ started this prayer; Umar ibn al-Khattab رضي الله عنه later organised it in congregation.</li>
</ul>
`.trim();

  const unitSawm = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-fiqh-sawm-tarawih' } },
    create: {
      slug: 'maktab-4-fiqh-sawm-tarawih',
      courseId: course.id,
      orderIndex: 3,
      title: 'Fiqh — Sawm & Tarawih',
      description: 'Conditions of fasting, what breaks the fast requiring qada only vs qada and kaffarah, things that do not break the fast, people excused and fidyah, and Tarawih salah in Ramadan.',
      content: sawmContent,
    },
    update: {
      title: 'Fiqh — Sawm & Tarawih',
      description: 'Conditions of fasting, what breaks the fast requiring qada only vs qada and kaffarah, things that do not break the fast, people excused and fidyah, and Tarawih salah in Ramadan.',
      content: sawmContent,
      orderIndex: 3,
    },
  });

  console.log('✅ Unit 3:', unitSawm.title);

  // ═════════════════════════════════════════════
  // AHADITH UNITS (2 focused units)
  // ═════════════════════════════════════════════

  // ─────────────────────────────────────────────
  // UNIT 4: AHADITH — Charity & Good Character
  // ─────────────────────────────────────────────

  const charityContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the importance of feeding others, describe what Islam teaches about good character, and explain the impact of choosing righteous friends.</p>

<h2>Ahadith on Charity & Good Character</h2>

<h3>Hadith 1: Feeding the Hungry</h3>
<p>The Prophet ﷺ said:</p>
<blockquote>
  <p><em>"Whoever relieves a believer of a hardship from the hardships of this world, Allah will relieve him of a hardship from the hardships of the Day of Resurrection."</em> (Muslim)</p>
</blockquote>
<p>Feeding a hungry person is one of the most beloved acts of charity in Islam. It is a form of worship and a means of removing difficulties for both the giver and the one in need. The Prophet ﷺ emphasised caring for others and removing their suffering as a way of earning Allah's mercy.</p>

<h3>Hadith 2: Best of Character</h3>
<p>The Prophet ﷺ said:</p>
<blockquote>
  <p><em>"The best of you are those with the best character (akhlaq)."</em> (Bukhari and Muslim)</p>
</blockquote>
<p>This hadith tells us that true excellence is not in wealth or appearance but in how we treat others. Good character includes:</p>
<ul>
  <li>Being kind, gentle, and patient.</li>
  <li>Speaking truthfully and avoiding lies.</li>
  <li>Being generous and helping those in need.</li>
  <li>Showing respect to parents, elders, and all people.</li>
  <li>Smiling, greeting with salam, and being cheerful.</li>
</ul>
<p>The Prophet ﷺ himself was the greatest example of good character. His wife Aisha رضي الله عنها described him as: <em>"His character was the Quran."</em></p>

<h3>Hadith 3: Choosing Righteous Friends</h3>
<p>The Prophet ﷺ said:</p>
<blockquote>
  <p><em>"A person follows the religion of his close friend, so each of you should be careful about whom he takes as a close friend."</em> (Abu Dawud and Tirmidhi)</p>
</blockquote>
<p>This hadith teaches us that our companions have a powerful influence on our faith and character:</p>
<ul>
  <li>A good friend encourages you to pray, be honest, and avoid sins.</li>
  <li>A bad friend may slowly lead you towards disobedience and poor habits.</li>
  <li>Choose friends who remind you of Allah, support your Islamic values, and help you become a better person.</li>
</ul>
<p>The Prophet ﷺ also compared a good companion to a perfume seller (you benefit from the pleasant smell) and a bad companion to a blacksmith (you suffer from the smoke and sparks).</p>
`.trim();

  const unitCharity = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-ahadith-charity-character' } },
    create: {
      slug: 'maktab-4-ahadith-charity-character',
      courseId: course.id,
      orderIndex: 4,
      title: 'Ahadith — Charity & Good Character',
      description: 'Hadiths on feeding others and relieving hardship, the best character (akhlaq), and the critical importance of choosing righteous companions.',
      content: charityContent,
    },
    update: {
      title: 'Ahadith — Charity & Good Character',
      description: 'Hadiths on feeding others and relieving hardship, the best character (akhlaq), and the critical importance of choosing righteous companions.',
      content: charityContent,
      orderIndex: 4,
    },
  });

  console.log('✅ Unit 4:', unitCharity.title);

  // ─────────────────────────────────────────────
  // UNIT 5: AHADITH — Trust, Dhikr & Dua
  // ─────────────────────────────────────────────

  const dhikrContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the obligation of returning trusts, name the dhikr phrases called keys to paradise, and describe the virtues and best times for dua.</p>

<h2>Ahadith on Trust, Dhikr & Dua</h2>

<h3>Hadith 1: The Obligation of Amanah (Trust)</h3>
<p>The Prophet ﷺ said:</p>
<blockquote>
  <p><em>"The signs of a hypocrite are three: when he speaks he lies, when he makes a promise he breaks it, and when he is entrusted with something he betrays the trust."</em> (Bukhari and Muslim)</p>
</blockquote>
<p>Amanah means trustworthiness — fulfilling every responsibility entrusted to you. This includes:</p>
<ul>
  <li>Returning borrowed items promptly.</li>
  <li>Keeping secrets that were shared in confidence.</li>
  <li>Fulfilling responsibilities at home, school, and work.</li>
  <li>Not betraying someone who trusts you.</li>
</ul>
<p>The Prophet ﷺ was known as Al-Amin (the Trustworthy) even before his prophethood. Being trustworthy is a sign of true iman (faith).</p>

<h3>Hadith 2: Keys to Paradise — Dhikr Phrases</h3>
<p>The Prophet ﷺ was asked which words are the best and he said:</p>
<blockquote>
  <p><em>"SubhanAllah, Alhamdulillah, La ilaha illallah, and Allahu Akbar — these are the keys to paradise."</em></p>
</blockquote>
<p>These four phrases of dhikr (remembrance of Allah) are the most beloved to Allah:</p>
<ul>
  <li><strong>SubhanAllah</strong> — Glory be to Allah (said 33 times after salah).</li>
  <li><strong>Alhamdulillah</strong> — All praise is for Allah (said 33 times after salah).</li>
  <li><strong>Allahu Akbar</strong> — Allah is the Greatest (said 34 times after salah).</li>
  <li><strong>La ilaha illallah</strong> — There is no god but Allah — the foundation of tawhid.</li>
</ul>
<p>These can be recited throughout the day — while walking, waiting, or resting. They are light on the tongue but heavy on the scales of deeds.</p>

<h3>Hadith 3: The Power of Dua</h3>
<p>The Prophet ﷺ said:</p>
<blockquote>
  <p><em>"Dua (supplication) is the weapon of the believer, the pillar of religion, and the light of the heavens and earth."</em> (Hakim)</p>
</blockquote>
<p>Dua is talking directly to Allah. Times when dua is especially accepted include:</p>
<ul>
  <li>The last third of the night (before Fajr).</li>
  <li>Between the adhan and iqamah.</li>
  <li>While in sujud (prostration).</li>
  <li>On Fridays, between Asr and Maghrib.</li>
  <li>While it is raining.</li>
  <li>When fasting and at the time of breaking the fast (iftar).</li>
</ul>
<p>For dua to be accepted: be sincere, have halal earnings, face the qiblah if possible, raise your hands, begin with praise of Allah and salawat on the Prophet ﷺ, and never be impatient.</p>
`.trim();

  const unitDhikr = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-ahadith-trust-dhikr' } },
    create: {
      slug: 'maktab-4-ahadith-trust-dhikr',
      courseId: course.id,
      orderIndex: 5,
      title: 'Ahadith — Trust, Dhikr & Dua',
      description: 'Hadith on returning trusts (amanah) and signs of hypocrisy, the dhikr phrases called keys to paradise, and the virtues and best times for dua.',
      content: dhikrContent,
    },
    update: {
      title: 'Ahadith — Trust, Dhikr & Dua',
      description: 'Hadith on returning trusts (amanah) and signs of hypocrisy, the dhikr phrases called keys to paradise, and the virtues and best times for dua.',
      content: dhikrContent,
      orderIndex: 5,
    },
  });

  console.log('✅ Unit 5:', unitDhikr.title);

  // ═════════════════════════════════════════════
  // SIRAH UNITS (2 focused units)
  // ═════════════════════════════════════════════

  // ─────────────────────────────────────────────
  // UNIT 6: SIRAH — The Hijrah to Madinah
  // ─────────────────────────────────────────────

  const hijrahContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain why the hijrah was necessary, describe the journey from Makkah to Madinah, identify the key events, and explain the significance of the hijrah in Islamic history.</p>

<h2>The Hijrah — Migration to Madinah</h2>

<h3>Why the Hijrah Was Necessary</h3>
<p>After 13 years of preaching in Makkah, the Muslims faced severe persecution. The Quraysh of Makkah plotted to assassinate the Prophet ﷺ. Allah commanded the Muslims to migrate to Madinah (then called Yathrib), where the Ansar (helpers) eagerly awaited them. This migration is called the Hijrah.</p>

<h3>The Decision to Migrate</h3>
<p>On the night of the planned assassination, the Prophet ﷺ asked Ali ibn Abi Talib رضي الله عنه to sleep in his bed to mislead the Quraysh. The Prophet ﷺ then left quietly, with Abu Bakr al-Siddiq رضي الله عنه as his sole companion on the journey.</p>

<h3>The Cave of Thawr</h3>
<p>The Prophet ﷺ and Abu Bakr رضي الله عنه took shelter in the Cave of Thawr for three days while the Quraysh searched frantically. A remarkable miracle occurred: a spider spun its web across the entrance, and a pigeon nested there, making the Quraysh believe no one had entered. Abu Bakr رضي الله عنه was worried, but the Prophet ﷺ reassured him:</p>
<blockquote>
  <p><em>"Do not grieve. Indeed, Allah is with us."</em> (Quran 9:40)</p>
</blockquote>

<h3>The Journey North</h3>
<p>After leaving the cave, the Prophet ﷺ and Abu Bakr رضي الله عنه travelled north along the Red Sea coast (a less-used route) with a guide named Abdullah ibn Uraiqit. The Quraysh had offered a large reward for the Prophet ﷺ, dead or alive.</p>

<h3>Arrival in Quba</h3>
<p>The Prophet ﷺ arrived at Quba (on the outskirts of Madinah) on Monday, 12th Rabi al-Awwal. Here he stayed for several days and laid the foundations of <strong>Masjid Quba</strong> — the first mosque built in Islam.</p>

<h3>Arrival in Madinah and Masjid an-Nabawi</h3>
<p>The Prophet ﷺ then rode into Madinah. The people lined the streets with joy, singing the famous poem: <em>"Tala al-badru alayna..."</em> The Prophet ﷺ allowed his camel to lead the way and wherever it stopped, he would build his mosque. That became the site of <strong>Masjid an-Nabawi</strong>, the Prophet's Mosque. The Hijrah marks the beginning of the Islamic calendar (1 AH).</p>
`.trim();

  const unitHijrah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-sirah-hijrah' } },
    create: {
      slug: 'maktab-4-sirah-hijrah',
      courseId: course.id,
      orderIndex: 6,
      title: 'Sirah — The Hijrah to Madinah',
      description: 'The necessity of the Hijrah, the departure from Makkah with Abu Bakr, the Cave of Thawr, the journey north, arrival at Quba, and the building of Masjid an-Nabawi.',
      content: hijrahContent,
    },
    update: {
      title: 'Sirah — The Hijrah to Madinah',
      description: 'The necessity of the Hijrah, the departure from Makkah with Abu Bakr, the Cave of Thawr, the journey north, arrival at Quba, and the building of Masjid an-Nabawi.',
      content: hijrahContent,
      orderIndex: 6,
    },
  });

  console.log('✅ Unit 6:', unitHijrah.title);

  // ─────────────────────────────────────────────
  // UNIT 7: SIRAH — Brotherhood, Treaties & Battle of Ahzab
  // ─────────────────────────────────────────────

  const ahzabContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the Muakhah (Islamic brotherhood), describe the Mithaq al-Madinah (Charter of Madinah), and recount the story of the Battle of the Trench (Khandaq).</p>

<h2>Brotherhood, Treaties & the Battle of the Trench</h2>

<h3>Muakhah — Islamic Brotherhood</h3>
<p>When the Prophet ﷺ arrived in Madinah, he paired each of the Muhajirin (migrants from Makkah) with an Ansar (helper from Madinah). This pairing was called <strong>Muakhah</strong> (making brothers).</p>
<ul>
  <li><strong>Muhajirin:</strong> Muslims who migrated from Makkah, leaving behind homes and wealth.</li>
  <li><strong>Ansar:</strong> Muslims of Madinah who welcomed, hosted, and shared everything with the migrants.</li>
</ul>
<p>The Ansar showed extraordinary generosity — some even offered to share half their property. This pairing created a bond stronger than tribal ties, based on faith alone.</p>

<h3>Mithaq al-Madinah — The Charter of Madinah</h3>
<p>The Prophet ﷺ also established treaties with the Jewish tribes of Madinah. This document, known as the <strong>Mithaq al-Madinah</strong> (Charter/Constitution of Madinah), stated:</p>
<ul>
  <li>All communities in Madinah would live in peace.</li>
  <li>Each group could practise their religion freely.</li>
  <li>All would defend Madinah together if attacked from outside.</li>
  <li>Disputes would be brought to the Prophet ﷺ for resolution.</li>
</ul>
<p>This was one of the earliest examples of a multi-faith community agreement in history.</p>

<h3>Battle of the Trench (Khandaq) — 5 AH</h3>
<p>In the 5th year after Hijrah, a coalition of Quraysh and other tribes (called the Ahzab — the Confederates) assembled a massive army of about 10,000 to attack Madinah. When the Prophet ﷺ consulted the Companions about how to defend, <strong>Salman al-Farisi</strong> رضي الله عنه — a Persian companion — suggested digging a trench around the vulnerable side of Madinah.</p>
<p>The Muslims dug the trench in just six days, working tirelessly. The Prophet ﷺ himself took part in the digging. Miracles occurred during the digging — including the Prophet ﷺ producing food that fed the entire army from a small amount.</p>
<p>The Ahzab laid siege to Madinah for about 27 days. Unable to cross the trench, they eventually gave up and left. This was a great victory for the Muslims, as no major battle was fought but they successfully protected Madinah.</p>
<p><strong>Lesson:</strong> Using wisdom and strategy is part of Islam. Salman al-Farisi is honoured as "one of us, the People of the House" (Ahlul Bayt) by the Prophet ﷺ for his wisdom.</p>
`.trim();

  const unitAhzab = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-sirah-brotherhood-ahzab' } },
    create: {
      slug: 'maktab-4-sirah-brotherhood-ahzab',
      courseId: course.id,
      orderIndex: 7,
      title: 'Sirah — Brotherhood, Treaties & Battle of Ahzab',
      description: 'The Muakhah pairing of Muhajirin and Ansar, the Mithaq al-Madinah treaty with Jewish tribes, and the Battle of the Trench where Salman al-Farisi suggested digging to defeat the Confederates.',
      content: ahzabContent,
    },
    update: {
      title: 'Sirah — Brotherhood, Treaties & Battle of Ahzab',
      description: 'The Muakhah pairing of Muhajirin and Ansar, the Mithaq al-Madinah treaty with Jewish tribes, and the Battle of the Trench where Salman al-Farisi suggested digging to defeat the Confederates.',
      content: ahzabContent,
      orderIndex: 7,
    },
  });

  console.log('✅ Unit 7:', unitAhzab.title);

  // ═════════════════════════════════════════════
  // TARIKH UNITS (2 focused units)
  // ═════════════════════════════════════════════

  // ─────────────────────────────────────────────
  // UNIT 8: TARIKH — Prophet Yusuf Part 1 (Dream to Prison)
  // ─────────────────────────────────────────────

  const yusuf1Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to recount the story of Prophet Yusuf from the dream to his imprisonment, identify the key events and their causes, and reflect on the lessons of trust in Allah.</p>

<h2>Prophet Yusuf Part 1 — From the Dream to Prison</h2>

<h3>The Dream</h3>
<p>Prophet Yusuf عليه السلام was the beloved son of Prophet Yaqub (Jacob) عليه السلام. One night, the young Yusuf saw a dream: <em>eleven stars, the sun, and the moon were all prostrating to him</em>. When he told his father, Yaqub warned him not to tell his brothers, as they might become jealous and plot against him.</p>

<h3>The Brothers' Jealousy</h3>
<p>Yusuf عليه السلام had eleven brothers. They were jealous because their father loved Yusuf more than them. They plotted to get rid of him so they could have their father's full attention. They decided to throw him into a well during a trip to the countryside.</p>

<h3>Thrown in the Well</h3>
<p>The brothers convinced their father to let Yusuf join them. Once away from home, they stripped him of his shirt and threw him into a deep well. When they returned home, they told their father that a wolf had eaten Yusuf — showing his shirt stained with false blood. Yaqub did not believe them and wept for his son.</p>

<h3>Sold into Slavery in Egypt</h3>
<p>A caravan of travellers passed by the well and discovered Yusuf عليه السلام. They pulled him out and sold him as a slave in Egypt. He was bought by a high-ranking Egyptian official known as al-Aziz (the Steward or Minister).</p>

<h3>The Test with Zulaykha</h3>
<p>Yusuf عليه السلام grew up in the home of al-Aziz and became a trustworthy and capable servant. The wife of al-Aziz, known as Zulaykha, became infatuated with Yusuf and tried to seduce him. Yusuf refused, saying: <em>"I seek refuge in Allah — He is my Lord who gave me a good home. Indeed wrongdoers never succeed."</em> He ran to the door. She tore his shirt from the back in pursuit.</p>
<p>When the Aziz discovered what had happened, a witness proved that if the shirt was torn from the back, Yusuf was innocent. However, Zulaykha continued to scheme. Other women of the city also became infatuated with Yusuf when they saw how handsome he was.</p>

<h3>Imprisonment</h3>
<p>Despite his innocence, to avoid further scandal, Yusuf عليه السلام was sent to prison. Even in prison, Yusuf remained patient and trusting in Allah. He used his gift of interpreting dreams to help his fellow prisoners. He asked one of them to mention him to the King — but the man forgot for several years.</p>
<p><strong>Lesson:</strong> Yusuf never lost hope in Allah, even through hardship after hardship. He chose imprisonment over sin, saying: <em>"My Lord, prison is more beloved to me than what they invite me to."</em></p>
`.trim();

  const unitYusuf1 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-tarikh-yusuf-1' } },
    create: {
      slug: 'maktab-4-tarikh-yusuf-1',
      courseId: course.id,
      orderIndex: 8,
      title: 'Tarikh — Prophet Yusuf Part 1: Dream to Prison',
      description: 'The dream of eleven stars, sun and moon, brothers\' jealousy, being thrown in the well, sold into slavery in Egypt, the test of Zulaykha, and imprisonment.',
      content: yusuf1Content,
    },
    update: {
      title: 'Tarikh — Prophet Yusuf Part 1: Dream to Prison',
      description: 'The dream of eleven stars, sun and moon, brothers\' jealousy, being thrown in the well, sold into slavery in Egypt, the test of Zulaykha, and imprisonment.',
      content: yusuf1Content,
      orderIndex: 8,
    },
  });

  console.log('✅ Unit 8:', unitYusuf1.title);

  // ─────────────────────────────────────────────
  // UNIT 9: TARIKH — Prophet Yusuf Part 2 (Rise to Reunion)
  // ─────────────────────────────────────────────

  const yusuf2Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to recount the story of Prophet Yusuf from his release to the reunion with his family, explain the lesson of patience, and reflect on Allah's justice.</p>

<h2>Prophet Yusuf Part 2 — From Prison to Power and Reunion</h2>

<h3>The King's Dream</h3>
<p>After years in prison, the King of Egypt had a puzzling dream: <em>seven fat cows were eaten by seven lean cows, and seven green ears of grain and seven dry ones</em>. None of his advisors could interpret it. The former prisoner who had forgotten Yusuf عليه السلام finally remembered him and mentioned him to the King.</p>

<h3>Yusuf's Interpretation</h3>
<p>Yusuf عليه السلام interpreted the dream perfectly:</p>
<blockquote>
  <p><em>"You will have seven years of abundant harvest. Save most of what you grow. Then seven years of severe drought will follow, consuming almost everything you stored. After that, a year of rain and relief will come."</em></p>
</blockquote>
<p>The King was astonished by Yusuf's wisdom and asked to meet him.</p>

<h3>Released from Prison</h3>
<p>Before leaving the prison, Yusuf عليه السلام insisted that the King first investigate the case of the women (Zulaykha's plot). The King did so, and Zulaykha herself admitted: <em>"I was the one who tried to seduce him — Yusuf is completely truthful."</em> His innocence was proven at last.</p>

<h3>Appointed Treasurer of Egypt</h3>
<p>The King was so impressed with Yusuf's trustworthiness, wisdom, and knowledge that he appointed him as the <strong>Treasurer and Overseer of Egypt's storehouses</strong>. Yusuf عليه السلام managed Egypt's food supply for the coming years of drought with incredible efficiency.</p>

<h3>The Brothers Arrive</h3>
<p>When the years of drought spread, Yusuf's brothers came to Egypt seeking food — not knowing their brother was now in charge. Yusuf recognised them, but they did not recognise him. He gave them food but kept one brother (Simeon) as a guarantee. He sent them back with a message to bring their youngest brother, Benjamin.</p>

<h3>The Reunion</h3>
<p>After more events and tests, the full truth was revealed. Yusuf عليه السلام made himself known to his brothers. They were overcome with shame and guilt. But Yusuf responded with extraordinary forgiveness:</p>
<blockquote>
  <p><em>"No blame upon you today. May Allah forgive you — He is the most merciful of the merciful."</em> (Quran 12:92)</p>
</blockquote>
<p>The dream came true: when his parents and eleven brothers arrived in Egypt, they all prostrated to Yusuf in honour — just as he had dreamed years ago.</p>

<h3>Lessons from the Story of Yusuf</h3>
<ul>
  <li><strong>Patience (Sabr):</strong> Yusuf faced betrayal, slavery, false accusations, and imprisonment — yet he never gave up on Allah.</li>
  <li><strong>Trust in Allah:</strong> He never despaired, knowing Allah was always with him.</li>
  <li><strong>Forgiveness:</strong> He forgave those who wronged him deeply.</li>
  <li><strong>The story of Yusuf</strong> is called by the Quran itself "the best of stories" (Quran 12:3).</li>
</ul>
`.trim();

  const unitYusuf2 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-tarikh-yusuf-2' } },
    create: {
      slug: 'maktab-4-tarikh-yusuf-2',
      courseId: course.id,
      orderIndex: 9,
      title: 'Tarikh — Prophet Yusuf Part 2: Rise to Reunion',
      description: 'The King\'s dream and Yusuf\'s interpretation, release from prison, appointed Treasurer of Egypt, brothers\' arrival, and the emotional reunion with lessons of patience and forgiveness.',
      content: yusuf2Content,
    },
    update: {
      title: 'Tarikh — Prophet Yusuf Part 2: Rise to Reunion',
      description: 'The King\'s dream and Yusuf\'s interpretation, release from prison, appointed Treasurer of Egypt, brothers\' arrival, and the emotional reunion with lessons of patience and forgiveness.',
      content: yusuf2Content,
      orderIndex: 9,
    },
  });

  console.log('✅ Unit 9:', unitYusuf2.title);

  // ═════════════════════════════════════════════
  // AQAID UNITS (2 focused units)
  // ═════════════════════════════════════════════

  // ─────────────────────────────────────────────
  // UNIT 10: AQAID — Major Signs of Qiyamah
  // ─────────────────────────────────────────────

  const qiyamahContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to name the major signs of Qiyamah, describe what the Dajjal will claim, and explain the role of Isa عليه السلام at the end of times.</p>

<h2>Major Signs of Qiyamah (The Last Day)</h2>

<h3>Introduction</h3>
<p>Iman in Yawm al-Qiyamah (the Day of Resurrection) is one of the six pillars of iman. Before the Day of Judgement, major signs will occur. These are extraordinary events that no human can prevent or control. The Prophet ﷺ described ten major signs in detail.</p>

<h3>The Ten Major Signs</h3>
<ol>
  <li><strong>The Dajjal (False Messiah)</strong> — A one-eyed imposter who will claim to be a prophet, then claim to be Allah. He will have extraordinary powers and will mislead millions.</li>
  <li><strong>Descent of Isa عليه السلام (Jesus)</strong> — Prophet Isa will descend from the sky near a white minaret in Damascus. He will break the cross, kill the Dajjal, and establish justice.</li>
  <li><strong>Yajuj and Majuj (Gog and Magog)</strong> — Two massive destructive peoples who will be released from behind a wall. They will spread chaos and corruption across the earth.</li>
  <li><strong>Rising of the Sun from the West</strong> — The sun will rise from its setting point. After this, the door of repentance (tawbah) will be closed forever.</li>
  <li><strong>Dabbah — The Beast of the Earth</strong> — A creature will emerge from the earth, marking believers and disbelievers.</li>
  <li><strong>Three Great Landslides (Khusufs)</strong> — One in the east, one in the west, and one in the Arabian Peninsula.</li>
  <li><strong>A Great Smoke (Dukhan)</strong> — A dense smoke will cover the earth, causing suffering to disbelievers.</li>
  <li><strong>A Fire from Aden (Yemen)</strong> — A fire will drive people to their final gathering place.</li>
  <li><strong>The Blowing of the Trumpet (Sur)</strong> — Israfil عليه السلام will blow the trumpet, causing everything to die. He will blow again, and all will be resurrected.</li>
  <li><strong>The Destruction of the Kabah</strong> — A man from Ethiopia will demolish the Kabah before the end.</li>
</ol>

<h3>The Dajjal — Special Warning</h3>
<p>The Prophet ﷺ warned about the Dajjal more than about any other sign. Key facts:</p>
<ul>
  <li>He will be one-eyed (his right eye will be blind and protruding like a grape).</li>
  <li>The word <em>Kafir (disbeliever)</em> will be written on his forehead — readable by every believer.</li>
  <li>He will have incredible abilities — making it rain, causing crops to grow, performing apparent "miracles."</li>
  <li>He will first claim to be a prophet, then claim to be Allah.</li>
  <li>He will appear between Sham (Syria) and Iraq and travel across the earth.</li>
  <li>He cannot enter Makkah or Madinah.</li>
</ul>

<h3>Role of Isa عليه السلام</h3>
<p>Prophet Isa عليه السلام will come at the end of times and:</p>
<ul>
  <li>Confirm the truth of the Prophet Muhammad ﷺ.</li>
  <li>Kill the Dajjal near a city called Ludd (in modern Israel/Palestine).</li>
  <li>Destroy the cross and kill the swine (symbols of distorted Christianity).</li>
  <li>Establish a just rule based on Islamic law.</li>
  <li>Eventually pass away and be buried near the Prophet ﷺ in Madinah.</li>
</ul>
`.trim();

  const unitQiyamah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-aqaid-signs-qiyamah' } },
    create: {
      slug: 'maktab-4-aqaid-signs-qiyamah',
      courseId: course.id,
      orderIndex: 10,
      title: 'Aqaid — Major Signs of Qiyamah',
      description: 'The ten major signs before the Day of Judgement including the Dajjal, descent of Isa, Yajuj and Majuj, sunrise from the west, the beast, and the trumpet.',
      content: qiyamahContent,
    },
    update: {
      title: 'Aqaid — Major Signs of Qiyamah',
      description: 'The ten major signs before the Day of Judgement including the Dajjal, descent of Isa, Yajuj and Majuj, sunrise from the west, the beast, and the trumpet.',
      content: qiyamahContent,
      orderIndex: 10,
    },
  });

  console.log('✅ Unit 10:', unitQiyamah.title);

  // ─────────────────────────────────────────────
  // UNIT 11: AQAID — Protection from Dajjal & Awareness of the Akhirah
  // ─────────────────────────────────────────────

  const protectionContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain how to seek protection from the Dajjal, understand the importance of living with awareness of death and the afterlife, and identify signs of a good Muslim.</p>

<h2>Protection from the Dajjal & Living with Awareness of the Akhirah</h2>

<h3>How to Protect Yourself from the Dajjal</h3>
<p>The Prophet ﷺ gave us specific guidance to protect ourselves from the great trial of the Dajjal:</p>

<h4>1. Memorise the First/Last 10 Verses of Surah al-Kahf</h4>
<p>The Prophet ﷺ said: <em>"Whoever memorises ten verses from the beginning of Surah al-Kahf will be protected from the Dajjal."</em> (Muslim)</p>
<p>In another narration, it mentions the last ten verses. The scholars say: recite both, to be safe. Surah al-Kahf is recommended every Friday.</p>

<h4>2. Seek Refuge in Allah</h4>
<p>In every salah, after the last tashahhud and before salam, we say:</p>
<blockquote>
  <p><em>"Allahumma inni audhu bika min adhabi jahannam, wa min adhabil qabr, wa min fitnatil mahya wal mamat, wa min sharri fitnatil masihid-dajjal."</em></p>
  <p>("O Allah, I seek refuge in You from the punishment of Hell, the punishment of the grave, the trials of life and death, and the evil trial of the False Messiah.")</p>
</blockquote>

<h4>3. Stay in Makkah or Madinah</h4>
<p>The Dajjal cannot enter Makkah or Madinah — angels guard these cities. This is a special protection for those who live there.</p>

<h4>4. Do Not Follow Him</h4>
<p>The Prophet ﷺ warned: <em>"Whoever hears of the Dajjal should stay far away from him."</em> His powers may confuse people — believing Muslims must hold firmly to their faith and not be swayed by miracles.</p>

<h3>Living with Awareness of the Akhirah</h3>
<p>A true believer lives with the awareness that this world is temporary and the Akhirah (Hereafter) is eternal:</p>
<blockquote>
  <p>The Prophet ﷺ said: <em>"Be in this world as though you are a stranger or a traveller passing through."</em> (Bukhari)</p>
</blockquote>
<p>Remembering death helps us:</p>
<ul>
  <li>Avoid distractions and focus on what truly matters.</li>
  <li>Repent quickly when we sin, instead of delaying.</li>
  <li>Not become too attached to material things.</li>
  <li>Treat others well, knowing we will be accountable on the Day of Judgement.</li>
  <li>Perform good deeds consistently, even if they are small.</li>
</ul>

<h3>Signs of a Good Muslim</h3>
<p>A person prepared for the Akhirah will show these qualities:</p>
<ul>
  <li>Regular, focused salah.</li>
  <li>Recitation and reflection on the Quran.</li>
  <li>Good character with family and neighbours.</li>
  <li>Avoiding sins and repenting quickly when they occur.</li>
  <li>Generosity and caring for the poor.</li>
  <li>Remembering Allah often through dhikr and dua.</li>
</ul>
`.trim();

  const unitProtection = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-aqaid-protection' } },
    create: {
      slug: 'maktab-4-aqaid-protection',
      courseId: course.id,
      orderIndex: 11,
      title: 'Aqaid — Protection from Dajjal & Awareness of the Akhirah',
      description: 'How to protect from the Dajjal through Surah al-Kahf, dua, and staying away from him, plus living with awareness of death and the Hereafter and signs of a good Muslim.',
      content: protectionContent,
    },
    update: {
      title: 'Aqaid — Protection from Dajjal & Awareness of the Akhirah',
      description: 'How to protect from the Dajjal through Surah al-Kahf, dua, and staying away from him, plus living with awareness of death and the Hereafter and signs of a good Muslim.',
      content: protectionContent,
      orderIndex: 11,
    },
  });

  console.log('✅ Unit 11:', unitProtection.title);

  // ═════════════════════════════════════════════
  // AKHLAQ UNITS (2 focused units)
  // ═════════════════════════════════════════════

  // ─────────────────────────────────────────────
  // UNIT 12: AKHLAQ — Amanah & Seeking Permission
  // ─────────────────────────────────────────────

  const trustContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to define amanah and its types, explain the rules for seeking permission before entering, and describe the Islamic etiquette of privacy.</p>

<h2>Amanah — Trustworthiness</h2>

<h3>What Is Amanah?</h3>
<p>Amanah means trustworthiness and fulfilling responsibilities. It is one of the most important qualities a Muslim must have. The Prophet ﷺ was known as Al-Amin (the Trustworthy) even before his prophethood — his character made him trusted by all.</p>

<h3>Types of Amanah</h3>
<ol>
  <li><strong>Returning belongings:</strong> If someone lends you something, return it promptly and in good condition. This includes borrowed books, money, or items.</li>
  <li><strong>Keeping secrets:</strong> If someone shares a personal matter with you in confidence, never reveal it to others without permission.</li>
  <li><strong>Fulfilling duties:</strong> Whether at school, home, or work — completing responsibilities given to you is amanah.</li>
  <li><strong>Honesty:</strong> Not deceiving people who trust you with their money, property, or information.</li>
</ol>

<h3>The Hadith on Amanah</h3>
<blockquote>
  <p>The Prophet ﷺ said: <em>"There is no iman (faith) in the one who has no amanah, and there is no deen (religion) in the one who does not honour his promises."</em> (Ahmad)</p>
</blockquote>
<p>This hadith shows that amanah is inseparable from true faith. A Muslim cannot claim to be faithful while being dishonest or untrustworthy.</p>

<h2>Seeking Permission Before Entering</h2>

<h3>The Quranic Command</h3>
<p>Allah says in the Quran:</p>
<blockquote>
  <p><em>"O you who believe, do not enter houses other than your own until you have asked permission and greeted the people inside."</em> (Quran 24:27)</p>
</blockquote>

<h3>How to Seek Permission</h3>
<ul>
  <li>Knock three times (not more) and wait patiently between each knock.</li>
  <li>Stand to the <em>side</em> of the door, not directly in front of it, to avoid looking inside.</li>
  <li>If no one answers after three knocks, leave — do not persist.</li>
  <li>If asked "Who is it?" say your name (e.g., "It is Ahmad") — not just "It is me."</li>
</ul>

<h3>Why This Matters</h3>
<p>Seeking permission protects:</p>
<ul>
  <li>The privacy of people in their homes.</li>
  <li>The dignity of women who may not be dressed for strangers.</li>
  <li>The peace and sanctity of the home.</li>
</ul>
<p>The same principle applies to entering any private space — a room, an office, or even a message thread. Respect others' privacy as you would want them to respect yours.</p>
`.trim();

  const unitTrust = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-akhlaq-trust-permission' } },
    create: {
      slug: 'maktab-4-akhlaq-trust-permission',
      courseId: course.id,
      orderIndex: 12,
      title: 'Akhlaq — Amanah & Seeking Permission',
      description: 'Amanah (trustworthiness): its definition, types including returning belongings and keeping secrets, the hadith on amanah and faith, and the Quranic etiquette of seeking permission before entering.',
      content: trustContent,
    },
    update: {
      title: 'Akhlaq — Amanah & Seeking Permission',
      description: 'Amanah (trustworthiness): its definition, types including returning belongings and keeping secrets, the hadith on amanah and faith, and the Quranic etiquette of seeking permission before entering.',
      content: trustContent,
      orderIndex: 12,
    },
  });

  console.log('✅ Unit 12:', unitTrust.title);

  // ─────────────────────────────────────────────
  // UNIT 13: AKHLAQ — Good Neighbours & Removing Harm
  // ─────────────────────────────────────────────

  const neighboursContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe the rights of neighbours in Islam, explain how many houses constitute neighbours, and identify the great reward of removing harmful objects from public paths.</p>

<h2>Rights of Neighbours</h2>

<h3>Importance of Good Neighbourly Conduct</h3>
<p>The Prophet ﷺ emphasised the rights of neighbours so strongly that the Companions thought neighbours might be given a share of inheritance. He said:</p>
<blockquote>
  <p><em>"Jibril kept advising me about the neighbour until I thought he would give the neighbour a share of inheritance."</em> (Bukhari and Muslim)</p>
</blockquote>

<h3>How Many Houses Are Your Neighbours?</h3>
<p>According to Islamic scholars, a neighbour includes <strong>40 houses</strong> in every direction from your home — so up to 40 houses in front, behind, left, and right. This shows that the Islamic community must care for a wide circle of people around them.</p>

<h3>Types of Neighbours</h3>
<ol>
  <li><strong>The Muslim Neighbour:</strong> Has three rights — as a neighbour, as a fellow Muslim, and (if related) as family. They deserve the most care.</li>
  <li><strong>The Non-Muslim Neighbour:</strong> Has two rights — as a neighbour and as a human being (dhimmah). We must still treat them kindly and not harm them.</li>
</ol>

<h3>Rights of the Neighbour</h3>
<ul>
  <li>Do not harm them physically or with noise, smell, or rubbish.</li>
  <li>Share food — when you cook something, consider your neighbour.</li>
  <li>Help them in illness or difficulty.</li>
  <li>Protect their honour and do not gossip about them.</li>
  <li>Greet them with salam warmly.</li>
  <li>Do not park in front of their entrance or block their access.</li>
</ul>

<h2>Removing Harm from the Path</h2>

<h3>The Hadith</h3>
<blockquote>
  <p>The Prophet ﷺ said: <em>"Removing a harmful object from the road is an act of sadaqah (charity)."</em> (Bukhari and Muslim)</p>
</blockquote>

<h3>What Counts as Removing Harm?</h3>
<ul>
  <li>Picking up a stone, nail, piece of glass, or slippery peel from the road.</li>
  <li>Moving a broken vehicle from blocking traffic.</li>
  <li>Cleaning up litter or hazardous waste from a public area.</li>
  <li>Removing thorns or tree branches from a path.</li>
</ul>

<h3>Why Is It Such a Great Deed?</h3>
<p>Every Muslim who benefits — or is protected from harm — because of your action shares in your reward. Removing a single sharp object could prevent injury to hundreds of people over many years. This deed combines care for others with environmental responsibility — both Islamic values.</p>
<p>It is also one of the <strong>branches of iman</strong> — the Prophet ﷺ mentioned it as the lowest branch of faith, yet called it a branch of faith nonetheless.</p>
`.trim();

  const unitNeighbours = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-akhlaq-neighbours' } },
    create: {
      slug: 'maktab-4-akhlaq-neighbours',
      courseId: course.id,
      orderIndex: 13,
      title: 'Akhlaq — Good Neighbours & Removing Harm',
      description: 'Rights of neighbours (40 houses in each direction), types of neighbours in fiqh, fulfilling their rights, and the great reward of removing harmful objects from public paths.',
      content: neighboursContent,
    },
    update: {
      title: 'Akhlaq — Good Neighbours & Removing Harm',
      description: 'Rights of neighbours (40 houses in each direction), types of neighbours in fiqh, fulfilling their rights, and the great reward of removing harmful objects from public paths.',
      content: neighboursContent,
      orderIndex: 13,
    },
  });

  console.log('✅ Unit 13:', unitNeighbours.title);

  // ═════════════════════════════════════════════
  // ADAB UNIT (1 comprehensive unit)
  // ═════════════════════════════════════════════

  // ─────────────────────────────────────────────
  // UNIT 14: ADAB — Dua, Dressing, Guests, Gatherings & Istinja
  // ─────────────────────────────────────────────

  const adabContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe the conditions for accepted dua, explain the Islamic rules for dress, state the rights of guests and the etiquette of gatherings, and describe the proper method of istinja.</p>

<h2>Islamic Adab — Etiquette in Daily Life</h2>

<h2>Adab of Dua (Supplication)</h2>

<h3>Conditions for Dua to Be Accepted</h3>
<ul>
  <li>Sincerity — dua purely for the sake of Allah, not to show off.</li>
  <li>Halal earnings — eating haram is a barrier to accepted dua.</li>
  <li>Firm belief that Allah will respond.</li>
  <li>Not asking for something sinful or for the harm of others.</li>
  <li>Patience — do not rush or say "I made dua but Allah did not answer."</li>
</ul>

<h3>Etiquette of Making Dua</h3>
<ul>
  <li>Begin with praise of Allah (bismillah, alhamdulillah) and salawat on the Prophet ﷺ.</li>
  <li>Raise your hands to shoulder level, palms facing up.</li>
  <li>Face the qiblah if possible.</li>
  <li>Be in a state of wudu.</li>
  <li>End with Ameen.</li>
  <li>Wipe your face with your hands after the dua.</li>
</ul>

<h3>Best Times for Dua</h3>
<ul>
  <li>Last third of the night (tahajjud time).</li>
  <li>Between adhan and iqamah.</li>
  <li>While in sujud (prostration).</li>
  <li>Friday afternoon (between Asr and Maghrib).</li>
  <li>During rain.</li>
  <li>When fasting, and at the time of breaking fast (iftar).</li>
</ul>

<h2>Islamic Dress Etiquette</h2>

<h3>Rules of Islamic Dress</h3>
<ul>
  <li>The awrah (parts of body that must be covered) must always be covered.</li>
  <li>For males: navel to knee minimum; loose, non-see-through clothing.</li>
  <li>For females: everything except face and hands when in public.</li>
  <li>Clothing must not resemble the opposite gender.</li>
  <li>Muslims should dress modestly and avoid extravagance.</li>
</ul>

<h3>Etiquette When Dressing</h3>
<ul>
  <li>Say <em>Bismillah</em> before putting on any clothing.</li>
  <li>Start with the <strong>right side</strong> when dressing (right arm, right leg first).</li>
  <li>When undressing, start with the <strong>left side</strong> first.</li>
  <li>Dua when dressing: <em>"Alhamdulillahilladhi kasani hatha..."</em></li>
</ul>

<h2>Rights of Guests</h2>

<h3>Hosting Guests</h3>
<p>The Prophet ﷺ said: <em>"Whoever believes in Allah and the Last Day, let him honour his guest."</em> (Bukhari and Muslim)</p>
<ul>
  <li>Greet guests warmly with salam and a smile.</li>
  <li>Offer food and drink — it is sunnah to serve guests first.</li>
  <li>A guest should not be asked: "Have you eaten? Are you hungry?" — just bring food without making them feel awkward.</li>
  <li>The host should eat with the guest (if possible).</li>
  <li>The guest period of obligation is <strong>three days</strong> — after three days, extra hospitality is charity.</li>
</ul>

<h2>Adab of Gatherings</h2>
<ul>
  <li>Make space for those who arrive — do not crowd them out.</li>
  <li>Do not whisper privately among a group of three (it upsets the third person).</li>
  <li>Do not sit between two people without their permission.</li>
  <li>Do not leave a gathering where people are eating without seeking permission.</li>
  <li>When leaving a gathering, say: <em>Subhanakallahumma wa bihamdika ash-hadu an la ilaha illa ant, astaghfiruka wa atubu ilayk.</em></li>
</ul>

<h2>Adab of Istinja (Cleaning After Relieving Oneself)</h2>
<ul>
  <li>Enter the toilet with the left foot first, saying the dua: <em>"Allahumma inni audhu bika minal khubuthi wal khaba-ith."</em></li>
  <li>Do not speak inside the toilet without necessity.</li>
  <li>Use water to clean (istinja) — this is the sunnah method.</li>
  <li>Stones or tissue may also be used (minimum three times) in the absence of water.</li>
  <li>Do not face or turn your back to the qiblah whilst relieving yourself in an open space.</li>
  <li>Exit the toilet with the right foot first, saying: <em>"Ghufranaka."</em></li>
</ul>
`.trim();

  const unitAdab = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-4-adab-all' } },
    create: {
      slug: 'maktab-4-adab-all',
      courseId: course.id,
      orderIndex: 14,
      title: 'Adab — Dua, Dressing, Guests, Gatherings & Istinja',
      description: 'Conditions and etiquette of accepted dua, best times for dua, Islamic dress rules and etiquette, rights and duties of hosting guests, behaviour at gatherings, and the proper method of istinja.',
      content: adabContent,
    },
    update: {
      title: 'Adab — Dua, Dressing, Guests, Gatherings & Istinja',
      description: 'Conditions and etiquette of accepted dua, best times for dua, Islamic dress rules and etiquette, rights and duties of hosting guests, behaviour at gatherings, and the proper method of istinja.',
      content: adabContent,
      orderIndex: 14,
    },
  });

  console.log('✅ Unit 14:', unitAdab.title);

  // ═════════════════════════════════════════════
  // QUIZ DATA — All 14 units
  // ═════════════════════════════════════════════

  const quizData = [
    // ── Unit 1: Masah alal Khuffayn ──────────────────────────────
    {
      unitId: unitMasah.id,
      externalId: 'maktab-4-fiqh-masah-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How long does masah last for a resident (muqim)?',
      options: ['12 hours', '24 hours (one day and night)', '3 days and nights', '7 days'],
      correctAnswer: '24 hours (one day and night)',
      explanation: 'A resident may perform masah for one day and one night — 24 hours from when wudu first broke after putting on the khuffs.',
    },
    {
      unitId: unitMasah.id,
      externalId: 'maktab-4-fiqh-masah-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How long does masah last for a traveller (musafir)?',
      options: ['24 hours', '2 days and nights', '3 days and nights', '7 days'],
      correctAnswer: '3 days and nights',
      explanation: 'A traveller may perform masah for three days and three nights — 72 hours — as a concession for travel.',
    },
    {
      unitId: unitMasah.id,
      externalId: 'maktab-4-fiqh-masah-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which part of the khuff is wiped during masah?',
      options: ['The sole (bottom)', 'The top (from toes toward shin)', 'The back of the heel', 'The entire foot'],
      correctAnswer: 'The top (from toes toward shin)',
      explanation: 'Masah is performed by wiping the top of the khuff from the toes upward toward the shin with wet hands.',
    },
    {
      unitId: unitMasah.id,
      externalId: 'maktab-4-fiqh-masah-q4',
      type: 'TRUE_FALSE',
      questionText: 'If your wudu breaks (e.g. passing wind), your masah is immediately invalidated.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'If only wudu breaks, you renew wudu and wipe again — masah continues until the duration ends or the khuff is removed.',
    },
    {
      unitId: unitMasah.id,
      externalId: 'maktab-4-fiqh-masah-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the name of the masah performed over a wound bandage?',
      options: ['Masah al-Khuff', 'Jabirah masah', 'Ghusl masah', 'Tayammum'],
      correctAnswer: 'Jabirah masah',
      explanation: 'Masah on a wound dressing or cast is called jabirah masah, and there is no time limit for it.',
    },
    {
      unitId: unitMasah.id,
      externalId: 'maktab-4-fiqh-masah-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of these is a condition for masah alal khuffayn to be valid?',
      options: [
        'The khuffs can have any size holes',
        'The khuffs must be put on while already in wudu',
        'The khuffs must be made of leather only',
        'The masah must be done three times',
      ],
      correctAnswer: 'The khuffs must be put on while already in wudu',
      explanation: 'A key condition is that the khuffs were put on while the person was already in a state of wudu.',
    },
    {
      unitId: unitMasah.id,
      externalId: 'maktab-4-fiqh-masah-q7',
      type: 'TRUE_FALSE',
      questionText: 'A person must wash their feet during ghusl even if wearing khuffs.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Anything requiring a full ghusl invalidates masah. During ghusl, the entire body including feet must be washed.',
    },
    // ── Unit 2: Wajib Acts & Sajdah as-Sahw ──────────────────────
    {
      unitId: unitWajib.id,
      externalId: 'maktab-4-fiqh-wajib-sajda-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the consequence of intentionally omitting a wajib act in salah?',
      options: [
        'The salah is valid but you must pay sadaqah',
        'The salah is invalid and must be repeated',
        'You must perform sajdah as-sahw',
        'Nothing — wajib acts are optional',
      ],
      correctAnswer: 'The salah is invalid and must be repeated',
      explanation: 'Intentionally omitting a wajib act invalidates the salah. It must be repeated.',
    },
    {
      unitId: unitWajib.id,
      externalId: 'maktab-4-fiqh-wajib-sajda-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What should be done if a wajib act is forgotten accidentally?',
      options: [
        'The salah is invalid',
        'Repeat the salah',
        'Perform sajdah as-sahw at the end',
        'No action needed',
      ],
      correctAnswer: 'Perform sajdah as-sahw at the end',
      explanation: 'If a wajib act is omitted by forgetfulness, sajdah as-sahw compensates for the omission.',
    },
    {
      unitId: unitWajib.id,
      externalId: 'maktab-4-fiqh-wajib-sajda-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'When is sajdah as-sahw performed?',
      options: [
        'After the first ruku',
        'After the second rakah',
        'At the end of the salah, before the final salam',
        'Before reciting Surah al-Fatihah',
      ],
      correctAnswer: 'At the end of the salah, before the final salam',
      explanation: 'Sajdah as-sahw is always at the end of salah — one salam to the right, two sujuds, tashahhud, then the full two salams.',
    },
    {
      unitId: unitWajib.id,
      externalId: 'maktab-4-fiqh-wajib-sajda-q4',
      type: 'TRUE_FALSE',
      questionText: 'Reciting Surah al-Fatihah in every rakah is a wajib act.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Reciting Surah al-Fatihah in every rakah is wajib. Omitting it forgetfully requires sajdah as-sahw.',
    },
    {
      unitId: unitWajib.id,
      externalId: 'maktab-4-fiqh-wajib-sajda-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many sujuds are in sajdah as-sahw?',
      options: ['One', 'Two', 'Three', 'Four'],
      correctAnswer: 'Two',
      explanation: 'Sajdah as-sahw consists of two sujuds, after which a fresh tashahhud and final two salams are made.',
    },
    {
      unitId: unitWajib.id,
      externalId: 'maktab-4-fiqh-wajib-sajda-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following is a wajib act in salah?',
      options: [
        'The opening (first) Allahu Akbar',
        'Sitting for the first qadah in a 3 or 4 rakah prayer',
        'Reciting Surah al-Ikhlas',
        'Performing two rakahs only',
      ],
      correctAnswer: 'Sitting for the first qadah in a 3 or 4 rakah prayer',
      explanation: 'The first qadah in a 3 or 4 rakah prayer is wajib. The opening takbir is fard (compulsory).',
    },
    {
      unitId: unitWajib.id,
      externalId: 'maktab-4-fiqh-wajib-sajda-q7',
      type: 'TRUE_FALSE',
      questionText: 'Sajdah as-sahw must be performed in the middle of salah when you realise you forgot a wajib act.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Sajdah as-sahw is only performed at the end of salah — not mid-prayer.',
    },
    // ── Unit 3: Sawm & Tarawih ─────────────────────────────────────
    {
      unitId: unitSawm.id,
      externalId: 'maktab-4-fiqh-sawm-tarawih-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'A person intentionally eats during Ramadan fasting hours. What is required?',
      options: [
        'Qada (make up the day) only',
        'Kaffarah only',
        'Both qada and kaffarah',
        'Nothing — it is forgiven automatically',
      ],
      correctAnswer: 'Both qada and kaffarah',
      explanation: 'Intentionally eating during fasting hours requires both qada (making up the day) and kaffarah (fasting 60 days, or feeding 60 poor people).',
    },
    {
      unitId: unitSawm.id,
      externalId: 'maktab-4-fiqh-sawm-tarawih-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is fidyah?',
      options: [
        'The intention (niyyah) for fasting',
        'A monetary compensation for those permanently unable to fast',
        'The dua to break the fast',
        'The name for the pre-dawn meal',
      ],
      correctAnswer: 'A monetary compensation for those permanently unable to fast',
      explanation: 'Fidyah is paid by elderly or chronically ill people who cannot fast — equivalent to feeding one poor person per missed day.',
    },
    {
      unitId: unitSawm.id,
      externalId: 'maktab-4-fiqh-sawm-tarawih-q3',
      type: 'TRUE_FALSE',
      questionText: 'Swimming is permitted during fasting as long as no water is swallowed.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Swimming itself does not break the fast. The fast only breaks if water is swallowed.',
    },
    {
      unitId: unitSawm.id,
      externalId: 'maktab-4-fiqh-sawm-tarawih-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many rakahs is Tarawih salah?',
      options: ['4 rakahs', '8 rakahs', '12 rakahs', '20 rakahs'],
      correctAnswer: '20 rakahs',
      explanation: 'Tarawih salah consists of 20 rakahs performed after Isha in Ramadan. It is sunnah muakkadah.',
    },
    {
      unitId: unitSawm.id,
      externalId: 'maktab-4-fiqh-sawm-tarawih-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Who organised Tarawih in congregation for the first time?',
      options: [
        'Abu Bakr al-Siddiq',
        'Ali ibn Abi Talib',
        'Umar ibn al-Khattab',
        'Uthman ibn Affan',
      ],
      correctAnswer: 'Umar ibn al-Khattab',
      explanation: 'Umar ibn al-Khattab organised Tarawih into a formal congregational prayer during his caliphate.',
    },
    {
      unitId: unitSawm.id,
      externalId: 'maktab-4-fiqh-sawm-tarawih-q6',
      type: 'TRUE_FALSE',
      questionText: 'A traveller (musafir) who misses fasts must pay fidyah instead of making up the days.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'A traveller must make up (qada) missed days after Ramadan. Fidyah is only for those permanently unable to fast.',
    },
    {
      unitId: unitSawm.id,
      externalId: 'maktab-4-fiqh-sawm-tarawih-q7',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following does NOT break the fast?',
      options: [
        'Intentionally drinking water',
        'Intentionally eating food',
        'Sleeping during the day',
        'Intentional sexual intercourse',
      ],
      correctAnswer: 'Sleeping during the day',
      explanation: 'Sleeping during the day does not break the fast. It is only the actions involving intake of food/drink or other specified acts that break it.',
    },
    // ── Unit 4: Charity & Good Character ────────────────────────────
    {
      unitId: unitCharity.id,
      externalId: 'maktab-4-ahadith-charity-character-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'According to the hadith, what does Allah do for a person who relieves a believer of worldly hardship?',
      options: [
        'Gives them wealth in this world',
        'Relieves them of hardship on the Day of Resurrection',
        'Forgives all their past sins',
        'Gives them Jannah without account',
      ],
      correctAnswer: 'Relieves them of hardship on the Day of Resurrection',
      explanation: 'Whoever relieves a believer of a hardship in this world, Allah will relieve them of a hardship on the Day of Resurrection. (Muslim)',
    },
    {
      unitId: unitCharity.id,
      externalId: 'maktab-4-ahadith-charity-character-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'According to the hadith, who is the best among people?',
      options: [
        'Those who are wealthiest',
        'Those who memorise the most Quran',
        'Those with the best character (akhlaq)',
        'Those who fast the most',
      ],
      correctAnswer: 'Those with the best character (akhlaq)',
      explanation: 'The Prophet said: "The best of you are those with the best character (akhlaq)." (Bukhari and Muslim)',
    },
    {
      unitId: unitCharity.id,
      externalId: 'maktab-4-ahadith-charity-character-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'The Prophet compared a good companion to which of the following?',
      options: ['A blacksmith', 'A perfume seller', 'A farmer', 'A doctor'],
      correctAnswer: 'A perfume seller',
      explanation: 'A good companion is like a perfume seller — you benefit from the pleasant smell. A bad companion is like a blacksmith — you suffer from smoke and sparks.',
    },
    {
      unitId: unitCharity.id,
      externalId: 'maktab-4-ahadith-charity-character-q4',
      type: 'TRUE_FALSE',
      questionText: 'Aisha described the character of the Prophet as "the Quran."',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'When asked about the Prophet\'s character, Aisha said: "His character was the Quran." He embodied the Quran in every way.',
    },
    {
      unitId: unitCharity.id,
      externalId: 'maktab-4-ahadith-charity-character-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'The hadith about friends warns that a person follows the ___ of their close friend.',
      options: ['Wealth', 'Appearance', 'Religion (deen)', 'Family'],
      correctAnswer: 'Religion (deen)',
      explanation: 'The Prophet said: "A person is on the religion of his close friend." Our companions powerfully influence our faith.',
    },
    {
      unitId: unitCharity.id,
      externalId: 'maktab-4-ahadith-charity-character-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following best describes good character in Islam?',
      options: [
        'Being wealthy and generous only',
        'Being kind, truthful, patient and respectful to all',
        'Performing Hajj and fasting Ramadan',
        'Memorising all 99 names of Allah',
      ],
      correctAnswer: 'Being kind, truthful, patient and respectful to all',
      explanation: 'Good character (akhlaq) includes kindness, truthfulness, patience, generosity, and respect — qualities the Prophet embodied.',
    },
    // ── Unit 5: Trust, Dhikr & Dua ──────────────────────────────────
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-4-ahadith-trust-dhikr-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What title was the Prophet given by the people of Makkah before prophethood?',
      options: ['Al-Amin (The Trustworthy)', 'As-Sadiq (The Truthful)', 'Al-Karim (The Generous)', 'Al-Wali (The Friend)'],
      correctAnswer: 'Al-Amin (The Trustworthy)',
      explanation: 'The Prophet was known as Al-Amin (the Trustworthy) long before his prophethood — showing that amanah is fundamental to his character.',
    },
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-4-ahadith-trust-dhikr-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which dhikr phrases are called "keys to paradise" by the Prophet?',
      options: [
        'Astaghfirullah, Alhamdulillah, Bismillah',
        'SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha illallah',
        'La hawla wala quwwata illa billah',
        'Hasbunallah wa nimal wakeel',
      ],
      correctAnswer: 'SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha illallah',
      explanation: 'The Prophet described SubhanAllah, Alhamdulillah, La ilaha illallah, and Allahu Akbar as the "keys to paradise."',
    },
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-4-ahadith-trust-dhikr-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What are the three signs of a hypocrite mentioned in the hadith?',
      options: [
        'Lying, breaking promises, and betraying trust',
        'Missing salah, not paying zakat, and backbiting',
        'Showing off, arrogance, and stinginess',
        'Eating haram, swearing, and stealing',
      ],
      correctAnswer: 'Lying, breaking promises, and betraying trust',
      explanation: 'The Prophet said: when he speaks he lies, when he promises he breaks it, and when trusted he betrays the trust.',
    },
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-4-ahadith-trust-dhikr-q4',
      type: 'TRUE_FALSE',
      questionText: 'Dua made in sujud (prostration) is one of the especially accepted times for dua.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet said: "The servant is closest to his Lord when in sujud, so increase your dua in it."',
    },
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-4-ahadith-trust-dhikr-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many times is SubhanAllah said after salah?',
      options: ['10 times', '25 times', '33 times', '99 times'],
      correctAnswer: '33 times',
      explanation: 'After each salah: SubhanAllah 33 times, Alhamdulillah 33 times, Allahu Akbar 34 times — totalling 100.',
    },
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-4-ahadith-trust-dhikr-q6',
      type: 'TRUE_FALSE',
      questionText: 'Having halal (permissible) earnings is a condition for dua to be accepted.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet mentioned the case of a man who ate haram and whose dua was not accepted. Halal earnings are a condition for accepted dua.',
    },
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-4-ahadith-trust-dhikr-q7',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Dua between which two things is especially accepted on Friday?',
      options: [
        'Between Fajr and Dhuhr',
        'Between Asr and Maghrib',
        'Between Maghrib and Isha',
        'Between Dhuhr and Asr',
      ],
      correctAnswer: 'Between Asr and Maghrib',
      explanation: 'The Prophet mentioned a special hour on Friday between Asr and Maghrib as an especially accepted time for dua.',
    },
    // ── Unit 6: Hijrah to Madinah ────────────────────────────────────
    {
      unitId: unitHijrah.id,
      externalId: 'maktab-4-sirah-hijrah-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Who was the sole companion of the Prophet during the Hijrah to Madinah?',
      options: ['Ali ibn Abi Talib', 'Umar ibn al-Khattab', 'Abu Bakr al-Siddiq', 'Uthman ibn Affan'],
      correctAnswer: 'Abu Bakr al-Siddiq',
      explanation: 'Abu Bakr al-Siddiq was the only companion who accompanied the Prophet on the Hijrah journey to Madinah.',
    },
    {
      unitId: unitHijrah.id,
      externalId: 'maktab-4-sirah-hijrah-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'In which cave did the Prophet and Abu Bakr take shelter during the Hijrah?',
      options: ['Cave of Hira', 'Cave of Thawr', 'Cave of Uhud', 'Cave of Badr'],
      correctAnswer: 'Cave of Thawr',
      explanation: 'The Prophet and Abu Bakr hid in the Cave of Thawr for three days while the Quraysh searched for them.',
    },
    {
      unitId: unitHijrah.id,
      externalId: 'maktab-4-sirah-hijrah-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What was built at Quba, the first stopping point near Madinah?',
      options: [
        'The first school (madrasa)',
        'Masjid al-Haram',
        'Masjid Quba — the first mosque in Islam',
        'A market place',
      ],
      correctAnswer: 'Masjid Quba — the first mosque in Islam',
      explanation: 'The Prophet laid the foundations of Masjid Quba during his stay — the first mosque ever built in Islam.',
    },
    {
      unitId: unitHijrah.id,
      externalId: 'maktab-4-sirah-hijrah-q4',
      type: 'TRUE_FALSE',
      questionText: 'The Islamic (Hijri) calendar begins from the year of the Hijrah.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Hijrah is so significant that the Islamic lunar calendar begins from its year — 1 AH (After Hijrah).',
    },
    {
      unitId: unitHijrah.id,
      externalId: 'maktab-4-sirah-hijrah-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Who slept in the bed of the Prophet the night of the planned assassination?',
      options: ['Abu Bakr al-Siddiq', 'Umar ibn al-Khattab', 'Ali ibn Abi Talib', 'Salman al-Farisi'],
      correctAnswer: 'Ali ibn Abi Talib',
      explanation: 'Ali ibn Abi Talib bravely slept in the Prophet\'s bed that night to mislead the Quraysh while the Prophet escaped.',
    },
    {
      unitId: unitHijrah.id,
      externalId: 'maktab-4-sirah-hijrah-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What miracle protected the Prophet and Abu Bakr at the Cave of Thawr?',
      options: [
        'The cave shook and the Quraysh fled',
        'A spider wove its web and a pigeon nested at the entrance',
        'A thick mist filled the cave',
        'Lightning struck the Quraysh',
      ],
      correctAnswer: 'A spider wove its web and a pigeon nested at the entrance',
      explanation: 'Allah caused a spider to spin its web and a pigeon to nest at the cave entrance, making the Quraysh believe no one had entered.',
    },
    {
      unitId: unitHijrah.id,
      externalId: 'maktab-4-sirah-hijrah-q7',
      type: 'TRUE_FALSE',
      questionText: 'The Prophet chose the site of Masjid an-Nabawi himself based on its beauty.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Prophet allowed his camel to walk freely — wherever it stopped became the site of Masjid an-Nabawi, showing trust in Allah\'s guidance.',
    },
    // ── Unit 7: Brotherhood, Treaties & Battle of Ahzab ─────────────
    {
      unitId: unitAhzab.id,
      externalId: 'maktab-4-sirah-brotherhood-ahzab-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the name for the Muslims who migrated from Makkah to Madinah?',
      options: ['Ansar', 'Muhajirin', 'Muttaqin', 'Sahabah'],
      correctAnswer: 'Muhajirin',
      explanation: 'Muhajirin means "those who migrated." They are the Muslims who left Makkah and migrated to Madinah for Allah\'s sake.',
    },
    {
      unitId: unitAhzab.id,
      externalId: 'maktab-4-sirah-brotherhood-ahzab-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the name for the Muslims of Madinah who welcomed the migrants?',
      options: ['Muhajirin', 'Ansar', 'Quraysh', 'Muttaqin'],
      correctAnswer: 'Ansar',
      explanation: 'Ansar means "helpers." They are the Muslims of Madinah who welcomed the Muhajirin and shared their homes and wealth with them.',
    },
    {
      unitId: unitAhzab.id,
      externalId: 'maktab-4-sirah-brotherhood-ahzab-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Who suggested digging a trench around Madinah in the Battle of the Trench?',
      options: ['Abu Bakr al-Siddiq', 'Umar ibn al-Khattab', 'Salman al-Farisi', 'Ali ibn Abi Talib'],
      correctAnswer: 'Salman al-Farisi',
      explanation: 'Salman al-Farisi, a Persian companion, suggested the Persian military strategy of digging a trench to defend Madinah.',
    },
    {
      unitId: unitAhzab.id,
      externalId: 'maktab-4-sirah-brotherhood-ahzab-q4',
      type: 'TRUE_FALSE',
      questionText: 'The Mithaq al-Madinah (Charter of Madinah) was an agreement between Muslims only.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Mithaq al-Madinah was an agreement between Muslim and Jewish communities in Madinah — a multi-faith charter.',
    },
    {
      unitId: unitAhzab.id,
      externalId: 'maktab-4-sirah-brotherhood-ahzab-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Approximately how large was the Ahzab (Confederates) army at the Battle of the Trench?',
      options: ['500 soldiers', '1,000 soldiers', '3,000 soldiers', 'About 10,000 soldiers'],
      correctAnswer: 'About 10,000 soldiers',
      explanation: 'The Ahzab coalition assembled about 10,000 fighters — the largest force yet assembled against the Muslims.',
    },
    {
      unitId: unitAhzab.id,
      externalId: 'maktab-4-sirah-brotherhood-ahzab-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is Muakhah?',
      options: [
        'The treaty with Jewish tribes',
        'The Islamic brotherhood pairing of Muhajirin and Ansar',
        'The battle strategy at Khandaq',
        'The name of the trench',
      ],
      correctAnswer: 'The Islamic brotherhood pairing of Muhajirin and Ansar',
      explanation: 'Muakhah means brotherhood — the Prophet paired each Muhajir with an Ansari, creating bonds of brotherhood based on faith.',
    },
    {
      unitId: unitAhzab.id,
      externalId: 'maktab-4-sirah-brotherhood-ahzab-q7',
      type: 'TRUE_FALSE',
      questionText: 'A major battle was fought at the trench with many casualties on both sides.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'No major battle was fought. The trench prevented the enemy from entering and after 27 days of siege they departed. Strategy won the day.',
    },
    // ── Unit 8: Prophet Yusuf Part 1 ────────────────────────────────
    {
      unitId: unitYusuf1.id,
      externalId: 'maktab-4-tarikh-yusuf-1-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What did Yusuf see in his dream?',
      options: [
        'A river and a palace',
        'Eleven stars, the sun, and the moon prostrating to him',
        'Seven cows and seven ears of grain',
        'A bright light from the sky',
      ],
      correctAnswer: 'Eleven stars, the sun, and the moon prostrating to him',
      explanation: 'Yusuf dreamed that eleven stars, the sun, and the moon were prostrating to him — which came true when his family arrived in Egypt.',
    },
    {
      unitId: unitYusuf1.id,
      externalId: 'maktab-4-tarikh-yusuf-1-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Why did Yusuf\'s brothers throw him in the well?',
      options: [
        'He broke their trust',
        'They were jealous of their father\'s love for him',
        'He refused to work',
        'He reported their wrongdoing to their father',
      ],
      correctAnswer: 'They were jealous of their father\'s love for him',
      explanation: 'Yusuf\'s brothers were deeply jealous because their father Yaqub loved Yusuf more than them.',
    },
    {
      unitId: unitYusuf1.id,
      externalId: 'maktab-4-tarikh-yusuf-1-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How did Yusuf end up in Egypt?',
      options: [
        'He walked there himself',
        'His father sent him',
        'He was sold as a slave by travellers who found him in the well',
        'The Aziz of Egypt invited him',
      ],
      correctAnswer: 'He was sold as a slave by travellers who found him in the well',
      explanation: 'A passing caravan found Yusuf in the well, pulled him out, and sold him as a slave in Egypt to al-Aziz.',
    },
    {
      unitId: unitYusuf1.id,
      externalId: 'maktab-4-tarikh-yusuf-1-q4',
      type: 'TRUE_FALSE',
      questionText: 'Yusuf gave in to the temptation of Zulaykha.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Yusuf firmly refused, said "I seek refuge in Allah," and ran to the door. He chose prison over sin.',
    },
    {
      unitId: unitYusuf1.id,
      externalId: 'maktab-4-tarikh-yusuf-1-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What did Yusuf say when he chose prison over sin?',
      options: [
        '"O Allah give me strength"',
        '"Prison is more beloved to me than what they invite me to"',
        '"I will obey what my master says"',
        '"I am not afraid of prison"',
      ],
      correctAnswer: '"Prison is more beloved to me than what they invite me to"',
      explanation: 'Yusuf made a dua to Allah and said: "My Lord, prison is more beloved to me than what they invite me to."',
    },
    {
      unitId: unitYusuf1.id,
      externalId: 'maktab-4-tarikh-yusuf-1-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What lie did Yusuf\'s brothers tell their father?',
      options: [
        'That Yusuf had run away to Egypt',
        'That Yusuf had died in a flood',
        'That a wolf had eaten Yusuf',
        'That Yusuf had refused to come back',
      ],
      correctAnswer: 'That a wolf had eaten Yusuf',
      explanation: 'The brothers brought Yusuf\'s shirt stained with false blood and told their father a wolf had eaten him.',
    },
    {
      unitId: unitYusuf1.id,
      externalId: 'maktab-4-tarikh-yusuf-1-q7',
      type: 'TRUE_FALSE',
      questionText: 'The story of Yusuf is in Surah Yusuf, which the Quran calls "the best of stories."',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Quran calls it "ahsanal qasas" — the best of stories — in Surah Yusuf (12:3).',
    },
    // ── Unit 9: Prophet Yusuf Part 2 ────────────────────────────────
    {
      unitId: unitYusuf2.id,
      externalId: 'maktab-4-tarikh-yusuf-2-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What was the King\'s dream that only Yusuf could interpret?',
      options: [
        'Seven mountains and seven valleys',
        'Seven fat cows eaten by seven lean cows, and seven green and dry ears of grain',
        'A bright star and a dark moon',
        'A river running dry and a garden blooming',
      ],
      correctAnswer: 'Seven fat cows eaten by seven lean cows, and seven green and dry ears of grain',
      explanation: 'The King dreamed of seven fat cows eaten by seven lean ones, and seven green and seven dry ears of grain. Only Yusuf correctly interpreted it.',
    },
    {
      unitId: unitYusuf2.id,
      externalId: 'maktab-4-tarikh-yusuf-2-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What did Yusuf\'s interpretation predict?',
      options: [
        '7 years of drought followed by 7 years of plenty',
        '7 years of plenty followed by 7 years of drought, then 1 year of rain',
        '14 years of war followed by peace',
        '7 years of floods followed by 7 years of peace',
      ],
      correctAnswer: '7 years of plenty followed by 7 years of drought, then 1 year of rain',
      explanation: 'Yusuf interpreted: 7 years of abundant harvest, then 7 years of severe drought, then 1 year of rain and relief.',
    },
    {
      unitId: unitYusuf2.id,
      externalId: 'maktab-4-tarikh-yusuf-2-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What role was Yusuf given after his release from prison?',
      options: [
        'Military commander',
        'Chief advisor to the Queen',
        'Treasurer and overseer of Egypt\'s storehouses',
        'Judge of the city',
      ],
      correctAnswer: 'Treasurer and overseer of Egypt\'s storehouses',
      explanation: 'The King appointed Yusuf as Treasurer and Overseer of Egypt\'s storehouses to manage the food supply for the coming drought.',
    },
    {
      unitId: unitYusuf2.id,
      externalId: 'maktab-4-tarikh-yusuf-2-q4',
      type: 'TRUE_FALSE',
      questionText: 'Yusuf took revenge on his brothers when they arrived in Egypt.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Yusuf forgave his brothers completely, saying: "No blame upon you today. May Allah forgive you."',
    },
    {
      unitId: unitYusuf2.id,
      externalId: 'maktab-4-tarikh-yusuf-2-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What happened when Yusuf\'s parents and brothers arrived in Egypt?',
      options: [
        'Yusuf hid from them',
        'They prostrated to him, fulfilling his childhood dream',
        'The King expelled them',
        'Yusuf returned to Makkah with them',
      ],
      correctAnswer: 'They prostrated to him, fulfilling his childhood dream',
      explanation: 'When the family was reunited, they prostrated before Yusuf — fulfilling the childhood dream of the sun, moon, and eleven stars prostrating to him.',
    },
    {
      unitId: unitYusuf2.id,
      externalId: 'maktab-4-tarikh-yusuf-2-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the main lesson from the story of Prophet Yusuf?',
      options: [
        'Never trust your brothers',
        'Seek power in every situation',
        'Patience (sabr) and trust in Allah always lead to a good outcome',
        'Move to a new country when things get difficult',
      ],
      correctAnswer: 'Patience (sabr) and trust in Allah always lead to a good outcome',
      explanation: 'Despite betrayal, slavery, and imprisonment, Yusuf\'s patience and trust in Allah brought him to great honour.',
    },
    {
      unitId: unitYusuf2.id,
      externalId: 'maktab-4-tarikh-yusuf-2-q7',
      type: 'TRUE_FALSE',
      questionText: 'Zulaykha admitted Yusuf\'s innocence before the King.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'When the King investigated, Zulaykha admitted: "I was the one who tried to seduce him — Yusuf is completely truthful."',
    },
    // ── Unit 10: Major Signs of Qiyamah ──────────────────────────────
    {
      unitId: unitQiyamah.id,
      externalId: 'maktab-4-aqaid-signs-qiyamah-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What will the Dajjal (False Messiah) first claim?',
      options: [
        'He will claim to be a righteous king',
        'He will claim to be a prophet, then later claim to be Allah',
        'He will claim to be the Mahdi',
        'He will claim to be Isa',
      ],
      correctAnswer: 'He will claim to be a prophet, then later claim to be Allah',
      explanation: 'The Dajjal will first claim prophethood, then escalate to claiming to be Allah — the greatest lie ever told.',
    },
    {
      unitId: unitQiyamah.id,
      externalId: 'maktab-4-aqaid-signs-qiyamah-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What will be written on the Dajjal\'s forehead?',
      options: ['Dajjal', 'Kafir (disbeliever)', 'La ilaha illallah', 'Al-Masih'],
      correctAnswer: 'Kafir (disbeliever)',
      explanation: 'The word "Kafir" (disbeliever) will be written on the Dajjal\'s forehead — readable by every believing Muslim, even the unlettered.',
    },
    {
      unitId: unitQiyamah.id,
      externalId: 'maktab-4-aqaid-signs-qiyamah-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What will happen after the sun rises from the west?',
      options: [
        'Isa will descend',
        'The door of repentance will be closed forever',
        'Yajuj and Majuj will be released',
        'The trumpet will be blown',
      ],
      correctAnswer: 'The door of repentance will be closed forever',
      explanation: 'After the sun rises from the west, tawbah (repentance) will no longer be accepted.',
    },
    {
      unitId: unitQiyamah.id,
      externalId: 'maktab-4-aqaid-signs-qiyamah-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What will Prophet Isa do when he descends near the end of times?',
      options: [
        'Build a new Masjid',
        'Kill the Dajjal and establish justice based on Islamic law',
        'Start a new religion',
        'Take all believers to paradise immediately',
      ],
      correctAnswer: 'Kill the Dajjal and establish justice based on Islamic law',
      explanation: 'Isa will descend, defeat and kill the Dajjal near Ludd, and establish a just rule based on the Shariah of Prophet Muhammad.',
    },
    {
      unitId: unitQiyamah.id,
      externalId: 'maktab-4-aqaid-signs-qiyamah-q5',
      type: 'TRUE_FALSE',
      questionText: 'The Dajjal can enter both Makkah and Madinah.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Dajjal cannot enter Makkah or Madinah — angels guard these cities. This is a special divine protection.',
    },
    {
      unitId: unitQiyamah.id,
      externalId: 'maktab-4-aqaid-signs-qiyamah-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Who are Yajuj and Majuj?',
      options: [
        'Two angels of punishment',
        'Two destructive groups of people who will be released near the end of times',
        'The names of the two angels who blow the trumpet',
        'Two ancient civilisations already destroyed',
      ],
      correctAnswer: 'Two destructive groups of people who will be released near the end of times',
      explanation: 'Yajuj and Majuj are two massive, destructive groups currently held behind a wall, who will be released as a major sign of Qiyamah.',
    },
    {
      unitId: unitQiyamah.id,
      externalId: 'maktab-4-aqaid-signs-qiyamah-q7',
      type: 'TRUE_FALSE',
      questionText: 'Belief in Yawm al-Qiyamah (the Day of Resurrection) is one of the six pillars of iman.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Iman bil-Akhirah (belief in the Hereafter, including Yawm al-Qiyamah) is the fifth of the six pillars of iman.',
    },
    // ── Unit 11: Protection from Dajjal & Akhirah Awareness ─────────
    {
      unitId: unitProtection.id,
      externalId: 'maktab-4-aqaid-protection-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which surah protects a person from the trial of the Dajjal when memorised?',
      options: ['Surah al-Baqarah', 'Surah al-Kahf', 'Surah Yasin', 'Surah al-Mulk'],
      correctAnswer: 'Surah al-Kahf',
      explanation: 'The Prophet said: whoever memorises 10 verses from the beginning (or end) of Surah al-Kahf will be protected from the Dajjal.',
    },
    {
      unitId: unitProtection.id,
      externalId: 'maktab-4-aqaid-protection-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'When should Surah al-Kahf be recited according to the sunnah?',
      options: ['Every night after Isha', 'On Fridays', 'In every salah', 'Only in Ramadan'],
      correctAnswer: 'On Fridays',
      explanation: 'It is sunnah to recite Surah al-Kahf every Friday. Its light illuminates from one Friday to the next.',
    },
    {
      unitId: unitProtection.id,
      externalId: 'maktab-4-aqaid-protection-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What should a person do if they hear the Dajjal has appeared?',
      options: [
        'Go and see his miracles to confirm the truth',
        'Stay far away from him',
        'Challenge him directly',
        'Move to Madinah only if you are a scholar',
      ],
      correctAnswer: 'Stay far away from him',
      explanation: 'The Prophet warned: "Whoever hears of the Dajjal should stay far away from him." His powers could confuse even the faithful.',
    },
    {
      unitId: unitProtection.id,
      externalId: 'maktab-4-aqaid-protection-q4',
      type: 'TRUE_FALSE',
      questionText: 'The dua for protection from the Dajjal is recited in every salah after the final tashahhud.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'After the final tashahhud and before the salam, we seek refuge from four things including "the evil trial of al-Masih al-Dajjal."',
    },
    {
      unitId: unitProtection.id,
      externalId: 'maktab-4-aqaid-protection-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'The Prophet said: "Be in this world as though you are a ___ or traveller passing through."',
      options: ['King', 'Scholar', 'Stranger', 'Merchant'],
      correctAnswer: 'Stranger',
      explanation: 'The Prophet said: "Be in this world as though you are a stranger or a traveller passing through." This teaches detachment from worldly life.',
    },
    {
      unitId: unitProtection.id,
      externalId: 'maktab-4-aqaid-protection-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Why is remembering death important for a Muslim?',
      options: [
        'It makes you sad and stops you enjoying life',
        'It helps you avoid distractions, repent quickly, and focus on good deeds',
        'It is only important for old people',
        'It is required only in Ramadan',
      ],
      correctAnswer: 'It helps you avoid distractions, repent quickly, and focus on good deeds',
      explanation: 'Remembering death keeps a Muslim focused on what truly matters and encourages consistent good deeds.',
    },
    {
      unitId: unitProtection.id,
      externalId: 'maktab-4-aqaid-protection-q7',
      type: 'TRUE_FALSE',
      questionText: 'The Dajjal will have complete power over the whole earth including Makkah and Madinah.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Dajjal cannot enter Makkah or Madinah. Angels guard these two cities from his entry.',
    },
    // ── Unit 12: Amanah & Seeking Permission ─────────────────────────
    {
      unitId: unitTrust.id,
      externalId: 'maktab-4-akhlaq-trust-permission-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What does "amanah" mean?',
      options: ['Prayer', 'Trustworthiness and fulfilling responsibilities', 'Generosity', 'Patience'],
      correctAnswer: 'Trustworthiness and fulfilling responsibilities',
      explanation: 'Amanah means trustworthiness — fulfilling every responsibility entrusted to you, whether returning belongings, keeping secrets, or completing duties.',
    },
    {
      unitId: unitTrust.id,
      externalId: 'maktab-4-akhlaq-trust-permission-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What title did the people of Makkah give the Prophet because of his trustworthiness?',
      options: ['Al-Amin', 'Al-Karim', 'Al-Waliy', 'Al-Sadiq'],
      correctAnswer: 'Al-Amin',
      explanation: 'The Prophet was called Al-Amin (the Trustworthy) by the people of Makkah before prophethood.',
    },
    {
      unitId: unitTrust.id,
      externalId: 'maktab-4-akhlaq-trust-permission-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many times should you seek permission before entering someone\'s home?',
      options: ['Once', 'Twice', 'Three times', 'As many times as needed'],
      correctAnswer: 'Three times',
      explanation: 'The sunnah is to seek permission three times. If there is no answer after the third, leave — do not persist.',
    },
    {
      unitId: unitTrust.id,
      externalId: 'maktab-4-akhlaq-trust-permission-q4',
      type: 'TRUE_FALSE',
      questionText: 'A person has no iman (faith) if they have no amanah, according to the hadith.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The hadith states: "There is no iman in the one who has no amanah, and there is no deen in the one who does not honour his promises."',
    },
    {
      unitId: unitTrust.id,
      externalId: 'maktab-4-akhlaq-trust-permission-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Where should you stand when knocking on someone\'s door?',
      options: [
        'Directly in front of the door',
        'To the side of the door, not directly in front',
        'At a distance of 10 metres',
        'Behind the door',
      ],
      correctAnswer: 'To the side of the door, not directly in front',
      explanation: 'The sunnah is to stand to the side of the door so you do not accidentally look inside when it opens.',
    },
    {
      unitId: unitTrust.id,
      externalId: 'maktab-4-akhlaq-trust-permission-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which surah contains the Quranic command to seek permission before entering homes?',
      options: ['Surah al-Baqarah', 'Surah an-Nur', 'Surah al-Hujurat', 'Surah al-Ahzab'],
      correctAnswer: 'Surah an-Nur',
      explanation: 'Surah an-Nur (24:27) contains the command: "Do not enter houses other than your own until you have asked permission and greeted the people inside."',
    },
    {
      unitId: unitTrust.id,
      externalId: 'maktab-4-akhlaq-trust-permission-q7',
      type: 'TRUE_FALSE',
      questionText: 'When asked "Who is it?" through the door, it is correct to reply "It is me."',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The sunnah is to say your actual name (e.g., "It is Fatimah"). Saying "It is me" gives no useful information.',
    },
    // ── Unit 13: Good Neighbours & Removing Harm ─────────────────────
    {
      unitId: unitNeighbours.id,
      externalId: 'maktab-4-akhlaq-neighbours-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many houses in each direction are considered your neighbours according to Islamic scholars?',
      options: ['10 houses', '20 houses', '40 houses', '100 houses'],
      correctAnswer: '40 houses',
      explanation: 'Islamic scholars say 40 houses in each direction are considered your neighbours who have rights over you.',
    },
    {
      unitId: unitNeighbours.id,
      externalId: 'maktab-4-akhlaq-neighbours-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'According to the hadith, who kept advising the Prophet about the rights of neighbours?',
      options: ['The Companions', 'Jibril (Angel Jibreel)', 'Musa', 'The scholars of Madinah'],
      correctAnswer: 'Jibril (Angel Jibreel)',
      explanation: 'The Prophet said: "Jibril kept advising me about the neighbour until I thought he would give the neighbour a share of inheritance."',
    },
    {
      unitId: unitNeighbours.id,
      externalId: 'maktab-4-akhlaq-neighbours-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Removing a stone or nail from the road is described in the hadith as:',
      options: ['A minor sunnah', 'An act of sadaqah (charity)', 'Only important for scholars', 'A duty only in Ramadan'],
      correctAnswer: 'An act of sadaqah (charity)',
      explanation: 'The Prophet said: "Removing a harmful object from the road is an act of sadaqah (charity)." It is also a branch of iman.',
    },
    {
      unitId: unitNeighbours.id,
      externalId: 'maktab-4-akhlaq-neighbours-q4',
      type: 'TRUE_FALSE',
      questionText: 'A non-Muslim neighbour has no rights in Islam.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Non-Muslim neighbours have two rights: as neighbours and as human beings. We must treat them kindly and not cause them harm.',
    },
    {
      unitId: unitNeighbours.id,
      externalId: 'maktab-4-akhlaq-neighbours-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which type of neighbour has THREE rights in Islam?',
      options: [
        'The elderly neighbour',
        'The Muslim neighbour',
        'The non-Muslim neighbour',
        'The neighbour who is a scholar',
      ],
      correctAnswer: 'The Muslim neighbour',
      explanation: 'The Muslim neighbour has three rights: as a neighbour, as a fellow Muslim, and (if related) as family.',
    },
    {
      unitId: unitNeighbours.id,
      externalId: 'maktab-4-akhlaq-neighbours-q6',
      type: 'TRUE_FALSE',
      questionText: 'Removing harm from the road is one of the branches (shuab) of iman (faith).',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet listed removing harm from the road as the lowest branch of faith — showing that small acts of care for others are part of iman.',
    },
    {
      unitId: unitNeighbours.id,
      externalId: 'maktab-4-akhlaq-neighbours-q7',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following is NOT part of the rights of a neighbour?',
      options: [
        'Greeting them with salam',
        'Helping them when ill',
        'Lending them money with interest',
        'Sharing food with them',
      ],
      correctAnswer: 'Lending them money with interest',
      explanation: 'Lending money with interest (riba) is haram. Rights of neighbours include greeting, sharing food, helping in illness, and protecting their honour.',
    },
    // ── Unit 14: Adab — Dua, Dressing, Guests & Istinja ─────────────
    {
      unitId: unitAdab.id,
      externalId: 'maktab-4-adab-all-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which side do you start with when getting dressed?',
      options: ['Left side first', 'Right side first', 'Either side is fine', 'Start with the head'],
      correctAnswer: 'Right side first',
      explanation: 'It is sunnah to begin dressing with the right side and when undressing, start with the left side.',
    },
    {
      unitId: unitAdab.id,
      externalId: 'maktab-4-adab-all-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'For how many days is a host obligated to give generous hospitality to a guest?',
      options: ['One day', 'Three days', 'Seven days', 'For as long as the guest stays'],
      correctAnswer: 'Three days',
      explanation: 'The Prophet said the period of generous hospitality is three days. After that, any additional hospitality is sadaqah.',
    },
    {
      unitId: unitAdab.id,
      externalId: 'maktab-4-adab-all-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What dua is said when entering the toilet?',
      options: [
        'Bismillah only',
        'Allahumma inni audhu bika minal khubuthi wal khaba-ith',
        'Subhanallah wa bihamdihi',
        'La ilaha illallah',
      ],
      correctAnswer: 'Allahumma inni audhu bika minal khubuthi wal khaba-ith',
      explanation: 'Before entering the toilet, we say: "Allahumma inni audhu bika minal khubuthi wal khaba-ith" — seeking protection from evil spirits.',
    },
    {
      unitId: unitAdab.id,
      externalId: 'maktab-4-adab-all-q4',
      type: 'TRUE_FALSE',
      questionText: 'Dua made while it is raining is one of the accepted times for dua.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Rain is a time of mercy from Allah, and dua during rain is one of the accepted times mentioned in hadith.',
    },
    {
      unitId: unitAdab.id,
      externalId: 'maktab-4-adab-all-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the dua said when leaving the toilet?',
      options: ['Bismillah', 'Alhamdulillah', 'Ghufranaka', 'Allahu Akbar'],
      correctAnswer: 'Ghufranaka',
      explanation: 'When exiting the toilet with the right foot first, we say: "Ghufranaka" — "I seek Your forgiveness, O Allah."',
    },
    {
      unitId: unitAdab.id,
      externalId: 'maktab-4-adab-all-q6',
      type: 'MULTIPLE_CHOICE',
      questionText: 'According to the hadith, what must the one who believes in Allah and the Last Day do regarding guests?',
      options: [
        'Feed them for 7 days',
        'Honour and welcome the guest',
        'Give them a gift',
        'Invite all neighbours to meet the guest',
      ],
      correctAnswer: 'Honour and welcome the guest',
      explanation: 'The Prophet said: "Whoever believes in Allah and the Last Day, let him honour his guest." Welcoming guests is an act of faith.',
    },
    {
      unitId: unitAdab.id,
      externalId: 'maktab-4-adab-all-q7',
      type: 'TRUE_FALSE',
      questionText: 'Having haram earnings is a barrier to dua being accepted.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet mentioned the case of a man whose food, drink, and clothing were all haram — his dua was not accepted despite raising his hands.',
    },
    {
      unitId: unitAdab.id,
      externalId: 'maktab-4-adab-all-q8',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which foot do you enter the toilet with?',
      options: ['Right foot first', 'Left foot first', 'Either foot', 'Barefoot only'],
      correctAnswer: 'Left foot first',
      explanation: 'We enter the toilet with the left foot first, and exit with the right foot first. This is the opposite of the masjid etiquette.',
    },
  ];

  console.log(`\n📝 Upserting ${quizData.length} quiz questions...`);

  for (const q of quizData) {
    await prisma.question.upsert({
      where: { externalId: q.externalId },
      create: {
        externalId: q.externalId,
        unitId: q.unitId,
        type: q.type as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK',
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'MEDIUM',
      },
      update: {
        unitId: q.unitId,
        type: q.type as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK',
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'MEDIUM',
      },
    });
  }

  console.log('✅ All quiz questions upserted');

  // ═════════════════════════════════════════════
  // FLASHCARDS — ~25 cards for the whole course
  // ═════════════════════════════════════════════

  const flashcardData = [
    { unitId: unitMasah.id, front: 'Masah alal Khuffayn', back: 'Wiping over leather socks or thick footwear instead of washing the feet during wudu — a concession in Islamic law.' },
    { unitId: unitMasah.id, front: 'Jabirah masah', back: 'Wiping over a wound bandage, cast, or dressing during wudu or ghusl when removing it would cause harm. No time limit applies.' },
    { unitId: unitWajib.id, front: 'Wajib act in salah', back: 'An obligatory act in prayer that ranks below fard. Omitting it intentionally invalidates the salah; omitting it forgetfully requires sajdah as-sahw.' },
    { unitId: unitWajib.id, front: 'Sajdah as-Sahw', back: 'Prostration of forgetfulness — two sujuds performed at the end of salah to compensate for accidentally omitting a wajib act.' },
    { unitId: unitSawm.id, front: 'Qada', back: 'Making up a missed or broken fast by fasting a replacement day after Ramadan.' },
    { unitId: unitSawm.id, front: 'Kaffarah', back: 'Expiation for intentionally breaking a Ramadan fast: freeing a slave, OR fasting 60 consecutive days, OR feeding 60 poor people.' },
    { unitId: unitSawm.id, front: 'Fidyah', back: 'Monetary compensation paid by those permanently unable to fast (elderly, chronically ill) — equivalent to feeding one poor person per missed day.' },
    { unitId: unitSawm.id, front: 'Tarawih', back: 'Special night prayer of 20 rakahs performed after Isha each night in Ramadan. It is sunnah muakkadah.' },
    { unitId: unitCharity.id, front: 'Akhlaq', back: 'Character and moral conduct. The Prophet said: "The best of you are those with the best akhlaq."' },
    { unitId: unitDhikr.id, front: 'Amanah', back: 'Trustworthiness — fulfilling responsibilities, returning belongings, keeping secrets, and being honest. Al-Amin was the Prophet\'s title.' },
    { unitId: unitDhikr.id, front: 'SubhanAllah', back: 'Glory be to Allah — said 33 times after salah; one of the "keys to paradise" mentioned in hadith.' },
    { unitId: unitDhikr.id, front: 'Alhamdulillah', back: 'All praise is for Allah — said 33 times after salah; part of the four dhikr phrases called "keys to paradise."' },
    { unitId: unitHijrah.id, front: 'Hijrah', back: 'The migration of the Prophet and the Muslims from Makkah to Madinah in 622 CE. Marks the start of the Islamic (Hijri) calendar.' },
    { unitId: unitHijrah.id, front: 'Masjid Quba', back: 'The first mosque built in Islam, founded by the Prophet upon arrival at Quba on the outskirts of Madinah.' },
    { unitId: unitAhzab.id, front: 'Muhajirin', back: 'Muslims who migrated from Makkah to Madinah for the sake of Allah, leaving behind their homes and wealth.' },
    { unitId: unitAhzab.id, front: 'Ansar', back: 'The Muslim helpers of Madinah who welcomed the Muhajirin, shared their homes and wealth, and supported the new Islamic community.' },
    { unitId: unitAhzab.id, front: 'Muakhah', back: 'Islamic brotherhood — the pairing of Muhajirin and Ansar by the Prophet to create bonds of brotherhood based on faith.' },
    { unitId: unitYusuf1.id, front: 'Sabr', back: 'Patience and steadfastness in the face of hardship — a central lesson from the story of Prophet Yusuf, who endured betrayal, slavery, and imprisonment.' },
    { unitId: unitQiyamah.id, front: 'Dajjal', back: 'The False Messiah — a one-eyed imposter who will appear near the end of times, claiming prophethood then claiming to be Allah. The word "Kafir" will be on his forehead.' },
    { unitId: unitQiyamah.id, front: 'Yajuj and Majuj', back: 'Gog and Magog — two destructive groups of people currently held behind a wall, to be released as a major sign of Qiyamah.' },
    { unitId: unitProtection.id, front: 'Surah al-Kahf', back: 'Chapter 18 of the Quran. Reciting it on Fridays is sunnah; memorising its first or last 10 verses protects against the Dajjal.' },
    { unitId: unitTrust.id, front: 'Al-Amin', back: '"The Trustworthy" — the title given to the Prophet Muhammad by the people of Makkah before his prophethood, because of his exceptional honesty.' },
    { unitId: unitNeighbours.id, front: '40 neighbours', back: 'Islamic scholars say that neighbours include 40 houses in every direction — a wide circle of people with rights over you.' },
    { unitId: unitAdab.id, front: 'Istinja', back: 'Cleaning oneself after using the toilet — using water (preferred), or stones/tissue if water is unavailable (minimum three times).' },
    { unitId: unitAdab.id, front: 'Ghufranaka', back: 'The dua said when exiting the toilet — "I seek Your forgiveness, O Allah." Exit with the right foot first.' },
  ];

  // Delete existing flashcards for this course, then recreate
  await prisma.flashCard.deleteMany({ where: { courseId: course.id } });

  for (const f of flashcardData) {
    await prisma.flashCard.create({
      data: {
        front: f.front,
        back: f.back,
        unitId: f.unitId,
        courseId: course.id,
        category: 'Vocabulary',
        tags: ['maktab-4'],
      },
    });
  }

  console.log(`✅ Created ${flashcardData.length} flashcards`);

  // ═════════════════════════════════════════════
  // ARABIC TERMS — ~18 terms for the whole course
  // ═════════════════════════════════════════════

  const arabicTermsData = [
    { unitId: unitMasah.id, term: 'مسح على الخفين', transliteration: 'Masah alal Khuffayn', definition: 'Wiping over leather socks or footwear instead of washing the feet during wudu' },
    { unitId: unitMasah.id, term: 'جبيرة', transliteration: 'Jabirah', definition: 'A wound bandage or cast over which masah may be performed instead of washing' },
    { unitId: unitWajib.id, term: 'واجب', transliteration: 'Wajib', definition: 'An obligatory act that ranks below fard; its intentional omission invalidates salah' },
    { unitId: unitWajib.id, term: 'سجدة السهو', transliteration: 'Sajdah as-Sahw', definition: 'Prostration of forgetfulness — two sujuds at the end of salah to compensate for a forgotten wajib act' },
    { unitId: unitSawm.id, term: 'صوم', transliteration: 'Sawm', definition: 'Fasting — abstaining from food, drink, and other specified acts from Fajr to Maghrib with the intention of worship' },
    { unitId: unitSawm.id, term: 'كفارة', transliteration: 'Kaffarah', definition: 'Expiation for intentionally breaking a Ramadan fast: 60 consecutive fasts or feeding 60 poor people' },
    { unitId: unitSawm.id, term: 'فدية', transliteration: 'Fidyah', definition: 'Monetary compensation paid by those permanently unable to fast, equal to feeding one poor person per missed day' },
    { unitId: unitSawm.id, term: 'تراويح', transliteration: 'Tarawih', definition: 'The special 20-rakah night prayer performed after Isha throughout Ramadan; sunnah muakkadah' },
    { unitId: unitCharity.id, term: 'أخلاق', transliteration: 'Akhlaq', definition: 'Character and moral conduct; the Prophet said the best of people are those with the best akhlaq' },
    { unitId: unitDhikr.id, term: 'أمانة', transliteration: 'Amanah', definition: 'Trustworthiness — fulfilling responsibilities, keeping secrets, and returning belongings honestly' },
    { unitId: unitDhikr.id, term: 'ذكر', transliteration: 'Dhikr', definition: 'Remembrance of Allah — phrases like SubhanAllah, Alhamdulillah, Allahu Akbar recited throughout the day' },
    { unitId: unitHijrah.id, term: 'هجرة', transliteration: 'Hijrah', definition: 'Migration — specifically the Prophet\'s migration from Makkah to Madinah in 622 CE, marking year 1 AH' },
    { unitId: unitAhzab.id, term: 'المهاجرون', transliteration: 'Al-Muhajirin', definition: 'The Migrants — Muslims who emigrated from Makkah to Madinah for the sake of Allah' },
    { unitId: unitAhzab.id, term: 'الأنصار', transliteration: 'Al-Ansar', definition: 'The Helpers — Muslims of Madinah who welcomed the Muhajirin and shared everything with them' },
    { unitId: unitAhzab.id, term: 'مؤاخاة', transliteration: 'Muakhah', definition: 'Brotherhood — the pairing of Muhajirin with Ansar to create bonds based on faith rather than tribe' },
    { unitId: unitQiyamah.id, term: 'الدجال', transliteration: 'Ad-Dajjal', definition: 'The False Messiah — one-eyed, claims prophethood then divinity; the word Kafir is written on his forehead' },
    { unitId: unitQiyamah.id, term: 'يأجوج ومأجوج', transliteration: 'Yajuj wa Majuj', definition: 'Gog and Magog — two destructive peoples held behind a wall, to be released as a major sign of Qiyamah' },
    { unitId: unitNeighbours.id, term: 'جار', transliteration: 'Jar', definition: 'Neighbour — includes up to 40 houses in each direction; has important rights in Islamic law and ethics' },
  ];

  // Delete existing arabicTerms per unit, then recreate
  const uniqueUnitIds = [...new Set(arabicTermsData.map(t => t.unitId))];
  for (const unitId of uniqueUnitIds) {
    await prisma.arabicTerm.deleteMany({ where: { unitId } });
  }

  for (const t of arabicTermsData) {
    await prisma.arabicTerm.create({
      data: {
        arabicText: t.term,
        transliteration: t.transliteration,
        translation: t.definition,
        unitId: t.unitId,
      },
    });
  }

  console.log(`✅ Created ${arabicTermsData.length} Arabic terms`);

  // ═════════════════════════════════════════════
  // SUMMARY
  // ═════════════════════════════════════════════

  console.log('');
  console.log('🎉 Maktab Coursebook 4 seed complete!');
  console.log('   Units: 14 focused units');
  console.log(`   Quiz questions: ${quizData.length}`);
  console.log(`   Flashcards: ${flashcardData.length}`);
  console.log(`   Arabic terms: ${arabicTermsData.length}`);
}

async function main() {
  try {
    await seedMaktabCoursebook4();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Maktab Coursebook 4:', error);
    throw error;
  }
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
