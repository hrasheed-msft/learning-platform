import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Habits to Win Here and Hereafter Course Seed
 * Based on the Yaqeen Institute video series by Dr. Tesneem Alkiek
 * A practical course on building productive habits rooted in Islamic teachings
 * 
 * Can be run independently with: npx ts-node prisma/seed-habits-course.ts
 */

export async function seedHabitsCourse() {
  console.log('🌟 Starting Habits to Win Here and Hereafter course seed...');
  console.log('');

  // Find the demo family to attach the course to
  const demoFamily = await prisma.family.findFirst({
    where: { name: 'Ahmad Family' },
  });

  if (!demoFamily) {
    console.log('⚠️  Demo family not found. Please run main seed first.');
    return;
  }

  console.log('✅ Found demo family:', demoFamily.name);

  // Check if course already exists
  const existingCourse = await prisma.course.findFirst({
    where: { title: 'Habits to Win Here and Hereafter' },
  });

  if (existingCourse) {
    console.log('⚠️  Habits course already exists. Deleting old version...');
    await prisma.course.delete({ where: { id: existingCourse.id } });
    console.log('✅ Deleted old version');
  }

  // Create the Habits course
  const habitsCourse = await prisma.course.create({
    data: {
      title: 'Habits to Win Here and Hereafter',
      description: 'A practical video series by Dr. Tesneem Alkiek from Yaqeen Institute exploring how to build productive, sustainable habits rooted in Islamic teachings. Learn how the Prophetic example and Quranic guidance provide the ultimate framework for success in this life and the next.',
      category: 'ISLAMIC_HISTORY',
      ageLevels: ['TEEN', 'ADULT'],
      thumbnailUrl: '/images/courses/habits-hereafter.jpg',
      isPublished: true,
    },
  });

  console.log('✅ Created course:', habitsCourse.title);
  console.log('');

  // ============================================================
  // UNIT 1: Know Your Purpose
  // ============================================================
  const unit1 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 1: Know Your Purpose',
      description: 'Understanding why knowing your purpose in life is the foundation for building good habits',
      orderIndex: 0,
      content: `
        <h2>Know Your Purpose</h2>
        <p>What comes to mind when you think about success and productivity? Our world today defines success based on fame and wealth — but as Muslims, our lives are defined by a far greater purpose. Before we talk about tips for building good habits, we need to reorient the purpose we're here for.</p>

        <div class="hadith">
          <p>"The person who makes the next life their primary concern (man kaan fil aakhiratu hammahu) — Allah will place abundance in their heart, organize their affairs, and this world will come to them whether it wants to or not. But the person whose sole focus is this world — their affairs will be scattered, Allah will stamp poverty between their eyes, and they will only get exactly what has been decreed for them."</p>
          <cite>— Sunan Ibn Majah</cite>
        </div>

        <h3>Summary</h3>
        <p>This episode reorients our definition of success before building any habits. The Prophet ﷺ taught that the person who makes the akhirah their primary concern will have Allah organize their affairs (jama'a lahu shamlahu) — imagine an endless to-do list where tasks effortlessly come together. More importantly, Allah fills their heart with a sense of abundance, accomplishment, and true fulfillment. On the flip side, the person whose goals revolve solely around worldly pursuits will have their affairs scattered — like a pile of papers flying in the wind — and will be stamped with a sense of emptiness no matter how hard they try. Real achievement is far from the lives of the billionaires we admire today. Only by living to fulfill our true purpose will we experience peak productivity and success.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Purpose precedes habits:</strong> Before building habits, reorient your definition of success around the akhirah, not worldly fame and wealth</li>
          <li><strong>Allah organizes your affairs:</strong> When the akhirah is your primary concern, Allah brings your scattered tasks together effortlessly (jama'a lahu shamlahu)</li>
          <li><strong>Abundance in the heart:</strong> True fulfillment comes from Allah placing richness in your heart (ja'a lahu ghinahu fi qalbihi), not from accumulating wealth</li>
          <li><strong>The flip side is devastating:</strong> A worldly-focused person has their affairs scattered, barakah removed, and poverty stamped between their eyes — no matter how hard they hustle</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>The hadith says Allah will "organize the affairs" of the one who makes the akhirah their primary concern. Have you ever experienced a time when everything seemed to fall into place effortlessly? What was your mindset at the time?</li>
            <li>Dr. Alkiek says our world defines success based on fame and wealth. How does this hadith challenge that definition?</li>
            <li>The Prophet ﷺ described the worldly-focused person's affairs as being "scattered like papers in the wind." How does this image resonate with your own experience of feeling overwhelmed?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit1.id,
      title: 'Ep. 1: Know Your Purpose | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/BnU535dqG6U',
      orderIndex: 0,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the hadith cited in this episode, what happens when you make the akhirah your primary concern?',
        options: JSON.stringify([
          'You will become wealthy and famous',
          'Allah will organize your affairs and place abundance in your heart',
          'You will never experience hardship again',
          'You will automatically stop all bad habits',
        ]),
        correctAnswer: 'Allah will organize your affairs and place abundance in your heart',
        explanation: 'The Prophet ﷺ said that the person who makes the akhirah their primary concern will have Allah place abundance in their heart (ja\'a lahu ghinahu fi qalbihi) and organize their affairs (jama\'a lahu shamlahu).',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the hadith say happens to the person whose sole focus is this world?',
        options: JSON.stringify([
          'They become more organized and productive',
          'They gain temporary happiness that lasts',
          'Their affairs are scattered and poverty is stamped between their eyes',
          'They are rewarded with extra time',
        ]),
        correctAnswer: 'Their affairs are scattered and poverty is stamped between their eyes',
        explanation: 'The Prophet ﷺ said such a person\'s affairs will be scattered (like papers flying in the wind) and Allah will stamp a sense of poverty/emptiness between their eyes, regardless of how hard they try.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit1.id,
        arabicText: 'هَمّ',
        transliteration: 'Hamm',
        translation: 'Primary concern, goal, desire — what drives a person\'s actions',
      },
      {
        unitId: unit1.id,
        arabicText: 'بركة',
        transliteration: 'Barakah',
        translation: 'Divine blessing that multiplies the benefit of something',
      },
    ],
  });

  console.log('✅ Created Unit 1: Know Your Purpose');

  // ============================================================
  // UNIT 2: What Motivates You?
  // ============================================================
  const unit2 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 2: What Motivates You?',
      description: 'Exploring the role of motivation in building lasting habits and how Islam provides the ultimate source of motivation',
      orderIndex: 1,
      content: `
        <h2>What Motivates You?</h2>
        <p>After establishing your purpose, the next step is understanding what truly motivates you. Motivation is the fuel that powers your habits, and understanding your deep "why" is what gets you back on your feet when things get tough.</p>

        <h3>Summary</h3>
        <p>Dr. Alkiek shares the story of signing up at a new gym, where the staff asked probing questions to find her <em>real</em> source of motivation — not just "I like staying active," but the deeper reason that will get her back when she's exhausted and wants to quit. In the same way, we need to visualize how our daily goals connect to our ultimate purpose. Allah knows exactly how the human mind works, which is why the Quran and Sunnah are filled with vivid descriptions of what awaits the believers. The Quran describes Paradise with rivers of fresh water, milk, wine, and pure honey [47:15]. Dr. Alkiek shares that as a teenager, it was the thought of "swimming in rivers of chocolate" that pushed her out of bed to pray Fajr. Whether it's hoping for a gentle death accompanied by angels, basking in endless pleasure in Paradise, or standing before Allah having obtained His forgiveness — visualize yourself at the end of this journey and use that imagery to push through the highs and lows.</p>

        <div class="quran-verse">
          <p class="arabic">مَثَلُ الْجَنَّةِ الَّتِي وُعِدَ الْمُتَّقُونَ فِيهَا أَنْهَارٌ مِنْ مَاءٍ غَيْرِ آسِنٍ</p>
          <p>"The description of the Paradise promised to the righteous is that in it are rivers of fresh water, rivers of milk that never change in taste, rivers of wine delicious to drink, and rivers of pure honey." [Muhammad 47:15]</p>
        </div>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Find your deep "why":</strong> Just like a gym asks probing questions to find what truly drives you, identify the motivation that will sustain your habits when times are tough</li>
          <li><strong>Visualize your destination:</strong> Allah fills the Quran with vivid descriptions of Jannah to give us something tangible to work toward</li>
          <li><strong>Use hope as fuel:</strong> Dr. Alkiek was motivated to pray Fajr as a teenager by imagining "swimming in rivers of chocolate" in Jannah</li>
          <li><strong>Motivation drives you back:</strong> Your source of motivation is what gets you back on your feet time and again when you feel like quitting</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>If a gym asked you "why do you really want to build good habits?", what would your deepest answer be?</li>
            <li>How can the vivid Quranic descriptions of Jannah serve as a stronger motivator than worldly rewards?</li>
            <li>Have you ever experienced a time when your motivation faded? How could visualizing your ultimate destination have helped you stay on track?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit2.id,
      title: 'Ep. 2: What Motivates You? | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/Mnkcg4JzCcA',
      orderIndex: 0,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What analogy does Dr. Alkiek use to explain the importance of finding your deep source of motivation?',
        options: JSON.stringify([
          'A teacher grading homework',
          'A gym membership sign-up process where staff probe for your real reason',
          'A doctor asking about symptoms',
          'A job interview',
        ]),
        correctAnswer: 'A gym membership sign-up process where staff probe for your real reason',
        explanation: 'Dr. Alkiek describes how gym staff ask probing personal questions to find your deep motivation — the real reason that will keep you coming back when you want to quit. We need to do the same with our spiritual habits.',
        difficulty: 'EASY',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What personal example does Dr. Alkiek share about what motivated her to pray Fajr as a teenager?',
        options: JSON.stringify([
          'Fear of punishment in the grave',
          'Her parents waking her up',
          'Imagining swimming in rivers of chocolate in Jannah',
          'A teacher at school encouraging her',
        ]),
        correctAnswer: 'Imagining swimming in rivers of chocolate in Jannah',
        explanation: 'Dr. Alkiek shares that as a teenager, visualizing the rivers of Jannah — which she imagined as "rivers of chocolate" — was what pushed her out of bed to pray Fajr.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 2: What Motivates You?');

  // ============================================================
  // UNIT 3: Live Life with No Regrets
  // ============================================================
  const unit3 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 3: Live Life with No Regrets',
      description: 'How to live intentionally so that you look back on your life with satisfaction, not regret',
      orderIndex: 2,
      content: `
        <h2>Live Life with No Regrets</h2>
        <p>Everyone operates differently — some are motivated by hope, others by fear. Dr. Alkiek shares that she falls squarely in the latter. The fear of regret has led her to form some of her most life-changing habits.</p>

        <h3>Summary</h3>
        <p>Dr. Alkiek imagines the seconds before her eyes close for the very last time and asks: "At that very moment, what will I wish I had done?" On the Day of Judgment, when hellfire is brought forth, everyone will suddenly remember their sins — but it will be too late. They'll cry out, "Ya laytani qaddamtu li-hayati" — "If only I had done more in life" [al-Fajr 89:24]. Now is the time to start, not next week or tomorrow. This fear of regret can be empowering: the hadith tells us that the one devoted to the Quran will be told on the Day of Resurrection, "Iqra' wa-rtaqi wa-rattil" — recite and ascend in ranks, and your final rank will be the last ayah you recite. Dr. Alkiek imagines herself rising through the ranks of Jannah with each ayah, then suddenly stopping and staring at the hundreds of ranks above her that she could have reached if she had just read a few more verses each day. Similarly, simply saying "Subhanallahi wa bihamdihi" plants a date palm tree in Jannah — how can you not want to be on auto-repeat glorifying God?</p>

        <div class="hadith">
          <p>"The one devoted to the Qur'an will be told on the Day of Resurrection: 'Iqra' wa-rtaqi wa-rattil' — Recite and ascend in ranks as you used to recite in this world. Your rank will be the last ayah you recite."</p>
          <cite>— Sunan Abu Dawud & al-Tirmidhi</cite>
        </div>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Fear of regret is a powerful motivator:</strong> Imagining the moment before death and asking "what will I wish I had done?" can drive life-changing habits</li>
          <li><strong>The Day of Judgment warning:</strong> When hellfire is brought forth, people will cry "If only I had done more" [89:24] — but by then it's too late</li>
          <li><strong>Quran recitation = ascending ranks:</strong> Every ayah you memorize in this life is a rank you'll ascend in Jannah on the Day of Judgment</li>
          <li><strong>Small dhikr, enormous reward:</strong> Saying "Subhanallahi wa bihamdihi" plants a date palm tree in Jannah — imagine walking into groves of trees you planted with simple words</li>
          <li><strong>Start now:</strong> Not next week, not on New Year's, not tomorrow — we never have a moment to lose</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>Dr. Alkiek imagines herself ascending ranks in Jannah and then suddenly stopping. How does visualizing this moment change the way you approach Quran recitation?</li>
            <li>Are you more motivated by hope or by fear? How can either be channeled into building consistent habits?</li>
            <li>The Prophet ﷺ said saying "Subhanallahi wa bihamdihi" plants a date palm tree in Jannah. What small acts of worship could you put on "auto-repeat" in your daily life?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit3.id,
      title: 'Ep. 3: Live Life with No Regrets | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/r7z78qMfZrg',
      orderIndex: 0,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the hadith cited in this episode, what happens to the person devoted to the Quran on the Day of Resurrection?',
        options: JSON.stringify([
          'They receive a crown of light',
          'They are told to recite and ascend in ranks, with their final rank being the last ayah they recite',
          'They are excused from all questioning',
          'They are given a book of good deeds in their right hand',
        ]),
        correctAnswer: 'They are told to recite and ascend in ranks, with their final rank being the last ayah they recite',
        explanation: 'The Prophet ﷺ said the one devoted to the Quran will be told "Iqra\' wa-rtaqi wa-rattil" — recite and ascend, and your final rank in Jannah will be the last ayah you recite.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What reward does the Prophet ﷺ say you receive for saying "Subhanallahi wa bihamdihi"?',
        options: JSON.stringify([
          'Your sins are forgiven',
          'A date palm tree is planted for you in Jannah',
          'An angel makes dua for you',
          'Your rank in prayer increases',
        ]),
        correctAnswer: 'A date palm tree is planted for you in Jannah',
        explanation: 'The Prophet ﷺ said that simply glorifying Allah by saying "Subhanallahi wa bihamdihi" plants a date palm tree in Jannah — a small action with enormous reward.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 3: Live Life with No Regrets');

  // ============================================================
  // UNIT 4: True Productivity
  // ============================================================
  const unit4 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 4: True Productivity',
      description: 'Redefining productivity through an Islamic lens — it\'s not about doing more, but doing what matters',
      orderIndex: 3,
      content: `
        <h2>True Productivity</h2>
        <p>The Prophet ﷺ shared a gut-wrenching reminder with his Companions: a day will soon come when people will gang up on the Muslims, just like people invite one another to eat a dish. When asked if it was because there would be few Muslims, he said no — there will be plenty, but they will be like the leftover foam in the ocean.</p>

        <div class="hadith">
          <p>The Companions asked: "What is al-wahn, O Messenger of Allah?" He responded: "Love of this world and hatred of death."</p>
          <cite>— Sunan Abu Dawud</cite>
        </div>

        <h3>Summary</h3>
        <p>The Prophet ﷺ warned that a time will come when millions of Muslims exist, yet their contributions are negligible — like foam floating on the ocean. The cause? Al-wahn: love of this world and hatred of death. How many of us pour all our energy solely into our careers, defining productivity by the pursuit of pleasure? Whether it's working hard to pay off vacations, or spending hours on YouTube and TikTok, our definition of productivity has been hijacked. The Prophet ﷺ reminded us: "Inna al-deena yusr" — this religion is easy. Whoever makes it hard will be overwhelmed. Instead, "fasaddidu wa qaribu" — take a balanced approach, be intentional, and if you can't meet your goals, take one step closer. "Wa abshiru" — give glad tidings and encourage one another to do good. Along the way, ask Allah for help. That is true productivity.</p>

        <div class="hadith">
          <p>"Inna al-deena yusr. This religion is easy. Whoever makes it hard will be overwhelmed. Fasaddidu wa qaribu — take a balanced approach, be intentional. If you can't meet your goals, do something that will get you one step closer. Wa abshiru — give glad tidings."</p>
          <cite>— Sahih al-Bukhari</cite>
        </div>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Muslims as foam:</strong> The Prophet ﷺ warned that Muslims will one day be many in number but insignificant — like foam on the ocean — due to al-wahn</li>
          <li><strong>Al-wahn is the disease:</strong> Love of this world and hatred of death is what makes Muslims unproductive despite large numbers</li>
          <li><strong>The religion is easy:</strong> Don't overcomplicate your goals — the Prophet ﷺ said "inna al-deena yusr" and warned against extremes</li>
          <li><strong>Fasaddidu wa qaribu:</strong> Take a balanced approach, be intentional, and if you can't meet your goals, take one step closer</li>
          <li><strong>Self-reflection is key:</strong> Ask yourself — why do you do what you do? What are your strengths, weaknesses, and what needs to change?</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>The Prophet ﷺ described Muslims as "foam of the ocean" — many but insignificant. Do you think that time has come? What can you personally do about it?</li>
            <li>Al-wahn is "love of this world and hatred of death." How does this disease show up in your own habits and priorities?</li>
            <li>The Prophet ﷺ said "fasaddidu wa qaribu" — if you can't reach your goal, take one step closer. How does this advice change the way you think about your current habits?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit4.id,
      title: 'Ep. 4: True Productivity | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/P6t4hemfa-A',
      orderIndex: 0,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the hadith cited in this episode, what is al-wahn?',
        options: JSON.stringify([
          'Physical weakness and inability',
          'Love of this world and hatred of death',
          'Laziness in worship',
          'Fear of the enemy',
        ]),
        correctAnswer: 'Love of this world and hatred of death',
        explanation: 'When the Companions asked what al-wahn was, the Prophet ﷺ defined it as "love of this world and hatred of death" — the disease that makes Muslims like foam on the ocean.',
        difficulty: 'EASY',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does "fasaddidu wa qaribu" mean in the hadith about the religion being easy?',
        options: JSON.stringify([
          'Fast and pray more',
          'Take a balanced approach and if you can\'t meet your goals, take one step closer',
          'Work harder than everyone else',
          'Give up worldly pursuits entirely',
        ]),
        correctAnswer: 'Take a balanced approach and if you can\'t meet your goals, take one step closer',
        explanation: 'The Prophet ﷺ said the religion is easy (inna al-deena yusr) and advised "fasaddidu wa qaribu" — be intentional and balanced, and if you can\'t hit the mark, do what gets you closer.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit4.id,
        arabicText: 'الوَهَن',
        transliteration: 'Al-Wahn',
        translation: 'Weakness/feebleness — the Prophet ﷺ defined it as love of this world and hatred of death',
      },
      {
        unitId: unit4.id,
        arabicText: 'سَدِّدُوا وَقَارِبُوا',
        transliteration: 'Saddidū wa Qāribū',
        translation: 'Take a balanced approach and aim close to the mark — be intentional',
      },
    ],
  });

  console.log('✅ Created Unit 4: True Productivity');

  // ============================================================
  // UNIT 5: Forming a Sustainable Habit
  // ============================================================
  const unit5 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 5: Forming a Sustainable Habit',
      description: 'The Prophetic principle of starting small and being consistent — the secret to lasting habits',
      orderIndex: 4,
      content: `
        <h2>Forming a Sustainable Habit</h2>
        <p>The Prophet ﷺ gave us the ultimate life hack for building habits: start small and be consistent. In a world that glorifies going big or going home, the Prophetic model teaches us that small, consistent actions are more beloved to Allah and more effective in the long run.</p>

        <div class="hadith">
          <p>"The most beloved of actions to Allah are those that are consistent, even if they are small."</p>
          <cite>— Sahih al-Bukhari & Muslim</cite>
        </div>

        <h3>Summary</h3>
        <p>Just as the Companions felt the intense ambition to do every good deed after hearing the Prophet ﷺ speak, we too experience bursts of motivation — at the start of Ramadan or a new year. Yet the Prophet ﷺ warned against the "go big or go home" mentality. When Aisha introduced a woman to the Prophet ﷺ, saying she was "the talk of the town" because she prayed all night, the Prophet ﷺ didn't praise her. Instead, he said: "What is this? You only do what you can handle" — meaning what you can keep up with day to day. The most beloved form of religiosity to Allah is what a person can be consistent with. Start with one or two verses of Quran, or set a 5-minute timer. What seems insignificant builds momentum: going from 5 minutes to 10 to 15 is far more sustainable than going from zero to 60 and burning out. Dr. Alkiek completed her PhD dissertation on a two-year timeline — something most considered nearly impossible — not by logging all-night sessions, but by focusing for just a couple of hours every day, living by this hadith.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Start small:</strong> If you want to read Quran daily, start with one or two verses or a 5-minute timer, not an entire juz'</li>
          <li><strong>Consistency beats intensity:</strong> Going from 5 to 10 to 15 minutes is more sustainable than starting at 60 minutes and burning out</li>
          <li><strong>Small wins build momentum:</strong> Checking a small task off your list triggers a sense of accomplishment internally, which motivates you to move on with more confidence to the next task</li>
          <li><strong>The Prophet ﷺ warned against extremes:</strong> When told about a woman who prayed all night, he said: "You only do what you can handle" — consistency, not intensity</li>
        </ul>

        <div class="example-box">
          <h4>🌟 Real-World Example</h4>
          <p>Dr. Alkiek completed her PhD dissertation on a two-year timeline — something most people told her was nearly impossible. She did it not by logging hours of work on end or staying up until 2 a.m., but by focusing for just a couple of hours every day. As she says: "I tried to live by this hadith and I got to experience its immediate benefits."</p>
        </div>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>Have you ever burned out after trying to start a new habit too aggressively? What happened?</li>
            <li>The Prophet ﷺ said "the most beloved actions to Allah are those done consistently, even if small." How does this advice challenge modern culture's "hustle mentality"?</li>
            <li>Pick one habit you'd like to develop. What would the smallest possible version of that habit look like that you could do every single day?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit5.id,
      title: 'Ep. 5: Forming a Sustainable Habit | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/X7bIHJc0XNI',
      orderIndex: 0,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ say when told about a woman who prays all night without sleeping?',
        options: JSON.stringify([
          'He praised her dedication',
          'He said this was the best form of worship',
          'He said you should only do what you can handle consistently',
          'He encouraged everyone to follow her example',
        ]),
        correctAnswer: 'He said you should only do what you can handle consistently',
        explanation: 'The Prophet ﷺ warned against unsustainable extremes and said the most beloved form of religiosity to Allah is what a person can be consistent with.',
        difficulty: 'EASY',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the recommended approach to starting a new habit of reading Quran daily?',
        options: JSON.stringify([
          'Read one entire juz\' every day from the start',
          'Start with one or two verses or set a 5-minute timer',
          'Read for at least one hour every morning',
          'Only read on weekends when you have more time',
        ]),
        correctAnswer: 'Start with one or two verses or set a 5-minute timer',
        explanation: 'Starting small makes the habit easy to maintain. Once it becomes a habit, you can gradually increase — from 5 minutes to 10 to 15 and beyond.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 5: Forming a Sustainable Habit');

  // ============================================================
  // UNIT 6: How to Start Your Day Right
  // ============================================================
  const unit6 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 6: How to Start Your Day Right',
      description: 'The Prophetic morning routine — remembering Allah, making wudu, and praying to loosen Shaytan\'s knots',
      orderIndex: 5,
      content: `
        <h2>How to Start Your Day Right</h2>
        <p>We all know the feeling of waking up groggy and unmotivated. The Prophet ﷺ gives us insight into why that happens and provides the ultimate morning routine to start each day with energy and purpose.</p>

        <div class="hadith">
          <p>"When you sleep, Shaytan ties three knots at the back of your neck. If you wake up and remember Allah, one knot is loosened. If you make wudu, the second knot is loosened. And if you pray, the third and final knot is loosened — in which case you begin your morning in a happy and refreshed mood. Otherwise, you wake up in bad spirits and a sluggish state."</p>
          <cite>— Sahih al-Bukhari</cite>
        </div>

        <h3>Summary</h3>
        <p>Starting your day right makes the world of a difference. You may have heard the viral advice about making your bed as the first accomplishment of the day — and it's not wrong. But beginning your day with remembrance of Allah does exactly that and so much more. It acts as a refresh button: you wake up reorienting your goals, purify yourself through wudu, and spend time in prayer. If you told someone this was a hack to a productive life 30 years ago, they'd roll their eyes. But in our day and age, morning meditation and mindfulness practices are all the rage — yet the Prophet ﷺ instilled this in his ummah centuries ago. On the flip side, when the first thing on your mind is work, a TV show replay, or — worse — you reflexively reach for your phone and start scrolling through social media, the hadith warns you're setting yourself up for a groggy and lazy day.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Three knots of Shaytan:</strong> Each knot is loosened by remembering Allah, making wudu, and praying — guaranteeing a refreshed start</li>
          <li><strong>Reorient your goals:</strong> Beginning the day with Allah's remembrance resets your priorities and purpose</li>
          <li><strong>Ancient mindfulness:</strong> What modern culture calls "morning meditation" has been practiced by Muslims for 1400+ years through wudu and salah</li>
          <li><strong>Avoid the phone trap:</strong> Reaching for your phone first thing derails the positive start that dhikr and salah provide</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>What does your current morning routine look like? Is the first thing you do remembering Allah or checking your phone?</li>
            <li>How does the hadith about Shaytan's three knots change the way you think about your morning prayer?</li>
            <li>Modern wellness culture promotes morning meditation. How does the Islamic morning routine compare, and what makes it more comprehensive?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit6.id,
      title: 'Ep. 6: How to Start Your Day Right | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/rrjG56fux0A',
      orderIndex: 0,
    },
  });

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit6.id,
        arabicText: 'أذكار الصباح',
        transliteration: 'Adhkār al-Ṣabāḥ',
        translation: 'Morning remembrances/supplications',
      },
      {
        unitId: unit6.id,
        arabicText: 'وضوء',
        transliteration: 'Wuḍū\'',
        translation: 'Ritual ablution/purification before prayer',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the hadith, how many knots does Shaytan tie at the back of your neck when you sleep?',
        options: JSON.stringify(['One', 'Two', 'Three', 'Four']),
        correctAnswer: 'Three',
        explanation: 'The Prophet ﷺ said Shaytan ties three knots, which are loosened by remembering Allah, making wudu, and praying.',
        difficulty: 'EASY',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three actions that loosen the knots tied by Shaytan during sleep?',
        options: JSON.stringify([
          'Eating breakfast, exercising, and reading',
          'Remembering Allah, making wudu, and praying',
          'Stretching, making the bed, and journaling',
          'Reciting Quran, giving charity, and fasting',
        ]),
        correctAnswer: 'Remembering Allah, making wudu, and praying',
        explanation: 'The three actions prescribed by the Prophet ﷺ are: (1) remembering Allah upon waking, (2) making wudu, and (3) praying.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 6: How to Start Your Day Right');

  // ============================================================
  // UNIT 7: Training Your Brain to Focus
  // ============================================================
  const unit7 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 7: Training Your Brain to Focus',
      description: 'How waking early, praying, and memorizing Quran trains your brain for deep focus and concentration',
      orderIndex: 6,
      content: `
        <h2>Training Your Brain to Focus</h2>
        <p>In a world of constant distraction, the ability to focus is becoming increasingly rare and valuable. The Prophet ﷺ gave us built-in tools to train our brains for deep focus and concentration, starting with the early morning hours.</p>

        <div class="hadith">
          <p>"My ummah has been endowed with barakah (blessings) in the early mornings."</p>
          <cite>— Sunan Abu Dawud</cite>
        </div>

        <h3>Summary</h3>
        <p>Keystone habits are the kind that, once completed, trigger a sense of accomplishment and energy for the rest of the day. Waking up for tahajjud or fajr isn't just any task to check off — these prayers are the ultimate keystone habits. When the Prophet ﷺ was facing his earliest and most difficult challenges, Allah comforted him by encouraging night prayer: "Inna nash'ata al-layli hiya ashaddu wata'an wa aqwamu qila" — night prayer makes a deeper impression and sharpens words [73:6]. The Prophet ﷺ also told us his ummah has been endowed with barakah in the early mornings. What should we do with this blessed time? Recite Quran. Memorizing Quran literally trains your brain to concentrate by forcing you to block out distractions. Dr. Alkiek laughs at a modern book that recommends memorizing a deck of cards to build focus — when Muslims have been encouraged to memorize the Quran after Fajr since the time of the Prophet ﷺ.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Keystone habits:</strong> Early morning prayer acts as a keystone habit that energizes the rest of your day</li>
          <li><strong>Barakah in the morning:</strong> The Prophet ﷺ specifically prayed for blessings in the early morning hours for his ummah</li>
          <li><strong>Quran as brain training:</strong> Memorizing Quran trains focus and concentration far better than any modern brain-training technique</li>
          <li><strong>Even 5-10 minutes matters:</strong> Spending just a few minutes memorizing verses after fajr builds a day's supply of focus</li>
        </ul>

        <div class="quran-verse">
          <p class="arabic">إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا</p>
          <p>"Indeed, the recitation of Fajr is witnessed." [Al-Isra 17:78]</p>
        </div>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>What "keystone habits" do you currently have that set the tone for the rest of your day? Could fajr prayer become one?</li>
            <li>Modern brain-training apps are extremely popular. How does memorizing Quran compare as a focus-building exercise?</li>
            <li>The Prophet ﷺ said his ummah is blessed in the early mornings. How can you restructure your schedule to take advantage of this blessed time?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit7.id,
      title: 'Ep. 7: Training Your Brain to Focus | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/4TbW7uz1-iI',
      orderIndex: 0,
    },
  });

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit7.id,
        arabicText: 'تهجد',
        transliteration: 'Tahajjud',
        translation: 'Voluntary night prayer performed after sleeping',
      },
      {
        unitId: unit7.id,
        arabicText: 'بركة',
        transliteration: 'Barakah',
        translation: 'Divine blessings that multiply the benefit of something',
      },
      {
        unitId: unit7.id,
        arabicText: 'استقامة',
        transliteration: 'Istiqāmah',
        translation: 'Steadfastness, firmness and resolve in faith and actions',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the Quran say about night prayer (tahajjud)?',
        options: JSON.stringify([
          'It is only for scholars',
          'It makes a deeper impression and sharpens words',
          'It is optional and has no special benefit',
          'It should only be done in Ramadan',
        ]),
        correctAnswer: 'It makes a deeper impression and sharpens words',
        explanation: 'Allah comforted the Prophet ﷺ by saying that night prayer "makes a deeper impression and sharpens words" (Quran 73:6), giving both internal and external strength.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ specifically made dua for his ummah to be blessed in the early mornings.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Prophet ﷺ said "My ummah has been endowed with barakah in the early mornings" (boorika li-ummati fi bukuriha).',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 7: Training Your Brain to Focus');

  // ============================================================
  // UNIT 8: Plan Ahead with Block-Scheduling
  // ============================================================
  const unit8 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 8: Plan Ahead with Block-Scheduling',
      description: 'How the five daily prayers naturally create a built-in block-scheduling system for Muslims',
      orderIndex: 7,
      content: `
        <h2>Plan Ahead with Block-Scheduling</h2>
        <p>Block-scheduling is a powerful productivity tool where you plan your day hour by hour. What's remarkable is that this technique is inherently built into the life of a Muslim through the five daily prayers.</p>

        <h3>Summary</h3>
        <p>When you sit at your desk with a long to-do list but no plan, you waste time deciding what to do first — then grab your phone and start scrolling between tasks. Block-scheduling solves this: every Sunday night (or the night before), do a brain dump of everything you need to get done, prioritize each task, then assign each to a specific time block. For example: 8–10am deep work, 10am–12pm readings, 12–1pm lunch and salah, 1–3pm meetings, and so on into the evening for dinner, exercise, and Quran. This has become a popular productivity tool, yet Muslims have been doing it for 1400+ years through salah. Dr. Alkiek shares that as a full-time student, she had to plan classes like lengthy chem labs around prayer times. Over time, she began planning her entire day around salah, naturally becoming an expert block-scheduler. It's incredibly powerful to realize that the Muslim identity sets us up for success through this built-in framework.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Plan the night before:</strong> Every Sunday night (or the night before), brain dump your tasks and assign them to time blocks</li>
          <li><strong>Eliminate decision fatigue:</strong> When you know exactly what's next, you don't waste time debating or procrastinating</li>
          <li><strong>Salah is built-in block-scheduling:</strong> The five daily prayers naturally divide your day into structured blocks</li>
          <li><strong>Include everything:</strong> Block time for dinner, exercise, Quran, and personal development — not just work tasks</li>
        </ul>

        <div class="example-box">
          <h4>🌟 Sample Block Schedule</h4>
          <p>8am-10am: Deep work on long-term project | 10am-12pm: Readings and emails | 12pm-1pm: Lunch & Dhuhr salah | 1pm-3pm: Meetings/class | 3pm-Asr: Wrap up work | After Asr: Personal development, exercise | Maghrib-Isha: Family time, dinner | After Isha: Wind down, adhkar, sleep</p>
        </div>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>Do you currently plan your day in advance, or do you decide what to do in the moment? How does each approach affect your productivity?</li>
            <li>How do the five daily prayers already serve as natural "time blocks" in your day? How can you build the rest of your schedule around them?</li>
            <li>Try creating a block schedule for tomorrow. What challenges do you anticipate, and how can you overcome them?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit8.id,
      title: 'Ep. 8: Plan Ahead with Block-scheduling | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/QwP5TNVrXWg',
      orderIndex: 0,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What Islamic practice naturally serves as a built-in block-scheduling system?',
        options: JSON.stringify([
          'Fasting during Ramadan',
          'The five daily prayers',
          'Weekly Jumu\'ah prayer',
          'Reading Quran before bed',
        ]),
        correctAnswer: 'The five daily prayers',
        explanation: 'The five daily prayers naturally divide the day into structured time blocks, making Muslims "expert block-schedulers" by design.',
        difficulty: 'EASY',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the first step in block-scheduling according to this episode?',
        options: JSON.stringify([
          'Start working immediately on the hardest task',
          'Do a brain dump of all tasks, then prioritize and assign them to time blocks',
          'Check your email and social media first',
          'Wait for motivation to strike before planning',
        ]),
        correctAnswer: 'Do a brain dump of all tasks, then prioritize and assign them to time blocks',
        explanation: 'The episode recommends starting each week (or the night before) with a brain dump of everything you need to do, then prioritizing and assigning each task to a specific time block.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 8: Plan Ahead with Block-Scheduling');

  // ============================================================
  // UNIT 9: Getting in the Zone
  // ============================================================
  const unit9 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 9: Getting in the Zone',
      description: 'How the Prophet ﷺ practiced deep focus, avoided multitasking, and used Bismillah as the ultimate focus cue',
      orderIndex: 8,
      content: `
        <h2>Getting in the Zone</h2>
        <p>The Prophet ﷺ was known for being completely present in whatever he was doing. He never multitasked, and every companion felt like they were the most beloved to him because of the full attention he gave them. This prophetic quality teaches us the power of deep focus.</p>

        <h3>Summary</h3>
        <p>Dr. Alkiek confesses she's often guilty of "half-working" — telling herself she'll catch up on weekends, but just staring at her screen all day, or packing her laptop in the car "just in case" (for the record, she's never gotten any reading done in the car). This type of work is almost always useless: your head isn't in the zone, and you deprive your mind of the rest it needs. The Prophet ﷺ modeled complete presence: Aisha narrates that at home he was fully with his family, and when the adhan sounded, it was his cue to redirect completely. He was so present with each person that every Companion thought they were the most beloved to him. Even in his own spiritual practice, he offered two short raka'ahs before tahajjud as a "warm-up" to immerse himself. Most powerfully, the Prophet ﷺ taught us to begin every important action with "Bismillah" — any important action not begun with Bismillah is "abtar" (cut off from blessings). This simple cue doesn't just signal the start of focused work; it reorients the purpose of your actions toward Allah.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Don't multitask:</strong> The Prophet ﷺ gave his full attention to whatever was in front of him — resulting in every companion feeling most beloved</li>
          <li><strong>Shut down completely:</strong> When your work block is done, truly transition out — half-working produces neither rest nor productivity</li>
          <li><strong>Create focus cues:</strong> Wudu before salah, two short raka'ahs before tahajjud — the Prophet ﷺ used rituals to enter a state of deep focus</li>
          <li><strong>Begin with Bismillah:</strong> The Prophet ﷺ said any important action not started with Bismillah is "abtar" (cut off from blessings)</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>Do you tend to multitask or try to work during off-hours? How has it affected your productivity and relationships?</li>
            <li>The Prophet ﷺ was so present with each companion that everyone thought they were his favorite. How can you apply this level of presence in your daily interactions?</li>
            <li>How can saying "Bismillah" before starting a task serve as a practical focus cue in your daily routine?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit9.id,
      title: 'Ep. 9: Getting in The Zone | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/n9SvVmBstAE',
      orderIndex: 0,
    },
  });

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit9.id,
        arabicText: 'بسم الله',
        transliteration: 'Bismillāh',
        translation: 'In the Name of Allah — said before beginning any important action',
      },
      {
        unitId: unit9.id,
        arabicText: 'أبتر',
        transliteration: 'Abtar',
        translation: 'Cut off, lacking barakah — describes actions not begun with Bismillah',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit9.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ say about any important action that does not begin with Bismillah?',
        options: JSON.stringify([
          'It is still blessed',
          'It is abtar (cut off from blessings)',
          'It doesn\'t matter how you start',
          'It only applies to prayer',
        ]),
        correctAnswer: 'It is abtar (cut off from blessings)',
        explanation: 'The Prophet ﷺ taught that any important action not begun with Bismillah is abtar — it is cut off and lacks barakah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit9.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ was known for multitasking and doing many things at once.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The Prophet ﷺ was the opposite of a multitasker. He gave his complete, undivided attention to whatever was in front of him, to the point that every companion felt they were the most beloved to him.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 9: Getting in the Zone');

  // ============================================================
  // UNIT 10: Take Advantage of Barakah
  // ============================================================
  const unit10 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 10: Take Advantage of Barakah',
      description: 'Understanding the Islamic concept of barakah and practical ways to invite divine blessings into your life',
      orderIndex: 9,
      content: `
        <h2>Take Advantage of Barakah</h2>
        <p>While modern culture glorifies being busy as a measure of success, Islam offers something far more freeing: the concept of barakah. When Allah blesses your time, money, or effort, you accomplish more with less.</p>

        <h3>Summary</h3>
        <p>For at least the past decade, being busy has been trendy — it translates into being important and successful. But it's suffocating, says Dr. Alkiek: constantly chasing after more minutes in the day, overcommitting beyond our capacities. As Muslims, the mentality shouldn't be to sit back and relax, but to take advantage of barakah — when Allah takes something positive and multiplies it manyfold. With barakah in your money, the best deals come your way. With barakah in your time, you accomplish things in surprisingly short periods. Rather than chasing more minutes, chase opportunities to seek Allah's pleasure and gain His barakah.</p>

        <h3>Three Ways to Invite Barakah</h3>
        <ol>
          <li><strong>Take advantage of the early hours:</strong> The Prophet ﷺ made dua: "Oh Allah, bless my people in the early part of the day." Start your day right after fajr.</li>
          <li><strong>Make istighfar (seek forgiveness):</strong> Prophet Nuh (AS) told his people: "Seek your Lord's forgiveness... He will shower you with abundant rain, supply you with wealth and children, and give you gardens and rivers." [71:10-12]</li>
          <li><strong>Give in charity (sadaqah):</strong> The Prophet ﷺ advised giving charity even on behalf of the sick as a means of healing. Sadaqah brings blessings in health and wealth.</li>
        </ol>

        <div class="quran-verse">
          <p class="arabic">فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا</p>
          <p>"I [Nuh] said, 'Seek your Lord's forgiveness — He is truly Most Forgiving.'" [Nuh 71:10]</p>
        </div>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>Have you ever experienced barakah in your time, money, or health? What did it feel like?</li>
            <li>Modern culture equates success with busyness. How does the concept of barakah challenge that assumption?</li>
            <li>Which of the three practical steps (early mornings, istighfar, sadaqah) can you start implementing today?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit10.id,
      title: 'Ep. 10: Take Advantage of Barakah | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/UjdTaAw_F6E',
      orderIndex: 0,
    },
  });

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit10.id,
        arabicText: 'استغفار',
        transliteration: 'Istighfār',
        translation: 'Seeking forgiveness from Allah',
      },
      {
        unitId: unit10.id,
        arabicText: 'صدقة',
        transliteration: 'Ṣadaqah',
        translation: 'Voluntary charity given for the sake of Allah',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit10.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is barakah?',
        options: JSON.stringify([
          'Having more hours in the day',
          'When Allah takes something positive and multiplies it manyfold',
          'Working harder than everyone else',
          'Being lucky in worldly matters',
        ]),
        correctAnswer: 'When Allah takes something positive and multiplies it manyfold',
        explanation: 'Barakah is divine blessing where Allah multiplies the benefit of your time, wealth, or effort far beyond what your own effort could produce.',
        difficulty: 'EASY',
      },
      {
        unitId: unit10.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is NOT mentioned as a way to invite barakah into your life?',
        options: JSON.stringify([
          'Waking up early after fajr',
          'Making istighfar (seeking forgiveness)',
          'Giving sadaqah (charity)',
          'Working longer hours at your job',
        ]),
        correctAnswer: 'Working longer hours at your job',
        explanation: 'The three ways mentioned are: taking advantage of early mornings, making istighfar, and giving sadaqah. Working longer hours is the opposite of seeking barakah.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 10: Take Advantage of Barakah');

  // ============================================================
  // UNIT 11: Nothing Is Going as Planned
  // ============================================================
  const unit11 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 11: Nothing Is Going as Planned',
      description: 'When good habits aren\'t producing results, it\'s time to pause, self-reflect, and check for what might be repelling barakah',
      orderIndex: 10,
      content: `
        <h2>Nothing Is Going as Planned</h2>
        <p>You've done everything right — woke up early, prayed, started your work — but nothing is clicking. Your memorization isn't sticking, your focus is gone. What's happening? Imam al-Shafi'i's famous poem gives us a powerful clue.</p>

        <div class="hadith">
          <p>"I complained to my teacher Waki' of my inability to memorize properly, so he advised me to leave off bad deeds. And he informed me that knowledge is light, and that the light of God is not granted to one who engages in bad deeds."</p>
          <cite>— Imam al-Shafi'i</cite>
        </div>

        <h3>Summary</h3>
        <p>It's 6am. You wake up, remember Allah, make wudu, pray — check, check, check. You've invited barakah and set your priorities straight. Yet your Quran is wide open and nothing is sticking. Later, you're behind your computer screen and still can't collect your thoughts. What's going on? Even the greatest scholars experienced this. Imam al-Shafi'i composed a poem describing his lack of productivity, and his teacher Waki' advised him: leave off bad deeds, because knowledge is light — and the light of God is not granted to one who engages in bad deeds. This is a powerful reality check: just as we can invite barakah through good habits, we can repel it through sinful actions. Sometimes one small bad habit can taint an entire day. As Umar ibn al-Khattab said: "Hold yourselves accountable in this life before you're held accountable by God in the next life." When things aren't going as planned, it's your internal alarm system signaling that something is off.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Bad habits repel barakah:</strong> Just as good deeds invite blessings, sinful habits can repel them from your life</li>
          <li><strong>Self-accountability (muhasabah):</strong> When things aren't working, pause and honestly reflect on all your habits — not just the good ones</li>
          <li><strong>One bad habit can taint everything:</strong> A single sin can undermine the barakah from all your good efforts</li>
          <li><strong>Take the first small step:</strong> Set your intention for positive change; when barakah re-enters your life, you won't have any regrets</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>Have you ever experienced a day where nothing seemed to work despite following your routine? What might have been the cause?</li>
            <li>Imam al-Shafi'i connected his inability to memorize with engaging in bad deeds. How does this challenge the modern view that productivity is purely about technique?</li>
            <li>What does the concept of muhasabah (self-accountability) look like in practice for you? How often do you engage in honest self-reflection?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit11.id,
      title: 'Ep. 11: Nothing Is Going as Planned | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/4u9H9WMIUsA',
      orderIndex: 0,
    },
  });

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit11.id,
        arabicText: 'محاسبة',
        transliteration: 'Muḥāsabah',
        translation: 'Self-accountability, holding oneself to account',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit11.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'When Imam al-Shafi\'i complained about his inability to memorize, what advice did his teacher give him?',
        options: JSON.stringify([
          'Study harder and longer hours',
          'Leave off bad deeds, because knowledge is light',
          'Change his study location',
          'Take a break from studying',
        ]),
        correctAnswer: 'Leave off bad deeds, because knowledge is light',
        explanation: 'Imam al-Shafi\'i\'s teacher Waki\' advised him to leave off sinful actions, explaining that knowledge is light and the light of God is not granted to one who engages in bad deeds.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit11.id,
        type: 'TRUE_FALSE',
        questionText: 'According to this episode, engaging in bad habits can repel barakah from your life even if you maintain good habits.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Just as good deeds invite barakah, sinful habits can repel it. Sometimes one small bad habit can taint an entire day, even if you maintain other good habits.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 11: Nothing Is Going as Planned');

  // ============================================================
  // UNIT 12: Overcoming Setbacks
  // ============================================================
  const unit12 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 12: Overcoming Setbacks',
      description: 'How to respond to setbacks with the Prophetic approach: persist, rely on Allah, and use stretch and backup goals',
      orderIndex: 11,
      content: `
        <h2>Overcoming Setbacks</h2>
        <p>No matter how perfectly you plan, setbacks will happen — that's life. The Prophet ﷺ gave us the perfect formula for dealing with them: stick to what benefits you, seek help from Allah, and never give up.</p>

        <div class="hadith">
          <p>"Stick to what benefits you. Seek help from Allah and don't give up. And if or when something sets you back, do not say 'if only I had done something else instead.' Rather, say that whatever Allah has decreed will happen, because 'if only' opens a door to the deeds of Shaytan."</p>
          <cite>— Sahih Muslim</cite>
        </div>

        <h3>Summary</h3>
        <p>Being human means experiencing setbacks — that's life. If we had the recipe for a perfect routine, we'd be robotic. The Prophet ﷺ taught us to persist in good habits, seek help from Allah, and avoid the paralysis of "if only" thinking. The key to surviving setbacks is not to discount the little: when a setback disrupts your chain of accomplishment, you think "what's the point of the next thing?" and the negative momentum seeps into your whole day. The solution is creating stretch goals, standard goals, and backup goals. For example, if your standard Quran memorization goal is 2 lines per day, your stretch goal is 4 lines on great days, and your backup goal is just 1 line on tough days. Even on the hardest day, you've still checked the task off, triggered a sense of accomplishment, and maintained momentum.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Setbacks are inevitable:</strong> Don't be surprised when they come — prepare for them in advance</li>
          <li><strong>Three-tier goal system:</strong> Create stretch goals (best days), standard goals (normal days), and backup goals (tough days)</li>
          <li><strong>Don't break the chain:</strong> Even a small accomplishment on a bad day maintains your momentum and triggers a sense of achievement</li>
          <li><strong>Avoid "if only" thinking:</strong> The Prophet ﷺ said it opens the door to Shaytan — trust in Allah's decree and move forward</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>Think of a recent setback you experienced. How did you respond? Did you give up, or did you persist?</li>
            <li>Create a three-tier goal for one of your current habits (stretch, standard, and backup). How does having a backup goal change the way you feel about tough days?</li>
            <li>Why does the Prophet ﷺ warn so strongly against "if only" thinking? How is tawakkul the antidote?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit12.id,
      title: 'Ep. 12: Overcoming Setbacks | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/DitTX9h2YaM',
      orderIndex: 0,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit12.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the purpose of creating a "backup goal" according to this episode?',
        options: JSON.stringify([
          'To give yourself an excuse to do less',
          'To ensure you still accomplish something even on your hardest days and maintain momentum',
          'To compete with others who set lower goals',
          'To replace your standard goal permanently',
        ]),
        correctAnswer: 'To ensure you still accomplish something even on your hardest days and maintain momentum',
        explanation: 'Backup goals are deliberately easy — they ensure you can still check the task off, trigger a sense of accomplishment, and maintain the chain of positive momentum even on bad days.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit12.id,
        type: 'TRUE_FALSE',
        questionText: 'The Prophet ﷺ taught that saying "if only I had done something else" is a positive form of self-reflection.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The Prophet ﷺ explicitly warned against this, saying that "if only" opens a door to the deeds of Shaytan. Instead, we should accept Allah\'s decree and move forward.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 12: Overcoming Setbacks');

  // ============================================================
  // UNIT 13: Take Care of Your Body
  // ============================================================
  const unit13 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 13: Take Care of Your Body',
      description: 'Physical health as an often-overlooked part of the Sunnah and how it impacts all aspects of our worship and productivity',
      orderIndex: 12,
      content: `
        <h2>Take Care of Your Body</h2>
        <p>The Prophet ﷺ and his Companions were in exceptional physical shape — riding horses, wrestling, fighting battles well into their later years. Physical fitness was so normal during the prophetic era that it's almost eerily absent from our conversations about living the Sunnah today.</p>

        <div class="hadith">
          <p>"There are two blessings that people miss out on or don't take advantage of: health and free time."</p>
          <cite>— Sahih al-Bukhari</cite>
        </div>

        <h3>Summary</h3>
        <p>The Prophet ﷺ rode horses at gallop with one hand while wearing heavy armor and wielding a sword — well into his adult years. The Companions also raced, wrestled, and fought alongside him. Being active was so normal during the prophetic era that it's eerily absent from our conversations about living the Sunnah today. Physical health is one of the biggest blessings we can be granted, and we will be asked about it on the Day of Judgment. The Prophet ﷺ actively encouraged strength, saying the strong believer is better and more beloved to Allah than the weak one. Being mindful of what and how much we eat is part of the prophetic legacy — the Prophet advised leaving one-third for food, one-third for drink, and one-third for air. His natural walking pace was brisk — only possible with proper fitness. Ibn al-Qayyim wrote in Madarij al-Salikin that overeating is a disease of the heart because it causes sluggishness in worship. Our bodies are vessels on loan from God, and how we care for them is something we'll be accountable for.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Physical fitness is Sunnah:</strong> The Prophet ﷺ was extremely fit and active well into his adult years</li>
          <li><strong>Health is a trust (amanah):</strong> Our bodies are borrowed from Allah and we'll be asked how we took care of them</li>
          <li><strong>Strength is beloved:</strong> The Prophet ﷺ said "the strong believer is better and more beloved to Allah than the weak one"</li>
          <li><strong>Overeating is a spiritual disease:</strong> Ibn al-Qayyim classified it as a disease of the heart that causes sluggishness in worship</li>
          <li><strong>The Prophet's diet:</strong> He advised leaving one-third of the stomach for food, one-third for drink, and one-third for air</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>Is physical fitness something you consider part of your religious practice? Why or why not?</li>
            <li>The Prophet ﷺ said health is a blessing people miss out on. How might you be taking your health for granted?</li>
            <li>How does Ibn al-Qayyim's classification of overeating as a "disease of the heart" change the way you think about diet and nutrition?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit13.id,
      title: 'Ep. 13: Take Care of Your Body | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/dvCZI3Uv7Rs',
      orderIndex: 0,
    },
  });

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit13.id,
        arabicText: 'أمانة',
        transliteration: 'Amānah',
        translation: 'Trust, something entrusted to you by Allah',
      },
      {
        unitId: unit13.id,
        arabicText: 'نعمة',
        transliteration: 'Ni\'mah',
        translation: 'Blessing, favor from Allah',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit13.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to the hadith, what are the two blessings people miss out on?',
        options: JSON.stringify([
          'Wealth and knowledge',
          'Health and free time',
          'Family and friends',
          'Youth and beauty',
        ]),
        correctAnswer: 'Health and free time',
        explanation: 'The Prophet ﷺ said there are two blessings that people don\'t take advantage of: health (as-sihhah) and free time (al-faragh).',
        difficulty: 'EASY',
      },
      {
        unitId: unit13.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Why did Ibn al-Qayyim classify overeating as a disease of the heart?',
        options: JSON.stringify([
          'Because it causes physical heart disease',
          'Because it causes sluggishness and lack of focus in worship',
          'Because food was scarce during his time',
          'Because he was a doctor by profession',
        ]),
        correctAnswer: 'Because it causes sluggishness and lack of focus in worship',
        explanation: 'Ibn al-Qayyim discussed overeating under diseases of the heart because it causes sluggishness and lack of focus and productivity in worship — connecting physical health directly to spiritual health.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Created Unit 13: Take Care of Your Body');

  // ============================================================
  // UNIT 14: Know the Value of Time
  // ============================================================
  const unit14 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 14: Know the Value of Time',
      description: 'Time is our most precious resource — understanding its true value in light of the Quran and Sunnah',
      orderIndex: 13,
      content: `
        <h2>Know the Value of Time</h2>
        <p>Ibn al-Qayyim said: "Wasting time is worse than death. When you die, you're simply being cut off from this world and the people in it. But when you waste time, you cut yourself off from God and the Hereafter." This profound statement reframes how we should think about every minute we have.</p>

        <div class="hadith">
          <p>"Take benefit of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before you're preoccupied, and your life before your death."</p>
          <cite>— al-Hakim, Sahih</cite>
        </div>

        <h3>Summary</h3>
        <p>Dr. Alkiek supervised a winter program that brought together Muslim students accepted into prestigious programs — dental school, law, engineering — yet a large number showed up late every day. She asked them the obvious: "When you were interviewing for dental school, did you show up late?" The problem with showing up late reveals a deeper concern: our lack of consideration for time. We wake up late despite good sleep, spend evenings scrolling through social media, and simply don't plan our days around the most valuable thing we've been given. If we treated time with the care we treat money — counting every minute like we count every dollar — our lives would look very different. Spending time wisely doesn't mean being in constant ritual worship. It means renewing your intentions so that every habit, meal, and activity serves your purpose. Even Steve Jobs wore the same turtleneck to work every day because he understood the value of time — imagine what Muslims empowered by a God-defined purpose could accomplish.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Time is more valuable than money:</strong> We count dollars carefully but waste hours without thought</li>
          <li><strong>Five before five:</strong> The Prophet ﷺ warned us to take advantage of youth, health, wealth, free time, and life before they're gone</li>
          <li><strong>Wasting time is spiritual harm:</strong> Ibn al-Qayyim said it cuts you off from God and the Hereafter</li>
          <li><strong>Wise use of time ≠ constant worship:</strong> Renewing your intention transforms every daily activity into a means for reward</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>If you tracked every minute of your day for a week, what percentage would be spent on things aligned with your purpose?</li>
            <li>Ibn al-Qayyim said wasting time is worse than death. Is this an exaggeration or a profound truth? Explain your reasoning.</li>
            <li>The Prophet ﷺ mentioned "five before five." Which of the five do you think you are currently taking for granted?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit14.id,
      title: 'Ep. 14: Know the Value of Time | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/uEUNGnoFmFI',
      orderIndex: 0,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit14.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Ibn al-Qayyim, why is wasting time worse than death?',
        options: JSON.stringify([
          'Because time is money',
          'Because death cuts you off from the world, but wasting time cuts you off from God and the Hereafter',
          'Because you can never get time back',
          'Because it makes you unpopular',
        ]),
        correctAnswer: 'Because death cuts you off from the world, but wasting time cuts you off from God and the Hereafter',
        explanation: 'Ibn al-Qayyim made a profound distinction: death merely separates you from this world, but wasting time separates you from Allah and the Hereafter — a far greater loss.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit14.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many of the "five before five" mentioned by the Prophet ﷺ relate directly to time?',
        options: JSON.stringify(['One', 'Two', 'Three', 'Four']),
        correctAnswer: 'Three',
        explanation: 'Three of the five relate directly to time: youth before old age, free time before being preoccupied, and life before death.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Created Unit 14: Know the Value of Time');

  // ============================================================
  // UNIT 15: How to Sleep Better
  // ============================================================
  const unit15 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 15: How to Sleep Better',
      description: 'The Prophetic sleep routine — evening adhkar, delaying Isha, and the perfect framework for quality rest',
      orderIndex: 14,
      content: `
        <h2>How to Sleep Better</h2>
        <p>In a world where people are desperate for a good night's sleep — paying for apps, meditation services, and sleep aids — Islam offers a complete sleep routine free of charge, prescribed by the Prophet ﷺ himself.</p>

        <div class="quran-verse">
          <p class="arabic">هُوَ الَّذِي جَعَلَ لَكُمُ اللَّيْلَ لِتَسْكُنُوا فِيهِ</p>
          <p>"He is the One Who made the night for you to rest in (peace)." [Yunus 10:67]</p>
        </div>

        <h3>Summary</h3>
        <p>Dr. Alkiek is upfront: sleep is a priority for her, and you'd be hard-pressed to find her at a social gathering late at night. Good sleep impacts your drive, focus, and energy for building consistent habits. Today, people are desperate for a good night's rest — paying for apps, deep sleep meditation services, willing to do whatever it takes. Yet Islam offers in-house services free of charge. The Prophet ﷺ prescribed evening adhkar (remembrances) to wind down, delayed Isha prayer to be the last thing before sleep, and disliked conversation after it. This creates a natural wind-down routine: quiet dhikr → prayer → short Quranic recitation → sleep. What's even more powerful is that Islam has a built-in sleep schedule: our day ends after Isha and begins before sunrise for Fajr — the perfect natural rhythm. One practical tip: put your phone on airplane mode at least 30 minutes before sleep, ideally before you pray or recite your adhkar, because there's one easy way to destroy the calm these habits create — and that's exposing yourself to your phone.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Evening adhkar as meditation:</strong> The Prophetic remembrances before sleep naturally slow down your racing thoughts</li>
          <li><strong>The Prophet's wind-down:</strong> He prayed Isha late, disliked talking afterward, and recited Quran before sleeping</li>
          <li><strong>Night is sacred:</strong> Allah made the night specifically for rest — not for binge-watching or doom-scrolling</li>
          <li><strong>Built-in sleep schedule:</strong> Islam's framework has us sleeping after Isha and waking before sunrise for fajr — the perfect natural rhythm</li>
          <li><strong>Phone on airplane mode:</strong> Put your phone away 30 minutes before sleep to protect your wind-down routine</li>
        </ul>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>What do the last 30 minutes of your day currently look like? How does it compare to the Prophetic evening routine?</li>
            <li>Modern sleep science emphasizes reducing screen time before bed. How does the Prophet's dislike of talking after Isha align with this advice?</li>
            <li>Try the "phone on airplane mode 30 minutes before sleep" challenge for one week. What changes do you notice in your sleep quality?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit15.id,
      title: 'Ep. 15: How to Sleep Better | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/DRmt8ieRquU',
      orderIndex: 0,
    },
  });

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit15.id,
        arabicText: 'أذكار المساء',
        transliteration: 'Adhkār al-Masā\'',
        translation: 'Evening remembrances/supplications',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit15.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What did the Prophet ﷺ dislike doing after Isha prayer?',
        options: JSON.stringify([
          'Eating dinner',
          'Speaking or engaging in conversation',
          'Making dua',
          'Reading Quran',
        ]),
        correctAnswer: 'Speaking or engaging in conversation',
        explanation: 'The Prophet ﷺ disliked speaking after Isha prayer, preferring to transition directly to sleep. This creates a natural wind-down that calms the mind for rest.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit15.id,
        type: 'TRUE_FALSE',
        questionText: 'The episode recommends putting your phone on airplane mode at least 30 minutes before sleep.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'This practical tip protects the calm created by evening adhkar and prayer, preventing the stress and stimulation from phones that can destroy the wind-down routine.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 15: How to Sleep Better');

  // ============================================================
  // UNIT 16: Overcoming Procrastination
  // ============================================================
  const unit16 = await prisma.unit.create({
    data: {
      courseId: habitsCourse.id,
      title: 'Ep. 16: Overcoming Procrastination',
      description: 'Procrastination as a disease of the heart and the Prophetic dua that serves as your first line of defense',
      orderIndex: 15,
      content: `
        <h2>Overcoming Procrastination</h2>
        <p>While tips to overcome procrastination are just an internet search away, Islam addresses the root cause: procrastination is a disease of the heart, and its cure begins with a change in mindset and a powerful Prophetic dua.</p>

        <div class="hadith">
          <p>"The wise person is one who holds themselves accountable for their actions, their time, their health — everything of value — and prepares for what comes after death. And the foolish person is one who follows their own desires and then relies on God."</p>
          <cite>— Sunan al-Tirmidhi</cite>
        </div>

        <h3>Summary</h3>
        <p>It's 2am and you still have hours ahead of you — your final exam, work report, or seminar paper is due in the morning. This isn't your first rodeo; no matter how much time you have, you always find yourself cramming. Breaking big tasks into smaller chunks is helpful, but the deeper issue is our attitude toward preparation. The Prophet ﷺ called out the foolish person as one who follows their desires and then relies on Allah — like cramming all night and convincing yourself by 7am, "I tied my camel, now I'll trust in Allah." The Prophet ﷺ calls this foolish. True tawakkul is about long-term planning and consistent habits. Procrastination is a spiritual disease of the heart, and the Prophet ﷺ gave us a dua he recited every morning and evening: "Allahumma inni a'udhu bika min al-ajzi wal-kasal" — "Oh Allah, I seek refuge in You from inability (al-ajz) and laziness (al-kasal)." He knew this desire to do nothing can take over our lives, which is why he made it part of his daily adhkar.</p>

        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Break big tasks into small chunks:</strong> The Prophet's advice to do small, consistent actions directly fights procrastination</li>
          <li><strong>Procrastination is a disease of the heart:</strong> It's not just a productivity problem — it requires active spiritual work to overcome</li>
          <li><strong>True tawakkul = long-term planning:</strong> The foolish person procrastinates then claims to trust God; the wise person plans ahead</li>
          <li><strong>Prophetic dua for procrastination:</strong> "Allahumma inni a'udhu bika min al-ajzi wal-kasal" — recite this morning and evening</li>
        </ul>

        <div class="important-box">
          <h4>🤲 Dua Against Procrastination</h4>
          <p class="arabic" style="font-size: 1.3em;">اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ</p>
          <p><em>Allahumma inni a'udhu bika min al-ajzi wal-kasal</em></p>
          <p>"Oh Allah, I seek refuge in You from inability and laziness."</p>
          <p>The Prophet ﷺ recited this dua in his morning and evening adhkar because the desire to procrastinate is something that can take over our lives. Memorize it and use it as your first line of defense.</p>
        </div>

        <div class="activity-box">
          <h4>📝 Discussion Questions</h4>
          <ol>
            <li>The Prophet ﷺ called the person who follows their desires and then "relies on Allah" as foolish. Have you ever caught yourself doing this? What does true tawakkul look like instead?</li>
            <li>Why do you think the Prophet ﷺ recited the dua against laziness and inability every morning and evening? What does this tell us about the nature of procrastination?</li>
            <li>As you conclude this series, what are the top three habits you want to implement? How will you start small and stay consistent?</li>
          </ol>
        </div>
      `,
    },
  });

  await prisma.videoResource.create({
    data: {
      unitId: unit16.id,
      title: 'Ep. 16: Overcoming Procrastination | Habits To Win Here and Hereafter',
      url: 'https://www.youtube.com/embed/fzQ9SKEAZ6o',
      orderIndex: 0,
    },
  });

  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: unit16.id,
        arabicText: 'العجز',
        transliteration: 'Al-\'Ajz',
        translation: 'Inability, incapacity to act',
      },
      {
        unitId: unit16.id,
        arabicText: 'الكسل',
        transliteration: 'Al-Kasal',
        translation: 'Laziness, sluggishness',
      },
      {
        unitId: unit16.id,
        arabicText: 'توكل',
        transliteration: 'Tawakkul',
        translation: 'True reliance on Allah after making effort',
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit16.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the hadith, who does the Prophet ﷺ describe as the "foolish person"?',
        options: JSON.stringify([
          'The one who plans too much',
          'The one who follows their own desires and then relies on God',
          'The one who works too hard',
          'The one who asks for help',
        ]),
        correctAnswer: 'The one who follows their own desires and then relies on God',
        explanation: 'The Prophet ﷺ described the foolish person as the one who follows their whims and then claims to rely on Allah, contrasting this with the wise person who plans ahead and holds themselves accountable.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit16.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the Prophet ﷺ seek refuge from in the dua mentioned in this episode?',
        options: JSON.stringify([
          'Poverty and illness',
          'Al-ajz (inability) and al-kasal (laziness)',
          'Anger and jealousy',
          'Fear and anxiety',
        ]),
        correctAnswer: 'Al-ajz (inability) and al-kasal (laziness)',
        explanation: 'The Prophet ﷺ recited "Allahumma inni a\'udhu bika min al-ajzi wal-kasal" — seeking refuge from inability and laziness — in his morning and evening adhkar.',
        difficulty: 'EASY',
      },
      {
        unitId: unit16.id,
        type: 'TRUE_FALSE',
        questionText: 'According to this episode, procrastination is described as a disease of the heart, not just a productivity issue.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The episode frames procrastination as a spiritual disease of the heart, similar to other spiritual ailments, requiring active effort and the help of Allah to overcome.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Unit 16: Overcoming Procrastination');

  // ============================================================
  // Summary
  // ============================================================
  console.log('');
  console.log('🎉 Habits to Win Here and Hereafter course created successfully!');
  console.log('📊 Course Summary:');
  console.log('   - 16 units (one per episode)');
  console.log('   - 16 video resources linked');
  console.log('   - 34 quiz questions');
  console.log('   - 18 Arabic terms with transliterations');
  console.log('   - Discussion questions in every unit');
  console.log('   - Summaries and key takeaways for all episodes');
  console.log('');
}

async function main() {
  try {
    await seedHabitsCourse();
    console.log('✨ Habits course seed completed successfully!');
    console.log('');
    console.log('📝 Run this seed with:');
    console.log('   cd backend');
    console.log('   npx ts-node prisma/seed-habits-course.ts');
    console.log('');
  } catch (error) {
    console.error('❌ Error seeding Habits course:', error);
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
