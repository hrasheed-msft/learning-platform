import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Foundation 2 — Islamic Curriculum Seed
 * Source: An Nasihah Publications Qur'ān & Du'ā Book, Age Range: 5–6 years
 *
 * Covers three subjects: Qur'ān (Sūrahs An-Nās, Al-Falaq, Al-Ikhlāṣ),
 * Du'ā (14 daily supplications including 2nd & 3rd Kalimahs),
 * and 99 Names of Allāh (Names 6–10).
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions and flashcards per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-foundation2.ts
 */

export async function seedMaktabFoundation2() {
  console.log('📚 Starting Maktab Foundation 2 seed...');
  console.log('');

  // ──────────────────────────────────────────────
  // COURSE
  // ──────────────────────────────────────────────

  const course = await prisma.course.upsert({
    where: { slug: 'maktab-foundation-2' },
    create: {
      slug: 'maktab-foundation-2',
      title: 'Maktab Foundation 2',
      description: 'Foundation-level Islamic education for learners aged 5–6 years. Covers Sūrahs An-Nās, Al-Falaq, and Al-Ikhlāṣ, essential daily du\'ās including the Second and Third Kalimahs, and Names 6–10 of the 99 Names of Allāh.',
      category: 'FIQH',
      ageLevels: ['EARLY_CHILD', 'CHILD'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Foundation 2',
      description: 'Foundation-level Islamic education for learners aged 5–6 years. Covers Sūrahs An-Nās, Al-Falaq, and Al-Ikhlāṣ, essential daily du\'ās including the Second and Third Kalimahs, and Names 6–10 of the 99 Names of Allāh.',
      category: 'FIQH',
      ageLevels: ['EARLY_CHILD', 'CHILD'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // UNIT 0: QUR'ĀN
  // ──────────────────────────────────────────────

  const unitQuran = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'foundation-2-quran' } },
    create: {
      slug: 'foundation-2-quran',
      courseId: course.id,
      title: 'Qur\'ān — Sūrahs An-Nās, Al-Falaq & Al-Ikhlāṣ',
      description: 'Learn and memorize the three Qul sūrahs — our protection from Allāh.',
      orderIndex: 0,
      content: `
<h2>The Three Protection Sūrahs 🛡️</h2>
<p>Today we will learn three very special sūrahs called the <strong>"Qul" sūrahs</strong> — because they each begin with the word "Qul" which means "Say!" Allāh is telling us to say these beautiful words.</p>
<p>Rasūlullāh ﷺ loved these three sūrahs so much! He used to recite them every night before sleeping. They protect us from all kinds of harm — so whenever you feel scared or want Allāh\'s protection, recite these sūrahs!</p>

<h2>Sūrah Al-Ikhlāṣ — The Sūrah of Purity</h2>
<p>This sūrah teaches us about the Oneness of Allāh — that Allāh is One, has no family, and nobody is like Him!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</p>
  <p>قُلْ هُوَ اللّٰهُ أَحَدٌ</p>
  <p>اَللّٰهُ الصَّمَدُ</p>
  <p>لَمْ يَلِدْ وَلَمْ يُوْلَدْ</p>
  <p>وَلَمْ يَكُنْ لَّهُ كُفُوًا أَحَدٌ</p>
</div>

<h3>Transliteration</h3>
<ol>
  <li><em>Qul huwallāhu aḥad</em></li>
  <li><em>Allāhuṣ-ṣamad</em></li>
  <li><em>Lam yalid wa lam yūlad</em></li>
  <li><em>Wa lam yakun lahū kufuwan aḥad</em></li>
</ol>

<h3>Translation</h3>
<ol>
  <li><strong>"Say: He is Allāh, the One!"</strong> — Allāh is One. There is only ONE God!</li>
  <li><strong>"Allāh is As-Ṣamad (the Self-Sufficient)."</strong> — Allāh needs nothing and nobody, but everyone needs Him!</li>
  <li><strong>"He did not give birth and was not born."</strong> — Allāh has no children and no parents.</li>
  <li><strong>"And there is none equal to Him."</strong> — Nobody is like Allāh. He is completely unique!</li>
</ol>

<p>💡 <strong>Awesome fact:</strong> Rasūlullāh ﷺ said that reciting Sūrah Al-Ikhlāṣ is equal to reciting one-third of the whole Qur\'ān! If you recite it 3 times, that\'s like reading the whole Qur\'ān. SubḥānAllāh!</p>

<h2>Sūrah Al-Falaq — The Sūrah of the Daybreak</h2>
<p>This sūrah asks Allāh to protect us from bad things — darkness, evil, and black magic!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</p>
  <p>قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ</p>
  <p>مِنْ شَرِّ مَا خَلَقَ</p>
  <p>وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ</p>
  <p>وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ</p>
  <p>وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ</p>
</div>

<h3>Transliteration</h3>
<ol>
  <li><em>Qul a'ūdhu bi rabbil-falaq</em></li>
  <li><em>Min sharri mā khalaq</em></li>
  <li><em>Wa min sharri ghāsiqin idhā waqab</em></li>
  <li><em>Wa min sharrin-naffāthāti fil-'uqad</em></li>
  <li><em>Wa min sharri ḥāsidin idhā ḥasad</em></li>
</ol>

<h3>Translation</h3>
<ol>
  <li><strong>"Say: I seek refuge with the Lord of the daybreak."</strong> — We ask the Lord of the morning for protection!</li>
  <li><strong>"From the evil of what He has created."</strong> — From all kinds of harm and bad things.</li>
  <li><strong>"And from the evil of the night when it settles."</strong> — From the darkness of the night.</li>
  <li><strong>"And from the evil of those who blow on knots."</strong> — From magic and spells.</li>
  <li><strong>"And from the evil of the envious when they envy."</strong> — From the evil eye and jealousy.</li>
</ol>

<p>🌅 <em>"Al-Falaq" means "the daybreak" — when the sun rises and the darkness goes away! Allāh is the Lord of that light.</em></p>

<h2>Sūrah An-Nās — The Sūrah of Mankind</h2>
<p>This sūrah asks Allāh to protect us from the whisperings of Shayṭān who tries to put bad thoughts into our hearts!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</p>
  <p>قُلْ أَعُوذُ بِرَبِّ النَّاسِ</p>
  <p>مَلِكِ النَّاسِ</p>
  <p>إِلٰهِ النَّاسِ</p>
  <p>مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ</p>
  <p>الَّذِي يُوَسْوِسُ فِي صُدُوْرِ النَّاسِ</p>
  <p>مِنَ الْجِنَّةِ وَالنَّاسِ</p>
</div>

<h3>Transliteration</h3>
<ol>
  <li><em>Qul a'ūdhu bi rabbin-nās</em></li>
  <li><em>Malikin-nās</em></li>
  <li><em>Ilāhin-nās</em></li>
  <li><em>Min sharril-waswāsil-khannās</em></li>
  <li><em>Alladhī yuwaswisu fī ṣudūrin-nās</em></li>
  <li><em>Minal-jinnati wan-nās</em></li>
</ol>

<h3>Translation</h3>
<ol>
  <li><strong>"Say: I seek refuge with the Lord of mankind."</strong></li>
  <li><strong>"The King of mankind."</strong></li>
  <li><strong>"The God of mankind."</strong></li>
  <li><strong>"From the evil of the sneaking whisperer."</strong> — Shayṭān who whispers bad thoughts!</li>
  <li><strong>"Who whispers in the hearts of people."</strong> — Bad thoughts that come into your heart.</li>
  <li><strong>"From jinn and people."</strong> — All kinds of evil.</li>
</ol>

<p>🤲 <strong>How to use these sūrahs:</strong></p>
<ul>
  <li>Recite all three every morning and evening.</li>
  <li>Blow into your hands and wipe over your body three times before sleeping.</li>
  <li>Recite them if you feel scared or worried — Allāh will protect you!</li>
</ul>

<h2>🌈 Tips for Memorizing</h2>
<ul>
  <li>Learn one sūrah at a time — start with Al-Ikhlāṣ (it\'s the shortest!).</li>
  <li>Recite them every night before sleeping — that\'s the sunnah!</li>
  <li>Listen to a beautiful recitation and repeat after it.</li>
</ul>
      `.trim(),
    },
    update: {
      title: 'Qur\'ān — Sūrahs An-Nās, Al-Falaq & Al-Ikhlāṣ',
      description: 'Learn and memorize the three Qul sūrahs — our protection from Allāh.',
      content: `
<h2>The Three Protection Sūrahs 🛡️</h2>
<p>Today we will learn three very special sūrahs called the <strong>"Qul" sūrahs</strong> — because they each begin with the word "Qul" which means "Say!" Allāh is telling us to say these beautiful words.</p>
<p>Rasūlullāh ﷺ loved these three sūrahs so much! He used to recite them every night before sleeping. They protect us from all kinds of harm!</p>

<h2>Sūrah Al-Ikhlāṣ — The Sūrah of Purity</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>قُلْ هُوَ اللّٰهُ أَحَدٌ ۝ اَللّٰهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُوْلَدْ ۝ وَلَمْ يَكُنْ لَّهُ كُفُوًا أَحَدٌ</p>
</div>

<h2>Sūrah Al-Falaq — The Sūrah of the Daybreak</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ</p>
</div>

<h2>Sūrah An-Nās — The Sūrah of Mankind</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُوْرِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ</p>
</div>
      `.trim(),
      orderIndex: 0,
    },
  });

  console.log('✅ Created Unit 0: Qur\'ān');

  // ──────────────────────────────────────────────
  // UNIT 1: DU'Ā
  // ──────────────────────────────────────────────

  const unitDua = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'foundation-2-dua' } },
    create: {
      slug: 'foundation-2-dua',
      courseId: course.id,
      title: 'Du\'ā — More Daily Supplications & The Second & Third Kalimahs',
      description: 'Learn more essential du\'ās for everyday situations.',
      orderIndex: 1,
      content: `
<h2>More Beautiful Du'ās 🤲</h2>
<p>Now that we know the du'ās from Foundation 1, let's learn even more! These du'ās will help us every single day in all kinds of situations. Allāh loves hearing our voices!</p>

<h2>1. The Second Kalimah — Shahādah</h2>
<p>The Shahādah is the most important statement in Islam! When you say this, you are declaring your faith — that Allāh is One and Muḥammad ﷺ is His messenger.</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>أَشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ</p>
</div>
<p><em>Ashhadu al-lā ilāha illallāhu waḥdahū lā sharīka lahū wa ashhadu anna muḥammadan 'abduhū wa rasūluh</em></p>
<p><strong>"I bear witness that there is no god except Allāh, alone, with no partner, and I bear witness that Muḥammad ﷺ is His servant and messenger."</strong></p>
<p>✨ <strong>When to say it:</strong> In the adhān (call to prayer), after wuḍū', and as a declaration of our faith!</p>

<h2>2. The Third Kalimah — Tamjīd</h2>
<p>The Third Kalimah is called "Tamjīd" — glorifying Allāh. It is made up of four beautiful phrases that we often say!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ</p>
</div>
<p><em>SubḥānAllāhi walḥamdulillāhi wa lā ilāha illallāhu wallāhu akbar</em></p>
<p><strong>"Glory be to Allāh, all praise is for Allāh, there is no god except Allāh, and Allāh is the Greatest."</strong></p>
<p>💛 <strong>When to say it:</strong> After ṣalāh, as a form of remembrance (dhikr), and whenever you want to praise Allāh!</p>

<h2>3. When We Hear the Prophet ﷺ's Name — Ṣallā Allāh</h2>
<p>Whenever we hear the name of our beloved Rasūlullāh ﷺ, we send blessings upon him. This makes Allāh very happy!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ</p>
</div>
<p><em>Ṣallallāhu 'alayhi wa sallam</em></p>
<p><strong>"May Allāh send blessings and peace upon him."</strong></p>
<p>🌹 <strong>When to say it:</strong> Every time you hear, say, read, or write the name of Muḥammad ﷺ!</p>

<h2>4. When We Lose Something — Innā lillāh</h2>
<p>When something sad happens — something is lost, someone is sick, or someone passes away — we say this to remind ourselves that everything belongs to Allāh.</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>إِنَّا لِلّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ</p>
</div>
<p><em>Innā lillāhi wa innā ilayhi rāji'ūn</em></p>
<p><strong>"Indeed, we belong to Allāh, and indeed to Him we shall return."</strong></p>
<p>💚 <strong>When to say it:</strong> When something is lost, when you hear sad news, when someone passes away.</p>

<h2>5. When We Are Frightened — Lā ilāha illallāh</h2>
<p>When you feel scared — in the dark, during a storm, or at any time — say this! It reminds us that Allāh is always with us.</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>لَا إِلٰهَ إِلَّا اللّٰهُ</p>
</div>
<p><em>Lā ilāha illallāh</em></p>
<p><strong>"There is no god except Allāh."</strong></p>
<p>🌙 <strong>When to say it:</strong> When you feel scared or worried — Allāh will protect you!</p>

<h2>6. When We Sneeze — Alḥamdulillāh</h2>
<p>When you sneeze, say "Alḥamdulillāh" — it means Allāh is protecting you and your body is healthy!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلْحَمْدُ لِلّٰهِ</p>
</div>
<p><em>Alḥamdulillāh</em> — "All praise is for Allāh."</p>
<p>🤧 <strong>When to say it:</strong> Right after you sneeze!</p>

<h2>7. When Another Person Sneezes — Yarḥamukallāh</h2>
<p>When someone else sneezes and says "Alḥamdulillāh," you reply with this beautiful du'ā — asking Allāh to have mercy on them!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>يَرْحَمُكَ اللّٰهُ</p>
</div>
<p><em>Yarḥamukallāh</em> — "May Allāh have mercy on you."</p>
<p>😊 <strong>When to say it:</strong> When someone else sneezes and says "Alḥamdulillāh."</p>

<h2>8. The Sneezing Person's Reply</h2>
<p>When someone says "Yarḥamukallāh" to you after you sneeze, you reply with this du'ā for them too!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>يَهْدِيكُمُ اللّٰهُ وَيُصْلِحُ بَالَكُمْ</p>
</div>
<p><em>Yahdīkumullāhu wa yuṣliḥu bālakum</em></p>
<p><strong>"May Allāh guide you and make your affairs good."</strong></p>
<p>💛 <strong>When to say it:</strong> When someone says "Yarḥamukallāh" to you after your sneeze.</p>

<h2>9. When Entering the Washroom</h2>
<p>Before entering the washroom, we say this du'ā to ask Allāh for protection from evil:</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ</p>
</div>
<p><em>Allāhumma innī a'ūdhu bika minal-khubuthi wal-khabā'ith</em></p>
<p><strong>"O Allāh, I seek Your protection from evil and evil beings."</strong></p>
<p>🚪 <strong>When to say it:</strong> Just before you step into the washroom (toilet). Enter with the LEFT foot.</p>

<h2>10. When Leaving the Washroom</h2>
<p>After leaving the washroom, we say this du'ā to thank Allāh and ask for His forgiveness. Exit with the RIGHT foot!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>غُفْرَانَكَ، اَلْحَمْدُ لِلّٰهِ الَّذِي أَذْهَبَ عَنِّي الْأَذٰى وَعَافَانِي</p>
</div>
<p><em>Ghufrānaka, alḥamdulillāhil-ladhī adh-haba 'annil-adhā wa 'āfānī</em></p>
<p><strong>"I seek Your forgiveness. All praise is for Allāh who removed harm from me and gave me well-being."</strong></p>
<p>🚿 <strong>When to say it:</strong> Just after stepping out of the washroom with the RIGHT foot.</p>

<h2>11. After Eating</h2>
<p>After we finish our food, we thank Allāh for feeding us and making us Muslims!</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ</p>
</div>
<p><em>Alḥamdulillāhil-ladhī aṭ'amanā wa saqānā wa ja'alanā muslimīn</em></p>
<p><strong>"All praise is for Allāh who fed us, gave us to drink, and made us Muslims."</strong></p>
<p>🍽️ <strong>When to say it:</strong> After finishing your meal.</p>

<h2>12. When Forgetting the Du'ā for Eating</h2>
<p>If you forget to say Bismillāh at the start of eating, don't worry! Say this in the middle of your meal:</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ أَوَّلَهُ وَآخِرَهُ</p>
</div>
<p><em>Bismillāhi awwalahū wa ākhirah</em></p>
<p><strong>"In the name of Allāh, at the beginning and at the end."</strong></p>
<p>😌 <strong>When to say it:</strong> If you forgot to say Bismillāh before eating — say this anytime during the meal!</p>

<h2>13. When Drinking Milk</h2>
<p>There is a special du'ā just for drinking milk! Milk is such a blessing from Allāh.</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَللّٰهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ</p>
</div>
<p><em>Allāhumma bārik lanā fīhi wa zidnā minh</em></p>
<p><strong>"O Allāh, bless us in it and give us more of it."</strong></p>
<p>🥛 <strong>When to say it:</strong> When you drink milk — asking Allāh to bless it for you!</p>

<h2>14. When Waking Up</h2>
<p>The first thing we do when we wake up is thank Allāh for waking us up! Sleep is like a small rest, and Allāh brought us back to life again.</p>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ</p>
</div>
<p><em>Alḥamdulillāhil-ladhī aḥyānā ba'da mā amātanā wa ilayhin-nushūr</em></p>
<p><strong>"All praise is for Allāh who gave us life after causing us to die, and to Him is the return."</strong></p>
<p>☀️ <strong>When to say it:</strong> The very first thing when you open your eyes in the morning!</p>

<h2>🌟 Amazing Work!</h2>
<p>You have now learned <strong>14 more du'ās</strong> plus the Second and Third Kalimahs! Together with Foundation 1, you know over 30 du'ās. Keep practising — Allāh loves hearing your du'ās! 💛</p>
      `.trim(),
    },
    update: {
      title: 'Du\'ā — More Daily Supplications & The Second & Third Kalimahs',
      description: 'Learn more essential du\'ās for everyday situations.',
      content: `
<h2>More Beautiful Du'ās 🤲</h2>
<p>Let's learn even more du'ās for everyday situations!</p>

<h2>1. The Second Kalimah — Shahādah</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>أَشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ</p>
</div>

<h2>2. The Third Kalimah — Tamjīd</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ</p>
</div>

<h2>3. On Hearing the Prophet ﷺ's Name</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ</p>
</div>

<h2>4. When We Lose Something</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>إِنَّا لِلّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ</p>
</div>

<h2>5. When Frightened</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>لَا إِلٰهَ إِلَّا اللّٰهُ</p>
</div>

<h2>6. When Sneezing</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلْحَمْدُ لِلّٰهِ</p>
</div>

<h2>7. When Another Person Sneezes</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>يَرْحَمُكَ اللّٰهُ</p>
</div>

<h2>8. Reply of the Sneezing Person</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>يَهْدِيكُمُ اللّٰهُ وَيُصْلِحُ بَالَكُمْ</p>
</div>

<h2>9. Entering the Washroom</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ</p>
</div>

<h2>10. Leaving the Washroom</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>غُفْرَانَكَ، اَلْحَمْدُ لِلّٰهِ الَّذِي أَذْهَبَ عَنِّي الْأَذٰى وَعَافَانِي</p>
</div>

<h2>11. After Eating</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ</p>
</div>

<h2>12. Forgotten Du'ā for Eating</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>بِسْمِ اللّٰهِ أَوَّلَهُ وَآخِرَهُ</p>
</div>

<h2>13. When Drinking Milk</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَللّٰهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ</p>
</div>

<h2>14. When Waking Up</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>اَلْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ</p>
</div>
      `.trim(),
      orderIndex: 1,
    },
  });

  console.log('✅ Created Unit 1: Du\'ā');

  // ──────────────────────────────────────────────
  // UNIT 2: 99 NAMES OF ALLĀH (6–10)
  // ──────────────────────────────────────────────

  const unitNames = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'foundation-2-99-names' } },
    create: {
      slug: 'foundation-2-99-names',
      courseId: course.id,
      title: '99 Names of Allāh — Names 6–10',
      description: 'Learn five more Beautiful Names of Allāh.',
      orderIndex: 2,
      content: `
<h2>More Beautiful Names of Allāh ✨</h2>
<p>We already learned the first five names of Allāh. Now let's learn five more! Each name teaches us something amazing and special about our Creator.</p>

<h2>Name 6 — As-Salām (السَّلَامُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>السَّلَامُ</p>
</div>
<p><strong>The Source of Peace — The One Who Is Free from All Imperfection</strong></p>
<p>As-Salām means Allāh is perfect peace itself. He has no worries, no sadness, no problems. When we go to Jannah, we will live in complete peace — because Allāh, As-Salām, will be there!</p>
<p>☮️ <em>Think about it:</em> The word "Salām" is in our greeting "Assalāmu 'alaykum" — when we give Salām, we are sharing peace with each other. That peace comes from Allāh!</p>

<h2>Name 7 — Al-Mu'min (الْمُؤْمِنُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>الْمُؤْمِنُ</p>
</div>
<p><strong>The Giver of Security — The One Who Grants Safety and Removes Fear</strong></p>
<p>Al-Mu'min means Allāh is the One who makes us feel safe and secure. He protects us from all fears. When we are scared, we remember that Allāh is Al-Mu'min — and our fear goes away!</p>
<p>🏡 <em>Think about it:</em> You feel safe at home with your family. Allāh gives us an even deeper feeling of safety in our hearts because He is Al-Mu'min!</p>

<h2>Name 8 — Al-Muhaymin (الْمُهَيْمِنُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>الْمُهَيْمِنُ</p>
</div>
<p><strong>The Protector — The One Who Watches Over and Guards Everything</strong></p>
<p>Al-Muhaymin means Allāh watches over everything — He sees every leaf that falls, every bird that flies, and every thought in your heart! Nothing happens without Allāh knowing about it.</p>
<p>👁️ <em>Think about it:</em> Even when you are sleeping and nobody is watching you, Allāh — Al-Muhaymin — is always watching over you and keeping you safe!</p>

<h2>Name 9 — Al-'Azīz (الْعَزِيزُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>الْعَزِيزُ</p>
</div>
<p><strong>The Almighty — The One Who Is All-Powerful and Cannot Be Defeated</strong></p>
<p>Al-'Azīz means Allāh is the Almighty — the most powerful of all! No army, no country, no force in the universe can defeat Allāh or stop His will. Whatever Allāh decides will always happen!</p>
<p>⚡ <em>Think about it:</em> The biggest storm, the tallest mountain, the widest ocean — all of these are tiny compared to the power of Allāh, Al-'Azīz!</p>

<h2>Name 10 — Al-Jabbār (الْجَبَّارُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large">
  <p>الْجَبَّارُ</p>
</div>
<p><strong>The Compeller — The One Who Restores and Repairs What Is Broken</strong></p>
<p>Al-Jabbār comes from a word that means to mend something broken. Allāh is Al-Jabbār — He fixes broken hearts! When you are sad, hurt, or feeling lonely, Allāh can heal your heart and make you feel better.</p>
<p>❤️‍🩹 <em>Think about it:</em> If you break a toy, sometimes it can\'t be fixed. But Allāh — Al-Jabbār — can fix anything, including broken hearts!</p>

<h2>🌈 Review — Names 6–10</h2>
<table>
  <tr><th>Name</th><th>Arabic</th><th>Meaning</th></tr>
  <tr><td>6. As-Salām</td><td>السَّلَامُ</td><td>The Source of Peace</td></tr>
  <tr><td>7. Al-Mu'min</td><td>الْمُؤْمِنُ</td><td>The Giver of Security</td></tr>
  <tr><td>8. Al-Muhaymin</td><td>الْمُهَيْمِنُ</td><td>The Protector</td></tr>
  <tr><td>9. Al-'Azīz</td><td>الْعَزِيزُ</td><td>The Almighty</td></tr>
  <tr><td>10. Al-Jabbār</td><td>الْجَبَّارُ</td><td>The Compeller</td></tr>
</table>

<p>🌟 <strong>Brilliant!</strong> You now know 10 beautiful names of Allāh — that's 10 amazing ways to know and love our Creator! Keep going — 89 more to go!</p>
      `.trim(),
    },
    update: {
      title: '99 Names of Allāh — Names 6–10',
      description: 'Learn five more Beautiful Names of Allāh.',
      content: `
<h2>More Beautiful Names of Allāh ✨</h2>
<p>Let's learn five more beautiful names of Allāh — Names 6 through 10!</p>

<h2>Name 6 — As-Salām (السَّلَامُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large"><p>السَّلَامُ</p></div>
<p><strong>The Source of Peace</strong> — Allāh is perfect peace itself!</p>

<h2>Name 7 — Al-Mu'min (الْمُؤْمِنُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large"><p>الْمُؤْمِنُ</p></div>
<p><strong>The Giver of Security</strong> — Allāh makes us feel safe and secure.</p>

<h2>Name 8 — Al-Muhaymin (الْمُهَيْمِنُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large"><p>الْمُهَيْمِنُ</p></div>
<p><strong>The Protector</strong> — Allāh watches over and guards everything.</p>

<h2>Name 9 — Al-'Azīz (الْعَزِيزُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large"><p>الْعَزِيزُ</p></div>
<p><strong>The Almighty</strong> — Allāh is all-powerful and cannot be defeated.</p>

<h2>Name 10 — Al-Jabbār (الْجَبَّارُ)</h2>
<div dir="rtl" lang="ar" class="arabic-large"><p>الْجَبَّارُ</p></div>
<p><strong>The Compeller</strong> — Allāh restores and repairs what is broken — even hearts!</p>
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
      where: { externalId: 'foundation-2-quran-q1' },
      create: {
        externalId: 'foundation-2-quran-q1',
        unitId: unitQuran.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What do Sūrahs An-Nās, Al-Falaq, and Al-Ikhlāṣ all begin with?',
        options: JSON.stringify(['Alḥamdulillāh', 'Bismillāh only', 'The word "Qul" (Say)', 'SubḥānAllāh']),
        correctAnswer: 'The word "Qul" (Say)',
        explanation: 'All three sūrahs begin with the word "Qul" — meaning "Say!" — so they are called the "Qul sūrahs." Allāh is telling us to say these special words!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What do Sūrahs An-Nās, Al-Falaq, and Al-Ikhlāṣ all begin with?',
        options: JSON.stringify(['Alḥamdulillāh', 'Bismillāh only', 'The word "Qul" (Say)', 'SubḥānAllāh']),
        correctAnswer: 'The word "Qul" (Say)',
        explanation: 'All three sūrahs begin with the word "Qul" — meaning "Say!" — so they are called the "Qul sūrahs." Allāh is telling us to say these special words!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-quran-q2' },
      create: {
        externalId: 'foundation-2-quran-q2',
        unitId: unitQuran.id,
        type: 'TRUE_FALSE',
        questionText: 'Sūrah Al-Ikhlāṣ teaches us that Allāh is One and has no partner.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Sūrah Al-Ikhlāṣ says "Qul huwallāhu aḥad" — Say: He is Allāh, the One! Allāh is One and has no partner, no children, and no equal.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Sūrah Al-Ikhlāṣ teaches us that Allāh is One and has no partner.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Sūrah Al-Ikhlāṣ says "Qul huwallāhu aḥad" — Say: He is Allāh, the One! Allāh is One and has no partner, no children, and no equal.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-quran-q3' },
      create: {
        externalId: 'foundation-2-quran-q3',
        unitId: unitQuran.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does "An-Nās" mean in Arabic?',
        options: JSON.stringify(['The Daybreak', 'Mankind', 'The Purity', 'The Star']),
        correctAnswer: 'Mankind',
        explanation: '"An-Nās" means "Mankind" or "People." In Sūrah An-Nās, we ask Allāh — the Lord of Mankind — to protect us from the whisperings of Shayṭān.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does "An-Nās" mean in Arabic?',
        options: JSON.stringify(['The Daybreak', 'Mankind', 'The Purity', 'The Star']),
        correctAnswer: 'Mankind',
        explanation: '"An-Nās" means "Mankind" or "People." In Sūrah An-Nās, we ask Allāh — the Lord of Mankind — to protect us from the whisperings of Shayṭān.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-quran-q4' },
      create: {
        externalId: 'foundation-2-quran-q4',
        unitId: unitQuran.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which sūrah is equal to one-third of the Qur\'ān when recited?',
        options: JSON.stringify(['Sūrah An-Nās', 'Sūrah Al-Falaq', 'Sūrah Al-Ikhlāṣ', 'Sūrah Al-Fātiḥah']),
        correctAnswer: 'Sūrah Al-Ikhlāṣ',
        explanation: 'Rasūlullāh ﷺ said Sūrah Al-Ikhlāṣ is equal to one-third of the Qur\'ān! If you recite it 3 times, that\'s like reading the whole Qur\'ān. SubḥānAllāh!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Which sūrah is equal to one-third of the Qur\'ān when recited?',
        options: JSON.stringify(['Sūrah An-Nās', 'Sūrah Al-Falaq', 'Sūrah Al-Ikhlāṣ', 'Sūrah Al-Fātiḥah']),
        correctAnswer: 'Sūrah Al-Ikhlāṣ',
        explanation: 'Rasūlullāh ﷺ said Sūrah Al-Ikhlāṣ is equal to one-third of the Qur\'ān! If you recite it 3 times, that\'s like reading the whole Qur\'ān. SubḥānAllāh!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-quran-q5' },
      create: {
        externalId: 'foundation-2-quran-q5',
        unitId: unitQuran.id,
        type: 'TRUE_FALSE',
        questionText: 'Rasūlullāh ﷺ used to recite these three sūrahs every night before sleeping.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Rasūlullāh ﷺ would recite Sūrahs Al-Ikhlāṣ, Al-Falaq, and An-Nās every night. He would blow into his hands and wipe over his body three times for protection!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Rasūlullāh ﷺ used to recite these three sūrahs every night before sleeping.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Rasūlullāh ﷺ would recite Sūrahs Al-Ikhlāṣ, Al-Falaq, and An-Nās every night. He would blow into his hands and wipe over his body three times for protection!',
        difficulty: 'EASY',
      },
    }),
  ]);

  console.log('✅ Created quiz questions for Qur\'ān unit');

  // --- Du'ā Quizzes ---
  await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'foundation-2-dua-q1' },
      create: {
        externalId: 'foundation-2-dua-q1',
        unitId: unitDua.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What do we say after finishing a meal?',
        options: JSON.stringify([
          'Bismillāh',
          'Alḥamdulillāhil-ladhī aṭ\'amanā wa saqānā wa ja\'alanā muslimīn',
          'In shā\' Allāh',
          'SubḥānAllāh',
        ]),
        correctAnswer: 'Alḥamdulillāhil-ladhī aṭ\'amanā wa saqānā wa ja\'alanā muslimīn',
        explanation: 'After eating we thank Allāh with "Alḥamdulillāhil-ladhī aṭ\'amanā wa saqānā wa ja\'alanā muslimīn" — All praise to Allāh who fed us, gave us drink, and made us Muslims!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What do we say after finishing a meal?',
        options: JSON.stringify([
          'Bismillāh',
          'Alḥamdulillāhil-ladhī aṭ\'amanā wa saqānā wa ja\'alanā muslimīn',
          'In shā\' Allāh',
          'SubḥānAllāh',
        ]),
        correctAnswer: 'Alḥamdulillāhil-ladhī aṭ\'amanā wa saqānā wa ja\'alanā muslimīn',
        explanation: 'After eating we thank Allāh with "Alḥamdulillāhil-ladhī aṭ\'amanā wa saqānā wa ja\'alanā muslimīn" — All praise to Allāh who fed us, gave us drink, and made us Muslims!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-dua-q2' },
      create: {
        externalId: 'foundation-2-dua-q2',
        unitId: unitDua.id,
        type: 'TRUE_FALSE',
        questionText: 'We enter the washroom with the right foot.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'We enter the washroom with the LEFT foot and exit with the RIGHT foot — this is the Sunnah of Rasūlullāh ﷺ!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'We enter the washroom with the right foot.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'We enter the washroom with the LEFT foot and exit with the RIGHT foot — this is the Sunnah of Rasūlullāh ﷺ!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-dua-q3' },
      create: {
        externalId: 'foundation-2-dua-q3',
        unitId: unitDua.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'When you sneeze and say "Alḥamdulillāh," what should the person nearby say to you?',
        options: JSON.stringify(['Bismillāh', 'Yarḥamukallāh', 'SubḥānAllāh', 'Allāhu Akbar']),
        correctAnswer: 'Yarḥamukallāh',
        explanation: '"Yarḥamukallāh" means "May Allāh have mercy on you." It is the Sunnah reply when someone sneezes and says "Alḥamdulillāh."',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'When you sneeze and say "Alḥamdulillāh," what should the person nearby say to you?',
        options: JSON.stringify(['Bismillāh', 'Yarḥamukallāh', 'SubḥānAllāh', 'Allāhu Akbar']),
        correctAnswer: 'Yarḥamukallāh',
        explanation: '"Yarḥamukallāh" means "May Allāh have mercy on you." It is the Sunnah reply when someone sneezes and says "Alḥamdulillāh."',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-dua-q4' },
      create: {
        externalId: 'foundation-2-dua-q4',
        unitId: unitDua.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the first thing we say when we wake up in the morning?',
        options: JSON.stringify([
          'Bismillāh',
          'Alḥamdulillāhil-ladhī aḥyānā ba\'da mā amātanā',
          'SubḥānAllāh',
          'In shā\' Allāh',
        ]),
        correctAnswer: 'Alḥamdulillāhil-ladhī aḥyānā ba\'da mā amātanā',
        explanation: 'The first thing we say when waking up is the waking du\'ā: "Alḥamdulillāhil-ladhī aḥyānā ba\'da mā amātanā wa ilayhin-nushūr" — thanking Allāh for waking us up!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What is the first thing we say when we wake up in the morning?',
        options: JSON.stringify([
          'Bismillāh',
          'Alḥamdulillāhil-ladhī aḥyānā ba\'da mā amātanā',
          'SubḥānAllāh',
          'In shā\' Allāh',
        ]),
        correctAnswer: 'Alḥamdulillāhil-ladhī aḥyānā ba\'da mā amātanā',
        explanation: 'The first thing we say when waking up is the waking du\'ā: "Alḥamdulillāhil-ladhī aḥyānā ba\'da mā amātanā wa ilayhin-nushūr" — thanking Allāh for waking us up!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-dua-q5' },
      create: {
        externalId: 'foundation-2-dua-q5',
        unitId: unitDua.id,
        type: 'TRUE_FALSE',
        questionText: '"Innā lillāhi wa innā ilayhi rāji\'ūn" means "We belong to Allāh and to Him we shall return."',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! This is the meaning of "Innā lillāhi wa innā ilayhi rāji\'ūn." We say it when something sad happens to remind ourselves that everything belongs to Allāh.',
        difficulty: 'EASY',
      },
      update: {
        questionText: '"Innā lillāhi wa innā ilayhi rāji\'ūn" means "We belong to Allāh and to Him we shall return."',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! This is the meaning of "Innā lillāhi wa innā ilayhi rāji\'ūn." We say it when something sad happens to remind ourselves that everything belongs to Allāh.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-dua-q6' },
      create: {
        externalId: 'foundation-2-dua-q6',
        unitId: unitDua.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What do we say every time we hear the name of Muḥammad ﷺ?',
        options: JSON.stringify(['Allāhu Akbar', 'Ṣallallāhu \'alayhi wa sallam', 'Alḥamdulillāh', 'SubḥānAllāh']),
        correctAnswer: 'Ṣallallāhu \'alayhi wa sallam',
        explanation: 'Whenever we hear, say, read, or write the name of Muḥammad ﷺ, we say "Ṣallallāhu \'alayhi wa sallam" — May Allāh send blessings and peace upon him.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What do we say every time we hear the name of Muḥammad ﷺ?',
        options: JSON.stringify(['Allāhu Akbar', 'Ṣallallāhu \'alayhi wa sallam', 'Alḥamdulillāh', 'SubḥānAllāh']),
        correctAnswer: 'Ṣallallāhu \'alayhi wa sallam',
        explanation: 'Whenever we hear, say, read, or write the name of Muḥammad ﷺ, we say "Ṣallallāhu \'alayhi wa sallam" — May Allāh send blessings and peace upon him.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-dua-q7' },
      create: {
        externalId: 'foundation-2-dua-q7',
        unitId: unitDua.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the Third Kalimah called?',
        options: JSON.stringify(['Ṭayyibah', 'Shahādah', 'Tamjīd', 'Tasmiyah']),
        correctAnswer: 'Tamjīd',
        explanation: 'The Third Kalimah is called "Tamjīd" which means glorifying Allāh. It combines SubḥānAllāh, Alḥamdulillāh, Lā ilāha illallāh, and Allāhu Akbar!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What is the Third Kalimah called?',
        options: JSON.stringify(['Ṭayyibah', 'Shahādah', 'Tamjīd', 'Tasmiyah']),
        correctAnswer: 'Tamjīd',
        explanation: 'The Third Kalimah is called "Tamjīd" which means glorifying Allāh. It combines SubḥānAllāh, Alḥamdulillāh, Lā ilāha illallāh, and Allāhu Akbar!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-dua-q8' },
      create: {
        externalId: 'foundation-2-dua-q8',
        unitId: unitDua.id,
        type: 'TRUE_FALSE',
        questionText: 'If you forget to say Bismillāh before eating, you can say "Bismillāhi awwalahū wa ākhirah" during the meal.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Rasūlullāh ﷺ taught us that if we forget the du\'ā at the start, we say "Bismillāhi awwalahū wa ākhirah" anytime during the meal. Allāh is Most Forgiving!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'If you forget to say Bismillāh before eating, you can say "Bismillāhi awwalahū wa ākhirah" during the meal.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Rasūlullāh ﷺ taught us that if we forget the du\'ā at the start, we say "Bismillāhi awwalahū wa ākhirah" anytime during the meal. Allāh is Most Forgiving!',
        difficulty: 'EASY',
      },
    }),
  ]);

  console.log('✅ Created quiz questions for Du\'ā unit');

  // --- 99 Names Quizzes ---
  await Promise.all([
    prisma.question.upsert({
      where: { externalId: 'foundation-2-99-names-q1' },
      create: {
        externalId: 'foundation-2-99-names-q1',
        unitId: unitNames.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does "As-Salām" mean?',
        options: JSON.stringify(['The King', 'The Source of Peace', 'The Almighty', 'The Protector']),
        correctAnswer: 'The Source of Peace',
        explanation: 'As-Salām means "The Source of Peace." Allāh is perfect peace itself! The word "Salām" in our greeting also comes from this name.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does "As-Salām" mean?',
        options: JSON.stringify(['The King', 'The Source of Peace', 'The Almighty', 'The Protector']),
        correctAnswer: 'The Source of Peace',
        explanation: 'As-Salām means "The Source of Peace." Allāh is perfect peace itself! The word "Salām" in our greeting also comes from this name.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-99-names-q2' },
      create: {
        externalId: 'foundation-2-99-names-q2',
        unitId: unitNames.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of Allāh\'s names means "The Almighty" — the most powerful?',
        options: JSON.stringify(['As-Salām', 'Al-Mu\'min', 'Al-\'Azīz', 'Al-Jabbār']),
        correctAnswer: 'Al-\'Azīz',
        explanation: 'Al-\'Azīz means "The Almighty" — Allāh is all-powerful! No force in the universe can defeat Him or stop His will.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Which of Allāh\'s names means "The Almighty" — the most powerful?',
        options: JSON.stringify(['As-Salām', 'Al-Mu\'min', 'Al-\'Azīz', 'Al-Jabbār']),
        correctAnswer: 'Al-\'Azīz',
        explanation: 'Al-\'Azīz means "The Almighty" — Allāh is all-powerful! No force in the universe can defeat Him or stop His will.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-99-names-q3' },
      create: {
        externalId: 'foundation-2-99-names-q3',
        unitId: unitNames.id,
        type: 'TRUE_FALSE',
        questionText: 'Al-Muhaymin means Allāh watches over and protects everything.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Al-Muhaymin means "The Protector" — Allāh watches over everything, sees every leaf that falls, and always keeps us safe!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Al-Muhaymin means Allāh watches over and protects everything.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Yes! Al-Muhaymin means "The Protector" — Allāh watches over everything, sees every leaf that falls, and always keeps us safe!',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-99-names-q4' },
      create: {
        externalId: 'foundation-2-99-names-q4',
        unitId: unitNames.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which name of Allāh means He can heal and restore broken hearts?',
        options: JSON.stringify(['Al-Mu\'min', 'As-Salām', 'Al-Jabbār', 'Al-Muhaymin']),
        correctAnswer: 'Al-Jabbār',
        explanation: 'Al-Jabbār comes from a word meaning to mend what is broken. Allāh — Al-Jabbār — can fix anything, including broken hearts! When you are sad, He can heal you.',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'Which name of Allāh means He can heal and restore broken hearts?',
        options: JSON.stringify(['Al-Mu\'min', 'As-Salām', 'Al-Jabbār', 'Al-Muhaymin']),
        correctAnswer: 'Al-Jabbār',
        explanation: 'Al-Jabbār comes from a word meaning to mend what is broken. Allāh — Al-Jabbār — can fix anything, including broken hearts! When you are sad, He can heal you.',
        difficulty: 'EASY',
      },
    }),
    prisma.question.upsert({
      where: { externalId: 'foundation-2-99-names-q5' },
      create: {
        externalId: 'foundation-2-99-names-q5',
        unitId: unitNames.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does "Al-Mu\'min" mean?',
        options: JSON.stringify(['The King', 'The Giver of Security', 'The Most Holy', 'The Almighty']),
        correctAnswer: 'The Giver of Security',
        explanation: 'Al-Mu\'min means "The Giver of Security." Allāh is the one who makes our hearts feel safe and removes our fears. When we are scared, we remember Al-Mu\'min!',
        difficulty: 'EASY',
      },
      update: {
        questionText: 'What does "Al-Mu\'min" mean?',
        options: JSON.stringify(['The King', 'The Giver of Security', 'The Most Holy', 'The Almighty']),
        correctAnswer: 'The Giver of Security',
        explanation: 'Al-Mu\'min means "The Giver of Security." Allāh is the one who makes our hearts feel safe and removes our fears. When we are scared, we remember Al-Mu\'min!',
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

  // --- Qur'ān Flashcards ---
  const quranFlashcards = [
    {
      front: 'What are the three "Qul" sūrahs?',
      back: 'Sūrah Al-Ikhlāṣ, Sūrah Al-Falaq, and Sūrah An-Nās — they all begin with "Qul" (Say!) and are known as protection sūrahs.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['qur\'ān', 'qul-surahs', 'protection'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What does Sūrah Al-Ikhlāṣ teach us?',
      back: 'That Allāh is ONE (Aḥad), He is Self-Sufficient (Ṣamad), He was not born and has no children, and nothing is equal to Him!',
      frontArabic: null,
      backArabic: 'قُلْ هُوَ اللّٰهُ أَحَدٌ',
      category: 'rule',
      tags: ['qur\'ān', 'al-ikhlas', 'tawheed'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What does Sūrah Al-Falaq protect us from?',
      back: 'The evil of the night, magic, and jealousy. "Al-Falaq" means the daybreak — Allāh is the Lord of light that drives away darkness!',
      frontArabic: null,
      backArabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      category: 'rule',
      tags: ['qur\'ān', 'al-falaq', 'protection'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What does Sūrah An-Nās protect us from?',
      back: 'The whisperings of Shayṭān who tries to put bad thoughts into our hearts. We ask Allāh — the Lord of Mankind — for protection!',
      frontArabic: null,
      backArabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      category: 'rule',
      tags: ['qur\'ān', 'an-nas', 'shaytan', 'protection'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'When should you recite the three Qul sūrahs?',
      back: 'Every morning and evening, and before sleeping. Blow into your hands and wipe over your body three times — it is the Sunnah of Rasūlullāh ﷺ!',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['qur\'ān', 'qul-surahs', 'sunnah', 'morning-evening'],
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
      front: 'What is the Second Kalimah (Shahādah)?',
      back: 'Ashhadu al-lā ilāha illallāhu waḥdahū lā sharīka lahū wa ashhadu anna muḥammadan \'abduhū wa rasūluh — "I bear witness there is no god except Allāh, alone, with no partner, and Muḥammad ﷺ is His servant and messenger."',
      frontArabic: null,
      backArabic: 'أَشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      category: 'rule',
      tags: ['du\'ā', 'kalimah', 'shahādah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What is the Third Kalimah (Tamjīd)?',
      back: 'SubḥānAllāhi walḥamdulillāhi wa lā ilāha illallāhu wallāhu akbar — Glory be to Allāh, all praise is for Allāh, there is no god except Allāh, and Allāh is the Greatest.',
      frontArabic: null,
      backArabic: 'سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ',
      category: 'rule',
      tags: ['du\'ā', 'kalimah', 'tamjid'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do you say after finishing a meal?',
      back: 'Alḥamdulillāhil-ladhī aṭ\'amanā wa saqānā wa ja\'alanā muslimīn — "All praise to Allāh who fed us, gave us drink, and made us Muslims!"',
      frontArabic: null,
      backArabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      category: 'rule',
      tags: ['du\'ā', 'after-eating'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do we say when waking up?',
      back: 'Alḥamdulillāhil-ladhī aḥyānā ba\'da mā amātanā wa ilayhin-nushūr — "All praise to Allāh who gave us life after causing us to die, and to Him is the return."',
      frontArabic: null,
      backArabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      category: 'rule',
      tags: ['du\'ā', 'waking-up'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What is the du\'ā for entering the washroom?',
      back: 'Allāhumma innī a\'ūdhu bika minal-khubuthi wal-khabā\'ith — "O Allāh, I seek Your protection from evil and evil beings." (Enter with the LEFT foot!)',
      frontArabic: null,
      backArabic: 'اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
      category: 'rule',
      tags: ['du\'ā', 'washroom', 'entering'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do you say when you lose something?',
      back: 'Innā lillāhi wa innā ilayhi rāji\'ūn — "Indeed, we belong to Allāh, and indeed to Him we shall return." It reminds us everything belongs to Allāh.',
      frontArabic: null,
      backArabic: 'إِنَّا لِلّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
      category: 'rule',
      tags: ['du\'ā', 'inna-lillah', 'loss'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do you say when someone sneezes?',
      back: 'Yarḥamukallāh — "May Allāh have mercy on you." And the sneezing person replies: "Yahdīkumullāhu wa yuṣliḥu bālakum."',
      frontArabic: null,
      backArabic: 'يَرْحَمُكَ اللّٰهُ',
      category: 'rule',
      tags: ['du\'ā', 'sneezing'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do you say when feeling scared?',
      back: 'Lā ilāha illallāh — "There is no god except Allāh." This reminds us that Allāh is always with us and protects us!',
      frontArabic: null,
      backArabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
      category: 'rule',
      tags: ['du\'ā', 'fear', 'protection'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do we say when drinking milk?',
      back: 'Allāhumma bārik lanā fīhi wa zidnā minh — "O Allāh, bless us in it and give us more of it." There is a special du\'ā just for milk!',
      frontArabic: null,
      backArabic: 'اَللّٰهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ',
      category: 'rule',
      tags: ['du\'ā', 'milk', 'drinking'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'What do we say when we hear the name of Prophet Muḥammad ﷺ?',
      back: 'Ṣallallāhu \'alayhi wa sallam — "May Allāh send blessings and peace upon him." We say it every single time we hear his blessed name!',
      frontArabic: null,
      backArabic: 'صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ',
      category: 'rule',
      tags: ['du\'ā', 'salawat', 'prophet'],
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
      front: 'السَّلَامُ — As-Salām',
      back: 'The Source of Peace — Allāh is perfect peace itself. In Jannah we will live in complete peace because of As-Salām!',
      frontArabic: 'السَّلَامُ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['99-names', 'name-6', 'as-salam'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'الْمُؤْمِنُ — Al-Mu\'min',
      back: 'The Giver of Security — Allāh makes our hearts feel safe and secure and removes our fears!',
      frontArabic: 'الْمُؤْمِنُ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['99-names', 'name-7', 'al-mumin'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'الْمُهَيْمِنُ — Al-Muhaymin',
      back: 'The Protector — Allāh watches over everything. Even when you sleep, Al-Muhaymin is always watching over and guarding you!',
      frontArabic: 'الْمُهَيْمِنُ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['99-names', 'name-8', 'al-muhaymin'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'الْعَزِيزُ — Al-\'Azīz',
      back: 'The Almighty — Allāh is all-powerful! No army or force in the entire universe can defeat Him or stop His will.',
      frontArabic: 'الْعَزِيزُ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['99-names', 'name-9', 'al-aziz'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'الْجَبَّارُ — Al-Jabbār',
      back: 'The Compeller — Allāh repairs what is broken. When you are sad or hurt, Al-Jabbār can heal your heart and make everything better!',
      frontArabic: 'الْجَبَّارُ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['99-names', 'name-10', 'al-jabbar'],
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
  console.log('✅ Maktab Foundation 2 seed complete!');
  console.log('');
}
