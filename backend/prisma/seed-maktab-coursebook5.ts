import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 5 — Islamic Curriculum Seed (Restructured)
 * Source: An Nasihah Publications, Age Range: 10–11 years
 *
 * 22 focused units — each covering exactly ONE main topic.
 * Subjects: Fiqh (4), Aḥādīth (4), Sīrah (3), Tārīkh (2),
 *           Aqā'id (3), Akhlāq (3), Ādāb (3)
 */

export async function seedMaktabCoursebook5() {
  console.log('📚 Starting Maktab Coursebook 5 seed...');
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
    where: { slug: 'maktab-coursebook-5' },
    create: {
      slug: 'maktab-coursebook-5',
      title: 'Maktab Coursebook 5',
      description: 'An intermediate Islamic curriculum for learners aged 10–11 years. Covers advanced fiqh (wuḍū\' rulings, tayammum, ṣalāh sunan, masbūq rules, qaḍā\', \'Īd ṣalāh, \'umrah, ḥajj, and ziyārah), key aḥādīth on promises, the tongue, ghībah, intoxicants, and good character, sīrah of the Treaty of Ḥudaybiyah, conquest of Makkah, and the farewell sermon, tārīkh of Mūsā and \'Īsā عليهم السلام, aqā\'id on death, the grave, Jannah, Jahannam, A\'rāf, and al-Qadr, akhlāq on mashwarah, ṣabr, keeping ties, gifts, and dhikr, and ādāb of ghusl, social interaction, writing, miswāk, and visiting the sick. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 5',
      description: 'An intermediate Islamic curriculum for learners aged 10–11 years. Covers advanced fiqh (wuḍū\' rulings, tayammum, ṣalāh sunan, masbūq rules, qaḍā\', \'Īd ṣalāh, \'umrah, ḥajj, and ziyārah), key aḥādīth on promises, the tongue, ghībah, intoxicants, and good character, sīrah of the Treaty of Ḥudaybiyah, conquest of Makkah, and the farewell sermon, tārīkh of Mūsā and \'Īsā عليهم السلام, aqā\'id on death, the grave, Jannah, Jahannam, A\'rāf, and al-Qadr, akhlāq on mashwarah, ṣabr, keeping ties, gifts, and dhikr, and ādāb of ghusl, social interaction, writing, miswāk, and visiting the sick. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // CLEANUP: Remove deprecated broad-subject units
  // (old 7-unit schema replaced by 22 focused units)
  // ──────────────────────────────────────────────
  const deprecatedSlugs = [
    'maktab-5-fiqh',
    'maktab-5-ahadith',
    'maktab-5-sirah',
    'maktab-5-tarikh',
    'maktab-5-aqaid',
    'maktab-5-akhlaq',
    'maktab-5-adab',
  ];
  const deleted = await prisma.unit.deleteMany({
    where: { courseId: course.id, slug: { in: deprecatedSlugs } },
  });
  if (deleted.count > 0) {
    console.log(`🗑️  Removed ${deleted.count} deprecated broad-subject unit(s)`);
  }

  // ══════════════════════════════════════════════
  // FIQH UNITS (4 focused units)
  // ══════════════════════════════════════════════

  // ──────────────────────────────────────────────
  // UNIT 1: FIQH — Wuḍū'
  // ──────────────────────────────────────────────

  const wuduContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to list and explain the four farā'iḍ of wuḍū', describe the sunan and makrūhāt, and identify the nawāqiḍ (nullifiers) of wuḍū'.</p>

<h2>Wuḍū' — Detailed Rulings</h2>

<h3>The Four Farā'iḍ of Wuḍū'</h3>
<p>The farā'iḍ are the obligatory acts without which wuḍū' is not valid:</p>
<ol>
  <li><strong>Washing the face</strong> — from the hairline to below the chin, and from one earlobe to the other.</li>
  <li><strong>Washing both arms</strong> — including the elbows, from the fingertips to and including the elbows.</li>
  <li><strong>Masḥ of a quarter of the head</strong> — wiping at least a quarter of the head with wet hands.</li>
  <li><strong>Washing both feet</strong> — including the ankles, ensuring water reaches between the toes.</li>
</ol>

<h3>Sunan of Wuḍū'</h3>
<p>The sunan are acts that are recommended and rewarded, but wuḍū' remains valid without them:</p>
<ul>
  <li>Saying Bismillāh at the beginning.</li>
  <li>Washing both hands up to the wrists three times.</li>
  <li>Using a miswāk or brushing the teeth.</li>
  <li>Rinsing the mouth (maḍmaḍah) three times.</li>
  <li>Sniffing water into the nose (istinshāq) three times.</li>
  <li>Passing fingers through the beard (takhlīl).</li>
  <li>Washing each limb three times.</li>
  <li>Performing masḥ of the entire head.</li>
  <li>Masḥ of the ears.</li>
  <li>Maintaining the correct order (tartīb) and continuity (muwālāh).</li>
</ul>

<h3>Makrūhāt of Wuḍū'</h3>
<p>These are disliked actions that reduce the reward of wuḍū':</p>
<ul>
  <li>Wasting water (isrāf) — using more than necessary.</li>
  <li>Using too little water so that areas are not properly washed.</li>
  <li>Splashing water on the face instead of washing gently.</li>
  <li>Talking about worldly matters during wuḍū'.</li>
  <li>Performing wuḍū' in a dirty place.</li>
</ul>

<h3>Nawāqiḍ al-Wuḍū' — Things That Break Wuḍū'</h3>
<p>Wuḍū' is broken by the following:</p>
<ul>
  <li>Anything exiting from the front or back passage (urine, stool, wind).</li>
  <li>Blood, pus, or any fluid that flows from a wound beyond its point of exit.</li>
  <li>Vomiting a mouthful.</li>
  <li>Sleeping while lying down or leaning (in a position where the body is unsupported).</li>
  <li>Losing consciousness or becoming intoxicated.</li>
  <li>Laughing aloud during ṣalāh (for an adult).</li>
</ul>
`.trim();

  const unitWudu = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-fiqh-wudu' } },
    create: {
      slug: 'maktab-5-fiqh-wudu',
      courseId: course.id,
      orderIndex: 1,
      title: 'Fiqh — Wuḍū\': Farā\'iḍ, Sunan, Makrūhāt & Nawāqiḍ',
      description: 'The four obligatory acts (farā\'iḍ) of wuḍū\', the recommended acts (sunan), the disliked acts (makrūhāt), and the things that nullify wuḍū\' (nawāqiḍ).',
      content: wuduContent,
    },
    update: {
      title: 'Fiqh — Wuḍū\': Farā\'iḍ, Sunan, Makrūhāt & Nawāqiḍ',
      description: 'The four obligatory acts (farā\'iḍ) of wuḍū\', the recommended acts (sunan), the disliked acts (makrūhāt), and the things that nullify wuḍū\' (nawāqiḍ).',
      content: wuduContent,
    },
  });

  console.log('✅ Unit 1:', unitWudu.title);

  // ──────────────────────────────────────────────
  // UNIT 2: FIQH — Tayammum
  // ──────────────────────────────────────────────

  const tayammumContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain when tayammum is permissible, how to perform it, and what breaks it.</p>

<h2>Tayammum — Dry Ablution</h2>

<h3>When Is Tayammum Permissible?</h3>
<p>Tayammum is permitted when:</p>
<ul>
  <li>Water is not available within approximately one mile in any direction.</li>
  <li>Using water would cause harm due to illness or extreme cold.</li>
  <li>There is water nearby but one cannot reach it due to danger (e.g., an enemy or wild animal).</li>
</ul>

<h3>How to Perform Tayammum</h3>
<ol>
  <li>Make the intention for tayammum.</li>
  <li>Strike both hands on clean earth, dust, sand, or stone.</li>
  <li>Blow off excess dust and wipe the entire face.</li>
  <li>Strike the hands again and wipe both arms up to and including the elbows.</li>
</ol>

<h3>What Breaks Tayammum</h3>
<p>Everything that breaks wuḍū' also breaks tayammum. Additionally, tayammum is broken when water becomes available (if the reason for tayammum was unavailability of water).</p>
`.trim();

  const unitTayammum = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-fiqh-tayammum' } },
    create: {
      slug: 'maktab-5-fiqh-tayammum',
      courseId: course.id,
      orderIndex: 2,
      title: 'Fiqh — Tayammum: When, How & What Breaks It',
      description: 'When tayammum (dry ablution) is permissible, how to perform it correctly using clean earth or dust, and what nullifies it.',
      content: tayammumContent,
    },
    update: {
      title: 'Fiqh — Tayammum: When, How & What Breaks It',
      description: 'When tayammum (dry ablution) is permissible, how to perform it correctly using clean earth or dust, and what nullifies it.',
      content: tayammumContent,
    },
  });

  console.log('✅ Unit 2:', unitTayammum.title);

  // ──────────────────────────────────────────────
  // UNIT 3: FIQH — Advanced Ṣalāh
  // ──────────────────────────────────────────────

  const salahContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe the sunan and mustaḥabbāt of ṣalāh, explain the rules for a masbūq (latecomer), understand qaḍā' prayers, and describe the method of \'Īd ṣalāh.</p>

<h2>Ṣalāh — Sunan and Mustaḥabbāt</h2>
<p>Beyond the farā'iḍ and wājibāt, there are many sunan and mustaḥabbāt (recommended acts) that beautify the prayer:</p>
<ul>
  <li>Raising the hands (raf' al-yadayn) to the earlobes when saying takbīr al-taḥrīmah.</li>
  <li>Placing the right hand over the left below the navel.</li>
  <li>Reciting the thanā' (opening supplication) after takbīr al-taḥrīmah.</li>
  <li>Saying ta'awwudh and tasmiyah before al-Fātiḥah.</li>
  <li>Saying Āmīn quietly after al-Fātiḥah.</li>
  <li>Reciting a sūrah or at least three short āyāt after al-Fātiḥah in the first two rak'āt.</li>
  <li>Looking at the place of sajdah during qiyām.</li>
  <li>Keeping the back straight in rukū' with the head level.</li>
  <li>Saying SubḥānAllāh at least three times in rukū' and sajdah.</li>
</ul>

<h2>The Masbūq — Latecomer in Congregational Prayer</h2>
<p>A masbūq is someone who arrives late to the congregational prayer and misses one or more rak'āt with the imām.</p>
<h3>Key Rules:</h3>
<ul>
  <li>The masbūq should join the imām in whatever position he finds him.</li>
  <li>If he joins in rukū' and performs the rukū' with the imām, he has caught that rak'ah.</li>
  <li>If he misses the rukū', that rak'ah is not counted.</li>
  <li>After the imām makes salām, the masbūq stands up to complete the missed rak'āt.</li>
  <li>For the missed rak'āt, he follows the order of his own ṣalāh (reciting al-Fātiḥah and a sūrah as appropriate).</li>
</ul>

<h2>Qaḍā' Prayers — Making Up Missed Ṣalāh</h2>
<p>If a person misses a farḍ ṣalāh, it is obligatory to make it up as soon as possible. This is called qaḍā'.</p>
<ul>
  <li>It is sinful to delay a farḍ ṣalāh beyond its time without a valid excuse.</li>
  <li>The missed prayer remains as a debt upon the person until it is made up.</li>
  <li>One should make the intention that they are praying the qaḍā' of a specific prayer (e.g., "qaḍā' of Fajr").</li>
  <li>Qaḍā' prayers are prayed in the same way as the original prayer, but the sunan rawātib are not made up.</li>
</ul>

<h2>'Īd Ṣalāh</h2>
<p>'Īd ṣalāh is wājib upon every adult Muslim male who is required to pray Jumu'ah. It is performed on the mornings of \'Īd al-Fiṭr (1st Shawwāl) and \'Īd al-Aḍḥā (10th Dhul Ḥijjah).</p>
<h3>Method of \'Īd Ṣalāh:</h3>
<ol>
  <li>Make the intention for \'Īd ṣalāh with the imām.</li>
  <li>Say takbīr al-taḥrīmah and fold the hands.</li>
  <li>The imām says three extra takbīrāt — raise the hands each time and drop them to the sides. After the third, fold the hands.</li>
  <li>The imām recites al-Fātiḥah and a sūrah, then perform rukū' and sajdah as normal.</li>
  <li>In the second rak'ah, the imām recites al-Fātiḥah and a sūrah first, then says three extra takbīrāt before going into rukū'.</li>
  <li>Complete the ṣalāh as normal and listen to the khuṭbah (sermon) after the prayer.</li>
</ol>
`.trim();

  const unitSalah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-fiqh-salah' } },
    create: {
      slug: 'maktab-5-fiqh-salah',
      courseId: course.id,
      orderIndex: 3,
      title: 'Fiqh — Advanced Ṣalāh: Sunan, Masbūq, Qaḍā\' & \'Īd',
      description: 'The sunan and mustaḥabbāt of ṣalāh, rules for the masbūq (latecomer), making up missed prayers (qaḍā\'), and the method of \'Īd ṣalāh.',
      content: salahContent,
    },
    update: {
      title: 'Fiqh — Advanced Ṣalāh: Sunan, Masbūq, Qaḍā\' & \'Īd',
      description: 'The sunan and mustaḥabbāt of ṣalāh, rules for the masbūq (latecomer), making up missed prayers (qaḍā\'), and the method of \'Īd ṣalāh.',
      content: salahContent,
    },
  });

  console.log('✅ Unit 3:', unitSalah.title);

  // ──────────────────────────────────────────────
  // UNIT 4: FIQH — \'Umrah, Ḥajj & Ziyārah
  // ──────────────────────────────────────────────

  const hajjContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to outline the steps of 'umrah, describe the key rituals of ḥajj by day, and appreciate the significance of ziyārah of Madīnah al-Munawwarah.</p>

<h2>'Umrah — The Lesser Pilgrimage</h2>
<p>'Umrah can be performed at any time of the year. Its steps are:</p>
<ol>
  <li><strong>Iḥrām:</strong> Enter the state of iḥrām at the mīqāt (designated boundary). Make intention and recite the talbiyah: "Labbayk Allāhumma labbayk..."</li>
  <li><strong>Ṭawāf:</strong> Perform ṭawāf of the Ka'bah — circle the Ka'bah seven times in an anti-clockwise direction, starting from the Black Stone (al-Ḥajar al-Aswad).</li>
  <li><strong>Ṣalāh of Ṭawāf:</strong> Pray two rak'āt behind Maqām Ibrāhīm.</li>
  <li><strong>Sa'ī:</strong> Walk seven times between the hills of Ṣafā and Marwah.</li>
  <li><strong>Ḥalq or Qaṣr:</strong> Shave the head (ḥalq) or trim the hair (qaṣr) to exit the state of iḥrām.</li>
</ol>
<p class="arabic" dir="rtl" lang="ar">لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ</p>
<p><em>Labbayk Allāhumma labbayk. Labbayka lā sharīka laka labbayk. Inna al-ḥamda wa al-ni'mata laka wa al-mulk. Lā sharīka lak.</em></p>

<h2>Ḥajj — The Greater Pilgrimage</h2>
<p>Ḥajj is the fifth pillar of Islam, obligatory once in a lifetime for those who are able. It takes place from the 8th to the 13th of Dhul Ḥijjah.</p>

<h3>The Days of Ḥajj</h3>
<h4>8th Dhul Ḥijjah — Yawm al-Tarwiyah</h4>
<p>The pilgrim enters iḥrām for ḥajj and proceeds to Minā, where they spend the night praying and making du'ā'.</p>

<h4>9th Dhul Ḥijjah — Yawm \'Arafah</h4>
<p>The most important day of Ḥajj. The pilgrim stands at the plain of \'Arafah from after ẓuhr until sunset, making du'ā' and seeking forgiveness. Without the wuqūf at \'Arafah, the Ḥajj is invalid.</p>
<p>After sunset, the pilgrim proceeds to Muzdalifah, where they pray Maghrib and 'Ishā' combined, collect pebbles, and spend the night under the open sky.</p>

<h4>10th Dhul Ḥijjah — Yawm al-Naḥr ('Īd al-Aḍḥā)</h4>
<p>The pilgrim performs the following in order:</p>
<ol>
  <li><strong>Ramī:</strong> Pelting the large jamarah (Jamarah al-\'Aqabah) with seven pebbles.</li>
  <li><strong>Qurbānī (animal sacrifice):</strong> A sheep, goat, or share of a cow/camel.</li>
  <li><strong>Ḥalq or Qaṣr:</strong> Shaving or trimming the hair.</li>
  <li><strong>Ṭawāf al-Ziyārah:</strong> The obligatory ṭawāf of the Ka'bah, also called Ṭawāf al-Ifāḍah.</li>
</ol>

<h4>11th–13th Dhul Ḥijjah — Ayyām al-Tashrīq</h4>
<p>The pilgrim stays in Minā and pelts all three jamarāt (small, medium, large) each day with seven pebbles each. One may leave after the 12th if they depart before sunset.</p>

<h3>Ṭawāf al-Wadā'</h3>
<p>Before leaving Makkah, the pilgrim performs a farewell ṭawāf (ṭawāf al-wadā') as a final act of worship.</p>

<h2>Ziyārah of Madīnah al-Munawwarah</h2>
<p>Visiting Madīnah and the Masjid of Rasūlullāh ﷺ (al-Masjid al-Nabawī) is a virtuous and blessed act, though it is not a pillar of Ḥajj or 'umrah.</p>
<ul>
  <li>Pray in al-Masjid al-Nabawī — one prayer there equals one thousand prayers elsewhere.</li>
  <li>Visit the Rawḍah — the area between the Prophet's ﷺ minbar and his blessed grave.</li>
  <li>Send salām upon Rasūlullāh ﷺ and upon Abū Bakr and 'Umar رضي الله عنهما.</li>
  <li>Visit Jannat al-Baqī' (the graveyard of many Companions).</li>
  <li>Visit Masjid Qubā' — the first masjid in Islam.</li>
</ul>
`.trim();

  const unitHajj = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-fiqh-hajj' } },
    create: {
      slug: 'maktab-5-fiqh-hajj',
      courseId: course.id,
      orderIndex: 4,
      title: 'Fiqh — \'Umrah, Ḥajj & Ziyārah of Madīnah',
      description: 'The lesser pilgrimage (\'umrah): iḥrām, ṭawāf, sa\'ī, ḥalq/qaṣr. The greater pilgrimage (ḥajj): the days of Minā, \'Arafah, Muzdalifah, and Makkah. Visiting Madīnah al-Munawwarah.',
      content: hajjContent,
    },
    update: {
      title: 'Fiqh — \'Umrah, Ḥajj & Ziyārah of Madīnah',
      description: 'The lesser pilgrimage (\'umrah): iḥrām, ṭawāf, sa\'ī, ḥalq/qaṣr. The greater pilgrimage (ḥajj): the days of Minā, \'Arafah, Muzdalifah, and Makkah. Visiting Madīnah al-Munawwarah.',
      content: hajjContent,
    },
  });

  console.log('✅ Unit 4:', unitHajj.title);

  // ══════════════════════════════════════════════
  // AḤĀDĪTH UNITS (4 focused units)
  // ══════════════════════════════════════════════

  // ──────────────────────────────────────────────
  // UNIT 5: AḤĀDĪTH — Signs of the Munāfiq & Promises
  // ──────────────────────────────────────────────

  const munafiqContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to recite and explain the ḥadīth on the signs of the munāfiq (hypocrite) and understand the importance of keeping promises and trusts.</p>

<h2>Ḥadīth: Signs of a Hypocrite — Keeping Promises</h2>
<p class="arabic" dir="rtl" lang="ar">آيَةُ الْمُنَافِقِ ثَلَاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ</p>
<p><em>"The signs of a hypocrite are three: when he speaks, he lies; when he makes a promise, he breaks it; and when he is entrusted, he betrays the trust."</em> (Bukhārī & Muslim)</p>
<p>This ḥadīth warns us about three dangerous traits. A Muslim must always speak the truth, keep promises, and be trustworthy. Having these bad traits is a sign of hypocrisy (nifāq).</p>

<h3>Lessons from This Ḥadīth</h3>
<ul>
  <li><strong>Speaking truthfully:</strong> A Muslim never lies, even in jest. Truthfulness builds trust in relationships.</li>
  <li><strong>Keeping promises:</strong> Once a promise is made, it must be kept. Breaking promises is a sign of weakness in faith.</li>
  <li><strong>Honoring trusts (amānah):</strong> When something is entrusted to us — money, secrets, responsibilities — we must guard it faithfully.</li>
</ul>
<p>These three traits can coexist in a person with otherwise outward displays of faith. The Prophet ﷺ warned that a person could have all the signs of a hypocrite in their conduct while claiming to be a believer. A Muslim must work hard to eradicate these traits.</p>
`.trim();

  const unitMunafiq = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-ahadith-munafiq' } },
    create: {
      slug: 'maktab-5-ahadith-munafiq',
      courseId: course.id,
      orderIndex: 5,
      title: 'Aḥādīth — Signs of the Munāfiq & Keeping Promises',
      description: 'The ḥadīth on the three signs of a hypocrite (munāfiq): lying when speaking, breaking promises, and betraying trusts. Lessons on truthfulness and amānah.',
      content: munafiqContent,
    },
    update: {
      title: 'Aḥādīth — Signs of the Munāfiq & Keeping Promises',
      description: 'The ḥadīth on the three signs of a hypocrite (munāfiq): lying when speaking, breaking promises, and betraying trusts. Lessons on truthfulness and amānah.',
      content: munafiqContent,
    },
  });

  console.log('✅ Unit 5:', unitMunafiq.title);

  // ──────────────────────────────────────────────
  // UNIT 6: AḤĀDĪTH — The Tongue, Ghībah & Social Speech
  // ──────────────────────────────────────────────

  const tongueContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the danger of the tongue, define ghībah (backbiting) and understand its prohibition, and know the correct approach to speech according to the Prophet ﷺ.</p>

<h2>Ḥadīth 1: Dangers of the Tongue</h2>
<p class="arabic" dir="rtl" lang="ar">مَنْ يَضْمَنْ لِي مَا بَيْنَ لَحْيَيْهِ وَمَا بَيْنَ رِجْلَيْهِ أَضْمَنْ لَهُ الْجَنَّةَ</p>
<p><em>"Whoever guarantees me (the correct use of) what is between his jaws (tongue) and what is between his legs, I guarantee him Jannah."</em> (Bukhārī)</p>
<p>The tongue and the private parts are the two things that lead most people into sin. Guarding them is a key to entering Jannah.</p>

<h2>Ḥadīth 2: Ghībah (Backbiting) — Its Definition</h2>
<p class="arabic" dir="rtl" lang="ar">أَتَدْرُونَ مَا الْغِيبَةُ؟ قَالُوا: اللَّهُ وَرَسُولُهُ أَعْلَمُ. قَالَ: ذِكْرُكَ أَخَاكَ بِمَا يَكْرَهُ</p>
<p><em>"Do you know what ghībah (backbiting) is?" They said: "Allāh and His Messenger know best." He said: "It is mentioning your brother with what he dislikes."</em> (Muslim)</p>
<p>When asked what if it is true, the Prophet ﷺ said: "If what you say is true, you have backbitten him; if it is not true, you have slandered him (buhtān)." Ghībah is a major sin.</p>

<h2>Ḥadīth 3: Not Harming the Neighbour</h2>
<p class="arabic" dir="rtl" lang="ar">مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلَا يُؤْذِ جَارَهُ</p>
<p><em>"Whoever believes in Allāh and the Last Day, let him not harm his neighbour."</em> (Bukhārī & Muslim)</p>
<p>True faith should manifest in treating others — especially neighbours — with kindness and avoiding any form of harm.</p>

<h2>Ḥadīth 4: Speak Good or Be Silent</h2>
<p class="arabic" dir="rtl" lang="ar">مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ</p>
<p><em>"Whoever believes in Allāh and the Last Day, let him speak good or remain silent."</em> (Bukhārī & Muslim)</p>
<p>Before speaking, a Muslim should consider whether their words are beneficial. If not, silence is better. This teaches self-discipline and mindfulness in speech.</p>

<h2>Ḥadīth 5: Avoiding Suspicion (Ẓann)</h2>
<p class="arabic" dir="rtl" lang="ar">إِيَّاكُمْ وَالظَّنَّ، فَإِنَّ الظَّنَّ أَكْذَبُ الْحَدِيثِ</p>
<p><em>"Beware of suspicion, for suspicion is the most untruthful of speech."</em> (Bukhārī & Muslim)</p>
<p>Making assumptions about others without evidence is a sin. A Muslim should think well of others (ḥusn al-ẓann) and avoid jumping to conclusions about people's intentions.</p>

<h2>Ḥadīth 6: The True Muslim</h2>
<p class="arabic" dir="rtl" lang="ar">الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ</p>
<p><em>"The (true) Muslim is one from whose tongue and hand other Muslims are safe."</em> (Bukhārī & Muslim)</p>
<p>A true Muslim does not harm others — neither through speech (lies, backbiting, insults) nor through physical actions. This ḥadīth defines the essence of being Muslim: bringing safety and peace to those around you.</p>
`.trim();

  const unitTongue = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-ahadith-tongue' } },
    create: {
      slug: 'maktab-5-ahadith-tongue',
      courseId: course.id,
      orderIndex: 6,
      title: 'Aḥādīth — The Tongue, Ghībah & Social Speech',
      description: 'Six aḥādīth on guarding the tongue, the sin of ghībah (backbiting), not harming neighbours, speaking good or staying silent, avoiding suspicion, and the true Muslim.',
      content: tongueContent,
    },
    update: {
      title: 'Aḥādīth — The Tongue, Ghībah & Social Speech',
      description: 'Six aḥādīth on guarding the tongue, the sin of ghībah (backbiting), not harming neighbours, speaking good or staying silent, avoiding suspicion, and the true Muslim.',
      content: tongueContent,
    },
  });

  console.log('✅ Unit 6:', unitTongue.title);

  // ──────────────────────────────────────────────
  // UNIT 7: AḤĀDĪTH — Prohibition of Intoxicants
  // ──────────────────────────────────────────────

  const intoxicantsContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to recite the ḥadīth on intoxicants, explain why all intoxicants are ḥarām, and understand the ruling on small and large quantities.</p>

<h2>Ḥadīth: Prohibition of Intoxicants</h2>
<p class="arabic" dir="rtl" lang="ar">كُلُّ مُسْكِرٍ خَمْرٌ وَكُلُّ مُسْكِرٍ حَرَامٌ</p>
<p><em>"Every intoxicant is khamr, and every intoxicant is ḥarām."</em> (Muslim)</p>
<p>This ḥadīth establishes that any substance that intoxicates is prohibited, whether it is alcohol, drugs, or any other substance. What intoxicates in large amounts is ḥarām even in small amounts.</p>

<h3>Key Rulings from This Ḥadīth</h3>
<ul>
  <li>The word "khamr" in Arabic originally referred to grape wine. The ḥadīth expands the definition to cover ANY substance that intoxicates.</li>
  <li>This includes beer, spirits, drugs, and any substance that impairs the mind and senses.</li>
  <li>Even a small amount is ḥarām if the large amount intoxicates — there is no "permissible" threshold.</li>
  <li>Manufacturing, selling, buying, or serving intoxicants is also ḥarām.</li>
</ul>

<h3>Wisdom Behind the Prohibition</h3>
<ul>
  <li>Intoxicants destroy the intellect, which Allāh has honoured man with.</li>
  <li>They lead to neglect of ṣalāh and other obligations.</li>
  <li>They break up families and societies through addiction and violence.</li>
  <li>The Qur'ān calls them "the work of Shayṭān" (Qur'ān 5:90).</li>
</ul>
`.trim();

  const unitIntoxicants = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-ahadith-intoxicants' } },
    create: {
      slug: 'maktab-5-ahadith-intoxicants',
      courseId: course.id,
      orderIndex: 7,
      title: 'Aḥādīth — Prohibition of Intoxicants (Khamr)',
      description: 'The ḥadīth declaring every intoxicant to be khamr and ḥarām. Understanding why all intoxicants are forbidden regardless of quantity.',
      content: intoxicantsContent,
    },
    update: {
      title: 'Aḥādīth — Prohibition of Intoxicants (Khamr)',
      description: 'The ḥadīth declaring every intoxicant to be khamr and ḥarām. Understanding why all intoxicants are forbidden regardless of quantity.',
      content: intoxicantsContent,
    },
  });

  console.log('✅ Unit 7:', unitIntoxicants.title);

  // ──────────────────────────────────────────────
  // UNIT 8: AḤĀDĪTH — Good Character (Ḥusn al-Khuluq)
  // ──────────────────────────────────────────────

  const characterContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to recite the aḥādīth on good character, explain the link between faith and character, and understand why good character is prized so highly in Islam.</p>

<h2>Ḥadīth 1: Good Character and Faith</h2>
<p class="arabic" dir="rtl" lang="ar">أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا</p>
<p><em>"The most complete of the believers in faith is the best of them in character."</em> (Tirmidhī)</p>
<p>Good akhlāq (character) is a sign of strong faith. The Prophet ﷺ was sent to perfect good character, and it will be the heaviest thing on the mīzān on the Day of Judgement.</p>

<h2>Ḥadīth 2: The Best of You</h2>
<p class="arabic" dir="rtl" lang="ar">خَيْرُكُمْ أَحْسَنُكُمْ خُلُقًا</p>
<p><em>"The best of you are those with the best character."</em> (Bukhārī)</p>
<p>The Prophet ﷺ repeatedly emphasized that good character is the benchmark of a true believer. A Muslim should strive to be kind, patient, generous, and truthful in all dealings.</p>

<h3>What Is Good Character?</h3>
<ul>
  <li><strong>Kindness (rifq):</strong> Being gentle with people in speech and action.</li>
  <li><strong>Truthfulness (ṣidq):</strong> Always speaking the truth, even when difficult.</li>
  <li><strong>Generosity (karam):</strong> Giving freely without expecting return.</li>
  <li><strong>Patience (ṣabr):</strong> Enduring hardship without complaint.</li>
  <li><strong>Humility (tawāḍu'):</strong> Not being arrogant about one's qualities or achievements.</li>
  <li><strong>Forgiveness ('afw):</strong> Letting go of grudges and forgiving those who wrong you.</li>
</ul>

<h3>The Reward of Good Character</h3>
<p>Good character earns closeness to the Prophet ﷺ in Jannah. The Prophet ﷺ said: "The most beloved of you to me, and the closest of you to me in the Hereafter, are those best in character." Good character also earns the love of Allāh and the respect of people in this world.</p>
`.trim();

  const unitCharacter = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-ahadith-character' } },
    create: {
      slug: 'maktab-5-ahadith-character',
      courseId: course.id,
      orderIndex: 8,
      title: 'Aḥādīth — Good Character (Ḥusn al-Khuluq)',
      description: 'Two aḥādīth on the link between faith and good character — "the most complete in faith is the best in character" — and what constitutes excellent Islamic conduct.',
      content: characterContent,
    },
    update: {
      title: 'Aḥādīth — Good Character (Ḥusn al-Khuluq)',
      description: 'Two aḥādīth on the link between faith and good character — "the most complete in faith is the best in character" — and what constitutes excellent Islamic conduct.',
      content: characterContent,
    },
  });

  console.log('✅ Unit 8:', unitCharacter.title);

  // ══════════════════════════════════════════════
  // SĪRAH UNITS (3 focused units)
  // ══════════════════════════════════════════════

  // ──────────────────────────────────────────────
  // UNIT 9: SĪRAH — Treaty of Ḥudaybiyah
  // ──────────────────────────────────────────────

  const hudaybiyahContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe the events leading to the Treaty of Ḥudaybiyah, explain its key terms, and understand why Allāh called it a "clear victory."</p>

<h2>The Treaty of Ḥudaybiyah (6 AH)</h2>

<h3>Background</h3>
<p>In the 6th year after Hijrah, the Prophet ﷺ set out from Madīnah with approximately 1,400 Companions with the intention of performing 'umrah. They were in the state of iḥrām and carried no weapons of war — only travel swords.</p>
<p>When the Quraysh learned of their approach, they sent forces to prevent the Muslims from entering Makkah. The Muslims camped at a place called Ḥudaybiyah, on the outskirts of Makkah.</p>

<h3>Bay\'ah al-Riḍwān — The Pledge Under the Tree</h3>
<p>When a rumour spread that the Muslim envoy 'Uthmān ibn 'Affān رضي الله عنه had been killed by the Quraysh, the Prophet ﷺ called the Companions to pledge their loyalty. They pledged under a tree, ready to defend Islam with their lives. Allāh expressed His pleasure with them in the Qur'ān:</p>
<p class="arabic" dir="rtl" lang="ar">لَقَدْ رَضِيَ اللَّهُ عَنِ الْمُؤْمِنِينَ إِذْ يُبَايِعُونَكَ تَحْتَ الشَّجَرَةِ</p>
<p><em>"Indeed, Allāh was pleased with the believers when they gave you the pledge under the tree."</em> (Qur'ān 48:18)</p>

<h3>Terms of the Treaty</h3>
<ul>
  <li>A ten-year truce (ceasefire) between the Muslims and the Quraysh.</li>
  <li>The Muslims would return that year without performing 'umrah and come back the following year.</li>
  <li>Any person from the Quraysh who went to the Muslims without permission would be returned, but any Muslim who went to the Quraysh would not be returned.</li>
  <li>Other Arab tribes were free to ally with either side.</li>
</ul>

<h3>Wisdom Behind the Treaty</h3>
<p>Although the terms seemed unfavourable, the treaty was a strategic victory:</p>
<ul>
  <li>It gave the Muslims peace to focus on da'wah (calling people to Islam).</li>
  <li>Many people accepted Islam during the truce period — more than all the previous years combined.</li>
  <li>It was recognized by Allāh as a "clear victory" (fatḥ mubīn) in Sūrah al-Fatḥ (Chapter 48).</li>
</ul>
`.trim();

  const unitHudaybiyah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-sirah-hudaybiyah' } },
    create: {
      slug: 'maktab-5-sirah-hudaybiyah',
      courseId: course.id,
      orderIndex: 9,
      title: 'Sīrah — Treaty of Ḥudaybiyah (6 AH)',
      description: 'The journey for \'umrah in 6 AH, the Bay\'ah al-Riḍwān (pledge under the tree), the terms of the Treaty of Ḥudaybiyah, and its wisdom as a "clear victory."',
      content: hudaybiyahContent,
    },
    update: {
      title: 'Sīrah — Treaty of Ḥudaybiyah (6 AH)',
      description: 'The journey for \'umrah in 6 AH, the Bay\'ah al-Riḍwān (pledge under the tree), the terms of the Treaty of Ḥudaybiyah, and its wisdom as a "clear victory."',
      content: hudaybiyahContent,
    },
  });

  console.log('✅ Unit 9:', unitHudaybiyah.title);

  // ──────────────────────────────────────────────
  // UNIT 10: SĪRAH — Conquest of Makkah (8 AH)
  // ──────────────────────────────────────────────

  const fathContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to narrate the key events of the conquest of Makkah (Fatḥ Makkah) and describe the mercy and forgiveness shown by the Prophet ﷺ.</p>

<h2>The Conquest of Makkah — Fatḥ Makkah (8 AH)</h2>

<h3>Cause</h3>
<p>The Quraysh violated the Treaty of Ḥudaybiyah by attacking Banū Khuzā'ah, who were allies of the Muslims. This breach gave the Muslims the right to respond.</p>

<h3>The March to Makkah</h3>
<p>The Prophet ﷺ set out from Madīnah with an army of approximately 10,000 Muslims. The march was conducted with discipline and discretion. Abū Sufyān, the leader of the Quraysh, came out to meet the army and accepted Islam.</p>

<h3>Entry into Makkah</h3>
<p>The Prophet ﷺ entered Makkah with humility, his head bowed in gratitude to Allāh. There was almost no bloodshed — the conquest was largely peaceful.</p>

<h3>Forgiveness of the Quraysh</h3>
<p>The Prophet ﷺ gathered the Quraysh at the Ka'bah and asked them: "What do you think I will do with you?" They replied: "You are a noble brother, the son of a noble brother." The Prophet ﷺ declared:</p>
<p class="arabic" dir="rtl" lang="ar">اِذْهَبُوا فَأَنْتُمُ الطُّلَقَاءُ</p>
<p><em>"Go, you are all free!"</em></p>
<p>This act of forgiveness — after years of persecution, torture, and war — demonstrated the unparalleled mercy of the Prophet ﷺ.</p>

<h3>Destruction of the Idols</h3>
<p>The Prophet ﷺ entered the Ka'bah and destroyed the 360 idols that had been placed in and around it. As he struck each idol, he recited:</p>
<p class="arabic" dir="rtl" lang="ar">جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ إِنَّ الْبَاطِلَ كَانَ زَهُوقًا</p>
<p><em>"Truth has come, and falsehood has vanished. Indeed, falsehood is bound to vanish."</em> (Qur'ān 17:81)</p>
`.trim();

  const unitFath = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-sirah-fath' } },
    create: {
      slug: 'maktab-5-sirah-fath',
      courseId: course.id,
      orderIndex: 10,
      title: 'Sīrah — Conquest of Makkah (8 AH)',
      description: 'The march to Makkah with 10,000 Muslims in 8 AH, the peaceful entry, the forgiveness of the Quraysh ("Go, you are all free"), and the destruction of the idols.',
      content: fathContent,
    },
    update: {
      title: 'Sīrah — Conquest of Makkah (8 AH)',
      description: 'The march to Makkah with 10,000 Muslims in 8 AH, the peaceful entry, the forgiveness of the Quraysh ("Go, you are all free"), and the destruction of the idols.',
      content: fathContent,
    },
  });

  console.log('✅ Unit 10:', unitFath.title);

  // ──────────────────────────────────────────────
  // UNIT 11: SĪRAH — Farewell Ḥajj & Sermon (10 AH)
  // ──────────────────────────────────────────────

  const farewellContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to outline the main messages of the Farewell Sermon (Khuṭbah al-Wadā') and understand the significance of the verse completing the dīn.</p>

<h2>The Farewell Ḥajj and Sermon (10 AH)</h2>

<h3>The Farewell Ḥajj</h3>
<p>In the 10th year after Hijrah, the Prophet ﷺ performed his only ḥajj, known as Ḥajjat al-Wadā' (the Farewell Ḥajj). Over 100,000 Companions accompanied him.</p>

<h3>Key Messages of the Farewell Sermon</h3>
<p>On the 9th of Dhul Ḥijjah, standing on the plain of \'Arafah, the Prophet ﷺ delivered his farewell sermon. Its key messages included:</p>
<ul>
  <li><strong>Sanctity of life, wealth, and honour:</strong> "Your blood, your wealth, and your honour are sacred, like the sanctity of this day, this month, and this city."</li>
  <li><strong>Equality of all people:</strong> "No Arab has superiority over a non-Arab, and no non-Arab has superiority over an Arab, except by taqwā (God-consciousness)."</li>
  <li><strong>Rights of women:</strong> "Treat women well, for they are your partners and helpers."</li>
  <li><strong>Abolition of ribā (usury):</strong> The Prophet ﷺ declared all pre-Islamic usury cancelled.</li>
  <li><strong>Holding fast to the Qur'ān:</strong> "I have left among you that which, if you hold firmly to it, you will never go astray — the Book of Allāh."</li>
  <li><strong>Brotherhood of the ummah:</strong> "All Muslims are brothers."</li>
</ul>

<h3>Completion of the Dīn</h3>
<p>During this occasion, Allāh revealed the verse:</p>
<p class="arabic" dir="rtl" lang="ar">الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا</p>
<p><em>"Today I have perfected your religion for you, completed My favour upon you, and chosen Islam as your religion."</em> (Qur'ān 5:3)</p>
<p>This confirmed that the message of Islam was now complete. The Prophet ﷺ passed away approximately 81 days after the farewell sermon.</p>
`.trim();

  const unitFarewell = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-sirah-farewell' } },
    create: {
      slug: 'maktab-5-sirah-farewell',
      courseId: course.id,
      orderIndex: 11,
      title: 'Sīrah — Farewell Ḥajj & Sermon (10 AH)',
      description: 'The Farewell Ḥajj with 100,000+ Companions in 10 AH, the key messages of the Khuṭbah al-Wadā\' (Farewell Sermon) at \'Arafah, and the completion of the dīn.',
      content: farewellContent,
    },
    update: {
      title: 'Sīrah — Farewell Ḥajj & Sermon (10 AH)',
      description: 'The Farewell Ḥajj with 100,000+ Companions in 10 AH, the key messages of the Khuṭbah al-Wadā\' (Farewell Sermon) at \'Arafah, and the completion of the dīn.',
      content: farewellContent,
    },
  });

  console.log('✅ Unit 11:', unitFarewell.title);

  // ══════════════════════════════════════════════
  // TĀRĪKH UNITS (2 focused units)
  // ══════════════════════════════════════════════

  // UNIT 12: TĀRĪKH — Mūsā 'alayhi al-salām

  const musaContent = `
<h2>Mūsā عليه السلام — Kalīmullāh</h2>

<h3>Birth and Early Life</h3>
<p>Mūsā عليه السلام was born at a time when Fir'awn (Pharaoh) of Egypt was killing all newborn boys of Banū Isrā'īl. Allāh inspired his mother to place him in a basket and set it afloat on the River Nile. By Allāh's plan, the basket was found by the family of Fir'awn. Fir'awn's wife, Āsiyah, convinced Fir'awn to adopt the child. Thus, Mūsā عليه السلام grew up in the very palace of the man who sought to destroy his people. Allāh arranged for Mūsā's own mother to become his wet-nurse.</p>

<h3>Leaving Egypt</h3>
<p>As a young man, Mūsā عليه السلام accidentally caused the death of an Egyptian. Fearing punishment, he left Egypt and travelled to Madyan, where he lived for several years, married, and worked as a shepherd.</p>

<h3>The Burning Bush — Revelation at Ṭūr Sīnā</h3>
<p>While travelling back towards Egypt, Mūsā عليه السلام saw a fire on Mount Ṭūr (Sīnā). When he approached it, Allāh spoke to him directly — hence his title Kalīmullāh. Allāh gave him two great miracles: his staff ('aṣā) would turn into a large serpent, and his hand would glow brilliantly white. Allāh commanded Mūsā عليه السلام to go to Fir'awn and call him to worship Allāh alone. Hārūn عليه السلام, his brother, was appointed as his assistant.</p>

<h3>Confronting Fir'awn</h3>
<p>Mūsā عليه السلام called Fir'awn to the worship of the One True God. Fir'awn arrogantly refused, claiming divinity. Allāh sent a series of miracles and plagues upon Egypt: flood, locusts, lice, frogs, and blood. Each time Fir'awn promised to let Banū Isrā'īl go, but broke his promise once the plague was lifted.</p>

<h3>The Parting of the Sea — The Exodus</h3>
<p>Allāh commanded Mūsā عليه السلام to leave Egypt by night. Fir'awn pursued them. When Banū Isrā'īl reached the sea, Allāh commanded Mūsā عليه السلام to strike it with his staff. The sea parted, creating dry paths. Banū Isrā'īl crossed safely, but Fir'awn and his army drowned when the sea closed upon them.</p>

<h3>At Mount Ṭūr Sīnā</h3>
<p>After the Exodus, Allāh called Mūsā عليه السلام to Mount Ṭūr for forty days, where He revealed the Tawrāh. During his absence, Sāmirī led some of Banū Isrā'īl to worship a golden calf. Mūsā عليه السلام was deeply grieved and destroyed the calf upon his return.</p>

<h3>Trials of Banū Isrā'īl</h3>
<ul>
  <li>Refusing to enter the Holy Land, resulting in 40 years of wandering.</li>
  <li>Complaining about food and water despite Allāh's provision.</li>
  <li>Worshipping the golden calf.</li>
</ul>
`.trim();

  const unitMusa = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-tarikh-musa' } },
    create: {
      slug: 'maktab-5-tarikh-musa',
      courseId: course.id,
      orderIndex: 12,
      title: 'Tārīkh — Mūsā \'alayhi al-salām',
      description: 'The life of Mūsā عليه السلام: birth, the burning bush at Ṭūr Sīnā, miracles (staff and glowing hand), confronting Fir\'awn, the parting of the sea, and the Exodus.',
      content: musaContent,
    },
    update: {
      title: 'Tārīkh — Mūsā \'alayhi al-salām',
      description: 'The life of Mūsā عليه السلام: birth, the burning bush at Ṭūr Sīnā, miracles (staff and glowing hand), confronting Fir\'awn, the parting of the sea, and the Exodus.',
      content: musaContent,
    },
  });

  console.log('✅ Unit 12:', unitMusa.title);

  // UNIT 13: TĀRĪKH — 'Īsā 'alayhi al-salām

  const isaContent = `
<h2>'Īsā عليه السلام — Rūḥullāh</h2>

<h3>Maryam عليها السلام</h3>
<p>Maryam عليها السلام was a pious and devout woman chosen by Allāh above all the women of the world. She devoted her life to worship in the temple. An entire sūrah of the Qur'ān (Sūrah Maryam, Chapter 19) is named after her.</p>

<h3>The Miraculous Birth</h3>
<p>The angel Jibrīl عليه السلام informed Maryam that Allāh would bless her with a son — without a father. When the people questioned her, the baby 'Īsā عليه السلام spoke from the cradle:</p>
<p class="arabic" dir="rtl" lang="ar">قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا</p>
<p><em>"He said: 'Indeed, I am the servant of Allāh. He has given me the Scripture and made me a prophet.'"</em> (Qur'ān 19:30)</p>

<h3>Miracles of 'Īsā عليه السلام</h3>
<p>Allāh gave 'Īsā عليه السلام many miracles, all by Allāh's permission:</p>
<ul>
  <li>Speaking in the cradle as a newborn baby.</li>
  <li>Curing the blind and the lepers.</li>
  <li>Giving life to the dead by Allāh's permission.</li>
  <li>Making a bird from clay and breathing life into it by Allāh's permission.</li>
  <li>Informing people of what they had eaten and stored in their homes.</li>
</ul>

<h3>The Ḥawāriyyūn (Disciples)</h3>
<p>'Īsā عليه السلام had a group of devoted followers called the ḥawāriyyūn (disciples). They believed in him and supported his mission to call Banū Isrā'īl back to the worship of Allāh alone.</p>

<h3>The Ascension of 'Īsā عليه السلام</h3>
<p>When the enemies of 'Īsā عليه السلام plotted to kill him, Allāh saved him. 'Īsā عليه السلام was neither killed nor crucified:</p>
<p class="arabic" dir="rtl" lang="ar">وَمَا قَتَلُوهُ وَمَا صَلَبُوهُ وَلَٰكِن شُبِّهَ لَهُمْ</p>
<p><em>"They did not kill him, nor did they crucify him; but it was made to appear so to them."</em> (Qur'ān 4:157)</p>

<h3>The Second Coming</h3>
<p>'Īsā عليه السلام will return before the Day of Judgement. He will descend to earth, follow the Sharī'ah of Muḥammad ﷺ, defeat the Dajjāl (false messiah), and establish justice on earth. He will then pass away naturally and be buried.</p>
`.trim();

  const unitIsa = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-tarikh-isa' } },
    create: {
      slug: 'maktab-5-tarikh-isa',
      courseId: course.id,
      orderIndex: 13,
      title: 'Tārīkh — \'Īsā \'alayhi al-salām',
      description: 'The story of \'Īsā عليه السلام: miraculous birth to Maryam, his miracles (cradle speech, healing, raising dead), his disciples, his ascension, and his second coming.',
      content: isaContent,
    },
    update: {
      title: 'Tārīkh — \'Īsā \'alayhi al-salām',
      description: 'The story of \'Īsā عليه السلام: miraculous birth to Maryam, his miracles (cradle speech, healing, raising dead), his disciples, his ascension, and his second coming.',
      content: isaContent,
    },
  });

  console.log('✅ Unit 13:', unitIsa.title);

  // ══════════════════════════════════════════════
  // AQĀ'ID UNITS (3 focused units)
  // ══════════════════════════════════════════════

  // UNIT 14: AQĀ'ID — Death & the Grave

  const deathGraveContent = `
<h2>Death — The Inevitable Reality</h2>

<h3>Sakrāt al-Mawt — The Pangs of Death</h3>
<p>Every soul will taste death. At the time of death, the angel of death ('Izrā'īl عليه السلام) comes to take the soul. For the believer, the angels come with good news of Allāh's pleasure and Jannah. For the disbeliever, the angels come with news of punishment.</p>
<p class="arabic" dir="rtl" lang="ar">كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ</p>
<p><em>"Every soul will taste death."</em> (Qur'ān 3:185)</p>

<h3>After Death — Ghusl and Burial</h3>
<p>After death, the body is washed (ghusl al-mayyit), shrouded (kafan), the janāzah prayer is performed, and the body is buried facing the qiblah.</p>

<h2>Life of the Grave — Barzakh</h2>

<h3>The Questioning by Munkar and Nakīr</h3>
<p>After burial, two angels — Munkar and Nakīr — come to question the deceased. They ask three questions:</p>
<ol>
  <li><strong>"Who is your Lord?"</strong> — The believer answers: "My Lord is Allāh."</li>
  <li><strong>"What is your religion?"</strong> — The believer answers: "My religion is Islam."</li>
  <li><strong>"Who is this man (Muḥammad ﷺ)?"</strong> — The believer answers: "He is Muḥammad ﷺ, the Messenger of Allāh."</li>
</ol>
<p>The believer answers correctly and is shown their place in Jannah. The disbeliever or hypocrite cannot answer and faces punishment in the grave.</p>

<h3>Comfort and Punishment in the Grave</h3>
<p>The grave is either a garden from the gardens of Jannah or a pit from the pits of Jahannam, depending on the person's faith and deeds. This period is called barzakh — the barrier between this life and the Ākhirah.</p>
`.trim();

  const unitDeathGrave = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-aqaid-death-grave' } },
    create: {
      slug: 'maktab-5-aqaid-death-grave',
      courseId: course.id,
      orderIndex: 14,
      title: 'Aqā\'id — Death & the Grave (Barzakh)',
      description: 'Islamic beliefs about death (sakrāt al-mawt), the angel of death, burial rites, the life of the grave (barzakh), questioning by Munkar and Nakīr, and reward or punishment in the grave.',
      content: deathGraveContent,
    },
    update: {
      title: 'Aqā\'id — Death & the Grave (Barzakh)',
      description: 'Islamic beliefs about death (sakrāt al-mawt), the angel of death, burial rites, the life of the grave (barzakh), questioning by Munkar and Nakīr, and reward or punishment in the grave.',
      content: deathGraveContent,
    },
  });

  console.log('✅ Unit 14:', unitDeathGrave.title);

  // UNIT 15: AQĀ'ID — Jannah, Jahannam & A'rāf

  const jannahContent = `
<h2>Jannah, Jahannam & A'rāf</h2>

<h3>The Day of Resurrection — Yawm al-Qiyāmah</h3>
<p>On the Last Day, the trumpet will be blown and all of creation will be resurrected for the Final Reckoning. The scale of deeds (Mīzān) will be set up and everyone's deeds weighed. Each person will receive a record of their deeds in their right or left hand.</p>

<h3>Al-Ṣirāṭ — The Bridge</h3>
<p>Everyone must cross the bridge over Jahannam. Believers will cross at varying speeds based on their faith and deeds. Those whose deeds are outweighed will fall into Jahannam.</p>

<h3>A'rāf — The Barrier</h3>
<p>Some people will stand on the A'rāf — a barrier between Jannah and Jahannam — awaiting Allāh's final judgement on their fate.</p>

<h2>Jannah — Paradise</h2>
<p>Jannah is Allāh's reward for the believers. Allāh describes it:</p>
<ul>
  <li>Rivers of water, milk, honey, and wine (a pure drink unlike worldly wine).</li>
  <li>Beautiful gardens and palaces.</li>
  <li>Eternal bliss and no pain, sadness, or death.</li>
  <li>The greatest gift: seeing the Face of Allāh.</li>
</ul>
<p>Jannah has eight gates. Allāh says its blessings are beyond what any eye has seen, any ear has heard, or any heart has imagined.</p>

<h2>Jahannam — Hell</h2>
<p>Jahannam is the place of punishment. It is described in the Qur'ān as:</p>
<ul>
  <li>Blazing fire and scorching wind.</li>
  <li>Boiling water to drink and bitter trees to eat.</li>
  <li>Chains, fetters, and intense suffering.</li>
</ul>
<p>Jahannam has seven gates. The worst form of punishment is being deprived of the sight of Allāh.</p>
<p>Those Muslims who had sins may enter Jahannam temporarily and then be taken out by Allāh's mercy. Only the kuffār (disbelievers) remain in Jahannam forever.</p>
`.trim();

  const unitJannah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-aqaid-jannah' } },
    create: {
      slug: 'maktab-5-aqaid-jannah',
      courseId: course.id,
      orderIndex: 15,
      title: 'Aqā\'id — Jannah, Jahannam & A\'rāf',
      description: 'Beliefs about Yawm al-Qiyāmah: the Mīzān, al-Ṣirāṭ, A\'rāf, the descriptions of Jannah (Paradise) and Jahannam (Hell), their gates, and who shall dwell in each.',
      content: jannahContent,
    },
    update: {
      title: 'Aqā\'id — Jannah, Jahannam & A\'rāf',
      description: 'Beliefs about Yawm al-Qiyāmah: the Mīzān, al-Ṣirāṭ, A\'rāf, the descriptions of Jannah (Paradise) and Jahannam (Hell), their gates, and who shall dwell in each.',
      content: jannahContent,
    },
  });

  console.log('✅ Unit 15:', unitJannah.title);

  // UNIT 16: AQĀ'ID — Al-Qadr

  const qadrContent = `
<h2>Al-Qadr — Divine Decree</h2>

<h3>Belief in Al-Qadr</h3>
<p>Al-Qadr (divine decree/predestination) is one of the six pillars of Īmān. We believe that Allāh has complete knowledge of everything that was, is, and will be. Nothing occurs in the universe except by Allāh's knowledge, will, and decree.</p>

<h3>The Four Aspects of Al-Qadr</h3>
<ol>
  <li><strong>Ilm (Knowledge)</strong> — Allāh knows everything past, present, and future.</li>
  <li><strong>Kitābah (Writing)</strong> — Everything is written in al-Lawḥ al-Maḥfūẓ (the Preserved Tablet) 50,000 years before the creation of the heavens and earth.</li>
  <li><strong>Mashī'ah (Will)</strong> — Everything happens only by Allāh's will.</li>
  <li><strong>Khalq (Creation)</strong> — Allāh created everything, including the actions of people.</li>
</ol>

<h3>Human Responsibility and Free Will</h3>
<p>Believing in al-Qadr does not mean people have no choice. Allāh gave humans intellect and free will. We choose our actions, and Allāh created that ability to choose. We are accountable for what we freely choose to do.</p>
<p>Al-Qadr teaches us that good and bad fortune are both from Allāh. It gives us peace of mind — nothing happens by chance. We strive our best and then trust in Allāh (tawakkul).</p>

<h3>Laylat al-Qadr</h3>
<p>Laylat al-Qadr (the Night of Power/Decree) is in the last ten odd nights of Ramaḍān. It is better than one thousand months. The Prophet ﷺ would increase worship in these nights. The du'ā' taught by the Prophet ﷺ for this night is:</p>
<p class="arabic" dir="rtl" lang="ar">اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي</p>
<p><em>"O Allāh, You are Most Forgiving and You love forgiveness, so forgive me."</em></p>
`.trim();

  const unitQadr = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-aqaid-qadr' } },
    create: {
      slug: 'maktab-5-aqaid-qadr',
      courseId: course.id,
      orderIndex: 16,
      title: 'Aqā\'id — Al-Qadr (Divine Decree)',
      description: 'The sixth pillar of Īmān: al-Qadr. Its four aspects (Ilm, Kitābah, Mashī\'ah, Khalq), human free will, Laylat al-Qadr, and the du\'ā\' for the Night of Power.',
      content: qadrContent,
    },
    update: {
      title: 'Aqā\'id — Al-Qadr (Divine Decree)',
      description: 'The sixth pillar of Īmān: al-Qadr. Its four aspects (Ilm, Kitābah, Mashī\'ah, Khalq), human free will, Laylat al-Qadr, and the du\'ā\' for the Night of Power.',
      content: qadrContent,
    },
  });

  console.log('✅ Unit 16:', unitQadr.title);

  // ══════════════════════════════════════════════
  // AKHLĀQ UNITS (3 focused units)
  // ══════════════════════════════════════════════

  // UNIT 17: AKHLĀQ — Mashwarah & Ṣabr

  const mashwarahContent = `
<h2>Mashwarah — Seeking Counsel</h2>
<p>Mashwarah means to seek the advice and opinion of others before making important decisions. Allāh commanded even the Prophet ﷺ to consult his companions:</p>
<p class="arabic" dir="rtl" lang="ar">وَشَاوِرْهُمْ فِي الْأَمْرِ</p>
<p><em>"And consult them in the matter."</em> (Qur'ān 3:159)</p>
<p>Mashwarah is a sunnah of the Prophet ﷺ. He regularly sought the advice of the Ṣaḥābah in important affairs. Key points:</p>
<ul>
  <li>Seek advice from people who are knowledgeable, trustworthy, and sincere.</li>
  <li>After proper mashwarah, make a decision and then do tawakkul (place trust in Allāh).</li>
  <li>The person giving advice must be honest — giving false or self-serving advice is a betrayal of trust.</li>
  <li>Decision-making without consulting others leads to mistakes and regret.</li>
</ul>

<h2>Ṣabr — Patience</h2>
<p>Ṣabr means patience, steadfastness, and perseverance in the face of difficulty. It is one of the greatest virtues in Islām.</p>
<p class="arabic" dir="rtl" lang="ar">إِنَّ اللَّهَ مَعَ الصَّابِرِينَ</p>
<p><em>"Indeed, Allāh is with those who are patient."</em> (Qur'ān 2:153)</p>
<h3>Three Types of Ṣabr</h3>
<ol>
  <li><strong>Ṣabr in obeying Allāh</strong> — remaining steadfast in acts of worship even when it is difficult.</li>
  <li><strong>Ṣabr in refraining from sin</strong> — holding oneself back from what Allāh has forbidden.</li>
  <li><strong>Ṣabr in the face of adversity</strong> — accepting Allāh's decree with contentment when trials, illness, or loss occur.</li>
</ol>
<p>The Prophet ﷺ said: <em>"What a wonderful thing is patience! And patience is not given to anyone except one who is good."</em> Those who are patient are promised great reward from Allāh.</p>
<p>Ṣabr does not mean passivity — one strives to improve one's situation while remaining patient with what Allāh decrees.</p>
`.trim();

  const unitMashwarah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-akhlaq-mashwarah' } },
    create: {
      slug: 'maktab-5-akhlaq-mashwarah',
      courseId: course.id,
      orderIndex: 17,
      title: 'Akhlāq — Mashwarah & Ṣabr',
      description: 'The virtue of seeking counsel (mashwarah) as a Qur\'ānic command and Prophetic sunnah, and the three types of patience (ṣabr) with their rewards.',
      content: mashwarahContent,
    },
    update: {
      title: 'Akhlāq — Mashwarah & Ṣabr',
      description: 'The virtue of seeking counsel (mashwarah) as a Qur\'ānic command and Prophetic sunnah, and the three types of patience (ṣabr) with their rewards.',
      content: mashwarahContent,
    },
  });

  console.log('✅ Unit 17:', unitMashwarah.title);

  // UNIT 18: AKHLĀQ — Keeping Ties & Gifts (Ṣilah al-Raḥim & Hadiyyah)

  const silahContent = `
<h2>Ṣilah al-Raḥim — Keeping Family Ties</h2>
<p>Ṣilah al-raḥim means maintaining and strengthening ties with one's relatives. It is one of the most emphasised duties in Islām.</p>
<p class="arabic" dir="rtl" lang="ar">وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ</p>
<p><em>"Fear Allāh, through Whom you demand your mutual rights, and be mindful of kinship ties."</em> (Qur'ān 4:1)</p>
<p>The Prophet ﷺ said: <em>"Whoever wishes his provision to be expanded and his lifespan extended, let him maintain kinship ties."</em></p>
<h3>Key Points</h3>
<ul>
  <li>Qāṭi' al-raḥim (one who severs family ties) is strongly warned against in the Qur'ān and Ḥadīth.</li>
  <li>Maintaining ties even when others are unjust is a higher level of ṣilah al-raḥim.</li>
  <li>Regular visits, calls, gifts, and checking on relatives are all ways of keeping ties.</li>
</ul>

<h2>Hadiyyah — The Gift</h2>
<p>Giving gifts is a beloved sunnah of the Prophet ﷺ. He said: <em>"Exchange gifts, for gifts increase love between you."</em></p>
<h3>Etiquettes of Giving and Receiving Gifts</h3>
<ul>
  <li>Give gifts to create love and remove ill-feelings.</li>
  <li>Accept gifts with gratitude and do not refuse without a valid reason.</li>
  <li>It is sunnah to make du'ā' for the gift-giver: say <em>"Jazākallāhu khayran"</em> or similar.</li>
  <li>Do not give gifts expecting something in return (riyā').</li>
  <li>Gifts do not have to be expensive — even a small gesture is valuable.</li>
</ul>
`.trim();

  const unitSilah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-akhlaq-silah' } },
    create: {
      slug: 'maktab-5-akhlaq-silah',
      courseId: course.id,
      orderIndex: 18,
      title: 'Akhlāq — Keeping Ties & Gifts',
      description: 'Ṣilah al-raḥim (maintaining family ties) as a Qur\'ānic and Prophetic duty, and the sunnah of gift-giving (hadiyyah) with its etiquettes.',
      content: silahContent,
    },
    update: {
      title: 'Akhlāq — Keeping Ties & Gifts',
      description: 'Ṣilah al-raḥim (maintaining family ties) as a Qur\'ānic and Prophetic duty, and the sunnah of gift-giving (hadiyyah) with its etiquettes.',
      content: silahContent,
    },
  });

  console.log('✅ Unit 18:', unitSilah.title);

  // UNIT 19: AKHLĀQ — Dhikr, Shukr & Tawbah

  const dhikrContent = `
<h2>Dhikr — Remembrance of Allāh</h2>
<p>Dhikr means the remembrance of Allāh through words, thoughts, and deeds. Allāh says:</p>
<p class="arabic" dir="rtl" lang="ar">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</p>
<p><em>"Verily, in the remembrance of Allāh do hearts find rest."</em> (Qur'ān 13:28)</p>
<p>Regular adhkār include: SubḥānAllāh, Alḥamdulillāh, Allāhu Akbar, Lā ilāha illallāh, Lā ḥawla wa lā quwwata illā billāh, Astaghfirullāh, and Ṣalawāt upon the Prophet ﷺ.</p>

<h2>Shukr — Gratitude to Allāh</h2>
<p>Shukr means being grateful to Allāh for His countless blessings. Allāh promises:</p>
<p class="arabic" dir="rtl" lang="ar">لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ</p>
<p><em>"If you are grateful, I will certainly give you more."</em> (Qur'ān 14:7)</p>
<p>Shukr has three dimensions:</p>
<ol>
  <li><strong>Heart</strong> — recognising that all blessings come from Allāh.</li>
  <li><strong>Tongue</strong> — expressing gratitude verbally (Alḥamdulillāh).</li>
  <li><strong>Actions</strong> — using Allāh's blessings in His obedience.</li>
</ol>

<h2>Tawbah — Repentance</h2>
<p>Tawbah means turning sincerely back to Allāh after committing a sin. Allāh loves those who repent:</p>
<p class="arabic" dir="rtl" lang="ar">إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ</p>
<p><em>"Truly, Allāh loves those who repent and loves those who purify themselves."</em> (Qur'ān 2:222)</p>
<h3>Conditions of Tawbah</h3>
<ol>
  <li>Stop the sin immediately.</li>
  <li>Feel genuine remorse.</li>
  <li>Resolve firmly not to return to the sin.</li>
  <li>If the sin involved someone else's rights, make amends to them.</li>
</ol>
`.trim();

  const unitDhikr = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-akhlaq-dhikr' } },
    create: {
      slug: 'maktab-5-akhlaq-dhikr',
      courseId: course.id,
      orderIndex: 19,
      title: 'Akhlāq — Dhikr, Shukr & Tawbah',
      description: 'The remembrance of Allāh (dhikr) and its effect on the heart, gratitude (shukr) in heart, tongue, and action, and the conditions of sincere repentance (tawbah).',
      content: dhikrContent,
    },
    update: {
      title: 'Akhlāq — Dhikr, Shukr & Tawbah',
      description: 'The remembrance of Allāh (dhikr) and its effect on the heart, gratitude (shukr) in heart, tongue, and action, and the conditions of sincere repentance (tawbah).',
      content: dhikrContent,
    },
  });

  console.log('✅ Unit 19:', unitDhikr.title);

  // ══════════════════════════════════════════════
  // ĀDĀB UNITS (3 focused units)
  // ══════════════════════════════════════════════

  // UNIT 20: ĀDĀB — Ghusl & Miswāk

  const ghusContent = `
<h2>Ghusl — The Ritual Bath</h2>

<h3>When is Ghusl Necessary (Farḍ)?</h3>
<ul>
  <li>After sexual intercourse or discharge (janābah).</li>
  <li>After the cessation of ḥayḍ (menstruation).</li>
  <li>After the cessation of nifās (post-natal bleeding).</li>
  <li>For the deceased Muslim (ghusl al-mayyit).</li>
  <li>Upon accepting Islām (for the new Muslim).</li>
</ul>

<h3>Sunnah Times for Ghusl</h3>
<ul>
  <li>Before Jumu'ah (Friday) prayer.</li>
  <li>Before the two \'Īd prayers.</li>
  <li>Before putting on iḥrām for Ḥajj or \'Umrah.</li>
</ul>

<h3>How to Perform Ghusl (Sunnah Method)</h3>
<ol>
  <li>Make niyyah (intention).</li>
  <li>Wash both hands three times.</li>
  <li>Wash private parts.</li>
  <li>Perform full wuḍū'.</li>
  <li>Pour water over the entire body three times, starting with the right side.</li>
  <li>Ensure no part of the body remains dry.</li>
</ol>

<h2>Miswāk — The Tooth-Stick</h2>
<p>The miswāk is a tooth-cleaning twig, traditionally from the Salvadora persica (arāk) tree. Its use is a strongly emphasised sunnah of the Prophet ﷺ. He said:</p>
<p><em>"Were it not for my concern for my Ummah, I would have commanded them to use the miswāk with every prayer."</em></p>
<h3>Times for Using the Miswāk</h3>
<ul>
  <li>Before every ṣalāh.</li>
  <li>Before reading the Qur'ān.</li>
  <li>Upon waking up.</li>
  <li>When entering the home.</li>
</ul>
<h3>Benefits of the Miswāk</h3>
<ul>
  <li>Purifies the mouth and freshens the breath.</li>
  <li>Strengthens the gums and teeth.</li>
  <li>Is a sunnah that multiplies the reward of prayer.</li>
</ul>
`.trim();

  const unitGhusl = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-adab-ghusl' } },
    create: {
      slug: 'maktab-5-adab-ghusl',
      courseId: course.id,
      orderIndex: 20,
      title: 'Ādāb — Ghusl & Miswāk',
      description: 'When ghusl is obligatory and when it is sunnah, the step-by-step method of ghusl, and the Islamic etiquette of using the miswāk with its benefits.',
      content: ghusContent,
    },
    update: {
      title: 'Ādāb — Ghusl & Miswāk',
      description: 'When ghusl is obligatory and when it is sunnah, the step-by-step method of ghusl, and the Islamic etiquette of using the miswāk with its benefits.',
      content: ghusContent,
    },
  });

  console.log('✅ Unit 20:', unitGhusl.title);

  // UNIT 21: ĀDĀB — Social Interaction & Writing

  const socialContent = `
<h2>Ādāb of Social Interaction</h2>

<h3>Salām — The Islamic Greeting</h3>
<p>The full salām is: <em>Al-Salāmu 'alaykum wa raḥmatullāhi wa barakātuh</em> (Peace be upon you, and the mercy and blessings of Allāh). The Prophet ﷺ said: <em>"Spread salām amongst you."</em></p>
<ul>
  <li>The one walking gives salām to the one sitting.</li>
  <li>The smaller group gives salām to the larger.</li>
  <li>The younger gives salām to the elder.</li>
</ul>

<h3>Istidhan — Seeking Permission to Enter</h3>
<p>Before entering someone's home, seek permission three times. If no one answers after three requests, turn away. Allāh says:</p>
<p class="arabic" dir="rtl" lang="ar">لَا تَدْخُلُوا بُيُوتًا غَيْرَ بُيُوتِكُمْ حَتَّىٰ تَسْتَأْنِسُوا وَتُسَلِّمُوا عَلَىٰ أَهْلِهَا</p>
<p><em>"Do not enter homes other than your own until you have sought permission and greeted those inside."</em> (Qur'ān 24:27)</p>

<h3>Bismillāh in Daily Life</h3>
<p>The sunnah is to begin all permissible actions with <em>Bismillāh</em>: eating, drinking, writing, beginning any work. This invokes Allāh's blessing and keeps Shayṭān away.</p>

<h2>Ādāb of Writing</h2>
<ul>
  <li>Begin letters and documents with <em>Bismillāh al-Raḥmān al-Raḥīm</em>.</li>
  <li>Write clearly and neatly — good handwriting is a sunnah.</li>
  <li>When writing the name of Allāh or the Prophet ﷺ, use the appropriate honorifics (SWT / ﷺ / عليه السلام).</li>
  <li>Do not waste paper or write falsehood.</li>
  <li>End letters with salām and du'ā'.</li>
</ul>

<h3>The Prophet's ﷺ Letters</h3>
<p>The Prophet ﷺ sent letters to the rulers of neighbouring empires (Heraclius, Chosroes, the Negus) inviting them to Islām. These letters began with <em>Bismillāh al-Raḥmān al-Raḥīm</em> and were sealed with his ring bearing <em>Muḥammadun Rasūlullāh</em>.</p>
`.trim();

  const unitSocial = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-adab-social' } },
    create: {
      slug: 'maktab-5-adab-social',
      courseId: course.id,
      orderIndex: 21,
      title: 'Ādāb — Social Interaction & Writing',
      description: 'Islamic etiquettes of salām, seeking permission to enter homes (istidhan), using Bismillāh in daily life, and the Islamic ādāb of letter-writing and correspondence.',
      content: socialContent,
    },
    update: {
      title: 'Ādāb — Social Interaction & Writing',
      description: 'Islamic etiquettes of salām, seeking permission to enter homes (istidhan), using Bismillāh in daily life, and the Islamic ādāb of letter-writing and correspondence.',
      content: socialContent,
    },
  });

  console.log('✅ Unit 21:', unitSocial.title);

  // UNIT 22: ĀDĀB — Visiting the Sick

  const sickContent = `
<h2>Ādāb of Visiting the Sick — 'Iyādah al-Marīḍ</h2>

<h3>The Obligation of Visiting the Sick</h3>
<p>Visiting the sick (iyyādah) is one of the rights of a Muslim upon another Muslim. The Prophet ﷺ said:</p>
<p><em>"The rights of a Muslim over another Muslim are six: ... When he is sick, visit him..."</em></p>
<p>He also said: <em>"Whoever visits a sick person continues to be in the khurfah of Jannah until they return."</em> (i.e., they enjoy the fruits of Jannah).</p>

<h3>How to Visit the Sick</h3>
<ul>
  <li>Visit at an appropriate time — not too early or too late.</li>
  <li>Keep the visit short so as not to tire the patient.</li>
  <li>Sit close to the patient and be cheerful and encouraging.</li>
  <li>Remind the patient of Allāh's mercy and the expiation of sins through illness.</li>
  <li>Make du'ā' for the patient's recovery.</li>
</ul>

<h3>Du'ā' for the Sick</h3>
<p>The Prophet ﷺ would place his hand on the sick person and say:</p>
<p class="arabic" dir="rtl" lang="ar">أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ وَاشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا</p>
<p><em>"Remove the hardship, O Lord of mankind! Grant cure — You are the One who cures. There is no cure except Your cure — a cure that leaves no illness behind."</em></p>
<p>Another du'ā' taught by the Prophet ﷺ:</p>
<p class="arabic" dir="rtl" lang="ar">لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ</p>
<p><em>"Do not worry, it is a purification, in shā' Allāh."</em></p>

<h3>The Patient's Reward</h3>
<p>The Prophet ﷺ said that every pain, worry, and illness a Muslim suffers — even the prick of a thorn — is an expiation for sins. The patient should make ṣabr and not complain excessively. They may speak of their condition to get treatment but should not lose hope in Allāh's mercy.</p>
`.trim();

  const unitSick = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-5-adab-sick' } },
    create: {
      slug: 'maktab-5-adab-sick',
      courseId: course.id,
      orderIndex: 22,
      title: 'Ādāb — Visiting the Sick',
      description: 'The Islamic duty of visiting the sick (iyyādah al-marīḍ): its reward, etiquettes, the Prophetic du\'ā\'s for the sick, and the spiritual reward for the patient.',
      content: sickContent,
    },
    update: {
      title: 'Ādāb — Visiting the Sick',
      description: 'The Islamic duty of visiting the sick (iyyādah al-marīḍ): its reward, etiquettes, the Prophetic du\'ā\'s for the sick, and the spiritual reward for the patient.',
      content: sickContent,
    },
  });

  console.log('✅ Unit 22:', unitSick.title);

  // ══════════════════════════════════════════════
  // QUIZ QUESTIONS — all 22 units
  // ══════════════════════════════════════════════

  const quizData = [
    // ── Unit 1: Wuḍū' ──
    {
      unitId: unitWudu.id,
      externalId: 'maktab-5-wudu-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many farā\'iḍ (obligatory acts) does wuḍū\' have according to the Ḥanafī school?',
      options: ['2', '3', '4', '6'],
      correctAnswer: '4',
      explanation: 'The four farā\'iḍ of wuḍū\' are: washing the face, washing both arms to the elbows, wiping a quarter of the head (masaḥ), and washing both feet to the ankles.',
    },
    {
      unitId: unitWudu.id,
      externalId: 'maktab-5-wudu-q2',
      type: 'TRUE_FALSE',
      questionText: 'Washing each limb only once (without repetition) still fulfils the farḍ of wuḍū\'.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Washing each limb once is farḍ. Washing three times is sunnah. The farḍ is fulfilled by washing once.',
    },
    {
      unitId: unitWudu.id,
      externalId: 'maktab-5-wudu-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following is a nāqiḍ (nullifier) of wuḍū\'?',
      options: ['Laughing softly in ṣalāh', 'Deep sleep', 'Speaking during wuḍū\'', 'Using miswāk'],
      correctAnswer: 'Deep sleep',
      explanation: 'Deep sleep (in a position where one cannot control themselves) nullifies wuḍū\'. Laughing in ṣalāh only breaks ṣalāh (not wuḍū\' according to some scholars). Speaking during wuḍū\' and using miswāk do not break wuḍū\'.',
    },
    {
      unitId: unitWudu.id,
      externalId: 'maktab-5-wudu-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following is a sunnah of wuḍū\'?',
      options: ['Washing the face', 'Masaḥ of the whole head', 'Making niyyah at the start', 'Washing both feet'],
      correctAnswer: 'Making niyyah at the start',
      explanation: 'Niyyah (intention) is a sunnah of wuḍū\' in the Ḥanafī school (farḍ in other schools). Washing the face, feet, and masaḥ of a quarter of the head are all farā\'iḍ.',
    },
    {
      unitId: unitWudu.id,
      externalId: 'maktab-5-wudu-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is a makrūh (disliked) act in wuḍū\'?',
      options: ['Washing in order', 'Using too much water wastefully', 'Saying Bismillāh', 'Washing between the fingers'],
      correctAnswer: 'Using too much water wastefully',
      explanation: 'Using too much water wastefully (isrāf) is makrūh in wuḍū\'. Washing in order, saying Bismillāh, and washing between the fingers are all sunnan of wuḍū\'.',
    },
    {
      unitId: unitWudu.id,
      externalId: 'maktab-5-wudu-q6',
      type: 'TRUE_FALSE',
      questionText: 'Vomiting a mouthful of food or drink breaks wuḍū\'.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Vomiting a full mouthful is one of the nawāqiḍ (nullifiers) of wuḍū\' according to the Ḥanafī school.',
    },

    // ── Unit 2: Tayammum ──
    {
      unitId: unitTayammum.id,
      externalId: 'maktab-5-tayammum-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'When is tayammum permissible as a substitute for wuḍū\' or ghusl?',
      options: ['When one is too lazy to use water', 'When water is unavailable or its use would cause harm', 'When the weather is cold', 'When one has already prayed once'],
      correctAnswer: 'When water is unavailable or its use would cause harm',
      explanation: 'Tayammum is permitted when water is not available or when using water would cause harm (e.g., serious illness). Laziness or cold weather alone are not valid reasons.',
    },
    {
      unitId: unitTayammum.id,
      externalId: 'maktab-5-tayammum-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What are the farā\'iḍ of tayammum?',
      options: ['Niyyah and wiping the head', 'Niyyah, wiping the face, and wiping both arms to the elbows', 'Niyyah and striking the ground twice', 'Wiping the face and feet'],
      correctAnswer: 'Niyyah, wiping the face, and wiping both arms to the elbows',
      explanation: 'The three farā\'iḍ of tayammum are: (1) niyyah, (2) wiping the entire face, and (3) wiping both arms to (and including) the elbows.',
    },
    {
      unitId: unitTayammum.id,
      externalId: 'maktab-5-tayammum-q3',
      type: 'TRUE_FALSE',
      questionText: 'Tayammum is broken (becomes invalid) when water becomes available.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'When the reason for tayammum no longer exists — such as finding water — the tayammum is invalidated and one must use water.',
    },
    {
      unitId: unitTayammum.id,
      externalId: 'maktab-5-tayammum-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which materials are valid for performing tayammum?',
      options: ['Any wet surface', 'Clean earth, sand, stone, or any natural ground surface', 'Only specific white sand', 'Cloth or cotton'],
      correctAnswer: 'Clean earth, sand, stone, or any natural ground surface',
      explanation: 'Tayammum is performed with clean earth, sand, stone, clay, or any natural ground surface. Cloth or metal do not constitute valid materials for tayammum.',
    },
    {
      unitId: unitTayammum.id,
      externalId: 'maktab-5-tayammum-q5',
      type: 'TRUE_FALSE',
      questionText: 'One tayammum can be used for multiple ṣalāhs as long as it is not broken.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Tayammum, like wuḍū\', remains valid for multiple ṣalāhs until it is broken by a nāqiḍ or until water becomes available.',
    },

    // ── Unit 3: Ṣalāh ──
    {
      unitId: unitSalah.id,
      externalId: 'maktab-5-salah-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is a masbūq?',
      options: ['One who leads the prayer', 'One who joins the congregational prayer after it has already started', 'One who prays alone', 'One who repeats a missed prayer'],
      correctAnswer: 'One who joins the congregational prayer after it has already started',
      explanation: 'A masbūq is a latecomer who joins the congregational prayer after the imām has already begun. They complete the remaining rak\'ahs after the imām makes salām.',
    },
    {
      unitId: unitSalah.id,
      externalId: 'maktab-5-salah-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many additional takbīrs are said in each rak\'ah of \'Īd ṣalāh (beyond the opening takbīr)?',
      options: ['Two', 'Three', 'Six', 'Twelve'],
      correctAnswer: 'Three',
      explanation: '\'Īd ṣalāh has three additional takbīrs in the first rak\'ah (after the opening takbīr) and three additional takbīrs in the second rak\'ah (before the rukū\').',
    },
    {
      unitId: unitSalah.id,
      externalId: 'maktab-5-salah-q3',
      type: 'TRUE_FALSE',
      questionText: 'Qaḍā\' ṣalāh (makeup prayer) must be performed as soon as one remembers a missed prayer.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'It is wājib to make up missed prayers (qaḍā\') as soon as possible. Deliberately delaying without excuse is sinful.',
    },
    {
      unitId: unitSalah.id,
      externalId: 'maktab-5-salah-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following is a sunnah of ṣalāh?',
      options: ['Saying takbīr al-taḥrīmah', 'Reciting Sūrah al-Fātiḥah', 'Raising hands to the earlobes at the opening takbīr', 'Performing sujūd'],
      correctAnswer: 'Raising hands to the earlobes at the opening takbīr',
      explanation: 'Raising hands (raf\' al-yadayn) to the earlobes at the opening takbīr is a sunnah of ṣalāh. The takbīr, Fātiḥah, and sujūd are farā\'iḍ.',
    },
    {
      unitId: unitSalah.id,
      externalId: 'maktab-5-salah-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'When does a masbūq stand to complete his missed rak\'ahs?',
      options: ['During the imām\'s salām on the right side', 'After the imām completes both salāms', 'Immediately when he arrives', 'After the congregation disperses'],
      correctAnswer: 'After the imām completes both salāms',
      explanation: 'The masbūq waits for the imām to complete both salāms, then stands to complete his remaining rak\'ahs.',
    },

    // ── Unit 4: Ḥajj / \'Umrah ──
    {
      unitId: unitHajj.id,
      externalId: 'maktab-5-hajj-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the first act performed upon entering Makkah for \'Umrah?',
      options: ['Sa\'y between Ṣafā and Marwah', 'Wuqūf at \'Arafāt', 'Ṭawāf of the Ka\'bah', 'Shaving the head'],
      correctAnswer: 'Ṭawāf of the Ka\'bah',
      explanation: 'For \'Umrah, the pilgrim first performs ṭawāf (seven circuits) around the Ka\'bah, followed by sa\'y between Ṣafā and Marwah, then ḥalq or taqṣīr.',
    },
    {
      unitId: unitHajj.id,
      externalId: 'maktab-5-hajj-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the talbiyah?',
      options: ['The du\'ā\' said during ṭawāf', 'The supplication said at wuqūf', 'The statement recited from iḥrām until the 10th of Dhul Ḥijjah', 'The ghusl before entering Makkah'],
      correctAnswer: 'The statement recited from iḥrām until the 10th of Dhul Ḥijjah',
      explanation: 'The talbiyah is "Labbayk Allāhumma labbayk..." recited continuously from putting on iḥrām until the day of \'Īd (10th Dhul Ḥijjah). It stops after stoning the Jamrāt al-\'Aqabah.',
    },
    {
      unitId: unitHajj.id,
      externalId: 'maktab-5-hajj-q3',
      type: 'TRUE_FALSE',
      questionText: 'Wuqūf at \'Arafāt is the most essential pillar of Ḥajj — without it, Ḥajj is not valid.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet ﷺ said: "Al-Ḥajj \'Arafah" — Ḥajj is \'Arafah. Wuqūf at \'Arafāt (staying there on 9th Dhul Ḥijjah) is the central pillar (rukn) of Ḥajj.',
    },
    {
      unitId: unitHajj.id,
      externalId: 'maktab-5-hajj-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the mīqāt?',
      options: ['The time of ṭawāf', 'The designated boundary at which iḥrām must be put on before entering Makkah', 'The place of sacrifice', 'The area between Ṣafā and Marwah'],
      correctAnswer: 'The designated boundary at which iḥrām must be put on before entering Makkah',
      explanation: 'The mīqāt are designated spatial boundaries around Makkah. Pilgrims must enter iḥrām before crossing the mīqāt relevant to their direction of travel.',
    },
    {
      unitId: unitHajj.id,
      externalId: 'maktab-5-hajj-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is Ziyārah in the context of ḥajj?',
      options: ['Visiting \'Arafāt', 'Visiting the Prophet\'s Masjid in Madinah', 'Circling the Ka\'bah', 'Performing sa\'y'],
      correctAnswer: 'Visiting the Prophet\'s Masjid in Madinah',
      explanation: 'Ziyārah refers to visiting Madinah — specifically the Masjid al-Nabawī and the blessed grave of the Prophet ﷺ — which is a highly recommended act for Ḥajj pilgrims.',
    },
    {
      unitId: unitHajj.id,
      externalId: 'maktab-5-hajj-q6',
      type: 'TRUE_FALSE',
      questionText: 'During iḥrām, men must wear two white unstitched sheets of cloth.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Male pilgrims wear two white unstitched sheets: the ridā\' (upper garment) and the izār (lower garment). Stitched clothing, covering the head, and perfume are all prohibited in iḥrām for men.',
    },

    // ── Unit 5: Munāfiq & Promises ──
    {
      unitId: unitMunafiq.id,
      externalId: 'maktab-5-munafiq-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'According to the hadith, how many signs of a hypocrite (munāfiq) are there?',
      options: ['2', '3', '4', '5'],
      correctAnswer: '3',
      explanation: 'The Prophet ﷺ said: "The signs of a munāfiq are three: when he speaks he lies, when he makes a promise he breaks it, and when he is trusted he betrays that trust." (Bukhārī & Muslim)',
    },
    {
      unitId: unitMunafiq.id,
      externalId: 'maktab-5-munafiq-q2',
      type: 'TRUE_FALSE',
      questionText: 'A Muslim who has the three signs of a hypocrite but prays and fasts is still considered a hypocrite.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet ﷺ said that these signs apply "even if he prays and fasts and claims to be a Muslim." These traits of lying, promise-breaking, and betrayal are signs of nifāq in behaviour.',
    },
    {
      unitId: unitMunafiq.id,
      externalId: 'maktab-5-munafiq-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What does the hadith say about keeping promises?',
      options: ['Promises are optional in Islam', 'Breaking promises is only disliked when made in Allah\'s name', 'Fulfilling promises is a sign of true faith (īmān)', 'Promises only count if made to relatives'],
      correctAnswer: 'Fulfilling promises is a sign of true faith (īmān)',
      explanation: 'Fulfilling promises is a mark of true believers, while breaking them is one of the three signs of hypocrisy. Allāh also commands: "O you who believe, fulfil your contracts." (Qur\'ān 5:1)',
    },
    {
      unitId: unitMunafiq.id,
      externalId: 'maktab-5-munafiq-q4',
      type: 'TRUE_FALSE',
      questionText: 'Betraying a trust (khiyānat al-amānah) is one of the signs of hypocrisy mentioned in the hadith.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The third sign listed in the hadith of the Prophet ﷺ is: "when he is trusted (given an amānah), he betrays it." This is khiyānat al-amānah — a serious trait of nifāq.',
    },
    {
      unitId: unitMunafiq.id,
      externalId: 'maktab-5-munafiq-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the Arabic term for hypocrisy?',
      options: ['Kibr', 'Nifāq', 'Riyā\'', 'Ḥiqd'],
      correctAnswer: 'Nifāq',
      explanation: 'Nifāq means hypocrisy — outwardly displaying faith while inwardly harbouring disbelief or corrupt character. A munāfiq is a hypocrite.',
    },

    // ── Unit 6: The Tongue & Ghība ──
    {
      unitId: unitTongue.id,
      externalId: 'maktab-5-tongue-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is ghība (backbiting)?',
      options: ['Lying about someone to their face', 'Mentioning something about a person that they would dislike, even if it is true', 'Praising someone insincerely', 'Arguing in a loud voice'],
      correctAnswer: 'Mentioning something about a person that they would dislike, even if it is true',
      explanation: 'The Prophet ﷺ defined ghība as: "mentioning your brother in a way he would dislike." If it is false, it becomes buhtān (slander), which is even worse.',
    },
    {
      unitId: unitTongue.id,
      externalId: 'maktab-5-tongue-q2',
      type: 'TRUE_FALSE',
      questionText: 'The Qur\'ān compares ghība to eating the flesh of one\'s dead brother.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Allāh says in Sūrah al-Ḥujurāt (49:12): "Would one of you like to eat the flesh of his dead brother? You would hate it." This is Allāh\'s vivid description of the repugnance of ghība.',
    },
    {
      unitId: unitTongue.id,
      externalId: 'maktab-5-tongue-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is nameemah?',
      options: ['Envy', 'Carrying tales (gossip) to cause trouble between people', 'Lying in business', 'Excessive speech'],
      correctAnswer: 'Carrying tales (gossip) to cause trouble between people',
      explanation: 'Nameemah means carrying tales — conveying what someone said about another in order to cause discord between them. The Prophet ﷺ warned that the person who does nameemah will not enter Jannah.',
    },
    {
      unitId: unitTongue.id,
      externalId: 'maktab-5-tongue-q4',
      type: 'TRUE_FALSE',
      questionText: 'A Muslim may speak ill of a person as long as what they say is true.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Even true statements about a person that they would dislike constitute ghība, which is ḥarām. Truth does not make ghība permissible.',
    },
    {
      unitId: unitTongue.id,
      externalId: 'maktab-5-tongue-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'The Prophet ﷺ said: "Whoever guarantees me what is between his two __________ and his two __________, I guarantee him Jannah."',
      options: ['Eyes and ears', 'Jaws (the tongue) and his legs (private parts)', 'Hands and feet', 'Mind and heart'],
      correctAnswer: 'Jaws (the tongue) and his legs (private parts)',
      explanation: 'The Prophet ﷺ guaranteed Jannah to whoever controls their tongue (what is between the two jaws) and their private parts (between the two legs). This shows how critical controlling speech is.',
    },

    // ── Unit 7: Intoxicants ──
    {
      unitId: unitIntoxicants.id,
      externalId: 'maktab-5-khamr-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Why does Islām prohibit all intoxicants, not just alcohol?',
      options: ['Because they are expensive', 'Because every intoxicant is khamr, and every khamr is ḥarām', 'Because they cause bad breath', 'Because the Qur\'ān only mentions wine'],
      correctAnswer: 'Because every intoxicant is khamr, and every khamr is ḥarām',
      explanation: 'The Prophet ﷺ said: "Every intoxicant is khamr (wine), and every khamr is ḥarām." (Muslim) The ruling covers all substances that cloud the mind or cause intoxication.',
    },
    {
      unitId: unitIntoxicants.id,
      externalId: 'maktab-5-khamr-q2',
      type: 'TRUE_FALSE',
      questionText: 'Drinking a small amount of alcohol that does not cause intoxication is permissible in Islām.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Prophet ﷺ said: "Whatever intoxicates in large quantities, a small quantity of it is also ḥarām." There is no minimum threshold — even a drop is ḥarām.',
    },
    {
      unitId: unitIntoxicants.id,
      externalId: 'maktab-5-khamr-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'According to the Ḥadīth, how many categories of people connected to khamr are cursed?',
      options: ['3', '5', '7', '10'],
      correctAnswer: '10',
      explanation: 'The Prophet ﷺ cursed ten people connected to khamr: the one who presses it, the one it is pressed for, the one who drinks it, the one who carries it, the one it is carried to, the one who serves it, the seller, the buyer, the one who spends its price, and the one who is given it.',
    },
    {
      unitId: unitIntoxicants.id,
      externalId: 'maktab-5-khamr-q4',
      type: 'TRUE_FALSE',
      questionText: 'Khamr is described in the Qur\'ān as "filth from the work of Shayṭān."',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Allāh says in Sūrah al-Mā\'idah (5:90): "O you who believe! Intoxicants, gambling, idols, and divining arrows are filth (rijs) from the work of Shayṭān, so avoid it." (Qur\'ān 5:90)',
    },
    {
      unitId: unitIntoxicants.id,
      externalId: 'maktab-5-khamr-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What was the social impact when Allāh\'s final prohibition of khamr was revealed?',
      options: ['Most Muslims ignored it', 'The Ṣaḥābah immediately poured out all their wine in the streets of Madinah', 'A gradual phase-out over 10 years was ordered', 'Only wine from grapes was prohibited'],
      correctAnswer: 'The Ṣaḥābah immediately poured out all their wine in the streets of Madinah',
      explanation: 'When the final prohibition was revealed (Sūrah al-Mā\'idah 5:90), the Ṣaḥābah poured out their wine in the streets of Madinah, showing their complete obedience to Allāh\'s command.',
    },

    // ── Unit 8: Character (Ḥusn al-Khuluq) ──
    {
      unitId: unitCharacter.id,
      externalId: 'maktab-5-character-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What does "ḥusn al-khuluq" mean?',
      options: ['Physical cleanliness', 'Good character and fine manners', 'Regular charity-giving', 'Memorising hadith'],
      correctAnswer: 'Good character and fine manners',
      explanation: 'Ḥusn al-khuluq means good moral character — being kind, honest, gentle, patient, and generous in dealings with others. The Prophet ﷺ said he was sent to perfect good character.',
    },
    {
      unitId: unitCharacter.id,
      externalId: 'maktab-5-character-q2',
      type: 'TRUE_FALSE',
      questionText: 'The Prophet ﷺ said that ḥusn al-khuluq (good character) is the heaviest thing on the scale of deeds on the Day of Judgement.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet ﷺ said: "Nothing is heavier on the scale of the believer on the Day of Resurrection than good character." (Abū Dāwūd, Tirmidhī)',
    },
    {
      unitId: unitCharacter.id,
      externalId: 'maktab-5-character-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following is an example of good character (ḥusn al-khuluq)?',
      options: ['Returning harm with harm', 'Speaking kindly and forgiving others', 'Arguing with those who disagree', 'Ignoring the needy'],
      correctAnswer: 'Speaking kindly and forgiving others',
      explanation: 'Good character includes kindness, forgiveness, smiling, honesty, helping others, and controlling one\'s anger. The Prophet ﷺ embodied these qualities and commanded us to develop them.',
    },
    {
      unitId: unitCharacter.id,
      externalId: 'maktab-5-character-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'The Prophet ﷺ said: "I was sent to perfect ______."',
      options: ['The prayer', 'The laws of trade', 'Good character (makārim al-akhlāq)', 'Arabic language'],
      correctAnswer: 'Good character (makārim al-akhlāq)',
      explanation: 'The Prophet ﷺ said: "I was sent only to perfect good character (makārim al-akhlāq)." (Aḥmad, Mālik) This shows that character is central to the Islamic mission.',
    },
    {
      unitId: unitCharacter.id,
      externalId: 'maktab-5-character-q5',
      type: 'TRUE_FALSE',
      questionText: 'A person with bad character but many prayers and fasts will be closest to the Prophet ﷺ in Jannah.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Prophet ﷺ said those who are closest to him in Jannah are those with the best character. Bad character is not compensated by quantity of worship alone.',
    },

    // ── Unit 9: Treaty of Ḥudaybiyah ──
    {
      unitId: unitHudaybiyah.id,
      externalId: 'maktab-5-hudaybiyah-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'In which year (AH) did the Treaty of Ḥudaybiyah take place?',
      options: ['4 AH', '6 AH', '8 AH', '10 AH'],
      correctAnswer: '6 AH',
      explanation: 'The Treaty of Ḥudaybiyah was concluded in 6 AH (628 CE) when the Prophet ﷺ and approximately 1,400 companions travelled to Makkah for \'Umrah.',
    },
    {
      unitId: unitHudaybiyah.id,
      externalId: 'maktab-5-hudaybiyah-q2',
      type: 'TRUE_FALSE',
      questionText: 'The Qur\'ān refers to the Treaty of Ḥudaybiyah as a "clear victory" (fatḥun mubīn).',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Sūrah al-Fatḥ (Chapter 48) begins: "Indeed, We have granted you a clear victory." This was revealed about the Treaty of Ḥudaybiyah, showing that this apparently unfavourable treaty was in reality a great victory.',
    },
    {
      unitId: unitHudaybiyah.id,
      externalId: 'maktab-5-hudaybiyah-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What was the Bay\'ah al-Riḍwān?',
      options: ['The pledge the Makkans took to fight', 'The oath of allegiance the companions gave to the Prophet ﷺ under a tree at Ḥudaybiyah', 'A peace agreement signed at Ḥudaybiyah', 'The pledge of the Anṣār at \'Aqabah'],
      correctAnswer: 'The oath of allegiance the companions gave to the Prophet ﷺ under a tree at Ḥudaybiyah',
      explanation: 'Bay\'ah al-Riḍwān (the Pledge of Allāh\'s Pleasure) was the oath companions gave under a tree at Ḥudaybiyah, pledging to stand by the Prophet ﷺ. Allāh praised them in the Qur\'ān (48:18).',
    },
    {
      unitId: unitHudaybiyah.id,
      externalId: 'maktab-5-hudaybiyah-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What did the Quraysh insist be removed from the treaty document?',
      options: ['The date of the treaty', 'The phrase "Muḥammad, the Messenger of Allāh" — only "Muḥammad ibn \'Abdullāh" was acceptable', 'The number of Muslims', 'The amount of tribute to be paid'],
      correctAnswer: 'The phrase "Muḥammad, the Messenger of Allāh" — only "Muḥammad ibn \'Abdullāh" was acceptable',
      explanation: 'The Quraysh refused to recognise Muḥammad ﷺ as the Messenger of Allāh. The Prophet ﷺ agreed to write "Muḥammad ibn \'Abdullāh" instead, showing his patience and wisdom.',
    },
    {
      unitId: unitHudaybiyah.id,
      externalId: 'maktab-5-hudaybiyah-q5',
      type: 'TRUE_FALSE',
      questionText: 'Under the Treaty of Ḥudaybiyah, the Muslims agreed to return to Madinah without performing \'Umrah that year.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'One of the terms was that Muslims would return to Madinah that year and come back for \'Umrah the following year. This was difficult for the Ṣaḥābah, but they obeyed the Prophet ﷺ.',
    },

    // ── Unit 10: Fatḥ Makkah ──
    {
      unitId: unitFath.id,
      externalId: 'maktab-5-fath-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What triggered the Conquest of Makkah in 8 AH?',
      options: ['The Quraysh raided Madinah', 'The Quraysh violated the Treaty of Ḥudaybiyah by attacking the Banū Khuzā\'ah tribe', 'The Muslims ran out of food', 'A revelation ordering attack on Makkah'],
      correctAnswer: 'The Quraysh violated the Treaty of Ḥudaybiyah by attacking the Banū Khuzā\'ah tribe',
      explanation: 'The Quraysh allied tribe (Banū Bakr) attacked the Banū Khuzā\'ah — allies of the Muslims — in violation of the Ḥudaybiyah treaty. This gave the Prophet ﷺ the legal cause to march on Makkah.',
    },
    {
      unitId: unitFath.id,
      externalId: 'maktab-5-fath-q2',
      type: 'TRUE_FALSE',
      questionText: 'The Conquest of Makkah was largely bloodless because the Prophet ﷺ declared a general amnesty.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'When the Prophet ﷺ entered Makkah victorious, he declared a general amnesty saying: "Go, for you are free." This was a remarkable act of forgiveness for people who had persecuted Muslims for years.',
    },
    {
      unitId: unitFath.id,
      externalId: 'maktab-5-fath-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many idols did the Prophet ﷺ destroy upon entering the Ka\'bah?',
      options: ['12', '50', '360', '100'],
      correctAnswer: '360',
      explanation: 'There were 360 idols around and inside the Ka\'bah. The Prophet ﷺ knocked them down with his staff, reciting: "Truth has come, and falsehood has perished." (Qur\'ān 17:81)',
    },
    {
      unitId: unitFath.id,
      externalId: 'maktab-5-fath-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Who gave the first adhān (call to prayer) from the roof of the Ka\'bah after the Conquest of Makkah?',
      options: ['Abū Bakr رضي الله عنه', 'Bilāl ibn Rabāḥ رضي الله عنه', '\'Umar ibn al-Khaṭṭāb رضي الله عنه', '\'Alī ibn Abī Ṭālib رضي الله عنه'],
      correctAnswer: 'Bilāl ibn Rabāḥ رضي الله عنه',
      explanation: 'The Prophet ﷺ commanded Bilāl رضي الله عنه — the freed slave who had been tortured for his faith — to give the adhān from the roof of the Ka\'bah. This was deeply symbolic.',
    },
    {
      unitId: unitFath.id,
      externalId: 'maktab-5-fath-q5',
      type: 'TRUE_FALSE',
      questionText: 'After the Conquest of Makkah, Makkah became the new capital of the Islamic state and the Prophet ﷺ moved there permanently.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Prophet ﷺ stayed in Makkah for only a short time after the conquest, then returned to Madinah, which remained the capital of the Islamic state.',
    },

    // ── Unit 11: Farewell Sermon ──
    {
      unitId: unitFarewell.id,
      externalId: 'maktab-5-farewell-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'In which year of the Hijrah did the Prophet ﷺ deliver his Farewell Sermon?',
      options: ['8 AH', '9 AH', '10 AH', '11 AH'],
      correctAnswer: '10 AH',
      explanation: 'The Prophet ﷺ delivered the Farewell Sermon (Khuṭbat al-Wadā\') during his Farewell Ḥajj in 10 AH (632 CE), on the 9th of Dhul Ḥijjah at the plain of \'Arafāt.',
    },
    {
      unitId: unitFarewell.id,
      externalId: 'maktab-5-farewell-q2',
      type: 'TRUE_FALSE',
      questionText: 'The Farewell Sermon declared the completion of the religion of Islām.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'During the sermon, Allāh revealed: "This day I have perfected your religion for you, completed My favour upon you, and chosen Islām as your religion." (Qur\'ān 5:3) This marked the completion of the divine revelation.',
    },
    {
      unitId: unitFarewell.id,
      externalId: 'maktab-5-farewell-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What did the Prophet ﷺ say about the rights of women in the Farewell Sermon?',
      options: ['Women have no rights in matters of property', 'Fear Allāh regarding women — they have rights over you as you have rights over them', 'Women must obey men in all matters without question', 'Only widows have special rights'],
      correctAnswer: 'Fear Allāh regarding women — they have rights over you as you have rights over them',
      explanation: 'The Prophet ﷺ commanded men to fear Allāh in their treatment of women and reminded them that women have rights, just as men have rights. This was a landmark declaration of women\'s rights.',
    },
    {
      unitId: unitFarewell.id,
      externalId: 'maktab-5-farewell-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'The Prophet ﷺ declared in the Farewell Sermon: "I am leaving among you two things..."  What are they?',
      options: ['Gold and silver', 'The Qur\'ān and the Sunnah (his example)', 'His companions and his family', 'Prayer and zakāh'],
      correctAnswer: 'The Qur\'ān and the Sunnah (his example)',
      explanation: 'The Prophet ﷺ said: "I am leaving among you two things — if you hold fast to them you will never go astray: the Book of Allāh and my Sunnah."',
    },
    {
      unitId: unitFarewell.id,
      externalId: 'maktab-5-farewell-q5',
      type: 'TRUE_FALSE',
      questionText: 'The Farewell Sermon declared that all blood feuds and financial debts from the pre-Islamic era (Jāhiliyyah) were abolished.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet ﷺ declared all blood feuds of the pre-Islamic era null and void, and cancelled all pre-Islamic interest debts. This established a clean break from Jāhiliyyah practices.',
    },

    // ── Unit 12: Mūsā ──
    {
      unitId: unitMusa.id,
      externalId: 'maktab-5-musa-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Why is Mūsā عليه السلام given the title "Kalīmullāh"?',
      options: ['He was the only prophet who performed miracles', 'He spoke directly with Allāh at Mount Ṭūr Sīnā', 'He wrote the Tawrāh with his own hand', 'He was the first prophet sent to Banū Isrā\'īl'],
      correctAnswer: 'He spoke directly with Allāh at Mount Ṭūr Sīnā',
      explanation: 'Kalīmullāh means "one who spoke to Allāh." Allāh spoke to Mūsā عليه السلام directly at the burning bush on Mount Ṭūr Sīnā, making him unique in this distinction.',
    },
    {
      unitId: unitMusa.id,
      externalId: 'maktab-5-musa-q2',
      type: 'TRUE_FALSE',
      questionText: 'Mūsā عليه السلام grew up in the palace of Fir\'awn, the very man who had ordered the killing of all newborn boys.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'By Allāh\'s plan, Mūsā عليه السلام was placed in the river Nile in a basket and found by Fir\'awn\'s family. His wife Āsiyah convinced Fir\'awn to adopt him, so Mūsā grew up in Fir\'awn\'s own palace.',
    },
    {
      unitId: unitMusa.id,
      externalId: 'maktab-5-musa-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What two miracles did Allāh give Mūsā عليه السلام to show to Fir\'awn?',
      options: ['Splitting the sea and feeding people', 'His staff turning into a snake and his hand glowing brilliantly white', 'Healing the sick and speaking at the cradle', 'Controlling the wind and rain'],
      correctAnswer: 'His staff turning into a snake and his hand glowing brilliantly white',
      explanation: 'Allāh gave Mūsā عليه السلام two initial miracles: his staff (\'aṣā) turning into a large serpent, and his hand (yad al-bayḍā) glowing brilliantly white without harm. These were his signs to Fir\'awn.',
    },
    {
      unitId: unitMusa.id,
      externalId: 'maktab-5-musa-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What happened when Fir\'awn and his army pursued Banū Isrā\'īl to the sea?',
      options: ['Mūsā عليه السلام defeated them in battle', 'A great storm destroyed Fir\'awn\'s army', 'The sea parted for Banū Isrā\'īl then closed on Fir\'awn\'s army', 'Allāh sent angels to fight for the believers'],
      correctAnswer: 'The sea parted for Banū Isrā\'īl then closed on Fir\'awn\'s army',
      explanation: 'Mūsā عليه السلام struck the sea with his staff; it parted creating dry paths. Banū Isrā\'īl crossed safely. When Fir\'awn\'s army pursued, the sea closed over them and they drowned.',
    },
    {
      unitId: unitMusa.id,
      externalId: 'maktab-5-musa-q5',
      type: 'TRUE_FALSE',
      questionText: 'During Mūsā\'s absence at Mount Ṭūr, Sāmirī led some of Banū Isrā\'īl to worship a golden calf.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'While Mūsā عليه السلام was at Mount Ṭūr receiving the Tawrāh, a man named Sāmirī made a golden calf and some of Banū Isrā\'īl began worshipping it. Mūsā عليه السلام was deeply grieved when he returned.',
    },

    // ── Unit 13: 'Īsā ──
    {
      unitId: unitIsa.id,
      externalId: 'maktab-5-isa-q1',
      type: 'TRUE_FALSE',
      questionText: '\'Īsā عليه السلام was born without a father — this was a miracle from Allāh.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Allāh created \'Īsā عليه السلام without a father by His command "Be!" Allāh compared this to the creation of Ādam عليه السلام who had neither a father nor a mother (Qur\'ān 3:59).',
    },
    {
      unitId: unitIsa.id,
      externalId: 'maktab-5-isa-q2',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What was one of the miracles of \'Īsā عليه السلام that he performed in the cradle?',
      options: ['He healed a blind man', 'He spoke as a newborn, declaring himself a prophet of Allāh', 'He made a bird from clay', 'He split the moon'],
      correctAnswer: 'He spoke as a newborn, declaring himself a prophet of Allāh',
      explanation: '\'Īsā عليه السلام spoke in the cradle: "I am the servant of Allāh. He has given me the Scripture and made me a prophet." (Qur\'ān 19:30) This was to defend his mother Maryam from unjust accusations.',
    },
    {
      unitId: unitIsa.id,
      externalId: 'maktab-5-isa-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'According to the Qur\'ān, what happened when \'Īsā عليه السلام\'s enemies tried to kill him?',
      options: ['He was crucified but came back to life', 'He was killed and buried in Jerusalem', 'He was neither killed nor crucified — Allāh raised him up to the heavens', 'He fled to another country'],
      correctAnswer: 'He was neither killed nor crucified — Allāh raised him up to the heavens',
      explanation: 'The Qur\'ān clearly states: "They did not kill him, nor did they crucify him; but it was made to appear so to them." (4:157) Allāh raised \'Īsā عليه السلام to the heavens.',
    },
    {
      unitId: unitIsa.id,
      externalId: 'maktab-5-isa-q4',
      type: 'TRUE_FALSE',
      questionText: '\'Īsā عليه السلام will return before the Day of Judgement and follow the Sharī\'ah of Muḥammad ﷺ.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Muslims believe \'Īsā عليه السلام is alive in the heavens and will descend near the end of time. He will follow the Sharī\'ah of the Prophet Muḥammad ﷺ, defeat the Dajjāl, and establish justice.',
    },
    {
      unitId: unitIsa.id,
      externalId: 'maktab-5-isa-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What does the Qur\'ānic title "Rūḥullāh" for \'Īsā عليه السلام mean?',
      options: ['The Word of Allāh', 'The Spirit of Allāh — indicating Allāh breathed His spirit into him through the angel Jibrīl', 'The Friend of Allāh', 'The Prophet of Allāh'],
      correctAnswer: 'The Spirit of Allāh — indicating Allāh breathed His spirit into him through the angel Jibrīl',
      explanation: '\'Īsā عليه السلام is called Rūḥullāh (Spirit of Allāh) because Allāh commanded the angel Jibrīl to breathe into Maryam, creating \'Īsā without a father. It is an honourific, not a claim of divinity.',
    },

    // ── Unit 14: Death & Grave ──
    {
      unitId: unitDeathGrave.id,
      externalId: 'maktab-5-death-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What are the three questions asked by the angels Munkar and Nakīr in the grave?',
      options: ['About prayer, fasting, and zakāh', '"Who is your Lord?", "What is your religion?", "Who is this man (Muḥammad ﷺ)?"', '"What did you eat?", "How did you live?", "Did you pray?"', '"Where did you die?", "Who buried you?", "Did you repent?"'],
      correctAnswer: '"Who is your Lord?", "What is your religion?", "Who is this man (Muḥammad ﷺ)?"',
      explanation: 'The angels Munkar and Nakīr ask three questions: (1) "Who is your Lord?" (2) "What is your religion?" (3) "Who is this man?" — referring to the Prophet ﷺ. The believer answers correctly and is shown their place in Jannah.',
    },
    {
      unitId: unitDeathGrave.id,
      externalId: 'maktab-5-death-q2',
      type: 'TRUE_FALSE',
      questionText: 'Barzakh is the period between a person\'s death and the Day of Resurrection.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Barzakh literally means "barrier" and refers to the state and period between death and resurrection. The soul remains in this intermediate state until Yawm al-Qiyāmah.',
    },
    {
      unitId: unitDeathGrave.id,
      externalId: 'maktab-5-death-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What does the Prophet ﷺ compare the grave to, based on a person\'s faith?',
      options: ['A home they chose in life', 'Either a garden from the gardens of Jannah or a pit from the pits of Jahannam', 'A neutral resting place for all', 'A dark empty space'],
      correctAnswer: 'Either a garden from the gardens of Jannah or a pit from the pits of Jahannam',
      explanation: 'The Prophet ﷺ said: "The grave is either a garden from the gardens of Jannah or a pit from the pits of Jahannam." The believer enjoys comfort while the disbeliever faces punishment.',
    },
    {
      unitId: unitDeathGrave.id,
      externalId: 'maktab-5-death-q4',
      type: 'TRUE_FALSE',
      questionText: 'The angel of death is named \'Izrā\'īl عليه السلام.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The angel of death is \'Izrā\'īl عليه السلام (Malak al-Mawt). He comes to every soul at the appointed time of death.',
    },
    {
      unitId: unitDeathGrave.id,
      externalId: 'maktab-5-death-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is sakrāt al-mawt?',
      options: ['The angel of death', 'The pangs and agonies of death experienced at the moment of dying', 'The moment the soul enters Jannah', 'The questioning in the grave'],
      correctAnswer: 'The pangs and agonies of death experienced at the moment of dying',
      explanation: 'Sakrāt al-mawt refers to the pangs, struggles, and agonies experienced at the point of death. The Prophet ﷺ himself experienced this and we make du\'ā\' for ease at the time of death.',
    },

    // ── Unit 15: Jannah & Jahannam ──
    {
      unitId: unitJannah.id,
      externalId: 'maktab-5-jannah-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the A\'rāf?',
      options: ['Another name for Jannah', 'A barrier between Jannah and Jahannam where some await Allāh\'s final judgement', 'The bridge over Jahannam', 'The first level of Jannah'],
      correctAnswer: 'A barrier between Jannah and Jahannam where some await Allāh\'s final judgement',
      explanation: 'A\'rāf is a barrier (partition) between Jannah and Jahannam. Some people whose good and bad deeds are equal will stand there, awaiting Allāh\'s final decision about their fate.',
    },
    {
      unitId: unitJannah.id,
      externalId: 'maktab-5-jannah-q2',
      type: 'TRUE_FALSE',
      questionText: 'The greatest reward in Jannah is seeing the Face of Allāh.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet ﷺ confirmed that the believers in Jannah will see Allāh\'s Face. This "ru\'yat Allāh" (vision of Allāh) is described as the most beloved and greatest blessing in Jannah.',
    },
    {
      unitId: unitJannah.id,
      externalId: 'maktab-5-jannah-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'How many gates does Jannah have?',
      options: ['4', '6', '7', '8'],
      correctAnswer: '8',
      explanation: 'Jannah has eight gates. Each gate is associated with a type of worship (e.g., Gate of Prayer, Gate of Ṣadaqah, Gate of Fasting — Bāb al-Rayyān). Jahannam has seven gates.',
    },
    {
      unitId: unitJannah.id,
      externalId: 'maktab-5-jannah-q4',
      type: 'TRUE_FALSE',
      questionText: 'Muslims who committed major sins may be punished in Jahannam temporarily before entering Jannah by Allāh\'s mercy.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'According to Ahl al-Sunnah, sinful Muslims may enter Jahannam temporarily as a purification for their sins. Eventually they will exit by Allāh\'s mercy and the intercession of the Prophet ﷺ. Only kuffār remain forever.',
    },
    {
      unitId: unitJannah.id,
      externalId: 'maktab-5-jannah-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the name of the bridge that everyone must cross over Jahannam?',
      options: ['Al-Mīzān', 'Al-Ṣirāṭ', 'Al-A\'rāf', 'Al-Ḥawḍ'],
      correctAnswer: 'Al-Ṣirāṭ',
      explanation: 'Al-Ṣirāṭ is the bridge stretched over Jahannam. Believers will cross it at speeds proportional to their faith and deeds. Some cross like lightning, others like wind, others slowly and laboriously.',
    },

    // ── Unit 16: Al-Qadr ──
    {
      unitId: unitQadr.id,
      externalId: 'maktab-5-qadr-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Belief in al-Qadr is which pillar of Īmān?',
      options: ['Third', 'Fourth', 'Fifth', 'Sixth'],
      correctAnswer: 'Sixth',
      explanation: 'The six pillars of Īmān are: Allāh, angels, revealed books, messengers, the Last Day, and al-Qadr (divine decree). Belief in al-Qadr is the sixth and final pillar.',
    },
    {
      unitId: unitQadr.id,
      externalId: 'maktab-5-qadr-q2',
      type: 'TRUE_FALSE',
      questionText: 'According to Islamic belief, everything was written in al-Lawḥ al-Maḥfūẓ (the Preserved Tablet) 50,000 years before the creation of the heavens and earth.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet ﷺ said: "Allāh wrote the decrees of all creation 50,000 years before He created the heavens and earth." (Muslim) This written decree is al-Lawḥ al-Maḥfūẓ.',
    },
    {
      unitId: unitQadr.id,
      externalId: 'maktab-5-qadr-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following is NOT one of the four aspects of al-Qadr?',
      options: ['Ilm (Allāh\'s knowledge)', 'Kitābah (Divine writing)', 'Tawbah (Repentance)', 'Khalq (Creation by Allāh)'],
      correctAnswer: 'Tawbah (Repentance)',
      explanation: 'The four aspects of al-Qadr are: (1) Ilm — Allāh\'s knowledge, (2) Kitābah — writing in the Preserved Tablet, (3) Mashī\'ah — Allāh\'s will, (4) Khalq — Allāh\'s creation. Tawbah (repentance) is not an aspect of al-Qadr.',
    },
    {
      unitId: unitQadr.id,
      externalId: 'maktab-5-qadr-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the du\'ā\' the Prophet ﷺ taught to recite on Laylat al-Qadr?',
      options: [
        'Subḥānallāhi wa biḥamdihi, subḥānallāhil-\'aẓīm',
        'Allāhumma innaka \'afuwwun tuḥibbul-\'afwa fa\'fu \'annī',
        'Allāhumma ṣalli \'alā Muḥammad',
        'Lā ilāha illallāhu waḥdahu lā sharīka lah'
      ],
      correctAnswer: 'Allāhumma innaka \'afuwwun tuḥibbul-\'afwa fa\'fu \'annī',
      explanation: 'This du\'ā\' means: "O Allāh, You are Most Forgiving and You love forgiveness, so forgive me." It was taught by the Prophet ﷺ when \'Ā\'ishah رضي الله عنها asked what to say on Laylat al-Qadr.',
    },
    {
      unitId: unitQadr.id,
      externalId: 'maktab-5-qadr-q5',
      type: 'TRUE_FALSE',
      questionText: 'Belief in al-Qadr means humans have no responsibility for their actions since everything is pre-determined.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Allāh gave humans free will and intellect. We choose our actions and are accountable for them. Belief in al-Qadr gives peace of mind but does not remove personal responsibility.',
    },

    // ── Unit 17: Mashwarah & Ṣabr ──
    {
      unitId: unitMashwarah.id,
      externalId: 'maktab-5-mashwarah-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What does the Qur\'ān command the Prophet ﷺ regarding mashwarah?',
      options: ['To make all decisions alone without consultation', '"And consult them in the matter" (Qur\'ān 3:159)', 'To consult only the senior companions', '"Do not seek counsel from those of lesser knowledge"'],
      correctAnswer: '"And consult them in the matter" (Qur\'ān 3:159)',
      explanation: 'Allāh commanded the Prophet ﷺ: "Wa shāwirhum fī al-amr" — "And consult them in the matter." (3:159) This shows the importance of mashwarah even for the best of creation.',
    },
    {
      unitId: unitMashwarah.id,
      externalId: 'maktab-5-mashwarah-q2',
      type: 'TRUE_FALSE',
      questionText: 'Ṣabr (patience) is only required when facing loss or tragedy — it is not needed in worship.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'There are three types of ṣabr: (1) in obeying Allāh, (2) in refraining from sin, and (3) in the face of adversity. Ṣabr is required in all three areas of a Muslim\'s life.',
    },
    {
      unitId: unitMashwarah.id,
      externalId: 'maktab-5-mashwarah-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Allāh promises in the Qur\'ān: "Indeed, Allāh is with ______."',
      options: ['the wealthy', 'those who pray the most', 'those who are patient (al-ṣābirīn)', 'those who fast'],
      correctAnswer: 'those who are patient (al-ṣābirīn)',
      explanation: 'Allāh says: "Inna Allāha ma\'a al-ṣābirīn" — "Indeed, Allāh is with those who are patient." (Qur\'ān 2:153) This is a tremendous promise — divine companionship for those who persevere.',
    },
    {
      unitId: unitMashwarah.id,
      externalId: 'maktab-5-mashwarah-q4',
      type: 'TRUE_FALSE',
      questionText: 'When seeking mashwarah (counsel), one should consult knowledgeable, trustworthy, and sincere advisors.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The scholars teach that mashwarah is only beneficial when sought from those who are knowledgeable in the relevant area, trustworthy in their advice, and sincere (not self-interested).',
    },
    {
      unitId: unitMashwarah.id,
      externalId: 'maktab-5-mashwarah-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which type of ṣabr involves refraining from sin even when one is tempted?',
      options: ['Ṣabr in obeying Allāh', 'Ṣabr in refraining from sin (ṣabr \'an al-ma\'āṣī)', 'Ṣabr in the face of adversity', 'Ṣabr in wealth'],
      correctAnswer: 'Ṣabr in refraining from sin (ṣabr \'an al-ma\'āṣī)',
      explanation: 'Ṣabr \'an al-ma\'āṣī means holding oneself back from what Allāh has forbidden, even when one desires it. This is one of the three types of patience identified by the scholars.',
    },

    // ── Unit 18: Ṣilah & Gifts ──
    {
      unitId: unitSilah.id,
      externalId: 'maktab-5-silah-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What does ṣilah al-raḥim mean?',
      options: ['Giving charity to the poor', 'Maintaining and strengthening ties with one\'s relatives', 'Visiting the sick', 'Performing Ḥajj with family'],
      correctAnswer: 'Maintaining and strengthening ties with one\'s relatives',
      explanation: 'Ṣilah al-raḥim means connecting the \'womb-ties\' — maintaining good relations with one\'s relatives through visits, gifts, kind words, and support.',
    },
    {
      unitId: unitSilah.id,
      externalId: 'maktab-5-silah-q2',
      type: 'TRUE_FALSE',
      questionText: 'The Prophet ﷺ said that maintaining family ties expands one\'s provision (rizq) and extends one\'s lifespan.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet ﷺ said: "Whoever wishes his provision to be expanded and his lifespan extended, let him maintain kinship ties." (Bukhārī & Muslim) This is a tremendous worldly benefit of ṣilah al-raḥim.',
    },
    {
      unitId: unitSilah.id,
      externalId: 'maktab-5-silah-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Why did the Prophet ﷺ recommend exchanging gifts?',
      options: ['To show off one\'s wealth', 'Gifts remove ill-feelings and increase love between people', 'To fulfil a religious obligation', 'To compensate for missed prayers'],
      correctAnswer: 'Gifts remove ill-feelings and increase love between people',
      explanation: 'The Prophet ﷺ said: "Exchange gifts, for gifts increase love between you and remove ill-feelings." Giving gifts is a powerful way to strengthen relationships.',
    },
    {
      unitId: unitSilah.id,
      externalId: 'maktab-5-silah-q4',
      type: 'TRUE_FALSE',
      questionText: 'A Muslim who severs family ties (qāṭi\' al-raḥim) is strongly warned against in the Qur\'ān.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Allāh curses those who sever family ties (Qur\'ān 47:22-23). The qāṭi\' al-raḥim (one who cuts kinship ties) will be deprived of Allāh\'s mercy and blessings.',
    },
    {
      unitId: unitSilah.id,
      externalId: 'maktab-5-silah-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the recommended du\'ā\' to say to someone who gives you a gift?',
      options: ['Alḥamdulillāh', 'Jazākallāhu khayran', 'InshāAllāh', 'SubḥānAllāh'],
      correctAnswer: 'Jazākallāhu khayran',
      explanation: '"Jazākallāhu khayran" means "May Allāh reward you with good." The Prophet ﷺ taught this as the best way to thank someone who does good to you.',
    },

    // ── Unit 19: Dhikr, Shukr & Tawbah ──
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-5-dhikr-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What does the Qur\'ān say about the effect of Allāh\'s remembrance (dhikr) on the heart?',
      options: ['It makes the heart heavy', '"Verily, in the remembrance of Allāh do hearts find rest"', '"Those who remember Allāh will be given wealth"', 'It is only required once a day'],
      correctAnswer: '"Verily, in the remembrance of Allāh do hearts find rest"',
      explanation: 'Allāh says: "Alā bi-dhikrillāhi taṭma\'inn al-qulūb" — "Verily, in the remembrance of Allāh do hearts find rest." (Qur\'ān 13:28) Dhikr is the cure for anxiety and spiritual emptiness.',
    },
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-5-dhikr-q2',
      type: 'TRUE_FALSE',
      questionText: 'Shukr (gratitude) is expressed only by the tongue — saying Alḥamdulillāh.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Shukr has three dimensions: (1) the heart — recognising blessings come from Allāh; (2) the tongue — saying Alḥamdulillāh; (3) actions — using blessings in Allāh\'s obedience. All three are required for complete gratitude.',
    },
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-5-dhikr-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Allāh promises in the Qur\'ān: "If you are grateful, I will certainly give you ______."',
      options: ['Jannah immediately', 'More (blessings)', 'A long life', 'Victory over your enemies'],
      correctAnswer: 'More (blessings)',
      explanation: 'Allāh says: "La\'in shakartum la-azīdannakum" — "If you are grateful, I will certainly give you more." (Qur\'ān 14:7) Gratitude is a means of increasing blessings.',
    },
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-5-dhikr-q4',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following is NOT one of the four conditions of sincere tawbah?',
      options: ['Stopping the sin immediately', 'Feeling genuine remorse', 'Performing extra prayers as punishment', 'Resolving not to return to the sin'],
      correctAnswer: 'Performing extra prayers as punishment',
      explanation: 'The four conditions of tawbah are: (1) stop the sin, (2) feel remorse, (3) resolve not to return, (4) if someone\'s rights were violated, make amends to them. Extra prayers as "punishment" is not a condition.',
    },
    {
      unitId: unitDhikr.id,
      externalId: 'maktab-5-dhikr-q5',
      type: 'TRUE_FALSE',
      questionText: 'Allāh loves those who repent (tawwābīn) and those who purify themselves.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Allāh says: "Inna Allāha yuḥibbu al-tawwābīn wa yuḥibbu al-mutaṭahhirīn" — "Truly, Allāh loves those who repent and loves those who purify themselves." (Qur\'ān 2:222)',
    },

    // ── Unit 20: Ghusl & Miswāk ──
    {
      unitId: unitGhusl.id,
      externalId: 'maktab-5-ghusl-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following makes ghusl (full ritual bath) obligatory (farḍ)?',
      options: ['Sleeping during the day', 'Cessation of menstruation (ḥayḍ)', 'Eating meat', 'Touching a non-Muslim'],
      correctAnswer: 'Cessation of menstruation (ḥayḍ)',
      explanation: 'Ghusl is farḍ after: janābah (sexual discharge), cessation of ḥayḍ (menstruation), cessation of nifās (post-natal bleeding), and upon accepting Islām. Sleeping, eating, or touching others do not require ghusl.',
    },
    {
      unitId: unitGhusl.id,
      externalId: 'maktab-5-ghusl-q2',
      type: 'TRUE_FALSE',
      questionText: 'Ghusl before the Jumu\'ah prayer is sunnah, not farḍ.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Ghusl on Friday before Jumu\'ah is a strongly emphasised sunnah (sunnah mu\'akkadah). It is not farḍ, but the Prophet ﷺ highly recommended it.',
    },
    {
      unitId: unitGhusl.id,
      externalId: 'maktab-5-ghusl-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the sunnah method of performing ghusl?',
      options: ['Just pour water over the body once', 'Wash hands → wash private parts → perform wuḍū\' → pour water over body 3 times starting with right side', 'Only wash the face and head', 'Make niyyah and stand under running water'],
      correctAnswer: 'Wash hands → wash private parts → perform wuḍū\' → pour water over body 3 times starting with right side',
      explanation: 'The sunnah method: (1) make niyyah, (2) wash both hands three times, (3) wash private parts, (4) perform full wuḍū\', (5) pour water over entire body three times starting from the right side.',
    },
    {
      unitId: unitGhusl.id,
      externalId: 'maktab-5-ghusl-q4',
      type: 'TRUE_FALSE',
      questionText: 'The Prophet ﷺ said that had it not been a hardship, he would have made miswāk obligatory with every prayer.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet ﷺ said: "Were it not for my concern for my Ummah, I would have commanded them to use the miswāk with every prayer." This shows how strongly he recommended it.',
    },
    {
      unitId: unitGhusl.id,
      externalId: 'maktab-5-ghusl-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'When is it recommended (sunnah) to use the miswāk?',
      options: ['Only before Friday prayer', 'Before every ṣalāh, upon waking, when entering the home, and before reading the Qur\'ān', 'Once a day after Fajr', 'Only in Ramaḍān'],
      correctAnswer: 'Before every ṣalāh, upon waking, when entering the home, and before reading the Qur\'ān',
      explanation: 'The sunnah is to use the miswāk before every prayer, when waking up, when entering the home, and before reciting the Qur\'ān — basically as a constant habit of oral cleanliness.',
    },

    // ── Unit 21: Social & Writing ──
    {
      unitId: unitSocial.id,
      externalId: 'maktab-5-social-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'According to Islamic etiquette, who gives salām first when a person is walking towards a seated person?',
      options: ['The seated person greets the walker', 'The walker gives salām to the seated person', 'The younger person always gives salām first regardless', 'There is no rule — whoever speaks first'],
      correctAnswer: 'The walker gives salām to the seated person',
      explanation: 'The Prophet ﷺ taught: the walker gives salām to the sitting, the smaller group to the larger, and the younger to the elder. These are guidelines of Islamic social etiquette.',
    },
    {
      unitId: unitSocial.id,
      externalId: 'maktab-5-social-q2',
      type: 'TRUE_FALSE',
      questionText: 'According to the Qur\'ān, a Muslim should seek permission before entering someone else\'s home.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Allāh says: "Do not enter homes other than your own until you have sought permission and greeted those inside." (Qur\'ān 24:27) Seeking permission (istidhan) is a Qur\'ānic command.',
    },
    {
      unitId: unitSocial.id,
      externalId: 'maktab-5-social-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'If you seek permission to enter a home three times and receive no response, what should you do?',
      options: ['Enter anyway, they may not have heard', 'Wait an hour and try again', 'Turn away and leave', 'Call out loudly until someone answers'],
      correctAnswer: 'Turn away and leave',
      explanation: 'The sunnah is to seek permission three times. If there is no response after three attempts, one should turn away and leave. Forcing entry is not permissible.',
    },
    {
      unitId: unitSocial.id,
      externalId: 'maktab-5-social-q4',
      type: 'TRUE_FALSE',
      questionText: 'The Prophet ﷺ sent letters beginning with "Bismillāh al-Raḥmān al-Raḥīm" to the rulers of neighbouring empires.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet ﷺ sent da\'wah letters to rulers including Heraclius (Byzantine Emperor), Chosroes (Persian Emperor), and the Negus (King of Ethiopia). Each letter began with Bismillāh and invited them to Islām.',
    },
    {
      unitId: unitSocial.id,
      externalId: 'maktab-5-social-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What is the full Islamic greeting?',
      options: ['Salāmun \'alaykum', 'Al-Salāmu \'alaykum wa raḥmatullāhi wa barakātuh', 'Wa \'alaykum al-salām', 'Bismillāh al-Raḥmān al-Raḥīm'],
      correctAnswer: 'Al-Salāmu \'alaykum wa raḥmatullāhi wa barakātuh',
      explanation: 'The full salām is: "Al-Salāmu \'alaykum wa raḥmatullāhi wa barakātuh" — "Peace be upon you, and the mercy and blessings of Allāh." Saying the full version carries the greatest reward.',
    },

    // ── Unit 22: Visiting the Sick ──
    {
      unitId: unitSick.id,
      externalId: 'maktab-5-sick-q1',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Visiting the sick is one of the rights of a Muslim upon another Muslim. The Prophet ﷺ said the visitor "continues to be in the ________ of Jannah."',
      options: ['Khurfah (fruit garden)', 'Centre', 'Entrance', 'Shade'],
      correctAnswer: 'Khurfah (fruit garden)',
      explanation: 'The Prophet ﷺ said: "Whoever visits a sick person continues to be in the khurfah of Jannah until they return home." Khurfah refers to the fruits and gardens of Jannah — a beautiful description of the reward.',
    },
    {
      unitId: unitSick.id,
      externalId: 'maktab-5-sick-q2',
      type: 'TRUE_FALSE',
      questionText: 'When visiting the sick, the visit should be kept short so as not to tire the patient.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Islamic etiquette of visiting the sick includes keeping the visit brief. The purpose is to comfort the patient, not burden them with a long stay when they need rest.',
    },
    {
      unitId: unitSick.id,
      externalId: 'maktab-5-sick-q3',
      type: 'MULTIPLE_CHOICE',
      questionText: 'What du\'ā\' did the Prophet ﷺ teach to say to a sick person meaning "Do not worry, it is a purification"?',
      options: [
        'Allāhumma āfihī wa \'āfinī',
        'Lā ba\'sa ṭahūrun in shā\' Allāh',
        'Adhhibil-ba\'sa rabb al-nās',
        'Allāhumma rabbil-nās udhhibil-ba\'s'
      ],
      correctAnswer: 'Lā ba\'sa ṭahūrun in shā\' Allāh',
      explanation: '"Lā ba\'sa ṭahūrun in shā\' Allāh" means "Do not worry, it is a purification, in shā\' Allāh." The Prophet ﷺ taught this to comfort the sick by reminding them their suffering purifies them of sins.',
    },
    {
      unitId: unitSick.id,
      externalId: 'maktab-5-sick-q4',
      type: 'TRUE_FALSE',
      questionText: 'The Prophet ﷺ taught that every pain, worry, and illness a Muslim suffers — even the prick of a thorn — is an expiation for sins.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet ﷺ said: "No fatigue, illness, worry, grief, harm, or distress afflicts a Muslim — even the prick of a thorn — except that Allāh expiates some of his sins through it." (Bukhārī & Muslim)',
    },
    {
      unitId: unitSick.id,
      externalId: 'maktab-5-sick-q5',
      type: 'MULTIPLE_CHOICE',
      questionText: 'Which du\'ā\' did the Prophet ﷺ place his hand on the sick person and recite, asking Allāh for a cure that leaves no illness behind?',
      options: [
        'Allāhumma āfihī',
        'Adhhibil-ba\'sa rabb al-nās, washfi antash-shāfī, lā shifā\'a illā shifā\'uk, shifā\'an lā yughādiru saqamā',
        'Lā ba\'sa ṭahūrun in shā\' Allāh',
        'Allāhumma innaka \'afuwwun'
      ],
      correctAnswer: 'Adhhibil-ba\'sa rabb al-nās, washfi antash-shāfī, lā shifā\'a illā shifā\'uk, shifā\'an lā yughādiru saqamā',
      explanation: 'This du\'ā\' means: "Remove the hardship, O Lord of mankind! Grant cure — You are the One who cures. There is no cure except Your cure — a cure that leaves no illness behind." The Prophet ﷺ would recite it while placing his hand on the sick person.',
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
  // FLASHCARDS — redistributed across 22 units
  // ══════════════════════════════════════════════

  const flashcardData: Array<{
    unitId: string;
    front: string;
    back: string;
    externalId?: string;
  }> = [
    // ── Wuḍū' unit flashcards ──
    { unitId: unitWudu.id, front: 'What are the 4 farā\'iḍ of wuḍū\'?', back: '1. Washing the face\n2. Washing both arms to the elbows\n3. Masaḥ (wiping) of a quarter of the head\n4. Washing both feet to the ankles' },
    { unitId: unitWudu.id, front: 'What are the nawāqiḍ (nullifiers) of wuḍū\'?', back: 'Anything that exits from the front or back passage, deep sleep, loss of consciousness, laughing aloud in ṣalāh, and flowing blood leaving its place.' },
    { unitId: unitWudu.id, front: 'What is masaḥ in wuḍū\'?', back: 'Masaḥ is wiping the head with wet hands. In the Ḥanafī school, wiping one quarter of the head is farḍ. The sunnah is to wipe the whole head.' },

    // ── Tayammum unit flashcards ──
    { unitId: unitTayammum.id, front: 'When is tayammum permitted?', back: 'When water is not available, or when using water would cause harm to health (e.g., illness or injury). Also when the nearest water is more than one mīl away and one fears harm.' },
    { unitId: unitTayammum.id, front: 'What are the 3 farā\'iḍ of tayammum?', back: '1. Niyyah (intention)\n2. Wiping the entire face with clean earth/dust\n3. Wiping both arms to and including the elbows' },

    // ── Ṣalāh unit flashcards ──
    { unitId: unitSalah.id, front: 'Who is a masbūq?', back: 'A masbūq is someone who joins the congregational prayer after it has begun. They follow the imām for the remaining rak\'ahs, then stand after both salāms to complete what they missed.' },
    { unitId: unitSalah.id, front: 'What is qaḍā\' ṣalāh?', back: 'Qaḍā\' ṣalāh is the makeup of missed obligatory prayers. It is wājib to perform them as soon as possible. The missed prayer must be performed in the same method as the original.' },
    { unitId: unitSalah.id, front: 'How many extra takbīrs does \'Īd ṣalāh have?', back: '\'Īd ṣalāh has 6 additional wājib takbīrs: 3 in the first rak\'ah (after the opening takbīr) and 3 in the second rak\'ah (before going into rukū\').' },

    // ── Ḥajj unit flashcards ──
    { unitId: unitHajj.id, front: 'What is iḥrām?', back: 'Iḥrām is the sacred state entered at the mīqāt for Ḥajj or \'Umrah. For men: two white unstitched sheets. For women: regular clothing. It involves specific restrictions (no perfume, cutting hair, etc.).' },
    { unitId: unitHajj.id, front: 'What is wuqūf at \'Arafāt?', back: 'Wuqūf means \'standing\' at \'Arafāt on the 9th of Dhul Ḥijjah. It is the most essential pillar of Ḥajj — the Prophet ﷺ said: "Al-Ḥajj \'Arafah."' },
    { unitId: unitHajj.id, front: 'What is ṭawāf?', back: 'Ṭawāf is circling the Ka\'bah seven times counter-clockwise, starting from the Black Stone (al-Ḥajar al-Aswad). It is a pillar of both \'Umrah and Ḥajj.' },
    { unitId: unitHajj.id, front: 'What is Ziyārah?', back: 'Ziyārah (\'visit\') refers to visiting the Prophet\'s Masjid in Madinah, specifically giving salām at the blessed grave of the Prophet ﷺ. It is a highly recommended act for pilgrims.' },

    // ── Munāfiq unit flashcards ──
    { unitId: unitMunafiq.id, front: 'What are the 3 signs of a munāfiq (hypocrite)?', back: '1. When he speaks, he lies\n2. When he makes a promise, he breaks it\n3. When he is trusted (given an amānah), he betrays it\n(Ḥadīth: Bukhārī & Muslim)' },
    { unitId: unitMunafiq.id, front: 'What is amānah?', back: 'Amānah means trustworthiness and fulfilling trusts. It includes keeping promises, being honest in dealings, safeguarding things entrusted to you, and not betraying confidence.' },

    // ── Tongue/Ghība unit flashcards ──
    { unitId: unitTongue.id, front: 'What is ghība?', back: 'Ghība is backbiting: mentioning something about a person that they would dislike, even if it is true. The Qur\'ān compares it to eating the flesh of one\'s dead brother (49:12).' },
    { unitId: unitTongue.id, front: 'What is nameemah?', back: 'Nameemah is tale-carrying (gossip): conveying what someone said to another in order to cause discord between people. The Prophet ﷺ said the nammām (tale-carrier) will not enter Jannah.' },
    { unitId: unitTongue.id, front: 'What did the Prophet ﷺ say about the tongue and Jannah?', back: '"Whoever guarantees me what is between his two jaws (the tongue) and his two legs (private parts), I guarantee him Jannah." (Bukhārī) Controlling speech is key to entering Jannah.' },

    // ── Intoxicants unit flashcards ──
    { unitId: unitIntoxicants.id, front: 'What did the Prophet ﷺ say about khamr (intoxicants)?', back: '"Every intoxicant is khamr, and every khamr is ḥarām." (Muslim) The prohibition covers all mind-altering substances, not just alcohol from grapes.' },
    { unitId: unitIntoxicants.id, front: 'What does the Qur\'ān call intoxicants?', back: 'Allāh calls them "rijs min \'amal al-Shayṭān" — filth/abomination from the work of Shayṭān. Muslims are commanded to avoid them completely (Qur\'ān 5:90).' },

    // ── Character unit flashcards ──
    { unitId: unitCharacter.id, front: 'What did the Prophet ﷺ say was the heaviest thing on the scale of deeds?', back: '"Nothing is heavier on the scale of the believer on the Day of Resurrection than good character (ḥusn al-khuluq)." (Abū Dāwūd, Tirmidhī)' },
    { unitId: unitCharacter.id, front: 'What did the Prophet ﷺ say he was sent to perfect?', back: '"I was sent only to perfect good character (makārim al-akhlāq)." (Aḥmad, Mālik) Good character is central to the entire Islamic mission.' },

    // ── Treaty of Ḥudaybiyah flashcards ──
    { unitId: unitHudaybiyah.id, front: 'What is the Bay\'ah al-Riḍwān?', back: 'The Pledge of Allāh\'s Pleasure — the oath companions gave under a tree at Ḥudaybiyah, pledging loyalty to the Prophet ﷺ even unto death. Allāh praised those who gave it (Qur\'ān 48:18).' },
    { unitId: unitHudaybiyah.id, front: 'Why is the Treaty of Ḥudaybiyah called a "clear victory"?', back: 'Though it appeared unfavourable, it gave the Muslims 10 years of peace, recognition as a political state, and the freedom to spread Islām. Allāh confirmed it as a victory in Sūrah al-Fatḥ (48:1).' },
    { unitId: unitHudaybiyah.id, front: 'What did Allāh reveal after the Treaty of Ḥudaybiyah?', back: 'Sūrah al-Fatḥ (Chapter 48) was revealed, declaring the treaty a "clear victory" (fatḥun mubīn) and praising those who gave the Bay\'ah al-Riḍwān.' },

    // ── Fatḥ Makkah flashcards ──
    { unitId: unitFath.id, front: 'What was the Prophet\'s ﷺ proclamation upon entering Makkah?', back: '"Go, for you are free." This general amnesty forgave even the most bitter enemies of Islām, demonstrating the Prophet\'s ﷺ merciful character.' },
    { unitId: unitFath.id, front: 'What did the Prophet ﷺ recite upon destroying the idols?', back: '"Jā\'a al-ḥaqq wa zahaqa al-bāṭil, inna al-bāṭila kāna zahūqā" — "Truth has come and falsehood has perished — falsehood is ever bound to perish." (Qur\'ān 17:81)' },
    { unitId: unitFath.id, front: 'Who gave the first adhān from the Ka\'bah after the Conquest of Makkah?', back: 'Bilāl ibn Rabāḥ رضي الله عنه — the former Ethiopian slave who had been tortured for his faith by Umayyah ibn Khalaf — gave the first adhān from the roof of the Ka\'bah.' },

    // ── Farewell Sermon flashcards ──
    { unitId: unitFarewell.id, front: 'What was revealed during the Farewell Sermon?', back: '"This day I have perfected your religion for you, completed My favour upon you, and chosen Islām as your religion." (Qur\'ān 5:3) Marking the completion of divine revelation.' },
    { unitId: unitFarewell.id, front: 'What two things did the Prophet ﷺ leave behind?', back: '"I am leaving among you two things — the Book of Allāh and my Sunnah. If you hold fast to them you will never go astray." — the Farewell Sermon.' },

    // ── Mūsā flashcards ──
    { unitId: unitMusa.id, front: 'What is the title "Kalīmullāh"?', back: 'Kalīmullāh means "one who spoke to Allāh." It is the special title of Mūsā عليه السلام because Allāh spoke to him directly at the burning bush on Mount Ṭūr Sīnā.' },
    { unitId: unitMusa.id, front: 'How did Allāh save Banū Isrā\'īl from Fir\'awn?', back: 'Allāh parted the sea when Mūsā عليه السلام struck it with his staff. Banū Isrā\'īl crossed safely on dry paths. Fir\'awn\'s army pursued them and drowned as the sea closed.' },
    { unitId: unitMusa.id, front: 'What happened at Mount Ṭūr Sīnā?', back: 'Allāh called Mūsā عليه السلام to Mount Ṭūr for 40 days. He received the Tawrāh (Torah). Allāh also spoke to him directly there — making him Kalīmullāh.' },
    { unitId: unitMusa.id, front: 'Who is Fir\'awn?', back: 'Fir\'awn (Pharaoh) was the tyrannical ruler of Egypt who claimed divinity and oppressed Banū Isrā\'īl. He refused to believe despite the miracles of Mūsā عليه السلام and drowned in the sea.' },

    // ── 'Īsā flashcards ──
    { unitId: unitIsa.id, front: 'What is the title "Rūḥullāh" for \'Īsā عليه السلام?', back: 'Rūḥullāh means "Spirit from Allāh." It honours \'Īsā\'s miraculous creation — Allāh commanded the angel Jibrīl to breathe into Maryam, creating \'Īsā without a father.' },
    { unitId: unitIsa.id, front: 'What does the Qur\'ān say about the death of \'Īsā عليه السلام?', back: '"They did not kill him, nor did they crucify him; but it was made to appear so to them." (Qur\'ān 4:157) Allāh raised \'Īsā عليه السلام to the heavens before his enemies could harm him.' },

    // ── Death & Grave flashcards ──
    { unitId: unitDeathGrave.id, front: 'Who are Munkar and Nakīr?', back: 'Munkar and Nakīr are the two angels who come to question every person in their grave after burial. They ask about the person\'s Lord, religion, and their knowledge of the Prophet ﷺ.' },
    { unitId: unitDeathGrave.id, front: 'What is barzakh?', back: 'Barzakh is the realm between death and resurrection — an intermediate state. The soul remains there, experiencing either comfort (like a garden of Jannah) or punishment (like a pit of Jahannam).' },

    // ── Jannah & Jahannam flashcards ──
    { unitId: unitJannah.id, front: 'What is al-Mīzān?', back: 'Al-Mīzān is the scale on which deeds will be weighed on the Day of Resurrection. Everyone will receive their record in their right hand (believers) or left/behind their back (disbelievers).' },
    { unitId: unitJannah.id, front: 'What is al-Ṣirāṭ?', back: 'Al-Ṣirāṭ is the bridge stretched over Jahannam that all people must cross. Believers cross it at speeds based on their faith and deeds — some like lightning, others laboriously.' },
    { unitId: unitJannah.id, front: 'What is the A\'rāf?', back: 'A\'rāf is a partition between Jannah and Jahannam. Some people whose good and bad deeds are exactly equal will stand there, awaiting Allāh\'s decision about their final destination.' },
    { unitId: unitJannah.id, front: 'How many gates do Jannah and Jahannam have?', back: 'Jannah has 8 gates (one is Bāb al-Rayyān for those who fasted). Jahannam has 7 gates. Each gate corresponds to different categories of people.' },

    // ── Al-Qadr flashcards ──
    { unitId: unitQadr.id, front: 'What is al-Lawḥ al-Maḥfūẓ?', back: 'The Preserved Tablet — Allāh\'s writing in which everything was recorded 50,000 years before the creation of the heavens and earth. It contains Allāh\'s decree for all of creation.' },
    { unitId: unitQadr.id, front: 'When is Laylat al-Qadr?', back: 'Laylat al-Qadr is in the last ten odd nights of Ramaḍān (21st, 23rd, 25th, 27th, or 29th). It is better than 1,000 months. The du\'ā\' for it: "Allāhumma innaka \'afuwwun..."' },

    // ── Mashwarah & Ṣabr flashcards ──
    { unitId: unitMashwarah.id, front: 'What is mashwarah?', back: 'Mashwarah means seeking counsel from knowledgeable, trustworthy, and sincere people before making important decisions. Even the Prophet ﷺ was commanded by Allāh to consult his companions (3:159).' },
    { unitId: unitMashwarah.id, front: 'What are the 3 types of ṣabr?', back: '1. Ṣabr in obeying Allāh (persisting in worship)\n2. Ṣabr in refraining from sin\n3. Ṣabr in the face of adversity (accepting Allāh\'s decree with contentment)' },

    // ── Ṣilah & Gifts flashcards ──
    { unitId: unitSilah.id, front: 'What is ṣilah al-raḥim?', back: 'Ṣilah al-raḥim means maintaining kinship ties with relatives. The Prophet ﷺ said it expands provision (rizq) and extends lifespan. Severing ties (qaṭ\'ī al-raḥim) is a major sin.' },
    { unitId: unitSilah.id, front: 'What did the Prophet ﷺ say about gifts?', back: '"Exchange gifts, for gifts increase love between you and remove ill-feelings." (Ḥadīth) Gift-giving is a sunnah that strengthens relationships and creates goodwill.' },

    // ── Dhikr, Shukr & Tawbah flashcards ──
    { unitId: unitDhikr.id, front: 'What is dhikr?', back: 'Dhikr means the remembrance of Allāh through words, thoughts, and actions. The Qur\'ān says: "Alā bi-dhikrillāhi taṭma\'inn al-qulūb" — "In the remembrance of Allāh do hearts find rest." (13:28)' },
    { unitId: unitDhikr.id, front: 'What is shukr?', back: 'Shukr means gratitude to Allāh. It has 3 dimensions: (1) Heart — recognising all blessings come from Allāh; (2) Tongue — saying Alḥamdulillāh; (3) Actions — using blessings in Allāh\'s obedience.' },
    { unitId: unitDhikr.id, front: 'What are the conditions of tawbah?', back: '1. Stop the sin immediately\n2. Feel genuine remorse\n3. Resolve firmly not to return to the sin\n4. If someone\'s rights were violated, make amends to them' },

    // ── Ghusl & Miswāk flashcards ──
    { unitId: unitGhusl.id, front: 'When is ghusl farḍ (obligatory)?', back: 'Ghusl is farḍ after: (1) janābah (sexual discharge), (2) cessation of ḥayḍ (menstruation), (3) cessation of nifās (post-natal bleeding), (4) upon accepting Islām.' },
    { unitId: unitGhusl.id, front: 'What are the benefits of the miswāk?', back: 'The miswāk: (1) purifies the mouth and freshens breath, (2) strengthens gums and teeth, (3) is a sunnah that multiplies prayer reward, (4) pleases Allāh. The Prophet ﷺ used it constantly.' },

    // ── Social & Writing flashcards ──
    { unitId: unitSocial.id, front: 'What are the etiquettes of salām?', back: 'The walker gives salām to the sitting, the smaller group to the larger, the younger to the elder, the rider to the pedestrian. Give the full salām: "Al-Salāmu \'alaykum wa raḥmatullāhi wa barakātuh."' },
    { unitId: unitSocial.id, front: 'What is istidhan (seeking permission)?', back: 'Istidhan means knocking/seeking permission before entering someone\'s home. Seek permission three times; if no answer, turn away. Allāh commands this in the Qur\'ān (24:27).' },

    // ── Visiting the Sick flashcards ──
    { unitId: unitSick.id, front: 'What is the reward for visiting the sick?', back: 'The Prophet ﷺ said: "Whoever visits a sick person continues to be in the khurfah (fruit garden) of Jannah until they return." Visiting the sick is one of the six rights of a Muslim upon another.' },
    { unitId: unitSick.id, front: 'What du\'ā\' did the Prophet ﷺ teach for the sick?', back: '"Adhhibil-ba\'sa rabb al-nās, washfi anta al-shāfī, lā shifā\'a illā shifā\'uk, shifā\'an lā yughādiru saqamā" — "Remove the hardship, O Lord of mankind... a cure that leaves no illness behind."' },
  ];

  // Delete existing flashcards for each unit then re-create
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
        category: 'definition',
        tags: [],
        orderIndex: flashcardData.filter(f => f.unitId === fc.unitId).indexOf(fc),
      },
    });
  }
  console.log(`✅ Created ${flashcardData.length} flashcards`);

  // ══════════════════════════════════════════════
  // ARABIC TERMS — distributed across units
  // ══════════════════════════════════════════════

  const arabicTermsData: Array<{
    unitId: string;
    term: string;
    transliteration: string;
    definition: string;
    unitSlug: string;
  }> = [
    // ── Wuḍū' Arabic terms ──
    { unitId: unitWudu.id, unitSlug: 'maktab-5-fiqh-wudu', term: 'فرائض', transliteration: 'Farā\'iḍ', definition: 'Obligatory acts — those acts whose omission invalidates wuḍū\' or ṣalāh.' },
    { unitId: unitWudu.id, unitSlug: 'maktab-5-fiqh-wudu', term: 'سنن', transliteration: 'Sunan', definition: 'Recommended acts based on the Prophet\'s ﷺ practice; omitting them does not invalidate but reduces reward.' },
    { unitId: unitWudu.id, unitSlug: 'maktab-5-fiqh-wudu', term: 'مكروهات', transliteration: 'Makrūhāt', definition: 'Disliked acts — not ḥarām but blameworthy and reducing the reward of worship.' },
    { unitId: unitWudu.id, unitSlug: 'maktab-5-fiqh-wudu', term: 'نواقض', transliteration: 'Nawāqiḍ', definition: 'Nullifiers — acts that break and invalidate the wuḍū\'.' },
    { unitId: unitWudu.id, unitSlug: 'maktab-5-fiqh-wudu', term: 'مسح', transliteration: 'Masaḥ', definition: 'Wiping with wet hands over a body part during wuḍū\'; the farḍ is to wipe one quarter of the head.' },

    // ── Tayammum Arabic terms ──
    { unitId: unitTayammum.id, unitSlug: 'maktab-5-fiqh-tayammum', term: 'تيمم', transliteration: 'Tayammum', definition: 'Dry ritual purification using clean earth/dust as a substitute for wuḍū\' or ghusl when water is unavailable or harmful to use.' },

    // ── Ṣalāh Arabic terms ──
    { unitId: unitSalah.id, unitSlug: 'maktab-5-fiqh-salah', term: 'مسبوق', transliteration: 'Masbūq', definition: 'One who joins the congregational prayer after it has begun; they complete the missed rak\'ahs after the imām\'s salām.' },
    { unitId: unitSalah.id, unitSlug: 'maktab-5-fiqh-salah', term: 'قضاء', transliteration: 'Qaḍā\'', definition: 'Making up a missed obligatory prayer; it is wājib to perform it as soon as possible.' },
    { unitId: unitSalah.id, unitSlug: 'maktab-5-fiqh-salah', term: 'مستحبات', transliteration: 'Mustaḥabbāt', definition: 'Recommended acts (nafl/sunnah) that are not wājib but are virtuous and increase reward.' },

    // ── Ḥajj Arabic terms ──
    { unitId: unitHajj.id, unitSlug: 'maktab-5-fiqh-hajj', term: 'إحرام', transliteration: 'Iḥrām', definition: 'The sacred state entered for Ḥajj or \'Umrah at the mīqāt, accompanied by specific dress and restrictions.' },
    { unitId: unitHajj.id, unitSlug: 'maktab-5-fiqh-hajj', term: 'طواف', transliteration: 'Ṭawāf', definition: 'Circling the Ka\'bah seven times counter-clockwise, a pillar of both \'Umrah and Ḥajj.' },
    { unitId: unitHajj.id, unitSlug: 'maktab-5-fiqh-hajj', term: 'سعي', transliteration: 'Sa\'y', definition: 'Walking/running seven times between the hills of Ṣafā and Marwah, commemorating the actions of Hājar عليها السلام.' },
    { unitId: unitHajj.id, unitSlug: 'maktab-5-fiqh-hajj', term: 'ميقات', transliteration: 'Mīqāt', definition: 'The designated boundary around Makkah at which pilgrims must put on iḥrām before entering Makkah.' },
    { unitId: unitHajj.id, unitSlug: 'maktab-5-fiqh-hajj', term: 'حلق', transliteration: 'Ḥalq', definition: 'Shaving the head after completing Ḥajj or \'Umrah; this act exits the pilgrim from the state of iḥrām.' },
    { unitId: unitHajj.id, unitSlug: 'maktab-5-fiqh-hajj', term: 'تلبية', transliteration: 'Talbiyah', definition: 'The invocation "Labbayk Allāhumma labbayk..." recited from putting on iḥrām until stoning the Jamrāt al-\'Aqabah on the day of \'Īd.' },

    // ── Munāfiq Arabic terms ──
    { unitId: unitMunafiq.id, unitSlug: 'maktab-5-ahadith-munafiq', term: 'نفاق', transliteration: 'Nifāq', definition: 'Hypocrisy — outwardly displaying faith while inwardly harbouring disbelief or corrupt character. A major warning in the Qur\'ān and Ḥadīth.' },
    { unitId: unitMunafiq.id, unitSlug: 'maktab-5-ahadith-munafiq', term: 'أمانة', transliteration: 'Amānah', definition: 'Trustworthiness; fulfilling trusts and responsibilities. Betraying amānah is one of the signs of hypocrisy.' },

    // ── Tongue Arabic terms ──
    { unitId: unitTongue.id, unitSlug: 'maktab-5-ahadith-tongue', term: 'غيبة', transliteration: 'Ghībah', definition: 'Backbiting — mentioning something about a person that they would dislike, even if true. Ḥarām in Islām.' },
    { unitId: unitTongue.id, unitSlug: 'maktab-5-ahadith-tongue', term: 'نميمة', transliteration: 'Nameemah', definition: 'Tale-carrying (gossip) — conveying words between people to cause discord. The Prophet ﷺ warned the nammām will not enter Jannah.' },

    // ── Intoxicants Arabic terms ──
    { unitId: unitIntoxicants.id, unitSlug: 'maktab-5-ahadith-khamr', term: 'خمر', transliteration: 'Khamr', definition: 'Intoxicants — all substances that cloud the mind. Ḥarām in any quantity. "Every intoxicant is khamr and every khamr is ḥarām." (Muslim)' },

    // ── Character Arabic terms ──
    { unitId: unitCharacter.id, unitSlug: 'maktab-5-ahadith-character', term: 'حسن الخلق', transliteration: 'Ḥusn al-Khuluq', definition: 'Good character and fine manners — described by the Prophet ﷺ as the heaviest thing on the scale of deeds on the Day of Judgement.' },

    // ── Ḥudaybiyah Arabic terms ──
    { unitId: unitHudaybiyah.id, unitSlug: 'maktab-5-sirah-hudaybiyah', term: 'بيعة الرضوان', transliteration: 'Bay\'ah al-Riḍwān', definition: 'The Pledge of Allāh\'s Pleasure — the oath of allegiance given by the Ṣaḥābah to the Prophet ﷺ under a tree at Ḥudaybiyah.' },
    { unitId: unitHudaybiyah.id, unitSlug: 'maktab-5-sirah-hudaybiyah', term: 'فتح مبين', transliteration: 'Fatḥun Mubīn', definition: 'A clear/manifest victory. Allāh described the Treaty of Ḥudaybiyah as a fatḥun mubīn in Sūrah al-Fatḥ (48:1).' },

    // ── Fatḥ Makkah Arabic terms ──
    { unitId: unitFath.id, unitSlug: 'maktab-5-sirah-fath', term: 'فتح مكة', transliteration: 'Fatḥ Makkah', definition: 'The Conquest of Makkah in 8 AH — the bloodless entry of the Prophet ﷺ and 10,000 companions into Makkah, ending idol worship at the Ka\'bah.' },

    // ── Farewell Sermon Arabic terms ──
    { unitId: unitFarewell.id, unitSlug: 'maktab-5-sirah-farewell', term: 'خطبة الوداع', transliteration: 'Khuṭbat al-Wadā\'', definition: 'The Farewell Sermon — delivered by the Prophet ﷺ on the 9th of Dhul Ḥijjah at \'Arafāt during his final Ḥajj, summarising the core principles of Islām.' },

    // ── Mūsā Arabic terms ──
    { unitId: unitMusa.id, unitSlug: 'maktab-5-tarikh-musa', term: 'كليم الله', transliteration: 'Kalīmullāh', definition: 'The one who spoke to Allāh — the title of Mūsā عليه السلام, as Allāh spoke to him directly at Mount Ṭūr Sīnā.' },

    // ── 'Īsā Arabic terms ──
    { unitId: unitIsa.id, unitSlug: 'maktab-5-tarikh-isa', term: 'روح الله', transliteration: 'Rūḥullāh', definition: 'Spirit from Allāh — the title of \'Īsā عليه السلام, honouring his miraculous creation when Allāh breathed life into Maryam through Jibrīl عليه السلام.' },
    { unitId: unitIsa.id, unitSlug: 'maktab-5-tarikh-isa', term: 'الحواريون', transliteration: 'Al-Ḥawāriyyūn', definition: 'The disciples of \'Īsā عليه السلام — his devoted followers who believed in his message and supported his mission to call people to the worship of Allāh.' },

    // ── Aqā'id Arabic terms ──
    { unitId: unitDeathGrave.id, unitSlug: 'maktab-5-aqaid-death-grave', term: 'برزخ', transliteration: 'Barzakh', definition: 'The intermediate realm between death and resurrection — the soul remains there experiencing either comfort or punishment until Yawm al-Qiyāmah.' },
    { unitId: unitDeathGrave.id, unitSlug: 'maktab-5-aqaid-death-grave', term: 'سكرات الموت', transliteration: 'Sakrāt al-Mawt', definition: 'The pangs and agonies of death — the intense struggle experienced by the dying person as the soul is taken.' },
    { unitId: unitJannah.id, unitSlug: 'maktab-5-aqaid-jannah', term: 'الميزان', transliteration: 'Al-Mīzān', definition: 'The Scale — on the Day of Resurrection, all deeds will be weighed on the Mīzān. Whoever\'s good deeds are heavier enters Jannah.' },
    { unitId: unitJannah.id, unitSlug: 'maktab-5-aqaid-jannah', term: 'الصراط', transliteration: 'Al-Ṣirāṭ', definition: 'The Bridge — stretched over Jahannam that all must cross. Believers cross at speeds proportional to their faith; those whose deeds are insufficient fall into Jahannam.' },
    { unitId: unitJannah.id, unitSlug: 'maktab-5-aqaid-jannah', term: 'الأعراف', transliteration: 'Al-A\'rāf', definition: 'The partition between Jannah and Jahannam where some people whose deeds are equally balanced will await Allāh\'s judgement.' },
    { unitId: unitQadr.id, unitSlug: 'maktab-5-aqaid-qadr', term: 'القدر', transliteration: 'Al-Qadr', definition: 'Divine decree/predestination — the sixth pillar of Īmān. Everything happens by Allāh\'s knowledge, will, and decree.' },
    { unitId: unitQadr.id, unitSlug: 'maktab-5-aqaid-qadr', term: 'اللوح المحفوظ', transliteration: 'Al-Lawḥ al-Maḥfūẓ', definition: 'The Preserved Tablet — Allāh\'s record of all decrees, written 50,000 years before the creation of the heavens and earth.' },

    // ── Akhlāq Arabic terms ──
    { unitId: unitMashwarah.id, unitSlug: 'maktab-5-akhlaq-mashwarah', term: 'مشورة', transliteration: 'Mashwarah', definition: 'Consultation — seeking the advice of knowledgeable and trustworthy people before making important decisions. Commanded in the Qur\'ān (3:159).' },
    { unitId: unitMashwarah.id, unitSlug: 'maktab-5-akhlaq-mashwarah', term: 'صبر', transliteration: 'Ṣabr', definition: 'Patience — one of the greatest virtues: persevering in obedience to Allāh, refraining from sin, and accepting Allāh\'s decree with contentment.' },
    { unitId: unitSilah.id, unitSlug: 'maktab-5-akhlaq-silah', term: 'صلة الرحم', transliteration: 'Ṣilah al-Raḥim', definition: 'Maintaining kinship ties — visiting relatives, keeping in touch, giving gifts, and supporting family. Severs leads to divine punishment.' },
    { unitId: unitSilah.id, unitSlug: 'maktab-5-akhlaq-silah', term: 'هدية', transliteration: 'Hadiyyah', definition: 'A gift — the Prophet ﷺ said gifts increase love and remove ill-feelings. Giving and receiving gifts with good manners is a beloved sunnah.' },
    { unitId: unitDhikr.id, unitSlug: 'maktab-5-akhlaq-dhikr', term: 'ذكر', transliteration: 'Dhikr', definition: 'Remembrance of Allāh — SubḥānAllāh, Alḥamdulillāh, Allāhu Akbar, etc. The Qur\'ān says hearts find rest in the remembrance of Allāh (13:28).' },
    { unitId: unitDhikr.id, unitSlug: 'maktab-5-akhlaq-dhikr', term: 'توبة', transliteration: 'Tawbah', definition: 'Repentance — sincerely turning back to Allāh after sin. Conditions: stop the sin, feel remorse, resolve not to return, make amends if necessary.' },

    // ── Ādāb Arabic terms ──
    { unitId: unitGhusl.id, unitSlug: 'maktab-5-adab-ghusl', term: 'غسل', transliteration: 'Ghusl', definition: 'Full ritual bath — obligatory after janābah, cessation of ḥayḍ/nifās, and upon accepting Islām. Also sunnah before Jumu\'ah and \'Īd.' },
    { unitId: unitGhusl.id, unitSlug: 'maktab-5-adab-ghusl', term: 'مسواك', transliteration: 'Miswāk', definition: 'Tooth-cleaning twig from the arāk tree. A strongly emphasised sunnah — the Prophet ﷺ said he would have made it obligatory with every prayer.' },
    { unitId: unitSocial.id, unitSlug: 'maktab-5-adab-social', term: 'استئذان', transliteration: 'Istidhan', definition: 'Seeking permission to enter — a Qur\'ānic command (24:27). Seek permission three times; if no answer, turn away.' },
    { unitId: unitSick.id, unitSlug: 'maktab-5-adab-sick', term: 'عيادة المريض', transliteration: '\'Iyādah al-Marīḍ', definition: 'Visiting the sick — one of the six rights of a Muslim upon another. The visitor is said to be in the fruit garden (khurfah) of Jannah until they return.' },
  ];

  // Delete and re-create Arabic terms for each unit
  const uniqueUnitIds = [...new Set(arabicTermsData.map(t => t.unitId))];
  for (const unitId of uniqueUnitIds) {
    await prisma.arabicTerm.deleteMany({ where: { unitId } });
  }

  for (let i = 0; i < arabicTermsData.length; i++) {
    const t = arabicTermsData[i];
    await prisma.arabicTerm.create({
      data: {
        unitId: t.unitId,
        arabicText: t.term,
        transliteration: t.transliteration,
        translation: t.definition,
      },
    });
  }
  console.log(`✅ Created ${arabicTermsData.length} Arabic terms`);

  console.log('\\n🎉 Maktab Coursebook 5 seed complete!');
  console.log('   Course: Maktab Coursebook 5');
  console.log('   Units: 22 focused units (was 7 broad units)');
  console.log('   Subjects: Fiqh (4), Aḥādīth (4), Sīrah (3), Tārīkh (2), Aqā\'id (3), Akhlāq (3), Ādāb (3)');
}

// ──────────────────────────────────────────────
// Standalone execution
// ──────────────────────────────────────────────
async function main() {
  try {
    await seedMaktabCoursebook5();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Maktab Coursebook 5:', error);
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
