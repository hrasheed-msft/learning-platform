import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 3 — Islamic Curriculum Seed
 * Source: An Nasihah Publications, Age Range: 8–9 years
 *
 * Covers seven subjects: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā'id, Akhlāq, Ādāb
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions, flashcards, and Arabic terms per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-coursebook3.ts
 */

export async function seedMaktabCoursebook3() {
  console.log('📚 Starting Maktab Coursebook 3 seed...');
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
    where: { slug: 'maktab-coursebook-3' },
    create: {
      slug: 'maktab-coursebook-3',
      title: 'Maktab Coursebook 3',
      description: 'A comprehensive Islamic curriculum for young learners aged 8–9 years. Covers fiqh key terms, ṭahārah, najāsah, ghusl, ṣalāh method and types, ten key aḥādīth, the Sīrah from hijrah to Abyssinia through al-Isrā\' wal-Mi\'rāj, the story of Ibrāhīm and Ismā\'īl عليهم السلام, prophets, messengers and signs of the Last Day, good character including thinking well of others, sharing, kindness to parents, truthfulness and avoiding ghībah, and Islamic etiquette of travelling, studying, Qur\'ān, walking and the masjid. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 3',
      description: 'A comprehensive Islamic curriculum for young learners aged 8–9 years. Covers fiqh key terms, ṭahārah, najāsah, ghusl, ṣalāh method and types, ten key aḥādīth, the Sīrah from hijrah to Abyssinia through al-Isrā\' wal-Mi\'rāj, the story of Ibrāhīm and Ismā\'īl عليهم السلام, prophets, messengers and signs of the Last Day, good character including thinking well of others, sharing, kindness to parents, truthfulness and avoiding ghībah, and Islamic etiquette of travelling, studying, Qur\'ān, walking and the masjid. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);
  // ──────────────────────────────────────────────
  // UNIT 0: FIQH
  // ──────────────────────────────────────────────

    const unitFiqh = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-fiqh' } },
    create: {
      slug: 'maktab-3-fiqh',
      courseId: course.id,
      title: 'Fiqh — Ṭahārah, Najāsah, Ghusl & Ṣalāh',
      description: 'Learn the key terms of fiqh, types of najāsah (impurity), the farā\'iḍ and sunan of ghusl, the conditions and method of ṣalāh, and special prayers including Witr, Qaṣr and Ṣalātul Marīḍ.',
      orderIndex: 0,
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn:</p>
<ul>
  <li>The key terminology used in fiqh (Islamic jurisprudence)</li>
  <li>The meaning of ṭahārah (purity) and its importance in Islam</li>
  <li>The different types of najāsah (impurity)</li>
  <li>The farā'iḍ (obligatory acts) and sunan of ghusl</li>
  <li>The conditions, farḍ acts, and method of ṣalāh</li>
  <li>Special prayers: Ṣalātul Witr, Ṣalātul Qaṣr, and Ṣalātul Marīḍ</li>
</ul>

<h3>Key Fiqh Terminology</h3>
<p>In Islamic law, actions are classified into different categories. Understanding these terms is essential for learning fiqh:</p>
<ul>
  <li><strong>Farḍ (فَرْض)</strong> — Compulsory. Something a Muslim <em>must</em> do. Leaving out a farḍ act is sinful, and denying it takes a person out of the fold of Islam.</li>
  <li><strong>Wājib (وَاجِب)</strong> — Necessary. Next in importance to farḍ. Leaving it out without a valid reason is sinful, but denying it does not take a person out of Islam.</li>
  <li><strong>Sunnah Mu'akkadah (سُنَّة مُؤَكَّدَة)</strong> — An action which Rasūlullāh ﷺ did regularly. Leaving it occasionally is not sinful, but leaving it habitually is.</li>
  <li><strong>Sunnah Ghayr Mu'akkadah (سُنَّة غَيْر مُؤَكَّدَة)</strong> — An action which Rasūlullāh ﷺ did sometimes but not always. There is reward for doing it, but no sin for leaving it.</li>
  <li><strong>Mustaḥabb (مُسْتَحَبّ)</strong> — Desirable and recommended. There is reward for doing it but no sin for leaving it out.</li>
  <li><strong>Mubāḥ (مُبَاح)</strong> — Permissible. An action that is neither rewarded nor punished.</li>
  <li><strong>Makrūh (مَكْرُوه)</strong> — Disliked. It is better to avoid such actions.</li>
  <li><strong>Makrūh Taḥrīmī (مَكْرُوه تَحْرِيمِي)</strong> — Highly disliked and close to ḥarām. Doing it is sinful.</li>
  <li><strong>Ḥarām (حَرَام)</strong> — Absolutely forbidden. Doing a ḥarām act is a major sin.</li>
  <li><strong>Nawāqiḍ (نَوَاقِض)</strong> — Acts that break or cancel something, such as things that break ṣalāh or wuḍū'.</li>
</ul>

<h3>Ṭahārah (Purity)</h3>
<p>Ṭahārah means cleanliness and purity. In Islam, ṭahārah is essential — we cannot perform ṣalāh, touch the Qur'ān, or do ṭawāf of the Ka'bah without being in a state of purity. Allāh says in the Qur'ān:</p>
<blockquote>"Indeed Allāh loves those who repent and He loves those who keep themselves clean." (Qur'ān 2:222)</blockquote>
<p>There are two main types of impurity that prevent us from worship:</p>

<h3>Types of Najāsah (Impurity)</h3>
<p><strong>1. Najāsah Ḥaqīqī (Physical Impurity)</strong> — An impurity that can be seen, such as blood, urine, stool, wine, and the droppings of ḥarām animals. It is removed by washing with water until the impurity is gone.</p>
<p><strong>2. Najāsah Ḥukmī (Ritual Impurity)</strong> — An impurity that cannot be seen. It is a state of ritual impurity that is removed by performing wuḍū' or ghusl.</p>

<p>Najāsah Ḥaqīqī is further divided into two categories:</p>
<ul>
  <li><strong>Najāsah Ghalīẓah (Heavy Impurity)</strong> — Examples include human blood, urine, stool, flowing blood of animals, wine, and the excrement of ḥarām animals. If this impurity is on your clothes or body, it must be washed off before ṣalāh.</li>
  <li><strong>Najāsah Khafīfah (Light Impurity)</strong> — Examples include the urine of ḥalāl animals and the droppings of ḥarām birds. The ruling is slightly more lenient — ṣalāh is valid if the impurity covers less than a quarter of the garment.</li>
</ul>

<p>Najāsah Ḥukmī is divided into two types:</p>
<ul>
  <li><strong>Ḥadath Akbar (Major Ritual Impurity)</strong> — Requires ghusl (a full body bath) to remove. Examples include the state of janābah (after marital relations).</li>
  <li><strong>Ḥadath Aṣghar (Minor Ritual Impurity)</strong> — Requires wuḍū' to remove. This is the state we enter after passing wind, using the toilet, or sleeping.</li>
</ul>

<h3>Ghusl (Full Body Bath)</h3>
<p>Ghusl is a full-body bath that must be taken when a person is in a state of major impurity (ḥadath akbar).</p>
<p><strong>The 3 Farā'iḍ of Ghusl:</strong></p>
<ol>
  <li>Washing the entire body from head to toe, ensuring water reaches every part.</li>
  <li>Gargling the mouth (allowing water to reach the entire mouth).</li>
  <li>Rinsing the nose (sniffing water into the nostrils).</li>
</ol>
<p><strong>The 5 Sunan of Ghusl:</strong></p>
<ol>
  <li>Washing both hands up to the wrists.</li>
  <li>Washing the private parts.</li>
  <li>Removing any physical impurity from the body.</li>
  <li>Performing wuḍū' before the ghusl.</li>
  <li>Pouring water over the entire body three times.</li>
</ol>

<h3>Ṣalāh — The Five Daily Prayers</h3>
<p>Ṣalāh is the most important act of worship after the shahādah. It is farḍ upon every sane, mature Muslim, five times a day. Allāh says:</p>
<blockquote>"Indeed ṣalāh has been made obligatory upon the believers at fixed times." (Qur'ān 4:103)</blockquote>

<h3>Daily Ṣalāh Chart</h3>
<table border="1" cellpadding="8" cellspacing="0">
  <thead>
    <tr><th>Prayer</th><th>Sunnah Before</th><th>Farḍ</th><th>Sunnah After</th><th>Nafl</th><th>Witr/Other</th></tr>
  </thead>
  <tbody>
    <tr><td>Fajr</td><td>2</td><td>2</td><td>—</td><td>—</td><td>—</td></tr>
    <tr><td>Ḍhuhr</td><td>4</td><td>4</td><td>2</td><td>2</td><td>—</td></tr>
    <tr><td>'Aṣr</td><td>4</td><td>4</td><td>—</td><td>—</td><td>—</td></tr>
    <tr><td>Maghrib</td><td>—</td><td>3</td><td>2</td><td>2</td><td>—</td></tr>
    <tr><td>'Ishā'</td><td>4</td><td>4</td><td>2</td><td>2</td><td>3 Witr + 2 Nafl</td></tr>
  </tbody>
</table>

<h3>Conditions Before Ṣalāh</h3>
<p>The following conditions must be met before performing ṣalāh:</p>
<ol>
  <li>The body must be clean from najāsah.</li>
  <li>The clothes must be clean from najāsah.</li>
  <li>The place of prayer must be clean.</li>
  <li>Satr (covering the body) — for boys: from the navel to below the knees; for girls: the entire body except the face, hands and feet.</li>
  <li>Facing the Qiblah (direction of the Ka'bah).</li>
  <li>Performing ṣalāh in its correct time.</li>
  <li>Making the niyyah (intention) for the specific ṣalāh.</li>
  <li>Having wuḍū' (or ghusl if required).</li>
</ol>

<h3>The Six Farḍ Acts in Ṣalāh</h3>
<p>There are <strong>6 farḍ acts</strong> that must be performed during ṣalāh. Missing any of them invalidates the prayer:</p>
<ol>
  <li><strong>Takbīr Taḥrīmah</strong> — Saying "Allāhu Akbar" at the beginning to enter ṣalāh.</li>
  <li><strong>Qiyām</strong> — Standing upright during ṣalāh.</li>
  <li><strong>Qirā'ah</strong> — Reciting a portion of the Qur'ān.</li>
  <li><strong>Rukū'</strong> — Bowing down.</li>
  <li><strong>Sujūd</strong> — Prostrating (placing the forehead on the ground).</li>
  <li><strong>Qa'dah Akhīrah</strong> — The last sitting for the duration of tashahhud before salām.</li>
</ol>

<h3>Nawāqiḍ of Ṣalāh (Things That Break the Prayer)</h3>
<ul>
  <li>Talking intentionally during ṣalāh.</li>
  <li>Eating or drinking during ṣalāh.</li>
  <li>Doing excessive movement (such that an onlooker would think you are not praying).</li>
  <li>Turning the chest away from the Qiblah.</li>
  <li>Laughing out loud.</li>
  <li>Losing wuḍū' during ṣalāh.</li>
  <li>Making a mistake in qirā'ah that changes the meaning.</li>
  <li>Crying out loud for worldly reasons.</li>
</ul>

<h3>Method of Ṣalāh for Boys</h3>
<ol>
  <li>Stand facing the Qiblah. Make the niyyah (intention) in your heart for the specific ṣalāh.</li>
  <li>Raise both hands to the earlobes and say <strong>"Allāhu Akbar"</strong> (Takbīr Taḥrīmah). The thumbs should touch the earlobes.</li>
  <li>Place the right hand over the left hand below the navel. Fold the small finger and thumb around the wrist of the left hand.</li>
  <li>Recite <strong>Thanā'</strong> — "SubḥānakAllāhumma wa biḥamdika wa tabārakasmuka wa ta'ālā jadduka wa lā ilāha ghayruk."</li>
  <li>Recite <strong>Ta'awwudh</strong> — "A'ūdhu billāhi minash-shayṭānir-rajīm."</li>
  <li>Recite <strong>Tasmiyah</strong> — "Bismillāhir-Raḥmānir-Raḥīm."</li>
  <li>Recite <strong>Sūrah al-Fātiḥah</strong>, then say "Āmīn" softly, then recite at least three short verses or one long verse of the Qur'ān.</li>
  <li>Say <strong>"Allāhu Akbar"</strong> and go into <strong>rukū'</strong> (bowing). Grasp the knees with the fingers spread apart. Keep the back flat and the head level. Say "Subḥāna Rabbiyal 'Aẓīm" at least three times.</li>
  <li>Stand up straight saying <strong>"Sami'Allāhu liman ḥamidah"</strong>, then say "Rabbanā lakal ḥamd."</li>
  <li>Say <strong>"Allāhu Akbar"</strong> and go into <strong>sajdah</strong>. Place the knees down first, then the hands, then the nose and forehead. Keep the arms away from the body and the fingers facing the Qiblah. Say "Subḥāna Rabbiyal A'lā" at least three times. Sit up briefly (jalsah), then perform a second sajdah.</li>
  <li>This completes one rak'ah. Stand up for the second rak'ah.</li>
  <li>After two rak'āt, sit for <strong>tashahhud</strong> (at-Taḥiyyāt). When saying "Ash-hadu an lā ilāha," raise the index finger of the right hand, and lower it when saying "illAllāh."</li>
  <li>In the final sitting, after tashahhud, recite <strong>Durūd Ibrāhīm</strong> and then a du'ā'. Turn the face to the right saying <strong>"Assalāmu 'alaykum wa raḥmatullāh"</strong>, then to the left with the same words. This completes the ṣalāh.</li>
</ol>

<h3>Method of Ṣalāh for Girls</h3>
<p>The method for girls is the same as for boys, with the following differences:</p>
<ul>
  <li>Raise hands to shoulder level (not ear level) for takbīr.</li>
  <li>Place hands on the chest (not below the navel).</li>
  <li>In rukū', bend slightly (not fully flat) and do not spread the fingers on the knees.</li>
  <li>In sajdah, keep the arms close to the body, the stomach resting on the thighs, and the forearms flat on the ground.</li>
  <li>In the sitting position (qa'dah), sit with both legs to the right side.</li>
</ul>

<h3>Ṣalātul Witr</h3>
<p>Ṣalātul Witr is <strong>wājib</strong> and is performed after the farḍ and sunnah of 'Ishā'. It consists of <strong>3 rak'āt</strong>.</p>
<ul>
  <li>Perform the first 2 rak'āt like a normal prayer.</li>
  <li>Stand for the 3rd rak'ah, recite Sūrah al-Fātiḥah and another sūrah.</li>
  <li>After the qirā'ah, say "Allāhu Akbar" and raise your hands to the ears, then fold them again.</li>
  <li>Recite <strong>Du'ā' al-Qunūt</strong> — "Allāhumma innā nasta'īnuka wa nastaghfiruka..."</li>
  <li>Then go into rukū' and complete the ṣalāh as normal.</li>
</ul>

<h3>Ṣalātul Qaṣr (Shortened Prayer for Travellers)</h3>
<p>A person who plans to travel more than <strong>54 miles (87 km)</strong> from the boundary of their city is considered a musāfir (traveller). The ruling for a musāfir is:</p>
<ul>
  <li>The <strong>4-rak'ah farḍ prayers</strong> (Ḍhuhr, 'Aṣr, 'Ishā') are <strong>shortened to 2 rak'āt</strong>.</li>
  <li>Fajr (2 rak'āt) and Maghrib (3 rak'āt) remain unchanged.</li>
  <li>Sunnah prayers may be omitted when travelling, but the sunnah of Fajr and the Witr of 'Ishā' should still be prayed.</li>
  <li>If the traveller intends to stay at a place for <strong>15 days or more</strong>, they are no longer a musāfir and must pray full ṣalāh.</li>
</ul>

<h3>Ṣalātul Marīḍ (Prayer of the Sick)</h3>
<p>Ṣalāh is never excused, even for a sick person. If a person is unable to stand, they may:</p>
<ul>
  <li>Pray sitting down, performing rukū' and sujūd as normal.</li>
  <li>If unable to do rukū' and sujūd, pray sitting and indicate by nodding the head (tilting more for sujūd than for rukū').</li>
  <li>If unable to sit, pray lying on the back or on the right side, facing the Qiblah, and indicate by nodding.</li>
  <li>If unable to nod, delay the prayer — but it is <strong>never</strong> excused entirely while a person is conscious.</li>
</ul>
      `.trim(),
    },
    update: {
      title: 'Fiqh — Ṭahārah, Najāsah, Ghusl & Ṣalāh',
      description: 'Learn the key terms of fiqh, types of najāsah (impurity), the farā\'iḍ and sunan of ghusl, the conditions and method of ṣalāh, and special prayers including Witr, Qaṣr and Ṣalātul Marīḍ.',
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn:</p>
<ul>
  <li>The key terminology used in fiqh (Islamic jurisprudence)</li>
  <li>The meaning of ṭahārah (purity) and its importance in Islam</li>
  <li>The different types of najāsah (impurity)</li>
  <li>The farā'iḍ (obligatory acts) and sunan of ghusl</li>
  <li>The conditions, farḍ acts, and method of ṣalāh</li>
  <li>Special prayers: Ṣalātul Witr, Ṣalātul Qaṣr, and Ṣalātul Marīḍ</li>
</ul>

<h3>Key Fiqh Terminology</h3>
<p>In Islamic law, actions are classified into different categories. Understanding these terms is essential for learning fiqh:</p>
<ul>
  <li><strong>Farḍ (فَرْض)</strong> — Compulsory. Something a Muslim <em>must</em> do. Leaving out a farḍ act is sinful, and denying it takes a person out of the fold of Islam.</li>
  <li><strong>Wājib (وَاجِب)</strong> — Necessary. Next in importance to farḍ. Leaving it out without a valid reason is sinful, but denying it does not take a person out of Islam.</li>
  <li><strong>Sunnah Mu'akkadah (سُنَّة مُؤَكَّدَة)</strong> — An action which Rasūlullāh ﷺ did regularly. Leaving it occasionally is not sinful, but leaving it habitually is.</li>
  <li><strong>Sunnah Ghayr Mu'akkadah (سُنَّة غَيْر مُؤَكَّدَة)</strong> — An action which Rasūlullāh ﷺ did sometimes but not always. There is reward for doing it, but no sin for leaving it.</li>
  <li><strong>Mustaḥabb (مُسْتَحَبّ)</strong> — Desirable and recommended. There is reward for doing it but no sin for leaving it out.</li>
  <li><strong>Mubāḥ (مُبَاح)</strong> — Permissible. An action that is neither rewarded nor punished.</li>
  <li><strong>Makrūh (مَكْرُوه)</strong> — Disliked. It is better to avoid such actions.</li>
  <li><strong>Makrūh Taḥrīmī (مَكْرُوه تَحْرِيمِي)</strong> — Highly disliked and close to ḥarām. Doing it is sinful.</li>
  <li><strong>Ḥarām (حَرَام)</strong> — Absolutely forbidden. Doing a ḥarām act is a major sin.</li>
  <li><strong>Nawāqiḍ (نَوَاقِض)</strong> — Acts that break or cancel something, such as things that break ṣalāh or wuḍū'.</li>
</ul>

<h3>Ṭahārah (Purity)</h3>
<p>Ṭahārah means cleanliness and purity. In Islam, ṭahārah is essential — we cannot perform ṣalāh, touch the Qur'ān, or do ṭawāf of the Ka'bah without being in a state of purity. Allāh says in the Qur'ān:</p>
<blockquote>"Indeed Allāh loves those who repent and He loves those who keep themselves clean." (Qur'ān 2:222)</blockquote>
<p>There are two main types of impurity that prevent us from worship:</p>

<h3>Types of Najāsah (Impurity)</h3>
<p><strong>1. Najāsah Ḥaqīqī (Physical Impurity)</strong> — An impurity that can be seen, such as blood, urine, stool, wine, and the droppings of ḥarām animals. It is removed by washing with water until the impurity is gone.</p>
<p><strong>2. Najāsah Ḥukmī (Ritual Impurity)</strong> — An impurity that cannot be seen. It is a state of ritual impurity that is removed by performing wuḍū' or ghusl.</p>

<p>Najāsah Ḥaqīqī is further divided into two categories:</p>
<ul>
  <li><strong>Najāsah Ghalīẓah (Heavy Impurity)</strong> — Examples include human blood, urine, stool, flowing blood of animals, wine, and the excrement of ḥarām animals. If this impurity is on your clothes or body, it must be washed off before ṣalāh.</li>
  <li><strong>Najāsah Khafīfah (Light Impurity)</strong> — Examples include the urine of ḥalāl animals and the droppings of ḥarām birds. The ruling is slightly more lenient — ṣalāh is valid if the impurity covers less than a quarter of the garment.</li>
</ul>

<p>Najāsah Ḥukmī is divided into two types:</p>
<ul>
  <li><strong>Ḥadath Akbar (Major Ritual Impurity)</strong> — Requires ghusl (a full body bath) to remove. Examples include the state of janābah (after marital relations).</li>
  <li><strong>Ḥadath Aṣghar (Minor Ritual Impurity)</strong> — Requires wuḍū' to remove. This is the state we enter after passing wind, using the toilet, or sleeping.</li>
</ul>

<h3>Ghusl (Full Body Bath)</h3>
<p>Ghusl is a full-body bath that must be taken when a person is in a state of major impurity (ḥadath akbar).</p>
<p><strong>The 3 Farā'iḍ of Ghusl:</strong></p>
<ol>
  <li>Washing the entire body from head to toe, ensuring water reaches every part.</li>
  <li>Gargling the mouth (allowing water to reach the entire mouth).</li>
  <li>Rinsing the nose (sniffing water into the nostrils).</li>
</ol>
<p><strong>The 5 Sunan of Ghusl:</strong></p>
<ol>
  <li>Washing both hands up to the wrists.</li>
  <li>Washing the private parts.</li>
  <li>Removing any physical impurity from the body.</li>
  <li>Performing wuḍū' before the ghusl.</li>
  <li>Pouring water over the entire body three times.</li>
</ol>

<h3>Ṣalāh — The Five Daily Prayers</h3>
<p>Ṣalāh is the most important act of worship after the shahādah. It is farḍ upon every sane, mature Muslim, five times a day. Allāh says:</p>
<blockquote>"Indeed ṣalāh has been made obligatory upon the believers at fixed times." (Qur'ān 4:103)</blockquote>

<h3>Daily Ṣalāh Chart</h3>
<table border="1" cellpadding="8" cellspacing="0">
  <thead>
    <tr><th>Prayer</th><th>Sunnah Before</th><th>Farḍ</th><th>Sunnah After</th><th>Nafl</th><th>Witr/Other</th></tr>
  </thead>
  <tbody>
    <tr><td>Fajr</td><td>2</td><td>2</td><td>—</td><td>—</td><td>—</td></tr>
    <tr><td>Ḍhuhr</td><td>4</td><td>4</td><td>2</td><td>2</td><td>—</td></tr>
    <tr><td>'Aṣr</td><td>4</td><td>4</td><td>—</td><td>—</td><td>—</td></tr>
    <tr><td>Maghrib</td><td>—</td><td>3</td><td>2</td><td>2</td><td>—</td></tr>
    <tr><td>'Ishā'</td><td>4</td><td>4</td><td>2</td><td>2</td><td>3 Witr + 2 Nafl</td></tr>
  </tbody>
</table>

<h3>Conditions Before Ṣalāh</h3>
<p>The following conditions must be met before performing ṣalāh:</p>
<ol>
  <li>The body must be clean from najāsah.</li>
  <li>The clothes must be clean from najāsah.</li>
  <li>The place of prayer must be clean.</li>
  <li>Satr (covering the body) — for boys: from the navel to below the knees; for girls: the entire body except the face, hands and feet.</li>
  <li>Facing the Qiblah (direction of the Ka'bah).</li>
  <li>Performing ṣalāh in its correct time.</li>
  <li>Making the niyyah (intention) for the specific ṣalāh.</li>
  <li>Having wuḍū' (or ghusl if required).</li>
</ol>

<h3>The Six Farḍ Acts in Ṣalāh</h3>
<p>There are <strong>6 farḍ acts</strong> that must be performed during ṣalāh. Missing any of them invalidates the prayer:</p>
<ol>
  <li><strong>Takbīr Taḥrīmah</strong> — Saying "Allāhu Akbar" at the beginning to enter ṣalāh.</li>
  <li><strong>Qiyām</strong> — Standing upright during ṣalāh.</li>
  <li><strong>Qirā'ah</strong> — Reciting a portion of the Qur'ān.</li>
  <li><strong>Rukū'</strong> — Bowing down.</li>
  <li><strong>Sujūd</strong> — Prostrating (placing the forehead on the ground).</li>
  <li><strong>Qa'dah Akhīrah</strong> — The last sitting for the duration of tashahhud before salām.</li>
</ol>

<h3>Nawāqiḍ of Ṣalāh (Things That Break the Prayer)</h3>
<ul>
  <li>Talking intentionally during ṣalāh.</li>
  <li>Eating or drinking during ṣalāh.</li>
  <li>Doing excessive movement (such that an onlooker would think you are not praying).</li>
  <li>Turning the chest away from the Qiblah.</li>
  <li>Laughing out loud.</li>
  <li>Losing wuḍū' during ṣalāh.</li>
  <li>Making a mistake in qirā'ah that changes the meaning.</li>
  <li>Crying out loud for worldly reasons.</li>
</ul>

<h3>Method of Ṣalāh for Boys</h3>
<ol>
  <li>Stand facing the Qiblah. Make the niyyah (intention) in your heart for the specific ṣalāh.</li>
  <li>Raise both hands to the earlobes and say <strong>"Allāhu Akbar"</strong> (Takbīr Taḥrīmah). The thumbs should touch the earlobes.</li>
  <li>Place the right hand over the left hand below the navel. Fold the small finger and thumb around the wrist of the left hand.</li>
  <li>Recite <strong>Thanā'</strong> — "SubḥānakAllāhumma wa biḥamdika wa tabārakasmuka wa ta'ālā jadduka wa lā ilāha ghayruk."</li>
  <li>Recite <strong>Ta'awwudh</strong> — "A'ūdhu billāhi minash-shayṭānir-rajīm."</li>
  <li>Recite <strong>Tasmiyah</strong> — "Bismillāhir-Raḥmānir-Raḥīm."</li>
  <li>Recite <strong>Sūrah al-Fātiḥah</strong>, then say "Āmīn" softly, then recite at least three short verses or one long verse of the Qur'ān.</li>
  <li>Say <strong>"Allāhu Akbar"</strong> and go into <strong>rukū'</strong> (bowing). Grasp the knees with the fingers spread apart. Keep the back flat and the head level. Say "Subḥāna Rabbiyal 'Aẓīm" at least three times.</li>
  <li>Stand up straight saying <strong>"Sami'Allāhu liman ḥamidah"</strong>, then say "Rabbanā lakal ḥamd."</li>
  <li>Say <strong>"Allāhu Akbar"</strong> and go into <strong>sajdah</strong>. Place the knees down first, then the hands, then the nose and forehead. Keep the arms away from the body and the fingers facing the Qiblah. Say "Subḥāna Rabbiyal A'lā" at least three times. Sit up briefly (jalsah), then perform a second sajdah.</li>
  <li>This completes one rak'ah. Stand up for the second rak'ah.</li>
  <li>After two rak'āt, sit for <strong>tashahhud</strong> (at-Taḥiyyāt). When saying "Ash-hadu an lā ilāha," raise the index finger of the right hand, and lower it when saying "illAllāh."</li>
  <li>In the final sitting, after tashahhud, recite <strong>Durūd Ibrāhīm</strong> and then a du'ā'. Turn the face to the right saying <strong>"Assalāmu 'alaykum wa raḥmatullāh"</strong>, then to the left with the same words. This completes the ṣalāh.</li>
</ol>

<h3>Method of Ṣalāh for Girls</h3>
<p>The method for girls is the same as for boys, with the following differences:</p>
<ul>
  <li>Raise hands to shoulder level (not ear level) for takbīr.</li>
  <li>Place hands on the chest (not below the navel).</li>
  <li>In rukū', bend slightly (not fully flat) and do not spread the fingers on the knees.</li>
  <li>In sajdah, keep the arms close to the body, the stomach resting on the thighs, and the forearms flat on the ground.</li>
  <li>In the sitting position (qa'dah), sit with both legs to the right side.</li>
</ul>

<h3>Ṣalātul Witr</h3>
<p>Ṣalātul Witr is <strong>wājib</strong> and is performed after the farḍ and sunnah of 'Ishā'. It consists of <strong>3 rak'āt</strong>.</p>
<ul>
  <li>Perform the first 2 rak'āt like a normal prayer.</li>
  <li>Stand for the 3rd rak'ah, recite Sūrah al-Fātiḥah and another sūrah.</li>
  <li>After the qirā'ah, say "Allāhu Akbar" and raise your hands to the ears, then fold them again.</li>
  <li>Recite <strong>Du'ā' al-Qunūt</strong> — "Allāhumma innā nasta'īnuka wa nastaghfiruka..."</li>
  <li>Then go into rukū' and complete the ṣalāh as normal.</li>
</ul>

<h3>Ṣalātul Qaṣr (Shortened Prayer for Travellers)</h3>
<p>A person who plans to travel more than <strong>54 miles (87 km)</strong> from the boundary of their city is considered a musāfir (traveller). The ruling for a musāfir is:</p>
<ul>
  <li>The <strong>4-rak'ah farḍ prayers</strong> (Ḍhuhr, 'Aṣr, 'Ishā') are <strong>shortened to 2 rak'āt</strong>.</li>
  <li>Fajr (2 rak'āt) and Maghrib (3 rak'āt) remain unchanged.</li>
  <li>Sunnah prayers may be omitted when travelling, but the sunnah of Fajr and the Witr of 'Ishā' should still be prayed.</li>
  <li>If the traveller intends to stay at a place for <strong>15 days or more</strong>, they are no longer a musāfir and must pray full ṣalāh.</li>
</ul>

<h3>Ṣalātul Marīḍ (Prayer of the Sick)</h3>
<p>Ṣalāh is never excused, even for a sick person. If a person is unable to stand, they may:</p>
<ul>
  <li>Pray sitting down, performing rukū' and sujūd as normal.</li>
  <li>If unable to do rukū' and sujūd, pray sitting and indicate by nodding the head (tilting more for sujūd than for rukū').</li>
  <li>If unable to sit, pray lying on the back or on the right side, facing the Qiblah, and indicate by nodding.</li>
  <li>If unable to nod, delay the prayer — but it is <strong>never</strong> excused entirely while a person is conscious.</li>
</ul>
      `.trim(),
      orderIndex: 0,
    },
  });

  console.log('✅ Created Unit 0: Fiqh');
  // ──────────────────────────────────────────────
  // UNIT 1: AḤĀDĪTH
  // ──────────────────────────────────────────────

    const unitAhadith = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-ahadith' } },
    create: {
      slug: 'maktab-3-ahadith',
      courseId: course.id,
      title: 'Aḥādīth — Sayings of Rasūlullāh ﷺ',
      description: 'Ten key aḥādīth covering ṣalāh, love for others, steadfastness, life as a journey, this world, du\'ā\', honouring guests, mercy, modesty, and shukr (gratitude).',
      orderIndex: 1,
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will study ten aḥādīth of Rasūlullāh ﷺ on important topics including ṣalāh, character, the nature of this world, du'ā', hospitality, mercy, modesty, and gratitude.</p>

<h3>Ḥadīth 1: Ṣalāh</h3>
<p class="arabic" dir="rtl" lang="ar">الصَّلَاةُ عِمَادُ الدِّينِ</p>
<blockquote>"Ṣalāh is a pillar of dīn."</blockquote>
<p><strong>Source:</strong> Bayhaqī</p>
<p>Just as a building cannot stand without pillars, a person's dīn (religion) cannot stand without ṣalāh. Ṣalāh will be the first thing we are asked about on the Day of Judgement. If our ṣalāh is in order, everything else will be easy. We must never miss our five daily prayers.</p>

<h3>Ḥadīth 2: Love for Others</h3>
<p class="arabic" dir="rtl" lang="ar">أَحِبَّ لِلنَّاسِ مَا تُحِبُّ لِنَفْسِكَ تَكُنْ مُسْلِمًا</p>
<blockquote>"Love for people what you love for yourself, and you will become a true Muslim."</blockquote>
<p><strong>Source:</strong> Tirmidhī</p>
<p>A true Muslim is not selfish. If you love something for yourself — such as good food, nice clothes, or happiness — then wish the same for others. Selfishness and jealousy have no place in a Muslim's heart.</p>

<h3>Ḥadīth 3: Steadfastness</h3>
<p class="arabic" dir="rtl" lang="ar">قُلْ آمَنْتُ بِاللَّهِ ثُمَّ اسْتَقِمْ</p>
<blockquote>"Say: 'I believe in Allāh,' then stay firm."</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ Muslim</p>
<p>It is not enough to simply say we believe — we must remain steadfast upon that belief. When difficulties come, when people mock us, or when we are tempted to do wrong, we must stay firm on the path of Islam.</p>

<h3>Ḥadīth 4: Life</h3>
<p class="arabic" dir="rtl" lang="ar">كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ</p>
<blockquote>"Stay in this world as though you are a stranger, rather a traveller."</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ al-Bukhārī</p>
<p>This world is temporary — like a waiting room before the real life of the Ākhirah (Hereafter). A traveller does not become attached to the places they pass through. Similarly, we should not become too attached to the things of this world. Our real home is Jannah.</p>

<h3>Ḥadīth 5: This World</h3>
<p class="arabic" dir="rtl" lang="ar">الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ</p>
<blockquote>"The world is a prison for a believer and a paradise for a disbeliever."</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ Muslim</p>
<p>A Muslim cannot do whatever they please in this world — there are rules and limits set by Allāh. This makes the world feel like a "prison" compared to the freedom of Jannah. But for those who deny Allāh, this world is the best they will ever have.</p>

<h3>Ḥadīth 6: Du'ā'</h3>
<p class="arabic" dir="rtl" lang="ar">الدُّعَاءُ سِلَاحُ الْمُؤْمِنِ</p>
<blockquote>"Du'ā' is the weapon of a believer."</blockquote>
<p><strong>Source:</strong> Ḥākim</p>
<p>Just as a weapon protects a person from enemies, du'ā' protects the believer from harm, difficulty, and evil. We should make du'ā' at all times — especially after ṣalāh, in the last third of the night, and when it is raining. Allāh loves it when we ask Him.</p>

<h3>Ḥadīth 7: Guests</h3>
<p class="arabic" dir="rtl" lang="ar">مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ</p>
<blockquote>"Whoever believes in Allāh and the Last Day should honour his guest!"</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ al-Bukhārī</p>
<p>Honouring guests is a sign of true īmān. When guests come to our home, we should welcome them warmly, offer them food and drink, and make them feel comfortable. The Prophet Ibrāhīm عليه السلام was famous for his generosity to guests.</p>

<h3>Ḥadīth 8: Mercy</h3>
<p class="arabic" dir="rtl" lang="ar">لَا يَرْحَمُ اللَّهُ مَنْ لَا يَرْحَمُ النَّاسَ</p>
<blockquote>"Allāh does not show mercy to the one who does not show mercy to people!"</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ al-Bukhārī</p>
<p>If we want the mercy of Allāh, we must show mercy to His creation — not just to humans, but to animals and all living things. Being harsh, cruel, or unkind drives away the mercy of Allāh.</p>

<h3>Ḥadīth 9: Modesty</h3>
<p class="arabic" dir="rtl" lang="ar">الْحَيَاءُ مِنَ الْإِيمَانِ</p>
<blockquote>"Modesty is part of īmān."</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ al-Bukhārī</p>
<p>Modesty (ḥayā') stops a person from doing evil. A modest person is careful about their clothing, their behaviour, and their speech. Modesty brings nothing but good. It is one of the special qualities of our Prophet ﷺ, who was more modest than a young girl behind her veil.</p>

<h3>Ḥadīth 10: Shukr (Gratitude)</h3>
<p class="arabic" dir="rtl" lang="ar">أَفْضَلُ الدُّعَاءِ الْحَمْدُ لِلَّهِ</p>
<blockquote>"The best du'ā' is Alḥamdulillāh."</blockquote>
<p><strong>Source:</strong> Tirmidhī</p>
<p>Allāh has given us so many blessings — our health, our family, our food, our sight, our hearing. If we keep thanking Allāh by saying "Alḥamdulillāh," He will give us even more. Gratitude (shukr) is one of the greatest forms of worship.</p>
      `.trim(),
    },
    update: {
      title: 'Aḥādīth — Sayings of Rasūlullāh ﷺ',
      description: 'Ten key aḥādīth covering ṣalāh, love for others, steadfastness, life as a journey, this world, du\'ā\', honouring guests, mercy, modesty, and shukr (gratitude).',
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will study ten aḥādīth of Rasūlullāh ﷺ on important topics including ṣalāh, character, the nature of this world, du'ā', hospitality, mercy, modesty, and gratitude.</p>

<h3>Ḥadīth 1: Ṣalāh</h3>
<p class="arabic" dir="rtl" lang="ar">الصَّلَاةُ عِمَادُ الدِّينِ</p>
<blockquote>"Ṣalāh is a pillar of dīn."</blockquote>
<p><strong>Source:</strong> Bayhaqī</p>
<p>Just as a building cannot stand without pillars, a person's dīn (religion) cannot stand without ṣalāh. Ṣalāh will be the first thing we are asked about on the Day of Judgement. If our ṣalāh is in order, everything else will be easy. We must never miss our five daily prayers.</p>

<h3>Ḥadīth 2: Love for Others</h3>
<p class="arabic" dir="rtl" lang="ar">أَحِبَّ لِلنَّاسِ مَا تُحِبُّ لِنَفْسِكَ تَكُنْ مُسْلِمًا</p>
<blockquote>"Love for people what you love for yourself, and you will become a true Muslim."</blockquote>
<p><strong>Source:</strong> Tirmidhī</p>
<p>A true Muslim is not selfish. If you love something for yourself — such as good food, nice clothes, or happiness — then wish the same for others. Selfishness and jealousy have no place in a Muslim's heart.</p>

<h3>Ḥadīth 3: Steadfastness</h3>
<p class="arabic" dir="rtl" lang="ar">قُلْ آمَنْتُ بِاللَّهِ ثُمَّ اسْتَقِمْ</p>
<blockquote>"Say: 'I believe in Allāh,' then stay firm."</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ Muslim</p>
<p>It is not enough to simply say we believe — we must remain steadfast upon that belief. When difficulties come, when people mock us, or when we are tempted to do wrong, we must stay firm on the path of Islam.</p>

<h3>Ḥadīth 4: Life</h3>
<p class="arabic" dir="rtl" lang="ar">كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ</p>
<blockquote>"Stay in this world as though you are a stranger, rather a traveller."</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ al-Bukhārī</p>
<p>This world is temporary — like a waiting room before the real life of the Ākhirah (Hereafter). A traveller does not become attached to the places they pass through. Similarly, we should not become too attached to the things of this world. Our real home is Jannah.</p>

<h3>Ḥadīth 5: This World</h3>
<p class="arabic" dir="rtl" lang="ar">الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ</p>
<blockquote>"The world is a prison for a believer and a paradise for a disbeliever."</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ Muslim</p>
<p>A Muslim cannot do whatever they please in this world — there are rules and limits set by Allāh. This makes the world feel like a "prison" compared to the freedom of Jannah. But for those who deny Allāh, this world is the best they will ever have.</p>

<h3>Ḥadīth 6: Du'ā'</h3>
<p class="arabic" dir="rtl" lang="ar">الدُّعَاءُ سِلَاحُ الْمُؤْمِنِ</p>
<blockquote>"Du'ā' is the weapon of a believer."</blockquote>
<p><strong>Source:</strong> Ḥākim</p>
<p>Just as a weapon protects a person from enemies, du'ā' protects the believer from harm, difficulty, and evil. We should make du'ā' at all times — especially after ṣalāh, in the last third of the night, and when it is raining. Allāh loves it when we ask Him.</p>

<h3>Ḥadīth 7: Guests</h3>
<p class="arabic" dir="rtl" lang="ar">مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ</p>
<blockquote>"Whoever believes in Allāh and the Last Day should honour his guest!"</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ al-Bukhārī</p>
<p>Honouring guests is a sign of true īmān. When guests come to our home, we should welcome them warmly, offer them food and drink, and make them feel comfortable. The Prophet Ibrāhīm عليه السلام was famous for his generosity to guests.</p>

<h3>Ḥadīth 8: Mercy</h3>
<p class="arabic" dir="rtl" lang="ar">لَا يَرْحَمُ اللَّهُ مَنْ لَا يَرْحَمُ النَّاسَ</p>
<blockquote>"Allāh does not show mercy to the one who does not show mercy to people!"</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ al-Bukhārī</p>
<p>If we want the mercy of Allāh, we must show mercy to His creation — not just to humans, but to animals and all living things. Being harsh, cruel, or unkind drives away the mercy of Allāh.</p>

<h3>Ḥadīth 9: Modesty</h3>
<p class="arabic" dir="rtl" lang="ar">الْحَيَاءُ مِنَ الْإِيمَانِ</p>
<blockquote>"Modesty is part of īmān."</blockquote>
<p><strong>Source:</strong> Ṣaḥīḥ al-Bukhārī</p>
<p>Modesty (ḥayā') stops a person from doing evil. A modest person is careful about their clothing, their behaviour, and their speech. Modesty brings nothing but good. It is one of the special qualities of our Prophet ﷺ, who was more modest than a young girl behind her veil.</p>

<h3>Ḥadīth 10: Shukr (Gratitude)</h3>
<p class="arabic" dir="rtl" lang="ar">أَفْضَلُ الدُّعَاءِ الْحَمْدُ لِلَّهِ</p>
<blockquote>"The best du'ā' is Alḥamdulillāh."</blockquote>
<p><strong>Source:</strong> Tirmidhī</p>
<p>Allāh has given us so many blessings — our health, our family, our food, our sight, our hearing. If we keep thanking Allāh by saying "Alḥamdulillāh," He will give us even more. Gratitude (shukr) is one of the greatest forms of worship.</p>
      `.trim(),
      orderIndex: 1,
    },
  });

  console.log('✅ Created Unit 1: Aḥādīth');
  // ──────────────────────────────────────────────
  // UNIT 2: SĪRAH
  // ──────────────────────────────────────────────

    const unitSirah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-sirah' } },
    create: {
      slug: 'maktab-3-sirah',
      courseId: course.id,
      title: 'Sīrah — From Abyssinia to al-Isrā\' wal-Mi\'rāj',
      description: 'The hijrah to Abyssinia, Ḥamzah and \'Umar\'s acceptance of Islam, the boycott of Banū Hāshim, the Year of Sadness, the journey to Ṭā\'if, and the miraculous Night Journey and Ascension.',
      orderIndex: 2,
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn about:</p>
<ul>
  <li>The migration of Muslims to Abyssinia</li>
  <li>The conversion of Ḥamzah and 'Umar to Islam</li>
  <li>The boycott of Banū Hāshim</li>
  <li>The Year of Sadness</li>
  <li>The journey to Ṭā'if</li>
  <li>The miraculous Night Journey (al-Isrā' wal Mi'rāj)</li>
</ul>

<h3>Recap</h3>
<p>In Coursebook 2, we learned about the first revelation in Cave Ḥirā', the first believers (Khadījah, Abū Bakr, 'Alī, Zayd), and the terrible persecution of early Muslims in Makkah. The Quraysh tortured Bilāl, the family of Yāsir, and many other Companions. The situation became so difficult that the Prophet ﷺ gave permission for some Companions to leave Makkah.</p>

<h3>The First Migration to Abyssinia</h3>
<p>In the 5th year of Prophethood, a small group of about <strong>11 men and 4 women</strong> migrated to <strong>Abyssinia</strong> (modern-day Ethiopia/Eritrea). The king of Abyssinia, <strong>Najāshī</strong> (Negus), was known to be a fair and just Christian ruler. The Muslims hoped to find safety and freedom to practise their religion there.</p>

<h3>The Second Migration to Abyssinia</h3>
<p>When the persecution worsened, a larger group of about <strong>83 men and 18 women</strong> migrated to Abyssinia. The Quraysh were furious. They sent <strong>'Amr ibn al-'Āṣ</strong> and <strong>'Abdullāh ibn Abī Rabī'ah</strong> with expensive gifts to bribe King Najāshī and demand the return of the Muslims.</p>

<h3>Ja'far's Speech Before Najāshī</h3>
<p><strong>Ja'far ibn Abī Ṭālib</strong> spoke on behalf of the Muslims. He said:</p>
<blockquote>"O King, we were a people of ignorance. We worshipped idols, ate dead animals, committed shameful acts, broke family ties, and mistreated our neighbours. The strong among us would oppress the weak. Then Allāh sent us a Messenger from amongst ourselves — we know his truthfulness, his trustworthiness, and his noble lineage. He called us to worship Allāh alone, to speak the truth, to honour our relatives, and to be kind to our neighbours."</blockquote>
<p>He then recited verses from <strong>Sūrah Maryam</strong> about the birth of 'Īsā عليه السلام. Najāshī and his bishops wept. Najāshī refused to hand the Muslims over to the Quraysh and allowed them to remain safely in his kingdom.</p>

<h3>The Conversion of Ḥamzah</h3>
<p><strong>Ḥamzah ibn 'Abdul Muṭṭalib</strong> was the Prophet's uncle — a brave and strong warrior. One day, Abū Jahl insulted and abused the Prophet ﷺ near the Ka'bah. When Ḥamzah heard about this, he was so furious that he went straight to Abū Jahl and struck him with his bow, declaring: <em>"I too follow the religion of Muḥammad!"</em> His acceptance of Islam was a great boost for the Muslim community.</p>

<h3>The Conversion of 'Umar</h3>
<p><strong>'Umar ibn al-Khaṭṭāb</strong> was initially a fierce enemy of Islam. One day, he set out with his sword intending to harm the Prophet ﷺ. On the way, someone told him that his own sister Fāṭimah and her husband had accepted Islam. Enraged, he went to their house instead. He heard them reciting the Qur'ān and demanded to see it. They told him he must first make wuḍū'. After reading the verses of <strong>Sūrah Ṭā Hā</strong>, his heart softened and he went to the Prophet ﷺ and declared his Islam. The Muslims were so overjoyed that they shouted "Allāhu Akbar" and the sound echoed through Makkah.</p>

<h3>'Utbah ibn Rabī'ah's Bribery</h3>
<p>The Quraysh sent 'Utbah ibn Rabī'ah to offer the Prophet ﷺ wealth, kingship, and the most beautiful woman in Makkah if he would stop preaching. The Prophet ﷺ simply recited verses of the Qur'ān in response. 'Utbah returned to the Quraysh saying: <em>"Leave this man alone. His words are not poetry, sorcery, or soothsaying. Something great will come from him."</em> But the Quraysh refused to listen.</p>

<h3>The Boycott of Banū Hāshim</h3>
<p>When bribes and threats failed, the Quraysh agreed on a total boycott. They wrote a document declaring that <strong>no one would trade with, marry into, or even speak to Banū Hāshim and Banū Muṭṭalib</strong>. The document was hung inside the Ka'bah.</p>
<p>The Muslims were forced into <strong>Shi'b Abī Ṭālib</strong> — a narrow valley outside Makkah. For <strong>three terrible years</strong>, they suffered hunger and hardship. The cries of hungry children could be heard from outside the valley. Eventually, Allāh sent <strong>white ants</strong> that ate the document, leaving only the words "Bismikallāhumma" (In Your Name, O Allāh). When the Quraysh checked, they found the document destroyed and ended the boycott.</p>

<h3>The Year of Sadness ('Āmul Ḥuzn)</h3>
<p>Shortly after the boycott ended, two devastating losses struck the Prophet ﷺ. First, his beloved uncle <strong>Abū Ṭālib</strong> — who had protected him for years — passed away. Then, only a short time later, his beloved wife <strong>Khadījah</strong> رضي الله عنها — his greatest supporter and comfort — also passed away. This year became known as the <strong>Year of Sadness</strong>. Without Abū Ṭālib's protection, the persecution of the Prophet ﷺ intensified greatly.</p>

<h3>The Journey to Ṭā'if</h3>
<p>Hoping to find support elsewhere, the Prophet ﷺ travelled to <strong>Ṭā'if</strong> with Zayd ibn Ḥārithah. He invited the leaders of Ṭā'if to Islam, but they mocked him and rejected his message. Worse still, they sent the children and foolish people of the town to <strong>pelt him with stones</strong>. The Prophet ﷺ was injured and bleeding.</p>
<p>The <strong>Angel of the Mountains</strong> appeared and offered to crush the people of Ṭā'if between two mountains. But the merciful Prophet ﷺ <strong>refused</strong>, saying: <em>"Perhaps Allāh will bring from their descendants people who will worship Allāh alone."</em> This shows the incredible mercy and patience of our beloved Prophet ﷺ.</p>

<h3>A Group from Yathrib</h3>
<p>During the Ḥajj season, the Prophet ﷺ met a group of people from <strong>Yathrib</strong> (later known as Madīnah). They listened to his message and accepted Islam. They returned home and spread the message, and the following year, more people came and pledged their allegiance to the Prophet ﷺ. This was the beginning of the road to Madīnah.</p>

<h3>Al-Isrā' — The Night Journey</h3>
<p>In one of the most difficult periods of his life, Allāh honoured the Prophet ﷺ with a miraculous journey. One night, the angel Jibrā'īl عليه السلام brought a creature called <strong>Burāq</strong> — a beautiful white creature, larger than a donkey but smaller than a horse, with wings. Each step of Burāq covered as far as the eye could see.</p>
<p>The Prophet ﷺ rode Burāq from <strong>Masjid al-Ḥarām in Makkah</strong> to <strong>Masjid al-Aqṣā in Jerusalem</strong>. There, he led all the previous prophets in ṣalāh. This journey is called <strong>al-Isrā'</strong>.</p>

<h3>Al-Mi'rāj — The Ascent Through the Heavens</h3>
<p>From Jerusalem, the Prophet ﷺ ascended through the <strong>seven heavens</strong>:</p>
<ol>
  <li><strong>First Heaven:</strong> He met Ādam عليه السلام.</li>
  <li><strong>Second Heaven:</strong> He met 'Īsā and Yaḥyā عليهما السلام.</li>
  <li><strong>Third Heaven:</strong> He met Yūsuf عليه السلام.</li>
  <li><strong>Fourth Heaven:</strong> He met Idrīs عليه السلام.</li>
  <li><strong>Fifth Heaven:</strong> He met Hārūn عليه السلام.</li>
  <li><strong>Sixth Heaven:</strong> He met Mūsā عليه السلام.</li>
  <li><strong>Seventh Heaven:</strong> He met Ibrāhīm عليه السلام, leaning against al-Bayt al-Ma'mūr.</li>
</ol>
<p>The Prophet ﷺ then reached <strong>Sidrah al-Muntahā</strong> (the Lote Tree of the Furthest Limit). There, Allāh ordained <strong>50 daily prayers</strong> upon the Muslim Ummah. On the advice of Mūsā عليه السلام, the Prophet ﷺ kept returning to Allāh to ask for a reduction, until the prayers were reduced to <strong>5 daily prayers, with the reward of 50</strong>.</p>
<p>The next morning, when the Prophet ﷺ told the Quraysh about this miraculous journey, Abū Bakr immediately believed him, earning the title <strong>Aṣ-Ṣiddīq</strong> (The Most Truthful).</p>
      `.trim(),
    },
    update: {
      title: 'Sīrah — From Abyssinia to al-Isrā\' wal-Mi\'rāj',
      description: 'The hijrah to Abyssinia, Ḥamzah and \'Umar\'s acceptance of Islam, the boycott of Banū Hāshim, the Year of Sadness, the journey to Ṭā\'if, and the miraculous Night Journey and Ascension.',
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn about:</p>
<ul>
  <li>The migration of Muslims to Abyssinia</li>
  <li>The conversion of Ḥamzah and 'Umar to Islam</li>
  <li>The boycott of Banū Hāshim</li>
  <li>The Year of Sadness</li>
  <li>The journey to Ṭā'if</li>
  <li>The miraculous Night Journey (al-Isrā' wal Mi'rāj)</li>
</ul>

<h3>Recap</h3>
<p>In Coursebook 2, we learned about the first revelation in Cave Ḥirā', the first believers (Khadījah, Abū Bakr, 'Alī, Zayd), and the terrible persecution of early Muslims in Makkah. The Quraysh tortured Bilāl, the family of Yāsir, and many other Companions. The situation became so difficult that the Prophet ﷺ gave permission for some Companions to leave Makkah.</p>

<h3>The First Migration to Abyssinia</h3>
<p>In the 5th year of Prophethood, a small group of about <strong>11 men and 4 women</strong> migrated to <strong>Abyssinia</strong> (modern-day Ethiopia/Eritrea). The king of Abyssinia, <strong>Najāshī</strong> (Negus), was known to be a fair and just Christian ruler. The Muslims hoped to find safety and freedom to practise their religion there.</p>

<h3>The Second Migration to Abyssinia</h3>
<p>When the persecution worsened, a larger group of about <strong>83 men and 18 women</strong> migrated to Abyssinia. The Quraysh were furious. They sent <strong>'Amr ibn al-'Āṣ</strong> and <strong>'Abdullāh ibn Abī Rabī'ah</strong> with expensive gifts to bribe King Najāshī and demand the return of the Muslims.</p>

<h3>Ja'far's Speech Before Najāshī</h3>
<p><strong>Ja'far ibn Abī Ṭālib</strong> spoke on behalf of the Muslims. He said:</p>
<blockquote>"O King, we were a people of ignorance. We worshipped idols, ate dead animals, committed shameful acts, broke family ties, and mistreated our neighbours. The strong among us would oppress the weak. Then Allāh sent us a Messenger from amongst ourselves — we know his truthfulness, his trustworthiness, and his noble lineage. He called us to worship Allāh alone, to speak the truth, to honour our relatives, and to be kind to our neighbours."</blockquote>
<p>He then recited verses from <strong>Sūrah Maryam</strong> about the birth of 'Īsā عليه السلام. Najāshī and his bishops wept. Najāshī refused to hand the Muslims over to the Quraysh and allowed them to remain safely in his kingdom.</p>

<h3>The Conversion of Ḥamzah</h3>
<p><strong>Ḥamzah ibn 'Abdul Muṭṭalib</strong> was the Prophet's uncle — a brave and strong warrior. One day, Abū Jahl insulted and abused the Prophet ﷺ near the Ka'bah. When Ḥamzah heard about this, he was so furious that he went straight to Abū Jahl and struck him with his bow, declaring: <em>"I too follow the religion of Muḥammad!"</em> His acceptance of Islam was a great boost for the Muslim community.</p>

<h3>The Conversion of 'Umar</h3>
<p><strong>'Umar ibn al-Khaṭṭāb</strong> was initially a fierce enemy of Islam. One day, he set out with his sword intending to harm the Prophet ﷺ. On the way, someone told him that his own sister Fāṭimah and her husband had accepted Islam. Enraged, he went to their house instead. He heard them reciting the Qur'ān and demanded to see it. They told him he must first make wuḍū'. After reading the verses of <strong>Sūrah Ṭā Hā</strong>, his heart softened and he went to the Prophet ﷺ and declared his Islam. The Muslims were so overjoyed that they shouted "Allāhu Akbar" and the sound echoed through Makkah.</p>

<h3>'Utbah ibn Rabī'ah's Bribery</h3>
<p>The Quraysh sent 'Utbah ibn Rabī'ah to offer the Prophet ﷺ wealth, kingship, and the most beautiful woman in Makkah if he would stop preaching. The Prophet ﷺ simply recited verses of the Qur'ān in response. 'Utbah returned to the Quraysh saying: <em>"Leave this man alone. His words are not poetry, sorcery, or soothsaying. Something great will come from him."</em> But the Quraysh refused to listen.</p>

<h3>The Boycott of Banū Hāshim</h3>
<p>When bribes and threats failed, the Quraysh agreed on a total boycott. They wrote a document declaring that <strong>no one would trade with, marry into, or even speak to Banū Hāshim and Banū Muṭṭalib</strong>. The document was hung inside the Ka'bah.</p>
<p>The Muslims were forced into <strong>Shi'b Abī Ṭālib</strong> — a narrow valley outside Makkah. For <strong>three terrible years</strong>, they suffered hunger and hardship. The cries of hungry children could be heard from outside the valley. Eventually, Allāh sent <strong>white ants</strong> that ate the document, leaving only the words "Bismikallāhumma" (In Your Name, O Allāh). When the Quraysh checked, they found the document destroyed and ended the boycott.</p>

<h3>The Year of Sadness ('Āmul Ḥuzn)</h3>
<p>Shortly after the boycott ended, two devastating losses struck the Prophet ﷺ. First, his beloved uncle <strong>Abū Ṭālib</strong> — who had protected him for years — passed away. Then, only a short time later, his beloved wife <strong>Khadījah</strong> رضي الله عنها — his greatest supporter and comfort — also passed away. This year became known as the <strong>Year of Sadness</strong>. Without Abū Ṭālib's protection, the persecution of the Prophet ﷺ intensified greatly.</p>

<h3>The Journey to Ṭā'if</h3>
<p>Hoping to find support elsewhere, the Prophet ﷺ travelled to <strong>Ṭā'if</strong> with Zayd ibn Ḥārithah. He invited the leaders of Ṭā'if to Islam, but they mocked him and rejected his message. Worse still, they sent the children and foolish people of the town to <strong>pelt him with stones</strong>. The Prophet ﷺ was injured and bleeding.</p>
<p>The <strong>Angel of the Mountains</strong> appeared and offered to crush the people of Ṭā'if between two mountains. But the merciful Prophet ﷺ <strong>refused</strong>, saying: <em>"Perhaps Allāh will bring from their descendants people who will worship Allāh alone."</em> This shows the incredible mercy and patience of our beloved Prophet ﷺ.</p>

<h3>A Group from Yathrib</h3>
<p>During the Ḥajj season, the Prophet ﷺ met a group of people from <strong>Yathrib</strong> (later known as Madīnah). They listened to his message and accepted Islam. They returned home and spread the message, and the following year, more people came and pledged their allegiance to the Prophet ﷺ. This was the beginning of the road to Madīnah.</p>

<h3>Al-Isrā' — The Night Journey</h3>
<p>In one of the most difficult periods of his life, Allāh honoured the Prophet ﷺ with a miraculous journey. One night, the angel Jibrā'īl عليه السلام brought a creature called <strong>Burāq</strong> — a beautiful white creature, larger than a donkey but smaller than a horse, with wings. Each step of Burāq covered as far as the eye could see.</p>
<p>The Prophet ﷺ rode Burāq from <strong>Masjid al-Ḥarām in Makkah</strong> to <strong>Masjid al-Aqṣā in Jerusalem</strong>. There, he led all the previous prophets in ṣalāh. This journey is called <strong>al-Isrā'</strong>.</p>

<h3>Al-Mi'rāj — The Ascent Through the Heavens</h3>
<p>From Jerusalem, the Prophet ﷺ ascended through the <strong>seven heavens</strong>:</p>
<ol>
  <li><strong>First Heaven:</strong> He met Ādam عليه السلام.</li>
  <li><strong>Second Heaven:</strong> He met 'Īsā and Yaḥyā عليهما السلام.</li>
  <li><strong>Third Heaven:</strong> He met Yūsuf عليه السلام.</li>
  <li><strong>Fourth Heaven:</strong> He met Idrīs عليه السلام.</li>
  <li><strong>Fifth Heaven:</strong> He met Hārūn عليه السلام.</li>
  <li><strong>Sixth Heaven:</strong> He met Mūsā عليه السلام.</li>
  <li><strong>Seventh Heaven:</strong> He met Ibrāhīm عليه السلام, leaning against al-Bayt al-Ma'mūr.</li>
</ol>
<p>The Prophet ﷺ then reached <strong>Sidrah al-Muntahā</strong> (the Lote Tree of the Furthest Limit). There, Allāh ordained <strong>50 daily prayers</strong> upon the Muslim Ummah. On the advice of Mūsā عليه السلام, the Prophet ﷺ kept returning to Allāh to ask for a reduction, until the prayers were reduced to <strong>5 daily prayers, with the reward of 50</strong>.</p>
<p>The next morning, when the Prophet ﷺ told the Quraysh about this miraculous journey, Abū Bakr immediately believed him, earning the title <strong>Aṣ-Ṣiddīq</strong> (The Most Truthful).</p>
      `.trim(),
      orderIndex: 2,
    },
  });

  console.log('✅ Created Unit 2: Sīrah');
  // ──────────────────────────────────────────────
  // UNIT 3: TĀRĪKH
  // ──────────────────────────────────────────────

    const unitTarikh = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-tarikh' } },
    create: {
      slug: 'maktab-3-tarikh',
      courseId: course.id,
      title: 'Tārīkh — The Story of Ibrāhīm & Ismā\'īl عليهم السلام',
      description: 'The life of Prophet Ibrāhīm عليه السلام: his youth among idol worshippers, breaking the idols, the fire, the debate with Namrūd, the search for truth, and the stories of Zamzam, the sacrifice of Ismā\'īl, and building the Ka\'bah.',
      orderIndex: 3,
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn about:</p>
<ul>
  <li>The early life of Ibrāhīm عليه السلام in the city of Ūr</li>
  <li>How he challenged the idol worship of his father and his people</li>
  <li>The miracle of the fire</li>
  <li>His debate with King Namrūd</li>
  <li>His journey to Makkah and the miracle of Zamzam</li>
  <li>The sacrifice of Ismā'īl and the building of the Ka'bah</li>
</ul>

<h3>Early Life in Ūr</h3>
<p>Ibrāhīm عليه السلام was born in the city of <strong>Ūr</strong> in ancient Mesopotamia (modern-day Iraq). His father's name was <strong>Āzar</strong>, and he was an <strong>idol-maker</strong>. Āzar used to carve idols out of stone and sell them to the people, who would then worship them.</p>
<p>Even as a young boy, Ibrāhīm found it strange that people worshipped stones that could not see, hear, speak, or help anyone. He knew in his heart that these idols had no power at all.</p>

<h3>Searching for the True Lord</h3>
<p>One night, Ibrāhīm عليه السلام looked at the sky and saw a bright star. He said: "This is my Lord." But when the star set, he said: "I do not love things that set." Then he saw the moon shining brightly and said: "This is my Lord." But when the moon set, he said: "If my Lord does not guide me, I will be among the astray people." Then he saw the sun rising in all its glory and said: "This is my Lord, this is greater!" But when the sun set, he declared:</p>
<blockquote>"I have turned my face towards the One who created the heavens and the earth, and I am not of those who associate partners with Allāh." (Qur'ān 6:79)</blockquote>

<h3>Breaking the Idols</h3>
<p>One day, when the people left for a festival, Ibrāhīm عليه السلام stayed behind. He went to the temple and <strong>broke all the idols</strong> except the largest one, around whose neck he hung the axe. When the people returned and found their idols smashed, they demanded to know who did this. They suspected Ibrāhīm.</p>
<p>When questioned, Ibrāhīm said: <em>"Ask the big one — perhaps he did it!"</em> The people said: "You know they cannot speak!" Ibrāhīm replied: <em>"Then why do you worship things that cannot help or harm you?"</em> The people were left speechless but were too arrogant to accept the truth.</p>

<h3>Thrown into the Fire</h3>
<p>The people decided to punish Ibrāhīm by <strong>throwing him into a great fire</strong>. They gathered wood for days and built a fire so huge that nobody could get near it. They used a catapult to throw Ibrāhīm into the fire. But Allāh commanded:</p>
<p class="arabic" dir="rtl" lang="ar">قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ</p>
<blockquote>"O fire, be cool and peaceful for Ibrāhīm." (Qur'ān 21:69)</blockquote>
<p>The fire did not harm Ibrāhīm at all. He sat in the middle of it comfortably, and it became like a garden for him. This was a great miracle of Allāh.</p>

<h3>Debating King Namrūd</h3>
<p><strong>Namrūd</strong> was the evil and arrogant king of the land. He claimed to have power over life and death. Ibrāhīm عليه السلام challenged him:</p>
<blockquote>"My Lord is the One who gives life and causes death."</blockquote>
<p>Namrūd said: "I too give life and death" — and he freed one prisoner and executed another. Then Ibrāhīm said:</p>
<blockquote>"Allāh brings the sun from the East — can you bring it from the West?"</blockquote>
<p>Namrūd was left speechless. He had no answer. The truth of Allāh's power was clear for everyone to see.</p>

<h3>The Journey to Makkah</h3>
<p>Allāh commanded Ibrāhīm عليه السلام to take his wife <strong>Hājar</strong> and their baby son <strong>Ismā'īl</strong> to the barren desert valley of Makkah. There was no water, no food, and no people there. Ibrāhīm left them with some dates and water, trusting in Allāh's plan.</p>
<p>When Hājar asked: "Has Allāh commanded you to do this?" and Ibrāhīm said yes, she replied with complete trust: <em>"Then Allāh will not let us go to waste."</em></p>

<h3>The Miracle of Zamzam</h3>
<p>When the water ran out, baby Ismā'īl began to cry from thirst. Hājar ran frantically between the two hills of <strong>Ṣafā</strong> and <strong>Marwah</strong> — <strong>seven times</strong> — looking for water or any sign of help. This act is commemorated during Ḥajj as <strong>Sa'ī</strong>.</p>
<p>As she returned to her baby, she saw an angel (Jibrā'īl) striking the ground near Ismā'īl with his wing. Water gushed forth from the earth! Hājar contained it saying: <em>"Zam! Zam!"</em> (Stop! Stop!). This blessed water is <strong>Zamzam</strong>, and it still flows in Makkah today. Millions of people drink from it, and it has never dried up.</p>

<h3>The Sacrifice of Ismā'īl</h3>
<p>When Ismā'īl grew up, Allāh tested Ibrāhīm with the greatest test — he saw in a dream that he was <strong>sacrificing his son</strong>. The dreams of prophets are a form of revelation. Ibrāhīm told his son about the dream, and Ismā'īl replied with incredible obedience:</p>
<blockquote>"O my father, do as you have been commanded. You will find me, if Allāh wills, among the patient." (Qur'ān 37:102)</blockquote>
<p>As Ibrāhīm laid his son down and placed the knife, Allāh called out: <em>"O Ibrāhīm, you have fulfilled the dream!"</em> Allāh sent a <strong>ram from Jannah</strong> as a replacement sacrifice. This great event is commemorated every year during <strong>'Īd al-Aḍḥā</strong>, when Muslims around the world sacrifice an animal.</p>

<h3>Building the Ka'bah</h3>
<p>Allāh commanded Ibrāhīm and Ismā'īl عليهما السلام to build the <strong>Ka'bah</strong> — the house of Allāh in Makkah. They built it together with their own hands, stone by stone. When the walls became too high, Ibrāhīm stood on a rock called <strong>Maqām Ibrāhīm</strong> (the Station of Ibrāhīm), and his footprints were miraculously preserved in the stone.</p>
<p>As they built, they made this beautiful du'ā':</p>
<blockquote>"Our Lord, accept this from us. Indeed You are the All-Hearing, the All-Knowing." (Qur'ān 2:127)</blockquote>
<p>The Ka'bah became the <strong>Qiblah</strong> — the direction all Muslims face in ṣalāh — and the destination of Ḥajj, the annual pilgrimage that Ibrāhīm himself was commanded to announce.</p>
<p>Ibrāhīm عليه السلام is given the title <strong>Khalīlullāh</strong> — the Close Friend of Allāh. His story teaches us about complete trust in Allāh, unwavering obedience, and courage in standing for the truth.</p>
      `.trim(),
    },
    update: {
      title: 'Tārīkh — The Story of Ibrāhīm & Ismā\'īl عليهم السلام',
      description: 'The life of Prophet Ibrāhīm عليه السلام: his youth among idol worshippers, breaking the idols, the fire, the debate with Namrūd, the search for truth, and the stories of Zamzam, the sacrifice of Ismā\'īl, and building the Ka\'bah.',
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn about:</p>
<ul>
  <li>The early life of Ibrāhīm عليه السلام in the city of Ūr</li>
  <li>How he challenged the idol worship of his father and his people</li>
  <li>The miracle of the fire</li>
  <li>His debate with King Namrūd</li>
  <li>His journey to Makkah and the miracle of Zamzam</li>
  <li>The sacrifice of Ismā'īl and the building of the Ka'bah</li>
</ul>

<h3>Early Life in Ūr</h3>
<p>Ibrāhīm عليه السلام was born in the city of <strong>Ūr</strong> in ancient Mesopotamia (modern-day Iraq). His father's name was <strong>Āzar</strong>, and he was an <strong>idol-maker</strong>. Āzar used to carve idols out of stone and sell them to the people, who would then worship them.</p>
<p>Even as a young boy, Ibrāhīm found it strange that people worshipped stones that could not see, hear, speak, or help anyone. He knew in his heart that these idols had no power at all.</p>

<h3>Searching for the True Lord</h3>
<p>One night, Ibrāhīm عليه السلام looked at the sky and saw a bright star. He said: "This is my Lord." But when the star set, he said: "I do not love things that set." Then he saw the moon shining brightly and said: "This is my Lord." But when the moon set, he said: "If my Lord does not guide me, I will be among the astray people." Then he saw the sun rising in all its glory and said: "This is my Lord, this is greater!" But when the sun set, he declared:</p>
<blockquote>"I have turned my face towards the One who created the heavens and the earth, and I am not of those who associate partners with Allāh." (Qur'ān 6:79)</blockquote>

<h3>Breaking the Idols</h3>
<p>One day, when the people left for a festival, Ibrāhīm عليه السلام stayed behind. He went to the temple and <strong>broke all the idols</strong> except the largest one, around whose neck he hung the axe. When the people returned and found their idols smashed, they demanded to know who did this. They suspected Ibrāhīm.</p>
<p>When questioned, Ibrāhīm said: <em>"Ask the big one — perhaps he did it!"</em> The people said: "You know they cannot speak!" Ibrāhīm replied: <em>"Then why do you worship things that cannot help or harm you?"</em> The people were left speechless but were too arrogant to accept the truth.</p>

<h3>Thrown into the Fire</h3>
<p>The people decided to punish Ibrāhīm by <strong>throwing him into a great fire</strong>. They gathered wood for days and built a fire so huge that nobody could get near it. They used a catapult to throw Ibrāhīm into the fire. But Allāh commanded:</p>
<p class="arabic" dir="rtl" lang="ar">قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ</p>
<blockquote>"O fire, be cool and peaceful for Ibrāhīm." (Qur'ān 21:69)</blockquote>
<p>The fire did not harm Ibrāhīm at all. He sat in the middle of it comfortably, and it became like a garden for him. This was a great miracle of Allāh.</p>

<h3>Debating King Namrūd</h3>
<p><strong>Namrūd</strong> was the evil and arrogant king of the land. He claimed to have power over life and death. Ibrāhīm عليه السلام challenged him:</p>
<blockquote>"My Lord is the One who gives life and causes death."</blockquote>
<p>Namrūd said: "I too give life and death" — and he freed one prisoner and executed another. Then Ibrāhīm said:</p>
<blockquote>"Allāh brings the sun from the East — can you bring it from the West?"</blockquote>
<p>Namrūd was left speechless. He had no answer. The truth of Allāh's power was clear for everyone to see.</p>

<h3>The Journey to Makkah</h3>
<p>Allāh commanded Ibrāhīm عليه السلام to take his wife <strong>Hājar</strong> and their baby son <strong>Ismā'īl</strong> to the barren desert valley of Makkah. There was no water, no food, and no people there. Ibrāhīm left them with some dates and water, trusting in Allāh's plan.</p>
<p>When Hājar asked: "Has Allāh commanded you to do this?" and Ibrāhīm said yes, she replied with complete trust: <em>"Then Allāh will not let us go to waste."</em></p>

<h3>The Miracle of Zamzam</h3>
<p>When the water ran out, baby Ismā'īl began to cry from thirst. Hājar ran frantically between the two hills of <strong>Ṣafā</strong> and <strong>Marwah</strong> — <strong>seven times</strong> — looking for water or any sign of help. This act is commemorated during Ḥajj as <strong>Sa'ī</strong>.</p>
<p>As she returned to her baby, she saw an angel (Jibrā'īl) striking the ground near Ismā'īl with his wing. Water gushed forth from the earth! Hājar contained it saying: <em>"Zam! Zam!"</em> (Stop! Stop!). This blessed water is <strong>Zamzam</strong>, and it still flows in Makkah today. Millions of people drink from it, and it has never dried up.</p>

<h3>The Sacrifice of Ismā'īl</h3>
<p>When Ismā'īl grew up, Allāh tested Ibrāhīm with the greatest test — he saw in a dream that he was <strong>sacrificing his son</strong>. The dreams of prophets are a form of revelation. Ibrāhīm told his son about the dream, and Ismā'īl replied with incredible obedience:</p>
<blockquote>"O my father, do as you have been commanded. You will find me, if Allāh wills, among the patient." (Qur'ān 37:102)</blockquote>
<p>As Ibrāhīm laid his son down and placed the knife, Allāh called out: <em>"O Ibrāhīm, you have fulfilled the dream!"</em> Allāh sent a <strong>ram from Jannah</strong> as a replacement sacrifice. This great event is commemorated every year during <strong>'Īd al-Aḍḥā</strong>, when Muslims around the world sacrifice an animal.</p>

<h3>Building the Ka'bah</h3>
<p>Allāh commanded Ibrāhīm and Ismā'īl عليهما السلام to build the <strong>Ka'bah</strong> — the house of Allāh in Makkah. They built it together with their own hands, stone by stone. When the walls became too high, Ibrāhīm stood on a rock called <strong>Maqām Ibrāhīm</strong> (the Station of Ibrāhīm), and his footprints were miraculously preserved in the stone.</p>
<p>As they built, they made this beautiful du'ā':</p>
<blockquote>"Our Lord, accept this from us. Indeed You are the All-Hearing, the All-Knowing." (Qur'ān 2:127)</blockquote>
<p>The Ka'bah became the <strong>Qiblah</strong> — the direction all Muslims face in ṣalāh — and the destination of Ḥajj, the annual pilgrimage that Ibrāhīm himself was commanded to announce.</p>
<p>Ibrāhīm عليه السلام is given the title <strong>Khalīlullāh</strong> — the Close Friend of Allāh. His story teaches us about complete trust in Allāh, unwavering obedience, and courage in standing for the truth.</p>
      `.trim(),
      orderIndex: 3,
    },
  });

  console.log('✅ Created Unit 3: Tārīkh');
  // ──────────────────────────────────────────────
  // UNIT 4: AQĀ'ID
  // ──────────────────────────────────────────────

    const unitAqaid = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-aqaid' } },
    create: {
      slug: 'maktab-3-aqaid',
      courseId: course.id,
      title: 'Aqā\'id — Prophets, Messengers & Signs of the Last Day',
      description: 'Learn about the prophets and messengers sent by Allāh, the difference between a rasūl and a nabī, the 25 prophets mentioned in the Qur\'ān, and the minor and major signs of the Day of Judgement.',
      orderIndex: 4,
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn about:</p>
<ul>
  <li>Why Allāh sent prophets and messengers</li>
  <li>The attributes of the prophets</li>
  <li>The difference between a Rasūl and a Nabī</li>
  <li>The names of the 25 prophets mentioned in the Qur'ān</li>
  <li>The Day of Judgement and its signs</li>
</ul>

<h3>Why Did Allāh Send Prophets?</h3>
<p>Allāh created human beings to worship Him alone. However, over time, people forgot the message of Allāh and began to worship idols, the sun, the moon, and other false gods. So Allāh, out of His mercy, sent <strong>prophets and messengers</strong> to every nation to guide them back to the truth.</p>
<blockquote>"And We certainly sent into every nation a messenger, saying: 'Worship Allāh and avoid false gods.'" (Qur'ān 16:36)</blockquote>

<h3>Attributes of the Prophets</h3>
<p>All prophets share certain qualities:</p>
<ul>
  <li><strong>Ṣidq</strong> — They are always truthful and never lie.</li>
  <li><strong>Amānah</strong> — They are completely trustworthy.</li>
  <li><strong>Tablīgh</strong> — They convey the message of Allāh without hiding anything.</li>
  <li><strong>Faṭānah</strong> — They are intelligent and wise.</li>
  <li><strong>'Iṣmah</strong> — They are protected from committing major sins.</li>
</ul>
<p>Prophets are human beings — they eat, drink, sleep, and feel pain. But they are the <strong>best of all human beings</strong>, chosen by Allāh for this great responsibility.</p>

<h3>Rasūl vs Nabī</h3>
<p>There is an important difference between a <strong>Rasūl</strong> (Messenger) and a <strong>Nabī</strong> (Prophet):</p>
<ul>
  <li>A <strong>Rasūl</strong> is given a new book or scripture and new laws by Allāh.</li>
  <li>A <strong>Nabī</strong> follows the book and law of the previous Rasūl.</li>
</ul>
<p><strong>Every Rasūl is a Nabī, but not every Nabī is a Rasūl.</strong></p>
<p>For example, Mūsā عليه السلام was a Rasūl because he was given the Tawrāh. Hārūn عليه السلام was a Nabī who followed the law of Mūsā.</p>

<h3>The First and Last Prophet</h3>
<p>The <strong>first prophet</strong> was <strong>Ādam عليه السلام</strong> — the first human being created by Allāh.</p>
<p>The <strong>last and final prophet</strong> was <strong>Muḥammad ﷺ</strong> — the Seal of the Prophets (Khātamun Nabiyyīn). There will be no more prophets or messengers after him. Anyone who claims prophethood after Muḥammad ﷺ is a liar.</p>

<h3>The 25 Prophets Mentioned in the Qur'ān</h3>
<p>Although Allāh sent approximately 124,000 prophets throughout history, <strong>25 are mentioned by name in the Qur'ān</strong>:</p>
<ol>
  <li>Ādam</li>
  <li>Idrīs</li>
  <li>Nūḥ</li>
  <li>Hūd</li>
  <li>Ṣāliḥ</li>
  <li>Ibrāhīm</li>
  <li>Lūṭ</li>
  <li>Ismā'īl</li>
  <li>Isḥāq</li>
  <li>Ya'qūb</li>
  <li>Yūsuf</li>
  <li>Shu'ayb</li>
  <li>Ayyūb</li>
  <li>Dhul Kifl</li>
  <li>Mūsā</li>
  <li>Hārūn</li>
  <li>Dāwūd</li>
  <li>Sulaymān</li>
  <li>Ilyās</li>
  <li>Al-Yasa'</li>
  <li>Yūnus</li>
  <li>Zakariyyā</li>
  <li>Yaḥyā</li>
  <li>'Īsā</li>
  <li>Muḥammad ﷺ</li>
</ol>

<h3>The Day of Judgement (Yawmul Qiyāmah)</h3>
<p>One of the core beliefs of Islam is that this world will come to an end and everyone will be brought back to life to answer for their deeds. This day is known as <strong>Yawmul Qiyāmah</strong> — the Day of Judgement, the Day of Standing, the Last Day.</p>
<p>Before that Day comes, there will be certain <strong>signs</strong> that will appear. These are divided into <strong>minor signs</strong> and <strong>major signs</strong>.</p>

<h3>Minor Signs of the Day of Judgement</h3>
<p>These are signs that gradually appear over time. Many of them have already appeared:</p>
<ul>
  <li>Knowledge of dīn will decrease and ignorance will spread.</li>
  <li>There will be a decrease in modesty (ḥayā').</li>
  <li>Cheating and dishonesty in trade will be common.</li>
  <li>People will disobey their parents.</li>
  <li>Voices will be raised in the masājid (mosques).</li>
  <li>Leaders will be the worst of people.</li>
  <li>People will consume alcohol openly.</li>
  <li>Truthful people will be called liars, and liars will be trusted.</li>
  <li>Time will pass very quickly.</li>
  <li>Music and musical instruments will be widespread.</li>
  <li>Killing will increase.</li>
  <li>People will compete in building tall buildings.</li>
  <li>There will be great earthquakes.</li>
  <li>Men will imitate women and women will imitate men.</li>
  <li>Children will be disrespectful to their elders.</li>
</ul>

<h3>Major Signs of the Day of Judgement</h3>
<p>These are extraordinary events that will occur close to the end of the world:</p>
<ol>
  <li><strong>The Mahdī</strong> — A righteous leader from the family of the Prophet ﷺ who will fill the earth with justice.</li>
  <li><strong>The Dajjāl</strong> — A great deceiver who will appear and claim to be God. He will have one eye and the word "Kāfir" will be written on his forehead.</li>
  <li><strong>The Return of 'Īsā عليه السلام</strong> — Prophet 'Īsā will descend from the heavens, defeat the Dajjāl, and establish justice on earth.</li>
  <li><strong>Ya'jūj and Ma'jūj (Gog and Magog)</strong> — Destructive nations that will be released and cause great havoc.</li>
  <li><strong>Three Major Landslides</strong> — One in the East, one in the West, and one in the Arabian Peninsula.</li>
  <li><strong>A Great Smoke (Dukhān)</strong> — A smoke that will cover the entire earth.</li>
  <li><strong>The Beast (Dābbah)</strong> — A creature that will emerge from the earth and speak to people.</li>
  <li><strong>The Sun Rising from the West</strong> — After this, repentance will no longer be accepted.</li>
  <li><strong>A Great Fire</strong> — A fire that will drive people to the place of gathering.</li>
  <li><strong>A Pleasant Wind</strong> — A gentle wind will take the souls of all believers before the final Hour arrives.</li>
</ol>
      `.trim(),
    },
    update: {
      title: 'Aqā\'id — Prophets, Messengers & Signs of the Last Day',
      description: 'Learn about the prophets and messengers sent by Allāh, the difference between a rasūl and a nabī, the 25 prophets mentioned in the Qur\'ān, and the minor and major signs of the Day of Judgement.',
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn about:</p>
<ul>
  <li>Why Allāh sent prophets and messengers</li>
  <li>The attributes of the prophets</li>
  <li>The difference between a Rasūl and a Nabī</li>
  <li>The names of the 25 prophets mentioned in the Qur'ān</li>
  <li>The Day of Judgement and its signs</li>
</ul>

<h3>Why Did Allāh Send Prophets?</h3>
<p>Allāh created human beings to worship Him alone. However, over time, people forgot the message of Allāh and began to worship idols, the sun, the moon, and other false gods. So Allāh, out of His mercy, sent <strong>prophets and messengers</strong> to every nation to guide them back to the truth.</p>
<blockquote>"And We certainly sent into every nation a messenger, saying: 'Worship Allāh and avoid false gods.'" (Qur'ān 16:36)</blockquote>

<h3>Attributes of the Prophets</h3>
<p>All prophets share certain qualities:</p>
<ul>
  <li><strong>Ṣidq</strong> — They are always truthful and never lie.</li>
  <li><strong>Amānah</strong> — They are completely trustworthy.</li>
  <li><strong>Tablīgh</strong> — They convey the message of Allāh without hiding anything.</li>
  <li><strong>Faṭānah</strong> — They are intelligent and wise.</li>
  <li><strong>'Iṣmah</strong> — They are protected from committing major sins.</li>
</ul>
<p>Prophets are human beings — they eat, drink, sleep, and feel pain. But they are the <strong>best of all human beings</strong>, chosen by Allāh for this great responsibility.</p>

<h3>Rasūl vs Nabī</h3>
<p>There is an important difference between a <strong>Rasūl</strong> (Messenger) and a <strong>Nabī</strong> (Prophet):</p>
<ul>
  <li>A <strong>Rasūl</strong> is given a new book or scripture and new laws by Allāh.</li>
  <li>A <strong>Nabī</strong> follows the book and law of the previous Rasūl.</li>
</ul>
<p><strong>Every Rasūl is a Nabī, but not every Nabī is a Rasūl.</strong></p>
<p>For example, Mūsā عليه السلام was a Rasūl because he was given the Tawrāh. Hārūn عليه السلام was a Nabī who followed the law of Mūsā.</p>

<h3>The First and Last Prophet</h3>
<p>The <strong>first prophet</strong> was <strong>Ādam عليه السلام</strong> — the first human being created by Allāh.</p>
<p>The <strong>last and final prophet</strong> was <strong>Muḥammad ﷺ</strong> — the Seal of the Prophets (Khātamun Nabiyyīn). There will be no more prophets or messengers after him. Anyone who claims prophethood after Muḥammad ﷺ is a liar.</p>

<h3>The 25 Prophets Mentioned in the Qur'ān</h3>
<p>Although Allāh sent approximately 124,000 prophets throughout history, <strong>25 are mentioned by name in the Qur'ān</strong>:</p>
<ol>
  <li>Ādam</li>
  <li>Idrīs</li>
  <li>Nūḥ</li>
  <li>Hūd</li>
  <li>Ṣāliḥ</li>
  <li>Ibrāhīm</li>
  <li>Lūṭ</li>
  <li>Ismā'īl</li>
  <li>Isḥāq</li>
  <li>Ya'qūb</li>
  <li>Yūsuf</li>
  <li>Shu'ayb</li>
  <li>Ayyūb</li>
  <li>Dhul Kifl</li>
  <li>Mūsā</li>
  <li>Hārūn</li>
  <li>Dāwūd</li>
  <li>Sulaymān</li>
  <li>Ilyās</li>
  <li>Al-Yasa'</li>
  <li>Yūnus</li>
  <li>Zakariyyā</li>
  <li>Yaḥyā</li>
  <li>'Īsā</li>
  <li>Muḥammad ﷺ</li>
</ol>

<h3>The Day of Judgement (Yawmul Qiyāmah)</h3>
<p>One of the core beliefs of Islam is that this world will come to an end and everyone will be brought back to life to answer for their deeds. This day is known as <strong>Yawmul Qiyāmah</strong> — the Day of Judgement, the Day of Standing, the Last Day.</p>
<p>Before that Day comes, there will be certain <strong>signs</strong> that will appear. These are divided into <strong>minor signs</strong> and <strong>major signs</strong>.</p>

<h3>Minor Signs of the Day of Judgement</h3>
<p>These are signs that gradually appear over time. Many of them have already appeared:</p>
<ul>
  <li>Knowledge of dīn will decrease and ignorance will spread.</li>
  <li>There will be a decrease in modesty (ḥayā').</li>
  <li>Cheating and dishonesty in trade will be common.</li>
  <li>People will disobey their parents.</li>
  <li>Voices will be raised in the masājid (mosques).</li>
  <li>Leaders will be the worst of people.</li>
  <li>People will consume alcohol openly.</li>
  <li>Truthful people will be called liars, and liars will be trusted.</li>
  <li>Time will pass very quickly.</li>
  <li>Music and musical instruments will be widespread.</li>
  <li>Killing will increase.</li>
  <li>People will compete in building tall buildings.</li>
  <li>There will be great earthquakes.</li>
  <li>Men will imitate women and women will imitate men.</li>
  <li>Children will be disrespectful to their elders.</li>
</ul>

<h3>Major Signs of the Day of Judgement</h3>
<p>These are extraordinary events that will occur close to the end of the world:</p>
<ol>
  <li><strong>The Mahdī</strong> — A righteous leader from the family of the Prophet ﷺ who will fill the earth with justice.</li>
  <li><strong>The Dajjāl</strong> — A great deceiver who will appear and claim to be God. He will have one eye and the word "Kāfir" will be written on his forehead.</li>
  <li><strong>The Return of 'Īsā عليه السلام</strong> — Prophet 'Īsā will descend from the heavens, defeat the Dajjāl, and establish justice on earth.</li>
  <li><strong>Ya'jūj and Ma'jūj (Gog and Magog)</strong> — Destructive nations that will be released and cause great havoc.</li>
  <li><strong>Three Major Landslides</strong> — One in the East, one in the West, and one in the Arabian Peninsula.</li>
  <li><strong>A Great Smoke (Dukhān)</strong> — A smoke that will cover the entire earth.</li>
  <li><strong>The Beast (Dābbah)</strong> — A creature that will emerge from the earth and speak to people.</li>
  <li><strong>The Sun Rising from the West</strong> — After this, repentance will no longer be accepted.</li>
  <li><strong>A Great Fire</strong> — A fire that will drive people to the place of gathering.</li>
  <li><strong>A Pleasant Wind</strong> — A gentle wind will take the souls of all believers before the final Hour arrives.</li>
</ol>
      `.trim(),
      orderIndex: 4,
    },
  });

  console.log('✅ Created Unit 4: Aqā\'id');
  // ──────────────────────────────────────────────
  // UNIT 5: AKHLĀQ
  // ──────────────────────────────────────────────

    const unitAkhlaq = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-akhlaq' } },
    create: {
      slug: 'maktab-3-akhlaq',
      courseId: course.id,
      title: 'Akhlāq — Good Character & Avoiding Sin',
      description: 'Learn about thinking good of others, sharing, kindness to parents, speaking the truth, saying a good word or keeping silent, and the dangers of ghībah (backbiting).',
      orderIndex: 5,
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn about:</p>
<ul>
  <li>Ḥusn al-Ẓann — thinking good of others</li>
  <li>Thinking good of Allāh</li>
  <li>The importance of sharing with others</li>
  <li>Kindness and obedience to parents</li>
  <li>Speaking the truth</li>
  <li>Saying a good word or remaining silent</li>
  <li>The evil of ghībah (backbiting)</li>
</ul>

<h3>Ḥusn al-Ẓann — Thinking Good of Others</h3>
<p>Allāh says in the Qur'ān:</p>
<p class="arabic" dir="rtl" lang="ar">يَا أَيُّهَا الَّذِينَ آمَنُوا اجْتَنِبُوا كَثِيرًا مِّنَ الظَّنِّ إِنَّ بَعْضَ الظَّنِّ إِثْمٌ</p>
<blockquote>"O you who believe, abstain from much suspicion. Indeed, some suspicions are sins." (Qur'ān 49:12)</blockquote>
<p>We should always think the best of others. If we see someone doing something, we should not jump to conclusions or assume the worst. Bad suspicion (sū' al-ẓann) leads to <strong>spying (tajassus)</strong> and <strong>backbiting (ghībah)</strong> — both of which are serious sins in Islam.</p>

<h3>Thinking Good of Allāh</h3>
<p>We should also have good thoughts about Allāh at all times. If something bad happens, we should not blame Allāh or question His wisdom. Everything that happens is part of Allāh's perfect plan. Rasūlullāh ﷺ said that Allāh says: <em>"I am as My servant thinks of Me."</em> If we think well of Allāh, we will find goodness.</p>

<h3>Sharing with Others</h3>
<p>Allāh says:</p>
<blockquote>"You shall never attain righteousness unless you spend from what you love." (Qur'ān 3:92)</blockquote>
<p>And Allāh praises the Anṣār of Madīnah:</p>
<blockquote>"They give preference to others over themselves, even though they themselves are in need." (Qur'ān 59:9)</blockquote>
<p>Sharing is not just about giving away things we don't need — it means giving from what we love, whether it is our favourite food, our time, or our help. The Companions used to share everything they had.</p>
<p><strong>Story:</strong> During a famine, a man came to the Prophet ﷺ asking for food. The Prophet ﷺ asked his wives, but they had nothing except water. He asked: "Who will host this man tonight?" One of the Anṣār took the man home. His wife whispered that they only had enough food for the children. The man said: "Put the children to sleep and dim the lamp. We will pretend to eat." In the morning, Rasūlullāh ﷺ said: "Allāh was amazed by your action last night."</p>

<h3>Kindness to Parents</h3>
<p>Allāh says:</p>
<p class="arabic" dir="rtl" lang="ar">وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا</p>
<blockquote>"Your Lord has decreed that you worship none but Him, and that you be kind to your parents." (Qur'ān 17:23)</blockquote>
<p>Notice that Allāh placed <strong>kindness to parents immediately after His own rights</strong>. This shows how important parents are in Islam. Allāh continues:</p>
<blockquote>"If one or both of them reach old age with you, do not say to them 'uff' (a word of annoyance), and do not repel them, but speak to them a noble word." (Qur'ān 17:23)</blockquote>
<p>Even saying <strong>"uff"</strong> to your parents is forbidden! We must speak to them with respect, serve them with love, and make du'ā' for them.</p>
<p>When a man asked Rasūlullāh ﷺ who deserves the finest treatment, he said: <em>"Your mother."</em> The man asked: "Then who?" He said: <em>"Your mother."</em> The man asked again: "Then who?" He said: <em>"Your mother."</em> The man asked a fourth time: "Then who?" He said: <em>"Your father."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Speaking the Truth</h3>
<p>Allāh says:</p>
<blockquote>"O you who believe, fear Allāh and be with those who are truthful." (Qur'ān 9:119)</blockquote>
<p>Rasūlullāh ﷺ said:</p>
<blockquote>"Truthfulness leads to good and good leads to Jannah. A person continues to be truthful until he is registered as truthful (ṣiddīq) in the sight of Allāh. And lying leads to evil and evil leads to Jahannam. A person continues to lie until he is registered as a liar in the sight of Allāh." (Ṣaḥīḥ al-Bukhārī)</blockquote>

<p><strong>Story of the Emperor and the Seeds:</strong> An old Emperor needed to choose a successor. He gave every child a seed and said: "Whoever grows the best plant in six months will be the next Emperor." A boy named Ling tried everything, but his seed never grew. After six months, all the other children brought beautiful plants, but Ling came with his empty pot, close to tears. The Emperor smiled and said: "I boiled all the seeds — none of them could grow. Everyone else replaced their seeds, but Ling was the only honest one." Ling was chosen as the next Emperor because of his <strong>honesty</strong>.</p>

<h3>Saying a Good Word</h3>
<p>Allāh says:</p>
<blockquote>"Not a word does a person utter except that there is an observer (angel) ready to record it." (Qur'ān 50:18)</blockquote>
<p>Rasūlullāh ﷺ said:</p>
<blockquote>"Whoever believes in Allāh and the Last Day should speak a good word or remain silent." (Ṣaḥīḥ al-Bukhārī)</blockquote>
<p>Every word we say is recorded by the angels. A single bad word can lead a person to Jahannam. A single good word can lead a person to Jannah. Before speaking, we should think: Is it true? Is it kind? Is it necessary? If not, it is better to remain silent.</p>

<h3>Ghībah (Backbiting)</h3>
<p>Allāh says:</p>
<blockquote>"Do not backbite one another. Does one of you like that he eats the flesh of his dead brother? You would hate it!" (Qur'ān 49:12)</blockquote>
<p>Ghībah means speaking about a Muslim behind their back in a way they would dislike — even if what you say is true. If it is not true, it is even worse — that is called <strong>buhtān</strong> (slander).</p>
<p>Rasūlullāh ﷺ asked the Companions: <em>"Do you know who the bankrupt person is?"</em> They said: "The one who has no money." He said: <em>"The bankrupt person from my Ummah is the one who comes on the Day of Qiyāmah with ṣalāh, fasting, and zakāh, but he insulted this person, slandered that person, stole the wealth of another, shed the blood of another, and struck yet another. So his good deeds will be given to each of them. And if his good deeds run out before the score is settled, their sins will be thrown onto him, and he will be thrown into the Fire."</em> (Ṣaḥīḥ Muslim)</p>
      `.trim(),
    },
    update: {
      title: 'Akhlāq — Good Character & Avoiding Sin',
      description: 'Learn about thinking good of others, sharing, kindness to parents, speaking the truth, saying a good word or keeping silent, and the dangers of ghībah (backbiting).',
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn about:</p>
<ul>
  <li>Ḥusn al-Ẓann — thinking good of others</li>
  <li>Thinking good of Allāh</li>
  <li>The importance of sharing with others</li>
  <li>Kindness and obedience to parents</li>
  <li>Speaking the truth</li>
  <li>Saying a good word or remaining silent</li>
  <li>The evil of ghībah (backbiting)</li>
</ul>

<h3>Ḥusn al-Ẓann — Thinking Good of Others</h3>
<p>Allāh says in the Qur'ān:</p>
<p class="arabic" dir="rtl" lang="ar">يَا أَيُّهَا الَّذِينَ آمَنُوا اجْتَنِبُوا كَثِيرًا مِّنَ الظَّنِّ إِنَّ بَعْضَ الظَّنِّ إِثْمٌ</p>
<blockquote>"O you who believe, abstain from much suspicion. Indeed, some suspicions are sins." (Qur'ān 49:12)</blockquote>
<p>We should always think the best of others. If we see someone doing something, we should not jump to conclusions or assume the worst. Bad suspicion (sū' al-ẓann) leads to <strong>spying (tajassus)</strong> and <strong>backbiting (ghībah)</strong> — both of which are serious sins in Islam.</p>

<h3>Thinking Good of Allāh</h3>
<p>We should also have good thoughts about Allāh at all times. If something bad happens, we should not blame Allāh or question His wisdom. Everything that happens is part of Allāh's perfect plan. Rasūlullāh ﷺ said that Allāh says: <em>"I am as My servant thinks of Me."</em> If we think well of Allāh, we will find goodness.</p>

<h3>Sharing with Others</h3>
<p>Allāh says:</p>
<blockquote>"You shall never attain righteousness unless you spend from what you love." (Qur'ān 3:92)</blockquote>
<p>And Allāh praises the Anṣār of Madīnah:</p>
<blockquote>"They give preference to others over themselves, even though they themselves are in need." (Qur'ān 59:9)</blockquote>
<p>Sharing is not just about giving away things we don't need — it means giving from what we love, whether it is our favourite food, our time, or our help. The Companions used to share everything they had.</p>
<p><strong>Story:</strong> During a famine, a man came to the Prophet ﷺ asking for food. The Prophet ﷺ asked his wives, but they had nothing except water. He asked: "Who will host this man tonight?" One of the Anṣār took the man home. His wife whispered that they only had enough food for the children. The man said: "Put the children to sleep and dim the lamp. We will pretend to eat." In the morning, Rasūlullāh ﷺ said: "Allāh was amazed by your action last night."</p>

<h3>Kindness to Parents</h3>
<p>Allāh says:</p>
<p class="arabic" dir="rtl" lang="ar">وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا</p>
<blockquote>"Your Lord has decreed that you worship none but Him, and that you be kind to your parents." (Qur'ān 17:23)</blockquote>
<p>Notice that Allāh placed <strong>kindness to parents immediately after His own rights</strong>. This shows how important parents are in Islam. Allāh continues:</p>
<blockquote>"If one or both of them reach old age with you, do not say to them 'uff' (a word of annoyance), and do not repel them, but speak to them a noble word." (Qur'ān 17:23)</blockquote>
<p>Even saying <strong>"uff"</strong> to your parents is forbidden! We must speak to them with respect, serve them with love, and make du'ā' for them.</p>
<p>When a man asked Rasūlullāh ﷺ who deserves the finest treatment, he said: <em>"Your mother."</em> The man asked: "Then who?" He said: <em>"Your mother."</em> The man asked again: "Then who?" He said: <em>"Your mother."</em> The man asked a fourth time: "Then who?" He said: <em>"Your father."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Speaking the Truth</h3>
<p>Allāh says:</p>
<blockquote>"O you who believe, fear Allāh and be with those who are truthful." (Qur'ān 9:119)</blockquote>
<p>Rasūlullāh ﷺ said:</p>
<blockquote>"Truthfulness leads to good and good leads to Jannah. A person continues to be truthful until he is registered as truthful (ṣiddīq) in the sight of Allāh. And lying leads to evil and evil leads to Jahannam. A person continues to lie until he is registered as a liar in the sight of Allāh." (Ṣaḥīḥ al-Bukhārī)</blockquote>

<p><strong>Story of the Emperor and the Seeds:</strong> An old Emperor needed to choose a successor. He gave every child a seed and said: "Whoever grows the best plant in six months will be the next Emperor." A boy named Ling tried everything, but his seed never grew. After six months, all the other children brought beautiful plants, but Ling came with his empty pot, close to tears. The Emperor smiled and said: "I boiled all the seeds — none of them could grow. Everyone else replaced their seeds, but Ling was the only honest one." Ling was chosen as the next Emperor because of his <strong>honesty</strong>.</p>

<h3>Saying a Good Word</h3>
<p>Allāh says:</p>
<blockquote>"Not a word does a person utter except that there is an observer (angel) ready to record it." (Qur'ān 50:18)</blockquote>
<p>Rasūlullāh ﷺ said:</p>
<blockquote>"Whoever believes in Allāh and the Last Day should speak a good word or remain silent." (Ṣaḥīḥ al-Bukhārī)</blockquote>
<p>Every word we say is recorded by the angels. A single bad word can lead a person to Jahannam. A single good word can lead a person to Jannah. Before speaking, we should think: Is it true? Is it kind? Is it necessary? If not, it is better to remain silent.</p>

<h3>Ghībah (Backbiting)</h3>
<p>Allāh says:</p>
<blockquote>"Do not backbite one another. Does one of you like that he eats the flesh of his dead brother? You would hate it!" (Qur'ān 49:12)</blockquote>
<p>Ghībah means speaking about a Muslim behind their back in a way they would dislike — even if what you say is true. If it is not true, it is even worse — that is called <strong>buhtān</strong> (slander).</p>
<p>Rasūlullāh ﷺ asked the Companions: <em>"Do you know who the bankrupt person is?"</em> They said: "The one who has no money." He said: <em>"The bankrupt person from my Ummah is the one who comes on the Day of Qiyāmah with ṣalāh, fasting, and zakāh, but he insulted this person, slandered that person, stole the wealth of another, shed the blood of another, and struck yet another. So his good deeds will be given to each of them. And if his good deeds run out before the score is settled, their sins will be thrown onto him, and he will be thrown into the Fire."</em> (Ṣaḥīḥ Muslim)</p>
      `.trim(),
      orderIndex: 5,
    },
  });

  console.log('✅ Created Unit 5: Akhlāq');
  // ──────────────────────────────────────────────
  // UNIT 6: ĀDĀB
  // ──────────────────────────────────────────────

    const unitAdab = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-adab' } },
    create: {
      slug: 'maktab-3-adab',
      courseId: course.id,
      title: 'Ādāb — Etiquette of Travelling, Studying, Qur\'ān, Walking & the Masjid',
      description: 'Learn the Islamic etiquette of travelling, studying, reciting the Qur\'ān, walking, and visiting the masjid.',
      orderIndex: 6,
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn the Islamic etiquettes (ādāb) of:</p>
<ul>
  <li>Travelling</li>
  <li>Studying and seeking knowledge</li>
  <li>Reciting the Qur'ān</li>
  <li>Walking</li>
  <li>Visiting the masjid</li>
</ul>

<h3>Ādāb of Travelling</h3>
<p>Islam teaches us the proper etiquettes for every aspect of life, including travelling:</p>
<ul>
  <li><strong>Pray 2 rak'āt</strong> before departing on your journey.</li>
  <li><strong>Travel in a group</strong> and not alone (unless absolutely necessary).</li>
  <li><strong>Appoint an amīr</strong> (leader) when travelling in a group.</li>
  <li><strong>Recite the du'ā' of travel</strong> when setting off.</li>
  <li><strong>Share provisions</strong> with your travel companions.</li>
  <li>Be patient and do not complain during the journey.</li>
  <li><strong>Make du'ā'</strong> during travel, as the du'ā' of a traveller is accepted.</li>
  <li>Return home promptly after completing your purpose of travel.</li>
</ul>

<h3>Ādāb of Studying</h3>
<p>Seeking knowledge is one of the greatest acts of worship in Islam. Allāh warns in the Qur'ān about those who have knowledge but do not practise it:</p>
<p class="arabic" dir="rtl" lang="ar">مَثَلُ الَّذِينَ حُمِّلُوا التَّوْرَاةَ ثُمَّ لَمْ يَحْمِلُوهَا كَمَثَلِ الْحِمَارِ يَحْمِلُ أَسْفَارًا</p>
<blockquote>"The example of those who were given the Torah and then did not practise it is like a donkey that carries a load of books." (Qur'ān 62:5)</blockquote>
<p>The ādāb of studying include:</p>
<ul>
  <li><strong>Make the correct intention</strong> — study to please Allāh, not for fame or wealth.</li>
  <li><strong>Respect your teacher</strong> — sit properly, listen attentively, and do not interrupt.</li>
  <li><strong>Respect your books</strong> — do not place them on the floor, do not write in them unnecessarily, and do not damage them.</li>
  <li><strong>Listen attentively</strong> during lessons and take notes.</li>
  <li><strong>Revise</strong> what you have learned after each lesson.</li>
  <li><strong>Ask questions</strong> when you do not understand something.</li>
  <li>Most importantly — <strong>practise what you learn</strong>. Knowledge without practice is like a tree without fruit.</li>
</ul>

<h3>Ādāb of Reciting the Qur'ān</h3>
<p>The Qur'ān is the word of Allāh, and it deserves the utmost respect:</p>
<ul>
  <li><strong>Perform wuḍū'</strong> before touching the Qur'ān.</li>
  <li><strong>Use miswāk</strong> to clean your mouth before reciting.</li>
  <li><strong>Sit respectfully</strong> — preferably facing the Qiblah.</li>
  <li>Recite <strong>Ta'awwudh</strong> ("A'ūdhu billāhi minash-shayṭānir-rajīm") and <strong>Tasmiyah</strong> ("Bismillāhir-Raḥmānir-Raḥīm") before beginning.</li>
  <li>Recite with <strong>tajwīd</strong> (proper pronunciation and rules).</li>
  <li>Recite with focus, concentration, and humility.</li>
  <li><strong>Never place other books on top</strong> of the Qur'ān.</li>
  <li>Place the Qur'ān on a pillow or Qur'ān stand (riḥl) when not holding it.</li>
  <li>Do not talk about worldly matters while the Qur'ān is open.</li>
</ul>

<h3>Ādāb of Walking</h3>
<p>Allāh says in the Qur'ān:</p>
<blockquote>"And do not turn your face away from people with pride, and do not walk on the earth arrogantly. Indeed, Allāh does not like anyone who is arrogant and boastful. Be moderate in your walking and lower your voice." (Qur'ān 31:18-19)</blockquote>
<blockquote>"And do not walk on the earth with pride. Indeed, you can neither tear apart the earth nor can you reach the mountains in height." (Qur'ān 17:37)</blockquote>
<p>The ādāb of walking include:</p>
<ul>
  <li><strong>Walk humbly</strong> — do not walk with arrogance or pride.</li>
  <li>Walk at a <strong>brisk, moderate pace</strong> — not too fast, not too slow.</li>
  <li><strong>Lower your gaze</strong> and avoid staring at others.</li>
  <li><strong>Spread salām</strong> to those you meet.</li>
  <li><strong>Remove harmful objects</strong> from the road — this is a form of charity.</li>
  <li>Walk on the <strong>right side</strong> of the road.</li>
</ul>
<p>According to the <strong>Shamā'il of Tirmidhī</strong>, the Prophet ﷺ walked with determination, lifting his legs with strength, leaning slightly forward, placing his feet softly, at a quick pace without small steps.</p>

<h3>Ādāb of the Masjid</h3>
<p>Allāh says:</p>
<blockquote>"And the masājid (mosques) are for Allāh alone, so do not call upon anyone along with Allāh." (Qur'ān 72:18)</blockquote>
<p>The masjid is the house of Allāh and deserves the utmost respect:</p>
<ul>
  <li><strong>Dress well and cleanly</strong> before going to the masjid.</li>
  <li>Apply <strong>iṭr (perfume)</strong> if possible.</li>
  <li><strong>Enter with the right foot</strong> and recite the du'ā': <em>"Allāhummaf-taḥ lī abwāba raḥmatik"</em> (O Allāh, open for me doors of Your mercy).</li>
  <li>Pray <strong>Taḥiyyatul Masjid</strong> — two rak'āt upon entering.</li>
  <li><strong>Remain silent</strong> and spend your time in dhikr, Qur'ān recitation, and du'ā'.</li>
  <li><strong>Do not talk about worldly matters</strong> inside the masjid.</li>
  <li>Do not buy or sell inside the masjid.</li>
  <li><strong>Leave with the left foot</strong> and recite the du'ā': <em>"Allāhumma innī as'aluka min faḍlik"</em> (O Allāh, I ask You from Your bounty).</li>
  <li>Answer the <strong>adhān</strong> by repeating the words quietly.</li>
</ul>
      `.trim(),
    },
    update: {
      title: 'Ādāb — Etiquette of Travelling, Studying, Qur\'ān, Walking & the Masjid',
      description: 'Learn the Islamic etiquette of travelling, studying, reciting the Qur\'ān, walking, and visiting the masjid.',
      content: `
<h2>Learning Objectives</h2>
<p>In this unit, you will learn the Islamic etiquettes (ādāb) of:</p>
<ul>
  <li>Travelling</li>
  <li>Studying and seeking knowledge</li>
  <li>Reciting the Qur'ān</li>
  <li>Walking</li>
  <li>Visiting the masjid</li>
</ul>

<h3>Ādāb of Travelling</h3>
<p>Islam teaches us the proper etiquettes for every aspect of life, including travelling:</p>
<ul>
  <li><strong>Pray 2 rak'āt</strong> before departing on your journey.</li>
  <li><strong>Travel in a group</strong> and not alone (unless absolutely necessary).</li>
  <li><strong>Appoint an amīr</strong> (leader) when travelling in a group.</li>
  <li><strong>Recite the du'ā' of travel</strong> when setting off.</li>
  <li><strong>Share provisions</strong> with your travel companions.</li>
  <li>Be patient and do not complain during the journey.</li>
  <li><strong>Make du'ā'</strong> during travel, as the du'ā' of a traveller is accepted.</li>
  <li>Return home promptly after completing your purpose of travel.</li>
</ul>

<h3>Ādāb of Studying</h3>
<p>Seeking knowledge is one of the greatest acts of worship in Islam. Allāh warns in the Qur'ān about those who have knowledge but do not practise it:</p>
<p class="arabic" dir="rtl" lang="ar">مَثَلُ الَّذِينَ حُمِّلُوا التَّوْرَاةَ ثُمَّ لَمْ يَحْمِلُوهَا كَمَثَلِ الْحِمَارِ يَحْمِلُ أَسْفَارًا</p>
<blockquote>"The example of those who were given the Torah and then did not practise it is like a donkey that carries a load of books." (Qur'ān 62:5)</blockquote>
<p>The ādāb of studying include:</p>
<ul>
  <li><strong>Make the correct intention</strong> — study to please Allāh, not for fame or wealth.</li>
  <li><strong>Respect your teacher</strong> — sit properly, listen attentively, and do not interrupt.</li>
  <li><strong>Respect your books</strong> — do not place them on the floor, do not write in them unnecessarily, and do not damage them.</li>
  <li><strong>Listen attentively</strong> during lessons and take notes.</li>
  <li><strong>Revise</strong> what you have learned after each lesson.</li>
  <li><strong>Ask questions</strong> when you do not understand something.</li>
  <li>Most importantly — <strong>practise what you learn</strong>. Knowledge without practice is like a tree without fruit.</li>
</ul>

<h3>Ādāb of Reciting the Qur'ān</h3>
<p>The Qur'ān is the word of Allāh, and it deserves the utmost respect:</p>
<ul>
  <li><strong>Perform wuḍū'</strong> before touching the Qur'ān.</li>
  <li><strong>Use miswāk</strong> to clean your mouth before reciting.</li>
  <li><strong>Sit respectfully</strong> — preferably facing the Qiblah.</li>
  <li>Recite <strong>Ta'awwudh</strong> ("A'ūdhu billāhi minash-shayṭānir-rajīm") and <strong>Tasmiyah</strong> ("Bismillāhir-Raḥmānir-Raḥīm") before beginning.</li>
  <li>Recite with <strong>tajwīd</strong> (proper pronunciation and rules).</li>
  <li>Recite with focus, concentration, and humility.</li>
  <li><strong>Never place other books on top</strong> of the Qur'ān.</li>
  <li>Place the Qur'ān on a pillow or Qur'ān stand (riḥl) when not holding it.</li>
  <li>Do not talk about worldly matters while the Qur'ān is open.</li>
</ul>

<h3>Ādāb of Walking</h3>
<p>Allāh says in the Qur'ān:</p>
<blockquote>"And do not turn your face away from people with pride, and do not walk on the earth arrogantly. Indeed, Allāh does not like anyone who is arrogant and boastful. Be moderate in your walking and lower your voice." (Qur'ān 31:18-19)</blockquote>
<blockquote>"And do not walk on the earth with pride. Indeed, you can neither tear apart the earth nor can you reach the mountains in height." (Qur'ān 17:37)</blockquote>
<p>The ādāb of walking include:</p>
<ul>
  <li><strong>Walk humbly</strong> — do not walk with arrogance or pride.</li>
  <li>Walk at a <strong>brisk, moderate pace</strong> — not too fast, not too slow.</li>
  <li><strong>Lower your gaze</strong> and avoid staring at others.</li>
  <li><strong>Spread salām</strong> to those you meet.</li>
  <li><strong>Remove harmful objects</strong> from the road — this is a form of charity.</li>
  <li>Walk on the <strong>right side</strong> of the road.</li>
</ul>
<p>According to the <strong>Shamā'il of Tirmidhī</strong>, the Prophet ﷺ walked with determination, lifting his legs with strength, leaning slightly forward, placing his feet softly, at a quick pace without small steps.</p>

<h3>Ādāb of the Masjid</h3>
<p>Allāh says:</p>
<blockquote>"And the masājid (mosques) are for Allāh alone, so do not call upon anyone along with Allāh." (Qur'ān 72:18)</blockquote>
<p>The masjid is the house of Allāh and deserves the utmost respect:</p>
<ul>
  <li><strong>Dress well and cleanly</strong> before going to the masjid.</li>
  <li>Apply <strong>iṭr (perfume)</strong> if possible.</li>
  <li><strong>Enter with the right foot</strong> and recite the du'ā': <em>"Allāhummaf-taḥ lī abwāba raḥmatik"</em> (O Allāh, open for me doors of Your mercy).</li>
  <li>Pray <strong>Taḥiyyatul Masjid</strong> — two rak'āt upon entering.</li>
  <li><strong>Remain silent</strong> and spend your time in dhikr, Qur'ān recitation, and du'ā'.</li>
  <li><strong>Do not talk about worldly matters</strong> inside the masjid.</li>
  <li>Do not buy or sell inside the masjid.</li>
  <li><strong>Leave with the left foot</strong> and recite the du'ā': <em>"Allāhumma innī as'aluka min faḍlik"</em> (O Allāh, I ask You from Your bounty).</li>
  <li>Answer the <strong>adhān</strong> by repeating the words quietly.</li>
</ul>
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
      where: { externalId: 'maktab-3-fiqh-q1' },
      create: {
        externalId: 'maktab-3-fiqh-q1',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the term "farḍ" mean in Islamic law?',
        options: JSON.stringify(['Recommended', 'Compulsory', 'Disliked', 'Forbidden']),
        correctAnswer: 'Compulsory',
        explanation: 'Farḍ means compulsory — it is something that a Muslim must do. Leaving out a farḍ act is sinful.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What does the term "farḍ" mean in Islamic law?',
        options: JSON.stringify(['Recommended', 'Compulsory', 'Disliked', 'Forbidden']),
        correctAnswer: 'Compulsory',
        explanation: 'Farḍ means compulsory — it is something that a Muslim must do. Leaving out a farḍ act is sinful.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-fiqh-q2' },
      create: {
        externalId: 'maktab-3-fiqh-q2',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is an example of Najāsah Ghalīẓah (heavy impurity)?',
        options: JSON.stringify(['Urine of ḥalāl animals', 'Dust', 'Human blood', 'Sweat']),
        correctAnswer: 'Human blood',
        explanation: 'Najāsah Ghalīẓah (heavy impurity) includes substances like human blood, urine, and stool.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'Which of the following is an example of Najāsah Ghalīẓah (heavy impurity)?',
        options: JSON.stringify(['Urine of ḥalāl animals', 'Dust', 'Human blood', 'Sweat']),
        correctAnswer: 'Human blood',
        explanation: 'Najāsah Ghalīẓah (heavy impurity) includes substances like human blood, urine, and stool.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-fiqh-q3' },
      create: {
        externalId: 'maktab-3-fiqh-q3',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many farā\'iḍ (obligatory acts) are there in ghusl?',
        options: JSON.stringify(['Two', 'Three', 'Four', 'Five']),
        correctAnswer: 'Three',
        explanation: 'The three farā\'iḍ of ghusl are: washing the entire body, gargling the mouth, and rinsing the nose.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'How many farā\'iḍ (obligatory acts) are there in ghusl?',
        options: JSON.stringify(['Two', 'Three', 'Four', 'Five']),
        correctAnswer: 'Three',
        explanation: 'The three farā\'iḍ of ghusl are: washing the entire body, gargling the mouth, and rinsing the nose.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-fiqh-q4' },
      create: {
        externalId: 'maktab-3-fiqh-q4',
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'Ṣalātul Witr is farḍ and must be prayed every night.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Ṣalātul Witr is wājib (necessary), not farḍ. It consists of three rak\'āt prayed after the farḍ of \'Ishā\'.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'Ṣalātul Witr is farḍ and must be prayed every night.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Ṣalātul Witr is wājib (necessary), not farḍ. It consists of three rak\'āt prayed after the farḍ of \'Ishā\'.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-fiqh-q5' },
      create: {
        externalId: 'maktab-3-fiqh-q5',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the minimum travel distance for Ṣalātul Qaṣr to apply?',
        options: JSON.stringify(['27 miles', '42 miles', '54 miles', '100 miles']),
        correctAnswer: '54 miles',
        explanation: 'A person who plans to travel more than 54 miles (87 km) from the boundary of their city performs qaṣr ṣalāh, shortening 4-rak\'ah farḍ prayers to 2.',
        difficulty: 'MEDIUM',
        aiGenerated: false,
      },
      update: {
        questionText: 'What is the minimum travel distance for Ṣalātul Qaṣr to apply?',
        options: JSON.stringify(['27 miles', '42 miles', '54 miles', '100 miles']),
        correctAnswer: '54 miles',
        explanation: 'A person who plans to travel more than 54 miles (87 km) from the boundary of their city performs qaṣr ṣalāh, shortening 4-rak\'ah farḍ prayers to 2.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-fiqh-q6' },
      create: {
        externalId: 'maktab-3-fiqh-q6',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is NOT a condition before ṣalāh?',
        options: JSON.stringify(['Facing the Qiblah', 'Having wuḍū\'', 'Wearing white clothes', 'Praying in the correct time']),
        correctAnswer: 'Wearing white clothes',
        explanation: 'The conditions before ṣalāh include facing the Qiblah, having wuḍū\', praying in the correct time, and ensuring cleanliness — but wearing white is not a requirement.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'Which of the following is NOT a condition before ṣalāh?',
        options: JSON.stringify(['Facing the Qiblah', 'Having wuḍū\'', 'Wearing white clothes', 'Praying in the correct time']),
        correctAnswer: 'Wearing white clothes',
        explanation: 'The conditions before ṣalāh include facing the Qiblah, having wuḍū\', praying in the correct time, and ensuring cleanliness — but wearing white is not a requirement.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-fiqh-q7' },
      create: {
        externalId: 'maktab-3-fiqh-q7',
        unitId: unitFiqh.id,
        type: 'FILL_BLANK',
        questionText: 'The six farḍ acts during ṣalāh are: Takbīr Taḥrīmah, Qiyām, Qirā\'ah, Rukū\', Sujūd, and ___.',
        options: undefined,
        correctAnswer: 'Qa\'dah Akhīrah',
        explanation: 'The sixth farḍ act in ṣalāh is Qa\'dah Akhīrah — the last sitting before salām for the duration of tashahhud.',
        difficulty: 'MEDIUM',
        aiGenerated: false,
      },
      update: {
        questionText: 'The six farḍ acts during ṣalāh are: Takbīr Taḥrīmah, Qiyām, Qirā\'ah, Rukū\', Sujūd, and ___.',
        options: undefined,
        correctAnswer: 'Qa\'dah Akhīrah',
        explanation: 'The sixth farḍ act in ṣalāh is Qa\'dah Akhīrah — the last sitting before salām for the duration of tashahhud.',
        difficulty: 'MEDIUM',
      },
    })
  ]);

  // --- Aḥādīth Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-3-ahadith-q1' },
      create: {
        externalId: 'maktab-3-ahadith-q1',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth, "Ṣalāh is a pillar of ___."',
        options: JSON.stringify(['Islām', 'Dīn', 'Jannah', 'Du\'ā\'']),
        correctAnswer: 'Dīn',
        explanation: 'Rasūlullāh ﷺ said: "Ṣalāh is a pillar of dīn" (Bayhaqī). Just as a building cannot stand without pillars, a person cannot have dīn without ṣalāh.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'According to the ḥadīth, "Ṣalāh is a pillar of ___."',
        options: JSON.stringify(['Islām', 'Dīn', 'Jannah', 'Du\'ā\'']),
        correctAnswer: 'Dīn',
        explanation: 'Rasūlullāh ﷺ said: "Ṣalāh is a pillar of dīn" (Bayhaqī). Just as a building cannot stand without pillars, a person cannot have dīn without ṣalāh.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-ahadith-q2' },
      create: {
        externalId: 'maktab-3-ahadith-q2',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did Rasūlullāh ﷺ call du\'ā\'?',
        options: JSON.stringify(['The light of a believer', 'The weapon of a believer', 'The shield of a believer', 'The treasure of a believer']),
        correctAnswer: 'The weapon of a believer',
        explanation: '"Du\'ā\' is the weapon of a believer" (Ḥākim). Just as a weapon protects from enemies, du\'ā\' protects the believer.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What did Rasūlullāh ﷺ call du\'ā\'?',
        options: JSON.stringify(['The light of a believer', 'The weapon of a believer', 'The shield of a believer', 'The treasure of a believer']),
        correctAnswer: 'The weapon of a believer',
        explanation: '"Du\'ā\' is the weapon of a believer" (Ḥākim). Just as a weapon protects from enemies, du\'ā\' protects the believer.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-ahadith-q3' },
      create: {
        externalId: 'maktab-3-ahadith-q3',
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'According to the ḥadīth, this world is described as a paradise for the believer.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Rasūlullāh ﷺ said: "The world is a prison for a believer and a paradise for a disbeliever" (Ṣaḥīḥ Muslim). A Muslim cannot have everything they want in this world.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'According to the ḥadīth, this world is described as a paradise for the believer.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Rasūlullāh ﷺ said: "The world is a prison for a believer and a paradise for a disbeliever" (Ṣaḥīḥ Muslim). A Muslim cannot have everything they want in this world.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-ahadith-q4' },
      create: {
        externalId: 'maktab-3-ahadith-q4',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the "best du\'ā\'" according to the ḥadīth reported in Tirmidhī?',
        options: JSON.stringify(['Subḥānallāh', 'Astaghfirullāh', 'Alḥamdulillāh', 'Allāhu Akbar']),
        correctAnswer: 'Alḥamdulillāh',
        explanation: 'Rasūlullāh ﷺ said: "The best du\'ā\' is Alḥamdulillāh" (Tirmidhī). If we keep thanking Allāh, He will give us more.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What is the "best du\'ā\'" according to the ḥadīth reported in Tirmidhī?',
        options: JSON.stringify(['Subḥānallāh', 'Astaghfirullāh', 'Alḥamdulillāh', 'Allāhu Akbar']),
        correctAnswer: 'Alḥamdulillāh',
        explanation: 'Rasūlullāh ﷺ said: "The best du\'ā\' is Alḥamdulillāh" (Tirmidhī). If we keep thanking Allāh, He will give us more.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-ahadith-q5' },
      create: {
        externalId: 'maktab-3-ahadith-q5',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Complete the ḥadīth: "Love for people what you love for yourself, and you will become ___."',
        options: JSON.stringify(['A true Muslim', 'A scholar', 'A leader', 'A friend of Allāh']),
        correctAnswer: 'A true Muslim',
        explanation: 'Rasūlullāh ﷺ said: "Love for people what you love for yourself, and you will become a true Muslim" (Tirmidhī). A true believer is selfless and thinks of others.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'Complete the ḥadīth: "Love for people what you love for yourself, and you will become ___."',
        options: JSON.stringify(['A true Muslim', 'A scholar', 'A leader', 'A friend of Allāh']),
        correctAnswer: 'A true Muslim',
        explanation: 'Rasūlullāh ﷺ said: "Love for people what you love for yourself, and you will become a true Muslim" (Tirmidhī). A true believer is selfless and thinks of others.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-ahadith-q6' },
      create: {
        externalId: 'maktab-3-ahadith-q6',
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'Rasūlullāh ﷺ said: "Say: \'I believe in Allāh,\' then stay ___."',
        options: undefined,
        correctAnswer: 'firm',
        explanation: 'The ḥadīth in Ṣaḥīḥ Muslim teaches us to remain steadfast (firm) upon our belief in Allāh, even when we face difficulties.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'Rasūlullāh ﷺ said: "Say: \'I believe in Allāh,\' then stay ___."',
        options: undefined,
        correctAnswer: 'firm',
        explanation: 'The ḥadīth in Ṣaḥīḥ Muslim teaches us to remain steadfast (firm) upon our belief in Allāh, even when we face difficulties.',
        difficulty: 'EASY',
      },
    })
  ]);
  // --- Sīrah Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-3-sirah-q1' },
      create: {
        externalId: 'maktab-3-sirah-q1',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Where did the Muslims migrate to escape persecution in Makkah?',
        options: JSON.stringify(['Madīnah', 'Ṭā\'if', 'Abyssinia', 'Jerusalem']),
        correctAnswer: 'Abyssinia',
        explanation: 'The Companions migrated to Abyssinia where the Christian king, Najāshī, was known to be a fair and compassionate ruler.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'Where did the Muslims migrate to escape persecution in Makkah?',
        options: JSON.stringify(['Madīnah', 'Ṭā\'if', 'Abyssinia', 'Jerusalem']),
        correctAnswer: 'Abyssinia',
        explanation: 'The Companions migrated to Abyssinia where the Christian king, Najāshī, was known to be a fair and compassionate ruler.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-sirah-q2' },
      create: {
        externalId: 'maktab-3-sirah-q2',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who spoke on behalf of the Muslims before King Najāshī?',
        options: JSON.stringify(['Abū Bakr', 'Ja\'far ibn Abī Ṭālib', '\'Uthmān ibn \'Affān', '\'Umar ibn al-Khaṭṭāb']),
        correctAnswer: 'Ja\'far ibn Abī Ṭālib',
        explanation: 'Ja\'far ibn Abī Ṭālib delivered a moving speech before King Najāshī, reciting verses from Sūrah Maryam that caused everyone to cry.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'Who spoke on behalf of the Muslims before King Najāshī?',
        options: JSON.stringify(['Abū Bakr', 'Ja\'far ibn Abī Ṭālib', '\'Uthmān ibn \'Affān', '\'Umar ibn al-Khaṭṭāb']),
        correctAnswer: 'Ja\'far ibn Abī Ṭālib',
        explanation: 'Ja\'far ibn Abī Ṭālib delivered a moving speech before King Najāshī, reciting verses from Sūrah Maryam that caused everyone to cry.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-sirah-q3' },
      create: {
        externalId: 'maktab-3-sirah-q3',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How long did the boycott of Banū Hāshim last in Shi\'b Abī Ṭālib?',
        options: JSON.stringify(['One year', 'Two years', 'Three years', 'Five years']),
        correctAnswer: 'Three years',
        explanation: 'The terrible boycott of Banū Hāshim and Banū Muṭṭalib in Shi\'b Abī Ṭālib lasted for three years, until Allāh sent white ants to eat the document.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'How long did the boycott of Banū Hāshim last in Shi\'b Abī Ṭālib?',
        options: JSON.stringify(['One year', 'Two years', 'Three years', 'Five years']),
        correctAnswer: 'Three years',
        explanation: 'The terrible boycott of Banū Hāshim and Banū Muṭṭalib in Shi\'b Abī Ṭālib lasted for three years, until Allāh sent white ants to eat the document.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-sirah-q4' },
      create: {
        externalId: 'maktab-3-sirah-q4',
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'When the Angel of the Mountains offered to crush the people of Ṭā\'if, Rasūlullāh ﷺ agreed.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Despite being pelted with stones, Rasūlullāh ﷺ refused the offer and instead hoped that Allāh would bless them with children who would worship Him alone.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'When the Angel of the Mountains offered to crush the people of Ṭā\'if, Rasūlullāh ﷺ agreed.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Despite being pelted with stones, Rasūlullāh ﷺ refused the offer and instead hoped that Allāh would bless them with children who would worship Him alone.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-sirah-q5' },
      create: {
        externalId: 'maktab-3-sirah-q5',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What was the name of the miraculous creature that carried the Prophet ﷺ on the Night Journey?',
        options: JSON.stringify(['Burāq', 'Dābbah', 'Qāṣwā\'', 'Duldul']),
        correctAnswer: 'Burāq',
        explanation: 'Burāq was a beautiful white creature, larger than a donkey but smaller than a horse, with wings. Each step covered as far as the eye could see.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What was the name of the miraculous creature that carried the Prophet ﷺ on the Night Journey?',
        options: JSON.stringify(['Burāq', 'Dābbah', 'Qāṣwā\'', 'Duldul']),
        correctAnswer: 'Burāq',
        explanation: 'Burāq was a beautiful white creature, larger than a donkey but smaller than a horse, with wings. Each step covered as far as the eye could see.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-sirah-q6' },
      create: {
        externalId: 'maktab-3-sirah-q6',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many daily prayers were originally ordained, and to how many were they reduced?',
        options: JSON.stringify(['100 to 5', '50 to 5', '70 to 7', '40 to 5']),
        correctAnswer: '50 to 5',
        explanation: 'Allāh originally ordained 50 prayers a day. On the advice of Mūsā عليه السلام, the Prophet ﷺ kept returning until they were reduced to 5, with the reward of 50.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'How many daily prayers were originally ordained, and to how many were they reduced?',
        options: JSON.stringify(['100 to 5', '50 to 5', '70 to 7', '40 to 5']),
        correctAnswer: '50 to 5',
        explanation: 'Allāh originally ordained 50 prayers a day. On the advice of Mūsā عليه السلام, the Prophet ﷺ kept returning until they were reduced to 5, with the reward of 50.',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Tārīkh Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-3-tarikh-q1' },
      create: {
        externalId: 'maktab-3-tarikh-q1',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What was the occupation of Āzar, the father of Ibrāhīm عليه السلام?',
        options: JSON.stringify(['Farmer', 'Idol-maker', 'Merchant', 'Blacksmith']),
        correctAnswer: 'Idol-maker',
        explanation: 'Āzar used to carve idols out of stone and sell them to the people who would worship them.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What was the occupation of Āzar, the father of Ibrāhīm عليه السلام?',
        options: JSON.stringify(['Farmer', 'Idol-maker', 'Merchant', 'Blacksmith']),
        correctAnswer: 'Idol-maker',
        explanation: 'Āzar used to carve idols out of stone and sell them to the people who would worship them.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-tarikh-q2' },
      create: {
        externalId: 'maktab-3-tarikh-q2',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did Allāh command the fire to be when Ibrāhīm عليه السلام was thrown in?',
        options: JSON.stringify(['Extinguished', 'Cool and peaceful', 'A garden', 'Invisible']),
        correctAnswer: 'Cool and peaceful',
        explanation: 'Allāh commanded: "O fire, be cool and peaceful for Ibrāhīm" (Qur\'ān 21:69). Ibrāhīm was not harmed at all.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What did Allāh command the fire to be when Ibrāhīm عليه السلام was thrown in?',
        options: JSON.stringify(['Extinguished', 'Cool and peaceful', 'A garden', 'Invisible']),
        correctAnswer: 'Cool and peaceful',
        explanation: 'Allāh commanded: "O fire, be cool and peaceful for Ibrāhīm" (Qur\'ān 21:69). Ibrāhīm was not harmed at all.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-tarikh-q3' },
      create: {
        externalId: 'maktab-3-tarikh-q3',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Between which two mountains did Hājar run seven times searching for water?',
        options: JSON.stringify(['Uḥud and Ḥirā\'', 'Ṣafā and Marwah', 'Sinai and Ṭūr', 'Arafah and Minā']),
        correctAnswer: 'Ṣafā and Marwah',
        explanation: 'Hājar ran between Ṣafā and Marwah seven times searching for water. This act is commemorated during Ḥajj as Sa\'ī.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'Between which two mountains did Hājar run seven times searching for water?',
        options: JSON.stringify(['Uḥud and Ḥirā\'', 'Ṣafā and Marwah', 'Sinai and Ṭūr', 'Arafah and Minā']),
        correctAnswer: 'Ṣafā and Marwah',
        explanation: 'Hājar ran between Ṣafā and Marwah seven times searching for water. This act is commemorated during Ḥajj as Sa\'ī.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-tarikh-q4' },
      create: {
        externalId: 'maktab-3-tarikh-q4',
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: 'The water of Zamzam dried up shortly after it first appeared.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Zamzam is still flowing in Makkah today. Millions of people drink from it and it has never finished — it is a miracle of Allāh.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'The water of Zamzam dried up shortly after it first appeared.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Zamzam is still flowing in Makkah today. Millions of people drink from it and it has never finished — it is a miracle of Allāh.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-tarikh-q5' },
      create: {
        externalId: 'maktab-3-tarikh-q5',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did Allāh send from Jannah as a replacement when Ibrāhīm عليه السلام was about to sacrifice Ismā\'īl?',
        options: JSON.stringify(['A camel', 'A ram', 'A cow', 'A goat']),
        correctAnswer: 'A ram',
        explanation: 'Allāh sent a ram from Jannah for Ibrāhīm to sacrifice instead of Ismā\'īl. This event is commemorated during \'Īd al-Aḍḥā.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What did Allāh send from Jannah as a replacement when Ibrāhīm عليه السلام was about to sacrifice Ismā\'īl?',
        options: JSON.stringify(['A camel', 'A ram', 'A cow', 'A goat']),
        correctAnswer: 'A ram',
        explanation: 'Allāh sent a ram from Jannah for Ibrāhīm to sacrifice instead of Ismā\'īl. This event is commemorated during \'Īd al-Aḍḥā.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-tarikh-q6' },
      create: {
        externalId: 'maktab-3-tarikh-q6',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did Ibrāhīm عليه السلام and Ismā\'īl عليه السلام build together in Makkah?',
        options: JSON.stringify(['A palace', 'The Ka\'bah', 'A well', 'A garden']),
        correctAnswer: 'The Ka\'bah',
        explanation: 'Allāh commanded Ibrāhīm and Ismā\'īl to build the Ka\'bah, which became the direction (qiblah) all Muslims face in ṣalāh.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What did Ibrāhīm عليه السلام and Ismā\'īl عليه السلام build together in Makkah?',
        options: JSON.stringify(['A palace', 'The Ka\'bah', 'A well', 'A garden']),
        correctAnswer: 'The Ka\'bah',
        explanation: 'Allāh commanded Ibrāhīm and Ismā\'īl to build the Ka\'bah, which became the direction (qiblah) all Muslims face in ṣalāh.',
        difficulty: 'EASY',
      },
    })
  ]);
  // --- Aqā'id Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-3-aqaid-q1' },
      create: {
        externalId: 'maktab-3-aqaid-q1',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the difference between a Rasūl and a Nabī?',
        options: JSON.stringify(['A Rasūl is older than a Nabī', 'A Rasūl receives a new scripture and laws; a Nabī follows the previous one', 'There is no difference', 'A Nabī is higher in rank']),
        correctAnswer: 'A Rasūl receives a new scripture and laws; a Nabī follows the previous one',
        explanation: 'A Rasūl (messenger) is given a book or scripture and new laws, while a Nabī (prophet) follows the book and law of the previous messenger. Every Rasūl is a Nabī, but not every Nabī is a Rasūl.',
        difficulty: 'MEDIUM',
        aiGenerated: false,
      },
      update: {
        questionText: 'What is the difference between a Rasūl and a Nabī?',
        options: JSON.stringify(['A Rasūl is older than a Nabī', 'A Rasūl receives a new scripture and laws; a Nabī follows the previous one', 'There is no difference', 'A Nabī is higher in rank']),
        correctAnswer: 'A Rasūl receives a new scripture and laws; a Nabī follows the previous one',
        explanation: 'A Rasūl (messenger) is given a book or scripture and new laws, while a Nabī (prophet) follows the book and law of the previous messenger. Every Rasūl is a Nabī, but not every Nabī is a Rasūl.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-aqaid-q2' },
      create: {
        externalId: 'maktab-3-aqaid-q2',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many prophets are mentioned by name in the Qur\'ān?',
        options: JSON.stringify(['12', '20', '25', '124,000']),
        correctAnswer: '25',
        explanation: 'The Qur\'ān mentions 25 prophets by name, from Ādam عليه السلام to Muḥammad ﷺ.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'How many prophets are mentioned by name in the Qur\'ān?',
        options: JSON.stringify(['12', '20', '25', '124,000']),
        correctAnswer: '25',
        explanation: 'The Qur\'ān mentions 25 prophets by name, from Ādam عليه السلام to Muḥammad ﷺ.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-aqaid-q3' },
      create: {
        externalId: 'maktab-3-aqaid-q3',
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'After Muḥammad ﷺ, more prophets may still be sent by Allāh.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Muḥammad ﷺ was the final and last messenger. There will be no more prophets or messengers after him. Anyone who claims prophethood after him is a liar.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'After Muḥammad ﷺ, more prophets may still be sent by Allāh.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Muḥammad ﷺ was the final and last messenger. There will be no more prophets or messengers after him. Anyone who claims prophethood after him is a liar.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-aqaid-q4' },
      create: {
        externalId: 'maktab-3-aqaid-q4',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is a MAJOR sign of the Day of Judgement?',
        options: JSON.stringify(['People raising voices in the masjid', 'The appearance of the Dajjāl', 'Disunity among Muslims', 'Men wearing silk']),
        correctAnswer: 'The appearance of the Dajjāl',
        explanation: 'The Dajjāl is one of the major signs. The others listed are minor signs that occur before the major signs.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'Which of the following is a MAJOR sign of the Day of Judgement?',
        options: JSON.stringify(['People raising voices in the masjid', 'The appearance of the Dajjāl', 'Disunity among Muslims', 'Men wearing silk']),
        correctAnswer: 'The appearance of the Dajjāl',
        explanation: 'The Dajjāl is one of the major signs. The others listed are minor signs that occur before the major signs.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-aqaid-q5' },
      create: {
        externalId: 'maktab-3-aqaid-q5',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is another name for the Day of Judgement?',
        options: JSON.stringify(['Yawmul Jumu\'ah', 'Yawmul Qiyāmah', 'Laylatul Qadr', 'Yawmul \'Āshūrā\'']),
        correctAnswer: 'Yawmul Qiyāmah',
        explanation: 'The Day of Judgement is also called Yawmul Qiyāmah (the Day of Standing). It is the Last Day when all creation will be held accountable.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What is another name for the Day of Judgement?',
        options: JSON.stringify(['Yawmul Jumu\'ah', 'Yawmul Qiyāmah', 'Laylatul Qadr', 'Yawmul \'Āshūrā\'']),
        correctAnswer: 'Yawmul Qiyāmah',
        explanation: 'The Day of Judgement is also called Yawmul Qiyāmah (the Day of Standing). It is the Last Day when all creation will be held accountable.',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Akhlāq Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-3-akhlaq-q1' },
      create: {
        externalId: 'maktab-3-akhlaq-q1',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the Qur\'ān (49:12), what should Muslims abstain from?',
        options: JSON.stringify(['Eating too much', 'Much suspicion', 'Sleeping late', 'Travelling alone']),
        correctAnswer: 'Much suspicion',
        explanation: '"O you who believe, abstain from much suspicion. Some suspicions are sins." (Qur\'ān 49:12). Thinking badly of others can lead to backbiting and spying.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'According to the Qur\'ān (49:12), what should Muslims abstain from?',
        options: JSON.stringify(['Eating too much', 'Much suspicion', 'Sleeping late', 'Travelling alone']),
        correctAnswer: 'Much suspicion',
        explanation: '"O you who believe, abstain from much suspicion. Some suspicions are sins." (Qur\'ān 49:12). Thinking badly of others can lead to backbiting and spying.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-akhlaq-q2' },
      create: {
        externalId: 'maktab-3-akhlaq-q2',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the famous ḥadīth, who deserves the finest treatment three times before the father is mentioned?',
        options: JSON.stringify(['The teacher', 'The mother', 'The neighbour', 'The friend']),
        correctAnswer: 'The mother',
        explanation: 'When asked who deserves the finest treatment, Rasūlullāh ﷺ said "Your mother" three times, and then "Your father" (Ṣaḥīḥ Muslim).',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'In the famous ḥadīth, who deserves the finest treatment three times before the father is mentioned?',
        options: JSON.stringify(['The teacher', 'The mother', 'The neighbour', 'The friend']),
        correctAnswer: 'The mother',
        explanation: 'When asked who deserves the finest treatment, Rasūlullāh ﷺ said "Your mother" three times, and then "Your father" (Ṣaḥīḥ Muslim).',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-akhlaq-q3' },
      create: {
        externalId: 'maktab-3-akhlaq-q3',
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'According to the ḥadīth, truthfulness leads to good and good leads to Jannah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Rasūlullāh ﷺ said: "Truthfulness leads to good and good leads to Jannah. A person continues to be truthful until he is registered as truthful in the sight of Allāh." (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'According to the ḥadīth, truthfulness leads to good and good leads to Jannah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Rasūlullāh ﷺ said: "Truthfulness leads to good and good leads to Jannah. A person continues to be truthful until he is registered as truthful in the sight of Allāh." (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-akhlaq-q4' },
      create: {
        externalId: 'maktab-3-akhlaq-q4',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What sin does the Qur\'ān compare to eating the flesh of your dead brother?',
        options: JSON.stringify(['Lying', 'Stealing', 'Ghībah (backbiting)', 'Jealousy']),
        correctAnswer: 'Ghībah (backbiting)',
        explanation: '"Do not backbite one another. Does one of you like that he eats the flesh of his dead brother?" (Qur\'ān 49:12).',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What sin does the Qur\'ān compare to eating the flesh of your dead brother?',
        options: JSON.stringify(['Lying', 'Stealing', 'Ghībah (backbiting)', 'Jealousy']),
        correctAnswer: 'Ghībah (backbiting)',
        explanation: '"Do not backbite one another. Does one of you like that he eats the flesh of his dead brother?" (Qur\'ān 49:12).',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-akhlaq-q5' },
      create: {
        externalId: 'maktab-3-akhlaq-q5',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth, what should a person who believes in Allāh and the Last Day do?',
        options: JSON.stringify(['Fast every day', 'Speak a good word or remain silent', 'Give all their wealth away', 'Never leave their home']),
        correctAnswer: 'Speak a good word or remain silent',
        explanation: '"Whoever believes in Allāh and the Last Day should speak a good word or remain silent." (Ṣaḥīḥ al-Bukhārī).',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'According to the ḥadīth, what should a person who believes in Allāh and the Last Day do?',
        options: JSON.stringify(['Fast every day', 'Speak a good word or remain silent', 'Give all their wealth away', 'Never leave their home']),
        correctAnswer: 'Speak a good word or remain silent',
        explanation: '"Whoever believes in Allāh and the Last Day should speak a good word or remain silent." (Ṣaḥīḥ al-Bukhārī).',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-akhlaq-q6' },
      create: {
        externalId: 'maktab-3-akhlaq-q6',
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: 'The story of the Emperor and the seeds teaches us the importance of ___.',
        options: undefined,
        correctAnswer: 'honesty',
        explanation: 'Ling was the only one honest enough to bring his empty pot, while everyone else cheated by substituting different seeds. His honesty was rewarded with the throne.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'The story of the Emperor and the seeds teaches us the importance of ___.',
        options: undefined,
        correctAnswer: 'honesty',
        explanation: 'Ling was the only one honest enough to bring his empty pot, while everyone else cheated by substituting different seeds. His honesty was rewarded with the throne.',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Ādāb Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-3-adab-q1' },
      create: {
        externalId: 'maktab-3-adab-q1',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What should you do before touching the Qur\'ān?',
        options: JSON.stringify(['Eat something', 'Perform wuḍū\'', 'Say Bismillāh only', 'Nothing special']),
        correctAnswer: 'Perform wuḍū\'',
        explanation: 'One of the ādāb of the Qur\'ān is to perform wuḍū\' before touching it, as these are the pure words of Allāh.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What should you do before touching the Qur\'ān?',
        options: JSON.stringify(['Eat something', 'Perform wuḍū\'', 'Say Bismillāh only', 'Nothing special']),
        correctAnswer: 'Perform wuḍū\'',
        explanation: 'One of the ādāb of the Qur\'ān is to perform wuḍū\' before touching it, as these are the pure words of Allāh.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-adab-q2' },
      create: {
        externalId: 'maktab-3-adab-q2',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the Qur\'ān, which foot should you enter the masjid with?',
        options: JSON.stringify(['Left foot', 'Right foot', 'Both feet together', 'It does not matter']),
        correctAnswer: 'Right foot',
        explanation: 'It is sunnah to enter the masjid with the right foot and to recite the du\'ā\': "O Allāh, open for me doors of Your mercy."',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'According to the Qur\'ān, which foot should you enter the masjid with?',
        options: JSON.stringify(['Left foot', 'Right foot', 'Both feet together', 'It does not matter']),
        correctAnswer: 'Right foot',
        explanation: 'It is sunnah to enter the masjid with the right foot and to recite the du\'ā\': "O Allāh, open for me doors of Your mercy."',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-adab-q3' },
      create: {
        externalId: 'maktab-3-adab-q3',
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'When travelling, it is sunnah to travel alone rather than in a group.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'It is from the ādāb of travelling to travel in a group and not alone (unless absolutely necessary), and to appoint one person as the amīr (leader).',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'When travelling, it is sunnah to travel alone rather than in a group.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'It is from the ādāb of travelling to travel in a group and not alone (unless absolutely necessary), and to appoint one person as the amīr (leader).',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-adab-q4' },
      create: {
        externalId: 'maktab-3-adab-q4',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the Qur\'ān (62:5) compare a person who has knowledge but does not practise it to?',
        options: JSON.stringify(['A blind man', 'A donkey carrying books', 'An empty vessel', 'A broken pen']),
        correctAnswer: 'A donkey carrying books',
        explanation: 'Allāh says "like a donkey that carries a load of books" (62:5) — the books are of no benefit to the donkey. Similarly, knowledge without practice is useless.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'What does the Qur\'ān (62:5) compare a person who has knowledge but does not practise it to?',
        options: JSON.stringify(['A blind man', 'A donkey carrying books', 'An empty vessel', 'A broken pen']),
        correctAnswer: 'A donkey carrying books',
        explanation: 'Allāh says "like a donkey that carries a load of books" (62:5) — the books are of no benefit to the donkey. Similarly, knowledge without practice is useless.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-3-adab-q5' },
      create: {
        externalId: 'maktab-3-adab-q5',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How did the Prophet ﷺ walk according to the Shamā\'il of Tirmidhī?',
        options: JSON.stringify(['Slowly and lazily', 'Humbly and briskly, leaning slightly forward', 'Running everywhere', 'Looking around at everything']),
        correctAnswer: 'Humbly and briskly, leaning slightly forward',
        explanation: 'The Prophet ﷺ walked with determination, lifting his legs with strength, leaning slightly forward, placing his feet softly, at a quick pace without small steps.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      update: {
        questionText: 'How did the Prophet ﷺ walk according to the Shamā\'il of Tirmidhī?',
        options: JSON.stringify(['Slowly and lazily', 'Humbly and briskly, leaning slightly forward', 'Running everywhere', 'Looking around at everything']),
        correctAnswer: 'Humbly and briskly, leaning slightly forward',
        explanation: 'The Prophet ﷺ walked with determination, lifting his legs with strength, leaning slightly forward, placing his feet softly, at a quick pace without small steps.',
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
      front: 'Farḍ',
      back: 'Compulsory — something you must do. Leaving out a farḍ act is sinful.',
      frontArabic: 'فَرْض',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'terminology', 'farḍ'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Wājib',
      back: 'Necessary — next in importance to farḍ.',
      frontArabic: 'وَاجِب',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'terminology', 'wājib'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Sunnah Mu\'akkadah',
      back: 'An action which Rasūlullāh ﷺ did regularly.',
      frontArabic: 'سُنَّة مُؤَكَّدَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'terminology', 'sunnah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Makrūh Taḥrīmī',
      back: 'Highly disliked and close to ḥarām.',
      frontArabic: 'مَكْرُوه تَحْرِيمِي',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'terminology', 'makrūh'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Najāsah Ḥaqīqī',
      back: 'Physical impurity that can be seen — e.g. blood, urine, stool.',
      frontArabic: 'نَجَاسَة حَقِيقِي',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'najāsah', 'ṭahārah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Najāsah Ḥukmī',
      back: 'An impurity that cannot be seen — removed by wuḍū\' or ghusl.',
      frontArabic: 'نَجَاسَة حُكْمِي',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'najāsah', 'ṭahārah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ghusl',
      back: 'A full-body bath that must be taken when in a state of major impurity. It has 3 farā\'iḍ and 5 sunan.',
      frontArabic: 'غُسْل',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'ghusl', 'ṭahārah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Takbīr Taḥrīmah',
      back: 'The first takbīr (Allāhu Akbar) when starting ṣalāh — it is the first farḍ act in ṣalāh.',
      frontArabic: 'تَكْبِيرُ التَّحْرِيمَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'ṣalāh', 'farḍ-acts'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ṣalātul Qaṣr',
      back: 'Shortened prayer for travellers who plan to travel more than 54 miles. The 4-rak\'ah farḍ prayers are reduced to 2.',
      frontArabic: 'صَلَاةُ الْقَصْر',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'ṣalāh', 'qaṣr'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Nawāqiḍ',
      back: 'Acts that break or cancel something — such as things that break ṣalāh or wuḍū\'.',
      frontArabic: 'نَوَاقِض',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'terminology', 'nawāqiḍ'],
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
      front: 'Ṣalāh is a pillar of dīn',
      back: 'Just as a building cannot stand without pillars, our religion cannot stand without ṣalāh. It will be the first thing asked about on the Day of Judgement. (Bayhaqī)',
      frontArabic: null,
      backArabic: null,
      category: 'hadith',
      tags: ['aḥādīth', 'ṣalāh', 'importance'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Love for Others',
      back: '"Love for people what you love for yourself, and you will become a true Muslim." (Tirmidhī)',
      frontArabic: null,
      backArabic: null,
      category: 'hadith',
      tags: ['aḥādīth', 'love', 'selflessness'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Steadfastness',
      back: '"Say: \'I believe in Allāh,\' then stay firm." (Ṣaḥīḥ Muslim) — We must remain steadfast upon our belief.',
      frontArabic: null,
      backArabic: null,
      category: 'hadith',
      tags: ['aḥādīth', 'steadfastness', 'īmān'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Life as a Traveller',
      back: '"Stay in this world as though you are a stranger, rather a traveller." (Ṣaḥīḥ al-Bukhārī) — This world is temporary like a waiting room.',
      frontArabic: null,
      backArabic: null,
      category: 'hadith',
      tags: ['aḥādīth', 'dunyā', 'perspective'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'This World',
      back: '"The world is a prison for a believer and a paradise for a disbeliever." (Ṣaḥīḥ Muslim)',
      frontArabic: null,
      backArabic: null,
      category: 'hadith',
      tags: ['aḥādīth', 'dunyā', 'perspective'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\'',
      back: '"Du\'ā\' is the weapon of a believer." (Ḥākim) — Just as a weapon protects from enemies, du\'ā\' protects the believer.',
      frontArabic: 'دُعَاء',
      backArabic: null,
      category: 'hadith',
      tags: ['aḥādīth', 'du\'ā\'', 'worship'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Honouring Guests',
      back: '"Whoever believes in Allāh and the Last Day should honour his guest!" (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'hadith',
      tags: ['aḥādīth', 'guests', 'hospitality'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Mercy',
      back: '"Allāh does not show mercy to the one who does not show mercy to people!" (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'hadith',
      tags: ['aḥādīth', 'mercy', 'raḥmah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Modesty',
      back: '"Modesty is part of īmān." (Ṣaḥīḥ al-Bukhārī) — Modesty stops us from doing evil in clothing, behaviour, and speech.',
      frontArabic: 'حَيَاء',
      backArabic: null,
      category: 'hadith',
      tags: ['aḥādīth', 'modesty', 'ḥayā\''],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Shukr (Gratitude)',
      back: '"The best du\'ā\' is Alḥamdulillāh." (Tirmidhī) — If we keep thanking Allāh, He will give us more.',
      frontArabic: 'شُكْر',
      backArabic: null,
      category: 'hadith',
      tags: ['aḥādīth', 'shukr', 'gratitude'],
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
      front: 'Migration to Abyssinia',
      back: 'The Companions migrated to Abyssinia to escape persecution. King Najāshī was a fair ruler who protected them.',
      frontArabic: null,
      backArabic: null,
      category: 'event',
      tags: ['sīrah', 'abyssinia', 'migration'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ja\'far ibn Abī Ṭālib',
      back: 'He spoke before King Najāshī on behalf of the Muslims, reciting Sūrah Maryam which caused everyone to cry.',
      frontArabic: null,
      backArabic: null,
      category: 'person',
      tags: ['sīrah', 'companion', 'abyssinia'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥamzah ibn \'Abdul Muṭṭalib',
      back: 'Uncle of the Prophet ﷺ who openly declared Islam after hearing of Abū Jahal\'s rude behaviour towards the Prophet.',
      frontArabic: null,
      backArabic: null,
      category: 'person',
      tags: ['sīrah', 'companion', 'warrior'],
      difficulty: 'EASY' as const,
    },
    {
      front: '\'Umar ibn al-Khaṭṭāb',
      back: 'Initially against Islam, he set out to harm the Prophet but converted after reading Sūrah Ṭā Hā at his sister\'s house.',
      frontArabic: null,
      backArabic: null,
      category: 'person',
      tags: ['sīrah', 'companion', 'conversion'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Boycott of Banū Hāshim',
      back: 'The disbelievers boycotted Banū Hāshim and Banū Muṭṭalib in Shi\'b Abī Ṭālib for 3 years. Allāh ended it by sending ants to eat the document.',
      frontArabic: null,
      backArabic: null,
      category: 'event',
      tags: ['sīrah', 'boycott', 'persecution'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Year of Sadness',
      back: 'The year when both Abū Ṭālib (the Prophet\'s uncle) and Khadījah (his beloved wife) passed away.',
      frontArabic: null,
      backArabic: null,
      category: 'event',
      tags: ['sīrah', 'grief', 'year-of-sadness'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Journey to Ṭā\'if',
      back: 'The Prophet ﷺ went to Ṭā\'if to invite the people but was rejected and pelted with stones. He refused the Angel of Mountains\' offer to crush them.',
      frontArabic: null,
      backArabic: null,
      category: 'event',
      tags: ['sīrah', 'ṭā\'if', 'mercy'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Al-Isrā\' wal Mi\'rāj',
      back: 'The miraculous Night Journey from Makkah to Jerusalem (Isrā\') and then the Ascent through the heavens (Mi\'rāj), where 5 daily prayers were ordained.',
      frontArabic: 'الإِسْرَاء وَالْمِعْرَاج',
      backArabic: null,
      category: 'event',
      tags: ['sīrah', 'miracle', 'night-journey'],
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
      front: 'Ibrāhīm عليه السلام',
      back: 'A great prophet of Allāh who challenged idol worship, survived being thrown in fire, and built the Ka\'bah with his son Ismā\'īl.',
      frontArabic: 'إِبْرَاهِيم',
      backArabic: null,
      category: 'person',
      tags: ['tārīkh', 'prophet', 'ibrāhīm'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Āzar',
      back: 'The father of Ibrāhīm عليه السلام who used to carve and sell idols in the village of Ūr.',
      frontArabic: 'آزَر',
      backArabic: null,
      category: 'person',
      tags: ['tārīkh', 'ibrāhīm', 'idol-worship'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'The Fire of Ibrāhīm',
      back: 'The disbelievers threw Ibrāhīm into a huge fire, but Allāh commanded: "O fire, be cool and peaceful for Ibrāhīm." (Qur\'ān 21:69)',
      frontArabic: null,
      backArabic: null,
      category: 'event',
      tags: ['tārīkh', 'miracle', 'fire'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'King Namrūd',
      back: 'An evil and arrogant king who debated with Ibrāhīm about the power of Allāh. He was left speechless when challenged about making the sun rise from the West.',
      frontArabic: 'نَمْرُود',
      backArabic: null,
      category: 'person',
      tags: ['tārīkh', 'ibrāhīm', 'tyrant'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Zamzam',
      back: 'The blessed water that gushed from the ground near baby Ismā\'īl when an angel struck the earth. It still flows in Makkah today.',
      frontArabic: 'زَمْزَم',
      backArabic: null,
      category: 'place',
      tags: ['tārīkh', 'makkah', 'miracle'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ṣafā and Marwah',
      back: 'Two mountains in Makkah between which Hājar ran seven times searching for water. This act is commemorated during Ḥajj as Sa\'ī.',
      frontArabic: 'الصَّفَا وَالْمَرْوَة',
      backArabic: null,
      category: 'place',
      tags: ['tārīkh', 'makkah', 'ḥajj'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'The Sacrifice of Ismā\'īl',
      back: 'Allāh tested Ibrāhīm by commanding him in a dream to sacrifice his son Ismā\'īl. Both submitted to Allāh\'s will, and a ram was sent from Jannah.',
      frontArabic: null,
      backArabic: null,
      category: 'event',
      tags: ['tārīkh', 'sacrifice', '\'īd-al-aḍḥā'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Building the Ka\'bah',
      back: 'Allāh commanded Ibrāhīm and Ismā\'īl to build the Ka\'bah — the house of worship that all Muslims face in ṣalāh (the qiblah).',
      frontArabic: 'الْكَعْبَة',
      backArabic: null,
      category: 'event',
      tags: ['tārīkh', 'ka\'bah', 'ibrāhīm'],
      difficulty: 'EASY' as const,
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
      front: 'Rasūl',
      back: 'A messenger of Allāh who is given a new book or scripture and new laws.',
      frontArabic: 'رَسُول',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'prophet', 'rasūl'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Nabī',
      back: 'A prophet of Allāh who follows the book and law of the previous messenger.',
      frontArabic: 'نَبِيّ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'prophet', 'nabī'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Yawmul Qiyāmah',
      back: 'The Day of Judgement — the Last Day when everything will be destroyed and then all will be brought back to answer for their deeds.',
      frontArabic: 'يَوْمُ الْقِيَامَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'last-day', 'qiyāmah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'The 25 Prophets',
      back: 'The Qur\'ān mentions 25 prophets by name: from Ādam عليه السلام (the first) to Muḥammad ﷺ (the last and final).',
      frontArabic: null,
      backArabic: null,
      category: 'concept',
      tags: ['aqā\'id', 'prophets', 'qur\'ān'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Minor Signs of Qiyāmah',
      back: 'Include: decrease in modesty, cheating in trade, disobedience to parents, voices raised in masājid, leaders being the worst of people, and widespread alcohol.',
      frontArabic: null,
      backArabic: null,
      category: 'concept',
      tags: ['aqā\'id', 'last-day', 'minor-signs'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'The Dajjāl',
      back: 'A major sign of the Day of Judgement — a great deceiver who will appear before the end of times.',
      frontArabic: 'الدَّجَّال',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'last-day', 'major-signs'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'The Mahdī',
      back: 'A righteous leader who will appear as a major sign of the Day of Judgement to fill the earth with justice.',
      frontArabic: 'الْمَهْدِي',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'last-day', 'major-signs'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Return of \'Īsā عليه السلام',
      back: 'A major sign of the Day of Judgement — Prophet \'Īsā will return to earth, defeat the Dajjāl, and establish justice.',
      frontArabic: null,
      backArabic: null,
      category: 'concept',
      tags: ['aqā\'id', 'last-day', 'major-signs'],
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
      front: 'Ḥusn al-Ẓann',
      back: 'Thinking good of others. The Qur\'ān warns: "Abstain from much suspicion. Some suspicions are sins." (49:12)',
      frontArabic: 'حُسْنُ الظَّنّ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'good-thoughts', 'suspicion'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Sharing with Others',
      back: '"You shall never attain righteousness unless you spend from what you love." (Qur\'ān 3:92)',
      frontArabic: null,
      backArabic: null,
      category: 'concept',
      tags: ['akhlāq', 'sharing', 'generosity'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Kindness to Parents',
      back: 'Allāh placed obedience to parents immediately after His own rights. Even saying "uff" to them is forbidden. (Qur\'ān 17:23-25)',
      frontArabic: 'بِرُّ الْوَالِدَيْن',
      backArabic: null,
      category: 'concept',
      tags: ['akhlāq', 'parents', 'obedience'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ṣidq (Truthfulness)',
      back: '"Truthfulness leads to good and good leads to Jannah." Lying leads to evil and evil leads to Jahannam. (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: 'صِدْق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'truthfulness', 'honesty'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Good Word or Silence',
      back: '"Whoever believes in Allāh and the Last Day should speak a good word or remain silent." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'hadith',
      tags: ['akhlāq', 'speech', 'tongue'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ghībah (Backbiting)',
      back: 'Speaking evil about a Muslim behind their back. The Qur\'ān compares it to eating the flesh of your dead brother. (49:12)',
      frontArabic: 'غِيبَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'backbiting', 'sin'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'The Bankrupt Person',
      back: 'The Prophet ﷺ said the truly bankrupt person is one who comes with good deeds on Qiyāmah but loses them all because of insulting, slandering, and harming others. (Ṣaḥīḥ Muslim)',
      frontArabic: null,
      backArabic: null,
      category: 'hadith',
      tags: ['akhlāq', 'deeds', 'judgement'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Tajassus (Spying)',
      back: 'Investigating and spying into the private affairs of others — often a result of bad suspicion. It is forbidden in Islam.',
      frontArabic: 'تَجَسُّس',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'spying', 'privacy'],
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
      front: 'Ādāb of Travelling',
      back: 'Pray 2 rak\'āt before departure, travel in a group, appoint an amīr, share provisions, and recite the du\'ā\' of travel.',
      frontArabic: null,
      backArabic: null,
      category: 'etiquette',
      tags: ['ādāb', 'travelling', 'sunnah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ādāb of Studying',
      back: 'Make correct intention, respect books and teacher, listen attentively, revise after lessons, and most importantly — practise what you learn.',
      frontArabic: null,
      backArabic: null,
      category: 'etiquette',
      tags: ['ādāb', 'studying', 'knowledge'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ādāb of Qur\'ān',
      back: 'Perform wuḍū\', use miswāk, sit respectfully, recite Ta\'awwudh and Tasmiyah, recite with tajwīd, and never place other books on top.',
      frontArabic: null,
      backArabic: null,
      category: 'etiquette',
      tags: ['ādāb', 'qur\'ān', 'recitation'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ādāb of Walking',
      back: 'Walk humbly and briskly, lower your gaze, spread salām, remove harmful objects from the road, and do not walk proudly.',
      frontArabic: null,
      backArabic: null,
      category: 'etiquette',
      tags: ['ādāb', 'walking', 'humility'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ādāb of the Masjid',
      back: 'Dress well, enter with right foot, pray Taḥiyyatul Masjid, remain silent, spend time in dhikr and Qur\'ān, and do not talk about worldly matters.',
      frontArabic: null,
      backArabic: null,
      category: 'etiquette',
      tags: ['ādāb', 'masjid', 'worship'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Taḥiyyatul Masjid',
      back: 'Two rak\'āt of prayer performed upon entering the masjid — a way of "greeting" the house of Allāh.',
      frontArabic: 'تَحِيَّةُ الْمَسْجِد',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ādāb', 'masjid', 'ṣalāh'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\' of Entering the Masjid',
      back: '"O Allāh, open for me doors of Your mercy." Recited when entering the masjid with the right foot.',
      frontArabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
      backArabic: null,
      category: 'du\'ā\'',
      tags: ['ādāb', 'masjid', 'du\'ā\''],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\' of Leaving the Masjid',
      back: '"O Allāh, I ask You from Your bounty." Recited when leaving the masjid.',
      frontArabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
      backArabic: null,
      category: 'du\'ā\'',
      tags: ['ādāb', 'masjid', 'du\'ā\''],
      difficulty: 'EASY' as const,
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
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitSirah.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitTarikh.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitAqaid.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitAkhlaq.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitAdab.id } });

await prisma.arabicTerm.createMany({
    data: [
      // Fiqh terms (8)
      { unitId: unitFiqh.id, arabicText: 'فَرْض', transliteration: 'Farḍ', translation: 'Compulsory — something you must do' },
      { unitId: unitFiqh.id, arabicText: 'وَاجِب', transliteration: 'Wājib', translation: 'Necessary — next in importance to farḍ' },
      { unitId: unitFiqh.id, arabicText: 'نَجَاسَة', transliteration: 'Najāsah', translation: 'Impurity — physical or ritual uncleanliness' },
      { unitId: unitFiqh.id, arabicText: 'غُسْل', transliteration: 'Ghusl', translation: 'A full-body ritual bath' },
      { unitId: unitFiqh.id, arabicText: 'نَوَاقِض', transliteration: 'Nawāqiḍ', translation: 'Acts that break or cancel something (e.g. wuḍū\' or ṣalāh)' },
      { unitId: unitFiqh.id, arabicText: 'قِبْلَة', transliteration: 'Qiblah', translation: 'The direction of the Ka\'bah that Muslims face in ṣalāh' },
      { unitId: unitFiqh.id, arabicText: 'سَتْر', transliteration: 'Satr', translation: 'Parts of the body that must be covered' },
      { unitId: unitFiqh.id, arabicText: 'قُنُوت', transliteration: 'Qunūt', translation: 'The special du\'ā\' recited in Ṣalātul Witr' },
      // Sīrah terms (5)
      { unitId: unitSirah.id, arabicText: 'هِجْرَة', transliteration: 'Hijrah', translation: 'Migration — the Companions migrated to Abyssinia and later to Madīnah' },
      { unitId: unitSirah.id, arabicText: 'بُرَاق', transliteration: 'Burāq', translation: 'The miraculous creature that carried the Prophet ﷺ on the Night Journey' },
      { unitId: unitSirah.id, arabicText: 'إِسْرَاء', transliteration: 'Isrā\'', translation: 'The Night Journey from Makkah to Jerusalem' },
      { unitId: unitSirah.id, arabicText: 'مِعْرَاج', transliteration: 'Mi\'rāj', translation: 'The Ascent through the heavens to the Divine Presence' },
      { unitId: unitSirah.id, arabicText: 'سِدْرَةُ الْمُنْتَهَى', transliteration: 'Sidrah al-Muntahā', translation: 'The Lote Tree of the Furthest Limit — boundary of the heavens' },
      // Tārīkh terms (4)
      { unitId: unitTarikh.id, arabicText: 'خَلِيلُ اللَّه', transliteration: 'Khalīlullāh', translation: 'The Close Friend of Allāh — a title of Ibrāhīm عليه السلام' },
      { unitId: unitTarikh.id, arabicText: 'زَمْزَم', transliteration: 'Zamzam', translation: 'The blessed water in Makkah that has flowed since the time of Ismā\'īl' },
      { unitId: unitTarikh.id, arabicText: 'صَفَا وَمَرْوَة', transliteration: 'Ṣafā wa Marwah', translation: 'Two hills in Makkah between which Hājar ran searching for water' },
      { unitId: unitTarikh.id, arabicText: 'أُضْحِيَة', transliteration: 'Uḍḥiyah', translation: 'The animal sacrifice at \'Īd al-Aḍḥā, commemorating Ibrāhīm\'s obedience' },
      // Aqā'id terms (4)
      { unitId: unitAqaid.id, arabicText: 'رَسُول', transliteration: 'Rasūl', translation: 'A messenger given a new scripture and laws by Allāh' },
      { unitId: unitAqaid.id, arabicText: 'نَبِيّ', transliteration: 'Nabī', translation: 'A prophet who follows the previous messenger\'s scripture' },
      { unitId: unitAqaid.id, arabicText: 'يَوْمُ الْقِيَامَة', transliteration: 'Yawmul Qiyāmah', translation: 'The Day of Judgement — the Last Day' },
      { unitId: unitAqaid.id, arabicText: 'الدَّجَّال', transliteration: 'Dajjāl', translation: 'The great deceiver — a major sign of the Day of Judgement' },
      // Akhlāq terms (4)
      { unitId: unitAkhlaq.id, arabicText: 'حُسْنُ الظَّنّ', transliteration: 'Ḥusn al-Ẓann', translation: 'Thinking good of others — an important quality of a Muslim' },
      { unitId: unitAkhlaq.id, arabicText: 'غِيبَة', transliteration: 'Ghībah', translation: 'Backbiting — speaking evil about a Muslim behind their back' },
      { unitId: unitAkhlaq.id, arabicText: 'صِدْق', transliteration: 'Ṣidq', translation: 'Truthfulness — leads to good and ultimately to Jannah' },
      { unitId: unitAkhlaq.id, arabicText: 'بِرُّ الْوَالِدَيْن', transliteration: 'Birrul Wālidayn', translation: 'Kindness and obedience to parents' },
      // Ādāb terms (5)
      { unitId: unitAdab.id, arabicText: 'تَحِيَّةُ الْمَسْجِد', transliteration: 'Taḥiyyatul Masjid', translation: 'Two rak\'āt prayer upon entering the masjid' },
      { unitId: unitAdab.id, arabicText: 'أَمِير', transliteration: 'Amīr', translation: 'Leader — appointed when travelling in a group' },
      { unitId: unitAdab.id, arabicText: 'تَجْوِيد', transliteration: 'Tajwīd', translation: 'The rules of correct Qur\'ān recitation' },
      { unitId: unitAdab.id, arabicText: 'تَعَوُّذ', transliteration: 'Ta\'awwudh', translation: 'Saying "I seek refuge in Allāh from Shayṭān the accursed" before reciting Qur\'ān' },
      { unitId: unitAdab.id, arabicText: 'أَذَان', transliteration: 'Adhān', translation: 'The call to prayer — answer it by repeating the words quietly' },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 Maktab Coursebook 3 seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: Maktab Coursebook 3 (ages 8-9)');
  console.log('   - 7 Units: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā\'id, Akhlāq, Ādāb');
  console.log(`   - ${7 + 6 + 6 + 6 + 5 + 6 + 5} Quiz questions (41 total)`);
  console.log(`   - ${flashcardIndex} Flashcards`);
  console.log(`   - 30 Arabic terms`);
}

// Allow standalone execution
async function main() {
  try {
    await seedMaktabCoursebook3();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Maktab Coursebook 3:', error);
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