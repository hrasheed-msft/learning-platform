import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Foundation 1 — Islamic Curriculum Seed
 * Source: An Nasihah Publications Qur'ān & Du'ā Book, Age Range: 4–5 years
 *
 * Covers three subjects: Qur'ān (Sūrah Al-Fātiḥah), Du'ā (17 daily supplications
 * and the First Kalimah), and 99 Names of Allāh (Names 1–5).
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions and flashcards per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-foundation1.ts
 */

export async function seedMaktabFoundation1() {
  console.log('📚 Starting Maktab Foundation 1 seed...');
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
    where: { slug: 'maktab-foundation-1' },
    create: {
      slug: 'maktab-foundation-1',
      title: 'Maktab Foundation 1',
      description: 'Foundation-level Islamic education for young learners aged 4–5 years. Introduces Sūrah Al-Fātiḥah, essential daily du\'ās, the First Kalimah, and the first five of the 99 Names of Allāh. Based on the An Nasihah Publications Qur\'ān & Du\'ā book.',
      category: 'FIQH',
      ageLevels: ['EARLY_CHILD'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Foundation 1',
      description: 'Foundation-level Islamic education for young learners aged 4–5 years. Introduces Sūrah Al-Fātiḥah, essential daily du\'ās, the First Kalimah, and the first five of the 99 Names of Allāh. Based on the An Nasihah Publications Qur\'ān & Du\'ā book.',
      category: 'FIQH',
      ageLevels: ['EARLY_CHILD'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // UNIT 0: QUR'ĀN
  // ──────────────────────────────────────────────

  const unitQuran = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'foundation-1-quran' } },
    create: {
      slug: 'foundation-1-quran',
      courseId: course.id,
      title: 'Qur\'ān — Sūrah Al-Fātiḥah',
      description: 'Learn and memorize Sūrah Al-Fātiḥah, the opening chapter of the Qur\'ān.',
      orderIndex: 0,
      content: `
<h2>Sūrah Al-Fātiḥah 🌟</h2>
<p>Did you know? The very first sūrah in the Qur'ān is called <strong>Sūrah Al-Fātiḥah</strong>! It's like saying "hello" to Allāh every time we pray. How special is that?</p>
<p>Every time we pray ṣalāh, we recite Sūrah Al-Fātiḥah. And we pray five times a day — so we say this beautiful sūrah at least <strong>17 times every single day!</strong> Allāh loves to hear us recite it.</p>

<h2>The Arabic Text</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</p>
  <p>اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ</p>
  <p>الرَّحْمٰنِ الرَّحِيمِ</p>
  <p>مَالِكِ يَوْمِ الدِّينِ</p>
  <p>إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ</p>
  <p>اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ</p>
  <p>صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ</p>
</div>

<h2>Easy Transliteration Guide</h2>
<p>Let's read it together slowly — one line at a time:</p>
<ol>
  <li><em>Bismillāhir-raḥmānir-raḥīm</em></li>
  <li><em>Alḥamdulillāhi rabbil-'ālamīn</em></li>
  <li><em>Ar-raḥmānir-raḥīm</em></li>
  <li><em>Māliki yawmid-dīn</em></li>
  <li><em>Iyyāka na'budu wa iyyāka nasta'īn</em></li>
  <li><em>Ihdinaṣ-ṣirāṭal-mustaqīm</em></li>
  <li><em>Ṣirāṭal-ladhīna an'amta 'alayhim ghayril-maghḍūbi 'alayhim wa laḍ-ḍāllīn</em></li>
</ol>

<h2>What Does It Mean?</h2>
<p>Sūrah Al-Fātiḥah is like a special conversation with Allāh! Here is what we are saying:</p>
<ol>
  <li><strong>"In the name of Allāh, the Most Kind, the Most Merciful."</strong> — We start by remembering Allāh!</li>
  <li><strong>"All praise belongs to Allāh, the Lord of all the worlds."</strong> — We thank Allāh for everything!</li>
  <li><strong>"The Most Kind, the Most Merciful."</strong> — Allāh is SO kind and loving!</li>
  <li><strong>"The Master of the Day of Judgement."</strong> — Allāh is in charge of everything.</li>
  <li><strong>"You alone we worship, and from You alone we ask for help."</strong> — We only ask Allāh for help!</li>
  <li><strong>"Guide us to the straight path."</strong> — We are asking Allāh to show us the right way.</li>
  <li><strong>"The path of those You have blessed — not those who went the wrong way."</strong> — We want to be with the good people!</li>
</ol>

<h2>Why Is Al-Fātiḥah So Special? ✨</h2>
<p>Rasūlullāh ﷺ called this sūrah <strong>"Umm al-Qur'ān"</strong> — which means "The Mother of the Qur'ān!" It is the most important sūrah because it contains a summary of everything we believe.</p>
<p>Every time you recite Sūrah Al-Fātiḥah in your ṣalāh, Allāh listens to you and answers each line! How amazing is that? Allāh truly loves to hear your voice!</p>

<h2>🌈 Tips for Memorizing</h2>
<ul>
  <li>Practise one line each day with your family.</li>
  <li>Listen to a recitation and repeat after it.</li>
  <li>Recite it in every ṣalāh — the more you say it, the easier it becomes!</li>
  <li>Draw the Arabic letters to help remember them!</li>
</ul>
      `.trim(),
    },
    update: {
      title: 'Qur\'ān — Sūrah Al-Fātiḥah',
      description: 'Learn and memorize Sūrah Al-Fātiḥah, the opening chapter of the Qur\'ān.',
      content: `
<h2>Sūrah Al-Fātiḥah 🌟</h2>
<p>Did you know? The very first sūrah in the Qur'ān is called <strong>Sūrah Al-Fātiḥah</strong>! It's like saying "hello" to Allāh every time we pray. How special is that?</p>
<p>Every time we pray ṣalāh, we recite Sūrah Al-Fātiḥah. And we pray five times a day — so we say this beautiful sūrah at least <strong>17 times every single day!</strong> Allāh loves to hear us recite it.</p>

<h2>The Arabic Text</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</p>
  <p>اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ</p>
  <p>الرَّحْمٰنِ الرَّحِيمِ</p>
  <p>مَالِكِ يَوْمِ الدِّينِ</p>
  <p>إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ</p>
  <p>اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ</p>
  <p>صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ</p>
</div>

<h2>Easy Transliteration Guide</h2>
<p>Let's read it together slowly — one line at a time:</p>
<ol>
  <li><em>Bismillāhir-raḥmānir-raḥīm</em></li>
  <li><em>Alḥamdulillāhi rabbil-'ālamīn</em></li>
  <li><em>Ar-raḥmānir-raḥīm</em></li>
  <li><em>Māliki yawmid-dīn</em></li>
  <li><em>Iyyāka na'budu wa iyyāka nasta'īn</em></li>
  <li><em>Ihdinaṣ-ṣirāṭal-mustaqīm</em></li>
  <li><em>Ṣirāṭal-ladhīna an'amta 'alayhim ghayril-maghḍūbi 'alayhim wa laḍ-ḍāllīn</em></li>
</ol>

<h2>What Does It Mean?</h2>
<p>Sūrah Al-Fātiḥah is like a special conversation with Allāh! Here is what we are saying:</p>
<ol>
  <li><strong>"In the name of Allāh, the Most Kind, the Most Merciful."</strong> — We start by remembering Allāh!</li>
  <li><strong>"All praise belongs to Allāh, the Lord of all the worlds."</strong> — We thank Allāh for everything!</li>
  <li><strong>"The Most Kind, the Most Merciful."</strong> — Allāh is SO kind and loving!</li>
  <li><strong>"The Master of the Day of Judgement."</strong> — Allāh is in charge of everything.</li>
  <li><strong>"You alone we worship, and from You alone we ask for help."</strong> — We only ask Allāh for help!</li>
  <li><strong>"Guide us to the straight path."</strong> — We are asking Allāh to show us the right way.</li>
  <li><strong>"The path of those You have blessed — not those who went the wrong way."</strong> — We want to be with the good people!</li>
</ol>

<h2>Why Is Al-Fātiḥah So Special? ✨</h2>
<p>Rasūlullāh ﷺ called this sūrah <strong>"Umm al-Qur'ān"</strong> — which means "The Mother of the Qur'ān!" It is the most important sūrah because it contains a summary of everything we believe.</p>
<p>Every time you recite Sūrah Al-Fātiḥah in your ṣalāh, Allāh listens to you and answers each line! How amazing is that? Allāh truly loves to hear your voice!</p>

<h2>🌈 Tips for Memorizing</h2>
<ul>
  <li>Practise one line each day with your family.</li>
  <li>Listen to a recitation and repeat after it.</li>
  <li>Recite it in every ṣalāh — the more you say it, the easier it becomes!</li>
  <li>Draw the Arabic letters to help remember them!</li>
</ul>
      `.trim(),
      orderIndex: 0,
    },
  });

  console.log('✅ Created Unit 0: Qur\'ān');

  // ──────────────────────────────────────────────
  // UNIT 1: DU'Ā
  // ──────────────────────────────────────────────

  const unitDua = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'foundation-1-dua' } },
    create: {
      slug: 'foundation-1-dua',
      courseId: course.id,
      title: 'Du\'ā — Daily Supplications & The First Kalimah',
      description: 'Learn essential daily du\'ās and the First Kalimah (Ṭayyibah).',
      orderIndex: 1,
      content: `
<h2>Our Daily Du'ās 🤲</h2>
<p>A du'ā is a special way of talking to Allāh. Whenever we say a du'ā, Allāh hears us and loves us! Rasūlullāh ﷺ taught us beautiful words to say throughout our day.</p>
<p>Let's learn all our du'ās together — one by one!</p>

<h2>1. The First Kalimah (Ṭayyibah) — The Pure Word</h2>
<p>This is the <strong>most important thing a Muslim says!</strong> It means: "There is no god except Allāh, and Muḥammad ﷺ is the Messenger of Allāh."</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَسُوْلُ اللّٰه</p>
</div>
<p><em>Lā ilāha illallāhu muḥammadur rasūlullāh</em></p>
<p>💛 <strong>Remember:</strong> Allāh is our One and Only God, and Muḥammad ﷺ is His beloved messenger. We believe this with all our heart!</p>

<h2>2. Before Starting Anything — Tasmiyah</h2>
<p>Before we do anything — eating, drinking, writing — we say the Tasmiyah. It means "In the name of Allāh, the Most Kind, the Most Merciful."</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
</div>
<p><em>Bismillāhir-raḥmānir-raḥīm</em></p>
<p>🌟 <strong>When to say it:</strong> Before starting anything — writing, reading, eating, leaving the house!</p>

<h2>3. After Completing Anything — Alḥamdulillāh</h2>
<p>When we finish something, we thank Allāh by saying "Alḥamdulillāh" — which means "All praise is for Allāh!"</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلْحَمْدُ لِلّٰهِ</p>
</div>
<p><em>Alḥamdulillāh</em></p>
<p>😊 <strong>When to say it:</strong> After finishing eating, after finishing your work, when something good happens!</p>

<h2>4. When Intending Something — In Shā' Allāh</h2>
<p>When we plan to do something, we say "In shā' Allāh" — which means "If Allāh wills." This is because only Allāh knows what will happen!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>إِنْ شَاءَ اللّٰهُ</p>
</div>
<p><em>In shā' Allāh</em></p>
<p>📅 <strong>When to say it:</strong> "I will come tomorrow, in shā' Allāh!" "We will go to the park, in shā' Allāh!"</p>

<h2>5. When Given Something — Jazāk Allāhu Khayran</h2>
<p>When someone gives us something or helps us, we say "Jazāk Allāhu Khayran" — it means "May Allāh reward you with goodness!" It's an even better way to say thank you!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>جَزَاكَ اللّٰهُ خَيْرًا</p>
</div>
<p><em>Jazāk Allāhu khayran</em></p>
<p>🎁 <strong>When to say it:</strong> When someone gives you a yummy snack, when someone helps you, when someone is kind to you!</p>

<h2>6. When We See Something Nice — Māshā' Allāh</h2>
<p>When we see something beautiful or amazing, we say "Māshā' Allāh" — which means "This is what Allāh has willed!" It is also a way of protecting things from the evil eye.</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>مَا شَاءَ اللّٰهُ</p>
</div>
<p><em>Māshā' Allāh</em></p>
<p>🌺 <strong>When to say it:</strong> "Māshā' Allāh, what a beautiful flower!" "Māshā' Allāh, you did so well!"</p>

<h2>7. When We See Something Great — SubḥānAllāh</h2>
<p>When we see something amazing — a big mountain, a beautiful sunset, the ocean — we say "SubḥānAllāh!" which means "How perfect is Allāh!" It shows we are amazed by Allāh's creation.</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>سُبْحَانَ اللّٰهِ</p>
</div>
<p><em>SubḥānAllāh</em></p>
<p>🌅 <strong>When to say it:</strong> When you see something amazing in nature, or when you are in awe of Allāh!</p>

<h2>8. When We Climb Up the Stairs — Allāhu Akbar</h2>
<p>"Allāhu Akbar" means "Allāh is the Greatest!" When we go up stairs or up a hill, we remember that Allāh is greater than everything!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَللّٰهُ أَكْبَرُ</p>
</div>
<p><em>Allāhu Akbar</em></p>
<p>🪜 <strong>When to say it:</strong> When climbing up stairs, going up a slope, or riding uphill!</p>

<h2>9. When We Go Down the Stairs — SubḥānAllāh</h2>
<p>When we go down stairs or a hill, we say "SubḥānAllāh" — to remember how perfect Allāh is!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>سُبْحَانَ اللّٰهِ</p>
</div>
<p><em>SubḥānAllāh</em></p>
<p>🪜 <strong>When to say it:</strong> When going down stairs, slopes, or walking downhill.</p>

<h2>10. When We Make a Mistake — Astaghfirullāh</h2>
<p>When we make a mistake or do something wrong, we say "Astaghfirullāh" — which means "I ask Allāh for forgiveness." Allāh loves when we say sorry and ask Him to forgive us!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>أَسْتَغْفِرُ اللّٰهَ</p>
</div>
<p><em>Astaghfirullāh</em></p>
<p>💚 <strong>When to say it:</strong> When you make a mistake, when you say something bad, when you feel sorry for something.</p>

<h2>11. Ta'awwudh — Seeking Protection from Shayṭān</h2>
<p>The Ta'awwudh is our special shield! We say it to ask Allāh to protect us from the bad whisperings of Shayṭān.</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ</p>
</div>
<p><em>A'ūdhu billāhi minash-shayṭānir-rajīm</em></p>
<p><strong>"I seek refuge in Allāh from the cursed Shayṭān."</strong></p>
<p>🛡️ <strong>When to say it:</strong> Before reading Qur'ān, when you feel angry or upset, when bad thoughts come to your mind.</p>

<h2>12. At the Time of Eating</h2>
<p>Before we eat our food, we thank Allāh for giving it to us by saying this special du'ā:</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ وَعَلٰى بَرَكَةِ اللّٰهِ</p>
</div>
<p><em>Bismillāhi wa 'alā barakatillāh</em></p>
<p><strong>"In the name of Allāh and with the blessings of Allāh."</strong></p>
<p>🍎 <strong>When to say it:</strong> Right before you start eating your meal!</p>

<h2>13. At the Time of Sleeping</h2>
<p>Before we go to sleep, we say this beautiful du'ā. It means "O Allāh, with Your name I die and live" — because sleep is like a small rest and when we wake up it is like being alive again!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا</p>
</div>
<p><em>Bismika Allāhumma amūtu wa aḥyā</em></p>
<p>😴 <strong>When to say it:</strong> When you are about to go to sleep, lying in your bed!</p>

<h2>14. When Greeting a Muslim — The Salām</h2>
<p>When we meet another Muslim, we give them Salām — a greeting of peace! It means "Peace be upon you, and Allāh's mercy and blessings!"</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ</p>
</div>
<p><em>Assalāmu 'alaykum wa raḥmatullāhi wa barakātuh</em></p>
<p>👋 <strong>When to say it:</strong> When you see a Muslim friend, your teacher, or anyone who is Muslim!</p>

<h2>15. Reply to the Salām — Wa 'Alaykum Assalām</h2>
<p>When someone gives you Salām, you must reply with an even nicer greeting! It is important to always reply to the Salām.</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ</p>
</div>
<p><em>Wa 'alaykumus-salāmu wa raḥmatullāhi wa barakātuh</em></p>
<p>💬 <strong>When to say it:</strong> When someone says "Assalāmu 'alaykum" to you!</p>

<h2>16. Before Drinking Water</h2>
<p>Even before drinking water, we remember Allāh!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ</p>
</div>
<p><em>Bismillāh</em></p>
<p>💧 <strong>When to say it:</strong> Before taking a sip of water or any drink!</p>

<h2>17. After Drinking Water</h2>
<p>After drinking water, we thank Allāh for the lovely cool water!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلْحَمْدُ لِلّٰهِ</p>
</div>
<p><em>Alḥamdulillāh</em></p>
<p>💧 <strong>When to say it:</strong> After finishing your drink!</p>

<h2>🌟 Well Done!</h2>
<p>You have learned <strong>17 daily du'ās</strong> and the First Kalimah! Now try to use at least one du'ā every day. The more you say them, the closer you get to Allāh! 💛</p>
      `.trim(),
    },
    update: {
      title: 'Du\'ā — Daily Supplications & The First Kalimah',
      description: 'Learn essential daily du\'ās and the First Kalimah (Ṭayyibah).',
      content: `
<h2>Our Daily Du'ās 🤲</h2>
<p>A du'ā is a special way of talking to Allāh. Whenever we say a du'ā, Allāh hears us and loves us! Rasūlullāh ﷺ taught us beautiful words to say throughout our day.</p>
<p>Let's learn all our du'ās together — one by one!</p>

<h2>1. The First Kalimah (Ṭayyibah) — The Pure Word</h2>
<p>This is the <strong>most important thing a Muslim says!</strong> It means: "There is no god except Allāh, and Muḥammad ﷺ is the Messenger of Allāh."</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَسُوْلُ اللّٰه</p>
</div>
<p><em>Lā ilāha illallāhu muḥammadur rasūlullāh</em></p>
<p>💛 <strong>Remember:</strong> Allāh is our One and Only God, and Muḥammad ﷺ is His beloved messenger. We believe this with all our heart!</p>

<h2>2. Before Starting Anything — Tasmiyah</h2>
<p>Before we do anything — eating, drinking, writing — we say the Tasmiyah. It means "In the name of Allāh, the Most Kind, the Most Merciful."</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
</div>
<p><em>Bismillāhir-raḥmānir-raḥīm</em></p>
<p>🌟 <strong>When to say it:</strong> Before starting anything — writing, reading, eating, leaving the house!</p>

<h2>3. After Completing Anything — Alḥamdulillāh</h2>
<p>When we finish something, we thank Allāh by saying "Alḥamdulillāh" — which means "All praise is for Allāh!"</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلْحَمْدُ لِلّٰهِ</p>
</div>
<p><em>Alḥamdulillāh</em></p>

<h2>4. When Intending Something — In Shā' Allāh</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>إِنْ شَاءَ اللّٰهُ</p>
</div>
<p><em>In shā' Allāh</em> — "If Allāh wills."</p>

<h2>5. When Given Something — Jazāk Allāhu Khayran</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>جَزَاكَ اللّٰهُ خَيْرًا</p>
</div>
<p><em>Jazāk Allāhu khayran</em> — "May Allāh reward you with goodness!"</p>

<h2>6. When We See Something Nice — Māshā' Allāh</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>مَا شَاءَ اللّٰهُ</p>
</div>
<p><em>Māshā' Allāh</em> — "This is what Allāh has willed!"</p>

<h2>7. When We See Something Great — SubḥānAllāh</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>سُبْحَانَ اللّٰهِ</p>
</div>
<p><em>SubḥānAllāh</em> — "How perfect is Allāh!"</p>

<h2>8. Climbing Stairs — Allāhu Akbar</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَللّٰهُ أَكْبَرُ</p>
</div>
<p><em>Allāhu Akbar</em> — "Allāh is the Greatest!"</p>

<h2>9. Going Down Stairs — SubḥānAllāh</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>سُبْحَانَ اللّٰهِ</p>
</div>

<h2>10. When We Make a Mistake — Astaghfirullāh</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>أَسْتَغْفِرُ اللّٰهَ</p>
</div>
<p><em>Astaghfirullāh</em> — "I ask Allāh for forgiveness."</p>

<h2>11. Ta'awwudh</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ</p>
</div>
<p><em>A'ūdhu billāhi minash-shayṭānir-rajīm</em></p>

<h2>12. At the Time of Eating</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ وَعَلٰى بَرَكَةِ اللّٰهِ</p>
</div>
<p><em>Bismillāhi wa 'alā barakatillāh</em></p>

<h2>13. At the Time of Sleeping</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا</p>
</div>
<p><em>Bismika Allāhumma amūtu wa aḥyā</em></p>

<h2>14. Salām Greeting</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ</p>
</div>

<h2>15. Reply to the Salām</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ</p>
</div>

<h2>16. Before Drinking Water</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ</p>
</div>

<h2>17. After Drinking Water</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلْحَمْدُ لِلّٰهِ</p>
</div>
      `.trim(),
      orderIndex: 1,
    },
  });

  console.log('✅ Created Unit 1: Du\'ā');

  // ──────────────────────────────────────────────
  // UNIT 2: 99 NAMES OF ALLĀH
  // ──────────────────────────────────────────────

  const unitNames = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'foundation-1-99-names' } },
    create: {
      slug: 'foundation-1-99-names',
      courseId: course.id,
      title: '99 Names of Allāh — Names 1–5',
      description: 'Learn the first five Beautiful Names of Allāh.',
      orderIndex: 2,
      content: `
<h2>The Beautiful Names of Allāh ✨</h2>
<p>Allāh has <strong>99 beautiful names!</strong> Each name tells us something wonderful about Allāh. Learning these names helps us know Allāh better and love Him more.</p>
<p>Rasūlullāh ﷺ said that whoever memorizes all 99 names of Allāh will enter Jannah! Let's start with the first five names together.</p>

<h2>Name 1 — Allāh (اللّٰه)</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اللّٰه</p>
</div>
<p><strong>The Greatest Name — The One and Only God</strong></p>
<p>"Allāh" is the most special name. It belongs only to our Creator — the One who made us, loves us, and takes care of us every single day. No one else can be called by this name!</p>
<p>🌟 <em>Think about it:</em> Every time you say "Allāh," you are calling the Creator of the entire universe! How amazing is that?</p>

<h2>Name 2 — Ar-Raḥmān (الرَّحْمٰنُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>الرَّحْمٰنُ</p>
</div>
<p><strong>The Most Gracious — The One Whose Kindness Covers Everything</strong></p>
<p>Ar-Raḥmān means Allāh is SO kind and loving to <em>everyone</em> — every person, every animal, every tiny ant! Even people who don't worship Allāh still receive His kindness because He is Ar-Raḥmān.</p>
<p>☀️ <em>Think about it:</em> The sun shines on everyone, rain falls for everyone — that's Allāh being Ar-Raḥmān!</p>

<h2>Name 3 — Ar-Raḥīm (الرَّحِيمُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>الرَّحِيمُ</p>
</div>
<p><strong>The Most Merciful — The One Who Has Special Mercy for Believers</strong></p>
<p>Ar-Raḥīm means Allāh has a <em>special, extra</em> kindness just for the people who believe in Him and do good deeds. On the Day of Judgement, Allāh will show His special mercy to the believers.</p>
<p>💛 <em>Think about it:</em> Ar-Raḥmān is Allāh's kindness for everyone, but Ar-Raḥīm is His extra-special love just for us believers!</p>

<h2>Name 4 — Al-Malik (الْمَلِكُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>الْمَلِكُ</p>
</div>
<p><strong>The King — The One Who Owns and Rules Everything</strong></p>
<p>Al-Malik means Allāh is the King of everything — of the earth, the sky, the stars, and everything in between! There is no president, no ruler, and no king more powerful than Allāh.</p>
<p>👑 <em>Think about it:</em> Human kings only rule their country, but Allāh is the King of the entire universe — past, present, and future!</p>

<h2>Name 5 — Al-Quddūs (الْقُدُّوسُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>الْقُدُّوسُ</p>
</div>
<p><strong>The Most Holy — The One Who Is Pure and Perfect</strong></p>
<p>Al-Quddūs means Allāh is completely pure and perfect. He has no faults and no mistakes. Nothing bad or wrong can ever come from Allāh.</p>
<p>🕊️ <em>Think about it:</em> People make mistakes sometimes, but Allāh — Al-Quddūs — is always perfectly pure and good!</p>

<h2>🌈 Review — Names 1–5</h2>
<table>
  <tr><th>Name</th><th>Arabic</th><th>Meaning</th></tr>
  <tr><td>1. Allāh</td><td>اللّٰه</td><td>The Greatest Name — The One God</td></tr>
  <tr><td>2. Ar-Raḥmān</td><td>الرَّحْمٰنُ</td><td>The Most Gracious</td></tr>
  <tr><td>3. Ar-Raḥīm</td><td>الرَّحِيمُ</td><td>The Most Merciful</td></tr>
  <tr><td>4. Al-Malik</td><td>الْمَلِكُ</td><td>The King</td></tr>
  <tr><td>5. Al-Quddūs</td><td>الْقُدُّوسُ</td><td>The Most Holy</td></tr>
</table>

<p>🌟 <strong>Great work!</strong> You have learned five beautiful names of Allāh. Keep practising and soon you will know all 99!</p>
      `.trim(),
    },
    update: {
      title: '99 Names of Allāh — Names 1–5',
      description: 'Learn the first five Beautiful Names of Allāh.',
      content: `
<h2>The Beautiful Names of Allāh ✨</h2>
<p>Allāh has <strong>99 beautiful names!</strong> Each name tells us something wonderful about Allāh. Learning these names helps us know Allāh better and love Him more.</p>

<h2>Name 1 — Allāh (اللّٰه)</h2>
<div dir="rtl" lang="ar" class="arabic-large"><p>اللّٰه</p></div>
<p><strong>The Greatest Name — The One and Only God</strong></p>
<p>"Allāh" is the most special name. It belongs only to our Creator — the One who made us, loves us, and takes care of us every single day.</p>

<h2>Name 2 — Ar-Raḥmān (الرَّحْمٰنُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large"><p>الرَّحْمٰنُ</p></div>
<p><strong>The Most Gracious</strong> — Allāh is SO kind and loving to everyone!</p>

<h2>Name 3 — Ar-Raḥīm (الرَّحِيمُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large"><p>الرَّحِيمُ</p></div>
<p><strong>The Most Merciful</strong> — Allāh has special mercy for the believers.</p>

<h2>Name 4 — Al-Malik (الْمَلِكُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large"><p>الْمَلِكُ</p></div>
<p><strong>The King</strong> — Allāh is the King of everything!</p>

<h2>Name 5 — Al-Quddūs (الْقُدُّوسُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large"><p>الْقُدُّوسُ</p></div>
<p><strong>The Most Holy</strong> — Allāh is completely pure and perfect.</p>
      `.trim(),
      orderIndex: 2,
    },
  });

  console.log('✅ Created Unit 2: 99 Names of Allāh');

  // ══════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('📝 Creating quiz questions...');

  // --- Qur'ān Quizzes ---
  await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'foundation-1-quran-q1' },
      create: {
        externalId: 'foundation-1-quran-q1',
        unitId: unitQuran.id,
        type: 'TRUE_FALSE',
        questionText: 'Sūrah Al-Fātiḥah is the first sūrah in the Qur\'ān.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Sūrah Al-Fātiḥah is the very first sūrah in the Qur\'ān. It is also called "Umm al-Qur\'ān" — the Mother of the Qur\'ān!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Sūrah Al-Fātiḥah is the first sūrah in the Qur\'ān.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Sūrah Al-Fātiḥah is the very first sūrah in the Qur\'ān. It is also called "Umm al-Qur\'ān" — the Mother of the Qur\'ān!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-quran-q2' },
      create: {
        externalId: 'foundation-1-quran-q2',
        unitId: unitQuran.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In which prayer do we recite Sūrah Al-Fātiḥah?',
        options: JSON.stringify(['Only Fajr prayer', 'Only Jumu\'ah', 'In every rak\'ah of every ṣalāh', 'Only on Fridays']),
        correctAnswer: 'In every rak\'ah of every ṣalāh',
        explanation: 'We recite Sūrah Al-Fātiḥah in every single rak\'ah of every prayer — that means at least 17 times every day!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'In which prayer do we recite Sūrah Al-Fātiḥah?',
        options: JSON.stringify(['Only Fajr prayer', 'Only Jumu\'ah', 'In every rak\'ah of every ṣalāh', 'Only on Fridays']),
        correctAnswer: 'In every rak\'ah of every ṣalāh',
        explanation: 'We recite Sūrah Al-Fātiḥah in every single rak\'ah of every prayer — that means at least 17 times every day!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-quran-q3' },
      create: {
        externalId: 'foundation-1-quran-q3',
        unitId: unitQuran.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the special nickname of Sūrah Al-Fātiḥah?',
        options: JSON.stringify(['Umm al-Qur\'ān', 'Al-Ikhlāṣ', 'An-Nās', 'Al-Mulk']),
        correctAnswer: 'Umm al-Qur\'ān',
        explanation: 'Rasūlullāh ﷺ called Sūrah Al-Fātiḥah "Umm al-Qur\'ān" — the Mother of the Qur\'ān — because it contains the most important messages.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What is the special nickname of Sūrah Al-Fātiḥah?',
        options: JSON.stringify(['Umm al-Qur\'ān', 'Al-Ikhlāṣ', 'An-Nās', 'Al-Mulk']),
        correctAnswer: 'Umm al-Qur\'ān',
        explanation: 'Rasūlullāh ﷺ called Sūrah Al-Fātiḥah "Umm al-Qur\'ān" — the Mother of the Qur\'ān — because it contains the most important messages.',
        difficulty: 'EASY',
      },
    }),
  ]);

  console.log('✅ Created quiz questions for Qur\'ān unit');

  // --- Du'ā Quizzes ---
  await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'foundation-1-dua-q1' },
      create: {
        externalId: 'foundation-1-dua-q1',
        unitId: unitDua.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What do we say before starting to eat?',
        options: JSON.stringify(['Alḥamdulillāh', 'Bismillāhi wa \'alā barakatillāh', 'SubḥānAllāh', 'Allāhu Akbar']),
        correctAnswer: 'Bismillāhi wa \'alā barakatillāh',
        explanation: 'Before eating we say "Bismillāhi wa \'alā barakatillāh" — In the name of Allāh and with the blessings of Allāh.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What do we say before starting to eat?',
        options: JSON.stringify(['Alḥamdulillāh', 'Bismillāhi wa \'alā barakatillāh', 'SubḥānAllāh', 'Allāhu Akbar']),
        correctAnswer: 'Bismillāhi wa \'alā barakatillāh',
        explanation: 'Before eating we say "Bismillāhi wa \'alā barakatillāh" — In the name of Allāh and with the blessings of Allāh.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-dua-q2' },
      create: {
        externalId: 'foundation-1-dua-q2',
        unitId: unitDua.id,
        type: 'TRUE_FALSE',
        questionText: 'We say "Allāhu Akbar" when going down the stairs.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'We say "Allāhu Akbar" when going UP the stairs, and "SubḥānAllāh" when going DOWN the stairs.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'We say "Allāhu Akbar" when going down the stairs.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'We say "Allāhu Akbar" when going UP the stairs, and "SubḥānAllāh" when going DOWN the stairs.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-dua-q3' },
      create: {
        externalId: 'foundation-1-dua-q3',
        unitId: unitDua.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What du\'ā do we say when someone gives us a gift or helps us?',
        options: JSON.stringify(['In shā\' Allāh', 'SubḥānAllāh', 'Jazāk Allāhu Khayran', 'Astaghfirullāh']),
        correctAnswer: 'Jazāk Allāhu Khayran',
        explanation: '"Jazāk Allāhu Khayran" means "May Allāh reward you with goodness" — it\'s the best way to thank someone!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What du\'ā do we say when someone gives us a gift or helps us?',
        options: JSON.stringify(['In shā\' Allāh', 'SubḥānAllāh', 'Jazāk Allāhu Khayran', 'Astaghfirullāh']),
        correctAnswer: 'Jazāk Allāhu Khayran',
        explanation: '"Jazāk Allāhu Khayran" means "May Allāh reward you with goodness" — it\'s the best way to thank someone!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-dua-q4' },
      create: {
        externalId: 'foundation-1-dua-q4',
        unitId: unitDua.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the greeting we give to other Muslims?',
        options: JSON.stringify(['Alḥamdulillāh', 'Assalāmu \'alaykum wa raḥmatullāhi wa barakātuh', 'Bismillāh', 'Māshā\' Allāh']),
        correctAnswer: 'Assalāmu \'alaykum wa raḥmatullāhi wa barakātuh',
        explanation: 'The Salām is our beautiful Islamic greeting — it means "Peace be upon you, and Allāh\'s mercy and blessings!"',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What is the greeting we give to other Muslims?',
        options: JSON.stringify(['Alḥamdulillāh', 'Assalāmu \'alaykum wa raḥmatullāhi wa barakātuh', 'Bismillāh', 'Māshā\' Allāh']),
        correctAnswer: 'Assalāmu \'alaykum wa raḥmatullāhi wa barakātuh',
        explanation: 'The Salām is our beautiful Islamic greeting — it means "Peace be upon you, and Allāh\'s mercy and blessings!"',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-dua-q5' },
      create: {
        externalId: 'foundation-1-dua-q5',
        unitId: unitDua.id,
        type: 'TRUE_FALSE',
        questionText: 'We say "Astaghfirullāh" when we make a mistake.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: '"Astaghfirullāh" means "I ask Allāh for forgiveness." Allāh loves when we say sorry to Him!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'We say "Astaghfirullāh" when we make a mistake.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: '"Astaghfirullāh" means "I ask Allāh for forgiveness." Allāh loves when we say sorry to Him!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-dua-q6' },
      create: {
        externalId: 'foundation-1-dua-q6',
        unitId: unitDua.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What du\'ā do we say at bedtime when we are about to sleep?',
        options: JSON.stringify(['Alḥamdulillāh', 'Bismika Allāhumma amūtu wa aḥyā', 'In shā\' Allāh', 'SubḥānAllāh']),
        correctAnswer: 'Bismika Allāhumma amūtu wa aḥyā',
        explanation: 'At sleeping time we say "Bismika Allāhumma amūtu wa aḥyā" — O Allāh, with Your name I die and live!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What du\'ā do we say at bedtime when we are about to sleep?',
        options: JSON.stringify(['Alḥamdulillāh', 'Bismika Allāhumma amūtu wa aḥyā', 'In shā\' Allāh', 'SubḥānAllāh']),
        correctAnswer: 'Bismika Allāhumma amūtu wa aḥyā',
        explanation: 'At sleeping time we say "Bismika Allāhumma amūtu wa aḥyā" — O Allāh, with Your name I die and live!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-dua-q7' },
      create: {
        externalId: 'foundation-1-dua-q7',
        unitId: unitDua.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the First Kalimah mean?',
        options: JSON.stringify([
          'There is no god except Allāh, and Muḥammad ﷺ is the Messenger of Allāh',
          'Allāh is the Greatest',
          'All praise is for Allāh',
          'In the name of Allāh',
        ]),
        correctAnswer: 'There is no god except Allāh, and Muḥammad ﷺ is the Messenger of Allāh',
        explanation: 'The First Kalimah (Lā ilāha illallāhu Muḥammadur rasūlullāh) is the most important statement a Muslim makes — it is the foundation of our faith!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does the First Kalimah mean?',
        options: JSON.stringify([
          'There is no god except Allāh, and Muḥammad ﷺ is the Messenger of Allāh',
          'Allāh is the Greatest',
          'All praise is for Allāh',
          'In the name of Allāh',
        ]),
        correctAnswer: 'There is no god except Allāh, and Muḥammad ﷺ is the Messenger of Allāh',
        explanation: 'The First Kalimah (Lā ilāha illallāhu Muḥammadur rasūlullāh) is the most important statement a Muslim makes — it is the foundation of our faith!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-dua-q8' },
      create: {
        externalId: 'foundation-1-dua-q8',
        unitId: unitDua.id,
        type: 'TRUE_FALSE',
        questionText: '"In shā\' Allāh" means "If Allāh wills."',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! "In shā\' Allāh" means "If Allāh wills." We say it when we plan to do something, because only Allāh knows what will happen!',
        difficulty: 'EASY',
      },
      update: {
        questionText: '"In shā\' Allāh" means "If Allāh wills."',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! "In shā\' Allāh" means "If Allāh wills." We say it when we plan to do something, because only Allāh knows what will happen!',
        difficulty: 'EASY',
      },
    }),
  ]);

  console.log('✅ Created quiz questions for Du\'ā unit');

  // --- 99 Names Quizzes ---
  await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'foundation-1-99-names-q1' },
      create: {
        externalId: 'foundation-1-99-names-q1',
        unitId: unitNames.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does "Ar-Raḥmān" mean?',
        options: JSON.stringify(['The King', 'The Most Gracious', 'The Most Holy', 'The Creator']),
        correctAnswer: 'The Most Gracious',
        explanation: 'Ar-Raḥmān means "The Most Gracious" — Allāh\'s kindness and love that covers everyone and everything!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does "Ar-Raḥmān" mean?',
        options: JSON.stringify(['The King', 'The Most Gracious', 'The Most Holy', 'The Creator']),
        correctAnswer: 'The Most Gracious',
        explanation: 'Ar-Raḥmān means "The Most Gracious" — Allāh\'s kindness and love that covers everyone and everything!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-99-names-q2' },
      create: {
        externalId: 'foundation-1-99-names-q2',
        unitId: unitNames.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of Allāh\'s names means "The King"?',
        options: JSON.stringify(['Ar-Raḥmān', 'Al-Quddūs', 'Al-Malik', 'Ar-Raḥīm']),
        correctAnswer: 'Al-Malik',
        explanation: 'Al-Malik means "The King" — Allāh is the King of everything in the entire universe!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Which of Allāh\'s names means "The King"?',
        options: JSON.stringify(['Ar-Raḥmān', 'Al-Quddūs', 'Al-Malik', 'Ar-Raḥīm']),
        correctAnswer: 'Al-Malik',
        explanation: 'Al-Malik means "The King" — Allāh is the King of everything in the entire universe!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-99-names-q3' },
      create: {
        externalId: 'foundation-1-99-names-q3',
        unitId: unitNames.id,
        type: 'TRUE_FALSE',
        questionText: 'Allāh has 99 beautiful names.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Allāh has 99 beautiful names. Each name tells us something wonderful about Allāh. Rasūlullāh ﷺ said whoever memorizes them all will enter Jannah!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Allāh has 99 beautiful names.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Allāh has 99 beautiful names. Each name tells us something wonderful about Allāh. Rasūlullāh ﷺ said whoever memorizes them all will enter Jannah!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-99-names-q4' },
      create: {
        externalId: 'foundation-1-99-names-q4',
        unitId: unitNames.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does "Al-Quddūs" mean?',
        options: JSON.stringify(['The Most Gracious', 'The King', 'The Most Holy', 'The Most Merciful']),
        correctAnswer: 'The Most Holy',
        explanation: 'Al-Quddūs means "The Most Holy" — Allāh is completely pure and perfect, with no faults at all!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does "Al-Quddūs" mean?',
        options: JSON.stringify(['The Most Gracious', 'The King', 'The Most Holy', 'The Most Merciful']),
        correctAnswer: 'The Most Holy',
        explanation: 'Al-Quddūs means "The Most Holy" — Allāh is completely pure and perfect, with no faults at all!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-1-99-names-q5' },
      create: {
        externalId: 'foundation-1-99-names-q5',
        unitId: unitNames.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the difference between Ar-Raḥmān and Ar-Raḥīm?',
        options: JSON.stringify([
          'They are the same meaning',
          'Ar-Raḥmān is for everyone, Ar-Raḥīm is special mercy for believers',
          'Ar-Raḥmān is only for Muslims',
          'Ar-Raḥīm is for animals only',
        ]),
        correctAnswer: 'Ar-Raḥmān is for everyone, Ar-Raḥīm is special mercy for believers',
        explanation: 'Ar-Raḥmān is Allāh\'s mercy for everyone — all people, animals, and creatures. Ar-Raḥīm is Allāh\'s special extra mercy reserved for the believers!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What is the difference between Ar-Raḥmān and Ar-Raḥīm?',
        options: JSON.stringify([
          'They are the same meaning',
          'Ar-Raḥmān is for everyone, Ar-Raḥīm is special mercy for believers',
          'Ar-Raḥmān is only for Muslims',
          'Ar-Raḥīm is for animals only',
        ]),
        correctAnswer: 'Ar-Raḥmān is for everyone, Ar-Raḥīm is special mercy for believers',
        explanation: 'Ar-Raḥmān is Allāh\'s mercy for everyone — all people, animals, and creatures. Ar-Raḥīm is Allāh\'s special extra mercy reserved for the believers!',
        difficulty: 'EASY',
      },
    }),
  ]);

  console.log('✅ Created quiz questions for 99 Names unit');
  console.log('✅ Created quiz questions for all 3 units');

  // ══════════════════════════════════════════════
  // FLASHCARDS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🃏 Creating flashcards...');

  // --- Qur'ān Flashcards (per-unit index, starts at 0) ---
  const quranFlashcards = [
    {
      front: 'What surah do we recite in every prayer?',
      back: 'Sūrah Al-Fātiḥah — the first sūrah in the Qur\'ān. We recite it in every rak\'ah of every ṣalāh!',
      frontArabic: null,
      backArabic: 'اَلْفَاتِحَة',
      category: 'rule',
      tags: ['qur\'ān', 'fātiḥah', 'prayer'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What is the nickname of Sūrah Al-Fātiḥah?',
      back: 'Umm al-Qur\'ān — "The Mother of the Qur\'ān." Rasūlullāh ﷺ gave it this special name!',
      frontArabic: null,
      backArabic: 'أُمُّ الْقُرْآن',
      category: 'definition',
      tags: ['qur\'ān', 'fātiḥah', 'umm-al-quran'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'How many verses does Sūrah Al-Fātiḥah have?',
      back: 'Seven verses (āyāt). Each one is a beautiful conversation with Allāh!',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['qur\'ān', 'fātiḥah', 'verses'],
      difficulty: 'EASY' as const,
    },
  ];

  let flashcardIndex = 0;

  await Promise.all(
    quranFlashcards.map((fc, i) => {
      const orderIndex = flashcardIndex + i;
      return prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unitQuran.id, orderIndex } },
        create: { ...fc, unitId: unitQuran.id, courseId: course.id, orderIndex },
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
  flashcardIndex += quranFlashcards.length;

  // --- Du'ā Flashcards ---
  const duaFlashcards = [
    {
      front: 'What do you say before eating?',
      back: 'بِسْمِ اللّٰهِ وَعَلٰى بَرَكَةِ اللّٰهِ — Bismillāhi wa \'alā barakatillāh — "In the name of Allāh and with the blessings of Allāh."',
      frontArabic: null,
      backArabic: 'بِسْمِ اللّٰهِ وَعَلٰى بَرَكَةِ اللّٰهِ',
      category: 'rule',
      tags: ['du\'ā', 'eating'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What is the First Kalimah?',
      back: 'Lā ilāha illallāhu Muḥammadur rasūlullāh — "There is no god except Allāh, Muḥammad ﷺ is the Messenger of Allāh."',
      frontArabic: null,
      backArabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَسُوْلُ اللّٰه',
      category: 'rule',
      tags: ['du\'ā', 'kalimah', 'faith'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do you say before sleeping?',
      back: 'بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا — Bismika Allāhumma amūtu wa aḥyā — "O Allāh, with Your name I die and live."',
      frontArabic: null,
      backArabic: 'بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا',
      category: 'rule',
      tags: ['du\'ā', 'sleeping'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do you say when you see something amazing?',
      back: 'SubḥānAllāh — سُبْحَانَ اللّٰهِ — "How perfect is Allāh!" We say it when we are amazed by Allāh\'s creation.',
      frontArabic: null,
      backArabic: 'سُبْحَانَ اللّٰهِ',
      category: 'rule',
      tags: ['du\'ā', 'subhanallah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do you say when you make a mistake?',
      back: 'Astaghfirullāh — أَسْتَغْفِرُ اللّٰهَ — "I ask Allāh for forgiveness." Allāh loves when we say sorry!',
      frontArabic: null,
      backArabic: 'أَسْتَغْفِرُ اللّٰهَ',
      category: 'rule',
      tags: ['du\'ā', 'forgiveness'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do you say when someone helps you?',
      back: 'Jazāk Allāhu Khayran — جَزَاكَ اللّٰهُ خَيْرًا — "May Allāh reward you with goodness!"',
      frontArabic: null,
      backArabic: 'جَزَاكَ اللّٰهُ خَيْرًا',
      category: 'rule',
      tags: ['du\'ā', 'gratitude'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do you say when greeting a Muslim?',
      back: 'Assalāmu \'alaykum wa raḥmatullāhi wa barakātuh — "Peace be upon you, and Allāh\'s mercy and blessings!"',
      frontArabic: null,
      backArabic: 'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ',
      category: 'rule',
      tags: ['du\'ā', 'salām', 'greeting'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do you say when climbing up stairs?',
      back: 'Allāhu Akbar — اَللّٰهُ أَكْبَرُ — "Allāh is the Greatest!"',
      frontArabic: null,
      backArabic: 'اَللّٰهُ أَكْبَرُ',
      category: 'rule',
      tags: ['du\'ā', 'stairs'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What is the Ta\'awwudh and when do we say it?',
      back: 'A\'ūdhu billāhi minash-shayṭānir-rajīm — "I seek refuge in Allāh from the cursed Shayṭān." Say it before reading Qur\'ān!',
      frontArabic: null,
      backArabic: 'أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      category: 'definition',
      tags: ['du\'ā', 'ta\'awwudh', 'protection'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What does "In shā\' Allāh" mean and when do you say it?',
      back: '"If Allāh wills." Say it whenever you plan to do something in the future — because only Allāh knows what will happen!',
      frontArabic: null,
      backArabic: 'إِنْ شَاءَ اللّٰهُ',
      category: 'rule',
      tags: ['du\'ā', 'inshallah', 'planning'],
      difficulty: 'EASY' as const,
    },
  ];

  flashcardIndex = 0;

  await Promise.all(
    duaFlashcards.map((fc, i) => {
      const orderIndex = flashcardIndex + i;
      return prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unitDua.id, orderIndex } },
        create: { ...fc, unitId: unitDua.id, courseId: course.id, orderIndex },
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
  flashcardIndex += duaFlashcards.length;

  // --- 99 Names Flashcards ---
  const namesFlashcards = [
    {
      front: 'اللّٰه — Allāh',
      back: 'The Greatest Name — The One and Only God who created everything and loves us every day!',
      frontArabic: 'اللّٰه',
      backArabic: null,
      category: 'vocabulary',
      tags: ['99-names', 'name-1', 'allah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'الرَّحْمٰنُ — Ar-Raḥmān',
      back: 'The Most Gracious — Allāh\'s kindness and love covers everything! Even the tiny ant receives His grace.',
      frontArabic: 'الرَّحْمٰنُ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['99-names', 'name-2', 'rahman'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'الرَّحِيمُ — Ar-Raḥīm',
      back: 'The Most Merciful — Allāh\'s special mercy for the believers. He will reward those who believe and do good!',
      frontArabic: 'الرَّحِيمُ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['99-names', 'name-3', 'raheem'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'الْمَلِكُ — Al-Malik',
      back: 'The King — Allāh is the King of the entire universe — earth, sky, stars, and everything in between!',
      frontArabic: 'الْمَلِكُ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['99-names', 'name-4', 'malik'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'الْقُدُّوسُ — Al-Quddūs',
      back: 'The Most Holy — Allāh is completely pure and perfect. He has absolutely no faults or mistakes!',
      frontArabic: 'الْقُدُّوسُ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['99-names', 'name-5', 'quddus'],
      difficulty: 'EASY' as const,
    },
  ];

  flashcardIndex = 0;

  await Promise.all(
    namesFlashcards.map((fc, i) => {
      const orderIndex = flashcardIndex + i;
      return prisma.flashCard.upsert({
        where: { unitId_orderIndex: { unitId: unitNames.id, orderIndex } },
        create: { ...fc, unitId: unitNames.id, courseId: course.id, orderIndex },
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

  console.log('✅ Created flashcards for all 3 units');

  console.log('');
  console.log('✅ Maktab Foundation 1 seed complete!');
  console.log('');
}
