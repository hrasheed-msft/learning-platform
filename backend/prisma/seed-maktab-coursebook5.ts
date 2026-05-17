import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 5 — Islamic Curriculum Seed
 * Source: An Nasihah Publications, Age Range: 10–11 years
 *
 * Covers seven subjects: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā'id, Akhlāq, Ādāb
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions and flashcards per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-coursebook5.ts
 */

export async function seedMaktabCoursebook5() {
  console.log('📚 Starting Maktab Coursebook 5 seed...');
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

  // Check if course already exists — skip if so
  const existing = await prisma.course.findFirst({
    where: { title: 'Maktab Coursebook 5' },
  });
  if (existing) {
    console.log('⏭️  Maktab Coursebook 5 already exists — skipping.');
    return;
  }

  // ──────────────────────────────────────────────
  // COURSE
  // ──────────────────────────────────────────────

  const course = await prisma.course.create({
    data: {
      title: 'Maktab Coursebook 5',
      description:
        'An intermediate Islamic curriculum for learners aged 10–11 years. Covers advanced fiqh (wuḍū\' rulings, tayammum, ṣalāh sunan, masbūq rules, qaḍā\', \'Īd ṣalāh, \'umrah, ḥajj, and ziyārah), key aḥādīth on promises, the tongue, ghībah, intoxicants, and good character, sīrah of the Treaty of Ḥudaybiyah, conquest of Makkah, and the farewell sermon, tārīkh of Mūsā and \'Īsā عليهم السلام, aqā\'id on death, the grave, Jannah, Jahannam, A\'rāf, and al-Qadr, akhlāq on mashwarah, ṣabr, keeping ties, gifts, and dhikr, and ādāb of ghusl, social interaction, writing, miswāk, and visiting the sick. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // UNIT 1: FIQH
  // ──────────────────────────────────────────────

  const unitFiqh = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Fiqh — Advanced Wuḍū\', Tayammum, Ṣalāh, \'Umrah, Ḥajj & Ziyārah',
      description:
        'Detailed rulings of wuḍū\' (farā\'iḍ, sunan, makrūhāt, nawāqiḍ), tayammum, ṣalāh sunan and mustaḥabbāt, the masbūq, qaḍā\' prayers, \'Īd ṣalāh, \'umrah, ḥajj, and ziyārah of Madīnah.',
      orderIndex: 0,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>List and explain the four farā'iḍ (obligatory acts) of wuḍū'.</li>
  <li>Describe the sunan and makrūhāt of wuḍū'.</li>
  <li>Identify the nawāqiḍ (nullifiers) of wuḍū'.</li>
  <li>Explain when tayammum is permissible and how to perform it.</li>
  <li>Describe the sunan and mustaḥabbāt of ṣalāh.</li>
  <li>Explain the rules for a masbūq (latecomer) in congregational prayer.</li>
  <li>Understand qaḍā' prayers and when they are required.</li>
  <li>Describe the method and rulings of 'Īd ṣalāh.</li>
  <li>Outline the steps of 'umrah and the key rituals of ḥajj.</li>
  <li>Appreciate the significance of ziyārah of Madīnah al-Munawwarah.</li>
</ul>

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
<p>'Īd ṣalāh is wājib upon every adult Muslim male who is required to pray Jumu'ah. It is performed on the mornings of 'Īd al-Fiṭr (1st Shawwāl) and 'Īd al-Aḍḥā (10th Dhul Ḥijjah).</p>
<h3>Method of 'Īd Ṣalāh:</h3>
<ol>
  <li>Make the intention for 'Īd ṣalāh with the imām.</li>
  <li>Say takbīr al-taḥrīmah and fold the hands.</li>
  <li>The imām says three extra takbīrāt — raise the hands each time and drop them to the sides. After the third, fold the hands.</li>
  <li>The imām recites al-Fātiḥah and a sūrah, then perform rukū' and sajdah as normal.</li>
  <li>In the second rak'ah, the imām recites al-Fātiḥah and a sūrah first, then says three extra takbīrāt before going into rukū'.</li>
  <li>Complete the ṣalāh as normal and listen to the khuṭbah (sermon) after the prayer.</li>
</ol>

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

<h4>9th Dhul Ḥijjah — Yawm 'Arafah</h4>
<p>The most important day of Ḥajj. The pilgrim stands at the plain of 'Arafah from after ẓuhr until sunset, making du'ā' and seeking forgiveness. Without the wuqūf at 'Arafah, the Ḥajj is invalid.</p>
<p>After sunset, the pilgrim proceeds to Muzdalifah, where they pray Maghrib and 'Ishā' combined, collect pebbles, and spend the night under the open sky.</p>

<h4>10th Dhul Ḥijjah — Yawm al-Naḥr ('Īd al-Aḍḥā)</h4>
<p>The pilgrim performs the following in order:</p>
<ol>
  <li><strong>Ramī:</strong> Pelting the large jamarah (Jamarah al-'Aqabah) with seven pebbles.</li>
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
`.trim(),
    },
  });

  console.log('✅ Created Unit 1:', unitFiqh.title);

  // ──────────────────────────────────────────────
  // UNIT 2: AḤĀDĪTH
  // ──────────────────────────────────────────────

  const unitAhadith = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Aḥādīth — Promises, the Tongue, Ghībah, Intoxicants & Good Character',
      description:
        'Ten aḥādīth covering the importance of keeping promises, guarding the tongue, the sin of ghībah (backbiting), the prohibition of intoxicants, and cultivating good character.',
      orderIndex: 1,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Recite and explain ten key aḥādīth on important moral and social topics.</li>
  <li>Understand the seriousness of breaking promises, backbiting, and intoxicants.</li>
  <li>Appreciate the importance of guarding the tongue and cultivating good character.</li>
</ul>

<h2>The Ten Aḥādīth</h2>

<h3>Ḥadīth 1: Signs of a Hypocrite — Keeping Promises</h3>
<p class="arabic" dir="rtl" lang="ar">آيَةُ الْمُنَافِقِ ثَلَاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ</p>
<p><em>"The signs of a hypocrite are three: when he speaks, he lies; when he makes a promise, he breaks it; and when he is entrusted, he betrays the trust."</em> (Bukhārī & Muslim)</p>
<p>This ḥadīth warns us about three dangerous traits. A Muslim must always speak the truth, keep promises, and be trustworthy. Having these bad traits is a sign of hypocrisy (nifāq).</p>

<h3>Ḥadīth 2: Dangers of the Tongue</h3>
<p class="arabic" dir="rtl" lang="ar">مَنْ يَضْمَنْ لِي مَا بَيْنَ لَحْيَيْهِ وَمَا بَيْنَ رِجْلَيْهِ أَضْمَنْ لَهُ الْجَنَّةَ</p>
<p><em>"Whoever guarantees me (the correct use of) what is between his jaws (tongue) and what is between his legs, I guarantee him Jannah."</em> (Bukhārī)</p>
<p>The tongue and the private parts are the two things that lead most people into sin. Guarding them is a key to entering Jannah.</p>

<h3>Ḥadīth 3: Ghībah (Backbiting) — Its Definition</h3>
<p class="arabic" dir="rtl" lang="ar">أَتَدْرُونَ مَا الْغِيبَةُ؟ قَالُوا: اللَّهُ وَرَسُولُهُ أَعْلَمُ. قَالَ: ذِكْرُكَ أَخَاكَ بِمَا يَكْرَهُ</p>
<p><em>"Do you know what ghībah (backbiting) is?" They said: "Allāh and His Messenger know best." He said: "It is mentioning your brother with what he dislikes."</em> (Muslim)</p>
<p>When asked what if it is true, the Prophet ﷺ said: "If what you say is true, you have backbitten him; if it is not true, you have slandered him (buhtān)." Ghībah is a major sin.</p>

<h3>Ḥadīth 4: Prohibition of Intoxicants</h3>
<p class="arabic" dir="rtl" lang="ar">كُلُّ مُسْكِرٍ خَمْرٌ وَكُلُّ مُسْكِرٍ حَرَامٌ</p>
<p><em>"Every intoxicant is khamr, and every intoxicant is ḥarām."</em> (Muslim)</p>
<p>This ḥadīth establishes that any substance that intoxicates is prohibited, whether it is alcohol, drugs, or any other substance. What intoxicates in large amounts is ḥarām even in small amounts.</p>

<h3>Ḥadīth 5: Good Character (Ḥusn al-Khuluq)</h3>
<p class="arabic" dir="rtl" lang="ar">أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا</p>
<p><em>"The most complete of the believers in faith is the best of them in character."</em> (Tirmidhī)</p>
<p>Good akhlāq (character) is a sign of strong faith. The Prophet ﷺ was sent to perfect good character, and it will be the heaviest thing on the mīzān on the Day of Judgement.</p>

<h3>Ḥadīth 6: Guarding the Tongue and Private Parts</h3>
<p class="arabic" dir="rtl" lang="ar">مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلَا يُؤْذِ جَارَهُ</p>
<p><em>"Whoever believes in Allāh and the Last Day, let him not harm his neighbour."</em> (Bukhārī & Muslim)</p>
<p>This ḥadīth highlights that true faith in Allāh and the Ākhirah should manifest in treating others — especially neighbours — with kindness and avoiding any form of harm.</p>

<h3>Ḥadīth 7: Speak Good or Be Silent</h3>
<p class="arabic" dir="rtl" lang="ar">مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ</p>
<p><em>"Whoever believes in Allāh and the Last Day, let him speak good or remain silent."</em> (Bukhārī & Muslim)</p>
<p>Before speaking, a Muslim should consider whether their words are beneficial. If not, silence is better. This teaches self-discipline and mindfulness in speech.</p>

<h3>Ḥadīth 8: The Best of You in Character</h3>
<p class="arabic" dir="rtl" lang="ar">خَيْرُكُمْ أَحْسَنُكُمْ خُلُقًا</p>
<p><em>"The best of you are those with the best character."</em> (Bukhārī)</p>
<p>The Prophet ﷺ repeatedly emphasized that good character is the benchmark of a true believer. A Muslim should strive to be kind, patient, generous, and truthful in all dealings.</p>

<h3>Ḥadīth 9: Avoiding Suspicion (Ẓann)</h3>
<p class="arabic" dir="rtl" lang="ar">إِيَّاكُمْ وَالظَّنَّ، فَإِنَّ الظَّنَّ أَكْذَبُ الْحَدِيثِ</p>
<p><em>"Beware of suspicion, for suspicion is the most untruthful of speech."</em> (Bukhārī & Muslim)</p>
<p>Making assumptions about others without evidence is a sin. A Muslim should think well of others and avoid jumping to conclusions about people's intentions.</p>

<h3>Ḥadīth 10: The True Muslim</h3>
<p class="arabic" dir="rtl" lang="ar">الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ</p>
<p><em>"The (true) Muslim is one from whose tongue and hand other Muslims are safe."</em> (Bukhārī & Muslim)</p>
<p>A true Muslim does not harm others — neither through speech (lies, backbiting, insults) nor through physical actions. This ḥadīth defines the essence of being Muslim: bringing safety and peace to those around you.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 2:', unitAhadith.title);

  // ──────────────────────────────────────────────
  // UNIT 3: SĪRAH
  // ──────────────────────────────────────────────

  const unitSirah = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Sīrah — Treaty of Ḥudaybiyah, Conquest of Makkah & the Farewell Sermon',
      description:
        'The Treaty of Ḥudaybiyah (6 AH), the conquest of Makkah (8 AH), and the farewell ḥajj and sermon of Rasūlullāh ﷺ (10 AH).',
      orderIndex: 2,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Describe the events leading to the Treaty of Ḥudaybiyah and its key terms.</li>
  <li>Explain why the treaty was called a "clear victory" in the Qur'ān.</li>
  <li>Narrate the key events of the conquest of Makkah (Fatḥ Makkah).</li>
  <li>Discuss the mercy and forgiveness shown by the Prophet ﷺ upon conquering Makkah.</li>
  <li>Outline the main messages of the farewell sermon (Khuṭbah al-Wadā').</li>
</ul>

<h2>The Treaty of Ḥudaybiyah (6 AH)</h2>

<h3>Background</h3>
<p>In the 6th year after Hijrah, the Prophet ﷺ set out from Madīnah with approximately 1,400 Companions with the intention of performing 'umrah. They were in the state of iḥrām and carried no weapons of war — only travel swords.</p>
<p>When the Quraysh learned of their approach, they sent forces to prevent the Muslims from entering Makkah. The Muslims camped at a place called Ḥudaybiyah, on the outskirts of Makkah.</p>

<h3>Bay'ah al-Riḍwān — The Pledge Under the Tree</h3>
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

<h2>The Farewell Ḥajj and Sermon (10 AH)</h2>

<h3>The Farewell Ḥajj</h3>
<p>In the 10th year after Hijrah, the Prophet ﷺ performed his only ḥajj, known as Ḥajjat al-Wadā' (the Farewell Ḥajj). Over 100,000 Companions accompanied him.</p>

<h3>Key Messages of the Farewell Sermon</h3>
<p>On the 9th of Dhul Ḥijjah, standing on the plain of 'Arafah, the Prophet ﷺ delivered his farewell sermon. Its key messages included:</p>
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
<p>This confirmed that the message of Islam was now complete.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 3:', unitSirah.title);

  // ──────────────────────────────────────────────
  // UNIT 4: TĀRĪKH
  // ──────────────────────────────────────────────

  const unitTarikh = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Tārīkh — The Stories of Mūsā and \'Īsā عليهم السلام',
      description:
        'The life and mission of Mūsā عليه السلام (from birth to the Exodus and beyond) and \'Īsā عليه السلام (his miraculous birth, miracles, and ascension).',
      orderIndex: 3,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Narrate the story of Mūsā عليه السلام from his birth to the major events of his mission.</li>
  <li>Describe the miracles given to Mūsā عليه السلام by Allāh.</li>
  <li>Explain the story of 'Īsā عليه السلام, including his miraculous birth and miracles.</li>
  <li>Understand the Islamic belief about 'Īsā عليه السلام's ascension and second coming.</li>
</ul>

<h2>Mūsā عليه السلام — Kalīmullāh</h2>

<h3>Birth and Early Life</h3>
<p>Mūsā عليه السلام was born at a time when Fir'awn (Pharaoh) of Egypt was killing all newborn boys of Banū Isrā'īl. Allāh inspired his mother to place him in a basket and set it afloat on the River Nile.</p>
<p>By Allāh's plan, the basket was found by the family of Fir'awn. Fir'awn's wife, Āsiyah, convinced Fir'awn to adopt the child. Thus, Mūsā عليه السلام grew up in the very palace of the man who sought to destroy his people.</p>
<p>Allāh arranged for Mūsā's own mother to become his wet-nurse, so he was raised with his mother's love and care.</p>

<h3>Leaving Egypt</h3>
<p>As a young man, Mūsā عليه السلام accidentally caused the death of an Egyptian who was fighting with a man from Banū Isrā'īl. Fearing punishment, Mūsā عليه السلام left Egypt and travelled to Madyan, where he lived for several years, married, and worked as a shepherd.</p>

<h3>The Burning Bush — Revelation at Ṭūr Sīnā</h3>
<p>While travelling back towards Egypt with his family, Mūsā عليه السلام saw a fire on Mount Ṭūr (Sīnā). When he approached it, Allāh spoke to him directly — hence his title Kalīmullāh (the one Allāh spoke to).</p>
<p>Allāh gave him two great miracles:</p>
<ul>
  <li><strong>The staff ('aṣā):</strong> When thrown, it would turn into a large serpent.</li>
  <li><strong>The glowing hand:</strong> When he placed his hand under his arm and withdrew it, it would glow brilliantly white.</li>
</ul>
<p>Allāh commanded Mūsā عليه السلام to go to Fir'awn and call him to worship Allāh alone. Hārūn عليه السلام, his brother, was appointed as his assistant.</p>

<h3>Confronting Fir'awn</h3>
<p>Mūsā عليه السلام went to Fir'awn and called him to the worship of the One True God. Fir'awn arrogantly refused, claiming divinity for himself. Allāh sent a series of miracles and plagues upon Egypt:</p>
<ul>
  <li>Flood, locusts, lice, frogs, and blood.</li>
  <li>Each time, Fir'awn would promise to let Banū Isrā'īl go, but then break his promise when the plague was lifted.</li>
</ul>

<h3>The Parting of the Sea — The Exodus</h3>
<p>Finally, Allāh commanded Mūsā عليه السلام to leave Egypt with Banū Isrā'īl by night. Fir'awn pursued them with his army. When Banū Isrā'īl reached the sea, they were trapped.</p>
<p>Allāh commanded Mūsā عليه السلام to strike the sea with his staff. The sea parted, creating dry paths. Banū Isrā'īl crossed safely, but when Fir'awn and his army followed, the sea closed upon them and they were all drowned.</p>

<h3>At Mount Ṭūr Sīnā</h3>
<p>After the Exodus, Allāh called Mūsā عليه السلام to Mount Ṭūr for forty days, where He revealed the Tawrāh (Torah). During his absence, some of Banū Isrā'īl were led astray by Sāmirī and began worshipping a golden calf. Mūsā عليه السلام was deeply grieved and destroyed the calf upon his return.</p>

<h3>Trials of Banū Isrā'īl</h3>
<p>Despite the many blessings and miracles they witnessed, Banū Isrā'īl frequently disobeyed and tested Mūsā عليه السلام. Among their trials:</p>
<ul>
  <li>Refusing to enter the Holy Land, resulting in 40 years of wandering.</li>
  <li>Complaining about food and water.</li>
  <li>Worshipping the golden calf.</li>
</ul>

<h2>'Īsā عليه السلام — Rūḥullāh</h2>

<h3>Maryam عليها السلام</h3>
<p>Maryam عليها السلام was a pious and devout woman chosen by Allāh above all the women of the world. She devoted her life to worship in the temple. An entire sūrah of the Qur'ān (Sūrah Maryam, Chapter 19) is named after her.</p>

<h3>The Miraculous Birth</h3>
<p>The angel Jibrīl عليه السلام appeared to Maryam and informed her that Allāh would bless her with a son — without a father. This was a miracle from Allāh. When the people questioned her, the baby 'Īsā عليه السلام spoke from the cradle:</p>
<p class="arabic" dir="rtl" lang="ar">قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا</p>
<p><em>"He said: 'Indeed, I am the servant of Allāh. He has given me the Scripture and made me a prophet.'"</em> (Qur'ān 19:30)</p>

<h3>Miracles of 'Īsā عليه السلام</h3>
<p>Allāh gave 'Īsā عليه السلام many miracles, all by the permission and power of Allāh:</p>
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
<p>When the enemies of 'Īsā عليه السلام plotted to kill him, Allāh saved him. 'Īsā عليه السلام was neither killed nor crucified — Allāh raised him alive to the heavens:</p>
<p class="arabic" dir="rtl" lang="ar">وَمَا قَتَلُوهُ وَمَا صَلَبُوهُ وَلَٰكِن شُبِّهَ لَهُمْ</p>
<p><em>"They did not kill him, nor did they crucify him; but it was made to appear so to them."</em> (Qur'ān 4:157)</p>

<h3>The Second Coming</h3>
<p>'Īsā عليه السلام will return before the Day of Judgement. He will descend to earth, follow the Sharī'ah of Muḥammad ﷺ, defeat the Dajjāl (false messiah), and establish justice on earth. He will then pass away naturally and be buried.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 4:', unitTarikh.title);

  // ──────────────────────────────────────────────
  // UNIT 5: AQĀ'ID
  // ──────────────────────────────────────────────

  const unitAqaid = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Aqā\'id — Death, the Grave, the Ākhirah & al-Qadr',
      description:
        'Beliefs about death and its reality, the life of the grave (barzakh), the Day of Judgement, Jannah, Jahannam, A\'rāf, and the concept of al-Qadr (Divine decree).',
      orderIndex: 4,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Explain the Islamic understanding of death and what happens after it.</li>
  <li>Describe the life of the grave (barzakh) including the questioning by Munkar and Nakīr.</li>
  <li>Outline the events of the Day of Judgement (ḥisāb, mīzān, ṣirāṭ).</li>
  <li>Describe Jannah, Jahannam, and A'rāf.</li>
  <li>Explain the concept of al-Qadr (Divine decree) and its four aspects.</li>
</ul>

<h2>Death — The Inevitable Reality</h2>

<h3>Sakrāt al-Mawt — The Pangs of Death</h3>
<p>Every soul will taste death. The moments of death (sakrāt al-mawt) are described as difficult, even the Prophet ﷺ experienced them. At the time of death:</p>
<ul>
  <li>The angel of death ('Izrā'īl عليه السلام) comes to take the soul.</li>
  <li>For the believer, the angels come with good news of Allāh's pleasure and Jannah.</li>
  <li>For the disbeliever, the angels come with news of Allāh's anger and punishment.</li>
</ul>
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

<h2>The Day of Judgement — Yawm al-Qiyāmah</h2>

<h3>Resurrection (Ba'th)</h3>
<p>On the Day of Judgement, all of creation will be resurrected from their graves and gathered on a vast plain. Every person, from the first to the last, will stand before Allāh.</p>

<h3>Ḥisāb — The Reckoning</h3>
<p>Every person will be presented with their book of deeds. Those who receive it in their right hand will be successful; those who receive it in their left hand will be in ruin.</p>

<h3>Mīzān — The Scale</h3>
<p>The Mīzān is the scale of justice where deeds are weighed. Good deeds on one side, bad deeds on the other. Those whose good deeds outweigh the bad will enter Jannah; those whose bad deeds are heavier will face punishment.</p>

<h3>Ṣirāṭ — The Bridge</h3>
<p>The Ṣirāṭ is a bridge set over Jahannam that every person must cross. The believers will cross safely — some like lightning, some like wind, some walking — while the sinful may fall into the fire below.</p>

<h3>Shafā'ah — Intercession</h3>
<p>On the Day of Judgement, the Prophet ﷺ will be granted the Great Intercession (al-shafā'ah al-'uẓmā). He will intercede for his ummah with Allāh's permission.</p>

<h2>Jannah — Paradise</h2>
<p>Jannah is the eternal abode of bliss prepared for the believers. In Jannah:</p>
<ul>
  <li>There is no pain, sorrow, fatigue, or death.</li>
  <li>The believers will have whatever they desire and more.</li>
  <li>The greatest blessing will be seeing Allāh (ru'yatullāh).</li>
  <li>Jannah has many levels — the highest is al-Firdaws al-A'lā.</li>
</ul>

<h2>Jahannam — Hellfire</h2>
<p>Jahannam is the place of punishment. It has been prepared for the disbelievers and those who die upon major sin without repentance:</p>
<ul>
  <li>Its fire is seventy times hotter than the fire of this world.</li>
  <li>It has levels of increasing severity.</li>
  <li>The disbelievers will remain therein forever, but sinful Muslims will eventually be removed by Allāh's mercy.</li>
</ul>

<h2>A'rāf — The Heights</h2>
<p>A'rāf is mentioned in the Qur'ān (Sūrah al-A'rāf, Chapter 7). It refers to a place between Jannah and Jahannam where people whose good and bad deeds are exactly equal will be placed. They will eventually enter Jannah by the mercy of Allāh.</p>

<h2>Al-Qadr — Divine Decree</h2>
<p>Belief in al-Qadr (predestination) is the sixth pillar of īmān. It means believing that everything — good and bad — happens by the will and decree of Allāh.</p>

<h3>The Four Aspects of al-Qadr</h3>
<ol>
  <li><strong>'Ilm (Knowledge):</strong> Allāh knows everything — past, present, and future — in complete detail.</li>
  <li><strong>Kitābah (Writing):</strong> Everything is written in al-Lawḥ al-Maḥfūẓ (the Preserved Tablet) before creation.</li>
  <li><strong>Mashī'ah (Will):</strong> Whatever Allāh wills happens, and whatever He does not will does not happen.</li>
  <li><strong>Khalq (Creation):</strong> Allāh is the Creator of everything — including our actions.</li>
</ol>
<p>Belief in qadr does not negate free will. Allāh has given humans the ability to choose, and they are held accountable for their choices. We do not know what is decreed for us, so we must strive to do good and trust in Allāh's wisdom.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 5:', unitAqaid.title);

  // ──────────────────────────────────────────────
  // UNIT 6: AKHLĀQ
  // ──────────────────────────────────────────────

  const unitAkhlaq = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Akhlāq — Mashwarah, Ṣabr, Keeping Ties, Gifts & Dhikr',
      description:
        'Good character traits including mashwarah (consultation), ṣabr (patience), ṣilah al-raḥim (keeping family ties), giving gifts, and the virtues of dhikr (remembrance of Allāh).',
      orderIndex: 5,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Explain the importance of mashwarah (consultation) and give examples from the sīrah.</li>
  <li>Describe the three types of ṣabr (patience).</li>
  <li>Understand the importance of ṣilah al-raḥim (keeping family ties) and the warnings against cutting them.</li>
  <li>Appreciate the role of giving gifts (hadiyyah) in building love and brotherhood.</li>
  <li>Know the virtues of dhikr and some daily adhkār.</li>
</ul>

<h2>Mashwarah — Consultation</h2>
<p>Mashwarah (also known as shūrā) means seeking advice and consulting others before making important decisions. It is a quality praised by Allāh in the Qur'ān:</p>
<p class="arabic" dir="rtl" lang="ar">وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ</p>
<p><em>"...and whose affairs are by mutual consultation."</em> (Qur'ān 42:38)</p>

<h3>Examples from the Sīrah</h3>
<ul>
  <li><strong>Battle of Badr:</strong> The Prophet ﷺ consulted the Companions about whether to engage the Quraysh army. The Anṣār pledged their support.</li>
  <li><strong>Battle of Uḥud:</strong> The Prophet ﷺ initially preferred to stay in Madīnah but accepted the majority opinion to go out and meet the enemy.</li>
  <li><strong>Battle of the Trench (Khandaq):</strong> The idea of digging a trench came from Salmān al-Fārisī رضي الله عنه through mashwarah.</li>
  <li><strong>Treaty of Ḥudaybiyah:</strong> Umm Salamah رضي الله عنها advised the Prophet ﷺ when the Companions hesitated to shave their heads and exit iḥrām.</li>
</ul>

<h3>Benefits of Mashwarah</h3>
<ul>
  <li>Leads to better decisions through collective wisdom.</li>
  <li>Creates unity and shared responsibility.</li>
  <li>Prevents arrogance and dictatorial behaviour.</li>
  <li>Is a sunnah of Rasūlullāh ﷺ.</li>
</ul>

<h2>Ṣabr — Patience</h2>
<p>Ṣabr is one of the most important qualities a Muslim can have. Allāh mentions ṣabr over 90 times in the Qur'ān.</p>
<p class="arabic" dir="rtl" lang="ar">إِنَّ اللَّهَ مَعَ الصَّابِرِينَ</p>
<p><em>"Indeed, Allāh is with the patient."</em> (Qur'ān 2:153)</p>

<h3>Three Types of Ṣabr</h3>
<ol>
  <li><strong>Ṣabr on obedience to Allāh:</strong> Being patient and consistent in performing acts of worship — ṣalāh, fasting, ḥajj, etc. — even when it is difficult.</li>
  <li><strong>Ṣabr from sin:</strong> Being patient in refraining from sinful and ḥarām actions, even when tempted. This requires self-control and taqwā.</li>
  <li><strong>Ṣabr during trials and difficulties:</strong> Being patient when faced with hardship, illness, loss, or any test from Allāh, knowing that Allāh tests those whom He loves.</li>
</ol>

<h3>Rewards of Ṣabr</h3>
<ul>
  <li>Allāh is with the patient.</li>
  <li>The patient will receive their reward without measure.</li>
  <li>Ṣabr leads to Allāh's help and victory.</li>
  <li>Trials expiate sins when met with patience.</li>
</ul>

<h2>Ṣilah al-Raḥim — Keeping Family Ties</h2>
<p>Ṣilah al-raḥim means maintaining good relations with relatives — visiting them, helping them, being kind to them, and staying in touch.</p>

<h3>Importance in Islam</h3>
<p>The Prophet ﷺ said:</p>
<p class="arabic" dir="rtl" lang="ar">لَا يَدْخُلُ الْجَنَّةَ قَاطِعُ رَحِمٍ</p>
<p><em>"The one who severs family ties will not enter Jannah."</em> (Bukhārī & Muslim)</p>
<ul>
  <li>Keeping ties increases one's sustenance (rizq) and lifespan.</li>
  <li>A person should maintain ties even with relatives who cut ties with them.</li>
  <li>Ṣilah al-raḥim includes financial help, visiting, making du'ā', and even a kind phone call.</li>
</ul>

<h3>Warning Against Cutting Ties</h3>
<p>Cutting family ties (qaṭ' al-raḥim) is a major sin. The Prophet ﷺ warned that Allāh says: "I am al-Raḥmān (the Most Merciful), and I created the raḥim (family bond) and derived its name from My Name. Whoever maintains it, I will maintain him; and whoever cuts it, I will cut him off."</p>

<h2>Hadiyyah — Giving Gifts</h2>
<p>The Prophet ﷺ encouraged Muslims to give gifts to one another as a means of increasing love and removing ill feelings:</p>
<p class="arabic" dir="rtl" lang="ar">تَهَادُوا تَحَابُّوا</p>
<p><em>"Give gifts to one another, and you will love one another."</em></p>

<h3>Etiquettes of Gift-Giving</h3>
<ul>
  <li>Give with sincerity — not to show off or to get something in return.</li>
  <li>Accept gifts graciously and thank the giver.</li>
  <li>Do not belittle any gift, no matter how small.</li>
  <li>The Prophet ﷺ accepted gifts and reciprocated them.</li>
</ul>

<h2>Dhikr — Remembrance of Allāh</h2>
<p>Dhikr is one of the easiest and most rewarding acts of worship. It keeps the heart alive and connected to Allāh.</p>
<p class="arabic" dir="rtl" lang="ar">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</p>
<p><em>"Verily, in the remembrance of Allāh do hearts find rest."</em> (Qur'ān 13:28)</p>

<h3>Forms of Dhikr</h3>
<ul>
  <li><strong>SubḥānAllāh</strong> — Glory be to Allāh.</li>
  <li><strong>Alḥamdulillāh</strong> — All praise is due to Allāh.</li>
  <li><strong>Allāhu Akbar</strong> — Allāh is the Greatest.</li>
  <li><strong>Lā ilāha illAllāh</strong> — There is no god but Allāh.</li>
  <li><strong>Astaghfirullāh</strong> — I seek Allāh's forgiveness.</li>
  <li><strong>Ṣalawāt</strong> — Sending blessings upon the Prophet ﷺ.</li>
</ul>

<h3>Morning and Evening Adhkār</h3>
<p>The Prophet ﷺ taught specific dhikr to be recited in the morning (after Fajr) and in the evening (after 'Aṣr or Maghrib). These include Āyat al-Kursī, the last three sūrahs of the Qur'ān, and various tasbīḥāt. Regular adherence to these protects a person from harm and earns immense reward.</p>

<h3>Virtue of Dhikr</h3>
<p>The Prophet ﷺ said: "Keep your tongue moist with the dhikr of Allāh." Dhikr can be done at any time — walking, sitting, lying down — and it is the easiest path to Allāh's pleasure.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 6:', unitAkhlaq.title);

  // ──────────────────────────────────────────────
  // UNIT 7: ĀDĀB
  // ──────────────────────────────────────────────

  const unitAdab = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Ādāb — Ghusl, Social Interaction, Writing, Miswāk & Visiting the Sick',
      description:
        'Etiquettes of ghusl (ritual bath), social interaction (meeting people, gatherings), writing (bismillāh, neat handwriting), using the miswāk, and visiting the sick (\'iyādah).',
      orderIndex: 6,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Describe the farā'iḍ and sunan of ghusl and the correct method of performing it.</li>
  <li>Explain the Islamic etiquettes of social interaction, gatherings, and meeting people.</li>
  <li>Understand the importance of beginning written work with bismillāh and writing neatly.</li>
  <li>Know the sunnah of using the miswāk and when it is especially recommended.</li>
  <li>Describe the etiquettes of visiting the sick ('iyādah) including the du'ā' to recite.</li>
</ul>

<h2>Ghusl — The Ritual Bath</h2>

<h3>When Is Ghusl Required?</h3>
<p>Ghusl becomes obligatory (farḍ) in the following situations:</p>
<ul>
  <li>After sexual intercourse.</li>
  <li>After a nocturnal emission (wet dream).</li>
  <li>At the end of ḥayḍ (menstruation) and nifās (postnatal bleeding) for women.</li>
</ul>
<p>Ghusl is also recommended (mustaḥabb) before Jumu'ah prayer, 'Īd prayers, entering iḥrām for ḥajj or 'umrah, and on the Day of 'Arafah.</p>

<h3>Farā'iḍ of Ghusl</h3>
<p>The three farā'iḍ (obligatory acts) of ghusl are:</p>
<ol>
  <li><strong>Gargling (maḍmaḍah):</strong> Rinsing the mouth thoroughly so that water reaches every part of the mouth.</li>
  <li><strong>Sniffing water into the nose (istinshāq):</strong> Drawing water into the nostrils to cleanse them.</li>
  <li><strong>Washing the entire body:</strong> Pouring water over the entire body so that no dry spot remains — not even the size of a hair's breadth.</li>
</ol>

<h3>Sunan of Ghusl</h3>
<ul>
  <li>Saying Bismillāh before beginning.</li>
  <li>Washing the hands up to the wrists.</li>
  <li>Washing the private parts.</li>
  <li>Performing a complete wuḍū' before the ghusl.</li>
  <li>Pouring water over the head three times first.</li>
  <li>Then pouring water over the right side of the body, then the left side.</li>
  <li>Rubbing the body to ensure water reaches everywhere.</li>
</ul>

<h2>Ādāb of Social Interaction</h2>

<h3>Greeting with Salām</h3>
<p>The Muslim greeting is "al-Salāmu 'alaykum" (peace be upon you). It is sunnah to greet others and wājib to reply. The Prophet ﷺ said: "Spread salām among yourselves."</p>
<ul>
  <li>The one who arrives should greet first.</li>
  <li>The younger greets the elder.</li>
  <li>The smaller group greets the larger group.</li>
  <li>The walking person greets the sitting person.</li>
</ul>

<h3>Etiquettes of Gatherings</h3>
<ul>
  <li>Greet everyone when entering and leaving a gathering.</li>
  <li>Do not sit in someone else's place if they have temporarily left.</li>
  <li>Make space for others to sit.</li>
  <li>Do not whisper between two people in the presence of a third (as it may hurt their feelings).</li>
  <li>Speak kindly and avoid arguing.</li>
</ul>

<h3>Rights of a Muslim Over Another</h3>
<p>The Prophet ﷺ mentioned several rights that Muslims have over one another:</p>
<ul>
  <li>Returning the salām greeting.</li>
  <li>Visiting the sick.</li>
  <li>Following the funeral procession.</li>
  <li>Accepting invitations.</li>
  <li>Responding to a sneeze (saying yarḥamukAllāh).</li>
  <li>Giving sincere advice (naṣīḥah).</li>
</ul>

<h2>Ādāb of Writing</h2>

<h3>Beginning with Bismillāh</h3>
<p>It is from Islamic etiquette to begin any piece of writing — whether a letter, essay, document, or book — with:</p>
<p class="arabic" dir="rtl" lang="ar">بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ</p>
<p><em>Bismillāh al-Raḥmān al-Raḥīm — In the name of Allāh, the Most Merciful, the Most Compassionate.</em></p>
<p>The Prophet ﷺ began his letters with Bismillāh, and the Qur'ān itself begins with Bismillāh.</p>

<h3>Importance of Good Handwriting</h3>
<p>Islam encourages neat, clear, and legible handwriting. The art of calligraphy (khaṭṭ) has a rich tradition in Islamic civilization. Good handwriting helps in:</p>
<ul>
  <li>Preserving and transmitting knowledge accurately.</li>
  <li>Showing respect for the reader.</li>
  <li>Honouring the content, especially when writing the Qur'ān or aḥādīth.</li>
</ul>

<h2>Miswāk — The Sunnah Tooth Stick</h2>
<p>The miswāk is a natural twig (often from the arāk tree) used for cleaning the teeth. It is a sunnah mu'akkadah (emphasized sunnah) of the Prophet ﷺ.</p>

<h3>When to Use the Miswāk</h3>
<p>The miswāk is especially recommended:</p>
<ul>
  <li>Before wuḍū'.</li>
  <li>Before ṣalāh.</li>
  <li>Before reciting the Qur'ān.</li>
  <li>When entering the home.</li>
  <li>When the mouth has a bad odour.</li>
  <li>When waking up from sleep.</li>
</ul>

<h3>Virtues of the Miswāk</h3>
<p>The Prophet ﷺ said:</p>
<p class="arabic" dir="rtl" lang="ar">السِّوَاكُ مَطْهَرَةٌ لِلْفَمِ مَرْضَاةٌ لِلرَّبِّ</p>
<p><em>"The miswāk is a means of cleansing the mouth and pleasing the Lord."</em> (Nasā'ī)</p>

<h2>'Iyādah — Visiting the Sick</h2>
<p>Visiting the sick is one of the rights of a Muslim over another Muslim. The Prophet ﷺ regularly visited the sick and encouraged others to do so.</p>

<h3>Virtues of Visiting the Sick</h3>
<p>The Prophet ﷺ said: "Whoever visits a sick person is in the harvest of Jannah (kharfah al-Jannah) until he returns." In another narration: "Seventy thousand angels make du'ā' for the visitor."</p>

<h3>Etiquettes of 'Iyādah</h3>
<ul>
  <li>Keep the visit short so as not to tire the sick person.</li>
  <li>Make du'ā' for their recovery.</li>
  <li>Comfort and encourage them.</li>
  <li>Remind them of Allāh's mercy and the reward of patience during illness.</li>
  <li>Avoid visiting at inconvenient times.</li>
</ul>

<h3>Du'ā' for the Sick</h3>
<p>The Prophet ﷺ taught us to place our hand on the sick person and recite:</p>
<p class="arabic" dir="rtl" lang="ar">أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ</p>
<p><em>"As'alullāh al-'Aẓīm Rabb al-'Arsh al-'Aẓīm an yashfiyak — I ask Allāh the Almighty, Lord of the Mighty Throne, to cure you."</em></p>
<p>This du'ā' should be recited seven times. The Prophet ﷺ said that whoever recites it seven times, Allāh will cure the sick person if it is not their time to die.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 7:', unitAdab.title);

  // ══════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('📝 Creating quiz questions...');

  // --- Fiqh Quizzes ---

  await prisma.question.createMany({
    data: [
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many farā\'iḍ (obligatory acts) of wuḍū\' are there?',
        options: JSON.stringify(['Three', 'Four', 'Five', 'Six']),
        correctAnswer: 'Four',
        explanation: 'The four farā\'iḍ of wuḍū\' are: washing the face, washing both arms including elbows, wiping a quarter of the head (masḥ), and washing both feet including ankles.',
        difficulty: 'EASY',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'When is tayammum permissible?',
        options: JSON.stringify(['When one is lazy', 'When water is unavailable or harmful to use', 'Only during travel', 'Only in Ramaḍān']),
        correctAnswer: 'When water is unavailable or harmful to use',
        explanation: 'Tayammum is permitted when water cannot be found within approximately one mile, or when using water would cause harm due to illness or extreme cold.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'A masbūq (latecomer) who joins the imām in rukū\' has caught that rak\'ah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'If a person joins the jamā\'ah and finds the imām in rukū\', and manages to perform rukū\' with the imām, he has caught that rak\'ah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is qaḍā\' ṣalāh?',
        options: JSON.stringify(['A voluntary prayer', 'Making up a missed obligatory prayer', 'The Friday prayer', 'The \'Īd prayer']),
        correctAnswer: 'Making up a missed obligatory prayer',
        explanation: 'Qaḍā\' refers to performing a missed farḍ ṣalāh after its time has passed. It is obligatory to make up missed prayers.',
        difficulty: 'EASY',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the first step of \'umrah after entering iḥrām?',
        options: JSON.stringify(['Sa\'ī between Ṣafā and Marwah', 'Ṭawāf of the Ka\'bah', 'Wuqūf at \'Arafah', 'Ramī of the jamarāt']),
        correctAnswer: 'Ṭawāf of the Ka\'bah',
        explanation: 'After entering iḥrām, the pilgrim performs ṭawāf (circling the Ka\'bah seven times), then sa\'ī, then ḥalq or qaṣr.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'On which day of Dhul Ḥijjah does the pilgrim stand at \'Arafah?',
        options: JSON.stringify(['8th', '9th', '10th', '12th']),
        correctAnswer: '9th',
        explanation: 'The wuqūf (standing) at \'Arafah takes place on the 9th of Dhul Ḥijjah. This is the most important pillar of Ḥajj.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'FILL_BLANK',
        questionText: 'The ziyārah of __________ al-Munawwarah is a virtuous act after Ḥajj.',
        options: null,
        correctAnswer: 'Madīnah',
        explanation: 'Visiting Madīnah al-Munawwarah and the masjid of Rasūlullāh ﷺ is a blessed act, though it is not part of Ḥajj itself.',
        difficulty: 'EASY',
      },
    ],
  });

  // --- Aḥādīth Quizzes ---

  await prisma.question.createMany({
    data: [
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth, how many signs of a munāfiq (hypocrite) are there?',
        options: JSON.stringify(['Two', 'Three', 'Four', 'Five']),
        correctAnswer: 'Three',
        explanation: 'The Prophet ﷺ said the signs of a hypocrite are three: when he speaks he lies, when he promises he breaks it, and when he is entrusted he betrays.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the ḥadīth say about ghībah (backbiting)?',
        options: JSON.stringify(['It is permissible among friends', 'It is mentioning your brother with what he dislikes', 'It is only ḥarām in Ramaḍān', 'It is a minor sin']),
        correctAnswer: 'It is mentioning your brother with what he dislikes',
        explanation: 'The Prophet ﷺ defined ghībah as mentioning your brother with what he would dislike, even if it is true. If it is false, it is buhtān (slander).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ said that intoxicants (khamr) are ḥarām in every quantity, large or small.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Every intoxicant is khamr, and every khamr is ḥarām. What intoxicates in large amounts is ḥarām even in small amounts.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which ḥadīth teaches: "Whoever believes in Allāh and the Last Day should…"?',
        options: JSON.stringify(['Fast every Monday', 'Speak good or remain silent', 'Give charity daily', 'Pray tahajjud']),
        correctAnswer: 'Speak good or remain silent',
        explanation: 'This famous ḥadīth teaches that a believer should either say something beneficial or keep quiet, as careless speech can lead to sin.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'The Prophet ﷺ said: "The best of you are those with the best __________."',
        options: null,
        correctAnswer: 'character',
        explanation: 'The Prophet ﷺ said: "The best of you are those with the best character (akhlāq)." Good character is one of the heaviest things on the mīzān.',
        difficulty: 'EASY',
      },
    ],
  });

  // --- Sīrah Quizzes ---

  await prisma.question.createMany({
    data: [
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In which year after Hijrah did the Treaty of Ḥudaybiyah take place?',
        options: JSON.stringify(['4 AH', '6 AH', '8 AH', '10 AH']),
        correctAnswer: '6 AH',
        explanation: 'The Treaty of Ḥudaybiyah was agreed in 6 AH when the Muslims set out for \'umrah but were stopped by the Quraysh at Ḥudaybiyah.',
        difficulty: 'EASY',
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What was a key term of the Treaty of Ḥudaybiyah?',
        options: JSON.stringify(['Muslims could perform \'umrah that year', 'A ten-year truce was agreed', 'Quraysh would accept Islam', 'Madīnah would be given to Quraysh']),
        correctAnswer: 'A ten-year truce was agreed',
        explanation: 'The treaty included a ten-year truce, and the Muslims would return that year and come back for \'umrah the following year.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'When Makkah was conquered in 8 AH, what did the Prophet ﷺ do to the Quraysh?',
        options: JSON.stringify(['He punished them severely', 'He exiled them all', 'He forgave them', 'He imposed heavy taxes']),
        correctAnswer: 'He forgave them',
        explanation: 'The Prophet ﷺ showed immense mercy, saying "Go, you are all free" (idhhabū fa antum al-ṭulaqā\'), forgiving even those who had persecuted the Muslims for years.',
        difficulty: 'EASY',
      },
      {
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'The farewell sermon of the Prophet ﷺ took place during his ḥajj in 10 AH.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The farewell sermon (khuṭbah al-wadā\') was delivered at \'Arafah during the Prophet\'s ﷺ only ḥajj, in the 10th year after Hijrah.',
        difficulty: 'EASY',
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the farewell sermon, the Prophet ﷺ emphasized which of the following?',
        options: JSON.stringify(['The superiority of Arabs over non-Arabs', 'The equality of all people regardless of race', 'The need for more wars', 'Building more mosques']),
        correctAnswer: 'The equality of all people regardless of race',
        explanation: 'The Prophet ﷺ declared: "No Arab has superiority over a non-Arab… except by taqwā (God-consciousness)."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'FILL_BLANK',
        questionText: 'After conquering Makkah, the Prophet ﷺ entered the Ka\'bah and destroyed the __________.',
        options: null,
        correctAnswer: 'idols',
        explanation: 'The Prophet ﷺ destroyed the 360 idols in and around the Ka\'bah, reciting: "Truth has come, and falsehood has vanished" (Qur\'ān 17:81).',
        difficulty: 'EASY',
      },
    ],
  });

  // --- Tārīkh Quizzes ---

  await prisma.question.createMany({
    data: [
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who was the ruler of Egypt during the time of Mūsā عليه السلام?',
        options: JSON.stringify(['Namrūd', 'Fir\'awn', 'Qārūn', 'Jālūt']),
        correctAnswer: 'Fir\'awn',
        explanation: 'Fir\'awn (Pharaoh) was the tyrannical ruler of Egypt who claimed to be god and oppressed Banū Isrā\'īl.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What miracle did Allāh give to Mūsā عليه السلام at Ṭūr Sīnā?',
        options: JSON.stringify(['A flying carpet', 'His staff turning into a snake and his hand glowing white', 'The ability to fly', 'Control over the wind']),
        correctAnswer: 'His staff turning into a snake and his hand glowing white',
        explanation: 'Allāh gave Mūsā عليه السلام two great miracles: his staff (\'aṣā) would turn into a serpent, and his hand would glow radiantly white.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: '\'Īsā عليه السلام spoke in the cradle as a newborn baby.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: '\'Īsā عليه السلام miraculously spoke as a baby to defend his mother Maryam عليها السلام and declared himself a servant and prophet of Allāh.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What happened to \'Īsā عليه السلام at the end of his time on earth?',
        options: JSON.stringify(['He passed away naturally', 'He was crucified', 'Allāh raised him up to the heavens alive', 'He migrated to Madīnah']),
        correctAnswer: 'Allāh raised him up to the heavens alive',
        explanation: '\'Īsā عليه السلام was not killed or crucified. Allāh raised him alive to the heavens, and he will return before the Day of Judgement.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitTarikh.id,
        type: 'FILL_BLANK',
        questionText: 'Mūsā عليه السلام parted the __________ with his staff by the command of Allāh.',
        options: null,
        correctAnswer: 'sea',
        explanation: 'Allāh commanded Mūsā عليه السلام to strike the sea with his staff. The sea parted, creating dry paths for Banū Isrā\'īl to cross safely.',
        difficulty: 'EASY',
      },
    ],
  });

  // --- Aqā'id Quizzes ---

  await prisma.question.createMany({
    data: [
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the period between death and the Day of Judgement called?',
        options: JSON.stringify(['Jannah', 'Barzakh', 'Ṣirāṭ', 'Mīzān']),
        correctAnswer: 'Barzakh',
        explanation: 'Barzakh is the life of the grave — the period between death and resurrection on the Day of Judgement.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who are Munkar and Nakīr?',
        options: JSON.stringify(['Two prophets', 'Two angels who question the deceased in the grave', 'Two companions', 'Two mountains']),
        correctAnswer: 'Two angels who question the deceased in the grave',
        explanation: 'Munkar and Nakīr are the two angels who question every person in the grave about their Lord, religion, and prophet.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is al-Qadr?',
        options: JSON.stringify(['A type of prayer', 'The Divine decree and predestination of Allāh', 'A pillar of ṣalāh', 'The name of a sūrah only']),
        correctAnswer: 'The Divine decree and predestination of Allāh',
        explanation: 'Al-Qadr means that Allāh has knowledge of everything, has written it all, wills it, and creates it. Belief in qadr is a pillar of īmān.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'A\'rāf refers to the heights between Jannah and Jahannam where certain people will wait.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'A\'rāf is mentioned in the Qur\'ān (Sūrah al-A\'rāf) as a place between Jannah and Jahannam for those whose good and bad deeds are equal.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the Ṣirāṭ?',
        options: JSON.stringify(['A river in Jannah', 'A bridge over Jahannam that all must cross', 'A gate of Jannah', 'The recording angel']),
        correctAnswer: 'A bridge over Jahannam that all must cross',
        explanation: 'The Ṣirāṭ is a bridge set over Jahannam. Every person will have to cross it; the believers will cross safely while others will fall.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'FILL_BLANK',
        questionText: 'The scale on the Day of Judgement where deeds are weighed is called the __________.',
        options: null,
        correctAnswer: 'Mīzān',
        explanation: 'The Mīzān is the scale of justice on the Day of Judgement. Good deeds and bad deeds will be weighed, and a person\'s fate depends on which side is heavier.',
        difficulty: 'EASY',
      },
    ],
  });

  // --- Akhlāq Quizzes ---

  await prisma.question.createMany({
    data: [
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is mashwarah?',
        options: JSON.stringify(['Arguing with others', 'Consultation — seeking advice before making decisions', 'A type of charity', 'A prayer']),
        correctAnswer: 'Consultation — seeking advice before making decisions',
        explanation: 'Mashwarah (shūrā) means consulting others before making important decisions. Even the Prophet ﷺ consulted his companions regularly.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many types of ṣabr (patience) are there?',
        options: JSON.stringify(['One', 'Two', 'Three', 'Four']),
        correctAnswer: 'Three',
        explanation: 'The three types of ṣabr are: patience on obedience to Allāh, patience in refraining from sin, and patience during trials and difficulties.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'Cutting off family ties (qaṭ\' al-raḥim) is a major sin in Islam.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Prophet ﷺ warned that the one who cuts family ties will not enter Jannah. Maintaining ṣilah al-raḥim is highly emphasized.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ say about exchanging gifts?',
        options: JSON.stringify(['It is disliked', 'It increases mutual love', 'It is only for \'Īd', 'It is wājib']),
        correctAnswer: 'It increases mutual love',
        explanation: 'The Prophet ﷺ said: "Give gifts to one another, for gifts remove malice from the heart and increase love between people."',
        difficulty: 'EASY',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: 'The remembrance of Allāh is called __________ in Arabic.',
        options: null,
        correctAnswer: 'dhikr',
        explanation: 'Dhikr means remembering Allāh through phrases like SubḥānAllāh, Alḥamdulillāh, Allāhu Akbar, and Lā ilāha illAllāh.',
        difficulty: 'EASY',
      },
    ],
  });

  // --- Ādāb Quizzes ---

  await prisma.question.createMany({
    data: [
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many farā\'iḍ of ghusl are there?',
        options: JSON.stringify(['Two', 'Three', 'Four', 'Five']),
        correctAnswer: 'Three',
        explanation: 'The three farā\'iḍ of ghusl are: gargling (rinsing the mouth), sniffing water into the nose, and pouring water over the entire body.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What should a Muslim say when beginning to write?',
        options: JSON.stringify(['Mā shā\' Allāh', 'SubḥānAllāh', 'Bismillāh', 'Allāhu Akbar']),
        correctAnswer: 'Bismillāh',
        explanation: 'It is from Islamic etiquette to begin any writing or important work with Bismillāh (In the name of Allāh).',
        difficulty: 'EASY',
      },
      {
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'Using the miswāk is a sunnah of the Prophet ﷺ.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The miswāk is a emphasized sunnah. The Prophet ﷺ said: "The miswāk is cleansing for the mouth and pleasing to the Lord."',
        difficulty: 'EASY',
      },
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is visiting the sick called in Arabic?',
        options: JSON.stringify(['Walīmah', 'Ṣadaqah', '\'Iyādah', 'Janāzah']),
        correctAnswer: '\'Iyādah',
        explanation: '\'Iyādah (visiting the sick) is a right of every Muslim upon another. The Prophet ﷺ said that one who visits the sick is in a garden of Jannah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAdab.id,
        type: 'FILL_BLANK',
        questionText: 'When visiting a sick person, it is sunnah to make __________ for their recovery.',
        options: null,
        correctAnswer: 'du\'ā\'',
        explanation: 'The Prophet ﷺ would make du\'ā\' for the sick. One sunnah du\'ā\' is: "As\'alullāh al-\'Aẓīm Rabb al-\'Arsh al-\'Aẓīm an yashfiyak" (I ask Allāh the Almighty, Lord of the Mighty Throne, to cure you).',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created quiz questions for all 7 units');

  // ══════════════════════════════════════════════
  // FLASHCARDS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🃏 Creating flashcards...');

  let flashcardIndex = 0;

  // --- Fiqh Flashcards (10) ---

  const fiqhFlashcards = [
    { front: 'Farā\'iḍ of Wuḍū\'', back: 'The four obligatory acts: washing the face, washing both arms up to and including the elbows, masḥ of a quarter of the head, and washing both feet up to and including the ankles.', frontArabic: 'فَرَائِض الوُضُوء', backArabic: null, category: 'concept', tags: ['fiqh', 'wuḍū\'', 'farā\'iḍ'], difficulty: 'EASY' as const },
    { front: 'Tayammum', back: 'Dry ablution using clean earth or dust when water is unavailable or harmful to use. Strike the earth twice — once for the face, once for the arms up to the elbows.', frontArabic: 'تَيَمُّم', backArabic: null, category: 'concept', tags: ['fiqh', 'tayammum', 'ṭahārah'], difficulty: 'MEDIUM' as const },
    { front: 'Nawāqiḍ al-Wuḍū\'', back: 'Things that break wuḍū\': passing wind, bleeding that flows, vomiting a mouthful, sleeping lying down, laughing aloud in ṣalāh, and becoming unconscious.', frontArabic: 'نَوَاقِض الوُضُوء', backArabic: null, category: 'concept', tags: ['fiqh', 'wuḍū\'', 'nawāqiḍ'], difficulty: 'MEDIUM' as const },
    { front: 'Masbūq', back: 'A latecomer who joins the congregational prayer after it has started. He follows the imām and completes any missed rak\'āt after the imām makes salām.', frontArabic: 'مَسْبُوق', backArabic: null, category: 'vocabulary', tags: ['fiqh', 'ṣalāh', 'masbūq'], difficulty: 'MEDIUM' as const },
    { front: 'Qaḍā\' Ṣalāh', back: 'Making up a missed obligatory prayer. It is sinful to miss a prayer without a valid excuse, and it remains a debt until made up.', frontArabic: 'قَضَاء صَلَاة', backArabic: null, category: 'concept', tags: ['fiqh', 'ṣalāh', 'qaḍā\''], difficulty: 'EASY' as const },
    { front: '\'Īd Ṣalāh', back: 'A wājib prayer performed on the mornings of \'Īd al-Fiṭr and \'Īd al-Aḍḥā. It consists of two rak\'āt with six extra takbīrāt.', frontArabic: 'صَلَاة العِيد', backArabic: null, category: 'concept', tags: ['fiqh', 'ṣalāh', '\'īd'], difficulty: 'EASY' as const },
    { front: 'Iḥrām', back: 'The sacred state a pilgrim enters for \'umrah or ḥajj by making intention and reciting the talbiyah. Certain actions become prohibited.', frontArabic: 'إِحْرَام', backArabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ', category: 'vocabulary', tags: ['fiqh', 'ḥajj', 'iḥrām'], difficulty: 'MEDIUM' as const },
    { front: 'Wuqūf at \'Arafah', back: 'Standing at the plain of \'Arafah on the 9th of Dhul Ḥijjah. It is the most important pillar of Ḥajj — without it, Ḥajj is invalid.', frontArabic: 'وُقُوف عَرَفَة', backArabic: null, category: 'concept', tags: ['fiqh', 'ḥajj', '\'arafah'], difficulty: 'MEDIUM' as const },
    { front: 'Ṭawāf', back: 'Circling the Ka\'bah seven times in an anti-clockwise direction. It is performed during \'umrah, ḥajj, and as a voluntary act.', frontArabic: 'طَوَاف', backArabic: null, category: 'vocabulary', tags: ['fiqh', 'ḥajj', 'ṭawāf'], difficulty: 'EASY' as const },
    { front: 'Ziyārah of Madīnah', back: 'Visiting Madīnah al-Munawwarah and the masjid of Rasūlullāh ﷺ. It is a virtuous act but not a pillar of Ḥajj or \'umrah.', frontArabic: 'زِيَارَة المَدِينَة', backArabic: null, category: 'concept', tags: ['fiqh', 'ziyārah', 'madīnah'], difficulty: 'EASY' as const },
  ];

  await prisma.flashCard.createMany({
    data: fiqhFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitFiqh.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += fiqhFlashcards.length;

  // --- Aḥādīth Flashcards (10) ---

  const ahadithFlashcards = [
    { front: 'Signs of a Munāfiq', back: 'The Prophet ﷺ said: "The signs of a hypocrite are three: when he speaks he lies, when he promises he breaks it, and when he is entrusted he betrays."', frontArabic: 'عَلَامَات المُنَافِق', backArabic: 'آيَةُ الْمُنَافِقِ ثَلَاثٌ', category: 'ḥadīth', tags: ['aḥādīth', 'munāfiq', 'promises'], difficulty: 'EASY' as const },
    { front: 'Guarding the Tongue', back: 'The Prophet ﷺ said: "Whoever guards what is between his jaws and what is between his legs, I guarantee him Jannah."', frontArabic: 'حِفْظ اللِّسَان', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'tongue', 'speech'], difficulty: 'MEDIUM' as const },
    { front: 'Ghībah (Backbiting)', back: 'The Prophet ﷺ said: "Do you know what ghībah is? It is mentioning your brother with what he dislikes." If it is false, it is buhtān (slander).', frontArabic: 'غِيبَة', backArabic: null, category: 'vocabulary', tags: ['aḥādīth', 'ghībah', 'backbiting'], difficulty: 'MEDIUM' as const },
    { front: 'Prohibition of Khamr', back: 'Every intoxicant is khamr, and every khamr is ḥarām. What intoxicates in large amounts is ḥarām even in small amounts.', frontArabic: 'خَمْر', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'intoxicants', 'ḥarām'], difficulty: 'EASY' as const },
    { front: 'Ḥusn al-Khuluq', back: '"The best of you are those with the best character." Good akhlāq will be the heaviest thing on the mīzān (scale) on the Day of Judgement.', frontArabic: 'حُسْن الخُلُق', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'character', 'akhlāq'], difficulty: 'EASY' as const },
    { front: 'Speak Good or Be Silent', back: '"Whoever believes in Allāh and the Last Day, let him speak good or remain silent." — Teaching us to think before we speak.', frontArabic: null, backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'speech', 'silence'], difficulty: 'EASY' as const },
    { front: 'The Muslim', back: '"The Muslim is one from whose tongue and hand other Muslims are safe." — Defining a true Muslim by the safety others feel around him.', frontArabic: 'المُسْلِم', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'muslim', 'safety'], difficulty: 'EASY' as const },
    { front: 'Avoiding Suspicion', back: '"Avoid suspicion (ẓann), for suspicion is the most untruthful of speech." — Warning against making assumptions about others.', frontArabic: 'ظَنّ', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'suspicion', 'ẓann'], difficulty: 'MEDIUM' as const },
    { front: 'Hadiyyah (Gifts)', back: '"Give gifts to one another, for gifts remove malice from the heart." — Encouraging generosity and love between people.', frontArabic: 'هَدِيَّة', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'gifts', 'hadiyyah'], difficulty: 'EASY' as const },
    { front: 'Kalimat al-Khayr', back: 'Speaking good (kalimat al-khayr) includes dhikr of Allāh, advising good, reconciling between people, and speaking kind words.', frontArabic: 'كَلِمَات الخَيْر', backArabic: null, category: 'concept', tags: ['aḥādīth', 'speech', 'good-words'], difficulty: 'MEDIUM' as const },
  ];

  await prisma.flashCard.createMany({
    data: ahadithFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitAhadith.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += ahadithFlashcards.length;

  // --- Sīrah Flashcards (8) ---

  const sirahFlashcards = [
    { front: 'Treaty of Ḥudaybiyah', back: 'A peace treaty signed in 6 AH between the Muslims and Quraysh. Though the terms seemed unfavorable, it was called a "clear victory" in the Qur\'ān (Sūrah al-Fatḥ).', frontArabic: 'صُلْح الحُدَيْبِيَة', backArabic: null, category: 'event', tags: ['sīrah', 'ḥudaybiyah', 'treaty'], difficulty: 'MEDIUM' as const },
    { front: 'Bay\'ah al-Riḍwān', back: 'The Pledge of Riḍwān — the Companions pledged allegiance to the Prophet ﷺ under a tree at Ḥudaybiyah, promising to fight if needed. Allāh expressed His pleasure with them in the Qur\'ān.', frontArabic: 'بَيْعَة الرِّضْوَان', backArabic: null, category: 'event', tags: ['sīrah', 'ḥudaybiyah', 'bay\'ah'], difficulty: 'MEDIUM' as const },
    { front: 'Fatḥ Makkah (Conquest of Makkah)', back: 'In 8 AH, the Prophet ﷺ entered Makkah with 10,000 Muslims. He forgave the Quraysh, saying: "Go, you are all free." The idols in the Ka\'bah were destroyed.', frontArabic: 'فَتْح مَكَّة', backArabic: null, category: 'event', tags: ['sīrah', 'makkah', 'conquest'], difficulty: 'EASY' as const },
    { front: '"Idhhabū fa antum al-ṭulaqā\'"', back: '"Go, you are all free" — the words of mercy spoken by the Prophet ﷺ to the Quraysh upon the conquest of Makkah, forgiving years of persecution.', frontArabic: 'اِذْهَبُوا فَأَنْتُمُ الطُّلَقَاء', backArabic: null, category: 'quote', tags: ['sīrah', 'makkah', 'forgiveness'], difficulty: 'EASY' as const },
    { front: 'The Farewell Sermon', back: 'Delivered at \'Arafah during the Prophet\'s ﷺ only ḥajj in 10 AH. Key messages: equality of all people, sanctity of life and wealth, rights of women, and holding fast to the Qur\'ān.', frontArabic: 'خُطْبَة الوَدَاع', backArabic: null, category: 'event', tags: ['sīrah', 'farewell', 'sermon'], difficulty: 'MEDIUM' as const },
    { front: 'Completion of the Dīn', back: 'At \'Arafah, the verse was revealed: "Today I have perfected your religion for you, completed My favour upon you, and chosen Islam as your religion" (Qur\'ān 5:3).', frontArabic: null, backArabic: 'اليَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ', category: 'concept', tags: ['sīrah', 'farewell', 'dīn'], difficulty: 'MEDIUM' as const },
    { front: 'Destruction of the Idols', back: 'Upon entering the Ka\'bah, the Prophet ﷺ destroyed 360 idols, reciting: "Truth has come, and falsehood has vanished. Indeed, falsehood is bound to vanish" (Qur\'ān 17:81).', frontArabic: null, backArabic: 'جَاءَ الحَقُّ وَزَهَقَ البَاطِل', category: 'event', tags: ['sīrah', 'makkah', 'idols'], difficulty: 'EASY' as const },
    { front: 'Sūrah al-Fatḥ', back: 'Sūrah al-Fatḥ (Chapter 48) was revealed after the Treaty of Ḥudaybiyah, calling the treaty "a clear victory" (fatḥan mubīnā).', frontArabic: 'سُورَة الفَتْح', backArabic: null, category: 'concept', tags: ['sīrah', 'ḥudaybiyah', 'qur\'ān'], difficulty: 'MEDIUM' as const },
  ];

  await prisma.flashCard.createMany({
    data: sirahFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitSirah.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += sirahFlashcards.length;

  // --- Tārīkh Flashcards (8) ---

  const tarikhFlashcards = [
    { front: 'Mūsā عليه السلام', back: 'A great prophet sent to Banū Isrā\'īl and to Fir\'awn. He was given the Tawrāh and many miracles including the staff and the glowing hand.', frontArabic: 'مُوسَى عَلَيْهِ السَّلَام', backArabic: null, category: 'biography', tags: ['tārīkh', 'mūsā', 'prophet'], difficulty: 'EASY' as const },
    { front: 'Fir\'awn (Pharaoh)', back: 'The tyrannical ruler of Egypt who claimed to be god, oppressed Banū Isrā\'īl, and was eventually drowned in the sea while chasing Mūsā عليه السلام.', frontArabic: 'فِرْعَوْن', backArabic: null, category: 'biography', tags: ['tārīkh', 'mūsā', 'fir\'awn'], difficulty: 'EASY' as const },
    { front: 'Parting of the Sea', back: 'Allāh commanded Mūsā عليه السلام to strike the sea with his staff. The sea split into paths, allowing Banū Isrā\'īl to cross. Fir\'awn and his army drowned when the sea closed.', frontArabic: null, backArabic: null, category: 'event', tags: ['tārīkh', 'mūsā', 'miracle'], difficulty: 'EASY' as const },
    { front: 'Ṭūr Sīnā', back: 'The mountain where Allāh spoke directly to Mūsā عليه السلام and gave him the Tawrāh. Mūsā عليه السلام is called Kalīmullāh (the one Allāh spoke to).', frontArabic: 'طُور سِينَاء', backArabic: null, category: 'place', tags: ['tārīkh', 'mūsā', 'ṭūr'], difficulty: 'MEDIUM' as const },
    { front: '\'Īsā عليه السلام', back: 'A great prophet born miraculously to Maryam عليها السلام without a father. He was given the Injīl, performed miracles, and was raised alive to the heavens.', frontArabic: 'عِيسَى عَلَيْهِ السَّلَام', backArabic: null, category: 'biography', tags: ['tārīkh', '\'īsā', 'prophet'], difficulty: 'EASY' as const },
    { front: 'Maryam عليها السلام', back: 'The mother of \'Īsā عليه السلام. She was a pious and devout woman. An entire sūrah of the Qur\'ān is named after her (Sūrah Maryam).', frontArabic: 'مَرْيَم عَلَيْهَا السَّلَام', backArabic: null, category: 'biography', tags: ['tārīkh', 'maryam', '\'īsā'], difficulty: 'EASY' as const },
    { front: 'Miracles of \'Īsā عليه السلام', back: 'By Allāh\'s permission: speaking in the cradle, curing the blind and lepers, giving life to the dead, and making a bird from clay that came alive.', frontArabic: null, backArabic: null, category: 'concept', tags: ['tārīkh', '\'īsā', 'miracles'], difficulty: 'MEDIUM' as const },
    { front: 'Raf\' (Ascension) of \'Īsā عليه السلام', back: '\'Īsā عليه السلام was not killed or crucified. Allāh raised him alive to the heavens. He will return before the Day of Judgement.', frontArabic: 'رَفْع عِيسَى', backArabic: null, category: 'event', tags: ['tārīkh', '\'īsā', 'ascension'], difficulty: 'MEDIUM' as const },
  ];

  await prisma.flashCard.createMany({
    data: tarikhFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitTarikh.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += tarikhFlashcards.length;

  // --- Aqā'id Flashcards (8) ---

  const aqaidFlashcards = [
    { front: 'Sakrāt al-Mawt', back: 'The pangs/agonies of death that every soul will experience. Even the Prophet ﷺ experienced sakrāt al-mawt.', frontArabic: 'سَكَرَات المَوْت', backArabic: null, category: 'concept', tags: ['aqā\'id', 'death', 'sakrāt'], difficulty: 'MEDIUM' as const },
    { front: 'Barzakh', back: 'The life of the grave — the period between death and the Day of Judgement. The deceased is questioned by Munkar and Nakīr and experiences either comfort or punishment.', frontArabic: 'بَرْزَخ', backArabic: null, category: 'vocabulary', tags: ['aqā\'id', 'grave', 'barzakh'], difficulty: 'MEDIUM' as const },
    { front: 'Munkar and Nakīr', back: 'Two angels who question every deceased person in the grave: "Who is your Lord? What is your religion? Who is this man (Muḥammad ﷺ)?"', frontArabic: 'مُنْكَر وَنَكِير', backArabic: null, category: 'vocabulary', tags: ['aqā\'id', 'grave', 'angels'], difficulty: 'EASY' as const },
    { front: 'Mīzān', back: 'The scale of justice on the Day of Judgement. Good deeds and bad deeds will be weighed. Those whose good deeds are heavier will enter Jannah.', frontArabic: 'مِيزَان', backArabic: null, category: 'vocabulary', tags: ['aqā\'id', 'judgement', 'mīzān'], difficulty: 'EASY' as const },
    { front: 'Ṣirāṭ', back: 'A bridge set over Jahannam that every person must cross. The believers will cross safely at various speeds, while the sinful may fall.', frontArabic: 'صِرَاط', backArabic: null, category: 'vocabulary', tags: ['aqā\'id', 'judgement', 'ṣirāṭ'], difficulty: 'MEDIUM' as const },
    { front: 'A\'rāf', back: 'The heights between Jannah and Jahannam. Those whose good and bad deeds are equal will be placed there temporarily before eventually entering Jannah by Allāh\'s mercy.', frontArabic: 'أَعْرَاف', backArabic: null, category: 'vocabulary', tags: ['aqā\'id', 'ākhirah', 'a\'rāf'], difficulty: 'MEDIUM' as const },
    { front: 'Al-Qadr', back: 'Divine decree — the belief that Allāh knows everything, has written it all in al-Lawḥ al-Maḥfūẓ, wills everything, and creates everything. It includes good and bad.', frontArabic: 'القَدْر', backArabic: null, category: 'concept', tags: ['aqā\'id', 'qadr', 'decree'], difficulty: 'MEDIUM' as const },
    { front: 'Jannah & Jahannam', back: 'Jannah is the eternal abode of bliss for the believers. Jahannam is the place of punishment for the disbelievers and sinful. Both are already created.', frontArabic: 'جَنَّة وَجَهَنَّم', backArabic: null, category: 'concept', tags: ['aqā\'id', 'ākhirah', 'jannah'], difficulty: 'EASY' as const },
  ];

  await prisma.flashCard.createMany({
    data: aqaidFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitAqaid.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += aqaidFlashcards.length;

  // --- Akhlāq Flashcards (7) ---

  const akhlaqFlashcards = [
    { front: 'Mashwarah (Consultation)', back: 'Seeking advice before making decisions. The Prophet ﷺ regularly consulted his Companions. Allāh praised the believers as those "whose affairs are by mutual consultation" (Qur\'ān 42:38).', frontArabic: 'مَشْوَرَة', backArabic: null, category: 'concept', tags: ['akhlāq', 'mashwarah', 'shūrā'], difficulty: 'EASY' as const },
    { front: 'Ṣabr (Patience)', back: 'Three types: patience on obedience to Allāh, patience in refraining from sin, and patience during trials. Allāh says: "Indeed, Allāh is with the patient" (Qur\'ān 2:153).', frontArabic: 'صَبْر', backArabic: null, category: 'concept', tags: ['akhlāq', 'ṣabr', 'patience'], difficulty: 'EASY' as const },
    { front: 'Ṣilah al-Raḥim', back: 'Maintaining family ties — visiting relatives, helping them, and treating them kindly. The Prophet ﷺ warned that the one who cuts ties will not enter Jannah.', frontArabic: 'صِلَة الرَّحِم', backArabic: null, category: 'concept', tags: ['akhlāq', 'family', 'ties'], difficulty: 'EASY' as const },
    { front: 'Hadiyyah (Gift-Giving)', back: '"Give gifts to one another, for gifts remove malice from the heart." The Prophet ﷺ encouraged exchanging gifts to increase love and brotherhood.', frontArabic: 'هَدِيَّة', backArabic: null, category: 'concept', tags: ['akhlāq', 'gifts', 'hadiyyah'], difficulty: 'EASY' as const },
    { front: 'Dhikr (Remembrance of Allāh)', back: 'Remembering Allāh through SubḥānAllāh, Alḥamdulillāh, Allāhu Akbar, istighfār, and other phrases. The Prophet ﷺ said: "Keep your tongue moist with the dhikr of Allāh."', frontArabic: 'ذِكْر', backArabic: null, category: 'concept', tags: ['akhlāq', 'dhikr', 'remembrance'], difficulty: 'EASY' as const },
    { front: 'Shukr (Gratitude)', back: 'Being thankful to Allāh for His blessings. Allāh says: "If you are grateful, I will increase you" (Qur\'ān 14:7). Gratitude is expressed by heart, tongue, and actions.', frontArabic: 'شُكْر', backArabic: null, category: 'concept', tags: ['akhlāq', 'gratitude', 'shukr'], difficulty: 'EASY' as const },
    { front: 'Tawbah (Repentance)', back: 'Turning back to Allāh after sinning. Conditions: stop the sin, regret it, and resolve not to return to it. Allāh loves those who repent.', frontArabic: 'تَوْبَة', backArabic: null, category: 'concept', tags: ['akhlāq', 'repentance', 'tawbah'], difficulty: 'MEDIUM' as const },
  ];

  await prisma.flashCard.createMany({
    data: akhlaqFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitAkhlaq.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += akhlaqFlashcards.length;

  // --- Ādāb Flashcards (7) ---

  const adabFlashcards = [
    { front: 'Farā\'iḍ of Ghusl', back: 'Three obligatory acts: gargling (rinsing the mouth thoroughly), sniffing water into the nose, and washing the entire body so no dry spot remains.', frontArabic: 'فَرَائِض الغُسْل', backArabic: null, category: 'concept', tags: ['ādāb', 'ghusl', 'farā\'iḍ'], difficulty: 'MEDIUM' as const },
    { front: 'Ādāb of Social Interaction', back: 'Greet with salām, shake hands, smile, do not sit in someone\'s place, and give space in gatherings. The Prophet ﷺ was the best in social conduct.', frontArabic: null, backArabic: null, category: 'concept', tags: ['ādāb', 'social', 'interaction'], difficulty: 'EASY' as const },
    { front: 'Bismillāh before Writing', back: 'It is from Islamic etiquette to begin any letter, document, or piece of writing with Bismillāh al-Raḥmān al-Raḥīm.', frontArabic: 'بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ', backArabic: null, category: 'concept', tags: ['ādāb', 'writing', 'bismillāh'], difficulty: 'EASY' as const },
    { front: 'Miswāk', back: 'A natural twig used for cleaning teeth. It is a sunnah mu\'akkadah (emphasized sunnah), especially before ṣalāh, wuḍū\', and reciting Qur\'ān.', frontArabic: 'مِسْوَاك', backArabic: null, category: 'vocabulary', tags: ['ādāb', 'miswāk', 'sunnah'], difficulty: 'EASY' as const },
    { front: '\'Iyādah (Visiting the Sick)', back: 'A right of every Muslim. The Prophet ﷺ said one who visits the sick is in a garden of Jannah. Make du\'ā\' for their recovery and keep the visit short.', frontArabic: 'عِيَادَة', backArabic: null, category: 'concept', tags: ['ādāb', 'sick', '\'iyādah'], difficulty: 'EASY' as const },
    { front: 'Du\'ā\' for the Sick', back: '"As\'alullāh al-\'Aẓīm Rabb al-\'Arsh al-\'Aẓīm an yashfiyak" — I ask Allāh the Almighty, Lord of the Mighty Throne, to cure you. Recite seven times.', frontArabic: 'أَسْأَلُ اللَّهَ العَظِيمَ رَبَّ العَرْشِ العَظِيمِ أَنْ يَشْفِيَكَ', backArabic: null, category: 'du\'ā\'', tags: ['ādāb', 'sick', 'du\'ā\''], difficulty: 'MEDIUM' as const },
    { front: 'Good Handwriting', back: 'Islam encourages neat and clear handwriting. The Prophet ﷺ and the Companions valued clear writing for preserving knowledge and communicating effectively.', frontArabic: null, backArabic: null, category: 'concept', tags: ['ādāb', 'writing', 'handwriting'], difficulty: 'EASY' as const },
  ];

  await prisma.flashCard.createMany({
    data: adabFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitAdab.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += adabFlashcards.length;

  console.log('✅ Created flashcards for all 7 units');

  // ══════════════════════════════════════════════
  // ARABIC TERMS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🔤 Creating Arabic terms...');

  await prisma.arabicTerm.createMany({
    data: [
      // Fiqh terms (10)
      { unitId: unitFiqh.id, arabicText: 'تَيَمُّم', transliteration: 'Tayammum', translation: 'Dry ablution using soil when water is unavailable' },
      { unitId: unitFiqh.id, arabicText: 'مَسْبُوق', transliteration: 'Masbūq', translation: 'One who misses rak\'āt behind the imām' },
      { unitId: unitFiqh.id, arabicText: 'قَضَاء', transliteration: 'Qaḍā\'', translation: 'Making up missed obligatory prayers' },
      { unitId: unitFiqh.id, arabicText: 'إِحْرَام', transliteration: 'Iḥrām', translation: 'Sacred state entered for ḥajj or \'umrah' },
      { unitId: unitFiqh.id, arabicText: 'تَلْبِيَة', transliteration: 'Talbiyah', translation: 'The du\'ā\' recited when entering iḥrām' },
      { unitId: unitFiqh.id, arabicText: 'سَعْي', transliteration: 'Sa\'y', translation: 'Walking between Ṣafā and Marwah seven times' },
      { unitId: unitFiqh.id, arabicText: 'طَوَاف', transliteration: 'Ṭawāf', translation: 'Circling the Ka\'bah seven times' },
      { unitId: unitFiqh.id, arabicText: 'مِيقَات', transliteration: 'Mīqāt', translation: 'Boundary where iḥrām becomes compulsory' },
      { unitId: unitFiqh.id, arabicText: 'حَلَق', transliteration: 'Ḥalaq', translation: 'Shaving the head after ḥajj or \'umrah' },
      { unitId: unitFiqh.id, arabicText: 'صَدَقَة الفِطْر', transliteration: 'Ṣadaqah al-Fiṭr', translation: 'Compulsory charity given before \'Īd al-Fiṭr ṣalāh' },
      // Aḥādīth terms (4)
      { unitId: unitAhadith.id, arabicText: 'غِيبَة', transliteration: 'Ghībah', translation: 'Backbiting — speaking ill of someone in their absence' },
      { unitId: unitAhadith.id, arabicText: 'مُفْلِس', transliteration: 'Muflīs', translation: 'Spiritually bankrupt — one whose good deeds are taken on Judgement Day' },
      { unitId: unitAhadith.id, arabicText: 'إِحْصَاء', transliteration: 'Iḥṣā\'', translation: 'Comprehending and acting upon the 99 Names of Allāh' },
      { unitId: unitAhadith.id, arabicText: 'مُعَوِّذَات', transliteration: 'Mu\'awwidhāt', translation: 'Sūrahs al-Ikhlāṣ, al-Falaq, an-Nās — recited for protection' },
      // Sīrah terms (3)
      { unitId: unitSirah.id, arabicText: 'صُلْح', transliteration: 'Ṣulḥ', translation: 'Treaty / peace agreement' },
      { unitId: unitSirah.id, arabicText: 'بَيْعَة', transliteration: 'Bay\'ah', translation: 'Pledge of allegiance' },
      { unitId: unitSirah.id, arabicText: 'حَجَّة الوَدَاع', transliteration: 'Ḥajjatul Wadā\'', translation: 'The farewell pilgrimage of Rasūlullāh ﷺ' },
      // Tārīkh terms (3)
      { unitId: unitTarikh.id, arabicText: 'حَوَارِيُّون', transliteration: 'Ḥawāriyyūn', translation: 'The disciples of \'Īsā عليه السلام' },
      { unitId: unitTarikh.id, arabicText: 'تَوْرَاة', transliteration: 'Tawrāh', translation: 'The scripture revealed to Mūsā عليه السلام' },
      { unitId: unitTarikh.id, arabicText: 'بَنِي إِسْرَائِيل', transliteration: 'Banī Isrā\'īl', translation: 'The Children of Israel — descendants of Ya\'qūb عليه السلام' },
      // Aqā'id terms (5)
      { unitId: unitAqaid.id, arabicText: 'بَرْزَخ', transliteration: 'Barzakh', translation: 'The life of the grave between death and resurrection' },
      { unitId: unitAqaid.id, arabicText: 'القَدَر', transliteration: 'Al-Qadr', translation: 'Fate — the belief that everything is ordained by Allāh' },
      { unitId: unitAqaid.id, arabicText: 'عِلِّيُّون', transliteration: '\'Illiyyūn', translation: 'Register in the Seventh Heaven for the righteous' },
      { unitId: unitAqaid.id, arabicText: 'سِجِّين', transliteration: 'Sijjīn', translation: 'Register for the wicked in the lowest earth' },
      { unitId: unitAqaid.id, arabicText: 'أَعْرَاف', transliteration: 'A\'rāf', translation: 'Place between Jannah and Jahannam' },
      // Akhlāq terms (3)
      { unitId: unitAkhlaq.id, arabicText: 'مَشْوَرَة', transliteration: 'Mashwarah', translation: 'Consultation — seeking advice before decisions' },
      { unitId: unitAkhlaq.id, arabicText: 'صَبْر', transliteration: 'Ṣabr', translation: 'Patience — in obedience, abstinence, and endurance' },
      { unitId: unitAkhlaq.id, arabicText: 'ذِكْر', transliteration: 'Dhikr', translation: 'Remembrance of Allāh' },
      // Ādāb terms (2)
      { unitId: unitAdab.id, arabicText: 'غُسْل', transliteration: 'Ghusl', translation: 'Full ritual bath / body wash' },
      { unitId: unitAdab.id, arabicText: 'مِسْوَاك', transliteration: 'Miswāk', translation: 'Natural toothbrush twig — sunnah to use' },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 Maktab Coursebook 5 seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: Maktab Coursebook 5 (ages 10-11)');
  console.log('   - 7 Units: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā\'id, Akhlāq, Ādāb');
  console.log(`   - ${7 + 5 + 6 + 5 + 6 + 5 + 5} Quiz questions (39 total)`);
  console.log(`   - ${flashcardIndex} Flashcards`);
  console.log(`   - 30 Arabic terms`);
}

// Allow standalone execution
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
