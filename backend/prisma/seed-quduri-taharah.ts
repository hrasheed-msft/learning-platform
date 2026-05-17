import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Mukhtasar al-Quduri — Kitab al-Taharah (Book of Purification) Seed
 * Source: Classical Hanafi fiqh text by Imam Ahmad ibn Muhammad al-Quduri (d. 428 AH)
 *
 * Covers ten sections of Taharah: Fard of Wudu, Sunan of Wudu, Nawaqid al-Wudu,
 * Fard/Sunan of Ghusl, Types of Water, Rulings on Wells, Tayammum,
 * Wiping Over Footwear, Menstruation & Nifas, and Impurities.
 *
 * Can be run independently: npx ts-node prisma/seed-quduri-taharah.ts
 */

export async function seedQuduriTaharah() {
  console.log('📚 Starting Mukhtasar al-Quduri: Kitab al-Taharah seed...');
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
    where: { title: 'Mukhtasar al-Quduri: Kitab al-Taharah (Book of Purification)' },
  });
  if (existing) {
    console.log('⏭️  Mukhtasar al-Quduri: Kitab al-Taharah already exists — skipping.');
    return;
  }

  // ──────────────────────────────────────────────
  // COURSE
  // ──────────────────────────────────────────────

  const course = await prisma.course.create({
    data: {
      title: 'Mukhtasar al-Quduri: Kitab al-Taharah (Book of Purification)',
      description:
        'A comprehensive study of the Book of Purification (Kitab al-Taharah) from Mukhtasar al-Quduri, the classical Hanafi fiqh manual authored by Imam Abu al-Husayn Ahmad ibn Muhammad al-Quduri (362–428 AH). This course covers the obligatory and sunnah acts of wudu, nullifiers of wudu, obligatory ghusl, types of purifying water, rulings on wells, tayammum, wiping over footwear (khuffayn), menstruation and post-natal bleeding, and the purification of impurities. All rulings follow the Hanafi madhhab.',
      category: 'FIQH',
      ageLevels: ['TEEN', 'ADULT'],
      isPublished: true,
    },
  });

  console.log('✅ Created course:', course.title);

  // ──────────────────────────────────────────────
  // UNIT 0: فرض الطهارة — Obligations of Wudu
  // ──────────────────────────────────────────────

  const unit0 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Farḍ al-Ṭahārah — Obligations of Wuḍū\'',
      description:
        'The obligatory (farḍ) acts of wuḍū\' as established by the Qur\'anic verse of ablution, according to the Hanafi school.',
      orderIndex: 0,
      content: `
<h2>فرض الطهارة — Obligations of Wuḍū'</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">قال الله تعالى: {يا أيها الذين آمنوا إذا قمتم إلى الصلاة فاغسلوا وجوهكم وأيديكم إلى المرافق وامسحوا برؤوسكم وأرجلكم إلى الكعبين}</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Allah Most High said: "O you who believe, when you stand for prayer, wash your faces and your hands up to the elbows, wipe your heads, and [wash] your feet up to the ankles." (Qur'an 5:6)</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ففرض الطهارة:</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The obligatory acts of purification (wuḍū') are:</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">غسل الأعضاء الثلاثة ومسح الرأس والمرفقان والكعبان يدخلان في الغسل والمفروض في مسح الرأس مقدار الناصية لما روى المغيرة بن شعبة [أن النبي صلى الله عليه وسلم أتى سباطة قوم فبال وتوضأ ومسح على ناصيته وخفيه]</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Washing the three limbs (the face, the two hands up to and including the elbows, and the two feet up to and including the ankles) and wiping the head. The elbows and ankles are included in the washing. The obligatory amount for wiping the head is the extent of the forelock (nāṣiyah), based on the narration of al-Mughīrah ibn Shu'bah that the Prophet ﷺ came to the rubbish heap of a people, urinated, performed wuḍū', and wiped over his forelock and his leather socks.</div>
</div>

<h3>Summary of the Four Farā'iḍ of Wuḍū' (Hanafi)</h3>
<ol>
  <li><strong>Washing the face</strong> — from the hairline to below the chin, and from ear to ear.</li>
  <li><strong>Washing both arms</strong> — including the elbows.</li>
  <li><strong>Wiping one-quarter of the head</strong> — the amount of the forelock (nāṣiyah).</li>
  <li><strong>Washing both feet</strong> — including the ankles.</li>
</ol>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 0: Farḍ al-Ṭahārah');
  // ──────────────────────────────────────────────
  // UNIT 1: سنن الطهارة — Sunnah Acts of Wudu
  // ──────────────────────────────────────────────

  const unit1 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Sunan al-Ṭahārah — Sunnah Acts of Wuḍū\'',
      description:
        'The recommended (sunnah) acts of wuḍū\' including washing the hands, saying Bismillāh, using the miswāk, and more.',
      orderIndex: 1,
      content: `
<h2>سنن الطهارة — Sunnah Acts of Wuḍū'</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وسنن الطهارة:</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The sunnah acts of purification are:</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وغسل اليدين قبل إدخالها إذا استيقظ المتوضئ من نومه وتسمية الله تعالى في ابتداء الوضوء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Washing the hands before inserting them [into the vessel] when the person performing wuḍū' has woken from sleep, and mentioning the name of Allah Most High at the beginning of wuḍū'.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والسواك والمضمضة والأستنشاق ومسح الأذنين وتخليل اللحية والأصابع وتكرار الغسل إلى الثلاث</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Using the tooth-stick (siwāk), rinsing the mouth (maḍmaḍah), sniffing water into the nose (istinshāq), wiping the ears, passing wet fingers through the beard and between the fingers/toes (takhlīl), and repeating each washing three times.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويستحب للمتوضئ أن ينوي الطهارة ويستوعب رأسه بالمسح ويرتب الوضوء فيبدأ بما بدأ الله تعالى بذكره وبالميامن</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> It is recommended (mustaḥabb) for the one performing wuḍū' to make the intention (niyyah) for purification, to wipe the entire head, to maintain the proper sequence (tartīb) — beginning with what Allah Most High mentioned first — and to begin with the right side.</div>
</div>

<h3>Summary of the Sunan of Wuḍū' (Hanafi)</h3>
<ul>
  <li>Washing the hands up to the wrist (upon waking)</li>
  <li>Saying <em>Bismillāh</em></li>
  <li>Using the <em>siwāk</em> (miswāk)</li>
  <li>Rinsing the mouth (<em>maḍmaḍah</em>)</li>
  <li>Sniffing water into the nose (<em>istinshāq</em>)</li>
  <li>Wiping the ears</li>
  <li>Running fingers through the beard and between fingers/toes (<em>takhlīl</em>)</li>
  <li>Washing each limb three times</li>
  <li>Making intention (<em>niyyah</em>)</li>
  <li>Wiping the entire head</li>
  <li>Maintaining the sequence (<em>tartīb</em>)</li>
  <li>Beginning with the right side</li>
</ul>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 1: Sunan al-Ṭahārah');

  // ──────────────────────────────────────────────
  // UNIT 2: نواقض الوضوء — Nullifiers of Wudu
  // ──────────────────────────────────────────────

  const unit2 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Nawāqiḍ al-Wuḍū\' — Nullifiers of Wuḍū\'',
      description:
        'The actions and occurrences that invalidate wuḍū\' according to the Hanafi school.',
      orderIndex: 2,
      content: `
<h2>نواقض الوضوء — Nullifiers of Wuḍū'</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والمعاني الناقضة للوضوء:</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The things that nullify wuḍū' are:</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">كل ما خرج من السبيلين والدم والقيح والصديد إذا خرج من البدن فتجاوز إلى موضع يلحقه حكم التطهير والقيء إذا كان ملء الفم والنوم مضطجعا أو متكئا أو مستندا إلى شيء لو أزيل عنه لسقط والغلبة على العقل بالإغماء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Everything that exits from the two private parts; blood, pus, and serum if they exit from the body and flow beyond the point where purification would apply; vomiting if it fills the mouth; sleeping in a lying, reclining, or leaning position such that if the support were removed the person would fall; and loss of consciousness due to fainting.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والجنون والقهقهة في كل صلاة ذات ركوع وسجود</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> And insanity, and laughing out loud (qahqahah) in any prayer that contains bowing (rukū') and prostration (sujūd).</div>
</div>

<h3>Summary of Nawāqiḍ al-Wuḍū' (Hanafi)</h3>
<ol>
  <li>Anything exiting from the two private parts (front or back passage)</li>
  <li>Blood, pus, or serum flowing beyond the wound site</li>
  <li>Vomiting a mouthful</li>
  <li>Sleeping while lying down, reclining, or leaning</li>
  <li>Loss of consciousness (fainting)</li>
  <li>Insanity</li>
  <li>Laughing out loud in a prayer with rukū' and sujūd (unique Hanafi ruling)</li>
</ol>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 2: Nawāqiḍ al-Wuḍū\'');
  // ──────────────────────────────────────────────
  // UNIT 3: فرض الغسل وسننه — Obligatory Ghusl
  // ──────────────────────────────────────────────

  const unit3 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Farḍ al-Ghusl wa Sunanuhu — Obligatory Ghusl and Its Sunnah Acts',
      description:
        'The obligatory and sunnah acts of ghusl (ritual bath), and the causes that necessitate it.',
      orderIndex: 3,
      content: `
<h2>فرض الغسل وسننه — Obligatory Ghusl and Its Sunnah Acts</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وفرض الغسل: المضمضة والاستنشاق وغسل سائر البدن</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The obligatory acts of ghusl are: rinsing the mouth (maḍmaḍah), sniffing water into the nose (istinshāq), and washing the entire body.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وسنة الغسل:</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The sunnah method of ghusl is:</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">أن يبدأ المغتسل يديه وفرجه ويزيل النجاسة إن كانت على بدنه ثم يتوضأ وضوءه للصلاة إلا رجليه ثم يفيض الماء على رأسه وسائر جسده ثلاثا ثم يتنحى عن ذلك المكان فيغتسل رجليه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The one performing ghusl should begin by washing his hands and private parts, removing any impurity from the body, then performing wuḍū' as for prayer except for the feet, then pouring water over the head and the rest of the body three times, then moving to another spot and washing the feet.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وليس على المرأة أن تنقض ضفائرها في الغسل إذا بلغ الماء أصول الشعر</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> A woman is not required to undo her braids during ghusl if the water reaches the roots of her hair.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والمعاني الموجبة للغسل:</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The causes that make ghusl obligatory are:</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">إنزال المني على وجه الدفق والشهوة من الرجل والمرأة والتقاء الختانين من غير إنزال والحيض والنفاس</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The emission of semen with gushing and pleasure from a man or woman, the meeting of the two circumcised parts (sexual intercourse) even without emission, menstruation (ḥayḍ), and post-natal bleeding (nifās).</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وسن رسول الله صلى الله عليه وسلم الغسل للجمعة والعيدين والإحرام</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The Messenger of Allah ﷺ established the sunnah of ghusl for Friday (Jumu'ah), the two Eids, and entering the state of iḥrām.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وليس في المذي والودي غسل وفيهما الوضوء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Pre-seminal fluid (madhī) and prostatic fluid (wadī) do not necessitate ghusl — only wuḍū' is required for them.</div>
</div>

<h3>Summary: Three Farā'iḍ of Ghusl (Hanafi)</h3>
<ol>
  <li>Rinsing the mouth (<em>maḍmaḍah</em>)</li>
  <li>Sniffing water into the nose (<em>istinshāq</em>)</li>
  <li>Washing the entire body</li>
</ol>

<h3>Causes Requiring Ghusl</h3>
<ul>
  <li>Emission of semen with pleasure</li>
  <li>Sexual intercourse (even without emission)</li>
  <li>Menstruation</li>
  <li>Post-natal bleeding</li>
</ul>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 3: Farḍ al-Ghusl');
  // ──────────────────────────────────────────────
  // UNIT 4: المياه والطهارة — Types of Water & Purity
  // ──────────────────────────────────────────────

  const unit4 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Al-Miyāh wa al-Ṭahārah — Types of Water and Purity',
      description:
        'Which types of water are valid for purification, and rulings on impure, used, and mixed water.',
      orderIndex: 4,
      content: `
<h2>المياه والطهارة — Types of Water and Purity</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والطهارة من الأحداث جائزة بماء السماء والأودية والعيون والآبار وماء البحار ولا تجوز بما اعتصر من الشجر والثمر ولا بماء غلب عليه غيره وأخرجه عن طبع الماء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Purification from ritual impurities (aḥdāth) is permissible with rainwater, water from valleys, springs, wells, and sea water. It is not permissible with liquid extracted from trees or fruit, nor with water that has been overwhelmed by another substance such that it loses the nature of water.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">كالأشربة والخل وماء الورد وماء الباقلاء والمرق وماء الزردج</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Such as beverages, vinegar, rose water, bean water, broth, and safflower water.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وتجوز الطهارة بماء خالطة شيء طاهر فغير أحد أوصافه كماء المد والماء الذي يختلط به الأشنان والصابون والزعفران</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Purification is permissible with water that has been mixed with a pure substance which changes one of its properties, such as water mixed with mud, or water mixed with potash, soap, or saffron.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وكل ماء وقعت فيه نجاسة لم يجز اوضوء به قليلا أو كثيرا [لأن النبي عليه الصلاة والسلام أمر بحفظ الماء من النجاسة فقال لا يبولن أحدكم في الماء الدائم ولا يغتسلن فيه من الجنابة] و [قال عليه الصلاة والسلام: إذا استيقظ أحدكم من منامه فلا يغمسن يده في الإناء حتى يغسلها ثلاثا فإنه لا يدري أين باتت يده]</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Any water into which impurity has fallen is not permissible for wuḍū', whether it is a small or large quantity. This is because the Prophet ﷺ commanded the preservation of water from impurity, saying: "None of you should urinate in standing water, nor bathe in it due to major ritual impurity." And he ﷺ said: "When one of you wakes from sleep, let him not dip his hand in the vessel until he washes it three times, for he does not know where his hand has spent the night."</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وأما الماء الجاري إذا وقعت فيه نجاسة جاز الوضوء منه إذا لم ير لها أثر لا تستقر مع جريان الماء والغدير العظيم الذي لا يتحرك أحد طرفيه بتحريك الطرف الآخر</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> As for flowing water, if impurity falls into it, wuḍū' from it is permissible if no trace of the impurity is seen, since impurity does not settle in flowing water. Similarly, a large body of standing water where movement at one end does not cause movement at the other end [follows the same ruling].</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">إذا وقعت نجاسة في أحد جانبيه جاز الوضوء من الجانب الآخر لأن الظاهر أن النجاسة لا تصل إليه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If impurity falls into one side of it, wuḍū' from the other side is permissible, because apparently the impurity does not reach it.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وموت ما ليس له نفس سائلة في الماء لا ينجسه كالبق والذباب والزنابير والعقارب وموت ما يعيش في الماء فيه لا يفسده كالسمك والضفدع والسرطان</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The death of a creature that has no flowing blood in water does not make it impure, such as mosquitoes, flies, wasps, and scorpions. And the death of aquatic creatures in water does not spoil it, such as fish, frogs, and crabs.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والماء المستعمل لا يجوز استعماله في طهارة الأحداث</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Used water (al-mā' al-musta'mal) may not be used for purification from ritual impurities.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والمستعمل: كل ماء أزيل به حدث أو استعمل في البدن على وجه القربة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> "Used water" is any water used to remove a ritual impurity (ḥadath), or used on the body as an act of worship.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وكل إهاب دبغ فقد ظهر وجازت الصلاة فيه والوضوء منه إلا جلد الخنزير والآدمي</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Every hide that has been tanned becomes pure, and prayer in it and wuḍū' from [a container made of] it are permissible — except the hide of a pig and a human.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وشعر الميتة وعظمها وعصبها وحافرها وقرنها طاهر</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The hair, bones, sinews, hooves, and horns of a dead animal are pure.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 4: Al-Miyāh wa al-Ṭahārah');
  // ──────────────────────────────────────────────
  // UNIT 5: أحكام الآبار — Rulings on Wells
  // ──────────────────────────────────────────────

  const unit5 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Aḥkām al-Ābār — Rulings on Wells',
      description:
        'Hanafi rulings on purifying wells when impurity or animal carcasses fall into them, and the concept of su\'r (leftover water).',
      orderIndex: 5,
      content: `
<h2>أحكام الآبار — Rulings on Wells</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإذا وقعت في البئر نجاسة نزحت وكان نزح ما فيها من الماء طهارة لها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> When impurity falls into a well, the water is drawn out, and the drawing out of the water is its purification.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">فإن ماتت فيها فأرة أو عصفورة أو صعوة أو سوادنية أو سام أبرص نزح منها ما بين عشرين دلوا إلى ثلاثين دلوا</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If a mouse, sparrow, or similar small creature, or a gecko dies in it, twenty to thirty buckets are drawn out.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">بحسب كبر الحيوان وصغره</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> According to the size of the animal — larger or smaller.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإن ماتت فيها حمامة أو دجاجة أو سنور نزح منها ما بين أربعين دلوا إلى ستين</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If a pigeon, chicken, or cat dies in it, forty to sixty buckets are drawn out.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإن مات فيها كلب أو شاة أو آدمي نزح جميع ما فيها من الماء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If a dog, sheep, or human dies in it, all the water must be drawn out.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإن انتفخ الحيوان فيها أو تفسخ نزح جميع ما فيها من الماء صغر الحيوان أو كبر</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If the animal has bloated or decomposed in the well, all the water must be drawn out regardless of whether the animal is small or large.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وعدد الدلاء يعتبر بالدلو الوسط المستعمل للآبار في البلدان فإن نزح منها بدلو عظيم قدر ما يسع عشرين دلوا من الدلو الوسط احتسب به</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The number of buckets is measured by the medium-sized bucket commonly used for wells in that locality. If a large bucket holding the equivalent of twenty medium buckets is used, it counts accordingly.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإن كانت البئر معينا لا تنزح ما فيها من الماء أخرجوا مقدار ما كان فيها من الماء وقد روي عن محمد بن الحسن رحمه الله عليه أنه قال: ينزح منها مائتا دلو إلى ثلاثمائة دلو</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If the well is spring-fed and cannot be fully emptied, they draw out the equivalent amount of water that was in it. It is narrated from Muhammad ibn al-Hasan (may Allah have mercy on him) that he said: Two hundred to three hundred buckets should be drawn from it.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإذا وجد في البئر أو غيرها ولا يدرون متى وقعت ولم تنتفخ ولم تتفسخ أعادوا صلاة يوم وليلة إذا كانوا توضئوا منها وغسلوا كل شيء أصابه ماءها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If an [animal carcass] is found in a well or elsewhere and they do not know when it fell in, and it has not bloated or decomposed, they must repeat the prayers of one day and night if they had performed wuḍū' from it, and wash everything the water touched.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإن كانت انتفخت أو تفسخت أعادوا صلاة ثلاثة أيام ولياليها في قول أبي حنيفة رحمه الله وقال أبو يوسف ومحمد رحمهما الله: ليس عليهم إعادة شيء حتى يتحققوا متى وقعت</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If it had bloated or decomposed, they repeat the prayers of three days and nights according to Abu Hanifah (may Allah have mercy on him). Abu Yusuf and Muhammad (may Allah have mercy on them) said: They do not have to repeat anything until they know for certain when it fell in.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وسؤر الآدمي وما يؤكل لحمه طاهر وسؤر الكلب والخنزير وسباع البهائم نجس وسؤر الهرة والدجاجة المخلاة وسباع الطير وما يسكن في البيوت مثل الحية والفأرة مكروه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The leftover water (su'r) of humans and animals whose meat is eaten is pure. The leftover of dogs, pigs, and predatory beasts is impure (najis). The leftover of cats, free-roaming chickens, birds of prey, and household creatures like snakes and mice is disliked (makrūh).</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وسؤر الحمار والبغل مشكوك فيهما فإن لم يجد غيرهما توضأ بهما وتيمم بأيهما بدأ جاز</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The leftover water of the donkey and the mule is doubtful. If no other water is available, one should perform wuḍū' with it and also perform tayammum — whichever is done first is valid.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 5: Aḥkām al-Ābār');
  // ──────────────────────────────────────────────
  // UNIT 6: باب التيمم — Tayammum
  // ──────────────────────────────────────────────

  const unit6 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Bāb al-Tayammum — Dry Ablution',
      description:
        'The rulings of tayammum (dry ablution): when it is permitted, how it is performed, what invalidates it, and the differences of opinion among Hanafi scholars.',
      orderIndex: 6,
      content: `
<h2>باب التيمم — Dry Ablution (Tayammum)</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ومن لم يجد الماء وهو مسافر أو خارج المصر بينه وبين المصر نحو الميل أو أكثر</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Whoever cannot find water while traveling, or is outside the city at approximately a mile or more from it,</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">أو كان يجد الماء إلا أنه مريض فخاف إن استعمل الماء اشتد مرضه أو خاف الجنب إن غسل بالماء أن يقتله البرد أو يمرضه فإنه يتيمم بالصعيد</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> or finds water but is ill and fears that using it will worsen his illness, or a person in major impurity (junub) fears that bathing with water will kill him due to cold or make him sick — then he performs tayammum with clean earth (ṣa'īd).</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والتيمم ضربتان: يمسح بإحداهما وجهه وبالأخرى يديه إلى المرفقين والتيمم من الجنابة والحدث سواء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Tayammum consists of two strikes: with one he wipes his face, and with the other he wipes his hands up to the elbows. Tayammum for major impurity (janābah) and minor impurity (ḥadath) is the same.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويجوز التيمم عند أبي حنيفة ومحمد بكل ما كان من جنس الأرض كالتراب والرمل والحجر والجص والنورة والكحل والزرنيخ</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> According to Abu Hanifah and Muhammad, tayammum is permissible with anything from the genus of earth, such as soil, sand, stone, gypsum, calciumite, antimony (kuḥl), and arsite (zirnīkh).</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وقال أبو يوسف رحمه الله: لا يجوز إلا بالتراب والرمل خاصة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Abu Yusuf (may Allah have mercy on him) said: It is only permissible with soil and sand specifically.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والنية فرض في التيمم مستحبة في الوضوء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Intention (niyyah) is obligatory in tayammum but recommended (mustaḥabb) in wuḍū'.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وينقض التيمم كل شيء ينقض الوضوء وينقضه أيضا رؤية الماء إذا قدر على استعماله ولا يجوز التيمم إلا بصعيد طاهر</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Tayammum is nullified by everything that nullifies wuḍū', and also by seeing water when one is able to use it. Tayammum is only valid with pure earth (ṣa'īd ṭāhir).</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويستحب لمن لا يجد الماء وهو يرجو أن يجده في آخر الوقت أن يؤخر الصلاة إلى آخر الوقت فإن وجد الماء توضأ به وصلى وإلا تيمم</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> It is recommended for one who cannot find water but hopes to find it at the end of the prayer time to delay the prayer until the end of its time. If he finds water, he performs wuḍū' and prays; otherwise, he performs tayammum.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويصلي بتيممه ما شاء من الفرائض والنوافل</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> With his tayammum, he may pray as many obligatory and voluntary prayers as he wishes.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويجوز التيمم للصحيح في المصر إذا حضرت جنازة والولي غيره فخاف إن اشتغل بالطهارة أن تفوته الصلاة فإنه يتيمم ويصلي وكذلك من حضر العيد فخاف إن اشتغل بالطهارة أن تفوته صلاة العيدين فإنه يتيمم ويصلي وإن خاف من شهد الجمعة إن اشتغل بالطهارة أن تفوته صلاة الجمعة لم يتيمم ولكنه يتوضأ فإن أدرك الجمعة صلاها وإلا صلى الظهر أربعا وكذلك إذا ضاق الوقت فخشي إن توضأ قات الوقت لم يتيمم ولكنه يتوضأ ويصلي فائتة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Tayammum is permissible for a healthy person in the city if a funeral prayer is present and he is not the guardian, and he fears that if he occupies himself with wuḍū' he will miss the prayer — he may perform tayammum and pray. Likewise for Eid prayer. However, for Jumu'ah, he should not perform tayammum but should perform wuḍū'; if he catches Jumu'ah he prays it, otherwise he prays Ẓuhr (four rak'ahs). Similarly, if the prayer time is running out, he should not perform tayammum but should perform wuḍū' and pray as a make-up (qaḍā').</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والمسافر إذا نسي الماء في رحله فتيمم وصلى ثم ذكر الماء في الوقت لم يعد الصلاة عند أبي حنيفة ومحمد رحمهما الله</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If a traveler forgets water in his luggage, performs tayammum and prays, then remembers the water within the prayer time — he does not repeat the prayer according to Abu Hanifah and Muhammad (may Allah have mercy on them).</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وقال أبو يوسف: يعيدها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Abu Yusuf said: He must repeat it.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وليس على المتيمم إذا لم يغلب على ظنه أن بقربه ماء أن يطلب الماء فإن غلب على ظنه أن هناك ماء لم يجز له أن يتيمم حتى يطلبه وإن كان مع رفيقه ماء طلبه منه قبل أن يتيمم فإن منعه منه تيمم وصلى</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The person performing tayammum is not required to search for water if he does not think water is nearby. If he strongly suspects water is near, he may not perform tayammum until he searches for it. If his companion has water, he must ask for it before performing tayammum; if the companion refuses, he may perform tayammum and pray.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 6: Bāb al-Tayammum');
  // ──────────────────────────────────────────────
  // UNIT 7: باب المسح على الخفين — Wiping Over Footwear
  // ──────────────────────────────────────────────

  const unit7 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Bāb al-Masḥ \'alā al-Khuffayn — Wiping Over Leather Socks',
      description:
        'Rulings on wiping over leather socks (khuffayn) and other footwear as a concession in wuḍū\'.',
      orderIndex: 7,
      content: `
<h2>باب المسح على الخفين — Wiping Over Leather Socks</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">المسح على الخفين جائز بالسنة من كل حدث موجب للوضوء إذا لبس الخفين على طهارة كاملة ثم أحدث</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Wiping over the leather socks (khuffayn) is permissible by the Sunnah for any impurity that requires wuḍū', provided one wore the socks upon complete purification and then broke his wuḍū'.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">فإن كان مقيما مسح يوما وليلة وإن كان مسافرا مسح ثلاثة أيام ولياليها وابتداؤها عقيب الحدث</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> A resident may wipe for one day and one night, and a traveler may wipe for three days and three nights. The period begins after the first occurrence of ḥadath (breaking of wuḍū').</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والمسح على الخفين على ظاهرهما خطوطا بالأصابع يبدأ من رؤوس أصابع الرجل إلى الساق</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Wiping is done on the top of the socks in lines with the fingers, beginning from the tips of the toes towards the shin.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وفرض ذلك مقدار ثلاث أصابع من أصغر أصابع اليد</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The minimum obligatory area for wiping is the extent of three of the smallest fingers of the hand.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ولا يجوز المسح على خف فيه خرق كبير يبين منه مقدار ثلاث أصابع من أصابع الرجل وإن كان أقل من ذلك جاز</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Wiping is not valid on a sock with a large tear that exposes the area of three toes of the foot. If the tear is smaller than that, it is permissible.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ولا يجوز المسح على الخفين لمن وجب عليه الغسل</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Wiping over the socks is not valid for one upon whom ghusl is obligatory.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ونقض المسح ما ينقض الوضوء وينقضه أيضا نزع الخف ومضي المدة فإذا مضت المدة نزع خفيه وغسل رجليه وصلى وليس عيه إعادة بقيه الوضوء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> What nullifies wuḍū' also nullifies the wiping. Additionally, removing the socks and the expiry of the time period also nullify it. When the period expires, one removes the socks, washes the feet, and prays — without needing to repeat the rest of wuḍū'.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ومن ابتدأ المسح وهو مقيم فسافر قبل تمام يوم وليلة مسح ثلاثة أيام ولياليها ومن ابتدأ المسح وهو مسافر ثم أقام فإن كان مسح يوما وليلة أو أكثر لزمه نزع خفيه وغسل رجليه وإن كان مسح أقل من يوم وليلة تمم مسح يوم وليلة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If one begins wiping as a resident then travels before completing one day and night, he completes three days and nights. If one begins wiping as a traveler then becomes resident: if he has already wiped for one day and night or more, he must remove his socks and wash his feet; if less, he completes the resident period of one day and night.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ومن لبس الجرموق فوق الخف مسح عليه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If one wears an outer boot (jurmūq) over the leather sock, he wipes over the outer boot.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ولا يجوز المسح على الجوربين عند أبي حنيفة رحمه الله إلا أن يكونا منعلين أو مجلدين وقال أبو يوسف ومحمد رحمهما الله: يجوز المسح على الجوربين إذا كانا ثخينين لا يشفان الماء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> According to Abu Hanifah (may Allah have mercy on him), wiping over cloth socks (jawrabayn) is not permissible unless they have soles attached or are leather-lined. Abu Yusuf and Muhammad (may Allah have mercy on them) said: Wiping over cloth socks is permissible if they are thick and do not let water seep through.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ولا يجوز المسح على العمامة والقلنسوة والبرقع والقفازين</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Wiping is not permissible on the turban, cap, face-veil, or gloves.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويجوز المسح على الجبائر وإن شدها على غير وضوء فإن سقطت عن غير برء لم يبطل المسح وإن سقطت عن برء بطل المسح</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Wiping over splints (jabā'ir) is permissible even if they were applied without wuḍū'. If the splint falls off without healing, the wiping remains valid. If it falls off due to healing, the wiping is invalidated.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 7: Bāb al-Masḥ \'alā al-Khuffayn');
  // ──────────────────────────────────────────────
  // UNIT 8: باب الحيض — Menstruation & Post-Natal Bleeding
  // ──────────────────────────────────────────────

  const unit8 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Bāb al-Ḥayḍ — Menstruation and Post-Natal Bleeding',
      description:
        'Rulings on menstruation (ḥayḍ), irregular bleeding (istiḥāḍah), and post-natal bleeding (nifās) according to the Hanafi school.',
      orderIndex: 8,
      content: `
<h2>باب الحيض — Menstruation and Post-Natal Bleeding</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">أقل الحيض ثلاثة أيام ولياليها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The minimum duration of menstruation (ḥayḍ) is three days and three nights.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وما نقض عن ذلك فليس بحيض وهو استحاضة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Anything less than that is not menstruation — it is irregular bleeding (istiḥāḍah).</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وأكثر الحيض عشرة أيام ولياليها وما زاد على ذلك فهو استحاضة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The maximum duration of menstruation is ten days and ten nights. Anything beyond that is irregular bleeding (istiḥāḍah).</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وما تراه المرأة من الحمرة والصفرة والكدرة في أيام الحيض فهو حيض حتى ترى البياض الخالص</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Whatever a woman sees of redness, yellowness, or brownish discharge during the days of menstruation is considered menstruation, until she sees pure white discharge.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والحيض يسقط عن الحائض الصلاة ويحرم عليها الصوم وتقضي الصوم ولا تضي الصلاة ولا تدخل المسجد ولا تطوف بالبيت ولا يأتيها زوجها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Menstruation exempts the menstruating woman from prayer and prohibits her from fasting. She must make up the fasts but does not make up the prayers. She may not enter the mosque, perform ṭawāf around the Ka'bah, or have intercourse with her husband.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ولا يجوز لحائض ولا جنب قراءة القرآن</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> It is not permissible for a menstruating woman or one in a state of major impurity (junub) to recite the Qur'an.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ولا يجوز لمحدث مس المصحف إلا أن يأخذه بغلافه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> It is not permissible for one without wuḍū' to touch the muṣḥaf (physical copy of the Qur'an) unless he holds it with its cover.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإذا انقطع دم الحيض لأقل من عشرة أيام لم يجز وطؤها حتى تغتسل أو يمضي عليها وقت صلاة كامل فإن انقطع دمها لعشرة أيام جاز وطؤها قبل الغسل</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If menstrual bleeding stops before ten days, intercourse is not permitted until she performs ghusl or a full prayer time passes. If it stops at exactly ten days, intercourse is permitted before ghusl.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والطهر إذا تخلل بين الدمين في مدة الحيض فهو كالدم الجاري</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If a period of purity (ṭuhr) occurs between two bleedings within the menstrual period, it is treated as continuous bleeding.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وأقل الطهر خمسة عشر يوما ولا غاية لأكثره</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The minimum duration of purity between two menstrual periods is fifteen days, and there is no maximum limit.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ودم الإستحاضة هو ما تراه المرأة أقل من ثلاثة أيام أو أكثر من عشرة أيام فحكمه حكم الرعاف الدائم: لا يمنع الصوم ولا الصلاة ولا الوطء</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Irregular bleeding (istiḥāḍah) is what a woman sees for less than three days or more than ten days. Its ruling is like a chronic nosebleed: it does not prevent fasting, prayer, or intercourse.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإذا زاد الدم على عشرة أيام وللمرأة عادة معروفة ردت إلى أيام عادتها وما زاد على ذلك فهو استحاضة وإن ابتدأت مع البلوغ مستحاضة فيحضها عشرة أيام من كل شهر والباقي استحاضة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If bleeding exceeds ten days and the woman has a known habit, she reverts to her habitual days and the excess is istiḥāḍah. If she first experiences istiḥāḍah at the onset of puberty, her menstruation is set at ten days of each month and the rest is istiḥāḍah.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والمستحاضة ومن به سلس البول والرعاف الدائم والجرح الذي لا يزقلأ يتوضئون لوقت كل صلاة فيصلون بذلك الوضوء في الوقت ما شاءوا من الفرائض والنوافل فإذا خرج الوقت بطل وضوءهم وكان عليهم استئناف الوضوء لصلاة أخرى</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> The woman with istiḥāḍah, one with urinary incontinence, chronic nosebleed, or a wound that does not stop — they perform wuḍū' for the time of each prayer and may pray with that wuḍū' as many obligatory and voluntary prayers as they wish within that time. When the time exits, their wuḍū' is invalidated and they must renew it for the next prayer.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والنفاس: هو الدم الخارج عقيب الولادة والدم الذي تراه الحامل وما تره المرأة في حال ولادتها قبل خروج الولد استحاضة</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Post-natal bleeding (nifās) is the blood that exits following childbirth. Blood seen by a pregnant woman and blood seen during labor before the child emerges is istiḥāḍah.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وأقل النفاس لا حد له وأكثره أربعون يوما وما زاد على ذلك فهو استحاضة وإذا تجاوز الدم الأربعين وقد كانت هذه المرأة ولدت قبل ذلك ولها عادة في النفاس ردت إلى أيام عادتها وإن لم لها عادة فابتدأ نفاسها أربعون يوما ومن ولدت ولدين في بطن واحد</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> There is no minimum for nifās, and its maximum is forty days; anything beyond that is istiḥāḍah. If bleeding exceeds forty days and the woman has a previous birth with an established nifās habit, she reverts to her habitual days. If she has no established habit, her nifās is set at forty days. If she delivers twins,</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">فنفاسها ما خرج من الدم عقيب الولد الأول عند أبي حنيفة وأبي يوسف وقال محمد وزفر: نفاسها ما خرج من الدم عقيب الولد الثاني</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> her nifās begins from the blood following the first child according to Abu Hanifah and Abu Yusuf. Muhammad and Zufar said: Her nifās is the blood following the second child.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 8: Bāb al-Ḥayḍ');
  // ──────────────────────────────────────────────
  // UNIT 9: باب الأنجاس — Impurities & Their Purification
  // ──────────────────────────────────────────────

  const unit9 = await prisma.unit.create({
    data: {
      courseId: course.id,
      title: 'Bāb al-Anjās — Impurities and Their Purification',
      description:
        'Types of impurities (najāsah), their classifications (heavy vs. light), methods of purification, and the rulings of istinjā\' (cleansing after relieving oneself).',
      orderIndex: 9,
      content: `
<h2>باب الأنجاس — Impurities and Their Purification</h2>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">تطهير النجاسة واجب من بدن المصلي وثوبه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Purifying impurity is obligatory from the body of the one praying and from his garment.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والمكان الذي يصلي عليه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> And from the place upon which he prays.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ويجوز تطهير النجاسة بالماء وبكل مائع طاهر يمكن إزالتها به كالخل وماء الورد</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Impurity may be purified with water and with any pure liquid that can remove it, such as vinegar and rose water.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإذا أصابت الخف نجاسة ولها جرم فجفت فدلكه بالأرض جاز</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If impurity with a solid substance strikes the leather sock and dries, rubbing it on the ground is sufficient.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والمني نجس يجب غسل رطبه فإذا جف على الثوب أجزأ فيه الفرك</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Semen is impure (najis) — its wet form must be washed. If it dries on a garment, scraping it off is sufficient.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والنجاسة إذا أصابت المرآة أو السيف اكتفي بمسحهما</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If impurity strikes a mirror or a sword, wiping them is sufficient.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وإذا أصابت الأرض نجاسة فجفت بالشمس وذهب أثرها جازت الصلاة بمكانها ولا يجوز التيمم منها</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If impurity falls on the ground and dries by the sun and its trace disappears, prayer is permissible at that spot, but tayammum from that earth is not permissible.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">ومن أصابه من النجاسة المغلظة كالدم والبول والغائط والخمر مقدار الدرهم فما دونه جازت الصلاة معه فإن زاد لم تجز وإن أصابته نجاسة مخففة كبول ما يؤكل لحمه</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> If heavy impurity (najāsah mughallażah) — such as blood, urine, feces, or wine — strikes a person in an amount equal to or less than a dirham, prayer with it is permissible; if more, prayer is not permissible. If light impurity (najāsah mukhaffafah) — such as the urine of animals whose meat is eaten — strikes him,</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">جازت الصلاة معه ما لم يبلغ ربع الثوب</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> prayer with it is permissible as long as it does not reach one-quarter of the garment.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">وتطهير النجاسة التي يجب غسلها على وجهين: فما كان له منها مرئية زوال عينها إلا أن يبقى من أثرها ما يشق إزالته وما ليس له عني مرئية فطهارتها أن يغسل حتى يغلب على ظن الغاسل أنه قد طهر</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Purifying impurity that must be washed is done in two ways: for visible impurity, its substance must be removed — unless a trace remains that is difficult to remove. For non-visible impurity, it is purified by washing until the washer predominantly believes it is clean.</div>
</div>

<div class="bilingual-text">
  <div class="arabic-original" dir="rtl" lang="ar">والاستنجاء سنة يجزي فيها الحجر وما يقوم مقامه يمسحه حتى ينقه وليس فيه عدد مسنون وغسله بالماء أفضل فإن تجاوزت النجاسة مخرجها لم يجز فيه إلا الماء ولا يستنجي بعظم ولا بروث ولا بطعام ولا بيمينه إلا بعذر</div>
  <div class="english-translation"><em>[AI-Generated Translation]</em> Istinjā' (cleaning after relieving oneself) is sunnah. Stones or their equivalent may be used, wiping until clean — there is no prescribed number of wipes. Washing with water is superior. If the impurity spreads beyond its exit point, only water suffices. One should not perform istinjā' with bones, dung, food, or with the right hand except out of necessity.</div>
</div>
      `.trim(),
    },
  });

  console.log('✅ Created Unit 9: Bāb al-Anjās');
  // ══════════════════════════════════════════════
  // QUIZ QUESTIONS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('📝 Creating quiz questions...');

  // --- Unit 0: Fard al-Taharah Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit0.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many obligatory (farḍ) acts are there in wuḍū\' according to the Hanafi school?',
        options: JSON.stringify(['Three', 'Four', 'Five', 'Six']),
        correctAnswer: 'Four',
        explanation: 'The four farā\'iḍ of wuḍū\' in the Hanafi school are: washing the face, washing both arms including elbows, wiping one-quarter of the head, and washing both feet including ankles.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit0.id,
        type: 'TRUE_FALSE',
        questionText: 'According to the Hanafi school, it is obligatory to wipe the entire head during wuḍū\'.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'The obligatory amount for wiping the head in the Hanafi school is only one-quarter (the extent of the nāṣiyah/forelock), not the entire head. Wiping the entire head is sunnah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit0.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Are the elbows included in the obligatory washing of the arms?',
        options: JSON.stringify(['No, only up to the elbows', 'Yes, the elbows are included', 'Only the right elbow', 'It is sunnah to include them']),
        correctAnswer: 'Yes, the elbows are included',
        explanation: 'Al-Quduri states: "The elbows and ankles are included in the washing" (al-mirfaqān wa al-ka\'bān yadkhulān fī al-ghusl).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit0.id,
        type: 'FILL_BLANK',
        questionText: 'The minimum obligatory amount for wiping the head in wuḍū\' is the extent of the _____ (nāṣiyah).',
        options: null,
        correctAnswer: 'forelock',
        explanation: 'The Hanafi school sets the minimum area for head-wiping at the forelock (nāṣiyah), based on the hadith of al-Mughīrah ibn Shu\'bah.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit0.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which Qur\'anic verse establishes the obligations of wuḍū\'?',
        options: JSON.stringify(['Al-Baqarah 2:222', 'Al-Ma\'idah 5:6', 'An-Nisa\' 4:43', 'Al-Anfal 8:11']),
        correctAnswer: 'Al-Ma\'idah 5:6',
        explanation: 'The verse of wuḍū\' is in Sūrah al-Mā\'idah (5:6): "O you who believe, when you stand for prayer, wash your faces..."',
        difficulty: 'HARD',
      },
      {
        unitId: unit0.id,
        type: 'TRUE_FALSE',
        questionText: 'The ankles must be included when washing the feet in wuḍū\'.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Al-Quduri explicitly states that both the elbows and ankles are included in the washing (yadkhulān fī al-ghusl).',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Unit 1: Sunan al-Taharah Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is a sunnah — not a farḍ — of wuḍū\' in the Hanafi school?',
        options: JSON.stringify(['Washing the face', 'Rinsing the mouth (maḍmaḍah)', 'Washing the arms', 'Wiping part of the head']),
        correctAnswer: 'Rinsing the mouth (maḍmaḍah)',
        explanation: 'In the Hanafi school, rinsing the mouth (maḍmaḍah) and sniffing water into the nose (istinshāq) are sunnah acts of wuḍū\', not farḍ. They become farḍ only in ghusl.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit1.id,
        type: 'TRUE_FALSE',
        questionText: 'Making intention (niyyah) is farḍ in wuḍū\' according to the Hanafi school.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Al-Quduri states that niyyah is mustaḥabb (recommended) in wuḍū\', not farḍ. However, it is farḍ in tayammum.',
        difficulty: 'HARD',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many times should each limb be washed according to the sunnah method of wuḍū\'?',
        options: JSON.stringify(['Once', 'Twice', 'Three times', 'Four times']),
        correctAnswer: 'Three times',
        explanation: 'Repeating the washing three times (takrār al-ghusl ilā al-thalāth) is listed among the sunan of wuḍū\'.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit1.id,
        type: 'FILL_BLANK',
        questionText: 'The sunnah of passing wet fingers through the beard and between the toes during wuḍū\' is called _____.',
        options: null,
        correctAnswer: 'takhlīl',
        explanation: 'Takhlīl (تخليل) refers to running the fingers through the beard and between the fingers and toes during wuḍū\'. It is listed among the sunan.',
        difficulty: 'HARD',
      },
      {
        unitId: unit1.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What does al-Quduri say about maintaining the sequence (tartīb) in wuḍū\'?',
        options: JSON.stringify(['It is farḍ', 'It is mustaḥabb (recommended)', 'It is wājib', 'It is makrūh']),
        correctAnswer: 'It is mustaḥabb (recommended)',
        explanation: 'In the Hanafi school, tartīb (sequence) is mustaḥabb, not farḍ. This differs from the Shafi\'i school where it is considered obligatory.',
        difficulty: 'HARD',
      },
      {
        unitId: unit1.id,
        type: 'TRUE_FALSE',
        questionText: 'Using the siwāk (miswāk) before wuḍū\' is a sunnah act.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'The siwāk is explicitly listed among the sunan of wuḍū\' by al-Quduri.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Unit 2: Nawaqid al-Wudu Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which type of sleep nullifies wuḍū\' according to the Hanafi school?',
        options: JSON.stringify(['Any sleep at all', 'Only deep sleep lasting over an hour', 'Sleep while lying down, reclining, or leaning such that if support were removed one would fall', 'Only sleep after midnight']),
        correctAnswer: 'Sleep while lying down, reclining, or leaning such that if support were removed one would fall',
        explanation: 'Al-Quduri specifies: sleeping while lying down (muḍṭaji\'an), reclining (muttaki\'an), or leaning on something such that if it were removed, one would fall.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'TRUE_FALSE',
        questionText: 'Laughing out loud (qahqahah) during any prayer nullifies wuḍū\' in the Hanafi school.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Qahqahah only nullifies wuḍū\' in a prayer that contains rukū\' and sujūd. It does not apply to funeral prayer (janāzah) or sajdah tilāwah.',
        difficulty: 'HARD',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Vomiting nullifies wuḍū\' only when it is:',
        options: JSON.stringify(['Any amount', 'A mouthful (mil\' al-fam)', 'More than three mouthfuls', 'Only if blood is present']),
        correctAnswer: 'A mouthful (mil\' al-fam)',
        explanation: 'Al-Quduri states that vomiting nullifies wuḍū\' when it fills the mouth (idhā kāna mil\' al-fam).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit2.id,
        type: 'FILL_BLANK',
        questionText: 'Blood or pus exiting the body nullifies wuḍū\' only if it _____ beyond the point where purification applies.',
        options: null,
        correctAnswer: 'flows',
        explanation: 'The condition is that the blood, pus, or serum must flow (tajāwaza) beyond the wound to the area where purification (cleaning) applies. A small amount that does not flow does not break wuḍū\'.',
        difficulty: 'HARD',
      },
      {
        unitId: unit2.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of these does NOT nullify wuḍū\' according to the Hanafi school?',
        options: JSON.stringify(['Fainting', 'Touching a non-maḥram', 'Passing wind', 'Insanity']),
        correctAnswer: 'Touching a non-maḥram',
        explanation: 'In the Hanafi school, touching a person of the opposite gender does not nullify wuḍū\'. This is a point of difference with the Shafi\'i school.',
        difficulty: 'HARD',
      },
      {
        unitId: unit2.id,
        type: 'TRUE_FALSE',
        questionText: 'Sleeping while sitting upright without leaning on anything nullifies wuḍū\' in the Hanafi school.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Sleeping in a firm seated position does not nullify wuḍū\' in the Hanafi school. It is only nullified when one is lying, reclining, or leaning such that one would fall if the support were removed.',
        difficulty: 'MEDIUM',
      },
    ],
  });
  // --- Unit 3: Fard al-Ghusl Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many farā\'iḍ (obligatory acts) does ghusl have in the Hanafi school?',
        options: JSON.stringify(['One', 'Two', 'Three', 'Five']),
        correctAnswer: 'Three',
        explanation: 'The three farā\'iḍ of ghusl are: rinsing the mouth (maḍmaḍah), sniffing water into the nose (istinshāq), and washing the entire body.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'TRUE_FALSE',
        questionText: 'Rinsing the mouth (maḍmaḍah) is farḍ in ghusl but sunnah in wuḍū\' according to the Hanafi school.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'This is a key distinction in Hanafi fiqh: maḍmaḍah and istinshāq are sunnah in wuḍū\' but farḍ in ghusl.',
        difficulty: 'HARD',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following does NOT require ghusl?',
        options: JSON.stringify(['Emission of semen with pleasure', 'Sexual intercourse without emission', 'Emission of pre-seminal fluid (madhī)', 'Menstruation']),
        correctAnswer: 'Emission of pre-seminal fluid (madhī)',
        explanation: 'Al-Quduri states: "Pre-seminal fluid (madhī) and prostatic fluid (wadī) do not necessitate ghusl — only wuḍū\' is required for them."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'FILL_BLANK',
        questionText: 'A woman is not required to undo her _____ during ghusl if water reaches the roots of her hair.',
        options: null,
        correctAnswer: 'braids',
        explanation: 'Al-Quduri states: "A woman is not required to undo her braids (ḍafā\'ir) during ghusl if the water reaches the roots of her hair."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Ghusl for Friday prayer (Jumu\'ah) is:',
        options: JSON.stringify(['Farḍ (obligatory)', 'Wājib (necessary)', 'Sunnah', 'Makrūh (disliked)']),
        correctAnswer: 'Sunnah',
        explanation: 'Al-Quduri states that the Prophet ﷺ "established the sunnah of ghusl for Friday, the two Eids, and entering the state of iḥrām."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit3.id,
        type: 'TRUE_FALSE',
        questionText: 'Sexual intercourse without emission still requires ghusl.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Al-Quduri lists "the meeting of the two circumcised parts without emission" (iltiqā\' al-khitānayn min ghayr inzāl) as a cause requiring ghusl.',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Unit 4: Al-Miyah Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following types of water is NOT valid for wuḍū\'?',
        options: JSON.stringify(['Rainwater', 'Sea water', 'Well water', 'Rose water']),
        correctAnswer: 'Rose water',
        explanation: 'Al-Quduri lists rose water (mā\' al-ward) among liquids that cannot be used for purification, as they have been removed from the nature of water.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'TRUE_FALSE',
        questionText: 'Water mixed with saffron that changes its color can still be used for wuḍū\'.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Al-Quduri states that water mixed with a pure substance that changes one of its properties (like saffron or soap) is still valid for purification.',
        difficulty: 'HARD',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the ruling on "used water" (mā\' musta\'mal) in the Hanafi school?',
        options: JSON.stringify(['It is impure (najis)', 'It is pure but cannot be used for ritual purification', 'It can be reused for wuḍū\'', 'It is makrūh to use']),
        correctAnswer: 'It is pure but cannot be used for ritual purification',
        explanation: 'Used water is pure (ṭāhir) but not purifying (muṭahhir). It cannot be used for removing ḥadath (ritual impurity).',
        difficulty: 'HARD',
      },
      {
        unitId: unit4.id,
        type: 'FILL_BLANK',
        questionText: 'The death of creatures without flowing blood — such as flies, mosquitoes, and scorpions — in water does not make it _____.',
        options: null,
        correctAnswer: 'impure',
        explanation: 'Al-Quduri states: "The death of a creature that has no flowing blood (nafs sā\'ilah) in water does not make it impure (lā yunajjisuhu)."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Every tanned hide becomes pure except the hide of:',
        options: JSON.stringify(['A cow', 'A pig and a human', 'A sheep', 'A camel']),
        correctAnswer: 'A pig and a human',
        explanation: 'Al-Quduri states: "Every hide that has been tanned becomes pure... except the hide of a pig (khinzīr) and a human (ādamī)."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'TRUE_FALSE',
        questionText: 'If a large body of water has impurity fall in one side, wuḍū\' from the other side is valid if moving one end does not affect the other.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Al-Quduri specifies that in a large body of standing water where one end does not move by disturbing the other, wuḍū\' from the clean side is permissible.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit4.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The bones, hair, hooves, and horns of a dead animal are:',
        options: JSON.stringify(['Impure (najis)', 'Pure (ṭāhir)', 'Doubtful (mashkūk)', 'Makrūh to use']),
        correctAnswer: 'Pure (ṭāhir)',
        explanation: 'Al-Quduri explicitly states: "The hair, bones, sinews, hooves, and horns of a dead animal are pure (ṭāhir)."',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Unit 5: Ahkam al-Abar Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'If a mouse dies in a well without bloating, how many buckets must be drawn out?',
        options: JSON.stringify(['5 to 10', '20 to 30', '40 to 60', 'All the water']),
        correctAnswer: '20 to 30',
        explanation: 'For small creatures like mice, sparrows, or geckos, al-Quduri prescribes drawing 20 to 30 buckets, depending on the animal\'s size.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'If a dog or sheep dies in a well, the required action is:',
        options: JSON.stringify(['Draw 20–30 buckets', 'Draw 40–60 buckets', 'Draw all the water', 'The well is permanently impure']),
        correctAnswer: 'Draw all the water',
        explanation: 'For large animals like dogs, sheep, or humans, all the water in the well must be drawn out.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'TRUE_FALSE',
        questionText: 'If a small animal bloats or decomposes in the well, only 20-30 buckets need to be drawn.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'If any animal — small or large — bloats or decomposes in the well, ALL the water must be drawn out.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit5.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The leftover water (su\'r) of the donkey and mule is classified as:',
        options: JSON.stringify(['Pure (ṭāhir)', 'Impure (najis)', 'Doubtful (mashkūk)', 'Disliked (makrūh)']),
        correctAnswer: 'Doubtful (mashkūk)',
        explanation: 'Al-Quduri states the su\'r of the donkey and mule is "mashkūk fīhimā" (doubtful). If no other water is available, one performs both wuḍū\' with it and tayammum.',
        difficulty: 'HARD',
      },
      {
        unitId: unit5.id,
        type: 'FILL_BLANK',
        questionText: 'The leftover water (su\'r) of cats and free-roaming chickens is classified as _____ in the Hanafi school.',
        options: null,
        correctAnswer: 'makrūh',
        explanation: 'Al-Quduri classifies the su\'r of cats, free-roaming chickens, birds of prey, and household creatures (snakes, mice) as makrūh (disliked).',
        difficulty: 'HARD',
      },
      {
        unitId: unit5.id,
        type: 'TRUE_FALSE',
        questionText: 'According to Abu Yusuf and Muhammad, if a dead animal is found in a well but the time of its falling is unknown, no prayers need to be repeated.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Abu Yusuf and Muhammad held that no repetition is required until they know for certain when the impurity fell in. Abu Hanifah, however, requires repeating prayers of 1 or 3 days.',
        difficulty: 'HARD',
      },
    ],
  });
  // --- Unit 6: Tayammum Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'How many strikes on the earth does tayammum consist of?',
        options: JSON.stringify(['One', 'Two', 'Three', 'Four']),
        correctAnswer: 'Two',
        explanation: 'Al-Quduri states: "Tayammum consists of two strikes (ḍarbatān): with one he wipes his face, and with the other he wipes his hands up to the elbows."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'TRUE_FALSE',
        questionText: 'Intention (niyyah) is farḍ in tayammum according to the Hanafi school.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Al-Quduri states: "Intention is farḍ in tayammum, mustaḥabb in wuḍū\'." This is a key distinction.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Abu Yusuf, tayammum is permissible with:',
        options: JSON.stringify(['Any substance from the genus of earth', 'Soil and sand only', 'Only pure soil', 'Anything clean']),
        correctAnswer: 'Soil and sand only',
        explanation: 'Abu Yusuf restricted tayammum to soil (turāb) and sand (raml) specifically, while Abu Hanifah and Muhammad allowed any substance from the genus of earth.',
        difficulty: 'HARD',
      },
      {
        unitId: unit6.id,
        type: 'FILL_BLANK',
        questionText: 'Tayammum is nullified by everything that nullifies wuḍū\' and also by the _____ of water when one is able to use it.',
        options: null,
        correctAnswer: 'sight',
        explanation: 'Al-Quduri adds that seeing water (ru\'yat al-mā\') while being able to use it is an additional nullifier of tayammum beyond the standard nullifiers of wuḍū\'.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'A healthy person in the city may perform tayammum for which prayer if he fears missing it?',
        options: JSON.stringify(['Jumu\'ah prayer', 'Janāzah (funeral) prayer', 'Fajr prayer', '\'Ishā\' prayer']),
        correctAnswer: 'Janāzah (funeral) prayer',
        explanation: 'Al-Quduri permits tayammum in the city for janāzah prayer (if one is not the walī) and Eid prayer if one fears missing them. However, it is NOT permitted for Jumu\'ah — one must perform wuḍū\' even if Jumu\'ah is missed.',
        difficulty: 'HARD',
      },
      {
        unitId: unit6.id,
        type: 'TRUE_FALSE',
        questionText: 'If a traveler forgets he has water and performs tayammum, he must repeat the prayer according to Abu Hanifah.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'According to Abu Hanifah and Muhammad, the prayer does not need to be repeated. Abu Yusuf disagreed and said it must be repeated.',
        difficulty: 'HARD',
      },
      {
        unitId: unit6.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'With a single tayammum, how many prayers may be performed?',
        options: JSON.stringify(['Only one farḍ prayer', 'One farḍ and one nafl', 'As many farḍ and nafl prayers as desired', 'Only nafl prayers']),
        correctAnswer: 'As many farḍ and nafl prayers as desired',
        explanation: 'Al-Quduri states: "With his tayammum, he may pray as many obligatory and voluntary prayers as he wishes."',
        difficulty: 'MEDIUM',
      },
    ],
  });

  // --- Unit 7: Masḥ ʿalā al-Khuffayn Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'For how long may a traveler wipe over his leather socks?',
        options: JSON.stringify(['One day and night', 'Two days and nights', 'Three days and nights', 'Indefinitely']),
        correctAnswer: 'Three days and nights',
        explanation: 'A resident wipes for one day and night; a traveler wipes for three days and nights. The period begins after the first ḥadath.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'TRUE_FALSE',
        questionText: 'Wiping over leather socks is valid even for one upon whom ghusl is obligatory.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Al-Quduri explicitly states: "Wiping over the socks is not valid for one upon whom ghusl is obligatory."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The minimum area that must be wiped on each sock is:',
        options: JSON.stringify(['The entire top of the sock', 'The area of three smallest fingers of the hand', 'The sole of the sock', 'Half the sock']),
        correctAnswer: 'The area of three smallest fingers of the hand',
        explanation: 'Al-Quduri states: "The obligatory amount is the extent of three of the smallest fingers of the hand."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'FILL_BLANK',
        questionText: 'When the wiping period expires, one must remove the socks and wash only the _____ before praying.',
        options: null,
        correctAnswer: 'feet',
        explanation: 'When the period expires, one removes the socks and washes the feet only — there is no need to repeat the entire wuḍū\'.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'According to Abu Hanifah, wiping over cloth socks (jawrabayn) is permissible only if:',
        options: JSON.stringify(['They are thick', 'They have soles or are leather-lined', 'They are any type of sock', 'They reach above the ankle']),
        correctAnswer: 'They have soles or are leather-lined',
        explanation: 'Abu Hanifah requires cloth socks to be soled (mun\'alayn) or leather-lined (mujallādayn). Abu Yusuf and Muhammad allow thick socks that do not let water seep through.',
        difficulty: 'HARD',
      },
      {
        unitId: unit7.id,
        type: 'TRUE_FALSE',
        questionText: 'Wiping over a turban or cap is permissible in the Hanafi school.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'Al-Quduri states: "Wiping is not permissible on the turban, cap, face-veil, or gloves."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit7.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'If a splint (jabīrah) falls off after healing, what happens to the masḥ?',
        options: JSON.stringify(['It remains valid', 'It is invalidated', 'Only wuḍū\' must be renewed', 'A new splint must be applied']),
        correctAnswer: 'It is invalidated',
        explanation: 'If the splint falls off due to healing, the wiping is invalidated. If it falls off without healing, the wiping remains valid.',
        difficulty: 'HARD',
      },
    ],
  });

  // --- Unit 8: Bab al-Hayd Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'What is the minimum duration of menstruation (ḥayḍ) in the Hanafi school?',
        options: JSON.stringify(['One day', 'Two days', 'Three days and nights', 'Five days']),
        correctAnswer: 'Three days and nights',
        explanation: 'Al-Quduri states: "The minimum of menstruation is three days and their nights."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The maximum duration of menstruation according to the Hanafi school is:',
        options: JSON.stringify(['Seven days', 'Ten days and nights', 'Fifteen days', 'Forty days']),
        correctAnswer: 'Ten days and nights',
        explanation: 'Al-Quduri states: "The maximum of menstruation is ten days and their nights. Anything beyond that is istiḥāḍah."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit8.id,
        type: 'TRUE_FALSE',
        questionText: 'A menstruating woman must make up both the prayers and fasts she missed.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'False',
        explanation: 'She must make up the fasts but does NOT make up the prayers. This is explicitly stated by al-Quduri.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit8.id,
        type: 'FILL_BLANK',
        questionText: 'The minimum period of purity (ṭuhr) between two menstrual cycles is _____ days.',
        options: null,
        correctAnswer: 'fifteen',
        explanation: 'Al-Quduri states: "The minimum of purity is fifteen days, and there is no maximum limit."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'The maximum duration of post-natal bleeding (nifās) is:',
        options: JSON.stringify(['Ten days', 'Twenty days', 'Thirty days', 'Forty days']),
        correctAnswer: 'Forty days',
        explanation: 'Al-Quduri states: "The maximum of nifās is forty days. Anything beyond that is istiḥāḍah."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit8.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'A woman with istiḥāḍah (irregular bleeding) must renew her wuḍū\':',
        options: JSON.stringify(['Before every rak\'ah', 'For the time of each prayer', 'Once a day', 'She does not need wuḍū\'']),
        correctAnswer: 'For the time of each prayer',
        explanation: 'The mustaḥāḍah and similar individuals perform wuḍū\' for the time of each prayer and may pray multiple prayers within that time. When the time exits, the wuḍū\' is invalidated.',
        difficulty: 'HARD',
      },
      {
        unitId: unit8.id,
        type: 'TRUE_FALSE',
        questionText: 'According to Abu Hanifah, in the case of twins, nifās begins from the blood following the first child.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Abu Hanifah and Abu Yusuf hold that nifās begins from the blood after the first child. Muhammad and Zufar hold it begins after the second child.',
        difficulty: 'HARD',
      },
    ],
  });

  // --- Unit 9: Bab al-Anjas Questions ---
  await prisma.question.createMany({
    data: [
      {
        unitId: unit9.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Heavy impurity (najāsah mughallażah) is excused in prayer up to the amount of:',
        options: JSON.stringify(['A fingertip', 'A dirham', 'A palm', 'One-quarter of the garment']),
        correctAnswer: 'A dirham',
        explanation: 'Al-Quduri states that heavy impurity (like blood, urine, feces, wine) equal to or less than the size of a dirham is excused in prayer.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit9.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Light impurity (najāsah mukhaffafah) is excused in prayer as long as it does not reach:',
        options: JSON.stringify(['The size of a dirham', 'One-eighth of the garment', 'One-quarter of the garment', 'Half the garment']),
        correctAnswer: 'One-quarter of the garment',
        explanation: 'Light impurity — such as the urine of permissible-to-eat animals — is excused as long as it does not reach one-quarter of the garment.',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit9.id,
        type: 'TRUE_FALSE',
        questionText: 'In the Hanafi school, impurity can be purified with vinegar or rose water, not only plain water.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Al-Quduri states: "Impurity may be purified with water and with any pure liquid that can remove it, such as vinegar and rose water."',
        difficulty: 'HARD',
      },
      {
        unitId: unit9.id,
        type: 'FILL_BLANK',
        questionText: 'If dried semen is found on a garment, it is sufficient to _____ it off rather than wash it.',
        options: null,
        correctAnswer: 'scrape',
        explanation: 'Al-Quduri states: "Semen is impure — its wet form must be washed. If it dries on a garment, scraping (fark) it off is sufficient."',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit9.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'If impurity falls on the ground and dries by the sun with no trace remaining:',
        options: JSON.stringify(['Prayer is valid there but tayammum from it is not', 'Both prayer and tayammum are valid', 'Neither prayer nor tayammum is valid', 'Only tayammum is valid']),
        correctAnswer: 'Prayer is valid there but tayammum from it is not',
        explanation: 'Al-Quduri states that if impurity on the ground dries by the sun and its trace disappears, prayer at that spot is valid but tayammum from that earth is not.',
        difficulty: 'HARD',
      },
      {
        unitId: unit9.id,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Istinjā\' (cleansing after relieving oneself) should NOT be performed with:',
        options: JSON.stringify(['Water', 'Stones', 'Bones and dung', 'Tissue']),
        correctAnswer: 'Bones and dung',
        explanation: 'Al-Quduri states one should not perform istinjā\' with bones, dung, food, or the right hand (except out of necessity).',
        difficulty: 'MEDIUM',
      },
      {
        unitId: unit9.id,
        type: 'TRUE_FALSE',
        questionText: 'If impurity on a leather sock has a solid substance and dries, rubbing the sock on the ground is sufficient for purification.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'Al-Quduri states: "If impurity with a solid substance (jurm) strikes the leather sock and dries, rubbing it on the ground is sufficient."',
        difficulty: 'MEDIUM',
      },
    ],
  });

  console.log('✅ Created quiz questions for all 10 units');
  // ══════════════════════════════════════════════
  // FLASHCARDS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🃏 Creating flashcards...');

  // --- Unit 0: Fard al-Taharah Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Farḍ (فرض)',
        back: 'An obligatory act in Islamic law. Leaving it out invalidates the act of worship.',
        frontArabic: 'فَرْض',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['fiqh', 'farḍ', 'obligation'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Nāṣiyah (ناصية)',
        back: 'The forelock — the front part of the head. The minimum area for wiping the head in Hanafi wuḍū\'.',
        frontArabic: 'نَاصِيَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'head-wiping', 'nāṣiyah'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Masḥ (مسح)',
        back: 'Wiping — passing wet hands over a body part. In wuḍū\', it applies to the head.',
        frontArabic: 'مَسْح',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'masḥ', 'wiping'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Ghusl (غسل)',
        back: 'Washing — pouring water over a body part so it flows. The farḍ of wuḍū\' requires ghusl of the face, arms, and feet.',
        frontArabic: 'غَسْل',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'ghusl', 'washing'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Mirfaq (مرفق)',
        back: 'The elbow — included in the obligatory washing of the arms in wuḍū\'.',
        frontArabic: 'مِرْفَق',
        backArabic: 'المِرْفَقَان',
        category: 'fiqh-term',
        tags: ['wuḍū', 'elbow', 'anatomy'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Ka\'b (كعب)',
        back: 'The ankle bone — included in the obligatory washing of the feet in wuḍū\'.',
        frontArabic: 'كَعْب',
        backArabic: 'الكَعْبَان',
        category: 'fiqh-term',
        tags: ['wuḍū', 'ankle', 'anatomy'],
        difficulty: 'MEDIUM' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit0.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 1: Sunan al-Taharah Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Sunnah (سنة)',
        back: 'A recommended act in worship. Doing it earns reward; leaving it does not invalidate the worship.',
        frontArabic: 'سُنَّة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['fiqh', 'sunnah', 'recommended'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Maḍmaḍah (مضمضة)',
        back: 'Rinsing the mouth — sunnah in wuḍū\', farḍ in ghusl (Hanafi).',
        frontArabic: 'مَضْمَضَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'maḍmaḍah', 'mouth-rinsing'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Istinshāq (استنشاق)',
        back: 'Sniffing water into the nose — sunnah in wuḍū\', farḍ in ghusl (Hanafi).',
        frontArabic: 'اِسْتِنْشَاق',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'istinshāq', 'nose'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Takhlīl (تخليل)',
        back: 'Passing wet fingers through the beard and between the fingers and toes during wuḍū\'.',
        frontArabic: 'تَخْلِيل',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'takhlīl', 'fingers'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Tartīb (ترتيب)',
        back: 'Maintaining the proper sequence of washing limbs. Mustaḥabb in Hanafi wuḍū\', not farḍ.',
        frontArabic: 'تَرْتِيب',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'tartīb', 'sequence'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Siwāk (سواك)',
        back: 'The tooth-stick (miswāk) — a sunnah act before or during wuḍū\'.',
        frontArabic: 'سِوَاك',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'siwāk', 'miswāk'],
        difficulty: 'EASY' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit1.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 2: Nawaqid al-Wudu Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Nāqiḍ (ناقض)',
        back: 'A nullifier — something that breaks/invalidates wuḍū\'. Plural: nawāqiḍ.',
        frontArabic: 'نَاقِض',
        backArabic: 'نَوَاقِض',
        category: 'fiqh-term',
        tags: ['wuḍū', 'nāqiḍ', 'nullifier'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Qahqahah (قهقهة)',
        back: 'Laughing out loud — uniquely nullifies wuḍū\' in the Hanafi school, but only in prayer with rukū\' and sujūd.',
        frontArabic: 'قَهْقَهَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'qahqahah', 'laughing'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Sabīlayn (سبيلين)',
        back: 'The two passages — front and back private parts. Anything exiting from them nullifies wuḍū\'.',
        frontArabic: 'سَبِيلَيْن',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'sabīlayn', 'passages'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Ighmā\' (إغماء)',
        back: 'Fainting / loss of consciousness — one of the nullifiers of wuḍū\'.',
        frontArabic: 'إِغْمَاء',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'ighmā\'', 'fainting'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Mil\' al-Fam (ملء الفم)',
        back: '"A mouthful" — the threshold at which vomiting nullifies wuḍū\' in Hanafi fiqh.',
        frontArabic: 'مِلْء الفَم',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wuḍū', 'vomiting', 'threshold'],
        difficulty: 'HARD' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit2.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 3: Fard al-Ghusl Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Ghusl (غسل) — Ritual Bath',
        back: 'Full-body ritual washing required after major impurity (janābah), menstruation, and nifās.',
        frontArabic: 'غُسْل',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['ghusl', 'ritual-bath', 'major-impurity'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Janābah (جنابة)',
        back: 'The state of major ritual impurity requiring ghusl — caused by sexual intercourse or emission of semen.',
        frontArabic: 'جَنَابَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['ghusl', 'janābah', 'major-impurity'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Manī (مني)',
        back: 'Semen — its emission with gushing and pleasure necessitates ghusl.',
        frontArabic: 'مَنِيّ',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['ghusl', 'manī', 'semen'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Madhī (مذي)',
        back: 'Pre-seminal fluid — does NOT require ghusl, only wuḍū\'.',
        frontArabic: 'مَذْي',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['ghusl', 'madhī', 'pre-seminal'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Wadī (ودي)',
        back: 'Prostatic fluid — does NOT require ghusl, only wuḍū\'.',
        frontArabic: 'وَدِي',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['ghusl', 'wadī', 'prostatic'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Iltiqā\' al-Khitānayn (التقاء الختانين)',
        back: 'The meeting of the two circumcised parts (intercourse) — requires ghusl even without emission.',
        frontArabic: 'اِلْتِقَاء الخِتَانَيْن',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['ghusl', 'intercourse', 'obligation'],
        difficulty: 'HARD' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit3.id, courseId: course.id, orderIndex: i })),
  });
  // --- Unit 4: Al-Miyah Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Mā\' Muṭlaq (ماء مطلق)',
        back: 'Pure and purifying water in its natural state — rainwater, well water, spring water, sea water.',
        frontArabic: 'مَاء مُطْلَق',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['water', 'mā\' muṭlaq', 'purifying'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Mā\' Musta\'mal (ماء مستعمل)',
        back: 'Used water — pure but no longer purifying. Cannot be reused for wuḍū\' or ghusl.',
        frontArabic: 'مَاء مُسْتَعْمَل',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['water', 'mā\' musta\'mal', 'used-water'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Nafs Sā\'ilah (نفس سائلة)',
        back: 'Flowing blood — creatures without it (flies, scorpions) do not make water impure when they die in it.',
        frontArabic: 'نَفْس سَائِلَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['water', 'nafs-sā\'ilah', 'bloodless-creatures'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Ihāb (إهاب)',
        back: 'An animal hide — becomes pure after tanning (dibāghah), except pig and human hides.',
        frontArabic: 'إِهَاب',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['purity', 'ihāb', 'tanning'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Dibāghah (دباغة)',
        back: 'Tanning — the process that purifies animal hides according to Hanafi fiqh.',
        frontArabic: 'دِبَاغَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['purity', 'dibāghah', 'tanning'],
        difficulty: 'MEDIUM' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit4.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 5: Ahkam al-Abar Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Bi\'r (بئر)',
        back: 'A well — the Hanafi school has detailed rulings on purifying wells contaminated by dead animals.',
        frontArabic: 'بِئْر',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wells', 'bi\'r', 'water-source'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Dalw (دلو)',
        back: 'A bucket — the unit of measurement for drawing water from contaminated wells.',
        frontArabic: 'دَلْو',
        backArabic: 'دِلَاء',
        category: 'fiqh-term',
        tags: ['wells', 'dalw', 'bucket'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Su\'r (سؤر)',
        back: 'Leftover water from which an animal or person has drunk. Its purity depends on the creature.',
        frontArabic: 'سُؤْر',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['water', 'su\'r', 'leftover'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Mashkūk (مشكوك)',
        back: 'Doubtful — the ruling on leftover water of donkeys and mules. If no other water is available, combine wuḍū\' with tayammum.',
        frontArabic: 'مَشْكُوك',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['water', 'mashkūk', 'doubtful'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Nazḥ (نزح)',
        back: 'Drawing water out of a well — the method of purifying a contaminated well in Hanafi fiqh.',
        frontArabic: 'نَزْح',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['wells', 'nazḥ', 'purification'],
        difficulty: 'MEDIUM' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit5.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 6: Tayammum Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Tayammum (تيمم)',
        back: 'Dry ablution using clean earth — a substitute for wuḍū\' or ghusl when water is unavailable or harmful.',
        frontArabic: 'تَيَمُّم',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['tayammum', 'dry-ablution'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Ṣa\'īd (صعيد)',
        back: 'Clean earth/ground — the material used for tayammum. Abu Hanifah allows anything from the genus of earth.',
        frontArabic: 'صَعِيد',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['tayammum', 'ṣa\'īd', 'earth'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Ḍarbah (ضربة)',
        back: 'A strike — tayammum consists of two strikes on the earth: one for the face and one for the arms to the elbows.',
        frontArabic: 'ضَرْبَة',
        backArabic: 'ضَرْبَتَان',
        category: 'fiqh-term',
        tags: ['tayammum', 'ḍarbah', 'strike'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Niyyah (نية)',
        back: 'Intention — farḍ in tayammum, mustaḥabb in wuḍū\' according to the Hanafi school.',
        frontArabic: 'نِيَّة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['tayammum', 'niyyah', 'intention'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Ru\'yat al-Mā\' (رؤية الماء)',
        back: 'Seeing water — an additional nullifier of tayammum beyond the standard nullifiers of wuḍū\'.',
        frontArabic: 'رُؤْيَة المَاء',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['tayammum', 'nullifier', 'seeing-water'],
        difficulty: 'HARD' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit6.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 7: Masḥ ala al-Khuffayn Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Khuff (خف)',
        back: 'A leather sock — wiping over it is a concession in wuḍū\' established by the Sunnah.',
        frontArabic: 'خُفّ',
        backArabic: 'خُفَّيْن',
        category: 'fiqh-term',
        tags: ['khuff', 'leather-sock', 'masḥ'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Jawrab (جورب)',
        back: 'A cloth sock — Abu Hanifah only permits wiping if it has soles or is leather-lined. Abu Yusuf and Muhammad allow thick ones.',
        frontArabic: 'جَوْرَب',
        backArabic: 'جَوْرَبَيْن',
        category: 'fiqh-term',
        tags: ['jawrab', 'cloth-sock', 'masḥ'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Jurmūq (جرموق)',
        back: 'An outer boot worn over the leather sock — one wipes over the outer boot if worn.',
        frontArabic: 'جُرْمُوق',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['jurmūq', 'outer-boot', 'masḥ'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Jabīrah (جبيرة)',
        back: 'A splint or bandage — wiping over it is permissible, even if applied without wuḍū\'.',
        frontArabic: 'جَبِيرَة',
        backArabic: 'جَبَائِر',
        category: 'fiqh-term',
        tags: ['jabīrah', 'splint', 'masḥ'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Muddah (مدة)',
        back: 'The time period for wiping — one day/night for residents, three days/nights for travelers.',
        frontArabic: 'مُدَّة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['masḥ', 'muddah', 'time-period'],
        difficulty: 'MEDIUM' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit7.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 8: Bab al-Hayd Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Ḥayḍ (حيض)',
        back: 'Menstruation — minimum 3 days/nights, maximum 10 days/nights in the Hanafi school.',
        frontArabic: 'حَيْض',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['ḥayḍ', 'menstruation'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Istiḥāḍah (استحاضة)',
        back: 'Irregular/abnormal bleeding — bleeding less than 3 days or more than 10 days. Does not prevent prayer or fasting.',
        frontArabic: 'اِسْتِحَاضَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['istiḥāḍah', 'irregular-bleeding'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Nifās (نفاس)',
        back: 'Post-natal bleeding — blood following childbirth. No minimum; maximum is 40 days.',
        frontArabic: 'نِفَاس',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['nifās', 'post-natal-bleeding'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Ṭuhr (طهر)',
        back: 'Purity between menstrual cycles — minimum 15 days, no maximum.',
        frontArabic: 'طُهْر',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['ṭuhr', 'purity-period'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Mustaḥāḍah (مستحاضة)',
        back: 'A woman with istiḥāḍah — she performs wuḍū\' for the time of each prayer and may pray freely within that time.',
        frontArabic: 'مُسْتَحَاضَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['mustaḥāḍah', 'irregular-bleeding', 'wuḍū\''],
        difficulty: 'HARD' as const,
      },
      {
        front: '\'Ādah (عادة)',
        back: 'Habit/cycle — a woman\'s established menstrual pattern. Used to determine ḥayḍ when bleeding exceeds 10 days.',
        frontArabic: 'عَادَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['\'ādah', 'habit', 'menstrual-cycle'],
        difficulty: 'HARD' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit8.id, courseId: course.id, orderIndex: i })),
  });

  // --- Unit 9: Bab al-Anjas Flashcards ---
  await prisma.flashCard.createMany({
    data: [
      {
        front: 'Najāsah Mughallażah (نجاسة مغلظة)',
        back: 'Heavy impurity — blood, urine, feces, wine. Excused up to the size of a dirham.',
        frontArabic: 'نَجَاسَة مُغَلَّظَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['najāsah', 'mughallażah', 'heavy-impurity'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Najāsah Mukhaffafah (نجاسة مخففة)',
        back: 'Light impurity — e.g., urine of ḥalāl animals. Excused up to one-quarter of the garment.',
        frontArabic: 'نَجَاسَة مُخَفَّفَة',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['najāsah', 'mukhaffafah', 'light-impurity'],
        difficulty: 'MEDIUM' as const,
      },
      {
        front: 'Istinjā\' (استنجاء)',
        back: 'Cleaning oneself after using the toilet — stones or water may be used. Water is superior.',
        frontArabic: 'اِسْتِنْجَاء',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['istinjā\'', 'toilet', 'cleaning'],
        difficulty: 'EASY' as const,
      },
      {
        front: 'Fark (فرك)',
        back: 'Scraping/rubbing — the method for removing dried semen from a garment instead of washing.',
        frontArabic: 'فَرْك',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['fark', 'scraping', 'semen'],
        difficulty: 'HARD' as const,
      },
      {
        front: 'Dirham (درهم)',
        back: 'A coin — used as the measurement threshold for excusable heavy impurity in prayer.',
        frontArabic: 'دِرْهَم',
        backArabic: null,
        category: 'fiqh-term',
        tags: ['dirham', 'measurement', 'impurity-threshold'],
        difficulty: 'MEDIUM' as const,
      },
    ].map((fc, i) => ({ ...fc, unitId: unit9.id, courseId: course.id, orderIndex: i })),
  });

  console.log('✅ Created flashcards for all 10 units');
  // ══════════════════════════════════════════════
  // ARABIC TERMS
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🔤 Creating Arabic terms...');

  await prisma.arabicTerm.createMany({
    data: [
      // Unit 0: Fard al-Taharah terms
      { unitId: unit0.id, arabicText: 'فَرْض', transliteration: 'Farḍ', translation: 'Obligatory act — leaving it invalidates the worship' },
      { unitId: unit0.id, arabicText: 'طَهَارَة', transliteration: 'Ṭahārah', translation: 'Purification / ritual purity' },
      { unitId: unit0.id, arabicText: 'وُضُوء', transliteration: 'Wuḍū\'', translation: 'Ablution — ritual washing before prayer' },
      { unitId: unit0.id, arabicText: 'غَسْل', transliteration: 'Ghusl (washing)', translation: 'Washing a limb so water flows over it' },
      { unitId: unit0.id, arabicText: 'مَسْح', transliteration: 'Masḥ', translation: 'Wiping — passing wet hands over a body part' },
      { unitId: unit0.id, arabicText: 'نَاصِيَة', transliteration: 'Nāṣiyah', translation: 'Forelock — the front area of the head' },
      { unitId: unit0.id, arabicText: 'مِرْفَق', transliteration: 'Mirfaq', translation: 'Elbow' },
      { unitId: unit0.id, arabicText: 'كَعْب', transliteration: 'Ka\'b', translation: 'Ankle bone' },

      // Unit 1: Sunan al-Taharah terms
      { unitId: unit1.id, arabicText: 'سُنَّة', transliteration: 'Sunnah', translation: 'Recommended act in worship' },
      { unitId: unit1.id, arabicText: 'مَضْمَضَة', transliteration: 'Maḍmaḍah', translation: 'Rinsing the mouth' },
      { unitId: unit1.id, arabicText: 'اِسْتِنْشَاق', transliteration: 'Istinshāq', translation: 'Sniffing water into the nose' },
      { unitId: unit1.id, arabicText: 'سِوَاك', transliteration: 'Siwāk', translation: 'Tooth-stick / miswāk' },
      { unitId: unit1.id, arabicText: 'تَخْلِيل', transliteration: 'Takhlīl', translation: 'Running fingers through the beard and between fingers/toes' },
      { unitId: unit1.id, arabicText: 'تَرْتِيب', transliteration: 'Tartīb', translation: 'Maintaining the proper sequence' },
      { unitId: unit1.id, arabicText: 'نِيَّة', transliteration: 'Niyyah', translation: 'Intention' },
      { unitId: unit1.id, arabicText: 'مُسْتَحَبّ', transliteration: 'Mustaḥabb', translation: 'Recommended / preferred' },

      // Unit 2: Nawaqid al-Wudu terms
      { unitId: unit2.id, arabicText: 'نَوَاقِض', transliteration: 'Nawāqiḍ', translation: 'Nullifiers (plural of nāqiḍ)' },
      { unitId: unit2.id, arabicText: 'حَدَث', transliteration: 'Ḥadath', translation: 'Ritual impurity (minor)' },
      { unitId: unit2.id, arabicText: 'قَهْقَهَة', transliteration: 'Qahqahah', translation: 'Laughing out loud' },
      { unitId: unit2.id, arabicText: 'إِغْمَاء', transliteration: 'Ighmā\'', translation: 'Fainting / loss of consciousness' },
      { unitId: unit2.id, arabicText: 'سَبِيلَيْن', transliteration: 'Sabīlayn', translation: 'The two passages (front and back)' },
      { unitId: unit2.id, arabicText: 'قَيْء', transliteration: 'Qay\'', translation: 'Vomiting' },

      // Unit 3: Fard al-Ghusl terms
      { unitId: unit3.id, arabicText: 'غُسْل', transliteration: 'Ghusl', translation: 'Ritual bath — full-body washing' },
      { unitId: unit3.id, arabicText: 'جَنَابَة', transliteration: 'Janābah', translation: 'State of major ritual impurity' },
      { unitId: unit3.id, arabicText: 'مَنِيّ', transliteration: 'Manī', translation: 'Semen' },
      { unitId: unit3.id, arabicText: 'مَذْي', transliteration: 'Madhī', translation: 'Pre-seminal fluid' },
      { unitId: unit3.id, arabicText: 'وَدِي', transliteration: 'Wadī', translation: 'Prostatic fluid' },
      { unitId: unit3.id, arabicText: 'حَيْض', transliteration: 'Ḥayḍ', translation: 'Menstruation' },
      { unitId: unit3.id, arabicText: 'نِفَاس', transliteration: 'Nifās', translation: 'Post-natal bleeding' },
      { unitId: unit3.id, arabicText: 'إِحْرَام', transliteration: 'Iḥrām', translation: 'Sacred state for Hajj/Umrah' },

      // Unit 4: Al-Miyah terms
      { unitId: unit4.id, arabicText: 'مَاء مُطْلَق', transliteration: 'Mā\' Muṭlaq', translation: 'Pure and purifying water in its natural state' },
      { unitId: unit4.id, arabicText: 'مَاء مُسْتَعْمَل', transliteration: 'Mā\' Musta\'mal', translation: 'Used water — pure but not purifying' },
      { unitId: unit4.id, arabicText: 'نَجَاسَة', transliteration: 'Najāsah', translation: 'Impurity' },
      { unitId: unit4.id, arabicText: 'إِهَاب', transliteration: 'Ihāb', translation: 'Animal hide' },
      { unitId: unit4.id, arabicText: 'دِبَاغَة', transliteration: 'Dibāghah', translation: 'Tanning of hides' },
      { unitId: unit4.id, arabicText: 'نَفْس سَائِلَة', transliteration: 'Nafs Sā\'ilah', translation: 'Flowing blood — creatures without it don\'t impurify water' },

      // Unit 5: Ahkam al-Abar terms
      { unitId: unit5.id, arabicText: 'بِئْر', transliteration: 'Bi\'r', translation: 'Well' },
      { unitId: unit5.id, arabicText: 'دَلْو', transliteration: 'Dalw', translation: 'Bucket' },
      { unitId: unit5.id, arabicText: 'نَزْح', transliteration: 'Nazḥ', translation: 'Drawing out water from a well' },
      { unitId: unit5.id, arabicText: 'سُؤْر', transliteration: 'Su\'r', translation: 'Leftover water from drinking' },
      { unitId: unit5.id, arabicText: 'مَكْرُوه', transliteration: 'Makrūh', translation: 'Disliked — the ruling on su\'r of cats, mice, etc.' },
      { unitId: unit5.id, arabicText: 'مَشْكُوك', transliteration: 'Mashkūk', translation: 'Doubtful — the ruling on su\'r of donkeys and mules' },

      // Unit 6: Tayammum terms
      { unitId: unit6.id, arabicText: 'تَيَمُّم', transliteration: 'Tayammum', translation: 'Dry ablution using clean earth' },
      { unitId: unit6.id, arabicText: 'صَعِيد', transliteration: 'Ṣa\'īd', translation: 'Clean earth / ground surface' },
      { unitId: unit6.id, arabicText: 'ضَرْبَة', transliteration: 'Ḍarbah', translation: 'A strike on the earth' },
      { unitId: unit6.id, arabicText: 'تُرَاب', transliteration: 'Turāb', translation: 'Soil / dust' },
      { unitId: unit6.id, arabicText: 'رَمْل', transliteration: 'Raml', translation: 'Sand' },
      { unitId: unit6.id, arabicText: 'جَنَازَة', transliteration: 'Janāzah', translation: 'Funeral / funeral prayer' },

      // Unit 7: Masḥ ala al-Khuffayn terms
      { unitId: unit7.id, arabicText: 'خُفّ', transliteration: 'Khuff', translation: 'Leather sock' },
      { unitId: unit7.id, arabicText: 'جَوْرَب', transliteration: 'Jawrab', translation: 'Cloth sock' },
      { unitId: unit7.id, arabicText: 'جُرْمُوق', transliteration: 'Jurmūq', translation: 'Outer boot worn over leather socks' },
      { unitId: unit7.id, arabicText: 'جَبِيرَة', transliteration: 'Jabīrah', translation: 'Splint / bandage' },
      { unitId: unit7.id, arabicText: 'خَرْق', transliteration: 'Kharq', translation: 'A tear/hole in the sock' },
      { unitId: unit7.id, arabicText: 'مُدَّة', transliteration: 'Muddah', translation: 'Time period (for wiping)' },

      // Unit 8: Bab al-Hayd terms
      { unitId: unit8.id, arabicText: 'حَيْض', transliteration: 'Ḥayḍ', translation: 'Menstruation' },
      { unitId: unit8.id, arabicText: 'اِسْتِحَاضَة', transliteration: 'Istiḥāḍah', translation: 'Irregular/abnormal uterine bleeding' },
      { unitId: unit8.id, arabicText: 'نِفَاس', transliteration: 'Nifās', translation: 'Post-natal bleeding' },
      { unitId: unit8.id, arabicText: 'طُهْر', transliteration: 'Ṭuhr', translation: 'Period of purity between menstrual cycles' },
      { unitId: unit8.id, arabicText: 'عَادَة', transliteration: '\'Ādah', translation: 'Established menstrual habit/cycle' },
      { unitId: unit8.id, arabicText: 'مُسْتَحَاضَة', transliteration: 'Mustaḥāḍah', translation: 'Woman with irregular bleeding' },
      { unitId: unit8.id, arabicText: 'سَلَس البَوْل', transliteration: 'Salas al-Bawl', translation: 'Urinary incontinence' },

      // Unit 9: Bab al-Anjas terms
      { unitId: unit9.id, arabicText: 'نَجَاسَة مُغَلَّظَة', transliteration: 'Najāsah Mughallażah', translation: 'Heavy impurity (blood, urine, feces, wine)' },
      { unitId: unit9.id, arabicText: 'نَجَاسَة مُخَفَّفَة', transliteration: 'Najāsah Mukhaffafah', translation: 'Light impurity (urine of ḥalāl animals)' },
      { unitId: unit9.id, arabicText: 'اِسْتِنْجَاء', transliteration: 'Istinjā\'', translation: 'Cleaning oneself after using the toilet' },
      { unitId: unit9.id, arabicText: 'دِرْهَم', transliteration: 'Dirham', translation: 'Coin — threshold for excusable heavy impurity' },
      { unitId: unit9.id, arabicText: 'فَرْك', transliteration: 'Fark', translation: 'Scraping — method to remove dried semen' },
      { unitId: unit9.id, arabicText: 'مَنِيّ', transliteration: 'Manī', translation: 'Semen — impure (najis) in the Hanafi school' },
    ],
  });

  console.log('✅ Created Arabic terms for all 10 units');

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════

  console.log('');
  console.log('🎉 Mukhtasar al-Quduri: Kitab al-Taharah seed completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   - 1 Course: Mukhtasar al-Quduri: Kitab al-Taharah (Book of Purification)');
  console.log('   - 10 Units covering all sections of Kitab al-Taharah');
  console.log('   - 65 Quiz questions across all units');
  console.log('   - 53 Flashcards with Arabic fiqh terminology');
  console.log('   - 68 Arabic terms with transliteration and translation');
}

// Allow standalone execution
async function main() {
  try {
    await seedQuduriTaharah();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Mukhtasar al-Quduri: Kitab al-Taharah:', error);
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