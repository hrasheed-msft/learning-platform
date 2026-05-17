import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * An Nasihah Further Studies (North West) — Advanced Islamic Curriculum Seed
 * Source: An Nasihah Publications, Age Range: 14+ years
 *
 * Covers nine subjects: Essentials of Dīn 1, Essentials of Dīn 2, Faith & Belief,
 * Devotional Practice, Identity & Character, Living as a Muslim, Money & Transactions,
 * Contemporary Issues, and Hadith Studies.
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions and flashcards per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-further-studies-nw.ts
 */

export async function seedMaktabFurtherStudiesNW() {
  console.log('📚 Starting An Nasihah Further Studies (North West) seed...');
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

  // Check if course already exists — skip if so
  const existing = await prisma.course.findFirst({
    where: { title: 'An Nasihah Further Studies (North West)' },
  });
  if (existing) {
    console.log('⏭️  An Nasihah Further Studies (North West) already exists — skipping.');
    return;
  }

  // ──────────────────────────────────────────────
  // COURSE
  // ──────────────────────────────────────────────

  const course = await prisma.course.create({
    data: {
      title: 'An Nasihah Further Studies (North West)',
      description:
        'A comprehensive advanced Islamic curriculum for students aged 14+ years. Covers essentials of faith, purification, prayer, devotional acts, Muslim identity, living Islam in modern society, financial ethics, and contemporary challenges. Based on An Nasihah Publications Further Studies series.',
      category: 'FIQH',
      ageLevels: ['TEEN', 'ADULT'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  let flashcardIndex = 0;


  // ──────────────────────────────────────────────
  // UNIT 0: ESSENTIALS OF DĪN 1 — ʿAqāʾid & Ṭahārah
  // ──────────────────────────────────────────────

  const unitEssentials1 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Essentials of Dīn 1 — ʿAqāʾid & Ṭahārah',
      description:
        'Foundation topics in creed and purification: the articles of faith, key fiqh terminology, the five pillars in depth, categories of najāsah, wuḍūʾ (farāʾiḍ, sunan, nawāqiḍ), tayammum, ghusl, and signs of bulūgh.',
      orderIndex: 0,
      content: `
<h2>Essentials of Dīn 1 — ʿAqāʾid &amp; Ṭahārah</h2>

<h3>1. The Articles of Faith (Arkān al-Īmān)</h3>

<p>Belief (<em>īmān</em>) in Islam is not simply an emotional or intellectual assent; it is a firm conviction in six essential articles that every Muslim must affirm. These are derived from the Qurʾān and the Sunnah of Rasūlullāh ﷺ.</p>

<p class="arabic" dir="rtl" lang="ar">آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ</p>
<p class="source">(Sūrah al-Baqarah, 2:285)</p>

<h4>1.1 Belief in Allāh</h4>
<p>To believe that Allāh exists, that He is One (<em>Tawḥīd</em>), without partner or equal. He possesses all attributes of perfection and is free from all defects. He is <em>al-Khāliq</em> (the Creator), <em>ar-Razzāq</em> (the Provider), and <em>al-Mudabbir</em> (the Planner of all affairs). Tawḥīd is subdivided into: <em>Tawḥīd ar-Rubūbiyyah</em> (Lordship), <em>Tawḥīd al-Ulūhiyyah</em> (Worship), and <em>Tawḥīd al-Asmāʾ waṣ-Ṣifāt</em> (Names and Attributes).</p>

<h4>1.2 Belief in the Angels (Malāʾikah)</h4>
<p>Angels are created from light (<em>nūr</em>) and carry out the commands of Allāh without disobedience. Key angels include: <strong>Jibrīl</strong> عليه السلام (revelation), <strong>Mīkāʾīl</strong> (sustenance and rain), <strong>Isrāfīl</strong> (blowing the trumpet on the Day of Judgement), <strong>ʿIzrāʾīl / Malak al-Mawt</strong> (the angel of death), <strong>Munkar and Nakīr</strong> (questioning in the grave), and the <strong>Kirāman Kātibīn</strong> (noble scribes recording deeds).</p>

<h4>1.3 Belief in the Revealed Books (Kutub)</h4>
<p>Allāh revealed scriptures to various prophets as guidance for mankind. These include the <em>Ṣuḥuf</em> (scrolls) given to Ibrāhīm عليه السلام, the <em>Tawrāh</em> (Torah) to Mūsā عليه السلام, the <em>Zabūr</em> (Psalms) to Dāwūd عليه السلام, the <em>Injīl</em> (Gospel) to ʿĪsā عليه السلام, and the <em>Qurʾān</em> to Muḥammad ﷺ. The Qurʾān is the final, preserved, and unaltered revelation.</p>

<h4>1.4 Belief in the Messengers (Rusul)</h4>
<p>Allāh sent prophets to every nation. The Qurʾān names twenty-five prophets, beginning with Ādam عليه السلام and concluding with Muḥammad ﷺ, the Seal of the Prophets (<em>Khātam an-Nabiyyīn</em>). All prophets taught <em>Tawḥīd</em> and were protected from major sins (<em>ʿiṣmah</em>).</p>

<h4>1.5 Belief in the Last Day (Yawm al-Ākhirah)</h4>
<p>This encompasses belief in death, the life of the grave (<em>barzakh</em>), the resurrection (<em>baʿth</em>), the gathering (<em>ḥashr</em>), the reckoning (<em>ḥisāb</em>), the scales (<em>mīzān</em>), the bridge (<em>ṣirāṭ</em>), intercession (<em>shafāʿah</em>), and the final abodes of Jannah and Jahannam.</p>

<h4>1.6 Belief in Divine Decree (Qadr)</h4>
<p>Everything that occurs does so by the will and knowledge of Allāh. This includes belief in: Allāh's prior knowledge (<em>ʿilm</em>), His writing of all that will occur (<em>kitābah</em>), His will (<em>mashīʾah</em>), and His creation of all things (<em>khalq</em>). Belief in <em>qadr</em> does not negate human free will; rather, Allāh has given humans the ability to choose, while He knows their choices in advance.</p>

<h3>2. Key Fiqh Terminology</h3>

<p>Understanding Islamic jurisprudence requires familiarity with the five legal rulings (<em>al-aḥkām al-khamsah</em>) that apply to every human action:</p>

<ul>
  <li><strong>Farḍ / Wājib:</strong> Obligatory — rewarded for performing, sinful for neglecting (e.g., the five daily prayers).</li>
  <li><strong>Sunnah / Mustaḥabb:</strong> Recommended — rewarded for performing, no sin for omitting (e.g., using miswāk).</li>
  <li><strong>Mubāḥ:</strong> Permissible — neither rewarded nor punished (e.g., eating bread).</li>
  <li><strong>Makrūh:</strong> Disliked — not sinful but avoiding is rewarded (e.g., eating raw garlic before the masjid).</li>
  <li><strong>Ḥarām:</strong> Prohibited — sinful to perform, rewarded for avoiding (e.g., consuming alcohol).</li>
</ul>

<h3>3. The Five Pillars in Depth</h3>

<p>The five pillars (<em>arkān al-Islām</em>) are the foundational acts of worship upon which the entire religion is built:</p>

<p class="arabic" dir="rtl" lang="ar">بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ</p>
<p class="source">(Ṣaḥīḥ al-Bukhārī & Muslim, from Ibn ʿUmar رضي الله عنهما)</p>

<ol>
  <li><strong>Shahādah:</strong> The testimony of faith — bearing witness to the oneness of Allāh and the prophethood of Muḥammad ﷺ.</li>
  <li><strong>Ṣalāh:</strong> The five obligatory daily prayers performed at their prescribed times with the conditions of ṭahārah, facing the qiblah, and proper intention (<em>niyyah</em>).</li>
  <li><strong>Zakāh:</strong> Obligatory alms-giving of 2.5% on wealth that reaches the <em>niṣāb</em> threshold and has been held for one lunar year.</li>
  <li><strong>Ṣawm:</strong> Fasting during the month of Ramaḍān from dawn (<em>ṣubḥ ṣādiq</em>) to sunset (<em>maghrib</em>), abstaining from food, drink, and marital relations.</li>
  <li><strong>Ḥajj:</strong> The pilgrimage to Makkah, obligatory once in a lifetime for those who are physically and financially able.</li>
</ol>

<h3>4. Najāsah — Ritual Impurity</h3>

<p>In the Ḥanafī madhhab, impurities are classified into two categories:</p>

<ul>
  <li><strong>Najāsah Ghālīẓah (heavy impurity):</strong> Includes urine, stool, flowing blood, wine, and the excrement of ḥarām animals. For clothing or body, an amount exceeding the size of a dirham (approx. 3 cm diameter) invalidates prayer.</li>
  <li><strong>Najāsah Khafīfah (light impurity):</strong> Includes the urine of ḥalāl animals and droppings of ḥarām birds. Prayer is not invalidated unless it covers more than one quarter of the garment or limb.</li>
</ul>

<p>Purification methods include washing with water (the primary method), rubbing with earth or clean material for items like shoes, and in some cases, drying (e.g., a mirror or sword).</p>

<h3>5. Wuḍūʾ — Ablution</h3>

<h4>5.1 Farāʾiḍ of Wuḍūʾ (Obligatory Elements)</h4>
<p>According to the Ḥanafī school, there are four farāʾiḍ:</p>
<ol>
  <li>Washing the face — from the hairline to below the chin, and from ear to ear.</li>
  <li>Washing both arms including the elbows.</li>
  <li>Masḥ (wiping) of at least one quarter of the head.</li>
  <li>Washing both feet including the ankles.</li>
</ol>

<h4>5.2 Sunan of Wuḍūʾ</h4>
<p>These include: beginning with Bismillāh, washing hands three times, using miswāk, rinsing the mouth (<em>maḍmaḍah</em>) and nostrils (<em>istinshāq</em>) three times, wiping the entire head once, wiping the ears, washing each limb three times, maintaining the prescribed order (<em>tartīb</em>), and doing the actions in succession (<em>muwālāh</em>).</p>

<h4>5.3 Nawāqiḍ al-Wuḍūʾ (Actions that Break Wuḍūʾ)</h4>
<p>Key invalidators include: any discharge from the private parts (urine, stool, wind), flowing blood or pus from any part of the body, vomiting a mouthful, sleeping while reclining, fainting, intoxication, and laughing audibly during ṣalāh (for an adult).</p>

<h3>6. Tayammum — Dry Ablution</h3>

<p>When water is unavailable or its use would cause harm, <em>tayammum</em> is a valid substitute using clean earth or dust. The method involves: making intention, striking the hands on clean earth, wiping the face, then striking again and wiping both arms including the elbows. Tayammum is invalidated by anything that breaks wuḍūʾ, as well as by the availability of water.</p>

<h3>7. Ghusl — Full Ritual Bath</h3>

<p>Ghusl becomes obligatory after: <em>janābah</em> (sexual impurity), completion of menstruation (<em>ḥayḍ</em>), and postpartum bleeding (<em>nifās</em>). The three farāʾiḍ of ghusl are: rinsing the mouth so water reaches every part, rinsing the nostrils, and pouring water over the entire body such that no area the size of a hair-tip remains dry.</p>

<h3>8. Signs of Bulūgh (Puberty)</h3>

<p>In Islamic law, <em>bulūgh</em> marks the point at which a person becomes <em>mukallaf</em> (legally responsible). The signs include: nocturnal emission (<em>iḥtilām</em>), growth of coarse hair around the private area, and for girls, the beginning of menstruation. If none of these signs appear, bulūgh is assumed at the age of fifteen lunar years.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 0:', unitEssentials1.title);


  // ──────────────────────────────────────────────
  // UNIT 0 QUIZ QUESTIONS
  // ──────────────────────────────────────────────

  console.log('📝 Creating Unit 0 quiz questions...');

  await prisma.question.createMany({
    data: [
      {
        unitId: unitEssentials1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many articles of faith (arkān al-īmān) must every Muslim believe in?',
        options: JSON.stringify(['Four', 'Five', 'Six', 'Seven']),
        correctAnswer: 'Six',
        explanation: 'The six articles of faith are: belief in Allāh, the angels, the revealed books, the messengers, the Last Day, and divine decree (qadr).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitEssentials1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is NOT one of the subdivisions of Tawḥīd?',
        options: JSON.stringify(['Tawḥīd ar-Rubūbiyyah', 'Tawḥīd al-Ulūhiyyah', 'Tawḥīd al-Muʿāmalāt', 'Tawḥīd al-Asmāʾ waṣ-Ṣifāt']),
        correctAnswer: 'Tawḥīd al-Muʿāmalāt',
        explanation: 'The three subdivisions are Tawḥīd ar-Rubūbiyyah (Lordship), Tawḥīd al-Ulūhiyyah (Worship), and Tawḥīd al-Asmāʾ waṣ-Ṣifāt (Names and Attributes). Muʿāmalāt refers to transactions, not a category of Tawḥīd.',
        difficulty: 'HARD',
      },
      {
        unitId: unitEssentials1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the Ḥanafī madhhab, how many farāʾiḍ (obligatory elements) does wuḍūʾ have?',
        options: JSON.stringify(['Three', 'Four', 'Five', 'Six']),
        correctAnswer: 'Four',
        explanation: 'The four farāʾiḍ of wuḍūʾ in the Ḥanafī school are: washing the face, washing both arms including elbows, wiping at least one quarter of the head, and washing both feet including ankles.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitEssentials1.id,
        type: 'TRUE_FALSE',
        questionText: 'Najāsah khafīfah (light impurity) invalidates prayer only if it covers more than one quarter of the garment or limb.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'This is the Ḥanafī ruling. Light impurity includes the urine of ḥalāl animals and droppings of ḥarām birds. It must exceed one quarter of the area to invalidate prayer.',
        difficulty: 'HARD',
      },
      {
        unitId: unitEssentials1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which action is classified as "makrūh" in the five legal rulings (al-aḥkām al-khamsah)?',
        options: JSON.stringify(['Something rewarded if done, sinful if left', 'Something disliked but not sinful', 'Something entirely forbidden', 'Something with no reward or punishment']),
        correctAnswer: 'Something disliked but not sinful',
        explanation: 'Makrūh means disliked. The person is not sinful for doing it, but is rewarded for avoiding it. An example is eating raw garlic before attending the masjid.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitEssentials1.id,
        type: 'FILL_BLANK',
        questionText: 'In the absence of physical signs, bulūgh (puberty) is legally assumed at the age of _____ lunar years.',
        options: null,
        correctAnswer: 'fifteen',
        explanation: 'If none of the physical signs of puberty appear (nocturnal emission, coarse hair growth, or menstruation), Islamic law considers a person to have reached bulūgh at fifteen lunar years.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitEssentials1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three farāʾiḍ of ghusl?',
        options: JSON.stringify([
          'Washing hands, face, and feet',
          'Rinsing mouth, rinsing nostrils, pouring water over entire body',
          'Making intention, washing head, washing body',
          'Washing face, wiping head, washing feet'
        ]),
        correctAnswer: 'Rinsing mouth, rinsing nostrils, pouring water over entire body',
        explanation: 'The three obligatory elements of ghusl are: rinsing the mouth so water reaches every part, rinsing the nostrils, and pouring water over the entire body leaving no area dry.',
        difficulty: 'MEDIUM',
      },
    ],
  });


  // --- Essentials 1 Flashcards ---
  const essentials1Flashcards = [
    {
      front: 'Arkān al-Īmān',
      back: 'The six articles of faith: belief in Allāh, the angels, the revealed books, the messengers, the Last Day, and divine decree (qadr).',
      frontArabic: 'أَرْكَانُ الْإِيمَانِ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ʿaqīdah', 'faith', 'essentials'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Tawḥīd',
      back: 'The oneness of Allāh. Subdivided into Tawḥīd ar-Rubūbiyyah (Lordship), Tawḥīd al-Ulūhiyyah (Worship), and Tawḥīd al-Asmāʾ waṣ-Ṣifāt (Names and Attributes).',
      frontArabic: 'تَوْحِيد',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ʿaqīdah', 'tawḥīd'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Najāsah Ghālīẓah',
      back: 'Heavy impurity — includes urine, stool, flowing blood, wine, and excrement of ḥarām animals. Invalidates prayer if it exceeds the size of a dirham (~3 cm).',
      frontArabic: 'نَجَاسَةٌ غَلِيظَة',
      backArabic: null,
      category: 'rule',
      tags: ['ṭahārah', 'najāsah', 'fiqh'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Najāsah Khafīfah',
      back: 'Light impurity — includes urine of ḥalāl animals and droppings of ḥarām birds. Invalidates prayer only if it covers more than one quarter of the garment or limb.',
      frontArabic: 'نَجَاسَةٌ خَفِيفَة',
      backArabic: null,
      category: 'rule',
      tags: ['ṭahārah', 'najāsah', 'fiqh'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Farāʾiḍ of Wuḍūʾ (Ḥanafī)',
      back: 'Four obligatory elements: (1) Washing the face, (2) Washing both arms including elbows, (3) Wiping at least ¼ of the head, (4) Washing both feet including ankles.',
      frontArabic: 'فَرَائِضُ الْوُضُوء',
      backArabic: null,
      category: 'rule',
      tags: ['ṭahārah', 'wuḍūʾ', 'fiqh'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Nawāqiḍ al-Wuḍūʾ',
      back: 'Actions that break wuḍūʾ: discharge from private parts, flowing blood/pus, vomiting a mouthful, sleeping while reclining, fainting, intoxication, laughing audibly in ṣalāh.',
      frontArabic: 'نَوَاقِضُ الْوُضُوء',
      backArabic: null,
      category: 'rule',
      tags: ['ṭahārah', 'wuḍūʾ', 'fiqh'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Tayammum',
      back: 'Dry ablution using clean earth when water is unavailable or harmful. Strike hands on earth, wipe face; strike again, wipe both arms including elbows. Invalidated by availability of water.',
      frontArabic: 'تَيَمُّم',
      backArabic: null,
      category: 'rule',
      tags: ['ṭahārah', 'tayammum', 'fiqh'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Bulūgh',
      back: 'Puberty — the point at which a person becomes mukallaf (legally responsible). Signs: nocturnal emission, coarse hair growth, menstruation (girls). Default age: 15 lunar years.',
      frontArabic: 'بُلُوغ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'bulūgh', 'essentials'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Al-Aḥkām al-Khamsah',
      back: 'The five legal rulings: Farḍ (obligatory), Sunnah (recommended), Mubāḥ (permissible), Makrūh (disliked), Ḥarām (prohibited).',
      frontArabic: 'الأَحْكَامُ الْخَمْسَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'uṣūl', 'essentials'],
      difficulty: 'MEDIUM' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: essentials1Flashcards.map((fc, i) => ({
      ...fc,
      unitId: unitEssentials1.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += essentials1Flashcards.length;


  // ──────────────────────────────────────────────
  // UNIT 1: ESSENTIALS OF DĪN 2 — Ṣalāh, Duʿāʾ & Calendar
  // ──────────────────────────────────────────────

  const unitEssentials2 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Essentials of Dīn 2 — Ṣalāh, Duʿāʾ & Calendar',
      description:
        'Prayer timings and components, special prayers (Janāzah, Eid, Witr), duʿāʾ etiquette and selected supplications, the Islamic months, and a timeline of key events in the Sīrah.',
      orderIndex: 1,
      content: `
<h2>Essentials of Dīn 2 — Ṣalāh, Duʿāʾ &amp; Calendar</h2>

<h3>1. Ṣalāh Timings</h3>

<p>The five daily prayers are performed at specific times determined by the position of the sun. Understanding these timings is essential for every Muslim:</p>

<ul>
  <li><strong>Fajr:</strong> From <em>ṣubḥ ṣādiq</em> (true dawn — the horizontal light across the horizon) until just before sunrise.</li>
  <li><strong>Ẓuhr:</strong> From when the sun passes its zenith (<em>zawāl</em>) until the shadow of an object becomes twice its length plus its shadow at zawāl (Ḥanafī view).</li>
  <li><strong>ʿAṣr:</strong> From the end of Ẓuhr time until just before sunset. It is makrūh taḥrīmī to delay ʿAṣr until the sun turns orange/red.</li>
  <li><strong>Maghrib:</strong> From sunset until the disappearance of the red twilight (<em>shafaq aḥmar</em>).</li>
  <li><strong>ʿIshāʾ:</strong> From the disappearance of the red twilight until <em>ṣubḥ ṣādiq</em>. It is recommended to pray before midnight.</li>
</ul>

<h3>2. Components of Ṣalāh</h3>

<h4>2.1 Preconditions (Shurūṭ)</h4>
<p>Before ṣalāh can be valid, certain conditions must be met: ritual purity (<em>ṭahārah</em>), cleanliness of body, clothing and place, covering the <em>ʿawrah</em>, facing the <em>qiblah</em>, entering the prayer time, and making <em>niyyah</em> (intention).</p>

<h4>2.2 Arkān (Pillars) of Ṣalāh</h4>
<p>The essential integrals without which prayer is invalid: <em>takbīr taḥrīmah</em> (opening Allāhu Akbar), <em>qiyām</em> (standing), <em>qirāʾah</em> (recitation of Qurʾān), <em>rukūʿ</em> (bowing), <em>sujūd</em> (prostration), and <em>qaʿdah akhīrah</em> (final sitting for the duration of tashahhud).</p>

<h4>2.3 Wājibāt of Ṣalāh</h4>
<p>Obligatory elements whose omission requires <em>sajdah sahw</em> (prostration of forgetfulness): reciting al-Fātiḥah, joining a sūrah to it, maintaining the sequence, tranquillity in each posture (<em>ṭumaʾnīnah</em>), the first sitting in a three or four rakʿah prayer, and reciting tashahhud in both sittings.</p>

<h3>3. Special Prayers</h3>

<h4>3.1 Ṣalāh al-Witr</h4>
<p>Witr is <em>wājib</em> in the Ḥanafī madhhab. It consists of three rakʿāt performed after ʿIshāʾ. In the third rakʿah, after reciting a sūrah, one raises the hands to the ears, says Allāhu Akbar, and recites <em>Duʿāʾ al-Qunūt</em>.</p>

<p class="arabic" dir="rtl" lang="ar">اَللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ</p>
<p class="source">(Duʿāʾ al-Qunūt — first portion)</p>

<h4>3.2 Ṣalāh al-Janāzah</h4>
<p>The funeral prayer is <em>farḍ kifāyah</em> — a communal obligation. It consists of four <em>takbīrāt</em>: after the first, recite Thanāʾ; after the second, recite ṣalawāt upon the Prophet ﷺ; after the third, recite the duʿāʾ for the deceased; after the fourth, give salām on both sides. There is no rukūʿ or sujūd.</p>

<h4>3.3 Ṣalāh al-ʿĪd</h4>
<p>The Eid prayer is <em>wājib</em> and consists of two rakʿāt with six additional <em>takbīrāt</em> (three in the first rakʿah before qirāʾah and three in the second after qirāʾah). It is followed by a khuṭbah (sermon).</p>

<h3>4. Duʿāʾ — Supplication</h3>

<h4>4.1 Etiquette of Duʿāʾ</h4>
<p>The Prophet ﷺ taught us the proper manner of making duʿāʾ:</p>
<ul>
  <li>Begin with the praise of Allāh (<em>ḥamd</em>) and ṣalawāt upon the Prophet ﷺ.</li>
  <li>Face the qiblah and raise the hands.</li>
  <li>Be in a state of wuḍūʾ.</li>
  <li>Have full conviction (<em>yaqīn</em>) that Allāh will respond.</li>
  <li>Ask with humility, urgency, and sincerity.</li>
  <li>Choose blessed times: the last third of the night, between adhān and iqāmah, in sujūd, while fasting, and on the day of ʿArafah.</li>
  <li>Conclude with ṣalawāt upon the Prophet ﷺ and say Āmīn.</li>
</ul>

<h4>4.2 Selected Duʿāʾ</h4>

<p><strong>Duʿāʾ for guidance:</strong></p>
<p class="arabic" dir="rtl" lang="ar">اَللَّهُمَّ اهْدِنِي وَسَدِّدْنِي</p>
<p><em>"O Allāh, guide me and keep me on the right path."</em> (Ṣaḥīḥ Muslim)</p>

<p><strong>Duʿāʾ for protection from anxiety:</strong></p>
<p class="arabic" dir="rtl" lang="ar">اَللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ</p>
<p><em>"O Allāh, I seek refuge in You from worry, grief, incapacity, laziness, miserliness, cowardice, the burden of debt, and being overpowered by others."</em> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>5. The Islamic Calendar</h3>

<p>The Islamic (<em>Hijrī</em>) calendar is a purely lunar calendar of twelve months. Key months and their significance:</p>

<ol>
  <li><strong>Muḥarram:</strong> Sacred month. The 10th is ʿĀshūrāʾ — recommended to fast.</li>
  <li><strong>Ṣafar:</strong> No superstitions are attached to this month in Islam.</li>
  <li><strong>Rabīʿ al-Awwal:</strong> The birth month of Rasūlullāh ﷺ (12th).</li>
  <li><strong>Rabīʿ ath-Thānī</strong></li>
  <li><strong>Jumādā al-Ūlā</strong></li>
  <li><strong>Jumādā ath-Thāniyah</strong></li>
  <li><strong>Rajab:</strong> Sacred month. The night of al-Isrāʾ waʾl-Miʿrāj (27th).</li>
  <li><strong>Shaʿbān:</strong> The month in which the Prophet ﷺ fasted frequently. The 15th night (<em>Laylat al-Barāʾah</em>) is significant.</li>
  <li><strong>Ramaḍān:</strong> The month of fasting. <em>Laylat al-Qadr</em> falls in the last ten nights.</li>
  <li><strong>Shawwāl:</strong> Eid al-Fiṭr on the 1st. Six fasts of Shawwāl are highly recommended.</li>
  <li><strong>Dhū al-Qaʿdah:</strong> Sacred month and a month of Ḥajj.</li>
  <li><strong>Dhū al-Ḥijjah:</strong> Sacred month. Ḥajj on the 8th–12th. Eid al-Aḍḥā on the 10th. First ten days are blessed.</li>
</ol>

<h3>6. Key Sīrah Timeline</h3>

<p>A condensed timeline of the life of the Prophet Muḥammad ﷺ:</p>

<ul>
  <li><strong>570 CE — Year of the Elephant:</strong> Birth of the Prophet ﷺ in Makkah, in the month of Rabīʿ al-Awwal.</li>
  <li><strong>576 CE:</strong> Death of his mother Āminah; raised by grandfather ʿAbd al-Muṭṭalib, then uncle Abū Ṭālib.</li>
  <li><strong>595 CE:</strong> Marriage to Khadījah رضي الله عنها at the age of 25.</li>
  <li><strong>610 CE:</strong> First revelation in the Cave of Ḥirāʾ — the beginning of prophethood.</li>
  <li><strong>615 CE:</strong> First migration to Abyssinia (Ḥabashah) to escape persecution.</li>
  <li><strong>619 CE — Year of Grief:</strong> Death of Khadījah رضي الله عنها and Abū Ṭālib.</li>
  <li><strong>620 CE:</strong> Al-Isrāʾ waʾl-Miʿrāj — the night journey and ascension.</li>
  <li><strong>622 CE:</strong> The Hijrah to Madīnah — beginning of the Islamic calendar.</li>
  <li><strong>624 CE:</strong> Battle of Badr — the first major battle.</li>
  <li><strong>625 CE:</strong> Battle of Uḥud.</li>
  <li><strong>627 CE:</strong> Battle of the Trench (Khandaq).</li>
  <li><strong>628 CE:</strong> Treaty of Ḥudaybiyah.</li>
  <li><strong>630 CE:</strong> Conquest of Makkah (<em>Fatḥ Makkah</em>).</li>
  <li><strong>632 CE:</strong> Farewell Pilgrimage (<em>Ḥajjat al-Wadāʿ</em>) and the passing of Rasūlullāh ﷺ on 12 Rabīʿ al-Awwal.</li>
</ul>
`.trim(),
    },
  });

  console.log('✅ Created Unit 1:', unitEssentials2.title);


  // ──────────────────────────────────────────────
  // UNIT 1 QUIZ QUESTIONS
  // ──────────────────────────────────────────────

  console.log('📝 Creating Unit 1 quiz questions...');

  await prisma.question.createMany({
    data: [
      {
        unitId: unitEssentials2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'When does the time for Ẓuhr prayer end according to the Ḥanafī madhhab?',
        options: JSON.stringify(['When the shadow equals the object\'s length', 'When the shadow becomes twice the object\'s length plus its shadow at zawāl', 'At sunset', 'When the sun turns orange']),
        correctAnswer: 'When the shadow becomes twice the object\'s length plus its shadow at zawāl',
        explanation: 'In the Ḥanafī school, Ẓuhr time ends when the shadow of an object reaches twice its length plus the shadow at zawāl. This differs from the other schools which use one shadow-length.',
        difficulty: 'HARD',
      },
      {
        unitId: unitEssentials2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many takbīrāt are there in Ṣalāh al-Janāzah?',
        options: JSON.stringify(['Two', 'Three', 'Four', 'Five']),
        correctAnswer: 'Four',
        explanation: 'The funeral prayer has four takbīrāt: after the first one recite Thanāʾ, after the second recite ṣalawāt, after the third recite duʿāʾ for the deceased, after the fourth give salām.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitEssentials2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In which Islamic month does Laylat al-Qadr fall?',
        options: JSON.stringify(['Shaʿbān', 'Ramaḍān', 'Dhū al-Ḥijjah', 'Muḥarram']),
        correctAnswer: 'Ramaḍān',
        explanation: 'Laylat al-Qadr (the Night of Power) falls in the last ten nights of Ramaḍān. It is better than a thousand months as mentioned in Sūrah al-Qadr.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitEssentials2.id,
        type: 'TRUE_FALSE',
        questionText: 'Ṣalāh al-Witr is considered farḍ (obligatory) in the Ḥanafī madhhab.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Witr is wājib (necessary) in the Ḥanafī madhhab, not farḍ. The distinction is that farḍ is established by definitive evidence while wājib is established by speculative evidence. However, both must be performed.',
        difficulty: 'HARD',
      },
      {
        unitId: unitEssentials2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What occurred in 622 CE that marks the beginning of the Islamic calendar?',
        options: JSON.stringify(['The Battle of Badr', 'The Hijrah to Madīnah', 'The Conquest of Makkah', 'The first revelation']),
        correctAnswer: 'The Hijrah to Madīnah',
        explanation: 'The migration (Hijrah) of the Prophet ﷺ from Makkah to Madīnah in 622 CE marks the start of the Hijrī calendar, established during the caliphate of ʿUmar رضي الله عنه.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitEssentials2.id,
        type: 'FILL_BLANK',
        questionText: 'The Eid prayer consists of two rakʿāt with _____ additional takbīrāt.',
        options: null,
        correctAnswer: 'six',
        explanation: 'The Eid prayer has six extra takbīrāt: three in the first rakʿah before the qirāʾah, and three in the second rakʿah after the qirāʾah.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Essentials 2 Flashcards ---
  const essentials2Flashcards = [
    {
      front: 'Ṣubḥ Ṣādiq',
      back: 'True dawn — the horizontal whiteness that spreads across the horizon, marking the start of Fajr time.',
      frontArabic: 'صُبْحٌ صَادِق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ṣalāh', 'timings'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Zawāl',
      back: 'The point when the sun passes its zenith (highest point). Marks the start of Ẓuhr time. Prayer is ḥarām at the exact moment of zawāl.',
      frontArabic: 'زَوَال',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ṣalāh', 'timings'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Takbīr Taḥrīmah',
      back: 'The opening "Allāhu Akbar" that begins the prayer. It is called taḥrīmah because it makes everything other than prayer ḥarām while in ṣalāh.',
      frontArabic: 'تَكْبِيرُ التَّحْرِيمَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ṣalāh', 'arkān'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Sajdah Sahw',
      back: 'Prostration of forgetfulness — performed at the end of prayer when a wājib element is accidentally omitted. Two extra sujūd before salām.',
      frontArabic: 'سَجْدَةُ السَّهْو',
      backArabic: null,
      category: 'rule',
      tags: ['ṣalāh', 'wājibāt'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Duʿāʾ al-Qunūt',
      back: 'A special supplication recited in the third rakʿah of Witr prayer after the qirāʾah. Begins with "Allāhumma innā nastaʿīnuka wa nastaghfiruka...".',
      frontArabic: 'دُعَاءُ الْقُنُوت',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ṣalāh', 'witr', 'duʿāʾ'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Farḍ Kifāyah',
      back: 'A communal obligation — if some members of the community fulfil it, the rest are absolved. If no one fulfils it, all are sinful. Example: Ṣalāh al-Janāzah.',
      frontArabic: 'فَرْضُ كِفَايَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'uṣūl'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'ʿĀshūrāʾ',
      back: 'The 10th of Muḥarram. Fasting on this day is highly recommended (sunnah). The Prophet ﷺ also recommended fasting the 9th alongside it.',
      frontArabic: 'عَاشُورَاء',
      backArabic: null,
      category: 'vocabulary',
      tags: ['calendar', 'fasting'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Hijrah',
      back: 'The migration of the Prophet ﷺ from Makkah to Madīnah in 622 CE. It marks the beginning of the Islamic (Hijrī) calendar.',
      frontArabic: 'هِجْرَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'calendar'],
      difficulty: 'MEDIUM' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: essentials2Flashcards.map((fc, i) => ({
      ...fc,
      unitId: unitEssentials2.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += essentials2Flashcards.length;


  // ──────────────────────────────────────────────
  // UNIT 2: FAITH & BELIEF
  // ──────────────────────────────────────────────

  const unitFaith = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Faith & Belief — ʿAqīdah in Depth',
      description:
        'Deeper study of Islamic creed: the attributes of Allāh (ṣifāt), proofs of prophethood, Qurʾān preservation, the sources of Islamic law, and the four Sunnī madhāhib.',
      orderIndex: 2,
      content: `
<h2>Faith &amp; Belief — ʿAqīdah in Depth</h2>

<h3>1. The Attributes of Allāh (Ṣifāt)</h3>

<p>The scholars of Ahl as-Sunnah waʾl-Jamāʿah have categorised the attributes of Allāh into two broad categories:</p>

<h4>1.1 Ṣifāt Dhātiyyah (Essential Attributes)</h4>
<p>These are attributes that Allāh possesses inherently and eternally. They are not dependent on His will:</p>
<ul>
  <li><strong>Wujūd (Existence):</strong> Allāh exists necessarily; His existence has no beginning and no end.</li>
  <li><strong>Qidam (Pre-eternity):</strong> Allāh has always existed; there was no time when He did not exist.</li>
  <li><strong>Baqāʾ (Everlastingness):</strong> Allāh will continue to exist forever; He is not subject to destruction.</li>
  <li><strong>Waḥdāniyyah (Oneness):</strong> Allāh is unique in His essence, attributes, and actions. He has no partner.</li>
  <li><strong>Mukhālafah liʾl-Ḥawādith (Dissimilarity to creation):</strong> Allāh does not resemble His creation in any way.</li>
  <li><strong>Qiyām biʾn-Nafs (Self-subsistence):</strong> Allāh is independent of all creation; He needs nothing.</li>
</ul>

<h4>1.2 Ṣifāt Thubutiyyah (Affirmative Attributes)</h4>
<p>These are attributes established through revelation:</p>
<ul>
  <li><strong>Ḥayāh (Life):</strong> Allāh is ever-living — al-Ḥayy.</li>
  <li><strong>ʿIlm (Knowledge):</strong> Allāh knows everything — past, present, and future — al-ʿAlīm.</li>
  <li><strong>Irādah (Will):</strong> Allāh wills whatever He decrees; nothing occurs without His will.</li>
  <li><strong>Qudrah (Power):</strong> Allāh has absolute power over all things — al-Qadīr.</li>
  <li><strong>Samʿ (Hearing):</strong> Allāh hears all things — as-Samīʿ.</li>
  <li><strong>Baṣar (Sight):</strong> Allāh sees all things — al-Baṣīr.</li>
  <li><strong>Kalām (Speech):</strong> Allāh speaks, but not like the speech of creation. The Qurʾān is His uncreated speech.</li>
  <li><strong>Takwīn (Creating):</strong> Allāh brings things into existence from nothing.</li>
</ul>

<p class="arabic" dir="rtl" lang="ar">لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ</p>
<p class="source">"There is nothing like Him, and He is the All-Hearing, the All-Seeing." (Sūrah ash-Shūrā, 42:11)</p>

<h3>2. Proofs of Prophethood</h3>

<p>The prophethood of Muḥammad ﷺ is established through multiple categories of evidence:</p>

<h4>2.1 Miracles (Muʿjizāt)</h4>
<p>The greatest miracle is the <strong>Qurʾān</strong> itself — its linguistic inimitability (<em>iʿjāz</em>), its prophecies that came true, and its scientific indications. Other miracles include: the splitting of the moon, water flowing from his blessed fingers, the weeping of the tree trunk, and the feeding of multitudes from small amounts of food.</p>

<h4>2.2 Character and Conduct</h4>
<p>Even before prophethood, Muḥammad ﷺ was known as <em>aṣ-Ṣādiq al-Amīn</em> (the Truthful, the Trustworthy). His character was impeccable — he never lied, cheated, or broke a promise. His enemies acknowledged his honesty even while opposing his message.</p>

<h4>2.3 Previous Scriptures</h4>
<p>The Torah and Gospel contained descriptions and prophecies of a final prophet whose characteristics match those of Muḥammad ﷺ, as referenced in the Qurʾān (7:157).</p>

<h3>3. Preservation of the Qurʾān</h3>

<p>The Qurʾān has been preserved through a dual mechanism of oral and written transmission:</p>

<p class="arabic" dir="rtl" lang="ar">إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ</p>
<p class="source">"Indeed, it is We who sent down the reminder (Qurʾān), and indeed, We will be its guardian." (Sūrah al-Ḥijr, 15:9)</p>

<ul>
  <li><strong>Oral Preservation:</strong> Thousands of companions memorised the Qurʾān during the lifetime of the Prophet ﷺ. This tradition of <em>ḥifẓ</em> continues unbroken to this day, with millions of <em>ḥuffāẓ</em> worldwide.</li>
  <li><strong>Written Compilation:</strong> Verses were written on various materials during the Prophet's lifetime. Abū Bakr رضي الله عنه compiled them into a single manuscript (<em>muṣḥaf</em>). ʿUthmān رضي الله عنه standardised the script and distributed copies to major centres.</li>
  <li><strong>Chain of Transmission (Isnād):</strong> Every recitation can be traced back through an unbroken chain to the Prophet ﷺ himself, a feature unique to the Qurʾān among world scriptures.</li>
</ul>

<h3>4. Sources of Islamic Law</h3>

<p>Islamic jurisprudence (<em>fiqh</em>) derives its rulings from four agreed-upon sources:</p>

<ol>
  <li><strong>The Qurʾān:</strong> The primary source — the literal word of Allāh revealed to the Prophet ﷺ.</li>
  <li><strong>The Sunnah:</strong> The sayings, actions, and approvals of the Prophet ﷺ, preserved in collections of ḥadīth.</li>
  <li><strong>Ijmāʿ (Consensus):</strong> The unanimous agreement of the scholars of a given era on a legal ruling.</li>
  <li><strong>Qiyās (Analogical Reasoning):</strong> Deriving a ruling for a new issue by analogy with an existing ruling that shares the same underlying cause (<em>ʿillah</em>).</li>
</ol>

<h3>5. The Four Sunnī Madhāhib</h3>

<p>The four established schools of Islamic jurisprudence are all valid and authoritative:</p>

<ul>
  <li><strong>Ḥanafī:</strong> Founded by Imām Abū Ḥanīfah (d. 150 AH). Known for extensive use of qiyās and raʾy (reasoned opinion). Predominant in Turkey, Central Asia, South Asia, and parts of the Middle East.</li>
  <li><strong>Mālikī:</strong> Founded by Imām Mālik ibn Anas (d. 179 AH). Gives special weight to the practice of the people of Madīnah (<em>ʿamal ahl al-Madīnah</em>). Predominant in North and West Africa and parts of the Gulf.</li>
  <li><strong>Shāfiʿī:</strong> Founded by Imām ash-Shāfiʿī (d. 204 AH). Known for systematic methodology of uṣūl al-fiqh. Predominant in East Africa, Southeast Asia, and parts of the Middle East.</li>
  <li><strong>Ḥanbalī:</strong> Founded by Imām Aḥmad ibn Ḥanbal (d. 241 AH). Known for strong reliance on ḥadīth texts. Predominant in Saudi Arabia and parts of the Gulf.</li>
</ul>

<p>The differences between the madhāhib are in subsidiary matters (<em>furūʿ</em>), not in the fundamentals of faith. Following a madhhab provides consistency and guards against cherry-picking rulings.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 2:', unitFaith.title);


  // ──────────────────────────────────────────────
  // UNIT 2 QUIZ QUESTIONS
  // ──────────────────────────────────────────────

  console.log('📝 Creating Unit 2 quiz questions...');

  await prisma.question.createMany({
    data: [
      {
        unitId: unitFaith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is a Ṣifah Dhātiyyah (essential attribute) of Allāh?',
        options: JSON.stringify(['ʿIlm (Knowledge)', 'Qidam (Pre-eternity)', 'Qudrah (Power)', 'Kalām (Speech)']),
        correctAnswer: 'Qidam (Pre-eternity)',
        explanation: 'Qidam (pre-eternity) is a ṣifah dhātiyyah, meaning Allāh has always existed with no beginning. The others (ʿIlm, Qudrah, Kalām) are ṣifāt thubūtiyyah (affirmative attributes).',
        difficulty: 'HARD',
      },
      {
        unitId: unitFaith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the greatest miracle (muʿjizah) of the Prophet Muḥammad ﷺ?',
        options: JSON.stringify(['Splitting of the moon', 'Water flowing from his fingers', 'The Qurʾān', 'The night journey (Isrāʾ)']),
        correctAnswer: 'The Qurʾān',
        explanation: 'While all are miracles, the Qurʾān is considered the greatest and most enduring miracle due to its linguistic inimitability (iʿjāz), fulfilled prophecies, and eternal preservation.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFaith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who compiled the Qurʾān into a single manuscript (muṣḥaf) after the Prophet ﷺ?',
        options: JSON.stringify(['ʿUmar ibn al-Khaṭṭāb', 'ʿUthmān ibn ʿAffān', 'Abū Bakr aṣ-Ṣiddīq', 'ʿAlī ibn Abī Ṭālib']),
        correctAnswer: 'Abū Bakr aṣ-Ṣiddīq',
        explanation: 'Abū Bakr رضي الله عنه ordered the compilation after the Battle of Yamāmah. Later, ʿUthmān رضي الله عنه standardised the script and distributed copies.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFaith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is qiyās in Islamic jurisprudence?',
        options: JSON.stringify(['Consensus of scholars', 'Analogical reasoning', 'Independent reasoning', 'Textual interpretation']),
        correctAnswer: 'Analogical reasoning',
        explanation: 'Qiyās is deriving a ruling for a new issue by analogy with an existing ruling that shares the same underlying cause (ʿillah). It is the fourth source of Islamic law.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFaith.id,
        type: 'TRUE_FALSE',
        questionText: 'Imām Abū Ḥanīfah is known for extensive use of qiyās and reasoned opinion (raʾy).',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Ḥanafī school is indeed known for its extensive use of analogical reasoning (qiyās) and reasoned opinion (raʾy), alongside the Qurʾān and Sunnah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFaith.id,
        type: 'FILL_BLANK',
        questionText: 'The Mālikī madhhab gives special weight to the practice of the people of _____ (ʿamal ahl al-_____).',
        options: null,
        correctAnswer: 'Madīnah',
        explanation: 'Imām Mālik considered the living practice of the people of Madīnah as a source of law, since they were closest in time and place to the prophetic tradition.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Faith Flashcards ---
  const faithFlashcards = [
    {
      front: 'Ṣifāt Dhātiyyah',
      back: 'Essential attributes of Allāh: Wujūd (existence), Qidam (pre-eternity), Baqāʾ (everlastingness), Waḥdāniyyah (oneness), Mukhālafah liʾl-Ḥawādith (dissimilarity), Qiyām biʾn-Nafs (self-subsistence).',
      frontArabic: 'صِفَاتٌ ذَاتِيَّة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ʿaqīdah', 'ṣifāt'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Ṣifāt Thubūtiyyah',
      back: 'Affirmative attributes of Allāh established through revelation: Ḥayāh, ʿIlm, Irādah, Qudrah, Samʿ, Baṣar, Kalām, Takwīn.',
      frontArabic: 'صِفَاتٌ ثُبُوتِيَّة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ʿaqīdah', 'ṣifāt'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Iʿjāz al-Qurʾān',
      back: 'The inimitability of the Qurʾān — the fact that no human or jinn can produce anything like it, even a single sūrah. This serves as proof of its divine origin.',
      frontArabic: 'إِعْجَازُ الْقُرْآن',
      backArabic: null,
      category: 'vocabulary',
      tags: ['qurʾān', 'ʿaqīdah'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ijmāʿ',
      back: 'Consensus — the unanimous agreement of the qualified scholars of a given era on a legal ruling. It is the third source of Islamic law after the Qurʾān and Sunnah.',
      frontArabic: 'إِجْمَاع',
      backArabic: null,
      category: 'vocabulary',
      tags: ['uṣūl', 'fiqh'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Qiyās',
      back: 'Analogical reasoning — deriving a ruling for a new issue by analogy with an existing ruling sharing the same underlying cause (ʿillah). The fourth source of Islamic law.',
      frontArabic: 'قِيَاس',
      backArabic: null,
      category: 'vocabulary',
      tags: ['uṣūl', 'fiqh'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'The Four Madhāhib',
      back: 'Ḥanafī (Abū Ḥanīfah, d. 150 AH), Mālikī (Mālik ibn Anas, d. 179 AH), Shāfiʿī (ash-Shāfiʿī, d. 204 AH), Ḥanbalī (Aḥmad ibn Ḥanbal, d. 241 AH).',
      frontArabic: 'الْمَذَاهِبُ الأَرْبَعَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'madhāhib'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ḥifẓ al-Qurʾān',
      back: 'Memorisation of the Qurʾān. An unbroken tradition since the Prophet ﷺ. Millions of ḥuffāẓ worldwide ensure the Qurʾān is preserved orally alongside the written text.',
      frontArabic: 'حِفْظُ الْقُرْآن',
      backArabic: null,
      category: 'vocabulary',
      tags: ['qurʾān', 'preservation'],
      difficulty: 'MEDIUM' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: faithFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitFaith.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += faithFlashcards.length;


  // ──────────────────────────────────────────────
  // UNIT 3: DEVOTIONAL PRACTICE
  // ──────────────────────────────────────────────

  const unitDevotional = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Devotional Practice — Deepening Worship',
      description:
        'Khushūʿ in prayer, understanding the words of ṣalāh, nawāfil prayers, the traveller\'s prayer, Jumuʿah, fasting in detail, and the rites of Ḥajj and ʿUmrah.',
      orderIndex: 3,
      content: `
<h2>Devotional Practice — Deepening Worship</h2>

<h3>1. Khushūʿ — Humility and Focus in Prayer</h3>

<p>Khushūʿ is the heart of ṣalāh. Without it, prayer becomes mere physical movement. Allāh describes the believers:</p>

<p class="arabic" dir="rtl" lang="ar">قَدْ أَفْلَحَ الْمُؤْمِنُونَ ٭ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ</p>
<p class="source">"Successful indeed are the believers — those who are humble in their prayers." (Sūrah al-Muʾminūn, 23:1-2)</p>

<p>Practical steps to develop khushūʿ include:</p>
<ul>
  <li>Understanding the meaning of what is recited in prayer.</li>
  <li>Preparing mentally before standing for ṣalāh — putting aside distractions.</li>
  <li>Focusing the gaze on the place of sujūd.</li>
  <li>Reciting slowly and with reflection (<em>tadabbur</em>).</li>
  <li>Remembering that one is standing before Allāh, the Lord of all creation.</li>
  <li>Varying the sūrahs recited to maintain attentiveness.</li>
</ul>

<h3>2. Understanding the Words of Ṣalāh</h3>

<h4>2.1 Thanāʾ (Opening Supplication)</h4>
<p class="arabic" dir="rtl" lang="ar">سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ</p>
<p><em>"Glory be to You O Allāh, and praise be to You. Blessed is Your name, exalted is Your majesty, and there is no god besides You."</em></p>

<h4>2.2 Tasbīḥ of Rukūʿ</h4>
<p class="arabic" dir="rtl" lang="ar">سُبْحَانَ رَبِّيَ الْعَظِيمِ</p>
<p><em>"Glory be to my Lord, the Almighty."</em> — Said three times in rukūʿ, glorifying Allāh's greatness while in a posture of humility.</p>

<h4>2.3 Tasbīḥ of Sujūd</h4>
<p class="arabic" dir="rtl" lang="ar">سُبْحَانَ رَبِّيَ الأَعْلَىٰ</p>
<p><em>"Glory be to my Lord, the Most High."</em> — Said three times in sujūd, the position closest to Allāh.</p>

<h4>2.4 Tashahhud</h4>
<p class="arabic" dir="rtl" lang="ar">التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ</p>
<p><em>"All verbal, physical, and monetary worship is for Allāh. Peace be upon you, O Prophet, and the mercy of Allāh and His blessings. Peace be upon us and upon the righteous servants of Allāh."</em></p>

<h3>3. Nawāfil Prayers</h3>

<p>Voluntary prayers that draw a servant closer to Allāh and compensate for deficiencies in the obligatory prayers:</p>

<ul>
  <li><strong>Sunan Rawātib:</strong> The emphasised sunnah prayers associated with the farḍ: 2 before Fajr, 4 before and 2 after Ẓuhr, 2 after Maghrib, 2 after ʿIshāʾ.</li>
  <li><strong>Ṣalāh al-Ḍuḥā:</strong> The forenoon prayer, prayed between sunrise and zawāl. Minimum 2 rakʿāt, maximum 12.</li>
  <li><strong>Tahajjud:</strong> The night prayer performed after sleeping and waking in the last third of the night. One of the most virtuous voluntary acts.</li>
  <li><strong>Ṣalāh al-Ishrāq:</strong> Two rakʿāt prayed approximately 15-20 minutes after sunrise.</li>
  <li><strong>Ṣalāh al-Awwābīn:</strong> Six rakʿāt prayed after the sunnah of Maghrib.</li>
  <li><strong>Taḥiyyat al-Masjid:</strong> Two rakʿāt upon entering the masjid before sitting down.</li>
</ul>

<h3>4. The Traveller's Prayer (Ṣalāh al-Musāfir)</h3>

<p>When a person intends to travel a distance of approximately 48 miles (77 km) or more and intends to stay less than 15 days at the destination, they become a <em>musāfir</em> (traveller) in the Ḥanafī madhhab:</p>

<ul>
  <li>Four-rakʿah farḍ prayers are shortened (<em>qaṣr</em>) to two rakʿāt (Ẓuhr, ʿAṣr, ʿIshāʾ).</li>
  <li>Fajr and Maghrib remain unchanged.</li>
  <li>Sunnah prayers are generally not prayed while travelling, except the sunnah of Fajr and Witr.</li>
  <li>If a traveller prays behind a resident (<em>muqīm</em>) imām, they must complete the full four rakʿāt.</li>
</ul>

<h3>5. Jumuʿah (Friday Prayer)</h3>

<p>The Friday prayer replaces Ẓuhr for adult, male, free, resident Muslims. It consists of a khuṭbah (sermon) followed by two rakʿāt of prayer led by the imām. Key points:</p>

<ul>
  <li>It is ḥarām to buy, sell, or engage in commerce after the second adhān of Jumuʿah.</li>
  <li>Recommended acts include: ghusl, wearing the best clothes, using fragrance (<em>ʿiṭr</em>), arriving early, and making abundant duʿāʾ — especially in the last hour before Maghrib.</li>
  <li>The khuṭbah is a condition for the validity of Jumuʿah; listening in silence is wājib.</li>
</ul>

<h3>6. Ṣawm (Fasting) in Detail</h3>

<h4>6.1 Conditions of Obligation</h4>
<p>Fasting Ramaḍān is farḍ upon every Muslim who is: adult (bāligh), sane (ʿāqil), and able (not sick, travelling, or — for women — in menstruation or post-natal bleeding).</p>

<h4>6.2 Actions that Break the Fast</h4>
<p>Eating, drinking, or marital relations intentionally. Swallowing items that reach the stomach or brain cavity. Vomiting intentionally (a mouthful). If done forgetfully, the fast is not broken.</p>

<h4>6.3 Fidyah and Kaffārah</h4>
<p><em>Fidyah</em> is given by those who cannot fast (elderly, chronically ill) — feeding one poor person per day. <em>Kaffārah</em> is the penalty for deliberately breaking a fast without valid reason: freeing a slave (if applicable), or fasting 60 consecutive days, or feeding 60 poor people.</p>

<h3>7. Ḥajj and ʿUmrah</h3>

<h4>7.1 The Rites of Ḥajj</h4>
<p>Ḥajj takes place on the 8th–12th of Dhū al-Ḥijjah. The essential rites include:</p>
<ol>
  <li><strong>Iḥrām:</strong> Entering the sacred state at the mīqāt with intention and the talbiyah.</li>
  <li><strong>Wuqūf at ʿArafah:</strong> Standing at the plain of ʿArafah on the 9th of Dhū al-Ḥijjah — the most critical rite.</li>
  <li><strong>Muzdalifah:</strong> Spending the night and collecting pebbles.</li>
  <li><strong>Ramī (stoning):</strong> Casting pebbles at the Jamarāt in Minā.</li>
  <li><strong>Sacrifice (Uḍḥiyah):</strong> Slaughtering an animal on the day of Eid al-Aḍḥā.</li>
  <li><strong>Ḥalq/Taqṣīr:</strong> Shaving or trimming the hair to exit iḥrām.</li>
  <li><strong>Ṭawāf al-Ifāḍah:</strong> The obligatory ṭawāf of the Kaʿbah.</li>
  <li><strong>Saʿī:</strong> Walking between Ṣafā and Marwah seven times.</li>
</ol>

<p class="arabic" dir="rtl" lang="ar">لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ ، لَا شَرِيكَ لَكَ</p>
<p class="source">(The Talbiyah — recited throughout Ḥajj)</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 3:', unitDevotional.title);


  // ──────────────────────────────────────────────
  // UNIT 3 QUIZ QUESTIONS
  // ──────────────────────────────────────────────

  console.log('📝 Creating Unit 3 quiz questions...');

  await prisma.question.createMany({
    data: [
      {
        unitId: unitDevotional.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the most critical rite of Ḥajj, without which the pilgrimage is invalid?',
        options: JSON.stringify(['Ṭawāf al-Ifāḍah', 'Wuqūf at ʿArafah', 'Ramī of the Jamarāt', 'Saʿī between Ṣafā and Marwah']),
        correctAnswer: 'Wuqūf at ʿArafah',
        explanation: 'Standing at ʿArafah on the 9th of Dhū al-Ḥijjah is the essential rite of Ḥajj. The Prophet ﷺ said: "Ḥajj is ʿArafah."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitDevotional.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the Ḥanafī madhhab, a traveller (musāfir) shortens which prayers?',
        options: JSON.stringify(['All five prayers', 'Only Ẓuhr and ʿAṣr', 'Ẓuhr, ʿAṣr, and ʿIshāʾ', 'Only Ẓuhr and ʿIshāʾ']),
        correctAnswer: 'Ẓuhr, ʿAṣr, and ʿIshāʾ',
        explanation: 'The four-rakʿah farḍ prayers (Ẓuhr, ʿAṣr, ʿIshāʾ) are shortened to two rakʿāt. Fajr (2 rakʿāt) and Maghrib (3 rakʿāt) remain unchanged.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitDevotional.id,
        type: 'TRUE_FALSE',
        questionText: 'If a person eats or drinks forgetfully while fasting, their fast is broken and they must make up the day.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'If a fasting person eats or drinks forgetfully, their fast remains valid. The Prophet ﷺ said: "If someone forgets and eats or drinks, let them complete their fast, for it was Allāh who fed and gave them drink." (Bukhārī & Muslim)',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitDevotional.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the kaffārah for deliberately breaking a Ramaḍān fast without valid reason?',
        options: JSON.stringify(['Feeding 10 poor people', 'Fasting 30 consecutive days', 'Freeing a slave, or fasting 60 consecutive days, or feeding 60 poor people', 'Making up the fast only']),
        correctAnswer: 'Freeing a slave, or fasting 60 consecutive days, or feeding 60 poor people',
        explanation: 'The kaffārah is severe due to the sanctity of Ramaḍān: freeing a slave (if applicable), or fasting 60 consecutive days, or feeding 60 poor people.',
        difficulty: 'HARD',
      },
      {
        unitId: unitDevotional.id,
        type: 'FILL_BLANK',
        questionText: 'The tasbīḥ recited in sujūd is: "Subḥāna Rabbiya al-_____".',
        options: null,
        correctAnswer: 'Aʿlā',
        explanation: '"Subḥāna Rabbiya al-Aʿlā" means "Glory be to my Lord, the Most High." It is recited three times in each sujūd.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitDevotional.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is NOT one of the sunan rawātib (emphasised sunnah prayers)?',
        options: JSON.stringify(['2 rakʿāt before Fajr', '4 rakʿāt before ʿAṣr', '2 rakʿāt after Maghrib', '2 rakʿāt after ʿIshāʾ']),
        correctAnswer: '4 rakʿāt before ʿAṣr',
        explanation: 'The sunan rawātib include: 2 before Fajr, 4 before Ẓuhr, 2 after Ẓuhr, 2 after Maghrib, and 2 after ʿIshāʾ. The 4 before ʿAṣr are sunnah ghayr muʾakkadah (non-emphasised).',
        difficulty: 'HARD',
      },
    ],
  });

  // --- Devotional Flashcards ---
  const devotionalFlashcards = [
    {
      front: 'Khushūʿ',
      back: 'Humility, focus, and presence of heart in prayer. The soul of ṣalāh — without it, prayer is mere physical movement.',
      frontArabic: 'خُشُوع',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ṣalāh', 'spirituality'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Sunan Rawātib',
      back: 'Emphasised sunnah prayers paired with the farḍ: 2 before Fajr, 4 before + 2 after Ẓuhr, 2 after Maghrib, 2 after ʿIshāʾ. Total: 12 rakʿāt daily.',
      frontArabic: 'سُنَنٌ رَوَاتِب',
      backArabic: null,
      category: 'rule',
      tags: ['ṣalāh', 'nawāfil'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Qaṣr (Shortening Prayer)',
      back: 'Travellers (48+ miles, staying <15 days in Ḥanafī view) shorten 4-rakʿah prayers to 2. Fajr and Maghrib are unaffected.',
      frontArabic: 'قَصْر',
      backArabic: null,
      category: 'rule',
      tags: ['ṣalāh', 'travel'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Wuqūf at ʿArafah',
      back: 'Standing at the plain of ʿArafah on the 9th of Dhū al-Ḥijjah — the most essential rite of Ḥajj. "Ḥajj is ʿArafah."',
      frontArabic: 'وُقُوفُ عَرَفَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ḥajj', 'rites'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Fidyah vs Kaffārah',
      back: 'Fidyah: compensation for inability to fast (feed one poor person/day). Kaffārah: penalty for deliberately breaking a fast (fast 60 days or feed 60 poor people).',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ṣawm', 'fiqh'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Talbiyah',
      back: '"Labbayk Allāhumma labbayk..." — the chant recited by pilgrims throughout Ḥajj, expressing response to Allāh\'s call.',
      frontArabic: 'تَلْبِيَة',
      backArabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ',
      category: 'vocabulary',
      tags: ['ḥajj', 'duʿāʾ'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Tahajjud',
      back: 'The night prayer performed after sleeping and waking in the last third of the night. One of the most virtuous voluntary acts of worship.',
      frontArabic: 'تَهَجُّد',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ṣalāh', 'nawāfil', 'night'],
      difficulty: 'MEDIUM' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: devotionalFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitDevotional.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += devotionalFlashcards.length;


  // ──────────────────────────────────────────────
  // UNIT 4: IDENTITY & CHARACTER
  // ──────────────────────────────────────────────

  const unitIdentity = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Identity & Character — The Muslim Self',
      description:
        'Building a strong Muslim identity: noble character (akhlāq), Muslim contributions to civilisation, mental health and well-being, the prophetic example, and self-reformation (tazkiyah).',
      orderIndex: 4,
      content: `
<h2>Identity &amp; Character — The Muslim Self</h2>

<h3>1. Noble Character (Akhlāq)</h3>

<p>The Prophet ﷺ defined his mission in terms of character:</p>

<p class="arabic" dir="rtl" lang="ar">إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ</p>
<p class="source">"I was only sent to perfect noble character." (Muwaṭṭaʾ of Imām Mālik)</p>

<p>Islam does not merely prescribe rituals; it demands excellence of character. The believer with the most complete faith is the one with the best character:</p>

<p class="arabic" dir="rtl" lang="ar">أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا</p>
<p class="source">(Tirmidhī, from Abū Hurayrah رضي الله عنه)</p>

<h4>Core Character Traits in Islam</h4>
<ul>
  <li><strong>Ṣidq (Truthfulness):</strong> Being honest in speech, action, and intention. The Prophet ﷺ said truthfulness leads to righteousness and righteousness leads to Jannah.</li>
  <li><strong>Amānah (Trustworthiness):</strong> Fulfilling responsibilities, keeping promises, and safeguarding what is entrusted to you. The absence of amānah is a sign of hypocrisy.</li>
  <li><strong>Ṣabr (Patience):</strong> Enduring difficulties with steadfastness, restraining oneself from sin, and persisting in obedience to Allāh.</li>
  <li><strong>Shukr (Gratitude):</strong> Recognising and appreciating Allāh's blessings through the heart, tongue, and limbs.</li>
  <li><strong>Tawāḍuʿ (Humility):</strong> Lowering oneself before Allāh and treating others with respect regardless of their status.</li>
  <li><strong>ʿAdl (Justice):</strong> Being fair in all dealings, even against oneself or one's relatives.</li>
  <li><strong>Raḥmah (Mercy):</strong> Showing compassion to all of Allāh's creation — humans, animals, and the environment.</li>
  <li><strong>Ḥilm (Forbearance):</strong> Controlling anger, responding to provocation with calmness, and forgiving others.</li>
</ul>

<h3>2. Muslim Contributions to Civilisation</h3>

<p>Muslims have made profound contributions to human knowledge and civilisation:</p>

<ul>
  <li><strong>Mathematics:</strong> Al-Khwārizmī (d. ~850 CE) developed algebra (<em>al-jabr</em>) and algorithms. The numerals we use globally are Arabic-Hindu numerals transmitted through Muslim scholars.</li>
  <li><strong>Medicine:</strong> Ibn Sīnā (d. 1037 CE) wrote <em>al-Qānūn fī al-Ṭibb</em> (The Canon of Medicine), a standard medical textbook in Europe for centuries. Az-Zahrāwī pioneered surgical instruments.</li>
  <li><strong>Optics:</strong> Ibn al-Haytham (d. 1040 CE) is considered the father of modern optics. His <em>Kitāb al-Manāẓir</em> laid the foundation for the scientific method.</li>
  <li><strong>Geography:</strong> Al-Idrīsī (d. 1165 CE) created one of the most advanced world maps of the medieval period.</li>
  <li><strong>Architecture:</strong> The Alhambra in Spain, the Blue Mosque in Istanbul, and the great mosques of Córdoba and Isfahan showcase Muslim architectural mastery.</li>
  <li><strong>Education:</strong> The University of al-Qarawiyyīn in Fez (Morocco), founded in 859 CE by Fāṭimah al-Fihrī, is recognised as the oldest continuously operating university in the world.</li>
</ul>

<p>These contributions were not accidental — they flowed from the Islamic emphasis on seeking knowledge as a religious duty:</p>

<p class="arabic" dir="rtl" lang="ar">طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَىٰ كُلِّ مُسْلِمٍ</p>
<p class="source">"Seeking knowledge is an obligation upon every Muslim." (Ibn Mājah)</p>

<h3>3. Mental Health and Well-being</h3>

<p>Islam takes a holistic approach to mental health, recognising the connection between spiritual well-being and psychological health:</p>

<ul>
  <li><strong>Remembrance of Allāh (Dhikr):</strong> "Verily, in the remembrance of Allāh do hearts find rest." (Sūrah ar-Raʿd, 13:28). Regular dhikr, duʿāʾ, and recitation of the Qurʾān are powerful tools for managing anxiety and stress.</li>
  <li><strong>Community Support:</strong> The Muslim community (<em>ummah</em>) is described as one body — when one part suffers, the whole body responds. Seeking help from others is not a sign of weakness.</li>
  <li><strong>Professional Help:</strong> Seeking medical and psychological help is entirely permissible and encouraged. The Prophet ﷺ said: "Make use of medical treatment, for Allāh has not created a disease without creating a cure for it." (Abū Dāwūd)</li>
  <li><strong>Balancing Dunyā and Ākhirah:</strong> Islam encourages a balanced approach to worldly and spiritual life. Excessive focus on either can lead to distress.</li>
  <li><strong>The Prophetic Example:</strong> The Prophet ﷺ himself experienced grief and sadness. The Year of Grief (619 CE) was one of the most difficult periods of his life. He sought comfort in prayer and duʿāʾ.</li>
</ul>

<h3>4. The Prophetic Example in Character</h3>

<p>The Prophet ﷺ is the ultimate model for the Muslim:</p>

<p class="arabic" dir="rtl" lang="ar">لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ</p>
<p class="source">"There has certainly been for you in the Messenger of Allāh an excellent example." (Sūrah al-Aḥzāb, 33:21)</p>

<p>Specific examples of his character include: his gentleness with children, his forgiveness of those who wronged him (including the people of Ṭāʾif), his fair treatment of non-Muslims, his consultation (<em>shūrā</em>) with companions, his simplicity in living, and his devotion in worship despite already being forgiven.</p>

<h3>5. Self-Reformation (Tazkiyah)</h3>

<p><em>Tazkiyah an-nafs</em> (purification of the soul) is a Qurʾānic concept central to spiritual growth:</p>

<p class="arabic" dir="rtl" lang="ar">قَدْ أَفْلَحَ مَنْ زَكَّاهَا ٭ وَقَدْ خَابَ مَنْ دَسَّاهَا</p>
<p class="source">"Successful is the one who purifies it (the soul), and ruined is the one who corrupts it." (Sūrah ash-Shams, 91:9-10)</p>

<p>Practical steps in tazkiyah include: <em>murāqabah</em> (self-awareness that Allāh is watching), <em>muḥāsabah</em> (daily self-accounting of deeds), <em>mujāhadah</em> (striving against the lower self), seeking righteous company, regular tawbah (repentance), and increasing voluntary acts of worship.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 4:', unitIdentity.title);


  // ──────────────────────────────────────────────
  // UNIT 4 QUIZ QUESTIONS
  // ──────────────────────────────────────────────

  console.log('📝 Creating Unit 4 quiz questions...');

  await prisma.question.createMany({
    data: [
      {
        unitId: unitIdentity.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ say about the purpose of his mission in relation to character?',
        options: JSON.stringify(['"I was sent to teach the Qurʾān"', '"I was sent to establish prayer"', '"I was only sent to perfect noble character"', '"I was sent to conquer nations"']),
        correctAnswer: '"I was only sent to perfect noble character"',
        explanation: 'This famous ḥadīth (Muwaṭṭaʾ of Imām Mālik) highlights that perfecting character was central to the prophetic mission.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitIdentity.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who wrote al-Qānūn fī al-Ṭibb (The Canon of Medicine)?',
        options: JSON.stringify(['Al-Khwārizmī', 'Ibn al-Haytham', 'Ibn Sīnā', 'Az-Zahrāwī']),
        correctAnswer: 'Ibn Sīnā',
        explanation: 'Ibn Sīnā (Avicenna, d. 1037 CE) wrote The Canon of Medicine, which served as a standard medical textbook in European universities for centuries.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitIdentity.id,
        type: 'TRUE_FALSE',
        questionText: 'Seeking professional psychological help is discouraged in Islam because one should rely solely on duʿāʾ.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Islam encourages seeking medical and psychological help. The Prophet ﷺ said: "Make use of medical treatment, for Allāh has not created a disease without creating a cure." (Abū Dāwūd)',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitIdentity.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does tazkiyah an-nafs mean?',
        options: JSON.stringify(['Memorisation of the Qurʾān', 'Purification of the soul', 'Knowledge of ḥadīth', 'Physical cleanliness']),
        correctAnswer: 'Purification of the soul',
        explanation: 'Tazkiyah an-nafs refers to the purification and spiritual refinement of the soul, a central concept in the Qurʾān (91:9-10) and Islamic spirituality.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitIdentity.id,
        type: 'FILL_BLANK',
        questionText: 'The University of al-Qarawiyyīn in Fez, Morocco, founded in 859 CE by _____ al-Fihrī, is the oldest continuously operating university.',
        options: null,
        correctAnswer: 'Fāṭimah',
        explanation: 'Fāṭimah al-Fihrī founded the University of al-Qarawiyyīn, demonstrating the important role of women in Islamic education history.',
        difficulty: 'HARD',
      },
      {
        unitId: unitIdentity.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is NOT listed as a core character trait in Islamic akhlāq?',
        options: JSON.stringify(['Ṣabr (Patience)', 'Kibr (Pride)', 'Tawāḍuʿ (Humility)', 'ʿAdl (Justice)']),
        correctAnswer: 'Kibr (Pride)',
        explanation: 'Kibr (pride/arrogance) is condemned in Islam. The Prophet ﷺ said: "No one who has an atom\'s weight of pride in their heart will enter Paradise." (Muslim)',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Identity Flashcards ---
  const identityFlashcards = [
    {
      front: 'Ṣidq',
      back: 'Truthfulness in speech, action, and intention. The Prophet ﷺ said truthfulness leads to righteousness, which leads to Jannah.',
      frontArabic: 'صِدْق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'character'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Amānah',
      back: 'Trustworthiness — fulfilling responsibilities, keeping promises, safeguarding what is entrusted. Its absence is a sign of hypocrisy (nifāq).',
      frontArabic: 'أَمَانَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'character'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Tazkiyah an-Nafs',
      back: 'Purification of the soul through: murāqabah (self-awareness), muḥāsabah (self-accounting), mujāhadah (striving against the nafs), good company, tawbah, and extra worship.',
      frontArabic: 'تَزْكِيَةُ النَّفْس',
      backArabic: null,
      category: 'vocabulary',
      tags: ['spirituality', 'tazkiyah'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Al-Khwārizmī',
      back: 'Muslim mathematician (d. ~850 CE) who developed algebra (al-jabr) and algorithms. His name gives us the English word "algorithm".',
      frontArabic: 'الخَوَارِزْمِي',
      backArabic: null,
      category: 'vocabulary',
      tags: ['history', 'contributions'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ḥilm',
      back: 'Forbearance — controlling anger, responding to provocation with calmness, and forgiving others. A key quality praised in the Qurʾān and Sunnah.',
      frontArabic: 'حِلْم',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'character'],
      difficulty: 'MEDIUM' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: identityFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitIdentity.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += identityFlashcards.length;


  // ──────────────────────────────────────────────
  // UNIT 5: LIVING AS A MUSLIM
  // ──────────────────────────────────────────────

  const unitLiving = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Living as a Muslim — Family & Community',
      description:
        'Rights of parents and family, community responsibilities, the role of the masjid, marriage in Islam, and death, burial, and bereavement.',
      orderIndex: 5,
      content: `
<h2>Living as a Muslim — Family &amp; Community</h2>

<h3>1. Rights of Parents</h3>

<p>Islam places the rights of parents immediately after the rights of Allāh:</p>

<p class="arabic" dir="rtl" lang="ar">وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا</p>
<p class="source">"Your Lord has decreed that you worship none but Him, and that you be excellent to your parents." (Sūrah al-Isrāʾ, 17:23)</p>

<ul>
  <li><strong>Obedience:</strong> Obeying parents in all that does not contradict Islamic law.</li>
  <li><strong>Kindness:</strong> Speaking gently, never saying "uff" (an expression of annoyance), and serving them with love.</li>
  <li><strong>Financial Support:</strong> Providing for their needs, especially in old age.</li>
  <li><strong>Duʿāʾ:</strong> Supplicating for them consistently: "Rabbir-ḥam-humā kamā rabbayānī ṣaghīrā" — "My Lord, have mercy on them as they raised me when I was small."</li>
  <li><strong>After Death:</strong> Making duʿāʾ for them, fulfilling their bequests, maintaining their friendships, and giving charity on their behalf.</li>
</ul>

<h4>The Mother's Special Status</h4>
<p>A man asked the Prophet ﷺ: "Who is most deserving of my good companionship?" He said: "Your mother." The man asked: "Then who?" He said: "Your mother." Again: "Then who?" He said: "Your mother." The fourth time he said: "Then your father." (Bukhārī & Muslim)</p>

<h3>2. Rights of Family Members</h3>

<ul>
  <li><strong>Spouses:</strong> Mutual respect, kindness, consultation, and fulfilment of rights. The Prophet ﷺ said: "The best of you are those who are best to their families." (Tirmidhī)</li>
  <li><strong>Children:</strong> Rights to a good name, education, Islamic upbringing, fair treatment between siblings, and love and affection.</li>
  <li><strong>Siblings and Extended Family:</strong> Maintaining ties of kinship (<em>ṣilah ar-raḥim</em>) is a religious duty. Severing family ties is among the major sins.</li>
</ul>

<h3>3. Community Responsibilities</h3>

<p>The Muslim is not an isolated individual but an active member of a broader community:</p>

<ul>
  <li><strong>Rights of Neighbours:</strong> The Prophet ﷺ said Jibrīl kept advising him about the neighbour until he thought the neighbour would be given a share of inheritance. (Bukhārī & Muslim)</li>
  <li><strong>Visiting the Sick:</strong> A right of one Muslim over another. The Prophet ﷺ described visiting the sick as walking in the gardens of Jannah.</li>
  <li><strong>Attending Funerals:</strong> Part of the communal obligation and a means of earning great reward.</li>
  <li><strong>Enjoining Good and Forbidding Evil:</strong> A collective duty of the Muslim community, done with wisdom and gentle counsel.</li>
  <li><strong>Supporting the Vulnerable:</strong> Caring for orphans, the elderly, the poor, and new Muslims.</li>
</ul>

<h3>4. The Role of the Masjid</h3>

<p>The masjid is far more than a place of prayer — it is the heart of the Muslim community:</p>

<ul>
  <li><strong>Worship:</strong> The primary function — the five daily prayers, Jumuʿah, tarāwīḥ, and iʿtikāf.</li>
  <li><strong>Education:</strong> Circles of knowledge (<em>ḥalaqāt</em>), Qurʾān classes, and lectures.</li>
  <li><strong>Community Gathering:</strong> Social events, Eid celebrations, and community meetings.</li>
  <li><strong>Dispute Resolution:</strong> Historically, the masjid served as a place for settling disputes.</li>
  <li><strong>Da'wah:</strong> Inviting others to Islam and providing resources for new Muslims.</li>
</ul>

<p>Etiquette of the masjid includes: entering with the right foot while making duʿāʾ, praying taḥiyyat al-masjid, maintaining cleanliness, lowering the voice, and leaving with the left foot.</p>

<h3>5. Marriage in Islam</h3>

<p>Marriage (<em>nikāḥ</em>) is a sacred contract and a sunnah of the Prophet ﷺ:</p>

<h4>5.1 Essential Elements</h4>
<ul>
  <li><strong>Proposal and Acceptance (Ījāb wa Qabūl):</strong> Expressed in the past tense in one sitting.</li>
  <li><strong>Witnesses:</strong> Two male Muslim witnesses (or one male and two females in the Ḥanafī school).</li>
  <li><strong>Mahr (Dowry):</strong> The obligatory gift from the husband to the wife. It is her right and cannot be taken from her.</li>
  <li><strong>Walī (Guardian):</strong> The bride's guardian plays a role in the marriage process. The Ḥanafī school permits an adult woman to contract her own marriage.</li>
</ul>

<h4>5.2 Criteria for Choosing a Spouse</h4>
<p>The Prophet ﷺ advised: "A woman is married for four things: her wealth, her lineage, her beauty, and her religion. Attain the one with religion and be successful." (Bukhārī & Muslim)</p>

<h3>6. Death, Burial and Bereavement</h3>

<h4>6.1 At the Time of Death</h4>
<p>Encourage the dying person to say the shahādah. Recite Sūrah Yā-Sīn. After death, close the eyes, cover the body, and hasten the burial process.</p>

<h4>6.2 Ghusl of the Deceased</h4>
<p>Washing the body is farḍ kifāyah. The body is washed an odd number of times, starting from the right side, with water and lotus leaves (or soap).</p>

<h4>6.3 Kafan (Shrouding)</h4>
<p>The deceased is wrapped in simple white cloth. For a man: three pieces (izār, qamīṣ, lifāfah). For a woman: five pieces.</p>

<h4>6.4 Ṣalāh al-Janāzah</h4>
<p>The funeral prayer is performed as described in Unit 1. It is farḍ kifāyah upon the community.</p>

<h4>6.5 Burial</h4>
<p>The body is placed in the grave on its right side, facing the qiblah. Dust is placed in the grave while reciting: "From it We created you, to it We shall return you, and from it We shall raise you a second time."</p>

<h4>6.6 Bereavement and Mourning</h4>
<p>Mourning is limited to three days for most relatives. A widow mourns for four months and ten days (<em>ʿiddah</em>). Excessive wailing and self-harm are prohibited. Patience and acceptance of Allāh's decree are encouraged.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 5:', unitLiving.title);


  // ──────────────────────────────────────────────
  // UNIT 5 QUIZ QUESTIONS
  // ──────────────────────────────────────────────

  console.log('📝 Creating Unit 5 quiz questions...');

  await prisma.question.createMany({
    data: [
      {
        unitId: unitLiving.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to a famous ḥadīth, who is most deserving of a person\'s good companionship?',
        options: JSON.stringify(['The father', 'The mother', 'The spouse', 'The teacher']),
        correctAnswer: 'The mother',
        explanation: 'The Prophet ﷺ said "Your mother" three times before saying "Then your father," emphasising the mother\'s special status. (Bukhārī & Muslim)',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitLiving.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is mahr in the context of Islamic marriage?',
        options: JSON.stringify(['A wedding feast', 'The obligatory gift from husband to wife', 'The marriage contract document', 'Permission from the bride\'s father']),
        correctAnswer: 'The obligatory gift from husband to wife',
        explanation: 'Mahr is the obligatory gift (dowry) from the husband to the wife. It is entirely her right and cannot be taken from her without her consent.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitLiving.id,
        type: 'TRUE_FALSE',
        questionText: 'In Islam, mourning for a deceased relative is limited to a maximum of three days, with no exceptions.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'While general mourning is limited to three days, a widow observes a mourning period (ʿiddah) of four months and ten days as specified in the Qurʾān.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitLiving.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ advise as the most important criterion when choosing a spouse?',
        options: JSON.stringify(['Wealth', 'Beauty', 'Religion', 'Lineage']),
        correctAnswer: 'Religion',
        explanation: 'The Prophet ﷺ said: "A woman is married for four things... Attain the one with religion and be successful." (Bukhārī & Muslim). This applies equally to choosing a husband.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitLiving.id,
        type: 'FILL_BLANK',
        questionText: 'Maintaining ties of kinship is called _____ ar-raḥim in Arabic and is a religious duty.',
        options: null,
        correctAnswer: 'ṣilah',
        explanation: 'Ṣilah ar-raḥim means maintaining family ties. Severing them is among the major sins in Islam.',
        difficulty: 'HARD',
      },
      {
        unitId: unitLiving.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many pieces of cloth are used to shroud (kafan) a deceased man?',
        options: JSON.stringify(['Two', 'Three', 'Four', 'Five']),
        correctAnswer: 'Three',
        explanation: 'A man is shrouded in three pieces: izār (lower wrap), qamīṣ (shirt), and lifāfah (outer sheet). A woman is shrouded in five pieces.',
        difficulty: 'HARD',
      },
    ],
  });

  // --- Living Flashcards ---
  const livingFlashcards = [
    {
      front: 'Ṣilah ar-Raḥim',
      back: 'Maintaining ties of kinship — a religious duty in Islam. Severing family ties is among the major sins condemned by the Prophet ﷺ.',
      frontArabic: 'صِلَةُ الرَّحِم',
      backArabic: null,
      category: 'vocabulary',
      tags: ['family', 'community'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Mahr',
      back: 'The obligatory dowry (gift) given by the husband to the wife at marriage. It is entirely her right and her property.',
      frontArabic: 'مَهْر',
      backArabic: null,
      category: 'vocabulary',
      tags: ['marriage', 'fiqh'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Nikāḥ Requirements',
      back: 'Essential elements: Ījāb wa Qabūl (proposal & acceptance), witnesses (2 male or 1 male + 2 female), mahr, and walī (guardian — though Ḥanafī allows adult woman to self-contract).',
      frontArabic: 'نِكَاح',
      backArabic: null,
      category: 'rule',
      tags: ['marriage', 'fiqh'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Kafan (Shrouding)',
      back: 'The deceased is wrapped in simple white cloth. Man: 3 pieces (izār, qamīṣ, lifāfah). Woman: 5 pieces. Simplicity is sunnah.',
      frontArabic: 'كَفَن',
      backArabic: null,
      category: 'rule',
      tags: ['death', 'burial'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'ʿIddah',
      back: 'The waiting period after divorce or the death of a husband. For a widow: 4 months and 10 days. For a divorcee: 3 menstrual cycles.',
      frontArabic: 'عِدَّة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['marriage', 'fiqh'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Rights of Neighbours',
      back: 'The Prophet ﷺ said Jibrīl kept advising him about the neighbour\'s rights until he thought the neighbour would inherit. Includes kindness, no harm, sharing food.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['community', 'akhlāq'],
      difficulty: 'MEDIUM' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: livingFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitLiving.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += livingFlashcards.length;


  // ──────────────────────────────────────────────
  // UNIT 6: MONEY & TRANSACTIONS
  // ──────────────────────────────────────────────

  const unitMoney = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Money & Transactions — Islamic Finance',
      description:
        'Ḥalāl earnings and work ethic, zakāh calculation and distribution, principles of Islamic economics, the prohibition of ribā (interest), and an introduction to Islamic inheritance (mīrāth).',
      orderIndex: 6,
      content: `
<h2>Money &amp; Transactions — Islamic Finance</h2>

<h3>1. Ḥalāl Earnings and Work Ethic</h3>

<p>Islam places great emphasis on earning a lawful livelihood. Working and providing for one's family is itself an act of worship when accompanied by the right intention:</p>

<p class="arabic" dir="rtl" lang="ar">إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا</p>
<p class="source">"Indeed, Allāh is pure and accepts only that which is pure." (Ṣaḥīḥ Muslim)</p>

<ul>
  <li><strong>Obligation to Earn:</strong> Seeking ḥalāl sustenance is an obligation after the completion of obligatory worship. Begging without need is strongly condemned.</li>
  <li><strong>Honesty in Trade:</strong> The Prophet ﷺ said: "The truthful, trustworthy merchant is with the prophets, the truthful, and the martyrs." (Tirmidhī)</li>
  <li><strong>Prohibited Professions:</strong> Selling alcohol, pork, or items used for ḥarām. Gambling, fortune-telling, and any work that involves deception or injustice.</li>
  <li><strong>Quality and Integrity:</strong> Giving full measure, not concealing defects in goods, and honouring contracts and agreements.</li>
</ul>

<h3>2. Zakāh — The Third Pillar</h3>

<h4>2.1 Conditions for Zakāh</h4>
<p>Zakāh is obligatory when:</p>
<ul>
  <li>The person is a free, adult, sane Muslim.</li>
  <li>They possess wealth at or above the <em>niṣāb</em> threshold.</li>
  <li>One full lunar year (<em>ḥawl</em>) has passed on that wealth.</li>
  <li>The wealth is productive or has the potential for growth.</li>
</ul>

<h4>2.2 Niṣāb Thresholds</h4>
<ul>
  <li><strong>Gold:</strong> 87.48 grams (7.5 tolas) — or its cash equivalent.</li>
  <li><strong>Silver:</strong> 612.36 grams (52.5 tolas) — or its cash equivalent.</li>
  <li>In practice, the silver niṣāb is often used as it results in a lower threshold, making more people eligible to pay and thereby helping more recipients.</li>
</ul>

<h4>2.3 Rate and Calculation</h4>
<p>The standard rate is <strong>2.5% (1/40th)</strong> of total zakātable wealth. Zakātable assets include: cash, gold, silver, trade goods, investments, and receivable debts. Personal items (home, car, clothing) and business equipment are exempt.</p>

<h4>2.4 Eight Categories of Recipients</h4>
<p>Allāh specifies the recipients in the Qurʾān:</p>

<p class="arabic" dir="rtl" lang="ar">إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ</p>
<p class="source">(Sūrah at-Tawbah, 9:60)</p>

<ol>
  <li><strong>Al-Fuqarāʾ:</strong> The poor — those who have little or nothing.</li>
  <li><strong>Al-Masākīn:</strong> The needy — those who have some means but not enough.</li>
  <li><strong>Al-ʿĀmilīn ʿalayhā:</strong> Zakāh administrators and collectors.</li>
  <li><strong>Al-Muʾallafah Qulūbuhum:</strong> Those whose hearts are to be reconciled (new Muslims, potential allies).</li>
  <li><strong>Fī ar-Riqāb:</strong> For freeing slaves/captives.</li>
  <li><strong>Al-Ghārimīn:</strong> Those burdened with debt.</li>
  <li><strong>Fī Sabīlillāh:</strong> In the cause of Allāh.</li>
  <li><strong>Ibn as-Sabīl:</strong> The stranded traveller.</li>
</ol>

<h3>3. Principles of Islamic Economics</h3>

<p>Islamic economics operates on distinct principles that differ from conventional capitalist and socialist models:</p>

<ul>
  <li><strong>Allāh is the True Owner:</strong> Wealth is a trust (<em>amānah</em>) from Allāh. We are custodians, not absolute owners.</li>
  <li><strong>Prohibition of Exploitation:</strong> Economic transactions must be based on mutual consent, fairness, and transparency.</li>
  <li><strong>Wealth Circulation:</strong> Islam discourages hoarding (<em>iktināz</em>) and encourages the circulation of wealth through trade, charity, and zakāh.</li>
  <li><strong>Risk Sharing:</strong> Profit and loss should be shared between parties. One party cannot bear all the risk while the other takes guaranteed returns.</li>
  <li><strong>Ethical Investment:</strong> Investing in ḥarām industries (alcohol, gambling, weapons of mass destruction, conventional interest-based finance) is prohibited.</li>
</ul>

<h3>4. The Prohibition of Ribā (Interest)</h3>

<p>Ribā (interest/usury) is one of the most severely condemned sins in the Qurʾān and Sunnah:</p>

<p class="arabic" dir="rtl" lang="ar">الَّذِينَ يَأْكُلُونَ الرِّبَا لَا يَقُومُونَ إِلَّا كَمَا يَقُومُ الَّذِي يَتَخَبَّطُهُ الشَّيْطَانُ مِنَ الْمَسِّ</p>
<p class="source">"Those who consume ribā cannot stand except as one stands who is driven to madness by the touch of Shayṭān." (Sūrah al-Baqarah, 2:275)</p>

<p>The Prophet ﷺ cursed the one who consumes ribā, the one who pays it, the one who records it, and the two witnesses — saying they are all equal in sin. (Ṣaḥīḥ Muslim)</p>

<h4>Islamic Alternatives to Interest</h4>
<ul>
  <li><strong>Murābaḥah:</strong> Cost-plus financing — the bank purchases an item and sells it to the client at a disclosed profit margin.</li>
  <li><strong>Mushārakah:</strong> Partnership — both parties contribute capital and share profits and losses proportionally.</li>
  <li><strong>Mudārabah:</strong> Investment partnership — one party provides capital, the other provides expertise; profits are shared, losses borne by the capital provider.</li>
  <li><strong>Ijārah:</strong> Leasing — the bank purchases an asset and leases it to the client.</li>
</ul>

<h3>5. Islamic Inheritance (Mīrāth)</h3>

<p>The Islamic law of inheritance is detailed and precise, with fixed shares (<em>farāʾiḍ</em>) prescribed in the Qurʾān:</p>

<p class="arabic" dir="rtl" lang="ar">لِلرِّجَالِ نَصِيبٌ مِمَّا تَرَكَ الْوَالِدَانِ وَالْأَقْرَبُونَ وَلِلنِّسَاءِ نَصِيبٌ مِمَّا تَرَكَ الْوَالِدَانِ وَالْأَقْرَبُونَ</p>
<p class="source">"For men is a share of what the parents and close relatives leave, and for women is a share of what the parents and close relatives leave." (Sūrah an-Nisāʾ, 4:7)</p>

<p>Key principles: debts are settled first, then the waṣiyyah (bequest — limited to one third for non-heirs), then the remaining estate is distributed according to the fixed shares. One cannot make a bequest to an existing heir.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 6:', unitMoney.title);


  // ──────────────────────────────────────────────
  // UNIT 6 QUIZ QUESTIONS
  // ──────────────────────────────────────────────

  console.log('📝 Creating Unit 6 quiz questions...');

  await prisma.question.createMany({
    data: [
      {
        unitId: unitMoney.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the standard rate of zakāh on wealth?',
        options: JSON.stringify(['1%', '2.5%', '5%', '10%']),
        correctAnswer: '2.5%',
        explanation: 'The standard zakāh rate is 2.5% (one-fortieth) of total zakātable wealth that has been held for one lunar year above the niṣāb threshold.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitMoney.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is murābaḥah in Islamic finance?',
        options: JSON.stringify(['A partnership where profits are shared', 'Cost-plus financing where the bank buys and resells at a disclosed profit', 'A leasing arrangement', 'An investment where one party provides capital']),
        correctAnswer: 'Cost-plus financing where the bank buys and resells at a disclosed profit',
        explanation: 'Murābaḥah is a common Islamic financing method where the financial institution purchases the item and sells it to the client at a disclosed profit margin, avoiding interest.',
        difficulty: 'HARD',
      },
      {
        unitId: unitMoney.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many categories of zakāh recipients are specified in the Qurʾān?',
        options: JSON.stringify(['Five', 'Six', 'Seven', 'Eight']),
        correctAnswer: 'Eight',
        explanation: 'Sūrah at-Tawbah (9:60) specifies eight categories: the poor, the needy, zakāh administrators, those whose hearts are to be reconciled, for freeing captives, debtors, in the cause of Allāh, and the stranded traveller.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitMoney.id,
        type: 'TRUE_FALSE',
        questionText: 'In Islamic inheritance law, a person can bequeath their entire estate to anyone they choose.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'A bequest (waṣiyyah) is limited to a maximum of one-third of the estate and can only be made to non-heirs. The remaining estate must be distributed according to the fixed shares prescribed in the Qurʾān.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitMoney.id,
        type: 'FILL_BLANK',
        questionText: 'The niṣāb threshold for gold is _____ grams.',
        options: null,
        correctAnswer: '87.48',
        explanation: 'The gold niṣāb is 87.48 grams (7.5 tolas). If a person possesses this amount of gold (or its cash equivalent) for one lunar year, zakāh becomes obligatory.',
        difficulty: 'HARD',
      },
      {
        unitId: unitMoney.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which type of Islamic finance contract involves partnership where both parties contribute capital and share profits and losses?',
        options: JSON.stringify(['Murābaḥah', 'Mushārakah', 'Ijārah', 'Mudārabah']),
        correctAnswer: 'Mushārakah',
        explanation: 'Mushārakah is a joint venture where all partners contribute capital and share both profits and losses proportionally. In Mudārabah, only one party provides capital.',
        difficulty: 'HARD',
      },
    ],
  });

  // --- Money Flashcards ---
  const moneyFlashcards = [
    {
      front: 'Niṣāb',
      back: 'The minimum threshold of wealth that makes zakāh obligatory. Gold: 87.48g. Silver: 612.36g. The silver threshold is commonly used for cash.',
      frontArabic: 'نِصَاب',
      backArabic: null,
      category: 'vocabulary',
      tags: ['zakāh', 'fiqh'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ribā',
      back: 'Interest/usury — strictly prohibited in Islam. Includes both ribā an-nasīʾah (interest on loans) and ribā al-faḍl (unfair exchange of commodities).',
      frontArabic: 'رِبَا',
      backArabic: null,
      category: 'vocabulary',
      tags: ['finance', 'ḥarām'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Murābaḥah',
      back: 'Cost-plus financing — the bank purchases an item and resells it to the client at a disclosed profit margin. An Islamic alternative to interest-based loans.',
      frontArabic: 'مُرَابَحَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['finance', 'islamic-banking'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Mushārakah',
      back: 'Joint partnership — both parties contribute capital and share profits and losses proportionally. Used in Islamic business ventures and home financing.',
      frontArabic: 'مُشَارَكَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['finance', 'islamic-banking'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Mudārabah',
      back: 'Investment partnership — one party (rabb al-māl) provides capital, the other (muḍārib) provides expertise. Profits shared; losses borne by the capital provider.',
      frontArabic: 'مُضَارَبَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['finance', 'islamic-banking'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Waṣiyyah',
      back: 'A bequest or will — limited to one-third of the estate and can only be for non-heirs. The remainder is distributed according to fixed Qurʾānic shares.',
      frontArabic: 'وَصِيَّة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['inheritance', 'fiqh'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ḥawl',
      back: 'One complete lunar year — the period that must pass on wealth above niṣāb before zakāh becomes due.',
      frontArabic: 'حَوْل',
      backArabic: null,
      category: 'vocabulary',
      tags: ['zakāh', 'fiqh'],
      difficulty: 'MEDIUM' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: moneyFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitMoney.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += moneyFlashcards.length;


  // ──────────────────────────────────────────────
  // UNIT 7: CONTEMPORARY ISSUES
  // ──────────────────────────────────────────────

  const unitContemporary = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Contemporary Issues — Navigating Modern Challenges',
      description:
        'Addressing modern challenges from an Islamic perspective: addiction and intoxicants, gaming and screen time, social media ethics, discrimination and racism, and materialism and consumerism.',
      orderIndex: 7,
      content: `
<h2>Contemporary Issues — Navigating Modern Challenges</h2>

<h3>1. Addiction and Intoxicants</h3>

<p>Islam unequivocally prohibits all intoxicants (<em>khamr</em>). The prohibition was revealed gradually and covers every substance that intoxicates:</p>

<p class="arabic" dir="rtl" lang="ar">يَا أَيُّهَا الَّذِينَ آمَنُوا إِنَّمَا الْخَمْرُ وَالْمَيْسِرُ وَالْأَنْصَابُ وَالْأَزْلَامُ رِجْسٌ مِنْ عَمَلِ الشَّيْطَانِ فَاجْتَنِبُوهُ</p>
<p class="source">"O you who believe, intoxicants, gambling, stone altars, and divining arrows are but defilement from the work of Shayṭān, so avoid them." (Sūrah al-Māʾidah, 5:90)</p>

<p>The Prophet ﷺ said: <em>"Every intoxicant is khamr, and every khamr is ḥarām."</em> (Ṣaḥīḥ Muslim). This includes alcohol, recreational drugs, and any substance that clouds the mind. The Prophet ﷺ also said: <em>"What intoxicates in large quantities is ḥarām in small quantities."</em> (Tirmidhī)</p>

<h4>Modern Forms of Addiction</h4>
<p>Beyond substance abuse, modern life presents new forms of addictive behaviour:</p>
<ul>
  <li><strong>Smoking and Vaping:</strong> Scholars have increasingly classified smoking as ḥarām due to its proven harm to health and its addictive nature. The Qurʾānic principle "do not throw yourselves into destruction" (2:195) applies.</li>
  <li><strong>Pornography:</strong> A severe violation of Islamic modesty principles, destructive to relationships and mental health. Guarding the gaze is a Qurʾānic command (24:30).</li>
  <li><strong>Gambling:</strong> Whether traditional or online (including loot boxes in games), gambling is explicitly prohibited alongside intoxicants in Sūrah al-Māʾidah.</li>
</ul>

<h4>Islamic Approach to Recovery</h4>
<p>Tawbah (repentance) is always open. Islam emphasises: recognising the problem, sincere repentance, removing oneself from triggers, seeking professional help, building a supportive environment, and replacing harmful habits with beneficial ones (dhikr, exercise, community involvement).</p>

<h3>2. Gaming and Screen Time</h3>

<p>Islam does not prohibit entertainment outright but provides a framework for its regulation:</p>

<ul>
  <li><strong>Time Management:</strong> Gaming and entertainment must not interfere with obligatory worship, family responsibilities, education, or work. The Muslim's time is an amānah that will be questioned about on the Day of Judgement.</li>
  <li><strong>Content Evaluation:</strong> Games or media containing shirk-promoting themes, excessive violence, sexualised content, gambling mechanics, or normalisation of ḥarām behaviour should be avoided.</li>
  <li><strong>Social Impact:</strong> Online gaming communities can expose young Muslims to bullying, toxic behaviour, and environments that conflict with Islamic values.</li>
  <li><strong>Balance:</strong> The Prophet ﷺ encouraged physical activity, archery, horse-riding, and swimming. Replacing passive screen time with active, beneficial pursuits is the prophetic model.</li>
</ul>

<h3>3. Social Media Ethics</h3>

<p>Social media presents both opportunities and dangers for the Muslim:</p>

<h4>Islamic Guidelines for Social Media</h4>
<ul>
  <li><strong>Truthfulness:</strong> Do not share unverified information. The Qurʾān warns: "O you who believe, if a sinful person comes to you with news, verify it." (49:6)</li>
  <li><strong>Backbiting (Ghībah):</strong> Speaking negatively about someone — even if true — is ḥarām. Online gossip, subtweets, and vague posts targeting individuals all fall under this prohibition.</li>
  <li><strong>Modesty:</strong> Posting images that compromise one's ḥayāʾ (modesty) or encourage vanity contradicts Islamic values.</li>
  <li><strong>Comparison and Envy:</strong> Social media creates an illusion of perfection. The Prophet ﷺ warned against envy: "Beware of envy, for it consumes good deeds as fire consumes wood." (Abū Dāwūd)</li>
  <li><strong>Positive Use:</strong> Social media can be used for da'wah, sharing beneficial knowledge, maintaining family ties, and supporting charitable causes.</li>
</ul>

<h3>4. Discrimination and Racism</h3>

<p>Islam dismantled racism and tribalism fourteen centuries ago. The Prophet ﷺ declared in his Farewell Sermon:</p>

<p class="arabic" dir="rtl" lang="ar">لَا فَضْلَ لِعَرَبِيٍّ عَلَىٰ عَجَمِيٍّ وَلَا لِعَجَمِيٍّ عَلَىٰ عَرَبِيٍّ وَلَا لِأَبْيَضَ عَلَىٰ أَسْوَدَ وَلَا لِأَسْوَدَ عَلَىٰ أَبْيَضَ إِلَّا بِالتَّقْوَىٰ</p>
<p class="source">"No Arab has superiority over a non-Arab, and no non-Arab has superiority over an Arab; no white person has superiority over a black person, and no black person has superiority over a white person — except by taqwā (God-consciousness)." (Musnad Aḥmad)</p>

<p>The Qurʾān states that diversity is a sign of Allāh's creative power, meant for mutual recognition, not hierarchy:</p>

<p class="arabic" dir="rtl" lang="ar">يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُمْ مِنْ ذَكَرٍ وَأُنْثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ</p>
<p class="source">"O mankind, We have created you from male and female and made you into nations and tribes that you may know one another. The most honourable of you in the sight of Allāh is the most righteous." (Sūrah al-Ḥujurāt, 49:13)</p>

<p>Bilāl ibn Rabāḥ رضي الله عنه — a formerly enslaved Abyssinian — was chosen by the Prophet ﷺ as the first muʾadhdhin, demonstrating that status in Islam is determined by faith and character, not by race or social origin.</p>

<h3>5. Materialism and Consumerism</h3>

<p>Modern consumer culture encourages endless acquisition, but Islam teaches contentment (<em>qanāʿah</em>):</p>

<p class="arabic" dir="rtl" lang="ar">لَوْ كَانَ لِابْنِ آدَمَ وَادِيَانِ مِنْ مَالٍ لَابْتَغَىٰ ثَالِثًا ، وَلَا يَمْلَأُ جَوْفَ ابْنِ آدَمَ إِلَّا التُّرَابُ</p>
<p class="source">"If the son of Ādam had two valleys of wealth, he would seek a third. Nothing fills the belly of the son of Ādam except dust (i.e., death)." (Bukhārī & Muslim)</p>

<ul>
  <li><strong>Zuhd (Detachment):</strong> Not necessarily avoiding the world, but not being enslaved by it. Using wealth as a tool, not an end in itself.</li>
  <li><strong>Shukr (Gratitude):</strong> Actively recognising and appreciating what one already has, rather than constantly desiring more.</li>
  <li><strong>Isrāf (Extravagance):</strong> Wasteful spending is prohibited. "Eat and drink, but do not be extravagant. Indeed, He does not love the extravagant." (7:31)</li>
  <li><strong>Infāq (Spending for Others):</strong> The Islamic model is to earn lawfully, spend moderately on oneself, and give generously to others.</li>
</ul>
`.trim(),
    },
  });

  console.log('✅ Created Unit 7:', unitContemporary.title);


  // ──────────────────────────────────────────────
  // UNIT 7 QUIZ QUESTIONS
  // ──────────────────────────────────────────────

  console.log('📝 Creating Unit 7 quiz questions...');

  await prisma.question.createMany({
    data: [
      {
        unitId: unitContemporary.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the Islamic ruling on consuming intoxicants in small quantities?',
        options: JSON.stringify(['Permissible in small amounts', 'Makrūh but not ḥarām', 'Ḥarām — what intoxicates in large quantities is ḥarām in small quantities', 'Permissible for medicinal purposes only']),
        correctAnswer: 'Ḥarām — what intoxicates in large quantities is ḥarām in small quantities',
        explanation: 'The Prophet ﷺ said: "What intoxicates in large quantities is ḥarām in small quantities." (Tirmidhī). There is no permissible dose of intoxicants.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitContemporary.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What Qurʾānic guidance applies to sharing unverified information on social media?',
        options: JSON.stringify(['"Do not spy on one another"', '"If a sinful person comes to you with news, verify it"', '"Do not backbite one another"', '"Speak a word of truth"']),
        correctAnswer: '"If a sinful person comes to you with news, verify it"',
        explanation: 'Sūrah al-Ḥujurāt (49:6) commands Muslims to verify news before acting on or sharing it — directly applicable to the modern phenomenon of misinformation and fake news.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitContemporary.id,
        type: 'TRUE_FALSE',
        questionText: 'According to the Farewell Sermon, an Arab has superiority over a non-Arab by virtue of lineage.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The Prophet ﷺ explicitly stated that no Arab has superiority over a non-Arab except by taqwā (God-consciousness). Race and lineage confer no superiority in Islam.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitContemporary.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who was Bilāl ibn Rabāḥ رضي الله عنه and why is his story significant in discussions about racism?',
        options: JSON.stringify([
          'A wealthy companion who donated his fortune',
          'A formerly enslaved Abyssinian chosen as the first muʾadhdhin',
          'A military commander in the conquest of Makkah',
          'A scholar who compiled ḥadīth'
        ]),
        correctAnswer: 'A formerly enslaved Abyssinian chosen as the first muʾadhdhin',
        explanation: 'Bilāl\'s appointment as the first caller to prayer demonstrated that Islam values faith and character over race and social status.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitContemporary.id,
        type: 'FILL_BLANK',
        questionText: 'Wasteful spending is called _____ in Arabic and is prohibited in the Qurʾān (7:31).',
        options: null,
        correctAnswer: 'isrāf',
        explanation: 'Isrāf means extravagance and wastefulness. Allāh says: "Eat and drink, but do not be extravagant. Indeed, He does not love the extravagant." (7:31)',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitContemporary.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the concept of qanāʿah mean in Islam?',
        options: JSON.stringify(['Generosity', 'Contentment', 'Patience', 'Gratitude']),
        correctAnswer: 'Contentment',
        explanation: 'Qanāʿah is contentment with what Allāh has provided. It is the antidote to materialism and endless desire for more.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Contemporary Flashcards ---
  const contemporaryFlashcards = [
    {
      front: 'Khamr',
      back: 'Any intoxicant — the Qurʾānic term encompasses all substances that cloud the mind. "Every intoxicant is khamr, and every khamr is ḥarām." (Muslim)',
      frontArabic: 'خَمْر',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ḥarām', 'intoxicants'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ghībah (Backbiting)',
      back: 'Speaking about someone in their absence in a way they would dislike — even if true. The Qurʾān compares it to eating the flesh of one\'s dead brother (49:12).',
      frontArabic: 'غِيبَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'social-media'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Taqwā',
      back: 'God-consciousness — the only basis for superiority between people in Islam. It means being aware of Allāh in all one\'s actions and choices.',
      frontArabic: 'تَقْوَىٰ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ʿaqīdah', 'character'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Qanāʿah',
      back: 'Contentment — being satisfied with what Allāh has provided. The Prophet ﷺ said: "Richness is not having many possessions, but richness is contentment of the soul." (Bukhārī & Muslim)',
      frontArabic: 'قَنَاعَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'materialism'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Isrāf',
      back: 'Extravagance and wastefulness — prohibited in the Qurʾān. "Eat and drink, but do not be extravagant. He does not love the extravagant." (7:31)',
      frontArabic: 'إِسْرَاف',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ḥarām', 'materialism'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Zuhd',
      back: 'Detachment from the world — not necessarily avoiding it, but not being enslaved by it. Using wealth as a tool for good, not an end in itself.',
      frontArabic: 'زُهْد',
      backArabic: null,
      category: 'vocabulary',
      tags: ['spirituality', 'materialism'],
      difficulty: 'HARD' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: contemporaryFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitContemporary.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += contemporaryFlashcards.length;


  // ──────────────────────────────────────────────
  // UNIT 8: HADITH STUDIES
  // ──────────────────────────────────────────────

  const unitHadith = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Hadith Studies — Selected Aḥādīth',
      description:
        'A study of selected aḥādīth organised by theme: sincerity and intention, knowledge, worship, character, social relations, and the hereafter. Each ḥadīth includes Arabic text, transliteration, translation, and commentary.',
      orderIndex: 8,
      content: `
<h2>Hadith Studies — Selected Aḥādīth</h2>

<h3>1. Sincerity and Intention</h3>

<h4>Ḥadīth 1: Actions are by Intentions</h4>
<p class="arabic" dir="rtl" lang="ar">إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَىٰ، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوِ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَىٰ مَا هَاجَرَ إِلَيْهِ</p>
<p><strong>Transliteration:</strong> <em>Innamā al-aʿmālu bin-niyyāt, wa innamā li-kulli imriʾin mā nawā...</em></p>
<p><strong>Translation:</strong> "Actions are judged by intentions, and each person will be rewarded according to what they intended. So whoever migrated for the sake of Allāh and His Messenger, then their migration is for Allāh and His Messenger. And whoever migrated for worldly gain or to marry a woman, then their migration is for what they migrated for."</p>
<p class="source">(Ṣaḥīḥ al-Bukhārī & Muslim, from ʿUmar ibn al-Khaṭṭāb رضي الله عنه)</p>
<p><strong>Commentary:</strong> This is considered the most important ḥadīth in Islam by many scholars. Imām al-Bukhārī placed it as the opening ḥadīth of his collection. It establishes that the value of every action depends on the intention behind it. A good deed done for show (riyāʾ) loses its reward, while an ordinary act done sincerely for Allāh becomes worship.</p>

<h4>Ḥadīth 2: The Three Who Will Be Judged First</h4>
<p class="arabic" dir="rtl" lang="ar">إِنَّ أَوَّلَ النَّاسِ يُقْضَىٰ يَوْمَ الْقِيَامَةِ عَلَيْهِ رَجُلٌ اسْتُشْهِدَ فَأُتِيَ بِهِ فَعَرَّفَهُ نِعَمَهُ فَعَرَفَهَا قَالَ فَمَا عَمِلْتَ فِيهَا قَالَ قَاتَلْتُ فِيكَ حَتَّى اسْتُشْهِدْتُ قَالَ كَذَبْتَ</p>
<p><strong>Translation (abridged):</strong> "The first people to be judged on the Day of Judgement will be: a man who was martyred — he will be brought and reminded of Allāh's blessings. He will say: 'I fought for Your sake until I was killed.' Allāh will say: 'You lied. You fought so people would call you brave.' Then he will be dragged on his face to the Fire." The ḥadīth continues with similar accounts of a scholar and a generous person who acted for fame rather than for Allāh.</p>
<p class="source">(Ṣaḥīḥ Muslim, from Abū Hurayrah رضي الله عنه)</p>
<p><strong>Commentary:</strong> This ḥadīth is a sobering reminder about sincerity. Even the greatest actions — fighting for Islam, seeking knowledge, and giving charity — become worthless if done for anything other than Allāh's pleasure.</p>

<h3>2. Knowledge</h3>

<h4>Ḥadīth 3: The Virtue of Seeking Knowledge</h4>
<p class="arabic" dir="rtl" lang="ar">مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ</p>
<p><strong>Transliteration:</strong> <em>Man salaka ṭarīqan yaltamisu fīhi ʿilman sahhala Allāhu lahu bihi ṭarīqan ilā al-jannah.</em></p>
<p><strong>Translation:</strong> "Whoever takes a path in search of knowledge, Allāh will make easy for them a path to Paradise."</p>
<p class="source">(Ṣaḥīḥ Muslim, from Abū Hurayrah رضي الله عنه)</p>
<p><strong>Commentary:</strong> This ḥadīth is a powerful motivator for all students of knowledge. The "path" includes physical journeys, attending classes, reading, and any effort made to acquire beneficial knowledge — whether religious or worldly knowledge that benefits the ummah.</p>

<h4>Ḥadīth 4: Conveying Knowledge</h4>
<p class="arabic" dir="rtl" lang="ar">بَلِّغُوا عَنِّي وَلَوْ آيَةً</p>
<p><strong>Transliteration:</strong> <em>Balliġū ʿannī wa law āyah.</em></p>
<p><strong>Translation:</strong> "Convey from me, even if it is a single verse."</p>
<p class="source">(Ṣaḥīḥ al-Bukhārī, from ʿAbdullāh ibn ʿAmr رضي الله عنهما)</p>
<p><strong>Commentary:</strong> Every Muslim has a duty to share what they know, even if it is limited. This ḥadīth removes the excuse of "I don't know enough" — sharing even one verse or one ḥadīth is a means of tremendous reward.</p>

<h3>3. Worship</h3>

<h4>Ḥadīth 5: The Five Pillars</h4>
<p class="arabic" dir="rtl" lang="ar">بُنِيَ الْإِسْلَامُ عَلَىٰ خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ</p>
<p><strong>Translation:</strong> "Islam is built upon five: the testimony that there is no god but Allāh and Muḥammad is the Messenger of Allāh, establishing prayer, giving zakāh, performing Ḥajj, and fasting Ramaḍān."</p>
<p class="source">(Ṣaḥīḥ al-Bukhārī & Muslim, from Ibn ʿUmar رضي الله عنهما)</p>
<p><strong>Commentary:</strong> This foundational ḥadīth outlines the five practical pillars upon which the entire structure of Islam rests. Neglecting any pillar weakens the foundation of a Muslim's faith and practice.</p>

<h3>4. Character and Conduct</h3>

<h4>Ḥadīth 6: The Best of People</h4>
<p class="arabic" dir="rtl" lang="ar">خَيْرُكُمْ أَحْسَنُكُمْ أَخْلَاقًا</p>
<p><strong>Transliteration:</strong> <em>Khayrukum aḥsanukum akhlāqā.</em></p>
<p><strong>Translation:</strong> "The best of you are those with the best character."</p>
<p class="source">(Ṣaḥīḥ al-Bukhārī, from ʿAbdullāh ibn ʿAmr رضي الله عنهما)</p>
<p><strong>Commentary:</strong> Islamic excellence is measured not by wealth, status, or even outward worship alone, but by the quality of one's character. Good character encompasses honesty, kindness, patience, generosity, and humility.</p>

<h4>Ḥadīth 7: Removing Harm from the Path</h4>
<p class="arabic" dir="rtl" lang="ar">الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً، فَأَفْضَلُهَا قَوْلُ لَا إِلَٰهَ إِلَّا اللَّهُ، وَأَدْنَاهَا إِمَاطَةُ الْأَذَىٰ عَنِ الطَّرِيقِ، وَالْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ</p>
<p><strong>Translation:</strong> "Faith has seventy-odd branches. The highest is the declaration 'Lā ilāha illallāh,' and the lowest is removing harm from the path. And modesty (ḥayāʾ) is a branch of faith."</p>
<p class="source">(Ṣaḥīḥ Muslim, from Abū Hurayrah رضي الله عنه)</p>
<p><strong>Commentary:</strong> This ḥadīth beautifully illustrates the comprehensive nature of faith in Islam. It ranges from the greatest theological statement to the simplest act of community care. It also highlights ḥayāʾ (modesty/shame) as an integral part of faith.</p>

<h3>5. Social Relations</h3>

<h4>Ḥadīth 8: The Muslim's Duty to Other Muslims</h4>
<p class="arabic" dir="rtl" lang="ar">حَقُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ سِتٌّ: إِذَا لَقِيتَهُ فَسَلِّمْ عَلَيْهِ، وَإِذَا دَعَاكَ فَأَجِبْهُ، وَإِذَا اسْتَنْصَحَكَ فَانْصَحْهُ، وَإِذَا عَطَسَ فَحَمِدَ اللَّهَ فَشَمِّتْهُ، وَإِذَا مَرِضَ فَعُدْهُ، وَإِذَا مَاتَ فَاتَّبِعْهُ</p>
<p><strong>Translation:</strong> "The rights of a Muslim upon another Muslim are six: when you meet him, greet him; when he invites you, accept; when he seeks your counsel, advise him; when he sneezes and praises Allāh, say 'yarḥamukallāh'; when he is ill, visit him; and when he dies, follow his funeral."</p>
<p class="source">(Ṣaḥīḥ Muslim, from Abū Hurayrah رضي الله عنه)</p>
<p><strong>Commentary:</strong> These six rights form the basis of Muslim social etiquette. They create a network of care, respect, and solidarity within the community.</p>

<h3>6. The Hereafter</h3>

<h4>Ḥadīth 9: Be in This World as a Stranger</h4>
<p class="arabic" dir="rtl" lang="ar">كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ</p>
<p><strong>Transliteration:</strong> <em>Kun fī ad-dunyā ka-annaka gharīb aw ʿābiru sabīl.</em></p>
<p><strong>Translation:</strong> "Be in this world as though you were a stranger or a traveller."</p>
<p class="source">(Ṣaḥīḥ al-Bukhārī, from Ibn ʿUmar رضي الله عنهما)</p>
<p><strong>Commentary:</strong> This ḥadīth encourages a mindset of detachment from worldly attachment. A traveller carries only what is necessary and is focused on the destination. Similarly, the believer should prioritise the ākhirah while using the dunyā as a means, not an end.</p>

<h4>Ḥadīth 10: The Shade of Charity</h4>
<p class="arabic" dir="rtl" lang="ar">كُلُّ امْرِئٍ فِي ظِلِّ صَدَقَتِهِ حَتَّىٰ يُقْضَىٰ بَيْنَ النَّاسِ</p>
<p><strong>Translation:</strong> "Every person will be under the shade of their charity on the Day of Judgement until the reckoning between people is completed."</p>
<p class="source">(Musnad Aḥmad & Ibn Ḥibbān, from ʿUqbah ibn ʿĀmir رضي الله عنه)</p>
<p><strong>Commentary:</strong> On the Day of Judgement, when the sun will be brought close and people will be drowning in their own sweat, the believer's charity will provide shade and relief. This encourages consistent, ongoing ṣadaqah.</p>
`.trim(),
    },
  });

  console.log('✅ Created Unit 8:', unitHadith.title);


  // ──────────────────────────────────────────────
  // UNIT 8 QUIZ QUESTIONS
  // ──────────────────────────────────────────────

  console.log('📝 Creating Unit 8 quiz questions...');

  await prisma.question.createMany({
    data: [
      {
        unitId: unitHadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which ḥadīth did Imām al-Bukhārī place as the opening of his collection?',
        options: JSON.stringify(['"The best of you are those with the best character"', '"Actions are judged by intentions"', '"Seeking knowledge is an obligation"', '"Be in this world as a stranger"']),
        correctAnswer: '"Actions are judged by intentions"',
        explanation: 'The ḥadīth of ʿUmar رضي الله عنه on intentions ("Innamā al-aʿmālu bin-niyyāt") is considered the most important ḥadīth and was chosen by Imām al-Bukhārī to open his Ṣaḥīḥ.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitHadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth in Ṣaḥīḥ Muslim, how many branches does faith have?',
        options: JSON.stringify(['Fifty-odd', 'Sixty-odd', 'Seventy-odd', 'Ninety-nine']),
        correctAnswer: 'Seventy-odd',
        explanation: 'The Prophet ﷺ said faith has seventy-odd branches, ranging from the declaration of Tawḥīd (highest) to removing harm from the path (lowest), with ḥayāʾ being a branch of faith.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitHadith.id,
        type: 'TRUE_FALSE',
        questionText: 'The ḥadīth "Convey from me, even if it is a single verse" (Bukhārī) means only scholars should share Islamic knowledge.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'This ḥadīth encourages every Muslim to share what they know, even if it is limited to a single verse. It removes the excuse of insufficient knowledge.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitHadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many rights of a Muslim upon another Muslim are mentioned in the ḥadīth of Abū Hurayrah (Ṣaḥīḥ Muslim)?',
        options: JSON.stringify(['Three', 'Five', 'Six', 'Seven']),
        correctAnswer: 'Six',
        explanation: 'The six rights are: give salām, accept invitations, give sincere advice, say yarḥamukallāh when they sneeze, visit them when sick, and attend their funeral.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitHadith.id,
        type: 'FILL_BLANK',
        questionText: 'The Prophet ﷺ said: "Be in this world as though you were a _____ or a traveller."',
        options: null,
        correctAnswer: 'stranger',
        explanation: 'This ḥadīth from Ṣaḥīḥ al-Bukhārī encourages detachment from worldly life. The Arabic word is "gharīb" (stranger/foreigner).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitHadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the ḥadīth about the first three people judged, what was the sin common to all three?',
        options: JSON.stringify(['They did not pray', 'They acted for fame rather than for Allāh', 'They committed major sins', 'They did not give zakāh']),
        correctAnswer: 'They acted for fame rather than for Allāh',
        explanation: 'The warrior, the scholar, and the generous person all performed great deeds but for the sake of reputation rather than for Allāh — a warning about the danger of riyāʾ (showing off).',
        difficulty: 'HARD',
      },
      {
        unitId: unitHadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What will provide shade for a person on the Day of Judgement according to the ḥadīth of ʿUqbah ibn ʿĀmir?',
        options: JSON.stringify(['Their prayer', 'Their fasting', 'Their charity (ṣadaqah)', 'Their Qurʾān recitation']),
        correctAnswer: 'Their charity (ṣadaqah)',
        explanation: '"Every person will be under the shade of their charity on the Day of Judgement until the reckoning between people is completed." (Musnad Aḥmad & Ibn Ḥibbān)',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Hadith Flashcards ---
  const hadithFlashcards = [
    {
      front: 'Niyyah (Intention)',
      back: '"Actions are judged by intentions." (Bukhārī & Muslim). Every deed\'s value depends on the intention behind it. Good deeds done for show lose their reward.',
      frontArabic: 'نِيَّة',
      backArabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
      category: 'vocabulary',
      tags: ['ḥadīth', 'sincerity'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Riyāʾ (Showing Off)',
      back: 'Performing good deeds for the sake of people\'s praise rather than Allāh\'s pleasure. The "hidden shirk" — it nullifies the reward of actions.',
      frontArabic: 'رِيَاء',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ḥadīth', 'sincerity', 'warning'],
      difficulty: 'HARD' as const,
    },
    {
      front: 'Ḥayāʾ (Modesty)',
      back: 'A branch of faith. It encompasses shame before Allāh, modesty in dress and behaviour, and shyness from committing sins. "Ḥayāʾ brings nothing but good." (Bukhārī & Muslim)',
      frontArabic: 'حَيَاء',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ḥadīth', 'character'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Six Rights of a Muslim',
      back: '(1) Give salām, (2) Accept invitations, (3) Give sincere advice, (4) Say yarḥamukallāh when they sneeze, (5) Visit when sick, (6) Attend their funeral.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ḥadīth', 'social'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: '"Kun fī ad-dunyā ka-annaka gharīb"',
      back: '"Be in this world as though you were a stranger or a traveller." (Bukhārī) — A reminder to prioritise the ākhirah and not become attached to worldly life.',
      frontArabic: null,
      backArabic: 'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ',
      category: 'vocabulary',
      tags: ['ḥadīth', 'hereafter'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: '"Balliġū ʿannī wa law āyah"',
      back: '"Convey from me, even if it is a single verse." (Bukhārī) — Every Muslim has a duty to share what they know of Islam, even if it is limited.',
      frontArabic: null,
      backArabic: 'بَلِّغُوا عَنِّي وَلَوْ آيَةً',
      category: 'vocabulary',
      tags: ['ḥadīth', 'knowledge', 'daʿwah'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ṣadaqah as Shade',
      back: '"Every person will be under the shade of their charity until the reckoning is completed." (Aḥmad & Ibn Ḥibbān) — Charity provides literal protection on Judgement Day.',
      frontArabic: 'صَدَقَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ḥadīth', 'charity', 'hereafter'],
      difficulty: 'MEDIUM' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: hadithFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitHadith.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += hadithFlashcards.length;


  // ══════════════════════════════════════════════
  // ARABIC TERMS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🔤 Creating Arabic terms...');

  await prisma.arabicTerm.createMany({
    data: [
      // Essentials 1 terms
      { unitId: unitEssentials1.id, arabicText: 'أَرْكَانُ الْإِيمَانِ', transliteration: 'Arkān al-Īmān', translation: 'The six articles of faith' },
      { unitId: unitEssentials1.id, arabicText: 'تَوْحِيد', transliteration: 'Tawḥīd', translation: 'The oneness of Allāh in His lordship, worship, and names/attributes' },
      { unitId: unitEssentials1.id, arabicText: 'نَجَاسَة', transliteration: 'Najāsah', translation: 'Ritual impurity — categorised as ghālīẓah (heavy) or khafīfah (light)' },
      { unitId: unitEssentials1.id, arabicText: 'وُضُوء', transliteration: 'Wuḍūʾ', translation: 'Ablution — ritual washing before prayer' },
      { unitId: unitEssentials1.id, arabicText: 'تَيَمُّم', transliteration: 'Tayammum', translation: 'Dry ablution using clean earth when water is unavailable' },
      { unitId: unitEssentials1.id, arabicText: 'غُسْل', transliteration: 'Ghusl', translation: 'Full ritual bath — obligatory after janābah, ḥayḍ, and nifās' },
      // Essentials 2 terms
      { unitId: unitEssentials2.id, arabicText: 'صَلَاة', transliteration: 'Ṣalāh', translation: 'The five obligatory daily prayers' },
      { unitId: unitEssentials2.id, arabicText: 'دُعَاء', transliteration: 'Duʿāʾ', translation: 'Supplication — personal prayer and calling upon Allāh' },
      { unitId: unitEssentials2.id, arabicText: 'هِجْرَة', transliteration: 'Hijrah', translation: 'Migration — the Prophet\'s migration to Madīnah in 622 CE' },
      { unitId: unitEssentials2.id, arabicText: 'عَاشُورَاء', transliteration: 'ʿĀshūrāʾ', translation: 'The 10th of Muḥarram — a recommended day of fasting' },
      // Faith terms
      { unitId: unitFaith.id, arabicText: 'صِفَاتٌ ذَاتِيَّة', transliteration: 'Ṣifāt Dhātiyyah', translation: 'Essential attributes of Allāh — inherent and eternal' },
      { unitId: unitFaith.id, arabicText: 'إِعْجَازُ الْقُرْآن', transliteration: 'Iʿjāz al-Qurʾān', translation: 'The inimitability and miraculous nature of the Qurʾān' },
      { unitId: unitFaith.id, arabicText: 'إِجْمَاع', transliteration: 'Ijmāʿ', translation: 'Scholarly consensus — the third source of Islamic law' },
      { unitId: unitFaith.id, arabicText: 'قِيَاس', transliteration: 'Qiyās', translation: 'Analogical reasoning — the fourth source of Islamic law' },
      // Devotional terms
      { unitId: unitDevotional.id, arabicText: 'خُشُوع', transliteration: 'Khushūʿ', translation: 'Humility and presence of heart in prayer' },
      { unitId: unitDevotional.id, arabicText: 'تَهَجُّد', transliteration: 'Tahajjud', translation: 'Voluntary night prayer performed after sleeping and waking' },
      { unitId: unitDevotional.id, arabicText: 'لَبَّيْكَ', transliteration: 'Labbayk', translation: 'Here I am at Your service — the response recited during Ḥajj' },
      { unitId: unitDevotional.id, arabicText: 'قَصْر', transliteration: 'Qaṣr', translation: 'Shortening of four-rakʿah prayers during travel' },
      // Identity terms
      { unitId: unitIdentity.id, arabicText: 'أَخْلَاق', transliteration: 'Akhlāq', translation: 'Noble character and moral conduct' },
      { unitId: unitIdentity.id, arabicText: 'تَزْكِيَةُ النَّفْس', transliteration: 'Tazkiyah an-Nafs', translation: 'Purification and spiritual refinement of the soul' },
      { unitId: unitIdentity.id, arabicText: 'صَبْر', transliteration: 'Ṣabr', translation: 'Patience — enduring difficulty with steadfastness' },
      // Living terms
      { unitId: unitLiving.id, arabicText: 'صِلَةُ الرَّحِم', transliteration: 'Ṣilah ar-Raḥim', translation: 'Maintaining ties of kinship — a religious duty' },
      { unitId: unitLiving.id, arabicText: 'نِكَاح', transliteration: 'Nikāḥ', translation: 'Marriage — a sacred contract and sunnah of the Prophet ﷺ' },
      { unitId: unitLiving.id, arabicText: 'مَهْر', transliteration: 'Mahr', translation: 'Dowry — the obligatory gift from husband to wife' },
      { unitId: unitLiving.id, arabicText: 'عِدَّة', transliteration: 'ʿIddah', translation: 'Waiting period after divorce or death of husband' },
      // Money terms
      { unitId: unitMoney.id, arabicText: 'رِبَا', transliteration: 'Ribā', translation: 'Interest/usury — strictly prohibited in Islam' },
      { unitId: unitMoney.id, arabicText: 'نِصَاب', transliteration: 'Niṣāb', translation: 'Minimum wealth threshold for zakāh obligation' },
      { unitId: unitMoney.id, arabicText: 'مُرَابَحَة', transliteration: 'Murābaḥah', translation: 'Cost-plus financing — an Islamic alternative to interest' },
      { unitId: unitMoney.id, arabicText: 'وَصِيَّة', transliteration: 'Waṣiyyah', translation: 'Bequest — limited to one-third of estate for non-heirs' },
      // Contemporary terms
      { unitId: unitContemporary.id, arabicText: 'خَمْر', transliteration: 'Khamr', translation: 'Intoxicant — any substance that clouds the mind' },
      { unitId: unitContemporary.id, arabicText: 'غِيبَة', transliteration: 'Ghībah', translation: 'Backbiting — speaking ill of someone in their absence' },
      { unitId: unitContemporary.id, arabicText: 'تَقْوَىٰ', transliteration: 'Taqwā', translation: 'God-consciousness — the only basis for superiority in Islam' },
      { unitId: unitContemporary.id, arabicText: 'إِسْرَاف', transliteration: 'Isrāf', translation: 'Extravagance and wastefulness — prohibited in the Qurʾān' },
      // Hadith terms
      { unitId: unitHadith.id, arabicText: 'نِيَّة', transliteration: 'Niyyah', translation: 'Intention — the value of every action depends on it' },
      { unitId: unitHadith.id, arabicText: 'رِيَاء', transliteration: 'Riyāʾ', translation: 'Showing off — performing deeds for people\'s praise, not Allāh\'s pleasure' },
      { unitId: unitHadith.id, arabicText: 'حَيَاء', transliteration: 'Ḥayāʾ', translation: 'Modesty — a branch of faith encompassing shame before Allāh' },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 An Nasihah Further Studies (North West) seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: An Nasihah Further Studies (North West) (ages 14+)');
  console.log('   - 9 Units: Essentials 1, Essentials 2, Faith, Devotional, Identity, Living, Money, Contemporary, Hadith');
  console.log(`   - ${7 + 6 + 6 + 6 + 6 + 6 + 6 + 6 + 7} Quiz questions (56 total)`);
  console.log(`   - ${flashcardIndex} Flashcards`);
  console.log(`   - 36 Arabic terms`);
}

// Allow standalone execution
async function main() {
  try {
    await seedMaktabFurtherStudiesNW();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding An Nasihah Further Studies (NW):', error);
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
