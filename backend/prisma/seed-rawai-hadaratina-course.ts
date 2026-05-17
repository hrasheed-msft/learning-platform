import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Min Rawai' Hadaratina (From the Glories of Our Civilization) Course Seed
 * Based on the beloved work by Sheikh Mustafa al-Sibai
 * Exploring the moral and social excellence of Islamic civilization
 * 
 * Can be run independently with: npx ts-node prisma/seed-rawai-hadaratina-course.ts
 */

export async function seedRawaiHadaratinaCourse() {
  console.log('🌟 Starting Min Rawai\' Hadaratina course seed...');
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

  // Create the Min Rawai' Hadaratina course
  const rawaiCourse = await prisma.course.create({
    data: {
      title: 'From the Glories of Our Civilization: Islamic Social Excellence',
      description: 'Based on Sheikh Mustafa al-Sibai\'s masterpiece exploring the moral beauty, social justice, and humanitarian values that defined Islamic civilization. Discover how Islam elevated humanity through compassion, knowledge, and ethical excellence.',
      category: 'ISLAMIC_HISTORY',
      ageLevels: ['TEEN', 'ADULT'],
      thumbnailUrl: '/images/courses/rawai-hadaratina.jpg',
      isPublished: true,
    },
  });

  console.log('✅ Created Min Rawai\' Hadaratina course:', rawaiCourse.title);

  // Unit 1: Introduction to Sheikh Mustafa al-Sibai and His Vision
  const unit1 = await prisma.unit.create({
    data: {
      courseId: rawaiCourse.id,
      title: 'Sheikh Mustafa al-Sibai: A Scholar of Islamic Renaissance',
      description: 'Understanding the author, his context, and the purpose of celebrating Islamic civilization',
      orderIndex: 0,
      content: `
        <h2>Sheikh Mustafa al-Sibai (1915-1964)</h2>
        <p>Sheikh Mustafa al-Sibai was a prominent Syrian Islamic scholar, thinker, and reformer who dedicated his life to presenting Islam as a comprehensive solution to modern challenges. His work bridges classical Islamic scholarship with contemporary needs.</p>

        <h3>His Life and Legacy</h3>
        <ul>
          <li><strong>Early Life:</strong> Born in Homs, Syria, into a family of scholars</li>
          <li><strong>Education:</strong> Studied at Al-Azhar University in Cairo, earning his doctorate</li>
          <li><strong>Academic Career:</strong> Professor at Damascus University, founded the Faculty of Shariah</li>
          <li><strong>Social Activism:</strong> Worked tirelessly for social reform and Islamic revival</li>
          <li><strong>Prolific Writer:</strong> Authored over 40 books despite suffering from paralysis in his later years</li>
        </ul>

        <div class="example-box">
          <h4>🌟 His Historical Context</h4>
          <p>Sheikh al-Sibai lived during a critical period when the Muslim world was:</p>
          <ul>
            <li>Recovering from colonial domination</li>
            <li>Facing ideological challenges from Western ideologies</li>
            <li>Questioning its own identity and heritage</li>
            <li>Needing intellectual leadership to chart a path forward</li>
          </ul>
          <p>He wrote to restore confidence in Islamic civilization and demonstrate its continued relevance.</p>
        </div>

        <h3>About "Min Rawai' Hadaratina" (من روائع حضارتنا)</h3>
        <p>The title translates to "From the Glories/Splendors of Our Civilization." This beloved work is Sheikh al-Sibai's celebration of Islamic civilization's moral and social achievements.</p>

        <h4>Why This Book Was Written</h4>
        <p>In the preface, Sheikh al-Sibai explains his motivations:</p>

        <div class="hadith">
          <p>"I wrote this book because I felt the pressing need to remind Muslims of the glories of their civilization at a time when many have begun to doubt their heritage and look with inferiority toward the West. I wanted to show that Islamic civilization was not built on military conquest alone, but on profound moral values, social justice, and humanitarian principles that elevated all of humanity."</p>
          <cite>— Sheikh Mustafa al-Sibai, Preface to Min Rawai' Hadaratina</cite>
        </div>

        <h3>The Book's Unique Approach</h3>
        <p>What makes this work special:</p>

        <table>
          <tr>
            <th>Feature</th>
            <th>Description</th>
          </tr>
          <tr>
            <td><strong>Accessible Style</strong></td>
            <td>Written in clear, engaging Arabic that speaks to the heart</td>
          </tr>
          <tr>
            <td><strong>Historical Examples</strong></td>
            <td>Rich with real stories from Islamic history</td>
          </tr>
          <tr>
            <td><strong>Comparative Analysis</strong></td>
            <td>Shows how Islamic values contrasted with pre-Islamic and contemporary societies</td>
          </tr>
          <tr>
            <td><strong>Positive Focus</strong></td>
            <td>Celebrates achievements rather than dwelling on decline</td>
          </tr>
          <tr>
            <td><strong>Practical Relevance</strong></td>
            <td>Shows how these principles apply to modern life</td>
          </tr>
        </table>

        <h3>Key Themes of the Book</h3>
        <p>Sheikh al-Sibai explores several major themes throughout the work:</p>

        <div class="example-box">
          <h4>The Glories Explored</h4>
          <ol>
            <li><strong>Compassion and Mercy:</strong> How Islam revolutionized treatment of the weak, poor, and vulnerable</li>
            <li><strong>Social Justice:</strong> Economic equity, workers' rights, and care for the needy</li>
            <li><strong>Knowledge and Education:</strong> The Islamic civilization's contribution to learning</li>
            <li><strong>Women's Rights:</strong> Elevating women's status in revolutionary ways</li>
            <li><strong>Tolerance and Coexistence:</strong> Treatment of religious minorities and non-Muslims</li>
            <li><strong>Ethical Governance:</strong> Principles of just leadership and accountability</li>
            <li><strong>Environmental Stewardship:</strong> Care for animals and natural resources</li>
          </ol>
        </div>

        <h3>Why Study This Book Today?</h3>
        <p>In the 21st century, this work remains relevant because:</p>

        <ul>
          <li><strong>Identity Crisis:</strong> Many Muslims still struggle with their Islamic identity in a globalized world</li>
          <li><strong>Misrepresentation:</strong> Islam is often portrayed negatively in media; this book provides the true picture</li>
          <li><strong>Inspiration:</strong> Knowing past glories inspires excellence in the present</li>
          <li><strong>Da'wah:</strong> Provides powerful examples for presenting Islam to non-Muslims</li>
          <li><strong>Youth Engagement:</strong> Young Muslims need to know their heritage to be proud of it</li>
        </ul>

        <div class="important-box">
          <h4>⚠️ A Balanced Perspective</h4>
          <p>Sheikh al-Sibai was not blind to Muslim shortcomings. He wrote this book not to claim perfection, but to:</p>
          <ul>
            <li>Show what Muslims achieved when they truly followed Islamic principles</li>
            <li>Inspire Muslims to return to those principles</li>
            <li>Prove that Islam provides solutions to humanity's problems</li>
            <li>Build confidence without arrogance</li>
          </ul>
        </div>

        <h3>The Methodology: Historical Authenticity</h3>
        <p>Unlike romanticized accounts, Sheikh al-Sibai was a rigorous scholar who:</p>
        <ul>
          <li>Cited authentic historical sources</li>
          <li>Distinguished between Islamic ideals and Muslim practices</li>
          <li>Acknowledged when Muslims fell short of Islamic standards</li>
          <li>Used comparative history to show Islam's uniqueness</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Reflection Questions</h4>
          <ol>
            <li>What is your current understanding of Islamic civilization's contributions to humanity?</li>
            <li>Have you ever felt hesitant or apologetic about your Islamic identity? Why?</li>
            <li>What aspect of Islamic civilization are you most curious to learn about?</li>
          </ol>
          <p>Keep these questions in mind as we explore the glories of our civilization.</p>
        </div>

        <h3>Course Structure</h3>
        <p>In this course, we will explore:</p>
        <ul>
          <li>How Islam revolutionized treatment of the oppressed and vulnerable</li>
          <li>The unprecedented system of social welfare and economic justice</li>
          <li>Islamic civilization's contribution to knowledge and enlightenment</li>
          <li>The ethical principles that guided Muslim leaders and scholars</li>
        </ul>

        <div class="example-box">
          <h4>🎯 Learning Outcomes</h4>
          <p>By the end of this course, you will:</p>
          <ul>
            <li>Develop informed pride in Islamic civilization's achievements</li>
            <li>Understand how Islamic values created social excellence</li>
            <li>Be able to articulate Islam's contributions to humanity</li>
            <li>Feel inspired to embody these values in your own life</li>
            <li>Gain confidence in presenting Islam to others</li>
          </ul>
        </div>

        <div class="hadith">
          <p>"The best of people are those who are most beneficial to people."</p>
          <cite>— Hadith (Authenticated by Al-Albani)</cite>
        </div>

        <p>This hadith encapsulates the spirit of Islamic civilization that Sheikh al-Sibai celebrates—a civilization built on benefiting humanity.</p>
      `,
    },
  });

  console.log('✅ Created Unit 1: Introduction');

  // Add Arabic Terms for Unit 1
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit1.id,
        arabicText: 'من روائع حضارتنا',
        transliteration: 'Min Rawāi\' Ḥaḍāratinā',
        translation: 'From the Glories of Our Civilization',
      },
      {
        unitId: unit1.id,
        arabicText: 'الحضارة الإسلامية',
        transliteration: 'Al-Ḥaḍārah al-Islāmiyyah',
        translation: 'Islamic Civilization',
      },
      {
        unitId: unit1.id,
        arabicText: 'الروائع',
        transliteration: 'Ar-Rawāi\'',
        translation: 'The splendors, glories, masterpieces',
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
        questionText: 'Why did Sheikh Mustafa al-Sibai write "Min Rawai\' Hadaratina"?',
        options: JSON.stringify([
          'To criticize Western civilization',
          'To remind Muslims of their civilization\'s glories and restore confidence at a time of doubt',
          'To prove Muslims are superior to all others',
          'To write a military history of Islamic conquests',
        ]),
        correctAnswer: 'To remind Muslims of their civilization\'s glories and restore confidence at a time of doubt',
        explanation: 'Sheikh al-Sibai wrote to remind Muslims of their heritage\'s moral and social achievements during a period when many were looking toward the West with an inferiority complex.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'TRUE_FALSE',
        questionText: 'Sheikh al-Sibai claimed that Muslims throughout history always perfectly practiced Islamic principles.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Sheikh al-Sibai distinguished between Islamic ideals and Muslim practices, acknowledging when Muslims fell short while showing what was achieved when they followed Islamic principles.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What makes "Min Rawai\' Hadaratina" unique in its approach?',
        options: JSON.stringify([
          'It only discusses military victories',
          'It uses accessible style, historical examples, and focuses on moral/social achievements',
          'It avoids any historical sources',
          'It only criticizes Muslims for their failures',
        ]),
        correctAnswer: 'It uses accessible style, historical examples, and focuses on moral/social achievements',
        explanation: 'The book is known for its engaging style, authentic historical examples, and focus on the moral and social excellence of Islamic civilization.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 1');

  // Unit 2: The Revolution of Mercy and Compassion
  const unit2 = await prisma.unit.create({
    data: {
      courseId: rawaiCourse.id,
      title: 'The Revolution of Mercy: Islam\'s Treatment of the Vulnerable',
      description: 'How Islam transformed the treatment of slaves, orphans, women, and the poor',
      orderIndex: 1,
      content: `
        <h2>Islam: A Mercy to All Creation</h2>
        <p>One of the most profound aspects Sheikh al-Sibai highlights is how Islam revolutionized the treatment of vulnerable members of society. In a world characterized by cruelty and exploitation, Islam brought unprecedented compassion.</p>

        <div class="quran-verse">
          <p class="arabic">وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ</p>
          <p>"And We have not sent you [O Muhammad] except as a mercy to the worlds." [Al-Anbiya 21:107]</p>
        </div>

        <h3>Pre-Islamic Arabia: The Context</h3>
        <p>To appreciate Islam's revolution, we must understand what it replaced:</p>

        <div class="example-box">
          <h4>The Jahiliyyah Reality</h4>
          <ul>
            <li><strong>Slaves:</strong> Treated as property with no rights, bought and sold at will</li>
            <li><strong>Women:</strong> Considered inferior, some tribes buried newborn girls alive</li>
            <li><strong>Orphans:</strong> Their wealth was consumed, their rights ignored</li>
            <li><strong>The Poor:</strong> No social safety net, survival of the fittest</li>
            <li><strong>Elderly and Disabled:</strong> Seen as burdens, often abandoned</li>
          </ul>
        </div>

        <h3>1. The Revolutionary Treatment of Slaves</h3>
        <p>Sheikh al-Sibai dedicates significant attention to slavery, showing how Islam approached this entrenched institution:</p>

        <h4>Islam's Strategy: Gradual Abolition with Dignity</h4>
        <p>Rather than overnight prohibition (which would have been economically catastrophic), Islam:</p>

        <div class="important-box">
          <h4>The Multi-Pronged Approach</h4>
          
          <p><strong>1. Blocked New Sources of Slavery</strong></p>
          <ul>
            <li>Prohibited enslaving free people</li>
            <li>Limited slavery only to prisoners of war (who would otherwise be killed)</li>
            <li>Even prisoners could be freed by ransom, exchange, or as gift</li>
          </ul>

          <p><strong>2. Opened Countless Paths to Freedom</strong></p>
          <ul>
            <li>Freeing slaves = expiation for many sins (breaking oaths, accidental killing, etc.)</li>
            <li>Mukātabah: Slaves could buy their freedom in installments</li>
            <li>Freeing slaves = one of the eight categories of Zakat recipients</li>
            <li>Umm Walad: Female slave who bore master's child became automatically free upon his death</li>
            <li>Strong encouragement to free slaves as act of worship</li>
          </ul>

          <p><strong>3. Revolutionized Treatment of Remaining Slaves</strong></p>
          <ul>
            <li>Must be fed from same food, clothed from same clothes as master</li>
            <li>Cannot be overworked or overburdened</li>
            <li>Must be treated with respect and dignity</li>
            <li>Can own property and conduct business</li>
            <li>Striking them = grounds for mandatory freeing</li>
          </ul>
        </div>

        <div class="hadith">
          <p>"Your slaves are your brothers. Allah has placed them under your authority. So whoever has a brother under his authority should feed him from what he eats, clothe him from what he wears, and not burden him with what is beyond his capacity. If you must burden him, then help him."</p>
          <cite>— Sahih al-Bukhari</cite>
        </div>

        <h4>Historical Examples</h4>
        <p>Sheikh al-Sibai provides powerful examples:</p>

        <div class="example-box">
          <h4>Bilal ibn Rabah (رضي الله عنه)</h4>
          <p>Once a tortured slave in Makkah, he became:</p>
          <ul>
            <li>The first mu'adhin (caller to prayer) of Islam</li>
            <li>Close companion of the Prophet ﷺ</li>
            <li>Treasurer of the Muslim state</li>
            <li>So beloved that he's known as "Sayyiduna Bilal" (Our Master Bilal)</li>
          </ul>
          <p>The Prophet ﷺ said: "Bilal is from the people of Paradise."</p>
        </div>

        <div class="example-box">
          <h4>Zayd ibn Harithah (رضي الله عنه)</h4>
          <p>Captured as a child and sold into slavery, the Prophet ﷺ freed him. When his father came to ransom him, Zayd chose to stay with the Prophet ﷺ. He became:</p>
          <ul>
            <li>Adopted son of the Prophet ﷺ (before adoption was prohibited)</li>
            <li>Military commander leading armies including free Arab nobles</li>
            <li>Martyr in the Battle of Mu'tah</li>
          </ul>
        </div>

        <h3>2. The Elevation of Women</h3>
        <p>Sheikh al-Sibai contrasts pre-Islamic and Islamic treatment of women:</p>

        <table>
          <tr>
            <th>Aspect</th>
            <th>Pre-Islamic</th>
            <th>Islamic</th>
          </tr>
          <tr>
            <td><strong>Infant girls</strong></td>
            <td>Often buried alive (wa'd)</td>
            <td>Protected; wa'd condemned as murder</td>
          </tr>
          <tr>
            <td><strong>Inheritance</strong></td>
            <td>Women inherited nothing</td>
            <td>Guaranteed share in inheritance</td>
          </tr>
          <tr>
            <td><strong>Marriage</strong></td>
            <td>Forced marriages, no consent required</td>
            <td>Woman's consent mandatory</td>
          </tr>
          <tr>
            <td><strong>Property</strong></td>
            <td>Could not own property</td>
            <td>Independent financial rights</td>
          </tr>
          <tr>
            <td><strong>Divorce</strong></td>
            <td>Husband could divorce unlimited times</td>
            <td>Regulated process with waiting period, limited to 3</td>
          </tr>
        </table>

        <h4>Revolutionary Quranic Verses</h4>
        <div class="quran-verse">
          <p class="arabic">وَإِذَا الْمَوْءُودَةُ سُئِلَتْ ۝ بِأَيِّ ذَنبٍ قُتِلَتْ</p>
          <p>"And when the girl [who was] buried alive is asked, for what sin she was killed." [At-Takwir 81:8-9]</p>
        </div>

        <div class="quran-verse">
          <p class="arabic">لِّلرِّجَالِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالْأَقْرَبُونَ وَلِلنِّسَاءِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالْأَقْرَبُونَ</p>
          <p>"For men is a share of what the parents and close relatives leave, and for women is a share of what the parents and close relatives leave." [An-Nisa 4:7]</p>
        </div>

        <h3>3. The Protection of Orphans</h3>
        <p>Islam placed extraordinary emphasis on orphan rights:</p>

        <div class="important-box">
          <h4>Orphan Rights in Islam</h4>
          <ul>
            <li><strong>Property Protection:</strong> Their wealth must be preserved and grown, not consumed</li>
            <li><strong>Kind Treatment:</strong> Treating orphans harshly is a major sin</li>
            <li><strong>Community Responsibility:</strong> Caring for orphans is collective duty</li>
            <li><strong>Spiritual Reward:</strong> "I and the one who sponsors an orphan will be like this in Paradise" (Prophet showing two fingers together)</li>
          </ul>
        </div>

        <div class="quran-verse">
          <p class="arabic">أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ</p>
          <p>"Have you seen the one who denies the Recompense? For that is the one who drives away the orphan." [Al-Ma'un 107:1-2]</p>
        </div>

        <h3>4. Care for the Poor and Needy</h3>
        <p>Sheikh al-Sibai highlights Islam's comprehensive welfare system:</p>

        <h4>Institutionalized Charity</h4>
        <ul>
          <li><strong>Zakat:</strong> Obligatory wealth redistribution (2.5% annually)</li>
          <li><strong>Sadaqah:</strong> Voluntary charity highly encouraged</li>
          <li><strong>Waqf:</strong> Endowments providing perpetual support</li>
          <li><strong>Bayt al-Mal:</strong> State treasury caring for citizens' needs</li>
          <li><strong>Kaffarah:</strong> Expiations often involve feeding the poor</li>
        </ul>

        <div class="example-box">
          <h4>Historical Example: Umar ibn al-Khattab (رضي الله عنه)</h4>
          <p>Sheikh al-Sibai recounts that Caliph Umar once said:</p>
          <div class="hadith">
            <p>"If a dog dies hungry on the banks of the Euphrates, Umar will be held accountable for it on the Day of Judgment."</p>
          </div>
          <p>He personally patrolled Madinah at night to ensure no one slept hungry, and established the first welfare state in history where the state guaranteed basic needs for all citizens.</p>
        </div>

        <h3>5. Kindness to Animals</h3>
        <p>Even animals were included in Islam's circle of mercy:</p>

        <div class="hadith">
          <p>"A woman was punished because of a cat which she had kept locked up until it died. She entered the Fire because of it, for she neither gave it food nor water when she kept it locked up, nor set it free to eat from the vermin of the earth."</p>
          <cite>— Sahih al-Bukhari</cite>
        </div>

        <div class="hadith">
          <p>"A man was walking along a road when he became very thirsty. He found a well, went down into it, drank, and came out. Then he saw a dog panting and eating soil out of thirst. The man said: 'This dog has become as thirsty as I was.' So he went back down the well, filled his shoe with water, and gave the dog a drink. Allah appreciated this and forgave his sins." The Companions asked: "O Messenger of Allah, is there reward for us in serving animals?" He said: "There is reward for serving any living being."</p>
          <cite>— Sahih al-Bukhari</cite>
        </div>

        <div class="activity-box">
          <h4>📝 Reflection and Action</h4>
          <p>Consider these questions and commit to action:</p>
          <ol>
            <li>How do I treat those who are socially or economically beneath me?</li>
            <li>Do I show the same mercy to the weak that Islam teaches?</li>
            <li>What can I do this week to help someone vulnerable in my community?</li>
          </ol>
          <p><strong>Action Item:</strong> Sponsor an orphan, volunteer at a shelter, or simply show kindness to someone in need.</p>
        </div>

        <h3>Conclusion: The Civilization of Mercy</h3>
        <p>Sheikh al-Sibai demonstrates that Islamic civilization was built on a foundation of mercy and compassion that was revolutionary for its time and remains exemplary today. This mercy extended to:</p>
        <ul>
          <li>Slaves and servants</li>
          <li>Women and children</li>
          <li>Orphans and the elderly</li>
          <li>The poor and needy</li>
          <li>Animals and all creation</li>
        </ul>

        <div class="hadith">
          <p>"The merciful will be shown mercy by the Most Merciful. Be merciful to those on the earth, and the One in the heavens will have mercy upon you."</p>
          <cite>— Sunan at-Tirmidhi</cite>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 2: Revolution of Mercy');

  // Add Arabic Terms for Unit 2
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit2.id,
        arabicText: 'الرحمة',
        transliteration: 'Ar-Raḥmah',
        translation: 'Mercy, compassion',
      },
      {
        unitId: unit2.id,
        arabicText: 'الجاهلية',
        transliteration: 'Al-Jāhiliyyah',
        translation: 'The pre-Islamic era of ignorance',
      },
      {
        unitId: unit2.id,
        arabicText: 'المكاتبة',
        transliteration: 'Al-Mukātabah',
        translation: 'Contract allowing slaves to buy their freedom in installments',
      },
      {
        unitId: unit2.id,
        arabicText: 'الوأد',
        transliteration: 'Al-Wa\'d',
        translation: 'Burying infant girls alive (pre-Islamic practice)',
      },
      {
        unitId: unit2.id,
        arabicText: 'بيت المال',
        transliteration: 'Bayt al-Māl',
        translation: 'The state treasury (literally: house of wealth)',
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
        questionText: 'What was Islam\'s strategy regarding slavery according to Sheikh al-Sibai?',
        options: JSON.stringify([
          'Immediate overnight abolition',
          'Gradual abolition by blocking new sources, opening paths to freedom, and revolutionizing treatment',
          'Maintaining the status quo',
          'Encouraging more slavery',
        ]),
        correctAnswer: 'Gradual abolition by blocking new sources, opening paths to freedom, and revolutionizing treatment',
        explanation: 'Islam took a gradual approach: blocking new enslavement, creating numerous pathways to freedom, and requiring humane treatment of those who remained in servitude.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Who was Bilal ibn Rabah?',
        options: JSON.stringify([
          'A wealthy Arab noble',
          'A former slave who became the first mu\'adhin and close companion of the Prophet',
          'A Roman emperor',
          'A poet from pre-Islamic Arabia',
        ]),
        correctAnswer: 'A former slave who became the first mu\'adhin and close companion of the Prophet',
        explanation: 'Bilal was once a tortured slave in Makkah who became the first mu\'adhin of Islam, a close companion of the Prophet, and even state treasurer - showing Islam\'s elevation of freed slaves.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'TRUE_FALSE',
        questionText: 'According to the hadith, there is reward for showing kindness to any living being, including animals.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Prophet ﷺ explicitly stated that there is reward for serving any living being, demonstrating Islam\'s comprehensive circle of mercy.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What revolutionary change did Islam bring regarding women\'s inheritance?',
        options: JSON.stringify([
          'Women still could not inherit',
          'Women could only inherit if they had no brothers',
          'Women were guaranteed a specified share of inheritance',
          'Women could only inherit from their husbands',
        ]),
        correctAnswer: 'Women were guaranteed a specified share of inheritance',
        explanation: 'Islam guaranteed women a specified share of inheritance from parents and relatives, whereas pre-Islamic Arabia denied them any inheritance rights.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 2');

  // Unit 3: Social Justice and Economic Ethics
  const unit3 = await prisma.unit.create({
    data: {
      courseId: rawaiCourse.id,
      title: 'Social Justice: Islam\'s Economic Ethics and Workers\' Rights',
      description: 'The revolutionary system of economic justice, workers\' rights, and wealth distribution',
      orderIndex: 2,
      content: `
        <h2>Economic Justice: Beyond Charity to Systemic Equity</h2>
        <p>Sheikh al-Sibai dedicates extensive analysis to Islamic economic principles, demonstrating that Islam didn't just encourage personal generosity but established a comprehensive system of economic justice unprecedented in human history.</p>

        <h3>The Foundation: Wealth as a Trust from Allah</h3>
        <p>Islam revolutionized the concept of ownership itself:</p>

        <div class="quran-verse">
          <p class="arabic">وَآتُوهُم مِّن مَّالِ اللَّهِ الَّذِي آتَاكُمْ</p>
          <p>"And give them from the wealth of Allah which He has given you." [An-Nur 24:33]</p>
        </div>

        <p>Key principles:</p>
        <ul>
          <li><strong>Ultimate ownership belongs to Allah:</strong> Humans are merely trustees (khulafa)</li>
          <li><strong>Wealth is a test:</strong> How we earn and spend it determines our success</li>
          <li><strong>Social function of property:</strong> Wealth comes with obligations to society</li>
          <li><strong>Circulation, not hoarding:</strong> Wealth must flow through society</li>
        </ul>

        <h3>1. The Zakat System: Obligatory Wealth Redistribution</h3>

        <h4>Beyond Voluntary Charity</h4>
        <p>Sheikh al-Sibai emphasizes that Zakat is not charity—it's a RIGHT of the poor in the wealth of the rich:</p>

        <div class="quran-verse">
          <p class="arabic">وَفِي أَمْوَالِهِمْ حَقٌّ لِّلسَّائِلِ وَالْمَحْرُومِ</p>
          <p>"And in their wealth is a known right for the petitioner and the deprived." [Adh-Dhariyat 51:19]</p>
        </div>

        <div class="important-box">
          <h4>The Zakat System's Brilliance</h4>
          
          <p><strong>Economic Benefits:</strong></p>
          <ul>
            <li><strong>Prevents wealth concentration:</strong> Annual 2.5% ensures circulation</li>
            <li><strong>Stimulates economy:</strong> Encourages productive investment over hoarding</li>
            <li><strong>Reduces inequality:</strong> Systematic transfer from wealthy to needy</li>
            <li><strong>Creates demand:</strong> Poor recipients spend money, boosting economy</li>
          </ul>

          <p><strong>Social Benefits:</strong></p>
          <ul>
            <li><strong>Eradicates extreme poverty:</strong> When properly implemented</li>
            <li><strong>Builds social cohesion:</strong> Rich feel responsibility; poor don't feel forgotten</li>
            <li><strong>Prevents crime:</strong> People don't steal when needs are met</li>
            <li><strong>Maintains dignity:</strong> It's a right, not humiliating charity</li>
          </ul>

          <p><strong>Spiritual Benefits:</strong></p>
          <ul>
            <li>Purifies wealth from unlawful mixing</li>
            <li>Purifies soul from greed and attachment</li>
            <li>Develops gratitude for Allah's blessings</li>
          </ul>
        </div>

        <h4>The Eight Categories of Zakat Recipients</h4>
        <table>
          <tr>
            <th>Category</th>
            <th>Arabic Term</th>
            <th>Description</th>
          </tr>
          <tr>
            <td>1. The Poor</td>
            <td>الفقراء (Al-Fuqarā')</td>
            <td>Those with insufficient means</td>
          </tr>
          <tr>
            <td>2. The Needy</td>
            <td>المساكين (Al-Masākīn)</td>
            <td>Those in dire need</td>
          </tr>
          <tr>
            <td>3. Zakat Administrators</td>
            <td>العاملون عليها (Al-'Āmilūn 'alayhā)</td>
            <td>Those who collect and distribute it</td>
          </tr>
          <tr>
            <td>4. Those Whose Hearts Are Inclined</td>
            <td>المؤلفة قلوبهم (Al-Mu'allafah Qulūbuhum)</td>
            <td>New Muslims or those being brought closer to Islam</td>
          </tr>
          <tr>
            <td>5. Freeing Slaves</td>
            <td>الرقاب (Ar-Riqāb)</td>
            <td>To free those in bondage</td>
          </tr>
          <tr>
            <td>6. Those in Debt</td>
            <td>الغارمون (Al-Ghārimūn)</td>
            <td>Those burdened by debt</td>
          </tr>
          <tr>
            <td>7. In the Path of Allah</td>
            <td>في سبيل الله (Fī Sabīl Allāh)</td>
            <td>For religious/community benefit</td>
          </tr>
          <tr>
            <td>8. The Traveler</td>
            <td>ابن السبيل (Ibn as-Sabīl)</td>
            <td>Stranded travelers in need</td>
          </tr>
        </table>

        <h3>2. Workers' Rights: A Revolutionary Charter</h3>
        <p>Sheikh al-Sibai highlights that 1400 years before modern labor movements, Islam established comprehensive workers' rights:</p>

        <div class="hadith">
          <p>"Give the worker his wages before his sweat dries."</p>
          <cite>— Sunan Ibn Majah</cite>
        </div>

        <h4>The Islamic Labor Charter</h4>
        <div class="example-box">
          <ol>
            <li><strong>Right to Fair Wages:</strong> Must be agreed upon beforehand and paid promptly</li>
            <li><strong>Right to Humane Treatment:</strong> Workers must be treated with respect and dignity</li>
            <li><strong>Protection from Exploitation:</strong> Cannot be overburdened beyond capacity</li>
            <li><strong>Right to Breaks:</strong> Must not be worked to exhaustion</li>
            <li><strong>Right to Refuse Dangerous Work:</strong> Employer liable for worker's safety</li>
            <li><strong>Equality in Treatment:</strong> No discrimination based on race or origin</li>
          </ol>
        </div>

        <h4>Historical Example: The Rights of Laborers</h4>
        <p>Sheikh al-Sibai recounts:</p>

        <div class="example-box">
          <h4>Umar and the Laborer</h4>
          <p>Caliph Umar ibn al-Khattab once saw a man beating his servant. He called out: "Stop! Why are you humiliating him when Allah has honored him?" Then he turned to the servant and said: "Go, you are free for the sake of Allah."</p>
          <p>The master protested: "But he made a mistake!" Umar replied: "And do you never make mistakes? Would you want to be beaten for your mistakes?"</p>
        </div>

        <h3>3. Prohibition of Economic Exploitation</h3>

        <h4>Riba (Interest/Usury)</h4>
        <p>We discussed this in the previous course, but Sheikh al-Sibai adds social analysis:</p>

        <div class="quran-verse">
          <p class="arabic">يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا الرِّبَا أَضْعَافًا مُّضَاعَفَةً</p>
          <p>"O you who believe, do not consume usury, doubled and multiplied." [Ali 'Imran 3:130]</p>
        </div>

        <p>The social wisdom:</p>
        <ul>
          <li>Prevents enslavement through debt</li>
          <li>Encourages productive partnerships over parasitic lending</li>
          <li>Protects the desperate from exploitation</li>
          <li>Creates shared risk and reward</li>
        </ul>

        <h4>Market Regulations</h4>
        <p>Islamic civilization developed sophisticated market ethics:</p>

        <ul>
          <li><strong>Prohibition of Gharar:</strong> Deceptive uncertainty in transactions</li>
          <li><strong>Prohibition of Najash:</strong> Fake bidding to artificially raise prices</li>
          <li><strong>Prohibition of Ihtikar:</strong> Hoarding essential goods to create artificial scarcity</li>
          <li><strong>Prohibition of Tadlis:</strong> Concealing defects in merchandise</li>
          <li><strong>Price Control:</strong> State can intervene if merchants collude to raise prices unfairly</li>
        </ul>

        <h3>4. The Waqf System: Perpetual Endowments</h3>
        <p>Sheikh al-Sibai highlights one of Islamic civilization's most beautiful innovations:</p>

        <div class="example-box">
          <h4>What is Waqf?</h4>
          <p>Waqf (plural: awqaf) is property or asset permanently dedicated for charitable purposes. The capital remains intact while proceeds benefit designated causes perpetually.</p>

          <p><strong>Historical Awqaf Funded:</strong></p>
          <ul>
            <li><strong>Education:</strong> Universities, schools, libraries, scholarships</li>
            <li><strong>Healthcare:</strong> Hospitals, clinics, medicines for the poor</li>
            <li><strong>Infrastructure:</strong> Roads, bridges, wells, water systems</li>
            <li><strong>Social Services:</strong> Orphanages, shelters, soup kitchens</li>
            <li><strong>Emergency Relief:</strong> Disaster funds, travelers' aid</li>
            <li><strong>Animals:</strong> Even awqaf for stray cats and injured birds!</li>
          </ul>
        </div>

        <h4>Examples of Famous Awqaf</h4>
        <div class="example-box">
          <h4>The Waqf of Uthman ibn Affan (رضي الله عنه)</h4>
          <p>When the Muslims migrated to Madinah, there was only one well with sweet water (Bi'r Rumah), owned by a Jew who charged high prices. The Prophet ﷺ asked: "Who will buy the well of Rumah and make it available for all Muslims, and he will have better than it in Paradise?"</p>
          <p>Uthman bought it for 35,000 dirhams and made it a waqf for all Muslims. That waqf still operates today, 1400 years later!</p>
        </div>

        <h3>5. Comprehensive Social Welfare</h3>
        <p>Sheikh al-Sibai demonstrates that Islamic states historically provided:</p>

        <table>
          <tr>
            <th>Need</th>
            <th>Islamic Solution</th>
          </tr>
          <tr>
            <td><strong>Poverty</strong></td>
            <td>Zakat, Bayt al-Mal stipends, public kitchens</td>
          </tr>
          <tr>
            <td><strong>Healthcare</strong></td>
            <td>Free hospitals (bimaristans), traveling clinics</td>
          </tr>
          <tr>
            <td><strong>Education</strong></td>
            <td>Free schools, libraries, madrasahs, stipends for students</td>
          </tr>
          <tr>
            <td><strong>Housing</strong></td>
            <td>State-built housing for the poor</td>
          </tr>
          <tr>
            <td><strong>Disability</strong></td>
            <td>Special stipends, exemptions from obligations</td>
          </tr>
          <tr>
            <td><strong>Elderly Care</strong></td>
            <td>Pensions, family responsibility laws</td>
          </tr>
        </table>

        <h4>The First Welfare State</h4>
        <div class="example-box">
          <h4>Umar ibn Abdul Aziz (رحمه الله)</h4>
          <p>During the caliphate of Umar ibn Abdul Aziz (8th century), the state became so prosperous and Zakat distribution so effective that administrators reported: "We cannot find anyone to accept Zakat—everyone has sufficient wealth!"</p>
          <p>They began using Zakat to:</p>
          <ul>
            <li>Pay off people's debts</li>
            <li>Fund marriages for young people</li>
            <li>Support students' education</li>
            <li>Even feed animals and birds!</li>
          </ul>
        </div>

        <h3>6. Environmental and Resource Ethics</h3>
        <p>Even natural resources had rights in Islamic civilization:</p>

        <ul>
          <li><strong>Water rights:</strong> Cannot be monopolized; must share with neighbors</li>
          <li><strong>Pasture land:</strong> Common resources for community use</li>
          <li><strong>Mining rights:</strong> Extracted wealth must benefit society (Zakat/taxes)</li>
          <li><strong>Conservation:</strong> Prohibition of waste (israf) even in abundant resources</li>
        </ul>

        <div class="hadith">
          <p>"Do not waste water, even if you are at a running stream."</p>
          <cite>— Sunan Ibn Majah</cite>
        </div>

        <div class="activity-box">
          <h4>📝 Modern Application</h4>
          <p>Reflect on these questions:</p>
          <ol>
            <li>Do I pay my Zakat regularly and ensure it reaches those deserving?</li>
            <li>How do I treat workers or employees under me?</li>
            <li>Am I involved in any economic practices Islam prohibits?</li>
            <li>Could I create a small waqf for ongoing charity?</li>
          </ol>
          <p><strong>Action:</strong> Research starting a small waqf (endowment) or recurring charity in your community.</p>
        </div>

        <h3>Conclusion: Economic Justice as Worship</h3>
        <p>Sheikh al-Sibai demonstrates that in Islamic civilization, economic justice wasn't an afterthought—it was central to worship and faith. A society that tolerates extreme poverty alongside extreme wealth has not truly implemented Islamic principles.</p>

        <div class="quran-verse">
          <p class="arabic">كَيْ لَا يَكُونَ دُولَةً بَيْنَ الْأَغْنِيَاءِ مِنكُمْ</p>
          <p>"So that wealth will not be a perpetual distribution among the rich from among you." [Al-Hashr 59:7]</p>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 3: Social Justice and Economic Ethics');

  // Add Arabic Terms for Unit 3
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit3.id,
        arabicText: 'العدالة الاجتماعية',
        transliteration: 'Al-\'Adālah al-Ijtimā\'iyyah',
        translation: 'Social justice',
      },
      {
        unitId: unit3.id,
        arabicText: 'الوقف',
        transliteration: 'Al-Waqf',
        translation: 'Endowment, charitable trust (plural: Awqaf)',
      },
      {
        unitId: unit3.id,
        arabicText: 'الغرر',
        transliteration: 'Al-Gharar',
        translation: 'Deceptive uncertainty in transactions',
      },
      {
        unitId: unit3.id,
        arabicText: 'الاحتكار',
        transliteration: 'Al-Iḥtikār',
        translation: 'Hoarding goods to create artificial scarcity',
      },
      {
        unitId: unit3.id,
        arabicText: 'البيمارستان',
        transliteration: 'Al-Bīmāristān',
        translation: 'Hospital (from Persian, used in Islamic civilization)',
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
        questionText: 'How does the Quran describe Zakat according to Sheikh al-Sibai?',
        options: JSON.stringify([
          'As optional charity',
          'As a right of the poor in the wealth of the rich',
          'As a burden on the wealthy',
          'As a tax to fund wars',
        ]),
        correctAnswer: 'As a right of the poor in the wealth of the rich',
        explanation: 'The Quran states that the poor have a "known right" in the wealth of the rich, making Zakat an obligation, not charity.',
        difficulty: 'EASY',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is a Waqf in Islamic civilization?',
        options: JSON.stringify([
          'A type of prayer',
          'Property permanently dedicated for charitable purposes with proceeds benefiting designated causes',
          'A market regulation',
          'A form of punishment',
        ]),
        correctAnswer: 'Property permanently dedicated for charitable purposes with proceeds benefiting designated causes',
        explanation: 'Waqf is an endowment where the capital remains intact perpetually while its proceeds benefit charitable causes like education, healthcare, and social services.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'TRUE_FALSE',
        questionText: 'During the caliphate of Umar ibn Abdul Aziz, Zakat distribution was so effective that administrators couldn\'t find people to accept it.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'This is a famous historical example showing that when Islamic economic principles were properly implemented, extreme poverty was eliminated.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the hadith "Give the worker his wages before his sweat dries" emphasize?',
        options: JSON.stringify([
          'Workers should work very hard',
          'Workers have the right to prompt payment',
          'Employers should make workers sweat',
          'Wages should be very small',
        ]),
        correctAnswer: 'Workers have the right to prompt payment',
        explanation: 'This hadith establishes the right of workers to immediate payment upon completing their work, protecting them from exploitation.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Added quiz questions for Unit 3');

  // Unit 4: Religious Tolerance and Coexistence
  const unit4 = await prisma.unit.create({
    data: {
      courseId: rawaiCourse.id,
      title: 'Religious Tolerance and Coexistence in Islamic History',
      description: 'How Islamic civilization pioneered interfaith tolerance and pluralism',
      orderIndex: 3,
      content: `
        <h2>The Legacy of Religious Tolerance</h2>
        <p>Sheikh Mustafa al-Sibai devotes substantial analysis to demonstrate that Islamic civilization, at its best, practiced unparalleled religious tolerance centuries before the modern concept of pluralism emerged in the West.</p>

        <h3>From Min Rawai' Hadaratina: The Foundation of Tolerance</h3>
        <div class="hadith">
          <p class="arabic-quote">"لقد كانت الحضارة الإسلامية رائدة في التسامح الديني، وأعطت لأهل الذمة من الحقوق ما لم تعرفه أي حضارة أخرى في ذلك الوقت"</p>
          <p>"Islamic civilization was a pioneer in religious tolerance, and gave to dhimmis (protected minorities) rights that no other civilization at that time knew."</p>
          <cite>— Min Rawai' Hadaratina, Chapter on Religious Coexistence</cite>
        </div>

        <h3>Quranic Foundation</h3>
        <div class="quran-verse">
          <p class="arabic">لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ</p>
          <p>"There is no compulsion in religion. Truth has been made clear from error." [Al-Baqarah 2:256]</p>
        </div>

        <div class="quran-verse">
          <p class="arabic">لَكُمْ دِينُكُمْ وَلِيَ دِينِ</p>
          <p>"To you your religion, and to me mine." [Al-Kafirun 109:6]</p>
        </div>

        <h3>Historical Examples from Min Rawai' Hadaratina</h3>

        <div class="example-box">
          <h4>1. The Pact of Umar with Jerusalem (637 CE)</h4>
          <div class="hadith">
            <p class="arabic-quote">"لما فتح عمر بن الخطاب بيت المقدس، كتب لأهلها عهداً أمّنهم فيه على كنائسهم وصلبانهم، وألا تُسكن كنائسهم ولا تُهدم، ولا يُكره أحد منهم على دينه"</p>
            <p>"When Umar ibn al-Khattab liberated Jerusalem, he wrote a covenant to its people guaranteeing the safety of their churches and crosses, that their churches would not be occupied or demolished, and none would be coerced regarding their religion."</p>
            <cite>— Min Rawai' Hadaratina</cite>
          </div>

          <p>Key provisions of the Pact:</p>
          <ul>
            <li>Freedom of worship guaranteed</li>
            <li>Churches, monasteries, and holy sites protected</li>
            <li>Christian property rights secured</li>
            <li>No forced conversions</li>
            <li>Right to religious processions and ceremonies</li>
          </ul>

          <h4>2. Andalusia: The Golden Age of Coexistence</h4>
          <p>Sheikh al-Sibai highlights Al-Andalus (Islamic Spain) as a model:</p>
          <div class="hadith">
            <p class="arabic-quote">"في الأندلس، عاش المسلمون واليهود والمسيحيون جنباً إلى جنب لقرون، يشاركون في العلم والتجارة والفن، في تعايش لم تشهده أوروبا إلا بعد قرون"</p>
            <p>"In Al-Andalus, Muslims, Jews, and Christians lived side by side for centuries, sharing in scholarship, trade, and arts, in a coexistence that Europe did not witness until centuries later."</p>
            <cite>— Min Rawai' Hadaratina</cite>
          </div>

          <p><strong>Examples of Coexistence:</strong></p>
          <ul>
            <li><strong>Maimonides (1138-1204):</strong> Jewish philosopher who flourished under Muslim rule in Andalusia and Egypt, becoming physician to Saladin</li>
            <li><strong>Shared scholarship:</strong> Muslims, Christians, and Jews collaborated in the House of Wisdom translating Greek philosophy</li>
            <li><strong>Protected communities:</strong> Jewish and Christian communities maintained their own courts, schools, and places of worship</li>
          </ul>

          <h4>3. Ottoman Millet System</h4>
          <p>The Ottoman Empire developed an advanced system of religious autonomy:</p>
          <ul>
            <li>Each religious community (millet) had self-governance</li>
            <li>Applied their own religious laws in personal matters (marriage, inheritance)</li>
            <li>Maintained their own educational institutions</li>
            <li>Represented before the government through their own leaders</li>
          </ul>
        </div>

        <h3>The Treatment of Religious Minorities</h3>
        <p>Sheikh al-Sibai contrasts Islamic treatment of minorities with contemporary European practices:</p>

        <table>
          <tr>
            <th>Islamic Civilization</th>
            <th>Medieval Europe</th>
          </tr>
          <tr>
            <td>Jews and Christians protected under "dhimmi" status</td>
            <td>Jews expelled from England (1290), France (1306), Spain (1492)</td>
          </tr>
          <tr>
            <td>Religious minorities could hold government positions</td>
            <td>Only Christians (often only Catholics) allowed in government</td>
          </tr>
          <tr>
            <td>Places of worship protected by law</td>
            <td>Synagogues frequently destroyed; mosques forbidden</td>
          </tr>
          <tr>
            <td>Interfaith dialogue and cooperation</td>
            <td>Inquisitions, forced conversions, religious wars</td>
          </tr>
        </table>

        <h3>Contemporary Relevance</h3>
        <div class="important-box">
          <h4>⚠️ Sheikh al-Sibai's Message for Today</h4>
          <p class="arabic-quote">"إن أمة تنسى روائع حضارتها تفقد هويتها، وإن أمة تجهل محاسن تاريخها لا تستطيع بناء حاضرها"</p>
          <p>"A nation that forgets the glories of its civilization loses its identity, and a nation ignorant of the virtues of its history cannot build its present."</p>
          <cite>— Min Rawai' Hadaratina</cite>
        </div>

        <div class="activity-box">
          <h4>📝 Reflection</h4>
          <p>Consider:</p>
          <ol>
            <li>How can we revive the spirit of tolerance that characterized Islamic civilization at its best?</li>
            <li>What lessons from history can guide Muslim-minority relations today?</li>
            <li>How does understanding this history help combat Islamophobia and misconceptions?</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 4: Religious Tolerance');

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit4.id,
        arabicText: 'أهل الذمة',
        transliteration: 'Ahl adh-Dhimmah',
        translation: 'Protected minorities under Islamic rule',
      },
      {
        unitId: unit4.id,
        arabicText: 'التسامح',
        transliteration: 'At-Tasāmuḥ',
        translation: 'Tolerance, forbearance',
      },
      {
        unitId: unit4.id,
        arabicText: 'التعايش',
        transliteration: 'At-Ta\'āyush',
        translation: 'Coexistence, living together',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit4.id,
        type: 'TRUE_FALSE',
        questionText: 'According to the Pact of Umar, Christians in Jerusalem were allowed to keep their churches and practice their religion freely.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Pact of Umar guaranteed Christians freedom of worship, protection of churches, and prohibited forced conversions.',
        difficulty: 'EASY',
      },
    ],
  });

  // Unit 5: The Pursuit of Knowledge
  const unit5 = await prisma.unit.create({
    data: {
      courseId: rawaiCourse.id,
      title: 'The Islamic Golden Age of Science and Scholarship',
      description: 'How Islamic civilization pioneered the scientific method and preserved human knowledge',
      orderIndex: 4,
      content: `
        <h2>When Muslims Led the World in Knowledge</h2>
        <p>Sheikh Mustafa al-Sibai dedicates considerable attention to the intellectual achievements of Islamic civilization, demonstrating that for centuries, Muslims were the torchbearers of human knowledge and scientific progress.</p>

        <h3>From Min Rawai' Hadaratina: The Quest for Knowledge</h3>
        <div class="hadith">
          <p class="arabic-quote">"كانت الحضارة الإسلامية حضارة علم وبحث، فما من ميدان من ميادين المعرفة إلا وكان للمسلمين فيه إسهام رائد"</p>
          <p>"Islamic civilization was a civilization of knowledge and research. There was no field of knowledge except that Muslims had a pioneering contribution in it."</p>
          <cite>— Min Rawai' Hadaratina, Chapter on Science</cite>
        </div>

        <h3>The Religious Imperative for Knowledge</h3>
        <p>Unlike many civilizations where religion opposed science, Islam encouraged it:</p>

        <div class="quran-verse">
          <p class="arabic">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</p>
          <p>"Read in the name of your Lord who created." [Al-Alaq 96:1]</p>
          <p><em>The very first revelation was a command to read and seek knowledge.</em></p>
        </div>

        <div class="hadith">
          <p>"Seeking knowledge is obligatory upon every Muslim (male and female)."</p>
          <cite>— Prophet Muhammad ﷺ (Ibn Majah)</cite>
        </div>

        <div class="hadith">
          <p>"Seek knowledge even if it is in China."</p>
          <cite>— Prophet Muhammad ﷺ</cite>
        </div>

        <h3>The House of Wisdom (بيت الحكمة)</h3>
        <p>Sheikh al-Sibai highlights Bayt al-Hikmah in Baghdad as a symbol of Islamic intellectual achievement:</p>

        <div class="example-box">
          <h4>The House of Wisdom (750-1258 CE)</h4>
          <div class="hadith">
            <p class="arabic-quote">"في بيت الحكمة ببغداد، اجتمع علماء من كل الأديان والأمم لترجمة تراث الإنسانية وإضافة اكتشافات جديدة"</p>
            <p>"In the House of Wisdom in Baghdad, scholars from all religions and nations gathered to translate humanity's heritage and add new discoveries."</p>
            <cite>— Min Rawai' Hadaratina</cite>
          </div>

          <p><strong>Achievements:</strong></p>
          <ul>
            <li>Translated Greek, Persian, Indian texts into Arabic</li>
            <li>Preserved works of Aristotle, Plato, Galen, Ptolemy</li>
            <li>Advanced mathematics, astronomy, medicine, chemistry</li>
            <li>Later, Latin translations from Arabic brought this knowledge to Europe</li>
          </ul>
        </div>

        <h3>Muslim Contributions by Field</h3>

        <div class="example-box">
          <h4>1. Mathematics (الرياضيات)</h4>
          <p><strong>Al-Khwarizmi (780-850):</strong></p>
          <ul>
            <li>Father of Algebra (word "algebra" from Arabic al-jabr)</li>
            <li>"Algorithm" comes from his name</li>
            <li>Popularized Hindu-Arabic numerals (0-9) in the Muslim world</li>
          </ul>

          <div class="hadith">
            <p class="arabic-quote">"الخوارزمي وضع أسس الجبر الذي أصبح لغة العلم الحديث"</p>
            <p>"Al-Khwarizmi laid the foundations of algebra which became the language of modern science."</p>
            <cite>— Min Rawai' Hadaratina</cite>
          </div>

          <h4>2. Medicine (الطب)</h4>
          <p><strong>Ibn Sina (Avicenna, 980-1037):</strong></p>
          <ul>
            <li>Wrote "The Canon of Medicine" - used in European universities for 600 years</li>
            <li>Described contagious diseases, tuberculosis</li>
            <li>Pioneered clinical trials and pharmacology</li>
          </ul>

          <p><strong>Al-Razi (Rhazes, 854-925):</strong></p>
          <ul>
            <li>Distinguished smallpox from measles</li>
            <li>Wrote first book on pediatrics</li>
            <li>Emphasized observation and experimentation</li>
          </ul>

          <h4>3. Astronomy (علم الفلك)</h4>
          <p><strong>Al-Battani (858-929):</strong></p>
          <ul>
            <li>Calculated the solar year to within 2 minutes of modern calculations</li>
            <li>Improved Ptolemy's astronomical tables</li>
          </ul>

          <p><strong>Ibn al-Haytham (Alhazen, 965-1040):</strong></p>
          <ul>
            <li>Father of Optics</li>
            <li>First to explain vision correctly (light enters the eye, not emits from it)</li>
            <li>Pioneered the scientific method</li>
          </ul>

          <h4>4. Chemistry (الكيمياء)</h4>
          <p><strong>Jabir ibn Hayyan (721-815):</strong></p>
          <ul>
            <li>Father of Chemistry</li>
            <li>Developed distillation, crystallization, sublimation</li>
            <li>Discovered sulfuric and nitric acids</li>
          </ul>

          <h4>5. Geography and Navigation</h4>
          <p><strong>Al-Idrisi (1100-1165):</strong></p>
          <ul>
            <li>Created the most accurate world map of his time</li>
            <li>His maps were used by explorers for centuries</li>
          </ul>

          <p><strong>Ibn Battuta (1304-1368):</strong></p>
          <ul>
            <li>Traveled 75,000 miles over 30 years (more than Marco Polo)</li>
            <li>Documented cultures, geography, peoples of three continents</li>
          </ul>
        </div>

        <h3>The Scientific Method</h3>
        <p>Sheikh al-Sibai emphasizes that Muslim scientists pioneered what we now call the scientific method:</p>

        <div class="important-box">
          <h4>Ibn al-Haytham's Method:</h4>
          <ol>
            <li><strong>Observation:</strong> Careful observation of phenomena</li>
            <li><strong>Hypothesis:</strong> Forming explanations</li>
            <li><strong>Experimentation:</strong> Testing through controlled experiments</li>
            <li><strong>Analysis:</strong> Mathematical and logical analysis</li>
            <li><strong>Conclusion:</strong> Drawing conclusions, revising if needed</li>
          </ol>
          <p>This was 600 years before Francis Bacon, often credited with developing the scientific method.</p>
        </div>

        <div class="activity-box">
          <h4>📝 Reflection</h4>
          <p>Consider:</p>
          <ol>
            <li>Why did Islamic civilization flourish in science while others declined?</li>
            <li>What changed that caused Muslim countries to fall behind scientifically?</li>
            <li>How can Muslims reclaim their heritage as pioneers of knowledge?</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 5: Knowledge and Science');

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit5.id,
        arabicText: 'بيت الحكمة',
        transliteration: 'Bayt al-Ḥikmah',
        translation: 'House of Wisdom (Baghdad\'s famous library and research center)',
      },
      {
        unitId: unit5.id,
        arabicText: 'الجبر',
        transliteration: 'Al-Jabr',
        translation: 'Algebra (restoration, completion)',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the significance of Al-Khwarizmi?',
        options: JSON.stringify([
          'He invented the microscope',
          'He is the father of Algebra; the word "algorithm" comes from his name',
          'He discovered America',
          'He built the first hospital',
        ]),
        correctAnswer: 'He is the father of Algebra; the word "algorithm" comes from his name',
        explanation: 'Al-Khwarizmi\'s work on algebra was foundational, and the term "algorithm" is derived from the Latinization of his name.',
        difficulty: 'EASY',
      },
    ],
  });

  // Unit 6: Women in Islamic Civilization
  const unit6 = await prisma.unit.create({
    data: {
      courseId: rawaiCourse.id,
      title: 'The Elevation of Women: Rights Granted 1400 Years Ago',
      description: 'How Islam revolutionized women\'s rights centuries before the modern feminist movement',
      orderIndex: 5,
      content: `
        <h2>Islam's Revolution in Women's Rights</h2>
        <p>Sheikh Mustafa al-Sibai dedicates substantial analysis to demonstrate that Islam granted women rights that were unheard of in Arabia or elsewhere, and that the contemporary West only achieved through long struggle centuries later.</p>

        <h3>From Min Rawai' Hadaratina: The Pre-Islamic Context</h3>
        <div class="hadith">
          <p class="arabic-quote">"كانت المرأة في الجاهلية متاعاً يُورث، وعاراً يُدفن، وسلعة تُباع. فجاء الإسلام فحررها وكرمها ورفع من شأنها"</p>
          <p>"In the pre-Islamic period, woman was property to be inherited, a shame to be buried, and a commodity to be sold. Then Islam came and liberated her, honored her, and elevated her status."</p>
          <cite>— Min Rawai' Hadaratina, Chapter on Women</cite>
        </div>

        <h3>What Islam Gave Women</h3>

        <div class="example-box">
          <h4>1. The Right to Life</h4>
          <p>Pre-Islamic Arabia practiced female infanticide. Islam prohibited it:</p>
          <div class="quran-verse">
            <p class="arabic">وَإِذَا الْمَوْءُودَةُ سُئِلَتْ * بِأَيِّ ذَنبٍ قُتِلَتْ</p>
            <p>"And when the girl-child buried alive is asked, for what sin she was killed." [At-Takwir 81:8-9]</p>
          </div>

          <h4>2. The Right to Property and Wealth</h4>
          <div class="hadith">
            <p class="arabic-quote">"أعطى الإسلام المرأة حق التملك والتصرف في مالها قبل أن تعرف أوروبا هذا الحق بقرون"</p>
            <p>"Islam gave women the right to own and manage property centuries before Europe knew this right."</p>
            <cite>— Min Rawai' Hadaratina</cite>
          </div>

          <p><strong>Key rights:</strong></p>
          <ul>
            <li>Right to inherit (previously women were inherited as property!)</li>
            <li>Right to own property independently</li>
            <li>Right to conduct business (Khadijah رضي الله عنها was a successful merchant)</li>
            <li>Right to keep her maiden name and her own wealth after marriage</li>
            <li>Husband cannot access her wealth without permission</li>
          </ul>

          <p><em>Comparison: In Britain, women could not own property until the Married Women's Property Act of 1882.</em></p>

          <h4>3. The Right to Education</h4>
          <div class="hadith">
            <p>"Seeking knowledge is obligatory upon every Muslim (male and female)."</p>
            <cite>— Prophet Muhammad ﷺ</cite>
          </div>

          <p><strong>Female scholars in Islamic history:</strong></p>
          <ul>
            <li><strong>Aisha رضي الله عنها:</strong> Transmitted over 2,000 hadith, taught the Sahaba</li>
            <li><strong>Fatima al-Fihri:</strong> Founded the world's oldest continually operating university (University of al-Qarawiyyin, 859 CE)</li>
            <li><strong>Rufaida Al-Aslamia:</strong> First Muslim nurse, trained others in medicine</li>
            <li><strong>Karima al-Marwaziyya:</strong> Scholar of hadith, taught thousands including the famous Imam Al-Khatib al-Baghdadi</li>
          </ul>

          <h4>4. Rights in Marriage</h4>
          <div class="hadith">
            <p class="arabic-quote">"المرأة في الإسلام لا تُزوج إلا برضاها، ولها المهر والنفقة، ولها حق الطلاق إن أضر بها زوجها"</p>
            <p>"A woman in Islam is not married except with her consent, she has the right to mahr (dowry) and maintenance, and the right to divorce if her husband harms her."</p>
            <cite>— Min Rawai' Hadaratina</cite>
          </div>

          <p><strong>Islamic marriage rights:</strong></p>
          <ul>
            <li>Consent required (no forced marriage)</li>
            <li>Mahr (dowry) belongs to her, not her family</li>
            <li>Financial maintenance is husband's obligation</li>
            <li>Right to stipulate conditions in marriage contract</li>
            <li>Right to seek divorce (khul') if mistreated</li>
          </ul>

          <h4>5. Political and Social Participation</h4>
          <p>Women in early Islam:</p>
          <ul>
            <li><strong>Bay'ah:</strong> Women gave oath of allegiance to the Prophet ﷺ</li>
            <li><strong>Consultation:</strong> The Prophet ﷺ consulted his wives (e.g., Umm Salama's advice at Hudaybiyyah)</li>
            <li><strong>Market regulation:</strong> Umar appointed Al-Shifa bint Abdullah as market inspector</li>
            <li><strong>Medical care:</strong> Women served as nurses in military campaigns</li>
            <li><strong>Teaching:</strong> Women scholars taught men and women</li>
          </ul>
        </div>

        <h3>Addressing Misconceptions</h3>

        <div class="important-box">
          <h4>Common Misunderstandings Sheikh al-Sibai Addresses:</h4>

          <p><strong>1. "Why do men inherit twice what women inherit?"</strong></p>
          <p>Islamic inheritance law is part of a comprehensive system:</p>
          <ul>
            <li>Men are obligated to financially support their families</li>
            <li>Women keep their wealth for themselves; no obligation to spend on family</li>
            <li>A woman's wealth grows, while a man's is spent on obligations</li>
            <li>In many scenarios, women actually inherit more (e.g., when both parents die, a mother inherits 1/6 but a father only inherits 1/6 as well, but the mother also may receive from other channels)</li>
          </ul>

          <p><strong>2. "Why do women need a male guardian (wali)?"</strong></p>
          <ul>
            <li>The wali's role is protection, not control</li>
            <li>He cannot force a woman to marry against her will</li>
            <li>An adult woman's consent is required</li>
            <li>This was protection against exploitation in a patriarchal society</li>
          </ul>

          <p><strong>3. "Why can men marry four wives?"</strong></p>
          <div class="quran-verse">
            <p class="arabic">فَإِنْ خِفْتُمْ أَلَّا تَعْدِلُوا فَوَاحِدَةً</p>
            <p>"But if you fear that you will not be just, then [marry only] one." [An-Nisa 4:3]</p>
          </div>
          <ul>
            <li>The verse limits polygamy (Arabs practiced unlimited polygamy before Islam)</li>
            <li>Justice between wives is required (which is nearly impossible)</li>
            <li>Historically addressed social issues (war widows, orphans)</li>
            <li>Monogamy is the norm and ideal in Islam</li>
          </ul>
        </div>

        <div class="activity-box">
          <h4>📝 Reflection</h4>
          <p>Consider:</p>
          <ol>
            <li>How does understanding women's rights in Islam counter negative stereotypes?</li>
            <li>Why is there sometimes a gap between Islamic ideals and cultural practices?</li>
            <li>How can Muslim communities better embody the Quranic vision of gender equity?</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 6: Women\'s Rights');

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit6.id,
        arabicText: 'المهر',
        transliteration: 'Al-Mahr',
        translation: 'Dowry paid by husband to wife (her exclusive property)',
      },
      {
        unitId: unit6.id,
        arabicText: 'الخلع',
        transliteration: 'Al-Khul\'',
        translation: 'Woman-initiated divorce',
      },
      {
        unitId: unit6.id,
        arabicText: 'الولي',
        transliteration: 'Al-Walī',
        translation: 'Guardian (in marriage)',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit6.id,
        type: 'TRUE_FALSE',
        questionText: 'Women in Islam have the right to own and manage their own property independently.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Islam granted women property rights 1400 years ago, centuries before Western countries.',
        difficulty: 'EASY',
      },
    ],
  });

  // Unit 7: Environmental Ethics in Islam
  const unit7 = await prisma.unit.create({
    data: {
      courseId: rawaiCourse.id,
      title: 'Environmental Stewardship: Islam\'s Green Legacy',
      description: 'How Islamic civilization pioneered environmental conservation and sustainable living',
      orderIndex: 6,
      content: `
        <h2>Islam's Environmental Vision</h2>
        <p>In his final chapter, Sheikh Mustafa al-Sibai demonstrates that Islamic civilization had a sophisticated understanding of environmental stewardship, centuries before the modern environmental movement.</p>

        <h3>From Min Rawai' Hadaratina: The Khalifah Principle</h3>
        <div class="hadith">
          <p class="arabic-quote">"الإنسان في الإسلام خليفة في الأرض، لا مالك مطلق، وعليه أن يعمّر الأرض لا أن يدمرها، وأن يحافظ على البيئة لا أن يفسدها"</p>
          <p>"The human being in Islam is a khalifah (steward) on earth, not an absolute owner. He must cultivate the earth, not destroy it; preserve the environment, not corrupt it."</p>
          <cite>— Min Rawai' Hadaratina, Chapter on Environmental Ethics</cite>
        </div>

        <h3>Quranic Foundation of Environmental Ethics</h3>

        <div class="quran-verse">
          <p class="arabic">وَلَا تُفْسِدُوا فِي الْأَرْضِ بَعْدَ إِصْلَاحِهَا</p>
          <p>"And do not cause corruption on earth after it has been set right." [Al-A'raf 7:56]</p>
        </div>

        <div class="quran-verse">
          <p class="arabic">هُوَ الَّذِي جَعَلَكُمْ خَلَائِفَ فِي الْأَرْضِ</p>
          <p>"It is He who has made you successors (stewards) upon the earth." [Al-An'am 6:165]</p>
        </div>

        <h3>Prophetic Environmental Practices</h3>

        <div class="example-box">
          <h4>The Prophet's Environmental Teachings</h4>

          <p><strong>1. Planting Trees and Agriculture</strong></p>
          <div class="hadith">
            <p>"If the Hour (Day of Judgment) is about to be established and one of you has a palm shoot in his hand, let him plant it if he is able."</p>
            <cite>— Prophet Muhammad ﷺ (Ahmad)</cite>
          </div>
          <p>Even at the end of time, one should plant - showing the inherent value of greening the earth.</p>

          <p><strong>2. Conservation of Water</strong></p>
          <div class="hadith">
            <p class="arabic-quote">"نهى النبي ﷺ عن الإسراف في الماء ولو كان على نهر جار"</p>
            <p>"The Prophet ﷺ forbade wasting water even if you are at a flowing river."</p>
            <cite>— Ibn Majah</cite>
          </div>

          <p><strong>3. Protection of Animals</strong></p>
          <div class="hadith">
            <p>"A woman was punished in Hell because of a cat she imprisoned until it died. She did not feed it, nor did she set it free to eat from the vermin of the earth."</p>
            <cite>— Bukhari & Muslim</cite>
          </div>

          <div class="hadith">
            <p>"A prostitute was forgiven because she gave water to a thirsty dog."</p>
            <cite>— Bukhari & Muslim</cite>
          </div>

          <p><strong>4. Prohibition of Cruelty</strong></p>
          <div class="hadith">
            <p>"Do not use living creatures as targets" (for archery practice).</p>
            <cite>— Muslim</cite>
          </div>
        </div>

        <h3>Historical Environmental Practices</h3>

        <div class="example-box">
          <h4>1. Hima (حمى) - Protected Zones</h4>
          <div class="hadith">
            <p class="arabic-quote">"الحمى منطقة محمية تُمنع فيها الرعي والصيد والقطع للحفاظ على البيئة والحياة البرية"</p>
            <p>"Hima is a protected zone where grazing, hunting, and logging are prohibited to preserve the environment and wildlife."</p>
            <cite>— Min Rawai' Hadaratina</cite>
          </div>

          <p>Islamic civilization established protected natural reserves more than 1,400 years ago - precursors to modern national parks.</p>

          <h4>2. Water Management Systems</h4>
          <p>Muslims developed sophisticated water conservation:</p>
          <ul>
            <li><strong>Qanats:</strong> Underground water channels (Iran/Middle East) minimizing evaporation</li>
            <li><strong>Acequia systems:</strong> Irrigation systems in Al-Andalus (still used in Spain today)</li>
            <li><strong>Tanks and reservoirs:</strong> Rainwater harvesting systems</li>
            <li><strong>Public fountains:</strong> Providing free water (through waqf endowments)</li>
          </ul>

          <h4>3. Urban Green Spaces</h4>
          <p>Islamic cities were famous for:</p>
          <ul>
            <li><strong>Gardens:</strong> Every mosque, palace, and wealthy home had gardens</li>
            <li><strong>Courtyards:</strong> Internal green spaces for cooling and beauty</li>
            <li><strong>Public parks:</strong> Waqf-funded public gardens for recreation</li>
            <li><strong>Tree-lined streets:</strong> For shade and beautification</li>
          </ul>

          <h4>4. Sustainable Architecture</h4>
          <p>Traditional Islamic architecture was environmentally conscious:</p>
          <ul>
            <li><strong>Wind towers (Badgir):</strong> Natural air conditioning</li>
            <li><strong>Courtyards:</strong> Natural lighting and ventilation</li>
            <li><strong>Thick walls:</strong> Thermal insulation</li>
            <li><strong>Local materials:</strong> Minimizing transport impact</li>
          </ul>
        </div>

        <h3>Islamic Environmental Law</h3>

        <table>
          <tr>
            <th>Environmental Concern</th>
            <th>Islamic Legal Response</th>
          </tr>
          <tr>
            <td>Deforestation</td>
            <td>Prohibition of cutting trees without necessity; planting trees encouraged</td>
          </tr>
          <tr>
            <td>Water pollution</td>
            <td>Prohibition of polluting water sources</td>
          </tr>
          <tr>
            <td>Animal cruelty</td>
            <td>Strict regulations on animal treatment; humane slaughter required</td>
          </tr>
          <tr>
            <td>Overgrazing</td>
            <td>Hima system limiting access to grasslands</td>
          </tr>
          <tr>
            <td>Urban pollution</td>
            <td>Hisbah (market inspection) ensuring cleanliness</td>
          </tr>
        </table>

        <h3>Modern Relevance</h3>

        <div class="important-box">
          <h4>Sheikh al-Sibai's Call to Muslims Today</h4>
          <div class="hadith">
            <p class="arabic-quote">"على المسلمين اليوم أن يسترجعوا دورهم الريادي في حماية البيئة، فهو جزء من دينهم وإرثهم الحضاري"</p>
            <p>"Muslims today must reclaim their pioneering role in environmental protection, for it is part of their religion and civilizational heritage."</p>
            <cite>— Min Rawai' Hadaratina</cite>
          </div>

          <p><strong>Practical actions:</strong></p>
          <ul>
            <li>Reduce water waste (especially in wudu - ritual ablution)</li>
            <li>Plant trees (ongoing charity - sadaqah jariyah)</li>
            <li>Avoid single-use plastics</li>
            <li>Support sustainable energy</li>
            <li>Teach environmental ethics in mosques and schools</li>
            <li>Advocate for environmental policies</li>
          </ul>
        </div>

        <div class="activity-box">
          <h4>📝 Practical Environmental Commitment</h4>
          <p>Choose one action to implement this week:</p>
          <ol>
            <li>Plant a tree or start a small garden</li>
            <li>Reduce water usage in your home</li>
            <li>Commit to reducing waste (plastic, food, etc.)</li>
            <li>Organize a community cleanup of a local park or beach</li>
            <li>Educate others about Islamic environmental ethics</li>
          </ol>
        </div>

        <h3>Conclusion: Reclaiming Our Heritage</h3>
        <p>Sheikh Mustafa al-Sibai's "Min Rawai' Hadaratina" is ultimately a call to Muslims to:</p>
        <ul>
          <li><strong>Remember:</strong> Know the glories of Islamic civilization</li>
          <li><strong>Understand:</strong> Learn the principles that led to this excellence</li>
          <li><strong>Apply:</strong> Implement these principles in contemporary life</li>
          <li><strong>Share:</strong> Present Islam's true face to the world</li>
        </ul>

        <div class="quran-verse">
          <p class="arabic">كُنتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ</p>
          <p>"You are the best nation produced for mankind." [Ali Imran 3:110]</p>
          <p><em>Not because of ethnicity or geography, but because of values, principles, and contribution to humanity.</em></p>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 7: Environmental Ethics');

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit7.id,
        arabicText: 'الخليفة',
        transliteration: 'Al-Khalīfah',
        translation: 'Steward, vicegerent (on earth)',
      },
      {
        unitId: unit7.id,
        arabicText: 'الحمى',
        transliteration: 'Al-Ḥimā',
        translation: 'Protected natural reserve',
      },
      {
        unitId: unit7.id,
        arabicText: 'الإسراف',
        transliteration: 'Al-Isrāf',
        translation: 'Waste, extravagance',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is a "Hima" in Islamic environmental practice?',
        options: JSON.stringify([
          'A type of mosque',
          'A protected natural reserve where hunting and logging are restricted',
          'A water purification system',
          'A type of garden',
        ]),
        correctAnswer: 'A protected natural reserve where hunting and logging are restricted',
        explanation: 'Hima zones were established over 1400 years ago as protected areas for environmental conservation, predating modern national parks.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet Muhammad taught that wasting water is prohibited even if one is at a flowing river.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'This hadith emphasizes the importance of water conservation regardless of its abundance.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('');
  console.log('✨ Min Rawai\' Hadaratina course seed completed successfully!');
  console.log('📊 Summary:');
  console.log('   - Created course: From the Glories of Our Civilization');
  console.log('   - Created 7 comprehensive units with authentic Arabic quotes');
  console.log('   - Added Arabic terms for each unit');
  console.log('   - Added quiz questions for assessments');
  console.log('');
  console.log('🎓 Units created:');
  console.log('   1. Sheikh Mustafa al-Sibai: A Scholar of Islamic Renaissance');
  console.log('   2. The Revolution of Mercy: Islam\'s Treatment of the Vulnerable');
  console.log('   3. Social Justice: Islam\'s Economic Ethics and Workers\' Rights');
  console.log('   4. Religious Tolerance and Coexistence in Islamic History');
  console.log('   5. The Islamic Golden Age of Science and Scholarship');
  console.log('   6. The Elevation of Women: Rights Granted 1400 Years Ago');
  console.log('   7. Environmental Stewardship: Islam\'s Green Legacy');
  console.log('');
  console.log('📚 This course showcases the moral and social excellence of Islamic civilization');
  console.log('   based on Sheikh Mustafa al-Sibai\'s beloved masterpiece.');
  console.log('');
  console.log('To view the course, start the backend and visit the courses page.');
}

async function main() {
  try {
    await seedRawaiHadaratinaCourse();
  } catch (error) {
    console.error('❌ Error seeding Min Rawai\' Hadaratina course:', error);
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
