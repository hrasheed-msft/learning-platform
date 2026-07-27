import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 1 — Islamic Curriculum Seed (Restructured)
 * Source: An Nasihah Publications, Age Range: 6–7 years
 *
 * 12 focused units — each covering exactly ONE main topic.
 * Subjects: Fiqh (2), Ahadith (2), Sirah (2), Tarikh (2),
 *           Aqaid (1), Akhlaq (2), Adab (1)
 */

export async function seedMaktabCoursebook1() {
  console.log('📚 Starting Maktab Coursebook 1 seed...');
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
    where: { slug: 'maktab-coursebook-1' },
    create: {
      slug: 'maktab-coursebook-1',
      title: 'Maktab Coursebook 1',
      description: 'A beginner Islamic curriculum for young learners aged 6-7 years. Covers the five pillars of Islam, taharah and wudu, key ahadith on character and behaviour, the early life and youth of Rasulullah SAW, stories of the prophets Adam and Nuh alayhim al-salam, the seven articles of faith, akhlaq on respect, cleanliness, speech and smiling, and daily Islamic etiquette for eating, drinking, sleeping and waking. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['EARLY_CHILD', 'CHILD'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 1',
      description: 'A beginner Islamic curriculum for young learners aged 6-7 years. Covers the five pillars of Islam, taharah and wudu, key ahadith on character and behaviour, the early life and youth of Rasulullah SAW, stories of the prophets Adam and Nuh alayhim al-salam, the seven articles of faith, akhlaq on respect, cleanliness, speech and smiling, and daily Islamic etiquette for eating, drinking, sleeping and waking. Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['EARLY_CHILD', 'CHILD'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // CLEANUP: Remove deprecated broad-subject units
  // (old 7-unit schema replaced by 12 focused units)
  // ──────────────────────────────────────────────
  const oldSlugs = ['maktab-1-fiqh','maktab-1-ahadith','maktab-1-sirah','maktab-1-tarikh','maktab-1-aqaid','maktab-1-akhlaq','maktab-1-adab'];
  for (const slug of oldSlugs) {
    const old = await prisma.unit.findFirst({ where: { courseId: course.id, slug } });
    if (old) {
      await prisma.question.deleteMany({ where: { unitId: old.id } });
      await prisma.unitProgress.deleteMany({ where: { unitId: old.id } });
      await prisma.unit.delete({ where: { id: old.id } });
    }
  }

  // ==============================================================
  // FIQH UNITS (2)
  // ==============================================================

  // ──────────────────────────────────────────────
  // UNIT 1: FIQH — The Five Pillars of Islam
  // ──────────────────────────────────────────────

  const pillarsContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will be able to name all five pillars of Islam and explain what each one means.</p>

<h2>The Five Pillars of Islam</h2>
<p>Imagine a house with very strong walls. No matter how much it rains or how windy it is, the house stays strong. Just like this strong house, Islam has five strong pillars. If we keep these pillars in our life, our Islam will never fall down!</p>

<h3>1. Shahadah — Declaration of Faith</h3>
<p>The shahadah is the first and most important pillar of Islam.</p>
<p>We believe and say: <strong>"There is no god but Allah, and Muhammad (peace be upon him) is His servant and messenger."</strong></p>
<p>When a person says the shahadah with full belief in their heart, they are a Muslim.</p>

<h3>2. Salah — Prayer</h3>
<p>Salah is the second pillar. It means praying to Allah five times every day.</p>
<p>The five daily prayers are:</p>
<ul>
  <li><strong>Fajr</strong> — in the morning</li>
  <li><strong>Zuhr</strong> — after midday</li>
  <li><strong>Asr</strong> — in the afternoon</li>
  <li><strong>Maghrib</strong> — when the sun goes down</li>
  <li><strong>Isha</strong> — before we sleep</li>
</ul>
<p>Salah is a special gift from Allah. It is how we talk to Allah and thank Him every day.</p>

<h3>3. Zakah — Charity</h3>
<p>Zakah is the third pillar. It means giving some of our money to people who need help.</p>
<p>Allah told us to give zakah once a year. Zakah teaches us to care and to share. When we give to others, Allah is pleased with us and gives us even more blessings!</p>

<h3>4. Sawm — Fasting</h3>
<p>Sawm is the fourth pillar. It means not eating or drinking during the day in the blessed month of Ramadan.</p>
<p>Fasting teaches us how poor people feel when they are hungry. It also teaches us to be thankful to Allah for all our food and drink.</p>

<h3>5. Hajj — Pilgrimage</h3>
<p>Hajj is the fifth and final pillar. It is a special journey to the holy city of Makkah.</p>
<p>Every Muslim who is able and has enough money must do Hajj at least once in their life.</p>
<p>In Makkah there is a special building called the <strong>Ka'bah</strong>. We face the Ka'bah when we pray. During Hajj, we walk around it seven times — this is called tawaf.</p>
`.trim();

  const unitPillars = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-fiqh-pillars' } },
    create: {
      slug: 'maktab-1-fiqh-pillars',
      courseId: course.id,
      orderIndex: 1,
      title: 'Fiqh \u2014 The Five Pillars of Islam',
      description: 'The five pillars of Islam: Shahadah (declaration of faith), Salah (five daily prayers), Zakah (charity), Sawm (fasting in Ramadan), and Hajj (pilgrimage to Makkah). Simple explanation for age 6-7.',
      content: pillarsContent,
    },
    update: {
      title: 'Fiqh \u2014 The Five Pillars of Islam',
      description: 'The five pillars of Islam: Shahadah (declaration of faith), Salah (five daily prayers), Zakah (charity), Sawm (fasting in Ramadan), and Hajj (pilgrimage to Makkah). Simple explanation for age 6-7.',
      content: pillarsContent,
    },
  });

  console.log('✅ Unit 1:', unitPillars.title);

  // ──────────────────────────────────────────────
  // UNIT 2: FIQH — Taharah & Wudu
  // ──────────────────────────────────────────────

  const taharaContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will know the meaning of taharah, be able to perform wudu step by step, and know what breaks wudu.</p>

<h2>Taharah — Cleanliness</h2>
<p>Taharah means to be clean and pure. Allah loves people who are clean. Before we pray salah, we must have taharah. We make taharah by doing <strong>wudu</strong> — a special way of washing that Allah taught us.</p>
<p>Rasulullah (peace be upon him) said: whoever does wudu properly, his face, hands and feet will shine brightly on the Day of Judgement.</p>

<h2>How to Do Wudu — Step by Step</h2>
<ol>
  <li>Make the intention in your heart and say <strong>Bismillah</strong>.</li>
  <li>Wash both hands up to the wrist — three times.</li>
  <li>Rinse your mouth — three times.</li>
  <li>Rinse your nose — three times.</li>
  <li>Wash your whole face — three times, from the hairline to the chin.</li>
  <li>Wash both arms to the elbows — three times, right arm first.</li>
  <li>Wipe your head once with wet hands (masah).</li>
  <li>Clean both ears inside and outside.</li>
  <li>Wash both feet to the ankles — three times, right foot first.</li>
</ol>

<h3>Du'a After Wudu</h3>
<p>After finishing wudu, we say the shahadah:</p>
<p class="arabic" dir="rtl" lang="ar">&#x623;&#x634;&#x647;&#x62F; &#x623;&#x646; &#x644;&#x627; &#x625;&#x644;&#x670;&#x647; &#x625;&#x644;&#x651;&#x627; &#x627;&#x644;&#x644;&#x651;&#x647; &#x648;&#x623;&#x634;&#x647;&#x62F; &#x623;&#x646;&#x651; &#x645;&#x62D;&#x645;&#x651;&#x62F;&#x64B;&#x627; &#x639;&#x628;&#x62F;&#x647; &#x648;&#x631;&#x633;&#x648;&#x644;&#x647;</p>
<p>"I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger."</p>

<h3>What Breaks Wudu?</h3>
<p>Wudu is broken by:</p>
<ul>
  <li>Going to the toilet (urine or stool).</li>
  <li>Passing wind (gas).</li>
  <li>Falling into a deep sleep.</li>
</ul>
<p>If any of these happen, you must do wudu again before praying.</p>
`.trim();

  const unitTahara = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-fiqh-tahara-wudu' } },
    create: {
      slug: 'maktab-1-fiqh-tahara-wudu',
      courseId: course.id,
      orderIndex: 2,
      title: 'Fiqh \u2014 Taharah & Wudu',
      description: "The meaning of taharah (purity/cleanliness), step-by-step wudu (ablution) method, the du'a after wudu, and what breaks wudu (toilet, sleep, passing wind).",
      content: taharaContent,
    },
    update: {
      title: 'Fiqh \u2014 Taharah & Wudu',
      description: "The meaning of taharah (purity/cleanliness), step-by-step wudu (ablution) method, the du'a after wudu, and what breaks wudu (toilet, sleep, passing wind).",
      content: taharaContent,
    },
  });

  console.log('✅ Unit 2:', unitTahara.title);

  // ==============================================================
  // AHADITH UNITS (2)
  // ==============================================================

  // ──────────────────────────────────────────────
  // UNIT 3: AHADITH — What is a Hadith?
  // ──────────────────────────────────────────────

  const hadithIntroContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will know what a hadith is, who the hadiths come from, and why we follow them.</p>

<h2>What is a Hadith?</h2>
<p>A <strong>hadith</strong> is what our Beloved Messenger Rasulullah (peace be upon him) said, did himself, or did not say "no" to when he saw someone do it.</p>
<p>The plural of hadith is <strong>ahadith</strong>.</p>
<p>Hadiths are very important. They tell us how Rasulullah lived and what he taught us. We read hadiths in books collected by great scholars.</p>

<h2>Who is Rasulullah?</h2>
<p>Rasulullah (peace be upon him) means "the Messenger of Allah." His blessed name was <strong>Muhammad</strong>. He is our beloved Prophet — the best person who ever lived.</p>
<p>Allah chose Muhammad (peace be upon him) to be the last and final messenger for all people everywhere. He showed us the best way to live.</p>

<h2>Why Do We Follow Hadiths?</h2>
<p>Allah says in the Quran: <strong>"Obey Allah and obey the Messenger."</strong></p>
<p>When we follow a hadith, we are obeying Allah and following the example of Rasulullah (peace be upon him). This is how we show our love for them both.</p>
<p>Rasulullah (peace be upon him) is our guide for how to:</p>
<ul>
  <li>Pray salah correctly.</li>
  <li>Eat and drink with good manners.</li>
  <li>Speak kindly to others.</li>
  <li>Be a good Muslim every day.</li>
</ul>

<h2>A Simple Example</h2>
<p>Rasulullah (peace be upon him) said: <strong>"Say Bismillah before eating."</strong> This is a hadith. Because of this hadith, every Muslim says Bismillah before eating — following the beautiful example of Rasulullah (peace be upon him).</p>
`.trim();

  const unitHadithIntro = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-ahadith-intro' } },
    create: {
      slug: 'maktab-1-ahadith-intro',
      courseId: course.id,
      orderIndex: 3,
      title: 'Ahadith \u2014 What is a Hadith?',
      description: 'Definition of hadith (the words, actions and approvals of Rasulullah SAW), why we follow the hadith (the Quran says obey the Messenger), and the importance of Rasulullah SAW as our guide.',
      content: hadithIntroContent,
    },
    update: {
      title: 'Ahadith \u2014 What is a Hadith?',
      description: 'Definition of hadith (the words, actions and approvals of Rasulullah SAW), why we follow the hadith (the Quran says obey the Messenger), and the importance of Rasulullah SAW as our guide.',
      content: hadithIntroContent,
    },
  });

  console.log('✅ Unit 3:', unitHadithIntro.title);

  // ──────────────────────────────────────────────
  // UNIT 4: AHADITH — Feeding, Helping & Truthfulness
  // ──────────────────────────────────────────────

  const hadithCharContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will know three important ahadith of Rasulullah (peace be upon him) about feeding others, helping people, and speaking the truth.</p>

<h2>Hadith 1 — Feed the Hungry</h2>
<p><strong>"Feed the hungry and visit the sick."</strong> (Sahih al-Bukhari)</p>
<p>Allah has blessed us with food. Rasulullah (peace be upon him) is reminding us to share with those who are hungry. When we feed someone for the sake of Allah, we earn a great reward. Allah loves those who care for others.</p>

<h2>Hadith 2 — The Best of People</h2>
<p><strong>"The best of people are those who are most helpful to others."</strong> (al-Mu'jam al-Awsat)</p>
<p>Helping others makes us the best! Here are some ways you can help this week:</p>
<ul>
  <li>Help tidy your room.</li>
  <li>Help wash the dishes.</li>
  <li>Pick up litter you see on the ground.</li>
  <li>Explain a lesson to a friend who did not understand.</li>
</ul>

<h2>Hadith 3 — Speak the Truth</h2>
<p><strong>"Hold on to the truth."</strong> (Sahih Muslim)</p>
<p>Rasulullah (peace be upon him) taught us to always tell the truth. The truth leads us to Jannah — the beautiful garden in the next life. Lying is very bad and makes Allah unhappy.</p>
<p><strong>The Story of Abdul Qadir:</strong> A young boy named Abdul Qadir went to Baghdad to learn. His mother told him: "Always tell the truth!" One day, robbers stopped his group. They asked what he had. He told them the truth — he had forty gold coins — even though he could have hidden them. The robber leader was so shocked by his honesty that he began crying and changed his ways. Abdul Qadir grew up to become a great friend of Allah.</p>
`.trim();

  const unitHadithChar = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-ahadith-character' } },
    create: {
      slug: 'maktab-1-ahadith-character',
      courseId: course.id,
      orderIndex: 4,
      title: 'Ahadith \u2014 Feeding, Helping & Truthfulness',
      description: 'Three key ahadith for young Muslims: feeding the hungry (great reward), the best of people (most helpful to others), and holding on to the truth (leads to Jannah).',
      content: hadithCharContent,
    },
    update: {
      title: 'Ahadith \u2014 Feeding, Helping & Truthfulness',
      description: 'Three key ahadith for young Muslims: feeding the hungry (great reward), the best of people (most helpful to others), and holding on to the truth (leads to Jannah).',
      content: hadithCharContent,
    },
  });

  console.log('✅ Unit 4:', unitHadithChar.title);

  // ==============================================================
  // SIRAH UNITS (2)
  // ==============================================================

  // ──────────────────────────────────────────────
  // UNIT 5: SIRAH — Early Life of Rasulullah SAW
  // ──────────────────────────────────────────────

  const sirahEarlyContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will be able to recall key facts about the early life of Rasulullah (peace be upon him), from his birth to when his uncle Abu Talib became his guardian.</p>

<h2>Birth of Rasulullah (peace be upon him)</h2>
<p>Our Beloved Messenger Muhammad (peace be upon him) was born in the city of <strong>Makkah</strong>, early on a Monday morning in the month of Rabi al-Awwal.</p>
<p>The year he was born is called <strong>The Year of the Elephant</strong>. In that year, a man named Abrahah tried to attack the Ka'bah with elephants. Allah protected the Ka'bah by sending a flock of birds that dropped small stones, and Abrahah's whole army was destroyed!</p>

<h3>His Parents</h3>
<p>His father's name was <strong>Abdullah</strong>. Sadly, his father passed away before he was born. This means Rasulullah (peace be upon him) was an orphan from birth.</p>
<p>His mother's name was <strong>Aminah</strong>. She loved him very much.</p>

<h3>With Halimah in the Desert</h3>
<p>The Arabs had a lovely custom of sending their babies to live in the desert with a nurse, so they could grow up learning pure Arabic.</p>
<p>A kind lady named <strong>Halimah al-Sa'diyyah</strong> from the tribe of Banu Sa'd took baby Muhammad (peace be upon him) with her. Allah blessed Halimah greatly because of Rasulullah (peace be upon him) — her animals gave more milk and her weak camel became strong!</p>
<p>Rasulullah (peace be upon him) stayed with Halimah for about four years.</p>

<h3>Return to His Mother</h3>
<p>At the age of five, Muhammad (peace be upon him) returned to his mother Aminah in Makkah.</p>

<h3>Death of His Mother</h3>
<p>When Rasulullah (peace be upon him) was six years old, he went with his mother Aminah to visit relatives in Madinah. On the way back, his mother became ill and passed away at a place called <strong>Abwa</strong>.</p>
<p>A kind servant named Umm Ayman brought the young Muhammad (peace be upon him) safely back to Makkah.</p>

<h3>With His Grandfather Then His Uncle</h3>
<p>After his mother passed away, Rasulullah (peace be upon him) was raised by his grandfather, <strong>Abd al-Muttalib</strong>, the leader of Makkah. His grandfather loved him very dearly.</p>
<p>When Rasulullah (peace be upon him) was eight years old, his grandfather also passed away. After that, his uncle <strong>Abu Talib</strong> took care of him.</p>
`.trim();

  const unitSirahEarly = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-sirah-early-life' } },
    create: {
      slug: 'maktab-1-sirah-early-life',
      courseId: course.id,
      orderIndex: 5,
      title: 'Sirah \u2014 Early Life of Rasulullah SAW',
      description: "Birth of Rasulullah SAW in Makkah (Year of the Elephant), father Abdullah, mother Aminah, foster mother Halimah al-Sa'diyyah, death of his mother at age 6 in Abwa, guardianship by grandfather Abd al-Muttalib then uncle Abu Talib.",
      content: sirahEarlyContent,
    },
    update: {
      title: 'Sirah \u2014 Early Life of Rasulullah SAW',
      description: "Birth of Rasulullah SAW in Makkah (Year of the Elephant), father Abdullah, mother Aminah, foster mother Halimah al-Sa'diyyah, death of his mother at age 6 in Abwa, guardianship by grandfather Abd al-Muttalib then uncle Abu Talib.",
      content: sirahEarlyContent,
    },
  });

  console.log('✅ Unit 5:', unitSirahEarly.title);

  // ──────────────────────────────────────────────
  // UNIT 6: SIRAH — Youth & Marriage of Rasulullah SAW
  // ──────────────────────────────────────────────

  const sirahYouthContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will recall the journey to Syria, understand why the people called Rasulullah "Al-Amin", and describe his marriage to Khadijah (may Allah be pleased with her).</p>

<h2>Journey to Syria — Age 12</h2>
<p>When Rasulullah (peace be upon him) was twelve years old, he went with his uncle Abu Talib on a trading journey to Syria.</p>
<p>On the way, they passed a monk named <strong>Bahira</strong>. The monk had read in old books that a great prophet would come. When he saw Rasulullah (peace be upon him), he recognised the signs of prophethood. He told Abu Talib: "Your nephew will become the last messenger of Allah."</p>

<h2>Al-Amin — The Trustworthy</h2>
<p>As Muhammad (peace be upon him) grew up, everyone in Makkah could see his wonderful character. He was always honest and never lied. He was always kind and never hurt anyone.</p>
<p>The people of Makkah gave him two special titles:</p>
<ul>
  <li><strong>As-Sadiq</strong> — "The Most Honest"</li>
  <li><strong>Al-Amin</strong> — "The Most Trustworthy"</li>
</ul>
<p>Everyone trusted him so much that they would leave their precious belongings with him, knowing he would keep them safe.</p>

<h3>The Black Stone</h3>
<p>One day the Quraysh were rebuilding the Ka'bah. When it was time to put the Black Stone back in its place, every tribe wanted the honour. They argued until they agreed: whoever walked in next would decide. Rasulullah (peace be upon him) walked in first. He placed the stone in the middle of a cloth and asked one man from each tribe to hold an edge. He then lifted the stone into place — everyone was happy with his wisdom!</p>

<h2>Marriage to Khadijah (may Allah be pleased with her)</h2>
<p>In Makkah lived a noble and wealthy lady named <strong>Khadijah (may Allah be pleased with her)</strong>. When she heard about how honest and trustworthy Muhammad (peace be upon him) was, she asked him to lead a trading journey to Syria for her.</p>
<p>The journey was a great success. Khadijah was very impressed. She expressed her wish to marry him.</p>
<p>They married when Rasulullah (peace be upon him) was <strong>25 years old</strong>. Khadijah was 40. She was his greatest support throughout his life. Allah blessed them with four daughters and two sons.</p>
`.trim();

  const unitSirahYouth = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-sirah-youth-marriage' } },
    create: {
      slug: 'maktab-1-sirah-youth-marriage',
      courseId: course.id,
      orderIndex: 6,
      title: 'Sirah \u2014 Youth & Marriage of Rasulullah SAW',
      description: "Journey to Syria at age 12 and monk Bahira's prediction, the title Al-Amin (the Trustworthy) given by the Makkans, the Black Stone story, and marriage to Khadijah (may Allah be pleased with her) at age 25.",
      content: sirahYouthContent,
    },
    update: {
      title: 'Sirah \u2014 Youth & Marriage of Rasulullah SAW',
      description: "Journey to Syria at age 12 and monk Bahira's prediction, the title Al-Amin (the Trustworthy) given by the Makkans, the Black Stone story, and marriage to Khadijah (may Allah be pleased with her) at age 25.",
      content: sirahYouthContent,
    },
  });

  console.log('✅ Unit 6:', unitSirahYouth.title);

  // ==============================================================
  // TARIKH UNITS (2)
  // ==============================================================

  // ──────────────────────────────────────────────
  // UNIT 7: TARIKH — Prophet Adam (peace be upon him)
  // ──────────────────────────────────────────────

  const adamContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will be able to describe the creation of Adam (peace be upon him), explain why Iblis refused to prostrate, and understand why Adam and Hawwa came to Earth.</p>

<h2>The Creation of Adam (peace be upon him)</h2>
<p>Adam (peace be upon him) was the first human being and the first prophet ever sent by Allah. Allah created him from <strong>clay</strong> and breathed a soul into him.</p>
<p>Allah taught Adam the names of all things — a special gift that showed the great honour given to humans. Then Allah commanded all the angels to prostrate (bow) to Adam as a sign of respect and honour.</p>

<h3>Iblis Refused</h3>
<p>All the angels obeyed right away — but <strong>Iblis</strong> (also called Shaytan) refused. He was proud and said:</p>
<blockquote>"I am better than him! You created me from fire and created him from clay." (Quran 38:76)</blockquote>
<p>This was very wrong. Pride is a bad thing. Allah was angry with Iblis and sent him away from His mercy. Iblis promised to try to lead people astray until the Last Day. That is why we must always seek Allah's protection from Shaytan.</p>

<h2>Hawwa — Adam's Wife</h2>
<p>Adam (peace be upon him) was placed in Jannah. He was happy but lonely. Allah created <strong>Hawwa</strong> and made her Adam's wife. They both lived happily in Jannah.</p>

<h2>The Forbidden Tree</h2>
<p>Allah allowed Adam and Hawwa to eat from all the trees in Jannah — except one tree. Iblis tricked them into eating from that forbidden tree.</p>
<p>Adam and Hawwa felt very sorry. They asked Allah for forgiveness:</p>
<blockquote>"Our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be among the losers." (Quran 7:23)</blockquote>
<p>Allah forgave them — Allah is the Most Forgiving, the Most Merciful! But He sent them to Earth, where they would live, work hard, and be tested.</p>

<h3>Lessons</h3>
<ul>
  <li>Shaytan is our enemy — he always tries to trick us into doing wrong.</li>
  <li>When we make a mistake, we should ask Allah for forgiveness straight away.</li>
  <li>Allah is very merciful — He forgives those who are truly sorry.</li>
</ul>
`.trim();

  const unitAdam = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-tarikh-adam' } },
    create: {
      slug: 'maktab-1-tarikh-adam',
      courseId: course.id,
      orderIndex: 7,
      title: 'Tarikh \u2014 Prophet Adam (peace be upon him)',
      description: 'Allah created Adam from clay (first human and first prophet), angels prostrated, Iblis refused out of pride, Hawwa created as his wife, the forbidden tree, repentance and forgiveness, sent to Earth as a test.',
      content: adamContent,
    },
    update: {
      title: 'Tarikh \u2014 Prophet Adam (peace be upon him)',
      description: 'Allah created Adam from clay (first human and first prophet), angels prostrated, Iblis refused out of pride, Hawwa created as his wife, the forbidden tree, repentance and forgiveness, sent to Earth as a test.',
      content: adamContent,
    },
  });

  console.log('✅ Unit 7:', unitAdam.title);

  // ──────────────────────────────────────────────
  // UNIT 8: TARIKH — Prophet Nuh (peace be upon him)
  // ──────────────────────────────────────────────

  const nuhContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will be able to describe how long Nuh (peace be upon him) preached, what Allah commanded him to build, and what happened during the great flood.</p>

<h2>The People of Nuh (peace be upon him)</h2>
<p>After Adam and Hawwa, their children and grandchildren lived on Earth. Over time, Shaytan tricked later generations into making pictures, then statues, then idols of pious people. Eventually they began worshipping these idols instead of Allah.</p>
<p>Some of these idols had names: <strong>Wadd, Suwa, Yaghuth, Ya'uq, and Nasr</strong>.</p>

<h2>Nuh (peace be upon him) Preaches</h2>
<p>Allah chose <strong>Nuh (peace be upon him)</strong> as His messenger to guide these people back to the right path.</p>
<p>Nuh called the people to worship Allah alone and to stop worshipping idols. He preached and called to Allah for <strong>950 years</strong>! But most people laughed at him, called him a liar, and refused to listen.</p>
<p>Only a small number of people believed in him and followed him.</p>

<h2>Allah Commands the Ark</h2>
<p>Nuh (peace be upon him) made du'a to Allah. Allah commanded Nuh to build a large ship called the <strong>safinah</strong> (ark). He was told to take on board all the believers and a male and female of every type of animal.</p>
<p>The people around him laughed when they saw him building a ship in the desert — but Nuh continued with complete trust in Allah.</p>

<h2>The Great Flood</h2>
<p>Then Allah sent heavy rain. The water rose higher and higher until the waves were like mountains. The great flood covered the whole Earth.</p>
<p>Nuh called to his son to come on the ark, but his son refused. He said he would climb a mountain to be saved. A huge wave swept him away.</p>
<p>All those who refused to believe were drowned. Those who believed were safe on the ark.</p>
<p>After the flood, the ark came to rest on a mountain called <strong>Judiyy</strong>.</p>

<h3>Lessons</h3>
<ul>
  <li>Never give up doing good — Nuh (peace be upon him) continued for 950 years!</li>
  <li>We must never mock or laugh at those who invite us to Allah.</li>
  <li>Being in the same family does not save us — only our own faith and obedience to Allah can.</li>
</ul>
`.trim();

  const unitNuh = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-tarikh-nuh' } },
    create: {
      slug: 'maktab-1-tarikh-nuh',
      courseId: course.id,
      orderIndex: 8,
      title: 'Tarikh \u2014 Prophet Nuh (peace be upon him)',
      description: "Nuh (peace be upon him) sent to people worshipping idols (Wadd, Suwa, Yaghuth, Ya'uq, Nasr), preached for 950 years, commanded to build the ark, the great flood, disbelievers drowned, ark rested on Mount Judiyy.",
      content: nuhContent,
    },
    update: {
      title: 'Tarikh \u2014 Prophet Nuh (peace be upon him)',
      description: "Nuh (peace be upon him) sent to people worshipping idols (Wadd, Suwa, Yaghuth, Ya'uq, Nasr), preached for 950 years, commanded to build the ark, the great flood, disbelievers drowned, ark rested on Mount Judiyy.",
      content: nuhContent,
    },
  });

  console.log('✅ Unit 8:', unitNuh.title);

  // ==============================================================
  // AQAID UNIT (1)
  // ==============================================================

  // ──────────────────────────────────────────────
  // UNIT 9: AQAID — The Articles of Faith
  // ──────────────────────────────────────────────

  const aqaidContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will be able to name all seven articles of faith and explain each one in simple words.</p>

<h2>What is Iman?</h2>
<p><strong>Iman</strong> means belief. A Muslim believes in certain things with their heart. These beliefs are called the <strong>Articles of Faith</strong>. There are seven of them. Knowing and believing in all seven is very important for every Muslim.</p>

<h3>1. Belief in Allah</h3>
<p>We believe in <strong>Allah</strong> — the One God. He has no partners, no parents, and no children. Allah created everything. He has always been and will always be. We cannot see Allah, but He sees and knows everything.</p>

<h3>2. Belief in the Angels</h3>
<p>We believe that Allah created <strong>angels</strong> from light. Angels always obey Allah and never disobey Him. Some famous angels are Jibril (who brought the Quran) and Mika'il.</p>

<h3>3. Belief in the Divine Books</h3>
<p>We believe that Allah sent <strong>books</strong> to guide people. The main books are:</p>
<ul>
  <li>The <strong>Tawrah</strong> — given to Musa (peace be upon him)</li>
  <li>The <strong>Zabur</strong> — given to Dawud (peace be upon him)</li>
  <li>The <strong>Injil</strong> — given to Isa (peace be upon him)</li>
  <li>The <strong>Quran</strong> — given to Muhammad (peace be upon him); the final and perfectly preserved book</li>
</ul>

<h3>4. Belief in the Prophets and Messengers</h3>
<p>We believe that Allah sent many <strong>prophets and messengers</strong> to guide people. We love all of them. The first prophet was Adam (peace be upon him), and the last and final prophet was Muhammad (peace be upon him).</p>

<h3>5. Belief in the Last Day</h3>
<p>We believe in <strong>Qiyamah</strong> — the Day of Judgement. On that Day, everyone will be brought back to life and answer for their deeds. Those who did good will go to <strong>Jannah</strong> (Paradise) and those who did bad will go to <strong>Jahannam</strong> (Hellfire).</p>

<h3>6. Belief in Qadar</h3>
<p><strong>Qadar</strong> means divine decree. We believe that everything — good and bad — happens by the knowledge and will of Allah. Nothing happens in the world without Allah knowing about it first.</p>

<h3>7. Belief in Resurrection After Death</h3>
<p>We believe that after we die, we will be brought back to life on the Day of Judgement. Our life in this world is short — it is a test. The real and everlasting life comes after death.</p>
`.trim();

  const unitAqaid = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-aqaid-articles' } },
    create: {
      slug: 'maktab-1-aqaid-articles',
      courseId: course.id,
      orderIndex: 9,
      title: 'Aqaid \u2014 The Articles of Faith',
      description: 'The seven articles of Islamic faith (Iman): belief in Allah, angels (created from light), divine books (Tawrah, Zabur, Injil, Quran), prophets and messengers, the Last Day (Qiyamah), Qadar (divine decree), and resurrection after death.',
      content: aqaidContent,
    },
    update: {
      title: 'Aqaid \u2014 The Articles of Faith',
      description: 'The seven articles of Islamic faith (Iman): belief in Allah, angels (created from light), divine books (Tawrah, Zabur, Injil, Quran), prophets and messengers, the Last Day (Qiyamah), Qadar (divine decree), and resurrection after death.',
      content: aqaidContent,
    },
  });

  console.log('✅ Unit 9:', unitAqaid.title);

  // ==============================================================
  // AKHLAQ UNITS (2)
  // ==============================================================

  // ──────────────────────────────────────────────
  // UNIT 10: AKHLAQ — Respect & Cleanliness
  // ──────────────────────────────────────────────

  const akhlaqRespectContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will understand the importance of respecting parents and elders, know the hadith on cleanliness, and be able to list ways to keep yourself and your surroundings clean.</p>

<h2>Respecting Parents and Elders</h2>
<p>Allah tells us in the Quran to be kind and good to our parents. Rasulullah (peace be upon him) said:</p>
<p><strong>"Whoever does not respect our elders is not one of us."</strong> (Ahmad)</p>
<p>How do we show respect?</p>
<ul>
  <li>Stand up when an elder enters the room.</li>
  <li>Do not talk back or argue with parents.</li>
  <li>Help at home without being asked.</li>
  <li>Speak quietly and gently — do not shout.</li>
  <li>Say "please" and "Jazakallahu Khayran."</li>
</ul>

<h2>Respecting Teachers</h2>
<p>Our teachers work hard to help us learn. We show respect by:</p>
<ul>
  <li>Listening when they speak.</li>
  <li>Not talking when others are learning.</li>
  <li>Thanking them for teaching us.</li>
</ul>

<h2>Cleanliness is Half of Faith</h2>
<p>Rasulullah (peace be upon him) said: <strong>"Cleanliness is half of faith."</strong> (Sahih Muslim)</p>
<p>This shows how important cleanliness is in Islam. A clean Muslim is loved by Allah and loved by people around them.</p>

<h3>Keeping Your Body Clean</h3>
<ul>
  <li>Wash your hands before and after meals.</li>
  <li>Brush your teeth twice a day.</li>
  <li>Have a bath or shower regularly.</li>
  <li>Wear clean clothes every day.</li>
  <li>Keep your nails short and clean.</li>
</ul>

<h3>Keeping Your Surroundings Clean</h3>
<ul>
  <li>Tidy your room and put things away neatly.</li>
  <li>Make your bed when you wake up.</li>
  <li>Do not throw litter on the ground.</li>
  <li>Do not cause harm to others by being messy.</li>
</ul>
<p>Allah says in the Quran: <strong>"Allah loves those who purify themselves."</strong> (Quran 9:108)</p>
`.trim();

  const unitAkhlaqRespect = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-akhlaq-respect-clean' } },
    create: {
      slug: 'maktab-1-akhlaq-respect-clean',
      courseId: course.id,
      orderIndex: 10,
      title: 'Akhlaq \u2014 Respect & Cleanliness',
      description: 'Respecting parents, elders and teachers (hadith: whoever does not respect elders is not one of us), the hadith on cleanliness being half of faith, and practical ways to keep body and surroundings clean.',
      content: akhlaqRespectContent,
    },
    update: {
      title: 'Akhlaq \u2014 Respect & Cleanliness',
      description: 'Respecting parents, elders and teachers (hadith: whoever does not respect elders is not one of us), the hadith on cleanliness being half of faith, and practical ways to keep body and surroundings clean.',
      content: akhlaqRespectContent,
    },
  });

  console.log('✅ Unit 10:', unitAkhlaqRespect.title);

  // ──────────────────────────────────────────────
  // UNIT 11: AKHLAQ — Gentleness, Speech & Smiling
  // ──────────────────────────────────────────────

  const akhlaqSpeechContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will understand that smiling is sadaqah, know the hadith on gentle speech, and be able to describe who a true Muslim is according to the hadith.</p>

<h2>Speaking Gently and Kindly</h2>
<p>The tongue is a great gift from Allah. We must use it carefully — only to say good things.</p>
<p>Rasulullah (peace be upon him) always spoke gently and with kindness. He said:</p>
<p><strong>"Protect yourselves from the Fire... whoever cannot find anything to give, then let him speak a good word."</strong> (Sahih al-Bukhari)</p>
<p>This means that even if we have nothing to give, we can give the gift of a kind word — and that counts as sadaqah (charity)!</p>

<h3>Think Before You Speak</h3>
<p>There are three ways to say the same thing:</p>
<ul>
  <li><em>"Hey! Do you want one?"</em> — Rough and rude</li>
  <li><em>"Shall I give you one?"</em> — Okay</li>
  <li><em>"Please, take some."</em> — Gentle and kind</li>
</ul>
<p>Always choose the kindest way to speak!</p>

<h2>The Value of Smiling</h2>
<p>Rasulullah (peace be upon him) said: <strong>"Your smile for your brother is sadaqah (charity)."</strong> (Tirmidhi)</p>
<p>A smile costs nothing but it means so much. Smiling earns us a reward from Allah — even a small smile is a good deed!</p>
<ul>
  <li>Smiling is free — everyone can do it.</li>
  <li>Smiling makes people feel welcome and happy.</li>
  <li>Smiling spreads goodness around you.</li>
</ul>

<h2>Always Speak the Truth</h2>
<p>A Muslim always tells the truth, even when it is hard. Lying hurts people and makes Allah unhappy. Truth builds trust between people.</p>

<h2>Who is a True Muslim?</h2>
<p>Rasulullah (peace be upon him) said: <strong>"A Muslim is one from whose tongue and hands other Muslims are safe."</strong> (Bukhari)</p>
<p>A true Muslim does not hurt anyone with words or actions. We never make fun of others, never call people bad names, and never harm anyone.</p>
`.trim();

  const unitAkhlaqSpeech = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-akhlaq-speech' } },
    create: {
      slug: 'maktab-1-akhlaq-speech',
      courseId: course.id,
      orderIndex: 11,
      title: 'Akhlaq \u2014 Gentleness, Speech & Smiling',
      description: 'Speaking gently (good speech is sadaqah), value of smiling (smiling at your brother is sadaqah/charity), always speaking the truth, and the hadith on who is a true Muslim (safe tongue and hands).',
      content: akhlaqSpeechContent,
    },
    update: {
      title: 'Akhlaq \u2014 Gentleness, Speech & Smiling',
      description: 'Speaking gently (good speech is sadaqah), value of smiling (smiling at your brother is sadaqah/charity), always speaking the truth, and the hadith on who is a true Muslim (safe tongue and hands).',
      content: akhlaqSpeechContent,
    },
  });

  console.log('✅ Unit 11:', unitAkhlaqSpeech.title);

  // ==============================================================
  // ADAB UNIT (1)
  // ==============================================================

  // ──────────────────────────────────────────────
  // UNIT 12: ADAB — Eating, Drinking, Sleeping & Waking
  // ──────────────────────────────────────────────

  const adabDailyContent = `
<h2>Learning Objectives</h2>
<p>By the end of this unit, you will know the Sunnah etiquette for eating, drinking, sleeping, waking up, and using the washroom.</p>

<h2>Adab of Eating</h2>
<p>Rasulullah (peace be upon him) said: <strong>"When one of you eats, he should say Bismillah."</strong> (Abu Dawud)</p>
<ul>
  <li>Say <strong>Bismillah</strong> before you eat.</li>
  <li>Eat with your <strong>right hand</strong>.</li>
  <li>Eat from the side of the plate closest to you.</li>
  <li>Do not find fault in the food.</li>
  <li>Say <strong>Alhamdulillah</strong> when you finish.</li>
</ul>
<p><em>Alhamdulillahil-ladhi at'amana wa saqana wa ja'alana muslimin</em></p>
<p>"Praise be to Allah who fed us, gave us drink, and made us Muslims." (Abu Dawud)</p>

<h2>Adab of Drinking</h2>
<p>Rasulullah (peace be upon him) said: <strong>"Do not drink in one gulp like camels — drink in two or three sips."</strong> (Tirmidhi)</p>
<ul>
  <li>Say <strong>Bismillah</strong> before you drink.</li>
  <li><strong>Sit down</strong> when drinking.</li>
  <li>Drink in <strong>three sips</strong>.</li>
  <li>Do not blow into the cup.</li>
  <li>Say <strong>Alhamdulillah</strong> when you finish.</li>
</ul>

<h2>Adab of Sleeping</h2>
<p>Before sleeping, Rasulullah (peace be upon him) used to recite this du'a:</p>
<p><em>Allahumma bismika amutu wa ahya</em> — "O Allah, with Your name I die and live." (Sahih al-Bukhari)</p>
<ul>
  <li>Do <strong>wudu</strong> before sleeping.</li>
  <li>Sleep on your <strong>right side</strong>.</li>
  <li>Place your right hand under your right cheek.</li>
  <li>Say the sleeping du'a before closing your eyes.</li>
</ul>

<h2>Adab of Waking Up</h2>
<p>When Rasulullah (peace be upon him) woke up, he said:</p>
<p><em>Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur</em></p>
<p>"All praise is for Allah who gave us life after causing us to die, and to Him is the return." (Sahih al-Bukhari)</p>
<ul>
  <li>Recite the waking du'a first.</li>
  <li>Rub your eyes gently.</li>
  <li>Wash your hands.</li>
  <li>Brush your teeth.</li>
</ul>

<h2>Adab of the Washroom</h2>
<p>Before entering the washroom, say:</p>
<p><em>Allahumma inni a'udhu bika minal-khubuth wal-khaba'ith</em> — "O Allah, I seek refuge in You from all evil." (Sahih al-Bukhari)</p>
<ul>
  <li>Enter with your <strong>left foot</strong>.</li>
  <li>Leave with your <strong>right foot</strong>.</li>
  <li>Do not talk inside the washroom.</li>
  <li>Wash your hands with soap when leaving.</li>
</ul>
`.trim();

  const unitAdabDaily = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-adab-daily' } },
    create: {
      slug: 'maktab-1-adab-daily',
      courseId: course.id,
      orderIndex: 12,
      title: 'Adab \u2014 Eating, Drinking, Sleeping & Waking',
      description: "Sunnah etiquette for eating (Bismillah, right hand, from nearest side), drinking (three sips, sit down, no blowing), sleeping (wudu, du'a, right side), waking (du'a, wash hands), and the washroom (du'a, left foot in, right foot out).",
      content: adabDailyContent,
    },
    update: {
      title: 'Adab \u2014 Eating, Drinking, Sleeping & Waking',
      description: "Sunnah etiquette for eating (Bismillah, right hand, from nearest side), drinking (three sips, sit down, no blowing), sleeping (wudu, du'a, right side), waking (du'a, wash hands), and the washroom (du'a, left foot in, right foot out).",
      content: adabDailyContent,
    },
  });

  console.log('✅ Unit 12:', unitAdabDaily.title);

  // ==============================================================
  // QUIZ QUESTIONS — array + loop (CB5 pattern)
  // ==============================================================

  console.log('');
  console.log('📝 Creating quiz questions...');

  const quizData: Array<{
    unitId: string;
    externalId: string;
    type: string;
    questionText: string;
    options: string[] | null;
    correctAnswer: string;
    explanation: string;
  }> = [
    // ── Unit 1: Five Pillars ──
    { unitId: unitPillars.id, externalId: 'maktab-1-pillars-q1', type: 'MULTIPLE_CHOICE', questionText: 'How many pillars of Islam are there?', options: ['Three', 'Four', 'Five', 'Six'], correctAnswer: 'Five', explanation: 'There are five pillars of Islam: Shahadah, Salah, Zakah, Sawm, and Hajj.' },
    { unitId: unitPillars.id, externalId: 'maktab-1-pillars-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is the first and most important pillar of Islam?', options: ['Salah', 'Zakah', 'Shahadah', 'Hajj'], correctAnswer: 'Shahadah', explanation: 'The Shahadah is the first pillar — to believe and say that there is no god but Allah and Muhammad SAW is His servant and messenger.' },
    { unitId: unitPillars.id, externalId: 'maktab-1-pillars-q3', type: 'MULTIPLE_CHOICE', questionText: 'How many times a day do Muslims pray Salah?', options: ['Three', 'Four', 'Five', 'Seven'], correctAnswer: 'Five', explanation: 'Muslims pray five times a day: Fajr, Zuhr, Asr, Maghrib, and Isha.' },
    { unitId: unitPillars.id, externalId: 'maktab-1-pillars-q4', type: 'TRUE_FALSE', questionText: 'Zakah means fasting during Ramadan.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Zakah means giving some of our money to those who need help. Fasting during Ramadan is called Sawm.' },
    { unitId: unitPillars.id, externalId: 'maktab-1-pillars-q5', type: 'MULTIPLE_CHOICE', questionText: 'In which month do Muslims fast?', options: ['Rajab', "Sha'ban", 'Ramadan', 'Muharram'], correctAnswer: 'Ramadan', explanation: 'Muslims fast in the blessed month of Ramadan — the fourth pillar of Islam is Sawm (fasting).' },
    { unitId: unitPillars.id, externalId: 'maktab-1-pillars-q6', type: 'MULTIPLE_CHOICE', questionText: 'Hajj is a special journey to which holy city?', options: ['Madinah', 'Jerusalem', 'Makkah', 'Baghdad'], correctAnswer: 'Makkah', explanation: "Hajj is the fifth pillar — a special journey to the holy city of Makkah, where the Ka'bah is located." },
    { unitId: unitPillars.id, externalId: 'maktab-1-pillars-q7', type: 'FILL_BLANK', questionText: "Walking around the Ka'bah seven times during Hajj is called _____.", options: null, correctAnswer: 'tawaf', explanation: "Tawaf means walking around the Ka'bah seven times. It is a special act of worship during Hajj and Umrah." },

    // ── Unit 2: Taharah & Wudu ──
    { unitId: unitTahara.id, externalId: 'maktab-1-tahara-q1', type: 'MULTIPLE_CHOICE', questionText: 'What does taharah mean?', options: ['Prayer', 'Cleanliness and purity', 'Fasting', 'Charity'], correctAnswer: 'Cleanliness and purity', explanation: 'Taharah means to be clean and pure. Allah loves people who are clean, and we must have taharah before we pray.' },
    { unitId: unitTahara.id, externalId: 'maktab-1-tahara-q2', type: 'MULTIPLE_CHOICE', questionText: 'What do we say at the very start of wudu?', options: ['Alhamdulillah', 'Bismillah', 'SubhanAllah', 'Allahu Akbar'], correctAnswer: 'Bismillah', explanation: 'We say "Bismillah" (In the name of Allah) to begin wudu, after making our intention.' },
    { unitId: unitTahara.id, externalId: 'maktab-1-tahara-q3', type: 'MULTIPLE_CHOICE', questionText: 'How many times do we wash each part in wudu?', options: ['Once', 'Twice', 'Three times', 'Four times'], correctAnswer: 'Three times', explanation: 'Each part of the body is washed three times in wudu — the face, arms, and feet are each washed three times.' },
    { unitId: unitTahara.id, externalId: 'maktab-1-tahara-q4', type: 'TRUE_FALSE', questionText: 'Passing wind (gas) breaks your wudu.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Passing wind is one of the things that breaks wudu. You must make wudu again before praying.' },
    { unitId: unitTahara.id, externalId: 'maktab-1-tahara-q5', type: 'MULTIPLE_CHOICE', questionText: 'Which arm do we wash first in wudu?', options: ['Left arm', 'Right arm', 'Either arm', 'Both at the same time'], correctAnswer: 'Right arm', explanation: 'We always start with the right side in wudu — we wash the right arm first, then the left arm.' },
    { unitId: unitTahara.id, externalId: 'maktab-1-tahara-q6', type: 'FILL_BLANK', questionText: 'The special washing we do before salah is called _____.', options: null, correctAnswer: 'wudu', explanation: 'Wudu (ablution) is the special way Allah taught us to clean ourselves before we stand in salah.' },
    { unitId: unitTahara.id, externalId: 'maktab-1-tahara-q7', type: 'TRUE_FALSE', questionText: 'Falling into a deep sleep breaks wudu.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Falling into a deep sleep is one of the things that breaks wudu. You should make wudu again before praying after sleeping.' },

    // ── Unit 3: What is a Hadith? ──
    { unitId: unitHadithIntro.id, externalId: 'maktab-1-hadith-intro-q1', type: 'MULTIPLE_CHOICE', questionText: 'What is a hadith?', options: ['A chapter of the Quran', 'What Rasulullah SAW said, did, or approved', 'A type of prayer', 'A story from long ago'], correctAnswer: 'What Rasulullah SAW said, did, or approved', explanation: 'A hadith is what Rasulullah (peace be upon him) said, did himself, or did not say "no" to when he saw it.' },
    { unitId: unitHadithIntro.id, externalId: 'maktab-1-hadith-intro-q2', type: 'MULTIPLE_CHOICE', questionText: 'Who is the source of ahadith?', options: ['The Companions', 'Rasulullah SAW', 'The Scholars', 'The Angels'], correctAnswer: 'Rasulullah SAW', explanation: 'Hadiths come from Rasulullah (peace be upon him) — his words, his actions, and what he approved of.' },
    { unitId: unitHadithIntro.id, externalId: 'maktab-1-hadith-intro-q3', type: 'MULTIPLE_CHOICE', questionText: 'Why do we follow hadiths?', options: ['Because they are interesting stories', 'Because the Quran says to obey the Messenger', 'Because our friends follow them', 'Because they are old books'], correctAnswer: 'Because the Quran says to obey the Messenger', explanation: 'Allah says in the Quran: "Obey Allah and obey the Messenger." Following hadiths is how we obey Rasulullah SAW.' },
    { unitId: unitHadithIntro.id, externalId: 'maktab-1-hadith-intro-q4', type: 'TRUE_FALSE', questionText: 'A hadith is a chapter of the Quran.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'A hadith is not a chapter of the Quran. It is a record of what Rasulullah SAW said, did, or approved. The Quran is the word of Allah.' },
    { unitId: unitHadithIntro.id, externalId: 'maktab-1-hadith-intro-q5', type: 'FILL_BLANK', questionText: 'The plural of hadith is _____.', options: null, correctAnswer: 'ahadith', explanation: 'The plural of hadith is ahadith. So we say "one hadith" but "many ahadith."' },
    { unitId: unitHadithIntro.id, externalId: 'maktab-1-hadith-intro-q6', type: 'MULTIPLE_CHOICE', questionText: 'What does "Rasulullah" mean?', options: ['Servant of Allah', 'Messenger of Allah', 'Prophet of Allah', 'Friend of Allah'], correctAnswer: 'Messenger of Allah', explanation: '"Rasulullah" means "the Messenger of Allah." His blessed name was Muhammad (peace be upon him).' },

    // ── Unit 4: Feeding, Helping & Truthfulness ──
    { unitId: unitHadithChar.id, externalId: 'maktab-1-hadith-char-q1', type: 'MULTIPLE_CHOICE', questionText: 'According to the hadith, who are the best of people?', options: ['The richest people', 'The strongest people', 'Those most helpful to others', 'The oldest people'], correctAnswer: 'Those most helpful to others', explanation: '"The best of people are those who are most helpful to others." (al-Mu\'jam al-Awsat). Helping others brings us closer to Allah.' },
    { unitId: unitHadithChar.id, externalId: 'maktab-1-hadith-char-q2', type: 'MULTIPLE_CHOICE', questionText: 'What does the hadith say about feeding a hungry person?', options: ['It is optional', 'It earns a great reward from Allah', 'It is only for rich people', 'It is not important'], correctAnswer: 'It earns a great reward from Allah', explanation: '"Feed the hungry and visit the sick." (Sahih al-Bukhari). When we feed others for the sake of Allah, we earn a great reward.' },
    { unitId: unitHadithChar.id, externalId: 'maktab-1-hadith-char-q3', type: 'MULTIPLE_CHOICE', questionText: 'What does speaking the truth lead to?', options: ['Trouble', 'Jannah (Paradise)', 'Sadness', 'Poverty'], correctAnswer: 'Jannah (Paradise)', explanation: '"Hold on to the truth." (Sahih Muslim). The truth leads us to Jannah, and lying is very bad.' },
    { unitId: unitHadithChar.id, externalId: 'maktab-1-hadith-char-q4', type: 'TRUE_FALSE', questionText: 'Lying is never allowed in Islam, even for a small reason.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Islam teaches us to always speak the truth. Lying is bad and makes Allah unhappy. Rasulullah SAW said: "Hold on to the truth."' },
    { unitId: unitHadithChar.id, externalId: 'maktab-1-hadith-char-q5', type: 'FILL_BLANK', questionText: '"The best of people are those who are most _____ to others."', options: null, correctAnswer: 'helpful', explanation: 'The full hadith is: "The best of people are those who are most helpful to others." (al-Mu\'jam al-Awsat)' },
    { unitId: unitHadithChar.id, externalId: 'maktab-1-hadith-char-q6', type: 'MULTIPLE_CHOICE', questionText: "In the story of Abdul Qadir, why did the robber leader start crying?", options: ['He was hurt', "He was shocked by the boy's honesty", 'He lost his money', 'He was scared of the boy'], correctAnswer: "He was shocked by the boy's honesty", explanation: 'Abdul Qadir told the truth about having forty gold coins. The robber leader was so moved by his honesty that he changed his ways.' },

    // ── Unit 5: Early Life ──
    { unitId: unitSirahEarly.id, externalId: 'maktab-1-sirah-early-q1', type: 'MULTIPLE_CHOICE', questionText: 'In which city was Rasulullah SAW born?', options: ['Madinah', 'Makkah', 'Syria', 'Baghdad'], correctAnswer: 'Makkah', explanation: 'Rasulullah (peace be upon him) was born in the holy city of Makkah, early on a Monday morning in Rabi al-Awwal.' },
    { unitId: unitSirahEarly.id, externalId: 'maktab-1-sirah-early-q2', type: 'MULTIPLE_CHOICE', questionText: 'What is special about "The Year of the Elephant"?', options: ['Rasulullah SAW built a masjid', "Rasulullah SAW was born and Allah destroyed Abrahah's army", 'The first revelation came', 'Rasulullah SAW got married'], correctAnswer: "Rasulullah SAW was born and Allah destroyed Abrahah's army", explanation: "The Year of the Elephant is when Rasulullah SAW was born. That same year, Abrahah tried to destroy the Ka'bah with elephants but Allah sent birds to destroy his army." },
    { unitId: unitSirahEarly.id, externalId: 'maktab-1-sirah-early-q3', type: 'MULTIPLE_CHOICE', questionText: "What was the name of Rasulullah SAW's foster mother?", options: ['Aminah', 'Khadijah', 'Halimah', 'Umm Ayman'], correctAnswer: 'Halimah', explanation: "Halimah al-Sa'diyyah from the tribe of Banu Sa'd was the foster mother of Rasulullah (peace be upon him). He stayed with her for about four years." },
    { unitId: unitSirahEarly.id, externalId: 'maktab-1-sirah-early-q4', type: 'MULTIPLE_CHOICE', questionText: 'What happened when Rasulullah SAW was six years old?', options: ['He went to Syria', 'His mother Aminah passed away', 'He got married', 'He started trading'], correctAnswer: 'His mother Aminah passed away', explanation: 'When Rasulullah SAW was six years old, his mother Aminah passed away at a place called Abwa while travelling back from Madinah.' },
    { unitId: unitSirahEarly.id, externalId: 'maktab-1-sirah-early-q5', type: 'MULTIPLE_CHOICE', questionText: 'Who raised Rasulullah SAW after his grandfather passed away?', options: ['His father Abdullah', 'Halimah', 'Abu Talib', 'Bahira'], correctAnswer: 'Abu Talib', explanation: "After his grandfather Abd al-Muttalib passed away, Rasulullah SAW's uncle Abu Talib took care of him." },
    { unitId: unitSirahEarly.id, externalId: 'maktab-1-sirah-early-q6', type: 'TRUE_FALSE', questionText: "Rasulullah SAW's father Abdullah was alive when he was born.", options: ['True', 'False'], correctAnswer: 'False', explanation: "Rasulullah SAW's father Abdullah passed away before he was born. This is why he was an orphan from birth." },
    { unitId: unitSirahEarly.id, externalId: 'maktab-1-sirah-early-q7', type: 'FILL_BLANK', questionText: "Rasulullah SAW was nursed by _____ al-Sa'diyyah in the desert.", options: null, correctAnswer: 'Halimah', explanation: "Halimah al-Sa'diyyah was the blessed foster mother of Rasulullah (peace be upon him) who nursed him in the desert." },

    // ── Unit 6: Youth & Marriage ──
    { unitId: unitSirahYouth.id, externalId: 'maktab-1-sirah-youth-q1', type: 'MULTIPLE_CHOICE', questionText: 'What does "Al-Amin" mean?', options: ['The Most Brave', 'The Most Trustworthy', 'The Most Generous', 'The Most Wise'], correctAnswer: 'The Most Trustworthy', explanation: '"Al-Amin" means "The Most Trustworthy." The people of Makkah gave this title to Rasulullah SAW because of his honest and trustworthy character.' },
    { unitId: unitSirahYouth.id, externalId: 'maktab-1-sirah-youth-q2', type: 'MULTIPLE_CHOICE', questionText: 'How old was Rasulullah SAW when he married Khadijah (may Allah be pleased with her)?', options: ['12 years', '20 years', '25 years', '40 years'], correctAnswer: '25 years', explanation: 'Rasulullah SAW was 25 years old when he married Khadijah (may Allah be pleased with her). She was 40 years old.' },
    { unitId: unitSirahYouth.id, externalId: 'maktab-1-sirah-youth-q3', type: 'MULTIPLE_CHOICE', questionText: 'Who was Bahira?', options: ['A trader in Syria', "A monk who predicted Rasulullah's prophethood", 'A relative of Khadijah', 'A leader of the Quraysh'], correctAnswer: "A monk who predicted Rasulullah's prophethood", explanation: 'Bahira was a monk who recognised the signs of prophethood in Rasulullah SAW when he passed through on the journey to Syria at age 12.' },
    { unitId: unitSirahYouth.id, externalId: 'maktab-1-sirah-youth-q4', type: 'TRUE_FALSE', questionText: 'The people of Makkah trusted Rasulullah SAW because he was always honest.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'The Makkans trusted Rasulullah SAW completely because of his honest and trustworthy character. They called him Al-Amin (The Trustworthy).' },
    { unitId: unitSirahYouth.id, externalId: 'maktab-1-sirah-youth-q5', type: 'FILL_BLANK', questionText: 'The Makkans called Rasulullah SAW "Al-Amin" meaning the _____.', options: null, correctAnswer: 'Trustworthy', explanation: 'Al-Amin means "The Most Trustworthy." The people of Makkah gave him this title because of his excellent character.' },
    { unitId: unitSirahYouth.id, externalId: 'maktab-1-sirah-youth-q6', type: 'MULTIPLE_CHOICE', questionText: 'What did Rasulullah SAW do for Khadijah before they married?', options: ['He taught her children', 'He led a trading journey to Syria for her', 'He built her a house', 'He delivered letters for her'], correctAnswer: 'He led a trading journey to Syria for her', explanation: 'Khadijah asked Rasulullah SAW to manage a trading journey to Syria for her. The journey was very successful, which impressed Khadijah greatly.' },

    // ── Unit 7: Prophet Adam ──
    { unitId: unitAdam.id, externalId: 'maktab-1-adam-q1', type: 'MULTIPLE_CHOICE', questionText: 'What was Adam (peace be upon him) made from?', options: ['Water', 'Fire', 'Clay', 'Light'], correctAnswer: 'Clay', explanation: 'Allah created Adam (peace be upon him) from clay. He was the first human being and the first prophet.' },
    { unitId: unitAdam.id, externalId: 'maktab-1-adam-q2', type: 'MULTIPLE_CHOICE', questionText: 'Why did Iblis refuse to prostrate to Adam?', options: ['He was sleeping', 'He thought he was better because he was made from fire', 'He did not hear the command', 'He was afraid'], correctAnswer: 'He thought he was better because he was made from fire', explanation: 'Iblis said: "I am better than him! You created me from fire and created him from clay." This pride was very wrong.' },
    { unitId: unitAdam.id, externalId: 'maktab-1-adam-q3', type: 'FILL_BLANK', questionText: "Adam's wife was named _____.", options: null, correctAnswer: 'Hawwa', explanation: 'Allah created Hawwa and made her the wife of Adam (peace be upon him). They both lived in Jannah.' },
    { unitId: unitAdam.id, externalId: 'maktab-1-adam-q4', type: 'TRUE_FALSE', questionText: 'Adam (peace be upon him) was the first human and the first prophet.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Adam (peace be upon him) was both the first human being ever created and the first prophet sent by Allah.' },
    { unitId: unitAdam.id, externalId: 'maktab-1-adam-q5', type: 'MULTIPLE_CHOICE', questionText: 'Why did Adam and Hawwa come to live on Earth?', options: ['They wanted to explore', 'They ate from the forbidden tree and were sent to Earth as a test', 'They were bored in Jannah', 'Allah forgot about them'], correctAnswer: 'They ate from the forbidden tree and were sent to Earth as a test', explanation: 'Iblis tricked Adam and Hawwa into eating from the forbidden tree. After asking for forgiveness, Allah forgave them and sent them to Earth as a test.' },
    { unitId: unitAdam.id, externalId: 'maktab-1-adam-q6', type: 'MULTIPLE_CHOICE', questionText: 'What did Allah do when Adam and Hawwa asked for forgiveness?', options: ['He was still angry', 'He forgave them', 'He ignored them', 'He punished them without mercy'], correctAnswer: 'He forgave them', explanation: 'Allah forgave Adam and Hawwa when they sincerely asked for forgiveness. Allah is the Most Forgiving and Most Merciful.' },

    // ── Unit 8: Prophet Nuh ──
    { unitId: unitNuh.id, externalId: 'maktab-1-nuh-q1', type: 'MULTIPLE_CHOICE', questionText: 'How many years did Nuh (peace be upon him) call his people to Allah?', options: ['100 years', '500 years', '950 years', '1000 years'], correctAnswer: '950 years', explanation: 'Nuh (peace be upon him) called his people to Allah for 950 years. He never gave up!' },
    { unitId: unitNuh.id, externalId: 'maktab-1-nuh-q2', type: 'MULTIPLE_CHOICE', questionText: 'What did Allah command Nuh to build?', options: ['A masjid', 'A palace', 'A large ark (safinah)', 'A wall'], correctAnswer: 'A large ark (safinah)', explanation: 'Allah commanded Nuh (peace be upon him) to build a large ship called the safinah (ark) and to take the believers and a pair of every animal on board.' },
    { unitId: unitNuh.id, externalId: 'maktab-1-nuh-q3', type: 'MULTIPLE_CHOICE', questionText: 'Where did the ark come to rest after the flood?', options: ['Makkah', 'Madinah', 'Mount Judiyy', 'Syria'], correctAnswer: 'Mount Judiyy', explanation: 'After the great flood, the ark of Nuh (peace be upon him) came to rest on a mountain called Judiyy.' },
    { unitId: unitNuh.id, externalId: 'maktab-1-nuh-q4', type: 'MULTIPLE_CHOICE', questionText: 'Who survived the flood?', options: ['Everyone', 'Only Nuh', 'Those who believed and boarded the ark', 'Those who climbed mountains'], correctAnswer: 'Those who believed and boarded the ark', explanation: 'Only those who believed in Nuh (peace be upon him) and boarded the ark survived the flood. All the disbelievers were drowned.' },
    { unitId: unitNuh.id, externalId: 'maktab-1-nuh-q5', type: 'TRUE_FALSE', questionText: "All of Nuh's children and family were saved from the flood.", options: ['True', 'False'], correctAnswer: 'False', explanation: "Nuh's son refused to believe and refused to board the ark. He was drowned in the flood. Being in someone's family does not save us — only our own faith does." },
    { unitId: unitNuh.id, externalId: 'maktab-1-nuh-q6', type: 'FILL_BLANK', questionText: 'Nuh (peace be upon him) preached to his people for _____ years.', options: null, correctAnswer: '950', explanation: 'Nuh (peace be upon him) called his people to Allah for 950 years without giving up. This shows us great patience and trust in Allah.' },
    { unitId: unitNuh.id, externalId: 'maktab-1-nuh-q7', type: 'MULTIPLE_CHOICE', questionText: 'What were the people of Nuh worshipping instead of Allah?', options: ['Stars', 'Trees', 'Idols with names like Wadd and Suwa', 'The Sun'], correctAnswer: 'Idols with names like Wadd and Suwa', explanation: "The people of Nuh worshipped idols with names like Wadd, Suwa, Yaghuth, Ya'uq, and Nasr. Nuh was sent to call them back to worshipping Allah alone." },

    // ── Unit 9: Articles of Faith ──
    { unitId: unitAqaid.id, externalId: 'maktab-1-aqaid-q1', type: 'MULTIPLE_CHOICE', questionText: 'What does "Iman" mean?', options: ['Prayer', 'Belief', 'Cleanliness', 'Charity'], correctAnswer: 'Belief', explanation: 'Iman means belief. A Muslim believes in certain things with their heart — these are called the Articles of Faith.' },
    { unitId: unitAqaid.id, externalId: 'maktab-1-aqaid-q2', type: 'MULTIPLE_CHOICE', questionText: 'How many articles of faith are there in Islam?', options: ['Five', 'Six', 'Seven', 'Eight'], correctAnswer: 'Seven', explanation: 'There are seven articles of faith: belief in Allah, angels, divine books, prophets, the Last Day, Qadar, and resurrection after death.' },
    { unitId: unitAqaid.id, externalId: 'maktab-1-aqaid-q3', type: 'TRUE_FALSE', questionText: 'Angels were created from light and always obey Allah.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Angels were created from light. They always obey Allah and never disobey Him — unlike humans and jinn.' },
    { unitId: unitAqaid.id, externalId: 'maktab-1-aqaid-q4', type: 'MULTIPLE_CHOICE', questionText: 'Which book was given to Muhammad (peace be upon him)?', options: ['The Tawrah', 'The Zabur', 'The Injil', 'The Quran'], correctAnswer: 'The Quran', explanation: 'The Quran was given to Muhammad (peace be upon him). It is the final and perfectly preserved book from Allah.' },
    { unitId: unitAqaid.id, externalId: 'maktab-1-aqaid-q5', type: 'FILL_BLANK', questionText: "\"Qadar\" means Allah's divine _____.", options: null, correctAnswer: 'decree', explanation: 'Qadar means divine decree. Everything — good and bad — happens by the knowledge and will of Allah.' },
    { unitId: unitAqaid.id, externalId: 'maktab-1-aqaid-q6', type: 'MULTIPLE_CHOICE', questionText: 'What is Qiyamah?', options: ['The first prayer of the day', 'The Day of Judgement', 'The month of fasting', 'The journey to Makkah'], correctAnswer: 'The Day of Judgement', explanation: 'Qiyamah is the Day of Judgement. On that Day everyone will be brought back to life and will answer for their deeds. Good people go to Jannah.' },
    { unitId: unitAqaid.id, externalId: 'maktab-1-aqaid-q7', type: 'TRUE_FALSE', questionText: 'We must believe in all the prophets and messengers sent by Allah.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Believing in all the prophets and messengers is the fourth article of faith. The first was Adam (peace be upon him) and the last was Muhammad (peace be upon him).' },

    // ── Unit 10: Respect & Cleanliness ──
    { unitId: unitAkhlaqRespect.id, externalId: 'maktab-1-akhlaq-resp-q1', type: 'MULTIPLE_CHOICE', questionText: 'What did Rasulullah SAW say about respecting elders?', options: ['"Respect only the wealthy"', '"Whoever does not respect our elders is not one of us"', '"Elders must respect youngsters first"', '"Respect is not important"'], correctAnswer: '"Whoever does not respect our elders is not one of us"', explanation: 'Rasulullah SAW said: "Whoever does not respect our elders is not one of us." (Ahmad). Respecting elders is very important in Islam.' },
    { unitId: unitAkhlaqRespect.id, externalId: 'maktab-1-akhlaq-resp-q2', type: 'MULTIPLE_CHOICE', questionText: 'What does the hadith say cleanliness is?', options: ['Half of salah', 'Half of faith', 'Half of Quran', 'Half of good deeds'], correctAnswer: 'Half of faith', explanation: '"Cleanliness is half of faith." (Sahih Muslim). This shows how important staying clean is in Islam.' },
    { unitId: unitAkhlaqRespect.id, externalId: 'maktab-1-akhlaq-resp-q3', type: 'TRUE_FALSE', questionText: 'Keeping your room tidy is a way of showing cleanliness in Islam.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Cleanliness in Islam includes our body, clothes, and surroundings — including keeping our rooms tidy. Allah loves those who are clean.' },
    { unitId: unitAkhlaqRespect.id, externalId: 'maktab-1-akhlaq-resp-q4', type: 'FILL_BLANK', questionText: '"Cleanliness is half of _____." (Sahih Muslim)', options: null, correctAnswer: 'faith', explanation: 'Rasulullah SAW said: "Cleanliness is half of faith." This hadith shows that staying clean is a huge part of being a good Muslim.' },
    { unitId: unitAkhlaqRespect.id, externalId: 'maktab-1-akhlaq-resp-q5', type: 'MULTIPLE_CHOICE', questionText: 'How can you show respect to a teacher in class?', options: ['Talk while they are speaking', 'Listen carefully and do not disturb others', 'Look out the window', 'Do something else'], correctAnswer: 'Listen carefully and do not disturb others', explanation: 'We show respect to teachers by listening when they speak, not disturbing others, and thanking them for teaching us.' },
    { unitId: unitAkhlaqRespect.id, externalId: 'maktab-1-akhlaq-resp-q6', type: 'TRUE_FALSE', questionText: 'Allah loves those who keep themselves clean.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Allah says in the Quran: "Allah loves those who purify themselves." (Quran 9:108). A clean Muslim is loved by Allah.' },

    // ── Unit 11: Gentleness, Speech & Smiling ──
    { unitId: unitAkhlaqSpeech.id, externalId: 'maktab-1-akhlaq-speech-q1', type: 'MULTIPLE_CHOICE', questionText: 'What did Rasulullah SAW say about smiling at your Muslim brother?', options: ['It is a waste of time', 'It is sadaqah (charity)', 'It is only for happy days', 'It is not mentioned in Islam'], correctAnswer: 'It is sadaqah (charity)', explanation: 'Rasulullah SAW said: "Your smile for your brother is sadaqah." (Tirmidhi). Smiling is a free act of charity that earns reward from Allah.' },
    { unitId: unitAkhlaqSpeech.id, externalId: 'maktab-1-akhlaq-speech-q2', type: 'MULTIPLE_CHOICE', questionText: 'What does a kind, gentle word count as?', options: ['Nothing', 'Sadaqah (charity)', 'A pillar of Islam', 'A type of prayer'], correctAnswer: 'Sadaqah (charity)', explanation: 'Rasulullah SAW taught that if you have nothing to give, then speak a good word — and that good word counts as sadaqah (charity).' },
    { unitId: unitAkhlaqSpeech.id, externalId: 'maktab-1-akhlaq-speech-q3', type: 'MULTIPLE_CHOICE', questionText: 'According to the hadith, who is a true Muslim?', options: ['One who prays all day', 'One whose tongue and hands others are safe from', 'One who fasts every day', 'One who is always smiling'], correctAnswer: 'One whose tongue and hands others are safe from', explanation: 'Rasulullah SAW said: "A Muslim is one from whose tongue and hands other Muslims are safe." (Bukhari). A true Muslim does not hurt others with words or actions.' },
    { unitId: unitAkhlaqSpeech.id, externalId: 'maktab-1-akhlaq-speech-q4', type: 'TRUE_FALSE', questionText: 'Saying rude words to others is okay as long as you are joking.', options: ['True', 'False'], correctAnswer: 'False', explanation: "Islam teaches us to always speak kindly and gently. Rude words hurt others and can cause harm even if meant as a joke. A Muslim's tongue should be safe for others." },
    { unitId: unitAkhlaqSpeech.id, externalId: 'maktab-1-akhlaq-speech-q5', type: 'FILL_BLANK', questionText: '"Your _____ for your brother is sadaqah." (Tirmidhi)', options: null, correctAnswer: 'smile', explanation: 'Rasulullah SAW said: "Your smile for your brother is sadaqah." (Tirmidhi). A smile is free and earns a reward from Allah.' },
    { unitId: unitAkhlaqSpeech.id, externalId: 'maktab-1-akhlaq-speech-q6', type: 'TRUE_FALSE', questionText: 'Speaking gently and kindly to others is a form of charity in Islam.', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Rasulullah SAW taught that speaking a good word is sadaqah (charity). Even a gentle word with no money involved earns reward from Allah.' },

    // ── Unit 12: Eating, Drinking, Sleeping & Waking ──
    { unitId: unitAdabDaily.id, externalId: 'maktab-1-adab-q1', type: 'MULTIPLE_CHOICE', questionText: 'What should we say before eating?', options: ['Alhamdulillah', 'SubhanAllah', 'Bismillah', 'Allahu Akbar'], correctAnswer: 'Bismillah', explanation: 'We say "Bismillah" (In the name of Allah) before eating, as Rasulullah SAW taught us.' },
    { unitId: unitAdabDaily.id, externalId: 'maktab-1-adab-q2', type: 'MULTIPLE_CHOICE', questionText: 'Which hand should we eat with?', options: ['Left hand', 'Right hand', 'Either hand', 'Both hands'], correctAnswer: 'Right hand', explanation: 'Rasulullah SAW said not to eat with the left hand because Shaytan eats with the left hand. We always eat and drink with the right hand.' },
    { unitId: unitAdabDaily.id, externalId: 'maktab-1-adab-q3', type: 'MULTIPLE_CHOICE', questionText: 'How many sips should we drink water in?', options: ['One gulp', 'Two sips', 'Three sips', 'Five sips'], correctAnswer: 'Three sips', explanation: 'Rasulullah SAW said: "Do not drink in one gulp — drink in two or three sips." (Tirmidhi). We should also sit down when drinking.' },
    { unitId: unitAdabDaily.id, externalId: 'maktab-1-adab-q4', type: 'MULTIPLE_CHOICE', questionText: 'Which side should we sleep on according to the Sunnah?', options: ['Left side', 'Right side', 'On the stomach', 'On the back'], correctAnswer: 'Right side', explanation: 'It is Sunnah to sleep on the right side with the right hand placed under the right cheek, as Rasulullah SAW used to sleep.' },
    { unitId: unitAdabDaily.id, externalId: 'maktab-1-adab-q5', type: 'TRUE_FALSE', questionText: 'We should blow into the cup before drinking.', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Rasulullah SAW told us not to blow into the cup when drinking. We should drink in three sips and not blow air into the cup.' },
    { unitId: unitAdabDaily.id, externalId: 'maktab-1-adab-q6', type: 'FILL_BLANK', questionText: 'When entering the washroom, we enter with our _____ foot.', options: null, correctAnswer: 'left', explanation: 'We enter the washroom with the left foot and leave with the right foot. This is the Sunnah way taught by Rasulullah SAW.' },
    { unitId: unitAdabDaily.id, externalId: 'maktab-1-adab-q7', type: 'MULTIPLE_CHOICE', questionText: 'What should we do before sleeping, according to the Sunnah?', options: ['Skip wudu and sleep', "Make wudu and recite the sleeping du'a", 'Read a story book', 'Eat a big meal'], correctAnswer: "Make wudu and recite the sleeping du'a", explanation: 'Before sleeping, we should make wudu, sleep on our right side, and recite: "Allahumma bismika amutu wa ahya" (O Allah, with Your name I die and live).' },
    { unitId: unitAdabDaily.id, externalId: 'maktab-1-adab-q8', type: 'MULTIPLE_CHOICE', questionText: 'What should we do FIRST when we wake up in the morning?', options: ['Go straight to eat breakfast', 'Recite the waking du\'a', 'Check our phone', 'Go back to sleep'], correctAnswer: "Recite the waking du'a", explanation: 'When we wake up, we should first recite the waking du\'a: "Alhamdulillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur."' },
  ];

  for (const q of quizData) {
    await prisma.question.upsert({
      where: { externalId: q.externalId },
      create: {
        externalId: q.externalId,
        unitId: q.unitId,
        type: q.type,
        questionText: q.questionText,
        options: q.options !== null ? JSON.stringify(q.options) : undefined,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'EASY',
      },
      update: {
        unitId: q.unitId,
        type: q.type,
        questionText: q.questionText,
        options: q.options !== null ? JSON.stringify(q.options) : undefined,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'EASY',
      },
    });
  }
  console.log(`✅ Upserted ${quizData.length} quiz questions`);

  // ==============================================================
  // FLASHCARDS — 18 total across units (CB5 pattern)
  // ==============================================================

  console.log('');
  console.log('🃏 Creating flashcards...');

  const flashcardData: Array<{ unitId: string; front: string; back: string }> = [
    // ── Unit 1: Five Pillars ──
    { unitId: unitPillars.id, front: 'What are the five pillars of Islam?', back: '1. Shahadah (declaration of faith)\n2. Salah (five daily prayers)\n3. Zakah (charity)\n4. Sawm (fasting in Ramadan)\n5. Hajj (pilgrimage to Makkah)' },
    { unitId: unitPillars.id, front: 'What are the five daily prayers in order?', back: '1. Fajr (morning)\n2. Zuhr (after midday)\n3. Asr (afternoon)\n4. Maghrib (sunset)\n5. Isha (night)' },

    // ── Unit 2: Taharah & Wudu ──
    { unitId: unitTahara.id, front: 'What is taharah?', back: 'Taharah means cleanliness and purity. Allah loves those who are clean. We must have taharah (by making wudu) before we pray salah.' },
    { unitId: unitTahara.id, front: 'What breaks wudu?', back: 'Three things break wudu:\n1. Going to the toilet (urine or stool)\n2. Passing wind (gas)\n3. Falling into a deep sleep' },

    // ── Unit 3: What is a Hadith? ──
    { unitId: unitHadithIntro.id, front: 'What is a hadith?', back: 'A hadith is what Rasulullah SAW said, did himself, or did not say "no" to when he saw it. The plural is ahadith. We follow them because the Quran says to obey the Messenger.' },

    // ── Unit 4: Feeding, Helping & Truthfulness ──
    { unitId: unitHadithChar.id, front: 'Who are the best of people? (Hadith)', back: '"The best of people are those who are most helpful to others." (al-Mu\'jam al-Awsat). Helping others brings us closer to Allah.' },
    { unitId: unitHadithChar.id, front: 'What does truth lead to? (Hadith)', back: '"Hold on to the truth." (Sahih Muslim). Truth leads to Jannah (Paradise). Lying is forbidden and makes Allah unhappy.' },

    // ── Unit 5: Early Life ──
    { unitId: unitSirahEarly.id, front: "Who was Halimah al-Sa'diyyah?", back: "Halimah al-Sa'diyyah was the foster mother of Rasulullah SAW from the tribe of Banu Sa'd. She nursed him in the desert for about four years. Allah greatly blessed her household because of Rasulullah SAW." },
    { unitId: unitSirahEarly.id, front: "Key facts about Rasulullah's birth", back: 'Born in Makkah on a Monday in Rabi al-Awwal. Year of the Elephant. Father: Abdullah (died before his birth). Mother: Aminah. He was an orphan from birth.' },

    // ── Unit 6: Youth & Marriage ──
    { unitId: unitSirahYouth.id, front: 'What does "Al-Amin" mean and why was Rasulullah SAW given this title?', back: '"Al-Amin" means "The Most Trustworthy." The people of Makkah gave Rasulullah SAW this title because he was always honest, never lied, and kept every trust perfectly.' },

    // ── Unit 7: Prophet Adam ──
    { unitId: unitAdam.id, front: 'What was Adam (peace be upon him) created from?', back: 'Allah created Adam (peace be upon him) from clay. He was the first human being and the first prophet. Allah breathed a soul into him and taught him the names of all things.' },
    { unitId: unitAdam.id, front: 'Why did Iblis refuse to prostrate to Adam?', back: 'Iblis was proud and said: "I am better than him! You created me from fire and him from clay." His pride made Allah angry. This is why pride is very dangerous.' },

    // ── Unit 8: Prophet Nuh ──
    { unitId: unitNuh.id, front: 'How long did Nuh (peace be upon him) preach and what happened?', back: 'Nuh SAW called his people to worship Allah alone for 950 years. Most refused. Allah then commanded him to build a large ark (safinah). The great flood came and all disbelievers drowned. The ark rested on Mount Judiyy.' },

    // ── Unit 9: Articles of Faith ──
    { unitId: unitAqaid.id, front: 'What are the seven articles of faith (Iman)?', back: '1. Belief in Allah\n2. Belief in the angels\n3. Belief in the divine books\n4. Belief in the prophets and messengers\n5. Belief in the Last Day (Qiyamah)\n6. Belief in Qadar (divine decree)\n7. Belief in resurrection after death' },
    { unitId: unitAqaid.id, front: 'What is Qadar?', back: 'Qadar means divine decree. We believe that everything — good and bad — happens by the will and knowledge of Allah. Nothing happens in the world without Allah knowing about it.' },

    // ── Unit 10: Respect & Cleanliness ──
    { unitId: unitAkhlaqRespect.id, front: 'Hadith on cleanliness', back: '"Cleanliness is half of faith." (Sahih Muslim). This shows how important being clean is in Islam. A clean Muslim is loved by Allah and by others.' },

    // ── Unit 11: Gentleness, Speech & Smiling ──
    { unitId: unitAkhlaqSpeech.id, front: 'Hadith on smiling', back: '"Your smile for your brother is sadaqah (charity)." (Tirmidhi). Smiling is free, earns reward from Allah, makes people happy, and spreads goodness.' },

    // ── Unit 12: Adab ──
    { unitId: unitAdabDaily.id, front: "Sleeping du'a and position", back: "Du'a: \"Allahumma bismika amutu wa ahya\" (O Allah, with Your name I die and live). Sleep on the RIGHT side with right hand under right cheek. Make wudu before sleeping." },
  ];

  // Delete existing flashcards for this course then re-create
  await prisma.flashCard.deleteMany({ where: { courseId: course.id } });

  for (const fc of flashcardData) {
    await prisma.flashCard.create({
      data: {
        unitId: fc.unitId,
        courseId: course.id,
        front: fc.front,
        back: fc.back,
        category: 'Vocabulary',
        tags: ['maktab-1'],
        orderIndex: flashcardData.filter(f => f.unitId === fc.unitId).indexOf(fc),
      },
    });
  }
  console.log(`✅ Created ${flashcardData.length} flashcards`);

  // ==============================================================
  // ARABIC TERMS — 12 total, arabicText + translation only
  // ==============================================================

  console.log('');
  console.log('📖 Creating Arabic terms...');

  const arabicTermsData: Array<{ unitId: string; arabicText: string; transliteration: string; translation: string }> = [
    { unitId: unitPillars.id, arabicText: '\u0634\u064e\u0647\u064e\u0627\u062f\u064e\u0629', transliteration: 'Shahadah', translation: 'Shahadah — the declaration of faith: "There is no god but Allah and Muhammad is His messenger." The first and most important pillar of Islam.' },
    { unitId: unitTahara.id, arabicText: '\u0648\u064f\u0636\u064f\u0648\u0621', transliteration: 'Wudu', translation: 'Wudu — the special way of washing (ablution) we do before salah. We wash our hands, mouth, nose, face, arms, head, ears, and feet.' },
    { unitId: unitHadithIntro.id, arabicText: '\u062d\u064e\u062f\u0650\u064a\u062b', transliteration: 'Hadith', translation: 'Hadith — a record of what Rasulullah SAW said, did, or approved of. The plural is ahadith. We follow them because Allah says to obey the Messenger.' },
    { unitId: unitHadithChar.id, arabicText: '\u0635\u0650\u062f\u0652\u0642', transliteration: 'Sidq', translation: 'Sidq — truthfulness. Islam teaches us to always speak the truth. Truth leads to Jannah and is one of the best qualities a Muslim can have.' },
    { unitId: unitSirahEarly.id, arabicText: '\u0633\u0650\u064a\u0631\u064e\u0629', transliteration: 'Sirah', translation: 'Sirah — the life story and biography of Rasulullah SAW. Learning his life helps us follow his beautiful example.' },
    { unitId: unitSirahYouth.id, arabicText: '\u0627\u0644\u0652\u0623\u064e\u0645\u0650\u064a\u0646', transliteration: 'Al-Amin', translation: 'Al-Amin — "The Most Trustworthy." A title given to Rasulullah SAW by the people of Makkah because of his perfect honesty and trustworthiness.' },
    { unitId: unitAdam.id, arabicText: '\u0625\u0650\u0628\u0652\u0644\u0650\u064a\u0633', transliteration: 'Iblis', translation: "Iblis — another name for Shaytan (the devil). He was proud and refused to obey Allah's command to prostrate to Adam. He is the enemy of humans." },
    { unitId: unitNuh.id, arabicText: '\u0633\u064e\u0641\u0650\u064a\u0646\u064e\u0629', transliteration: 'Safinah', translation: 'Safinah — a ship or ark. Allah commanded Nuh (peace be upon him) to build a great ark to save the believers and animals from the flood.' },
    { unitId: unitAqaid.id, arabicText: '\u0625\u0650\u064a\u0645\u064e\u0627\u0646', transliteration: 'Iman', translation: "Iman — faith and belief. A Muslim's iman includes seven articles: belief in Allah, angels, divine books, prophets, the Last Day, Qadar, and resurrection." },
    { unitId: unitAkhlaqRespect.id, arabicText: '\u0637\u064e\u0647\u064e\u0627\u0631\u064e\u0629', transliteration: 'Taharah', translation: 'Taharah — purity and cleanliness. Rasulullah SAW said cleanliness is half of faith. We must keep our body, clothes and surroundings clean.' },
    { unitId: unitAkhlaqSpeech.id, arabicText: '\u0635\u064e\u062f\u064e\u0642\u064e\u0629', transliteration: 'Sadaqah', translation: 'Sadaqah — voluntary charity or a good deed. Even smiling at your brother and speaking a kind word is sadaqah and earns reward from Allah.' },
    { unitId: unitAdabDaily.id, arabicText: '\u0623\u064e\u062f\u064e\u0628', transliteration: 'Adab', translation: 'Adab — Islamic etiquette and good manners. Following the adab of Rasulullah SAW in eating, drinking, sleeping, and daily life is an act of worship.' },
  ];

  // Delete and re-create Arabic terms per unit
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
  console.log(`✅ Created ${arabicTermsData.length} Arabic terms`);

  console.log('\n🎉 Maktab Coursebook 1 seed complete!');
  console.log('   Course: Maktab Coursebook 1');
  console.log('   Units: 12 focused units (was 7 broad units)');
  console.log('   Subjects: Fiqh (2), Ahadith (2), Sirah (2), Tarikh (2), Aqaid (1), Akhlaq (2), Adab (1)');
  console.log(`   Quiz questions: ${quizData.length}`);
  console.log(`   Flashcards: ${flashcardData.length}`);
  console.log(`   Arabic terms: ${arabicTermsData.length}`);
}

// ──────────────────────────────────────────────
// Standalone execution
// ──────────────────────────────────────────────
async function main() {
  try {
    await seedMaktabCoursebook1();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Maktab Coursebook 1:', error);
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
