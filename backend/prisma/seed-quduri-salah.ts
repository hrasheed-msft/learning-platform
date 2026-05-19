import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Mukhtasar al-Quduri — Kitab al-Salah (Book of Prayer) Seed
 * Source: Classical Hanafi fiqh text by Imam Ahmad ibn Muhammad al-Quduri (d. 428 AH)
 *
 * Covers eight sections of Salah: Prayer Times, the Adhan, Prerequisites of Prayer,
 * The Six Obligations, Description of Prayer, Congregational Prayer,
 * Traveler's Prayer, and Friday & Eid Prayers.
 *
 * Can be run independently: npx ts-node prisma/seed-quduri-salah.ts
 */

export async function seedQuduriSalah() {
  console.log('📚 Starting Mukhtasar al-Quduri: Kitab al-Salah seed...');
  console.log('');

  // Require demo family from main seed
  const demoFamily = await prisma.family.findFirst({
    where: { name: 'Ahmad Family' },
  });

  if (!demoFamily) {
    console.log('⚠️  Demo family not found. Please run main seed first.');
    return;
  }

  console.log('✅ Found demo family:', demoFamily.name);

  // Check if course already exists — skip if so
  const existing = await prisma.course.findFirst({
    where: { title: 'Mukhtasar al-Quduri: Kitab al-Salah (Book of Prayer)' },
  });
  if (existing) {
    console.log('⏭️  Mukhtasar al-Quduri: Kitab al-Salah already exists — skipping.');
    return;
  }

  // ──────────────────────────────────────────────
  // COURSE
  // ──────────────────────────────────────────────

  const course = await prisma.course.create({
    data: {
      title: 'Mukhtasar al-Quduri: Kitab al-Salah (Book of Prayer)',
      description:
        'A comprehensive study of the Book of Prayer (Kitab al-Salah) from Mukhtasar al-Quduri, the classical Hanafi fiqh manual authored by Imam Abu al-Husayn Ahmad ibn Muhammad al-Quduri (362–428 AH). This course covers the times of the five daily prayers, the Adhan and Iqamah, the prerequisites and obligations of prayer, the complete description of Salah from opening takbir to salam, congregational prayer, the traveler\'s prayer (qasr), and the rulings of Friday and Eid prayers. All rulings follow the Hanafi madhhab.',
      category: 'FIQH',
      ageLevels: ['TEEN', 'ADULT'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // UNIT 0: أوقات الصلاة — Prayer Times
  // ──────────────────────────────────────────────

  const unit0 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Awqāt al-Ṣalāh — Times of Prayer',
      description:
        'The five daily prayer times and the witr prayer, including the Hanafi positions on the end of Dhuhr and the Maghrib twilight.',
      orderIndex: 0,
      content: `
<h2>أوقات الصلاة — Times of Prayer</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">أول وقت الصبح إذا طلع الفجر الثاني وهو البياض المعترض في الأفق وآخر وقتها ما لم تطلع الشمس</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The beginning of the time for Fajr is when the second dawn appears — the white light spreading horizontally across the horizon — and its end is before the sun rises.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وأول وقت الظهر إذا زالت الشمس وآخر وقتها عند أبي حنيفة إذا صار ظل كل شيء مثليه سوى فيء الزوال. وقال أبو يوسف ومحمد: إذا صار ظل كل شيء مثله</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The beginning of Dhuhr is when the sun passes its zenith. According to Abu Hanifah, its end is when the shadow of every object becomes twice its length (excluding the noon shadow). Abu Yusuf and Muhammad said: when the shadow equals the object's length.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وأول وقت العصر إذا خرج وقت الظهر على القولين وآخر وقتها ما لم تغرب الشمس</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The beginning of Asr is when Dhuhr time ends (according to both positions), and its end is before the sun sets.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وأول وقت المغرب إذا غربت الشمس وآخر وقتها ما لم يغب الشفق وهو البياض الذي في الأفق بعد الحمرة عند أبي حنيفة وقال أبو يوسف ومحمد: هو الحمرة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The beginning of Maghrib is when the sun sets. Its end is before the twilight (shafaq) disappears. According to Abu Hanifah, the shafaq is the white light on the horizon after the redness has gone. Abu Yusuf and Muhammad said: the shafaq is the redness.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وأول وقت العشاء إذا غاب الشفق وآخر وقتها ما لم يطلع الفجر وأول وقت الوتر بعد العشاء وآخر وقتها ما لم يطلع الفجر</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The beginning of Isha' is when the twilight disappears and its end is before the dawn. The time of Witr begins after Isha' and ends before dawn.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويستحب الإسفار بالفجر والإبراد بالظهر في الصيف وتقديمها في الشتاء وتأخير العصر ما لم تتغير الشمس وتعجيل المغرب وتأخير العشاء إلى ما قبل ثلث الليل</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> It is recommended to pray Fajr in the brightness (after the dawn is clear); to delay Dhuhr in summer until it cools; to pray it early in winter; to delay Asr as long as the sun has not changed colour; to hasten Maghrib; and to delay Isha' to before a third of the night.</div>
</div>

<h3>Summary of Prayer Times (Hanafi)</h3>
<table>
  <tr><th>Prayer</th><th>Begins</th><th>Ends</th></tr>
  <tr><td>Fajr</td><td>Second dawn (white light)</td><td>Before sunrise</td></tr>
  <tr><td>Dhuhr</td><td>Sun passes zenith</td><td>Shadow = 2× object (Abu Hanifah) / 1× (Abu Yusuf &amp; Muhammad)</td></tr>
  <tr><td>Asr</td><td>Dhuhr ends</td><td>Before sunset</td></tr>
  <tr><td>Maghrib</td><td>Sunset</td><td>White twilight disappears (Abu Hanifah) / Red twilight (Abu Yusuf &amp; Muhammad)</td></tr>
  <tr><td>Isha'</td><td>Twilight disappears</td><td>Before dawn</td></tr>
  <tr><td>Witr</td><td>After Isha'</td><td>Before dawn</td></tr>
</table>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 0: Awqāt al-Ṣalāh');

  // ──────────────────────────────────────────────
  // UNIT 1: باب الأذان — The Call to Prayer
  // ──────────────────────────────────────────────

  const unit1 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Bāb al-Adhān — The Call to Prayer',
      description:
        'The rulings on the Adhan and Iqamah: their status as sunnah, the proper method, and related rulings.',
      orderIndex: 1,
      content: `
<h2>باب الأذان — The Call to Prayer</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">الأذان سنة للصلوات الخمس والجمعة دون ما سواها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The Adhan is a sunnah for the five daily prayers and for Jumu'ah, and not for anything else.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وصفة الأذان: أن يقول: الله أكبر الله أكبر — إلى آخره ولا ترجيع فيه ويزيد في أذان الفجر بعد الفلاح: الصلاة خير من النوم مرتين</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The form of the Adhan is: "Allahu Akbar, Allahu Akbar..." to its end. There is no repetition (tarji') in it. In the Fajr adhan he adds after "hayya 'ala al-falah": "Al-salatu khayrun min al-nawm" (Prayer is better than sleep) twice.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والإقامة مثل الأذان إلا أنه يزيد فيها بعد الفلاح: قد قامت الصلاة مرتين</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The Iqamah is the same as the Adhan except that he adds after "hayya 'ala al-falah": "Qad qamat al-salah" (The prayer has begun) twice.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويترسل في الأذان ويحدر في الإقامة ويستقبل بهما القبلة فإذا بلغ إلى الصلاة والفلاح حول وجهه يمينا وشمالا</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The Adhan is pronounced slowly and deliberately, while the Iqamah is said quickly. Both are performed facing the qiblah. When he reaches "hayya 'ala al-salah" and "hayya 'ala al-falah" he turns his face right and left.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويؤذن للفائتة ويقيم فإن فاتته صلوات أذن للأولى وأقام وكان مخيرا في الباقية: إن شاء أذن وأقام وإن شاء اقتصر على الإقامة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> He gives the adhan and iqamah for a missed prayer. If multiple prayers were missed, he gives adhan and iqamah for the first, and for the remaining ones he has a choice: he may give adhan and iqamah, or suffice with the iqamah alone.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وينبغي أن يؤذن ويقيم على طهر فإن أذن على غير وضوء جاز ويكره أن يقيم على غير وضوء أو يؤذن وهو جنب ولا يؤذن لصلاة قبل دخول وقتها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> It is recommended that both the adhan and iqamah be performed in a state of purity. If the adhan is given without wudu' it is valid but disliked. It is disliked (makruh) to give the iqamah without wudu' or to give the adhan in a state of major impurity (janabah). The adhan may not be given before the prayer time has entered.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 1: Bāb al-Adhān');

  // ──────────────────────────────────────────────
  // UNIT 2: شروط الصلاة — Prerequisites of Prayer
  // ──────────────────────────────────────────────

  const unit2 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Shurūṭ al-Ṣalāh — Prerequisites of Prayer',
      description:
        'The conditions that must be met before prayer is valid: purity, covering the \'awrah, facing the qiblah, and making intention.',
      orderIndex: 2,
      content: `
<h2>باب شروط الصلاة — Prerequisites of Prayer</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">يجب على المصلي أن يقدم الطهارة من الأحداث والأنجاس على ما قدمناه ويستر عورته</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The one praying must first attain purity from ritual impurities (hadath) and physical impurities (najas) as described earlier, and must cover the 'awrah.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والعورة من الرجل: ما تحت السرة إلى الركبة والركبة من العورة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The 'awrah of a man is from below the navel to the knee, and the knee is included in the 'awrah.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وبدن المرأة الحرة كله عورة إلا وجهها وكفيها وقدميها وما كان عورة من الرجل فهو عورة من الأمة وبطنها وظهرها عورة وما سوى ذلك من بدنها فليس بعورة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The entire body of a free woman is 'awrah except her face, both hands, and both feet. The female slave ('amah) has the same 'awrah as a man, with the addition that her abdomen and back are also 'awrah; the rest of her body is not 'awrah.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ومن لم يجد ثوبا صلى عريانا قاعدا يومئ بالركوع والسجود فإن صلى قائما أجزاه والأول أفضل</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If a person finds no garment, they pray naked while seated, indicating ruku' and sujud by inclination. If they pray standing, it is valid, though the seated position is preferred.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وينوي الصلاة التي يدخل فيها بنية لا يفصل بينها وبين التحريمة بعمل ويستقبل القبلة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> He makes the intention (niyyah) for the specific prayer he is entering, with no action separating the intention from the opening takbir (tahrima). And he faces the qiblah.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">فإن اشتبهت عليه القبلة وليس بحضرته من يسأله عنها اجتهد وصلى فإن علم أنه أخطأ بإخبار بعد ما صلى فلا إعادة عليه وإن علم ذلك وهو في الصلاة استدار إلى القبلة وبنى عليها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If the qiblah direction is unclear and no one is present to ask, he exercises independent judgment (ijtihad) and prays. If he later learns he was wrong (after completing the prayer), he need not repeat it. If he discovers the error while still in prayer, he turns toward the qiblah and continues.</div>
</div>

<h3>Summary of Prerequisites (Shurut)</h3>
<ol>
  <li><strong>Purity from hadath</strong> — wudu', ghusl, or tayammum as applicable</li>
  <li><strong>Purity from najasah</strong> — on body, clothing, and place of prayer</li>
  <li><strong>Covering the 'awrah</strong> — man: navel to knee; free woman: all except face, hands, feet</li>
  <li><strong>Facing the qiblah</strong> — except when in genuine fear</li>
  <li><strong>Intention (niyyah)</strong> — in the heart, immediately before the opening takbir</li>
  <li><strong>Prayer time</strong> — must have entered before beginning</li>
</ol>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 2: Shurūṭ al-Ṣalāh');

  // ──────────────────────────────────────────────
  // UNIT 3: فرائض الصلاة — Obligations of Prayer
  // ──────────────────────────────────────────────

  const unit3 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Farā\'iḍ al-Ṣalāh — The Six Obligations of Prayer',
      description:
        'The six farā\'iḍ (obligatory integrals) of prayer without which the prayer is invalid.',
      orderIndex: 3,
      content: `
<h2>فرائض الصلاة — The Six Obligations of Prayer</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">فرائض الصلاة ستة: التحريمة والقيام والقراءة والركوع والسجود والقعدة الأخيرة مقدار التشهد</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The obligatory integrals of prayer are six: (1) the opening takbir (tahrima), (2) standing (qiyam), (3) recitation (qira'ah), (4) bowing (ruku'), (5) prostration (sujud), and (6) the final sitting for the duration of the tashahhud.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وما زاد على ذلك فهو سنة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Everything beyond these six is sunnah.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">فإذا دخل الرجل في الصلاة كبر ورفع يديه مع التكبير حتى يحاذى بإبهاميه شحمتي أذنيه فإن قال بدلا من التكبير: الله أجل أو أعظم أو الرحمن أكبر أجزأه عند أبي حنيفة ومحمد وقال أبو يوسف: لا يجزئه إلا بلفظ التكبير</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> When a man enters the prayer he says the takbir and raises his hands alongside it until his thumbs are level with his earlobes. If instead of "Allahu Akbar" he says "Allah is greater," "Allah is most great," or "Al-Rahman is greater," it is valid according to Abu Hanifah and Muhammad. Abu Yusuf said: it is only valid with the wording of the takbir.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإذا تلا الإمام آية السجدة سجدها وسجد المأموم معه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> [Regarding sujud tilawah:] When the imam recites a verse of prostration he performs it and the follower prostrates with him.</div>
</div>

<h3>The Six Farā'iḍ at a Glance</h3>
<ol>
  <li><strong>Tahrima</strong> — the opening "Allahu Akbar" that enters one into the prayer state</li>
  <li><strong>Qiyam</strong> — standing upright (obligatory for those able)</li>
  <li><strong>Qira'ah</strong> — recitation of Qur'an (minimum: one verse according to Abu Hanifah; three short verses or one long verse according to Abu Yusuf and Muhammad)</li>
  <li><strong>Ruku'</strong> — bowing such that the back is level</li>
  <li><strong>Sujud</strong> — prostration on forehead and nose</li>
  <li><strong>Qa'dah akhirah</strong> — the final sitting for the length of the tashahhud</li>
</ol>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 3: Farā\'iḍ al-Ṣalāh');

  // ──────────────────────────────────────────────
  // UNIT 4: صفة الصلاة — Description of Prayer
  // ──────────────────────────────────────────────

  const unit4 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Ṣifat al-Ṣalāh — Description of Prayer',
      description:
        'The complete step-by-step description of how to perform the Salah according to al-Quduri, including the dhikr recited in each position.',
      orderIndex: 4,
      content: `
<h2>باب صفة الصلاة — Description of Prayer</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويعتمد بيده اليمنى على اليسرى ويضعهما تحت سرته ثم يقول: سبحانك اللهم وبحمدك وتبارك اسمك وتعالى جدك ولا إله غيرك ويستعيذ بالله من الشيطان الرجيم ويقرأ بسم الله الرحمن الرحيم ويسر بهما ثم يقرأ فاتحة الكتاب وسورة معها أو ثلاث آيات من أي سورة شاء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> He places his right hand over his left and puts them below the navel. Then he says: "Subhanaka Allahumma wa bihamdika, wa tabaraka ismuka, wa ta'ala jadduka, wa la ilaha ghayruk" (Glory be to You O Allah and with Your praise; blessed is Your Name and exalted is Your Majesty; there is no god but You). He seeks refuge from Shaytan, says "Bismillah al-Rahman al-Rahim" quietly, then recites Surah al-Fatihah followed by another surah or three verses from any surah.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإذا قال الإمام {ولا الضالين} قال: آمين ويخفونها ثم يكبر ويركع ويعتمد بيديه على ركبتيه ويفرج أصابعه ويبسط ظهره ولا يرفع رأسه ولا ينكسه ويقول في ركوعه: سبحان ربي العظيم ثلاثا وذلك أدناه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> When the imam says "wa la al-dallin," they say "Amin" quietly. He then says the takbir and bows. He places his hands on his knees, spreads his fingers, straightens his back, and keeps his head neither raised nor lowered. In ruku' he says: "Subhana Rabbiyal 'Azim" (Glory be to my Lord the Most Great) three times — that is the minimum.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ثم يرفع رأسه ويقول: سمع الله لمن حمده ويسجد واعتمد بيديه على الأرض ووضع وجهه بين كفيه وسجد على أنفه وجبهته فإن اقتصر على أحدهما جاز عند أبي حنيفة وقال أبو يوسف ومحمد: لا يجوز الاقتصار على الأنف إلا من عذر ويقول في سجوده: سبحان ربي الأعلى ثلاثا وذلك أدناه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Then he raises his head saying "Sami'a Allahu liman hamidah" and prostrates. He places his hands on the ground and puts his face between his palms, prostrating on both his nose and forehead. If he only performs one of the two, it is valid according to Abu Hanifah. Abu Yusuf and Muhammad said: it is not permissible to confine oneself to the nose except due to an excuse. In sujud he says: "Subhana Rabbiyal A'la" (Glory be to my Lord the Most High) three times — that is the minimum.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والتشهد أن يقول: التحيات لله والصلوات والطيبات السلام عليك أيها النبي ورحمة الله وبركاته السلام علينا وعلى عباد الله الصالحين أشهد أن لا إله إلا الله وأشهد أن محمدا عبده ورسوله ولا يزيد على هذا في القعدة الأولى</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The tashahhud is: "Al-tahiyyatu lillahi wal-salawatu wal-tayyibatu, al-salamu 'alayka ayyuha al-Nabiyyu wa rahmatullahi wa barakatuh, al-salamu 'alayna wa 'ala 'ibadillahi al-salihin, ashhadu an la ilaha illa Allah wa ashhadu anna Muhammadan 'abduhu wa rasuluh." He does not add to this in the first sitting.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والوتر: ثلاث ركعات لا يفصل بينها بسلام ويقنت في الثالثة قبل الركوع في جميع السنة ويقرأ في كل ركعة من الوتر بفاتحة الكتاب وسورة معها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The Witr prayer consists of three rak'ahs with no separation by salam. The qunut supplication is made in the third rak'ah before the ruku', throughout the whole year. In each rak'ah of Witr, he recites Surah al-Fatihah and a surah.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ثم يسلم عن يمينه فيقول: السلام عليكم ورحمة الله وعن يساره مثل ذلك</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Then he ends by giving salam to his right side saying "Al-salamu 'alaykum wa rahmatullah," and likewise to his left.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 4: Ṣifat al-Ṣalāh');

  // ──────────────────────────────────────────────
  // UNIT 5: الجماعة — Congregational Prayer
  // ──────────────────────────────────────────────

  const unit5 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Al-Jamā\'ah — Congregational Prayer',
      description:
        'The rulings on praying in congregation: its status, who should lead, standing positions, and what invalidates the follower\'s prayer.',
      orderIndex: 5,
      content: `
<h2>الجماعة — Congregational Prayer</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والجماعة: سنة مؤكدة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Congregational prayer is an emphasized sunnah (sunnah mu'akkadah).</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وأولى الناس بالإمامة أعلمهم بالسنة فإن تساووا فأقرهم فإن تساووا فأورعهم فإن تساووا فأسنهم</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The most deserving of people to lead the prayer is the most knowledgeable of the Sunnah. If they are equal, then the one who recites [the Qur'an] best. If still equal, then the most pious. If still equal, then the eldest.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويكره تقديم العبد والأعرابي والفاسق والأعمى وولد الزنا فإن تقدموا جاز</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> It is disliked to appoint as imam a slave, a desert-dwelling Arab (with little fiqh knowledge), a sinner (fasiq), a blind person, or an illegitimate child — though if any of them do lead, the prayer is valid.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ومن صلى مع واحد أقامه عن يمينه فإن كان اثنين تقدم عليهما</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If one person prays with the imam, he stands to the imam's right. If there are two (or more) followers, the imam stands ahead of them.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ولا يجوز للرجال أن يقتدوا بامرأة أو صبي ويصف الرجال ثم الصبيان ثم النساء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> It is not permissible for men to follow a woman or a boy (as imam). The rows are arranged: men first, then boys, then women.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">فإن قامت امرأة إلى جنب رجل وهما مشتركان في صلاة واحدة فسدت صلاته</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If a woman stands next to a man and they are both in the same prayer, his prayer is invalidated.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإن تكلم في صلاته عامدا أو ساهيا بطلت صلاته وإن سبقه الحدث انصرف فإن كان إماما استخلف وتوضأ وبنى على صلاته</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If a person speaks in prayer — deliberately or forgetfully — his prayer is invalidated. If he loses his wudu', he leaves. If he was the imam, he appoints a deputy, performs wudu', and continues his prayer from where he left off.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 5: Al-Jamā\'ah');

  // ──────────────────────────────────────────────
  // UNIT 6: صلاة المسافر — Traveler's Prayer
  // ──────────────────────────────────────────────

  const unit6 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Ṣalāt al-Musāfir — The Traveler\'s Prayer',
      description:
        'The rulings on shortening the prayer (qasr) while traveling, the qualifying distance, and when qasr ends.',
      orderIndex: 6,
      content: `
<h2>باب صلاة المسافر — The Traveler's Prayer</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">السفر الذي تتغير به الأحكام: أن يقصد الإنسان موضعا بينه وبين ذلك الموضع مسيرة ثلاثة أيام ولياليها بسير الإبل ومشي الأقدام ولا يعتبر ذلك بالسير في الماء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The travel that changes rulings is when a person intends to reach a place three days' and nights' journey away, measured by the pace of camels and walking on foot. Travel by water is not measured by this standard.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وفرض المسافر عندنا: في كل صلاة رباعية ركعتان لا تجوز له الزيادة عليهما فإن صلى أربعا وقد قعد في الثانية مقدار التشهد أجزأته ركعتان عن فرضه وكانت الأخريان له نافلة وإن لم يقعد مقدار التشهد في الركعتين الأوليين بطلت صلاته</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The obligation for a traveler in our school is two rak'ahs for every four-rak'ah prayer — he may not add to them. If he prays four and sat for the tashahhud after the second rak'ah, the first two count as his obligatory prayer and the last two as voluntary. If he did not sit for the tashahhud after the first two, his prayer is invalid.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ومن خرج مسافرا صلى ركعتين إذا فارق بيوت المصر ولا يزال على حكم السفر حتى ينوي الإقامة في بلد خمسة عشر يوما فصاعدا فيلزمه الإتمام</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> A person who departs as a traveler prays two rak'ahs once he has left the buildings of the city. He remains under the ruling of a traveler until he intends to reside in a city for fifteen days or more — then he must complete the full prayer.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإذا دخل المسافر في صلاة المقيم مع بقاء الوقت أتم الصلاة وإذا صلى المسافر بالمقيمين ركعتين سلم ثم أتم المقيمون صلاتهم</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If a traveler joins the prayer of a resident while time remains, he must complete the full prayer. If a traveler leads residents in prayer, he gives salam after two rak'ahs and the residents then complete their prayer on their own.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ومن فاتته صلاة في السفر قضاها في الحضر ركعتين ومن فاتته صلاة في الحضر قضاها في السفر أربعا</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If a prayer was missed during travel, it is made up as two rak'ahs even if made up at home. If a prayer was missed at home, it is made up as four rak'ahs even if made up during travel.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 6: Ṣalāt al-Musāfir');

  // ──────────────────────────────────────────────
  // UNIT 7: صلاة الجمعة والعيدين — Friday & Eid Prayers
  // ──────────────────────────────────────────────

  const unit7 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Ṣalāt al-Jumu\'ah wa al-\'Īdayn — Friday & Eid Prayers',
      description:
        'The conditions and description of the Friday (Jumu\'ah) prayer and the two Eid prayers according to the Hanafi school.',
      orderIndex: 7,
      content: `
<h2>باب صلاة الجمعة — Friday Prayer</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">لا تصح الجمعة إلا بمصر جامع أو في مصلى المصر ولا تجوز في القرى ولا تجوز إقامتها إلا بالسلطان أو من أمره السلطان</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Jumu'ah is not valid except in a proper city (misr jami') or its prayer ground. It is not valid in villages. It may only be established by the sultan (authority) or someone the sultan authorizes.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ومن شرائطها الخطبة قبل الصلاة يخطب الإمام خطبتين يفصل بينهما بقعدة ويخطب قائما على طهارة فإن اقتصر على ذكر الله تعالى جاز عند أبي حنيفة وقال أبو يوسف ومحمد: لا بد من ذكر طويل يسمى خطبة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Among the conditions of Jumu'ah is the khutbah before the prayer. The imam delivers two khutbahs with a brief sitting between them, standing in a state of purity. If he confines himself to the dhikr of Allah, it is sufficient according to Abu Hanifah. Abu Yusuf and Muhammad said: a lengthy mention specifically called a khutbah is required.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ومن شرائطها: الجماعة وأقلهم عند أبي حنيفة ثلاثة سوى الإمام وقال أبو يوسف ومحمد: اثنان سوى الإمام</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Among the conditions is the congregation. The minimum congregation according to Abu Hanifah is three besides the imam. Abu Yusuf and Muhammad said: two besides the imam.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ولا تجب الجمعة على مسافر ولا امرأة ولا مريض ولا عبد ولا أعمى فإن حضروا وصلوا مع الناس أجزاهم عن فرض الوقت</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Jumu'ah is not obligatory upon a traveler, a woman, a sick person, a slave, or a blind person. However, if any of these attend and pray with the congregation, it counts as their obligatory prayer for that time.</div>
</div>

<h2>باب صلاة العيدين — Eid Prayers</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويصلي الإمام بالناس ركعتين: يكبر في الأولى تكبيرة الافتتاح وثلاثا بعدها ثم يقرأ فاتحة الكتاب وسورة معها ثم يكبر تكبيرة يركع بها ثم يبتدئ في الركعة الثانية بالقراءة ثم يكبر ثلاث تكبيرات وكبر تكبيرة رابعة يركع بها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The imam leads the people in two rak'ahs: in the first rak'ah he says the opening takbir and three additional takbirs, then recites al-Fatihah and a surah, then says the takbir to go into ruku'. In the second rak'ah he begins with the recitation, then says three takbirs followed by a fourth to go into ruku'.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويرفع يديه في تكبيرات العيدين ثم يخطب بعد الصلاة خطبتين يعلم الناس فيها صدقة الفطر وأحكامها ومن فاتته صلاة العيد مع الإمام لم يقضها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> He raises his hands with the Eid takbirs. He then delivers two khutbahs after the prayer, informing the people of the rulings of Zakat al-Fitr. Whoever misses the Eid prayer with the imam does not make it up.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 7: Ṣalāt al-Jumu\'ah wa al-\'Īdayn');

  // ══════════════════════════════════════════════
  // QUESTIONS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('❓ Creating quiz questions...');

  // --- Unit 0: Awqat al-Salah Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit0.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Abu Hanifah, Dhuhr time ends when the shadow of an object equals:',
        options: JSON.stringify(['Its own length (1×)', 'Twice its length (2×)', 'Three times its length (3×)', 'Half its length']),
        correctAnswer: 'Twice its length (2×)',
        explanation: 'Abu Hanifah holds that Dhuhr ends — and Asr begins — when the shadow equals twice the object\'s length (excluding the noon shadow). Abu Yusuf and Muhammad hold it is once the object\'s length.',
        difficulty: 'HARD',
      },
      {
        unitId: unit0.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Abu Hanifah, the shafaq (twilight) that marks the end of Maghrib time is:',
        options: JSON.stringify(['The red glow on the horizon', 'The white light remaining after the red glow has gone', 'The total darkness of night', 'The appearance of stars']),
        correctAnswer: 'The white light remaining after the red glow has gone',
        explanation: 'Abu Hanifah defines the shafaq as the white light (al-bayad) that remains on the horizon after the redness has disappeared. This significantly extends Maghrib time compared to Abu Yusuf and Muhammad, who define shafaq as the red glow itself.',
        difficulty: 'HARD',
      },
      {
        unitId: unit0.id,
        type: 'TRUE_FALSE',
        questionText: 'The Witr prayer can be performed before Isha\'.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Al-Quduri states: "The time of Witr begins after Isha\'." Therefore Witr cannot be performed before Isha\'.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit0.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the recommended practice for the Fajr prayer according to al-Quduri?',
        options: JSON.stringify(['Pray it immediately at the first light of dawn', 'Pray it in the brightness (isfar) when dawn is clearly spread', 'Delay it until just before sunrise', 'Pray it in the first third of the night']),
        correctAnswer: 'Pray it in the brightness (isfar) when dawn is clearly spread',
        explanation: 'Al-Quduri states: "It is recommended to pray Fajr in the isfar (brightness)" — i.e., once the dawn light has fully spread, not immediately at the first appearance of dawn.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit0.id,
        type: 'FILL_BLANK',
        questionText: 'The second dawn (al-fajr al-thani) that marks the beginning of Fajr time is described as the _____ spreading horizontally across the horizon.',
        options: undefined,
        correctAnswer: 'white light',
        explanation: 'Al-Quduri describes the second dawn as "al-bayad al-mu\'tarid fi al-ufuq" — the white light spreading horizontally across the horizon. This is contrasted with the first dawn (al-fajr al-kadhib), which is a vertical white streak.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Unit 1: Adhan Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'For which prayers is the Adhan a sunnah according to al-Quduri?',
        options: JSON.stringify(['The five daily prayers only', 'The five daily prayers and Jumu\'ah', 'All obligatory prayers including \'Id', 'All congregational prayers']),
        correctAnswer: 'The five daily prayers and Jumu\'ah',
        explanation: 'Al-Quduri states: "The Adhan is a sunnah for the five daily prayers and Jumu\'ah, and not for anything else."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit1.id,
        type: 'TRUE_FALSE',
        questionText: 'The Adhan contains tarji\' (repetition of the shahada quietly before saying it aloud) in the Hanafi school.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Al-Quduri explicitly states "la tarji\' fihi" — there is no tarji\' in the Hanafi adhan. Tarji\' is a feature of the Maliki and Shafi\'i adhan forms.',
        difficulty: 'HARD',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does the mu\'adhdhin add in the Fajr adhan that is not in the other adhans?',
        options: JSON.stringify(['"Al-salatu khayrun min al-nawm" (Prayer is better than sleep)', '"Hayya \'ala al-falah" repeated', '"Qad qamat al-salah"', '"Al-salatu khayr"']),
        correctAnswer: '"Al-salatu khayrun min al-nawm" (Prayer is better than sleep)',
        explanation: 'Al-Quduri states that in the Fajr adhan, after "hayya \'ala al-falah", the mu\'adhdhin adds "al-salatu khayrun min al-nawm" twice.',
        difficulty: 'EASY',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'When giving the Adhan for multiple missed prayers, what is done for prayers after the first?',
        options: JSON.stringify(['Full adhan and iqamah for each', 'Iqamah only for each', 'Choice: full adhan + iqamah, or iqamah only', 'No adhan or iqamah needed']),
        correctAnswer: 'Choice: full adhan + iqamah, or iqamah only',
        explanation: 'Al-Quduri states that for multiple missed prayers, the first gets full adhan + iqamah; for the remaining ones the person has a choice (mukhayyar): give full adhan + iqamah, or suffice with iqamah alone.',
        difficulty: 'HARD',
      },
    ],
  });

  // --- Unit 2: Shurut al-Salah Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to al-Quduri, what is the \'awrah of a free woman in prayer?',
        options: JSON.stringify(['The entire body', 'The entire body except face and hands', 'The entire body except face, hands, and feet', 'Only what a man would consider \'awrah']),
        correctAnswer: 'The entire body except face, hands, and feet',
        explanation: 'Al-Quduri states: "The entire body of a free woman is \'awrah except her face, her two hands, and her two feet." This is the Hanafi position on the \'awrah of a free woman specifically in prayer.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the \'awrah of a man in prayer according to al-Quduri?',
        options: JSON.stringify(['From the chest to the knee', 'From the navel to the knee (knee included)', 'From the navel to below the knee (knee excluded)', 'The chest and back only']),
        correctAnswer: 'From the navel to the knee (knee included)',
        explanation: 'Al-Quduri states: "The \'awrah of a man is what is below the navel to the knee, and the knee is part of the \'awrah."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'TRUE_FALSE',
        questionText: 'If a person cannot find the direction of the qiblah and prays by their own judgment (ijtihad), they must repeat the prayer if they later discover they were wrong.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Al-Quduri states that if someone prays by ijtihad and later discovers they were wrong (after finishing the prayer), there is no obligation to repeat it (la i\'adah \'alayh).',
        difficulty: 'HARD',
      },
      {
        unitId: unit2.id,
        type: 'FILL_BLANK',
        questionText: 'If a person discovers mid-prayer that they are facing the wrong direction after doing ijtihad, they should _____ to the qiblah and continue.',
        options: undefined,
        correctAnswer: 'turn',
        explanation: 'Al-Quduri states: "If he learns [he was wrong] while in prayer, he turns (istadara) toward the qiblah and continues (bana \'alayha)." The prayer is not restarted.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'If a person has no clothing and must pray naked, what is the preferred manner?',
        options: JSON.stringify(['Standing and praying normally', 'Seated, indicating ruku\' and sujud by inclination', 'Lying down on the back', 'Praying with symbolic gestures only']),
        correctAnswer: 'Seated, indicating ruku\' and sujud by inclination',
        explanation: 'Al-Quduri states: "He prays naked while seated, indicating ruku\' and sujud by inclination (yumi\'). If he prays standing it is valid, but the seated position is preferred (al-awwal afdal)."',
        difficulty: 'HARD',
      },
    ],
  });

  // --- Unit 3: Fara'id al-Salah Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many obligatory integrals (fara\'id) does al-Quduri list for prayer?',
        options: JSON.stringify(['Four', 'Five', 'Six', 'Seven']),
        correctAnswer: 'Six',
        explanation: 'Al-Quduri lists six fara\'id of prayer: tahrima, qiyam, qira\'ah, ruku\', sujud, and the final sitting (qa\'dah akhirah) for the duration of the tashahhud.',
        difficulty: 'EASY',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Abu Hanifah, if someone opens the prayer saying "Allah is greater" (Allahu Akbar) or "Allah is most great" (Allahu A\'zam) instead of the standard takbir, is it valid?',
        options: JSON.stringify(['No — only "Allahu Akbar" is valid', 'Yes — any wording of glorification is valid', 'Yes — according to Abu Hanifah and Muhammad', 'No — according to all three imams']),
        correctAnswer: 'Yes — according to Abu Hanifah and Muhammad',
        explanation: 'Al-Quduri records: Abu Hanifah and Muhammad hold that using alternative wordings of glorification (e.g., "Allahu Ajall" or "Allahu A\'zam") is valid for the opening takbir. Abu Yusuf said only "Allahu Akbar" is valid.',
        difficulty: 'HARD',
      },
      {
        unitId: unit3.id,
        type: 'TRUE_FALSE',
        questionText: 'The final sitting (qa\'dah akhirah) is a fard of prayer.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Al-Quduri explicitly lists "al-qa\'dah al-akhirah miqdar al-tashahhud" (the final sitting for the duration of the tashahhud) as one of the six fara\'id of prayer.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'FILL_BLANK',
        questionText: 'The opening "Allahu Akbar" that enters one into the state of prayer is called the _____.',
        options: undefined,
        correctAnswer: 'tahrima',
        explanation: 'The tahrima (تحريمة) is the opening "Allahu Akbar" that makes permissible acts of worship (like du\'a) impermissible until the prayer is complete — hence the name from "tahrim" (prohibition). It is the first of the six fara\'id.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Unit 4: Sifat al-Salah Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Where does al-Quduri say the hands are placed after the opening takbir?',
        options: JSON.stringify(['On the chest', 'Below the navel', 'At the sides', 'On the thighs']),
        correctAnswer: 'Below the navel',
        explanation: 'Al-Quduri states: "He places his right hand over his left and puts them below the navel (tahta surratih)." This is the standard Hanafi position for hand placement in prayer.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to al-Quduri, what is the minimum number of times "Subhana Rabbiyal Azim" should be said in ruku\'?',
        options: JSON.stringify(['Once', 'Twice', 'Three times', 'Seven times']),
        correctAnswer: 'Three times',
        explanation: 'Al-Quduri states "subhana rabbiyal \'azim thalathan wa dhalika adnah" — three times is the minimum (adna). This applies to both ruku\' and sujud.',
        difficulty: 'EASY',
      },
      {
        unitId: unit4.id,
        type: 'TRUE_FALSE',
        questionText: 'According to Abu Hanifah, it is valid to prostrate on the nose alone without touching the forehead to the ground.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Al-Quduri records: "If he confines himself to one of the two [nose or forehead alone] it is valid according to Abu Hanifah." Abu Yusuf and Muhammad said confining to the nose alone is not valid except due to excuse.',
        difficulty: 'HARD',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many rak\'ahs does the Witr prayer have according to al-Quduri, and how is it structured?',
        options: JSON.stringify(['One rak\'ah', 'Three rak\'ahs with salam after two then one more', 'Three rak\'ahs with no salam between them', 'Two rak\'ahs plus one optional']),
        correctAnswer: 'Three rak\'ahs with no salam between them',
        explanation: 'Al-Quduri states: "al-witr: thalath raka\'at la yafsal baynahuma bi-salam" — three rak\'ahs with no salam separating them. This is the Hanafi position, distinguishing it from the Hanbali view of one rak\'ah.',
        difficulty: 'HARD',
      },
      {
        unitId: unit4.id,
        type: 'FILL_BLANK',
        questionText: 'The du\'a recited in the third rak\'ah of Witr before the ruku\' is called the _____.',
        options: undefined,
        correctAnswer: 'qunut',
        explanation: 'Al-Quduri states the qunut is recited "qabla al-ruku\' fi jami\' al-sanah" — before the ruku\' throughout the entire year in Witr. This distinguishes the Hanafi position from other schools where qunut in Fajr is done instead.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is added to the tashahhud in the final sitting (qa\'dah akhirah) that is not said in the first sitting?',
        options: JSON.stringify(['The Fatiha', 'Salat Ibrahimiyyah and du\'a', 'The adhan', 'Surah al-Ikhlas']),
        correctAnswer: 'Salat Ibrahimiyyah and du\'a',
        explanation: 'Al-Quduri states that in the first sitting he does not add to the tashahhud. In the final sitting he recites the tashahhud, then prays upon the Prophet ﷺ (salat Ibrahimiyyah), then makes du\'a with words that resemble Qur\'anic language and transmitted supplications.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Unit 5: Al-Jama'ah Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the status of congregational prayer (jama\'ah) according to al-Quduri?',
        options: JSON.stringify(['Fard (obligatory)', 'Wajib (necessary)', 'Sunnah mu\'akkadah (emphasized sunnah)', 'Mustahabb (recommended)']),
        correctAnswer: 'Sunnah mu\'akkadah (emphasized sunnah)',
        explanation: 'Al-Quduri states: "al-jama\'ah sunnah mu\'akkadah" — congregation is an emphasized sunnah.',
        difficulty: 'EASY',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'When one person prays behind the imam, where does he stand?',
        options: JSON.stringify(['Directly behind the imam', 'To the left of the imam', 'To the right of the imam', 'In front of the imam']),
        correctAnswer: 'To the right of the imam',
        explanation: 'Al-Quduri states: "Whoever prays with one person places him to his right (aqamahu \'an yaminihi)." When there are two or more followers, the imam stands ahead of them.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'TRUE_FALSE',
        questionText: 'If a woman stands next to a man in the same congregational prayer, the man\'s prayer is invalidated.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Al-Quduri states: "If a woman stands next to a man and they are both in the same prayer (mushtarikan fi salah wahidah), his prayer is invalidated (fasadat salatuh)." This is a distinctive Hanafi ruling on muhazat al-mar\'ah.',
        difficulty: 'HARD',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'If the imam loses his wudu\' mid-prayer, what should he do?',
        options: JSON.stringify(['Stop the prayer and start again', 'Continue without wudu\'', 'Appoint a deputy (istikhlaf), perform wudu\', and continue', 'Signal to the congregation to stop']),
        correctAnswer: 'Appoint a deputy (istikhlaf), perform wudu\', and continue',
        explanation: 'Al-Quduri states: "If he was the imam, he appoints a deputy (istakhlafa), performs wudu\', and continues (bana \'ala salatih) — though starting again (al-istinaf) is better."',
        difficulty: 'HARD',
      },
    ],
  });

  // --- Unit 6: Salat al-Musafir Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to al-Quduri, what is the minimum travel distance that qualifies for qasr (shortening prayer)?',
        options: JSON.stringify(['One day\'s journey', 'Two days\' journey', 'Three days\' and nights\' journey by camel/foot', 'Half a day\'s journey']),
        correctAnswer: 'Three days\' and nights\' journey by camel/foot',
        explanation: 'Al-Quduri defines qualifying travel as intending a destination that is "three days\' and nights\' journey at the pace of camels and walking on foot." This is the standard Hanafi position, roughly 77-97 km in modern measurements.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many rak\'ahs does a traveler pray for the four-rak\'ah prayers (Dhuhr, Asr, Isha\')?',
        options: JSON.stringify(['Four rak\'ahs as normal', 'Two rak\'ahs', 'Three rak\'ahs', 'The traveler may choose']),
        correctAnswer: 'Two rak\'ahs',
        explanation: 'Al-Quduri states: "The obligation for a traveler in our school is two rak\'ahs for every four-rak\'ah prayer — he may not add to them."',
        difficulty: 'EASY',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How long must a traveler intend to stay in a place before he must complete the full prayer (become a muqim)?',
        options: JSON.stringify(['3 days', '7 days', '10 days', '15 days or more']),
        correctAnswer: '15 days or more',
        explanation: 'Al-Quduri states that a traveler remains under the ruling of travel "until he intends to reside in a city for fifteen days or more (khamsata \'ashara yawman fa-sa\'idan) — then he must complete the full prayer."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'TRUE_FALSE',
        questionText: 'If a prayer was missed during travel, it must be made up as four rak\'ahs when at home.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Al-Quduri states: "Whoever misses a prayer during travel makes it up as two rak\'ahs even when at home (fi al-hadar)." The state at the time the prayer was missed determines how it is made up.',
        difficulty: 'HARD',
      },
    ],
  });

  // --- Unit 7: Jumu'ah & Eidayn Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Abu Hanifah, what is the minimum number of people (besides the imam) required for a valid Jumu\'ah prayer?',
        options: JSON.stringify(['One', 'Two', 'Three', 'Forty']),
        correctAnswer: 'Three',
        explanation: 'Al-Quduri states: "The minimum congregation [for Jumu\'ah] according to Abu Hanifah is three besides the imam." Abu Yusuf and Muhammad said: two besides the imam.',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'TRUE_FALSE',
        questionText: 'Jumu\'ah prayer is obligatory upon women who are able to attend.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Al-Quduri states: "Jumu\'ah is not obligatory upon a traveler, a woman, a sick person, a slave, or a blind person." However, if a woman does attend and pray with the congregation, it counts as her obligatory prayer.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'In the Eid prayer, how many extra takbirs are said in the first rak\'ah (besides the opening takbir) and how many in the second?',
        options: JSON.stringify(['3 in first, 3 in second (before ruku\')', '7 in first, 5 in second', '4 in first, 3 in second', '3 in first, 4 in second (including ruku\' takbir)']),
        correctAnswer: '3 in first, 3 in second (before ruku\')',
        explanation: 'Al-Quduri states: In the first rak\'ah — opening takbir + 3 extra takbirs, then Fatihah + surah, then takbir for ruku\'. In the second rak\'ah — recitation first, then 3 extra takbirs, then a fourth takbir for ruku\'.',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'When is the khutbah delivered relative to the Eid prayer?',
        options: JSON.stringify(['Before the prayer', 'After the prayer', 'During the prayer', 'On the day before']),
        correctAnswer: 'After the prayer',
        explanation: 'Al-Quduri states that after the Eid prayer the imam delivers two khutbahs. This is opposite to Jumu\'ah where the khutbah precedes the prayer.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'TRUE_FALSE',
        questionText: 'Jumu\'ah is valid in a village (qaryah) according to al-Quduri.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Al-Quduri states: "It [Jumu\'ah] is not valid in villages (la tajuzu fi al-qura)." It requires a proper city (misr jami\') or its designated prayer ground.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Created quiz questions for all 8 units');

  // ══════════════════════════════════════════════
  // FLASHCARDS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🃏 Creating flashcards...');

  // --- Unit 0: Awqat al-Salah Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Shafaq (شفق) — Abu Hanifah',
        back: 'The white light remaining on the horizon after the red glow has gone — marks the end of Maghrib time according to Abu Hanifah.',
        frontArabic: 'شَفَق',
        backArabic: 'البَيَاض الذِي فِي الأُفُق بَعْدَ الحُمْرَة',
        category: 'fiqh-term',
        tags: ['prayer-times', 'maghrib', 'shafaq'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Fay\' al-Zawal (فيء الزوال)',
        back: 'The noon shadow — the shadow of an object at the time the sun is at its zenith. It is excluded when measuring Dhuhr time.',
        frontArabic: 'فَيْء الزَّوَال',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['prayer-times', 'dhuhr', 'shadow'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Isfar (إسفار)',
        back: 'Praying Fajr in the brightness — when the dawn light has fully spread. The recommended time for Fajr in the Hanafi school.',
        frontArabic: 'إِسْفَار',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['prayer-times', 'fajr', 'recommended'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Ibrad (إبراد)',
        back: 'Delaying Dhuhr in summer until the extreme heat subsides — a recommended act according to al-Quduri.',
        frontArabic: 'إِبْرَاد',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['prayer-times', 'dhuhr', 'summer'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Witr Time',
        back: 'Begins after Isha\' and ends before the second dawn (Fajr). For those confident they will wake, it is recommended to delay Witr to the end of the night.',
        frontArabic: 'وَقْت الوِتْر',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['witr', 'prayer-times'],
        difficulty: 'EASY' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit0.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 1: Adhan Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Adhan',
        back: 'The call to prayer — a sunnah for the five daily prayers and Jumu\'ah. Pronounced slowly and deliberately (tartil).',
        frontArabic: 'أَذَان',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['adhan', 'sunnah'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Iqamah',
        back: 'The second call announcing the prayer is about to begin — mirrors the adhan but is recited quickly (hadr), and adds "Qad qamat al-salah" twice.',
        frontArabic: 'إِقَامَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['iqamah', 'adhan'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Tarji\' (ترجيع)',
        back: 'Repeating the shahada quietly then aloud in the adhan. It is NOT part of the Hanafi adhan (al-Quduri states "la tarji\' fihi").',
        frontArabic: 'تَرْجِيع',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['adhan', 'hanafi', 'tarji'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Al-Tathlwib (التثويب)',
        back: '"Al-salatu khayrun min al-nawm" — added in the Fajr adhan after "hayya \'ala al-falah," said twice.',
        frontArabic: 'التَّثْوِيب',
        backArabic: 'الصَّلَاةُ خَيْرٌ مِنَ النَّوْم',
        category: 'fiqh-term',
        tags: ['adhan', 'fajr', 'tathlwib'],
        difficulty: 'MEDIUM' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit1.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 2: Shurut al-Salah Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: '\'Awrah of a Free Woman',
        back: 'The entire body is \'awrah except the face, both hands, and both feet. (Note: feet are NOT \'awrah according to the Hanafi school.)',
        frontArabic: 'عَوْرَة المَرْأَة الحُرَّة',
        backArabic: 'كُلُّهَا عَوْرَة إِلَّا وَجْهَهَا وَكَفَّيْهَا وَقَدَمَيْهَا',
        category: 'fiqh-term',
        tags: ['awrah', 'woman', 'prayer'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: '\'Awrah of a Man',
        back: 'From below the navel to the knee (inclusive). The knee itself is part of the \'awrah.',
        frontArabic: 'عَوْرَة الرَّجُل',
        backArabic: 'مَا تَحْتَ السُّرَّة إِلَى الرُّكْبَة',
        category: 'fiqh-term',
        tags: ['awrah', 'man', 'prayer'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Niyyah in Prayer',
        back: 'Intention — made in the heart for the specific prayer being entered. It must not be separated from the opening takbir by any action.',
        frontArabic: 'نِيَّة الصَّلَاة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['niyyah', 'intention', 'shurut'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Ijtihad for Qiblah',
        back: 'If the qiblah is unclear and no one can be asked, one exercises independent judgment (ijtihad) and prays. A post-prayer discovery of error does not require repetition.',
        frontArabic: 'اِجْتِهَاد فِي القِبْلَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['qiblah', 'ijtihad', 'shurut'],
        difficulty: 'HARD' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit2.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 3: Fara'id al-Salah Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Tahrima (تحريمة)',
        back: 'The opening "Allahu Akbar" that enters one into the state of prayer — the first fard of prayer. It makes normally permissible actions (eating, talking) forbidden until the prayer ends.',
        frontArabic: 'تَحْرِيمَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['fara\'id', 'tahrima', 'prayer'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Qa\'dah Akhirah (القعدة الأخيرة)',
        back: 'The final sitting — a fard of prayer for the duration of the tashahhud. If omitted, the prayer is invalid.',
        frontArabic: 'القَعْدَة الأَخِيرَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['fara\'id', 'qa\'dah', 'tashahhud'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Qira\'ah (قراءة)',
        back: 'Recitation of Qur\'an — a fard of prayer. Minimum: one verse (Abu Hanifah) or three short verses/one long verse (Abu Yusuf & Muhammad).',
        frontArabic: 'قِرَاءَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['fara\'id', 'qira\'ah', 'recitation'],
        difficulty: 'MEDIUM' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit3.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 4: Sifat al-Salah Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Thana\' (ثناء)',
        back: 'The opening glorification after the tahrima: "Subhanaka Allahumma wa bihamdika, wa tabaraka ismuka, wa ta\'ala jadduka, wa la ilaha ghayruk."',
        frontArabic: 'ثَنَاء',
        backArabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ',
        category: 'fiqh-term',
        tags: ['sifat', 'thana', 'opening'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Tashahhud',
        back: 'The testimony recited in the sitting: "Al-tahiyyatu lillahi wal-salawatu wal-tayyibat, al-salamu \'alayka ayyuha al-Nabiyyu..." — not added to in the first sitting.',
        frontArabic: 'تَشَهُّد',
        backArabic: 'التَّحِيَّاتُ لِلَّهِ',
        category: 'fiqh-term',
        tags: ['tashahhud', 'sitting', 'prayer'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Qunut (قنوت)',
        back: 'The du\'a recited in the third rak\'ah of Witr, before ruku\', throughout the entire year — a Hanafi distinctive.',
        frontArabic: 'قُنُوت',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['witr', 'qunut', 'du\'a'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Tasnim al-Yadayn (رفع اليدين)',
        back: 'Raising the hands — done only at the opening takbir in the Hanafi school. The thumbs should reach the earlobes.',
        frontArabic: 'رَفْع اليَدَيْن',
        backArabic: 'حَتَّى يُحَاذِيَ بِإِبْهَامَيْهِ شَحْمَتَيْ أُذُنَيْهِ',
        category: 'fiqh-term',
        tags: ['rafa\' yadayn', 'takbir', 'hanafi'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Amin (آمين)',
        back: 'Said quietly after "wa la al-dallin" in the Hanafi school — both imam and followers say it quietly.',
        frontArabic: 'آمِين',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['amin', 'fatiha', 'hanafi'],
        difficulty: 'EASY' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit4.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 5: Al-Jama'ah Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Sunnah Mu\'akkadah',
        back: 'Emphasized sunnah — the ruling on congregational prayer (jama\'ah) in the Hanafi school.',
        frontArabic: 'سُنَّة مُؤَكَّدَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['jama\'ah', 'sunnah', 'congregation'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Istikhlaf (استخلاف)',
        back: 'Appointing a deputy imam — done by the imam if he loses wudu\' mid-prayer. He appoints someone to continue leading, then completes his own prayer after wudu\'.',
        frontArabic: 'اِسْتِخْلَاف',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['jama\'ah', 'istikhlaf', 'imam'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Muhazat al-Mar\'ah (محاذاة المرأة)',
        back: 'A woman standing beside a man in the same prayer — invalidates the man\'s prayer in the Hanafi school (a distinctive ruling).',
        frontArabic: 'مُحَاذَاة المَرْأَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['jama\'ah', 'woman', 'invalidation'],
        difficulty: 'HARD' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit5.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 6: Salat al-Musafir Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Qasr (قصر)',
        back: 'Shortening prayer — the obligation for a traveler to pray two rak\'ahs instead of four for Dhuhr, Asr, and Isha\'.',
        frontArabic: 'قَصْر',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['travel', 'qasr', 'shortening'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Qasr Distance (Hanafi)',
        back: 'Three days\' and nights\' journey by camel/foot — the minimum travel distance for qasr in the Hanafi school.',
        frontArabic: 'مَسَافَة القَصْر',
        backArabic: 'مَسِيرَة ثَلَاثَة أَيَّام وَلَيَالِيهَا',
        category: 'fiqh-term',
        tags: ['travel', 'qasr', 'distance'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Niyyat al-Iqamah (نية الإقامة)',
        back: 'Intending to stay 15+ days — when a traveler makes this intention in a city, he becomes a resident (muqim) and must pray the full prayer.',
        frontArabic: 'نِيَّة الإِقَامَة',
        backArabic: 'خَمْسَة عَشَر يَوْمًا فَصَاعِدًا',
        category: 'fiqh-term',
        tags: ['travel', 'muqim', 'intention'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Qada\' during travel',
        back: 'A prayer missed during travel is made up as 2 rak\'ahs even when at home. A prayer missed at home is made up as 4 rak\'ahs even when traveling.',
        frontArabic: 'قَضَاء الفَائِتَة في السَّفَر',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['travel', 'qada', 'makeup'],
        difficulty: 'HARD' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit6.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 7: Jumu'ah & Eidayn Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Misr Jami\' (مصر جامع)',
        back: 'A proper city — required for the validity of Jumu\'ah prayer in the Hanafi school. Jumu\'ah is not valid in villages.',
        frontArabic: 'مِصْر جَامِع',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['jumu\'ah', 'misr', 'city'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Minimum Jumu\'ah Congregation (Abu Hanifah)',
        back: 'Three people besides the imam. (Abu Yusuf and Muhammad: two besides the imam.)',
        frontArabic: 'أَقَل الجَمَاعَة لِلجُمُعَة',
        backArabic: 'ثَلَاثَة سِوَى الإِمَام',
        category: 'fiqh-term',
        tags: ['jumu\'ah', 'congregation', 'minimum'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Eid Extra Takbirs',
        back: '3 extra takbirs in the first rak\'ah (after opening takbir), then recitation + takbir for ruku\'. In the second: recitation, then 3 extra takbirs, then 4th for ruku\'.',
        frontArabic: 'تَكْبِيرَات العِيد',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['eid', 'takbir', 'prayer'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Khutbah Timing: Jumu\'ah vs Eid',
        back: 'Jumu\'ah: khutbah BEFORE the prayer. Eid: khutbah AFTER the prayer. This is an important distinction in Hanafi fiqh.',
        frontArabic: 'وَقْت الخُطْبَة',
        backArabic: 'الجُمُعَة: قَبْل — العِيد: بَعْد',
        category: 'fiqh-term',
        tags: ['khutbah', 'jumu\'ah', 'eid'],
        difficulty: 'MEDIUM' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit7.id, courseId: course.id, orderIndex: i })),
  });

  console.log('✅ Created flashcards for all 8 units');

  // ══════════════════════════════════════════════
  // ARABIC TERMS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🔤 Creating Arabic terms...');

  await prisma.arabicTerm.createMany({
    data: [
      // Unit 0: Awqat al-Salah terms
      { unitId: unit0.id, arabicText: 'وَقْت', transliteration: 'Waqt', translation: 'Time — the prescribed window for each prayer' },
      { unitId: unit0.id, arabicText: 'فَجْر', transliteration: 'Fajr', translation: 'Dawn prayer — begins at second dawn, ends at sunrise' },
      { unitId: unit0.id, arabicText: 'زَوَال', transliteration: 'Zawāl', translation: 'The sun passing its zenith — marks the beginning of Dhuhr' },
      { unitId: unit0.id, arabicText: 'شَفَق', transliteration: 'Shafaq', translation: 'Twilight — marks end of Maghrib (white light per Abu Hanifah)' },
      { unitId: unit0.id, arabicText: 'وِتْر', transliteration: 'Witr', translation: 'The odd prayer — 3 rak\'ahs, after Isha\', before dawn' },
      { unitId: unit0.id, arabicText: 'إِسْفَار', transliteration: 'Isfār', translation: 'Praying Fajr in the brightness — the recommended time' },

      // Unit 1: Adhan terms
      { unitId: unit1.id, arabicText: 'أَذَان', transliteration: 'Adhān', translation: 'Call to prayer — sunnah for the five prayers and Jumu\'ah' },
      { unitId: unit1.id, arabicText: 'إِقَامَة', transliteration: 'Iqāmah', translation: 'Second call announcing the prayer is about to begin' },
      { unitId: unit1.id, arabicText: 'مُؤَذِّن', transliteration: 'Mu\'adhdhin', translation: 'The one who gives the adhan' },
      { unitId: unit1.id, arabicText: 'تَرْجِيع', transliteration: 'Tarjī\'', translation: 'Repetition of the shahada quietly — NOT in the Hanafi adhan' },
      { unitId: unit1.id, arabicText: 'حَيَّ عَلَى الصَّلَاة', transliteration: 'Ḥayya \'ala al-Ṣalāh', translation: 'Hasten to the prayer — said while turning head right' },
      { unitId: unit1.id, arabicText: 'حَيَّ عَلَى الفَلَاح', transliteration: 'Ḥayya \'ala al-Falāḥ', translation: 'Hasten to success — said while turning head left' },

      // Unit 2: Shurut al-Salah terms
      { unitId: unit2.id, arabicText: 'شُرُوط', transliteration: 'Shurūṭ', translation: 'Prerequisites/conditions — things required before prayer' },
      { unitId: unit2.id, arabicText: 'عَوْرَة', transliteration: '\'Awrah', translation: 'The area of the body that must be covered' },
      { unitId: unit2.id, arabicText: 'حَدَث', transliteration: 'Ḥadath', translation: 'Ritual impurity — requires wudu\' or ghusl to remove' },
      { unitId: unit2.id, arabicText: 'نَجَاسَة', transliteration: 'Najāsah', translation: 'Physical impurity — must be removed from body, clothing, place' },
      { unitId: unit2.id, arabicText: 'اِسْتِقْبَال القِبْلَة', transliteration: 'Istiqbāl al-Qiblah', translation: 'Facing the qiblah — a prerequisite of valid prayer' },

      // Unit 3: Fara'id al-Salah terms
      { unitId: unit3.id, arabicText: 'فَرَائِض', transliteration: 'Farā\'iḍ', translation: 'Obligatory integrals of prayer — omitting one invalidates the prayer' },
      { unitId: unit3.id, arabicText: 'تَحْرِيمَة', transliteration: 'Taḥrīmah', translation: 'Opening "Allahu Akbar" — enters one into the prayer state' },
      { unitId: unit3.id, arabicText: 'قِيَام', transliteration: 'Qiyām', translation: 'Standing — obligatory for those able' },
      { unitId: unit3.id, arabicText: 'رُكُوع', transliteration: 'Rukū\'', translation: 'Bowing — back level, hands on knees' },
      { unitId: unit3.id, arabicText: 'سُجُود', transliteration: 'Sujūd', translation: 'Prostration — on forehead, nose, hands, knees, and toes' },
      { unitId: unit3.id, arabicText: 'قَعْدَة', transliteration: 'Qa\'dah', translation: 'Sitting — the final sitting is a fard of prayer' },

      // Unit 4: Sifat al-Salah terms
      { unitId: unit4.id, arabicText: 'ثَنَاء', transliteration: 'Thanā\'', translation: 'Opening glorification — "Subhanaka Allahumma..."' },
      { unitId: unit4.id, arabicText: 'تَعَوُّذ', transliteration: 'Ta\'awwudh', translation: 'Seeking refuge — "A\'udhu billahi min al-shaytan al-rajim"' },
      { unitId: unit4.id, arabicText: 'تَشَهُّد', transliteration: 'Tashahhud', translation: 'The testimony recited in the sitting position' },
      { unitId: unit4.id, arabicText: 'صَلَاة إِبْرَاهِيمِيَّة', transliteration: 'Ṣalāt Ibrāhīmiyyah', translation: 'Blessing upon the Prophet ﷺ in the final sitting' },
      { unitId: unit4.id, arabicText: 'سَلَام', transliteration: 'Salām', translation: 'The ending: "Al-salamu \'alaykum wa rahmatullah" right and left' },
      { unitId: unit4.id, arabicText: 'قُنُوت', transliteration: 'Qunūt', translation: 'Du\'a in 3rd rak\'ah of Witr before ruku\' — year-round (Hanafi)' },

      // Unit 5: Al-Jama'ah terms
      { unitId: unit5.id, arabicText: 'جَمَاعَة', transliteration: 'Jamā\'ah', translation: 'Congregation — emphasized sunnah in the Hanafi school' },
      { unitId: unit5.id, arabicText: 'إِمَام', transliteration: 'Imām', translation: 'Prayer leader — most knowledgeable of the Sunnah leads' },
      { unitId: unit5.id, arabicText: 'مَأْمُوم', transliteration: 'Ma\'mūm', translation: 'Follower in prayer — stands behind or to the right of the imam' },
      { unitId: unit5.id, arabicText: 'اِسْتِخْلَاف', transliteration: 'Istikhlāf', translation: 'Appointing a deputy imam — done if imam loses wudu\' mid-prayer' },
      { unitId: unit5.id, arabicText: 'مُحَاذَاة', transliteration: 'Muḥādhāh', translation: 'Standing alongside — woman next to man invalidates his prayer' },

      // Unit 6: Salat al-Musafir terms
      { unitId: unit6.id, arabicText: 'مُسَافِر', transliteration: 'Musāfir', translation: 'Traveler — subject to qasr when traveling the qualifying distance' },
      { unitId: unit6.id, arabicText: 'قَصْر', transliteration: 'Qaṣr', translation: 'Shortening — praying 2 rak\'ahs for 4-rak\'ah prayers while traveling' },
      { unitId: unit6.id, arabicText: 'مُقِيم', transliteration: 'Muqīm', translation: 'Resident — one who is not traveling; intends 15+ days stay' },
      { unitId: unit6.id, arabicText: 'وَطَن', transliteration: 'Waṭan', translation: 'Homeland — returning to one\'s original home restores residency' },

      // Unit 7: Jumu'ah & Eidayn terms
      { unitId: unit7.id, arabicText: 'جُمُعَة', transliteration: 'Jumu\'ah', translation: 'Friday prayer — requires city, authority, khutbah, and congregation' },
      { unitId: unit7.id, arabicText: 'خُطْبَة', transliteration: 'Khuṭbah', translation: 'Sermon — before prayer in Jumu\'ah, after in Eid' },
      { unitId: unit7.id, arabicText: 'مِصْر', transliteration: 'Miṣr', translation: 'City — required location for valid Jumu\'ah prayer' },
      { unitId: unit7.id, arabicText: 'عِيد', transliteration: '\'Īd', translation: 'Celebration — \'Id al-Fitr and \'Id al-Adha, 2 rak\'ahs with extra takbirs' },
      { unitId: unit7.id, arabicText: 'تَكْبِيرَات العِيد', transliteration: 'Takbīrāt al-\'Īd', translation: 'Extra takbirs in Eid prayer — 3 in first rak\'ah, 3 in second' },
    ],
  });

  console.log('✅ Created Arabic terms for all 8 units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 Mukhtasar al-Quduri: Kitab al-Salah seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: Mukhtasar al-Quduri: Kitab al-Salah (Book of Prayer)');
  console.log('   - 8 Units covering all main sections of Kitab al-Salah');
  console.log('   - 42 Quiz questions across all units');
  console.log('   - 35 Flashcards with Hanafi prayer terminology');
  console.log('   - 55 Arabic terms with transliteration and translation');
}

// Allow standalone execution
async function main() {
  try {
    await seedQuduriSalah();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Mukhtasar al-Quduri: Kitab al-Salah:', error);
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
