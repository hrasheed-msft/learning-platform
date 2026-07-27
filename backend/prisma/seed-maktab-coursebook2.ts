import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 2 -- Islamic Curriculum Seed (Restructured)
 * Source: An Nasihah Publications, Age Range: 7-8 years
 *
 * 14 focused units -- each covering exactly ONE main topic.
 * Subjects: Fiqh (3), Ahadith (2), Sirah (2), Tarikh (2),
 *           Aqaid (2), Akhlaq (2), Adab (1)
 */

export async function seedMaktabCoursebook2() {
  console.log('📚 Starting Maktab Coursebook 2 seed...');
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
    where: { slug: 'maktab-coursebook-2' },
    create: {
      slug: 'maktab-coursebook-2',
      title: 'Maktab Coursebook 2',
      description: `A comprehensive Islamic curriculum for young learners aged 7–8 years. Covers the detailed rules of wuḍū' and ṣalāh, tayammum, key aḥādīth on truth and social conduct, the sīrah of Rasūlullāh ﷺ before prophethood and the first revelation, stories of Hūd and Ṣāliḥ ʿalayhim al-salām, articles of faith on angels and divine books, good character on promises and gratitude, and Islamic etiquette of greeting, speaking, sneezing and yawning. Based on the An Nasihah Publications coursebook series.`,
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 2',
      description: `A comprehensive Islamic curriculum for young learners aged 7–8 years. Covers the detailed rules of wuḍū' and ṣalāh, tayammum, key aḥādīth on truth and social conduct, the sīrah of Rasūlullāh ﷺ before prophethood and the first revelation, stories of Hūd and Ṣāliḥ ʿalayhim al-salām, articles of faith on angels and divine books, good character on promises and gratitude, and Islamic etiquette of greeting, speaking, sneezing and yawning. Based on the An Nasihah Publications coursebook series.`,
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // CLEANUP: Remove deprecated broad-subject units
  // (old 7-unit schema replaced by 14 focused units)
  // ──────────────────────────────────────────────
  const oldSlugs = ['maktab-2-fiqh','maktab-2-ahadith','maktab-2-sirah','maktab-2-tarikh','maktab-2-aqaid','maktab-2-akhlaq','maktab-2-adab'];
  for (const slug of oldSlugs) {
    const old = await prisma.unit.findFirst({ where: { courseId: course.id, slug } });
    if (old) {
      await prisma.question.deleteMany({ where: { unitId: old.id } });
      await prisma.unitProgress.deleteMany({ where: { unitId: old.id } });
      await prisma.unit.delete({ where: { id: old.id } });
    }
  }

  // ══════════════════════════════════════════════
  // UNIT 1: FIQH -- Farā'iḍ, Sunan & Nawāqiḍ of Wuḍū'
  // ══════════════════════════════════════════════

  const unit1Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to list the four farā'iḍ of wuḍū', identify the sunnah acts, name what breaks wuḍū' (nawāqiḍ), and avoid disliked acts.</p>

<h3>What Is Wuḍū'?</h3>
<p>Wuḍū' is washing certain parts of the body with water to prepare for ṣalāh. Without wuḍū', ṣalāh is <strong>not valid</strong>. Allāh loves those who keep themselves clean.</p>

<h3>The Four Farā'iḍ (Obligatory Acts) of Wuḍū'</h3>
<p>These four acts are <strong>compulsory</strong>. If any one of them is missed, wuḍū' is not valid:</p>
<ol>
  <li><strong>Washing the face</strong> — from the hairline to below the chin, and from earlobe to earlobe.</li>
  <li><strong>Washing both arms including the elbows</strong> — from the fingertips up to and including the elbows.</li>
  <li><strong>Wiping (masaḥ) of at least a quarter of the head</strong> — using wet hands.</li>
  <li><strong>Washing both feet including the ankles</strong> — water must reach between the toes.</li>
</ol>

<h3>Sunnah Acts of Wuḍū'</h3>
<p>These are acts the Prophet ﷺ performed regularly. Doing them brings extra reward from Allāh:</p>
<ul>
  <li>Saying <strong>Bismillāh</strong> at the beginning.</li>
  <li>Using the <strong>miswāk</strong> (tooth-cleaning stick).</li>
  <li>Washing both hands up to the wrists <strong>first</strong>.</li>
  <li>Starting from the <strong>right side</strong> — right arm before left, right foot before left.</li>
  <li>Washing each limb <strong>three times</strong>.</li>
  <li>Rinsing the mouth (maḍmaḍah) and sniffing water into the nose.</li>
</ul>

<h3>Nawāqiḍ — Things That Break Wuḍū'</h3>
<p>Once wuḍū' is made, the following things <strong>break (nullify)</strong> it:</p>
<ul>
  <li>Passing wind, urine, or stool.</li>
  <li>Bleeding from a wound where blood flows away from its point of exit.</li>
  <li>Vomiting a mouthful.</li>
  <li>Falling into a deep sleep while lying down or leaning on something.</li>
  <li>Losing consciousness (fainting).</li>
  <li>Laughing aloud during ṣalāh (for an adult).</li>
</ul>

<h3>Disliked Acts (Makrūhāt) in Wuḍū'</h3>
<p>These do not break wuḍū' but reduce its reward:</p>
<ul>
  <li>Wasting water by using too much.</li>
  <li>Talking about worldly matters during wuḍū'.</li>
  <li>Performing wuḍū' in a dirty place.</li>
</ul>
`.trim();

  const unit1 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-fiqh-wudu-detail' } },
    create: {
      slug: 'maktab-2-fiqh-wudu-detail',
      courseId: course.id,
      orderIndex: 1,
      title: `Fiqh — Farā'iḍ, Sunan & Nawāqiḍ of Wuḍū'`,
      description: `The four obligatory acts (farā'iḍ) of wuḍū', the recommended sunnah acts, the nawāqiḍ that break wuḍū', and disliked (makrūh) acts.`,
      content: unit1Content,
    },
    update: {
      title: `Fiqh — Farā'iḍ, Sunan & Nawāqiḍ of Wuḍū'`,
      description: `The four obligatory acts (farā'iḍ) of wuḍū', the recommended sunnah acts, the nawāqiḍ that break wuḍū', and disliked (makrūh) acts.`,
      content: unit1Content,
    },
  });
  console.log('✅ Unit 1:', unit1.title);

  // ══════════════════════════════════════════════
  // UNIT 2: FIQH -- Tayammum (Dry Ablution)
  // ══════════════════════════════════════════════

  const unit2Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain when tayammum is allowed, how to perform it correctly, and what breaks it.</p>

<h3>What Is Tayammum?</h3>
<p>Tayammum is a special type of dry purification using clean earth or dust. It is used instead of wuḍū' or ghusl when water is not available or cannot be used. Allāh says in the Qur'ān: <em>"...and if you are ill or on a journey or one of you comes from the place of relieving himself, or you have contacted women and do not find water, then seek clean earth and wipe over your faces and your hands."</em> (Sūrah al-Nisā' 4:43)</p>

<h3>When Is Tayammum Allowed?</h3>
<ul>
  <li>When there is <strong>no water</strong> available nearby.</li>
  <li>When a person is <strong>ill</strong> and using water would make the illness worse.</li>
  <li>When the weather is extremely cold and warm water is unavailable and using cold water would cause harm.</li>
  <li>When water is present but a person cannot reach it due to danger.</li>
</ul>

<h3>How to Perform Tayammum</h3>
<ol>
  <li>Make the <strong>intention (niyyah)</strong> for tayammum in the heart.</li>
  <li><strong>First strike:</strong> Strike both hands on clean earth, dust, sand, or stone. Blow off excess dust. Wipe the <strong>entire face</strong> once.</li>
  <li><strong>Second strike:</strong> Strike the hands again and wipe both arms up to and including the <strong>elbows</strong>.</li>
</ol>
<p>Tayammum replaces wuḍū' and even ghusl when necessary.</p>

<h3>What Breaks (Nullifies) Tayammum?</h3>
<p>Everything that breaks wuḍū' also breaks tayammum. In addition:</p>
<ul>
  <li>Tayammum is broken when <strong>water becomes available</strong> (if you had no water before).</li>
  <li>When the reason for tayammum (illness, danger, etc.) no longer applies.</li>
</ul>
`.trim();

  const unit2 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-fiqh-tayammum' } },
    create: {
      slug: 'maktab-2-fiqh-tayammum',
      courseId: course.id,
      orderIndex: 2,
      title: 'Fiqh — Tayammum (Dry Ablution)',
      description: `When tayammum (dry ablution) is permissible, how to perform it using clean earth, and what nullifies it.`,
      content: unit2Content,
    },
    update: {
      title: 'Fiqh — Tayammum (Dry Ablution)',
      description: `When tayammum (dry ablution) is permissible, how to perform it using clean earth, and what nullifies it.`,
      content: unit2Content,
    },
  });
  console.log('✅ Unit 2:', unit2.title);

  // ══════════════════════════════════════════════
  // UNIT 3: FIQH -- Introduction to Ṣalāh
  // ══════════════════════════════════════════════

  const unit3Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to name all five daily prayers, state the number of rak'āt for each, list the conditions of ṣalāh, and understand why ṣalāh is the most important act of worship.</p>

<h3>Ṣalāh — The Second Pillar of Islam</h3>
<p>Ṣalāh (prayer) is the <strong>second pillar of Islam</strong>. Allāh commanded us to pray five times every single day. It is the most important act of worship after the Shahādah.</p>
<p>The Prophet ﷺ said: <em>"Ṣalāh is the pillar (support) of the religion. Whoever establishes it has established the religion. Whoever destroys it has destroyed the religion."</em></p>

<h3>The Five Daily Prayers and Their Rak'āt</h3>
<table>
  <tr><th>Prayer</th><th>Time</th><th>Farḍ Rak'āt</th></tr>
  <tr><td><strong>Fajr</strong></td><td>Dawn — before sunrise</td><td>2</td></tr>
  <tr><td><strong>Ẓuhr</strong></td><td>Midday — after sun passes its peak</td><td>4</td></tr>
  <tr><td><strong>ʿAṣr</strong></td><td>Afternoon</td><td>4</td></tr>
  <tr><td><strong>Maghrib</strong></td><td>Just after sunset</td><td>3</td></tr>
  <tr><td><strong>ʿIshā'</strong></td><td>Night</td><td>4</td></tr>
</table>
<p>Total farḍ rak'āt per day: <strong>17 rak'āt</strong>.</p>

<h3>Conditions (Shuroot) of Ṣalāh</h3>
<p>Before starting ṣalāh, the following conditions must be fulfilled:</p>
<ol>
  <li><strong>Ṭahārah (ritual purity)</strong> — be in a state of wuḍū' (or ghusl if needed).</li>
  <li><strong>Awrah covered</strong> — the body must be properly covered.</li>
  <li><strong>Facing the Qiblah</strong> — face the direction of the Ka'bah in Makkah.</li>
  <li><strong>Intention (niyyah)</strong> — make the intention in your heart for the specific prayer.</li>
  <li><strong>Time</strong> — each prayer must be performed within its correct time.</li>
</ol>

<h3>Why Is Ṣalāh So Important?</h3>
<ul>
  <li>Ṣalāh was the first act directly commanded by Allāh to the Prophet ﷺ on the Night of Ascension (Isrā' wa Miʿrāj).</li>
  <li>Ṣalāh is the first thing we will be questioned about on the Day of Judgement.</li>
  <li>Ṣalāh keeps us connected to Allāh throughout the day.</li>
  <li>Neglecting ṣalāh is one of the most serious sins in Islam.</li>
</ul>
`.trim();

  const unit3 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-fiqh-salah-intro' } },
    create: {
      slug: 'maktab-2-fiqh-salah-intro',
      courseId: course.id,
      orderIndex: 3,
      title: `Fiqh — Introduction to Ṣalāh`,
      description: `The five daily prayers and their rak'āt count, conditions of ṣalāh, importance of ṣalāh as the second pillar of Islam.`,
      content: unit3Content,
    },
    update: {
      title: `Fiqh — Introduction to Ṣalāh`,
      description: `The five daily prayers and their rak'āt count, conditions of ṣalāh, importance of ṣalāh as the second pillar of Islam.`,
      content: unit3Content,
    },
  });
  console.log('✅ Unit 3:', unit3.title);

  // ══════════════════════════════════════════════
  // UNIT 4: AḤĀDĪTH -- Truth & Trustworthiness
  // ══════════════════════════════════════════════

  const unit4Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the ḥadīth on truth and lying, understand the consequences of each, and know why Rasūlullāh ﷺ was called "Al-Amīn."</p>

<h3>Ḥadīth 1: Truth Leads to Jannah</h3>
<p><strong>"Truthfulness leads to righteousness and righteousness leads to Jannah. A man keeps on telling the truth until he is recorded with Allāh as a truthful person (Ṣiddīq). Lying leads to wickedness and wickedness leads to the Fire. A man keeps on lying until he is recorded with Allāh as a great liar (Kadhdhāb)."</strong> (Bukhārī &amp; Muslim)</p>

<h3>Lessons from This Ḥadīth</h3>
<ul>
  <li>Speaking the truth → righteousness (birr) → Jannah ✅</li>
  <li>Telling lies → wickedness (fujūr) → Hellfire ❌</li>
  <li>Every time we tell the truth, we become more righteous.</li>
  <li>Every time we lie, we fall deeper into sin.</li>
  <li>A Muslim must <strong>always speak the truth</strong>, even when it is difficult.</li>
</ul>

<h3>Ḥadīth 2: Warning Against Lying</h3>
<p>The Prophet ﷺ warned us that lying is a characteristic of a hypocrite (munāfiq). Three signs of a hypocrite are: when he speaks, he lies; when he makes a promise, he breaks it; when he is trusted, he betrays the trust. (Bukhārī &amp; Muslim)</p>

<h3>Rasūlullāh ﷺ — Al-Amīn (The Trustworthy)</h3>
<p>Before receiving prophethood, the people of Makkah called Rasūlullāh ﷺ <strong>"Al-Amīn"</strong> — meaning <strong>"The Trustworthy One."</strong> He was also called <strong>"Al-Ṣādiq"</strong> — "The Truthful One."</p>
<ul>
  <li>Everyone in Makkah trusted him — they kept their valuables and secrets with him.</li>
  <li>He never lied — not even before prophethood.</li>
  <li>Being honest and trustworthy is one of the most important qualities of a Muslim.</li>
</ul>
<p>Even Rasūlullāh's ﷺ enemies admitted he never lied. Abū Sufyān told the Roman Emperor Heraclius: "He has never told a lie." This is a great honour — his enemies confirmed his truthfulness!</p>
`.trim();

  const unit4 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-ahadith-truth' } },
    create: {
      slug: 'maktab-2-ahadith-truth',
      courseId: course.id,
      orderIndex: 4,
      title: `Aḥādīth — Truth & Trustworthiness`,
      description: `Ḥadīth on speaking truth leading to Jannah and lying leading to Hellfire. Rasūlullāh's ﷺ title "Al-Amīn" (the Trustworthy) and lessons on honesty.`,
      content: unit4Content,
    },
    update: {
      title: `Aḥādīth — Truth & Trustworthiness`,
      description: `Ḥadīth on speaking truth leading to Jannah and lying leading to Hellfire. Rasūlullāh's ﷺ title "Al-Amīn" (the Trustworthy) and lessons on honesty.`,
      content: unit4Content,
    },
  });
  console.log('✅ Unit 4:', unit4.title);

  // ══════════════════════════════════════════════
  // UNIT 5: AḤĀDĪTH -- Social Conduct & Kindness
  // ══════════════════════════════════════════════

  const unit5Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to state the etiquette of spreading salām, explain using the right hand, drinking whilst sitting, the six rights of a Muslim over another, and showing kindness to animals.</p>

<h3>Spreading Salām</h3>
<p><strong>"The closest of people to Allāh is the one who initiates saying salām to others."</strong> (Abū Dāwūd)</p>
<ul>
  <li>Say salām <strong>before speaking</strong> — salām comes first!</li>
  <li>Give salām to <strong>everyone</strong> — people you know and those you do not know.</li>
  <li>The Prophet ﷺ said: spreading salām is a form of <strong>ṣadaqah (charity)</strong>.</li>
  <li>Spreading salām creates love and friendship between Muslims.</li>
</ul>

<h3>Using the Right Hand</h3>
<p><strong>"Say Bismillāh and eat with your right hand, and eat from what is in front of you."</strong> (Bukhārī &amp; Muslim)</p>
<ul>
  <li>Always eat and drink with the <strong>right hand</strong>.</li>
  <li>Give and receive things with the <strong>right hand</strong>.</li>
  <li>Shayṭān eats with his left hand — so we follow the sunnah by using our right!</li>
</ul>

<h3>Sitting While Drinking</h3>
<p><strong>"None of you should drink whilst standing; whoever forgot and drank standing should make himself vomit."</strong> (Muslim)</p>
<ul>
  <li>Always <strong>sit down</strong> when drinking.</li>
  <li>Sitting while drinking is the sunnah of the Prophet ﷺ and is better for health.</li>
</ul>

<h3>Six Rights of a Muslim over Another Muslim</h3>
<p>Rasūlullāh ﷺ said: "A Muslim has six rights over another Muslim:"</p>
<ol>
  <li>When you meet him, give him <strong>salām</strong>.</li>
  <li>When he invites you, <strong>accept his invitation</strong>.</li>
  <li>When he asks for advice, give him <strong>sincere advice (naṣīḥah)</strong>.</li>
  <li>When he sneezes and says Alḥamdulillāh, say <strong>Yarḥamukallāh</strong>.</li>
  <li>When he is ill, <strong>visit him</strong>.</li>
  <li>When he dies, attend his <strong>funeral (janāzah)</strong>.</li>
</ol>

<h3>Kindness to Animals</h3>
<p>Islam teaches us to be kind to all of Allāh's creatures:</p>
<ul>
  <li>A sinful woman entered Jannah because she gave water to a thirsty dog — Allāh rewarded her for this small act of kindness.</li>
  <li>Another woman was punished in Hell because she locked up a cat and let it starve — cruelty to animals is a serious sin.</li>
  <li>Animals must be given food, water, and kind treatment.</li>
</ul>
`.trim();

  const unit5 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-ahadith-social' } },
    create: {
      slug: 'maktab-2-ahadith-social',
      courseId: course.id,
      orderIndex: 5,
      title: `Aḥādīth — Social Conduct & Kindness`,
      description: `Spreading salām, using the right hand, sitting while drinking, the six rights of a Muslim over another, and showing kindness to animals.`,
      content: unit5Content,
    },
    update: {
      title: `Aḥādīth — Social Conduct & Kindness`,
      description: `Spreading salām, using the right hand, sitting while drinking, the six rights of a Muslim over another, and showing kindness to animals.`,
      content: unit5Content,
    },
  });
  console.log('✅ Unit 5:', unit5.title);

  // ══════════════════════════════════════════════
  // UNIT 6: SĪRAH -- Rasūlullāh ﷺ Before Prophethood
  // ══════════════════════════════════════════════

  const unit6Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe how Rasūlullāh ﷺ resolved the Black Stone dispute, explain what Ḥilf al-Fuḍūl was, and understand why he was trusted before prophethood.</p>

<h3>The Reconstruction of the Kaʿbah — The Black Stone Dispute</h3>
<p>When Rasūlullāh ﷺ was about 35 years old, the Quraysh decided to rebuild the Kaʿbah after a flood damaged it. Everything went smoothly until it was time to place the <strong>Black Stone (al-Ḥajar al-Aswad)</strong> back in its corner. Each of the four main tribes wanted the honour of placing it — the argument became so heated that a war was about to break out!</p>
<p>They agreed that the first person to enter through the Bāb al-Ṣafā gate the next morning would be the judge. That person was Rasūlullāh ﷺ! When the people saw him, they said: <em>"Al-Amīn has come! We accept his decision!"</em></p>
<p>Rasūlullāh ﷺ spread his cloak on the ground, placed the Black Stone on it, and asked the leaders of <strong>each tribe</strong> to hold one edge of the cloak. Together they all lifted it. Then he picked up the Stone with his own hands and placed it in its position. Everyone was satisfied — his wisdom brought peace.</p>

<h3>Ḥilf al-Fuḍūl — The Alliance for Justice</h3>
<p>Before prophethood, Rasūlullāh ﷺ joined a noble alliance called <strong>Ḥilf al-Fuḍūl</strong> (the Alliance of the Virtuous). This was a pact between several noble Makkan men to:</p>
<ul>
  <li>Protect the weak and oppressed.</li>
  <li>Return the rights of those who had been wronged.</li>
  <li>Stand against all forms of injustice in Makkah.</li>
</ul>
<p>Rasūlullāh ﷺ later said about it: <em>"Even now, if I were invited to such an alliance, I would respond."</em> This shows his commitment to justice and goodness throughout his life.</p>

<h3>Trading for Sayyidah Khadījah رضي الله عنها</h3>
<p>Sayyidah Khadījah رضي الله عنها was a noble and wealthy businesswoman of Makkah. She had heard about Rasūlullāh's ﷺ complete honesty and trustworthiness, so she proposed that he take her goods to trade in Shām (Syria). He did so successfully and returned with excellent profits — and Khadījah was so impressed by his character that she later proposed marriage to him.</p>

<h3>Al-Amīn Before Prophethood</h3>
<p>Because of his complete honesty and trustworthiness, the people of Makkah gave Rasūlullāh ﷺ the title <strong>"Al-Amīn"</strong> (The Trustworthy) even before he became a prophet. People trusted him with their valuables, secrets, and disputes. He was truly a living example of perfect character.</p>
`.trim();

  const unit6 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-sirah-pre-prophethood' } },
    create: {
      slug: 'maktab-2-sirah-pre-prophethood',
      courseId: course.id,
      orderIndex: 6,
      title: `Sīrah — Rasūlullāh ﷺ Before Prophethood`,
      description: `The Black Stone dispute and Rasūlullāh's ﷺ wise solution, Ḥilf al-Fuḍūl (Alliance for Justice), trading for Khadījah, and why he was called Al-Amīn.`,
      content: unit6Content,
    },
    update: {
      title: `Sīrah — Rasūlullāh ﷺ Before Prophethood`,
      description: `The Black Stone dispute and Rasūlullāh's ﷺ wise solution, Ḥilf al-Fuḍūl (Alliance for Justice), trading for Khadījah, and why he was called Al-Amīn.`,
      content: unit6Content,
    },
  });
  console.log('✅ Unit 6:', unit6.title);

  // ══════════════════════════════════════════════
  // UNIT 7: SĪRAH -- The Beginning of Waḥy
  // ══════════════════════════════════════════════

  const unit7Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe the first revelation, identify the first word of the Qur'ān, explain who comforted Rasūlullāh ﷺ first, and state his age at the time.</p>

<h3>Retreat to Cave Ḥirā'</h3>
<p>As Rasūlullāh ﷺ grew older, he felt a deep desire to be alone and reflect on the true Lord of the universe. He would go to the <strong>Cave of Ḥirā'</strong> on a mountain called <strong>Jabal al-Noor</strong> (Mountain of Light) near Makkah, about 3 miles from the city. He would stay there for days at a time, meditating and worshipping Allāh.</p>

<h3>The First Revelation — Iqra'!</h3>
<p>Rasūlullāh ﷺ was <strong>40 years old</strong> when, in the month of Ramaḍān, the Angel <strong>Jibrā'īl عليه السلام</strong> appeared to him for the first time. Jibrā'īl squeezed him tightly and commanded:</p>
<p><strong>"Iqra'!" — "Read!" (or "Recite!")</strong></p>
<p>Rasūlullāh ﷺ replied: "I cannot read." Jibrā'īl squeezed him a second time and said "Iqra'!" Rasūlullāh ﷺ again said he could not read. After a third squeeze, Jibrā'īl revealed the very first āyāt of the Qur'ān — the beginning of <strong>Sūrah al-ʿAlaq</strong>:</p>
<blockquote>
  <p><em>"Read! In the name of your Lord who created — He created man from a clinging substance. Read! And your Lord is the Most Generous — Who taught by the pen — He taught man that which he knew not."</em> (Sūrah al-ʿAlaq 96:1–5)</p>
</blockquote>
<p>The first word of the Qur'ān ever revealed was <strong>"Iqra'" (اقرأ)</strong> — meaning "Read!" or "Recite!"</p>

<h3>Return to Khadījah رضي الله عنها</h3>
<p>Rasūlullāh ﷺ returned home trembling and said to Sayyidah Khadījah رضي الله عنها: "Cover me! Cover me!" She wrapped him and comforted him saying: <em>"By Allāh, Allāh would never disgrace you. You maintain family ties, you speak the truth, you carry the burdens of the weak, you help the poor, you are generous to guests, and you support the causes of justice."</em></p>

<h3>Waraqah ibn Nawfal's Confirmation</h3>
<p>Khadījah رضي الله عنها took Rasūlullāh ﷺ to her cousin <strong>Waraqah ibn Nawfal</strong>, a scholar of the previous scriptures. After hearing what happened, Waraqah said:</p>
<p><strong>"This is the Nāmūs (the Angel Jibrā'īl) that Allāh sent to Mūsā عليه السلام! You are a Prophet of this nation. If I am alive when you are driven out, I will support you."</strong></p>
<p>This was the first confirmation that Rasūlullāh ﷺ had truly received waḥy (revelation) from Allāh — the age of prophethood had begun!</p>
`.trim();

  const unit7 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-sirah-wahy' } },
    create: {
      slug: 'maktab-2-sirah-wahy',
      courseId: course.id,
      orderIndex: 7,
      title: `Sīrah — The Beginning of Waḥy`,
      description: `Retreat to Cave Ḥirā', the first revelation (Sūrah al-ʿAlaq), Jibrā'īl's appearance, Khadījah's comfort, and Waraqah ibn Nawfal's confirmation of prophethood.`,
      content: unit7Content,
    },
    update: {
      title: `Sīrah — The Beginning of Waḥy`,
      description: `Retreat to Cave Ḥirā', the first revelation (Sūrah al-ʿAlaq), Jibrā'īl's appearance, Khadījah's comfort, and Waraqah ibn Nawfal's confirmation of prophethood.`,
      content: unit7Content,
    },
  });
  console.log('✅ Unit 7:', unit7.title);

  // ══════════════════════════════════════════════
  // UNIT 8: TĀRĪKH -- Prophet Hūd ʿalayhi al-salām
  // ══════════════════════════════════════════════

  const unit8Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe the people of ʿĀd, explain their sin, state Prophet Hūd's message, and describe their punishment.</p>

<h3>The People of ʿĀd</h3>
<p>After the people of Nūḥ عليه السلام were destroyed, a people called <strong>ʿĀd</strong> came. They lived in southern Arabia in a land called Aḥqāf. Allāh sent Prophet <strong>Hūd عليه السلام</strong> to guide them. The people of ʿĀd were:</p>
<ul>
  <li><strong>Physically large and powerful</strong> — they were proud of their great strength. They said: "Who is stronger than us?"</li>
  <li><strong>Very wealthy</strong> — they had great riches and built magnificent tall monuments and towers.</li>
  <li><strong>Arrogant and ungrateful</strong> — they forgot Allāh's blessings and became proud.</li>
</ul>

<h3>Their Sin and Prophet Hūd's Message</h3>
<p>Despite all their blessings, the people of ʿĀd <strong>worshipped idols</strong> and turned away from Allāh. Prophet Hūd عليه السلام called them to tawhīd (the oneness of Allāh):</p>
<ul>
  <li>"O my people! Worship Allāh alone — you have no god but Him."</li>
  <li>"Do not be arrogant — your strength is a gift from Allāh."</li>
  <li>"Fear Allāh and obey me."</li>
</ul>
<p>But the people of ʿĀd mocked him, rejected his message, and refused to give up their idols. They said: "We do not need you!" and continued in their arrogance.</p>

<h3>The Punishment</h3>
<p>Because of their arrogance and refusal to believe, Allāh sent a devastating punishment:</p>
<p>A <strong>screaming, howling wind</strong> was sent against them for <strong>seven nights and eight days</strong> without stopping. This violent wind destroyed everything in its path — their bodies, their buildings, and all their possessions. The mighty people of ʿĀd were completely wiped out.</p>
<p>Allāh says: <em>"As for ʿĀd, they were destroyed by a screaming, violent wind."</em> (Sūrah al-Ḥāqqah 69:6)</p>
<p>Prophet Hūd عليه السلام and the believers with him were saved by Allāh. Their ruins serve as a warning for future generations.</p>
`.trim();

  const unit8 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-tarikh-hud' } },
    create: {
      slug: 'maktab-2-tarikh-hud',
      courseId: course.id,
      orderIndex: 8,
      title: `Tārīkh — Prophet Hūd ʿalayhi al-salām`,
      description: `The people of ʿĀd — their arrogance and idol worship, Prophet Hūd's call to tawhīd, their rejection, and the howling wind that destroyed them.`,
      content: unit8Content,
    },
    update: {
      title: `Tārīkh — Prophet Hūd ʿalayhi al-salām`,
      description: `The people of ʿĀd — their arrogance and idol worship, Prophet Hūd's call to tawhīd, their rejection, and the howling wind that destroyed them.`,
      content: unit8Content,
    },
  });
  console.log('✅ Unit 8:', unit8.title);

  // ══════════════════════════════════════════════
  // UNIT 9: TĀRĪKH -- Prophet Ṣāliḥ ʿalayhi al-salām
  // ══════════════════════════════════════════════

  const unit9Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to describe the people of Thamūd, explain the miracle of the she-camel, state what happened when it was killed, and describe the punishment.</p>

<h3>The People of Thamūd</h3>
<p>After ʿĀd was destroyed, another people called <strong>Thamūd</strong> arose. Allāh sent Prophet <strong>Ṣāliḥ عليه السلام</strong> to guide them. The people of Thamūd:</p>
<ul>
  <li>Lived in the region of <strong>Ḥijr</strong> (present-day northwest Saudi Arabia, near Madāʾin Ṣāliḥ).</li>
  <li>Were famous for <strong>carving magnificent homes</strong> out of mountains — they were skilled architects.</li>
  <li>Had great wealth and power but worshipped idols and rejected Allāh.</li>
</ul>

<h3>Prophet Ṣāliḥ's Message and the Miraculous She-Camel</h3>
<p>Prophet Ṣāliḥ عليه السلام called his people to worship Allāh alone. They challenged him: "Bring us a sign (miracle) if you are truly a prophet!" Allāh caused a <strong>she-camel</strong> to emerge miraculously from a solid rock. This was an extraordinary sign from Allāh!</p>
<p>Prophet Ṣāliḥ عليه السلام gave strict commandments about the she-camel:</p>
<ul>
  <li>Let her graze freely in the land.</li>
  <li>She has <strong>her own day to drink</strong> from the well — on that day, do not take any water for yourselves.</li>
  <li><strong>Do not harm her in any way</strong> — or a terrible punishment will come within three days.</li>
</ul>

<h3>The Killing of the She-Camel</h3>
<p>For a time, the people of Thamūd observed the commandments. But eventually, nine wicked men among them plotted to kill the she-camel. They hamstrung her and slaughtered her — a direct act of defiance against Allāh's command.</p>
<p>When Prophet Ṣāliḥ عليه السلام heard the news, he warned them: <strong>"You have only three more days to enjoy yourselves in your homes — then the punishment of Allāh will come."</strong></p>

<h3>The Punishment</h3>
<p>After three days, a <strong>terrible blast (ṣayhah — a mighty thunderclap/scream)</strong> came from the sky. It killed everyone — the people of Thamūd were completely destroyed. Even their magnificent carved mountain homes could not protect them.</p>
<p>Prophet Ṣāliḥ عليه السلام and the few believers with him were saved by Allāh. Allāh says: <em>"And the ṣayhah (thunderclap) seized those who had wronged and they became motionless in their homes."</em> (Sūrah Hūd 11:67)</p>
`.trim();

  const unit9 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-tarikh-salih' } },
    create: {
      slug: 'maktab-2-tarikh-salih',
      courseId: course.id,
      orderIndex: 9,
      title: `Tārīkh — Prophet Ṣāliḥ ʿalayhi al-salām`,
      description: `The people of Thamūd — their carved mountain homes, the she-camel as a miraculous sign, its killing, three days warning, and the devastating thunderclap punishment.`,
      content: unit9Content,
    },
    update: {
      title: `Tārīkh — Prophet Ṣāliḥ ʿalayhi al-salām`,
      description: `The people of Thamūd — their carved mountain homes, the she-camel as a miraculous sign, its killing, three days warning, and the devastating thunderclap punishment.`,
      content: unit9Content,
    },
  });
  console.log('✅ Unit 9:', unit9.title);

  // ══════════════════════════════════════════════
  // UNIT 10: AQĀID -- Believing in Angels
  // ══════════════════════════════════════════════

  const unit10Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to state what angels are made of, name the four main angels and their duties, describe the Kirāman Kātibīn, and know that angels never disobey Allāh.</p>

<h3>What Are Angels (Malā'ikah)?</h3>
<p>Angels are special creations of Allāh. Believing in angels is the <strong>second article of faith (Īmān)</strong>. Key facts about angels:</p>
<ul>
  <li>Angels are created from <strong>nūr (light)</strong>.</li>
  <li>They <strong>never disobey Allāh</strong> — they do exactly what Allāh commands, always.</li>
  <li>They do not eat, drink, sleep, tire, or get bored.</li>
  <li>They can take on different forms — Jibrā'īl عليه السلام sometimes appeared as a man.</li>
  <li>We cannot see them in their true angelic form.</li>
  <li>They have <strong>wings</strong> — some have two, some four, some six, and some have more.</li>
</ul>

<h3>The Four Main Angels and Their Duties</h3>
<ol>
  <li><strong>Jibrā'īl عليه السلام</strong> — The Angel of Waḥy (Revelation). His duty was to bring the words of Allāh (divine revelation) to the prophets and messengers. He is also called <em>Ar-Rūḥ al-Amīn</em> (the Trustworthy Spirit). He brought the Qur'ān to our Prophet ﷺ.</li>
  <li><strong>Mīkā'īl عليه السلام</strong> — His duty is to manage <strong>rain, clouds, and provisions (sustenance)</strong> for all living creatures. He distributes Allāh's blessings of food and water across the earth.</li>
  <li><strong>Isrāfīl عليه السلام</strong> — He will <strong>blow the trumpet (Ṣūr)</strong> on the Day of Judgement. The first blow will destroy everything. The second blow will resurrect everyone for the Day of Reckoning.</li>
  <li><strong>ʿAzrā'īl عليه السلام (Malak al-Mawt)</strong> — The Angel of Death. His duty is to <strong>take the souls</strong> of all living things when they die, by the command of Allāh.</li>
</ol>

<h3>Kirāman Kātibīn — The Honourable Recorders</h3>
<p>Every single person has <strong>two angels</strong> assigned to them at all times:</p>
<ul>
  <li>The angel on the <strong>right shoulder</strong> records all <strong>good deeds</strong>.</li>
  <li>The angel on the <strong>left shoulder</strong> records all <strong>bad deeds</strong>.</li>
</ul>
<p>These angels are called <strong>Kirāman Kātibīn</strong> (The Honourable Recorders). On the Day of Judgement, every person will receive their book of deeds.</p>
<p>Allāh says: <em>"Indeed, over you are guardians — noble and recording — they know whatever you do."</em> (Sūrah al-Infiṭār 82:10–12)</p>
`.trim();

  const unit10 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-aqaid-angels' } },
    create: {
      slug: 'maktab-2-aqaid-angels',
      courseId: course.id,
      orderIndex: 10,
      title: `Aqā'id — Believing in Angels`,
      description: `Angels created from light (nūr), they never disobey Allāh, names and duties of four main angels: Jibrā'īl, Mīkā'īl, Isrāfīl, ʿAzrā'īl; and the Kirāman Kātibīn.`,
      content: unit10Content,
    },
    update: {
      title: `Aqā'id — Believing in Angels`,
      description: `Angels created from light (nūr), they never disobey Allāh, names and duties of four main angels: Jibrā'īl, Mīkā'īl, Isrāfīl, ʿAzrā'īl; and the Kirāman Kātibīn.`,
      content: unit10Content,
    },
  });
  console.log('✅ Unit 10:', unit10.title);

  // ══════════════════════════════════════════════
  // UNIT 11: AQĀID -- Believing in the Divine Books
  // ══════════════════════════════════════════════

  const unit11Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to name the four main divine books, identify which prophet received each, understand that the Qur'ān supersedes all previous books, and know the Qur'ān is preserved.</p>

<h3>Believing in the Divine Books</h3>
<p>Allāh sent books to guide humanity through His prophets. Believing in all the divine books is the <strong>third article of faith (Īmān)</strong>. There are four main books:</p>

<ol>
  <li><strong>Tawrāh (Torah)</strong> — revealed to Prophet <strong>Mūsā عليه السلام</strong>. It contained guidance for the Children of Isrā'īl (Banū Isrā'īl). The original Tawrāh contained pure guidance, but people later changed and altered it.</li>
  <li><strong>Zabūr (Psalms)</strong> — revealed to Prophet <strong>Dāwūd عليه السلام</strong>. It contained praises, du'ā's, and words of wisdom. The original Zabūr was also changed by later generations.</li>
  <li><strong>Injīl (Gospel)</strong> — revealed to Prophet <strong>ʿĪsā عليه السلام</strong>. It contained guidance and good news about the final prophet (Muḥammad ﷺ). The Injīl was also changed over time.</li>
  <li><strong>Al-Qur'ān al-Karīm</strong> — revealed to Prophet <strong>Muḥammad ﷺ</strong>. It is the FINAL, COMPLETE, and PRESERVED message from Allāh to all of humanity until the Day of Judgement.</li>
</ol>

<h3>The Qur'ān — The Final Preserved Book</h3>
<p>The Holy Qur'ān is unique and special among all divine books:</p>
<ul>
  <li><strong>Final:</strong> No scripture will come after the Qur'ān. It is the last message from Allāh.</li>
  <li><strong>Supersedes all:</strong> The Qur'ān corrects what was changed in previous books and completes the message.</li>
  <li><strong>Preserved by Allāh:</strong> Allāh Himself promised to protect it: <em>"Indeed, it is We who sent down the message and indeed, We will be its guardian."</em> (Qur'ān 15:9)</li>
  <li><strong>Unchanged:</strong> Unlike the Tawrāh, Zabūr, and Injīl which were changed by people, the Qur'ān has remained <strong>completely unchanged</strong> since it was revealed over 1,400 years ago.</li>
  <li><strong>Memorised:</strong> Millions of Muslims have memorised the entire Qur'ān (ḥuffāẓ), ensuring its preservation.</li>
</ul>
<p>A Muslim must believe in all the divine books as they were originally revealed, but must follow the Qur'ān today as the final and authentic message from Allāh.</p>
`.trim();

  const unit11 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-aqaid-books' } },
    create: {
      slug: 'maktab-2-aqaid-books',
      courseId: course.id,
      orderIndex: 11,
      title: `Aqā'id — Believing in the Divine Books`,
      description: `The four main divine books (Tawrāh, Zabūr, Injīl, Qur'ān), which prophet received each, the Qur'ān as the final and preserved book that supersedes all previous scriptures.`,
      content: unit11Content,
    },
    update: {
      title: `Aqā'id — Believing in the Divine Books`,
      description: `The four main divine books (Tawrāh, Zabūr, Injīl, Qur'ān), which prophet received each, the Qur'ān as the final and preserved book that supersedes all previous scriptures.`,
      content: unit11Content,
    },
  });
  console.log('✅ Unit 11:', unit11.title);

  // ══════════════════════════════════════════════
  // UNIT 12: AKHLĀQ -- Promises & Gratitude
  // ══════════════════════════════════════════════

  const unit12Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the importance of keeping promises, describe three ways of showing gratitude (shukr), and recall the Qur'ānic promise about gratitude.</p>

<h3>Keeping Promises</h3>
<p>The Prophet ﷺ said: <strong>"The signs of a hypocrite are three: when he speaks, he lies; when he makes a promise, he breaks it; when he is trusted, he betrays the trust."</strong> (Bukhārī &amp; Muslim)</p>
<ul>
  <li>Keeping promises is a <strong>sign of faith (Īmān)</strong>.</li>
  <li>Breaking promises without a valid reason is a <strong>sign of hypocrisy (nifāq)</strong>.</li>
  <li>A Muslim must always try to keep their word, even when it is difficult.</li>
  <li>If you are genuinely unable to keep a promise, apologise sincerely and give a truthful reason.</li>
  <li>Before making a promise, think carefully — say "In shā' Allāh" (if Allāh wills).</li>
</ul>

<h3>Shukr — Gratitude to Allāh</h3>
<p>Allāh has given us countless blessings — our eyes, ears, heart, health, family, food, shelter, and much more. We must show <strong>shukr (gratitude)</strong> to Allāh for all these blessings. The Prophet ﷺ said: <em>"Whoever does not thank people has not thanked Allāh."</em></p>

<h3>Three Ways to Show Gratitude</h3>
<ol>
  <li><strong>By the heart</strong> — Recognise and believe in your heart that <strong>every blessing comes from Allāh alone</strong>. Nothing we have is by our own power.</li>
  <li><strong>By the tongue</strong> — Say <strong>"Alḥamdulillāh"</strong> (All praise be to Allāh). Say it when you wake up, after eating, when something good happens, and throughout the day.</li>
  <li><strong>By actions</strong> — Use Allāh's blessings in <strong>acts of obedience</strong>: use your health to pray and fast, use your wealth to give ṣadaqah, use your knowledge to teach others.</li>
</ol>

<h3>Allāh's Promise About Gratitude</h3>
<p>Allāh says in Sūrah Ibrāhīm (14:7):</p>
<blockquote>
  <p><strong>"If you are grateful, I will certainly give you more (increase you in blessings). But if you are ungrateful, indeed My punishment is severe."</strong></p>
</blockquote>
<p>This is Allāh's promise: <strong>gratitude brings more blessings!</strong> The more we thank Allāh, the more He gives us. But ingratitude (kufr al-niʿmah) brings punishment and decrease in blessings.</p>
`.trim();

  const unit12 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-akhlaq-promise-shukr' } },
    create: {
      slug: 'maktab-2-akhlaq-promise-shukr',
      courseId: course.id,
      orderIndex: 12,
      title: `Akhlāq — Promises & Gratitude`,
      description: `Importance of keeping promises as a sign of faith, three ways to show gratitude (shukr), and the Qur'ānic promise that gratitude brings more blessings (Sūrah Ibrāhīm 14:7).`,
      content: unit12Content,
    },
    update: {
      title: `Akhlāq — Promises & Gratitude`,
      description: `Importance of keeping promises as a sign of faith, three ways to show gratitude (shukr), and the Qur'ānic promise that gratitude brings more blessings (Sūrah Ibrāhīm 14:7).`,
      content: unit12Content,
    },
  });
  console.log('✅ Unit 12:', unit12.title);

  // ══════════════════════════════════════════════
  // UNIT 13: AKHLĀQ -- Salām, Helping & Kindness to Animals
  // ══════════════════════════════════════════════

  const unit13Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to explain the virtue of spreading salām, define taʿāwun with its Qur'ānic source, recall the stories of kindness and cruelty to animals, and know the Islamic ruling on animals.</p>

<h3>Spreading Salām</h3>
<p>The Prophet ﷺ said: <strong>"You will not enter Jannah until you believe, and you will not (truly) believe until you love one another. Shall I tell you something which, if you do it, you will love one another? Spread salām among yourselves."</strong> (Muslim)</p>
<ul>
  <li>Spreading salām is a beloved <strong>sunnah</strong> — the Prophet ﷺ always said salām first.</li>
  <li>Say salām to everyone — people you know <em>and</em> those you do not know.</li>
  <li>Spreading salām is considered a form of <strong>ṣadaqah (charity)</strong>.</li>
  <li>Start with your right foot when entering and giving salām.</li>
</ul>

<h3>Taʿāwun — Cooperation in Goodness</h3>
<p>Allāh commands us in Sūrah al-Māʾidah (5:2):</p>
<blockquote>
  <p><strong>"Help one another in righteousness and piety, and do not help one another in sin and transgression. And fear Allāh — indeed, Allāh is severe in punishment."</strong></p>
</blockquote>
<p><strong>Taʿāwun</strong> means cooperation and mutual assistance. We must:</p>
<ul>
  <li><strong>Help</strong> each other in good deeds — studying, charity, helping the weak, kindness.</li>
  <li><strong>NOT help</strong> each other in sin — do not assist someone in lying, cheating, hurting others, or any ḥarām act.</li>
</ul>

<h3>Kindness to Animals — Two Powerful Stories</h3>

<h4>The Woman Who Gave Water to a Dog (She Entered Jannah)</h4>
<p>The Prophet ﷺ narrated: A woman who was known for her sins was once walking in the desert. She was very thirsty herself when she came across a thirsty dog panting beside a dry well. Feeling sorry for the dog, she took off her shoe, tied it to her head covering, lowered it into the well, and gave the dog water to drink. <strong>Because of this single act of mercy, Allāh forgave all her sins and she entered Jannah.</strong></p>

<h4>The Woman Who Starved a Cat (She Was Punished)</h4>
<p>The Prophet ﷺ also narrated: A woman locked a cat in her room. She did not feed it, nor did she let it go to find food on its own. The cat died of hunger. <strong>Because of this act of cruelty, Allāh punished her in Hell.</strong></p>

<p><strong>Lesson:</strong> Animals are Allāh's creatures. We must treat them with mercy. Do not harm animals needlessly — feed them, give them water, and be kind to them.</p>
`.trim();

  const unit13 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-akhlaq-salaam-kindness' } },
    create: {
      slug: 'maktab-2-akhlaq-salaam-kindness',
      courseId: course.id,
      orderIndex: 13,
      title: `Akhlāq — Salām, Helping & Kindness to Animals`,
      description: `Spreading salām as sunnah and ṣadaqah, taʿāwun (cooperation in goodness) from Sūrah al-Māʾidah 5:2, kindness to animals illustrated by the stories of the dog and the cat.`,
      content: unit13Content,
    },
    update: {
      title: `Akhlāq — Salām, Helping & Kindness to Animals`,
      description: `Spreading salām as sunnah and ṣadaqah, taʿāwun (cooperation in goodness) from Sūrah al-Māʾidah 5:2, kindness to animals illustrated by the stories of the dog and the cat.`,
      content: unit13Content,
    },
  });
  console.log('✅ Unit 13:', unit13.title);

  // ══════════════════════════════════════════════
  // UNIT 14: ĀDĀB -- Greeting, Speaking & Sneezing
  // ══════════════════════════════════════════════

  const unit14Content = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to give and respond to salām with the correct words, state the etiquette of speaking, know what to say when sneezing and responding, and describe the etiquette of yawning.</p>

<h3>Giving and Responding to Salām</h3>
<p>The Islamic greeting of peace carries great reward and blessings:</p>
<ul>
  <li><strong>When giving salām:</strong> <em>"Assalāmu ʿalaykum wa raḥmatullāhi wa barakātuh"</em><br>— "Peace be upon you, and the mercy and blessings of Allāh."</li>
  <li><strong>When responding:</strong> <em>"Wa ʿalaykum assalām wa raḥmatullāhi wa barakātuh"</em><br>— "And upon you be peace, and the mercy and blessings of Allāh."</li>
</ul>
<p>The full salām earns the <strong>most reward (30 ḥasanāt)</strong>. Say the full words!</p>

<h3>Etiquette of Speaking</h3>
<ul>
  <li><strong>Listen carefully</strong> when others speak — never interrupt.</li>
  <li>Speak <strong>softly and clearly</strong> — do not shout or raise your voice unnecessarily.</li>
  <li>Think before speaking: "Are my words helpful or harmful?"</li>
  <li>The Prophet ﷺ said: <em>"Whoever believes in Allāh and the Last Day, let him speak good or remain silent."</em> (Bukhārī &amp; Muslim)</li>
  <li>Do not speak disrespectfully to elders, parents, or teachers.</li>
</ul>

<h3>Etiquette of Sneezing</h3>
<p>Sneezing is from Allāh — it reminds us of His blessings. The correct etiquette is:</p>
<ol>
  <li><strong>Cover your mouth</strong> with your hand or a tissue.</li>
  <li>Say <strong>"Alḥamdulillāh"</strong> — "Praise be to Allāh."</li>
  <li>The person nearby says: <strong>"Yarḥamukallāh"</strong> — "May Allāh have mercy on you."</li>
  <li>You (the one who sneezed) reply: <strong>"Yahdīkumullāhu wa yuṣliḥu bālakum"</strong> — "May Allāh guide you and correct your affairs."</li>
</ol>
<p><em>Note:</em> Step 3 and 4 only happen if the sneezing person says "Alḥamdulillāh."</p>

<h3>Etiquette of Yawning</h3>
<p>The Prophet ﷺ said: <em>"Yawning is from Shayṭān, so when any one of you yawns, let him suppress it as much as possible."</em> (Bukhārī)</p>
<ul>
  <li>Try to <strong>suppress (hold back)</strong> the yawn as much as possible.</li>
  <li><strong>Cover your mouth</strong> with the back of your right hand.</li>
  <li>Do not make a loud "ha!" sound when yawning.</li>
  <li>Yawning in ṣalāh should be suppressed — bite down gently to stop it.</li>
</ul>
`.trim();

  const unit14 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-2-adab-greeting-speech-sneeze' } },
    create: {
      slug: 'maktab-2-adab-greeting-speech-sneeze',
      courseId: course.id,
      orderIndex: 14,
      title: `Ādāb — Greeting, Speaking & Sneezing`,
      description: `Full wording of salām and response, etiquette of speaking (listen, do not interrupt, speak softly), sneezing etiquette (Alḥamdulillāh, Yarḥamukallāh, Yahdīkumullāh), and yawning etiquette.`,
      content: unit14Content,
    },
    update: {
      title: `Ādāb — Greeting, Speaking & Sneezing`,
      description: `Full wording of salām and response, etiquette of speaking (listen, do not interrupt, speak softly), sneezing etiquette (Alḥamdulillāh, Yarḥamukallāh, Yahdīkumullāh), and yawning etiquette.`,
      content: unit14Content,
    },
  });
  console.log('✅ Unit 14:', unit14.title);

  // ══════════════════════════════════════════════
  // QUIZ QUESTIONS -- 6 per unit, 84 total
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

    // Unit 1: Wudu Detail
    { unitId: unit1.id, externalId: 'maktab-2-wudu-q1', type: 'MULTIPLE_CHOICE',
      questionText: "How many fara'id (obligatory acts) does wudu' have?",
      options: ['2', '3', '4', '5'], correctAnswer: '4',
      explanation: "Wudu' has exactly 4 fara'id: washing the face, washing both arms including elbows, wiping at least a quarter of the head, and washing both feet including ankles." },
    { unitId: unit1.id, externalId: 'maktab-2-wudu-q2', type: 'TRUE_FALSE',
      questionText: "Saying Bismillah before wudu' is a fard (obligatory act).",
      options: ['True', 'False'], correctAnswer: 'False',
      explanation: "Saying Bismillah is a sunnah, not a fard. The 4 fara'id are washing the face, arms (to elbows), masah of the head, and feet (to ankles)." },
    { unitId: unit1.id, externalId: 'maktab-2-wudu-q3', type: 'MULTIPLE_CHOICE',
      questionText: "Which of the following BREAKS wudu'?",
      options: ['Eating food', 'Passing wind', 'Crying', 'Saying Bismillah'], correctAnswer: 'Passing wind',
      explanation: "Passing wind is one of the nawaqid (nullifiers) of wudu'. Eating food, crying, and saying Bismillah do not break wudu'." },
    { unitId: unit1.id, externalId: 'maktab-2-wudu-q4', type: 'TRUE_FALSE',
      questionText: "Falling into a deep sleep while lying down breaks wudu'.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Falling into a deep sleep while lying down or leaning on something is one of the nawaqid of wudu'." },
    { unitId: unit1.id, externalId: 'maktab-2-wudu-q5', type: 'MULTIPLE_CHOICE',
      questionText: "Which part of the body does NOT need to be washed as a fard of wudu'?",
      options: ['The face', 'The arms up to elbows', 'The ears', 'The feet up to ankles'], correctAnswer: 'The ears',
      explanation: "The 4 fara'id of wudu' are the face, arms, masah of the head, and feet. The ears are sunnah to wipe but not fard." },
    { unitId: unit1.id, externalId: 'maktab-2-wudu-q6', type: 'TRUE_FALSE',
      questionText: "The sunnah is to start wudu' from the right side — washing the right arm before the left.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Starting from the right side is a sunnah of wudu'. The Prophet (s.a.w.) said: 'Start with the right.'" },

    // Unit 2: Tayammum
    { unitId: unit2.id, externalId: 'maktab-2-tayammum-q1', type: 'MULTIPLE_CHOICE',
      questionText: 'When is a person allowed to perform tayammum instead of wudu?',
      options: ["When they don't feel like making wudu'", 'When water is not available or using it would cause harm', "When they forget how to do wudu'", 'Only when travelling'],
      correctAnswer: 'When water is not available or using it would cause harm',
      explanation: "Tayammum is allowed when: water is not available, using water causes harm due to illness, extreme cold, or danger. Not from laziness." },
    { unitId: unit2.id, externalId: 'maktab-2-tayammum-q2', type: 'MULTIPLE_CHOICE',
      questionText: 'What do you strike your hands on when performing tayammum?',
      options: ['A wet stone', 'Clean earth, dust, sand, or stone', 'Any surface', 'Only pure sand'],
      correctAnswer: 'Clean earth, dust, sand, or stone',
      explanation: "Tayammum is performed by striking the hands on clean earth, dust, sand, or stone." },
    { unitId: unit2.id, externalId: 'maktab-2-tayammum-q3', type: 'TRUE_FALSE',
      questionText: "Tayammum is broken when water becomes available (if it was unavailable before).",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "If tayammum was done because no water was available, it is broken as soon as water becomes available. Proper wudu' must then be made." },
    { unitId: unit2.id, externalId: 'maktab-2-tayammum-q4', type: 'MULTIPLE_CHOICE',
      questionText: 'How many strikes on the earth are made when performing tayammum?',
      options: ['One strike for the whole body', 'Two strikes — one for the face, one for the arms', 'Three strikes', 'Four strikes'],
      correctAnswer: 'Two strikes — one for the face, one for the arms',
      explanation: "Tayammum involves two strikes: the first for wiping the entire face, and the second for wiping both arms up to and including the elbows." },
    { unitId: unit2.id, externalId: 'maktab-2-tayammum-q5', type: 'TRUE_FALSE',
      questionText: 'Tayammum can replace ghusl as well as wudu when the conditions are met.',
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Tayammum can replace both wudu' and ghusl when the conditions are met. It is a mercy from Allah." },
    { unitId: unit2.id, externalId: 'maktab-2-tayammum-q6', type: 'MULTIPLE_CHOICE',
      questionText: "In tayammum, after wiping the face, which part of the body is wiped next?",
      options: ['The head', 'Both arms up to and including the elbows', 'The feet', 'The chest'],
      correctAnswer: 'Both arms up to and including the elbows',
      explanation: "After the first strike for the face, the second strike is for wiping both arms up to and including the elbows." },

    // Unit 3: Salah Intro
    { unitId: unit3.id, externalId: 'maktab-2-salah-q1', type: 'MULTIPLE_CHOICE',
      questionText: 'How many daily prayers (salah) are obligatory for a Muslim?',
      options: ['3', '4', '5', '7'], correctAnswer: '5',
      explanation: "There are five daily obligatory prayers: Fajr, Zuhr, Asr, Maghrib, and Isha'." },
    { unitId: unit3.id, externalId: 'maktab-2-salah-q2', type: 'MULTIPLE_CHOICE',
      questionText: "How many fard rak'at does the Fajr prayer have?",
      options: ['1', '2', '3', '4'], correctAnswer: '2',
      explanation: "Fajr has 2 fard rak'at. The five daily prayers: Fajr (2), Zuhr (4), Asr (4), Maghrib (3), Isha' (4)." },
    { unitId: unit3.id, externalId: 'maktab-2-salah-q3', type: 'TRUE_FALSE',
      questionText: "Taharah (ritual purity / wudu') is a condition that must be fulfilled BEFORE starting salah.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Taharah is one of the essential conditions for salah. Without a valid wudu', salah is not valid." },
    { unitId: unit3.id, externalId: 'maktab-2-salah-q4', type: 'MULTIPLE_CHOICE',
      questionText: 'In which direction must a Muslim face when performing salah?',
      options: ['Towards the east', 'Towards Madinah', "Towards the Qiblah (Ka'bah in Makkah)", 'Any direction'],
      correctAnswer: "Towards the Qiblah (Ka'bah in Makkah)",
      explanation: "Facing the Qiblah (the direction of the Ka'bah in Makkah) is one of the conditions of salah." },
    { unitId: unit3.id, externalId: 'maktab-2-salah-q5', type: 'MULTIPLE_CHOICE',
      questionText: "Which prayer has 3 fard rak'at?",
      options: ['Fajr', 'Zuhr', 'Maghrib', "Isha'"], correctAnswer: 'Maghrib',
      explanation: "Maghrib has 3 fard rak'at. The five daily prayers: Fajr (2), Zuhr (4), Asr (4), Maghrib (3), Isha' (4)." },
    { unitId: unit3.id, externalId: 'maktab-2-salah-q6', type: 'TRUE_FALSE',
      questionText: 'Salah is the second pillar of Islam.',
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Salah (prayer) is the second pillar of Islam. The five pillars: Shahadah, Salah, Zakah, Sawm, and Hajj." },

    // Unit 4: Ahadith Truth
    { unitId: unit4.id, externalId: 'maktab-2-truth-q1', type: 'MULTIPLE_CHOICE',
      questionText: 'According to the hadith, what does speaking the truth eventually lead to?',
      options: ['Wealth and success', 'Righteousness (birr) and then Jannah', 'A long life', 'Fame and respect'],
      correctAnswer: 'Righteousness (birr) and then Jannah',
      explanation: "The Prophet (s.a.w.) said: 'Truthfulness leads to righteousness and righteousness leads to Jannah.'" },
    { unitId: unit4.id, externalId: 'maktab-2-truth-q2', type: 'MULTIPLE_CHOICE',
      questionText: 'According to the hadith, what does lying lead to?',
      options: ['A minor mistake that is easily forgiven', 'Wickedness (fujur) and then the Hellfire', 'Temporary problems only', 'Nothing serious'],
      correctAnswer: 'Wickedness (fujur) and then the Hellfire',
      explanation: "The Prophet (s.a.w.) said: 'Lying leads to wickedness and wickedness leads to the Fire.'" },
    { unitId: unit4.id, externalId: 'maktab-2-truth-q3', type: 'TRUE_FALSE',
      questionText: 'The title "Al-Amin" means "The Trustworthy One."',
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: '"Al-Amin" means The Trustworthy One — the title given to Rasulullah (s.a.w.) by the people of Makkah before prophethood.' },
    { unitId: unit4.id, externalId: 'maktab-2-truth-q4', type: 'MULTIPLE_CHOICE',
      questionText: 'Who gave Rasulullah (s.a.w.) the title "Al-Amin"?',
      options: ['His family only', 'Only the Muslims', 'The people of Makkah — friends and enemies alike', "Only the Prophet's companions"],
      correctAnswer: 'The people of Makkah — friends and enemies alike',
      explanation: "The people of Makkah — including those who later became enemies of Islam — gave Rasulullah (s.a.w.) the title 'Al-Amin' because he never lied." },
    { unitId: unit4.id, externalId: 'maktab-2-truth-q5', type: 'TRUE_FALSE',
      questionText: 'According to Islam, telling small white lies is permitted occasionally.',
      options: ['True', 'False'], correctAnswer: 'False',
      explanation: "Lying of any kind is forbidden. The hadith warns that a person who keeps lying is recorded with Allah as a great liar. A Muslim must always be truthful." },
    { unitId: unit4.id, externalId: 'maktab-2-truth-q6', type: 'MULTIPLE_CHOICE',
      questionText: 'Why was Rasulullah (s.a.w.) also known as "Al-Sadiq" (The Truthful)?',
      options: ['He won a speaking competition', 'He always told the truth and never deceived anyone', 'He memorised many books', 'He was well-known for his wealth'],
      correctAnswer: 'He always told the truth and never deceived anyone',
      explanation: "Rasulullah (s.a.w.) was called Al-Sadiq because he lived a life of complete honesty throughout his life — before and after prophethood." },

    // Unit 5: Ahadith Social
    { unitId: unit5.id, externalId: 'maktab-2-social-q1', type: 'MULTIPLE_CHOICE',
      questionText: 'What should you do BEFORE speaking to someone, according to the sunnah?',
      options: ['Shake their hand', 'Give salam first', 'Ask how they are', 'Bow your head'],
      correctAnswer: 'Give salam first',
      explanation: "The Prophet (s.a.w.) instructed us to spread salaam — give the greeting of peace before speaking. Salam should precede all conversation." },
    { unitId: unit5.id, externalId: 'maktab-2-social-q2', type: 'TRUE_FALSE',
      questionText: "A Muslim should eat and drink using the right hand as it is the sunnah.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Eating with the right hand is a sunnah. The Prophet (s.a.w.) said: 'When one of you eats, let him eat with his right hand.'" },
    { unitId: unit5.id, externalId: 'maktab-2-social-q3', type: 'MULTIPLE_CHOICE',
      questionText: "What is the sunnah way to drink water or any beverage?",
      options: ['Standing up quickly', 'Sitting down', 'While walking', 'Lying down'],
      correctAnswer: 'Sitting down',
      explanation: "The sunnah is to sit down when drinking. Standing while drinking without a valid reason is discouraged." },
    { unitId: unit5.id, externalId: 'maktab-2-social-q4', type: 'TRUE_FALSE',
      questionText: "Islam only teaches us to be kind to humans, not to animals.",
      options: ['True', 'False'], correctAnswer: 'False',
      explanation: "Islam teaches kindness to ALL of Allah's creation, including animals. The Prophet (s.a.w.) mentioned that a woman entered Jannah because she gave water to a thirsty dog." },
    { unitId: unit5.id, externalId: 'maktab-2-social-q5', type: 'MULTIPLE_CHOICE',
      questionText: "How many rights does a Muslim have over another Muslim according to the hadith?",
      options: ['3', '4', '5', '6'], correctAnswer: '6',
      explanation: "The Prophet (s.a.w.) mentioned six rights of one Muslim over another, including greeting with salam, visiting the sick, following the funeral, answering invitations, saying Yarhamukallah when someone sneezes, and wishing good for them." },
    { unitId: unit5.id, externalId: 'maktab-2-social-q6', type: 'MULTIPLE_CHOICE',
      questionText: "When a Muslim meets another Muslim, what should the first thing they say be?",
      options: ["'How are you?'", "'Assalamu Alaykum'", "'Hello'", "'What is your name?'"],
      correctAnswer: "'Assalamu Alaykum'",
      explanation: "Giving the salaam greeting (Assalamu Alaykum) is the sunnah and the first thing a Muslim should say when meeting another Muslim." },

    // Unit 6: Sirah Pre-Prophethood
    { unitId: unit6.id, externalId: 'maktab-2-preprophet-q1', type: 'MULTIPLE_CHOICE',
      questionText: "During the rebuilding of the Ka'bah, which tribe was fighting over who would place the Black Stone?",
      options: ['The Banu Hashim only', 'All four major Quraysh tribes', 'Two rival families', 'The Arabs and Romans'],
      correctAnswer: 'All four major Quraysh tribes',
      explanation: "All four major tribes of the Quraysh were in dispute about who had the honour of placing the Black Stone back in its place." },
    { unitId: unit6.id, externalId: 'maktab-2-preprophet-q2', type: 'MULTIPLE_CHOICE',
      questionText: "How did Rasulullah (s.a.w.) solve the Black Stone dispute?",
      options: ['He placed it himself', 'He chose the oldest man to place it', "He put the stone on a cloth and asked all tribe leaders to lift it together, then placed it himself", 'He asked them to draw lots'],
      correctAnswer: "He put the stone on a cloth and asked all tribe leaders to lift it together, then placed it himself",
      explanation: "Rasulullah (s.a.w.) placed the Black Stone on a cloth, allowed each tribe leader to hold a corner and lift it, then he placed the stone in its position himself — satisfying all parties." },
    { unitId: unit6.id, externalId: 'maktab-2-preprophet-q3', type: 'TRUE_FALSE',
      questionText: "Hilf al-Fudul was an alliance where the Quraysh nobles pledged to stand for the oppressed.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Hilf al-Fudul was a noble pact formed before prophethood in which tribal leaders, including Rasulullah (s.a.w.), pledged to defend the rights of the wronged and oppressed." },
    { unitId: unit6.id, externalId: 'maktab-2-preprophet-q4', type: 'MULTIPLE_CHOICE',
      questionText: "Who employed Rasulullah (s.a.w.) as a trader before marriage?",
      options: ['Abu Bakr (r.a.)', 'Khadijah (r.a.)', "His uncle Abu Talib", 'Umar (r.a.)'],
      correctAnswer: 'Khadijah (r.a.)',
      explanation: "Khadijah (r.a.) employed Rasulullah (s.a.w.) to lead a trade caravan to Syria. He returned with great profit, and she later proposed marriage to him." },
    { unitId: unit6.id, externalId: 'maktab-2-preprophet-q5', type: 'TRUE_FALSE',
      questionText: 'Rasulullah (s.a.w.) was known for honesty even before he became a Prophet.',
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Rasulullah (s.a.w.) was known throughout Makkah as Al-Amin (The Trustworthy) and Al-Sadiq (The Truthful) long before he received the first revelation." },
    { unitId: unit6.id, externalId: 'maktab-2-preprophet-q6', type: 'MULTIPLE_CHOICE',
      questionText: 'To which country did Rasulullah (s.a.w.) travel for trade on behalf of Khadijah?',
      options: ['Egypt', 'Yemen', 'Syria', 'Iraq'], correctAnswer: 'Syria',
      explanation: "Rasulullah (s.a.w.) led the trade caravan of Khadijah (r.a.) to Syria (Sham), returning successfully with profit." },

    // Unit 7: Sirah Wahy
    { unitId: unit7.id, externalId: 'maktab-2-wahy-q1', type: 'MULTIPLE_CHOICE',
      questionText: "In which cave did Rasulullah (s.a.w.) receive the first revelation?",
      options: ['Cave of Thawr', "Cave Hira' on Mount Nur", "Cave Quba'", 'Cave of Ibrahim'],
      correctAnswer: "Cave Hira' on Mount Nur",
      explanation: "Rasulullah (s.a.w.) used to retreat to Cave Hira' on Mount Nur for worship and reflection. It was here that the first revelation came." },
    { unitId: unit7.id, externalId: 'maktab-2-wahy-q2', type: 'MULTIPLE_CHOICE',
      questionText: "What was the first word revealed to Rasulullah (s.a.w.)?",
      options: ['Bismillah', 'Iqra (Read!)', 'Alhamdulillah', 'Allahu Akbar'], correctAnswer: "Iqra (Read!)",
      explanation: "The first word of revelation was 'Iqra' — meaning 'Read!' or 'Recite!' — from Surah al-Alaq, the first surah revealed." },
    { unitId: unit7.id, externalId: 'maktab-2-wahy-q3', type: 'TRUE_FALSE',
      questionText: "Jibra'il (a.s.) appeared to Rasulullah (s.a.w.) and embraced him tightly three times before reciting the revelation.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Jibra'il (a.s.) came to Rasulullah (s.a.w.) in Cave Hira' and embraced him tightly three times, each time commanding 'Iqra (Read!)' before reciting the revelation." },
    { unitId: unit7.id, externalId: 'maktab-2-wahy-q4', type: 'MULTIPLE_CHOICE',
      questionText: "How old was Rasulullah (s.a.w.) when the first revelation came to him?",
      options: ['25', '30', '35', '40'], correctAnswer: '40',
      explanation: "Rasulullah (s.a.w.) was 40 years old when he received the first revelation in Cave Hira'." },
    { unitId: unit7.id, externalId: 'maktab-2-wahy-q5', type: 'MULTIPLE_CHOICE',
      questionText: "Who was the first to believe in Rasulullah (s.a.w.) after the first revelation?",
      options: ['Abu Bakr (r.a.)', "Ali ibn Abi Talib (r.a.)", 'Khadijah (r.a.)', 'Waraqah ibn Nawfal'],
      correctAnswer: 'Khadijah (r.a.)',
      explanation: "Khadijah (r.a.) was the first person to believe in Rasulullah (s.a.w.) after the first revelation. She comforted him and took him to Waraqah ibn Nawfal." },
    { unitId: unit7.id, externalId: 'maktab-2-wahy-q6', type: 'TRUE_FALSE',
      questionText: "Waraqah ibn Nawfal was a Christian scholar who confirmed that what Muhammad (s.a.w.) experienced was true prophethood.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Waraqah ibn Nawfal, the cousin of Khadijah (r.a.), was an elderly Christian scholar. He confirmed that Rasulullah (s.a.w.) had received revelation from the same angel (Jibra'il) who came to Musa (a.s.)." },

    // Unit 8: Prophet Hud
    { unitId: unit8.id, externalId: 'maktab-2-hud-q1', type: 'MULTIPLE_CHOICE',
      questionText: "To which people was Prophet Hud (a.s.) sent?",
      options: ["The people of Thamud", "The people of 'Ad", "The people of Madyan", "The people of Babylon"],
      correctAnswer: "The people of 'Ad",
      explanation: "Prophet Hud (a.s.) was sent to the people of 'Ad, who lived in the region of Ahqaf in southern Arabia." },
    { unitId: unit8.id, externalId: 'maktab-2-hud-q2', type: 'TRUE_FALSE',
      questionText: "The people of 'Ad were known for their great physical strength and tall stature.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "The people of 'Ad were described as tall, powerful, and strong. They built magnificent structures and were proud of their physical superiority." },
    { unitId: unit8.id, externalId: 'maktab-2-hud-q3', type: 'MULTIPLE_CHOICE',
      questionText: "What was the main sin of the people of 'Ad?",
      options: ['Stealing', 'Refusing to pay Zakah', 'Arrogance and worshipping idols instead of Allah', 'Fighting in battles'],
      correctAnswer: 'Arrogance and worshipping idols instead of Allah',
      explanation: "The people of 'Ad were arrogant, rejected Hud (a.s.), and worshipped idols. They said: 'Who is mightier than us in power?'" },
    { unitId: unit8.id, externalId: 'maktab-2-hud-q4', type: 'MULTIPLE_CHOICE',
      questionText: "How were the people of 'Ad punished?",
      options: ['They were flooded with water', 'A devastating wind blew for 7 nights and 8 days destroying everything', 'A thunderbolt struck them', 'They were defeated in battle'],
      correctAnswer: 'A devastating wind blew for 7 nights and 8 days destroying everything',
      explanation: "Allah sent a furious howling wind that blew for 7 nights and 8 days, destroying everything in its path, including the people of 'Ad." },
    { unitId: unit8.id, externalId: 'maktab-2-hud-q5', type: 'TRUE_FALSE',
      questionText: "Prophet Hud (a.s.) called his people to believe in only one God (tawhid).",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Like all prophets, Hud (a.s.) called his people to tawhid — the belief in the oneness of Allah. But the people of 'Ad refused." },
    { unitId: unit8.id, externalId: 'maktab-2-hud-q6', type: 'MULTIPLE_CHOICE',
      questionText: "What is the lesson we learn from the story of Prophet Hud (a.s.) and the people of 'Ad?",
      options: ['Physical strength protects us from Allah', 'Wealth guarantees success in life', 'Arrogance and rejecting Allah leads to destruction', 'It is okay to worship idols as long as you are kind'],
      correctAnswer: 'Arrogance and rejecting Allah leads to destruction',
      explanation: "The people of 'Ad had great strength and wealth but their arrogance and rejection of Allah led to their complete destruction. True power belongs to Allah alone." },

    // Unit 9: Prophet Salih
    { unitId: unit9.id, externalId: 'maktab-2-salih-q1', type: 'MULTIPLE_CHOICE',
      questionText: "To which people was Prophet Salih (a.s.) sent?",
      options: ["The people of 'Ad", "The people of Thamud", "The people of Lut", "The people of Madyan"],
      correctAnswer: "The people of Thamud",
      explanation: "Prophet Salih (a.s.) was sent to the people of Thamud, who lived in Arabia Petraea and carved their homes into the mountains." },
    { unitId: unit9.id, externalId: 'maktab-2-salih-q2', type: 'TRUE_FALSE',
      questionText: "The people of Thamud carved their homes into mountains.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "The people of Thamud were skilled builders who carved magnificent homes and structures out of the mountains." },
    { unitId: unit9.id, externalId: 'maktab-2-salih-q3', type: 'MULTIPLE_CHOICE',
      questionText: "What miraculous sign did Allah give to the people of Thamud through Salih (a.s.)?",
      options: ['A golden palace', 'Fire from the sky', 'A special she-camel that emerged from a rock', 'Rain after a drought'],
      correctAnswer: 'A special she-camel that emerged from a rock',
      explanation: "Allah sent a special she-camel as a sign. She would drink from the water on one day, and on the next day the water was for the people." },
    { unitId: unit9.id, externalId: 'maktab-2-salih-q4', type: 'MULTIPLE_CHOICE',
      questionText: "What did the people of Thamud do with the she-camel?",
      options: ['They honoured and protected her', 'They killed her', 'They chased her away', 'They offered her as a sacrifice to Allah'],
      correctAnswer: 'They killed her',
      explanation: "Three men from Thamud disobeyed the command of Allah and slaughtered the she-camel, bringing punishment upon the entire nation." },
    { unitId: unit9.id, externalId: 'maktab-2-salih-q5', type: 'TRUE_FALSE',
      questionText: "After the she-camel was killed, Allah gave the people of Thamud 3 days' warning before the punishment.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Salih (a.s.) warned them: 'Enjoy yourselves for three more days, then the punishment will come.' On the fourth day, a mighty blast/thunderbolt destroyed them all." },
    { unitId: unit9.id, externalId: 'maktab-2-salih-q6', type: 'MULTIPLE_CHOICE',
      questionText: "How were the people of Thamud punished?",
      options: ['They drowned in a flood', 'A mighty thunderbolt/blast destroyed them all', 'Wind swept them away', 'They were turned to stone'],
      correctAnswer: 'A mighty thunderbolt/blast destroyed them all',
      explanation: "A mighty thunderbolt (sayhah — a terrifying scream/blast) descended upon the people of Thamud and destroyed them completely." },

    // Unit 10: Angels
    { unitId: unit10.id, externalId: 'maktab-2-angels-q1', type: 'MULTIPLE_CHOICE',
      questionText: "From what are angels created?",
      options: ['Fire', 'Earth/clay', 'Light (nur)', 'Water'], correctAnswer: 'Light (nur)',
      explanation: "Angels are created from light (nur). This is mentioned in the hadith of Rasulullah (s.a.w.)." },
    { unitId: unit10.id, externalId: 'maktab-2-angels-q2', type: 'TRUE_FALSE',
      questionText: "Angels eat, drink, and sleep just like humans.",
      options: ['True', 'False'], correctAnswer: 'False',
      explanation: "Angels do not eat, drink, sleep, or get tired. They worship Allah continuously without any needs." },
    { unitId: unit10.id, externalId: 'maktab-2-angels-q3', type: 'MULTIPLE_CHOICE',
      questionText: "Which angel is responsible for bringing revelation (wahy) to the prophets?",
      options: ['Mika'il', 'Israfil', "Jibra'il", 'Azra'il'], correctAnswer: "Jibra'il",
      explanation: "Jibra'il (a.s.) — also known as the Holy Spirit — is the angel responsible for delivering revelation (wahy) from Allah to the prophets." },
    { unitId: unit10.id, externalId: 'maktab-2-angels-q4', type: 'MULTIPLE_CHOICE',
      questionText: "Which angel will blow the trumpet on the Day of Judgment?",
      options: ['Jibra'il', 'Mika'il', 'Israfil', 'Azra'il'], correctAnswer: 'Israfil',
      explanation: "Israfil (a.s.) is the angel who will blow the Trumpet (Sur) to signal the beginning of the Day of Judgment." },
    { unitId: unit10.id, externalId: 'maktab-2-angels-q5', type: 'TRUE_FALSE',
      questionText: "Angels always obey Allah and never disobey Him.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Angels are created in a state of perfect obedience. They never disobey Allah and carry out His commands at all times." },
    { unitId: unit10.id, externalId: 'maktab-2-angels-q6', type: 'MULTIPLE_CHOICE',
      questionText: "What is the duty of the Kiraman Katibin?",
      options: ['Deliver rain and sustenance', 'Take the souls of the dying', 'Record all the deeds of every human', 'Blow the trumpet on Judgment Day'],
      correctAnswer: 'Record all the deeds of every human',
      explanation: "Kiraman Katibin means 'Noble Recorders' — two angels assigned to every person to record their good and bad deeds." },

    // Unit 11: Divine Books
    { unitId: unit11.id, externalId: 'maktab-2-books-q1', type: 'MULTIPLE_CHOICE',
      questionText: "Which book was revealed to Prophet Musa (a.s.)?",
      options: ['Zabur', 'Tawrah', 'Injil', 'Quran'], correctAnswer: 'Tawrah',
      explanation: "The Tawrah (Torah) was revealed to Prophet Musa (Moses) (a.s.) to guide the Children of Israel." },
    { unitId: unit11.id, externalId: 'maktab-2-books-q2', type: 'MULTIPLE_CHOICE',
      questionText: "To which prophet was the Zabur revealed?",
      options: ['Isa (a.s.)', 'Ibrahim (a.s.)', 'Dawud (a.s.)', 'Musa (a.s.)'], correctAnswer: 'Dawud (a.s.)',
      explanation: "The Zabur (Psalms) was revealed to Prophet Dawud (David) (a.s.)." },
    { unitId: unit11.id, externalId: 'maktab-2-books-q3', type: 'TRUE_FALSE',
      questionText: "The Quran is the final and last book revealed by Allah, and it is protected from any changes.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Allah revealed the Quran to Rasulullah (s.a.w.) as the final divine book. Allah Himself has promised to protect it from any changes or alterations." },
    { unitId: unit11.id, externalId: 'maktab-2-books-q4', type: 'MULTIPLE_CHOICE',
      questionText: "The Injil was revealed to which prophet?",
      options: ['Isa (a.s.)', 'Yahya (a.s.)', 'Ibrahim (a.s.)', 'Musa (a.s.)'], correctAnswer: 'Isa (a.s.)',
      explanation: "The Injil (Gospel) was revealed to Prophet Isa (Jesus) (a.s.) as guidance for his people." },
    { unitId: unit11.id, externalId: 'maktab-2-books-q5', type: 'TRUE_FALSE',
      questionText: "The original texts of the Tawrah and Injil were changed and altered by people over time.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Unlike the Quran, the original Tawrah and Injil were not protected from human changes and alterations, which is why the Quran was sent as the final, preserved guidance." },
    { unitId: unit11.id, externalId: 'maktab-2-books-q6', type: 'MULTIPLE_CHOICE',
      questionText: "How many main divine books are Muslims required to believe in?",
      options: ['2', '3', '4', '5'], correctAnswer: '4',
      explanation: "Muslims must believe in the four main divine books: the Tawrah, Zabur, Injil, and the Quran." },

    // Unit 12: Promises & Gratitude
    { unitId: unit12.id, externalId: 'maktab-2-promise-q1', type: 'TRUE_FALSE',
      questionText: "Breaking a promise without a valid reason is a sign of hypocrisy.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "The Prophet (s.a.w.) mentioned that breaking a promise is one of the three signs of a hypocrite. A true believer keeps their word." },
    { unitId: unit12.id, externalId: 'maktab-2-promise-q2', type: 'MULTIPLE_CHOICE',
      questionText: "What does 'shukr' mean?",
      options: ['Prayer', 'Gratitude and thankfulness', 'Patience', 'Charity'],
      correctAnswer: 'Gratitude and thankfulness',
      explanation: "Shukr means gratitude — thanking Allah for His blessings by heart, tongue, and actions." },
    { unitId: unit12.id, externalId: 'maktab-2-promise-q3', type: 'MULTIPLE_CHOICE',
      questionText: "According to Surah Ibrahim (14:7), what does Allah promise if we show gratitude?",
      options: ['He will give us paradise immediately', 'He will increase our blessings', 'He will forgive all sins', 'He will protect us from harm'],
      correctAnswer: 'He will increase our blessings',
      explanation: "Allah says in the Quran (Ibrahim 14:7): 'If you are grateful, I will surely increase you (in blessings).' Showing shukr brings more blessings from Allah." },
    { unitId: unit12.id, externalId: 'maktab-2-promise-q4', type: 'TRUE_FALSE',
      questionText: "Gratitude can only be shown by saying 'Alhamdulillah' — it has no other forms.",
      options: ['True', 'False'], correctAnswer: 'False',
      explanation: "Shukr (gratitude) has three forms: by heart (recognising Allah's favour), by tongue (saying Alhamdulillah), and by actions (using Allah's gifts in obedience to Him)." },
    { unitId: unit12.id, externalId: 'maktab-2-promise-q5', type: 'MULTIPLE_CHOICE',
      questionText: "What Arabic phrase do Muslims say to thank Allah?",
      options: ['Subhanallah', 'Alhamdulillah', 'Bismillah', 'Allahu Akbar'], correctAnswer: 'Alhamdulillah',
      explanation: "'Alhamdulillah' means 'All praise is due to Allah' and is the expression of shukr (gratitude) on the tongue." },
    { unitId: unit12.id, externalId: 'maktab-2-promise-q6', type: 'MULTIPLE_CHOICE',
      questionText: "How many signs of hypocrisy are mentioned in the famous hadith?",
      options: ['2', '3', '4', '5'], correctAnswer: '3',
      explanation: "The Prophet (s.a.w.) mentioned three signs of a hypocrite: when they speak they lie, when they promise they break it, and when they are trusted they betray." },

    // Unit 13: Salam & Kindness
    { unitId: unit13.id, externalId: 'maktab-2-salaam-q1', type: 'MULTIPLE_CHOICE',
      questionText: "Why is spreading salam (the Islamic greeting) considered a charity?",
      options: ['It costs money', 'Because the Prophet said it is worth 10 good deeds', 'Because it spreads peace and love among Muslims at no cost', 'Because it replaces prayer'],
      correctAnswer: 'Because it spreads peace and love among Muslims at no cost',
      explanation: "The Prophet (s.a.w.) said spreading salam is a charity — it costs nothing but brings blessings, peace, and love between Muslims." },
    { unitId: unit13.id, externalId: 'maktab-2-salaam-q2', type: 'TRUE_FALSE',
      questionText: "Ta'awun means helping others in all matters, including sinful activities.",
      options: ['True', 'False'], correctAnswer: 'False',
      explanation: "Ta'awun means cooperation in goodness only. Allah says in Surah al-Ma'idah (2:2): 'Help one another in righteousness and piety, but do not help one another in sin and aggression.'" },
    { unitId: unit13.id, externalId: 'maktab-2-salaam-q3', type: 'MULTIPLE_CHOICE',
      questionText: "In the story about kindness to animals, what did the woman do that earned her entry into Jannah?",
      options: ['She fed a cat', 'She gave water to a thirsty dog', 'She freed a caged bird', 'She helped an injured horse'],
      correctAnswer: 'She gave water to a thirsty dog',
      explanation: "A sinful woman gave water to a desperately thirsty dog from a well. Because of this single act of mercy, Allah forgave her and she entered Jannah." },
    { unitId: unit13.id, externalId: 'maktab-2-salaam-q4', type: 'MULTIPLE_CHOICE',
      questionText: "In another story, a woman entered Hellfire because of how she treated her cat. What did she do?",
      options: ['She accidentally hurt the cat', 'She locked the cat up without feeding or freeing it until it died', 'She gave the cat to someone else', 'She kept too many cats'],
      correctAnswer: 'She locked the cat up without feeding or freeing it until it died',
      explanation: "A woman imprisoned her cat without food or water, not letting it go to find its own food. Because of her cruelty, she was punished." },
    { unitId: unit13.id, externalId: 'maktab-2-salaam-q5', type: 'TRUE_FALSE',
      questionText: "Giving salam only to people you know is the sunnah.",
      options: ['True', 'False'], correctAnswer: 'False',
      explanation: "A companion asked the Prophet (s.a.w.) about the best deed. He said to give salam to everyone — those you know and those you do not know." },
    { unitId: unit13.id, externalId: 'maktab-2-salaam-q6', type: 'MULTIPLE_CHOICE',
      questionText: "Which Quranic surah and ayah tells us to cooperate in goodness but not in sin?",
      options: ['Al-Baqarah 2:255', "Al-Ma'idah 5:2", 'Al-Ikhlas 112:1', 'Al-Fatiha 1:5'],
      correctAnswer: "Al-Ma'idah 5:2",
      explanation: "Surah al-Ma'idah, Ayah 2 tells Muslims: 'Help one another in righteousness and piety, but do not help one another in sin and transgression.'" },

    // Unit 14: Adab
    { unitId: unit14.id, externalId: 'maktab-2-adab-q1', type: 'MULTIPLE_CHOICE',
      questionText: "What is the full greeting of salaam?",
      options: ["'Assalamu Alaykum'", "'Assalamu Alaykum wa Rahmatullahi wa Barakatuh'", "'Peace be upon you'", "'Wa Alaykum Assalam'"],
      correctAnswer: "'Assalamu Alaykum wa Rahmatullahi wa Barakatuh'",
      explanation: "The full greeting is 'Assalamu Alaykum wa Rahmatullahi wa Barakatuh' — 'May the peace, mercy, and blessings of Allah be upon you.'" },
    { unitId: unit14.id, externalId: 'maktab-2-adab-q2', type: 'MULTIPLE_CHOICE',
      questionText: "What should a Muslim say when they sneeze?",
      options: ['Subhanallah', 'Alhamdulillah', 'Bismillah', 'Allahu Akbar'], correctAnswer: 'Alhamdulillah',
      explanation: "When a Muslim sneezes, they should say 'Alhamdulillah' (All praise is due to Allah)." },
    { unitId: unit14.id, externalId: 'maktab-2-adab-q3', type: 'MULTIPLE_CHOICE',
      questionText: "When someone sneezes and says 'Alhamdulillah', what should you say in response?",
      options: ['Alhamdulillah', 'Yarhamukallah', 'Subhanallah', 'Bismillah'], correctAnswer: 'Yarhamukallah',
      explanation: "'Yarhamukallah' means 'May Allah have mercy on you.' This is the sunnah response when someone sneezes and says Alhamdulillah." },
    { unitId: unit14.id, externalId: 'maktab-2-adab-q4', type: 'TRUE_FALSE',
      questionText: "When yawning, a Muslim should open their mouth widely and yawn loudly.",
      options: ['True', 'False'], correctAnswer: 'False',
      explanation: "The sunnah is to suppress yawning as much as possible and to cover the mouth. The Prophet (s.a.w.) said yawning is from Shaytan and one should try to hold it back." },
    { unitId: unit14.id, externalId: 'maktab-2-adab-q5', type: 'MULTIPLE_CHOICE',
      questionText: "What is the correct reply after someone says 'Yarhamukallah' to you?",
      options: ['Jazakallahu Khayran', 'Yahdikumullahu wa Yuslihu Balakum', 'Alhamdulillah', 'Ameen'],
      correctAnswer: 'Yahdikumullahu wa Yuslihu Balakum',
      explanation: "'Yahdikumullahu wa Yuslihu Balakum' means 'May Allah guide you and set your affairs right.' This is the reply after Yarhamukallah." },
    { unitId: unit14.id, externalId: 'maktab-2-adab-q6', type: 'TRUE_FALSE',
      questionText: "Good speaking etiquette includes listening attentively and not interrupting others when they are speaking.",
      options: ['True', 'False'], correctAnswer: 'True',
      explanation: "Islam teaches us to listen carefully when others speak, not to interrupt, to speak gently and softly, and to give the speaker their full attention." },
  ];

  // ── Upsert quiz questions ──
  for (const q of quizData) {
    await prisma.question.upsert({
      where: { externalId: q.externalId },
      update: {
        questionText: q.questionText,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
      create: {
        externalId: q.externalId,
        unitId: q.unitId,
        courseId: course.id,
        questionText: q.questionText,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'MEDIUM',
        orderIndex: quizData.filter(x => x.unitId === q.unitId).indexOf(q),
      },
    });
  }
  console.log(`✅ Questions upserted: ${quizData.length}`);

  // ══════════════════════════════════════════════
  // FLASHCARDS -- 21 cards total
  // ══════════════════════════════════════════════

  await prisma.flashCard.deleteMany({ where: { courseId: course.id } });

  const flashCardData = [
    { front: "Fara'id of Wudu'", back: "The 4 obligatory acts: washing the face, washing both arms to the elbows, wiping a quarter of the head, washing both feet to the ankles." },
    { front: "Nawaqid of Wudu'", back: "Acts that break wudu': passing wind, urine or stool, deep sleep, bleeding, losing consciousness." },
    { front: "Tayammum", back: "Dry ablution using clean earth/dust/stone when water is unavailable or harmful — strikes twice: once for face, once for arms to elbows." },
    { front: "Five Daily Prayers", back: "Fajr (2), Zuhr (4), Asr (4), Maghrib (3), Isha' (4) rak'at — obligatory for every Muslim." },
    { front: "Conditions of Salah", back: "Taharah (purity), covering awrah, facing the Qiblah, making intention (niyyah), and praying at the correct time." },
    { front: "Al-Amin", back: "'The Trustworthy One' — title given to Rasulullah (s.a.w.) by the people of Makkah before prophethood for his complete honesty." },
    { front: "Al-Sadiq", back: "'The Truthful One' — another title of Rasulullah (s.a.w.) because he never told a lie throughout his life." },
    { front: "Hilf al-Fudul", back: "A noble pre-Islamic alliance in Makkah in which tribal leaders, including Rasulullah (s.a.w.), pledged to defend the rights of the oppressed." },
    { front: "Wahy", back: "Divine revelation sent by Allah to His prophets through the angel Jibra'il (a.s.). The Quran is the final wahy." },
    { front: "Cave Hira'", back: "The cave on Mount Nur near Makkah where Rasulullah (s.a.w.) used to retreat for worship; site of the first revelation." },
    { front: "People of 'Ad", back: "The tall, powerful nation in southern Arabia sent Prophet Hud (a.s.). They were destroyed by a fierce wind for 7 nights and 8 days." },
    { front: "People of Thamud", back: "The nation who carved homes in mountains, sent Prophet Salih (a.s.). Destroyed by a thunderbolt after killing the miraculous she-camel." },
    { front: "Mala'ikah (Angels)", back: "Created from light (nur), they never disobey Allah, do not eat or sleep, and carry out Allah's commands at all times." },
    { front: "Jibra'il (a.s.)", back: "The archangel responsible for delivering Allah's revelation (wahy) to the prophets. Also called Ruh al-Amin." },
    { front: "Kiraman Katibin", back: "'Noble Recorders' — two angels assigned to every person to record all their good and bad deeds." },
    { front: "Al-Kutub al-Arba'ah", back: "The four main divine books: Tawrah (Musa), Zabur (Dawud), Injil (Isa), and the Quran (Muhammad s.a.w.)." },
    { front: "Shukr", back: "Gratitude to Allah — shown in three ways: by heart (recognising His favour), by tongue (Alhamdulillah), and by action (using His gifts obediently)." },
    { front: "Ta'awun", back: "Cooperation and mutual help — in Islam, only permitted in righteousness and piety, not in sin (Surah al-Ma'idah 5:2)." },
    { front: "Assalamu Alaykum", back: "'Peace be upon you' — the full greeting is 'Assalamu Alaykum wa Rahmatullahi wa Barakatuh.' A sunnah to spread to all Muslims." },
    { front: "Yarhamukallah", back: "'May Allah have mercy on you' — said in response when someone sneezes and says Alhamdulillah." },
    { front: "Yahdikumullahu wa Yuslihu Balakum", back: "'May Allah guide you and set your affairs right' — the reply after someone says Yarhamukallah to you after sneezing." },
  ];

  for (const fc of flashCardData) {
    await prisma.flashCard.create({
      data: {
        courseId: course.id,
        front: fc.front,
        back: fc.back,
        category: 'Vocabulary',
        tags: ['maktab-2'],
      },
    });
  }
  console.log(`✅ FlashCards created: ${flashCardData.length}`);

  // ══════════════════════════════════════════════
  // ARABIC TERMS -- 15 total
  // ══════════════════════════════════════════════

  const arabicTermsData: Array<{
    unitId: string;
    arabicText: string;
    transliteration: string;
    translation: string;
  }> = [
    { unitId: unit1.id, arabicText: 'فَرَائِض', transliteration: "Fara'id", translation: 'Obligatory acts — the compulsory acts of wudu without which it is invalid' },
    { unitId: unit1.id, arabicText: 'نَوَاقِض', transliteration: "Nawaqid", translation: "Nullifiers — acts that break and invalidate wudu'" },
    { unitId: unit2.id, arabicText: 'تَيَمُّم', transliteration: 'Tayammum', translation: 'Dry ablution using clean earth — performed when water is unavailable or harmful' },
    { unitId: unit3.id, arabicText: 'صَلَاة', transliteration: 'Salah', translation: 'The Islamic ritual prayer — the second pillar of Islam, performed five times daily' },
    { unitId: unit3.id, arabicText: 'قِبْلَة', transliteration: 'Qiblah', translation: "The direction of the Ka'bah in Makkah — the direction Muslims face during prayer" },
    { unitId: unit4.id, arabicText: 'الْأَمِين', transliteration: 'Al-Amin', translation: "The Trustworthy One — the honourable title given to Rasulullah (s.a.w.) by the people of Makkah" },
    { unitId: unit6.id, arabicText: 'حِلْف الفُضُول', transliteration: 'Hilf al-Fudul', translation: 'The Alliance of Virtue — a pre-Islamic pact to protect the rights of the oppressed in Makkah' },
    { unitId: unit7.id, arabicText: 'وَحْي', transliteration: 'Wahy', translation: "Divine revelation sent by Allah to His prophets — the Quran is the final wahy" },
    { unitId: unit8.id, arabicText: 'عَاد', transliteration: "'Ad", translation: "The ancient powerful nation in southern Arabia, sent Prophet Hud (a.s.) — destroyed by a fierce wind" },
    { unitId: unit9.id, arabicText: 'ثَمُود', transliteration: 'Thamud', translation: "The ancient nation who carved homes in mountains, sent Prophet Salih (a.s.) — destroyed by a thunderbolt" },
    { unitId: unit10.id, arabicText: 'مَلَائِكَة', transliteration: "Mala'ikah", translation: 'Angels — created from light (nur), they continuously worship and obey Allah without any needs' },
    { unitId: unit11.id, arabicText: 'التَّوْرَاة', transliteration: 'Al-Tawrah', translation: 'The Torah — the divine book revealed to Prophet Musa (Moses) (a.s.) for the Children of Israel' },
    { unitId: unit12.id, arabicText: 'شُكْر', transliteration: 'Shukr', translation: "Gratitude — thanking Allah by heart, tongue (Alhamdulillah), and actions" },
    { unitId: unit13.id, arabicText: 'تَعَاوُن', transliteration: "Ta'awun", translation: 'Mutual cooperation and helping one another — in Islam only permitted in righteousness, not sin' },
    { unitId: unit14.id, arabicText: 'السَّلَامُ عَلَيْكُم', transliteration: 'Assalamu Alaykum', translation: "'Peace be upon you' — the Islamic greeting, a sunnah to give to all Muslims" },
  ];

  for (const { unitId, ...termData } of arabicTermsData) {
    await prisma.arabicTerm.deleteMany({ where: { unitId } });
    await prisma.arabicTerm.create({ data: { unitId, ...termData } });
  }
  console.log(`✅ ArabicTerms created: ${arabicTermsData.length}`);

  // ── Summary ──
  console.log('\n🎉 Maktab Coursebook 2 seed complete!');
  console.log(`   Units:        14`);
  console.log(`   Questions:    ${quizData.length}`);
  console.log(`   FlashCards:   ${flashCardData.length}`);
  console.log(`   ArabicTerms:  ${arabicTermsData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
