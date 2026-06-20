import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 1 — Islamic Curriculum Seed
 * Source: An Nasihah Publications, Age Range: 6–7 years
 *
 * Covers seven subjects: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā'id, Akhlāq, Ādāb
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions and flashcards per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-coursebook1.ts
 */

export async function seedMaktabCoursebook1() {
  console.log('📚 Starting Maktab Coursebook 1 seed...');
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
    where: { slug: 'maktab-coursebook-1' },
    create: {
      slug: 'maktab-coursebook-1',
      title: 'Maktab Coursebook 1',
      description: 'A comprehensive Islamic curriculum for young learners aged 6–7 years. Covers the five pillars of Islam, wuḍū\', key aḥādīth, the childhood of Rasūlullāh ﷺ, stories of the prophets Ādam and Nūḥ عليهم السلام, articles of faith, good manners (akhlāq), and daily Islamic etiquette (ādāb). Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['EARLY_CHILD', 'CHILD'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 1',
      description: 'A comprehensive Islamic curriculum for young learners aged 6–7 years. Covers the five pillars of Islam, wuḍū\', key aḥādīth, the childhood of Rasūlullāh ﷺ, stories of the prophets Ādam and Nūḥ عليهم السلام, articles of faith, good manners (akhlāq), and daily Islamic etiquette (ādāb). Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['EARLY_CHILD', 'CHILD'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // UNIT 1: FIQH
  // ──────────────────────────────────────────────

    const unitFiqh = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-fiqh' } },
    create: {
      slug: 'maktab-1-fiqh',
      courseId: course.id,
      title: 'Fiqh — The Five Pillars, Ṭahārah & Wuḍū\'',
      description: 'Learn the five pillars of Islam, the importance of cleanliness (ṭahārah), and the step-by-step method of wuḍū\' (ablution).',
      orderIndex: 0,
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Summarise the five pillars of Islam and develop an understanding of each pillar.</li>
  <li>Apply ṭahārah and understand its importance in everyday life.</li>
  <li>Identify and practise the method of wuḍū'.</li>
</ul>

<h2>The Pillars of Islām</h2>
<p>Imagine a house with very strong walls. No matter how much it rains or how windy it is, the house will stay strong. You can push as hard as you want, but the house will just not move!</p>
<p>Just like this strong house, Islām also has strong walls which are called pillars. These pillars are called the <strong>'Pillars of Islam'</strong>. There are five pillars of Islam. If we keep these pillars strong in our life, our Islām will never fall down!</p>

<h3>1. Shahādah</h3>
<p>The first and most important pillar of Islām is the shahādah.</p>
<p>The shahādah is to believe and say that there is no god but Allāh and our Beloved Messenger Muḥammad ﷺ is His servant and messenger.</p>
<p>The words of shahādah are:</p>
<p><em>"I believe that there is no god but Allāh, and I believe that Muḥammad ﷺ is His servant and messenger."</em></p>

<h3>2. Ṣalāh</h3>
<p>Ṣalāh is the second pillar of Islām. It is a special way Muslims pray to Allāh five times a day.</p>
<ul>
  <li>Ṣalāh is a gift from Allāh.</li>
  <li>Ṣalāh is a way of asking Allāh.</li>
  <li>Ṣalāh is a way of thanking Allāh.</li>
</ul>
<p>If we pray ṣalāh everyday, Allāh will be happy with us and give us Jannah.</p>
<p>The five daily ṣalāh are: <strong>Fajr, Ḍhuhr, 'Aṣr, Maghrib, 'Ishā'</strong></p>
<p><em>Fajr in the morning, Ḍhuhr after midday, 'Aṣr in the afternoon, Maghrib when the sun goes down, 'Ishā' before we sleep.</em></p>

<h3>3. Zakāh</h3>
<p>The third pillar of Islām is zakāh — giving money to those in need.</p>
<p>Allāh has told us to give a little amount of money once a year to the people in need. Zakāh teaches us to care. Zakāh teaches us to share. If we give zakāh, Allāh will be happy with us and give us more!</p>

<h3>4. Ṣawm (Fasting)</h3>
<p>The fourth pillar of Islām is ṣawm. Ṣawm is the Arabic word for fasting — when a person does not eat or drink during the day.</p>
<p>Allāh has told us to fast in the month of Ramaḍān.</p>
<ul>
  <li>Fasting teaches us how the poor people feel.</li>
  <li>Fasting teaches us to be thankful.</li>
  <li>Fasting teaches us to share.</li>
</ul>
<p>If we fast, we can become close friends of Allāh.</p>

<h3>5. Ḥajj</h3>
<p>The fifth pillar of Islām is Ḥajj — a special journey to the city of Makkah.</p>
<p>A Muslim who has enough money and is able to go must do Ḥajj at least once in their life.</p>
<p>In Makkah there is a special building called the Ka'bah. We face the Ka'bah when we pray our ṣalāh five times a day. In Ḥajj, we go around the Ka'bah seven times — this is known as ṭawāf.</p>
<p>After Ḥajj, Muslims go to Madīnah Munawwarah to visit the blessed city of Rasūlullāh ﷺ. This is known as ziyārah.</p>

<h2>Ṭahārah (Cleanliness)</h2>
<p>For us to pray ṣalāh, we must have ṭahārah. Ṭahārah means to be clean.</p>
<p>Allāh loves clean people. Rasūlullāh ﷺ taught and showed us how to be clean all the time. We must wash and take a bath regularly. We should clean ourselves properly in the washroom.</p>

<h2>Wuḍū' (Ablution)</h2>
<p>Allāh has taught us a special way to clean ourselves before we stand in ṣalāh. This special way is called wuḍū'.</p>
<p>Whoever does wuḍū' properly all the time, his face, hands and feet will shine brightly on the Day of Judgement.</p>

<h3>How to do wuḍū'</h3>
<ol>
  <li>Say <strong>'Bismillāh'</strong> to start.</li>
  <li>Wash both hands till the wrist.</li>
  <li>Rinse the mouth three times.</li>
  <li>Rinse the nose three times with the right hand, then clean it once with the left hand.</li>
  <li>Wash the full face three times — from the top of the forehead to the bottom of the chin and from one ear to the other.</li>
  <li>Wash both arms three times, including the elbows, starting with the right. Pass the fingers of each hand through the other hand (khilāl).</li>
  <li>Pass wet hands on the head all the way to the back (masaḥ). Wipe the ears inside and out using the index fingers; use the thumbs to wipe the back of the ears.</li>
  <li>Wash the feet three times, starting with the right, including the ankles. Do khilāl of the toes.</li>
</ol>
      `.trim(),
    },
    update: {
      title: 'Fiqh — The Five Pillars, Ṭahārah & Wuḍū\'',
      description: 'Learn the five pillars of Islam, the importance of cleanliness (ṭahārah), and the step-by-step method of wuḍū\' (ablution).',
      content: `
<h2>Learning Objectives</h2>
<p>By the end of this unit, pupils will be able to:</p>
<ul>
  <li>Summarise the five pillars of Islam and develop an understanding of each pillar.</li>
  <li>Apply ṭahārah and understand its importance in everyday life.</li>
  <li>Identify and practise the method of wuḍū'.</li>
</ul>

<h2>The Pillars of Islām</h2>
<p>Imagine a house with very strong walls. No matter how much it rains or how windy it is, the house will stay strong. You can push as hard as you want, but the house will just not move!</p>
<p>Just like this strong house, Islām also has strong walls which are called pillars. These pillars are called the <strong>'Pillars of Islam'</strong>. There are five pillars of Islam. If we keep these pillars strong in our life, our Islām will never fall down!</p>

<h3>1. Shahādah</h3>
<p>The first and most important pillar of Islām is the shahādah.</p>
<p>The shahādah is to believe and say that there is no god but Allāh and our Beloved Messenger Muḥammad ﷺ is His servant and messenger.</p>
<p>The words of shahādah are:</p>
<p><em>"I believe that there is no god but Allāh, and I believe that Muḥammad ﷺ is His servant and messenger."</em></p>

<h3>2. Ṣalāh</h3>
<p>Ṣalāh is the second pillar of Islām. It is a special way Muslims pray to Allāh five times a day.</p>
<ul>
  <li>Ṣalāh is a gift from Allāh.</li>
  <li>Ṣalāh is a way of asking Allāh.</li>
  <li>Ṣalāh is a way of thanking Allāh.</li>
</ul>
<p>If we pray ṣalāh everyday, Allāh will be happy with us and give us Jannah.</p>
<p>The five daily ṣalāh are: <strong>Fajr, Ḍhuhr, 'Aṣr, Maghrib, 'Ishā'</strong></p>
<p><em>Fajr in the morning, Ḍhuhr after midday, 'Aṣr in the afternoon, Maghrib when the sun goes down, 'Ishā' before we sleep.</em></p>

<h3>3. Zakāh</h3>
<p>The third pillar of Islām is zakāh — giving money to those in need.</p>
<p>Allāh has told us to give a little amount of money once a year to the people in need. Zakāh teaches us to care. Zakāh teaches us to share. If we give zakāh, Allāh will be happy with us and give us more!</p>

<h3>4. Ṣawm (Fasting)</h3>
<p>The fourth pillar of Islām is ṣawm. Ṣawm is the Arabic word for fasting — when a person does not eat or drink during the day.</p>
<p>Allāh has told us to fast in the month of Ramaḍān.</p>
<ul>
  <li>Fasting teaches us how the poor people feel.</li>
  <li>Fasting teaches us to be thankful.</li>
  <li>Fasting teaches us to share.</li>
</ul>
<p>If we fast, we can become close friends of Allāh.</p>

<h3>5. Ḥajj</h3>
<p>The fifth pillar of Islām is Ḥajj — a special journey to the city of Makkah.</p>
<p>A Muslim who has enough money and is able to go must do Ḥajj at least once in their life.</p>
<p>In Makkah there is a special building called the Ka'bah. We face the Ka'bah when we pray our ṣalāh five times a day. In Ḥajj, we go around the Ka'bah seven times — this is known as ṭawāf.</p>
<p>After Ḥajj, Muslims go to Madīnah Munawwarah to visit the blessed city of Rasūlullāh ﷺ. This is known as ziyārah.</p>

<h2>Ṭahārah (Cleanliness)</h2>
<p>For us to pray ṣalāh, we must have ṭahārah. Ṭahārah means to be clean.</p>
<p>Allāh loves clean people. Rasūlullāh ﷺ taught and showed us how to be clean all the time. We must wash and take a bath regularly. We should clean ourselves properly in the washroom.</p>

<h2>Wuḍū' (Ablution)</h2>
<p>Allāh has taught us a special way to clean ourselves before we stand in ṣalāh. This special way is called wuḍū'.</p>
<p>Whoever does wuḍū' properly all the time, his face, hands and feet will shine brightly on the Day of Judgement.</p>

<h3>How to do wuḍū'</h3>
<ol>
  <li>Say <strong>'Bismillāh'</strong> to start.</li>
  <li>Wash both hands till the wrist.</li>
  <li>Rinse the mouth three times.</li>
  <li>Rinse the nose three times with the right hand, then clean it once with the left hand.</li>
  <li>Wash the full face three times — from the top of the forehead to the bottom of the chin and from one ear to the other.</li>
  <li>Wash both arms three times, including the elbows, starting with the right. Pass the fingers of each hand through the other hand (khilāl).</li>
  <li>Pass wet hands on the head all the way to the back (masaḥ). Wipe the ears inside and out using the index fingers; use the thumbs to wipe the back of the ears.</li>
  <li>Wash the feet three times, starting with the right, including the ankles. Do khilāl of the toes.</li>
</ol>
      `.trim(),
      orderIndex: 0,
    },
  });

  console.log('✅ Created Unit 1: Fiqh');

  // ──────────────────────────────────────────────
  // UNIT 2: AḤĀDĪTH
  // ──────────────────────────────────────────────

    const unitAhadith = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-ahadith' } },
    create: {
      slug: 'maktab-1-ahadith',
      courseId: course.id,
      title: 'Aḥādīth — Sayings of Rasūlullāh ﷺ',
      description: 'Five key aḥādīth for young Muslims: feeding the hungry, helping others, doing things calmly, staying clean, and speaking the truth.',
      orderIndex: 1,
      content: `
<h2>What is a Ḥadīth?</h2>
<p>Ḥadīth (plural: Aḥādīth) is what Rasūlullāh ﷺ said, did himself, or didn't say 'no' to when he saw it.</p>

<h3>1. Feeding the Hungry &amp; Visiting the Sick</h3>
<p class="arabic" dir="rtl" lang="ar">أَطْعِمُوا الْجَائِعَ وَعُودُوا الْمَرِيضَ</p>
<p><em>A'imul jā'ia wa 'ūdul marīḍa</em></p>
<p><strong>"Feed the hungry and visit the sick."</strong> (Ṣaḥīḥ al-Bukhārī)</p>
<p>Allāh has blessed us in so many ways. In this ḥadīth, Rasūlullāh ﷺ is reminding us to feed the hungry so we can share what we have. The second lesson is to visit the sick — when someone is not well, visiting them makes them very happy. By following these two lessons we will learn to care and be grateful.</p>

<h3>2. Helping Others</h3>
<p class="arabic" dir="rtl" lang="ar">خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ</p>
<p><em>Khayrun nāsi anfa'uhum linnāsi</em></p>
<p><strong>"The best of people are those who are most helpful to others."</strong> (al-Mu'jam al-Awsaṭ)</p>
<p>To help someone in need is a good action. Here are some ideas you can try this week:</p>
<ul>
  <li>Clean your room.</li>
  <li>Tidy up your toys.</li>
  <li>Pick up some litter.</li>
  <li>Help wash the dishes.</li>
  <li>Explain the lesson to someone.</li>
</ul>

<h3>3. Doing Things Calmly</h3>
<p class="arabic" dir="rtl" lang="ar">الأَنَاةُ مِنَ اللَّهِ وَالْعَجَلَةُ مِنَ الشَّيْطَانِ</p>
<p><em>Al-anātu minallāhi wal-'ajalatu minash-shayṭāni</em></p>
<p><strong>"Doing things calmly is from Allāh and doing things in a hurry is from Shayṭān."</strong> (Tirmidhī)</p>
<p>If we do something in a hurry, we are more likely to make mistakes. Rasūlullāh ﷺ is teaching us that doing things calmly is something Allāh loves. Always remember to do things calmly!</p>

<h3>4. Staying Clean</h3>
<p class="arabic" dir="rtl" lang="ar">الطُّهُورُ شَطْرُ الإِيمَانِ</p>
<p><em>Aṭ-ṭuhūru shaṭrul īmāni</em></p>
<p><strong>"Purity is half of īmān."</strong> (Ṣaḥīḥ Muslim)</p>
<p>It is so important for us to stay clean that Rasūlullāh ﷺ said it is "half of īmān." Īmān is what we believe in — the key to Jannah. We must keep our body, clothes, house, masjid and surroundings clean.</p>

<h3>5. Speaking the Truth</h3>
<p class="arabic" dir="rtl" lang="ar">عَلَيْكُمْ بِالصِّدْقِ</p>
<p><em>'Alaykum biṣ-ṣidqi</em></p>
<p><strong>"Hold on to the truth."</strong> (Ṣaḥīḥ Muslim)</p>
<p>We must never let the truth go and must stay away from lying.</p>
<p><strong>The Story of 'Abdul Qādir:</strong> 'Abdul Qādir was a young boy who went to Baghdād to learn. His mum gave him money and told him, "My dear son, never lie!" One day robbers stopped the caravan. When they asked what he had, 'Abdul Qādir told them he had forty gold coins. The leader of the gang was so shocked by his truthfulness that he began crying and changed his ways. 'Abdul Qādir grew up to become a very great friend of Allāh.</p>
      `.trim(),
    },
    update: {
      title: 'Aḥādīth — Sayings of Rasūlullāh ﷺ',
      description: 'Five key aḥādīth for young Muslims: feeding the hungry, helping others, doing things calmly, staying clean, and speaking the truth.',
      content: `
<h2>What is a Ḥadīth?</h2>
<p>Ḥadīth (plural: Aḥādīth) is what Rasūlullāh ﷺ said, did himself, or didn't say 'no' to when he saw it.</p>

<h3>1. Feeding the Hungry &amp; Visiting the Sick</h3>
<p class="arabic" dir="rtl" lang="ar">أَطْعِمُوا الْجَائِعَ وَعُودُوا الْمَرِيضَ</p>
<p><em>A'imul jā'ia wa 'ūdul marīḍa</em></p>
<p><strong>"Feed the hungry and visit the sick."</strong> (Ṣaḥīḥ al-Bukhārī)</p>
<p>Allāh has blessed us in so many ways. In this ḥadīth, Rasūlullāh ﷺ is reminding us to feed the hungry so we can share what we have. The second lesson is to visit the sick — when someone is not well, visiting them makes them very happy. By following these two lessons we will learn to care and be grateful.</p>

<h3>2. Helping Others</h3>
<p class="arabic" dir="rtl" lang="ar">خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ</p>
<p><em>Khayrun nāsi anfa'uhum linnāsi</em></p>
<p><strong>"The best of people are those who are most helpful to others."</strong> (al-Mu'jam al-Awsaṭ)</p>
<p>To help someone in need is a good action. Here are some ideas you can try this week:</p>
<ul>
  <li>Clean your room.</li>
  <li>Tidy up your toys.</li>
  <li>Pick up some litter.</li>
  <li>Help wash the dishes.</li>
  <li>Explain the lesson to someone.</li>
</ul>

<h3>3. Doing Things Calmly</h3>
<p class="arabic" dir="rtl" lang="ar">الأَنَاةُ مِنَ اللَّهِ وَالْعَجَلَةُ مِنَ الشَّيْطَانِ</p>
<p><em>Al-anātu minallāhi wal-'ajalatu minash-shayṭāni</em></p>
<p><strong>"Doing things calmly is from Allāh and doing things in a hurry is from Shayṭān."</strong> (Tirmidhī)</p>
<p>If we do something in a hurry, we are more likely to make mistakes. Rasūlullāh ﷺ is teaching us that doing things calmly is something Allāh loves. Always remember to do things calmly!</p>

<h3>4. Staying Clean</h3>
<p class="arabic" dir="rtl" lang="ar">الطُّهُورُ شَطْرُ الإِيمَانِ</p>
<p><em>Aṭ-ṭuhūru shaṭrul īmāni</em></p>
<p><strong>"Purity is half of īmān."</strong> (Ṣaḥīḥ Muslim)</p>
<p>It is so important for us to stay clean that Rasūlullāh ﷺ said it is "half of īmān." Īmān is what we believe in — the key to Jannah. We must keep our body, clothes, house, masjid and surroundings clean.</p>

<h3>5. Speaking the Truth</h3>
<p class="arabic" dir="rtl" lang="ar">عَلَيْكُمْ بِالصِّدْقِ</p>
<p><em>'Alaykum biṣ-ṣidqi</em></p>
<p><strong>"Hold on to the truth."</strong> (Ṣaḥīḥ Muslim)</p>
<p>We must never let the truth go and must stay away from lying.</p>
<p><strong>The Story of 'Abdul Qādir:</strong> 'Abdul Qādir was a young boy who went to Baghdād to learn. His mum gave him money and told him, "My dear son, never lie!" One day robbers stopped the caravan. When they asked what he had, 'Abdul Qādir told them he had forty gold coins. The leader of the gang was so shocked by his truthfulness that he began crying and changed his ways. 'Abdul Qādir grew up to become a very great friend of Allāh.</p>
      `.trim(),
      orderIndex: 1,
    },
  });

  console.log('✅ Created Unit 2: Aḥādīth');

  // ──────────────────────────────────────────────
  // UNIT 3: SĪRAH
  // ──────────────────────────────────────────────

    const unitSirah = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-sirah' } },
    create: {
      slug: 'maktab-1-sirah',
      courseId: course.id,
      title: 'Sīrah — The Life of Rasūlullāh ﷺ',
      description: 'The childhood of Rasūlullāh ﷺ, his youth, his trustworthy character, and his marriage to Khadījah رضي الله عنها.',
      orderIndex: 2,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Outline key points from the childhood of Rasūlullāh ﷺ.</li>
  <li>Describe the youth of Rasūlullāh ﷺ.</li>
  <li>Summarise the marriage of Rasūlullāh ﷺ to Khadījah رضي الله عنها.</li>
  <li>Recall the names of Rasūlullāh ﷺ's children.</li>
</ul>

<h3>Childhood of Rasūlullāh ﷺ</h3>
<p>Our Beloved Messenger Muḥammad ﷺ was born in the city of Makkah, early on a Monday morning of Rabī' al-Awwal. The year he was born was known as <strong>'The Year of the Elephant'</strong> — in this year Abrahah, the governor of Yemen, decided to attack the Ka'bah with his army of elephants.</p>
<p>Allāh protected the Ka'bah and destroyed Abrahah along with his army by sending a group of birds that dropped tiny stones from their beaks.</p>
<p>Muḥammad ﷺ's father's name was <strong>'Abdullāh</strong>, and his mother's name was <strong>Āminah</strong>. Muḥammad ﷺ was an orphan because his father had passed away just before he was born.</p>
<p>It was a habit of the Arabs to send their children to the villages for the first few years of their life, so they could grow up learning the pure Arabic language. <strong>Ḥalīmah رضي الله عنها</strong> from the tribe of Banī Sa'd took baby Muḥammad ﷺ with her. Allāh blessed Ḥalīmah through Rasūlullāh ﷺ — her animals gave more milk and her weak camel became strong. Ḥalīmah kept Rasūlullāh ﷺ for four years.</p>

<h3>When Rasūlullāh ﷺ was Six Years Old</h3>
<p>When he was six years old, Rasūlullāh ﷺ went with his mother Āminah to visit relatives in Madīnah. On their way back, Āminah passed away at a place called Abwā'. Umm Ayman brought Rasūlullāh ﷺ back to Makkah.</p>
<p>Rasūlullāh ﷺ was then cared for by his grandfather, <strong>'Abdul Muṭṭalib</strong>, who was the leader of Makkah and loved him very much. When Rasūlullāh ﷺ was eight years old, 'Abdul Muṭṭalib passed away, after which his uncle <strong>Abū Ṭālib</strong> looked after him.</p>

<h3>The Youth of Rasūlullāh ﷺ</h3>
<p>When Rasūlullāh ﷺ was 12 years old, he went with Abū Ṭālib on a journey to Syria. On the way, a monk named <strong>Baḥīrah</strong> told Abū Ṭālib that his nephew would become the last messenger of Allāh. Baḥīrah saw the trees and stones bowing down to Rasūlullāh ﷺ, and recognised the seal of prophethood between his shoulders.</p>
<p>As Muḥammad ﷺ grew up, the people began to see his great qualities: he was always honest and trustworthy. They called him <strong>Aṣ-Ṣādiq</strong> (the most honest) and <strong>Al-Amīn</strong> (the most trustworthy).</p>

<h4>The Black Stone</h4>
<p>One day the Quraysh decided to rebuild the Ka'bah. When it was time to put the Black Stone in its place, they argued about who should do it. They agreed that whoever entered the Masjid next would decide. Muḥammad ﷺ was the first to enter — he told a person from each tribe to hold a piece of cloth with the Black Stone in the middle, then he lifted it and put it in its place.</p>

<h3>Marriage to Khadījah رضي الله عنها</h3>
<p>In Makkah there lived a very rich woman named <strong>Khadījah رضي الله عنها</strong>. When she heard how honest and trustworthy Muḥammad ﷺ was, she asked him to go on a business trip to Syria and sell her goods. The trip was very successful.</p>
<p>Khadījah expressed her wish to marry Muḥammad ﷺ. He was 25 years old when they married, while Khadījah's age was 40. Allāh blessed them with four daughters and two sons.</p>

<h3>Important Names to Remember</h3>
<table>
  <tr><td><strong>Father</strong></td><td>'Abdullāh</td></tr>
  <tr><td><strong>Mother</strong></td><td>Āminah</td></tr>
  <tr><td><strong>Tribe</strong></td><td>Quraysh</td></tr>
  <tr><td><strong>City</strong></td><td>Makkah</td></tr>
  <tr><td><strong>Foster Mother</strong></td><td>Ḥalīmah Sa'diyyah</td></tr>
  <tr><td><strong>Grandfather</strong></td><td>'Abdul Muṭṭalib</td></tr>
  <tr><td><strong>Uncle</strong></td><td>Abū Ṭālib</td></tr>
  <tr><td><strong>Wife</strong></td><td>Khadījah رضي الله عنها</td></tr>
  <tr><td><strong>Daughters</strong></td><td>Zaynab, Ruqayyah, Umm Kulthūm, Fāṭimah</td></tr>
  <tr><td><strong>Sons</strong></td><td>Qāsim, 'Abdullāh, Ibrāhīm</td></tr>
</table>
      `.trim(),
    },
    update: {
      title: 'Sīrah — The Life of Rasūlullāh ﷺ',
      description: 'The childhood of Rasūlullāh ﷺ, his youth, his trustworthy character, and his marriage to Khadījah رضي الله عنها.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Outline key points from the childhood of Rasūlullāh ﷺ.</li>
  <li>Describe the youth of Rasūlullāh ﷺ.</li>
  <li>Summarise the marriage of Rasūlullāh ﷺ to Khadījah رضي الله عنها.</li>
  <li>Recall the names of Rasūlullāh ﷺ's children.</li>
</ul>

<h3>Childhood of Rasūlullāh ﷺ</h3>
<p>Our Beloved Messenger Muḥammad ﷺ was born in the city of Makkah, early on a Monday morning of Rabī' al-Awwal. The year he was born was known as <strong>'The Year of the Elephant'</strong> — in this year Abrahah, the governor of Yemen, decided to attack the Ka'bah with his army of elephants.</p>
<p>Allāh protected the Ka'bah and destroyed Abrahah along with his army by sending a group of birds that dropped tiny stones from their beaks.</p>
<p>Muḥammad ﷺ's father's name was <strong>'Abdullāh</strong>, and his mother's name was <strong>Āminah</strong>. Muḥammad ﷺ was an orphan because his father had passed away just before he was born.</p>
<p>It was a habit of the Arabs to send their children to the villages for the first few years of their life, so they could grow up learning the pure Arabic language. <strong>Ḥalīmah رضي الله عنها</strong> from the tribe of Banī Sa'd took baby Muḥammad ﷺ with her. Allāh blessed Ḥalīmah through Rasūlullāh ﷺ — her animals gave more milk and her weak camel became strong. Ḥalīmah kept Rasūlullāh ﷺ for four years.</p>

<h3>When Rasūlullāh ﷺ was Six Years Old</h3>
<p>When he was six years old, Rasūlullāh ﷺ went with his mother Āminah to visit relatives in Madīnah. On their way back, Āminah passed away at a place called Abwā'. Umm Ayman brought Rasūlullāh ﷺ back to Makkah.</p>
<p>Rasūlullāh ﷺ was then cared for by his grandfather, <strong>'Abdul Muṭṭalib</strong>, who was the leader of Makkah and loved him very much. When Rasūlullāh ﷺ was eight years old, 'Abdul Muṭṭalib passed away, after which his uncle <strong>Abū Ṭālib</strong> looked after him.</p>

<h3>The Youth of Rasūlullāh ﷺ</h3>
<p>When Rasūlullāh ﷺ was 12 years old, he went with Abū Ṭālib on a journey to Syria. On the way, a monk named <strong>Baḥīrah</strong> told Abū Ṭālib that his nephew would become the last messenger of Allāh. Baḥīrah saw the trees and stones bowing down to Rasūlullāh ﷺ, and recognised the seal of prophethood between his shoulders.</p>
<p>As Muḥammad ﷺ grew up, the people began to see his great qualities: he was always honest and trustworthy. They called him <strong>Aṣ-Ṣādiq</strong> (the most honest) and <strong>Al-Amīn</strong> (the most trustworthy).</p>

<h4>The Black Stone</h4>
<p>One day the Quraysh decided to rebuild the Ka'bah. When it was time to put the Black Stone in its place, they argued about who should do it. They agreed that whoever entered the Masjid next would decide. Muḥammad ﷺ was the first to enter — he told a person from each tribe to hold a piece of cloth with the Black Stone in the middle, then he lifted it and put it in its place.</p>

<h3>Marriage to Khadījah رضي الله عنها</h3>
<p>In Makkah there lived a very rich woman named <strong>Khadījah رضي الله عنها</strong>. When she heard how honest and trustworthy Muḥammad ﷺ was, she asked him to go on a business trip to Syria and sell her goods. The trip was very successful.</p>
<p>Khadījah expressed her wish to marry Muḥammad ﷺ. He was 25 years old when they married, while Khadījah's age was 40. Allāh blessed them with four daughters and two sons.</p>

<h3>Important Names to Remember</h3>
<table>
  <tr><td><strong>Father</strong></td><td>'Abdullāh</td></tr>
  <tr><td><strong>Mother</strong></td><td>Āminah</td></tr>
  <tr><td><strong>Tribe</strong></td><td>Quraysh</td></tr>
  <tr><td><strong>City</strong></td><td>Makkah</td></tr>
  <tr><td><strong>Foster Mother</strong></td><td>Ḥalīmah Sa'diyyah</td></tr>
  <tr><td><strong>Grandfather</strong></td><td>'Abdul Muṭṭalib</td></tr>
  <tr><td><strong>Uncle</strong></td><td>Abū Ṭālib</td></tr>
  <tr><td><strong>Wife</strong></td><td>Khadījah رضي الله عنها</td></tr>
  <tr><td><strong>Daughters</strong></td><td>Zaynab, Ruqayyah, Umm Kulthūm, Fāṭimah</td></tr>
  <tr><td><strong>Sons</strong></td><td>Qāsim, 'Abdullāh, Ibrāhīm</td></tr>
</table>
      `.trim(),
      orderIndex: 2,
    },
  });

  console.log('✅ Created Unit 3: Sīrah');

  // ──────────────────────────────────────────────
  // UNIT 4: TĀRĪKH
  // ──────────────────────────────────────────────

    const unitTarikh = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-tarikh' } },
    create: {
      slug: 'maktab-1-tarikh',
      courseId: course.id,
      title: 'Tārīkh — Stories of the Prophets: Ādam & Nūḥ عليهم السلام',
      description: 'The creation of Ādam عليه السلام, the jealousy of Shayṭān, and the story of Nūḥ عليه السلام and the great flood.',
      orderIndex: 3,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Recall the creation of Ādam عليه السلام and Ḥawwā'.</li>
  <li>Describe the harms of jealousy through the story of Shayṭān.</li>
  <li>Summarise the story of Nūḥ عليه السلام and recall the lessons learnt.</li>
</ul>

<h3>Ādam عليه السلام</h3>
<p>The first man to be created was Ādam عليه السلام. Allāh created Ādam from clay.</p>
<p>When Allāh created Ādam, He commanded all the angels to prostrate before him as a form of salām. All the angels obeyed — but Shayṭān did not obey. He said:</p>
<blockquote>"I am better than him! You created me from fire and created him from clay." (Qur'ān 38:76)</blockquote>
<p>Allāh was angry with Shayṭān and sent him far from His mercy. Shayṭān asked Allāh for a very long life — to live until the Last Day — and Allāh granted this wish.</p>

<p>Ādam عليه السلام was placed in Jannah, where he was happy but lonely. Allāh created a lady named <strong>Ḥawwā'</strong> and made her his wife.</p>

<p>Shayṭān (also called Iblīs) was very jealous. Allāh had told Ādam and Ḥawwā' they could eat from wherever they wanted except the fruit of one tree. Shayṭān tricked them into eating from the forbidden tree.</p>

<p>Ādam and Ḥawwā' called out to Allāh:</p>
<blockquote>"Our Lord, we have done wrong and if You do not forgive us and have mercy upon us, we will most certainly be from amongst the losers." (Qur'ān 7:22-23)</blockquote>
<p>Allāh forgave them both but sent them to the Earth, where they had to work hard for everything.</p>

<h4>Lessons from Ādam عليه السلام</h4>
<ul>
  <li>Shayṭān is our enemy — he is always trying to make us disobey Allāh.</li>
  <li>We must ask Allāh to protect us from Shayṭān's evil whispers.</li>
  <li>Allāh is kind and merciful — even Shayṭān's du'ā' was accepted. We must never stop making du'ā'.</li>
</ul>

<h3>Nūḥ عليه السلام</h3>
<p>After Ādam and Ḥawwā' passed away, their children continued to worship Allāh. But Shayṭān tricked later generations into making pictures, then statues, then idols of pious people who had died — until they began worshipping these idols instead of Allāh.</p>

<p>Allāh chose <strong>Nūḥ عليه السلام</strong> as a messenger to remind the people. Nūḥ called them to pray to Allāh and not to idols made of stone. The people laughed, troubled and hit him, but Nūḥ did not give up.</p>

<p>Nūḥ عليه السلام kept calling people to Allāh for <strong>950 years</strong>. Very few accepted his message.</p>

<p>Nūḥ warned the people of punishment. They laughed and said:</p>
<blockquote>"Bring to us the punishment that you have promised, if you are truthful." (Qur'ān 11:32)</blockquote>

<p>Nūḥ made du'ā':</p>
<blockquote>"My Lord, do not leave a single disbelieving person on the Earth." (Qur'ān 71:26)</blockquote>

<p>Allāh commanded Nūḥ عليه السلام to build a large ship (an ark). He was told to take aboard all the believers and a male and female from every type of animal. Then it rained so much that there was a huge flood — the waves rose as high as mountains.</p>

<p>One son of Nūḥ did not believe. Nūḥ called him to join the Ark, but his son said he would climb a mountain to be saved. A large wave swept him away.</p>

<p>All who disobeyed Allāh were drowned. Those who believed were saved. The Ark stopped at a mountain called <strong>Jūdiyy</strong>.</p>

<h4>Lessons from Nūḥ عليه السلام</h4>
<ul>
  <li>Whether rich or poor, if we love and listen to Allāh then we are special.</li>
  <li>We must never disobey Allāh or make fun of those who invite to His worship.</li>
  <li>We must never give up doing good things — Nūḥ continued for 950 years.</li>
  <li>What matters is that we are good and obedient to our Creator — not who our parents are.</li>
  <li>No one can be saved from Allāh's punishment except those He has mercy on.</li>
</ul>
      `.trim(),
    },
    update: {
      title: 'Tārīkh — Stories of the Prophets: Ādam & Nūḥ عليهم السلام',
      description: 'The creation of Ādam عليه السلام, the jealousy of Shayṭān, and the story of Nūḥ عليه السلام and the great flood.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Recall the creation of Ādam عليه السلام and Ḥawwā'.</li>
  <li>Describe the harms of jealousy through the story of Shayṭān.</li>
  <li>Summarise the story of Nūḥ عليه السلام and recall the lessons learnt.</li>
</ul>

<h3>Ādam عليه السلام</h3>
<p>The first man to be created was Ādam عليه السلام. Allāh created Ādam from clay.</p>
<p>When Allāh created Ādam, He commanded all the angels to prostrate before him as a form of salām. All the angels obeyed — but Shayṭān did not obey. He said:</p>
<blockquote>"I am better than him! You created me from fire and created him from clay." (Qur'ān 38:76)</blockquote>
<p>Allāh was angry with Shayṭān and sent him far from His mercy. Shayṭān asked Allāh for a very long life — to live until the Last Day — and Allāh granted this wish.</p>

<p>Ādam عليه السلام was placed in Jannah, where he was happy but lonely. Allāh created a lady named <strong>Ḥawwā'</strong> and made her his wife.</p>

<p>Shayṭān (also called Iblīs) was very jealous. Allāh had told Ādam and Ḥawwā' they could eat from wherever they wanted except the fruit of one tree. Shayṭān tricked them into eating from the forbidden tree.</p>

<p>Ādam and Ḥawwā' called out to Allāh:</p>
<blockquote>"Our Lord, we have done wrong and if You do not forgive us and have mercy upon us, we will most certainly be from amongst the losers." (Qur'ān 7:22-23)</blockquote>
<p>Allāh forgave them both but sent them to the Earth, where they had to work hard for everything.</p>

<h4>Lessons from Ādam عليه السلام</h4>
<ul>
  <li>Shayṭān is our enemy — he is always trying to make us disobey Allāh.</li>
  <li>We must ask Allāh to protect us from Shayṭān's evil whispers.</li>
  <li>Allāh is kind and merciful — even Shayṭān's du'ā' was accepted. We must never stop making du'ā'.</li>
</ul>

<h3>Nūḥ عليه السلام</h3>
<p>After Ādam and Ḥawwā' passed away, their children continued to worship Allāh. But Shayṭān tricked later generations into making pictures, then statues, then idols of pious people who had died — until they began worshipping these idols instead of Allāh.</p>

<p>Allāh chose <strong>Nūḥ عليه السلام</strong> as a messenger to remind the people. Nūḥ called them to pray to Allāh and not to idols made of stone. The people laughed, troubled and hit him, but Nūḥ did not give up.</p>

<p>Nūḥ عليه السلام kept calling people to Allāh for <strong>950 years</strong>. Very few accepted his message.</p>

<p>Nūḥ warned the people of punishment. They laughed and said:</p>
<blockquote>"Bring to us the punishment that you have promised, if you are truthful." (Qur'ān 11:32)</blockquote>

<p>Nūḥ made du'ā':</p>
<blockquote>"My Lord, do not leave a single disbelieving person on the Earth." (Qur'ān 71:26)</blockquote>

<p>Allāh commanded Nūḥ عليه السلام to build a large ship (an ark). He was told to take aboard all the believers and a male and female from every type of animal. Then it rained so much that there was a huge flood — the waves rose as high as mountains.</p>

<p>One son of Nūḥ did not believe. Nūḥ called him to join the Ark, but his son said he would climb a mountain to be saved. A large wave swept him away.</p>

<p>All who disobeyed Allāh were drowned. Those who believed were saved. The Ark stopped at a mountain called <strong>Jūdiyy</strong>.</p>

<h4>Lessons from Nūḥ عليه السلام</h4>
<ul>
  <li>Whether rich or poor, if we love and listen to Allāh then we are special.</li>
  <li>We must never disobey Allāh or make fun of those who invite to His worship.</li>
  <li>We must never give up doing good things — Nūḥ continued for 950 years.</li>
  <li>What matters is that we are good and obedient to our Creator — not who our parents are.</li>
  <li>No one can be saved from Allāh's punishment except those He has mercy on.</li>
</ul>
      `.trim(),
      orderIndex: 3,
    },
  });

  console.log('✅ Created Unit 4: Tārīkh');

  // ──────────────────────────────────────────────
  // UNIT 5: AQĀ'ID
  // ──────────────────────────────────────────────

    const unitAqaid = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-aqaid' } },
    create: {
      slug: 'maktab-1-aqaid',
      courseId: course.id,
      title: 'Aqā\'id — Articles of Faith & Knowing Allāh',
      description: 'The seven articles of faith, Sūrah al-Ikhlāṣ, and the names of Allāh: Ar-Razzāq and Ar-Raḥmān.',
      orderIndex: 4,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Outline the articles of faith every Muslim must believe in.</li>
  <li>Develop an understanding of the qualities of Allāh.</li>
  <li>Recall two names of Allāh and explain them.</li>
</ul>

<h3>The Articles of Faith</h3>
<p>These are the articles of faith that all Muslims must believe in:</p>
<ol>
  <li><strong>Allāh</strong></li>
  <li><strong>His angels</strong></li>
  <li><strong>His books</strong></li>
  <li><strong>His messengers</strong></li>
  <li><strong>The Last Day</strong></li>
  <li><strong>Fate:</strong> good and bad is all from Allāh</li>
  <li><strong>Life after death</strong></li>
</ol>

<h3>Sūrah al-Ikhlāṣ (Qur'ān 112)</h3>
<p class="arabic" dir="rtl" lang="ar">قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ</p>
<p><strong>Translation:</strong> "Say, Allāh is One. Allāh is Aṣ-Ṣamad (He needs no one and everyone needs Him). He did not give birth nor was He born. And no one is equal to Him."</p>

<h4>About Allāh</h4>
<ul>
  <li>Allāh is our Lord — He created us and to Him we shall all return.</li>
  <li>Allāh is One — He does not have any partners, parents, or children.</li>
  <li>Allāh has always been and will always be.</li>
  <li>We cannot see Allāh but He is watching over each of us all the time.</li>
  <li>He was not created by anyone.</li>
  <li>Allāh has created us to worship and obey Him.</li>
</ul>

<h3>Ar-Razzāq — The Provider</h3>
<p>Allāh gives us everything — from clothes to food and from family to friends. Our parents feed us, but Allāh gave them the strength to work, put love in their hearts, and granted them knowledge. In reality, Allāh is the real Provider.</p>

<p><strong>Story of Al-'Anbar:</strong> The Companions of Rasūlullāh ﷺ were on a journey with no food except dates and water. They reached the coast and found a huge fish known as Al-'Anbar. Three hundred of them ate from it for a whole month! Rasūlullāh ﷺ said: "That was food which Allāh had brought out from the ocean for you." (Ṣaḥīḥ Muslim)</p>

<h3>Ar-Raḥmān — The Most Merciful</h3>
<p>Mercy is to show kindness. Allāh is the Most Kind and the Most Forgiving.</p>

<p><strong>Story of Mūsā عليه السلام:</strong> The mother of Mūsā was worried because people were trying to take her child. Allāh told her to put baby Mūsā in a box in the river. The box floated into Fir'awn's palace. His wife Āsiyah kept the baby, but Mūsā would not take milk from anyone — until his own mother was brought. Allāh returned Mūsā to his mother. SubḥānAllāh!</p>

<p><strong>Ḥadīth:</strong> A woman was searching for her lost child. When she found him, she pressed him to her chest and nursed him. Rasūlullāh ﷺ asked: "Do you think this woman would ever throw her child in the fire?" They replied: "Never." He ﷺ said: <strong>"Allāh is more merciful to His servants than this lady to her son."</strong> (Ṣaḥīḥ al-Bukhārī)</p>
      `.trim(),
    },
    update: {
      title: 'Aqā\'id — Articles of Faith & Knowing Allāh',
      description: 'The seven articles of faith, Sūrah al-Ikhlāṣ, and the names of Allāh: Ar-Razzāq and Ar-Raḥmān.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Outline the articles of faith every Muslim must believe in.</li>
  <li>Develop an understanding of the qualities of Allāh.</li>
  <li>Recall two names of Allāh and explain them.</li>
</ul>

<h3>The Articles of Faith</h3>
<p>These are the articles of faith that all Muslims must believe in:</p>
<ol>
  <li><strong>Allāh</strong></li>
  <li><strong>His angels</strong></li>
  <li><strong>His books</strong></li>
  <li><strong>His messengers</strong></li>
  <li><strong>The Last Day</strong></li>
  <li><strong>Fate:</strong> good and bad is all from Allāh</li>
  <li><strong>Life after death</strong></li>
</ol>

<h3>Sūrah al-Ikhlāṣ (Qur'ān 112)</h3>
<p class="arabic" dir="rtl" lang="ar">قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ</p>
<p><strong>Translation:</strong> "Say, Allāh is One. Allāh is Aṣ-Ṣamad (He needs no one and everyone needs Him). He did not give birth nor was He born. And no one is equal to Him."</p>

<h4>About Allāh</h4>
<ul>
  <li>Allāh is our Lord — He created us and to Him we shall all return.</li>
  <li>Allāh is One — He does not have any partners, parents, or children.</li>
  <li>Allāh has always been and will always be.</li>
  <li>We cannot see Allāh but He is watching over each of us all the time.</li>
  <li>He was not created by anyone.</li>
  <li>Allāh has created us to worship and obey Him.</li>
</ul>

<h3>Ar-Razzāq — The Provider</h3>
<p>Allāh gives us everything — from clothes to food and from family to friends. Our parents feed us, but Allāh gave them the strength to work, put love in their hearts, and granted them knowledge. In reality, Allāh is the real Provider.</p>

<p><strong>Story of Al-'Anbar:</strong> The Companions of Rasūlullāh ﷺ were on a journey with no food except dates and water. They reached the coast and found a huge fish known as Al-'Anbar. Three hundred of them ate from it for a whole month! Rasūlullāh ﷺ said: "That was food which Allāh had brought out from the ocean for you." (Ṣaḥīḥ Muslim)</p>

<h3>Ar-Raḥmān — The Most Merciful</h3>
<p>Mercy is to show kindness. Allāh is the Most Kind and the Most Forgiving.</p>

<p><strong>Story of Mūsā عليه السلام:</strong> The mother of Mūsā was worried because people were trying to take her child. Allāh told her to put baby Mūsā in a box in the river. The box floated into Fir'awn's palace. His wife Āsiyah kept the baby, but Mūsā would not take milk from anyone — until his own mother was brought. Allāh returned Mūsā to his mother. SubḥānAllāh!</p>

<p><strong>Ḥadīth:</strong> A woman was searching for her lost child. When she found him, she pressed him to her chest and nursed him. Rasūlullāh ﷺ asked: "Do you think this woman would ever throw her child in the fire?" They replied: "Never." He ﷺ said: <strong>"Allāh is more merciful to His servants than this lady to her son."</strong> (Ṣaḥīḥ al-Bukhārī)</p>
      `.trim(),
      orderIndex: 4,
    },
  });

  console.log('✅ Created Unit 5: Aqā\'id');

  // ──────────────────────────────────────────────
  // UNIT 6: AKHLĀQ
  // ──────────────────────────────────────────────

    const unitAkhlaq = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-akhlaq' } },
    create: {
      slug: 'maktab-1-akhlaq',
      courseId: course.id,
      title: 'Akhlāq — Good Character & Manners',
      description: 'Respect for elders, cleanliness, gentleness in speech, smiling, and beginning from the right — the Sunnah way.',
      orderIndex: 5,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>State the meaning of respect and compare scenarios relating to it.</li>
  <li>Identify cleanliness and list ways of keeping ourselves and surroundings clean.</li>
  <li>Develop the method of speaking in a polite and gentle manner.</li>
  <li>State and apply the advantages of smiling.</li>
  <li>Identify and practise beginning with the right hand on related actions.</li>
</ul>

<h3>Respect</h3>
<p>Rasūlullāh ﷺ said: <strong>"Whoever does not respect our elders is not one of us."</strong> (Aḥmad)</p>
<p>Respect is to treat someone nicely, knowing they are a precious human being. When we show respect to our elders, Allāh is happy.</p>

<h4>Examples of Showing Respect</h4>
<ul>
  <li><strong>At a door:</strong> Hold the door open for an elderly person. Smile and say a kind word.</li>
  <li><strong>When the teacher enters:</strong> Stop talking, smile, and sit properly.</li>
  <li><strong>When eating with elders:</strong> Wait until they begin before you start eating.</li>
  <li><strong>When speaking:</strong> Do not raise your voice above theirs. Say "please" and "Jazākallāhu Khayran".</li>
</ul>

<p><strong>Story of the Grandchildren:</strong> The beloved grandchildren of Rasūlullāh ﷺ saw an old man doing wuḍū' incorrectly. Instead of embarrassing him, they asked him to watch them do wuḍū' and check if they missed any parts. The man realised his own error without being disrespected.</p>

<p>Rasūlullāh ﷺ said: <strong>"There is not a person who respects an elderly person because of his old age, but Allāh appoints a person who will respect him when he grows old."</strong> (Tirmidhī)</p>

<h3>Cleanliness</h3>
<p>Cleanliness is loved by Allāh. A clean person is loved by everyone.</p>
<h4>Our Body</h4>
<ul>
  <li>Wash your hands before and after meals.</li>
  <li>Brush your teeth twice a day.</li>
  <li>Have a bath regularly.</li>
  <li>Wear clean clothes.</li>
  <li>Comb your hair.</li>
  <li>Keep nails short — germs live under nails.</li>
</ul>
<h4>Around Us</h4>
<ul>
  <li>Keep toys and books neatly put away.</li>
  <li>Make your bed when you wake up.</li>
  <li>Do not eat in the bedroom.</li>
  <li>Move anything harmful out of the way.</li>
</ul>
<p><strong>Allāh loves those who make themselves clean.</strong> (Qur'ān 9:108)</p>

<h3>Gentleness in Speech</h3>
<p>The tongue is a gift from Allāh — we must think before we speak. Our Beloved Messenger ﷺ always spoke gently and said kind words.</p>

<p><strong>Three levels of speaking:</strong></p>
<ul>
  <li><em>"Hey! Do you want one?"</em> — Rough</li>
  <li><em>"Shall I give you one?"</em> — Okay</li>
  <li><em>"Please, take some."</em> — Gentle and kind ✓</li>
</ul>

<p>Rasūlullāh ﷺ said: <strong>"I promise a palace in the highest stages of Jannah for the person who has good manners."</strong> (Abū Dāwūd)</p>
<p>He ﷺ also said: <strong>"Protect yourselves from Jahannam... He who cannot find anything to give, then let him speak good words."</strong> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Smiling</h3>
<p>Rasūlullāh ﷺ said: <strong>"Do not think of any good action to be small, even if it may be meeting your Muslim brother with a smile."</strong> (Ṣaḥīḥ Muslim)</p>
<p>He ﷺ also said: <strong>"Your smile for your brother is charity."</strong> (Tirmidhī)</p>
<ul>
  <li>Smiling doesn't cost anything.</li>
  <li>Smiling is contagious — it spreads fast.</li>
  <li>Smiling brightens your face.</li>
  <li>Smiling keeps us happy and safe from jealousy.</li>
</ul>

<h3>Beginning from the Right Hand Side</h3>
<p>'Ā'ishah رضي الله عنها said: "The Beloved Prophet ﷺ liked to begin with the right when putting on his shoes, combing his hair, performing ablution and in doing anything else." (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Use the right side for:</h4>
<ul>
  <li>Entering the masjid</li>
  <li>Giving or taking something</li>
  <li>Entering the house</li>
  <li>Boarding a vehicle</li>
  <li>Eating and drinking</li>
</ul>

<h4>Use the left side for:</h4>
<ul>
  <li>Entering the washroom</li>
  <li>Cleaning oneself</li>
  <li>Blowing the nose</li>
  <li>Leaving the masjid</li>
  <li>Removing shoes</li>
</ul>
      `.trim(),
    },
    update: {
      title: 'Akhlāq — Good Character & Manners',
      description: 'Respect for elders, cleanliness, gentleness in speech, smiling, and beginning from the right — the Sunnah way.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>State the meaning of respect and compare scenarios relating to it.</li>
  <li>Identify cleanliness and list ways of keeping ourselves and surroundings clean.</li>
  <li>Develop the method of speaking in a polite and gentle manner.</li>
  <li>State and apply the advantages of smiling.</li>
  <li>Identify and practise beginning with the right hand on related actions.</li>
</ul>

<h3>Respect</h3>
<p>Rasūlullāh ﷺ said: <strong>"Whoever does not respect our elders is not one of us."</strong> (Aḥmad)</p>
<p>Respect is to treat someone nicely, knowing they are a precious human being. When we show respect to our elders, Allāh is happy.</p>

<h4>Examples of Showing Respect</h4>
<ul>
  <li><strong>At a door:</strong> Hold the door open for an elderly person. Smile and say a kind word.</li>
  <li><strong>When the teacher enters:</strong> Stop talking, smile, and sit properly.</li>
  <li><strong>When eating with elders:</strong> Wait until they begin before you start eating.</li>
  <li><strong>When speaking:</strong> Do not raise your voice above theirs. Say "please" and "Jazākallāhu Khayran".</li>
</ul>

<p><strong>Story of the Grandchildren:</strong> The beloved grandchildren of Rasūlullāh ﷺ saw an old man doing wuḍū' incorrectly. Instead of embarrassing him, they asked him to watch them do wuḍū' and check if they missed any parts. The man realised his own error without being disrespected.</p>

<p>Rasūlullāh ﷺ said: <strong>"There is not a person who respects an elderly person because of his old age, but Allāh appoints a person who will respect him when he grows old."</strong> (Tirmidhī)</p>

<h3>Cleanliness</h3>
<p>Cleanliness is loved by Allāh. A clean person is loved by everyone.</p>
<h4>Our Body</h4>
<ul>
  <li>Wash your hands before and after meals.</li>
  <li>Brush your teeth twice a day.</li>
  <li>Have a bath regularly.</li>
  <li>Wear clean clothes.</li>
  <li>Comb your hair.</li>
  <li>Keep nails short — germs live under nails.</li>
</ul>
<h4>Around Us</h4>
<ul>
  <li>Keep toys and books neatly put away.</li>
  <li>Make your bed when you wake up.</li>
  <li>Do not eat in the bedroom.</li>
  <li>Move anything harmful out of the way.</li>
</ul>
<p><strong>Allāh loves those who make themselves clean.</strong> (Qur'ān 9:108)</p>

<h3>Gentleness in Speech</h3>
<p>The tongue is a gift from Allāh — we must think before we speak. Our Beloved Messenger ﷺ always spoke gently and said kind words.</p>

<p><strong>Three levels of speaking:</strong></p>
<ul>
  <li><em>"Hey! Do you want one?"</em> — Rough</li>
  <li><em>"Shall I give you one?"</em> — Okay</li>
  <li><em>"Please, take some."</em> — Gentle and kind ✓</li>
</ul>

<p>Rasūlullāh ﷺ said: <strong>"I promise a palace in the highest stages of Jannah for the person who has good manners."</strong> (Abū Dāwūd)</p>
<p>He ﷺ also said: <strong>"Protect yourselves from Jahannam... He who cannot find anything to give, then let him speak good words."</strong> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Smiling</h3>
<p>Rasūlullāh ﷺ said: <strong>"Do not think of any good action to be small, even if it may be meeting your Muslim brother with a smile."</strong> (Ṣaḥīḥ Muslim)</p>
<p>He ﷺ also said: <strong>"Your smile for your brother is charity."</strong> (Tirmidhī)</p>
<ul>
  <li>Smiling doesn't cost anything.</li>
  <li>Smiling is contagious — it spreads fast.</li>
  <li>Smiling brightens your face.</li>
  <li>Smiling keeps us happy and safe from jealousy.</li>
</ul>

<h3>Beginning from the Right Hand Side</h3>
<p>'Ā'ishah رضي الله عنها said: "The Beloved Prophet ﷺ liked to begin with the right when putting on his shoes, combing his hair, performing ablution and in doing anything else." (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Use the right side for:</h4>
<ul>
  <li>Entering the masjid</li>
  <li>Giving or taking something</li>
  <li>Entering the house</li>
  <li>Boarding a vehicle</li>
  <li>Eating and drinking</li>
</ul>

<h4>Use the left side for:</h4>
<ul>
  <li>Entering the washroom</li>
  <li>Cleaning oneself</li>
  <li>Blowing the nose</li>
  <li>Leaving the masjid</li>
  <li>Removing shoes</li>
</ul>
      `.trim(),
      orderIndex: 5,
    },
  });

  console.log('✅ Created Unit 6: Akhlāq');

  // ──────────────────────────────────────────────
  // UNIT 7: ĀDĀB
  // ──────────────────────────────────────────────

    const unitAdab = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-1-adab' } },
    create: {
      slug: 'maktab-1-adab',
      courseId: course.id,
      title: 'Ādāb — Islamic Etiquette for Daily Life',
      description: 'The Sunnah etiquette of eating, drinking, sleeping, waking up, and using the washroom.',
      orderIndex: 6,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>List the ādāb of eating.</li>
  <li>List the ādāb of drinking.</li>
  <li>Identify and order the ādāb of sleeping.</li>
  <li>Identify and order the ādāb of waking up.</li>
  <li>State the ādāb of using the washroom.</li>
</ul>

<h3>Ādāb of Eating</h3>
<p>Ibn 'Umar رضي الله عنهما reported that Rasūlullāh ﷺ said: <strong>"None of you should eat with his left hand or drink with it, because Shayṭān eats with his left hand and drinks with it."</strong> (Ṣaḥīḥ Muslim)</p>
<p>Rasūlullāh ﷺ said: <strong>"When one of you eats, he should mention Allāh's name (say 'Bismillāh'). If he forgets at the beginning, then he should say: 'Bismillāhi fī awwalihi wa ākhirihi' (In the name of Allāh in the beginning and the end)."</strong> (Abū Dāwūd)</p>

<h4>Steps for Eating</h4>
<ol>
  <li>Wash both hands up to the wrist.</li>
  <li>Rinse the mouth before eating.</li>
  <li>Do not find faults in the food.</li>
  <li>Remove shoes before sitting to eat.</li>
  <li>Sit on the floor to eat — do not lean.</li>
  <li>Eat with your right hand.</li>
  <li>Use three fingers while eating.</li>
  <li>Do not eat hot food — let it cool down.</li>
  <li>If sharing a plate, eat from the side closest to you.</li>
  <li>Finish the food on your plate.</li>
  <li>Lick your fingers — it is a sunnah.</li>
  <li>Pray the du'ā' after eating.</li>
</ol>
<p><strong>Du'ā' after eating:</strong></p>
<p class="arabic" dir="rtl" lang="ar">اَلْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ</p>
<p><em>Alḥamdulillāhil-ladhī aṭ'amanā wa saqānā wa ja'alanā muslimīn</em></p>
<p>"Praise be to Allāh who fed us, gave us drink and made us Muslims." (Abū Dāwūd)</p>

<h3>Ādāb of Drinking</h3>
<p>Rasūlullāh ﷺ said: <strong>"Do not drink water in one gulp like camels, but drink it in two or three sips, and say Allāh's name when you begin, and praise Him when you finish."</strong> (Tirmidhī)</p>
<ul>
  <li>Drink from a cup, not directly from a large bottle.</li>
  <li>Say <strong>Bismillāh</strong> before you drink.</li>
  <li>Drink in three sips.</li>
  <li>Look inside the cup.</li>
  <li>Do not use gold or silver cups.</li>
  <li>Do not breathe into the cup.</li>
  <li>Drink whilst seated.</li>
  <li>Say <strong>Alḥamdulillāh</strong> when you finish.</li>
</ul>

<h3>Ādāb of Sleeping</h3>
<p>Barā' رضي الله عنه reports that when Rasūlullāh ﷺ went to bed, he put his right hand under his right cheek and recited du'ā'.</p>
<ol>
  <li>Sleep with wuḍū'.</li>
  <li>Dust the bed.</li>
  <li>Sleep on the right side.</li>
  <li>Place right hand under the right cheek.</li>
  <li>Avoid sleeping on the stomach.</li>
  <li>Recite the du'ā':</li>
</ol>
<p class="arabic" dir="rtl" lang="ar">اَللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا</p>
<p><em>Allāhumma bismika amūtu wa aḥyā</em></p>
<p>"O Allāh, with Your name I die and live." (Ṣaḥīḥ al-Bukhārī)</p>
<ul>
  <li>Read Sūrah al-Ikhlāṣ, Sūrah al-Falaq and Sūrah an-Nās.</li>
  <li>Blow into your palms, then rub them over the body three times, starting from the head.</li>
  <li>Recite: SubḥānAllāh 33 times, Alḥamdulillāh 33 times, Allāhu Akbar 34 times.</li>
</ul>
<p><strong>If you have a nightmare:</strong> Say "A'ūdhu billāhi minash-shayṭānir-rajīm" (I seek refuge in Allāh from the cursed Shayṭān), blow lightly on the left side three times, and change the side you are sleeping on.</p>

<h3>Ādāb of Waking Up</h3>
<p>When Rasūlullāh ﷺ woke up, he would say:</p>
<p class="arabic" dir="rtl" lang="ar">اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ</p>
<p><em>Alḥamdulillāhil-ladhī aḥyānā ba'da mā amātanā wa ilayhin-nushūr</em></p>
<p>"All praise is for Allāh who gave us life after causing us to die, and to Him is the return." (Ṣaḥīḥ al-Bukhārī)</p>
<ol>
  <li>Recite the du'ā'.</li>
  <li>Rub your palms on your eyes to wipe the sleep away.</li>
  <li>Wash your hands.</li>
  <li>Brush your teeth — it is better to use a miswāk.</li>
</ol>

<h3>Ādāb of Using the Washroom</h3>
<p>Anas رضي الله عنه reports that when Rasūlullāh ﷺ entered the washroom, he would say:</p>
<p class="arabic" dir="rtl" lang="ar">اَللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ</p>
<p><em>Allāhumma innī a'ūdhu bika minal-khubuthi wal-khabā'ith</em></p>
<p>"O Allāh, I seek refuge in You from all evil and evil-doers." (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Steps</h4>
<ol>
  <li>Cover your hair.</li>
  <li>Recite the du'ā'.</li>
  <li>Enter with your left foot.</li>
  <li>Do not face your front or back towards the Qiblah.</li>
  <li>Sit and use the toilet (do not stand).</li>
  <li>Wash yourself with your left hand.</li>
  <li>Do not talk.</li>
  <li>Wash your hands with soap.</li>
  <li>Leave with your right foot.</li>
</ol>
<p><strong>Du'ā' upon leaving:</strong></p>
<p class="arabic" dir="rtl" lang="ar">غُفْرَانَكَ</p>
<p><em>Ghufrānaka</em> — "I seek Your forgiveness." (Tirmidhī)</p>
<p class="arabic" dir="rtl" lang="ar">اَلْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الأَذَى وَعَافَانِي</p>
<p><em>Alḥamdulillāhil-ladhī adh-haba 'annil-adhā wa 'āfānī</em></p>
<p>"Praise be to Allāh who took away harm from me and relieved me." (Ibn Mājah)</p>
      `.trim(),
    },
    update: {
      title: 'Ādāb — Islamic Etiquette for Daily Life',
      description: 'The Sunnah etiquette of eating, drinking, sleeping, waking up, and using the washroom.',
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>List the ādāb of eating.</li>
  <li>List the ādāb of drinking.</li>
  <li>Identify and order the ādāb of sleeping.</li>
  <li>Identify and order the ādāb of waking up.</li>
  <li>State the ādāb of using the washroom.</li>
</ul>

<h3>Ādāb of Eating</h3>
<p>Ibn 'Umar رضي الله عنهما reported that Rasūlullāh ﷺ said: <strong>"None of you should eat with his left hand or drink with it, because Shayṭān eats with his left hand and drinks with it."</strong> (Ṣaḥīḥ Muslim)</p>
<p>Rasūlullāh ﷺ said: <strong>"When one of you eats, he should mention Allāh's name (say 'Bismillāh'). If he forgets at the beginning, then he should say: 'Bismillāhi fī awwalihi wa ākhirihi' (In the name of Allāh in the beginning and the end)."</strong> (Abū Dāwūd)</p>

<h4>Steps for Eating</h4>
<ol>
  <li>Wash both hands up to the wrist.</li>
  <li>Rinse the mouth before eating.</li>
  <li>Do not find faults in the food.</li>
  <li>Remove shoes before sitting to eat.</li>
  <li>Sit on the floor to eat — do not lean.</li>
  <li>Eat with your right hand.</li>
  <li>Use three fingers while eating.</li>
  <li>Do not eat hot food — let it cool down.</li>
  <li>If sharing a plate, eat from the side closest to you.</li>
  <li>Finish the food on your plate.</li>
  <li>Lick your fingers — it is a sunnah.</li>
  <li>Pray the du'ā' after eating.</li>
</ol>
<p><strong>Du'ā' after eating:</strong></p>
<p class="arabic" dir="rtl" lang="ar">اَلْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ</p>
<p><em>Alḥamdulillāhil-ladhī aṭ'amanā wa saqānā wa ja'alanā muslimīn</em></p>
<p>"Praise be to Allāh who fed us, gave us drink and made us Muslims." (Abū Dāwūd)</p>

<h3>Ādāb of Drinking</h3>
<p>Rasūlullāh ﷺ said: <strong>"Do not drink water in one gulp like camels, but drink it in two or three sips, and say Allāh's name when you begin, and praise Him when you finish."</strong> (Tirmidhī)</p>
<ul>
  <li>Drink from a cup, not directly from a large bottle.</li>
  <li>Say <strong>Bismillāh</strong> before you drink.</li>
  <li>Drink in three sips.</li>
  <li>Look inside the cup.</li>
  <li>Do not use gold or silver cups.</li>
  <li>Do not breathe into the cup.</li>
  <li>Drink whilst seated.</li>
  <li>Say <strong>Alḥamdulillāh</strong> when you finish.</li>
</ul>

<h3>Ādāb of Sleeping</h3>
<p>Barā' رضي الله عنه reports that when Rasūlullāh ﷺ went to bed, he put his right hand under his right cheek and recited du'ā'.</p>
<ol>
  <li>Sleep with wuḍū'.</li>
  <li>Dust the bed.</li>
  <li>Sleep on the right side.</li>
  <li>Place right hand under the right cheek.</li>
  <li>Avoid sleeping on the stomach.</li>
  <li>Recite the du'ā':</li>
</ol>
<p class="arabic" dir="rtl" lang="ar">اَللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا</p>
<p><em>Allāhumma bismika amūtu wa aḥyā</em></p>
<p>"O Allāh, with Your name I die and live." (Ṣaḥīḥ al-Bukhārī)</p>
<ul>
  <li>Read Sūrah al-Ikhlāṣ, Sūrah al-Falaq and Sūrah an-Nās.</li>
  <li>Blow into your palms, then rub them over the body three times, starting from the head.</li>
  <li>Recite: SubḥānAllāh 33 times, Alḥamdulillāh 33 times, Allāhu Akbar 34 times.</li>
</ul>
<p><strong>If you have a nightmare:</strong> Say "A'ūdhu billāhi minash-shayṭānir-rajīm" (I seek refuge in Allāh from the cursed Shayṭān), blow lightly on the left side three times, and change the side you are sleeping on.</p>

<h3>Ādāb of Waking Up</h3>
<p>When Rasūlullāh ﷺ woke up, he would say:</p>
<p class="arabic" dir="rtl" lang="ar">اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ</p>
<p><em>Alḥamdulillāhil-ladhī aḥyānā ba'da mā amātanā wa ilayhin-nushūr</em></p>
<p>"All praise is for Allāh who gave us life after causing us to die, and to Him is the return." (Ṣaḥīḥ al-Bukhārī)</p>
<ol>
  <li>Recite the du'ā'.</li>
  <li>Rub your palms on your eyes to wipe the sleep away.</li>
  <li>Wash your hands.</li>
  <li>Brush your teeth — it is better to use a miswāk.</li>
</ol>

<h3>Ādāb of Using the Washroom</h3>
<p>Anas رضي الله عنه reports that when Rasūlullāh ﷺ entered the washroom, he would say:</p>
<p class="arabic" dir="rtl" lang="ar">اَللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ</p>
<p><em>Allāhumma innī a'ūdhu bika minal-khubuthi wal-khabā'ith</em></p>
<p>"O Allāh, I seek refuge in You from all evil and evil-doers." (Ṣaḥīḥ al-Bukhārī)</p>

<h4>Steps</h4>
<ol>
  <li>Cover your hair.</li>
  <li>Recite the du'ā'.</li>
  <li>Enter with your left foot.</li>
  <li>Do not face your front or back towards the Qiblah.</li>
  <li>Sit and use the toilet (do not stand).</li>
  <li>Wash yourself with your left hand.</li>
  <li>Do not talk.</li>
  <li>Wash your hands with soap.</li>
  <li>Leave with your right foot.</li>
</ol>
<p><strong>Du'ā' upon leaving:</strong></p>
<p class="arabic" dir="rtl" lang="ar">غُفْرَانَكَ</p>
<p><em>Ghufrānaka</em> — "I seek Your forgiveness." (Tirmidhī)</p>
<p class="arabic" dir="rtl" lang="ar">اَلْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الأَذَى وَعَافَانِي</p>
<p><em>Alḥamdulillāhil-ladhī adh-haba 'annil-adhā wa 'āfānī</em></p>
<p>"Praise be to Allāh who took away harm from me and relieved me." (Ibn Mājah)</p>
      `.trim(),
      orderIndex: 6,
    },
  });

  console.log('✅ Created Unit 7: Ādāb');

  // ══════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('📝 Creating quiz questions...');

  // --- Fiqh Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-1-fiqh-q1' },
      create: {
        externalId: 'maktab-1-fiqh-q1',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many pillars of Islam are there?',
        options: JSON.stringify(['Three', 'Four', 'Five', 'Six']),
        correctAnswer: 'Five',
        explanation: 'There are five pillars of Islam: Shahādah, Ṣalāh, Zakāh, Ṣawm, and Ḥajj.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How many pillars of Islam are there?',
        options: JSON.stringify(['Three', 'Four', 'Five', 'Six']),
        correctAnswer: 'Five',
        explanation: 'There are five pillars of Islam: Shahādah, Ṣalāh, Zakāh, Ṣawm, and Ḥajj.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-fiqh-q2' },
      create: {
        externalId: 'maktab-1-fiqh-q2',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the first and most important pillar of Islam?',
        options: JSON.stringify(['Ṣalāh', 'Shahādah', 'Zakāh', 'Ḥajj']),
        correctAnswer: 'Shahādah',
        explanation: 'The shahādah is the first and most important pillar — to believe that there is no god but Allāh and Muḥammad ﷺ is His servant and messenger.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What is the first and most important pillar of Islam?',
        options: JSON.stringify(['Ṣalāh', 'Shahādah', 'Zakāh', 'Ḥajj']),
        correctAnswer: 'Shahādah',
        explanation: 'The shahādah is the first and most important pillar — to believe that there is no god but Allāh and Muḥammad ﷺ is His servant and messenger.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-fiqh-q3' },
      create: {
        externalId: 'maktab-1-fiqh-q3',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many times a day do Muslims pray ṣalāh?',
        options: JSON.stringify(['Three', 'Four', 'Five', 'Seven']),
        correctAnswer: 'Five',
        explanation: 'Muslims pray five times a day: Fajr, Ḍhuhr, \'Aṣr, Maghrib, and \'Ishā\'.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How many times a day do Muslims pray ṣalāh?',
        options: JSON.stringify(['Three', 'Four', 'Five', 'Seven']),
        correctAnswer: 'Five',
        explanation: 'Muslims pray five times a day: Fajr, Ḍhuhr, \'Aṣr, Maghrib, and \'Ishā\'.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-fiqh-q4' },
      create: {
        externalId: 'maktab-1-fiqh-q4',
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'Zakāh means fasting during Ramaḍān.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Zakāh means giving money to those in need. Fasting during Ramaḍān is called ṣawm.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Zakāh means fasting during Ramaḍān.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Zakāh means giving money to those in need. Fasting during Ramaḍān is called ṣawm.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-fiqh-q5' },
      create: {
        externalId: 'maktab-1-fiqh-q5',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the special building in Makkah that Muslims face when praying?',
        options: JSON.stringify(['The Masjid', 'The Ka\'bah', 'The Minaret', 'The Palace']),
        correctAnswer: 'The Ka\'bah',
        explanation: 'The Ka\'bah is a special building in Makkah. We face it when we pray, and during Ḥajj we go around it seven times (ṭawāf).',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What is the special building in Makkah that Muslims face when praying?',
        options: JSON.stringify(['The Masjid', 'The Ka\'bah', 'The Minaret', 'The Palace']),
        correctAnswer: 'The Ka\'bah',
        explanation: 'The Ka\'bah is a special building in Makkah. We face it when we pray, and during Ḥajj we go around it seven times (ṭawāf).',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-fiqh-q6' },
      create: {
        externalId: 'maktab-1-fiqh-q6',
        unitId: unitFiqh.id,
        type: 'FILL_BLANK',
        questionText: 'The special way to clean ourselves before ṣalāh is called _____.',
        options: undefined,
        correctAnswer: 'wuḍū\'',
        explanation: 'Wuḍū\' (ablution) is the special way Allāh taught us to clean ourselves before standing in ṣalāh.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The special way to clean ourselves before ṣalāh is called _____.',
        options: undefined,
        correctAnswer: 'wuḍū\'',
        explanation: 'Wuḍū\' (ablution) is the special way Allāh taught us to clean ourselves before standing in ṣalāh.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-fiqh-q7' },
      create: {
        externalId: 'maktab-1-fiqh-q7',
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What do we say at the start of wuḍū\'?',
        options: JSON.stringify(['Alḥamdulillāh', 'Bismillāh', 'SubḥānAllāh', 'Allāhu Akbar']),
        correctAnswer: 'Bismillāh',
        explanation: 'We say "Bismillāh" (In the name of Allāh) to start wuḍū\'.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What do we say at the start of wuḍū\'?',
        options: JSON.stringify(['Alḥamdulillāh', 'Bismillāh', 'SubḥānAllāh', 'Allāhu Akbar']),
        correctAnswer: 'Bismillāh',
        explanation: 'We say "Bismillāh" (In the name of Allāh) to start wuḍū\'.',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Aḥādīth Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-1-ahadith-q1' },
      create: {
        externalId: 'maktab-1-ahadith-q1',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is a ḥadīth?',
        options: JSON.stringify([
          'A chapter of the Qur\'ān',
          'What Rasūlullāh ﷺ said, did, or approved',
          'A type of prayer',
          'A story from long ago',
        ]),
        correctAnswer: 'What Rasūlullāh ﷺ said, did, or approved',
        explanation: 'A ḥadīth is what Rasūlullāh ﷺ said, did himself, or didn\'t say \'no\' to when he saw it.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What is a ḥadīth?',
        options: JSON.stringify([
          'A chapter of the Qur\'ān',
          'What Rasūlullāh ﷺ said, did, or approved',
          'A type of prayer',
          'A story from long ago',
        ]),
        correctAnswer: 'What Rasūlullāh ﷺ said, did, or approved',
        explanation: 'A ḥadīth is what Rasūlullāh ﷺ said, did himself, or didn\'t say \'no\' to when he saw it.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-ahadith-q2' },
      create: {
        externalId: 'maktab-1-ahadith-q2',
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'Rasūlullāh ﷺ said: "_____ the hungry and visit the sick."',
        options: undefined,
        correctAnswer: 'Feed',
        explanation: '"Feed the hungry and visit the sick." (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Rasūlullāh ﷺ said: "_____ the hungry and visit the sick."',
        options: undefined,
        correctAnswer: 'Feed',
        explanation: '"Feed the hungry and visit the sick." (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-ahadith-q3' },
      create: {
        externalId: 'maktab-1-ahadith-q3',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth, who are the best of people?',
        options: JSON.stringify([
          'The richest people',
          'The strongest people',
          'Those who are most helpful to others',
          'The oldest people',
        ]),
        correctAnswer: 'Those who are most helpful to others',
        explanation: '"The best of people are those who are most helpful to others." (al-Mu\'jam al-Awsaṭ)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'According to the ḥadīth, who are the best of people?',
        options: JSON.stringify([
          'The richest people',
          'The strongest people',
          'Those who are most helpful to others',
          'The oldest people',
        ]),
        correctAnswer: 'Those who are most helpful to others',
        explanation: '"The best of people are those who are most helpful to others." (al-Mu\'jam al-Awsaṭ)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-ahadith-q4' },
      create: {
        externalId: 'maktab-1-ahadith-q4',
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'Doing things in a hurry is something that Allāh loves.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Doing things calmly is from Allāh, and doing things in a hurry is from Shayṭān. (Tirmidhī)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Doing things in a hurry is something that Allāh loves.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Doing things calmly is from Allāh, and doing things in a hurry is from Shayṭān. (Tirmidhī)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-ahadith-q5' },
      create: {
        externalId: 'maktab-1-ahadith-q5',
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'Rasūlullāh ﷺ said: "Purity is half of _____."',
        options: undefined,
        correctAnswer: 'īmān',
        explanation: '"Purity is half of īmān." (Ṣaḥīḥ Muslim). Staying clean is very important in Islam.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Rasūlullāh ﷺ said: "Purity is half of _____."',
        options: undefined,
        correctAnswer: 'īmān',
        explanation: '"Purity is half of īmān." (Ṣaḥīḥ Muslim). Staying clean is very important in Islam.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-ahadith-q6' },
      create: {
        externalId: 'maktab-1-ahadith-q6',
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the story, why did the robber leader start crying when he met young \'Abdul Qādir?',
        options: JSON.stringify([
          'He was hurt',
          'He was shocked by the boy\'s truthfulness',
          'He lost his gold coins',
          'He was scared',
        ]),
        correctAnswer: 'He was shocked by the boy\'s truthfulness',
        explanation: '\'Abdul Qādir told the truth about having forty gold coins. The leader was so moved by this honesty that he changed his ways.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'In the story, why did the robber leader start crying when he met young \'Abdul Qādir?',
        options: JSON.stringify([
          'He was hurt',
          'He was shocked by the boy\'s truthfulness',
          'He lost his gold coins',
          'He was scared',
        ]),
        correctAnswer: 'He was shocked by the boy\'s truthfulness',
        explanation: '\'Abdul Qādir told the truth about having forty gold coins. The leader was so moved by this honesty that he changed his ways.',
        difficulty: 'MEDIUM',
      },
    })
  ]);

  // --- Sīrah Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-1-sirah-q1' },
      create: {
        externalId: 'maktab-1-sirah-q1',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In which city was Rasūlullāh ﷺ born?',
        options: JSON.stringify(['Madīnah', 'Makkah', 'Syria', 'Baghdād']),
        correctAnswer: 'Makkah',
        explanation: 'Our Beloved Messenger Muḥammad ﷺ was born in the city of Makkah, early on a Monday morning of Rabī\' al-Awwal.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'In which city was Rasūlullāh ﷺ born?',
        options: JSON.stringify(['Madīnah', 'Makkah', 'Syria', 'Baghdād']),
        correctAnswer: 'Makkah',
        explanation: 'Our Beloved Messenger Muḥammad ﷺ was born in the city of Makkah, early on a Monday morning of Rabī\' al-Awwal.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-sirah-q2' },
      create: {
        externalId: 'maktab-1-sirah-q2',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What was the name of Rasūlullāh ﷺ\'s foster mother?',
        options: JSON.stringify(['Āminah', 'Khadījah', 'Ḥalīmah', 'Āsiyah']),
        correctAnswer: 'Ḥalīmah',
        explanation: 'Ḥalīmah Sa\'diyyah from the tribe of Banī Sa\'d was the foster mother of Rasūlullāh ﷺ.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What was the name of Rasūlullāh ﷺ\'s foster mother?',
        options: JSON.stringify(['Āminah', 'Khadījah', 'Ḥalīmah', 'Āsiyah']),
        correctAnswer: 'Ḥalīmah',
        explanation: 'Ḥalīmah Sa\'diyyah from the tribe of Banī Sa\'d was the foster mother of Rasūlullāh ﷺ.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-sirah-q3' },
      create: {
        externalId: 'maktab-1-sirah-q3',
        unitId: unitSirah.id,
        type: 'FILL_BLANK',
        questionText: 'The people called Muḥammad ﷺ "Aṣ-Ṣādiq" (the most honest) and "Al-_____" (the most trustworthy).',
        options: undefined,
        correctAnswer: 'Amīn',
        explanation: 'The people of Makkah recognised Muḥammad ﷺ\'s great qualities and called him Aṣ-Ṣādiq (the most honest) and Al-Amīn (the most trustworthy).',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'The people called Muḥammad ﷺ "Aṣ-Ṣādiq" (the most honest) and "Al-_____" (the most trustworthy).',
        options: undefined,
        correctAnswer: 'Amīn',
        explanation: 'The people of Makkah recognised Muḥammad ﷺ\'s great qualities and called him Aṣ-Ṣādiq (the most honest) and Al-Amīn (the most trustworthy).',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-sirah-q4' },
      create: {
        externalId: 'maktab-1-sirah-q4',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who looked after Rasūlullāh ﷺ after his grandfather \'Abdul Muṭṭalib passed away?',
        options: JSON.stringify(['\'Abdullāh', 'Baḥīrah', 'Abū Ṭālib', 'Maysarah']),
        correctAnswer: 'Abū Ṭālib',
        explanation: 'After \'Abdul Muṭṭalib passed away when Rasūlullāh ﷺ was eight years old, his uncle Abū Ṭālib looked after him.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Who looked after Rasūlullāh ﷺ after his grandfather \'Abdul Muṭṭalib passed away?',
        options: JSON.stringify(['\'Abdullāh', 'Baḥīrah', 'Abū Ṭālib', 'Maysarah']),
        correctAnswer: 'Abū Ṭālib',
        explanation: 'After \'Abdul Muṭṭalib passed away when Rasūlullāh ﷺ was eight years old, his uncle Abū Ṭālib looked after him.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-sirah-q5' },
      create: {
        externalId: 'maktab-1-sirah-q5',
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How old was Muḥammad ﷺ when he married Khadījah رضي الله عنها?',
        options: JSON.stringify(['12 years', '20 years', '25 years', '40 years']),
        correctAnswer: '25 years',
        explanation: 'Muḥammad ﷺ was 25 years old when he married Khadījah رضي الله عنها, while her age was 40.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How old was Muḥammad ﷺ when he married Khadījah رضي الله عنها?',
        options: JSON.stringify(['12 years', '20 years', '25 years', '40 years']),
        correctAnswer: '25 years',
        explanation: 'Muḥammad ﷺ was 25 years old when he married Khadījah رضي الله عنها, while her age was 40.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-sirah-q6' },
      create: {
        externalId: 'maktab-1-sirah-q6',
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'Rasūlullāh ﷺ\'s father \'Abdullāh was alive when he was born.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Muḥammad ﷺ was an orphan because his father \'Abdullāh had passed away just before he was born.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Rasūlullāh ﷺ\'s father \'Abdullāh was alive when he was born.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Muḥammad ﷺ was an orphan because his father \'Abdullāh had passed away just before he was born.',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Tārīkh Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-1-tarikh-q1' },
      create: {
        externalId: 'maktab-1-tarikh-q1',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who was the first man created by Allāh?',
        options: JSON.stringify(['Nūḥ', 'Ibrāhīm', 'Ādam', 'Mūsā']),
        correctAnswer: 'Ādam',
        explanation: 'The first man to be created was Ādam عليه السلام. Allāh created him from clay.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Who was the first man created by Allāh?',
        options: JSON.stringify(['Nūḥ', 'Ibrāhīm', 'Ādam', 'Mūsā']),
        correctAnswer: 'Ādam',
        explanation: 'The first man to be created was Ādam عليه السلام. Allāh created him from clay.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-tarikh-q2' },
      create: {
        externalId: 'maktab-1-tarikh-q2',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Why did Shayṭān refuse to bow to Ādam عليه السلام?',
        options: JSON.stringify([
          'He was sleeping',
          'He thought he was better because he was made from fire',
          'He did not hear the command',
          'He was too far away',
        ]),
        correctAnswer: 'He thought he was better because he was made from fire',
        explanation: 'Shayṭān said: "I am better than him! You created me from fire and created him from clay." (Qur\'ān 38:76)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Why did Shayṭān refuse to bow to Ādam عليه السلام?',
        options: JSON.stringify([
          'He was sleeping',
          'He thought he was better because he was made from fire',
          'He did not hear the command',
          'He was too far away',
        ]),
        correctAnswer: 'He thought he was better because he was made from fire',
        explanation: 'Shayṭān said: "I am better than him! You created me from fire and created him from clay." (Qur\'ān 38:76)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-tarikh-q3' },
      create: {
        externalId: 'maktab-1-tarikh-q3',
        unitId: unitTarikh.id,
        type: 'FILL_BLANK',
        questionText: 'Allāh created a lady named _____ and made her Ādam\'s wife.',
        options: undefined,
        correctAnswer: 'Ḥawwā\'',
        explanation: 'Allāh created Ḥawwā\' and made her Ādam عليه السلام\'s wife. They both lived in Jannah.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Allāh created a lady named _____ and made her Ādam\'s wife.',
        options: undefined,
        correctAnswer: 'Ḥawwā\'',
        explanation: 'Allāh created Ḥawwā\' and made her Ādam عليه السلام\'s wife. They both lived in Jannah.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-tarikh-q4' },
      create: {
        externalId: 'maktab-1-tarikh-q4',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many years did Nūḥ عليه السلام call his people to Allāh?',
        options: JSON.stringify(['100 years', '500 years', '950 years', '1000 years']),
        correctAnswer: '950 years',
        explanation: 'Nūḥ عليه السلام kept calling people to Allāh for 950 years, and still most did not listen.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How many years did Nūḥ عليه السلام call his people to Allāh?',
        options: JSON.stringify(['100 years', '500 years', '950 years', '1000 years']),
        correctAnswer: '950 years',
        explanation: 'Nūḥ عليه السلام kept calling people to Allāh for 950 years, and still most did not listen.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-tarikh-q5' },
      create: {
        externalId: 'maktab-1-tarikh-q5',
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: 'Everyone in Nūḥ عليه السلام\'s family was saved from the flood.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'One son of Nūḥ عليه السلام did not believe. He refused to board the Ark and was drowned.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Everyone in Nūḥ عليه السلام\'s family was saved from the flood.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'One son of Nūḥ عليه السلام did not believe. He refused to board the Ark and was drowned.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-tarikh-q6' },
      create: {
        externalId: 'maktab-1-tarikh-q6',
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Where did Nūḥ عليه السلام\'s Ark stop after the flood?',
        options: JSON.stringify(['Makkah', 'Madīnah', 'Mount Jūdiyy', 'Syria']),
        correctAnswer: 'Mount Jūdiyy',
        explanation: 'The Ark stopped at a mountain called Jūdiyy after the flood waters receded.',
        difficulty: 'MEDIUM',
      },
      update: {
        questionText: 'Where did Nūḥ عليه السلام\'s Ark stop after the flood?',
        options: JSON.stringify(['Makkah', 'Madīnah', 'Mount Jūdiyy', 'Syria']),
        correctAnswer: 'Mount Jūdiyy',
        explanation: 'The Ark stopped at a mountain called Jūdiyy after the flood waters receded.',
        difficulty: 'MEDIUM',
      },
    })
  ]);

  // --- Aqā'id Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-1-aqaid-q1' },
      create: {
        externalId: 'maktab-1-aqaid-q1',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many articles of faith must a Muslim believe in?',
        options: JSON.stringify(['Five', 'Six', 'Seven', 'Eight']),
        correctAnswer: 'Seven',
        explanation: 'The seven articles: Allāh, His angels, His books, His messengers, the Last Day, fate (good and bad), and life after death.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How many articles of faith must a Muslim believe in?',
        options: JSON.stringify(['Five', 'Six', 'Seven', 'Eight']),
        correctAnswer: 'Seven',
        explanation: 'The seven articles: Allāh, His angels, His books, His messengers, the Last Day, fate (good and bad), and life after death.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-aqaid-q2' },
      create: {
        externalId: 'maktab-1-aqaid-q2',
        unitId: unitAqaid.id,
        type: 'FILL_BLANK',
        questionText: 'Sūrah al-Ikhlāṣ teaches us: "Say, Allāh is _____."',
        options: undefined,
        correctAnswer: 'One',
        explanation: '"Say, Allāh is One. Allāh is Aṣ-Ṣamad…" (Qur\'ān, Sūrah 112)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Sūrah al-Ikhlāṣ teaches us: "Say, Allāh is _____."',
        options: undefined,
        correctAnswer: 'One',
        explanation: '"Say, Allāh is One. Allāh is Aṣ-Ṣamad…" (Qur\'ān, Sūrah 112)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-aqaid-q3' },
      create: {
        externalId: 'maktab-1-aqaid-q3',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the name "Ar-Razzāq" mean?',
        options: JSON.stringify(['The Most Merciful', 'The Provider', 'The Creator', 'The Protector']),
        correctAnswer: 'The Provider',
        explanation: 'Ar-Razzāq means "The Provider" — Allāh gives us everything, from clothes to food and from family to friends.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does the name "Ar-Razzāq" mean?',
        options: JSON.stringify(['The Most Merciful', 'The Provider', 'The Creator', 'The Protector']),
        correctAnswer: 'The Provider',
        explanation: 'Ar-Razzāq means "The Provider" — Allāh gives us everything, from clothes to food and from family to friends.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-aqaid-q4' },
      create: {
        externalId: 'maktab-1-aqaid-q4',
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'Allāh was created by someone else.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'He was not created by anyone. He does not depend on anybody but everyone depends on Him.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Allāh was created by someone else.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'He was not created by anyone. He does not depend on anybody but everyone depends on Him.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-aqaid-q5' },
      create: {
        externalId: 'maktab-1-aqaid-q5',
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the ḥadīth about mercy, what did Rasūlullāh ﷺ say about Allāh\'s mercy?',
        options: JSON.stringify([
          'It is the same as a mother\'s love',
          'It is more than a mother\'s love for her child',
          'It is less than a mother\'s love',
          'It cannot be compared',
        ]),
        correctAnswer: 'It is more than a mother\'s love for her child',
        explanation: '"Allāh is more merciful to His servants than this lady to her son." (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'In the ḥadīth about mercy, what did Rasūlullāh ﷺ say about Allāh\'s mercy?',
        options: JSON.stringify([
          'It is the same as a mother\'s love',
          'It is more than a mother\'s love for her child',
          'It is less than a mother\'s love',
          'It cannot be compared',
        ]),
        correctAnswer: 'It is more than a mother\'s love for her child',
        explanation: '"Allāh is more merciful to His servants than this lady to her son." (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Akhlāq Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-1-akhlaq-q1' },
      create: {
        externalId: 'maktab-1-akhlaq-q1',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did Rasūlullāh ﷺ say about respecting elders?',
        options: JSON.stringify([
          '"They should respect us first"',
          '"Whoever does not respect our elders is not one of us"',
          '"Only respect the rich"',
          '"Respect is not important"',
        ]),
        correctAnswer: '"Whoever does not respect our elders is not one of us"',
        explanation: 'Rasūlullāh ﷺ said: "Whoever does not respect our elders is not one of us." (Aḥmad)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What did Rasūlullāh ﷺ say about respecting elders?',
        options: JSON.stringify([
          '"They should respect us first"',
          '"Whoever does not respect our elders is not one of us"',
          '"Only respect the rich"',
          '"Respect is not important"',
        ]),
        correctAnswer: '"Whoever does not respect our elders is not one of us"',
        explanation: 'Rasūlullāh ﷺ said: "Whoever does not respect our elders is not one of us." (Aḥmad)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-akhlaq-q2' },
      create: {
        externalId: 'maktab-1-akhlaq-q2',
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'Smiling at your Muslim brother is a form of charity.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Rasūlullāh ﷺ said: "Your smile for your brother is charity." (Tirmidhī)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Smiling at your Muslim brother is a form of charity.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Rasūlullāh ﷺ said: "Your smile for your brother is charity." (Tirmidhī)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-akhlaq-q3' },
      create: {
        externalId: 'maktab-1-akhlaq-q3',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which foot should you enter the masjid with?',
        options: JSON.stringify(['Left foot', 'Right foot', 'Either foot', 'Both feet']),
        correctAnswer: 'Right foot',
        explanation: 'It is sunnah to enter the masjid with the right foot and enter the washroom with the left foot.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Which foot should you enter the masjid with?',
        options: JSON.stringify(['Left foot', 'Right foot', 'Either foot', 'Both feet']),
        correctAnswer: 'Right foot',
        explanation: 'It is sunnah to enter the masjid with the right foot and enter the washroom with the left foot.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-akhlaq-q4' },
      create: {
        externalId: 'maktab-1-akhlaq-q4',
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which is the most polite way to offer sweets?',
        options: JSON.stringify([
          '"Hey! Do you want one?"',
          '"Shall I give you one?"',
          '"Please, take some."',
          '"Take it or leave it."',
        ]),
        correctAnswer: '"Please, take some."',
        explanation: '"Please, take some" is the gentlest way to speak. If you make someone happy, Allāh will be happy with you.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Which is the most polite way to offer sweets?',
        options: JSON.stringify([
          '"Hey! Do you want one?"',
          '"Shall I give you one?"',
          '"Please, take some."',
          '"Take it or leave it."',
        ]),
        correctAnswer: '"Please, take some."',
        explanation: '"Please, take some" is the gentlest way to speak. If you make someone happy, Allāh will be happy with you.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-akhlaq-q5' },
      create: {
        externalId: 'maktab-1-akhlaq-q5',
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: 'Allāh loves those who make themselves _____. (Qur\'ān 9:108)',
        options: undefined,
        correctAnswer: 'clean',
        explanation: '"Allāh loves those who make themselves clean." (Qur\'ān 9:108)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Allāh loves those who make themselves _____. (Qur\'ān 9:108)',
        options: undefined,
        correctAnswer: 'clean',
        explanation: '"Allāh loves those who make themselves clean." (Qur\'ān 9:108)',
        difficulty: 'EASY',
      },
    })
  ]);

  // --- Ādāb Quizzes ---
    await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'maktab-1-adab-q1' },
      create: {
        externalId: 'maktab-1-adab-q1',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What should we say before eating?',
        options: JSON.stringify(['Alḥamdulillāh', 'SubḥānAllāh', 'Bismillāh', 'Allāhu Akbar']),
        correctAnswer: 'Bismillāh',
        explanation: 'We should say Bismillāh (In the name of Allāh) before eating. If we forget at the start, we say "Bismillāhi fī awwalihi wa ākhirihi".',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What should we say before eating?',
        options: JSON.stringify(['Alḥamdulillāh', 'SubḥānAllāh', 'Bismillāh', 'Allāhu Akbar']),
        correctAnswer: 'Bismillāh',
        explanation: 'We should say Bismillāh (In the name of Allāh) before eating. If we forget at the start, we say "Bismillāhi fī awwalihi wa ākhirihi".',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-adab-q2' },
      create: {
        externalId: 'maktab-1-adab-q2',
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'We should eat with our left hand.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Rasūlullāh ﷺ said: "None of you should eat with his left hand or drink with it, because Shayṭān eats with his left hand." (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'We should eat with our left hand.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Rasūlullāh ﷺ said: "None of you should eat with his left hand or drink with it, because Shayṭān eats with his left hand." (Ṣaḥīḥ Muslim)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-adab-q3' },
      create: {
        externalId: 'maktab-1-adab-q3',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many sips should we drink water in?',
        options: JSON.stringify(['One', 'Two or three', 'Five', 'Seven']),
        correctAnswer: 'Two or three',
        explanation: '"Do not drink water in one gulp like camels, but drink it in two or three sips." (Tirmidhī)',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'How many sips should we drink water in?',
        options: JSON.stringify(['One', 'Two or three', 'Five', 'Seven']),
        correctAnswer: 'Two or three',
        explanation: '"Do not drink water in one gulp like camels, but drink it in two or three sips." (Tirmidhī)',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-adab-q4' },
      create: {
        externalId: 'maktab-1-adab-q4',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which side should we sleep on according to the Sunnah?',
        options: JSON.stringify(['Left side', 'Right side', 'On the stomach', 'On the back']),
        correctAnswer: 'Right side',
        explanation: 'It is sunnah to sleep on the right side with the right hand under the right cheek.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Which side should we sleep on according to the Sunnah?',
        options: JSON.stringify(['Left side', 'Right side', 'On the stomach', 'On the back']),
        correctAnswer: 'Right side',
        explanation: 'It is sunnah to sleep on the right side with the right hand under the right cheek.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-adab-q5' },
      create: {
        externalId: 'maktab-1-adab-q5',
        unitId: unitAdab.id,
        type: 'FILL_BLANK',
        questionText: 'When entering the washroom, we enter with our _____ foot.',
        options: undefined,
        correctAnswer: 'left',
        explanation: 'We enter the washroom with the left foot and leave with the right foot.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'When entering the washroom, we enter with our _____ foot.',
        options: undefined,
        correctAnswer: 'left',
        explanation: 'We enter the washroom with the left foot and leave with the right foot.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'maktab-1-adab-q6' },
      create: {
        externalId: 'maktab-1-adab-q6',
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What should we do when we wake up, according to the Sunnah?',
        options: JSON.stringify([
          'Go back to sleep',
          'Recite a du\'ā\' and wash our hands',
          'Start eating breakfast immediately',
          'Go outside right away',
        ]),
        correctAnswer: 'Recite a du\'ā\' and wash our hands',
        explanation: 'Upon awakening, we should recite the du\'ā\', rub our eyes, wash our hands, and brush our teeth.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What should we do when we wake up, according to the Sunnah?',
        options: JSON.stringify([
          'Go back to sleep',
          'Recite a du\'ā\' and wash our hands',
          'Start eating breakfast immediately',
          'Go outside right away',
        ]),
        correctAnswer: 'Recite a du\'ā\' and wash our hands',
        explanation: 'Upon awakening, we should recite the du\'ā\', rub our eyes, wash our hands, and brush our teeth.',
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

  // --- Fiqh Flashcards ---
  const fiqhFlashcards = [
    {
      front: 'Shahādah',
      back: 'The first pillar of Islam — to believe and say that there is no god but Allāh and Muḥammad ﷺ is His servant and messenger.',
      frontArabic: 'شَهَادَة',
      backArabic: 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      category: 'vocabulary',
      tags: ['fiqh', 'five-pillars', 'shahādah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ṣalāh',
      back: 'The second pillar of Islam — the five daily prayers: Fajr, Ḍhuhr, \'Aṣr, Maghrib, \'Ishā\'.',
      frontArabic: 'صَلَاة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'five-pillars', 'ṣalāh'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Zakāh',
      back: 'The third pillar of Islam — giving money to those in need, once a year.',
      frontArabic: 'زَكَاة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'five-pillars', 'zakāh'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ṣawm',
      back: 'The fourth pillar of Islam — fasting (not eating or drinking during the day) in the month of Ramaḍān.',
      frontArabic: 'صَوْم',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'five-pillars', 'ṣawm', 'ramaḍān'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥajj',
      back: 'The fifth pillar of Islam — a special journey to Makkah that every able Muslim must do at least once.',
      frontArabic: 'حَجّ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'five-pillars', 'ḥajj', 'makkah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ṭahārah',
      back: 'Cleanliness / purity — being clean is required before performing ṣalāh.',
      frontArabic: 'طَهَارَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'ṭahārah', 'cleanliness'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Wuḍū\'',
      back: 'Ablution — the special way to wash before ṣalāh: hands, mouth, nose, face, arms, head, ears, feet.',
      frontArabic: 'وُضُوء',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'wuḍū', 'ablution'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ṭawāf',
      back: 'Going around the Ka\'bah seven times during Ḥajj.',
      frontArabic: 'طَوَاف',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'ḥajj', 'ṭawāf'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Khilāl',
      back: 'Passing the fingers of each hand through the other during wuḍū\', and between the toes.',
      frontArabic: 'خِلَال',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'wuḍū'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Masaḥ',
      back: 'Wiping the head with wet hands during wuḍū\'.',
      frontArabic: 'مَسْح',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'wuḍū'],
      difficulty: 'MEDIUM' as const,
    },
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

  // --- Aḥādīth Flashcards ---
  const ahadithFlashcards = [
    {
      front: 'Ḥadīth (حَدِيث)',
      back: 'What Rasūlullāh ﷺ said, did himself, or didn\'t say \'no\' to when he saw it. Plural: Aḥādīth.',
      frontArabic: 'حَدِيث',
      backArabic: 'أَحَادِيث',
      category: 'vocabulary',
      tags: ['aḥādīth', 'definition'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\': Feeding the hungry',
      back: '"Feed the hungry and visit the sick." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: 'أَطْعِمُوا الْجَائِعَ وَعُودُوا الْمَرِيضَ',
      backArabic: null,
      category: 'rule',
      tags: ['aḥādīth', 'hadith-1', 'feeding'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\': Helping others',
      back: '"The best of people are those who are most helpful to others." (al-Mu\'jam al-Awsaṭ)',
      frontArabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
      backArabic: null,
      category: 'rule',
      tags: ['aḥādīth', 'hadith-2', 'helping'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\': Doing things calmly',
      back: '"Doing things calmly is from Allāh and doing things in a hurry is from Shayṭān." (Tirmidhī)',
      frontArabic: 'الأَنَاةُ مِنَ اللَّهِ وَالْعَجَلَةُ مِنَ الشَّيْطَانِ',
      backArabic: null,
      category: 'rule',
      tags: ['aḥādīth', 'hadith-3', 'patience'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\': Purity and cleanliness',
      back: '"Purity is half of īmān." (Ṣaḥīḥ Muslim)',
      frontArabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
      backArabic: null,
      category: 'rule',
      tags: ['aḥādīth', 'hadith-4', 'cleanliness'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\': Speaking the truth',
      back: '"Hold on to the truth." (Ṣaḥīḥ Muslim)',
      frontArabic: 'عَلَيْكُمْ بِالصِّدْقِ',
      backArabic: null,
      category: 'rule',
      tags: ['aḥādīth', 'hadith-5', 'truthfulness'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Who was \'Abdul Qādir?',
      back: 'A young boy who went to Baghdād to learn. He always spoke the truth, even to robbers. He grew up to become a great friend of Allāh.',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'truth', 'story'],
      difficulty: 'MEDIUM' as const,
    },
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

  // --- Sīrah Flashcards ---
  const sirahFlashcards = [
    {
      front: 'When was Rasūlullāh ﷺ born?',
      back: 'Early on a Monday morning of Rabī\' al-Awwal, in the Year of the Elephant, in Makkah.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'birth', 'makkah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Year of the Elephant',
      back: 'The year Rasūlullāh ﷺ was born — named because Abrahah tried to attack the Ka\'bah with elephants, but Allāh destroyed his army with birds dropping tiny stones.',
      frontArabic: 'عَامُ الْفِيل',
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'year-of-elephant'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥalīmah Sa\'diyyah',
      back: 'The foster mother of Rasūlullāh ﷺ, from the tribe of Banī Sa\'d. She kept him for four years in the village.',
      frontArabic: 'حَلِيمَة السَّعْدِيَّة',
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'foster-mother'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Aṣ-Ṣādiq',
      back: '"The most honest" — a title given to Muḥammad ﷺ by the people of Makkah.',
      frontArabic: 'الصَّادِق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'title', 'honesty'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Al-Amīn',
      back: '"The most trustworthy" — a title given to Muḥammad ﷺ by the people of Makkah.',
      frontArabic: 'الأَمِين',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'title', 'trustworthy'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Baḥīrah',
      back: 'A monk who recognised that young Muḥammad ﷺ would become the last messenger of Allāh, seeing the seal of prophethood between his shoulders.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'youth', 'syria'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Khadījah رضي الله عنها',
      back: 'A rich woman of Makkah who married Muḥammad ﷺ. He was 25 and she was 40. They had four daughters and two sons.',
      frontArabic: 'خَدِيجَة',
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'marriage', 'family'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Name the four daughters of Rasūlullāh ﷺ',
      back: 'Zaynab, Ruqayyah, Umm Kulthūm, and Fāṭimah.',
      frontArabic: null,
      backArabic: 'زَيْنَب ، رُقَيَّة ، أُمّ كُلْثُوم ، فَاطِمَة',
      category: 'definition',
      tags: ['sīrah', 'family', 'daughters'],
      difficulty: 'MEDIUM' as const,
    },
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

  // --- Tārīkh Flashcards ---
  const tarikhFlashcards = [
    {
      front: 'What was Ādam عليه السلام created from?',
      back: 'Clay. Allāh created the first man, Ādam, from clay.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['tārīkh', 'ādam', 'creation'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Iblīs / Shayṭān',
      back: 'The jinn who refused to bow to Ādam out of arrogance, saying he was made from fire. He is the enemy of humankind.',
      frontArabic: 'إِبْلِيس / شَيْطَان',
      backArabic: null,
      category: 'vocabulary',
      tags: ['tārīkh', 'ādam', 'shayṭān'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥawwā\'',
      back: 'The wife of Ādam عليه السلام, created by Allāh to be his companion in Jannah.',
      frontArabic: 'حَوَّاء',
      backArabic: null,
      category: 'definition',
      tags: ['tārīkh', 'ādam', 'ḥawwā'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Qur\'ān 7:22-23 — Du\'ā\' of Ādam and Ḥawwā\'',
      back: '"Our Lord, we have done wrong and if You do not forgive us and have mercy upon us, we will most certainly be from amongst the losers."',
      frontArabic: null,
      backArabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
      category: 'example',
      tags: ['tārīkh', 'ādam', 'duā', 'qurān'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Nūḥ عليه السلام',
      back: 'A prophet sent by Allāh to call people away from idol worship. He preached for 950 years. Allāh saved him and the believers in an Ark during the great flood.',
      frontArabic: 'نُوح',
      backArabic: null,
      category: 'definition',
      tags: ['tārīkh', 'nūḥ', 'prophet'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'How did idol worship begin?',
      back: 'Shayṭān tricked people into making pictures of pious dead people, then statues, then eventually they started worshipping these statues as idols.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['tārīkh', 'nūḥ', 'idols'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Mount Jūdiyy',
      back: 'The mountain where Nūḥ عليه السلام\'s Ark came to rest after the flood.',
      frontArabic: 'جُودِيّ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['tārīkh', 'nūḥ', 'ark'],
      difficulty: 'MEDIUM' as const,
    },
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

  // --- Aqā'id Flashcards ---
  const aqaidFlashcards = [
    {
      front: 'The Seven Articles of Faith',
      back: '1. Allāh  2. His angels  3. His books  4. His messengers  5. The Last Day  6. Fate (good and bad from Allāh)  7. Life after death',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['aqā\'id', 'articles-of-faith'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Sūrah al-Ikhlāṣ (Qur\'ān 112)',
      back: '"Say, Allāh is One. Allāh is Aṣ-Ṣamad. He did not give birth nor was He born. And no one is equal to Him."',
      frontArabic: 'سُورَة الإِخْلَاص',
      backArabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ',
      category: 'example',
      tags: ['aqā\'id', 'qurān', 'sūrah-ikhlāṣ'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Aṣ-Ṣamad',
      back: 'A name of Allāh meaning "He who needs no one and everyone needs Him."',
      frontArabic: 'الصَّمَد',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'names-of-allāh'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ar-Razzāq',
      back: 'The Provider — Allāh gives us everything: clothes, food, family, friends. He is the real Provider behind all things.',
      frontArabic: 'الرَّزَّاق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'names-of-allāh', 'ar-razzāq'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ar-Raḥmān',
      back: 'The Most Merciful — Allāh is more merciful to His servants than a mother is to her child.',
      frontArabic: 'الرَّحْمٰن',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'names-of-allāh', 'ar-raḥmān'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Story of Al-\'Anbar',
      back: '300 Companions ate from a huge fish for a whole month during a journey. Rasūlullāh ﷺ said it was food Allāh brought from the ocean for them. (Ṣaḥīḥ Muslim)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aqā\'id', 'ar-razzāq', 'story'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Story of Mūsā عليه السلام as a baby',
      back: 'His mother placed him in a box in the river to protect him. The box reached Fir\'awn\'s palace. Āsiyah kept him. He only took milk from his own mother, whom Allāh returned to him.',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aqā\'id', 'ar-raḥmān', 'story', 'mūsā'],
      difficulty: 'MEDIUM' as const,
    },
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

  // --- Akhlāq Flashcards ---
  const akhlaqFlashcards = [
    {
      front: 'Akhlāq',
      back: 'Good character and manners — the way a Muslim behaves towards Allāh, people, and all of creation.',
      frontArabic: 'أَخْلَاق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'definition'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What did Rasūlullāh ﷺ say about respecting elders?',
      back: '"Whoever does not respect our elders is not one of us." (Aḥmad)',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['akhlāq', 'respect', 'hadith'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth: Reward for good manners',
      back: '"I promise a palace in the highest stages of Jannah for the person who has good manners." (Abū Dāwūd)',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['akhlāq', 'manners', 'hadith'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth: Smiling is charity',
      back: '"Your smile for your brother is charity." (Tirmidhī)',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['akhlāq', 'smiling', 'hadith'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth: Speaking good words',
      back: '"Protect yourselves from Jahannam... He who cannot find anything to give, then let him speak good words." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['akhlāq', 'speech', 'hadith'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Right side is used for:',
      back: 'Entering the masjid, giving/taking things, entering the house, eating and drinking, boarding a vehicle.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['akhlāq', 'right-side', 'sunnah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Left side is used for:',
      back: 'Entering the washroom, cleaning oneself, blowing the nose, leaving the masjid, removing shoes.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['akhlāq', 'left-side', 'sunnah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Qur\'ān 9:108 on cleanliness',
      back: '"Allāh loves those who make themselves clean."',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['akhlāq', 'cleanliness', 'qurān'],
      difficulty: 'EASY' as const,
    },
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

  // --- Ādāb Flashcards ---
  const adabFlashcards = [
    {
      front: 'Ādāb',
      back: 'Islamic etiquette — the proper manners taught by Rasūlullāh ﷺ for daily activities like eating, drinking, sleeping.',
      frontArabic: 'آدَاب',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ādāb', 'definition'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\' before eating',
      back: 'Bismillāh — "In the name of Allāh." If forgotten at the start: "Bismillāhi fī awwalihi wa ākhirihi."',
      frontArabic: 'بِسْمِ اللَّهِ',
      backArabic: 'بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ',
      category: 'rule',
      tags: ['ādāb', 'eating', 'duā'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\' after eating',
      back: '"Praise be to Allāh who fed us, gave us drink and made us Muslims." (Abū Dāwūd)',
      frontArabic: null,
      backArabic: 'اَلْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      category: 'rule',
      tags: ['ādāb', 'eating', 'duā'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\' before sleeping',
      back: '"O Allāh, with Your name I die and live." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: 'اَللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
      category: 'rule',
      tags: ['ādāb', 'sleeping', 'duā'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\' upon waking up',
      back: '"All praise is for Allāh who gave us life after causing us to die, and to Him is the return." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: 'اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      category: 'rule',
      tags: ['ādāb', 'waking', 'duā'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\' when entering the washroom',
      back: '"O Allāh, I seek refuge in You from all evil and evil-doers." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: 'اَللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
      category: 'rule',
      tags: ['ādāb', 'washroom', 'duā'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\' when leaving the washroom',
      back: 'Ghufrānaka — "I seek Your forgiveness." (Tirmidhī)',
      frontArabic: null,
      backArabic: 'غُفْرَانَكَ',
      category: 'rule',
      tags: ['ādāb', 'washroom', 'duā'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Sunnah of drinking water',
      back: 'Say Bismillāh, drink in 2–3 sips while seated, look inside the cup, do not breathe into it, say Alḥamdulillāh when done.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'drinking', 'sunnah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Before sleeping recite:',
      back: 'Sūrah al-Ikhlāṣ, Sūrah al-Falaq, Sūrah an-Nās — blow into palms and rub over body 3 times. Then SubḥānAllāh ×33, Alḥamdulillāh ×33, Allāhu Akbar ×34.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'sleeping', 'adhkār'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Miswāk',
      back: 'A natural toothbrush from a twig, used by Rasūlullāh ﷺ. It is sunnah to use it when waking up and before wuḍū\'.',
      frontArabic: 'مِسْوَاك',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ādāb', 'waking', 'sunnah'],
      difficulty: 'EASY' as const,
    },
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

  // ══════════════════════════════════════════════
  // ARABIC TERMS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🔤 Creating Arabic terms...');

    await prisma.arabicTerm.deleteMany({ where: { unitId: unitFiqh.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitSirah.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitTarikh.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitAqaid.id } });
  await prisma.arabicTerm.deleteMany({ where: { unitId: unitAdab.id } });

await prisma.arabicTerm.createMany({
    data: [
      // Fiqh terms
      { unitId: unitFiqh.id, arabicText: 'شَهَادَة', transliteration: 'Shahādah', translation: 'Testimony of faith — the first pillar of Islam' },
      { unitId: unitFiqh.id, arabicText: 'صَلَاة', transliteration: 'Ṣalāh', translation: 'Prayer — the five daily prayers' },
      { unitId: unitFiqh.id, arabicText: 'زَكَاة', transliteration: 'Zakāh', translation: 'Obligatory charity — giving to the needy' },
      { unitId: unitFiqh.id, arabicText: 'صَوْم', transliteration: 'Ṣawm', translation: 'Fasting — abstaining from food and drink' },
      { unitId: unitFiqh.id, arabicText: 'حَجّ', transliteration: 'Ḥajj', translation: 'Pilgrimage to Makkah' },
      { unitId: unitFiqh.id, arabicText: 'طَهَارَة', transliteration: 'Ṭahārah', translation: 'Cleanliness / purity' },
      { unitId: unitFiqh.id, arabicText: 'وُضُوء', transliteration: 'Wuḍū\'', translation: 'Ablution before prayer' },
      { unitId: unitFiqh.id, arabicText: 'طَوَاف', transliteration: 'Ṭawāf', translation: 'Circling the Ka\'bah seven times' },
      { unitId: unitFiqh.id, arabicText: 'زِيَارَة', transliteration: 'Ziyārah', translation: 'Visit — especially to Madīnah' },
      { unitId: unitFiqh.id, arabicText: 'كَعْبَة', transliteration: 'Ka\'bah', translation: 'The sacred building in Makkah' },
      // Sīrah terms
      { unitId: unitSirah.id, arabicText: 'الصَّادِق', transliteration: 'Aṣ-Ṣādiq', translation: 'The Most Honest — title of Muḥammad ﷺ' },
      { unitId: unitSirah.id, arabicText: 'الأَمِين', transliteration: 'Al-Amīn', translation: 'The Most Trustworthy — title of Muḥammad ﷺ' },
      { unitId: unitSirah.id, arabicText: 'رَسُولُ اللَّه', transliteration: 'Rasūlullāh', translation: 'Messenger of Allāh' },
      { unitId: unitSirah.id, arabicText: 'قُرَيْش', transliteration: 'Quraysh', translation: 'The tribe of Rasūlullāh ﷺ in Makkah' },
      // Tārīkh terms
      { unitId: unitTarikh.id, arabicText: 'إِبْلِيس', transliteration: 'Iblīs', translation: 'Shayṭān — the jinn who refused to bow to Ādam' },
      { unitId: unitTarikh.id, arabicText: 'جَنَّة', transliteration: 'Jannah', translation: 'Paradise / Heaven' },
      { unitId: unitTarikh.id, arabicText: 'جَهَنَّم', transliteration: 'Jahannam', translation: 'Hellfire' },
      // Aqā'id terms
      { unitId: unitAqaid.id, arabicText: 'إِيمَان', transliteration: 'Īmān', translation: 'Faith — what we believe in' },
      { unitId: unitAqaid.id, arabicText: 'الرَّزَّاق', transliteration: 'Ar-Razzāq', translation: 'The Provider — a name of Allāh' },
      { unitId: unitAqaid.id, arabicText: 'الرَّحْمٰن', transliteration: 'Ar-Raḥmān', translation: 'The Most Merciful — a name of Allāh' },
      { unitId: unitAqaid.id, arabicText: 'الصَّمَد', transliteration: 'Aṣ-Ṣamad', translation: 'He who needs no one; everyone needs Him' },
      // Ādāb terms
      { unitId: unitAdab.id, arabicText: 'بِسْمِ اللَّهِ', transliteration: 'Bismillāh', translation: 'In the name of Allāh' },
      { unitId: unitAdab.id, arabicText: 'اَلْحَمْدُ لِلَّهِ', transliteration: 'Alḥamdulillāh', translation: 'All praise is for Allāh' },
      { unitId: unitAdab.id, arabicText: 'سُبْحَانَ اللَّه', transliteration: 'SubḥānAllāh', translation: 'Glory be to Allāh' },
      { unitId: unitAdab.id, arabicText: 'اللَّهُ أَكْبَر', transliteration: 'Allāhu Akbar', translation: 'Allāh is the Greatest' },
      { unitId: unitAdab.id, arabicText: 'مِسْوَاك', transliteration: 'Miswāk', translation: 'A natural toothbrush twig — Sunnah to use' },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 Maktab Coursebook 1 seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: Maktab Coursebook 1 (ages 6-7)');
  console.log('   - 7 Units: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā\'id, Akhlāq, Ādāb');
  console.log(`   - ${7 + 6 + 6 + 6 + 5 + 5 + 6} Quiz questions (41 total)`);
  console.log(`   - ${flashcardIndex} Flashcards`);
  console.log(`   - 26 Arabic terms`);
}

// Allow standalone execution
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
