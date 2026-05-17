import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Advanced Sarf Course - Part 3
 * Units 5-6: Ajwaf and Naqis Verbs
 */

export async function seedSarfCoursePart3() {
  console.log('📚 Continuing Sarf course seed - Part 3...');
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

  // Unit 5: Weak Verbs - Ajwaf (الأجوف)
  const unit5 = await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Weak Verbs: Ajwaf (Middle Radical Weak)',
      titleArabic: 'الفعل المعتل - الأجوف',
      description: 'Mastering verbs with و or ي as the middle (second) radical',
      orderIndex: 5,
      content: `
        <h2>Ajwaf Verbs (الأجوف) - Middle Radical Weak</h2>
        <p>Ajwaf verbs have a weak letter (و or ي) as their second radical. These verbs undergo significant changes, especially in Form I.</p>

        <div class="important-box">
          <h4>Key Characteristic</h4>
          <p>The word "أجوف" means "hollow" - the middle of the verb is "hollowed out" when the weak letter transforms or disappears.</p>
        </div>

        <h3>Types of Ajwaf Verbs</h3>
        <ul>
          <li><strong>Ajwaf Wāwī (الأجوف الواوي):</strong> Middle radical is و (most common)</li>
          <li><strong>Ajwaf Yā'ī (الأجوف اليائي):</strong> Middle radical is ي</li>
        </ul>

        <h3>The Main Rule for Ajwaf Verbs</h3>
        <div class="important-box">
          <p><strong>In Form I, when the weak middle letter has no vowel (sakoon), it transforms or disappears:</strong></p>
          <ul>
            <li>If و is between فتحة and فتحة → it becomes ا (alif)</li>
            <li>If و/ي has sukoon → it often gets deleted</li>
            <li>The vowels merge or compensate for the missing letter</li>
          </ul>
        </div>

        <h3>Example 1: <span class="arabic">قَالَ</span> (qāla - to say)</h3>
        <p>Root: ق-و-ل (the و is the middle radical)</p>

        <div class="example-box">
          <h4>Past Tense Conjugation of قَالَ</h4>
          <table>
            <tr>
              <th>Person</th>
              <th>Theoretical Form</th>
              <th>Actual Form</th>
              <th>Transliteration</th>
            </tr>
            <tr>
              <td>هو (He)</td>
              <td><span class="arabic">قَوَلَ</span></td>
              <td><span class="arabic">قَالَ</span></td>
              <td>qāla (و → ا)</td>
            </tr>
            <tr>
              <td>هي (She)</td>
              <td><span class="arabic">قَوَلَتْ</span></td>
              <td><span class="arabic">قَالَتْ</span></td>
              <td>qālat</td>
            </tr>
            <tr>
              <td>هم (They)</td>
              <td><span class="arabic">قَوَلُوا</span></td>
              <td><span class="arabic">قَالُوا</span></td>
              <td>qālū</td>
            </tr>
            <tr>
              <td>أنتَ (You m.)</td>
              <td><span class="arabic">قَوَلْتَ</span></td>
              <td><span class="arabic">قُلْتَ</span></td>
              <td>qulta (و deleted, vowel changed)</td>
            </tr>
            <tr>
              <td>أنا (I)</td>
              <td><span class="arabic">قَوَلْتُ</span></td>
              <td><span class="arabic">قُلْتُ</span></td>
              <td>qultu</td>
            </tr>
          </table>
        </div>

        <div class="example-box">
          <h4>Present Tense Conjugation of قَالَ</h4>
          <table>
            <tr>
              <th>Person</th>
              <th>Theoretical Form</th>
              <th>Actual Form</th>
              <th>Transliteration</th>
            </tr>
            <tr>
              <td>هو (He)</td>
              <td><span class="arabic">يَقْوُلُ</span></td>
              <td><span class="arabic">يَقُولُ</span></td>
              <td>yaqūlu (و → ū)</td>
            </tr>
            <tr>
              <td>هي (She)</td>
              <td><span class="arabic">تَقْوُلُ</span></td>
              <td><span class="arabic">تَقُولُ</span></td>
              <td>taqūlu</td>
            </tr>
            <tr>
              <td>أنتَ (You m.)</td>
              <td><span class="arabic">تَقْوُلُ</span></td>
              <td><span class="arabic">تَقُولُ</span></td>
              <td>taqūlu</td>
            </tr>
            <tr>
              <td>أنا (I)</td>
              <td><span class="arabic">أَقْوُلُ</span></td>
              <td><span class="arabic">أَقُولُ</span></td>
              <td>aqūlu</td>
            </tr>
          </table>
        </div>

        <div class="example-box">
          <h4>Command (Imperative) of قَالَ</h4>
          <table>
            <tr>
              <th>Person</th>
              <th>Form</th>
              <th>Transliteration</th>
            </tr>
            <tr>
              <td>أنتَ (You m.)</td>
              <td><span class="arabic">قُلْ</span></td>
              <td>qul</td>
            </tr>
            <tr>
              <td>أنتِ (You f.)</td>
              <td><span class="arabic">قُولِي</span></td>
              <td>qūlī</td>
            </tr>
            <tr>
              <td>أنتم (You pl.)</td>
              <td><span class="arabic">قُولُوا</span></td>
              <td>qūlū</td>
            </tr>
          </table>
        </div>

        <h3>Example 2: <span class="arabic">بَاعَ</span> (bā'a - to sell)</h3>
        <p>Root: ب-ي-ع (the ي is the middle radical)</p>

        <div class="example-box">
          <h4>Conjugation of بَاعَ</h4>
          <table>
            <tr>
              <th>Tense</th>
              <th>Person</th>
              <th>Form</th>
              <th>Transliteration</th>
            </tr>
            <tr>
              <td rowspan="2">Past</td>
              <td>هو</td>
              <td><span class="arabic">بَاعَ</span></td>
              <td>bā'a (ي → ا)</td>
            </tr>
            <tr>
              <td>أنتَ</td>
              <td><span class="arabic">بِعْتَ</span></td>
              <td>bi'ta</td>
            </tr>
            <tr>
              <td rowspan="2">Present</td>
              <td>هو</td>
              <td><span class="arabic">يَبِيعُ</span></td>
              <td>yabī'u (ي → ī)</td>
            </tr>
            <tr>
              <td>أنتَ</td>
              <td><span class="arabic">تَبِيعُ</span></td>
              <td>tabī'u</td>
            </tr>
            <tr>
              <td>Command</td>
              <td>أنتَ</td>
              <td><span class="arabic">بِعْ</span></td>
              <td>bi'</td>
            </tr>
          </table>
        </div>

        <h3>Common Ajwaf Verbs to Master</h3>
        <div class="example-box">
          <h4>Ajwaf Wāwī (و in the middle)</h4>
          <table>
            <tr>
              <th>Root</th>
              <th>Past</th>
              <th>Present</th>
              <th>Command</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>ق-و-م</td>
              <td><span class="arabic">قَامَ</span></td>
              <td><span class="arabic">يَقُومُ</span></td>
              <td><span class="arabic">قُمْ</span></td>
              <td>to stand up</td>
            </tr>
            <tr>
              <td>ص-و-م</td>
              <td><span class="arabic">صَامَ</span></td>
              <td><span class="arabic">يَصُومُ</span></td>
              <td><span class="arabic">صُمْ</span></td>
              <td>to fast</td>
            </tr>
            <tr>
              <td>ن-و-م</td>
              <td><span class="arabic">نَامَ</span></td>
              <td><span class="arabic">يَنَامُ</span></td>
              <td><span class="arabic">نَمْ</span></td>
              <td>to sleep</td>
            </tr>
            <tr>
              <td>خ-و-ف</td>
              <td><span class="arabic">خَافَ</span></td>
              <td><span class="arabic">يَخَافُ</span></td>
              <td><span class="arabic">خَفْ</span></td>
              <td>to fear</td>
            </tr>
          </table>
        </div>

        <div class="example-box">
          <h4>Ajwaf Yā'ī (ي in the middle)</h4>
          <table>
            <tr>
              <th>Root</th>
              <th>Past</th>
              <th>Present</th>
              <th>Command</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>ب-ي-ع</td>
              <td><span class="arabic">بَاعَ</span></td>
              <td><span class="arabic">يَبِيعُ</span></td>
              <td><span class="arabic">بِعْ</span></td>
              <td>to sell</td>
            </tr>
            <tr>
              <td>س-ي-ر</td>
              <td><span class="arabic">سَارَ</span></td>
              <td><span class="arabic">يَسِيرُ</span></td>
              <td><span class="arabic">سِرْ</span></td>
              <td>to walk/travel</td>
            </tr>
            <tr>
              <td>ط-ي-ر</td>
              <td><span class="arabic">طَارَ</span></td>
              <td><span class="arabic">يَطِيرُ</span></td>
              <td><span class="arabic">طِرْ</span></td>
              <td>to fly</td>
            </tr>
          </table>
        </div>

        <h3>Ajwaf Verbs in Higher Forms</h3>
        <p>In Forms II-X, the weak middle letter often remains and behaves more regularly:</p>

        <div class="example-box">
          <h4>Higher Forms of قَالَ (ق-و-ل)</h4>
          <table>
            <tr>
              <th>Form</th>
              <th>Past</th>
              <th>Present</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>II</td>
              <td><span class="arabic">قَوَّلَ</span></td>
              <td><span class="arabic">يُقَوِّلُ</span></td>
              <td>to make say/attribute words</td>
            </tr>
            <tr>
              <td>IV</td>
              <td><span class="arabic">أَقَالَ</span></td>
              <td><span class="arabic">يُقِيلُ</span></td>
              <td>to cancel/dismiss</td>
            </tr>
            <tr>
              <td>V</td>
              <td><span class="arabic">تَقَوَّلَ</span></td>
              <td><span class="arabic">يَتَقَوَّلُ</span></td>
              <td>to speak falsely</td>
            </tr>
          </table>
        </div>

        <div class="quran-box">
          <h4>Quranic Examples of Ajwaf Verbs</h4>
          <p><span class="arabic">قُلْ هُوَ اللَّهُ أَحَدٌ</span></p>
          <p>"Say: He is Allah, the One" (Ikhlas 112:1)</p>
          <p><span class="arabic">وَأَقِيمُوا الصَّلَاةَ</span></p>
          <p>"And establish prayer" (Baqarah 2:43) - from أَقَامَ (Form IV of ق-و-م)</p>
        </div>

        <div class="activity-box">
          <h4>Practice: Ajwaf Verbs</h4>
          <p>Conjugate these Ajwaf verbs:</p>
          <ol>
            <li><span class="arabic">كَانَ</span> (kāna - to be) in present tense (هو): يَ___ُ</li>
            <li><span class="arabic">زَارَ</span> (zāra - to visit) in past (أنتَ): ___تَ</li>
            <li><span class="arabic">جَاءَ</span> (jā'a - to come) in command (أنتَ): ___!</li>
          </ol>
        </div>

        <div class="important-box">
          <h4>Summary: Ajwaf Verbs Rules</h4>
          <ol>
            <li>Middle radical is و or ي</li>
            <li>In past tense (Form I): و/ي → ا when between two fathas</li>
            <li>In present tense: Forms long vowel (ū or ī)</li>
            <li>When conjugated with sukoon endings: weak letter often disappears</li>
            <li>In higher forms (II-X): usually more regular</li>
            <li>Master: قَالَ، قَامَ، صَامَ، بَاعَ، سَارَ</li>
          </ol>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 5: Ajwaf Verbs');

  // Unit 6: Weak Verbs - Naqis (الناقص)
  const unit6 = await prisma.unit.create({
    data: {
      courseId: sarfCourse.id,
      title: 'Weak Verbs: Naqis (Final Radical Weak)',
      titleArabic: 'الفعل المعتل - الناقص',
      description: 'Understanding verbs with و or ي as the final (third) radical',
      orderIndex: 6,
      content: `
        <h2>Nāqiṣ Verbs (الناقص) - Final Radical Weak</h2>
        <p>Nāqiṣ verbs have a weak letter (و or ي) as their third (final) radical. These verbs show unique patterns especially at the end of words.</p>

        <div class="important-box">
          <h4>Key Characteristic</h4>
          <p>The word "ناقص" means "deficient" - the verb appears incomplete because the final weak letter often changes or disappears.</p>
        </div>

        <h3>Types of Nāqiṣ Verbs</h3>
        <ul>
          <li><strong>Nāqiṣ Wāwī (الناقص الواوي):</strong> Final radical is و</li>
          <li><strong>Nāqiṣ Yā'ī (الناقص اليائي):</strong> Final radical is ي (most common)</li>
        </ul>

        <h3>The Main Rules for Nāqiṣ Verbs</h3>
        <div class="important-box">
          <p><strong>Key transformations:</strong></p>
          <ul>
            <li>When the final و/ي comes after fatha → it becomes ى (alif maqṣūrah)</li>
            <li>When followed by a voweled pronoun → و/ي may return</li>
            <li>In present tense → final و/ي is often dropped with certain endings</li>
          </ul>
        </div>

        <h3>Example 1: <span class="arabic">دَعَا</span> (da'ā - to call/invoke)</h3>
        <p>Root: د-ع-و (the و is the final radical)</p>

        <div class="example-box">
          <h4>Past Tense Conjugation of دَعَا</h4>
          <table>
            <tr>
              <th>Person</th>
              <th>Theoretical Form</th>
              <th>Actual Form</th>
              <th>Transliteration</th>
            </tr>
            <tr>
              <td>هو (He)</td>
              <td><span class="arabic">دَعَوَ</span></td>
              <td><span class="arabic">دَعَا</span></td>
              <td>da'ā (و → ى/ā)</td>
            </tr>
            <tr>
              <td>هي (She)</td>
              <td><span class="arabic">دَعَوَتْ</span></td>
              <td><span class="arabic">دَعَتْ</span></td>
              <td>da'at (و drops)</td>
            </tr>
            <tr>
              <td>هم (They m.)</td>
              <td><span class="arabic">دَعَوُوا</span></td>
              <td><span class="arabic">دَعَوْا</span></td>
              <td>da'aw (و returns)</td>
            </tr>
            <tr>
              <td>أنتَ (You m.)</td>
              <td><span class="arabic">دَعَوْتَ</span></td>
              <td><span class="arabic">دَعَوْتَ</span></td>
              <td>da'awta (و stays)</td>
            </tr>
            <tr>
              <td>أنا (I)</td>
              <td><span class="arabic">دَعَوْتُ</span></td>
              <td><span class="arabic">دَعَوْتُ</span></td>
              <td>da'awtu</td>
            </tr>
          </table>
        </div>

        <div class="example-box">
          <h4>Present Tense Conjugation of دَعَا</h4>
          <table>
            <tr>
              <th>Person</th>
              <th>Theoretical Form</th>
              <th>Actual Form</th>
              <th>Transliteration</th>
            </tr>
            <tr>
              <td>هو (He)</td>
              <td><span class="arabic">يَدْعُوُ</span></td>
              <td><span class="arabic">يَدْعُو</span></td>
              <td>yad'ū</td>
            </tr>
            <tr>
              <td>هي (She)</td>
              <td><span class="arabic">تَدْعُوُ</span></td>
              <td><span class="arabic">تَدْعُو</span></td>
              <td>tad'ū</td>
            </tr>
            <tr>
              <td>هم (They m.)</td>
              <td><span class="arabic">يَدْعُوُونَ</span></td>
              <td><span class="arabic">يَدْعُونَ</span></td>
              <td>yad'ūna (و drops)</td>
            </tr>
            <tr>
              <td>أنتِ (You f.)</td>
              <td><span class="arabic">تَدْعُوِينَ</span></td>
              <td><span class="arabic">تَدْعِينَ</span></td>
              <td>tad'īna (و drops)</td>
            </tr>
          </table>
        </div>

        <div class="example-box">
          <h4>Command (Imperative) of دَعَا</h4>
          <table>
            <tr>
              <th>Person</th>
              <th>Form</th>
              <th>Transliteration</th>
            </tr>
            <tr>
              <td>أنتَ (You m.)</td>
              <td><span class="arabic">ادْعُ</span></td>
              <td>ud'u</td>
            </tr>
            <tr>
              <td>أنتِ (You f.)</td>
              <td><span class="arabic">ادْعِي</span></td>
              <td>ud'ī</td>
            </tr>
            <tr>
              <td>أنتم (You pl.)</td>
              <td><span class="arabic">ادْعُوا</span></td>
              <td>ud'ū</td>
            </tr>
          </table>
        </div>

        <h3>Example 2: <span class="arabic">رَمَى</span> (ramā - to throw)</h3>
        <p>Root: ر-م-ي (the ي is the final radical)</p>

        <div class="example-box">
          <h4>Conjugation of رَمَى</h4>
          <table>
            <tr>
              <th>Tense</th>
              <th>Person</th>
              <th>Form</th>
              <th>Transliteration</th>
            </tr>
            <tr>
              <td rowspan="3">Past</td>
              <td>هو</td>
              <td><span class="arabic">رَمَى</span></td>
              <td>ramā (ي → ى)</td>
            </tr>
            <tr>
              <td>هي</td>
              <td><span class="arabic">رَمَتْ</span></td>
              <td>ramat</td>
            </tr>
            <tr>
              <td>هم</td>
              <td><span class="arabic">رَمَوْا</span></td>
              <td>ramaw (ي → و)</td>
            </tr>
            <tr>
              <td rowspan="2">Present</td>
              <td>هو</td>
              <td><span class="arabic">يَرْمِي</span></td>
              <td>yarmī</td>
            </tr>
            <tr>
              <td>هم</td>
              <td><span class="arabic">يَرْمُونَ</span></td>
              <td>yarmūna</td>
            </tr>
            <tr>
              <td>Command</td>
              <td>أنتَ</td>
              <td><span class="arabic">ارْمِ</span></td>
              <td>irmi</td>
            </tr>
          </table>
        </div>

        <h3>Common Nāqiṣ Verbs to Master</h3>
        <div class="example-box">
          <h4>Nāqiṣ Wāwī (و at the end)</h4>
          <table>
            <tr>
              <th>Root</th>
              <th>Past</th>
              <th>Present</th>
              <th>Command</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>د-ع-و</td>
              <td><span class="arabic">دَعَا</span></td>
              <td><span class="arabic">يَدْعُو</span></td>
              <td><span class="arabic">ادْعُ</span></td>
              <td>to call/invoke</td>
            </tr>
            <tr>
              <td>ن-م-و</td>
              <td><span class="arabic">نَمَا</span></td>
              <td><span class="arabic">يَنْمُو</span></td>
              <td><span class="arabic">انْمُ</span></td>
              <td>to grow</td>
            </tr>
            <tr>
              <td>ع-ف-و</td>
              <td><span class="arabic">عَفَا</span></td>
              <td><span class="arabic">يَعْفُو</span></td>
              <td><span class="arabic">اعْفُ</span></td>
              <td>to pardon/forgive</td>
            </tr>
            <tr>
              <td>ت-ل-و</td>
              <td><span class="arabic">تَلَا</span></td>
              <td><span class="arabic">يَتْلُو</span></td>
              <td><span class="arabic">اتْلُ</span></td>
              <td>to recite/read</td>
            </tr>
          </table>
        </div>

        <div class="example-box">
          <h4>Nāqiṣ Yā'ī (ي at the end)</h4>
          <table>
            <tr>
              <th>Root</th>
              <th>Past</th>
              <th>Present</th>
              <th>Command</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>ر-ض-ي</td>
              <td><span class="arabic">رَضِيَ</span></td>
              <td><span class="arabic">يَرْضَى</span></td>
              <td><span class="arabic">ارْضَ</span></td>
              <td>to be pleased</td>
            </tr>
            <tr>
              <td>ب-ك-ي</td>
              <td><span class="arabic">بَكَى</span></td>
              <td><span class="arabic">يَبْكِي</span></td>
              <td><span class="arabic">ابْكِ</span></td>
              <td>to cry</td>
            </tr>
            <tr>
              <td>م-ش-ي</td>
              <td><span class="arabic">مَشَى</span></td>
              <td><span class="arabic">يَمْشِي</span></td>
              <td><span class="arabic">امْشِ</span></td>
              <td>to walk</td>
            </tr>
            <tr>
              <td>ل-ق-ي</td>
              <td><span class="arabic">لَقِيَ</span></td>
              <td><span class="arabic">يَلْقَى</span></td>
              <td><span class="arabic">الْقَ</span></td>
              <td>to meet</td>
            </tr>
          </table>
        </div>

        <h3>Nāqiṣ Verbs in Higher Forms</h3>
        <p>In higher forms, the final weak letter often appears more clearly:</p>

        <div class="example-box">
          <h4>Higher Forms of دَعَا (د-ع-و)</h4>
          <table>
            <tr>
              <th>Form</th>
              <th>Past</th>
              <th>Present</th>
              <th>Meaning</th>
            </tr>
            <tr>
              <td>II</td>
              <td><span class="arabic">دَعَّى</span></td>
              <td><span class="arabic">يُدَعِّي</span></td>
              <td>to claim falsely</td>
            </tr>
            <tr>
              <td>IV</td>
              <td><span class="arabic">أَدْعَى</span></td>
              <td><span class="arabic">يُدْعِي</span></td>
              <td>to claim/allege</td>
            </tr>
            <tr>
              <td>VI</td>
              <td><span class="arabic">تَدَاعَى</span></td>
              <td><span class="arabic">يَتَدَاعَى</span></td>
              <td>to call one another/rally</td>
            </tr>
            <tr>
              <td>VIII</td>
              <td><span class="arabic">ادَّعَى</span></td>
              <td><span class="arabic">يَدَّعِي</span></td>
              <td>to claim/pretend</td>
            </tr>
            <tr>
              <td>X</td>
              <td><span class="arabic">اسْتَدْعَى</span></td>
              <td><span class="arabic">يَسْتَدْعِي</span></td>
              <td>to summon/call for</td>
            </tr>
          </table>
        </div>

        <div class="quran-box">
          <h4>Quranic Examples of Nāqiṣ Verbs</h4>
          <p><span class="arabic">وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ</span></p>
          <p>"And your Lord says: Call upon Me; I will respond to you" (Ghafir 40:60)</p>
          <p><span class="arabic">اتْلُ مَا أُوحِيَ إِلَيْكَ مِنَ الْكِتَابِ</span></p>
          <p>"Recite what has been revealed to you of the Book" (Ankabut 29:45)</p>
        </div>

        <div class="activity-box">
          <h4>Practice: Nāqiṣ Verbs</h4>
          <p>Conjugate these Nāqiṣ verbs:</p>
          <ol>
            <li><span class="arabic">سَعَى</span> (sa'ā - to strive) in present (هو): يَ___</li>
            <li><span class="arabic">نَجَا</span> (najā - to be saved) in past (هم): ___وا</li>
            <li><span class="arabic">بَنَى</span> (banā - to build) in command (أنتَ): ا___!</li>
            <li>What is the root of <span class="arabic">يَخْشَى</span>? ___-___-___</li>
          </ol>
        </div>

        <div class="important-box">
          <h4>Summary: Nāqiṣ Verbs Rules</h4>
          <ol>
            <li>Final radical is و or ي</li>
            <li>In past tense (Form I): و/ي → ى (alif maqṣūrah) in 3rd person masc.</li>
            <li>Final weak letter drops before ت and ن endings</li>
            <li>In masculine plural past: ي → و (e.g., رَمَوْا)</li>
            <li>Present tense maintains و or ي in most persons</li>
            <li>Command form drops final letter in masculine singular</li>
            <li>Master: دَعَا، رَمَى، مَشَى، تَلَا، بَكَى</li>
          </ol>
        </div>

        <div class="comparison-box">
          <h4>Comparison: Mithal vs Ajwaf vs Nāqiṣ</h4>
          <table>
            <tr>
              <th>Type</th>
              <th>Weak Position</th>
              <th>Example</th>
              <th>Key Change</th>
            </tr>
            <tr>
              <td>Mithal</td>
              <td>1st radical</td>
              <td><span class="arabic">وَعَدَ → يَعِدُ</span></td>
              <td>و drops in present</td>
            </tr>
            <tr>
              <td>Ajwaf</td>
              <td>2nd radical</td>
              <td><span class="arabic">قَالَ → يَقُولُ</span></td>
              <td>و → ا or long vowel</td>
            </tr>
            <tr>
              <td>Nāqiṣ</td>
              <td>3rd radical</td>
              <td><span class="arabic">دَعَا → يَدْعُو</span></td>
              <td>و → ى at end</td>
            </tr>
          </table>
        </div>
      `,
    },
  });

  console.log('✅ Created Unit 6: Naqis Verbs');

  console.log('');
  console.log('✅ Part 3 completed: Created units 5-6');
  console.log('📊 Progress: Units 1-6 of 8 completed');
  console.log('');
}

async function main() {
  try {
    await seedSarfCoursePart3();
    console.log('✨ Sarf course seed Part 3 completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Sarf course Part 3:', error);
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
