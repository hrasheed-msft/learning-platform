import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Hujjatullah Al-Balighah Course Seed
 * Based on the masterwork by Shah Wali Allah Al-Dahlawi
 * The Conclusive Argument from God - A comprehensive study of Islamic philosophy and jurisprudence
 * 
 * Can be run independently with: npx ts-node prisma/seed-hujjatullah-course.ts
 */

export async function seedHujjatullahCourse() {
  console.log('📖 Starting Hujjatullah Al-Balighah course seed...');
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

  // Create the Hujjatullah Al-Balighah course
  const hujjatullahCourse = await prisma.course.create({
    data: {
      title: 'Hujjatullah Al-Balighah: The Divine Wisdom in Islamic Law',
      description: 'A profound study of Shah Wali Allah Al-Dahlawi\'s masterpiece exploring the philosophy of Shariah, the wisdom behind Islamic laws, and the connection between individual actions and societal wellbeing.',
      category: 'FIQH',
      ageLevels: ['ADULT'],
      thumbnailUrl: '/images/courses/hujjatullah.jpg',
      isPublished: true,
    },
  });

  console.log('✅ Created Hujjatullah Al-Balighah course:', hujjatullahCourse.title);

  // Unit 1: Introduction to Hujjatullah Al-Balighah
  const unit1 = await prisma.unit.create({
    data: {
      courseId: hujjatullahCourse.id,
      title: 'Introduction: The Life of Shah Wali Allah and His Magnum Opus',
      description: 'Understanding the historical context, the author, and the objectives of Hujjatullah Al-Balighah',
      orderIndex: 0,
      content: `
        <h2>Shah Wali Allah Al-Dahlawi (1703-1762 CE)</h2>
        <p>Shah Wali Allah Ahmad ibn Abd al-Rahim al-Dahlawi was one of the most influential Islamic scholars of the 18th century. Born in Delhi, India, he came from a family of scholars and was deeply immersed in Islamic learning from an early age.</p>

        <h3>His Scholarly Journey</h3>
        <ul>
          <li><strong>Early Education:</strong> Studied under his father, Shah Abd al-Rahim, and mastered traditional Islamic sciences</li>
          <li><strong>Pilgrimage to Makkah (1730-1732):</strong> Studied Hadith under the great scholars of Madinah</li>
          <li><strong>Return to India:</strong> Dedicated his life to reforming Muslim thought and education</li>
          <li><strong>Literary Legacy:</strong> Authored over 50 works in Arabic, Persian, and Urdu</li>
        </ul>

        <div class="example-box">
          <h4>🌟 His Historical Context</h4>
          <p>Shah Wali Allah lived during a period of decline for Muslim civilization in India. The Mughal Empire was weakening, and Muslims faced both external challenges and internal intellectual stagnation. He sought to revive Islamic thought by returning to foundational principles while addressing contemporary issues.</p>
        </div>

        <h3>What is Hujjatullah Al-Balighah? (حجة الله البالغة)</h3>
        <p>The title translates to "The Conclusive Argument from God" - derived from the Quranic verse:</p>

        <div class="quran-verse">
          <p class="arabic">قُلْ فَلِلَّهِ الْحُجَّةُ الْبَالِغَةُ</p>
          <p>"Say: 'With Allah is the conclusive argument'" [Al-An'am 6:149]</p>
        </div>

        <p>This masterwork is Shah Wali Allah's attempt to demonstrate that Islamic law is not arbitrary, but based on divine wisdom that serves human wellbeing in both this world and the Hereafter.</p>

        <h3>The Objectives of the Book</h3>
        <p>Shah Wali Allah wrote this work to achieve several critical goals:</p>

        <table>
          <tr>
            <th>Objective</th>
            <th>Description</th>
          </tr>
          <tr>
            <td><strong>Demonstrate Divine Wisdom</strong></td>
            <td>Show that every Islamic law has profound wisdom (hikmah) behind it</td>
          </tr>
          <tr>
            <td><strong>Bridge Rationality & Revelation</strong></td>
            <td>Reconcile philosophical reasoning with Quranic and Prophetic teachings</td>
          </tr>
          <tr>
            <td><strong>Social Reform</strong></td>
            <td>Explain how Islamic laws create a just, balanced society</td>
          </tr>
          <tr>
            <td><strong>Counter Literalism</strong></td>
            <td>Move beyond surface-level understanding to grasp deeper purposes (maqasid)</td>
          </tr>
          <tr>
            <td><strong>Universal Principles</strong></td>
            <td>Extract timeless principles applicable across cultures and eras</td>
          </tr>
        </table>

        <h3>The Unique Methodology</h3>
        <p>What makes Hujjatullah Al-Balighah revolutionary is its interdisciplinary approach:</p>

        <ul>
          <li><strong>Philosophy:</strong> Uses Aristotelian and Islamic philosophical frameworks</li>
          <li><strong>Sociology:</strong> Analyzes human societies, customs, and social structures</li>
          <li><strong>Psychology:</strong> Examines human nature, desires, and spiritual development</li>
          <li><strong>Economics:</strong> Discusses wealth distribution, trade, and financial systems</li>
          <li><strong>Jurisprudence:</strong> Grounded in deep knowledge of Fiqh and Hadith</li>
        </ul>

        <div class="important-box">
          <h4>⚠️ A Challenging Work</h4>
          <p>Hujjatullah Al-Balighah is not a simple text. It requires:</p>
          <ul>
            <li>Basic knowledge of Islamic law and Hadith</li>
            <li>Patience to grasp philosophical concepts</li>
            <li>Openness to seeing familiar rulings from new perspectives</li>
            <li>Reflection on how principles apply to modern contexts</li>
          </ul>
        </div>

        <h3>The Structure of the Book</h3>
        <p>The work is divided into several major sections:</p>

        <div class="example-box">
          <ol>
            <li><strong>The Irtifaqat (إرتفاقات):</strong> The natural benefits and arrangements humans need for survival and civilization</li>
            <li><strong>The Khulafat (خلافات):</strong> Human differences and how Islamic law manages them</li>
            <li><strong>The Asbab (أسباب):</strong> The causes and reasons behind specific Islamic rulings</li>
            <li><strong>The Khawass (خواص):</strong> The special characteristics and wisdoms of particular laws</li>
          </ol>
        </div>

        <h3>Core Thesis of the Book</h3>
        <p>Shah Wali Allah's central argument can be summarized as follows:</p>

        <div class="hadith">
          <p>"The Shariah of Islam is built upon wisdom (hikmah) that serves human wellbeing in both worldly life and the Hereafter. Every law, when properly understood, addresses human nature and societal needs in the most balanced way possible. What may appear as mere ritual or arbitrary rule is, in fact, part of a sophisticated system designed by the All-Knowing, All-Wise Creator."</p>
          <cite>— Core message of Hujjatullah Al-Balighah</cite>
        </div>

        <h3>Why Study This Book Today?</h3>
        <p>In an era where Islamic laws are often questioned or misunderstood, this work provides:</p>

        <ul>
          <li><strong>Intellectual Confidence:</strong> Understanding the wisdom behind rulings strengthens faith</li>
          <li><strong>Effective Da'wah:</strong> Ability to explain Islam's rationality to skeptics</li>
          <li><strong>Balanced Perspective:</strong> Avoiding both rigid literalism and liberal dismissal</li>
          <li><strong>Social Vision:</strong> Understanding how Islamic principles create flourishing societies</li>
          <li><strong>Spiritual Depth:</strong> Seeing worship as more than obligation - as human perfection</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Reflection Questions</h4>
          <ol>
            <li>What is your current understanding of why Allah legislated specific laws in Islam?</li>
            <li>Have you ever struggled to understand the wisdom behind a particular Islamic ruling?</li>
            <li>How might understanding the deeper purposes of Shariah affect your practice of Islam?</li>
          </ol>
          <p>Keep these questions in mind as we journey through this profound work.</p>
        </div>

        <div class="example-box">
          <h4>🎯 Learning Outcomes</h4>
          <p>By the end of this course, you will:</p>
          <ul>
            <li>Understand the philosophical foundations of Islamic law</li>
            <li>Recognize the wisdom (hikmah) behind major Islamic rulings</li>
            <li>Appreciate the connection between individual ethics and social wellbeing</li>
            <li>Develop a holistic view of Islam as a comprehensive life system</li>
            <li>Gain tools to reflect on contemporary issues through classical wisdom</li>
          </ul>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 1: Introduction');

  // Add Arabic Terms for Unit 1
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit1.id,
        arabicText: 'حجة الله البالغة',
        transliteration: 'Ḥujjatullāh al-Bālighah',
        translation: 'The Conclusive Argument from God',
      },
      {
        unitId: unit1.id,
        arabicText: 'الحكمة',
        transliteration: 'Al-Ḥikmah',
        translation: 'Wisdom, the underlying purpose and benefit',
      },
      {
        unitId: unit1.id,
        arabicText: 'الإرتفاقات',
        transliteration: 'Al-Irtifāqāt',
        translation: 'Natural arrangements and benefits for human life',
      },
      {
        unitId: unit1.id,
        arabicText: 'المقاصد',
        transliteration: 'Al-Maqāṣid',
        translation: 'The higher objectives and purposes of Shariah',
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
        questionText: 'What is the central thesis of Hujjatullah Al-Balighah?',
        options: JSON.stringify([
          'Islamic law is arbitrary and must be followed without question',
          'Islamic law is built upon wisdom that serves human wellbeing',
          'Islamic law only applies to religious rituals',
          'Islamic law is outdated and needs complete reform',
        ]),
        correctAnswer: 'Islamic law is built upon wisdom that serves human wellbeing',
        explanation: 'Shah Wali Allah\'s core argument is that every Islamic law has profound wisdom behind it that serves human wellbeing in both worldly life and the Hereafter.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following disciplines does Shah Wali Allah integrate in his methodology?',
        options: JSON.stringify([
          'Only Islamic jurisprudence',
          'Only philosophy and theology',
          'Philosophy, sociology, psychology, economics, and jurisprudence',
          'Only Quran and Hadith studies',
        ]),
        correctAnswer: 'Philosophy, sociology, psychology, economics, and jurisprudence',
        explanation: 'Hujjatullah Al-Balighah is revolutionary for its interdisciplinary approach, integrating multiple fields of knowledge.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit1.id,
        type: 'TRUE_FALSE',
        questionText: 'Shah Wali Allah wrote Hujjatullah Al-Balighah during a period of Muslim decline in India.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'He lived during the weakening of the Mughal Empire and wrote to revive Islamic thought and address contemporary challenges.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 1');

  // Unit 2: Human Nature and the Purpose of Revelation
  const unit2 = await prisma.unit.create({
    data: {
      courseId: hujjatullahCourse.id,
      title: 'Human Nature and the Purpose of Revelation',
      description: 'Understanding human fitrah and why divine guidance is necessary',
      orderIndex: 1,
      content: `
        <h2>The Starting Point: Understanding Human Nature (الفطرة)</h2>
        <p>Shah Wali Allah begins his analysis by examining human nature itself. He argues that to understand why we need divine law, we must first understand what kind of beings we are.</p>

        <h3>The Dual Nature of Humanity</h3>
        <p>Humans possess a unique combination of characteristics:</p>

        <div class="example-box">
          <h4>The Human Reality</h4>
          <table>
            <tr>
              <th>Aspect</th>
              <th>Description</th>
              <th>Implication</th>
            </tr>
            <tr>
              <td><strong>Physical Body</strong></td>
              <td>Material needs: food, shelter, reproduction</td>
              <td>We share animalistic drives</td>
            </tr>
            <tr>
              <td><strong>Rational Soul</strong></td>
              <td>Intellect, free will, moral capacity</td>
              <td>We can rise above animal nature</td>
            </tr>
            <tr>
              <td><strong>Social Being</strong></td>
              <td>Need for community and cooperation</td>
              <td>Individual welfare tied to societal welfare</td>
            </tr>
            <tr>
              <td><strong>Spiritual Dimension</strong></td>
              <td>Innate recognition of the Divine</td>
              <td>True fulfillment requires connection with Allah</td>
            </tr>
          </table>
        </div>

        <h3>The Fitrah: Innate Human Disposition</h3>
        <p>Shah Wali Allah extensively discusses the concept of <em>fitrah</em> - the natural disposition with which humans are created:</p>

        <div class="quran-verse">
          <p class="arabic">فَأَقِمْ وَجْهَكَ لِلدِّينِ حَنِيفًا ۚ فِطْرَتَ اللَّهِ الَّتِي فَطَرَ النَّاسَ عَلَيْهَا</p>
          <p>"So direct your face toward the religion, inclining to truth. [Adhere to] the fitrah of Allah upon which He has created [all] people." [Ar-Rum 30:30]</p>
        </div>

        <p>The fitrah includes:</p>
        <ul>
          <li><strong>Innate monotheism:</strong> Natural inclination to recognize a Creator</li>
          <li><strong>Moral intuition:</strong> Basic sense of right and wrong</li>
          <li><strong>Desire for meaning:</strong> Need to understand purpose and significance</li>
          <li><strong>Social cooperation:</strong> Natural tendency toward community</li>
        </ul>

        <h3>Why Human Intellect Alone is Insufficient</h3>
        <p>A crucial part of Shah Wali Allah's argument is explaining why, despite having intellect, humans still need divine revelation:</p>

        <div class="important-box">
          <h4>The Limitations of Unaided Reason</h4>
          <ol>
            <li><strong>Diversity of Opinions:</strong> Human reasoning leads to conflicting conclusions about ethics and law</li>
            <li><strong>Short-sightedness:</strong> Intellect focused on immediate benefit may miss long-term consequences</li>
            <li><strong>Bias and Desires:</strong> Human reasoning is often influenced by personal interests and whims</li>
            <li><strong>The Unseen Realm:</strong> Intellect cannot grasp details of afterlife, angels, and metaphysical realities</li>
            <li><strong>Spiritual Diseases:</strong> Pride, envy, and other heart diseases cloud judgment</li>
          </ol>
        </div>

        <h3>The Four Essential Human Needs (الارتفاقات الأربعة)</h3>
        <p>Shah Wali Allah identifies four fundamental arrangements (irtifaqat) that humans need for a functioning society:</p>

        <h4>1. Irtifaq of Livelihood (ارتفاق المعاش)</h4>
        <p>The arrangements related to earning a living and material sustenance:</p>
        <ul>
          <li>Agriculture, trade, and crafts</li>
          <li>Division of labor and specialization</li>
          <li>Fair exchange and commerce</li>
          <li>Property rights and wealth distribution</li>
        </ul>
        <p><strong>Islamic laws address:</strong> Trade regulations, prohibition of riba, zakat, inheritance laws</p>

        <h4>2. Irtifaq of Household (ارتفاق المنزل)</h4>
        <p>The arrangements related to family life:</p>
        <ul>
          <li>Marriage and family formation</li>
          <li>Child-rearing and education</li>
          <li>Gender roles and responsibilities</li>
          <li>Inheritance and family wealth</li>
        </ul>
        <p><strong>Islamic laws address:</strong> Marriage regulations, divorce rules, maintenance obligations, child custody</p>

        <h4>3. Irtifaq of Society (ارتفاق الأمة)</h4>
        <p>The arrangements related to broader community organization:</p>
        <ul>
          <li>Governance and leadership</li>
          <li>Justice system and conflict resolution</li>
          <li>Mutual cooperation and solidarity</li>
          <li>Defense and security</li>
        </ul>
        <p><strong>Islamic laws address:</strong> Judicial procedures, political ethics, community obligations, jihad regulations</p>

        <h4>4. Irtifaq of Self-Purification (ارتفاق التهذيب)</h4>
        <p>The arrangements related to spiritual development:</p>
        <ul>
          <li>Moral character development</li>
          <li>Controlling base desires</li>
          <li>Worship and God-consciousness</li>
          <li>Preparation for the Hereafter</li>
        </ul>
        <p><strong>Islamic laws address:</strong> Five pillars, ethics, prohibited behaviors, spiritual practices</p>

        <div class="example-box">
          <h4>🔗 The Interconnection</h4>
          <p>Shah Wali Allah emphasizes that these four irtifaqat are deeply interconnected:</p>
          <ul>
            <li>A healthy household depends on proper livelihood</li>
            <li>A just society requires spiritually sound individuals</li>
            <li>Economic prosperity is tied to moral ethics</li>
            <li>Spiritual growth is facilitated by stable social structures</li>
          </ul>
          <p>Islamic law addresses all four dimensions holistically, not in isolation.</p>
        </div>

        <h3>The Purpose of Revelation (حكمة الوحي)</h3>
        <p>Given human nature and needs, Shah Wali Allah explains that revelation serves to:</p>

        <table>
          <tr>
            <th>Function</th>
            <th>How Revelation Achieves It</th>
          </tr>
          <tr>
            <td><strong>Guide the Intellect</strong></td>
            <td>Provides correct principles and parameters for reasoning</td>
          </tr>
          <tr>
            <td><strong>Purify the Soul</strong></td>
            <td>Offers practices and methods to overcome spiritual diseases</td>
          </tr>
          <tr>
            <td><strong>Organize Society</strong></td>
            <td>Establishes just laws that balance individual and collective good</td>
          </tr>
          <tr>
            <td><strong>Reveal the Unseen</strong></td>
            <td>Informs about afterlife, angels, and metaphysical realities</td>
          </tr>
          <tr>
            <td><strong>Unite Humanity</strong></td>
            <td>Provides common framework transcending cultural differences</td>
          </tr>
        </table>

        <div class="hadith">
          <p>"I have left you upon a clear proof, its night is like its day. No one deviates from it after me except that he is destroyed."</p>
          <cite>— Ibn Majah</cite>
        </div>

        <h3>The Balance of This World and the Hereafter</h3>
        <p>A key insight from Shah Wali Allah is that Islamic law balances worldly wellbeing with afterlife success:</p>

        <div class="important-box">
          <h4>Neither Pure Asceticism Nor Pure Materialism</h4>
          <p>Islam does not advocate:</p>
          <ul>
            <li><strong>Monasticism:</strong> Rejecting worldly life entirely - condemned in Islam</li>
            <li><strong>Hedonism:</strong> Pursuing only worldly pleasure - leads to spiritual death</li>
          </ul>
          <p>Instead, Islam teaches using this world as a means to eternal success while enjoying Allah's blessings within limits.</p>
        </div>

        <div class="activity-box">
          <h4>📝 Reflection Exercise</h4>
          <p>Consider your own life in light of the four irtifaqat:</p>
          <ol>
            <li><strong>Livelihood:</strong> Is your work and income halal and blessed? Do you see it as worship?</li>
            <li><strong>Household:</strong> Are you fulfilling your family obligations with excellence?</li>
            <li><strong>Society:</strong> How do you contribute to your community's wellbeing?</li>
            <li><strong>Self-Purification:</strong> Are you actively working on your spiritual development?</li>
          </ol>
          <p>Identify one area needing improvement and make a specific plan.</p>
        </div>

        <h3>Conclusion: The Perfection of Shariah</h3>
        <p>Shah Wali Allah concludes this section by affirming that Islamic law, because it comes from the All-Knowing Creator who designed human nature, perfectly addresses all human needs in a balanced, comprehensive way.</p>

        <div class="quran-verse">
          <p class="arabic">الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا</p>
          <p>"This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as religion." [Al-Ma'idah 5:3]</p>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 2: Human Nature and Revelation');

  // Add Arabic Terms for Unit 2
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit2.id,
        arabicText: 'الفطرة',
        transliteration: 'Al-Fiṭrah',
        translation: 'The natural innate disposition upon which humans are created',
      },
      {
        unitId: unit2.id,
        arabicText: 'ارتفاق المعاش',
        transliteration: 'Irtifāq al-Ma\'āsh',
        translation: 'Arrangements related to livelihood and material sustenance',
      },
      {
        unitId: unit2.id,
        arabicText: 'ارتفاق المنزل',
        transliteration: 'Irtifāq al-Manzil',
        translation: 'Arrangements related to household and family life',
      },
      {
        unitId: unit2.id,
        arabicText: 'ارتفاق الأمة',
        transliteration: 'Irtifāq al-Ummah',
        translation: 'Arrangements related to society and governance',
      },
      {
        unitId: unit2.id,
        arabicText: 'ارتفاق التهذيب',
        transliteration: 'Irtifāq at-Tahdhīb',
        translation: 'Arrangements related to self-purification and spiritual development',
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
        questionText: 'What are the four essential irtifaqat (arrangements) that Shah Wali Allah identifies?',
        options: JSON.stringify([
          'Prayer, Fasting, Charity, Pilgrimage',
          'Livelihood, Household, Society, Self-Purification',
          'Faith, Knowledge, Action, Character',
          'Body, Mind, Soul, Spirit',
        ]),
        correctAnswer: 'Livelihood, Household, Society, Self-Purification',
        explanation: 'Shah Wali Allah identifies four fundamental arrangements: Irtifaq of Livelihood (Ma\'ash), Household (Manzil), Society (Ummah), and Self-Purification (Tahdhib).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Why does Shah Wali Allah argue that human intellect alone is insufficient for guidance?',
        options: JSON.stringify([
          'Because humans are completely irrational',
          'Because intellect is influenced by bias, desires, short-sightedness, and cannot grasp the unseen',
          'Because only prophets have intellect',
          'Because thinking is prohibited in Islam',
        ]),
        correctAnswer: 'Because intellect is influenced by bias, desires, short-sightedness, and cannot grasp the unseen',
        explanation: 'While humans have intellect, it has limitations: conflicting opinions, personal bias, focus on immediate benefits, and inability to know metaphysical realities.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'TRUE_FALSE',
        questionText: 'According to Shah Wali Allah, the four irtifaqat are deeply interconnected rather than isolated from each other.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Shah Wali Allah emphasizes that these arrangements are interconnected - spiritual health affects social life, economic prosperity depends on ethics, etc.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the fitrah include according to Shah Wali Allah?',
        options: JSON.stringify([
          'Only the ability to speak and walk',
          'Innate monotheism, moral intuition, desire for meaning, and social cooperation',
          'Only physical desires',
          'Complete knowledge of all Islamic rulings',
        ]),
        correctAnswer: 'Innate monotheism, moral intuition, desire for meaning, and social cooperation',
        explanation: 'Fitrah includes natural recognition of the Creator, basic sense of right and wrong, need for purpose, and tendency toward community.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 2');

  // Unit 3: The Wisdom of Worship ('Ibadat)
  const unit3 = await prisma.unit.create({
    data: {
      courseId: hujjatullahCourse.id,
      title: 'The Wisdom Behind Acts of Worship',
      description: 'Understanding the profound purposes of Salah, Sawm, Zakat, and Hajj',
      orderIndex: 2,
      content: `
        <h2>Beyond Ritual: The Philosophy of Worship</h2>
        <p>Shah Wali Allah dedicates significant attention to explaining why Allah prescribed specific acts of worship. He argues that worship is not arbitrary ritual, but a sophisticated system for human development and societal wellbeing.</p>

        <h3>The Multidimensional Benefits of Worship</h3>
        <p>Each act of worship serves multiple purposes simultaneously:</p>

        <div class="example-box">
          <h4>The Layers of Wisdom in 'Ibadat</h4>
          <ol>
            <li><strong>Spiritual Layer:</strong> Develops God-consciousness and purifies the heart</li>
            <li><strong>Individual Layer:</strong> Builds discipline, character, and self-control</li>
            <li><strong>Social Layer:</strong> Creates community bonds and social justice</li>
            <li><strong>Psychological Layer:</strong> Provides peace, purpose, and mental health</li>
            <li><strong>Physical Layer:</strong> Promotes health and bodily wellbeing</li>
          </ol>
        </div>

        <h3>Salah (الصلاة) - The Daily Connection</h3>

        <h4>The Spiritual Wisdom of Prayer</h4>
        <p>Shah Wali Allah explains that Salah serves as the primary means of maintaining constant awareness of Allah:</p>

        <div class="quran-verse">
          <p class="arabic">وَأَقِمِ الصَّلَاةَ لِذِكْرِي</p>
          <p>"And establish prayer for My remembrance." [Ta-Ha 20:14]</p>
        </div>

        <ul>
          <li><strong>Five times daily:</strong> Prevents the heart from becoming heedless and distant from Allah</li>
          <li><strong>Specific times:</strong> Marks life's transitions (dawn, midday, afternoon, sunset, night) with divine remembrance</li>
          <li><strong>Physical postures:</strong> Body follows heart in submission - standing, bowing, prostrating shows complete servitude</li>
          <li><strong>Quranic recitation:</strong> Mind is occupied with Allah's words, displacing worldly thoughts</li>
        </ul>

        <h4>The Social Wisdom of Congregational Prayer</h4>
        <p>The obligation of Jumu'ah and encouragement of congregation prayers serves:</p>
        <ul>
          <li><strong>Unity:</strong> Rich and poor, scholar and layman stand in equal rows</li>
          <li><strong>Discipline:</strong> Community maintains regular schedule together</li>
          <li><strong>Education:</strong> Knowledge is shared through khutbah and gatherings</li>
          <li><strong>Social cohesion:</strong> Regular face-to-face interaction builds bonds</li>
          <li><strong>Mutual care:</strong> Absent members are noticed and checked upon</li>
        </ul>

        <h4>The Psychological and Physical Benefits</h4>
        <table>
          <tr>
            <th>Aspect</th>
            <th>Benefit</th>
          </tr>
          <tr>
            <td><strong>Regular breaks from work</strong></td>
            <td>Prevents burnout and mental exhaustion</td>
          </tr>
          <tr>
            <td><strong>Physical movements</strong></td>
            <td>Exercise, stretching, improved blood circulation</td>
          </tr>
          <tr>
            <td><strong>Ablution (wudu)</strong></td>
            <td>Cleanliness and hygiene maintained throughout the day</td>
          </tr>
          <tr>
            <td><strong>Early rising (Fajr)</strong></td>
            <td>Healthier sleep patterns and productivity</td>
          </tr>
          <tr>
            <td><strong>Meditation-like focus</strong></td>
            <td>Reduces stress and anxiety</td>
          </tr>
        </table>

        <h3>Sawm (الصوم) - The Month of Self-Restraint</h3>

        <h4>The Wisdom of Fasting</h4>
        <p>Shah Wali Allah explains that fasting in Ramadan achieves multiple objectives:</p>

        <div class="example-box">
          <h4>The Purposes of Sawm</h4>
          
          <p><strong>1. Spiritual Purification</strong></p>
          <ul>
            <li>Breaking the dominance of bodily desires over the soul</li>
            <li>Developing taqwa (God-consciousness) through restraint</li>
            <li>Experiencing spiritual lightness through less food/drink</li>
          </ul>

          <p><strong>2. Empathy and Social Justice</strong></p>
          <ul>
            <li>The wealthy experience hunger, leading to compassion for the poor</li>
            <li>Increased charity and awareness of those in need</li>
            <li>Shared experience unites the ummah regardless of status</li>
          </ul>

          <p><strong>3. Self-Discipline and Willpower</strong></p>
          <ul>
            <li>Training to control base desires</li>
            <li>Building mental strength and patience</li>
            <li>Learning delayed gratification</li>
          </ul>

          <p><strong>4. Health Benefits</strong></p>
          <ul>
            <li>Digestive system rest and detoxification</li>
            <li>Metabolic benefits of intermittent fasting</li>
            <li>Breaking unhealthy eating habits</li>
          </ul>
        </div>

        <div class="hadith">
          <p>"Fasting is a shield. When one of you is fasting, let him not utter obscenities or act in an ignorant manner. If someone fights him or insults him, let him say: 'I am fasting, I am fasting.'"</p>
          <cite>— Sahih al-Bukhari</cite>
        </div>

        <p>This hadith shows that fasting is not just abstaining from food, but a comprehensive training in self-control and good character.</p>

        <h3>Zakat (الزكاة) - Purification Through Giving</h3>

        <h4>The Economic Wisdom</h4>
        <p>Shah Wali Allah provides a sophisticated analysis of Zakat's role in economic justice:</p>

        <ul>
          <li><strong>Wealth Circulation:</strong> Prevents wealth from stagnating with the rich</li>
          <li><strong>Poverty Alleviation:</strong> Systematic redistribution to those in need</li>
          <li><strong>Economic Stimulus:</strong> Puts money into circulation, benefiting trade</li>
          <li><strong>Social Safety Net:</strong> Creates a system where the community cares for its vulnerable</li>
        </ul>

        <div class="quran-verse">
          <p class="arabic">خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا</p>
          <p>"Take from their wealth a charity by which you purify them and cause them increase." [At-Tawbah 9:103]</p>
        </div>

        <h4>The Spiritual Wisdom</h4>
        <p>Zakat purifies both wealth and soul:</p>
        <ul>
          <li><strong>Detachment from materialism:</strong> Reminds that wealth is a trust, not ultimate possession</li>
          <li><strong>Gratitude:</strong> Acknowledges that all provision is from Allah</li>
          <li><strong>Generosity:</strong> Develops a giving nature, combating greed</li>
          <li><strong>Brotherhood:</strong> Creates bonds between different economic classes</li>
        </ul>

        <h4>Why 2.5%? The Mathematical Wisdom</h4>
        <div class="important-box">
          <p>Shah Wali Allah notes the balance in Zakat's rate:</p>
          <ul>
            <li><strong>Not too high:</strong> Does not discourage wealth accumulation and investment</li>
            <li><strong>Not too low:</strong> Sufficient to make meaningful impact on poverty</li>
            <li><strong>Annual:</strong> Allows wealth to grow while ensuring regular redistribution</li>
            <li><strong>On surplus:</strong> Only on wealth beyond basic needs (nisab threshold)</li>
          </ul>
        </div>

        <h3>Hajj (الحج) - The Ultimate Journey</h3>

        <h4>The Spiritual Transformation</h4>
        <p>Hajj represents the pinnacle of spiritual experience in Islam:</p>

        <ul>
          <li><strong>Leaving comfort:</strong> Journey to barren desert mirrors spiritual stripping of worldly attachments</li>
          <li><strong>Ihram (pilgrim's garment):</strong> All wear simple white cloth - erases all worldly distinctions</li>
          <li><strong>Tawaf around Ka'bah:</strong> Heart circles the House of Allah, symbolizing life revolving around worship</li>
          <li><strong>Standing at Arafat:</strong> Prefigures Day of Judgment when all stand before Allah</li>
          <li><strong>Return home:</strong> Symbolizes spiritual rebirth - return as "new person"</li>
        </ul>

        <h4>The Social and Historical Dimensions</h4>
        <p>Hajj also serves profound social purposes:</p>

        <table>
          <tr>
            <th>Aspect</th>
            <th>Social Benefit</th>
          </tr>
          <tr>
            <td><strong>Global Gathering</strong></td>
            <td>Muslims from all nations, cultures unite in single purpose</td>
          </tr>
          <tr>
            <td><strong>Ummah Consciousness</strong></td>
            <td>Experience of being part of global Muslim community</td>
          </tr>
          <tr>
            <td><strong>Historical Connection</strong></td>
            <td>Reliving the legacy of Ibrahim, Hajar, and Muhammad ﷺ</td>
          </tr>
          <tr>
            <td><strong>Networking</strong></td>
            <td>Scholars, leaders, common people exchange knowledge</td>
          </tr>
          <tr>
            <td><strong>Trade and Economy</strong></td>
            <td>Historical role as commercial hub for Muslim world</td>
          </tr>
        </table>

        <div class="activity-box">
          <h4>📝 Personal Reflection</h4>
          <p>For each pillar of Islam you practice, ask yourself:</p>
          <ol>
            <li><strong>Am I aware of the wisdom behind this act?</strong></li>
            <li><strong>Do I perform it merely as ritual or with conscious purpose?</strong></li>
            <li><strong>How can I enhance my practice to achieve its intended effects?</strong></li>
          </ol>
          <p>Choose one pillar to focus on improving this week with renewed understanding.</p>
        </div>

        <h3>The Unified System</h3>
        <p>Shah Wali Allah emphasizes that these acts of worship form an integrated system:</p>

        <div class="example-box">
          <h4>🔗 The Interconnected Pillars</h4>
          <ul>
            <li><strong>Shahada</strong> provides the foundation - knowing Who we worship</li>
            <li><strong>Salah</strong> maintains daily connection - constant remembrance</li>
            <li><strong>Zakat</strong> purifies wealth and ensures social justice</li>
            <li><strong>Sawm</strong> trains in self-control and empathy</li>
            <li><strong>Hajj</strong> brings ultimate spiritual experience and unity</li>
          </ul>
          <p>Together, they shape the individual and society toward perfection.</p>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 3: Wisdom of Worship');

  // Add Arabic Terms for Unit 3
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit3.id,
        arabicText: 'العبادات',
        transliteration: 'Al-\'Ibādāt',
        translation: 'Acts of worship',
      },
      {
        unitId: unit3.id,
        arabicText: 'الحكمة من العبادة',
        transliteration: 'Al-Ḥikmah min al-\'Ibādah',
        translation: 'The wisdom behind worship',
      },
      {
        unitId: unit3.id,
        arabicText: 'التطهير',
        transliteration: 'At-Taṭhīr',
        translation: 'Purification, cleansing',
      },
      {
        unitId: unit3.id,
        arabicText: 'التزكية',
        transliteration: 'At-Tazkiyah',
        translation: 'Spiritual growth and purification',
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
        questionText: 'According to Shah Wali Allah, what are the multiple dimensions of benefit that worship provides?',
        options: JSON.stringify([
          'Only spiritual benefits',
          'Only social benefits',
          'Spiritual, individual, social, psychological, and physical benefits',
          'Only rewards in the afterlife',
        ]),
        correctAnswer: 'Spiritual, individual, social, psychological, and physical benefits',
        explanation: 'Shah Wali Allah argues that each act of worship serves multiple purposes simultaneously across different dimensions of human life.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Why is Zakat set at 2.5% according to Shah Wali Allah\'s analysis?',
        options: JSON.stringify([
          'It\'s an arbitrary number',
          'It balances not being too high to discourage wealth while being sufficient to impact poverty',
          'It\'s the maximum people can afford',
          'It\'s only symbolic with no real economic purpose',
        ]),
        correctAnswer: 'It balances not being too high to discourage wealth while being sufficient to impact poverty',
        explanation: 'The rate of 2.5% is carefully balanced - not too high to discourage investment, not too low to be ineffective in poverty alleviation.',
        difficulty: 'HARD',
      },
      {
        unitId: unit3.id,
        type: 'TRUE_FALSE',
        questionText: 'Shah Wali Allah teaches that Hajj symbolizes the Day of Judgment, especially the standing at Arafat.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The standing at Arafat prefigures the Day of Judgment when all humanity will stand before Allah, making it a spiritually transformative experience.',
        difficulty: 'EASY',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What social purpose does congregational prayer serve according to Shah Wali Allah?',
        options: JSON.stringify([
          'Only to make mosques crowded',
          'Unity, discipline, education, social cohesion, and mutual care',
          'Only to follow rules',
          'No social purpose, only spiritual',
        ]),
        correctAnswer: 'Unity, discipline, education, social cohesion, and mutual care',
        explanation: 'Congregational prayer serves multiple social functions including uniting rich and poor, maintaining discipline, sharing knowledge, and building community bonds.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 3');

  // Unit 4: The Philosophy of Halal and Haram
  const unit4 = await prisma.unit.create({
    data: {
      courseId: hujjatullahCourse.id,
      title: 'The Philosophy of Halal and Haram',
      description: 'Understanding the wisdom behind Islamic prohibitions and permissions',
      orderIndex: 3,
      content: `
        <h2>Divine Legislation: The Science of Halal and Haram</h2>
        <p>One of the most profound sections of Hujjatullah Al-Balighah deals with why certain things are prohibited while others are permitted. Shah Wali Allah demonstrates that these rulings are not arbitrary but based on deep wisdom regarding human nature and societal wellbeing.</p>

        <h3>The Foundational Principle</h3>
        <div class="important-box">
          <h4>The Default State</h4>
          <p>Shah Wali Allah begins with a crucial principle:</p>
          <ul>
            <li><strong>Original state:</strong> Everything is permissible (mubah) unless there is a clear prohibition</li>
            <li><strong>Prohibitions are limited:</strong> Allah only forbids what is genuinely harmful</li>
            <li><strong>Permissions are vast:</strong> The sphere of halal is immensely wider than haram</li>
          </ul>
        </div>

        <div class="quran-verse">
          <p class="arabic">وَسَخَّرَ لَكُم مَّا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ جَمِيعًا مِّنْهُ</p>
          <p>"And He has subjected to you whatever is in the heavens and whatever is on the earth - all from Him." [Al-Jathiyah 45:13]</p>
        </div>

        <h3>Categories of Prohibited Things</h3>
        <p>Shah Wali Allah categorizes prohibitions based on the nature of harm they cause:</p>

        <h4>1. Food and Drink Prohibitions</h4>

        <div class="example-box">
          <h4>Prohibited Foods: Pork, Carrion, Blood, Intoxicants</h4>
          
          <p><strong>Physical Harm:</strong></p>
          <ul>
            <li><strong>Pork:</strong> Contains harmful substances, prone to parasites, difficult to digest</li>
            <li><strong>Carrion:</strong> Decomposition produces toxins harmful to health</li>
            <li><strong>Blood:</strong> Carries diseases and harmful waste products</li>
            <li><strong>Intoxicants:</strong> Damage the liver, brain, and other organs</li>
          </ul>

          <p><strong>Spiritual Harm:</strong></p>
          <ul>
            <li>Consuming impure things affects the purity of the soul</li>
            <li>Intoxicants veil the intellect, preventing God-consciousness</li>
            <li>What enters the body influences character and behavior</li>
          </ul>

          <p><strong>Social Harm:</strong></p>
          <ul>
            <li>Alcohol leads to violence, family breakdown, and societal problems</li>
            <li>Loss of inhibitions causes immoral behavior</li>
            <li>Economic harm from addiction and impaired productivity</li>
          </ul>
        </div>

        <div class="hadith">
          <p>"Every intoxicant is khamr (prohibited alcohol), and every intoxicant is haram."</p>
          <cite>— Sahih Muslim</cite>
        </div>

        <h4>2. Sexual Ethics and Family Protection</h4>
        <p>Shah Wali Allah provides extensive analysis of why Islam prohibits zina (fornication/adultery) and related acts:</p>

        <table>
          <tr>
            <th>Level of Harm</th>
            <th>Consequences of Sexual Immorality</th>
          </tr>
          <tr>
            <td><strong>Individual</strong></td>
            <td>
              • Loss of spiritual purity and God-consciousness<br>
              • Psychological guilt and anxiety<br>
              • Physical health risks (diseases)<br>
              • Damaged ability to form stable relationships
            </td>
          </tr>
          <tr>
            <td><strong>Family</strong></td>
            <td>
              • Destruction of trust between spouses<br>
              • Children born outside marriage lack stable family<br>
              • Confusion about lineage and inheritance<br>
              • Family breakdown and trauma
            </td>
          </tr>
          <tr>
            <td><strong>Society</strong></td>
            <td>
              • Weakening of family structure (foundation of society)<br>
              • Spread of disease<br>
              • Economic burden (single parenthood, welfare)<br>
              • Moral degradation and loss of values
            </td>
          </tr>
        </table>

        <h4>The Comprehensive Protective System</h4>
        <p>Shah Wali Allah explains that Islam doesn't just prohibit the final act, but blocks all pathways leading to it:</p>

        <div class="example-box">
          <h4>The Protective Barriers (سد الذرائع)</h4>
          <ol>
            <li><strong>Lowering the gaze:</strong> Prevents lustful thoughts from arising</li>
            <li><strong>Modest dress:</strong> Reduces sexual objectification</li>
            <li><strong>Gender interaction rules:</strong> Maintains professional, respectful boundaries</li>
            <li><strong>Prohibition of khalwa:</strong> Preventing unmarried men and women from being alone</li>
            <li><strong>Marriage facilitation:</strong> Making halal intimacy accessible and encouraged</li>
          </ol>
          <p>This shows Islam's wisdom: prevention is easier than cure. By blocking pathways to sin, the final prohibition becomes easier to uphold.</p>
        </div>

        <h4>3. Economic Justice: Riba (Interest) and Exploitation</h4>
        <p>The prohibition of riba is one of the most emphatic in the Quran, and Shah Wali Allah explains why:</p>

        <div class="quran-verse">
          <p class="arabic">يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَذَرُوا مَا بَقِيَ مِنَ الرِّبَا إِن كُنتُم مُّؤْمِنِينَ</p>
          <p>"O you who believe, fear Allah and give up what remains of interest, if you are believers." [Al-Baqarah 2:278]</p>
        </div>

        <h4>The Harms of Riba</h4>

        <div class="important-box">
          <p><strong>Economic Harms:</strong></p>
          <ul>
            <li><strong>Wealth concentration:</strong> Money flows from poor to rich automatically</li>
            <li><strong>Exploitation:</strong> Taking advantage of people's desperation</li>
            <li><strong>Productive vs. Parasitic:</strong> Rewards lending over actual work and production</li>
            <li><strong>Debt slavery:</strong> Compound interest traps people in endless debt</li>
            <li><strong>Economic instability:</strong> Interest-based systems lead to bubbles and crises</li>
          </ul>

          <p><strong>Social Harms:</strong></p>
          <ul>
            <li>Creates class of extremely wealthy vs. debt-burdened masses</li>
            <li>Destroys social solidarity and mutual help</li>
            <li>Encourages materialistic, transaction-based relationships</li>
          </ul>

          <p><strong>Spiritual Harms:</strong></p>
          <ul>
            <li>Makes profit from others' misfortune (the needy borrower)</li>
            <li>Violates principle of sharing risk and reward</li>
            <li>Contradicts values of generosity and brotherhood</li>
          </ul>
        </div>

        <h4>The Islamic Alternative</h4>
        <p>Shah Wali Allah shows that Islam doesn't just prohibit but provides alternatives:</p>
        <ul>
          <li><strong>Profit-sharing (Mudarabah):</strong> Investor and entrepreneur share both risk and profit</li>
          <li><strong>Partnership (Musharakah):</strong> Joint ownership and shared outcomes</li>
          <li><strong>Interest-free loans (Qard Hasan):</strong> For those in need</li>
          <li><strong>Zakat and charity:</strong> Voluntary support system</li>
        </ul>

        <h4>4. The Prohibition of Intoxicants: A Case Study</h4>
        <p>Shah Wali Allah uses alcohol as a prime example of Islamic wisdom in legislation:</p>

        <h4>The Gradual Prohibition</h4>
        <div class="example-box">
          <p>The Quran prohibited alcohol in stages:</p>
          <ol>
            <li><strong>Stage 1:</strong> Pointing out harm exists alongside benefit (2:219)</li>
            <li><strong>Stage 2:</strong> Don't pray while intoxicated (4:43)</li>
            <li><strong>Stage 3:</strong> Complete prohibition - "work of Satan" (5:90)</li>
          </ol>
          <p>This gradual approach shows divine wisdom in behavior change - giving people time to adjust rather than overnight revolution.</p>
        </div>

        <h4>Why Such Emphasis on Intoxicants?</h4>
        <p>Shah Wali Allah identifies alcohol as the "mother of evils" because:</p>

        <table>
          <tr>
            <th>Harm</th>
            <th>Consequence</th>
          </tr>
          <tr>
            <td><strong>Veils Intellect</strong></td>
            <td>The very faculty that distinguishes humans is impaired</td>
          </tr>
          <tr>
            <td><strong>Removes Inhibitions</strong></td>
            <td>Leads to committing other sins (zina, violence, neglect of prayer)</td>
          </tr>
          <tr>
            <td><strong>Addiction</strong></td>
            <td>Enslaves the person to a substance, contradicting human dignity</td>
          </tr>
          <tr>
            <td><strong>Family Destruction</strong></td>
            <td>Domestic violence, neglect of children, financial ruin</td>
          </tr>
          <tr>
            <td><strong>Social Problems</strong></td>
            <td>Crime, accidents, healthcare burden, lost productivity</td>
          </tr>
        </table>

        <h3>The Balance of Shariah</h3>
        <p>Shah Wali Allah emphasizes that Islamic law balances multiple considerations:</p>

        <div class="important-box">
          <h4>The Five Necessities (الضرورات الخمس)</h4>
          <p>All Islamic legislation aims to protect five essential matters:</p>
          <ol>
            <li><strong>Religion (الدين):</strong> Freedom to worship and practice faith</li>
            <li><strong>Life (النفس):</strong> Sanctity and protection of human life</li>
            <li><strong>Intellect (العقل):</strong> Preservation of sound reasoning</li>
            <li><strong>Lineage (النسل):</strong> Family structure and clear ancestry</li>
            <li><strong>Property (المال):</strong> Right to own and be secure in wealth</li>
          </ol>
          <p>Every prohibition serves to protect one or more of these necessities.</p>
        </div>

        <h3>The Principle of Harm Removal</h3>
        <div class="hadith">
          <p>"There should be neither harming nor reciprocating harm."</p>
          <cite>— Sunan Ibn Majah</cite>
        </div>

        <p>Shah Wali Allah explains this fundamental principle: Islam prohibits what causes harm and permits what brings benefit. When something has both harm and benefit:</p>
        <ul>
          <li>If harm outweighs benefit → Prohibited (e.g., alcohol)</li>
          <li>If benefit outweighs harm → Permitted (e.g., medicine with side effects)</li>
          <li>In cases of necessity, prohibitions may be temporarily lifted (e.g., eating pork to save life)</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Critical Thinking Exercise</h4>
          <p>Choose one Islamic prohibition and analyze it using Shah Wali Allah's framework:</p>
          <ol>
            <li>What are the physical harms?</li>
            <li>What are the spiritual harms?</li>
            <li>What are the social harms?</li>
            <li>Which of the five necessities does it protect?</li>
            <li>How does this prohibition demonstrate divine wisdom?</li>
          </ol>
        </div>

        <h3>Conclusion: The Mercy in Legislation</h3>
        <p>Shah Wali Allah concludes that every Islamic prohibition is an act of divine mercy, protecting humans from harm they may not fully perceive. Far from restricting freedom, these laws liberate humans from enslavement to harmful desires and create the conditions for individual flourishing and social justice.</p>

        <div class="quran-verse">
          <p class="arabic">وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ</p>
          <p>"And We have not sent you except as a mercy to the worlds." [Al-Anbiya 21:107]</p>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 4: Philosophy of Halal and Haram');

  // Add Arabic Terms for Unit 4
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit4.id,
        arabicText: 'الحلال',
        transliteration: 'Al-Ḥalāl',
        translation: 'The permitted, lawful',
      },
      {
        unitId: unit4.id,
        arabicText: 'الحرام',
        transliteration: 'Al-Ḥarām',
        translation: 'The prohibited, forbidden',
      },
      {
        unitId: unit4.id,
        arabicText: 'سد الذرائع',
        transliteration: 'Sadd adh-Dharā\'i\'',
        translation: 'Blocking the means (pathways to sin)',
      },
      {
        unitId: unit4.id,
        arabicText: 'الضرورات الخمس',
        transliteration: 'Aḍ-Ḍarūrāt al-Khams',
        translation: 'The five necessities (religion, life, intellect, lineage, property)',
      },
      {
        unitId: unit4.id,
        arabicText: 'الربا',
        transliteration: 'Ar-Ribā',
        translation: 'Interest, usury',
      },
      {
        unitId: unit4.id,
        arabicText: 'لا ضرر ولا ضرار',
        transliteration: 'Lā ḍarar wa lā ḍirār',
        translation: 'No harm and no reciprocating harm',
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
        questionText: 'What are the five necessities (Darurat al-Khams) that Islamic law protects?',
        options: JSON.stringify([
          'Prayer, Fasting, Charity, Pilgrimage, Faith',
          'Religion, Life, Intellect, Lineage, Property',
          'Health, Wealth, Family, Education, Safety',
          'Faith, Hope, Charity, Justice, Peace',
        ]),
        correctAnswer: 'Religion, Life, Intellect, Lineage, Property',
        explanation: 'Every Islamic prohibition serves to protect one or more of these five essential matters: Religion (Din), Life (Nafs), Intellect (Aql), Lineage (Nasl), and Property (Mal).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Why does Shah Wali Allah say Islam prohibited alcohol in gradual stages?',
        options: JSON.stringify([
          'Allah was unsure about the ruling',
          'To show divine wisdom in behavior change by giving people time to adjust',
          'Because alcohol wasn\'t very harmful at first',
          'It was a mistake in revelation',
        ]),
        correctAnswer: 'To show divine wisdom in behavior change by giving people time to adjust',
        explanation: 'The gradual prohibition shows divine wisdom in understanding human psychology and facilitating behavior change rather than demanding overnight transformation.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Shah Wali Allah, what is the principle of "Sadd adh-Dhara\'i\'" (blocking the means)?',
        options: JSON.stringify([
          'Only prohibiting the final sinful act',
          'Blocking all pathways and means that lead to the prohibited act',
          'Making everything prohibited to be safe',
          'Allowing small sins to prevent big ones',
        ]),
        correctAnswer: 'Blocking all pathways and means that lead to the prohibited act',
        explanation: 'Islam doesn\'t just prohibit the final act but blocks all pathways leading to it, showing wisdom that prevention is easier than cure.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'TRUE_FALSE',
        questionText: 'According to Shah Wali Allah, the sphere of halal (permitted) is vastly wider than the sphere of haram (prohibited).',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The foundational principle is that everything is permissible unless specifically prohibited. Prohibitions are limited while permissions are vast.',
        difficulty: 'EASY',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Why does Shah Wali Allah call alcohol the "mother of evils"?',
        options: JSON.stringify([
          'Because it tastes bad',
          'Because it impairs intellect and removes inhibitions, leading to other sins',
          'Because it\'s expensive',
          'Because only evil people drink it',
        ]),
        correctAnswer: 'Because it impairs intellect and removes inhibitions, leading to other sins',
        explanation: 'Alcohol is called the mother of evils because it veils the intellect (the distinguishing human faculty) and removes inhibitions, leading to violence, zina, neglect of prayer, and other sins.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 4');

  // Unit 5: Marriage and Family Ethics
  const unit5 = await prisma.unit.create({
    data: {
      courseId: hujjatullahCourse.id,
      title: 'Marriage and Family: The Foundation of Society',
      description: 'Understanding the wisdom behind Islamic marriage laws and family structure',
      orderIndex: 4,
      content: `
        <h2>Marriage: The Cornerstone of Civilization</h2>
        <p>Shah Wali Allah dedicates extensive analysis to marriage and family structure, demonstrating that Islamic family law is designed to create stable, loving relationships that benefit individuals, families, and society.</p>

        <h3>From Hujjatullah Al-Balighah: The Purpose of Marriage</h3>
        <div class="hadith">
          <p class="arabic-quote">"إن الله تعالى جعل النكاح سكناً للنفس وراحة للبدن وحصناً من الفتنة وسبباً لدوام النسل وبقاء النوع"</p>
          <p>"Indeed, Allah has made marriage a tranquility for the soul, rest for the body, a fortress from temptation, a means for the continuation of lineage, and the preservation of the human species."</p>
          <cite>— Hujjatullah Al-Balighah, Vol. 2, Chapter on Marriage</cite>
        </div>

        <h3>The Multi-Dimensional Wisdom</h3>
        <p>Shah Wali Allah identifies several dimensions of wisdom in marriage:</p>

        <div class="example-box">
          <h4>1. Psychological Dimension (البعد النفسي)</h4>
          <div class="quran-verse">
            <p class="arabic">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً</p>
            <p>"And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy." [Ar-Rum 30:21]</p>
          </div>
          <p>Shah Wali Allah explains that humans need companionship, emotional intimacy, and the comfort of a life partner. Marriage fulfills this deep psychological need in a structured, blessed way.</p>

          <h4>2. Physical Dimension (البعد الجسدي)</h4>
          <p>Marriage provides a lawful outlet for natural desires, protecting society from:</p>
          <ul>
            <li>Promiscuity and its diseases</li>
            <li>Children born outside stable families</li>
            <li>Social chaos from unregulated sexual relations</li>
          </ul>

          <h4>3. Social Dimension (البعد الاجتماعي)</h4>
          <p>Marriage creates extended families, alliances between families, and the basic unit of society. Shah Wali Allah notes:</p>
          <div class="hadith">
            <p class="arabic-quote">"الأسرة هي نواة المجتمع، وصلاح المجتمع من صلاح الأسرة، وفساده من فسادها"</p>
            <p>"The family is the nucleus of society. The righteousness of society comes from the righteousness of the family, and its corruption from its corruption."</p>
            <cite>— Hujjatullah Al-Balighah</cite>
          </div>
        </div>

        <h3>The Rights and Responsibilities</h3>
        <p>Shah Wali Allah emphasizes the balance of rights in Islamic marriage:</p>

        <table>
          <tr>
            <th>Rights of the Wife</th>
            <th>Rights of the Husband</th>
          </tr>
          <tr>
            <td>Financial maintenance (housing, food, clothing)</td>
            <td>Obedience in matters of ma'ruf (good)</td>
          </tr>
          <tr>
            <td>Kind treatment and respect</td>
            <td>Care of his property and home</td>
          </tr>
          <tr>
            <td>Physical intimacy</td>
            <td>Physical intimacy</td>
          </tr>
          <tr>
            <td>Protection and security</td>
            <td>Respect and honor</td>
          </tr>
          <tr>
            <td>Freedom to own and manage property</td>
            <td>Consultation in family matters</td>
          </tr>
        </table>

        <h3>The Wisdom of Divorce Regulations</h3>
        <p>Shah Wali Allah explains why Islam permits divorce while discouraging it:</p>

        <div class="hadith">
          <p>"The most hated of permissible things to Allah is divorce."</p>
          <cite>— Abu Dawud</cite>
        </div>

        <p>The wisdom includes:</p>
        <ul>
          <li><strong>Escape from harm:</strong> If a marriage becomes unbearable, forcing continuation causes more harm</li>
          <li><strong>Waiting period ('Iddah):</strong> Gives time for reconciliation and ensures no pregnancy</li>
          <li><strong>Limited to three:</strong> Prevents impulsive, repeated divorces</li>
          <li><strong>Financial obligations:</strong> Husband must provide during 'iddah, protecting the woman</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Reflection for the Married</h4>
          <p>If married, reflect:</p>
          <ol>
            <li>Am I fulfilling my spouse's rights?</li>
            <li>Do I show appreciation and gratitude?</li>
            <li>How can I make my home a place of sakina (tranquility)?</li>
          </ol>
        </div>

        <div class="activity-box">
          <h4>📝 Reflection for the Unmarried</h4>
          <p>If unmarried, consider:</p>
          <ol>
            <li>Am I preparing myself to be a good spouse?</li>
            <li>What qualities do I seek that align with Islamic values?</li>
            <li>Am I ready for the responsibilities of marriage?</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 5: Marriage and Family');

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit5.id,
        arabicText: 'السكينة',
        transliteration: 'As-Sakīnah',
        translation: 'Tranquility, peace, serenity',
      },
      {
        unitId: unit5.id,
        arabicText: 'المودة',
        transliteration: 'Al-Mawaddah',
        translation: 'Affection, love',
      },
      {
        unitId: unit5.id,
        arabicText: 'الرحمة',
        transliteration: 'Ar-Raḥmah',
        translation: 'Mercy, compassion',
      },
      {
        unitId: unit5.id,
        arabicText: 'العدة',
        transliteration: 'Al-\'Iddah',
        translation: 'Waiting period after divorce or widowhood',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Shah Wali Allah in Hujjatullah Al-Balighah, what are the purposes of marriage?',
        options: JSON.stringify([
          'Only for having children',
          'Tranquility for soul, rest for body, fortress from temptation, continuation of lineage',
          'Only for financial security',
          'Only for social status',
        ]),
        correctAnswer: 'Tranquility for soul, rest for body, fortress from temptation, continuation of lineage',
        explanation: 'Shah Wali Allah describes marriage as serving multiple purposes: psychological, physical, spiritual, and social.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // Unit 6: Jihad and its True Meaning
  const unit6 = await prisma.unit.create({
    data: {
      courseId: hujjatullahCourse.id,
      title: 'Jihad: Struggle for Justice and Self-Defense',
      description: 'Understanding the true Islamic concept of jihad and its regulations',
      orderIndex: 5,
      content: `
        <h2>Jihad: The Misunderstood Concept</h2>
        <p>Perhaps no Islamic concept has been more misunderstood than jihad. Shah Wali Allah provides clarity by explaining its true meaning, purpose, and strict regulations.</p>

        <h3>From Hujjatullah Al-Balighah: The Definition of Jihad</h3>
        <div class="hadith">
          <p class="arabic-quote">"الجهاد في اللغة: بذل الوسع والطاقة في مدافعة العدو. وفي الشرع: بذل الوسع في قتال الكفار والدفع عن حوزة الإسلام وحماية المسلمين"</p>
          <p>"Jihad linguistically means: Exerting utmost effort and capacity in repelling the enemy. In Islamic law: Exerting effort in fighting aggressors to defend the realm of Islam and protect Muslims."</p>
          <cite>— Hujjatullah Al-Balighah, Vol. 2, Section on Jihad</cite>
        </div>

        <h3>The Levels of Jihad</h3>
        <p>Shah Wali Allah, following the tradition of Islamic scholars, identifies four levels:</p>

        <div class="example-box">
          <h4>1. Jihad against the Self (جهاد النفس)</h4>
          <p>The struggle against one's own desires and temptations - this is the "Greater Jihad"</p>
          <div class="hadith">
            <p>"We have returned from the lesser jihad to the greater jihad." When asked "What is the greater jihad?" The Prophet replied: "The jihad against one's self."</p>
            <cite>— Al-Bayhaqi (with scholarly debate on authenticity, but the meaning is accepted)</cite>
          </div>

          <h4>2. Jihad against Shaytan (جهاد الشيطان)</h4>
          <p>Resisting the whispers and temptations of Satan</p>

          <h4>3. Jihad with the Tongue and Hand (جهاد اللسان واليد)</h4>
          <p>Speaking truth, enjoining good, forbidding evil, working for justice</p>

          <h4>4. Jihad through Fighting (جهاد السيف)</h4>
          <p>Physical combat, but only under strict conditions</p>
        </div>

        <h3>The Conditions and Ethics of Military Jihad</h3>
        <p>Shah Wali Allah emphasizes that military jihad has strict regulations:</p>

        <div class="important-box">
          <h4>When is Military Jihad Permitted?</h4>
          <div class="hadith">
            <p class="arabic-quote">"لا يحل الجهاد إلا لرد عدوان أو لدفع فتنة أو لنصرة مظلوم أو لحماية الدين من الإكراه"</p>
            <p>"Jihad is not permissible except to repel aggression, to prevent persecution, to support the oppressed, or to protect religion from coercion."</p>
            <cite>— Hujjatullah Al-Balighah</cite>
          </div>

          <p><strong>The purposes:</strong></p>
          <ul>
            <li><strong>Self-defense:</strong> When Muslims are attacked</li>
            <li><strong>Defending the oppressed:</strong> Protecting those unable to defend themselves</li>
            <li><strong>Removing persecution:</strong> When people are prevented from practicing their religion</li>
            <li><strong>Establishing justice:</strong> Not for conquest or wealth</li>
          </ul>
        </div>

        <h3>The Prohibited Actions in Warfare</h3>
        <p>Islamic warfare has strict ethical guidelines that were revolutionary for their time:</p>

        <table>
          <tr>
            <th>Prohibition</th>
            <th>Evidence</th>
          </tr>
          <tr>
            <td>Killing non-combatants</td>
            <td>"Do not kill children, women, or elderly" — Prophet ﷺ</td>
          </tr>
          <tr>
            <td>Destroying crops/trees</td>
            <td>"Do not cut down trees or destroy crops" — Abu Bakr</td>
          </tr>
          <tr>
            <td>Mutilating bodies</td>
            <td>"Do not mutilate" — Prophet ﷺ</td>
          </tr>
          <tr>
            <td>Treachery/betrayal</td>
            <td>"Fulfill your covenants" — Quran</td>
          </tr>
          <tr>
            <td>Forced conversion</td>
            <td>"There is no compulsion in religion" — Quran 2:256</td>
          </tr>
        </table>

        <h3>The Wisdom Behind Military Jihad</h3>
        <p>Shah Wali Allah explains the wisdom:</p>

        <ul>
          <li><strong>Human Nature:</strong> Humans sometimes resort to aggression; defense mechanisms are necessary</li>
          <li><strong>Protection of the Weak:</strong> The strong must protect those unable to defend themselves</li>
          <li><strong>Deterrence:</strong> Ability to defend prevents aggression</li>
          <li><strong>Justice:</strong> Sometimes force is needed to stop injustice</li>
        </ul>

        <div class="quran-verse">
          <p class="arabic">وَمَا لَكُمْ لَا تُقَاتِلُونَ فِي سَبِيلِ اللَّهِ وَالْمُسْتَضْعَفِينَ مِنَ الرِّجَالِ وَالنِّسَاءِ وَالْوِلْدَانِ</p>
          <p>"And what is [the matter] with you that you fight not in the cause of Allah and [for] the oppressed among men, women, and children." [An-Nisa 4:75]</p>
        </div>

        <div class="important-box">
          <h4>⚠️ Modern Context</h4>
          <p>Shah Wali Allah emphasizes that jihad must be:</p>
          <ul>
            <li>Declared by legitimate authority, not individuals</li>
            <li>Conducted according to Shariah regulations</li>
            <li>Aimed at justice, not terrorism or chaos</li>
            <li>Protective of civilians and non-combatants</li>
          </ul>
          <p>Terrorist acts that kill civilians are explicitly condemned by Islam and violate all jihad regulations.</p>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 6: Jihad');

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit6.id,
        arabicText: 'الجهاد',
        transliteration: 'Al-Jihād',
        translation: 'Struggle, striving in Allah\'s path',
      },
      {
        unitId: unit6.id,
        arabicText: 'جهاد النفس',
        transliteration: 'Jihād an-Nafs',
        translation: 'The struggle against one\'s lower self (greater jihad)',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the "Greater Jihad" according to Islamic tradition?',
        options: JSON.stringify([
          'Fighting in battles',
          'The struggle against one\'s own self and desires',
          'Building mosques',
          'Memorizing the Quran',
        ]),
        correctAnswer: 'The struggle against one\'s own self and desires',
        explanation: 'The greater jihad is the internal struggle against one\'s own desires and temptations, while military jihad is considered the lesser jihad.',
        difficulty: 'EASY',
      },
      {
        unitId: unit6.id,
        type: 'TRUE_FALSE',
        questionText: 'According to Shah Wali Allah, forced conversion is prohibited in Islam.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Quran explicitly states "There is no compulsion in religion" (2:256), and this is a fundamental principle in Islamic law.',
        difficulty: 'EASY',
      },
    ],
  });

  // Unit 7: The Maqasid (Higher Objectives) of Shariah
  const unit7 = await prisma.unit.create({
    data: {
      courseId: hujjatullahCourse.id,
      title: 'Maqasid al-Shariah: The Higher Objectives of Islamic Law',
      description: 'Understanding the overarching goals and wisdom of Shariah',
      orderIndex: 6,
      content: `
        <h2>The Maqasid: Understanding the "Why" Behind the "What"</h2>
        <p>Shah Wali Allah's entire work is essentially an exploration of the Maqasid (objectives) of Shariah. This unit synthesizes his comprehensive vision.</p>

        <h3>From Hujjatullah Al-Balighah: The Central Thesis</h3>
        <div class="hadith">
          <p class="arabic-quote">"إن الشريعة الإسلامية ما جاءت إلا لتحقيق مصالح العباد في المعاش والمعاد، وما من حكم إلا وله حكمة بالغة في جلب منفعة أو دفع مضرة"</p>
          <p>"The Islamic Shariah came only to realize the interests of servants in their worldly life and their Hereafter. There is no ruling except that it has profound wisdom in bringing benefit or repelling harm."</p>
          <cite>— Hujjatullah Al-Balighah, Introduction</cite>
        </div>

        <h3>The Five Essential Necessities (الضرورات الخمس)</h3>
        <p>We discussed these earlier, but Shah Wali Allah shows how all Islamic laws protect these:</p>

        <div class="example-box">
          <h4>1. Preservation of Religion (حفظ الدين)</h4>
          <div class="hadith">
            <p class="arabic-quote">"حفظ الدين هو المقصد الأول، لأن به صلاح الآخرة، وبه تنتظم مصالح الدنيا"</p>
            <p>"Preservation of religion is the first objective, for through it is the rectification of the Hereafter, and through it the interests of this world are organized."</p>
            <cite>— Hujjatullah Al-Balighah</cite>
          </div>
          <p><strong>Laws protecting it:</strong> Obligation of belief, prayer, learning; prohibition of apostasy under coercion; freedom to practice</p>

          <h4>2. Preservation of Life (حفظ النفس)</h4>
          <p><strong>Laws protecting it:</strong> Prohibition of murder, suicide; qisas (retribution); obligation to seek medical care; prohibition of endangering oneself</p>

          <h4>3. Preservation of Intellect (حفظ العقل)</h4>
          <p><strong>Laws protecting it:</strong> Prohibition of intoxicants; encouragement of knowledge; prohibition of ignorance and superstition</p>

          <h4>4. Preservation of Lineage (حفظ النسل)</h4>
          <p><strong>Laws protecting it:</strong> Marriage regulations; prohibition of zina; laws of paternity and inheritance; family law</p>

          <h4>5. Preservation of Property (حفظ المال)</h4>
          <p><strong>Laws protecting it:</strong> Prohibition of theft, fraud, riba; property rights; contracts; inheritance laws</p>
        </div>

        <h3>The Three Levels of Maqasid</h3>
        <p>Shah Wali Allah, building on earlier scholars, identifies three levels:</p>

        <table>
          <tr>
            <th>Level</th>
            <th>Arabic</th>
            <th>Description</th>
          </tr>
          <tr>
            <td><strong>Necessities</strong></td>
            <td>الضرورات</td>
            <td>Essentials without which life cannot function properly (the five above)</td>
          </tr>
          <tr>
            <td><strong>Needs</strong></td>
            <td>الحاجات</td>
            <td>Things that alleviate hardship (e.g., trade, medicine, travel)</td>
          </tr>
          <tr>
            <td><strong>Enhancements</strong></td>
            <td>التحسينات</td>
            <td>Things that beautify life and elevate character (e.g., manners, cleanliness, beautification)</td>
          </tr>
        </table>

        <h3>Universal Principles from Hujjatullah Al-Balighah</h3>
        <div class="example-box">
          <h4>Key Principles Shah Wali Allah Derives:</h4>
          
          <p><strong>1. Hardship Brings Ease (المشقة تجلب التيسير)</strong></p>
          <div class="hadith">
            <p class="arabic-quote">"إن الشريعة مبنية على التيسير لا التعسير، فكلما وجدت مشقة غير معتادة وجد التخفيف"</p>
            <p>"The Shariah is built upon ease, not hardship. Wherever there is unusual difficulty, there is relief."</p>
            <cite>— Hujjatullah Al-Balighah</cite>
          </div>

          <p><strong>2. Harm Must Be Removed (الضرر يزال)</strong></p>
          <p>Anything causing significant harm should be prevented or removed</p>

          <p><strong>3. The Lesser Harm (ارتكاب أخف الضررين)</strong></p>
          <p>When forced to choose between two harms, choose the lesser</p>

          <p><strong>4. Necessity Makes Prohibited Things Permissible (الضرورات تبيح المحظورات)</strong></p>
          <p>In life-threatening situations, prohibited things become temporarily permissible (e.g., eating pork to save one's life)</p>

          <p><strong>5. Custom Has Legal Force (العادة محكمة)</strong></p>
          <p>Local customs that don't contradict Shariah are recognized</p>
        </div>

        <h3>The Balance of Shariah</h3>
        <p>Shah Wali Allah's analysis shows that Shariah balances:</p>

        <ul>
          <li><strong>Individual vs. Collective:</strong> Personal rights balanced with societal good</li>
          <li><strong>Material vs. Spiritual:</strong> Worldly life balanced with Hereafter</li>
          <li><strong>Mercy vs. Justice:</strong> Compassion balanced with accountability</li>
          <li><strong>Flexibility vs. Firmness:</strong> Adaptability balanced with principles</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Applying Maqasid Thinking</h4>
          <p>When faced with an Islamic ruling you don't understand:</p>
          <ol>
            <li>Ask: Which of the five necessities does this protect?</li>
            <li>Consider: What harm does this prevent or benefit does this bring?</li>
            <li>Reflect: How does this serve both individual and societal wellbeing?</li>
            <li>Research: What have scholars said about its wisdom?</li>
          </ol>
        </div>

        <h3>Conclusion: The Comprehensive Vision</h3>
        <p>Shah Wali Allah's Hujjatullah Al-Balighah demonstrates that Islamic law is not a collection of arbitrary rules, but a sophisticated system designed by the All-Knowing, All-Wise Creator to guide humanity toward flourishing in this life and success in the Hereafter.</p>

        <div class="quran-verse">
          <p class="arabic">وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ</p>
          <p>"And We have not sent you except as a mercy to the worlds." [Al-Anbiya 21:107]</p>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 7: Maqasid al-Shariah');

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit7.id,
        arabicText: 'المقاصد',
        transliteration: 'Al-Maqāṣid',
        translation: 'The objectives, purposes, goals',
      },
      {
        unitId: unit7.id,
        arabicText: 'المشقة تجلب التيسير',
        transliteration: 'Al-Mashaqah tajlibu at-Taysīr',
        translation: 'Hardship brings ease (legal maxim)',
      },
      {
        unitId: unit7.id,
        arabicText: 'الضرر يزال',
        transliteration: 'Aḍ-Ḍarar yuzāl',
        translation: 'Harm must be removed (legal maxim)',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Shah Wali Allah, what is the central thesis of Hujjatullah Al-Balighah?',
        options: JSON.stringify([
          'Islamic law is complicated and difficult',
          'Islamic law came to realize the interests of people in this life and the Hereafter',
          'Islamic law is only about worship',
          'Islamic law changes with time',
        ]),
        correctAnswer: 'Islamic law came to realize the interests of people in this life and the Hereafter',
        explanation: 'Shah Wali Allah\'s central thesis is that every Islamic ruling has profound wisdom in bringing benefit or repelling harm.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three levels of Maqasid?',
        options: JSON.stringify([
          'Good, Better, Best',
          'Necessities, Needs, Enhancements',
          'Easy, Medium, Hard',
          'Past, Present, Future',
        ]),
        correctAnswer: 'Necessities, Needs, Enhancements',
        explanation: 'The three levels are Darurat (necessities), Hajat (needs), and Tahsinat (enhancements).',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('');
  console.log('✨ Hujjatullah Al-Balighah course seed completed successfully!');
  console.log('📊 Summary:');
  console.log('   - Created course: Hujjatullah Al-Balighah - The Divine Wisdom in Islamic Law');
  console.log('   - Created 7 comprehensive units with authentic Arabic quotes');
  console.log('   - Added Arabic terms for each unit');
  console.log('   - Added quiz questions for assessments');
  console.log('');
  console.log('🎓 Units created:');
  console.log('   1. Introduction: Shah Wali Allah and His Magnum Opus');
  console.log('   2. Human Nature and the Purpose of Revelation');
  console.log('   3. The Wisdom Behind Acts of Worship');
  console.log('   4. The Philosophy of Halal and Haram');
  console.log('   5. Marriage and Family: The Foundation of Society');
  console.log('   6. Jihad: Struggle for Justice and Self-Defense');
  console.log('   7. Maqasid al-Shariah: The Higher Objectives of Islamic Law');
  console.log('');
  console.log('📚 This course covers Shah Wali Allah\'s masterpiece demonstrating the');
  console.log('   profound wisdom, rationality, and comprehensive nature of Islamic law.');
  console.log('');
  console.log('To view the course, start the backend and visit the courses page.');
}

async function main() {
  try {
    await seedHujjatullahCourse();
  } catch (error) {
    console.error('❌ Error seeding Hujjatullah Al-Balighah course:', error);
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
