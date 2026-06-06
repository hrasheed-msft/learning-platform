import { FlashCardDifficulty, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MASAAR_COURSE_ID = 'a1b2c3d4-e5f6-4890-abcd-ef1234567001';

type CardTemplate = {
  front: string;
  back: string;
  frontArabic?: string;
  backArabic?: string;
  difficulty: FlashCardDifficulty;
  tags: string[];
};

type WeekCardSet = {
  irab: CardTemplate[];
  sarf: CardTemplate[];
};

const weeklyFlashcards: WeekCardSet[] = [
  {
    irab: [
      { front: "Define I'rab (الإعراب).", back: "I'rab is the change at the end of a word due to grammatical role. | الإعراب: تغيّر أواخر الكلمات بسبب العوامل.", difficulty: FlashCardDifficulty.EASY, tags: ['definition', 'foundations'] },
      { front: 'What sign usually marks Raf\' (رفع) for singular nouns?', back: 'Dammah (ضمة) is the default sign of Raf\'. | علامة الرفع الأصلية: الضمة.', frontArabic: 'ما علامة الرفع الأصلية؟', backArabic: 'الضمة', difficulty: FlashCardDifficulty.EASY, tags: ['case-signs', 'raf'] },
      { front: 'What sign usually marks Nasb (نصب) for singular nouns?', back: 'Fathah (فتحة) is the default sign of Nasb. | علامة النصب الأصلية: الفتحة.', frontArabic: 'ما علامة النصب الأصلية؟', backArabic: 'الفتحة', difficulty: FlashCardDifficulty.EASY, tags: ['case-signs', 'nasb'] },
      { front: 'What sign usually marks Jarr (جر) for singular nouns?', back: 'Kasrah (كسرة) is the default sign of Jarr. | علامة الجر الأصلية: الكسرة.', frontArabic: 'ما علامة الجر الأصلية؟', backArabic: 'الكسرة', difficulty: FlashCardDifficulty.EASY, tags: ['case-signs', 'jarr'] },
      { front: 'In the phrase "جاءَ زيدٌ", what is the I\'rab of زيدٌ?', back: 'زيدٌ is marfu\' as the doer (fa\'il), with dammah. | زيدٌ: فاعل مرفوع.', difficulty: FlashCardDifficulty.HARD, tags: ['application', 'faail'] },
      { front: 'In the phrase "رأيتُ زيدًا", what is the I\'rab of زيدًا?', back: 'زيدًا is mansub as maf\'ul bihi, with fathah. | زيدًا: مفعول به منصوب.', difficulty: FlashCardDifficulty.HARD, tags: ['application', 'mafool-bihi'] },
      { front: 'In the phrase "مررتُ بزيدٍ", what is the I\'rab of زيدٍ?', back: 'زيدٍ is majrur after the preposition ب, with kasrah. | زيدٍ: اسم مجرور بالباء.', difficulty: FlashCardDifficulty.HARD, tags: ['application', 'harf-jarr'] },
      { front: 'Why is I\'rab essential for reading classical Arabic?', back: 'Because endings reveal function and meaning. | لأن الحركات تُبيّن الوظيفة والمعنى.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['importance', 'reading'] },
      { front: 'Name the three foundational case meanings in this course.', back: 'Raf\' (subject-like), Nasb (object/complement), Jarr (after idafah/preposition). | رفع، نصب، جر.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['overview', 'case-system'] },
      { front: 'Arabic recall: classify these signs — ضمة / فتحة / كسرة', frontArabic: 'صنّف: ضمة / فتحة / كسرة', back: 'ضمة=رفع، فتحة=نصب، كسرة=جر.', backArabic: 'ضمة=رفع، فتحة=نصب، كسرة=جر', difficulty: FlashCardDifficulty.MEDIUM, tags: ['recall', 'case-signs'] },
    ],
    sarf: [
      { front: 'What is a mujarrad verb (مجرد)?', back: 'A root-pattern verb without extra letters. | الفعل المجرد: ما كانت حروفه أصلية بلا زيادة.', difficulty: FlashCardDifficulty.EASY, tags: ['definition', 'mujarrad'] },
      { front: 'What is a mazid verb (مزيد)?', back: 'A verb with one or more added letters beyond the root. | الفعل المزيد: ما زيد على أصوله حرف أو أكثر.', difficulty: FlashCardDifficulty.EASY, tags: ['definition', 'mazid'] },
      { front: 'Extract the root of "استغفر".', back: 'Root is غ-ف-ر; the rest are added letters. | الجذر: غ ف ر.', difficulty: FlashCardDifficulty.HARD, tags: ['root-extraction', 'application'] },
      { front: 'Extract the root of "مكتوب".', back: 'Root is ك-ت-ب. | الجذر: ك ت ب.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['root-extraction', 'application'] },
      { front: 'What is the purpose of الميزان الصرفي?', back: 'It measures forms against ف-ع-ل to identify pattern changes. | يُوزن به اللفظ لمعرفة الزيادة والتغيّر.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['mizan', 'principles'] },
      { front: 'How do you map "دَرَّسَ" on the mizan?', back: 'It maps to فَعَّلَ (Form II). | وزنه: فَعَّلَ.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['mizan', 'form-2'] },
      { front: 'How do you map "كاتب" on the mizan?', back: 'It maps to فاعل (ism fa\'il pattern). | وزنه: فاعل.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['mizan', 'ism-faail'] },
      { front: 'Rule check: when extracting roots, what do you remove first?', back: 'Remove known prefixes/suffixes and identify stable radicals. | تُحذف الزوائد أولاً ثم تُعرف الأصول.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['root-extraction', 'rules'] },
      { front: 'Arabic recall: مجرد أم مزيد؟ "تدحرج"', frontArabic: 'مجرد أم مزيد: تدحرج', back: 'مزيد؛ لأن فيه زيادة على الجذر.', backArabic: 'مزيد', difficulty: FlashCardDifficulty.HARD, tags: ['classification', 'mujarrad-vs-mazid'] },
    ],
  },
  {
    irab: [
      { front: 'Define the Fa\'il (فاعل).', back: 'The doer of the verbal action; usually marfu\'. | الفاعل: من قام بالفعل، وهو مرفوع غالبًا.', difficulty: FlashCardDifficulty.EASY, tags: ['faail', 'definition'] },
      { front: 'What is the default sign of Fa\'il in a singular noun?', back: 'Dammah. | علامة الفاعل الأصلية: الضمة.', difficulty: FlashCardDifficulty.EASY, tags: ['faail', 'case-signs'] },
      { front: 'Can the Fa\'il be hidden (ضمير مستتر)?', back: 'Yes, often in verb forms like أكتبُ (I write). | نعم، قد يكون ضميرًا مستترًا.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['faail', 'pronouns'] },
      { front: 'Define Na\'ib al-Fa\'il (نائب الفاعل).', back: 'The subject substitute in passive voice; it becomes marfu\'. | نائب الفاعل: ما أُقيم مقام الفاعل في المبني للمجهول.', difficulty: FlashCardDifficulty.EASY, tags: ['naib-faail', 'definition'] },
      { front: 'In "كُتِبَ الدرسُ", identify نائب الفاعل.', back: 'الدرسُ is na\'ib al-fa\'il and marfu\'. | الدرسُ: نائب فاعل مرفوع.', difficulty: FlashCardDifficulty.HARD, tags: ['naib-faail', 'application'] },
      { front: 'How do you distinguish Fa\'il vs Na\'ib al-Fa\'il quickly?', back: 'Check verb voice: active takes Fa\'il; passive takes Na\'ib al-Fa\'il. | يُعرف من بناء الفعل.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['comparison', 'faail-naib'] },
      { front: 'Does Na\'ib al-Fa\'il keep object case (nasb)?', back: 'No, it shifts to raf\'. | لا، يصير مرفوعًا.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['naib-faail', 'rules'] },
      { front: 'In "يُكرَمُ الطالبُ", what is الطالبُ?', back: 'Na\'ib al-Fa\'il (marfu\'). | نائب فاعل مرفوع.', difficulty: FlashCardDifficulty.HARD, tags: ['naib-faail', 'application'] },
      { front: 'Arabic recall: أكمل — الفاعل ... ، ونائب الفاعل ...', frontArabic: 'أكمل: الفاعل ...، ونائب الفاعل ...', back: 'كلاهما مرفوع، لكن الأول مع المبني للمعلوم والثاني مع المبني للمجهول.', backArabic: 'كلاهما مرفوع', difficulty: FlashCardDifficulty.MEDIUM, tags: ['recall', 'comparison'] },
      { front: 'Why is recognizing Fa\'il central in Qur\'anic evidence passages?', back: 'Because legal meaning depends on who performs the action. | لأن الحكم يرتبط بالفاعل غالبًا.', difficulty: FlashCardDifficulty.HARD, tags: ['reading', 'usul-context'] },
    ],
    sarf: [
      { front: 'How is the past passive (ماضٍ مبني للمجهول) formed?', back: 'Dammah on first radical and kasrah before last. | ضم الأول وكسر ما قبل الآخر.', difficulty: FlashCardDifficulty.EASY, tags: ['passive', 'past'] },
      { front: 'How is the present passive (مضارع مبني للمجهول) formed?', back: 'Dammah on first radical and fathah before last. | ضم الأول وفتح ما قبل الآخر.', difficulty: FlashCardDifficulty.EASY, tags: ['passive', 'present'] },
      { front: 'Convert "كَتَبَ" to passive past.', back: 'كُتِبَ. | في المبني للمجهول: كُتِبَ.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['passive', 'conversion'] },
      { front: 'Convert "يكتبُ" to passive present.', back: 'يُكتَبُ. | المبني للمجهول: يُكتَبُ.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['passive', 'conversion'] },
      { front: 'In "ضُرِبَ زيدٌ", what changed morphologically?', back: 'Verb switched to passive vowel pattern ضُرِبَ. | تغيّر بناء الفعل إلى المجهول.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['passive', 'analysis'] },
      { front: 'What happens to the direct object when a verb becomes passive?', back: 'It is removed as maf\'ul bihi and promoted to na\'ib al-fa\'il. | يُقام المفعول مقام الفاعل.', difficulty: FlashCardDifficulty.HARD, tags: ['passive', 'syntax-link'] },
      { front: 'Arabic recall: صيغة المجهول للماضي من "نصر"', frontArabic: 'صغ المبني للمجهول من نصر (ماضٍ)', back: 'نُصِرَ', backArabic: 'نُصِرَ', difficulty: FlashCardDifficulty.MEDIUM, tags: ['passive', 'drill'] },
      { front: 'Arabic recall: صيغة المجهول للمضارع من "يفتح"', frontArabic: 'صغ المبني للمجهول من يفتح (مضارع)', back: 'يُفتَحُ', backArabic: 'يُفتَحُ', difficulty: FlashCardDifficulty.MEDIUM, tags: ['passive', 'drill'] },
      { front: 'Rule card: Which is harder to miss — passive vowels or context?', back: 'Start with vowel pattern first; then confirm with syntax context. | ابدأ بالبناء الصرفي ثم السياق الإعرابي.', difficulty: FlashCardDifficulty.HARD, tags: ['passive', 'strategy'] },
    ],
  },
  {
    irab: [
      { front: 'Define Mubtada\' (المبتدأ).', back: 'A noun starting a nominal sentence, usually marfu\'. | المبتدأ: اسم مرفوع يُبدأ به الكلام.', difficulty: FlashCardDifficulty.EASY, tags: ['mubtada-khabar', 'definition'] },
      { front: 'Define Khabar (الخبر).', back: 'The predicate completing the meaning of the mubtada\'. | الخبر: ما يتمم معنى المبتدأ.', difficulty: FlashCardDifficulty.EASY, tags: ['mubtada-khabar', 'definition'] },
      { front: 'List the three main types of Khabar.', back: 'Single word (مفرد), sentence (جملة), and شبه جملة. | مفرد، جملة، شبه جملة.', difficulty: FlashCardDifficulty.EASY, tags: ['khabar-types', 'overview'] },
      { front: 'Give a مثال of Khabar Mufrad.', back: '"اللهُ غفورٌ" — غفورٌ is singular khabar. | خبر مفرد.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['khabar-types', 'mufrad'] },
      { front: 'Give a مثال of Khabar Jumlah.', back: '"الطالبُ يقرأُ" — يقرأُ is verbal sentence khabar. | الخبر جملة فعلية.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['khabar-types', 'jumlah'] },
      { front: 'Give a مثال of Khabar Shibh Jumlah.', back: '"الكتابُ على الطاولةِ" — على الطاولةِ is شبه جملة khabar. | الخبر شبه جملة.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['khabar-types', 'shibh-jumlah'] },
      { front: 'When can Khabar come first (خبر مقدم)?', back: 'Often when mubtada\' is indefinite or for emphasis/context. | يتقدم الخبر عند مقتضى بلاغي أو إذا كان المبتدأ نكرة.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['khabar-muqaddam', 'rules'] },
      { front: 'In "في البيتِ رجلٌ", parse the structure.', back: 'في البيتِ: خبر مقدم (شبه جملة), رجلٌ: مبتدأ مؤخر مرفوع.', difficulty: FlashCardDifficulty.HARD, tags: ['khabar-muqaddam', 'application'] },
      { front: 'Arabic recall: المبتدأ والخبر حكمهما الإعرابي؟', frontArabic: 'حكم المبتدأ والخبر إعرابًا؟', back: 'الأصل فيهما الرفع.', backArabic: 'الأصل الرفع', difficulty: FlashCardDifficulty.EASY, tags: ['recall', 'case-signs'] },
      { front: 'How does identifying khabar type help reading hadith style sentences?', back: 'It clarifies whether completion is noun, clause, or phrase. | يحدد نوع الإسناد في الجملة الاسمية.', difficulty: FlashCardDifficulty.HARD, tags: ['reading', 'hadith-context'] },
    ],
    sarf: [
      { front: 'What is a Mithal Wawi verb (المثال الواوي)?', back: 'A weak verb whose first radical is waw. | المثال الواوي: ما فاؤه واو.', difficulty: FlashCardDifficulty.EASY, tags: ['mithal-wawi', 'definition'] },
      { front: 'Core rule: what may happen to the initial waw in mudari\'?', back: 'It may drop when the عين is kasrah. | تحذف الواو في المضارع إذا كانت عين الفعل مكسورة.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['mithal-wawi', 'rules'] },
      { front: 'Convert وَعَدَ to mudari\'.', back: 'يَعِدُ (not يَوْعِدُ). | المضارع: يَعِدُ.', difficulty: FlashCardDifficulty.HARD, tags: ['mithal-wawi', 'conversion'] },
      { front: 'Convert وَزَنَ to mudari\'.', back: 'يَزِنُ. | تحذف الواو في المضارع.', difficulty: FlashCardDifficulty.HARD, tags: ['mithal-wawi', 'conversion'] },
      { front: 'Does the waw always drop in every derived form?', back: 'No; apply rule by pattern and vowel environment. | لا، يراعى الوزن والحركة.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['mithal-wawi', 'nuance'] },
      { front: 'Arabic recall: مضارع "وَقَفَ"', frontArabic: 'ما مضارع: وَقَفَ؟', back: 'يَقِفُ', backArabic: 'يَقِفُ', difficulty: FlashCardDifficulty.MEDIUM, tags: ['mithal-wawi', 'drill'] },
      { front: 'Arabic recall: مضارع "وَجَدَ"', frontArabic: 'ما مضارع: وَجَدَ؟', back: 'يَجِدُ', backArabic: 'يَجِدُ', difficulty: FlashCardDifficulty.MEDIUM, tags: ['mithal-wawi', 'drill'] },
      { front: 'Rule card: why is this called "mithal"?', back: 'Because weakness appears at the first radical (fa\'). | سمي مثالاً لكون العلة في الفاء.', difficulty: FlashCardDifficulty.EASY, tags: ['mithal-wawi', 'terminology'] },
      { front: 'Application: identify category of "يَعِدُ".', back: 'It is from mithal wawi root (وعد) with dropped initial waw. | من المثال الواوي.', difficulty: FlashCardDifficulty.HARD, tags: ['mithal-wawi', 'classification'] },
    ],
  },
  {
    irab: [
      { front: 'What are "Kana and its sisters" (كان وأخواتها)?', back: 'Defective verbs entering nominal sentences. | أفعال ناقصة تدخل على الجملة الاسمية.', difficulty: FlashCardDifficulty.EASY, tags: ['kana', 'definition'] },
      { front: 'Main effect of كان وأخواتها?', back: 'They raise ism and set khabar to nasb. | ترفع الاسم وتنصب الخبر.', difficulty: FlashCardDifficulty.EASY, tags: ['kana', 'rules'] },
      { front: 'Give 5 common sisters of كان.', back: 'كان، أصبح، أمسى، ظلّ، بات (also صار، ليس...).', difficulty: FlashCardDifficulty.MEDIUM, tags: ['kana', 'list'] },
      { front: 'In "كان الطالبُ مجتهدًا", parse الطالبُ and مجتهدًا.', back: 'الطالبُ: اسم كان مرفوع، مجتهدًا: خبر كان منصوب.', difficulty: FlashCardDifficulty.HARD, tags: ['kana', 'application'] },
      { front: 'What are الأفعال الناقصة?', back: 'Verbs needing a khabar to complete meaning. | أفعال لا يتم معناها إلا بخبر.', difficulty: FlashCardDifficulty.EASY, tags: ['defective-verbs', 'definition'] },
      { front: 'Does "ليس" behave like kana in case effect?', back: 'Yes: ism marfu\', khabar mansub. | نعم، تعمل عمل كان.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['kana', 'laysa'] },
      { front: 'In "أصبح الجوُّ لطيفًا", what is khabar?', back: 'لطيفًا is khabar of أصبح (mansub). | لطيفًا: خبر أصبح منصوب.', difficulty: FlashCardDifficulty.HARD, tags: ['kana', 'application'] },
      { front: 'Arabic recall: أكمل القاعدة — كان ... الخبر', frontArabic: 'أكمل: كان ترفع ... وتنصب ...', back: 'ترفع الاسم وتنصب الخبر.', backArabic: 'ترفع الاسم وتنصب الخبر', difficulty: FlashCardDifficulty.EASY, tags: ['recall', 'rules'] },
      { front: 'How does this topic support command/prohibition readings?', back: 'It prevents misreading nominal clauses altered by ناقص verbs. | يضبط فهم الجمل الاسمية المتحوّلة.', difficulty: FlashCardDifficulty.HARD, tags: ['reading', 'commands-prohibitions'] },
      { front: 'Can khabar of kana be a phrase (شبه جملة)?', back: 'Yes, e.g., كان زيدٌ في المسجدِ. | نعم، قد يكون شبه جملة.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['kana', 'khabar-types'] },
    ],
    sarf: [
      { front: 'How do you form فعل الأمر from mudari\' (2nd person)?', back: 'Take jussive mudari\', remove prefix, adjust hamzat al-wasl if needed. | يؤخذ من المضارع المجزوم بحذف حرف المضارعة.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['imperative', 'formation'] },
      { front: 'Form the imperative from "تكتبُ" (anta).', back: 'اُكتبْ. | الأمر: اُكتبْ.', difficulty: FlashCardDifficulty.HARD, tags: ['imperative', 'conversion'] },
      { front: 'Form the imperative from "تجلسُ" (anta).', back: 'اِجلسْ. | الأمر: اِجلسْ.', difficulty: FlashCardDifficulty.HARD, tags: ['imperative', 'conversion'] },
      { front: 'What is nahy (النهي) structure?', back: 'لا + mudari\' majzum. | النهي: لا الناهية + مضارع مجزوم.', difficulty: FlashCardDifficulty.EASY, tags: ['nahy', 'formation'] },
      { front: 'Convert "تكتبُ" to prohibition.', back: 'لا تكتبْ. | صيغة النهي: لا تكتبْ.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['nahy', 'conversion'] },
      { front: 'Convert "تغفلُ" to prohibition.', back: 'لا تغفلْ. | النهي: لا تغفلْ.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['nahy', 'conversion'] },
      { front: 'Arabic recall: الأمر من "تعبدُ"', frontArabic: 'هات الأمر من: تَعْبُدُ', back: 'اُعْبُدْ', backArabic: 'اُعْبُدْ', difficulty: FlashCardDifficulty.HARD, tags: ['imperative', 'drill'] },
      { front: 'Arabic recall: النهي من "تتركُ"', frontArabic: 'هات النهي من: تتركُ', back: 'لا تتركْ', backArabic: 'لا تتركْ', difficulty: FlashCardDifficulty.MEDIUM, tags: ['nahy', 'drill'] },
      { front: 'Rule card: what governs the final sukun in command/nahy?', back: 'Both rely on jussive behavior of the mudari\'. | مبنيان على أثر الجزم في المضارع.', difficulty: FlashCardDifficulty.HARD, tags: ['imperative', 'nahy-rules'] },
    ],
  },
  {
    irab: [
      { front: 'List Inna and its sisters (إنّ وأخواتها).', back: 'إنّ، أنّ، كأنّ، لكنّ، ليت، لعلّ.', difficulty: FlashCardDifficulty.EASY, tags: ['inna', 'list'] },
      { front: 'Main effect of إنّ وأخواتها?', back: 'They set ism to nasb and raise khabar. | تنصب الاسم وترفع الخبر.', difficulty: FlashCardDifficulty.EASY, tags: ['inna', 'rules'] },
      { front: 'In "إنّ اللهَ غفورٌ", parse both pillars.', back: 'اللهَ: اسم إنّ منصوب، غفورٌ: خبر إنّ مرفوع.', difficulty: FlashCardDifficulty.HARD, tags: ['inna', 'application'] },
      { front: 'Difference between kana-group and inna-group effect?', back: 'Kana: ism marfu\'/khabar mansub; Inna: ism mansub/khabar marfu\'. | العكس في الإعراب بينهما.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['comparison', 'kana-inna'] },
      { front: 'Function of كأنّ in meaning?', back: 'Similitude: "as though". | للتشبيه.', difficulty: FlashCardDifficulty.EASY, tags: ['inna', 'meanings'] },
      { front: 'Function of ليت in meaning?', back: 'Wish/hope for difficult matter. | للتمني.', difficulty: FlashCardDifficulty.EASY, tags: ['inna', 'meanings'] },
      { front: 'Function of لعل in meaning?', back: 'Hope/expectation. | للترجي.', difficulty: FlashCardDifficulty.EASY, tags: ['inna', 'meanings'] },
      { front: 'Arabic recall: أكمل — إنّ تنصب ... وترفع ...', frontArabic: 'أكمل: إنّ تنصب ... وترفع ...', back: 'تنصب الاسم وترفع الخبر.', backArabic: 'تنصب الاسم وترفع الخبر', difficulty: FlashCardDifficulty.EASY, tags: ['recall', 'rules'] },
      { front: 'In "لعلّ الطالبَ ناجحٌ", identify the case roles.', back: 'الطالبَ ism of لعلّ (mansub), ناجحٌ khabar (marfu\').', difficulty: FlashCardDifficulty.HARD, tags: ['inna', 'application'] },
      { front: 'Why this topic matters in عام/خاص arguments?', back: 'Particle shifts can change scope and emphasis in legal wording. | تغيّر أدوات التوكيد يؤثر في الدلالة.', difficulty: FlashCardDifficulty.HARD, tags: ['reading', 'usul-context'] },
    ],
    sarf: [
      { front: 'Define Ajwaf verb (الأجوف).', back: 'A weak verb with weak middle radical (عين). | الأجوف: ما كانت عينه حرف علة.', difficulty: FlashCardDifficulty.EASY, tags: ['ajwaf', 'definition'] },
      { front: 'Key rule for ajwaf in jussive?', back: 'Middle weak letter may drop in majzum forms. | تحذف عين الفعل في الجزم.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['ajwaf', 'jussive'] },
      { front: 'Key rule for ajwaf imperative?', back: 'Imperative often reflects dropped middle weak letter. | يظهر فيه أثر حذف حرف العلة الوسطى.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['ajwaf', 'imperative'] },
      { front: 'Convert "يقولُ" to jussive with lam.', back: 'لم يَقُلْ. | المجزوم: يَقُلْ.', difficulty: FlashCardDifficulty.HARD, tags: ['ajwaf', 'conversion'] },
      { front: 'Convert "يبيعُ" to jussive with lam.', back: 'لم يَبِعْ. | المجزوم: يَبِعْ.', difficulty: FlashCardDifficulty.HARD, tags: ['ajwaf', 'conversion'] },
      { front: 'Imperative from "يقولُ" (anta).', back: 'قُلْ. | الأمر: قُلْ.', difficulty: FlashCardDifficulty.HARD, tags: ['ajwaf', 'imperative'] },
      { front: 'Imperative from "يسيرُ" (anta).', back: 'سِرْ. | الأمر: سِرْ.', difficulty: FlashCardDifficulty.HARD, tags: ['ajwaf', 'imperative'] },
      { front: 'Arabic recall: مجزوم "يخافُ"', frontArabic: 'هات مجزوم: يخافُ', back: 'لم يَخَفْ', backArabic: 'لم يَخَفْ', difficulty: FlashCardDifficulty.HARD, tags: ['ajwaf', 'drill'] },
      { front: 'Classification: "قام" belongs to which weak type?', back: 'Ajwaf (middle weak). | من الأجوف.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['ajwaf', 'classification'] },
    ],
  },
  {
    irab: [
      { front: 'Define Haal (الحال).', back: 'A mansub indefinite describing state at action time. | الحال: وصف منصوب نكرة يبيّن الهيئة.', difficulty: FlashCardDifficulty.EASY, tags: ['haal', 'definition'] },
      { front: 'Three hallmarks of haal in this course?', back: 'Mansub, usually nakirah, often after ma\'rifah صاحب الحال. | منصوب، نكرة، وصاحبه معرفة غالبًا.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['haal', 'rules'] },
      { front: 'In "جاء الطالبُ مسرعًا", identify haal.', back: 'مسرعًا is the haal (mansub). | مسرعًا: حال منصوب.', difficulty: FlashCardDifficulty.HARD, tags: ['haal', 'application'] },
      { front: 'Define Tamyiz (التمييز).', back: 'A mansub indefinite clarifier removing ambiguity. | التمييز: اسم نكرة منصوب يرفع الإبهام.', difficulty: FlashCardDifficulty.EASY, tags: ['tamyiz', 'definition'] },
      { front: 'In "اشتريتُ عشرين كتابًا", identify tamyiz.', back: 'كتابًا is tamyiz clarifying counted unit. | كتابًا: تمييز منصوب.', difficulty: FlashCardDifficulty.HARD, tags: ['tamyiz', 'application'] },
      { front: 'Define Maf\'ul Mutlaq (المفعول المطلق).', back: 'Verbal noun from same root used for emphasis/type/count. | مصدر منصوب من لفظ الفعل.', difficulty: FlashCardDifficulty.EASY, tags: ['mafool-mutlaq', 'definition'] },
      { front: 'In "ضربتُه ضربًا", what is ضربًا?', back: 'Maf\'ul mutlaq for emphasis. | مفعول مطلق مؤكد للفعل.', difficulty: FlashCardDifficulty.HARD, tags: ['mafool-mutlaq', 'application'] },
      { front: 'Arabic recall: فرق سريع بين الحال والتمييز؟', frontArabic: 'ما الفرق السريع بين الحال والتمييز؟', back: 'الحال يبيّن الهيئة، والتمييز يرفع الإبهام.', backArabic: 'الحال هيئة، والتمييز إبهام', difficulty: FlashCardDifficulty.MEDIUM, tags: ['comparison', 'haal-tamyiz'] },
      { front: 'Can both haal and tamyiz be nakirah mansub?', back: 'Yes, so context/function must decide. | نعم، والتمييز بالسياق الوظيفي.', difficulty: FlashCardDifficulty.HARD, tags: ['comparison', 'disambiguation'] },
      { front: 'Why is this unit key for restricted/unrestricted texts?', back: 'These complements narrow meaning and legal scope. | لأنها تقيد المعنى وتوضحه.', difficulty: FlashCardDifficulty.HARD, tags: ['reading', 'usul-context'] },
    ],
    sarf: [
      { front: 'Define Naqis verb (الناقص).', back: 'A weak verb with weak final radical. | الناقص: ما كانت لامه حرف علة.', difficulty: FlashCardDifficulty.EASY, tags: ['naqis', 'definition'] },
      { front: 'Naqis rule in jussive?', back: 'Final weak letter is deleted in majzum. | يحذف حرف العلة في الجزم.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['naqis', 'jussive'] },
      { front: 'Naqis past tense hallmark (wawi/ya\'i roots)?', back: 'Often appears with alif in 3ms past (e.g., دعا، رمى). | يظهر غالبًا بالألف في الماضي.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['naqis', 'past'] },
      { front: 'Convert "يدعو" to jussive with lam.', back: 'لم يَدْعُ. | المجزوم: يَدْعُ.', difficulty: FlashCardDifficulty.HARD, tags: ['naqis', 'conversion'] },
      { front: 'Convert "يرمي" to jussive with lam.', back: 'لم يَرْمِ. | المجزوم: يَرْمِ.', difficulty: FlashCardDifficulty.HARD, tags: ['naqis', 'conversion'] },
      { front: 'Imperative from "يدعو" (anta).', back: 'اُدْعُ. | الأمر: اُدْعُ.', difficulty: FlashCardDifficulty.HARD, tags: ['naqis', 'imperative'] },
      { front: 'Imperative from "يرمي" (anta).', back: 'اِرْمِ. | الأمر: اِرْمِ.', difficulty: FlashCardDifficulty.HARD, tags: ['naqis', 'imperative'] },
      { front: 'Arabic recall: مجزوم "يمشي"', frontArabic: 'هات مجزوم: يمشي', back: 'لم يَمْشِ', backArabic: 'لم يَمْشِ', difficulty: FlashCardDifficulty.HARD, tags: ['naqis', 'drill'] },
      { front: 'Classification: "سعى" belongs to which weak type?', back: 'Naqis (final weak). | من الناقص.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['naqis', 'classification'] },
    ],
  },
  {
    irab: [
      { front: 'Define Idafah (الإضافة).', back: 'Construct of two nouns: possessed + possessor relation. | الإضافة: نسبة بين مضاف ومضاف إليه.', difficulty: FlashCardDifficulty.EASY, tags: ['idafah', 'definition'] },
      { front: 'Rule: how is the mudaf marked regarding tanwin and al-?', back: 'Mudaf takes no tanwin and usually no definite article ال. | المضاف بلا تنوين ولا أل غالبًا.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['idafah', 'mudaf-rules'] },
      { front: 'Rule: case of mudaf ilayh?', back: 'Always majrur. | المضاف إليه مجرور.', difficulty: FlashCardDifficulty.EASY, tags: ['idafah', 'mudaf-ilayh'] },
      { front: 'In "كتابُ الطالبِ", parse both words.', back: 'كتابُ: mudaf, الطالبِ: mudaf ilayh majrur.', difficulty: FlashCardDifficulty.HARD, tags: ['idafah', 'application'] },
      { front: 'In "بابُ المسجدِ", why no tanwin on بابُ?', back: 'Because it is mudaf in idafah. | لأنه مضاف.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['idafah', 'application'] },
      { front: 'Name two broad types of idafah taught here.', back: 'Semantic (معنوية) and formal/lexical (لفظية) framing. | إضافة معنوية ولفظية.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['idafah', 'types'] },
      { front: 'Can a pronoun be mudaf ilayh?', back: 'Yes, via suffix pronouns (e.g., كتابُه). | نعم، بالضمائر المتصلة.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['idafah', 'pronouns'] },
      { front: 'Arabic recall: أكمل — المضاف إليه دائمًا ...', frontArabic: 'أكمل: المضاف إليه دائمًا ...', back: 'مجرور.', backArabic: 'مجرور', difficulty: FlashCardDifficulty.EASY, tags: ['recall', 'mudaf-ilayh'] },
      { front: 'Disambiguation: "في بيتِ الرجلِ" contains what?', back: 'Jar phrase + idafah inside it (بيتِ الرجلِ).', difficulty: FlashCardDifficulty.HARD, tags: ['idafah', 'complex-application'] },
      { front: 'Why is idafah central in clarifying ambiguous texts?', back: 'It narrows attribution and possession precisely. | تضبط الإسناد والتخصيص.', difficulty: FlashCardDifficulty.HARD, tags: ['reading', 'usul-context'] },
    ],
    sarf: [
      { front: 'What is Lafif (اللفيف)?', back: 'A weak verb containing two weak letters. | اللفيف: ما اجتمع فيه حرفا علة.', difficulty: FlashCardDifficulty.EASY, tags: ['lafif', 'definition'] },
      { front: 'How do you handle lafif forms generally?', back: 'Apply relevant weak-verb rules by position (initial/final). | يُعامل بحسب موضع العلة كالمثال والناقص.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['lafif', 'rules'] },
      { front: 'What is Mudha\'af (المضاعف)?', back: 'A verb with doubled same radical (usually 2nd and 3rd). | المضاعف: ما كانت عينه ولامه من جنس واحد.', difficulty: FlashCardDifficulty.EASY, tags: ['mudaf', 'definition'] },
      { front: 'Typical behavior of mudha\'af in many forms?', back: 'Idgham (consonant merging) is common. | يغلب عليه الإدغام.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['mudaf', 'idgham'] },
      { front: 'When can mudha\'af show فكّ (unmerging)?', back: 'Often under jussive/sukun pressure in some patterns. | قد يفك عند التقاء الساكنين في الجزم ونحوه.', difficulty: FlashCardDifficulty.HARD, tags: ['mudaf', 'fakk'] },
      { front: 'Classify "طوى".', back: 'Lafif (contains two weak letters). | من اللفيف.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['lafif', 'classification'] },
      { front: 'Classify "شدَّ".', back: 'Mudha\'af (doubled). | من المضاعف.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['mudaf', 'classification'] },
      { front: 'Arabic recall: المضاعف يغلب فيه ...', frontArabic: 'أكمل: المضاعف يغلب فيه ...', back: 'الإدغام.', backArabic: 'الإدغام', difficulty: FlashCardDifficulty.EASY, tags: ['mudaf', 'recall'] },
      { front: 'Comparison card: lafif vs mudha\'af in one line.', back: 'Lafif = two weak letters; Mudha\'af = doubled consonant. | اللفيف: حرفا علة، والمضاعف: حرفان متماثلان مدغمان.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['comparison', 'lafif-mudaf'] },
    ],
  },
  {
    irab: [
      { front: 'Capstone: In "إنّ طالبَ العلمِ مجتهدٌ", identify core i\'rab.', back: 'طالبَ: ism inna mansub, العلمِ: mudaf ilayh majrur, مجتهدٌ: khabar inna marfu\'.', difficulty: FlashCardDifficulty.HARD, tags: ['capstone', 'inna-idafah'] },
      { front: 'Capstone: parse "كان الرجلُ في المسجدِ قائمًا".', back: 'الرجلُ ism kana marfu\'; في المسجدِ khabar kana (shibh jumlah) or متعلّق; قائمًا حال/خبر بديل by parsing school.', difficulty: FlashCardDifficulty.HARD, tags: ['capstone', 'kana-haal'] },
      { front: 'Capstone: "في الدارِ رجلٌ صالحٌ" pattern name?', back: 'Khabar muqaddam + mubtada\' mu\'akhkhar. | خبر مقدم ومبتدأ مؤخر.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['capstone', 'khabar-muqaddam'] },
      { front: 'Capstone: identify tamyiz in "ازداد المؤمنُ إيمانًا".', back: 'إيمانًا is tamyiz mansub clarifying increase. | إيمانًا: تمييز منصوب.', difficulty: FlashCardDifficulty.HARD, tags: ['capstone', 'tamyiz'] },
      { front: 'Capstone: identify maf\'ul mutlaq in "سبّحتُ اللهَ تسبيحًا".', back: 'تسبيحًا is maf\'ul mutlaq from same root. | تسبيحًا: مفعول مطلق.', difficulty: FlashCardDifficulty.HARD, tags: ['capstone', 'mafool-mutlaq'] },
      { front: 'Capstone: give two signs that a noun is mudaf.', back: 'No tanwin and directly followed by majrur mudaf ilayh. | سقوط التنوين ثم مجيء مضاف إليه مجرور.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['capstone', 'idafah'] },
      { front: 'Capstone: Which particles reverse mubtada/khabar case like kana?', back: 'Inna-group does the opposite of kana-group. | إنّ وأخواتها تعكس عمل كان.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['capstone', 'comparison'] },
      { front: 'Arabic recall: اضبط "العلمُ نورٌ" إعرابًا مختصرًا.', frontArabic: 'إعراب مختصر: العلمُ نورٌ', back: 'العلمُ مبتدأ مرفوع، نورٌ خبر مرفوع.', backArabic: 'مبتدأ مرفوع، خبر مرفوع', difficulty: FlashCardDifficulty.MEDIUM, tags: ['capstone', 'nominal-sentence'] },
      { front: 'Arabic recall: ما وظيفة الحال؟', frontArabic: 'ما وظيفة الحال؟', back: 'بيان هيئة صاحبها وقت الفعل.', backArabic: 'بيان الهيئة', difficulty: FlashCardDifficulty.EASY, tags: ['capstone', 'haal'] },
      { front: 'Meta-rule: first pass in i\'rab should identify what 3 anchors?', back: 'Amil/particle, sentence type, and case endings. | العامل، نوع الجملة، والحركات الإعرابية.', difficulty: FlashCardDifficulty.HARD, tags: ['capstone', 'method'] },
    ],
    sarf: [
      { front: 'Review: classify "يعدُ" (from وعد).', back: 'Mithal wawi behavior with dropped initial waw. | مثال واوي.', difficulty: FlashCardDifficulty.HARD, tags: ['capstone', 'mithal-wawi'] },
      { front: 'Review: classify "قُلْ" (imperative).', back: 'From ajwaf verb قال؛ middle weak letter dropped. | من الأجوف.', difficulty: FlashCardDifficulty.HARD, tags: ['capstone', 'ajwaf'] },
      { front: 'Review: classify "اِرْمِ".', back: 'From naqis root رمى; final weak deleted. | من الناقص.', difficulty: FlashCardDifficulty.HARD, tags: ['capstone', 'naqis'] },
      { front: 'Review: classify "طوى".', back: 'Lafif (two weak letters). | لفيف.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['capstone', 'lafif'] },
      { front: 'Review: classify "مدَّ".', back: 'Mudha\'af (doubled radical). | مضاعف.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['capstone', 'mudaf'] },
      { front: 'Mixed conjugation: passive present of "يكتب"?', back: 'يُكتبُ. | مضارع مبني للمجهول: يُكتبُ.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['capstone', 'passive'] },
      { front: 'Mixed conjugation: prohibition from "تدعو"?', back: 'لا تَدْعُ. | النهي: لا تدعُ.', difficulty: FlashCardDifficulty.HARD, tags: ['capstone', 'nahy-naqis'] },
      { front: 'Mixed conjugation: imperative from "تبيع"?', back: 'بِعْ. | الأمر من الأجوف: بِعْ.', difficulty: FlashCardDifficulty.HARD, tags: ['capstone', 'imperative-ajwaf'] },
      { front: 'Method card: when unsure weak-verb category, what to inspect first?', back: 'Locate weak letter position in root: first/middle/final/two. | حدّد موضع حرف العلة في الجذر أولاً.', difficulty: FlashCardDifficulty.MEDIUM, tags: ['capstone', 'method'] },
    ],
  },
];

export async function seedMasaarFlashcards() {
  console.log("🌱 Seeding al-Masār I'rab & Sarf flashcards...\n");

  const course = await prisma.course.findUnique({
    where: { id: MASAAR_COURSE_ID },
    include: { units: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!course) {
    console.error('❌ al-Masār course not found. Run seed-masaar-course.ts first.');
    return;
  }

  if (course.units.length < 8) {
    console.error(`❌ Expected 8 units for ${MASAAR_COURSE_ID}, found ${course.units.length}.`);
    return;
  }

  await prisma.flashCard.deleteMany({ where: { courseId: course.id } });
  console.log('🧹 Cleared existing al-Masār flashcards.');

  let totalCreated = 0;

  for (const unit of course.units) {
    const week = unit.orderIndex + 1;
    const weekCards = weeklyFlashcards[unit.orderIndex];

    if (!weekCards) {
      console.warn(`⚠️ No flashcards configured for week ${week}. Skipping.`);
      continue;
    }

    const cards = [
      ...weekCards.irab.map((card) => ({
        ...card,
        category: 'irab',
        tags: [`week-${week}`, 'irab', ...card.tags],
      })),
      ...weekCards.sarf.map((card) => ({
        ...card,
        category: 'sarf',
        tags: [`week-${week}`, 'sarf', ...card.tags],
      })),
    ];

    for (let i = 0; i < cards.length; i++) {
      await prisma.flashCard.create({
        data: {
          ...cards[i],
          courseId: course.id,
          unitId: unit.id,
          orderIndex: i,
        },
      });
      totalCreated++;
    }

    console.log(`✓ Week ${week}: created ${cards.length} flashcards (${weekCards.irab.length} i'rab, ${weekCards.sarf.length} sarf)`);
  }

  console.log(`\n✅ Successfully created ${totalCreated} al-Masār flashcards.`);
}

async function main() {
  try {
    await seedMasaarFlashcards();
  } catch (error) {
    console.error('❌ Error seeding al-Masār flashcards:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch(() => {
    process.exit(1);
  });
}
