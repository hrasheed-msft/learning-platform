import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Advanced Sarf (Arabic Morphology) Course Seed
 * For students in traditional alimiyyah programs
 * 
 * Can be run independently with: ts-node prisma/seed-sarf-course.ts
 */

export async function seedSarfCourse() {
  console.log('📚 Starting Sarf (Arabic Morphology) course seed...');
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

  // Create the Sarf course
  const sarfCourse = await prisma.course.create({
    data: {
      title: 'Advanced Sarf - Arabic Morphology',
      description: 'A comprehensive study of Arabic morphology (Sarf) covering verb forms (awzan), weak letters, and conjugation patterns for alimiyyah students.',
      descriptionArabic: 'دراسة شاملة لعلم الصرف تغطي أوزان الأفعال وحروف العلة وأنماط التصريف لطلاب العلوم الشرعية',
      level: 'ADVANCED',
      ageCategory: 'ADULT',
      isPublished: true,
      imageUrl: '/images/courses/sarf.jpg',
      category: 'LANGUAGE',
      estimatedHours: 40,
    },
  });

  console.log('✅ Created Sarf course:', sarfCourse.title);

  // Unit 1: Introduction to Sarf & The Trilateral Root System
  const unit1 = await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Introduction to Sarf & The Trilateral Root System',
      titleArabic: 'مقدمة في علم الصرف والميزان الصرفي',
      description: 'Understanding the foundation of Arabic morphology and the three-letter root system',
      orderIndex: 1,
      content: `
        <h2>What is Sarf (علم الصرف)?</h2>
        <p>Sarf is the science of Arabic morphology that studies the internal structure and changes of words. It is essential for understanding the Quran, Hadith, and classical Arabic texts.</p>

        <h3>The Importance of Sarf</h3>
        <p>The scholars say: <strong>"الصرف أم العلوم"</strong> - "Sarf is the mother of sciences." Without it, one cannot properly understand Arabic grammar (Nahw) or derive correct meanings from texts.</p>

        <h3>The Trilateral Root System (الجذر الثلاثي)</h3>
        <p>Most Arabic words are built on a three-letter root that carries the basic meaning. These three root letters are called:</p>
        <ul>
          <li><strong>ف</strong> (فاء الكلمة) - First radical</li>
          <li><strong>ع</strong> (عين الكلمة) - Second radical</li>
          <li><strong>ل</strong> (لام الكلمة) - Third radical</li>
        </ul>

        <div class="example-box">
          <h4>Example: The Root ك-ت-ب (K-T-B)</h4>
          <p>This root carries the meaning of "writing":</p>
          <ul>
            <li><span class="arabic">كَتَبَ</span> (kataba) - he wrote</li>
            <li><span class="arabic">كِتَابٌ</span> (kitāb) - a book</li>
            <li><span class="arabic">كَاتِبٌ</span> (kātib) - writer</li>
            <li><span class="arabic">مَكْتَبٌ</span> (maktab) - office/desk</li>
            <li><span class="arabic">مَكْتُوبٌ</span> (maktūb) - written</li>
          </ul>
        </div>

        <h3>The Morphological Scale (الميزان الصرفي)</h3>
        <p>To analyze word patterns, we use the scale <strong>فَعَلَ</strong> (fa'ala), where:</p>
        <ul>
          <li>ف = First radical</li>
          <li>ع = Second radical</li>
          <li>ل = Third radical</li>
        </ul>

        <div class="example-box">
          <h4>Weighing Words on the Scale</h4>
          <table>
            <tr>
              <th>Word</th>
              <th>Root</th>
              <th>Scale</th>
            </tr>
            <tr>
              <td><span class="arabic">نَصَرَ</span> (naṣara)</td>
              <td>ن-ص-ر</td>
              <td><span class="arabic">فَعَلَ</span></td>
            </tr>
            <tr>
              <td><span class="arabic">ضَرَبَ</span> (ḍaraba)</td>
              <td>ض-ر-ب</td>
              <td><span class="arabic">فَعَلَ</span></td>
            </tr>
            <tr>
              <td><span class="arabic">كَاتِبٌ</span> (kātib)</td>
              <td>ك-ت-ب</td>
              <td><span class="arabic">فَاعِلٌ</span></td>
            </tr>
          </table>
        </div>

        <h3>Added Letters (الزيادة)</h3>
        <p>When letters are added to the three-letter root, they change the meaning. The added letters are collected in the word: <strong>سَأَلْتُمُونِيهَا</strong></p>
        <p>These letters add grammatical or semantic functions to the root.</p>

        <div class="important-box">
          <h4>Key Principle</h4>
          <p>When a root has added letters, we add those same letters to the scale. For example:</p>
          <ul>
            <li><span class="arabic">دَرَّسَ</span> (darrasa - to teach repeatedly) = <span class="arabic">فَعَّلَ</span></li>
            <li><span class="arabic">تَعَلَّمَ</span> (ta'allama - to learn) = <span class="arabic">تَفَعَّلَ</span></li>
            <li><span class="arabic">انْكَسَرَ</span> (inkasara - to be broken) = <span class="arabic">انْفَعَلَ</span></li>
          </ul>
        </div>

        <h3>Types of Verbs by Root Strength</h3>
        <p>Verbs are classified as:</p>
        <ul>
          <li><strong>Ṣaḥīḥ (صحيح)</strong> - Sound: No weak letters (و، ي، ا) in the root</li>
          <li><strong>Mu'tall (معتل)</strong> - Weak: Contains one or more weak letters</li>
        </ul>

        <div class="activity-box">
          <h4>Practice Activity</h4>
          <p>Identify the three root letters in these words:</p>
          <ol>
            <li><span class="arabic">شَرِبَ</span> (shariba - to drink)</li>
            <li><span class="arabic">ذَهَبَ</span> (dhahaba - to go)</li>
            <li><span class="arabic">فَهِمَ</span> (fahima - to understand)</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 1: Introduction to Sarf');

  // Unit 2: The Ten Verb Forms - Part 1 (Forms I-V)
  const unit2 = await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'The Ten Verb Forms (I-V) - Meanings and Patterns',
      titleArabic: 'الأوزان العشرة (من الأول إلى الخامس)',
      description: 'Deep study of verb forms I through V with their meanings and usage',
      orderIndex: 2,
      content: `
        <h2>The Ten Verb Forms (الأوزان العشرة)</h2>
        <p>Arabic verbs follow ten main patterns (awzān), each carrying distinct meanings. Understanding these forms is crucial for reading classical texts.</p>

        <h3>Form I (الوزن الأول) - فَعَلَ</h3>
        <p><strong>Pattern:</strong> <span class="arabic">فَعَلَ - يَفْعَلُ</span> (fa'ala - yaf'alu)</p>
        <p><strong>Meaning:</strong> The basic, simple action (no added letters)</p>
        
        <div class="example-box">
          <h4>Examples of Form I</h4>
          <table>
            <tr>
              <th>Verb</th>
              <th>Transliteration</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td><span class="arabic">كَتَبَ</span></td>
              <td>kataba</td>
              <td>he wrote</td>
            </tr>
            <tr>
              <td><span class="arabic">نَصَرَ</span></td>
              <td>naṣara</td>
              <td>he helped</td>
            </tr>
            <tr>
              <td><span class="arabic">ضَرَبَ</span></td>
              <td>ḍaraba</td>
              <td>he hit/struck</td>
            </tr>
          </table>
        </div>

        <h3>Form II (الوزن الثاني) - فَعَّلَ</h3>
        <p><strong>Pattern:</strong> <span class="arabic">فَعَّلَ - يُفَعِّلُ</span> (fa''ala - yufa''ilu)</p>
        <p><strong>Added Letter:</strong> Doubling of the second radical (شدة)</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li><strong>Intensification/Repetition:</strong> Doing the action repeatedly or intensively</li>
          <li><strong>Causation (Transitivity):</strong> Making someone/something do the action</li>
          <li><strong>Declaration:</strong> Attributing a quality to someone</li>
        </ul>

        <div class="example-box">
          <h4>Examples of Form II</h4>
          <table>
            <tr>
              <th>Form I</th>
              <th>Form II</th>
              <th>Change in Meaning</th>
            </tr>
            <tr>
              <td><span class="arabic">كَسَرَ</span> (kasara - broke)</td>
              <td><span class="arabic">كَسَّرَ</span> (kassara)</td>
              <td>broke into many pieces</td>
            </tr>
            <tr>
              <td><span class="arabic">عَلِمَ</span> ('alima - knew)</td>
              <td><span class="arabic">عَلَّمَ</span> ('allama)</td>
              <td>taught (made to know)</td>
            </tr>
            <tr>
              <td><span class="arabic">كَذَبَ</span> (kadhaba - lied)</td>
              <td><span class="arabic">كَذَّبَ</span> (kadhdhaba)</td>
              <td>declared as liar/rejected</td>
            </tr>
          </table>
        </div>

        <div class="quran-box">
          <h4>Quranic Examples</h4>
          <p><span class="arabic">وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا</span></p>
          <p>"And He taught Adam the names, all of them" (Baqarah 2:31)</p>
          <p>The verb <span class="arabic">عَلَّمَ</span> (Form II) shows causation - Allah made Adam know.</p>
        </div>

        <h3>Form III (الوزن الثالث) - فَاعَلَ</h3>
        <p><strong>Pattern:</strong> <span class="arabic">فَاعَلَ - يُفَاعِلُ</span> (fā'ala - yufā'ilu)</p>
        <p><strong>Added Letter:</strong> ا (Alif) after the first radical</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li><strong>Reciprocity/Mutual action:</strong> Doing the action with/to someone</li>
          <li><strong>Attempting:</strong> Trying to do the action</li>
        </ul>

        <div class="example-box">
          <h4>Examples of Form III</h4>
          <table>
            <tr>
              <th>Form I</th>
              <th>Form III</th>
              <th>Change in Meaning</th>
            </tr>
            <tr>
              <td><span class="arabic">كَتَبَ</span> (kataba - wrote)</td>
              <td><span class="arabic">كَاتَبَ</span> (kātaba)</td>
              <td>corresponded with</td>
            </tr>
            <tr>
              <td><span class="arabic">قَتَلَ</span> (qatala - killed)</td>
              <td><span class="arabic">قَاتَلَ</span> (qātala)</td>
              <td>fought with/against</td>
            </tr>
            <tr>
              <td><span class="arabic">جَلَسَ</span> (jalasa - sat)</td>
              <td><span class="arabic">جَالَسَ</span> (jālasa)</td>
              <td>sat with/accompanied</td>
            </tr>
          </table>
        </div>

        <h3>Form IV (الوزن الرابع) - أَفْعَلَ</h3>
        <p><strong>Pattern:</strong> <span class="arabic">أَفْعَلَ - يُفْعِلُ</span> (af'ala - yuf'ilu)</p>
        <p><strong>Added Letter:</strong> همزة (Hamza) at the beginning</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li><strong>Causation:</strong> Making someone/something do the action</li>
          <li><strong>Entry into time/place:</strong> Entering into a time or reaching a place</li>
          <li><strong>Finding something:</strong> Discovering or encountering</li>
        </ul>

        <div class="example-box">
          <h4>Examples of Form IV</h4>
          <table>
            <tr>
              <th>Form I</th>
              <th>Form IV</th>
              <th>Change in Meaning</th>
            </tr>
            <tr>
              <td><span class="arabic">خَرَجَ</span> (kharaja - went out)</td>
              <td><span class="arabic">أَخْرَجَ</span> (akhraja)</td>
              <td>brought out/expelled</td>
            </tr>
            <tr>
              <td><span class="arabic">نَزَلَ</span> (nazala - descended)</td>
              <td><span class="arabic">أَنْزَلَ</span> (anzala)</td>
              <td>sent down/revealed</td>
            </tr>
            <tr>
              <td><span class="arabic">صْبَحَ</span> (morning)</td>
              <td><span class="arabic">أَصْبَحَ</span> (aṣbaḥa)</td>
              <td>entered morning/became</td>
            </tr>
          </table>
        </div>

        <div class="quran-box">
          <h4>Quranic Example</h4>
          <p><span class="arabic">إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ</span></p>
          <p>"Indeed, We sent it down during the Night of Decree" (Al-Qadr 97:1)</p>
        </div>

        <h3>Form V (الوزن الخامس) - تَفَعَّلَ</h3>
        <p><strong>Pattern:</strong> <span class="arabic">تَفَعَّلَ - يَتَفَعَّلُ</span> (tafa''ala - yatafa''alu)</p>
        <p><strong>Added Letters:</strong> ت at the beginning + doubling of second radical</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li><strong>Reflexive of Form II:</strong> Doing the action to oneself</li>
          <li><strong>Pretending:</strong> Acting as if one has a quality</li>
          <li><strong>Gradual process:</strong> Gradually acquiring a state</li>
        </ul>

        <div class="example-box">
          <h4>Examples of Form V</h4>
          <table>
            <tr>
              <th>Form II</th>
              <th>Form V</th>
              <th>Relationship</th>
            </tr>
            <tr>
              <td><span class="arabic">عَلَّمَ</span> ('allama - taught)</td>
              <td><span class="arabic">تَعَلَّمَ</span> (ta'allama)</td>
              <td>learned (taught oneself)</td>
            </tr>
            <tr>
              <td><span class="arabic">طَهَّرَ</span> (ṭahhara - purified)</td>
              <td><span class="arabic">تَطَهَّرَ</span> (taṭahhara)</td>
              <td>purified oneself</td>
            </tr>
            <tr>
              <td><span class="arabic">كَلَّمَ</span> (kallama - spoke to)</td>
              <td><span class="arabic">تَكَلَّمَ</span> (takallama)</td>
              <td>spoke (for oneself)</td>
            </tr>
          </table>
        </div>

        <div class="important-box">
          <h4>Summary: Forms I-V</h4>
          <table>
            <tr>
              <th>Form</th>
              <th>Pattern</th>
              <th>Key Meaning</th>
            </tr>
            <tr>
              <td>I</td>
              <td><span class="arabic">فَعَلَ</span></td>
              <td>Basic action</td>
            </tr>
            <tr>
              <td>II</td>
              <td><span class="arabic">فَعَّلَ</span></td>
              <td>Intensification/Causation</td>
            </tr>
            <tr>
              <td>III</td>
              <td><span class="arabic">فَاعَلَ</span></td>
              <td>Reciprocity</td>
            </tr>
            <tr>
              <td>IV</td>
              <td><span class="arabic">أَفْعَلَ</span></td>
              <td>Causation/Entry</td>
            </tr>
            <tr>
              <td>V</td>
              <td><span class="arabic">تَفَعَّلَ</span></td>
              <td>Reflexive/Gradual</td>
            </tr>
          </table>
        </div>

        <div class="activity-box">
          <h4>Practice Exercise</h4>
          <p>Identify which form each verb belongs to and explain its meaning:</p>
          <ol>
            <li><span class="arabic">فَتَحَ</span> (fataḥa)</li>
            <li><span class="arabic">نَزَّلَ</span> (nazzala)</li>
            <li><span class="arabic">جَاهَدَ</span> (jāhada)</li>
            <li><span class="arabic">أَسْلَمَ</span> (aslama)</li>
            <li><span class="arabic">تَذَكَّرَ</span> (tadhakkara)</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 2: Verb Forms I-V');

  console.log('');
  console.log('✅ Part 1 completed: Created course with 2 units');
  console.log('📊 Progress: Units 1-2 of 8 completed');
  console.log('');
  console.log('To continue, run this seed file again or proceed to Part 2');
}

async function main() {
  try {
    await seedSarfCourse();
    console.log('✨ Sarf course seed Part 1 completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Sarf course:', error);
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
