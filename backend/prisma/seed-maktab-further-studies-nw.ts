import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedMaktabFurtherStudiesNW() {
  console.log('\uD83D\uDCDA Starting An Nasihah Further Studies (North West) seed...');
  console.log('');

  const course = await prisma.course.upsert({
    where: { slug: 'maktab-further-studies-nw' },
    create: {
      slug: 'maktab-further-studies-nw',
      title: 'An Nasihah Further Studies (North West)',
      description: 'Advanced Islamic studies for ages 14 and above, covering aq\u0101\u02BFid, fiqh, personal development, and contemporary issues. Produced by An Nasihah Publications for the North West maktab network.',
      category: 'FIQH',
      ageLevels: ['TEEN', 'ADULT'],
      isPublished: true,
    },
    update: {
      title: 'An Nasihah Further Studies (North West)',
      description: 'Advanced Islamic studies for ages 14 and above, covering aq\u0101\u02BFid, fiqh, personal development, and contemporary issues. Produced by An Nasihah Publications for the North West maktab network.',
      category: 'FIQH',
      ageLevels: ['TEEN', 'ADULT'],
      isPublished: true,
    },
  });
  console.log('\u2705 Created course:', course.title);

  // Cleanup: Remove old 9-unit structure
  const oldSlugs = [
    'maktab-fs-essentials-1', 'maktab-fs-essentials-2', 'maktab-fs-faith',
    'maktab-fs-devotional', 'maktab-fs-identity', 'maktab-fs-living',
    'maktab-fs-money', 'maktab-fs-contemporary', 'maktab-fs-hadith',
  ];
  for (const slug of oldSlugs) {
    const old = await prisma.unit.findFirst({ where: { courseId: course.id, slug } });
    if (old) {
      await prisma.question.deleteMany({ where: { unitId: old.id } });
      await prisma.unitProgress.deleteMany({ where: { unitId: old.id } });
      await prisma.unit.delete({ where: { id: old.id } });
    }
  }

  // ══════════════════════════════════════════════
  // UNIT 1: Essentials — Core ʿAqīdah
  // ══════════════════════════════════════════════

  const content1 = `
<h2>Learning Objectives</h2>
<p>Articulate the six articles of faith, explain rational proofs for Allah's existence, and describe what the Shahadatayn demands of a believer.</p>

<h2>The Six Articles of Faith (Arkan al-Iman)</h2>
<ol>
  <li><strong>Allah:</strong> His existence, absolute oneness (tawhid), and essential attributes. He is self-existent, uncreated, and eternal.</li>
  <li><strong>Angels:</strong> Created from light; sinless and obedient, each with specific duties — Jibril (revelation), Mika'il (provisions), Israfil (the trumpet), Izra'il (taking souls).</li>
  <li><strong>Divine Books:</strong> The Tawrah, Injil, Zabur, Suhuf of Ibrahim, and the Quran — the final, preserved, universal revelation.</li>
  <li><strong>Prophets:</strong> Human, truthful, protected from major sin. Muhammad \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 is the Seal of the Prophets.</li>
  <li><strong>The Last Day:</strong> Death, resurrection, judgment, and eternal life in Jannah or Jahannam.</li>
  <li><strong>Qadar:</strong> Allah's pre-eternal knowledge and will encompass all things. Human choice and accountability remain real.</li>
</ol>

<h2>Rational Proofs for Allah's Existence</h2>
<h3>Cosmological Argument</h3>
<p>Every contingent thing requires a cause. The universe began; it is contingent. Therefore it has a necessary, uncaused, self-existent cause — Allah. The Quran asks: <em>"Were they created by nothing, or are they the creators?"</em> (52:35)</p>
<h3>Teleological (Design) Argument</h3>
<p>The complexity and precision of creation — DNA, fine-tuned physical constants, the human eye — points to a wise, purposeful Creator. The Quran invites reflection: <em>"Do they not look at the camels, how they are created?"</em> (88:17)</p>
<h3>Fitrah Argument</h3>
<p>Every person is born with an innate disposition (fitrah) that inclines toward recognising a Creator. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: <em>"Every child is born upon the fitrah."</em> (Bukhari)</p>

<h2>Addressing "Who Created Allah?"</h2>
<p>This question misapplies the principle of causation. Causation applies only to contingent (created) things. Allah is <em>wajib al-wujud</em> — necessarily existent, not contingent. He is uncreated by definition. Asking who created Allah is a category error.</p>

<h2>The Shahadatayn</h2>
<p><strong>La ilaha illallah:</strong> Negates all false objects of worship and affirms Allah alone as worthy of worship and complete obedience. <strong>Muhammadun rasulullah:</strong> Affirms Muhammad \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 as the final messenger whose message must be accepted and Sunnah followed.</p>
`.trim();

  const unit1 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-essentials-aqidah' } },
    create: {
      slug: 'maktab-fs-essentials-aqidah',
      courseId: course.id,
      orderIndex: 1,
      title: 'Essentials \u2013 Core \u02BFAq\u012Bdah',
      description: 'The six articles of faith, rational proofs for Allah\'s existence, and what the Sh\u0101h\u0101datayn demands of a believer.',
      content: content1,
    },
    update: {
      title: 'Essentials \u2013 Core \u02BFAq\u012Bdah',
      description: 'The six articles of faith, rational proofs for Allah\'s existence, and what the Sh\u0101h\u0101datayn demands of a believer.',
      content: content1,
    },
  });
  console.log('\u2705 Unit 1:', unit1.title);

  // ══════════════════════════════════════════════
  // UNIT 2: Essentials — Ṭahārah (Purification)
  // ══════════════════════════════════════════════

  const content2 = `
<h2>Learning Objectives</h2>
<p>Classify types of water, describe the complete method of wudu', ghusl, and tayammum, identify najasah categories, and explain the conditions for masah on leather socks.</p>

<h2>Types of Water</h2>
<ul>
  <li><strong>Tahir mutahhir (pure and purifying):</strong> Natural water (rain, well, river, sea). Valid for wudu' and removing najasah.</li>
  <li><strong>Tahir (pure but not purifying):</strong> Water that has been used for wudu', or fruit juice. May be drunk but not used for taharah.</li>
  <li><strong>Najis (impure):</strong> Water contaminated by najasah. Cannot be used for any form of taharah.</li>
</ul>

<h2>Wudu' — Complete Review</h2>
<h3>Fara'id (4 obligatory acts)</h3>
<ol>
  <li>Washing the face (from hairline to chin, ear to ear)</li>
  <li>Washing both arms including the elbows</li>
  <li>Wiping at least one quarter of the head (masah)</li>
  <li>Washing both feet including the ankles</li>
</ol>
<h3>Key Sunan:</h3> Bismillah at the start, niyyah (intention), washing each limb three times, beginning from the right, khilal (passing fingers between toes and beard).
<h3>Nawaqid (nullifiers):</h3> Passing wind or stool/urine, deep sleep (lying/reclining), loss of consciousness, laughing aloud during salah, flowing blood or pus that spreads.

<h2>Ghusl — Obligatory Occasions and Method</h2>
<h3>Occasions requiring ghusl:</h3> Janabah (sexual discharge — wet dream or marital relations), cessation of hayd (menstruation), cessation of nifas (post-natal bleeding), upon accepting Islam.
<h3>Fara'id of ghusl (3):</h3> (1) Rinsing the mouth (madmadah), (2) sniffing water into the nostrils (istinshaq), (3) washing the entire body so no dry spot remains.

<h2>Tayammum</h2>
<p>Dry ablution using clean earth as a substitute for wudu' or ghusl when water is unavailable, insufficient, or medically harmful. Method: niyyah → strike clean earth once → wipe the face → wipe both arms to the elbows.</p>

<h2>Najasah — Categories and Removal</h2>
<ul>
  <li><strong>Najasah ghalizah (major):</strong> Blood, urine, stool, wine. Removed by washing until trace disappears.</li>
  <li><strong>Najasah khafifah (minor):</strong> Sprinkled urine of a halal animal. Excuse if less than a quarter of the surface.</li>
</ul>

<h2>Masah 'alal Khuffayn (Wiping on Leather Socks)</h2>
<p>Permissible if: socks were worn while in wudu', cover the ankles, and have no holes large enough to expose a quarter. Duration: resident — 1 day/night; traveller — 3 days/nights. Wipe the top of the foot only.</p>
`.trim();

  const unit2 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-essentials-tahara' } },
    create: {
      slug: 'maktab-fs-essentials-tahara',
      courseId: course.id,
      orderIndex: 2,
      title: 'Essentials \u2013 \u1E6Cah\u0101rah & Purification',
      description: 'Complete review of Islamic purification: types of water, wud\u016B\u02BE, ghusl, tayammum, najasah categories, and mas\u0101\u1E25 on leather socks.',
      content: content2,
    },
    update: {
      title: 'Essentials \u2013 \u1E6Cah\u0101rah & Purification',
      description: 'Complete review of Islamic purification: types of water, wud\u016B\u02BE, ghusl, tayammum, najasah categories, and mas\u0101\u1E25 on leather socks.',
      content: content2,
    },
  });
  console.log('\u2705 Unit 2:', unit2.title);

  // ══════════════════════════════════════════════
  // UNIT 3: Essentials — Ṣalāh (Comprehensive Review)
  // ══════════════════════════════════════════════

  const content3 = `
<h2>Learning Objectives</h2>
<p>Distinguish fara'id, wajibat, and sunan of salah; identify what invalidates prayer; explain sajdah as-sahw, qada', and the rulings for travellers and the sick.</p>

<h2>Fara'id of Salah (7 obligatory acts)</h2>
<ol>
  <li><strong>Takbir al-tahrima</strong> — the opening "Allahu Akbar" which enters one into salah</li>
  <li><strong>Qiyam</strong> — standing upright (for those able)</li>
  <li><strong>Qira'ah</strong> — recitation of Quranic verses</li>
  <li><strong>Ruku'</strong> — bowing</li>
  <li><strong>Sujud</strong> — two prostrations per rak'ah</li>
  <li><strong>Qa'dah akhirah</strong> — the final sitting for the duration of tashahhud</li>
  <li><strong>Khuruj bi-sun'ih</strong> — exiting salah by one's own deliberate act (taslim)</li>
</ol>

<h2>Key Wajibat</h2>
<p>All wajibat of salah include: reciting al-Fatiha in every rak'ah, adding a surah in the first two rak'at of fard, saying Allahu Akbar for each posture change, reciting tashahhud in qa'dah ula, performing each ruku' and sujud with itminan (stillness), taslim at the end. Intentional omission of a wajib invalidates salah; inadvertent omission is remedied by sajdah as-sahw.</p>

<h2>Nawaqid (What Invalidates Salah)</h2>
<ul>
  <li>Speaking (even a single word) deliberately</li>
  <li>Laughing aloud (this also breaks wudu')</li>
  <li>Eating or drinking</li>
  <li>Exposing awrah (1/4 of an area)</li>
  <li>Turning one's chest away from qiblah</li>
  <li>Wudu' breaking during salah</li>
  <li>Making excessive movement (three steps without need)</li>
</ul>

<h2>Sajdah as-Sahw (Prostration of Forgetfulness)</h2>
<p>Performed when a wajib is inadvertently omitted or delayed. Method: after the final tashahhud, make taslim to the right only, then perform two sujud, then sit and complete taslim to both sides.</p>

<h2>Qada' (Making Up Missed Prayers)</h2>
<p>Missing a fard salah is a serious sin; it remains a debt until made up. When making up, state the intention specifically: "I am praying the qada' of Fajr of [day]." Sunan rawatib are not made up with qada'.</p>

<h2>Qasr (Shortening) for Travellers</h2>
<p>The four-rak'ah fard prayers (Zuhr, Asr, Isha) are shortened to two rak'at. Conditions: journey of at least 77 km (48 miles) in a lawful direction; not yet returned to hometown. Jumu'ah and Fajr are not shortened.</p>

<h2>Salah for the Sick</h2>
<p>The sick pray sitting if unable to stand, and lying on their side if unable to sit. They indicate ruku' and sujud by lowering their head. Salah is never dropped for the conscious Muslim.</p>
`.trim();

  const unit3 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-essentials-salah' } },
    create: {
      slug: 'maktab-fs-essentials-salah',
      courseId: course.id,
      orderIndex: 3,
      title: 'Essentials \u2013 \u1E62al\u0101h (Comprehensive Review)',
      description: 'Far\u0101\u02BFi\u1E0D, w\u0101jib\u0101t, sunan, and naw\u0101qi\u1E0D of \u1E63al\u0101h; sajdah as-sahw; qad\u0101\u02BE; qasr for travellers; \u1E63al\u0101h for the sick.',
      content: content3,
    },
    update: {
      title: 'Essentials \u2013 \u1E62al\u0101h (Comprehensive Review)',
      description: 'Far\u0101\u02BFi\u1E0D, w\u0101jib\u0101t, sunan, and naw\u0101qi\u1E0D of \u1E63al\u0101h; sajdah as-sahw; qad\u0101\u02BE; qasr for travellers; \u1E63al\u0101h for the sick.',
      content: content3,
    },
  });
  console.log('\u2705 Unit 3:', unit3.title);
  // ══════════════════════════════════════════════
  // UNIT 4: Essentials — Duʿāʾ & Islamic Calendar
  // ══════════════════════════════════════════════

  const content4 = `
<h2>Learning Objectives</h2>
<p>Understand the etiquette of du'a', identify times when du'a' is most accepted, name the twelve Islamic months in order, and recall the significance of key dates.</p>

<h2>Du'a' — Supplication</h2>
<h3>Etiquette of Du'a'</h3>
<ul>
  <li>Face the qiblah and raise both hands</li>
  <li>Begin with praise of Allah (hamd) and salawat upon the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645</li>
  <li>Ask with conviction (the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "None of you should say 'if You will' — ask firmly.")</li>
  <li>End with amin</li>
  <li>Wipe the face with both hands at the end</li>
</ul>
<h3>Times When Du'a' is Most Accepted</h3>
<ul>
  <li>The last third of the night (tahajjud time) — Allah descends (in a manner befitting His majesty) asking who is calling</li>
  <li>Between the adhan and iqamah</li>
  <li>The last hour of Friday (after 'Asr until Maghrib)</li>
  <li>While prostrating in salah ("the servant is closest to Allah in sujud")</li>
  <li>When fasting — at the time of breaking fast</li>
  <li>On the day of 'Arafah (9th Dhul Hijjah)</li>
  <li>During rain</li>
</ul>

<h2>The Islamic Hijri Calendar</h2>
<p>The Islamic calendar is lunar — each month begins with the new crescent moon and has 29 or 30 days. The year has 12 months (354/355 days).</p>
<h3>The 12 Months in Order</h3>
<ol>
  <li><strong>Muharram</strong> — sacred month; 10th is 'Ashura' (Musa \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645 was saved; recommended to fast)</li>
  <li>Safar</li>
  <li>Rabi' al-Awwal — birth of the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 (12th)</li>
  <li>Rabi' al-Thani</li>
  <li>Jumada al-Ula</li>
  <li>Jumada al-Akhirah</li>
  <li><strong>Rajab</strong> — sacred; 27th is the night of Isra' and Mi'raj</li>
  <li>Sha'ban — Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 would fast much of this month</li>
  <li><strong>Ramadan</strong> — month of fasting; the Quran was revealed; Laylat al-Qadr in last 10 nights</li>
  <li>Shawwal — 1st is Eid al-Fitr; 6 voluntary fasts</li>
  <li>Dhul Qa'dah — sacred month</li>
  <li><strong>Dhul Hijjah</strong> — Hajj; 10th is 'Eid al-Adha; first 10 days are among the most virtuous of the year</li>
</ol>
`.trim();

  const unit4 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-essentials-dua-calendar' } },
    create: {
      slug: 'maktab-fs-essentials-dua-calendar',
      courseId: course.id,
      orderIndex: 4,
      title: 'Essentials \u2013 Du\u02BF\u0101\u02BE & the Islamic Calendar',
      description: 'Etiquette and accepted times of du\u02BF\u0101\u02BE; the twelve months of the Islamic Hijri calendar and their significant events.',
      content: content4,
    },
    update: {
      title: 'Essentials \u2013 Du\u02BF\u0101\u02BE & the Islamic Calendar',
      description: 'Etiquette and accepted times of du\u02BF\u0101\u02BE; the twelve months of the Islamic Hijri calendar and their significant events.',
      content: content4,
    },
  });
  console.log('\u2705 Unit 4:', unit4.title);

  // ══════════════════════════════════════════════
  // UNIT 5: Faith — Attributes of Allāh
  // ══════════════════════════════════════════════

  const content5 = `
<h2>Learning Objectives</h2>
<p>Name and explain the six essential attributes of Allah, list the seven sifat al-ma'ani, address Islamic theodicy, and understand how Islamic theology responds to questions about Allah's nature.</p>

<h2>The Six Essential Attributes (Sifat Dhatiyyah)</h2>
<p>These are attributes that cannot be negated from Allah even hypothetically:</p>
<ol>
  <li><strong>Wujud</strong> — existence: Allah exists necessarily; non-existence is impossible for Him</li>
  <li><strong>Qidam</strong> — pre-eternity: Allah has no beginning; He existed before all creation</li>
  <li><strong>Baqa'</strong> — everlastingness: Allah has no end; He will never cease to exist</li>
  <li><strong>Qiyam binafsih</strong> — self-subsistence: Allah is completely independent; He needs nothing and no one</li>
  <li><strong>Wahdaniyyah</strong> — oneness: Allah is absolutely unique — one in essence, attributes, and acts</li>
  <li><strong>Mukhalafah lil-hawadith</strong> — difference from creation: Allah is unlike anything created. "There is nothing like Him." (42:11)</li>
</ol>

<h2>The Seven Sifat al-Ma'ani (Attributes of Meaning)</h2>
<p>These are positive attributes that Allah necessarily possesses:</p>
<ol>
  <li><strong>Hayah</strong> — life (Allah is eternally living)</li>
  <li><strong>'Ilm</strong> — knowledge (Allah knows all things, past, present, and future)</li>
  <li><strong>Qudrah</strong> — power (Allah has infinite power over all things)</li>
  <li><strong>Iradah</strong> — will (everything that exists does so by Allah's will)</li>
  <li><strong>Sam'</strong> — hearing (Allah hears all things without organs or limitations)</li>
  <li><strong>Basar</strong> — sight (Allah sees all things without organs or limitations)</li>
  <li><strong>Kalam</strong> — speech (Allah speaks, but not through sound or letters — the Quran is His eternal speech)</li>
</ol>

<h2>Islamic Theodicy: Suffering and Evil</h2>
<p>If Allah is all-good and all-powerful, why does suffering exist? Islam's response:</p>
<ul>
  <li>Suffering tests and purifies believers: <em>"We will certainly test you with some fear and hunger..."</em> (2:155)</li>
  <li>Human evil stems from human free will, not divine intention</li>
  <li>Allah's wisdom (hikmah) surpasses human comprehension — what appears harmful may serve greater good</li>
  <li>Suffering in this world is temporary; justice is perfected in the Hereafter</li>
  <li>Patience in difficulty earns immense reward: <em>"Indeed, the patient will be given their reward without account."</em> (39:10)</li>
</ul>
`.trim();

  const unit5 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-faith-attributes' } },
    create: {
      slug: 'maktab-fs-faith-attributes',
      courseId: course.id,
      orderIndex: 5,
      title: 'Faith \u2013 Attributes of All\u0101h',
      description: 'The six essential attributes (sif\u0101t dh\u0101tiyyah), the seven sif\u0101t al-ma\u02BE\u0101n\u012B, and Islamic theodicy (suffering, evil, and All\u0101h\'s wisdom).',
      content: content5,
    },
    update: {
      title: 'Faith \u2013 Attributes of All\u0101h',
      description: 'The six essential attributes (sif\u0101t dh\u0101tiyyah), the seven sif\u0101t al-ma\u02BE\u0101n\u012B, and Islamic theodicy (suffering, evil, and All\u0101h\'s wisdom).',
      content: content5,
    },
  });
  console.log('\u2705 Unit 5:', unit5.title);

  // ══════════════════════════════════════════════
  // UNIT 6: Faith — Prophethood & the Qurʾān
  // ══════════════════════════════════════════════

  const content6 = `
<h2>Learning Objectives</h2>
<p>Articulate multiple proofs of Muhammad's \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 prophethood and explain what makes the Quran a linguistic and historical miracle.</p>

<h2>Proofs of Muhammad's \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 Prophethood</h2>
<h3>1. Character and Personal Integrity</h3>
<p>Even enemies acknowledged his honesty. He gained nothing worldly — he died without wealth, having freed slaves, distributed all his possessions, and lived in extreme simplicity. Why fabricate a message that brought him persecution, exile, and war?</p>
<h3>2. Fulfilled Prophecies</h3>
<p><strong>Rome vs Persia:</strong> When Persia defeated Rome, the Arabs assumed Islam would be defeated too. The Quran (30:1-4) prophesied Rome would defeat Persia "within a few years" — precisely fulfilled at the Battle of Issus (628 CE), when the Quran's revelation was still fresh.</p>
<p>Other prophecies: the spread of Islam to Persia, Rome, and the entire Arabian Peninsula; the conquest of Constantinople; the emergence of specific types of social corruption.</p>
<h3>3. Preserved Historical Accuracy</h3>
<p>The Quran describes events from the distant past (pharaoh's body preserved — confirmed archaeologically) and makes no scientific or historical errors, despite being revealed in 7th-century Arabia.</p>

<h2>The Quran as Divine Miracle (I'jaz al-Quran)</h2>
<h3>Linguistic Inimitability</h3>
<p>The Quran challenged the Arabs — masters of poetry — to produce even one chapter like it (2:23). They were unable to, despite their mastery of Arabic. 1,400 years later, the challenge remains unmet.</p>
<h3>Perfect Preservation</h3>
<p>The Quran was memorised and written under the Prophet's \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 supervision. Today, millions of huffaz preserve every word from memory. No other book has been preserved this way. Allah promised: <em>"Indeed, We have sent down the Reminder and We will preserve it."</em> (15:9)</p>
<h3>Internal Consistency</h3>
<p>"Had it been from other than Allah, they would have found in it many contradictions." (4:82) Despite covering law, theology, history, ethics, and science, there is no internal contradiction.</p>
<h3>Universal and Timeless Message</h3>
<p>Unlike previous revelations addressed to specific nations, the Quran's message is explicitly addressed to all humanity for all time.</p>
`.trim();

  const unit6 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-faith-prophethood-quran' } },
    create: {
      slug: 'maktab-fs-faith-prophethood-quran',
      courseId: course.id,
      orderIndex: 6,
      title: 'Faith \u2013 Prophethood & the Qur\u02BF\u0101n',
      description: 'Proofs of Muhammad\'s \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 prophethood; the linguistic miracle of the Qur\u02BF\u0101n, its preservation, and the fulfilled prophecy of Rome vs Persia.',
      content: content6,
    },
    update: {
      title: 'Faith \u2013 Prophethood & the Qur\u02BF\u0101n',
      description: 'Proofs of Muhammad\'s \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 prophethood; the linguistic miracle of the Qur\u02BF\u0101n, its preservation, and the fulfilled prophecy of Rome vs Persia.',
      content: content6,
    },
  });
  console.log('\u2705 Unit 6:', unit6.title);
  // ══════════════════════════════════════════════
  // UNIT 7: Faith — The Search for Truth
  // ══════════════════════════════════════════════

  const content7 = `
<h2>Learning Objectives</h2>
<p>Understand how Islam encourages intellectual inquiry, respond confidently to common doubts about Islam, and know the correct approach when you have questions about faith.</p>

<h2>Islam and the Intellect</h2>
<p>The Quran uses the phrase <em>"afala ta'qilun"</em> ("will you not reason?") and related forms over 50 times. Islam does not ask for blind faith — it invites deep reflection:</p>
<ul>
  <li>"Travel through the land and observe how He began creation." (29:20)</li>
  <li>"Do they not reflect on the Quran, or are there locks upon their hearts?" (47:24)</li>
</ul>
<p>Early Islamic civilization produced the world's greatest scientists, philosophers, and scholars — ibn al-Haytham, al-Biruni, ibn Rushd — precisely because Islamic epistemology valued both revelation and rational inquiry.</p>

<h2>Responding to Common Doubts</h2>
<h3>Religion vs Science</h3>
<p>Modern science operates within the material world and cannot, by its own methodology, either prove or disprove the existence of Allah (a non-material reality). The vast majority of Islamic scholars have not seen a conflict between science and Islamic theology. Many scientific discoveries (the Big Bang, fine-tuning of the universe) are actually consistent with Islamic teaching.</p>
<h3>Islam and Modernity</h3>
<p>Islamic principles are universal and timeless. Muslim scholars (ulama) have applied Islamic legal principles (ijtihad) to every new situation for 1,400 years. The question is not whether Islam is "compatible" with modernity, but which aspects of modernity are compatible with Islamic principles.</p>
<h3>Free Will</h3>
<p>Islam affirms human free will and moral responsibility alongside Allah's complete knowledge and power (see Unit 1 on qadar). The two are not mutually exclusive — Allah's pre-eternal knowledge of your choice does not force that choice.</p>

<h2>When You Have Doubts</h2>
<ol>
  <li><strong>Seek knowledge</strong> — doubts arise from ignorance, not intelligence. The solution is more knowledge, not less faith.</li>
  <li><strong>Consult reliable scholars (ulama)</strong> — not random internet sources. Go to those with deep, traditional Islamic learning.</li>
  <li><strong>Continue worship</strong> — do not abandon practice because of intellectual doubts. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "If Shaytan whispers doubts, say 'I believe in Allah.'"</li>
  <li><strong>Remember fitrah</strong> — your innate nature already knows the truth. Doubts are externally introduced; certainty is your original state.</li>
</ol>
<h3>Rule about doubts in worship:</h3>
<p>If you doubt whether you completed a wudu', assume you did (default to the last certain state). Doubts do not require you to repeat worship unless you are certain of an error.</p>
`.trim();

  const unit7 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-faith-search-truth' } },
    create: {
      slug: 'maktab-fs-faith-search-truth',
      courseId: course.id,
      orderIndex: 7,
      title: 'Faith \u2013 The Search for Truth',
      description: 'How Islam encourages intellectual inquiry; responding to common doubts (religion and science, free will, modernity); what to do when you have questions about faith.',
      content: content7,
    },
    update: {
      title: 'Faith \u2013 The Search for Truth',
      description: 'How Islam encourages intellectual inquiry; responding to common doubts (religion and science, free will, modernity); what to do when you have questions about faith.',
      content: content7,
    },
  });
  console.log('\u2705 Unit 7:', unit7.title);

  // ══════════════════════════════════════════════
  // UNIT 8: Devotion — Deepening Ṣalāh
  // ══════════════════════════════════════════════

  const content8 = `
<h2>Learning Objectives</h2>
<p>Understand the full meaning of key salah phrases, describe khushu' and how to cultivate it, name voluntary prayers and their times, and recall the conditions for qasr.</p>

<h2>What You Are Saying in Salah</h2>
<table border="1" cellpadding="6" style="border-collapse:collapse;width:100%">
  <tr><th>Phrase</th><th>Meaning</th></tr>
  <tr><td>Allahu Akbar (tahrima)</td><td>Allah is greater (than everything in this world and my mind)</td></tr>
  <tr><td>Subhanakallahumma wa bihamdik... (thana')</td><td>Glory and praise be to You; blessed is Your name; exalted is Your majesty; there is no god but You</td></tr>
  <tr><td>Al-Fatiha verse 5: Iyyaka na'budu wa iyyaka nasta'in</td><td>You alone we worship; You alone we ask for help</td></tr>
  <tr><td>Subhana rabbiyal 'azim (ruku')</td><td>Glorified is my Lord, the Magnificent</td></tr>
  <tr><td>Subhana rabbiyal a'la (sujud)</td><td>Glorified is my Lord, the Most High</td></tr>
  <tr><td>Attahiyyatu lillahi... (tashahhud)</td><td>All verbal, physical, and financial acts of worship are for Allah. Peace and mercy of Allah be upon you, O Prophet...</td></tr>
</table>

<h2>Khushu' — The Heart of Salah</h2>
<p>Khushu' means humble, focused presence of heart: knowing you are standing before Allah, the King of Kings. The Quran praises "those who are humble in their prayers" (23:2) as the first characteristic of successful believers.</p>
<h3>How to Develop Khushu':</h3>
<ul>
  <li>Learn and reflect on the meaning of every phrase you recite</li>
  <li>Minimise distractions — face a blank wall, silence devices, begin with two rak'at nafl to prepare</li>
  <li>Begin salah with the intention: "I am standing before Allah right now"</li>
  <li>Slow down — do not rush through postures. Pause in ruku' and sujud.</li>
  <li>Make personal du'a' in sujud — the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "The servant is closest to Allah when prostrating."</li>
</ul>

<h2>Voluntary Prayers (Nawafil)</h2>
<ul>
  <li><strong>Tahajjud (Qiyam al-Layl):</strong> After midnight; 2-12 rak'at. The most virtuous voluntary prayer after Fard.</li>
  <li><strong>Ishraq:</strong> 15 minutes after sunrise; 2-4 rak'at. Reward equivalent to accepted Hajj and Umrah (Tirmidhi).</li>
  <li><strong>Duha (Chast):</strong> Mid-morning when sun is high; 2-12 rak'at.</li>
  <li><strong>Awwabin:</strong> After Maghrib; 6 rak'at.</li>
</ul>

<h2>Qasr — Shortening Prayer for Travellers</h2>
<p>Conditions for qasr: (1) journey of at least 77 km (approx. 48 miles) in one direction, (2) in a lawful cause, (3) the traveller has not yet arrived at their destination or stayed for 15+ days. Only Zuhr, Asr, and Isha are shortened (4 to 2 rak'at). Fajr and Maghrib are not shortened.</p>
`.trim();

  const unit8 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-devotion-salah-depth' } },
    create: {
      slug: 'maktab-fs-devotion-salah-depth',
      courseId: course.id,
      orderIndex: 8,
      title: 'Devotion \u2013 Deepening \u1E62al\u0101h (Khush\u016B\u02BC & Understanding)',
      description: 'Full meaning of \u1E63al\u0101h phrases, developing khush\u016B\u02BC, voluntary prayers (tahajjud, ishr\u0101q, \u1E0Du\u1E25\u0101), and qasr for travellers.',
      content: content8,
    },
    update: {
      title: 'Devotion \u2013 Deepening \u1E62al\u0101h (Khush\u016B\u02BC & Understanding)',
      description: 'Full meaning of \u1E63al\u0101h phrases, developing khush\u016B\u02BC, voluntary prayers (tahajjud, ishr\u0101q, \u1E0Du\u1E25\u0101), and qasr for travellers.',
      content: content8,
    },
  });
  console.log('\u2705 Unit 8:', unit8.title);

  // ══════════════════════════════════════════════
  // UNIT 9: Devotion — Jumuʿah, Ṣawm & Ḥajj (Spiritual Dimensions)
  // ══════════════════════════════════════════════

  const content9 = `
<h2>Learning Objectives</h2>
<p>Articulate the spiritual dimensions of Jumu'ah, voluntary fasting, and Hajj; describe how to make Friday transformative; and explain the spiritual meaning of each Hajj station.</p>

<h2>Jumu'ah — Making Friday Transformative</h2>
<p>Jumu'ah is not merely a weekly obligation — it is a day of spiritual renewal. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "The best day upon which the sun rises is Friday." Practical actions:</p>
<ul>
  <li>Recite Surah al-Kahf (special light between two Fridays — hadith)</li>
  <li>Send abundant salawat upon the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645</li>
  <li>Make du'a' in the last hour before Maghrib — the accepted hour</li>
  <li>Perform ghusl, wear clean clothes, and apply fragrance</li>
  <li>Arrive early, pray tahiyyat al-masjid, avoid talking during the khutbah</li>
</ul>

<h2>Voluntary Fasting — Its Spiritual Power</h2>
<ul>
  <li><strong>6 Days of Shawwal:</strong> After Ramadan. Reward: as if fasting the entire year (Ramadan = 10 months; 6 Shawwal = 2 months).</li>
  <li><strong>'Ashura' (10 Muharram):</strong> Expiation for the previous year's minor sins. Fast the 9th and 10th (to differ from the Jews' fast).</li>
  <li><strong>Mondays and Thursdays:</strong> The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 fasted regularly on these days — deeds are presented to Allah then.</li>
  <li><strong>9th Dhul Hijjah ('Arafah):</strong> Expiation for two years' sins (for non-pilgrims).</li>
</ul>

<h2>Hajj — Spiritual Stations</h2>
<ul>
  <li><strong>Ihram:</strong> Donning two white sheets — renouncing worldly distinctions (wealth, status, nationality). You are just a servant before Allah.</li>
  <li><strong>Tawaf:</strong> Orbiting the Ka'bah seven times — as angels orbit the Throne; as the heart should revolve around Allah.</li>
  <li><strong>Sa'i:</strong> Walking between Safa and Marwah — commemorating Hajar's trust in Allah. When everything material was gone, she sought, and Allah provided.</li>
  <li><strong>Wuquf at 'Arafah:</strong> The Day of Mercy. Standing in the plain, all distinctions dissolved, beseeching Allah — the closest thing on earth to the gathering of Yawm al-Qiyamah. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: <em>"Hajj is 'Arafah."</em></li>
  <li><strong>Rami al-Jamarat:</strong> Throwing pebbles — symbolically rejecting Shaytan's whispers as Ibrahim \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645 did.</li>
  <li><strong>Sacrifice:</strong> Commemorating Ibrahim's \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645 willingness to sacrifice what he loved most for Allah.</li>
</ul>
`.trim();

  const unit9 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-devotion-jumuah-sawm-hajj' } },
    create: {
      slug: 'maktab-fs-devotion-jumuah-sawm-hajj',
      courseId: course.id,
      orderIndex: 9,
      title: 'Devotion \u2013 Jumu\u02BFah, \u1E62awm & \u1E24ajj (Spiritual Dimensions)',
      description: 'Spiritual significance of Friday (Jumu\u02BFah); voluntary fasting (6 Shaww\u0101l, \u02BF\u0100sh\u016Br\u0101\u02BE, \u02BFArafah); and the spiritual meaning of every \u1E24ajj station.',
      content: content9,
    },
    update: {
      title: 'Devotion \u2013 Jumu\u02BFah, \u1E62awm & \u1E24ajj (Spiritual Dimensions)',
      description: 'Spiritual significance of Friday (Jumu\u02BFah); voluntary fasting (6 Shaww\u0101l, \u02BF\u0100sh\u016Br\u0101\u02BE, \u02BFArafah); and the spiritual meaning of every \u1E24ajj station.',
      content: content9,
    },
  });
  console.log('\u2705 Unit 9:', unit9.title);
  // ══════════════════════════════════════════════
  // UNIT 10: Identity — Being a Believer
  // ══════════════════════════════════════════════

  const content10 = `
<h2>Learning Objectives</h2>
<p>Identify the characteristics of believers from Surah al-Mu'minun 1-11, correctly use daily Islamic expressions, and understand how faith permeates every moment of a Muslim's life.</p>

<h2>Characteristics of Believers — Surah al-Mu'minun (23:1-11)</h2>
<p>Allah declares: <em>"Certainly the believers have succeeded"</em> — then lists who they are:</p>
<ol>
  <li><strong>Khushu' in salah</strong> — humble and focused presence of heart in prayer</li>
  <li><strong>Avoiding laghw (idle speech)</strong> — keeping away from pointless talk, entertainment, and activities</li>
  <li><strong>Performing zakah</strong> — giving purifying charity</li>
  <li><strong>Guarding chastity</strong> — except with spouses; this includes guarding the eyes, avoiding pornography and temptation</li>
  <li><strong>Keeping trusts and promises</strong> — amana: being a person of your word in all transactions</li>
  <li><strong>Maintaining salah (prayers)</strong> — consistently performing all five prayers</li>
</ol>
<p>The surah closes: <em>"Those are the inheritors who will inherit Paradise — and they will abide therein eternally."</em></p>

<h2>Daily Expressions of Faith</h2>
<table border="1" cellpadding="6" style="border-collapse:collapse;width:100%">
  <tr><th>Expression</th><th>Arabic</th><th>Meaning</th><th>When to Use</th></tr>
  <tr><td>Bismillah</td><td>\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0647\u0650</td><td>In the name of Allah</td><td>Beginning any action (eating, drinking, writing, driving)</td></tr>
  <tr><td>Alhamdulillah</td><td>\u0627\u0644\u062D\u0645\u062F\u0644\u0644\u0647</td><td>All praise belongs to Allah</td><td>After completing actions, when good or bad things happen, when sneezing</td></tr>
  <tr><td>InshAllah</td><td>\u0625\u0646\u0652 \u0634\u064E\u0627\u0621\u064E \u0627\u0644\u0644\u0647\u064F</td><td>If Allah wills</td><td>When stating intention to do something in the future — Quran commands this (18:23-24)</td></tr>
  <tr><td>SubhanAllah</td><td>\u0633\u0628\u062D\u0627\u0646 \u0627\u0644\u0644\u0647</td><td>Glory be to Allah</td><td>When seeing something amazing, beautiful, or alarming</td></tr>
  <tr><td>Astaghfirullah</td><td>\u0623\u0633\u062A\u063A\u0641\u0631 \u0627\u0644\u0644\u0647</td><td>I seek Allah's forgiveness</td><td>After remembering a sin; frequently throughout the day</td></tr>
  <tr><td>Inna lillahi wa inna ilayhi raji'un</td><td>\u0625\u0646\u0651\u064E\u0627 \u0644\u0644\u0647\u0650 \u0648\u0625\u0646\u0651\u064E\u0627 \u0625\u0644\u064A\u0647\u0650 \u0631\u064E\u0627\u062C\u0650\u0639\u0648\u0646</td><td>Indeed we belong to Allah and to Him we shall return</td><td>Upon hearing of a death or any loss</td></tr>
</table>
<p><strong>Important:</strong> "InshAllah" is not an excuse to avoid commitment. It is a statement of theological humility — acknowledging that your plans depend on Allah's permission. Using it to be vague or non-committal is a misuse.</p>
`.trim();

  const unit10 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-identity-believer' } },
    create: {
      slug: 'maktab-fs-identity-believer',
      courseId: course.id,
      orderIndex: 10,
      title: 'Identity \u2013 Being a Believer',
      description: 'Characteristics of believers from S\u016Brah al-Mu\u02BEmin\u016Bn (23:1\u201311); daily Islamic expressions of faith (Bismillah, Alhamdulillah, InshAllah) and their correct usage.',
      content: content10,
    },
    update: {
      title: 'Identity \u2013 Being a Believer',
      description: 'Characteristics of believers from S\u016Brah al-Mu\u02BEmin\u016Bn (23:1\u201311); daily Islamic expressions of faith (Bismillah, Alhamdulillah, InshAllah) and their correct usage.',
      content: content10,
    },
  });
  console.log('\u2705 Unit 10:', unit10.title);

  // ══════════════════════════════════════════════
  // UNIT 11: Identity — Self-Reformation & Mental Health
  // ══════════════════════════════════════════════

  const content11 = `
<h2>Learning Objectives</h2>
<p>Explain the four stages of tazkiyah al-nafs, understand the Islamic approach to mental health, and identify practical coping strategies rooted in Islamic teaching.</p>

<h2>Tazkiyah al-Nafs — Purification of the Soul</h2>
<p>Tazkiyah means spiritual purification — the ongoing process of cleansing the heart from vices (hasad, kibr, riya') and cultivating virtues (tawadu', shukr, tawakkul). The Quran says: <em>"Successful indeed is the one who purifies it."</em> (91:9)</p>
<h3>The Four Stages</h3>
<ol>
  <li><strong>Tawbah (Repentance):</strong> The foundation. Turning sincerely from sin to Allah with remorse and firm resolve not to return. Allah says: "Turn to Allah in sincere repentance." (66:8)</li>
  <li><strong>Muraqabah (Awareness):</strong> Constant consciousness of being watched by Allah. "He knows the treachery of the eyes and what the hearts conceal." (40:19) Living every moment as if you see Allah — and knowing that He sees you (ihsan).</li>
  <li><strong>Muhasabah (Self-Accounting):</strong> Daily review: Where did I obey Allah today? Where did I fall short? The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "The intelligent one is he who evaluates himself and works for what comes after death."</li>
  <li><strong>Mujahada (Striving):</strong> Actively fighting against the nafs (lower desires). "And those who strive for Us — We will surely guide them to Our paths." (29:69) This includes giving up sins, fasting voluntarily, and taking on acts of worship that require effort.</li>
</ol>

<h2>Islam and Mental Health</h2>
<h3>Depression and Anxiety Are Not Signs of Weak Faith</h3>
<p>The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 himself experienced profound grief (the Year of Sorrow after the deaths of Khadijah and Abu Talib). Prophets like Yunus and Ayyub \u0639\u0644\u064A\u0647\u0645 \u0627\u0644\u0633\u0644\u0627\u0645 experienced intense distress. These are human experiences, not signs of poor faith.</p>
<h3>Islamic Coping Strategies</h3>
<ul>
  <li><strong>Dhikr:</strong> "Truly, in the remembrance of Allah do hearts find rest." (13:28) Regular tasbih, istighfar, and morning/evening adhkar stabilise the soul.</li>
  <li><strong>Salah:</strong> The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Let us find rest in salah, O Bilal." Prayer interrupts anxiety cycles.</li>
  <li><strong>Community:</strong> Islam forbids isolation — visiting others, maintaining ties, and being part of a jama'ah are spiritually therapeutic.</li>
  <li><strong>Exercise, sleep, and nutrition:</strong> The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 encouraged physical activity, moderate eating, and adequate sleep.</li>
  <li><strong>Professional help:</strong> Seeking counselling or therapy is NOT un-Islamic. It is using the means Allah has provided. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Seek medicine — Allah has not created an illness without a cure."</li>
</ul>
`.trim();

  const unit11 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-identity-self-reform' } },
    create: {
      slug: 'maktab-fs-identity-self-reform',
      courseId: course.id,
      orderIndex: 11,
      title: 'Identity \u2013 Self-Reformation & Mental Health',
      description: 'The four stages of tazkiyah al-nafs (tawbah, mur\u0101qabah, mu\u1E25\u0101sabah, muj\u0101hadah); Islamic approach to depression and anxiety; practical coping strategies.',
      content: content11,
    },
    update: {
      title: 'Identity \u2013 Self-Reformation & Mental Health',
      description: 'The four stages of tazkiyah al-nafs (tawbah, mur\u0101qabah, mu\u1E25\u0101sabah, muj\u0101hadah); Islamic approach to depression and anxiety; practical coping strategies.',
      content: content11,
    },
  });
  console.log('\u2705 Unit 11:', unit11.title);

  // ══════════════════════════════════════════════
  // UNIT 12: Identity — The Prophetic Example in Modern Life
  // ══════════════════════════════════════════════

  const content12 = `
<h2>Learning Objectives</h2>
<p>Articulate the concept of ittiba' al-Sunnah as love for the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645, describe key morning/evening adhkar, and identify social sunan to revive in daily life.</p>

<h2>Ittiba' al-Sunnah — Following as an Expression of Love</h2>
<p>Allah says: <em>"Say (O Muhammad): If you love Allah, then follow me — Allah will love you and forgive your sins."</em> (3:31)</p>
<p>Following the Sunnah is not mere ritual compliance — it is the practical expression of love for the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645. Every sunnah revived earns divine love. Reviving a forgotten sunnah earns the reward of a hundred martyrs (hadith).</p>

<h2>Morning and Evening Adhkar</h2>
<p>The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 taught specific athkar for morning (after Fajr) and evening (after 'Asr). Key ones:</p>
<ul>
  <li>"Allahumma bika asbahna wa bika amsayna..." (we begin the day with You)</li>
  <li>Ayat al-Kursi (morning and evening — guard against harm)</li>
  <li>"Subhanallahi wa bihamdihi" x100 — sins forgiven even if like sea foam (Bukhari)</li>
  <li>The three Quls (x3 each) — protection</li>
  <li>Sayyid al-Istighfar — the master prayer for forgiveness</li>
</ul>

<h2>Eating and Sleeping Sunan</h2>
<ul>
  <li>Begin eating with Bismillah; eat with the right hand; from the front of the plate</li>
  <li>Do not blow on food; do not eat while standing (discouraged)</li>
  <li>Sleep on the right side; recite the sleeping du'a' (Bismika Allahumma amutu wa ahya)</li>
  <li>Perform wudu' before sleeping; do not sleep on your stomach</li>
</ul>

<h2>Social Sunan</h2>
<ul>
  <li><strong>Greeting:</strong> Give the full salam to fellow Muslims; the rider gives salam to the pedestrian; the younger to the elder</li>
  <li><strong>Visiting the sick:</strong> One of the six rights of a Muslim upon another. Pray for them: "La ba'sa tahurun insha'Allah."</li>
  <li><strong>Following the janazah:</strong> "Whoever follows a janazah until the prayer is completed earns one qirat (of reward)." (Bukhari)</li>
  <li><strong>Feeding others:</strong> "The best of you is he who feeds others." Gifts, shared meals, and hospitality strengthen ummah bonds.</li>
</ul>

<h2>One Sunnah to Adopt This Week</h2>
<p>The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "The most beloved deeds to Allah are those done consistently, even if small." Choose one sunnah — morning adhkar, eating sunnah, greeting with full salam — and make it a habit.</p>
`.trim();

  const unit12 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-identity-prophetic-example' } },
    create: {
      slug: 'maktab-fs-identity-prophetic-example',
      courseId: course.id,
      orderIndex: 12,
      title: 'Identity \u2013 The Prophetic Example in Modern Life',
      description: 'Ittiب\u0101\u02BC al-Sunnah as love for the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645; morning/evening adh\u0101\u0643ar; eating and sleeping sunan; social sunan to revive.',
      content: content12,
    },
    update: {
      title: 'Identity \u2013 The Prophetic Example in Modern Life',
      description: 'Ittiب\u0101\u02BC al-Sunnah as love for the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645; morning/evening adh\u0101\u0643ar; eating and sleeping sunan; social sunan to revive.',
      content: content12,
    },
  });
  console.log('\u2705 Unit 12:', unit12.title);
  // ══════════════════════════════════════════════
  // UNIT 13: Living — Muslim Contributions & Global Ummah
  // ══════════════════════════════════════════════

  const content13 = `
<h2>Learning Objectives</h2>
<p>Identify key Muslim contributions to science, medicine, and civilisation; understand the diversity of the global Muslim ummah; and appreciate Islamic civilisation's legacy.</p>

<h2>Muslim Contributions to Civilisation</h2>
<h3>Mathematics and Science</h3>
<ul>
  <li><strong>Al-Khwarizmi (780-850 CE):</strong> Father of algebra. His book "al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala" gave us the word "algebra." The word "algorithm" derives from his name. He also advanced trigonometry and the decimal system.</li>
  <li><strong>Ibn al-Haytham (965-1040 CE):</strong> Father of modern optics. Proved that vision works by light entering the eye (not rays leaving it). His seven-volume "Book of Optics" shaped Western science for 500 years.</li>
  <li><strong>Al-Biruni (973-1048 CE):</strong> Calculated the Earth's circumference with remarkable accuracy in the 11th century.</li>
</ul>
<h3>Medicine</h3>
<ul>
  <li><strong>Ibn Sina (Avicenna, 980-1037 CE):</strong> "The Canon of Medicine" — the standard medical textbook in European universities for 600 years. He described the contagious nature of disease 800 years before germ theory.</li>
  <li>Muslim physicians established the world's first hospitals with paid doctors, pharmacies, and mental health wards — in Cairo (872 CE) and Baghdad.</li>
</ul>
<h3>Other Contributions</h3>
<ul>
  <li><strong>Al-Qarawiyyin, Fez (859 CE):</strong> The world's oldest continuously operating university, founded by Fatima al-Fihri.</li>
  <li><strong>Coffee:</strong> First cultivated and popularised in Yemen. Yemeni Sufis used it to stay awake for night prayers; coffee houses spread to Makkah, then the Ottoman Empire, then Europe.</li>
  <li><strong>Surgical instruments:</strong> Al-Zahrawi (936-1013 CE) invented over 200 surgical instruments still used in modified form today.</li>
</ul>

<h2>The Global Muslim Ummah</h2>
<p>There are approximately 1.9 billion Muslims worldwide — nearly 25% of humanity. The ummah is strikingly diverse:</p>
<ul>
  <li><strong>Indonesia:</strong> World's largest Muslim population (~240m) — not Arab, but among the most devout</li>
  <li><strong>Pakistan, Bangladesh:</strong> South Asian Islam with rich scholarly traditions</li>
  <li><strong>Nigeria, Senegal, Mali:</strong> West African Islam — ancient traditions, universities in Timbuktu</li>
  <li><strong>UK, USA, France:</strong> Significant Muslim minorities shaping their societies</li>
  <li><strong>Central Asia:</strong> Islamic culture predating the Mongol invasions</li>
</ul>
<p>The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 described the ummah as "one body — when one part suffers, the rest responds with fever and sleeplessness." (Muslim) Unity amid diversity is the hallmark of Islam.</p>
`.trim();

  const unit13 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-living-contributions' } },
    create: {
      slug: 'maktab-fs-living-contributions',
      courseId: course.id,
      orderIndex: 13,
      title: 'Living \u2013 Muslim Contributions & Global Ummah',
      description: 'Muslim contributions to algebra, medicine, optics, and university education; al-Qarawiyyin; the diversity of the global Muslim ummah.',
      content: content13,
    },
    update: {
      title: 'Living \u2013 Muslim Contributions & Global Ummah',
      description: 'Muslim contributions to algebra, medicine, optics, and university education; al-Qarawiyyin; the diversity of the global Muslim ummah.',
      content: content13,
    },
  });
  console.log('\u2705 Unit 13:', unit13.title);

  // ══════════════════════════════════════════════
  // UNIT 14: Living — Family, Marriage & Death
  // ══════════════════════════════════════════════

  const content14 = `
<h2>Learning Objectives</h2>
<p>Define the mutual rights of family members, describe the conditions of valid nikah, explain what walimah is, and understand the Islamic approach to preparing for death and supporting the bereaved.</p>

<h2>Family Rights</h2>
<h3>Rights of Parents</h3>
<p>The Quran links obedience to parents directly to worship of Allah: <em>"Your Lord has decreed that you worship none but Him, and be good to parents."</em> (17:23) Specific duties: never say "uff" (any word of contempt), speak respectfully, obey in lawful matters, care for them in old age, make du'a' for them (in life and after death).</p>
<h3>Rights of Spouses</h3>
<p>The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: <em>"The best of you is the best to his family, and I am the best to my family."</em> (Tirmidhi) Husband's duties: financial provision (nafaqah), kind treatment, intimacy. Wife's duties: managing the home, guarding chastity, cooperating in mutual respect.</p>
<h3>Rights of Children</h3>
<p>Providing education (Islamic and worldly), love and affection, fairness between all children (never favouring one), and facilitating good marriages for them.</p>

<h2>Marriage — Sunnah and Conditions</h2>
<h3>Conditions for Valid Nikah</h3>
<ol>
  <li>Offer (ijab) and acceptance (qabul) — clear verbal agreement</li>
  <li>Two Muslim witnesses ('adil)</li>
  <li>Wali (male guardian of the bride) — required in most schools</li>
  <li>Mahr (dowry) — a gift from husband to wife, hers exclusively</li>
</ol>
<p><strong>Walimah:</strong> The wedding feast after nikah. It is sunnah mu'akkadah (strongly recommended) and should be attended when invited.</p>

<h2>Preparing for Death</h2>
<ul>
  <li>Write a wasiyyah (Islamic will) stating how your estate is to be distributed</li>
  <li>Settle all debts — the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 refused to lead janazah prayer for one with unpaid debts</li>
  <li>Seek forgiveness from those you have wronged</li>
  <li>Make your du'a' for your family and ensure they know important matters</li>
</ul>

<h2>Bereavement — Supporting Those Who Grieve</h2>
<ul>
  <li>Visiting the bereaved is a right of a Muslim upon another</li>
  <li>The period of mourning for a general person is three days. Widows observe iddah — four months and ten days — during which they remain at home and do not remarry.</li>
  <li>Wailing (niyahah), tearing clothes, or striking one's face are prohibited</li>
  <li>It is permissible and encouraged to cry and to say Inna lillahi wa inna ilayhi raji'un</li>
</ul>
`.trim();

  const unit14 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-living-family-marriage' } },
    create: {
      slug: 'maktab-fs-living-family-marriage',
      courseId: course.id,
      orderIndex: 14,
      title: 'Living \u2013 Family, Marriage & Death',
      description: 'Rights of parents, spouses, and children; conditions of nik\u0101\u1E25 and wal\u012Bmah; Islamic guidance on preparing for death, was\u012Byyah, and bereavement.',
      content: content14,
    },
    update: {
      title: 'Living \u2013 Family, Marriage & Death',
      description: 'Rights of parents, spouses, and children; conditions of nik\u0101\u1E25 and wal\u012Bmah; Islamic guidance on preparing for death, was\u012Byyah, and bereavement.',
      content: content14,
    },
  });
  console.log('\u2705 Unit 14:', unit14.title);

  // ══════════════════════════════════════════════
  // UNIT 15: Living — Community, Masjid & Free-Mixing
  // ══════════════════════════════════════════════

  const content15 = `
<h2>Learning Objectives</h2>
<p>Identify the multiple roles of the masjid, list community duties, explain the Islamic ruling on free-mixing (ikhtilat), and describe how to interact professionally in a Shariah-compliant way.</p>

<h2>The Masjid — Beyond Ritual Prayer</h2>
<p>The masjid in Islamic tradition is the centre of community life, not merely a place of prayer:</p>
<ul>
  <li><strong>Worship:</strong> The five daily prayers, Jumu'ah, Tarawih, I'tikaf</li>
  <li><strong>Education:</strong> Madrasah, halaqas, Islamic classes</li>
  <li><strong>Community welfare:</strong> Supporting the poor, mediating disputes, coordinating community responses</li>
  <li><strong>Political and civic consultation:</strong> The first masjid (Masjid Quba) served all these roles under the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645</li>
</ul>
<h3>Etiquette of the Masjid</h3>
<p>Enter with right foot saying Bismillah and the du'a' of entry; pray tahiyyat al-masjid (two rak'at greeting sunnah) on arrival; lower voice; keep clean; leave with left foot saying the du'a' of exit.</p>

<h2>Community Duties</h2>
<p>These are fard kifayah (communal obligations — if some perform them, others are absolved):</p>
<ul>
  <li>Visiting the sick</li>
  <li>Following the janazah</li>
  <li>Responding to the salam</li>
  <li>Feeding the hungry</li>
  <li>Helping those in distress</li>
</ul>

<h2>Free-Mixing (Ikhtilat)</h2>
<p>Ikhtilat means unrestricted free-mixing between non-mahram men and women. It is generally prohibited in Islamic law because it creates conditions that may lead to temptation and harm to individual and social chastity.</p>
<h3>Basis of the Ruling</h3>
<ul>
  <li>The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "A man must never be alone with a non-mahram woman." (Bukhari)</li>
  <li>This does not prohibit all contact — it prohibits <em>unnecessary private</em> interaction that creates vulnerability</li>
</ul>
<h3>Professional and Academic Contexts</h3>
<p>Interaction in group settings, classrooms, workplaces, and public spaces for legitimate needs (education, work, medical treatment) is permitted when:</p>
<ul>
  <li>There is a genuine need</li>
  <li>Interaction is professional and purposeful, not social or intimate</li>
  <li>Islamic standards of dress (hijab) are maintained</li>
  <li>Private one-on-one situations are avoided</li>
</ul>
`.trim();

  const unit15 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-living-community' } },
    create: {
      slug: 'maktab-fs-living-community',
      courseId: course.id,
      orderIndex: 15,
      title: 'Living \u2013 Community, Masjid & Free-Mixing',
      description: 'Roles and etiquette of the masjid; communal duties; the Islamic ruling on ikhtil\u0101\u1E6D (free-mixing) and how to navigate professional/academic environments.',
      content: content15,
    },
    update: {
      title: 'Living \u2013 Community, Masjid & Free-Mixing',
      description: 'Roles and etiquette of the masjid; communal duties; the Islamic ruling on ikhtil\u0101\u1E6D (free-mixing) and how to navigate professional/academic environments.',
      content: content15,
    },
  });
  console.log('\u2705 Unit 15:', unit15.title);
  // ══════════════════════════════════════════════
  // UNIT 16: Money — Ḥalāl Earnings, Zakāh & Ṣadaqah
  // ══════════════════════════════════════════════

  const content16 = `
<h2>Learning Objectives</h2>
<p>Identify what makes income haram, calculate zakah on gold/savings, name the eight categories of zakah recipients, and understand the spiritual virtues of sadaqah.</p>

<h2>The Obligation of Halal Income</h2>
<p>The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: <em>"Allah is pure (Tayyib) and accepts only what is pure."</em> (Muslim) Earning halal income is fard — earning haram income corrupts worship: "A body nourished by haram will not enter Jannah." (Bayhaqi)</p>
<h3>What Makes Income Haram</h3>
<ul>
  <li>Riba (interest/usury) — in all forms, whether giving or receiving</li>
  <li>Theft, fraud, and deception in trade</li>
  <li>Selling haram items (alcohol, pork, drugs)</li>
  <li>Income from immoral services (prostitution, gambling facilitating)</li>
  <li>Bribery and corruption</li>
</ul>

<h2>Zakah — Calculation and Recipients</h2>
<h3>What Triggers Zakah</h3>
<p>Zakah is obligatory when: (1) the nisab threshold is met, and (2) a full lunar year (hawl) passes while above nisab.</p>
<h3>Nisab (Minimum Threshold)</h3>
<ul>
  <li><strong>Gold:</strong> 87.48 grams</li>
  <li><strong>Silver:</strong> 612.36 grams</li>
  <li><strong>Cash/savings:</strong> Equivalent value to either gold or silver nisab (use whichever is lower for maximum zakah)</li>
</ul>
<h3>Rate: 2.5% of total eligible wealth above nisab</h3>
<h3>The Eight Categories of Zakah Recipients (Quran 9:60)</h3>
<ol>
  <li>Al-Fuqara' — the very poor (no assets at all)</li>
  <li>Al-Masakin — the poor (some assets but insufficient)</li>
  <li>'Amilina 'alayha — zakah collectors/administrators</li>
  <li>Al-Mu'allafati qulubuhum — those whose hearts are to be reconciled to Islam</li>
  <li>Fi al-riqab — freeing slaves/captives (in applicable contexts)</li>
  <li>Al-Gharimun — those overwhelmed by debt</li>
  <li>Fi sabilillah — in the way of Allah (e.g., Islamic education, defence)</li>
  <li>Ibn al-Sabil — stranded travellers</li>
</ol>
<p><strong>Note:</strong> Zakah cannot be given to non-Muslims, to build a masjid, or to one's own dependants (wife, children, parents).</p>

<h2>Sadaqah — Voluntary Charity</h2>
<ul>
  <li>"Sadaqah extinguishes sins as water extinguishes fire." (Tirmidhi)</li>
  <li>"Sadaqah does not decrease wealth." (Muslim) — Allah blesses what remains</li>
  <li>Even a smile is sadaqah; removing harm from a path is sadaqah</li>
  <li>Sadaqah jariyah (ongoing charity) — knowledge, a masjid, water well — continues to earn reward after death</li>
</ul>
`.trim();

  const unit16 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-money-halal-zakat' } },
    create: {
      slug: 'maktab-fs-money-halal-zakat',
      courseId: course.id,
      orderIndex: 16,
      title: 'Money \u2013 \u1E24al\u0101l Earnings, Zak\u0101h & \u1E62adaqah',
      description: 'What makes income har\u0101m; how to calculate zak\u0101h (nis\u0101b, 2.5%, 8 recipients); virtues of voluntary \u1E63adaqah and \u1E63adaqah j\u0101riyah.',
      content: content16,
    },
    update: {
      title: 'Money \u2013 \u1E24al\u0101l Earnings, Zak\u0101h & \u1E62adaqah',
      description: 'What makes income har\u0101m; how to calculate zak\u0101h (nis\u0101b, 2.5%, 8 recipients); virtues of voluntary \u1E63adaqah and \u1E63adaqah j\u0101riyah.',
      content: content16,
    },
  });
  console.log('\u2705 Unit 16:', unit16.title);

  // ══════════════════════════════════════════════
  // UNIT 17: Money — Islamic Economics & Inheritance
  // ══════════════════════════════════════════════

  const content17 = `
<h2>Learning Objectives</h2>
<p>Explain why riba is prohibited, describe halal investment structures (mudarabah, musharakah), and understand the basics of Islamic inheritance (fara'id).</p>

<h2>Islamic Economic Principles</h2>
<h3>Prohibition of Riba (Interest/Usury)</h3>
<p>Allah declares: <em>"Allah has permitted trade and forbidden riba."</em> (2:275). The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 cursed: the one who takes riba, the one who pays it, the one who records it, and the two witnesses — "they are all equal." (Muslim)</p>
<h3>Why is Riba Prohibited?</h3>
<ul>
  <li>It creates wealth without productive work or risk — exploitation of the needy</li>
  <li>It concentrates wealth in fewer hands (the rich get richer through interest while debtors get poorer)</li>
  <li>It creates financial instability (as seen in modern financial crises)</li>
  <li>It replaces trust and community with pure profit motive</li>
</ul>
<h3>No Gharar (Deception/Excessive Uncertainty)</h3>
<p>Transactions must be transparent. Selling what you do not own, unclear terms, or deliberate deception are prohibited.</p>

<h2>Halal Investment Structures</h2>
<ul>
  <li><strong>Mudarabah (Profit-Sharing):</strong> One partner provides capital; the other provides expertise and management. Profits are shared by agreed ratio; losses fall on the capital provider (unless the manager was negligent).</li>
  <li><strong>Musharakah (Partnership):</strong> Both partners contribute capital and labour. Profits shared by agreed ratio; losses in proportion to capital contributed.</li>
  <li><strong>Murabaha:</strong> The bank buys an asset and sells it to the customer at a marked-up price (known to both), payable in installments — profit not interest.</li>
</ul>

<h2>Fara'id — Islamic Inheritance</h2>
<p>Allah devoted detailed verses to inheritance (4:11-12) — the most detailed financial rulings in the Quran. Key shares:</p>
<ul>
  <li><strong>Spouse:</strong> Wife gets 1/8 (if there are children) or 1/4 (if no children). Husband gets 1/4 (children) or 1/2 (no children).</li>
  <li><strong>Daughters:</strong> Single daughter gets 1/2; two or more share 2/3.</li>
  <li><strong>Son:</strong> Gets double a daughter's share (he bears the full financial obligation of the family).</li>
  <li><strong>Parents:</strong> Each parent gets 1/6 when the deceased has children.</li>
</ul>
<p>A valid wasiyyah (will) may only direct up to 1/3 of the estate to non-heirs. The remaining 2/3+ must follow fara'id. This prevents wealth concentration and ensures broad family distribution.</p>
`.trim();

  const unit17 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-money-economics-inheritance' } },
    create: {
      slug: 'maktab-fs-money-economics-inheritance',
      courseId: course.id,
      orderIndex: 17,
      title: 'Money \u2013 Islamic Economics & Inheritance',
      description: 'Prohibition of rib\u0101 and reasons; \u1E25al\u0101l investment (mu\u1E0D\u0101rabah, mush\u0101rakah); basics of Islamic inheritance (far\u0101\u02BFi\u1E0D).',
      content: content17,
    },
    update: {
      title: 'Money \u2013 Islamic Economics & Inheritance',
      description: 'Prohibition of rib\u0101 and reasons; \u1E25al\u0101l investment (mu\u1E0D\u0101rabah, mush\u0101rakah); basics of Islamic inheritance (far\u0101\u02BFi\u1E0D).',
      content: content17,
    },
  });
  console.log('\u2705 Unit 17:', unit17.title);

  // ══════════════════════════════════════════════
  // UNIT 18: Contemporary — Addiction & Intoxicants
  // ══════════════════════════════════════════════

  const content18 = `
<h2>Learning Objectives</h2>
<p>Explain the Quranic prohibition of intoxicants and its application to all drugs; understand the spiritual dimension of addiction; and describe the Islamic framework for recovery.</p>

<h2>The Prohibition of Khamr (Intoxicants)</h2>
<p>Allah says: <em>"O you who believe! Intoxicants, gambling, idols, and divining arrows are filth (rijs) from the work of Shaytan — so avoid it, that you may succeed."</em> (5:90)</p>
<p>The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: <em>"Every intoxicant is khamr, and every khamr is haram."</em> (Muslim) The ruling is about the <strong>effect</strong> — anything that clouds the mind, impairs judgment, or causes intoxication is prohibited, regardless of what it is called.</p>
<h3>Why the Prohibition?</h3>
<p>The human intellect ('aql) is one of the five essential values Islam protects (alongside life, lineage, property, and religion). Intoxicants destroy the intellect — the very faculty that enables worship, moral reasoning, and human dignity.</p>

<h2>The Scope of the Prohibition</h2>
<p>The prohibition extends to:</p>
<ul>
  <li>All forms of alcohol (including small amounts — "whatever intoxicates in large quantities, a small amount is also haram")</li>
  <li>Cannabis (marijuana), cocaine, heroin, MDMA, and all other mind-altering drugs</li>
  <li>Misuse of prescription medication to achieve intoxication</li>
  <li>Any substance taken deliberately to impair consciousness</li>
</ul>

<h2>The Spiritual Dimension of Addiction</h2>
<p>Addiction fills the God-shaped hole in the human soul with a substance. The intense craving of addiction mirrors the spiritual hunger that is intended to drive us toward Allah. Recovery is, in Islamic terms, a journey of redirecting that craving toward its true object.</p>

<h2>Recovery in the Islamic Framework</h2>
<ol>
  <li><strong>Tawbah:</strong> Sincere repentance — Allah forgives all sins with genuine tawbah. No sin is too great.</li>
  <li><strong>Community support:</strong> Tell a trusted person (family member, imam, scholar). Isolation enables addiction.</li>
  <li><strong>Professional help:</strong> Counselling, addiction services, and medical support are fully permitted and encouraged — Allah says "Take the means."</li>
  <li><strong>Healthy alternatives:</strong> Exercise, community, structured worship, and purpose replace the void substances fill.</li>
  <li><strong>Remove triggers:</strong> Islamic guidance on not keeping haram in the home or spending time in places of temptation.</li>
</ol>
`.trim();

  const unit18 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-contemporary-addiction' } },
    create: {
      slug: 'maktab-fs-contemporary-addiction',
      courseId: course.id,
      orderIndex: 18,
      title: 'Contemporary \u2013 Addiction & Intoxicants',
      description: 'Qur\u02BF\u0101nic prohibition of intoxicants (5:90); all drugs covered by the ruling; spiritual dimension of addiction; Islamic framework for recovery.',
      content: content18,
    },
    update: {
      title: 'Contemporary \u2013 Addiction & Intoxicants',
      description: 'Qur\u02BF\u0101nic prohibition of intoxicants (5:90); all drugs covered by the ruling; spiritual dimension of addiction; Islamic framework for recovery.',
      content: content18,
    },
  });
  console.log('\u2705 Unit 18:', unit18.title);
  // ══════════════════════════════════════════════
  // UNIT 19: Contemporary — Digital World
  // ══════════════════════════════════════════════

  const content19 = `
<h2>Learning Objectives</h2>
<p>Apply Islamic principles to social media use, determine when gaming becomes haram, and understand the Islamic ruling on pornography and how to seek help.</p>

<h2>Social Media — Islamic Principles</h2>
<h3>The Principle of Beneficial Sharing</h3>
<p>The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: <em>"It is enough sin for a man to repeat everything he hears."</em> (Muslim) Sharing unverified news, rumours, and sensational content online is subject to the same ruling. Allah says: <em>"If a corrupt person brings news, verify it."</em> (49:6)</p>
<h3>Digital Ghibah (Backbiting Online)</h3>
<p>Criticising someone by name, posting about their faults, sharing screenshots of private conversations — all subject to the same ruling as verbal ghibah. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said ghibah is "mentioning your brother in a way he would dislike" — online or offline.</p>
<h3>Digital Hijab</h3>
<p>Islamic standards of modesty apply online: posting immodest images of yourself (including women without hijab in public posts), using social media to attract the opposite gender, engaging in flirtatious messaging — all carry the same rulings as their offline equivalents.</p>
<h3>Practical Guidelines</h3>
<ul>
  <li>Verify before sharing: "Is this true? Is it beneficial? Would Allah be pleased?"</li>
  <li>Do not maintain social media profiles that require immodesty</li>
  <li>Limit time — excessive social media use has documented links to anxiety and depression</li>
  <li>Use for da'wah, beneficial knowledge, and keeping Islamic community bonds</li>
</ul>

<h2>Gaming</h2>
<p>Games are not prohibited in themselves — leisure and recreation are permitted in Islam. Gaming becomes haram when it:</p>
<ul>
  <li>Causes addiction that leads to neglect of salah, family, or work/study duties</li>
  <li>Involves gambling (loot boxes, paid tournaments with prize pools)</li>
  <li>Contains haram content (graphic violence, pornography, magic glorification, cross-dressing)</li>
  <li>Is played with headsets in mixed-gender settings enabling haram conversation</li>
</ul>

<h2>Pornography — A Clear Prohibition</h2>
<p>Pornography is unambiguously haram: it involves looking at the awrah of non-mahram persons; it encourages zina of the heart (the eyes commit zina); it is highly addictive (neurologically documented); it damages marriages and warps expectations of intimacy.</p>
<h3>Seeking Help</h3>
<ul>
  <li>Make tawbah and recognise this as a serious sin requiring serious effort</li>
  <li>Install content filters on all devices</li>
  <li>Seek accountability from a trusted (same-gender) person</li>
  <li>Seek professional help — many Muslim counsellors specialise in this</li>
  <li>Increase fasting: "Whoever can afford marriage should marry; whoever cannot should fast — it is a shield." (Bukhari)</li>
</ul>
`.trim();

  const unit19 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-contemporary-digital' } },
    create: {
      slug: 'maktab-fs-contemporary-digital',
      courseId: course.id,
      orderIndex: 19,
      title: 'Contemporary \u2013 Digital World: Social Media, Gaming & Pornography',
      description: 'Islamic principles for social media; digital g\u012Bbah; when gaming becomes har\u0101m; Islamic ruling on pornography and seeking recovery.',
      content: content19,
    },
    update: {
      title: 'Contemporary \u2013 Digital World: Social Media, Gaming & Pornography',
      description: 'Islamic principles for social media; digital g\u012Bbah; when gaming becomes har\u0101m; Islamic ruling on pornography and seeking recovery.',
      content: content19,
    },
  });
  console.log('\u2705 Unit 19:', unit19.title);

  // ══════════════════════════════════════════════
  // UNIT 20: Contemporary — Discrimination & Materialism
  // ══════════════════════════════════════════════

  const content20 = `
<h2>Learning Objectives</h2>
<p>Explain Islam's teaching on racial and class equality, define materialism and its harms, and describe how to cultivate gratitude and contentment (zuhd) in a consumer culture.</p>

<h2>Islam and Racial/Class Equality</h2>
<h3>The Farewell Sermon</h3>
<p>In his final address at 'Arafah, the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 declared: <em>"No Arab has superiority over a non-Arab, and no non-Arab over an Arab; no white has superiority over a black, and no black over a white — except by taqwa (God-consciousness and piety)."</em></p>
<p>This was a revolutionary declaration in a tribal, racially stratified 7th-century society. The criterion of human worth in Islam is taqwa — the relationship of the heart with Allah — not ancestry, race, wealth, or nationality.</p>
<h3>Living Examples</h3>
<ul>
  <li><strong>Bilal ibn Rabah:</strong> A former Ethiopian slave — tortured by Qurayshi masters — became the first mu'adhdhin of Islam, among the most beloved companions.</li>
  <li><strong>Salman al-Farisi:</strong> A Persian (non-Arab), freed slave, who suggested the Battle of the Trench strategy — honoured by the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 as "Salman is of us, the Ahlul Bayt."</li>
</ul>

<h2>Materialism</h2>
<p>Materialism is the worldview that measures human worth, success, and happiness by material possessions, wealth, and status. Allah warns: <em>"Competition for worldly increase has distracted you — until you visit the graves."</em> (Surah al-Takathur, 102:1-2)</p>
<h3>Harms of Materialism</h3>
<ul>
  <li>Endless desire — the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "The son of Adam would fill a valley of gold and still desire another."</li>
  <li>Distraction from the Hereafter and from those in need</li>
  <li>Documented psychological harm — wealth beyond a moderate threshold does not increase happiness</li>
</ul>

<h2>Zuhd and Qana'ah — The Antidote</h2>
<p><strong>Zuhd</strong> does not mean poverty or abandoning worldly pursuits — many wealthy Companions were people of zuhd. It means not letting the world occupy the heart; using wealth as a means, not an end.</p>
<p><strong>Qana'ah (contentment):</strong> The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Richness is not having many possessions; true richness is the richness of the soul (self-contentment)." (Bukhari)</p>

<h2>Cultivating Gratitude (Shukr) in a Consumer Culture</h2>
<ul>
  <li>Keep a daily list of three things you are grateful for (hadith: "Look to those below you, not above you")</li>
  <li>Visit the poor and hospitals — perspective is the most powerful cure for materialism</li>
  <li>Fast regularly — voluntary fasting detaches the nafs from appetites</li>
  <li>Give in sadaqah before you feel you have "enough" — generosity cures miserliness</li>
  <li>Limit consumption media (advertising is designed to manufacture dissatisfaction)</li>
</ul>
`.trim();

  const unit20 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-fs-contemporary-society' } },
    create: {
      slug: 'maktab-fs-contemporary-society',
      courseId: course.id,
      orderIndex: 20,
      title: 'Contemporary \u2013 Discrimination & Materialism',
      description: 'Islam\'s teaching on racial equality (Farewell Sermon); materialism and S\u016Brah al-Tak\u0101thur; zuhd and qan\u0101\u02BEah; cultivating gratitude in a consumer culture.',
      content: content20,
    },
    update: {
      title: 'Contemporary \u2013 Discrimination & Materialism',
      description: 'Islam\'s teaching on racial equality (Farewell Sermon); materialism and S\u016Brah al-Tak\u0101thur; zuhd and qan\u0101\u02BEah; cultivating gratitude in a consumer culture.',
      content: content20,
    },
  });
  console.log('\u2705 Unit 20:', unit20.title);
  // ══════════════════════════════════════════════
  // QUIZ QUESTIONS — all 20 units (6 each = 120 total)
  // ══════════════════════════════════════════════

  const quizData: Array<{
    unitId: string; externalId: string; type: string;
    questionText: string; options: string[] | null;
    correctAnswer: string; explanation: string; difficulty: string;
  }> = [
    // ── Unit 1: Core ʿAqīdah ──
    { unitId: unit1.id, externalId: 'fs-nw-aqidah-q1', type: 'MULTIPLE_CHOICE', questionText: 'How many articles of faith (arkan al-iman) are there in Islam?', options: ['Four', 'Five', 'Six', 'Seven'], correctAnswer: 'Six', explanation: 'The six articles are: belief in Allah, angels, divine books, prophets, the Last Day, and qadar (divine decree).', difficulty: 'EASY' },
    { unitId: unit1.id, externalId: 'fs-nw-aqidah-q2', type: 'MULTIPLE_CHOICE', questionText: 'Which argument holds that the universe, being contingent, requires a self-existent uncaused cause?', options: ['Ontological', 'Cosmological', 'Teleological', 'Moral'], correctAnswer: 'Cosmological', explanation: 'The cosmological argument: every contingent thing needs a cause; the universe is contingent; therefore it has a necessary, uncaused, self-existent cause — Allah.', difficulty: 'MEDIUM' },
    { unitId: unit1.id, externalId: 'fs-nw-aqidah-q3', type: 'TRUE_FALSE', questionText: 'Belief in qadar (divine decree) eliminates human moral responsibility.', options: ['True', 'False'], correctAnswer: 'False', explanation: "Allah's pre-eternal knowledge does not compel human actions. Humans act by their own acquired will and are therefore morally accountable for their choices.", difficulty: 'MEDIUM' },
    { unitId: unit1.id, externalId: 'fs-nw-aqidah-q4', type: 'FILL_BLANK', questionText: 'The innate human disposition to recognise the Creator — which every child is born with — is called ___ in Arabic.', options: null, correctAnswer: 'fitrah', explanation: 'Fitrah is the innate God-given nature that inclines every human toward recognising Allah. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Every child is born upon the fitrah." (Bukhari)', difficulty: 'EASY' },
    { unitId: unit1.id, externalId: 'fs-nw-aqidah-q5', type: 'MULTIPLE_CHOICE', questionText: 'What does tawhid mean?', options: ['Allah has three persons', 'The absolute oneness of Allah in essence, attributes, and worship', 'The prophets are divine', 'Angels share in creation'], correctAnswer: 'The absolute oneness of Allah in essence, attributes, and worship', explanation: 'Tawhid is the foundational Islamic doctrine of the absolute, undivided oneness of Allah — the very core of the Shahadah.', difficulty: 'EASY' },
    { unitId: unit1.id, externalId: 'fs-nw-aqidah-q6', type: 'MULTIPLE_CHOICE', questionText: 'Which Quranic verse declares Muhammad \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 the Seal of the Prophets?', options: ['Al-Baqarah 2:285', 'Al-Ahzab 33:40', 'Al-Fatihah 1:5', 'Al-Ikhlas 112:1'], correctAnswer: 'Al-Ahzab 33:40', explanation: 'Al-Ahzab 33:40: "Muhammad is not the father of any man among you, but he is the Messenger of Allah and the Seal of the Prophets."', difficulty: 'HARD' },

    // ── Unit 2: Ṭahārah ──
    { unitId: unit2.id, externalId: 'fs-nw-tahara-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which type of water is both pure AND purifying (tahir mutahhir)?', options: ['Used wudu\' water', 'Fruit juice', 'Natural rain or river water', 'Water mixed with soap'], correctAnswer: 'Natural rain or river water', explanation: 'Tahir mutahhir water (pure and purifying) is natural water: rain, river, well, sea, spring. It may be used for wudu\' and removing najasah.', difficulty: 'EASY' },
    { unitId: unit2.id, externalId: 'fs-nw-tahara-q2', type: 'MULTIPLE_CHOICE', questionText: 'How many fard (obligatory) acts does wudu\' have according to the Hanafi school?', options: ['2', '3', '4', '6'], correctAnswer: '4', explanation: 'The four fara\'id of wudu\': washing the face, washing both arms to the elbows, wiping one quarter of the head, and washing both feet to the ankles.', difficulty: 'EASY' },
    { unitId: unit2.id, externalId: 'fs-nw-tahara-q3', type: 'TRUE_FALSE', questionText: 'Tayammum is permissible even when water is available, as long as you are very short on time.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Tayammum is only valid when water is unavailable or when using water would cause genuine medical harm. Time pressure alone does not permit tayammum; shorten the prayer instead.', difficulty: 'MEDIUM' },
    { unitId: unit2.id, externalId: 'fs-nw-tahara-q4', type: 'MULTIPLE_CHOICE', questionText: 'Which of these occasions makes ghusl (full ritual bath) obligatory?', options: ['Sleeping without wudu\'', 'Cessation of menstruation (hayd)', 'Becoming angry', 'Touching a non-Muslim'], correctAnswer: 'Cessation of menstruation (hayd)', explanation: 'Ghusl is fard after: janabah (sexual discharge), cessation of hayd (menstruation), cessation of nifas (post-natal bleeding), and upon accepting Islam.', difficulty: 'EASY' },
    { unitId: unit2.id, externalId: 'fs-nw-tahara-q5', type: 'FILL_BLANK', questionText: 'Performing wudu\' over leather socks instead of washing the feet is called masah al-___.', options: null, correctAnswer: 'khuffayn', explanation: 'Masah al-khuffayn means wiping over leather socks during wudu\'. Conditions: socks must have been put on while in wudu\', must cover the ankles, and have no large holes.', difficulty: 'MEDIUM' },
    { unitId: unit2.id, externalId: 'fs-nw-tahara-q6', type: 'MULTIPLE_CHOICE', questionText: 'For how long may a traveller make masah on leather socks before renewing wudu\' properly?', options: ['1 day and night', '2 days and nights', '3 days and nights', '7 days and nights'], correctAnswer: '3 days and nights', explanation: 'A traveller may make masah for 3 days and nights (72 hours). A resident may only make masah for 1 day and night (24 hours).', difficulty: 'MEDIUM' },

    // ── Unit 3: Ṣalāh ──
    { unitId: unit3.id, externalId: 'fs-nw-salah-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which of the following is a FARD (obligatory) act of salah?', options: ['Reciting a surah after al-Fatiha', 'Saying Allahu Akbar for each posture change (takbirat al-intiqal)', 'The qa\'dah akhirah (final sitting)', 'Saying the thana\' (opening supplication)'], correctAnswer: 'The qa\'dah akhirah (final sitting)', explanation: 'The final sitting (qa\'dah akhirah) is a fard of salah. Reciting a surah after al-Fatiha is wajib; takbirat al-intiqal (except tahrima) is wajib; the thana\' is sunnah.', difficulty: 'HARD' },
    { unitId: unit3.id, externalId: 'fs-nw-salah-q2', type: 'MULTIPLE_CHOICE', questionText: 'What does sajdah as-sahw compensate for?', options: ['Missing a fard act of salah', 'Inadvertent omission of a wajib act', 'Speaking accidentally during salah', 'Losing concentration in prayer'], correctAnswer: 'Inadvertent omission of a wajib act', explanation: 'Sajdah as-sahw (prostration of forgetfulness) remedies inadvertent omission or delay of a wajib act. Deliberately missing a fard invalidates the salah entirely.', difficulty: 'MEDIUM' },
    { unitId: unit3.id, externalId: 'fs-nw-salah-q3', type: 'TRUE_FALSE', questionText: 'Qasr prayer means a traveller combines two prayers into one (e.g., praying Zuhr and Asr together).', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Qasr means shortening a 4-rak\'ah fard prayer to 2 rak\'at. Combining prayers (jam\') is a separate concept not practiced in the Hanafi school (except at Muzdalifah during Hajj).', difficulty: 'MEDIUM' },
    { unitId: unit3.id, externalId: 'fs-nw-salah-q4', type: 'FILL_BLANK', questionText: 'A missed fard salah that must be made up later is called ___.', options: null, correctAnswer: 'qada\'', explanation: 'Qada\' is the making up of a missed obligatory prayer. It remains a debt upon the person until performed and must be made up as soon as possible.', difficulty: 'EASY' },
    { unitId: unit3.id, externalId: 'fs-nw-salah-q5', type: 'MULTIPLE_CHOICE', questionText: 'Which of the following INVALIDATES (breaks) salah?', options: ['Forgetting to recite a surah after al-Fatiha', 'Laughing aloud', 'A thought about worldly matters', 'A brief movement to adjust clothing'], correctAnswer: 'Laughing aloud', explanation: 'Laughing aloud invalidates salah (and also breaks wudu\' according to the Hanafi school). Forgetting a surah requires sajdah as-sahw. Thoughts and brief adjustments do not invalidate.', difficulty: 'MEDIUM' },
    { unitId: unit3.id, externalId: 'fs-nw-salah-q6', type: 'MULTIPLE_CHOICE', questionText: 'What is the minimum travel distance that permits qasr prayer according to Hanafi fiqh?', options: ['24 km', '48 km', '77 km (approx. 48 miles)', '120 km'], correctAnswer: '77 km (approx. 48 miles)', explanation: 'In Hanafi fiqh, the minimum journey distance permitting qasr is 77 km (approximately 48 miles / 3 marhalahs). The traveller must intend to reach this destination in a lawful journey.', difficulty: 'HARD' },

    // ── Unit 4: Du'a' and Calendar ──
    { unitId: unit4.id, externalId: 'fs-nw-dua-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which time on Friday is particularly recommended as the accepted hour for du\'a\'?', options: ['At the time of adhan', 'The last hour before Maghrib', 'At Fajr time on Friday', 'The first hour after Jumu\'ah prayer'], correctAnswer: 'The last hour before Maghrib', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 described a special hour on Friday when du\'a\' is accepted. Most scholars identify it as the last hour before Maghrib on Friday.', difficulty: 'MEDIUM' },
    { unitId: unit4.id, externalId: 'fs-nw-dua-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is the primary significance of fasting on \'Ashura\' (10th Muharram)?', options: ['It commemorates the birth of the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645', 'Allah saved Musa \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645 and the Israelites from Pharaoh', 'It is the Islamic New Year', 'The Quran was first revealed on this day'], correctAnswer: 'Allah saved Musa \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645 and the Israelites from Pharaoh', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 found the Jews fasting on \'Ashura\' and learned it was because Allah saved Musa \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645 from Pharaoh on that day. He began fasting it and urged Muslims to fast the 9th and 10th.', difficulty: 'MEDIUM' },
    { unitId: unit4.id, externalId: 'fs-nw-dua-q3', type: 'TRUE_FALSE', questionText: 'It is recommended to raise both hands when making du\'a\'.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Raising both hands during du\'a\' is a recommended etiquette. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Your Lord is alive and generous — He is too generous to turn away the hands of His servant empty-handed."', difficulty: 'EASY' },
    { unitId: unit4.id, externalId: 'fs-nw-dua-q4', type: 'FILL_BLANK', questionText: 'The Islamic new year begins with the month of ___.', options: null, correctAnswer: 'Muharram', explanation: 'Muharram is the first month of the Islamic Hijri calendar. It is one of the four sacred months. The Islamic new year begins with the first of Muharram.', difficulty: 'EASY' },
    { unitId: unit4.id, externalId: 'fs-nw-dua-q5', type: 'MULTIPLE_CHOICE', questionText: 'In which Islamic month did the Isra\' and Mi\'raj (Night Journey and Ascension) take place?', options: ['Ramadan', 'Muharram', 'Rajab', 'Shawwal'], correctAnswer: 'Rajab', explanation: 'The Night Journey (Isra\') and Ascension (Mi\'raj) of the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 are commemorated on the 27th of Rajab.', difficulty: 'MEDIUM' },
    { unitId: unit4.id, externalId: 'fs-nw-dua-q6', type: 'MULTIPLE_CHOICE', questionText: 'How many months does the Islamic Hijri calendar have?', options: ['10', '11', '12', '13'], correctAnswer: '12', explanation: 'The Islamic calendar has 12 lunar months. Allah says: "The number of months in Allah\'s sight is twelve months." (9:36)', difficulty: 'EASY' },

    // ── Unit 5: Attributes of Allāh ──
    { unitId: unit5.id, externalId: 'fs-nw-attrs-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which of the following is one of the six essential attributes (sifat dhatiyyah) of Allah?', options: ['Kalam (speech)', 'Iradah (will)', 'Qidam (pre-eternity)', 'Sam\' (hearing)'], correctAnswer: 'Qidam (pre-eternity)', explanation: 'The six essential attributes are: Wujud, Qidam, Baqa\', Qiyam binafsih, Wahdaniyyah, and Mukhalafah lil-hawadith. Kalam, Iradah, and Sam\' are among the seven sifat al-ma\'ani.', difficulty: 'HARD' },
    { unitId: unit5.id, externalId: 'fs-nw-attrs-q2', type: 'MULTIPLE_CHOICE', questionText: 'How many sifat al-ma\'ani (attributes of meaning) does Allah necessarily possess?', options: ['4', '6', '7', '99'], correctAnswer: '7', explanation: 'The seven sifat al-ma\'ani are: Hayah (life), \'Ilm (knowledge), Qudrah (power), Iradah (will), Sam\' (hearing), Basar (sight), and Kalam (speech).', difficulty: 'MEDIUM' },
    { unitId: unit5.id, externalId: 'fs-nw-attrs-q3', type: 'TRUE_FALSE', questionText: 'Allah\'s attribute of kalam (speech) means He speaks through sound waves and vocal organs like humans.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Allah\'s speech (kalam) is not through sound, air, or vocal organs — these are characteristics of created speech. The Quran is Allah\'s eternal speech. "There is nothing like Him." (42:11)', difficulty: 'MEDIUM' },
    { unitId: unit5.id, externalId: 'fs-nw-attrs-q4', type: 'FILL_BLANK', questionText: 'The attribute meaning Allah is completely self-subsistent, needing nothing and no one, is called Qiyam ___.', options: null, correctAnswer: 'binafsih', explanation: 'Qiyam binafsih means "self-subsistence" — Allah is entirely independent of all creation. He does not need a place, support, sustenance, or anything external.', difficulty: 'MEDIUM' },
    { unitId: unit5.id, externalId: 'fs-nw-attrs-q5', type: 'MULTIPLE_CHOICE', questionText: 'How does Islam address the problem of evil and suffering (Islamic theodicy)?', options: ['Suffering proves Allah does not exist', 'Allah\'s wisdom surpasses human comprehension; tests purify believers; justice is perfected in the Hereafter', 'Suffering is always a punishment for sin', 'Evil is outside Allah\'s knowledge'], correctAnswer: 'Allah\'s wisdom surpasses human comprehension; tests purify believers; justice is perfected in the Hereafter', explanation: 'Islam teaches that suffering tests and purifies believers (2:155), human evil comes from free will, Allah\'s hikmah surpasses human understanding, and ultimate justice is in the Hereafter.', difficulty: 'MEDIUM' },
    { unitId: unit5.id, externalId: 'fs-nw-attrs-q6', type: 'MULTIPLE_CHOICE', questionText: 'Which essential attribute means Allah has absolutely no beginning?', options: ['Baqa\'', 'Wujud', 'Qidam', 'Wahdaniyyah'], correctAnswer: 'Qidam', explanation: 'Qidam is Allah\'s attribute of pre-eternity — He has no beginning. Baqa\' means He has no end. Wujud means He exists. Wahdaniyyah is His oneness.', difficulty: 'MEDIUM' },
    // ── Unit 6: Prophethood & Qurʾān ──
    { unitId: unit6.id, externalId: 'fs-nw-prophet-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which Quranic prophecy about Rome vs Persia was fulfilled around 628 CE?', options: ['Rome would defeat Persia within a few years', 'Persia would permanently rule Rome', 'Both empires would be defeated by Arabia', 'Rome and Persia would form an alliance'], correctAnswer: 'Rome would defeat Persia within a few years', explanation: 'Surah al-Rum (30:1-4) prophesied that Rome, after being defeated by Persia, would defeat them "within a few years." This was precisely fulfilled at the Battle of Issus (628 CE).', difficulty: 'HARD' },
    { unitId: unit6.id, externalId: 'fs-nw-prophet-q2', type: 'MULTIPLE_CHOICE', questionText: "What does i'jaz al-Quran mean?", options: ["The Quran's history of preservation", "The miraculous inimitability of the Quran", "The rules of Quranic recitation", "The abrogation of earlier revelations"], correctAnswer: "The miraculous inimitability of the Quran", explanation: "I'jaz means rendering others incapable. The Quran challenged the Arabs to produce even one chapter like it (2:23) — they could not, despite their mastery of Arabic. 1,400 years later the challenge stands.", difficulty: 'MEDIUM' },
    { unitId: unit6.id, externalId: 'fs-nw-prophet-q3', type: 'TRUE_FALSE', questionText: 'The Quran was only preserved orally during the lifetime of the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 and was not written down until after his death.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'The Quran was written down under the direct supervision of the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 by designated scribes (like Zayd ibn Thabit). Both oral and written preservation occurred simultaneously from day one.', difficulty: 'MEDIUM' },
    { unitId: unit6.id, externalId: 'fs-nw-prophet-q4', type: 'MULTIPLE_CHOICE', questionText: 'Which personal characteristic of the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 is cited as evidence of his prophethood?', options: ['He was wealthy before prophethood', 'He gained no personal worldly benefit from his mission', 'He had no opponents during his life', 'He lived a long comfortable life'], correctAnswer: 'He gained no personal worldly benefit from his mission', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 suffered persecution, exile, and war. He died with almost no possessions. If fabricating revelation, why endure this? The absence of personal gain strengthens the evidence of sincerity.', difficulty: 'MEDIUM' },
    { unitId: unit6.id, externalId: 'fs-nw-prophet-q5', type: 'FILL_BLANK', questionText: "The Quran's challenge to produce a chapter like it, which has stood unmet for 1,400 years, is called the challenge of ___ (inimitability).", options: null, correctAnswer: "i'jaz", explanation: "I'jaz (inimitability) refers to the Quran's miraculous nature. The challenge (tahhaddi) appears in multiple places: produce ten chapters like it (11:13), one chapter (2:23, 10:38).", difficulty: 'MEDIUM' },
    { unitId: unit6.id, externalId: 'fs-nw-prophet-q6', type: 'MULTIPLE_CHOICE', questionText: 'Which Quranic surah contains the challenge to produce a chapter like the Quran?', options: ['Al-Kahf (18)', 'Al-Baqarah (2)', 'Al-Fatiha (1)', 'Al-Mulk (67)'], correctAnswer: 'Al-Baqarah (2)', explanation: 'Al-Baqarah 2:23: "If you are in doubt about what We have revealed to Our servant, then produce one surah like it." The challenge also appears in Yunus 10:38 and Hud 11:13.', difficulty: 'MEDIUM' },

    // ── Unit 7: Search for Truth ──
    { unitId: unit7.id, externalId: 'fs-nw-truth-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which Arabic phrase, used repeatedly in the Quran, means "will you not use your reason/intellect?"', options: ["Afala yatafakkarun", "Afala ta'qilun", "Afala tubsirun", "Afala tasma'un"], correctAnswer: "Afala ta'qilun", explanation: "Afala ta'qilun appears over 50 times in the Quran, inviting believers and non-believers alike to reason and reflect. Islam strongly encourages intellectual engagement.", difficulty: 'MEDIUM' },
    { unitId: unit7.id, externalId: 'fs-nw-truth-q2', type: 'MULTIPLE_CHOICE', questionText: 'How should a Muslim respond when experiencing sincere doubts about faith?', options: ['Immediately abandon worship until doubts are resolved', 'Seek knowledge, consult reliable scholars, and continue worship', 'Share doubts widely on social media to get answers', 'Ignore all doubts as they are sinful'], correctAnswer: 'Seek knowledge, consult reliable scholars, and continue worship', explanation: 'Doubts arise from ignorance. The solution is more knowledge (not less worship). Consulting reliable ulama, continuing practice, and remembering fitrah are the prescribed responses.', difficulty: 'MEDIUM' },
    { unitId: unit7.id, externalId: 'fs-nw-truth-q3', type: 'TRUE_FALSE', questionText: 'Islam discourages questioning and independent intellectual inquiry.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Islam strongly encourages intellectual inquiry. The Quran uses "afala ta\'qilun" over 50 times. The early Islamic civilisation produced the world\'s greatest scientists precisely because Islam valued reason and evidence.', difficulty: 'EASY' },
    { unitId: unit7.id, externalId: 'fs-nw-truth-q4', type: 'FILL_BLANK', questionText: 'Scholars of Islamic law and theology who are qualified to provide authoritative religious guidance are called ___.', options: null, correctAnswer: 'ulama', explanation: "Ulama (singular: 'alim) are scholars who have completed traditional Islamic education in Quran, hadith, fiqh, and related sciences. They are the qualified religious authorities in Islamic communities.", difficulty: 'EASY' },
    { unitId: unit7.id, externalId: 'fs-nw-truth-q5', type: 'MULTIPLE_CHOICE', questionText: "What is Islam's position on the relationship between religion and modern science?", options: ['They are fundamentally incompatible', 'Science disproves Islam', 'They are complementary; science studies the creation of Allah', 'Muslims should reject all modern science'], correctAnswer: 'They are complementary; science studies the creation of Allah', explanation: "Islamic scholars have not generally found a conflict between scientific inquiry and Islamic theology. Science studies the physical creation of Allah; Islam provides meaning, ethics, and ultimate purpose.", difficulty: 'MEDIUM' },
    { unitId: unit7.id, externalId: 'fs-nw-truth-q6', type: 'MULTIPLE_CHOICE', questionText: 'If you are unsure whether your wudu\' was valid, what is the default Islamic ruling?', options: ['Redo the wudu\' to be safe', 'Assume wudu\' was valid (default to last certain state)', 'Ask an imam before every prayer', 'Perform tayammum as a precaution'], correctAnswer: 'Assume wudu\' was valid (default to last certain state)', explanation: 'Islamic legal principle: certainty is not removed by doubt (al-yaqin la yazulu bish-shakk). Default to the last certain state. Only a certain knowledge of nullification requires renewal.', difficulty: 'MEDIUM' },

    // ── Unit 8: Deepening Ṣalāh ──
    { unitId: unit8.id, externalId: 'fs-nw-khushu-q1', type: 'MULTIPLE_CHOICE', questionText: 'What is the meaning of "Allahu Akbar" said as the opening takbir (tahrima)?', options: ['Allah is great', 'Allah is the Greatest', 'Allah is greater (than everything in this world)', 'Glorified is Allah'], correctAnswer: 'Allah is greater (than everything in this world)', explanation: '"Allahu Akbar" is often translated "Allah is the Greatest" but more precisely means "Allah is greater" — greater than everything that is preoccupying you, everything in this dunya. This is the spiritual doorway into salah.', difficulty: 'MEDIUM' },
    { unitId: unit8.id, externalId: 'fs-nw-khushu-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is khushu\' in salah?', options: ['Fast and efficient completion of prayer', 'Humble, focused presence of heart before Allah', 'Praying in congregation', 'Memorising long surahs'], correctAnswer: 'Humble, focused presence of heart before Allah', explanation: 'Khushu\' is the humble, attentive presence of the heart in prayer. Allah praises those who have khushu\' as the first characteristic of successful believers (23:1-2).', difficulty: 'EASY' },
    { unitId: unit8.id, externalId: 'fs-nw-khushu-q3', type: 'TRUE_FALSE', questionText: 'Tahajjud prayer is performed in the last third of the night, after midnight, before Fajr.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Tahajjud (night prayer / qiyam al-layl) is ideally performed in the last third of the night. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said Allah descends and calls: "Is there anyone seeking forgiveness that I may forgive him?" during this time.', difficulty: 'EASY' },
    { unitId: unit8.id, externalId: 'fs-nw-khushu-q4', type: 'FILL_BLANK', questionText: 'The voluntary prayer performed in the late morning, when the sun has risen high, is called ___.', options: null, correctAnswer: 'Duha', explanation: 'Salat al-Duha (also called "chast" in South Asian tradition) is performed when the sun has risen to mid-height, typically 15-20 minutes after sunrise until before midday.', difficulty: 'EASY' },
    { unitId: unit8.id, externalId: 'fs-nw-khushu-q5', type: 'MULTIPLE_CHOICE', questionText: 'In which posture of salah did the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 say the servant is closest to Allah?', options: ['Qiyam (standing)', 'Ruku\' (bowing)', 'Sujud (prostration)', 'Qa\'dah (sitting)'], correctAnswer: 'Sujud (prostration)', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "The servant is closest to his Lord when prostrating, so make abundant du\'a\' [in sujud]." (Muslim)', difficulty: 'EASY' },
    { unitId: unit8.id, externalId: 'fs-nw-khushu-q6', type: 'MULTIPLE_CHOICE', questionText: 'Which prayers are shortened (from 4 to 2 rak\'at) when making qasr as a traveller?', options: ['Fajr, Zuhr, Asr', 'Zuhr, Asr, Isha', 'Asr, Maghrib, Isha', 'All five daily prayers'], correctAnswer: 'Zuhr, Asr, Isha', explanation: 'Only 4-rak\'ah prayers are shortened: Zuhr (4 to 2), Asr (4 to 2), and Isha (4 to 2). Fajr remains 2 rak\'at and Maghrib remains 3 rak\'at — these are not shortened.', difficulty: 'MEDIUM' },

    // ── Unit 9: Jumu'ah, Sawm & Hajj ──
    { unitId: unit9.id, externalId: 'fs-nw-jumuah-q1', type: 'MULTIPLE_CHOICE', questionText: 'Reading which surah every Friday gives "light between the two Fridays" according to hadith?', options: ['Surah al-Mulk', 'Surah Yasin', 'Surah al-Kahf', 'Surah al-Waqiah'], correctAnswer: 'Surah al-Kahf', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Whoever reads Surah al-Kahf on Friday, light will shine for him from one Friday to the next." (Hakim)', difficulty: 'EASY' },
    { unitId: unit9.id, externalId: 'fs-nw-jumuah-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is the reward of fasting 6 days of Shawwal after completing Ramadan?', options: ['Reward of fasting for 6 months', 'Reward of fasting the entire year', 'Forgiveness of all major sins', 'Double reward of Ramadan fasts'], correctAnswer: 'Reward of fasting the entire year', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Whoever fasts Ramadan and then follows it with 6 days of Shawwal — it is as if he fasted the entire year." (Muslim) [Ramadan = 10 months\' reward; 6 days = 2 months\' reward]', difficulty: 'MEDIUM' },
    { unitId: unit9.id, externalId: 'fs-nw-jumuah-q3', type: 'TRUE_FALSE', questionText: "Putting on ihram for Hajj represents the spiritual act of renouncing worldly distinctions — all pilgrims wear the same simple white garment.", options: ['True', 'False'], correctAnswer: 'True', explanation: "Ihram dissolves worldly distinctions — rich and poor, king and commoner wear identical white sheets. It symbolises equality before Allah and the renouncing of worldly status.", difficulty: 'EASY' },
    { unitId: unit9.id, externalId: 'fs-nw-jumuah-q4', type: 'FILL_BLANK', questionText: 'The pivotal gathering at the plain of \'Arafah during Hajj is called ___.', options: null, correctAnswer: 'Wuquf', explanation: 'Wuquf means "standing" — the standing at \'Arafah on 9th Dhul Hijjah. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Hajj is \'Arafah." Without this, Hajj is invalid.', difficulty: 'MEDIUM' },
    { unitId: unit9.id, externalId: 'fs-nw-jumuah-q5', type: 'MULTIPLE_CHOICE', questionText: 'The sa\'i (walking between Safa and Marwah) spiritually commemorates the actions of which person?', options: ['Ibrahim \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645', 'Musa \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645', 'Hajar (Hagar), the mother of Ismail', 'Ismail \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645'], correctAnswer: 'Hajar (Hagar), the mother of Ismail', explanation: 'Sa\'i commemorates Hajar\'s desperate search for water when left alone in the desert with baby Ismail. Her trust in Allah was rewarded with the miracle of Zamzam. Her faith is commemorated in every Hajj.', difficulty: 'MEDIUM' },
    { unitId: unit9.id, externalId: 'fs-nw-jumuah-q6', type: 'MULTIPLE_CHOICE', questionText: 'Fasting on the 9th Dhul Hijjah (day of \'Arafah) is recommended for non-pilgrims. What is its reward?', options: ['Forgiveness for sins of the past year only', 'Expiation for the past and coming year', 'Equivalent to Hajj reward', 'Equivalent to 10 years of fasting'], correctAnswer: 'Expiation for the past and coming year', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Fasting on the day of \'Arafah — I hope Allah will expiate the sins of the year before it and the year after it." (Muslim)', difficulty: 'MEDIUM' },

    // ── Unit 10: Being a Believer ──
    { unitId: unit10.id, externalId: 'fs-nw-believer-q1', type: 'MULTIPLE_CHOICE', questionText: 'How many characteristics of successful believers are described in Surah al-Mu\'minun verses 1-11?', options: ['3', '5', '6', '7'], correctAnswer: '6', explanation: 'Surah al-Mu\'minun (23:1-11) lists six characteristics: khushu\' in salah, avoiding laghw (idle speech), performing zakah, guarding chastity, keeping trusts and promises, and maintaining salah.', difficulty: 'MEDIUM' },
    { unitId: unit10.id, externalId: 'fs-nw-believer-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is the correct understanding and use of "InshAllah"?', options: ['An excuse to avoid committing to anything', 'A cultural filler phrase with no specific meaning', 'A statement acknowledging that future actions depend on Allah\'s permission', 'Only used by Arabs in casual speech'], correctAnswer: "A statement acknowledging that future actions depend on Allah's permission", explanation: "The Quran (18:23-24) commands saying InshAllah when stating future intentions. It is a theological acknowledgment that our plans depend on Allah's will — not an escape from commitment.", difficulty: 'MEDIUM' },
    { unitId: unit10.id, externalId: 'fs-nw-believer-q3', type: 'TRUE_FALSE', questionText: '"Alhamdulillah" should be said only after completing major acts of worship.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Alhamdulillah should be said after any completed action, when good or bad things happen, after sneezing, and as a general expression of gratitude throughout the day. It is not restricted to major worship.', difficulty: 'EASY' },
    { unitId: unit10.id, externalId: 'fs-nw-believer-q4', type: 'FILL_BLANK', questionText: '"Bismillah" means ___ the name of Allah.', options: null, correctAnswer: 'In', explanation: '"Bismillah" (Bismillahi al-Rahman al-Rahim) means "In the name of Allah, the Most Gracious, the Most Merciful." It should be said at the beginning of every action.', difficulty: 'EASY' },
    { unitId: unit10.id, externalId: 'fs-nw-believer-q5', type: 'MULTIPLE_CHOICE', questionText: 'Which of these is explicitly listed as a characteristic of believers in Surah al-Mu\'minun (23:1-11)?', options: ['Performing Hajj every year', 'Guarding their chastity (sexual purity)', 'Praying in congregation', 'Fasting on Mondays and Thursdays'], correctAnswer: 'Guarding their chastity (sexual purity)', explanation: 'Verse 23:5 lists "those who guard their private parts (chastity) — except with their spouses" as a characteristic of successful believers.', difficulty: 'EASY' },
    { unitId: unit10.id, externalId: 'fs-nw-believer-q6', type: 'MULTIPLE_CHOICE', questionText: 'What does "SubhanAllah" express?', options: ['The mercy of Allah', 'The glory and perfection of Allah (free of all deficiency)', 'Gratitude for a blessing', 'Seeking Allah\'s forgiveness'], correctAnswer: 'The glory and perfection of Allah (free of all deficiency)', explanation: 'SubhanAllah means "Glory be to Allah" — declaring Allah completely free from all imperfection, deficiency, or anything that would not befit Him. It is said when seeing something magnificent or alarming.', difficulty: 'EASY' },
    // ── Unit 11: Self-Reformation & Mental Health ──
    { unitId: unit11.id, externalId: 'fs-nw-reform-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which is the FIRST stage of tazkiyah al-nafs (purification of the soul)?', options: ['Muraqabah (awareness)', 'Muhasabah (self-accounting)', 'Tawbah (repentance)', 'Mujahada (striving)'], correctAnswer: 'Tawbah (repentance)', explanation: 'Tawbah is the foundation of the spiritual journey. Before one can build virtues, one must sincerely turn back from sins to Allah. Muraqabah, muhasabah, and mujahada follow.', difficulty: 'MEDIUM' },
    { unitId: unit11.id, externalId: 'fs-nw-reform-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is muraqabah in the context of tazkiyah?', options: ['Punishing oneself for sins', 'Constant awareness of being watched by Allah', 'Formal dhikr sessions with a shaykh', 'Keeping a sin journal'], correctAnswer: 'Constant awareness of being watched by Allah', explanation: 'Muraqabah means living every moment with the awareness that Allah sees, knows, and is present. It is the station of ihsan: "Worship Allah as if you see Him — and if you cannot see Him, know that He sees you." (Bukhari)', difficulty: 'MEDIUM' },
    { unitId: unit11.id, externalId: 'fs-nw-reform-q3', type: 'TRUE_FALSE', questionText: 'Islam teaches that experiencing depression or anxiety is a sign of weak faith and poor relationship with Allah.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 himself experienced profound grief and anxiety. Prophets like Yunus and Ayyub \u0639\u0644\u064A\u0647\u0645 \u0627\u0644\u0633\u0644\u0627\u0645 experienced severe distress. These are human experiences, not indicators of weak faith.', difficulty: 'EASY' },
    { unitId: unit11.id, externalId: 'fs-nw-reform-q4', type: 'FILL_BLANK', questionText: 'The stage of tazkiyah that involves daily reviewing where one obeyed and where one fell short is called ___.', options: null, correctAnswer: 'muhasabah', explanation: 'Muhasabah (self-accounting) is a daily spiritual practice of honest self-review. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "The intelligent one evaluates himself and works for what comes after death."', difficulty: 'MEDIUM' },
    { unitId: unit11.id, externalId: 'fs-nw-reform-q5', type: 'MULTIPLE_CHOICE', questionText: 'Which Quranic verse states that hearts find rest in the remembrance of Allah?', options: ['Al-Baqarah 2:152', 'Al-Ra\'d 13:28', 'Al-Fatiha 1:5', 'Al-Inshirah 94:5'], correctAnswer: 'Al-Ra\'d 13:28', explanation: '"Ala bi-dhikrillahi tatma\'inn al-qulub" — "Truly, in the remembrance of Allah do hearts find rest." (13:28) Regular dhikr is central to Islamic mental wellbeing.', difficulty: 'MEDIUM' },
    { unitId: unit11.id, externalId: 'fs-nw-reform-q6', type: 'MULTIPLE_CHOICE', questionText: 'What is the Islamic stance on seeking professional counselling or therapy for mental health issues?', options: ['It is forbidden — Muslims should rely only on du\'a\' and Quran', 'It is permitted but shameful', 'It is permitted and encouraged — using the means Allah provided', 'It is only for non-Muslims'], correctAnswer: 'It is permitted and encouraged — using the means Allah provided', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Seek medicine — Allah has not created an illness without creating a cure." Mental health treatment is a legitimate and encouraged use of Allah\'s provisions.', difficulty: 'EASY' },

    // ── Unit 12: Prophetic Example ──
    { unitId: unit12.id, externalId: 'fs-nw-sunnah-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which Quranic verse explicitly links following the Sunnah of the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 to earning Allah\'s love?', options: ['Al-Baqarah 2:177', 'Al-Imran 3:31', 'Al-Nisa 4:136', 'Al-Anfal 8:2'], correctAnswer: 'Al-Imran 3:31', explanation: 'Al-Imran 3:31: "Say: If you love Allah, follow me — Allah will love you and forgive your sins." Following the Sunnah is the practical expression of love for the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 and the means of gaining Allah\'s love.', difficulty: 'MEDIUM' },
    { unitId: unit12.id, externalId: 'fs-nw-sunnah-q2', type: 'MULTIPLE_CHOICE', questionText: 'What does ittiba\' al-Sunnah mean?', options: ['Memorising all the hadiths', 'Following and emulating the Prophet\'s way in belief, worship, and character', 'Wearing Arab cultural clothing', 'Speaking Arabic only'], correctAnswer: "Following and emulating the Prophet's way in belief, worship, and character", explanation: "Ittiba' means following in the Prophet's footsteps — not just ritual acts, but his character, dealings, and entire way of life. It is an act of love, not mere compliance.", difficulty: 'EASY' },
    { unitId: unit12.id, externalId: 'fs-nw-sunnah-q3', type: 'TRUE_FALSE', questionText: 'Morning and evening adhkar (daily remembrances) are a confirmed Sunnah of the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 taught specific morning and evening adhkar. They include Ayat al-Kursi, the three Quls, Sayyid al-Istighfar, and others — forming a spiritual armour for the day.', difficulty: 'EASY' },
    { unitId: unit12.id, externalId: 'fs-nw-sunnah-q4', type: 'FILL_BLANK', questionText: 'Daily supplications and remembrances of Allah are collectively called ___ (plural of dhikr formulas).', options: null, correctAnswer: 'adhkar', explanation: 'Adhkar (singular: dhikr) are the formulas of remembrance taught by the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 for morning, evening, and specific occasions.', difficulty: 'EASY' },
    { unitId: unit12.id, externalId: 'fs-nw-sunnah-q5', type: 'MULTIPLE_CHOICE', questionText: 'Which of the following is a social sunnah of the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645?', options: ['Only greeting family members', 'Visiting the sick', 'Eating alone to avoid wasting food', 'Only giving salam to the elderly'], correctAnswer: 'Visiting the sick', explanation: 'Visiting the sick (\'iyadat al-marid) is a sunnah and a right of a Muslim upon another. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said the visitor "continues in the fruit garden of Jannah until he returns."', difficulty: 'EASY' },
    { unitId: unit12.id, externalId: 'fs-nw-sunnah-q6', type: 'MULTIPLE_CHOICE', questionText: 'According to hadith, what is the reward for one who revives a forgotten sunnah?', options: ['Reward equal to 10 people who practice it', 'Reward equal to 100 martyrs', 'Double reward of voluntary prayer', 'Forgiveness of all past sins'], correctAnswer: 'Reward equal to 100 martyrs', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Whoever revives a sunnah from my Sunnah that had been abandoned after my death, he will have the reward of all those who practice it, without reducing their reward at all." (Tirmidhi)', difficulty: 'HARD' },

    // ── Unit 13: Muslim Contributions ──
    { unitId: unit13.id, externalId: 'fs-nw-contrib-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which Muslim scholar developed algebra and gave us the word "algorithm"?', options: ['Ibn Sina', 'Al-Khwarizmi', 'Ibn al-Haytham', 'Al-Biruni'], correctAnswer: 'Al-Khwarizmi', explanation: "Muhammad ibn Musa al-Khwarizmi (780-850 CE) wrote the foundational algebra text. The word 'algebra' comes from 'al-jabr' in the title. The word 'algorithm' derives from the Latin transliteration of his name.", difficulty: 'EASY' },
    { unitId: unit13.id, externalId: 'fs-nw-contrib-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is the name of the world\'s oldest continuously operating university, founded in 859 CE?', options: ['Al-Azhar, Cairo', 'Al-Qarawiyyin, Fez', 'The University of Bologna', 'Bayt al-Hikmah, Baghdad'], correctAnswer: 'Al-Qarawiyyin, Fez', explanation: 'Al-Qarawiyyin in Fez, Morocco, founded by Fatima al-Fihri in 859 CE, is recognised by UNESCO and Guinness World Records as the oldest continuously operating university in the world.', difficulty: 'MEDIUM' },
    { unitId: unit13.id, externalId: 'fs-nw-contrib-q3', type: 'TRUE_FALSE', questionText: 'Coffee was first cultivated and popularised in Yemen and the Arabian Peninsula before spreading to the world.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Coffee originated in Ethiopia but was first cultivated, traded, and widely used in Yemen. Yemeni Sufis used it to stay awake for night prayers. Coffee spread from Yemen to Makkah, then the Ottoman Empire, then Europe.', difficulty: 'MEDIUM' },
    { unitId: unit13.id, externalId: 'fs-nw-contrib-q4', type: 'FILL_BLANK', questionText: 'The Muslim scholar known as the "Father of Optics" who proved that vision works by light entering the eye is ___.', options: null, correctAnswer: 'Ibn al-Haytham', explanation: "Ibn al-Haytham (965-1040 CE) wrote the seven-volume 'Book of Optics' — the most important work on optics until Newton. He proved that vision results from light reflected into the eye, not from rays emitted by the eye.", difficulty: 'MEDIUM' },
    { unitId: unit13.id, externalId: 'fs-nw-contrib-q5', type: 'MULTIPLE_CHOICE', questionText: 'Ibn Sina (Avicenna) is most famous for his foundational contributions to which field?', options: ['Astronomy', 'Mathematics', 'Medicine', 'Architecture'], correctAnswer: 'Medicine', explanation: "Ibn Sina's 'Canon of Medicine' was the standard medical textbook in European universities for 600 years. He described contagious disease, quarantine, and performed clinical trials 800 years before these became standard.", difficulty: 'EASY' },
    { unitId: unit13.id, externalId: 'fs-nw-contrib-q6', type: 'MULTIPLE_CHOICE', questionText: 'Which country has the world\'s largest Muslim population today?', options: ['Saudi Arabia', 'Pakistan', 'Bangladesh', 'Indonesia'], correctAnswer: 'Indonesia', explanation: 'Indonesia has approximately 240 million Muslims — the largest national Muslim population in the world. This demonstrates that Islam is not an Arab religion but a universal faith practiced across all cultures.', difficulty: 'EASY' },

    // ── Unit 14: Family, Marriage & Death ──
    { unitId: unit14.id, externalId: 'fs-nw-family-q1', type: 'MULTIPLE_CHOICE', questionText: 'What does "walimah" refer to?', options: ['The mahr (dowry) paid by the groom', 'The wedding feast after the nikah', 'The recitation of the khutbah at the nikah', 'The meeting of the two families before nikah'], correctAnswer: 'The wedding feast after the nikah', explanation: 'Walimah is the wedding feast held after the nikah — it is a sunnah mu\'akkadah (strongly recommended practice) of the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645. Accepting the invitation to walimah is also sunnah.', difficulty: 'EASY' },
    { unitId: unit14.id, externalId: 'fs-nw-family-q2', type: 'MULTIPLE_CHOICE', questionText: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "The best of you is the one who is best to ___."', options: ['his teachers', 'the poor', 'his family', 'his neighbours'], correctAnswer: 'his family', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "The best of you is the best to his family, and I am the best of you to my family." (Tirmidhi) Islamic excellence begins at home.', difficulty: 'EASY' },
    { unitId: unit14.id, externalId: 'fs-nw-family-q3', type: 'TRUE_FALSE', questionText: 'It is permissible to omit making an Islamic will (wasiyyah) if you have no major assets.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Every Muslim should have a wasiyyah, regardless of asset size. It records your wishes for distribution of whatever you have, ensures debts are recorded, and can include guidance for family. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said not to let two nights pass without a will.', difficulty: 'MEDIUM' },
    { unitId: unit14.id, externalId: 'fs-nw-family-q4', type: 'FILL_BLANK', questionText: 'The waiting period a widow must observe before she may remarry is called ___.', options: null, correctAnswer: 'iddah', explanation: "A widow's iddah is four months and ten days (Quran 2:234). During this time she remains at home and does not remarry. The iddah allows for confirmation of pregnancy and provides a period of mourning and stability.", difficulty: 'MEDIUM' },
    { unitId: unit14.id, externalId: 'fs-nw-family-q5', type: 'MULTIPLE_CHOICE', questionText: 'Which of the following is a condition for a valid Islamic marriage (nikah)?', options: ['Both parties must be Arab', 'A mahr (gift/dowry) from husband to wife', 'The wedding must take place in a masjid', 'The nikah must be announced on social media'], correctAnswer: 'A mahr (gift/dowry) from husband to wife', explanation: 'The mahr is a condition of nikah — a gift from the husband to the wife that belongs exclusively to her. Other conditions: offer and acceptance, two witnesses, and (in most schools) the wali (bride\'s guardian).', difficulty: 'MEDIUM' },
    { unitId: unit14.id, externalId: 'fs-nw-family-q6', type: 'MULTIPLE_CHOICE', questionText: 'Which Quranic verse places kindness to parents immediately after the commandment to worship Allah alone?', options: ['Al-Baqarah 2:83', "Al-Isra' 17:23", 'Al-Nisa 4:36', 'Luqman 31:14'], correctAnswer: "Al-Isra' 17:23", explanation: "Al-Isra' 17:23: 'Your Lord has decreed that you worship none but Him, and be good to parents. Whether one or both of them reach old age with you, say not to them a word of contempt, nor repel them — speak a gentle word.'", difficulty: 'MEDIUM' },

    // ── Unit 15: Community, Masjid & Free-Mixing ──
    { unitId: unit15.id, externalId: 'fs-nw-community-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which of the following is NOT traditionally a role of the masjid in Islamic society?', options: ['A place for the five daily prayers', 'Community education and halaqas', 'Supporting the poor and mediating disputes', 'Exclusively a place of silent ritual prayer with no social function'], correctAnswer: 'Exclusively a place of silent ritual prayer with no social function', explanation: 'The masjid in Islamic tradition served as centre of worship, education, community welfare, social cohesion, and civic consultation. The Prophet\'s masjid in Madinah was the hub of all communal life.', difficulty: 'EASY' },
    { unitId: unit15.id, externalId: 'fs-nw-community-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is ikhtilat?', options: ['The Friday sermon', 'Unrestricted free-mixing between non-mahram men and women', 'The Islamic concept of modesty (hijab)', 'Formal Islamic education'], correctAnswer: 'Unrestricted free-mixing between non-mahram men and women', explanation: 'Ikhtilat refers to unrestricted free-mixing between non-mahram men and women, which is generally prohibited in Islamic law as it creates conditions that may compromise chastity and modesty.', difficulty: 'EASY' },
    { unitId: unit15.id, externalId: 'fs-nw-community-q3', type: 'TRUE_FALSE', questionText: 'Islam prohibits all professional or academic interaction between men and women.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Islam does not prohibit all interaction. Professional, academic, and medical interaction in group settings for legitimate purposes is permitted. What is prohibited is unnecessary private one-on-one situations and social/intimate interaction between non-mahrams.', difficulty: 'EASY' },
    { unitId: unit15.id, externalId: 'fs-nw-community-q4', type: 'FILL_BLANK', questionText: 'The Arabic term for the global community of all Muslims worldwide is ___.', options: null, correctAnswer: 'Ummah', explanation: "Ummah refers to the entire community of Muslims worldwide. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 described it as 'one body — when one part suffers, the rest responds with fever and sleeplessness.' (Muslim)", difficulty: 'EASY' },
    { unitId: unit15.id, externalId: 'fs-nw-community-q5', type: 'MULTIPLE_CHOICE', questionText: 'Which of these is listed in hadith as a right (haqq) of a Muslim upon another Muslim?', options: ['Lending them money', 'Visiting them when sick', 'Performing their nikah', 'Teaching them Arabic'], correctAnswer: 'Visiting them when sick', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 listed six rights: returning the greeting, attending the sick, following the janazah, accepting invitations, saying yarhamukallah when one sneezes, and wishing good for the absent.', difficulty: 'MEDIUM' },
    { unitId: unit15.id, externalId: 'fs-nw-community-q6', type: 'MULTIPLE_CHOICE', questionText: 'What is the etiquette when arriving at the masjid before the congregation?', options: ['Wait outside until others arrive', 'Sit quietly and check your phone', 'Pray two rak\'at of tahiyyat al-masjid (greeting prayer)', 'Begin reciting the adhan immediately'], correctAnswer: "Pray two rak'at of tahiyyat al-masjid (greeting prayer)", explanation: "Tahiyyat al-masjid (greeting the masjid) — two rak'at on arrival — is a sunnah. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 commanded: 'When one of you enters the masjid, let him not sit until he has prayed two rak'at.' (Bukhari)", difficulty: 'MEDIUM' },
    // ── Unit 16: Ḥalāl Earnings, Zakāh & Ṣadaqah ──
    { unitId: unit16.id, externalId: 'fs-nw-zakat-q1', type: 'MULTIPLE_CHOICE', questionText: 'What is the approximate nisab (minimum threshold) for zakah on gold?', options: ['40 grams', '87.48 grams', '120 grams', '200 grams'], correctAnswer: '87.48 grams', explanation: 'The nisab for gold is 87.48 grams (equivalent to 20 mithqal). If one possesses this amount or more for a full lunar year, zakah at 2.5% becomes obligatory.', difficulty: 'HARD' },
    { unitId: unit16.id, externalId: 'fs-nw-zakat-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is the rate of zakah on gold, silver, cash, and trade goods above nisab?', options: ['1%', '2%', '2.5%', '5%'], correctAnswer: '2.5%', explanation: 'Zakah on gold, silver, cash savings, and trade goods is 2.5% (1/40) of the total value above nisab, provided a full lunar year (hawl) has passed while it remains above nisab.', difficulty: 'EASY' },
    { unitId: unit16.id, externalId: 'fs-nw-zakat-q3', type: 'TRUE_FALSE', questionText: 'Zakah may be used to build a masjid or fund Islamic education directly.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'The Quran (9:60) specifies only 8 categories of zakah recipients — they are all people, not causes. Building a masjid or general charitable projects are funded by sadaqah and voluntary donations, not obligatory zakah.', difficulty: 'MEDIUM' },
    { unitId: unit16.id, externalId: 'fs-nw-zakat-q4', type: 'FILL_BLANK', questionText: 'The minimum threshold of wealth above which zakah becomes obligatory is called ___.', options: null, correctAnswer: 'nisab', explanation: "Nisab is the minimum threshold set by the Shari'ah. Below nisab, no zakah is due. It is calculated based on the value of 87.48 grams of gold or 612.36 grams of silver.", difficulty: 'EASY' },
    { unitId: unit16.id, externalId: 'fs-nw-zakat-q5', type: 'MULTIPLE_CHOICE', questionText: 'How many categories of zakah recipients are specified in Surah al-Tawbah (9:60)?', options: ['4', '6', '7', '8'], correctAnswer: '8', explanation: 'Quran 9:60 specifies 8 categories: the very poor (fuqara\'), the poor (masakin), zakah administrators, those whose hearts are to be reconciled, for freeing captives, the heavily indebted, in the way of Allah, and stranded travellers.', difficulty: 'MEDIUM' },
    { unitId: unit16.id, externalId: 'fs-nw-zakat-q6', type: 'MULTIPLE_CHOICE', questionText: 'Which of the following makes income haram?', options: ['Working for a non-Muslim employer', 'Earning interest (riba) from savings', 'Working in a mixed-gender environment', 'Earning in a non-Muslim country'], correctAnswer: 'Earning interest (riba) from savings', explanation: 'Riba (interest) is explicitly prohibited. Haram income sources include riba, theft, fraud, selling haram items, and bribery. Working for a non-Muslim employer or in a mixed environment does not in itself make income haram.', difficulty: 'MEDIUM' },

    // ── Unit 17: Islamic Economics & Inheritance ──
    { unitId: unit17.id, externalId: 'fs-nw-economics-q1', type: 'MULTIPLE_CHOICE', questionText: 'What does "riba" mean in Islamic law?', options: ['A type of charitable donation', 'Any predetermined increase on a loan (usury/interest)', 'A halal investment structure', 'A form of partnership trading'], correctAnswer: 'Any predetermined increase on a loan (usury/interest)', explanation: 'Riba literally means "increase." In Islamic law it means any predetermined, contractually guaranteed return on a loan — regardless of the rate. It includes bank interest, predatory lending, and all forms of usury.', difficulty: 'EASY' },
    { unitId: unit17.id, externalId: 'fs-nw-economics-q2', type: 'MULTIPLE_CHOICE', questionText: 'In a mudarabah contract, what is the role of each partner?', options: ['Both partners contribute equal capital and share losses equally', 'One provides capital; the other provides expertise and management', 'One provides labour; the other provides the product to sell', 'Both partners guarantee returns to investors'], correctAnswer: 'One provides capital; the other provides expertise and management', explanation: 'Mudarabah (profit-sharing): the rabb al-mal provides capital; the mudarib provides expertise and manages the enterprise. Profits are shared by agreed ratio; the capital provider absorbs losses unless the mudarib was negligent.', difficulty: 'MEDIUM' },
    { unitId: unit17.id, externalId: 'fs-nw-economics-q3', type: 'TRUE_FALSE', questionText: 'Under Islamic inheritance law (fara\'id), a Muslim can freely override the Quranic shares by writing a personal will that distributes everything as they wish.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'A wasiyyah (will) may only direct up to 1/3 of the estate to non-heirs or additional bequests. The remaining 2/3+ must follow the fara\'id (Quranic shares). You cannot disinherit Quranic heirs via a will.', difficulty: 'MEDIUM' },
    { unitId: unit17.id, externalId: 'fs-nw-economics-q4', type: 'FILL_BLANK', questionText: 'The Islamic law of inheritance, with shares specified in the Quran, is called ___.', options: null, correctAnswer: "fara'id", explanation: "Fara'id (singular: faridah) are the Quranically specified inheritance shares. The Quran devotes detailed verses (4:11-12, 4:176) to inheritance — the most detailed financial rulings in the Quran.", difficulty: 'MEDIUM' },
    { unitId: unit17.id, externalId: 'fs-nw-economics-q5', type: 'MULTIPLE_CHOICE', questionText: 'Under Islamic fara\'id, what share does a single daughter receive when there are no sons?', options: ['One quarter (1/4)', 'One third (1/3)', 'Half (1/2)', 'Two thirds (2/3)'], correctAnswer: 'Half (1/2)', explanation: "A single daughter with no sons inherits half (1/2) the estate. Two or more daughters share 2/3. A son inherits double a daughter's share because he bears the full financial obligation of the family.", difficulty: 'MEDIUM' },
    { unitId: unit17.id, externalId: 'fs-nw-economics-q6', type: 'MULTIPLE_CHOICE', questionText: 'What is gharar in Islamic finance?', options: ['A form of halal partnership', 'Excessive uncertainty, speculation, or deception in a transaction', 'The markup in a murabaha contract', 'The minimum return required for investments'], correctAnswer: 'Excessive uncertainty, speculation, or deception in a transaction', explanation: 'Gharar means excessive uncertainty or deception. Transactions with unclear terms, selling what you do not own, derivatives speculation, and intentional misrepresentation are prohibited due to gharar.', difficulty: 'HARD' },

    // ── Unit 18: Addiction & Intoxicants ──
    { unitId: unit18.id, externalId: 'fs-nw-addiction-q1', type: 'MULTIPLE_CHOICE', questionText: 'In which Quranic surah and verse are intoxicants described as "filth from the work of Shaytan"?', options: ['Al-Baqarah 2:219', 'Al-Nisa 4:43', "Al-Ma'idah 5:90", 'Al-An\'am 6:145'], correctAnswer: "Al-Ma'idah 5:90", explanation: "Al-Ma'idah 5:90: 'O you who believe! Intoxicants, gambling, idols, and divining arrows are filth (rijs) from the work of Shaytan — so avoid it, that you may succeed.'", difficulty: 'MEDIUM' },
    { unitId: unit18.id, externalId: 'fs-nw-addiction-q2', type: 'TRUE_FALSE', questionText: 'The Islamic prohibition of khamr covers only alcohol and does not extend to drugs like cannabis or MDMA.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "Every intoxicant is khamr, and every khamr is haram." The ruling is about the effect — any substance that clouds the mind is prohibited, regardless of its name or chemical composition.', difficulty: 'EASY' },
    { unitId: unit18.id, externalId: 'fs-nw-addiction-q3', type: 'TRUE_FALSE', questionText: 'A Muslim who struggles with addiction has placed themselves beyond Allah\'s forgiveness and mercy.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Allah says: "Say: O My servants who have transgressed against themselves — do not despair of the mercy of Allah. Indeed, Allah forgives all sins." (39:53) No sin, including addiction, places someone beyond tawbah and divine mercy.', difficulty: 'EASY' },
    { unitId: unit18.id, externalId: 'fs-nw-addiction-q4', type: 'FILL_BLANK', questionText: 'The Arabic word for intoxicants that is used in the Quran and hadith to describe all prohibited mind-altering substances is ___.', options: null, correctAnswer: 'khamr', explanation: "Khamr literally means 'that which covers the mind.' The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 defined it as any substance that intoxicates — extending the ruling to all mind-altering substances.", difficulty: 'EASY' },
    { unitId: unit18.id, externalId: 'fs-nw-addiction-q5', type: 'MULTIPLE_CHOICE', questionText: 'Why does Islam protect the intellect (\'aql) as one of the five essential values?', options: ['The intellect is divine and cannot be harmed', 'The intellect enables worship, moral reasoning, and human dignity — intoxicants destroy it', 'Intellect is needed to memorise the Quran', 'To preserve Arabic grammar'], correctAnswer: 'The intellect enables worship, moral reasoning, and human dignity — intoxicants destroy it', explanation: "Islam's five essential values (daruriyyat al-khams) are life, intellect, lineage, property, and religion. The intellect is protected because it is the faculty that enables faith, moral reasoning, and human dignity.", difficulty: 'MEDIUM' },
    { unitId: unit18.id, externalId: 'fs-nw-addiction-q6', type: 'MULTIPLE_CHOICE', questionText: 'What is the first step in the Islamic framework for recovering from addiction?', options: ['Never discussing it with anyone', 'Sincere tawbah combined with practical support and removing triggers', 'Performing extra nafl prayers only', 'Moving to a new country'], correctAnswer: 'Sincere tawbah combined with practical support and removing triggers', explanation: 'Recovery begins with sincere tawbah — turning to Allah with remorse and resolve. This must be combined with practical steps: community support, professional help, removing triggers, and healthy alternatives.', difficulty: 'MEDIUM' },

    // ── Unit 19: Digital World ──
    { unitId: unit19.id, externalId: 'fs-nw-digital-q1', type: 'MULTIPLE_CHOICE', questionText: 'Which hadith warns against repeating everything one hears on social media or in conversation?', options: ['"The best of speech is the Quran."', '"It is enough sin for a man to repeat everything he hears."', '"Speak good or remain silent."', '"Verify before you testify."'], correctAnswer: '"It is enough sin for a man to repeat everything he hears."', explanation: 'The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "It is enough sin for a man to repeat everything he hears." (Muslim) This applies equally to sharing unverified content online.', difficulty: 'MEDIUM' },
    { unitId: unit19.id, externalId: 'fs-nw-digital-q2', type: 'MULTIPLE_CHOICE', questionText: 'When does gaming become haram in Islam?', options: ['Gaming is always haram for Muslims', 'When it causes neglect of salah, involves gambling, contains haram content, or becomes addictive', 'Only when played with non-Muslims', 'When it is played for more than 2 hours'], correctAnswer: 'When it causes neglect of salah, involves gambling, contains haram content, or becomes addictive', explanation: 'Games are not prohibited in themselves. They become haram when they cause neglect of obligatory duties (salah, family), involve gambling, contain haram content (graphic violence, pornography), or create addiction.', difficulty: 'MEDIUM' },
    { unitId: unit19.id, externalId: 'fs-nw-digital-q3', type: 'TRUE_FALSE', questionText: 'Criticising someone by name on social media or sharing their private information constitutes the same sin as verbal ghibah (backbiting).', options: ['True', 'False'], correctAnswer: 'True', explanation: "Ghibah is defined as mentioning your brother in a way he would dislike — whether spoken, written, or posted online. Digital backbiting carries the same ruling as verbal backbiting.", difficulty: 'EASY' },
    { unitId: unit19.id, externalId: 'fs-nw-digital-q4', type: 'FILL_BLANK', questionText: 'Speaking ill of an absent person in a way they would dislike is called ___ in Arabic, and carries the same ruling whether done verbally or online.', options: null, correctAnswer: 'ghibah', explanation: "Ghibah (backbiting) is a major sin in Islam. The Quran compares it to eating the flesh of your dead brother (49:12). It applies equally online.", difficulty: 'EASY' },
    { unitId: unit19.id, externalId: 'fs-nw-digital-q5', type: 'MULTIPLE_CHOICE', questionText: 'What does "digital hijab" refer to?', options: ['Wearing physical hijab in video calls', 'Maintaining Islamic standards of modesty and conduct online', 'Using VPN to hide internet activity', 'Only using Islamic websites'], correctAnswer: 'Maintaining Islamic standards of modesty and conduct online', explanation: "Digital hijab means applying the same Islamic standards of modesty that apply offline to one's online presence — not posting immodest images, not engaging in flirtatious messaging, not displaying awrah publicly.", difficulty: 'MEDIUM' },
    { unitId: unit19.id, externalId: 'fs-nw-digital-q6', type: 'MULTIPLE_CHOICE', questionText: 'What is the Islamic ruling on pornography?', options: ['It is makruh (disliked) but not haram', 'It is permitted if watched alone', 'It is unambiguously haram — it is looking at the awrah of non-mahram persons', 'It is only haram for women'], correctAnswer: 'It is unambiguously haram — it is looking at the awrah of non-mahram persons', explanation: 'Pornography is haram: it involves looking at the awrah of non-mahrams; it is zina of the eyes (the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said the eyes commit zina by looking at what is forbidden); and it is neurologically addictive.', difficulty: 'EASY' },

    // ── Unit 20: Discrimination & Materialism ──
    { unitId: unit20.id, externalId: 'fs-nw-society-q1', type: 'MULTIPLE_CHOICE', questionText: 'In the Farewell Sermon, the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 declared no Arab has superiority over a non-Arab except by what?', options: ['Wealth', 'Knowledge of Arabic', 'Taqwa (God-consciousness and piety)', 'Lineage from the Quraysh'], correctAnswer: 'Taqwa (God-consciousness and piety)', explanation: 'The Farewell Sermon: "No Arab has superiority over a non-Arab... except by taqwa." The Quran also states: "The most honoured of you in Allah\'s sight is the most God-conscious." (49:13)', difficulty: 'EASY' },
    { unitId: unit20.id, externalId: 'fs-nw-society-q2', type: 'MULTIPLE_CHOICE', questionText: 'Which Quranic surah warns against competition in worldly accumulation (al-takathur)?', options: ['Surah al-Asr (103)', 'Surah al-Takathur (102)', 'Surah al-Humaza (104)', 'Surah al-Maun (107)'], correctAnswer: 'Surah al-Takathur (102)', explanation: 'Surah al-Takathur (102:1-2): "Competition for worldly increase has distracted you — until you visit the graves." It warns that obsession with accumulating wealth diverts from the true purpose of life.', difficulty: 'EASY' },
    { unitId: unit20.id, externalId: 'fs-nw-society-q3', type: 'TRUE_FALSE', questionText: 'Zuhd in Islam means that Muslims must be poor and should avoid all worldly wealth.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Zuhd does not mean poverty. Many wealthy Companions (Uthman, Abd al-Rahman ibn Awf) were people of zuhd. It means not letting the dunya occupy the heart — using wealth as a means, not an end.', difficulty: 'MEDIUM' },
    { unitId: unit20.id, externalId: 'fs-nw-society-q4', type: 'FILL_BLANK', questionText: 'The Islamic concept of contentment with what Allah has provided — the opposite of materialism — is called ___.', options: null, correctAnswer: "qana'ah", explanation: "Qana'ah is the contentment and satisfaction with what Allah provides. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: 'Richness is not having many possessions — true richness is the richness of the soul.' (Bukhari)", difficulty: 'MEDIUM' },
    { unitId: unit20.id, externalId: 'fs-nw-society-q5', type: 'MULTIPLE_CHOICE', questionText: 'Which companion, a former Ethiopian slave who was tortured for his faith, was honoured as the first mu\'adhdhin of Islam?', options: ['Salman al-Farisi', 'Bilal ibn Rabah', 'Zayd ibn Harithah', 'Suhayb al-Rumi'], correctAnswer: 'Bilal ibn Rabah', explanation: 'Bilal ibn Rabah \u0631\u0636\u064A \u0627\u0644\u0644\u0647 \u0639\u0646\u0647 was a former Ethiopian slave tortured by Umayyah ibn Khalaf. After his freedom, the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 appointed him as the first mu\'adhdhin — a powerful statement of racial equality.', difficulty: 'EASY' },
    { unitId: unit20.id, externalId: 'fs-nw-society-q6', type: 'MULTIPLE_CHOICE', questionText: 'What is tawadu\' and why is it the antidote to materialism?', options: ['Silence; it stops arguments about money', 'Humility; it grounds the person in their true worth before Allah rather than worldly measures', 'Generosity; giving money reduces attachment to it', 'Fasting; it trains the body against appetite'], correctAnswer: "Humility; it grounds the person in their true worth before Allah rather than worldly measures", explanation: "Tawadu' means humility — seeing yourself in relation to Allah and others honestly. It undermines materialism's root: pride (kibr). When you are humble, worldly status loses its grip.", difficulty: 'MEDIUM' },
  ];

  // Insert quiz questions
  for (const q of quizData) {
    await prisma.question.upsert({
      where: { externalId: q.externalId },
      create: {
        externalId: q.externalId,
        unitId: q.unitId,
        type: q.type,
        questionText: q.questionText,
        options: q.options !== null ? JSON.stringify(q.options) : null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      },
      update: {
        unitId: q.unitId,
        type: q.type,
        questionText: q.questionText,
        options: q.options !== null ? JSON.stringify(q.options) : null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      },
    });
  }
  console.log(`\u2705 Created ${quizData.length} quiz questions`);
  // ══════════════════════════════════════════════
  // FLASHCARDS — 34 total (2 per unit for units 1-14; 1 per unit for units 15-20)
  // ══════════════════════════════════════════════

  const flashcardData: Array<{
    unitId: string; front: string; back: string;
    category: string; tags: string[];
  }> = [
    // ── Unit 1: Core ʿAqīdah ──
    { unitId: unit1.id, front: 'Arkan al-Iman', back: 'The six articles of faith: (1) Allah, (2) angels, (3) divine books, (4) prophets, (5) the Last Day, (6) qadar (divine decree)', category: 'Vocabulary', tags: ['further-studies-nw', 'aqidah'] },
    { unitId: unit1.id, front: 'Tawhid', back: "The absolute oneness of Allah — in essence, attributes, and exclusive right to worship. The foundation of the Shahadah.", category: 'Vocabulary', tags: ['further-studies-nw', 'aqidah'] },
    // ── Unit 2: Ṭahārah ──
    { unitId: unit2.id, front: 'Tahir mutahhir', back: 'Pure and purifying water (e.g., rain, river, sea water) — valid for wudu\' and removing najasah', category: 'Vocabulary', tags: ['further-studies-nw', 'taharah'] },
    { unitId: unit2.id, front: 'Tayammum', back: 'Dry ritual purification using clean earth as a substitute for wudu\' or ghusl when water is unavailable or medically harmful', category: 'Vocabulary', tags: ['further-studies-nw', 'taharah'] },
    // ── Unit 3: Ṣalāh ──
    { unitId: unit3.id, front: "Wajibat al-salah", back: "Obligatory acts of salah whose inadvertent omission requires sajdah as-sahw. Includes reciting al-Fatiha in every rak'ah, tashahhud in qa'dah ula, and taslim.", category: 'Vocabulary', tags: ['further-studies-nw', 'salah'] },
    { unitId: unit3.id, front: 'Sajdah as-sahw', back: "Prostration of forgetfulness — two sujud performed after the final tashahhud to compensate for an inadvertently omitted wajib act of salah", category: 'Vocabulary', tags: ['further-studies-nw', 'salah'] },
    // ── Unit 4: Du'a' & Calendar ──
    { unitId: unit4.id, front: "Du'a'", back: "Supplication — calling upon Allah directly. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 called it 'the essence of worship'", category: 'Vocabulary', tags: ['further-studies-nw', 'devotion'] },
    { unitId: unit4.id, front: "'Ashura'", back: "The 10th of Muharram — fasting on this day expiates the previous year's minor sins. It commemorates Allah's saving of Musa \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645 from Pharaoh", category: 'Vocabulary', tags: ['further-studies-nw', 'calendar'] },
    // ── Unit 5: Attributes of Allāh ──
    { unitId: unit5.id, front: 'Sifat Dhatiyyah', back: "The six essential attributes of Allah that cannot hypothetically be negated: Wujud (existence), Qidam (pre-eternity), Baqa' (everlastingness), Qiyam binafsih (self-subsistence), Wahdaniyyah (oneness), Mukhalafah lil-hawadith (difference from creation)", category: 'Vocabulary', tags: ['further-studies-nw', 'faith', 'aqidah'] },
    { unitId: unit5.id, front: "Sifat al-Ma'ani", back: "The seven attributes of meaning Allah necessarily possesses: Hayah (life), 'Ilm (knowledge), Qudrah (power), Iradah (will), Sam' (hearing), Basar (sight), Kalam (speech)", category: 'Vocabulary', tags: ['further-studies-nw', 'faith', 'aqidah'] },
    // ── Unit 6: Prophethood & Qurʾān ──
    { unitId: unit6.id, front: "I'jaz al-Quran", back: "The miraculous inimitability of the Quran — its linguistic, structural, and prophetic dimensions that render all attempts to produce its like impossible. The standing challenge: produce one chapter like it (2:23)", category: 'Vocabulary', tags: ['further-studies-nw', 'quran', 'faith'] },
    { unitId: unit6.id, front: 'Surah al-Rum (30:1-4)', back: "The prophecy that Rome would defeat Persia 'within a few years' — fulfilled precisely at the Battle of Issus (628 CE), confirming the Quran's divine origin", category: 'Vocabulary', tags: ['further-studies-nw', 'quran', 'faith'] },
    // ── Unit 7: Search for Truth ──
    { unitId: unit7.id, front: "Afala ta'qilun", back: "'Will you not reason / use your intellect?' — Quranic phrase (used 50+ times) that embodies Islam's call to intellectual reflection and rational engagement with faith", category: 'Vocabulary', tags: ['further-studies-nw', 'faith'] },
    { unitId: unit7.id, front: 'Ulama', back: "Islamic scholars who have completed traditional religious education (Quran, hadith, fiqh, theology). They are the qualified religious authorities for fatwa, guidance, and teaching", category: 'Vocabulary', tags: ['further-studies-nw', 'knowledge'] },
    // ── Unit 8: Deepening Ṣalāh ──
    { unitId: unit8.id, front: "Khushu'", back: "Humble, focused presence of heart in salah — knowing you are standing before Allah. The first characteristic of successful believers (23:2). Developed by learning meaning, slowing down, and minimising distractions", category: 'Vocabulary', tags: ['further-studies-nw', 'salah', 'devotion'] },
    { unitId: unit8.id, front: 'Tahajjud (Qiyam al-Layl)', back: 'Voluntary night prayer — ideally in the last third of the night before Fajr. The most virtuous voluntary prayer. Allah descends and calls: "Is there anyone seeking forgiveness?" (hadith)', category: 'Vocabulary', tags: ['further-studies-nw', 'salah', 'devotion'] },
    // ── Unit 9: Jumu'ah, Sawm & Hajj ──
    { unitId: unit9.id, front: "Wuquf al-'Arafah", back: "The standing at the plain of 'Arafah on 9th Dhul Hijjah — the most important day of Hajj. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: 'Hajj is 'Arafah.' Without it, Hajj is invalid.", category: 'Vocabulary', tags: ['further-studies-nw', 'hajj'] },
    { unitId: unit9.id, front: '6 Days of Shawwal', back: 'Voluntary fasts of 6 days in the month of Shawwal after Ramadan. Reward equivalent to fasting the entire year (Ramadan = 10 months\' reward; 6 days = 2 months).', category: 'Vocabulary', tags: ['further-studies-nw', 'fasting'] },
    // ── Unit 10: Being a Believer ──
    { unitId: unit10.id, front: "Surah al-Mu'minun 23:1-11", back: "Lists characteristics of successful believers: khushu' in salah, avoiding laghw, performing zakah, guarding chastity, keeping trusts/promises, maintaining salah. Promise: they will inherit al-Firdaws (highest paradise).", category: 'Vocabulary', tags: ['further-studies-nw', 'quran', 'identity'] },
    { unitId: unit10.id, front: 'Mu\'min', back: "A true believer — one who holds the six articles of faith and expresses them in worship, character, and daily life. Surah al-Mu'minun describes their defining characteristics.", category: 'Vocabulary', tags: ['further-studies-nw', 'identity'] },
    // ── Unit 11: Self-Reformation ──
    { unitId: unit11.id, front: 'Tazkiyah al-nafs', back: "Purification of the soul — the ongoing spiritual process of removing vices (hasad, kibr, riya') and cultivating virtues (tawadu', shukr, tawakkul). The four stages: tawbah, muraqabah, muhasabah, mujahada.", category: 'Vocabulary', tags: ['further-studies-nw', 'tazkiyah', 'identity'] },
    { unitId: unit11.id, front: 'Muraqabah', back: "Constant awareness of being watched by Allah in every moment and action. The station of ihsan: 'Worship Allah as if you see Him — and if you cannot see Him, know that He sees you.' (Bukhari)", category: 'Vocabulary', tags: ['further-studies-nw', 'tazkiyah', 'identity'] },
    // ── Unit 12: Prophetic Example ──
    { unitId: unit12.id, front: "Ittiba' al-Sunnah", back: "Following and emulating the Prophet's \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 way in belief, worship, and character — the practical expression of love for him. Quran 3:31 promises that it results in Allah's love and forgiveness.", category: 'Vocabulary', tags: ['further-studies-nw', 'sunnah', 'identity'] },
    { unitId: unit12.id, front: 'Sayyid al-Istighfar', back: 'The master prayer for forgiveness — a comprehensive morning supplication taught by the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645. Saying it with conviction in the morning or evening and dying that day earns Paradise.', category: 'Vocabulary', tags: ['further-studies-nw', 'sunnah', 'dhikr'] },
    // ── Unit 13: Muslim Contributions ──
    { unitId: unit13.id, front: 'Al-Qarawiyyin', back: "The world's oldest continuously operating university, founded in Fez, Morocco, in 859 CE by Fatima al-Fihri. Recognised by UNESCO and Guinness World Records.", category: 'Vocabulary', tags: ['further-studies-nw', 'history'] },
    { unitId: unit13.id, front: 'Ibn al-Haytham', back: "Father of modern optics (965-1040 CE). Wrote the seven-volume 'Book of Optics' proving light enters the eye (not rays leaving it). Influenced European science for 500 years.", category: 'Vocabulary', tags: ['further-studies-nw', 'history', 'science'] },
    // ── Unit 14: Family, Marriage & Death ──
    { unitId: unit14.id, front: 'Nikah', back: 'The Islamic marriage contract — a sacred covenant. Conditions: offer and acceptance, two witnesses, wali (guardian), and mahr (dowry). It is a sunnah and half the religion.', category: 'Vocabulary', tags: ['further-studies-nw', 'family'] },
    { unitId: unit14.id, front: 'Wasiyyah', back: 'An Islamic will — a document recording your wishes for the distribution of your estate after death. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: "A Muslim who has anything to bequeath should not let two nights pass without a will." (Bukhari)', category: 'Vocabulary', tags: ['further-studies-nw', 'family', 'death'] },
    // ── Unit 15: Community ──
    { unitId: unit15.id, front: 'Ikhtilat', back: "Unrestricted free-mixing between non-mahram men and women — generally prohibited in Islam. Professional/academic group interaction for legitimate need is permitted with Islamic standards maintained.", category: 'Vocabulary', tags: ['further-studies-nw', 'community', 'fiqh'] },
    // ── Unit 16: Zakah ──
    { unitId: unit16.id, front: 'Nisab', back: 'The minimum threshold of wealth above which zakah becomes obligatory. For gold: 87.48g. For silver: 612.36g. Cash zakah uses whichever is lower. Must be held for a full lunar year (hawl).', category: 'Vocabulary', tags: ['further-studies-nw', 'zakah', 'money'] },
    // ── Unit 17: Economics & Inheritance ──
    { unitId: unit17.id, front: 'Riba', back: "Usury/interest — any predetermined, contractually guaranteed increase on a loan. Explicitly prohibited in the Quran (2:275). Includes bank interest, predatory lending, and all forms of usury.", category: 'Vocabulary', tags: ['further-studies-nw', 'economics', 'money'] },
    // ── Unit 18: Addiction ──
    { unitId: unit18.id, front: 'Khamr', back: "Intoxicants — literally 'that which covers the mind.' The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 said: 'Every intoxicant is khamr, and every khamr is haram.' Applies to all mind-altering substances.", category: 'Vocabulary', tags: ['further-studies-nw', 'contemporary', 'fiqh'] },
    // ── Unit 19: Digital World ──
    { unitId: unit19.id, front: 'Ghibah (digital)', back: 'Backbiting online — criticising someone by name, sharing their faults or private information, posting screenshots of private conversations. Carries the same ruling as verbal ghibah (a major sin).', category: 'Vocabulary', tags: ['further-studies-nw', 'contemporary', 'character'] },
    // ── Unit 20: Discrimination & Materialism ──
    { unitId: unit20.id, front: 'Zuhd', back: "Detachment from the dunya — not letting worldly wealth or status occupy the heart. It does not mean poverty; wealthy Companions had zuhd. The opposite of materialism.", category: 'Vocabulary', tags: ['further-studies-nw', 'character', 'contemporary'] },
  ];

  // Delete flashcards per unit then re-create
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
        category: fc.category,
        tags: fc.tags,
        orderIndex: flashcardData.filter(f => f.unitId === fc.unitId).indexOf(fc),
      },
    });
  }
  console.log(`\u2705 Created ${flashcardData.length} flashcards`);
  // ══════════════════════════════════════════════
  // ARABIC TERMS — 25 total (2 per unit for units 1-5; 1 per unit for units 6-20)
  // ══════════════════════════════════════════════

  const arabicTermsData: Array<{
    unitId: string; arabicText: string; transliteration: string; translation: string;
  }> = [
    // ── Unit 1: Core ʿAqīdah ──
    { unitId: unit1.id, arabicText: '\u0623\u064E\u0631\u0652\u0643\u064E\u0627\u0646\u064F \u0627\u0644\u0652\u0625\u064A\u0645\u064E\u0627\u0646\u0650', transliteration: "Ark\u0101n al-\u012Em\u0101n", translation: 'The six pillars (articles) of Islamic faith' },
    { unitId: unit1.id, arabicText: '\u0627\u0644\u0634\u064E\u0651\u0647\u064E\u0627\u062F\u064E\u062A\u064E\u0627\u0646\u0650', transliteration: "Al-Shah\u0101datayn", translation: 'The two declarations of faith: la ilaha illallah and Muhammadun rasulullah' },
    // ── Unit 2: Ṭahārah ──
    { unitId: unit2.id, arabicText: '\u0627\u0644\u0637\u064E\u0651\u0647\u064E\u0627\u0631\u064E\u0629\u064F', transliteration: "Al-\u1E6Cah\u0101rah", translation: 'Ritual purity — the state required for salah and handling the Quran' },
    { unitId: unit2.id, arabicText: '\u0627\u0644\u062A\u064E\u064A\u064E\u0645\u064F\u0651\u0645\u064F', transliteration: 'Al-Tayammum', translation: 'Dry ablution using clean earth — a substitute for wudu\' or ghusl when water is unavailable' },
    // ── Unit 3: Ṣalāh ──
    { unitId: unit3.id, arabicText: '\u0627\u0644\u0641\u064E\u0631\u064E\u0627\u0626\u0650\u0636\u064F', transliteration: "Al-Far\u0101\u02BFi\u1E0D", translation: "Obligatory acts — those whose omission invalidates wudu' or salah" },
    { unitId: unit3.id, arabicText: '\u0633\u062C\u062F\u064E\u0629\u064F \u0627\u0644\u0633\u064E\u0651\u0647\u0652\u0648\u0650', transliteration: "Sajdat al-Sahw", translation: 'Prostration of forgetfulness — two sujud to remedy inadvertent omission of a wajib in salah' },
    // ── Unit 4: Du'a' & Calendar ──
    { unitId: unit4.id, arabicText: '\u0627\u0644\u062F\u064F\u0651\u0639\u064E\u0627\u0621\u064F', transliteration: "Al-Du'\u0101'", translation: "Supplication — calling upon Allah directly. The Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 called it 'the essence of worship'" },
    { unitId: unit4.id, arabicText: '\u0639\u064E\u0627\u0634\u0648\u0631\u064E\u0627\u0621\u064F', transliteration: "\u02BF\u0100sh\u016Br\u0101\u02BE", translation: "The 10th of Muharram — fasting on this day expiates the previous year's minor sins" },
    // ── Unit 5: Attributes of Allāh ──
    { unitId: unit5.id, arabicText: '\u0627\u0644\u0635\u0651\u0650\u0641\u064E\u0627\u062A\u064F \u0627\u0644\u0630\u064E\u0651\u0627\u062A\u0650\u064A\u0651\u064E\u0629\u064F', transliteration: "Al-\u1E62if\u0101t al-Dh\u0101tiyyah", translation: "The six essential attributes of Allah that cannot be negated: existence, pre-eternity, everlastingness, self-subsistence, oneness, and difference from creation" },
    { unitId: unit5.id, arabicText: '\u0627\u0644\u0642\u0650\u062F\u064E\u0645\u064F', transliteration: 'Al-Qidam', translation: "Allah's attribute of pre-eternity — He has absolutely no beginning" },
    // ── Unit 6: Prophethood & Qurʾān ──
    { unitId: unit6.id, arabicText: '\u0625\u0639\u062C\u0627\u0632\u064F \u0627\u0644\u0642\u064F\u0631\u0652\u0622\u0646\u0650', transliteration: "I'\u0101z al-Qur'\u0101n", translation: "The miraculous inimitability of the Quran — its unique linguistic, prophetic, and structural qualities that render imitation impossible" },
    // ── Unit 7: Search for Truth ──
    { unitId: unit7.id, arabicText: '\u0627\u0644\u0627\u062C\u062A\u0647\u0627\u062F\u064F', transliteration: 'Al-Ijtih\u0101d', translation: "Independent scholarly reasoning applied to derive new rulings for new situations within the framework of Islamic law" },
    // ── Unit 8: Deepening Ṣalāh ──
    { unitId: unit8.id, arabicText: '\u0627\u0644\u062E\u064F\u0634\u064F\u0648\u0639\u064F', transliteration: "Al-Khush\u016B\u02BC", translation: 'Humble, focused presence of heart in salah — standing before Allah with full attention and reverence' },
    // ── Unit 9: Jumu'ah, Sawm & Hajj ──
    { unitId: unit9.id, arabicText: '\u0627\u0644\u0648\u064F\u0642\u064F\u0648\u0641\u064F', transliteration: "Al-Wuq\u016Bf", translation: "The standing at 'Arafah — the most essential pillar of Hajj. 'Hajj is 'Arafah.' (hadith)" },
    // ── Unit 10: Being a Believer ──
    { unitId: unit10.id, arabicText: '\u0627\u0644\u0645\u064F\u0624\u0645\u0650\u0646\u064F', transliteration: "Al-Mu'min", translation: "The true believer — one who holds sincere faith in the six articles of iman and expresses them in worship and character" },
    // ── Unit 11: Self-Reformation ──
    { unitId: unit11.id, arabicText: '\u062A\u064E\u0632\u0652\u0643\u0650\u064A\u064E\u0629\u064F \u0627\u0644\u0646\u064E\u0651\u0641\u0652\u0633\u0650', transliteration: "Tazkiyat al-Nafs", translation: "Purification of the soul — the ongoing spiritual process of removing vices and cultivating virtues through tawbah, muraqabah, muhasabah, and mujahada" },
    // ── Unit 12: Prophetic Example ──
    { unitId: unit12.id, arabicText: '\u0627\u0644\u0627\u062A\u0651\u0650\u0628\u064E\u0627\u0639\u064F', transliteration: "Al-Ittib\u0101\u02BC", translation: "Following and emulating the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 in all aspects of life as an expression of love for him" },
    // ── Unit 13: Contributions ──
    { unitId: unit13.id, arabicText: '\u0627\u0644\u0623\u064F\u0645\u064E\u0651\u0629\u064F', transliteration: 'Al-Ummah', translation: "The global community of all Muslims — described by the Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645 as 'one body' in mutual care and solidarity" },
    // ── Unit 14: Family, Marriage & Death ──
    { unitId: unit14.id, arabicText: '\u0627\u0644\u0646\u0650\u0651\u0643\u064E\u0627\u062D\u064F', transliteration: 'Al-Nik\u0101h', translation: 'The Islamic marriage contract — a sacred covenant requiring offer/acceptance, witnesses, wali, and mahr' },
    // ── Unit 15: Community ──
    { unitId: unit15.id, arabicText: '\u0627\u0644\u0627\u062E\u062A\u0650\u0644\u064E\u0627\u0637\u064F', transliteration: 'Al-Ikhtil\u0101\u1E6D', translation: "Unrestricted free-mixing between non-mahram men and women — generally prohibited in Islamic law" },
    // ── Unit 16: Zakah ──
    { unitId: unit16.id, arabicText: '\u0627\u0644\u0646\u0650\u0651\u0635\u064E\u0627\u0628\u064F', transliteration: 'Al-Nis\u0101b', translation: 'The minimum threshold of wealth above which zakah becomes obligatory (87.48g gold / 612.36g silver)' },
    // ── Unit 17: Economics ──
    { unitId: unit17.id, arabicText: '\u0627\u0644\u0631\u0650\u0651\u0628\u064E\u0627', transliteration: 'Al-Rib\u0101', translation: 'Usury/interest — any predetermined increase on a loan. Explicitly prohibited in the Quran (2:275).' },
    // ── Unit 18: Addiction ──
    { unitId: unit18.id, arabicText: '\u0627\u0644\u062E\u064E\u0645\u0652\u0631\u064F', transliteration: 'Al-Khamr', translation: "Intoxicants — any substance that clouds the mind. 'Every intoxicant is khamr, and every khamr is haram.' (Prophet \u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645)" },
    // ── Unit 19: Digital ──
    { unitId: unit19.id, arabicText: '\u0627\u0644\u063A\u0650\u064A\u0628\u064E\u0629\u064F', transliteration: 'Al-G\u012Bbah', translation: "Backbiting — mentioning someone in a way they would dislike, whether spoken or online. A major sin likened to eating the flesh of one's dead brother (49:12)" },
    // ── Unit 20: Society ──
    { unitId: unit20.id, arabicText: '\u0627\u0644\u0632\u064F\u0651\u0647\u0652\u062F\u064F', transliteration: 'Al-Zuhd', translation: "Detachment from worldly excess — not letting the dunya occupy the heart. Not poverty, but freedom from materialism's grip" },
  ];

  // Delete and re-create Arabic terms for each unit
  const uniqueUnitIds = [...new Set(arabicTermsData.map(t => t.unitId))];
  for (const unitId of uniqueUnitIds) {
    await prisma.arabicTerm.deleteMany({ where: { unitId } });
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
  console.log(`\u2705 Created ${arabicTermsData.length} Arabic terms`);

  console.log('\n\uD83C\uDF89 An Nasihah Further Studies (NW) seed complete!');
  console.log('   Course: An Nasihah Further Studies (North West)');
  console.log('   Units: 20 focused units (was 9 broad units)');
  console.log('   Questions: 120 (6 per unit)');
  console.log('   Flashcards: 34 (2 per unit for units 1\u201314; 1 per unit for units 15\u201320)');
  console.log('   Arabic Terms: 25 (2 per unit for units 1\u20135; 1 per unit for units 6\u201320)');
}

// ──────────────────────────────────────────────
// Standalone execution
// ──────────────────────────────────────────────
async function main() {
  try {
    await seedMaktabFurtherStudiesNW();
    console.log('');
    console.log('\u2728 Seed completed successfully!');
  } catch (error) {
    console.error('\u274C Error seeding An Nasihah Further Studies (NW):', error);
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