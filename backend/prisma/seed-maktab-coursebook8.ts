import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 8 — Islamic Curriculum Seed
 * Source: An Nasihah Publications, Age Range: 13–14 years
 *
 * Covers seven subjects: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā'id, Akhlāq, Ādāb
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions and flashcards per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-coursebook8.ts
 */

export async function seedMaktabCoursebook8() {
  console.log('📚 Starting Maktab Coursebook 8 seed...');
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
    where: { slug: 'maktab-coursebook-8' },
    create: {
      slug: 'maktab-coursebook-8',
      title: 'An Nasihah Coursebook 8',
      description: 'A comprehensive Islamic curriculum for teenagers aged 13–14, covering advanced fiqh (nawāfil ṣalāh, nikāḥ, ṭalāq, Islamic transactions, ribā, gambling, schools of fiqh), nine essential aḥādīth on character and worship, sīrah of Rasūlullāh ﷺ (shamā\'il) and the lives of \'Uthmān and \'Alī رضي الله عنهما, Islamic history (Ayyūb عليه السلام, Andalusia, the Crusades, the Ottomans), aqā\'id (attributes of Allāh, istiwā\', īmān, consulting the \'ulamā\'), akhlāq (taqwā, tawakkul, tawbah, modesty in gaze), and ādāb (debates, nikāḥ etiquette, transactions). Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['PRE_TEEN', 'TEEN'],
      isPublished: true,
    },
    update: {
      title: 'An Nasihah Coursebook 8',
      description: 'A comprehensive Islamic curriculum for teenagers aged 13–14, covering advanced fiqh (nawāfil ṣalāh, nikāḥ, ṭalāq, Islamic transactions, ribā, gambling, schools of fiqh), nine essential aḥādīth on character and worship, sīrah of Rasūlullāh ﷺ (shamā\'il) and the lives of \'Uthmān and \'Alī رضي الله عنهما, Islamic history (Ayyūb عليه السلام, Andalusia, the Crusades, the Ottomans), aqā\'id (attributes of Allāh, istiwā\', īmān, consulting the \'ulamā\'), akhlāq (taqwā, tawakkul, tawbah, modesty in gaze), and ādāb (debates, nikāḥ etiquette, transactions). Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['PRE_TEEN', 'TEEN'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // UNIT 1: FIQH
  // ──────────────────────────────────────────────

    const unitFiqh = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-fiqh' } },
    create: {
      slug: 'maktab-8-fiqh',
      courseId: course.id,
      title: 'Fiqh — Nawāfil Ṣalāh, Nikāḥ, Ṭalāq & Islamic Transactions',
      description: 'Advanced fiqh covering types of nawāfil prayers (Ishrāq, Ḍuḥā, Tahajjud, Taḥiyyatul Wuḍū\', Taḥiyyatul Masjid), khushū\' in ṣalāh, congregational prayer, the rulings of nikāḥ and mahr, ṭalāq and \'iddah, buyū\' (trade), ijārah (employment and leasing), ribā (interest), gambling, and the four schools of fiqh.',
      orderIndex: 0,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Distinguish between the different types of nafl ṣalāh, the times they should be performed and their virtues.</li>
  <li>Explain the significance of nikāḥ: the reasons for marrying and the qualities to look for in a spouse.</li>
  <li>Recognise what mahr is and the different types of mahr.</li>
  <li>Describe the different types of ṭalāq and define the rulings for a woman sitting in 'iddah.</li>
  <li>Summarise the rulings regarding transactions, identifying the conditions and examples for each.</li>
  <li>Explain the importance of taqlīd and recognise the four imāms.</li>
</ul>

<h3>Nawāfil Ṣalāh</h3>
<p>Allāh has made the five daily ṣalāh compulsory upon us. Ṣalāh can be thought of as 'meetings and conversations' with the King of the universe. From among the ways to become closer to Allāh is by performing extra ṣalāh. The Messenger of Allāh ﷺ said:</p>
<p><em>"Allāh, the Exalted, has said: 'I will declare war against he who harms my pious worshippers. And the most beloved thing by which My slave comes nearer to Me, is what I have made compulsory upon him; and My slave keeps on coming closer to Me by performing nawāfil.'"</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Ishrāq</h4>
<p>Ṣalātul Ishrāq is a nafl ṣalāh performed after sunrise — best performed fifteen minutes after sunrise. One can perform two or four rak'āt.</p>
<p>The Prophet ﷺ said: <em>"Whosoever performs the Morning Prayer (Fajr) with jamā'ah then remains seated and makes dhikr until sunrise, thereafter he performs two rak'āt, he will gain a reward similar to performing Ḥajj and 'Umrah — complete, complete, complete!"</em> (Tirmidhī)</p>

<h4>Ḍuḥā</h4>
<p>Ḍuḥā is performed in the second half of the morning, towards midday. The minimum is 2 rak'āt and the maximum is 12.</p>
<p>Allāh says: <em>"O Son of Ādam, do not be weak in performing four rak'āt for Me at the beginning of the day: I will supply what you need till the end of the day."</em> (Abū Dāwūd)</p>

<h4>Tahajjud</h4>
<p>Tahajjud is the ṣalāh performed at night after waking from sleep — the most rewarding nafl ṣalāh.</p>
<p><em>"Hold fast to the night prayer, indeed it is the trait of the pious predecessors, a means of nearness to your Lord, an expiation for sins and a barrier from sins."</em> (Tirmidhī)</p>

<h4>Taḥiyyatul Wuḍū'</h4>
<p>Two rak'āt performed after doing wuḍū'. Bilāl رضي الله عنه said he never performed wuḍū' without praying after it, and the Prophet ﷺ heard his footsteps in Paradise. (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Taḥiyyatul Masjid</h4>
<p>Two rak'āt performed upon entering a masjid, expressing respect when entering the house of Allāh.</p>

<h3>Khushū' — Humility in Ṣalāh</h3>
<p><em>"Success is really attained by the believers who concentrate their attention in humbleness when offering ṣalāh… Those are the inheritors who will inherit Firdaws. They will be there forever."</em> (Qur'ān 23:1–11)</p>
<h4>Ways to attain Khushū'</h4>
<ul>
  <li>Prepare yourself properly for ṣalāh.</li>
  <li>Pray at a measured pace.</li>
  <li>Remember Allāh throughout and the Day of Judgement.</li>
  <li>Pause at the end of each verse.</li>
  <li>Recite in a slow and calm manner.</li>
  <li>Vary the sūrahs recited.</li>
  <li>Know that Allāh is listening and responding.</li>
</ul>
<h4>Things to Avoid</h4>
<ul>
  <li>Do not pray when a meal is ready (unless ṣalāh time will lapse).</li>
  <li>Do not pray when needing the washroom.</li>
  <li>Do not wear distracting clothes.</li>
  <li>Do not pray in a lazy manner or fidget.</li>
</ul>

<h3>Jamā'ah Ṣalāh</h3>
<p>Ṣalāh with jamā'ah is greatly emphasised for men. The Prophet ﷺ said: <em>"A man's ṣalāh in congregation is twenty-five times more rewarding than his ṣalāh at home."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p><em>"Make the rows straight and do not differ, lest your hearts differ."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Nikāḥ (Marriage)</h3>
<p>Nikāḥ is a great sunnah in Islām. The Prophet ﷺ said: <em>"Whoever marries has completed half of his faith."</em> (Ṭabarānī)</p>
<h4>Qualities to Look For</h4>
<p><em>"Women are usually married for four reasons: wealth, ancestry, beauty and piety. Marry the pious one and you will be successful."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<h4>Requirements for Nikāḥ</h4>
<p>Offer (ījāb) + Acceptance (qabūl) + at least two male witnesses (or one male and two female) who are Muslim, mature, and sane.</p>
<h4>Mahr (Dower)</h4>
<p>Mahr is wājib — the groom must give it to the bride. The minimum is the value of 10 dirhams (30.618g of silver). Mahr Azwāj an-Nabī was commonly 500 dirhams (1530.9g of silver).</p>

<h3>Ṭalāq (Divorce)</h3>
<p>If all efforts to resolve disputes are exhausted, Islām allows ṭalāq as a last resort.</p>
<h4>Types</h4>
<ul>
  <li><strong>Ṭalāq Raj'ī (Revocable):</strong> The husband says "I give you ṭalāq" once or twice. Within the 'iddah, they can reconcile without a new nikāḥ.</li>
  <li><strong>Ṭalāq Bā'in (Irrevocable):</strong> Uses indirect words with intention. A new nikāḥ is required to reconcile.</li>
</ul>
<h4>'Iddah (Waiting Period)</h4>
<p>Three menstrual cycles (or 90 days if not menstruating). For a pregnant woman, until birth. Upon husband's death, 4 months and 10 days.</p>

<h3>Buyū' (Trade)</h3>
<p><em>"The truthful merchant is ranked with the prophets, the truthful elite and the martyrs."</em> (Tirmidhī)</p>
<h4>Conditions</h4>
<ol>
  <li>The product must be ḥalāl.</li>
  <li>The price and item must be clearly specified.</li>
  <li>No ambiguity in any aspect.</li>
  <li>The transaction should be unconditional.</li>
</ol>

<h3>Ijārah (Employment &amp; Leasing)</h3>
<p><em>"O you who believe, when you transact a debt payable at a specified time, put it in writing."</em> (Qur'ān 2:282)</p>
<p>Before taking any job, the following must be clearly agreed: job description, hours, contract length, wages, payment date, and holidays.</p>

<h3>Ribā (Interest)</h3>
<p>Interest is charging money for giving someone a loan — ḥarām to give and take.</p>
<p><em>"Those who consume interest shall not stand up on the Day of Resurrection except like him who Shayṭān has driven mad."</em> (Qur'ān 2:275)</p>
<p><em>"Allāh destroys interest and increases charity."</em> (Qur'ān 2:276)</p>
<p><em>"Cursed is the receiver of interest, the payer, the recorder, and the two witnesses — they are all alike in guilt."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Gambling</h3>
<p><em>"O those who believe, verily wine, gambling, altar-stones and divining arrows are filth, a work of Shayṭān. Therefore, refrain from it, so that you may be successful."</em> (Qur'ān 5:90–91)</p>

<h3>The Four Schools of Fiqh</h3>
<ol>
  <li><strong>Imām Abū Ḥanīfah</strong> (80–150 AH) — Born in Kūfa, Iraq. A Tābi'ī who met Anas رضي الله عنه. Studied under Ḥammād for nearly two decades. Founded the Ḥanafī school.</li>
  <li><strong>Imām Mālik ibn Anas</strong> (93–179 AH) — Born and lived in Madīnah. Authored al-Muwaṭṭa'. Began lecturing after 70 scholars testified to his capability.</li>
  <li><strong>Imām Shāfi'ī</strong> (150–204 AH) — Born in Gaza. Memorised the Qur'ān at 7 and al-Muwaṭṭa' at 10. Studied under Imām Mālik and Imām Muḥammad.</li>
  <li><strong>Imām Aḥmad ibn Ḥanbal</strong> (164–241 AH) — Born in Baghdad. Travelled extensively seeking knowledge. Studied under Imām Shāfi'ī.</li>
</ol>
`.trim(),
    },
    update: {
      title: 'Fiqh — Nawāfil Ṣalāh, Nikāḥ, Ṭalāq & Islamic Transactions',
      description: 'Advanced fiqh covering types of nawāfil prayers (Ishrāq, Ḍuḥā, Tahajjud, Taḥiyyatul Wuḍū\', Taḥiyyatul Masjid), khushū\' in ṣalāh, congregational prayer, the rulings of nikāḥ and mahr, ṭalāq and \'iddah, buyū\' (trade), ijārah (employment and leasing), ribā (interest), gambling, and the four schools of fiqh.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Distinguish between the different types of nafl ṣalāh, the times they should be performed and their virtues.</li>
  <li>Explain the significance of nikāḥ: the reasons for marrying and the qualities to look for in a spouse.</li>
  <li>Recognise what mahr is and the different types of mahr.</li>
  <li>Describe the different types of ṭalāq and define the rulings for a woman sitting in 'iddah.</li>
  <li>Summarise the rulings regarding transactions, identifying the conditions and examples for each.</li>
  <li>Explain the importance of taqlīd and recognise the four imāms.</li>
</ul>

<h3>Nawāfil Ṣalāh</h3>
<p>Allāh has made the five daily ṣalāh compulsory upon us. Ṣalāh can be thought of as 'meetings and conversations' with the King of the universe. From among the ways to become closer to Allāh is by performing extra ṣalāh. The Messenger of Allāh ﷺ said:</p>
<p><em>"Allāh, the Exalted, has said: 'I will declare war against he who harms my pious worshippers. And the most beloved thing by which My slave comes nearer to Me, is what I have made compulsory upon him; and My slave keeps on coming closer to Me by performing nawāfil.'"</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Ishrāq</h4>
<p>Ṣalātul Ishrāq is a nafl ṣalāh performed after sunrise — best performed fifteen minutes after sunrise. One can perform two or four rak'āt.</p>
<p>The Prophet ﷺ said: <em>"Whosoever performs the Morning Prayer (Fajr) with jamā'ah then remains seated and makes dhikr until sunrise, thereafter he performs two rak'āt, he will gain a reward similar to performing Ḥajj and 'Umrah — complete, complete, complete!"</em> (Tirmidhī)</p>

<h4>Ḍuḥā</h4>
<p>Ḍuḥā is performed in the second half of the morning, towards midday. The minimum is 2 rak'āt and the maximum is 12.</p>
<p>Allāh says: <em>"O Son of Ādam, do not be weak in performing four rak'āt for Me at the beginning of the day: I will supply what you need till the end of the day."</em> (Abū Dāwūd)</p>

<h4>Tahajjud</h4>
<p>Tahajjud is the ṣalāh performed at night after waking from sleep — the most rewarding nafl ṣalāh.</p>
<p><em>"Hold fast to the night prayer, indeed it is the trait of the pious predecessors, a means of nearness to your Lord, an expiation for sins and a barrier from sins."</em> (Tirmidhī)</p>

<h4>Taḥiyyatul Wuḍū'</h4>
<p>Two rak'āt performed after doing wuḍū'. Bilāl رضي الله عنه said he never performed wuḍū' without praying after it, and the Prophet ﷺ heard his footsteps in Paradise. (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Taḥiyyatul Masjid</h4>
<p>Two rak'āt performed upon entering a masjid, expressing respect when entering the house of Allāh.</p>

<h3>Khushū' — Humility in Ṣalāh</h3>
<p><em>"Success is really attained by the believers who concentrate their attention in humbleness when offering ṣalāh… Those are the inheritors who will inherit Firdaws. They will be there forever."</em> (Qur'ān 23:1–11)</p>
<h4>Ways to attain Khushū'</h4>
<ul>
  <li>Prepare yourself properly for ṣalāh.</li>
  <li>Pray at a measured pace.</li>
  <li>Remember Allāh throughout and the Day of Judgement.</li>
  <li>Pause at the end of each verse.</li>
  <li>Recite in a slow and calm manner.</li>
  <li>Vary the sūrahs recited.</li>
  <li>Know that Allāh is listening and responding.</li>
</ul>
<h4>Things to Avoid</h4>
<ul>
  <li>Do not pray when a meal is ready (unless ṣalāh time will lapse).</li>
  <li>Do not pray when needing the washroom.</li>
  <li>Do not wear distracting clothes.</li>
  <li>Do not pray in a lazy manner or fidget.</li>
</ul>

<h3>Jamā'ah Ṣalāh</h3>
<p>Ṣalāh with jamā'ah is greatly emphasised for men. The Prophet ﷺ said: <em>"A man's ṣalāh in congregation is twenty-five times more rewarding than his ṣalāh at home."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p><em>"Make the rows straight and do not differ, lest your hearts differ."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Nikāḥ (Marriage)</h3>
<p>Nikāḥ is a great sunnah in Islām. The Prophet ﷺ said: <em>"Whoever marries has completed half of his faith."</em> (Ṭabarānī)</p>
<h4>Qualities to Look For</h4>
<p><em>"Women are usually married for four reasons: wealth, ancestry, beauty and piety. Marry the pious one and you will be successful."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<h4>Requirements for Nikāḥ</h4>
<p>Offer (ījāb) + Acceptance (qabūl) + at least two male witnesses (or one male and two female) who are Muslim, mature, and sane.</p>
<h4>Mahr (Dower)</h4>
<p>Mahr is wājib — the groom must give it to the bride. The minimum is the value of 10 dirhams (30.618g of silver). Mahr Azwāj an-Nabī was commonly 500 dirhams (1530.9g of silver).</p>

<h3>Ṭalāq (Divorce)</h3>
<p>If all efforts to resolve disputes are exhausted, Islām allows ṭalāq as a last resort.</p>
<h4>Types</h4>
<ul>
  <li><strong>Ṭalāq Raj'ī (Revocable):</strong> The husband says "I give you ṭalāq" once or twice. Within the 'iddah, they can reconcile without a new nikāḥ.</li>
  <li><strong>Ṭalāq Bā'in (Irrevocable):</strong> Uses indirect words with intention. A new nikāḥ is required to reconcile.</li>
</ul>
<h4>'Iddah (Waiting Period)</h4>
<p>Three menstrual cycles (or 90 days if not menstruating). For a pregnant woman, until birth. Upon husband's death, 4 months and 10 days.</p>

<h3>Buyū' (Trade)</h3>
<p><em>"The truthful merchant is ranked with the prophets, the truthful elite and the martyrs."</em> (Tirmidhī)</p>
<h4>Conditions</h4>
<ol>
  <li>The product must be ḥalāl.</li>
  <li>The price and item must be clearly specified.</li>
  <li>No ambiguity in any aspect.</li>
  <li>The transaction should be unconditional.</li>
</ol>

<h3>Ijārah (Employment &amp; Leasing)</h3>
<p><em>"O you who believe, when you transact a debt payable at a specified time, put it in writing."</em> (Qur'ān 2:282)</p>
<p>Before taking any job, the following must be clearly agreed: job description, hours, contract length, wages, payment date, and holidays.</p>

<h3>Ribā (Interest)</h3>
<p>Interest is charging money for giving someone a loan — ḥarām to give and take.</p>
<p><em>"Those who consume interest shall not stand up on the Day of Resurrection except like him who Shayṭān has driven mad."</em> (Qur'ān 2:275)</p>
<p><em>"Allāh destroys interest and increases charity."</em> (Qur'ān 2:276)</p>
<p><em>"Cursed is the receiver of interest, the payer, the recorder, and the two witnesses — they are all alike in guilt."</em> (Ṣaḥīḥ Muslim)</p>

<h3>Gambling</h3>
<p><em>"O those who believe, verily wine, gambling, altar-stones and divining arrows are filth, a work of Shayṭān. Therefore, refrain from it, so that you may be successful."</em> (Qur'ān 5:90–91)</p>

<h3>The Four Schools of Fiqh</h3>
<ol>
  <li><strong>Imām Abū Ḥanīfah</strong> (80–150 AH) — Born in Kūfa, Iraq. A Tābi'ī who met Anas رضي الله عنه. Studied under Ḥammād for nearly two decades. Founded the Ḥanafī school.</li>
  <li><strong>Imām Mālik ibn Anas</strong> (93–179 AH) — Born and lived in Madīnah. Authored al-Muwaṭṭa'. Began lecturing after 70 scholars testified to his capability.</li>
  <li><strong>Imām Shāfi'ī</strong> (150–204 AH) — Born in Gaza. Memorised the Qur'ān at 7 and al-Muwaṭṭa' at 10. Studied under Imām Mālik and Imām Muḥammad.</li>
  <li><strong>Imām Aḥmad ibn Ḥanbal</strong> (164–241 AH) — Born in Baghdad. Travelled extensively seeking knowledge. Studied under Imām Shāfi'ī.</li>
</ol>
`.trim(),
      orderIndex: 0,
    },
  });

  console.log('✅ Created Unit 1:', unitFiqh.title);

  // ──────────────────────────────────────────────
  // UNIT 2: AḤĀDĪTH
  // ──────────────────────────────────────────────

    const unitAhadith = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-ahadith' } },
    create: {
      slug: 'maktab-8-ahadith',
      courseId: course.id,
      title: 'Aḥādīth — Nine Essential Ḥadīths on Character & Worship',
      description: 'Nine carefully selected aḥādīth covering purity of heart, ṣadaqah, greeting with salām, rights of a Muslim, patience in trials, true wealth, sweetness of īmān, closeness to Allāh, and self-sufficiency.',
      orderIndex: 1,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Memorise and understand nine essential aḥādīth on character and worship.</li>
  <li>Apply the lessons of each ḥadīth in daily life.</li>
</ul>

<h3>1. Clean Heart</h3>
<p>Anas رضي الله عنه relates that Rasūlullāh ﷺ said: <em>"O my son, if you can spend each morning and evening with a heart free of hatred or deception against anyone, then do so. My dear son, this is my practice (sunnah) and whoever loves my sunnah loves me, and whoever loves me will be with me in Jannah."</em> (Tirmidhī)</p>
<p>Abū Hurayrah رضي الله عنه narrates that Rasūlullāh ﷺ said: <em>"Allāh is displeased with three things: meaningless chatter, wasting money, and asking too many questions."</em> (Ṣaḥīḥ Muslim)</p>

<h3>2. Ṣadaqah</h3>
<p>Abū Hurayrah رضي الله عنه narrates that Rasūlullāh ﷺ said: <em>"Every morning at dawn, two angels descend — one says, 'O Allāh, give more to the person who spends in charity!' while the other says, 'O Allāh, destroy the wealth of the one who withholds!'"</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>3. Salām</h3>
<p>Anas ibn Mālik رضي الله عنه narrates that Rasūlullāh ﷺ said: <em>"O my dear son, whenever you enter a home greet your family by saying 'Assalāmu 'alaykum' — it will be a blessing for you and your household."</em> (Tirmidhī)</p>

<h3>4. Rights of a Muslim</h3>
<p>Barā' ibn 'Āzib رضي الله عنه narrates: <em>"The Prophet ﷺ instructed us upon seven things: visit the sick, follow funeral processions, pray for one who sneezes, accept invitations, return greetings, help the wronged, and help others fulfil their oaths."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>Ṣuhayb رضي الله عنه narrates: <em>"How wonderful is the situation of a believer — everything is good for him. If he encounters good, he is grateful and that is good for him; if afflicted with hardship, he is patient and that is good for him."</em> (Ṣaḥīḥ Muslim)</p>

<h3>5. Reward of Patience</h3>
<p>Anas رضي الله عنه narrates: <em>"Great rewards are given for great trials, and when Allāh loves a people, He tests them. Whoever accepts the trial cheerfully earns His good pleasure; whoever resents it earns His wrath."</em> (Tirmidhī)</p>
<p>Abud Dardā' رضي الله عنه narrates: <em>"Whoever suffers an injury and forgives the person responsible, Allāh will raise his status and remove one of his sins."</em> (Tirmidhī)</p>

<h3>6. True Wealth</h3>
<p>Abū Hurayrah رضي الله عنه narrates: <em>"Wealth is not in having great riches — true wealth is contentment of the soul."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>The Prophet ﷺ also said: <em>"The religion of Islām is easy. No one ever made it difficult without it becoming too much for him. So avoid extremes and strike a balance."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>7. Sweetness of Īmān</h3>
<p>Anas ibn Mālik رضي الله عنه narrates: <em>"Whoever has three qualities will taste the sweetness of īmān: to love Allāh and His Messenger more than anything else; to love someone for Allāh's sake alone; and to hate to return to unbelief just as much as one would hate to be thrown into the Fire."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p><em>"The first deed a person will be called to account for on the Day of Judgement will be his prayers. If they are in order he will be successful; if not, he will be ruined."</em> (Tirmidhī)</p>

<h3>8. Closeness to Allāh</h3>
<p>Abū Hurayrah رضي الله عنه narrates that Allāh says: <em>"I am as My servant thinks I am. I am with him when he mentions Me. If he comes one span nearer to Me, I go one arm's length nearer to him; if he draws near an arm's length, I go two arms nearer. And if he comes to Me walking, I go to him running."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>Ibn 'Abbās رضي الله عنهما narrates that the Prophet ﷺ said: <em>"Be mindful of Allāh and Allāh will protect you. Be mindful of Allāh and you will find Him in front of you. If you ask, ask Allāh alone. If you seek help, seek help from Allāh alone."</em> (Tirmidhī)</p>

<h3>9. Being Self-Sufficient</h3>
<p>Miqdām رضي الله عنه narrates: <em>"No one eats better food than what he earns with his own hands. The Prophet Dāwūd عليه السلام used to eat from what he earned by the work of his own hands."</em> (Ṣaḥīḥ al-Bukhārī)</p>
`.trim(),
    },
    update: {
      title: 'Aḥādīth — Nine Essential Ḥadīths on Character & Worship',
      description: 'Nine carefully selected aḥādīth covering purity of heart, ṣadaqah, greeting with salām, rights of a Muslim, patience in trials, true wealth, sweetness of īmān, closeness to Allāh, and self-sufficiency.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Memorise and understand nine essential aḥādīth on character and worship.</li>
  <li>Apply the lessons of each ḥadīth in daily life.</li>
</ul>

<h3>1. Clean Heart</h3>
<p>Anas رضي الله عنه relates that Rasūlullāh ﷺ said: <em>"O my son, if you can spend each morning and evening with a heart free of hatred or deception against anyone, then do so. My dear son, this is my practice (sunnah) and whoever loves my sunnah loves me, and whoever loves me will be with me in Jannah."</em> (Tirmidhī)</p>
<p>Abū Hurayrah رضي الله عنه narrates that Rasūlullāh ﷺ said: <em>"Allāh is displeased with three things: meaningless chatter, wasting money, and asking too many questions."</em> (Ṣaḥīḥ Muslim)</p>

<h3>2. Ṣadaqah</h3>
<p>Abū Hurayrah رضي الله عنه narrates that Rasūlullāh ﷺ said: <em>"Every morning at dawn, two angels descend — one says, 'O Allāh, give more to the person who spends in charity!' while the other says, 'O Allāh, destroy the wealth of the one who withholds!'"</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>3. Salām</h3>
<p>Anas ibn Mālik رضي الله عنه narrates that Rasūlullāh ﷺ said: <em>"O my dear son, whenever you enter a home greet your family by saying 'Assalāmu 'alaykum' — it will be a blessing for you and your household."</em> (Tirmidhī)</p>

<h3>4. Rights of a Muslim</h3>
<p>Barā' ibn 'Āzib رضي الله عنه narrates: <em>"The Prophet ﷺ instructed us upon seven things: visit the sick, follow funeral processions, pray for one who sneezes, accept invitations, return greetings, help the wronged, and help others fulfil their oaths."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>Ṣuhayb رضي الله عنه narrates: <em>"How wonderful is the situation of a believer — everything is good for him. If he encounters good, he is grateful and that is good for him; if afflicted with hardship, he is patient and that is good for him."</em> (Ṣaḥīḥ Muslim)</p>

<h3>5. Reward of Patience</h3>
<p>Anas رضي الله عنه narrates: <em>"Great rewards are given for great trials, and when Allāh loves a people, He tests them. Whoever accepts the trial cheerfully earns His good pleasure; whoever resents it earns His wrath."</em> (Tirmidhī)</p>
<p>Abud Dardā' رضي الله عنه narrates: <em>"Whoever suffers an injury and forgives the person responsible, Allāh will raise his status and remove one of his sins."</em> (Tirmidhī)</p>

<h3>6. True Wealth</h3>
<p>Abū Hurayrah رضي الله عنه narrates: <em>"Wealth is not in having great riches — true wealth is contentment of the soul."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>The Prophet ﷺ also said: <em>"The religion of Islām is easy. No one ever made it difficult without it becoming too much for him. So avoid extremes and strike a balance."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>7. Sweetness of Īmān</h3>
<p>Anas ibn Mālik رضي الله عنه narrates: <em>"Whoever has three qualities will taste the sweetness of īmān: to love Allāh and His Messenger more than anything else; to love someone for Allāh's sake alone; and to hate to return to unbelief just as much as one would hate to be thrown into the Fire."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p><em>"The first deed a person will be called to account for on the Day of Judgement will be his prayers. If they are in order he will be successful; if not, he will be ruined."</em> (Tirmidhī)</p>

<h3>8. Closeness to Allāh</h3>
<p>Abū Hurayrah رضي الله عنه narrates that Allāh says: <em>"I am as My servant thinks I am. I am with him when he mentions Me. If he comes one span nearer to Me, I go one arm's length nearer to him; if he draws near an arm's length, I go two arms nearer. And if he comes to Me walking, I go to him running."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>Ibn 'Abbās رضي الله عنهما narrates that the Prophet ﷺ said: <em>"Be mindful of Allāh and Allāh will protect you. Be mindful of Allāh and you will find Him in front of you. If you ask, ask Allāh alone. If you seek help, seek help from Allāh alone."</em> (Tirmidhī)</p>

<h3>9. Being Self-Sufficient</h3>
<p>Miqdām رضي الله عنه narrates: <em>"No one eats better food than what he earns with his own hands. The Prophet Dāwūd عليه السلام used to eat from what he earned by the work of his own hands."</em> (Ṣaḥīḥ al-Bukhārī)</p>
`.trim(),
      orderIndex: 1,
    },
  });

  console.log('✅ Created Unit 2:', unitAhadith.title);

  // ──────────────────────────────────────────────
  // UNIT 3: SĪRAH
  // ──────────────────────────────────────────────

    const unitSirah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-sirah' } },
    create: {
      slug: 'maktab-8-sirah',
      courseId: course.id,
      title: 'Sīrah — Shamā\'il of Rasūlullāh ﷺ, \'Uthmān & \'Alī رضي الله عنهما',
      description: 'The noble character (shamā\'il) of Rasūlullāh ﷺ — his gentleness, humility, bravery and simple life; and the lives, sacrifices and leadership of the third and fourth Khulafā\' ar-Rāshidūn.',
      orderIndex: 2,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Understand the noble character (shamā'il) of Rasūlullāh ﷺ and apply these qualities in daily life.</li>
  <li>Describe the key events in the life of 'Uthmān رضي الله عنه and his sacrifices for Islām.</li>
  <li>Appreciate the bravery, justice and piety of 'Alī رضي الله عنه.</li>
</ul>

<h3>Shamā'il — The Noble Character of Rasūlullāh ﷺ</h3>

<h4>Consideration</h4>
<p>Once a Companion found a bird's egg and took it. The bird began circling in distress. The Prophet ﷺ asked: <em>"Who has distressed this bird by taking its egg? Return it to her."</em> His consideration extended to every living creature.</p>

<h4>Gentleness</h4>
<p>A bedouin once urinated in the masjid. The Companions wanted to rebuke him harshly, but the Prophet ﷺ said: <em>"Leave him alone and pour a bucket of water over it. You have been sent to make things easy, not to make things difficult."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Patience with Those Around Him</h4>
<p>Anas رضي الله عنه served the Prophet ﷺ for ten years and said: <em>"He never once said 'uff' (a word of displeasure) to me. He never said, 'Why did you do this?' or 'Why did you not do that?'"</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Tolerance</h4>
<p>A villager once grabbed the Prophet's ﷺ garment so roughly that it left marks on his neck, demanding wealth. The Prophet ﷺ simply smiled and instructed that the man be given what he asked for. (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Bravery</h4>
<p>'Alī رضي الله عنه said: <em>"When the fighting became fierce, we used to seek shelter behind the Messenger of Allāh ﷺ."</em> At the Battle of Ḥunayn, when soldiers fled, the Prophet ﷺ stood firm on his mule calling out: <em>"I am the Prophet, this is no lie! I am the son of 'Abdul Muṭṭalib!"</em></p>

<h4>Humility</h4>
<p>The Prophet ﷺ would mend his own shoes, patch his own clothes, and milk his own goats. He would help with household chores and never considered himself above any task.</p>

<h4>Loyalty — Treaty of Ḥudaybiyah</h4>
<p>When Abū Jandal escaped from Quraysh seeking refuge, the Prophet ﷺ honoured the treaty and returned him, despite the pain it caused, teaching us to keep our word even when it is difficult.</p>

<h4>Simple Life</h4>
<p>'Ā'ishah رضي الله عنها said: <em>"Three new moons would pass — two months — without any cooking in the house of the Prophet ﷺ. We survived on dates and water."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>The Prophet ﷺ left behind neither money nor anything except his white riding mule, his arms, and a piece of land which he left to charity.</p>

<h3>'Uthmān رضي الله عنه — The Third Khalīfah</h3>

<h4>Early Life and Conversion</h4>
<p>'Uthmān ibn 'Affān رضي الله عنه was born in 576 CE. He was a wealthy and respected merchant of the Quraysh. He accepted Islām through Abū Bakr رضي الله عنه and was among the earliest converts.</p>

<h4>Dhun Nūrayn</h4>
<p>'Uthmān was given the title <strong>Dhun Nūrayn</strong> (Possessor of Two Lights) because he married two daughters of the Prophet ﷺ: Ruqayyah and then Umm Kulthūm.</p>

<h4>Al-'Asharah al-Mubasharah</h4>
<p>He was one of the ten Companions promised Paradise during their lifetime.</p>

<h4>Sacrifices for Islām</h4>
<p>He migrated to Abyssinia with his wife Ruqayyah — the first couple to migrate for the sake of Allāh. He bought the well of <strong>Bi'r Rūmah</strong> for 20,000 dirhams and donated it for the Muslims' use. He also purchased land to expand the Prophet's Masjid in Madīnah.</p>

<h4>Khilāfah</h4>
<p>'Uthmān became khalīfah after 'Umar رضي الله عنه. His greatest achievement was the compilation and standardisation of the Qur'ān into a single unified text (muṣḥaf), which was distributed to major cities.</p>

<h3>'Alī رضي الله عنه — The Fourth Khalīfah</h3>

<h4>Early Acceptance of Islām</h4>
<p>'Alī ibn Abī Ṭālib رضي الله عنه accepted Islām as a youth — he was one of the first to believe. The Prophet ﷺ raised him in his own household.</p>

<h4>The Night of Hijrah</h4>
<p>On the night the Quraysh planned to assassinate the Prophet ﷺ, 'Alī bravely slept in the Prophet's bed, risking his own life so that the Prophet ﷺ could escape safely to Madīnah.</p>

<h4>Bravery and Knowledge</h4>
<p>'Alī رضي الله عنه was known as Asadullāh (the Lion of Allāh). He was the hero of many battles and also one of the most knowledgeable Companions. The Prophet ﷺ said: <em>"I am the city of knowledge and 'Alī is its gate."</em></p>

<h4>Khilāfah</h4>
<p>'Alī moved the capital from Madīnah to Kufa. He faced internal conflicts including the Battle of Ṣiffīn against Mu'āwiyah رضي الله عنه. The Khawārij, a group of extremists, emerged from this period.</p>

<h4>Justice</h4>
<p>Once 'Alī رضي الله عنه lost his shield and found it with a Jewish man. He took the case to the qāḍī (judge), who ruled in favour of the Jewish man because 'Alī could not produce sufficient witnesses. 'Alī accepted the ruling with humility. The Jewish man was so impressed by this justice that he accepted Islām.</p>

<h4>Martyrdom</h4>
<p>'Alī رضي الله عنه was struck by a Khārijī named Ibn Muljam while leading the Fajr prayer in 40 AH. He passed away two days later. He was approximately 63 years old.</p>
`.trim(),
    },
    update: {
      title: 'Sīrah — Shamā\'il of Rasūlullāh ﷺ, \'Uthmān & \'Alī رضي الله عنهما',
      description: 'The noble character (shamā\'il) of Rasūlullāh ﷺ — his gentleness, humility, bravery and simple life; and the lives, sacrifices and leadership of the third and fourth Khulafā\' ar-Rāshidūn.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Understand the noble character (shamā'il) of Rasūlullāh ﷺ and apply these qualities in daily life.</li>
  <li>Describe the key events in the life of 'Uthmān رضي الله عنه and his sacrifices for Islām.</li>
  <li>Appreciate the bravery, justice and piety of 'Alī رضي الله عنه.</li>
</ul>

<h3>Shamā'il — The Noble Character of Rasūlullāh ﷺ</h3>

<h4>Consideration</h4>
<p>Once a Companion found a bird's egg and took it. The bird began circling in distress. The Prophet ﷺ asked: <em>"Who has distressed this bird by taking its egg? Return it to her."</em> His consideration extended to every living creature.</p>

<h4>Gentleness</h4>
<p>A bedouin once urinated in the masjid. The Companions wanted to rebuke him harshly, but the Prophet ﷺ said: <em>"Leave him alone and pour a bucket of water over it. You have been sent to make things easy, not to make things difficult."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Patience with Those Around Him</h4>
<p>Anas رضي الله عنه served the Prophet ﷺ for ten years and said: <em>"He never once said 'uff' (a word of displeasure) to me. He never said, 'Why did you do this?' or 'Why did you not do that?'"</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Tolerance</h4>
<p>A villager once grabbed the Prophet's ﷺ garment so roughly that it left marks on his neck, demanding wealth. The Prophet ﷺ simply smiled and instructed that the man be given what he asked for. (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Bravery</h4>
<p>'Alī رضي الله عنه said: <em>"When the fighting became fierce, we used to seek shelter behind the Messenger of Allāh ﷺ."</em> At the Battle of Ḥunayn, when soldiers fled, the Prophet ﷺ stood firm on his mule calling out: <em>"I am the Prophet, this is no lie! I am the son of 'Abdul Muṭṭalib!"</em></p>

<h4>Humility</h4>
<p>The Prophet ﷺ would mend his own shoes, patch his own clothes, and milk his own goats. He would help with household chores and never considered himself above any task.</p>

<h4>Loyalty — Treaty of Ḥudaybiyah</h4>
<p>When Abū Jandal escaped from Quraysh seeking refuge, the Prophet ﷺ honoured the treaty and returned him, despite the pain it caused, teaching us to keep our word even when it is difficult.</p>

<h4>Simple Life</h4>
<p>'Ā'ishah رضي الله عنها said: <em>"Three new moons would pass — two months — without any cooking in the house of the Prophet ﷺ. We survived on dates and water."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>The Prophet ﷺ left behind neither money nor anything except his white riding mule, his arms, and a piece of land which he left to charity.</p>

<h3>'Uthmān رضي الله عنه — The Third Khalīfah</h3>

<h4>Early Life and Conversion</h4>
<p>'Uthmān ibn 'Affān رضي الله عنه was born in 576 CE. He was a wealthy and respected merchant of the Quraysh. He accepted Islām through Abū Bakr رضي الله عنه and was among the earliest converts.</p>

<h4>Dhun Nūrayn</h4>
<p>'Uthmān was given the title <strong>Dhun Nūrayn</strong> (Possessor of Two Lights) because he married two daughters of the Prophet ﷺ: Ruqayyah and then Umm Kulthūm.</p>

<h4>Al-'Asharah al-Mubasharah</h4>
<p>He was one of the ten Companions promised Paradise during their lifetime.</p>

<h4>Sacrifices for Islām</h4>
<p>He migrated to Abyssinia with his wife Ruqayyah — the first couple to migrate for the sake of Allāh. He bought the well of <strong>Bi'r Rūmah</strong> for 20,000 dirhams and donated it for the Muslims' use. He also purchased land to expand the Prophet's Masjid in Madīnah.</p>

<h4>Khilāfah</h4>
<p>'Uthmān became khalīfah after 'Umar رضي الله عنه. His greatest achievement was the compilation and standardisation of the Qur'ān into a single unified text (muṣḥaf), which was distributed to major cities.</p>

<h3>'Alī رضي الله عنه — The Fourth Khalīfah</h3>

<h4>Early Acceptance of Islām</h4>
<p>'Alī ibn Abī Ṭālib رضي الله عنه accepted Islām as a youth — he was one of the first to believe. The Prophet ﷺ raised him in his own household.</p>

<h4>The Night of Hijrah</h4>
<p>On the night the Quraysh planned to assassinate the Prophet ﷺ, 'Alī bravely slept in the Prophet's bed, risking his own life so that the Prophet ﷺ could escape safely to Madīnah.</p>

<h4>Bravery and Knowledge</h4>
<p>'Alī رضي الله عنه was known as Asadullāh (the Lion of Allāh). He was the hero of many battles and also one of the most knowledgeable Companions. The Prophet ﷺ said: <em>"I am the city of knowledge and 'Alī is its gate."</em></p>

<h4>Khilāfah</h4>
<p>'Alī moved the capital from Madīnah to Kufa. He faced internal conflicts including the Battle of Ṣiffīn against Mu'āwiyah رضي الله عنه. The Khawārij, a group of extremists, emerged from this period.</p>

<h4>Justice</h4>
<p>Once 'Alī رضي الله عنه lost his shield and found it with a Jewish man. He took the case to the qāḍī (judge), who ruled in favour of the Jewish man because 'Alī could not produce sufficient witnesses. 'Alī accepted the ruling with humility. The Jewish man was so impressed by this justice that he accepted Islām.</p>

<h4>Martyrdom</h4>
<p>'Alī رضي الله عنه was struck by a Khārijī named Ibn Muljam while leading the Fajr prayer in 40 AH. He passed away two days later. He was approximately 63 years old.</p>
`.trim(),
      orderIndex: 2,
    },
  });

  console.log('✅ Created Unit 3:', unitSirah.title);

  // ──────────────────────────────────────────────
  // UNIT 4: TĀRĪKH
  // ──────────────────────────────────────────────

    const unitTarikh = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-tarikh' } },
    create: {
      slug: 'maktab-8-tarikh',
      courseId: course.id,
      title: 'Tārīkh — Ayyūb, Andalusia, the Crusades & the Ottomans',
      description: 'The patience of Prophet Ayyūb عليه السلام, the rise and fall of Muslim Spain (711–1492 AD), the Crusades and the heroes Nūruddīn and Ṣalāḥuddīn, the Ottoman Empire (1299–1923 AD), and key lessons from Islamic history.',
      orderIndex: 3,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Describe the patience of Ayyūb عليه السلام and its lessons for daily life.</li>
  <li>Outline the rise and fall of Muslim Spain (al-Andalus).</li>
  <li>Explain the significance of the Crusades and the roles of Nūruddīn and Ṣalāḥuddīn.</li>
  <li>Summarise the rise, achievements and decline of the Ottoman Empire.</li>
</ul>

<h3>Ayyūb عليه السلام — The Prophet of Patience</h3>
<p>Ayyūb عليه السلام was a wealthy and pious prophet blessed with health, wealth, and a large family. Allāh tested him by taking away everything — his wealth, his children, and his health. He was afflicted with a severe illness for <strong>seven years</strong>, yet he never once complained to anyone other than Allāh.</p>
<p><em>"And remember Our servant Ayyūb, when he called to his Lord: 'Indeed, Shayṭān has touched me with hardship and suffering.'"</em> (Qur'ān 38:41)</p>
<p>His wife remained faithful throughout his trial. When he finally called upon Allāh, he was told: <em>"Strike with your foot — here is cool water to wash with and to drink."</em> (Qur'ān 38:42). Allāh restored his health, doubled his wealth, and blessed him with a new family.</p>
<p><strong>Lesson:</strong> No matter how severe the trial, a believer must remain patient and turn only to Allāh for relief.</p>

<h3>Al-Andalus — Muslim Spain (711–1492 AD)</h3>

<h4>The Conquest</h4>
<p>In 711 AD, the Muslim general <strong>Ṭāriq ibn Ziyād</strong> crossed the strait (later named Jabal Ṭāriq — Gibraltar) with an army and defeated the Visigothic King Roderic. Within a few years, most of the Iberian Peninsula was under Muslim rule.</p>
<p>'Abdur Raḥmān al-Dākhil established the Umayyad Emirate of Córdoba, and later 'Abdur Raḥmān III declared a Caliphate. Córdoba became one of the most advanced cities in Europe.</p>

<h4>Golden Age</h4>
<p>Muslim Spain became a beacon of learning, tolerance, and civilisation:</p>
<ul>
  <li>Córdoba had over <strong>600 libraries</strong> and its great mosque was a wonder of architecture.</li>
  <li>Muslims, Christians, and Jews lived together in relative harmony (convivencia).</li>
  <li>Scholars excelled in medicine, astronomy, mathematics, agriculture, and philosophy.</li>
  <li>Translations of Greek and Arabic texts into Latin helped spark the European Renaissance.</li>
</ul>

<h4>Decline and Fall</h4>
<p>Internal divisions (ta'ifas — petty kingdoms) weakened Muslim unity. The Christian Reconquista gradually recaptured territory. In 1492 AD, the last Muslim ruler of Granada, Abū 'Abdillāh (Boabdil), surrendered to Ferdinand and Isabella.</p>
<p><strong>Lesson:</strong> The greatest lesson from Islamic Spain is the danger of <strong>division</strong> and disunity. When Muslims divided into warring factions, they lost everything.</p>

<h3>The Crusades</h3>

<h4>Background</h4>
<p>In 1095, Pope Urban II called for a holy war to recapture Jerusalem from the Muslims. In 1099, the Crusaders conquered Jerusalem and massacred its Muslim and Jewish inhabitants.</p>

<h4>Nūruddīn Zankī</h4>
<p>Nūruddīn Zankī (1118–1174 AD) was a pious and just ruler who united the Muslim lands of Syria and Egypt. He was known as a man of prayer, fasting, and justice. His year of unification was 1155 AD. He prepared the ground for the reconquest of Jerusalem.</p>

<h4>Ṣalāḥuddīn al-Ayyūbī</h4>
<p>Ṣalāḥuddīn (1137–1193 AD) succeeded Nūruddīn's vision. At the <strong>Battle of Ḥiṭṭīn</strong> in 1187 AD, he decisively defeated the Crusader forces. He then peacefully conquered Jerusalem, allowing Christians to leave with their belongings — a stark contrast to the bloodshed of 1099.</p>
<p>When he died, he had barely enough money for his funeral. He gave away almost everything to the poor.</p>

<h3>The Ottoman Empire (1299–1923 AD)</h3>

<h4>Rise</h4>
<p>The Ottoman state was founded by 'Uthmān I in 1299 AD in Anatolia (modern Turkey). The Ottomans rapidly expanded through military skill, justice, and good governance.</p>

<h4>Conquest of Constantinople</h4>
<p>In 1453 AD, Sultan <strong>Meḥmet II</strong> conquered Constantinople (modern Istanbul), fulfilling the prophecy of the Prophet ﷺ: <em>"You will certainly conquer Constantinople. How blessed is the commander who conquers it and how blessed is his army."</em> (Aḥmad)</p>
<p>He renamed it Islāmbol and converted the Hagia Sophia into a masjid. The conquest marked the end of the Byzantine Empire.</p>

<h4>Golden Age</h4>
<p>Under Sulaymān the Magnificent (1520–1566), the Ottoman Empire stretched across three continents. The Ottomans built magnificent mosques, bridges, and public works. They maintained the ḥaramayn (Makkah and Madīnah) for centuries.</p>

<h4>Decline and End</h4>
<p>Internal corruption, military defeats, and European colonialism weakened the empire. After World War I, the empire was dismantled. In 1924, the Caliphate was officially abolished by Mustafa Kemal Atatürk.</p>
`.trim(),
    },
    update: {
      title: 'Tārīkh — Ayyūb, Andalusia, the Crusades & the Ottomans',
      description: 'The patience of Prophet Ayyūb عليه السلام, the rise and fall of Muslim Spain (711–1492 AD), the Crusades and the heroes Nūruddīn and Ṣalāḥuddīn, the Ottoman Empire (1299–1923 AD), and key lessons from Islamic history.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Describe the patience of Ayyūb عليه السلام and its lessons for daily life.</li>
  <li>Outline the rise and fall of Muslim Spain (al-Andalus).</li>
  <li>Explain the significance of the Crusades and the roles of Nūruddīn and Ṣalāḥuddīn.</li>
  <li>Summarise the rise, achievements and decline of the Ottoman Empire.</li>
</ul>

<h3>Ayyūb عليه السلام — The Prophet of Patience</h3>
<p>Ayyūb عليه السلام was a wealthy and pious prophet blessed with health, wealth, and a large family. Allāh tested him by taking away everything — his wealth, his children, and his health. He was afflicted with a severe illness for <strong>seven years</strong>, yet he never once complained to anyone other than Allāh.</p>
<p><em>"And remember Our servant Ayyūb, when he called to his Lord: 'Indeed, Shayṭān has touched me with hardship and suffering.'"</em> (Qur'ān 38:41)</p>
<p>His wife remained faithful throughout his trial. When he finally called upon Allāh, he was told: <em>"Strike with your foot — here is cool water to wash with and to drink."</em> (Qur'ān 38:42). Allāh restored his health, doubled his wealth, and blessed him with a new family.</p>
<p><strong>Lesson:</strong> No matter how severe the trial, a believer must remain patient and turn only to Allāh for relief.</p>

<h3>Al-Andalus — Muslim Spain (711–1492 AD)</h3>

<h4>The Conquest</h4>
<p>In 711 AD, the Muslim general <strong>Ṭāriq ibn Ziyād</strong> crossed the strait (later named Jabal Ṭāriq — Gibraltar) with an army and defeated the Visigothic King Roderic. Within a few years, most of the Iberian Peninsula was under Muslim rule.</p>
<p>'Abdur Raḥmān al-Dākhil established the Umayyad Emirate of Córdoba, and later 'Abdur Raḥmān III declared a Caliphate. Córdoba became one of the most advanced cities in Europe.</p>

<h4>Golden Age</h4>
<p>Muslim Spain became a beacon of learning, tolerance, and civilisation:</p>
<ul>
  <li>Córdoba had over <strong>600 libraries</strong> and its great mosque was a wonder of architecture.</li>
  <li>Muslims, Christians, and Jews lived together in relative harmony (convivencia).</li>
  <li>Scholars excelled in medicine, astronomy, mathematics, agriculture, and philosophy.</li>
  <li>Translations of Greek and Arabic texts into Latin helped spark the European Renaissance.</li>
</ul>

<h4>Decline and Fall</h4>
<p>Internal divisions (ta'ifas — petty kingdoms) weakened Muslim unity. The Christian Reconquista gradually recaptured territory. In 1492 AD, the last Muslim ruler of Granada, Abū 'Abdillāh (Boabdil), surrendered to Ferdinand and Isabella.</p>
<p><strong>Lesson:</strong> The greatest lesson from Islamic Spain is the danger of <strong>division</strong> and disunity. When Muslims divided into warring factions, they lost everything.</p>

<h3>The Crusades</h3>

<h4>Background</h4>
<p>In 1095, Pope Urban II called for a holy war to recapture Jerusalem from the Muslims. In 1099, the Crusaders conquered Jerusalem and massacred its Muslim and Jewish inhabitants.</p>

<h4>Nūruddīn Zankī</h4>
<p>Nūruddīn Zankī (1118–1174 AD) was a pious and just ruler who united the Muslim lands of Syria and Egypt. He was known as a man of prayer, fasting, and justice. His year of unification was 1155 AD. He prepared the ground for the reconquest of Jerusalem.</p>

<h4>Ṣalāḥuddīn al-Ayyūbī</h4>
<p>Ṣalāḥuddīn (1137–1193 AD) succeeded Nūruddīn's vision. At the <strong>Battle of Ḥiṭṭīn</strong> in 1187 AD, he decisively defeated the Crusader forces. He then peacefully conquered Jerusalem, allowing Christians to leave with their belongings — a stark contrast to the bloodshed of 1099.</p>
<p>When he died, he had barely enough money for his funeral. He gave away almost everything to the poor.</p>

<h3>The Ottoman Empire (1299–1923 AD)</h3>

<h4>Rise</h4>
<p>The Ottoman state was founded by 'Uthmān I in 1299 AD in Anatolia (modern Turkey). The Ottomans rapidly expanded through military skill, justice, and good governance.</p>

<h4>Conquest of Constantinople</h4>
<p>In 1453 AD, Sultan <strong>Meḥmet II</strong> conquered Constantinople (modern Istanbul), fulfilling the prophecy of the Prophet ﷺ: <em>"You will certainly conquer Constantinople. How blessed is the commander who conquers it and how blessed is his army."</em> (Aḥmad)</p>
<p>He renamed it Islāmbol and converted the Hagia Sophia into a masjid. The conquest marked the end of the Byzantine Empire.</p>

<h4>Golden Age</h4>
<p>Under Sulaymān the Magnificent (1520–1566), the Ottoman Empire stretched across three continents. The Ottomans built magnificent mosques, bridges, and public works. They maintained the ḥaramayn (Makkah and Madīnah) for centuries.</p>

<h4>Decline and End</h4>
<p>Internal corruption, military defeats, and European colonialism weakened the empire. After World War I, the empire was dismantled. In 1924, the Caliphate was officially abolished by Mustafa Kemal Atatürk.</p>
`.trim(),
      orderIndex: 3,
    },
  });

  console.log('✅ Created Unit 4:', unitTarikh.title);

  // ──────────────────────────────────────────────
  // UNIT 5: AQĀ'ID
  // ──────────────────────────────────────────────

    const unitAqaid = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-aqaid' } },
    create: {
      slug: 'maktab-8-aqaid',
      courseId: course.id,
      title: 'Aqā\'id — Attributes of Allāh, Istiwā\', Īmān & the \'Ulamā\'',
      description: 'Understanding the attributes (ṣifāt) of Allāh including the mutashābihāt, the approaches of tafwīḍ and ta\'wīl, the meaning of istiwā\', the importance of full conviction in shahādah, and the role of authentic \'ulamā\' and isnād.',
      orderIndex: 4,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Understand the attributes (ṣifāt) of Allāh and the concept of mutashābihāt.</li>
  <li>Explain the approaches of tafwīḍ and ta'wīl in understanding ambiguous texts.</li>
  <li>Define istiwā' and its correct understanding in Islamic theology.</li>
  <li>Appreciate the importance of the shahādah with full conviction.</li>
  <li>Recognise the role of the 'ulamā' and the significance of isnād.</li>
</ul>

<h3>The Attributes of Allāh</h3>
<p>Allāh describes Himself in the Qur'ān with many attributes (ṣifāt): He is the All-Knowing, the All-Seeing, the All-Hearing, the Most Merciful, the Most Powerful. These are called <strong>muḥkamāt</strong> — clear verses whose meanings are well established.</p>
<p>However, some verses describe Allāh with words like "Hand" (yad), "Face" (wajh), and "Eye" ('ayn). These are known as <strong>mutashābihāt</strong> — verses whose apparent meaning might suggest a resemblance to creation.</p>
<p><em>"There is nothing like unto Him, and He is the Hearing, the Seeing."</em> (Qur'ān 42:11)</p>
<p>This fundamental verse establishes that Allāh does not resemble His creation in any way.</p>

<h3>Tafwīḍ and Ta'wīl</h3>
<p>The scholars of Ahl al-Sunnah have two approaches to the mutashābihāt:</p>
<ol>
  <li><strong>Tafwīḍ:</strong> To believe in the text as it is and hand over its true meaning to Allāh. We affirm the words but do not attempt to define their precise meaning. This was the approach of many of the Salaf.</li>
  <li><strong>Ta'wīl:</strong> To interpret the text in a manner that befits Allāh's majesty, without attributing physical characteristics. For example, "Hand" may be interpreted as power or generosity. This approach was used by later scholars to protect common people from misunderstanding.</li>
</ol>
<p>Both approaches are valid within Ahl al-Sunnah. What is not permissible is to take these verses literally and attribute physical form to Allāh (tajsīm) or to deny them entirely (ta'ṭīl).</p>

<h3>Istiwā'</h3>
<p><em>"The Most Merciful rose over ('alā) the Throne (istiwā')."</em> (Qur'ān 20:5)</p>
<p>Imām Mālik was asked about this verse and replied: <em>"Istiwā' is not unknown. The 'how' (kayf) is not conceivable. Belief in it is obligatory. Asking about it is an innovation."</em></p>
<p>Allāh does not physically sit on His Throne like a created being. His istiwā' is in a manner that befits His majesty, without resemblance to creation.</p>

<h3>Shahādah with Full Conviction</h3>
<p>The shahādah is not merely words spoken by the tongue. It requires full conviction (yaqīn) in the heart. A person who says the shahādah must believe in:</p>
<ul>
  <li>The oneness of Allāh (tawḥīd) — no partner, no equal, no rival.</li>
  <li>The prophethood of Muḥammad ﷺ — the final messenger of Allāh.</li>
  <li>Everything that the Prophet ﷺ brought — the Qur'ān, Sunnah, and the teachings of Islām.</li>
</ul>

<h3>The Role of the 'Ulamā'</h3>
<p>The Prophet ﷺ said: <em>"The 'ulamā' are the inheritors of the prophets."</em> (Abū Dāwūd)</p>
<p>The 'ulamā' preserve and transmit the knowledge of Islām from generation to generation. It is essential for laypeople to consult qualified scholars on matters of religion rather than relying on their own understanding of the Qur'ān and ḥadīth.</p>

<h3>Isnād — The Chain of Narration</h3>
<p>Isnād is a unique feature of Islāmic scholarship — an unbroken chain of transmission from a scholar back to the Prophet ﷺ. It ensures the authenticity of knowledge.</p>
<p>'Abdullāh ibn al-Mubārak said: <em>"Isnād is part of the religion. Were it not for isnād, anyone could say whatever they wished."</em></p>
<p>Every student of knowledge receives their learning through a teacher, who learned from their teacher, in an unbroken chain going back to Rasūlullāh ﷺ.</p>
`.trim(),
    },
    update: {
      title: 'Aqā\'id — Attributes of Allāh, Istiwā\', Īmān & the \'Ulamā\'',
      description: 'Understanding the attributes (ṣifāt) of Allāh including the mutashābihāt, the approaches of tafwīḍ and ta\'wīl, the meaning of istiwā\', the importance of full conviction in shahādah, and the role of authentic \'ulamā\' and isnād.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Understand the attributes (ṣifāt) of Allāh and the concept of mutashābihāt.</li>
  <li>Explain the approaches of tafwīḍ and ta'wīl in understanding ambiguous texts.</li>
  <li>Define istiwā' and its correct understanding in Islamic theology.</li>
  <li>Appreciate the importance of the shahādah with full conviction.</li>
  <li>Recognise the role of the 'ulamā' and the significance of isnād.</li>
</ul>

<h3>The Attributes of Allāh</h3>
<p>Allāh describes Himself in the Qur'ān with many attributes (ṣifāt): He is the All-Knowing, the All-Seeing, the All-Hearing, the Most Merciful, the Most Powerful. These are called <strong>muḥkamāt</strong> — clear verses whose meanings are well established.</p>
<p>However, some verses describe Allāh with words like "Hand" (yad), "Face" (wajh), and "Eye" ('ayn). These are known as <strong>mutashābihāt</strong> — verses whose apparent meaning might suggest a resemblance to creation.</p>
<p><em>"There is nothing like unto Him, and He is the Hearing, the Seeing."</em> (Qur'ān 42:11)</p>
<p>This fundamental verse establishes that Allāh does not resemble His creation in any way.</p>

<h3>Tafwīḍ and Ta'wīl</h3>
<p>The scholars of Ahl al-Sunnah have two approaches to the mutashābihāt:</p>
<ol>
  <li><strong>Tafwīḍ:</strong> To believe in the text as it is and hand over its true meaning to Allāh. We affirm the words but do not attempt to define their precise meaning. This was the approach of many of the Salaf.</li>
  <li><strong>Ta'wīl:</strong> To interpret the text in a manner that befits Allāh's majesty, without attributing physical characteristics. For example, "Hand" may be interpreted as power or generosity. This approach was used by later scholars to protect common people from misunderstanding.</li>
</ol>
<p>Both approaches are valid within Ahl al-Sunnah. What is not permissible is to take these verses literally and attribute physical form to Allāh (tajsīm) or to deny them entirely (ta'ṭīl).</p>

<h3>Istiwā'</h3>
<p><em>"The Most Merciful rose over ('alā) the Throne (istiwā')."</em> (Qur'ān 20:5)</p>
<p>Imām Mālik was asked about this verse and replied: <em>"Istiwā' is not unknown. The 'how' (kayf) is not conceivable. Belief in it is obligatory. Asking about it is an innovation."</em></p>
<p>Allāh does not physically sit on His Throne like a created being. His istiwā' is in a manner that befits His majesty, without resemblance to creation.</p>

<h3>Shahādah with Full Conviction</h3>
<p>The shahādah is not merely words spoken by the tongue. It requires full conviction (yaqīn) in the heart. A person who says the shahādah must believe in:</p>
<ul>
  <li>The oneness of Allāh (tawḥīd) — no partner, no equal, no rival.</li>
  <li>The prophethood of Muḥammad ﷺ — the final messenger of Allāh.</li>
  <li>Everything that the Prophet ﷺ brought — the Qur'ān, Sunnah, and the teachings of Islām.</li>
</ul>

<h3>The Role of the 'Ulamā'</h3>
<p>The Prophet ﷺ said: <em>"The 'ulamā' are the inheritors of the prophets."</em> (Abū Dāwūd)</p>
<p>The 'ulamā' preserve and transmit the knowledge of Islām from generation to generation. It is essential for laypeople to consult qualified scholars on matters of religion rather than relying on their own understanding of the Qur'ān and ḥadīth.</p>

<h3>Isnād — The Chain of Narration</h3>
<p>Isnād is a unique feature of Islāmic scholarship — an unbroken chain of transmission from a scholar back to the Prophet ﷺ. It ensures the authenticity of knowledge.</p>
<p>'Abdullāh ibn al-Mubārak said: <em>"Isnād is part of the religion. Were it not for isnād, anyone could say whatever they wished."</em></p>
<p>Every student of knowledge receives their learning through a teacher, who learned from their teacher, in an unbroken chain going back to Rasūlullāh ﷺ.</p>
`.trim(),
      orderIndex: 4,
    },
  });

  console.log('✅ Created Unit 5:', unitAqaid.title);

  // ──────────────────────────────────────────────
  // UNIT 6: AKHLĀQ
  // ──────────────────────────────────────────────

    const unitAkhlaq = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-akhlaq' } },
    create: {
      slug: 'maktab-8-akhlaq',
      courseId: course.id,
      title: 'Akhlāq — Taqwā, Tawakkul, Tawbah & Modesty in Gaze',
      description: 'Reflecting on the shortness of this worldly life, cultivating taqwā (God-consciousness), placing tawakkul (reliance) upon Allāh, the gift of tawbah (repentance), and guarding modesty in gaze.',
      orderIndex: 5,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Reflect on the temporary nature of this worldly life.</li>
  <li>Understand and cultivate taqwā (God-consciousness) in daily life.</li>
  <li>Place tawakkul (reliance) upon Allāh while also taking practical means.</li>
  <li>Appreciate the gift of tawbah and its three conditions.</li>
  <li>Guard modesty in gaze and understand the concept of ḥayā'.</li>
</ul>

<h3>The Shortness of This Worldly Life</h3>
<p>Imām Ghazālī compared worldly life to a man who fell into a well. He grabbed a branch growing from the side. Below him was a serpent with its mouth open, and above him was a lion waiting. Two mice — one white (day) and one black (night) — gnawed at the branch. On the branch was a beehive dripping honey. The man became distracted licking the honey, forgetting his perilous situation.</p>
<p>This parable illustrates how people become distracted by the fleeting pleasures of this world while forgetting death and the Hereafter.</p>
<p><em>"Every soul shall taste death. And you will only be given your full compensation on the Day of Resurrection."</em> (Qur'ān 3:185)</p>

<h3>Taqwā — God-Consciousness</h3>
<p>Taqwā comes from the root wiqāyah (to protect). It means to abstain from sin for the fear of Allāh, to be conscious of Allāh in all matters — in public and in private.</p>
<p><em>"Whoever fears Allāh, He brings forth a way out for him, and provides for him from sources he could never imagine."</em> (Qur'ān 65:2–3)</p>
<p>'Umar رضي الله عنه asked Ubayy ibn Ka'b رضي الله عنه about taqwā. Ubayy said: <em>"Have you ever walked on a path full of thorns?" 'Umar said: "Yes." Ubayy said: "What did you do?" 'Umar said: "I gathered my garments and walked carefully." Ubayy said: "That is taqwā."</em></p>

<h3>Tawakkul — Reliance upon Allāh</h3>
<p>Tawakkul means to rely upon Allāh after taking all practical means. It is not laziness or neglecting effort — it is trusting that the outcome is in Allāh's hands.</p>
<p>The Prophet ﷺ said: <em>"If you were to rely upon Allāh with true reliance, He would provide for you as He provides the birds — they go out in the morning hungry and return in the evening full."</em> (Tirmidhī)</p>
<p>When asked whether one should tie one's camel or rely on Allāh, the Prophet ﷺ said: <em>"Tie it, then place your trust in Allāh."</em> (Tirmidhī)</p>

<h3>Tawbah — Repentance</h3>
<p>Allāh loves those who repent. The door of tawbah is always open. Allāh says: <em>"Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allāh. Indeed, Allāh forgives all sins."</em> (Qur'ān 39:53)</p>
<h4>Three Conditions of Tawbah</h4>
<ol>
  <li><strong>Regret (nadam):</strong> To feel genuine remorse for the sin committed.</li>
  <li><strong>Abandoning the sin:</strong> To immediately stop the sinful action.</li>
  <li><strong>Resolve not to return:</strong> To make a firm intention never to commit the sin again.</li>
</ol>
<p>If the sin involves the rights of another person, a fourth condition applies: to return the right or seek their forgiveness.</p>

<h3>Ḥayā' — Modesty</h3>
<p>The Prophet ﷺ said: <em>"Īmān consists of more than sixty branches. And ḥayā' (modesty) is a part of faith."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>Modesty in gaze is an essential aspect of ḥayā'. Allāh commands: <em>"Tell the believing men to lower their gaze and guard their modesty."</em> (Qur'ān 24:30)</p>
<p>The Prophet ﷺ said: <em>"The glance is a poisoned arrow from the arrows of Iblīs. Whoever lowers his gaze for the sake of Allāh, Allāh will grant him a sweetness of faith that he will feel in his heart."</em></p>

<h3>Istighfār — Seeking Forgiveness</h3>
<p>The Prophet ﷺ used to seek Allāh's forgiveness more than seventy times a day, despite being sinless. Istighfār brings relief from anxiety, opens doors of provision, and is a means of earning Allāh's mercy.</p>
<p>Sayyidul Istighfār (the master supplication for forgiveness): <em>"O Allāh, You are my Lord. There is no god but You. You created me and I am Your slave. I follow Your covenant and promise as best I can. I seek refuge in You from the evil I have done. I acknowledge Your blessings upon me and I acknowledge my sins. Forgive me, for none forgives sins but You."</em></p>
`.trim(),
    },
    update: {
      title: 'Akhlāq — Taqwā, Tawakkul, Tawbah & Modesty in Gaze',
      description: 'Reflecting on the shortness of this worldly life, cultivating taqwā (God-consciousness), placing tawakkul (reliance) upon Allāh, the gift of tawbah (repentance), and guarding modesty in gaze.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Reflect on the temporary nature of this worldly life.</li>
  <li>Understand and cultivate taqwā (God-consciousness) in daily life.</li>
  <li>Place tawakkul (reliance) upon Allāh while also taking practical means.</li>
  <li>Appreciate the gift of tawbah and its three conditions.</li>
  <li>Guard modesty in gaze and understand the concept of ḥayā'.</li>
</ul>

<h3>The Shortness of This Worldly Life</h3>
<p>Imām Ghazālī compared worldly life to a man who fell into a well. He grabbed a branch growing from the side. Below him was a serpent with its mouth open, and above him was a lion waiting. Two mice — one white (day) and one black (night) — gnawed at the branch. On the branch was a beehive dripping honey. The man became distracted licking the honey, forgetting his perilous situation.</p>
<p>This parable illustrates how people become distracted by the fleeting pleasures of this world while forgetting death and the Hereafter.</p>
<p><em>"Every soul shall taste death. And you will only be given your full compensation on the Day of Resurrection."</em> (Qur'ān 3:185)</p>

<h3>Taqwā — God-Consciousness</h3>
<p>Taqwā comes from the root wiqāyah (to protect). It means to abstain from sin for the fear of Allāh, to be conscious of Allāh in all matters — in public and in private.</p>
<p><em>"Whoever fears Allāh, He brings forth a way out for him, and provides for him from sources he could never imagine."</em> (Qur'ān 65:2–3)</p>
<p>'Umar رضي الله عنه asked Ubayy ibn Ka'b رضي الله عنه about taqwā. Ubayy said: <em>"Have you ever walked on a path full of thorns?" 'Umar said: "Yes." Ubayy said: "What did you do?" 'Umar said: "I gathered my garments and walked carefully." Ubayy said: "That is taqwā."</em></p>

<h3>Tawakkul — Reliance upon Allāh</h3>
<p>Tawakkul means to rely upon Allāh after taking all practical means. It is not laziness or neglecting effort — it is trusting that the outcome is in Allāh's hands.</p>
<p>The Prophet ﷺ said: <em>"If you were to rely upon Allāh with true reliance, He would provide for you as He provides the birds — they go out in the morning hungry and return in the evening full."</em> (Tirmidhī)</p>
<p>When asked whether one should tie one's camel or rely on Allāh, the Prophet ﷺ said: <em>"Tie it, then place your trust in Allāh."</em> (Tirmidhī)</p>

<h3>Tawbah — Repentance</h3>
<p>Allāh loves those who repent. The door of tawbah is always open. Allāh says: <em>"Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allāh. Indeed, Allāh forgives all sins."</em> (Qur'ān 39:53)</p>
<h4>Three Conditions of Tawbah</h4>
<ol>
  <li><strong>Regret (nadam):</strong> To feel genuine remorse for the sin committed.</li>
  <li><strong>Abandoning the sin:</strong> To immediately stop the sinful action.</li>
  <li><strong>Resolve not to return:</strong> To make a firm intention never to commit the sin again.</li>
</ol>
<p>If the sin involves the rights of another person, a fourth condition applies: to return the right or seek their forgiveness.</p>

<h3>Ḥayā' — Modesty</h3>
<p>The Prophet ﷺ said: <em>"Īmān consists of more than sixty branches. And ḥayā' (modesty) is a part of faith."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>Modesty in gaze is an essential aspect of ḥayā'. Allāh commands: <em>"Tell the believing men to lower their gaze and guard their modesty."</em> (Qur'ān 24:30)</p>
<p>The Prophet ﷺ said: <em>"The glance is a poisoned arrow from the arrows of Iblīs. Whoever lowers his gaze for the sake of Allāh, Allāh will grant him a sweetness of faith that he will feel in his heart."</em></p>

<h3>Istighfār — Seeking Forgiveness</h3>
<p>The Prophet ﷺ used to seek Allāh's forgiveness more than seventy times a day, despite being sinless. Istighfār brings relief from anxiety, opens doors of provision, and is a means of earning Allāh's mercy.</p>
<p>Sayyidul Istighfār (the master supplication for forgiveness): <em>"O Allāh, You are my Lord. There is no god but You. You created me and I am Your slave. I follow Your covenant and promise as best I can. I seek refuge in You from the evil I have done. I acknowledge Your blessings upon me and I acknowledge my sins. Forgive me, for none forgives sins but You."</em></p>
`.trim(),
      orderIndex: 5,
    },
  });

  console.log('✅ Created Unit 6:', unitAkhlaq.title);

  // ──────────────────────────────────────────────
  // UNIT 7: ĀDĀB
  // ──────────────────────────────────────────────

    const unitAdab = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-adab' } },
    create: {
      slug: 'maktab-8-adab',
      courseId: course.id,
      title: 'Ādāb — Debates, Nikāḥ Etiquette & Transactions',
      description: 'The Islamic etiquette of debates and discussions, the ādāb of nikāḥ ceremonies, and the etiquette for sellers and buyers in Islamic transactions.',
      orderIndex: 6,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Understand the Islamic etiquette of debates and discussions.</li>
  <li>Learn the ādāb of nikāḥ ceremonies and the engagement period.</li>
  <li>Apply Islamic principles in buying and selling transactions.</li>
</ul>

<h3>Ādāb of Debates and Discussions</h3>
<p>Islām encourages seeking knowledge and healthy intellectual discussion. However, there is a clear difference between a sincere discussion and an argument driven by ego.</p>
<h4>Guidelines for Islamic Debate</h4>
<ul>
  <li>The intention should always be to reach the <strong>correct conclusion</strong>, not to win or show off.</li>
  <li>Speak with respect and do not raise your voice.</li>
  <li>Listen to the other person's point of view fully before responding.</li>
  <li>Use evidence from the Qur'ān and Sunnah where possible.</li>
  <li>If you realise you are wrong, accept it graciously.</li>
  <li>Avoid personal attacks and insults.</li>
  <li>The Prophet ﷺ said: <em>"I guarantee a house in the middle of Jannah for the one who abandons arguing even if he is right."</em> (Abū Dāwūd)</li>
</ul>
<p><em>"Invite to the way of your Lord with wisdom and good counsel, and argue with them in a way that is best."</em> (Qur'ān 16:125)</p>

<h3>Ādāb of Nikāḥ</h3>
<h4>The Engagement Period</h4>
<p>Once a proposal is accepted, the couple are still non-maḥram (not yet married). It is <strong>not permissible</strong> for a fiancé and fiancée to text, call, or meet privately before the nikāḥ. All interactions should be conducted through families.</p>

<h4>The Nikāḥ Ceremony</h4>
<ul>
  <li>Keep the nikāḥ simple — the most blessed nikāḥ is the one with the least expense.</li>
  <li>Perform the nikāḥ in a masjid if possible.</li>
  <li>The khuṭbah (sermon) of nikāḥ should be recited.</li>
  <li>Announce the nikāḥ publicly — do not keep it secret.</li>
</ul>

<h4>Walīmah</h4>
<p>The walīmah (wedding feast) is a sunnah. The Prophet ﷺ said: <em>"The worst feast is the walīmah where the rich are invited and the poor are left out."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>The walīmah should be simple and within one's means. Extravagance and show-off should be avoided.</p>

<h3>Ādāb of Transactions</h3>

<h4>Etiquette for the Seller</h4>
<ul>
  <li>Be honest and transparent — do not hide defects in the product.</li>
  <li>Have prices clearly marked on items for sale.</li>
  <li>Do not swear oaths to sell goods — the Prophet ﷺ warned against this.</li>
  <li>If an item has a fault, inform the buyer before selling.</li>
  <li>Be fair in weighing and measuring.</li>
  <li>Do not hoard goods to drive up prices.</li>
</ul>

<h4>Etiquette for the Buyer</h4>
<ul>
  <li>Do not be extravagant — buy what you need.</li>
  <li>Do not lie when returning an item for a refund.</li>
  <li>Pay the agreed price willingly and on time.</li>
  <li>Do not haggle excessively to the point of oppression.</li>
  <li>If you see a seller in need, be generous.</li>
</ul>

<p>The Prophet ﷺ said: <em>"Speak good or remain silent."</em> (Ṣaḥīḥ al-Bukhārī) — This applies equally to business dealings, where honesty and kind speech ensure barakah in one's trade.</p>
`.trim(),
    },
    update: {
      title: 'Ādāb — Debates, Nikāḥ Etiquette & Transactions',
      description: 'The Islamic etiquette of debates and discussions, the ādāb of nikāḥ ceremonies, and the etiquette for sellers and buyers in Islamic transactions.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Understand the Islamic etiquette of debates and discussions.</li>
  <li>Learn the ādāb of nikāḥ ceremonies and the engagement period.</li>
  <li>Apply Islamic principles in buying and selling transactions.</li>
</ul>

<h3>Ādāb of Debates and Discussions</h3>
<p>Islām encourages seeking knowledge and healthy intellectual discussion. However, there is a clear difference between a sincere discussion and an argument driven by ego.</p>
<h4>Guidelines for Islamic Debate</h4>
<ul>
  <li>The intention should always be to reach the <strong>correct conclusion</strong>, not to win or show off.</li>
  <li>Speak with respect and do not raise your voice.</li>
  <li>Listen to the other person's point of view fully before responding.</li>
  <li>Use evidence from the Qur'ān and Sunnah where possible.</li>
  <li>If you realise you are wrong, accept it graciously.</li>
  <li>Avoid personal attacks and insults.</li>
  <li>The Prophet ﷺ said: <em>"I guarantee a house in the middle of Jannah for the one who abandons arguing even if he is right."</em> (Abū Dāwūd)</li>
</ul>
<p><em>"Invite to the way of your Lord with wisdom and good counsel, and argue with them in a way that is best."</em> (Qur'ān 16:125)</p>

<h3>Ādāb of Nikāḥ</h3>
<h4>The Engagement Period</h4>
<p>Once a proposal is accepted, the couple are still non-maḥram (not yet married). It is <strong>not permissible</strong> for a fiancé and fiancée to text, call, or meet privately before the nikāḥ. All interactions should be conducted through families.</p>

<h4>The Nikāḥ Ceremony</h4>
<ul>
  <li>Keep the nikāḥ simple — the most blessed nikāḥ is the one with the least expense.</li>
  <li>Perform the nikāḥ in a masjid if possible.</li>
  <li>The khuṭbah (sermon) of nikāḥ should be recited.</li>
  <li>Announce the nikāḥ publicly — do not keep it secret.</li>
</ul>

<h4>Walīmah</h4>
<p>The walīmah (wedding feast) is a sunnah. The Prophet ﷺ said: <em>"The worst feast is the walīmah where the rich are invited and the poor are left out."</em> (Ṣaḥīḥ al-Bukhārī)</p>
<p>The walīmah should be simple and within one's means. Extravagance and show-off should be avoided.</p>

<h3>Ādāb of Transactions</h3>

<h4>Etiquette for the Seller</h4>
<ul>
  <li>Be honest and transparent — do not hide defects in the product.</li>
  <li>Have prices clearly marked on items for sale.</li>
  <li>Do not swear oaths to sell goods — the Prophet ﷺ warned against this.</li>
  <li>If an item has a fault, inform the buyer before selling.</li>
  <li>Be fair in weighing and measuring.</li>
  <li>Do not hoard goods to drive up prices.</li>
</ul>

<h4>Etiquette for the Buyer</h4>
<ul>
  <li>Do not be extravagant — buy what you need.</li>
  <li>Do not lie when returning an item for a refund.</li>
  <li>Pay the agreed price willingly and on time.</li>
  <li>Do not haggle excessively to the point of oppression.</li>
  <li>If you see a seller in need, be generous.</li>
</ul>

<p>The Prophet ﷺ said: <em>"Speak good or remain silent."</em> (Ṣaḥīḥ al-Bukhārī) — This applies equally to business dealings, where honesty and kind speech ensure barakah in one's trade.</p>
`.trim(),
      orderIndex: 6,
    },
  });

  console.log('✅ Created Unit 7:', unitAdab.title);

  // ══════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('📝 Creating quiz questions...');

  // --- Fiqh Quizzes ---

    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-8-fiqh-q1' },
      create: {
        externalId: 'maktab-8-fiqh-q1',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the best time to perform Ṣalātul Ishrāq?',
        options: JSON.stringify(['Before sunrise', 'Fifteen minutes after sunrise', 'At midday', 'After \'Aṣr']),
        correctAnswer: 'Fifteen minutes after sunrise',
        explanation: 'Ṣalātul Ishrāq is a nafl ṣalāh best performed approximately fifteen minutes after sunrise.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What is the best time to perform Ṣalātul Ishrāq?',
        options: JSON.stringify(['Before sunrise', 'Fifteen minutes after sunrise', 'At midday', 'After \'Aṣr']),
        correctAnswer: 'Fifteen minutes after sunrise',
        explanation: 'Ṣalātul Ishrāq is a nafl ṣalāh best performed approximately fifteen minutes after sunrise.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-fiqh-q2' },
      create: {
        externalId: 'maktab-8-fiqh-q2',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Tahajjud is performed at what time?',
        options: JSON.stringify(['After Fajr', 'Before Maghrib', 'At night after waking from sleep', 'At midday']),
        correctAnswer: 'At night after waking from sleep',
        explanation: 'Tahajjud is the ṣalāh performed at night after waking from sleep. It is the most rewarding nafl ṣalāh.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Tahajjud is performed at what time?',
        options: JSON.stringify(['After Fajr', 'Before Maghrib', 'At night after waking from sleep', 'At midday']),
        correctAnswer: 'At night after waking from sleep',
        explanation: 'Tahajjud is the ṣalāh performed at night after waking from sleep. It is the most rewarding nafl ṣalāh.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-fiqh-q3' },
      create: {
        externalId: 'maktab-8-fiqh-q3',
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'Khushū\' means praying ṣalāh as quickly as possible.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Khushū\' is humility and devotion in ṣalāh — praying at a measured pace with full concentration, not rushing.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Khushū\' means praying ṣalāh as quickly as possible.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Khushū\' is humility and devotion in ṣalāh — praying at a measured pace with full concentration, not rushing.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-fiqh-q4' },
      create: {
        externalId: 'maktab-8-fiqh-q4',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many times more rewarding is ṣalāh in congregation?',
        options: JSON.stringify(['Five times', 'Ten times', 'Twenty-five times', 'Fifty times']),
        correctAnswer: 'Twenty-five times',
        explanation: 'The Prophet ﷺ said: "A man\'s ṣalāh in congregation is twenty-five times more rewarding than his ṣalāh at home."',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How many times more rewarding is ṣalāh in congregation?',
        options: JSON.stringify(['Five times', 'Ten times', 'Twenty-five times', 'Fifty times']),
        correctAnswer: 'Twenty-five times',
        explanation: 'The Prophet ﷺ said: "A man\'s ṣalāh in congregation is twenty-five times more rewarding than his ṣalāh at home."',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-fiqh-q5' },
      create: {
        externalId: 'maktab-8-fiqh-q5',
        unitId: unitFiqh.id,
        type: 'FILL_BLANK',
        questionText: 'The minimum amount of mahr is the value of _____ dirhams.',
        options: undefined,
        correctAnswer: '10',
        explanation: 'The minimum mahr is the value of 10 dirhams (30.618g of silver).',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'The minimum amount of mahr is the value of _____ dirhams.',
        options: undefined,
        correctAnswer: '10',
        explanation: 'The minimum mahr is the value of 10 dirhams (30.618g of silver).',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-fiqh-q6' },
      create: {
        externalId: 'maktab-8-fiqh-q6',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the two types of ṭalāq?',
        options: JSON.stringify(['Major and minor', 'Raj\'ī and Bā\'in', 'Written and spoken', 'Fardh and wājib']),
        correctAnswer: 'Raj\'ī and Bā\'in',
        explanation: 'Ṭalāq Raj\'ī (revocable) allows reconciliation within the \'iddah. Ṭalāq Bā\'in (irrevocable) requires a new nikāḥ to reconcile.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'What are the two types of ṭalāq?',
        options: JSON.stringify(['Major and minor', 'Raj\'ī and Bā\'in', 'Written and spoken', 'Fardh and wājib']),
        correctAnswer: 'Raj\'ī and Bā\'in',
        explanation: 'Ṭalāq Raj\'ī (revocable) allows reconciliation within the \'iddah. Ṭalāq Bā\'in (irrevocable) requires a new nikāḥ to reconcile.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-fiqh-q7' },
      create: {
        externalId: 'maktab-8-fiqh-q7',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is NOT a condition for a valid sale (buyū\')?',
        options: JSON.stringify(['Product must be ḥalāl', 'Price must be specified', 'No ambiguity', 'The buyer must be wealthy']),
        correctAnswer: 'The buyer must be wealthy',
        explanation: 'The conditions for a valid sale are: the product must be ḥalāl, the price must be specified, there should be no ambiguity, and the transaction should be unconditional. Wealth of the buyer is not a condition.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Which of the following is NOT a condition for a valid sale (buyū\')?',
        options: JSON.stringify(['Product must be ḥalāl', 'Price must be specified', 'No ambiguity', 'The buyer must be wealthy']),
        correctAnswer: 'The buyer must be wealthy',
        explanation: 'The conditions for a valid sale are: the product must be ḥalāl, the price must be specified, there should be no ambiguity, and the transaction should be unconditional. Wealth of the buyer is not a condition.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-fiqh-q8' },
      create: {
        externalId: 'maktab-8-fiqh-q8',
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'Ribā (interest) is permissible in small amounts.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Dealing in interest (ribā) is ḥarām in any amount. The Qur\'ān and ḥadīth clearly prohibit it.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Ribā (interest) is permissible in small amounts.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Dealing in interest (ribā) is ḥarām in any amount. The Qur\'ān and ḥadīth clearly prohibit it.',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Aḥādīth Quizzes ---

    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-8-ahadith-q1' },
      create: {
        externalId: 'maktab-8-ahadith-q1',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ say about keeping a clean heart?',
        options: JSON.stringify(['It is optional', 'Whoever loves my sunnah will be with me in Jannah', 'Only scholars need to keep a clean heart', 'It has no reward']),
        correctAnswer: 'Whoever loves my sunnah will be with me in Jannah',
        explanation: 'The Prophet ﷺ said: "This is my sunnah and whoever loves my sunnah loves me, and whoever loves me will be with me in Jannah."',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What did the Prophet ﷺ say about keeping a clean heart?',
        options: JSON.stringify(['It is optional', 'Whoever loves my sunnah will be with me in Jannah', 'Only scholars need to keep a clean heart', 'It has no reward']),
        correctAnswer: 'Whoever loves my sunnah will be with me in Jannah',
        explanation: 'The Prophet ﷺ said: "This is my sunnah and whoever loves my sunnah loves me, and whoever loves me will be with me in Jannah."',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-ahadith-q2' },
      create: {
        externalId: 'maktab-8-ahadith-q2',
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'True wealth is contentment of the _____.',
        options: undefined,
        correctAnswer: 'soul',
        explanation: 'The Prophet ﷺ said: "Wealth is not in having great riches — true wealth is contentment of the soul."',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'True wealth is contentment of the _____.',
        options: undefined,
        correctAnswer: 'soul',
        explanation: 'The Prophet ﷺ said: "Wealth is not in having great riches — true wealth is contentment of the soul."',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-ahadith-q3' },
      create: {
        externalId: 'maktab-8-ahadith-q3',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three qualities that give a taste of sweetness of īmān?',
        options: JSON.stringify(['Fasting, prayer, charity', 'Loving Allāh and His Messenger most, loving for Allāh\'s sake, hating to return to unbelief', 'Wealth, health, knowledge', 'Reading Qur\'ān, praying tahajjud, giving ṣadaqah']),
        correctAnswer: 'Loving Allāh and His Messenger most, loving for Allāh\'s sake, hating to return to unbelief',
        explanation: 'The Prophet ﷺ mentioned three qualities: loving Allāh and His Messenger above all, loving someone only for Allāh\'s sake, and hating to return to disbelief as one would hate being thrown into fire.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'What are the three qualities that give a taste of sweetness of īmān?',
        options: JSON.stringify(['Fasting, prayer, charity', 'Loving Allāh and His Messenger most, loving for Allāh\'s sake, hating to return to unbelief', 'Wealth, health, knowledge', 'Reading Qur\'ān, praying tahajjud, giving ṣadaqah']),
        correctAnswer: 'Loving Allāh and His Messenger most, loving for Allāh\'s sake, hating to return to unbelief',
        explanation: 'The Prophet ﷺ mentioned three qualities: loving Allāh and His Messenger above all, loving someone only for Allāh\'s sake, and hating to return to disbelief as one would hate being thrown into fire.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-ahadith-q4' },
      create: {
        externalId: 'maktab-8-ahadith-q4',
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'The first deed a person will be called to account for is charity.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The first deed a person will be called to account for on the Day of Judgement is ṣalāh (prayer), not charity.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The first deed a person will be called to account for is charity.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The first deed a person will be called to account for on the Day of Judgement is ṣalāh (prayer), not charity.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-ahadith-q5' },
      create: {
        externalId: 'maktab-8-ahadith-q5',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'When Allāh loves a people, He _____ them.',
        options: JSON.stringify(['rewards', 'tests', 'enriches', 'ignores']),
        correctAnswer: 'tests',
        explanation: 'The Prophet ﷺ said: "Great rewards are given for great trials, and when Allāh loves a people, He tests them."',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'When Allāh loves a people, He _____ them.',
        options: JSON.stringify(['rewards', 'tests', 'enriches', 'ignores']),
        correctAnswer: 'tests',
        explanation: 'The Prophet ﷺ said: "Great rewards are given for great trials, and when Allāh loves a people, He tests them."',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-ahadith-q6' },
      create: {
        externalId: 'maktab-8-ahadith-q6',
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'No one eats better food than what he earns with his own _____.',
        options: undefined,
        correctAnswer: 'hands',
        explanation: 'The Prophet ﷺ said: "No one eats better food than what he earns with his own hands. The Prophet Dāwūd عليه السلام used to eat from what he earned by the work of his own hands."',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'No one eats better food than what he earns with his own _____.',
        options: undefined,
        correctAnswer: 'hands',
        explanation: 'The Prophet ﷺ said: "No one eats better food than what he earns with his own hands. The Prophet Dāwūd عليه السلام used to eat from what he earned by the work of his own hands."',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-ahadith-q7' },
      create: {
        externalId: 'maktab-8-ahadith-q7',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The seven rights of a Muslim include all EXCEPT:',
        options: JSON.stringify(['Visiting the sick', 'Following funerals', 'Returning greetings', 'Lending money']),
        correctAnswer: 'Lending money',
        explanation: 'The seven rights include: visiting the sick, following funerals, praying for one who sneezes, accepting invitations, returning greetings, helping the wronged, and helping others fulfil their oaths. Lending money is not listed.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'The seven rights of a Muslim include all EXCEPT:',
        options: JSON.stringify(['Visiting the sick', 'Following funerals', 'Returning greetings', 'Lending money']),
        correctAnswer: 'Lending money',
        explanation: 'The seven rights include: visiting the sick, following funerals, praying for one who sneezes, accepting invitations, returning greetings, helping the wronged, and helping others fulfil their oaths. Lending money is not listed.',
        difficulty: 'MEDIUM',
      },
    })
  ]);

  // --- Sīrah Quizzes ---

    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-8-sirah-q1' },
      create: {
        externalId: 'maktab-8-sirah-q1',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What title was \'Uthmān رضي الله عنه given?',
        options: JSON.stringify(['Al-Amīn', 'Dhun Nūrayn', 'Aṣ-Ṣiddīq', 'Al-Fārūq']),
        correctAnswer: 'Dhun Nūrayn',
        explanation: '\'Uthmān was called Dhun Nūrayn (Possessor of Two Lights) because he married two daughters of the Prophet ﷺ: Ruqayyah and Umm Kulthūm.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What title was \'Uthmān رضي الله عنه given?',
        options: JSON.stringify(['Al-Amīn', 'Dhun Nūrayn', 'Aṣ-Ṣiddīq', 'Al-Fārūq']),
        correctAnswer: 'Dhun Nūrayn',
        explanation: '\'Uthmān was called Dhun Nūrayn (Possessor of Two Lights) because he married two daughters of the Prophet ﷺ: Ruqayyah and Umm Kulthūm.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-sirah-q2' },
      create: {
        externalId: 'maktab-8-sirah-q2',
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'Anas رضي الله عنه said the Prophet ﷺ never once said \'uff\' to him in ten years of service.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Anas served the Prophet ﷺ for ten years and testified that the Prophet never once expressed displeasure or said "uff" to him.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Anas رضي الله عنه said the Prophet ﷺ never once said \'uff\' to him in ten years of service.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Anas served the Prophet ﷺ for ten years and testified that the Prophet never once expressed displeasure or said "uff" to him.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-sirah-q3' },
      create: {
        externalId: 'maktab-8-sirah-q3',
        unitId: unitSirah.id,
        type: 'FILL_BLANK',
        questionText: '\'Uthmān bought the well of Bi\'r Rūmah for _____ dirhams.',
        options: undefined,
        correctAnswer: '20,000',
        explanation: '\'Uthmān رضي الله عنه purchased the well of Bi\'r Rūmah for 20,000 dirhams and donated it for the Muslims\' free use.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: '\'Uthmān bought the well of Bi\'r Rūmah for _____ dirhams.',
        options: undefined,
        correctAnswer: '20,000',
        explanation: '\'Uthmān رضي الله عنه purchased the well of Bi\'r Rūmah for 20,000 dirhams and donated it for the Muslims\' free use.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-sirah-q4' },
      create: {
        externalId: 'maktab-8-sirah-q4',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: '\'Alī رضي الله عنه was martyred during which prayer?',
        options: JSON.stringify(['Fajr', 'Ḍhuhr', 'Maghrib', '\'Ishā\'']),
        correctAnswer: 'Fajr',
        explanation: '\'Alī رضي الله عنه was struck by a Khārijī named Ibn Muljam while leading the Fajr prayer in 40 AH.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: '\'Alī رضي الله عنه was martyred during which prayer?',
        options: JSON.stringify(['Fajr', 'Ḍhuhr', 'Maghrib', '\'Ishā\'']),
        correctAnswer: 'Fajr',
        explanation: '\'Alī رضي الله عنه was struck by a Khārijī named Ibn Muljam while leading the Fajr prayer in 40 AH.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-sirah-q5' },
      create: {
        externalId: 'maktab-8-sirah-q5',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who slept in the Prophet\'s bed on the night of hijrah?',
        options: JSON.stringify(['Abū Bakr', '\'Umar', '\'Uthmān', '\'Alī']),
        correctAnswer: '\'Alī',
        explanation: '\'Alī رضي الله عنه bravely slept in the Prophet\'s bed on the night the Quraysh planned to assassinate the Prophet ﷺ, allowing the Prophet to escape safely to Madīnah.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Who slept in the Prophet\'s bed on the night of hijrah?',
        options: JSON.stringify(['Abū Bakr', '\'Umar', '\'Uthmān', '\'Alī']),
        correctAnswer: '\'Alī',
        explanation: '\'Alī رضي الله عنه bravely slept in the Prophet\'s bed on the night the Quraysh planned to assassinate the Prophet ﷺ, allowing the Prophet to escape safely to Madīnah.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-sirah-q6' },
      create: {
        externalId: 'maktab-8-sirah-q6',
        unitId: unitSirah.id,
        type: 'FILL_BLANK',
        questionText: 'The Prophet ﷺ left neither money nor anything except his white riding mule, his arms, and a piece of _____ which he left to charity.',
        options: undefined,
        correctAnswer: 'land',
        explanation: 'The Prophet ﷺ lived such a simple life that he left behind only his white riding mule, his arms, and a piece of land which he left to charity.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'The Prophet ﷺ left neither money nor anything except his white riding mule, his arms, and a piece of _____ which he left to charity.',
        options: undefined,
        correctAnswer: 'land',
        explanation: 'The Prophet ﷺ lived such a simple life that he left behind only his white riding mule, his arms, and a piece of land which he left to charity.',
        difficulty: 'MEDIUM',
      },
    })
  ]);

  // --- Tārīkh Quizzes ---

    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-8-tarikh-q1' },
      create: {
        externalId: 'maktab-8-tarikh-q1',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How long was Ayyūb عليه السلام tested with illness?',
        options: JSON.stringify(['Three years', 'Seven years', 'Forty years', 'Eighty years']),
        correctAnswer: 'Seven years',
        explanation: 'Ayyūb عليه السلام was tested with a severe illness for seven years, yet he never complained to anyone other than Allāh.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'How long was Ayyūb عليه السلام tested with illness?',
        options: JSON.stringify(['Three years', 'Seven years', 'Forty years', 'Eighty years']),
        correctAnswer: 'Seven years',
        explanation: 'Ayyūb عليه السلام was tested with a severe illness for seven years, yet he never complained to anyone other than Allāh.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-tarikh-q2' },
      create: {
        externalId: 'maktab-8-tarikh-q2',
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: 'Ṭāriq ibn Ziyād conquered Spain in 711 AD.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'In 711 AD, Ṭāriq ibn Ziyād crossed the strait (Gibraltar) with a Muslim army and conquered most of the Iberian Peninsula.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Ṭāriq ibn Ziyād conquered Spain in 711 AD.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'In 711 AD, Ṭāriq ibn Ziyād crossed the strait (Gibraltar) with a Muslim army and conquered most of the Iberian Peninsula.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-tarikh-q3' },
      create: {
        externalId: 'maktab-8-tarikh-q3',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who conquered Constantinople in 1453 AD?',
        options: JSON.stringify(['Ṣalāḥuddīn', 'Meḥmet II', 'Nūruddīn', '\'Abdur Raḥmān']),
        correctAnswer: 'Meḥmet II',
        explanation: 'Sultan Meḥmet II conquered Constantinople in 1453 AD, fulfilling the prophecy of the Prophet ﷺ about the conquest of that great city.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'Who conquered Constantinople in 1453 AD?',
        options: JSON.stringify(['Ṣalāḥuddīn', 'Meḥmet II', 'Nūruddīn', '\'Abdur Raḥmān']),
        correctAnswer: 'Meḥmet II',
        explanation: 'Sultan Meḥmet II conquered Constantinople in 1453 AD, fulfilling the prophecy of the Prophet ﷺ about the conquest of that great city.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-tarikh-q4' },
      create: {
        externalId: 'maktab-8-tarikh-q4',
        unitId: unitTarikh.id,
        type: 'FILL_BLANK',
        questionText: 'The greatest lesson from Islamic Spain is the danger of _____ and disunity.',
        options: undefined,
        correctAnswer: 'division',
        explanation: 'Internal divisions among Muslim rulers (ta\'ifas) led to the eventual loss of all Muslim lands in Spain.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The greatest lesson from Islamic Spain is the danger of _____ and disunity.',
        options: undefined,
        correctAnswer: 'division',
        explanation: 'Internal divisions among Muslim rulers (ta\'ifas) led to the eventual loss of all Muslim lands in Spain.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-tarikh-q5' },
      create: {
        externalId: 'maktab-8-tarikh-q5',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Ṣalāḥuddīn conquered Jerusalem in which year?',
        options: JSON.stringify(['1099 AD', '1187 AD', '1453 AD', '1492 AD']),
        correctAnswer: '1187 AD',
        explanation: 'After his decisive victory at the Battle of Ḥiṭṭīn, Ṣalāḥuddīn peacefully conquered Jerusalem in 1187 AD.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'Ṣalāḥuddīn conquered Jerusalem in which year?',
        options: JSON.stringify(['1099 AD', '1187 AD', '1453 AD', '1492 AD']),
        correctAnswer: '1187 AD',
        explanation: 'After his decisive victory at the Battle of Ḥiṭṭīn, Ṣalāḥuddīn peacefully conquered Jerusalem in 1187 AD.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-tarikh-q6' },
      create: {
        externalId: 'maktab-8-tarikh-q6',
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: 'Ṣalāḥuddīn killed all the Christians when he entered Jerusalem.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Ṣalāḥuddīn allowed the Christians to leave Jerusalem with their belongings — a stark contrast to the Crusaders\' massacre of 1099.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Ṣalāḥuddīn killed all the Christians when he entered Jerusalem.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Ṣalāḥuddīn allowed the Christians to leave Jerusalem with their belongings — a stark contrast to the Crusaders\' massacre of 1099.',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Aqā'id Quizzes ---

    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-8-aqaid-q1' },
      create: {
        externalId: 'maktab-8-aqaid-q1',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the mutashābihāt?',
        options: JSON.stringify(['Clear verses about ḥalāl and ḥarām', 'Verses whose apparent meaning is unclear', 'Verses about Jannah', 'Verses about the prophets']),
        correctAnswer: 'Verses whose apparent meaning is unclear',
        explanation: 'Mutashābihāt are verses whose apparent meaning might suggest a resemblance to creation when describing Allāh. Scholars use tafwīḍ or ta\'wīl to understand them.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'What are the mutashābihāt?',
        options: JSON.stringify(['Clear verses about ḥalāl and ḥarām', 'Verses whose apparent meaning is unclear', 'Verses about Jannah', 'Verses about the prophets']),
        correctAnswer: 'Verses whose apparent meaning is unclear',
        explanation: 'Mutashābihāt are verses whose apparent meaning might suggest a resemblance to creation when describing Allāh. Scholars use tafwīḍ or ta\'wīl to understand them.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-aqaid-q2' },
      create: {
        externalId: 'maktab-8-aqaid-q2',
        unitId: unitAqaid.id,
        type: 'FILL_BLANK',
        questionText: 'Tafwīḍ means to believe in the text and hand over its meaning to _____.',
        options: undefined,
        correctAnswer: 'Allāh',
        explanation: 'Tafwīḍ is to affirm the words of the text while handing over its true intended meaning to Allāh, without attempting to define it precisely.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Tafwīḍ means to believe in the text and hand over its meaning to _____.',
        options: undefined,
        correctAnswer: 'Allāh',
        explanation: 'Tafwīḍ is to affirm the words of the text while handing over its true intended meaning to Allāh, without attempting to define it precisely.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-aqaid-q3' },
      create: {
        externalId: 'maktab-8-aqaid-q3',
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'Allāh physically sits on His Throne like a created being.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Allāh\'s istiwā\' is in a manner that befits His majesty. "There is nothing like unto Him" (Qur\'ān 42:11). Attributing physical form to Allāh is not permissible.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Allāh physically sits on His Throne like a created being.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Allāh\'s istiwā\' is in a manner that befits His majesty. "There is nothing like unto Him" (Qur\'ān 42:11). Attributing physical form to Allāh is not permissible.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-aqaid-q4' },
      create: {
        externalId: 'maktab-8-aqaid-q4',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does isnād mean?',
        options: JSON.stringify(['Prayer', 'Chain of narration', 'Pilgrimage', 'Fasting']),
        correctAnswer: 'Chain of narration',
        explanation: 'Isnād is the unbroken chain of transmission from a scholar back to the Prophet ﷺ, ensuring the authenticity of Islamic knowledge.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does isnād mean?',
        options: JSON.stringify(['Prayer', 'Chain of narration', 'Pilgrimage', 'Fasting']),
        correctAnswer: 'Chain of narration',
        explanation: 'Isnād is the unbroken chain of transmission from a scholar back to the Prophet ﷺ, ensuring the authenticity of Islamic knowledge.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-aqaid-q5' },
      create: {
        externalId: 'maktab-8-aqaid-q5',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The \'ulamā\' are described by the Prophet ﷺ as:',
        options: JSON.stringify(['The leaders of governments', 'The inheritors of the prophets', 'The wealthiest people', 'The strongest warriors']),
        correctAnswer: 'The inheritors of the prophets',
        explanation: 'The Prophet ﷺ said: "The \'ulamā\' are the inheritors of the prophets." They preserve and transmit Islamic knowledge.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The \'ulamā\' are described by the Prophet ﷺ as:',
        options: JSON.stringify(['The leaders of governments', 'The inheritors of the prophets', 'The wealthiest people', 'The strongest warriors']),
        correctAnswer: 'The inheritors of the prophets',
        explanation: 'The Prophet ﷺ said: "The \'ulamā\' are the inheritors of the prophets." They preserve and transmit Islamic knowledge.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-aqaid-q6' },
      create: {
        externalId: 'maktab-8-aqaid-q6',
        unitId: unitAqaid.id,
        type: 'FILL_BLANK',
        questionText: '"There is nothing like unto Him, and He is the _____, the Seeing." (Qur\'ān 42:11)',
        options: undefined,
        correctAnswer: 'Hearing',
        explanation: 'This verse establishes that Allāh does not resemble His creation in any way while affirming He is the All-Hearing (al-Samī\') and All-Seeing (al-Baṣīr).',
        difficulty: 'EASY',
      },
      update: {
        questionText: '"There is nothing like unto Him, and He is the _____, the Seeing." (Qur\'ān 42:11)',
        options: undefined,
        correctAnswer: 'Hearing',
        explanation: 'This verse establishes that Allāh does not resemble His creation in any way while affirming He is the All-Hearing (al-Samī\') and All-Seeing (al-Baṣīr).',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Akhlāq Quizzes ---

    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-8-akhlaq-q1' },
      create: {
        externalId: 'maktab-8-akhlaq-q1',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does taqwā mean?',
        options: JSON.stringify(['To give charity', 'To abstain for the fear of Allāh', 'To fast every day', 'To memorise the Qur\'ān']),
        correctAnswer: 'To abstain for the fear of Allāh',
        explanation: 'Taqwā means to abstain from sin for the fear of Allāh — to be conscious of Allāh in all matters, in public and in private.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does taqwā mean?',
        options: JSON.stringify(['To give charity', 'To abstain for the fear of Allāh', 'To fast every day', 'To memorise the Qur\'ān']),
        correctAnswer: 'To abstain for the fear of Allāh',
        explanation: 'Taqwā means to abstain from sin for the fear of Allāh — to be conscious of Allāh in all matters, in public and in private.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-akhlaq-q2' },
      create: {
        externalId: 'maktab-8-akhlaq-q2',
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: '"Whoever fears Allāh, He brings forth a _____ for him." (Qur\'ān 65:2-3)',
        options: undefined,
        correctAnswer: 'way out',
        explanation: 'Allāh promises that whoever has taqwā, He will create a way out for him from every difficulty and provide for him from sources he could never imagine.',
        difficulty: 'EASY',
      },
      update: {
        questionText: '"Whoever fears Allāh, He brings forth a _____ for him." (Qur\'ān 65:2-3)',
        options: undefined,
        correctAnswer: 'way out',
        explanation: 'Allāh promises that whoever has taqwā, He will create a way out for him from every difficulty and provide for him from sources he could never imagine.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-akhlaq-q3' },
      create: {
        externalId: 'maktab-8-akhlaq-q3',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ say about trusting Allāh for provision?',
        options: JSON.stringify(['He would make you wealthy immediately', 'He would provide like He provides the birds', 'He would remove all hardship', 'He would give you a house in Jannah']),
        correctAnswer: 'He would provide like He provides the birds',
        explanation: 'The Prophet ﷺ said: "If you were to rely upon Allāh with true reliance, He would provide for you as He provides the birds — they go out in the morning hungry and return in the evening full."',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What did the Prophet ﷺ say about trusting Allāh for provision?',
        options: JSON.stringify(['He would make you wealthy immediately', 'He would provide like He provides the birds', 'He would remove all hardship', 'He would give you a house in Jannah']),
        correctAnswer: 'He would provide like He provides the birds',
        explanation: 'The Prophet ﷺ said: "If you were to rely upon Allāh with true reliance, He would provide for you as He provides the birds — they go out in the morning hungry and return in the evening full."',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-akhlaq-q4' },
      create: {
        externalId: 'maktab-8-akhlaq-q4',
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'Tawbah (repentance) has only one condition: saying sorry.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Tawbah has three conditions: genuine regret (nadam), abandoning the sin immediately, and making a firm resolve never to commit the sin again.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'Tawbah (repentance) has only one condition: saying sorry.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Tawbah has three conditions: genuine regret (nadam), abandoning the sin immediately, and making a firm resolve never to commit the sin again.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-akhlaq-q5' },
      create: {
        externalId: 'maktab-8-akhlaq-q5',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three conditions of tawbah?',
        options: JSON.stringify(['Fasting, prayer, charity', 'Regret, abandoning the sin, promising not to return', 'Reading Qur\'ān, making du\'ā\', giving ṣadaqah', 'Saying sorry, paying money, doing good deeds']),
        correctAnswer: 'Regret, abandoning the sin, promising not to return',
        explanation: 'The three conditions of tawbah are: feeling genuine regret, immediately stopping the sinful action, and resolving never to repeat it.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'What are the three conditions of tawbah?',
        options: JSON.stringify(['Fasting, prayer, charity', 'Regret, abandoning the sin, promising not to return', 'Reading Qur\'ān, making du\'ā\', giving ṣadaqah', 'Saying sorry, paying money, doing good deeds']),
        correctAnswer: 'Regret, abandoning the sin, promising not to return',
        explanation: 'The three conditions of tawbah are: feeling genuine regret, immediately stopping the sinful action, and resolving never to repeat it.',
        difficulty: 'MEDIUM',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-akhlaq-q6' },
      create: {
        externalId: 'maktab-8-akhlaq-q6',
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: '"Īmān consists of more than sixty branches. And ḥayā\' (modesty) is a part of _____."',
        options: undefined,
        correctAnswer: 'faith',
        explanation: 'The Prophet ﷺ described ḥayā\' (modesty) as a branch of faith (īmān), highlighting its central importance in a Muslim\'s character.',
        difficulty: 'EASY',
      },
      update: {
        questionText: '"Īmān consists of more than sixty branches. And ḥayā\' (modesty) is a part of _____."',
        options: undefined,
        correctAnswer: 'faith',
        explanation: 'The Prophet ﷺ described ḥayā\' (modesty) as a branch of faith (īmān), highlighting its central importance in a Muslim\'s character.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-akhlaq-q7' },
      create: {
        externalId: 'maktab-8-akhlaq-q7',
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'Imām Ghazālī compared worldly life to a man trapped in a well with a lion above and a serpent below.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Imām Ghazālī used this parable to illustrate how people become distracted by the fleeting pleasures of this world (the honey) while forgetting death and the Hereafter.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'Imām Ghazālī compared worldly life to a man trapped in a well with a lion above and a serpent below.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Imām Ghazālī used this parable to illustrate how people become distracted by the fleeting pleasures of this world (the honey) while forgetting death and the Hereafter.',
        difficulty: 'MEDIUM',
      },
    })
  ]);

  // --- Ādāb Quizzes ---

    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-8-adab-q1' },
      create: {
        externalId: 'maktab-8-adab-q1',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What should be the intention of a debate?',
        options: JSON.stringify(['To win', 'To reach the correct conclusion', 'To embarrass the opponent', 'To show how clever you are']),
        correctAnswer: 'To reach the correct conclusion',
        explanation: 'In Islām, the intention of a debate or discussion should always be to reach the correct conclusion, not to win, show off, or embarrass the other person.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What should be the intention of a debate?',
        options: JSON.stringify(['To win', 'To reach the correct conclusion', 'To embarrass the opponent', 'To show how clever you are']),
        correctAnswer: 'To reach the correct conclusion',
        explanation: 'In Islām, the intention of a debate or discussion should always be to reach the correct conclusion, not to win, show off, or embarrass the other person.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-adab-q2' },
      create: {
        externalId: 'maktab-8-adab-q2',
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'It is permissible for a fiancé and fiancée to text each other before nikāḥ.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Before the nikāḥ, the couple are still non-maḥram. It is not permissible for them to text, call, or meet privately. All interactions should be through families.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'It is permissible for a fiancé and fiancée to text each other before nikāḥ.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Before the nikāḥ, the couple are still non-maḥram. It is not permissible for them to text, call, or meet privately. All interactions should be through families.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-adab-q3' },
      create: {
        externalId: 'maktab-8-adab-q3',
        unitId: unitAdab.id,
        type: 'FILL_BLANK',
        questionText: 'A businessperson should make sure he has _____ clearly marked on items for sale.',
        options: undefined,
        correctAnswer: 'prices',
        explanation: 'Having prices clearly marked on items for sale is part of Islamic business etiquette, ensuring transparency and avoiding ambiguity.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'A businessperson should make sure he has _____ clearly marked on items for sale.',
        options: undefined,
        correctAnswer: 'prices',
        explanation: 'Having prices clearly marked on items for sale is part of Islamic business etiquette, ensuring transparency and avoiding ambiguity.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-adab-q4' },
      create: {
        externalId: 'maktab-8-adab-q4',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What should a seller do if an item has a fault?',
        options: JSON.stringify(['Hide the fault', 'Inform the buyer before selling', 'Increase the price', 'Refuse to sell it']),
        correctAnswer: 'Inform the buyer before selling',
        explanation: 'Islamic etiquette requires the seller to be honest and transparent, informing the buyer of any defects before completing the sale.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What should a seller do if an item has a fault?',
        options: JSON.stringify(['Hide the fault', 'Inform the buyer before selling', 'Increase the price', 'Refuse to sell it']),
        correctAnswer: 'Inform the buyer before selling',
        explanation: 'Islamic etiquette requires the seller to be honest and transparent, informing the buyer of any defects before completing the sale.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-8-adab-q5' },
      create: {
        externalId: 'maktab-8-adab-q5',
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'A buyer may lie when returning an item for a refund.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Lying is ḥarām in all situations, including when returning items. A Muslim must be truthful in all dealings.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'A buyer may lie when returning an item for a refund.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Lying is ḥarām in all situations, including when returning items. A Muslim must be truthful in all dealings.',
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

  // --- Fiqh Flashcards (10) ---

  const fiqhFlashcards = [
    { front: 'Ishrāq', back: 'A nafl ṣalāh performed fifteen minutes after sunrise. The Prophet ﷺ said it carries a reward similar to performing Ḥajj and \'Umrah.', frontArabic: 'إِشْرَاق', backArabic: null, category: 'concept', tags: ['fiqh', 'nawāfil', 'ishrāq'], difficulty: 'EASY' as const },
    { front: 'Ḍuḥā', back: 'Nafl ṣalāh performed in the second half of the morning, towards midday. Minimum 2 rak\'āt, maximum 12.', frontArabic: 'ضُحَى', backArabic: null, category: 'concept', tags: ['fiqh', 'nawāfil', 'ḍuḥā'], difficulty: 'EASY' as const },
    { front: 'Tahajjud', back: 'Night prayer performed after waking from sleep — the most rewarding nafl ṣalāh. A trait of the pious predecessors.', frontArabic: 'تَهَجُّد', backArabic: null, category: 'concept', tags: ['fiqh', 'nawāfil', 'tahajjud'], difficulty: 'EASY' as const },
    { front: 'Khushū\'', back: 'Humility and devotion in ṣalāh — concentrating fully and praying at a measured pace. A quality of the successful believers.', frontArabic: 'خُشُوع', backArabic: null, category: 'vocabulary', tags: ['fiqh', 'ṣalāh', 'khushū\''], difficulty: 'MEDIUM' as const },
    { front: 'Nikāḥ', back: 'Marriage in Islām. Requires offer (ījāb), acceptance (qabūl), and at least two male witnesses. The Prophet ﷺ said it completes half of one\'s faith.', frontArabic: 'نِكَاح', backArabic: null, category: 'concept', tags: ['fiqh', 'nikāḥ', 'marriage'], difficulty: 'EASY' as const },
    { front: 'Mahr', back: 'The dower given by the groom to the bride — it is wājib. The minimum is the value of 10 dirhams (30.618g of silver).', frontArabic: 'مَهْر', backArabic: null, category: 'vocabulary', tags: ['fiqh', 'nikāḥ', 'mahr'], difficulty: 'MEDIUM' as const },
    { front: 'Ṭalāq', back: 'Divorce — allowed as a last resort. Ṭalāq Raj\'ī (revocable) allows reconciliation within \'iddah. Ṭalāq Bā\'in (irrevocable) requires a new nikāḥ.', frontArabic: 'طَلَاق', backArabic: null, category: 'concept', tags: ['fiqh', 'ṭalāq', 'divorce'], difficulty: 'MEDIUM' as const },
    { front: '\'Iddah', back: 'The waiting period after divorce: three menstrual cycles, 90 days if not menstruating, or until birth if pregnant. Upon death, 4 months 10 days.', frontArabic: 'عِدَّة', backArabic: null, category: 'vocabulary', tags: ['fiqh', 'ṭalāq', '\'iddah'], difficulty: 'MEDIUM' as const },
    { front: 'Ribā', back: 'Interest — charging money for giving a loan. Ḥarām to give, take, record, or witness. Allāh destroys interest and increases charity.', frontArabic: 'رِبَا', backArabic: null, category: 'concept', tags: ['fiqh', 'transactions', 'ribā'], difficulty: 'EASY' as const },
    { front: 'Buyū\'', back: 'Trade and transactions. Conditions: the product must be ḥalāl, price must be specified, no ambiguity, and the transaction must be unconditional.', frontArabic: 'بُيُوع', backArabic: null, category: 'concept', tags: ['fiqh', 'transactions', 'buyū\''], difficulty: 'EASY' as const },
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

  // --- Aḥādīth Flashcards (8) ---

  const ahadithFlashcards = [
    { front: 'Clean Heart', back: 'The Prophet ﷺ said: "If you can spend each morning and evening with a heart free of hatred or deception, do so… whoever loves my sunnah will be with me in Jannah."', frontArabic: 'سَلِيم القَلْب', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'heart', 'sunnah'], difficulty: 'EASY' as const },
    { front: 'Ṣadaqah', back: '"Every morning two angels descend — one prays for the one who gives in charity, the other prays for the destruction of the wealth of the one who withholds."', frontArabic: 'صَدَقَة', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'ṣadaqah', 'charity'], difficulty: 'EASY' as const },
    { front: 'Salām', back: '"Whenever you enter a home, greet your family with Assalāmu \'alaykum — it will be a blessing for you and your household." (Tirmidhī)', frontArabic: 'سَلَام', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'salām', 'greeting'], difficulty: 'EASY' as const },
    { front: 'Rights of a Muslim', back: 'Seven rights: visit the sick, follow funerals, pray for one who sneezes, accept invitations, return greetings, help the wronged, help fulfil oaths.', frontArabic: 'حُقُوق المُسْلِم', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'rights', 'muslim'], difficulty: 'MEDIUM' as const },
    { front: 'True Wealth', back: '"Wealth is not in having great riches — true wealth is contentment of the soul." (Ṣaḥīḥ al-Bukhārī)', frontArabic: 'الغِنَى', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'wealth', 'contentment'], difficulty: 'EASY' as const },
    { front: 'Sweetness of Īmān', back: 'Three qualities: loving Allāh and His Messenger above all else, loving someone for Allāh\'s sake alone, and hating to return to unbelief.', frontArabic: 'حَلَاوَة الإِيمَان', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'īmān', 'sweetness'], difficulty: 'MEDIUM' as const },
    { front: 'Closeness to Allāh (Ḥadīth Qudsī)', back: '"I am as My servant thinks I am. If he comes one span nearer, I go one arm nearer. If he comes walking, I go running." (Ṣaḥīḥ al-Bukhārī)', frontArabic: 'القُرْب مِن الله', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'closeness', 'qudsī'], difficulty: 'MEDIUM' as const },
    { front: 'Self-Sufficiency', back: '"No one eats better food than what he earns with his own hands. Dāwūd عليه السلام used to eat from the work of his own hands." (Ṣaḥīḥ al-Bukhārī)', frontArabic: 'الاِكْتِفَاء الذَّاتِي', backArabic: null, category: 'ḥadīth', tags: ['aḥādīth', 'work', 'self-sufficiency'], difficulty: 'EASY' as const },
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

  // --- Sīrah Flashcards (8) ---

  const sirahFlashcards = [
    { front: 'Shamā\'il', back: 'The noble character traits of Rasūlullāh ﷺ — his gentleness, humility, bravery, tolerance, consideration, and simple lifestyle.', frontArabic: 'شَمَائِل', backArabic: null, category: 'concept', tags: ['sīrah', 'shamā\'il', 'character'], difficulty: 'EASY' as const },
    { front: 'Dhun Nūrayn', back: '\'Uthmān رضي الله عنه was called "Possessor of Two Lights" because he married two daughters of the Prophet ﷺ: Ruqayyah and Umm Kulthūm.', frontArabic: 'ذُو النُّورَيْن', backArabic: null, category: 'biography', tags: ['sīrah', '\'uthmān', 'title'], difficulty: 'EASY' as const },
    { front: 'Al-\'Asharah al-Mubasharah', back: 'The ten Companions promised Paradise during their lifetime. Both \'Uthmān and \'Alī رضي الله عنهما were among them.', frontArabic: 'العَشَرَة المُبَشَّرَة', backArabic: null, category: 'concept', tags: ['sīrah', 'companions', 'jannah'], difficulty: 'MEDIUM' as const },
    { front: 'Bi\'r Rūmah', back: '\'Uthmān رضي الله عنه bought this well for 20,000 dirhams and donated it for the Muslims\' free use.', frontArabic: 'بِئْر رُومَة', backArabic: null, category: 'event', tags: ['sīrah', '\'uthmān', 'sacrifice'], difficulty: 'MEDIUM' as const },
    { front: '\'Alī\'s Acceptance of Islām', back: '\'Alī رضي الله عنه accepted Islām as a youth — one of the first to believe. The Prophet ﷺ raised him in his own household.', frontArabic: 'إِسْلَام عَلِي', backArabic: null, category: 'event', tags: ['sīrah', '\'alī', 'conversion'], difficulty: 'EASY' as const },
    { front: 'Battle of Ṣiffīn', back: 'A conflict between \'Alī and Mu\'āwiyah رضي الله عنهما during \'Alī\'s khilāfah. It ended in arbitration and led to the emergence of the Khawārij.', frontArabic: 'مَعْرَكَة صِفِّين', backArabic: null, category: 'event', tags: ['sīrah', '\'alī', 'ṣiffīn'], difficulty: 'MEDIUM' as const },
    { front: 'Khawārij', back: 'A group of extremists who emerged after the Battle of Ṣiffīn. They declared Muslims who disagreed with them to be disbelievers. A Khārijī assassinated \'Alī رضي الله عنه.', frontArabic: 'خَوَارِج', backArabic: null, category: 'concept', tags: ['sīrah', 'khawārij', 'extremism'], difficulty: 'MEDIUM' as const },
    { front: '\'Alī\'s Justice', back: '\'Alī lost his shield and found it with a Jewish man. The judge ruled against \'Alī due to insufficient evidence. \'Alī accepted, and the Jewish man was so impressed he accepted Islām.', frontArabic: 'عَدْل عَلِي', backArabic: null, category: 'event', tags: ['sīrah', '\'alī', 'justice'], difficulty: 'EASY' as const },
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

  // --- Tārīkh Flashcards (8) ---

  const tarikhFlashcards = [
    { front: 'Ayyūb عليه السلام', back: 'A prophet tested with illness for seven years. He lost his wealth, children, and health but never complained to anyone other than Allāh. Allāh restored everything and more.', frontArabic: 'أَيُّوب عَلَيْهِ السَّلَام', backArabic: null, category: 'biography', tags: ['tārīkh', 'ayyūb', 'patience'], difficulty: 'EASY' as const },
    { front: 'Ṭāriq ibn Ziyād', back: 'The Muslim general who conquered Spain in 711 AD. The strait he crossed was named Jabal Ṭāriq (Gibraltar) after him.', frontArabic: 'طَارِق بْن زِيَاد', backArabic: null, category: 'biography', tags: ['tārīkh', 'andalus', 'conquest'], difficulty: 'EASY' as const },
    { front: 'Córdoba', back: 'The capital of Muslim Spain. Had over 600 libraries and its great mosque was a wonder of architecture. A beacon of learning and tolerance.', frontArabic: 'قُرْطُبَة', backArabic: null, category: 'place', tags: ['tārīkh', 'andalus', 'córdoba'], difficulty: 'EASY' as const },
    { front: 'Ṣalāḥuddīn al-Ayyūbī', back: 'Conquered Jerusalem peacefully in 1187 AD after defeating the Crusaders at the Battle of Ḥiṭṭīn. He allowed Christians to leave with their belongings.', frontArabic: 'صَلَاح الدِّين الأَيُّوبِي', backArabic: null, category: 'biography', tags: ['tārīkh', 'crusades', 'ṣalāḥuddīn'], difficulty: 'EASY' as const },
    { front: 'Nūruddīn Zankī', back: 'A pious ruler who united Muslim lands of Syria and Egypt. His year of unification was 1155 AD. He prepared the ground for the reconquest of Jerusalem.', frontArabic: 'نُورُ الدِّين زَنْكِي', backArabic: null, category: 'biography', tags: ['tārīkh', 'crusades', 'nūruddīn'], difficulty: 'MEDIUM' as const },
    { front: 'Sultan Meḥmet II', back: 'Conquered Constantinople in 1453 AD, fulfilling the prophecy of the Prophet ﷺ. Renamed it Islāmbol and marked the end of the Byzantine Empire.', frontArabic: 'مُحَمَّد الفَاتِح', backArabic: null, category: 'biography', tags: ['tārīkh', 'ottomans', 'constantinople'], difficulty: 'MEDIUM' as const },
    { front: 'Battle of Ḥiṭṭīn', back: 'The decisive battle in 1187 AD where Ṣalāḥuddīn defeated the Crusader forces, leading to the reconquest of Jerusalem.', frontArabic: 'مَعْرَكَة حِطِّين', backArabic: null, category: 'event', tags: ['tārīkh', 'crusades', 'ḥiṭṭīn'], difficulty: 'MEDIUM' as const },
    { front: 'Lessons from History', back: 'The greatest lesson from Islamic Spain and history is the danger of division and disunity. When Muslims divided into warring factions, they lost everything.', frontArabic: null, backArabic: null, category: 'concept', tags: ['tārīkh', 'lessons', 'unity'], difficulty: 'EASY' as const },
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

  // --- Aqā'id Flashcards (7) ---

  const aqaidFlashcards = [
    { front: 'Mutashābihāt', back: 'Verses whose apparent meaning might suggest resemblance to creation (e.g., "Hand", "Face", "Eye" of Allāh). Scholars use tafwīḍ or ta\'wīl to understand them.', frontArabic: 'مُتَشَابِهَات', backArabic: null, category: 'vocabulary', tags: ['aqā\'id', 'mutashābihāt', 'qur\'ān'], difficulty: 'MEDIUM' as const },
    { front: 'Tafwīḍ', back: 'To believe in the text as it is and hand over its true meaning to Allāh, without attempting to define its precise meaning. The approach of many of the Salaf.', frontArabic: 'تَفْوِيض', backArabic: null, category: 'concept', tags: ['aqā\'id', 'tafwīḍ', 'methodology'], difficulty: 'MEDIUM' as const },
    { front: 'Ta\'wīl', back: 'To interpret ambiguous texts in a manner that befits Allāh\'s majesty, without attributing physical characteristics. Used by later scholars to protect from misunderstanding.', frontArabic: 'تَأْوِيل', backArabic: null, category: 'concept', tags: ['aqā\'id', 'ta\'wīl', 'methodology'], difficulty: 'MEDIUM' as const },
    { front: 'Istiwā\'', back: 'Allāh\'s rising over the Throne — in a manner befitting His majesty. Imām Mālik said: "Istiwā\' is not unknown. The how is not conceivable. Belief in it is obligatory."', frontArabic: 'اِسْتِوَاء', backArabic: null, category: 'concept', tags: ['aqā\'id', 'istiwā\'', 'throne'], difficulty: 'MEDIUM' as const },
    { front: 'Isnād', back: 'An unbroken chain of narration from a scholar back to the Prophet ﷺ. A unique feature of Islamic scholarship ensuring authenticity of knowledge.', frontArabic: 'إِسْنَاد', backArabic: null, category: 'vocabulary', tags: ['aqā\'id', 'isnād', 'knowledge'], difficulty: 'EASY' as const },
    { front: '"Nothing Like Unto Him" (42:11)', back: '"There is nothing like unto Him, and He is the Hearing, the Seeing." The fundamental verse establishing that Allāh does not resemble creation.', frontArabic: null, backArabic: 'لَيْسَ كَمِثْلِهِ شَيْءٌ وَهُوَ السَّمِيعُ البَصِير', category: 'concept', tags: ['aqā\'id', 'tawḥīd', 'qur\'ān'], difficulty: 'EASY' as const },
    { front: 'Shahādah with Full Conviction', back: 'The shahādah requires full conviction (yaqīn) in the heart — belief in tawḥīd, the prophethood of Muḥammad ﷺ, and everything he brought.', frontArabic: 'شَهَادَة', backArabic: null, category: 'concept', tags: ['aqā\'id', 'shahādah', 'yaqīn'], difficulty: 'EASY' as const },
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

  // --- Akhlāq Flashcards (7) ---

  const akhlaqFlashcards = [
    { front: 'Taqwā', back: 'God-consciousness — to abstain from sin for the fear of Allāh. Ubayy ibn Ka\'b compared it to walking carefully on a thorny path.', frontArabic: 'تَقْوَى', backArabic: null, category: 'concept', tags: ['akhlāq', 'taqwā', 'consciousness'], difficulty: 'EASY' as const },
    { front: 'Tawakkul', back: 'Reliance upon Allāh after taking all practical means. "Tie your camel, then trust in Allāh." Not laziness but trusting outcomes to Allāh.', frontArabic: 'تَوَكُّل', backArabic: null, category: 'concept', tags: ['akhlāq', 'tawakkul', 'reliance'], difficulty: 'EASY' as const },
    { front: 'Tawbah — Three Conditions', back: '1. Regret (nadam) for the sin. 2. Abandon the sin immediately. 3. Firm resolve never to return. If it involves others\' rights, a fourth condition applies.', frontArabic: 'تَوْبَة', backArabic: null, category: 'concept', tags: ['akhlāq', 'tawbah', 'repentance'], difficulty: 'MEDIUM' as const },
    { front: 'Ḥayā\' (Modesty)', back: '"Īmān consists of more than sixty branches. And ḥayā\' is a part of faith." Modesty in gaze is an essential aspect of ḥayā\'.', frontArabic: 'حَيَاء', backArabic: null, category: 'concept', tags: ['akhlāq', 'ḥayā\'', 'modesty'], difficulty: 'EASY' as const },
    { front: 'Istighfār', back: 'Seeking Allāh\'s forgiveness. The Prophet ﷺ sought forgiveness more than 70 times daily despite being sinless. It brings relief and opens doors of provision.', frontArabic: 'اِسْتِغْفَار', backArabic: null, category: 'concept', tags: ['akhlāq', 'istighfār', 'forgiveness'], difficulty: 'EASY' as const },
    { front: 'Shortness of Life (Imām Ghazālī)', back: 'A man in a well: serpent below, lion above, two mice gnawing the branch, honey on the branch. People are distracted by worldly pleasures while forgetting death.', frontArabic: null, backArabic: null, category: 'concept', tags: ['akhlāq', 'dunyā', 'parable'], difficulty: 'MEDIUM' as const },
    { front: 'Qur\'ān 65:2–3 (Way Out)', back: '"Whoever fears Allāh, He brings forth a way out for him, and provides for him from sources he could never imagine." The promise of Allāh for those with taqwā.', frontArabic: null, backArabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', category: 'concept', tags: ['akhlāq', 'taqwā', 'qur\'ān'], difficulty: 'EASY' as const },
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

  // --- Ādāb Flashcards (6) ---

  const adabFlashcards = [
    { front: 'Ādāb of Debate', back: 'Intend to reach the correct conclusion, not to win. Speak with respect, listen fully, use evidence, and accept when wrong. Avoid personal attacks.', frontArabic: 'آدَاب المُنَاظَرَة', backArabic: null, category: 'concept', tags: ['ādāb', 'debate', 'etiquette'], difficulty: 'EASY' as const },
    { front: 'Ādāb of Nikāḥ', back: 'Keep it simple, perform in a masjid if possible, announce publicly. The fiancé and fiancée remain non-maḥram until the nikāḥ is complete.', frontArabic: 'آدَاب النِّكَاح', backArabic: null, category: 'concept', tags: ['ādāb', 'nikāḥ', 'etiquette'], difficulty: 'EASY' as const },
    { front: 'Ādāb of the Seller', back: 'Be honest, mark prices clearly, do not swear oaths to sell, inform buyers of defects, be fair in weighing, and do not hoard goods.', frontArabic: 'آدَاب البَائِع', backArabic: null, category: 'concept', tags: ['ādāb', 'seller', 'transactions'], difficulty: 'EASY' as const },
    { front: 'Ādāb of the Buyer', back: 'Do not be extravagant, do not lie when returning items, pay willingly and on time, do not haggle excessively, and be generous to sellers in need.', frontArabic: 'آدَاب المُشْتَرِي', backArabic: null, category: 'concept', tags: ['ādāb', 'buyer', 'transactions'], difficulty: 'EASY' as const },
    { front: 'Walīmah', back: 'The wedding feast — a sunnah of the Prophet ﷺ. Should be simple and within one\'s means. "The worst feast is where the rich are invited and the poor left out."', frontArabic: 'وَلِيمَة', backArabic: null, category: 'vocabulary', tags: ['ādāb', 'walīmah', 'nikāḥ'], difficulty: 'EASY' as const },
    { front: '"Speak Good or Remain Silent"', back: '"Whoever believes in Allāh and the Last Day, let him speak good or remain silent." Applies to all dealings — speech, business, and social life.', frontArabic: null, backArabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', category: 'ḥadīth', tags: ['ādāb', 'speech', 'silence'], difficulty: 'EASY' as const },
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

  console.log('✅ Created flashcards for all 7 units');

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
      // Fiqh terms (10)
      { unitId: unitFiqh.id, arabicText: 'إِشْرَاق', transliteration: 'Ishrāq', translation: 'Nafl ṣalāh performed after sunrise' },
      { unitId: unitFiqh.id, arabicText: 'ضُحَى', transliteration: 'Ḍuḥā', translation: 'Nafl ṣalāh in the second half of the morning' },
      { unitId: unitFiqh.id, arabicText: 'تَهَجُّد', transliteration: 'Tahajjud', translation: 'Night prayer after waking from sleep' },
      { unitId: unitFiqh.id, arabicText: 'خُشُوع', transliteration: 'Khushū\'', translation: 'Humility and devotion in ṣalāh' },
      { unitId: unitFiqh.id, arabicText: 'نِكَاح', transliteration: 'Nikāḥ', translation: 'Marriage in Islām' },
      { unitId: unitFiqh.id, arabicText: 'مَهْر', transliteration: 'Mahr', translation: 'Dower given by the groom to the bride' },
      { unitId: unitFiqh.id, arabicText: 'طَلَاق', transliteration: 'Ṭalāq', translation: 'Divorce' },
      { unitId: unitFiqh.id, arabicText: 'عِدَّة', transliteration: '\'Iddah', translation: 'Waiting period after divorce' },
      { unitId: unitFiqh.id, arabicText: 'رِبَا', transliteration: 'Ribā', translation: 'Interest — ḥarām in Islām' },
      { unitId: unitFiqh.id, arabicText: 'بُيُوع', transliteration: 'Buyū\'', translation: 'Trade and transactions' },
      // Aḥādīth terms (5)
      { unitId: unitAhadith.id, arabicText: 'صَدَقَة', transliteration: 'Ṣadaqah', translation: 'Voluntary charity' },
      { unitId: unitAhadith.id, arabicText: 'سَلَام', transliteration: 'Salām', translation: 'Greeting of peace' },
      { unitId: unitAhadith.id, arabicText: 'صَبْر', transliteration: 'Ṣabr', translation: 'Patience in trials and obedience' },
      { unitId: unitAhadith.id, arabicText: 'تَوَكُّل', transliteration: 'Tawakkul', translation: 'Reliance upon Allāh' },
      { unitId: unitAhadith.id, arabicText: 'إِيمَان', transliteration: 'Īmān', translation: 'Faith — belief in Allāh and His Messenger' },
      // Sīrah terms (4)
      { unitId: unitSirah.id, arabicText: 'شَمَائِل', transliteration: 'Shamā\'il', translation: 'The noble character traits of Rasūlullāh ﷺ' },
      { unitId: unitSirah.id, arabicText: 'ذُو النُّورَيْن', transliteration: 'Dhun Nūrayn', translation: 'Possessor of Two Lights — title of \'Uthmān رضي الله عنه' },
      { unitId: unitSirah.id, arabicText: 'خُلَفَاء الرَّاشِدُون', transliteration: 'Khulafā\' ar-Rāshidūn', translation: 'The Rightly Guided Caliphs' },
      { unitId: unitSirah.id, arabicText: 'خَوَارِج', transliteration: 'Khawārij', translation: 'A sect of extremists who emerged after Ṣiffīn' },
      // Tārīkh terms (2)
      { unitId: unitTarikh.id, arabicText: 'أَنْدَلُس', transliteration: 'Andalus', translation: 'Muslim Spain (711–1492 AD)' },
      { unitId: unitTarikh.id, arabicText: 'صَلَاح الدِّين', transliteration: 'Ṣalāḥuddīn', translation: 'The great Muslim leader who conquered Jerusalem in 1187 AD' },
      // Aqā'id terms (4)
      { unitId: unitAqaid.id, arabicText: 'مُتَشَابِهَات', transliteration: 'Mutashābihāt', translation: 'Ambiguous verses whose apparent meaning is unclear' },
      { unitId: unitAqaid.id, arabicText: 'تَفْوِيض', transliteration: 'Tafwīḍ', translation: 'Handing over the meaning of ambiguous texts to Allāh' },
      { unitId: unitAqaid.id, arabicText: 'تَأْوِيل', transliteration: 'Ta\'wīl', translation: 'Interpreting texts in a manner befitting Allāh\'s majesty' },
      { unitId: unitAqaid.id, arabicText: 'إِسْنَاد', transliteration: 'Isnād', translation: 'Chain of narration — ensuring authenticity of knowledge' },
      // Akhlāq terms (3)
      { unitId: unitAkhlaq.id, arabicText: 'تَقْوَى', transliteration: 'Taqwā', translation: 'God-consciousness — abstaining from sin for fear of Allāh' },
      { unitId: unitAkhlaq.id, arabicText: 'تَوْبَة', transliteration: 'Tawbah', translation: 'Repentance — returning to Allāh after sinning' },
      { unitId: unitAkhlaq.id, arabicText: 'حَيَاء', transliteration: 'Ḥayā\'', translation: 'Modesty — a branch of faith' },
      // Ādāb terms (1)
      { unitId: unitAdab.id, arabicText: 'وَلِيمَة', transliteration: 'Walīmah', translation: 'Wedding feast — a sunnah of the Prophet ﷺ' },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 Maktab Coursebook 8 seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: An Nasihah Coursebook 8 (ages 13-14)');
  console.log('   - 7 Units: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā\'id, Akhlāq, Ādāb');
  console.log(`   - ${8 + 7 + 6 + 6 + 6 + 7 + 5} Quiz questions (45 total)`);
  console.log(`   - ${flashcardIndex} Flashcards`);
  console.log(`   - 29 Arabic terms`);
}

// Allow standalone execution
async function main() {
  try {
    await seedMaktabCoursebook8();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Maktab Coursebook 8:', error);
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
