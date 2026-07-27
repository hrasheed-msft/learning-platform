import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab Coursebook 8 — Islamic Curriculum Seed (Restructured)
 * Source: An Nasihah Publications, Age Range: 13–14 years
 *
 * 15 focused units — each covering exactly ONE main topic.
 */

export async function seedMaktabCoursebook8() {
  console.log('✅ Starting Maktab Coursebook 8 seed...');
  console.log('');

  const demoFamily = await prisma.family.findFirst({
    where: { name: 'Ahmad Family' },
  });
  if (!demoFamily) {
    console.log('⚠️  Demo family not found. Please run main seed first.');
    return;
  }
  console.log('✅ Found demo family:', demoFamily.name);

  // ── COURSE ──
  const course = await prisma.course.upsert({
    where: { slug: 'maktab-coursebook-8' },
    create: {
      slug: 'maktab-coursebook-8',
      title: 'Maktab Coursebook 8',
      description: 'A comprehensive Islamic curriculum for teenagers aged 13–14, covering nawāfil ṣalāh, nikāḥ, ṭalāq, Islamic transactions, ribā, aḥādīth on worship and character, sīrah (shamā\'il, \'Uthmān and \'Alī), Islamic history (Ayyūb, Andalusia, Crusades, Ottomans), aqā\'id (attributes of Allāh, complete īmān), akhlāq (taqwā, tawakkul, tawbah) and ādāb (modesty, debate, transactions). Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['PRE_TEEN', 'TEEN'],
      isPublished: true,
    },
    update: {
      title: 'Maktab Coursebook 8',
      description: 'A comprehensive Islamic curriculum for teenagers aged 13–14, covering nawāfil ṣalāh, nikāḥ, ṭalāq, Islamic transactions, ribā, aḥādīth on worship and character, sīrah (shamā\'il, \'Uthmān and \'Alī), Islamic history (Ayyūb, Andalusia, Crusades, Ottomans), aqā\'id (attributes of Allāh, complete īmān), akhlāq (taqwā, tawakkul, tawbah) and ādāb (modesty, debate, transactions). Based on the An Nasihah Publications coursebook series.',
      category: 'FIQH',
      ageLevels: ['PRE_TEEN', 'TEEN'],
      isPublished: true,
    },
  });
  console.log('✅ Created course:', course.title);

  // ── CLEANUP old 7-unit slugs ──
  const oldSlugs = [
    'maktab-8-fiqh', 'maktab-8-ahadith', 'maktab-8-sirah',
    'maktab-8-tarikh', 'maktab-8-aqaid', 'maktab-8-akhlaq', 'maktab-8-adab',
  ];
  for (const slug of oldSlugs) {
    const old = await prisma.unit.findFirst({ where: { courseId: course.id, slug } });
    if (old) {
      await prisma.question.deleteMany({ where: { unitId: old.id } });
      await prisma.unitProgress.deleteMany({ where: { unitId: old.id } });
      await prisma.unit.delete({ where: { id: old.id } });
    }
  }

  // =============================================
  // UNIT 1: FIQH — Nawāfil Ṣalāh & Khushūʿ
  // =============================================

  const nawailContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Name the key nawāfil (voluntary) prayers and the correct time to perform each.</li>
  <li>Explain the virtue of congregational prayer and the reward for performing it.</li>
  <li>Define khushūʿ and describe practical ways to develop it in ṣalāh.</li>
</ul>

<h3>What are Nawāfil Prayers?</h3>
<p>Beyond the five obligatory prayers, Allāh has gifted us with voluntary prayers (nawāfil) through which we draw closer to Him. Allāh says in a qudsi ḥadīth: <em>"My servant continues to draw near to Me through voluntary acts until I love him."</em> (Bukhārī)</p>

<h3>Tahaṡṡud — The Night Prayer</h3>
<p>Tahaṡṡud is performed in the last third of the night after waking from sleep. Minimum 2 rakʿāt, often extended. It is the most virtuous nawāfil prayer.</p>
<p>Allāh descends to the lowest heaven in the last third of the night and calls: <em>"Who is invoking Me so that I may respond? Who is asking forgiveness so that I may forgive?"</em> (Bukhārī)</p>
<p>The Prophet ﷺ said: <em>"Hold fast to the night prayer, for it is the way of the pious, a means of nearness to Allāh, an expiation of sins, and a shield from evil."</em> (Tirmidhī)</p>

<h3>Ishrāq — The Sunrise Prayer</h3>
<p>Performed approximately 15–20 minutes after sunrise. 2–4 rakʿāt.</p>
<p>The Prophet ﷺ said: <em>"Whoever prays Fajr with congregation, then sits in dhikr until sunrise, then prays two rakʿāt, receives a reward like that of Ḥajj and ʿUmrah — complete, complete, complete!"</em> (Tirmidhī)</p>

<h3>Ḍuḥā — The Forenoon Prayer</h3>
<p>Performed in the mid-morning when the sun has risen to about a quarter of the sky. Minimum 2 rakʿāt, maximum 12.</p>
<p>Allāh says: <em>"O Son of Ādam, perform four rakʿāt for Me in the beginning of your day and I will suffice you for the rest of it."</em> (Abū Dāwūd)</p>

<h3>Awwābīn — After Maghrib</h3>
<p>6 rakʿāt prayed in pairs after Maghrib. The Prophet ﷺ said: <em>"Whoever prays 6 rakʿāt after Maghrib without speaking evil in between, their reward is equivalent to 12 years of worship."</em> (Tirmidhī)</p>

<h3>Tarāwīḥ — The Ramadān Night Prayer</h3>
<p>Performed in congregation during Ramadān nights. 20 rakʿāt in the Ḥanafī school. The Prophet ﷺ said: <em>"Whoever stands (in prayer) in Ramadān with faith and hoping for reward, his past sins will be forgiven."</em> (Bukhārī)</p>

<h3>Virtue of Congregational Prayer</h3>
<p>The Prophet ﷺ said: <em>"Prayer in congregation is 27 times superior to a prayer offered individually."</em> (Bukhārī) This reward applies especially to the five obligatory prayers prayed in the masjid.</p>

<h3>Khushūʿ — Humility and Presence in Prayer</h3>
<p>Khushūʿ means the humility, focus, and presence of heart that should characterise every ṣalāh. Allāh says: <em>"Successful indeed are the believers — those who are humble in their prayers."</em> (Qur\'an 23:1–2)</p>

<h4>How to Develop Khushūʿ</h4>
<ul>
  <li><strong>Know the meanings:</strong> Learn the Arabic of what you recite so every phrase has meaning for you.</li>
  <li><strong>Minimise distractions:</strong> Choose a clean, quiet space; face a sutrah (barrier); switch off notifications.</li>
  <li><strong>Pray as if it is your last:</strong> The Prophet ﷺ said: <em>"Pray as though you are bidding farewell (to this world)."</em></li>
  <li><strong>Engage before entering:</strong> Perform a thorough, mindful wudū\'.</li>
  <li><strong>Pause between postures:</strong> Do not rush — each movement is an opportunity to connect with Allāh.</li>
</ul>
<p>Khushūʿ is the soul of ṣalāh. A prayer without humility is like a body without a soul. We ask Allāh to bless our prayers with true khushūʿ.</p>
`.trim();

  const unit1 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-fiqh-nawafil-khushu' } },
    create: {
      slug: 'maktab-8-fiqh-nawafil-khushu',
      courseId: course.id,
      orderIndex: 1,
      title: 'Fiqh — Nawāfil Ṣalāh & Khushū\'',
      description: 'The key voluntary prayers (tahaṡṡud, ishrāq, ḍuḥā, awwābīn, tarāwīḥ), their times and virtues, the 27× reward of congregational prayer, and how to develop khushū\' (humility and presence) in ṣalāh.',
      content: nawailContent,
    },
    update: {
      title: 'Fiqh — Nawāfil Ṣalāh & Khushū\'',
      description: 'The key voluntary prayers (tahaṡṡud, ishrāq, ḍuḥā, awwābīn, tarāwīḥ), their times and virtues, the 27× reward of congregational prayer, and how to develop khushū\' (humility and presence) in ṣalāh.',
      content: nawailContent,
    },
  });
  console.log('✅ Unit 1:', unit1.title);

  // =============================================
  // UNIT 2: FIQH — Nikāḥ & Ṭalāq
  // =============================================

  const nikahContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>List and explain the conditions that make a nikāḥ (marriage) valid in Islam.</li>
  <li>Define mahr and explain when it becomes obligatory.</li>
  <li>Distinguish between the types of ṭalāq (divorce) and explain \'iddah.</li>
  <li>Understand the concept of rujū\' and when it applies.</li>
</ul>

<h3>Nikāḥ — The Islamic Marriage Contract</h3>
<p>Nikāḥ is a sacred covenant and a highly emphasised sunnah of the Prophet ﷺ. He said: <em>"Marriage is from my sunnah. Whoever turns away from my sunnah is not of me."</em></p>

<h4>Conditions of a Valid Nikāḥ</h4>
<ol>
  <li><strong>Ījāb and Qabūl</strong> — Offer and acceptance in the same sitting.</li>
  <li><strong>Two adult Muslim witnesses</strong> — The nikāḥ must be announced, not secret.</li>
  <li><strong>Walī</strong> — A male guardian (father, brother, etc.) for the bride. The Prophet ﷺ said: <em>"There is no nikāḥ without a walī."</em> (Abū Dāwūd)</li>
  <li><strong>Mahr</strong> — A mandatory gift from the groom to the bride.</li>
</ol>

<h4>Prohibited Marriages (Maḥram Relationships)</h4>
<p>Certain relationships permanently prohibit marriage: mothers, daughters, sisters, aunts, nieces, foster mothers/sisters, mothers-in-law, and stepdaughters. These are detailed in Qūrʼanic verse 4:23.</p>

<h3>Mahr — The Bridal Gift</h3>
<p>Mahr is an obligatory monetary gift or property from the husband to the wife at the time of nikāḥ. Allāh says: <em>"Give women their mahr as a free gift."</em> (4:4)</p>
<ul>
  <li>The wife has complete ownership of her mahr.</li>
  <li>There is no fixed minimum in Islamic law, though a practical minimum is observed.</li>
  <li>Mahr becomes fully owed upon consummation of the marriage or upon the husband\'s death.</li>
</ul>

<h3>Ṭalāq — Divorce</h3>
<p>Allāh has permitted divorce as a last resort. The Prophet ﷺ said: <em>"Of all the permitted acts, divorce is the most hated by Allāh."</em> (Abū Dāwūd)</p>

<h4>Types of Ṭalāq</h4>
<ul>
  <li><strong>Ṭalāq al-Sunnah</strong>: One revocable divorce pronounced during a period of purity, followed by waiting. This is the preferred, valid method.</li>
  <li><strong>Ṭalāq al-Bid\'ah</strong>: Three divorces pronounced at once. This is valid (the separation takes effect) but sinful — a serious warning from scholars.</li>
</ul>

<h3>\'Iddah — The Waiting Period</h3>
<p>\'Iddah is the mandatory waiting period for a woman after divorce or her husband\'s death before she may remarry.</p>
<ul>
  <li>After divorce: 3 menstrual cycles (for women who menstruate).</li>
  <li>After death of husband: 4 months and 10 days.</li>
  <li>Purpose: establish whether the woman is pregnant; provide time for reconciliation.</li>
</ul>

<h3>Rujū\' — Returning to the Marriage</h3>
<p>After a single revocable (ṭalāq al-sunnah) divorce, the husband may return to his wife during \'iddah without a new nikāḥ. This is called rujū\'. After \'iddah ends, a new nikāḥ is required if both parties wish to reconcile.</p>
`.trim();

  const unit2 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-fiqh-nikah-talaq' } },
    create: {
      slug: 'maktab-8-fiqh-nikah-talaq',
      courseId: course.id,
      orderIndex: 2,
      title: 'Fiqh — Nikāḥ & Ṭalāq',
      description: 'Conditions of a valid Islamic marriage (nikāḥ): Ījāb/qabūl, witnesses, walī, and mahr. Prohibited marriages. Types of divorce (ṭalāq al-sunnah and al-bid\'ah), the waiting period (\'iddah), and rujū\' (returning to marriage).',
      content: nikahContent,
    },
    update: {
      title: 'Fiqh — Nikāḥ & Ṭalāq',
      description: 'Conditions of a valid Islamic marriage (nikāḥ): Ījāb/qabūl, witnesses, walī, and mahr. Prohibited marriages. Types of divorce (ṭalāq al-sunnah and al-bid\'ah), the waiting period (\'iddah), and rujū\' (returning to marriage).',
      content: nikahContent,
    },
  });
  console.log('✅ Unit 2:', unit2.title);

  // =============================================
  // UNIT 3: FIQH — Islamic Transactions: Buyū\', Ribā & Gambling
  // =============================================

  const transactionsContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>State the conditions that make a sale (bay\') valid in Islam.</li>
  <li>Define ribā (interest/usury), explain its two types, and understand why it is ḥarām.</li>
  <li>Explain the prohibition of maysir (gambling) and its harms.</li>
  <li>Describe ijārah (hire/lease) and its conditions.</li>
</ul>

<h3>Bay\' — Valid Sale Conditions</h3>
<p>Islam encourages honest trade: <em>"The truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs."</em> (Tirmidhī) For a sale to be valid, four conditions must be met:</p>
<ol>
  <li><strong>Known price:</strong> The buyer and seller must know exactly what amount is being paid.</li>
  <li><strong>Known item:</strong> The item must be clearly identified (type, quantity, quality).</li>
  <li><strong>Owned by seller:</strong> One cannot sell what one does not own.</li>
  <li><strong>Deliverable:</strong> The item must be capable of being handed over to the buyer.</li>
</ol>

<h3>Ribā — Interest and Usury</h3>
<p>Ribā literally means \'increase\'. Islamically, it refers to any unlawful increase in wealth without a legitimate exchange. Allāh declares:</p>
<p class="arabic" dir="rtl" lang="ar">وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا</p>
<p><em>"Allāh has permitted trade and forbidden ribā."</em> (Qur\'an 2:275)</p>

<h4>Two Types of Ribā</h4>
<ul>
  <li><strong>Ribā al-Faḍl:</strong> Exchanging the same commodity in unequal amounts (e.g., 100g of gold for 110g of gold).</li>
  <li><strong>Ribā al-Nasī\'ah:</strong> Interest charged for deferred payment — the most common form today (bank interest, credit card charges, conventional mortgages).</li>
</ul>

<h4>Why Ribā is Ḥarām</h4>
<ul>
  <li>It exploits those in financial need.</li>
  <li>It creates wealth without real work or trade.</li>
  <li>It destabilises economies and widens inequality.</li>
  <li>Allāh declares war on those who deal in ribā (Qur\'an 2:279).</li>
</ul>

<h3>Maysir — Gambling</h3>
<p>Maysir (gambling) is prohibited. Allāh says: <em>"O you who believe! Intoxicants, gambling, [sacrificing on] stone altars... are abominations from the work of Shayṭān, so avoid them."</em> (5:90)</p>
<p>Gambling destroys wealth, breeds addiction, causes family breakdown, and creates enmity. Any game or activity where money changes hands based on chance falls under this prohibition.</p>

<h3>Ijārah — Hire and Lease</h3>
<p>Ijārah is the rental or hiring of a person or service for a specified period at an agreed price. It is lawful when:</p>
<ul>
  <li>The service or benefit is clearly defined.</li>
  <li>The duration is known.</li>
  <li>The wage/rent is agreed in advance.</li>
</ul>
<p>The Prophet ﷺ said: <em>"Pay the worker his wage before his sweat dries."</em> (Ibn Mājah)</p>

<h3>Modern Applications</h3>
<p>Muslims navigating modern finance should: avoid interest-based mortgages and credit cards where possible; use Islamic finance products (murābaḥah, ijārah-based mortgages); consult qualified scholars about specific situations. The rule is: when in doubt, seek Islamic guidance rather than assume permissibility.</p>
`.trim();

  const unit3 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-fiqh-transactions' } },
    create: {
      slug: 'maktab-8-fiqh-transactions',
      courseId: course.id,
      orderIndex: 3,
      title: 'Fiqh — Islamic Transactions: Buyū\', Ribā & Gambling',
      description: 'Conditions of a valid sale, the prohibition of ribā (interest/usury) and its two types (al-faḍl and al-nasī\'ah), why ribā is ḥarām, prohibition of maysir (gambling), and the rules of ijārah (hire/lease).',
      content: transactionsContent,
    },
    update: {
      title: 'Fiqh — Islamic Transactions: Buyū\', Ribā & Gambling',
      description: 'Conditions of a valid sale, the prohibition of ribā (interest/usury) and its two types (al-faḍl and al-nasī\'ah), why ribā is ḥarām, prohibition of maysir (gambling), and the rules of ijārah (hire/lease).',
      content: transactionsContent,
    },
  });
  console.log('✅ Unit 3:', unit3.title);

  // =============================================
  // UNIT 4: AḤĀDĪTH — Worship & Closeness to Allāh
  // =============================================

  const hadithWorshipContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Understand and reflect on the ḥadīth about the sweetness of īmān.</li>
  <li>Explain what \'true wealth\' means according to the Prophet ﷺ.</li>
  <li>Appreciate the unlimited reward of patience according to the Qur\'an.</li>
  <li>Know when Allāh descends to the lowest heaven and what this means for worship.</li>
</ul>

<h3>Ḥadīth 1: The Sweetness of Īmān</h3>
<p class="arabic" dir="rtl" lang="ar">ثَلَاثٌ مَنْ كُنَّ فِيهِ وَجَدَ حَلَاوَةَ الْإِيمَانِ</p>
<p><em>"Three things, whoever possesses them will find the sweetness of faith: that Allāh and His Messenger are more beloved to him than anything else; that he loves another person only for the sake of Allāh; and that he hates to return to disbelief as he hates to be thrown into fire."</em> (Bukhārī &amp; Muslim)</p>
<p>This ḥadīth identifies three conditions for tasting true īmān:</p>
<ol>
  <li>Loving Allāh and His Messenger more than anyone and anything.</li>
  <li>Loving others sincerely for Allāh\'s sake — not for worldly gain.</li>
  <li>Despising returning to disbelief — treating sin as deeply repulsive.</li>
</ol>

<h3>Ḥadīth 2: True Wealth</h3>
<p class="arabic" dir="rtl" lang="ar">لَيْسَ الغِنَى عَنْ كَثْرَةِ العَرَضِ، وَلَكِنَّ الغِنَى غِنَى النَّفْسِ</p>
<p><em>"True wealth is not having many possessions. Rather, true wealth is the contentment of the soul."</em> (Bukhārī)</p>
<p>True richness is internal. A person with millions but no contentment is spiritually poor. A person of modest means with a satisfied heart is truly wealthy. This teaches us to focus on gratitude (shukr) and reliance on Allāh (tawakkul) rather than endless acquisition.</p>

<h3>Ḥadīth 3: The Reward of Patience</h3>
<p class="arabic" dir="rtl" lang="ar">إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُمْ بِغَيْرِ حِسَابٍ</p>
<p><em>"Truly, those who are patient will be given their reward without limit."</em> (Qur\'an 39:10)</p>
<p>Every other act of worship has a specific multiplier of reward. Patience alone has no ceiling — Allāh will reward the patient person without measure. Whether the trial is illness, loss, poverty, or difficulty in obeying Allāh — all patience counts.</p>

<h3>Ḥadīth 4: Allāh Descends to the Lowest Heaven</h3>
<p><em>"Our Lord, the Blessed, the Exalted, descends every night to the lowest heaven when one-third of the night remains, and says: Who is invoking Me, that I may respond? Who is asking of Me, that I may give? Who is seeking My forgiveness, that I may forgive?"</em> (Bukhārī &amp; Muslim)</p>
<p>This ḥadīth teaches us to seize the last third of the night for du\'a\', tawbah, and worship. Allāh is actively inviting us to call upon Him. Waking up even 20 minutes before Fajr to pray and make du\'a\' is one of the most powerful habits a Muslim can develop.</p>
`.trim();

  const unit4 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-ahadith-worship' } },
    create: {
      slug: 'maktab-8-ahadith-worship',
      courseId: course.id,
      orderIndex: 4,
      title: 'Aḥādīth — Worship & Closeness to Allāh',
      description: 'Four key aḥādīth: three conditions for sweetness of īmān; true wealth is contentment of the soul; the unlimited reward of patience; Allāh\'s descent in the last third of the night.',
      content: hadithWorshipContent,
    },
    update: {
      title: 'Aḥādīth — Worship & Closeness to Allāh',
      description: 'Four key aḥādīth: three conditions for sweetness of īmān; true wealth is contentment of the soul; the unlimited reward of patience; Allāh\'s descent in the last third of the night.',
      content: hadithWorshipContent,
    },
  });
  console.log('✅ Unit 4:', unit4.title);

  // =============================================
  // UNIT 5: AḤĀDĪTH — Character, Ṣadaqah & Rights of Muslims
  // =============================================

  const hadithCharContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Understand that Allāh judges people by hearts and deeds, not appearances.</li>
  <li>Explain how ṣadaqah extinguishes sins like water extinguishes fire.</li>
  <li>List the six rights a Muslim has over another.</li>
  <li>Apply the ḥadīth on self-sufficiency to real life.</li>
</ul>

<h3>Ḥadīth 1: Allāh Looks at Hearts and Deeds</h3>
<p class="arabic" dir="rtl" lang="ar">إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنَّ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ</p>
<p><em>"Allāh does not look at your appearances or your wealth, but He looks at your hearts and your deeds."</em> (Muslim)</p>
<p>Physical beauty, social status, and worldly wealth carry no weight with Allāh. What matters is sincerity in the heart and righteousness in action. This should free us from caring what others think of our outward appearance and instead focus on internal character.</p>

<h3>Ḥadīth 2: Ṣadaqah Extinguishes Sins</h3>
<p><em>"Ṣadaqah extinguishes sin just as water extinguishes fire."</em> (Tirmidhī)</p>
<p>Giving in charity is one of the most powerful tools for spiritual purification. This does not mean one can deliberately sin expecting charity to \'cancel\' it out. Rather, the sincere believer who gives charity alongside seeking forgiveness finds their sins wiped away by Allāh\'s mercy.</p>

<h3>Ḥadīth 3: Spreading Salām Widely</h3>
<p><em>"You will not enter Paradise until you believe, and you will not believe until you love one another. Shall I not tell you of something that, if you do it, you will love one another? Spread salām among yourselves."</em> (Muslim)</p>
<p>The simple act of saying <em>\"Al-Salāmu \'alaykum\"</em> creates love, breaks barriers, and earns reward. The Prophet ﷺ greeted everyone — young, old, known, unknown.</p>

<h3>Ḥadīth 4: Six Rights of a Muslim over Another</h3>
<p><em>"The rights of a Muslim over another Muslim are six..."</em></p>
<ol>
  <li>When you meet him, give salām.</li>
  <li>When he invites you, accept the invitation.</li>
  <li>When he seeks your advice (naṣīḥah), give it sincerely.</li>
  <li>When he sneezes and says alḥamdulillāh, say yarḥamukallāh.</li>
  <li>When he is sick, visit him.</li>
  <li>When he dies, follow his janāzah.</li>
</ol>
<p>These six rights build a community of care and brotherhood. Every Muslim should strive to fulfil them.</p>

<h3>Ḥadīth 5: The Value of Self-Sufficiency</h3>
<p><em>"That one of you should take his rope, go to the mountain, cut wood and carry it, and thereby save his dignity, is better than that he should ask people who may give or refuse him."</em> (Bukhārī)</p>
<p>Working with one\'s own hands — even a humble job — is more dignified than begging. Islam values self-reliance and hard work as acts of worship and means of protecting one\'s honour.</p>
`.trim();

  const unit5 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-ahadith-character' } },
    create: {
      slug: 'maktab-8-ahadith-character',
      courseId: course.id,
      orderIndex: 5,
      title: 'Aḥādīth — Character, Ṣadaqah & Rights of Muslims',
      description: 'Five aḥādīth: Allāh looks at hearts and deeds; ṣadaqah extinguishes sins like water; spreading salām; the six rights of a Muslim over another; the value of self-sufficiency over begging.',
      content: hadithCharContent,
    },
    update: {
      title: 'Aḥādīth — Character, Ṣadaqah & Rights of Muslims',
      description: 'Five aḥādīth: Allāh looks at hearts and deeds; ṣadaqah extinguishes sins like water; spreading salām; the six rights of a Muslim over another; the value of self-sufficiency over begging.',
      content: hadithCharContent,
    },
  });
  console.log('✅ Unit 5:', unit5.title);

  // =============================================
  // UNIT 6: SĪRAH — Shamāʼil of Rasūlullāh ﷺ
  // =============================================

  const shamailContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Review the physical description (shamā\'il) of the Prophet ﷺ.</li>
  <li>Know key miracles of the Prophet ﷺ and their lessons.</li>
  <li>Appreciate how the Prophet ﷺ transformed the world in 23 years.</li>
  <li>Identify one specific sunnah to implement personally.</li>
</ul>

<h3>What are Shamā\'il?</h3>
<p>Shamā\'il means the noble characteristics — both physical and moral — of the Prophet Muḥammad ﷺ. The Companions described him in detail so that every generation could know and love him. Imām Tirmidhī compiled the famous collection <em>Al-Shamā\'il al-Muḥammadiyyah</em>.</p>

<h3>Physical Description</h3>
<p>The Prophet ﷺ was of medium height, with a broad chest, a face that shone like the full moon, black hair, and large dark eyes. His walk was purposeful — as if descending a slope. His smile lit up the room. Those who saw him said they had never seen anyone more beautiful before or after him.</p>
<p>\'Alī ibn Abī Ṭālib said: <em>"He was neither very tall nor very short. He was of medium build. His hair was neither curly nor completely straight. He was the most generous in giving, the most truthful in speech, the most gentle in nature."</em></p>

<h3>Selected Miracles of the Prophet ﷺ</h3>
<h4>The Splitting of the Moon</h4>
<p>Allāh says: <em>"The Hour has drawn near and the moon has split."</em> (54:1) The Quraysh demanded a sign; Allāh caused the moon to visibly split into two halves and then rejoin. This miracle is confirmed in the Qur\'an itself.</p>

<h4>Water Flowing from His Fingers</h4>
<p>At Ḥudaybiyah, 1,400 companions had water only in a small vessel. The Prophet ﷺ placed his hand in it — water flowed from between his fingers like springs until everyone drank and filled their vessels. (Bukhārī)</p>

<h4>Feeding Multitudes from Little</h4>
<p>Jābir ibn \'Abdullāh reported that at a feast, 1,000 companions ate from a small amount of food prepared for 10 — and it was not exhausted. (Bukhārī)</p>

<h4>The Night Journey (Isrā\' and Mi\'rāj)</h4>
<p>In one night, the Prophet ﷺ was taken from Makkah to Masjid al-Aqṣā and then ascended through the seven heavens to a station no other creation has reached. He returned before dawn. This miracle confirmed his unique status.</p>

<h3>23 Years That Changed the World</h3>
<p>In 23 years, the Prophet ﷺ transformed a scattered, idol-worshipping people into a nation that would carry the light of tawḥīd across three continents within a century of his passing. He:</p>
<ul>
  <li>Abolished idol worship and established the worship of Allāh alone.</li>
  <li>Ended female infanticide and elevated the status of women.</li>
  <li>Established justice, contracts, and human rights 14 centuries before modern frameworks.</li>
  <li>United warring Arab tribes into a cohesive ummah.</li>
  <li>Left a Sunnah so comprehensive it covers every aspect of life.</li>
</ul>

<h3>Implementing the Sunnah</h3>
<p>The Prophet ﷺ said: <em>"Whoever loves my sunnah loves me, and whoever loves me will be with me in Paradise."</em> Choose one specific sunnah to implement consistently — even a small one done regularly. Examples: eating with the right hand, saying bismilllāh before meals, greeting with the full salām, smiling when meeting others.</p>
`.trim();

  const unit6 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-sirah-shamail' } },
    create: {
      slug: 'maktab-8-sirah-shamail',
      courseId: course.id,
      orderIndex: 6,
      title: 'Sīrah — Shamā\'il of Rasūlullāh ﷺ',
      description: 'Comprehensive study of the shamā\'il (noble characteristics) of the Prophet ﷺ: physical description, key miracles (moon-splitting, water from fingers, feeding multitudes), how he changed the world in 23 years, and implementing one sunnah.',
      content: shamailContent,
    },
    update: {
      title: 'Sīrah — Shamā\'il of Rasūlullāh ﷺ',
      description: 'Comprehensive study of the shamā\'il (noble characteristics) of the Prophet ﷺ: physical description, key miracles (moon-splitting, water from fingers, feeding multitudes), how he changed the world in 23 years, and implementing one sunnah.',
      content: shamailContent,
    },
  });
  console.log('✅ Unit 6:', unit6.title);

  // =============================================
  // UNIT 7: SĪRAH — \'Uthmān Ibn \'Affān رضي الله عنه
  // =============================================

  const uthmanContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Explain why \'Uthmān was called \'Dhū al-Nūrayn\'.</li>
  <li>Describe his remarkable generosity, especially in the expedition of Tabūk.</li>
  <li>Understand his greatest legacy: standardising the Qur\'an.</li>
  <li>Know the circumstances of his martyrdom.</li>
</ul>

<h3>Early Life and Title</h3>
<p>\'Uthmān ibn \'Affān رضي الله عنه was born into a wealthy noble family of Makkah. He was among the very first to accept Islam, drawn by Abū Bakr رضي الله عنه. He is called <strong>Dhū al-Nūrayn</strong> (\'He of the Two Lights\') because he married two daughters of the Prophet ﷺ in succession: first Ruqayyah, and after her death, Umm Kulthūm. No other man in history married two daughters of a prophet.</p>

<h3>Extraordinary Generosity</h3>
<h4>The Well of Rūmah</h4>
<p>When the Muslims of Madīnah needed water, a Jewish man owned the only well and sold water at high prices. \'Uthmān purchased the well and donated it for free use to all Muslims — his reward continues until today.</p>
<h4>The Expedition of Tabūk</h4>
<p>In the 9th year after Hijrah, the Muslim army faced a critical expedition to Tabūk but lacked equipment. The Prophet ﷺ appealed for donations. \'Uthmān came forward with 300 camels fully loaded with supplies, 1,000 dinars in gold, and 300 horses. The Prophet ﷺ raised his hands and said: <em>"\'Uthmān\'s deeds after today will not harm him."</em></p>

<h3>Greatest Achievement: The Standardised Qur\'an</h3>
<p>As Islam spread to Persia, Iraq, and Syria, different regions read the Qur\'an in different dialects (qirā\'āt). Disagreements arose about \'correct\' recitation. \'Uthmān\'s companion Ḥudhayfah ibn al-Yamān rushed to him alarmed: <em>"Save this ummah before they differ about the Qur\'an as the Jews and Christians differed."</em></p>
<p>\'Uthmān convened a committee of the foremost Companions, led by Zayd ibn Thābit. They produced a single authoritative copy (the Muṣḥaf \'Uthmānī) in the Qurayshī dialect and sent copies to all provinces, requesting that all variant copies be burned. This preserved the Qur\'an in one unified form for all time.</p>

<h3>His Caliphate (644–656 CE)</h3>
<p>\'Uthmān was elected the third Caliph after \'Umar رضي الله عنه. Under his rule, the Islamic state expanded further: Azerbaijan, Cyprus, parts of North Africa, and Khurāsān were added. The Islamic navy was established.</p>

<h3>Martyrdom</h3>
<p>In his final years, political unrest grew. Rebels from Egypt, Kufa, and Basra marched to Madīnah and besieged \'Uthmān in his home for 49 days. He refused to use force against Muslims, saying: <em>"I will not be the first to spill Muslim blood."</em></p>
<p>On the 18th of Dhūl Ḥijjah 35 AH, the rebels broke into his house and martyred him while he was reciting the Qur\'an. His blood fell onto the page at the verse: <em>"Allah will suffice you against them; and He is the All-Hearing, the All-Knowing."</em> (2:137)</p>
`.trim();

  const unit7 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-sirah-uthman' } },
    create: {
      slug: 'maktab-8-sirah-uthman',
      courseId: course.id,
      orderIndex: 7,
      title: 'Sīrah — \'Uthmān Ibn \'Affān رضي الله عنه',
      description: 'The life of \'Uthmān ibn \'Affān: why he was called Dhū al-Nūrayn, his extraordinary generosity (well of Rūmah, Tabūk expedition), his greatest legacy of standardising the Qur\'an (Muṣḥaf \'Uthmānī), and his martyrdom.',
      content: uthmanContent,
    },
    update: {
      title: 'Sīrah — \'Uthmān Ibn \'Affān رضي الله عنه',
      description: 'The life of \'Uthmān ibn \'Affān: why he was called Dhū al-Nūrayn, his extraordinary generosity (well of Rūmah, Tabūk expedition), his greatest legacy of standardising the Qur\'an (Muṣḥaf \'Uthmānī), and his martyrdom.',
      content: uthmanContent,
    },
  });
  console.log('✅ Unit 7:', unit7.title);

  // =============================================
  // UNIT 8: SĪRAH — \'Alī Ibn Abī Ṭālib رضي الله عنه
  // =============================================

  const aliContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Describe \'Alī\'s upbringing in the household of the Prophet ﷺ.</li>
  <li>Explain his special title and the famous ḥadīth about knowledge.</li>
  <li>Know his role as a warrior and leader in early Islam.</li>
  <li>Describe the circumstances of his caliphate and martyrdom.</li>
</ul>

<h3>Growing Up in the Prophet\'s Household</h3>
<p>\'Alī ibn Abī Ṭālib رضي الله عنه was born approximately 10 years before prophethood. When the Prophet ﷺ was raising children in his household, \'Alī (then 5–6 years old) came to live with him. He grew up seeing revelation come, witnessing the Prophet\'s worship and character from the closest proximity.</p>
<p><strong>First youth to accept Islam:</strong> He was the first child to accept the message of the Prophet ﷺ, accepting Islam at approximately age 10, before most adults had come forward.</p>

<h3>His Title: Karram Allāhu Wajhah</h3>
<p>\'Alī is given the special honorific <em>Karram Allāhu wajhah</em> — \'May Allāh honour his face\' — because his face never prostrated to an idol. He was raised in the Prophet\'s household and accepted Islam so young that he never once committed the sin of shirk or idol-worship. This is a unique distinction.</p>

<h3>The Gateway to the City of Knowledge</h3>
<p>The Prophet ﷺ said: <em>"I am the city of knowledge and \'Alī is its gate. Whoever wishes to enter the city, let him enter through the gate."</em> (Related by multiple chains)</p>
<p>\'Alī was famed for his profound scholarship in Qur\'anic tafsīr, fiqh, Arabic language, and spiritual wisdom. He was appointed by the Prophet ﷺ as the judge of Yemen, a role requiring immense knowledge and wisdom.</p>

<h3>Brave Warrior</h3>
<ul>
  <li><strong>Battle of Badr:</strong> Fought in the first major battle. Showed exceptional bravery in single combat.</li>
  <li><strong>Battle of Uḥud:</strong> Among the few who stayed to protect the Prophet ﷺ when others fled.</li>
  <li><strong>Battle of Khandaq:</strong> Killed the famous warrior \'Amr ibn \'Abd Wudd in single combat, a decisive moment of the battle.</li>
  <li><strong>Khaybar:</strong> The Prophet ﷺ handed him the banner, saying: <em>"I will give it to a man who loves Allāh and His Messenger, and whom Allāh and His Messenger love."</em></li>
</ul>

<h3>His Caliphate (656–661 CE)</h3>
<p>Following the martyrdom of \'Uthmān, \'Alī was selected as the fourth Caliph. His caliphate was marked by internal strife (fitnah): the Battle of the Camel, the Battle of Ṣiffīn, and the Arbitration of Ṩār. These events were tests for the young Muslim community and are studied carefully by historians and scholars.</p>

<h3>Martyrdom in Kūfah</h3>
<p>In 40 AH, while entering the mosque in Kūfah for Fajr prayer, \'Alī was struck by Ibn Muljam, a member of the Khawārij, with a poisoned sword. He passed away two days later. His last words were words of forgiveness and remembrance of Allāh.</p>
<p>The Prophet ﷺ said about him: <em>"\'Alī is from me and I am from \'Alī."</em> His love and honour are part of loving the Prophet ﷺ.</p>
`.trim();

  const unit8 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-sirah-ali' } },
    create: {
      slug: 'maktab-8-sirah-ali',
      courseId: course.id,
      orderIndex: 8,
      title: 'Sīrah — \'Alī Ibn Abī Ṭālib رضي الله عنه',
      description: '\'Alī ibn Abī Ṭālib: first youth to accept Islam, his unique title Karram Allāhu wajhah, the ḥadīth about the city of knowledge, bravery in battles, his caliphate during the fitnah period, and martyrdom in Kūfah.',
      content: aliContent,
    },
    update: {
      title: 'Sīrah — \'Alī Ibn Abī Ṭālib رضي الله عنه',
      description: '\'Alī ibn Abī Ṭālib: first youth to accept Islam, his unique title Karram Allāhu wajhah, the ḥadīth about the city of knowledge, bravery in battles, his caliphate during the fitnah period, and martyrdom in Kūfah.',
      content: aliContent,
    },
  });
  console.log('✅ Unit 8:', unit8.title);

  // =============================================
  // UNIT 9: TĀRĪKH — Prophet Ayyūb ʿalayhi al-salām
  // =============================================

  const ayyubContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Describe the severe trials that Ayyūb ʿalayhi al-salām endured with patience.</li>
  <li>Recite and understand his du\'a\' from the Qur\'an.</li>
  <li>Appreciate Allāh\'s response to sincere patience and du\'a\'.</li>
  <li>Apply the lesson of patient gratitude to one\'s own life.</li>
</ul>

<h3>Who Was Ayyūb ʿalayhi al-salām?</h3>
<p>Ayyūb (Job) was a prophet of Allāh who lived in the land of \'Uẓ. He was blessed with immense wealth, a large family, excellent health, and social honour. He was deeply grateful to Allāh for every blessing.</p>

<h3>The Great Trials</h3>
<p>Allāh tested Ayyūb with an extraordinary series of calamities:</p>
<ul>
  <li><strong>Wealth:</strong> His entire wealth was destroyed.</li>
  <li><strong>Family:</strong> His children died one by one.</li>
  <li><strong>Health:</strong> He was afflicted with a severe skin disease for 18 years. His body was covered with painful sores. He could barely move.</li>
  <li><strong>Social isolation:</strong> Almost everyone abandoned him except his devoted wife, who served him throughout his illness.</li>
</ul>
<p>Despite all this, Ayyūb never complained, never lost faith, and never stopped praising Allāh. The angels marvelled at his patience.</p>

<h3>His Du\'a\' to Allāh</h3>
<p class="arabic" dir="rtl" lang="ar">أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ</p>
<p><em>"Indeed, adversity has touched me, and You are the Most Merciful of the merciful."</em> (Qur\'an 21:83)</p>
<p>This du\'a\' is a masterpiece of supplication: Ayyūb simply described his condition and called upon Allāh\'s mercy. He did not demand, complain, or question Allāh\'s wisdom. He acknowledged his pain, and acknowledged Allāh\'s attribute of mercy. Allāh responded immediately.</p>

<h3>Allāh\'s Response</h3>
<p>Allāh says: <em>"So We responded to him, removed the affliction which he had, and We restored his family to him, and the like thereof along with them — as a mercy from Us and as a lesson for the worshippers of Allāh."</em> (21:84)</p>
<ul>
  <li>His health was completely restored (Allāh told him to strike the ground — a spring appeared for him to wash and drink).</li>
  <li>His wealth was returned doubled.</li>
  <li>His family was restored.</li>
</ul>

<h3>Lessons</h3>
<ul>
  <li><strong>Patience in calamity is an act of worship.</strong></li>
  <li><strong>Du\'a\' is the weapon of the believer.</strong> Call on Allāh with humility and certainty in His mercy.</li>
  <li><strong>Trials are not punishments.</strong> Allāh tests those He loves most.</li>
  <li><strong>All relief comes from Allāh alone.</strong> The deeper the patience, the greater the restoration.</li>
</ul>
<p>The Prophet ﷺ said: <em>"The greatest reward comes with the greatest trial. When Allāh loves a people He tests them."</em> (Tirmidhī)</p>
`.trim();

  const unit9 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-tarikh-ayyub' } },
    create: {
      slug: 'maktab-8-tarikh-ayyub',
      courseId: course.id,
      orderIndex: 9,
      title: 'Tārīkh — Prophet Ayyūb ʿalayhi al-salām',
      description: 'The story of Prophet Ayyūb: his severe trials (18 years of illness, loss of wealth and family), his unwavering patience, his Qur\'anic du\'a\' (21:83), Allāh\'s response restoring everything doubled, and lessons for daily life.',
      content: ayyubContent,
    },
    update: {
      title: 'Tārīkh — Prophet Ayyūb ʿalayhi al-salām',
      description: 'The story of Prophet Ayyūb: his severe trials (18 years of illness, loss of wealth and family), his unwavering patience, his Qur\'anic du\'a\' (21:83), Allāh\'s response restoring everything doubled, and lessons for daily life.',
      content: ayyubContent,
    },
  });
  console.log('✅ Unit 9:', unit9.title);

  // =============================================
  // UNIT 10: TĀRĪKH — Andalusia & The Crusades
  // =============================================

  const andalusiaContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Summarise how Muslims entered Andalusia and what \'Golden Age\' achievements followed.</li>
  <li>Explain the significance of Córdoba as a centre of civilisation.</li>
  <li>Describe the Crusades and the Muslim response under Ṣalāḥuddīn al-Ayyūbī.</li>
</ul>

<h3>Islamic Andalusia (711–1492 CE)</h3>
<h4>Ṭāriq ibn Ziyād and the Conquest</h4>
<p>In 711 CE, the Umayyad general Ṭāriq ibn Ziyād crossed from North Africa to Iberia with 7,000 troops. On landing at what is now Gibraltar (Jabal Ṭāriq — Mountain of Ṭāriq), he burned the boats behind his army, declaring: <em>"The sea is behind you and the enemy is in front. By Allāh, there is no choice but patience and victory."</em> Within two years, most of the Iberian Peninsula was under Muslim rule.</p>

<h4>The Golden Age under \'Abd al-Raḥmān III</h4>
<p>Under the Umayyad Caliph \'Abd al-Raḥmān III (912–961 CE), Andalusia reached its peak. Córdoba became the greatest city in Europe:</p>
<ul>
  <li>Population of 500,000 — when London had under 20,000.</li>
  <li>400 mosques, 300 public baths, and the magnificent Masjid of Córdoba.</li>
  <li>70 public libraries — when most European monasteries had a handful of books.</li>
  <li>Street lighting and running water — centuries before northern Europe.</li>
</ul>

<h4>Muslim Scholars of Andalusia</h4>
<ul>
  <li><strong>Ibn Rushd (Averroes):</strong> His commentaries on Aristotle preserved Greek philosophy for Europe and helped spark the European Renaissance.</li>
  <li><strong>Ibn Ḥazm:</strong> Scholar of fiqh, literature, and comparative religion.</li>
  <li><strong>Maimonides:</strong> The great Jewish philosopher who was educated in the Islamic scholarly tradition of Andalusia.</li>
  <li><strong>Ibn Ḥayyiyān:</strong> Historian of Andalusia whose chronicles document this era in detail.</li>
</ul>

<h3>The Crusades (1095–1291 CE)</h3>
<h4>The Call to War</h4>
<p>In 1095, Pope Urban II called the Christian rulers of Europe to a holy war to \'reclaim\' Jerusalem from Muslim rule. In 1099, the Crusaders took Jerusalem. Contemporary accounts describe a massacre of the city\'s Muslim and Jewish population.</p>

<h4>Ṣalāḥuddīn al-Ayyūbī and the Reconquest of Jerusalem</h4>
<p>Ṣalāḥuddīn (Saladin, 1137–1193 CE) was a Kurdish Muslim leader who united the divided Muslim world. His character was renowned for justice, generosity, and nobility.</p>
<p>On 2 October 1187, exactly 88 years after the Crusader conquest, Ṣalāḥuddīn retook Jerusalem. Unlike the Crusader conquest, there was <strong>no massacre</strong>. Christian inhabitants were guaranteed safety and allowed to leave with their possessions. Even his enemies praised his honour.</p>
<p>He was reported to have wept on entering al-Masjid al-Aqṣā as it was purified and the adhān rang out once more.</p>

<h3>Lesson for Muslims</h3>
<p>Andalusia teaches us that intellectual excellence and faith can coexist — that Muslim civilisation at its peak was the greatest in the world. Its fall (completed in 1492 with the fall of Granada) reminds us what happens when Muslim unity and taqwā are neglected. Ṣalāḥuddīn shows us that the path to victory is through personal character and reliance on Allāh.</p>
`.trim();

  const unit10 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-tarikh-andalusia-crusades' } },
    create: {
      slug: 'maktab-8-tarikh-andalusia-crusades',
      courseId: course.id,
      orderIndex: 10,
      title: 'Tārīkh — Andalusia & The Crusades',
      description: 'Ṭāriq ibn Ziyād\'s conquest (711 CE), the Golden Age of Islamic Andalusia under \'Abd al-Raḥmān III, Córdoba as Europe\'s greatest city, Muslim scholars (Ibn Rushd, Ibn Ḥazm), the Crusades (1095 CE), and Ṣalāḥuddīn\'s reconquest of Jerusalem (1187) without massacre.',
      content: andalusiaContent,
    },
    update: {
      title: 'Tārīkh — Andalusia & The Crusades',
      description: 'Ṭāriq ibn Ziyād\'s conquest (711 CE), the Golden Age of Islamic Andalusia under \'Abd al-Raḥmān III, Córdoba as Europe\'s greatest city, Muslim scholars (Ibn Rushd, Ibn Ḥazm), the Crusades (1095 CE), and Ṣalāḥuddīn\'s reconquest of Jerusalem (1187) without massacre.',
      content: andalusiaContent,
    },
  });
  console.log('✅ Unit 10:', unit10.title);

  // =============================================
  // UNIT 11: TĀRĪKH — The Ottoman Empire
  // =============================================

  const ottomanContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Trace the rise of the Ottoman Empire from a small Anatolian principality.</li>
  <li>Explain the conquest of Constantinople and why the Prophet ﷺ foretold it.</li>
  <li>Describe the peak of Ottoman power under Sulaymān the Magnificent.</li>
  <li>Understand the fall of the caliphate and its significance.</li>
</ul>

<h3>Rise of the Ottomans</h3>
<p>The Ottoman state began in the early 14th century as a small Turkish principality in north-western Anatolia under Osman I (after whom the dynasty is named). Through skilled military leadership, alliances, and the unifying banner of Islam, the Ottomans expanded rapidly.</p>
<p>Under Sultan Murād I, the Ottomans expanded into the Balkans, defeating Crusader forces at the Battle of Kosovo (1389). The question of Constantinople — the great Byzantine capital that had stood for over a thousand years — became the dream of every Muslim ruler after the Prophet\'s ﷺ prophecy.</p>

<h3>The Prophecy of the Prophet ﷺ</h3>
<p>The Prophet ﷺ said: <em>"Verily, you will conquer Constantinople. What an excellent commander will its commander be, and what an excellent army will that army be."</em> (Aḥmad)</p>
<p>This ḥadīth, recorded centuries before the event, was a source of motivation for Muslim rulers for 800 years.</p>

<h3>Fatḥ al-QuṣṬantiniyyah (1453 CE)</h3>
<p>Sultan Muḥammad ibn Murād, known as <strong>Muḥammad al-Fātiḥ</strong> (\'The Conqueror\'), became Sultan at age 19 and set his sights on Constantinople. At age 21, in 1453 CE, he led a massive army of 80,000 men and an unprecedented naval fleet.</p>
<ul>
  <li>He had enormous cannons constructed that could fire balls weighing over 500 kg.</li>
  <li>When the sea chain blocked his fleet, he had 70 ships dragged overland on greased logs into the Golden Horn — the Byzantines woke to find an enemy fleet inside their harbour.</li>
  <li>After 53 days of siege, on 29 May 1453, the walls were breached.</li>
</ul>
<p>Muḥammad al-Fātiḥ entered the city and immediately went to the great church of Hagia Sophia (Aya Sofya) and prayed. He was reported to have rubbed his face on the ground in gratitude to Allāh. He treated the Christian population with fairness and allowed religious freedom.</p>
<p>The Prophet\'s ﷺ prophecy was fulfilled.</p>

<h3>Peak Under Sulaymān the Magnificent (1520–1566 CE)</h3>
<p>Under Sulaymān I, the Ottoman Empire reached its greatest extent: Hungary, the Middle East, North Africa, and parts of the Indian Ocean. He is called \'the Magnificent\' by Europeans and <em>Qānūnī</em> (\'the Lawgiver\') by Muslims for his comprehensive legal reforms. The Sulaymāniyya Mosque in Istanbul remains one of the most beautiful buildings in the world.</p>

<h3>Decline and Fall of the Caliphate</h3>
<p>Over centuries, the empire weakened: internal corruption, costly wars, and European colonialism took their toll. In World War I, the Ottomans allied with Germany and were defeated. European powers divided the Ottoman territories.</p>
<p>In 1924, Mustafa Kemal (Atatürk) abolished the Ottoman Caliphate entirely — the first time in over a thousand years that the Muslim world had no Caliph. This remains one of the most significant events in modern Islamic history.</p>
`.trim();

  const unit11 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-tarikh-ottomans' } },
    create: {
      slug: 'maktab-8-tarikh-ottomans',
      courseId: course.id,
      orderIndex: 11,
      title: 'Tārīkh — The Ottoman Empire',
      description: 'Rise of the Ottoman Empire, the Prophet\'s ﷺ prophecy about Constantinople, Sultan Muḥammad al-Fātiḥ\'s conquest in 1453, peak under Sulaymān the Magnificent, and the abolition of the caliphate in 1924.',
      content: ottomanContent,
    },
    update: {
      title: 'Tārīkh — The Ottoman Empire',
      description: 'Rise of the Ottoman Empire, the Prophet\'s ﷺ prophecy about Constantinople, Sultan Muḥammad al-Fātiḥ\'s conquest in 1453, peak under Sulaymān the Magnificent, and the abolition of the caliphate in 1924.',
      content: ottomanContent,
    },
  });
  console.log('✅ Unit 11:', unit11.title);

  // =============================================
  // UNIT 12: AQĀ\'ID — Attributes of Allāh & Istiwā\'
  // =============================================

  const attributesContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Define and categorise the attributes of Allāh according to Ahl al-Sunnah.</li>
  <li>List the six essential (dhātiyyah) attributes and understand each.</li>
  <li>Explain the correct Ahl al-Sunnah stance on istiwā\'.</li>
  <li>Avoid the errors of ta\'tīl (negation) and tashbīh (comparison to creation).</li>
</ul>

<h3>Why Study the Attributes of Allāh?</h3>
<p>Knowing Allāh properly is the foundation of all worship. If your concept of Allāh is incorrect, your relationship with Him will be distorted. ‘Ilm al-Kalām (Islamic theology) clarifies the correct beliefs about Allāh\'s nature.</p>

<h3>Categories of Divine Attributes (Ṣifāt)</h3>
<h4>1. Ṣifāt Dhātiyyah (Essential Attributes)</h4>
<p>These are attributes inseparable from Allāh\'s Essence. The six essential attributes are:</p>
<ul>
  <li><strong>Wujūd (Existence):</strong> Allāh necessarily exists. His non-existence is impossible.</li>
  <li><strong>Qidam (Pre-eternity / No beginning):</strong> Allāh has no beginning — He always was.</li>
  <li><strong>Baqā\' (Everlastingness):</strong> Allāh has no end — He always will be.</li>
  <li><strong>Qiyām binafsih (Self-subsistence):</strong> Allāh does not depend on anything or anyone. He is completely self-sufficient. <em>"Allāh is free of need of the worlds."</em> (3:97)</li>
  <li><strong>Waḥdāniyyah (Oneness):</strong> Allāh is absolutely One, unique in His Essence, attributes, and actions.</li>
  <li><strong>Mukhālafah lil-ḥawādith (Distinctness from Creation):</strong> Allāh does not resemble any created thing. <em>"There is nothing like Him."</em> (42:11)</li>
</ul>

<h4>2. Ṣifāt Ma\'nawiyyah (Descriptive Attributes)</h4>
<p>These are attributes that Allāh has and that describe qualities: Power (Qudrah), Will (Irādah), Knowledge (\'Ilm), Life (Ḥayāh), Hearing (Sam\'a), Sight (Baṣar), and Speech (Kalām).</p>

<h4>3. Ṣifāt Fi\'liyyah (Attributes of Action)</h4>
<p>Attributes related to what Allāh does: creating, providing, giving life, causing death, etc. These are linked to His will and wisdom.</p>

<h3>The Question of Istiwā\'</h3>
<p>Allāh says: <em>"Al-Raḥmān \'alā al-\'arsh istawā"</em> — <em>"The Most Merciful rose/ascended over the Throne."</em> (20:5)</p>
<p>This verse requires careful handling. The two errors to avoid are:</p>
<ul>
  <li><strong>Ta\'tīl (complete negation):</strong> Denying the attribute entirely, saying it means nothing. This is incorrect.</li>
  <li><strong>Tashbīh (comparison):</strong> Imagining Allāh\'s istiwā\' is like a king sitting on a throne. This is also incorrect, as Allāh is unlike creation.</li>
</ul>
<p>The Ahl al-Sunnah position (following Imām Mālik and the Salaf): We <strong>affirm</strong> the attribute of istiwā\' as Allāh described — and we do so <strong>bilā kayf</strong> (without specifying the manner). When Imām Mālik was asked about this verse, he said: <em>"The istiwā\' is known, the manner is unknown, believing in it is obligatory, and asking about it is a bid\'ah."</em></p>
<p>This principle of affirming without anthropomorphism and without negation is the <em>middle path</em> of Ahl al-Sunnah wa al-Jamā\'ah.</p>
`.trim();

  const unit12 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-aqaid-attributes' } },
    create: {
      slug: 'maktab-8-aqaid-attributes',
      courseId: course.id,
      orderIndex: 12,
      title: 'Aqā\'id — Attributes of Allāh & Istiwā\'',
      description: 'The categories of Allāh\'s attributes (Ṣifāt): six essential attributes (wujūd, qidam, baqā\', qiyām binafsih, waḥdāniyyah, mukhālafah lil-ḥawādith), Ṣifāt ma\'nawiyyah, Ṣifāt fi\'liyyah, and the correct Ahl al-Sunnah position on istiwā\' (bilā kayf).',
      content: attributesContent,
    },
    update: {
      title: 'Aqā\'id — Attributes of Allāh & Istiwā\'',
      description: 'The categories of Allāh\'s attributes (Ṣifāt): six essential attributes (wujūd, qidam, baqā\', qiyām binafsih, waḥdāniyyah, mukhālafah lil-ḥawādith), Ṣifāt ma\'nawiyyah, Ṣifāt fi\'liyyah, and the correct Ahl al-Sunnah position on istiwā\' (bilā kayf).',
      content: attributesContent,
    },
  });
  console.log('✅ Unit 12:', unit12.title);

  // =============================================
  // UNIT 13: AQĀ\'ID — Complete Īmān & Following the \'Ulamā\'
  // =============================================

  const imanUlamaContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Define Īmān completely with its three components according to Ahl al-Sunnah.</li>
  <li>Understand that Īmān can increase and decrease.</li>
  <li>Explain the Qur\'anic obligation to follow qualified scholars.</li>
  <li>Identify the dangers of following unqualified religious opinions.</li>
</ul>

<h3>What is Īmān?</h3>
<p>Īmān (faith) is not merely saying the Sharīdah or believing in the heart. The complete definition, as held by Ahl al-Sunnah wa al-Jamā\'ah, has three components:</p>
<ol>
  <li><strong>Taṣdīq (inner belief):</strong> Sincerely believing in Allāh, His angels, His scriptures, His messengers, the Last Day, and divine decree (qadar) — with the heart.</li>
  <li><strong>Iqrār (verbal acknowledgement):</strong> Affirming one\'s faith with the tongue — the Sharīdah (\'lā ilāha ill-Allāh Muḥammad-un rasūl-Allāh\').</li>
  <li><strong>\'Amal (acting on it):</strong> Performing the obligatory acts and abstaining from the prohibited. Acts are part of Īmān and affect it.</li>
</ol>
<p><strong>Note:</strong> The Ḥanafī school holds that Īmān in its essence is taṣdīq (belief in the heart) — and that a believer\'s Īmān does not technically increase or decrease (though their Īmān\'s \'light\' and conviction can). The Shafi\'i and other schools hold that Īmān increases with obedience and decreases with disobedience — this has Qur\'anic support: <em>"And when His verses are recited to them, it increases them in faith."</em> (8:2)</p>

<h3>The Importance of Following Qualified \'Ulamā\'</h3>
<p>Allāh commands: <em>"Ask the people of knowledge if you do not know."</em> (Qur\'an 16:43 and 21:7)</p>
<p>This verse establishes a principle: religious knowledge requires qualified scholars. Not everyone who reads online or picks up a book is qualified to give religious rulings (fatwā).</p>

<h4>Qualities of a Reliable Scholar</h4>
<ul>
  <li>Trained in traditional Islamic sciences (fiqh, uṣūl al-fiqh, ḥadīth, tafsīr) from qualified teachers.</li>
  <li>Connected to a chain of scholarship (isnād) going back to the Companions and ultimately to the Prophet ﷺ.</li>
  <li>Known for personal piety, taqwā, and upright character.</li>
  <li>Recognised and recommended by other trustworthy scholars.</li>
</ul>

<h4>Dangers of Unqualified Opinions</h4>
<p>The Prophet ﷺ said: <em>"Allāh does not take away knowledge by extracting it from the hearts of men, but takes it away by the death of scholars. Until, when no scholar remains, people will take ignorant men as leaders, who will give fatāwā without knowledge, going astray themselves and leading others astray."</em> (Bukhārī and Muslim)</p>
<p>In the social media age, everyone has a microphone. The following are red flags for unreliable religious guidance:</p>
<ul>
  <li>No formal traditional training in the subject being spoken about.</li>
  <li>Contradicting scholarly consensus (ijmā\') without credible evidence.</li>
  <li>Dismissing 1,400 years of scholarship as \'outdated\'.</li>
  <li>Appealing to emotions rather than dalīl (evidence from Qur\'an and Sunnah).</li>
</ul>
<p>Your responsibility as a Muslim teenager: know who you are taking your religion from. Build relationships with reliable local scholars and institutions.</p>
`.trim();

  const unit13 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-aqaid-iman-ulama' } },
    create: {
      slug: 'maktab-8-aqaid-iman-ulama',
      courseId: course.id,
      orderIndex: 13,
      title: 'Aqā\'id — Complete Īmān & Following the \'Ulamā\'',
      description: 'Complete definition of Īmān: taṣdīq (inner belief), iqrār (verbal acknowledgement), \'amal (action); whether Īmān increases and decreases; Qur\'anic command to follow scholars (16:43); how to identify reliable \'ulamā\' and dangers of unqualified religious opinions.',
      content: imanUlamaContent,
    },
    update: {
      title: 'Aqā\'id — Complete Īmān & Following the \'Ulamā\'',
      description: 'Complete definition of Īmān: taṣdīq (inner belief), iqrār (verbal acknowledgement), \'amal (action); whether Īmān increases and decreases; Qur\'anic command to follow scholars (16:43); how to identify reliable \'ulamā\' and dangers of unqualified religious opinions.',
      content: imanUlamaContent,
    },
  });
  console.log('✅ Unit 13:', unit13.title);

  // =============================================
  // UNIT 14: AKHLĀQ — Taqwā, Tawakkul & Tawbah
  // =============================================

  const taqwaTawbahContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Define taqwā and its three levels.</li>
  <li>Explain the correct understanding of tawakkul using the ḥadīth of the camel.</li>
  <li>State the three conditions of valid tawbah and the extra condition when someone else\'s right is involved.</li>
</ul>

<h3>Taqwā: The Core of Every Virtue</h3>
<p>Taqwā literally means \'a shield\' — specifically, a shield between you and what you fear. In Islamic usage, it means shielding yourself from Allāh\'s displeasure through conscious awareness of Him in every action.</p>
<p>The Prophet ﷺ said: <em>"Fear Allāh wherever you are, follow a bad deed with a good one to erase it, and deal with people with good character."</em> (Tirmidhī)</p>

<h4>Three Levels of Taqwā</h4>
<ol>
  <li><strong>Avoiding ḥarām:</strong> Protecting yourself from what Allāh has explicitly forbidden — this is the minimum.</li>
  <li><strong>Avoiding makrūh:</strong> Going beyond the minimum, avoiding disliked acts even when they are not forbidden.</li>
  <li><strong>Avoiding everything that distracts from Allāh:</strong> The highest level — the saints (awliyā\') leave anything that occupies their heart from remembering Allāh.</li>
</ol>

<h4>How to Develop Taqwā</h4>
<ul>
  <li>Regular ṣalāh (Allāh says ṣalāh prevents from faḥshā\' and munkar).</li>
  <li>Frequent dhikr and recitation of Qur\'an.</li>
  <li>Keeping righteous company.</li>
  <li>Reflecting on death and the Day of Judgement.</li>
</ul>

<h3>Tawakkul: Trust in Allāh — After Taking Means</h3>
<p>Tawakkul is often misunderstood as fatalism: \'just leave everything to Allāh and do nothing.\' This is incorrect. The Prophet ﷺ corrected this understanding clearly.</p>
<p>A man came to the Prophet ﷺ and said: <em>"Should I tie my camel or leave it and trust in Allāh?"</em> The Prophet ﷺ replied: <em>"Tie it, then trust in Allāh."</em> (Tirmidhī)</p>
<p>True tawakkul means: <strong>take all the means available to you</strong> (study for the exam, lock the car, take the medicine) <strong>and then</strong> trust Allāh with the outcome. The outcome is in His hands; the effort is yours.</p>
<p>Allāh says: <em>"And whoever relies upon Allāh — then He is sufficient for him."</em> (65:3) This comes after the command to take precautions.</p>

<h3>Tawbah: Returning to Allāh</h3>
<p>No one is free of sin. Allāh\'s door of tawbah (repentance) is always open. The Prophet ﷺ said: <em>"Allāh holds out His hand by night so the sinner of the day may repent, and He holds out His hand by day so the sinner of the night may repent — until the sun rises from the west."</em> (Muslim)</p>

<h4>Three Conditions of Valid Tawbah</h4>
<ol>
  <li><strong>Nadam (Regret):</strong> Genuinely feeling sorry for the sin — not just its consequences.</li>
  <li><strong>Stop the sin:</strong> Immediately ceasing the sinful action.</li>
  <li><strong>Resolve not to return:</strong> Sincerely intending never to commit that sin again.</li>
</ol>

<h4>Fourth Condition: When Someone Else\'s Right is Involved</h4>
<p>If the sin involved another person (theft, backbiting, lying), a fourth condition is required: <strong>restore the right</strong> if possible (return stolen goods, pay debts) and/or <strong>seek forgiveness</strong> from the wronged person. If this is not possible, make excessive du\'a\' for them and pray Allāh compensates them on your behalf on the Day of Judgement.</p>
`.trim();

  const unit14 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-akhlaq-taqwa-tawakkul-tawbah' } },
    create: {
      slug: 'maktab-8-akhlaq-taqwa-tawakkul-tawbah',
      courseId: course.id,
      orderIndex: 14,
      title: 'Akhlāq — Taqwā, Tawakkul & Tawbah',
      description: 'Taqwā as a shield, its three levels, how to develop it; tawakkul after taking means (ḥadīth of the camel); three conditions of valid tawbah (nadam, stop, resolve) plus the fourth when another\'s right is involved; Allāh\'s door of tawbah is always open.',
      content: taqwaTawbahContent,
    },
    update: {
      title: 'Akhlāq — Taqwā, Tawakkul & Tawbah',
      description: 'Taqwā as a shield, its three levels, how to develop it; tawakkul after taking means (ḥadīth of the camel); three conditions of valid tawbah (nadam, stop, resolve) plus the fourth when another\'s right is involved; Allāh\'s door of tawbah is always open.',
      content: taqwaTawbahContent,
    },
  });
  console.log('✅ Unit 14:', unit14.title);

  // =============================================
  // UNIT 15: AKHLĀQ & ĀDĀB — Modesty, Debate & Transactions
  // =============================================

  const adabFinalContent = `
<h2>Learning Objectives</h2>
<ul>
  <li>Understand the Qur\'anic command to lower the gaze and why it applies to both genders.</li>
  <li>Know the etiquette of Islamic debate: seeking truth not victory.</li>
  <li>Ādāb of walīmah and celebrating nikāh appropriately.</li>
  <li>Know the ḥadīth on honesty in transactions.</li>
</ul>

<h3>Modesty in Gaze (Ḥifẓ al-Baṣar)</h3>
<p>Allāh commands: <em>"Tell the believing men to lower their gaze and guard their chastity — that is purer for them. Indeed Allāh is Aware of what they do. And tell the believing women to lower their gaze and guard their chastity."</em> (Qur\'an 24:30–31)</p>

<h4>Why This Command?</h4>
<p>Uncontrolled gazing is the first step toward ẓinā (unlawful relations). The Prophet ﷺ called the unlawful gaze the \'adultery of the eyes.\' In an age of constant digital screens, social media, and advertising that exploits the human gaze, this command is more relevant than ever.</p>

<h4>Practical Steps</h4>
<ul>
  <li>Recognise the impulse — don\'t pretend it doesn\'t exist.</li>
  <li>Look away immediately when your gaze falls on something ḥarām.</li>
  <li>Be mindful of what you scroll through online.</li>
  <li>Fill your time with productive, beneficial activities.</li>
  <li>Make du\'a\' for protection of the heart and gaze.</li>
</ul>
<p>Modesty (hayā\') is comprehensive: in dress, speech, behaviour, and gaze. The Prophet ﷺ said: <em>"Hayā\' does not bring anything except good."</em> (Bukhārī)</p>

<h3>Etiquette of Debate (Adāb al-Ḥiwār)</h3>
<p>Debate and discussion are part of academic and Islamic life. The Qur\'an itself uses argument and reasoning. However, Islamic scholarship has a strict ethics of debate:</p>
<ul>
  <li><strong>Seek truth, not victory.</strong> The goal of a debate should be for the best argument to prevail, not for <em>you</em> to prevail.</li>
  <li><strong>Do not mock your opponent.</strong> Allāh says: <em>"O you who believe, let not one group mock another."</em> (49:11)</li>
  <li><strong>Do not raise your voice.</strong> The Prophet ﷺ never shouted in argument.</li>
  <li><strong>Acknowledge good points.</strong> When the other person makes a valid argument, acknowledge it: this is a sign of intellectual honesty.</li>
  <li><strong>Concede when wrong.</strong> Imām al-Shāfi\'ī said: <em>"I never debated anyone except hoping that Allāh would place the truth on his tongue."</em></li>
  <li><strong>Know when to stop.</strong> Allāh says debates with those who persist in falsehood should end gracefully: <em>"We have our deeds and you have your deeds."</em> (28:55)</li>
</ul>

<h3>Ādāb of Walīmah (Wedding Celebration)</h3>
<p>The walīmah (post-nikāh celebration) is a confirmed sunnah. The Prophet ﷺ said: <em>"Have a walīmah even with a single sheep."</em> Its proper etiquette:</p>
<ul>
  <li>It should be simple and modest, not wasteful.</li>
  <li>Attending the walīmah of a Muslim when invited is a right owed to them.</li>
  <li>Mixed gatherings with free mixing are not appropriate.</li>
  <li>Music, dancing, and extravagance are to be avoided.</li>
</ul>

<h3>Honesty in Transactions</h3>
<p>The Prophet ﷺ said: <em>"Whoever cheats us is not from us."</em> (Muslim) This includes:</p>
<ul>
  <li>Hiding defects in goods being sold.</li>
  <li>Giving short measure or weight.</li>
  <li>Making false claims about a product.</li>
  <li>Charging for work not done.</li>
</ul>
<p>The Prophet ﷺ described the honest merchant: <em>"The trustworthy, honest merchant will be with the prophets, the truthful, and the martyrs."</em> (Tirmidhī)</p>
<p>Being a young Muslim of integrity in your future career — in whatever field you choose — is itself an act of worship and da\'wah.</p>
`.trim();

  const unit15 = await prisma.unit.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'maktab-8-adab-final' } },
    create: {
      slug: 'maktab-8-adab-final',
      courseId: course.id,
      orderIndex: 15,
      title: 'Akhlāq & Ādāb — Modesty, Debate & Transactions',
      description: 'Lowering the gaze (Qur\'an 24:30–31) and why; etiquette of Islamic debate (seek truth not victory, concede when wrong); ādāb of walīmah (wedding celebration); the ḥadīth on cheating in transactions ("he who cheats us is not from us").',
      content: adabFinalContent,
    },
    update: {
      title: 'Akhlāq & Ādāb — Modesty, Debate & Transactions',
      description: 'Lowering the gaze (Qur\'an 24:30–31) and why; etiquette of Islamic debate (seek truth not victory, concede when wrong); ādāb of walīmah (wedding celebration); the ḥadīth on cheating in transactions ("he who cheats us is not from us").',
      content: adabFinalContent,
    },
  });
  console.log('✅ Unit 15:', unit15.title);

  // =============================================
  // QUIZ QUESTIONS (6-8 per unit, 15 units)
  // =============================================

  const allQuestions = [
    // ---- Unit 1: Nawafil & Khushu ----
    {
      unitId: unit1.id,
      externalId: 'cb8-q1-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'When is the Tahájjud prayer performed?',
      options: ["After \'Ishā\' before midnight", 'In the last third of the night', 'Just before Fajr adhān', 'After sunrise'],
      correctAnswer: 'In the last third of the night',
      explanation: 'Tahájjud is ideally prayed in the last third of the night, when Allāh descends to the lowest heaven and accepts supplications.',
    },
    {
      unitId: unit1.id,
      externalId: 'cb8-q1-2',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'How many times more reward does congregational prayer carry compared to praying alone?',
      options: ['10 times', '17 times', '27 times', '100 times'],
      correctAnswer: '27 times',
      explanation: 'The Prophet ﷺ said: "Prayer in congregation is 27 degrees superior to prayer offered alone." (Bukhārī and Muslim)',
    },
    {
      unitId: unit1.id,
      externalId: 'cb8-q1-3',
      type: 'FILL_BLANK' as const,
      questionText: 'Khushū\' in prayer means ________ and presence of heart.',
      options: ['speed', 'humility', 'loudness', 'length'],
      correctAnswer: 'humility',
      explanation: 'Khushū\' means humility, submissiveness, and full presence of heart and mind before Allāh during prayer.',
    },
    {
      unitId: unit1.id,
      externalId: 'cb8-q1-4',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The Awwābīn prayer is performed:',
      options: ['Before Fajr', "After Ṣubh", 'After Maghrib', "Between Dhuhr and \'Aṣr"],
      correctAnswer: 'After Maghrib',
      explanation: "Awwābīn (prayer of the oft-returning) is performed after Maghrib prayer.",
    },
    {
      unitId: unit1.id,
      externalId: 'cb8-q1-5',
      type: 'TRUE_FALSE' as const,
      questionText: 'Tarāwīḥ prayer is only performed during Ramaḍān nights.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Tarāwīḥ is a special nightly prayer in congregation performed during the nights of Ramaḍān.',
    },
    {
      unitId: unit1.id,
      externalId: 'cb8-q1-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The Ḓuḥā prayer can be performed with how many rak\'at (maximum)?',
      options: ["2 rak\'at", "4 rak\'at", "8 rak\'at", "12 rak\'at"],
      correctAnswer: "12 rak\'at",
      explanation: "Ḓuḥā prayer can be prayed from 2 rak\'at minimum up to 12 rak\'at maximum in the mid-morning.",
    },

    // ---- Unit 2: Nikah & Talaq ----
    {
      unitId: unit2.id,
      externalId: 'cb8-q2-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which of the following is a required condition for a valid Nikāḥ?',
      options: ['A large mahr', "The consent of the husband\'s father", 'Two witnesses', 'An imam to perform it'],
      correctAnswer: 'Two witnesses',
      explanation: 'A valid nikāḥ requires: offer and acceptance (ījāb/qabūl), two witnesses, the walī (guardian) for the bride, and the mahr.',
    },
    {
      unitId: unit2.id,
      externalId: 'cb8-q2-2',
      type: 'FILL_BLANK' as const,
      questionText: 'The mahr is a mandatory ________ given by the groom to the bride.',
      options: ['service', 'gift', 'promise', 'dowry to family'],
      correctAnswer: 'gift',
      explanation: 'The mahr (dower) is a mandatory gift of money or property given exclusively to the bride, not her family.',
    },
    {
      unitId: unit2.id,
      externalId: 'cb8-q2-3',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Ṭalāq al-Sunnah means:',
      options: ['Three divorces at once', 'One revocable divorce', 'Divorce during menses', 'Divorce by the wife'],
      correctAnswer: 'One revocable divorce',
      explanation: "Ṭalāq al-Sunnah is one revocable divorce pronounced during the wife\'s period of purity (ṯuhr), allowing the couple to reconcile during the \'iddah.",
    },
    {
      unitId: unit2.id,
      externalId: 'cb8-q2-4',
      type: 'TRUE_FALSE' as const,
      questionText: "Pronouncing three divorces at once is considered Ṭalāq al-bid\'ah and is sinful even if it takes effect.",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "Ṭalāq al-bid\'ah (pronouncing three divorces at once) is sinful and contrary to the Sunnah, though the majority of scholars consider it legally effective.",
    },
    {
      unitId: unit2.id,
      externalId: 'cb8-q2-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The \'iddah refers to:",
      options: ['The mahr amount', 'The waiting period after divorce or widowhood', 'The wedding celebration', 'The nikāḥ ceremony'],
      correctAnswer: 'The waiting period after divorce or widowhood',
      explanation: "\'Iddah is the mandatory waiting period a woman must observe after divorce or the death of her husband before she may remarry.",
    },
    {
      unitId: unit2.id,
      externalId: 'cb8-q2-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Rujū\' (returning to the marriage) is permitted:",
      options: ['Only with a new nikāḥ', "During the \'iddah of a revocable divorce", "After the \'iddah ends", 'Never after any divorce'],
      correctAnswer: "During the \'iddah of a revocable divorce",
      explanation: "Rujū\' (reconciliation) is possible during the \'iddah of a revocable divorce without a new nikāḥ or mahr.",
    },

    // ---- Unit 3: Transactions ----
    {
      unitId: unit3.id,
      externalId: 'cb8-q3-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which of the following is a condition for a valid sale in Islam?',
      options: ['The item must be cheap', 'The item must be owned by the seller', 'The buyer must be a Muslim', 'The sale must happen in a mosque'],
      correctAnswer: 'The item must be owned by the seller',
      explanation: 'For a valid sale: the price and item must be known, the item must be owned by and deliverable by the seller.',
    },
    {
      unitId: unit3.id,
      externalId: 'cb8-q3-2',
      type: 'FILL_BLANK' as const,
      questionText: 'Ribā means ________ or usury.',
      options: ['charity', 'profit', 'interest', 'trade'],
      correctAnswer: 'interest',
      explanation: 'Ribā means interest or usury — any predetermined additional amount charged on a loan or deferred payment, prohibited in Islam.',
    },
    {
      unitId: unit3.id,
      externalId: 'cb8-q3-3',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "In which Qur\'anic verse does Allāh clearly prohibit ribā?",
      options: ['2:255', '2:275', '3:130 only', '4:29'],
      correctAnswer: '2:275',
      explanation: "Qur\'an 2:275 states: "Allāh has permitted trade and forbidden ribā (usury/interest)."",
    },
    {
      unitId: unit3.id,
      externalId: 'cb8-q3-4',
      type: 'TRUE_FALSE' as const,
      questionText: 'Maysir (gambling) is permitted if the winnings are donated to charity.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: "Maysir (gambling) is absolutely prohibited in Islam regardless of how winnings are used. Allāh prohibits it in Qur\'an 5:90.",
    },
    {
      unitId: unit3.id,
      externalId: 'cb8-q3-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Ribā al-Faḍl refers to:',
      options: ['Deferred payment interest', 'Unequal exchange of the same commodity', 'Gambling debts', 'Interest on mortgages'],
      correctAnswer: 'Unequal exchange of the same commodity',
      explanation: "Ribā al-faḍl is the exchange of the same commodity in unequal amounts (e.g., 1kg of dates for 2kg of dates). Ribā al-nasī\'ah is deferred payment interest.",
    },
    {
      unitId: unit3.id,
      externalId: 'cb8-q3-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Ijārah in Islamic finance refers to:',
      options: ['Profit-sharing', 'A hire or lease contract', 'Islamic insurance', 'Partnership investment'],
      correctAnswer: 'A hire or lease contract',
      explanation: 'Ijārah is a hire or lease contract where one party uses an asset owned by another in exchange for rental payments.',
    },

    // ---- Unit 4: Ahadith Worship ----
    {
      unitId: unit4.id,
      externalId: 'cb8-q4-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'According to the ḥadīth on the sweetness of Īmān, how many conditions are given?',
      options: ['Two', 'Three', 'Four', 'Five'],
      correctAnswer: 'Three',
      explanation: "The Prophet ﷺ listed three conditions: (1) Allāh and the Messenger are dearest to him, (2) he loves someone solely for Allāh\'s sake, (3) he hates returning to disbelief as he hates being thrown into fire.",
    },
    {
      unitId: unit4.id,
      externalId: 'cb8-q4-2',
      type: 'FILL_BLANK' as const,
      questionText: 'The ḥadīth states that true wealth is the ________ of the soul.',
      options: ['cleanliness', 'contentment', 'strength', 'beauty'],
      correctAnswer: 'contentment',
      explanation: "The Prophet ﷺ said: "Wealth is not in having many possessions, but wealth is the contentment of the soul (ghinā\' al-nafs)." (Bukhārī)",
    },
    {
      unitId: unit4.id,
      externalId: 'cb8-q4-3',
      type: 'TRUE_FALSE' as const,
      questionText: "Allāh descends to the lowest heaven during the last third of every night.",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "The Prophet ﷺ said: "Our Lord descends to the lowest heaven each night during the last third of the night, and says: Who is calling Me so I may answer? Who is asking Me so I may give?" (Bukhārī)",
    },
    {
      unitId: unit4.id,
      externalId: 'cb8-q4-4',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'What does the ḥadīth say about the reward of patience (ṣabr)?',
      options: ['It equals 10 good deeds', "Allāh sets no limit to its reward", "It is rewarded like a voluntary fast", 'It is only for those tested severely'],
      correctAnswer: "Allāh sets no limit to its reward",
      explanation: "Allāh says: "Indeed, the patient will be given their reward without account (without limit)." (Qur\'an 39:10)",
    },
    {
      unitId: unit4.id,
      externalId: 'cb8-q4-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The first condition for the sweetness of Īmān is:',
      options: ["Performing Ḥajj", "That Allāh and His Messenger are dearer to him than anything else", "Memorising the Qur\'an", 'Loving the poor'],
      correctAnswer: "That Allāh and His Messenger are dearer to him than anything else",
      explanation: "The Prophet ﷺ said: "There are three qualities that whoever has them, will find the sweetness of Īmān: that Allāh and His Messenger are dearer to him than anything else..." (Bukhārī)",
    },
    {
      unitId: unit4.id,
      externalId: 'cb8-q4-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'In the ḥadīth, to what does the person with the sweetness of Īmān compare returning to disbelief?',
      options: ['Eating poison', 'Being thrown into fire', 'Drowning in the sea', 'Losing all wealth'],
      correctAnswer: 'Being thrown into fire',
      explanation: 'The third condition is: "He hates to return to disbelief as he hates to be thrown into fire." (Bukhārī)',
    },

    // ---- Unit 5: Ahadith Character ----
    {
      unitId: unit5.id,
      externalId: 'cb8-q5-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The ḥadīth "Allāh does not look at your forms but your hearts and deeds" means:",
      options: ["Appearance is irrelevant in Islam", "Internal sincerity and deeds matter most to Allāh", "You must not care about how you look", "Physical beauty is a sin"],
      correctAnswer: "Internal sincerity and deeds matter most to Allāh",
      explanation: "Allāh judges by what is in the heart (intention, sincerity) and by what one actually does — not by wealth, beauty, or social status.",
    },
    {
      unitId: unit5.id,
      externalId: 'cb8-q5-2',
      type: 'FILL_BLANK' as const,
      questionText: 'The ḥadīth says ṣadaqah extinguishes sins like ________ extinguishes fire.',
      options: ['sand', 'water', 'wind', 'earth'],
      correctAnswer: 'water',
      explanation: "The Prophet ﷺ said: "Ṣadaqah extinguishes sins as water extinguishes fire." (Tirmidhī)",
    },
    {
      unitId: unit5.id,
      externalId: 'cb8-q5-3',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'How many rights of a Muslim over another Muslim are mentioned in the famous ḥadīth?',
      options: ['Four', 'Five', 'Six', 'Seven'],
      correctAnswer: 'Six',
      explanation: "The Prophet ﷺ enumerated six rights: (1) greet with salām, (2) accept invitations, (3) give naṣīḥah, (4) say yarḥamukallāh when someone sneezes, (5) visit the sick, (6) follow the janāzah.",
    },
    {
      unitId: unit5.id,
      externalId: 'cb8-q5-4',
      type: 'TRUE_FALSE' as const,
      questionText: 'The ḥadīth teaches that begging is better than working if you are poor.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'The Prophet ﷺ said it is better to take a rope, gather firewood, and sell it than to beg. Self-sufficiency is praised and begging without necessity is discouraged.',
    },
    {
      unitId: unit5.id,
      externalId: 'cb8-q5-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "When a Muslim sneezes and says "al-ḥamdulillāh", the correct response is:",
      options: ["SubhānAllāh", "Yarḥamukallāh", "Āmīn", "MāshāAllāh"],
      correctAnswer: "Yarḥamukallāh",
      explanation: "When a Muslim sneezes and praises Allāh, the one who hears should respond "yarḥamukallāh" (may Allāh have mercy on you).",
    },
    {
      unitId: unit5.id,
      externalId: 'cb8-q5-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'The ḥadīth about spreading salām widely refers to spreading it:',
      options: ['Only to those you know well', 'To both people you know and strangers', 'Only to the elderly', 'Only in the mosque'],
      correctAnswer: 'To both people you know and strangers',
      explanation: "The Prophet ﷺ commanded spreading salām widely — to those you know AND those you do not know — as a means of spreading love and goodwill.",
    },

    // ---- Unit 6: Shamail ----
    {
      unitId: unit6.id,
      externalId: 'cb8-q6-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The word "shamā\'il" refers to:",
      options: ["The biography of the Prophet ﷺ", "The noble characteristics (physical and moral) of the Prophet ﷺ", "The battles of the Prophet ﷺ", "The Companions of the Prophet ﷺ"],
      correctAnswer: "The noble characteristics (physical and moral) of the Prophet ﷺ",
      explanation: "Shamā\'il refers to the noble qualities, description, manners, and characteristics of the Prophet Muḥammad ﷺ.",
    },
    {
      unitId: unit6.id,
      externalId: 'cb8-q6-2',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Which miracle of the Prophet ﷺ is confirmed directly in the Qur\'an?",
      options: ['Feeding multitudes', 'Water from his fingers', 'The splitting of the moon', 'The speaking of animals'],
      correctAnswer: 'The splitting of the moon',
      explanation: "The Qur\'an states: "The Hour has drawn near and the moon has split." (54:1) — This refers to the miracle of the splitting of the moon.",
    },
    {
      unitId: unit6.id,
      externalId: 'cb8-q6-3',
      type: 'FILL_BLANK' as const,
      questionText: "The Prophet\'s ﷺ mission lasted approximately ________ years.",
      options: ['10 years', '15 years', '20 years', '23 years'],
      correctAnswer: '23 years',
      explanation: 'The Prophet ﷺ received revelation for approximately 23 years: 13 years in Makkah and 10 years in Madīnah.',
    },
    {
      unitId: unit6.id,
      externalId: 'cb8-q6-4',
      type: 'TRUE_FALSE' as const,
      questionText: "The miracle of water flowing from the Prophet\'s ﷺ fingers at Ḥudaybiyah is recorded in the books of ḥadīth.",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "The miracle of water flowing from between the Prophet\'s fingers at Ḥudaybiyah is authentically recorded in Bukhārī.",
    },
    {
      unitId: unit6.id,
      externalId: 'cb8-q6-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Who compiled the famous collection "Al-Shamā\'il al-Muḥammadiyyah"?",
      options: ["Imām Bukhārī", "Imām Tirmidhī", "Imām Muslim", "Imām Abū Dāwūd"],
      correctAnswer: "Imām Tirmidhī",
      explanation: "Imām Tirmidhī compiled the famous collection "Al-Shamā\'il al-Muḥammadiyyah" which describes the physical and moral characteristics of the Prophet ﷺ.",
    },
    {
      unitId: unit6.id,
      externalId: 'cb8-q6-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: 'Which of the following was NOT a transformation the Prophet ﷺ brought?',
      options: ['Abolishing idol worship', 'Ending female infanticide', 'Establishing the Roman Empire', 'Uniting Arab tribes'],
      correctAnswer: 'Establishing the Roman Empire',
      explanation: "The Prophet\'s mission transformed Arabia by ending idol worship, stopping female infanticide, establishing justice, and uniting tribes — not establishing the Roman Empire.",
    },

    // ---- Unit 7: Uthman ----
    {
      unitId: unit7.id,
      externalId: 'cb8-q7-1',
      type: 'FILL_BLANK' as const,
      questionText: "\'Uthmān is called Dhū al-Nūrayn because he married two ________ of the Prophet ﷺ.",
      options: ['sisters', 'daughters', 'aunts', 'cousins'],
      correctAnswer: 'daughters',
      explanation: "\'Uthmān married the Prophet\'s daughters Ruqayyah and (after her death) Umm Kulthūm, earning the title "Dhū al-Nūrayn" (He of the Two Lights).",
    },
    {
      unitId: unit7.id,
      externalId: 'cb8-q7-2',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "\'Uthmān\'s greatest achievement for the Muslim ummah was:",
      options: ["Conquering Persia", "Standardising and preserving the Qur\'an in one written form", 'Building the first mosque', 'Introducing the Islamic calendar'],
      correctAnswer: "Standardising and preserving the Qur\'an in one written form",
      explanation: "\'Uthmān commissioned a standardised copy (Muṣḥaf \'Uthmānī) to unify Qur\'anic recitation across the expanding Muslim world.",
    },
    {
      unitId: unit7.id,
      externalId: 'cb8-q7-3',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "\'Uthmān bought the Well of Rūmah and donated it to:",
      options: ['The poor only', 'His tribe', 'All Muslims for free use', 'The mosque treasury'],
      correctAnswer: 'All Muslims for free use',
      explanation: "\'Uthmān purchased the well of Rūmah from a Jewish owner and made it freely available to all Muslims.",
    },
    {
      unitId: unit7.id,
      externalId: 'cb8-q7-4',
      type: 'TRUE_FALSE' as const,
      questionText: "\'Uthmān was martyred while he was reading the Qur\'an.",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "\'Uthmān was killed by rebels while reading the Qur\'an in his home, on the 18th of Dhūl Ḥijjah 35 AH.",
    },
    {
      unitId: unit7.id,
      externalId: 'cb8-q7-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The scholar who warned \'Uthmān about Qur\'anic dialect disputes was:",
      options: ["Zayd ibn Thābit", "Ibn Mas\'ūd", "Ḥudhayfah ibn al-Yamān", "Abū Hurayrah"],
      correctAnswer: "Ḥudhayfah ibn al-Yamān",
      explanation: "Ḥudhayfah ibn al-Yamān rushed to \'Uthmān alarmed by disputes about Qur\'anic recitation, urging standardisation.",
    },
    {
      unitId: unit7.id,
      externalId: 'cb8-q7-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "During which period did \'Uthmān\'s caliphate take place?",
      options: ['622–634 CE', '634–644 CE', '644–656 CE', '656–661 CE'],
      correctAnswer: '644–656 CE',
      explanation: "\'Uthmān ibn \'Affān was the third Caliph, reigning from 644 to 656 CE.",
    },

    // ---- Unit 8: Ali ----
    {
      unitId: unit8.id,
      externalId: 'cb8-q8-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "At approximately what age did \'Alī accept Islam?",
      options: ['Age 5', 'Age 10', 'Age 15', 'Age 20'],
      correctAnswer: 'Age 10',
      explanation: "\'Alī ibn Abī Ṭālib accepted Islam at approximately age 10, making him the first youth to embrace the faith.",
    },
    {
      unitId: unit8.id,
      externalId: 'cb8-q8-2',
      type: 'FILL_BLANK' as const,
      questionText: "\'Alī is given the title "Karram Allāhu wajhah" because his face never ________ to an idol.",
      options: ['smiled', 'bowed', 'prostrated', 'turned'],
      correctAnswer: 'prostrated',
      explanation: "\'Alī never prostrated to an idol — he accepted Islam so young that he never committed shirk.",
    },
    {
      unitId: unit8.id,
      externalId: 'cb8-q8-3',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The Prophet ﷺ said: "I am the city of knowledge and \'Alī is its ___."",
      options: ['scholar', 'gate', 'foundation', 'guardian'],
      correctAnswer: 'gate',
      explanation: "The Prophet ﷺ said: "I am the city of knowledge and \'Alī is its gate." This highlights \'Alī\'s unique depth of Islamic scholarship.",
    },
    {
      unitId: unit8.id,
      externalId: 'cb8-q8-4',
      type: 'TRUE_FALSE' as const,
      questionText: "\'Alī was the fourth and final Rightly Guided Caliph (Khalīfah Rāshid).",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "\'Alī ibn Abī Ṭālib was the fourth of the Rightly Guided Caliphs (Khulafā\' Rāshidūn), ruling from 656 to 661 CE.",
    },
    {
      unitId: unit8.id,
      externalId: 'cb8-q8-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "At which battle did \'Alī kill the famous warrior \'Amr ibn \'Abd Wudd?",
      options: ['Battle of Badr', 'Battle of Uḥud', 'Battle of Khandaq', 'Battle of Khaybar'],
      correctAnswer: 'Battle of Khandaq',
      explanation: "At the Battle of Khandaq (the Trench), \'Alī killed \'Amr ibn \'Abd Wudd in single combat, a decisive moment that raised Muslim morale.",
    },
    {
      unitId: unit8.id,
      externalId: 'cb8-q8-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "\'Alī was martyred in which city?",
      options: ["Madīnah", 'Damascus', "Kūfah", 'Makkah'],
      correctAnswer: "Kūfah",
      explanation: "\'Alī was struck with a poisoned sword in the mosque of Kūfah while going for Fajr prayer, and passed away in 40 AH.",
    },

    // ---- Unit 9: Ayyub ----
    {
      unitId: unit9.id,
      externalId: 'cb8-q9-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "How long was Prophet Ayyūb afflicted with illness according to the narration?",
      options: ['3 years', '7 years', '18 years', '40 years'],
      correctAnswer: '18 years',
      explanation: "According to Islamic tradition, Prophet Ayyūb was afflicted with a severe skin disease for 18 years.",
    },
    {
      unitId: unit9.id,
      externalId: 'cb8-q9-2',
      type: 'FILL_BLANK' as const,
      questionText: "Ayyūb\'s du\'a\' ends with "wa anta arḥamu ________ " (You are the Most Merciful of the merciful).",
      options: ["al-\'ābidīn", "al-rāḥimīn", "al-ṣābirīn", "al-sālikin"],
      correctAnswer: "al-rāḥimīn",
      explanation: "Ayyūb\'s Qur\'anic du\'a\' (21:83): "Innī massaniya al-ḏurru wa anta arḥamu al-rāḥimīn."",
    },
    {
      unitId: unit9.id,
      externalId: 'cb8-q9-3',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "In Qur\'an 21:84, Allāh\'s response to Ayyūb included restoring his family:",
      options: ['In the same number as before', 'One third of what he had before', 'Along with a like thereof (doubled)', 'Only if he asked again'],
      correctAnswer: 'Along with a like thereof (doubled)',
      explanation: "Allāh says He restored Ayyūb\'s family "and the like thereof along with them" — his blessings were doubled after his trial.",
    },
    {
      unitId: unit9.id,
      externalId: 'cb8-q9-4',
      type: 'TRUE_FALSE' as const,
      questionText: "Prophet Ayyūb complained frequently to Allāh during his illness.",
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: "Despite 18 years of severe illness, Ayyūb never complained. His du\'a\' was a humble acknowledgement, not a complaint.",
    },
    {
      unitId: unit9.id,
      externalId: 'cb8-q9-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The Qur\'anic du\'a\' of Ayyūb appears in which Surah?",
      options: ["Surah Yūsuf", "Surah al-Kahf", "Surah al-Anbiyā\'", "Surah Sād"],
      correctAnswer: "Surah al-Anbiyā\'",
      explanation: "Ayyūb\'s du\'a\' appears in Surah al-Anbiyā\' (21:83) and is also referenced in Surah Sād (38:41–44).",
    },
    {
      unitId: unit9.id,
      externalId: 'cb8-q9-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Who remained with Ayyūb throughout his illness when others abandoned him?",
      options: ['His son', 'His brother', 'His wife', 'A neighbour'],
      correctAnswer: 'His wife',
      explanation: "Ayyūb\'s wife served him devotedly throughout his 18 years of illness, showing remarkable loyalty and patience.",
    },

    // ---- Unit 10: Andalusia & Crusades ----
    {
      unitId: unit10.id,
      externalId: 'cb8-q10-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Who led the Muslim conquest of Andalusia in 711 CE?",
      options: ["Mūsā ibn Nuṣayr", "Ṭāriq ibn Ziyād", "\'Abd al-Raḥmān I", "Sulaymān the Magnificent"],
      correctAnswer: "Ṭāriq ibn Ziyād",
      explanation: "Ṭāriq ibn Ziyād crossed from North Africa with 7,000 troops in 711 CE, landing at the mountain now called Gibraltar (Jabal Ṭāriq).",
    },
    {
      unitId: unit10.id,
      externalId: 'cb8-q10-2',
      type: 'FILL_BLANK' as const,
      questionText: "Islamic Andalusia reached its Golden Age under the Umayyad Caliph \'Abd al-Raḥmān ________ .",
      options: ['I', 'II', 'III', 'IV'],
      correctAnswer: 'III',
      explanation: "\'Abd al-Raḥmān III (912–961 CE) led Andalusia to its peak, with Córdoba becoming the greatest city in Europe.",
    },
    {
      unitId: unit10.id,
      externalId: 'cb8-q10-3',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Which Muslim scholar of Andalusia was known as "Averroes" and preserved Greek philosophy?",
      options: ["Ibn Ḥazm", "Ibn Rushd", "Ibn Ḥayyiyān", "Al-Zarqālī"],
      correctAnswer: "Ibn Rushd",
      explanation: "Ibn Rushd (Averroes, 1126–1198 CE) wrote extensive commentaries on Aristotle that were translated into Latin, helping to spark the European Renaissance.",
    },
    {
      unitId: unit10.id,
      externalId: 'cb8-q10-4',
      type: 'TRUE_FALSE' as const,
      questionText: "Ṣalāḥuddīn al-Ayyūbī reconquered Jerusalem in 1187 CE without a massacre.",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "Ṣalāḥuddīn retook Jerusalem on 2 October 1187 and guaranteed the safety of Christian inhabitants, in striking contrast to the 1099 Crusader conquest.",
    },
    {
      unitId: unit10.id,
      externalId: 'cb8-q10-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The First Crusade was called by:",
      options: ["Emperor Frederick I", "Pope Urban II", "King Richard I", "Pope Gregory VII"],
      correctAnswer: "Pope Urban II",
      explanation: "In 1095, Pope Urban II called the First Crusade at the Council of Clermont, urging European Christians to recapture Jerusalem.",
    },
    {
      unitId: unit10.id,
      externalId: 'cb8-q10-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Córdoba during the Islamic Golden Age had approximately how many public libraries?",
      options: ['5', '20', '70', '200'],
      correctAnswer: '70',
      explanation: "At its peak, Córdoba had approximately 70 public libraries, when most of Europe\'s monasteries had only a handful of manuscripts.",
    },

    // ---- Unit 11: Ottomans ----
    {
      unitId: unit11.id,
      externalId: 'cb8-q11-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Sultan Muḥammad al-Fātiḥ conquered Constantinople at what age?",
      options: ['Age 18', 'Age 21', 'Age 25', 'Age 30'],
      correctAnswer: 'Age 21',
      explanation: "Sultan Muḥammad ibn Murād (al-Fātiḥ) conquered Constantinople in 1453 CE at the age of 21, fulfilling the Prophet\'s ﷺ prophecy.",
    },
    {
      unitId: unit11.id,
      externalId: 'cb8-q11-2',
      type: 'FILL_BLANK' as const,
      questionText: "The Ottoman caliphate was abolished in ________ by Mustafa Kemal.",
      options: ['1908', '1918', '1924', '1930'],
      correctAnswer: '1924',
      explanation: "Mustafa Kemal (Atatürk) abolished the Ottoman Caliphate in 1924, ending over a thousand years of continuous Islamic caliphate.",
    },
    {
      unitId: unit11.id,
      externalId: 'cb8-q11-3',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The Prophet ﷺ said the one who conquers Constantinople would be:",
      options: ["A king from the Arabs", "An excellent commander with an excellent army", "The Mahdi", "A Turkish sultan named Sulayman"],
      correctAnswer: "An excellent commander with an excellent army",
      explanation: "The Prophet ﷺ said: "Verily you will conquer Constantinople. What an excellent commander will its commander be, and what an excellent army will that army be." (Aḥmad)",
    },
    {
      unitId: unit11.id,
      externalId: 'cb8-q11-4',
      type: 'TRUE_FALSE' as const,
      questionText: "Muḥammad al-Fātiḥ had ships transported overland to bypass the sea chain blocking the harbour.",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "In a remarkable military innovation, al-Fātiḥ had 70 ships dragged over greased logs across land into the Golden Horn, surprising the defenders.",
    },
    {
      unitId: unit11.id,
      externalId: 'cb8-q11-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Sulaymān the Magnificent was known as "Qānūnī" (the Lawgiver) because:",
      options: ["He introduced Islamic law for the first time", "He implemented comprehensive legal reforms", "He ended all warfare", "He built the most mosques"],
      correctAnswer: "He implemented comprehensive legal reforms",
      explanation: "Sulaymān I is called "Qānūnī" by Muslims for his extensive legal reforms that systematised the Ottoman legal code.",
    },
    {
      unitId: unit11.id,
      externalId: 'cb8-q11-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "After entering Constantinople, what was the first act of Muḥammad al-Fātiḥ?",
      options: ["He declared a public holiday", "He went to Hagia Sophia (Aya Sofya) and prayed", "He rebuilt the city walls", "He returned to Istanbul immediately"],
      correctAnswer: "He went to Hagia Sophia (Aya Sofya) and prayed",
      explanation: "Upon entering Constantinople, Muḥammad al-Fātiḥ went to the great church of Hagia Sophia and prayed there in gratitude to Allāh.",
    },

    // ---- Unit 12: Attributes ----
    {
      unitId: unit12.id,
      externalId: 'cb8-q12-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: ""Qidam" as an attribute of Allāh means:",
      options: ["Allāh is all-powerful", "Allāh has no beginning", "Allāh is self-sufficient", "Allāh is unlike His creation"],
      correctAnswer: "Allāh has no beginning",
      explanation: "Qidam means pre-eternity — Allāh always was, with no beginning. His existence is not caused by anything.",
    },
    {
      unitId: unit12.id,
      externalId: 'cb8-q12-2',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: ""Mukhālafah lil-ḥawādith" means:",
      options: ["Allāh resembles His creation", "Allāh does not resemble any created thing", "Allāh created everything", "Allāh has no attributes"],
      correctAnswer: "Allāh does not resemble any created thing",
      explanation: "Mukhālafah lil-ḥawādith means distinctness from creation — Allāh is utterly unlike anything He created. (Qur\'an 42:11)",
    },
    {
      unitId: unit12.id,
      externalId: 'cb8-q12-3',
      type: 'FILL_BLANK' as const,
      questionText: "The Ahl al-Sunnah affirm Allāh\'s attribute of istiwā\' "bilā kayf", meaning without specifying ________ .",
      options: ['the time', 'the manner', 'the reason', 'the place'],
      correctAnswer: 'the manner',
      explanation: ""Bilā kayf" means "without (specifying) how" — we affirm the attribute as stated in the Qur\'an without asking how or imagining a physical form.",
    },
    {
      unitId: unit12.id,
      externalId: 'cb8-q12-4',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "How many essential (ṣifāt dhātiyyah) attributes of Allāh are typically listed?",
      options: ['Three', 'Five', 'Six', 'Nine'],
      correctAnswer: 'Six',
      explanation: "The six essential attributes are: wujūd, qidam, baqā\', qiyām binafsih, waḥdāniyyah, mukhālafah lil-ḥawādith.",
    },
    {
      unitId: unit12.id,
      externalId: 'cb8-q12-5',
      type: 'TRUE_FALSE' as const,
      questionText: "Imām Mālik said that asking "how" about Allāh\'s istiwā\' is a bid\'ah (innovation).",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "Imām Mālik famously said: "The istiwā\' is known, the manner is unknown, believing in it is obligatory, and asking about it is a bid\'ah."",
    },
    {
      unitId: unit12.id,
      externalId: 'cb8-q12-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: ""Baqā\'" as an attribute of Allāh refers to His:",
      options: ["Omnipotence", "Everlastingness (no end)", "Speech", "Oneness"],
      correctAnswer: "Everlastingness (no end)",
      explanation: "Baqā\' means everlastingness — Allāh has no end. He always will exist. This complements qidam (no beginning).",
    },

    // ---- Unit 13: Iman & Ulama ----
    {
      unitId: unit13.id,
      externalId: 'cb8-q13-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Which is the correct three-component definition of Īmān?",
      options: [
        "Prayer, fasting, zakāh",
        "Taṣdīq (inner belief), iqrār (verbal acknowledgement), \'amal (action)",
        "Knowledge, intention, implementation",
        "Tawbah, ṣalāh, du\'a\'",
      ],
      correctAnswer: "Taṣdīq (inner belief), iqrār (verbal acknowledgement), \'amal (action)",
      explanation: "Ahl al-Sunnah defines Īmān as: taṣdīq with the heart, iqrār with the tongue, and \'amal with the limbs.",
    },
    {
      unitId: unit13.id,
      externalId: 'cb8-q13-2',
      type: 'FILL_BLANK' as const,
      questionText: "Allāh commands in Qur\'an 16:43: "Ask the people of ________ if you do not know."",
      options: ['wealth', 'knowledge', 'authority', 'family'],
      correctAnswer: 'knowledge',
      explanation: "Qur\'an 16:43: "Fas\'ālū ahla al-dhikr in kuntum lā ta\'lamūn" — Ask the people of knowledge if you do not know.",
    },
    {
      unitId: unit13.id,
      externalId: 'cb8-q13-3',
      type: 'TRUE_FALSE' as const,
      questionText: "According to some schools, Īmān can increase with obedience and decrease with disobedience.",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "The Qur\'an states "it increases them in faith" (8:2), supporting the view that Īmān fluctuates with deeds.",
    },
    {
      unitId: unit13.id,
      externalId: 'cb8-q13-4',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Which is a red flag for an unreliable religious opinion-giver?",
      options: ["They studied for 20 years at a traditional institution", "They can cite Qur\'an and ḥadīth references", "They dismiss 1,400 years of scholarship as outdated", "They consult with other scholars"],
      correctAnswer: "They dismiss 1,400 years of scholarship as outdated",
      explanation: "Dismissing established scholarly tradition without credible alternative evidence is a sign of shallow scholarship.",
    },
    {
      unitId: unit13.id,
      externalId: 'cb8-q13-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The term "taṣdīq" in the definition of Īmān refers to:",
      options: ["Verbal declaration of the Sharīdah", "Sincere inner belief in the heart", "Performance of ṣalāh", "Reading the Qur\'an"],
      correctAnswer: "Sincere inner belief in the heart",
      explanation: "Taṣdīq literally means "to affirm as true" — it is the sincere conviction and belief that resides in the heart.",
    },
    {
      unitId: unit13.id,
      externalId: 'cb8-q13-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The Prophet ﷺ warned that when ignorant leaders replace scholars, they will:",
      options: ["Strengthen the ummah", "Give fatāwā without knowledge, going astray and leading others astray", "Bring a new prophet", "Build more mosques"],
      correctAnswer: "Give fatāwā without knowledge, going astray and leading others astray",
      explanation: "This ḥadīth (Bukhārī and Muslim) warns of the danger of religious ignorance and unqualified leadership.",
    },

    // ---- Unit 14: Taqwa, Tawakkul, Tawbah ----
    {
      unitId: unit14.id,
      externalId: 'cb8-q14-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The literal meaning of taqwā is:",
      options: ['Worship', 'A shield', 'Knowledge', 'Patience'],
      correctAnswer: 'A shield',
      explanation: "Taqwā literally means a shield — a shield between you and what you fear from Allāh\'s displeasure.",
    },
    {
      unitId: unit14.id,
      externalId: 'cb8-q14-2',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The ḥadīth about the camel teaches that tawakkul means:",
      options: ["Leave everything to Allāh without effort", "Take all available means, then trust Allāh with the outcome", "Pray constantly and do no work", "Trust your own abilities first"],
      correctAnswer: "Take all available means, then trust Allāh with the outcome",
      explanation: "The Prophet ﷺ told the man: "Tie it (your camel), then trust in Allāh." — Take precautions and effort, then trust the outcome to Allāh.",
    },
    {
      unitId: unit14.id,
      externalId: 'cb8-q14-3',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "How many conditions are required for a valid tawbah when the sin is against Allāh only?",
      options: ['One', 'Two', 'Three', 'Four'],
      correctAnswer: 'Three',
      explanation: "When the sin is between you and Allāh, three conditions apply: nadam (regret), stop the sin, resolve not to return.",
    },
    {
      unitId: unit14.id,
      externalId: 'cb8-q14-4',
      type: 'FILL_BLANK' as const,
      questionText: "The first condition of valid tawbah is ________ (sincere regret for the sin).",
      options: ["iqrār", "nadam", "ṣabr", "zuhd"],
      correctAnswer: "nadam",
      explanation: "Nadam means sincere regret — genuinely feeling sorry for the sin because it displeased Allāh.",
    },
    {
      unitId: unit14.id,
      externalId: 'cb8-q14-5',
      type: 'TRUE_FALSE' as const,
      questionText: "Allāh\'s door of tawbah remains open with no exceptions until Judgement Day.",
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: "The door of tawbah closes at two points: at the moment of death, and when the sun rises from the west.",
    },
    {
      unitId: unit14.id,
      externalId: 'cb8-q14-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "When a sin involves wronging another person, what additional condition applies to tawbah?",
      options: ["Pray 100 rak\'at", "Restore the right and/or seek forgiveness from the wronged person", "Fast for 10 days", "Give ṣadaqah equal to the harm caused"],
      correctAnswer: "Restore the right and/or seek forgiveness from the wronged person",
      explanation: "When the sin involves another person (theft, backbiting), the fourth condition is to return what was taken and/or seek forgiveness from the person wronged.",
    },

    // ---- Unit 15: Adab Final ----
    {
      unitId: unit15.id,
      externalId: 'cb8-q15-1',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "In which Qur\'anic verses does Allāh command both men and women to lower their gaze?",
      options: ['24:30–31', '33:53–59', '4:34–35', '2:187–188'],
      correctAnswer: '24:30–31',
      explanation: "Qur\'an 24:30 addresses believing men and 24:31 addresses believing women — both are commanded to lower their gaze and guard their chastity.",
    },
    {
      unitId: unit15.id,
      externalId: 'cb8-q15-2',
      type: 'FILL_BLANK' as const,
      questionText: "The Prophet ﷺ said: "Whoever cheats us is ________ of us."",
      options: ['the best', 'part', 'not', 'the leader'],
      correctAnswer: 'not',
      explanation: ""Man ghashshanā falaysa minnā" — Whoever cheats us is not from us. (Muslim)",
    },
    {
      unitId: unit15.id,
      externalId: 'cb8-q15-3',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "Imām al-Shāfi\'ī said about debate: "I never debated anyone except hoping Allāh would place the truth on:",
      options: ['my tongue', 'his tongue', "the moderator\'s tongue", 'both our tongues'],
      correctAnswer: 'his tongue',
      explanation: "Imām al-Shāfi\'ī said he hoped Allāh would place the truth on his opponent\'s tongue — showing the goal of debate is truth, not personal victory.",
    },
    {
      unitId: unit15.id,
      externalId: 'cb8-q15-4',
      type: 'TRUE_FALSE' as const,
      questionText: "The walīmah (wedding feast) is a sunnah that the Prophet ﷺ encouraged.",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "The Prophet ﷺ said: "Have a walīmah even with a single sheep." — It is a confirmed sunnah to celebrate a marriage with a meal.",
    },
    {
      unitId: unit15.id,
      externalId: 'cb8-q15-5',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "The Prophet ﷺ described the unlawful gaze as:",
      options: ['A minor sin only', 'The adultery of the eyes', 'A type of kufr', 'A sin only for men'],
      correctAnswer: 'The adultery of the eyes',
      explanation: "The Prophet ﷺ said the eyes commit zinā (adultery) and their zinā is the unlawful gaze. This applies to both men and women.",
    },
    {
      unitId: unit15.id,
      externalId: 'cb8-q15-6',
      type: 'MULTIPLE_CHOICE' as const,
      questionText: "In Islamic debate etiquette, when should you concede?",
      options: ["Never — always defend your position", "Only when you have more evidence", "When the other person makes a valid argument", "Only after the debate ends"],
      correctAnswer: "When the other person makes a valid argument",
      explanation: "Intellectual honesty requires acknowledging valid arguments. Conceding when wrong is a sign of strength and sincerity.",
    },
  ];

  for (const q of allQuestions) {
    await prisma.question.upsert({
      where: { externalId: q.externalId },
      create: {
        unitId: q.unitId,
        externalId: q.externalId,
        type: q.type,
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
      update: {
        unitId: q.unitId,
        type: q.type,
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      },
    });
  }
  console.log(`✅ Upserted ${allQuestions.length} questions`);

  // =============================================
  // FLASHCARDS (25 total)
  // =============================================

  await prisma.flashCard.deleteMany({ where: { courseId: course.id } });

  const flashcardData = [
    { front: 'Tahájjud', back: 'Voluntary night prayer in the last third of the night; minimum 2 rak\'at. Among the most virtuous nawāfil.' },
    { front: 'Khushū\'', back: 'Humility and full presence of heart during prayer. Developed by knowing the meanings of words, minimising distractions, and imagining it is one\'s last prayer.' },
    { front: 'Mahr', back: 'The mandatory gift (money or property) given exclusively to the bride by the groom as a condition of valid nikāḥ.' },
    { front: '\'Iddah', back: 'The mandatory waiting period after divorce or widowhood before a woman may remarry. Protects lineage and allows for reconciliation.' },
    { front: 'Ribā', back: 'Interest or usury: any predetermined additional amount on a loan. Prohibited in Qur\'an 2:275. Two types: ribā al-faḍl and ribā al-nasī\'ah.' },
    { front: 'Maysir', back: 'Gambling: wagering something of value on an uncertain outcome. Prohibited in Qur\'an 5:90 alongside alcohol.' },
    { front: 'Ijārah', back: 'An Islamic hire or lease contract where one party uses an asset owned by another in exchange for agreed rental payments.' },
    { front: 'Shamā\'il', back: 'The noble physical and moral characteristics of the Prophet Muḥammad ﷺ. Imām Tirmidhī compiled a famous collection of them.' },
    { front: 'Dhū al-Nūrayn', back: "\'He of the Two Lights\' — title of \'Uthmān ibn \'Affān, who married two daughters of the Prophet ﷺ: Ruqayyah and Umm Kulthūm." },
    { front: 'Muṣḥaf \'Uthmānī', back: 'The standardised written copy of the Qur\'an commissioned by \'Uthmān to unify all variant dialect copies. The basis of all Qur\'anic texts today.' },
    { front: 'Karram Allāhu wajhah', back: 'Title of \'Alī ibn Abī Ṭālib: "May Allāh honour his face" — because he never prostrated to an idol, having grown up in the Prophet\'s household.' },
    { front: 'Fatḥ al-QuṣṬantiniyyah', back: 'The Conquest of Constantinople (1453 CE) by Sultan Muḥammad al-Fātiḥ at age 21, fulfilling the Prophet\'s ﷺ prophecy about the city and its commander.' },
    { front: 'Qidam', back: 'An essential attribute of Allāh: pre-eternity / having no beginning. Allāh always was, without a starting point.' },
    { front: 'Baqā\'', back: 'An essential attribute of Allāh: everlastingness / having no end. Allāh always will be.' },
    { front: 'Qiyām binafsih', back: 'An essential attribute of Allāh: self-subsistence. Allāh depends on nothing and no one; everything depends on Him.' },
    { front: 'Mukhālafah lil-ḥawādith', back: "Allāh\'s distinctness from creation: He does not resemble anything He created. "There is nothing like Him." (Qur\'an 42:11)" },
    { front: 'Istiwā\' / Bilā kayf', back: "Allāh\'s attribute of rising over the Throne. Ahl al-Sunnah affirm it as stated in Qur\'an 20:5 but without specifying the manner (bilā kayf)." },
    { front: 'Taṣdīq', back: "The first component of Īmān: sincere inner belief in the heart. Believing Allāh, His angels, books, messengers, Last Day, and divine decree." },
    { front: 'Nadam', back: 'The first condition of tawbah: sincere regret for the sin — feeling genuinely sorry because it displeased Allāh, not merely for its consequences.' },
    { front: 'Tawakkul', back: "Reliance on Allāh AFTER taking all available means. Not fatalism. The Prophet\'s ﷺ teaching: "Tie your camel, then trust in Allāh." (Tirmidhī)" },
    { front: 'Taqwā', back: "Literally "a shield" — shielding oneself from Allāh\'s displeasure. Three levels: avoiding ḥarām, avoiding makrūh, and avoiding everything that distracts from Allāh." },
    { front: "Ṣalāḥuddīn al-Ayyūbī", back: 'Muslim Kurdish leader (1137–1193 CE) who united the Muslim world and reconquered Jerusalem (1187) without massacre. Known for justice, generosity, and nobility.' },
    { front: 'Waliīmah', back: "The post-nikāḥ wedding feast. A confirmed sunnah. The Prophet ﷺ said: "Have a walīmah even with a single sheep." Attending when invited is a right of the Muslim." },
    { front: "Ḥifẓ al-Baṣar", back: 'Lowering/guarding the gaze. Commanded for both men and women in Qur\'an 24:30–31. The Prophet ﷺ called the unlawful gaze "the adultery of the eyes."' },
    { front: "Innī massaniya al-ḏurru", back: "Ayyūb\'s Qur\'anic du\'a\': "Indeed adversity has touched me, and You are the Most Merciful of the merciful." (21:83) — Model supplication in times of trial." },
  ];

  for (let i = 0; i < flashcardData.length; i++) {
    const fc = flashcardData[i];
    await prisma.flashCard.create({
      data: {
        courseId: course.id,
        front: fc.front,
        back: fc.back,
        category: 'Vocabulary',
        tags: ['maktab-8'],
        orderIndex: i,
      },
    });
  }
  console.log(`✅ Created ${flashcardData.length} flashcards`);

  // =============================================
  // ARABIC TERMS (18 total)
  // =============================================

  await prisma.arabicTerm.deleteMany({ where: { courseId: course.id } });

  const arabicTermsData = [
    { arabicText: 'الخشوع', transliteration: 'al-khushū\'', translation: 'Humility and full presence of heart before Allāh in prayer' },
    { arabicText: 'المهر', transliteration: 'al-mahr', translation: 'The mandatory gift given by the groom to the bride in nikāḥ' },
    { arabicText: 'العدة', transliteration: 'al-\'iddah', translation: 'The waiting period after divorce or widowhood' },
    { arabicText: 'الربا', transliteration: 'al-ribā', translation: 'Interest or usury, prohibited in Qur\'an 2:275' },
    { arabicText: 'الميسر', transliteration: 'al-maysir', translation: 'Gambling, prohibited in Qur\'an 5:90' },
    { arabicText: 'الشمائل', transliteration: 'al-shamā\'il', translation: 'The noble physical and moral characteristics of the Prophet ﷺ' },
    { arabicText: 'ذو النورين', transliteration: 'Dhū al-Nūrayn', translation: 'He of the Two Lights — title of \'Uthmān ibn \'Affān' },
    { arabicText: 'الاستواء', transliteration: 'al-istiwā\'', translation: "Allāh\'s rising/ascending over the Throne, affirmed without specifying how (bilā kayf)" },
    { arabicText: 'القدم', transliteration: 'al-qidam', translation: 'Pre-eternity — Allāh has no beginning' },
    { arabicText: 'البقاء', transliteration: 'al-baqā\'', translation: 'Everlastingness — Allāh has no end' },
    { arabicText: 'التصديق', transliteration: 'al-taṣdīq', translation: 'Sincere inner belief — the first component of Īmān' },
    { arabicText: 'الندم', transliteration: 'al-nadam', translation: 'Sincere regret — the first condition of valid tawbah' },
    { arabicText: 'التوكل', transliteration: 'al-tawakkul', translation: 'Trust and reliance on Allāh after taking available means' },
    { arabicText: 'التقوى', transliteration: 'al-taqwā', translation: 'Fear/consciousness of Allāh; a shield between oneself and His displeasure' },
    { arabicText: 'التوبة', transliteration: 'al-tawbah', translation: 'Repentance — returning to Allāh; requires nadam, stopping the sin, and resolve not to return' },
    { arabicText: 'الوليمة', transliteration: 'al-walīmah', translation: 'The post-nikāḥ wedding feast; a confirmed sunnah' },
    { arabicText: 'حفظ البصر', transliteration: 'ḥifẓ al-baṣar', translation: 'Lowering and guarding the gaze; commanded for both men and women in Qur\'an 24:30–31' },
    { arabicText: 'صلاة الجماعة', transliteration: 'ṣalāt al-jamā\'ah', translation: 'Congregational prayer, rewarded 27 times more than praying alone' },
  ];

  for (const t of arabicTermsData) {
    await prisma.arabicTerm.create({
      data: {
        courseId: course.id,
        arabicText: t.arabicText,
        transliteration: t.transliteration,
        translation: t.translation,
      },
    });
  }
  console.log(`✅ Created ${arabicTermsData.length} Arabic terms`);

  // =============================================
  // SUMMARY
  // =============================================

  const unitCount = await prisma.unit.count({ where: { courseId: course.id } });
  const questionCount = await prisma.question.count({
    where: { unit: { courseId: course.id } },
  });
  const flashcardCount = await prisma.flashCard.count({ where: { courseId: course.id } });
  const arabicTermCount = await prisma.arabicTerm.count({ where: { courseId: course.id } });

  console.log('\n=== Maktab Coursebook 8 Seed Complete ===');
  console.log(`Units:        ${unitCount}`);
  console.log(`Questions:    ${questionCount}`);
  console.log(`Flashcards:   ${flashcardCount}`);
  console.log(`Arabic Terms: ${arabicTermCount}`);
  console.log('=========================================\n');
}

// ──────────────────────────────────────────────
// Standalone execution
// ──────────────────────────────────────────────
async function main() {
  try {
    await seedMaktabCoursebook8();
    console.log('');
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Maktab Coursebook 8:', error);
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
