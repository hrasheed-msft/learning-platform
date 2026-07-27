import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedMaktabCoursebook6Boys() {
  const course = await prisma.course.upsert({
    where: { slug: 'maktab-coursebook-6-boys' },
    create: {
      slug: 'maktab-coursebook-6-boys',
      title: 'Maktab Coursebook 6 (Boys)',
      description: 'Maktab Coursebook 6 for boys aged 11-12, covering Fiqh, Ahadith, Sirah, Tarikh, Aqaid, Akhlaq and Adab.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 6 (Boys)',
      description: 'Maktab Coursebook 6 for boys aged 11-12, covering Fiqh, Ahadith, Sirah, Tarikh, Aqaid, Akhlaq and Adab.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
  });
  const courseId = course.id;

  const oldSlugs = ['maktab-6b-fiqh','maktab-6b-ahadith','maktab-6b-sirah','maktab-6b-tarikh','maktab-6b-aqaid','maktab-6b-akhlaq','maktab-6b-adab'];
  for (const slug of oldSlugs) {
    const old = await prisma.unit.findFirst({ where: { courseId: course.id, slug } });
    if (old) {
      await prisma.question.deleteMany({ where: { unitId: old.id } });
      await prisma.unitProgress.deleteMany({ where: { unitId: old.id } });
      await prisma.unit.delete({ where: { id: old.id } });
    }
  }

  // ── UNIT CONTENT ─────────────────────────────────────────────────
  const content1 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Classify the three categories of water in Islamic law</li>
  <li>Distinguish between ghalīẓah and khafīfah impurities</li>
  <li>Apply purification rules correctly</li>
</ul>
<h3>Categories of Water</h3>
<p>Islamic law divides water into three categories:</p>
<ol>
  <li><strong>Ṭāhir Muṭahhir (Pure and Purifying):</strong> Natural water such as rain, river, well or sea water. This is the only water valid for wuḍūʾ and ghusl.</li>
  <li><strong>Ṭāhir (Pure but Non-Purifying):</strong> Pure to use (drink, cook) but cannot purify ritually. Examples: fruit juice, used wuḍūʾ water.</li>
  <li><strong>Najis (Impure):</strong> Water contaminated with a najāsah. Cannot be used for any purification.</li>
</ol>
<h3>Categories of Najāsah</h3>
<p><strong>Najāsah Ghalīẓah (Heavy Impurity):</strong> human urine, stool, flowing blood. Requires thorough washing until impurity is removed.</p>
<p><strong>Najāsah Khafīfah (Light Impurity):</strong> urine of animals whose meat is permissible to eat. Excused if less than one quarter of the garment is affected.</p>
<h3>Purification Methods</h3>
<p>For ghalīẓah: wash at least three times until the impurity is gone. For khafīfah: if more than a quarter is affected, wash it off; if less than a quarter, the prayer remains valid.</p>
`;

  const content2 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Identify the signs of maturity (bulūgh) for boys</li>
  <li>List the religious obligations that begin at maturity</li>
  <li>Perform ghusl correctly knowing its three farāʾiḍ</li>
</ul>
<h3>Signs of Maturity (Bulūgh) for Boys</h3>
<ul>
  <li><strong>Iḥtilām:</strong> Having a wet dream (seminal discharge during sleep)</li>
  <li><strong>Pubic Hair Growth:</strong> Appearance of coarse pubic hair</li>
  <li><strong>Age 15 Lunar Years:</strong> If no other sign appears, maturity is established at this age</li>
</ul>
<h3>Obligations at Maturity</h3>
<p>Once a boy reaches bulūgh he must: perform the 5 daily ṣalāh, fast in Ramaḍān, perform ḥajj (if able), and pay zakāh (if he owns the niṣāb). All sins are now recorded against him.</p>
<h3>Three Farāʾiḍ of Ghusl</h3>
<ol>
  <li><strong>Madmaḍah:</strong> Rinsing the entire mouth</li>
  <li><strong>Istinshāq:</strong> Sniffing water into the nostrils and blowing it out</li>
  <li><strong>Full Body Wash:</strong> Ensuring water reaches every part including hair roots</li>
</ol>
<h3>Occasions Requiring Ghusl</h3>
<p><strong>Obligatory (farḍ):</strong> After janābah (major ritual impurity).<br>
<strong>Sunnah:</strong> On Friday before Jumu'ah, on Eid days, after washing a deceased person.</p>
`;

  const content3 = `
<h2>Learning Objectives</h2>
<ul>
  <li>State the conditions and priority order for the imām</li>
  <li>List the wājib acts of ṣalāh</li>
  <li>Describe the method of janāzah ṣalāh</li>
</ul>
<h3>Conditions for the Imām</h3>
<p>The imām must be: Muslim, sane, male (for a male or mixed congregation), and the most knowledgeable in fiqh and recitation. A fāsiq (openly sinful person) and a young child leading adult males are disqualified.</p>
<h3>Priority Order for Imāmah</h3>
<ol>
  <li>Most learned in fiqh and Qurʾān</li>
  <li>Best in recitation</li>
  <li>Most pious and careful in worship</li>
  <li>Oldest in age</li>
</ol>
<h3>Wājib Acts of Ṣalāh</h3>
<p>Wājibāt include: all additional takbīrs (beyond the opening takbīr), reciting Fātiḥah in every rakʿāt, adding a second sūrah in the first two rakʿāt, qawmah (standing after rukūʿ), jalsat al-ūlā (first sitting), reciting tasbīḥ in rukūʿ and sujūd at least once, and ending with salām.</p>
<h3>Method of Janāzah Ṣalāh</h3>
<p>Janāzah ṣalāh has no rukūʿ or sujūd — it is 4 takbīrs:</p>
<ul>
  <li><strong>1st Takbīr:</strong> Recite Thanāʾ and Sūrah al-Fātiḥah</li>
  <li><strong>2nd Takbīr:</strong> Recite Ṣalawāt (Durūd Ibrāhīm)</li>
  <li><strong>3rd Takbīr:</strong> Recite the masnūn duʿāʾ for the deceased</li>
  <li><strong>4th Takbīr:</strong> Salām on both sides</li>
</ul>
<p>It is farḍ al-kifāyah — if enough Muslims perform it, the obligation is lifted from all.</p>
`;

  const content4 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Know on whom Jumu'ah is obligatory</li>
  <li>Understand the conditions for Jumu'ah to be valid</li>
  <li>Respond correctly to the adhān</li>
</ul>
<h3>Jumu'ah Ṣalāh</h3>
<p>Jumu'ah (Friday prayer) is farḍ ʿayn on every free, adult, sane, resident Muslim male. It is NOT obligatory on women, travellers, the sick, or children.</p>
<p><strong>Conditions for validity:</strong> performed in a miṣr (town), led by an imām, in its correct time, preceded by two khutbahs, and performed as a congregation.</p>
<p><strong>Method:</strong> Two rakʿāt farḍ after two khutbahs. Those who miss it pray Ẓuhr (4 rakʿāt) instead.</p>
<h3>The Adhān</h3>
<p>The adhān is the Islamic call to prayer, sunnah before each of the 5 daily prayers.</p>
<p><strong>Response:</strong> Repeat each phrase after the muʾadhdhin. For "Ḥayya ʿalaṣ-ṣalāh" and "Ḥayya ʿalal-falāḥ" say: "Lā ḥawla walā quwwata illā billāh."</p>
<p><strong>Duʿāʾ after adhān:</strong> "Allāhumma Rabba hādhihid-daʿwatit-tāmmah..." — asking Allāh to grant the Prophet ﷺ the waṣīlah.</p>
<h3>Iqāmah</h3>
<p>Similar to adhān but recited quickly. Adds "Qad qāmatiṣ-ṣalāh" twice. It signals the congregation to form rows immediately.</p>
`;

  const content5 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Memorise the seven major sins from the ḥadīth</li>
  <li>Understand why each is a major sin</li>
  <li>Distinguish between kabāʾir and ṣaghāʾir</li>
</ul>
<h3>The Seven Major Sins (Al-Kabāʾir as-Sabʿ)</h3>
<p>Rasūlullāh ﷺ said: <em>"Avoid the seven destructive sins."</em> The Ṣaḥābah asked what they were:</p>
<ol>
  <li><strong>Shirk:</strong> Associating partners with Allāh — the gravest sin, never forgiven if one dies upon it</li>
  <li><strong>Siḥr (Magic):</strong> Practising witchcraft or sorcery</li>
  <li><strong>Murder:</strong> Unlawful killing of a soul Allāh has made sacred</li>
  <li><strong>Consuming Ribā:</strong> Dealing in interest or usury</li>
  <li><strong>Consuming an orphan's wealth:</strong> Taking what belongs to orphans wrongfully</li>
  <li><strong>Fleeing from battle:</strong> Deserting the battlefield when fighting is obligatory</li>
  <li><strong>Slandering chaste women:</strong> False accusations of immorality against believing women</li>
</ol>
<h3>Kabāʾir vs Ṣaghāʾir</h3>
<p><strong>Kabāʾir (Major sins):</strong> Acts explicitly warned against with a specific punishment or divine curse. They require sincere tawbah.</p>
<p><strong>Ṣaghāʾir (Minor sins):</strong> Forgiven through regular worship such as ṣalāh and wuḍūʾ, provided major sins are avoided.</p>
`;

  const content6 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Understand selected Prophetic ḥadīths and apply their lessons</li>
  <li>Recognise the virtue of learning and teaching Qurʾān</li>
  <li>Implement the sunnah in daily speech and interactions</li>
</ul>
<h3>Ḥadīth 1 – Best of People</h3>
<p><em>"The best of you is the one who learns the Qurʾān and teaches it."</em> (Bukhārī)</p>
<p>This ḥadīth encourages both learning and sharing — a person who does both achieves the highest rank.</p>
<h3>Ḥadīth 2 – Do Not Harm Others</h3>
<p><em>"Do not harm others and do not allow yourself to be harmed."</em> (Ibn Mājah)</p>
<p>A foundational principle of Islamic law — removing harm is an obligation.</p>
<h3>Ḥadīth 3 – Smiling is Charity</h3>
<p><em>"Your smile at your brother is charity."</em> (Tirmidhī)</p>
<p>Even the smallest sincere act has reward. A smile creates warmth and is a form of ṣadaqah.</p>
<h3>Ḥadīth 4 – Speak Good or Be Silent</h3>
<p><em>"Whoever believes in Allāh and the Last Day, let him speak good or remain silent."</em> (Bukhārī)</p>
<p>Our words have consequences. If one has nothing beneficial to say, silence is better.</p>
<h3>Ḥadīth 5 – Visiting the Sick</h3>
<p><em>"Visit the sick, for the visitor walks in a garden of Paradise until he returns."</em> (Muslim)</p>
<p>Visiting the sick is a right of every Muslim upon another and carries enormous reward.</p>
`;

  const content7 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Describe the physical appearance of Rasūlullāh ﷺ</li>
  <li>Identify key character traits of the Prophet ﷺ</li>
  <li>Appreciate the sunnah in his daily habits</li>
</ul>
<h3>Physical Description (Shamāʾil)</h3>
<p>Rasūlullāh ﷺ was of medium height, broad-shouldered, with a fair complexion that had a reddish tone. His face was beautiful and radiant. His hair was black and thick, reaching to his earlobes. His beard was neat. His eyes were large and dark, as if lined with kohl. There was a slight gap between his blessed teeth. Between his shoulder blades was the <strong>seal of prophethood (khātam al-nubuwwah)</strong> — a raised mark the size of a pigeon's egg.</p>
<h3>Character Traits</h3>
<ul>
  <li><strong>Most Generous:</strong> He never refused a request if he had anything to give</li>
  <li><strong>Most Brave:</strong> The Ṣaḥābah would shelter behind him in battle</li>
  <li><strong>Never Angry for Personal Reasons:</strong> His anger was only for Allāh's sake</li>
  <li><strong>Joyful:</strong> He often smiled (tebassama) but never laughed loudly</li>
  <li><strong>Loved Perfume:</strong> He ﷺ would never refuse a gift of perfume</li>
</ul>
<h3>Daily Habits</h3>
<p>He ﷺ ate simply, slept on a mat, used the miswāk regularly, performed wuḍūʾ before sleep, and recited adhkār morning and evening. His humility was extraordinary — he mended his own sandals and helped with household chores.</p>
`;

  const content8 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Explain why Abū Bakr رضي الله عنه received the title aṣ-Ṣiddīq</li>
  <li>List his key services to Islām</li>
  <li>Understand the achievements of his caliphate</li>
</ul>
<h3>Abū Bakr aṣ-Ṣiddīq رضي الله عنه</h3>
<p>Abū Bakr رضي الله عنه was the closest companion of Rasūlullāh ﷺ and the first adult free man to accept Islām. He accompanied the Prophet ﷺ in the cave of Thawr during the hijrah to Madīnah.</p>
<h3>Title: aṣ-Ṣiddīq (The Truthful)</h3>
<p>When some doubted the Isrāʾ wal-Miʿrāj, Abū Bakr رضي الله عنه immediately believed, saying: <em>"If he ﷺ said it, it is true."</em> The Prophet ﷺ gave him the title <strong>aṣ-Ṣiddīq</strong>.</p>
<h3>Services to Islām</h3>
<ul>
  <li>Freed enslaved Muslims being tortured (notably Bilāl ibn Rabāḥ)</li>
  <li>Companion in the cave of Thawr during the hijrah</li>
  <li>Among the very first to accept and spread Islām</li>
</ul>
<h3>Caliphate (632–634 CE)</h3>
<ul>
  <li>Ordered compilation of the Qurʾān into a single muṣḥaf after many ḥuffāẓ were martyred</li>
  <li>Fought the riddah (apostasy) wars, reuniting the Arabian Peninsula</li>
  <li>Sent armies northward towards Persia and Byzantium</li>
</ul>
`;

  const content9 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Describe the miracles and mission of Dāwūd ʿalayhis-salām</li>
  <li>Describe Sulaymān's unique gifts from Allāh</li>
  <li>Explain the story of the Queen of Sabaʾ</li>
</ul>
<h3>Prophet Dāwūd ʿalayhis-salām</h3>
<p>Dāwūd was given the <strong>Zabūr</strong> (Psalms) and the kingdom of Israel. As a young man he killed the giant <strong>Jālūt (Goliath)</strong> with a sling. His miracles included: iron softening in his bare hands so he could craft armour without fire, and a breathtaking voice that caused birds and mountains to join in his tasbīḥ.</p>
<h3>Prophet Sulaymān ʿalayhis-salām</h3>
<p>Son of Dāwūd, Sulaymān was given a kingdom unlike any before or after him. Allāh gave him control over:</p>
<ul>
  <li>Humans and jinn (who built palaces for him)</li>
  <li>Birds — including the hoopoe (hudhud) who served as his messenger</li>
  <li>The wind (used as transport)</li>
</ul>
<p>He could understand the language of animals. He directed the building of <strong>Masjid al-Aqṣā</strong>. The Queen of Sabaʾ (Bilqīs) visited and accepted Islām after witnessing his wisdom.</p>
`;

  const content10 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Narrate the story of Prophet Yūnus ʿalayhis-salām</li>
  <li>Memorise the duʿāʾ of Yūnus</li>
  <li>Outline the key features of the Umayyad Caliphate</li>
</ul>
<h3>Prophet Yūnus ʿalayhis-salām</h3>
<p>Yūnus was sent to <strong>Nineveh</strong>. When the people rejected him, he left in frustration without Allāh's permission. Cast into the sea from a ship during a storm, he was swallowed by a great whale.</p>
<p>In darkness, he made this powerful duʿāʾ:</p>
<p><strong>"Lā ilāha illā Anta subḥānaka innī kuntu minaẓ-ẓālimīn"</strong><br>
<em>(There is no god but You. Glory be to You! I was among the wrongdoers.)</em></p>
<p>Allāh responded. The whale released him on the shore. He returned and his entire people accepted Islām — a unique event in prophetic history.</p>
<h3>The Umayyad Caliphate (661–750 CE)</h3>
<p><strong>Founded by:</strong> Muʿāwiyah ibn Abī Sufyān رضي الله عنه. <strong>Capital:</strong> Damascus.</p>
<ul>
  <li>Expansion to <strong>Spain (Andalusia)</strong> in the west and <strong>Central Asia</strong> in the east</li>
  <li><strong>Walīd ibn ʿAbd al-Malik</strong> expanded Masjid al-Nabawī and Masjid al-Aqṣā</li>
  <li>Arabic became the official administrative language</li>
  <li>Ended 750 CE when the Abbasids took power</li>
</ul>
`;

  const content11 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Define who Ahlus Sunnah wal-Jamāʿah are</li>
  <li>List their distinguishing beliefs</li>
  <li>Understand how they differ from deviant groups</li>
</ul>
<h3>Who Are Ahlus Sunnah wal-Jamāʿah?</h3>
<p>Those who follow the Qurʾān, the authentic Sunnah of Rasūlullāh ﷺ, as understood by the Ṣaḥābah and the righteous early generations (salaf). They are the mainstream body of Islām.</p>
<h3>Distinguishing Beliefs</h3>
<ul>
  <li>Allāh exists above His creation in a manner befitting His Majesty — without likening Him to creation</li>
  <li>All Ṣaḥābah are respected — none condemned</li>
  <li>Following any of the four madhabs (Ḥanafī, Mālikī, Shāfiʿī, Ḥanbalī) is acceptable</li>
  <li>Innovation (bidʿah) in worship is rejected</li>
</ul>
<h3>Historical Context</h3>
<p>After the Ṣaḥābah's era, groups deviated:</p>
<ul>
  <li><strong>Muʿtazilah:</strong> Used pure rationalist philosophy and denied Allāh's attributes</li>
  <li><strong>Extremist Shīʿah:</strong> Elevated certain leaders beyond their proper station</li>
  <li><strong>Khawārij:</strong> Made takfīr of Muslims who committed sins</li>
</ul>
<p>Ahlus Sunnah holds the middle path, adhering to Qurʾān, Sunnah, and scholarly consensus.</p>
`;

  const content12 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Name the five essential qualities of all prophets</li>
  <li>Distinguish between muʿjizah and karāmah</li>
  <li>Describe the events of al-Isrāʾ wal-Miʿrāj</li>
</ul>
<h3>Five Qualities of the Prophets</h3>
<ol>
  <li><strong>Ṣidq (Truthfulness):</strong> They never lied</li>
  <li><strong>Amānah (Trustworthiness):</strong> They were completely trustworthy</li>
  <li><strong>Tablīgh (Conveying):</strong> They conveyed every revelation without concealing anything</li>
  <li><strong>Faṭānah (Intelligence):</strong> They possessed the highest intellect</li>
  <li><strong>ʿIṣmah (Infallibility):</strong> Protected from sin and error in conveying the message</li>
</ol>
<h3>Muʿjizah vs Karāmah</h3>
<p><strong>Muʿjizah:</strong> An extraordinary event granted to a <em>prophet</em> to prove his prophethood — breaks natural laws (e.g. the Qurʾān, Mūsā's staff).</p>
<p><strong>Karāmah:</strong> An extraordinary event at the hands of a <em>walī</em> (friend of Allāh), not as proof of prophethood but as divine honour.</p>
<h3>Al-Isrāʾ wal-Miʿrāj</h3>
<p><strong>Isrāʾ:</strong> Night journey from Masjid al-Ḥarām (Makkah) to Masjid al-Aqṣā (Jerusalem) on the Burāq. The Prophet ﷺ led all previous prophets in ṣalāh there.</p>
<p><strong>Miʿrāj:</strong> Ascent through 7 heavens, meeting the prophets at each level, reaching Sidrat al-Muntahā. Allāh gave the gift of 5 daily prayers (originally 50, reduced through Mūsā's advice).</p>
`;

  const content13 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Define ẓulm, ḥasad and kibr with Islamic evidence</li>
  <li>Distinguish ḥasad from the permissible ghibṭah</li>
  <li>Know cures for each spiritual disease</li>
</ul>
<h3>Ẓulm (Oppression)</h3>
<p>Ẓulm means placing something where it does not belong — injustice in its widest sense.</p>
<ul>
  <li><strong>Ẓulm on oneself:</strong> Sins that harm one's own soul (neglecting ṣalāh, consuming ḥarām)</li>
  <li><strong>Ẓulm on others:</strong> Violating others' property, honour, or safety</li>
</ul>
<p>Allāh says: <em>"Verily, the wrongdoers will not be successful."</em> (Qurʾān 6:21)</p>
<h3>Ḥasad (Envy)</h3>
<p>Ḥasad means wishing a blessing is <em>removed</em> from another. This is forbidden.</p>
<p><strong>Ghibṭah (permissible):</strong> Wishing for something similar to what another has, <em>without</em> wishing they lose it.</p>
<p><strong>Cure:</strong> Remember Allāh distributes wisely. Make duʿāʾ for the envied person. Reflect on your own blessings.</p>
<h3>Kibr (Pride/Arrogance)</h3>
<p>Kibr means thinking oneself superior to others and looking down on them.</p>
<p>The Prophet ﷺ said: <em>"No one with even an atom's weight of kibr in his heart will enter Jannah."</em> (Muslim)</p>
<p><strong>Cure:</strong> Remember your origin and end. Serve others. Sit with the poor. Recall that all honour belongs to Allāh.</p>
`;

  const content14 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Define ghībah and understand its gravity</li>
  <li>Know when mentioning faults is permissible</li>
  <li>Understand the reward of reviving a Sunnah</li>
</ul>
<h3>Ghībah (Backbiting)</h3>
<p>Rasūlullāh ﷺ defined it: <em>"Mentioning your brother in a way he would dislike."</em> (Muslim)</p>
<p>This applies even if what is said is TRUE. The Qurʾān compares it to eating the flesh of your dead brother (49:12). It is a major sin.</p>
<h3>Namīmah (Tale-Carrying)</h3>
<p>Carrying words from one person to another to create conflict. The nammām (tale-carrier) will not enter Jannah. It is even more serious than ghībah in some rulings.</p>
<h3>When Is Mentioning Faults Permissible?</h3>
<ul>
  <li><strong>Warning others:</strong> To protect from genuine harm (e.g. warning about a dishonest trader)</li>
  <li><strong>Seeking a fatwā:</strong> Mentioning wrongdoing to a scholar for a legal ruling</li>
  <li><strong>In court:</strong> Bearing witness before a judge</li>
</ul>
<h3>Reviving a Sunnah</h3>
<p>The Prophet ﷺ said: <em>"Whoever revives a sunnah of mine that has been abandoned will receive the reward of all those who act upon it, without their rewards being diminished."</em> (Tirmidhī)</p>
`;

  const content15 = `
<h2>Learning Objectives</h2>
<ul>
  <li>State the ʿawrah for Muslim men</li>
  <li>Know the Islamic dress code for men</li>
  <li>List the Sunan al-Fiṭrah</li>
</ul>
<h3>ʿAwrah for Men</h3>
<p>The ʿawrah (area that must always be covered) for a Muslim male is from the <strong>navel to the knee</strong>. This applies in all situations — in and out of ṣalāh, before men and women.</p>
<h3>Islamic Dress Code for Men</h3>
<ul>
  <li><strong>Silk:</strong> Forbidden (ḥarām) for men to wear</li>
  <li><strong>Gold:</strong> Forbidden (ḥarām) for men to wear</li>
  <li><strong>White clothes:</strong> Sunnah — the Prophet ﷺ loved white garments</li>
  <li><strong>Isbāl (below-ankle clothing):</strong> Forbidden if done out of arrogance</li>
</ul>
<h3>Sunan al-Fiṭrah (Natural Acts of Cleanliness)</h3>
<ol>
  <li>Circumcision (for males)</li>
  <li>Clipping the nails</li>
  <li>Trimming the moustache</li>
  <li>Growing the beard</li>
  <li>Removing armpit hair</li>
  <li>Removing pubic hair</li>
  <li>Using the miswāk (tooth-stick)</li>
</ol>
<p>All of these should be attended to at least every 40 days.</p>
`;

  const content16 = `
<h2>Learning Objectives</h2>
<ul>
  <li>Respond correctly to the adhān</li>
  <li>Follow the sunan of the two ʿĪd days</li>
  <li>Prepare for Jumu'ah according to the Sunnah</li>
</ul>
<h3>Etiquette of Hearing the Adhān</h3>
<p>Stop what you are doing, listen, and repeat each phrase. Exception: for "Ḥayya ʿalaṣ-ṣalāh" and "Ḥayya ʿalal-falāḥ" say: <em>"Lā ḥawla walā quwwata illā billāh."</em><br>
After: send ṣalawāt on the Prophet ﷺ, then recite the masnūn duʿāʾ.</p>
<h3>ʿĪd Day Sunan</h3>
<p><strong>Both ʿĪds:</strong> Ghusl, clean/new clothes, miswāk, perfume, different routes to/from the ʿĪd ground, abundant takbīrs.</p>
<p><strong>ʿĪd al-Fiṭr:</strong> Eat something sweet (dates) <em>before</em> the ṣalāh.</p>
<p><strong>ʿĪd al-Aḍḥā:</strong> Do <em>not</em> eat until after the ṣalāh and the sacrifice.</p>
<h3>Jumu'ah Preparation Sunan</h3>
<ol>
  <li>Perform ghusl</li>
  <li>Use miswāk</li>
  <li>Apply perfume</li>
  <li>Wear clean, preferably white, clothes</li>
  <li>Go early to the masjid (earlier = greater reward)</li>
  <li>Listen to the khutbah in silence (wājib)</li>
  <li>Make abundant duʿāʾ in the last hour before Maghrib</li>
</ol>
`;

  // ── UNIT UPSERTS ─────────────────────────────────────────────────
  const unit1 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-fiqh-water-impurities' } },
    create: { slug: 'maktab-6b-fiqh-water-impurities', courseId, orderIndex: 1, title: 'Fiqh \u2013 Types of Water & Impurities', description: 'Categories of water, types of najāsah, and purification methods.', content: content1 },
    update: { title: 'Fiqh \u2013 Types of Water & Impurities', description: 'Categories of water, types of najāsah, and purification methods.', content: content1, orderIndex: 1 },
  });
  const unit2 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-fiqh-maturity-ghusl' } },
    create: { slug: 'maktab-6b-fiqh-maturity-ghusl', courseId, orderIndex: 2, title: 'Fiqh \u2013 Maturity & Ghusl (Boys)', description: 'Signs of bul\u016bgh, obligations at maturity, and far\u0101\u02bci\u1e0d of ghusl.', content: content2 },
    update: { title: 'Fiqh \u2013 Maturity & Ghusl (Boys)', description: 'Signs of bul\u016bgh, obligations at maturity, and far\u0101\u02bcid of ghusl.', content: content2, orderIndex: 2 },
  });
  const unit3 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-fiqh-imamah-janazah' } },
    create: { slug: 'maktab-6b-fiqh-imamah-janazah', courseId, orderIndex: 3, title: 'Fiqh \u2013 Im\u0101mah, W\u0101jib Acts & Jan\u0101zah \u1e62al\u0101h', description: 'Conditions for the im\u0101m, w\u0101jib acts in \u1e62al\u0101h, and method of jan\u0101zah \u1e62al\u0101h.', content: content3 },
    update: { title: 'Fiqh \u2013 Im\u0101mah, W\u0101jib Acts & Jan\u0101zah \u1e62al\u0101h', description: 'Conditions for the im\u0101m, w\u0101jib acts, and method of jan\u0101zah \u1e62al\u0101h.', content: content3, orderIndex: 3 },
  });
  const unit4 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-fiqh-jumuah-adhan' } },
    create: { slug: 'maktab-6b-fiqh-jumuah-adhan', courseId, orderIndex: 4, title: "Fiqh \u2013 Jumu'ah \u1e62al\u0101h & Adh\u0101n", description: "Conditions and method of Jumu'ah, and responding to the adh\u0101n.", content: content4 },
    update: { title: "Fiqh \u2013 Jumu'ah \u1e62al\u0101h & Adh\u0101n", description: "Conditions and method of Jumu'ah, and responding to the adh\u0101n.", content: content4, orderIndex: 4 },
  });
  const unit5 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-ahadith-major-sins' } },
    create: { slug: 'maktab-6b-ahadith-major-sins', courseId, orderIndex: 5, title: 'A\u1e25\u0101d\u012bth \u2013 Major Sins', description: 'The seven major sins mentioned in the \u1e25ad\u012bth of Ras\u016blull\u0101h \ufdfa.', content: content5 },
    update: { title: 'A\u1e25\u0101d\u012bth \u2013 Major Sins', description: 'The seven major sins mentioned in the \u1e25ad\u012bth of Ras\u016blull\u0101h \ufdfa.', content: content5, orderIndex: 5 },
  });
  const unit6 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-ahadith-teachings' } },
    create: { slug: 'maktab-6b-ahadith-teachings', courseId, orderIndex: 6, title: 'A\u1e25\u0101d\u012bth \u2013 Key Prophetic Teachings', description: 'Selected \u1e25ad\u012bths on Qur\u02beān learning, speech, charity and visiting the sick.', content: content6 },
    update: { title: 'A\u1e25\u0101d\u012bth \u2013 Key Prophetic Teachings', description: 'Selected \u1e25ad\u012bths on Qur\u02beān learning, speech, charity and visiting the sick.', content: content6, orderIndex: 6 },
  });
  const unit7 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-sirah-shamail' } },
    create: { slug: 'maktab-6b-sirah-shamail', courseId, orderIndex: 7, title: 'S\u012brah \u2013 Sham\u0101\u02bcil of Ras\u016blull\u0101h \ufdfa', description: 'Physical description and noble character traits of the Prophet \ufdfa.', content: content7 },
    update: { title: 'S\u012brah \u2013 Sham\u0101\u02bcil of Ras\u016blull\u0101h \ufdfa', description: 'Physical description and noble character traits of the Prophet \ufdfa.', content: content7, orderIndex: 7 },
  });
  const unit8 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-sirah-abu-bakr' } },
    create: { slug: 'maktab-6b-sirah-abu-bakr', courseId, orderIndex: 8, title: 'S\u012brah \u2013 Ab\u016b Bakr a\u1e63-\u1e62idd\u012bq \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647', description: 'Life, virtues, and caliphate of the first Caliph.', content: content8 },
    update: { title: 'S\u012brah \u2013 Ab\u016b Bakr a\u1e63-\u1e62idd\u012bq \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647', description: 'Life, virtues, and caliphate of the first Caliph.', content: content8, orderIndex: 8 },
  });
  const unit9 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-tarikh-dawud-sulayman' } },
    create: { slug: 'maktab-6b-tarikh-dawud-sulayman', courseId, orderIndex: 9, title: 'T\u0101r\u012bkh \u2013 Prophets D\u0101w\u016bd & Sulaym\u0101n \u02bfalyhim al-sal\u0101m', description: 'Stories and miracles of D\u0101w\u016bd and Sulaym\u0101n \u02bfalyhim al-sal\u0101m.', content: content9 },
    update: { title: 'T\u0101r\u012bkh \u2013 Prophets D\u0101w\u016bd & Sulaym\u0101n \u02bfalyhim al-sal\u0101m', description: 'Stories and miracles of D\u0101w\u016bd and Sulaym\u0101n \u02bfalyhim al-sal\u0101m.', content: content9, orderIndex: 9 },
  });
  const unit10 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-tarikh-yunus-umayyads' } },
    create: { slug: 'maktab-6b-tarikh-yunus-umayyads', courseId, orderIndex: 10, title: 'T\u0101r\u012bkh \u2013 Prophet Y\u016bnus & The Umayyad Dynasty', description: 'Story of Y\u016bnus in the whale and overview of the Umayyad Caliphate.', content: content10 },
    update: { title: 'T\u0101r\u012bkh \u2013 Prophet Y\u016bnus & The Umayyad Dynasty', description: 'Story of Y\u016bnus in the whale and overview of the Umayyad Caliphate.', content: content10, orderIndex: 10 },
  });
  const unit11 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-aqaid-ahlus-sunnah' } },
    create: { slug: 'maktab-6b-aqaid-ahlus-sunnah', courseId, orderIndex: 11, title: 'Aq\u0101\u02bcid \u2013 Ahlus Sunnah wal-Jam\u0101\u02bcah', description: 'Definition, beliefs and distinctions of Ahlus Sunnah wal-Jam\u0101\u02bcah.', content: content11 },
    update: { title: 'Aq\u0101\u02bcid \u2013 Ahlus Sunnah wal-Jam\u0101\u02bcah', description: 'Definition, beliefs and distinctions of Ahlus Sunnah wal-Jam\u0101\u02bcah.', content: content11, orderIndex: 11 },
  });
  const unit12 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-aqaid-nubuwwah-miraj' } },
    create: { slug: 'maktab-6b-aqaid-nubuwwah-miraj', courseId, orderIndex: 12, title: 'Aq\u0101\u02bcid \u2013 Prophethood, Miracles & al-Isr\u0101\u02bc wal-Mi\u02bfr\u0101j', description: 'Five qualities of prophets, mu\u02bfjizah vs kar\u0101mah, and the night journey.', content: content12 },
    update: { title: 'Aq\u0101\u02bcid \u2013 Prophethood, Miracles & al-Isr\u0101\u02bc wal-Mi\u02bfr\u0101j', description: 'Five qualities of prophets, mu\u02bfjizah vs kar\u0101mah, and the night journey.', content: content12, orderIndex: 12 },
  });
  const unit13 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-akhlaq-diseases' } },
    create: { slug: 'maktab-6b-akhlaq-diseases', courseId, orderIndex: 13, title: 'Akhl\u0101q \u2013 Spiritual Diseases: \u1e92ulm, \u1e24asad & Kibr', description: 'Definition and cures for oppression, envy, and pride.', content: content13 },
    update: { title: 'Akhl\u0101q \u2013 Spiritual Diseases: \u1e92ulm, \u1e24asad & Kibr', description: 'Definition and cures for oppression, envy, and pride.', content: content13, orderIndex: 13 },
  });
  const unit14 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-akhlaq-ghibah-sunnah' } },
    create: { slug: 'maktab-6b-akhlaq-ghibah-sunnah', courseId, orderIndex: 14, title: 'Akhl\u0101q \u2013 Gh\u012bbah & Following the Sunnah', description: 'Backbiting, tale-carrying, permissible speech, and reviving the Sunnah.', content: content14 },
    update: { title: 'Akhl\u0101q \u2013 Gh\u012bbah & Following the Sunnah', description: 'Backbiting, tale-carrying, permissible speech, and reviving the Sunnah.', content: content14, orderIndex: 14 },
  });
  const unit15 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-adab-modesty-hygiene' } },
    create: { slug: 'maktab-6b-adab-modesty-hygiene', courseId, orderIndex: 15, title: '\u0100d\u0101b \u2013 Modesty in Dress & Personal Hygiene', description: "Men's \u02bcawrah, Islamic dress code, and the Sunan al-Fi\u1e6drah.", content: content15 },
    update: { title: '\u0100d\u0101b \u2013 Modesty in Dress & Personal Hygiene', description: "Men's \u02bcawrah, Islamic dress code, and the Sunan al-Fi\u1e6drah.", content: content15, orderIndex: 15 },
  });
  const unit16 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId, slug: 'maktab-6b-adab-adhan-eid-jumuah' } },
    create: { slug: 'maktab-6b-adab-adhan-eid-jumuah', courseId, orderIndex: 16, title: "\u0100d\u0101b \u2013 Adh\u0101n, \u02bfĪdayn & Jumu'ah Etiquette", description: "Responding to the adh\u0101n, \u02bfĪd sunan, and Jumu'ah preparation.", content: content16 },
    update: { title: "\u0100d\u0101b \u2013 Adh\u0101n, \u02bfĪdayn & Jumu'ah Etiquette", description: "Responding to the adh\u0101n, \u02bfĪd sunan, and Jumu'ah preparation.", content: content16, orderIndex: 16 },
  });

  // ── QUIZ DATA ─────────────────────────────────────────────────────
  const quizData: {
    unitId: string; externalId: string; type: string;
    questionText: string; options: string[] | null;
    correctAnswer: string; explanation: string;
  }[] = [
    // Unit 1 – Water & Impurities
    { unitId: unit1.id, externalId: 'cb6b-u1-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which category of water can be used for wudu and ghusl?', options: ['Tahir Mutahhir', 'Tahir', 'Najis', 'Mixed water'], correctAnswer: 'Tahir Mutahhir', explanation: 'Only tahir mutahhir (pure and purifying) water is valid for ritual purification.' },
    { unitId: unit1.id, externalId: 'cb6b-u1-q2', type: 'MULTIPLE_CHOICE', questionText: 'Which of the following is an example of tahir (pure but non-purifying) water?', options: ['Rain water', 'River water', 'Fruit juice', 'Well water'], correctAnswer: 'Fruit juice', explanation: 'Fruit juice is pure to consume but cannot purify ritually.' },
    { unitId: unit1.id, externalId: 'cb6b-u1-q3', type: 'MULTIPLE_CHOICE', questionText: 'Najasah ghaliza (heavy impurity) includes which of the following?', options: ['Urine of a cow', 'Human urine and stool', 'Dirt from the road', 'Sweat'], correctAnswer: 'Human urine and stool', explanation: 'Human urine, stool, and flowing blood are najasah ghaliza.' },
    { unitId: unit1.id, externalId: 'cb6b-u1-q4', type: 'TRUE_FALSE', questionText: 'Najasah khafifah is the urine of animals whose meat is permissible to eat.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Khafifah (light) impurity includes urine of halal animals like cows and sheep.' },
    { unitId: unit1.id, externalId: 'cb6b-u1-q5', type: 'MULTIPLE_CHOICE', questionText: 'If najasah khafifah covers less than one quarter of a garment, the prayer is:', options: ['Invalid and must be repeated', 'Valid', 'Makruh but valid', 'Compulsory to remove it'], correctAnswer: 'Valid', explanation: 'Less than a quarter of khafifah impurity is excused and prayer is valid.' },
    { unitId: unit1.id, externalId: 'cb6b-u1-q6', type: 'FILL_BLANK', questionText: 'Water contaminated with impurity that cannot be used for any purification is called _______.', options: null, correctAnswer: 'Najis', explanation: 'Najis water is impure and cannot be used for wudu, ghusl, or cleaning impurities.' },
    { unitId: unit1.id, externalId: 'cb6b-u1-q7', type: 'TRUE_FALSE', questionText: 'Used wudu water is classified as tahir mutahhir.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Used wudu water becomes tahir (pure) but loses its purifying quality, so it is no longer mutahhir.' },
    // Unit 2 – Maturity & Ghusl
    { unitId: unit2.id, externalId: 'cb6b-u2-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which of these is NOT a sign of maturity (bulugh) for boys?', options: ['Wet dream', 'Pubic hair growth', 'Voice breaking', 'Reaching age 15 lunar years'], correctAnswer: 'Voice breaking', explanation: 'The three signs are wet dream, pubic hair, and age 15 lunar years.' },
    { unitId: unit2.id, externalId: 'cb6b-u2-q2', type: 'MULTIPLE_CHOICE', questionText: 'How many faraid (obligatory acts) does ghusl have?', options: ['2', '3', '4', '5'], correctAnswer: '3', explanation: 'The three faraid of ghusl are: rinsing the mouth, rinsing the nostrils, and washing the entire body.' },
    { unitId: unit2.id, externalId: 'cb6b-u2-q3', type: 'MULTIPLE_CHOICE', questionText: 'What is the term for a wet dream that makes ghusl obligatory?', options: ['Ihtilam', 'Janabah', 'Hayd', 'Wudu'], correctAnswer: 'Ihtilam', explanation: 'Ihtilam is the wet dream; the resulting state is janabah which requires ghusl.' },
    { unitId: unit2.id, externalId: 'cb6b-u2-q4', type: 'TRUE_FALSE', questionText: 'Ghusl on Friday before Jumuah is obligatory (fard).', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Friday ghusl is sunnah, not fard. Only ghusl after janabah is obligatory.' },
    { unitId: unit2.id, externalId: 'cb6b-u2-q5', type: 'MULTIPLE_CHOICE', questionText: 'If a boy shows no signs of maturity, at what lunar age does maturity begin?', options: ['12', '13', '14', '15'], correctAnswer: '15', explanation: 'If no physical signs appear, the Shariah sets 15 lunar years as the age of bulugh.' },
    { unitId: unit2.id, externalId: 'cb6b-u2-q6', type: 'FILL_BLANK', questionText: 'Sniffing water into the nostrils during ghusl is called _______.', options: null, correctAnswer: 'Istinshaq', explanation: 'Istinshaq is inhaling water into the nostrils and blowing it out — a fard of ghusl.' },
    { unitId: unit2.id, externalId: 'cb6b-u2-q7', type: 'TRUE_FALSE', questionText: 'Fasting in Ramadan becomes obligatory for a boy only after he reaches bulugh.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'All major religious obligations begin at maturity (bulugh).' },
    // Unit 3 – Imamah & Janazah
    { unitId: unit3.id, externalId: 'cb6b-u3-q1', type: 'MULTIPLE_CHOICE', questionText: 'How many takbirs are there in janazah salah?', options: ['2', '3', '4', '5'], correctAnswer: '4', explanation: 'Janazah salah consists of 4 takbirs with specific recitations after each.' },
    { unitId: unit3.id, externalId: 'cb6b-u3-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is recited after the 2nd takbir in janazah salah?', options: ['Surah al-Fatihah', 'Salawat (Durud Ibrahim)', "Dua for the deceased", "Thana"], correctAnswer: 'Salawat (Durud Ibrahim)', explanation: 'After the 2nd takbir, Durud Ibrahim (salawat) is recited.' },
    { unitId: unit3.id, externalId: 'cb6b-u3-q3', type: 'TRUE_FALSE', questionText: 'A woman can lead a congregation of men in salah.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'The imam for a mixed or male congregation must be male.' },
    { unitId: unit3.id, externalId: 'cb6b-u3-q4', type: 'MULTIPLE_CHOICE', questionText: 'Janazah salah is classified as:', options: ['Fard ayn on every Muslim', 'Fard al-kifayah', 'Sunnah muakkadah', 'Nafilah'], correctAnswer: 'Fard al-kifayah', explanation: 'If some Muslims perform janazah salah, the obligation is lifted from the community.' },
    { unitId: unit3.id, externalId: 'cb6b-u3-q5', type: 'MULTIPLE_CHOICE', questionText: 'Which of the following is a wajib act in salah?', options: ['Opening takbir', 'Reciting tasbih in ruku', 'Niyyah (intention)', 'Facing qiblah'], correctAnswer: 'Reciting tasbih in ruku', explanation: 'The opening takbir, niyyah, and facing qiblah are faraid; tasbih in ruku is wajib.' },
    { unitId: unit3.id, externalId: 'cb6b-u3-q6', type: 'FILL_BLANK', questionText: 'The first sitting in salah after 2 rakaats (before standing for the 3rd) is called _______.', options: null, correctAnswer: 'Jalsat al-ula', explanation: 'Jalsat al-ula (the first sitting) is a wajib act that must not be omitted.' },
    { unitId: unit3.id, externalId: 'cb6b-u3-q7', type: 'TRUE_FALSE', questionText: 'A fasiq (openly sinful person) is disqualified from leading salah as imam.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'It is makruh tahrimy to appoint a fasiq as imam.' },
    // Unit 4 – Jumuah & Adhan
    { unitId: unit4.id, externalId: 'cb6b-u4-q1', type: 'MULTIPLE_CHOICE', questionText: "How many rakaats are performed in Jumuah salah?", options: ['2', '4', '3', '6'], correctAnswer: '2', explanation: "Jumuah salah consists of 2 fard rakaats performed after the two khutbahs." },
    { unitId: unit4.id, externalId: 'cb6b-u4-q2', type: 'TRUE_FALSE', questionText: "Jumuah is obligatory on women.", options: ['True', 'False'], correctAnswer: 'False', explanation: "Jumuah is obligatory on free, adult, sane, resident Muslim males only." },
    { unitId: unit4.id, externalId: 'cb6b-u4-q3', type: 'MULTIPLE_CHOICE', questionText: "When you hear Hayya alas-salah in the adhan, what do you respond?", options: ["Hayya alas-salah", "La hawla wala quwwata illa billah", "Allahu Akbar", "Sadaqta wa bararta"], correctAnswer: 'La hawla wala quwwata illa billah', explanation: 'For both hayya calls, the listener responds with La hawla wala quwwata illa billah.' },
    { unitId: unit4.id, externalId: 'cb6b-u4-q4', type: 'MULTIPLE_CHOICE', questionText: 'How does the iqamah differ from the adhan?', options: ['The iqamah is longer', 'The iqamah adds Qad qamatissalah twice', 'The iqamah is recited outside the masjid', 'There is no difference'], correctAnswer: 'The iqamah adds Qad qamatissalah twice', explanation: 'Qad qamatissalah (prayer is established) is the addition unique to the iqamah.' },
    { unitId: unit4.id, externalId: 'cb6b-u4-q5', type: 'TRUE_FALSE', questionText: "A traveller is exempt from the obligation of Jumuah.", options: ['True', 'False'], correctAnswer: 'True', explanation: "Travellers are among those exempted from Jumuah." },
    { unitId: unit4.id, externalId: 'cb6b-u4-q6', type: 'FILL_BLANK', questionText: "If a person misses Jumuah, they must pray _______ (4 rakaats) instead.", options: null, correctAnswer: 'Zuhr', explanation: "Missing Jumuah means praying the full Zuhr salah of 4 rakaats." },
    { unitId: unit4.id, externalId: 'cb6b-u4-q7', type: 'MULTIPLE_CHOICE', questionText: "What must precede the Jumuah salah?", options: ['4 rakaats of sunnah', 'Two khutbahs', 'Individual dua', 'Ghusl'], correctAnswer: 'Two khutbahs', explanation: "Two khutbahs by the imam are a condition for the validity of Jumuah." },
    // Unit 5 – Major Sins
    { unitId: unit5.id, externalId: 'cb6b-u5-q1', type: 'MULTIPLE_CHOICE', questionText: 'How many major sins are listed in the hadith about the seven destructive sins?', options: ['5', '6', '7', '10'], correctAnswer: '7', explanation: 'The Prophet mentioned exactly seven sins as al-mubiaat (the destroyers).' },
    { unitId: unit5.id, externalId: 'cb6b-u5-q2', type: 'MULTIPLE_CHOICE', questionText: 'Why is shirk considered the worst of all sins?', options: ['It harms other people', 'It is the only sin that may not be forgiven if one dies upon it', 'It involves physical harm', 'It wastes money'], correctAnswer: 'It is the only sin that may not be forgiven if one dies upon it', explanation: 'Allah says He forgives all sins except shirk — dying upon it means eternal punishment.' },
    { unitId: unit5.id, externalId: 'cb6b-u5-q3', type: 'TRUE_FALSE', questionText: 'Fleeing from the battlefield when fighting is obligatory is one of the seven major sins.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Desertion from battle (when fighting is fard) is listed as one of the seven destructive sins.' },
    { unitId: unit5.id, externalId: 'cb6b-u5-q4', type: 'MULTIPLE_CHOICE', questionText: 'What is riba?', options: ['Gambling', 'Interest or usury', 'Theft', 'Bribery'], correctAnswer: 'Interest or usury', explanation: 'Riba means taking or giving interest on loans, explicitly forbidden in the Quran.' },
    { unitId: unit5.id, externalId: 'cb6b-u5-q5', type: 'MULTIPLE_CHOICE', questionText: 'What is the Arabic term for minor sins?', options: ['Kabair', 'Saghair', "Bid'ah", 'Makruh'], correctAnswer: 'Saghair', explanation: 'Saghair are minor sins; kabair are major sins.' },
    { unitId: unit5.id, externalId: 'cb6b-u5-q6', type: 'FILL_BLANK', questionText: 'A false accusation of immoral conduct against a chaste believing woman is called _______.', options: null, correctAnswer: 'Qadhf', explanation: 'Qadhf (slandering chaste women) is one of the seven major sins.' },
    { unitId: unit5.id, externalId: 'cb6b-u5-q7', type: 'TRUE_FALSE', questionText: 'Minor sins (saghair) are automatically forgiven by performing regular worship like salah.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Regular worship expiates minor sins when major sins are avoided.' },
    // Unit 6 – Key Hadiths
    { unitId: unit6.id, externalId: 'cb6b-u6-q1', type: 'MULTIPLE_CHOICE', questionText: 'According to the hadith, who is the best of people?', options: ['The wealthiest Muslim', 'The one who learns Quran and teaches it', 'The one who prays the most', 'The oldest Muslim'], correctAnswer: 'The one who learns Quran and teaches it', explanation: 'The Prophet said the best person is the one who learns Quran and then teaches it.' },
    { unitId: unit6.id, externalId: 'cb6b-u6-q2', type: 'MULTIPLE_CHOICE', questionText: 'In the hadith, smiling at your brother is described as:', options: ['Sunnah', 'Wajib', 'Sadaqah (charity)', 'Makruh'], correctAnswer: 'Sadaqah (charity)', explanation: 'The Prophet said "Your smile at your brother is charity."' },
    { unitId: unit6.id, externalId: 'cb6b-u6-q3', type: 'TRUE_FALSE', questionText: 'The hadith "Speak good or be silent" means Muslims should always speak.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'The hadith teaches that silence is better than harmful or useless speech.' },
    { unitId: unit6.id, externalId: 'cb6b-u6-q4', type: 'MULTIPLE_CHOICE', questionText: 'What reward is mentioned for visiting the sick?', options: ['The visitor walks in a garden of Paradise until he returns', 'His sins are forgiven', 'He receives 1000 good deeds', 'His prayer is accepted'], correctAnswer: 'The visitor walks in a garden of Paradise until he returns', explanation: 'The hadith in Muslim states the visitor walks in a meadow of Jannah throughout their visit.' },
    { unitId: unit6.id, externalId: 'cb6b-u6-q5', type: 'FILL_BLANK', questionText: 'The hadith principle "Do not harm others and do not allow yourself to be ______" is a foundational rule in Islamic law.', options: null, correctAnswer: 'harmed', explanation: 'This hadith (la darar wa la dirar) establishes removal of harm as a legal principle.' },
    { unitId: unit6.id, externalId: 'cb6b-u6-q6', type: 'TRUE_FALSE', questionText: 'The hadith about visiting the sick is found in the collection of Imam Muslim.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'The hadith on visiting the sick is reported in Muslim.' },
    { unitId: unit6.id, externalId: 'cb6b-u6-q7', type: 'MULTIPLE_CHOICE', questionText: 'Which collection contains "The best of you is the one who learns Quran and teaches it"?', options: ['Tirmidhi', 'Muslim', 'Bukhari', 'Abu Dawud'], correctAnswer: 'Bukhari', explanation: 'This well-known hadith is recorded in Sahih al-Bukhari.' },
    // Unit 7 – Shamail
    { unitId: unit7.id, externalId: 'cb6b-u7-q1', type: 'MULTIPLE_CHOICE', questionText: 'How long was the hair of Rasulullah?', options: ['Down to his shoulders', 'Reaching to his earlobes', 'Very short', 'Below his chin'], correctAnswer: 'Reaching to his earlobes', explanation: 'His hair reached to his earlobes and was sometimes slightly longer.' },
    { unitId: unit7.id, externalId: 'cb6b-u7-q2', type: 'MULTIPLE_CHOICE', questionText: 'The seal of prophethood (khatam al-nubuwwah) was located:', options: ['On his right hand', 'Between his shoulder blades', 'On his forehead', 'On his left arm'], correctAnswer: 'Between his shoulder blades', explanation: 'The seal of prophethood was a raised mark between his blessed shoulder blades.' },
    { unitId: unit7.id, externalId: 'cb6b-u7-q3', type: 'TRUE_FALSE', questionText: 'Rasulullah would sometimes laugh loudly and boisterously.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'He smiled gently (tebassama) but never laughed in an undignified, loud manner.' },
    { unitId: unit7.id, externalId: 'cb6b-u7-q4', type: 'MULTIPLE_CHOICE', questionText: 'Which gift would the Prophet never refuse?', options: ['Money', 'Perfume', 'Food', 'Clothing'], correctAnswer: 'Perfume', explanation: 'It is reported that he would never refuse a gift of perfume.' },
    { unitId: unit7.id, externalId: 'cb6b-u7-q5', type: 'FILL_BLANK', questionText: "The word used to describe the Prophet's gentle smile is _______.", options: null, correctAnswer: 'Tebassama', explanation: 'Tebassama refers to a gentle, closed-mouth smile.' },
    { unitId: unit7.id, externalId: 'cb6b-u7-q6', type: 'TRUE_FALSE', questionText: 'The Prophet was of very tall stature, standing out noticeably in a crowd.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'He was of medium height — neither very tall nor very short.' },
    { unitId: unit7.id, externalId: 'cb6b-u7-q7', type: 'MULTIPLE_CHOICE', questionText: 'When would Rasulullah become angry?', options: ['When personally offended', 'When tired', "Only when Allah's limits were violated", 'When losing a debate'], correctAnswer: "Only when Allah's limits were violated", explanation: 'He never became angry for his own sake — only for the sake of Allah.' },
    // Unit 8 – Abu Bakr
    { unitId: unit8.id, externalId: 'cb6b-u8-q1', type: 'MULTIPLE_CHOICE', questionText: 'Why was Abu Bakr given the title as-Siddiq?', options: ['Because he was the first to accept Islam', 'Because he immediately believed in the Isra wal-Miraj', 'Because he freed enslaved Muslims', 'Because he compiled the Quran'], correctAnswer: 'Because he immediately believed in the Isra wal-Miraj', explanation: 'When others doubted the night journey, Abu Bakr believed instantly, earning him the title as-Siddiq.' },
    { unitId: unit8.id, externalId: 'cb6b-u8-q2', type: 'MULTIPLE_CHOICE', questionText: 'Which enslaved Muslim did Abu Bakr purchase and free?', options: ['Umar ibn al-Khattab', 'Bilal ibn Rabah', 'Ali ibn Abi Talib', 'Zayd ibn Harithah'], correctAnswer: 'Bilal ibn Rabah', explanation: 'Abu Bakr purchased Bilal from his torturer Umayyah ibn Khalaf and freed him.' },
    { unitId: unit8.id, externalId: 'cb6b-u8-q3', type: 'TRUE_FALSE', questionText: 'Abu Bakr was the companion of the Prophet in the cave of Thawr during the hijrah.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'The Quran (9:40) mentions the two of them hiding in a cave with Allah as their protector.' },
    { unitId: unit8.id, externalId: 'cb6b-u8-q4', type: 'MULTIPLE_CHOICE', questionText: "What major achievement during Abu Bakr's caliphate preserved the Quran?", options: ['Building masjids across Arabia', 'Compiling the Quran into a single mushaf', 'Establishing the Islamic calendar', 'Expanding trade routes'], correctAnswer: 'Compiling the Quran into a single mushaf', explanation: 'After many huffaz were martyred in battle, Abu Bakr ordered compilation of the Quran.' },
    { unitId: unit8.id, externalId: 'cb6b-u8-q5', type: 'FILL_BLANK', questionText: "The wars fought by Abu Bakr against those who apostatised after the Prophet's death are called the _______ wars.", options: null, correctAnswer: 'Riddah', explanation: 'The riddah (apostasy) wars reunited the Arabian Peninsula under Muslim leadership.' },
    { unitId: unit8.id, externalId: 'cb6b-u8-q6', type: 'MULTIPLE_CHOICE', questionText: "How long was Abu Bakr's caliphate?", options: ['About 2 years', 'About 10 years', 'About 6 months', 'About 12 years'], correctAnswer: 'About 2 years', explanation: "Abu Bakr's caliphate lasted 632-634 CE, approximately 2 years and 3 months." },
    { unitId: unit8.id, externalId: 'cb6b-u8-q7', type: 'TRUE_FALSE', questionText: 'Abu Bakr was the first adult free man to accept Islam.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Abu Bakr was the first adult free male to accept the message of Islam.' },
    // Unit 9 – Dawud & Sulayman
    { unitId: unit9.id, externalId: 'cb6b-u9-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which divine book was revealed to Prophet Dawud?', options: ['Tawrah', 'Injil', 'Zabur', 'Quran'], correctAnswer: 'Zabur', explanation: 'The Zabur (Psalms) was revealed to Dawud alayhis-salam.' },
    { unitId: unit9.id, externalId: 'cb6b-u9-q2', type: 'MULTIPLE_CHOICE', questionText: 'Who did Dawud kill with a sling?', options: ['Firawn', 'Jalut (Goliath)', 'Haman', 'Qarun'], correctAnswer: 'Jalut (Goliath)', explanation: 'Dawud killed the giant Jalut (Goliath) with a sling.' },
    { unitId: unit9.id, externalId: 'cb6b-u9-q3', type: 'TRUE_FALSE', questionText: 'Sulayman alayhis-salam was the son of Dawud alayhis-salam.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Sulayman was the son of Dawud, both prophets and kings.' },
    { unitId: unit9.id, externalId: 'cb6b-u9-q4', type: 'MULTIPLE_CHOICE', questionText: 'Which bird served as a messenger for Sulayman?', options: ['Eagle', 'Hoopoe (hudhud)', 'Dove', 'Crow'], correctAnswer: 'Hoopoe (hudhud)', explanation: 'The hoopoe (hudhud) brought Sulayman news about the Queen of Saba.' },
    { unitId: unit9.id, externalId: 'cb6b-u9-q5', type: 'FILL_BLANK', questionText: 'The Queen of Saba who came to Sulayman and accepted Islam was named _______.', options: null, correctAnswer: 'Bilqis', explanation: 'Bilqis is the name used in Islamic tradition for the Queen of Sheba.' },
    { unitId: unit9.id, externalId: 'cb6b-u9-q6', type: 'MULTIPLE_CHOICE', questionText: 'What unique miracle was given to Dawud regarding iron?', options: ['He could turn iron into gold', 'Iron softened in his bare hands to make armour', 'He could throw iron like a spear', 'He discovered iron ore'], correctAnswer: 'Iron softened in his bare hands to make armour', explanation: 'Allah made iron pliable for Dawud so he could craft armour without fire or tools.' },
    { unitId: unit9.id, externalId: 'cb6b-u9-q7', type: 'TRUE_FALSE', questionText: 'Sulayman alayhis-salam ordered the building of Masjid al-Aqsa.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Sulayman directed the construction of Masjid al-Aqsa in Jerusalem.' },
    // Unit 10 – Yunus & Umayyads
    { unitId: unit10.id, externalId: 'cb6b-u10-q1', type: 'MULTIPLE_CHOICE', questionText: 'To which city was Prophet Yunus sent?', options: ['Makkah', 'Nineveh', 'Damascus', 'Jerusalem'], correctAnswer: 'Nineveh', explanation: 'Yunus was sent to the people of Nineveh (in modern-day Iraq).' },
    { unitId: unit10.id, externalId: 'cb6b-u10-q2', type: 'FILL_BLANK', questionText: "The dua of Yunus in the belly of the whale begins with La ilaha illa Anta _______ inni kuntu minaz-zalimin.", options: null, correctAnswer: 'subhanaka', explanation: 'This dua is recited when in extreme hardship and is answered by Allah.' },
    { unitId: unit10.id, externalId: 'cb6b-u10-q3', type: 'MULTIPLE_CHOICE', questionText: 'Who founded the Umayyad Caliphate?', options: ['Umar ibn Abd al-Aziz', 'Walid ibn Abd al-Malik', 'Muawiyah ibn Abi Sufyan', 'Yazid ibn Muawiyah'], correctAnswer: 'Muawiyah ibn Abi Sufyan', explanation: 'Muawiyah ibn Abi Sufyan founded the Umayyad Caliphate in 661 CE.' },
    { unitId: unit10.id, externalId: 'cb6b-u10-q4', type: 'MULTIPLE_CHOICE', questionText: 'What was the capital of the Umayyad Caliphate?', options: ['Makkah', 'Madinah', 'Damascus', 'Baghdad'], correctAnswer: 'Damascus', explanation: 'Damascus (in modern Syria) was the political capital of the Umayyad Caliphate.' },
    { unitId: unit10.id, externalId: 'cb6b-u10-q5', type: 'TRUE_FALSE', questionText: 'During the Umayyad period, Islam reached Spain (Andalusia).', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Muslim armies crossed into Spain in 711 CE during the Umayyad Caliphate.' },
    { unitId: unit10.id, externalId: 'cb6b-u10-q6', type: 'MULTIPLE_CHOICE', questionText: 'When did the Umayyad Caliphate end?', options: ['661 CE', '700 CE', '750 CE', '800 CE'], correctAnswer: '750 CE', explanation: 'The Umayyads were overthrown by the Abbasids in 750 CE.' },
    { unitId: unit10.id, externalId: 'cb6b-u10-q7', type: 'TRUE_FALSE', questionText: "Yunus left his people without Allah's permission, which was a mistake.", options: ['True', 'False'], correctAnswer: 'True', explanation: 'This is explicitly mentioned in the Quran — he left in frustration without awaiting divine permission.' },
    // Unit 11 – Ahlus Sunnah
    { unitId: unit11.id, externalId: 'cb6b-u11-q1', type: 'MULTIPLE_CHOICE', questionText: 'Ahlus Sunnah wal-Jamaah follow:', options: ['Quran only', 'Their own reasoning only', "Quran, authentic Sunnah, and the way of the Sahabah", 'The rulings of one madhab only'], correctAnswer: "Quran, authentic Sunnah, and the way of the Sahabah", explanation: 'Ahlus Sunnah follow the Quran, Sunnah, and understanding of the Sahabah.' },
    { unitId: unit11.id, externalId: 'cb6b-u11-q2', type: 'TRUE_FALSE', questionText: 'Following any of the four madhabs is acceptable according to Ahlus Sunnah.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Ahlus Sunnah recognises all four madhabs (Hanafi, Maliki, Shafii, Hanbali) as valid.' },
    { unitId: unit11.id, externalId: 'cb6b-u11-q3', type: 'MULTIPLE_CHOICE', questionText: "Which group denied Allah's attributes using pure rational philosophy?", options: ["Shiah", "Mutazilah", "Khawarij", "Sufis"], correctAnswer: 'Mutazilah', explanation: "The Mutazilah used rationalist philosophy and denied or re-interpreted Allah's attributes." },
    { unitId: unit11.id, externalId: 'cb6b-u11-q4', type: 'MULTIPLE_CHOICE', questionText: "What is bid'ah?", options: ['A type of salah', 'An innovation in acts of worship not based on the Sunnah', 'A correct sunnah practice', 'A form of dhikr'], correctAnswer: 'An innovation in acts of worship not based on the Sunnah', explanation: "Bid'ah in worship has no basis in Quran or Sunnah and is rejected by Ahlus Sunnah." },
    { unitId: unit11.id, externalId: 'cb6b-u11-q5', type: 'FILL_BLANK', questionText: 'The group that declared other Muslims to be disbelievers for committing sins were called the _______.', options: null, correctAnswer: 'Khawarij', explanation: 'The Khawarij excommunicated (made takfir of) Muslims for sins, which Ahlus Sunnah rejects.' },
    { unitId: unit11.id, externalId: 'cb6b-u11-q6', type: 'TRUE_FALSE', questionText: 'Ahlus Sunnah condemn and disrespect certain Sahabah.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Ahlus Sunnah respects ALL Sahabah without exception.' },
    { unitId: unit11.id, externalId: 'cb6b-u11-q7', type: 'MULTIPLE_CHOICE', questionText: "What does Ahlus Sunnah believe about Allah's existence?", options: ['Allah is everywhere physically', "Allah exists above His creation in a manner befitting His Majesty", "Allah cannot be described at all", "Allah is like His creation"], correctAnswer: "Allah exists above His creation in a manner befitting His Majesty", explanation: 'Ahlus Sunnah affirms that Allah is above His creation without resembling it.' },
    // Unit 12 – Prophethood & Miraj
    { unitId: unit12.id, externalId: 'cb6b-u12-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which quality of prophets means they are protected from sin in conveying the message?', options: ['Amanah', 'Tabligh', 'Ismah', 'Fatanah'], correctAnswer: 'Ismah', explanation: 'Ismah (infallibility) means prophets are safeguarded from error in conveying revelation.' },
    { unitId: unit12.id, externalId: 'cb6b-u12-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is a mujizah?', options: ['A miracle given to any righteous person', 'An extraordinary event given to a prophet to prove prophethood', 'A miracle at the hands of a wali', 'A type of dua'], correctAnswer: 'An extraordinary event given to a prophet to prove prophethood', explanation: 'A mujizah is a supernatural event granted to a prophet as proof of his divine appointment.' },
    { unitId: unit12.id, externalId: 'cb6b-u12-q3', type: 'MULTIPLE_CHOICE', questionText: 'During the Isra, where did the Prophet travel to?', options: ['Madinah', 'Masjid al-Aqsa in Jerusalem', 'The seventh heaven', 'Mount Sinai'], correctAnswer: 'Masjid al-Aqsa in Jerusalem', explanation: 'The Isra was the earthly night journey from Makkah to Masjid al-Aqsa in Jerusalem.' },
    { unitId: unit12.id, externalId: 'cb6b-u12-q4', type: 'MULTIPLE_CHOICE', questionText: 'How many daily prayers were originally given at Miraj before reduction?', options: ['10', '20', '50', '100'], correctAnswer: '50', explanation: "Allah initially gave 50 daily prayers; through Musa's advice they were reduced to 5." },
    { unitId: unit12.id, externalId: 'cb6b-u12-q5', type: 'TRUE_FALSE', questionText: 'A karamah is a miracle given to a prophet to prove prophethood.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'A karamah is a miracle given to a wali (friend of Allah), not to prove prophethood.' },
    { unitId: unit12.id, externalId: 'cb6b-u12-q6', type: 'FILL_BLANK', questionText: 'The heavenly creature the Prophet rode during the Isra was called the _______.', options: null, correctAnswer: 'Buraq', explanation: 'The Buraq was a white creature that transported the Prophet during the night journey.' },
    { unitId: unit12.id, externalId: 'cb6b-u12-q7', type: 'MULTIPLE_CHOICE', questionText: "Which prophet's advice helped reduce the daily prayers from 50 to 5?", options: ['Ibrahim', 'Isa', 'Musa', 'Dawud'], correctAnswer: 'Musa', explanation: "Musa advised the Prophet to return repeatedly to Allah to reduce the prayers to a manageable number." },
    // Unit 13 – Spiritual Diseases
    { unitId: unit13.id, externalId: 'cb6b-u13-q1', type: 'MULTIPLE_CHOICE', questionText: 'What does zulm literally mean?', options: ['Placing something where it does not belong', 'Jealousy', 'Pride', 'Laziness'], correctAnswer: 'Placing something where it does not belong', explanation: 'Zulm means putting something in the wrong place — injustice and oppression in its widest sense.' },
    { unitId: unit13.id, externalId: 'cb6b-u13-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is the difference between hasad and gibtah?', options: ['They are the same', 'Hasad wishes the blessing removed; gibtah wants something similar without ill will', 'Gibtah is worse than hasad', 'Hasad is permissible'], correctAnswer: 'Hasad wishes the blessing removed; gibtah wants something similar without ill will', explanation: 'Gibtah (wishing for something similar) is allowed; hasad (wishing loss on another) is forbidden.' },
    { unitId: unit13.id, externalId: 'cb6b-u13-q3', type: 'FILL_BLANK', questionText: 'The Prophet said: "No one with even an atom weight of _______ in his heart will enter Jannah."', options: null, correctAnswer: 'Kibr', explanation: 'This hadith in Muslim highlights the extreme danger of kibr (arrogance/pride).' },
    { unitId: unit13.id, externalId: 'cb6b-u13-q4', type: 'MULTIPLE_CHOICE', questionText: 'Which is NOT a form of zulm on oneself?', options: ['Neglecting salah', 'Consuming haram food', 'Giving charity', 'Not fasting in Ramadan'], correctAnswer: 'Giving charity', explanation: 'Giving charity is an act of worship, not zulm on oneself.' },
    { unitId: unit13.id, externalId: 'cb6b-u13-q5', type: 'TRUE_FALSE', questionText: 'Kibr means thinking yourself better than others and looking down on them.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'This is the precise Islamic definition of kibr: considering oneself superior to others.' },
    { unitId: unit13.id, externalId: 'cb6b-u13-q6', type: 'MULTIPLE_CHOICE', questionText: 'What is one cure for hasad mentioned in Islamic teaching?', options: ['Avoiding the envied person', 'Making dua for the person you envy', 'Telling others about the envy', 'Competing aggressively'], correctAnswer: 'Making dua for the person you envy', explanation: 'Making dua for the person removes the feeling of hasad and earns reward.' },
    { unitId: unit13.id, externalId: 'cb6b-u13-q7', type: 'TRUE_FALSE', questionText: "Zulm on others includes violating their property, honour, and safety.", options: ['True', 'False'], correctAnswer: 'True', explanation: "Any violation of another person's rights constitutes zulm." },
    // Unit 14 – Ghibah & Sunnah
    { unitId: unit14.id, externalId: 'cb6b-u14-q1', type: 'MULTIPLE_CHOICE', questionText: 'What is ghibah (backbiting)?', options: ['Lying about someone', 'Mentioning your Muslim brother in a way he would dislike, even if true', 'Praising someone falsely', 'Arguing with someone'], correctAnswer: 'Mentioning your Muslim brother in a way he would dislike, even if true', explanation: 'Ghibah is mentioning real faults of a person in their absence that they would dislike.' },
    { unitId: unit14.id, externalId: 'cb6b-u14-q2', type: 'MULTIPLE_CHOICE', questionText: 'The Quran compares ghibah to:', options: ['Drinking poison', 'Eating the flesh of your dead brother', "Burning one's own house", 'Wasting wealth'], correctAnswer: 'Eating the flesh of your dead brother', explanation: 'Surah al-Hujurat (49:12) uses this powerful metaphor to show the gravity of backbiting.' },
    { unitId: unit14.id, externalId: 'cb6b-u14-q3', type: 'TRUE_FALSE', questionText: 'Namimah (tale-carrying) is less serious than ghibah.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Namimah can be even more serious as it actively sows division between people.' },
    { unitId: unit14.id, externalId: 'cb6b-u14-q4', type: 'MULTIPLE_CHOICE', questionText: "In which situation is it permissible to mention someone's fault?", options: ['When venting to a friend', 'When warning others about a dishonest person to protect them', 'When the person is not present', 'When you dislike them'], correctAnswer: 'When warning others about a dishonest person to protect them', explanation: 'Warning against genuine harm is permissible and can be an obligation.' },
    { unitId: unit14.id, externalId: 'cb6b-u14-q5', type: 'FILL_BLANK', questionText: 'The Prophet said: "Whoever revives a sunnah will receive the reward of all those who _______ it."', options: null, correctAnswer: 'act upon', explanation: 'Reviving a forgotten sunnah earns ongoing reward equal to all who follow that sunnah.' },
    { unitId: unit14.id, externalId: 'cb6b-u14-q6', type: 'TRUE_FALSE', questionText: 'Ghibah is only backbiting if what you say is false.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Ghibah applies even if the statement is TRUE — the defining factor is that the person would dislike it.' },
    { unitId: unit14.id, externalId: 'cb6b-u14-q7', type: 'MULTIPLE_CHOICE', questionText: 'What is namimah?', options: ['Praising someone excessively', 'Carrying words between people to create conflict', 'Ghibah about a non-Muslim', 'Forgetting a sunnah'], correctAnswer: 'Carrying words between people to create conflict', explanation: 'Namimah is the act of tale-carrying — stirring up enmity between people.' },
    // Unit 15 – Modesty & Hygiene
    { unitId: unit15.id, externalId: 'cb6b-u15-q1', type: 'MULTIPLE_CHOICE', questionText: 'What is the awrah for a Muslim male?', options: ['From chest to knee', 'From navel to knee', 'The entire body', 'Only private parts'], correctAnswer: 'From navel to knee', explanation: 'The awrah for men is from the navel to the knee, which must always be covered.' },
    { unitId: unit15.id, externalId: 'cb6b-u15-q2', type: 'TRUE_FALSE', questionText: 'Muslim men are forbidden from wearing silk.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Wearing pure silk is haram (forbidden) for men, though permissible for women.' },
    { unitId: unit15.id, externalId: 'cb6b-u15-q3', type: 'MULTIPLE_CHOICE', questionText: 'How many acts are listed in the Sunan al-Fitrah?', options: ['3', '5', '7', '10'], correctAnswer: '7', explanation: 'Seven Sunan al-Fitrah: circumcision, nail clipping, trimming moustache, beard, armpit/pubic hair removal, miswak.' },
    { unitId: unit15.id, externalId: 'cb6b-u15-q4', type: 'MULTIPLE_CHOICE', questionText: 'Within how many days should the Sunan al-Fitrah be attended to?', options: ['7 days', '14 days', '30 days', '40 days'], correctAnswer: '40 days', explanation: 'The Sunnah is to attend to these acts of personal hygiene at least every 40 days.' },
    { unitId: unit15.id, externalId: 'cb6b-u15-q5', type: 'TRUE_FALSE', questionText: "The sunnah colour for men's clothes is white.", options: ['True', 'False'], correctAnswer: 'True', explanation: 'The Prophet loved white clothing and recommended it for men.' },
    { unitId: unit15.id, externalId: 'cb6b-u15-q6', type: 'FILL_BLANK', questionText: 'A Muslim man wearing his garment below his ankles out of arrogance is called _______.', options: null, correctAnswer: 'Isbal', explanation: 'Isbal refers to letting garments fall below the ankles; it is haram if done out of pride.' },
    { unitId: unit15.id, externalId: 'cb6b-u15-q7', type: 'MULTIPLE_CHOICE', questionText: 'Which of the following is a Sunnah al-Fitrah?', options: ['Wearing green clothes', 'Using miswak', 'Reciting Quran daily', 'Performing tahajjud'], correctAnswer: 'Using miswak', explanation: 'Using the miswak (tooth-stick) is one of the seven Sunan al-Fitrah.' },
    // Unit 16 – Adhan, Eid & Jumuah Etiquette
    { unitId: unit16.id, externalId: 'cb6b-u16-q1', type: 'MULTIPLE_CHOICE', questionText: 'What do you say when you hear Hayya alal-falah in the adhan?', options: ['Hayya alal-falah', 'Allahu Akbar', 'La hawla wala quwwata illa billah', 'Sadaqta'], correctAnswer: 'La hawla wala quwwata illa billah', explanation: 'For both hayya phrases in adhan, the listener responds with La hawla wala quwwata illa billah.' },
    { unitId: unit16.id, externalId: 'cb6b-u16-q2', type: 'MULTIPLE_CHOICE', questionText: 'On Eid al-Fitr, what should you do BEFORE the salah?', options: ['Fast until the prayer', 'Eat something (preferably dates)', 'Perform extra salah', 'Give a speech'], correctAnswer: 'Eat something (preferably dates)', explanation: 'Eating before Eid al-Fitr salah is sunnah, signifying the end of Ramadan fasting.' },
    { unitId: unit16.id, externalId: 'cb6b-u16-q3', type: 'TRUE_FALSE', questionText: 'On Eid al-Adha, you should eat before going to the salah.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'For Eid al-Adha, the sunnah is NOT to eat until after the prayer and the sacrifice.' },
    { unitId: unit16.id, externalId: 'cb6b-u16-q4', type: 'MULTIPLE_CHOICE', questionText: 'What is the special time of dua acceptance on Friday?', options: ['Fajr time', 'After Jumuah salah', 'The last hour before Maghrib', 'Midnight on Thursday'], correctAnswer: 'The last hour before Maghrib', explanation: 'The Prophet described a special hour on Friday — generally identified as the last hour before Maghrib.' },
    { unitId: unit16.id, externalId: 'cb6b-u16-q5', type: 'TRUE_FALSE', questionText: 'It is sunnah to take a different route to and from the Eid ground.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'The Prophet would go by one route and return by another on Eid days.' },
    { unitId: unit16.id, externalId: 'cb6b-u16-q6', type: 'FILL_BLANK', questionText: 'The sunnah act of oral hygiene performed on Jumuah as preparation is using the _______.', options: null, correctAnswer: 'Miswak', explanation: 'Using the miswak before Jumuah salah is a recommended sunnah of preparation.' },
    { unitId: unit16.id, externalId: 'cb6b-u16-q7', type: 'MULTIPLE_CHOICE', questionText: 'Listening to the Jumuah khutbah in silence is:', options: ['Sunnah muakkadah', 'Wajib', 'Nafilah', 'Mandub'], correctAnswer: 'Wajib', explanation: 'It is wajib to listen to the khutbah silently.' },
  ];

  for (const q of quizData) {
    await prisma.question.upsert({
      where: { externalId: q.externalId },
      create: {
        externalId: q.externalId,
        unitId: q.unitId,
        type: q.type as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK',
        questionText: q.questionText,
        options: q.options ? JSON.stringify(q.options) : null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
      update: {
        questionText: q.questionText,
        options: q.options ? JSON.stringify(q.options) : null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
    });
  }

  // ── FLASHCARDS ────────────────────────────────────────────────────
  const flashcardData: { unitId: string; front: string; back: string }[] = [
    { unitId: unit1.id, front: 'Tahir Mutahhir', back: 'Pure and purifying water — valid for wudu and ghusl (e.g. rain, river, well water)' },
    { unitId: unit1.id, front: 'Najasah Ghaliza', back: 'Heavy impurity (e.g. human urine, stool, flowing blood) — requires thorough washing' },
    { unitId: unit1.id, front: 'Najasah Khafifah', back: 'Light impurity (e.g. urine of halal animals) — excused if less than one quarter of the garment' },
    { unitId: unit2.id, front: 'Bulugh', back: 'Islamic legal maturity — marked by ihtilam, pubic hair, or reaching 15 lunar years' },
    { unitId: unit2.id, front: 'Faraid of Ghusl', back: 'Three obligatory acts: rinsing the mouth (madmadah), rinsing nostrils (istinshaq), washing the full body' },
    { unitId: unit3.id, front: 'Janazah Salah', back: 'Funeral prayer — 4 takbirs, no ruku or sujud; fard al-kifayah' },
    { unitId: unit3.id, front: 'Wajib (in salah)', back: 'Obligatory acts in salah whose omission requires a compensatory prostration (sajdat al-sahw)' },
    { unitId: unit4.id, front: "Jumuah", back: "Friday congregational prayer — 2 rakaats after 2 khutbahs; fard ayn on resident adult sane free males" },
    { unitId: unit4.id, front: 'Iqamah', back: 'Second call to prayer signalling salah is about to begin; adds Qad qamatissalah twice' },
    { unitId: unit5.id, front: 'Kabair', back: 'Major sins — acts explicitly threatened with punishment in Quran/Sunnah; require sincere tawbah' },
    { unitId: unit5.id, front: 'Riba', back: 'Interest or usury — one of the seven major sins; strictly forbidden in the Quran' },
    { unitId: unit7.id, front: 'Shamail', back: 'The noble physical and moral characteristics of Rasulullah as described in hadith' },
    { unitId: unit7.id, front: 'Khatam al-Nubuwwah', back: "Seal of Prophethood — a raised mark between the Prophet's shoulder blades, size of a pigeon's egg" },
    { unitId: unit8.id, front: 'As-Siddiq', back: 'The Truthful — title of Abu Bakr for his immediate belief in the Isra wal-Miraj' },
    { unitId: unit9.id, front: 'Zabur', back: 'Divine scripture (Psalms) revealed to Prophet Dawud alayhis-salam' },
    { unitId: unit10.id, front: 'Dua of Yunus', back: 'La ilaha illa Anta subhanaka inni kuntu minaz-zalimin — recited in the belly of the whale' },
    { unitId: unit11.id, front: 'Ahlus Sunnah wal-Jamaah', back: 'Muslims who follow Quran, authentic Sunnah, and the way of the Sahabah; the mainstream body of Islam' },
    { unitId: unit12.id, front: 'Ismah', back: 'Infallibility — quality of prophets being protected from sin and error in conveying revelation' },
    { unitId: unit12.id, front: 'Mujizah', back: "Miracle granted to a prophet to prove his prophethood; breaks natural laws by Allah's permission" },
    { unitId: unit12.id, front: 'Al-Isra wal-Miraj', back: 'Night Journey: Isra = Makkah to Jerusalem; Miraj = ascent through 7 heavens; gift of 5 daily prayers' },
    { unitId: unit13.id, front: 'Hasad', back: 'Envy — wishing a blessing is removed from another; forbidden in Islam' },
    { unitId: unit13.id, front: 'Gibtah', back: "Permissible — wishing for something similar to another's blessing without wishing they lose it" },
    { unitId: unit13.id, front: 'Kibr', back: "Arrogance/pride — even an atom's weight in the heart prevents entry into Jannah (Muslim)" },
    { unitId: unit14.id, front: 'Ghibah', back: "Backbiting — mentioning someone in a way they would dislike, even if true; compared to eating a dead brother's flesh" },
    { unitId: unit14.id, front: 'Namimah', back: 'Tale-carrying — taking speech between people to create conflict and enmity' },
    { unitId: unit15.id, front: "Awrah (Men)", back: 'The area from navel to knee that must always be covered for Muslim males' },
    { unitId: unit15.id, front: 'Sunan al-Fitrah', back: 'Natural acts of hygiene: circumcision, nail clipping, moustache trimming, beard, armpit/pubic hair removal, miswak' },
    { unitId: unit16.id, front: "Eid al-Fitr Sunan", back: 'Ghusl, clean clothes, eat dates before salah, take different routes, make takbirs' },
  ];

  const flashUnitIds = [...new Set(flashcardData.map(f => f.unitId))];
  for (const uid of flashUnitIds) {
    await prisma.flashCard.deleteMany({ where: { unitId: uid } });
  }
  for (const fc of flashcardData) {
    const unitItems = flashcardData.filter(f => f.unitId === fc.unitId);
    const orderIndex = unitItems.indexOf(fc) + 1;
    await prisma.flashCard.create({
      data: {
        unitId: fc.unitId,
        courseId: course.id,
        front: fc.front,
        back: fc.back,
        category: 'Vocabulary',
        tags: ['maktab-6b'],
        orderIndex,
      },
    });
  }

  // ── ARABIC TERMS ──────────────────────────────────────────────────
  const arabicTermData: { unitId: string; arabicText: string; transliteration: string; translation: string }[] = [
    { unitId: unit1.id, arabicText: '\u0637\u0627\u0647\u0631 \u0645\u0637\u0647\u0631', transliteration: 'Tahir Mutahhir', translation: 'Pure and purifying — valid for ritual purification (wudu and ghusl)' },
    { unitId: unit1.id, arabicText: '\u0646\u062c\u0627\u0633\u0629 \u063a\u0644\u064a\u0638\u0629', transliteration: 'Najasah Ghaliza', translation: 'Heavy impurity — human urine, stool, flowing blood' },
    { unitId: unit2.id, arabicText: '\u0628\u0644\u0648\u063a', transliteration: 'Bulugh', translation: 'Reaching Islamic legal maturity' },
    { unitId: unit2.id, arabicText: '\u0627\u062d\u062a\u0644\u0627\u0645', transliteration: 'Ihtilam', translation: 'Wet dream — a sign of maturity for boys' },
    { unitId: unit3.id, arabicText: '\u0635\u0644\u0627\u0629 \u0627\u0644\u062c\u0646\u0627\u0632\u0629', transliteration: 'Salat al-Janazah', translation: 'Funeral prayer — 4 takbirs, fard al-kifayah' },
    { unitId: unit4.id, arabicText: '\u0635\u0644\u0627\u0629 \u0627\u0644\u062c\u0645\u0639\u0629', transliteration: 'Salat al-Jumuah', translation: 'Friday congregational prayer' },
    { unitId: unit5.id, arabicText: '\u0627\u0644\u0643\u0628\u0627\u0626\u0631', transliteration: 'Al-Kabair', translation: 'The major sins' },
    { unitId: unit5.id, arabicText: '\u0627\u0644\u0631\u0628\u0627', transliteration: 'Al-Riba', translation: 'Interest or usury — one of the seven major sins' },
    { unitId: unit7.id, arabicText: '\u0634\u0645\u0627\u0626\u0644', transliteration: 'Shamail', translation: 'Noble physical and moral characteristics of the Prophet' },
    { unitId: unit8.id, arabicText: '\u0627\u0644\u0635\u062f\u0651\u064a\u0642', transliteration: 'As-Siddiq', translation: 'The Truthful — title of Abu Bakr' },
    { unitId: unit10.id, arabicText: '\u0644\u0627 \u0625\u0644\u0647 \u0625\u0644\u0651\u0627 \u0623\u0646\u062a \u0633\u0628\u062d\u0627\u0646\u0643 \u0625\u0646\u064a \u0643\u0646\u062a \u0645\u0646 \u0627\u0644\u0638\u0651\u0627\u0644\u0645\u064a\u0646', transliteration: 'La ilaha illa Anta subhanaka inni kuntu minaz-zalimin', translation: 'Dua of Yunus — There is no god but You; Glory be to You; I was among the wrongdoers' },
    { unitId: unit12.id, arabicText: '\u0645\u0639\u062c\u0632\u0629', transliteration: 'Mujizah', translation: 'Miracle granted to a prophet to prove prophethood' },
    { unitId: unit12.id, arabicText: '\u0639\u0635\u0645\u0629', transliteration: 'Ismah', translation: 'Infallibility — prophets are protected from error in conveying the message' },
    { unitId: unit12.id, arabicText: '\u0627\u0644\u0625\u0633\u0631\u0627\u0621 \u0648\u0627\u0644\u0645\u0639\u0631\u0627\u062c', transliteration: 'Al-Isra wal-Miraj', translation: 'The Night Journey and Ascent — gift of the 5 daily prayers' },
    { unitId: unit13.id, arabicText: '\u062d\u0633\u062f', transliteration: 'Hasad', translation: 'Envy — wishing a blessing is removed from another; forbidden' },
    { unitId: unit13.id, arabicText: '\u0643\u0628\u0631', transliteration: 'Kibr', translation: 'Arrogance/pride — even an atom prevents entry into Jannah' },
    { unitId: unit14.id, arabicText: '\u063a\u064a\u0628\u0629', transliteration: 'Ghibah', translation: 'Backbiting — mentioning someone in a way they would dislike, even if true' },
    { unitId: unit15.id, arabicText: '\u0633\u0646\u0646 \u0627\u0644\u0641\u0637\u0631\u0629', transliteration: 'Sunan al-Fitrah', translation: 'Natural acts of personal cleanliness prescribed by the Sunnah' },
  ];

  const termUnitIds = [...new Set(arabicTermData.map(t => t.unitId))];
  for (const uid of termUnitIds) {
    await prisma.arabicTerm.deleteMany({ where: { unitId: uid } });
  }
  for (const term of arabicTermData) {
    await prisma.arabicTerm.create({
      data: {
        unitId: term.unitId,
        arabicText: term.arabicText,
        transliteration: term.transliteration,
        translation: term.translation,
      },
    });
  }

  console.log('\u2705 CB6 Boys seed complete:');
  console.log('   Units: 16');
  console.log('   Questions: ' + quizData.length);
  console.log('   Flashcards: ' + flashcardData.length);
  console.log('   Arabic Terms: ' + arabicTermData.length);
}

async function main() {
  try {
    await seedMaktabCoursebook6Boys();
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch(e => { console.error(e); process.exit(1); });
}
