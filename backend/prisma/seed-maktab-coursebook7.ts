import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 7 — Islamic Curriculum Seed
 * Source: An Nasihah Publications, Age Range: 12–13 years
 *
 * Covers seven subjects: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā'id, Akhlāq, Ādāb
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions and flashcards per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-coursebook7.ts
 */

export async function seedMaktabCoursebook7() {
  console.log('📚 Starting Maktab Coursebook 7 seed...');
  console.log('');

  // Require demo family from main seed
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
    where: { slug: 'maktab-coursebook-7' },
    create: {
      slug: 'maktab-coursebook-7',
      title: 'Maktab Coursebook 7',
      description: 'A comprehensive Islamic curriculum for young learners aged 12–13 years. Covers advanced fiqh topics (makrūhāt of ṣalāh, sutrah, sajdah tilāwah, qaṣr ṣalāh, zakāh, inheritance, i\'tikāf, laylatul qadr, ḥalāl foods, uḍḥiyah), key aḥādīth on jannah/jahannam, ghībah, modesty, forgiveness, and durūd, the shamā\'il of Rasūlullāh ﷺ and the life of \'Umar ibn al-Khaṭṭāb رضي الله عنه, the stories of Zakariyyā, Yaḥyā and Maryam عليهم السلام plus the Abbasid Khilāfah, aqā\'id on divine decree (qaḍā\' and qadr), evil eye, life after death and barzakh, akhlāq on spreading rumours, value of time, virtues of knowledge, and ṣalāt \'alan nabiy, and ādāb of social manners including oaths, phone etiquette, internet safety, and interaction with non-Muslims. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['PRE_TEEN', 'TEEN'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 7',
      description: 'A comprehensive Islamic curriculum for young learners aged 12–13 years. Covers advanced fiqh topics (makrūhāt of ṣalāh, sutrah, sajdah tilāwah, qaṣr ṣalāh, zakāh, inheritance, i\'tikāf, laylatul qadr, ḥalāl foods, uḍḥiyah), key aḥādīth on jannah/jahannam, ghībah, modesty, forgiveness, and durūd, the shamā\'il of Rasūlullāh ﷺ and the life of \'Umar ibn al-Khaṭṭāb رضي الله عنه, the stories of Zakariyyā, Yaḥyā and Maryam عليهم السلام plus the Abbasid Khilāfah, aqā\'id on divine decree (qaḍā\' and qadr), evil eye, life after death and barzakh, akhlāq on spreading rumours, value of time, virtues of knowledge, and ṣalāt \'alan nabiy, and ādāb of social manners including oaths, phone etiquette, internet safety, and interaction with non-Muslims. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['PRE_TEEN', 'TEEN'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // UNIT 0: FIQH
  // ──────────────────────────────────────────────

    const unitFiqh = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-fiqh' } },
    create: {
      slug: 'maktab-7-fiqh',
      courseId: course.id,
      title: 'Fiqh — Advanced Ṣalāh, Zakāh, Inheritance & More',
      description: 'Covers makrūhāt of ṣalāh, sutrah, sajdah tilāwah, ṣalātul kusūf/khusūf, taḥarrī, qaṣr ṣalāh, ṣalātul marīḍ, ṣalātul ma\'dhūr, zakāh, inheritance, i\'tikāf, laylatul qadr, ḥalāl foods, and uḍḥiyah.',
      orderIndex: 0,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Distinguish between the mustaḥabbāt and makrūhāt of ṣalāh.</li>
  <li>Know the purpose of a sutrah and list the conditions it should meet.</li>
  <li>Demonstrate how to carry out a Sajdah Tilāwah.</li>
  <li>Describe the different types of ṣalāh: Ṣalātul Kusūf, Ṣalātul Khusūf, Qaṣr Ṣalāh, Ṣalātul Marīḍ, and Ṣalātul Ma'dhūr.</li>
  <li>Calculate the niṣāb and understand the rulings of zakāh.</li>
  <li>Justify the importance of ḥalāl foods and the correct manner of slaughtering animals.</li>
  <li>Summarise what uḍḥiyah is and its requirements.</li>
  <li>Outline the rulings regarding i'tikāf and the importance of Laylatul Qadr.</li>
</ul>

<h3>Mustaḥabbāt of Ṣalāh</h3>
<ol>
  <li>The sleeves should not cover the hands when saying Takbīr Taḥrīmah.</li>
  <li>Look at the place of sajdah when standing in qiyām.</li>
  <li>In rukū', look towards the toes keeping the back straight, head and neck aligned.</li>
  <li>Whilst sitting, focus gaze on the lap; during salām, look at the shoulders.</li>
  <li>Say the tasbīḥ of rukū' and sajdah more than three times when praying alone.</li>
  <li>Suppress a yawn; if unable, cover with the upper right hand in qiyām and the left hand in other postures.</li>
</ol>

<h3>Makrūhāt of Ṣalāh</h3>
<ol>
  <li>Missing out a sunnah intentionally.</li>
  <li>Playing with one's clothes.</li>
  <li>Cracking one's joints.</li>
  <li>For a male to have sleeves rolled up above the elbows.</li>
  <li>Making the second rak'ah longer than the first by reciting more Qur'ān.</li>
  <li>Reciting the same sūrah in every rak'ah after Sūrah al-Fātiḥah.</li>
  <li>Reciting sūrahs against the order in the Qur'ān.</li>
  <li>Performing ṣalāh whilst needing to answer the call of nature.</li>
  <li>For a male to rest his arms on the ground in sajdah.</li>
  <li>Praying in clothes people do not ordinarily go out in.</li>
</ol>
<p>It is disliked to turn one's neck in ṣalāh. If a person turns his chest 45 degrees or more from the Qiblah, the ṣalāh becomes invalid. During sajdah, the feet must be touching the ground — if a foot is lifted completely for the duration of one tasbīḥ, the ṣalāh will be invalid.</p>

<h3>Sutrah</h3>
<p>We should never walk directly across a person performing ṣalāh. The Prophet ﷺ said: <em>"If the one crossing in front of a praying person knew what sin is upon him, it would be better for him to wait for forty than walk across."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>The Prophet ﷺ would place a spear or item in front of himself when praying in an open space. This is called <strong>sutrah</strong>. A sutrah must be:</p>
<ul>
  <li>An arm's length</li>
  <li>At least as thick as a finger</li>
  <li>Upright</li>
</ul>
<p>The sutrah of an imām is sufficient for the congregation.</p>

<h3>Sajdah Tilāwah</h3>
<p>There are 14 verses in the Qur'ān which require sajdah upon reciting or hearing them. This sajdah is wājib. The procedure outside ṣalāh:</p>
<ol>
  <li>Make intention for Sajdah Tilāwah.</li>
  <li>Recite the Takbīr and go into sajdah from a standing or sitting position without raising the hands.</li>
  <li>Perform a single sajdah reciting <em>Subḥāna Rabbiyal a'lā</em> three times.</li>
  <li>Raise the head saying the takbīr. There is no salām.</li>
</ol>
<p>Key rulings: sajdah requires wuḍū'; hearing a sajdah verse makes it obligatory on the listener; repeating the same verse in one sitting requires only one sajdah; different verses require separate sajdahs.</p>

<h3>Ṣalātul Kusūf &amp; Khusūf</h3>
<p>The Prophet ﷺ said: <em>"The sun and the moon do not eclipse because of the death of someone but they are two signs amongst the signs of Allāh. When you see them, stand up and pray."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p><strong>Solar eclipse (Kusūf):</strong> Two rak'āt ṣalāh in congregation with lengthened recitation, rukū' and sajdah. No adhān or iqāmah.</p>
<p><strong>Lunar eclipse (Khusūf):</strong> Two rak'āt performed individually like normal ṣalāh.</p>

<h3>Taḥarrī — Determining the Qiblah</h3>
<p>It is a condition of ṣalāh to face the Qiblah. When travelling, one should use a compass or app. If unavailable, ask local Muslims. If alone, observe the sun's position to estimate east and west. If ṣalāh was performed after taḥarrī and the true direction is later discovered, the ṣalāh remains valid.</p>

<h3>Qaṣr Ṣalāh</h3>
<p>If a person intends to travel more than 54 miles (87 km), they are a <strong>musāfir</strong>. They perform two rak'āt farḍ for Ḍhuhr, 'Aṣr and 'Ishā' instead of four. This applies from leaving the home town boundaries until returning. If staying at a destination for less than 15 days, qaṣr continues. If intending to stay 15 days or more, full ṣalāh is performed.</p>

<h3>Ṣalātul Marīḍ — Prayer of the Sick</h3>
<p>If unable to stand, sit and pray. If unable to do sajdah, pray with gestures — inclining the head lower for sajdah than for rukū'. If unable to sit, lie down and pray with gestures. If unconscious for six prayers or more, those missed prayers need not be made up.</p>

<h3>Ṣalātul Ma'dhūr — Prayer of the Excused</h3>
<p>A person who cannot maintain wuḍū' throughout an entire ṣalāh time (e.g., constant bleeding) is classified as a ma'dhūr. Their illness does not break wuḍū'. Wuḍū' breaks with the ending of the ṣalāh time. Other nullifiers (nawāqiḍ) still apply normally.</p>

<h3>Zakāh</h3>
<p>Zakāh literally means 'to increase' and 'to purify'. It is one of the five pillars of Islām. For zakāh to be compulsory: be Muslim, be mature, own the niṣāb amount, and hold it for one lunar year.</p>
<p><strong>Niṣāb:</strong> equivalent to 612.36g of silver or 87.48g of gold — always calculated according to the lower value. Pay <strong>2.5%</strong> of total zakātable assets after deducting debts.</p>
<p><strong>Zakātable items:</strong> gold, silver, cash, money owed to you, business stock.</p>
<p><strong>Non-zakātable:</strong> personal jewellery besides gold/silver, personal car, personal house, electronics, household appliances.</p>
<p><strong>Recipients include:</strong> the needy (fuqarā'), people in debt, stranded travellers.</p>
<p><strong>Cannot give zakāh to:</strong> general welfare projects, hospitals, masjid construction, rich people, spouse, parents/grandparents, children/grandchildren, non-Muslims (though voluntary charity is encouraged for all).</p>

<h3>Inheritance</h3>
<p>When a person dies, their wealth is distributed in four stages:</p>
<ol>
  <li><strong>Burial and shrouding</strong> expenses.</li>
  <li><strong>All debts</strong> are paid off.</li>
  <li><strong>The bequeath (will)</strong> — up to 1/3 of remaining wealth, not for inheriting family members, and not for impermissible causes.</li>
  <li><strong>Distribution</strong> to family according to shares stipulated in Islām.</li>
</ol>

<h3>I'tikāf</h3>
<p>I'tikāf means to seclude oneself in the masjid. The Prophet ﷺ performed it during the last ten days of Ramaḍān. It is Sunnah Mu'akkadah — a collective obligation. Valid excuses to leave: sharī'ah reason (e.g., Jumu'ah elsewhere, farḍ ghusl), natural reason (toilet), or necessity (fire). Nafl i'tikāf: simply intending i'tikāf when entering any masjid.</p>

<h3>Laylatul Qadr</h3>
<p><em>"The Night of Power is much better than one thousand months."</em> (Qur'ān 97:1-3)</p>
<p>One thousand months equals 83 years. Seek it in the odd nights of the last ten nights of Ramaḍān. Whoever prays during Laylatul Qadr with faith will have former sins forgiven. (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Ḥalāl Foods</h3>
<p><em>"O Believers! Eat of the good and pure that We have provided you with."</em> (Qur'ān 2:172)</p>
<p>Land animals must be slaughtered by a Muslim saying <strong>Bismillāhi Allāhu Akbar</strong> (Tasmiyah), cutting at least three of the four vessels: trachea, oesophagus, and two jugular veins. Animals must not be cruelly treated. For seafood, only fish (samak) is permissible. Beware of cross-contamination at outlets serving both ḥalāl and ḥarām.</p>

<h3>Uḍḥiyah (Qurbānī)</h3>
<p>Animal sacrifice offered during the days of Ḥajj (10th-12th Dhul Ḥijjah). Wājib upon every mature Muslim who owns the niṣāb amount and is not a traveller. Eligible animals: sheep (1yr+), goats (1yr+), cattle (2yr+), camels (5yr+). Cattle/camels have seven shares. Meat divided into thirds: self, relatives/neighbours, the poor.</p>
      `.trim(),
    },
    update: {
      title: 'Fiqh — Advanced Ṣalāh, Zakāh, Inheritance & More',
      description: 'Covers makrūhāt of ṣalāh, sutrah, sajdah tilāwah, ṣalātul kusūf/khusūf, taḥarrī, qaṣr ṣalāh, ṣalātul marīḍ, ṣalātul ma\'dhūr, zakāh, inheritance, i\'tikāf, laylatul qadr, ḥalāl foods, and uḍḥiyah.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Distinguish between the mustaḥabbāt and makrūhāt of ṣalāh.</li>
  <li>Know the purpose of a sutrah and list the conditions it should meet.</li>
  <li>Demonstrate how to carry out a Sajdah Tilāwah.</li>
  <li>Describe the different types of ṣalāh: Ṣalātul Kusūf, Ṣalātul Khusūf, Qaṣr Ṣalāh, Ṣalātul Marīḍ, and Ṣalātul Ma'dhūr.</li>
  <li>Calculate the niṣāb and understand the rulings of zakāh.</li>
  <li>Justify the importance of ḥalāl foods and the correct manner of slaughtering animals.</li>
  <li>Summarise what uḍḥiyah is and its requirements.</li>
  <li>Outline the rulings regarding i'tikāf and the importance of Laylatul Qadr.</li>
</ul>

<h3>Mustaḥabbāt of Ṣalāh</h3>
<ol>
  <li>The sleeves should not cover the hands when saying Takbīr Taḥrīmah.</li>
  <li>Look at the place of sajdah when standing in qiyām.</li>
  <li>In rukū', look towards the toes keeping the back straight, head and neck aligned.</li>
  <li>Whilst sitting, focus gaze on the lap; during salām, look at the shoulders.</li>
  <li>Say the tasbīḥ of rukū' and sajdah more than three times when praying alone.</li>
  <li>Suppress a yawn; if unable, cover with the upper right hand in qiyām and the left hand in other postures.</li>
</ol>

<h3>Makrūhāt of Ṣalāh</h3>
<ol>
  <li>Missing out a sunnah intentionally.</li>
  <li>Playing with one's clothes.</li>
  <li>Cracking one's joints.</li>
  <li>For a male to have sleeves rolled up above the elbows.</li>
  <li>Making the second rak'ah longer than the first by reciting more Qur'ān.</li>
  <li>Reciting the same sūrah in every rak'ah after Sūrah al-Fātiḥah.</li>
  <li>Reciting sūrahs against the order in the Qur'ān.</li>
  <li>Performing ṣalāh whilst needing to answer the call of nature.</li>
  <li>For a male to rest his arms on the ground in sajdah.</li>
  <li>Praying in clothes people do not ordinarily go out in.</li>
</ol>
<p>It is disliked to turn one's neck in ṣalāh. If a person turns his chest 45 degrees or more from the Qiblah, the ṣalāh becomes invalid. During sajdah, the feet must be touching the ground — if a foot is lifted completely for the duration of one tasbīḥ, the ṣalāh will be invalid.</p>

<h3>Sutrah</h3>
<p>We should never walk directly across a person performing ṣalāh. The Prophet ﷺ said: <em>"If the one crossing in front of a praying person knew what sin is upon him, it would be better for him to wait for forty than walk across."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>The Prophet ﷺ would place a spear or item in front of himself when praying in an open space. This is called <strong>sutrah</strong>. A sutrah must be:</p>
<ul>
  <li>An arm's length</li>
  <li>At least as thick as a finger</li>
  <li>Upright</li>
</ul>
<p>The sutrah of an imām is sufficient for the congregation.</p>

<h3>Sajdah Tilāwah</h3>
<p>There are 14 verses in the Qur'ān which require sajdah upon reciting or hearing them. This sajdah is wājib. The procedure outside ṣalāh:</p>
<ol>
  <li>Make intention for Sajdah Tilāwah.</li>
  <li>Recite the Takbīr and go into sajdah from a standing or sitting position without raising the hands.</li>
  <li>Perform a single sajdah reciting <em>Subḥāna Rabbiyal a'lā</em> three times.</li>
  <li>Raise the head saying the takbīr. There is no salām.</li>
</ol>
<p>Key rulings: sajdah requires wuḍū'; hearing a sajdah verse makes it obligatory on the listener; repeating the same verse in one sitting requires only one sajdah; different verses require separate sajdahs.</p>

<h3>Ṣalātul Kusūf &amp; Khusūf</h3>
<p>The Prophet ﷺ said: <em>"The sun and the moon do not eclipse because of the death of someone but they are two signs amongst the signs of Allāh. When you see them, stand up and pray."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p><strong>Solar eclipse (Kusūf):</strong> Two rak'āt ṣalāh in congregation with lengthened recitation, rukū' and sajdah. No adhān or iqāmah.</p>
<p><strong>Lunar eclipse (Khusūf):</strong> Two rak'āt performed individually like normal ṣalāh.</p>

<h3>Taḥarrī — Determining the Qiblah</h3>
<p>It is a condition of ṣalāh to face the Qiblah. When travelling, one should use a compass or app. If unavailable, ask local Muslims. If alone, observe the sun's position to estimate east and west. If ṣalāh was performed after taḥarrī and the true direction is later discovered, the ṣalāh remains valid.</p>

<h3>Qaṣr Ṣalāh</h3>
<p>If a person intends to travel more than 54 miles (87 km), they are a <strong>musāfir</strong>. They perform two rak'āt farḍ for Ḍhuhr, 'Aṣr and 'Ishā' instead of four. This applies from leaving the home town boundaries until returning. If staying at a destination for less than 15 days, qaṣr continues. If intending to stay 15 days or more, full ṣalāh is performed.</p>

<h3>Ṣalātul Marīḍ — Prayer of the Sick</h3>
<p>If unable to stand, sit and pray. If unable to do sajdah, pray with gestures — inclining the head lower for sajdah than for rukū'. If unable to sit, lie down and pray with gestures. If unconscious for six prayers or more, those missed prayers need not be made up.</p>

<h3>Ṣalātul Ma'dhūr — Prayer of the Excused</h3>
<p>A person who cannot maintain wuḍū' throughout an entire ṣalāh time (e.g., constant bleeding) is classified as a ma'dhūr. Their illness does not break wuḍū'. Wuḍū' breaks with the ending of the ṣalāh time. Other nullifiers (nawāqiḍ) still apply normally.</p>

<h3>Zakāh</h3>
<p>Zakāh literally means 'to increase' and 'to purify'. It is one of the five pillars of Islām. For zakāh to be compulsory: be Muslim, be mature, own the niṣāb amount, and hold it for one lunar year.</p>
<p><strong>Niṣāb:</strong> equivalent to 612.36g of silver or 87.48g of gold — always calculated according to the lower value. Pay <strong>2.5%</strong> of total zakātable assets after deducting debts.</p>
<p><strong>Zakātable items:</strong> gold, silver, cash, money owed to you, business stock.</p>
<p><strong>Non-zakātable:</strong> personal jewellery besides gold/silver, personal car, personal house, electronics, household appliances.</p>
<p><strong>Recipients include:</strong> the needy (fuqarā'), people in debt, stranded travellers.</p>
<p><strong>Cannot give zakāh to:</strong> general welfare projects, hospitals, masjid construction, rich people, spouse, parents/grandparents, children/grandchildren, non-Muslims (though voluntary charity is encouraged for all).</p>

<h3>Inheritance</h3>
<p>When a person dies, their wealth is distributed in four stages:</p>
<ol>
  <li><strong>Burial and shrouding</strong> expenses.</li>
  <li><strong>All debts</strong> are paid off.</li>
  <li><strong>The bequeath (will)</strong> — up to 1/3 of remaining wealth, not for inheriting family members, and not for impermissible causes.</li>
  <li><strong>Distribution</strong> to family according to shares stipulated in Islām.</li>
</ol>

<h3>I'tikāf</h3>
<p>I'tikāf means to seclude oneself in the masjid. The Prophet ﷺ performed it during the last ten days of Ramaḍān. It is Sunnah Mu'akkadah — a collective obligation. Valid excuses to leave: sharī'ah reason (e.g., Jumu'ah elsewhere, farḍ ghusl), natural reason (toilet), or necessity (fire). Nafl i'tikāf: simply intending i'tikāf when entering any masjid.</p>

<h3>Laylatul Qadr</h3>
<p><em>"The Night of Power is much better than one thousand months."</em> (Qur'ān 97:1-3)</p>
<p>One thousand months equals 83 years. Seek it in the odd nights of the last ten nights of Ramaḍān. Whoever prays during Laylatul Qadr with faith will have former sins forgiven. (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Ḥalāl Foods</h3>
<p><em>"O Believers! Eat of the good and pure that We have provided you with."</em> (Qur'ān 2:172)</p>
<p>Land animals must be slaughtered by a Muslim saying <strong>Bismillāhi Allāhu Akbar</strong> (Tasmiyah), cutting at least three of the four vessels: trachea, oesophagus, and two jugular veins. Animals must not be cruelly treated. For seafood, only fish (samak) is permissible. Beware of cross-contamination at outlets serving both ḥalāl and ḥarām.</p>

<h3>Uḍḥiyah (Qurbānī)</h3>
<p>Animal sacrifice offered during the days of Ḥajj (10th-12th Dhul Ḥijjah). Wājib upon every mature Muslim who owns the niṣāb amount and is not a traveller. Eligible animals: sheep (1yr+), goats (1yr+), cattle (2yr+), camels (5yr+). Cattle/camels have seven shares. Meat divided into thirds: self, relatives/neighbours, the poor.</p>
      `.trim(),
      orderIndex: 0,
    },
  });

  console.log('✅ Created Unit 0: Fiqh');

  // ──────────────────────────────────────────────
  // UNIT 1: AḤĀDĪTH
  // ──────────────────────────────────────────────

    const unitAhadith = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-ahadith' } },
    create: {
      slug: 'maktab-7-ahadith',
      courseId: course.id,
      title: 'Aḥādīth — Sayings of Rasūlullāh ﷺ',
      description: 'Key aḥādīth on the people of Jannah and Jahannam, ghībah (backbiting), the miswāk, food etiquette, modesty, forgiveness of sins, lies, blessings, Laylatul Qadr, ṣalāt \'alan nabiy, the evil of stopping others from evil, ṣalāh with jamā\'ah, du\'ā\', and dhikr.',
      orderIndex: 1,
      content: `
<h2>Aḥādīth — Sayings of Rasūlullāh ﷺ</h2>

<h3>Jannah and Jahannam</h3>
<p>Ḥārithah ibn Wahb رضي الله عنه narrated that the Prophet ﷺ said:</p>
<p><em>"Shall I not tell you who the inhabitants of Jannah are? Every weak and humble person. If he was to take an oath in the name of Allāh, He would fulfil it. And the people of Jahannam are those who are proud, arrogant and stubborn."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Ghībah (Backbiting)</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ asked: <em>"Do you know what backbiting is?"</em> They replied: "Allāh and His Messenger know best." He said: <em>"Backbiting is to say anything about your brother which he would not like."</em> Someone asked: "But what if he has what I say?" The Prophet ﷺ replied: <em>"If he has what you say, you have backbitten him; if he does not, you have slandered him."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Siwāk</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ said: <em>"If it were not that I would be putting people to hardship, I would have ordered them to use the miswāk before every prayer."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Food</h3>
<p>Abū Hurayrah رضي الله عنه said: <em>"Allāh's Messenger never complained about food. If he liked something he would eat it, and if he didn't like it he would leave it alone."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Modesty</h3>
<p>Anas رضي الله عنه narrated that the Prophet ﷺ said: <em>"Every religion has a distinctive characteristic, and the characteristic of Islām is modesty."</em> (Ibn Mājah)</p>

<h3>Forgiveness of Sins</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ said: <em>"Whenever a Muslim is afflicted by any hardship — stress, illness, worry, grief, harm, disturbance, or even the prick of a thorn — Allāh removes some of his wrong actions because of it."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Lies</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ said: <em>"It is enough to make a person a liar that he narrates everything he hears."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Blessings</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ said: <em>"Look at those who are lower (less fortunate) than you. Do not look at those who are above you, for then you will not be ungrateful for the blessings of Allāh."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Laylatul Qadr</h3>
<p>'Ā'ishah رضي الله عنها narrated: I asked the Prophet ﷺ what to say on the Night of al-Qadr. He said: <em>"Say: O Allāh, indeed You are Pardoning, Generous, You love to pardon, so pardon me."</em> (Tirmidhī)</p>

<h3>Ṣalāt 'alan Nabiy</h3>
<p>'Abdullāh ibn 'Amr ibn al-'Āṣ رضي الله عنه narrated that the Prophet ﷺ said: <em>"Whoever sends blessing on me once, Allāh will bless him ten times."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Signs of a Mu'min</h3>
<p>Abū Umāmah رضي الله عنه narrated that a man asked: "What is faith?" The Prophet ﷺ replied: <em>"When your good deeds please you and your bad deeds displease you, then you are a true believer."</em> He asked: "What is sin?" The Prophet ﷺ replied: <em>"When anything troubles your conscience, stop doing it."</em> (Musnad Aḥmad)</p>

<h3>Stopping Others from Evil</h3>
<p>Abū Sa'īd رضي الله عنه narrated that the Prophet ﷺ said: <em>"If any of you sees something bad, he should try to change it with his hand. If he cannot, then with his tongue. If he cannot, then he should detest it in his heart, and that is the weakest degree of faith."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Ṣalāh with Jamā'ah</h3>
<p>'Abdullāh ibn 'Umar رضي الله عنهما narrated that the Prophet ﷺ said: <em>"Ṣalāh performed in congregation is 27 times superior to ṣalāh performed individually."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Du'ā'</h3>
<p>Jābir رضي الله عنه narrated that the Prophet ﷺ said: <em>"Whenever a Muslim asks Allāh for anything, Allāh will either grant his prayer or protect him from some harm, as long as he does not pray for something sinful or for something that would cut off his family ties."</em> (Tirmidhī)</p>

<h3>Dhikr</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ said: <em>"The Mufarridūn have gone ahead."</em> People asked: "Who are the Mufarridūn?" He ﷺ replied: <em>"The men and women who remember Allāh abundantly."</em> (Ṣaḥīḥ Muslim)</p>
      `.trim(),
    },
    update: {
      title: 'Aḥādīth — Sayings of Rasūlullāh ﷺ',
      description: 'Key aḥādīth on the people of Jannah and Jahannam, ghībah (backbiting), the miswāk, food etiquette, modesty, forgiveness of sins, lies, blessings, Laylatul Qadr, ṣalāt \'alan nabiy, the evil of stopping others from evil, ṣalāh with jamā\'ah, du\'ā\', and dhikr.',
      content: `
<h2>Aḥādīth — Sayings of Rasūlullāh ﷺ</h2>

<h3>Jannah and Jahannam</h3>
<p>Ḥārithah ibn Wahb رضي الله عنه narrated that the Prophet ﷺ said:</p>
<p><em>"Shall I not tell you who the inhabitants of Jannah are? Every weak and humble person. If he was to take an oath in the name of Allāh, He would fulfil it. And the people of Jahannam are those who are proud, arrogant and stubborn."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Ghībah (Backbiting)</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ asked: <em>"Do you know what backbiting is?"</em> They replied: "Allāh and His Messenger know best." He said: <em>"Backbiting is to say anything about your brother which he would not like."</em> Someone asked: "But what if he has what I say?" The Prophet ﷺ replied: <em>"If he has what you say, you have backbitten him; if he does not, you have slandered him."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Siwāk</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ said: <em>"If it were not that I would be putting people to hardship, I would have ordered them to use the miswāk before every prayer."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Food</h3>
<p>Abū Hurayrah رضي الله عنه said: <em>"Allāh's Messenger never complained about food. If he liked something he would eat it, and if he didn't like it he would leave it alone."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Modesty</h3>
<p>Anas رضي الله عنه narrated that the Prophet ﷺ said: <em>"Every religion has a distinctive characteristic, and the characteristic of Islām is modesty."</em> (Ibn Mājah)</p>

<h3>Forgiveness of Sins</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ said: <em>"Whenever a Muslim is afflicted by any hardship — stress, illness, worry, grief, harm, disturbance, or even the prick of a thorn — Allāh removes some of his wrong actions because of it."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Lies</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ said: <em>"It is enough to make a person a liar that he narrates everything he hears."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Blessings</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ said: <em>"Look at those who are lower (less fortunate) than you. Do not look at those who are above you, for then you will not be ungrateful for the blessings of Allāh."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Laylatul Qadr</h3>
<p>'Ā'ishah رضي الله عنها narrated: I asked the Prophet ﷺ what to say on the Night of al-Qadr. He said: <em>"Say: O Allāh, indeed You are Pardoning, Generous, You love to pardon, so pardon me."</em> (Tirmidhī)</p>

<h3>Ṣalāt 'alan Nabiy</h3>
<p>'Abdullāh ibn 'Amr ibn al-'Āṣ رضي الله عنه narrated that the Prophet ﷺ said: <em>"Whoever sends blessing on me once, Allāh will bless him ten times."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Signs of a Mu'min</h3>
<p>Abū Umāmah رضي الله عنه narrated that a man asked: "What is faith?" The Prophet ﷺ replied: <em>"When your good deeds please you and your bad deeds displease you, then you are a true believer."</em> He asked: "What is sin?" The Prophet ﷺ replied: <em>"When anything troubles your conscience, stop doing it."</em> (Musnad Aḥmad)</p>

<h3>Stopping Others from Evil</h3>
<p>Abū Sa'īd رضي الله عنه narrated that the Prophet ﷺ said: <em>"If any of you sees something bad, he should try to change it with his hand. If he cannot, then with his tongue. If he cannot, then he should detest it in his heart, and that is the weakest degree of faith."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Ṣalāh with Jamā'ah</h3>
<p>'Abdullāh ibn 'Umar رضي الله عنهما narrated that the Prophet ﷺ said: <em>"Ṣalāh performed in congregation is 27 times superior to ṣalāh performed individually."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Du'ā'</h3>
<p>Jābir رضي الله عنه narrated that the Prophet ﷺ said: <em>"Whenever a Muslim asks Allāh for anything, Allāh will either grant his prayer or protect him from some harm, as long as he does not pray for something sinful or for something that would cut off his family ties."</em> (Tirmidhī)</p>

<h3>Dhikr</h3>
<p>Abū Hurayrah رضي الله عنه narrated that the Prophet ﷺ said: <em>"The Mufarridūn have gone ahead."</em> People asked: "Who are the Mufarridūn?" He ﷺ replied: <em>"The men and women who remember Allāh abundantly."</em> (Ṣaḥīḥ Muslim)</p>
      `.trim(),
      orderIndex: 1,
    },
  });

  console.log('✅ Created Unit 1: Aḥādīth');

  // ──────────────────────────────────────────────
  // UNIT 2: SĪRAH
  // ──────────────────────────────────────────────

    const unitSirah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-sirah' } },
    create: {
      slug: 'maktab-7-sirah',
      courseId: course.id,
      title: 'Sīrah — Shamā\'il & \'Umar ibn al-Khaṭṭāb رضي الله عنه',
      description: 'The noble characteristics (shamā\'il) of the Prophet ﷺ — his clothing, manner of walking, speech, smiling, worship, fasting, and Qur\'ān recitation. The life of \'Umar ibn al-Khaṭṭāb رضي الله عنه: his youth, acceptance of Islām, love for the Prophet ﷺ, role during Abū Bakr\'s khilāfah, appointment as khalīfah, and his passing.',
      orderIndex: 2,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Describe the noble characteristics (shamā'il) of the Prophet ﷺ.</li>
  <li>Appreciate the Prophet's manner of dress, speech, worship, fasting and Qur'ān recitation.</li>
  <li>Outline the life of 'Umar ibn al-Khaṭṭāb رضي الله عنه from his youth to his passing.</li>
  <li>Explain how 'Umar accepted Islām and his contributions as khalīfah.</li>
</ul>

<h2>Shamā'il — Noble Characteristics of the Prophet ﷺ</h2>

<h3>Clothing</h3>
<p>The Prophet ﷺ preferred white garments and said: <em>"Wear white clothes, for they are the best of your clothes."</em> (Tirmidhī). He wore a turban ('imāmah) and kept his garments above his ankles. He wore a silver ring on his right hand inscribed with the words <strong>"Muḥammad Rasūlullāh"</strong>.</p>

<h3>Walking</h3>
<p>The Prophet ﷺ walked briskly with a slight forward lean, as if descending from a height. His Companions found it difficult to keep pace with him despite his calm demeanour.</p>

<h3>Speech</h3>
<p>He spoke clearly and concisely. He would repeat important points three times to ensure understanding. He never used foul language or spoke ill of anyone.</p>

<h3>Smiling</h3>
<p>The Prophet ﷺ smiled frequently. 'Abdullāh ibn al-Ḥārith رضي الله عنه said: <em>"I never saw anyone who smiled more than Rasūlullāh ﷺ."</em> (Tirmidhī)</p>

<h3>Worship</h3>
<p>He stood so long in night prayer (tahajjud) that his blessed feet would swell. When asked why he exerted himself so much when his past and future sins were forgiven, he replied: <em>"Should I not be a grateful servant?"</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Fasting</h3>
<p>He fasted every Monday and Thursday and encouraged fasting on the 13th, 14th and 15th of each lunar month, known as <strong>ayyāmul bīḍ</strong> (the white days).</p>

<h3>Qur'ān Recitation</h3>
<p>He recited the Qur'ān beautifully and slowly (tartīl), as commanded by Allāh. He wept when reciting and his voice would tremble with emotion and reverence.</p>

<h2>'Umar ibn al-Khaṭṭāb رضي الله عنه</h2>

<h3>Before Islām</h3>
<p>'Umar was strong, tall and well-built, from the noble tribe of Quraysh. He was known for his fierce opposition to the early Muslims and was greatly feared.</p>

<h3>Acceptance of Islām</h3>
<p>One day, 'Umar set out with his sword intending to harm the Prophet ﷺ. On the way, he was told that his own sister Fāṭimah and her husband had accepted Islām. He went to their home in anger and found them reciting Sūrah Ṭā Hā. After hearing the beautiful words of the Qur'ān, his heart softened. He went to the Prophet ﷺ and declared his faith. The Prophet ﷺ gave him the title <strong>"al-Fārūq"</strong> — the one who distinguishes truth from falsehood.</p>

<h3>In the Company of the Prophet ﷺ</h3>
<p>'Umar was one of the closest Companions. His opinions were often confirmed by divine revelation. The Prophet ﷺ said: <em>"If there were to be a prophet after me, it would be 'Umar."</em> (Tirmidhī)</p>

<h3>During Abū Bakr's Khilāfah</h3>
<p>'Umar served Abū Bakr faithfully as a trusted advisor. He was instrumental in the decision to compile the Qur'ān into a single manuscript after many ḥuffāẓ (memorisers) were martyred in the Battle of Yamāmah.</p>

<h3>As Khalīfah</h3>
<p>'Umar was appointed the second khalīfah after Abū Bakr. During his rule, the Muslim state expanded greatly to include Jerusalem, Persia and Egypt. He established the Islamic calendar (Hijri), set up the treasury (baytul māl), and organised administrative provinces. He was renowned for his justice — he would patrol the streets of Madīnah at night to personally check on the welfare of his citizens.</p>

<h3>His Passing</h3>
<p>'Umar رضي الله عنه was stabbed by Abū Lu'lu'ah, a Persian slave, while leading the Fajr prayer. He passed away three days later. He was buried beside the Prophet ﷺ and Abū Bakr رضي الله عنه in the chamber of 'Ā'ishah رضي الله عنها. His khilāfah lasted ten years and six months.</p>
      `.trim(),
    },
    update: {
      title: 'Sīrah — Shamā\'il & \'Umar ibn al-Khaṭṭāb رضي الله عنه',
      description: 'The noble characteristics (shamā\'il) of the Prophet ﷺ — his clothing, manner of walking, speech, smiling, worship, fasting, and Qur\'ān recitation. The life of \'Umar ibn al-Khaṭṭāb رضي الله عنه: his youth, acceptance of Islām, love for the Prophet ﷺ, role during Abū Bakr\'s khilāfah, appointment as khalīfah, and his passing.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Describe the noble characteristics (shamā'il) of the Prophet ﷺ.</li>
  <li>Appreciate the Prophet's manner of dress, speech, worship, fasting and Qur'ān recitation.</li>
  <li>Outline the life of 'Umar ibn al-Khaṭṭāb رضي الله عنه from his youth to his passing.</li>
  <li>Explain how 'Umar accepted Islām and his contributions as khalīfah.</li>
</ul>

<h2>Shamā'il — Noble Characteristics of the Prophet ﷺ</h2>

<h3>Clothing</h3>
<p>The Prophet ﷺ preferred white garments and said: <em>"Wear white clothes, for they are the best of your clothes."</em> (Tirmidhī). He wore a turban ('imāmah) and kept his garments above his ankles. He wore a silver ring on his right hand inscribed with the words <strong>"Muḥammad Rasūlullāh"</strong>.</p>

<h3>Walking</h3>
<p>The Prophet ﷺ walked briskly with a slight forward lean, as if descending from a height. His Companions found it difficult to keep pace with him despite his calm demeanour.</p>

<h3>Speech</h3>
<p>He spoke clearly and concisely. He would repeat important points three times to ensure understanding. He never used foul language or spoke ill of anyone.</p>

<h3>Smiling</h3>
<p>The Prophet ﷺ smiled frequently. 'Abdullāh ibn al-Ḥārith رضي الله عنه said: <em>"I never saw anyone who smiled more than Rasūlullāh ﷺ."</em> (Tirmidhī)</p>

<h3>Worship</h3>
<p>He stood so long in night prayer (tahajjud) that his blessed feet would swell. When asked why he exerted himself so much when his past and future sins were forgiven, he replied: <em>"Should I not be a grateful servant?"</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Fasting</h3>
<p>He fasted every Monday and Thursday and encouraged fasting on the 13th, 14th and 15th of each lunar month, known as <strong>ayyāmul bīḍ</strong> (the white days).</p>

<h3>Qur'ān Recitation</h3>
<p>He recited the Qur'ān beautifully and slowly (tartīl), as commanded by Allāh. He wept when reciting and his voice would tremble with emotion and reverence.</p>

<h2>'Umar ibn al-Khaṭṭāb رضي الله عنه</h2>

<h3>Before Islām</h3>
<p>'Umar was strong, tall and well-built, from the noble tribe of Quraysh. He was known for his fierce opposition to the early Muslims and was greatly feared.</p>

<h3>Acceptance of Islām</h3>
<p>One day, 'Umar set out with his sword intending to harm the Prophet ﷺ. On the way, he was told that his own sister Fāṭimah and her husband had accepted Islām. He went to their home in anger and found them reciting Sūrah Ṭā Hā. After hearing the beautiful words of the Qur'ān, his heart softened. He went to the Prophet ﷺ and declared his faith. The Prophet ﷺ gave him the title <strong>"al-Fārūq"</strong> — the one who distinguishes truth from falsehood.</p>

<h3>In the Company of the Prophet ﷺ</h3>
<p>'Umar was one of the closest Companions. His opinions were often confirmed by divine revelation. The Prophet ﷺ said: <em>"If there were to be a prophet after me, it would be 'Umar."</em> (Tirmidhī)</p>

<h3>During Abū Bakr's Khilāfah</h3>
<p>'Umar served Abū Bakr faithfully as a trusted advisor. He was instrumental in the decision to compile the Qur'ān into a single manuscript after many ḥuffāẓ (memorisers) were martyred in the Battle of Yamāmah.</p>

<h3>As Khalīfah</h3>
<p>'Umar was appointed the second khalīfah after Abū Bakr. During his rule, the Muslim state expanded greatly to include Jerusalem, Persia and Egypt. He established the Islamic calendar (Hijri), set up the treasury (baytul māl), and organised administrative provinces. He was renowned for his justice — he would patrol the streets of Madīnah at night to personally check on the welfare of his citizens.</p>

<h3>His Passing</h3>
<p>'Umar رضي الله عنه was stabbed by Abū Lu'lu'ah, a Persian slave, while leading the Fajr prayer. He passed away three days later. He was buried beside the Prophet ﷺ and Abū Bakr رضي الله عنه in the chamber of 'Ā'ishah رضي الله عنها. His khilāfah lasted ten years and six months.</p>
      `.trim(),
      orderIndex: 2,
    },
  });

  console.log('✅ Created Unit 2: Sīrah');

  // ──────────────────────────────────────────────
  // UNIT 3: TĀRĪKH
  // ──────────────────────────────────────────────

    const unitTarikh = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-tarikh' } },
    create: {
      slug: 'maktab-7-tarikh',
      courseId: course.id,
      title: 'Tārīkh — Zakariyyā, Yaḥyā عليهم السلام & The Abbasids',
      description: 'The story of Zakariyyā عليه السلام and Maryam عليها السلام, the birth and piety of Yaḥyā عليه السلام, and the rise, contributions, and fall of the Abbasid Khilāfah (750–1258 CE).',
      orderIndex: 3,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Retell the story of Zakariyyā عليه السلام and his du'ā' for a child.</li>
  <li>Describe the piety and qualities of Yaḥyā عليه السلام.</li>
  <li>Explain the significance of Maryam عليها السلام in the Qur'ān.</li>
  <li>Outline the rise, achievements, and fall of the Abbasid Khilāfah.</li>
</ul>

<h3>Zakariyyā عليه السلام</h3>
<p>Zakariyyā عليه السلام was a prophet of Banī Isrā'īl and the guardian of Maryam عليها السلام. Whenever he visited her in her place of worship, he would find her with out-of-season provisions. When he asked where they came from, she replied: <em>"It is from Allāh. Indeed, Allāh provides for whom He wills without account."</em> (Qur'ān 3:37)</p>
<p>Inspired by Allāh's power, the elderly Zakariyyā made a heartfelt du'ā' for a righteous child. Allāh accepted his prayer and gave him glad tidings of a son named <strong>Yaḥyā</strong> — a name that had not been given to anyone before. As a sign, Zakariyyā was unable to speak to people for three days, communicating only through gestures.</p>

<h3>Yaḥyā عليه السلام</h3>
<p>Yaḥyā عليه السلام was given prophethood while still a child. The Qur'ān describes him: <em>"We gave him wisdom while yet a child, and tenderness from Us, and purity. And he was God-fearing, and dutiful towards his parents, and he was not arrogant or disobedient."</em> (Qur'ān 19:12-14)</p>
<p>He was known for his exceptional piety, soft-heartedness and obedience to his parents. He would weep out of the fear of Allāh and spent his life calling people to righteousness.</p>

<h3>Maryam عليها السلام</h3>
<p>The mother of Maryam dedicated her daughter to the worship of Allāh before she was born. Zakariyyā عليه السلام became her guardian. She devoted herself to worship and is praised in the Qur'ān: <em>"And when the angels said: 'O Maryam! Allāh has chosen you, purified you, and chosen you above the women of the worlds.'"</em> (Qur'ān 3:42)</p>

<h3>The Abbasid Khilāfah (750–1258 CE)</h3>
<p>The Abbasid dynasty descended from <strong>al-'Abbās</strong>, the uncle of the Prophet ﷺ. They overthrew the Umayyads in 750 CE and moved the capital from Damascus to <strong>Baghdad</strong>, which became one of the greatest cities in the world.</p>

<h4>The Golden Age</h4>
<p>The Abbasid era is considered the golden age of Islamic civilisation. Major advances were made in science, medicine, mathematics and astronomy. The <strong>Bayt al-Ḥikmah</strong> (House of Wisdom) was established as a major centre of learning and translation, where scholars translated Greek, Persian and Indian works into Arabic.</p>

<h4>Notable Scholars</h4>
<p>Many of the greatest Islamic scholars flourished during this period, including the four great imāms of fiqh: <strong>Imām Abū Ḥanīfah</strong>, <strong>Imām Mālik</strong>, <strong>Imām ash-Shāfi'ī</strong>, and <strong>Imām Aḥmad ibn Ḥanbal</strong>.</p>

<h4>The Fall</h4>
<p>The Abbasid Khilāfah fell in <strong>1258 CE</strong> when the Mongol army, led by Hulagu Khan, invaded and sacked Baghdad. Libraries were destroyed and scholars were killed, marking the end of this great era of Islamic civilisation.</p>
      `.trim(),
    },
    update: {
      title: 'Tārīkh — Zakariyyā, Yaḥyā عليهم السلام & The Abbasids',
      description: 'The story of Zakariyyā عليه السلام and Maryam عليها السلام, the birth and piety of Yaḥyā عليه السلام, and the rise, contributions, and fall of the Abbasid Khilāfah (750–1258 CE).',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Retell the story of Zakariyyā عليه السلام and his du'ā' for a child.</li>
  <li>Describe the piety and qualities of Yaḥyā عليه السلام.</li>
  <li>Explain the significance of Maryam عليها السلام in the Qur'ān.</li>
  <li>Outline the rise, achievements, and fall of the Abbasid Khilāfah.</li>
</ul>

<h3>Zakariyyā عليه السلام</h3>
<p>Zakariyyā عليه السلام was a prophet of Banī Isrā'īl and the guardian of Maryam عليها السلام. Whenever he visited her in her place of worship, he would find her with out-of-season provisions. When he asked where they came from, she replied: <em>"It is from Allāh. Indeed, Allāh provides for whom He wills without account."</em> (Qur'ān 3:37)</p>
<p>Inspired by Allāh's power, the elderly Zakariyyā made a heartfelt du'ā' for a righteous child. Allāh accepted his prayer and gave him glad tidings of a son named <strong>Yaḥyā</strong> — a name that had not been given to anyone before. As a sign, Zakariyyā was unable to speak to people for three days, communicating only through gestures.</p>

<h3>Yaḥyā عليه السلام</h3>
<p>Yaḥyā عليه السلام was given prophethood while still a child. The Qur'ān describes him: <em>"We gave him wisdom while yet a child, and tenderness from Us, and purity. And he was God-fearing, and dutiful towards his parents, and he was not arrogant or disobedient."</em> (Qur'ān 19:12-14)</p>
<p>He was known for his exceptional piety, soft-heartedness and obedience to his parents. He would weep out of the fear of Allāh and spent his life calling people to righteousness.</p>

<h3>Maryam عليها السلام</h3>
<p>The mother of Maryam dedicated her daughter to the worship of Allāh before she was born. Zakariyyā عليه السلام became her guardian. She devoted herself to worship and is praised in the Qur'ān: <em>"And when the angels said: 'O Maryam! Allāh has chosen you, purified you, and chosen you above the women of the worlds.'"</em> (Qur'ān 3:42)</p>

<h3>The Abbasid Khilāfah (750–1258 CE)</h3>
<p>The Abbasid dynasty descended from <strong>al-'Abbās</strong>, the uncle of the Prophet ﷺ. They overthrew the Umayyads in 750 CE and moved the capital from Damascus to <strong>Baghdad</strong>, which became one of the greatest cities in the world.</p>

<h4>The Golden Age</h4>
<p>The Abbasid era is considered the golden age of Islamic civilisation. Major advances were made in science, medicine, mathematics and astronomy. The <strong>Bayt al-Ḥikmah</strong> (House of Wisdom) was established as a major centre of learning and translation, where scholars translated Greek, Persian and Indian works into Arabic.</p>

<h4>Notable Scholars</h4>
<p>Many of the greatest Islamic scholars flourished during this period, including the four great imāms of fiqh: <strong>Imām Abū Ḥanīfah</strong>, <strong>Imām Mālik</strong>, <strong>Imām ash-Shāfi'ī</strong>, and <strong>Imām Aḥmad ibn Ḥanbal</strong>.</p>

<h4>The Fall</h4>
<p>The Abbasid Khilāfah fell in <strong>1258 CE</strong> when the Mongol army, led by Hulagu Khan, invaded and sacked Baghdad. Libraries were destroyed and scholars were killed, marking the end of this great era of Islamic civilisation.</p>
      `.trim(),
      orderIndex: 3,
    },
  });

  console.log('✅ Created Unit 3: Tārīkh');

  // ──────────────────────────────────────────────
  // UNIT 4: AQĀ'ID
  // ──────────────────────────────────────────────

    const unitAqaid = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-aqaid' } },
    create: {
      slug: 'maktab-7-aqaid',
      courseId: course.id,
      title: 'Aqā\'id — Divine Decree, Life After Death & Barzakh',
      description: 'The concepts of qaḍā\' (divine foreknowledge) and qadr (divine decree), the evil eye and protection from it, the world as a place of means (asbāb), the journey of the soul, the life of barzakh, the Day of Judgement (blowing of the trumpet, resurrection, assembling, book of deeds, the scales).',
      orderIndex: 4,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Explain the concepts of qaḍā' and qadr and their role in a Muslim's belief.</li>
  <li>Describe the evil eye and how to protect oneself from it.</li>
  <li>Understand the concept of asbāb (means) and tawakkul (reliance on Allāh).</li>
  <li>Outline the journey of the soul after death and the life of barzakh.</li>
  <li>Describe the major events of the Day of Judgement.</li>
</ul>

<h3>Qaḍā' and Qadr</h3>
<p><strong>Qaḍā'</strong> is Allāh's eternal knowledge of everything that has happened, is happening, and will happen. Nothing is hidden from His knowledge.</p>
<p><strong>Qadr</strong> is the execution of that divine plan. Everything happens according to Allāh's will. The Prophet ﷺ said: <em>"The pen has dried."</em> — meaning the decree is written. However, we do not know what is written for us, so we must still strive, make choices and use the means Allāh has provided.</p>
<p>Belief in qadr does not remove personal responsibility. A Muslim trusts in Allāh's plan while doing their utmost to fulfil their obligations.</p>

<h3>The Evil Eye ('Ayn)</h3>
<p>The Prophet ﷺ said: <em>"The evil eye is real."</em> (Ṣaḥīḥ Muslim). A person may unintentionally cause harm through an envious or admiring glance.</p>
<p><strong>Protection:</strong></p>
<ul>
  <li>Recite the Mu'awwidhatayn — Sūrah al-Falaq and Sūrah an-Nās.</li>
  <li>Say <strong>"MāshāAllāh"</strong> when admiring something.</li>
  <li>Make du'ā' for protection regularly.</li>
  <li>Recite Āyatul Kursī after every ṣalāh.</li>
</ul>

<h3>Asbāb — The World of Means</h3>
<p>Allāh is the true cause of everything, but He has created a world where means (asbāb) play a role. The Prophet ﷺ told a man who left his camel untied, trusting in Allāh: <em>"Tie it, then put your trust in Allāh."</em> (Tirmidhī)</p>
<p>Using means — medicine when ill, studying for exams, working for a livelihood — is itself part of tawakkul (reliance on Allāh). We use the means and trust the outcome to Allāh.</p>

<h3>The Journey of the Soul After Death</h3>
<p>When a person dies, the Angel of Death ('Izrā'īl) takes their soul. The souls of the righteous are wrapped in fragrant shrouds from Jannah, while the souls of the wicked are dragged out painfully.</p>

<h3>Barzakh — Life Between Death and Resurrection</h3>
<p>Barzakh is the period between death and the Day of Judgement. In the grave, the deceased are questioned by two angels — <strong>Munkar and Nakīr</strong> — about their Lord, their religion and their prophet.</p>
<p>Believers answer correctly and find comfort — their grave expands and is filled with light. Those who cannot answer face punishment — their grave constricts around them. The Prophet ﷺ encouraged seeking refuge from the punishment of the grave.</p>

<h3>The Day of Judgement</h3>
<p>The angel <strong>Isrāfīl</strong> will blow the trumpet (Ṣūr). At the first blow, everything in the heavens and earth will perish. At the second blow, all of creation will be resurrected and assembled on a vast plain.</p>

<h4>The Book of Deeds</h4>
<p>Each person will receive their record of deeds. Those who receive it in their <strong>right hand</strong> will be overjoyed — they have succeeded. Those who receive it in their <strong>left hand</strong> or behind their back will be in despair.</p>

<h4>The Scales (Mīzān)</h4>
<p>All deeds will be weighed on the divine scales. Good deeds on one side, bad deeds on the other. Even an atom's weight of good will be seen.</p>

<h4>The Bridge (Ṣirāṭ)</h4>
<p>A bridge is set over Jahannam that everyone must cross. Believers will cross it swiftly according to their deeds. Others will fall into the fire. May Allāh protect us.</p>
      `.trim(),
    },
    update: {
      title: 'Aqā\'id — Divine Decree, Life After Death & Barzakh',
      description: 'The concepts of qaḍā\' (divine foreknowledge) and qadr (divine decree), the evil eye and protection from it, the world as a place of means (asbāb), the journey of the soul, the life of barzakh, the Day of Judgement (blowing of the trumpet, resurrection, assembling, book of deeds, the scales).',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Explain the concepts of qaḍā' and qadr and their role in a Muslim's belief.</li>
  <li>Describe the evil eye and how to protect oneself from it.</li>
  <li>Understand the concept of asbāb (means) and tawakkul (reliance on Allāh).</li>
  <li>Outline the journey of the soul after death and the life of barzakh.</li>
  <li>Describe the major events of the Day of Judgement.</li>
</ul>

<h3>Qaḍā' and Qadr</h3>
<p><strong>Qaḍā'</strong> is Allāh's eternal knowledge of everything that has happened, is happening, and will happen. Nothing is hidden from His knowledge.</p>
<p><strong>Qadr</strong> is the execution of that divine plan. Everything happens according to Allāh's will. The Prophet ﷺ said: <em>"The pen has dried."</em> — meaning the decree is written. However, we do not know what is written for us, so we must still strive, make choices and use the means Allāh has provided.</p>
<p>Belief in qadr does not remove personal responsibility. A Muslim trusts in Allāh's plan while doing their utmost to fulfil their obligations.</p>

<h3>The Evil Eye ('Ayn)</h3>
<p>The Prophet ﷺ said: <em>"The evil eye is real."</em> (Ṣaḥīḥ Muslim). A person may unintentionally cause harm through an envious or admiring glance.</p>
<p><strong>Protection:</strong></p>
<ul>
  <li>Recite the Mu'awwidhatayn — Sūrah al-Falaq and Sūrah an-Nās.</li>
  <li>Say <strong>"MāshāAllāh"</strong> when admiring something.</li>
  <li>Make du'ā' for protection regularly.</li>
  <li>Recite Āyatul Kursī after every ṣalāh.</li>
</ul>

<h3>Asbāb — The World of Means</h3>
<p>Allāh is the true cause of everything, but He has created a world where means (asbāb) play a role. The Prophet ﷺ told a man who left his camel untied, trusting in Allāh: <em>"Tie it, then put your trust in Allāh."</em> (Tirmidhī)</p>
<p>Using means — medicine when ill, studying for exams, working for a livelihood — is itself part of tawakkul (reliance on Allāh). We use the means and trust the outcome to Allāh.</p>

<h3>The Journey of the Soul After Death</h3>
<p>When a person dies, the Angel of Death ('Izrā'īl) takes their soul. The souls of the righteous are wrapped in fragrant shrouds from Jannah, while the souls of the wicked are dragged out painfully.</p>

<h3>Barzakh — Life Between Death and Resurrection</h3>
<p>Barzakh is the period between death and the Day of Judgement. In the grave, the deceased are questioned by two angels — <strong>Munkar and Nakīr</strong> — about their Lord, their religion and their prophet.</p>
<p>Believers answer correctly and find comfort — their grave expands and is filled with light. Those who cannot answer face punishment — their grave constricts around them. The Prophet ﷺ encouraged seeking refuge from the punishment of the grave.</p>

<h3>The Day of Judgement</h3>
<p>The angel <strong>Isrāfīl</strong> will blow the trumpet (Ṣūr). At the first blow, everything in the heavens and earth will perish. At the second blow, all of creation will be resurrected and assembled on a vast plain.</p>

<h4>The Book of Deeds</h4>
<p>Each person will receive their record of deeds. Those who receive it in their <strong>right hand</strong> will be overjoyed — they have succeeded. Those who receive it in their <strong>left hand</strong> or behind their back will be in despair.</p>

<h4>The Scales (Mīzān)</h4>
<p>All deeds will be weighed on the divine scales. Good deeds on one side, bad deeds on the other. Even an atom's weight of good will be seen.</p>

<h4>The Bridge (Ṣirāṭ)</h4>
<p>A bridge is set over Jahannam that everyone must cross. Believers will cross it swiftly according to their deeds. Others will fall into the fire. May Allāh protect us.</p>
      `.trim(),
      orderIndex: 4,
    },
  });

  console.log('✅ Created Unit 4: Aqā\'id');

  // ──────────────────────────────────────────────
  // UNIT 5: AKHLĀQ
  // ──────────────────────────────────────────────

    const unitAkhlaq = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-akhlaq' } },
    create: {
      slug: 'maktab-7-akhlaq',
      courseId: course.id,
      title: 'Akhlāq — Spreading Rumours, Value of Time, Knowledge & Durūd',
      description: 'The danger of spreading rumours and verifying information, the value of time and using the five conditions before five others, the virtues of seeking knowledge, and the immense reward of sending ṣalāt \'alan nabiy (durūd) upon the Prophet ﷺ.',
      orderIndex: 5,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Explain the Islamic ruling on spreading rumours and unverified information.</li>
  <li>Appreciate the value of time and describe the ḥadīth of "five before five".</li>
  <li>Outline the virtues of seeking knowledge in Islām.</li>
  <li>Describe the reward of sending ṣalāt 'alan nabiy (durūd) upon the Prophet ﷺ.</li>
</ul>

<h3>Spreading Rumours</h3>
<p>Allāh says in the Qur'ān: <em>"O you who believe! If a sinful person brings you news, verify it, lest you harm people in ignorance and afterwards regret what you have done."</em> (Qur'ān 49:6)</p>
<p>Passing on unverified information can destroy reputations and break families apart. In the age of social media, rumours spread faster than ever. A Muslim must verify before sharing any news. The Prophet ﷺ said: <em>"It is enough to make a person a liar that he narrates everything he hears."</em> (Ṣaḥīḥ Muslim)</p>
<p>Backbiting (ghībah) and slander (buhtān) are major sins. The Qur'ān compares backbiting to eating the flesh of one's dead brother (Qur'ān 49:12).</p>

<h3>The Value of Time</h3>
<p>The Prophet ﷺ said: <em>"Take benefit of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death."</em> (al-Ḥākim)</p>
<p>Time is a trust (amānah) from Allāh. Every moment that passes can never be recovered. On the Day of Judgement, we will be asked how we spent our lives and our youth. A wise Muslim fills their time with beneficial actions — worship, learning, serving others — and avoids wasting it on idle pursuits.</p>
<p>Allāh swears by time in the Qur'ān: <em>"By time! Indeed, mankind is in loss, except those who believe, do righteous deeds, encourage each other to truth and encourage each other to patience."</em> (Qur'ān 103:1-3)</p>

<h3>Virtues of Knowledge</h3>
<p>The Prophet ﷺ said: <em>"Seeking knowledge is an obligation upon every Muslim."</em> (Ibn Mājah)</p>
<p>He also said: <em>"Whoever travels a path in search of knowledge, Allāh will make easy for him a path to Jannah."</em> (Ṣaḥīḥ Muslim)</p>
<p>Knowledge in Islām is not limited to religious sciences alone — all beneficial knowledge is valued. However, Islamic knowledge takes priority as it guides every aspect of life. Knowledge should be acted upon and shared with others. The angels lower their wings for the seeker of knowledge out of pleasure.</p>

<h3>Ṣalāt 'alan Nabiy (Durūd)</h3>
<p>Allāh commands the believers: <em>"Indeed, Allāh and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and greet him with peace."</em> (Qur'ān 33:56)</p>
<p>The Prophet ﷺ said: <em>"Whoever sends blessing on me once, Allāh will bless him ten times."</em> (Ṣaḥīḥ Muslim)</p>
<p>Friday is especially virtuous for sending durūd. The Prophet ﷺ said: <em>"The best of your days is Friday, so send abundant blessings upon me on that day."</em> (Abū Dāwūd)</p>
      `.trim(),
    },
    update: {
      title: 'Akhlāq — Spreading Rumours, Value of Time, Knowledge & Durūd',
      description: 'The danger of spreading rumours and verifying information, the value of time and using the five conditions before five others, the virtues of seeking knowledge, and the immense reward of sending ṣalāt \'alan nabiy (durūd) upon the Prophet ﷺ.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Explain the Islamic ruling on spreading rumours and unverified information.</li>
  <li>Appreciate the value of time and describe the ḥadīth of "five before five".</li>
  <li>Outline the virtues of seeking knowledge in Islām.</li>
  <li>Describe the reward of sending ṣalāt 'alan nabiy (durūd) upon the Prophet ﷺ.</li>
</ul>

<h3>Spreading Rumours</h3>
<p>Allāh says in the Qur'ān: <em>"O you who believe! If a sinful person brings you news, verify it, lest you harm people in ignorance and afterwards regret what you have done."</em> (Qur'ān 49:6)</p>
<p>Passing on unverified information can destroy reputations and break families apart. In the age of social media, rumours spread faster than ever. A Muslim must verify before sharing any news. The Prophet ﷺ said: <em>"It is enough to make a person a liar that he narrates everything he hears."</em> (Ṣaḥīḥ Muslim)</p>
<p>Backbiting (ghībah) and slander (buhtān) are major sins. The Qur'ān compares backbiting to eating the flesh of one's dead brother (Qur'ān 49:12).</p>

<h3>The Value of Time</h3>
<p>The Prophet ﷺ said: <em>"Take benefit of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death."</em> (al-Ḥākim)</p>
<p>Time is a trust (amānah) from Allāh. Every moment that passes can never be recovered. On the Day of Judgement, we will be asked how we spent our lives and our youth. A wise Muslim fills their time with beneficial actions — worship, learning, serving others — and avoids wasting it on idle pursuits.</p>
<p>Allāh swears by time in the Qur'ān: <em>"By time! Indeed, mankind is in loss, except those who believe, do righteous deeds, encourage each other to truth and encourage each other to patience."</em> (Qur'ān 103:1-3)</p>

<h3>Virtues of Knowledge</h3>
<p>The Prophet ﷺ said: <em>"Seeking knowledge is an obligation upon every Muslim."</em> (Ibn Mājah)</p>
<p>He also said: <em>"Whoever travels a path in search of knowledge, Allāh will make easy for him a path to Jannah."</em> (Ṣaḥīḥ Muslim)</p>
<p>Knowledge in Islām is not limited to religious sciences alone — all beneficial knowledge is valued. However, Islamic knowledge takes priority as it guides every aspect of life. Knowledge should be acted upon and shared with others. The angels lower their wings for the seeker of knowledge out of pleasure.</p>

<h3>Ṣalāt 'alan Nabiy (Durūd)</h3>
<p>Allāh commands the believers: <em>"Indeed, Allāh and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and greet him with peace."</em> (Qur'ān 33:56)</p>
<p>The Prophet ﷺ said: <em>"Whoever sends blessing on me once, Allāh will bless him ten times."</em> (Ṣaḥīḥ Muslim)</p>
<p>Friday is especially virtuous for sending durūd. The Prophet ﷺ said: <em>"The best of your days is Friday, so send abundant blessings upon me on that day."</em> (Abū Dāwūd)</p>
      `.trim(),
      orderIndex: 5,
    },
  });

  console.log('✅ Created Unit 5: Akhlāq');

  // ──────────────────────────────────────────────
  // UNIT 6: ĀDĀB
  // ──────────────────────────────────────────────

    const unitAdab = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-adab' } },
    create: {
      slug: 'maktab-7-adab',
      courseId: course.id,
      title: 'Ādāb — Social Manners',
      description: 'The five branches of Islām, the seriousness of swearing by Allāh\'s name, etiquette of answering questions, using a mobile phone, speech, the internet, walking with elders, serving elders, informing family of whereabouts, interaction with non-Muslims, expressing condolences, and the five rights of a Muslim.',
      orderIndex: 6,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Recall the five pillars (branches) of Islām.</li>
  <li>Explain the seriousness of taking oaths by Allāh's name.</li>
  <li>Describe the etiquette of using a mobile phone and the internet.</li>
  <li>Demonstrate the correct manner of walking with and serving elders.</li>
  <li>Outline the Islamic guidelines for interacting with non-Muslims.</li>
  <li>List the five rights of a Muslim upon another Muslim.</li>
</ul>

<h3>The Five Pillars of Islām</h3>
<p>Islām is built upon five pillars: <strong>Shahādah</strong> (testimony of faith), <strong>Ṣalāh</strong> (prayer), <strong>Zakāh</strong> (obligatory charity), <strong>Ṣawm</strong> (fasting in Ramaḍān), and <strong>Ḥajj</strong> (pilgrimage to Makkah). These are the foundations that every Muslim must uphold.</p>

<h3>Swearing Oaths</h3>
<p>Taking an oath by Allāh's name is a serious matter. The Prophet ﷺ said: <em>"Whoever has to take an oath should swear by Allāh or keep silent."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>A false oath (yamīn ghamūs) is a major sin. If a person breaks an oath (yamīn mun'aqidah), they must pay <strong>kaffārah</strong> (expiation): feed ten poor people, or clothe them, or fast for three consecutive days.</p>

<h3>Phone Etiquette</h3>
<ul>
  <li>Answer politely, beginning with salām.</li>
  <li>Do not disturb others — silence the phone during ṣalāh times and lessons.</li>
  <li>Keep conversations brief and purposeful.</li>
  <li>Do not use phones during meals, gatherings or when someone is speaking to you.</li>
  <li>Be mindful of the time — do not call too early or too late.</li>
</ul>

<h3>Internet Safety</h3>
<ul>
  <li>Be cautious about what you share online — once posted, it can never truly be deleted.</li>
  <li>Do not engage with inappropriate or ḥarām content.</li>
  <li>Remember that Allāh is watching, even when you are alone with a screen.</li>
  <li>Protect your personal information and never share details with strangers.</li>
  <li>Cyberbullying is ḥarām — causing harm to others online carries the same sin as doing so in person.</li>
</ul>

<h3>Walking with Elders</h3>
<p>Walk slightly behind or beside elders, not ahead of them. Offer your arm for support if needed. Open doors for them and let them enter first. These small acts of respect carry great reward.</p>

<h3>Serving Elders</h3>
<p>It is from the sunnah to serve the elderly. Pour water for them, carry their belongings, give them the best seat, and speak to them with gentleness and respect. The Prophet ﷺ said: <em>"He is not one of us who does not show mercy to our young ones and respect to our elders."</em> (Tirmidhī)</p>

<h3>Interaction with Non-Muslims</h3>
<p>Allāh says: <em>"Allāh does not forbid you from those who do not fight you because of religion and do not expel you from your homes — from being righteous toward them and acting justly toward them. Indeed, Allāh loves those who act justly."</em> (Qur'ān 60:8)</p>
<p>A Muslim should be kind, just and honest with everyone. We do not participate in the religious ceremonies of other faiths, but we show excellent character, fulfil our agreements, and treat neighbours — Muslim and non-Muslim — with kindness.</p>

<h3>The Five Rights of a Muslim</h3>
<p>The Prophet ﷺ said: <em>"The rights of a Muslim upon another Muslim are five:"</em></p>
<ol>
  <li><strong>Returning the salām</strong> — when greeted, respond in kind or better.</li>
  <li><strong>Visiting the sick</strong> — check on those who are unwell.</li>
  <li><strong>Following the funeral</strong> — attend the janāzah prayer.</li>
  <li><strong>Accepting invitations</strong> — respond positively to invitations.</li>
  <li><strong>Saying yarḥamukallāh</strong> — when someone sneezes and says Alḥamdulillāh.</li>
</ol>
<p>(Ṣaḥīḥ al-Bukhārī)</p>
      `.trim(),
    },
    update: {
      title: 'Ādāb — Social Manners',
      description: 'The five branches of Islām, the seriousness of swearing by Allāh\'s name, etiquette of answering questions, using a mobile phone, speech, the internet, walking with elders, serving elders, informing family of whereabouts, interaction with non-Muslims, expressing condolences, and the five rights of a Muslim.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Recall the five pillars (branches) of Islām.</li>
  <li>Explain the seriousness of taking oaths by Allāh's name.</li>
  <li>Describe the etiquette of using a mobile phone and the internet.</li>
  <li>Demonstrate the correct manner of walking with and serving elders.</li>
  <li>Outline the Islamic guidelines for interacting with non-Muslims.</li>
  <li>List the five rights of a Muslim upon another Muslim.</li>
</ul>

<h3>The Five Pillars of Islām</h3>
<p>Islām is built upon five pillars: <strong>Shahādah</strong> (testimony of faith), <strong>Ṣalāh</strong> (prayer), <strong>Zakāh</strong> (obligatory charity), <strong>Ṣawm</strong> (fasting in Ramaḍān), and <strong>Ḥajj</strong> (pilgrimage to Makkah). These are the foundations that every Muslim must uphold.</p>

<h3>Swearing Oaths</h3>
<p>Taking an oath by Allāh's name is a serious matter. The Prophet ﷺ said: <em>"Whoever has to take an oath should swear by Allāh or keep silent."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>A false oath (yamīn ghamūs) is a major sin. If a person breaks an oath (yamīn mun'aqidah), they must pay <strong>kaffārah</strong> (expiation): feed ten poor people, or clothe them, or fast for three consecutive days.</p>

<h3>Phone Etiquette</h3>
<ul>
  <li>Answer politely, beginning with salām.</li>
  <li>Do not disturb others — silence the phone during ṣalāh times and lessons.</li>
  <li>Keep conversations brief and purposeful.</li>
  <li>Do not use phones during meals, gatherings or when someone is speaking to you.</li>
  <li>Be mindful of the time — do not call too early or too late.</li>
</ul>

<h3>Internet Safety</h3>
<ul>
  <li>Be cautious about what you share online — once posted, it can never truly be deleted.</li>
  <li>Do not engage with inappropriate or ḥarām content.</li>
  <li>Remember that Allāh is watching, even when you are alone with a screen.</li>
  <li>Protect your personal information and never share details with strangers.</li>
  <li>Cyberbullying is ḥarām — causing harm to others online carries the same sin as doing so in person.</li>
</ul>

<h3>Walking with Elders</h3>
<p>Walk slightly behind or beside elders, not ahead of them. Offer your arm for support if needed. Open doors for them and let them enter first. These small acts of respect carry great reward.</p>

<h3>Serving Elders</h3>
<p>It is from the sunnah to serve the elderly. Pour water for them, carry their belongings, give them the best seat, and speak to them with gentleness and respect. The Prophet ﷺ said: <em>"He is not one of us who does not show mercy to our young ones and respect to our elders."</em> (Tirmidhī)</p>

<h3>Interaction with Non-Muslims</h3>
<p>Allāh says: <em>"Allāh does not forbid you from those who do not fight you because of religion and do not expel you from your homes — from being righteous toward them and acting justly toward them. Indeed, Allāh loves those who act justly."</em> (Qur'ān 60:8)</p>
<p>A Muslim should be kind, just and honest with everyone. We do not participate in the religious ceremonies of other faiths, but we show excellent character, fulfil our agreements, and treat neighbours — Muslim and non-Muslim — with kindness.</p>

<h3>The Five Rights of a Muslim</h3>
<p>The Prophet ﷺ said: <em>"The rights of a Muslim upon another Muslim are five:"</em></p>
<ol>
  <li><strong>Returning the salām</strong> — when greeted, respond in kind or better.</li>
  <li><strong>Visiting the sick</strong> — check on those who are unwell.</li>
  <li><strong>Following the funeral</strong> — attend the janāzah prayer.</li>
  <li><strong>Accepting invitations</strong> — respond positively to invitations.</li>
  <li><strong>Saying yarḥamukallāh</strong> — when someone sneezes and says Alḥamdulillāh.</li>
</ol>
<p>(Ṣaḥīḥ al-Bukhārī)</p>
      `.trim(),
      orderIndex: 6,
    },
  });

  console.log('✅ Created Unit 6: Ādāb');

  // ══════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('📝 Creating quiz questions...');

  // --- Fiqh Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-7-fiqh-q1' },
      create: {
        externalId: 'maktab-7-fiqh-q1',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many verses in the Qur\'ān require Sajdah Tilāwah?',
        options: JSON.stringify(['7', '10', '14', '20']),
        correctAnswer: '14',
        explanation: 'There are 14 verses in the Qur\'ān which require sajdah upon reciting or hearing them.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How many verses in the Qur\'ān require Sajdah Tilāwah?',
        options: JSON.stringify(['7', '10', '14', '20']),
        correctAnswer: '14',
        explanation: 'There are 14 verses in the Qur\'ān which require sajdah upon reciting or hearing them.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-fiqh-q2' },
      create: {
        externalId: 'maktab-7-fiqh-q2',
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'A musāfir must intend to travel more than 54 miles to qualify for qaṣr ṣalāh.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'If a person intends to travel more than 54 miles (87 km), they are classified as a musāfir and perform qaṣr.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'A musāfir must intend to travel more than 54 miles to qualify for qaṣr ṣalāh.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'If a person intends to travel more than 54 miles (87 km), they are classified as a musāfir and perform qaṣr.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-fiqh-q3' },
      create: {
        externalId: 'maktab-7-fiqh-q3',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What percentage of wealth must be given as zakāh?',
        options: JSON.stringify(['1%', '2.5%', '5%', '10%']),
        correctAnswer: '2.5%',
        explanation: 'Zakāh is 2.5% of total zakātable assets after deducting debts.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What percentage of wealth must be given as zakāh?',
        options: JSON.stringify(['1%', '2.5%', '5%', '10%']),
        correctAnswer: '2.5%',
        explanation: 'Zakāh is 2.5% of total zakātable assets after deducting debts.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-fiqh-q4' },
      create: {
        externalId: 'maktab-7-fiqh-q4',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which nights should Laylatul Qadr be sought?',
        options: JSON.stringify(['First ten nights', 'Middle ten nights', 'Odd nights of the last ten', 'Every night']),
        correctAnswer: 'Odd nights of the last ten',
        explanation: 'Laylatul Qadr should be sought in the odd nights of the last ten nights of Ramaḍān.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Which nights should Laylatul Qadr be sought?',
        options: JSON.stringify(['First ten nights', 'Middle ten nights', 'Odd nights of the last ten', 'Every night']),
        correctAnswer: 'Odd nights of the last ten',
        explanation: 'Laylatul Qadr should be sought in the odd nights of the last ten nights of Ramaḍān.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-fiqh-q5' },
      create: {
        externalId: 'maktab-7-fiqh-q5',
        unitId: unitFiqh.id,
        type: 'FILL_BLANK',
        questionText: 'The Arabic term for the barrier placed in front of a person praying in an open space is called a _____.',
        options: undefined,
        correctAnswer: 'sutrah',
        explanation: 'A sutrah is a barrier placed in front of a person praying in an open space. It must be at least an arm\'s length and finger-thick.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'The Arabic term for the barrier placed in front of a person praying in an open space is called a _____.',
        options: undefined,
        correctAnswer: 'sutrah',
        explanation: 'A sutrah is a barrier placed in front of a person praying in an open space. It must be at least an arm\'s length and finger-thick.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-fiqh-q6' },
      create: {
        externalId: 'maktab-7-fiqh-q6',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What must be said when slaughtering an animal for it to be ḥalāl?',
        options: JSON.stringify(['SubḥānAllāh', 'Bismillāhi Allāhu Akbar', 'Alḥamdulillāh', 'Lā ilāha illallāh']),
        correctAnswer: 'Bismillāhi Allāhu Akbar',
        explanation: 'The Tasmiyah (Bismillāhi Allāhu Akbar) must be said when slaughtering an animal.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What must be said when slaughtering an animal for it to be ḥalāl?',
        options: JSON.stringify(['SubḥānAllāh', 'Bismillāhi Allāhu Akbar', 'Alḥamdulillāh', 'Lā ilāha illallāh']),
        correctAnswer: 'Bismillāhi Allāhu Akbar',
        explanation: 'The Tasmiyah (Bismillāhi Allāhu Akbar) must be said when slaughtering an animal.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-fiqh-q7' },
      create: {
        externalId: 'maktab-7-fiqh-q7',
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'I\'tikāf during the last ten days of Ramaḍān is Sunnah Mu\'akkadah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'I\'tikāf during the last ten days of Ramaḍān is Sunnah Mu\'akkadah — a collective obligation.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'I\'tikāf during the last ten days of Ramaḍān is Sunnah Mu\'akkadah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'I\'tikāf during the last ten days of Ramaḍān is Sunnah Mu\'akkadah — a collective obligation.',
        difficulty: 'MEDIUM',
      },
    })
  ]);

  // --- Aḥādīth Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-7-ahadith-q1' },
      create: {
        externalId: 'maktab-7-ahadith-q1',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth, who are the people of Jannah?',
        options: JSON.stringify(['The rich and powerful', 'The weak and humble', 'The famous', 'The scholars only']),
        correctAnswer: 'The weak and humble',
        explanation: 'The Prophet ﷺ said the inhabitants of Jannah are every weak and humble person.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'According to the ḥadīth, who are the people of Jannah?',
        options: JSON.stringify(['The rich and powerful', 'The weak and humble', 'The famous', 'The scholars only']),
        correctAnswer: 'The weak and humble',
        explanation: 'The Prophet ﷺ said the inhabitants of Jannah are every weak and humble person.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-ahadith-q2' },
      create: {
        externalId: 'maktab-7-ahadith-q2',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ define ghībah (backbiting) as?',
        options: JSON.stringify(['Lying about someone', 'Saying about your brother what he would not like', 'Criticising in public', 'Ignoring someone']),
        correctAnswer: 'Saying about your brother what he would not like',
        explanation: 'The Prophet ﷺ said: "Backbiting is to say anything about your brother which he would not like." (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What did the Prophet ﷺ define ghībah (backbiting) as?',
        options: JSON.stringify(['Lying about someone', 'Saying about your brother what he would not like', 'Criticising in public', 'Ignoring someone']),
        correctAnswer: 'Saying about your brother what he would not like',
        explanation: 'The Prophet ﷺ said: "Backbiting is to say anything about your brother which he would not like." (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-ahadith-q3' },
      create: {
        externalId: 'maktab-7-ahadith-q3',
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ said that ṣalāh in congregation is 27 times superior to praying alone.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: '\'Abdullāh ibn \'Umar narrated that the Prophet ﷺ said ṣalāh in congregation is 27 times superior. (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The Prophet ﷺ said that ṣalāh in congregation is 27 times superior to praying alone.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: '\'Abdullāh ibn \'Umar narrated that the Prophet ﷺ said ṣalāh in congregation is 27 times superior. (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-ahadith-q4' },
      create: {
        externalId: 'maktab-7-ahadith-q4',
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'The Prophet ﷺ said: "Every religion has a distinctive characteristic, and the characteristic of Islām is _____."',
        options: undefined,
        correctAnswer: 'modesty',
        explanation: 'Anas رضي الله عنه narrated this ḥadīth from Ibn Mājah. The Arabic word is ḥayā\'.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The Prophet ﷺ said: "Every religion has a distinctive characteristic, and the characteristic of Islām is _____."',
        options: undefined,
        correctAnswer: 'modesty',
        explanation: 'Anas رضي الله عنه narrated this ḥadīth from Ibn Mājah. The Arabic word is ḥayā\'.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-ahadith-q5' },
      create: {
        externalId: 'maktab-7-ahadith-q5',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What du\'ā\' did the Prophet ﷺ teach \'Ā\'ishah for Laylatul Qadr?',
        options: JSON.stringify(['SubḥānAllāh', 'Allāhumma innaka \'afuwwun tuḥibbul \'afwa fa\'fu \'annī', 'Lā ḥawla wa lā quwwata illā billāh', 'Allāhu Akbar']),
        correctAnswer: 'Allāhumma innaka \'afuwwun tuḥibbul \'afwa fa\'fu \'annī',
        explanation: 'The Prophet ﷺ told \'Ā\'ishah to say: "O Allāh, indeed You are Pardoning, You love to pardon, so pardon me." (Tirmidhī)',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'What du\'ā\' did the Prophet ﷺ teach \'Ā\'ishah for Laylatul Qadr?',
        options: JSON.stringify(['SubḥānAllāh', 'Allāhumma innaka \'afuwwun tuḥibbul \'afwa fa\'fu \'annī', 'Lā ḥawla wa lā quwwata illā billāh', 'Allāhu Akbar']),
        correctAnswer: 'Allāhumma innaka \'afuwwun tuḥibbul \'afwa fa\'fu \'annī',
        explanation: 'The Prophet ﷺ told \'Ā\'ishah to say: "O Allāh, indeed You are Pardoning, You love to pardon, so pardon me." (Tirmidhī)',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-ahadith-q6' },
      create: {
        externalId: 'maktab-7-ahadith-q6',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How should one change an evil according to the ḥadīth?',
        options: JSON.stringify(['Only with the hand', 'Hand, then tongue, then heart', 'Only in the heart', 'By ignoring it']),
        correctAnswer: 'Hand, then tongue, then heart',
        explanation: 'The Prophet ﷺ said to change evil with the hand, then the tongue, then detesting it in the heart — the weakest degree of faith. (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How should one change an evil according to the ḥadīth?',
        options: JSON.stringify(['Only with the hand', 'Hand, then tongue, then heart', 'Only in the heart', 'By ignoring it']),
        correctAnswer: 'Hand, then tongue, then heart',
        explanation: 'The Prophet ﷺ said to change evil with the hand, then the tongue, then detesting it in the heart — the weakest degree of faith. (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Sīrah Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-7-sirah-q1' },
      create: {
        externalId: 'maktab-7-sirah-q1',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What title was \'Umar given after accepting Islām?',
        options: JSON.stringify(['As-Siddīq', 'Al-Fārūq', 'Al-Amīn', 'Dhun-Nūrayn']),
        correctAnswer: 'Al-Fārūq',
        explanation: '\'Umar was given the title "al-Fārūq" — the one who distinguishes truth from falsehood.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What title was \'Umar given after accepting Islām?',
        options: JSON.stringify(['As-Siddīq', 'Al-Fārūq', 'Al-Amīn', 'Dhun-Nūrayn']),
        correctAnswer: 'Al-Fārūq',
        explanation: '\'Umar was given the title "al-Fārūq" — the one who distinguishes truth from falsehood.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-sirah-q2' },
      create: {
        externalId: 'maktab-7-sirah-q2',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What sūrah softened \'Umar\'s heart leading to his acceptance of Islām?',
        options: JSON.stringify(['Sūrah al-Fātiḥah', 'Sūrah Yāsīn', 'Sūrah Ṭā Hā', 'Sūrah al-Mulk']),
        correctAnswer: 'Sūrah Ṭā Hā',
        explanation: '\'Umar heard his sister reciting Sūrah Ṭā Hā which softened his heart and led him to accept Islām.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'What sūrah softened \'Umar\'s heart leading to his acceptance of Islām?',
        options: JSON.stringify(['Sūrah al-Fātiḥah', 'Sūrah Yāsīn', 'Sūrah Ṭā Hā', 'Sūrah al-Mulk']),
        correctAnswer: 'Sūrah Ṭā Hā',
        explanation: '\'Umar heard his sister reciting Sūrah Ṭā Hā which softened his heart and led him to accept Islām.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-sirah-q3' },
      create: {
        externalId: 'maktab-7-sirah-q3',
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ preferred white garments.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Prophet ﷺ said: "Wear white clothes, for they are the best of your clothes." (Tirmidhī)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The Prophet ﷺ preferred white garments.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Prophet ﷺ said: "Wear white clothes, for they are the best of your clothes." (Tirmidhī)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-sirah-q4' },
      create: {
        externalId: 'maktab-7-sirah-q4',
        unitId: unitSirah.id,
        type: 'FILL_BLANK',
        questionText: 'The Prophet ﷺ\'s ring was inscribed with the words _____.',
        options: undefined,
        correctAnswer: 'Muḥammad Rasūlullāh',
        explanation: 'The Prophet ﷺ wore a silver ring inscribed with "Muḥammad Rasūlullāh" on his right hand.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'The Prophet ﷺ\'s ring was inscribed with the words _____.',
        options: undefined,
        correctAnswer: 'Muḥammad Rasūlullāh',
        explanation: 'The Prophet ﷺ wore a silver ring inscribed with "Muḥammad Rasūlullāh" on his right hand.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-sirah-q5' },
      create: {
        externalId: 'maktab-7-sirah-q5',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '\'Umar established which calendar during his khilāfah?',
        options: JSON.stringify(['Gregorian', 'Solar', 'Hijri', 'Lunar-Solar']),
        correctAnswer: 'Hijri',
        explanation: '\'Umar established the Islamic (Hijri) calendar, starting from the migration to Madīnah.',
        difficulty: 'EASY',
      },
      update: {
        questionText: '\'Umar established which calendar during his khilāfah?',
        options: JSON.stringify(['Gregorian', 'Solar', 'Hijri', 'Lunar-Solar']),
        correctAnswer: 'Hijri',
        explanation: '\'Umar established the Islamic (Hijri) calendar, starting from the migration to Madīnah.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-sirah-q6' },
      create: {
        externalId: 'maktab-7-sirah-q6',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Where is \'Umar ibn al-Khaṭṭāb buried?',
        options: JSON.stringify(['Jannatul Baqī\'', 'Beside the Prophet ﷺ and Abū Bakr', 'In Jerusalem', 'In Makkah']),
        correctAnswer: 'Beside the Prophet ﷺ and Abū Bakr',
        explanation: '\'Umar was buried beside the Prophet ﷺ and Abū Bakr in the chamber of \'Ā\'ishah رضي الله عنها.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Where is \'Umar ibn al-Khaṭṭāb buried?',
        options: JSON.stringify(['Jannatul Baqī\'', 'Beside the Prophet ﷺ and Abū Bakr', 'In Jerusalem', 'In Makkah']),
        correctAnswer: 'Beside the Prophet ﷺ and Abū Bakr',
        explanation: '\'Umar was buried beside the Prophet ﷺ and Abū Bakr in the chamber of \'Ā\'ishah رضي الله عنها.',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Tārīkh Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-7-tarikh-q1' },
      create: {
        externalId: 'maktab-7-tarikh-q1',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who was the guardian of Maryam عليها السلام?',
        options: JSON.stringify(['Ibrāhīm', 'Zakariyyā', 'Yaḥyā', '\'Imrān']),
        correctAnswer: 'Zakariyyā',
        explanation: 'Zakariyyā عليه السلام was the guardian of Maryam عليها السلام.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Who was the guardian of Maryam عليها السلام?',
        options: JSON.stringify(['Ibrāhīm', 'Zakariyyā', 'Yaḥyā', '\'Imrān']),
        correctAnswer: 'Zakariyyā',
        explanation: 'Zakariyyā عليه السلام was the guardian of Maryam عليها السلام.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-tarikh-q2' },
      create: {
        externalId: 'maktab-7-tarikh-q2',
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: 'Yaḥyā عليه السلام was given prophethood as a child.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Qur\'ān states: "We gave him wisdom while yet a child." (Qur\'ān 19:12)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Yaḥyā عليه السلام was given prophethood as a child.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Qur\'ān states: "We gave him wisdom while yet a child." (Qur\'ān 19:12)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-tarikh-q3' },
      create: {
        externalId: 'maktab-7-tarikh-q3',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What was the capital of the Abbasid Khilāfah?',
        options: JSON.stringify(['Damascus', 'Makkah', 'Baghdad', 'Cairo']),
        correctAnswer: 'Baghdad',
        explanation: 'The Abbasids moved the capital from Damascus to Baghdad, which became one of the greatest cities in the world.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What was the capital of the Abbasid Khilāfah?',
        options: JSON.stringify(['Damascus', 'Makkah', 'Baghdad', 'Cairo']),
        correctAnswer: 'Baghdad',
        explanation: 'The Abbasids moved the capital from Damascus to Baghdad, which became one of the greatest cities in the world.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-tarikh-q4' },
      create: {
        externalId: 'maktab-7-tarikh-q4',
        unitId: unitTarikh.id,
        type: 'FILL_BLANK',
        questionText: 'The Abbasid institution known as the _____ was a major centre of learning and translation.',
        options: undefined,
        correctAnswer: 'Bayt al-Ḥikmah',
        explanation: 'The Bayt al-Ḥikmah (House of Wisdom) was established during the Abbasid era as a centre of learning.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'The Abbasid institution known as the _____ was a major centre of learning and translation.',
        options: undefined,
        correctAnswer: 'Bayt al-Ḥikmah',
        explanation: 'The Bayt al-Ḥikmah (House of Wisdom) was established during the Abbasid era as a centre of learning.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-tarikh-q5' },
      create: {
        externalId: 'maktab-7-tarikh-q5',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'When did the Abbasid Khilāfah fall to the Mongols?',
        options: JSON.stringify(['1099 CE', '1258 CE', '1453 CE', '1492 CE']),
        correctAnswer: '1258 CE',
        explanation: 'The Abbasid Khilāfah fell in 1258 CE when the Mongol army sacked Baghdad.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'When did the Abbasid Khilāfah fall to the Mongols?',
        options: JSON.stringify(['1099 CE', '1258 CE', '1453 CE', '1492 CE']),
        correctAnswer: '1258 CE',
        explanation: 'The Abbasid Khilāfah fell in 1258 CE when the Mongol army sacked Baghdad.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-tarikh-q6' },
      create: {
        externalId: 'maktab-7-tarikh-q6',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The Abbasids descended from which relative of the Prophet ﷺ?',
        options: JSON.stringify(['Abū Ṭālib', 'Al-\'Abbās', 'Ḥamzah', 'Abū Lahab']),
        correctAnswer: 'Al-\'Abbās',
        explanation: 'The Abbasid dynasty descended from al-\'Abbās, the uncle of the Prophet ﷺ.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The Abbasids descended from which relative of the Prophet ﷺ?',
        options: JSON.stringify(['Abū Ṭālib', 'Al-\'Abbās', 'Ḥamzah', 'Abū Lahab']),
        correctAnswer: 'Al-\'Abbās',
        explanation: 'The Abbasid dynasty descended from al-\'Abbās, the uncle of the Prophet ﷺ.',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Aqā'id Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-7-aqaid-q1' },
      create: {
        externalId: 'maktab-7-aqaid-q1',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is qaḍā\'?',
        options: JSON.stringify(['Divine foreknowledge of everything', 'A type of prayer', 'A charity', 'A fasting method']),
        correctAnswer: 'Divine foreknowledge of everything',
        explanation: 'Qaḍā\' is Allāh\'s eternal knowledge of everything that has happened, is happening, and will happen.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What is qaḍā\'?',
        options: JSON.stringify(['Divine foreknowledge of everything', 'A type of prayer', 'A charity', 'A fasting method']),
        correctAnswer: 'Divine foreknowledge of everything',
        explanation: 'Qaḍā\' is Allāh\'s eternal knowledge of everything that has happened, is happening, and will happen.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-aqaid-q2' },
      create: {
        externalId: 'maktab-7-aqaid-q2',
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ said the evil eye is real.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Prophet ﷺ said: "The evil eye is real." (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The Prophet ﷺ said the evil eye is real.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Prophet ﷺ said: "The evil eye is real." (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-aqaid-q3' },
      create: {
        externalId: 'maktab-7-aqaid-q3',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the two sūrahs known as the Mu\'awwidhatayn?',
        options: JSON.stringify(['Al-Fātiḥah and Al-Baqarah', 'Al-Falaq and An-Nās', 'Al-Ikhlāṣ and Al-Kāfirūn', 'Yāsīn and Ar-Raḥmān']),
        correctAnswer: 'Al-Falaq and An-Nās',
        explanation: 'The Mu\'awwidhatayn are Sūrah al-Falaq and Sūrah an-Nās, recited for protection.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What are the two sūrahs known as the Mu\'awwidhatayn?',
        options: JSON.stringify(['Al-Fātiḥah and Al-Baqarah', 'Al-Falaq and An-Nās', 'Al-Ikhlāṣ and Al-Kāfirūn', 'Yāsīn and Ar-Raḥmān']),
        correctAnswer: 'Al-Falaq and An-Nās',
        explanation: 'The Mu\'awwidhatayn are Sūrah al-Falaq and Sūrah an-Nās, recited for protection.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-aqaid-q4' },
      create: {
        externalId: 'maktab-7-aqaid-q4',
        unitId: unitAqaid.id,
        type: 'FILL_BLANK',
        questionText: 'The period between death and resurrection is called _____.',
        options: undefined,
        correctAnswer: 'barzakh',
        explanation: 'Barzakh is the period between death and the Day of Judgement where the soul awaits resurrection.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'The period between death and resurrection is called _____.',
        options: undefined,
        correctAnswer: 'barzakh',
        explanation: 'Barzakh is the period between death and the Day of Judgement where the soul awaits resurrection.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-aqaid-q5' },
      create: {
        externalId: 'maktab-7-aqaid-q5',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who questions the deceased in the grave?',
        options: JSON.stringify(['Jibrīl and Mīkā\'īl', 'Munkar and Nakīr', 'Isrāfīl and \'Izrā\'īl', 'Riḍwān and Mālik']),
        correctAnswer: 'Munkar and Nakīr',
        explanation: 'Munkar and Nakīr are the two angels who question the deceased in the grave.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'Who questions the deceased in the grave?',
        options: JSON.stringify(['Jibrīl and Mīkā\'īl', 'Munkar and Nakīr', 'Isrāfīl and \'Izrā\'īl', 'Riḍwān and Mālik']),
        correctAnswer: 'Munkar and Nakīr',
        explanation: 'Munkar and Nakīr are the two angels who question the deceased in the grave.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-aqaid-q6' },
      create: {
        externalId: 'maktab-7-aqaid-q6',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'A person who receives their book of deeds in the right hand has...',
        options: JSON.stringify(['Failed', 'Succeeded', 'More time', 'Another chance']),
        correctAnswer: 'Succeeded',
        explanation: 'Receiving the book of deeds in the right hand is a sign of success on the Day of Judgement.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'A person who receives their book of deeds in the right hand has...',
        options: JSON.stringify(['Failed', 'Succeeded', 'More time', 'Another chance']),
        correctAnswer: 'Succeeded',
        explanation: 'Receiving the book of deeds in the right hand is a sign of success on the Day of Judgement.',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Akhlāq Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-7-akhlaq-q1' },
      create: {
        externalId: 'maktab-7-akhlaq-q1',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the Qur\'ān advise when a sinful person brings news?',
        options: JSON.stringify(['Accept it immediately', 'Verify it', 'Ignore it completely', 'Spread it quickly']),
        correctAnswer: 'Verify it',
        explanation: '"O you who believe! If a sinful person brings you news, verify it." (Qur\'ān 49:6)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does the Qur\'ān advise when a sinful person brings news?',
        options: JSON.stringify(['Accept it immediately', 'Verify it', 'Ignore it completely', 'Spread it quickly']),
        correctAnswer: 'Verify it',
        explanation: '"O you who believe! If a sinful person brings you news, verify it." (Qur\'ān 49:6)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-akhlaq-q2' },
      create: {
        externalId: 'maktab-7-akhlaq-q2',
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: 'The Prophet ﷺ said: "Take benefit of _____ before five."',
        options: undefined,
        correctAnswer: 'five',
        explanation: 'Youth before old age, health before sickness, wealth before poverty, free time before busyness, life before death.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The Prophet ﷺ said: "Take benefit of _____ before five."',
        options: undefined,
        correctAnswer: 'five',
        explanation: 'Youth before old age, health before sickness, wealth before poverty, free time before busyness, life before death.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-akhlaq-q3' },
      create: {
        externalId: 'maktab-7-akhlaq-q3',
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'Seeking knowledge is an obligation upon every Muslim.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Prophet ﷺ said: "Seeking knowledge is an obligation upon every Muslim." (Ibn Mājah)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Seeking knowledge is an obligation upon every Muslim.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Prophet ﷺ said: "Seeking knowledge is an obligation upon every Muslim." (Ibn Mājah)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-akhlaq-q4' },
      create: {
        externalId: 'maktab-7-akhlaq-q4',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many times does Allāh bless a person who sends one ṣalāt upon the Prophet ﷺ?',
        options: JSON.stringify(['Once', 'Five times', 'Ten times', 'Seventy times']),
        correctAnswer: 'Ten times',
        explanation: 'The Prophet ﷺ said: "Whoever sends blessing on me once, Allāh will bless him ten times." (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How many times does Allāh bless a person who sends one ṣalāt upon the Prophet ﷺ?',
        options: JSON.stringify(['Once', 'Five times', 'Ten times', 'Seventy times']),
        correctAnswer: 'Ten times',
        explanation: 'The Prophet ﷺ said: "Whoever sends blessing on me once, Allāh will bless him ten times." (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-akhlaq-q5' },
      create: {
        externalId: 'maktab-7-akhlaq-q5',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which day is especially virtuous for sending durūd?',
        options: JSON.stringify(['Monday', 'Wednesday', 'Friday', 'Sunday']),
        correctAnswer: 'Friday',
        explanation: 'The Prophet ﷺ said: "The best of your days is Friday, so send abundant blessings upon me on that day." (Abū Dāwūd)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Which day is especially virtuous for sending durūd?',
        options: JSON.stringify(['Monday', 'Wednesday', 'Friday', 'Sunday']),
        correctAnswer: 'Friday',
        explanation: 'The Prophet ﷺ said: "The best of your days is Friday, so send abundant blessings upon me on that day." (Abū Dāwūd)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-akhlaq-q6' },
      create: {
        externalId: 'maktab-7-akhlaq-q6',
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: 'The Prophet ﷺ said whoever travels a path in search of knowledge, Allāh will make easy a path to _____.',
        options: undefined,
        correctAnswer: 'Jannah',
        explanation: '"Whoever travels a path in search of knowledge, Allāh will make easy for him a path to Jannah." (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The Prophet ﷺ said whoever travels a path in search of knowledge, Allāh will make easy a path to _____.',
        options: undefined,
        correctAnswer: 'Jannah',
        explanation: '"Whoever travels a path in search of knowledge, Allāh will make easy for him a path to Jannah." (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Ādāb Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-7-adab-q1' },
      create: {
        externalId: 'maktab-7-adab-q1',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'By whose name should a Muslim swear when taking an oath?',
        options: JSON.stringify(['Their own name', 'Allāh\'s name', 'The Prophet\'s name', 'Their parents\' names']),
        correctAnswer: 'Allāh\'s name',
        explanation: 'The Prophet ﷺ said: "Whoever has to take an oath should swear by Allāh or keep silent." (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'By whose name should a Muslim swear when taking an oath?',
        options: JSON.stringify(['Their own name', 'Allāh\'s name', 'The Prophet\'s name', 'Their parents\' names']),
        correctAnswer: 'Allāh\'s name',
        explanation: 'The Prophet ﷺ said: "Whoever has to take an oath should swear by Allāh or keep silent." (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-adab-q2' },
      create: {
        externalId: 'maktab-7-adab-q2',
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'Cyberbullying is permissible in Islām.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Cyberbullying is ḥarām — causing harm to others online carries the same sin as doing so in person.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Cyberbullying is permissible in Islām.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Cyberbullying is ḥarām — causing harm to others online carries the same sin as doing so in person.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-adab-q3' },
      create: {
        externalId: 'maktab-7-adab-q3',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many rights does a Muslim have over another Muslim?',
        options: JSON.stringify(['Three', 'Four', 'Five', 'Seven']),
        correctAnswer: 'Five',
        explanation: 'The five rights: returning salām, visiting the sick, following the funeral, accepting invitations, and saying yarḥamukallāh when someone sneezes.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How many rights does a Muslim have over another Muslim?',
        options: JSON.stringify(['Three', 'Four', 'Five', 'Seven']),
        correctAnswer: 'Five',
        explanation: 'The five rights: returning salām, visiting the sick, following the funeral, accepting invitations, and saying yarḥamukallāh when someone sneezes.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-adab-q4' },
      create: {
        externalId: 'maktab-7-adab-q4',
        unitId: unitAdab.id,
        type: 'FILL_BLANK',
        questionText: 'The expiation required for breaking an oath is called _____.',
        options: undefined,
        correctAnswer: 'kaffārah',
        explanation: 'Kaffārah is the expiation for breaking an oath: feeding ten poor people, clothing them, or fasting three days.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'The expiation required for breaking an oath is called _____.',
        options: undefined,
        correctAnswer: 'kaffārah',
        explanation: 'Kaffārah is the expiation for breaking an oath: feeding ten poor people, clothing them, or fasting three days.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-adab-q5' },
      create: {
        externalId: 'maktab-7-adab-q5',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How should one walk with elders?',
        options: JSON.stringify(['Far ahead of them', 'Slightly behind or beside them', 'Running past them', 'Ignoring them']),
        correctAnswer: 'Slightly behind or beside them',
        explanation: 'Walk slightly behind or beside elders, not ahead. Offer your arm for support and open doors for them.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How should one walk with elders?',
        options: JSON.stringify(['Far ahead of them', 'Slightly behind or beside them', 'Running past them', 'Ignoring them']),
        correctAnswer: 'Slightly behind or beside them',
        explanation: 'Walk slightly behind or beside elders, not ahead. Offer your arm for support and open doors for them.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-7-adab-q6' },
      create: {
        externalId: 'maktab-7-adab-q6',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the Qur\'ān (60:8) say about interacting with non-Muslims who do not fight us?',
        options: JSON.stringify(['Avoid them completely', 'Be righteous and just toward them', 'Only speak when necessary', 'Ignore them']),
        correctAnswer: 'Be righteous and just toward them',
        explanation: '"Allāh does not forbid you from those who do not fight you because of religion... from being righteous toward them and acting justly." (Qur\'ān 60:8)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does the Qur\'ān (60:8) say about interacting with non-Muslims who do not fight us?',
        options: JSON.stringify(['Avoid them completely', 'Be righteous and just toward them', 'Only speak when necessary', 'Ignore them']),
        correctAnswer: 'Be righteous and just toward them',
        explanation: '"Allāh does not forbid you from those who do not fight you because of religion... from being righteous toward them and acting justly." (Qur\'ān 60:8)',
        difficulty: 'EASY',
      },
    })
  ]);

  console.log('✅ Created quiz questions for all 7 units');

  // ══════════════════════════════════════════════
  // FLASHCARDS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🃏 Creating flashcards...');

  let flashcardIndex = 0;

  // --- Fiqh Flashcards ---
  const fiqhFlashcards = [
    {
      front: 'Sutrah',
      back: 'A barrier placed in front of a person praying in an open space, at least an arm\'s length and finger-thick.',
      frontArabic: 'سُتْرَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'ṣalāh', 'sutrah'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Sajdah Tilāwah',
      back: 'A wājib prostration performed when reciting or hearing one of 14 specific Qur\'ānic verses.',
      frontArabic: 'سَجْدَة تِلَاوَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'sajdah', 'tilāwah'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Qaṣr Ṣalāh',
      back: 'Shortened prayer for a traveller (musāfir) — two rak\'āt farḍ instead of four for Ḍhuhr, \'Aṣr and \'Ishā\'.',
      frontArabic: 'قَصْر صَلَاة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'qaṣr', 'travel'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Niṣāb',
      back: 'The minimum amount of wealth upon which zakāh becomes obligatory (612.36g silver or 87.48g gold).',
      frontArabic: 'نِصَاب',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'zakāh', 'niṣāb'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'I\'tikāf',
      back: 'Secluding oneself in the masjid, especially during the last ten days of Ramaḍān. It is Sunnah Mu\'akkadah.',
      frontArabic: 'اِعْتِكَاف',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'i\'tikāf', 'ramaḍān'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Uḍḥiyah',
      back: 'Animal sacrifice during 10th–12th Dhul Ḥijjah. Wājib on mature Muslims who own the niṣāb and are not travellers.',
      frontArabic: 'أُضْحِيَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'uḍḥiyah', 'qurbānī'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Tasmiyah',
      back: 'Saying "Bismillāhi Allāhu Akbar" when slaughtering an animal.',
      frontArabic: 'تَسْمِيَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'ḥalāl', 'slaughter'],
      difficulty: 'EASY' as const,
    },
  ];

    await Promise.all(
    fiqhFlashcards.map((fc, i) => {
      const orderIndex = flashcardIndex + i;

      return prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unitFiqh.id, orderIndex } },
        create: { ...fc, unitId: unitFiqh.id, courseId: course.id, orderIndex },
        update: {
          front: fc.front,
          back: fc.back,
          frontArabic: fc.frontArabic ?? null,
          backArabic: fc.backArabic ?? null,
          category: fc.category,
          tags: fc.tags,
          difficulty: fc.difficulty,
        },
      });
    })
  );
  flashcardIndex += fiqhFlashcards.length;

  // --- Aḥādīth Flashcards ---
  const ahadithFlashcards = [
    {
      front: 'Ghībah',
      back: 'Backbiting — saying about your brother what he would not like.',
      frontArabic: 'غِيبَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aḥādīth', 'ghībah', 'backbiting'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Siwāk / Miswāk',
      back: 'A natural teeth-cleaning twig. The Prophet ﷺ strongly encouraged its use before every prayer.',
      frontArabic: 'سِوَاك',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aḥādīth', 'siwāk', 'sunnah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥayā\'',
      back: 'Modesty — the distinctive characteristic of Islām.',
      frontArabic: 'حَيَاء',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aḥādīth', 'modesty', 'akhlāq'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Mufarridūn',
      back: 'Those who remember Allāh abundantly — they have gone ahead in reward.',
      frontArabic: 'مُفَرِّدُون',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aḥādīth', 'dhikr'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Du\'ā\' of Laylatul Qadr',
      back: '"Allāhumma innaka \'afuwwun tuḥibbul \'afwa fa\'fu \'annī" — O Allāh, You are Pardoning, You love to pardon, so pardon me.',
      frontArabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      backArabic: null,
      category: 'du\'ā\'',
      tags: ['aḥādīth', 'laylatul-qadr', 'du\'ā\''],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ṣalāt \'alan Nabiy',
      back: 'Sending blessings upon the Prophet ﷺ. Whoever does so once, Allāh blesses him ten times.',
      frontArabic: 'صَلَاة عَلَى النَّبِيّ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aḥādīth', 'durūd', 'ṣalāt'],
      difficulty: 'EASY' as const,
    },
  ];

    await Promise.all(
    ahadithFlashcards.map((fc, i) => {
      const orderIndex = flashcardIndex + i;

      return prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unitAhadith.id, orderIndex } },
        create: { ...fc, unitId: unitAhadith.id, courseId: course.id, orderIndex },
        update: {
          front: fc.front,
          back: fc.back,
          frontArabic: fc.frontArabic ?? null,
          backArabic: fc.backArabic ?? null,
          category: fc.category,
          tags: fc.tags,
          difficulty: fc.difficulty,
        },
      });
    })
  );
  flashcardIndex += ahadithFlashcards.length;

  // --- Sīrah Flashcards ---
  const sirahFlashcards = [
    {
      front: 'Shamā\'il',
      back: 'The noble characteristics and appearance of the Prophet ﷺ.',
      frontArabic: 'شَمَائِل',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'shamā\'il'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Al-Fārūq',
      back: 'Title given to \'Umar ibn al-Khaṭṭāb — meaning "the one who distinguishes truth from falsehood".',
      frontArabic: 'الفَارُوق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', '\'umar', 'title'],
      difficulty: 'EASY' as const,
    },
    {
      front: '\'Imāmah',
      back: 'Turban — a head covering worn by the Prophet ﷺ.',
      frontArabic: 'عِمَامَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'shamā\'il', 'clothing'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Tartīl',
      back: 'Slow, measured, beautiful recitation of the Qur\'ān.',
      frontArabic: 'تَرْتِيل',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'qur\'ān', 'recitation'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ayyāmul Bīḍ',
      back: 'The 13th, 14th and 15th of each lunar month — the Prophet ﷺ would fast on these days.',
      frontArabic: 'أَيَّام الْبِيض',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'fasting', 'sunnah'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Hijri Calendar',
      back: 'The Islamic calendar established by \'Umar ibn al-Khaṭṭāb, starting from the migration to Madīnah.',
      frontArabic: 'تَقْوِيم هِجْرِي',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', '\'umar', 'calendar'],
      difficulty: 'EASY' as const,
    },
  ];

    await Promise.all(
    sirahFlashcards.map((fc, i) => {
      const orderIndex = flashcardIndex + i;

      return prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unitSirah.id, orderIndex } },
        create: { ...fc, unitId: unitSirah.id, courseId: course.id, orderIndex },
        update: {
          front: fc.front,
          back: fc.back,
          frontArabic: fc.frontArabic ?? null,
          backArabic: fc.backArabic ?? null,
          category: fc.category,
          tags: fc.tags,
          difficulty: fc.difficulty,
        },
      });
    })
  );
  flashcardIndex += sirahFlashcards.length;

  // --- Tārīkh Flashcards ---
  const tarikhFlashcards = [
    {
      front: 'Zakariyyā عليه السلام',
      back: 'A prophet of Banī Isrā\'īl and guardian of Maryam. Allāh granted him a son, Yaḥyā, in old age.',
      frontArabic: 'زَكَرِيَّا',
      backArabic: null,
      category: 'biography',
      tags: ['tārīkh', 'prophet', 'zakariyyā'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Yaḥyā عليه السلام',
      back: 'Son of Zakariyyā, given prophethood as a child. Known for piety and wisdom.',
      frontArabic: 'يَحْيَى',
      backArabic: null,
      category: 'biography',
      tags: ['tārīkh', 'prophet', 'yaḥyā'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Maryam عليها السلام',
      back: 'Mother of \'Īsā, praised in the Qur\'ān as the best woman of her time. Zakariyyā was her guardian.',
      frontArabic: 'مَرْيَم',
      backArabic: null,
      category: 'biography',
      tags: ['tārīkh', 'maryam'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Bayt al-Ḥikmah',
      back: 'The House of Wisdom — a major centre of learning established during the Abbasid Khilāfah in Baghdad.',
      frontArabic: 'بَيْت الحِكْمَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['tārīkh', 'abbasid', 'learning'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Abbasid Khilāfah',
      back: 'Muslim dynasty (750–1258 CE) descended from al-\'Abbās. Golden age of Islamic civilisation. Capital: Baghdad.',
      frontArabic: 'الخِلَافَة العَبَّاسِيَّة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['tārīkh', 'abbasid', 'khilāfah'],
      difficulty: 'MEDIUM' as const,
    },
  ];

    await Promise.all(
    tarikhFlashcards.map((fc, i) => {
      const orderIndex = flashcardIndex + i;

      return prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unitTarikh.id, orderIndex } },
        create: { ...fc, unitId: unitTarikh.id, courseId: course.id, orderIndex },
        update: {
          front: fc.front,
          back: fc.back,
          frontArabic: fc.frontArabic ?? null,
          backArabic: fc.backArabic ?? null,
          category: fc.category,
          tags: fc.tags,
          difficulty: fc.difficulty,
        },
      });
    })
  );
  flashcardIndex += tarikhFlashcards.length;

  // --- Aqā'id Flashcards ---
  const aqaidFlashcards = [
    {
      front: 'Qaḍā\'',
      back: 'Allāh\'s eternal knowledge and foreknowledge of everything that will happen.',
      frontArabic: 'قَضَاء',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'qaḍā\'', 'decree'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Qadr',
      back: 'The divine execution of Allāh\'s plan — everything happens according to His will.',
      frontArabic: 'قَدَر',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'qadr', 'decree'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Barzakh',
      back: 'The period between death and resurrection where the soul awaits the Day of Judgement.',
      frontArabic: 'بَرْزَخ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'barzakh', 'afterlife'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Munkar and Nakīr',
      back: 'Two angels who question the deceased in the grave about their Lord, religion, and prophet.',
      frontArabic: 'مُنْكَر وَنَكِير',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'grave', 'angels'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Mīzān',
      back: 'The divine scales on the Day of Judgement where deeds are weighed.',
      frontArabic: 'مِيزَان',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'judgement', 'scales'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ṣirāṭ',
      back: 'The bridge over Jahannam that everyone must cross on the Day of Judgement.',
      frontArabic: 'صِرَاط',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'judgement', 'bridge'],
      difficulty: 'EASY' as const,
    },
  ];

    await Promise.all(
    aqaidFlashcards.map((fc, i) => {
      const orderIndex = flashcardIndex + i;

      return prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unitAqaid.id, orderIndex } },
        create: { ...fc, unitId: unitAqaid.id, courseId: course.id, orderIndex },
        update: {
          front: fc.front,
          back: fc.back,
          frontArabic: fc.frontArabic ?? null,
          backArabic: fc.backArabic ?? null,
          category: fc.category,
          tags: fc.tags,
          difficulty: fc.difficulty,
        },
      });
    })
  );
  flashcardIndex += aqaidFlashcards.length;

  // --- Akhlāq Flashcards ---
  const akhlaqFlashcards = [
    {
      front: 'Amānah',
      back: 'Trust — time and blessings are trusts from Allāh that we will be asked about.',
      frontArabic: 'أَمَانَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'trust', 'time'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Durūd',
      back: 'Sending blessings (ṣalāt) upon the Prophet ﷺ — especially virtuous on Fridays.',
      frontArabic: 'دُرُود',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'durūd', 'prophet'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Namīmah',
      back: 'Spreading rumours or tale-bearing — a serious sin in Islām.',
      frontArabic: 'نَمِيمَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'rumours', 'sin'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Five Before Five',
      back: 'Youth before old age, health before sickness, wealth before poverty, free time before busyness, life before death.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['akhlāq', 'time', 'ḥadīth'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: '\'Ilm',
      back: 'Knowledge — seeking it is obligatory upon every Muslim.',
      frontArabic: 'عِلْم',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'knowledge'],
      difficulty: 'EASY' as const,
    },
  ];

    await Promise.all(
    akhlaqFlashcards.map((fc, i) => {
      const orderIndex = flashcardIndex + i;

      return prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unitAkhlaq.id, orderIndex } },
        create: { ...fc, unitId: unitAkhlaq.id, courseId: course.id, orderIndex },
        update: {
          front: fc.front,
          back: fc.back,
          frontArabic: fc.frontArabic ?? null,
          backArabic: fc.backArabic ?? null,
          category: fc.category,
          tags: fc.tags,
          difficulty: fc.difficulty,
        },
      });
    })
  );
  flashcardIndex += akhlaqFlashcards.length;

  // --- Ādāb Flashcards ---
  const adabFlashcards = [
    {
      front: 'Kaffārah',
      back: 'Expiation required for breaking an oath — feeding ten poor people, clothing them, or fasting three days.',
      frontArabic: 'كَفَّارَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ādāb', 'oath', 'kaffārah'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Five Rights of a Muslim',
      back: 'Returning salām, visiting the sick, following the funeral, accepting invitations, saying yarḥamukallāh when someone sneezes.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'rights', 'muslim'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Yamīn',
      back: 'An oath — swearing by Allāh\'s name. Must be taken seriously and fulfilled.',
      frontArabic: 'يَمِين',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ādāb', 'oath'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥusn al-Khulq',
      back: 'Good character — being kind, just, and honest with all people, including non-Muslims.',
      frontArabic: 'حُسْن الخُلُق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ādāb', 'character', 'akhlāq'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ta\'ziyah',
      back: 'Expressing condolences to the bereaved — a right upon Muslims for one another.',
      frontArabic: 'تَعْزِيَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ādāb', 'condolences'],
      difficulty: 'MEDIUM' as const,
    },
  ];

    await Promise.all(
    adabFlashcards.map((fc, i) => {
      const orderIndex = flashcardIndex + i;

      return prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unitAdab.id, orderIndex } },
        create: { ...fc, unitId: unitAdab.id, courseId: course.id, orderIndex },
        update: {
          front: fc.front,
          back: fc.back,
          frontArabic: fc.frontArabic ?? null,
          backArabic: fc.backArabic ?? null,
          category: fc.category,
          tags: fc.tags,
          difficulty: fc.difficulty,
        },
      });
    })
  );
  flashcardIndex += adabFlashcards.length;

  // ══════════════════════════════════════════════
  // ARABIC TERMS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🔤 Creating Arabic terms...');

    await prisma.arabicTerm.deleteMany({ where: { unitId: unitFiqh.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitAhadith.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitSirah.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitTarikh.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitAqaid.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitAkhlaq.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitAdab.id } });

await prisma.arabicTerm.createMany({
    data: [
      // Fiqh terms
      { unitId: unitFiqh.id, arabicText: 'سُتْرَة', transliteration: 'Sutrah', translation: 'A barrier placed in front during prayer in an open space' },
      { unitId: unitFiqh.id, arabicText: 'سَجْدَة تِلَاوَة', transliteration: 'Sajdah Tilāwah', translation: 'Prostration upon reciting or hearing specific Qur\'ānic verses' },
      { unitId: unitFiqh.id, arabicText: 'نِصَاب', transliteration: 'Niṣāb', translation: 'Minimum wealth threshold for zakāh obligation' },
      { unitId: unitFiqh.id, arabicText: 'أُضْحِيَة', transliteration: 'Uḍḥiyah', translation: 'Ritual animal sacrifice during the days of Ḥajj' },
      { unitId: unitFiqh.id, arabicText: 'اِعْتِكَاف', transliteration: 'I\'tikāf', translation: 'Seclusion in the masjid for worship' },
      // Aḥādīth terms
      { unitId: unitAhadith.id, arabicText: 'غِيبَة', transliteration: 'Ghībah', translation: 'Backbiting — saying about someone what they would not like' },
      { unitId: unitAhadith.id, arabicText: 'حَيَاء', transliteration: 'Ḥayā\'', translation: 'Modesty — the distinctive characteristic of Islām' },
      { unitId: unitAhadith.id, arabicText: 'ذِكْر', transliteration: 'Dhikr', translation: 'Remembrance of Allāh' },
      // Sīrah terms
      { unitId: unitSirah.id, arabicText: 'شَمَائِل', transliteration: 'Shamā\'il', translation: 'Noble characteristics and appearance of the Prophet ﷺ' },
      { unitId: unitSirah.id, arabicText: 'الفَارُوق', transliteration: 'Al-Fārūq', translation: 'Title of \'Umar — the distinguisher of truth and falsehood' },
      { unitId: unitSirah.id, arabicText: 'تَرْتِيل', transliteration: 'Tartīl', translation: 'Slow, measured recitation of the Qur\'ān' },
      { unitId: unitSirah.id, arabicText: 'عِمَامَة', transliteration: '\'Imāmah', translation: 'Turban — worn by the Prophet ﷺ' },
      // Tārīkh terms
      { unitId: unitTarikh.id, arabicText: 'زَكَرِيَّا', transliteration: 'Zakariyyā', translation: 'Prophet who was guardian of Maryam and father of Yaḥyā' },
      { unitId: unitTarikh.id, arabicText: 'يَحْيَى', transliteration: 'Yaḥyā', translation: 'Son of Zakariyyā, given prophethood as a child' },
      { unitId: unitTarikh.id, arabicText: 'بَيْت الحِكْمَة', transliteration: 'Bayt al-Ḥikmah', translation: 'House of Wisdom — Abbasid centre of learning' },
      // Aqā'id terms
      { unitId: unitAqaid.id, arabicText: 'قَضَاء', transliteration: 'Qaḍā\'', translation: 'Allāh\'s eternal foreknowledge of all events' },
      { unitId: unitAqaid.id, arabicText: 'قَدَر', transliteration: 'Qadr', translation: 'Divine decree — the execution of Allāh\'s plan' },
      { unitId: unitAqaid.id, arabicText: 'بَرْزَخ', transliteration: 'Barzakh', translation: 'The realm between death and resurrection' },
      { unitId: unitAqaid.id, arabicText: 'مِيزَان', transliteration: 'Mīzān', translation: 'The divine scales of the Day of Judgement' },
      // Akhlāq terms
      { unitId: unitAkhlaq.id, arabicText: 'نَمِيمَة', transliteration: 'Namīmah', translation: 'Tale-bearing / spreading rumours' },
      { unitId: unitAkhlaq.id, arabicText: 'عِلْم', transliteration: '\'Ilm', translation: 'Knowledge — seeking it is obligatory' },
      { unitId: unitAkhlaq.id, arabicText: 'دُرُود', transliteration: 'Durūd', translation: 'Sending blessings upon the Prophet ﷺ' },
      // Ādāb terms
      { unitId: unitAdab.id, arabicText: 'كَفَّارَة', transliteration: 'Kaffārah', translation: 'Expiation for breaking an oath' },
      { unitId: unitAdab.id, arabicText: 'يَمِين', transliteration: 'Yamīn', translation: 'An oath — swearing by Allāh\'s name' },
      { unitId: unitAdab.id, arabicText: 'حُسْن الخُلُق', transliteration: 'Ḥusn al-Khulq', translation: 'Good character and manners' },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 Maktab Coursebook 7 seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: Maktab Coursebook 7 (ages 12-13)');
  console.log('   - 7 Units: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā\'id, Akhlāq, Ādāb');
  console.log(`   - ${7 + 6 + 6 + 6 + 6 + 6 + 6} Quiz questions (43 total)`);
  console.log(`   - ${flashcardIndex} Flashcards`);
  console.log(`   - 25 Arabic terms`);
}

// Allow standalone execution
async function main() {
  try {
    await seedMaktabCoursebook7();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Maktab Coursebook 7:', error);
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
