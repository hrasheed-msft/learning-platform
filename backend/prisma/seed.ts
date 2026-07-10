import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { seedMaktabFoundation1 } from './seed-maktab-foundation1';
import { seedMaktabFoundation2 } from './seed-maktab-foundation2';
import { seedMaktabCoursebook1 } from './seed-maktab-coursebook1';
import { seedMaktabCoursebook2 } from './seed-maktab-coursebook2';
import { seedMaktabCoursebook3 } from './seed-maktab-coursebook3';
import { seedMaktabCoursebook4 } from './seed-maktab-coursebook4';
import { seedMaktabCoursebook5 } from './seed-maktab-coursebook5';
import { seedMaktabCoursebook6Boys } from './seed-maktab-coursebook6boys';
import { seedMaktabCoursebook6Girls } from './seed-maktab-coursebook6girls';
import { seedMaktabCoursebook7 } from './seed-maktab-coursebook7';
import { seedMaktabCoursebook8 } from './seed-maktab-coursebook8';
import { seedMaktabFurtherStudiesNW } from './seed-maktab-further-studies-nw';
import { seedQuduriTaharah } from './seed-quduri-taharah';
import { seedQuduriSalah } from './seed-quduri-salah';
import { seedTazkiyahCourse } from './seed-tazkiyah-course';
import { seedHabitsCourse } from './seed-habits-course';
import { seedRawaiHadaratinaCourse } from './seed-rawai-hadaratina-course';
import { seedHujjatullahCourse } from './seed-hujjatullah-course';
import { seedSarfCourse } from './seed-sarf-course';
import { seedSarfCoursePart2 } from './seed-sarf-course-part2';
import { seedSarfCoursePart3 } from './seed-sarf-course-part3';
import { seedSarfCoursePart4 } from './seed-sarf-course-part4';
import { seedSarfCoursePart5 } from './seed-sarf-course-part5';
import { seedSarfQuizzes } from './seed-sarf-quizzes';
import { seedSarfFlashcards } from './seed-sarf-flashcards';
import { seedMasaarCourse } from './seed-masaar-course';
import { seedMasaarQuizzes } from './seed-masaar-quizzes';
import { seedMasaarFlashcards } from './seed-masaar-flashcards';
import { seedMasaarTerms } from './seed-masaar-terms';
import { seedGames } from './seed-games';
import { seedQuranMemorizationCourse } from './seed-quran-memorization';
import { seedQuranLongerSurahs } from './seed-quran-longer-surahs';
import { syncCourseTextFormatting } from '../src/services/course-content-formatting.service';
import { seedWeekendPathTags } from './seed-weekend-path-tags';

const prisma = new PrismaClient();

// =============================================================================
// ⚠️  DESTRUCTIVE SEED — READ BEFORE RUNNING
// =============================================================================
// This script deletes ALL data (users, enrollments, progress, families, content)
// and rebuilds from scratch.  It is ONLY safe in a local development database.
//
// NEVER run this against a production database.  If you need to add or update
// content in production, write a targeted, idempotent content-only seed script
// and run that instead.
// =============================================================================

async function main() {
  const env = process.env.NODE_ENV ?? 'development';

  if (env === 'production') {
    throw new Error(
      'DANGER: seed.ts with full reset must not run in production. ' +
      'Use a content-only seed script instead.'
    );
  }

  console.log('');
  console.log('⚠️  ════════════════════════════════════════════════════════');
  console.log('⚠️  DESTRUCTIVE SEED: This will delete ALL data');
  console.log('⚠️  (users, progress, enrollments, families, content).');
  console.log(`⚠️  Environment: ${env}`);
  console.log('⚠️  This script must NEVER run in production.');
  console.log('⚠️  ════════════════════════════════════════════════════════');
  console.log('');

  console.log('🌱 Starting database seed...');
  console.log('');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.activityEvent.deleteMany();
  await prisma.reviewLog.deleteMany();
  await prisma.memorizationItem.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.quizResult.deleteMany();
  await prisma.flashCardProgress.deleteMany();
  await prisma.unitProgress.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.arabicTerm.deleteMany();
  await prisma.audioResource.deleteMany();
  await prisma.videoResource.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.course.deleteMany();
  await prisma.familyMember.deleteMany();
  await prisma.user.deleteMany();
  await prisma.family.deleteMany();
  console.log('✅ Database cleared');

  // Create a demo family
  const demoFamily = await prisma.family.create({
    data: {
      name: 'Ahmad Family',
      subscriptionTier: 'PREMIUM',
    },
  });
  console.log('✅ Created demo family:', demoFamily.name);

  // Create demo user (parent)
  const passwordHash = await hash('password123', 12);
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      passwordHash,
      role: 'PARENT',
      emailVerified: true,
      familyId: demoFamily.id,
    },
  });
  console.log('✅ Created demo user:', demoUser.email);

  // Create demo family members (children)
  const demoMembers = await Promise.all([
    prisma.familyMember.create({
      data: {
        familyId: demoFamily.id,
        name: 'Ahmed',
        age: 10,
        ageCategory: 'CHILD',
        currentStreak: 5,
        longestStreak: 12,
        totalPoints: 450,
        lastActiveAt: new Date(),
      },
    }),
    prisma.familyMember.create({
      data: {
        familyId: demoFamily.id,
        name: 'Fatima',
        age: 14,
        ageCategory: 'TEEN',
        currentStreak: 3,
        longestStreak: 7,
        totalPoints: 320,
        lastActiveAt: new Date(),
      },
    }),
    prisma.familyMember.create({
      data: {
        familyId: demoFamily.id,
        name: 'Yusuf',
        age: 7,
        ageCategory: 'CHILD',
        currentStreak: 2,
        longestStreak: 4,
        totalPoints: 180,
        lastActiveAt: new Date(),
      },
    }),
  ]);
  console.log('✅ Created demo family members:', demoMembers.map(m => m.name).join(', '));

  // Create a self-member for the demo user (parent's own learner profile)
  const selfMember = await prisma.familyMember.create({
    data: {
      familyId: demoFamily.id,
      name: 'Demo Parent',
      age: 30,
      ageCategory: 'ADULT',
      isAccountOwner: true,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
    },
  });
  await prisma.user.update({
    where: { id: demoUser.id },
    data: { selfMemberId: selfMember.id },
  });
  console.log('✅ Created self-member for demo user:', selfMember.name);

  // Create comprehensive demo courses with rich content
  console.log('');
  console.log('📚 Creating courses with rich content...');

  // Course 1: Introduction to Tawheed
  const tawheedCourse = await prisma.course.create({
    data: {
      title: 'Introduction to Tawheed',
      description: 'Learn about the oneness of Allah and the foundations of Islamic belief. This course covers the basics of Tawheed in an engaging and age-appropriate manner.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN', 'TEEN'],
      isPublished: true,
    },
  });

  const tawheedUnits = await Promise.all([
    prisma.unit.create({
      data: {
        courseId: tawheedCourse.id,
        title: 'What is Tawheed?',
        description: 'Understanding the concept of Tawheed and its importance in Islam',
        content: `
          <h2>What is Tawheed?</h2>
          <p>Tawheed (توحيد) is the most fundamental concept in Islam. It refers to the <strong>oneness and uniqueness of Allah</strong> - the belief that Allah is One, without any partners, and that He alone deserves to be worshipped.</p>
          
          <h3>The Meaning of Tawheed</h3>
          <p>The word "Tawheed" comes from the Arabic root "وحد" (wahada), which means "to make one" or "to unify." In Islamic theology, it encompasses:</p>
          <ul>
            <li>Allah is the only Creator and Sustainer of the universe</li>
            <li>Only Allah deserves worship - no one else should be worshipped</li>
            <li>Allah has unique names and attributes that no one else shares</li>
          </ul>
          
          <h3>The Importance of Tawheed</h3>
          <p>Tawheed is the foundation upon which Islam is built. It is the first pillar of faith and the most important message that every prophet brought to their people. The Prophet Muhammad (peace be upon him) spent 13 years in Mecca teaching people about Tawheed before anything else.</p>
          
          <div class="example-box">
            <h4>🌟 Did You Know?</h4>
            <p>The declaration of faith (Shahada) - "La ilaha illa Allah" - is a statement of Tawheed. It means "There is no god worthy of worship except Allah."</p>
          </div>
        `,
        orderIndex: 0,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: tawheedCourse.id,
        title: 'The Three Categories of Tawheed',
        description: 'Learn about Tawheed ar-Rububiyyah, Tawheed al-Uluhiyyah, and Tawheed al-Asma was-Sifat',
        content: `
          <h2>Categories of Tawheed</h2>
          <p>Islamic scholars have categorized Tawheed into three main categories to help us understand its complete meaning:</p>
          
          <h3>1. Tawheed ar-Rububiyyah (Lordship)</h3>
          <p>This is the belief that Allah alone is the <strong>Lord</strong> (Rabb) of all creation. He is:</p>
          <ul>
            <li>The sole Creator of everything</li>
            <li>The Owner and Master of all that exists</li>
            <li>The One who provides sustenance to all creatures</li>
            <li>The One who controls all affairs of the universe</li>
          </ul>
          
          <h3>2. Tawheed al-Uluhiyyah (Worship)</h3>
          <p>This is the belief that <strong>only Allah deserves worship</strong>. All acts of worship should be directed to Allah alone:</p>
          <ul>
            <li>Prayers (Salah)</li>
            <li>Fasting (Sawm)</li>
            <li>Making dua (supplication)</li>
            <li>Seeking help and protection</li>
          </ul>
          
          <h3>3. Tawheed al-Asma was-Sifat (Names and Attributes)</h3>
          <p>This is the belief in Allah's <strong>beautiful names and perfect attributes</strong> as mentioned in the Quran and Sunnah, without:</p>
          <ul>
            <li>Denying them</li>
            <li>Comparing them to creation</li>
            <li>Changing their meanings</li>
          </ul>
          
          <div class="quran-verse">
            <p class="arabic">قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ</p>
            <p>"Say: He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent." [Surah Al-Ikhlas, 112:1-4]</p>
          </div>
        `,
        orderIndex: 1,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: tawheedCourse.id,
        title: 'Tawheed in Daily Life',
        description: 'How to apply Tawheed in our everyday actions',
        content: `
          <h2>Living with Tawheed</h2>
          <p>Tawheed is not just a concept to believe in - it's a way of life. When we truly understand Tawheed, it affects how we think, speak, and act every day.</p>
          
          <h3>Practical Applications of Tawheed</h3>
          
          <h4>1. In Our Prayers</h4>
          <p>When we pray, we direct all our worship to Allah alone. We stand before Him, bow to Him, and prostrate to Him only.</p>
          
          <h4>2. In Making Dua</h4>
          <p>When we need something or face difficulties, we ask Allah directly. We don't go through intermediaries or worship anyone besides Him.</p>
          
          <h4>3. In Our Trust (Tawakkul)</h4>
          <p>We put our complete trust in Allah. While we make efforts, we know that ultimately only Allah can grant success.</p>
          
          <h4>4. In Times of Fear</h4>
          <p>True believers fear only Allah. They don't fear bad luck, superstitions, or created beings.</p>
          
          <h4>5. In Times of Gratitude</h4>
          <p>All our thanks go to Allah first. He is the source of all blessings.</p>
          
          <div class="activity-box">
            <h4>📝 Reflection Activity</h4>
            <p>Think about your day. Can you identify three moments when you can consciously practice Tawheed? Examples:</p>
            <ul>
              <li>Saying "Bismillah" before eating - remembering Allah</li>
              <li>Making dua before a test - trusting in Allah</li>
              <li>Saying "Alhamdulillah" when something good happens - thanking Allah</li>
            </ul>
          </div>
        `,
        orderIndex: 2,
      },
    }),
  ]);

  // Add questions to Tawheed units
  await prisma.question.createMany({
    data: [
      {
        unitId: tawheedUnits[0].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the meaning of Tawheed?',
        options: JSON.stringify([
          'The oneness of Allah',
          'The five pillars of Islam',
          'The prophets of Allah',
          'The angels of Allah',
        ]),
        correctAnswer: 'The oneness of Allah',
        explanation: 'Tawheed is the Islamic concept of the oneness and uniqueness of Allah.',
        difficulty: 'EASY',
      },
      {
        unitId: tawheedUnits[0].id,
        type: 'TRUE_FALSE',
        questionText: 'The Shahada is a statement of Tawheed.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Shahada (La ilaha illa Allah) affirms that there is no god worthy of worship except Allah, which is the core of Tawheed.',
        difficulty: 'EASY',
      },
      {
        unitId: tawheedUnits[0].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which Arabic word does Tawheed come from?',
        options: JSON.stringify([
          'Wahada (to make one)',
          'Salama (peace)',
          'Ahmada (to praise)',
          'Karima (to honor)',
        ]),
        correctAnswer: 'Wahada (to make one)',
        explanation: 'Tawheed comes from the Arabic root "wahada" which means to make one or unify.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: tawheedUnits[1].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which category of Tawheed is about Allah being the only Creator?',
        options: JSON.stringify([
          'Tawheed ar-Rububiyyah',
          'Tawheed al-Uluhiyyah',
          'Tawheed al-Asma was-Sifat',
          'Tawheed al-Ibadah',
        ]),
        correctAnswer: 'Tawheed ar-Rububiyyah',
        explanation: 'Tawheed ar-Rububiyyah (Lordship) is about Allah being the sole Creator, Owner, and Controller of all things.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: tawheedUnits[1].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which Surah perfectly summarizes Tawheed?',
        options: JSON.stringify([
          'Surah Al-Ikhlas',
          'Surah Al-Fatiha',
          'Surah Al-Baqarah',
          'Surah An-Nas',
        ]),
        correctAnswer: 'Surah Al-Ikhlas',
        explanation: 'Surah Al-Ikhlas (Chapter 112) is known as the Surah of Tawheed because it describes the oneness and uniqueness of Allah.',
        difficulty: 'EASY',
      },
      {
        unitId: tawheedUnits[1].id,
        type: 'TRUE_FALSE',
        questionText: 'Tawheed al-Uluhiyyah means that only Allah should be worshipped.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Tawheed al-Uluhiyyah is the belief that all worship must be directed to Allah alone.',
        difficulty: 'EASY',
      },
      {
        unitId: tawheedUnits[2].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is Tawakkul?',
        options: JSON.stringify([
          'Putting complete trust in Allah',
          'Fasting during Ramadan',
          'Reciting Quran daily',
          'Giving charity',
        ]),
        correctAnswer: 'Putting complete trust in Allah',
        explanation: 'Tawakkul is relying on Allah and putting complete trust in Him while making efforts.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: tawheedUnits[2].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which phrase do we say before eating to remember Allah?',
        options: JSON.stringify([
          'Bismillah',
          'Alhamdulillah',
          'SubhanAllah',
          'Allahu Akbar',
        ]),
        correctAnswer: 'Bismillah',
        explanation: 'We say "Bismillah" (In the name of Allah) before eating to remember Allah and seek His blessings.',
        difficulty: 'EASY',
      },
    ],
  });

  // Add Arabic terms to Tawheed units
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: tawheedUnits[0].id,
        arabicText: 'توحيد',
        transliteration: 'Tawheed',
        translation: 'The oneness and uniqueness of Allah',
      },
      {
        unitId: tawheedUnits[0].id,
        arabicText: 'لا إله إلا الله',
        transliteration: 'La ilaha illa Allah',
        translation: 'There is no god worthy of worship except Allah',
      },
      {
        unitId: tawheedUnits[1].id,
        arabicText: 'الربوبية',
        transliteration: 'Ar-Rububiyyah',
        translation: 'Lordship - Allah is the Lord of all creation',
      },
      {
        unitId: tawheedUnits[1].id,
        arabicText: 'الألوهية',
        transliteration: 'Al-Uluhiyyah',
        translation: 'Worship - Only Allah deserves worship',
      },
      {
        unitId: tawheedUnits[1].id,
        arabicText: 'الأسماء والصفات',
        transliteration: 'Al-Asma was-Sifat',
        translation: "The Names and Attributes of Allah",
      },
      {
        unitId: tawheedUnits[2].id,
        arabicText: 'توكل',
        transliteration: 'Tawakkul',
        translation: 'Complete trust and reliance on Allah',
      },
      {
        unitId: tawheedUnits[2].id,
        arabicText: 'بسم الله',
        transliteration: 'Bismillah',
        translation: 'In the name of Allah',
      },
      {
        unitId: tawheedUnits[2].id,
        arabicText: 'الحمد لله',
        transliteration: 'Alhamdulillah',
        translation: 'All praise is due to Allah',
      },
    ],
  });

  console.log('✅ Created Tawheed course with', tawheedUnits.length, 'units');

  // Course 2: Stories of the Prophets
  const prophetsCourse = await prisma.course.create({
    data: {
      title: 'Stories of the Prophets',
      description: 'Explore the inspiring stories of the prophets mentioned in the Quran, from Adam (AS) to Muhammad (SAW). Learn valuable lessons from their lives.',
      category: 'SEERAH',
      ageLevels: ['EARLY_CHILD', 'CHILD', 'PRE_TEEN', 'TEEN', 'ADULT'],
      isPublished: true,
    },
  });

  const prophetsUnits = await Promise.all([
    prisma.unit.create({
      data: {
        courseId: prophetsCourse.id,
        title: 'Prophet Adam (AS)',
        description: 'The story of the first prophet and first human being',
        content: `
          <h2>Prophet Adam (AS) - The First Human</h2>
          <p>Adam (عليه السلام) was the first human being created by Allah and the first prophet. His story teaches us about the creation of mankind, the purpose of life, and the importance of repentance.</p>
          
          <h3>The Creation of Adam</h3>
          <p>Allah created Adam from clay and breathed His spirit into him. He was created as a special being with intelligence and free will. Allah says in the Quran:</p>
          
          <div class="quran-verse">
            <p class="arabic">وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي خَالِقٌ بَشَرًا مِّن طِينٍ</p>
            <p>"And [mention] when your Lord said to the angels, 'Indeed, I am going to create a human being from clay.'" [Surah Sad, 38:71]</p>
          </div>
          
          <h3>Adam in Paradise</h3>
          <p>After creating Adam, Allah:</p>
          <ul>
            <li>Taught him the names of all things</li>
            <li>Created Hawwa (Eve) as his companion</li>
            <li>Placed them both in Paradise</li>
            <li>Allowed them to eat from all trees except one</li>
          </ul>
          
          <h3>The Mistake and Repentance</h3>
          <p>Shaytan deceived Adam and Hawwa into eating from the forbidden tree. However, Adam immediately turned to Allah in repentance:</p>
          
          <div class="quran-verse">
            <p class="arabic">قَالَا رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ</p>
            <p>"They said, 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.'" [Surah Al-A'raf, 7:23]</p>
          </div>
          
          <h3>Lessons from Adam's Story</h3>
          <ul>
            <li><strong>Repentance:</strong> We all make mistakes, but Allah forgives those who sincerely repent</li>
            <li><strong>Beware of Shaytan:</strong> Shaytan is our enemy who tries to mislead us</li>
            <li><strong>Purpose of Life:</strong> Humans were created to worship Allah on Earth</li>
          </ul>
        `,
        orderIndex: 0,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: prophetsCourse.id,
        title: 'Prophet Nuh (AS)',
        description: 'The story of Prophet Nuh and the great flood',
        content: `
          <h2>Prophet Nuh (AS) - The Patient Prophet</h2>
          <p>Nuh (عليه السلام) is known for his incredible patience. He preached to his people for 950 years, calling them to worship Allah alone.</p>
          
          <h3>The Mission of Nuh</h3>
          <p>People had begun worshipping idols, and Allah sent Nuh to guide them back to the truth. Despite his efforts, only a few believed in him.</p>
          
          <h3>Building the Ark</h3>
          <p>Allah commanded Nuh to build a large ship (the Ark). Even though there was no sea nearby, Nuh obeyed without question. His people mocked him, but he persisted.</p>
          
          <h3>The Great Flood</h3>
          <p>When the flood came, Nuh boarded the Ark with the believers and pairs of animals. The entire Earth was flooded, and only those on the Ark survived.</p>
          
          <div class="quran-verse">
            <p class="arabic">وَقِيلَ يَا أَرْضُ ابْلَعِي مَاءَكِ وَيَا سَمَاءُ أَقْلِعِي</p>
            <p>"And it was said, 'O earth, swallow your water, and O sky, withhold [your rain].'" [Surah Hud, 11:44]</p>
          </div>
          
          <h3>Lessons from Nuh's Story</h3>
          <ul>
            <li><strong>Patience:</strong> Keep calling to good even when people don't listen</li>
            <li><strong>Obedience to Allah:</strong> Follow Allah's commands even if they seem unusual</li>
            <li><strong>Trust in Allah:</strong> Allah always saves the believers</li>
          </ul>
        `,
        orderIndex: 1,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: prophetsCourse.id,
        title: 'Prophet Ibrahim (AS)',
        description: 'The father of the prophets and his remarkable faith',
        content: `
          <h2>Prophet Ibrahim (AS) - The Friend of Allah</h2>
          <p>Ibrahim (عليه السلام) is known as "Khalilullah" - the friend of Allah. He is considered the father of many prophets, including Ismail and Ishaq.</p>
          
          <h3>Rejecting Idol Worship</h3>
          <p>Even as a young boy, Ibrahim used his reason to understand that idols could not be gods. He questioned his father and his people about their worship of statues.</p>
          
          <h3>The Test of Fire</h3>
          <p>When Ibrahim broke the idols to prove they were powerless, his people threw him into a huge fire. But Allah commanded:</p>
          
          <div class="quran-verse">
            <p class="arabic">قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ</p>
            <p>"We said, 'O fire, be coolness and safety upon Ibrahim.'" [Surah Al-Anbiya, 21:69]</p>
          </div>
          
          <h3>Building the Kaaba</h3>
          <p>Ibrahim and his son Ismail built the Kaaba in Mecca, the holiest site in Islam. Muslims face the Kaaba when they pray.</p>
          
          <h3>Lessons from Ibrahim's Story</h3>
          <ul>
            <li><strong>Use Your Mind:</strong> Think about what you're told and seek the truth</li>
            <li><strong>Stand Up for Truth:</strong> Even when standing alone</li>
            <li><strong>Complete Trust in Allah:</strong> Allah protects those who believe</li>
          </ul>
        `,
        orderIndex: 2,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: prophetsCourse.id,
        title: 'Prophet Musa (AS)',
        description: 'The story of Musa and the liberation of Bani Israel',
        content: `
          <h2>Prophet Musa (AS) - The Liberator</h2>
          <p>Musa (عليه السلام) is one of the most mentioned prophets in the Quran. He was sent to free Bani Israel from the tyranny of Pharaoh.</p>
          
          <h3>Baby in a Basket</h3>
          <p>Pharaoh ordered all newborn boys of Bani Israel to be killed. Musa's mother placed him in a basket and floated it down the Nile. Amazingly, Pharaoh's own family found and raised Musa!</p>
          
          <h3>The Burning Bush</h3>
          <p>As an adult, Musa saw a burning bush that did not burn up. Allah spoke to him from the bush and gave him his mission to confront Pharaoh.</p>
          
          <h3>Miracles of Musa</h3>
          <p>Allah gave Musa several miracles:</p>
          <ul>
            <li>His staff could turn into a snake</li>
            <li>His hand would glow with light</li>
            <li>He parted the Red Sea</li>
          </ul>
          
          <h3>Parting of the Red Sea</h3>
          <p>When Pharaoh's army trapped Bani Israel at the sea, Allah commanded Musa to strike the water with his staff. The sea split, creating a path for the believers.</p>
          
          <div class="quran-verse">
            <p class="arabic">فَأَوْحَيْنَا إِلَىٰ مُوسَىٰ أَنِ اضْرِب بِّعَصَاكَ الْبَحْرَ ۖ فَانفَلَقَ</p>
            <p>"So We inspired Musa, 'Strike with your staff the sea,' and it parted." [Surah Ash-Shu'ara, 26:63]</p>
          </div>
          
          <h3>Lessons from Musa's Story</h3>
          <ul>
            <li><strong>Allah's Plan:</strong> Allah's plan is always perfect, even when we don't understand</li>
            <li><strong>Stand Against Oppression:</strong> Speak truth to those in power</li>
            <li><strong>Miracles:</strong> Allah can do anything He wills</li>
          </ul>
        `,
        orderIndex: 3,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: prophetsCourse.id,
        title: 'Prophet Isa (AS)',
        description: 'The miraculous birth and mission of Prophet Isa',
        content: `
          <h2>Prophet Isa (AS) - The Miracle Worker</h2>
          <p>Isa (عليه السلام) was born miraculously to Maryam (Mary) without a father. He is one of the greatest prophets and performed many miracles by Allah's permission.</p>
          
          <h3>The Miraculous Birth</h3>
          <p>Maryam was a pious woman who devoted herself to worship. Allah sent the angel Jibreel to give her news of a special son:</p>
          
          <div class="quran-verse">
            <p class="arabic">قَالَتْ أَنَّىٰ يَكُونُ لِي غُلَامٌ وَلَمْ يَمْسَسْنِي بَشَرٌ</p>
            <p>"She said, 'How can I have a boy while no man has touched me?'" [Surah Maryam, 19:20]</p>
          </div>
          
          <h3>Speaking in the Cradle</h3>
          <p>When people accused Maryam, the baby Isa spoke from the cradle, declaring himself a prophet of Allah.</p>
          
          <h3>Miracles of Isa</h3>
          <p>By Allah's permission, Isa performed many miracles:</p>
          <ul>
            <li>Healing the blind and lepers</li>
            <li>Bringing the dead back to life</li>
            <li>Creating a bird from clay that came to life</li>
          </ul>
          
          <h3>Isa's Message</h3>
          <p>Isa called people to worship Allah alone and to follow the Torah. He was sent specifically to the Children of Israel.</p>
          
          <h3>Lessons from Isa's Story</h3>
          <ul>
            <li><strong>Allah's Power:</strong> Allah can create without normal means</li>
            <li><strong>Miracles Need Permission:</strong> Prophets' miracles were only by Allah's will</li>
            <li><strong>Pure Worship:</strong> Isa called to worship Allah alone</li>
          </ul>
        `,
        orderIndex: 4,
      },
    }),
  ]);

  // Add questions to Prophets course
  await prisma.question.createMany({
    data: [
      {
        unitId: prophetsUnits[0].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What was Prophet Adam (AS) created from?',
        options: JSON.stringify(['Clay', 'Light', 'Water', 'Fire']),
        correctAnswer: 'Clay',
        explanation: 'Allah created Adam from clay and breathed His spirit into him.',
        difficulty: 'EASY',
      },
      {
        unitId: prophetsUnits[0].id,
        type: 'TRUE_FALSE',
        questionText: 'Adam was forgiven when he repented to Allah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Allah accepted Adam\'s repentance, teaching us that sincere repentance is always accepted.',
        difficulty: 'EASY',
      },
      {
        unitId: prophetsUnits[1].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many years did Prophet Nuh (AS) call his people to Islam?',
        options: JSON.stringify(['950 years', '100 years', '500 years', '40 years']),
        correctAnswer: '950 years',
        explanation: 'Nuh preached to his people for 950 years, showing incredible patience.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: prophetsUnits[2].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is Prophet Ibrahim (AS) known as?',
        options: JSON.stringify(['Khalilullah (Friend of Allah)', 'Kalimullah (One who spoke to Allah)', 'Ruhullah (Spirit of Allah)', 'Habibullah (Beloved of Allah)']),
        correctAnswer: 'Khalilullah (Friend of Allah)',
        explanation: 'Ibrahim is called Khalilullah, meaning the Friend of Allah, due to his close relationship with Allah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: prophetsUnits[3].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What miracle did Allah give Prophet Musa (AS) with his staff?',
        options: JSON.stringify(['It could turn into a snake', 'It could fly', 'It could speak', 'It could glow']),
        correctAnswer: 'It could turn into a snake',
        explanation: 'Musa\'s staff would turn into a large snake when he threw it down.',
        difficulty: 'EASY',
      },
      {
        unitId: prophetsUnits[4].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is unique about Prophet Isa\'s (AS) birth?',
        options: JSON.stringify(['He was born without a father', 'He was born in the Kaaba', 'He was born as an adult', 'He was born in Egypt']),
        correctAnswer: 'He was born without a father',
        explanation: 'Isa was born miraculously to Maryam without a father, by the command of Allah.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Created Prophets course with', prophetsUnits.length, 'units');

  // Course 3: Learn Arabic Basics
  const arabicCourse = await prisma.course.create({
    data: {
      title: 'Learn Arabic Basics',
      description: 'Start your journey in learning Arabic with the alphabet, basic vocabulary, and simple phrases used in daily Islamic life.',
      category: 'ARABIC',
      ageLevels: ['CHILD', 'PRE_TEEN', 'TEEN', 'ADULT'],
      isPublished: true,
    },
  });

  const arabicUnits = await Promise.all([
    prisma.unit.create({
      data: {
        courseId: arabicCourse.id,
        title: 'The Arabic Alphabet',
        description: 'Learn to recognize and pronounce the 28 Arabic letters',
        content: `
          <h2>The Arabic Alphabet (الأبجدية العربية)</h2>
          <p>Arabic has 28 letters and is written from <strong>right to left</strong>. Each letter can have up to four forms depending on its position in a word.</p>
          
          <h3>The First 7 Letters</h3>
          <div class="alphabet-grid">
            <div class="letter-card">
              <span class="arabic-large">ا</span>
              <p>Alif (ا) - Makes an "aa" sound</p>
            </div>
            <div class="letter-card">
              <span class="arabic-large">ب</span>
              <p>Ba (ب) - Like English "b"</p>
            </div>
            <div class="letter-card">
              <span class="arabic-large">ت</span>
              <p>Ta (ت) - Like English "t"</p>
            </div>
            <div class="letter-card">
              <span class="arabic-large">ث</span>
              <p>Tha (ث) - Like "th" in "think"</p>
            </div>
            <div class="letter-card">
              <span class="arabic-large">ج</span>
              <p>Jeem (ج) - Like English "j"</p>
            </div>
            <div class="letter-card">
              <span class="arabic-large">ح</span>
              <p>Ha (ح) - A heavy "h" from the throat</p>
            </div>
            <div class="letter-card">
              <span class="arabic-large">خ</span>
              <p>Kha (خ) - Like "ch" in German "Bach"</p>
            </div>
          </div>
          
          <h3>Practice Tips</h3>
          <ul>
            <li>Practice writing each letter 10 times</li>
            <li>Say the letter name out loud as you write</li>
            <li>Listen to Arabic recitation to hear the sounds</li>
          </ul>
        `,
        orderIndex: 0,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: arabicCourse.id,
        title: 'Essential Islamic Phrases',
        description: 'Learn common Islamic greetings and everyday phrases',
        content: `
          <h2>Essential Islamic Phrases</h2>
          <p>These are phrases that every Muslim uses daily. Learning them will help you in your worship and interactions.</p>
          
          <h3>Greetings</h3>
          <div class="phrase-card">
            <p class="arabic-large">السَّلَامُ عَلَيْكُمْ</p>
            <p><strong>Assalamu Alaikum</strong> - Peace be upon you</p>
            <p class="note">The standard Islamic greeting</p>
          </div>
          
          <div class="phrase-card">
            <p class="arabic-large">وَعَلَيْكُمُ السَّلَام</p>
            <p><strong>Wa Alaikum Assalam</strong> - And upon you be peace</p>
            <p class="note">The response to the greeting</p>
          </div>
          
          <h3>Daily Expressions</h3>
          <div class="phrase-card">
            <p class="arabic-large">بِسْمِ اللَّهِ</p>
            <p><strong>Bismillah</strong> - In the name of Allah</p>
            <p class="note">Said before eating, starting any task</p>
          </div>
          
          <div class="phrase-card">
            <p class="arabic-large">الْحَمْدُ لِلَّهِ</p>
            <p><strong>Alhamdulillah</strong> - All praise is due to Allah</p>
            <p class="note">Said after eating, sneezing, or when grateful</p>
          </div>
          
          <div class="phrase-card">
            <p class="arabic-large">إِنْ شَاءَ اللَّهُ</p>
            <p><strong>In Sha Allah</strong> - If Allah wills</p>
            <p class="note">Said when talking about future plans</p>
          </div>
          
          <div class="phrase-card">
            <p class="arabic-large">مَاشَاءَ اللَّهُ</p>
            <p><strong>Masha Allah</strong> - What Allah has willed</p>
            <p class="note">Said when admiring something beautiful</p>
          </div>
          
          <div class="phrase-card">
            <p class="arabic-large">سُبْحَانَ اللَّهِ</p>
            <p><strong>SubhanAllah</strong> - Glory be to Allah</p>
            <p class="note">Said when amazed by Allah's creation</p>
          </div>
          
          <div class="phrase-card">
            <p class="arabic-large">اللَّهُ أَكْبَرُ</p>
            <p><strong>Allahu Akbar</strong> - Allah is the Greatest</p>
            <p class="note">Said in prayer and when praising Allah</p>
          </div>
        `,
        orderIndex: 1,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: arabicCourse.id,
        title: 'Numbers in Arabic',
        description: 'Learn to count from 1 to 10 in Arabic',
        content: `
          <h2>Arabic Numbers (الأرقام العربية)</h2>
          <p>Learning numbers is essential for understanding Quran verses and daily life.</p>
          
          <h3>Numbers 1-10</h3>
          <div class="number-grid">
            <div class="number-card">
              <span class="number">1</span>
              <span class="arabic-large">واحد</span>
              <p>Wahid</p>
            </div>
            <div class="number-card">
              <span class="number">2</span>
              <span class="arabic-large">اثنان</span>
              <p>Ithnan</p>
            </div>
            <div class="number-card">
              <span class="number">3</span>
              <span class="arabic-large">ثلاثة</span>
              <p>Thalatha</p>
            </div>
            <div class="number-card">
              <span class="number">4</span>
              <span class="arabic-large">أربعة</span>
              <p>Arba'a</p>
            </div>
            <div class="number-card">
              <span class="number">5</span>
              <span class="arabic-large">خمسة</span>
              <p>Khamsa</p>
            </div>
            <div class="number-card">
              <span class="number">6</span>
              <span class="arabic-large">ستة</span>
              <p>Sitta</p>
            </div>
            <div class="number-card">
              <span class="number">7</span>
              <span class="arabic-large">سبعة</span>
              <p>Sab'a</p>
            </div>
            <div class="number-card">
              <span class="number">8</span>
              <span class="arabic-large">ثمانية</span>
              <p>Thamaniya</p>
            </div>
            <div class="number-card">
              <span class="number">9</span>
              <span class="arabic-large">تسعة</span>
              <p>Tis'a</p>
            </div>
            <div class="number-card">
              <span class="number">10</span>
              <span class="arabic-large">عشرة</span>
              <p>'Ashara</p>
            </div>
          </div>
          
          <h3>Practice Activity</h3>
          <p>Count the number of times you say "SubhanAllah" in your dhikr using Arabic numbers!</p>
        `,
        orderIndex: 2,
      },
    }),
  ]);

  // Add Arabic terms to Arabic course
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: arabicUnits[0].id,
        arabicText: 'أ ب ت',
        transliteration: 'Alif Ba Ta',
        translation: 'First three letters of Arabic alphabet',
      },
      {
        unitId: arabicUnits[1].id,
        arabicText: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        translation: 'In the name of Allah',
      },
      {
        unitId: arabicUnits[1].id,
        arabicText: 'الْحَمْدُ لِلَّهِ',
        transliteration: 'Alhamdulillah',
        translation: 'All praise is due to Allah',
      },
      {
        unitId: arabicUnits[1].id,
        arabicText: 'السَّلَامُ عَلَيْكُمْ',
        transliteration: 'Assalamu Alaikum',
        translation: 'Peace be upon you',
      },
      {
        unitId: arabicUnits[1].id,
        arabicText: 'إِنْ شَاءَ اللَّهُ',
        transliteration: 'In Sha Allah',
        translation: 'If Allah wills',
      },
      {
        unitId: arabicUnits[1].id,
        arabicText: 'مَاشَاءَ اللَّهُ',
        transliteration: 'Masha Allah',
        translation: 'What Allah has willed',
      },
      {
        unitId: arabicUnits[1].id,
        arabicText: 'سُبْحَانَ اللَّهِ',
        transliteration: 'SubhanAllah',
        translation: 'Glory be to Allah',
      },
      {
        unitId: arabicUnits[1].id,
        arabicText: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest',
      },
      {
        unitId: arabicUnits[2].id,
        arabicText: 'واحد',
        transliteration: 'Wahid',
        translation: 'One (1)',
      },
      {
        unitId: arabicUnits[2].id,
        arabicText: 'خمسة',
        transliteration: 'Khamsa',
        translation: 'Five (5)',
      },
      {
        unitId: arabicUnits[2].id,
        arabicText: 'عشرة',
        transliteration: 'Ashara',
        translation: 'Ten (10)',
      },
    ],
  });

  // Add questions to Arabic course
  await prisma.question.createMany({
    data: [
      {
        unitId: arabicUnits[0].id,
        type: 'TRUE_FALSE',
        questionText: 'Arabic is written from right to left.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Arabic is written and read from right to left, which is the opposite of English.',
        difficulty: 'EASY',
      },
      {
        unitId: arabicUnits[0].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many letters are in the Arabic alphabet?',
        options: JSON.stringify(['28', '26', '30', '24']),
        correctAnswer: '28',
        explanation: 'The Arabic alphabet has 28 letters.',
        difficulty: 'EASY',
      },
      {
        unitId: arabicUnits[1].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does "Bismillah" mean?',
        options: JSON.stringify(['In the name of Allah', 'Allah is Great', 'Thank God', 'Peace']),
        correctAnswer: 'In the name of Allah',
        explanation: 'Bismillah means "In the name of Allah" and is said before starting any task.',
        difficulty: 'EASY',
      },
      {
        unitId: arabicUnits[1].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What phrase do we say when talking about future plans?',
        options: JSON.stringify(['In Sha Allah', 'Masha Allah', 'Alhamdulillah', 'SubhanAllah']),
        correctAnswer: 'In Sha Allah',
        explanation: 'In Sha Allah means "If Allah wills" and is said when discussing future intentions.',
        difficulty: 'EASY',
      },
      {
        unitId: arabicUnits[2].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the Arabic word for "five"?',
        options: JSON.stringify(['Khamsa', 'Sab\'a', 'Thalatha', 'Wahid']),
        correctAnswer: 'Khamsa',
        explanation: 'Khamsa (خمسة) is the Arabic word for five.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Created Arabic course with', arabicUnits.length, 'units');

  // Course 4: The Five Pillars of Islam
  const pillarsCourse = await prisma.course.create({
    data: {
      title: 'The Five Pillars of Islam',
      description: 'Understand the five fundamental pillars that form the foundation of Muslim life. These are the essential practices every Muslim should know.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN', 'TEEN', 'ADULT'],
      isPublished: true,
    },
  });

  const pillarsUnits = await Promise.all([
    prisma.unit.create({
      data: {
        courseId: pillarsCourse.id,
        title: 'Shahada - Declaration of Faith',
        description: 'The first pillar: testimony of faith',
        content: `
          <h2>Shahada - The Declaration of Faith</h2>
          <p>The Shahada is the first and most important pillar of Islam. It is the declaration that there is no god worthy of worship except Allah, and that Muhammad is His messenger.</p>
          
          <div class="shahada-box">
            <p class="arabic-large">أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ</p>
            <p><strong>"Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan Rasul Allah"</strong></p>
            <p>"I bear witness that there is no god worthy of worship except Allah, and I bear witness that Muhammad is the messenger of Allah."</p>
          </div>
          
          <h3>The Two Parts of Shahada</h3>
          <ol>
            <li><strong>La ilaha illa Allah</strong> - There is no god worthy of worship except Allah</li>
            <li><strong>Muhammad Rasul Allah</strong> - Muhammad is the messenger of Allah</li>
          </ol>
          
          <h3>Importance of Shahada</h3>
          <ul>
            <li>It is the doorway to Islam</li>
            <li>Sincerely saying it with understanding makes one a Muslim</li>
            <li>It affirms Tawheed (the oneness of Allah)</li>
            <li>It confirms the prophethood of Muhammad (SAW)</li>
          </ul>
        `,
        orderIndex: 0,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: pillarsCourse.id,
        title: 'Salah - The Five Daily Prayers',
        description: 'The second pillar: the five daily prayers',
        content: `
          <h2>Salah - The Five Daily Prayers</h2>
          <p>Salah is the second pillar of Islam. Muslims pray five times a day facing the Kaaba in Mecca. It is a direct connection between the worshipper and Allah.</p>
          
          <h3>The Five Daily Prayers</h3>
          <table class="prayer-table">
            <tr><th>Prayer</th><th>Time</th><th>Rakaat</th></tr>
            <tr><td><strong>Fajr</strong> (Dawn)</td><td>Before sunrise</td><td>2</td></tr>
            <tr><td><strong>Dhuhr</strong> (Noon)</td><td>After midday</td><td>4</td></tr>
            <tr><td><strong>Asr</strong> (Afternoon)</td><td>Late afternoon</td><td>4</td></tr>
            <tr><td><strong>Maghrib</strong> (Sunset)</td><td>After sunset</td><td>3</td></tr>
            <tr><td><strong>Isha</strong> (Night)</td><td>Night time</td><td>4</td></tr>
          </table>
          
          <h3>Requirements for Prayer</h3>
          <ul>
            <li><strong>Wudu</strong> - Ritual purification</li>
            <li><strong>Clean place</strong> - Prayer should be on clean ground</li>
            <li><strong>Proper clothing</strong> - Body should be covered appropriately</li>
            <li><strong>Facing Qibla</strong> - Direction of the Kaaba</li>
            <li><strong>Intention</strong> - Clear intention to pray</li>
          </ul>
          
          <div class="hadith-box">
            <p>The Prophet (SAW) said: <em>"The first matter that the slave will be brought to account for on the Day of Judgment is the prayer."</em></p>
          </div>
        `,
        orderIndex: 1,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: pillarsCourse.id,
        title: 'Zakat - Obligatory Charity',
        description: 'The third pillar: obligatory charity',
        content: `
          <h2>Zakat - Obligatory Charity</h2>
          <p>Zakat is the third pillar of Islam. It is the obligatory giving of 2.5% of one's wealth to those in need.</p>
          
          <h3>What is Zakat?</h3>
          <p>Zakat means "purification" and "growth." By giving Zakat, Muslims:</p>
          <ul>
            <li>Purify their wealth</li>
            <li>Help those in need</li>
            <li>Reduce the gap between rich and poor</li>
            <li>Develop generosity and compassion</li>
          </ul>
          
          <h3>Who Can Receive Zakat?</h3>
          <p>The Quran specifies eight categories of people who can receive Zakat:</p>
          <ol>
            <li>The poor (Fuqara)</li>
            <li>The needy (Masakin)</li>
            <li>Zakat collectors</li>
            <li>Those whose hearts are to be reconciled</li>
            <li>Those in bondage (slaves)</li>
            <li>Those in debt</li>
            <li>In the cause of Allah</li>
            <li>Travelers in need</li>
          </ol>
          
          <h3>How Much is Zakat?</h3>
          <p>Zakat is generally 2.5% of savings that have been held for one lunar year (if above the nisab threshold).</p>
        `,
        orderIndex: 2,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: pillarsCourse.id,
        title: 'Sawm - Fasting in Ramadan',
        description: 'The fourth pillar: fasting during Ramadan',
        content: `
          <h2>Sawm - Fasting in Ramadan</h2>
          <p>Sawm is the fourth pillar of Islam. Muslims fast during the month of Ramadan from dawn to sunset.</p>
          
          <h3>What is Fasting?</h3>
          <p>During the fast, Muslims abstain from:</p>
          <ul>
            <li>Food and drink</li>
            <li>Bad behavior and speech</li>
            <li>Sinful actions</li>
          </ul>
          
          <h3>The Daily Routine of Fasting</h3>
          <ul>
            <li><strong>Suhoor</strong> - Pre-dawn meal before Fajr</li>
            <li><strong>Fasting</strong> - From Fajr to Maghrib</li>
            <li><strong>Iftar</strong> - Breaking the fast at sunset</li>
          </ul>
          
          <h3>Benefits of Fasting</h3>
          <ul>
            <li><strong>Taqwa</strong> - Developing God-consciousness</li>
            <li><strong>Self-discipline</strong> - Learning to control desires</li>
            <li><strong>Empathy</strong> - Understanding the hunger of the poor</li>
            <li><strong>Gratitude</strong> - Appreciating Allah's blessings</li>
          </ul>
          
          <div class="quran-verse">
            <p class="arabic">يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ</p>
            <p>"O you who believe, fasting has been prescribed for you..." [Surah Al-Baqarah, 2:183]</p>
          </div>
        `,
        orderIndex: 3,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: pillarsCourse.id,
        title: 'Hajj - Pilgrimage to Mecca',
        description: 'The fifth pillar: pilgrimage to Mecca',
        content: `
          <h2>Hajj - The Pilgrimage to Mecca</h2>
          <p>Hajj is the fifth pillar of Islam. Every Muslim who is physically and financially able must perform Hajj at least once in their lifetime.</p>
          
          <h3>When is Hajj?</h3>
          <p>Hajj takes place during the Islamic month of Dhul Hijjah, specifically from the 8th to the 12th day.</p>
          
          <h3>Main Rituals of Hajj</h3>
          <ol>
            <li><strong>Ihram</strong> - Entering the state of pilgrimage with special clothing</li>
            <li><strong>Tawaf</strong> - Circling the Kaaba seven times</li>
            <li><strong>Sa'i</strong> - Walking between Safa and Marwa hills</li>
            <li><strong>Standing at Arafat</strong> - The most important day of Hajj</li>
            <li><strong>Stoning the Jamarat</strong> - Throwing pebbles at the pillars</li>
            <li><strong>Sacrifice</strong> - Offering an animal sacrifice (Eid al-Adha)</li>
          </ol>
          
          <h3>Significance of Hajj</h3>
          <ul>
            <li>Unites Muslims from all over the world</li>
            <li>Commemorates the actions of Prophet Ibrahim and his family</li>
            <li>All pilgrims are equal before Allah, wearing simple white garments</li>
            <li>A properly performed Hajj wipes away all previous sins</li>
          </ul>
          
          <div class="hadith-box">
            <p>The Prophet (SAW) said: <em>"Whoever performs Hajj and does not commit any obscenity or transgression will return [free from sin] as the day his mother bore him."</em></p>
          </div>
        `,
        orderIndex: 4,
      },
    }),
  ]);

  // Add questions to Pillars course
  await prisma.question.createMany({
    data: [
      {
        unitId: pillarsUnits[0].id,
        type: 'TRUE_FALSE',
        questionText: 'The Shahada is the first pillar of Islam.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The Shahada (declaration of faith) is the first and most important pillar of Islam.',
        difficulty: 'EASY',
      },
      {
        unitId: pillarsUnits[1].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many times do Muslims pray each day?',
        options: JSON.stringify(['5 times', '3 times', '7 times', '2 times']),
        correctAnswer: '5 times',
        explanation: 'Muslims pray five times daily: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
        difficulty: 'EASY',
      },
      {
        unitId: pillarsUnits[1].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What must Muslims do before praying?',
        options: JSON.stringify(['Perform Wudu (ablution)', 'Fast for one day', 'Give charity', 'Read Quran']),
        correctAnswer: 'Perform Wudu (ablution)',
        explanation: 'Wudu (ritual purification) is required before performing Salah.',
        difficulty: 'EASY',
      },
      {
        unitId: pillarsUnits[2].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What percentage of savings is given as Zakat?',
        options: JSON.stringify(['2.5%', '5%', '10%', '25%']),
        correctAnswer: '2.5%',
        explanation: 'Zakat is 2.5% of savings held for one lunar year above the nisab threshold.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: pillarsUnits[3].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'During which month do Muslims fast?',
        options: JSON.stringify(['Ramadan', 'Shawwal', 'Muharram', 'Dhul Hijjah']),
        correctAnswer: 'Ramadan',
        explanation: 'Ramadan is the holy month during which Muslims fast from dawn to sunset.',
        difficulty: 'EASY',
      },
      {
        unitId: pillarsUnits[4].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is Tawaf?',
        options: JSON.stringify(['Circling the Kaaba 7 times', 'Praying at Mount Arafat', 'Throwing stones at pillars', 'Running between two hills']),
        correctAnswer: 'Circling the Kaaba 7 times',
        explanation: 'Tawaf is the ritual of walking around the Kaaba seven times during Hajj and Umrah.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Created Five Pillars course with', pillarsUnits.length, 'units');

  // Course 5: Daily Duas and Adhkar
  const duasCourse = await prisma.course.create({
    data: {
      title: 'Daily Duas and Adhkar',
      description: 'Learn essential duas (supplications) for daily life - from waking up to going to sleep, eating, traveling, and more.',
      category: 'QURAN',
      ageLevels: ['EARLY_CHILD', 'CHILD', 'PRE_TEEN', 'TEEN', 'ADULT'],
      isPublished: true,
    },
  });

  const duasUnits = await Promise.all([
    prisma.unit.create({
      data: {
        courseId: duasCourse.id,
        title: 'Morning and Evening Adhkar',
        description: 'Duas to recite in the morning and evening',
        content: `
          <h2>Morning and Evening Adhkar</h2>
          <p>The Prophet (SAW) would regularly recite certain adhkar (remembrances) in the morning and evening. These protect us and bring blessings.</p>
          
          <h3>Morning Dua - Upon Waking</h3>
          <div class="dua-card">
            <p class="arabic-large">الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ</p>
            <p><strong>Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur</strong></p>
            <p>"All praise is to Allah who gave us life after death and to Him is the resurrection."</p>
          </div>
          
          <h3>Morning Adhkar</h3>
          <div class="dua-card">
            <p class="arabic-large">أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ</p>
            <p><strong>Asbahna wa asbahal-mulku lillah</strong></p>
            <p>"We have entered the morning and the kingdom belongs to Allah."</p>
          </div>
          
          <h3>Evening Adhkar</h3>
          <div class="dua-card">
            <p class="arabic-large">أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ</p>
            <p><strong>Amsayna wa amsal-mulku lillah</strong></p>
            <p>"We have entered the evening and the kingdom belongs to Allah."</p>
          </div>
          
          <h3>Before Sleeping</h3>
          <div class="dua-card">
            <p class="arabic-large">بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا</p>
            <p><strong>Bismika Allahumma amutu wa ahya</strong></p>
            <p>"In Your name, O Allah, I die and I live."</p>
          </div>
        `,
        orderIndex: 0,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: duasCourse.id,
        title: 'Duas for Eating and Drinking',
        description: 'What to say before and after meals',
        content: `
          <h2>Duas for Eating and Drinking</h2>
          <p>Islam teaches us to remember Allah even in simple daily activities like eating and drinking.</p>
          
          <h3>Before Eating</h3>
          <div class="dua-card">
            <p class="arabic-large">بِسْمِ اللَّهِ</p>
            <p><strong>Bismillah</strong></p>
            <p>"In the name of Allah."</p>
            <p class="note">If you forget and remember during the meal, say: "Bismillahi awwalahu wa akhirahu"</p>
          </div>
          
          <h3>After Eating</h3>
          <div class="dua-card">
            <p class="arabic-large">الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ</p>
            <p><strong>Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah</strong></p>
            <p>"All praise is to Allah who fed me this and provided it for me without any might or power on my part."</p>
          </div>
          
          <h3>When Breaking Fast</h3>
          <div class="dua-card">
            <p class="arabic-large">ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ</p>
            <p><strong>Dhahaba al-zama' wa-btallat al-'uruq wa thabata al-ajr in sha Allah</strong></p>
            <p>"The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills."</p>
          </div>
          
          <h3>When Drinking Milk</h3>
          <div class="dua-card">
            <p class="arabic-large">اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ</p>
            <p><strong>Allahumma barik lana fihi wa zidna minhu</strong></p>
            <p>"O Allah, bless us in it and increase us in it."</p>
          </div>
        `,
        orderIndex: 1,
      },
    }),
    prisma.unit.create({
      data: {
        courseId: duasCourse.id,
        title: 'Duas for Protection',
        description: 'Duas for seeking Allah\'s protection',
        content: `
          <h2>Duas for Protection</h2>
          <p>These duas help seek Allah's protection from harm, evil, and difficulties.</p>
          
          <h3>General Protection</h3>
          <div class="dua-card">
            <p class="arabic-large">بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ</p>
            <p><strong>Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim</strong></p>
            <p>"In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing."</p>
            <p class="note">Recite 3 times in the morning and evening</p>
          </div>
          
          <h3>Ayatul Kursi</h3>
          <div class="dua-card">
            <p class="arabic-large">اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...</p>
            <p>Reciting Ayatul Kursi (Surah Al-Baqarah, 2:255) before sleeping brings protection throughout the night.</p>
          </div>
          
          <h3>The Three Quls</h3>
          <p>Recite these surahs 3 times each morning and evening for protection:</p>
          <ul>
            <li><strong>Surah Al-Ikhlas</strong> (Chapter 112)</li>
            <li><strong>Surah Al-Falaq</strong> (Chapter 113)</li>
            <li><strong>Surah An-Nas</strong> (Chapter 114)</li>
          </ul>
          
          <h3>When Leaving Home</h3>
          <div class="dua-card">
            <p class="arabic-large">بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ</p>
            <p><strong>Bismillahi tawakkaltu 'alallahi la hawla wa la quwwata illa billah</strong></p>
            <p>"In the name of Allah, I place my trust in Allah. There is no might and no power except with Allah."</p>
          </div>
        `,
        orderIndex: 2,
      },
    }),
  ]);

  // Add Arabic terms for Duas course
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: duasUnits[0].id,
        arabicText: 'أذكار الصباح',
        transliteration: 'Adhkar As-Sabah',
        translation: 'Morning Remembrances',
      },
      {
        unitId: duasUnits[0].id,
        arabicText: 'أذكار المساء',
        transliteration: 'Adhkar Al-Masa',
        translation: 'Evening Remembrances',
      },
      {
        unitId: duasUnits[1].id,
        arabicText: 'بسم الله',
        transliteration: 'Bismillah',
        translation: 'In the name of Allah',
      },
      {
        unitId: duasUnits[2].id,
        arabicText: 'آية الكرسي',
        transliteration: 'Ayatul Kursi',
        translation: 'The Verse of the Throne',
      },
      {
        unitId: duasUnits[2].id,
        arabicText: 'المعوذات',
        transliteration: "Al-Mu'awwidhat",
        translation: 'The Three Protective Surahs',
      },
    ],
  });

  console.log('✅ Created Duas course with', duasUnits.length, 'units');

  // Course 6: Prayer (Salah) - Hanafi Madhab (for kids 7-10)
  console.log('');
  console.log('📖 Creating Prayer (Salah) course - Hanafi Madhab...');

  const prayerCourse = await prisma.course.create({
    data: {
      title: 'How to Pray (Salah) - The Hanafi Way',
      description: 'Learn the basics of Islamic prayer (Salah) step-by-step following the Hanafi school of thought. Perfect for children aged 7-10 to understand and practice the daily prayers.',
      category: 'FIQH',
      ageLevels: ['CHILD', 'PRE_TEEN'],
      isPublished: true,
    },
  });

  const prayerUnits = await Promise.all([
    // Unit 1: Why We Pray
    prisma.unit.create({
      data: {
        courseId: prayerCourse.id,
        title: 'Why Do We Pray?',
        description: 'Understanding the importance and benefits of prayer in Islam',
        orderIndex: 0,
        content: `
          <h2>Why Do We Pray?</h2>
          <p>Prayer, or <strong>Salah</strong>, is one of the most important things Muslims do every day. It's like talking to Allah and spending special time with Him.</p>
          
          <h3>The Five Daily Prayers</h3>
          <p>Muslims pray five times a day at different times:</p>
          <ul>
            <li><strong>Fajr</strong> - Before sunrise (early morning)</li>
            <li><strong>Dhuhr</strong> - Midday, after the sun passes its highest point</li>
            <li><strong>Asr</strong> - Late afternoon</li>
            <li><strong>Maghrib</strong> - Just after sunset</li>
            <li><strong>Isha</strong> - Night time</li>
          </ul>
          
          <h3>Why Prayer Is Special</h3>
          <div class="example-box">
            <h4>🌟 The Gift of Prayer</h4>
            <p>Prayer is a direct conversation between you and Allah. When we pray, we remember Allah, ask for His help, and thank Him for all the blessings in our lives. It keeps our hearts clean and our minds focused on what's important.</p>
          </div>
          
          <h3>Benefits of Prayer</h3>
          <p>When we pray regularly, many good things happen:</p>
          <ul>
            <li>✅ We feel closer to Allah</li>
            <li>✅ We become stronger and more patient</li>
            <li>✅ We make better choices</li>
            <li>✅ We feel peaceful and happy</li>
            <li>✅ We join with millions of Muslims around the world</li>
          </ul>
          
          <div class="quran-verse">
            <p class="arabic">وَأَقِيمُوا الصَّلَاةَ</p>
            <p>"And establish prayer" [Quran 4:77]</p>
          </div>
          
          <div class="activity-box">
            <h4>📝 Think About It</h4>
            <p>How do you feel when you talk to your parents about something important? Prayer is like that, but we're talking to Allah, who loves us even more. Do you think it's important to take time to talk to Allah every day?</p>
          </div>
        `,
      },
    }),
    // Unit 2: Preparing for Prayer - Wudu
    prisma.unit.create({
      data: {
        courseId: prayerCourse.id,
        title: 'Getting Ready for Prayer - Wudu',
        description: 'Learning the steps of ritual ablution (Wudu) according to the Hanafi method',
        orderIndex: 1,
        content: `
          <h2>Wudu (Ablution) - Getting Clean for Prayer</h2>
          <p>Before we pray, we must clean ourselves in a special way called <strong>Wudu</strong>. This is not just washing - it's a way to purify ourselves before standing before Allah.</p>
          
          <h3>What is Wudu?</h3>
          <p>Wudu is the ritual washing of specific parts of the body with water. It's simple, clean, and helps us feel fresh and ready to pray.</p>
          
          <h3>The Steps of Wudu (Hanafi Method)</h3>
          <p>Follow these steps carefully:</p>
          
          <div class="step-box">
            <h4>Step 1: Intention (Niyyah)</h4>
            <p>Begin by making the intention in your heart that you are doing Wudu to prepare for prayer. You can say: "I intend to do Wudu for prayer."</p>
          </div>
          
          <div class="step-box">
            <h4>Step 2: Wash Your Hands</h4>
            <p>Wash both your hands up to the wrists three times. Rub between your fingers to make sure they are clean.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 3: Rinse Your Mouth</h4>
            <p>Take water in your right hand and rinse your mouth three times. Swish the water around to clean your mouth.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 4: Blow Water in Your Nose</h4>
            <p>Take water in your right hand and sniff it into your nose three times. Then blow it out gently.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 5: Wash Your Face</h4>
            <p>Using both hands, wash your face three times from the forehead to the chin and from ear to ear.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 6: Wash Your Right Arm</h4>
            <p>Wash your right arm from your fingertips to above the elbow three times.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 7: Wash Your Left Arm</h4>
            <p>Wash your left arm from your fingertips to above the elbow three times.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 8: Wipe Your Head</h4>
            <p>In the Hanafi method, wipe your head once. You can wipe your entire head or just part of it with wet hands.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 9: Wipe Your Ears</h4>
            <p>Wipe your ears once with wet hands. You can wipe the inside and outside of your ears.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 10: Wash Your Feet</h4>
            <p>Wash your right foot up to the ankle three times. Make sure to get between your toes. Then wash your left foot the same way.</p>
          </div>
          
          <h3>Important Tips!</h3>
          <ul>
            <li>💧 Use clean water from a tap or bottle</li>
            <li>💧 Make sure to wash completely - don't miss any spots</li>
            <li>💧 Always start with your right side first, then left</li>
            <li>💧 Your Wudu stays good as long as you haven't used the bathroom or broken wind</li>
            <li>💧 If your Wudu breaks, you can do it again!</li>
          </ul>
          
          <div class="example-box">
            <h4>🌟 Did You Know?</h4>
            <p>The Prophet Muhammad (peace be upon him) taught us that doing Wudu properly is a beautiful act of worship. Even the water that drips off us as we wash is blessed!</p>
          </div>
        `,
      },
    }),
    // Unit 3: The Clothes and Place for Prayer
    prisma.unit.create({
      data: {
        courseId: prayerCourse.id,
        title: 'Clothes and Prayer Space',
        description: 'What to wear and where to pray',
        orderIndex: 2,
        content: `
          <h2>What to Wear and Where to Pray</h2>
          
          <h3>Clothes for Prayer</h3>
          <p>When we pray, we should wear clean, modest clothes that cover our body respectfully.</p>
          
          <h4>For Boys:</h4>
          <ul>
            <li>Clean shirt or T-shirt</li>
            <li>Clean pants or shorts that cover the knees</li>
            <li>You can pray barefoot or with socks/shoes</li>
          </ul>
          
          <h4>For Girls:</h4>
          <ul>
            <li>Long pants, skirt, or long dress</li>
            <li>A shirt that covers your arms and shoulders</li>
            <li>You can wear a headscarf (hijab) - it's beautiful!</li>
            <li>Clean, closed shoes or barefoot</li>
          </ul>
          
          <h3>The Prayer Space (Musallah)</h3>
          <p>You can pray almost anywhere that's clean! Here are some good places:</p>
          <ul>
            <li>🏠 Your bedroom or living room</li>
            <li>🏠 A quiet corner of your home</li>
            <li>🕌 At the mosque with your family</li>
            <li>🏫 At school if there's a prayer room</li>
            <li>🌳 Outdoors - even in a park (make sure it's clean!)</li>
          </ul>
          
          <h3>Things You Need</h3>
          <p>To pray, you will need a prayer mat (also called a rug or carpet). Here's what it does:</p>
          <ul>
            <li>✅ Keeps your clothes clean</li>
            <li>✅ Shows you where your special prayer space is</li>
            <li>✅ Makes praying more comfortable</li>
            <li>✅ Shows respect for your prayer</li>
          </ul>
          
          <h3>How to Prepare Your Prayer Space</h3>
          <ol>
            <li>Choose a clean, quiet place where you won't be disturbed</li>
            <li>Lay out your prayer mat facing the Qibla (direction of the Kaaba in Mecca)</li>
            <li>Make sure there are no distracting pictures or things behind you</li>
            <li>Turn off your phone or put it on silent</li>
            <li>Close the door if possible to avoid interruptions</li>
          </ol>
          
          <h3>Finding the Qibla Direction</h3>
          <p>We always pray facing towards Mecca, the holiest city in Islam. Here are ways to find the direction:</p>
          <ul>
            <li>📱 Use a Qibla compass app on a phone</li>
            <li>🧭 Use a physical compass</li>
            <li>👥 Ask your parents or someone at the mosque</li>
            <li>🌐 Look it up online for your city</li>
          </ul>
          
          <div class="example-box">
            <h4>🌟 Your Prayer Space is Special</h4>
            <p>When you prepare a clean, special space for prayer, you're showing Allah that you respect Him and take prayer seriously. This is beautiful!</p>
          </div>
        `,
      },
    }),
    // Unit 4: The Movements and Positions of Prayer
    prisma.unit.create({
      data: {
        courseId: prayerCourse.id,
        title: 'The Movements of Prayer',
        description: 'Learning the postures and movements in Salah (Hanafi method)',
        orderIndex: 3,
        content: `
          <h2>The Positions and Movements of Prayer</h2>
          <p>Prayer has beautiful movements that we do in order. Each movement means something special. Let's learn them step by step!</p>
          
          <h3>Position 1: Standing (Qiyam)</h3>
          <p>This is how we begin:</p>
          <ul>
            <li>Stand up straight with your feet about shoulder-width apart</li>
            <li>Face the Qibla (direction of Mecca)</li>
            <li>Keep your eyes looking at the place where you would prostrate</li>
            <li>Your arms should hang naturally at your sides</li>
            <li>Feel calm and focused on Allah</li>
          </ul>
          
          <h3>Position 2: Bowing (Ruku)</h3>
          <p>After standing, we bow:</p>
          <ul>
            <li>Lift your hands up to your ears while saying "Allahu Akbar" (Allah is Greatest)</li>
            <li>Bend forward from the waist until your back is straight and parallel to the ground</li>
            <li>Place your hands on your knees</li>
            <li>Keep your head level with your back - don't look up or down</li>
            <li>Say "Subhana Rabbiyal Atheem" (Glory be to my Lord, the Greatest) three times</li>
          </ul>
          
          <div class="example-box">
            <h4>💡 What Bowing Means</h4>
            <p>When we bow, we show Allah that we are humble and respect His greatness. We're showing that Allah is much greater than anything else!</p>
          </div>
          
          <h3>Position 3: Standing Again (Qiyam)</h3>
          <p>After bowing, we stand back up:</p>
          <ul>
            <li>Say "Samia Allahu liman Hamidah" (Allah hears those who praise Him)</li>
            <li>Lift yourself up from the bow using your hands</li>
            <li>Stand up straight again</li>
            <li>Say "Rabbana wa lakal Hamd" (Our Lord, praise be to You)</li>
          </ul>
          
          <h3>Position 4: Prostration (Sujud)</h3>
          <p>This is the most important position:</p>
          <ul>
            <li>Say "Allahu Akbar" and go down to your hands and knees</li>
            <li>Place your forehead and nose on the prayer mat</li>
            <li>Your hands should be beside your head with palms flat on the ground</li>
            <li>Your arms should not touch the ground in the Hanafi method - keep them slightly away from your body</li>
            <li>Your feet should be raised with toes pointing toward the Qibla</li>
            <li>Say "Subhana Rabbiyal Ala" (Glory be to my Lord, the Most High) three times</li>
          </ul>
          
          <div class="example-box">
            <h4>💡 What Prostration Means</h4>
            <p>Prostration is the closest we get to Allah during prayer. When we put our forehead on the ground, we're showing complete submission and love for Allah. This is the most humble position a person can do!</p>
          </div>
          
          <h3>Position 5: Sitting (Julus)</h3>
          <p>After prostration, we sit:</p>
          <ul>
            <li>Lift your head while saying "Allahu Akbar"</li>
            <li>Sit back on your heels</li>
            <li>Your hands should rest on your knees</li>
            <li>This is a moment to rest before the second prostration</li>
          </ul>
          
          <h3>Position 6: Second Prostration</h3>
          <p>We prostrate again the same way as the first prostration.</p>
          
          <h3>One Complete Unit (Rakah)</h3>
          <p>One Rakah includes:</p>
          <ol>
            <li>Standing and reading Quran</li>
            <li>Bowing once</li>
            <li>Standing again</li>
            <li>Two prostrations</li>
          </ol>
          
          <h3>Different Prayers Have Different Rakahs</h3>
          <ul>
            <li>💬 Fajr: 2 Rakahs</li>
            <li>💬 Dhuhr: 4 Rakahs</li>
            <li>💬 Asr: 4 Rakahs</li>
            <li>💬 Maghrib: 3 Rakahs</li>
            <li>💬 Isha: 4 Rakahs</li>
          </ul>
          
          <div class="activity-box">
            <h4>📝 Practice</h4>
            <p>Try to remember the movements in order: Standing → Bowing → Standing → Prostration → Sitting → Prostration. You can practice slowly to get the movements right!</p>
          </div>
        `,
      },
    }),
    // Unit 5: Step-by-Step Prayer
    prisma.unit.create({
      data: {
        courseId: prayerCourse.id,
        title: 'Praying Step-by-Step',
        description: 'A complete walkthrough of how to pray one Rakah',
        orderIndex: 4,
        content: `
          <h2>How to Pray One Complete Rakah</h2>
          <p>Let's put it all together and learn how to pray one complete unit (Rakah). Don't worry if it takes practice - everyone learns at their own pace!</p>
          
          <h3>Before You Start</h3>
          <ul>
            <li>✅ Make sure you have done Wudu</li>
            <li>✅ Choose a clean place to pray</li>
            <li>✅ Put down your prayer mat</li>
            <li>✅ Face the Qibla direction</li>
            <li>✅ Turn off any distractions</li>
          </ul>
          
          <h3>The Prayer (One Rakah)</h3>
          
          <div class="step-box">
            <h4>Step 1: Make Your Intention (Niyyah)</h4>
            <p>In your heart, say (in any language): "I intend to pray [name of prayer] for Allah."</p>
            <p>For example: "I intend to pray Dhuhr for Allah."</p>
          </div>
          
          <div class="step-box">
            <h4>Step 2: Start the Prayer</h4>
            <p>Say "Allahu Akbar" (Allah is Greatest) out loud and raise both your hands to the level of your ears.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 3: Stand and Prepare</h4>
            <p>Let your hands fall to your sides (or keep them on your chest/belly - both are fine).</p>
            <p>Look at the place where you will prostrate.</p>
            <p>Feel calm and focused.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 4: Read the Opening Chapter (Al-Fatiha)</h4>
            <p>Read Surah Al-Fatiha (the Opening Chapter of the Quran). This is REQUIRED in every prayer.</p>
            <p>Read it silently to yourself or quietly:</p>
            <p class="arabic">الحمد لله رب العالمين الرحمن الرحيم مالك يوم الدين</p>
            <p>"All praise is for Allah, Lord of all the worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment."</p>
          </div>
          
          <div class="step-box">
            <h4>Step 5: Read More from the Quran</h4>
            <p>After Al-Fatiha, read a few verses from any part of the Quran. If you're learning, you can read a short Surah like Surah Al-Ikhlas or even just a few simple verses.</p>
            <p>In the first prayer of the day (Fajr), read out loud. In other prayers, read quietly.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 6: Bow (Ruku)</h4>
            <p>Say "Allahu Akbar" and bend forward from the waist.</p>
            <p>Your back should be straight and level with the ground.</p>
            <p>Hold onto your knees with your hands.</p>
            <p>Say "Subhana Rabbiyal Atheem" (Glory be to my Lord, the Greatest) at least 3 times, slowly and thoughtfully.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 7: Stand Up Again</h4>
            <p>Say "Samia Allahu liman Hamidah" (Allah hears those who praise Him) as you stand up.</p>
            <p>Stand up straight and say "Robbana wa lakal Hamd" (Our Lord, all praise is for You).</p>
          </div>
          
          <div class="step-box">
            <h4>Step 8: First Prostration</h4>
            <p>Say "Allahu Akbar" and go down to prostration.</p>
            <p>Your forehead and nose touch the prayer mat.</p>
            <p>Keep your arms away from your body (Hanafi style).</p>
            <p>Say "Subhana Rabbiyal Ala" (Glory be to my Lord, the Most High) at least 3 times.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 9: Sit Between the Two Prostrations</h4>
            <p>Say "Allahu Akbar" and sit back on your heels.</p>
            <p>Rest briefly before the next prostration.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 10: Second Prostration</h4>
            <p>Say "Allahu Akbar" again and prostrate just like the first time.</p>
            <p>Say "Subhana Rabbiyal Ala" at least 3 times again.</p>
          </div>
          
          <div class="step-box">
            <h4>Step 11: Stand Up for the Next Rakah (if needed)</h4>
            <p>Say "Allahu Akbar" and stand up to begin the next Rakah.</p>
            <p>Repeat steps 3-10 for the next unit.</p>
          </div>
          
          <h3>Completing the Prayer (Taslim)</h3>
          <p>After your last Rakah:</p>
          <ul>
            <li>When you sit after the last prostration, sit calmly</li>
            <li>Say the Tashahhud (a special greeting)</li>
            <li>Say blessings on the Prophet Muhammad</li>
            <li>Finally, turn your head to the right and say "As-salamu alaikum wa rahmatullahi wa barakatuh" (Peace be upon you and the mercy and blessings of Allah)</li>
            <li>Then turn your head to the left and say the same greeting</li>
          </ul>
          
          <div class="activity-box">
            <h4>📝 Practice Tip</h4>
            <p>Start with practicing Fajr prayer (2 Rakahs) or Maghrib prayer (3 Rakahs) because they're shorter. Ask a family member to pray with you so you can learn together!</p>
          </div>
        `,
      },
    }),
    // Unit 6: Prayer Tips and Common Mistakes
    prisma.unit.create({
      data: {
        courseId: prayerCourse.id,
        title: 'Tips for Praying Well',
        description: 'Helpful advice and common mistakes to avoid',
        orderIndex: 5,
        content: `
          <h2>Tips for Beautiful Prayer</h2>
          <p>Here are some helpful tips to make your prayer better and more meaningful!</p>
          
          <h3>Focus and Concentration (Khushu)</h3>
          <p>The most important thing in prayer is not the perfect movements - it's your heart and mind being focused on Allah.</p>
          <ul>
            <li>🎯 Think about what you're saying</li>
            <li>🎯 Remember that you're talking to Allah</li>
            <li>🎯 Don't think about other things - if your mind wanders, gently bring it back</li>
            <li>🎯 Feel grateful to Allah during prayer</li>
            <li>🎯 Ask Allah for help in your prayer</li>
          </ul>
          
          <h3>Avoid These Common Mistakes</h3>
          
          <div class="warning-box">
            <h4>❌ Looking Around During Prayer</h4>
            <p>Keep your eyes on the place where you will prostrate. Looking around breaks your focus.</p>
          </div>
          
          <div class="warning-box">
            <h4>❌ Rushing Through the Prayer</h4>
            <p>Prayer is not a race! Take your time with each movement. Stay in each position long enough to say the Subhana at least 3 times.</p>
          </div>
          
          <div class="warning-box">
            <h4>❌ Forgetting Proper Posture</h4>
            <p>In the Hanafi method, keep your arms away from your body during prostration. Stand up straight during Qiyam. Good posture shows respect to Allah.</p>
          </div>
          
          <div class="warning-box">
            <h4>❌ Not Reading Al-Fatiha</h4>
            <p>Al-Fatiha MUST be read in every Rakah. This is very important!</p>
          </div>
          
          <h3>Questions People Ask</h3>
          
          <div class="qa-box">
            <h4>Q: What if I make a mistake during prayer?</h4>
            <p>A: Don't worry! Mistakes happen to everyone. Just continue with your prayer. If you forget part of it, you can make it up after you finish (this is called Sujud as-Sahw). Ask your parents or teacher for help.</p>
          </div>
          
          <div class="qa-box">
            <h4>Q: What if I can't remember all the Arabic words?</h4>
            <p>A: Start by learning Al-Fatiha first. You can learn the other parts slowly. Even if you can't remember the exact Arabic, you can say the Subhana in your own words, or just repeat it in Arabic a few times. Allah understands your heart.</p>
          </div>
          
          <div class="qa-box">
            <h4>Q: Can I pray if my clothes are not perfect?</h4>
            <p>A: Yes! As long as your clothes are clean and cover the necessary parts of your body, you can pray. Your sincerity matters more than perfect clothes.</p>
          </div>
          
          <div class="qa-box">
            <h4>Q: What if I get distracted during prayer?</h4>
            <p>A: This happens to everyone! When you notice your mind wandered, gently bring your focus back to Allah. Don't get upset at yourself. With practice, it gets easier to concentrate.</p>
          </div>
          
          <h3>Making Prayer a Habit</h3>
          <p>Here are ways to help you pray regularly:</p>
          <ul>
            <li>📅 Set a reminder alarm on a clock or phone</li>
            <li>👨‍👩‍👦 Pray with your family - it's more fun!</li>
            <li>📝 Keep track of your prayers on a chart</li>
            <li>🎁 Reward yourself for praying on time</li>
            <li>💪 Start with one prayer a day and add more</li>
            <li>👥 Find a friend to pray with for support</li>
          </ul>
          
          <h3>The Special Benefits of Prayer</h3>
          <p>When you pray regularly, amazing things happen:</p>
          <ul>
            <li>✨ You feel more peaceful and calm</li>
            <li>✨ You make better choices during the day</li>
            <li>✨ Allah answers your duas (prayers)</li>
            <li>✨ You build a strong connection with Allah</li>
            <li>✨ You feel part of a worldwide community of Muslims</li>
            <li>✨ You develop discipline and responsibility</li>
          </ul>
          
          <div class="example-box">
            <h4>🌟 Remember This</h4>
            <p>Every prayer is a gift from Allah. Even if you make mistakes or forget things, Allah is happy that you're trying. Keep practicing, be patient with yourself, and remember that Allah loves those who try their best! 💕</p>
          </div>
          
          <div class="activity-box">
            <h4>📝 Your Prayer Journey</h4>
            <p>Write down the time you want to start praying regularly. Maybe start with Fajr or Maghrib. Tell your parents your plan and ask them to help you remember. You've got this! 💪</p>
          </div>
        `,
      },
    }),
  ]);

  // Add questions for Prayer course
  await prisma.question.createMany({
    data: [
      // Unit 1 questions
      {
        unitId: prayerUnits[0].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many times a day do Muslims pray?',
        options: JSON.stringify([
          'Three times',
          'Four times',
          'Five times',
          'Six times',
        ]),
        correctAnswer: 'Five times',
        explanation: 'Muslims pray five times a day: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
        difficulty: 'EASY',
      },
      {
        unitId: prayerUnits[0].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which prayer is before sunrise?',
        options: JSON.stringify([
          'Dhuhr',
          'Fajr',
          'Asr',
          'Maghrib',
        ]),
        correctAnswer: 'Fajr',
        explanation: 'Fajr is the early morning prayer before sunrise.',
        difficulty: 'EASY',
      },
      {
        unitId: prayerUnits[0].id,
        type: 'TRUE_FALSE',
        questionText: 'Prayer helps us feel closer to Allah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Prayer is a direct conversation with Allah, which brings us closer to Him.',
        difficulty: 'EASY',
      },
      // Unit 2 questions
      {
        unitId: prayerUnits[1].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many times do you wash your hands during Wudu?',
        options: JSON.stringify([
          'One time',
          'Two times',
          'Three times',
          'Five times',
        ]),
        correctAnswer: 'Three times',
        explanation: 'In Wudu, each body part is washed three times for thorough cleanliness.',
        difficulty: 'EASY',
      },
      {
        unitId: prayerUnits[1].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the Hanafi method, how do you wipe your head during Wudu?',
        options: JSON.stringify([
          'Three times with wet hands',
          'Once with wet hands',
          'Five times with dry hands',
          'Only wipe the front',
        ]),
        correctAnswer: 'Once with wet hands',
        explanation: 'In the Hanafi method, you wipe the head once with wet hands.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: prayerUnits[1].id,
        type: 'TRUE_FALSE',
        questionText: 'Wudu breaks if you use the bathroom.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'If your Wudu is broken, you need to do it again before the next prayer.',
        difficulty: 'EASY',
      },
      // Unit 3 questions
      {
        unitId: prayerUnits[2].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the direction we face when praying?',
        options: JSON.stringify([
          'Towards Mecca (Qibla)',
          'Towards the sun',
          'Towards your home',
          'Any direction',
        ]),
        correctAnswer: 'Towards Mecca (Qibla)',
        explanation: 'Muslims always pray facing towards Mecca, the holiest city in Islam.',
        difficulty: 'EASY',
      },
      {
        unitId: prayerUnits[2].id,
        type: 'TRUE_FALSE',
        questionText: 'You can only pray at a mosque.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'You can pray anywhere that is clean and respectful, including at home.',
        difficulty: 'EASY',
      },
      {
        unitId: prayerUnits[2].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is a prayer mat called?',
        options: JSON.stringify([
          'Sajjadah',
          'Qibla',
          'Musallah',
          'Ruku',
        ]),
        correctAnswer: 'Sajjadah',
        explanation: 'A prayer mat is called a Sajjadah. It helps keep you clean and marks your prayer space.',
        difficulty: 'MEDIUM',
      },
      // Unit 4 questions
      {
        unitId: prayerUnits[3].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the bowing position in prayer called?',
        options: JSON.stringify([
          'Qiyam',
          'Sujud',
          'Ruku',
          'Julus',
        ]),
        correctAnswer: 'Ruku',
        explanation: 'Ruku is when we bow from the waist with our hands on our knees.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: prayerUnits[3].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does prostration (Sujud) show?',
        options: JSON.stringify([
          'We are tired',
          'Complete submission to Allah',
          'We want to sleep',
          'We are playing',
        ]),
        correctAnswer: 'Complete submission to Allah',
        explanation: 'Prostration is the most humble position where we show complete submission to Allah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: prayerUnits[3].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the Hanafi method, where are your arms during prostration?',
        options: JSON.stringify([
          'Touching the ground next to your head',
          'Slightly away from your body',
          'On your chest',
          'Behind your back',
        ]),
        correctAnswer: 'Slightly away from your body',
        explanation: 'In Hanafi school, arms are kept away from the body during prostration.',
        difficulty: 'MEDIUM',
      },
      // Unit 5 questions
      {
        unitId: prayerUnits[4].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does Niyyah mean?',
        options: JSON.stringify([
          'A greeting',
          'An intention',
          'A prayer',
          'A location',
        ]),
        correctAnswer: 'An intention',
        explanation: 'Niyyah is the intention you make in your heart to pray.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: prayerUnits[4].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which chapter of the Quran is read in every prayer?',
        options: JSON.stringify([
          'Surah Al-Ikhlas',
          'Surah Al-Fatiha',
          'Surah Ar-Rahman',
          'Surah An-Noor',
        ]),
        correctAnswer: 'Surah Al-Fatiha',
        explanation: 'Al-Fatiha (The Opening) must be recited in every unit of prayer.',
        difficulty: 'EASY',
      },
      {
        unitId: prayerUnits[4].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many units (Rakahs) does Fajr prayer have?',
        options: JSON.stringify([
          'Two',
          'Three',
          'Four',
          'Five',
        ]),
        correctAnswer: 'Two',
        explanation: 'Fajr prayer has 2 Rakahs.',
        difficulty: 'EASY',
      },
      // Unit 6 questions
      {
        unitId: prayerUnits[5].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does Khushu mean in prayer?',
        options: JSON.stringify([
          'Being fast',
          'Being loud',
          'Focus and concentration on Allah',
          'Using the right words',
        ]),
        correctAnswer: 'Focus and concentration on Allah',
        explanation: 'Khushu is the state of focus and mindfulness during prayer where your heart is present with Allah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: prayerUnits[5].id,
        type: 'TRUE_FALSE',
        questionText: 'It is okay to look around during prayer.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Looking around breaks your focus. Keep your eyes on the place of prostration.',
        difficulty: 'EASY',
      },
      {
        unitId: prayerUnits[5].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'If you make a mistake during prayer, what should you do?',
        options: JSON.stringify([
          'Stop and start over',
          'Just continue with your prayer',
          'Laugh at yourself',
          'Give up on praying',
        ]),
        correctAnswer: 'Just continue with your prayer',
        explanation: 'If you make a mistake, simply continue. You can make up for it after finishing with Sujud as-Sahw.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // Add Arabic terms for Prayer course
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: prayerUnits[0].id,
        arabicText: 'صلاة',
        transliteration: 'Salah',
        translation: 'Prayer - the formal Islamic worship performed five times daily',
      },
      {
        unitId: prayerUnits[0].id,
        arabicText: 'الفجر',
        transliteration: 'Al-Fajr',
        translation: 'The dawn/early morning prayer',
      },
      {
        unitId: prayerUnits[0].id,
        arabicText: 'الظهر',
        transliteration: 'Ad-Dhuhr',
        translation: 'The midday prayer',
      },
      {
        unitId: prayerUnits[0].id,
        arabicText: 'العصر',
        transliteration: 'Al-Asr',
        translation: 'The late afternoon prayer',
      },
      {
        unitId: prayerUnits[0].id,
        arabicText: 'المغرب',
        transliteration: 'Al-Maghrib',
        translation: 'The sunset prayer',
      },
      {
        unitId: prayerUnits[0].id,
        arabicText: 'العشاء',
        transliteration: 'Al-Isha',
        translation: 'The night prayer',
      },
      {
        unitId: prayerUnits[1].id,
        arabicText: 'وضوء',
        transliteration: 'Wudu',
        translation: 'Ritual ablution - washing specific body parts before prayer',
      },
      {
        unitId: prayerUnits[1].id,
        arabicText: 'النية',
        transliteration: 'An-Niyyah',
        translation: 'Intention - the sincere purpose in your heart',
      },
      {
        unitId: prayerUnits[2].id,
        arabicText: 'القبلة',
        transliteration: 'Al-Qibla',
        translation: 'The direction of prayer - towards the Kaaba in Mecca',
      },
      {
        unitId: prayerUnits[2].id,
        arabicText: 'المصلى',
        transliteration: 'Al-Musallah',
        translation: 'The prayer space or area',
      },
      {
        unitId: prayerUnits[2].id,
        arabicText: 'سجادة',
        transliteration: 'Sajjadah',
        translation: 'Prayer mat or rug used during prayer',
      },
      {
        unitId: prayerUnits[3].id,
        arabicText: 'قيام',
        transliteration: 'Qiyam',
        translation: 'Standing position in prayer',
      },
      {
        unitId: prayerUnits[3].id,
        arabicText: 'ركوع',
        transliteration: 'Ruku',
        translation: 'Bowing position where we bend from the waist',
      },
      {
        unitId: prayerUnits[3].id,
        arabicText: 'سجود',
        transliteration: 'Sujud',
        translation: 'Prostration - the most humble position facing the ground',
      },
      {
        unitId: prayerUnits[3].id,
        arabicText: 'جلوس',
        transliteration: 'Julus',
        translation: 'Sitting position between the two prostrations',
      },
      {
        unitId: prayerUnits[3].id,
        arabicText: 'ركعة',
        transliteration: 'Rakah',
        translation: 'One complete unit of prayer',
      },
      {
        unitId: prayerUnits[4].id,
        arabicText: 'الفاتحة',
        transliteration: 'Al-Fatiha',
        translation: 'The Opening Chapter of the Quran - recited in every prayer',
      },
      {
        unitId: prayerUnits[4].id,
        arabicText: 'التشهد',
        transliteration: 'At-Tashahhud',
        translation: 'The greeting recited at the end of prayer',
      },
      {
        unitId: prayerUnits[4].id,
        arabicText: 'التسليم',
        transliteration: 'At-Taslim',
        translation: 'The final greeting to end prayer',
      },
      {
        unitId: prayerUnits[5].id,
        arabicText: 'خشوع',
        transliteration: 'Khushu',
        translation: 'Focus, concentration, and mindfulness directed towards Allah during prayer',
      },
      {
        unitId: prayerUnits[5].id,
        arabicText: 'سجود السهو',
        transliteration: 'Sujud as-Sahw',
        translation: 'Prostration of forgetfulness to correct mistakes in prayer',
      },
    ],
  });

  console.log('✅ Created Prayer (Salah) course with', prayerUnits.length, 'units');

  // Collect all courses
  const courses = [tawheedCourse, prophetsCourse, arabicCourse, pillarsCourse, duasCourse, prayerCourse];
  console.log('✅ Created', courses.length, 'courses total');


  // Get all units for enrollments and progress
  const allUnits = await prisma.unit.findMany({
    include: { course: true },
    orderBy: [{ courseId: 'asc' }, { orderIndex: 'asc' }],
  });

  // Enroll family members in courses with progress
  console.log('📝 Creating enrollments for family members...');
  
  const ahmed = demoMembers[0];
  const fatima = demoMembers[1];
  const yusuf = demoMembers[2];

  // Ahmed's enrollments (older child, more courses)
  const ahmedEnrollments = await Promise.all([
    prisma.courseEnrollment.create({
      data: {
        memberId: ahmed.id,
        courseId: tawheedCourse.id,
        status: 'ACTIVE',
        progress: 67,
      },
    }),
    prisma.courseEnrollment.create({
      data: {
        memberId: ahmed.id,
        courseId: prophetsCourse.id,
        status: 'ACTIVE',
        progress: 40,
      },
    }),
    prisma.courseEnrollment.create({
      data: {
        memberId: ahmed.id,
        courseId: arabicCourse.id,
        status: 'ACTIVE',
        progress: 33,
      },
    }),
    prisma.courseEnrollment.create({
      data: {
        memberId: ahmed.id,
        courseId: pillarsCourse.id,
        status: 'ACTIVE',
        progress: 20,
      },
    }),
  ]);
  console.log('✅ Ahmed enrolled in', ahmedEnrollments.length, 'courses');

  // Fatima's enrollments (younger child)
  const fatimaEnrollments = await Promise.all([
    prisma.courseEnrollment.create({
      data: {
        memberId: fatima.id,
        courseId: prophetsCourse.id,
        status: 'ACTIVE',
        progress: 60,
      },
    }),
    prisma.courseEnrollment.create({
      data: {
        memberId: fatima.id,
        courseId: duasCourse.id,
        status: 'ACTIVE',
        progress: 100,
      },
    }),
    prisma.courseEnrollment.create({
      data: {
        memberId: fatima.id,
        courseId: arabicCourse.id,
        status: 'ACTIVE',
        progress: 33,
      },
    }),
  ]);
  console.log('✅ Fatima enrolled in', fatimaEnrollments.length, 'courses');

  // Yusuf's enrollments (youngest)
  const yusufEnrollments = await Promise.all([
    prisma.courseEnrollment.create({
      data: {
        memberId: yusuf.id,
        courseId: duasCourse.id,
        status: 'ACTIVE',
        progress: 33,
      },
    }),
    prisma.courseEnrollment.create({
      data: {
        memberId: yusuf.id,
        courseId: prophetsCourse.id,
        status: 'ACTIVE',
        progress: 20,
      },
    }),
  ]);
  console.log('✅ Yusuf enrolled in', yusufEnrollments.length, 'courses');

  // Create unit progress for members
  console.log('📊 Creating unit progress records...');

  // Ahmed's progress on Tawheed course (completed 2 of 3 units)
  const tawheedUnitsForProgress = allUnits.filter(u => u.courseId === tawheedCourse.id);
  
  // Get Ahmed's Tawheed enrollment
  const ahmedTawheedEnrollment = ahmedEnrollments.find(e => e.courseId === tawheedCourse.id);
  if (ahmedTawheedEnrollment) {
    await prisma.unitProgress.createMany({
      data: [
        {
          enrollmentId: ahmedTawheedEnrollment.id,
          unitId: tawheedUnitsForProgress[0].id,
          videoCompleted: true,
          readingCompleted: true,
          quizCompleted: true,
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          quizScore: 100,
        },
        {
          enrollmentId: ahmedTawheedEnrollment.id,
          unitId: tawheedUnitsForProgress[1].id,
          videoCompleted: true,
          readingCompleted: true,
          quizCompleted: true,
          completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          quizScore: 80,
        },
      ],
    });
  }

  // Fatima's progress on Duas course (completed all units)
  const duasUnitsForProgress = allUnits.filter(u => u.courseId === duasCourse.id);
  const fatimaDuasEnrollment = fatimaEnrollments.find(e => e.courseId === duasCourse.id);
  if (fatimaDuasEnrollment) {
    await prisma.unitProgress.createMany({
      data: duasUnitsForProgress.map((unit, index) => ({
        enrollmentId: fatimaDuasEnrollment.id,
        unitId: unit.id,
        videoCompleted: true,
        readingCompleted: true,
        quizCompleted: true,
        completedAt: new Date(Date.now() - (10 - index) * 24 * 60 * 60 * 1000),
        quizScore: 90 + Math.floor(Math.random() * 11),
      })),
    });
  }
  console.log('✅ Created unit progress records');

  // Create achievements for family members
  console.log('🏆 Creating achievements...');
  
  await prisma.achievement.createMany({
    data: [
      // Ahmed's achievements
      {
        memberId: ahmed.id,
        type: 'STREAK',
        name: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
      },
      {
        memberId: ahmed.id,
        type: 'FIRST_LESSON',
        name: 'First Steps',
        description: 'Completed your first lesson',
      },
      {
        memberId: ahmed.id,
        type: 'COURSE_COMPLETE',
        name: 'Knowledge Seeker',
        description: 'Completed 5 lessons',
      },
      {
        memberId: ahmed.id,
        type: 'PERFECT_SCORE',
        name: 'Perfect Score',
        description: 'Got 100% on a quiz',
      },
      // Fatima's achievements
      {
        memberId: fatima.id,
        type: 'FIRST_LESSON',
        name: 'First Steps',
        description: 'Completed your first lesson',
      },
      {
        memberId: fatima.id,
        type: 'COURSE_COMPLETE',
        name: 'Course Champion',
        description: 'Completed an entire course',
      },
      {
        memberId: fatima.id,
        type: 'STREAK',
        name: 'Three-Day Streak',
        description: 'Maintained a 3-day learning streak',
      },
      // Yusuf's achievements
      {
        memberId: yusuf.id,
        type: 'FIRST_LESSON',
        name: 'First Steps',
        description: 'Completed your first lesson',
      },
    ],
  });
  console.log('✅ Created achievements for all family members');

  // Create memorization items for SRS system
  console.log('📚 Creating memorization items for SRS...');
  
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  await prisma.memorizationItem.createMany({
    data: [
      // Ahmed's memorization items - variety of states
      {
        memberId: ahmed.id,
        type: 'TERM',
        front: 'What is the meaning of "Tawheed"?',
        back: 'The oneness and uniqueness of Allah - the fundamental concept in Islamic theology.',
        arabicText: 'توحيد',
        transliteration: 'Taw-heed',
        interval: 7,
        easeFactor: 2.6,
        repetitions: 4,
        nextReviewDate: tomorrow,
      },
      {
        memberId: ahmed.id,
        type: 'DUA',
        front: 'What dua do we say before eating?',
        back: 'Bismillah (In the name of Allah)',
        arabicText: 'بِسْمِ اللَّهِ',
        transliteration: 'Bis-mil-lah',
        interval: 1,
        easeFactor: 2.5,
        repetitions: 1,
        nextReviewDate: today, // Due today
      },
      {
        memberId: ahmed.id,
        type: 'TERM',
        front: 'What does "Salah" mean?',
        back: 'The Islamic prayer performed five times daily - one of the five pillars of Islam.',
        arabicText: 'صلاة',
        transliteration: 'Sa-lah',
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: yesterday, // Overdue
      },
      {
        memberId: ahmed.id,
        type: 'TERM',
        front: 'What does "Zakat" mean?',
        back: 'Obligatory charity - 2.5% of wealth given annually to those in need.',
        arabicText: 'زكاة',
        transliteration: 'Za-kat',
        interval: 3,
        easeFactor: 2.5,
        repetitions: 2,
        nextReviewDate: today, // Due today
      },
      {
        memberId: ahmed.id,
        type: 'AYAH',
        front: 'What is the first verse of Surah Al-Fatiha?',
        back: 'All praise is due to Allah, Lord of the worlds.',
        arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Al-hamdu lillahi Rabbil-aalameen',
        interval: 14,
        easeFactor: 2.8,
        repetitions: 5,
        nextReviewDate: nextWeek,
      },
      {
        memberId: ahmed.id,
        type: 'DUA',
        front: 'Dua when entering the masjid',
        back: 'O Allah, open for me the doors of Your mercy.',
        arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        transliteration: 'Allahumma aftah li abwaba rahmatik',
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: today, // Due today (new item)
      },
      // Fatima's memorization items
      {
        memberId: fatima.id,
        type: 'DUA',
        front: 'What dua do we say after eating?',
        back: 'Alhamdulillah (All praise is due to Allah)',
        arabicText: 'الْحَمْدُ لِلَّهِ',
        transliteration: 'Al-ham-du lil-lah',
        interval: 3,
        easeFactor: 2.6,
        repetitions: 2,
        nextReviewDate: today, // Due today
      },
      {
        memberId: fatima.id,
        type: 'DUA',
        front: 'What do we say when we see something beautiful?',
        back: 'Masha Allah (What Allah has willed)',
        arabicText: 'مَاشَاءَ اللَّهُ',
        transliteration: 'Ma-sha-Allah',
        interval: 7,
        easeFactor: 2.7,
        repetitions: 3,
        nextReviewDate: tomorrow,
      },
      {
        memberId: fatima.id,
        type: 'DUA',
        front: 'What do we say when talking about the future?',
        back: 'In Sha Allah (If Allah wills)',
        arabicText: 'إِنْ شَاءَ اللَّهُ',
        transliteration: 'In sha Allah',
        interval: 5,
        easeFactor: 2.6,
        repetitions: 3,
        nextReviewDate: today, // Due today
      },
      {
        memberId: fatima.id,
        type: 'TERM',
        front: 'What is the name of the Islamic greeting?',
        back: 'Assalamu Alaikum (Peace be upon you)',
        arabicText: 'السَّلَامُ عَلَيْكُمْ',
        transliteration: 'As-sa-la-mu a-lay-kum',
        interval: 14,
        easeFactor: 2.8,
        repetitions: 5,
        nextReviewDate: nextWeek,
      },
      // Yusuf's memorization items (simpler, for younger child)
      {
        memberId: yusuf.id,
        type: 'DUA',
        front: 'What do we say before starting anything?',
        back: 'Bismillah (In the name of Allah)',
        arabicText: 'بِسْمِ اللَّهِ',
        transliteration: 'Bis-mil-lah',
        interval: 1,
        easeFactor: 2.5,
        repetitions: 1,
        nextReviewDate: today, // Due today
      },
      {
        memberId: yusuf.id,
        type: 'DUA',
        front: 'What do we say to thank Allah?',
        back: 'Alhamdulillah (Praise be to Allah)',
        arabicText: 'الْحَمْدُ لِلَّهِ',
        transliteration: 'Al-ham-du lil-lah',
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: yesterday, // Overdue (for demo)
      },
    ],
  });
  console.log('✅ Created memorization items for SRS');

  // Maktab Coursebooks
  await seedMaktabFoundation1();
  await seedMaktabFoundation2();
  await seedMaktabCoursebook1();
  await seedMaktabCoursebook2();
  await seedMaktabCoursebook3();
  await seedMaktabCoursebook4();
  await seedMaktabCoursebook5();
  await seedMaktabCoursebook6Boys();
  await seedMaktabCoursebook6Girls();
  await seedMaktabCoursebook7();
  await seedMaktabCoursebook8();
  await seedMaktabFurtherStudiesNW();

  // Advanced Fiqh Courses
  await seedQuduriTaharah();
  await seedQuduriSalah();

  // Additional Courses
  await seedTazkiyahCourse();
  await seedHabitsCourse();
  await seedRawaiHadaratinaCourse();
  await seedHujjatullahCourse();

  // Quran Memorization
  await seedQuranMemorizationCourse();
  await seedQuranLongerSurahs();

  // Advanced Sarf (Arabic Morphology) — sequential parts
  await seedSarfCourse();
  await seedSarfCoursePart2();
  await seedSarfCoursePart3();
  await seedSarfCoursePart4();
  await seedSarfCoursePart5();
  await seedSarfQuizzes();
  await seedSarfFlashcards();
  await seedMasaarCourse();
  await seedMasaarQuizzes();
  await seedMasaarFlashcards();
  await seedMasaarTerms();

  const contentFormattingResult = await syncCourseTextFormatting(prisma);
  console.log(`✅ Normalized Arabic term formatting in ${contentFormattingResult.updatedUnits} unit(s)`);
  if (contentFormattingResult.invalidatedAudioEntries > 0) {
    console.log(`   - Invalidated ${contentFormattingResult.invalidatedAudioEntries} audio cache entr${contentFormattingResult.invalidatedAudioEntries === 1 ? 'y' : 'ies'}`);
  }

  // Games — must run after courses exist
  await seedGames();

  // Weekend path tagging — post-processing step, must run after all content seeds
  await seedWeekendPathTags();

  console.log('');
  console.log('🎉 Database seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Demo Family (The Ahmad Family)');
  console.log('   - 1 Parent User (demo@example.com)');
  console.log('   - 3 Family Members (Ahmed, Fatima, Yusuf)');
  console.log('   - 27 Seed files loaded (Maktab CB1-8, CB6B/6G, Further Studies, Quduri,');
  console.log('     Tazkiyah, Habits, Rawai Hadaratina, Hujjatullah, Quran Memorization,');
  console.log('     Sarf Parts 1-5 + Quizzes + Flashcards, Masaar Course + Quizzes + Terms)');
  console.log('   - All courses with units, quizzes, flashcards, and Arabic terms');
  console.log('   - Multiple enrollments per member');
  console.log('   - Unit progress records');
  console.log('   - Achievement badges');
  console.log('   - SRS memorization items (some due today!)');
  console.log('   - Game templates, games, and badge definitions');
  console.log('');
  console.log('📧 Demo login credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
