import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 6 (Boys) — Islamic Curriculum Seed
 * Source: An Nasihah Publications, Age Range: 11–12 years
 *
 * Covers seven subjects: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā'id, Akhlāq, Ādāb
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions and flashcards per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-coursebook6boys.ts
 */

export async function seedMaktabCoursebook6Boys() {
  console.log('📚 Starting Maktab Coursebook 6 (Boys) seed...');
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
    where: { title: 'An Nasihah Coursebook 6 (Boys)' },
  });
  if (existing) {
    console.log('⏭️  An Nasihah Coursebook 6 (Boys) already exists — skipping.');
    return;
  }

  // ──────────────────────────────────────────────
  // COURSE
  // ──────────────────────────────────────────────

  const course = await prisma.course.create({
    data: {
      title: 'An Nasihah Coursebook 6 (Boys)',
      description:
        'A comprehensive Islamic curriculum for boys aged 11–12 covering advanced fiqh (water, impurities, maturity, ghusl, wājib acts, imām, janāzah, Jumu\'ah, adhān/iqāmah), major sin aḥādīth, shamā\'il of the Prophet ﷺ and life of Abū Bakr, stories of Dāwūd, Sulaymān and Yūnus, Umayyad dynasty, beliefs of Ahlus Sunnah, prophethood, miracles, Isrā\' & Mi\'rāj, character topics (oppression, envy, ghībah, pride), and daily ādāb (modesty, adhān etiquette, \'Īdayn, Jumu\'ah, personal hygiene). Based on the An Nasihah Publications coursebook series.',
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
      title: 'Fiqh — Water, Impurities, Maturity, Ghusl, Wājib Acts, Imām, Janāzah, Jumu\'ah & Adhān',
      description:
        'Advanced fiqh topics including types of water for purification, impurities (najāsah ghalīẓah and khafīfah), signs of maturity, ghusl, wājib acts in ṣalāh, imām requirements, janāzah ṣalāh, Jumu\'ah ṣalāh, and adhān/iqāmah.',
      orderIndex: 0,
      content: `
        <h2>Unit 1: Fiqh</h2>
        <p>Fiqh is the understanding of the practical rulings of Islam derived from the Qur'ān and Sunnah. In this unit we study water and impurities, the signs of maturity, ghusl, the wājib actions of Ṣalāh, leading the prayer (imāmat), Janāzah, Jumuʿah and Adhān.</p>

        <h3>Water (Māʾ)</h3>
        <p>Water is the primary means of purification. The Sharīʿah divides water into categories based on its purity and ability to remove ḥadath (ritual impurity) and najāsah (filth).</p>
        <ul>
          <li><strong>Ṭāhir Muṭahhir</strong> — Pure water that can purify (rain, river, sea, spring, well, melted snow/ice).</li>
          <li><strong>Ṭāhir Ghayr Muṭahhir</strong> — Pure water that cannot purify (e.g. used water, fruit juice, water mixed with other liquids that change its essential nature).</li>
          <li><strong>Najis</strong> — Impure water that has had impurity fall into it and its colour, taste or smell has changed.</li>
        </ul>

        <h3>Impurities (Najāsah)</h3>
        <p>Najāsah is of two kinds:</p>
        <ol>
          <li><strong>Najāsah Ghalīẓah</strong> (heavy impurity) — urine, stool, blood, alcohol, pork. Allowed: up to dirham (~5cm) on body/clothes.</li>
          <li><strong>Najāsah Khafīfah</strong> (light impurity) — urine of ḥalāl animals. Allowed: up to ¼ of the affected limb or garment.</li>
        </ol>

        <h3>Maturity (Bulūgh)</h3>
        <p>A boy reaches maturity by one of the following:</p>
        <ul>
          <li>Iḥtilām (a wet dream).</li>
          <li>Ejaculation.</li>
          <li>Ability to make a woman pregnant.</li>
          <li>Reaching the age of 15 lunar years (latest sign).</li>
        </ul>
        <p>With bulūgh, Sharʿī responsibility (taklīf) begins: Ṣalāh, Ṣawm and other obligations become farḍ.</p>

        <h3>Ghusl (Ritual Bath)</h3>
        <p>Ghusl becomes farḍ after: janābah (sexual discharge / intercourse), the end of ḥayḍ or nifās. Three farāʾiḍ of ghusl:</p>
        <ol>
          <li>Rinsing the mouth (madmadah).</li>
          <li>Rinsing the nose (istinshāq).</li>
          <li>Washing the entire body so that no spot remains dry.</li>
        </ol>

        <h3>Wājib Acts in Ṣalāh</h3>
        <ul>
          <li>Reciting Sūrah al-Fātiḥah in every rakʿah of farḍ (and every rakʿah of nafl, witr, sunnah).</li>
          <li>Joining a sūrah or 3 short verses after al-Fātiḥah in the first two rakʿahs of farḍ.</li>
          <li>Performing rukūʿ and sajdah with ṭumaʾnīnah (calmness).</li>
          <li>Sitting for qaʿdah ūlā (first sitting) in 3 or 4 rakʿah Ṣalāh.</li>
          <li>Reciting at-Taḥiyyāt in both sittings.</li>
          <li>Reciting loudly or silently in their proper places.</li>
          <li>Ending the Ṣalāh with the word "Assalāmu" of taslīm.</li>
          <li>Reciting duʿāʾ qunūt in witr.</li>
          <li>Saying takbīrāt in the ʿĪdayn.</li>
        </ul>
        <p>If a wājib is left out by mistake, sajdah sahw must be performed; if deliberately, the Ṣalāh must be repeated.</p>

        <h3>The Imām</h3>
        <p>The imām leads the congregation. He should be the most knowledgeable of the Qur'ān and Sunnah, of upright character, and able to recite correctly. The followers (muqtadī) must follow him precisely — they should not move into a rukn before him.</p>

        <h3>Janāzah Ṣalāh</h3>
        <p>The Ṣalāh of the deceased is a farḍ kifāyah. It has four takbīrāt and no rukūʿ or sajdah:</p>
        <ol>
          <li>First takbīr: thanāʾ.</li>
          <li>Second takbīr: durūd Ibrāhīm.</li>
          <li>Third takbīr: duʿāʾ for the deceased.</li>
          <li>Fourth takbīr: salām.</li>
        </ol>

        <h3>Jumuʿah Ṣalāh</h3>
        <p>Friday prayer is farḍ on every adult, sane, male, free, resident, healthy Muslim. It consists of two rakʿahs of farḍ preceded by the khuṭbah. Conditions: time of ẓuhr, jamāʿah, public masjid, and the khuṭbah before the Ṣalāh.</p>

        <h3>Adhān and Iqāmah</h3>
        <p>The Adhān is the call to prayer; the Iqāmah is the second call right before the farḍ begins. Both are sunnah muʾakkadah for the five daily prayers in jamāʿah. The wording of Iqāmah is the same as the Adhān with the addition of "Qad qāmati-ṣ-ṣalāh" twice after "Ḥayya ʿalal-falāḥ".</p>

        <p class="arabic" dir="rtl" lang="ar">إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا</p>
        <p><em>"Indeed, prayer has been decreed upon the believers a decree of specified times." — Sūrah an-Nisāʾ 4:103</em></p>
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
      title: 'Aḥādīth — Major Sins & Key Teachings',
      description:
        'Key aḥādīth on major sins, the dangers of pride, the virtue of truthfulness, the reward of fasting in Ramaḍān, and the importance of choosing good friends.',
      orderIndex: 1,
      content: `
        <h2>Unit 2: Aḥādīth — Major Sins</h2>
        <p>Sins are of two kinds: minor (ṣaghāʾir) and major (kabāʾir). A major sin is one for which the Qur'ān or Sunnah promises Hellfire, the curse of Allāh, or a specific punishment (ḥadd) in this world.</p>

        <h3>The Hadith of the Seven Destroyers</h3>
        <blockquote>
          <p class="arabic" dir="rtl" lang="ar">اجْتَنِبُوا السَّبْعَ الْمُوبِقَاتِ</p>
          <p><em>"Avoid the seven destructive sins."</em> The companions asked, "What are they, O Messenger of Allāh?" He ﷺ said:</p>
          <ol>
            <li>Shirk (associating partners with Allāh).</li>
            <li>Sorcery (siḥr).</li>
            <li>Killing a soul which Allāh has forbidden except in justice.</li>
            <li>Consuming ribā (interest).</li>
            <li>Consuming the property of an orphan.</li>
            <li>Fleeing from the battlefield.</li>
            <li>Slandering chaste, believing women.</li>
          </ol>
          <p><em>— Bukhārī &amp; Muslim</em></p>
        </blockquote>

        <h3>Other Major Sins</h3>
        <ul>
          <li>Disobedience to parents (ʿuqūq al-wālidayn).</li>
          <li>Cutting family ties (qaṭʿ ar-raḥim).</li>
          <li>False testimony.</li>
          <li>Drinking intoxicants.</li>
          <li>Adultery and fornication (zinā).</li>
          <li>Theft.</li>
          <li>Lying about the Prophet ﷺ.</li>
          <li>Showing-off (riyāʾ) in worship.</li>
          <li>Despairing of Allāh's mercy.</li>
        </ul>

        <h3>The Way to Forgiveness</h3>
        <p>Major sins are not forgiven except through sincere tawbah (repentance). Allāh ﷻ says:</p>
        <p class="arabic" dir="rtl" lang="ar">قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ</p>
        <p><em>"Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allāh." — Sūrah az-Zumar 39:53</em></p>

        <h3>Conditions of Tawbah</h3>
        <ol>
          <li>Stopping the sin immediately.</li>
          <li>Sincere regret over committing it.</li>
          <li>Firm resolve never to return to it.</li>
          <li>If it involved the rights of others — returning those rights or seeking forgiveness.</li>
        </ol>
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
      title: 'Sīrah — Shamā\'il & Abū Bakr Aṣ-Ṣiddīq',
      description:
        'The physical description (shamā\'il) of the Prophet ﷺ and the life story of Abū Bakr Aṣ-Ṣiddīq — his early life, accepting Islām, spreading the message, trials, and migration to Madīnah.',
      orderIndex: 2,
      content: `
        <h2>Unit 3: Sīrah</h2>

        <h3>Shamāʾil — The Noble Description of the Prophet ﷺ</h3>
        <p>The shamāʾil are the descriptions of the blessed body, manners and habits of the Messenger of Allāh ﷺ. The most famous collection is <em>al-Shamāʾil al-Muḥammadiyyah</em> by Imām al-Tirmidhī.</p>

        <h4>Physical Description</h4>
        <ul>
          <li>Of medium height — neither very tall nor very short.</li>
          <li>His complexion was bright, with a slight wheatish hue; his face shone like the moon.</li>
          <li>His hair was neither completely straight nor very curly, reaching his earlobes or shoulders.</li>
          <li>His eyes were deep black with long lashes.</li>
          <li>His chest was broad; his shoulders bore the seal of prophethood (khātam an-nubuwwah) between them.</li>
          <li>He walked briskly, as though descending from a height.</li>
          <li>His smile would light up his face; he laughed only with a smile.</li>
        </ul>

        <h4>Character &amp; Habits</h4>
        <ul>
          <li>The most generous of people, especially in Ramaḍān.</li>
          <li>The most truthful — known as al-Ṣādiq al-Amīn even before nubuwwah.</li>
          <li>He never raised his voice in the marketplace, never returned evil with evil, and always pardoned.</li>
          <li>He helped his family with household chores, mended his own clothes, and ate whatever was placed before him.</li>
          <li>He loved cleanliness, the colour white, and the fragrance of ʿūd and musk.</li>
        </ul>

        <p class="arabic" dir="rtl" lang="ar">وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ</p>
        <p><em>"Indeed you are upon a magnificent character." — Sūrah al-Qalam 68:4</em></p>

        <h3>Abū Bakr al-Ṣiddīq رضي الله عنه</h3>
        <p>His full name was ʿAbdullāh ibn ʿUthmān, of the Banū Taym. He was about two years younger than the Prophet ﷺ, a wealthy merchant of Makkah known for his honesty and gentle nature.</p>

        <h4>Early Acceptance of Islām</h4>
        <p>He was the <strong>first adult man</strong> to accept Islām. Through him, ʿUthmān, Zubayr, Ṭalḥah, Saʿd ibn Abī Waqqāṣ and ʿAbd ar-Raḥmān ibn ʿAwf entered Islām.</p>

        <h4>Companion of the Cave</h4>
        <p>He was the Prophet's companion during the Hijrah. They hid in the cave of Thawr for three nights. Allāh ﷻ mentions him in the Qur'ān:</p>
        <p class="arabic" dir="rtl" lang="ar">ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ إِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا</p>
        <p><em>"The second of two when they were in the cave, when he said to his companion: Do not grieve, indeed Allāh is with us." — Sūrah at-Tawbah 9:40</em></p>

        <h4>The First Khalīfah</h4>
        <p>After the Prophet ﷺ passed away in 11 AH, Abū Bakr was chosen as Khalīfah. His khilāfah lasted about 2½ years. Major events:</p>
        <ul>
          <li>The Ridda Wars against the false prophets and apostates.</li>
          <li>The first compilation of the Qur'ān into one muṣḥaf, on the suggestion of ʿUmar رضي الله عنه.</li>
          <li>The beginning of the conquests of ʿIrāq and Shām.</li>
        </ul>
        <p>He passed away in 13 AH at the age of 63 and is buried beside the Prophet ﷺ in al-Madīnah.</p>
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
      title: 'Tārīkh — Prophets Dāwūd, Sulaymān, Yūnus & The Umayyads',
      description:
        'Stories of the prophets Dāwūd, Sulaymān, and Yūnus عليهم السلام, plus the history of the Umayyad dynasty — its key figures, conquests, and contributions to Islamic civilisation.',
      orderIndex: 3,
      content: `
        <h2>Unit 4: Tārīkh</h2>

        <h3>Dāwūd عليه السلام</h3>
        <p>Dāwūd عليه السلام lived among the Banū Isrāʾīl. In his time, the tyrant Jālūt (Goliath) oppressed the believers. The Banū Isrāʾīl asked their prophet for a king; Allāh chose Ṭālūt (Saul). When Ṭālūt's army met Jālūt's army, young Dāwūd killed Jālūt with a stone from his sling.</p>
        <p>Allāh gave Dāwūd عليه السلام nubuwwah, kingdom, the Zabūr, the ability to soften iron with his hands, and a beautiful voice — so beautiful that the mountains and birds joined him in tasbīḥ.</p>
        <p class="arabic" dir="rtl" lang="ar">وَأَلَنَّا لَهُ الْحَدِيدَ</p>
        <p><em>"And We made iron supple for him." — Sūrah Sabaʾ 34:10</em></p>

        <h3>Sulaymān عليه السلام</h3>
        <p>The son of Dāwūd عليه السلام. Allāh gave him a kingdom that none after him would have. He understood the speech of birds, ants and jinn; the wind carried his throne; the jinn built fortresses and palaces for him.</p>

        <h4>The Valley of the Ants</h4>
        <p>Once as his army marched, an ant called out:</p>
        <p class="arabic" dir="rtl" lang="ar">يَا أَيُّهَا النَّمْلُ ادْخُلُوا مَسَاكِنَكُمْ لَا يَحْطِمَنَّكُمْ سُلَيْمَانُ وَجُنُودُهُ</p>
        <p><em>"O ants, enter your dwellings, lest Sulaymān and his armies crush you unknowingly." — Sūrah an-Naml 27:18</em></p>
        <p>Sulaymān smiled and thanked Allāh for understanding her speech.</p>

        <h4>The Hudhud and the Queen of Sheba (Bilqīs)</h4>
        <p>The hoopoe (hudhud) returned with news of a great queen in Sabaʾ (Yemen) who worshipped the sun. Sulaymān sent her a letter inviting her to Islām. She sent gifts; he refused them. The throne of Bilqīs was brought to him in the blink of an eye by one who had knowledge of the Book. Upon seeing the miracles of Sulaymān's court, Bilqīs accepted Islām.</p>

        <h3>Yūnus عليه السلام</h3>
        <p>Yūnus عليه السلام was sent to the people of Nineveh (Nīnawā) in ʿIrāq. When they refused to believe, he left in anger before Allāh's permission. He boarded a ship; a storm arose. They cast lots and his name came up. He was thrown into the sea and swallowed by a great fish.</p>
        <p>Inside the darkness of the fish, the sea, and the night, he called out:</p>
        <p class="arabic" dir="rtl" lang="ar">لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ</p>
        <p><em>"There is no god but You, Glory be to You! Indeed I have been of the wrongdoers." — Sūrah al-Anbiyāʾ 21:87</em></p>
        <p>Allāh saved him. He returned to his people; they had all believed. Their town was the only one that believed as a whole after seeing the signs of punishment.</p>

        <h3>The Umayyad Khilāfah (41–132 AH / 661–750 CE)</h3>
        <p>After the assassination of ʿAlī رضي الله عنه, Muʿāwiyah ibn Abī Sufyān رضي الله عنه became Khalīfah and moved the capital from Kūfah to Damascus (Dimashq). This began the Umayyad dynasty.</p>

        <h4>Key Khalīfahs</h4>
        <ul>
          <li><strong>Muʿāwiyah I</strong> — Founder. Established the dīwāns (state departments), the postal service (barīd), and a strong navy.</li>
          <li><strong>ʿAbd al-Malik ibn Marwān</strong> — Built the <em>Dome of the Rock (Qubbat al-Ṣakhrah)</em> in al-Quds, minted the first Islamic dīnār, and made Arabic the official language of state.</li>
          <li><strong>Al-Walīd I</strong> — Built the Umayyad Mosque in Damascus and the Masjid an-Nabawī expansion. In his time, conquests reached Spain (al-Andalus), Sindh and Central Asia.</li>
          <li><strong>ʿUmar ibn ʿAbd al-ʿAzīz</strong> — Known as the "fifth rightly-guided Khalīfah". He returned wealth to its rightful owners, lived simply, ended cursing of ʿAlī from the minbars, and ordered the first official compilation of Hadith.</li>
        </ul>

        <h4>Expansion of Islām</h4>
        <ul>
          <li>92 AH — Ṭāriq ibn Ziyād crossed into Spain.</li>
          <li>114 AH / 732 CE — The Battle of Poitiers (Balāṭ al-Shuhadāʾ) in France, the furthest extent of Muslim advance into Western Europe.</li>
          <li>Conquests of Khurāsān, Transoxiana and Sindh.</li>
        </ul>

        <h4>End of the Umayyads</h4>
        <p>Internal disputes and over-extension weakened the dynasty. In 132 AH / 750 CE, the Abbāsid revolution overthrew them. Only ʿAbd al-Raḥmān al-Dākhil survived and escaped to Spain, where he founded the Umayyad Emirate of Cordoba.</p>
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
      title: 'Aqā\'id — Beliefs of Ahlus Sunnah, Prophethood, Miracles & Isrā\' wal-Mi\'rāj',
      description:
        'Core beliefs of Ahlus Sunnah wal Jamā\'ah, the qualities and ranks of prophets, the status of the Ṣaḥābah and Awliyā\', miracles (mu\'jizāt) of the prophets, the Night Journey (Isrā\' wal-Mi\'rāj), and karāmāt of the awliyā\'.',
      orderIndex: 4,
      content: `
        <h2>Unit 5: Aqāʾid</h2>

        <h3>Ahlus Sunnah wal-Jamāʿah</h3>
        <p>The people of the Sunnah and the Jamāʿah are those who hold to the path of the Prophet ﷺ and his Companions in belief and practice. They follow the Qur'ān and authentic Sunnah as understood by the Salaf and the four schools of Fiqh (Ḥanafī, Mālikī, Shāfiʿī, Ḥanbalī).</p>

        <h3>Nabawiyyāt — Beliefs about the Prophets</h3>
        <ul>
          <li>All prophets were truthful, trustworthy, intelligent and conveyed their message fully.</li>
          <li>They were protected from major sins (maʿṣūmīn) before and after nubuwwah.</li>
          <li>They were the best of mankind in their time.</li>
          <li>Belief in all prophets is obligatory; rejecting any one is kufr.</li>
          <li>Muḥammad ﷺ is the final prophet (Khātam an-Nabiyyīn) — no prophet will come after him.</li>
        </ul>

        <h3>Muʿjizāt — Miracles of the Prophets</h3>
        <p>A muʿjizah is a supernatural event Allāh grants a prophet to prove his truthfulness. Examples:</p>
        <ul>
          <li>The staff of Mūsā عليه السلام becoming a serpent.</li>
          <li>ʿĪsā عليه السلام healing the blind and reviving the dead by Allāh's permission.</li>
          <li>Ibrāhīm عليه السلام being unharmed by the fire of Namrūd.</li>
          <li>The Qur'ān — the eternal miracle of Muḥammad ﷺ.</li>
          <li>The splitting of the moon (Shaqq al-Qamar).</li>
          <li>Water flowing from his blessed fingers.</li>
        </ul>

        <h3>Al-Isrāʾ wal-Miʿrāj</h3>
        <p>About a year before the Hijrah, in one night, the Prophet ﷺ was taken from Makkah to Bayt al-Maqdis (al-Isrāʾ) on the Burāq, then ascended through the seven heavens (al-Miʿrāj) to the Sidrah al-Muntahā where he received the gift of the five daily prayers.</p>
        <p class="arabic" dir="rtl" lang="ar">سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى</p>
        <p><em>"Glory be to the One who took His servant by night from al-Masjid al-Ḥarām to al-Masjid al-Aqṣā." — Sūrah al-Isrāʾ 17:1</em></p>

        <h4>Some events on the journey</h4>
        <ul>
          <li>He met various prophets in the heavens: Ādam, ʿĪsā, Yaḥyā, Yūsuf, Idrīs, Hārūn, Mūsā and Ibrāhīm عليهم السلام.</li>
          <li>He led all the prophets in Ṣalāh at Bayt al-Maqdis.</li>
          <li>The five daily prayers were originally fifty; reduced through Mūsā's advice.</li>
        </ul>

        <h3>Karāmāt — Miracles of the Awliyāʾ</h3>
        <p>Karāmah is an extraordinary event Allāh grants a righteous believer (walī) without him being a prophet. It is real and a sign of Allāh's favour, not the work of the walī himself.</p>
        <p>Examples: ʿUmar رضي الله عنه addressing Sāriyah from Madīnah while Sāriyah was in Persia; the food of Abū Bakr رضي الله عنه increasing miraculously; the people of the cave (Aṣḥāb al-Kahf) sleeping 309 years.</p>
        <p>A karāmah is never a proof of the rightness of the person's beliefs; only the Qur'ān and Sunnah determine that.</p>
      `,
    },
  });
  console.log('✅ Created Unit 5: Aqā\'id');

  // ============================================================
  // UNIT 6: AKHLĀQ
  // ============================================================
  const unitAkhlaq = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Akhlāq — Oppression, Envy, Ghībah, Pride & Sunnah',
      description:
        'Character development covering the harms of oppression and bullying, the destructive nature of envy, the sin of backbiting (ghībah), the danger of pride, and the benefits of following the Sunnah.',
      orderIndex: 5,
      content: `
        <h2>Unit 6: Akhlāq</h2>

        <h3>Oppression (Ẓulm)</h3>
        <p>Ẓulm is to place a thing where it does not belong, especially to take the rights of another. The Prophet ﷺ said:</p>
        <blockquote><em>"Beware of oppression, for oppression will be darkness on the Day of Judgement."</em> — Muslim</blockquote>
        <p>The greatest ẓulm is shirk; the lowest forms include cheating in transactions, hurting parents, and taking what is not yours.</p>

        <h3>Envy (Ḥasad)</h3>
        <p>Ḥasad is to wish that a blessing be removed from another. The Prophet ﷺ said:</p>
        <blockquote><em>"Beware of envy, for envy consumes good deeds as fire consumes wood."</em> — Abū Dāwūd</blockquote>
        <p>The opposite of ḥasad is <em>ghibṭah</em> — wishing the same blessing for yourself without wishing harm to the other.</p>

        <h3>Ghībah (Backbiting)</h3>
        <p>Ghībah is to mention your Muslim brother in his absence with something he would dislike. Allāh ﷻ says:</p>
        <p class="arabic" dir="rtl" lang="ar">وَلَا يَغْتَب بَّعْضُكُم بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا</p>
        <p><em>"And do not backbite one another. Would any of you like to eat the flesh of his dead brother?" — Sūrah al-Ḥujurāt 49:12</em></p>
        <p>If the matter is true, it is ghībah; if untrue, it is buhtān (slander) — even worse.</p>

        <h3>Pride (Kibr)</h3>
        <p>Kibr is to reject the truth and look down on people. The Prophet ﷺ said:</p>
        <blockquote><em>"No one will enter Paradise who has the weight of a mustard seed of pride in his heart."</em> — Muslim</blockquote>
        <p>It was the sin of Iblīs, who refused to prostrate to Ādam saying: "I am better than him." Its cure is humility (tawāḍuʿ) — to remember that you are a slave of Allāh, created from a drop and returning to dust.</p>

        <h3>Following the Sunnah</h3>
        <p>The Sunnah is the way of the Prophet ﷺ in worship, manners and daily life. Following it brings Allāh's love:</p>
        <p class="arabic" dir="rtl" lang="ar">قُلْ إِن كُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي يُحْبِبْكُمُ اللَّهُ</p>
        <p><em>"Say: if you love Allāh then follow me, and Allāh will love you." — Sūrah Āl ʿImrān 3:31</em></p>
        <p>Small daily sunnahs — eating with the right hand, saying Bismillāh, greeting with salām, using the miswāk — bring great reward and keep the heart connected to the Prophet ﷺ.</p>
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
      title: 'Ādāb — Modesty, Adhān Etiquette, \'Īdayn, Jumu\'ah & Personal Hygiene',
      description:
        'Daily Islamic etiquette covering modesty in dress, ādāb of the adhān, practices of the two \'Īds, Jumu\'ah etiquette, and the ten acts of personal hygiene (fiṭrah).',
      orderIndex: 6,
      content: `
        <h2>Unit 7: Ādāb</h2>

        <h3>Modesty in Dress (Satr)</h3>
        <p>The ʿawrah of a man is from the navel to the knees; it must always be covered before others and in Ṣalāh. Beyond that, modesty (ḥayāʾ) requires loose, clean clothing that does not imitate the opposite gender or non-Muslims in their religious dress.</p>
        <ul>
          <li>Wearing silk and gold is ḥarām for men, ḥalāl for women.</li>
          <li>Clothing should be clean, especially for Ṣalāh and Jumuʿah.</li>
          <li>Avoid arrogance in dress — the Prophet ﷺ warned against the izār (lower garment) going below the ankles in pride.</li>
        </ul>

        <h3>Ādāb of the Adhān</h3>
        <ul>
          <li>Stop talking and listen attentively.</li>
          <li>Repeat each phrase quietly with the muʾadhdhin — except in <em>Ḥayya ʿalaṣ-ṣalāh</em> and <em>Ḥayya ʿalal-falāḥ</em>, where one says: <em>Lā ḥawla wa lā quwwata illā billāh</em>.</li>
          <li>After the Adhān recite the duʿāʾ:</li>
        </ul>
        <p class="arabic" dir="rtl" lang="ar">اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ</p>

        <h3>Ādāb of the ʿĪdayn</h3>
        <ul>
          <li>Have ghusl, wear your best clean clothes and apply ʿiṭr.</li>
          <li>Eat an odd number of dates before ʿĪd al-Fiṭr; do not eat before the Ṣalāh on ʿĪd al-Aḍḥā.</li>
          <li>Walk to the Ṣalāh by one route and return by another.</li>
          <li>Recite the takbīrāt of tashrīq aloud on the way to ʿĪd al-Aḍḥā.</li>
          <li>Exchange greetings of <em>"Taqabbal Allāhu minnā wa minkum"</em>.</li>
        </ul>

        <h3>Ādāb of Jumuʿah</h3>
        <ul>
          <li>Have ghusl, clip nails, brush teeth with miswāk, apply ʿiṭr.</li>
          <li>Wear clean, white clothes if possible.</li>
          <li>Go early to the masjid; the first to arrive is recorded as having offered a camel as a sacrifice.</li>
          <li>Walk to the masjid; recite Sūrah al-Kahf.</li>
          <li>Listen silently to the khuṭbah; do not even tell others to be silent during it.</li>
          <li>Send abundant ṣalawāt on the Prophet ﷺ on this day.</li>
        </ul>

        <h3>Personal Hygiene (Ṭahārah)</h3>
        <p>Cleanliness is half of īmān. The five sunan al-fiṭrah:</p>
        <ol>
          <li>Circumcision (khitān).</li>
          <li>Trimming the moustache.</li>
          <li>Letting the beard grow.</li>
          <li>Trimming the nails.</li>
          <li>Removing hair from the armpits and below the navel.</li>
        </ol>
        <p>These should not be neglected for more than 40 days.</p>
        <p>Other daily ādāb: using the miswāk, washing hands before and after meals, istinjāʾ after using the toilet, and entering the toilet with the left foot saying <em>"Allāhumma innī aʿūdhu bika min al-khubthi wal-khabāʾith"</em>.</p>
      `,
    },
  });
  console.log('✅ Created Unit 7: Ādāb');

  // ============================================================
  // QUESTIONS
  // ============================================================

  console.log('');
  console.log('📝 Creating quiz questions...');

  await prisma.question.createMany({
    data: [
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is "Ṭāhir Muṭahhir" water?',
        options: JSON.stringify(['Fruit juice', 'Rainwater', 'Water mixed with milk', 'Used water from wuḍūʾ']),
        correctAnswer: 'Rainwater',
        explanation: 'Rain, river, sea, spring, well water and melted snow are pure and purifying.',
        difficulty: 'EASY',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the maximum amount of najāsah ghalīẓah excused on clothes?',
        options: JSON.stringify(['A dirham (~5cm)', 'A finger-width', '¼ of the garment', 'Nothing is excused']),
        correctAnswer: 'A dirham (~5cm)',
        explanation: 'Up to the size of a dirham of heavy impurity is excused, though best to wash.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'Reciting Sūrah al-Fātiḥah in every rakʿah is a wājib of Ṣalāh.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Reciting al-Fātiḥah in every rakʿah is wājib in the Ḥanafī school.',
        difficulty: 'EASY',
      },
      {
        unitId: unitFiqh.id,
        type: 'FILL_BLANK',
        questionText: 'The latest age at which a boy is considered bāligh is ____ lunar years.',
        options: null,
        correctAnswer: '15',
        explanation: 'If no other sign of bulūgh appears, a boy is considered mature at 15 lunar years.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many takbīrāt are in Janāzah Ṣalāh?',
        options: JSON.stringify(['2', '3', '4', '5']),
        correctAnswer: '4',
        explanation: 'Janāzah has four takbīrāt with no rukūʿ or sajdah.',
        difficulty: 'EASY',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is added to the Iqāmah that is not in the Adhān?',
        options: JSON.stringify(['Lā ḥawla wa lā quwwata illā billāh', 'Qad qāmati-ṣ-ṣalāh', 'Allāhumma ṣalli ʿalā Muḥammad', 'Bismillāh']),
        correctAnswer: 'Qad qāmati-ṣ-ṣalāh',
        explanation: '"Qad qāmati-ṣ-ṣalāh" is said twice after "Ḥayya ʿalal-falāḥ" in the Iqāmah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'Jumuʿah Ṣalāh is farḍ on every Muslim woman.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Jumuʿah is farḍ on adult, sane, male, free, resident, healthy Muslims.',
        difficulty: 'EASY',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many destructive sins are mentioned in the famous hadith of "the seven destroyers"?',
        options: JSON.stringify(['Five', 'Six', 'Seven', 'Ten']),
        correctAnswer: 'Seven',
        explanation: 'The Prophet ﷺ said: "Avoid the seven destructive sins" — Bukhārī & Muslim.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is NOT one of the seven destroyers?',
        options: JSON.stringify(['Shirk', 'Sorcery', 'Eating pork', 'Consuming the property of an orphan']),
        correctAnswer: 'Eating pork',
        explanation: 'Pork is ḥarām but is not in this specific list. The list includes shirk, sorcery, killing, ribā, orphan\'s wealth, fleeing battle, slandering chaste women.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'A major sin is one for which the Qur\'ān or Sunnah promises Hellfire, the curse of Allāh, or a ḥadd.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'This is the standard definition of kabīrah given by the scholars.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'Sincere repentance is called ____ in Arabic.',
        options: null,
        correctAnswer: 'tawbah',
        explanation: 'Tawbah (توبة) is the sincere returning to Allāh from sins.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'If a sin involves the rights of another person, what extra step is required in tawbah?',
        options: JSON.stringify(['Fasting forty days', 'Returning the right or seeking pardon', 'Visiting the Kaʿbah', 'Nothing extra']),
        correctAnswer: 'Returning the right or seeking pardon',
        explanation: 'Rights between people (ḥuqūq al-ʿibād) require making them right with the person.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'Despairing of Allāh\'s mercy is itself a major sin.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Qur\'ān says only the disbelieving people despair of Allāh\'s mercy.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the name of the famous collection of descriptions of the Prophet ﷺ by Imām al-Tirmidhī?',
        options: JSON.stringify(['Riyāḍ al-Ṣāliḥīn', 'al-Shamāʾil al-Muḥammadiyyah', 'Sīrat Ibn Hishām', 'al-Adab al-Mufrad']),
        correctAnswer: 'al-Shamāʾil al-Muḥammadiyyah',
        explanation: 'al-Shamāʾil al-Muḥammadiyyah is Imām al-Tirmidhī\'s collection on the Prophet\'s appearance and habits.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ laughed loudly so that his molar teeth could be seen.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'He ﷺ smiled and his laugh was mostly a smile; he did not laugh loudly.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who was the first adult man to accept Islām?',
        options: JSON.stringify(['ʿUmar ibn al-Khaṭṭāb', 'Abū Bakr al-Ṣiddīq', 'ʿAlī ibn Abī Ṭālib', 'ʿUthmān ibn ʿAffān']),
        correctAnswer: 'Abū Bakr al-Ṣiddīq',
        explanation: 'Abū Bakr رضي الله عنه was the first adult man to enter Islām.',
        difficulty: 'EASY',
      },
      {
        unitId: unitSirah.id,
        type: 'FILL_BLANK',
        questionText: 'The cave in which the Prophet ﷺ and Abū Bakr hid during Hijrah was the cave of ____.',
        options: null,
        correctAnswer: 'Thawr',
        explanation: 'They hid for three nights in the cave of Thawr south of Makkah.',
        difficulty: 'EASY',
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How long was the khilāfah of Abū Bakr al-Ṣiddīq رضي الله عنه?',
        options: JSON.stringify(['About 6 months', 'About 2½ years', 'About 10 years', 'About 13 years']),
        correctAnswer: 'About 2½ years',
        explanation: 'He ruled from 11 AH until his death in 13 AH.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'Abū Bakr رضي الله عنه ordered the first compilation of the Qur\'ān into one muṣḥaf.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'After the Battle of Yamāmah, on ʿUmar\'s advice, Abū Bakr ordered Zayd ibn Thābit to compile the Qur\'ān.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who killed the tyrant Jālūt (Goliath)?',
        options: JSON.stringify(['Ṭālūt', 'Dāwūd عليه السلام', 'Sulaymān عليه السلام', 'Hārūn عليه السلام']),
        correctAnswer: 'Dāwūd عليه السلام',
        explanation: 'Young Dāwūd عليه السلام killed Jālūt with a stone from his sling.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which bird brought Sulaymān عليه السلام news of the Queen of Sheba?',
        options: JSON.stringify(['Eagle', 'Hoopoe (hudhud)', 'Crow', 'Falcon']),
        correctAnswer: 'Hoopoe (hudhud)',
        explanation: 'The hudhud informed Sulaymān of Bilqīs and her people in Sabaʾ.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: 'Yūnus عليه السلام was swallowed by a great fish after leaving his people without Allāh\'s permission.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'He left Nineveh in anger before being given permission, then was swallowed by the fish.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'FILL_BLANK',
        questionText: 'The Umayyad capital was the city of ____.',
        options: null,
        correctAnswer: 'Damascus',
        explanation: 'Muʿāwiyah moved the capital from Kūfah to Damascus (Dimashq).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which Umayyad Khalīfah built the Dome of the Rock in al-Quds?',
        options: JSON.stringify(['Muʿāwiyah I', 'ʿAbd al-Malik ibn Marwān', 'al-Walīd I', 'ʿUmar ibn ʿAbd al-ʿAzīz']),
        correctAnswer: 'ʿAbd al-Malik ibn Marwān',
        explanation: 'He built Qubbat al-Ṣakhrah and minted the first Islamic dīnār.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which Umayyad Khalīfah is often called the "fifth rightly-guided Khalīfah"?',
        options: JSON.stringify(['Muʿāwiyah I', 'Yazīd', 'ʿUmar ibn ʿAbd al-ʿAzīz', 'Hishām']),
        correctAnswer: 'ʿUmar ibn ʿAbd al-ʿAzīz',
        explanation: 'His justice and simple lifestyle earned him this title.',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: 'The Battle of Poitiers in 732 CE was the furthest Muslim advance into Western Europe.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Also known as Balāṭ al-Shuhadāʾ, fought in France.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of these is NOT one of the four schools of Sunni Fiqh?',
        options: JSON.stringify(['Ḥanafī', 'Mālikī', 'Shāfiʿī', 'Jaʿfarī']),
        correctAnswer: 'Jaʿfarī',
        explanation: 'The four Sunni schools are Ḥanafī, Mālikī, Shāfiʿī and Ḥanbalī.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'A muʿjizah is shown by a prophet, while a karāmah is shown by a walī.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Muʿjizāt are for prophets; karāmāt are for the awliyāʾ.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the eternal miracle of Muḥammad ﷺ?',
        options: JSON.stringify(['The splitting of the moon', 'The Qur\'ān', 'Water from his fingers', 'The Isrāʾ']),
        correctAnswer: 'The Qur\'ān',
        explanation: 'The Qur\'ān is the lasting miracle that remains till the Day of Judgement.',
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
        questionText: 'How many daily prayers were originally given on the Miʿrāj before being reduced to five?',
        options: JSON.stringify(['Ten', 'Twenty', 'Fifty', 'One hundred']),
        correctAnswer: 'Fifty',
        explanation: 'Fifty prayers were reduced to five with the same reward, through Mūsā\'s advice.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'A karāmah proves that the walī is more righteous than every prophet.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'No walī can ever reach the rank of a prophet. Karāmah is a gift from Allāh, not proof of superiority.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ say envy (ḥasad) does to good deeds?',
        options: JSON.stringify(['Doubles them', 'Consumes them like fire consumes wood', 'Has no effect', 'Locks them away']),
        correctAnswer: 'Consumes them like fire consumes wood',
        explanation: 'Envy destroys good deeds as fire destroys wood — Abū Dāwūd.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the difference between ghībah and buhtān?',
        options: JSON.stringify(['Ghībah is true, buhtān is false', 'Ghībah is in writing, buhtān is in speech', 'They are the same', 'Buhtān is allowed']),
        correctAnswer: 'Ghībah is true, buhtān is false',
        explanation: 'If the disliked thing is true, it is ghībah; if untrue, it is slander (buhtān).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'The greatest form of ẓulm is shirk.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Allāh calls shirk "inna-sh-shirka la-ẓulmun ʿaẓīm" — indeed shirk is great oppression.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: 'The opposite of pride (kibr) is ____.',
        options: null,
        correctAnswer: 'tawāḍuʿ',
        explanation: 'Tawāḍuʿ — humility — is the antidote to kibr.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The Prophet ﷺ said no one will enter Paradise who has the weight of a ____ of kibr in his heart.',
        options: JSON.stringify(['Date stone', 'Mustard seed', 'Mountain', 'Stone']),
        correctAnswer: 'Mustard seed',
        explanation: 'Even a mustard seed of kibr keeps one out of Paradise — Muslim.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'Wishing the same blessing for yourself without wanting it taken from another is called ghibṭah and is permissible.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Ghibṭah is allowed; only ḥasad — wishing the blessing removed — is forbidden.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the ʿawrah of a man?',
        options: JSON.stringify(['Only the private parts', 'From the navel to the knees', 'The entire body except face and hands', 'From the shoulders to the knees']),
        correctAnswer: 'From the navel to the knees',
        explanation: 'A man\'s ʿawrah is from the navel to the knees.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'Silk and gold are ḥalāl for men to wear.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'They are ḥarām for men, ḥalāl for women.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is said in reply to "Ḥayya ʿalaṣ-ṣalāh" of the Adhān?',
        options: JSON.stringify(['Allāhu Akbar', 'Lā ḥawla wa lā quwwata illā billāh', 'Subḥān Allāh', 'Bismillāh']),
        correctAnswer: 'Lā ḥawla wa lā quwwata illā billāh',
        explanation: 'This is the prescribed reply to both "Ḥayya ʿalaṣ-ṣalāh" and "Ḥayya ʿalal-falāḥ".',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAdab.id,
        type: 'FILL_BLANK',
        questionText: 'The sunan al-fiṭrah should not be neglected for more than ____ days.',
        options: null,
        correctAnswer: '40',
        explanation: 'Forty days is the maximum mentioned in the Sunnah for clipping nails and removing hair.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which sūrah is sunnah to recite on Jumuʿah?',
        options: JSON.stringify(['Sūrah Yāsīn', 'Sūrah al-Kahf', 'Sūrah ar-Raḥmān', 'Sūrah al-Mulk']),
        correctAnswer: 'Sūrah al-Kahf',
        explanation: 'Reciting al-Kahf on Friday is a beloved sunnah.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'It is sunnah to walk to ʿĪd Ṣalāh by one route and return by another.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'This was the practice of the Prophet ﷺ on ʿĪd.',
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

  const fiqhCards = [
    { front: 'Ṭāhir Muṭahhir', back: 'Pure water that purifies — rain, river, sea, well, spring, snow.', category: 'definition', tags: ['fiqh', 'ṭahārah', 'water'], difficulty: 'EASY' as const },
    { front: 'Najāsah Ghalīẓah', back: 'Heavy impurity (urine, stool, blood, alcohol, pork). Up to a dirham excused.', category: 'definition', tags: ['fiqh', 'ṭahārah', 'najāsah'], difficulty: 'MEDIUM' as const },
    { front: 'Najāsah Khafīfah', back: 'Light impurity — urine of ḥalāl animals. Up to ¼ of garment excused.', category: 'definition', tags: ['fiqh', 'ṭahārah', 'najāsah'], difficulty: 'MEDIUM' as const },
    { front: 'Bulūgh (Maturity)', back: 'Reached by iḥtilām, ejaculation, ability to impregnate, or 15 lunar years.', category: 'definition', tags: ['fiqh', 'bulūgh', 'maturity'], difficulty: 'EASY' as const },
    { front: 'Farāʾiḍ of Ghusl', back: 'Rinsing the mouth, rinsing the nose, washing the whole body.', category: 'rule', tags: ['fiqh', 'ghusl', 'farāʾiḍ'], difficulty: 'EASY' as const },
    { front: 'Sajdah Sahw', back: 'Two prostrations of forgetfulness done when a wājib is missed by mistake.', category: 'rule', tags: ['fiqh', 'ṣalāh', 'sajdah-sahw'], difficulty: 'MEDIUM' as const },
    { front: 'Janāzah Ṣalāh', back: 'Four takbīrāt, no rukūʿ or sajdah. Farḍ kifāyah.', category: 'rule', tags: ['fiqh', 'ṣalāh', 'janāzah'], difficulty: 'EASY' as const },
    { front: 'Iqāmah Difference', back: '"Qad qāmati-ṣ-ṣalāh" is said twice after "Ḥayya ʿalal-falāḥ".', category: 'rule', tags: ['fiqh', 'ṣalāh', 'iqāmah'], difficulty: 'MEDIUM' as const },
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

  const ahadithCards = [
    { front: 'Kabīrah', back: 'A major sin — one which the Qur\'ān/Sunnah threatens with Hellfire, curse, or ḥadd.', category: 'definition', tags: ['aḥādīth', 'kabīrah', 'sins'], difficulty: 'EASY' as const },
    { front: 'Seven Destroyers', back: 'Shirk, sorcery, killing, ribā, orphan\'s wealth, fleeing battle, slandering chaste women.', category: 'rule', tags: ['aḥādīth', 'kabāʾir', 'major-sins'], difficulty: 'MEDIUM' as const },
    { front: 'Tawbah', back: 'Sincere repentance — stop, regret, resolve not to return, restore others\' rights.', category: 'definition', tags: ['aḥādīth', 'tawbah', 'repentance'], difficulty: 'EASY' as const },
    { front: 'ʿUqūq al-Wālidayn', back: 'Disobedience to parents — a major sin.', category: 'definition', tags: ['aḥādīth', 'parents', 'sins'], difficulty: 'EASY' as const },
    { front: 'Buhtān', back: 'Slander — saying about someone what is untrue. Worse than ghībah.', category: 'vocabulary', tags: ['aḥādīth', 'buhtān', 'tongue'], difficulty: 'MEDIUM' as const },
    { front: 'Riyāʾ', back: 'Showing off in worship — counted among the major sins.', category: 'vocabulary', tags: ['aḥādīth', 'riyāʾ', 'sincerity'], difficulty: 'MEDIUM' as const },
    { front: 'Despair', back: 'Despairing of Allāh\'s mercy is itself a major sin (Sūrah az-Zumar 39:53).', category: 'rule', tags: ['aḥādīth', 'despair', 'sins'], difficulty: 'MEDIUM' as const },
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

  const sirahCards = [
    { front: 'Shamāʾil', back: 'The noble physical and moral description of the Prophet ﷺ.', category: 'vocabulary', tags: ['sīrah', 'shamāʾil', 'Prophet'], difficulty: 'EASY' as const },
    { front: 'Khātam an-Nubuwwah', back: 'The seal of prophethood between the shoulders of the Prophet ﷺ.', category: 'definition', tags: ['sīrah', 'Prophet', 'prophethood'], difficulty: 'MEDIUM' as const },
    { front: 'al-Ṣādiq al-Amīn', back: 'The truthful, the trustworthy — title of the Prophet ﷺ before nubuwwah.', category: 'vocabulary', tags: ['sīrah', 'Prophet', 'titles'], difficulty: 'EASY' as const },
    { front: 'Abū Bakr al-Ṣiddīq', back: 'First adult male Muslim, companion of the cave, first Khalīfah.', category: 'definition', tags: ['sīrah', 'Abū-Bakr', 'ṣaḥābah'], difficulty: 'EASY' as const },
    { front: 'Cave of Thawr', back: 'Where the Prophet ﷺ and Abū Bakr hid for three nights during Hijrah.', category: 'definition', tags: ['sīrah', 'hijrah', 'Abū-Bakr'], difficulty: 'EASY' as const },
    { front: 'Ridda Wars', back: 'Wars during Abū Bakr\'s khilāfah against apostates and false prophets.', category: 'definition', tags: ['sīrah', 'ridda', 'Abū-Bakr'], difficulty: 'MEDIUM' as const },
    { front: 'First Muṣḥaf', back: 'Compiled under Abū Bakr by Zayd ibn Thābit, on ʿUmar\'s suggestion.', category: 'definition', tags: ['sīrah', 'qurʾān', 'compilation'], difficulty: 'MEDIUM' as const },
    { front: 'Burial of Abū Bakr', back: 'Beside the Prophet ﷺ in the chamber of ʿĀʾishah in al-Madīnah.', category: 'definition', tags: ['sīrah', 'Abū-Bakr', 'burial'], difficulty: 'EASY' as const },
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

  const tarikhCards = [
    { front: 'Ṭālūt vs Jālūt', back: 'King Saul\'s army defeated Goliath\'s army; Dāwūd killed Jālūt.', category: 'definition', tags: ['tārīkh', 'Dāwūd', 'Banū-Isrāʾīl'], difficulty: 'EASY' as const },
    { front: 'Zabūr', back: 'The scripture revealed to Dāwūd عليه السلام.', category: 'vocabulary', tags: ['tārīkh', 'Dāwūd', 'scripture'], difficulty: 'EASY' as const },
    { front: 'Sulaymān\'s Gift', back: 'A kingdom none after him would have; understood birds, ants, jinn.', category: 'definition', tags: ['tārīkh', 'Sulaymān', 'prophets'], difficulty: 'EASY' as const },
    { front: 'Bilqīs', back: 'Queen of Sabaʾ (Sheba); accepted Islām through Sulaymān عليه السلام.', category: 'definition', tags: ['tārīkh', 'Sulaymān', 'Bilqīs'], difficulty: 'MEDIUM' as const },
    { front: 'Yūnus\' Duʿāʾ', back: '"Lā ilāha illā Anta, Subḥānaka, innī kuntu mina-ẓ-ẓālimīn."', category: 'example', tags: ['tārīkh', 'Yūnus', 'duʿāʾ'], difficulty: 'MEDIUM' as const },
    { front: 'Nineveh', back: 'The city in ʿIrāq to which Yūnus عليه السلام was sent.', category: 'definition', tags: ['tārīkh', 'Yūnus', 'places'], difficulty: 'MEDIUM' as const },
    { front: 'Umayyad Capital', back: 'Damascus (Dimashq), from 41 AH.', category: 'definition', tags: ['tārīkh', 'Umayyads', 'places'], difficulty: 'EASY' as const },
    { front: 'ʿUmar ibn ʿAbd al-ʿAzīz', back: 'Pious Umayyad Khalīfah called the "fifth rightly-guided Khalīfah".', category: 'definition', tags: ['tārīkh', 'Umayyads', 'khalīfah'], difficulty: 'EASY' as const },
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

  const aqaidCards = [
    { front: 'Ahlus Sunnah', back: 'Those following the way of the Prophet ﷺ and his Companions.', category: 'definition', tags: ['ʿaqīdah', 'ahlus-sunnah'], difficulty: 'EASY' as const },
    { front: 'ʿIṣmah', back: 'The protection of prophets from major sins before and after nubuwwah.', category: 'definition', tags: ['ʿaqīdah', 'prophets', 'ʿiṣmah'], difficulty: 'MEDIUM' as const },
    { front: 'Khātam an-Nabiyyīn', back: 'The Seal of the Prophets — Muḥammad ﷺ. No prophet after him.', category: 'definition', tags: ['ʿaqīdah', 'Prophet', 'finality'], difficulty: 'EASY' as const },
    { front: 'Muʿjizah', back: 'Supernatural sign Allāh grants a prophet to prove his truthfulness.', category: 'definition', tags: ['ʿaqīdah', 'muʿjizah', 'prophets'], difficulty: 'EASY' as const },
    { front: 'Al-Isrāʾ', back: 'Night journey from Makkah to Bayt al-Maqdis on the Burāq.', category: 'definition', tags: ['ʿaqīdah', 'isrāʾ', 'Prophet'], difficulty: 'EASY' as const },
    { front: 'Al-Miʿrāj', back: 'Ascension through the seven heavens to Sidrah al-Muntahā.', category: 'definition', tags: ['ʿaqīdah', 'miʿrāj', 'Prophet'], difficulty: 'EASY' as const },
    { front: 'Karāmah', back: 'Extraordinary event Allāh grants a righteous believer (walī).', category: 'definition', tags: ['ʿaqīdah', 'karāmah', 'walī'], difficulty: 'MEDIUM' as const },
    { front: 'Aṣḥāb al-Kahf', back: 'The Companions of the Cave — slept 309 years; a famous karāmah.', category: 'example', tags: ['ʿaqīdah', 'karāmah', 'qurʾān'], difficulty: 'MEDIUM' as const },
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

  const akhlaqCards = [
    { front: 'Ẓulm', back: 'Oppression — placing a thing where it does not belong; taking another\'s right.', category: 'vocabulary', tags: ['akhlāq', 'ẓulm', 'sins'], difficulty: 'EASY' as const },
    { front: 'Ḥasad', back: 'Envy — wishing a blessing be removed from another.', category: 'vocabulary', tags: ['akhlāq', 'ḥasad', 'heart'], difficulty: 'EASY' as const },
    { front: 'Ghibṭah', back: 'Wishing the same blessing for yourself without ill-will. Permissible.', category: 'vocabulary', tags: ['akhlāq', 'ghibṭah', 'heart'], difficulty: 'MEDIUM' as const },
    { front: 'Ghībah', back: 'Backbiting — mentioning a Muslim\'s true fault in his absence.', category: 'vocabulary', tags: ['akhlāq', 'ghībah', 'tongue'], difficulty: 'EASY' as const },
    { front: 'Kibr', back: 'Pride — rejecting truth and looking down on others.', category: 'vocabulary', tags: ['akhlāq', 'kibr', 'heart'], difficulty: 'EASY' as const },
    { front: 'Tawāḍuʿ', back: 'Humility — the cure for kibr.', category: 'vocabulary', tags: ['akhlāq', 'tawāḍuʿ', 'character'], difficulty: 'EASY' as const },
    { front: 'Sunnah Daily', back: 'Right hand for eating, Bismillāh, salām, miswāk — small acts, huge reward.', category: 'example', tags: ['akhlāq', 'sunnah', 'daily'], difficulty: 'MEDIUM' as const },
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

  const adabCards = [
    { front: 'ʿAwrah (Men)', back: 'From the navel to the knees — must be covered always.', category: 'rule', tags: ['ādāb', 'ʿawrah', 'dress'], difficulty: 'EASY' as const },
    { front: 'Silk & Gold', back: 'Ḥarām for men, ḥalāl for women.', category: 'rule', tags: ['ādāb', 'dress', 'ḥarām'], difficulty: 'EASY' as const },
    { front: 'Adhān Reply', back: 'Repeat each phrase quietly; reply "Lā ḥawla wa lā quwwata illā billāh" to the ḥayya phrases.', category: 'rule', tags: ['ādāb', 'adhān', 'sunnah'], difficulty: 'MEDIUM' as const },
    { front: 'Duʿāʾ after Adhān', back: '"Allāhumma rabba hādhihi-d-daʿwati-t-tāmmah..."', category: 'example', tags: ['ādāb', 'adhān', 'duʿāʾ'], difficulty: 'MEDIUM' as const },
    { front: 'ʿĪd Sunnahs', back: 'Ghusl, best clothes, ʿiṭr, dates before Fiṭr, two routes, takbīrāt.', category: 'rule', tags: ['ādāb', 'ʿīd', 'sunnah'], difficulty: 'MEDIUM' as const },
    { front: 'Jumuʿah Sunnahs', back: 'Ghusl, miswāk, ʿiṭr, early arrival, al-Kahf, silence in khuṭbah, ṣalawāt.', category: 'rule', tags: ['ādāb', 'jumuʿah', 'sunnah'], difficulty: 'EASY' as const },
    { front: 'Sunan al-Fiṭrah', back: 'Khitān, trimming moustache, beard, nails, removing under-arm and pubic hair.', category: 'rule', tags: ['ādāb', 'fiṭrah', 'sunnah'], difficulty: 'MEDIUM' as const },
    { front: 'Toilet Duʿāʾ', back: '"Allāhumma innī aʿūdhu bika min al-khubthi wal-khabāʾith." Enter with left foot.', category: 'example', tags: ['ādāb', 'toilet', 'duʿāʾ'], difficulty: 'MEDIUM' as const },
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
      { unitId: unitFiqh.id, arabicText: 'طَهَارَة', transliteration: 'Ṭahārah', translation: 'Purification' },
      { unitId: unitFiqh.id, arabicText: 'نَجَاسَة', transliteration: 'Najāsah', translation: 'Impurity / filth' },
      { unitId: unitFiqh.id, arabicText: 'غُسْل', transliteration: 'Ghusl', translation: 'Ritual bath' },
      { unitId: unitFiqh.id, arabicText: 'بُلُوغ', transliteration: 'Bulūgh', translation: 'Maturity' },
      { unitId: unitFiqh.id, arabicText: 'إِمَام', transliteration: 'Imām', translation: 'Leader of prayer' },
      { unitId: unitFiqh.id, arabicText: 'جَنَازَة', transliteration: 'Janāzah', translation: 'Funeral / funeral prayer' },
      { unitId: unitFiqh.id, arabicText: 'أَذَان', transliteration: 'Adhān', translation: 'Call to prayer' },
      { unitId: unitFiqh.id, arabicText: 'إِقَامَة', transliteration: 'Iqāmah', translation: 'Second call to prayer' },

      { unitId: unitAhadith.id, arabicText: 'كَبِيرَة', transliteration: 'Kabīrah', translation: 'Major sin' },
      { unitId: unitAhadith.id, arabicText: 'تَوْبَة', transliteration: 'Tawbah', translation: 'Repentance' },
      { unitId: unitAhadith.id, arabicText: 'مُوبِقَات', transliteration: 'Mūbiqāt', translation: 'Destructive (sins)' },
      { unitId: unitAhadith.id, arabicText: 'رِبًا', transliteration: 'Ribā', translation: 'Usury / interest' },

      { unitId: unitSirah.id, arabicText: 'شَمَائِل', transliteration: 'Shamāʾil', translation: 'Noble descriptions (of the Prophet ﷺ)' },
      { unitId: unitSirah.id, arabicText: 'خَاتَم النُّبُوَّة', transliteration: 'Khātam an-Nubuwwah', translation: 'Seal of prophethood' },
      { unitId: unitSirah.id, arabicText: 'صِدِّيق', transliteration: 'Ṣiddīq', translation: 'The most truthful' },
      { unitId: unitSirah.id, arabicText: 'خَلِيفَة', transliteration: 'Khalīfah', translation: 'Successor / caliph' },

      { unitId: unitTarikh.id, arabicText: 'زَبُور', transliteration: 'Zabūr', translation: 'The Psalms — scripture of Dāwūd' },
      { unitId: unitTarikh.id, arabicText: 'هُدْهُد', transliteration: 'Hudhud', translation: 'Hoopoe (bird)' },
      { unitId: unitTarikh.id, arabicText: 'دِينَار', transliteration: 'Dīnār', translation: 'Gold coin / Islamic currency' },
      { unitId: unitTarikh.id, arabicText: 'بَرِيد', transliteration: 'Barīd', translation: 'Postal service' },
      { unitId: unitTarikh.id, arabicText: 'قُبَّة الصَّخْرَة', transliteration: 'Qubbat al-Ṣakhrah', translation: 'Dome of the Rock' },

      { unitId: unitAqaid.id, arabicText: 'أَهْل السُّنَّة', transliteration: 'Ahlus Sunnah', translation: 'People of the Sunnah' },
      { unitId: unitAqaid.id, arabicText: 'مُعْجِزَة', transliteration: 'Muʿjizah', translation: 'Miracle of a prophet' },
      { unitId: unitAqaid.id, arabicText: 'كَرَامَة', transliteration: 'Karāmah', translation: 'Miracle of a walī' },
      { unitId: unitAqaid.id, arabicText: 'الْإِسْرَاء وَالْمِعْرَاج', transliteration: 'al-Isrāʾ wal-Miʿrāj', translation: 'The Night Journey and Ascension' },

      { unitId: unitAkhlaq.id, arabicText: 'ظُلْم', transliteration: 'Ẓulm', translation: 'Oppression / wrongdoing' },
      { unitId: unitAkhlaq.id, arabicText: 'حَسَد', transliteration: 'Ḥasad', translation: 'Envy' },
      { unitId: unitAkhlaq.id, arabicText: 'غِيبَة', transliteration: 'Ghībah', translation: 'Backbiting' },
      { unitId: unitAkhlaq.id, arabicText: 'كِبْر', transliteration: 'Kibr', translation: 'Pride / arrogance' },
      { unitId: unitAkhlaq.id, arabicText: 'تَوَاضُع', transliteration: 'Tawāḍuʿ', translation: 'Humility' },

      { unitId: unitAdab.id, arabicText: 'عَوْرَة', transliteration: 'ʿAwrah', translation: 'Parts of the body that must be covered' },
      { unitId: unitAdab.id, arabicText: 'حَيَاء', transliteration: 'Ḥayāʾ', translation: 'Modesty / shame' },
      { unitId: unitAdab.id, arabicText: 'سُنَن الْفِطْرَة', transliteration: 'Sunan al-Fiṭrah', translation: 'Natural practices of cleanliness' },
      { unitId: unitAdab.id, arabicText: 'مِسْوَاك', transliteration: 'Miswāk', translation: 'Tooth-stick' },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 An Nasihah Coursebook 6 (Boys) seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: An Nasihah Coursebook 6 (Boys) (ages 11-12)');
  console.log('   - 7 Units: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā\'id, Akhlāq, Ādāb');
  console.log('   - 44 Quiz questions');
  console.log(`   - ${flashcardIndex} Flashcards`);
  console.log('   - 34 Arabic terms');
}

// Allow standalone execution
async function main() {
  try {
    await seedMaktabCoursebook6Boys();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding An Nasihah Coursebook 6 (Boys):', error);
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
