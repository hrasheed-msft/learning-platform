import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 4 — Islamic Curriculum Seed
 * Source: An Nasihah Publications, Age Range: 9–10 years
 *
 * Covers seven subjects: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā'id, Akhlāq, Ādāb
 * Each subject becomes a Unit; lessons are embedded as rich HTML content.
 * Includes quiz questions, flashcards, and Arabic terms per unit.
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-coursebook4.ts
 */

export async function seedMaktabCoursebook4() {
  console.log('📚 Starting Maktab Coursebook 4 seed...');
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
    where: { title: 'Maktab Coursebook 4' },
  });
  if (existing) {
    console.log('⏭️  Maktab Coursebook 4 already exists — skipping.');
    return;
  }

  // ──────────────────────────────────────────────
  // COURSE
  // ──────────────────────────────────────────────

  const course = await prisma.course.create({
    data: {
      title: 'Maktab Coursebook 4',
      description:
        'An intermediate Islamic curriculum for learners aged 9–10 years. Covers masaḥ on khuffayn and wounds, wājib acts of ṣalāh, sajdah as-sahw, fasting rules and Tarāwīḥ, key aḥādīth on charity/character/friendship/trust/dhikr/du\'ā\', the Hijrah and early Madīnah period, the story of Yūsuf عليه السلام, major signs of Qiyāmah, trust and seeking permission in akhlāq, and ādāb of du\'ā\'/dressing/guests/gatherings/istinjā\'. Based on the An Nasihah Publications coursebook series.',
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
      title: 'Fiqh — Masaḥ, Wājib Acts of Ṣalāh, Ṣawm & Tarāwīḥ',
      description:
        'Rules of masaḥ on khuffayn and wounds, wājib acts of ṣalāh, sajdah as-sahw, fasting (ṣawm) including what breaks the fast, qaḍā\' and kaffārah, those excused from fasting, and Tarāwīḥ ṣalāh.',
      orderIndex: 0,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>State the conditions and method of masaḥ on khuffayn.</li>
  <li>Explain the method of masaḥ on wounds.</li>
  <li>Identify and list the wājib acts of ṣalāh.</li>
  <li>Demonstrate the method of sajdah as-sahw.</li>
  <li>Distinguish between qaḍā' and kaffārah when breaking a fast.</li>
  <li>Recognise actions that do not break the fast.</li>
  <li>Discuss the people excused from fasting and the concept of fidyah.</li>
  <li>Explain Tarāwīḥ ṣalāh and its importance in Ramaḍān.</li>
</ul>

<h3>Masaḥ 'alal Khuffayn</h3>
<p>Khuffayn are special leather socks upon which masaḥ (wiping with wet hands) can be done instead of washing the feet during wuḍū'. This is a concession from Allāh to make wuḍū' easier, especially in cold weather or while travelling.</p>
<h4>Seven Conditions for Masaḥ on the Khuff</h4>
<ol>
  <li>The khuff must be made of leather or strong material that can withstand walking for three miles or more without tearing.</li>
  <li>They must be worn after completing a full wuḍū' (feet must be washed before putting them on).</li>
  <li>They must cover the feet up to and including the ankles.</li>
  <li>Each khuff must be free from any hole or tear equal to the size of three of the smallest toes.</li>
  <li>The khuff must stay up on the feet without needing to be tied.</li>
  <li>Water must not seep through to the feet.</li>
  <li>The material must not be transparent — the skin should not be visible.</li>
</ol>

<h4>Important Points about Masaḥ</h4>
<ul>
  <li>The time for masaḥ begins from the moment wuḍū' is first broken after wearing the khuff.</li>
  <li>A <strong>muqīm</strong> (resident) can do masaḥ for <strong>24 hours</strong>.</li>
  <li>A <strong>musāfir</strong> (traveller of 54+ miles) can do masaḥ for <strong>72 hours</strong>.</li>
  <li>It is farḍ to wipe an area equal to <strong>three fingers' width</strong> on each khuff.</li>
</ul>

<h4>Method of Masaḥ</h4>
<p>Wet the fingers and draw them on the <strong>upper surface</strong> of the khuff, starting from the toes and ending at the foreleg. This is done once on each foot.</p>

<h3>Nawāqiḍ of Masaḥ (Three Invalidators)</h3>
<ol>
  <li><strong>Breaking wuḍū':</strong> If wuḍū' breaks, redo wuḍū' and make masaḥ again on the khuff.</li>
  <li><strong>Removing the khuff:</strong> If the khuff is removed, the masaḥ is cancelled. The feet must be washed.</li>
  <li><strong>Expiry of the masaḥ time:</strong> Once the permitted time ends (24h for muqīm, 72h for musāfir), the feet must be washed.</li>
</ol>

<h3>Masaḥ on Wounds</h3>
<p>Even when a person is wounded, they still have to perform ṣalāh. The following rules apply:</p>
<ul>
  <li>If the wound <strong>can be washed</strong> without harm — it <strong>must</strong> be washed.</li>
  <li>If the wound <strong>cannot be washed</strong> but <strong>can be wiped</strong> — then wipe over it.</li>
  <li>If the wound <strong>cannot be washed or wiped</strong> — do masaḥ over the bandage or plaster. There is no need for the majority of the wound to be covered.</li>
</ul>

<h3>Wājib Acts in Ṣalāh</h3>
<p>Wājib actions are those that must be done in ṣalāh. If a wājib action is missed, sajdah as-sahw must be performed. There are 14 wājib acts in four categories:</p>
<h4>A. Two Wājibāt for the Whole Ṣalāh</h4>
<ol>
  <li>To perform every action in the correct order (tartīb al-arkān).</li>
  <li>To perform every rukn calmly (ta'dīl al-arkān).</li>
</ol>
<h4>B. Five Wājibāt of Qirā'ah</h4>
<ol>
  <li>To recite Sūrah al-Fātiḥah in every rak'ah.</li>
  <li>To join a sūrah or equivalent after al-Fātiḥah in the first two rak'āt of farḍ ṣalāh.</li>
  <li>To recite al-Fātiḥah before the additional sūrah.</li>
  <li>In farḍ ṣalāh, qirā'ah is limited to the first two rak'āt only.</li>
  <li>To recite aloud or silently as required: aloud in Fajr, first two of Maghrib/'Ishā', Jumu'ah, Tarāwīḥ, Witr of Ramaḍān, 'Īd; silently in Ḍhuhr, 'Aṣr, third of Maghrib, last two of 'Ishā'.</li>
</ol>
<h4>C. Five Wājibāt from Qawmah to Salām</h4>
<ol>
  <li>To sit for the first tashahhud (Qa'dah Ūlā).</li>
  <li>To recite tashahhud in both sittings.</li>
  <li>To end ṣalāh by saying salām turning right then left.</li>
  <li>To stand in qawmah (standing position after rukū').</li>
  <li>To sit in jalsah (sitting between two sajdahs).</li>
</ol>
<h4>D. Two Wājibāt for Specific Ṣalāh</h4>
<ol>
  <li>To recite du'ā' al-qunūt in the third rak'ah of Witr ṣalāh (after the sūrah, say takbīr, then recite qunūt).</li>
  <li>To make six extra takbīrāt in 'Īd ṣalāh (three in each rak'ah).</li>
</ol>

<h3>Sajdah as-Sahw</h3>
<p>If a <strong>farḍ</strong> action is missed in ṣalāh, the entire ṣalāh must be repeated. However, if a <strong>wājib</strong> action is missed or a rukn is delayed, sajdah as-sahw must be performed.</p>
<h4>Method of Sajdah as-Sahw</h4>
<ol>
  <li>In the last rak'ah, after reciting tashahhud, make <strong>one salām</strong> to the right side only.</li>
  <li>Perform <strong>two sajdahs</strong>, reciting the tasbīḥ of sajdah as normal.</li>
  <li>Sit up, then recite tashahhud, durūd, and du'ā' as usual.</li>
  <li>Complete the ṣalāh with salām on both sides.</li>
</ol>

<h3>Ṣawm (Fasting)</h3>
<p>Fasting in the month of Ramaḍān is one of the five pillars of Islām. The Prophet ﷺ said:</p>
<p><strong>"Whoever fasts during Ramaḍān out of sincere faith and hoping to attain rewards, then all his past sins will be forgiven."</strong> (Ṣaḥīḥ al-Bukhārī)</p>
<h4>Types of Fasts</h4>
<ul>
  <li><strong>Farḍ:</strong> Fasting every day in the month of Ramaḍān.</li>
  <li><strong>Wājib:</strong> Vowed or oath-based fasts.</li>
  <li><strong>Sunnah:</strong> The 9th and 10th of Muḥarram ('Āshūrā with a day before or after).</li>
  <li><strong>Mustaḥabb:</strong> Mondays, Thursdays, 13th–15th of each Islamic month, 9th Dhul Ḥijjah.</li>
  <li><strong>Makrūh:</strong> Fasting only on the 10th of Muḥarram without combining it with the 9th or 11th.</li>
  <li><strong>Ḥarām:</strong> Five days when fasting is forbidden — 'Īd al-Fiṭr, 'Īd al-Aḍḥā, and the three days after 'Īd al-Aḍḥā (11th–13th Dhul Ḥijjah).</li>
</ul>

<h4>Breaking the Fast — Two Types</h4>
<ul>
  <li><strong>Qaḍā' only:</strong> Eating or drinking forgetfully and then intentionally breaking the fast, or swallowing items not normally eaten (e.g. a pebble, cotton). One fast must be made up.</li>
  <li><strong>Qaḍā' and Kaffārah:</strong> Intentionally eating, drinking, or having intimate relations without a valid reason. Kaffārah is: fasting <strong>60 consecutive days</strong>, or feeding 60 poor people, or freeing a slave.</li>
</ul>

<h4>Actions that Do NOT Break the Fast</h4>
<ul>
  <li>Using siwāk (tooth-stick).</li>
  <li>Applying 'iṭr (fragrance/perfume).</li>
  <li>Using eye drops.</li>
  <li>Taking an injection.</li>
  <li>Swallowing one's own saliva.</li>
  <li>Unintentional vomiting, or intentional vomiting less than a mouthful.</li>
  <li>Water entering the ears while bathing.</li>
  <li>Inhaling smoke or dust without intention.</li>
</ul>

<h4>People Excused from Fasting</h4>
<ul>
  <li>An <strong>ill person</strong> whose condition would worsen — must make up fasts later (qaḍā').</li>
  <li>A <strong>musāfir</strong> (traveller) — must make up fasts later.</li>
  <li><strong>Pregnant or breastfeeding women</strong> who fear harm to themselves or the child.</li>
  <li>A person who <strong>fears death</strong> from hunger or thirst.</li>
  <li>The <strong>very old or chronically ill</strong> who cannot fast at all — must pay <strong>fidyah</strong>.</li>
</ul>
<p><strong>Fidyah:</strong> Equivalent to Ṣadaqah al-Fiṭr per day (1.662 kg of wheat or its monetary value).</p>

<h3>Tarāwīḥ Ṣalāh</h3>
<ul>
  <li>Tarāwīḥ is a <strong>sunnah mu'akkadah</strong> (emphasised sunnah) for both men and women during Ramaḍān.</li>
  <li>It consists of <strong>20 rak'āt</strong>, performed in units of 2 rak'āt each.</li>
  <li>It is sunnah to recite the <strong>entire Qur'ān</strong> during Tarāwīḥ over the month.</li>
  <li>Tarāwīḥ is performed <strong>after 'Ishā' ṣalāh</strong> and before Witr.</li>
  <li>After every four rak'āt, it is mustaḥabb to rest briefly.</li>
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
      title: 'Aḥādīth — Charity, Character, Friendship, Trust, Dhikr & Du\'ā\'',
      description:
        'Seven aḥādīth on the best charity, good character, the company we keep, the importance of trust, the keys to Paradise, the remembrance of Allāh, and the power of du\'ā\'.',
      orderIndex: 1,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Memorise and understand seven aḥādīth on charity, character, friendship, trust, dhikr and du'ā'.</li>
  <li>Apply the teachings of these aḥādīth in daily life.</li>
  <li>Recognise the importance of good company and remembrance of Allāh.</li>
</ul>

<h3>1. Feeding Others</h3>
<p><strong>"The most virtuous charity is feeding a hungry creature."</strong> (Bayhaqī)</p>
<p>Sharing food is one of the greatest forms of ṣadaqah. When we feed others, we show gratitude for what Allāh has given us and we help those less fortunate.</p>
<h4>No to Racism</h4>
<p><strong>"You are neither better than a red person or a black person unless you surpass him in piety."</strong> (Aḥmad)</p>
<p>In Islām, no race or colour is superior to another. The only measure of superiority is taqwā (consciousness of Allāh).</p>

<h3>2. Good Character</h3>
<p><strong>"Deal with people with good manners."</strong> (Tirmidhī)</p>
<p>Good character is one of the heaviest things on the scales on the Day of Judgement. We should always treat people kindly, even those who are unkind to us.</p>
<h4>Thanking Others</h4>
<p><strong>"One who is not grateful to people is not grateful to Allāh."</strong> (Tirmidhī)</p>
<p>When someone does something good for us, we should thank them sincerely. The best way to thank someone in Islām is to say:</p>
<p class="arabic" dir="rtl" lang="ar">جَزَاكَ اللَّهُ خَيْرًا</p>
<p><em>Jazākallāhu khayran</em></p>
<p><strong>"May Allāh reward you with goodness."</strong></p>

<h3>3. Friends</h3>
<p><strong>"A person will be with whom he loves."</strong> (Ṣaḥīḥ al-Bukhārī)</p>
<p>We will be with our friends in the Ākhirah too, so we must choose our friends wisely. Good friends help us become better Muslims.</p>
<blockquote>"On that Day the wrongdoer shall bite his hands and say, 'O would that I had taken a path with the Messenger! Ah! Woe to me! Would that I had never taken so-and-so as a friend! He indeed led me astray from the reminder after it had come to me.'" (Qur'ān 25:27-29)</blockquote>
<h4>Kindness to Friends</h4>
<p><strong>"A believer is a treasure of love."</strong> (Bayhaqī)</p>
<p>Be kind to your friends, forgive their mistakes, and always wish the best for them.</p>

<h3>4. Trust</h3>
<p><strong>"Hand over the trust to the one who entrusts you, and do not betray the one who betrays you."</strong> (Abū Dāwūd)</p>
<p>Rasūlullāh ﷺ was known as <strong>Al-Amīn</strong> (the Trustworthy) even before he received prophethood. The people of Makkah trusted him with their valuables.</p>
<blockquote>"Indeed in the Messenger of Allāh you have the best example." (Qur'ān 33:21)</blockquote>

<h3>5. Keys to Paradise</h3>
<p><strong>"The keys to Paradise are to testify that there is no god but Allāh."</strong> (Aḥmad)</p>
<p>The kalimah (testimony of faith) is the key to Jannah. Just as a key has ridges, the ridges of the kalimah are our good deeds. Without good deeds, the key will not open the gate.</p>

<h3>6. Dhikr (Remembrance of Allāh)</h3>
<p><strong>"The example of the one who remembers his Lord and the one who does not, is like the example of the living and the dead."</strong> (Ṣaḥīḥ al-Bukhārī)</p>
<blockquote>"Remember Me and I shall remember you." (Qur'ān 2:152)</blockquote>
<p class="arabic" dir="rtl" lang="ar">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</p>
<p><strong>"Verily through the remembrance of Allāh the hearts find contentment."</strong> (Qur'ān 13:28)</p>

<h3>7. Du'ā' (Supplication)</h3>
<p><strong>"Allāh is angry with the person who does not ask Him for anything."</strong> (Tirmidhī)</p>
<p>Du'ā' is the essence of worship. We should always turn to Allāh for our needs, big or small. He loves it when we ask Him.</p>
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
      title: 'Sīrah — The Hijrah & Early Madīnah Period',
      description:
        'The Pledges of \'Aqabah, the Hijrah to Madīnah, the building of the first masjid, Islamic brotherhood (Mu\'ākhāt), treaties with the Jewish tribes, and the Battles of Badr, Uḥud, and Aḥzāb.',
      orderIndex: 2,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Describe the First and Second Pledges of 'Aqabah.</li>
  <li>Narrate the events of the Hijrah from Makkah to Madīnah.</li>
  <li>Explain the concept of Islamic Brotherhood (Mu'ākhāt).</li>
  <li>Summarise the key events of the Battles of Badr, Uḥud, and Aḥzāb.</li>
</ul>

<h3>The First Pledge of 'Aqabah</h3>
<p>In the 12th year of Prophethood, twelve people from Madīnah came to Makkah for Ḥajj and met Rasūlullāh ﷺ near a hillock called 'Aqabah. They accepted Islām and made the following promises:</p>
<ul>
  <li>Not to worship anyone other than Allāh.</li>
  <li>Not to steal.</li>
  <li>Not to commit zinā (adultery).</li>
  <li>Not to kill their children.</li>
  <li>Not to slander anyone.</li>
  <li>Not to disobey the Prophet ﷺ in anything good.</li>
</ul>

<h3>The Second Pledge of 'Aqabah</h3>
<p>The following year, over 70 new Muslims from Madīnah came and made five additional promises:</p>
<ol>
  <li>To listen and obey in all circumstances.</li>
  <li>To spend in the way of Allāh in times of ease and hardship.</li>
  <li>To enjoin good and forbid evil.</li>
  <li>Not to fear the blame of any blamer in Allāh's cause.</li>
  <li>To protect and support the Prophet ﷺ as they would their own families.</li>
</ol>

<h3>The Plot to Kill the Messenger ﷺ</h3>
<p>The Quraysh planned to assassinate Rasūlullāh ﷺ. Each tribe was to send a young man with a sword so that the blame would be shared. Allāh informed His Messenger of the plot. 'Alī رضي الله عنه was asked to sleep in the Prophet's bed as a decoy, and Rasūlullāh ﷺ left Makkah safely with Abū Bakr رضي الله عنه.</p>

<h3>The Hijrah</h3>
<p>Rasūlullāh ﷺ and Abū Bakr رضي الله عنه travelled south to the <strong>Cave of Thawr</strong>, where they hid for three days. By the will of Allāh, a spider spun its web and a pigeon built a nest with eggs at the entrance of the cave, making the Quraysh search party believe no one could have entered.</p>
<p><strong>Surāqah ibn Ju'shum</strong>, a Makkan horseman, chased after them seeking the reward offered by the Quraysh. Twice his horse sank into the ground miraculously. He promised to stop pursuing and hide their whereabouts.</p>

<h3>Arrival in Madīnah</h3>
<p>Rasūlullāh ﷺ first stopped at <strong>Qubā'</strong>, where he built the first masjid in Islām. He then continued to Madīnah, where his camel was guided by Allāh to the spot where <strong>Masjid an-Nabawī</strong> would be built, in the area of <strong>Banū al-Najjār</strong>. He stayed with <strong>Abū Ayyūb al-Anṣārī</strong> رضي الله عنه until the masjid and adjacent rooms were completed. The Prophet ﷺ himself worked alongside the Companions, carrying bricks and building the masjid.</p>

<h3>Islamic Brotherhood (Mu'ākhāt)</h3>
<p>The Prophet ﷺ paired each <strong>Muhājir</strong> (emigrant from Makkah) with an <strong>Anṣārī</strong> (helper from Madīnah). The Anṣār shared half of all their worldly belongings with their Muhājir brothers. This was an incredible act of generosity and brotherhood unique in human history.</p>

<h3>Treaties with the Jewish Tribes</h3>
<p>The Prophet ﷺ made peace treaties with the three main Jewish tribes of Madīnah: <strong>Banū Naḍīr</strong>, <strong>Banū Qaynuqā'</strong>, and <strong>Banū Qurayẓah</strong>. Unfortunately, all three eventually broke their treaties and betrayed the Muslims.</p>

<h3>The Hypocrites (Munāfiqūn)</h3>
<p>In Madīnah, a group of people pretended to be Muslims but were disbelievers at heart. They were led by <strong>'Abdullāh ibn Ubayy ibn Salūl</strong>. These hypocrites caused much harm to the Muslim community from within.</p>

<h3>Battle of Badr (Ramaḍān, 2 AH)</h3>
<p>The first major battle in Islām. <strong>313 Muslims</strong> faced approximately <strong>1000 Quraysh soldiers</strong>. Despite being outnumbered, the Muslims were victorious with Allāh's help — angels were sent to assist them. <strong>Abū Jahl</strong> was killed. 70 disbelievers were killed and 70 were captured. 13 Muslims were martyred (some sources say 14).</p>

<h3>Battle of Uḥud (Shawwāl, 3 AH)</h3>
<p><strong>700 Muslims</strong> faced <strong>3000 Quraysh soldiers</strong>. 300 munāfiqūn (hypocrites) deserted before the battle. The Prophet ﷺ placed 50 archers on a hill with strict orders not to leave. Initially, the Muslims were winning. However, when the archers saw the Quraysh fleeing, most left their posts to collect the spoils. <strong>Khālid ibn al-Walīd</strong> (who had not yet accepted Islām) attacked from behind. <strong>Ḥamzah</strong> رضي الله عنه, the uncle of the Prophet ﷺ, was martyred. 70 Muslims were martyred and the Prophet ﷺ himself was injured.</p>

<h3>Battle of Aḥzāb / Khandaq (Dhul Qa'dah, 5 AH)</h3>
<p>A combined army of <strong>10,000 enemy troops</strong> marched on Madīnah. <strong>Salmān al-Fārsī</strong> رضي الله عنه, who was from Persia where trenches were a known military tactic, suggested digging a trench (khandaq) around the vulnerable sides of Madīnah. The siege lasted approximately <strong>27 days</strong>. Allāh sent a fierce storm that scattered the enemy camps, extinguished their fires, and overturned their tents. The coalition army retreated in disarray.</p>
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
      title: 'Tārīkh — The Story of Yūsuf عليه السلام',
      description:
        'The complete story of Prophet Yūsuf عليه السلام: his dream, the jealousy of his brothers, the well, slavery in Egypt, prison, interpreting the king\'s dream, becoming guardian of the storehouses, and the reunion with his family.',
      orderIndex: 3,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Narrate the complete story of Yūsuf عليه السلام from Sūrah Yūsuf.</li>
  <li>Identify the key lessons: patience, forgiveness, trust in Allāh's plan.</li>
  <li>Recall the key Quranic references from Sūrah Yūsuf.</li>
</ul>

<h3>Ya'qūb عليه السلام and His Sons</h3>
<p>Ya'qūb عليه السلام had twelve sons. Among them, he especially loved <strong>Yūsuf</strong> and his youngest brother <strong>Binyāmīn</strong>, as they were from the same mother.</p>

<h3>Yūsuf's Dream</h3>
<p>As a young boy, Yūsuf عليه السلام dreamt that <strong>eleven stars, the sun, and the moon</strong> were all bowing down to him. His father Ya'qūb understood that Allāh would bless Yūsuf greatly, but warned him not to tell his brothers, as they might become jealous.</p>
<blockquote>"I saw eleven stars, and the sun and the moon — I saw them bowing down to me." (Qur'ān 12:4)</blockquote>

<h3>The Brothers' Jealousy</h3>
<p>The brothers were jealous of the special love their father showed Yūsuf. They plotted to throw him into a well. They took Yūsuf with them, saying they would play and look after him, then threw him into a deep well.</p>
<blockquote>"They said, 'Throw Yūsuf into the bottom of the well.'" (Qur'ān 12:10)</blockquote>
<p>They brought Yūsuf's shirt back to their father, stained with fake blood, claiming a wolf had eaten him. Ya'qūb عليه السلام recognised their lie and said:</p>
<p class="arabic" dir="rtl" lang="ar">فَصَبْرٌ جَمِيلٌ</p>
<p><strong>"Rather your minds have persuaded you — my stance is beautiful patience (ṣabr jamīl)."</strong> (Qur'ān 12:18)</p>

<h3>Slavery in Egypt</h3>
<p>A passing caravan found Yūsuf in the well and took him to Egypt, where he was sold as a slave. <strong>Qiṭfīr</strong>, a minister of the king, bought him and told his wife <strong>Zalīkhā</strong> to look after him well.</p>
<blockquote>"Make his stay comfortable, maybe he will be of benefit to us." (Qur'ān 12:21)</blockquote>

<h3>The Trial of Yūsuf</h3>
<p>When Yūsuf grew up, Zalīkhā tried to tempt him into wrongdoing. Yūsuf refused, saying he would never betray his master's trust. When the women of Egypt saw Yūsuf's beauty, they were so amazed they cut their own hands.</p>
<blockquote>"They said, 'Allāh forbid! This is no human being; this can only be a noble angel!'" (Qur'ān 12:31)</blockquote>
<p>Zalīkhā threatened Yūsuf with imprisonment. Yūsuf preferred prison over sin:</p>
<blockquote>"My Lord, prison is dearer to me than that to which they call me." (Qur'ān 12:33)</blockquote>

<h3>Prison and Dream Interpretation</h3>
<p>In prison, two men asked Yūsuf to interpret their dreams. One dreamt he was pressing wine; the other dreamt birds were eating from bread on his head. Yūsuf told them: one would serve wine to the king (and would be freed), and the other would be executed.</p>
<blockquote>"The matter about which you two enquire is decided." (Qur'ān 12:41)</blockquote>

<h3>The King's Dream</h3>
<p>Years later, the King of Egypt saw a dream: <strong>seven fat cows eaten by seven thin cows</strong>, and <strong>seven green ears of corn and seven dry</strong>. No one could interpret it. The freed prisoner remembered Yūsuf and went to him.</p>
<p>Yūsuf interpreted: seven years of plenty followed by seven years of severe famine. He advised:</p>
<blockquote>"For seven consecutive years you shall sow as usual, but leave what you harvest in its ear, except a little which you eat. Then after that there will come seven hard years which will consume what you had laid up in advance for them." (Qur'ān 12:47-49)</blockquote>

<h3>Yūsuf Proven Innocent</h3>
<p>The King summoned Yūsuf, but Yūsuf refused to leave prison until his innocence was proven. Zalīkhā herself admitted:</p>
<blockquote>"Now the truth has become manifest. It was I who sought to seduce him, and he is surely of the truthful." (Qur'ān 12:51-52)</blockquote>

<h3>Guardian of the Storehouses</h3>
<p>Impressed by Yūsuf's wisdom and honesty, the King appointed him guardian of the storehouses of Egypt.</p>
<blockquote>"He said, 'Appoint me over the storehouses of the land. I will indeed guard them with full knowledge.'" (Qur'ān 12:55)</blockquote>

<h3>The Brothers Come to Egypt</h3>
<p>During the famine, Yūsuf's brothers came to Egypt to buy grain. They did not recognise Yūsuf. He gave them provisions but asked them to bring their youngest brother <strong>Binyāmīn</strong> next time. Ya'qūb was reluctant but eventually agreed, trusting in Allāh. (Qur'ān 12:64)</p>
<p>When they returned with Binyāmīn, Yūsuf kept him by placing the king's measuring cup in his bag. (Qur'ān 12:70-75)</p>

<h3>The Reunion</h3>
<p>Ya'qūb told his sons never to lose hope: <strong>"Do not despair of the mercy of Allāh."</strong> (Qur'ān 12:87)</p>
<p>The brothers returned to Egypt and Yūsuf revealed his identity. He forgave them all:</p>
<p><strong>"There shall be no revenge on you! May Allāh forgive you!"</strong> (Qur'ān 12:92)</p>
<p>Ya'qūb عليه السلام's eyesight, which he had lost from years of crying, was restored when Yūsuf's shirt was placed on his face. (Qur'ān 12:94-96)</p>
<p>The whole family came to Egypt and bowed before Yūsuf — his childhood dream was fulfilled! (Qur'ān 12:99-100)</p>

<h3>Yūsuf's Du'ā'</h3>
<blockquote>"O my Lord! You have given me sovereignty and taught me the interpretation of events — Creator of the Heavens and the Earth, You are my Protector in this world and the Hereafter. Make me die as a Muslim and join me with the righteous." (Qur'ān 12:101)</blockquote>
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
      title: 'Aqā\'id — Major Signs of Qiyāmah & the Day of Judgement',
      description:
        'The major signs before the Day of Judgement: the Mahdī, the Dajjāl and protection against him, the descent of \'Īsā عليه السلام, Ya\'jūj & Ma\'jūj, the Beast, the rising of the sun from the West, the Smoke, the Trumpet, Qiyāmah, the Prophet\'s intercession, and the Bridge.',
      orderIndex: 4,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>List and describe the major signs of Qiyāmah.</li>
  <li>Explain how to protect oneself from the Dajjāl.</li>
  <li>Describe the events on the Day of Judgement: intercession, the Bridge, accountability.</li>
</ul>

<h3>The Mahdī</h3>
<p>"The Guided One" will appear before the Day of Judgement. He will be from the descendants of <strong>Fāṭimah</strong> رضي الله عنها. His name will be <strong>Muḥammad ibn 'Abdullāh</strong>. He will fill the world with justice after it has been filled with oppression.</p>

<h3>The Dajjāl</h3>
<p>The Dajjāl is a one-eyed liar who will appear near the end of time. The word <strong>"Kāfir"</strong> will be written on his forehead, readable by every believer. (Ṣaḥīḥ al-Bukhārī)</p>
<ul>
  <li>He will claim to be god and perform apparent miracles to deceive people.</li>
  <li>He will have what appears to be a paradise and a hell — but his "paradise" is actually hell and his "hell" is actually paradise.</li>
  <li>He will <strong>not be able to enter Makkah or Madīnah</strong> — angels will be guarding both sacred cities.</li>
</ul>
<h4>Protection from the Dajjāl</h4>
<ol>
  <li>Seek refuge with Allāh from the Dajjāl in every prayer (after tashahhud).</li>
  <li>Memorise the first 10 āyāt of <strong>Sūrah al-Kahf</strong>. (Abū Dāwūd)</li>
  <li>Live in Makkah or Madīnah.</li>
</ol>

<h3>'Īsā عليه السلام</h3>
<p>'Īsā عليه السلام was not killed or crucified — Allāh raised him to the heavens. He will descend before the Day of Judgement near a <strong>white minaret east of Damascus</strong>. He will kill the Dajjāl, break the cross, and rule with justice according to the Sharī'ah of Muḥammad ﷺ. He will live for 40 years and then pass away. He will be buried next to the Prophet ﷺ in Madīnah.</p>

<h3>Ya'jūj & Ma'jūj (Gog and Magog)</h3>
<p>Ya'jūj and Ma'jūj are destructive people held behind a massive wall built by <strong>Dhul Qarnayn</strong>. Near the end of time, they will break through the wall and cause great havoc on the earth. They will drink the lake of Ṭabariyyah dry. Allāh will destroy them by sending worms into their necks.</p>

<h3>The Beast (Dābbatul Arḍ)</h3>
<p>A beast will emerge from the earth and will mark people — distinguishing the believers from the disbelievers.</p>

<h3>The Sun Rising from the West</h3>
<p>When the sun rises from the West, <strong>the doors of repentance will be permanently closed</strong>. No new faith or repentance will be accepted after this sign. (Ṣaḥīḥ al-Bukhārī)</p>

<h3>The Smoke (Dukhān)</h3>
<p>A great smoke will cover the earth, causing distress to the disbelievers.</p>

<h3>The Trumpet (Ṣūr)</h3>
<p>The angel <strong>Isrāfīl</strong> عليه السلام will blow the Trumpet.</p>
<ul>
  <li><strong>First blow:</strong> Everything on the earth and in the heavens will be destroyed.</li>
  <li><strong>Second blow:</strong> All created beings will be resurrected to stand before Allāh for accountability.</li>
</ul>

<h3>Qiyāmah — The Day of Judgement</h3>
<p>All of mankind will be gathered on a vast plain. The sun will be brought close, and people will drown in their own sweat according to their deeds. People will be terrified and desperate for help.</p>

<h3>Shafā'ah — The Intercession</h3>
<p>People will go to each prophet seeking intercession: Ādam, Nūḥ, Ibrāhīm, Mūsā, and 'Īsā عليهم السلام. Each one will say <strong>"Nafsī! Nafsī!"</strong> (Myself! Myself!) — meaning they are worried about their own fate. Only our Prophet Muḥammad ﷺ will step forward and say:</p>
<p><strong>"Ummatī, Ummatī!"</strong> (My ummah, My ummah!)</p>
<p>He ﷺ will prostrate before Allāh and intercede for his followers.</p>

<h3>The Bridge (Ṣirāṭ)</h3>
<p>A bridge will be set over Jahannam that everyone must cross. It is described as being thinner than a hair and sharper than a sword. Believers will have light to guide them. Some will cross like lightning, some like wind, some like fast horses, some will crawl, and some will fall into the Fire below.</p>
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
      title: 'Akhlāq — Trust, Permission, Removing Harm & Good Neighbours',
      description:
        'The importance of trust (amānah) with the story of the cave, seeking permission before entering, removing harm from the road as ṣadaqah, and being a good neighbour.',
      orderIndex: 5,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>Explain the importance of amānah (trust) in Islām with examples.</li>
  <li>Describe the ādāb of seeking permission before entering someone's home.</li>
  <li>Appreciate the reward of removing harm from the road.</li>
  <li>Identify the rights of neighbours in Islām.</li>
</ul>

<h3>Trust (Amānah)</h3>
<blockquote>"Allāh commands you to hand over trusts to their rightful owners." (Qur'ān 4:58)</blockquote>
<p><strong>"There is no faith for the one who has no trust."</strong> (Aḥmad)</p>
<p>Trust in Islām covers many things: physical items entrusted to us, advice we give, and even private conversations shared in gatherings.</p>
<h4>Three Signs of a Hypocrite</h4>
<p><strong>"If he speaks, he lies. If he makes a promise, he does not keep it. If he is entrusted, he betrays the trust."</strong> (Ṣaḥīḥ al-Bukhārī)</p>

<h4>The Story of the Three Men in the Cave</h4>
<p>Three men were travelling when heavy rain forced them to take shelter in a cave. A massive boulder rolled down and blocked the entrance. Each man called upon Allāh through a sincere deed:</p>
<ul>
  <li><strong>First man:</strong> He honoured his elderly parents — he would not eat or let his children eat until his parents had their milk first. One night they slept before he could serve them, so he stood all night holding the milk until they woke.</li>
  <li><strong>Second man:</strong> He avoided zinā (adultery) out of fear of Allāh — despite being in a position of power, he walked away.</li>
  <li><strong>Third man:</strong> He kept a worker's wages as a trust and invested them. When the worker returned years later, the man gave him everything — the original wages plus all the profits from the investment.</li>
</ul>
<p>After each man's du'ā', the boulder moved a little, and after the third du'ā', they were freed. This shows the power of sincerity and keeping trusts.</p>

<h3>Seeking Permission</h3>
<blockquote>"Do not enter any houses other than your own unless you seek permission and greet the residents with salām." (Qur'ān 24:27-28)</blockquote>
<p>Rules of seeking permission:</p>
<ul>
  <li>Knock or ring the bell and wait.</li>
  <li>If there is no answer after three tries, go away.</li>
  <li>State your name when asked "Who is it?" — do not just say "me."</li>
  <li>Do not stand directly in front of the door.</li>
  <li>We should on no account look or peep inside someone's house.</li>
</ul>
<blockquote>"Successful indeed are the believers... those who are faithful to their trusts and their covenants." (Qur'ān 23:8, 10-11)</blockquote>

<h3>Removing Harm from the Road</h3>
<p><strong>"Removing harm from the road is ṣadaqah."</strong> (Ṣaḥīḥ al-Bukhārī)</p>
<p>A man once removed a thorny branch from the path, and Allāh forgave him for it. Even small good deeds can earn great reward.</p>

<h3>Good Neighbours</h3>
<p><strong>"He is not a believer, who eats to his fill, whilst his neighbour besides him goes hungry."</strong> (Ṣaḥīḥ al-Bukhārī)</p>
<blockquote>"Be good to parents, kinsmen, orphans, the needy, the close neighbour, the distant neighbour, the companion at your side, and the wayfarer." (Qur'ān 4:36)</blockquote>
<p>The rights of neighbours include: not causing harm, being patient with their faults, sharing food, visiting them when ill, consoling them in grief, and congratulating them in their happiness.</p>
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
      title: 'Ādāb — Du\'ā\', Dressing, Guests, Gatherings & Istinjā\'',
      description:
        'The etiquette of making du\'ā\', Islamic dress code including satr, manners of hosts and guests, conduct in gatherings, and the ādāb of istinjā\' (toilet etiquette).',
      orderIndex: 6,
      content: `
<h2>Learning Objectives</h2>
<ul>
  <li>List the manners and etiquette of making du'ā'.</li>
  <li>Identify the times when du'ā' is most readily accepted.</li>
  <li>Explain the Islamic dress code and the concept of satr.</li>
  <li>Describe the ādāb of being a guest and being a host.</li>
  <li>State the rules of conduct in gatherings.</li>
  <li>List the ādāb of istinjā' (toilet etiquette).</li>
</ul>

<h3>Manners of Making Du'ā'</h3>
<ol>
  <li>Face the Qiblah and be in the state of wuḍū'.</li>
  <li>Raise hands to chest level.</li>
  <li>Begin by praising Allāh.</li>
  <li>Recite ṣalawāt (durūd) upon the Prophet ﷺ.</li>
  <li>Beg Allāh with humility and sincerity.</li>
  <li>Ask for forgiveness.</li>
  <li>Cry while making du'ā' — or at least try to.</li>
  <li>Do not pray for anything sinful or for the breaking of family ties.</li>
  <li>Pray for yourself first, then for others.</li>
  <li>Do not lose hope — Allāh answers all du'ā' in His wisdom.</li>
  <li>Say Āmīn at the end.</li>
</ol>

<h4>Times When Du'ā' is Readily Accepted</h4>
<ul>
  <li>The middle of the night (Tahajjud time).</li>
  <li>Friday between 'Aṣr and Maghrib.</li>
  <li>The Night of Power (Laylatul Qadr).</li>
  <li>Between the adhān and iqāmah.</li>
  <li>While drinking Zamzam water.</li>
  <li>While in sajdah (prostration).</li>
  <li>While fasting.</li>
  <li>While travelling.</li>
  <li>The du'ā' of the oppressed.</li>
</ul>

<h4>Du'ā' from the Qur'ān</h4>
<p class="arabic" dir="rtl" lang="ar">رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ</p>
<p><strong>"Our Lord, give us good in this world and good in the Hereafter, and save us from the punishment of the Fire."</strong> (Qur'ān 2:201)</p>

<h3>Dress Code in Islām</h3>
<blockquote>"O Children of Ādam! We have sent down to you clothing to cover your nakedness, and as an adornment. And the clothing of taqwā — that is the best." (Qur'ān 7:26)</blockquote>
<h4>Satr (Area that Must Be Covered)</h4>
<ul>
  <li><strong>Boys:</strong> From below the navel to and including the knees.</li>
  <li><strong>Girls:</strong> The whole body except the hands, face, and feet.</li>
</ul>
<p>Clothing should not be tight, transparent, or resemble the clothing of the opposite gender. The satr must be covered at all times.</p>

<h3>Guest and Host Etiquette</h3>
<p>The story of Ibrāhīm عليه السلام is the best example of hospitality. When angels came to him as guests, he quickly prepared a roasted calf for them.</p>
<blockquote>"Has the story of Ibrāhīm's honoured guests reached you? When they came to him and said 'Peace!' He said 'Peace!' and went quickly to his family and brought a roasted calf." (Qur'ān 51:24-28)</blockquote>
<h4>Manners of the Guest</h4>
<ul>
  <li>Inform the host before arriving.</li>
  <li>Be punctual — arrive on time.</li>
  <li>Seek permission before entering.</li>
  <li>Greet with salām.</li>
  <li>Sit where you are told to sit.</li>
  <li>Do not look around the house — remember you are not an inspector.</li>
  <li>Do not sit on the host's personal seat.</li>
  <li>Do not overstay your welcome.</li>
  <li>Make du'ā' for the host before leaving.</li>
</ul>
<h4>Manners of the Host</h4>
<ul>
  <li>Greet guests warmly and with a smile.</li>
  <li>Be generous in hospitality.</li>
  <li>Prepare special meals for guests.</li>
  <li>Do not force guests to eat more than they wish.</li>
  <li>Follow guests to the door when they leave.</li>
</ul>

<h3>Conduct in Gatherings</h3>
<blockquote>"When it is said 'make room in gatherings,' then make room; Allāh will make room for you." (Qur'ān 58:11)</blockquote>
<ul>
  <li>Greet everyone with salām when entering and leaving.</li>
  <li>Sit wherever there is space — do not push between two people.</li>
  <li>Do not whisper to one person excluding a third.</li>
  <li>Do not make someone get up from their seat to sit in their place.</li>
</ul>
<h4>Du'ā' After a Gathering</h4>
<p class="arabic" dir="rtl" lang="ar">سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ</p>
<p><strong>"Glory is to You, O Allāh. I bear witness that there is none worthy of worship but You. I seek Your forgiveness and repent to You."</strong> (Al-Ḥākim)</p>
<p>This du'ā' is a kaffārah (expiation) for anything wrong that may have been said during the gathering.</p>

<h3>Ādāb of Istinjā' (Toilet Etiquette)</h3>
<ol>
  <li>Cover your hair before entering.</li>
  <li>Recite the du'ā' before entering.</li>
  <li>Enter with your <strong>left foot</strong>.</li>
  <li>Do not face the Qiblah or turn your back to it.</li>
  <li>Do not talk inside the washroom.</li>
  <li>Use tissue first, then wash with water.</li>
  <li>Wash with the <strong>left hand</strong> — do not use the right hand.</li>
  <li>Leave with your <strong>right foot</strong>.</li>
  <li>Recite upon leaving: <strong>"Ghufrānaka"</strong> (I seek Your forgiveness).</li>
</ol>
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
        questionText: 'How long can a muqīm (resident) do masaḥ on the khuffayn?',
        options: JSON.stringify(['12 hours', '24 hours', '48 hours', '72 hours']),
        correctAnswer: '24 hours',
        explanation: 'A muqīm (resident) can do masaḥ for 24 hours, while a musāfir (traveller of 54+ miles) can do masaḥ for 72 hours.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'TRUE_FALSE',
        questionText: 'If a farḍ action is missed in ṣalāh, sajdah as-sahw is sufficient to compensate.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Sajdah as-sahw only compensates for missing a wājib action. If a farḍ action is missed, the entire ṣalāh must be repeated.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is kaffārah for intentionally breaking a fast in Ramaḍān?',
        options: JSON.stringify(['Fasting 30 days', 'Fasting 60 consecutive days', 'Paying zakāh', 'Repeating one fast']),
        correctAnswer: 'Fasting 60 consecutive days',
        explanation: 'Kaffārah is fasting 60 consecutive days, or feeding 60 poor people, or freeing a slave (if possible).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many rak\'āt are in Tarāwīḥ ṣalāh?',
        options: JSON.stringify(['Eight', 'Twelve', 'Twenty', 'Thirty']),
        correctAnswer: 'Twenty',
        explanation: 'Tarāwīḥ consists of 20 rak\'āt, performed in units of two rak\'āt after \'Ishā\' during Ramaḍān.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitFiqh.id,
        type: 'FILL_BLANK',
        questionText: 'Masaḥ on the khuff is done by drawing the fingers on the _____ surface of the khuff.',
        options: null,
        correctAnswer: 'upper',
        explanation: 'The wet fingers are drawn on the upper surface of the khuff, starting from the toes to the foreleg.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Aḥādīth Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth, what is the most virtuous charity?',
        options: JSON.stringify(['Giving gold coins', 'Feeding a hungry creature', 'Building a masjid', 'Reciting Qur\'ān']),
        correctAnswer: 'Feeding a hungry creature',
        explanation: '"The most virtuous charity is feeding a hungry creature." (Bayhaqī)',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'FILL_BLANK',
        questionText: 'One who is not grateful to _____ is not grateful to Allāh.',
        options: null,
        correctAnswer: 'people',
        explanation: '"One who is not grateful to people is not grateful to Allāh." (Tirmidhī)',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAhadith.id,
        type: 'TRUE_FALSE',
        questionText: 'According to a ḥadīth, we will be with the people we love in the Ākhirah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: '"A person will be with whom he loves." (Ṣaḥīḥ al-Bukhārī) — We will be with our beloved ones in the Hereafter.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does \'Jazākallāhu khayran\' mean?',
        options: JSON.stringify(['Peace be upon you', 'May Allāh reward you with goodness', 'Allāh is the Greatest', 'In the name of Allāh']),
        correctAnswer: 'May Allāh reward you with goodness',
        explanation: 'Jazākallāhu khayran is the Islamic way of thanking someone, meaning "May Allāh reward you with goodness."',
        difficulty: 'EASY',
      },
      {
        unitId: unitAhadith.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is dhikr compared to in the ḥadīth?',
        options: JSON.stringify(['Light in darkness', 'Rain on dry land', 'The difference between the living and the dead', 'A shield from harm']),
        correctAnswer: 'The difference between the living and the dead',
        explanation: '"The example of the one who remembers his Lord and the one who does not, is like the example of the living and the dead." (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Sīrah Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Where did the Prophet ﷺ and Abū Bakr hide during the Hijrah?',
        options: JSON.stringify(['Cave of Ḥirā\'', 'Cave of Thawr', 'Masjid al-Aqṣā', 'Mount Uḥud']),
        correctAnswer: 'Cave of Thawr',
        explanation: 'During the Hijrah, the Prophet ﷺ and Abū Bakr hid in the Cave of Thawr for three days.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many Muslims fought in the Battle of Badr?',
        options: JSON.stringify(['70', '313', '700', '1000']),
        correctAnswer: '313',
        explanation: '313 Muslims faced approximately 1000 Quraysh soldiers at the Battle of Badr in Ramaḍān 2 AH.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'TRUE_FALSE',
        questionText: 'The Muslims won the Battle of Uḥud decisively.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The archers left their positions, allowing Khālid ibn al-Walīd to attack from behind. 70 Muslims were martyred including Ḥamzah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'FILL_BLANK',
        questionText: 'The idea of digging a trench in the Battle of Aḥzāb came from _____.',
        options: null,
        correctAnswer: 'Salmān al-Fārsī',
        explanation: 'Salmān al-Fārsī suggested digging a trench around Madīnah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitSirah.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What protected the entrance of the Cave of Thawr?',
        options: JSON.stringify(['A large boulder', 'Armed guards', 'A spider\'s web and a pigeon\'s nest', 'A sandstorm']),
        correctAnswer: 'A spider\'s web and a pigeon\'s nest',
        explanation: 'By the will of Allāh, a spider spun its web and a pigeon built a nest at the entrance.',
        difficulty: 'EASY',
      },
    ],
  });

  // --- Tārīkh Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did Yūsuf عليه السلام dream about as a child?',
        options: JSON.stringify(['A great flood', 'Eleven stars, the sun and the moon bowing to him', 'A burning bush', 'Seven fat cows']),
        correctAnswer: 'Eleven stars, the sun and the moon bowing to him',
        explanation: 'Yūsuf dreamt that eleven stars, the sun and the moon were bowing to him. (Qur\'ān 12:4)',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'FILL_BLANK',
        questionText: 'Yūsuf عليه السلام\'s brothers threw him into a _____.',
        options: null,
        correctAnswer: 'well',
        explanation: 'Out of jealousy, his brothers threw him into a well. (Qur\'ān 12:15)',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What position did Yūsuf عليه السلام receive from the King of Egypt?',
        options: JSON.stringify(['Chief minister', 'Guardian of the storehouses', 'Head of the army', 'Royal advisor']),
        correctAnswer: 'Guardian of the storehouses',
        explanation: 'He was made guardian of the storehouses of Egypt. (Qur\'ān 12:55)',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitTarikh.id,
        type: 'TRUE_FALSE',
        questionText: 'Yūsuf عليه السلام took revenge on his brothers when they came to Egypt.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Yūsuf forgave his brothers. (Qur\'ān 12:92)',
        difficulty: 'EASY',
      },
      {
        unitId: unitTarikh.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How did Ya\'qūb عليه السلام\'s eyesight return?',
        options: JSON.stringify(['He made du\'ā\'', 'Yūsuf\'s shirt was placed on his face', 'Medicine from Egypt', 'An angel healed him']),
        correctAnswer: 'Yūsuf\'s shirt was placed on his face',
        explanation: 'Yūsuf told his brothers to place his shirt on their father\'s face. (Qur\'ān 12:93-96)',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Aqā'id Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What will be written on the Dajjāl\'s forehead?',
        options: JSON.stringify(['Mu\'min', 'Kāfir', 'Amīn', 'Ṣādiq']),
        correctAnswer: 'Kāfir',
        explanation: 'The word "Kāfir" will be readable by every believer. (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which sūrah provides protection from the Dajjāl?',
        options: JSON.stringify(['Sūrah al-Baqarah', 'Sūrah al-Kahf', 'Sūrah Yāsīn', 'Sūrah ar-Raḥmān']),
        correctAnswer: 'Sūrah al-Kahf',
        explanation: 'Memorising the first 10 āyāt of Sūrah al-Kahf provides protection. (Abū Dāwūd)',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'TRUE_FALSE',
        questionText: 'The Dajjāl will be able to enter Makkah and Madīnah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The Dajjāl cannot enter Makkah or Madīnah. Angels will guard both.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAqaid.id,
        type: 'FILL_BLANK',
        questionText: 'On the Day of Judgement, our Prophet ﷺ will say: \'Ummatī, _____!\'',
        options: null,
        correctAnswer: 'Ummatī',
        explanation: 'While other prophets say "Nafsī!", our Prophet ﷺ will cry "Ummatī, Ummatī!"',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAqaid.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What happens when the sun rises from the West?',
        options: JSON.stringify(['Everyone enters Jannah', 'The doors of repentance will be closed', 'The Dajjāl appears', 'The Mahdī arrives']),
        correctAnswer: 'The doors of repentance will be closed',
        explanation: 'When the sun rises from the West, repentance will no longer be accepted. (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Akhlāq Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the ḥadīth, what three qualities single out a hypocrite?',
        options: JSON.stringify(['Lies when speaking, breaks promises, betrays trust', 'Sleeps late, eats much, talks much', 'Prays late, skips fasting, avoids charity', 'Avoids salām, ignores neighbours, wastes money']),
        correctAnswer: 'Lies when speaking, breaks promises, betrays trust',
        explanation: '(Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'TRUE_FALSE',
        questionText: 'It is permissible to look inside someone\'s house if the door is open.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'We must seek permission first. (Qur\'ān 24:27-28)',
        difficulty: 'EASY',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'FILL_BLANK',
        questionText: 'Removing harm from the road is _____.',
        options: null,
        correctAnswer: 'ṣadaqah',
        explanation: '(Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAkhlaq.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the ḥadīth \'He is not a believer, who eats to his fill, whilst his neighbour goes hungry\' teach us?',
        options: JSON.stringify(['We should always fast', 'We must care for our neighbours\' needs', 'We should not eat at home', 'Neighbours should cook for us']),
        correctAnswer: 'We must care for our neighbours\' needs',
        explanation: 'This teaches the importance of looking after our neighbours. (Ṣaḥīḥ al-Bukhārī)',
        difficulty: 'EASY',
      },
    ],
  });

  // --- Ādāb Quizzes ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the first manner when making du\'ā\'?',
        options: JSON.stringify(['Raise hands above head', 'Face the Qiblah and be in the state of wuḍū\'', 'Close your eyes tightly', 'Stand on one foot']),
        correctAnswer: 'Face the Qiblah and be in the state of wuḍū\'',
        explanation: 'One should face the Qiblah and be in wuḍū\', then raise hands and begin with praise of Allāh.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAdab.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the satr for boys?',
        options: JSON.stringify(['Above the waist', 'Below the navel including the knees', 'The whole body', 'Hands and feet only']),
        correctAnswer: 'Below the navel including the knees',
        explanation: 'The satr for boys is from below the navel to and including the knees.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unitAdab.id,
        type: 'TRUE_FALSE',
        questionText: 'A guest should look around the host\'s house to see what they have.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'A guest should not look around — sit where told and be respectful.',
        difficulty: 'EASY',
      },
      {
        unitId: unitAdab.id,
        type: 'FILL_BLANK',
        questionText: 'The du\'ā\' after a gathering includes: \'I bear witness that there is none worthy of worship but _____\'',
        options: null,
        correctAnswer: 'You (Allāh)',
        explanation: 'The du\'ā\': "Glory is to You, O Allāh. I bear witness that none is worthy of worship but You..." (Al-Ḥākim)',
        difficulty: 'MEDIUM',
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
      front: 'Khuffayn',
      back: 'Special leather socks upon which masaḥ can be done instead of washing feet in wuḍū\'.',
      frontArabic: 'خُفَّيْن',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'masaḥ', 'khuffayn'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Masaḥ',
      back: 'Wiping with wet hands — used on khuffayn, wounds, or during wuḍū\' on the head.',
      frontArabic: 'مَسْح',
      backArabic: null,
      category: 'vocabulary',
      tags: ['fiqh', 'masaḥ', 'wuḍū'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Muqīm vs Musāfir',
      back: 'Muqīm: A resident (masaḥ for 24 hours). Musāfir: A traveller of 54+ miles (masaḥ for 72 hours).',
      frontArabic: 'مُقِيم / مُسَافِر',
      backArabic: null,
      category: 'definition',
      tags: ['fiqh', 'masaḥ', 'travel'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Nawāqiḍ of Masaḥ',
      back: '1. Breaking wuḍū\' (redo with masaḥ). 2. Removing the khuff (wash feet). 3. Expiry of the masaḥ time (wash feet).',
      frontArabic: 'نَوَاقِض',
      backArabic: null,
      category: 'rule',
      tags: ['fiqh', 'masaḥ', 'nawāqiḍ'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Wājib acts in Ṣalāh',
      back: 'Actions that must be done: if missed, sajdah as-sahw is required.',
      frontArabic: 'وَاجِب',
      backArabic: null,
      category: 'definition',
      tags: ['fiqh', 'ṣalāh', 'wājib'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Sajdah as-Sahw',
      back: 'Two extra sajdahs to compensate for missing a wājib action in ṣalāh.',
      frontArabic: 'سَجْدَة السَّهْو',
      backArabic: null,
      category: 'definition',
      tags: ['fiqh', 'ṣalāh', 'sajdah-sahw'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Qaḍā\' vs Kaffārah',
      back: 'Qaḍā\': Making up one missed fast. Kaffārah: Penalty for intentionally breaking — 60 consecutive fasts.',
      frontArabic: 'قَضَاء / كَفَّارَة',
      backArabic: null,
      category: 'definition',
      tags: ['fiqh', 'ṣawm', 'qaḍā', 'kaffārah'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Fidyah',
      back: 'Compensation for someone who cannot fast due to chronic illness — equivalent to Ṣadaqah al-Fiṭr per fast.',
      frontArabic: 'فِدْيَة',
      backArabic: null,
      category: 'definition',
      tags: ['fiqh', 'ṣawm', 'fidyah'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Tarāwīḥ Ṣalāh',
      back: 'An emphasised sunnah ṣalāh of 20 rak\'āt performed during Ramaḍān after \'Ishā\'.',
      frontArabic: 'تَرَاوِيح',
      backArabic: null,
      category: 'definition',
      tags: ['fiqh', 'tarāwīḥ', 'ramaḍān'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'What doesn\'t break the fast?',
      back: 'Using siwāk, applying \'iṭr, using eye drops, injections, swallowing saliva, unintentional vomiting less than a mouthful.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['fiqh', 'ṣawm', 'rules'],
      difficulty: 'MEDIUM' as const,
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
      front: 'Ḥadīth on Charity',
      back: '"The most virtuous charity is feeding a hungry creature." (Bayhaqī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'charity', 'feeding'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth on Gratitude',
      back: '"One who is not grateful to people is not grateful to Allāh." (Tirmidhī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'gratitude', 'shukr'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth on Company',
      back: '"A person will be with whom he loves." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'love', 'ākhirah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Jazākallāhu Khayran',
      back: 'The Islamic way of thanking: "May Allāh reward you with goodness."',
      frontArabic: 'جَزَاكَ اللَّهُ خَيْرًا',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aḥādīth', 'gratitude', 'du\'ā\''],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ḥadīth on Dhikr',
      back: '"The one who remembers his Lord and the one who does not is like the living and the dead." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'dhikr', 'remembrance'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ḥadīth on Truthfulness',
      back: '"Truthfulness leads to righteousness, and righteousness leads to Paradise." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'ṣidq', 'truthfulness'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ḥadīth on Anger',
      back: '"The strong person is not the one who can wrestle, but the one who controls himself at the time of anger." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'anger', 'self-control'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ḥadīth on Kindness to Animals',
      back: '"A woman was punished because of a cat which she had imprisoned till it died." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['aḥādīth', 'animals', 'mercy'],
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
      front: 'The Hijrah',
      back: 'The migration of the Prophet ﷺ from Makkah to Madīnah in 622 CE, marking the start of the Islamic calendar.',
      frontArabic: 'هِجْرَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['sīrah', 'hijrah', 'madīnah'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Cave of Thawr',
      back: 'Where the Prophet ﷺ and Abū Bakr hid for three days during the Hijrah. A spider and pigeon protected the entrance.',
      frontArabic: 'غَارِ ثَوْر',
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'hijrah', 'thawr'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Masjid Qubā\'',
      back: 'The first masjid built in Islam, constructed upon the Prophet ﷺ\'s arrival near Madīnah.',
      frontArabic: 'مَسْجِدِ قُبَاء',
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'hijrah', 'qubā'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Battle of Badr (2 AH)',
      back: 'First major battle of Islam. 313 Muslims defeated ~1000 Quraysh. Allāh sent angels to help.',
      frontArabic: 'بَدْر',
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'badr', 'battle'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Battle of Uḥud (3 AH)',
      back: 'Archers disobeyed the Prophet ﷺ. Khālid ibn al-Walīd attacked from behind. 70 martyred including Ḥamzah.',
      frontArabic: 'أُحُد',
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'uḥud', 'battle'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Battle of Aḥzāb/Khandaq (5 AH)',
      back: 'The Battle of the Trench. Salmān al-Fārsī suggested digging a khandaq. 10,000 enemies besieged Madīnah.',
      frontArabic: 'أَحْزَاب / خَنْدَق',
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'aḥzāb', 'khandaq'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Treaty of Ḥudaybiyyah (6 AH)',
      back: 'A peace treaty with the Quraysh. The Qur\'ān called it a "clear victory" (Fatḥ Mubīn).',
      frontArabic: 'حُدَيْبِيَّة',
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'ḥudaybiyyah', 'treaty'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Conquest of Makkah (8 AH)',
      back: 'The Prophet ﷺ entered Makkah with 10,000 Muslims. He forgave the Quraysh and cleansed the Ka\'bah of idols.',
      frontArabic: 'فَتْحِ مَكَّة',
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'fatḥ', 'makkah'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ṣurrāqah ibn Mālik',
      back: 'A Quraysh tracker who pursued the Prophet ﷺ during Hijrah but his horse\'s legs sank into the sand.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'hijrah', 'miracle'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Muṣ\'ab ibn \'Umayr',
      back: 'The ambassador of Islam sent to Madīnah before the Hijrah to teach the people about Islam.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['sīrah', 'companion', 'madīnah'],
      difficulty: 'MEDIUM' as const,
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
      front: 'Yūsuf عليه السلام',
      back: 'A prophet known for his beauty, patience, and dream interpretation. Sold as a slave, imprisoned, then became Egypt\'s treasurer.',
      frontArabic: 'يُوسُف',
      backArabic: null,
      category: 'definition',
      tags: ['tārīkh', 'yūsuf', 'prophet'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ya\'qūb عليه السلام',
      back: 'Father of Yūsuf, also known as Isrā\'īl. He wept so much for Yūsuf that he lost his eyesight.',
      frontArabic: 'يَعْقُوب',
      backArabic: null,
      category: 'definition',
      tags: ['tārīkh', 'ya\'qūb', 'prophet'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Dream of Yūsuf',
      back: 'Eleven stars, the sun and the moon bowing down to him — fulfilled when his family came to Egypt.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['tārīkh', 'yūsuf', 'dream'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'The Well',
      back: 'Yūsuf\'s brothers threw him into a well out of jealousy. A passing caravan found and sold him.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['tārīkh', 'yūsuf', 'trial'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'The Prison',
      back: 'Yūsuf was falsely accused and imprisoned. He interpreted the dreams of two prisoners and later the King.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['tārīkh', 'yūsuf', 'prison'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Guardian of the Storehouses',
      back: 'The King appointed Yūsuf as treasurer of Egypt to manage food during years of plenty and famine.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['tārīkh', 'yūsuf', 'egypt'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Forgiveness of Yūsuf',
      back: '"There shall be no revenge on you! May Allāh forgive you!" (Qur\'ān 12:92)',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['tārīkh', 'yūsuf', 'forgiveness'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Sūrah Yūsuf',
      back: 'Allāh calls it "the best of stories" (Aḥsan al-Qaṣaṣ). It is entirely in Sūrah 12 of the Qur\'ān.',
      frontArabic: 'سُورَة يُوسُف',
      backArabic: null,
      category: 'example',
      tags: ['tārīkh', 'yūsuf', 'qur\'ān'],
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
      front: 'Dajjāl',
      back: 'The great deceiver who will appear before the Day of Judgement. He will claim to be God. "Kāfir" will be on his forehead.',
      frontArabic: 'دَجَّال',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'dajjāl', 'signs'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Imam Mahdī',
      back: 'A righteous leader from the Prophet ﷺ\'s family who will appear before \'Īsā عليه السلام descends.',
      frontArabic: 'مَهْدِي',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'mahdī', 'signs'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Descent of \'Īsā عليه السلام',
      back: '\'Īsā will descend near a white minaret in Damascus, kill the Dajjāl, and establish justice.',
      frontArabic: 'عِيسَى',
      backArabic: null,
      category: 'definition',
      tags: ['aqā\'id', '\'īsā', 'signs'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ya\'jūj and Ma\'jūj',
      back: 'Two destructive nations held behind a barrier built by Dhul Qarnayn. They will be released near the End Times.',
      frontArabic: 'يَأْجُوجَ وَمَأْجُوج',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'ya\'jūj', 'signs'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Sūrah al-Kahf Protection',
      back: 'Memorising the first 10 āyāt of Sūrah al-Kahf protects from the Dajjāl. (Abū Dāwūd)',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['aqā\'id', 'dajjāl', 'protection'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Sun Rising from the West',
      back: 'A major sign — when this happens, the doors of repentance will be permanently closed.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['aqā\'id', 'signs', 'repentance'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Shafā\'ah (Intercession)',
      back: 'On the Day of Judgement, the Prophet ﷺ will intercede for his ummah, saying "Ummatī, Ummatī!"',
      frontArabic: 'شَفَاعَة',
      backArabic: null,
      category: 'vocabulary',
      tags: ['aqā\'id', 'shafā\'ah', 'judgement'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Minor vs Major Signs',
      back: 'Minor signs: loss of knowledge, spread of ignorance. Major signs: Dajjāl, Mahdī, descent of \'Īsā, sun rising from the West.',
      frontArabic: null,
      backArabic: null,
      category: 'definition',
      tags: ['aqā\'id', 'signs', 'qiyāmah'],
      difficulty: 'MEDIUM' as const,
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
      front: 'Ḥuqūq al-Jār (Rights of the Neighbour)',
      back: 'Share food, visit when ill, attend funeral, don\'t harm them, don\'t build higher blocking their air.',
      frontArabic: 'حُقُوق الجَار',
      backArabic: null,
      category: 'definition',
      tags: ['akhlāq', 'neighbours', 'rights'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Signs of a Hypocrite',
      back: 'Three signs: lies when speaking, breaks promises, betrays trust. (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: 'مُنَافِق',
      backArabic: null,
      category: 'definition',
      tags: ['akhlāq', 'hypocrisy', 'munāfiq'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Truthfulness (Ṣidq)',
      back: '"Truthfulness leads to righteousness, and righteousness leads to Paradise." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: 'صِدْق',
      backArabic: null,
      category: 'vocabulary',
      tags: ['akhlāq', 'ṣidq', 'truthfulness'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Good Neighbours',
      back: '"He is not a believer, who eats to his fill, whilst his neighbour goes hungry." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['akhlāq', 'neighbours', 'ḥadīth'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Seeking Permission',
      back: 'Say salām and ask permission 3 times before entering. If no answer, leave. (Qur\'ān 24:27-28)',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['akhlāq', 'permission', 'manners'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Removing Harm from the Road',
      back: '"Removing harm from the road is ṣadaqah." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['akhlāq', 'ṣadaqah', 'good-deeds'],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Controlling Anger',
      back: '"The strong person is not the one who can wrestle, but the one who controls himself at the time of anger." (Ṣaḥīḥ al-Bukhārī)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['akhlāq', 'anger', 'self-control'],
      difficulty: 'MEDIUM' as const,
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
      front: 'Ādāb of Du\'ā\'',
      back: 'Face Qiblah, be in wuḍū\', raise hands, praise Allāh first, send ṣalāt on the Prophet ﷺ, be humble and sincere.',
      frontArabic: 'آدَابِ الدُّعَاء',
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'du\'ā\'', 'etiquette'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Times Du\'ā\' is Accepted',
      back: 'Last third of the night, between adhān and iqāmah, in sajdah, while fasting, on the day of \'Arafah, while travelling.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'du\'ā\'', 'times'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Satr (Boys)',
      back: 'From below the navel to and including the knees — must be covered at all times.',
      frontArabic: 'سَتْر',
      backArabic: null,
      category: 'definition',
      tags: ['ādāb', 'dress', 'satr'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Satr (Girls)',
      back: 'The entire body except the face, hands and feet — must be covered in front of non-maḥram.',
      frontArabic: 'سَتْر',
      backArabic: null,
      category: 'definition',
      tags: ['ādāb', 'dress', 'satr'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ādāb of Being a Guest',
      back: 'Don\'t arrive too early/late, bring a gift, sit where told, don\'t look around the house, make du\'ā\' for the host.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'guest', 'manners'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Ādāb of Being a Host',
      back: 'Welcome warmly, serve food/drink, be attentive, walk guest to the door when leaving.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'host', 'manners'],
      difficulty: 'MEDIUM' as const,
    },
    {
      front: 'Du\'ā\' After a Gathering',
      back: '"Glory is to You, O Allāh. I bear witness that none is worthy of worship but You. I seek Your forgiveness." (Al-Ḥākim)',
      frontArabic: null,
      backArabic: null,
      category: 'example',
      tags: ['ādāb', 'gathering', 'du\'ā\''],
      difficulty: 'EASY' as const,
    },
    {
      front: 'Ādāb of Istinjā\'',
      back: 'Cover hair, recite du\'ā\', enter with left foot, don\'t face Qiblah, don\'t talk, wash with left hand, exit with right foot.',
      frontArabic: null,
      backArabic: null,
      category: 'rule',
      tags: ['ādāb', 'istinjā\'', 'toilet'],
      difficulty: 'MEDIUM' as const,
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
      // Fiqh terms
      { unitId: unitFiqh.id, arabicText: 'خُفَّيْن', transliteration: 'Khuffayn', translation: 'Leather socks upon which masaḥ can be done' },
      { unitId: unitFiqh.id, arabicText: 'مَسْح', transliteration: 'Masaḥ', translation: 'Wiping — with wet hands on khuffayn or head' },
      { unitId: unitFiqh.id, arabicText: 'مُقِيم', transliteration: 'Muqīm', translation: 'Resident — masaḥ allowed for 24 hours' },
      { unitId: unitFiqh.id, arabicText: 'مُسَافِر', transliteration: 'Musāfir', translation: 'Traveller — masaḥ allowed for 72 hours' },
      { unitId: unitFiqh.id, arabicText: 'نَوَاقِض', transliteration: 'Nawāqiḍ', translation: 'Invalidators — things that break masaḥ or wuḍū\'' },
      { unitId: unitFiqh.id, arabicText: 'وَاجِب', transliteration: 'Wājib', translation: 'Obligatory act — its omission requires sajdah as-sahw' },
      { unitId: unitFiqh.id, arabicText: 'سَجْدَة السَّهْو', transliteration: 'Sajdah as-Sahw', translation: 'Prostration of forgetfulness' },
      { unitId: unitFiqh.id, arabicText: 'قَضَاء', transliteration: 'Qaḍā\'', translation: 'Making up a missed or broken fast' },
      { unitId: unitFiqh.id, arabicText: 'كَفَّارَة', transliteration: 'Kaffārah', translation: 'Penalty — fasting 60 days for intentionally breaking a fast' },
      { unitId: unitFiqh.id, arabicText: 'فِدْيَة', transliteration: 'Fidyah', translation: 'Compensation for inability to fast' },
      { unitId: unitFiqh.id, arabicText: 'تَرَاوِيح', transliteration: 'Tarāwīḥ', translation: 'Special Ramaḍān night prayer of 20 rak\'āt' },
      // Aḥādīth terms
      { unitId: unitAhadith.id, arabicText: 'صَدَقَة', transliteration: 'Ṣadaqah', translation: 'Charity — voluntary giving for the sake of Allāh' },
      { unitId: unitAhadith.id, arabicText: 'شُكْر', transliteration: 'Shukr', translation: 'Gratitude — being thankful to Allāh and people' },
      { unitId: unitAhadith.id, arabicText: 'ذِكْر', transliteration: 'Dhikr', translation: 'Remembrance of Allāh' },
      { unitId: unitAhadith.id, arabicText: 'جَزَاكَ اللَّهُ خَيْرًا', transliteration: 'Jazākallāhu Khayran', translation: 'May Allāh reward you with goodness' },
      // Sīrah terms
      { unitId: unitSirah.id, arabicText: 'هِجْرَة', transliteration: 'Hijrah', translation: 'Migration — from Makkah to Madīnah' },
      { unitId: unitSirah.id, arabicText: 'بَدْر', transliteration: 'Badr', translation: 'First major battle of Islam (2 AH)' },
      { unitId: unitSirah.id, arabicText: 'أُحُد', transliteration: 'Uḥud', translation: 'Second major battle (3 AH)' },
      { unitId: unitSirah.id, arabicText: 'خَنْدَق', transliteration: 'Khandaq', translation: 'Trench — the defensive ditch dug in Battle of Aḥzāb' },
      { unitId: unitSirah.id, arabicText: 'فَتْحِ مَكَّة', transliteration: 'Fatḥ Makkah', translation: 'The Conquest of Makkah (8 AH)' },
      // Tārīkh terms
      { unitId: unitTarikh.id, arabicText: 'يُوسُف', transliteration: 'Yūsuf', translation: 'Prophet known for patience, beauty, and dream interpretation' },
      { unitId: unitTarikh.id, arabicText: 'يَعْقُوب', transliteration: 'Ya\'qūb', translation: 'Father of Yūsuf, also known as Isrā\'īl' },
      { unitId: unitTarikh.id, arabicText: 'أَحْسَنَ الْقَصَص', transliteration: 'Aḥsan al-Qaṣaṣ', translation: 'The best of stories — referring to Sūrah Yūsuf' },
      // Aqā'id terms
      { unitId: unitAqaid.id, arabicText: 'دَجَّال', transliteration: 'Dajjāl', translation: 'The great deceiver before the Day of Judgement' },
      { unitId: unitAqaid.id, arabicText: 'مَهْدِي', transliteration: 'Mahdī', translation: 'The guided one — a righteous leader before Qiyāmah' },
      { unitId: unitAqaid.id, arabicText: 'يَأْجُوجَ وَمَأْجُوج', transliteration: 'Ya\'jūj wa Ma\'jūj', translation: 'Two destructive nations released near the End Times' },
      { unitId: unitAqaid.id, arabicText: 'شَفَاعَة', transliteration: 'Shafā\'ah', translation: 'Intercession — especially of the Prophet ﷺ' },
      { unitId: unitAqaid.id, arabicText: 'قِيَامَة', transliteration: 'Qiyāmah', translation: 'The Day of Judgement / Resurrection' },
      { unitId: unitAqaid.id, arabicText: 'سُورَة الْكَهْف', transliteration: 'Sūrah al-Kahf', translation: 'The Chapter of the Cave — protection from the Dajjāl' },
      // Akhlāq terms
      { unitId: unitAkhlaq.id, arabicText: 'حُقُوق الجَار', transliteration: 'Ḥuqūq al-Jār', translation: 'Rights of the neighbour' },
      { unitId: unitAkhlaq.id, arabicText: 'مُنَافِق', transliteration: 'Munāfiq', translation: 'Hypocrite — one who shows faith but hides disbelief' },
      // Ādāb terms
      { unitId: unitAdab.id, arabicText: 'سَتْر', transliteration: 'Satr', translation: 'The area of the body that must be covered' },
      { unitId: unitAdab.id, arabicText: 'آدَابِ الدُّعَاء', transliteration: 'Ādāb ad-Du\'ā\'', translation: 'Manners and etiquette of supplication' },
    ],
  });

  console.log('✅ Created Arabic terms for all units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 Maktab Coursebook 4 seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: Maktab Coursebook 4 (ages 9-10)');
  console.log('   - 7 Units: Fiqh, Aḥādīth, Sīrah, Tārīkh, Aqā\'id, Akhlāq, Ādāb');
  console.log(`   - ${5 + 5 + 5 + 5 + 5 + 4 + 4} Quiz questions (33 total)`);
  console.log(`   - ${flashcardIndex} Flashcards`);
  console.log(`   - 33 Arabic terms`);
}

// Allow standalone execution
async function main() {
  try {
    await seedMaktabCoursebook4();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Maktab Coursebook 4:', error);
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
