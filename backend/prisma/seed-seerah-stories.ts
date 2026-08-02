/**
 * Stories from Seerah Course Seed
 * 10 authentic hadith stories from Sahih Bukhari and Sahih Muslim
 * Each lesson: bilingual hadith text → context → discussion questions → lessons summary
 * Sources: Bukhari 3, 3905, 6025, 1356, 7507, 1149, 4280, 1301, 5997; Muslim 923a
 *
 * Can be run independently with: npx ts-node prisma/seed-seerah-stories.ts
 */

import { PrismaClient, FlashCardDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

const COURSE_TITLE = 'Stories from Seerah — Lessons from the Prophet ﷺ';

export async function seedSeerahStoriesCourse() {
  console.log('📚 Starting Stories from Seerah course seed...');
  console.log('');

  // Idempotent: find existing → delete (cascade) → recreate
  const existing = await prisma.course.findFirst({ where: { title: COURSE_TITLE } });
  if (existing) {
    console.log('   ⚠️  Course already exists — deleting for re-seed...');
    await prisma.course.delete({ where: { id: existing.id } });
    console.log('   ✅ Deleted old version');
  }

  const course = await prisma.course.create({
    data: {
      title: COURSE_TITLE,
      description:
        'Authentic, moving stories from the life of Prophet Muhammad ﷺ drawn directly from Sahih Bukhari and Sahih Muslim. Each lesson presents the original Arabic and English text, discussion questions for family reflection, and key lessons to remember. Approximately 20 minutes per lesson.',
      category: 'SEERAH',
      ageLevels: ['CHILD', 'PRE_TEEN', 'TEEN', 'ADULT'],
      thumbnailUrl: '/images/courses/seerah-stories.jpg',
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);
  console.log('');

  // ============================================================
  // STORY 1 — The First Revelation
  // ============================================================
  const unit1 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Lesson 1: The First Revelation — The Night the World Changed',
      description: 'The first revelation in the Cave of Hira and how Khadija (RA) stood by the Prophet ﷺ',
      orderIndex: 0,
      content: `<h2>The First Revelation — The Night the World Changed</h2>
<div class="hadith-reference">
  <p><strong>Source:</strong> Sahih al-Bukhari, Hadith 3</p>
  <p><strong>Grade:</strong> Sahih</p>
  <p><strong>Reference:</strong> <a href="https://sunnah.com/bukhari:3" target="_blank">https://sunnah.com/bukhari:3</a></p>
</div>
<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">حَدَّثَنَا يَحْيَى بْنُ بُكَيْرٍ، قَالَ حَدَّثَنَا اللَّيْثُ، عَنْ عُقَيْلٍ، عَنِ ابْنِ شِهَابٍ، عَنْ عُرْوَةَ بْنِ الزُّبَيْرِ، عَنْ عَائِشَةَ أُمِّ الْمُؤْمِنِينَ، أَنَّهَا قَالَتْ أَوَّلُ مَا بُدِئَ بِهِ رَسُولُ اللَّهِ صلى الله عليه وسلم مِنَ الْوَحْىِ الرُّؤْيَا الصَّالِحَةُ فِي النَّوْمِ، فَكَانَ لاَ يَرَى رُؤْيَا إِلاَّ جَاءَتْ مِثْلَ فَلَقِ الصُّبْحِ، ثُمَّ حُبِّبَ إِلَيْهِ الْخَلاَءُ، وَكَانَ يَخْلُو بِغَارِ حِرَاءٍ فَيَتَحَنَّثُ فِيهِ ـ وَهُوَ التَّعَبُّدُ ـ اللَّيَالِيَ ذَوَاتِ الْعَدَدِ قَبْلَ أَنْ يَنْزِعَ إِلَى أَهْلِهِ، وَيَتَزَوَّدُ لِذَلِكَ، ثُمَّ يَرْجِعُ إِلَى خَدِيجَةَ، فَيَتَزَوَّدُ لِمِثْلِهَا، حَتَّى جَاءَهُ الْحَقُّ وَهُوَ فِي غَارِ حِرَاءٍ، فَجَاءَهُ الْمَلَكُ فَقَالَ اقْرَأْ‏.‏ قَالَ مَا أَنَا بِقَارِئٍ‏.‏ فَأَخَذَنِي فَغَطَّنِي حَتَّى بَلَغَ مِنِّي الْجَهْدَ، ثُمَّ أَرْسَلَنِي، ثُمَّ قَالَ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</div>
  <div class="english-translation"><p>Narrated Aisha: The commencement of the Divine Inspiration to Allah's Messenger (ﷺ) was in the form of good dreams which came true like bright daylight, and then the love of seclusion was bestowed upon him. He used to go in seclusion in the cave of Hira where he used to worship (Allah alone) continuously for many days before his desire to see his family. He used to take with him the journey food for the stay and then come back to (his wife) Khadija to take his food likewise again till suddenly the Truth descended upon him while he was in the cave of Hira. The angel came to him and asked him to read. The Prophet (ﷺ) replied, "I do not know how to read." The angel caught him (forcefully) and pressed him so hard that he could not bear it, then released him and again asked him to read. He pressed him a second time till he could not bear it. Then released him and said, "Read in the name of your Lord, who has created (all that exists), created man from a clot. Read! And your Lord is the Most Generous." Then Allah's Messenger (ﷺ) returned with his heart beating severely and said to Khadija, "Cover me! Cover me!" They covered him till his fear was over. Then he told her everything and said, "I fear that something may happen to me." Khadija replied, "Never! By Allah, Allah will never disgrace you. You keep good relations with your kith and kin, help the poor and the destitute, serve your guests generously and assist the deserving calamity-afflicted ones."</p></div>
</div>
<div class="story-context"><h3>Context</h3><p>The first revelation in the Cave of Hira, approximately 610 CE, when Muhammad ﷺ was 40 years old. The first words were the opening verses of Surah Al-Alaq (96:1-3). Khadija (RA) was the very first person to comfort the Prophet ﷺ, affirming his character before anything else.</p></div>
<div class="discussion-questions">
  <h3>💬 Family Discussion Questions</h3>
  <ol>
    <li><strong>(Ages 6–12)</strong> Why do you think the Prophet ﷺ was so frightened when the angel came? What would you have done if something very unexpected happened to you?</li>
    <li><strong>(Teens)</strong> Khadija didn't say "don't worry" — she listed all the GOOD things he had done as proof Allah would protect him. What does that teach us about character?</li>
    <li><strong>(Whole family)</strong> What kind of husband/wife does this story show the Prophet ﷺ and Khadija were to each other?</li>
    <li><strong>(Applying today)</strong> When someone in your family is scared or overwhelmed, how can YOU be like Khadija — reminding them of their goodness?</li>
    <li><strong>(Adults)</strong> Waraqa ibn Nawfal, a Christian scholar, recognized the revelation as coming from the same angel who came to Moses. What does this tell us about the unity of divine truth?</li>
  </ol>
</div>
<div class="lessons-summary">
  <h3>⭐ Lessons to Remember</h3>
  <ul>
    <li>The first word of revelation was Iqra — Read! Islam began with the command to seek knowledge.</li>
    <li>A great spouse stands by you in your darkest moments, reminding you of who you are.</li>
    <li>Allah chose a man of character to be His final messenger — the Prophet's goodness preceded his prophethood.</li>
    <li>Every dream of the Prophet ﷺ came true like bright daylight — his connection with the divine was total.</li>
  </ul>
</div>`,
    },
  });

  await prisma.arabicTerm.create({ data: { arabicText: 'وَحْي', transliteration: 'Wahy', translation: 'Divine Revelation', unitId: unit1.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'اقْرَأْ', transliteration: "Iqra'", translation: 'Read! / Recite!', unitId: unit1.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'غَارُ حِرَاء', transliteration: "Ghar Hira'", translation: 'Cave of Hira — place of the first revelation', unitId: unit1.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'خَدِيجَة', transliteration: 'Khadijah', translation: "Khadijah bint Khuwaylid — the Prophet's first wife and first believer", unitId: unit1.id } });

  const fc1Data = [
    { front: 'Wahy', frontArabic: 'وَحْي', back: 'Divine Revelation', tags: ['seerah', 'aqidah'] },
    { front: "Iqra'", frontArabic: 'اقْرَأْ', back: 'Read!', tags: ['seerah', 'quran'] },
    { front: "Ghar Hira'", frontArabic: 'غَارُ حِرَاء', back: 'Cave of Hira', tags: ['seerah'] },
    { front: 'Nubuwwah', frontArabic: 'نُبُوَّة', back: 'Prophethood', tags: ['seerah', 'aqidah'] },
  ];
  for (let i = 0; i < fc1Data.length; i++) {
    const fc = fc1Data[i];
    await prisma.flashCard.create({ data: { front: fc.front, frontArabic: fc.frontArabic, back: fc.back, backArabic: fc.frontArabic, courseId: course.id, category: 'vocabulary', tags: fc.tags, difficulty: FlashCardDifficulty.MEDIUM, orderIndex: i, unitId: unit1.id } });
  }

  await prisma.question.create({ data: { unitId: unit1.id, type: 'MULTIPLE_CHOICE', questionText: 'What were the first words of the Quran revealed to the Prophet ﷺ?', options: JSON.stringify(['Bismillah ir-Rahman ir-Rahim', "Iqra bismi Rabbika alladhi khalaq — Read in the name of your Lord who created", 'Alif Lam Mim', 'Qul Huwa Allahu Ahad']), correctAnswer: "Iqra bismi Rabbika alladhi khalaq — Read in the name of your Lord who created", explanation: 'The first revelation came in the Cave of Hira when the angel Jibreel pressed the Prophet three times and commanded Iqra bismi Rabbika — the opening verses of Surah Al-Alaq (96:1-3).', difficulty: 'EASY' } });

  console.log('   ✅ Unit 1 — The First Revelation');

  // ============================================================
  // STORY 2 — The Night They Fled: Abu Bakr and the Cave of Thaur
  // ============================================================
  const unit2 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Lesson 2: The Night They Fled — Abu Bakr and the Cave of Thaur',
      description: 'The Hijrah of 622 CE — three nights hidden in the Cave of Thaur',
      orderIndex: 1,
      content: `<h2>The Night They Fled: Abu Bakr and the Cave of Thaur</h2>
<div class="hadith-reference">
  <p><strong>Source:</strong> Sahih al-Bukhari, Hadith 3905</p>
  <p><strong>Grade:</strong> Sahih</p>
  <p><strong>Reference:</strong> <a href="https://sunnah.com/bukhari:3905" target="_blank">https://sunnah.com/bukhari:3905</a></p>
</div>
<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">حَدَّثَنَا يَحْيَى بْنُ بُكَيْرٍ، حَدَّثَنَا اللَّيْثُ، عَنْ عُقَيْلٍ، قَالَ ابْنُ شِهَابٍ فَأَخْبَرَنِي عُرْوَةُ بْنُ الزُّبَيْرِ، أَنَّ عَائِشَةَ ـ رضى الله عنها ـ زَوْجَ النَّبِيِّ صلى الله عليه وسلم قَالَتْ لَمْ أَعْقِلْ أَبَوَىَّ قَطُّ إِلاَّ وَهُمَا يَدِينَانِ الدِّينَ ... ثُمَّ لَحِقَ رَسُولُ اللَّهِ صلى الله عليه وسلم وَأَبُو بَكْرٍ بِغَارٍ فِي جَبَلِ ثَوْرٍ فَكَمَنَا فِيهِ ثَلاَثَ لَيَالٍ، يَبِيتُ عِنْدَهُمَا عَبْدُ اللَّهِ بْنُ أَبِي بَكْرٍ وَهْوَ غُلاَمٌ شَابٌّ ثَقِفٌ لَقِنٌ، فَيُدْلِجُ مِنْ عِنْدِهِمَا بِسَحَرٍ، فَيُصْبِحُ مَعَ قُرَيْشٍ بِمَكَّةَ كَبَائِتٍ، فَلاَ يَسْمَعُ أَمْرًا يُكْتَادَانِ بِهِ إِلاَّ وَعَاهُ، حَتَّى يَأْتِيَهُمَا بِخَبَرِ ذَلِكَ حِينَ يَخْتَلِطُ الظَّلاَمُ</div>
  <div class="english-translation"><p>Narrated Aisha (RA): I never remembered my parents except that they were following the religion of Islam. The Prophet (ﷺ) and Abu Bakr reached a cave on the mountain of Thaur and stayed there for three nights. Abdullah bin Abi Bakr — an intelligent and sagacious youth — used to stay with them every night. He would leave before daybreak so that in the morning he would be with Quraysh in Makkah as if he had spent the night there. He kept in mind every plot made against them and when it became dark he would go and inform them of it. Amir bin Fuhaira, the freed slave of Abu Bakr, used to bring the milch sheep to them a little while after nightfall so they always had fresh milk at night. Allah's Messenger (ﷺ) and Abu Bakr had hired a man from Bani Ad-Dail as an expert guide — he was on the religion of the Quraysh — but the Prophet (ﷺ) and Abu Bakr trusted him and gave him their two she-camels and took his promise to bring them to the cave of Thaur after three nights.</p></div>
</div>
<div class="story-context"><h3>Context</h3><p>The Hijrah of 622 CE — the migration of the Prophet ﷺ and Abu Bakr from Makkah to Madinah. They hid for three days in the Cave of Thaur while Quraysh offered a bounty of 100 camels for the Prophet. The Quran refers to this moment in Surah at-Tawbah (9:40): "When they were in the cave and he said to his companion: Do not grieve, indeed Allah is with us."</p></div>
<div class="discussion-questions">
  <h3>💬 Family Discussion Questions</h3>
  <ol>
    <li><strong>(Ages 6–12)</strong> Abu Bakr's son Abdullah went out every morning pretending to be normal in Makkah while secretly spying for the Prophet and Abu Bakr. How brave do you think that was?</li>
    <li><strong>(Teens)</strong> When the Prophet arrived at Abu Bakr's house in the middle of the day, Abu Bakr immediately said "He has not come at this hour except for a great necessity." What does this tell us about how deeply Abu Bakr knew and loved the Prophet ﷺ?</li>
    <li><strong>(Whole family)</strong> Abu Bakr had been keeping two camels ready for four months, just waiting for the moment the Prophet would get permission to migrate. What does this teach us about loyalty and preparation?</li>
    <li><strong>(Applying today)</strong> The whole Abu Bakr family helped — his son as spy, his daughter Asma bringing food, Amir the freed slave with sheep. How can YOUR family team up for something important together?</li>
    <li><strong>(Adults)</strong> Even the guide they hired was not a Muslim — the Prophet extended trust to a non-believer when strategically wise. What does this tell us about the Prophet's wisdom?</li>
  </ol>
</div>
<div class="lessons-summary">
  <h3>⭐ Lessons to Remember</h3>
  <ul>
    <li>True friendship means being ready to sacrifice everything — Abu Bakr called it his greatest honor.</li>
    <li>The whole Abu Bakr household participated in protecting the Messenger of Allah.</li>
    <li>Four months of preparation for three days of hiding: great deeds require patient, quiet preparation.</li>
    <li>This migration marks the beginning of the Islamic calendar — one of the most consequential journeys in human history.</li>
  </ul>
</div>`,
    },
  });

  await prisma.arabicTerm.create({ data: { arabicText: 'هِجْرَة', transliteration: 'Hijrah', translation: "Migration — the Prophet's migration from Makkah to Madinah in 622 CE", unitId: unit2.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'الصَّاحِب', transliteration: 'As-Sahib', translation: 'The Companion — referring to Abu Bakr in the cave', unitId: unit2.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'غَارُ ثَوْر', transliteration: 'Ghar Thawr', translation: 'Cave of Thawr — where the Prophet and Abu Bakr hid', unitId: unit2.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'لَا تَحْزَنْ', transliteration: 'La tahzan', translation: 'Do not grieve — Quran 9:40', unitId: unit2.id } });

  const fc2Data = [
    { front: 'Hijrah', frontArabic: 'هِجْرَة', back: 'Migration — the Hijrah of 622 CE', tags: ['seerah', 'history'] },
    { front: 'As-Siddiq', frontArabic: 'الصِّدِّيق', back: "The Truthful One — Abu Bakr's title", tags: ['seerah', 'companions'] },
    { front: 'Ghar Thawr', frontArabic: 'غَارُ ثَوْر', back: 'Cave of Thawr', tags: ['seerah'] },
    { front: 'La tahzan', frontArabic: 'لَا تَحْزَنْ', back: 'Do not grieve — Quran 9:40', tags: ['seerah', 'quran'] },
  ];
  for (let i = 0; i < fc2Data.length; i++) {
    const fc = fc2Data[i];
    await prisma.flashCard.create({ data: { front: fc.front, frontArabic: fc.frontArabic, back: fc.back, backArabic: fc.frontArabic, courseId: course.id, category: 'vocabulary', tags: fc.tags, difficulty: FlashCardDifficulty.MEDIUM, orderIndex: i, unitId: unit2.id } });
  }

  await prisma.question.create({ data: { unitId: unit2.id, type: 'MULTIPLE_CHOICE', questionText: 'How many nights did the Prophet ﷺ and Abu Bakr hide in the Cave of Thawr during the Hijrah?', options: JSON.stringify(['One night', 'Three nights', 'Seven nights', 'Ten nights']), correctAnswer: 'Three nights', explanation: 'The Prophet ﷺ and Abu Bakr stayed in the Cave of Thawr for three nights. During this time, Abdullah ibn Abi Bakr secretly brought them news from Makkah, and Amir ibn Fuhaira brought fresh milk each night.', difficulty: 'EASY' } });

  console.log('   ✅ Unit 2 — The Night They Fled');

  // ============================================================
  // STORY 3 — The Bedouin Who Urinated in the Mosque
  // ============================================================
  const unit3 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Lesson 3: The Bedouin Who Urinated in the Mosque',
      description: "A masterclass in mercy and de-escalation from the Prophet ﷺ's example",
      orderIndex: 2,
      content: `<h2>The Bedouin Who Urinated in the Mosque</h2>
<div class="hadith-reference">
  <p><strong>Source:</strong> Sahih al-Bukhari, Hadith 6025 (Chapter: "To be kind and lenient in all matters")</p>
  <p><strong>Grade:</strong> Sahih</p>
  <p><strong>Reference:</strong> <a href="https://sunnah.com/bukhari:6025" target="_blank">https://sunnah.com/bukhari:6025</a></p>
</div>
<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">حَدَّثَنَا عَبْدُ اللَّهِ بْنُ عَبْدِ الْوَهَّابِ، حَدَّثَنَا حَمَّادُ بْنُ زَيْدٍ، عَنْ ثَابِتٍ، عَنْ أَنَسِ بْنِ مَالِكٍ، أَنَّ أَعْرَابِيًّا، بَالَ فِي الْمَسْجِدِ، فَقَامُوا إِلَيْهِ، فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ لا تُزْرِمُوهُ ‏"‏‏.‏ ثُمَّ دَعَا بِدَلْوٍ مِنْ مَاءٍ فَصُبَّ عَلَيْهِ‏.‏</div>
  <div class="english-translation"><p>Narrated Anas bin Malik: A bedouin urinated in the mosque and the people ran to (beat) him. Allah's Messenger (ﷺ) said, "Do not interrupt his urination (i.e. let him finish)." Then the Prophet (ﷺ) asked for a tumbler of water and poured the water over the place of urine.</p></div>
</div>
<div class="story-context"><h3>Context</h3><p>The mosque in Madinah was a central community gathering place. A Bedouin man — unfamiliar with mosque etiquette — committed what the companions saw as a grave insult. The Prophet's immediate reaction was to protect the man from harm, then solve the problem quietly. In other narrations (Bukhari 220), he then gently called the Bedouin over and explained the sanctity of the mosque with kindness.</p></div>
<div class="discussion-questions">
  <h3>💬 Family Discussion Questions</h3>
  <ol>
    <li><strong>(Ages 6–12)</strong> The companions ran toward the Bedouin to beat him. But the Prophet ﷺ said "leave him." Why do you think the Prophet didn't get angry?</li>
    <li><strong>(Teens)</strong> "Don't interrupt his urination" — the Prophet ﷺ was thinking about the man's dignity even in that embarrassing moment. Can you think of a time when someone could have embarrassed you but instead showed you mercy?</li>
    <li><strong>(Whole family)</strong> Which is better: screaming at someone who makes a mistake, or calmly fixing the mistake? How can our family adopt the Prophet's approach?</li>
    <li><strong>(Applying today)</strong> At school or work, when someone does something thoughtless or ignorant, do we shout at them or explain gently? What would the Prophet ﷺ do?</li>
    <li><strong>(Adults)</strong> The Prophet's wisdom: protect the man's dignity, let him finish, then clean up. This is a masterclass in crisis de-escalation. Where in your professional or community life could you apply this?</li>
  </ol>
</div>
<div class="lessons-summary">
  <h3>⭐ Lessons to Remember</h3>
  <ul>
    <li>Gentleness is not weakness — it takes great self-control to say "leave him" when others are rushing to react.</li>
    <li>The Prophet fixed the problem practically without drama.</li>
    <li>The Prophet's mercy extended to ignorant strangers, not just beloved companions.</li>
    <li>Embarrassing someone for ignorance doesn't educate them; patient explanation does.</li>
  </ul>
</div>`,
    },
  });

  await prisma.arabicTerm.create({ data: { arabicText: 'رَحْمَة', transliteration: 'Rahmah', translation: 'Mercy / Compassion', unitId: unit3.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'رِفْق', transliteration: 'Rifq', translation: 'Gentleness — a prophetic quality', unitId: unit3.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'حِلْم', transliteration: 'Hilm', translation: 'Forbearance / Self-restraint', unitId: unit3.id } });

  const fc3Data = [
    { front: 'Rahmah', frontArabic: 'رَحْمَة', back: 'Mercy', tags: ['seerah', 'character'] },
    { front: 'Rifq', frontArabic: 'رِفْق', back: 'Gentleness', tags: ['seerah', 'character', 'akhlaq'] },
    { front: 'Hilm', frontArabic: 'حِلْم', back: 'Forbearance', tags: ['seerah', 'akhlaq'] },
  ];
  for (let i = 0; i < fc3Data.length; i++) {
    const fc = fc3Data[i];
    await prisma.flashCard.create({ data: { front: fc.front, frontArabic: fc.frontArabic, back: fc.back, backArabic: fc.frontArabic, courseId: course.id, category: 'vocabulary', tags: fc.tags, difficulty: FlashCardDifficulty.MEDIUM, orderIndex: i, unitId: unit3.id } });
  }

  await prisma.question.create({ data: { unitId: unit3.id, type: 'MULTIPLE_CHOICE', questionText: 'When a Bedouin urinated in the mosque, what did the Prophet ﷺ tell the companions?', options: JSON.stringify(['Expel him from the mosque immediately', 'Leave him and let him finish, then pour water over it', 'Punish him as an example', 'Make him clean the mosque himself']), correctAnswer: 'Leave him and let him finish, then pour water over it', explanation: "The Prophet ﷺ said \"Do not interrupt his urination\" — protecting the man's dignity — and then simply asked for water to be poured over the area.", difficulty: 'EASY' } });

  console.log('   ✅ Unit 3 — The Bedouin Who Urinated in the Mosque');

  // ============================================================
  // STORY 4 — The Prophet Visits the Sick Jewish Boy
  // ============================================================
  const unit4 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Lesson 4: The Prophet Visits the Sick Jewish Boy',
      description: 'How the Prophet ﷺ visited his sick Jewish servant and the boy accepted Islam',
      orderIndex: 3,
      content: `<h2>The Prophet Visits the Sick Jewish Boy</h2>
<div class="hadith-reference">
  <p><strong>Source:</strong> Sahih al-Bukhari, Hadith 1356</p>
  <p><strong>Grade:</strong> Sahih</p>
  <p><strong>Reference:</strong> <a href="https://sunnah.com/bukhari:1356" target="_blank">https://sunnah.com/bukhari:1356</a></p>
</div>
<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">حَدَّثَنَا سُلَيْمَانُ بْنُ حَرْبٍ، حَدَّثَنَا حَمَّادٌ ـ وَهْوَ ابْنُ زَيْدٍ ـ عَنْ ثَابِتٍ، عَنْ أَنَسٍ ـ رضى الله عنه ـ قَالَ كَانَ غُلاَمٌ يَهُودِيٌّ يَخْدُمُ النَّبِيَّ صلى الله عليه وسلم فَمَرِضَ، فَأَتَاهُ النَّبِيُّ صلى الله عليه وسلم يَعُودُهُ، فَقَعَدَ عِنْدَ رَأْسِهِ فَقَالَ لَهُ ‏"‏ أَسْلِمْ ‏"‏‏.‏ فَنَظَرَ إِلَى أَبِيهِ وَهْوَ عِنْدَهُ فَقَالَ لَهُ أَطِعْ أَبَا الْقَاسِمِ صلى الله عليه وسلم‏.‏ فَأَسْلَمَ، فَخَرَجَ النَّبِيُّ صلى الله عليه وسلم وَهْوَ يَقُولُ ‏"‏ الْحَمْدُ لِلَّهِ الَّذِي أَنْقَذَهُ مِنَ النَّارِ ‏"‏‏.‏</div>
  <div class="english-translation"><p>Narrated Anas: A young Jewish boy used to serve the Prophet (ﷺ) and he became sick. So the Prophet (ﷺ) went to visit him. He sat near his head and asked him to embrace Islam. The boy looked at his father, who was sitting there; the latter told him to obey Abul-Qasim (i.e. the Prophet ﷺ) and the boy embraced Islam. The Prophet (ﷺ) came out saying: "Praises be to Allah Who saved the boy from the Hell-fire."</p></div>
</div>
<div class="story-context"><h3>Context</h3><p>This hadith takes place in Madinah where the Prophet ﷺ had Jewish neighbors and allies. This young boy served the Prophet in his household — not a Muslim, yet the Prophet formed a real human bond with him. When the boy fell seriously ill, the Prophet went immediately and sat at the boy's bedside.</p></div>
<div class="discussion-questions">
  <h3>💬 Family Discussion Questions</h3>
  <ol>
    <li><strong>(Ages 6–12)</strong> The Prophet ﷺ visited a boy who was not even Muslim — he was Jewish. What does this tell us about who we should be kind to?</li>
    <li><strong>(Teens)</strong> Imagine you are the Jewish boy — the most important man in Madinah comes to visit YOU when you are sick. How would that make you feel? What does it say about the Prophet's character?</li>
    <li><strong>(Whole family)</strong> The boy looked at his FATHER before deciding. The father said "Obey Abu al-Qasim." What does this tell us about the respect even non-Muslim people had for the Prophet ﷺ?</li>
    <li><strong>(Applying today)</strong> Do we visit our neighbors when they are sick, regardless of their religion? How can we be more like the Prophet in our neighborhoods?</li>
    <li><strong>(Adults)</strong> The Prophet came out praising Allah for saving the boy — he genuinely cared about this child's eternal soul. How does this reshape our understanding of Islamic da'wah?</li>
  </ol>
</div>
<div class="lessons-summary">
  <h3>⭐ Lessons to Remember</h3>
  <ul>
    <li>Islam does not restrict kindness to Muslims — the Prophet showed mercy to all people.</li>
    <li>Visiting the sick (iyada al-marid) is a right of every neighbor, regardless of faith.</li>
    <li>Sometimes a single act of genuine care can change a person's heart and life.</li>
    <li>The Prophet's joy at the boy's Islam was pure and sincere — he truly loved guidance for all of humanity.</li>
  </ul>
</div>`,
    },
  });

  await prisma.arabicTerm.create({ data: { arabicText: 'عِيَادَة', transliteration: 'Iyada', translation: 'Visiting the sick — a Sunnah of the Prophet ﷺ', unitId: unit4.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', translation: 'Praise be to Allah', unitId: unit4.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'دَعْوَة', transliteration: "Da'wah", translation: 'Invitation to Islam', unitId: unit4.id } });

  const fc4Data = [
    { front: 'Iyada', frontArabic: 'عِيَادَة', back: 'Visiting the sick — a Sunnah', tags: ['seerah', 'akhlaq', 'fiqh'] },
    { front: 'Abul-Qasim', frontArabic: 'أَبُو الْقَاسِم', back: "Father of Qasim — one of the Prophet's names", tags: ['seerah'] },
    { front: "Da'wah", frontArabic: 'دَعْوَة', back: 'Invitation to Islam', tags: ['seerah', 'aqidah'] },
  ];
  for (let i = 0; i < fc4Data.length; i++) {
    const fc = fc4Data[i];
    await prisma.flashCard.create({ data: { front: fc.front, frontArabic: fc.frontArabic, back: fc.back, backArabic: fc.frontArabic, courseId: course.id, category: 'vocabulary', tags: fc.tags, difficulty: FlashCardDifficulty.MEDIUM, orderIndex: i, unitId: unit4.id } });
  }

  await prisma.question.create({ data: { unitId: unit4.id, type: 'MULTIPLE_CHOICE', questionText: 'When the Prophet ﷺ visited his sick Jewish servant boy and the boy accepted Islam, what did the Prophet say as he left?', options: JSON.stringify(['Alhamdulillah, another Muslim joined us', 'Praises be to Allah Who saved the boy from the Hell-fire', 'May Allah bless you with health', 'SubhanAllah for this blessing']), correctAnswer: 'Praises be to Allah Who saved the boy from the Hell-fire', explanation: "The Prophet ﷺ said \"Alhamdulillahi alladhi anqadhahu min al-nar.\" This shows his genuine love and care for the boy's eternal wellbeing, not just his worldly health.", difficulty: 'MEDIUM' } });

  console.log('   ✅ Unit 4 — The Prophet Visits the Sick Jewish Boy');

  // ============================================================
  // STORY 5 — The Man Who Kept Sinning and Allah Kept Forgiving
  // ============================================================
  const unit5 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Lesson 5: The Man Who Kept Sinning and Allah Kept Forgiving',
      description: "One of the most hope-giving hadiths in all of Islam — Allah's boundless mercy",
      orderIndex: 4,
      content: `<h2>The Man Who Kept Sinning and Allah Kept Forgiving</h2>
<div class="hadith-reference">
  <p><strong>Source:</strong> Sahih al-Bukhari, Hadith 7507</p>
  <p><strong>Grade:</strong> Sahih</p>
  <p><strong>Reference:</strong> <a href="https://sunnah.com/bukhari:7507" target="_blank">https://sunnah.com/bukhari:7507</a></p>
</div>
<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">حَدَّثَنَا أَحْمَدُ بْنُ إِسْحَاقَ، حَدَّثَنَا عَمْرُو بْنُ عَاصِمٍ، حَدَّثَنَا هَمَّامٌ، حَدَّثَنَا إِسْحَاقُ بْنُ عَبْدِ اللَّهِ، سَمِعْتُ عَبْدَ الرَّحْمَنِ بْنَ أَبِي عَمْرَةَ، قَالَ سَمِعْتُ أَبَا هُرَيْرَةَ، قَالَ سَمِعْتُ النَّبِيَّ صلى الله عليه وسلم قَالَ إِنَّ عَبْدًا أَصَابَ ذَنْبًا فَقَالَ رَبِّ أَذْنَبْتُ فَاغْفِرْ لِي فَقَالَ رَبُّهُ أَعَلِمَ عَبْدِي أَنَّ لَهُ رَبًّا يَغْفِرُ الذَّنْبَ وَيَأْخُذُ بِهِ غَفَرْتُ لِعَبْدِي‏.‏ ثُمَّ مَكَثَ مَا شَاءَ اللَّهُ ثُمَّ أَصَابَ ذَنْبًا فَقَالَ رَبِّ أَذْنَبْتُ آخَرَ فَاغْفِرْهُ‏.‏ فَقَالَ أَعَلِمَ عَبْدِي أَنَّ لَهُ رَبًّا يَغْفِرُ الذَّنْبَ وَيَأْخُذُ بِهِ غَفَرْتُ لِعَبْدِي، ثُمَّ مَكَثَ مَا شَاءَ اللَّهُ ثُمَّ أَذْنَبَ ذَنْبًا قَالَ رَبِّ أَصَبْتُ آخَرَ فَاغْفِرْهُ لِي‏.‏ فَقَالَ أَعَلِمَ عَبْدِي أَنَّ لَهُ رَبًّا يَغْفِرُ الذَّنْبَ وَيَأْخُذُ بِهِ غَفَرْتُ لِعَبْدِي ـ ثَلاَثًا ـ فَلْيَعْمَلْ مَا شَاءَ</div>
  <div class="english-translation"><p>Narrated Abu Huraira: I heard the Prophet (ﷺ) saying, "If somebody commits a sin and then says, 'O my Lord! I have sinned, please forgive me!' and his Lord says, 'My slave has known that he has a Lord who forgives sins and punishes for it, I therefore have forgiven my slave.' Then he remains without committing any sin for a while and then again commits another sin and says, 'O my Lord, I have committed another sin, please forgive me,' and Allah says, 'My slave has known that he has a Lord who forgives sins and punishes for it, I therefore have forgiven my slave.' Then he remains without committing any sin for a while and then commits another sin (for the third time) and says, 'O my Lord, I have committed another sin, please forgive me,' and Allah says, 'My slave has known that he has a Lord Who forgives sins and punishes for it, I therefore have forgiven My slave, he can do whatever he likes.'"</p></div>
</div>
<div class="story-context"><h3>Context</h3><p>One of the most hope-giving hadiths in all of Islam. "He can do whatever he likes" refers not to permission to sin, but that as long as this person keeps returning to Allah with sincere repentance, Allah will keep forgiving him — a promise of divine mercy without limit.</p></div>
<div class="discussion-questions">
  <h3>💬 Family Discussion Questions</h3>
  <ol>
    <li><strong>(Ages 6–12)</strong> The man made the same mistake THREE TIMES, and Allah forgave him EVERY time. What does this teach us about how Allah treats us when we say sorry and really mean it?</li>
    <li><strong>(Teens)</strong> Have you ever felt too embarrassed or ashamed to ask for forgiveness — from Allah or from someone you hurt? What does this hadith say to you personally?</li>
    <li><strong>(Whole family)</strong> Allah's reason for forgiving is: "My slave has known that he has a Lord who forgives." The key is knowing and acknowledging that Allah can forgive. How can we remind our family of Allah's mercy more often?</li>
    <li><strong>(Applying today)</strong> When someone in your family or class keeps making the same mistake, are you quick to say "you ALWAYS do this"? What does the Prophet's teaching inspire you to do differently?</li>
    <li><strong>(Adults)</strong> Scholars note that tawbah works even when repeated for the same sin — what matters is that each time the return to Allah is sincere. How does this reshape your spiritual life?</li>
  </ol>
</div>
<div class="lessons-summary">
  <h3>⭐ Lessons to Remember</h3>
  <ul>
    <li>The most important thing is to KNOW Allah is al-Ghaffar and to RETURN to Him.</li>
    <li>The door of tawbah never closes, no matter how many times you have knocked.</li>
    <li>Allah's opening question is tender: "Does My servant know that he has a Lord who forgives?" — He wants to forgive.</li>
    <li>Never despair of Allah's mercy.</li>
  </ul>
</div>`,
    },
  });

  await prisma.arabicTerm.create({ data: { arabicText: 'تَوْبَة', transliteration: 'Tawbah', translation: 'Repentance / Return to Allah', unitId: unit5.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'غُفْرَان', transliteration: 'Ghufran', translation: 'Divine Forgiveness', unitId: unit5.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'الْغَفَّار', transliteration: 'Al-Ghaffar', translation: "The Oft-Forgiving — one of Allah's 99 names", unitId: unit5.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'ذَنْب', transliteration: 'Dhanb', translation: 'Sin', unitId: unit5.id } });

  const fc5Data = [
    { front: 'Tawbah', frontArabic: 'تَوْبَة', back: 'Repentance', tags: ['seerah', 'aqidah', 'spirituality'] },
    { front: 'Al-Ghaffar', frontArabic: 'الْغَفَّار', back: "The Oft-Forgiving — one of Allah's names", tags: ['aqidah', 'seerah'] },
    { front: 'Ghufran', frontArabic: 'غُفْرَان', back: 'Divine Forgiveness', tags: ['seerah', 'aqidah'] },
    { front: 'Dhanb', frontArabic: 'ذَنْب', back: 'Sin', tags: ['seerah', 'aqidah'] },
  ];
  for (let i = 0; i < fc5Data.length; i++) {
    const fc = fc5Data[i];
    await prisma.flashCard.create({ data: { front: fc.front, frontArabic: fc.frontArabic, back: fc.back, backArabic: fc.frontArabic, courseId: course.id, category: 'vocabulary', tags: fc.tags, difficulty: FlashCardDifficulty.MEDIUM, orderIndex: i, unitId: unit5.id } });
  }

  await prisma.question.create({ data: { unitId: unit5.id, type: 'MULTIPLE_CHOICE', questionText: 'In this hadith, why does Allah say He forgives the man who keeps sinning and returning?', options: JSON.stringify(['Because the man performed many good deeds', 'Because the man knew he had a Lord who forgives and kept returning to Him', 'Because the man fasted and prayed', 'Because the sin was minor']), correctAnswer: 'Because the man knew he had a Lord who forgives and kept returning to Him', explanation: "Allah said: \"My slave has known that he has a Lord who forgives sins.\" The key was the slave's knowledge of Allah's mercy and his sincere return (tawbah) each time.", difficulty: 'EASY' } });

  console.log('   ✅ Unit 5 — The Man Who Kept Sinning');

  // ============================================================
  // STORY 6 — Bilal ibn Rabah: The Man Whose Footsteps Echoed in Paradise
  // ============================================================
  const unit6 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: "Lesson 6: Bilal ibn Rabah — The Man Whose Footsteps Echoed in Paradise",
      description: "The story of the first mu'adhdhin of Islam and his extraordinary rank",
      orderIndex: 5,
      content: `<h2>Bilal ibn Rabah: The Man Whose Footsteps Echoed in Paradise</h2>
<div class="hadith-reference">
  <p><strong>Source:</strong> Sahih al-Bukhari, Hadith 1149</p>
  <p><strong>Grade:</strong> Sahih</p>
  <p><strong>Reference:</strong> <a href="https://sunnah.com/bukhari:1149" target="_blank">https://sunnah.com/bukhari:1149</a></p>
</div>
<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">حَدَّثَنَا إِسْحَاقُ بْنُ نَصْرٍ، حَدَّثَنَا أَبُو أُسَامَةَ، عَنْ أَبِي حَيَّانَ، عَنْ أَبِي زُرْعَةَ، عَنْ أَبِي هُرَيْرَةَ ـ رضى الله عنه ـ أَنَّ النَّبِيَّ صلى الله عليه وسلم قَالَ لِبِلاَلٍ عِنْدَ صَلاَةِ الْفَجْرِ يَا بِلاَلُ حَدِّثْنِي بِأَرْجَى عَمَلٍ عَمِلْتَهُ فِي الإِسْلاَمِ، فَإِنِّي سَمِعْتُ دَفَّ نَعْلَيْكَ بَيْنَ يَدَىَّ فِي الْجَنَّةِ‏.‏ قَالَ مَا عَمِلْتُ عَمَلاً أَرْجَى عِنْدِي أَنِّي لَمْ أَتَطَهَّرْ طُهُورًا فِي سَاعَةِ لَيْلٍ أَوْ نَهَارٍ إِلاَّ صَلَّيْتُ بِذَلِكَ الطُّهُورِ مَا كُتِبَ لِي أَنْ أُصَلِّيَ‏.‏</div>
  <div class="english-translation"><p>Narrated Abu Huraira: At the time of the Fajr prayer the Prophet (ﷺ) asked Bilal, "Tell me of the best deed you did after embracing Islam, for I heard your footsteps in front of me in Paradise." Bilal replied, "I did not do anything worth mentioning except that whenever I performed ablution during the day or night, I prayed after that ablution as much as was written for me."</p></div>
</div>
<div class="story-context"><h3>Context</h3><p>Bilal ibn Rabah (RA) was an Abyssinian-born enslaved man. When he accepted Islam, his master tortured him on the scorching desert sand with a heavy boulder on his chest, demanding he renounce his faith. Bilal responded simply: "Ahad, Ahad" — "One (God), One (God)." Abu Bakr (RA) purchased and freed him. The Prophet ﷺ appointed Bilal as the very first mu'adhdhin in Islam. This hadith reveals Bilal's private, humble, consistent deed that earned him his extraordinary rank.</p></div>
<div class="discussion-questions">
  <h3>💬 Family Discussion Questions</h3>
  <ol>
    <li><strong>(Ages 6–12)</strong> Bilal was tortured for saying "One God" and he didn't give up. Why do you think he stayed strong? What would you hold on to if things got very hard?</li>
    <li><strong>(Teens)</strong> The Prophet heard Bilal's footsteps IN PARADISE. Bilal's secret deed was something ordinary — making wudu and praying. What does that tell us about which deeds Allah loves most?</li>
    <li><strong>(Whole family)</strong> Bilal was once enslaved and tortured — yet he became the first person to call the world to prayer from the Prophet's mosque. How does his story challenge ideas about people being "less than" others?</li>
    <li><strong>(Applying today)</strong> Bilal's most rewarded deed was consistency — never missing a prayer after wudu. Is there one small, consistent good deed you could commit to every day?</li>
    <li><strong>(Adults)</strong> Bilal's story is also one of social justice — Islam liberated him when society had enslaved him. What does it mean to you that the first mu'adhdhin of Islam was a formerly enslaved African man?</li>
  </ol>
</div>
<div class="lessons-summary">
  <h3>⭐ Lessons to Remember</h3>
  <ul>
    <li>The most powerful deeds are often the most consistent ones — not the grand gestures.</li>
    <li>Islam honored Bilal not despite his background, but because of his iman — "the most noble among you is the most righteous" (49:13).</li>
    <li>The first call to prayer was made by a man who endured torture saying "Ahad, Ahad."</li>
    <li>Allah does not forget even the whispered prayers of the oppressed.</li>
  </ul>
</div>`,
    },
  });

  await prisma.arabicTerm.create({ data: { arabicText: 'أَذَان', transliteration: 'Adhan', translation: 'Call to Prayer', unitId: unit6.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'مُؤَذِّن', transliteration: "Mu'adhdhin", translation: 'Caller to Prayer — Bilal was the first', unitId: unit6.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'وُضُوء', transliteration: "Wudu'", translation: 'Ritual ablution — purification before prayer', unitId: unit6.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'أَحَد', transliteration: 'Ahad', translation: "One — Allah's oneness; what Bilal repeated under torture", unitId: unit6.id } });

  const fc6Data = [
    { front: 'Adhan', frontArabic: 'أَذَان', back: 'Call to Prayer', tags: ['seerah', 'fiqh', 'worship'] },
    { front: "Mu'adhdhin", frontArabic: 'مُؤَذِّن', back: 'Caller to Prayer', tags: ['seerah'] },
    { front: "Wudu'", frontArabic: 'وُضُوء', back: 'Ritual ablution', tags: ['seerah', 'fiqh', 'worship'] },
    { front: 'Ahad', frontArabic: 'أَحَد', back: 'One — Allah is One', tags: ['seerah', 'aqidah'] },
  ];
  for (let i = 0; i < fc6Data.length; i++) {
    const fc = fc6Data[i];
    await prisma.flashCard.create({ data: { front: fc.front, frontArabic: fc.frontArabic, back: fc.back, backArabic: fc.frontArabic, courseId: course.id, category: 'vocabulary', tags: fc.tags, difficulty: FlashCardDifficulty.MEDIUM, orderIndex: i, unitId: unit6.id } });
  }

  await prisma.question.create({ data: { unitId: unit6.id, type: 'MULTIPLE_CHOICE', questionText: 'When the Prophet ﷺ told Bilal he had heard his footsteps in Paradise, what did Bilal say was his best deed?', options: JSON.stringify(['He called the adhan five times a day faithfully', 'He memorized the entire Quran', 'He always prayed after making wudu, day or night', 'He gave all his wealth in charity']), correctAnswer: 'He always prayed after making wudu, day or night', explanation: 'Bilal said: "Whenever I performed ablution during the day or night, I prayed after that ablution as much as was written for me." His most rewarded deed was a simple, consistent habit.', difficulty: 'MEDIUM' } });

  console.log('   ✅ Unit 6 — Bilal ibn Rabah');

  // ============================================================
  // STORY 7 — The Day Makkah Was Conquered and No One Was Punished
  // ============================================================
  const unit7 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Lesson 7: The Day Makkah Was Conquered and No One Was Punished',
      description: 'Fath Makkah — the greatest act of clemency in recorded history',
      orderIndex: 6,
      content: `<h2>The Day Makkah Was Conquered and No One Was Punished</h2>
<div class="hadith-reference">
  <p><strong>Source:</strong> Sahih al-Bukhari, Hadith 4280</p>
  <p><strong>Grade:</strong> Sahih</p>
  <p><strong>Reference:</strong> <a href="https://sunnah.com/bukhari:4280" target="_blank">https://sunnah.com/bukhari:4280</a></p>
</div>
<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">حَدَّثَنَا عُبَيْدُ بْنُ إِسْمَاعِيلَ، حَدَّثَنَا أَبُو أُسَامَةَ، عَنْ هِشَامٍ، عَنْ أَبِيهِ، قَالَ لَمَّا سَارَ رَسُولُ اللَّهِ صلى الله عليه وسلم عَامَ الْفَتْحِ، فَبَلَغَ ذَلِكَ قُرَيْشًا، خَرَجَ أَبُو سُفْيَانَ بْنُ حَرْبٍ وَحَكِيمُ بْنُ حِزَامٍ يَلْتَمِسُونَ الْخَبَرَ، فَأَدْرَكُوهُمْ فَأَخَذُوهُمْ، فَأَتَوْا بِهِمْ رَسُولَ اللَّهِ صلى الله عليه وسلم فَأَسْلَمَ أَبُو سُفْيَانَ، فَلَمَّا مَرَّ رَسُولُ اللَّهِ صلى الله عليه وسلم بِأَبِي سُفْيَانَ قَالَ أَلَمْ تَعْلَمْ مَا قَالَ سَعْدُ بْنُ عُبَادَةَ قَالَ مَا قَالَ قَالَ كَذَا وَكَذَا‏.‏ فَقَالَ كَذَبَ سَعْدٌ، وَلَكِنْ هَذَا يَوْمٌ يُعَظِّمُ اللَّهُ فِيهِ الْكَعْبَةَ، وَيَوْمٌ تُكْسَى فِيهِ الْكَعْبَةُ‏.‏</div>
  <div class="english-translation"><p>Narrated by Urwa: When Allah's Messenger (ﷺ) marched in the year of the Conquest of Mecca, Abu Sufyan bin Harb and Hakim bin Hizam went out to look for information. Some of the guards of Allah's Messenger (ﷺ) caught them and brought them to Allah's Messenger (ﷺ), and Abu Sufyan embraced Islam. When the Prophet (ﷺ) passed by Abu Sufyan, Abu Sufyan said, "Do you know what Sa'd bin Ubada said? He said 'Today is the day of a great battle and today what is prohibited in the Kaba will be permissible.'" The Prophet (ﷺ) said, "Sa'd told a lie, but today Allah will give superiority to the Kaba and today the Kaba will be covered with a covering." [After entering Makkah the Prophet stood at the Kaba door and declared to the gathered Quraysh: "What do you think I will do with you?" They replied, "A noble brother and the son of a noble brother." He said: "Go — you are free." (اذْهَبُوا فَأَنْتُمُ الطُّلَقَاء)]</p></div>
</div>
<div class="story-context"><h3>Context</h3><p>8 AH / 630 CE — After 20 years of persecution, exile, wars, and boycotts, the Prophet ﷺ entered Makkah at the head of 10,000 Muslims. The Quraysh had broken a treaty, and legally the Muslims could have exacted full revenge. Instead, the Prophet declared a general amnesty — "Go, you are all free."</p></div>
<div class="discussion-questions">
  <h3>💬 Family Discussion Questions</h3>
  <ol>
    <li><strong>(Ages 6–12)</strong> Abu Sufyan was one of the Prophet's greatest enemies for 20 years. But when he came to the Prophet's camp, the Prophet made him a Muslim and gave him an honored position. Why didn't the Prophet punish him?</li>
    <li><strong>(Teens)</strong> The Prophet corrected Sa'd ibn Ubada who said "today the Kaba will be desecrated." The Prophet said NO — "today the Kaba will be honored." What does this show about the Prophet's vision?</li>
    <li><strong>(Whole family)</strong> Have you ever had to forgive someone who hurt you badly? What makes forgiveness so hard? What does the Prophet's example inspire you to consider?</li>
    <li><strong>(Applying today)</strong> In your school, neighborhood, or family — is there a situation where someone is holding a grudge? What would "Fath Makkah style" forgiveness look like there?</li>
    <li><strong>(Adults)</strong> The 10,000-strong army was the most powerful force in Arabia. Yet the Prophet entered Makkah with his head bowed in humility. What does genuine power with humility look like?</li>
  </ol>
</div>
<div class="lessons-summary">
  <h3>⭐ Lessons to Remember</h3>
  <ul>
    <li>True victory is not in defeating enemies but in transforming them — most Quraysh became sincere Muslims.</li>
    <li>"Go, you are free" — the Prophet chose mercy when justice would have allowed punishment.</li>
    <li>The first thing the Prophet did in the Kaba was destroy the idols — then Bilal called the adhan there for the first time.</li>
    <li>This act of clemency is studied in military ethics, diplomacy, and peace studies to this day.</li>
  </ul>
</div>`,
    },
  });

  await prisma.arabicTerm.create({ data: { arabicText: 'فَتْح', transliteration: 'Fath', translation: 'Opening / Conquest — referring to the Conquest of Makkah', unitId: unit7.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'الطُّلَقَاء', transliteration: "At-Tulaqa'", translation: 'The Freed Ones — those pardoned by the Prophet at the Conquest', unitId: unit7.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'عَفْو', transliteration: 'Afw', translation: 'Pardon / Forgiveness', unitId: unit7.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'تَوَاضُع', transliteration: "Tawadu'", translation: 'Humility', unitId: unit7.id } });

  const fc7Data = [
    { front: 'Fath Makkah', frontArabic: 'فَتْح مَكَّة', back: 'Conquest of Makkah — 8 AH / 630 CE', tags: ['seerah', 'history'] },
    { front: "At-Tulaqa'", frontArabic: 'الطُّلَقَاء', back: 'The Freed Ones', tags: ['seerah'] },
    { front: 'Afw', frontArabic: 'عَفْو', back: 'Pardon', tags: ['seerah', 'akhlaq'] },
    { front: "Tawadu'", frontArabic: 'تَوَاضُع', back: 'Humility', tags: ['seerah', 'akhlaq'] },
  ];
  for (let i = 0; i < fc7Data.length; i++) {
    const fc = fc7Data[i];
    await prisma.flashCard.create({ data: { front: fc.front, frontArabic: fc.frontArabic, back: fc.back, backArabic: fc.frontArabic, courseId: course.id, category: 'vocabulary', tags: fc.tags, difficulty: FlashCardDifficulty.MEDIUM, orderIndex: i, unitId: unit7.id } });
  }

  await prisma.question.create({ data: { unitId: unit7.id, type: 'MULTIPLE_CHOICE', questionText: "When the Prophet ﷺ stood at the Ka'ba after the Conquest of Makkah and addressed the Quraysh who had persecuted Muslims for 20 years, what did he say?", options: JSON.stringify(['You will all be punished for what you did', 'Go — you are free (Adhabu fa-antum at-tulaqa)', 'Half of you are freed and half will be judged', 'Only those who accepted Islam before are forgiven']), correctAnswer: 'Go — you are free (Adhabu fa-antum at-tulaqa)', explanation: 'The Prophet ﷺ declared a general amnesty: "Adhabu fa-antum at-tulaqa" — Go, you are free. This is considered one of the most magnanimous acts of clemency in recorded history.', difficulty: 'MEDIUM' } });

  console.log('   ✅ Unit 7 — Fath Makkah');

  // ============================================================
  // STORY 8 — Umm Sulaym's Patience
  // ============================================================
  const unit8 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: "Lesson 8: Umm Sulaym's Patience — The Night That Changed Everything",
      description: 'A story of extraordinary sabr that was rewarded with nine children who memorized Quran',
      orderIndex: 7,
      content: `<h2>Umm Sulaym's Patience: The Night That Changed Everything</h2>
<div class="hadith-reference">
  <p><strong>Source:</strong> Sahih al-Bukhari, Hadith 1301</p>
  <p><strong>Grade:</strong> Sahih</p>
  <p><strong>Reference:</strong> <a href="https://sunnah.com/bukhari:1301" target="_blank">https://sunnah.com/bukhari:1301</a></p>
</div>
<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">حَدَّثَنَا بِشْرُ بْنُ الْحَكَمِ، حَدَّثَنَا سُفْيَانُ بْنُ عُيَيْنَةَ، أَخْبَرَنَا إِسْحَاقُ بْنُ عَبْدِ اللَّهِ بْنِ أَبِي طَلْحَةَ، أَنَّهُ سَمِعَ أَنَسَ بْنَ مَالِكٍ ـ رضى الله عنه ـ يَقُولُ اشْتَكَى ابْنٌ لأَبِي طَلْحَةَ فَمَاتَ وَأَبُو طَلْحَةَ خَارِجٌ، فَلَمَّا رَأَتِ امْرَأَتُهُ أَنَّهُ قَدْ مَاتَ هَيَّأَتْ شَيْئًا وَنَحَّتْهُ فِي جَانِبِ الْبَيْتِ، فَلَمَّا جَاءَ أَبُو طَلْحَةَ قَالَ كَيْفَ الْغُلاَمُ قَالَتْ قَدْ هَدَأَتْ نَفْسُهُ، وَأَرْجُو أَنْ يَكُونَ قَدِ اسْتَرَاحَ‏.‏ فَبَاتَ، فَلَمَّا أَصْبَحَ اغْتَسَلَ، فَلَمَّا أَرَادَ أَنْ يَخْرُجَ، أَعْلَمَتْهُ أَنَّهُ قَدْ مَاتَ، فَصَلَّى مَعَ النَّبِيِّ صلى الله عليه وسلم ثُمَّ أَخْبَرَ النَّبِيَّ صلى الله عليه وسلم بِمَا كَانَ مِنْهُمَا، فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم لَعَلَّ اللَّهَ أَنْ يُبَارِكَ لَكُمَا فِي لَيْلَتِكُمَا‏.‏ قَالَ سُفْيَانُ فَقَالَ رَجُلٌ مِنَ الأَنْصَارِ فَرَأَيْتُ لَهُمَا تِسْعَةَ أَوْلاَدٍ كُلُّهُمْ قَدْ قَرَأَ الْقُرْآنَ‏.‏</div>
  <div class="english-translation"><p>Narrated Anas bin Malik: One of the sons of Abu Talha became sick and died and Abu Talha at that time was not at home. When his wife (Umm Sulaym) saw that he was dead, she prepared him (washed and shrouded him) and placed him somewhere in the house. When Abu Talha came, he asked, "How is the boy?" She said, "The child is quiet and I hope he is in peace." Abu Talha thought that she had spoken the truth. Abu Talha passed the night and in the morning took a bath and when he intended to go out, she told him that his son had died. Abu Talha offered the (morning) prayer with the Prophet (ﷺ) and informed the Prophet (ﷺ) of what happened to them. Allah's Messenger (ﷺ) said, "May Allah bless you concerning your night." Sufyan said, "One of the Ansar said, 'They (i.e. Abu Talha and his wife) had nine sons and all of them became reciters of the Qur'an (by heart).'"</p></div>
</div>
<div class="story-context"><h3>Context</h3><p>Umm Sulaym bint Milhan (RA) was one of the greatest female companions. When her son died while her husband was away, she bathed him, shrouded him, and set him gently aside. She waited until her husband had rested before gently telling him. The Prophet heard her story and prayed for them — from that night, Allah gave them descendants who became great Quran scholars.</p></div>
<div class="discussion-questions">
  <h3>💬 Family Discussion Questions</h3>
  <ol>
    <li><strong>(Ages 6–12)</strong> Umm Sulaym's son died while she was alone. She must have cried — she was human! But she still took care of everything. How do you think she found the strength?</li>
    <li><strong>(Teens)</strong> Umm Sulaym's iman was so deep she could say "He gave it, and He took it back." Where does that kind of faith come from?</li>
    <li><strong>(Whole family)</strong> Umm Sulaym protected her husband from shock when he was tired, and took care of everything. What does this tell us about how a family can support each other through grief?</li>
    <li><strong>(Applying today)</strong> The Prophet prayed for them and blessed "their night" — meaning Allah rewarded their sabr with nine children who memorized Quran. What does this teach us about the connection between patience and blessing?</li>
    <li><strong>(Adults)</strong> Umm Sulaym also gave one of the most powerful mahr conditions in history — she offered her Islam as her mahr to Abu Talha. How does this story reframe what we consider "strength" in a woman?</li>
  </ol>
</div>
<div class="lessons-summary">
  <h3>⭐ Lessons to Remember</h3>
  <ul>
    <li>Sabr (patience) is not the absence of grief — it is continuing to care for others even while you are grieving.</li>
    <li>Every loss borne with patience and trust in Allah opens a door of greater blessing.</li>
    <li>Umm Sulaym carried the household through the hardest night so her husband could rest — true partnership in crisis.</li>
    <li>Nine sons who all memorized the Quran was the reward for one night of sabr.</li>
  </ul>
</div>`,
    },
  });

  await prisma.arabicTerm.create({ data: { arabicText: 'صَبْر', transliteration: 'Sabr', translation: 'Patience / Perseverance in the face of calamity', unitId: unit8.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', transliteration: "Inna lillahi wa inna ilayhi raji'un", translation: 'Indeed to Allah we belong and to Him we shall return — Quran 2:156', unitId: unit8.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'اسْتِرْجَاع', transliteration: "Istirja'", translation: 'Returning to Allah in calamity — the act of saying inna lillah', unitId: unit8.id } });

  const fc8Data = [
    { front: 'Sabr', frontArabic: 'صَبْر', back: 'Patience — one of the highest virtues in Islam', tags: ['seerah', 'akhlaq', 'spirituality'] },
    { front: "Inna lillahi wa inna ilayhi raji'un", frontArabic: 'إِنَّا لِلَّهِ', back: 'Indeed to Allah we belong — Quran 2:156', tags: ['seerah', 'quran', 'dua'] },
    { front: 'Sahabiyyat', frontArabic: 'صَحَابِيَّات', back: 'Female Companions of the Prophet ﷺ', tags: ['seerah', 'history'] },
  ];
  for (let i = 0; i < fc8Data.length; i++) {
    const fc = fc8Data[i];
    await prisma.flashCard.create({ data: { front: fc.front, frontArabic: fc.frontArabic, back: fc.back, backArabic: fc.frontArabic, courseId: course.id, category: 'vocabulary', tags: fc.tags, difficulty: FlashCardDifficulty.MEDIUM, orderIndex: i, unitId: unit8.id } });
  }

  await prisma.question.create({ data: { unitId: unit8.id, type: 'MULTIPLE_CHOICE', questionText: 'When Abu Talha asked Umm Sulaym about their son who had died while he was away, what did she say?', options: JSON.stringify(['She told him immediately that their son had died', 'She said the child is quiet and I hope he is in peace — waiting until morning to tell him', 'She sent someone else to tell him', 'She told him to ask the Prophet what happened']), correctAnswer: 'She said the child is quiet and I hope he is in peace — waiting until morning to tell him', explanation: 'Umm Sulaym chose to wait until after her tired husband had rested, and in the morning after Fajr, she gently told him. This was an act of profound sabr and wisdom.', difficulty: 'MEDIUM' } });

  console.log("   ✅ Unit 8 — Umm Sulaym's Patience");

  // ============================================================
  // STORY 9 — The Prophet's Tears: Mercy is a Gift from Allah
  // ============================================================
  const unit9 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: "Lesson 9: The Prophet's Tears — Mercy is a Gift from Allah",
      description: 'How the Prophet ﷺ wept at a dying child and taught us that tears are divine mercy',
      orderIndex: 8,
      content: `<h2>The Prophet's Tears: Mercy is a Gift from Allah</h2>
<div class="hadith-reference">
  <p><strong>Source:</strong> Sahih Muslim, Hadith 923a</p>
  <p><strong>Grade:</strong> Sahih</p>
  <p><strong>Reference:</strong> <a href="https://sunnah.com/muslim:923a" target="_blank">https://sunnah.com/muslim:923a</a></p>
</div>
<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">حَدَّثَنَا أَبُو كَامِلٍ الْجَحْدَرِيُّ، حَدَّثَنَا حَمَّادٌ يَعْنِي ابْنَ زَيْدٍ، عَنْ عَاصِمٍ الأَحْوَلِ، عَنْ أَبِي عُثْمَانَ النَّهْدِيِّ، عَنْ أُسَامَةَ بْنِ زَيْدٍ، قَالَ كُنَّا عِنْدَ النَّبِيِّ صلى الله عليه وسلم فَأَرْسَلَتْ إِلَيْهِ إِحْدَى بَنَاتِهِ تَدْعُوهُ وَتُخْبِرُهُ أَنَّ صَبِيًّا لَهَا فِي الْمَوْتِ فَقَالَ لِلرَّسُولِ ارْجِعْ إِلَيْهَا فَأَخْبِرْهَا إِنَّ لِلَّهِ مَا أَخَذَ وَلَهُ مَا أَعْطَى وَكُلُّ شَىْءٍ عِنْدَهُ بِأَجَلٍ مُسَمًّى فَمُرْهَا فَلْتَصْبِرْ وَلْتَحْتَسِبْ‏.‏ فَعَادَ الرَّسُولُ فَقَالَ إِنَّهَا قَدْ أَقْسَمَتْ لَتَأْتِيَنَّهَا‏.‏ فَقَامَ النَّبِيُّ صلى الله عليه وسلم وَقَامَ مَعَهُ سَعْدُ بْنُ عُبَادَةَ وَمُعَاذُ بْنُ جَبَلٍ فَرُفِعَ إِلَيْهِ الصَّبِيُّ وَنَفْسُهُ تَقَعْقَعُ كَأَنَّهَا فِي شَنَّةٍ فَفَاضَتْ عَيْنَاهُ فَقَالَ لَهُ سَعْدٌ مَا هَذَا يَا رَسُولَ اللَّهِ قَالَ هَذِهِ رَحْمَةٌ جَعَلَهَا اللَّهُ فِي قُلُوبِ عِبَادِهِ وَإِنَّمَا يَرْحَمُ اللَّهُ مِنْ عِبَادِهِ الرُّحَمَاءَ‏.‏</div>
  <div class="english-translation"><p>Usama b. Zaid reported: While we were with the Messenger of Allah (ﷺ), one of his daughters sent to him to inform him that her child was dying. The Messenger of Allah (ﷺ) told the messenger to go back and tell her that what Allah had taken belonged to Him, and to Him belonged what He granted; and He has an appointed time for everything. So order her to show endurance and seek reward from Allah. The messenger came back and said she adjures him to come to her. He got up to go accompanied by Sa'd b. Ubada and Mu'adh b. Jabal. The child was lifted to him and his soul was feeling as restless as if it was in an old waterskin. His eyes welled up with tears. Sa'd said: What is this, Messenger of Allah? He replied: "This is compassion which Allah has placed in the hearts of His servants, and Allah shows compassion only to those of His servants who are compassionate."</p></div>
</div>
<div class="story-context"><h3>Context</h3><p>Sa'd ibn Ubada asked about the Prophet's tears because at the time, some Arabs believed crying was a sign of weakness. The Prophet's answer reframes everything: tears are rahma (mercy), placed by Allah in the heart. The Islamic middle path: feel the grief, let the tears flow, but let the tongue speak acceptance.</p></div>
<div class="discussion-questions">
  <h3>💬 Family Discussion Questions</h3>
  <ol>
    <li><strong>(Ages 6–12)</strong> The Prophet ﷺ cried when he saw the sick baby. Does that surprise you? Why is it okay — even good — to cry when you're sad?</li>
    <li><strong>(Teens)</strong> Some people think strong people don't cry. What does the Prophet's example teach us about emotional strength vs. emotional suppression?</li>
    <li><strong>(Whole family)</strong> The Prophet sent back the message "what Allah took was His." But he STILL went in person. What does going in person mean to a grieving family?</li>
    <li><strong>(Applying today)</strong> When someone in our life is grieving, do we just send a text or do we show up? What does the Prophet's example challenge us to do?</li>
    <li><strong>(Adults)</strong> The Prophet's formula for condolence: "Indeed to Allah belongs what He took, and to Him belongs what He gave, and everything with Him has an appointed time." How can memorizing this phrase change the way we comfort grieving people?</li>
  </ol>
</div>
<div class="lessons-summary">
  <h3>⭐ Lessons to Remember</h3>
  <ul>
    <li>The Prophet ﷺ cried — and called his tears rahma (mercy); never be ashamed of compassionate tears.</li>
    <li>Showing up in person for someone in grief is itself an act of worship.</li>
    <li>Islamic grief has two sides: feel the loss fully, but trust Allah's wisdom completely.</li>
    <li>"Allah shows compassion only to those of His servants who are compassionate" — mercy is both received and given.</li>
  </ul>
</div>`,
    },
  });

  await prisma.arabicTerm.create({ data: { arabicText: 'رَحْمَة', transliteration: 'Rahmah', translation: 'Mercy / Compassion — placed in the hearts of believers by Allah', unitId: unit9.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'الرُّحَمَاء', transliteration: "Ar-Ruhama'", translation: 'The Merciful ones — those whom Allah shows mercy', unitId: unit9.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'إِنَّ لِلَّهِ مَا أَخَذَ', transliteration: 'Inna lillahi ma akhadha', translation: 'Indeed to Allah belongs what He took — Islamic condolence formula', unitId: unit9.id } });

  const fc9Data = [
    { front: 'Rahmah', frontArabic: 'رَحْمَة', back: 'Mercy — placed by Allah in the hearts of His servants', tags: ['seerah', 'aqidah', 'akhlaq'] },
    { front: "Ar-Ruhama'", frontArabic: 'الرُّحَمَاء', back: 'The Merciful — those whom Allah shows mercy', tags: ['seerah', 'aqidah'] },
    { front: "Ta'ziyah", frontArabic: 'تَعْزِيَة', back: 'Condolence / Offering sympathy to the bereaved', tags: ['seerah', 'fiqh', 'akhlaq'] },
  ];
  for (let i = 0; i < fc9Data.length; i++) {
    const fc = fc9Data[i];
    await prisma.flashCard.create({ data: { front: fc.front, frontArabic: fc.frontArabic, back: fc.back, backArabic: fc.frontArabic, courseId: course.id, category: 'vocabulary', tags: fc.tags, difficulty: FlashCardDifficulty.MEDIUM, orderIndex: i, unitId: unit9.id } });
  }

  await prisma.question.create({ data: { unitId: unit9.id, type: 'MULTIPLE_CHOICE', questionText: "When Sa'd ibn Ubada saw the Prophet ﷺ weeping, he asked what this was. What was the Prophet's answer?", options: JSON.stringify(['Crying is not permitted for a believer', "This is compassion which Allah has placed in the hearts of His servants, and Allah shows compassion only to those who are compassionate", 'I weep because this child will go to Paradise', 'Only prophets are permitted to cry']), correctAnswer: "This is compassion which Allah has placed in the hearts of His servants, and Allah shows compassion only to those who are compassionate", explanation: "The Prophet ﷺ said: 'Hadhihi rahmatun ja'alaha Allahu fi qulubi ibadih.' He validated emotional expression as a divine gift, and linked mercy given to mercy received.", difficulty: 'MEDIUM' } });

  console.log("   ✅ Unit 9 — The Prophet's Tears");

  // ============================================================
  // STORY 10 — The Man Who Never Kissed His Children
  // ============================================================
  const unit10 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Lesson 10: The Man Who Never Kissed His Children',
      description: 'How the Prophet ﷺ linked parental affection to receiving divine mercy',
      orderIndex: 9,
      content: `<h2>The Man Who Never Kissed His Children</h2>
<div class="hadith-reference">
  <p><strong>Source:</strong> Sahih al-Bukhari, Hadith 5997</p>
  <p><strong>Grade:</strong> Sahih</p>
  <p><strong>Reference:</strong> <a href="https://sunnah.com/bukhari:5997" target="_blank">https://sunnah.com/bukhari:5997</a></p>
</div>
<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">حَدَّثَنَا أَبُو الْيَمَانِ، أَخْبَرَنَا شُعَيْبٌ، عَنِ الزُّهْرِيِّ، حَدَّثَنَا أَبُو سَلَمَةَ بْنُ عَبْدِ الرَّحْمَنِ، أَنَّ أَبَا هُرَيْرَةَ ـ رضى الله عنه ـ قَالَ قَبَّلَ رَسُولُ اللَّهِ صلى الله عليه وسلم الْحَسَنَ بْنَ عَلِيٍّ وَعِنْدَهُ الأَقْرَعُ بْنُ حَابِسٍ التَّمِيمِيُّ جَالِسًا‏.‏ فَقَالَ الأَقْرَعُ إِنَّ لِي عَشَرَةً مِنَ الْوَلَدِ مَا قَبَّلْتُ مِنْهُمْ أَحَدًا‏.‏ فَنَظَرَ إِلَيْهِ رَسُولُ اللَّهِ صلى الله عليه وسلم ثُمَّ قَالَ مَنْ لاَ يَرْحَمُ لاَ يُرْحَمُ‏.‏</div>
  <div class="english-translation"><p>Narrated Abu Huraira: Allah's Messenger (ﷺ) kissed Al-Hasan bin Ali while Al-Aqra bin Habis At-Tamimi was sitting with him. Al-Aqra said, "I have ten children and I have never kissed anyone of them." Allah's Messenger (ﷺ) cast a look at him and said, "Whoever is not merciful to others will not be treated mercifully."</p></div>
</div>
<div class="story-context"><h3>Context</h3><p>Al-Hasan ibn Ali (RA) was the Prophet's beloved grandson. Al-Aqra ibn Habis was a tribal chief who apparently equated toughness with not showing affection to children. The Prophet's response was not angry — it was a gentle but piercing teaching: mercy to children is the seed of mercy from Allah.</p></div>
<div class="discussion-questions">
  <h3>💬 Family Discussion Questions</h3>
  <ol>
    <li><strong>(Ages 6–12)</strong> The Prophet ﷺ kissed his grandson right in front of important guests — he wasn't embarrassed at all! How does it make you feel when a parent or grandparent shows love to you in front of others?</li>
    <li><strong>(Teens)</strong> Al-Aqra had TEN children he never kissed. He probably thought he was being "tough." What message do you think his children got from that?</li>
    <li><strong>(Whole family)</strong> The Prophet linked kissing Hasan to: "Whoever does not show mercy will not be shown mercy." How are we doing in our family at showing love and affection openly?</li>
    <li><strong>(Applying today)</strong> In some cultures, parents don't hug or kiss children because they think it "spoils" them. What does the Prophet's example say to that belief? What is one way you can show love to someone in your family today?</li>
    <li><strong>(Adults)</strong> Research consistently shows that children who receive physical affection develop greater emotional intelligence, resilience, and security. How does Islamic tradition align with modern psychology here?</li>
  </ol>
</div>
<div class="lessons-summary">
  <h3>⭐ Lessons to Remember</h3>
  <ul>
    <li>The Prophet ﷺ kissed, hugged, played with, and carried his grandchildren — this was Sunnah.</li>
    <li>Showing mercy to children is not weakness — it is the condition for receiving Allah's mercy.</li>
    <li>"Whoever does not show mercy will not be shown mercy" — mercy is a cycle: give it to receive it.</li>
    <li>Al-Aqra said "I have ten children and never kissed one" — and the Prophet's look of disapproval was itself a teaching.</li>
  </ul>
</div>`,
    },
  });

  await prisma.arabicTerm.create({ data: { arabicText: 'مَنْ لَا يَرْحَمْ لَا يُرْحَمْ', transliteration: 'Man la yarham la yurham', translation: 'Whoever does not show mercy will not be shown mercy — prophetic saying', unitId: unit10.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'الْحَسَن', transliteration: 'Al-Hasan', translation: "Al-Hasan ibn Ali — the Prophet's grandson, son of Ali and Fatimah", unitId: unit10.id } });
  await prisma.arabicTerm.create({ data: { arabicText: 'سُنَّة', transliteration: 'Sunnah', translation: 'The prophetic example / way of the Prophet ﷺ', unitId: unit10.id } });

  const fc10Data = [
    { front: 'Man la yarham la yurham', frontArabic: 'مَنْ لَا يَرْحَمْ', back: 'Whoever shows no mercy will be shown no mercy', tags: ['seerah', 'akhlaq', 'hadith'] },
    { front: 'Sunnah', frontArabic: 'سُنَّة', back: 'The prophetic way / example', tags: ['seerah', 'fiqh'] },
    { front: 'Al-Hasan', frontArabic: 'الْحَسَن', back: "The Prophet's grandson — son of Ali and Fatimah", tags: ['seerah', 'history'] },
  ];
  for (let i = 0; i < fc10Data.length; i++) {
    const fc = fc10Data[i];
    await prisma.flashCard.create({ data: { front: fc.front, frontArabic: fc.frontArabic, back: fc.back, backArabic: fc.frontArabic, courseId: course.id, category: 'vocabulary', tags: fc.tags, difficulty: FlashCardDifficulty.MEDIUM, orderIndex: i, unitId: unit10.id } });
  }

  await prisma.question.create({ data: { unitId: unit10.id, type: 'MULTIPLE_CHOICE', questionText: "When al-Aqra ibn Habis told the Prophet ﷺ 'I have ten children and I have never kissed any of them,' what did the Prophet ﷺ say?", options: JSON.stringify(['That is very good — it teaches them strength', 'Whoever is not merciful to others will not be treated mercifully', 'You should kiss at least the youngest one', "It depends on the child's temperament"]), correctAnswer: 'Whoever is not merciful to others will not be treated mercifully', explanation: "The Prophet ﷺ said 'Man la yarham la yurham' — Whoever does not show mercy will not be treated mercifully. He connected parental affection directly to receiving divine mercy, making it a matter of faith, not just culture.", difficulty: 'EASY' } });

  console.log('   ✅ Unit 10 — The Man Who Never Kissed His Children');
  console.log('');
  console.log('✅ Stories from Seerah course seed complete! 10 units created.');
  console.log('');
}

async function main() {
  await seedSeerahStoriesCourse();
}

main()
  .catch((e) => {
    console.error('❌ Seerah Stories seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
