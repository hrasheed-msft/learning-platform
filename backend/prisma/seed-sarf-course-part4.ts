import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Advanced Sarf Course - Part 4
 * Units 7-8: Lafeef Verbs and Comprehensive Practice
 */

export async function seedSarfCoursePart4() {
  console.log('📚 Continuing Sarf course seed - Part 4...');
  console.log('');

  // Find the Sarf course
  const sarfCourse = await prisma.course.findFirst({
    where: { title: 'Advanced Sarf - Arabic Morphology' },
  });

  if (!sarfCourse) {
    console.log('⚠️  Sarf course not found. Please run Part 1 first.');
    return;
  }

  console.log('✅ Found Sarf course');

  // Unit 7: Weak Verbs - Lafeef (اللفيف)
  const unit7 = await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Weak Verbs: Lafeef (Doubly Weak)',
      titleArabic: 'الفعل المعتل - اللفيف',
      description: 'Mastering verbs with two weak radicals',
      orderIndex: 7,
      content: `
        <h2>Lafeef Verbs (اللفيف) - Doubly Weak</h2>
        <p>Lafeef verbs contain two weak letters (و or ي) in their three-letter root. These are the most complex weak verbs, combining rules from multiple weak verb types.</p>

        <div class="important-box">
          <h4>Key Characteristic</h4>
          <p>The word "لفيف" means "combined" or "wrapped together" - these verbs combine two types of weakness in one root.</p>
        </div>

        <h3>Types of Lafeef Verbs</h3>
        <ul>
          <li><strong>Lafeef Maqrūn (اللفيف المقرون):</strong> The two weak letters are adjacent (2nd and 3rd radicals)</li>
          <li><strong>Lafeef Mafrūq (اللفيف المفروق):</strong> The two weak letters are separated (1st and 3rd radicals)</li>
        </ul>

        <h2>Type 1: Lafeef Maqrūn (اللفيف المقرون)</h2>
        <p>The 2nd and 3rd radicals are both weak (next to each other).</p>

        <h3>Example: <span class="arabic">رَوَى</span> (rawā - to narrate/relate)</h3>
        <p>Root: ر-و-ي (both و and ي are weak)</p>

        <div class="example-box">
          <h4>Conjugation of رَوَى</h4>
          <table>
            <tr>
              <th>Tense</th>
              <th>Person</th>
              <th>Form</th>
              <th>Transliteration</th>
              <th>Notes</th>
            </tr>
            <tr>
              <td rowspan="3">Past</td>
              <td>هو</td>
              <td><span class="arabic">رَوَى</span></td>
              <td>rawā</td>
              <td>Like Nāqiṣ</td>
            </tr>
            <tr>
              <td>هي</td>
              <td><span class="arabic">رَوَتْ</span></td>
              <td>rawat</td>
              <td>Weak letter drops</td>
            </tr>
            <tr>
              <td>هم</td>
              <td><span class="arabic">رَوَوْا</span></td>
              <td>rawaw</td>
              <td>ي → و</td>
            </tr>
            <tr>
              <td rowspan="3">Present</td>
              <td>هو</td>
              <td><span class="arabic">يَرْوِي</span></td>
              <td>yarwī</td>
              <td>Both weak letters appear</td>
            </tr>
            <tr>
              <td>هي</td>
              <td><span class="arabic">تَرْوِي</span></td>
              <td>tarwī</td>
              <td>-</td>
            </tr>
            <tr>
              <td>هم</td>
              <td><span class="arabic">يَرْوُونَ</span></td>
              <td>yarwūna</td>
              <td>Final weak drops</td>
            </tr>
            <tr>
              <td>Command</td>
              <td>أنتَ</td>
              <td><span class="arabic">ارْوِ</span></td>
              <td>irwi</td>
              <td>Like Nāqiṣ command</td>
            </tr>
          </table>
        </div>

        <h3>Common Lafeef Maqrūn Verbs</h3>
        <div class="example-box">
          <table>
            <tr>
              <th>Root</th>
              <th>Past</th>
              <th>Present</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>ر-و-ي</td>
              <td><span class="arabic">رَوَى</span></td>
              <td><span class="arabic">يَرْوِي</span></td>
              <td>to narrate/relate/quench thirst</td>
            </tr>
            <tr>
              <td>ط-و-ي</td>
              <td><span class="arabic">طَوَى</span></td>
              <td><span class="arabic">يَطْوِي</span></td>
              <td>to fold/roll up</td>
            </tr>
            <tr>
              <td>ن-و-ي</td>
              <td><span class="arabic">نَوَى</span></td>
              <td><span class="arabic">يَنْوِي</span></td>
              <td>to intend</td>
            </tr>
            <tr>
              <td>ح-ي-ي</td>
              <td><span class="arabic">حَيِيَ</span></td>
              <td><span class="arabic">يَحْيَا</span></td>
              <td>to live</td>
            </tr>
          </table>
        </div>

        <h2>Type 2: Lafeef Mafrūq (اللفيف المفروق)</h2>
        <p>The 1st and 3rd radicals are weak (separated by the middle radical).</p>

        <h3>Example: <span class="arabic">وَفَى</span> (wafā - to fulfill/be loyal)</h3>
        <p>Root: و-ف-ي (first is و, last is ي)</p>

        <div class="example-box">
          <h4>Conjugation of وَفَى</h4>
          <table>
            <tr>
              <th>Tense</th>
              <th>Person</th>
              <th>Form</th>
              <th>Transliteration</th>
              <th>Notes</th>
            </tr>
            <tr>
              <td rowspan="3">Past</td>
              <td>هو</td>
              <td><span class="arabic">وَفَى</span></td>
              <td>wafā</td>
              <td>Like Nāqiṣ</td>
            </tr>
            <tr>
              <td>هي</td>
              <td><span class="arabic">وَفَتْ</span></td>
              <td>wafat</td>
              <td>Final weak drops</td>
            </tr>
            <tr>
              <td>أنتَ</td>
              <td><span class="arabic">وَفَيْتَ</span></td>
              <td>wafayta</td>
              <td>Both appear</td>
            </tr>
            <tr>
              <td rowspan="3">Present</td>
              <td>هو</td>
              <td><span class="arabic">يَفِي</span></td>
              <td>yafī</td>
              <td>First و drops (Mithal)</td>
            </tr>
            <tr>
              <td>هي</td>
              <td><span class="arabic">تَفِي</span></td>
              <td>tafī</td>
              <td>-</td>
            </tr>
            <tr>
              <td>هم</td>
              <td><span class="arabic">يَفُونَ</span></td>
              <td>yafūna</td>
              <td>Last weak drops</td>
            </tr>
            <tr>
              <td>Command</td>
              <td>أنتَ</td>
              <td><span class="arabic">فِ</span></td>
              <td>fi</td>
              <td>Both weaks drop!</td>
            </tr>
          </table>
        </div>

        <div class="important-box">
          <h4>Note on Lafeef Mafrūq</h4>
          <p>These verbs follow <strong>both Mithal and Nāqiṣ rules:</strong></p>
          <ul>
            <li>First weak letter: Follows Mithal rules (drops in present Form I)</li>
            <li>Last weak letter: Follows Nāqiṣ rules (changes to ى in past, etc.)</li>
          </ul>
        </div>

        <h3>Common Lafeef Mafrūq Verbs</h3>
        <div class="example-box">
          <table>
            <tr>
              <th>Root</th>
              <th>Past</th>
              <th>Present</th>
              <th>Command</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>و-ف-ي</td>
              <td><span class="arabic">وَفَى</span></td>
              <td><span class="arabic">يَفِي</span></td>
              <td><span class="arabic">فِ</span></td>
              <td>to fulfill/be loyal</td>
            </tr>
            <tr>
              <td>و-ق-ي</td>
              <td><span class="arabic">وَقَى</span></td>
              <td><span class="arabic">يَقِي</span></td>
              <td><span class="arabic">قِ</span></td>
              <td>to protect/guard</td>
            </tr>
            <tr>
              <td>و-ل-ي</td>
              <td><span class="arabic">وَلِيَ</span></td>
              <td><span class="arabic">يَلِي</span></td>
              <td><span class="arabic">لِ</span></td>
              <td>to be close to/govern</td>
            </tr>
            <tr>
              <td>و-ع-ي</td>
              <td><span class="arabic">وَعَى</span></td>
              <td><span class="arabic">يَعِي</span></td>
              <td><span class="arabic">عِ</span></td>
              <td>to comprehend/understand</td>
            </tr>
          </table>
        </div>

        <div class="quran-box">
          <h4>Quranic Examples</h4>
          <p><span class="arabic">إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوْا</span></p>
          <p>"Indeed, Allah is with those who fear Him" (Nahl 16:128)</p>
          <p>Note: <span class="arabic">اتَّقَوْا</span> is from <span class="arabic">وَقَى</span> (Form VIII)</p>
          
          <p><span class="arabic">وَبَشِّرِ الَّذِينَ آمَنُوا</span></p>
          <p>"And give good tidings to those who believe" (Baqarah 2:25)</p>
          <p>Note: <span class="arabic">آمَنُوا</span> is from <span class="arabic">أَمِنَ</span> which becomes doubly weak in some forms</p>
        </div>

        <div class="activity-box">
          <h4>Practice: Lafeef Verbs</h4>
          <p>Identify the type and conjugate:</p>
          <ol>
            <li>What type is <span class="arabic">نَوَى</span>? (Maqrūn or Mafrūq)</li>
            <li>Conjugate <span class="arabic">وَقَى</span> in present (أنا): أ___</li>
            <li>What is the command form of <span class="arabic">رَوَى</span> for أنتَ? ___</li>
            <li>Which two weak verb types combine in <span class="arabic">وَفَى</span>?</li>
          </ol>
        </div>

        <div class="important-box">
          <h4>Summary: Lafeef Verbs</h4>
          <table>
            <tr>
              <th>Type</th>
              <th>Weak Positions</th>
              <th>Example</th>
              <th>Rules Applied</th>
            </tr>
            <tr>
              <td>Lafeef Maqrūn</td>
              <td>2nd + 3rd</td>
              <td><span class="arabic">رَوَى</span></td>
              <td>Ajwaf + Nāqiṣ rules</td>
            </tr>
            <tr>
              <td>Lafeef Mafrūq</td>
              <td>1st + 3rd</td>
              <td><span class="arabic">وَفَى</span></td>
              <td>Mithal + Nāqiṣ rules</td>
            </tr>
          </table>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 7: Lafeef Verbs');

  // Unit 8: Comprehensive Practice & Conjugation Mastery
  const unit8 = await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Comprehensive Practice & Conjugation Mastery',
      titleArabic: 'التطبيق الشامل وإتقان التصريف',
      description: 'Practical exercises for mastering all verb types and forms',
      orderIndex: 8,
      content: `
        <h2>Comprehensive Sarf Practice</h2>
        <p>This unit brings together everything learned to master Arabic verb conjugation through systematic practice.</p>

        <h3>Complete Verb Analysis Method</h3>
        <p>For any verb, follow these steps:</p>
        <ol>
          <li><strong>Identify the root</strong> (الجذر) - the three consonant letters</li>
          <li><strong>Identify the form</strong> (الوزن) - I through X</li>
          <li><strong>Check for weakness</strong> (العلة) - Ṣaḥīḥ or Mu'tall?</li>
          <li><strong>Apply appropriate rules</strong> based on form and weakness</li>
          <li><strong>Conjugate systematically</strong> for all persons and tenses</li>
        </ol>

        <h3>Practice Set 1: Sound Verbs (الأفعال الصحيحة)</h3>
        <div class="activity-box">
          <h4>Conjugate These Sound Verbs</h4>
          <table>
            <tr>
              <th>Verb</th>
              <th>Root</th>
              <th>Form</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td><span class="arabic">كَتَبَ</span></td>
              <td>ك-ت-ب</td>
              <td>I</td>
              <td>to write</td>
            </tr>
            <tr>
              <td><span class="arabic">عَلَّمَ</span></td>
              <td>ع-ل-م</td>
              <td>II</td>
              <td>to teach</td>
            </tr>
            <tr>
              <td><span class="arabic">جَاهَدَ</span></td>
              <td>ج-ه-د</td>
              <td>III</td>
              <td>to strive</td>
            </tr>
            <tr>
              <td><span class="arabic">أَكْرَمَ</span></td>
              <td>ك-ر-م</td>
              <td>IV</td>
              <td>to honor</td>
            </tr>
          </table>
          <p><strong>Task:</strong> Conjugate each in past, present, and command for هو, أنتَ, and أنا</p>
        </div>

        <h3>Practice Set 2: Mithal Verbs (المثال)</h3>
        <div class="activity-box">
          <h4>First Radical Weak Verbs</h4>
          <table>
            <tr>
              <th>Verb</th>
              <th>Root</th>
              <th>Present (هو)</th>
              <th>Command (أنتَ)</th>
            </tr>
            <tr>
              <td><span class="arabic">وَجَدَ</span></td>
              <td>و-ج-د</td>
              <td>يَ___ُ</td>
              <td>___!</td>
            </tr>
            <tr>
              <td><span class="arabic">وَصَلَ</span></td>
              <td>و-ص-ل</td>
              <td>يَ___ُ</td>
              <td>___!</td>
            </tr>
            <tr>
              <td><span class="arabic">وَضَعَ</span></td>
              <td>و-ض-ع</td>
              <td>يَ___ُ</td>
              <td>___!</td>
            </tr>
          </table>
          <p><strong>Remember:</strong> The و drops in present tense Form I with kasra</p>
        </div>

        <h3>Practice Set 3: Ajwaf Verbs (الأجوف)</h3>
        <div class="activity-box">
          <h4>Middle Radical Weak Verbs</h4>
          <table>
            <tr>
              <th>Verb</th>
              <th>Root</th>
              <th>Past (أنتَ)</th>
              <th>Present (هو)</th>
              <th>Command</th>
            </tr>
            <tr>
              <td><span class="arabic">قَالَ</span></td>
              <td>ق-و-ل</td>
              <td>___تَ</td>
              <td>يَ___ُ</td>
              <td>___!</td>
            </tr>
            <tr>
              <td><span class="arabic">صَامَ</span></td>
              <td>ص-و-م</td>
              <td>___تَ</td>
              <td>يَ___ُ</td>
              <td>___!</td>
            </tr>
            <tr>
              <td><span class="arabic">بَاعَ</span></td>
              <td>ب-ي-ع</td>
              <td>___تَ</td>
              <td>يَ___ُ</td>
              <td>___!</td>
            </tr>
          </table>
          <p><strong>Key:</strong> و/ي becomes ا in past, long vowel in present</p>
        </div>

        <h3>Practice Set 4: Nāqiṣ Verbs (الناقص)</h3>
        <div class="activity-box">
          <h4>Final Radical Weak Verbs</h4>
          <table>
            <tr>
              <th>Verb</th>
              <th>Root</th>
              <th>Past (هو)</th>
              <th>Past (أنتَ)</th>
              <th>Present (هو)</th>
            </tr>
            <tr>
              <td><span class="arabic">دَعَا</span></td>
              <td>د-ع-و</td>
              <td>دَ___</td>
              <td>دَ___تَ</td>
              <td>يَدْ___</td>
            </tr>
            <tr>
              <td><span class="arabic">رَمَى</span></td>
              <td>ر-م-ي</td>
              <td>رَ___</td>
              <td>رَ___تَ</td>
              <td>يَرْ___</td>
            </tr>
            <tr>
              <td><span class="arabic">مَشَى</span></td>
              <td>م-ش-ي</td>
              <td>مَ___</td>
              <td>مَ___تَ</td>
              <td>يَمْ___</td>
            </tr>
          </table>
        </div>

        <h3>Practice Set 5: Higher Forms with Weak Verbs</h3>
        <div class="activity-box">
          <h4>Forms II-X with Weak Roots</h4>
          <p>Convert these Form I verbs to the specified higher forms:</p>
          <table>
            <tr>
              <th>Form I</th>
              <th>Convert to Form</th>
              <th>Expected Result</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td><span class="arabic">قَالَ</span></td>
              <td>II</td>
              <td><span class="arabic">قَوَّلَ</span></td>
              <td>to make say/fabricate</td>
            </tr>
            <tr>
              <td><span class="arabic">دَعَا</span></td>
              <td>VIII</td>
              <td><span class="arabic">ادَّعَى</span></td>
              <td>to claim</td>
            </tr>
            <tr>
              <td><span class="arabic">وَصَلَ</span></td>
              <td>V</td>
              <td><span class="arabic">تَوَصَّلَ</span></td>
              <td>to reach/attain</td>
            </tr>
            <tr>
              <td><span class="arabic">وَقَى</span></td>
              <td>VIII</td>
              <td><span class="arabic">اتَّقَى</span></td>
              <td>to fear/be conscious of Allah</td>
            </tr>
          </table>
        </div>

        <h3>Advanced Exercise: Complete Paradigm</h3>
        <div class="activity-box">
          <h4>Full Conjugation Challenge</h4>
          <p>Completely conjugate <span class="arabic">نَصَرَ</span> (to help) Form I in all tenses and persons:</p>
          <table>
            <tr>
              <th>Person</th>
              <th>Past</th>
              <th>Present</th>
              <th>Command</th>
              <th>Jussive</th>
            </tr>
            <tr>
              <td>هو</td>
              <td><span class="arabic">نَصَرَ</span></td>
              <td><span class="arabic">يَنْصُرُ</span></td>
              <td>-</td>
              <td><span class="arabic">يَنْصُرْ</span></td>
            </tr>
            <tr>
              <td>هي</td>
              <td>___</td>
              <td>___</td>
              <td>-</td>
              <td>___</td>
            </tr>
            <tr>
              <td>أنتَ</td>
              <td>___</td>
              <td>___</td>
              <td>___</td>
              <td>___</td>
            </tr>
            <tr>
              <td>أنتِ</td>
              <td>___</td>
              <td>___</td>
              <td>___</td>
              <td>___</td>
            </tr>
            <tr>
              <td>أنا</td>
              <td>___</td>
              <td>___</td>
              <td>-</td>
              <td>___</td>
            </tr>
            <tr>
              <td>هما (dual m.)</td>
              <td>___</td>
              <td>___</td>
              <td>-</td>
              <td>___</td>
            </tr>
            <tr>
              <td>هم</td>
              <td>___</td>
              <td>___</td>
              <td>-</td>
              <td>___</td>
            </tr>
            <tr>
              <td>أنتم</td>
              <td>___</td>
              <td>___</td>
              <td>___</td>
              <td>___</td>
            </tr>
          </table>
        </div>

        <h3>Real Text Analysis</h3>
        <div class="quran-box">
          <h4>Identify and Analyze Verbs from Quran</h4>
          <p><span class="arabic">قُلْ هُوَ اللَّهُ أَحَدٌ</span></p>
          <ul>
            <li><strong>قُلْ:</strong> Root? Form? Type? Complete conjugation?</li>
          </ul>

          <p><span class="arabic">رَبِّ اشْرَحْ لِي صَدْرِي</span></p>
          <ul>
            <li><strong>اشْرَحْ:</strong> Root? Form? Type? Why this vowel pattern?</li>
          </ul>

          <p><span class="arabic">وَقَالُوا سَمِعْنَا وَأَطَعْنَا</span></p>
          <ul>
            <li><strong>قَالُوا:</strong> Root? Original form? Changes applied?</li>
            <li><strong>سَمِعْنَا:</strong> Root? Form? Sound or weak?</li>
            <li><strong>أَطَعْنَا:</strong> Root? Form? Why this pattern?</li>
          </ul>
        </div>

        <h3>Morphological Transformation Drill</h3>
        <div class="activity-box">
          <h4>Transform the Same Root Through All Forms</h4>
          <p>Take the root <strong>ن-ص-ر</strong> and create Forms I-X:</p>
          <table>
            <tr>
              <th>Form</th>
              <th>Past</th>
              <th>Present</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>I</td>
              <td><span class="arabic">نَصَرَ</span></td>
              <td><span class="arabic">يَنْصُرُ</span></td>
              <td>to help</td>
            </tr>
            <tr>
              <td>II</td>
              <td>___</td>
              <td>___</td>
              <td>?</td>
            </tr>
            <tr>
              <td>III</td>
              <td>___</td>
              <td>___</td>
              <td>?</td>
            </tr>
            <tr>
              <td>IV</td>
              <td>___</td>
              <td>___</td>
              <td>?</td>
            </tr>
            <tr>
              <td>V-X</td>
              <td colspan="3">Continue...</td>
            </tr>
          </table>
        </div>

        <h3>Common Mistakes to Avoid</h3>
        <div class="warning-box">
          <h4>⚠️ Frequent Errors in Sarf</h4>
          <ol>
            <li><strong>Confusing weak verb types:</strong> Know which position has the weak letter</li>
            <li><strong>Forgetting Form meanings:</strong> Form II ≠ Form IV (both causative but different)</li>
            <li><strong>Ignoring vowel patterns:</strong> Present tense varies (يَفْعَلُ، يَفْعِلُ، يَفْعُلُ)</li>
            <li><strong>Misapplying rules:</strong> Mithal rules only apply to Form I usually</li>
            <li><strong>Not recognizing the root:</strong> Remove all added letters first</li>
          </ol>
        </div>

        <h3>Final Mastery Checklist</h3>
        <div class="important-box">
          <h4>✓ Can You Do These?</h4>
          <ul>
            <li>✓ Identify the three root letters of any Arabic verb</li>
            <li>✓ Determine which form (I-X) a verb belongs to</li>
            <li>✓ Recognize all four types of weak verbs (Mithal, Ajwaf, Nāqiṣ, Lafeef)</li>
            <li>✓ Conjugate sound verbs in all forms and tenses</li>
            <li>✓ Apply appropriate rules for each weak verb type</li>
            <li>✓ Convert verbs between different forms (I → II → III, etc.)</li>
            <li>✓ Understand the meaning changes in each form</li>
            <li>✓ Analyze verbs in Quranic and classical texts</li>
            <li>✓ Construct correct command and jussive forms</li>
            <li>✓ Use the morphological scale (الميزان الصرفي) accurately</li>
          </ul>
        </div>

        <div class="quran-box">
          <h4>Closing Wisdom</h4>
          <p>The scholars say:</p>
          <p class="arabic-large"><span class="arabic">مَنْ أَرَادَ أَنْ يَفْهَمَ الْقُرْآنَ فَلْيُتْقِنِ الصَّرْفَ</span></p>
          <p>"Whoever wants to understand the Quran, let him master Sarf"</p>
          <p>With the knowledge of Sarf, you can now understand the subtle meanings, grammatical structures, and linguistic beauty of the Arabic language, especially in the Quran and Hadith.</p>
        </div>

        <div class="activity-box">
          <h4>Continue Your Journey</h4>
          <p>Now that you've completed this course, continue practicing with:</p>
          <ul>
            <li>Classical Sarf texts like <strong>البناء والأساس</strong> or <strong>الصرف الواضح</strong></li>
            <li>Analyzing verbs in Quranic tafseer</li>
            <li>Reading authentic hadith collections</li>
            <li>Studying classical Arabic poetry</li>
            <li>Teaching others what you've learned</li>
          </ul>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 8: Comprehensive Practice');

  console.log('');
  console.log('✅ Part 4 completed: Created units 7-8');
  console.log('📊 Progress: All 8 units completed!');
  console.log('');
}

async function main() {
  try {
    await seedSarfCoursePart4();
    console.log('✨ Sarf course seed Part 4 completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Sarf course Part 4:', error);
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
