import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 2 — Islamic Curriculum Seed
 * Source: An Nasihah Publications, Age Range: 7–8 years
 *
 * Covers seven subjects: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā'id, Akhlāq, Ādāb
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions, flashcards, and Arabic terms per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-coursebook2.ts
 */

export async function seedMaktabCoursebook2() {
  console.log('📚 Starting Maktab Coursebook 2 seed...');
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
    where: { title: 'Maktab Coursebook 2' },
  });
  if (existing) {
    console.log('⏭️  Maktab Coursebook 2 already exists — skipping.');
    return;
  }

  // ──────────────────────────────────────────────
  // COURSE
  // ──────────────────────────────────────────────

  const course = await prisma.course.create({
    data: {
      title: 'Maktab Coursebook 2',
      description:
        'A comprehensive Islamic curriculum for young learners aged 7–8 years. Covers the detailed rules of wuḍū\' and ṣalāh, six key aḥādīth, the first revelation and early Muslims, stories of the prophets Hūd and Ṣāliḥ عليهم السلام, articles of faith including names of Allāh and angels, good character and manners (akhlāq), and Islamic etiquette of greeting, speaking, sneezing and yawning (ādāb). Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // UNIT 0: FIQH
  // ──────────────────────────────────────────────

  const unitFiqh = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Fiqh — Wuḍū\', Ṭahārah, Tayammum & Ṣalāh',
      description:
        'Learn the detailed rules of wuḍū\' including farā\'iḍ, sunan, nawāqiḍ, makrūhāt and mustaḥabbāt. Understand tayammum and the method of performing ṣalāh.',
      orderIndex: 0,
      content: `
<h2>Keeping Clean</h2>
<p>Allāh loves those who are clean. In Islam, there are three main times we use water for ṭahārah (cleanliness):</p>
<ol>
  <li><strong>Ghusl</strong> — a full body wash/bath required after certain states for ritual purity.</li>
  <li><strong>Wuḍū'</strong> — washing specific parts of the body to prepare for ṣalāh.</li>
  <li><strong>Istinjā'</strong> — cleaning oneself with water after using the washroom.</li>
</ol>

<h2>Wuḍū'</h2>
<p>Wuḍū' prepares us for ṣalāh by cleaning the body. When we perform wuḍū', our sins are washed away. Ṣalāh cannot be performed without wuḍū'. The Qur'ān cannot be touched without wuḍū'.</p>

<h2>Keywords — Categories of Actions in Islam</h2>
<p>Actions in Islam are categorised into different levels of importance:</p>
<ul>
  <li><strong>Farā'iḍ</strong> (plural of farḍ) — obligatory acts. Leaving them out makes the act incomplete or invalid.</li>
  <li><strong>Sunan</strong> (plural of sunnah) — acts practised by the Prophet ﷺ. Following them brings great reward.</li>
  <li><strong>Mustaḥabbāt</strong> — recommended acts beloved in Islam that bring extra reward.</li>
  <li><strong>Makrūhāt</strong> — disliked acts. We should stay away from them.</li>
  <li><strong>Nawāqiḍ</strong> — acts that break or invalidate another act, such as things that break wuḍū'.</li>
</ul>

<h2>Farā'iḍ of Wuḍū'</h2>
<p>There are <strong>4 obligatory acts (farā'iḍ)</strong> of wuḍū'. If any of these are missed, the wuḍū' is not valid:</p>
<ol>
  <li>Wash the face once.</li>
  <li>Wash both arms including the elbows once.</li>
  <li>Do masaḥ of at least a quarter of the head once.</li>
  <li>Wash both feet including the ankles once.</li>
</ol>

<h2>Sunan of Wuḍū'</h2>
<p>There are <strong>13 sunnah acts</strong> of wuḍū':</p>
<ol>
  <li>Making niyyah (intention).</li>
  <li>Saying Bismillāh.</li>
  <li>Washing both hands up to the wrists three times.</li>
  <li>Using a miswāk (or toothbrush).</li>
  <li>Rinsing the mouth three times.</li>
  <li>Putting water into the nostrils three times.</li>
  <li>Khilāl of the beard (for men with beards).</li>
  <li>Khilāl of the fingers and toes.</li>
  <li>Washing each part three times.</li>
  <li>Masaḥ of the whole head.</li>
  <li>Masaḥ of the ears.</li>
  <li>Washing the parts in the correct order.</li>
  <li>Washing each part before the previous one dries.</li>
</ol>

<h2>Nawāqiḍ of Wuḍū'</h2>
<p>There are <strong>8 things that break wuḍū'</strong> (nawāqiḍ):</p>
<ol>
  <li>Passing urine or stool.</li>
  <li>Passing wind.</li>
  <li>Vomiting a mouthful.</li>
  <li>Falling asleep whilst leaning against something.</li>
  <li>Fainting.</li>
  <li>Becoming insane.</li>
  <li>Laughing loudly during ṣalāh.</li>
  <li>Bleeding from a wound such that the blood flows.</li>
</ol>

<h2>Makrūhāt of Wuḍū'</h2>
<p>Things that are disliked during wuḍū':</p>
<ul>
  <li>Do not clean the nose with the right hand.</li>
  <li>Do not make wuḍū' in a dirty place.</li>
  <li>Do not perform wuḍū' against the sunnah order.</li>
  <li>Do not talk about worldly things during wuḍū'.</li>
</ul>
<p>Water is a gift from Allāh — do not waste it!</p>

<h2>Mustaḥabbāt of Wuḍū'</h2>
<p>Recommended acts during wuḍū':</p>
<ul>
  <li>Begin with the right hand/foot.</li>
  <li>Make masaḥ of the nape (back of the neck).</li>
  <li>Face the qiblah whilst doing wuḍū'.</li>
  <li>Sit on a high, clean place.</li>
  <li>Do wuḍū' without anyone's help.</li>
</ul>

<h2>Tayammum</h2>
<p>Tayammum is an alternative to wuḍū' when water is not available. It involves striking the hands on clean soil, sand, or brick and passing them over the face and arms.</p>
<p>There are <strong>3 farā'iḍ of tayammum</strong>:</p>
<ol>
  <li>Making the intention (niyyah).</li>
  <li>Masaḥ (wiping) of the entire face.</li>
  <li>Masaḥ (wiping) of both arms including the elbows.</li>
</ol>

<h2>Ṣalāh — The Method of Prayer</h2>
<p>Ṣalāh is the second pillar of Islam and the most important act of worship after the shahādah. Below is the method of performing ṣalāh:</p>

<h3>Method for Boys</h3>
<ol>
  <li>Stand facing the qiblah. Make the niyyah (intention) in your heart.</li>
  <li>Raise both hands to the ears and say <strong>"Allāhu Akbar"</strong> (takbīr taḥrīmah).</li>
  <li>Place the right hand over the left hand below the navel.</li>
  <li>Recite <strong>Du'ā' al-Istiftāḥ (Thanā')</strong> — "SubḥānakAllāhumma wa biḥamdika wa tabārakasmuka wa ta'ālā jadduka wa lā ilāha ghayruk."</li>
  <li>Recite <strong>Ta'awwudh</strong> — "A'ūdhu billāhi minash-shayṭānir-rajīm."</li>
  <li>Recite <strong>Tasmiyah</strong> — "Bismillāhir-Raḥmānir-Raḥīm."</li>
  <li>Recite <strong>Sūrah al-Fātiḥah</strong>, then say "Āmīn" softly, then recite another sūrah.</li>
  <li>Say "Allāhu Akbar" and go into <strong>rukū'</strong> (bowing). Say "Subḥāna Rabbiyal 'Aẓīm" three times.</li>
  <li>Stand up saying <strong>"Sami'Allāhu liman ḥamidah"</strong>, then say "Rabbanā lakal ḥamd."</li>
  <li>Say "Allāhu Akbar" and go into <strong>sajdah</strong> (prostration). Say "Subḥāna Rabbiyal A'lā" three times. Sit up briefly, then perform a second sajdah.</li>
  <li>After two rak'āt, sit for <strong>tashahhud</strong> — "At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibātu, assalāmu 'alayka ayyuhan-Nabiyyu wa raḥmatullāhi wa barakātuh, assalāmu 'alaynā wa 'alā 'ibādillāhiṣ-ṣāliḥīn, ash-hadu an lā ilāha illAllāh wa ash-hadu anna Muḥammadan 'abduhu wa Rasūluh."</li>
  <li>In the final sitting, after tashahhud recite <strong>Durūd Ibrāhīm (Ṣalāh al-Ibrāhīmiyyah)</strong> and then a <strong>Du'ā'</strong>.</li>
  <li>Turn the face to the right saying <strong>"Assalāmu 'alaykum wa raḥmatullāh"</strong>, then to the left with the same words. This is the salām.</li>
</ol>

<h3>Method for Girls</h3>
<p>The method for girls is the same, with some differences:</p>
<ul>
  <li>Raise hands to shoulder level (not ear level) for takbīr.</li>
  <li>Place hands on the chest (not below the navel).</li>
  <li>In rukū', bend slightly (not fully flat).</li>
  <li>In sajdah, keep the arms close to the body and the stomach resting on the thighs.</li>
  <li>In the sitting position, sit with both legs to the right side.</li>
</ul>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 0: Fiqh');

  // ──────────────────────────────────────────────
  // UNIT 1: AḤĀDĪTH
  // ──────────────────────────────────────────────

  const unitAhadith = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Aḥādīth — Sayings of Rasūlullāh ﷺ',
      description:
        'Study six key aḥādīth on truth, salām, eating with the right hand, drinking whilst sitting, and kindness to neighbours.',
      orderIndex: 1,
      content: `
<h2>Introduction</h2>
<p>A <strong>Ḥadīth</strong> (plural: <strong>Aḥādīth</strong>) is what the Prophet Muḥammad ﷺ said, did himself, or approved of when he saw someone else doing it. The aḥādīth teach us how to live our lives according to the Sunnah of our beloved Prophet ﷺ.</p>

<h2>1. Truth</h2>
<p><strong>"Speak the truth, even though it may be bitter."</strong> (Musnad Aḥmad)</p>
<p>Speaking the truth is one of the most important qualities a Muslim should have. Even when it is difficult or may bring problems, a Muslim must always speak the truth. Lying leads to sin and sin leads to the Fire.</p>

<h3>Story of 'Umar ibn al-Khaṭṭāb رضي الله عنه</h3>
<p>'Umar رضي الله عنه was once patrolling the streets at night. He overheard a mother telling her daughter to mix water into the milk they were selling. The daughter replied: "But 'Umar has forbidden this!" The mother said: "'Umar cannot see us." The daughter answered: "<em>'Umar may not see us, but the Lord of 'Umar is watching!</em>"</p>
<p>'Umar was so impressed by the girl's honesty and fear of Allāh that he later arranged for his son to marry her. From their descendants came the great khalīfah 'Umar ibn 'Abdul 'Azīz.</p>

<h2>2. Salām</h2>
<p><strong>"The closest of people to Allāh is the one who initiates saying salām to them."</strong> (Abū Dāwūd)</p>
<p>Salām means peace. When we say <strong>"Assalāmu 'alaykum"</strong> to someone, we are wishing them peace. The Prophet ﷺ taught us to be the first to greet others. The one who says salām first is closer to Allāh. Make it a habit to spread salām wherever you go!</p>

<h2>3. Using the Right Hand</h2>
<p><strong>"Say 'Bismillāh' and eat with your right hand."</strong> (Ṣaḥīḥ al-Bukhārī)</p>
<p>The Prophet ﷺ taught us to always eat and drink with our right hand. This is because Shayṭān eats with his left hand. By using our right hand and saying Bismillāh, we follow the Sunnah and keep Shayṭān away from our food.</p>

<h2>4. Drinking Whilst Sitting</h2>
<p><strong>"None of you should drink whilst standing."</strong> (Ṣaḥīḥ Muslim)</p>
<p>The Prophet ﷺ advised us to sit down when we drink. Standing while drinking is not good for the stomach. When we sit and drink calmly, we follow the Sunnah and take care of our health.</p>

<h2>5. Kindness to Neighbours</h2>
<p><strong>"Be kind to your neighbour and you will be a (complete) Mu'min."</strong> (Tirmidhī)</p>
<p>Our neighbours have rights over us. We should help them, greet them with salām, and send food to them. Being kind to our neighbours makes us complete believers. The Prophet ﷺ emphasised the rights of neighbours so much that the companions thought neighbours might even receive a share of inheritance!</p>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 1: Aḥādīth');

  // ──────────────────────────────────────────────
  // UNIT 2: SĪRAH
  // ──────────────────────────────────────────────

  const unitSirah = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Sīrah — The Life of Rasūlullāh ﷺ',
      description:
        'The events leading to Prophethood, the first revelation in Cave Ḥirā\', the first believers, and the persecution of early Muslims.',
      orderIndex: 2,
      content: `
<h2>Sīrah So Far</h2>
<p>Our beloved Prophet Muḥammad ﷺ was born in Makkah in the Year of the Elephant. His mother was <strong>Āminah</strong> and his father was <strong>'Abdullāh</strong>, who passed away before the Prophet ﷺ was born. He was nursed by <strong>Ḥalīmah Sa'diyyah</strong> for four years in the village.</p>
<p>His mother Āminah passed away when he was six years old. He was then cared for by his grandfather <strong>'Abdul Muṭṭalib</strong>, who passed away when the Prophet ﷺ was eight. After that, his uncle <strong>Abū Ṭālib</strong> looked after him.</p>
<p>He married <strong>Khadījah</strong> رضي الله عنها and was known by the people of Makkah as <strong>al-Amīn</strong> (The Most Trustworthy) and <strong>aṣ-Ṣādiq</strong> (The Most Honest).</p>

<h2>In the Cave of Ḥirā'</h2>
<p>After the age of 30, the Prophet ﷺ became increasingly distressed by the injustice, idol worship, and wrongdoing he saw around him in Makkah. He would often go to <strong>Cave Ḥirā'</strong>, a cave on a mountain outside Makkah, to worship Allāh alone and to reflect and think.</p>

<h2>The First Revelation</h2>
<p>One night, while the Prophet ﷺ was in Cave Ḥirā', the angel <strong>Jibrā'īl عليه السلام</strong> appeared before him. Jibrā'īl said: <strong>"Read."</strong> The Prophet ﷺ replied: "I cannot read." Jibrā'īl pressed him tightly and said again: "Read." The Prophet ﷺ replied: "I cannot read." Jibrā'īl pressed him a third time and then recited:</p>
<blockquote>"Read in the name of your Lord who created. He created man from a clot. Read, and your Lord is the Most Generous. He who taught by the pen. He taught man what he did not know." (Qur'ān 96:1-5)</blockquote>
<p>The Prophet ﷺ returned home shivering and frightened. He called out to Khadījah: <strong>"Cover me! Cover me!"</strong> She wrapped him in a blanket and consoled him, saying: <strong>"Allāh will never disgrace you. You keep ties with relatives, you speak the truth, you help the weak, and you are generous to guests."</strong></p>
<p>Khadījah took the Prophet ﷺ to her cousin <strong>Waraqah ibn Nawfal</strong>, an old and learned Christian. After hearing what happened, Waraqah confirmed: "This is the same angel that was sent to Mūsā. I wish I were young and could help you when your people drive you out."</p>

<h2>The First Believers</h2>
<p>The first people to accept Islam were:</p>
<ul>
  <li><strong>Khadījah</strong> رضي الله عنها — the Prophet's wife, the first person to believe.</li>
  <li><strong>Zayd ibn Ḥārithah</strong> رضي الله عنه — the Prophet's freed slave and adopted son.</li>
  <li><strong>'Alī ibn Abī Ṭālib</strong> رضي الله عنه — the Prophet's young cousin.</li>
  <li><strong>Abū Bakr</strong> رضي الله عنه — the Prophet's closest friend.</li>
</ul>
<p>Through Abū Bakr's efforts, many more people accepted Islam, including:</p>
<ul>
  <li>'Uthmān ibn 'Affān</li>
  <li>Zubayr ibn 'Awwām</li>
  <li>'Abdur Raḥmān ibn 'Awf</li>
  <li>Sa'd ibn Abī Waqqāṣ</li>
  <li>Ṭalḥah ibn 'Ubaydillāh</li>
</ul>
<p>Other early Muslims included <strong>Bilāl</strong>, <strong>Abū 'Ubaydah</strong>, <strong>Fāṭimah bint al-Khaṭṭāb</strong>, and <strong>Sumayyah</strong>.</p>

<h2>The Invitation</h2>
<p>When the verse was revealed: <strong>"Warn your nearest clan"</strong> (Qur'ān 26:214), the Prophet ﷺ gathered the tribe of Banū Hāshim for a meal. He told them about Islam and called them to believe in one God. <strong>Abū Lahab</strong> rejected the message and was hostile. However, <strong>Abū Ṭālib</strong> promised to protect the Prophet ﷺ even though he did not accept Islam.</p>

<h2>Sermon on Mount Ṣafā</h2>
<p>The Prophet ﷺ climbed <strong>Mount Ṣafā</strong>, a hill near the Ka'bah, and called out to all the tribes of Makkah. When they gathered, he asked: <strong>"Would you believe me if I told you there was an army behind this mountain?"</strong> They replied: <strong>"Yes, we have never heard you lie."</strong></p>
<p>He then said: <strong>"I am a warner to you before a severe punishment."</strong> Abū Lahab cursed and said: "May you perish! Is this why you gathered us?" In response, Allāh revealed Sūrah al-Masad (Qur'ān 111).</p>

<h2>Trouble and Pain — The Persecution of Early Muslims</h2>
<p>When the people of Makkah saw that Islam was spreading, they began to persecute the Muslims, especially the weak and poor who had no tribal protection.</p>
<ul>
  <li><strong>Bilāl</strong> رضي الله عنه was an Abyssinian slave. His master Umayyah ibn Khalaf would drag him out in the scorching heat, place a heavy boulder on his chest, and demand he renounce Islam. Bilāl would only say: <strong>"Aḥad, Aḥad"</strong> (The One, The One). Abū Bakr later bought and freed Bilāl.</li>
  <li><strong>'Ammār ibn Yāsir</strong> رضي الله عنه and his family were tortured terribly.</li>
  <li><strong>Sumayyah</strong> رضي الله عنها, the mother of 'Ammār, was struck with a spear by Abū Jahl and became the <strong>first martyr (shahīdah) of Islam</strong>.</li>
  <li><strong>Khabbāb</strong> رضي الله عنه was made to lie on burning coals.</li>
  <li><strong>Zubayr</strong> رضي الله عنه was wrapped in a mat and smoke was blown into his face.</li>
  <li>The Prophet ﷺ himself was strangled while praying, and camel intestines were placed on his back while he was in sajdah.</li>
</ul>
<p>Despite all this persecution, the early Muslims remained firm in their faith and did not give up Islam.</p>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 2: Sīrah');

  // ──────────────────────────────────────────────
  // UNIT 3: TĀRĪKH
  // ──────────────────────────────────────────────

  const unitTarikh = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Tārīkh — Stories of the Prophets: Hūd & Ṣāliḥ عليهم السلام',
      description:
        'Learn about the prophets Hūd (sent to people of \'Ād) and Ṣāliḥ (sent to Thamūd), their messages, and the consequences of disobedience.',
      orderIndex: 3,
      content: `
<h2>Hūd عليه السلام</h2>
<p>After the great flood of Nūḥ عليه السلام, the people who survived continued to worship Allāh. But as time passed, Shayṭān once again led people astray.</p>

<h3>The People of 'Ād</h3>
<p>The people of <strong>'Ād</strong> were descended from <strong>Iram</strong>, who was a grandson of Nūḥ عليه السلام. They were very rich, tall in stature, and great builders. They built magnificent buildings and lived in luxury. However, they became extremely arrogant and forgot Allāh.</p>
<p>The people of 'Ād were the <strong>first to worship idols after the Great Flood</strong>. They turned away from the worship of Allāh and began to worship statues made of stone.</p>

<h3>The Message of Hūd عليه السلام</h3>
<p>Allāh sent <strong>Hūd عليه السلام</strong> to the people of 'Ād. He called them: <strong>"Worship Allāh! You have no god other than Him."</strong> (Qur'ān 7:65)</p>
<p>But the people called him a liar and a fool. They said: <strong>"We see you in foolishness and we think you are of the liars."</strong> (Qur'ān 7:66) Hūd replied: <strong>"O my people, there is no foolishness in me, but I am a messenger from the Lord of all the worlds."</strong> (Qur'ān 7:67)</p>
<p>They challenged him to bring the punishment he was warning them about.</p>

<h3>The Punishment</h3>
<p>Allāh first sent a <strong>three-year drought</strong> upon them. When they still did not repent, they saw dark clouds approaching and thought it was rain. But it was not rain — it was a <strong>powerful, devastating wind</strong>.</p>
<p>The wind blew for <strong>8 days and 7 nights</strong>, destroying everything and everyone. Only Hūd and those who believed were saved.</p>
<blockquote>"We saved him, and those with him, by mercy from Us." (Qur'ān 11:58)</blockquote>
<blockquote>"As for 'Ād, they were destroyed by a furious violent wind." (Qur'ān 11:60)</blockquote>
<p><strong>Lesson:</strong> Never become arrogant. No matter how strong or rich we are, everything we have is from Allāh and He can take it away at any moment.</p>

<h2>Ṣāliḥ عليه السلام</h2>

<h3>The People of Thamūd</h3>
<p>The people of <strong>Thamūd</strong> were also descendants of Nūḥ عليه السلام. They lived in a place called <strong>Ḥijr</strong> in Arabia. They were skilled craftsmen who carved their houses directly from the mountains. They were blessed with gardens, springs, and abundant crops.</p>

<h3>The Message of Ṣāliḥ عليه السلام</h3>
<p>Allāh sent <strong>Ṣāliḥ عليه السلام</strong> to the people of Thamūd. He called them to worship Allāh alone and to give up their idols. But most of them refused to believe.</p>

<h3>The She-Camel — A Miraculous Sign</h3>
<p>The people demanded proof. They said: "If you are telling the truth, bring out a she-camel from that mountain." Ṣāliḥ عليه السلام made du'ā' to Allāh, and miraculously, a <strong>she-camel emerged from the mountain</strong>.</p>
<p>Ṣāliḥ warned the people: "This is Allāh's she-camel. Let her drink and eat freely. Do not harm her, or a terrible punishment will come upon you."</p>
<p>Despite seeing this miraculous sign, many still disbelieved. Some wicked people plotted and <strong>killed the she-camel</strong>.</p>

<h3>The Punishment</h3>
<p>Ṣāliḥ عليه السلام warned them: <strong>"You have only 3 days."</strong> They did not repent. Instead, they even planned to kill Ṣāliḥ. But Allāh's punishment came first.</p>
<p>A <strong>loud, terrifying noise</strong> (ṣayḥah) came from the sky, and the <strong>earth shook violently</strong>. Every single disbeliever was destroyed.</p>
<blockquote>"Ṣāliḥ turned away from them and said, 'O my people, I did convey to you the message of my Lord and wished you well, but you do not like the well-wishers.'" (Qur'ān 7:79)</blockquote>
<p><strong>Lesson:</strong> We must always respect the signs of Allāh. The Qur'ān is our sign today — we must respect it, read it, and follow its guidance.</p>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 3: Tārīkh');

  // ──────────────────────────────────────────────
  // UNIT 4: AQĀ'ID
  // ──────────────────────────────────────────────

  const unitAqaid = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Aqā\'id — Articles of Faith, Names of Allāh, Angels & Books',
      description:
        'Explore the articles of īmān, four names/qualities of Allāh (al-Ḥafīẓ, as-Samī\', al-Baṣīr, al-Aḥad), the angels and their duties, and the revealed books including the Qur\'ān.',
      orderIndex: 4,
      content: `
<h2>Articles of Īmān</h2>
<p>Every Muslim must believe in the following articles of faith:</p>
<ol>
  <li><strong>Allāh</strong> — our Creator, the One God.</li>
  <li><strong>His Angels</strong> — created from light, they carry out Allāh's commands.</li>
  <li><strong>His Books</strong> — the revelations sent to various prophets.</li>
  <li><strong>His Messengers</strong> — the prophets sent to guide mankind.</li>
  <li><strong>The Last Day</strong> — the Day of Judgement.</li>
  <li><strong>Fate</strong> — good and bad is all from Allāh.</li>
  <li><strong>Life after Death</strong> — we will be raised again after we die.</li>
</ol>

<h2>Al-Ḥafīẓ — The Protector</h2>
<p><strong>"Neither slumber nor sleep overtakes Him."</strong> (Qur'ān 2:255 — Āyatul Kursī)</p>
<p>Allāh is always awake, always watching over us and protecting us. He never sleeps and He never gets tired.</p>

<h3>Story: The Prophet ﷺ and Abū Bakr in the Cave</h3>
<p>When the Prophet ﷺ and Abū Bakr رضي الله عنه were fleeing from the enemies of Quraysh during the Hijrah, they hid in a cave called <strong>Cave Thawr</strong>. The enemies came very close — they were standing right at the entrance of the cave.</p>
<p>Abū Bakr was worried and whispered: "If they look down, they will see us." The Prophet ﷺ calmly replied: <strong>"What do you think of two, the third of whom is Allāh?"</strong> (Qur'ān 9:40)</p>
<p>Allāh had sent a spider to spin a web over the entrance of the cave, and a bird to build its nest there. The enemies saw the web and nest and assumed no one could have entered. Allāh protected His Prophet ﷺ.</p>

<h2>As-Samī' — The All-Hearing</h2>
<p>Allāh hears everything at all times — whether we speak loudly, whisper, or even keep something hidden in our hearts.</p>
<p><strong>"He is fully aware of whatever is in the hearts."</strong> (Qur'ān 67:13)</p>

<h3>Story: Three Men Trapped in a Cave</h3>
<p>Three men once took shelter in a cave during a storm. A huge rock rolled down and blocked the entrance. They could not move it. Each man then prayed to Allāh through a good deed they had done sincerely:</p>
<ul>
  <li>The first had been kind to his elderly parents.</li>
  <li>The second had been honest in a business dealing even when he could have cheated.</li>
  <li>The third had kept a trust safely for someone for many years.</li>
</ul>
<p>After each du'ā', the rock moved a little. After the third du'ā', the rock moved completely and they were free. Allāh heard each of their prayers.</p>

<h2>Al-Baṣīr — The All-Seeing</h2>
<p>Allāh watches us at all times. Nothing is hidden from Him — whether in the deepest ocean, the highest sky, or the darkest night.</p>

<h3>Story: The Father and the Sweets</h3>
<p>A father wanted to test his children. He gave each child a sweet and told them: "Go and eat it in a place where no one can see you." The children went off — some ate in a cupboard, some behind a wall, some under a tree. But one child, <strong>Fāṭimah</strong>, came back with her sweet uneaten.</p>
<p>Her father asked: "Why didn't you eat it?" She replied: <strong>"I could not find a place where Allāh was not watching me."</strong> Her father was so happy with her answer!</p>

<h2>Al-Aḥad — The One</h2>
<p>Allāh is One. He has no partner, no son, no daughter, and no equal. <strong>Shirk</strong> — associating partners with Allāh — is the worst sin in Islam.</p>
<p><strong>Sūrah al-Ikhlāṣ (Qur'ān 112):</strong> "Say, He is Allāh, the One. Allāh is Aṣ-Ṣamad. He did not give birth, nor was He born. And there is none equal to Him."</p>

<h3>Story: Bilāl and "Aḥad, Aḥad"</h3>
<p>When Bilāl رضي الله عنه was being tortured by his master for accepting Islam, he would only say: <strong>"Aḥad, Aḥad"</strong> — "The One, The One." No matter how much they tortured him, his faith in the Oneness of Allāh never wavered. Allāh rewarded Bilāl by making him the <strong>mu'adhdhin (caller to prayer) of Masjid an-Nabawī</strong> in Madīnah — one of the greatest honours in Islam.</p>

<h2>Angels</h2>
<p>Angels are special creations of Allāh, made from <strong>nūr (light)</strong>. We cannot see them. They are neither male nor female. They never disobey Allāh and are always carrying out His commands.</p>

<h3>Four Famous Angels</h3>
<ul>
  <li><strong>Jibrā'īl عليه السلام</strong> — The leader of all angels. He brought the Qur'ān and Allāh's messages to the prophets.</li>
  <li><strong>Mīkā'īl عليه السلام</strong> — In charge of climate, weather, and the distribution of provisions.</li>
  <li><strong>Malakul Mawt / 'Izrā'īl عليه السلام</strong> — The Angel of Death, who takes the souls of people when their time comes.</li>
  <li><strong>Isrāfīl عليه السلام</strong> — He will blow the trumpet on the Day of Judgement.</li>
</ul>

<h3>Other Angels</h3>
<ul>
  <li><strong>Kirāman Kātibīn</strong> — The noble recording angels who accompany every person and write down all good and bad deeds.</li>
  <li><strong>Munkar and Nakīr</strong> — The two angels who question people in the grave.</li>
</ul>

<h2>Books of Allāh</h2>
<p><strong>Revelation (Waḥy)</strong> is the way Allāh sent His message to the prophets through the angel Jibrā'īl عليه السلام.</p>

<h3>Four Main Books</h3>
<ol>
  <li><strong>Tawrāh</strong> — revealed to Prophet Mūsā عليه السلام.</li>
  <li><strong>Zabūr</strong> — revealed to Prophet Dāwūd عليه السلام.</li>
  <li><strong>Injīl</strong> — revealed to Prophet 'Īsā عليه السلام.</li>
  <li><strong>Qur'ān</strong> — revealed to Prophet Muḥammad ﷺ.</li>
</ol>

<h3>Ṣuḥuf (Scrolls)</h3>
<p>In addition to the four main books, smaller scrolls (ṣuḥuf) were also revealed:</p>
<ul>
  <li>10 scrolls to Ādam عليه السلام</li>
  <li>50 scrolls to Sheeth عليه السلام</li>
  <li>30 scrolls to Idrīs عليه السلام</li>
  <li>10–30 scrolls to Ibrāhīm عليه السلام</li>
</ul>

<h3>The Qur'ān — The Final Book</h3>
<p>The Qur'ān is the book of Allāh. Every single word in it is the word of Allāh. It was revealed through the angel Jibrā'īl عليه السلام over a period of <strong>23 years</strong>. It is in the Arabic language and is still in its <strong>original, unchanged form</strong>.</p>
<p><strong>"We have sent down the Reminder (Qur'ān) and We will surely protect it."</strong> (Qur'ān 15:9)</p>
<p>The Qur'ān has been memorised by millions of people throughout history. It contains <strong>30 Juz'</strong> (parts) and <strong>114 Surahs</strong> (chapters). It is a book of guidance for all of mankind.</p>
<p>A person who memorises the entire Qur'ān is called a <strong>Ḥāfiẓ</strong> (male) or <strong>Ḥāfiẓah</strong> (female).</p>
<p>Only the Qur'ān remains unchanged. The earlier books were changed by people over time, but Allāh Himself has promised to protect the Qur'ān.</p>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 4: Aqā\'id');

  // ──────────────────────────────────────────────
  // UNIT 5: AKHLĀQ
  // ──────────────────────────────────────────────

  const unitAkhlaq = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Akhlāq — Good Character & Manners',
      description:
        'Learn about keeping promises, gratitude and thankfulness, spreading salām, helping others, kindness to animals, and avoiding tale-bearing.',
      orderIndex: 5,
      content: `
<h2>1. Keeping Promises</h2>
<p><strong>"A person who does not keep his promise has no religion."</strong> (Musnad Aḥmad)</p>
<p>Keeping promises is one of the most important qualities of a Muslim. Breaking promises is a sign of hypocrisy.</p>

<h3>Signs of a Hypocrite (Munāfiq)</h3>
<p>The Prophet ﷺ said: "There are three signs of a hypocrite:</p>
<ol>
  <li>When he speaks, <strong>he lies</strong>.</li>
  <li>When he makes a promise, <strong>he breaks it</strong>.</li>
  <li>When he is given a trust, <strong>he betrays it</strong>.</li>
</ol>
<p>(Ṣaḥīḥ al-Bukhārī)</p>

<h3>Story: 'Umar and Hurmuzān</h3>
<p>Hurmuzān was a Persian commander captured and brought before 'Umar رضي الله عنه. He asked for water because he was thirsty. 'Umar gave him a cup and said he would not be harmed while he was drinking. Hurmuzān kept holding the cup, afraid to drink. 'Umar understood and said: "You are safe — I have given my word." Impressed by 'Umar's truthfulness and justice, Hurmuzān later <strong>accepted Islam</strong>.</p>

<h3>Six Guarantees for Jannah</h3>
<p>The Prophet ﷺ said: "Guarantee me six things and I will guarantee you Jannah: Speak the truth, fulfil your promises, hand over trusts, protect your modesty, lower your eyes, and protect your hands." (Musnad Aḥmad)</p>
<p>Allāh says in the Qur'ān: <strong>"The righteous — they fulfil their vows…"</strong> (Qur'ān 76:5-7)</p>

<h2>2. Gratitude and Thankfulness</h2>
<p><strong>"If you show gratitude, I shall certainly give you more."</strong> (Qur'ān 14:7)</p>

<h3>Three Ways to Thank Allāh</h3>
<ol>
  <li><strong>Say Alḥamdulillāh</strong> — thank Allāh with your tongue.</li>
  <li><strong>Be happy with the blessing</strong> — appreciate it in your heart.</li>
  <li><strong>Use the blessing in obedience to Allāh</strong> — use what He gave you in a good way.</li>
</ol>

<h3>Story: The Ungrateful Village</h3>
<p>There was once a village that was blessed with so much food and provision from Allāh. But instead of being grateful, the people became arrogant and ungrateful. They wasted food and did not thank Allāh. So Allāh took away His blessings, and the village fell into poverty and hardship.</p>

<p><strong>"Jealousy eats good deeds like fire eats wood."</strong> (Abū Dāwūd)</p>
<p><strong>"He who does not thank the people has not thanked Allāh."</strong> (Musnad Aḥmad)</p>
<p>When someone does you a favour, say: <strong>"Jazākallāhu khayran"</strong> (May Allāh reward you with good). This is the best way to thank someone. (Tirmidhī)</p>
<p><strong>Du'ā' of Sulaymān عليه السلام:</strong> "My Lord, enable me to become grateful to Your favour which You have bestowed on me and on my parents, and that I may do good deeds that please You, and admit me among Your pious servants." (Qur'ān 27:19)</p>

<h2>3. Spreading Salām</h2>
<p><strong>"When you are greeted with a greeting, greet with one better than it, or return the same."</strong> (Qur'ān 4:86)</p>
<p><strong>"Spread salām amongst you."</strong> (Ṣaḥīḥ Muslim)</p>
<p>The full greeting is: <strong>"Assalāmu 'alaykum wa Raḥmatullāhi wa Barakātuhu"</strong> — "May the peace, mercy of Allāh and His blessings be upon you."</p>
<p><strong>Warning:</strong> A <strong>nammām</strong> (talebearer — someone who spreads false tales about others) shall not enter Jannah. (Musnad Aḥmad)</p>

<h2>4. Helping in Good Things</h2>
<p><strong>"Help each other in good and piety, and do not help each other in sin and transgression."</strong> (Qur'ān 5:2)</p>
<p><strong>"Whoever fulfilled the needs of his brother, Allāh will fulfil his needs."</strong> (Ṣaḥīḥ al-Bukhārī)</p>

<h3>Story: 'Umar and Abū Bakr</h3>
<p>'Umar رضي الله عنه used to secretly go to the house of a blind old woman every morning to clean her house, cook her food, and fetch her water. One morning, he arrived to find the work already done. He came earlier the next day — but again, it was already done. He came even earlier — and found <strong>Abū Bakr</strong> رضي الله عنه already there, helping the old woman!</p>
<p><strong>"All creatures are Allāh's dependants, and the most beloved to Allāh is the one who is most helpful to His dependants."</strong> (Bayhaqī)</p>

<h2>5. Kindness to Animals</h2>
<p><strong>"Fear Allāh regarding these mute animals."</strong> (Abū Dāwūd)</p>
<p>The companions asked: "Is there a reward for serving animals?" The Prophet ﷺ said: <strong>"Yes, for every living creature there is a reward."</strong> (Imām Mālik)</p>

<h3>Story: The Lady Who Gave Water to a Dog</h3>
<p>A sinful lady once passed by a thirsty dog that was panting near a well. She felt sorry for it. She took off her shoe, tied it to her scarf, lowered it into the well, filled it with water, and gave the dog a drink. Because of this act of kindness, <strong>Allāh forgave all her sins and granted her Jannah</strong>.</p>

<h3>Story: The Lady Who Starved a Cat</h3>
<p>On the other hand, a woman locked up a cat and did not feed it or let it go free to find its own food. The cat died of starvation. Because of this cruelty, <strong>this woman was punished</strong>.</p>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 5: Akhlāq');

  // ──────────────────────────────────────────────
  // UNIT 6: ĀDĀB
  // ──────────────────────────────────────────────

  const unitAdab = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Ādāb — Islamic Etiquette for Daily Life',
      description:
        'Learn the Islamic etiquette of greeting, entering a house, speaking, sneezing, and yawning.',
      orderIndex: 6,
      content: `
<h2>1. Ādāb of Greeting</h2>
<p><strong>"When you are greeted with a greeting, greet with one better than it, or return the same."</strong> (Qur'ān 4:86)</p>
<p><strong>"Shaking hands removes hatred."</strong> (Imām Mālik)</p>

<h3>Who Greets First?</h3>
<ul>
  <li>The one who is <strong>passing by</strong> greets the one who is seated.</li>
  <li>The <strong>younger person</strong> greets the elder.</li>
  <li>The one who is <strong>walking</strong> greets the one who is standing.</li>
  <li>A <strong>smaller group</strong> greets the larger group.</li>
</ul>
<p>Always greet with salām when entering a house — even your own home.</p>

<h3>Ādāb of Entering a House</h3>
<ul>
  <li>Knock no more than <strong>3 times</strong>. Wait between knocks.</li>
  <li>Stand to the <strong>side of the door</strong>, not directly in front of it.</li>
  <li>When asked "Who is it?", identify yourself by name (do not just say "It's me").</li>
  <li>Enter with the <strong>right foot</strong> and say salām.</li>
</ul>

<h3>Reward for Saying Salām</h3>
<ul>
  <li><strong>"Assalāmu 'alaykum"</strong> = 10 rewards</li>
  <li><strong>"Assalāmu 'alaykum wa Raḥmatullāhi"</strong> = 20 rewards</li>
  <li><strong>"Assalāmu 'alaykum wa Raḥmatullāhi wa Barakātuhu"</strong> = 30 rewards</li>
</ul>

<h2>2. Ādāb of Speaking</h2>
<p><strong>"O you who believe, fear Allāh and speak straightforward words."</strong> (Qur'ān 33:70-71)</p>
<p><strong>"Lower your voice."</strong> (Qur'ān 31:19)</p>
<p>Islam teaches us to speak in the best manner:</p>
<ul>
  <li>Speak clearly and politely.</li>
  <li>Do not raise your voice unnecessarily.</li>
  <li>Listen attentively when others are speaking.</li>
  <li>Do not interrupt others while they are talking.</li>
  <li>Do not debate about things you do not know.</li>
  <li>Never put others down or make fun of them.</li>
</ul>

<h2>3. Ādāb of Sneezing &amp; Yawning</h2>
<p>The Prophet ﷺ said: <strong>"There are five rights of a Muslim over a Muslim"</strong> (Ṣaḥīḥ al-Bukhārī), and one of them is to respond when someone sneezes.</p>

<h3>When You Sneeze</h3>
<ol>
  <li>The one who sneezes should say: <strong>"Alḥamdulillāh"</strong> (All praise is for Allāh).</li>
  <li>Those who hear it should reply: <strong>"Yarḥamukallāh"</strong> (May Allāh have mercy on you).</li>
  <li>The sneezer then responds: <strong>"Yahdīkumullāh"</strong> (May Allāh guide you and make your condition better).</li>
</ol>

<h3>Yawning</h3>
<p><strong>"Yawning is from Shayṭān."</strong> (Ṣaḥīḥ Muslim)</p>
<p>When you feel a yawn coming:</p>
<ul>
  <li>Try to suppress it as much as possible.</li>
  <li>Cover your mouth with your hand.</li>
  <li>Do not make a noise or say "Aaah".</li>
</ul>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 6: Ādāb');

  // ══════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('📝 Creating quiz questions...');

  // --- Fiqh Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many farā\'iḍ (obligatory acts) are there in wuḍū\'?',
        options: JSON.stringify(['Two', 'Three', 'Four', 'Five']),
        correctAnswer: 'Four',
        explanation: 'The four farā\'iḍ are: wash face, wash arms with elbows, masaḥ of quarter of head, wash feet with ankles.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is NOT a sunnah of wuḍū\'?',
        options: JSON.stringify(['Saying Bismillāh', 'Using a miswāk', 'Washing the face once', 'Making niyyah (intention)']),
        correctAnswer: 'Washing the face once',
        explanation: 'Washing the face is a farḍ (obligatory), not a sunnah.',
        difficulty: 'MEDIUM',
        aiGenerated: false,
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is tayammum?',
        options: JSON.stringify(['A type of prayer', 'Purification using soil when water is unavailable', 'Washing with cold water', 'A type of ghusl']),
        correctAnswer: 'Purification using soil when water is unavailable',
        explanation: 'Tayammum is dry purification using soil or brick when water is not available. It is used as an alternative to wuḍū\' or ghusl.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'Laughing loudly during ṣalāh breaks your wuḍū\'.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Laughing loudly in ṣalāh is one of the 8 nawāqiḍ of wuḍū\'.',
        difficulty: 'MEDIUM',
        aiGenerated: false,
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does \'makrūh\' mean?',
        options: JSON.stringify(['Obligatory', 'Recommended', 'Disliked in Islam', 'Forbidden']),
        correctAnswer: 'Disliked in Islam',
        explanation: 'Makrūh means a disliked action in Islam. We should stay away from makrūh acts.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'If you only perform the four farā\'iḍ of wuḍū\', your wuḍū\' is still valid.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Your wuḍū\' will be counted but you will not get the full reward without the sunan.',
        difficulty: 'MEDIUM',
        aiGenerated: false,
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many nawāqiḍ (things that break) wuḍū\' are there?',
        options: JSON.stringify(['Five', 'Six', 'Seven', 'Eight']),
        correctAnswer: 'Eight',
        explanation: 'There are 8 nawāqiḍ of wuḍū\' including passing wind, vomiting a mouthful, fainting, and laughing loudly in ṣalāh.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
    ],
  });

  // --- Aḥādīth Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the word \'ḥadīth\' mean?',
        options: JSON.stringify(['A chapter of the Qur\'ān', 'A saying, action, or approval of the Prophet ﷺ', 'A type of prayer', 'An Islamic holiday']),
        correctAnswer: 'A saying, action, or approval of the Prophet ﷺ',
        explanation: 'A ḥadīth is what the Prophet Muḥammad ﷺ said, did himself, or approved of.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'Complete the ḥadīth: \'Speak the ____, even though it may be bitter.\'',
        options: null,
        correctAnswer: 'truth',
        explanation: '"Speak the truth, even though it may be bitter." (Musnad Aḥmad)',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth, who is closest to Allāh?',
        options: JSON.stringify(['The one who prays the most', 'The one who fasts the most', 'The one who initiates saying salām', 'The one who gives the most charity']),
        correctAnswer: 'The one who initiates saying salām',
        explanation: 'From the ḥadīth narrated in Abū Dāwūd: "The closest of people to Allāh is the one who initiates saying salām to them."',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ taught us to eat with our left hand.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The Prophet ﷺ said \'Say Bismillāh and eat with your right hand.\' Shayṭān eats with the left hand.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Why should we not drink whilst standing?',
        options: JSON.stringify(['It is forbidden', 'It is not following the sunnah and is not good for our stomach', 'Water tastes bad', 'It makes us tired']),
        correctAnswer: 'It is not following the sunnah and is not good for our stomach',
        explanation: 'The Prophet ﷺ said: "None of you should drink whilst standing." Standing is not good for the stomach.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'Complete the ḥadīth: \'Be kind to your ____ and you will be a complete Mu\'min.\'',
        options: null,
        correctAnswer: 'neighbour',
        explanation: '"Be kind to your neighbour and you will be a (complete) Mu\'min." (Tirmidhī)',
        difficulty: 'EASY',
        aiGenerated: false,
      },
    ],
  });

  // --- Sīrah Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Where did the Prophet ﷺ go to think and worship before receiving revelation?',
        options: JSON.stringify(['Masjid al-Ḥarām', 'Cave of Ḥirā\'', 'Mount Uḥud', 'Cave of Thawr']),
        correctAnswer: 'Cave of Ḥirā\'',
        explanation: 'The Prophet ﷺ used to go to Cave Ḥirā\', a cave on a mountain outside Makkah, to worship and reflect.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who was the first person to accept Islam?',
        options: JSON.stringify(['Abū Bakr', '\'Alī ibn Abī Ṭālib', 'Khadījah', 'Zayd ibn Ḥārithah']),
        correctAnswer: 'Khadījah',
        explanation: 'The Prophet\'s wife Khadījah رضي الله عنها was the first person to accept Islam.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which angel brought the first revelation to the Prophet ﷺ?',
        options: JSON.stringify(['Mīkā\'īl', 'Isrāfīl', 'Jibrā\'īl', '\'Izrā\'īl']),
        correctAnswer: 'Jibrā\'īl',
        explanation: 'The angel Jibrā\'īl عليه السلام appeared in Cave Ḥirā\' and brought the first revelation.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'The first verses revealed were from Sūrah al-Fātiḥah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The first verses revealed were Qur\'ān 96:1-5 (\'Read in the name of your Lord who created\').',
        difficulty: 'MEDIUM',
        aiGenerated: false,
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What was Bilāl\'s response when he was being tortured?',
        options: JSON.stringify(['He cursed his enemies', 'He stayed silent', 'He called out \'Aḥad, Aḥad\' (The One)', 'He asked for mercy']),
        correctAnswer: 'He called out \'Aḥad, Aḥad\' (The One)',
        explanation: 'Bilāl رضي الله عنه kept saying "Aḥad, Aḥad" (The One, The One), affirming the Oneness of Allāh despite severe torture.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who was the first martyr of Islam?',
        options: JSON.stringify(['Bilāl', '\'Ammār ibn Yāsir', 'Sumayyah', 'Khabbāb']),
        correctAnswer: 'Sumayyah',
        explanation: 'Sumayyah رضي الله عنها, the mother of \'Ammār, was struck with a spear and became the first martyr of Islam.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
    ],
  });

  // --- Tārīkh Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'To which people was the Prophet Hūd عليه السلام sent?',
        options: JSON.stringify(['Thamūd', '\'Ād', 'Quraysh', 'Banū Isrā\'īl']),
        correctAnswer: '\'Ād',
        explanation: 'Prophet Hūd عليه السلام was sent to the people of \'Ād, who were descended from Iram, a grandson of Nūḥ.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What punishment did Allāh send upon the people of \'Ād?',
        options: JSON.stringify(['A great flood', 'A powerful wind for 8 days and 7 nights', 'An earthquake', 'Fire from the sky']),
        correctAnswer: 'A powerful wind for 8 days and 7 nights',
        explanation: 'Allāh sent a devastating wind that blew for 8 days and 7 nights, destroying the entire tribe of \'Ād.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What miracle did Allāh give Prophet Ṣāliḥ عليه السلام?',
        options: JSON.stringify(['A staff that turned into a snake', 'A she-camel that came out of a mountain', 'The ability to speak to birds', 'Parting of the sea']),
        correctAnswer: 'A she-camel that came out of a mountain',
        explanation: 'Ṣāliḥ عليه السلام made du\'ā\' and Allāh caused a she-camel to emerge from a mountain as a miraculous sign.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: 'The people of \'Ād were the first to worship idols after the Great Flood.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The people of \'Ād turned away from the worship of Allāh and were the first to worship idols after the Great Flood of Nūḥ.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What happened to the people of Thamūd after they killed the she-camel?',
        options: JSON.stringify(['They were forgiven', 'A loud noise and earthquake destroyed them after 3 days', 'They were turned into stone', 'Nothing happened']),
        correctAnswer: 'A loud noise and earthquake destroyed them after 3 days',
        explanation: 'Ṣāliḥ warned them they had 3 days. A loud, terrifying noise came from the sky and the earth shook, destroying all the disbelievers.',
        difficulty: 'MEDIUM',
        aiGenerated: false,
      },
    ],
  });

  // --- Aqā'id Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many articles of īmān (faith) are there?',
        options: JSON.stringify(['Five', 'Six', 'Seven', 'Eight']),
        correctAnswer: 'Seven',
        explanation: 'The seven articles: Allāh, His angels, His books, His messengers, The Last Day, Fate, Life after death.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does \'al-Ḥafīẓ\' mean?',
        options: JSON.stringify(['The All-Hearing', 'The Protector', 'The All-Seeing', 'The One']),
        correctAnswer: 'The Protector',
        explanation: 'Al-Ḥafīẓ means The Protector. Allāh is always watching over us and protecting us. Neither slumber nor sleep overtakes Him.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which angel is known as the leader of all angels?',
        options: JSON.stringify(['Mīkā\'īl', 'Isrāfīl', 'Jibrā\'īl', '\'Izrā\'īl']),
        correctAnswer: 'Jibrā\'īl',
        explanation: 'Jibrā\'īl عليه السلام is the greatest angel and leader of all angels. He brought the Qur\'ān to the Prophet ﷺ.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many main books did Allāh reveal?',
        options: JSON.stringify(['Two', 'Three', 'Four', 'Five']),
        correctAnswer: 'Four',
        explanation: 'The four main books: Tawrāh (Mūsā), Zabūr (Dāwūd), Injīl (\'Īsā), Qur\'ān (Muḥammad ﷺ).',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'The Qur\'ān was revealed all at once.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The Qur\'ān was revealed over 23 years, little by little, through the angel Jibrā\'īl.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is shirk?',
        options: JSON.stringify(['Praying five times a day', 'Fasting in Ramaḍān', 'Worshipping others along with Allāh', 'Giving charity']),
        correctAnswer: 'Worshipping others along with Allāh',
        explanation: 'Shirk is the worst sin — believing others share Allāh\'s control over creation.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
    ],
  });

  // --- Akhlāq Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three signs of a hypocrite (munāfiq)?',
        options: JSON.stringify(['Praying, fasting, charity', 'Lying, breaking promises, betraying trust', 'Being honest, kind, generous', 'Reading Qur\'ān, giving salām, helping others']),
        correctAnswer: 'Lying, breaking promises, betraying trust',
        explanation: 'The Prophet ﷺ said: "There are three signs of a hypocrite: when he speaks he lies, when he makes a promise he breaks it, and when given a trust he betrays it." (Bukhārī)',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three ways to thank Allāh for a blessing?',
        options: JSON.stringify(['Pray, fast, give charity', 'Say Alḥamdulillāh, be happy with it, use it in obedience to Allāh', 'Tell others, write it down, celebrate', 'Ignore it, forget it, complain']),
        correctAnswer: 'Say Alḥamdulillāh, be happy with it, use it in obedience to Allāh',
        explanation: 'The three ways to thank Allāh: say Alḥamdulillāh with the tongue, be happy with the blessing in the heart, and use the blessing in obedience to Allāh.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'A nammām (talebearer) will enter Jannah according to the ḥadīth.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The Prophet ﷺ said a talebearer (nammām) shall not enter Jannah. (Musnad Aḥmad)',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What happened to the lady who gave water to a thirsty dog?',
        options: JSON.stringify(['She was punished', 'Nothing happened', 'Allāh forgave all her sins and granted her Jannah', 'She became famous']),
        correctAnswer: 'Allāh forgave all her sins and granted her Jannah',
        explanation: 'A sinful lady gave water to a thirsty dog using her shoe. Because of this act of kindness, Allāh forgave all her sins and granted her Jannah.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: 'Complete: \'He who does not thank the ____ has not thanked Allāh.\'',
        options: null,
        correctAnswer: 'people',
        explanation: '"He who does not thank the people has not thanked Allāh." (Musnad Aḥmad)',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did \'Umar\'s promise to Hurmuzān lead to?',
        options: JSON.stringify(['A war', 'Hurmuzān accepting Islam', 'Hurmuzān\'s execution', 'A peace treaty']),
        correctAnswer: 'Hurmuzān accepting Islam',
        explanation: '\'Umar kept his promise of safety. Impressed by his truthfulness and justice, Hurmuzān later accepted Islam.',
        difficulty: 'MEDIUM',
        aiGenerated: false,
      },
    ],
  });

  // --- Ādāb Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many rewards does a person get for saying \'Assalāmu \'alaykum wa Raḥmatullāhi wa Barakātuhu\'?',
        options: JSON.stringify(['Ten', 'Twenty', 'Thirty', 'Forty']),
        correctAnswer: 'Thirty',
        explanation: 'Assalāmu \'alaykum = 10 rewards, adding wa Raḥmatullāhi = 20, adding wa Barakātuhu = 30 rewards.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many times should you knock on a door before leaving?',
        options: JSON.stringify(['Once', 'Twice', 'Three times', 'As many as needed']),
        correctAnswer: 'Three times',
        explanation: 'Knock no more than 3 times. Wait between knocks. If there is no answer after 3 knocks, leave.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'When sneezing, a Muslim should say \'Alḥamdulillāh\'.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'When a Muslim sneezes, they should say Alḥamdulillāh (All praise is for Allāh).',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What should you say when entering a house?',
        options: JSON.stringify(['Bismillāh', 'Assalāmu \'alaykum', 'Allāhu Akbar', 'SubḥānAllāh']),
        correctAnswer: 'Assalāmu \'alaykum',
        explanation: 'When entering a house, step in with the right foot and say Assalāmu \'alaykum.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth, yawning comes from whom?',
        options: JSON.stringify(['Allāh', 'The angels', 'Shayṭān', 'Ourselves']),
        correctAnswer: 'Shayṭān',
        explanation: 'Yawning comes from Shayṭān; we should suppress it and cover our mouth.',
        difficulty: 'EASY',
        aiGenerated: false,
      },
    ],
  });

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
      front: 'Farḍ',
      back: 'An obligatory action in Islam. Leaving it out makes the act incomplete.',
      frontArabic: 'فرض',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'terminology'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Sunnah',
      back: 'An act practised by the Prophet ﷺ. Following it brings great reward.',
      frontArabic: 'سنة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'terminology'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Mustaḥabb',
      back: 'A recommended act beloved in Islam that brings extra reward.',
      frontArabic: 'مستحب',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'terminology'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Makrūh',
      back: 'A disliked action in Islam. We should stay away from makrūh acts.',
      frontArabic: 'مكروه',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'terminology'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Nawāqiḍ',
      back: 'Acts that break or invalidate another act, such as things that break wuḍū\'.',
      frontArabic: 'نواقض',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'terminology'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'How many farā\'iḍ in wuḍū\'?',
      back: 'Four: wash face, wash arms with elbows, masaḥ of quarter of head, wash feet with ankles.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['fiqh', 'wuḍū\''],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Tayammum',
      back: 'Dry purification using soil or brick when water is unavailable. Used instead of wuḍū\' or ghusl.',
      frontArabic: 'تيمم',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'ṭahārah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Istinjā\'',
      back: 'Cleaning oneself with water after using the washroom.',
      frontArabic: 'استنجاء',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'ṭahārah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ghusl',
      back: 'Full body washing/bath required after certain states for ritual purity.',
      frontArabic: 'غسل',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'ṭahārah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Masaḥ',
      back: 'Passing wet hands over a body part (e.g., head) during wuḍū\'.',
      frontArabic: 'مسح',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'wuḍū\''],
      difficulty: 'EASY' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: fiqhFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitFiqh.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += fiqhFlashcards.length;

  // --- Aḥādīth Flashcards ---
  const ahadithFlashcards = [
    {
      front: 'Ḥadīth (plural: Aḥādīth)',
      back: 'A saying, action, or approval of the Prophet Muḥammad ﷺ.',
      frontArabic: 'حديث / أحاديث',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aḥādīth', 'terminology'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth on Truth',
      back: '\'Speak the truth, even though it may be bitter.\' (Aḥmad)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'truth'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth on Salām',
      back: '\'The closest of people to Allāh is the one who initiates saying salām to them.\' (Abū Dāwūd)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'salām'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth on Right Hand',
      back: '\'Say Bismillāh and eat with your right hand.\' (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'manners'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth on Drinking',
      back: '\'None of you should drink whilst standing.\' (Ṣaḥīḥ Muslim)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'manners'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth on Neighbours',
      back: '\'Be kind to your neighbour and you will be a complete Mu\'min.\' (Tirmidhī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'kindness'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Mu\'min',
      back: 'A complete believer who follows the teachings of Islam.',
      frontArabic: 'مؤمن',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aḥādīth', 'vocabulary'],
      difficulty: 'EASY' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: ahadithFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitAhadith.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += ahadithFlashcards.length;

  // --- Sīrah Flashcards ---
  const sirahFlashcards = [
    {
      front: 'Cave of Ḥirā\'',
      back: 'The cave outside Makkah where the Prophet ﷺ used to reflect and worship, and where the first revelation came.',
      frontArabic: 'غار حراء',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'revelation'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'First Revelation',
      back: 'Qur\'ān 96:1-5 — \'Read in the name of your Lord who created. He created man from a clot.\'',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['sīrah', 'qur\'ān'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Khadījah رضي الله عنها',
      back: 'Wife of the Prophet ﷺ and the first person to accept Islam. She consoled him after the first revelation.',
      frontArabic: 'خديجة رضي الله عنها',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'companions'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Waraqah ibn Nawfal',
      back: 'An old, learned Christian and cousin of Khadījah who confirmed the Prophet\'s experience as genuine revelation.',
      frontArabic: null,
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'revelation'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Mount Ṣafā',
      back: 'The hill in Makkah near the Ka\'bah where the Prophet ﷺ made his open call to Islam.',
      frontArabic: 'جبل الصفا',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'da\'wah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Sumayyah رضي الله عنها',
      back: 'The first martyr of Islam, mother of \'Ammār ibn Yāsir. Killed by an enemy with a spear.',
      frontArabic: 'سمية رضي الله عنها',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'companions'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Bilāl رضي الله عنه',
      back: 'An early Muslim who was tortured but kept saying \'Aḥad, Aḥad\' (The One). Later became the mu\'adhdhin.',
      frontArabic: 'بلال رضي الله عنه',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'companions'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Al-Amīn & Aṣ-Ṣādiq',
      back: 'Titles of the Prophet ﷺ meaning \'The Most Trustworthy\' and \'The Most Honest\'.',
      frontArabic: 'الأمين / الصادق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'prophet'],
      difficulty: 'EASY' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: sirahFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitSirah.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += sirahFlashcards.length;

  // --- Tārīkh Flashcards ---
  const tarikhFlashcards = [
    {
      front: 'People of \'Ād',
      back: 'An ancient tribe descended from Iram (grandson of Nūḥ). Tall, rich builders who became arrogant and worshipped idols.',
      frontArabic: 'عاد',
      backArabic: null,
      category: 'vocabulary',
      tags: ['tārīkh', 'prophets'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Hūd عليه السلام',
      back: 'Prophet sent to the people of \'Ād. Called them to worship Allāh alone. They rejected him.',
      frontArabic: 'هود عليه السلام',
      backArabic: null,
      category: 'vocabulary',
      tags: ['tārīkh', 'prophets'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Punishment of \'Ād',
      back: 'A powerful wind blew for 8 days and 7 nights, destroying the entire tribe.',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['tārīkh', 'punishment'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Thamūd',
      back: 'An ancient tribe that lived in Ḥijr, Arabia. They could carve houses from mountains.',
      frontArabic: 'ثمود',
      backArabic: null,
      category: 'vocabulary',
      tags: ['tārīkh', 'prophets'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ṣāliḥ عليه السلام',
      back: 'Prophet sent to the people of Thamūd. Allāh gave him the miracle of a she-camel emerging from a mountain.',
      frontArabic: 'صالح عليه السلام',
      backArabic: null,
      category: 'vocabulary',
      tags: ['tārīkh', 'prophets'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'The She-Camel of Thamūd',
      back: 'A miraculous she-camel that emerged from a mountain as proof of Ṣāliḥ\'s prophethood. The people killed it, leading to their destruction.',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['tārīkh', 'miracles'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Lesson from \'Ād and Thamūd',
      back: 'Never become arrogant, always remember blessings are from Allāh and can be taken away, respect the signs of Allāh.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['tārīkh', 'lessons'],
      difficulty: 'EASY' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: tarikhFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitTarikh.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += tarikhFlashcards.length;

  // --- Aqā'id Flashcards ---
  const aqaidFlashcards = [
    {
      front: 'Al-Ḥafīẓ',
      back: 'The Protector — one of Allāh\'s names. Neither slumber nor sleep overtakes Him.',
      frontArabic: 'الحفيظ',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'names of Allāh'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'As-Samī\'',
      back: 'The All-Hearing — Allāh hears everything at all times, whether spoken secretly or openly.',
      frontArabic: 'السميع',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'names of Allāh'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Al-Baṣīr',
      back: 'The All-Seeing — Allāh watches us at all times. Nothing is hidden from Him.',
      frontArabic: 'البصير',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'names of Allāh'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Al-Aḥad',
      back: 'The One — Allāh has no partner. Shirk (associating partners) is the worst sin.',
      frontArabic: 'الأحد',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'names of Allāh'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Shirk',
      back: 'Associating partners with Allāh — believing others share His control over creation. The worst sin in Islam.',
      frontArabic: 'شرك',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'tawḥīd'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Jibrā\'īl',
      back: 'The greatest angel and leader of all angels. Brought Allāh\'s messages, books, and the Qur\'ān to the prophets.',
      frontArabic: 'جبرائيل',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'angels'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Kirāman Kātibīn',
      back: 'The noble recording angels that accompany every person and write down all good and bad deeds.',
      frontArabic: 'كراماً كاتبين',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'angels'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Waḥy',
      back: 'Revelation — the way Allāh sent His message and books to the prophets through Jibrā\'īl.',
      frontArabic: 'وحي',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'books'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ṣuḥuf',
      back: 'Scrolls or smaller books of revelation sent to various prophets (e.g., 10 to Ādam, 50 to Sheeth, 30 to Idrīs).',
      frontArabic: 'صحف',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'books'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥāfiẓ / Ḥāfiẓah',
      back: 'A male/female who has memorised the entire Qur\'ān — a miracle and means of its protection.',
      frontArabic: 'حافظ / حافظة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'qur\'ān'],
      difficulty: 'EASY' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: aqaidFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitAqaid.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += aqaidFlashcards.length;

  // --- Akhlāq Flashcards ---
  const akhlaqFlashcards = [
    {
      front: 'Munāfiq',
      back: 'A hypocrite — outwardly Muslim but inwardly not. Three signs: lies, breaks promises, betrays trust.',
      frontArabic: 'منافق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'character'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Nifāq',
      back: 'Hypocrisy — having the qualities of a munāfiq. The worst punishment in Jahannam.',
      frontArabic: 'نفاق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'character'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Three Ways to Thank Allāh',
      back: '1) Say Alḥamdulillāh, 2) Be happy with the blessing, 3) Use it in obedience to Allāh.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['akhlāq', 'gratitude'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Jazākallāhu Khayran',
      back: '\'May Allāh reward you with good\' — the best way to thank someone who has done you a favour.',
      frontArabic: 'جزاك الله خيراً',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'gratitude'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Nammām',
      back: 'A talebearer — someone who spreads false tales about others. A nammām shall not enter Jannah.',
      frontArabic: 'نمّام',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'character'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Du\'ā\' of Sulaymān عليه السلام',
      back: '\'My Lord, enable me to become grateful to Your favour…and admit me among Your pious servants.\' (Qur\'ān 27:19)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['akhlāq', 'du\'ā\''],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Story of the Thirsty Dog',
      back: 'A sinful lady gave water to a thirsty dog using her shoe. Allāh forgave all her sins and granted her Jannah.',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['akhlāq', 'kindness'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Six Guarantees for Jannah',
      back: 'Speak truth, fulfil promises, hand over trusts, protect modesty, lower eyes, protect hands. (Musnad Aḥmad)',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['akhlāq', 'promises'],
      difficulty: 'EASY' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: akhlaqFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitAkhlaq.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += akhlaqFlashcards.length;

  // --- Ādāb Flashcards ---
  const adabFlashcards = [
    {
      front: 'Assalāmu \'alaykum wa Raḥmatullāhi wa Barakātuhu',
      back: '\'May the peace, mercy of Allāh and His blessings be upon you.\' — the full Islamic greeting worth 30 rewards.',
      frontArabic: 'السلام عليكم ورحمة الله وبركاته',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ādāb', 'greeting'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ādāb of Knocking',
      back: 'Knock no more than 3 times. Wait between knocks. Stand to the side, not in front of the door. If no answer after 3, leave.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'etiquette'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Yarḥamukallāh',
      back: '\'May Allāh have mercy on you\' — said to a person who sneezes and says Alḥamdulillāh.',
      frontArabic: 'يرحمك الله',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ādāb', 'sneezing'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Yahdīkumullāh',
      back: '\'May Allāh guide you and make your condition better\' — the sneezer\'s reply to Yarḥamukallāh.',
      frontArabic: 'يهديكم الله',
      backArabic: null,
      category: 'vocabulary',
      tags: ['ādāb', 'sneezing'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ādāb of Speaking',
      back: 'Speak clearly, lower your voice, listen attentively, don\'t interrupt, don\'t debate what you don\'t know, never put others down.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'speech'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Enter with Right Foot',
      back: 'When entering a house, step in with the right foot and say salām.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'etiquette'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ādāb of Yawning',
      back: 'Yawning is from Shayṭān. Suppress it, cover your mouth with your hand. Don\'t make a noise.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'etiquette'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Salām Reward Levels',
      back: 'Assalāmu \'alaykum = 10 rewards. Adding wa Raḥmatullāhi = 20. Adding wa Barakātuhu = 30.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'greeting'],
      difficulty: 'EASY' as const,
    },
  ];

  await prisma.flashCard.createMany({
    data: adabFlashcards.map((fc, i) => ({
      ...fc,
      unitId: unitAdab.id,
      courseId: course.id,
      orderIndex: flashcardIndex + i,
    })),
  });
  flashcardIndex += adabFlashcards.length;

  // ══════════════════════════════════════════════
  // ARABIC TERMS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🔤 Creating Arabic terms...');

  await prisma.arabicTerm.createMany({
    data: [
      // Fiqh terms (8)
      { unitId: unitFiqh.id, arabicText: 'فرض', transliteration: 'Farḍ', translation: 'Obligatory act in Islamic law' },
      { unitId: unitFiqh.id, arabicText: 'سنة', transliteration: 'Sunnah', translation: 'Practice of the Prophet ﷺ' },
      { unitId: unitFiqh.id, arabicText: 'مستحب', transliteration: 'Mustaḥabb', translation: 'Recommended act in Islam' },
      { unitId: unitFiqh.id, arabicText: 'مكروه', transliteration: 'Makrūh', translation: 'Disliked act in Islam' },
      { unitId: unitFiqh.id, arabicText: 'نواقض', transliteration: 'Nawāqiḍ', translation: 'Acts that invalidate/break another act' },
      { unitId: unitFiqh.id, arabicText: 'تيمم', transliteration: 'Tayammum', translation: 'Dry purification using soil or brick' },
      { unitId: unitFiqh.id, arabicText: 'استنجاء', transliteration: 'Istinjā\'', translation: 'Cleaning oneself after using the washroom' },
      { unitId: unitFiqh.id, arabicText: 'مسح', transliteration: 'Masaḥ', translation: 'Passing wet hands over a body part' },
      // Sīrah terms (4)
      { unitId: unitSirah.id, arabicText: 'غار حراء', transliteration: 'Ghār Ḥirā\'', translation: 'Cave of Ḥirā\', site of the first revelation' },
      { unitId: unitSirah.id, arabicText: 'الصفا', transliteration: 'Aṣ-Ṣafā', translation: 'Hill in Makkah where the open call to Islam was made' },
      { unitId: unitSirah.id, arabicText: 'شهيدة', transliteration: 'Shahīdah', translation: 'Female martyr (Sumayyah was the first)' },
      { unitId: unitSirah.id, arabicText: 'مؤذن', transliteration: 'Mu\'adhdhin', translation: 'Caller to prayer (Bilāl was the first)' },
      // Tārīkh terms (4)
      { unitId: unitTarikh.id, arabicText: 'عاد', transliteration: '\'Ād', translation: 'Ancient tribe sent Prophet Hūd' },
      { unitId: unitTarikh.id, arabicText: 'ثمود', transliteration: 'Thamūd', translation: 'Ancient tribe sent Prophet Ṣāliḥ' },
      { unitId: unitTarikh.id, arabicText: 'حجر', transliteration: 'Ḥijr', translation: 'Place in Arabia where Thamūd lived' },
      { unitId: unitTarikh.id, arabicText: 'ناقة', transliteration: 'Nāqah', translation: 'She-camel (the miracle of Ṣāliḥ)' },
      // Aqā'id terms (8)
      { unitId: unitAqaid.id, arabicText: 'الحفيظ', transliteration: 'Al-Ḥafīẓ', translation: 'The Protector (name of Allāh)' },
      { unitId: unitAqaid.id, arabicText: 'السميع', transliteration: 'As-Samī\'', translation: 'The All-Hearing (name of Allāh)' },
      { unitId: unitAqaid.id, arabicText: 'البصير', transliteration: 'Al-Baṣīr', translation: 'The All-Seeing (name of Allāh)' },
      { unitId: unitAqaid.id, arabicText: 'الأحد', transliteration: 'Al-Aḥad', translation: 'The One (name of Allāh)' },
      { unitId: unitAqaid.id, arabicText: 'شرك', transliteration: 'Shirk', translation: 'Associating partners with Allāh' },
      { unitId: unitAqaid.id, arabicText: 'وحي', transliteration: 'Waḥy', translation: 'Revelation from Allāh' },
      { unitId: unitAqaid.id, arabicText: 'صحف', transliteration: 'Ṣuḥuf', translation: 'Scrolls of revelation' },
      { unitId: unitAqaid.id, arabicText: 'حافظ', transliteration: 'Ḥāfiẓ', translation: 'One who has memorised the Qur\'ān' },
      // Akhlāq terms (4)
      { unitId: unitAkhlaq.id, arabicText: 'منافق', transliteration: 'Munāfiq', translation: 'Hypocrite' },
      { unitId: unitAkhlaq.id, arabicText: 'نفاق', transliteration: 'Nifāq', translation: 'Hypocrisy' },
      { unitId: unitAkhlaq.id, arabicText: 'نمّام', transliteration: 'Nammām', translation: 'Talebearer' },
      { unitId: unitAkhlaq.id, arabicText: 'جزاك الله خيراً', transliteration: 'Jazākallāhu Khayran', translation: 'May Allāh reward you with good' },
      // Ādāb terms (3)
      { unitId: unitAdab.id, arabicText: 'يرحمك الله', transliteration: 'Yarḥamukallāh', translation: 'May Allāh have mercy on you (response to sneezer)' },
      { unitId: unitAdab.id, arabicText: 'يهديكم الله', transliteration: 'Yahdīkumullāh', translation: 'May Allāh guide you (sneezer\'s reply)' },
      { unitId: unitAdab.id, arabicText: 'السلام عليكم', transliteration: 'Assalāmu \'alaykum', translation: 'Peace be upon you (Islamic greeting)' },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 Maktab Coursebook 2 seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: Maktab Coursebook 2 (ages 7-8)');
  console.log('   - 7 Units: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā\'id, Akhlāq, Ādāb');
  console.log(`   - ${7 + 6 + 6 + 5 + 6 + 6 + 5} Quiz questions (41 total)`);
  console.log(`   - ${flashcardIndex} Flashcards`);
  console.log('   - 31 Arabic terms');
}

// Allow standalone execution
async function main() {
  try {
    await seedMaktabCoursebook2();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Maktab Coursebook 2:', error);
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
