/**
 * Seed file for Maktab Coursebook 7 (CB7) — Age 12–13
 * 14 focused single-topic units
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedMaktabCoursebook7() {
  // Demo child (not applicable in this seed)
  const demoChild: { id: string } | null = null;

  // Course upsert
  const course = await prisma.course.upsert({
    where: { slug: 'maktab-coursebook-7' },
    update: { title: 'Maktab Coursebook 7', description: 'Advanced Islamic studies for ages 12–13, covering fiqh, ahadith, sirah, tarikh, aqaid, akhlaq and adab.', category: 'FIQH', ageLevels: ['TEEN'], isPublished: true },
    create: { slug: 'maktab-coursebook-7', title: 'Maktab Coursebook 7', description: 'Advanced Islamic studies for ages 12–13, covering fiqh, ahadith, sirah, tarikh, aqaid, akhlaq and adab.', category: 'FIQH', ageLevels: ['TEEN'], isPublished: true },
  });

  // Remove old broad units if they exist
  const oldSlugs = ['maktab-7-fiqh','maktab-7-ahadith','maktab-7-sirah','maktab-7-tarikh','maktab-7-aqaid','maktab-7-akhlaq','maktab-7-adab'];
  for (const slug of oldSlugs) {
    const old = await prisma.unit.findFirst({ where: { courseId: course.id, slug } });
    if (old) {
      await prisma.question.deleteMany({ where: { unitId: old.id } });
      await prisma.unitProgress.deleteMany({ where: { unitId: old.id } });
      await prisma.unit.delete({ where: { id: old.id } });
    }
  }

  // ─── UNIT 1 ─────────────────────────────────────────────────────────────────
  const unit1Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: list the makruhat of salah, explain the purpose of a sutrah, describe the method of sajdah tilawah, outline the conditions and rulings of qasr salah, and explain how a sick person performs salah.</p>

<h3>Makruhat of Salah — Disliked Acts</h3>
<p>Makruhat are acts that reduce the reward of salah without invalidating it. Examples include: unnecessary fidgeting or movement, looking around instead of keeping the gaze at the place of sajdah, praying when one urgently needs to use the bathroom, cracking knuckles or playing with clothing, and praying directly in front of images or open fire.</p>
<p><strong>Why avoid them?</strong> Salah requires full concentration (khushu'). Makruhat distract the heart and lower the spiritual value of prayer.</p>

<h3>Sutrah — The Barrier in Front of the Musalli</h3>
<p>A sutrah is an object placed in front of a praying person to mark their prayer space and prevent disruption by passers-by. It should be at least 30 cm tall. A wall, pillar, stick, or bag may serve as a sutrah. People must not walk between the musalli and the sutrah.</p>

<h3>Sajdah Tilawah — Prostration of Recitation</h3>
<p>Sajdah tilawah is a wajib (necessary) prostration performed when a verse of prostration (ayat al-sajdah) is recited or heard. There are 14 such verses in the Quran.</p>
<p><strong>Method:</strong> Face the qiblah with wudu'. Say "Allahu Akbar" and go into sajdah. Recite "Subhana Rabbiyyal A'la" at least three times. Say "Allahu Akbar" and rise. No taslim is needed when performed outside of salah.</p>

<h3>Qasr Salah — Shortening Prayers During Travel</h3>
<p>A Muslim travelling a minimum of 48 miles (approx. 77 km) may shorten certain prayers: Zuhr (4 becomes 2), Asr (4 becomes 2), Isha (4 becomes 2). Fajr and Maghrib are not shortened. Qasr continues until the traveller intends to stay in one place for 15 or more days.</p>

<h3>Salah for the Sick and Unable</h3>
<p>Islam always accommodates those who cannot pray in the usual way: unable to stand → pray sitting; unable to sit → pray lying down; unable to perform ruku' and sajdah → use gestures, bowing the head lower for sajdah than for ruku'. Allah never removes the obligation of salah — only the method adapts to one's ability.</p>
`.trim();

  const unit1 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-fiqh-salah-advanced' } },
    update: { title: 'Fiqh \u2014 Advanced \u1e62al\u0101h Topics', description: 'Makruhat of salah, sutrah, sajdah tilawah, qasr salah, and prayer for the sick.', content: unit1Content, orderIndex: 1 },
    create: { courseId: course.id, slug: 'maktab-7-fiqh-salah-advanced', title: 'Fiqh \u2014 Advanced \u1e62al\u0101h Topics', description: 'Makruhat of salah, sutrah, sajdah tilawah, qasr salah, and prayer for the sick.', content: unit1Content, orderIndex: 1 },
  });

  // ─── UNIT 2 ─────────────────────────────────────────────────────────────────
  const unit2Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: state the conditions for zakah, identify the nisab for gold and silver, name the eight categories of zakah recipients, and outline the basic shares in Islamic inheritance (faraid).</p>

<h3>Zakah — Conditions and Nisab</h3>
<p>Zakah is obligatory when five conditions are met: (1) the person is Muslim and free, (2) the nisab (minimum threshold) has been reached, (3) one full lunar year has passed on that wealth, (4) the wealth is surplus to basic needs, (5) the wealth is of a zakatable type.</p>
<p><strong>Nisab:</strong> Gold — 87.5 grams; Silver — 612.5 grams; Trade goods — value equivalent to nisab of silver; Livestock — specific counts of camels, cattle, and sheep. The zakah rate on most wealth is 2.5%.</p>

<h3>Eight Recipients of Zakah (Quran 9:60)</h3>
<ol>
  <li>The poor (fuqara)</li>
  <li>The destitute (masakin)</li>
  <li>Those employed to collect zakah (amilun)</li>
  <li>Those whose hearts are to be reconciled (mu'allafat al-qulub)</li>
  <li>For freeing slaves (riqab)</li>
  <li>The debt-ridden (gharimun)</li>
  <li>In the path of Allah (fi sabilillah)</li>
  <li>The wayfarer — stranded traveller (ibn al-sabil)</li>
</ol>

<h3>Islamic Inheritance — Faraid Basics</h3>
<p>Allah prescribed fixed shares for heirs in the Quran (4:11–12). Primary heirs include the husband, wife, son, daughter, father, and mother. Fixed shares: <strong>1/2</strong> (one daughter, husband when no children), <strong>1/4</strong> (husband with children, wife without children), <strong>1/8</strong> (wife with children), <strong>2/3</strong> (two or more daughters), <strong>1/3</strong> (mother in some cases), <strong>1/6</strong> (father/mother alongside children).</p>
<p><strong>Residual heirs (asabah)</strong> — male relatives such as the son, father, and brother receive what remains after fixed shares are distributed.</p>
`.trim();

  const unit2 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-fiqh-zakah-inheritance' } },
    update: { title: 'Fiqh \u2014 Zak\u0101h & Inheritance', description: 'Conditions of zakah, nisab, eight recipients, and basics of Islamic inheritance.', content: unit2Content, orderIndex: 2 },
    create: { courseId: course.id, slug: 'maktab-7-fiqh-zakah-inheritance', title: 'Fiqh \u2014 Zak\u0101h & Inheritance', description: 'Conditions of zakah, nisab, eight recipients, and basics of Islamic inheritance.', content: unit2Content, orderIndex: 2 },
  });

  // ─── UNIT 3 ─────────────────────────────────────────────────────────────────
  const unit3Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: define i'tikaf and its ruling, identify the special nights of Laylatul Qadr, categorise halal and haram foods, and explain the conditions and method of udh-hiyah.</p>

<h3>I'tikaf — Seclusion in the Masjid</h3>
<p>I'tikaf means staying in the masjid with the intention of worship, cutting off from worldly activity. Performing i'tikaf during the last ten nights of Ramadan is Sunnah Mu'akkadah (confirmed sunnah). Conditions: being in a state of purity (wudu'), sincere intention, staying within the masjid. One should not leave except for necessities.</p>

<h3>Laylatul Qadr — The Night of Power</h3>
<p>Laylatul Qadr is better than one thousand months (Quran 97:3). It falls in the odd nights of the last ten of Ramadan (21st, 23rd, 25th, 27th, or 29th). Signs include: a calm night, the moon rising like half a plate, and the sun rising without strong rays the following morning.</p>
<p><strong>Recommended du'a:</strong> "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni" — O Allah, You are Most Forgiving and You love to forgive, so forgive me.</p>

<h3>Halal and Haram Food</h3>
<p><strong>Halal:</strong> Animals slaughtered by a Muslim (or Ahl al-Kitab) with the name of Allah, fish and seafood (according to Hanafi madhab: fish only), fruit, vegetables, grains.</p>
<p><strong>Haram:</strong> Pork and its by-products, blood, carrion (dead animals not properly slaughtered), intoxicants (alcohol and drugs), predatory animals with canines, birds of prey.</p>

<h3>Udhiyah — The Sacrifice of Eid al-Adha</h3>
<p>Udhiyah is wajib on every adult Muslim who owns wealth above the nisab. Animals: one sheep or goat per household, or one cow/camel for up to seven people. Correct ages: sheep (6 months+), goat (1 year+), cow/buffalo (2 years+), camel (5 years+).</p>
<p><strong>Days:</strong> 10th, 11th, and 12th of Dhul Hijjah. The animal should be slaughtered after the Eid prayer. Meat is divided into three: one-third kept, one-third given to relatives, one-third given to the poor.</p>
`.trim();

  const unit3 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-fiqh-itikat-laylah-udh' } },
    update: { title: 'Fiqh \u2014 I\'tik\u0101f, Laylatul Qadr, Hal\u0101l Food & U\u1e0dhiyah', description: 'I\'tikaf, Laylatul Qadr, halal and haram food, and the rules of udhiyah.', content: unit3Content, orderIndex: 3 },
    create: { courseId: course.id, slug: 'maktab-7-fiqh-itikat-laylah-udh', title: 'Fiqh \u2014 I\'tik\u0101f, Laylatul Qadr, Hal\u0101l Food & U\u1e0dhiyah', description: 'I\'tikaf, Laylatul Qadr, halal and haram food, and the rules of udhiyah.', content: unit3Content, orderIndex: 3 },
  });

  // ─── UNIT 4 ─────────────────────────────────────────────────────────────────
  const unit4Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: recall the hadith about two wasted blessings, explain the obligation of seeking knowledge, describe the reward of sending salawat on the Prophet, and identify the best times to send salawat.</p>

<h3>Two Blessings Often Wasted</h3>
<p>The Prophet said: <em>"There are two blessings about which many people are deceived: good health and free time."</em> (Bukhari) These gifts from Allah are often taken for granted. A believer uses free time for worship, learning, and good deeds — not in idle entertainment or sin.</p>

<h3>Knowledge is Obligatory</h3>
<p>The Prophet said: <em>"Seeking knowledge is an obligation upon every Muslim."</em> (Ibn Majah) This means every Muslim must learn enough about their deen to fulfil their basic duties — salah, sawm, zakah, halal, haram, and correct belief. Advanced knowledge (fard kifayah) must be maintained in the community.</p>

<h3>Benefit of Knowledge over Wealth</h3>
<p>Knowledge benefits its owner even after death (through ongoing sadaqah jariyah), while wealth is inherited by others. The Prophet said that when a person dies, their deeds stop except three: ongoing charity, beneficial knowledge, and a righteous child who makes du'a for them.</p>

<h3>Sending Salawat on the Prophet</h3>
<p>The Prophet said: <em>"Whoever sends salawat on me once, Allah sends ten blessings upon him."</em> (Muslim) It is especially virtuous to send salawat on Fridays, and whenever the Prophet's name is mentioned. Failing to send salawat when his name is mentioned is considered miserliness.</p>
<p>The full Ibrahimiyyah salawat recited in salah is the most complete form, mentioning both the Prophet and Ibrahim ('alayhim al-salam).</p>
`.trim();

  const unit4 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-ahadith-time-knowledge' } },
    update: { title: 'A\u1e25\u0101d\u012bth \u2014 Time, Knowledge & \u1e62alaw\u0101t', description: 'Ahadith on using time wisely, seeking knowledge, and the reward of sending salawat.', content: unit4Content, orderIndex: 4 },
    create: { courseId: course.id, slug: 'maktab-7-ahadith-time-knowledge', title: 'A\u1e25\u0101d\u012bth \u2014 Time, Knowledge & \u1e62alaw\u0101t', description: 'Ahadith on using time wisely, seeking knowledge, and the reward of sending salawat.', content: unit4Content, orderIndex: 4 },
  });

  // ─── UNIT 5 ─────────────────────────────────────────────────────────────────
  const unit5Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: define namimah and ghibah, recall the hadith on tale-carrying, explain the warning against suspicion, and describe practical ways to guard the tongue.</p>

<h3>Namimah — Tale-Carrying</h3>
<p>Namimah means carrying words from one person to another to cause harm or division between them. The Prophet said: <em>"The tale-carrier will not enter Jannah."</em> (Bukhari & Muslim) This is one of the major sins in Islam. A person who spreads gossip destroys relationships, breaks trust, and sows enmity.</p>

<h3>Ghibah — Backbiting</h3>
<p>The Prophet defined ghibah: <em>"Mentioning about your brother something he would dislike."</em> (Muslim) Even if what is said is true, it is still ghibah. The Quran compares it to eating the flesh of one's dead brother (49:12) — a vivid image to show how repulsive it is.</p>

<h3>Warning Against Suspicion</h3>
<p>The Prophet said: <em>"Beware of suspicion, for most of it is lies."</em> (Bukhari) Suspicion leads to spying and backbiting. A believer gives others the benefit of the doubt and does not assume evil without clear proof.</p>

<h3>Guarding the Tongue</h3>
<p>The Prophet said: <em>"Whoever guarantees me what is between his jaws and what is between his legs, I guarantee him Jannah."</em> (Bukhari) Practical steps: (1) Think before speaking — is it necessary? is it kind? is it true? (2) When backbiting starts in a conversation, change the subject or leave. (3) Focus on your own faults rather than others'. (4) Overlook the mistakes of others.</p>
`.trim();

  const unit5 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-ahadith-rumours' } },
    update: { title: 'A\u1e25\u0101d\u012bth \u2014 Avoiding Rumours & Social Ethics', description: 'Ahadith on namimah, ghibah, suspicion, and guarding the tongue.', content: unit5Content, orderIndex: 5 },
    create: { courseId: course.id, slug: 'maktab-7-ahadith-rumours', title: 'A\u1e25\u0101d\u012bth \u2014 Avoiding Rumours & Social Ethics', description: 'Ahadith on namimah, ghibah, suspicion, and guarding the tongue.', content: unit5Content, orderIndex: 5 },
  });

  // ─── UNIT 6 ─────────────────────────────────────────────────────────────────
  const unit6Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: describe the eating and sleeping habits of the Prophet, explain his manner of dress and laughter, and give examples of his compassionate treatment of companions and servants.</p>

<h3>Eating Habits</h3>
<p>The Prophet ate little and never criticised food. If he liked it he ate; if not, he left it without complaint. He ate with three fingers, licked them at the end of the meal, and always ate with his right hand. He said: <em>"The son of Adam fills no vessel worse than his stomach."</em> He recommended filling one-third with food, one-third with water, and leaving one-third for air.</p>

<h3>Sleeping Habits</h3>
<p>He slept on his right side, reciting specific du'as before sleeping. He would sleep approximately one-third of the night, rise for Tahajjud, then sleep again before Fajr. He never slept on his stomach (makruh) and discouraged sleeping excessively after Fajr.</p>

<h3>Dress and Appearance</h3>
<p>The Prophet preferred white garments. His clothing was simple and never extravagant. He kept his beard and hair clean and well-groomed. He wore a ring (on the right or left hand — both narrated) and sometimes used a walking staff. He never wore silk (forbidden for men) and avoided anything that displayed pride.</p>

<h3>Laughter and Interaction</h3>
<p>His laughter was usually a smile (tabassum). Loud laughter was rare. He remembered companions by name, visited the sick, attended funerals, played with children, and made everyone feel valued. He never struck any person or animal and freed many servants, treating them as members of his household.</p>
`.trim();

  const unit6 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-sirah-shamail' } },
    update: { title: 'S\u012brah \u2014 Sham\u0101\'il of Ras\u016blull\u0101h \ufdfa', description: 'Advanced study of the Prophet\'s personal habits, character, and treatment of others.', content: unit6Content, orderIndex: 6 },
    create: { courseId: course.id, slug: 'maktab-7-sirah-shamail', title: 'S\u012brah \u2014 Sham\u0101\'il of Ras\u016blull\u0101h \ufdfa', description: 'Advanced study of the Prophet\'s personal habits, character, and treatment of others.', content: unit6Content, orderIndex: 6 },
  });

  // ─── UNIT 7 ─────────────────────────────────────────────────────────────────
  const unit7Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: narrate the conversion of 'Umar ibn al-Khattab, describe his key character traits, and outline the major achievements of his caliphate.</p>

<h3>The Conversion of 'Umar</h3>
<p>'Umar was initially a fierce opponent of Islam. The turning point came when he set out to harm the Prophet and was told his own sister Fatimah and her husband had embraced Islam. Enraged, he went to them and found them reciting the Quran. When he struck his sister and saw blood, he was overcome with remorse. He asked to read what they were reciting. The opening verses of Surah Ta-Ha softened his heart completely. He went directly to the Prophet and declared the shahadah. The Prophet had made du'a: "O Allah, strengthen Islam through whichever of the two 'Umars is more beloved to You."</p>

<h3>His Character</h3>
<p>'Umar was known for: uncompromising truthfulness and justice, firmness in matters of deen, deep fear of Allah, physical courage that intimidated enemies, and a sharp intellect. The Prophet said: <em>"If there were a prophet after me, it would be 'Umar."</em></p>

<h3>Caliphate (634–644 CE)</h3>
<p>Under 'Umar, the Islamic state expanded dramatically: Persia, Egypt, Syria, and Palestine came under Muslim rule. He entered Jerusalem unarmed, personally refusing to pray in the Church of the Holy Sepulchre to prevent it from being converted into a mosque — an act of remarkable tolerance.</p>
<p>He established the diwan (administrative registers for stipends), the bayt al-mal (public treasury), and the Islamic calendar starting from the Hijrah. He toured his lands in disguise to check on the welfare of his people.</p>
`.trim();

  const unit7 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-sirah-umar' } },
    update: { title: 'S\u012brah \u2014 \u02bfUmar ibn al-Kha\u1e6d\u1e6d\u0101b \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647', description: '\'Umar\'s conversion, character, and the achievements of his caliphate.', content: unit7Content, orderIndex: 7 },
    create: { courseId: course.id, slug: 'maktab-7-sirah-umar', title: 'S\u012brah \u2014 \u02bfUmar ibn al-Kha\u1e6d\u1e6d\u0101b \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647', description: '\'Umar\'s conversion, character, and the achievements of his caliphate.', content: unit7Content, orderIndex: 7 },
  });

  // ─── UNIT 8 ─────────────────────────────────────────────────────────────────
  const unit8Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: narrate the story of Zakariyya's du'a and the miraculous birth of Yahya, describe Yahya's character and martyrdom, and extract key lessons about the power of du'a.</p>

<h3>Zakariyya — The Du'a for a Son</h3>
<p>Prophet Zakariyya ('alayhis salam) was very old and his wife was barren. Yet he never lost hope in Allah. When he saw the miraculous provision of fruit for Maryam in the sanctuary, his faith was strengthened and he made a private du'a: <em>"My Lord, grant me from Yourself a righteous offspring; indeed You are the Hearer of supplication."</em> (Quran 3:38)</p>
<p>Allah announced the glad tidings: a son named Yahya — a name given by Allah Himself, never before given to anyone. As a sign that this was truly from Allah, Zakariyya was told he would not speak to anyone for three days despite being healthy.</p>

<h3>Yahya — A Prophet of Pure Worship</h3>
<p>Yahya ('alayhis salam) was given wisdom while still a child (Quran 19:12). He was compassionate, chaste, and deeply God-conscious. He called people to pure worship and righteousness. He was not afraid to speak truth to power — he openly condemned the immoral marriage planned by King Herod, and was martyred as a result.</p>

<h3>Lessons from Their Story</h3>
<ul>
  <li>Never stop making du'a — Allah answers at the perfect time, not necessarily the expected time.</li>
  <li>Allah's power has no limits: He can give a child to an elderly couple with a barren wife.</li>
  <li>A true believer speaks truth even when it is dangerous.</li>
  <li>Signs from Allah come to strengthen the faith of the believer, not to satisfy doubt.</li>
</ul>
`.trim();

  const unit8 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-tarikh-zakariyya-yahya' } },
    update: { title: 'T\u0101r\u012bkh \u2014 Prophets Zakariyy\u0101 & Ya\u1e25y\u0101 \u02bfalayhim al-sal\u0101m', description: 'The story of Zakariyya\'s du\'a, the miraculous birth of Yahya, and their lessons.', content: unit8Content, orderIndex: 8 },
    create: { courseId: course.id, slug: 'maktab-7-tarikh-zakariyya-yahya', title: 'T\u0101r\u012bkh \u2014 Prophets Zakariyy\u0101 & Ya\u1e25y\u0101 \u02bfalayhim al-sal\u0101m', description: 'The story of Zakariyya\'s du\'a, the miraculous birth of Yahya, and their lessons.', content: unit8Content, orderIndex: 8 },
  });

  // ─── UNIT 9 ─────────────────────────────────────────────────────────────────
  const unit9Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: describe the rise of the Abbasid Caliphate, explain the significance of Baghdad and Bayt al-Hikmah, name key Muslim scholars of the Golden Age, and identify how the Abbasid Caliphate ended.</p>

<h3>Rise of the Abbasids (750 CE)</h3>
<p>The Abbasid dynasty overthrew the Umayyad Caliphate in 750 CE, claiming descent from al-Abbas, the Prophet's uncle. Caliph al-Mansur founded the new capital, Baghdad, in 762 CE on the banks of the River Tigris. Its circular design earned it the name "City of Peace" (Madinat al-Salam). Baghdad rapidly became the greatest city in the world.</p>

<h3>The Golden Age of Islam</h3>
<p>The reign of Harun al-Rashid (786–809 CE) is considered the height of Abbasid glory. His son al-Ma'mun established <strong>Bayt al-Hikmah</strong> (House of Wisdom) in Baghdad — a grand library, translation centre, and academy where scholars from all faiths translated Greek, Persian, and Indian works into Arabic and produced original research.</p>
<ul>
  <li><strong>Ibn Sina (Avicenna)</strong> — Canon of Medicine; a medical encyclopaedia used in Europe for 600 years</li>
  <li><strong>Al-Khwarizmi</strong> — invented algebra (al-jabr) and developed the algorithm</li>
  <li><strong>Al-Biruni</strong> — geography, anthropology, and calculated the circumference of the earth</li>
</ul>

<h3>Fall of the Abbasids — The Mongol Invasion (1258 CE)</h3>
<p>In 1258 CE, the Mongol armies under Hulagu Khan sacked Baghdad. The Caliph al-Musta'sim was executed and the great library of Bayt al-Hikmah was destroyed. Eyewitnesses said the waters of the Tigris ran black with ink from the books thrown into it. This event ended the Abbasid Caliphate in Baghdad and is considered one of the greatest disasters in Islamic civilisational history.</p>
`.trim();

  const unit9 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-tarikh-abbasids' } },
    update: { title: 'T\u0101r\u012bkh \u2014 The Abbasid Caliphate', description: 'Rise of the Abbasids, Baghdad, the Golden Age of Islam, and the Mongol invasion.', content: unit9Content, orderIndex: 9 },
    create: { courseId: course.id, slug: 'maktab-7-tarikh-abbasids', title: 'T\u0101r\u012bkh \u2014 The Abbasid Caliphate', description: 'Rise of the Abbasids, Baghdad, the Golden Age of Islam, and the Mongol invasion.', content: unit9Content, orderIndex: 9 },
  });

  // ─── UNIT 10 ────────────────────────────────────────────────────────────────
  const unit10Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: name and explain the four aspects of qadar, reconcile divine decree with human free will, and recall the correct response to calamity.</p>

<h3>Qadar — The Four Aspects</h3>
<ol>
  <li><strong>'Ilm — Divine Knowledge:</strong> Allah knew everything before He created it. His knowledge is complete, eternal, and encompasses every detail of existence — past, present, and future.</li>
  <li><strong>Kitabah — The Recording:</strong> Everything that will ever happen has been written in al-Lawh al-Mahfuz (the Preserved Tablet) 50,000 years before creation.</li>
  <li><strong>Iradah — Divine Will:</strong> Nothing happens in the universe except by Allah's will. Whatever He wills comes to be; whatever He does not will cannot occur.</li>
  <li><strong>Khalq — Divine Creation:</strong> Allah created all things and their attributes, including human actions and the causes that lead to effects.</li>
</ol>

<h3>Qadar and Human Free Will</h3>
<p>Believing in qadar does not mean humans have no choice. Allah gave us intellect, free will, and the capacity to choose between right and wrong. We are accountable for our choices. The Prophet said: <em>"Work, for everyone will be eased towards that for which he was created."</em> We must act as if our efforts matter — because they do — while trusting that Allah's wisdom governs all outcomes.</p>

<h3>Response to Calamity</h3>
<p>When something bad happens, a believer says: <strong>Inna lillahi wa inna ilayhi raji'un</strong> — "Indeed, we belong to Allah, and indeed to Him we shall return." (Quran 2:156) This affirms faith in qadar, trusts in Allah's plan, and opens the door to patience (sabr) and reward.</p>
`.trim();

  const unit10 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-aqaid-qadar' } },
    update: { title: 'Aq\u0101\'id \u2014 Qadar (Divine Decree)', description: 'The four aspects of qadar, free will, and the correct response to calamity.', content: unit10Content, orderIndex: 10 },
    create: { courseId: course.id, slug: 'maktab-7-aqaid-qadar', title: 'Aq\u0101\'id \u2014 Qadar (Divine Decree)', description: 'The four aspects of qadar, free will, and the correct response to calamity.', content: unit10Content, orderIndex: 10 },
  });

  // ─── UNIT 11 ────────────────────────────────────────────────────────────────
  const unit11Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: explain what barzakh is, name the angels who question in the grave, and list the stages after death in order.</p>

<h3>The Stages After Death</h3>
<ol>
  <li><strong>Death:</strong> The angel of death (Malak al-Mawt) takes the soul. Believers' souls are taken gently; disbelievers' souls are extracted forcefully.</li>
  <li><strong>Barzakh:</strong> The intermediary state between death and resurrection. The body is in the grave while the soul experiences either comfort (ni'mah) or punishment ('adhab) based on deeds.</li>
  <li><strong>Questioning in the Grave:</strong> Two angels — Munkar and Nakir — question every person: "Who is your Lord? What is your religion? Who is this man?" The believer answers: "Allah, Islam, Muhammad." The grave either widens and brightens, or tightens and darkens.</li>
  <li><strong>Resurrection (Ba'th):</strong> Israfil blows the trumpet (Sur) and all of creation is resurrected.</li>
  <li><strong>The Gathering (Hashr):</strong> All of humanity assembles on the Plain of Judgement (Mahshar), standing in the intense heat, awaiting account.</li>
  <li><strong>The Reckoning and the Scales (Hisab and Mizan):</strong> Every deed, word, and intention is weighed. The scales are perfectly just.</li>
  <li><strong>The Bridge (Sirat):</strong> A bridge stretched over Jahannam, thinner than a hair and sharper than a sword. Believers cross according to their deeds.</li>
  <li><strong>Jannah or Jahannam:</strong> The final abode — eternal paradise for believers or punishment for the rejecters.</li>
</ol>
`.trim();

  const unit11 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-aqaid-akhirah-barzakh' } },
    update: { title: 'Aq\u0101\'id \u2014 Life After Death & Barzakh', description: 'The stages after death: barzakh, questioning in the grave, resurrection, and the final abode.', content: unit11Content, orderIndex: 11 },
    create: { courseId: course.id, slug: 'maktab-7-aqaid-akhirah-barzakh', title: 'Aq\u0101\'id \u2014 Life After Death & Barzakh', description: 'The stages after death: barzakh, questioning in the grave, resurrection, and the final abode.', content: unit11Content, orderIndex: 11 },
  });

  // ─── UNIT 12 ────────────────────────────────────────────────────────────────
  const unit12Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: recall the hadith on five before five, list the duties of a student of knowledge, and give an example of outstanding respect for teachers.</p>

<h3>Five Before Five</h3>
<p>The Prophet said: <em>"Benefit from five before five: your youth before your old age, your health before your illness, your wealth before your poverty, your free time before your busyness, and your life before your death."</em> (Hakim — sahih) This hadith teaches us that every gift has a deadline. Wasting youth in laziness, or health in heedlessness, is a missed opportunity that cannot be recovered.</p>

<h3>Duties of a Student of Knowledge</h3>
<ul>
  <li><strong>Respect:</strong> Show adab (courtesy) to teachers, books, and the knowledge itself.</li>
  <li><strong>Act on knowledge:</strong> Knowledge without action is a proof against the person, not for them.</li>
  <li><strong>Teach others:</strong> The Prophet said: <em>"Convey from me even one verse."</em> Knowledge hoarded is knowledge wasted.</li>
  <li><strong>Intention:</strong> Seek knowledge for Allah's pleasure, not for status or argument.</li>
  <li><strong>Consistency:</strong> Little and regular is better than intensive and short-lived.</li>
</ul>

<h3>Respect for Teachers — Imam Shafi'i and Imam Malik</h3>
<p>Imam al-Shafi'i narrated that out of reverence for Imam Malik, he would turn the pages of his teacher's book so gently that Imam Malik would not hear the rustling. This example from the great scholars shows that true knowledge is inseparable from profound respect for those who carry it.</p>
`.trim();

  const unit12 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-akhlaq-time-knowledge' } },
    update: { title: 'Akhl\u0101q \u2014 Value of Time & Pursuit of Knowledge', description: 'Hadith on five before five, duties of a student of knowledge, and etiquette with teachers.', content: unit12Content, orderIndex: 12 },
    create: { courseId: course.id, slug: 'maktab-7-akhlaq-time-knowledge', title: 'Akhl\u0101q \u2014 Value of Time & Pursuit of Knowledge', description: 'Hadith on five before five, duties of a student of knowledge, and etiquette with teachers.', content: unit12Content, orderIndex: 12 },
  });

  // ─── UNIT 13 ────────────────────────────────────────────────────────────────
  const unit13Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: explain the consequences of gossip in the community, apply practical steps to purify speech, and describe the virtue and forms of salawat on the Prophet.</p>

<h3>Consequences of Gossip in the Community</h3>
<p>Gossip destroys friendships, breaks families, and corrupts communities. People who gossip are often trusted by no one — because anyone willing to talk about others to you will talk about you to others. The Quran commands: <em>"O you who believe, avoid most suspicion... do not spy, and do not backbite one another."</em> (49:12)</p>

<h3>Practical Steps to Purify Speech</h3>
<p>Before speaking, apply the <strong>Three Gates Test:</strong></p>
<ol>
  <li>Is it true?</li>
  <li>Is it kind?</li>
  <li>Is it necessary?</li>
</ol>
<p>If a word does not pass through all three gates, it is better left unsaid. When you find yourself in a conversation that turns to backbiting: change the subject, praise the person being mentioned, or politely leave. Do not stay silent and let it continue — silence can imply consent.</p>

<h3>Virtue of Salawat on the Prophet</h3>
<p>Sending salawat (blessings) on the Prophet is an act of worship that draws one closer to Allah and to the Prophet. The reward: ten blessings from Allah for each one sent. It is recommended at all times but especially: on Fridays, after adhan, when his blessed name is mentioned, and in du'a.</p>
<p><strong>The Ibrahimiyyah Salawat:</strong> "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammadin..."</p>
`.trim();

  const unit13 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-akhlaq-rumours-salawat' } },
    update: { title: 'Akhl\u0101q \u2014 Avoiding Rumours & Sending \u1e62alaw\u0101t', description: 'Consequences of gossip, practical steps to purify speech, and the virtue of salawat.', content: unit13Content, orderIndex: 13 },
    create: { courseId: course.id, slug: 'maktab-7-akhlaq-rumours-salawat', title: 'Akhl\u0101q \u2014 Avoiding Rumours & Sending \u1e62alaw\u0101t', description: 'Consequences of gossip, practical steps to purify speech, and the virtue of salawat.', content: unit13Content, orderIndex: 13 },
  });

  // ─── UNIT 14 ────────────────────────────────────────────────────────────────
  const unit14Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to: describe Islamic manners in gatherings, explain how to behave with elders and youngsters, and apply Islamic principles to online conduct.</p>

<h3>Manners in Gatherings</h3>
<ul>
  <li>Greet everyone with salam when entering a gathering.</li>
  <li>Sit where there is space — do not displace others or push to the front.</li>
  <li>Do not whisper privately between two people in a group of three — this hurts the third person.</li>
  <li>Do not jump over others to take a seat.</li>
  <li>Listen attentively when others speak; do not interrupt.</li>
</ul>

<h3>Behaviour in Public</h3>
<ul>
  <li>Help the elderly and those with disabilities — offer your seat, open doors, carry bags.</li>
  <li>Lower your gaze in public — guard your eyes from what is haram.</li>
  <li>Do not spit, litter, or cause nuisance in shared spaces. The Prophet said removing something harmful from the path is sadaqah.</li>
</ul>

<h3>With Elders</h3>
<p>The Prophet said: <em>"He is not of us who does not show mercy to our young and honour to our elders."</em> Stand when an elder enters, greet them first, speak respectfully and gently, do not argue or raise your voice, and give way to them in queues and seating.</p>

<h3>With Youngsters</h3>
<p>Be kind, patient, and a positive example. Guide rather than belittle. The Prophet played with children and remembered their names. Avoid condescension — every young person deserves dignity.</p>

<h3>Online Conduct</h3>
<p>The same Islamic values apply online: do not post, share, or react to haram content; do not spread unverified news (the Prophet warned: "It is enough of a lie for a person to repeat everything he hears"); do not bully or mock others on social media; protect your own privacy and that of others; represent Islam with dignity in all your posts and interactions.</p>
`.trim();

  const unit14 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-7-adab-social-conduct' } },
    update: { title: '\u0100d\u0101b \u2014 Social Interaction & Public Conduct', description: 'Islamic manners in gatherings, with elders, with youngsters, in public, and online.', content: unit14Content, orderIndex: 14 },
    create: { courseId: course.id, slug: 'maktab-7-adab-social-conduct', title: '\u0100d\u0101b \u2014 Social Interaction & Public Conduct', description: 'Islamic manners in gatherings, with elders, with youngsters, in public, and online.', content: unit14Content, orderIndex: 14 },
  });

  // ─── QUIZ DATA ───────────────────────────────────────────────────────────────
  const quizData = [
    // Unit 1 — Advanced Salah
    {
      externalId: 'cb7-u1-q1',
      unitId: unit1.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What is the minimum height recommended for a sutrah?',
      options: ['10 cm', '30 cm', '50 cm', '1 metre'],
      correctAnswer: '30 cm',
      explanation: 'A sutrah should be at least 30 cm tall to effectively mark the prayer space.',
    },
    {
      externalId: 'cb7-u1-q2',
      unitId: unit1.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Sajdah tilawah is wajib when a verse of prostration is recited. How many such verses are in the Quran?',
      options: ['7', '10', '14', '17'],
      correctAnswer: '14',
      explanation: 'There are 14 verses of prostration (ayat al-sajdah) in the Quran.',
    },
    {
      externalId: 'cb7-u1-q3',
      unitId: unit1.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'When performing qasr salah, which prayer is NOT shortened?',
      options: ['Zuhr', 'Asr', 'Maghrib', 'Isha'],
      correctAnswer: 'Maghrib',
      explanation: 'Fajr (2 rak\'at) and Maghrib (3 rak\'at) are never shortened. Only Zuhr, Asr, and Isha are shortened from 4 to 2.',
    },
    {
      externalId: 'cb7-u1-q4',
      unitId: unit1.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What is the minimum travel distance that makes qasr salah permissible?',
      options: ['25 miles', '48 miles', '60 miles', '100 miles'],
      correctAnswer: '48 miles',
      explanation: 'The minimum travel distance for qasr is approximately 48 miles (77 km).',
    },
    {
      externalId: 'cb7-u1-q5',
      unitId: unit1.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'A sick person who cannot stand or sit may pray salah using gestures while lying down.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Islam accommodates all conditions. A person unable to stand or sit may pray lying down using gestures, bowing the head lower for sajdah.',
    },
    {
      externalId: 'cb7-u1-q6',
      unitId: unit1.id,
      type: 'FILL_BLANK' as const,
      questionText: 'Acts that are disliked in salah but do not invalidate it are called ________.',
      options: undefined,
      correctAnswer: 'makruhat',
      explanation: 'Makruhat are disliked acts that reduce the reward of salah without invalidating it.',
    },

    // Unit 2 — Zakah & Inheritance
    {
      externalId: 'cb7-u2-q1',
      unitId: unit2.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What is the nisab for gold?',
      options: ['50 grams', '87.5 grams', '100 grams', '612.5 grams'],
      correctAnswer: '87.5 grams',
      explanation: 'The nisab for gold is 87.5 grams. When one owns this amount and a lunar year passes, zakah (2.5%) becomes due.',
    },
    {
      externalId: 'cb7-u2-q2',
      unitId: unit2.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'How many categories of zakah recipients are mentioned in Quran 9:60?',
      options: ['5', '6', '7', '8'],
      correctAnswer: '8',
      explanation: 'Quran 9:60 lists eight categories: the poor, the destitute, zakah collectors, those whose hearts are to be reconciled, freeing slaves, the debt-ridden, in Allah\'s path, and the stranded traveller.',
    },
    {
      externalId: 'cb7-u2-q3',
      unitId: unit2.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What share does a husband receive from his wife\'s estate when she leaves NO children?',
      options: ['1/8', '1/4', '1/3', '1/2'],
      correctAnswer: '1/2',
      explanation: 'When a wife leaves no children, her husband inherits one-half (1/2) of her estate.',
    },
    {
      externalId: 'cb7-u2-q4',
      unitId: unit2.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'Zakah is obligatory on wealth even if less than one full lunar year has passed on it.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'One of the conditions for zakah is that one full lunar year (hawl) must pass on the zakatable wealth that meets the nisab.',
    },
    {
      externalId: 'cb7-u2-q5',
      unitId: unit2.id,
      type: 'FILL_BLANK' as const,
      questionText: 'Male relatives who inherit the remainder of an estate after fixed shares are distributed are called ________.',
      options: undefined,
      correctAnswer: 'asabah',
      explanation: 'Asabah (residual heirs) are male relatives such as the son, father, and brother who inherit what remains after fixed shares are given.',
    },
    {
      externalId: 'cb7-u2-q6',
      unitId: unit2.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What is the zakah rate on most types of zakatable wealth?',
      options: ['1%', '2.5%', '5%', '10%'],
      correctAnswer: '2.5%',
      explanation: 'The standard zakah rate on gold, silver, and trade goods is 2.5% (one fortieth).',
    },

    // Unit 3 — I'tikaf, Laylatul Qadr, Halal & Udhiyah
    {
      externalId: 'cb7-u3-q1',
      unitId: unit3.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'I\'tikaf during the last ten nights of Ramadan has which ruling?',
      options: ['Fard', 'Wajib', 'Sunnah Mu\'akkadah', 'Mustahab'],
      correctAnswer: 'Sunnah Mu\'akkadah',
      explanation: 'I\'tikaf during the last ten nights of Ramadan is Sunnah Mu\'akkadah (confirmed sunnah) — strongly recommended but not obligatory.',
    },
    {
      externalId: 'cb7-u3-q2',
      unitId: unit3.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Laylatul Qadr is described in the Quran as being better than how many months?',
      options: ['100 months', '500 months', '1000 months', '1200 months'],
      correctAnswer: '1000 months',
      explanation: 'Surah al-Qadr (97:3) states: "The Night of Power is better than a thousand months."',
    },
    {
      externalId: 'cb7-u3-q3',
      unitId: unit3.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'On which days of Dhul Hijjah is udhiyah performed?',
      options: ['8th, 9th, 10th', '10th, 11th, 12th', '1st, 2nd, 3rd', '27th, 28th, 29th'],
      correctAnswer: '10th, 11th, 12th',
      explanation: 'Udhiyah is performed on the 10th, 11th, and 12th of Dhul Hijjah — the days of Eid al-Adha and the two following days (Ayyam al-Tashriq).',
    },
    {
      externalId: 'cb7-u3-q4',
      unitId: unit3.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'According to Hanafi fiqh, all sea creatures are halal to eat.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'According to the Hanafi madhab, only fish (with scales) from the sea is halal. Other sea creatures such as prawns and lobster are a matter of scholarly difference.',
    },
    {
      externalId: 'cb7-u3-q5',
      unitId: unit3.id,
      type: 'FILL_BLANK' as const,
      questionText: 'The meat of udhiyah is divided into three portions: one kept, one given to relatives, and one given to ________.',
      options: undefined,
      correctAnswer: 'the poor',
      explanation: 'The three-way distribution of udhiyah meat is: one-third kept for household, one-third to relatives and neighbours, one-third to the poor.',
    },
    {
      externalId: 'cb7-u3-q6',
      unitId: unit3.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'In which nights of the last ten of Ramadan is Laylatul Qadr most likely to fall?',
      options: ['Even nights', 'Odd nights', 'Every night equally', 'Only the 27th night'],
      correctAnswer: 'Odd nights',
      explanation: 'The Prophet instructed: "Search for Laylatul Qadr in the odd nights of the last ten of Ramadan." These are the 21st, 23rd, 25th, 27th, and 29th.',
    },

    // Unit 4 — Ahadith: Time, Knowledge & Salawat
    {
      externalId: 'cb7-u4-q1',
      unitId: unit4.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'According to the hadith, which two blessings are often wasted?',
      options: ['Wealth and power', 'Health and free time', 'Youth and beauty', 'Knowledge and status'],
      correctAnswer: 'Health and free time',
      explanation: 'The Prophet said: "There are two blessings about which many people are deceived: good health and free time." (Bukhari)',
    },
    {
      externalId: 'cb7-u4-q2',
      unitId: unit4.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'How many blessings does Allah send upon a person who sends one salawat on the Prophet?',
      options: ['1', '3', '7', '10'],
      correctAnswer: '10',
      explanation: 'The Prophet said: "Whoever sends salawat on me once, Allah sends ten blessings upon him." (Muslim)',
    },
    {
      externalId: 'cb7-u4-q3',
      unitId: unit4.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'Seeking knowledge is described in hadith as an obligation upon every Muslim.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'The Prophet said: "Seeking knowledge is an obligation upon every Muslim." (Ibn Majah) Every Muslim must learn enough to fulfil their basic religious duties.',
    },
    {
      externalId: 'cb7-u4-q4',
      unitId: unit4.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'When is it especially virtuous to send salawat on the Prophet?',
      options: ['Only in salah', 'On Mondays only', 'On Fridays and whenever his name is mentioned', 'Only in Ramadan'],
      correctAnswer: 'On Fridays and whenever his name is mentioned',
      explanation: 'Sending salawat is especially recommended on Fridays and every time the Prophet\'s blessed name is mentioned.',
    },
    {
      externalId: 'cb7-u4-q5',
      unitId: unit4.id,
      type: 'FILL_BLANK' as const,
      questionText: 'A person\'s beneficial knowledge continues to reward them after death. This ongoing charity is called sadaqah ________.',
      options: undefined,
      correctAnswer: 'jariyah',
      explanation: 'Sadaqah jariyah (ongoing charity) includes beneficial knowledge, and its reward continues after death.',
    },
    {
      externalId: 'cb7-u4-q6',
      unitId: unit4.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What is the full name of the salawat recited in the final sitting of salah?',
      options: ['Salawat al-Ma\'thurah', 'Al-Salawat al-Ibrahimiyyah', 'Salawat al-Nariyyah', 'Salawat al-Tunjinah'],
      correctAnswer: 'Al-Salawat al-Ibrahimiyyah',
      explanation: 'The Ibrahimiyyah salawat is recited in the tashahhud, mentioning blessings on both the Prophet Muhammad and Prophet Ibrahim (peace be upon them both).',
    },

    // Unit 5 — Ahadith: Avoiding Rumours
    {
      externalId: 'cb7-u5-q1',
      unitId: unit5.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What is namimah?',
      options: ['Lying about oneself', 'Carrying words between people to cause division', 'Saying something true about someone who dislikes it', 'Praising someone excessively'],
      correctAnswer: 'Carrying words between people to cause division',
      explanation: 'Namimah (tale-carrying) means carrying words from one person to another in order to cause harm or division between them.',
    },
    {
      externalId: 'cb7-u5-q2',
      unitId: unit5.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'Ghibah (backbiting) only applies when what is said about a person is untrue.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Prophet defined ghibah as "mentioning about your brother something he would dislike" — even if it is true. If it is untrue, it is also slander (buhtan), which is an even greater sin.',
    },
    {
      externalId: 'cb7-u5-q3',
      unitId: unit5.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The Prophet warned: "Beware of suspicion, for most of it is ________."',
      options: ['wrong', 'lies', 'harmful', 'forbidden'],
      correctAnswer: 'lies',
      explanation: 'The Prophet said: "Beware of suspicion, for most of suspicion is lies." (Bukhari) Acting on unfounded suspicion leads to sin.',
    },
    {
      externalId: 'cb7-u5-q4',
      unitId: unit5.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What consequence did the Prophet warn for the tale-carrier (naммam)?',
      options: ['A reduced reward', 'Being questioned about it on Judgement Day', 'Not entering Jannah', 'Losing one\'s wudu'],
      correctAnswer: 'Not entering Jannah',
      explanation: 'The Prophet said: "The tale-carrier will not enter Jannah." (Bukhari & Muslim) This reflects the severity of the sin of namimah.',
    },
    {
      externalId: 'cb7-u5-q5',
      unitId: unit5.id,
      type: 'FILL_BLANK' as const,
      questionText: 'The Arabic word for backbiting — mentioning something true about a person that they would dislike — is ________.',
      options: undefined,
      correctAnswer: 'ghibah',
      explanation: 'Ghibah is the Islamic term for backbiting, defined by the Prophet as mentioning something about a person that they would dislike, even if true.',
    },
    {
      externalId: 'cb7-u5-q6',
      unitId: unit5.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which of the following is the BEST action when a conversation begins to include backbiting?',
      options: ['Listen silently so as not to cause conflict', 'Laugh along to keep the peace', 'Change the subject or praise the person being mentioned', 'Record what is said to share later'],
      correctAnswer: 'Change the subject or praise the person being mentioned',
      explanation: 'A believer should actively redirect backbiting conversations by changing the subject, defending the person, or politely leaving.',
    },

    // Unit 6 — Shamail
    {
      externalId: 'cb7-u6-q1',
      unitId: unit6.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The Prophet recommended filling one\'s stomach in which proportions?',
      options: ['Half food, half water', 'One-third food, one-third water, one-third air', 'Eat until full, then stop', 'Two-thirds food, one-third water'],
      correctAnswer: 'One-third food, one-third water, one-third air',
      explanation: 'The Prophet said the son of Adam should fill one-third with food, one-third with water, and leave one-third for air.',
    },
    {
      externalId: 'cb7-u6-q2',
      unitId: unit6.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'The Prophet would laugh loudly and frequently at jokes.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Prophet\'s laughter was usually a smile (tabassum). Loud laughter (qahqahah) was rare. He was cheerful but dignified.',
    },
    {
      externalId: 'cb7-u6-q3',
      unitId: unit6.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What colour of clothing did the Prophet prefer?',
      options: ['Black', 'Green', 'White', 'Blue'],
      correctAnswer: 'White',
      explanation: 'The Prophet preferred white garments and said: "Wear white clothing, for it is the best of your clothing."',
    },
    {
      externalId: 'cb7-u6-q4',
      unitId: unit6.id,
      type: 'FILL_BLANK' as const,
      questionText: 'The Arabic term for the Prophet\'s smile or gentle laughter is ________.',
      options: undefined,
      correctAnswer: 'tabassum',
      explanation: 'Tabassum refers to a gentle smile. The Prophet\'s usual expression of happiness was a smile rather than audible laughter.',
    },
    {
      externalId: 'cb7-u6-q5',
      unitId: unit6.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'The Prophet never struck any person or animal throughout his life.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'A\'isha (may Allah be pleased with her) reported that the Prophet never struck any servant, woman, or animal with his own hand.',
    },
    {
      externalId: 'cb7-u6-q6',
      unitId: unit6.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'On which side did the Prophet sleep?',
      options: ['Left side', 'Right side', 'On his back', 'On his stomach'],
      correctAnswer: 'Right side',
      explanation: 'It is sunnah to sleep on one\'s right side, as the Prophet did. Sleeping on the stomach is makruh.',
    },

    // Unit 7 — 'Umar ibn al-Khattab
    {
      externalId: 'cb7-u7-q1',
      unitId: unit7.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What softened \'Umar\'s heart and led to his conversion to Islam?',
      options: ['A dream he had', 'Hearing the Quran recited by his sister', 'A speech by the Prophet', 'Seeing a miracle'],
      correctAnswer: 'Hearing the Quran recited by his sister',
      explanation: '\'Umar heard the Quran being recited from Surah Ta-Ha at his sister Fatimah\'s home. The words of Allah moved him deeply, leading to his immediate acceptance of Islam.',
    },
    {
      externalId: 'cb7-u7-q2',
      unitId: unit7.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'During which years was \'Umar\'s caliphate?',
      options: ['632–634 CE', '634–644 CE', '644–656 CE', '656–661 CE'],
      correctAnswer: '634–644 CE',
      explanation: '\'Umar ibn al-Khattab served as Caliph from 634 to 644 CE, a period of dramatic expansion of the Islamic state.',
    },
    {
      externalId: 'cb7-u7-q3',
      unitId: unit7.id,
      type: 'TRUE_FALSE' as const,
      questionText: '\'Umar entered Jerusalem carrying weapons and armour to display the might of Islam.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: '\'Umar entered Jerusalem unarmed and on foot, showing humility. He also refused to pray in the Church of the Holy Sepulchre to prevent it from being converted into a mosque — an act of remarkable tolerance.',
    },
    {
      externalId: 'cb7-u7-q4',
      unitId: unit7.id,
      type: 'FILL_BLANK' as const,
      questionText: '\'Umar established the ________, an administrative register that recorded stipends for Muslims.',
      options: undefined,
      correctAnswer: 'diwan',
      explanation: '\'Umar established the diwan (administrative registers) to ensure systematic distribution of stipends to Muslim soldiers and their families.',
    },
    {
      externalId: 'cb7-u7-q5',
      unitId: unit7.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which du\'a of the Prophet was answered through \'Umar\'s conversion?',
      options: [
        'O Allah, make \'Umar a great general',
        'O Allah, strengthen Islam through whichever of the two \'Umars is more beloved to You',
        'O Allah, give \'Umar wisdom like Sulayman',
        'O Allah, make \'Umar the fourth caliph'
      ],
      correctAnswer: 'O Allah, strengthen Islam through whichever of the two \'Umars is more beloved to You',
      explanation: 'The Prophet made du\'a: "O Allah, strengthen Islam through whichever of the two \'Umars is more beloved to You" — referring to \'Umar ibn al-Khattab and \'Amr ibn Hisham (Abu Jahl).',
    },
    {
      externalId: 'cb7-u7-q6',
      unitId: unit7.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which of the following territories was NOT conquered during \'Umar\'s caliphate?',
      options: ['Persia', 'Egypt', 'Syria', 'Spain'],
      correctAnswer: 'Spain',
      explanation: 'Persia, Egypt, Syria, and Jerusalem were conquered during \'Umar\'s caliphate. Spain (al-Andalus) was conquered later, during the Umayyad period (711 CE).',
    },

    // Unit 8 — Zakariyya & Yahya
    {
      externalId: 'cb7-u8-q1',
      unitId: unit8.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What was the sign Allah gave Zakariyya that his du\'a for a son had been accepted?',
      options: ['He saw a vision', 'He would be unable to speak to people for three days', 'His wife\'s hair turned white', 'He heard angels singing'],
      correctAnswer: 'He would be unable to speak to people for three days',
      explanation: 'Allah told Zakariyya the sign would be: "You will not speak to the people for three days except by gestures." (Quran 3:41)',
    },
    {
      externalId: 'cb7-u8-q2',
      unitId: unit8.id,
      type: 'FILL_BLANK' as const,
      questionText: 'The name Yahya was special because it was given by ________ Himself and had never been given to anyone before.',
      options: undefined,
      correctAnswer: 'Allah',
      explanation: 'The Quran states: "O Zakariyya, We give you good tidings of a boy whose name will be Yahya. We have not assigned to any one before this name." (19:7)',
    },
    {
      externalId: 'cb7-u8-q3',
      unitId: unit8.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'Yahya was given wisdom and prophethood only when he reached adulthood.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Quran states: "O Yahya, hold firmly to the Scripture." And We gave him wisdom while yet a child." (19:12) He received wisdom and prophethood in his youth.',
    },
    {
      externalId: 'cb7-u8-q4',
      unitId: unit8.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What was the cause of Yahya\'s martyrdom?',
      options: ['He refused to pay a tax', 'He condemned an immoral marriage planned by King Herod', 'He challenged a local ruler in debate', 'He refused to leave his town'],
      correctAnswer: 'He condemned an immoral marriage planned by King Herod',
      explanation: 'Yahya fearlessly condemned King Herod\'s planned incestuous marriage. As a result, he was imprisoned and later martyred.',
    },
    {
      externalId: 'cb7-u8-q5',
      unitId: unit8.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which surah of the Quran records Zakariyya\'s du\'a for a son?',
      options: ['Surah al-Baqarah', 'Surah Al \'Imran', 'Surah al-Kahf', 'Surah al-Anbiya'],
      correctAnswer: 'Surah Al \'Imran',
      explanation: 'Zakariyya\'s du\'a "Rabbi hab li min ladunka dhurriyyatan tayyibah" appears in Surah Al \'Imran (3:38).',
    },
    {
      externalId: 'cb7-u8-q6',
      unitId: unit8.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What is the primary lesson from the story of Zakariyya and Yahya?',
      options: [
        'Miracles only happen to prophets',
        'Never give up du\'a — Allah answers at the right time',
        'Old age prevents blessings',
        'Children must follow their parents\' profession'
      ],
      correctAnswer: 'Never give up du\'a — Allah answers at the right time',
      explanation: 'The story teaches that Allah\'s answer to du\'a comes at the perfect time. Zakariyya never stopped asking despite old age and apparent impossibility.',
    },

    // Unit 9 — Abbasid Caliphate
    {
      externalId: 'cb7-u9-q1',
      unitId: unit9.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'In which year did the Abbasid Caliphate come to power?',
      options: ['661 CE', '750 CE', '800 CE', '1258 CE'],
      correctAnswer: '750 CE',
      explanation: 'The Abbasids overthrew the Umayyad Caliphate in 750 CE, establishing their rule and eventually founding Baghdad as their capital.',
    },
    {
      externalId: 'cb7-u9-q2',
      unitId: unit9.id,
      type: 'FILL_BLANK' as const,
      questionText: 'The great library, translation centre, and academy established under the Abbasids was called Bayt al-________.',
      options: undefined,
      correctAnswer: 'Hikmah',
      explanation: 'Bayt al-Hikmah (House of Wisdom) was established in Baghdad under Caliph al-Ma\'mun. It became the world\'s leading centre of learning.',
    },
    {
      externalId: 'cb7-u9-q3',
      unitId: unit9.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Al-Khwarizmi is famous for which contribution to mathematics?',
      options: ['Inventing calculus', 'Developing algebra and the algorithm', 'Discovering pi', 'Creating the decimal system'],
      correctAnswer: 'Developing algebra and the algorithm',
      explanation: 'Al-Khwarizmi\'s book "Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala" gave the world algebra (al-jabr), and his name became the root of the word "algorithm".',
    },
    {
      externalId: 'cb7-u9-q4',
      unitId: unit9.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Who destroyed Baghdad and brought the Abbasid Caliphate to an end?',
      options: ['The Crusaders', 'Timur (Tamerlane)', 'Hulagu Khan of the Mongols', 'The Byzantine Empire'],
      correctAnswer: 'Hulagu Khan of the Mongols',
      explanation: 'Hulagu Khan\'s Mongol forces sacked Baghdad in 1258 CE, executing the last Abbasid Caliph al-Musta\'sim and destroying Bayt al-Hikmah.',
    },
    {
      externalId: 'cb7-u9-q5',
      unitId: unit9.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'Ibn Sina (Avicenna) was a Muslim scholar known primarily for his work in astronomy.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Ibn Sina (980–1037 CE) was primarily known for medicine. His "Canon of Medicine" (Al-Qanun fi al-Tibb) was used in European medical schools for over 600 years.',
    },
    {
      externalId: 'cb7-u9-q6',
      unitId: unit9.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which Abbasid Caliph founded the city of Baghdad?',
      options: ['Harun al-Rashid', 'Al-Ma\'mun', 'Al-Mansur', 'Al-Mu\'tasim'],
      correctAnswer: 'Al-Mansur',
      explanation: 'Caliph al-Mansur founded Baghdad (City of Peace) in 762 CE. Its circular design was unique and it rapidly became the greatest city in the world.',
    },

    // Unit 10 — Qadar
    {
      externalId: 'cb7-u10-q1',
      unitId: unit10.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which of the four aspects of qadar refers to everything being written in al-Lawh al-Mahfuz?',
      options: ['\'Ilm', 'Kitabah', 'Iradah', 'Khalq'],
      correctAnswer: 'Kitabah',
      explanation: 'Kitabah (the Recording) refers to Allah recording all of creation\'s events in al-Lawh al-Mahfuz (the Preserved Tablet) 50,000 years before creation.',
    },
    {
      externalId: 'cb7-u10-q2',
      unitId: unit10.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The aspect of qadar that refers to Allah\'s will (nothing happening without His permission) is called:',
      options: ['\'Ilm', 'Kitabah', 'Iradah', 'Khalq'],
      correctAnswer: 'Iradah',
      explanation: 'Iradah means Allah\'s will. Nothing in the universe happens except by His will and permission.',
    },
    {
      externalId: 'cb7-u10-q3',
      unitId: unit10.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'Believing in qadar means that humans have no free will and are not responsible for their choices.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Qadar does not negate human free will. Allah gave humans intellect and the capacity to choose. We are accountable for our choices. Both divine decree and human responsibility coexist.',
    },
    {
      externalId: 'cb7-u10-q4',
      unitId: unit10.id,
      type: 'FILL_BLANK' as const,
      questionText: 'When a calamity strikes, a Muslim says: "Inna lillahi wa inna ilayhi ________."',
      options: undefined,
      correctAnswer: 'raji\'un',
      explanation: '"Inna lillahi wa inna ilayhi raji\'un" means "Indeed, we belong to Allah, and indeed to Him we shall return." (Quran 2:156)',
    },
    {
      externalId: 'cb7-u10-q5',
      unitId: unit10.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Al-Lawh al-Mahfuz is best translated as:',
      options: ['The Book of Deeds', 'The Preserved Tablet', 'The Register of Souls', 'The Scroll of Prophecy'],
      correctAnswer: 'The Preserved Tablet',
      explanation: 'Al-Lawh al-Mahfuz (the Preserved Tablet) is where Allah recorded all events of creation before they occur.',
    },
    {
      externalId: 'cb7-u10-q6',
      unitId: unit10.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'How many aspects of qadar are taught in Islamic theology?',
      options: ['2', '3', '4', '6'],
      correctAnswer: '4',
      explanation: 'The four aspects of qadar are: \'Ilm (divine knowledge), Kitabah (recording), Iradah (divine will), and Khalq (divine creation of all things).',
    },

    // Unit 11 — Akhirah & Barzakh
    {
      externalId: 'cb7-u11-q1',
      unitId: unit11.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What is barzakh?',
      options: [
        'The bridge over Jahannam',
        'The intermediary state between death and resurrection',
        'The questioning on Judgement Day',
        'The scale of deeds'
      ],
      correctAnswer: 'The intermediary state between death and resurrection',
      explanation: 'Barzakh is the intermediary state between a person\'s death and the Day of Resurrection, during which the soul experiences either comfort or punishment.',
    },
    {
      externalId: 'cb7-u11-q2',
      unitId: unit11.id,
      type: 'FILL_BLANK' as const,
      questionText: 'The two angels who question the deceased in the grave are called Munkar and ________.',
      options: undefined,
      correctAnswer: 'Nakir',
      explanation: 'Munkar and Nakir are the two angels who question every person in the grave about their Lord, religion, and the Prophet.',
    },
    {
      externalId: 'cb7-u11-q3',
      unitId: unit11.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which angel blows the trumpet (Sur) to signal the resurrection?',
      options: ['Jibril', 'Mika\'il', 'Israfil', 'Malik'],
      correctAnswer: 'Israfil',
      explanation: 'Israfil is the angel tasked with blowing the Sur (trumpet). At the first blow all creation dies; at the second blow all are resurrected.',
    },
    {
      externalId: 'cb7-u11-q4',
      unitId: unit11.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'The Sirat is the name for the gathering of all people on the Plain of Judgement.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Sirat is the bridge stretched over Jahannam that believers must cross. The gathering on the Plain of Judgement is called the Hashr.',
    },
    {
      externalId: 'cb7-u11-q5',
      unitId: unit11.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'In the correct order of stages after death, what comes AFTER the questioning in the grave?',
      options: ['Barzakh experience continues until resurrection', 'Immediate entry into Jannah', 'The Hashr (gathering) on the plain', 'The crossing of the Sirat'],
      correctAnswer: 'Barzakh experience continues until resurrection',
      explanation: 'After the grave questioning, the soul continues in barzakh (experiencing either comfort or punishment) until the Day of Resurrection. Then come Hashr, Hisab, Sirat, and the final abode.',
    },
    {
      externalId: 'cb7-u11-q6',
      unitId: unit11.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What are the three questions asked by the angels in the grave?',
      options: [
        'What were your sins? How much Quran did you memorise? Did you perform Hajj?',
        'Who is your Lord? What is your religion? Who is this man (the Prophet)?',
        'How many prayers did you miss? Did you fast? Did you pay zakah?',
        'What did you do for Islam? Who were your parents? Where were you born?'
      ],
      correctAnswer: 'Who is your Lord? What is your religion? Who is this man (the Prophet)?',
      explanation: 'Munkar and Nakir ask three questions: "Who is your Lord?", "What is your religion?", and "Who is this man?" (referring to the Prophet Muhammad). The believer answers: Allah, Islam, Muhammad.',
    },

    // Unit 12 — Akhlaq: Time & Knowledge
    {
      externalId: 'cb7-u12-q1',
      unitId: unit12.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The hadith on "five before five" instructs us to benefit from our youth before:',
      options: ['Wealth', 'Old age', 'Busyness', 'Death'],
      correctAnswer: 'Old age',
      explanation: 'The first of the five things is: "your youth before your old age." All five are precious gifts with an expiry date.',
    },
    {
      externalId: 'cb7-u12-q2',
      unitId: unit12.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which of these is NOT one of the five things in the "five before five" hadith?',
      options: ['Health before illness', 'Wealth before poverty', 'Fame before obscurity', 'Life before death'],
      correctAnswer: 'Fame before obscurity',
      explanation: 'The five are: youth before old age, health before illness, wealth before poverty, free time before busyness, and life before death. Fame is not one of them.',
    },
    {
      externalId: 'cb7-u12-q3',
      unitId: unit12.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'According to Islamic teaching, a student of knowledge may benefit from learning even if they do not act on it.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Acting on knowledge is one of the key duties of a student. The Prophet warned that knowledge without action is a proof against the person, not for them.',
    },
    {
      externalId: 'cb7-u12-q4',
      unitId: unit12.id,
      type: 'FILL_BLANK' as const,
      questionText: 'Imam al-Shafi\'i\'s respectful behaviour towards Imam Malik\'s books is a famous example of Islamic ________ with teachers.',
      options: undefined,
      correctAnswer: 'adab',
      explanation: 'Adab (etiquette and respect) with teachers is an essential part of seeking knowledge in Islam. Imam al-Shafi\'i turned pages so gently that Imam Malik could not hear the rustling.',
    },
    {
      externalId: 'cb7-u12-q5',
      unitId: unit12.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'When seeking knowledge, what should a student\'s primary intention be?',
      options: ['To earn a qualification', 'For Allah\'s pleasure', 'To impress others', 'To gain employment'],
      correctAnswer: 'For Allah\'s pleasure',
      explanation: 'Knowledge sought for status, argument, or worldly gain loses its blessing. The correct intention is for Allah\'s pleasure and to act on what is learned.',
    },
    {
      externalId: 'cb7-u12-q6',
      unitId: unit12.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The hadith on "five before five" was reported by which narrator?',
      options: ['Bukhari', 'Muslim', 'Al-Hakim (sahih)', 'Abu Dawud'],
      correctAnswer: 'Al-Hakim (sahih)',
      explanation: 'The hadith "benefit from five before five" was reported by al-Hakim in his Mustadrak and graded as sahih.',
    },

    // Unit 13 — Akhlaq: Rumours & Salawat
    {
      externalId: 'cb7-u13-q1',
      unitId: unit13.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The Three Gates Test before speaking asks: Is it true? Is it kind? And:',
      options: ['Is it funny?', 'Is it necessary?', 'Is it interesting?', 'Is it brief?'],
      correctAnswer: 'Is it necessary?',
      explanation: 'The Three Gates: Is it true? Is it kind? Is it necessary? A word that fails any gate should not be spoken.',
    },
    {
      externalId: 'cb7-u13-q2',
      unitId: unit13.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'Remaining silent while others backbite is generally acceptable, as you have not participated.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Silence during backbiting can imply consent. A believer should redirect the conversation, defend the person, or leave — silence is not neutral.',
    },
    {
      externalId: 'cb7-u13-q3',
      unitId: unit13.id,
      type: 'FILL_BLANK' as const,
      questionText: 'The most complete form of salawat, mentioning both the Prophet and Ibrahim, is called al-Salawat al-________.',
      options: undefined,
      correctAnswer: 'Ibrahimiyyah',
      explanation: 'The Ibrahimiyyah salawat is recited in the final tashahhud of salah: "Allahumma salli \'ala Muhammadin wa \'ala ali Muhammadin kama sallayta \'ala Ibrahim..."',
    },
    {
      externalId: 'cb7-u13-q4',
      unitId: unit13.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Why is Friday especially important for sending salawat on the Prophet?',
      options: [
        'Friday is the only day salawat is accepted',
        'The Prophet specifically recommended increasing salawat on Fridays',
        'Salawat on Friday counts as 1000',
        'Allah only hears salawat on Fridays'
      ],
      correctAnswer: 'The Prophet specifically recommended increasing salawat on Fridays',
      explanation: 'The Prophet said: "Increase your salawat on me on Fridays." Friday is a special day in Islam and salawat on that day carries extra reward.',
    },
    {
      externalId: 'cb7-u13-q5',
      unitId: unit13.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Spreading gossip in a community most directly leads to:',
      options: ['More unity', 'Broken relationships and mistrust', 'Better communication', 'More forgiveness'],
      correctAnswer: 'Broken relationships and mistrust',
      explanation: 'Gossip breaks friendships, damages reputations, and creates an atmosphere where no one can be trusted — the opposite of the Islamic ideal of brotherhood.',
    },
    {
      externalId: 'cb7-u13-q6',
      unitId: unit13.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'When the Prophet\'s blessed name is mentioned and a Muslim does NOT send salawat, it is described as:',
      options: ['A minor oversight', 'Miserliness (bukhl)', 'Makruh only', 'Permissible if one is busy'],
      correctAnswer: 'Miserliness (bukhl)',
      explanation: 'The Prophet described as a miser the one who does not send salawat when his name is mentioned: "The real miser is the one in whose presence I am mentioned and he does not send salawat on me."',
    },

    // Unit 14 — Adab: Social Conduct
    {
      externalId: 'cb7-u14-q1',
      unitId: unit14.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'When entering a gathering, a Muslim should first:',
      options: ['Find the best seat', 'Greet everyone with salam', 'Check who is present before deciding to stay', 'Sit quietly without drawing attention'],
      correctAnswer: 'Greet everyone with salam',
      explanation: 'Greeting with salam when entering a gathering is a sunnah and an Islamic right. It spreads love and blessing among those present.',
    },
    {
      externalId: 'cb7-u14-q2',
      unitId: unit14.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'Whispering privately between two people in a group of three is permitted as long as it is not about the third person.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Prophet prohibited two people whispering privately in the presence of a third, as it causes hurt and suspicion. This rule applies regardless of the topic.',
    },
    {
      externalId: 'cb7-u14-q3',
      unitId: unit14.id,
      type: 'FILL_BLANK' as const,
      questionText: 'The Prophet said that removing something harmful from the path is a form of ________.',
      options: undefined,
      correctAnswer: 'sadaqah',
      explanation: 'The Prophet listed removing harm from the path as one of the many forms of sadaqah (charity). This teaches environmental responsibility.',
    },
    {
      externalId: 'cb7-u14-q4',
      unitId: unit14.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'According to Islamic teachings, spreading unverified news online is:',
      options: ['Permissible if the source seems reliable', 'Forbidden — one must verify before sharing', 'Only haram if it harms someone', 'Allowed in emergencies'],
      correctAnswer: 'Forbidden — one must verify before sharing',
      explanation: 'The Prophet said: "It is enough of a lie for a person to repeat everything he hears." The Quran also commands: "O believers, if a fasiq (wrongdoer) brings news, verify it." (49:6)',
    },
    {
      externalId: 'cb7-u14-q5',
      unitId: unit14.id,
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The hadith "He is not of us who does not show mercy to our young and honour to our elders" refers to which obligation?',
      options: [
        'Financial support for the elderly',
        'Standing and speaking respectfully to elders while being kind to youngsters',
        'Giving up one\'s seat on public transport only',
        'Teaching elders how to read the Quran'
      ],
      correctAnswer: 'Standing and speaking respectfully to elders while being kind to youngsters',
      explanation: 'This hadith encompasses the full range of our obligations: kindness and mercy with youngsters, respect and honour with elders — both are required of a true believer.',
    },
    {
      externalId: 'cb7-u14-q6',
      unitId: unit14.id,
      type: 'TRUE_FALSE' as const,
      questionText: 'A Muslim\'s Islamic identity and values only apply in the mosque and at home — online spaces are different.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Islamic values apply everywhere — including online. Allah is aware of all actions regardless of platform. Online behaviour, posting, and sharing are all accountable deeds.',
    },
  ];

  // Upsert all questions
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

  // ─── FLASHCARD DATA ──────────────────────────────────────────────────────────
  const flashcardData = [
    { unitId: unit1.id, front: 'Makruhat', back: 'Disliked acts in salah that reduce reward without invalidating the prayer (e.g. fidgeting, looking around).' },
    { unitId: unit1.id, front: 'Sutrah', back: 'A barrier placed in front of a person praying to mark their prayer space and prevent disruption.' },
    { unitId: unit1.id, front: 'Sajdah Tilawah', back: 'A wajib prostration performed when a verse of prostration (ayat al-sajdah) is recited or heard.' },
    { unitId: unit1.id, front: 'Qasr Salah', back: 'Shortening prayers during travel (Zuhr/Asr/Isha from 4 to 2 rak\'at) when travelling 48+ miles.' },
    { unitId: unit2.id, front: 'Nisab', back: 'The minimum threshold of wealth above which zakah becomes obligatory (gold: 87.5g; silver: 612.5g).' },
    { unitId: unit2.id, front: 'Faraid', back: 'The Islamic system of fixed inheritance shares prescribed in the Quran (Surah al-Nisa 4:11-12).' },
    { unitId: unit2.id, front: 'Asabah', back: 'Residual male heirs in Islamic inheritance who receive what remains after fixed shares are distributed.' },
    { unitId: unit3.id, front: 'I\'tikaf', back: 'Staying in the masjid with the intention of worship, cutting off from worldly activity.' },
    { unitId: unit3.id, front: 'Laylatul Qadr', back: 'The Night of Power — better than 1000 months — occurring in the odd nights of the last 10 of Ramadan.' },
    { unitId: unit3.id, front: 'Udhiyah', back: 'The animal sacrifice performed on 10th-12th Dhul Hijjah, wajib on those above nisab.' },
    { unitId: unit4.id, front: 'Salawat', back: 'Blessings sent upon the Prophet; for each one sent, Allah sends ten blessings in return.' },
    { unitId: unit5.id, front: 'Namimah', back: 'Tale-carrying — conveying words between people to cause harm or division. Condemned as a major sin.' },
    { unitId: unit5.id, front: 'Ghibah', back: 'Backbiting — mentioning something true about a person that they would dislike.' },
    { unitId: unit6.id, front: 'Tabassum', back: 'A gentle smile — the Prophet\'s usual expression of joy rather than audible laughter.' },
    { unitId: unit6.id, front: 'Shamail', back: 'The noble character, personal habits, and physical description of the Prophet — compiled by Imam al-Tirmidhi.' },
    { unitId: unit7.id, front: 'Diwan', back: 'Administrative registers established by \'Umar ibn al-Khattab to record stipends for Muslims.' },
    { unitId: unit7.id, front: 'Bayt al-Mal', back: 'The public treasury established by \'Umar ibn al-Khattab to manage state finances and welfare.' },
    { unitId: unit9.id, front: 'Bayt al-Hikmah', back: 'House of Wisdom — the great Abbasid library and academy in Baghdad under Caliph al-Ma\'mun.' },
    { unitId: unit10.id, front: 'Qadar', back: 'Divine decree — Allah\'s complete knowledge, recording, will, and creation of all things.' },
    { unitId: unit10.id, front: 'Al-Lawh al-Mahfuz', back: 'The Preserved Tablet — where Allah recorded all events of creation 50,000 years before it existed.' },
    { unitId: unit11.id, front: 'Barzakh', back: 'The intermediary state between death and resurrection, during which the soul experiences comfort or punishment.' },
    { unitId: unit11.id, front: 'Hashr', back: 'The gathering of all of humanity on the Plain of Judgement after resurrection.' },
    { unitId: unit11.id, front: 'Sirat', back: 'The bridge stretched over Jahannam that all people must cross on the Day of Judgement.' },
    { unitId: unit12.id, front: 'Sadaqah Jariyah', back: 'Ongoing charity whose reward continues after death — including beneficial knowledge and a righteous child.' },
    { unitId: unit13.id, front: 'Three Gates Test', back: 'Before speaking, ask: Is it true? Is it kind? Is it necessary? Only speak if it passes all three.' },
    { unitId: unit14.id, front: 'Khushu\'', back: 'Humility, concentration, and presence of heart in salah and worship.' },
    { unitId: unit14.id, front: 'Adab', back: 'Islamic etiquette and manners — showing respect and courtesy in all interactions.' },
  ];

  await prisma.flashCard.deleteMany({ where: { courseId: course.id } });
  for (let i = 0; i < flashcardData.length; i++) {
    const fc = flashcardData[i];
    await prisma.flashCard.create({
      data: {
        unitId: fc.unitId,
        courseId: course.id,
        front: fc.front,
        back: fc.back,
        category: 'Vocabulary',
        tags: ['maktab-7'],
        orderIndex: i,
      },
    });
  }

  // ─── ARABIC TERMS ────────────────────────────────────────────────────────────
  const arabicTermsData = [
    { unitId: unit1.id, arabicText: 'مَكْرُوهَات', transliteration: 'Makruhat', translation: 'Disliked acts (in salah) that reduce reward without invalidating the prayer' },
    { unitId: unit1.id, arabicText: 'سُتْرَة', transliteration: 'Sutrah', translation: 'Barrier placed in front of a person praying' },
    { unitId: unit1.id, arabicText: 'سَجْدَة التِّلَاوَة', transliteration: 'Sajdah al-Tilawah', translation: 'Prostration of recitation — performed when a verse of prostration is heard' },
    { unitId: unit2.id, arabicText: 'نِصَاب', transliteration: 'Nisab', translation: 'Minimum threshold of wealth above which zakah becomes obligatory' },
    { unitId: unit2.id, arabicText: 'فَرَائِض', transliteration: "Fara'id", translation: 'Fixed shares in Islamic inheritance prescribed in the Quran' },
    { unitId: unit3.id, arabicText: 'اعْتِكَاف', transliteration: "I'tikaf", translation: 'Seclusion in the masjid with the intention of worship' },
    { unitId: unit3.id, arabicText: 'لَيْلَةُ الْقَدْر', transliteration: 'Laylat al-Qadr', translation: 'The Night of Power — better than a thousand months' },
    { unitId: unit3.id, arabicText: 'أُضْحِيَة', transliteration: 'Udhiyyah', translation: 'The ritual animal sacrifice performed during Eid al-Adha' },
    { unitId: unit4.id, arabicText: 'صَلَوَات', transliteration: 'Salawat', translation: 'Blessings sent upon the Prophet Muhammad (peace be upon him)' },
    { unitId: unit5.id, arabicText: 'نَمِيمَة', transliteration: 'Nameemah', translation: 'Tale-carrying — conveying words between people to cause division or harm' },
    { unitId: unit5.id, arabicText: 'غِيبَة', transliteration: 'Ghibah', translation: 'Backbiting — mentioning something true about a person that they would dislike' },
    { unitId: unit9.id, arabicText: 'بَيْت الْحِكْمَة', transliteration: 'Bayt al-Hikmah', translation: 'House of Wisdom — the great Abbasid library and academy in Baghdad' },
    { unitId: unit10.id, arabicText: 'قَدَر', transliteration: 'Qadar', translation: 'Divine decree — Allah\'s complete knowledge, recording, will and creation of all things' },
    { unitId: unit10.id, arabicText: 'اللَّوْح الْمَحْفُوظ', transliteration: 'Al-Lawh al-Mahfuz', translation: 'The Preserved Tablet on which all events of creation are recorded' },
    { unitId: unit11.id, arabicText: 'بَرْزَخ', transliteration: 'Barzakh', translation: 'The intermediary state between death and resurrection' },
    { unitId: unit11.id, arabicText: 'الصِّرَاط', transliteration: 'As-Sirat', translation: 'The bridge over Jahannam that all must cross on the Day of Judgement' },
    { unitId: unit12.id, arabicText: 'صَدَقَة جَارِيَة', transliteration: 'Sadaqah Jariyah', translation: 'Ongoing charity whose reward continues after death' },
    { unitId: unit14.id, arabicText: 'أَدَب', transliteration: 'Adab', translation: 'Islamic etiquette and manners — showing respect and courtesy in all interactions' },
  ];

  const uniqueUnitIds = [...new Set(arabicTermsData.map((t) => t.unitId))];
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

  // Demo progress
  if (demoChild) {
    await prisma.unitProgress.upsert({
      where: { userId_unitId: { userId: demoChild.id, unitId: unit1.id } },
      update: { completed: true, score: 88 },
      create: { userId: demoChild.id, unitId: unit1.id, completed: true, score: 88 },
    });
  }

  console.log('CB7 seeded: 14 units, 84 questions, 27 flashcards, 18 Arabic terms');
  console.log('Units: Advanced Salah, Zakah & Inheritance, I\'tikaf & Udhiyah, Ahadith (Time/Knowledge), Ahadith (Rumours), Shamail, \'Umar, Zakariyya & Yahya, Abbasids, Qadar, Akhirah & Barzakh, Akhlaq (Time/Knowledge), Akhlaq (Rumours/Salawat), Adab (Social Conduct)');
}

async function main() {
  try {
    await seedMaktabCoursebook7();
    console.log('Maktab Coursebook 7 seed completed successfully.');
  } catch (error) {
    console.error('Error seeding Maktab Coursebook 7:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
