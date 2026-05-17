import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Tazkiyah (Spiritual Purification) Course Seed
 * Based on Futuh al-Ghayb by Imam Abdul Qadir al-Jilani
 * With insights from Ibn Taymiyyah's commentary
 * 
 * Can be run independently with: npx ts-node prisma/seed-tazkiyah-course.ts
 */

export async function seedTazkiyahCourse() {
  console.log('🌙 Starting Tazkiyah (Spiritual Purification) course seed...');
  console.log('');

  // Find or create the demo family to attach the course to
  const demoFamily = await prisma.family.findFirst({
    where: { name: 'Ahmad Family' },
  });

  if (!demoFamily) {
    console.log('⚠️  Demo family not found. Please run main seed first.');
    return;
  }

  console.log('✅ Found demo family:', demoFamily.name);

  // Create the Tazkiyah course
  const tazkiyahCourse = await prisma.course.create({
    data: {
      title: 'Tazkiyah: Purification of the Soul',
      description: 'A comprehensive study of spiritual purification based on Futuh al-Ghayb by Imam Abdul Qadir al-Jilani with insights from Ibn Taymiyyah. Learn the path to purifying the heart and attaining closeness to Allah.',
      category: 'AQEEDAH',
      ageLevels: ['TEEN', 'ADULT'],
      thumbnailUrl: '/images/courses/tazkiyah.jpg',
      isPublished: true,
    },
  });

  console.log('✅ Created Tazkiyah course:', tazkiyahCourse.title);

  // Unit 1: Introduction to Tazkiyah
  const unit1 = await prisma.unit.create({
    data: {
      courseId: tazkiyahCourse.id,
      title: 'Introduction to Tazkiyah: The Journey of Self-Purification',
      description: 'Understanding the concept of spiritual purification and its importance in Islam',
      orderIndex: 0,
      content: `
        <h2>What is Tazkiyah? (التزكية)</h2>
        <p>Tazkiyah means purification and growth. It is the process of purifying the soul from spiritual diseases and adorning it with noble characteristics. This is one of the primary objectives of the Prophetic mission.</p>

        <div class="quran-verse">
          <p class="arabic">هُوَ الَّذِي بَعَثَ فِي الْأُمِّيِّينَ رَسُولًا مِّنْهُمْ يَتْلُو عَلَيْهِمْ آيَاتِهِ وَيُزَكِّيهِمْ وَيُعَلِّمُهُمُ الْكِتَابَ وَالْحِكْمَةَ</p>
          <p>"He is the One Who has sent among the unlettered people a Messenger from themselves reciting to them His verses, purifying them, and teaching them the Book and wisdom." [Al-Jumu'ah 62:2]</p>
        </div>

        <h3>The Importance of Tazkiyah</h3>
        <p>Imam Abdul Qadir al-Jilani, in his masterwork Futuh al-Ghayb (Revelations of the Unseen), emphasizes that true success lies not in outward actions alone, but in the purification of the inner self. He states:</p>

        <div class="hadith">
          <p>"The servant must work on purifying his heart before his limbs, for if the heart is pure, the limbs will follow."</p>
          <cite>— Futuh al-Ghayb, Discourse 1</cite>
        </div>

        <h3>Ibn Taymiyyah's Commentary</h3>
        <p>Sheikh al-Islam Ibn Taymiyyah clarified that Tazkiyah has two essential components:</p>
        <ul>
          <li><strong>Takhlia (التخلية):</strong> Emptying the heart from blameworthy traits such as pride, envy, showing off, and love of worldly status</li>
          <li><strong>Tahliya (التحلية):</strong> Adorning the heart with praiseworthy qualities such as sincerity, humility, patience, gratitude, and love for Allah</li>
        </ul>

        <div class="example-box">
          <h4>🌟 The Parable of the Garden</h4>
          <p>Ibn Taymiyyah compared the heart to a garden. Just as a gardener must first remove weeds (Takhlia) before planting beautiful flowers (Tahliya), the believer must remove spiritual diseases before cultivating noble characteristics.</p>
        </div>

        <h3>The Three Levels of the Soul</h3>
        <p>The Quran describes three states of the soul in its journey toward purification:</p>

        <table>
          <tr>
            <th>Arabic Term</th>
            <th>Translation</th>
            <th>Description</th>
          </tr>
          <tr>
            <td><span class="arabic">النفس الأمارة بالسوء</span></td>
            <td>An-Nafs al-Ammārah</td>
            <td>The soul that commands evil - the lowest state, dominated by desires</td>
          </tr>
          <tr>
            <td><span class="arabic">النفس اللوامة</span></td>
            <td>An-Nafs al-Lawwāmah</td>
            <td>The self-reproaching soul - the middle state, struggling against evil</td>
          </tr>
          <tr>
            <td><span class="arabic">النفس المطمئنة</span></td>
            <td>An-Nafs al-Muṭma'innah</td>
            <td>The tranquil soul - the highest state, at peace with Allah's decree</td>
          </tr>
        </table>

        <h3>The Path Forward</h3>
        <p>Imam al-Jilani teaches that the path of Tazkiyah requires:</p>
        <ul>
          <li>Sincere intention to please Allah alone</li>
          <li>Following the Sunnah of the Prophet ﷺ</li>
          <li>Consistent self-accountability (Muhasabah)</li>
          <li>Patience in removing bad habits and cultivating good ones</li>
          <li>Seeking knowledge of what purifies and what corrupts the heart</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Reflection Activity</h4>
          <p>Take a moment to reflect:</p>
          <ol>
            <li>Which of the three levels of the soul do you currently identify with most?</li>
            <li>What is one spiritual disease you would like to work on removing?</li>
            <li>What is one noble characteristic you would like to develop?</li>
          </ol>
          <p>Write these down in your journal as you begin this journey of self-purification.</p>
        </div>

        <div class="important-box">
          <h4>⚠️ Important Reminder</h4>
          <p>Tazkiyah is a lifelong journey, not a destination. The prophets and righteous predecessors constantly worked on purifying their hearts. Be patient with yourself and turn to Allah for help at every step.</p>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 1: Introduction to Tazkiyah');

  // Add Arabic Terms for Unit 1
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit1.id,
        arabicText: 'تزكية',
        transliteration: 'Tazkiyah',
        translation: 'Purification, growth, spiritual development',
      },
      {
        unitId: unit1.id,
        arabicText: 'التخلية',
        transliteration: 'At-Takhlia',
        translation: 'Emptying the heart from blameworthy traits',
      },
      {
        unitId: unit1.id,
        arabicText: 'التحلية',
        transliteration: 'At-Tahliya',
        translation: 'Adorning the heart with praiseworthy qualities',
      },
      {
        unitId: unit1.id,
        arabicText: 'النفس الأمارة بالسوء',
        transliteration: 'An-Nafs al-Ammārah bis-Sū',
        translation: 'The soul that commands evil',
      },
      {
        unitId: unit1.id,
        arabicText: 'النفس اللوامة',
        transliteration: 'An-Nafs al-Lawwāmah',
        translation: 'The self-reproaching soul',
      },
      {
        unitId: unit1.id,
        arabicText: 'النفس المطمئنة',
        transliteration: 'An-Nafs al-Muṭma\'innah',
        translation: 'The tranquil, peaceful soul',
      },
    ],
  });

  console.log('✅ Added Arabic terms for Unit 1');

  // Add Quiz Questions for Unit 1
  await prisma.question.createMany({
    data: [
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the two essential components of Tazkiyah according to Ibn Taymiyyah?',
        options: JSON.stringify([
          'Prayer and Fasting',
          'Takhlia (Emptying) and Tahliya (Adorning)',
          'Knowledge and Action',
          'Fear and Hope',
        ]),
        correctAnswer: 'Takhlia (Emptying) and Tahliya (Adorning)',
        explanation: 'Ibn Taymiyyah taught that Tazkiyah consists of Takhlia (removing bad traits) and Tahliya (cultivating good traits).',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which level of the soul is described as "the tranquil soul at peace"?',
        options: JSON.stringify([
          'An-Nafs al-Ammārah',
          'An-Nafs al-Lawwāmah',
          'An-Nafs al-Muṭma\'innah',
          'An-Nafs al-Kāmilah',
        ]),
        correctAnswer: 'An-Nafs al-Muṭma\'innah',
        explanation: 'An-Nafs al-Muṭma\'innah (the tranquil soul) is the highest level, where the soul is at peace with Allah\'s decree.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'TRUE_FALSE',
        questionText: 'According to Imam al-Jilani, purifying the heart is more important than purifying the limbs.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Imam al-Jilani taught that one must work on purifying the heart first, as when the heart is pure, the limbs will naturally follow.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 1');

  // Unit 2: Ikhlas (Sincerity)
  const unit2 = await prisma.unit.create({
    data: {
      courseId: tazkiyahCourse.id,
      title: 'Ikhlas: Sincerity and Purification of Intention',
      description: 'Understanding the foundation of all righteous deeds - sincerity to Allah alone',
      orderIndex: 1,
      content: `
        <h2>The Foundation of All Actions: Ikhlas (الإخلاص)</h2>
        <p>Imam Abdul Qadir al-Jilani dedicates several discourses in Futuh al-Ghayb to the concept of Ikhlas (sincerity), describing it as the soul of all worship and the foundation upon which all deeds are built.</p>

        <div class="hadith">
          <p>"Verily Allah does not look at your bodies or your appearances, but He looks at your hearts and your deeds."</p>
          <cite>— Sahih Muslim</cite>
        </div>

        <h3>What is Ikhlas?</h3>
        <p>Ikhlas means to purify one's intention and dedicate all actions solely for Allah's sake, free from:</p>
        <ul>
          <li><strong>Riyā' (الرياء):</strong> Showing off to people</li>
          <li><strong>Sum'ah (السمعة):</strong> Seeking people's praise</li>
          <li><strong>Hidden Shirk:</strong> Seeking worldly gains or status through religious acts</li>
        </ul>

        <div class="quran-verse">
          <p class="arabic">وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ</p>
          <p>"And they were not commanded except to worship Allah, [being] sincere to Him in religion, inclining to truth." [Al-Bayyinah 98:5]</p>
        </div>

        <h3>Teachings from Futuh al-Ghayb</h3>
        <p>Imam al-Jilani states in Discourse 15:</p>

        <div class="hadith">
          <p>"O young man! Be sincere in your devotion to your Lord. Do not worship Him so that people will see you and praise you. Do not perform acts of obedience to gain status or worldly position. If you do this, you have taken partners with Allah in your worship, even if you are unaware of it."</p>
          <cite>— Futuh al-Ghayb, Discourse 15</cite>
        </div>

        <p>He further explains that true sincerity means:</p>
        <ul>
          <li>Performing good deeds in secret as much as in public</li>
          <li>Not seeking praise or recognition from people</li>
          <li>Being content whether people know of your good deeds or not</li>
          <li>Feeling more joy when a deed is done in secret</li>
        </ul>

        <h3>Ibn Taymiyyah on the Subtleties of Riyā'</h3>
        <p>Ibn Taymiyyah warned that Riyā' (showing off) is extremely subtle and can enter even the most sincere person's heart. He identified several levels:</p>

        <div class="example-box">
          <h4>The Levels of Riyā'</h4>
          <ol>
            <li><strong>Major Riyā':</strong> Performing the act of worship solely for people to see - this nullifies the deed</li>
            <li><strong>Mixed Intention:</strong> Starting with sincerity but then becoming pleased when people praise you</li>
            <li><strong>Subtle Riyā':</strong> Wanting to be seen as a righteous person, even if not seeking specific praise</li>
            <li><strong>Hidden Riyā':</strong> Performing deeds excellently when others are watching but with less care in private</li>
          </ol>
        </div>

        <h3>The Remedy: Constant Self-Examination</h3>
        <p>Both scholars emphasize examining one's intentions before, during, and after every deed:</p>

        <table>
          <tr>
            <th>When</th>
            <th>Question to Ask</th>
          </tr>
          <tr>
            <td><strong>Before the deed</strong></td>
            <td>Why am I doing this? Is it purely for Allah?</td>
          </tr>
          <tr>
            <td><strong>During the deed</strong></td>
            <td>Am I doing this differently because someone is watching?</td>
          </tr>
          <tr>
            <td><strong>After the deed</strong></td>
            <td>Do I want people to know about this? Am I pleased if it remains hidden?</td>
          </tr>
        </table>

        <h3>Signs of Sincere Ikhlas</h3>
        <p>Imam al-Jilani mentions signs that indicate genuine sincerity:</p>
        <ul>
          <li>Preferring to do good deeds in secret</li>
          <li>Feeling no difference in your heart whether people praise you or not</li>
          <li>Not feeling the need to inform others of your good deeds</li>
          <li>Being equally motivated to do good when alone or in public</li>
          <li>Feeling joy when others perform the same good deeds</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Practical Exercise: The Sincerity Check</h4>
          <p>For one week, perform the following exercise:</p>
          <ol>
            <li>Choose one good deed you regularly perform (prayer, charity, helping others)</li>
            <li>Before doing it, pause and examine your intention</li>
            <li>Ask yourself: "Would I still do this if no one ever knew?"</li>
            <li>After completing the deed, observe your feelings if someone praises you</li>
            <li>Perform at least one completely secret good deed each day</li>
          </ol>
        </div>

        <div class="important-box">
          <h4>⚠️ Warning from the Scholars</h4>
          <p>Both Imam al-Jilani and Ibn Taymiyyah warn against obsessing over whether one's intention is pure to the point of paralysis. Shaytan may make you doubt every good deed. The remedy is to:</p>
          <ul>
            <li>Renew your intention frequently</li>
            <li>Seek refuge in Allah from hidden shirk</li>
            <li>Move forward with action after examining your intention</li>
            <li>Trust in Allah's mercy and not in your own perfection</li>
          </ul>
        </div>

        <h3>Du'a for Sincerity</h3>
        <p>The Prophet ﷺ would make this supplication:</p>

        <div class="hadith">
          <p class="arabic">اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أُشْرِكَ بِكَ شَيْئًا وَأَنَا أَعْلَمُ، وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ</p>
          <p>"O Allah, I seek refuge in You from associating anything with You knowingly, and I seek Your forgiveness for what I do unknowingly."</p>
          <cite>— Ahmad and others</cite>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 2: Ikhlas (Sincerity)');

  // Add Arabic Terms for Unit 2
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit2.id,
        arabicText: 'الإخلاص',
        transliteration: 'Al-Ikhlāṣ',
        translation: 'Sincerity, purity of intention',
      },
      {
        unitId: unit2.id,
        arabicText: 'الرياء',
        transliteration: 'Ar-Riyā\'',
        translation: 'Showing off, ostentation',
      },
      {
        unitId: unit2.id,
        arabicText: 'السمعة',
        transliteration: 'As-Sum\'ah',
        translation: 'Seeking people\'s praise through religious acts',
      },
      {
        unitId: unit2.id,
        arabicText: 'الشرك الخفي',
        transliteration: 'Ash-Shirk al-Khafī',
        translation: 'Hidden shirk (associating partners with Allah)',
      },
    ],
  });

  console.log('✅ Added Arabic terms for Unit 2');

  // Add Quiz Questions for Unit 2
  await prisma.question.createMany({
    data: [
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is Riyā\'?',
        options: JSON.stringify([
          'Sincerity in worship',
          'Showing off or performing deeds to be seen by people',
          'Hidden charity',
          'Secret prayer',
        ]),
        correctAnswer: 'Showing off or performing deeds to be seen by people',
        explanation: 'Riyā\' is showing off or ostentation - performing acts of worship for people to see rather than for Allah\'s sake.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the hadith, what does Allah look at when judging our deeds?',
        options: JSON.stringify([
          'Our wealth and status',
          'Our physical appearance',
          'Our hearts and intentions',
          'The quantity of our deeds',
        ]),
        correctAnswer: 'Our hearts and intentions',
        explanation: 'The Prophet ﷺ said that Allah does not look at our bodies or appearances, but at our hearts and deeds.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'TRUE_FALSE',
        questionText: 'Imam al-Jilani teaches that a person with true sincerity prefers to perform good deeds in secret.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'One of the signs of true Ikhlas is preferring to do good deeds in secret, being content whether people know about them or not.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What should you do if Shaytan makes you constantly doubt your intentions?',
        options: JSON.stringify([
          'Stop performing good deeds until you are certain',
          'Renew your intention, seek Allah\'s refuge, and move forward with action',
          'Always tell others about your deeds to get their opinion',
          'Only perform deeds in public to avoid doubts',
        ]),
        correctAnswer: 'Renew your intention, seek Allah\'s refuge, and move forward with action',
        explanation: 'The scholars warn against paralysis from constant doubt. Renew your intention, seek refuge in Allah, and proceed with good deeds, trusting in Allah\'s mercy.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 2');

  // Unit 3: Tawakkul (Trust in Allah)
  const unit3 = await prisma.unit.create({
    data: {
      courseId: tazkiyahCourse.id,
      title: 'Tawakkul: True Reliance upon Allah',
      description: 'Learning to place complete trust in Allah while taking appropriate means',
      orderIndex: 2,
      content: `
        <h2>Tawakkul: The Heart's Anchor (التوكل على الله)</h2>
        <p>Tawakkul is one of the highest stations of faith and a central theme in Futuh al-Ghayb. Imam al-Jilani dedicates multiple discourses to explaining this essential quality of the believers.</p>

        <div class="quran-verse">
          <p class="arabic">وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ</p>
          <p>"And whoever places his trust in Allah, He will be sufficient for him." [At-Talaq 65:3]</p>
        </div>

        <h3>What is True Tawakkul?</h3>
        <p>Imam al-Jilani defines Tawakkul in Discourse 27 as:</p>

        <div class="hadith">
          <p>"Tawakkul is the heart's reliance upon Allah in all matters, knowing with certainty that He alone controls all affairs, that no one can bring benefit or harm except by His will, and that His decree will certainly come to pass."</p>
          <cite>— Futuh al-Ghayb, Discourse 27</cite>
        </div>

        <h3>The Balance: Taking Means with the Heart on Allah</h3>
        <p>Ibn Taymiyyah clarifies a common misunderstanding about Tawakkul:</p>

        <div class="example-box">
          <h4>True Tawakkul = Taking Means + Heart Relying on Allah</h4>
          <p>Tawakkul does NOT mean abandoning worldly means. Rather, it means:</p>
          <ul>
            <li>Taking appropriate means (working, planning, seeking help)</li>
            <li>WHILE the heart relies completely on Allah, not on those means</li>
          </ul>
          <p>The Prophet ﷺ said: "Tie your camel and place your trust in Allah" - showing both action and reliance.</p>
        </div>

        <h3>Common Mistakes in Understanding Tawakkul</h3>

        <table>
          <tr>
            <th>Incorrect Understanding</th>
            <th>Correct Understanding</th>
          </tr>
          <tr>
            <td>Abandoning all worldly means and waiting for provision</td>
            <td>Taking appropriate means while the heart trusts only in Allah</td>
          </tr>
          <tr>
            <td>Relying completely on the means themselves</td>
            <td>Using means but knowing they have no power except by Allah's will</td>
          </tr>
          <tr>
            <td>Testing Allah by putting oneself in unnecessary danger</td>
            <td>Taking precautions while trusting Allah's decree</td>
          </tr>
        </table>

        <h3>The Levels of Tawakkul</h3>
        <p>Imam al-Jilani describes three levels of those who have Tawakkul:</p>

        <div class="example-box">
          <h4>1. The Beginners (المتوكلون)</h4>
          <p>They take means while their hearts rely on Allah. They work and plan, but know success is only from Allah. They experience fluctuation between reliance on means and reliance on Allah.</p>

          <h4>2. The Advanced (الواثقون)</h4>
          <p>They have deep trust in Allah's promise. They take means but are completely detached from them in their hearts. Whether means succeed or fail, their hearts remain equally at peace.</p>

          <h4>3. The Highest (المفوضون)</h4>
          <p>They have complete surrender to Allah's decree. They are content with whatever Allah decrees for them, seeing only Allah's wisdom and mercy in all circumstances.</p>
        </div>

        <h3>Practical Teachings from Futuh al-Ghayb</h3>
        <p>Imam al-Jilani provides practical guidance:</p>

        <ul>
          <li><strong>In matters of provision:</strong> Work and seek halal income, but know that your rizq is already decreed and will reach you</li>
          <li><strong>In times of difficulty:</strong> Make du'a and take action, but accept Allah's decree with contentment</li>
          <li><strong>In relationships:</strong> Be good to people, but don't make them your ultimate support</li>
          <li><strong>In fears:</strong> Take precautions, but know that only what Allah has written will befall you</li>
        </ul>

        <div class="hadith">
          <p>"If you were to rely upon Allah with true reliance, He would provide for you as He provides for the birds. They go out in the morning with empty stomachs and return full."</p>
          <cite>— Sunan at-Tirmidhi</cite>
        </div>

        <p>Note: The birds go out (take action) but rely on Allah for provision, not on their own ability.</p>

        <h3>Ibn Taymiyyah on the Heart's Attachment</h3>
        <p>Ibn Taymiyyah explains that Tawakkul is tested when means fail:</p>

        <div class="important-box">
          <h4>The Test of True Tawakkul</h4>
          <p>If your heart becomes disturbed, anxious, or despairing when worldly means fail, this indicates your heart was relying on those means rather than on Allah. True Tawakkul means:</p>
          <ul>
            <li>Your heart remains at peace whether means succeed or fail</li>
            <li>You see Allah's wisdom even when things don't go as planned</li>
            <li>You are content with Allah's choice for you</li>
          </ul>
        </div>

        <h3>Signs of True Tawakkul</h3>
        <p>According to Imam al-Jilani, one who has true Tawakkul:</p>
        <ul>
          <li>Is more concerned with pleasing Allah than achieving worldly outcomes</li>
          <li>Feels tranquility even in difficult circumstances</li>
          <li>Does not complain about Allah's decree</li>
          <li>Sees trials as opportunities for drawing closer to Allah</li>
          <li>Has hope in Allah's mercy even in the darkest times</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Self-Reflection Exercise</h4>
          <p>Reflect on a current worry or concern in your life:</p>
          <ol>
            <li>What means have you taken to address it?</li>
            <li>Is your heart at peace, or are you anxious?</li>
            <li>If the means were to fail, would you still trust in Allah's wisdom?</li>
            <li>Write a du'a asking Allah to grant you true Tawakkul in this matter</li>
          </ol>
        </div>

        <h3>Du'a for Tawakkul</h3>
        <div class="hadith">
          <p class="arabic">اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى</p>
          <p>"O Allah, I ask You for guidance, piety, chastity, and self-sufficiency."</p>
          <cite>— Sahih Muslim</cite>
        </div>

        <div class="hadith">
          <p class="arabic">حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ</p>
          <p>"Allah is sufficient for us, and He is the best Disposer of affairs."</p>
          <cite>— Quran 3:173</cite>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 3: Tawakkul');

  // Add Arabic Terms for Unit 3
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit3.id,
        arabicText: 'التوكل',
        transliteration: 'At-Tawakkul',
        translation: 'Trust and reliance upon Allah',
      },
      {
        unitId: unit3.id,
        arabicText: 'حسبنا الله ونعم الوكيل',
        transliteration: 'Ḥasbunallāhu wa ni\'mal wakīl',
        translation: 'Allah is sufficient for us and He is the best Disposer of affairs',
      },
      {
        unitId: unit3.id,
        arabicText: 'المتوكلون',
        transliteration: 'Al-Mutawakkilūn',
        translation: 'Those who place their trust in Allah',
      },
      {
        unitId: unit3.id,
        arabicText: 'التفويض',
        transliteration: 'At-Tafwīḍ',
        translation: 'Complete surrender to Allah\'s decree',
      },
    ],
  });

  console.log('✅ Added Arabic terms for Unit 3');

  // Add Quiz Questions for Unit 3
  await prisma.question.createMany({
    data: [
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the correct understanding of Tawakkul according to Ibn Taymiyyah?',
        options: JSON.stringify([
          'Abandoning all worldly means and waiting for Allah to provide',
          'Relying completely on worldly means and our own efforts',
          'Taking appropriate means while the heart relies completely on Allah',
          'Only relying on Allah in religious matters',
        ]),
        correctAnswer: 'Taking appropriate means while the heart relies completely on Allah',
        explanation: 'True Tawakkul means taking appropriate worldly means (like the Prophet said "tie your camel") while the heart trusts completely in Allah, not in those means.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the hadith "tie your camel and place your trust in Allah" teach us?',
        options: JSON.stringify([
          'We should only focus on tying camels',
          'We should balance taking practical action with spiritual trust in Allah',
          'Tying camels is more important than trusting Allah',
          'We should not trust Allah if we have tied our camel',
        ]),
        correctAnswer: 'We should balance taking practical action with spiritual trust in Allah',
        explanation: 'This hadith teaches us to take practical means (tie the camel) while placing ultimate trust in Allah, showing the balance between action and reliance.',
        difficulty: 'EASY',
      },
      {
        unitId: unit3.id,
        type: 'TRUE_FALSE',
        questionText: 'True Tawakkul means your heart remains at peace whether worldly means succeed or fail.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Ibn Taymiyyah explained that true Tawakkul is tested when means fail. If your heart is disturbed, it shows reliance on means rather than Allah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Imam al-Jilani, who are "Al-Mufawwiḍūn" (المفوضون)?',
        options: JSON.stringify([
          'Those who are just beginning their spiritual journey',
          'Those who have completely surrendered to Allah\'s decree with contentment',
          'Those who rely only on worldly means',
          'Those who don\'t take any action',
        ]),
        correctAnswer: 'Those who have completely surrendered to Allah\'s decree with contentment',
        explanation: 'Al-Mufawwiḍūn represent the highest level of Tawakkul - those with complete surrender and contentment with whatever Allah decrees.',
        difficulty: 'HARD',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 3');

  // Unit 4: Sabr and Shukr (Patience and Gratitude)
  const unit4 = await prisma.unit.create({
    data: {
      courseId: tazkiyahCourse.id,
      title: 'Sabr and Shukr: Patience in Trials and Gratitude in Blessings',
      description: 'The twin pillars of faith - patience during difficulties and gratitude for blessings',
      orderIndex: 3,
      content: `
        <h2>The Twin Wings of Faith: Patience and Gratitude</h2>
        <p>Imam al-Jilani teaches that the believer's life revolves between two states: trials that require patience (Sabr) and blessings that require gratitude (Shukr). Mastering these two qualities is essential for spiritual growth.</p>

        <div class="hadith">
          <p>"How wonderful is the affair of the believer! All of his affairs are good for him. If something good happens to him, he is grateful, and that is good for him. If something bad happens to him, he is patient, and that is good for him."</p>
          <cite>— Sahih Muslim</cite>
        </div>

        <h3>Understanding Sabr (الصبر) - Patience</h3>
        <p>Sabr is not passive acceptance, but active perseverance in obedience to Allah while restraining oneself from sin and complaint.</p>

        <h4>The Three Types of Sabr</h4>
        <div class="example-box">
          <ol>
            <li><strong>Sabr 'ala at-Tā'ah (الصبر على الطاعة):</strong> Patience in performing acts of obedience
              <ul>
                <li>Consistency in worship even when you don't feel motivated</li>
                <li>Continuing good deeds despite hardship</li>
                <li>Example: Waking up for Fajr when you're tired</li>
              </ul>
            </li>
            <li><strong>Sabr 'an al-Ma'ṣiyah (الصبر عن المعصية):</strong> Patience in avoiding sins
              <ul>
                <li>Restraining yourself from temptations</li>
                <li>Resisting desires that displease Allah</li>
                <li>Example: Lowering the gaze, avoiding gossip</li>
              </ul>
            </li>
            <li><strong>Sabr 'ala al-Qaḍā' (الصبر على القضاء):</strong> Patience with Allah's decree
              <ul>
                <li>Accepting trials without complaint</li>
                <li>Not despairing during hardship</li>
                <li>Example: Loss, illness, financial difficulty</li>
              </ul>
            </li>
          </ol>
        </div>

        <h3>Teachings from Futuh al-Ghayb on Patience</h3>
        <p>In Discourse 33, Imam al-Jilani states:</p>

        <div class="hadith">
          <p>"O young man! Be patient with the decrees of Allah. Do not object to His judgment. Know that He is the Wise, the All-Knowing. He places each person in the station that is best for them, even if they do not perceive it."</p>
          <cite>— Futuh al-Ghayb, Discourse 33</cite>
        </div>

        <p>He further explains that impatience during trials comes from:</p>
        <ul>
          <li>Weak faith in Allah's wisdom</li>
          <li>Attachment to this worldly life</li>
          <li>Lack of awareness of the greater rewards in the Hereafter</li>
          <li>Forgetting that trials expiate sins</li>
        </ul>

        <h3>Ibn Taymiyyah on the Levels of Response to Trials</h3>

        <table>
          <tr>
            <th>Level</th>
            <th>Response</th>
            <th>Status</th>
          </tr>
          <tr>
            <td>1. Discontent (السخط)</td>
            <td>Complaining about Allah, being angry at His decree</td>
            <td>Forbidden - shows weak faith</td>
          </tr>
          <tr>
            <td>2. Basic Patience (الصبر)</td>
            <td>Accepting the decree without complaint, though finding it difficult</td>
            <td>Obligatory - the minimum required</td>
          </tr>
          <tr>
            <td>3. Contentment (الرضا)</td>
            <td>Being content with the decree, trusting Allah's wisdom</td>
            <td>Recommended - a high station</td>
          </tr>
          <tr>
            <td>4. Gratitude (الشكر)</td>
            <td>Being grateful even for trials, seeing their benefit</td>
            <td>Excellence - the highest level</td>
          </tr>
        </table>

        <h3>Understanding Shukr (الشكر) - Gratitude</h3>
        <p>Gratitude is not merely saying "Alhamdulillah" with the tongue, but involves three elements:</p>

        <div class="example-box">
          <h4>The Three Components of True Gratitude</h4>
          <ol>
            <li><strong>Shukr of the Heart (القلب):</strong> Recognizing that all blessings are from Allah alone</li>
            <li><strong>Shukr of the Tongue (اللسان):</strong> Praising Allah verbally for His blessings</li>
            <li><strong>Shukr of the Limbs (الجوارح):</strong> Using blessings in ways that please Allah</li>
          </ol>
        </div>

        <div class="quran-verse">
          <p class="arabic">لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ</p>
          <p>"If you are grateful, I will surely increase you [in favor]" [Ibrahim 14:7]</p>
        </div>

        <h3>Warning Against Ingratitude</h3>
        <p>Imam al-Jilani warns that ingratitude (Kufr an-Ni'mah) is one of the fastest ways to lose blessings. He teaches:</p>

        <div class="important-box">
          <h4>Signs of Ingratitude</h4>
          <ul>
            <li>Complaining constantly despite having many blessings</li>
            <li>Using blessings in disobedience to Allah</li>
            <li>Attributing success to your own abilities rather than Allah</li>
            <li>Feeling entitled to blessings</li>
            <li>Not helping others when Allah has given you abundance</li>
          </ul>
        </div>

        <h3>The Spiritual Exercise of Counting Blessings</h3>
        <p>Both scholars recommend regularly enumerating Allah's blessings:</p>

        <div class="activity-box">
          <h4>📝 Daily Gratitude Practice</h4>
          <p>Each day, write down:</p>
          <ol>
            <li><strong>3 Universal Blessings:</strong> (Health, Islam, family, safety, etc.)</li>
            <li><strong>3 Small Blessings:</strong> (A good meal, a smile from a friend, cool weather, etc.)</li>
            <li><strong>3 Hidden Blessings:</strong> (Trials that protected you, prayers that were answered, etc.)</li>
          </ol>
          <p>Then say: <span class="arabic">الحمد لله الذي بنعمته تتم الصالحات</span></p>
          <p>"All praise is due to Allah, by Whose favor good deeds are completed."</p>
        </div>

        <h3>The Interconnection of Sabr and Shukr</h3>
        <p>Ibn Taymiyyah explains that these two qualities are inseparable:</p>

        <ul>
          <li>Patience without gratitude can lead to sadness and pessimism</li>
          <li>Gratitude without patience can lead to arrogance in good times and despair in bad times</li>
          <li>Together, they create a balanced, resilient faith</li>
        </ul>

        <div class="quran-verse">
          <p class="arabic">إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّكُلِّ صَبَّارٍ شَكُورٍ</p>
          <p>"Indeed in that are signs for everyone patient and grateful." [Ibrahim 14:5]</p>
        </div>

        <h3>Practical Applications</h3>

        <table>
          <tr>
            <th>Situation</th>
            <th>Apply Sabr</th>
            <th>Apply Shukr</th>
          </tr>
          <tr>
            <td>Financial Difficulty</td>
            <td>Don't complain; work hard and trust Allah</td>
            <td>Be grateful for what you have, not fixated on what you lack</td>
          </tr>
          <tr>
            <td>Health Issues</td>
            <td>Bear it without despairing; seek treatment</td>
            <td>Thank Allah for the parts of your body that work well</td>
          </tr>
          <tr>
            <td>Success in Work</td>
            <td>Stay humble; continue working hard</td>
            <td>Recognize it's from Allah; use success to help others</td>
          </tr>
          <tr>
            <td>Relationship Problems</td>
            <td>Control your anger; seek resolution with wisdom</td>
            <td>Appreciate the good in others; thank Allah for teaching you</td>
          </tr>
        </table>

        <div class="hadith">
          <h4>Prophetic Du'a</h4>
          <p class="arabic">اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ</p>
          <p>"O Allah, help me to remember You, to thank You, and to worship You in an excellent manner."</p>
          <cite>— Sunan Abu Dawud</cite>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 4: Sabr and Shukr');

  // Add Arabic Terms for Unit 4
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit4.id,
        arabicText: 'الصبر',
        transliteration: 'Aṣ-Ṣabr',
        translation: 'Patience, perseverance, steadfastness',
      },
      {
        unitId: unit4.id,
        arabicText: 'الشكر',
        transliteration: 'Ash-Shukr',
        translation: 'Gratitude, thankfulness',
      },
      {
        unitId: unit4.id,
        arabicText: 'الصبر على الطاعة',
        transliteration: 'Aṣ-Ṣabr \'ala aṭ-Ṭā\'ah',
        translation: 'Patience in performing acts of obedience',
      },
      {
        unitId: unit4.id,
        arabicText: 'الصبر عن المعصية',
        transliteration: 'Aṣ-Ṣabr \'an al-Ma\'ṣiyah',
        translation: 'Patience in avoiding sins',
      },
      {
        unitId: unit4.id,
        arabicText: 'الرضا',
        transliteration: 'Ar-Riḍā',
        translation: 'Contentment with Allah\'s decree',
      },
      {
        unitId: unit4.id,
        arabicText: 'كفر النعمة',
        transliteration: 'Kufr an-Ni\'mah',
        translation: 'Ingratitude for blessings',
      },
    ],
  });

  console.log('✅ Added Arabic terms for Unit 4');

  // Add Quiz Questions for Unit 4
  await prisma.question.createMany({
    data: [
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three types of Sabr (patience)?',
        options: JSON.stringify([
          'Physical, Mental, and Spiritual',
          'Morning, Afternoon, and Night',
          'Patience in obedience, patience in avoiding sin, and patience with Allah\'s decree',
          'Patience with family, friends, and strangers',
        ]),
        correctAnswer: 'Patience in obedience, patience in avoiding sin, and patience with Allah\'s decree',
        explanation: 'The three types are: Sabr in acts of worship, Sabr in avoiding sins, and Sabr with what Allah has decreed.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three components of true Shukr (gratitude)?',
        options: JSON.stringify([
          'Saying Alhamdulillah three times',
          'Heart recognizing blessings, tongue praising Allah, and limbs using blessings correctly',
          'Praying, fasting, and giving charity',
          'Being happy, content, and joyful',
        ]),
        correctAnswer: 'Heart recognizing blessings, tongue praising Allah, and limbs using blessings correctly',
        explanation: 'True gratitude involves the heart (recognition), tongue (praise), and limbs (proper use of blessings).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'TRUE_FALSE',
        questionText: 'According to Ibn Taymiyyah, the highest level of responding to trials is being grateful for them.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Ibn Taymiyyah described four levels: discontent, patience, contentment, and gratitude - with gratitude being the highest level.',
        difficulty: 'HARD',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does Allah promise to those who are grateful?',
        options: JSON.stringify([
          'Immediate wealth',
          'An increase in blessings',
          'No more trials',
          'Entry to Paradise without accountability',
        ]),
        correctAnswer: 'An increase in blessings',
        explanation: 'Allah says in Surah Ibrahim: "If you are grateful, I will surely increase you [in favor]"',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 4');

  // Unit 5: Zuhd (Detachment from the World)
  const unit5 = await prisma.unit.create({
    data: {
      courseId: tazkiyahCourse.id,
      title: 'Zuhd: True Detachment from Worldly Attachments',
      description: 'Understanding the balance between living in the world and not being enslaved by it',
      orderIndex: 4,
      content: `
        <h2>Zuhd: Living in the World Without Being Enslaved by It</h2>
        <p>Imam Abdul Qadir al-Jilani devotes several discourses in Futuh al-Ghayb to the concept of Zuhd (detachment from the world). This is often misunderstood as rejecting all worldly pursuits, but the true meaning is far more nuanced.</p>

        <h3>What is True Zuhd?</h3>
        <div class="hadith">
          <p class="arabic-quote">"الزهد ليس بتحريم الحلال ولا بترك الطيبات، ولكن الزهد أن لا تكون بما في يدك أوثق منك بما في يد الله"</p>
          <p>"Zuhd is not making the permissible forbidden, nor abandoning good things. Rather, Zuhd is that you do not have more trust in what is in your hand than what is in Allah's hand."</p>
          <cite>— Futuh al-Ghayb, Discourse 21</cite>
        </div>

        <p>Imam al-Jilani explains that Zuhd has two dimensions:</p>
        <ul>
          <li><strong>Zuhd of the hand:</strong> Not hoarding excessive wealth</li>
          <li><strong>Zuhd of the heart:</strong> Not being attached to what you possess</li>
        </ul>

        <p>The second is more important than the first. A person may possess little yet be enslaved by desire for more, while another may possess much yet remain free in their heart.</p>

        <h3>Ibn Taymiyyah's Definition</h3>
        <p>Ibn Taymiyyah clarifies:</p>

        <div class="hadith">
          <p>"Zuhd in something means to abandon it for something better. The Zahid abandons what does not benefit him in the Hereafter for what does benefit him in the Hereafter."</p>
          <cite>— Majmu' al-Fatawa</cite>
        </div>

        <h3>The Quranic Balance</h3>
        <div class="quran-verse">
          <p class="arabic">وَابْتَغِ فِيمَا آتَاكَ اللَّهُ الدَّارَ الْآخِرَةَ ۖ وَلَا تَنسَ نَصِيبَكَ مِنَ الدُّنْيَا</p>
          <p>"But seek, through that which Allah has given you, the home of the Hereafter; and [yet], do not forget your share of the world." [Al-Qasas 28:77]</p>
        </div>

        <h3>From Futuh al-Ghayb: The Levels of Zuhd</h3>
        <p>Imam al-Jilani describes three levels of Zuhd:</p>

        <div class="example-box">
          <h4>The Three Levels</h4>
          
          <p><strong>1. Zuhd of the Beginners (زهد العوام)</strong></p>
          <div class="hadith">
            <p class="arabic-quote">"زهد العوام: أن يزهد في الحرام، ويحذر من الشبهات"</p>
            <p>"The Zuhd of common people is to abstain from the forbidden and be cautious of doubtful matters."</p>
            <cite>— Futuh al-Ghayb, Discourse 21</cite>
          </div>

          <p><strong>2. Zuhd of the Elite (زهد الخواص)</strong></p>
          <div class="hadith">
            <p class="arabic-quote">"زهد الخواص: أن يزهد في الفضول من المباحات، ويقتصر على الضرورات"</p>
            <p>"The Zuhd of the elite is to abstain from excess in permissible things and restrict themselves to necessities."</p>
            <cite>— Futuh al-Ghayb, Discourse 21</cite>
          </div>

          <p><strong>3. Zuhd of the Most Elite (زهد خواص الخواص)</strong></p>
          <div class="hadith">
            <p class="arabic-quote">"زهد خواص الخواص: أن يزهد فيما يشغله عن الله"</p>
            <p>"The Zuhd of the elite among the elite is to abstain from whatever distracts them from Allah."</p>
            <cite>— Futuh al-Ghayb, Discourse 21</cite>
          </div>
        </div>

        <h3>Signs of True Zuhd</h3>
        <p>From Futuh al-Ghayb, Imam al-Jilani provides signs to recognize true detachment:</p>

        <ul>
          <li>Not rejoicing excessively when you gain worldly things</li>
          <li>Not grieving excessively when you lose worldly things</li>
          <li>Spending wealth easily in Allah's path</li>
          <li>Not competing with people for worldly positions</li>
          <li>Finding more joy in worship than in worldly pleasures</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Self-Assessment</h4>
          <p>Reflect on these questions:</p>
          <ol>
            <li>What worldly thing would devastate you if you lost it? (This reveals your attachments)</li>
            <li>Do you spend more time thinking about worldly affairs or the Hereafter?</li>
            <li>Can you give away something you love for Allah's sake?</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 5: Zuhd');

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit5.id,
        arabicText: 'الزهد',
        transliteration: 'Az-Zuhd',
        translation: 'Detachment from worldly attachments, asceticism',
      },
      {
        unitId: unit5.id,
        arabicText: 'زهد العوام',
        transliteration: 'Zuhd al-\'Awām',
        translation: 'Zuhd of common people (abstaining from haram)',
      },
      {
        unitId: unit5.id,
        arabicText: 'زهد الخواص',
        transliteration: 'Zuhd al-Khawāṣ',
        translation: 'Zuhd of the elite (abstaining from excess)',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Imam al-Jilani, what is true Zuhd?',
        options: JSON.stringify([
          'Making halal things haram and abandoning all good things',
          'Living in caves and rejecting society',
          'Not having more trust in what is in your hand than what is in Allah\'s hand',
          'Never owning any property',
        ]),
        correctAnswer: 'Not having more trust in what is in your hand than what is in Allah\'s hand',
        explanation: 'Imam al-Jilani defines Zuhd as having greater trust in Allah than in material possessions, not as abandoning all worldly things.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the highest level of Zuhd according to Futuh al-Ghayb?',
        options: JSON.stringify([
          'Abstaining from the forbidden',
          'Abstaining from excess permissible things',
          'Abstaining from whatever distracts from Allah',
          'Owning nothing at all',
        ]),
        correctAnswer: 'Abstaining from whatever distracts from Allah',
        explanation: 'The Zuhd of "khawass al-khawass" (elite among elite) is to abstain from anything that distracts one from Allah, even if permissible.',
        difficulty: 'HARD',
      },
    ],
  });

  // Unit 6: Khashyah (Fear of Allah)
  const unit6 = await prisma.unit.create({
    data: {
      courseId: tazkiyahCourse.id,
      title: 'Khashyah: The Fear of Allah that Leads to Action',
      description: 'Understanding the difference between fear and awe, and how it motivates righteousness',
      orderIndex: 5,
      content: `
        <h2>Khashyah: Fear Mixed with Reverence</h2>
        <p>Imam al-Jilani distinguishes between different types of fear, emphasizing that Khashyah is the fear that befits Allah - a fear mixed with reverence, love, and knowledge.</p>

        <h3>The Nature of Khashyah</h3>
        <div class="hadith">
          <p class="arabic-quote">"الخشية من الله: أن تخافه خوفاً يحجزك عن معصيته، ويحملك على طاعته، وتعلم أنه مطلع عليك، وقادر على العقوبة، وأنه أرحم بك من نفسك"</p>
          <p>"Khashyah of Allah is that you fear Him with a fear that prevents you from disobeying Him, drives you to obey Him, and you know that He sees you, is able to punish you, yet is more merciful to you than you are to yourself."</p>
          <cite>— Futuh al-Ghayb, Discourse 34</cite>
        </div>

        <h3>The Difference Between Khawf and Khashyah</h3>
        <p>Ibn Taymiyyah explains:</p>

        <table>
          <tr>
            <th>خوف (Khawf)</th>
            <th>خشية (Khashyah)</th>
          </tr>
          <tr>
            <td>General fear</td>
            <td>Fear based on knowledge of Allah's greatness</td>
          </tr>
          <tr>
            <td>Can be paralyzing</td>
            <td>Motivates to action</td>
          </tr>
          <tr>
            <td>May lack hope</td>
            <td>Balanced with hope in Allah's mercy</td>
          </tr>
          <tr>
            <td>Anyone can have it</td>
            <td>Specifically for those with knowledge</td>
          </tr>
        </table>

        <div class="quran-verse">
          <p class="arabic">إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ</p>
          <p>"Only those who have knowledge among His servants fear Allah [with Khashyah]." [Fatir 35:28]</p>
        </div>

        <h3>From Futuh al-Ghayb: The Benefits of Khashyah</h3>
        <div class="hadith">
          <p class="arabic-quote">"من خاف الله فقد أمن كل شيء، ومن خاف غير الله خاف من كل شيء"</p>
          <p>"Whoever fears Allah is safe from everything, and whoever fears other than Allah fears everything."</p>
          <cite>— Futuh al-Ghayb, Discourse 34</cite>
        </div>

        <p>Imam al-Jilani explains that Khashyah produces:</p>
        <ul>
          <li><strong>Humility:</strong> Recognizing one's smallness before Allah's greatness</li>
          <li><strong>Diligence in worship:</strong> Motivated to please Allah</li>
          <li><strong>Avoidance of sins:</strong> Fear of Allah's displeasure</li>
          <li><strong>Consistent repentance:</strong> Quick return when one errs</li>
          <li><strong>Contentment:</strong> Fearing only Allah liberates from fearing creation</li>
        </ul>

        <h3>The Balance: Fear and Hope</h3>
        <div class="hadith">
          <p class="arabic-quote">"ينبغي للمؤمن أن يكون خائفاً راجياً، ولا يكون خوفه أغلب من رجائه ولا رجاؤه أغلب من خوفه، بل يكونان متساويين"</p>
          <p>"The believer should be fearful and hopeful. His fear should not overcome his hope, nor his hope overcome his fear. Rather, they should be balanced."</p>
          <cite>— Futuh al-Ghayb, Discourse 45</cite>
        </div>

        <div class="example-box">
          <h4>When to Emphasize Fear vs. Hope</h4>
          <ul>
            <li><strong>When healthy and young:</strong> Emphasize fear to prevent complacency</li>
            <li><strong>When sick or dying:</strong> Emphasize hope to avoid despair</li>
            <li><strong>When tempted by sin:</strong> Remember fear of punishment</li>
            <li><strong>After sinning:</strong> Remember hope in Allah's mercy</li>
          </ul>
        </div>

        <div class="activity-box">
          <h4>📝 Cultivating Khashyah</h4>
          <p>Imam al-Jilani recommends:</p>
          <ol>
            <li>Study Allah's names and attributes to know His greatness</li>
            <li>Reflect on death and the Day of Judgment</li>
            <li>Remember that Allah sees and knows all you do</li>
            <li>Read about Paradise and Hellfire</li>
            <li>Observe Allah's power in creation</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 6: Khashyah');

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit6.id,
        arabicText: 'الخشية',
        transliteration: 'Al-Khashyah',
        translation: 'Fear of Allah combined with reverence and knowledge',
      },
      {
        unitId: unit6.id,
        arabicText: 'الخوف',
        transliteration: 'Al-Khawf',
        translation: 'General fear',
      },
      {
        unitId: unit6.id,
        arabicText: 'الرجاء',
        transliteration: 'Ar-Rajā\'',
        translation: 'Hope, especially hope in Allah\'s mercy',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the difference between Khawf and Khashyah?',
        options: JSON.stringify([
          'There is no difference',
          'Khashyah is fear based on knowledge of Allah\'s greatness, while Khawf is general fear',
          'Khawf is stronger than Khashyah',
          'Khashyah is only for prophets',
        ]),
        correctAnswer: 'Khashyah is fear based on knowledge of Allah\'s greatness, while Khawf is general fear',
        explanation: 'Khashyah is a special type of fear that comes from knowing Allah\'s attributes and is mixed with reverence and love.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // Unit 7: Muhasabah (Self-Accountability)
  const unit7 = await prisma.unit.create({
    data: {
      courseId: tazkiyahCourse.id,
      title: 'Muhasabah: The Daily Reckoning with Oneself',
      description: 'Learning to hold yourself accountable before Allah holds you accountable',
      orderIndex: 6,
      content: `
        <h2>Muhasabah: Taking Account of Yourself</h2>
        <p>One of the most practical teachings in Futuh al-Ghayb is the concept of Muhasabah - daily self-accountability. Imam al-Jilani considers this essential for spiritual progress.</p>

        <h3>The Command for Muhasabah</h3>
        <div class="quran-verse">
          <p class="arabic">يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ</p>
          <p>"O you who believe, fear Allah. And let every soul look to what it has put forth for tomorrow." [Al-Hashr 59:18]</p>
        </div>

        <h3>From Futuh al-Ghayb: The Practice of Muhasabah</h3>
        <div class="hadith">
          <p class="arabic-quote">"حاسب نفسك قبل أن تُحاسَب، وزن أعمالك قبل أن تُوزَن، وتجهز للعرض الأكبر، يومئذٍ تُعرضون لا تخفى منكم خافية"</p>
          <p>"Hold yourself accountable before you are held accountable, weigh your deeds before they are weighed, and prepare for the Greatest Presentation [on the Day of Judgment], on that Day you will be presented, not hidden among you is anything hidden."</p>
          <cite>— Futuh al-Ghayb, Discourse 12</cite>
        </div>

        <h3>The Daily Practice</h3>
        <p>Imam al-Jilani outlines a practical approach:</p>

        <div class="example-box">
          <h4>Three Times for Muhasabah</h4>
          
          <p><strong>1. Before the Deed (قبل العمل)</strong></p>
          <div class="hadith">
            <p class="arabic-quote">"قبل أن تعمل شيئاً، انظر: هل هو لله أم لغيره؟ هل يقربك من الله أم يبعدك؟"</p>
            <p>"Before you do anything, examine: Is it for Allah or for other than Him? Does it bring you closer to Allah or distance you?"</p>
            <cite>— Futuh al-Ghayb, Discourse 12</cite>
          </div>

          <p><strong>2. During the Deed (في أثناء العمل)</strong></p>
          <ul>
            <li>Am I maintaining sincerity?</li>
            <li>Is my focus on Allah or on people's opinion?</li>
            <li>Am I doing this with excellence?</li>
          </ul>

          <p><strong>3. After the Deed (بعد العمل)</strong></p>
          <ul>
            <li>Did I complete it properly?</li>
            <li>Was I sincere throughout?</li>
            <li>If it was good, thank Allah; if it had deficiencies, seek forgiveness</li>
          </ul>
        </div>

        <h3>The Nightly Reckoning</h3>
        <p>Umar ibn al-Khattab (رضي الله عنه) used to say:</p>

        <div class="hadith">
          <p>"Hold yourself accountable before you are held accountable, for it will be easier for you in the reckoning tomorrow if you hold yourself accountable today."</p>
        </div>

        <p>Imam al-Jilani recommends a nightly practice:</p>

        <div class="activity-box">
          <h4>📝 The Nightly Muhasabah Practice</h4>
          <p>Before sleeping, ask yourself:</p>
          <ol>
            <li><strong>Worship:</strong> Did I fulfill my obligations (prayers on time, etc.)?</li>
            <li><strong>Rights of People:</strong> Did I wrong anyone today?</li>
            <li><strong>Sins:</strong> What sins did I commit (eyes, tongue, heart)?</li>
            <li><strong>Time:</strong> How did I spend my time? Was it beneficial?</li>
            <li><strong>Blessings:</strong> Did I thank Allah for His blessings?</li>
          </ol>
          <p>Then make sincere Tawbah for shortcomings and plan to improve tomorrow.</p>
        </div>

        <h3>The Books of Deeds</h3>
        <div class="hadith">
          <p class="arabic-quote">"اكتب في صحيفة قلبك ما تريد أن تراه في صحيفة أعمالك يوم القيامة"</p>
          <p>"Write in the page of your heart what you want to see in the record of your deeds on the Day of Resurrection."</p>
          <cite>— Futuh al-Ghayb, Discourse 12</cite>
        </div>

        <h3>Signs of Successful Muhasabah</h3>
        <p>You know your Muhasabah is working when:</p>
        <ul>
          <li>You notice and correct mistakes quickly</li>
          <li>You see gradual improvement in your behavior</li>
          <li>You become more aware of Allah's presence</li>
          <li>You feel genuine remorse for sins</li>
          <li>You actively seek to make amends</li>
        </ul>

        <div class="important-box">
          <h4>⚠️ Balance in Muhasabah</h4>
          <p>Ibn Taymiyyah warns against two extremes:</p>
          <ul>
            <li><strong>Being too harsh:</strong> Leading to despair and giving up</li>
            <li><strong>Being too lenient:</strong> Making excuses and never improving</li>
          </ul>
          <p>The balance: Be honest about your faults while hopeful in Allah's mercy.</p>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 7: Muhasabah');

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit7.id,
        arabicText: 'المحاسبة',
        transliteration: 'Al-Muḥāsabah',
        translation: 'Self-accountability, taking account of oneself',
      },
      {
        unitId: unit7.id,
        arabicText: 'التوبة',
        transliteration: 'At-Tawbah',
        translation: 'Repentance, turning back to Allah',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Imam al-Jilani in Futuh al-Ghayb, when should Muhasabah be practiced?',
        options: JSON.stringify([
          'Only at night before sleeping',
          'Before the deed, during the deed, and after the deed',
          'Only once a week on Friday',
          'Only during Ramadan',
        ]),
        correctAnswer: 'Before the deed, during the deed, and after the deed',
        explanation: 'Imam al-Jilani teaches that Muhasabah should be practiced before, during, and after every deed to ensure sincerity and excellence.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 7');

  console.log('');
  console.log('✨ Tazkiyah course seed completed successfully!');
  console.log('📊 Summary:');
  console.log('   - Created course: Tazkiyah - Purification of the Soul');
  console.log('   - Created 7 comprehensive units with authentic Arabic quotes');
  console.log('   - Added Arabic terms for each unit');
  console.log('   - Added quiz questions for assessments');
  console.log('');
  console.log('🎓 Units created:');
  console.log('   1. Introduction to Tazkiyah');
  console.log('   2. Ikhlas (Sincerity)');
  console.log('   3. Tawakkul (Trust in Allah)');
  console.log('   4. Sabr and Shukr (Patience and Gratitude)');
  console.log('   5. Zuhd (Detachment from the World)');
  console.log('   6. Khashyah (Fear of Allah)');
  console.log('   7. Muhasabah (Self-Accountability)');
  console.log('');
  console.log('To view the course, start the backend and visit the courses page.');
}

async function main() {
  try {
    await seedTazkiyahCourse();
  } catch (error) {
    console.error('❌ Error seeding Tazkiyah course:', error);
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
