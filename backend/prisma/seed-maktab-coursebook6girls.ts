import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 6 (Girls) — Islamic Curriculum Seed
 * Source: An Nasihah Publications, Age Range: 11–12 years
 *
 * Covers seven subjects: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā'id, Akhlāq, Ādāb
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions, flashcards and Arabic terms per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-coursebook6girls.ts
 */

export async function seedMaktabCoursebook6Girls() {
  console.log('📚 Starting Maktab Coursebook 6 (Girls) seed...');
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
    where: { title: 'An Nasihah Coursebook 6 (Girls)' },
  });
  if (existing) {
    console.log('⏭️  An Nasihah Coursebook 6 (Girls) already exists — skipping.');
    return;
  }

  // ──────────────────────────────────────────────
  // COURSE
  // ──────────────────────────────────────────────

  const course = await prisma.course.create({
    data: {
      title: 'An Nasihah Coursebook 6 (Girls)',
      description:
        'A comprehensive Islamic curriculum for girls aged 11–12 covering advanced fiqh (water, impurities, maturity, ghusl, wājib acts of ṣalāh, janāzah ṣalāh), selected aḥādīth with Arabic text and explanation, shamāʾil of the Prophet ﷺ and the life of Abū Bakr al-Ṣiddīq, stories of Dāwūd, Sulaymān and Yūnus, the Umayyad dynasty, beliefs of Ahlus Sunnah wal-Jamāʿah (prophethood, miracles, Isrāʾ wal-Miʿrāj), character development (ẓulm, ḥasad, ghībah, kibr, following the Sunnah), and daily ādāb (adhān etiquette, modesty in dress, sunan al-fiṭrah). Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['PRE_TEEN', 'TEEN'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);
  // ============================================================
  // UNIT 1: FIQH
  // ============================================================
  const unitFiqh = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Fiqh — Water, Impurities, Maturity, Ghusl, Wājib Acts & Janāzah',
      description:
        'Advanced fiqh topics including the three types of water, najāsah ghalīẓah and khafīfah, the signs of maturity (bulūgh) for girls, the farāʾiḍ of ghusl, wājib acts in ṣalāh, and janāzah ṣalāh with its four takbīrāt.',
      orderIndex: 0,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Classify water into its three Sharʿī categories and determine which can be used for purification.</li>
  <li>Distinguish between najāsah ghalīẓah and najāsah khafīfah and know the excused amounts of each.</li>
  <li>Identify the signs of bulūgh (maturity) for a girl and understand the responsibilities that follow.</li>
  <li>List the three farāʾiḍ of ghusl and perform it correctly.</li>
  <li>Enumerate the wājib acts of ṣalāh and explain what happens when one is missed.</li>
  <li>Describe the method and rulings of janāzah ṣalāh.</li>
</ul>

<h2>Water (Miyāh)</h2>
<p>Water is the primary means of purification in Islām. The Sharīʿah classifies water into three categories based on its purity and its ability to remove ḥadath (ritual impurity) and najāsah (physical filth).</p>

<h3>1. Ṭāhir Muṭahhir (Pure and Purifying)</h3>
<p>This is water in its natural state that can be used for wuḍūʾ and ghusl. It includes:</p>
<ul>
  <li>Rainwater, river water, sea water, spring water, well water.</li>
  <li>Melted snow and ice.</li>
</ul>
<p>As long as none of its three essential qualities — <strong>colour</strong>, <strong>taste</strong>, or <strong>smell</strong> — have changed due to an impurity, it remains ṭāhir muṭahhir.</p>

<h3>2. Ṭāhir Ghayr Muṭahhir (Pure but Not Purifying)</h3>
<p>This water is clean in itself but cannot be used for wuḍūʾ or ghusl. Examples:</p>
<ul>
  <li>Used water (māʾ mustaʿmal) — water that has already been used for wuḍūʾ or ghusl.</li>
  <li>Water that has been mixed with a pure substance (e.g., saffron, soap, fruit) such that it loses its natural thinness.</li>
</ul>

<h3>3. Najis (Impure Water)</h3>
<p>Water into which an impurity has fallen and changed its colour, taste, or smell. Such water cannot be used for purification or drinking.</p>
<p>For large bodies of water (approximately 5m × 5m or more), impurity on one side does not affect the other side if no change in the three qualities is apparent.</p>

<h2>Impurities (Najāsah)</h2>
<p>Najāsah refers to physical impurity that must be removed before ṣalāh. It is of two types:</p>

<h3>Najāsah Ghalīẓah (Heavy Impurity)</h3>
<p>Examples include human urine, stool, flowing blood, wine (khamr), and the urine or dung of ḥarām animals.</p>
<p><strong>Excused amount:</strong> Up to the size of a dirham (approximately 5 cm in diameter) on the body or clothing. Beyond this, ṣalāh is not valid.</p>

<h3>Najāsah Khafīfah (Light Impurity)</h3>
<p>Examples include the urine of ḥalāl animals (e.g., cow, goat) and the droppings of birds whose flesh is ḥarām.</p>
<p><strong>Excused amount:</strong> Up to one quarter (¼) of the affected garment or limb. Beyond this, ṣalāh is not valid.</p>

<h2>Maturity (Bulūgh) for Girls</h2>
<p>A girl reaches maturity (bulūgh) by any one of the following signs:</p>
<ul>
  <li><strong>Ḥayḍ</strong> (menstruation) — the most common sign for girls.</li>
  <li><strong>Iḥtilām</strong> (a wet dream).</li>
  <li>Reaching the age of <strong>15 lunar years</strong> (the latest possible age).</li>
</ul>
<p>Once any sign appears, she is <em>mukallafah</em> — all Sharʿī obligations (ṣalāh, ṣawm, ḥijāb, etc.) become binding upon her. She must learn the rulings of ḥayḍ, istiḥāḍah, and ghusl.</p>
<p><em>A responsible Muslimah prepares for these changes by studying fiqh before they occur.</em></p>

<h2>Ghusl (Ritual Bath)</h2>
<p>Ghusl becomes farḍ upon a girl after:</p>
<ul>
  <li>The ending of ḥayḍ (menstruation).</li>
  <li>The ending of nifās (post-natal bleeding).</li>
  <li>Janābah (sexual discharge).</li>
</ul>

<h3>The Three Farāʾiḍ of Ghusl</h3>
<ol>
  <li><strong>Maḍmaḍah</strong> — rinsing the mouth thoroughly so water reaches every part.</li>
  <li><strong>Istinshāq</strong> — sniffing water into the nose up to the soft bone.</li>
  <li><strong>Washing the entire body</strong> so that no spot — not even a hair's breadth — remains dry.</li>
</ol>
<p>If any one of these three is missed, the ghusl is incomplete and ṣalāh cannot be performed.</p>

<h2>Wājib Acts in Ṣalāh</h2>
<p>A wājib is an action whose obligation is established by strong evidence. Missing a wājib deliberately invalidates the ṣalāh; missing it by mistake requires <strong>sajdah sahw</strong> (two prostrations of forgetfulness) at the end.</p>
<ul>
  <li>Reciting Sūrah al-Fātiḥah in every rakʿah.</li>
  <li>Joining a sūrah or at least three short āyāt after al-Fātiḥah in the first two rakʿahs of farḍ.</li>
  <li>Performing rukūʿ and sajdah with ṭumaʾnīnah (calmness and stillness).</li>
  <li>Sitting for the first qaʿdah (qaʿdah ūlā) in three- or four-rakʿah prayers.</li>
  <li>Reciting at-Taḥiyyāt in both sittings.</li>
  <li>Reciting aloud or silently in their proper places (jahri and sirrī).</li>
  <li>Ending the ṣalāh with the word <em>"as-Salāmu"</em> in the taslīm.</li>
  <li>Reciting duʿāʾ al-qunūt in witr ṣalāh.</li>
  <li>Saying the additional takbīrāt of the ʿĪdayn prayers.</li>
</ul>

<h2>Janāzah Ṣalāh (Funeral Prayer)</h2>
<p>The funeral prayer is <strong>farḍ kifāyah</strong> — if some Muslims perform it, the obligation is lifted from the rest. It has <strong>four takbīrāt</strong> and no rukūʿ or sajdah:</p>
<ol>
  <li><strong>First takbīr:</strong> Recite thanāʾ (Subḥānaka Allāhumma…).</li>
  <li><strong>Second takbīr:</strong> Recite durūd Ibrāhīmī.</li>
  <li><strong>Third takbīr:</strong> Make duʿāʾ for the deceased.</li>
  <li><strong>Fourth takbīr:</strong> Turn and give salām to both sides.</li>
</ol>
<p>The body is placed in front of the imām. The imām stands at the chest level of a male and at the waist level of a female deceased.</p>

<p class="arabic" dir="rtl" lang="ar">كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ ثُمَّ إِلَيْنَا تُرْجَعُونَ</p>
<p><em>"Every soul shall taste death. Then to Us you will be returned." — Sūrah al-ʿAnkabūt 29:57</em></p>
      `,
    },
  });
  console.log('✅ Created Unit 1: Fiqh');
  // ============================================================
  // UNIT 2: AḤĀDĪTH
  // ============================================================
  const unitAhadith = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Aḥādīth — Fifteen Selected Traditions',
      description:
        'A collection of fifteen carefully selected aḥādīth covering core Islamic teachings — with Arabic text, transliteration, translation and brief explanation for each.',
      orderIndex: 1,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Read and recite the Arabic text of each ḥadīth with correct pronunciation.</li>
  <li>Understand the meaning and context of each tradition.</li>
  <li>Explain how each ḥadīth applies to daily Muslim life.</li>
  <li>Identify the narrator and source collection of key aḥādīth.</li>
</ul>

<h2>Selected Aḥādīth</h2>

<h3>1. Actions Are by Intentions</h3>
<p class="arabic" dir="rtl" lang="ar">إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى</p>
<p><strong>Transliteration:</strong> <em>Innamal-aʿmālu bin-niyyāt, wa innamā li kulli-mriʾin mā nawā.</em></p>
<p><strong>Translation:</strong> "Actions are judged by intentions, and every person shall have what they intended." — <em>Bukhārī &amp; Muslim</em></p>
<p>This foundational ḥadīth teaches that every deed — worship, work, or daily action — is only accepted by Allāh if done with a sincere intention (niyyah).</p>

<h3>2. The Best of You</h3>
<p class="arabic" dir="rtl" lang="ar">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</p>
<p><strong>Transliteration:</strong> <em>Khayrukum man taʿallama-l-Qurʾāna wa ʿallamahu.</em></p>
<p><strong>Translation:</strong> "The best of you are those who learn the Qurʾān and teach it." — <em>Bukhārī</em></p>
<p>Learning and teaching the Qurʾān is one of the noblest acts. This includes learning to recite correctly, understanding its meanings, and passing it on.</p>

<h3>3. Modesty (Ḥayāʾ)</h3>
<p class="arabic" dir="rtl" lang="ar">الْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ</p>
<p><strong>Transliteration:</strong> <em>Al-ḥayāʾu shuʿbatun minal-īmān.</em></p>
<p><strong>Translation:</strong> "Modesty is a branch of faith." — <em>Bukhārī &amp; Muslim</em></p>
<p>Ḥayāʾ (modesty, shyness before Allāh and people) is not weakness — it is a sign of strong īmān. It prevents a person from committing sins openly.</p>

<h3>4. Kindness to Parents</h3>
<p class="arabic" dir="rtl" lang="ar">رَضَا اللَّهِ فِي رَضَا الْوَالِدَيْنِ وَسَخَطُ اللَّهِ فِي سَخَطِ الْوَالِدَيْنِ</p>
<p><strong>Transliteration:</strong> <em>Riḍā-llāhi fī riḍā-l-wālidayn, wa sakhaṭu-llāhi fī sakhaṭi-l-wālidayn.</em></p>
<p><strong>Translation:</strong> "The pleasure of Allāh is in the pleasure of the parents, and the anger of Allāh is in the anger of the parents." — <em>Tirmidhī</em></p>
<p>Honouring parents is among the greatest obligations after tawḥīd. Disobedience to them (ʿuqūq) is a major sin.</p>

<h3>5. Truthfulness</h3>
<p class="arabic" dir="rtl" lang="ar">عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ</p>
<p><strong>Transliteration:</strong> <em>ʿAlaykum biṣ-ṣidqi fa inna-ṣ-ṣidqa yahdī ilal-birr, wa innal-birra yahdī ilal-Jannah.</em></p>
<p><strong>Translation:</strong> "Hold fast to truthfulness, for truthfulness leads to righteousness and righteousness leads to Paradise." — <em>Bukhārī &amp; Muslim</em></p>
<p>A believer must always speak the truth even if it is difficult.</p>

<h3>6. Forbiddance of Backbiting</h3>
<p class="arabic" dir="rtl" lang="ar">أَتَدْرُونَ مَا الْغِيبَةُ؟ ذِكْرُكَ أَخَاكَ بِمَا يَكْرَهُ</p>
<p><strong>Transliteration:</strong> <em>Atadrūna mal-ghībah? Dhikruka akhāka bimā yakrah.</em></p>
<p><strong>Translation:</strong> "Do you know what backbiting is? It is mentioning your brother with what he dislikes." — <em>Muslim</em></p>
<p>Even if what you say is true, it is still ghībah. If it is false, it becomes buhtān (slander), which is even more severe.</p>

<h3>7. Removing Harm from the Path</h3>
<p class="arabic" dir="rtl" lang="ar">الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً وَأَدْنَاهَا إِمَاطَةُ الْأَذَى عَنِ الطَّرِيقِ</p>
<p><strong>Transliteration:</strong> <em>Al-īmānu biḍʿun wa sabʿūna shuʿbah, wa adnāhā imāṭatul-adhā ʿani-ṭ-ṭarīq.</em></p>
<p><strong>Translation:</strong> "Faith has seventy-odd branches, and the lowest of them is removing harm from the path." — <em>Muslim</em></p>
<p>Even a small good deed like clearing an obstacle from the road is a branch of faith.</p>

<h3>8. The Tongue and Private Parts</h3>
<p class="arabic" dir="rtl" lang="ar">مَنْ يَضْمَنْ لِي مَا بَيْنَ لَحْيَيْهِ وَمَا بَيْنَ رِجْلَيْهِ أَضْمَنْ لَهُ الْجَنَّةَ</p>
<p><strong>Transliteration:</strong> <em>Man yaḍman lī mā bayna laḥyayhi wa mā bayna rijlayhi aḍman lahu-l-Jannah.</em></p>
<p><strong>Translation:</strong> "Whoever guarantees me what is between his jaws and what is between his legs, I guarantee him Paradise." — <em>Bukhārī</em></p>
<p>Guarding the tongue from evil speech and guarding one's chastity are keys to Paradise.</p>

<h3>9. Gentleness</h3>
<p class="arabic" dir="rtl" lang="ar">إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ</p>
<p><strong>Transliteration:</strong> <em>Inna-llāha Rafīqun yuḥibbu-r-rifqa fil-amri kullih.</em></p>
<p><strong>Translation:</strong> "Indeed Allāh is Gentle and loves gentleness in all matters." — <em>Bukhārī &amp; Muslim</em></p>
<p>Harshness pushes people away; gentleness draws them closer to good.</p>

<h3>10. Visiting the Sick</h3>
<p class="arabic" dir="rtl" lang="ar">مَنْ عَادَ مَرِيضًا لَمْ يَزَلْ فِي خُرْفَةِ الْجَنَّةِ حَتَّى يَرْجِعَ</p>
<p><strong>Transliteration:</strong> <em>Man ʿāda marīḍan lam yazal fī khurfati-l-Jannati ḥattā yarjiʿ.</em></p>
<p><strong>Translation:</strong> "Whoever visits a sick person continues to be in the harvest of Paradise until they return." — <em>Muslim</em></p>
<p>Visiting the sick is a right of every Muslim upon another and a means of immense reward.</p>

<h3>11. The Strong Believer</h3>
<p class="arabic" dir="rtl" lang="ar">الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ</p>
<p><strong>Transliteration:</strong> <em>Al-muʾminu-l-qawiyyu khayrun wa aḥabbu ila-llāhi minal-muʾmini-ḍ-ḍaʿīf.</em></p>
<p><strong>Translation:</strong> "The strong believer is better and more beloved to Allāh than the weak believer." — <em>Muslim</em></p>
<p>Strength here refers to strength of faith, resolve and beneficial action — not mere physical power.</p>

<h3>12. Supplicating for Others</h3>
<p class="arabic" dir="rtl" lang="ar">دَعْوَةُ الْمَرْءِ الْمُسْلِمِ لِأَخِيهِ بِظَهْرِ الْغَيْبِ مُسْتَجَابَة</p>
<p><strong>Transliteration:</strong> <em>Daʿwatu-l-marʾi-l-muslimi li akhīhi bi ẓahri-l-ghaybi mustajābah.</em></p>
<p><strong>Translation:</strong> "The supplication of a Muslim for his brother in his absence is answered." — <em>Muslim</em></p>
<p>Making duʿāʾ for others without their knowledge is a sign of sincere love and is readily accepted.</p>

<h3>13. Cleanliness</h3>
<p class="arabic" dir="rtl" lang="ar">الطُّهُورُ شَطْرُ الْإِيمَانِ</p>
<p><strong>Transliteration:</strong> <em>Aṭ-ṭuhūru shaṭru-l-īmān.</em></p>
<p><strong>Translation:</strong> "Purification is half of faith." — <em>Muslim</em></p>
<p>Islām places great emphasis on cleanliness — of the body, clothes, surroundings and heart.</p>

<h3>14. The World Is a Prison</h3>
<p class="arabic" dir="rtl" lang="ar">الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ</p>
<p><strong>Transliteration:</strong> <em>Ad-dunyā sijnu-l-muʾmini wa jannatu-l-kāfir.</em></p>
<p><strong>Translation:</strong> "The world is a prison for the believer and a paradise for the disbeliever." — <em>Muslim</em></p>
<p>The believer restrains themselves from forbidden desires, while the true reward awaits in the Hereafter.</p>

<h3>15. Love for Others</h3>
<p class="arabic" dir="rtl" lang="ar">لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ</p>
<p><strong>Transliteration:</strong> <em>Lā yuʾminu aḥadukum ḥattā yuḥibba li akhīhi mā yuḥibbu li nafsih.</em></p>
<p><strong>Translation:</strong> "None of you truly believes until he loves for his brother what he loves for himself." — <em>Bukhārī &amp; Muslim</em></p>
<p>True faith is incomplete without genuine concern for others' well-being.</p>
      `,
    },
  });
  console.log('✅ Created Unit 2: Aḥādīth');
  // ============================================================
  // UNIT 3: SĪRAH
  // ============================================================
  const unitSirah = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Sīrah — Shamāʾil of the Prophet ﷺ & the Life of Abū Bakr al-Ṣiddīq',
      description:
        'Part A covers the shamāʾil — the noble physical description, character and daily habits of the Prophet ﷺ. Part B covers the life of Abū Bakr al-Ṣiddīq رضي الله عنه from his early acceptance of Islām to his khilāfah.',
      orderIndex: 2,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Describe the blessed physical appearance of the Prophet ﷺ from authentic narrations.</li>
  <li>Explain key character traits and daily habits of the Prophet ﷺ.</li>
  <li>Narrate the life of Abū Bakr al-Ṣiddīq رضي الله عنه and his major contributions to Islām.</li>
  <li>Appreciate the close bond between the Prophet ﷺ and Abū Bakr.</li>
</ul>

<h2>Part A: Shamāʾil — The Noble Description of the Prophet ﷺ</h2>
<p>The shamāʾil are the descriptions of the blessed body, character, manners and daily habits of the Messenger of Allāh ﷺ. The most famous collection is <em>al-Shamāʾil al-Muḥammadiyyah</em> by Imām al-Tirmidhī (d. 279 AH).</p>

<h3>Physical Description</h3>
<ul>
  <li>He was of <strong>medium height</strong> — neither very tall nor very short.</li>
  <li>His blessed <strong>complexion</strong> was bright and luminous, with a slight wheatish hue; his face shone like the full moon.</li>
  <li>His <strong>hair</strong> was neither completely straight nor very curly, reaching his earlobes or sometimes his shoulders.</li>
  <li>His <strong>eyes</strong> were deep black with long, beautiful lashes; his gaze was gentle yet commanding.</li>
  <li>His <strong>chest</strong> was broad and between his shoulders was the <em>khātam an-nubuwwah</em> (seal of prophethood).</li>
  <li>He <strong>walked briskly</strong>, as though descending from a height, with a natural grace.</li>
  <li>His <strong>smile</strong> would light up his face; his laugh was mostly a smile — he did not laugh loudly.</li>
  <li>His blessed <strong>perspiration</strong> smelt more fragrant than musk.</li>
</ul>

<h3>Character and Habits</h3>
<ul>
  <li>He was the <strong>most generous</strong> of people, especially in the month of Ramaḍān.</li>
  <li>He was known as <strong>al-Ṣādiq al-Amīn</strong> (the Truthful, the Trustworthy) even before prophethood.</li>
  <li>He <strong>never raised his voice</strong> in the marketplace, never returned evil with evil, and always pardoned.</li>
  <li>He <strong>helped his family</strong> with household chores — mending his own shoes and clothes, milking his goat, and serving himself.</li>
  <li>He <strong>loved cleanliness</strong>, the colour white, and the fragrance of ʿūd and musk.</li>
  <li>He ate whatever was placed before him and <strong>never criticised</strong> food.</li>
  <li>He was the <strong>most courageous</strong> of people, always in the front line, yet the <strong>most merciful</strong> towards children, women and the weak.</li>
</ul>

<p class="arabic" dir="rtl" lang="ar">وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ</p>
<p><em>"Indeed you are upon a magnificent character." — Sūrah al-Qalam 68:4</em></p>

<h2>Part B: Abū Bakr al-Ṣiddīq رضي الله عنه</h2>
<p>His full name was <strong>ʿAbdullāh ibn ʿUthmān</strong>, of the clan of Banū Taym of Quraysh. He was about two years younger than the Prophet ﷺ and was a wealthy, respected merchant of Makkah known for his gentle nature, honesty and deep knowledge of Arab genealogy.</p>

<h3>Accepting Islām</h3>
<p>He was the <strong>first free adult man</strong> to accept Islām, without any hesitation. He said: <em>"You have spoken the truth, O Messenger of Allāh."</em> Through his daʿwah, six of the ten promised Paradise entered Islām: ʿUthmān, Zubayr, Ṭalḥah, Saʿd ibn Abī Waqqāṣ, ʿAbd ar-Raḥmān ibn ʿAwf, and Abū ʿUbaydah.</p>

<h3>Sacrifice and Trials</h3>
<p>He spent his wealth freeing enslaved Muslims — notably <strong>Bilāl ibn Rabāḥ</strong>. He endured persecution alongside the Prophet ﷺ and never wavered in his faith.</p>

<h3>Companion of the Cave (Ṣāḥib al-Ghār)</h3>
<p>During the Hijrah, he accompanied the Prophet ﷺ. They hid in the <strong>cave of Thawr</strong> for three nights while the Quraysh searched for them. Allāh ﷻ mentions this in the Qurʾān:</p>
<p class="arabic" dir="rtl" lang="ar">ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ إِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا</p>
<p><em>"The second of two, when they were in the cave, when he said to his companion: 'Do not grieve, indeed Allāh is with us.'" — Sūrah at-Tawbah 9:40</em></p>

<h3>The First Khalīfah</h3>
<p>After the passing of the Prophet ﷺ in 11 AH, Abū Bakr was chosen as the first Khalīfah. His khilāfah lasted approximately <strong>two and a half years</strong> (11–13 AH). Major events include:</p>
<ul>
  <li>The <strong>Ridda Wars</strong> — campaigns against apostates and false prophets who emerged after the Prophet's passing.</li>
  <li>The <strong>first compilation of the Qurʾān</strong> into a single muṣḥaf, on the suggestion of ʿUmar رضي الله عنه, carried out by Zayd ibn Thābit رضي الله عنه.</li>
  <li>The beginning of the <strong>conquests of ʿIrāq and Shām</strong>.</li>
</ul>
<p>He passed away in <strong>13 AH</strong> at the age of 63 and is buried beside the Prophet ﷺ in the ḥujrah (chamber) of ʿĀʾishah رضي الله عنها in al-Madīnah al-Munawwarah.</p>
      `,
    },
  });
  console.log('✅ Created Unit 3: Sīrah');
  // ============================================================
  // UNIT 4: TĀRĪKH
  // ============================================================
  const unitTarikh = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Tārīkh — Prophets Dāwūd, Sulaymān & Yūnus, and the Umayyad Dynasty',
      description:
        'Stories of the prophets Dāwūd, Sulaymān and Yūnus عليهم السلام from the Qurʾān, followed by an overview of the Umayyad dynasty — its founding, key rulers, expansion of Islām, and eventual decline.',
      orderIndex: 3,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Narrate the key events in the lives of Dāwūd, Sulaymān and Yūnus عليهم السلام.</li>
  <li>Identify the special gifts Allāh bestowed upon each prophet.</li>
  <li>Describe the founding, key rulers and major achievements of the Umayyad dynasty.</li>
  <li>Explain the causes of the Umayyad decline and the transition to the ʿAbbāsids.</li>
</ul>

<h2>Dāwūd عليه السلام</h2>
<p>Dāwūd عليه السلام lived among the Banū Isrāʾīl at a time when the tyrant <strong>Jālūt</strong> (Goliath) oppressed the believers. The Banū Isrāʾīl asked their prophet to appoint a king; Allāh chose <strong>Ṭālūt</strong> (Saul). When Ṭālūt's army met Jālūt's forces, young Dāwūd killed the giant with a stone from his sling.</p>
<p>Allāh granted Dāwūd عليه السلام many gifts:</p>
<ul>
  <li><strong>Nubuwwah</strong> (prophethood) and a great kingdom over Banū Isrāʾīl.</li>
  <li>The <strong>Zabūr</strong> (Psalms) — a revealed scripture.</li>
  <li>The ability to <strong>soften iron</strong> with his bare hands to make armour.</li>
  <li>A <strong>beautiful voice</strong> — so magnificent that the mountains and birds joined him in the glorification (tasbīḥ) of Allāh.</li>
</ul>
<p class="arabic" dir="rtl" lang="ar">وَأَلَنَّا لَهُ الْحَدِيدَ</p>
<p><em>"And We made iron supple for him." — Sūrah Sabaʾ 34:10</em></p>

<h2>Sulaymān عليه السلام</h2>
<p>Sulaymān عليه السلام was the son of Dāwūd عليه السلام. Allāh granted him a kingdom the like of which no one after him would ever possess.</p>
<ul>
  <li>He understood the <strong>speech of birds, ants and animals</strong>.</li>
  <li>The <strong>jinn</strong> were made subservient to him — they built palaces, fortresses and diving for pearls.</li>
  <li>The <strong>wind</strong> carried his throne at his command.</li>
</ul>

<h3>The Valley of the Ants</h3>
<p>As Sulaymān's great army marched through a valley, an ant warned her colony:</p>
<p class="arabic" dir="rtl" lang="ar">يَا أَيُّهَا النَّمْلُ ادْخُلُوا مَسَاكِنَكُمْ لَا يَحْطِمَنَّكُمْ سُلَيْمَانُ وَجُنُودُهُ</p>
<p><em>"O ants, enter your dwellings lest Sulaymān and his armies crush you unknowingly." — Sūrah an-Naml 27:18</em></p>
<p>Sulaymān عليه السلام smiled and thanked Allāh for allowing him to understand her words.</p>

<h3>The Hudhud and the Queen of Sabaʾ (Bilqīs)</h3>
<p>The hoopoe bird (<strong>hudhud</strong>) reported to Sulaymān that the people of Sabaʾ (in Yemen) worshipped the sun under a powerful queen named Bilqīs. Sulaymān sent her a letter inviting her to Islām. She sent gifts; he refused them. Her magnificent throne was brought to his palace in the blink of an eye by one who had knowledge of the Book. Upon witnessing the miracles of Sulaymān's court, <strong>Bilqīs accepted Islām</strong>.</p>

<h2>Yūnus عليه السلام</h2>
<p>Yūnus عليه السلام was sent to the people of <strong>Nineveh</strong> (Nīnawā) in ʿIrāq. He preached for a long time, but they refused to believe. Frustrated and angry, he <strong>left them without Allāh's permission</strong>.</p>
<p>He boarded a ship. A violent storm arose and the passengers cast lots to lighten the load. His name came up, and he was thrown overboard. A <strong>great fish swallowed him whole</strong>.</p>
<p>In the layers of darkness — the belly of the fish, the depth of the sea, the darkness of the night — he called out:</p>
<p class="arabic" dir="rtl" lang="ar">لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ</p>
<p><em>"There is no god but You! Glory be to You! Indeed I have been among the wrongdoers." — Sūrah al-Anbiyāʾ 21:87</em></p>
<p>Allāh accepted his repentance and commanded the fish to cast him out. Yūnus returned to his people to find that they had <strong>all believed</strong> — theirs was the only town in history that believed as a whole community after witnessing the signs of impending punishment.</p>

<h2>The Umayyad Dynasty (41–132 AH / 661–750 CE)</h2>
<p>After the assassination of ʿAlī رضي الله عنه in 40 AH, <strong>Muʿāwiyah ibn Abī Sufyān</strong> رضي الله عنه became Khalīfah and moved the capital from Kūfah to <strong>Damascus (Dimashq)</strong>. This marked the beginning of the Umayyad dynasty.</p>

<h3>Key Rulers</h3>
<ul>
  <li><strong>Muʿāwiyah I</strong> — Founder. Established state departments (dīwāns), a postal service (barīd), and a powerful navy.</li>
  <li><strong>ʿAbd al-Malik ibn Marwān</strong> — Built the <em>Dome of the Rock (Qubbat al-Ṣakhrah)</em> in al-Quds, minted the first Islamic gold dīnār, and made Arabic the official language of all state records.</li>
  <li><strong>Al-Walīd I</strong> — Oversaw the construction of the Great Umayyad Mosque in Damascus and the expansion of Masjid an-Nabawī. Under him, Muslim armies reached <strong>al-Andalus</strong> (Spain), <strong>Sindh</strong> and Central Asia.</li>
  <li><strong>ʿUmar ibn ʿAbd al-ʿAzīz</strong> — The "fifth rightly-guided Khalīfah". He restored wealth to its rightful owners, lived simply, ended the cursing of ʿAlī from the minbars, and ordered the first official compilation of Ḥadīth.</li>
</ul>

<h3>Expansion of the Muslim World</h3>
<ul>
  <li><strong>92 AH (711 CE)</strong> — Ṭāriq ibn Ziyād crossed the strait into Spain (al-Andalus).</li>
  <li><strong>114 AH (732 CE)</strong> — The Battle of Poitiers (Balāṭ al-Shuhadāʾ) in France marked the furthest Muslim advance into Western Europe.</li>
  <li>Conquests spread eastward into Khurāsān, Transoxiana and the Indus Valley (Sindh).</li>
</ul>

<h3>Decline and Fall</h3>
<p>Internal disputes, tribal rivalries and over-extension weakened the dynasty. In <strong>132 AH (750 CE)</strong>, the ʿAbbāsid revolution overthrew the Umayyads. Only <strong>ʿAbd al-Raḥmān al-Dākhil</strong> survived and escaped to Spain, founding the independent Umayyad Emirate of Córdoba.</p>
      `,
    },
  });
  console.log('✅ Created Unit 4: Tārīkh');
  // ============================================================
  // UNIT 5: AQĀʾID
  // ============================================================
  const unitAqaid = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Aqāʾid — Ahlus Sunnah, Nubuwwah, Muʿjizāt & Isrāʾ wal-Miʿrāj',
      description:
        'Core creedal beliefs of Ahlus Sunnah wal-Jamāʿah: the qualities and ranks of prophets, the status of the Ṣaḥābah and Awliyāʾ, miracles (muʿjizāt) of the prophets, the Night Journey (al-Isrāʾ) and Ascension (al-Miʿrāj), and karāmāt of the righteous.',
      orderIndex: 4,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Define Ahlus Sunnah wal-Jamāʿah and explain their methodology.</li>
  <li>List the essential qualities of the prophets and the meaning of ʿiṣmah.</li>
  <li>Give examples of muʿjizāt from the Qurʾān and Sunnah.</li>
  <li>Narrate the key events of al-Isrāʾ wal-Miʿrāj.</li>
  <li>Distinguish between muʿjizāt and karāmāt.</li>
</ul>

<h2>Ahlus Sunnah wal-Jamāʿah</h2>
<p>The <strong>Ahlus Sunnah wal-Jamāʿah</strong> are the mainstream Muslim community who hold fast to the way of the Prophet ﷺ and his Companions in belief and practice. They follow the Qurʾān and authentic Sunnah as understood by the righteous predecessors (salaf) and codified by the four schools of Fiqh:</p>
<ul>
  <li><strong>Ḥanafī</strong> — founded by Imām Abū Ḥanīfah (d. 150 AH).</li>
  <li><strong>Mālikī</strong> — founded by Imām Mālik ibn Anas (d. 179 AH).</li>
  <li><strong>Shāfiʿī</strong> — founded by Imām Muḥammad ibn Idrīs al-Shāfiʿī (d. 204 AH).</li>
  <li><strong>Ḥanbalī</strong> — founded by Imām Aḥmad ibn Ḥanbal (d. 241 AH).</li>
</ul>
<p>In creed (ʿaqīdah), the Ahlus Sunnah follow the path of Imām Abūl-Ḥasan al-Ashʿarī and Imām Abū Manṣūr al-Māturīdī. They affirm all of Allāh's attributes as mentioned in the Qurʾān and Sunnah without resemblance (tashbīh) or denial (taʿṭīl).</p>

<h2>Nubuwwah — Beliefs about the Prophets</h2>
<p>Prophets are the most noble of all creation. Every Muslim must believe in all of them without exception.</p>
<h3>Essential Qualities of Prophets</h3>
<ul>
  <li><strong>Ṣidq</strong> — truthfulness in all they said.</li>
  <li><strong>Amānah</strong> — trustworthiness; they faithfully conveyed Allāh's message.</li>
  <li><strong>Tablīgh</strong> — complete delivery of the Divine message.</li>
  <li><strong>Faṭānah</strong> — intelligence and sharp understanding.</li>
  <li><strong>ʿIṣmah</strong> — protection from major sins and disbelief before and after prophethood.</li>
</ul>
<p><strong>Muḥammad ﷺ</strong> is the <em>Khātam an-Nabiyyīn</em> — the Seal of the Prophets. No prophet or messenger will come after him until the Day of Judgement.</p>

<h2>Muʿjizāt — Miracles of the Prophets</h2>
<p>A <strong>muʿjizah</strong> is a supernatural event that Allāh grants a prophet to prove his truthfulness. It challenges the people and they are unable to produce anything like it.</p>
<h3>Examples from the Qurʾān and Sunnah</h3>
<ul>
  <li>The <strong>staff of Mūsā</strong> عليه السلام turning into a living serpent.</li>
  <li><strong>ʿĪsā</strong> عليه السلام healing the blind, curing the leper, and reviving the dead by Allāh's permission.</li>
  <li><strong>Ibrāhīm</strong> عليه السلام being thrown into a fire that Allāh made cool and safe.</li>
  <li>The <strong>Qurʾān</strong> — the eternal, inimitable miracle of Muḥammad ﷺ, unchallenged to this day.</li>
  <li>The <strong>splitting of the moon</strong> (Shaqq al-Qamar) at the request of the Quraysh.</li>
  <li><strong>Water flowing</strong> from the blessed fingers of the Prophet ﷺ for hundreds of Companions.</li>
</ul>

<h2>Al-Isrāʾ wal-Miʿrāj — The Night Journey and Ascension</h2>
<p>Approximately one year before the Hijrah, the Prophet ﷺ was taken on a miraculous night journey in both body and soul:</p>
<h3>Al-Isrāʾ (The Night Journey)</h3>
<p>He rode the <strong>Burāq</strong> from al-Masjid al-Ḥarām in Makkah to <strong>Bayt al-Maqdis</strong> (al-Masjid al-Aqṣā in Jerusalem), where he led all the prophets in ṣalāh.</p>
<p class="arabic" dir="rtl" lang="ar">سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى</p>
<p><em>"Glory be to the One who took His servant by night from al-Masjid al-Ḥarām to al-Masjid al-Aqṣā." — Sūrah al-Isrāʾ 17:1</em></p>

<h3>Al-Miʿrāj (The Ascension)</h3>
<p>From Bayt al-Maqdis he ascended through the <strong>seven heavens</strong>, meeting various prophets:</p>
<ul>
  <li><strong>First heaven:</strong> Ādam عليه السلام.</li>
  <li><strong>Second heaven:</strong> ʿĪsā and Yaḥyā عليهما السلام.</li>
  <li><strong>Third heaven:</strong> Yūsuf عليه السلام.</li>
  <li><strong>Fourth heaven:</strong> Idrīs عليه السلام.</li>
  <li><strong>Fifth heaven:</strong> Hārūn عليه السلام.</li>
  <li><strong>Sixth heaven:</strong> Mūsā عليه السلام.</li>
  <li><strong>Seventh heaven:</strong> Ibrāhīm عليه السلام.</li>
</ul>
<p>He reached <strong>Sidrah al-Muntahā</strong> and was given the gift of the <strong>five daily prayers</strong> — originally fifty, reduced through the advice of Mūsā عليه السلام, with the reward of fifty remaining.</p>

<h2>Karāmāt — Miracles of the Awliyāʾ</h2>
<p>A <strong>karāmah</strong> is an extraordinary event that Allāh grants a righteous believer (walī) who is not a prophet. It is real and is a sign of Allāh's favour.</p>
<p>Examples:</p>
<ul>
  <li>ʿUmar رضي الله عنه calling out "Yā Sāriyah, al-jabal!" from the minbar in Madīnah, and Sāriyah hearing him in Persia.</li>
  <li>The food of Abū Bakr رضي الله عنه miraculously increasing for his guests.</li>
  <li>The <strong>Aṣḥāb al-Kahf</strong> (People of the Cave) sleeping for 309 years under Allāh's protection.</li>
</ul>
<p>A karāmah does not make the walī superior to any prophet, nor is it proof that the walī's personal views on all matters are correct — only the Qurʾān and Sunnah are the ultimate standard of truth.</p>
      `,
    },
  });
  console.log('✅ Created Unit 5: Aqāʾid');
  // ============================================================
  // UNIT 6: AKHLĀQ
  // ============================================================
  const unitAkhlaq = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Akhlāq — Ẓulm, Ḥasad, Ghībah, Kibr & Following the Sunnah',
      description:
        'Character development covering the harms of oppression (ẓulm), the destructive nature of envy (ḥasad), the sin of backbiting (ghībah), the danger of pride (kibr), and the virtues and rewards of following the Sunnah in daily life.',
      orderIndex: 5,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Define ẓulm, ḥasad, ghībah and kibr, and explain why each is forbidden.</li>
  <li>Identify Qurʾānic verses and aḥādīth warning against these traits.</li>
  <li>Explain the difference between ḥasad and ghibṭah.</li>
  <li>Describe practical ways to follow the Sunnah in everyday life.</li>
</ul>

<h2>Oppression (Ẓulm)</h2>
<p><strong>Ẓulm</strong> means to place something where it does not belong — especially to violate the rights of others. It ranges from the greatest ẓulm (shirk) to everyday forms like cheating, bullying, and hurting others' feelings.</p>
<blockquote>
  <p class="arabic" dir="rtl" lang="ar">اتَّقُوا الظُّلْمَ فَإِنَّ الظُّلْمَ ظُلُمَاتٌ يَوْمَ الْقِيَامَةِ</p>
  <p><em>"Beware of oppression, for oppression will be layers of darkness on the Day of Judgement."</em> — Muslim</p>
</blockquote>
<p>Allāh ﷻ says in a ḥadīth qudsī: <em>"O My servants, I have forbidden ẓulm upon Myself and I have made it forbidden amongst you, so do not oppress one another."</em> — Muslim</p>
<p>Forms of ẓulm include: taking someone's property unjustly, spreading false rumours, bullying classmates, and denying someone their rights.</p>

<h2>Envy (Ḥasad)</h2>
<p><strong>Ḥasad</strong> is to wish that a blessing be <em>removed</em> from another person. It is one of the most dangerous diseases of the heart.</p>
<blockquote>
  <p class="arabic" dir="rtl" lang="ar">إِيَّاكُمْ وَالْحَسَدَ فَإِنَّ الْحَسَدَ يَأْكُلُ الْحَسَنَاتِ كَمَا تَأْكُلُ النَّارُ الْحَطَبَ</p>
  <p><em>"Beware of envy, for envy devours good deeds just as fire devours firewood."</em> — Abū Dāwūd</p>
</blockquote>
<p>It was ḥasad that led Iblīs to refuse prostrating to Ādam and that caused Qābīl to murder Hābīl.</p>
<p><strong>Ghibṭah</strong>, on the other hand, is to wish the same blessing for yourself <em>without</em> wanting it taken from the other. This is permissible and even praiseworthy — for example, wishing you could memorise the Qurʾān like a ḥāfiẓah you admire.</p>

<h2>Backbiting (Ghībah)</h2>
<p><strong>Ghībah</strong> is to mention your Muslim sister (or brother) in her absence with something she would dislike — even if it is true.</p>
<p class="arabic" dir="rtl" lang="ar">وَلَا يَغْتَب بَّعْضُكُم بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا</p>
<p><em>"Do not backbite one another. Would any of you like to eat the flesh of his dead brother? You would hate it!" — Sūrah al-Ḥujurāt 49:12</em></p>
<p>The Prophet ﷺ defined ghībah: <em>"It is mentioning your brother with what he dislikes."</em> The Companions asked, "What if what we say is true?" He replied: <em>"If it is true, that is ghībah. If it is false, that is buhtān (slander)."</em> — Muslim</p>
<p><strong>Buhtān</strong> (slander) is even worse than ghībah — it involves lying about someone and is a major sin.</p>

<h2>Pride (Kibr)</h2>
<p><strong>Kibr</strong> is defined by the Prophet ﷺ as: <em>"rejecting the truth and looking down on people."</em> — Muslim</p>
<blockquote>
  <p class="arabic" dir="rtl" lang="ar">لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ</p>
  <p><em>"No one will enter Paradise who has an atom's weight of pride in his heart."</em> — Muslim</p>
</blockquote>
<p>Kibr was the sin of <strong>Iblīs</strong>, who refused to prostrate to Ādam, saying: <em>"I am better than him — You created me from fire and him from clay."</em></p>
<p>Its cure is <strong>tawāḍuʿ</strong> (humility) — remembering that we are created from a drop, sustained by Allāh's mercy, and will return to dust. The Prophet ﷺ said: <em>"Whoever humbles himself for the sake of Allāh, Allāh raises him."</em> — Muslim</p>

<h2>Following the Sunnah</h2>
<p>The <strong>Sunnah</strong> is the way of the Prophet ﷺ in worship, character, dealings and daily life. Following it is a sign of true love for him ﷺ:</p>
<p class="arabic" dir="rtl" lang="ar">قُلْ إِن كُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي يُحْبِبْكُمُ اللَّهُ</p>
<p><em>"Say: If you love Allāh, then follow me — Allāh will love you." — Sūrah Āl ʿImrān 3:31</em></p>
<p>Simple daily sunnahs that bring immense reward:</p>
<ul>
  <li>Saying <em>Bismillāh</em> before eating and <em>Alḥamdulillāh</em> after.</li>
  <li>Eating and drinking with the right hand.</li>
  <li>Greeting others with <em>as-Salāmu ʿalaykum</em>.</li>
  <li>Using the <em>miswāk</em> regularly.</li>
  <li>Sleeping on the right side and reciting the prescribed adhkār.</li>
  <li>Smiling — the Prophet ﷺ said: <em>"Your smiling in the face of your brother is charity."</em></li>
</ul>
      `,
    },
  });
  console.log('✅ Created Unit 6: Akhlāq');
  // ============================================================
  // UNIT 7: ĀDĀB
  // ============================================================
  const unitAdab = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Ādāb — Adhān & Iqāmah, Modesty in Dress & Sunan al-Fiṭrah',
      description:
        'Daily Islamic etiquette covering the ādāb of the adhān and iqāmah, modesty in dress for Muslim women, and the sunan al-fiṭrah — the natural practices of cleanliness and hygiene prescribed by Islām.',
      orderIndex: 6,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Explain the ādāb of listening to the adhān and responding correctly.</li>
  <li>Describe the Islamic requirements of modest dress for Muslim women.</li>
  <li>List the sunan al-fiṭrah and explain why they should not be neglected.</li>
</ul>

<h2>Ādāb of the Adhān and Iqāmah</h2>
<p>The <strong>adhān</strong> is the call to prayer and the <strong>iqāmah</strong> is the second call given immediately before the farḍ begins. Both are sunnah muʾakkadah for the five daily prayers performed in congregation.</p>

<h3>When You Hear the Adhān</h3>
<ul>
  <li><strong>Stop talking</strong> and listen attentively — even if reciting Qurʾān, pause and respond.</li>
  <li><strong>Repeat</strong> each phrase quietly after the muʾadhdhin.</li>
  <li>When the muʾadhdhin says <em>"Ḥayya ʿalaṣ-ṣalāh"</em> and <em>"Ḥayya ʿalal-falāḥ"</em>, reply with: <em>"Lā ḥawla wa lā quwwata illā billāh"</em> (There is no power and no might except with Allāh).</li>
  <li>After the adhān, recite <strong>durūd</strong> on the Prophet ﷺ, then the prescribed duʿāʾ:</li>
</ul>
<p class="arabic" dir="rtl" lang="ar">اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ</p>
<p><em>"O Allāh, Lord of this perfect call and the prayer about to be established, grant Muḥammad al-Wasīlah and al-Faḍīlah, and raise him to the praiseworthy station You have promised him."</em> — Bukhārī</p>

<h3>The Iqāmah</h3>
<p>The wording of the iqāmah is the same as the adhān with the addition of <em>"Qad qāmatiṣ-ṣalāh"</em> (the prayer has begun) said twice after <em>"Ḥayya ʿalal-falāḥ"</em>. When you hear it, prepare to stand for the prayer immediately.</p>

<h2>Modesty in Dress (Ḥijāb and Satr)</h2>
<p>Modesty (<strong>ḥayāʾ</strong>) is a branch of faith, and it is expressed outwardly through one's clothing and conduct.</p>

<h3>Requirements for a Muslim Woman's Dress</h3>
<ul>
  <li>The <strong>ʿawrah</strong> of a woman in front of non-maḥram men is her <strong>entire body except her face and hands</strong> (according to the Ḥanafī school).</li>
  <li>Clothing must be <strong>loose-fitting</strong> — not tight or figure-revealing.</li>
  <li>Clothing must be <strong>opaque</strong> — not see-through.</li>
  <li>It should <strong>not resemble</strong> typical male clothing or the distinctive religious dress of non-Muslims.</li>
  <li>It should not be worn for the purpose of <strong>show or fame</strong>.</li>
</ul>
<p class="arabic" dir="rtl" lang="ar">يَا أَيُّهَا النَّبِيُّ قُل لِّأَزْوَاجِكَ وَبَنَاتِكَ وَنِسَاءِ الْمُؤْمِنِينَ يُدْنِينَ عَلَيْهِنَّ مِن جَلَابِيبِهِنَّ</p>
<p><em>"O Prophet, tell your wives and daughters and the believing women to draw their outer garments over themselves." — Sūrah al-Aḥzāb 33:59</em></p>
<p>Wearing ḥijāb is an act of obedience to Allāh, a symbol of dignity, and a protection. It is <strong>not</strong> a sign of oppression but of spiritual strength and identity.</p>

<h2>Sunan al-Fiṭrah (Natural Practices of Hygiene)</h2>
<p>These are the practices of cleanliness that every prophet followed and that Islām has prescribed for all believers:</p>
<ol>
  <li><strong>Using the miswāk</strong> — cleaning the teeth with a natural tooth-stick, especially before wuḍūʾ and ṣalāh.</li>
  <li><strong>Trimming the nails</strong> regularly.</li>
  <li><strong>Removing hair</strong> from the underarms and below the navel.</li>
  <li><strong>Circumcision</strong> (khitān) — for males.</li>
  <li><strong>Trimming the moustache</strong> (for males) and keeping the beard.</li>
</ol>
<p>These practices should <strong>not be neglected for more than 40 days</strong>, as mentioned in the authentic ḥadīth narrated by Muslim.</p>

<h3>Other Daily Ādāb of Cleanliness</h3>
<ul>
  <li>Washing hands before and after eating.</li>
  <li>Performing <strong>istinjāʾ</strong> (cleaning oneself) after using the toilet — using water or clean material.</li>
  <li>Entering the toilet with the <strong>left foot</strong> and saying: <em>"Allāhumma innī aʿūdhu bika minal-khubthi wal-khabāʾith."</em></li>
  <li>Exiting with the <strong>right foot</strong> and saying: <em>"Ghufrānak."</em></li>
  <li>Keeping the body, clothes and place of prayer clean at all times.</li>
</ul>

<p class="arabic" dir="rtl" lang="ar">إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ</p>
<p><em>"Indeed Allāh loves those who repent and He loves those who keep themselves pure." — Sūrah al-Baqarah 2:222</em></p>
      `,
    },
  });
  console.log('✅ Created Unit 7: Ādāb');
  // ============================================================
  // QUESTIONS
  // ============================================================

  console.log('');
  console.log('📝 Creating quiz questions...');

  // --- Fiqh questions (8) ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which type of water is pure but cannot be used for wuḍūʾ or ghusl?',
        options: JSON.stringify(['Ṭāhir Muṭahhir', 'Ṭāhir Ghayr Muṭahhir', 'Najis', 'Zamzam']),
        correctAnswer: 'Ṭāhir Ghayr Muṭahhir',
        explanation: 'Ṭāhir Ghayr Muṭahhir water is clean in itself but has lost the ability to purify — e.g., used water or water mixed with a pure substance that changed its nature.',
        difficulty: 'EASY',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the maximum amount of najāsah ghalīẓah excused on clothing?',
        options: JSON.stringify(['A finger-width', 'A dirham (~5 cm)', '¼ of the garment', 'Nothing is excused']),
        correctAnswer: 'A dirham (~5 cm)',
        explanation: 'Up to the size of a dirham (approximately 5 cm diameter) of heavy impurity is excused.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the most common sign of bulūgh (maturity) for a girl?',
        options: JSON.stringify(['Reaching age 12', 'Ḥayḍ (menstruation)', 'Growing taller', 'Completing Qurʾān memorisation']),
        correctAnswer: 'Ḥayḍ (menstruation)',
        explanation: 'Ḥayḍ (menstruation) is the most common sign of maturity for girls.',
        difficulty: 'EASY',
      },
      {
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'The latest age at which a girl is considered bālighah is 15 lunar years.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'If no other sign of bulūgh appears, a girl is considered mature at 15 lunar years.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'FILL_BLANK',
        questionText: 'The three farāʾiḍ of ghusl are: rinsing the mouth, rinsing the ____, and washing the entire body.',
        options: null,
        correctAnswer: 'nose',
        explanation: 'The three farāʾiḍ are maḍmaḍah (mouth), istinshāq (nose), and washing the whole body.',
        difficulty: 'EASY',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What must be done if a wājib act of ṣalāh is missed by mistake?',
        options: JSON.stringify(['Repeat the entire ṣalāh', 'Perform sajdah sahw', 'Nothing, it is excused', 'Make duʿāʾ after salām']),
        correctAnswer: 'Perform sajdah sahw',
        explanation: 'Missing a wājib by mistake requires sajdah sahw (two prostrations of forgetfulness).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many takbīrāt are in Janāzah Ṣalāh?',
        options: JSON.stringify(['2', '3', '4', '5']),
        correctAnswer: '4',
        explanation: 'Janāzah Ṣalāh has four takbīrāt with no rukūʿ or sajdah.',
        difficulty: 'EASY',
      },
      {
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'Janāzah Ṣalāh is farḍ ʿayn on every Muslim.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'It is farḍ kifāyah — if some Muslims perform it, the obligation is lifted from the rest.',
        difficulty: 'MEDIUM',
      },
    ],
  });
  // --- Aḥādīth questions (7) ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth, what are actions judged by?',
        options: JSON.stringify(['Their outcome', 'Their difficulty', 'Their intentions (niyyāt)', 'Their duration']),
        correctAnswer: 'Their intentions (niyyāt)',
        explanation: '"Actions are judged by intentions" — the foundational ḥadīth narrated by Bukhārī & Muslim.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: '"The best of you are those who learn the ____ and teach it." — Bukhārī',
        options: null,
        correctAnswer: 'Qurʾān',
        explanation: 'Learning and teaching the Qurʾān is the noblest deed.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which ḥadīth states that modesty is a branch of faith?',
        options: JSON.stringify(['"Al-ḥayāʾu shuʿbatun minal-īmān"', '"Innamal-aʿmālu bin-niyyāt"', '"Aṭ-ṭuhūru shaṭrul-īmān"', '"Ad-dunyā sijnu-l-muʾmin"']),
        correctAnswer: '"Al-ḥayāʾu shuʿbatun minal-īmān"',
        explanation: '"Modesty is a branch of faith" — narrated by Bukhārī & Muslim.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ said that the pleasure of Allāh is in the pleasure of one\'s parents.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: '"The pleasure of Allāh is in the pleasure of the parents" — Tirmidhī.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the lowest branch of faith according to the ḥadīth?',
        options: JSON.stringify(['Saying the shahādah', 'Removing harm from the path', 'Fasting in Ramaḍān', 'Giving zakāh']),
        correctAnswer: 'Removing harm from the path',
        explanation: '"The lowest branch is removing harm from the path" — Muslim.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the Prophet ﷺ, what does truthfulness lead to?',
        options: JSON.stringify(['Wealth', 'Righteousness (birr) and then Paradise', 'Fame among people', 'Long life']),
        correctAnswer: 'Righteousness (birr) and then Paradise',
        explanation: '"Truthfulness leads to righteousness and righteousness leads to Paradise" — Bukhārī & Muslim.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ said: "Purification is half of faith."',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: '"Aṭ-ṭuhūru shaṭru-l-īmān" — narrated by Muslim.',
        difficulty: 'EASY',
      },
    ],
  });
  // --- Sīrah questions (7) ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the name of the collection of the Prophet ﷺ\'s descriptions by Imām al-Tirmidhī?',
        options: JSON.stringify(['Riyāḍ al-Ṣāliḥīn', 'al-Shamāʾil al-Muḥammadiyyah', 'Sīrat Ibn Hishām', 'al-Adab al-Mufrad']),
        correctAnswer: 'al-Shamāʾil al-Muḥammadiyyah',
        explanation: 'Imām al-Tirmidhī compiled the shamāʾil in his famous work al-Shamāʾil al-Muḥammadiyyah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ was known as al-Ṣādiq al-Amīn even before receiving prophethood.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'He was called the Truthful and Trustworthy (al-Ṣādiq al-Amīn) by the people of Makkah before nubuwwah.',
        difficulty: 'EASY',
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who was the first free adult man to accept Islām?',
        options: JSON.stringify(['ʿUmar ibn al-Khaṭṭāb', 'Abū Bakr al-Ṣiddīq', 'ʿAlī ibn Abī Ṭālib', 'ʿUthmān ibn ʿAffān']),
        correctAnswer: 'Abū Bakr al-Ṣiddīq',
        explanation: 'Abū Bakr رضي الله عنه accepted Islām immediately without any hesitation.',
        difficulty: 'EASY',
      },
      {
        unitId: unitSirah.id,
        type: 'FILL_BLANK',
        questionText: 'The Prophet ﷺ and Abū Bakr hid in the cave of ____ during the Hijrah.',
        options: null,
        correctAnswer: 'Thawr',
        explanation: 'They hid in the cave of Thawr, south of Makkah, for three nights.',
        difficulty: 'EASY',
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which enslaved Muslim did Abū Bakr رضي الله عنه free with his own wealth?',
        options: JSON.stringify(['Zayd ibn Ḥārithah', 'Bilāl ibn Rabāḥ', 'Salmān al-Fārisī', 'ʿAmmār ibn Yāsir']),
        correctAnswer: 'Bilāl ibn Rabāḥ',
        explanation: 'Abū Bakr spent his wealth to free Bilāl from the torture of his master Umayyah ibn Khalaf.',
        difficulty: 'EASY',
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How long was the khilāfah of Abū Bakr al-Ṣiddīq رضي الله عنه?',
        options: JSON.stringify(['About 6 months', 'About 2½ years', 'About 10 years', 'About 23 years']),
        correctAnswer: 'About 2½ years',
        explanation: 'His khilāfah lasted from 11 AH to 13 AH — approximately two and a half years.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'The first compilation of the Qurʾān into one muṣḥaf was done during the khilāfah of Abū Bakr.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'On ʿUmar\'s suggestion, Abū Bakr ordered Zayd ibn Thābit to compile the Qurʾān after the Battle of Yamāmah.',
        difficulty: 'MEDIUM',
      },
    ],
  });
  // --- Tārīkh questions (7) ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who killed the tyrant Jālūt (Goliath)?',
        options: JSON.stringify(['Ṭālūt', 'Dāwūd عليه السلام', 'Sulaymān عليه السلام', 'Mūsā عليه السلام']),
        correctAnswer: 'Dāwūd عليه السلام',
        explanation: 'Young Dāwūd عليه السلام killed Jālūt with a stone from his sling.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'FILL_BLANK',
        questionText: 'The scripture revealed to Dāwūd عليه السلام is called the ____.',
        options: null,
        correctAnswer: 'Zabūr',
        explanation: 'The Zabūr (Psalms) was revealed to Dāwūd عليه السلام.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which bird brought Sulaymān عليه السلام news of the Queen of Sabaʾ?',
        options: JSON.stringify(['Eagle', 'Hoopoe (hudhud)', 'Crow', 'Falcon']),
        correctAnswer: 'Hoopoe (hudhud)',
        explanation: 'The hudhud (hoopoe) informed Sulaymān about Bilqīs and her people.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: 'Yūnus عليه السلام left his people without Allāh\'s permission.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'He departed in anger before being given permission, and was then swallowed by the great fish.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which city was the capital of the Umayyad dynasty?',
        options: JSON.stringify(['Baghdad', 'Makkah', 'Damascus', 'Cairo']),
        correctAnswer: 'Damascus',
        explanation: 'Muʿāwiyah moved the capital from Kūfah to Damascus (Dimashq).',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which Umayyad Khalīfah is known as the "fifth rightly-guided Khalīfah"?',
        options: JSON.stringify(['Muʿāwiyah I', 'ʿAbd al-Malik ibn Marwān', 'al-Walīd I', 'ʿUmar ibn ʿAbd al-ʿAzīz']),
        correctAnswer: 'ʿUmar ibn ʿAbd al-ʿAzīz',
        explanation: 'His justice, piety and simple lifestyle earned him this honoured title.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who crossed the strait into al-Andalus (Spain) in 92 AH?',
        options: JSON.stringify(['ʿAbd al-Raḥmān al-Dākhil', 'Ṭāriq ibn Ziyād', 'Muḥammad ibn al-Qāsim', 'Khālid ibn al-Walīd']),
        correctAnswer: 'Ṭāriq ibn Ziyād',
        explanation: 'Ṭāriq ibn Ziyād led the Muslim forces into Spain in 92 AH (711 CE).',
        difficulty: 'MEDIUM',
      },
    ],
  });
  // --- Aqāʾid questions (6) ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of these is NOT one of the four Sunni schools of Fiqh?',
        options: JSON.stringify(['Ḥanafī', 'Mālikī', 'Shāfiʿī', 'Jaʿfarī']),
        correctAnswer: 'Jaʿfarī',
        explanation: 'The four Sunni schools are Ḥanafī, Mālikī, Shāfiʿī and Ḥanbalī.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'Prophets are protected from major sins — this is called ʿiṣmah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'ʿIṣmah is the divine protection of prophets from major sins and disbelief.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the eternal miracle (muʿjizah) of the Prophet Muḥammad ﷺ?',
        options: JSON.stringify(['The splitting of the moon', 'The Qurʾān', 'Water from his fingers', 'The night journey']),
        correctAnswer: 'The Qurʾān',
        explanation: 'The Qurʾān is the lasting miracle that remains unchallenged until the Day of Judgement.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAqaid.id,
        type: 'FILL_BLANK',
        questionText: 'The night journey from Makkah to Bayt al-Maqdis is called al-____.',
        options: null,
        correctAnswer: 'Isrāʾ',
        explanation: 'Al-Isrāʾ refers to the journey from Makkah to Jerusalem.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many daily prayers were originally given on the Miʿrāj before reduction?',
        options: JSON.stringify(['Ten', 'Twenty', 'Fifty', 'One hundred']),
        correctAnswer: 'Fifty',
        explanation: 'Fifty were reduced to five — with the reward of fifty remaining — through Mūsā\'s advice.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'A karāmah can make a walī superior to a prophet.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'No walī can ever reach the rank of any prophet. Karāmah is a gift from Allāh.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Akhlāq questions (6) ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ say ḥasad (envy) does to good deeds?',
        options: JSON.stringify(['Doubles them', 'Consumes them like fire consumes wood', 'Has no effect', 'Locks them away']),
        correctAnswer: 'Consumes them like fire consumes wood',
        explanation: '"Envy devours good deeds just as fire devours firewood" — Abū Dāwūd.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the difference between ghībah and buhtān?',
        options: JSON.stringify(['Ghībah is true, buhtān is false', 'Ghībah is in writing, buhtān is in speech', 'They are the same', 'Buhtān is allowed']),
        correctAnswer: 'Ghībah is true, buhtān is false',
        explanation: 'If the disliked thing mentioned is true, it is ghībah; if untrue, it is buhtān (slander).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'The greatest form of ẓulm (oppression) is shirk.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Allāh says: "Indeed shirk is a great oppression" (Sūrah Luqmān 31:13).',
        difficulty: 'EASY',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: 'The opposite of pride (kibr) is ____ (humility).',
        options: null,
        correctAnswer: 'tawāḍuʿ',
        explanation: 'Tawāḍuʿ (humility) is the cure for the disease of kibr.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Wishing the same blessing for yourself without wanting it taken from another is called:',
        options: JSON.stringify(['Ḥasad', 'Ghibṭah', 'Ghībah', 'Buhtān']),
        correctAnswer: 'Ghibṭah',
        explanation: 'Ghibṭah is permissible — it is wishing for a blessing without ill-will to the other.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which Qurʾānic verse promises Allāh\'s love for those who follow the Prophet ﷺ?',
        options: JSON.stringify(['Sūrah al-Baqarah 2:222', 'Sūrah Āl ʿImrān 3:31', 'Sūrah al-Ḥujurāt 49:12', 'Sūrah al-Isrāʾ 17:1']),
        correctAnswer: 'Sūrah Āl ʿImrān 3:31',
        explanation: '"Say: If you love Allāh, then follow me — Allāh will love you" — Āl ʿImrān 3:31.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Ādāb questions (5) ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What should you say when the muʾadhdhin calls "Ḥayya ʿalaṣ-ṣalāh"?',
        options: JSON.stringify(['Allāhu Akbar', 'Lā ḥawla wa lā quwwata illā billāh', 'Subḥān Allāh', 'Ḥayya ʿalaṣ-ṣalāh']),
        correctAnswer: 'Lā ḥawla wa lā quwwata illā billāh',
        explanation: 'The prescribed reply to both "ḥayya" phrases is "Lā ḥawla wa lā quwwata illā billāh".',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the Ḥanafī school, what is the ʿawrah of a woman before non-maḥram men?',
        options: JSON.stringify(['Only the hair', 'The entire body except face and hands', 'From navel to knees', 'Only the face']),
        correctAnswer: 'The entire body except face and hands',
        explanation: 'The ʿawrah of a woman in front of non-maḥram men is her entire body except her face and hands.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'Wearing ḥijāb is a sign of oppression, not obedience.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Ḥijāb is an act of obedience to Allāh and a symbol of dignity and spiritual strength.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAdab.id,
        type: 'FILL_BLANK',
        questionText: 'The sunan al-fiṭrah should not be neglected for more than ____ days.',
        options: null,
        correctAnswer: '40',
        explanation: 'Forty days is the maximum period mentioned in the authentic ḥadīth for these practices.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which foot should you enter the toilet with?',
        options: JSON.stringify(['Right foot', 'Left foot', 'Either foot', 'Both feet together']),
        correctAnswer: 'Left foot',
        explanation: 'Enter with the left foot saying the prescribed duʿāʾ, and exit with the right foot.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created quiz questions for all 7 units');
  // ============================================================
  // FLASHCARDS
  // ============================================================

  console.log('');
  console.log('🃏 Creating flashcards...');

  let flashcardIndex = 0;

  // --- Fiqh flashcards (10) ---
  const fiqhCards = [
    { front: 'Ṭāhir Muṭahhir', back: 'Pure water that purifies — rain, river, sea, well, spring, melted snow/ice.', frontArabic: 'طَاهِر مُطَهِّر', backArabic: 'مَاءٌ طَاهِرٌ يُطَهِّرُ غَيْرَهُ', category: 'Fiqh', tags: ['water', 'ṭahārah', 'purification'], difficulty: 'EASY' as const },
    { front: 'Ṭāhir Ghayr Muṭahhir', back: 'Pure water that cannot purify — used water (māʾ mustaʿmal) or water mixed with pure substance.', frontArabic: 'طَاهِر غَيْر مُطَهِّر', backArabic: 'مَاءٌ مُسْتَعْمَلٌ أَوْ مُخْتَلِط', category: 'Fiqh', tags: ['water', 'ṭahārah'], difficulty: 'MEDIUM' as const },
    { front: 'Najāsah Ghalīẓah', back: 'Heavy impurity (human urine, stool, blood, wine). Excused up to the size of a dirham (~5 cm).', frontArabic: 'نَجَاسَة غَلِيظَة', backArabic: 'بَوْل، دَم، خَمْر — يُعْفَى عَنْ قَدْرِ الدِّرْهَم', category: 'Fiqh', tags: ['najāsah', 'impurity', 'ṭahārah'], difficulty: 'MEDIUM' as const },
    { front: 'Najāsah Khafīfah', back: 'Light impurity — urine of ḥalāl animals. Excused up to ¼ of the garment or limb.', frontArabic: 'نَجَاسَة خَفِيفَة', backArabic: 'بَوْل مَأْكُول اللَّحْم — يُعْفَى عَنِ الرُّبُع', category: 'Fiqh', tags: ['najāsah', 'impurity'], difficulty: 'MEDIUM' as const },
    { front: 'Bulūgh for Girls', back: 'Signs: ḥayḍ (menstruation), iḥtilām (wet dream), or reaching 15 lunar years.', frontArabic: 'بُلُوغ', backArabic: 'حَيْض أَوْ احْتِلَام أَوْ بُلُوغ ١٥ سَنَة', category: 'Fiqh', tags: ['maturity', 'bulūgh', 'girls'], difficulty: 'EASY' as const },
    { front: 'Farāʾiḍ of Ghusl', back: 'Three farāʾiḍ: (1) Rinsing the mouth, (2) rinsing the nose, (3) washing the entire body.', frontArabic: 'فَرَائِض الْغُسْل', backArabic: 'مَضْمَضَة، اسْتِنْشَاق، غَسْل جَمِيع الْبَدَن', category: 'Fiqh', tags: ['ghusl', 'purification'], difficulty: 'EASY' as const },
    { front: 'Mukallafah', back: 'A girl who has reached bulūgh and is now responsible for all Sharʿī obligations.', frontArabic: 'مُكَلَّفَة', backArabic: 'بَالِغَة عَاقِلَة مُلْزَمَة بِالْأَحْكَام', category: 'Fiqh', tags: ['maturity', 'responsibility'], difficulty: 'MEDIUM' as const },
    { front: 'Sajdah Sahw', back: 'Two prostrations of forgetfulness — done when a wājib is missed by mistake in ṣalāh.', frontArabic: 'سَجْدَة السَّهْو', backArabic: 'سَجْدَتَان لِلسَّهْو عِنْد تَرْك الْوَاجِب', category: 'Fiqh', tags: ['ṣalāh', 'wājib'], difficulty: 'MEDIUM' as const },
    { front: 'Janāzah Ṣalāh', back: 'Funeral prayer: farḍ kifāyah, four takbīrāt, no rukūʿ or sajdah.', frontArabic: 'صَلَاة الْجَنَازَة', backArabic: 'فَرْض كِفَايَة — أَرْبَع تَكْبِيرَات', category: 'Fiqh', tags: ['janāzah', 'funeral', 'ṣalāh'], difficulty: 'EASY' as const },
    { front: 'Wājib Acts in Ṣalāh', back: 'Al-Fātiḥah in every rakʿah, sūrah in first two, ṭumaʾnīnah, qaʿdah ūlā, at-Taḥiyyāt, jahri/sirrī, taslīm, qunūt, ʿĪd takbīrāt.', frontArabic: 'وَاجِبَات الصَّلَاة', backArabic: 'الْفَاتِحَة، السُّورَة، الطُّمَأْنِينَة، الْقَعْدَة الْأُولَى', category: 'Fiqh', tags: ['ṣalāh', 'wājib'], difficulty: 'HARD' as const },
  ];
  await prisma.flashCard.createMany({
    data: fiqhCards.map((fc, i) => ({
      ...fc,
      unitId: unitFiqh.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += fiqhCards.length;
  // --- Aḥādīth flashcards (8) ---
  const ahadithCards = [
    { front: 'Niyyah (Intention)', back: '"Actions are judged by intentions" — every deed is only accepted with sincere niyyah.', frontArabic: 'نِيَّة', backArabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ', category: 'Aḥādīth', tags: ['niyyah', 'intention', 'foundational'], difficulty: 'EASY' as const },
    { front: 'Ḥayāʾ (Modesty)', back: '"Modesty is a branch of faith" — it prevents sin and is a sign of strong īmān.', frontArabic: 'حَيَاء', backArabic: 'الْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ', category: 'Aḥādīth', tags: ['modesty', 'faith', 'character'], difficulty: 'EASY' as const },
    { front: 'Ṣidq (Truthfulness)', back: '"Truthfulness leads to righteousness, and righteousness leads to Paradise."', frontArabic: 'صِدْق', backArabic: 'الصِّدْقَ يَهْدِي إِلَى الْبِرِّ', category: 'Aḥādīth', tags: ['truthfulness', 'character'], difficulty: 'EASY' as const },
    { front: 'Ghībah (Backbiting)', back: '"Mentioning your brother with what he dislikes" — even if true, it is ghībah.', frontArabic: 'غِيبَة', backArabic: 'ذِكْرُكَ أَخَاكَ بِمَا يَكْرَهُ', category: 'Aḥādīth', tags: ['backbiting', 'sin', 'tongue'], difficulty: 'EASY' as const },
    { front: 'Rifq (Gentleness)', back: '"Allāh is Gentle and loves gentleness in all matters."', frontArabic: 'رِفْق', backArabic: 'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ', category: 'Aḥādīth', tags: ['gentleness', 'character'], difficulty: 'EASY' as const },
    { front: 'Ṭuhūr (Purification)', back: '"Purification is half of faith" — Islām emphasises cleanliness of body and soul.', frontArabic: 'طُهُور', backArabic: 'الطُّهُورُ شَطْرُ الْإِيمَانِ', category: 'Aḥādīth', tags: ['purification', 'cleanliness', 'faith'], difficulty: 'EASY' as const },
    { front: 'Love for Others', back: '"None of you truly believes until he loves for his brother what he loves for himself."', frontArabic: 'حُبّ لِلْغَيْر', backArabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ', category: 'Aḥādīth', tags: ['love', 'brotherhood', 'faith'], difficulty: 'EASY' as const },
    { front: 'Dunyā as Prison', back: '"The world is a prison for the believer and a paradise for the disbeliever."', frontArabic: 'الدُّنْيَا سِجْن', backArabic: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ', category: 'Aḥādīth', tags: ['dunyā', 'hereafter', 'zuhd'], difficulty: 'MEDIUM' as const },
  ];
  await prisma.flashCard.createMany({
    data: ahadithCards.map((fc, i) => ({
      ...fc,
      unitId: unitAhadith.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += ahadithCards.length;

  // --- Sīrah flashcards (8) ---
  const sirahCards = [
    { front: 'Shamāʾil', back: 'The noble physical description, character and habits of the Prophet ﷺ.', frontArabic: 'شَمَائِل', backArabic: 'وَصْف خِلْقَة وَخُلُق النَّبِيّ ﷺ', category: 'Sīrah', tags: ['shamāʾil', 'Prophet', 'description'], difficulty: 'EASY' as const },
    { front: 'Khātam an-Nubuwwah', back: 'The seal of prophethood — a mark between the Prophet ﷺ\'s shoulders.', frontArabic: 'خَاتَم النُّبُوَّة', backArabic: 'عَلَامَة بَيْنَ كَتِفَيْ النَّبِيّ ﷺ', category: 'Sīrah', tags: ['seal', 'prophethood'], difficulty: 'MEDIUM' as const },
    { front: 'Al-Ṣādiq al-Amīn', back: 'The Truthful, the Trustworthy — the Prophet ﷺ\'s title before nubuwwah.', frontArabic: 'الصَّادِق الْأَمِين', backArabic: 'لَقَب النَّبِيّ ﷺ قَبْل الْبِعْثَة', category: 'Sīrah', tags: ['truthful', 'trustworthy', 'Prophet'], difficulty: 'EASY' as const },
    { front: 'Abū Bakr al-Ṣiddīq', back: 'First free adult male Muslim, companion of the cave, first Khalīfah (11–13 AH).', frontArabic: 'أَبُو بَكْر الصِّدِّيق', backArabic: 'أَوَّل مَنْ أَسْلَمَ مِنَ الرِّجَال — الْخَلِيفَة الْأَوَّل', category: 'Sīrah', tags: ['Abū Bakr', 'Ṣaḥābah', 'Khalīfah'], difficulty: 'EASY' as const },
    { front: 'Cave of Thawr', back: 'Where the Prophet ﷺ and Abū Bakr hid for three nights during the Hijrah.', frontArabic: 'غَار ثَوْر', backArabic: 'اخْتَبَأَ فِيهِ النَّبِيّ ﷺ وَأَبُو بَكْر ثَلَاث لَيَالٍ', category: 'Sīrah', tags: ['Hijrah', 'cave', 'Thawr'], difficulty: 'EASY' as const },
    { front: 'Bilāl ibn Rabāḥ', back: 'Enslaved Muslim freed by Abū Bakr — became the first muʾadhdhin of Islām.', frontArabic: 'بِلَال بْن رَبَاح', backArabic: 'أَعْتَقَهُ أَبُو بَكْر — أَوَّل مُؤَذِّن', category: 'Sīrah', tags: ['Bilāl', 'Abū Bakr', 'adhān'], difficulty: 'EASY' as const },
    { front: 'Ridda Wars', back: 'Wars during Abū Bakr\'s khilāfah against apostates and false prophets.', frontArabic: 'حُرُوب الرِّدَّة', backArabic: 'حُرُوب ضِدّ الْمُرْتَدِّين فِي عَهْد أَبِي بَكْر', category: 'Sīrah', tags: ['Ridda', 'Abū Bakr', 'khilāfah'], difficulty: 'MEDIUM' as const },
    { front: 'First Muṣḥaf', back: 'Compiled under Abū Bakr by Zayd ibn Thābit, on ʿUmar\'s suggestion, after Yamāmah.', frontArabic: 'أَوَّل مُصْحَف', backArabic: 'جَمَعَهُ زَيْد بْن ثَابِت فِي عَهْد أَبِي بَكْر', category: 'Sīrah', tags: ['Qurʾān', 'compilation', 'Abū Bakr'], difficulty: 'MEDIUM' as const },
  ];
  await prisma.flashCard.createMany({
    data: sirahCards.map((fc, i) => ({
      ...fc,
      unitId: unitSirah.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += sirahCards.length;
  // --- Tārīkh flashcards (8) ---
  const tarikhCards = [
    { front: 'Ṭālūt and Jālūt', back: 'King Saul (Ṭālūt) led Banū Isrāʾīl; young Dāwūd killed Goliath (Jālūt) with a sling.', frontArabic: 'طَالُوت وَجَالُوت', backArabic: 'قَتَلَ دَاوُد جَالُوت بِحَجَر', category: 'Tārīkh', tags: ['Dāwūd', 'Jālūt', 'Banū Isrāʾīl'], difficulty: 'EASY' as const },
    { front: 'Zabūr', back: 'The Psalms — the scripture revealed to Dāwūd عليه السلام.', frontArabic: 'زَبُور', backArabic: 'كِتَاب أُنْزِل عَلَى دَاوُد عَلَيْهِ السَّلَام', category: 'Tārīkh', tags: ['Zabūr', 'Dāwūd', 'scripture'], difficulty: 'EASY' as const },
    { front: 'Sulaymān\'s Kingdom', back: 'Understood birds, ants, jinn; wind at his command; a kingdom none after him would match.', frontArabic: 'مُلْك سُلَيْمَان', backArabic: 'سَخَّرَ لَهُ الْجِنّ وَالرِّيح وَالطَّيْر', category: 'Tārīkh', tags: ['Sulaymān', 'kingdom', 'jinn'], difficulty: 'EASY' as const },
    { front: 'Bilqīs (Queen of Sabaʾ)', back: 'Queen of Sheba who worshipped the sun; accepted Islām through Sulaymān عليه السلام.', frontArabic: 'بِلْقِيس', backArabic: 'مَلِكَة سَبَأ — أَسْلَمَتْ عَلَى يَد سُلَيْمَان', category: 'Tārīkh', tags: ['Bilqīs', 'Sabaʾ', 'Sulaymān'], difficulty: 'MEDIUM' as const },
    { front: 'Yūnus\'s Duʿāʾ', back: '"Lā ilāha illā Anta, Subḥānaka, innī kuntu mina-ẓ-ẓālimīn" — from the belly of the fish.', frontArabic: 'دُعَاء يُونُس', backArabic: 'لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ', category: 'Tārīkh', tags: ['Yūnus', 'duʿāʾ', 'repentance'], difficulty: 'MEDIUM' as const },
    { front: 'Nineveh (Nīnawā)', back: 'The city in ʿIrāq to which Yūnus عليه السلام was sent — the only town that believed as a whole.', frontArabic: 'نِينَوَى', backArabic: 'مَدِينَة فِي الْعِرَاق — آمَنُوا جَمِيعًا', category: 'Tārīkh', tags: ['Nineveh', 'Yūnus'], difficulty: 'MEDIUM' as const },
    { front: 'Umayyad Capital', back: 'Damascus (Dimashq) — from 41 AH when Muʿāwiyah became Khalīfah.', frontArabic: 'عَاصِمَة الْأُمَوِيِّين', backArabic: 'دِمَشْق — مِنْ سَنَة ٤١ هـ', category: 'Tārīkh', tags: ['Umayyad', 'Damascus', 'capital'], difficulty: 'EASY' as const },
    { front: 'ʿUmar ibn ʿAbd al-ʿAzīz', back: 'Pious Umayyad Khalīfah — known as the "fifth rightly-guided Khalīfah" for his justice.', frontArabic: 'عُمَر بْن عَبْد الْعَزِيز', backArabic: 'الْخَلِيفَة الرَّاشِد الْخَامِس', category: 'Tārīkh', tags: ['ʿUmar II', 'Umayyad', 'justice'], difficulty: 'EASY' as const },
  ];
  await prisma.flashCard.createMany({
    data: tarikhCards.map((fc, i) => ({
      ...fc,
      unitId: unitTarikh.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += tarikhCards.length;

  // --- Aqāʾid flashcards (7) ---
  const aqaidCards = [
    { front: 'Ahlus Sunnah wal-Jamāʿah', back: 'Those who follow the Qurʾān and Sunnah as understood by the Ṣaḥābah and the four schools.', frontArabic: 'أَهْل السُّنَّة وَالْجَمَاعَة', backArabic: 'أَتْبَاع الْكِتَاب وَالسُّنَّة عَلَى فَهْم السَّلَف', category: 'Aqāʾid', tags: ['Ahlus Sunnah', 'creed', 'methodology'], difficulty: 'EASY' as const },
    { front: 'ʿIṣmah', back: 'The divine protection of prophets from major sins and disbelief.', frontArabic: 'عِصْمَة', backArabic: 'حِفْظ الْأَنْبِيَاء مِنَ الْكَبَائِر', category: 'Aqāʾid', tags: ['prophets', 'protection', 'creed'], difficulty: 'MEDIUM' as const },
    { front: 'Khātam an-Nabiyyīn', back: 'The Seal of the Prophets — Muḥammad ﷺ. No prophet will come after him.', frontArabic: 'خَاتَم النَّبِيِّين', backArabic: 'مُحَمَّد ﷺ — لَا نَبِيَّ بَعْدَهُ', category: 'Aqāʾid', tags: ['finality', 'Prophet', 'creed'], difficulty: 'EASY' as const },
    { front: 'Muʿjizah', back: 'A supernatural miracle Allāh grants a prophet to prove his truthfulness.', frontArabic: 'مُعْجِزَة', backArabic: 'أَمْر خَارِق لِلْعَادَة يُظْهِرُهُ اللَّهُ عَلَى يَد نَبِيّ', category: 'Aqāʾid', tags: ['miracle', 'prophet', 'proof'], difficulty: 'EASY' as const },
    { front: 'Al-Isrāʾ', back: 'The Night Journey from Makkah to Bayt al-Maqdis (Jerusalem) on the Burāq.', frontArabic: 'الْإِسْرَاء', backArabic: 'رِحْلَة لَيْلِيَّة مِنْ مَكَّة إِلَى بَيْت الْمَقْدِس', category: 'Aqāʾid', tags: ['Isrāʾ', 'night journey', 'Burāq'], difficulty: 'EASY' as const },
    { front: 'Al-Miʿrāj', back: 'The Ascension through the seven heavens to Sidrah al-Muntahā — where five daily prayers were given.', frontArabic: 'الْمِعْرَاج', backArabic: 'الصُّعُود إِلَى السَّمَاوَات السَّبْع — فُرِضَت الصَّلَوَات', category: 'Aqāʾid', tags: ['Miʿrāj', 'ascension', 'prayers'], difficulty: 'EASY' as const },
    { front: 'Karāmah', back: 'An extraordinary event Allāh grants a righteous walī — does not make him superior to any prophet.', frontArabic: 'كَرَامَة', backArabic: 'أَمْر خَارِق يُظْهِرُهُ اللَّهُ عَلَى يَد وَلِيّ', category: 'Aqāʾid', tags: ['karāmah', 'walī', 'miracle'], difficulty: 'MEDIUM' as const },
  ];
  await prisma.flashCard.createMany({
    data: aqaidCards.map((fc, i) => ({
      ...fc,
      unitId: unitAqaid.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += aqaidCards.length;
  // --- Akhlāq flashcards (7) ---
  const akhlaqCards = [
    { front: 'Ẓulm (Oppression)', back: 'Placing something where it does not belong — violating rights. Greatest ẓulm is shirk.', frontArabic: 'ظُلْم', backArabic: 'وَضْع الشَّيْء فِي غَيْر مَوْضِعِه — أَعْظَمُهُ الشِّرْك', category: 'Akhlāq', tags: ['oppression', 'sin', 'rights'], difficulty: 'EASY' as const },
    { front: 'Ḥasad (Envy)', back: 'Wishing a blessing be removed from another — consumes good deeds like fire consumes wood.', frontArabic: 'حَسَد', backArabic: 'تَمَنِّي زَوَال النِّعْمَة — يَأْكُلُ الْحَسَنَات', category: 'Akhlāq', tags: ['envy', 'heart disease', 'sin'], difficulty: 'EASY' as const },
    { front: 'Ghibṭah', back: 'Wishing the same blessing for yourself without ill-will to others — permissible.', frontArabic: 'غِبْطَة', backArabic: 'تَمَنِّي مِثْل النِّعْمَة — جَائِزَة', category: 'Akhlāq', tags: ['ghibṭah', 'permissible', 'character'], difficulty: 'MEDIUM' as const },
    { front: 'Ghībah (Backbiting)', back: 'Mentioning a Muslim in their absence with something they would dislike — even if true.', frontArabic: 'غِيبَة', backArabic: 'ذِكْرُكَ أَخَاكَ بِمَا يَكْرَهُ', category: 'Akhlāq', tags: ['backbiting', 'tongue', 'sin'], difficulty: 'EASY' as const },
    { front: 'Kibr (Pride)', back: 'Rejecting truth and looking down on people — even a mustard seed of it prevents entry to Paradise.', frontArabic: 'كِبْر', backArabic: 'بَطَر الْحَقّ وَغَمْط النَّاس', category: 'Akhlāq', tags: ['pride', 'arrogance', 'sin'], difficulty: 'EASY' as const },
    { front: 'Tawāḍuʿ (Humility)', back: 'The cure for kibr — whoever humbles himself for Allāh, Allāh raises him.', frontArabic: 'تَوَاضُع', backArabic: 'مَنْ تَوَاضَعَ لِلَّهِ رَفَعَهُ اللَّه', category: 'Akhlāq', tags: ['humility', 'cure', 'character'], difficulty: 'EASY' as const },
    { front: 'Following the Sunnah', back: 'Bismillāh, right hand, salām, miswāk, sleeping on right side — small acts, immense reward.', frontArabic: 'اتِّبَاع السُّنَّة', backArabic: 'بِسْمِ اللَّه، الْيَمِين، السَّلَام، السِّوَاك', category: 'Akhlāq', tags: ['Sunnah', 'daily practice', 'reward'], difficulty: 'MEDIUM' as const },
  ];
  await prisma.flashCard.createMany({
    data: akhlaqCards.map((fc, i) => ({
      ...fc,
      unitId: unitAkhlaq.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += akhlaqCards.length;

  // --- Ādāb flashcards (6) ---
  const adabCards = [
    { front: 'Adhān Reply', back: 'Repeat each phrase; say "Lā ḥawla wa lā quwwata illā billāh" for the ḥayya phrases.', frontArabic: 'إِجَابَة الْأَذَان', backArabic: 'تَرْدِيد كُلّ جُمْلَة — لَا حَوْلَ وَلَا قُوَّة إِلَّا بِاللَّه', category: 'Ādāb', tags: ['adhān', 'reply', 'etiquette'], difficulty: 'MEDIUM' as const },
    { front: 'Duʿāʾ after Adhān', back: '"Allāhumma rabba hādhihid-daʿwatit-tāmmah…" — Bukhārī.', frontArabic: 'دُعَاء بَعْد الْأَذَان', backArabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّة', category: 'Ādāb', tags: ['duʿāʾ', 'adhān', 'Sunnah'], difficulty: 'MEDIUM' as const },
    { front: 'ʿAwrah of a Woman', back: 'Entire body except face and hands before non-maḥram men (Ḥanafī school).', frontArabic: 'عَوْرَة الْمَرْأَة', backArabic: 'جَمِيع الْبَدَن إِلَّا الْوَجْه وَالْكَفَّيْن', category: 'Ādāb', tags: ['ʿawrah', 'ḥijāb', 'modesty'], difficulty: 'EASY' as const },
    { front: 'Ḥijāb', back: 'Covering for Muslim women — loose, opaque, dignified. An act of obedience, not oppression.', frontArabic: 'حِجَاب', backArabic: 'سَاتِر فَضْفَاض — طَاعَة لِلَّه', category: 'Ādāb', tags: ['ḥijāb', 'dress', 'modesty'], difficulty: 'EASY' as const },
    { front: 'Sunan al-Fiṭrah', back: 'Miswāk, trimming nails, removing body hair, circumcision, trimming moustache. Max 40 days.', frontArabic: 'سُنَن الْفِطْرَة', backArabic: 'سِوَاك، تَقْلِيم أَظْفَار، نَتْف إِبْط — لَا تُتْرَك فَوْق ٤٠ يَوْمًا', category: 'Ādāb', tags: ['fiṭrah', 'hygiene', 'Sunnah'], difficulty: 'MEDIUM' as const },
    { front: 'Toilet Etiquette', back: 'Enter with left foot: "Allāhumma innī aʿūdhu bika…" Exit with right foot: "Ghufrānak."', frontArabic: 'آدَاب الْخَلَاء', backArabic: 'الدُّخُول بِالْيُسْرَى — الْخُرُوج بِالْيُمْنَى', category: 'Ādāb', tags: ['toilet', 'duʿāʾ', 'etiquette'], difficulty: 'EASY' as const },
  ];
  await prisma.flashCard.createMany({
    data: adabCards.map((fc, i) => ({
      ...fc,
      unitId: unitAdab.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += adabCards.length;
  // ============================================================
  // ARABIC TERMS
  // ============================================================

  console.log('');
  console.log('🔤 Creating Arabic terms...');

  await prisma.arabicTerm.createMany({
    data: [
      // --- Fiqh terms (8) ---
      { unitId: unitFiqh.id, arabicText: 'طَاهِر مُطَهِّر', transliteration: 'Ṭāhir Muṭahhir', translation: 'Pure and purifying (water)' },
      { unitId: unitFiqh.id, arabicText: 'نَجَاسَة غَلِيظَة', transliteration: 'Najāsah Ghalīẓah', translation: 'Heavy impurity' },
      { unitId: unitFiqh.id, arabicText: 'نَجَاسَة خَفِيفَة', transliteration: 'Najāsah Khafīfah', translation: 'Light impurity' },
      { unitId: unitFiqh.id, arabicText: 'بُلُوغ', transliteration: 'Bulūgh', translation: 'Maturity / puberty' },
      { unitId: unitFiqh.id, arabicText: 'غُسْل', transliteration: 'Ghusl', translation: 'Ritual bath' },
      { unitId: unitFiqh.id, arabicText: 'مُكَلَّفَة', transliteration: 'Mukallafah', translation: 'A female bound by Sharʿī obligations' },
      { unitId: unitFiqh.id, arabicText: 'سَجْدَة السَّهْو', transliteration: 'Sajdah Sahw', translation: 'Prostration of forgetfulness' },
      { unitId: unitFiqh.id, arabicText: 'صَلَاة الْجَنَازَة', transliteration: 'Ṣalāt al-Janāzah', translation: 'Funeral prayer' },

      // --- Aḥādīth terms (5) ---
      { unitId: unitAhadith.id, arabicText: 'نِيَّة', transliteration: 'Niyyah', translation: 'Intention' },
      { unitId: unitAhadith.id, arabicText: 'حَيَاء', transliteration: 'Ḥayāʾ', translation: 'Modesty / shyness' },
      { unitId: unitAhadith.id, arabicText: 'صِدْق', transliteration: 'Ṣidq', translation: 'Truthfulness' },
      { unitId: unitAhadith.id, arabicText: 'رِفْق', transliteration: 'Rifq', translation: 'Gentleness' },
      { unitId: unitAhadith.id, arabicText: 'طُهُور', transliteration: 'Ṭuhūr', translation: 'Purification' },

      // --- Sīrah terms (6) ---
      { unitId: unitSirah.id, arabicText: 'شَمَائِل', transliteration: 'Shamāʾil', translation: 'Noble descriptions (of the Prophet ﷺ)' },
      { unitId: unitSirah.id, arabicText: 'خَاتَم النُّبُوَّة', transliteration: 'Khātam an-Nubuwwah', translation: 'Seal of prophethood' },
      { unitId: unitSirah.id, arabicText: 'الصَّادِق الْأَمِين', transliteration: 'Al-Ṣādiq al-Amīn', translation: 'The Truthful, the Trustworthy' },
      { unitId: unitSirah.id, arabicText: 'صَاحِب الْغَار', transliteration: 'Ṣāḥib al-Ghār', translation: 'Companion of the Cave (Abū Bakr)' },
      { unitId: unitSirah.id, arabicText: 'خَلِيفَة', transliteration: 'Khalīfah', translation: 'Successor / caliph' },
      { unitId: unitSirah.id, arabicText: 'حُرُوب الرِّدَّة', transliteration: 'Ḥurūb al-Riddah', translation: 'Wars of Apostasy' },

      // --- Tārīkh terms (6) ---
      { unitId: unitTarikh.id, arabicText: 'زَبُور', transliteration: 'Zabūr', translation: 'The Psalms — scripture of Dāwūd عليه السلام' },
      { unitId: unitTarikh.id, arabicText: 'هُدْهُد', transliteration: 'Hudhud', translation: 'Hoopoe (bird)' },
      { unitId: unitTarikh.id, arabicText: 'نِينَوَى', transliteration: 'Nīnawā', translation: 'Nineveh — city of Yūnus عليه السلام' },
      { unitId: unitTarikh.id, arabicText: 'قُبَّة الصَّخْرَة', transliteration: 'Qubbat al-Ṣakhrah', translation: 'Dome of the Rock' },
      { unitId: unitTarikh.id, arabicText: 'دِينَار', transliteration: 'Dīnār', translation: 'Gold coin / Islamic currency' },
      { unitId: unitTarikh.id, arabicText: 'بَرِيد', transliteration: 'Barīd', translation: 'Postal service' },

      // --- Aqāʾid terms (5) ---
      { unitId: unitAqaid.id, arabicText: 'أَهْل السُّنَّة', transliteration: 'Ahlus Sunnah', translation: 'People of the Sunnah' },
      { unitId: unitAqaid.id, arabicText: 'عِصْمَة', transliteration: 'ʿIṣmah', translation: 'Divine protection of prophets from sin' },
      { unitId: unitAqaid.id, arabicText: 'مُعْجِزَة', transliteration: 'Muʿjizah', translation: 'Miracle of a prophet' },
      { unitId: unitAqaid.id, arabicText: 'كَرَامَة', transliteration: 'Karāmah', translation: 'Miracle of a walī (saint)' },
      { unitId: unitAqaid.id, arabicText: 'الْإِسْرَاء وَالْمِعْرَاج', transliteration: 'Al-Isrāʾ wal-Miʿrāj', translation: 'The Night Journey and Ascension' },

      // --- Akhlāq terms (4) ---
      { unitId: unitAkhlaq.id, arabicText: 'ظُلْم', transliteration: 'Ẓulm', translation: 'Oppression / wrongdoing' },
      { unitId: unitAkhlaq.id, arabicText: 'حَسَد', transliteration: 'Ḥasad', translation: 'Envy' },
      { unitId: unitAkhlaq.id, arabicText: 'غِيبَة', transliteration: 'Ghībah', translation: 'Backbiting' },
      { unitId: unitAkhlaq.id, arabicText: 'كِبْر', transliteration: 'Kibr', translation: 'Pride / arrogance' },

      // --- Ādāb terms (3) ---
      { unitId: unitAdab.id, arabicText: 'حِجَاب', transliteration: 'Ḥijāb', translation: 'Head covering / modest dress for women' },
      { unitId: unitAdab.id, arabicText: 'سُنَن الْفِطْرَة', transliteration: 'Sunan al-Fiṭrah', translation: 'Natural practices of cleanliness' },
      { unitId: unitAdab.id, arabicText: 'مِسْوَاك', transliteration: 'Miswāk', translation: 'Tooth-stick for cleaning teeth' },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 An Nasihah Coursebook 6 (Girls) seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: An Nasihah Coursebook 6 (Girls) (ages 11-12)');
  console.log('   - 7 Units: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqāʾid, Akhlāq, Ādāb');
  console.log('   - 46 Quiz questions (8+7+7+7+6+6+5)');
  console.log(`   - ${flashcardIndex} Flashcards (10+8+8+8+7+7+6)`);
  console.log('   - 37 Arabic terms (8+5+6+6+5+4+3)');
}

// Allow standalone execution
async function main() {
  try {
    await seedMaktabCoursebook6Girls();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding An Nasihah Coursebook 6 (Girls):', error);
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