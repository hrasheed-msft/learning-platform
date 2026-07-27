import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 6 (Girls) — Islamic Curriculum Seed (Restructured)
 * Source: An Nasihah Publications, Age Range: 11–12 years
 *
 * 13 focused units — each covering exactly ONE main topic.
 * Subjects: Fiqh (3), Ahadith (2), Sirah (2), Tarikh (2),
 *           Aqaid (2), Akhlaq (1), Adab (1)
 * Girls' edition: Fiqh includes hayd/ghusl; Adab includes hijab/modesty.
 */

export async function seedMaktabCoursebook6Girls() {
  console.log('📚 Starting Maktab Coursebook 6 (Girls) seed...');
  console.log('');

  const demoFamily = await prisma.family.findFirst({
    where: { name: 'Ahmad Family' },
  });

  if (!demoFamily) {
    console.log('⚠️  Demo family not found. Please run main seed first.');
    return;
  }

  console.log('✅ Found demo family:', demoFamily.name);

  // ──────────────────────────────────────────────
  // COURSE
  // ──────────────────────────────────────────────

  const course = await prisma.course.upsert({
    where: { slug: 'maktab-coursebook-6-girls' },
    create: {
      slug: 'maktab-coursebook-6-girls',
      title: 'Maktab Coursebook 6 (Girls)',
      description: 'An advanced Islamic curriculum for girls aged 11-12 years. Covers fiqh (water categories, najasah, maturity, hayd, ghusl, wajib acts of salah, janazah salah), fifteen selected ahadith on worship and social ethics, sirah (shamail of the Prophet and the life of Abu Bakr al-Siddiq), tarikh (Dawud, Sulayman, Yunus, and the Umayyad dynasty), aqaid (Ahlus Sunnah beliefs, prophethood, miracles, and al-Isra wal-Miraj), akhlaq (zulm, hasad, ghibah, kibr), and adab (hijab, modesty, adhan etiquette). Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['PRE_TEEN', 'TEEN'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 6 (Girls)',
      description: 'An advanced Islamic curriculum for girls aged 11-12 years. Covers fiqh (water categories, najasah, maturity, hayd, ghusl, wajib acts of salah, janazah salah), fifteen selected ahadith on worship and social ethics, sirah (shamail of the Prophet and the life of Abu Bakr al-Siddiq), tarikh (Dawud, Sulayman, Yunus, and the Umayyad dynasty), aqaid (Ahlus Sunnah beliefs, prophethood, miracles, and al-Isra wal-Miraj), akhlaq (zulm, hasad, ghibah, kibr), and adab (hijab, modesty, adhan etiquette). Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['PRE_TEEN', 'TEEN'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // CLEANUP: Remove deprecated broad-subject units
  // ──────────────────────────────────────────────
  const oldSlugs = [
    'maktab-6g-fiqh',
    'maktab-6g-ahadith',
    'maktab-6g-sirah',
    'maktab-6g-tarikh',
    'maktab-6g-aqaid',
    'maktab-6g-akhlaq',
    'maktab-6g-adab',
  ];
  for (const slug of oldSlugs) {
    const old = await prisma.unit.findFirst({ where: { courseId: course.id, slug } });
    if (old) {
      await prisma.question.deleteMany({ where: { unitId: old.id } });
      await prisma.unitProgress.deleteMany({ where: { unitId: old.id } });
      await prisma.unit.delete({ where: { id: old.id } });
    }
  }

  const unit1Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to classify water into its
three Shari categories, distinguish between najasah ghalizah and khafifah,
and apply the correct purification method for each.</p>

<h2>Categories of Water</h2>
<p>Islamic law divides water into three categories:</p>
<ol>
  <li><strong>Tahir Mutahhir (Pure and Purifying):</strong> Natural water —
  rain, river, well, sea. This is the <em>only</em> water valid for wudu and ghusl.</li>
  <li><strong>Tahir (Pure but Non-Purifying):</strong> Pure to drink/cook but
  cannot remove ritual impurity. Examples: fruit juice, used wudu water.</li>
  <li><strong>Najis (Impure):</strong> Contaminated with filth. Cannot be used
  for purification or drinking.</li>
</ol>

<h2>Categories of Najasah</h2>
<p><strong>Najasah Ghalizah (Heavy Impurity):</strong> Human urine, stool,
flowing blood, wine, pork. Must be washed until completely removed; no
excused amount on clothing for salah.</p>
<p><strong>Najasah Khafifah (Light Impurity):</strong> Urine of permissible
animals (e.g. horse). Excused if less than one quarter of the garment is
affected — salah is still valid.</p>

<h2>Purification of Clothing</h2>
<ul>
  <li>For ghalizah: wash at least three times, wringing after each wash,
  until the impurity is completely removed.</li>
  <li>For khafifah affecting more than a quarter: wash it away; if less than
  a quarter, salah remains valid without washing.</li>
</ul>

<h2>Key Rule: Water for Wudu</h2>
<p>Only <strong>Tahir Mutahhir</strong> water is valid for wudu and ghusl.
If you are unsure whether water is pure, look for changes in colour, smell,
or taste caused by impurity.</p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 1
  // ──────────────────────────────────────────────
  const unit1 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-fiqh-water-impurities' } },
    create: {
      slug: 'maktab-6g-fiqh-water-impurities',
      courseId: course.id,
      title: `Fiqh — Water, Impurities & Najasah`,
      description: `Categories of water (tahir mutahhir, tahir, najis), najasah ghalizah and khafifah, purification of clothing, and which water is valid for wudu and ghusl.`,
      orderIndex: 1,
      content: unit1Content,
    },
    update: {
      title: `Fiqh — Water, Impurities & Najasah`,
      description: `Categories of water (tahir mutahhir, tahir, najis), najasah ghalizah and khafifah, purification of clothing, and which water is valid for wudu and ghusl.`,
      orderIndex: 1,
      content: unit1Content,
    },
  });
  console.log('✅ Unit 1:', unit1.title);

  const unit2Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to identify the signs of
maturity (bulugh) for girls, describe the rules of hayd, list what is
prohibited during hayd, and perform ghusl correctly knowing its three
faraid.</p>

<h2>Signs of Maturity (Bulugh) for Girls</h2>
<p>A girl reaches Islamic maturity when <em>any one</em> of the following occurs:</p>
<ol>
  <li><strong>Hayd (Menstruation):</strong> The first menstrual period marks the
  beginning of maturity.</li>
  <li><strong>Pubic Hair:</strong> Appearance of coarse pubic hair.</li>
  <li><strong>Age 15 Lunar Years:</strong> If none of the above has occurred,
  maturity is established at 15 lunar years.</li>
</ol>

<h2>Hayd (Menstruation) — Basic Rules</h2>
<p><strong>Minimum duration:</strong> 3 days (72 hours)</p>
<p><strong>Maximum duration:</strong> 10 days</p>
<p>Bleeding lasting less than 3 days or more than 10 days has different
rulings (istihada — irregular bleeding).</p>

<h3>What is Prohibited During Hayd</h3>
<ul>
  <li>Performing salah (no makeup required after)</li>
  <li>Fasting (must be made up afterwards)</li>
  <li>Reciting the Quran aloud (with intention of tilawah)</li>
  <li>Touching the Quran</li>
  <li>Entering the masjid</li>
  <li>Marital intimacy</li>
</ul>

<h2>Obligations at Maturity</h2>
<p>Once bulugh is reached, a girl becomes fully accountable (mukallafah).
She must: perform the 5 daily prayers, fast in Ramadan, give zakah if she
owns the nisab, and perform hajj if able. All deeds — good and bad — are
now recorded.</p>

<h2>The Three Faraid of Ghusl</h2>
<ol>
  <li><strong>Madmadah (Gargling):</strong> Rinse the entire mouth including
  between the teeth.</li>
  <li><strong>Istinshaq (Nasal Rinse):</strong> Sniff water into the nostrils
  and blow out, cleaning the inner nose.</li>
  <li><strong>Full Body Wash:</strong> Water must reach every part of the body
  including the roots of the hair.</li>
</ol>
<p>Ghusl is obligatory (fard) when hayd ends. A woman may not pray or fast
until she performs ghusl.</p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 2
  // ──────────────────────────────────────────────
  const unit2 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-fiqh-maturity-ghusl' } },
    create: {
      slug: 'maktab-6g-fiqh-maturity-ghusl',
      courseId: course.id,
      title: `Fiqh — Maturity & Ghusl for Girls`,
      description: `Signs of bulugh for girls, rules of hayd (minimum 3 days, maximum 10 days), what is prohibited during hayd, obligations at maturity, and the three faraid of ghusl.`,
      orderIndex: 2,
      content: unit2Content,
    },
    update: {
      title: `Fiqh — Maturity & Ghusl for Girls`,
      description: `Signs of bulugh for girls, rules of hayd (minimum 3 days, maximum 10 days), what is prohibited during hayd, obligations at maturity, and the three faraid of ghusl.`,
      orderIndex: 2,
      content: unit2Content,
    },
  });
  console.log('✅ Unit 2:', unit2.title);

  const unit3Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to list the wajib acts of
salah, explain sajdah as-sahw, and describe the method of janazah salah
including its four takbirs.</p>

<h2>Wajib Acts of Salah</h2>
<p>Wajib acts are obligatory but below the level of fard. Omitting one
<em>intentionally</em> makes the salah invalid and it must be repeated.
Omitting one <em>forgetfully</em> requires sajdah as-sahw at the end.</p>
<p>The main wajibat of salah include:</p>
<ul>
  <li>Opening takbir being said aloud (by the imam in congregation)</li>
  <li>Reciting Surah al-Fatiha in every rakah</li>
  <li>Joining a surah or three verses after al-Fatiha in the first two rakahs</li>
  <li>Performing all four rakahs in four-rakah prayers (or two in two-rakah)</li>
  <li>Qawmah (standing straight after ruku)</li>
  <li>Jalsah (sitting between the two sajdahs)</li>
  <li>The final qa'dah (sitting for tashahhud at the end)</li>
  <li>Reciting tashahhud in the final qa'dah</li>
  <li>Ending with salam</li>
</ul>

<h2>Sajdah as-Sahw (Prostration of Forgetfulness)</h2>
<p>If a wajib act is omitted <strong>forgetfully</strong>, the prayer is
not immediately invalid. Instead, two extra sajdahs are performed at the
end of the salah after the final tashahhud and before the closing salam.
This compensates for the omission and completes the salah.</p>

<h2>Janazah Salah</h2>
<p>Janazah (funeral) prayer is fard kifayah — obligatory on the community.
If some perform it, the obligation is lifted from all.</p>
<h3>Method</h3>
<ol>
  <li><strong>1st Takbir:</strong> Make intention, say Allahu Akbar, then
  recite Thana (subhanakallahumma...)</li>
  <li><strong>2nd Takbir:</strong> Allahu Akbar, then recite Salawat
  (Allahumma salli 'ala Muhammad...)</li>
  <li><strong>3rd Takbir:</strong> Allahu Akbar, then recite du'a for the
  deceased</li>
  <li><strong>4th Takbir:</strong> Allahu Akbar, then end with salam on
  both sides</li>
</ol>
<p><strong>Note:</strong> There is no ruku or sajdah in janazah salah.</p>
<p>Women may participate in janazah salah and stand in their own rows
behind the men.</p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 3
  // ──────────────────────────────────────────────
  const unit3 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-fiqh-wajib-janazah' } },
    create: {
      slug: 'maktab-6g-fiqh-wajib-janazah',
      courseId: course.id,
      title: `Fiqh — Wajib Acts of Salah & Janazah`,
      description: `Wajib acts of salah, the ruling when a wajib is omitted intentionally vs forgetfully (sajdah as-sahw), and the method of janazah salah with its four takbirs.`,
      orderIndex: 3,
      content: unit3Content,
    },
    update: {
      title: `Fiqh — Wajib Acts of Salah & Janazah`,
      description: `Wajib acts of salah, the ruling when a wajib is omitted intentionally vs forgetfully (sajdah as-sahw), and the method of janazah salah with its four takbirs.`,
      orderIndex: 3,
      content: unit3Content,
    },
  });
  console.log('✅ Unit 3:', unit3.title);

  const unit4Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to recite and explain
eight selected ahadith covering niyyah, definition of Islam, good speech,
charity, removing harm, envy, rights of Muslims, and women's prayer.</p>

<h2>Hadith 1 — Actions by Intentions</h2>
<p><em>Innamal a'malu bin-niyyat, wa innama likulli imri'in ma nawa...</em></p>
<p>Actions are judged by intentions. Everyone receives only what they
intended. (Bukhari &amp; Muslim) — This is one of the most foundational
ahadith in Islamic law.</p>

<h2>Hadith 2 — Islam Defined</h2>
<p>Islam is what you testify with your tongue, believe with your heart, and
demonstrate through your limbs (actions).</p>

<h2>Hadith 3 — Speak Good or Be Silent</h2>
<p>The Prophet (peace be upon him) said: Whoever believes in Allah and the
Last Day, let him speak good or remain silent. (Bukhari &amp; Muslim)</p>

<h2>Hadith 4 — Smiling is Charity</h2>
<p>Smiling at your brother (or sister) is sadaqah (charity). Removing harm
from the road is also sadaqah. (Tirmidhi)</p>

<h2>Hadith 5 — Removing Harm from the Road</h2>
<p>Removing something harmful from the path is a branch of iman (faith).
(Muslim) — Even small acts of service to others earn spiritual reward.</p>

<h2>Hadith 6 — Do Not Envy</h2>
<p>Do not envy one another, do not hate one another, do not spy on one
another, and be servants of Allah as brothers (and sisters). (Bukhari)</p>

<h2>Hadith 7 — Six Rights of a Muslim</h2>
<p>A Muslim has six rights over another Muslim: (1) return the salam,
(2) visit when sick, (3) attend the janazah, (4) accept the invitation,
(5) say yarhamukallah when they sneeze, (6) give sincere advice. (Muslim)</p>

<h2>Hadith 8 — Women's Prayer at Home</h2>
<p>The Prophet (peace be upon him) said: A woman's prayer in her inner
room is better than her prayer in her house, and her prayer in her house
is better than her prayer in the masjid. (Abu Dawud)</p>
<p><em>Note:</em> This hadith shows the high value of a woman's prayer at
home, but women are not prohibited from attending the masjid.</p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 4
  // ──────────────────────────────────────────────
  const unit4 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-ahadith-worship-character' } },
    create: {
      slug: 'maktab-6g-ahadith-worship-character',
      courseId: course.id,
      title: `Ahadith — Fifteen Traditions (Part 1: Worship & Character)`,
      description: `Selected ahadith 1-8 covering: actions by intentions, definition of Islam, good speech, smiling as charity, removing harm, avoiding envy, six rights of a Muslim, and women's prayer.`,
      orderIndex: 4,
      content: unit4Content,
    },
    update: {
      title: `Ahadith — Fifteen Traditions (Part 1: Worship & Character)`,
      description: `Selected ahadith 1-8 covering: actions by intentions, definition of Islam, good speech, smiling as charity, removing harm, avoiding envy, six rights of a Muslim, and women's prayer.`,
      orderIndex: 4,
      content: unit4Content,
    },
  });
  console.log('✅ Unit 4:', unit4.title);

  const unit5Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to recite and explain
seven selected ahadith covering kindness to parents, seeking knowledge,
feeding others, salam, visiting the sick, good neighbourliness, and
truthfulness.</p>

<h2>Hadith 9 — Kindness to Parents</h2>
<p>A man asked the Prophet (peace be upon him): 'Who is most deserving of
my good company?' He replied: 'Your mother.' The man asked three times and
three times the answer was 'Your mother.' On the fourth time the answer was
'Your father.' (Bukhari &amp; Muslim)</p>

<h2>Hadith 10 — Seeking Knowledge is Obligatory</h2>
<p>Seeking knowledge is an obligation upon every Muslim — male and female.
(Ibn Majah) — No one is excused from learning the basics of the deen.</p>

<h2>Hadith 11 — Feeding Others</h2>
<p>The Prophet (peace be upon him) said: Feed others, spread salam, and
pray at night while people sleep — you will enter Jannah in peace. (Tirmidhi)</p>

<h2>Hadith 12 — Spread Salam</h2>
<p>You will not enter Jannah until you believe, and you will not believe
until you love one another. Shall I tell you of something that, if you do
it, you will love each other? Spread salam amongst yourselves. (Muslim)</p>

<h2>Hadith 13 — Visiting the Sick</h2>
<p>Whoever visits a sick person continues to be in the garden of Jannah
until they return. (Muslim) — Visiting the sick is one of the six rights
of a Muslim upon another.</p>

<h2>Hadith 14 — Good to Neighbours</h2>
<p>Jibreel kept advising me about the neighbour until I thought he would
make the neighbour an heir. (Bukhari &amp; Muslim) — This shows the
extreme importance of treating neighbours well in Islam.</p>

<h2>Hadith 15 — Truthfulness Leads to Jannah</h2>
<p>Hold fast to truthfulness. Truthfulness leads to righteousness (birr)
and righteousness leads to Jannah. A person continues to be truthful and
seeks truth until they are recorded with Allah as truthful (siddiq).
(Bukhari &amp; Muslim)</p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 5
  // ──────────────────────────────────────────────
  const unit5 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-ahadith-social-ethics' } },
    create: {
      slug: 'maktab-6g-ahadith-social-ethics',
      courseId: course.id,
      title: `Ahadith — Fifteen Traditions (Part 2: Social Ethics)`,
      description: `Selected ahadith 9-15 covering: kindness to parents (mother first), seeking knowledge, feeding others, spreading salam, visiting the sick, good neighbourliness, and truthfulness leading to Jannah.`,
      orderIndex: 5,
      content: unit5Content,
    },
    update: {
      title: `Ahadith — Fifteen Traditions (Part 2: Social Ethics)`,
      description: `Selected ahadith 9-15 covering: kindness to parents (mother first), seeking knowledge, feeding others, spreading salam, visiting the sick, good neighbourliness, and truthfulness leading to Jannah.`,
      orderIndex: 5,
      content: unit5Content,
    },
  });
  console.log('✅ Unit 5:', unit5.title);

  const unit6Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to describe the physical
features and noble character of the Prophet (peace be upon him), and
explain how he treated his family and those around him.</p>

<h2>What Are Shamail?</h2>
<p>Shamail refers to the noble physical characteristics and moral qualities
of the Prophet (peace be upon him). Scholars of hadith collected these
descriptions to help Muslims know and love the Prophet more deeply.</p>

<h2>Physical Description</h2>
<ul>
  <li><strong>Height:</strong> Medium — neither tall nor short</li>
  <li><strong>Complexion:</strong> Light brownish (azhar) — clear and luminous</li>
  <li><strong>Face:</strong> Round and bright, like the full moon</li>
  <li><strong>Hair:</strong> Reached his shoulders, neither straight nor very
  curly — slightly wavy</li>
  <li><strong>Eyes:</strong> Large, dark, with naturally long lashes</li>
  <li><strong>Seal of Prophethood:</strong> A mark between his shoulders</li>
</ul>

<h2>Noble Character</h2>
<ul>
  <li><strong>Gentleness:</strong> He was the gentlest of people — he never
  struck anyone with his hand</li>
  <li><strong>Forbearance:</strong> He forgave those who wronged him</li>
  <li><strong>Generosity:</strong> He never refused a request if he was able
  to fulfill it</li>
  <li><strong>Modesty:</strong> More modest than a young girl in her seclusion</li>
</ul>

<h2>Treatment of His Family and Women</h2>
<p>The Prophet (peace be upon him) said: <em>The best of you is the best to
his family, and I am the best of you to my family.</em> (Tirmidhi)</p>
<p>He also said: <em>Be good to women, for they were created from a rib.
Treat them well.</em> (Bukhari)</p>
<p>He helped with household chores, consulted his wives, and showed
immense kindness to children — he would carry children on his shoulders
and joke with them gently.</p>

<h2>Treatment of Servants</h2>
<p>He instructed Muslims: <em>Feed them what you eat, clothe them with
what you wear, and do not burden them with more than they can bear.</em>
(Bukhari)</p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 6
  // ──────────────────────────────────────────────
  const unit6 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-sirah-shamail' } },
    create: {
      slug: 'maktab-6g-sirah-shamail',
      courseId: course.id,
      title: `Sirah — Shamail of Rasulullah`,
      description: `Physical description and noble character of the Prophet (peace be upon him), including his treatment of his family, wives, children, and servants.`,
      orderIndex: 6,
      content: unit6Content,
    },
    update: {
      title: `Sirah — Shamail of Rasulullah`,
      description: `Physical description and noble character of the Prophet (peace be upon him), including his treatment of his family, wives, children, and servants.`,
      orderIndex: 6,
      content: unit6Content,
    },
  });
  console.log('✅ Unit 6:', unit6.title);

  const unit7Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to explain why Abu Bakr
was called al-Siddiq, describe his key services to Islam, and summarise
the achievements of his caliphate.</p>

<h2>Abu Bakr al-Siddiq (may Allah be pleased with him)</h2>
<p>Abu Bakr ibn Abi Quhafah was the closest companion and father-in-law
of the Prophet (peace be upon him). He was among the first to accept
Islam — the first adult free male Muslim.</p>

<h2>The Title: al-Siddiq</h2>
<p>When the Prophet (peace be upon him) described the miraculous night
journey (al-Isra wal-Miraj) to the people of Makkah, many disbelieved.
Abu Bakr immediately and completely believed it, saying:</p>
<blockquote>If he said it, it is true.</blockquote>
<p>For this, the Prophet (peace be upon him) gave him the title
<strong>al-Siddiq</strong> — the one who confirms the truth completely.</p>

<h2>Key Services to Islam</h2>
<ul>
  <li>Freed several early Muslim slaves who were being tortured, including
  Bilal ibn Rabah</li>
  <li>Used his entire wealth for the cause of Islam</li>
  <li>Accompanied the Prophet (peace be upon him) in the Cave of Thawr
  during the Hijrah</li>
  <li>Led the prayers when the Prophet (peace be upon him) was ill</li>
  <li>Gave his daughter Aisha in marriage to the Prophet (peace be upon him)</li>
</ul>

<h2>The Caliphate of Abu Bakr</h2>
<p>Abu Bakr became the first Caliph after the Prophet (peace be upon him)
passed away. His caliphate lasted approximately two years (632-634 CE).</p>
<h3>Major Achievements</h3>
<ul>
  <li><strong>Riddah Wars:</strong> Decisively fought those who refused to
  pay zakah or left Islam after the Prophet's death — preserving the
  unity of the Muslim community</li>
  <li><strong>Quran Compilation:</strong> Instructed Zayd ibn Thabit to
  compile the Quran into a single book — after many huffadh were
  martyred at the Battle of Yamama</li>
  <li><strong>Military Expansion:</strong> Began the successful campaigns
  into Iraq and Syria</li>
</ul>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 7
  // ──────────────────────────────────────────────
  const unit7 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-sirah-abu-bakr' } },
    create: {
      slug: 'maktab-6g-sirah-abu-bakr',
      courseId: course.id,
      title: `Sirah — Abu Bakr al-Siddiq`,
      description: `Life of Abu Bakr al-Siddiq: first adult male Muslim, the title al-Siddiq, key services to Islam, and the achievements of his caliphate (Quran compilation, riddah wars, expansion).`,
      orderIndex: 7,
      content: unit7Content,
    },
    update: {
      title: `Sirah — Abu Bakr al-Siddiq`,
      description: `Life of Abu Bakr al-Siddiq: first adult male Muslim, the title al-Siddiq, key services to Islam, and the achievements of his caliphate (Quran compilation, riddah wars, expansion).`,
      orderIndex: 7,
      content: unit7Content,
    },
  });
  console.log('✅ Unit 7:', unit7.title);

  const unit8Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to describe the prophethood
of Dawud and Sulayman (peace be upon them), list their miracles, and
explain how Queen Bilqis accepted Islam.</p>

<h2>Prophet Dawud (peace be upon him)</h2>
<p>Dawud (David) was a prophet and king of the Children of Israel. Allahgave
him the <strong>Zabur (Psalms)</strong> — one of the four great heavenly
books. He had a beautiful voice and the mountains and birds would join
him in praise (tasbeeh) of Allah.</p>

<h3>The Miracle of Iron</h3>
<p>Allah made iron soft for Dawud — he could mold it with his bare hands
without fire. With this ability, he crafted coats of chain mail (armour),
bringing benefit to his army and people.</p>

<h3>Dawud and Jalut (Goliath)</h3>
<p>As a young man, before his prophethood, Dawud killed the Philistine
giant Jalut (Goliath) with a sling and stone. This victory gave
the Children of Israel triumph over their oppressors.</p>

<h2>Prophet Sulayman (peace be upon him)</h2>
<p>Sulayman (Solomon) was the son of Dawud and also a prophet-king. Allah
granted him a kingdom unlike any other:</p>
<ul>
  <li><strong>Command over jinn:</strong> He could direct jinn to build
  great structures</li>
  <li><strong>Command over wind:</strong> The wind was subjected to him,
  carrying his throne over vast distances</li>
  <li><strong>Language of birds:</strong> He could understand and communicate
  with birds (Quran 27:16)</li>
  <li><strong>Understanding animals:</strong> He heard the ant warn its
  people — Surah al-Naml (Chapter 27)</li>
</ul>

<h3>Queen Bilqis Accepts Islam</h3>
<p>The hoopoe (hudhud) bird brought Sulayman news of the Queen of Sheba
(Bilqis) and her people who worshipped the sun. Sulayman sent her a letter
beginning with Bismillah, inviting her to Islam. After visiting his court
and witnessing his miraculous throne (brought in an instant), she
declared: <em>I submit with Sulayman to Allah, Lord of the worlds.</em></p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 8
  // ──────────────────────────────────────────────
  const unit8 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-tarikh-dawud-sulayman' } },
    create: {
      slug: 'maktab-6g-tarikh-dawud-sulayman',
      courseId: course.id,
      title: `Tarikh — Prophets Dawud & Sulayman`,
      description: `Prophethood of Dawud (Zabur, iron miracle, Jalut) and Sulayman (control over jinn/wind/birds, Queen Bilqis accepting Islam).`,
      orderIndex: 8,
      content: unit8Content,
    },
    update: {
      title: `Tarikh — Prophets Dawud & Sulayman`,
      description: `Prophethood of Dawud (Zabur, iron miracle, Jalut) and Sulayman (control over jinn/wind/birds, Queen Bilqis accepting Islam).`,
      orderIndex: 8,
      content: unit8Content,
    },
  });
  console.log('✅ Unit 8:', unit8.title);

  const unit9Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to narrate the story of
Prophet Yunus, recite his du'a from the whale, and give an overview of
the Umayyad dynasty.</p>

<h2>Prophet Yunus (Jonah) — peace be upon him</h2>
<p>Yunus was sent to the people of Nineveh (in modern Iraq). When they
refused to heed his call, he left without Allah's direct command. As a
consequence, he was swallowed by a great whale.</p>

<h3>The Du'a in the Whale</h3>
<p>In the darkness of the ocean, inside the whale, Yunus called out:</p>
<blockquote>
  La ilaha illa anta subhanaka inni kuntu min al-zalimin.
  (There is no god but You; glory be to You; indeed I have been of the
  wrongdoers.)
</blockquote>
<p>Allah accepted his du'a, commanded the whale to release him, and
caused a gourd plant to grow over him to shade and heal him.</p>

<h3>The People of Nineveh Repent</h3>
<p>Unlike any other community, the entire people of Nineveh repented and
accepted faith — and Allah accepted their repentance. Yunus returned to
guide them.</p>

<h2>The Umayyad Dynasty</h2>
<p>The Umayyad dynasty was the first hereditary caliphate in Islamic history,
established by Muawiyah ibn Abi Sufyan in 661 CE.</p>

<h3>Key Facts</h3>
<ul>
  <li><strong>Capital:</strong> Damascus (Syria)</li>
  <li><strong>Founder:</strong> Muawiyah ibn Abi Sufyan</li>
  <li><strong>Duration:</strong> 661–750 CE</li>
  <li><strong>Greatest Expansion:</strong> Under Walid ibn Abd al-Malik —
  Muslims reached al-Andalus (Spain/Portugal), Central Asia, and
  northwestern India</li>
  <li><strong>Architecture:</strong> Abd al-Malik built the Dome of the Rock
  in Jerusalem; Walid expanded Masjid al-Nabawi and built the Umayyad
  Mosque in Damascus</li>
</ul>

<p>The Umayyad period saw rapid expansion of the Muslim world, bringing
Islam to new continents and peoples.</p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 9
  // ──────────────────────────────────────────────
  const unit9 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-tarikh-yunus-umayyads' } },
    create: {
      slug: 'maktab-6g-tarikh-yunus-umayyads',
      courseId: course.id,
      title: `Tarikh — Prophet Yunus & The Umayyad Dynasty`,
      description: `Story of Prophet Yunus (whale, du'a, people of Nineveh), and an overview of the Umayyad dynasty (Muawiyah, capital Damascus, expansion to al-Andalus).`,
      orderIndex: 9,
      content: unit9Content,
    },
    update: {
      title: `Tarikh — Prophet Yunus & The Umayyad Dynasty`,
      description: `Story of Prophet Yunus (whale, du'a, people of Nineveh), and an overview of the Umayyad dynasty (Muawiyah, capital Damascus, expansion to al-Andalus).`,
      orderIndex: 9,
      content: unit9Content,
    },
  });
  console.log('✅ Unit 9:', unit9.title);

  const unit10Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to define Ahlus Sunnah
wal-Jamaah, explain what they follow, list key beliefs, and understand
their stance on the Sahabah and bid'ah.</p>

<h2>Who Are Ahlus Sunnah Wal-Jamaah?</h2>
<p>Ahlus Sunnah wal-Jamaah means <em>the people of the Sunnah and the
united community.</em> They are the mainstream majority of Muslims who
follow:</p>
<ol>
  <li>The Quran</li>
  <li>The Sunnah of the Prophet (peace be upon him)</li>
  <li>The way of the Sahabah (companions)</li>
</ol>

<h2>Key Beliefs of Ahlus Sunnah</h2>
<ul>
  <li>All six pillars of iman: belief in Allah, angels, books, prophets,
  the Last Day, and al-Qadr</li>
  <li>All prophets are truthful and were protected from major sin</li>
  <li>The Quran is the unchanged word of Allah</li>
  <li>The companions (Sahabah) are all respected and honoured — none are
  to be insulted or attacked</li>
  <li>Differences among the Sahabah were scholarly differences that should
  not be used against them</li>
</ul>

<h2>Respecting All the Sahabah</h2>
<p>Ahlus Sunnah hold that all Sahabah were people of great virtue who
sacrificed for Islam. Disagreements among them (like those during the era
of Uthman and Ali) were matters of ijtihad (scholarly reasoning) — not
matters for criticism or blame.</p>

<h2>Avoiding Bid'ah</h2>
<p>Bid'ah means introducing into the religion something that was not
sanctioned by Allah or His Prophet (peace be upon him). Ahlus Sunnah
firmly avoid bid'ah, following the Prophet's warning:</p>
<blockquote>Every bid'ah is misguidance, and every misguidance leads to
the Fire. (Muslim)</blockquote>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 10
  // ──────────────────────────────────────────────
  const unit10 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-aqaid-ahlus-sunnah' } },
    create: {
      slug: 'maktab-6g-aqaid-ahlus-sunnah',
      courseId: course.id,
      title: `Aqaid — Ahlus Sunnah & Core Beliefs`,
      description: `Definition of Ahlus Sunnah wal-Jamaah, what they follow (Quran, Sunnah, way of Sahabah), key beliefs, respecting all Sahabah, and avoiding bid'ah.`,
      orderIndex: 10,
      content: unit10Content,
    },
    update: {
      title: `Aqaid — Ahlus Sunnah & Core Beliefs`,
      description: `Definition of Ahlus Sunnah wal-Jamaah, what they follow (Quran, Sunnah, way of Sahabah), key beliefs, respecting all Sahabah, and avoiding bid'ah.`,
      orderIndex: 10,
      content: unit10Content,
    },
  });
  console.log('✅ Unit 10:', unit10.title);

  const unit11Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to list the five qualities
of prophets, distinguish between mu'jizah and karamah, and describe the
events of al-Isra wal-Miraj.</p>

<h2>Five Qualities of Prophets</h2>
<p>Every prophet of Allah possesses five essential qualities:</p>
<ol>
  <li><strong>Sidq (Truthfulness):</strong> They are truthful in all matters.</li>
  <li><strong>Amanah (Trustworthiness):</strong> They are completely trustworthy.</li>
  <li><strong>Tabligh (Conveying the message):</strong> They fully conveyed
  Allah's message to their people.</li>
  <li><strong>Fatanah (Intelligence):</strong> They possess exceptional wisdom
  and intellect.</li>
  <li><strong>Ismah (Protection from sin):</strong> They are protected from
  major sin.</li>
</ol>

<h2>Mu'jizah vs Karamah</h2>
<p><strong>Mu'jizah:</strong> A miracle given specifically to a prophet by
Allah as proof of their prophethood. It challenges opponents and cannot
be replicated by humans. Examples: Musa's staff, Isa healing the blind.</p>
<p><strong>Karamah:</strong> An extraordinary occurrence granted to a
righteous person (wali) — not as proof of prophethood but as Allah's
honour to them. Karamas are possible after prophethood ended.</p>

<h2>Al-Isra (The Night Journey)</h2>
<p>In approximately the 10th year of prophethood, Allah took the Prophet
(peace be upon him) on a miraculous night journey:</p>
<ul>
  <li><strong>Al-Isra:</strong> From Masjid al-Haram (Makkah) to Masjid
  al-Aqsa (Jerusalem) — riding al-Buraq</li>
  <li>He led all the prophets in prayer at Masjid al-Aqsa</li>
</ul>

<h2>Al-Miraj (The Ascent)</h2>
<p>From al-Aqsa, the Prophet (peace be upon him) ascended through the
seven heavens, meeting a different prophet in each:</p>
<ul>
  <li>1st heaven: Adam (peace be upon him)</li>
  <li>2nd heaven: Yahya and Isa (peace be upon them)</li>
  <li>3rd heaven: Yusuf (peace be upon him)</li>
  <li>4th heaven: Idris (peace be upon him)</li>
  <li>5th heaven: Harun (peace be upon him)</li>
  <li>6th heaven: Musa (peace be upon him)</li>
  <li>7th heaven: Ibrahim (peace be upon him)</li>
</ul>

<h3>The Gift of Five Prayers</h3>
<p>The Prophet (peace be upon him) ascended to Sidrat al-Muntaha and was
given the command of 50 daily prayers. On the advice of Musa, he returned
to Allah repeatedly until the prayers were reduced to <strong>5</strong>,
while the reward of 50 was retained.</p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 11
  // ──────────────────────────────────────────────
  const unit11 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-aqaid-nubuwwah-miraj' } },
    create: {
      slug: 'maktab-6g-aqaid-nubuwwah-miraj',
      courseId: course.id,
      title: `Aqaid — Prophethood, Miracles & al-Isra wal-Miraj`,
      description: `Five qualities of prophets, difference between mu'jizah and karamah, the journey of al-Isra from Makkah to Jerusalem, al-Miraj through the seven heavens, and the gift of five daily prayers.`,
      orderIndex: 11,
      content: unit11Content,
    },
    update: {
      title: `Aqaid — Prophethood, Miracles & al-Isra wal-Miraj`,
      description: `Five qualities of prophets, difference between mu'jizah and karamah, the journey of al-Isra from Makkah to Jerusalem, al-Miraj through the seven heavens, and the gift of five daily prayers.`,
      orderIndex: 11,
      content: unit11Content,
    },
  });
  console.log('✅ Unit 11:', unit11.title);

  const unit12Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to define zulm, hasad,
ghibah and kibr, explain their spiritual harms, and describe their cures.
Special attention is given to ghibah as particularly common in social
settings.</p>

<h2>Zulm (Oppression)</h2>
<p>Zulm means wronging someone — violating their rights, their property,
their body, or their honour. Allah says in a hadith qudsi:
<em>O My servants, I have made oppression forbidden for Myself and I have
made it forbidden between you, so do not wrong one another.</em> (Muslim)</p>
<p><strong>Cure:</strong> Return rights to those wronged and seek their
forgiveness, and seek Allah's forgiveness sincerely.</p>

<h2>Hasad (Envy)</h2>
<p>Hasad is wishing that a blessing Allah has given to someone else be
removed from them. It is a major spiritual disease. The Prophet (peace be
upon him) warned: <em>Beware of envy, for envy eats up good deeds as fire
eats up wood.</em> (Abu Dawud)</p>
<p><strong>Ghibtah (Permitted):</strong> Wishing for a similar blessing
WITHOUT wishing it removed from the other — this is permissible and even
praiseworthy.</p>
<p><strong>Cure:</strong> Remember that blessings come from Allah; make du'a
for the person you envy; remind yourself of your own blessings.</p>

<h2>Ghibah (Backbiting)</h2>
<p>Ghibah is mentioning about a person anything they would dislike — even
if it is true. The Quran says:</p>
<blockquote>Would any of you like to eat the flesh of your dead brother?
You would detest it. So fear Allah. (Quran 49:12)</blockquote>
<p>This is especially common in social gatherings and online conversations.
It destroys community bonds and earns serious sin.</p>
<p><strong>Namimah (Tale-carrying):</strong> Conveying words between people
to cause discord — even more serious than ghibah. The Prophet said the
tale-carrier will not enter Jannah. (Bukhari)</p>
<p><strong>Cure:</strong> Occupy the tongue with dhikr; sit with people of
good character; change the subject when ghibah begins.</p>

<h2>Kibr (Pride)</h2>
<p>Kibr is considering oneself superior to others and refusing to accept
the truth. The Prophet (peace be upon him) said:
<em>No one who has an atom's weight of kibr in their heart will enter
Jannah.</em> (Muslim) A companion asked: what about someone who likes nice
clothes? He replied: Allah is beautiful and loves beauty — kibr is
rejecting the truth and looking down on people.</p>
<p><strong>Cure:</strong> Remember that all blessings are from Allah; reflect
on death and the grave; serve others humbly.</p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 12
  // ──────────────────────────────────────────────
  const unit12 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-akhlaq-diseases-ghibah' } },
    create: {
      slug: 'maktab-6g-akhlaq-diseases-ghibah',
      courseId: course.id,
      title: `Akhlaq — Zulm, Hasad, Ghibah & Kibr`,
      description: `Spiritual diseases: zulm (oppression), hasad (envy) vs ghibtah, ghibah (backbiting) and namimah (tale-carrying), kibr (pride) — definitions, Quranic and hadith evidence, and cures for each.`,
      orderIndex: 12,
      content: unit12Content,
    },
    update: {
      title: `Akhlaq — Zulm, Hasad, Ghibah & Kibr`,
      description: `Spiritual diseases: zulm (oppression), hasad (envy) vs ghibtah, ghibah (backbiting) and namimah (tale-carrying), kibr (pride) — definitions, Quranic and hadith evidence, and cures for each.`,
      orderIndex: 12,
      content: unit12Content,
    },
  });
  console.log('✅ Unit 12:', unit12.title);

  const unit13Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit pupils will be able to explain the requirements
of hijab, describe sunan al-fitrah for women, and know the etiquette of
the adhan including the response and du'a.</p>

<h2>Hijab — The Islamic Covering</h2>
<p>Hijab (literally: screen, partition) refers to the Islamic requirement
of modest dress for Muslim women. Allah commands in the Quran:
<em>And tell the believing women to lower their gaze and guard their
private parts, and not display their adornment except what is apparent,
and to draw their covering over their chests...</em> (Quran 24:31)</p>

<h3>What Must Be Covered</h3>
<p>According to the majority of scholars (Hanafi, Maliki, Shafi'i, Hanbali),
a woman must cover her entire body except the <strong>face</strong> and
<strong>hands</strong> when in front of non-mahram men.</p>

<h3>Spirit of Modesty (Haya)</h3>
<p>Hijab is not just clothing — it is a mindset of modesty in speech,
gaze, movement, and interaction. The Prophet (peace be upon him) said:
<em>Haya (modesty) is a branch of faith.</em> (Bukhari)</p>

<h2>Sunan al-Fitrah for Women</h2>
<p>Sunan al-fitrah are acts of natural cleanliness that Islam encourages:</p>
<ul>
  <li>Removing unwanted hair (underarms, pubic area)</li>
  <li>Clipping nails regularly</li>
  <li>Using miswak (tooth-stick) for oral hygiene</li>
  <li>Trimming the moustache (for men) / maintaining personal cleanliness</li>
  <li>Circumcision (for males)</li>
</ul>

<h2>Adhan Etiquette</h2>
<p>When the adhan is heard, Muslims should:</p>
<ol>
  <li><strong>Repeat each phrase</strong> of the adhan after the muadhin,
  except for 'Hayya 'ala al-salah' and 'Hayya 'ala al-falah' — say
  instead: <em>La hawla wa la quwwata illa billah</em></li>
  <li><strong>Recite salawat</strong> on the Prophet after the adhan ends</li>
  <li><strong>Recite the du'a after adhan:</strong></li>
</ol>
<blockquote>
  Allahumma Rabba hadhihi al-da'wati al-tammah wal-salati al-qa'imah,
  ati Muhammadan al-wasilata wal-fadilah, wab'athhu maqaman mahmuda
  alladhi wa'adtah.
</blockquote>

<h3>Iqamah — Difference from Adhan</h3>
<p>The iqamah is shorter than the adhan and signals that the salah is about
to begin. It includes the phrase <em>Qad qamat al-salah</em> (the prayer
has begun). The adhan calls people from a distance; the iqamah is said
just before the congregation stands for prayer.</p>
  `.trim();

  // ──────────────────────────────────────────────
  // UNIT 13
  // ──────────────────────────────────────────────
  const unit13 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-6g-adab-hijab-adhan' } },
    create: {
      slug: 'maktab-6g-adab-hijab-adhan',
      courseId: course.id,
      title: `Adab — Hijab, Modesty & Adhan Etiquette`,
      description: `Hijab requirements for women (entire body except face and hands), the spirit of modesty (haya), sunan al-fitrah for women, repeating the adhan, du'a after adhan, and the iqamah.`,
      orderIndex: 13,
      content: unit13Content,
    },
    update: {
      title: `Adab — Hijab, Modesty & Adhan Etiquette`,
      description: `Hijab requirements for women (entire body except face and hands), the spirit of modesty (haya), sunan al-fitrah for women, repeating the adhan, du'a after adhan, and the iqamah.`,
      orderIndex: 13,
      content: unit13Content,
    },
  });
  console.log('✅ Unit 13:', unit13.title);

  // ──────────────────────────────────────────────
  // QUIZ DATA
  // ──────────────────────────────────────────────
  const quizData: Array<{
    externalId: string;
    unitId: string;
    type: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }> = [
    {
      externalId: 'cb6g-u1-q1',
      unitId: unit1.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Which type of water is valid for wudu and ghusl?`,
      options: [`Tahir Mutahhir (pure and purifying)`, `Tahir (pure but non-purifying)`, `Najis (impure)`, `Fruit juice`],
      correctAnswer: `Tahir Mutahhir (pure and purifying)`,
      explanation: `Only Tahir Mutahhir water — natural water such as rain, river, well, or sea — is valid for wudu and ghusl.`,
    },
    {
      externalId: 'cb6g-u1-q2',
      unitId: unit1.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is Najasah Ghalizah?`,
      options: [`Light impurity, excused if less than a quarter of garment`, `Heavy impurity such as urine, stool, and flowing blood`, `Water that has been used for wudu`, `An impurity only found on clothing`],
      correctAnswer: `Heavy impurity such as urine, stool, and flowing blood`,
      explanation: `Najasah Ghalizah is heavy impurity. It must be thoroughly washed away and there is no excused amount.`,
    },
    {
      externalId: 'cb6g-u1-q3',
      unitId: unit1.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `How many categories of water does Islamic law define?`,
      options: [`Two`, `Three`, `Four`, `Five`],
      correctAnswer: `Three`,
      explanation: `Islamic law divides water into three: Tahir Mutahhir (pure and purifying), Tahir (pure but non-purifying), and Najis (impure).`,
    },
    {
      externalId: 'cb6g-u1-q4',
      unitId: unit1.id,
      type: 'TRUE_FALSE',
      questionText: `Used wudu water (water that has already been used to perform wudu) is Tahir Mutahhir.`,
      options: [`True`, `False`],
      correctAnswer: `False`,
      explanation: `Used wudu water is Tahir (pure) but no longer Mutahhir (purifying). It cannot be used again for wudu or ghusl.`,
    },
    {
      externalId: 'cb6g-u1-q5',
      unitId: unit1.id,
      type: 'FILL_BLANK',
      questionText: `Najasah ______ is excused in salah if it affects less than one quarter of the garment.`,
      options: [],
      correctAnswer: `Khafifah`,
      explanation: `Najasah Khafifah (light impurity, e.g. urine of permissible animals) is excused if less than one quarter of the garment is affected.`,
    },
    {
      externalId: 'cb6g-u1-q6',
      unitId: unit1.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `How should Najasah Ghalizah on clothing be removed?`,
      options: [`Wipe it off with a dry cloth`, `Wash at least three times until completely removed`, `Leave it — it is automatically excused`, `Sprinkle water on it once`],
      correctAnswer: `Wash at least three times until completely removed`,
      explanation: `Ghalizah impurity must be washed at least three times with water, wringing the cloth after each wash, until the impurity is gone.`,
    },
    {
      externalId: 'cb6g-u1-q7',
      unitId: unit1.id,
      type: 'TRUE_FALSE',
      questionText: `Sea water can be used for wudu.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Sea water is Tahir Mutahhir — it is natural water and is valid for wudu and ghusl. The Prophet confirmed this.`,
    },
    {
      externalId: 'cb6g-u2-q1',
      unitId: unit2.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is the minimum duration of hayd (menstruation)?`,
      options: [`1 day`, `3 days`, `7 days`, `10 days`],
      correctAnswer: `3 days`,
      explanation: `The minimum duration of hayd is 3 days (72 hours). Bleeding that lasts less than 3 days is not hayd.`,
    },
    {
      externalId: 'cb6g-u2-q2',
      unitId: unit2.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is the maximum duration of hayd?`,
      options: [`5 days`, `7 days`, `10 days`, `15 days`],
      correctAnswer: `10 days`,
      explanation: `The maximum duration of hayd is 10 days. Bleeding beyond 10 days is considered istihada (irregular bleeding) with different rulings.`,
    },
    {
      externalId: 'cb6g-u2-q3',
      unitId: unit2.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Which of the following is NOT prohibited during hayd?`,
      options: [`Performing salah`, `Entering the masjid`, `Making du'a and dhikr`, `Touching the Quran`],
      correctAnswer: `Making du'a and dhikr`,
      explanation: `Making du'a (supplication) and dhikr (remembrance of Allah) are always permitted. Salah, entering the masjid, and touching the Quran are prohibited during hayd.`,
    },
    {
      externalId: 'cb6g-u2-q4',
      unitId: unit2.id,
      type: 'TRUE_FALSE',
      questionText: `A girl must perform salah during hayd.`,
      options: [`True`, `False`],
      correctAnswer: `False`,
      explanation: `Salah is prohibited during hayd. Unlike fasting (which must be made up), missed salah during hayd does NOT need to be made up.`,
    },
    {
      externalId: 'cb6g-u2-q5',
      unitId: unit2.id,
      type: 'FILL_BLANK',
      questionText: `The three faraid of ghusl are gargling (madmadah), ______ (istinshaq), and full body wash.`,
      options: [],
      correctAnswer: `nasal rinse`,
      explanation: `The three faraid of ghusl are: (1) gargling the mouth, (2) nasal rinse (sniffing water in and blowing out), and (3) washing the entire body.`,
    },
    {
      externalId: 'cb6g-u2-q6',
      unitId: unit2.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `At what age is bulugh (maturity) established for a girl if no physical signs have appeared?`,
      options: [`12 lunar years`, `13 lunar years`, `15 lunar years`, `18 lunar years`],
      correctAnswer: `15 lunar years`,
      explanation: `If no sign of maturity (hayd or pubic hair) has appeared, a girl is considered mature at 15 lunar years in the Hanafi school.`,
    },
    {
      externalId: 'cb6g-u2-q7',
      unitId: unit2.id,
      type: 'TRUE_FALSE',
      questionText: `Ghusl is required when hayd ends before a woman can pray or fast.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `When hayd ends, ghusl is fard (obligatory). A woman may not pray or fast until she has performed a valid ghusl.`,
    },
    {
      externalId: 'cb6g-u3-q1',
      unitId: unit3.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What must be done if a wajib act of salah is omitted intentionally?`,
      options: [`Perform sajdah as-sahw`, `Repeat the entire salah`, `Nothing — it is still valid`, `Add an extra rakah`],
      correctAnswer: `Repeat the entire salah`,
      explanation: `Intentional omission of a wajib act invalidates the salah. It must be repeated. Sajdah as-sahw only applies when the omission was forgetful.`,
    },
    {
      externalId: 'cb6g-u3-q2',
      unitId: unit3.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `How many takbirs are in janazah salah?`,
      options: [`Two`, `Three`, `Four`, `Five`],
      correctAnswer: `Four`,
      explanation: `Janazah salah consists of four takbirs. After the 3rd takbir, a du'a is made for the deceased. After the 4th, salam is given on both sides.`,
    },
    {
      externalId: 'cb6g-u3-q3',
      unitId: unit3.id,
      type: 'TRUE_FALSE',
      questionText: `Janazah salah includes ruku (bowing) and sajdah (prostration).`,
      options: [`True`, `False`],
      correctAnswer: `False`,
      explanation: `Janazah salah has no ruku or sajdah. It consists of four takbirs with specific recitations and du'a between them, standing throughout.`,
    },
    {
      externalId: 'cb6g-u3-q4',
      unitId: unit3.id,
      type: 'FILL_BLANK',
      questionText: `The two extra prostrations performed at the end of salah to compensate for a forgotten wajib act are called ______.`,
      options: [],
      correctAnswer: `sajdah as-sahw`,
      explanation: `Sajdah as-sahw (prostration of forgetfulness) consists of two sajdahs performed after the final tashahhud when a wajib act was omitted by mistake.`,
    },
    {
      externalId: 'cb6g-u3-q5',
      unitId: unit3.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is recited after the third takbir in janazah salah?`,
      options: [`Surah al-Fatiha`, `Salawat on the Prophet`, `Du'a for the deceased`, `Thana`],
      correctAnswer: `Du'a for the deceased`,
      explanation: `After the 3rd takbir in janazah salah, a du'a is made for the deceased, asking Allah to forgive them and grant them mercy.`,
    },
    {
      externalId: 'cb6g-u3-q6',
      unitId: unit3.id,
      type: 'TRUE_FALSE',
      questionText: `Women may participate in janazah salah.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Women may attend and participate in janazah salah. They stand in their own rows behind the men, just as in regular congregational salah.`,
    },
    {
      externalId: 'cb6g-u3-q7',
      unitId: unit3.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Reciting Surah al-Fatiha in every rakah is classified as:`,
      options: [`Fard (obligatory pillar)`, `Wajib (necessary act)`, `Sunnah (recommended)`, `Mustahab (preferred)`],
      correctAnswer: `Wajib (necessary act)`,
      explanation: `Reciting Surah al-Fatiha in every rakah is wajib (necessary). Omitting it forgetfully requires sajdah as-sahw; omitting it intentionally makes the salah invalid.`,
    },
    {
      externalId: 'cb6g-u4-q1',
      unitId: unit4.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What does the hadith "Innamal a'malu bin-niyyat" mean?`,
      options: [`Pray five times a day`, `Actions are judged by their intentions`, `Speak good or be silent`, `Smiling is charity`],
      correctAnswer: `Actions are judged by their intentions`,
      explanation: `This foundational hadith means that every deed is judged by the intention behind it. Good intention transforms ordinary acts into worship.`,
    },
    {
      externalId: 'cb6g-u4-q2',
      unitId: unit4.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `According to the hadith, what does smiling at your Muslim brother or sister count as?`,
      options: [`A greeting only`, `Sadaqah (charity)`, `A wajib act`, `A sunnah with no reward`],
      correctAnswer: `Sadaqah (charity)`,
      explanation: `The Prophet (peace be upon him) said: "Your smiling at your brother is sadaqah." Even this simple act earns spiritual reward.`,
    },
    {
      externalId: 'cb6g-u4-q3',
      unitId: unit4.id,
      type: 'FILL_BLANK',
      questionText: `According to hadith, removing something harmful from the road is a branch of ______.`,
      options: [],
      correctAnswer: `Iman`,
      explanation: `The Prophet said removing harm from the road is a branch of iman (faith). Even small acts of service are part of being a believer.`,
    },
    {
      externalId: 'cb6g-u4-q4',
      unitId: unit4.id,
      type: 'TRUE_FALSE',
      questionText: `According to hadith, a Muslim has only three rights over another Muslim.`,
      options: [`True`, `False`],
      correctAnswer: `False`,
      explanation: `A Muslim has six rights over another Muslim: return salam, visit when sick, attend janazah, accept invitation, say yarhamukallah when they sneeze, and give sincere advice. (Muslim)`,
    },
    {
      externalId: 'cb6g-u4-q5',
      unitId: unit4.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What does the hadith about women's prayer say about praying at home?`,
      options: [`It is disliked for women to pray at home`, `A woman's prayer at home is better for her than at the masjid`, `Women must pray at the masjid in congregation`, `Women's prayer at home is not counted`],
      correctAnswer: `A woman's prayer at home is better for her than at the masjid`,
      explanation: `The Prophet said a woman's prayer in her inner room is better than her prayer in her house, and her house is better than the masjid. This shows the high value Islam places on a woman's privacy and security.`,
    },
    {
      externalId: 'cb6g-u4-q6',
      unitId: unit4.id,
      type: 'TRUE_FALSE',
      questionText: `"Innamal a'malu bin-niyyat" is among the most foundational hadith in Islamic jurisprudence.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Imam Shafi'i and others considered this hadith to be one-third or even one-quarter of the entire deen, so fundamental is the concept of niyyah (intention) in Islam.`,
    },
    {
      externalId: 'cb6g-u4-q7',
      unitId: unit4.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `The hadith "Speak good or remain silent" was narrated by which companion?`,
      options: [`Umar ibn al-Khattab`, `Abu Hurayrah`, `Abu Dharr`, `Anas ibn Malik`],
      correctAnswer: `Abu Hurayrah`,
      explanation: `This hadith — "Whoever believes in Allah and the Last Day, let him speak good or remain silent" — was narrated by Abu Hurayrah in Bukhari and Muslim.`,
    },
    {
      externalId: 'cb6g-u5-q1',
      unitId: unit5.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Upon whom is seeking knowledge obligatory according to hadith?`,
      options: [`Adult men only`, `Adult men and women only`, `Every Muslim (male and female)`, `Only scholars`],
      correctAnswer: `Every Muslim (male and female)`,
      explanation: `"Seeking knowledge is an obligation upon every Muslim." (Ibn Majah) No gender exception — every Muslim must learn the basics of their deen.`,
    },
    {
      externalId: 'cb6g-u5-q2',
      unitId: unit5.id,
      type: 'TRUE_FALSE',
      questionText: `According to hadith, feeding others is one of the acts that leads to Jannah.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `The Prophet said: "Feed others, spread salam, pray at night while people sleep — you will enter Jannah in peace." (Tirmidhi) Feeding people is among the highest acts of generosity.`,
    },
    {
      externalId: 'cb6g-u5-q3',
      unitId: unit5.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `According to hadith, truthfulness leads to:`,
      options: [`Wealth and success`, `Righteousness (birr) and then Jannah`, `Being recorded as a hafiz`, `Leadership in the community`],
      correctAnswer: `Righteousness (birr) and then Jannah`,
      explanation: `The hadith states: "Truthfulness leads to righteousness (birr) and righteousness leads to Jannah." A truthful person is eventually recorded with Allah as a Siddiq (most truthful). (Bukhari)`,
    },
    {
      externalId: 'cb6g-u5-q4',
      unitId: unit5.id,
      type: 'FILL_BLANK',
      questionText: `According to hadith, spreading ______ among Muslims increases love between them.`,
      options: [],
      correctAnswer: `salam`,
      explanation: `The Prophet said: "You will not enter Jannah until you believe, and you will not believe until you love each other. Shall I tell you what will make you love each other? Spread salam." (Muslim)`,
    },
    {
      externalId: 'cb6g-u5-q5',
      unitId: unit5.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What reward did the Prophet mention for visiting the sick?`,
      options: [`Ten good deeds`, `Forgiveness of all sins`, `Remaining in the garden of Jannah until returning home`, `Being recorded as a martyr`],
      correctAnswer: `Remaining in the garden of Jannah until returning home`,
      explanation: `"Whoever visits a sick person continues to be in the garden of Jannah until they return." (Muslim) Visiting the sick is one of the six rights of a Muslim upon another.`,
    },
    {
      externalId: 'cb6g-u5-q6',
      unitId: unit5.id,
      type: 'TRUE_FALSE',
      questionText: `In the hadith about parents, the mother is mentioned once before the father.`,
      options: [`True`, `False`],
      correctAnswer: `False`,
      explanation: `The Prophet was asked three times who is most deserving of good company, and three times he answered "your mother." Only on the fourth time did he say "your father." (Bukhari & Muslim)`,
    },
    {
      externalId: 'cb6g-u5-q7',
      unitId: unit5.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `How much did Jibril emphasise the rights of neighbours according to hadith?`,
      options: [`Once in a hadith`, `Three times`, `So much that the Prophet thought neighbours might become heirs`, `Only in passing`],
      correctAnswer: `So much that the Prophet thought neighbours might become heirs`,
      explanation: `"Jibril kept advising me about the neighbour until I thought he would make the neighbour an heir." (Bukhari & Muslim) This shows the extreme importance of good neighbourliness in Islam.`,
    },
    {
      externalId: 'cb6g-u6-q1',
      unitId: unit6.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `How was the Prophet's height described?`,
      options: [`Very tall — the tallest in his community`, `Very short`, `Medium — neither tall nor short`, `Shorter than average`],
      correctAnswer: `Medium — neither tall nor short`,
      explanation: `Companions described the Prophet (peace be upon him) as being of medium height — not too tall and not too short, perfectly proportioned.`,
    },
    {
      externalId: 'cb6g-u6-q2',
      unitId: unit6.id,
      type: 'TRUE_FALSE',
      questionText: `The Prophet's (peace be upon him) hair was described as perfectly straight.`,
      options: [`True`, `False`],
      correctAnswer: `False`,
      explanation: `The Prophet's hair was slightly wavy — neither perfectly straight nor very curly. It reached his shoulders.`,
    },
    {
      externalId: 'cb6g-u6-q3',
      unitId: unit6.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What did the Prophet (peace be upon him) say about being best to one's family?`,
      options: [`"The best of you is the wealthiest"`, `"The best of you is the best to his family, and I am the best to my family"`, `"The best of you is the most learned"`, `"The best of you prays the most"`],
      correctAnswer: `"The best of you is the best to his family, and I am the best to my family"`,
      explanation: `This hadith (Tirmidhi) shows the Prophet's emphasis on kindness within the home. Good character with one's family is a mark of the best believers.`,
    },
    {
      externalId: 'cb6g-u6-q4',
      unitId: unit6.id,
      type: 'FILL_BLANK',
      questionText: `The term "shamail" refers to the noble ______ of the Prophet (peace be upon him).`,
      options: [],
      correctAnswer: `characteristics`,
      explanation: `Shamail means the noble physical and moral characteristics of the Prophet (peace be upon him). Books of shamail compile these descriptions from the companions.`,
    },
    {
      externalId: 'cb6g-u6-q5',
      unitId: unit6.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `The Prophet's (peace be upon him) complexion was described as:`,
      options: [`Pure white`, `Very dark`, `Azhar — a luminous light brownish tone`, `Red-faced`],
      correctAnswer: `Azhar — a luminous light brownish tone`,
      explanation: `The word "azhar" describes a complexion that is fair but with a warm glow — luminous and clear, neither stark white nor dark.`,
    },
    {
      externalId: 'cb6g-u6-q6',
      unitId: unit6.id,
      type: 'TRUE_FALSE',
      questionText: `The Prophet (peace be upon him) said haya (modesty) is a branch of faith.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `"Iman has over seventy branches... and haya (modesty) is a branch of iman." (Bukhari) The Prophet was described as being more modest than a young girl in her seclusion.`,
    },
    {
      externalId: 'cb6g-u6-q7',
      unitId: unit6.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `How did the Prophet (peace be upon him) treat his servants?`,
      options: [`He gave them different food from what he ate`, `He instructed feeding them what you eat and clothing them as you dress`, `He did not keep servants`, `He only used jinn as servants`],
      correctAnswer: `He instructed feeding them what you eat and clothing them as you dress`,
      explanation: `The Prophet commanded: "Feed them what you eat, clothe them with what you wear, and do not burden them beyond what they can bear." (Bukhari) This shows Islam's profound concern for human dignity.`,
    },
    {
      externalId: 'cb6g-u7-q1',
      unitId: unit7.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Why was Abu Bakr (may Allah be pleased with him) given the title al-Siddiq?`,
      options: [`He memorised the Quran first`, `He immediately and completely believed the account of al-Isra wal-Miraj`, `He was the best fighter in Islam`, `He gave the most wealth to the poor`],
      correctAnswer: `He immediately and completely believed the account of al-Isra wal-Miraj`,
      explanation: `When people doubted the Prophet's account of al-Isra wal-Miraj, Abu Bakr said "If he said it, it is true" — earning the title al-Siddiq, the one who confirms the truth completely.`,
    },
    {
      externalId: 'cb6g-u7-q2',
      unitId: unit7.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Who accompanied the Prophet (peace be upon him) in the Cave of Thawr during the Hijrah?`,
      options: [`Umar ibn al-Khattab`, `Ali ibn Abi Talib`, `Abu Bakr al-Siddiq`, `Uthman ibn Affan`],
      correctAnswer: `Abu Bakr al-Siddiq`,
      explanation: `Abu Bakr was the only companion who accompanied the Prophet in hiding in the Cave of Thawr for three days during the Hijrah to Madinah. The Quran mentions this (9:40).`,
    },
    {
      externalId: 'cb6g-u7-q3',
      unitId: unit7.id,
      type: 'TRUE_FALSE',
      questionText: `Abu Bakr (may Allah be pleased with him) was the first adult male to accept Islam.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Abu Bakr was the first adult free male to accept Islam. Khadijah (the first Muslim overall), Ali (the first child), and Zayd ibn Haritha (the first freed slave) accepted before him in their categories.`,
    },
    {
      externalId: 'cb6g-u7-q4',
      unitId: unit7.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What major project did Abu Bakr's caliphate accomplish?`,
      options: [`Building Masjid al-Nabawi`, `Compiling the Quran into a single book`, `Establishing the Islamic calendar`, `Writing down all the ahadith`],
      correctAnswer: `Compiling the Quran into a single book`,
      explanation: `After many huffadh were martyred at the Battle of Yamama, Abu Bakr instructed Zayd ibn Thabit to compile the Quran into a single written volume — preserving it for all future generations.`,
    },
    {
      externalId: 'cb6g-u7-q5',
      unitId: unit7.id,
      type: 'FILL_BLANK',
      questionText: `Abu Bakr fought the ______ wars against those who refused to pay zakah or left Islam after the Prophet's death.`,
      options: [],
      correctAnswer: `riddah`,
      explanation: `The riddah (apostasy) wars were Abu Bakr's decisive military campaigns to preserve the unity of the Muslim community against those who refused zakah or abandoned Islam after the Prophet's passing.`,
    },
    {
      externalId: 'cb6g-u7-q6',
      unitId: unit7.id,
      type: 'TRUE_FALSE',
      questionText: `Abu Bakr (may Allah be pleased with him) was the second caliph of Islam.`,
      options: [`True`, `False`],
      correctAnswer: `False`,
      explanation: `Abu Bakr was the FIRST caliph of Islam. He was succeeded by Umar ibn al-Khattab (2nd), then Uthman ibn Affan (3rd), then Ali ibn Abi Talib (4th).`,
    },
    {
      externalId: 'cb6g-u7-q7',
      unitId: unit7.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Approximately how long was the caliphate of Abu Bakr?`,
      options: [`6 months`, `2 years`, `5 years`, `10 years`],
      correctAnswer: `2 years`,
      explanation: `Abu Bakr's caliphate lasted approximately 2 years and 3 months (632-634 CE). Despite its short duration, it was a pivotal period that preserved and expanded the early Muslim community.`,
    },
    {
      externalId: 'cb6g-u8-q1',
      unitId: unit8.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Which holy book was revealed to Prophet Dawud (peace be upon him)?`,
      options: [`The Tawrah`, `The Zabur (Psalms)`, `The Injil`, `The Quran`],
      correctAnswer: `The Zabur (Psalms)`,
      explanation: `The Zabur (Psalms) was revealed to Prophet Dawud — one of the four major revealed books in Islam (Tawrah, Zabur, Injil, Quran).`,
    },
    {
      externalId: 'cb6g-u8-q2',
      unitId: unit8.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What was the unique miracle given to Prophet Dawud (peace be upon him) regarding iron?`,
      options: [`He could make iron float on water`, `He could mold iron with his hands without fire`, `He could speak to iron`, `Iron weapons could not harm him`],
      correctAnswer: `He could mold iron with his hands without fire`,
      explanation: `Allah made iron soft for Dawud — he could shape it with his bare hands without needing fire. He used this gift to craft chain mail armour for his army. (Quran 34:10-11)`,
    },
    {
      externalId: 'cb6g-u8-q3',
      unitId: unit8.id,
      type: 'TRUE_FALSE',
      questionText: `Prophet Sulayman (peace be upon him) had control over jinn, humans, birds, and wind.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Allah granted Sulayman an extraordinary kingdom: jinn and humans served him, birds were under his command, and the wind carried his throne. (Quran 21:81, 27:17)`,
    },
    {
      externalId: 'cb6g-u8-q4',
      unitId: unit8.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Who accepted Islam upon meeting Prophet Sulayman (peace be upon him)?`,
      options: [`The Queen of Egypt`, `Queen Bilqis of Sheba`, `Queen of Babylon`, `Queen of Persia`],
      correctAnswer: `Queen Bilqis of Sheba`,
      explanation: `The hoopoe brought news of Queen Bilqis to Sulayman. He sent her a letter beginning with Bismillah. After witnessing his miraculous court, she declared her submission to Allah. (Quran 27:44)`,
    },
    {
      externalId: 'cb6g-u8-q5',
      unitId: unit8.id,
      type: 'FILL_BLANK',
      questionText: `Prophet Dawud (peace be upon him) killed the Philistine giant ______ as a young man.`,
      options: [],
      correctAnswer: `Jalut (Goliath)`,
      explanation: `Before his prophethood, the young Dawud killed Jalut (Goliath) with a sling and stone, giving the Children of Israel victory over the Philistines. (Quran 2:251)`,
    },
    {
      externalId: 'cb6g-u8-q6',
      unitId: unit8.id,
      type: 'TRUE_FALSE',
      questionText: `Prophet Sulayman (peace be upon him) was the son of Prophet Dawud (peace be upon him).`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Sulayman was the son of Dawud — both were prophets and kings of the Children of Israel. Sulayman inherited and surpassed his father's kingdom. (Quran 27:16)`,
    },
    {
      externalId: 'cb6g-u8-q7',
      unitId: unit8.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `The story of the ants speaking to Prophet Sulayman (peace be upon him) is found in:`,
      options: [`Surah al-Baqarah`, `Surah al-Naml (The Ant)`, `Surah al-Kahf`, `Surah Maryam`],
      correctAnswer: `Surah al-Naml (The Ant)`,
      explanation: `Surah al-Naml (Chapter 27) — named "The Ant" — narrates how an ant warned its people as Sulayman's army approached, and Sulayman smiled at hearing the ant's words.`,
    },
    {
      externalId: 'cb6g-u9-q1',
      unitId: unit9.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What was Prophet Yunus's (peace be upon him) du'a while inside the whale?`,
      options: [`Alhamdulillahi rabbil 'alamin`, `La ilaha illa anta subhanaka inni kuntu min al-zalimin`, `Hasbunallahu wa ni'mal wakil`, `Inna lillahi wa inna ilayhi raji'un`],
      correctAnswer: `La ilaha illa anta subhanaka inni kuntu min al-zalimin`,
      explanation: `This famous du'a — 'There is no god but You; glory be to You; indeed I have been of the wrongdoers' — was said by Yunus in the darkness of the whale. Allah accepted it and saved him.`,
    },
    {
      externalId: 'cb6g-u9-q2',
      unitId: unit9.id,
      type: 'TRUE_FALSE',
      questionText: `The people of Nineveh repented and had their repentance accepted by Allah.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Unlike any other community, the entire people of Nineveh repented sincerely before the punishment arrived, and Allah accepted their repentance. This was unique in prophetic history. (Quran 10:98)`,
    },
    {
      externalId: 'cb6g-u9-q3',
      unitId: unit9.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Where did the Umayyad dynasty establish its capital?`,
      options: [`Makkah`, `Madinah`, `Damascus`, `Baghdad`],
      correctAnswer: `Damascus`,
      explanation: `Muawiyah ibn Abi Sufyan established Damascus (in modern Syria) as the capital of the Umayyad Caliphate in 661 CE.`,
    },
    {
      externalId: 'cb6g-u9-q4',
      unitId: unit9.id,
      type: 'FILL_BLANK',
      questionText: `During the Umayyad period, Muslims reached ______ in Europe, bringing Islam to the western world.`,
      options: [],
      correctAnswer: `al-Andalus (Spain)`,
      explanation: `The Umayyad general Tariq ibn Ziyad crossed into al-Andalus (the Iberian Peninsula — modern Spain and Portugal) in 711 CE, bringing Islam to Europe.`,
    },
    {
      externalId: 'cb6g-u9-q5',
      unitId: unit9.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Who was the founder (first caliph) of the Umayyad dynasty?`,
      options: [`Abu Sufyan ibn Harb`, `Yazid ibn Muawiyah`, `Muawiyah ibn Abi Sufyan`, `Abd al-Malik ibn Marwan`],
      correctAnswer: `Muawiyah ibn Abi Sufyan`,
      explanation: `Muawiyah ibn Abi Sufyan established the Umayyad Caliphate in 661 CE after the period of Hasan ibn Ali. He is considered the first Umayyad caliph.`,
    },
    {
      externalId: 'cb6g-u9-q6',
      unitId: unit9.id,
      type: 'TRUE_FALSE',
      questionText: `The Quran specifies that Prophet Yunus was inside the whale for exactly 40 days.`,
      options: [`True`, `False`],
      correctAnswer: `False`,
      explanation: `The Quran does not specify the exact duration of Yunus's time in the whale. Scholars differ, but 40 days is not stated in the Quran.`,
    },
    {
      externalId: 'cb6g-u9-q7',
      unitId: unit9.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Which Umayyad caliph is known for expanding the Masjid al-Nabawi and building the Umayyad Mosque in Damascus?`,
      options: [`Muawiyah ibn Abi Sufyan`, `Abd al-Malik ibn Marwan`, `Walid ibn Abd al-Malik`, `Hisham ibn Abd al-Malik`],
      correctAnswer: `Walid ibn Abd al-Malik`,
      explanation: `Walid ibn Abd al-Malik (705-715 CE) undertook major architectural projects: expanding Masjid al-Nabawi in Madinah, rebuilding Masjid al-Aqsa, and constructing the Great Umayyad Mosque in Damascus.`,
    },
    {
      externalId: 'cb6g-u10-q1',
      unitId: unit10.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What does "Ahlus Sunnah wal-Jamaah" mean?`,
      options: [`The people of the early scholars only`, `The people of the Sunnah and the united community`, `The people of the four imams only`, `The people of sufism and dhikr`],
      correctAnswer: `The people of the Sunnah and the united community`,
      explanation: `Ahlus Sunnah wal-Jamaah literally means "the people of the Sunnah (Prophetic practice) and the united community" — those who follow the Quran, Sunnah, and the way of the Sahabah.`,
    },
    {
      externalId: 'cb6g-u10-q2',
      unitId: unit10.id,
      type: 'TRUE_FALSE',
      questionText: `Ahlus Sunnah believe all Sahabah (companions) should be respected and none should be harshly criticised.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Ahlus Sunnah hold that all Sahabah were people of great virtue who made sacrifices for Islam. Disagreements among them were matters of scholarly ijtihad, not grounds for insult or blame.`,
    },
    {
      externalId: 'cb6g-u10-q3',
      unitId: unit10.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Which three sources do Ahlus Sunnah follow?`,
      options: [`The Quran, hadiths, and the four imams`, `The Quran, Sunnah, and the way of the Sahabah`, `The Quran, reason, and consensus of scholars`, `The Quran and the six books of hadith only`],
      correctAnswer: `The Quran, Sunnah, and the way of the Sahabah`,
      explanation: `Ahlus Sunnah follow: (1) the Quran, (2) the Sunnah of the Prophet, and (3) the way of the Sahabah. These three together form the foundation of their beliefs and practice.`,
    },
    {
      externalId: 'cb6g-u10-q4',
      unitId: unit10.id,
      type: 'FILL_BLANK',
      questionText: `An innovation introduced into religion without being sanctioned by Allah or His Prophet is called ______.`,
      options: [],
      correctAnswer: `bid'ah`,
      explanation: `Bid'ah means introducing into the religion something not sanctioned by Allah or His Prophet. The Prophet warned: 'Every bid'ah is misguidance, and every misguidance leads to the Fire.' (Muslim)`,
    },
    {
      externalId: 'cb6g-u10-q5',
      unitId: unit10.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `How does Ahlus Sunnah view the differences and disputes that occurred among the Sahabah?`,
      options: [`As evidence that the Sahabah were wrong`, `As scholarly differences arising from ijtihad, not grounds for criticism`, `As proof Islam split into many sects`, `As matters that must be debated in every generation`],
      correctAnswer: `As scholarly differences arising from ijtihad, not grounds for criticism`,
      explanation: `Ahlus Sunnah view the disagreements among Sahabah (such as during the time of Uthman and Ali) as arising from sincere ijtihad. Both parties were trying to serve the deen, and we respect all of them.`,
    },
    {
      externalId: 'cb6g-u10-q6',
      unitId: unit10.id,
      type: 'TRUE_FALSE',
      questionText: `Following bid'ah is praised and encouraged in Ahlus Sunnah theology.`,
      options: [`True`, `False`],
      correctAnswer: `False`,
      explanation: `Ahlus Sunnah firmly avoid bid'ah. The Prophet said 'Every bid'ah is misguidance' and 'Beware of newly invented matters, for every newly invented matter is bid'ah.' (Tirmidhi)`,
    },
    {
      externalId: 'cb6g-u10-q7',
      unitId: unit10.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is one of the six pillars of iman (faith) that Ahlus Sunnah affirm?`,
      options: [`Belief in the four madhabs`, `Belief in al-Qadr (divine decree)`, `Belief in Islamic finance`, `Belief in the four caliphs`],
      correctAnswer: `Belief in al-Qadr (divine decree)`,
      explanation: `The six pillars of iman are: belief in Allah, angels, revealed books, prophets, the Last Day, and al-Qadr (divine decree — both good and bad are from Allah).`,
    },
    {
      externalId: 'cb6g-u11-q1',
      unitId: unit11.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `How many essential qualities must every prophet possess?`,
      options: [`Three`, `Four`, `Five`, `Six`],
      correctAnswer: `Five`,
      explanation: `Every prophet has five essential qualities: Sidq (truthfulness), Amanah (trustworthiness), Tabligh (conveying the message), Fatanah (intelligence), and Ismah (protection from major sin).`,
    },
    {
      externalId: 'cb6g-u11-q2',
      unitId: unit11.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is the key difference between a mu'jizah and a karamah?`,
      options: [`A mu'jizah is larger; a karamah is smaller`, `A mu'jizah is given to prophets as proof of prophethood; a karamah is for awliya`, `A mu'jizah happens once; a karamah is repeated`, `There is no difference — they are the same thing`],
      correctAnswer: `A mu'jizah is given to prophets as proof of prophethood; a karamah is for awliya`,
      explanation: `A mu'jizah is a miracle specifically given to a prophet to prove their prophethood. A karamah is an extraordinary occurrence given to a righteous wali (friend of Allah) — not as proof of prophethood.`,
    },
    {
      externalId: 'cb6g-u11-q3',
      unitId: unit11.id,
      type: 'TRUE_FALSE',
      questionText: `Al-Isra (the night journey) went from Masjid al-Haram in Makkah to Masjid al-Aqsa in Jerusalem.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Al-Isra took the Prophet (peace be upon him) from Masjid al-Haram (Makkah) to Masjid al-Aqsa (Jerusalem) on al-Buraq in one night. Al-Miraj then took him through the seven heavens.`,
    },
    {
      externalId: 'cb6g-u11-q4',
      unitId: unit11.id,
      type: 'FILL_BLANK',
      questionText: `On the night of al-Miraj, the Prophet (peace be upon him) was given the gift of ______ daily prayers.`,
      options: [],
      correctAnswer: `five (5)`,
      explanation: `Originally 50 prayers were commanded. On the advice of Musa, the Prophet returned to Allah repeatedly until the number was reduced to 5 — while retaining the reward of 50.`,
    },
    {
      externalId: 'cb6g-u11-q5',
      unitId: unit11.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `Through how many heavens did the Prophet (peace be upon him) ascend on al-Miraj?`,
      options: [`Three`, `Five`, `Seven`, `Nine`],
      correctAnswer: `Seven`,
      explanation: `The Prophet ascended through seven heavens (sab'a samawat), meeting a different prophet in each: Adam (1st), Yahya/Isa (2nd), Yusuf (3rd), Idris (4th), Harun (5th), Musa (6th), Ibrahim (7th).`,
    },
    {
      externalId: 'cb6g-u11-q6',
      unitId: unit11.id,
      type: 'TRUE_FALSE',
      questionText: `The original number of daily prayers commanded on al-Miraj was 50.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Allah originally commanded 50 daily prayers. The Prophet descended and met Musa, who advised him to return and ask for a reduction. After several trips, it was reduced to 5 with the reward of 50.`,
    },
    {
      externalId: 'cb6g-u11-q7',
      unitId: unit11.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is a mu'jizah?`,
      options: [`A dream seen by a prophet`, `A miracle given to a prophet by Allah as proof of their prophethood`, `A hadith narrated by many companions`, `A form of worship unique to prophets`],
      correctAnswer: `A miracle given to a prophet by Allah as proof of their prophethood`,
      explanation: `A mu'jizah is a supernatural event that Allah causes to occur through a prophet to challenge opponents and prove the truth of the prophet's message.`,
    },
    {
      externalId: 'cb6g-u12-q1',
      unitId: unit12.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is the correct definition of ghibah (backbiting)?`,
      options: [`Saying something false about a person`, `Mentioning something about a person that they would dislike, even if true`, `Arguing with someone in public`, `Spreading news about someone with their permission`],
      correctAnswer: `Mentioning something about a person that they would dislike, even if true`,
      explanation: `Ghibah is defined as: mentioning a person in their absence what they would dislike — even if it is true. If it is false, that is buhtan (slander), which is even worse.`,
    },
    {
      externalId: 'cb6g-u12-q2',
      unitId: unit12.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is the key difference between hasad (envy) and ghibtah?`,
      options: [`There is no difference`, `Hasad wishes the blessing removed from the other; ghibtah wishes the same without removal`, `Hasad is about money; ghibtah is about status`, `Ghibtah is worse than hasad`],
      correctAnswer: `Hasad wishes the blessing removed from the other; ghibtah wishes the same without removal`,
      explanation: `Hasad (forbidden) wishes the blessing taken away from the person. Ghibtah (permissible) wishes for a similar blessing for oneself without wanting it removed from the other person.`,
    },
    {
      externalId: 'cb6g-u12-q3',
      unitId: unit12.id,
      type: 'TRUE_FALSE',
      questionText: `Kibr (pride) that prevents accepting the truth is a major sin in Islam.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `The Prophet defined kibr as: "Rejecting the truth and looking down on people." (Muslim) Even an atom's weight of kibr in the heart prevents entering Jannah, according to hadith.`,
    },
    {
      externalId: 'cb6g-u12-q4',
      unitId: unit12.id,
      type: 'FILL_BLANK',
      questionText: `The act of carrying tales between people to cause discord and destroy relationships is called ______.`,
      options: [],
      correctAnswer: `namimah`,
      explanation: `Namimah (tale-carrying) is conveying what someone said to another to cause ill-feeling between them. The Prophet said the nammam (tale-carrier) will not enter Jannah. (Bukhari)`,
    },
    {
      externalId: 'cb6g-u12-q5',
      unitId: unit12.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What does the Quran compare ghibah (backbiting) to?`,
      options: [`Stealing from a sleeping person`, `Eating the flesh of your dead brother`, `Stabbing someone in the back`, `Poisoning the water supply`],
      correctAnswer: `Eating the flesh of your dead brother`,
      explanation: `"Would any of you like to eat the flesh of your dead brother? You would detest it." (Quran 49:12) This powerful comparison shows how repulsive ghibah should be to the believer.`,
    },
    {
      externalId: 'cb6g-u12-q6',
      unitId: unit12.id,
      type: 'TRUE_FALSE',
      questionText: `A small amount of kibr is permissible as long as it does not affect one's acts of worship.`,
      options: [`True`, `False`],
      correctAnswer: `False`,
      explanation: `The Prophet said: "No one who has an atom's weight of kibr in their heart will enter Jannah." (Muslim) There is no permissible amount of kibr — the heart must be free of it entirely.`,
    },
    {
      externalId: 'cb6g-u12-q7',
      unitId: unit12.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is the primary cure for zulm (oppression)?`,
      options: [`Perform extra nawafil prayers`, `Return rights to those wronged and seek forgiveness from them and Allah`, `Give sadaqah to charity`, `Fast for three days`],
      correctAnswer: `Return rights to those wronged and seek forgiveness from them and Allah`,
      explanation: `Zulm involving another person's rights must be remedied by returning what was taken and seeking their forgiveness. Allah will not forgive zulm done to others until the wronged person forgives first.`,
    },
    {
      externalId: 'cb6g-u13-q1',
      unitId: unit13.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `According to the majority of scholars, what must a Muslim woman cover when in front of non-mahram men?`,
      options: [`Everything including the face`, `The entire body except the face and hands`, `Only the hair and arms`, `Only what is considered immodest locally`],
      correctAnswer: `The entire body except the face and hands`,
      explanation: `The majority of Hanafi, Maliki, Shafi'i, and Hanbali scholars hold that a woman must cover her entire body except the face and hands when in the presence of non-mahram men.`,
    },
    {
      externalId: 'cb6g-u13-q2',
      unitId: unit13.id,
      type: 'TRUE_FALSE',
      questionText: `Sunan al-fitrah include removing unwanted hair and clipping nails regularly.`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `Sunan al-fitrah (acts of natural cleanliness) include: removing underarm and pubic hair, clipping nails, using miswak, and other hygiene practices that the Prophet encouraged for all Muslims.`,
    },
    {
      externalId: 'cb6g-u13-q3',
      unitId: unit13.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `When a person hears "Hayya 'ala al-salah" in the adhan, what should they respond?`,
      options: [`Hayya 'ala al-salah (repeat it)`, `La hawla wa la quwwata illa billah`, `Allahu Akbar`, `Sami'allahu liman hamidah`],
      correctAnswer: `La hawla wa la quwwata illa billah`,
      explanation: `When hearing 'Hayya 'ala al-salah' and 'Hayya 'ala al-falah', the listener says 'La hawla wa la quwwata illa billah' instead of repeating the phrase — all other phrases of the adhan are repeated.`,
    },
    {
      externalId: 'cb6g-u13-q4',
      unitId: unit13.id,
      type: 'FILL_BLANK',
      questionText: `The du'a recited after the adhan asks Allah to grant Prophet Muhammad ﷺ al-wasilah and al-______.`,
      options: [],
      correctAnswer: `fadilah`,
      explanation: `The du'a after adhan says: 'Allahumma Rabba hadhihi al-da'wati al-tammah... ati Muhammadan al-wasilata wal-fadilah' — asking Allah to grant the Prophet al-wasilah (the highest station in Jannah) and al-fadilah (honour).`,
    },
    {
      externalId: 'cb6g-u13-q5',
      unitId: unit13.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What is the key difference between the adhan and the iqamah?`,
      options: [`The adhan is in Arabic; the iqamah is in another language`, `The adhan calls people to prayer from a distance; the iqamah is shorter and signals prayer is about to begin`, `The adhan is only for men; the iqamah is for everyone`, `There is no difference — they are the same thing`],
      correctAnswer: `The adhan calls people to prayer from a distance; the iqamah is shorter and signals prayer is about to begin`,
      explanation: `The adhan calls Muslims from afar to come to prayer. The iqamah is said just before the congregation stands and includes 'Qad qamat al-salah' (the prayer has begun), signalling everyone to line up.`,
    },
    {
      externalId: 'cb6g-u13-q6',
      unitId: unit13.id,
      type: 'TRUE_FALSE',
      questionText: `Haya (modesty) is described in the hadith as a branch of iman (faith).`,
      options: [`True`, `False`],
      correctAnswer: `True`,
      explanation: `"Iman has over seventy branches... and haya (modesty/bashfulness) is a branch of iman." (Bukhari) Modesty in behaviour, dress, and interaction is an essential part of a believer's character.`,
    },
    {
      externalId: 'cb6g-u13-q7',
      unitId: unit13.id,
      type: 'MULTIPLE_CHOICE',
      questionText: `What should be recited after the adhan finishes?`,
      options: [`Surah al-Fatiha`, `Salawat on the Prophet followed by the du'a after adhan`, `Ayat al-Kursi`, `The first kalimah`],
      correctAnswer: `Salawat on the Prophet followed by the du'a after adhan`,
      explanation: `After the adhan ends, one recites salawat (Allahumma salli 'ala Muhammad...) then the specific du'a after adhan. The Prophet said whoever does this will have his intercession on the Day of Judgement.`,
    },
  ];

  // Insert all quiz questions
  for (const q of quizData) {
    await prisma.question.upsert({
      where: { externalId: q.externalId },
      create: {
        externalId: q.externalId,
        unitId: q.unitId,
        type: q.type,
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'MEDIUM',
      },
      update: {
        unitId: q.unitId,
        type: q.type,
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'MEDIUM',
      },
    });
  }
  console.log(`✅ Upserted ${quizData.length} quiz questions`);

  // ══════════════════════════════════════════════
  // FLASHCARDS (22 cards across 13 units)
  // ══════════════════════════════════════════════

  const flashcardData: Array<{
    unitId: string;
    front: string;
    back: string;
  }> = [
    { unitId: unit1.id,
      front: `What is Tahir Mutahhir water?`,
      back: `Pure and purifying water — natural water like rain, river, well or sea. The only water valid for wudu and ghusl.` },
    { unitId: unit1.id,
      front: `What is Najasah Ghalizah?`,
      back: `Heavy impurity (e.g. human urine, stool, flowing blood). No excused amount — must be thoroughly washed away before salah is valid.` },
    { unitId: unit2.id,
      front: `What are the three faraid of ghusl?`,
      back: `1. Madmadah — gargling the entire mouth
2. Istinshaq — nasal rinse (sniff water in and blow out)
3. Full body wash — water must reach every part including hair roots` },
    { unitId: unit2.id,
      front: `What is prohibited during hayd?`,
      back: `Salah (no makeup needed), fasting (must be made up), reciting Quran with tilawah intention, touching the Quran, entering the masjid, and marital intimacy.` },
    { unitId: unit3.id,
      front: `What is sajdah as-sahw?`,
      back: `Prostration of Forgetfulness — two extra sajdahs performed at the end of salah (after the final tashahhud) when a wajib act was omitted by mistake.` },
    { unitId: unit3.id,
      front: `How is janazah salah performed?`,
      back: `4 takbirs, no ruku or sajdah.
1st takbir: Thana
2nd takbir: Salawat on the Prophet
3rd takbir: Du'a for the deceased
4th takbir: Salam on both sides` },
    { unitId: unit4.id,
      front: `What is the hadith "Innamal a'malu bin-niyyat" about?`,
      back: `Actions are judged by their intentions. Everyone receives what they intended. (Bukhari & Muslim) — One of the most fundamental hadith in Islamic law.` },
    { unitId: unit4.id,
      front: `What does smiling at your Muslim brother/sister count as?`,
      back: `Sadaqah (charity). Even a smile is a form of giving in Islam. (Tirmidhi)` },
    { unitId: unit5.id,
      front: `Upon whom is seeking knowledge obligatory?`,
      back: `Every Muslim — male and female. No one is excused from learning the basics of the deen. (Ibn Majah)` },
    { unitId: unit5.id,
      front: `What does the hadith on truthfulness say it leads to?`,
      back: `Truthfulness leads to righteousness (birr), and righteousness leads to Jannah. A truthful person is ultimately recorded with Allah as a Siddiq (most truthful). (Bukhari)` },
    { unitId: unit6.id,
      front: `What does "shamail" mean?`,
      back: `The noble physical and moral characteristics of the Prophet (peace be upon him). Books of shamail compile the companions' descriptions of him.` },
    { unitId: unit6.id,
      front: `What did the Prophet (peace be upon him) say about being best to one's family?`,
      back: `"The best of you is the best to his family, and I am the best of you to my family." (Tirmidhi)` },
    { unitId: unit7.id,
      front: `Why was Abu Bakr given the title al-Siddiq?`,
      back: `Because when the Prophet described al-Isra wal-Miraj, Abu Bakr immediately believed without any doubt, saying: "If he said it, it is true." He was the greatest confirmer of truth.` },
    { unitId: unit8.id,
      front: `What was the iron miracle of Prophet Dawud (peace be upon him)?`,
      back: `Allah made iron soft for him — he could mold and shape it with his bare hands without fire, using this gift to craft chain mail armour for his army. (Quran 34:10-11)` },
    { unitId: unit9.id,
      front: `What was the du'a of Prophet Yunus in the belly of the whale?`,
      back: `"La ilaha illa anta subhanaka inni kuntu min al-zalimin" — There is no god but You; glory be to You; indeed I have been of the wrongdoers. (Quran 21:87)` },
    { unitId: unit10.id,
      front: `What does Ahlus Sunnah wal-Jamaah follow?`,
      back: `Three sources: (1) The Quran, (2) The Sunnah of the Prophet, (3) The way of the Sahabah (companions). They respect all Sahabah and avoid bid'ah.` },
    { unitId: unit11.id,
      front: `What is a mu'jizah?`,
      back: `A supernatural miracle given by Allah to a prophet as proof of their prophethood — it challenges opponents and cannot be replicated. Examples: Musa's staff, the Quran.` },
    { unitId: unit11.id,
      front: `What was the gift given to the Prophet (peace be upon him) on al-Miraj?`,
      back: `The 5 daily prayers — originally commanded as 50, reduced to 5 on the advice of Musa, while retaining the reward of 50 prayers.` },
    { unitId: unit12.id,
      front: `What is ghibah (backbiting)?`,
      back: `Mentioning something about a person that they would dislike, even if true. The Quran compares it to eating the flesh of one's dead brother. (Quran 49:12)` },
    { unitId: unit12.id,
      front: `What is namimah?`,
      back: `Tale-carrying: conveying words from one person to another to cause discord and destroy relationships. The Prophet said the tale-carrier will not enter Jannah. (Bukhari)` },
    { unitId: unit13.id,
      front: `What is hijab according to the majority of scholars?`,
      back: `Covering the entire body except the face and hands in front of non-mahram men. Hijab is also a mindset of modesty in speech, gaze, and interaction — rooted in haya (modesty).` },
    { unitId: unit13.id,
      front: `What is the du'a after adhan?`,
      back: `"Allahumma Rabba hadhihi al-da'wati al-tammah... ati Muhammadan al-wasilata wal-fadilah..." — Asking Allah to grant the Prophet the highest station in Jannah on the Day of Judgement.` },
  ];

  const flashUnitIds = [...new Set(flashcardData.map(f => f.unitId))];
  for (const uid of flashUnitIds) {
    await prisma.flashCard.deleteMany({ where: { unitId: uid } });
  }

  for (const fc of flashcardData) {
    await prisma.flashCard.create({
      data: {
        unitId: fc.unitId,
        courseId: course.id,
        front: fc.front,
        back: fc.back,
        category: 'Vocabulary',
        tags: ['maktab-6g'],
        orderIndex: flashcardData.filter(f => f.unitId === fc.unitId).indexOf(fc),
      },
    });
  }
  console.log(`✅ Created ${flashcardData.length} flashcards`);

  // ══════════════════════════════════════════════
  // ARABIC TERMS (16 terms across units)
  // ══════════════════════════════════════════════

  const arabicTermsData: Array<{
    unitId: string;
    arabicText: string;
    transliteration: string;
    translation: string;
  }> = [
    { unitId: unit1.id,
      arabicText: `طاهر مطهِّر`,
      transliteration: `Tahir Mutahhir`,
      translation: `Pure and purifying water — the only type valid for wudu and ghusl` },
    { unitId: unit1.id,
      arabicText: `نجاسة غليظة`,
      transliteration: `Najasah Ghalizah`,
      translation: `Heavy impurity (e.g. urine, stool, blood) — no excused amount` },
    { unitId: unit1.id,
      arabicText: `نجاسة خفيفة`,
      transliteration: `Najasah Khafifah`,
      translation: `Light impurity — excused if less than one quarter of the garment is affected` },
    { unitId: unit2.id,
      arabicText: `حيض`,
      transliteration: `Hayd`,
      translation: `Menstruation — minimum 3 days, maximum 10 days; prohibits salah, fasting, and entering the masjid` },
    { unitId: unit2.id,
      arabicText: `بلوغ`,
      transliteration: `Bulugh`,
      translation: `Maturity/puberty — when a person becomes religiously accountable for all acts of worship` },
    { unitId: unit2.id,
      arabicText: `غسل`,
      transliteration: `Ghusl`,
      translation: `Full ritual bath — obligatory to remove major ritual impurity (janabah, after hayd)` },
    { unitId: unit3.id,
      arabicText: `واجب`,
      transliteration: `Wajib`,
      translation: `Obligatory act — below fard in obligation level; intentional omission invalidates salah` },
    { unitId: unit3.id,
      arabicText: `سجدة السهو`,
      transliteration: `Sajdat al-Sahw`,
      translation: `Prostration of Forgetfulness — two extra sajdahs at the end of salah to compensate for a forgotten wajib` },
    { unitId: unit4.id,
      arabicText: `نيّة`,
      transliteration: `Niyyah`,
      translation: `Intention — the purpose in the heart behind every action; determines whether acts are worship` },
    { unitId: unit5.id,
      arabicText: `صدق`,
      transliteration: `Sidq`,
      translation: `Truthfulness — a pillar of good character and one of the five essential qualities of all prophets` },
    { unitId: unit6.id,
      arabicText: `شمائل`,
      transliteration: `Shamail`,
      translation: `Noble characteristics — the physical and moral description of the Prophet (peace be upon him)` },
    { unitId: unit7.id,
      arabicText: `الصدّيق`,
      transliteration: `al-Siddiq`,
      translation: `The Truthful One — title given to Abu Bakr for completely believing the account of al-Isra wal-Miraj` },
    { unitId: unit8.id,
      arabicText: `الزبور`,
      transliteration: `al-Zabur`,
      translation: `The Psalms — the holy book revealed to Prophet Dawud (peace be upon him)` },
    { unitId: unit10.id,
      arabicText: `بدعة`,
      transliteration: `Bid'ah`,
      translation: `Innovation in religion — introducing into the deen something not sanctioned by Allah or His Prophet` },
    { unitId: unit11.id,
      arabicText: `معجزة`,
      transliteration: `Mu'jizah`,
      translation: `Miracle — a supernatural sign given by Allah to a prophet as proof of their prophethood` },
    { unitId: unit13.id,
      arabicText: `حجاب`,
      transliteration: `Hijab`,
      translation: `Islamic covering — modest dress for women; also the spirit of modesty (haya) in all conduct` },
  ];

  const termUnitIds = [...new Set(arabicTermsData.map(t => t.unitId))];
  for (const uid of termUnitIds) {
    await prisma.arabicTerm.deleteMany({ where: { unitId: uid } });
  }

  for (const t of arabicTermsData) {
    await prisma.arabicTerm.create({
      data: {
        unitId: t.unitId,
        arabicText: t.arabicText,
        transliteration: t.transliteration,
        translation: t.translation,
      },
    });
  }
  console.log(`✅ Created ${arabicTermsData.length} Arabic terms`);

  console.log('\n🎉 Maktab Coursebook 6 (Girls) seed complete!');
  console.log('   Course: Maktab Coursebook 6 (Girls)');
  console.log('   Units: 13 focused units (was 7 broad units)');
  console.log('   Subjects: Fiqh (3), Ahadith (2), Sirah (2), Tarikh (2), Aqaid (2), Akhlaq (1), Adab (1)');
}

// ──────────────────────────────────────────────
// Standalone execution
// ──────────────────────────────────────────────
async function main() {
  try {
    await seedMaktabCoursebook6Girls();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Maktab Coursebook 6 (Girls):', error);
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
