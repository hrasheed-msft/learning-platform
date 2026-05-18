import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Advanced Sarf Course - Part 2
 * Units 3-4: Verb Forms VI-X and Weak Verbs (Mithal)
 */

export async function seedSarfCoursePart2() {
  console.log('📚 Continuing Sarf course seed - Part 2...');
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

  // Unit 3: The Ten Verb Forms - Part 2 (Forms VI-X)
  const unit3 = await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'The Ten Verb Forms (VI-X) - Advanced Patterns',
      description: 'Mastering the advanced verb forms VI through X with nuanced meanings',
      orderIndex: 3,
      content: `
        <h2>Advanced Verb Forms (VI-X)</h2>
        <p>These forms represent more complex patterns with specific semantic nuances.</p>

        <h3>Form VI (الوزن السادس) - تَفَاعَلَ</h3>
        <p><strong>Pattern:</strong> <span class="arabic">تَفَاعَلَ - يَتَفَاعَلُ</span> (tafā'ala - yatafā'alu)</p>
        <p><strong>Added Letters:</strong> ت at the beginning + ا after first radical</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li><strong>Reflexive of Form III:</strong> Mutual action done by both parties</li>
          <li><strong>Pretending:</strong> Pretending to have a quality (more than Form V)</li>
          <li><strong>Gradual Reciprocity:</strong> Gradually engaging in mutual action</li>
        </ul>

        <div class="example-box">
          <h4>Examples of Form VI</h4>
          <table>
            <tr>
              <th>Form III</th>
              <th>Form VI</th>
              <th>Relationship</th>
            </tr>
            <tr>
              <td><span class="arabic">قَاتَلَ</span> (qātala - fought)</td>
              <td><span class="arabic">تَقَاتَلَ</span> (taqātala)</td>
              <td>fought each other (mutual)</td>
            </tr>
            <tr>
              <td><span class="arabic">بَاعَدَ</span> (bā'ada - distanced)</td>
              <td><span class="arabic">تَبَاعَدَ</span> (tabā'ada)</td>
              <td>distanced oneself mutually</td>
            </tr>
            <tr>
              <td><span class="arabic">عَارَفَ</span> ('ārafa - knew each other)</td>
              <td><span class="arabic">تَعَارَفَ</span> (ta'ārafa)</td>
              <td>got to know each other</td>
            </tr>
          </table>
        </div>

        <div class="quran-box">
          <h4>Quranic Example</h4>
          <p><span class="arabic">وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا</span></p>
          <p>"And We made you peoples and tribes that you may know one another" (Hujurat 49:13)</p>
        </div>

        <h3>Form VII (الوزن السابع) - انْفَعَلَ</h3>
        <p><strong>Pattern:</strong> <span class="arabic">انْفَعَلَ - يَنْفَعِلُ</span> (infa'ala - yanfa'ilu)</p>
        <p><strong>Added Letters:</strong> ا and ن at the beginning</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li><strong>Passive/Reflexive:</strong> The action happens to the subject (passive sense)</li>
          <li><strong>Submission:</strong> Yielding to an action</li>
        </ul>

        <div class="example-box">
          <h4>Examples of Form VII</h4>
          <table>
            <tr>
              <th>Form I</th>
              <th>Form VII</th>
              <th>Change in Meaning</th>
            </tr>
            <tr>
              <td><span class="arabic">كَسَرَ</span> (kasara - broke)</td>
              <td><span class="arabic">انْكَسَرَ</span> (inkasara)</td>
              <td>was broken/broke (intrans.)</td>
            </tr>
            <tr>
              <td><span class="arabic">قَطَعَ</span> (qaṭa'a - cut)</td>
              <td><span class="arabic">انْقَطَعَ</span> (inqaṭa'a)</td>
              <td>was cut off/discontinued</td>
            </tr>
            <tr>
              <td><span class="arabic">صَرَفَ</span> (ṣarafa - turned away)</td>
              <td><span class="arabic">انْصَرَفَ</span> (inṣarafa)</td>
              <td>turned away/left</td>
            </tr>
          </table>
        </div>

        <div class="important-box">
          <h4>Important Note on Form VII</h4>
          <p>Form VII is often passive or reflexive in meaning. It's commonly used for verbs indicating breaking, splitting, or changing state.</p>
        </div>

        <h3>Form VIII (الوزن الثامن) - افْتَعَلَ</h3>
        <p><strong>Pattern:</strong> <span class="arabic">افْتَعَلَ - يَفْتَعِلُ</span> (ifta'ala - yafta'ilu)</p>
        <p><strong>Added Letters:</strong> ا at the beginning + ت after first radical</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li><strong>Reflexive:</strong> Doing the action for oneself</li>
          <li><strong>Acquisition:</strong> Acquiring or seeking something</li>
          <li><strong>Reciprocity:</strong> Sometimes mutual action</li>
          <li><strong>Intensification:</strong> Emphasizing the action</li>
        </ul>

        <div class="example-box">
          <h4>Examples of Form VIII</h4>
          <table>
            <tr>
              <th>Root</th>
              <th>Form VIII</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>ج-م-ع (gather)</td>
              <td><span class="arabic">اجْتَمَعَ</span> (ijtama'a)</td>
              <td>gathered/assembled (themselves)</td>
            </tr>
            <tr>
              <td>ك-س-ب (earn)</td>
              <td><span class="arabic">اكْتَسَبَ</span> (iktasaba)</td>
              <td>earned/acquired (for oneself)</td>
            </tr>
            <tr>
              <td>خ-ت-ر (chose)</td>
              <td><span class="arabic">اخْتَارَ</span> (ikhtāra)</td>
              <td>chose/selected (for oneself)</td>
            </tr>
          </table>
        </div>

        <div class="quran-box">
          <h4>Quranic Examples</h4>
          <p><span class="arabic">وَاصْطَبِرْ لِعِبَادَتِهِ</span></p>
          <p>"And be patient for His worship" (Maryam 19:65) - Note: <span class="arabic">اصْطَبِرْ</span> is Form VIII from ص-ب-ر</p>
        </div>

        <h3>Form IX (الوزن التاسع) - افْعَلَّ</h3>
        <p><strong>Pattern:</strong> <span class="arabic">افْعَلَّ - يَفْعَلُّ</span> (if'alla - yaf'allu)</p>
        <p><strong>Added Letters:</strong> ا at the beginning + doubling of third radical</p>
        <p><strong>Meaning:</strong> <strong>Colors and physical defects</strong></p>
        <p>This form is specifically used for acquiring colors or developing physical characteristics.</p>

        <div class="example-box">
          <h4>Examples of Form IX (Colors)</h4>
          <table>
            <tr>
              <th>Root</th>
              <th>Form IX</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>ح-م-ر (red)</td>
              <td><span class="arabic">احْمَرَّ</span> (iḥmarra)</td>
              <td>became red/reddened</td>
            </tr>
            <tr>
              <td>ص-ف-ر (yellow)</td>
              <td><span class="arabic">اصْفَرَّ</span> (iṣfarra)</td>
              <td>became yellow/yellowed</td>
            </tr>
            <tr>
              <td>ب-ي-ض (white)</td>
              <td><span class="arabic">ابْيَضَّ</span> (ibyaḍḍa)</td>
              <td>became white/whitened</td>
            </tr>
            <tr>
              <td>س-و-د (black)</td>
              <td><span class="arabic">اسْوَدَّ</span> (iswadda)</td>
              <td>became black/blackened</td>
            </tr>
          </table>
        </div>

        <h3>Form X (الوزن العاشر) - اسْتَفْعَلَ</h3>
        <p><strong>Pattern:</strong> <span class="arabic">اسْتَفْعَلَ - يَسْتَفْعِلُ</span> (istaf'ala - yastaf'ilu)</p>
        <p><strong>Added Letters:</strong> ا, س, and ت at the beginning</p>
        <p><strong>Meanings:</strong></p>
        <ul>
          <li><strong>Seeking/Requesting:</strong> Seeking or asking for something</li>
          <li><strong>Considering/Deeming:</strong> Considering something to have a quality</li>
          <li><strong>Transformation:</strong> Becoming or turning into something</li>
        </ul>

        <div class="example-box">
          <h4>Examples of Form X</h4>
          <table>
            <tr>
              <th>Root</th>
              <th>Form X</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>غ-ف-ر (forgive)</td>
              <td><span class="arabic">اسْتَغْفَرَ</span> (istaghfara)</td>
              <td>sought forgiveness</td>
            </tr>
            <tr>
              <td>ع-ج-ل (hasten)</td>
              <td><span class="arabic">اسْتَعْجَلَ</span> (ista'jala)</td>
              <td>sought to hasten/hurried</td>
            </tr>
            <tr>
              <td>ح-س-ن (good)</td>
              <td><span class="arabic">اسْتَحْسَنَ</span> (istaḥsana)</td>
              <td>deemed good/approved</td>
            </tr>
            <tr>
              <td>ك-ب-ر (great)</td>
              <td><span class="arabic">اسْتَكْبَرَ</span> (istakbara)</td>
              <td>became arrogant/proud</td>
            </tr>
          </table>
        </div>

        <div class="quran-box">
          <h4>Quranic Examples</h4>
          <p><span class="arabic">وَاسْتَغْفِرُوا اللَّهَ</span></p>
          <p>"And seek forgiveness of Allah" (Nisa 4:106)</p>
          <p><span class="arabic">فَاسْتَخَفَّ قَوْمَهُ</span></p>
          <p>"And he made light of his people" (Zukhruf 43:54)</p>
        </div>

        <div class="important-box">
          <h4>Complete Summary: All Ten Forms</h4>
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
              <td>Reciprocity/Attempting</td>
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
            <tr>
              <td>VI</td>
              <td><span class="arabic">تَفَاعَلَ</span></td>
              <td>Mutual/Pretending</td>
            </tr>
            <tr>
              <td>VII</td>
              <td><span class="arabic">انْفَعَلَ</span></td>
              <td>Passive/Reflexive</td>
            </tr>
            <tr>
              <td>VIII</td>
              <td><span class="arabic">افْتَعَلَ</span></td>
              <td>Reflexive/Acquisition</td>
            </tr>
            <tr>
              <td>IX</td>
              <td><span class="arabic">افْعَلَّ</span></td>
              <td>Colors/Defects</td>
            </tr>
            <tr>
              <td>X</td>
              <td><span class="arabic">اسْتَفْعَلَ</span></td>
              <td>Seeking/Considering</td>
            </tr>
          </table>
        </div>

        <div class="activity-box">
          <h4>Comprehensive Practice</h4>
          <p>Convert these Form I verbs to the specified forms:</p>
          <ol>
            <li><span class="arabic">نَصَرَ</span> → Form VI</li>
            <li><span class="arabic">فَتَحَ</span> → Form VII</li>
            <li><span class="arabic">جَمَعَ</span> → Form VIII</li>
            <li><span class="arabic">خَضَرَ</span> (green) → Form IX</li>
            <li><span class="arabic">عَمَلَ</span> → Form X</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 3: Verb Forms VI-X');

  // Unit 4: Weak Verbs - Mithal (المثال)
  const unit4 = await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Weak Verbs: Mithal (First Radical Weak)',
      description: 'Understanding verbs with و or ي as the first radical letter',
      orderIndex: 4,
      content: `
        <h2>Introduction to Weak Verbs (الأفعال المعتلة)</h2>
        <p>Weak verbs (Mu'tall) contain one or more weak letters (و، ي، ا) in their root. These letters undergo changes during conjugation that must be mastered.</p>

        <div class="important-box">
          <h4>The Three Weak Letters (حروف العلة)</h4>
          <p><span class="arabic">و، ي، ا</span> (wāw, yā', alif)</p>
          <p>When these letters appear in verb roots, they create special conjugation patterns.</p>
        </div>

        <h3>Types of Weak Verbs</h3>
        <ul>
          <li><strong>Mithal (المثال):</strong> First radical is weak (و or ي)</li>
          <li><strong>Ajwaf (الأجوف):</strong> Second radical is weak (و or ي)</li>
          <li><strong>Nāqiṣ (الناقص):</strong> Third radical is weak (و or ي)</li>
          <li><strong>Lafeef (اللفيف):</strong> Two radicals are weak</li>
        </ul>

        <h2>Mithal Verbs (المثال) - First Radical Weak</h2>
        <p>These verbs have و or ي as their first radical letter.</p>

        <h3>Types of Mithal Verbs</h3>
        <p>There are two categories:</p>
        <ul>
          <li><strong>Mithal Wāwī (المثال الواوي):</strong> First radical is و</li>
          <li><strong>Mithal Yā'ī (المثال اليائي):</strong> First radical is ي (rare)</li>
        </ul>

        <h3>The Key Rule for Mithal Verbs</h3>
        <div class="important-box">
          <p><strong>In the present tense (مضارع), the weak و is dropped when:</strong></p>
          <ul>
            <li>The verb is Form I with kasra on the middle radical in present tense</li>
            <li>Example: <span class="arabic">يَوْعِدُ → يَعِدُ</span></li>
          </ul>
          <p><strong>The و remains in all other forms and tenses.</strong></p>
        </div>

        <h3>Example 1: <span class="arabic">وَعَدَ</span> (wa'ada - to promise)</h3>
        <p>Root: و-ع-د</p>

        <div class="example-box">
          <h4>Conjugation of وَعَدَ</h4>
          <table>
            <tr>
              <th>Tense</th>
              <th>Full Form</th>
              <th>Actual Form</th>
              <th>Transliteration</th>
            </tr>
            <tr>
              <td>Past (هو)</td>
              <td><span class="arabic">وَعَدَ</span></td>
              <td><span class="arabic">وَعَدَ</span></td>
              <td>wa'ada</td>
            </tr>
            <tr>
              <td>Present (هو)</td>
              <td><span class="arabic">يَوْعِدُ</span></td>
              <td><span class="arabic">يَعِدُ</span></td>
              <td>ya'idu (و dropped)</td>
            </tr>
            <tr>
              <td>Command (أنت)</td>
              <td><span class="arabic">اوْعِدْ</span></td>
              <td><span class="arabic">عِدْ</span></td>
              <td>'id (و dropped)</td>
            </tr>
          </table>
        </div>

        <h3>Example 2: <span class="arabic">وَجَدَ</span> (wajada - to find)</h3>
        <p>Root: و-ج-د</p>

        <div class="example-box">
          <h4>Conjugation of وَجَدَ</h4>
          <table>
            <tr>
              <th>Tense</th>
              <th>Form</th>
              <th>Transliteration</th>
            </tr>
            <tr>
              <td>Past (هو)</td>
              <td><span class="arabic">وَجَدَ</span></td>
              <td>wajada</td>
            </tr>
            <tr>
              <td>Present (هو)</td>
              <td><span class="arabic">يَجِدُ</span></td>
              <td>yajidu (و dropped)</td>
            </tr>
            <tr>
              <td>Command (أنت)</td>
              <td><span class="arabic">جِدْ</span></td>
              <td>jid (و dropped)</td>
            </tr>
          </table>
        </div>

        <h3>Example 3: <span class="arabic">وَصَلَ</span> (waṣala - to arrive/connect)</h3>
        <div class="example-box">
          <h4>Full Conjugation Chart</h4>
          <table>
            <tr>
              <th>Person</th>
              <th>Past</th>
              <th>Present</th>
            </tr>
            <tr>
              <td>هو (He)</td>
              <td><span class="arabic">وَصَلَ</span></td>
              <td><span class="arabic">يَصِلُ</span></td>
            </tr>
            <tr>
              <td>هي (She)</td>
              <td><span class="arabic">وَصَلَتْ</span></td>
              <td><span class="arabic">تَصِلُ</span></td>
            </tr>
            <tr>
              <td>أنتَ (You m.)</td>
              <td><span class="arabic">وَصَلْتَ</span></td>
              <td><span class="arabic">تَصِلُ</span></td>
            </tr>
            <tr>
              <td>أنا (I)</td>
              <td><span class="arabic">وَصَلْتُ</span></td>
              <td><span class="arabic">أَصِلُ</span></td>
            </tr>
          </table>
        </div>

        <h3>Mithal Verbs in Higher Forms</h3>
        <p>In Forms II, IV, V, VI, VIII, and X, the و generally remains:</p>

        <div class="example-box">
          <h4>Higher Forms of وَصَلَ</h4>
          <table>
            <tr>
              <th>Form</th>
              <th>Past</th>
              <th>Present</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>II</td>
              <td><span class="arabic">وَصَّلَ</span></td>
              <td><span class="arabic">يُوَصِّلُ</span></td>
              <td>to deliver/connect</td>
            </tr>
            <tr>
              <td>IV</td>
              <td><span class="arabic">أَوْصَلَ</span></td>
              <td><span class="arabic">يُوصِلُ</span></td>
              <td>to convey/deliver</td>
            </tr>
            <tr>
              <td>V</td>
              <td><span class="arabic">تَوَصَّلَ</span></td>
              <td><span class="arabic">يَتَوَصَّلُ</span></td>
              <td>to reach/attain</td>
            </tr>
          </table>
        </div>

        <h3>Common Mithal Verbs to Master</h3>
        <div class="example-box">
          <table>
            <tr>
              <th>Root</th>
              <th>Past</th>
              <th>Present</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>و-ق-ف</td>
              <td><span class="arabic">وَقَفَ</span></td>
              <td><span class="arabic">يَقِفُ</span></td>
              <td>to stand/stop</td>
            </tr>
            <tr>
              <td>و-ل-د</td>
              <td><span class="arabic">وَلَدَ</span></td>
              <td><span class="arabic">يَلِدُ</span></td>
              <td>to give birth</td>
            </tr>
            <tr>
              <td>و-ر-ث</td>
              <td><span class="arabic">وَرِثَ</span></td>
              <td><span class="arabic">يَرِثُ</span></td>
              <td>to inherit</td>
            </tr>
            <tr>
              <td>و-ض-ع</td>
              <td><span class="arabic">وَضَعَ</span></td>
              <td><span class="arabic">يَضَعُ</span></td>
              <td>to put/place</td>
            </tr>
          </table>
        </div>

        <div class="quran-box">
          <h4>Quranic Examples</h4>
          <p><span class="arabic">وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ</span></p>
          <p>"And whoever fears Allah, He will make for him a way out and provide for him from where he does not expect" (Talaq 65:2-3)</p>
          <p>Note: <span class="arabic">يَجْعَل</span> is from و-ج-ع (Mithal verb)</p>
        </div>

        <div class="activity-box">
          <h4>Practice: Mithal Verbs</h4>
          <p>Conjugate these Mithal verbs in the present tense:</p>
          <ol>
            <li><span class="arabic">وَقَعَ</span> (waqa'a - to fall) → يَ___ُ</li>
            <li><span class="arabic">وَصَفَ</span> (waṣafa - to describe) → يَ___ُ</li>
            <li><span class="arabic">وَجَبَ</span> (wajaba - to be necessary) → يَ___ُ</li>
          </ol>
        </div>

        <div class="important-box">
          <h4>Summary: Mithal Verbs Rules</h4>
          <ol>
            <li>First radical is و (rarely ي)</li>
            <li>In Form I present tense with kasra, the و drops</li>
            <li>In imperative (command), the و also drops</li>
            <li>In past tense and higher forms, the و usually remains</li>
            <li>Master common verbs: وَجَدَ، وَصَلَ، وَقَفَ، وَعَدَ</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 4: Mithal Verbs');

  console.log('');
  console.log('✅ Part 2 completed: Created units 3-4');
  console.log('📊 Progress: Units 1-4 of 8 completed');
  console.log('');
}

async function main() {
  try {
    await seedSarfCoursePart2();
    console.log('✨ Sarf course seed Part 2 completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Sarf course Part 2:', error);
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
