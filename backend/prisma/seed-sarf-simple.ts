import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Advanced Sarf (Arabic Morphology) Course Seed
 * Comprehensive study of verb forms and weak verbs for advanced students
 */

async function seedSarfCourse() {
  console.log('📚 Seeding Advanced Sarf course...');
  console.log('');

  // Find demo family (must exist from main seed)
  const demoFamily = await prisma.family.findFirst({
    where: { name: 'Ahmad Family' },
  });

  if (!demoFamily) {
    console.log('⚠️  Demo family not found. Please run main seed first: npm run db:seed');
    return;
  }

  console.log('✅ Found demo family:', demoFamily.name);

  // Check if Sarf course already exists
  const existingCourse = await prisma.course.findFirst({
    where: { title: 'Advanced Sarf - Arabic Morphology' },
  });

  if (existingCourse) {
    console.log('⚠️  Sarf course already exists. Deleting old version...');
    await prisma.course.delete({ where: { id: existingCourse.id } });
  }

  // Create the Sarf course
  const sarfCourse = await prisma.course.create({
    data: {
      title: 'Advanced Sarf - Arabic Morphology',
      description: 'A comprehensive study of Arabic morphology (Sarf) covering all ten verb forms (awzan), weak letter rules (حروف العلة), and conjugation patterns. Designed for alimiyyah students seeking mastery of Arabic morphology.',
      category: 'ARABIC',
      ageLevels: ['TEEN', 'ADULT'],
      isPublished: true,
    },
  });

  console.log('✅ Created Sarf course:', sarfCourse.title);

  // Unit 1: Introduction to Sarf
  await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Introduction to Sarf & The Trilateral Root System',
      description: 'Understanding the foundation of Arabic morphology and the three-letter root system (الجذر الثلاثي)',
      orderIndex: 1,
      content: `
        <h2>What is Sarf (علم الصرف)?</h2>
        <p>Sarf is the science of Arabic morphology that studies the internal structure and changes of words. It is essential for understanding the Quran, Hadith, and classical Arabic texts.</p>

        <div class="important-box">
          <h3>The Importance of Sarf</h3>
          <p>The scholars say: <strong>"الصرف أم العلوم"</strong> - "Sarf is the mother of sciences." Without it, one cannot properly understand Arabic grammar (Nahw) or derive correct meanings from texts.</p>
          <p><strong>"من أراد أن يفهم القرآن فليتقن الصرف"</strong> - "Whoever wants to understand the Quran, let him master Sarf."</p>
        </div>

        <h3>The Morphological Scale (الميزان الصرفي)</h3>
        <p>Arabic uses the root <strong>فَعَلَ</strong> (fa'ala) as a morphological scale to analyze word patterns:</p>
        <ul>
          <li><strong>ف</strong> (fā') = First radical letter (فاء الكلمة)</li>
          <li><strong>ع</strong> ('ayn) = Second radical letter (عين الكلمة)</li>
          <li><strong>ل</strong> (lām) = Third radical letter (لام الكلمة)</li>
        </ul>

        <div class="example-box">
          <h4>Examples of Root Analysis:</h4>
          <table>
            <tr><th>Word</th><th>Root</th><th>Scale</th><th>Meaning</th></tr>
            <tr><td>كَتَبَ</td><td>ك-ت-ب</td><td>فَعَلَ</td><td>He wrote</td></tr>
            <tr><td>دَرَسَ</td><td>د-ر-س</td><td>فَعَلَ</td><td>He studied</td></tr>
            <tr><td>نَصَرَ</td><td>ن-ص-ر</td><td>فَعَلَ</td><td>He helped</td></tr>
          </table>
        </div>

        <h3>Added Letters (الحروف الزائدة)</h3>
        <p>Arabic words consist of root letters plus added letters. The added letters can be remembered with the mnemonic: <strong>سَأَلْتُمُونِيهَا</strong> (sa'altumūnīhā - "You asked me about it")</p>

        <h3>Types of Verbs by Root Strength</h3>
        <ul>
          <li><strong>Ṣaḥīḥ (صحيح)</strong> - Sound verb: All three radicals are strong consonants (e.g., كَتَبَ)</li>
          <li><strong>Mu'tall (معتل)</strong> - Weak verb: Contains one or more weak letters (و، ي، or ا) as radicals</li>
        </ul>

        <div class="activity-box">
          <h4>Practice Exercise:</h4>
          <p>Identify the root letters of these words:</p>
          <ol>
            <li>ضَرَبَ (to strike)</li>
            <li>فَتَحَ (to open)</li>
            <li>شَرِبَ (to drink)</li>
          </ol>
        </div>
      `,
    },
  });

  // Unit 2: Verb Forms I-V
  await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Verb Forms I-V: Foundational Patterns',
      description: 'Understanding the first five verb forms (الأوزان) with their meanings and semantic nuances',
      orderIndex: 2,
      content: `
        <h2>The Ten Verb Forms (الأوزان العشرة)</h2>
        <p>Arabic verbs are organized into ten forms, each with distinct meanings and patterns. We'll start with Forms I through V.</p>

        <h3>Form I: فَعَلَ (The Base Form)</h3>
        <p><strong>Pattern:</strong> فَعَلَ / يَفْعُلُ or يَفْعِلُ or يَفْعَلُ</p>
        <p><strong>Meaning:</strong> Basic action without additional semantic layers</p>
        
        <div class="example-box">
          <h4>Form I Examples:</h4>
          <ul>
            <li>كَتَبَ - يَكْتُبُ (kataba - yaktubu): to write</li>
            <li>نَصَرَ - يَنْصُرُ (naṣara - yanṣuru): to help</li>
            <li>ضَرَبَ - يَضْرِبُ (ḍaraba - yaḍribu): to strike</li>
          </ul>
        </div>

        <h3>Form II: فَعَّلَ (Intensification)</h3>
        <p><strong>Pattern:</strong> فَعَّلَ / يُفَعِّلُ (doubling the middle radical)</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li>Intensification or repetition of the action</li>
          <li>Causation (making someone/something do the action)</li>
          <li>Declaration (deeming someone/something)</li>
        </ul>

        <div class="example-box">
          <h4>Form II Examples:</h4>
          <table>
            <tr><th>Form II</th><th>Form I</th><th>Meaning Comparison</th></tr>
            <tr><td>كَسَّرَ</td><td>كَسَرَ</td><td>to shatter (intensive) vs. to break</td></tr>
            <tr><td>عَلَّمَ</td><td>عَلِمَ</td><td>to teach (causative) vs. to know</td></tr>
            <tr><td>كَبَّرَ</td><td>كَبُرَ</td><td>to magnify vs. to be great</td></tr>
          </table>
        </div>

        <div class="quran-box">
          <h4>Quranic Example:</h4>
          <p><strong>عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ</strong></p>
          <p>"He taught (عَلَّمَ - Form II) man that which he knew not" (Surah Al-'Alaq 96:5)</p>
        </div>

        <h3>Form III: فَاعَلَ (Reciprocity)</h3>
        <p><strong>Pattern:</strong> فَاعَلَ / يُفَاعِلُ (alif after first radical)</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li>Reciprocal action (doing with someone)</li>
          <li>Attempting or trying to do</li>
        </ul>

        <div class="example-box">
          <h4>Form III Examples:</h4>
          <ul>
            <li>قَاتَلَ (qātala): to fight with (reciprocal of قَتَلَ - to kill)</li>
            <li>جَاهَدَ (jāhada): to strive with/against</li>
            <li>سَابَقَ (sābaqa): to compete/race with</li>
          </ul>
        </div>

        <h3>Form IV: أَفْعَلَ (Causation)</h3>
        <p><strong>Pattern:</strong> أَفْعَلَ / يُفْعِلُ (hamza at beginning)</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li>Causation (making something happen)</li>
          <li>Entry into a time or place</li>
        </ul>

        <div class="example-box">
          <h4>Form IV Examples:</h4>
          <table>
            <tr><th>Form IV</th><th>Form I</th><th>Meaning</th></tr>
            <tr><td>أَنْزَلَ</td><td>نَزَلَ</td><td>to send down (causative)</td></tr>
            <tr><td>أَخْرَجَ</td><td>خَرَجَ</td><td>to bring out (causative)</td></tr>
            <tr><td>أَصْبَحَ</td><td>صَبَحَ</td><td>to enter morning</td></tr>
          </table>
        </div>

        <h3>Form V: تَفَعَّلَ (Reflexive)</h3>
        <p><strong>Pattern:</strong> تَفَعَّلَ / يَتَفَعَّلُ (تـ prefix + doubling)</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li>Reflexive of Form II (doing to oneself)</li>
          <li>Pretending or affecting</li>
          <li>Gradual acquisition</li>
        </ul>

        <div class="example-box">
          <h4>Form V Examples:</h4>
          <ul>
            <li>تَعَلَّمَ (ta'allama): to learn (reflexive of عَلَّمَ - to teach)</li>
            <li>تَكَبَّرَ (takabbara): to act arrogantly</li>
            <li>تَكَلَّمَ (takallama): to speak (gradual)</li>
          </ul>
        </div>

        <div class="activity-box">
          <h4>Practice: Identify the Form</h4>
          <p>What form are these verbs, and what do they mean?</p>
          <ol>
            <li>قَرَّبَ</li>
            <li>نَادَى</li>
            <li>أَحْسَنَ</li>
            <li>تَصَدَّقَ</li>
          </ol>
        </div>
      `,
    },
  });

  // Unit 3: Verb Forms VI-X
  await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Verb Forms VI-X: Advanced Patterns',
      description: 'Mastering the higher verb forms with specialized meanings',
      orderIndex: 3,
      content: `
        <h2>Advanced Verb Forms (VI-X)</h2>

        <h3>Form VI: تَفَاعَلَ (Mutual Action)</h3>
        <p><strong>Pattern:</strong> تَفَاعَلَ / يَتَفَاعَلُ</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li>Mutual/reciprocal action (doing together)</li>
          <li>Pretending (doing as if)</li>
        </ul>

        <div class="example-box">
          <h4>Form VI Examples:</h4>
          <ul>
            <li>تَقَاتَلَ (taqātala): to fight one another (from قَاتَلَ)</li>
            <li>تَعَاوَنَ (ta'āwana): to cooperate with each other</li>
            <li>تَجَاهَلَ (tajāhala): to feign ignorance</li>
          </ul>
        </div>

        <h3>Form VII: انْفَعَلَ (Passive/Reflexive)</h3>
        <p><strong>Pattern:</strong> انْفَعَلَ / يَنْفَعِلُ</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li>Passive or reflexive of Form I</li>
          <li>Submission to an action</li>
        </ul>

        <div class="example-box">
          <h4>Form VII Examples:</h4>
          <ul>
            <li>انْكَسَرَ (inkasara): to be broken (passive of كَسَرَ)</li>
            <li>انْفَتَحَ (infataḥa): to be opened</li>
            <li>انْقَطَعَ (inqaṭa'a): to be cut off</li>
          </ul>
        </div>

        <h3>Form VIII: افْتَعَلَ (Reflexive/Acquisition)</h3>
        <p><strong>Pattern:</strong> افْتَعَلَ / يَفْتَعِلُ</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li>Reflexive action</li>
          <li>Acquisition or seeking for oneself</li>
        </ul>

        <div class="example-box">
          <h4>Form VIII Examples:</h4>
          <ul>
            <li>اجْتَمَعَ (ijtama'a): to gather together</li>
            <li>اكْتَسَبَ (iktasaba): to earn for oneself</li>
            <li>اسْتَمَعَ (istama'a): to listen attentively</li>
          </ul>
        </div>

        <h3>Form IX: افْعَلَّ (Colors & Defects)</h3>
        <p><strong>Pattern:</strong> افْعَلَّ / يَفْعَلُّ (doubling the last radical)</p>
        <p><strong>Meaning:</strong> Acquiring a color or physical characteristic</p>

        <div class="example-box">
          <h4>Form IX Examples (Rare):</h4>
          <ul>
            <li>احْمَرَّ (iḥmarra): to become/turn red</li>
            <li>اصْفَرَّ (iṣfarra): to become yellow</li>
            <li>اعْوَجَّ (i'wajja): to become crooked</li>
          </ul>
        </div>

        <h3>Form X: اسْتَفْعَلَ (Seeking/Requesting)</h3>
        <p><strong>Pattern:</strong> اسْتَفْعَلَ / يَسْتَفْعِلُ</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li>Seeking or requesting</li>
          <li>Considering or deeming</li>
          <li>Transformation</li>
        </ul>

        <div class="example-box">
          <h4>Form X Examples:</h4>
          <ul>
            <li>اسْتَغْفَرَ (istaghfara): to seek forgiveness (from غَفَرَ)</li>
            <li>اسْتَعْمَلَ (ista'mala): to use/employ</li>
            <li>اسْتَحْسَنَ (istaḥsana): to deem good</li>
          </ul>
        </div>

        <div class="quran-box">
          <h4>Quranic Example of Form X:</h4>
          <p><strong>وَاسْتَغْفِرُوا رَبَّكُمْ</strong></p>
          <p>"And seek forgiveness (اسْتَغْفِرُوا) of your Lord" (Hud 11:52)</p>
        </div>

        <h3>Complete Summary Table</h3>
        <table>
          <tr><th>Form</th><th>Pattern</th><th>Primary Meaning</th><th>Example</th></tr>
          <tr><td>I</td><td>فَعَلَ</td><td>Basic action</td><td>كَتَبَ (wrote)</td></tr>
          <tr><td>II</td><td>فَعَّلَ</td><td>Intensification/Causation</td><td>عَلَّمَ (taught)</td></tr>
          <tr><td>III</td><td>فَاعَلَ</td><td>Reciprocity</td><td>قَاتَلَ (fought with)</td></tr>
          <tr><td>IV</td><td>أَفْعَلَ</td><td>Causation</td><td>أَنْزَلَ (sent down)</td></tr>
          <tr><td>V</td><td>تَفَعَّلَ</td><td>Reflexive</td><td>تَعَلَّمَ (learned)</td></tr>
          <tr><td>VI</td><td>تَفَاعَلَ</td><td>Mutual action</td><td>تَقَاتَلَ (fought each other)</td></tr>
          <tr><td>VII</td><td>انْفَعَلَ</td><td>Passive</td><td>انْكَسَرَ (was broken)</td></tr>
          <tr><td>VIII</td><td>افْتَعَلَ</td><td>Reflexive/Acquisition</td><td>اجْتَمَعَ (gathered)</td></tr>
          <tr><td>IX</td><td>افْعَلَّ</td><td>Colors/Defects</td><td>احْمَرَّ (turned red)</td></tr>
          <tr><td>X</td><td>اسْتَفْعَلَ</td><td>Seeking</td><td>اسْتَغْفَرَ (sought forgiveness)</td></tr>
        </table>
      `,
    },
  });

  // Unit 4: Weak Verbs Overview & Mithal
  await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Weak Verbs: Mithal (First Radical Weak)',
      description: 'Understanding verbs with و or ي as the first radical (المثال)',
      orderIndex: 4,
      content: `
        <h2>Introduction to Weak Verbs (الأفعال المعتلة)</h2>
        <p>Weak verbs contain one or more "weak letters" (حروف العلة): و، ي، or ا as radical consonants. These letters often undergo changes in conjugation.</p>

        <h3>Four Types of Weak Verbs:</h3>
        <ol>
          <li><strong>Mithal (المثال)</strong> - 1st radical is weak</li>
          <li><strong>Ajwaf (الأجوف)</strong> - 2nd radical is weak</li>
          <li><strong>Nāqiṣ (الناقص)</strong> - 3rd radical is weak</li>
          <li><strong>Lafīf (اللفيف)</strong> - Two radicals are weak</li>
        </ol>

        <h2>Mithal Verbs (المثال)</h2>
        <p>Mithal verbs have و or ي as the <strong>first radical</strong> (فاء الكلمة).</p>

        <div class="important-box">
          <h3>Key Rule for Mithal Verbs</h3>
          <p>In Form I present tense, if the middle vowel is kasra (ِ), the initial و usually <strong>drops</strong>.</p>
          <p>Example: وَعَدَ → يَوْعِدُ → <strong>يَعِدُ</strong> (the و drops)</p>
        </div>

        <h3>Common Mithal Verbs:</h3>
        <div class="example-box">
          <table>
            <tr><th>Past</th><th>Present</th><th>Meaning</th></tr>
            <tr><td>وَعَدَ</td><td>يَعِدُ</td><td>to promise</td></tr>
            <tr><td>وَجَدَ</td><td>يَجِدُ</td><td>to find</td></tr>
            <tr><td>وَصَلَ</td><td>يَصِلُ</td><td>to arrive/connect</td></tr>
            <tr><td>وَقَفَ</td><td>يَقِفُ</td><td>to stand</td></tr>
          </table>
        </div>

        <h3>Full Conjugation: وَعَدَ (to promise)</h3>
        <h4>Past Tense:</h4>
        <table>
          <tr><th>Pronoun</th><th>Arabic</th><th>Transliteration</th></tr>
          <tr><td>He</td><td>وَعَدَ</td><td>wa'ada</td></tr>
          <tr><td>She</td><td>وَعَدَتْ</td><td>wa'adat</td></tr>
          <tr><td>You (m)</td><td>وَعَدْتَ</td><td>wa'adta</td></tr>
          <tr><td>I</td><td>وَعَدْتُ</td><td>wa'adtu</td></tr>
        </table>

        <h4>Present Tense:</h4>
        <table>
          <tr><th>Pronoun</th><th>Arabic</th><th>Transliteration</th></tr>
          <tr><td>He</td><td>يَعِدُ</td><td>ya'idu</td></tr>
          <tr><td>She</td><td>تَعِدُ</td><td>ta'idu</td></tr>
          <tr><td>You (m)</td><td>تَعِدُ</td><td>ta'idu</td></tr>
          <tr><td>I</td><td>أَعِدُ</td><td>a'idu</td></tr>
        </table>

        <h4>Command:</h4>
        <ul>
          <li>أنتَ: <strong>عِدْ</strong> (ِid)</li>
          <li>أنتِ: <strong>عِدِي</strong> ('idī)</li>
        </ul>

        <h3>Mithal Verbs in Higher Forms</h3>
        <p>In Forms II-X, the initial و usually <strong>remains</strong>:</p>
        <div class="example-box">
          <ul>
            <li>Form II: وَصَّلَ (waṣṣala) - to connect repeatedly</li>
            <li>Form IV: أَوْصَلَ (awṣala) - to cause to arrive</li>
            <li>Form VIII: اتَّصَلَ (ittaṣala) - to be connected</li>
          </ul>
        </div>

        <div class="activity-box">
          <h4>Practice Exercise:</h4>
          <p>Conjugate وَجَدَ (to find) for:</p>
          <ol>
            <li>Present tense, "he"</li>
            <li>Present tense, "I"</li>
            <li>Command, "you (m)"</li>
          </ol>
        </div>
      `,
    },
  });

  // Unit 5: Ajwaf Verbs
  await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Weak Verbs: Ajwaf (Middle Radical Weak)',
      description: 'Understanding hollow verbs with و or ي as the second radical (الأجوف)',
      orderIndex: 5,
      content: `
        <h2>Ajwaf Verbs (الأجوف - Hollow Verbs)</h2>
        <p>Ajwaf verbs have و or ي as the <strong>middle radical</strong> (عين الكلمة). These are called "hollow" because the middle weak letter often transforms or disappears.</p>

        <div class="important-box">
          <h3>Key Transformation Rules:</h3>
          <ol>
            <li>In past tense: و between two fathas → <strong>ا</strong> (alif)</li>
            <li>In present tense: The middle creates a long vowel (ū or ī)</li>
            <li>In command: The middle weak letter often drops</li>
          </ol>
        </div>

        <h3>Common Ajwaf Verbs:</h3>
        <div class="example-box">
          <table>
            <tr><th>Root</th><th>Past</th><th>Present</th><th>Meaning</th></tr>
            <tr><td>ق-و-ل</td><td>قَالَ</td><td>يَقُولُ</td><td>to say</td></tr>
            <tr><td>ق-و-م</td><td>قَامَ</td><td>يَقُومُ</td><td>to stand up</td></tr>
            <tr><td>ص-و-م</td><td>صَامَ</td><td>يَصُومُ</td><td>to fast</td></tr>
            <tr><td>ب-ي-ع</td><td>بَاعَ</td><td>يَبِيعُ</td><td>to sell</td></tr>
            <tr><td>س-ي-ر</td><td>سَارَ</td><td>يَسِيرُ</td><td>to walk/travel</td></tr>
          </table>
        </div>

        <h3>Complete Conjugation: قَالَ (to say)</h3>
        
        <h4>Past Tense (الماضي):</h4>
        <table>
          <tr><th>Person</th><th>Arabic</th><th>Transliteration</th><th>Notes</th></tr>
          <tr><td>He (هو)</td><td>قَالَ</td><td>qāla</td><td>و → ا</td></tr>
          <tr><td>She (هي)</td><td>قَالَتْ</td><td>qālat</td><td>ا remains</td></tr>
          <tr><td>They (m) (هم)</td><td>قَالُوا</td><td>qālū</td><td>Long vowel</td></tr>
          <tr><td>You (m) (أنتَ)</td><td>قُلْتَ</td><td>qulta</td><td>Vowel shortens</td></tr>
          <tr><td>I (أنا)</td><td>قُلْتُ</td><td>qultu</td><td>Vowel shortens</td></tr>
        </table>

        <h4>Present Tense (المضارع):</h4>
        <table>
          <tr><th>Person</th><th>Arabic</th><th>Transliteration</th></tr>
          <tr><td>He (هو)</td><td>يَقُولُ</td><td>yaqūlu</td></tr>
          <tr><td>She (هي)</td><td>تَقُولُ</td><td>taqūlu</td></tr>
          <tr><td>You (m) (أنتَ)</td><td>تَقُولُ</td><td>taqūlu</td></tr>
          <tr><td>I (أنا)</td><td>أَقُولُ</td><td>aqūlu</td></tr>
        </table>

        <h4>Command (الأمر):</h4>
        <ul>
          <li>أنتَ: <strong>قُلْ</strong> (qul) - middle weak deleted!</li>
          <li>أنتِ: <strong>قُولِي</strong> (qūlī)</li>
          <li>أنتم: <strong>قُولُوا</strong> (qūlū)</li>
        </ul>

        <div class="quran-box">
          <h4>Quranic Example:</h4>
          <p><strong>قُلْ هُوَ اللَّهُ أَحَدٌ</strong></p>
          <p>"Say (قُلْ), 'He is Allah, [who is] One'" (Surah Al-Ikhlas 112:1)</p>
          <p>Notice how قُلْ has no middle radical - it's been deleted in the command form!</p>
        </div>

        <h3>Ajwaf Wāwī vs Ajwaf Yā'ī</h3>
        <ul>
          <li><strong>Ajwaf Wāwī:</strong> Middle radical is و (becomes ū in present: قَالَ → يَقُولُ)</li>
          <li><strong>Ajwaf Yā'ī:</strong> Middle radical is ي (becomes ī in present: بَاعَ → يَبِيعُ)</li>
        </ul>

        <h3>Higher Forms Behavior</h3>
        <p>In Forms II-X, ajwaf verbs are more regular:</p>
        <div class="example-box">
          <ul>
            <li>Form II: قَوَّلَ (qawwala) - to make speak</li>
            <li>Form IV: أَقَامَ (aqāma) - to establish (from قَامَ)</li>
            <li>Form X: اسْتَقَامَ (istaqāma) - to be upright</li>
          </ul>
        </div>

        <div class="activity-box">
          <h4>Practice: Conjugate صَامَ (to fast)</h4>
          <ol>
            <li>Past tense: "I"</li>
            <li>Present tense: "he"</li>
            <li>Command: "you (m)"</li>
          </ol>
        </div>
      `,
    },
  });

  // Unit 6: Naqis Verbs
  await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Weak Verbs: Naqis (Final Radical Weak)',
      description: 'Understanding defective verbs with و or ي as the third radical (الناقص)',
      orderIndex: 6,
      content: `
        <h2>Nāqiṣ Verbs (الناقص - Defective Verbs)</h2>
        <p>Nāqiṣ verbs have و or ي as the <strong>final radical</strong> (لام الكلمة). The weak letter often changes or drops depending on the ending.</p>

        <div class="important-box">
          <h3>Key Transformation Rules:</h3>
          <ol>
            <li>Final و/ي after fatha → <strong>ى</strong> (alif maqṣūrah) in 3rd person masculine singular</li>
            <li>Final weak letter <strong>drops</strong> before ت and ن endings</li>
            <li>In masculine plural past: ي → و (e.g., رَمَوْا)</li>
          </ol>
        </div>

        <h3>Common Nāqiṣ Verbs:</h3>
        <div class="example-box">
          <table>
            <tr><th>Root</th><th>Past</th><th>Present</th><th>Meaning</th></tr>
            <tr><td>د-ع-و</td><td>دَعَا</td><td>يَدْعُو</td><td>to call/invoke</td></tr>
            <tr><td>ر-م-ي</td><td>رَمَى</td><td>يَرْمِي</td><td>to throw</td></tr>
            <tr><td>م-ش-ي</td><td>مَشَى</td><td>يَمْشِي</td><td>to walk</td></tr>
            <tr><td>ت-ل-و</td><td>تَلَا</td><td>يَتْلُو</td><td>to recite</td></tr>
            <tr><td>ب-ك-ي</td><td>بَكَى</td><td>يَبْكِي</td><td>to cry</td></tr>
          </table>
        </div>

        <h3>Complete Conjugation: دَعَا (to call/invoke)</h3>
        
        <h4>Past Tense (الماضي):</h4>
        <table>
          <tr><th>Person</th><th>Arabic</th><th>Transliteration</th><th>Notes</th></tr>
          <tr><td>He (هو)</td><td>دَعَا</td><td>da'ā</td><td>و → ى (alif maqṣūrah)</td></tr>
          <tr><td>She (هي)</td><td>دَعَتْ</td><td>da'at</td><td>Weak letter drops before تْ</td></tr>
          <tr><td>They (m) (هم)</td><td>دَعَوْا</td><td>da'aw</td><td>Returns to و</td></tr>
          <tr><td>You (m) (أنتَ)</td><td>دَعَوْتَ</td><td>da'awta</td><td>Weak letter preserved</td></tr>
          <tr><td>I (أنا)</td><td>دَعَوْتُ</td><td>da'awtu</td><td>Weak letter preserved</td></tr>
        </table>

        <h4>Present Tense (المضارع):</h4>
        <table>
          <tr><th>Person</th><th>Arabic</th><th>Transliteration</th></tr>
          <tr><td>He (هو)</td><td>يَدْعُو</td><td>yad'ū</td></tr>
          <tr><td>She (هي)</td><td>تَدْعُو</td><td>tad'ū</td></tr>
          <tr><td>You (m) (أنتَ)</td><td>تَدْعُو</td><td>tad'ū</td></tr>
          <tr><td>I (أنا)</td><td>أَدْعُو</td><td>ad'ū</td></tr>
          <tr><td>They (m) (هم)</td><td>يَدْعُونَ</td><td>yad'ūna</td></tr>
        </table>

        <h4>Command (الأمر):</h4>
        <ul>
          <li>أنتَ: <strong>اُدْعُ</strong> (ud'u)</li>
          <li>أنتِ: <strong>اُدْعِي</strong> (ud'ī)</li>
          <li>أنتم: <strong>اُدْعُوا</strong> (ud'ū)</li>
        </ul>

        <h3>Complete Conjugation: رَمَى (to throw)</h3>
        
        <h4>Past Tense:</h4>
        <table>
          <tr><th>Person</th><th>Arabic</th><th>Transliteration</th></tr>
          <tr><td>He (هو)</td><td>رَمَى</td><td>ramā</td></tr>
          <tr><td>She (هي)</td><td>رَمَتْ</td><td>ramat</td></tr>
          <tr><td>They (m) (هم)</td><td>رَمَوْا</td><td>ramaw</td></tr>
          <tr><td>You (m) (أنتَ)</td><td>رَمَيْتَ</td><td>ramayta</td></tr>
        </table>

        <div class="quran-box">
          <h4>Quranic Examples:</h4>
          <p><strong>وَادْعُ إِلَىٰ رَبِّكَ</strong></p>
          <p>"And call (اُدْعُ) to your Lord" - Command form of دَعَا</p>
          
          <p><strong>يَسْعَىٰ فِي الْأَرْضِ</strong></p>
          <p>"He walks (يَسْعَى) on the earth" - From سَعَى (to walk/strive)</p>
        </div>

        <h3>Comparison: Mithal vs Ajwaf vs Nāqiṣ</h3>
        <table>
          <tr><th>Type</th><th>Weak Position</th><th>Example</th><th>Key Change</th></tr>
          <tr><td>Mithal</td><td>1st radical</td><td>وَعَدَ → يَعِدُ</td><td>Initial و drops in present</td></tr>
          <tr><td>Ajwaf</td><td>2nd radical</td><td>قَالَ → يَقُولُ</td><td>Middle و → ا in past, long vowel in present</td></tr>
          <tr><td>Nāqiṣ</td><td>3rd radical</td><td>دَعَا → يَدْعُو</td><td>Final و → ى in 3rd person, drops before ت/ن</td></tr>
        </table>

        <h3>Nāqiṣ in Higher Forms</h3>
        <div class="example-box">
          <ul>
            <li>Form II: رَبَّى (rabbā) - to raise/nurture (from ربو)</li>
            <li>Form IV: أَعْطَى (a'ṭā) - to give (from عطو)</li>
            <li>Form VI: تَلَاقَى (talāqā) - to meet each other</li>
            <li>Form VIII: اشْتَرَى (ishtarā) - to buy</li>
            <li>Form X: اسْتَوَى (istawā) - to be equal/settle</li>
          </ul>
        </div>

        <div class="activity-box">
          <h4>Master Challenge:</h4>
          <p>Conjugate مَشَى (to walk) completely:</p>
          <ol>
            <li>Past: he, she, they (m), you (m), I</li>
            <li>Present: he, she, you (m), I</li>
            <li>Command: you (m), you (f)</li>
          </ol>
        </div>
      `,
    },
  });

  // Unit 7: Lafeef & Final Practice
  await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Doubly Weak Verbs & Comprehensive Practice',
      description: 'Mastering Lafeef verbs and integrating all Sarf knowledge',
      orderIndex: 7,
      content: `
        <h2>Lafīf Verbs (اللفيف - Doubly Weak)</h2>
        <p>Lafīf verbs have <strong>two weak letters</strong> as radicals. They combine rules from multiple weak verb types.</p>

        <h3>Two Types of Lafīf:</h3>
        
        <h4>1. Lafīf Maqrūn (اللفيف المقرون) - Contiguous</h4>
        <p>2nd and 3rd radicals are both weak (adjacent)</p>
        <div class="example-box">
          <ul>
            <li>رَوَى (rawā) - to narrate (Root: ر-و-ي)</li>
            <li>طَوَى (ṭawā) - to fold (Root: ط-و-ي)</li>
            <li>نَوَى (nawā) - to intend (Root: ن-و-ي)</li>
          </ul>
          <p>These follow <strong>Ajwaf + Nāqiṣ</strong> rules combined</p>
        </div>

        <h4>2. Lafīf Mafrūq (اللفيف المفروق) - Separated</h4>
        <p>1st and 3rd radicals are weak (separated by middle strong letter)</p>
        <div class="example-box">
          <ul>
            <li>وَفَى (wafā) - to fulfill (Root: و-ف-ي)</li>
            <li>وَقَى (waqā) - to protect (Root: و-ق-ي)</li>
            <li>وَلِيَ (waliya) - to govern (Root: و-ل-ي)</li>
          </ul>
          <p>These follow <strong>Mithal + Nāqiṣ</strong> rules combined</p>
        </div>

        <h3>Conjugation Example: وَفَى (to fulfill)</h3>
        
        <h4>Past Tense:</h4>
        <table>
          <tr><th>Person</th><th>Arabic</th><th>Notes</th></tr>
          <tr><td>He</td><td>وَفَى</td><td>Both weak letters visible</td></tr>
          <tr><td>She</td><td>وَفَتْ</td><td>Final ي drops before تْ</td></tr>
          <tr><td>You (m)</td><td>وَفَيْتَ</td><td>Final ي returns</td></tr>
        </table>

        <h4>Present Tense:</h4>
        <table>
          <tr><th>Person</th><th>Arabic</th><th>Notes</th></tr>
          <tr><td>He</td><td>يَفِي</td><td>Initial و drops (Mithal rule)</td></tr>
          <tr><td>She</td><td>تَفِي</td><td>Both transformations applied</td></tr>
        </table>

        <h4>Command:</h4>
        <ul>
          <li>أنتَ: <strong>فِ</strong> - Both weak letters can drop!</li>
          <li>أنتِ: <strong>فِي</strong></li>
        </ul>

        <h2>Comprehensive Practice & Integration</h2>

        <h3>Verb Analysis Method (5 Steps):</h3>
        <ol>
          <li><strong>Identify the root:</strong> Find the three (or four) radical letters</li>
          <li><strong>Determine the form:</strong> Which of the 10 forms (I-X)?</li>
          <li><strong>Check for weakness:</strong> Are any radicals weak letters (و، ي، ا)?</li>
          <li><strong>Apply the rules:</strong> Use appropriate weak verb rules</li>
          <li><strong>Conjugate:</strong> Apply endings for person/tense</li>
        </ol>

        <h3>Practice Set 1: Sound Verbs in Different Forms</h3>
        <div class="activity-box">
          <p>Conjugate these sound verbs (Form indicated):</p>
          <ol>
            <li>كَتَبَ (Form I) - Present, "he"</li>
            <li>عَلَّمَ (Form II) - Past, "she"</li>
            <li>جَاهَدَ (Form III) - Command, "you (m)"</li>
            <li>أَكْرَمَ (Form IV) - Present, "they (m)"</li>
          </ol>
        </div>

        <h3>Practice Set 2: Mithal Verbs</h3>
        <div class="activity-box">
          <p>Complete these conjugations:</p>
          <ol>
            <li>وَصَلَ - Present: "I" = _____</li>
            <li>وَجَدَ - Command: "you (f)" = _____</li>
            <li>وَقَفَ - Past: "they (m)" = _____</li>
          </ol>
        </div>

        <h3>Practice Set 3: Ajwaf Verbs</h3>
        <div class="activity-box">
          <p>Conjugate completely:</p>
          <ol>
            <li>قَامَ - Past: he, she, you (m)</li>
            <li>صَامَ - Present: he, I</li>
            <li>بَاعَ - Command: you (m)</li>
          </ol>
        </div>

        <h3>Practice Set 4: Nāqiṣ Verbs</h3>
        <div class="activity-box">
          <p>Fill in the blanks:</p>
          <ol>
            <li>تَلَا - Past feminine singular = _____</li>
            <li>بَكَى - Present masculine singular = _____</li>
            <li>سَعَى - Command masculine singular = _____</li>
          </ol>
        </div>

        <h3>Advanced Exercise: Real Quranic Text Analysis</h3>
        <div class="quran-box">
          <p>Analyze these verbs from the Quran:</p>
          <ol>
            <li><strong>قُلْ</strong> - Form? Root? Type? Full past tense masculine?</li>
            <li><strong>وَاشْرَحْ</strong> - Form? Root? Command of what verb?</li>
            <li><strong>قَالُوا</strong> - Singular form? Type of weak verb?</li>
            <li><strong>سَمِعْنَا وَأَطَعْنَا</strong> - What forms? Are they sound or weak?</li>
          </ol>
        </div>

        <h3>Final Mastery Checklist</h3>
        <div class="important-box">
          <p>You have mastered Sarf when you can:</p>
          <ol>
            <li>✓ Identify all 10 verb forms by their patterns</li>
            <li>✓ Distinguish the 4 types of weak verbs</li>
            <li>✓ Apply weak verb rules correctly in conjugation</li>
            <li>✓ Analyze Quranic verbs accurately</li>
            <li>✓ Conjugate any verb in all persons and tenses</li>
            <li>✓ Understand semantic differences between forms</li>
            <li>✓ Recognize when و drops in Mithal verbs</li>
            <li>✓ Know when middle radical transforms in Ajwaf</li>
            <li>✓ Apply Nāqiṣ rules for final weak letters</li>
            <li>✓ Handle doubly weak Lafīf verbs confidently</li>
          </ol>
        </div>

        <h3>Next Steps in Your Sarf Journey</h3>
        <ul>
          <li>Study the derived nouns (المصادر، اسم الفاعل، اسم المفعول)</li>
          <li>Learn about the rare forms (XI-XV)</li>
          <li>Practice with authentic texts (Quran, Hadith, classical literature)</li>
          <li>Memorize common verb paradigms</li>
          <li>Study Sarf with a qualified teacher for deeper insights</li>
        </ul>

        <div class="important-box">
          <h3>Final Wisdom</h3>
          <p><strong>"لا يجيد الطالب علم النحو حتى يتقن علم الصرف"</strong></p>
          <p>"A student cannot master Nahw (grammar) until he masters Sarf (morphology)"</p>
          <p>Keep practicing, and may Allah grant you understanding of His Book!</p>
        </div>
      `,
    },
  });

  console.log('✅ Created all 7 Sarf units');

  // Add some quiz questions
  const units = await prisma.unit.findMany({
    where: { courseId: sarfCourse.id },
    orderBy: { orderIndex: 'asc' },
  });

  // Quiz questions for Unit 1
  await prisma.question.createMany({
    data: [
      {
        unitId: units[0].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What are the three letters of the morphological scale (الميزان الصرفي)?',
        options: JSON.stringify(['ف، ع، ل', 'أ، ب، ج', 'س، ل، م', 'ك، ت، ب']),
        correctAnswer: 'ف، ع، ل',
        explanation: 'The scale فَعَلَ uses ف for the first radical, ع for the second, and ل for the third.',
        difficulty: 'EASY',
      },
      {
        unitId: units[1].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which verb form indicates intensification or repetition?',
        options: JSON.stringify(['Form I', 'Form II', 'Form III', 'Form IV']),
        correctAnswer: 'Form II',
        explanation: 'Form II (فَعَّلَ) with the doubled middle letter indicates intensification.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: units[2].id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Form X (اسْتَفْعَلَ) primarily expresses:',
        options: JSON.stringify(['Colors', 'Seeking/requesting', 'Breaking', 'Mutual action']),
        correctAnswer: 'Seeking/requesting',
        explanation: 'Form X commonly means seeking or requesting, as in استغفر (to seek forgiveness).',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // Add Arabic terms
  await prisma.arabicTerm.createMany({
    data: [
      {
        unitId: units[0].id,
        arabicText: 'علم الصرف',
        transliteration: "'ilm aṣ-ṣarf",
        translation: 'The science of morphology',
      },
      {
        unitId: units[0].id,
        arabicText: 'الميزان الصرفي',
        transliteration: 'al-mīzān aṣ-ṣarfī',
        translation: 'The morphological scale',
      },
      {
        unitId: units[0].id,
        arabicText: 'الجذر',
        transliteration: 'al-jadhr',
        translation: 'The root (three consonants)',
      },
      {
        unitId: units[3].id,
        arabicText: 'المثال',
        transliteration: 'al-mithāl',
        translation: 'Assimilated verb (1st radical weak)',
      },
      {
        unitId: units[4].id,
        arabicText: 'الأجوف',
        transliteration: 'al-ajwaf',
        translation: 'Hollow verb (2nd radical weak)',
      },
      {
        unitId: units[5].id,
        arabicText: 'الناقص',
        transliteration: 'an-nāqiṣ',
        translation: 'Defective verb (3rd radical weak)',
      },
      {
        unitId: units[6].id,
        arabicText: 'اللفيف',
        transliteration: 'al-lafīf',
        translation: 'Doubly weak verb',
      },
    ],
  });

  console.log('✅ Added quiz questions and Arabic terms');
  console.log('');
  console.log('🎉 Sarf course seeding completed successfully!');
  console.log('📊 Course Summary:');
  console.log('   - 7 comprehensive units');
  console.log('   - All 10 verb forms covered');
  console.log('   - All 4 weak verb types explained');
  console.log('   - Extensive examples and Quranic references');
  console.log('   - Practice exercises throughout');
  console.log('');
}

async function main() {
  try {
    await seedSarfCourse();
  } catch (error) {
    console.error('❌ Error seeding Sarf course:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
