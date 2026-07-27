import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 3 — Islamic Curriculum Seed (Restructured)
 * Source: An Nasihah Publications, Age Range: 8–9 years
 *
 * 16 focused units — each covering exactly ONE main topic.
 * Subjects: Fiqh (3), Ahadith (2), Sirah (2), Tarikh (2),
 *           Aqaid (2), Akhlaq (2), Adab (3)
 */

export async function seedMaktabCoursebook3() {
  console.log('📚 Starting Maktab Coursebook 3 seed...');
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
    where: { slug: 'maktab-coursebook-3' },
    create: {
      slug: 'maktab-coursebook-3',
      title: 'Maktab Coursebook 3',
      description: 'An Islamic curriculum for learners aged 8-9 years. Covers fiqh of taharah, najasah, ghusl, and salah, key ahadith on love, mercy, modesty, and this world, sirah of the migration to Abyssinia and al-Isra wal-Miraj, tarikh of Prophets Ibrahim and Ismail alayhima al-salam, aqaid on prophets and signs of the Last Day, akhlaq of honoring parents and truthfulness, and adab of the Quran, masjid, travelling, studying, and walking. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['CHILD'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 3',
      description: 'An Islamic curriculum for learners aged 8-9 years. Covers fiqh of taharah, najasah, ghusl, and salah, key ahadith on love, mercy, modesty, and this world, sirah of the migration to Abyssinia and al-Isra wal-Miraj, tarikh of Prophets Ibrahim and Ismail alayhima al-salam, aqaid on prophets and signs of the Last Day, akhlaq of honoring parents and truthfulness, and adab of the Quran, masjid, travelling, studying, and walking. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['CHILD'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // CLEANUP: Remove deprecated broad-subject units
  // ──────────────────────────────────────────────
  const oldSlugs = ['maktab-3-fiqh','maktab-3-ahadith','maktab-3-sirah','maktab-3-tarikh','maktab-3-aqaid','maktab-3-akhlaq','maktab-3-adab'];
  for (const slug of oldSlugs) {
    const old = await prisma.unit.findFirst({ where: { courseId: course.id, slug } });
    if (old) {
      await prisma.question.deleteMany({ where: { unitId: old.id } });
      await prisma.unitProgress.deleteMany({ where: { unitId: old.id } });
      await prisma.unit.delete({ where: { id: old.id } });
    }
  }

  // ══════════════════════════════════════════════
  // UNIT 1: FIQH — Taharah, Impurities & Najasah
  // ══════════════════════════════════════════════

  const unit1Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the two types of taharah, identify the categories of najasah, and describe how to purify impurities from clothes and body.</p>

<h2>Taharah — Purity in Islam</h2>
<p>Taharah means cleanliness and purity. It is of two types:</p>
<ul>
  <li><strong>Taharah Haqiqi (Physical Purity):</strong> Removing dirt and impurities from the body, clothes, and place of prayer.</li>
  <li><strong>Taharah Ma'nawi (Spiritual Purity):</strong> Purifying the heart from evil such as pride, jealousy, and hatred.</li>
</ul>
<p>Allah loves those who are pure. The Prophet said: "Purity is half of faith."</p>

<h2>Najasah — Impurities</h2>
<p>Najasah refers to filth that must be removed before salah. There are two categories:</p>

<h3>Najasah Ghalizah (Heavy Impurity)</h3>
<p>These are serious impurities. Examples include:</p>
<ul>
  <li>Human urine and stool</li>
  <li>Animal dung of animals whose meat is not permissible to eat (e.g., donkey, pig)</li>
  <li>Blood that flows</li>
  <li>Alcohol (wine)</li>
</ul>
<p>If heavy impurity falls on clothes or body:</p>
<ul>
  <li>If it is <strong>less than a dirham</strong> (roughly the size of the hollow of the palm), salah is <em>makruh</em> but valid.</li>
  <li>If it is <strong>more than a dirham</strong>, salah is <em>not valid</em> — it must be washed off first.</li>
</ul>

<h3>Najasah Khafifah (Light Impurity)</h3>
<p>These are lighter impurities. Examples include:</p>
<ul>
  <li>Urine of animals whose meat is permissible (e.g., camel, goat)</li>
  <li>Droppings of birds not permissible to eat</li>
</ul>
<p>Light impurity only affects salah if it covers <strong>more than a quarter</strong> of the garment or body part.</p>

<h2>How to Purify Impurities</h2>
<ul>
  <li>If the impurity is liquid (e.g., urine): wash until the smell, colour, and taste are removed — at least three washes is recommended.</li>
  <li>If the impurity is solid or dry (e.g., dry dung): it can be scraped off first, then washed.</li>
  <li>If impurity falls on the ground: pouring water on it purifies it.</li>
</ul>
`.trim();

  const unit1 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-fiqh-tahara-najasa' } },
    create: {
      slug: 'maktab-3-fiqh-tahara-najasa',
      courseId: course.id,
      orderIndex: 1,
      title: 'Fiqh — Taharah, Impurities & Najasah',
      description: 'The two types of taharah, categories of najasah (heavy and light), amounts that affect the validity of salah, and how to purify impurities.',
      content: unit1Content,
    },
    update: {
      title: 'Fiqh — Taharah, Impurities & Najasah',
      description: 'The two types of taharah, categories of najasah (heavy and light), amounts that affect the validity of salah, and how to purify impurities.',
      content: unit1Content,
    },
  });
  console.log('✅ Unit 1:', unit1.title);

  // ══════════════════════════════════════════════
  // UNIT 2: FIQH — Ghusl (Full Bath)
  // ══════════════════════════════════════════════

  const unit2Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to list the occasions when ghusl is obligatory, state the three fara'id of ghusl, and describe the sunnah method of performing ghusl.</p>

<h2>Ghusl — The Full Bath</h2>
<p>Ghusl is a complete purification of the whole body with water. It is obligatory on certain occasions and highly recommended on others.</p>

<h2>When Is Ghusl Obligatory?</h2>
<p>Ghusl becomes <strong>fard (obligatory)</strong> on these occasions:</p>
<ul>
  <li><strong>Janabah:</strong> After conjugal relations or a wet dream (for adults).</li>
  <li><strong>After Hayd:</strong> When a woman's monthly period ends.</li>
  <li><strong>After Nifas:</strong> When a woman's post-childbirth bleeding ends.</li>
  <li><strong>At Death:</strong> Giving ghusl to a deceased Muslim is fard al-kifayah (communal obligation).</li>
</ul>

<h2>Three Fara'id (Obligatory Acts) of Ghusl</h2>
<p>For ghusl to be valid, these three acts <strong>must</strong> be performed:</p>
<ol>
  <li><strong>Rinsing the mouth</strong> (madmadah) — water must reach all parts of the mouth.</li>
  <li><strong>Rinsing the nose</strong> (istinshaq) — sniffing water up into both nostrils.</li>
  <li><strong>Washing the entire body</strong> — every part of the outer body, including the hair and skin, must be wetted thoroughly.</li>
</ol>

<h2>Sunnah Method of Ghusl</h2>
<ol>
  <li>Make niyyah (intention) for ghusl.</li>
  <li>Begin with Bismillah.</li>
  <li>Wash both hands up to the wrists three times.</li>
  <li>Wash private parts.</li>
  <li>Perform full wudu' (except washing the feet — leave until the end).</li>
  <li>Pour water over the head three times, rubbing through the hair.</li>
  <li>Pour water over the right shoulder three times, then the left three times.</li>
  <li>Wash the entire body, making sure water reaches everywhere.</li>
  <li>Move away from that spot and wash the feet.</li>
</ol>

<h2>Recommended Ghusl: Ghusl of Jumu'ah</h2>
<p>It is a confirmed sunnah (sunnah mu'akkadah) to perform ghusl on <strong>Friday</strong> before going to Jumu'ah salah. The Prophet strongly encouraged it.</p>
`.trim();

  const unit2 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-fiqh-ghusl' } },
    create: {
      slug: 'maktab-3-fiqh-ghusl',
      courseId: course.id,
      orderIndex: 2,
      title: "Fiqh — Ghusl: The Full Bath",
      description: "Occasions that make ghusl obligatory, the three fara'id of ghusl, the sunnah method, and the recommended ghusl of Friday.",
      content: unit2Content,
    },
    update: {
      title: "Fiqh — Ghusl: The Full Bath",
      description: "Occasions that make ghusl obligatory, the three fara'id of ghusl, the sunnah method, and the recommended ghusl of Friday.",
      content: unit2Content,
    },
  });
  console.log('✅ Unit 2:', unit2.title);

  // ══════════════════════════════════════════════
  // UNIT 3: FIQH — Salah (Structure & Requirements)
  // ══════════════════════════════════════════════

  const unit3Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to list the prerequisites of salah, name the seven fara'id within salah, and state how many raka'at each prayer has.</p>

<h2>Prerequisites of Salah</h2>
<p>Before beginning salah, the following conditions <strong>must</strong> be met:</p>
<ul>
  <li><strong>Taharah:</strong> Being in a state of purity (wudu' or ghusl if required).</li>
  <li><strong>Covering the 'Awrah:</strong> Men must cover navel to knee; women must cover the entire body except face, hands, and feet.</li>
  <li><strong>Facing the Qiblah:</strong> Turning towards the Ka'bah in Makkah.</li>
  <li><strong>Niyyah (Intention):</strong> Having the intention in the heart for which prayer you are performing.</li>
  <li><strong>Time:</strong> Performing the salah within its designated time.</li>
</ul>

<h2>Seven Fara'id (Obligatory Acts) Within Salah</h2>
<p>These seven acts <strong>must</strong> be performed for salah to be valid:</p>
<ol>
  <li><strong>Takbir al-Tahrimah:</strong> Saying "Allahu Akbar" to begin the prayer.</li>
  <li><strong>Qiyam (Standing):</strong> Standing upright in fard prayers (if physically able).</li>
  <li><strong>Qira'ah (Recitation):</strong> Reciting at least one verse (ayah) of the Quran.</li>
  <li><strong>Ruku' (Bowing):</strong> Bowing until hands reach the knees.</li>
  <li><strong>Sajdah (Prostration):</strong> Prostrating with forehead, nose, both palms, both knees, and toes touching the ground — performed twice per rak'ah.</li>
  <li><strong>Qa'dah al-Akhirah (Final Sitting):</strong> Sitting after the last rak'ah long enough to recite at-Tashahhud.</li>
  <li><strong>Ending with Salam:</strong> Concluding the prayer by saying "al-Salamu 'alaykum wa rahmatullah" to the right and left.</li>
</ol>

<h2>Number of Raka'at per Prayer</h2>
<table>
  <tr><th>Prayer</th><th>Fard Raka'at</th></tr>
  <tr><td>Fajr</td><td>2</td></tr>
  <tr><td>Zuhr</td><td>4</td></tr>
  <tr><td>'Asr</td><td>4</td></tr>
  <tr><td>Maghrib</td><td>3</td></tr>
  <tr><td>'Isha'</td><td>4</td></tr>
</table>

<h2>Reminder</h2>
<p>Salah is the second pillar of Islam. Allah commands the believers to guard their prayers: "Indeed, salah is an obligation on the believers at prescribed times." (Quran 4:103)</p>
`.trim();

  const unit3 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-fiqh-salah' } },
    create: {
      slug: 'maktab-3-fiqh-salah',
      courseId: course.id,
      orderIndex: 3,
      title: "Fiqh — Salah: Structure & Requirements",
      description: "Prerequisites of salah, the seven fara'id within salah, and the number of raka'at for each of the five daily prayers.",
      content: unit3Content,
    },
    update: {
      title: "Fiqh — Salah: Structure & Requirements",
      description: "Prerequisites of salah, the seven fara'id within salah, and the number of raka'at for each of the five daily prayers.",
      content: unit3Content,
    },
  });
  console.log('✅ Unit 3:', unit3.title);

  // ══════════════════════════════════════════════
  // UNIT 4: AHADITH — Love, Mercy & Compassion
  // ══════════════════════════════════════════════

  const unit4Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to recite and understand three key ahadith about love, mercy, and treating guests well, and apply their lessons to daily life.</p>

<h2>Hadith 1: Love for Others What You Love for Yourself</h2>
<p>The Prophet said:</p>
<blockquote>"None of you truly believes until he loves for his brother what he loves for himself." (Bukhari &amp; Muslim)</blockquote>
<p>This hadith teaches us that true faith means caring about others as much as we care about ourselves. If we want food, shelter, happiness, and Allah's blessings — we should want the same for every Muslim.</p>

<h2>Hadith 2: Show Mercy to Receive Mercy</h2>
<p>The Prophet said:</p>
<blockquote>"Show mercy to those on earth, and the One in the heavens will show mercy to you." (Tirmidhi)</blockquote>
<p>This beautiful hadith shows the connection between how we treat people and how Allah treats us. Being kind to people, animals, and all of creation is a way to earn Allah's mercy.</p>

<h2>Hadith 3: Honouring the Guest</h2>
<p>The Prophet said:</p>
<blockquote>"Whoever believes in Allah and the Last Day, let him honour his guest." (Bukhari &amp; Muslim)</blockquote>
<p>Part of being a good Muslim is welcoming guests warmly. The Prophet always treated guests with the greatest respect and generosity.</p>

<h2>Summary of Lessons</h2>
<ul>
  <li>Love for your Muslim brothers and sisters what you love for yourself.</li>
  <li>Be merciful and kind — Allah will be merciful to you.</li>
  <li>Always honour and welcome guests generously.</li>
</ul>
`.trim();

  const unit4 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-ahadith-love-mercy' } },
    create: {
      slug: 'maktab-3-ahadith-love-mercy',
      courseId: course.id,
      orderIndex: 4,
      title: "Ahadith — Love, Mercy & Compassion",
      description: "Three key ahadith: loving for others what we love for ourselves, showing mercy to earn Allah's mercy, and honouring guests as a sign of faith.",
      content: unit4Content,
    },
    update: {
      title: "Ahadith — Love, Mercy & Compassion",
      description: "Three key ahadith: loving for others what we love for ourselves, showing mercy to earn Allah's mercy, and honouring guests as a sign of faith.",
      content: unit4Content,
    },
  });
  console.log('✅ Unit 4:', unit4.title);

  // ══════════════════════════════════════════════
  // UNIT 5: AHADITH — This World, Modesty & Steadfastness
  // ══════════════════════════════════════════════

  const unit5Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain three ahadith about the temporary nature of this world, the importance of modesty (haya'), and staying firm in din.</p>

<h2>Hadith 1: This World Is Like Shade Under a Tree</h2>
<p>The Prophet said:</p>
<blockquote>"What do I have to do with this world? I am in this world like a rider who rests in the shade of a tree, then moves on and leaves it behind." (Tirmidhi, Ibn Majah)</blockquote>
<p>This world is temporary — like shade that disappears. We should not become too attached to worldly things. Our real home is the Akhirah (Hereafter).</p>

<h2>Hadith 2: Haya' (Modesty) Is Part of Faith</h2>
<p>The Prophet said:</p>
<blockquote>"Faith (Iman) has seventy-odd branches. The highest is saying La ilaha illallah, and the lowest is removing something harmful from the road. And haya' (modesty) is a branch of faith." (Bukhari &amp; Muslim)</blockquote>
<p>Haya' means feeling shy about displeasing Allah, being modest in behaviour, dress, and speech. It is not weakness — the Prophet said: "Haya' brings nothing but good."</p>

<h2>Hadith 3: Steadfastness When Fitnah Comes</h2>
<p>The Prophet said:</p>
<blockquote>"There will come a time when holding on to your din will be like holding a burning coal." (Tirmidhi)</blockquote>
<p>As times become harder, staying firm in Islam becomes more important and more difficult. We must hold firmly to our prayers, our values, and our community.</p>

<h2>Summary of Lessons</h2>
<ul>
  <li>This dunya is short — do not be deceived by it.</li>
  <li>Haya' is a branch of Iman — protect your modesty.</li>
  <li>Stay firm in din no matter how difficult times become.</li>
</ul>
`.trim();

  const unit5 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-ahadith-world-modesty' } },
    create: {
      slug: 'maktab-3-ahadith-world-modesty',
      courseId: course.id,
      orderIndex: 5,
      title: "Ahadith — This World, Modesty & Steadfastness",
      description: "Three ahadith: the temporary nature of this dunya, haya' (modesty) as a branch of faith, and steadfastness when facing fitnah.",
      content: unit5Content,
    },
    update: {
      title: "Ahadith — This World, Modesty & Steadfastness",
      description: "Three ahadith: the temporary nature of this dunya, haya' (modesty) as a branch of faith, and steadfastness when facing fitnah.",
      content: unit5Content,
    },
  });
  console.log('✅ Unit 5:', unit5.title);

  // ══════════════════════════════════════════════
  // UNIT 6: SIRAH — Persecution & Migration to Abyssinia
  // ══════════════════════════════════════════════

  const unit6Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe how early Muslims were persecuted in Makkah, explain why they migrated to Abyssinia, and describe the protection given by Najashi.</p>

<h2>Persecution of Early Muslims</h2>
<p>After the Prophet began preaching Islam, the leaders of Makkah became angry. They could not harm the Prophet directly because of his uncle Abu Talib's protection — so they attacked his followers:</p>
<ul>
  <li><strong>Bilal ibn Rabah</strong> (a freed slave): His master Umayyah ibn Khalaf would place a heavy boulder on his chest in the blazing sun, saying "Deny Muhammad." Bilal would only say: "Ahad! Ahad!" (One! One!). He was later freed by Sayyiduna Abu Bakr.</li>
  <li><strong>'Ammar ibn Yasir and his parents Yasir and Sumayyah:</strong> They were tortured severely. Sumayyah became the first martyr in Islam when she was killed by Abu Jahl.</li>
  <li>Many other poor and weak Muslims were beaten, starved, and humiliated.</li>
</ul>

<h2>Migration to Abyssinia (615 CE)</h2>
<p>The Prophet saw the suffering of his companions and advised them to go to Abyssinia (modern-day Ethiopia), saying:</p>
<blockquote>"In Abyssinia there is a king under whom no one is oppressed. Go there until Allah opens a way for you."</blockquote>
<p>The <strong>first migration</strong> included about 12-15 companions. The <strong>second migration</strong> was larger — about 83 men and 18 women went, including 'Uthman ibn 'Affan and his wife Ruqayyah (the Prophet's daughter).</p>

<h2>Najashi — The Righteous King</h2>
<p>The ruler of Abyssinia was <strong>al-Najashi</strong> (Ashamah). He was a Christian king known for his justice.</p>
<ul>
  <li>The Quraysh sent a delegation ('Amr ibn al-'As and 'Abdullah ibn Abi Rabi'ah) with gifts to persuade Najashi to return the Muslims.</li>
  <li>Najashi listened to Ja'far ibn Abi Talib recite from Surah Maryam about 'Isa alayhi al-salam.</li>
  <li>Najashi was moved to tears and said: "By Allah, the difference between what you say and what we say is no more than this" — and drew a line on the ground.</li>
  <li>He refused to hand over the Muslims and protected them throughout their stay.</li>
</ul>

<h2>Why This Migration Matters</h2>
<p>The migration to Abyssinia shows the courage of the early Muslims and the wisdom of the Prophet. It also shows that Islam teaches us to seek safety when persecuted — and that justice and truth can come from unexpected places.</p>
`.trim();

  const unit6 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-sirah-abyssinia' } },
    create: {
      slug: 'maktab-3-sirah-abyssinia',
      courseId: course.id,
      orderIndex: 6,
      title: "Sirah — Persecution & Migration to Abyssinia",
      description: "Persecution of early Muslims in Makkah, the first and second migrations to Abyssinia (615 CE), and the protection given by Najashi.",
      content: unit6Content,
    },
    update: {
      title: "Sirah — Persecution & Migration to Abyssinia",
      description: "Persecution of early Muslims in Makkah, the first and second migrations to Abyssinia (615 CE), and the protection given by Najashi.",
      content: unit6Content,
    },
  });
  console.log('✅ Unit 6:', unit6.title);

  // ══════════════════════════════════════════════
  // UNIT 7: SIRAH — Year of Sorrow & al-Isra' wal-Mi'raj
  // ══════════════════════════════════════════════

  const unit7Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain why the 10th year of prophethood was called the "Year of Sorrow," describe al-Isra' and al-Mi'raj, and explain the gift of the five daily prayers.</p>

<h2>The Year of Sorrow ('Am al-Huzn)</h2>
<p>In the 10th year of prophethood, the Prophet suffered two great losses within a short time:</p>
<ul>
  <li><strong>Sayyidah Khadijah</strong> — the Prophet's beloved wife of 25 years, his greatest supporter and comforter, passed away. She was the first person to believe in him.</li>
  <li><strong>Abu Talib</strong> — the Prophet's uncle and protector, passed away shortly after. Although he did not accept Islam, he had shielded the Prophet from the Quraysh for years.</li>
</ul>
<p>With these two losses, the Prophet was deeply grieved. The Quraysh became bolder in their persecution. This year is called <em>'Am al-Huzn</em> — the Year of Sorrow.</p>

<h2>Al-Isra' — The Night Journey</h2>
<p>As a consolation and honour, Allah took the Prophet on a miraculous night journey:</p>
<ul>
  <li>Jibril alayhi al-salam came and took the Prophet on <strong>Buraq</strong> — a white creature larger than a donkey but smaller than a mule, whose stride reached as far as the eye could see.</li>
  <li>They travelled from <strong>Masjid al-Haram</strong> (Makkah) to <strong>Masjid al-Aqsa</strong> (Jerusalem) in one night.</li>
  <li>At Masjid al-Aqsa, the Prophet led all the previous prophets in salah as their imam.</li>
</ul>

<h2>Al-Mi'raj — The Ascent Through the Heavens</h2>
<p>From Masjid al-Aqsa, the Prophet was taken up through the seven heavens:</p>
<ul>
  <li>In each heaven he met different prophets: Adam, Yahya &amp; 'Isa, Yusuf, Idris, Harun, Musa, and finally Ibrahim alayhim al-salam.</li>
  <li>The Prophet reached <strong>Sidrat al-Muntaha</strong> (the Lote Tree of the Utmost Boundary) — a place no creation had reached before.</li>
  <li>Allah spoke to the Prophet directly.</li>
</ul>

<h2>The Gift: Five Daily Prayers</h2>
<p>On this night, Allah gifted the Muslim ummah the <strong>five daily salah</strong>. Originally 50 prayers were commanded. After Musa alayhi al-salam advised the Prophet to request reductions, it was reduced to 5 — but with the reward of 50. The Prophet returned to Makkah before dawn.</p>

<h2>The Miracle</h2>
<p>When the Prophet told the Quraysh about his journey, many mocked him. But Abu Bakr immediately believed him, earning the title al-Siddiq (the Truthful Confirmer).</p>
`.trim();

  const unit7 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-sirah-isra-miraj' } },
    create: {
      slug: 'maktab-3-sirah-isra-miraj',
      courseId: course.id,
      orderIndex: 7,
      title: "Sirah — Year of Sorrow & al-Isra' wal-Mi'raj",
      description: "The Year of Sorrow (deaths of Khadijah and Abu Talib), al-Isra' (night journey to Masjid al-Aqsa), al-Mi'raj (ascent through the heavens), and the gift of five daily prayers.",
      content: unit7Content,
    },
    update: {
      title: "Sirah — Year of Sorrow & al-Isra' wal-Mi'raj",
      description: "The Year of Sorrow (deaths of Khadijah and Abu Talib), al-Isra' (night journey to Masjid al-Aqsa), al-Mi'raj (ascent through the heavens), and the gift of five daily prayers.",
      content: unit7Content,
    },
  });
  console.log('✅ Unit 7:', unit7.title);

  // ══════════════════════════════════════════════
  // UNIT 8: TARIKH — Prophet Ibrahim alayhi al-salam
  // ══════════════════════════════════════════════

  const unit8Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe Ibrahim's challenge to idol-worship, explain the miracle of the fire, and identify the greatest test Allah gave him.</p>

<h2>Early Life of Ibrahim alayhi al-salam</h2>
<p>Prophet Ibrahim alayhi al-salam was born in <strong>Ur</strong>, in what is now Iraq. He lived among a people who worshipped idols — statues they themselves carved. His own father, Azar, was a maker and seller of idols.</p>
<p>From a young age, Ibrahim used his intellect to seek the truth. He looked at the stars, moon, and sun, and when they set or disappeared, he concluded: "I do not love things that set." He came to know that Allah alone — the Creator — is worthy of worship.</p>

<h2>Challenging Idol-Worship</h2>
<p>Ibrahim tried to reason with his father and people, telling them that idols cannot see, hear, speak, or benefit anyone. When they refused to listen, he went into the temple and smashed all the idols — except the biggest one. He placed the axe on it so people would blame it.</p>
<p>When confronted, Ibrahim cleverly asked: "Why don't you ask the biggest idol?" When they replied "You know it cannot speak," he said: "Then how can you worship things that cannot speak, see, or help you?"</p>

<h2>Thrown Into the Fire — The Miracle</h2>
<p>The people were furious. They decided to throw Ibrahim into an enormous fire as punishment. But Allah commanded:</p>
<blockquote>"O fire! Be coolness and safety for Ibrahim." (Quran 21:69)</blockquote>
<p>The fire did not harm Ibrahim at all — it became cool and peaceful for him. This was one of the greatest miracles in history.</p>

<h2>Leaving for the Holy Land</h2>
<p>After his people still refused to believe, Ibrahim left with his wife Sarah and nephew Lut for the land of <strong>Canaan</strong> (present-day Palestine/Syria). This land was blessed by Allah.</p>

<h2>The Greatest Test</h2>
<p>Later in life, Allah tested Ibrahim alayhi al-salam with the command to sacrifice his son Ismail. Both father and son submitted completely to Allah's will. Just as Ibrahim raised the knife, Allah replaced Ismail with a ram, and declared that Ibrahim had passed the test. This act of sacrifice is remembered every year on 'Id al-Adha.</p>
`.trim();

  const unit8 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-tarikh-ibrahim' } },
    create: {
      slug: 'maktab-3-tarikh-ibrahim',
      courseId: course.id,
      orderIndex: 8,
      title: "Tarikh — Prophet Ibrahim alayhi al-salam",
      description: "Ibrahim's challenge to idol-worship, the miracle of the fire, his migration to Canaan, and the great test of sacrificing his son.",
      content: unit8Content,
    },
    update: {
      title: "Tarikh — Prophet Ibrahim alayhi al-salam",
      description: "Ibrahim's challenge to idol-worship, the miracle of the fire, his migration to Canaan, and the great test of sacrificing his son.",
      content: unit8Content,
    },
  });
  console.log('✅ Unit 8:', unit8.title);

  // ══════════════════════════════════════════════
  // UNIT 9: TARIKH — Prophet Ismail & the Ka'bah
  // ══════════════════════════════════════════════

  const unit9Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe the story of Hajar and the appearance of ZamZam, explain the building of the Ka'bah, and state what Ibrahim prayed for when calling people to Hajj.</p>

<h2>Hajar and Ismail in the Desert</h2>
<p>On Allah's command, Prophet Ibrahim alayhi al-salam took his wife Hajar and their infant son Ismail to the barren valley of <strong>Makkah</strong> — a place with no water, no food, and no people.</p>
<p>Ibrahim left them there with a small supply of dates and a waterskin of water. When Hajar asked: "Has Allah commanded you to do this?" and Ibrahim replied "Yes," she said: "Then Allah will not abandon us."</p>

<h2>Sa'y — Running Between Safa and Marwah</h2>
<p>When the water ran out and baby Ismail cried from thirst, Hajar ran desperately between the two hills of <strong>Safa</strong> and <strong>Marwah</strong>, seven times, searching for water or anyone who could help.</p>
<p>This courageous act of a mother is commemorated by millions of pilgrims every year during Hajj and 'Umrah. It is called <strong>Sa'y</strong>.</p>

<h2>The Miracle of ZamZam</h2>
<p>After Hajar's seventh run, Allah caused a spring to burst from the ground near baby Ismail's feet. Some narrations say the angel Jibril struck the ground. This was the <strong>ZamZam</strong> spring.</p>
<p>Birds circled above, and the tribe of <strong>Jurhum</strong> — a tribe of travellers — came seeking water. They asked Hajar's permission to settle near the spring, and she agreed. Ismail grew up among them and learned to speak Arabic.</p>

<h2>Building the Ka'bah</h2>
<p>When Ismail grew up, Allah commanded Ibrahim alayhi al-salam to build the <strong>Ka'bah</strong> — the House of Allah. Father and son worked together:</p>
<ul>
  <li>Ibrahim laid the foundation and built the walls.</li>
  <li>Ismail passed the stones to his father.</li>
  <li>As they built, they prayed: "Our Lord, accept this from us. You are the All-Hearing, All-Knowing." (Quran 2:127)</li>
  <li>Ibrahim placed the <strong>Hajar al-Aswad</strong> (the Black Stone) in the corner — a stone from Jannah that Jibril brought.</li>
</ul>

<h2>The Call of Ibrahim for Hajj</h2>
<p>After the Ka'bah was built, Allah commanded Ibrahim to call all people to Hajj. Ibrahim asked: "O Allah, how will my voice reach distant lands?" Allah replied: "You call — We will deliver it." Ibrahim stood and called out, and Allah carried that call to every human soul. This is why people come to Makkah in Hajj to this day.</p>
`.trim();

  const unit9 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-tarikh-ismail-kabah' } },
    create: {
      slug: 'maktab-3-tarikh-ismail-kabah',
      courseId: course.id,
      orderIndex: 9,
      title: "Tarikh — Prophet Ismail & the Ka'bah",
      description: "Hajar and Ismail in the desert of Makkah, the miracle of ZamZam, the building of the Ka'bah by Ibrahim and Ismail, and the call to Hajj.",
      content: unit9Content,
    },
    update: {
      title: "Tarikh — Prophet Ismail & the Ka'bah",
      description: "Hajar and Ismail in the desert of Makkah, the miracle of ZamZam, the building of the Ka'bah by Ibrahim and Ismail, and the call to Hajj.",
      content: unit9Content,
    },
  });
  console.log('✅ Unit 9:', unit9.title);

  // ══════════════════════════════════════════════
  // UNIT 10: AQAID — Prophets & Messengers
  // ══════════════════════════════════════════════

  const unit10Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the difference between a nabi and a rasul, name the five Ulu al-'Azm prophets, and list the five qualities all prophets must have.</p>

<h2>Difference Between Nabi and Rasul</h2>
<p>Allah sent many prophets to guide humanity:</p>
<ul>
  <li>A <strong>Nabi</strong> is a prophet who received revelation (wahy) from Allah to follow and convey the message of the prophet before him.</li>
  <li>A <strong>Rasul</strong> (Messenger) is a prophet who was given a new divine book or a new set of laws to deliver to his people.</li>
  <li>All rusul (pl. of rasul) are anbiya' (pl. of nabi), but not all anbiya' are rusul.</li>
</ul>
<p>Scholars mention that there were approximately <strong>124,000 prophets</strong> (anbiya') and <strong>315 messengers</strong> (rusul). It is obligatory to believe in all of them, though we only know the names of a few.</p>

<h2>The Five Ulu al-'Azm — Prophets of Great Resolve</h2>
<p>The five most determined and highest-ranking messengers are:</p>
<ol>
  <li>Muhammad</li>
  <li>Ibrahim alayhi al-salam</li>
  <li>Musa alayhi al-salam</li>
  <li>'Isa alayhi al-salam</li>
  <li>Nuh alayhi al-salam</li>
</ol>

<h2>Five Essential Qualities of All Prophets</h2>
<p>Every prophet of Allah must possess these five qualities:</p>
<ol>
  <li><strong>Sidq (Truthfulness):</strong> They always speak the truth. They never lie.</li>
  <li><strong>Amanah (Trustworthiness):</strong> They are perfectly honest and reliable.</li>
  <li><strong>Tabligh (Conveying the Message):</strong> They conveyed Allah's message completely without hiding anything.</li>
  <li><strong>Fatanah (Intelligence):</strong> They are wise and intelligent — able to answer any question and guide their people.</li>
  <li><strong>'Ismah (Protection from Sin):</strong> Allah protected prophets from committing major sins, especially after prophethood.</li>
</ol>

<h2>Why We Believe in All Prophets</h2>
<p>As Muslims, it is a pillar of Iman to believe in all prophets. The Quran says: "The Messenger believes in what has been revealed to him from his Lord, and so do the believers. Each one believes in Allah, His angels, His books, and His messengers. We make no distinction between any of His messengers." (Quran 2:285)</p>
`.trim();

  const unit10 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-aqaid-prophets' } },
    create: {
      slug: 'maktab-3-aqaid-prophets',
      courseId: course.id,
      orderIndex: 10,
      title: "Aqa'id — Prophets & Messengers",
      description: "The difference between a nabi and a rasul, the five Ulu al-'Azm prophets, and the five essential qualities all prophets must possess.",
      content: unit10Content,
    },
    update: {
      title: "Aqa'id — Prophets & Messengers",
      description: "The difference between a nabi and a rasul, the five Ulu al-'Azm prophets, and the five essential qualities all prophets must possess.",
      content: unit10Content,
    },
  });
  console.log('✅ Unit 10:', unit10.title);

  // ══════════════════════════════════════════════
  // UNIT 11: AQAID — Signs of the Last Day
  // ══════════════════════════════════════════════

  const unit11Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the difference between minor and major signs of the Last Day, name the main major signs, and understand why Allah has told us about them.</p>

<h2>Belief in the Last Day (Yawm al-Qiyamah)</h2>
<p>One of the six pillars of Iman is to believe in the Last Day — the Day when everything will come to an end and all people will be resurrected and judged by Allah. Before this Day comes, there will be signs (amarat).</p>

<h2>Minor Signs (Ashrat al-Sa'ah al-Sughra)</h2>
<p>Many minor signs have already occurred or are occurring now:</p>
<ul>
  <li>The spread of ignorance and loss of Islamic knowledge.</li>
  <li>The increase in immorality, lying, and injustice.</li>
  <li>An increase in the frequency of earthquakes.</li>
  <li>Tall buildings competing with each other.</li>
  <li>Singing and music becoming widespread.</li>
  <li>People stopping to greet each other unless they know one another.</li>
</ul>

<h2>Major Signs (Ashrat al-Sa'ah al-Kubra)</h2>
<p>The major signs have not yet occurred. They will happen close to the Day of Judgement:</p>
<ul>
  <li><strong>Al-Dajjal:</strong> The False Messiah — a great liar who will claim to be a god and misguide many people.</li>
  <li><strong>Ya'juj and Ma'juj:</strong> Two fierce nations that will be released to cause destruction on earth.</li>
  <li><strong>Descent of 'Isa alayhi al-salam:</strong> Prophet 'Isa will descend from the heavens and kill al-Dajjal.</li>
  <li><strong>The Sun Rising from the West:</strong> The sun will rise from the west as a sign that the time for repentance has ended.</li>
  <li><strong>The Beast (Dabbah):</strong> A creature that will emerge and speak to people.</li>
  <li><strong>A Great Smoke (Dukhan):</strong> A thick smoke that will cover the earth.</li>
</ul>

<h2>Why Allah Tells Us About These Signs</h2>
<p>Allah informs us about the signs of the Last Day so that:</p>
<ul>
  <li>We are not deceived by false claims, especially those of al-Dajjal.</li>
  <li>We are motivated to prepare for the Akhirah through good deeds.</li>
  <li>We recognize the truth of Islam and the Prophet's prophecies when they come true.</li>
</ul>
`.trim();

  const unit11 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-aqaid-last-day' } },
    create: {
      slug: 'maktab-3-aqaid-last-day',
      courseId: course.id,
      orderIndex: 11,
      title: "Aqa'id — Signs of the Last Day",
      description: "Minor and major signs of the Day of Judgement, including al-Dajjal, Ya'juj and Ma'juj, the descent of 'Isa, and why Allah informs us of these signs.",
      content: unit11Content,
    },
    update: {
      title: "Aqa'id — Signs of the Last Day",
      description: "Minor and major signs of the Day of Judgement, including al-Dajjal, Ya'juj and Ma'juj, the descent of 'Isa, and why Allah informs us of these signs.",
      content: unit11Content,
    },
  });
  console.log('✅ Unit 11:', unit11.title);

  // ══════════════════════════════════════════════
  // UNIT 12: AKHLAQ — Kindness to Parents
  // ══════════════════════════════════════════════

  const unit12Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the Quranic commands to honour parents, understand why the mother's right is greater, and learn the du'a' for parents.</p>

<h2>The Command to Honour Parents</h2>
<p>Allah places the command to respect and obey parents immediately after the command to worship Him alone:</p>
<blockquote>"Your Lord has commanded that you worship none but Him, and that you be kind to parents. If one or both of them reach old age with you, do not say even 'uff' to them, nor scold them, but speak to them in a respectful way." (Quran 17:23)</blockquote>
<p>This shows how important it is to honour parents in Islam. Even the smallest expression of annoyance — just saying "uff" — is forbidden!</p>

<h2>The Special Right of the Mother</h2>
<p>A man came to the Prophet and asked: "O Messenger of Allah, who deserves my kindness the most?" The Prophet replied: "Your mother." The man asked again: "Then who?" He replied: "Your mother." The man asked again: "Then who?" He replied: "Your mother." The man asked a fourth time: "Then who?" He replied: "Your father." (Bukhari &amp; Muslim)</p>
<p>The mother deserves three times more kindness because she carried the child, gave birth, and nursed him/her.</p>

<h2>Du'a' for Parents</h2>
<p>Allah teaches us to make this du'a' for our parents:</p>
<blockquote>"My Lord, have mercy on them both as they raised me when I was small." (Quran 17:24) — <em>Rabbir hamhuma kama rabbayani saghira</em></blockquote>
<p>Recite this du'a' for your parents every day — especially after every salah.</p>

<h2>What Pleases and Upsets Allah</h2>
<p>The Prophet said: "The pleasure of Allah lies in the pleasure of the parents, and the anger of Allah lies in the anger of the parents." (Tirmidhi)</p>

<h2>Practical Ways to Honour Parents</h2>
<ul>
  <li>Speak respectfully and never raise your voice at them.</li>
  <li>Help at home without being asked.</li>
  <li>Never disobey them in matters that are permissible in Islam.</li>
  <li>Make du'a' for them regularly.</li>
  <li>After their death: continue to make du'a', give sadaqah on their behalf, and keep their friends and ties of kinship.</li>
</ul>
`.trim();

  const unit12 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-akhlaq-parents' } },
    create: {
      slug: 'maktab-3-akhlaq-parents',
      courseId: course.id,
      orderIndex: 12,
      title: "Akhlaq — Kindness to Parents",
      description: "Quranic commands to honour parents, the triple right of the mother, the du'a' for parents, and practical ways to show respect.",
      content: unit12Content,
    },
    update: {
      title: "Akhlaq — Kindness to Parents",
      description: "Quranic commands to honour parents, the triple right of the mother, the du'a' for parents, and practical ways to show respect.",
      content: unit12Content,
    },
  });
  console.log('✅ Unit 12:', unit12.title);

  // ══════════════════════════════════════════════
  // UNIT 13: AKHLAQ — Sharing & Truthfulness
  // ══════════════════════════════════════════════

  const unit13Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the hadith about the best person being one who benefits others, understand why lying is prohibited, and describe the principle "say good or stay silent."</p>

<h2>Generosity — Sharing with Others</h2>
<p>The Prophet said:</p>
<blockquote>"The best of people is the one who benefits people the most." (al-Mu'jam al-Awsat)</blockquote>
<p>Being the best person does not mean being the richest, most popular, or most talented. It means being the most <em>useful</em> to others. This includes:</p>
<ul>
  <li>Sharing food with someone who is hungry.</li>
  <li>Giving time to help a friend or neighbour.</li>
  <li>Spending wealth in the path of Allah (sadaqah, zakah).</li>
  <li>Sharing knowledge you have with others.</li>
  <li>Offering a smile, a kind word, or removing something harmful from the road.</li>
</ul>

<h2>Truthfulness (Sidq)</h2>
<p>Allah says in the Quran: "O you who believe! Fear Allah and be with the truthful." (9:119)</p>
<p>The Prophet was known as <em>al-Amin</em> (the Trustworthy) and <em>al-Sadiq</em> (the Truthful) even before prophethood. He said:</p>
<blockquote>"Truthfulness leads to righteousness, and righteousness leads to Jannah. A person keeps speaking the truth until he is written with Allah as a siddiq (a great truthful person). And lying leads to wickedness, and wickedness leads to Hellfire." (Bukhari &amp; Muslim)</blockquote>

<h2>Avoiding Lies</h2>
<p>Lying is a major sin in Islam. Even small lies weaken trust and lead to bigger wrongs. Some common types of lies to avoid:</p>
<ul>
  <li>Lying to get out of trouble.</li>
  <li>Exaggerating to impress others.</li>
  <li>Making up excuses.</li>
  <li>"White lies" — even small lies can become habits.</li>
</ul>

<h2>Say Good or Stay Silent</h2>
<p>The Prophet said:</p>
<blockquote>"Whoever believes in Allah and the Last Day, let him speak good or remain silent." (Bukhari &amp; Muslim)</blockquote>
<p>Before speaking, ask yourself: Is this true? Is this kind? Is this necessary? If not — stay silent. This simple rule prevents most of the harms that come from speech.</p>
`.trim();

  const unit13 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-akhlaq-sharing-truth' } },
    create: {
      slug: 'maktab-3-akhlaq-sharing-truth',
      courseId: course.id,
      orderIndex: 13,
      title: "Akhlaq — Sharing & Truthfulness",
      description: "Generosity and sharing, the hadith on the best person being one who benefits others, the importance of truthfulness (sidq), and the principle of speaking good or staying silent.",
      content: unit13Content,
    },
    update: {
      title: "Akhlaq — Sharing & Truthfulness",
      description: "Generosity and sharing, the hadith on the best person being one who benefits others, the importance of truthfulness (sidq), and the principle of speaking good or staying silent.",
      content: unit13Content,
    },
  });
  console.log('✅ Unit 13:', unit13.title);

  // ══════════════════════════════════════════════
  // UNIT 14: ADAB — Quran & Masjid
  // ══════════════════════════════════════════════

  const unit14Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe the proper etiquette for handling and reciting the Quran, and explain the correct manners for entering and leaving the masjid.</p>

<h2>Adab of the Quran</h2>
<h3>Handling the Quran</h3>
<ul>
  <li>Be in a state of <strong>wudu'</strong> when touching or holding the Quran — this is obligatory according to the majority of scholars.</li>
  <li>Hold the Quran with <strong>both hands or the right hand</strong>, not carelessly under the arm.</li>
  <li>Never place the Quran on the floor or point your feet towards it.</li>
  <li>Keep the Quran in a high, clean, and respectful place.</li>
  <li>Do not write in or deface the Quran.</li>
</ul>

<h3>Reciting the Quran</h3>
<ul>
  <li>Begin with <strong>Ta'awwudh:</strong> "A'udhu billahi min al-Shaytan al-rajim" (I seek refuge with Allah from the accursed Shaytan).</li>
  <li>Then say <strong>Bismillah al-Rahman al-Rahim.</strong></li>
  <li>Recite clearly, beautifully, and with understanding.</li>
  <li>Do not recite in a rush or carelessly.</li>
  <li>Make du'a' when you come across verses of mercy or punishment.</li>
</ul>

<h2>Adab of the Masjid</h2>
<h3>Entering the Masjid</h3>
<ul>
  <li>Enter with the <strong>right foot first</strong>.</li>
  <li>Say the du'a' for entering: <em>"Allahumma aftah li abwaba rahmatik"</em> (O Allah, open for me the doors of Your mercy).</li>
  <li>Pray <strong>Tahiyyat al-Masjid</strong> (two raka'at of greeting the masjid) before sitting.</li>
  <li>Be quiet and respectful — the masjid is Allah's house.</li>
</ul>

<h3>Inside the Masjid</h3>
<ul>
  <li>Do not speak about worldly affairs, play around, or raise your voice.</li>
  <li>Keep the masjid clean — do not eat or drink except in designated areas.</li>
  <li>Engage in dhikr, salah, Quran, or Islamic learning.</li>
</ul>

<h3>Leaving the Masjid</h3>
<ul>
  <li>Leave with the <strong>left foot first</strong>.</li>
  <li>Say the du'a' for leaving: <em>"Allahumma inni as'aluka min fadlik"</em> (O Allah, I ask You of Your bounty).</li>
</ul>
`.trim();

  const unit14 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-adab-quran-masjid' } },
    create: {
      slug: 'maktab-3-adab-quran-masjid',
      courseId: course.id,
      orderIndex: 14,
      title: "Adab — Quran & Masjid",
      description: "Etiquette of handling and reciting the Quran, and the correct manners for entering, behaving inside, and leaving the masjid.",
      content: unit14Content,
    },
    update: {
      title: "Adab — Quran & Masjid",
      description: "Etiquette of handling and reciting the Quran, and the correct manners for entering, behaving inside, and leaving the masjid.",
      content: unit14Content,
    },
  });
  console.log('✅ Unit 14:', unit14.title);

  // ══════════════════════════════════════════════
  // UNIT 15: ADAB — Travelling
  // ══════════════════════════════════════════════

  const unit15Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to recite the du'a' for beginning a journey, explain the salah ruling for travellers, and describe the sunnah on returning from a journey.</p>

<h2>Du'a' Before Leaving on a Journey</h2>
<p>When boarding a vehicle or beginning a journey, recite:</p>
<blockquote><em>Bismillah, tawakkaltu 'alAllah, wa la hawla wa la quwwata illa billah.</em><br>"In the name of Allah; I have placed my trust in Allah; there is no power or strength except with Allah." (Abu Dawud, Tirmidhi)</blockquote>
<p>Also, when the vehicle begins to move, say: <em>Subhana-lladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina la-munqalibun.</em></p>

<h2>Saying Goodbye</h2>
<ul>
  <li>It is sunnah to ask family and friends for du'a' before travelling.</li>
  <li>Give the traveller this du'a': <em>"Astawdi'ukallaha dinaka wa amanataka wa khawatima 'amalak"</em> — "I entrust to Allah your din, your trust, and the seal of your deeds."</li>
</ul>

<h2>Qasr — Shortening Salah While Travelling</h2>
<p>When travelling a distance of approximately <strong>77-78 km or more</strong> (the legal travel distance), it is <strong>wajib</strong> in the Hanafi school to shorten the four-raka'at prayers to two:</p>
<ul>
  <li>Zuhr: 4 raka'at to 2 raka'at</li>
  <li>'Asr: 4 raka'at to 2 raka'at</li>
  <li>'Isha': 4 raka'at to 2 raka'at</li>
  <li>Fajr (2 raka'at) and Maghrib (3 raka'at) remain unchanged.</li>
</ul>
<p>This mercy from Allah is called <strong>Qasr</strong>. The Prophet said: "This is a sadaqah that Allah has given you — accept His sadaqah."</p>

<h2>Sunnah on Returning</h2>
<ul>
  <li>When close to home, say the du'a': <em>Ayibuna ta'ibuna 'abiduna, li-Rabbina hamidun</em> — "We return, repenting, worshipping, and praising our Lord."</li>
  <li>The sunnah is to go to the <strong>masjid first</strong> after returning from a journey — pray two raka'at before going home.</li>
  <li>Greet your family with salam and share the joy of being back.</li>
</ul>
`.trim();

  const unit15 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-adab-travel' } },
    create: {
      slug: 'maktab-3-adab-travel',
      courseId: course.id,
      orderIndex: 15,
      title: "Adab — Travelling",
      description: "Du'a' before a journey, saying goodbye, shortening salah when travelling (qasr), and the sunnah practice when returning home.",
      content: unit15Content,
    },
    update: {
      title: "Adab — Travelling",
      description: "Du'a' before a journey, saying goodbye, shortening salah when travelling (qasr), and the sunnah practice when returning home.",
      content: unit15Content,
    },
  });
  console.log('✅ Unit 15:', unit15.title);

  // ══════════════════════════════════════════════
  // UNIT 16: ADAB — Studying & Walking
  // ══════════════════════════════════════════════

  const unit16Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe the correct etiquette with a teacher, recite the du'a' for increase in knowledge, and explain the Islamic rules for walking.</p>

<h2>Etiquette with Teachers (Adab al-Ta'allum)</h2>
<p>Seeking knowledge is an obligation in Islam. The Prophet said: "Seeking knowledge is an obligation upon every Muslim." (Ibn Majah) Respect for teachers is essential:</p>
<ul>
  <li><strong>Sit properly</strong> — sit attentively and respectfully in front of the teacher, not slouching or turning away.</li>
  <li><strong>Listen carefully</strong> — do not talk or distract others when the teacher is speaking.</li>
  <li><strong>Do not interrupt</strong> — wait until the teacher finishes before asking a question.</li>
  <li><strong>Ask respectfully</strong> — raise your hand and say "Excuse me" or "May I ask?"</li>
  <li><strong>Act on what you learn</strong> — knowledge that is not acted upon is not complete.</li>
  <li><strong>Greet your teacher</strong> with salam when you arrive and when you leave.</li>
</ul>

<h2>Du'a' for Increase in Knowledge</h2>
<p>Allah commands the Prophet in the Quran:</p>
<blockquote><em>Wa qul Rabbi zidni 'ilma.</em><br>"And say: My Lord, increase me in knowledge." (Quran 20:114)</blockquote>
<p>Recite this du'a' before studying, before entering a classroom or madrasah, and whenever you want Allah's help in learning.</p>

<h2>Walking Etiquette</h2>
<p>Allah describes the servants of the Merciful: "They are those who walk humbly upon the earth." (Quran 25:63)</p>
<ul>
  <li><strong>Do not walk arrogantly</strong> — do not strut or swagger with pride. Allah does not love the arrogant.</li>
  <li><strong>Walk with purpose and modesty</strong> — a calm, dignified pace is the sunnah.</li>
  <li><strong>Do not walk in front of someone performing salah</strong> — this is a serious matter. The Prophet said it is better to wait 40 years than to pass in front of a praying person. If there is no sutrah (barrier), try to go around.</li>
  <li><strong>Give salam to people you pass</strong> — the Prophet always greeted people first.</li>
  <li><strong>Keep to the right side</strong> of the path when walking.</li>
</ul>
`.trim();

  const unit16 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-3-adab-study-walk' } },
    create: {
      slug: 'maktab-3-adab-study-walk',
      courseId: course.id,
      orderIndex: 16,
      title: "Adab — Studying & Walking",
      description: "Etiquette with teachers, the du'a' for increase in knowledge (Rabbi zidni 'ilma), and the Islamic rules and manners for walking.",
      content: unit16Content,
    },
    update: {
      title: "Adab — Studying & Walking",
      description: "Etiquette with teachers, the du'a' for increase in knowledge (Rabbi zidni 'ilma), and the Islamic rules and manners for walking.",
      content: unit16Content,
    },
  });
  console.log('✅ Unit 16:', unit16.title);

  // ══════════════════════════════════════════════
  // QUIZ DATA — 6-8 questions per unit
  // ══════════════════════════════════════════════

  const quizData: Array<{
    unitId: string;
    externalId: string;
    type: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }> = [
    // ── Unit 1: Taharah & Najasah ──
    { unitId: unit1.id, externalId: 'maktab-3-tahara-q1', type: 'MULTIPLE_CHOICE',
      questionText: 'What are the two types of taharah in Islam?',
      options: ["Haqiqi and Ma'nawi", 'Ghalizah and Khafifah', 'Fard and Sunnah', 'Zahir and Batin'],
      correctAnswer: "Haqiqi and Ma'nawi",
      explanation: "Taharah Haqiqi is physical purity (removing dirt), while Taharah Ma'nawi is spiritual purity (purifying the heart from pride and jealousy)." },
    { unitId: unit1.id, externalId: 'maktab-3-tahara-q2', type: 'MULTIPLE_CHOICE',
      questionText: 'Which is an example of Najasah Ghalizah (heavy impurity)?',
      options: ['Urine of a goat', 'Droppings of a crow', 'Human urine', 'Sweat'],
      correctAnswer: 'Human urine',
      explanation: 'Human urine is Najasah Ghalizah. Urine of animals whose meat is permissible (like a goat) is Najasah Khafifah (light impurity).' },
    { unitId: unit1.id, externalId: 'maktab-3-tahara-q3', type: 'MULTIPLE_CHOICE',
      questionText: 'If heavy impurity covers more than a dirham on clothing, what happens to salah performed in those clothes?',
      options: ['It is valid but disliked', 'It is not valid', 'It is perfectly fine', 'It requires prostration of forgetfulness'],
      correctAnswer: 'It is not valid',
      explanation: 'If Najasah Ghalizah covers more than a dirham, salah is not valid and must be repeated after cleaning.' },
    { unitId: unit1.id, externalId: 'maktab-3-tahara-q4', type: 'TRUE_FALSE',
      questionText: 'Najasah Khafifah (light impurity) only affects salah if it covers more than a quarter of the garment or body part.',
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: 'Correct. Light impurity only invalidates salah when it covers more than a quarter of the affected garment or body part.' },
    { unitId: unit1.id, externalId: 'maktab-3-tahara-q5', type: 'MULTIPLE_CHOICE',
      questionText: 'How do you purify the ground if najasah falls on it?',
      options: ['Wipe it with a cloth', 'Pour water over it', 'Leave it to dry', 'Dig it up'],
      correctAnswer: 'Pour water over it',
      explanation: 'If najasah falls on the ground, pouring water over it is sufficient to purify it.' },
    { unitId: unit1.id, externalId: 'maktab-3-tahara-q6', type: 'FILL_BLANK',
      questionText: 'The Prophet said: "Purity is half of ___."',
      options: ['faith', 'prayer', 'knowledge', 'worship'], correctAnswer: 'faith',
      explanation: 'The full hadith is: "Purity is half of faith (Iman)." (Muslim)' },
    { unitId: unit1.id, externalId: 'maktab-3-tahara-q7', type: 'MULTIPLE_CHOICE',
      questionText: 'Which of the following is Najasah Khafifah (light impurity)?',
      options: ['Wine (alcohol)', 'Blood that flows', 'Urine of a camel', 'Human stool'],
      correctAnswer: 'Urine of a camel',
      explanation: 'Urine of animals whose meat is permissible (camel, cow, sheep) is Najasah Khafifah. Wine, flowing blood, and human stool are Najasah Ghalizah.' },

    // ── Unit 2: Ghusl ──
    { unitId: unit2.id, externalId: 'maktab-3-ghusl-q1', type: 'MULTIPLE_CHOICE',
      questionText: "How many fara'id (obligatory acts) does ghusl have?",
      options: ['Two', 'Three', 'Four', 'Five'], correctAnswer: 'Three',
      explanation: "Ghusl has three fara'id: (1) rinsing the mouth, (2) rinsing the nose, (3) washing the entire body." },
    { unitId: unit2.id, externalId: 'maktab-3-ghusl-q2', type: 'MULTIPLE_CHOICE',
      questionText: "Which of the following is a fard (obligatory) act of ghusl?",
      options: ['Washing both hands first', "Performing wudu' before ghusl", 'Rinsing the nose with water', 'Using soap'],
      correctAnswer: 'Rinsing the nose with water',
      explanation: "One of the three fara'id of ghusl is rinsing the nose (istinshaq). Washing hands and using soap are sunnah, not fard." },
    { unitId: unit2.id, externalId: 'maktab-3-ghusl-q3', type: 'TRUE_FALSE',
      questionText: 'Ghusl is obligatory after hayd (monthly period) ends.',
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "When hayd ends, ghusl is fard (obligatory). A woman cannot pray or fast without ghusl after her period ends." },
    { unitId: unit2.id, externalId: 'maktab-3-ghusl-q4', type: 'MULTIPLE_CHOICE',
      questionText: 'In the sunnah method of ghusl, when should you wash your feet?',
      options: ['At the beginning', 'After washing the right side', 'At the very end, after moving to a clean spot', 'Before washing the head'],
      correctAnswer: 'At the very end, after moving to a clean spot',
      explanation: 'In the sunnah method of ghusl, the feet are washed at the very end after moving to a clean spot.' },
    { unitId: unit2.id, externalId: 'maktab-3-ghusl-q5', type: 'MULTIPLE_CHOICE',
      questionText: "What is the ghusl of Jumu'ah (Friday)?",
      options: ["Fard (obligatory)", "Sunnah mu'akkadah (confirmed sunnah)", 'Mustahabb (recommended)', 'Wajib'],
      correctAnswer: "Sunnah mu'akkadah (confirmed sunnah)",
      explanation: "Performing ghusl before Jumu'ah salah on Friday is a sunnah mu'akkadah. The Prophet strongly encouraged it." },
    { unitId: unit2.id, externalId: 'maktab-3-ghusl-q6', type: 'FILL_BLANK',
      questionText: 'The giving of ghusl to a deceased Muslim is ___ al-kifayah.',
      options: ['fard', 'sunnah', 'wajib', 'mustahabb'], correctAnswer: 'fard',
      explanation: 'Giving ghusl to a deceased Muslim is fard al-kifayah — a communal obligation.' },
    { unitId: unit2.id, externalId: 'maktab-3-ghusl-q7', type: 'MULTIPLE_CHOICE',
      questionText: "If someone performs ghusl but forgets to rinse their mouth, is the ghusl complete?",
      options: ['Yes, the mouth is optional', "No, rinsing the mouth is a fard of ghusl", 'Yes, but it is disliked', 'It depends on why they forgot'],
      correctAnswer: "No, rinsing the mouth is a fard of ghusl",
      explanation: "Rinsing the mouth (madmadah) is one of the three fara'id of ghusl. If missed, the ghusl is incomplete." },

    // ── Unit 3: Salah ──
    { unitId: unit3.id, externalId: 'maktab-3-salah-q1', type: 'MULTIPLE_CHOICE',
      questionText: "How many fara'id (obligatory acts) does salah have within the prayer itself?",
      options: ['Five', 'Six', 'Seven', 'Eight'], correctAnswer: 'Seven',
      explanation: "Salah has seven internal fara'id: Takbir al-Tahrimah, Qiyam, Qira'ah, Ruku', Sajdah, Qa'dah al-Akhirah, and ending with salam." },
    { unitId: unit3.id, externalId: 'maktab-3-salah-q2', type: 'MULTIPLE_CHOICE',
      questionText: "How many fard raka'at does Maghrib prayer have?",
      options: ['Two', 'Three', 'Four', 'Five'], correctAnswer: 'Three',
      explanation: "Maghrib prayer has 3 fard raka'at. It is the only fard prayer with an odd number besides Fajr (2)." },
    { unitId: unit3.id, externalId: 'maktab-3-salah-q3', type: 'TRUE_FALSE',
      questionText: 'Facing the Qiblah is a prerequisite (shart) of salah that must be fulfilled before the prayer begins.',
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Facing the Qiblah (direction of the Ka'bah in Makkah) is one of the prerequisites of salah. Without it, salah is not valid." },
    { unitId: unit3.id, externalId: 'maktab-3-salah-q4', type: 'MULTIPLE_CHOICE',
      questionText: 'What is Takbir al-Tahrimah?',
      options: ['The final salam', 'The opening "Allahu Akbar" that begins salah', 'The bowing position', "The recitation of al-Fatihah"],
      correctAnswer: 'The opening "Allahu Akbar" that begins salah',
      explanation: 'Takbir al-Tahrimah is saying "Allahu Akbar" to begin salah. It makes certain things haram (forbidden) such as eating and speaking.' },
    { unitId: unit3.id, externalId: 'maktab-3-salah-q5', type: 'MULTIPLE_CHOICE',
      questionText: "How many total fard raka'at are prayed in Fajr and 'Asr combined?",
      options: ['Four', 'Six', 'Eight', 'Ten'], correctAnswer: 'Six',
      explanation: "Fajr has 2 fard raka'at and 'Asr has 4. Together: 2 + 4 = 6 raka'at." },
    { unitId: unit3.id, externalId: 'maktab-3-salah-q6', type: 'FILL_BLANK',
      questionText: "The final sitting in salah where at-Tashahhud is recited is called Qa'dah al-___.",
      options: ["Akhirah", "Ula", "Wusta", "Kamilah"], correctAnswer: "Akhirah",
      explanation: "The final sitting is Qa'dah al-Akhirah. It is a fard of salah — at-Tashahhud must be recited before ending with salam." },
    { unitId: unit3.id, externalId: 'maktab-3-salah-q7', type: 'TRUE_FALSE',
      questionText: "A person praying salah must have the intention (niyyah) in their heart — saying it aloud is not required.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Niyyah (intention) resides in the heart. While saying it aloud is permissible, it is not required. The heart's intention is what counts." },

    // ── Unit 4: Ahadith — Love, Mercy & Compassion ──
    { unitId: unit4.id, externalId: 'maktab-3-love-mercy-q1', type: 'MULTIPLE_CHOICE',
      questionText: 'Complete the hadith: "None of you truly believes until he loves for his brother what he loves for ___."',
      options: ['Allah', 'himself', 'his family', 'all Muslims'], correctAnswer: 'himself',
      explanation: '"None of you truly believes until he loves for his brother what he loves for himself." (Bukhari & Muslim)' },
    { unitId: unit4.id, externalId: 'maktab-3-love-mercy-q2', type: 'MULTIPLE_CHOICE',
      questionText: 'According to the hadith, what happens when you show mercy to those on earth?',
      options: ['You earn reward only on Judgement Day', 'Allah shows mercy to you', 'People will love you', 'You enter Jannah immediately'],
      correctAnswer: 'Allah shows mercy to you',
      explanation: '"Show mercy to those on earth, and the One in the heavens will show mercy to you." (Tirmidhi)' },
    { unitId: unit4.id, externalId: 'maktab-3-love-mercy-q3', type: 'TRUE_FALSE',
      questionText: 'According to the hadith, honouring guests is a sign of belief in Allah and the Last Day.',
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: '"Whoever believes in Allah and the Last Day, let him honour his guest." (Bukhari & Muslim) Generosity to guests is connected directly to Iman.' },
    { unitId: unit4.id, externalId: 'maktab-3-love-mercy-q4', type: 'MULTIPLE_CHOICE',
      questionText: 'What does "loving for your brother what you love for yourself" practically mean?',
      options: ['Only sharing food', 'Wanting happiness, wellbeing and blessings for your Muslim siblings', 'Only praying for them', "Giving them gifts on 'Id"],
      correctAnswer: 'Wanting happiness, wellbeing and blessings for your Muslim siblings',
      explanation: 'This hadith means genuinely wanting every good thing for your fellow Muslim — food, shelter, happiness, guidance — just as you want for yourself.' },
    { unitId: unit4.id, externalId: 'maktab-3-love-mercy-q5', type: 'MULTIPLE_CHOICE',
      questionText: 'Who is included in "showing mercy to those on earth"?',
      options: ['Only Muslims', 'Only children', 'All humans and even animals', 'Only the poor'],
      correctAnswer: 'All humans and even animals',
      explanation: "Scholars explain 'those on earth' includes all of Allah's creation — Muslims, non-Muslims, children, elderly, and even animals." },
    { unitId: unit4.id, externalId: 'maktab-3-love-mercy-q6', type: 'FILL_BLANK',
      questionText: 'The hadith "Show mercy to those on earth..." was narrated in ___.',
      options: ['Tirmidhi', 'Bukhari', 'Muslim', 'Ibn Majah'], correctAnswer: 'Tirmidhi',
      explanation: '"Show mercy to those on earth, and the One in the heavens will show mercy to you" is narrated in Tirmidhi.' },

    // ── Unit 5: Ahadith — This World, Modesty & Steadfastness ──
    { unitId: unit5.id, externalId: 'maktab-3-world-modesty-q1', type: 'MULTIPLE_CHOICE',
      questionText: 'In the hadith about this world, the Prophet compared himself to what kind of traveller?',
      options: ['A merchant resting at a market', 'A rider resting in the shade of a tree', 'A pilgrim walking to Makkah', 'A scholar sitting in a library'],
      correctAnswer: 'A rider resting in the shade of a tree',
      explanation: '"I am in this world like a rider who rests in the shade of a tree, then moves on and leaves it behind." — this dunya is a temporary resting place.' },
    { unitId: unit5.id, externalId: 'maktab-3-world-modesty-q2', type: 'TRUE_FALSE',
      questionText: "Haya' (modesty) is a branch of faith (Iman) according to the hadith.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "The Prophet said faith has seventy-odd branches, and haya' is among them. (Bukhari & Muslim)" },
    { unitId: unit5.id, externalId: 'maktab-3-world-modesty-q3', type: 'MULTIPLE_CHOICE',
      questionText: 'According to the hadith, what is the highest branch of faith?',
      options: ['Fasting in Ramadan', 'Saying La ilaha illallah', "Haya'", 'Performing salah'],
      correctAnswer: 'Saying La ilaha illallah',
      explanation: '"The highest branch is saying La ilaha illallah." (Bukhari & Muslim)' },
    { unitId: unit5.id, externalId: 'maktab-3-world-modesty-q4', type: 'MULTIPLE_CHOICE',
      questionText: 'What does the hadith about fitnah compare holding on to din to?',
      options: ['Climbing a mountain', 'Holding a burning coal', 'Swimming against a current', 'Running barefoot on gravel'],
      correctAnswer: 'Holding a burning coal',
      explanation: '"There will come a time when holding on to your din will be like holding a burning coal." (Tirmidhi)' },
    { unitId: unit5.id, externalId: 'maktab-3-world-modesty-q5', type: 'FILL_BLANK',
      questionText: 'Faith (Iman) has ___ branches according to the hadith.',
      options: ['seventy-odd', 'five', 'one hundred', 'forty'], correctAnswer: 'seventy-odd',
      explanation: "The hadith says faith has 'seventy-odd branches.' The key lesson is that faith has many levels." },
    { unitId: unit5.id, externalId: 'maktab-3-world-modesty-q6', type: 'TRUE_FALSE',
      questionText: "The Prophet said that haya' brings nothing but good.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: '"Haya\' does not bring anything except good." (Bukhari & Muslim)' },

    // ── Unit 6: Sirah — Persecution & Migration to Abyssinia ──
    { unitId: unit6.id, externalId: 'maktab-3-abyssinia-q1', type: 'MULTIPLE_CHOICE',
      questionText: 'Why did the early Muslims migrate to Abyssinia?',
      options: ['To trade goods', 'To escape persecution from Quraysh', 'To spread Islam there', 'Because they had no homes in Makkah'],
      correctAnswer: 'To escape persecution from Quraysh',
      explanation: 'Early Muslims were severely persecuted by the Quraysh. The Prophet advised them to migrate to Abyssinia, where the Christian king Najashi was known for his justice.' },
    { unitId: unit6.id, externalId: 'maktab-3-abyssinia-q2', type: 'MULTIPLE_CHOICE',
      questionText: "Who was the Najashi (Negus) of Abyssinia?",
      options: ["A Muslim king who converted later", 'A just Christian king who protected the Muslims', 'A pagan ruler who expelled the Muslims', 'A Roman governor'],
      correctAnswer: 'A just Christian king who protected the Muslims',
      explanation: 'Najashi Ashama was a just and fair Christian king. He listened to the Muslims recite from the Quran and gave them protection.' },
    { unitId: unit6.id, externalId: 'maktab-3-abyssinia-q3', type: 'MULTIPLE_CHOICE',
      questionText: 'When did the first migration to Abyssinia take place?',
      options: ['605 CE', '610 CE', '615 CE', '622 CE'],
      correctAnswer: '615 CE',
      explanation: 'The first migration to Abyssinia took place in 615 CE (the 5th year of Prophethood), when a group of about 15 Muslims left Makkah.' },
    { unitId: unit6.id, externalId: 'maktab-3-abyssinia-q4', type: 'TRUE_FALSE',
      questionText: "Sumayyah (may Allah be pleased with her) was the first martyr in Islam.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: 'Sumayyah bint Khayyat was killed by Abu Jahl and is considered the first martyr in Islamic history.' },
    { unitId: unit6.id, externalId: 'maktab-3-abyssinia-q5', type: 'MULTIPLE_CHOICE',
      questionText: 'What chapter of the Quran did Jafar ibn Abi Talib recite to the Najashi?',
      options: ["Surah al-Fatihah", "Surah Maryam", "Surah al-Baqarah", "Surah al-Ikhlas"],
      correctAnswer: "Surah Maryam",
      explanation: "Ja'far ibn Abi Talib recited Surah Maryam to the Najashi, which moved the king to tears and he granted the Muslims protection." },
    { unitId: unit6.id, externalId: 'maktab-3-abyssinia-q6', type: 'FILL_BLANK',
      questionText: "The Quraysh sent ___ and his companion to convince the Najashi to return the Muslims.",
      options: ["Amr ibn al-As", "Abu Sufyan", "Abu Jahl", "Khalid ibn al-Walid"],
      correctAnswer: "Amr ibn al-As",
      explanation: "The Quraysh sent Amr ibn al-As (before his conversion to Islam) and Abdullah ibn Abi Rabia to negotiate with the Najashi, but they failed." },
    { unitId: unit6.id, externalId: 'maktab-3-abyssinia-q7', type: 'MULTIPLE_CHOICE',
      questionText: 'Who was Bilal ibn Rabah and what did Umayyah ibn Khalaf do to him?',
      options: ['A free man who was imprisoned', 'An enslaved man made to lie on hot sand in the sun', 'A merchant whose goods were seized', 'A young boy kept from his family'],
      correctAnswer: 'An enslaved man made to lie on hot sand in the sun',
      explanation: "Bilal was an enslaved man whose master Umayyah ibn Khalaf tortured him by placing heavy rocks on his chest in the desert sun. Abu Bakr (ra) eventually purchased and freed him." },

    // ── Unit 7: Sirah — Year of Sorrow & al-Isra' wal-Mi'raj ──
    { unitId: unit7.id, externalId: 'maktab-3-isra-miraj-q1', type: 'MULTIPLE_CHOICE',
      questionText: "Why is the 10th year of Prophethood called the 'Year of Sorrow'?",
      options: ['Many Muslims were killed in battle', "Khadijah and Abu Talib both passed away", 'The Prophet was expelled from Makkah', 'A great drought struck Makkah'],
      correctAnswer: "Khadijah and Abu Talib both passed away",
      explanation: "In the 10th year of Prophethood, the Prophet's beloved wife Khadijah (ra) and his uncle Abu Talib both passed away, leaving the Prophet deeply grieved." },
    { unitId: unit7.id, externalId: 'maktab-3-isra-miraj-q2', type: 'MULTIPLE_CHOICE',
      questionText: "What is al-Isra'?",
      options: ["The ascent through the heavens", 'The night journey from Makkah to Masjid al-Aqsa', 'The journey to Abyssinia', 'The Hijrah to Madinah'],
      correctAnswer: 'The night journey from Makkah to Masjid al-Aqsa',
      explanation: "Al-Isra' is the miraculous night journey of the Prophet from Masjid al-Haram in Makkah to Masjid al-Aqsa in Jerusalem, riding on the Buraq." },
    { unitId: unit7.id, externalId: 'maktab-3-isra-miraj-q3', type: 'MULTIPLE_CHOICE',
      questionText: "What great gift did Allah grant the Prophet during al-Mi'raj?",
      options: ['The Quran', 'The five daily prayers', 'The ability to perform miracles', 'The date of Judgement Day'],
      correctAnswer: 'The five daily prayers',
      explanation: "During al-Mi'raj, Allah gifted the Ummah the five daily prayers. Originally 50 prayers were commanded, reduced to 5 through the intercession of Prophet Musa (as)." },
    { unitId: unit7.id, externalId: 'maktab-3-isra-miraj-q4', type: 'MULTIPLE_CHOICE',
      questionText: 'What is the Buraq?',
      options: ['A type of Angel', 'A heavenly animal the Prophet rode during al-Isra', 'The trumpet blown on Judgement Day', 'A star the Prophet saw in the sky'],
      correctAnswer: "A heavenly animal the Prophet rode during al-Isra",
      explanation: "Buraq is a white heavenly creature, larger than a donkey and smaller than a mule, that transported the Prophet from Makkah to Jerusalem during al-Isra'." },
    { unitId: unit7.id, externalId: 'maktab-3-isra-miraj-q5', type: 'TRUE_FALSE',
      questionText: "During al-Mi'raj, the Prophet met and led salah of all the previous prophets in Masjid al-Aqsa.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "The Prophet led all the gathered prophets in salah in Masjid al-Aqsa, showing his position as the Seal and leader of all prophets." },
    { unitId: unit7.id, externalId: 'maktab-3-isra-miraj-q6', type: 'FILL_BLANK',
      questionText: "Al-Isra' wal-Mi'raj is mentioned in Surah ___ at the beginning of the chapter.",
      options: ["al-Isra'", "al-Baqarah", "al-Kahf", "al-Najm"],
      correctAnswer: "al-Isra'",
      explanation: "Surah al-Isra' (Chapter 17) begins with the verse about the night journey: 'Glory be to He who took His servant by night...'" },
    { unitId: unit7.id, externalId: 'maktab-3-isra-miraj-q7', type: 'MULTIPLE_CHOICE',
      questionText: "Which prophet did the Prophet meet in the sixth heaven during al-Mi'raj?",
      options: ["Prophet Idris (as)", "Prophet Musa (as)", "Prophet Ibrahim (as)", "Prophet Isa (as)"],
      correctAnswer: "Prophet Musa (as)",
      explanation: "Prophet Musa (as) was met in the sixth heaven. It was Musa who advised the Prophet to keep going back to Allah to reduce the prayers from 50." },

    // ── Unit 8: Tarikh — Prophet Ibrahim (as) ──
    { unitId: unit8.id, externalId: 'maktab-3-ibrahim-q1', type: 'MULTIPLE_CHOICE',
      questionText: 'What did Ibrahim (as) call his people to worship instead of idols?',
      options: ['The sun and moon', 'Only Allah', 'Fire', 'His ancestors'],
      correctAnswer: 'Only Allah',
      explanation: 'Ibrahim (as) called his people to worship Allah alone and reject the idols they carved themselves.' },
    { unitId: unit8.id, externalId: 'maktab-3-ibrahim-q2', type: 'MULTIPLE_CHOICE',
      questionText: "What happened when Ibrahim (as) was thrown into the fire?",
      options: ['He was badly burned', 'He flew over the fire', 'Allah made the fire cool and safe for him', 'The fire went out immediately'],
      correctAnswer: 'Allah made the fire cool and safe for him',
      explanation: 'Allah commanded: "O fire! Be coolness and safety for Ibrahim." (Quran 21:69) — Ibrahim (as) emerged completely unharmed.' },
    { unitId: unit8.id, externalId: 'maktab-3-ibrahim-q3', type: 'MULTIPLE_CHOICE',
      questionText: "Where was Ibrahim (as) born?",
      options: ['Makkah', 'Jerusalem', 'Iraq (Mesopotamia)', 'Egypt'],
      correctAnswer: 'Iraq (Mesopotamia)',
      explanation: 'Ibrahim (as) was born in the ancient city of Ur in Iraq (ancient Mesopotamia), in the time of King Nimrod.' },
    { unitId: unit8.id, externalId: 'maktab-3-ibrahim-q4', type: 'TRUE_FALSE',
      questionText: "Ibrahim's father Azar was a maker and seller of idols.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Ibrahim's father (Azar/Terah) made and sold idols. Despite this, Ibrahim (as) invited him to stop worshipping idols and turn to Allah." },
    { unitId: unit8.id, externalId: 'maktab-3-ibrahim-q5', type: 'MULTIPLE_CHOICE',
      questionText: "What was the great test Allah gave Ibrahim (as) regarding his son?",
      options: ['To leave his son in the desert alone', 'To sacrifice his son in the way of Allah', 'To send his son to study', "To name his son after a prophet"],
      correctAnswer: 'To sacrifice his son in the way of Allah',
      explanation: "Allah tested Ibrahim (as) by commanding him to sacrifice his son. Both submitted, but Allah replaced the son with a ram at the moment of sacrifice." },
    { unitId: unit8.id, externalId: 'maktab-3-ibrahim-q6', type: 'FILL_BLANK',
      questionText: "Ibrahim (as) is given the title 'Khalilullah' which means the ___ of Allah.",
      options: ['Friend', 'Prophet', 'Servant', 'Messenger'],
      correctAnswer: 'Friend',
      explanation: "'Khalilullah' means 'the Friend of Allah' — Ibrahim (as) is honoured with this special title due to his complete submission and devotion." },
    { unitId: unit8.id, externalId: 'maktab-3-ibrahim-q7', type: 'MULTIPLE_CHOICE',
      questionText: "To which land did Ibrahim (as) migrate after leaving his people?",
      options: ['Egypt', 'Yemen', 'Canaan (the Holy Land)', 'Abyssinia'],
      correctAnswer: 'Canaan (the Holy Land)',
      explanation: 'Ibrahim (as) migrated with his wife Sarah to Canaan (present-day Palestine/Israel), the blessed holy land.' },

    // ── Unit 9: Tarikh — Prophet Ismail (as) & the Ka'bah ──
    { unitId: unit9.id, externalId: 'maktab-3-ismail-q1', type: 'MULTIPLE_CHOICE',
      questionText: "How did the Zamzam well appear in the desert?",
      options: ['Ibrahim (as) dug it', "Hajar ran between Safa and Marwah and Allah caused it to spring up", 'A tribe found it while digging', 'It was always there'],
      correctAnswer: "Hajar ran between Safa and Marwah and Allah caused it to spring up",
      explanation: "Hajar ran between Safa and Marwah seven times searching for water for her baby Ismail (as). Allah caused the Zamzam spring to burst forth — a miracle still flowing today." },
    { unitId: unit9.id, externalId: 'maktab-3-ismail-q2', type: 'MULTIPLE_CHOICE',
      questionText: "Who built the Ka'bah?",
      options: ["Ismail (as) alone", "Ibrahim and Ismail (as) together", "Ibrahim (as) alone", "The angels"],
      correctAnswer: "Ibrahim and Ismail (as) together",
      explanation: "Allah commanded Ibrahim (as) to build the Ka'bah. Ibrahim laid the stones while Ismail (as) helped carry them. They prayed together as they built." },
    { unitId: unit9.id, externalId: 'maktab-3-ismail-q3', type: 'MULTIPLE_CHOICE',
      questionText: "What is the special stone built into the corner of the Ka'bah?",
      options: ['Al-Maqam', 'Al-Hajar al-Aswad (the Black Stone)', 'Zamzam Rock', 'Hijr Ismail'],
      correctAnswer: 'Al-Hajar al-Aswad (the Black Stone)',
      explanation: "Al-Hajar al-Aswad (the Black Stone) is set into the Ka'bah's eastern corner. It was a stone from Paradise given to Ibrahim (as) by Angel Jibril." },
    { unitId: unit9.id, externalId: 'maktab-3-ismail-q4', type: 'TRUE_FALSE',
      questionText: "Hajar's running between Safa and Marwah is commemorated in the Hajj ritual called Sa'i.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Sa'i — walking/running between the hills of Safa and Marwah seven times — is a compulsory act of Hajj and Umrah, commemorating Hajar's search for water." },
    { unitId: unit9.id, externalId: 'maktab-3-ismail-q5', type: 'MULTIPLE_CHOICE',
      questionText: "What did Ibrahim (as) pray for after building the Ka'bah?",
      options: ["For riches and a large kingdom", "That Makkah be a city of peace and its people be fed fruits, and that a messenger from among them be raised", "For rain to come to the desert", "That his son become a king"],
      correctAnswer: "That Makkah be a city of peace and its people be fed fruits, and that a messenger from among them be raised",
      explanation: "Ibrahim (as) made the dua: 'My Lord, make this a city of peace and provide its people with fruits...' (2:126) and prayed for a messenger from among them." },
    { unitId: unit9.id, externalId: 'maktab-3-ismail-q6', type: 'FILL_BLANK',
      questionText: "The tribe that settled near the Zamzam well after Hajar's miracle was the tribe of ___.",
      options: ['Jurhum', 'Quraysh', 'Thaqif', 'Aws'],
      correctAnswer: 'Jurhum',
      explanation: "The tribe of Jurhum, who were passing through, saw birds circling overhead (a sign of water) and came to settle near the Zamzam spring." },
    { unitId: unit9.id, externalId: 'maktab-3-ismail-q7', type: 'MULTIPLE_CHOICE',
      questionText: "Where did Ibrahim (as) leave Hajar and baby Ismail?",
      options: ['In Jerusalem', 'In Iraq near his homeland', 'In the valley of Makkah — a barren desert', 'In the town of Taif'],
      correctAnswer: 'In the valley of Makkah — a barren desert',
      explanation: "By Allah's command, Ibrahim (as) left Hajar and infant Ismail in the barren, uninhabited valley that would become the sacred city of Makkah." },

    // ── Unit 10: Aqa'id — Prophets & Messengers ──
    { unitId: unit10.id, externalId: 'maktab-3-prophets-q1', type: 'MULTIPLE_CHOICE',
      questionText: "What is the difference between a Nabi and a Rasul?",
      options: ['There is no difference', 'A Nabi received revelation while a Rasul was sent with a new scripture/message to a people', 'A Rasul is higher than a Nabi', 'A Nabi performed miracles but a Rasul did not'],
      correctAnswer: 'A Nabi received revelation while a Rasul was sent with a new scripture/message to a people',
      explanation: "A Nabi is someone who received divine revelation, while a Rasul (Messenger) is specifically sent with a divine book or message to a new people. All Rusul are also Anbiya', but not all Anbiya' are Rusul." },
    { unitId: unit10.id, externalId: 'maktab-3-prophets-q2', type: 'MULTIPLE_CHOICE',
      questionText: "What are the Ulu al-Azm prophets?",
      options: ['The 5 prophets of greatest resolve and perseverance', 'The last 4 prophets only', 'Prophets who performed miracles', 'All 124,000 prophets'],
      correctAnswer: 'The 5 prophets of greatest resolve and perseverance',
      explanation: "Ulu al-Azm ('possessors of strong will') are the five greatest prophets: Muhammad (saw), Ibrahim, Musa, Isa, and Nuh (peace be upon them all)." },
    { unitId: unit10.id, externalId: 'maktab-3-prophets-q3', type: 'MULTIPLE_CHOICE',
      questionText: "Which quality of prophets means they are protected from sins?",
      options: ["Sidq (truthfulness)", "'Ismah (divine protection from sin)", "Amanah (trustworthiness)", "Fatanah (intelligence)"],
      correctAnswer: "'Ismah (divine protection from sin)",
      explanation: "'Ismah means Allah protects the prophets from sinning. This ensures their message is trustworthy and uncorrupted." },
    { unitId: unit10.id, externalId: 'maktab-3-prophets-q4', type: 'TRUE_FALSE',
      questionText: "It is obligatory for Muslims to believe in all of Allah's prophets.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Belief in all of Allah's prophets is a pillar of Iman. We must believe in all of them, even those whose names are not mentioned in the Quran." },
    { unitId: unit10.id, externalId: 'maktab-3-prophets-q5', type: 'FILL_BLANK',
      questionText: "Prophets conveying Allah's message to people is the quality called ___.",
      options: ['Tabligh', 'Sidq', 'Amanah', 'Fatanah'],
      correctAnswer: 'Tabligh',
      explanation: "'Tabligh' means conveying — prophets must deliver Allah's message completely without hiding any of it." },
    { unitId: unit10.id, externalId: 'maktab-3-prophets-q6', type: 'MULTIPLE_CHOICE',
      questionText: "Approximately how many Prophets (Anbiya') came according to scholarly estimates?",
      options: ['25', '124,000', '313', '100'],
      correctAnswer: '124,000',
      explanation: "According to hadith narrated by Abu Dharr (ra), approximately 124,000 prophets were sent to humanity." },
    { unitId: unit10.id, externalId: 'maktab-3-prophets-q7', type: 'MULTIPLE_CHOICE',
      questionText: "Which prophet is known as 'Kaliimullah' (one who spoke directly with Allah)?",
      options: ['Ibrahim (as)', 'Isa (as)', 'Musa (as)', 'Nuh (as)'],
      correctAnswer: 'Musa (as)',
      explanation: "Musa (as) is given the title 'Kaliimullah' because Allah spoke to him directly without intermediary." },

    // ── Unit 11: Aqa'id — Signs of the Last Day ──
    { unitId: unit11.id, externalId: 'maktab-3-lastday-q1', type: 'MULTIPLE_CHOICE',
      questionText: "Which of the following is a Major Sign of the Last Day?",
      options: ['Increase in earthquakes', 'The appearance of Dajjal', 'Loss of religious knowledge', 'Widespread lying'],
      correctAnswer: 'The appearance of Dajjal',
      explanation: "Dajjal is one of the Major Signs. Minor signs include earthquakes, loss of knowledge, and moral decline — these happen gradually before the Major Signs." },
    { unitId: unit11.id, externalId: 'maktab-3-lastday-q2', type: 'MULTIPLE_CHOICE',
      questionText: "What is Dajjal?",
      options: ['A great earthquake', 'A false messiah who will deceive people near the end of time', 'A tribe that will invade', 'An angel of punishment'],
      correctAnswer: 'A false messiah who will deceive people near the end of time',
      explanation: "Dajjal (the Antichrist/Deceiver) is a one-eyed man who will claim to be a prophet and even God. He will perform miracles and mislead many people." },
    { unitId: unit11.id, externalId: 'maktab-3-lastday-q3', type: 'TRUE_FALSE',
      questionText: "Ya'juj and Ma'juj (Gog and Magog) are among the Major Signs of the Last Day.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Ya'juj and Ma'juj are mentioned in the Quran (18:98) and hadith as one of the Major Signs. They will break free and cause great corruption." },
    { unitId: unit11.id, externalId: 'maktab-3-lastday-q4', type: 'MULTIPLE_CHOICE',
      questionText: "Which prophet will descend from the sky near the end of time?",
      options: ["Ibrahim (as)", "Idris (as)", "Isa (as)", "Nuh (as)"],
      correctAnswer: "Isa (as)",
      explanation: "Prophet Isa (Jesus, peace be upon him) will descend from the sky near Damascus, defeat Dajjal, and lead the believers." },
    { unitId: unit11.id, externalId: 'maktab-3-lastday-q5', type: 'FILL_BLANK',
      questionText: "One major sign is that the sun will rise from the ___ instead of the east.",
      options: ['west', 'north', 'south', 'ground'],
      correctAnswer: 'west',
      explanation: "The rising of the sun from the west is one of the Major Signs. After this, the door of repentance closes." },
    { unitId: unit11.id, externalId: 'maktab-3-lastday-q6', type: 'MULTIPLE_CHOICE',
      questionText: "Why is it important for Muslims to know about the Signs of the Last Day?",
      options: ['To predict exactly when it will happen', 'To be prepared, stay firm in faith, and not be deceived', 'To fear every day', 'To convince non-believers'],
      correctAnswer: 'To be prepared, stay firm in faith, and not be deceived',
      explanation: "Knowing the signs helps believers stay firm in faith, recognise trials, and not be deceived by false claims (like Dajjal's miracles)." },
    { unitId: unit11.id, externalId: 'maktab-3-lastday-q7', type: 'MULTIPLE_CHOICE',
      questionText: "Which of the following is a Minor Sign of the Last Day?",
      options: ["Isa (as) descending from the sky", "The sun rising from the west", "Widespread earthquakes and natural disasters", "Ya'juj and Ma'juj being released"],
      correctAnswer: "Widespread earthquakes and natural disasters",
      explanation: "Increased earthquakes are among the Minor Signs that occur before the Major Signs. Isa's descent, the sun from the west, and Ya'juj Ma'juj are Major Signs." },

    // ── Unit 12: Akhlaq — Kindness to Parents ──
    { unitId: unit12.id, externalId: 'maktab-3-parents-q1', type: 'MULTIPLE_CHOICE',
      questionText: "In Surah al-Isra' (Bani Isra'il), after commanding worship of Allah alone, what does Allah command next?",
      options: ['To pray five times a day', 'To be kind to parents', 'To fast in Ramadan', 'To give zakah'],
      correctAnswer: 'To be kind to parents',
      explanation: "Allah says: 'Your Lord has decreed that you worship none but Him, and that you are kind to parents.' (17:23) — honouring parents comes right after worshipping Allah." },
    { unitId: unit12.id, externalId: 'maktab-3-parents-q2', type: 'MULTIPLE_CHOICE',
      questionText: "According to the Quran, what must children NOT say to their parents?",
      options: ["Ask them questions", "Say 'Uff' (even a slight expression of annoyance)", "Disagree with them on any matter", "Speak before them"],
      correctAnswer: "Say 'Uff' (even a slight expression of annoyance)",
      explanation: "Allah commands: 'Do not even say Uff to them.' (17:23) — even the smallest expression of displeasure is forbidden." },
    { unitId: unit12.id, externalId: 'maktab-3-parents-q3', type: 'MULTIPLE_CHOICE',
      questionText: "According to the hadith, who has the greatest right over you?",
      options: ['Your father', 'Your mother', 'Your teacher', 'Allah alone'],
      correctAnswer: 'Your mother',
      explanation: "A man asked the Prophet: 'Who deserves most of my good company?' He replied: 'Your mother' three times before saying 'Your father' the fourth time." },
    { unitId: unit12.id, externalId: 'maktab-3-parents-q4', type: 'TRUE_FALSE',
      questionText: "Making dua for your parents is an act of worship that continues to benefit them even after they pass away.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "The Prophet said: 'When a person dies, all deeds end except three — sadaqah jariyah, beneficial knowledge, and a righteous child who makes dua for them.'" },
    { unitId: unit12.id, externalId: 'maktab-3-parents-q5', type: 'FILL_BLANK',
      questionText: "The Quranic dua for parents is: 'Rabbir hamhuma kama rabbayani ___.'",
      options: ['saghira', 'kabira', 'muslima', 'karima'],
      correctAnswer: 'saghira',
      explanation: "'Rabbir hamhuma kama rabbayani saghira' means 'My Lord, have mercy on them both as they raised me when I was small.' (17:24)" },
    { unitId: unit12.id, externalId: 'maktab-3-parents-q6', type: 'MULTIPLE_CHOICE',
      questionText: "What should a child do when their parents ask them to stop doing something permissible?",
      options: ['Always ignore them — only Allah commands', 'Listen and obey (unless it is clearly sinful)', 'Do it anyway but apologise after', 'Ask for a reason first, then decide'],
      correctAnswer: 'Listen and obey (unless it is clearly sinful)',
      explanation: "Islam teaches obedience to parents in all permissible matters. The exception is if they command actual sin (like lying or shirk)." },

    // ── Unit 13: Akhlaq — Sharing & Truthfulness ──
    { unitId: unit13.id, externalId: 'maktab-3-sharing-q1', type: 'MULTIPLE_CHOICE',
      questionText: "Complete the hadith: 'The best of you are those who ___ others.'",
      options: ['pray more than', 'benefit', 'correct', 'impress'],
      correctAnswer: 'benefit',
      explanation: "'The best of you are those who benefit others.' — encouraging Muslims to be of service and generosity to others." },
    { unitId: unit13.id, externalId: 'maktab-3-sharing-q2', type: 'TRUE_FALSE',
      questionText: "According to the hadith, a lie leads to another lie until a person is recorded as a liar with Allah.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "'Truthfulness leads to righteousness... and lying leads to wickedness... until a person is recorded as a liar with Allah.' (Bukhari & Muslim)" },
    { unitId: unit13.id, externalId: 'maktab-3-sharing-q3', type: 'MULTIPLE_CHOICE',
      questionText: "What does the Islamic principle 'Say good or remain silent' mean in practice?",
      options: ['Never speak unless spoken to', 'Before speaking, consider: is this true, is it kind, is it necessary?', 'Speak only about religious topics', 'Silence is always better than speaking'],
      correctAnswer: 'Before speaking, consider: is this true, is it kind, is it necessary?',
      explanation: "'Whoever believes in Allah and the Last Day, let him say good or remain silent.' (Bukhari & Muslim) — every word should be meaningful, truthful and beneficial." },
    { unitId: unit13.id, externalId: 'maktab-3-sharing-q4', type: 'MULTIPLE_CHOICE',
      questionText: "Which of the following is an example of generosity mentioned in Islamic teachings?",
      options: ['Hoarding food for emergencies', 'Sharing food with a hungry neighbour', 'Spending only when it benefits you', 'Giving gifts only to family'],
      correctAnswer: 'Sharing food with a hungry neighbour',
      explanation: "The Prophet said no Muslim should sleep full while their neighbour is hungry. Sharing food, time, and help is a core Islamic value." },
    { unitId: unit13.id, externalId: 'maktab-3-sharing-q5', type: 'FILL_BLANK',
      questionText: "The Prophet said: 'Truthfulness leads to righteousness, and righteousness leads to ___.'",
      options: ['Jannah', 'wealth', 'knowledge', 'health'],
      correctAnswer: 'Jannah',
      explanation: "'Truthfulness leads to righteousness, and righteousness leads to Jannah.' — the path from truth to Paradise." },
    { unitId: unit13.id, externalId: 'maktab-3-sharing-q6', type: 'TRUE_FALSE',
      questionText: "In Islam, generosity (karam) applies only to sharing material things like food and money.",
      options: ['True', 'False'], correctAnswer: 'False',
      explanation: "Islamic generosity includes time, attention, smiling, giving advice, making dua for others, and sharing knowledge — not just material possessions." },
    { unitId: unit13.id, externalId: 'maktab-3-sharing-q7', type: 'MULTIPLE_CHOICE',
      questionText: "Why is lying prohibited in Islam?",
      options: ['Because it looks bad in front of others', 'Because it destroys trust and leads to sin, and the liar is recorded as a liar with Allah', 'Because it upsets people', 'Because honest people earn more money'],
      correctAnswer: 'Because it destroys trust and leads to sin, and the liar is recorded as a liar with Allah',
      explanation: "Lying destroys trust, leads to more sin, and spiritually harms the liar. The hadith warns that lying leads to wickedness and eventually the person becomes a confirmed liar." },

    // ── Unit 14: Adab — Quran & Masjid ──
    { unitId: unit14.id, externalId: 'maktab-3-quranmasjid-q1', type: 'MULTIPLE_CHOICE',
      questionText: "Do you need wudu' to touch the physical Quran?",
      options: ["No, it is just a book", "Yes, it is required according to the majority of scholars", "Only for adults", "Only if you are reading from it"],
      correctAnswer: "Yes, it is required according to the majority of scholars",
      explanation: "The majority of scholars hold that wudu' is required to touch the physical mushaf (Quran). The verse 'None shall touch it but the purified' (56:79) supports this." },
    { unitId: unit14.id, externalId: 'maktab-3-quranmasjid-q2', type: 'TRUE_FALSE',
      questionText: "When entering the masjid, you should enter with your right foot first.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "The Sunnah is to enter the masjid with the right foot, saying the dua: 'Allahumma ftah li abwaba rahmatik.'" },
    { unitId: unit14.id, externalId: 'maktab-3-quranmasjid-q3', type: 'MULTIPLE_CHOICE',
      questionText: "Before starting to recite the Quran, what should you say first?",
      options: ["Bismillah only", "A'udhu billahi min al-shaytan al-rajim (ta'awwudh), then Bismillah", "Alhamdulillah", "La hawla wa la quwwata illa billah"],
      correctAnswer: "A'udhu billahi min al-shaytan al-rajim (ta'awwudh), then Bismillah",
      explanation: "The Quran commands: 'When you recite the Quran, seek refuge with Allah from Shaytan.' (16:98) — ta'awwudh comes before Bismillah." },
    { unitId: unit14.id, externalId: 'maktab-3-quranmasjid-q4', type: 'MULTIPLE_CHOICE',
      questionText: "When leaving the masjid, which foot goes first?",
      options: ['Right foot', 'Left foot', 'Either foot — no sunnah for leaving', 'The foot nearest to the door'],
      correctAnswer: 'Left foot',
      explanation: "The sunnah when leaving the masjid is to step out with the left foot first, while reciting the leaving dua." },
    { unitId: unit14.id, externalId: 'maktab-3-quranmasjid-q5', type: 'TRUE_FALSE',
      questionText: "It is disrespectful to place the Quran on the floor or point your feet toward it.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "The Quran must be treated with utmost respect. It should never be placed on the floor, and we should never point our feet in its direction." },
    { unitId: unit14.id, externalId: 'maktab-3-quranmasjid-q6', type: 'FILL_BLANK',
      questionText: "The dua when entering the masjid begins: 'Allahumma ftah li abwaba ___.'",
      options: ['rahmatik', 'barakatik', 'jannati', 'rizqik'],
      correctAnswer: 'rahmatik',
      explanation: "The full dua is: 'Allahumma ftah li abwaba rahmatik' — 'O Allah, open for me the gates of Your mercy.'" },

    // ── Unit 15: Adab — Travelling ──
    { unitId: unit15.id, externalId: 'maktab-3-travel-q1', type: 'MULTIPLE_CHOICE',
      questionText: "What is the dua said before beginning a journey?",
      options: ["Bismillah al-Rahman al-Rahim", "Subhanallad-hi sakh-khara lana hadha wa ma kunna lahu muqrinin", "La hawla wa la quwwata illa billah", "Allahumma barik lana"],
      correctAnswer: "Subhanallad-hi sakh-khara lana hadha wa ma kunna lahu muqrinin",
      explanation: "The dua al-safar begins: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin' — 'Glory to He who subjugated this for us...'" },
    { unitId: unit15.id, externalId: 'maktab-3-travel-q2', type: 'MULTIPLE_CHOICE',
      questionText: "When travelling, how many rak'at is Dhuhr, Asr and Isha' shortened to?",
      options: ['Four rak\'at each', 'Two rak\'at each', 'Three rak\'at each', 'One rak\'at each'],
      correctAnswer: 'Two rak\'at each',
      explanation: "During travel (qasr), prayers of 4 rak'at — Dhuhr, Asr, and Isha' — are shortened to 2 rak'at. Fajr (2) and Maghrib (3) remain unchanged." },
    { unitId: unit15.id, externalId: 'maktab-3-travel-q3', type: 'TRUE_FALSE',
      questionText: "According to the Sunnah, it is recommended to visit the masjid and pray upon returning from a journey.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Ka'b ibn Malik (ra) narrated that the Prophet, whenever he returned from a journey, would go to the masjid first and pray two rak'at of gratitude." },
    { unitId: unit15.id, externalId: 'maktab-3-travel-q4', type: 'MULTIPLE_CHOICE',
      questionText: "What should you do before leaving on a journey according to the Sunnah?",
      options: ['Just say Bismillah at the door', 'Say the dua of travel, say a proper farewell to family', 'Pray tahajjud the night before', 'Make ghusl'],
      correctAnswer: 'Say the dua of travel, say a proper farewell to family',
      explanation: "The Sunnah includes reciting the dua al-safar (travel dua) and properly saying goodbye to family and loved ones before departing." },
    { unitId: unit15.id, externalId: 'maktab-3-travel-q5', type: 'FILL_BLANK',
      questionText: "The shortening of prayers during travel is called ___.",
      options: ['Qasr', 'Jam', 'Tayammum', 'Rukhsah'],
      correctAnswer: 'Qasr',
      explanation: "Qasr means 'shortening' — a traveller shortens 4-rak'at prayers to 2. It is a mercy (rukhsah) from Allah for travellers." },
    { unitId: unit15.id, externalId: 'maktab-3-travel-q6', type: 'MULTIPLE_CHOICE',
      questionText: "What should you say when mounting a vehicle or riding animal to begin travel?",
      options: ['Allahu Akbar', 'Bismillah', 'Alhamdulillah', 'Subhanallah'],
      correctAnswer: 'Bismillah',
      explanation: "Say 'Bismillah' first when mounting, then recite the full dua al-safar: 'Subhanal-ladhi sakhkhara lana hadha...'" },

    // ── Unit 16: Adab — Studying & Walking ──
    { unitId: unit16.id, externalId: 'maktab-3-studywalk-q1', type: 'MULTIPLE_CHOICE',
      questionText: "What is the dua for increase in knowledge from the Quran?",
      options: ["Rabbi zidni 'ilma", "Rabbighfir li wa li walidayya", "Rabbi inni lima anzalta ilayya min khayrin faqir", "Rabbi la tadharni fardan"],
      correctAnswer: "Rabbi zidni 'ilma",
      explanation: "The Quranic dua is: 'Rabbi zidni 'ilma' — 'My Lord, increase me in knowledge.' (Surah Ta-Ha, 20:114)" },
    { unitId: unit16.id, externalId: 'maktab-3-studywalk-q2', type: 'MULTIPLE_CHOICE',
      questionText: "How should a student sit with their teacher?",
      options: ['Lying down comfortably', 'With respect and attentiveness, not interrupting', 'Doing other tasks to save time', 'Correcting the teacher if wrong'],
      correctAnswer: 'With respect and attentiveness, not interrupting',
      explanation: "Islamic etiquette with teachers includes sitting respectfully, listening attentively, not interrupting, not looking bored, and acting on the knowledge learned." },
    { unitId: unit16.id, externalId: 'maktab-3-studywalk-q3', type: 'TRUE_FALSE',
      questionText: "Walking arrogantly is mentioned in the Quran as something Allah dislikes.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "'Do not walk on the earth arrogantly, for you will never be able to split the earth nor reach the mountains in height.' (Quran 17:37)" },
    { unitId: unit16.id, externalId: 'maktab-3-studywalk-q4', type: 'MULTIPLE_CHOICE',
      questionText: "Why should you not walk between someone who is praying salah and their sutrah (prayer barrier)?",
      options: ['It is unhygienic', 'It interrupts their concentration and is a major sin in some opinions', 'It wakes them up', 'The imam will tell you off'],
      correctAnswer: 'It interrupts their concentration and is a major sin in some opinions',
      explanation: "The Prophet said: 'If the person walking in front of the one praying knew the weight of that sin, it would be better for him to wait 40 (days/months/years) than to pass in front.' (Bukhari & Muslim)" },
    { unitId: unit16.id, externalId: 'maktab-3-studywalk-q5', type: 'FILL_BLANK',
      questionText: "The Quran tells us to walk on earth with ___ (humility and gentleness).",
      options: ['humility', 'speed', 'confidence', 'silence'],
      correctAnswer: 'humility',
      explanation: "'The servants of the Most Merciful are those who walk on earth humbly...' (Quran 25:63) — a believer's walk reflects their character." },
    { unitId: unit16.id, externalId: 'maktab-3-studywalk-q6', type: 'MULTIPLE_CHOICE',
      questionText: "What does seeking knowledge (talab al-'ilm) lead to according to the hadith?",
      options: ['A path to wealth', 'A path to Jannah', 'A path to leadership', 'A path to fame'],
      correctAnswer: 'A path to Jannah',
      explanation: "'Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise.' (Muslim)" },
    { unitId: unit16.id, externalId: 'maktab-3-studywalk-q7', type: 'TRUE_FALSE',
      questionText: "According to the Sunnah, a student should act on knowledge learned, not just memorise it.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Knowledge without action is condemned in Islamic tradition. The Prophet warned against knowledge that does not benefit its possessor by changing their character and deeds." },
  ];

  // ══════════════════════════════════════════════
  // UPSERT QUIZ QUESTIONS
  // ══════════════════════════════════════════════

  for (const q of quizData) {
    await prisma.question.upsert({
      where: { externalId: q.externalId },
      create: {
        externalId: q.externalId,
        unitId: q.unitId,
        type: q.type as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK',
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
      update: {
        unitId: q.unitId,
        type: q.type as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK',
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
    });
  }

  console.log(`✅ Upserted ${quizData.length} quiz questions`);

  // ══════════════════════════════════════════════
  // FLASHCARDS (20-25 total)
  // ══════════════════════════════════════════════

  const flashcardData = [
    { unitId: unit1.id, front: 'Taharah', back: 'Purity — removing physical and spiritual impurities according to Islamic law' },
    { unitId: unit1.id, front: 'Najasah Ghalizah', back: 'Heavy impurity (e.g., human urine, blood, stool) — invalidates salah if more than a dirham' },
    { unitId: unit1.id, front: 'Najasah Khafifah', back: 'Light impurity (e.g., urine of halal animals) — only affects salah if it covers more than a quarter of the area' },
    { unitId: unit2.id, front: "Fara'id of Ghusl", back: 'Three obligatory acts of ghusl: (1) rinsing the mouth, (2) rinsing the nose, (3) washing the entire body' },
    { unitId: unit2.id, front: 'Janabah', back: 'Major ritual impurity requiring ghusl — occurs after marital relations or wet dream' },
    { unitId: unit3.id, front: 'Takbir al-Tahrimah', back: "The opening 'Allahu Akbar' that begins salah — a fard of salah" },
    { unitId: unit3.id, front: "Qa'dah al-Akhirah", back: 'The final sitting in salah where at-Tashahhud is recited — a fard of salah' },
    { unitId: unit4.id, front: 'Rahmah', back: "Mercy and compassion — a core attribute of Allah and a quality believers must show to all of Allah's creation" },
    { unitId: unit5.id, front: "Haya'", back: 'Modesty and bashfulness — a branch of faith (Iman); the Prophet said haya\' brings nothing but good' },
    { unitId: unit5.id, front: 'Dunya', back: 'This world — described in hadith as temporary like the shade of a tree; a place of passage, not destination' },
    { unitId: unit6.id, front: 'Hijrah', back: 'Migration in the way of Allah — the first hijrah was to Abyssinia (615 CE); the second was to Madinah (622 CE)' },
    { unitId: unit6.id, front: 'Najashi', back: "The just Christian King of Abyssinia (Ashama ibn Abjar) who gave protection to the early Muslim migrants" },
    { unitId: unit7.id, front: "Al-Isra'", back: 'The miraculous night journey of the Prophet from Masjid al-Haram (Makkah) to Masjid al-Aqsa (Jerusalem)' },
    { unitId: unit7.id, front: "Al-Mi'raj", back: 'The ascension of the Prophet through the seven heavens after al-Isra\' — where the five daily prayers were gifted' },
    { unitId: unit8.id, front: 'Khalilullah', back: "Friend of Allah — the special title of Prophet Ibrahim (as)" },
    { unitId: unit9.id, front: 'Zamzam', back: "The miraculous well in Makkah that appeared for Hajar and baby Ismail (as) — still flowing today" },
    { unitId: unit10.id, front: "Ulu al-Azm", back: "The five prophets of greatest resolve: Muhammad (saw), Ibrahim, Musa, Isa, and Nuh (peace be upon them all)" },
    { unitId: unit10.id, front: "'Ismah", back: "Divine protection of prophets from sin — ensures Allah's message is delivered without corruption" },
    { unitId: unit11.id, front: 'Dajjal', back: 'The false messiah (Antichrist) — a Major Sign of the Last Day; he will have one eye and claim to be divine' },
    { unitId: unit12.id, front: "Birr al-Walidayn", back: 'Dutifulness and kindness to parents — mentioned alongside worship of Allah alone in Surah al-Isra\'' },
    { unitId: unit13.id, front: 'Sidq', back: 'Truthfulness — a quality of prophets and believers; the hadith says it leads to righteousness then Jannah' },
    { unitId: unit14.id, front: "Ta'awwudh", back: "A'udhu billahi min al-shaytan al-rajim — seeking refuge with Allah from Shaytan before reciting the Quran" },
    { unitId: unit15.id, front: 'Qasr', back: "Shortening of salah during travel — 4-rak'at prayers (Dhuhr, 'Asr, Isha') become 2 rak'at" },
    { unitId: unit16.id, front: "Talab al-'Ilm", back: "Seeking knowledge — the Prophet said whoever treads this path, Allah makes easy for him a path to Jannah" },
  ];

  // Delete flashcards for this course, then recreate
  await prisma.flashCard.deleteMany({ where: { courseId: course.id } });

  const allUnitIds = [
    unit1.id, unit2.id, unit3.id, unit4.id, unit5.id, unit6.id, unit7.id, unit8.id,
    unit9.id, unit10.id, unit11.id, unit12.id, unit13.id, unit14.id, unit15.id, unit16.id,
  ];

  let flashCardIndex = 1;
  for (const card of flashcardData) {
    await prisma.flashCard.create({
      data: {
        courseId: course.id,
        unitId: card.unitId,
        front: card.front,
        back: card.back,
        category: 'Vocabulary',
        tags: ['maktab-3'],
        orderIndex: flashCardIndex++,
      },
    });
  }

  console.log(`✅ Created ${flashcardData.length} flashcards`);

  // ══════════════════════════════════════════════
  // ARABIC TERMS (12-18 total)
  // ══════════════════════════════════════════════

  const arabicTermsData = [
    { unitId: unit1.id, arabicText: 'طَهَارَة', transliteration: 'Taharah', translation: 'Purity — the state of physical and spiritual cleanliness required for acts of worship' },
    { unitId: unit1.id, arabicText: 'نَجَاسَة', transliteration: 'Najasah', translation: 'Impurity — substances that must be removed from body, clothing and place of prayer' },
    { unitId: unit2.id, arabicText: 'غُسْل', transliteration: 'Ghusl', translation: 'Full ritual bath — obligatory in certain circumstances (janabah, end of hayd/nifas, death)' },
    { unitId: unit3.id, arabicText: 'صَلَاة', transliteration: 'Salah', translation: 'Prayer — the second pillar of Islam, performed five times daily' },
    { unitId: unit3.id, arabicText: 'تَكْبِيرَةُ الإِحْرَام', transliteration: 'Takbirat al-Ihram', translation: "Opening Allahu Akbar of salah — the saying that makes the prayer binding" },
    { unitId: unit5.id, arabicText: 'حَيَاء', transliteration: "Haya'", translation: 'Modesty — a branch of faith; shyness and moral self-restraint that keeps a person from sin' },
    { unitId: unit6.id, arabicText: 'هِجْرَة', transliteration: 'Hijrah', translation: "Migration in the way of Allah — from Makkah to Abyssinia (615 CE) and later to Madinah (622 CE)" },
    { unitId: unit7.id, arabicText: 'الإِسْرَاء وَالمِعْرَاج', transliteration: "Al-Isra' wal-Mi'raj", translation: "The Night Journey (from Makkah to Jerusalem) and the Ascension (through the heavens)" },
    { unitId: unit8.id, arabicText: 'خَلِيلُ اللَّه', transliteration: 'Khalilullah', translation: 'The Friend of Allah — honourable title of Prophet Ibrahim (as)' },
    { unitId: unit9.id, arabicText: 'زَمْزَم', transliteration: 'Zamzam', translation: "Sacred well in Makkah that appeared miraculously for Hajar and Ismail (as)" },
    { unitId: unit10.id, arabicText: 'أُولُو العَزْم', transliteration: "Ulu al-'Azm", translation: "Prophets of greatest resolve — the five: Muhammad, Ibrahim, Musa, Isa, and Nuh (peace be upon them)" },
    { unitId: unit10.id, arabicText: 'عِصْمَة', transliteration: "'Ismah", translation: "Divine protection of prophets from sin — ensures the message of Allah reaches humanity uncorrupted" },
    { unitId: unit11.id, arabicText: 'الدَّجَّال', transliteration: 'al-Dajjal', translation: 'The False Messiah (Antichrist) — a Major Sign of the Last Day; will try to deceive the world' },
    { unitId: unit12.id, arabicText: 'بِرُّ الوَالِدَيْن', transliteration: 'Birr al-Walidayn', translation: "Kindness and dutifulness to parents — commanded by Allah right after worshipping Him alone" },
    { unitId: unit15.id, arabicText: 'قَصْر', transliteration: 'Qasr', translation: "Shortening of salah during travel — 4-rak'at prayers become 2; a mercy (rukhsah) from Allah" },
    { unitId: unit16.id, arabicText: 'طَلَبُ العِلْم', transliteration: "Talab al-'Ilm", translation: "Seeking knowledge — the Prophet said whoever walks this path, Allah eases a path to Jannah for them" },
  ];

  // Delete existing Arabic terms for each unit, then create new ones
  for (const unitId of allUnitIds) {
    await prisma.arabicTerm.deleteMany({ where: { unitId } });
  }

  for (const term of arabicTermsData) {
    await prisma.arabicTerm.create({
      data: {
        unitId: term.unitId,
        arabicText: term.arabicText,
        transliteration: term.transliteration,
        translation: term.translation,
      },
    });
  }

  console.log(`✅ Created ${arabicTermsData.length} Arabic terms`);

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('\n🎉 Maktab Coursebook 3 seed complete!');
  console.log(`   📚 Course: ${course.title}`);
  console.log('   📖 Units: 16');
  console.log(`   ❓ Questions: ${quizData.length}`);
  console.log(`   🃏 Flashcards: ${flashcardData.length}`);
  console.log(`   🔤 Arabic Terms: ${arabicTermsData.length}`);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedMaktabCoursebook3(prisma);
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
