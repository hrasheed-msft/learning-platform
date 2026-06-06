import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MASAAR_COURSE_ID = 'a1b2c3d4-e5f6-4890-abcd-ef1234567001';

type TermTuple = [arabicText: string, vowelled: string, transliteration: string, translation: string, root: string, sarf: string];

type MasaarTermCategory = 'NOUN' | 'VERB' | 'PARTICLE' | 'PHRASE' | 'ROOT';

type MasaarTermInput = {
  arabicText: string;
  transliteration: string;
  translation: string;
  metadata: {
    category: MasaarTermCategory;
    vowelled: string;
    root: string;
    wordType: string;
    irab: string;
    sarf: string;
    passageWeek: number;
  };
};

const WEEKLY_TUPLES: Record<number, { nouns: TermTuple[]; verbs: TermTuple[]; particles: TermTuple[] }> = {
  1: {
    nouns: [
      ['الفقه', 'الفِقْهُ', 'al-fiqh', 'jurisprudence', 'ف ق ه', 'مصدر على وزن فِعْل'],
      ['الأصول', 'الأُصُولُ', 'al-usul', 'legal principles', 'أ ص ل', 'جمع تكسير'],
      ['الحكم', 'الحُكْمُ', 'al-hukm', 'legal ruling', 'ح ك م', 'مصدر على وزن فُعْل'],
      ['الشرعي', 'الشَّرْعِيُّ', 'al-sharʿi', 'legal/Sharʿi', 'ش ر ع', 'نسبة'],
      ['الدليل', 'الدَّلِيلُ', 'al-dalil', 'proof/evidence', 'د ل ل', 'فعيل'],
      ['العقل', 'العَقْلُ', 'al-ʿaql', 'reason', 'ع ق ل', 'مصدر'],
      ['النقل', 'النَّقْلُ', 'al-naql', 'transmission', 'ن ق ل', 'مصدر'],
      ['الإجماع', 'الإِجْمَاعُ', 'al-ijmaʿ', 'consensus', 'ج م ع', 'إفعال'],
      ['القياس', 'القِيَاسُ', 'al-qiyas', 'analogy', 'ق ي س', 'فعال'],
      ['الكتاب', 'الكِتَابُ', 'al-kitab', 'the Qurʾan / scripture', 'ك ت ب', 'فعال'],
      ['السنة', 'السُّنَّةُ', 'al-sunnah', 'prophetic tradition', 'س ن ن', 'فُعَّة'],
      ['العبادات', 'العِبَادَاتُ', 'al-ʿibadat', 'acts of worship', 'ع ب د', 'جمع مؤنث سالم'],
      ['المعاملات', 'المُعَامَلَاتُ', 'al-muʿamalat', 'transactions', 'ع م ل', 'جمع مؤنث سالم'],
      ['الحلال', 'الحَلَالُ', 'al-halal', 'lawful', 'ح ل ل', 'فعال'],
      ['الحرام', 'الحَرَامُ', 'al-haram', 'unlawful', 'ح ر م', 'فعال'],
      ['الواجب', 'الوَاجِبُ', 'al-wajib', 'obligatory', 'و ج ب', 'اسم فاعل'],
      ['المندوب', 'المَنْدُوبُ', 'al-mandub', 'recommended', 'ن د ب', 'اسم مفعول'],
      ['المباح', 'المُبَاحُ', 'al-mubah', 'permissible', 'ب و ح', 'اسم مفعول'],
      ['المكروه', 'المَكْرُوهُ', 'al-makruh', 'disliked', 'ك ر ه', 'اسم مفعول'],
      ['السبب', 'السَّبَبُ', 'al-sabab', 'cause', 'س ب ب', 'فَعَل'],
      ['الشرط', 'الشَّرْطُ', 'al-shart', 'condition', 'ش ر ط', 'فَعْل'],
      ['المانع', 'المَانِعُ', 'al-maniʿ', 'preventer', 'م ن ع', 'اسم فاعل'],
      ['الصحة', 'الصِّحَّةُ', 'al-sihhah', 'validity', 'ص ح ح', 'فِعَّة'],
      ['الفساد', 'الفَسَادُ', 'al-fasad', 'invalidity/corruption', 'ف س د', 'فعال'],
    ],
    verbs: [
      ['دل', 'دَلَّ', 'dalla', 'indicated', 'د ل ل', 'فعل ماضٍ ثلاثي مضاعف'],
      ['ثبت', 'ثَبَتَ', 'thabata', 'was established', 'ث ب ت', 'فعل ماضٍ ثلاثي مجرد'],
      ['وجب', 'وَجَبَ', 'wajaba', 'became obligatory', 'و ج ب', 'فعل ماضٍ ثلاثي مجرد'],
      ['حرم', 'حَرُمَ', 'haruma', 'became forbidden', 'ح ر م', 'فعل ماضٍ ثلاثي مجرد'],
      ['اباح', 'أَبَاحَ', 'abaha', 'permitted', 'ب و ح', 'فعل ماضٍ رباعي'],
      ['ندب', 'نَدَبَ', 'nadaba', 'recommended', 'ن د ب', 'فعل ماضٍ ثلاثي مجرد'],
      ['صح', 'صَحَّ', 'sahha', 'became valid', 'ص ح ح', 'فعل ماضٍ ثلاثي مضاعف'],
      ['فسد', 'فَسَدَ', 'fasada', 'became invalid', 'ف س د', 'فعل ماضٍ ثلاثي مجرد'],
      ['اعتبر', 'اعْتَبَرَ', 'iʿtabara', 'considered', 'ع ب ر', 'فعل ماضٍ مزيد (افتعل)'],
      ['استنبط', 'اسْتَنْبَطَ', 'istanbata', 'derived/inferred', 'ن ب ط', 'فعل ماضٍ مزيد (استفعل)'],
    ],
    particles: [
      ['من', 'مِنْ', 'min', 'from', '—', 'حرف جر'],
      ['إلى', 'إِلَى', 'ila', 'to', '—', 'حرف جر'],
      ['على', 'عَلَى', 'ʿala', 'on/upon', '—', 'حرف جر'],
      ['في', 'فِي', 'fi', 'in', '—', 'حرف جر'],
      ['عن', 'عَنْ', 'ʿan', 'about/from', '—', 'حرف جر'],
      ['او', 'أَوْ', 'aw', 'or', '—', 'حرف عطف'],
    ],
  },
  2: {
    nouns: [
      ['النص', 'النَّصُّ', 'al-nass', 'explicit text', 'ن ص ص', 'فَعْل'],
      ['الظاهر', 'الظَّاهِرُ', 'al-zahir', 'apparent meaning', 'ظ ه ر', 'اسم فاعل'],
      ['المؤول', 'المُؤَوَّلُ', 'al-muʾawwal', 'interpreted text', 'أ و ل', 'اسم مفعول'],
      ['الدلالة', 'الدَّلَالَةُ', 'al-dalalah', 'indication', 'د ل ل', 'فَعَالَة'],
      ['اللفظ', 'اللَّفْظُ', 'al-lafz', 'wording', 'ل ف ظ', 'فَعْل'],
      ['المعنى', 'المَعْنَى', 'al-maʿna', 'meaning', 'ع ن ي', 'مَفْعَل'],
      ['القطعي', 'القَطْعِيُّ', 'al-qatʿi', 'definitive', 'ق ط ع', 'نسبة'],
      ['الظني', 'الظَّنِّيُّ', 'al-zanni', 'probabilistic', 'ظ ن ن', 'نسبة'],
      ['العبارة', 'العِبَارَةُ', 'al-ʿibarah', 'explicit expression', 'ع ب ر', 'فِعَالَة'],
      ['الإشارة', 'الإِشَارَةُ', 'al-isharah', 'allusive indication', 'ش و ر', 'إفعال'],
      ['الاقتضاء', 'الاقْتِضَاءُ', 'al-iqtidaʾ', 'required implication', 'ق ض ي', 'افتعال'],
      ['التنبيه', 'التَّنْبِيهُ', 'al-tanbih', 'indirect indication', 'ن ب ه', 'تفعيل'],
      ['الحقيقة', 'الحَقِيقَةُ', 'al-haqiqah', 'literal meaning', 'ح ق ق', 'فَعِيلَة'],
      ['المجاز', 'المَجَازُ', 'al-majaz', 'figurative meaning', 'ج و ز', 'مَفْعَال'],
      ['العموم', 'العُمُومُ', 'al-ʿumum', 'generality', 'ع م م', 'فُعُول'],
      ['الخصوص', 'الخُصُوصُ', 'al-khusus', 'specificity', 'خ ص ص', 'فُعُول'],
      ['البيان', 'البَيَانُ', 'al-bayan', 'clarification', 'ب ي ن', 'فَعَال'],
      ['التفسير', 'التَّفْسِيرُ', 'al-tafsir', 'exegesis', 'ف س ر', 'تفعيل'],
      ['الاحتمال', 'الاحْتِمَالُ', 'al-ihtimal', 'possibility', 'ح م ل', 'افتعال'],
      ['القرينة', 'القَرِينَةُ', 'al-qarinah', 'contextual indicator', 'ق ر ن', 'فَعِيلَة'],
      ['التنزيل', 'التَّنْزِيلُ', 'al-tanzil', 'revelation', 'ن ز ل', 'تفعيل'],
      ['الآية', 'الآيَةُ', 'al-ayah', 'verse', 'أ ي ي', 'فَاعِلَة'],
      ['التلاوة', 'التِّلَاوَةُ', 'al-tilawah', 'recitation', 'ت ل و', 'فِعَالَة'],
      ['السياق', 'السِّيَاقُ', 'al-siyaq', 'context', 'س و ق', 'فِعَال'],
    ],
    verbs: [
      ['دل', 'دَلَّ', 'dalla', 'indicated', 'د ل ل', 'فعل ماضٍ ثلاثي مضاعف'],
      ['فسر', 'فَسَّرَ', 'fassara', 'explained', 'ف س ر', 'فعل ماضٍ مزيد (فعّل)'],
      ['اول', 'أَوَّلَ', 'awwala', 'interpreted', 'أ و ل', 'فعل ماضٍ مزيد (فعّل)'],
      ['خصص', 'خَصَّصَ', 'khassasa', 'specified', 'خ ص ص', 'فعل ماضٍ مزيد (فعّل)'],
      ['بين', 'بَيَّنَ', 'bayyana', 'clarified', 'ب ي ن', 'فعل ماضٍ مزيد (فعّل)'],
      ['احتمل', 'احْتَمَلَ', 'ihtamala', 'admitted possibility', 'ح م ل', 'فعل ماضٍ مزيد (افتعل)'],
      ['قيد', 'قَيَّدَ', 'qayyada', 'restricted', 'ق ي د', 'فعل ماضٍ مزيد (فعّل)'],
      ['نسخ', 'نَسَخَ', 'nasakha', 'abrogated', 'ن س خ', 'فعل ماضٍ ثلاثي مجرد'],
      ['انزل', 'أَنْزَلَ', 'anzala', 'revealed', 'ن ز ل', 'فعل ماضٍ مزيد (أفعل)'],
      ['تلا', 'تَلَا', 'tala', 'recited', 'ت ل و', 'فعل ماضٍ ثلاثي ناقص'],
    ],
    particles: [
      ['إن', 'إِنَّ', 'inna', 'indeed', '—', 'حرف توكيد ونصب'],
      ['ان', 'أَنْ', 'an', 'to/that', '—', 'حرف مصدري ونصب'],
      ['ما', 'مَا', 'ma', 'what / not', '—', 'حرف بحسب الاستعمال'],
      ['لا', 'لَا', 'la', 'not', '—', 'حرف نفي'],
      ['بل', 'بَلْ', 'bal', 'rather', '—', 'حرف إضراب'],
      ['ثم', 'ثُمَّ', 'thumma', 'then', '—', 'حرف عطف'],
    ],
  },
  3: {
    nouns: [
      ['المتواتر', 'المُتَوَاتِرُ', 'al-mutawatir', 'mass-transmitted report', 'و ت ر', 'اسم فاعل'],
      ['المشهور', 'المَشْهُورُ', 'al-mashhur', 'well-known report', 'ش ه ر', 'اسم مفعول'],
      ['الآحاد', 'الآحَادُ', 'al-ahad', 'solitary reports', 'أ ح د', 'جمع'],
      ['الراوي', 'الرَّاوِي', 'al-rawi', 'narrator', 'ر و ي', 'اسم فاعل'],
      ['الإسناد', 'الإِسْنَادُ', 'al-isnad', 'chain of transmission', 'س ن د', 'إفعال'],
      ['المتن', 'المَتْنُ', 'al-matn', 'text body', 'م ت ن', 'فَعْل'],
      ['الخبر', 'الخَبَرُ', 'al-khabar', 'report', 'خ ب ر', 'فَعَل'],
      ['الرواية', 'الرِّوَايَةُ', 'al-riwayah', 'narration', 'ر و ي', 'فِعَالَة'],
      ['العدالة', 'العَدَالَةُ', 'al-ʿadalah', 'uprightness', 'ع د ل', 'فَعَالَة'],
      ['الضبط', 'الضَّبْطُ', 'al-dabt', 'precision', 'ض ب ط', 'فَعْل'],
      ['الاتصال', 'الِاتِّصَالُ', 'al-ittisal', 'continuity', 'و ص ل', 'افتعال'],
      ['الانقطاع', 'الِانْقِطَاعُ', 'al-inqitaʿ', 'discontinuity', 'ق ط ع', 'انفعال'],
      ['القبول', 'القَبُولُ', 'al-qabul', 'acceptance', 'ق ب ل', 'فَعُول'],
      ['الرد', 'الرَّدُّ', 'al-radd', 'rejection', 'ر د د', 'فَعْل'],
      ['الجرح', 'الجَرْحُ', 'al-jarh', 'impugning narrators', 'ج ر ح', 'فَعْل'],
      ['التعديل', 'التَّعْدِيلُ', 'al-taʿdil', 'accrediting narrators', 'ع د ل', 'تفعيل'],
      ['الصحيح', 'الصَّحِيحُ', 'al-sahih', 'sound report', 'ص ح ح', 'فعيل'],
      ['الحسن', 'الحَسَنُ', 'al-hasan', 'fair report', 'ح س ن', 'فَعَل'],
      ['الضعيف', 'الضَّعِيفُ', 'al-daʿif', 'weak report', 'ض ع ف', 'فعيل'],
      ['الارسال', 'الإِرْسَالُ', 'al-irsal', 'mursal transmission', 'ر س ل', 'إفعال'],
      ['السماع', 'السَّمَاعُ', 'al-samaʿ', 'direct hearing', 'س م ع', 'فَعَال'],
      ['التحمل', 'التَّحَمُّلُ', 'al-tahammul', 'reception of hadith', 'ح م ل', 'تفعّل'],
      ['الأداء', 'الأَدَاءُ', 'al-adaʾ', 'delivery of hadith', 'أ د ي', 'أفعال'],
      ['الثقة', 'الثِّقَةُ', 'al-thiqah', 'reliable narrator', 'و ث ق', 'فِعَة'],
    ],
    verbs: [
      ['روى', 'رَوَى', 'rawa', 'narrated', 'ر و ي', 'فعل ماضٍ ثلاثي ناقص'],
      ['حدث', 'حَدَّثَ', 'haddatha', 'reported/told', 'ح د ث', 'فعل ماضٍ مزيد (فعّل)'],
      ['نقل', 'نَقَلَ', 'naqala', 'transmitted', 'ن ق ل', 'فعل ماضٍ ثلاثي مجرد'],
      ['صح', 'صَحَّ', 'sahha', 'was sound', 'ص ح ح', 'فعل ماضٍ ثلاثي مضاعف'],
      ['ضعف', 'ضَعُفَ', 'daʿufa', 'was weak', 'ض ع ف', 'فعل ماضٍ ثلاثي مجرد'],
      ['قبل', 'قَبِلَ', 'qabila', 'accepted', 'ق ب ل', 'فعل ماضٍ ثلاثي مجرد'],
      ['رد', 'رَدَّ', 'radda', 'rejected', 'ر د د', 'فعل ماضٍ ثلاثي مضاعف'],
      ['ضبط', 'ضَبَطَ', 'dabata', 'memorized precisely', 'ض ب ط', 'فعل ماضٍ ثلاثي مجرد'],
      ['سمع', 'سَمِعَ', 'samiʿa', 'heard', 'س م ع', 'فعل ماضٍ ثلاثي مجرد'],
      ['اتصل', 'اتَّصَلَ', 'ittasala', 'was connected', 'و ص ل', 'فعل ماضٍ مزيد (افتعل)'],
    ],
    particles: [
      ['قد', 'قَدْ', 'qad', 'indeed / already', '—', 'حرف تحقيق'],
      ['لن', 'لَنْ', 'lan', 'will not', '—', 'حرف نفي ونصب'],
      ['لم', 'لَمْ', 'lam', 'did not', '—', 'حرف نفي وجزم'],
      ['هل', 'هَلْ', 'hal', 'interrogative particle', '—', 'حرف استفهام'],
      ['ام', 'أَمْ', 'am', 'or (interrogative)', '—', 'حرف عطف'],
      ['حتى', 'حَتَّى', 'hatta', 'until', '—', 'حرف جر/غاية'],
    ],
  },
  4: {
    nouns: [
      ['الأمر', 'الأَمْرُ', 'al-amr', 'command', 'أ م ر', 'فَعْل'],
      ['النهي', 'النَّهْيُ', 'al-nahy', 'prohibition', 'ن ه ي', 'فَعْل'],
      ['الوجوب', 'الوُجُوبُ', 'al-wujub', 'obligation', 'و ج ب', 'فُعُول'],
      ['الندب', 'النَّدْبُ', 'al-nadb', 'recommendation', 'ن د ب', 'فَعْل'],
      ['الإباحة', 'الإِبَاحَةُ', 'al-ibahah', 'permissibility', 'ب و ح', 'إفعال'],
      ['القرينة', 'القَرِينَةُ', 'al-qarinah', 'contextual indicator', 'ق ر ن', 'فَعِيلَة'],
      ['الصيغة', 'الصِّيغَةُ', 'al-sighah', 'formulation', 'ص و غ', 'فِعْلَة'],
      ['الامتثال', 'الِامْتِثَالُ', 'al-imtithal', 'compliance', 'م ث ل', 'افتعال'],
      ['المأمور', 'المَأْمُورُ', 'al-maʾmur', 'the commanded act', 'أ م ر', 'اسم مفعول'],
      ['المنهي', 'المَنْهِيُّ', 'al-manhiyy', 'the prohibited act', 'ن ه ي', 'اسم مفعول'],
      ['الفور', 'الفَوْرُ', 'al-fawr', 'immediacy', 'ف و ر', 'فَعْل'],
      ['التراخي', 'التَّرَاخِي', 'al-tarakhi', 'delay/deferment', 'ر خ و', 'تفاعل'],
      ['التكرار', 'التَّكْرَارُ', 'al-tikrar', 'repetition', 'ك ر ر', 'تفعال'],
      ['المرة', 'المَرَّةُ', 'al-marrāh', 'single occurrence', 'م ر ر', 'فَعْلَة'],
      ['الطلب', 'الطَّلَبُ', 'al-talab', 'request/demand', 'ط ل ب', 'فَعَل'],
      ['الاقتضاء', 'الاقْتِضَاءُ', 'al-iqtidaʾ', 'necessary implication', 'ق ض ي', 'افتعال'],
      ['التحريم', 'التَّحْرِيمُ', 'al-tahrim', 'prohibition', 'ح ر م', 'تفعيل'],
      ['الكراهة', 'الكَرَاهَةُ', 'al-karahah', 'dislikedness', 'ك ر ه', 'فَعَالَة'],
      ['الرخصة', 'الرُّخْصَةُ', 'al-rukhsah', 'dispensation', 'ر خ ص', 'فُعْلَة'],
      ['العزيمة', 'العَزِيمَةُ', 'al-ʿazimah', 'strict rule', 'ع ز م', 'فَعِيلَة'],
      ['القصد', 'القَصْدُ', 'al-qasd', 'intent', 'ق ص د', 'فَعْل'],
      ['الإرادة', 'الإِرَادَةُ', 'al-iradah', 'will', 'ر و د', 'إفعال'],
      ['الامتناع', 'الِامْتِنَاعُ', 'al-imtinaʿ', 'abstention', 'م ن ع', 'افتعال'],
      ['الترك', 'التَّرْكُ', 'al-tark', 'leaving/abandonment', 'ت ر ك', 'فَعْل'],
    ],
    verbs: [
      ['أمر', 'أَمَرَ', 'amara', 'commanded', 'أ م ر', 'فعل ماضٍ ثلاثي مجرد'],
      ['نهى', 'نَهَى', 'naha', 'forbade', 'ن ه ي', 'فعل ماضٍ ثلاثي ناقص'],
      ['امتثل', 'امْتَثَلَ', 'imtathala', 'complied', 'م ث ل', 'فعل ماضٍ مزيد (افتعل)'],
      ['اقتضى', 'اقْتَضَى', 'iqtada', 'entailed', 'ق ض ي', 'فعل ماضٍ مزيد (افتعل)'],
      ['دل', 'دَلَّ', 'dalla', 'indicated', 'د ل ل', 'فعل ماضٍ ثلاثي مضاعف'],
      ['أوجب', 'أَوْجَبَ', 'awjaba', 'made obligatory', 'و ج ب', 'فعل ماضٍ مزيد (أفعل)'],
      ['أباح', 'أَبَاحَ', 'abaha', 'made permissible', 'ب و ح', 'فعل ماضٍ مزيد (أفعل)'],
      ['كره', 'كَرِهَ', 'kariha', 'disliked', 'ك ر ه', 'فعل ماضٍ ثلاثي مجرد'],
      ['رخص', 'رَخَّصَ', 'rakhkhasa', 'granted concession', 'ر خ ص', 'فعل ماضٍ مزيد (فعّل)'],
      ['ترك', 'تَرَكَ', 'taraka', 'left/abandoned', 'ت ر ك', 'فعل ماضٍ ثلاثي مجرد'],
    ],
    particles: [
      ['لام', 'لِـ', 'li-', 'lam of command', '—', 'حرف أمر'],
      ['لا', 'لَا', 'la', 'prohibitive / negative', '—', 'حرف نهي/نفي'],
      ['ف', 'فَ', 'fa', 'then/so', '—', 'حرف عطف'],
      ['و', 'وَ', 'wa', 'and', '—', 'حرف عطف'],
      ['او', 'أَوْ', 'aw', 'or', '—', 'حرف عطف'],
      ['اذا', 'إِذَا', 'idha', 'when', '—', 'ظرف يتضمن معنى الشرط'],
    ],
  },
  5: {
    nouns: [
      ['العام', 'العَامُّ', 'al-ʿamm', 'general expression', 'ع م م', 'اسم فاعل'],
      ['الخاص', 'الخَاصُّ', 'al-khass', 'specific expression', 'خ ص ص', 'اسم فاعل'],
      ['العموم', 'العُمُومُ', 'al-ʿumum', 'generality', 'ع م م', 'فُعُول'],
      ['الخصوص', 'الخُصُوصُ', 'al-khusus', 'specificity', 'خ ص ص', 'فُعُول'],
      ['التخصيص', 'التَّخْصِيصُ', 'al-takhsis', 'specification', 'خ ص ص', 'تفعيل'],
      ['المخصص', 'المُخَصِّصُ', 'al-mukhassis', 'specifier', 'خ ص ص', 'اسم فاعل'],
      ['الاستثناء', 'الِاسْتِثْنَاءُ', 'al-istithnaʾ', 'exception', 'ث ن ي', 'استفعال'],
      ['الشرط', 'الشَّرْطُ', 'al-shart', 'condition', 'ش ر ط', 'فَعْل'],
      ['الصفة', 'الصِّفَةُ', 'al-sifah', 'qualifier', 'و ص ف', 'فِعْلَة'],
      ['الغاية', 'الغَايَةُ', 'al-ghayah', 'limit/end-point', 'غ ي ي', 'فَاعِلَة'],
      ['البدل', 'البَدَلُ', 'al-badal', 'substitution', 'ب د ل', 'فَعَل'],
      ['البيان', 'البَيَانُ', 'al-bayan', 'clarifying statement', 'ب ي ن', 'فَعَال'],
      ['المتصل', 'المُتَّصِلُ', 'al-muttasil', 'connected qualifier', 'و ص ل', 'اسم فاعل'],
      ['المنفصل', 'المُنْفَصِلُ', 'al-munfasil', 'separate qualifier', 'ف ص ل', 'اسم فاعل'],
      ['اللفظ', 'اللَّفْظُ', 'al-lafz', 'wording', 'ل ف ظ', 'فَعْل'],
      ['الجنس', 'الجِنْسُ', 'al-jins', 'genus/class', 'ج ن س', 'فِعْل'],
      ['الجمع', 'الجَمْعُ', 'al-jamʿ', 'plurality/collective', 'ج م ع', 'فَعْل'],
      ['المفرد', 'المُفْرَدُ', 'al-mufrad', 'singular', 'ف ر د', 'اسم مفعول'],
      ['النكرة', 'النَّكِرَةُ', 'al-nakirah', 'indefinite noun', 'ن ك ر', 'فَعِلَة'],
      ['المعرفة', 'المَعْرِفَةُ', 'al-maʿrifah', 'definite noun', 'ع ر ف', 'مَفْعِلَة'],
      ['الاستغراق', 'الِاسْتِغْرَاقُ', 'al-istighraq', 'total inclusion', 'غ ر ق', 'استفعال'],
      ['البعض', 'البَعْضُ', 'al-baʿd', 'some/part', 'ب ع ض', 'فَعْل'],
      ['الكل', 'الكُلُّ', 'al-kull', 'whole/all', 'ك ل ل', 'فُعْل'],
      ['الحكم', 'الحُكْمُ', 'al-hukm', 'ruling', 'ح ك م', 'فُعْل'],
    ],
    verbs: [
      ['عم', 'عَمَّ', 'ʿamma', 'included generally', 'ع م م', 'فعل ماضٍ ثلاثي مضاعف'],
      ['خص', 'خَصَّ', 'khassa', 'specified', 'خ ص ص', 'فعل ماضٍ ثلاثي مضاعف'],
      ['استثنى', 'اسْتَثْنَى', 'istathna', 'excepted', 'ث ن ي', 'فعل ماضٍ مزيد (استفعل)'],
      ['قيد', 'قَيَّدَ', 'qayyada', 'qualified/restricted', 'ق ي د', 'فعل ماضٍ مزيد (فعّل)'],
      ['بين', 'بَيَّنَ', 'bayyana', 'clarified', 'ب ي ن', 'فعل ماضٍ مزيد (فعّل)'],
      ['شمل', 'شَمِلَ', 'shamila', 'encompassed', 'ش م ل', 'فعل ماضٍ ثلاثي مجرد'],
      ['دل', 'دَلَّ', 'dalla', 'indicated', 'د ل ل', 'فعل ماضٍ ثلاثي مضاعف'],
      ['تناول', 'تَنَاوَلَ', 'tanawala', 'covered/included', 'ن و ل', 'فعل ماضٍ مزيد (تفاعل)'],
      ['أخرج', 'أَخْرَجَ', 'akhraja', 'excluded', 'خ ر ج', 'فعل ماضٍ مزيد (أفعل)'],
      ['اشترط', 'اشْتَرَطَ', 'ishtarata', 'stipulated', 'ش ر ط', 'فعل ماضٍ مزيد (افتعل)'],
    ],
    particles: [
      ['إلا', 'إِلَّا', 'illa', 'except', '—', 'أداة استثناء'],
      ['حتى', 'حَتَّى', 'hatta', 'until/up to', '—', 'حرف غاية'],
      ['بل', 'بَلْ', 'bal', 'rather', '—', 'حرف إضراب'],
      ['لكن', 'لَكِنْ', 'lakin', 'but', '—', 'حرف استدراك'],
      ['او', 'أَوْ', 'aw', 'or', '—', 'حرف عطف'],
      ['ثم', 'ثُمَّ', 'thumma', 'then', '—', 'حرف عطف'],
    ],
  },
  6: {
    nouns: [
      ['المطلق', 'المُطْلَقُ', 'al-mutlaq', 'unrestricted term', 'ط ل ق', 'اسم مفعول'],
      ['المقيد', 'المُقَيَّدُ', 'al-muqayyad', 'restricted term', 'ق ي د', 'اسم مفعول'],
      ['الإطلاق', 'الإِطْلَاقُ', 'al-itlaq', 'unrestriction', 'ط ل ق', 'إفعال'],
      ['التقييد', 'التَّقْيِيدُ', 'al-taqyid', 'restriction', 'ق ي د', 'تفعيل'],
      ['الحمل', 'الحَمْلُ', 'al-haml', 'carrying/attribution', 'ح م ل', 'فَعْل'],
      ['الاتحاد', 'الِاتِّحَادُ', 'al-ittihad', 'unity', 'و ح د', 'افتعال'],
      ['السبب', 'السَّبَبُ', 'al-sabab', 'cause', 'س ب ب', 'فَعَل'],
      ['الحكم', 'الحُكْمُ', 'al-hukm', 'ruling', 'ح ك م', 'فُعْل'],
      ['الوصف', 'الوَصْفُ', 'al-wasf', 'attribute', 'و ص ف', 'فَعْل'],
      ['القيد', 'القَيْدُ', 'al-qayd', 'restrictive qualifier', 'ق ي د', 'فَعْل'],
      ['الجنس', 'الجِنْسُ', 'al-jins', 'genus', 'ج ن س', 'فِعْل'],
      ['النوع', 'النَّوْعُ', 'al-nawʿ', 'type/species', 'ن و ع', 'فَعْل'],
      ['الرقبة', 'الرَّقَبَةُ', 'al-raqabah', 'slave-neck/person', 'ر ق ب', 'فَعَلَة'],
      ['الصيام', 'الصِّيَامُ', 'al-siyam', 'fasting', 'ص و م', 'فِعَال'],
      ['الكفارة', 'الكَفَّارَةُ', 'al-kaffarah', 'expiation', 'ك ف ر', 'فَعَّالَة'],
      ['القتل', 'القَتْلُ', 'al-qatl', 'killing', 'ق ت ل', 'فَعْل'],
      ['الخطأ', 'الخَطَأُ', 'al-khataʾ', 'mistake', 'خ ط أ', 'فَعَل'],
      ['العتق', 'العِتْقُ', 'al-ʿitq', 'manumission', 'ع ت ق', 'فِعْل'],
      ['اليمين', 'اليَمِينُ', 'al-yamin', 'oath', 'ي م ن', 'فعيل'],
      ['الجزاء', 'الجَزَاءُ', 'al-jazaʾ', 'requital/penalty', 'ج ز ي', 'فَعَال'],
      ['الدلالة', 'الدَّلَالَةُ', 'al-dalalah', 'indication', 'د ل ل', 'فَعَالَة'],
      ['الترتيب', 'التَّرْتِيبُ', 'al-tartib', 'ordering', 'ر ت ب', 'تفعيل'],
      ['الجمع', 'الجَمْعُ', 'al-jamʿ', 'harmonization', 'ج م ع', 'فَعْل'],
      ['الترجيح', 'التَّرْجِيحُ', 'al-tarjih', 'preference', 'ر ج ح', 'تفعيل'],
    ],
    verbs: [
      ['أطلق', 'أَطْلَقَ', 'atlaqa', 'left unrestricted', 'ط ل ق', 'فعل ماضٍ مزيد (أفعل)'],
      ['قيد', 'قَيَّدَ', 'qayyada', 'restricted', 'ق ي د', 'فعل ماضٍ مزيد (فعّل)'],
      ['حمل', 'حَمَلَ', 'hamala', 'carried/attributed', 'ح م ل', 'فعل ماضٍ ثلاثي مجرد'],
      ['اتحد', 'اتَّحَدَ', 'ittahada', 'became unified', 'و ح د', 'فعل ماضٍ مزيد (افتعل)'],
      ['اختلف', 'اخْتَلَفَ', 'ikhtalafa', 'differed', 'خ ل ف', 'فعل ماضٍ مزيد (افتعل)'],
      ['جمع', 'جَمَعَ', 'jamaʿa', 'combined', 'ج م ع', 'فعل ماضٍ ثلاثي مجرد'],
      ['رجح', 'رَجَّحَ', 'rajjaha', 'preferred', 'ر ج ح', 'فعل ماضٍ مزيد (فعّل)'],
      ['اشترط', 'اشْتَرَطَ', 'ishtarata', 'stipulated', 'ش ر ط', 'فعل ماضٍ مزيد (افتعل)'],
      ['قارن', 'قَارَنَ', 'qarana', 'compared', 'ق ر ن', 'فعل ماضٍ مزيد (فاعل)'],
      ['فصل', 'فَصَلَ', 'fasala', 'distinguished/separated', 'ف ص ل', 'فعل ماضٍ ثلاثي مجرد'],
    ],
    particles: [
      ['في', 'فِي', 'fi', 'in', '—', 'حرف جر'],
      ['مع', 'مَعَ', 'maʿa', 'with', '—', 'ظرف ملازم للنصب'],
      ['عن', 'عَنْ', 'ʿan', 'from/about', '—', 'حرف جر'],
      ['من', 'مِنْ', 'min', 'from', '—', 'حرف جر'],
      ['إلى', 'إِلَى', 'ila', 'to', '—', 'حرف جر'],
      ['الباء', 'البَاءُ', 'al-baʾ', 'preposition bi-', '—', 'حرف جر'],
    ],
  },
  7: {
    nouns: [
      ['المجمل', 'المُجْمَلُ', 'al-mujmal', 'ambiguous text', 'ج م ل', 'اسم مفعول'],
      ['المبين', 'المُبَيِّنُ', 'al-mubayyin', 'clarified text', 'ب ي ن', 'اسم فاعل'],
      ['الإجمال', 'الإِجْمَالُ', 'al-ijmal', 'ambiguity', 'ج م ل', 'إفعال'],
      ['البيان', 'البَيَانُ', 'al-bayan', 'clarification', 'ب ي ن', 'فَعَال'],
      ['التفسير', 'التَّفْسِيرُ', 'al-tafsir', 'interpretation', 'ف س ر', 'تفعيل'],
      ['المفسر', 'المُفَسِّرُ', 'al-mufassir', 'clear-explained text', 'ف س ر', 'اسم فاعل'],
      ['المحكم', 'المُحْكَمُ', 'al-muhkam', 'unequivocal text', 'ح ك م', 'اسم مفعول'],
      ['المتشابه', 'المُتَشَابِهُ', 'al-mutashabih', 'ambivalent text', 'ش ب ه', 'اسم فاعل'],
      ['الخفاء', 'الخَفَاءُ', 'al-khafaʾ', 'hiddenness', 'خ ف ي', 'فَعَال'],
      ['الوضوح', 'الوُضُوحُ', 'al-wuduh', 'clarity', 'و ض ح', 'فُعُول'],
      ['الاحتمال', 'الاحْتِمَالُ', 'al-ihtimal', 'multiple possibility', 'ح م ل', 'افتعال'],
      ['الاشتراك', 'الِاشْتِرَاكُ', 'al-ishtirak', 'lexical sharedness', 'ش ر ك', 'افتعال'],
      ['التأويل', 'التَّأْوِيلُ', 'al-taʾwil', 'interpretive redirection', 'أ و ل', 'تفعيل'],
      ['الدليل', 'الدَّلِيلُ', 'al-dalil', 'proof', 'د ل ل', 'فعيل'],
      ['القرينة', 'القَرِينَةُ', 'al-qarinah', 'indicator', 'ق ر ن', 'فَعِيلَة'],
      ['المراد', 'المُرَادُ', 'al-murad', 'intended meaning', 'ر و د', 'اسم مفعول'],
      ['المعنى', 'المَعْنَى', 'al-maʿna', 'meaning', 'ع ن ي', 'مَفْعَل'],
      ['الاستدلال', 'الِاسْتِدْلَالُ', 'al-istidlal', 'argumentation', 'د ل ل', 'استفعال'],
      ['الإيضاح', 'الإِيضَاحُ', 'al-idah', 'elucidation', 'و ض ح', 'إفعال'],
      ['الإبهام', 'الإِبْهَامُ', 'al-ibham', 'obscurity', 'ب ه م', 'إفعال'],
      ['النص', 'النَّصُّ', 'al-nass', 'explicit wording', 'ن ص ص', 'فَعْل'],
      ['الظاهر', 'الظَّاهِرُ', 'al-zahir', 'apparent wording', 'ظ ه ر', 'اسم فاعل'],
      ['المؤول', 'المُؤَوَّلُ', 'al-muʾawwal', 'interpreted wording', 'أ و ل', 'اسم مفعول'],
      ['الحكم', 'الحُكْمُ', 'al-hukm', 'ruling', 'ح ك م', 'فُعْل'],
    ],
    verbs: [
      ['أجمل', 'أَجْمَلَ', 'ajmala', 'rendered concise/ambiguous', 'ج م ل', 'فعل ماضٍ مزيد (أفعل)'],
      ['بين', 'بَيَّنَ', 'bayyana', 'clarified', 'ب ي ن', 'فعل ماضٍ مزيد (فعّل)'],
      ['فسر', 'فَسَّرَ', 'fassara', 'explained', 'ف س ر', 'فعل ماضٍ مزيد (فعّل)'],
      ['أوضح', 'أَوْضَحَ', 'awdaha', 'made clear', 'و ض ح', 'فعل ماضٍ مزيد (أفعل)'],
      ['أبهم', 'أَبْهَمَ', 'abhama', 'made obscure', 'ب ه م', 'فعل ماضٍ مزيد (أفعل)'],
      ['احتمل', 'احْتَمَلَ', 'ihtamala', 'admitted possibility', 'ح م ل', 'فعل ماضٍ مزيد (افتعل)'],
      ['دل', 'دَلَّ', 'dalla', 'indicated', 'د ل ل', 'فعل ماضٍ ثلاثي مضاعف'],
      ['أول', 'أَوَّلَ', 'awwala', 'interpreted', 'أ و ل', 'فعل ماضٍ مزيد (فعّل)'],
      ['فصل', 'فَصَّلَ', 'fassala', 'detailed', 'ف ص ل', 'فعل ماضٍ مزيد (فعّل)'],
      ['شرح', 'شَرَحَ', 'sharaha', 'expounded', 'ش ر ح', 'فعل ماضٍ ثلاثي مجرد'],
    ],
    particles: [
      ['إن', 'إِنَّ', 'inna', 'indeed', '—', 'حرف توكيد ونصب'],
      ['ان', 'أَنْ', 'an', 'to/that', '—', 'حرف مصدري ونصب'],
      ['ما', 'مَا', 'ma', 'what/not', '—', 'حرف بحسب الاستعمال'],
      ['لا', 'لَا', 'la', 'not', '—', 'حرف نفي'],
      ['بل', 'بَلْ', 'bal', 'rather', '—', 'حرف إضراب'],
      ['لكن', 'لَكِنْ', 'lakin', 'but', '—', 'حرف استدراك'],
    ],
  },
  8: {
    nouns: [
      ['القياس', 'القِيَاسُ', 'al-qiyas', 'analogy', 'ق ي س', 'فعال'],
      ['الاجتهاد', 'الِاجْتِهَادُ', 'al-ijtihad', 'independent reasoning', 'ج ه د', 'افتعال'],
      ['الأصل', 'الأَصْلُ', 'al-asl', 'original case', 'أ ص ل', 'فَعْل'],
      ['الفرع', 'الفَرْعُ', 'al-farʿ', 'new case/branch', 'ف ر ع', 'فَعْل'],
      ['العلة', 'العِلَّةُ', 'al-ʿillah', 'effective cause', 'ع ل ل', 'فِعَّة'],
      ['الحكم', 'الحُكْمُ', 'al-hukm', 'ruling', 'ح ك م', 'فُعْل'],
      ['الجامع', 'الجَامِعُ', 'al-jamiʿ', 'common factor', 'ج م ع', 'اسم فاعل'],
      ['المقيس', 'المَقِيسُ', 'al-maqis', 'analogized case', 'ق ي س', 'اسم مفعول'],
      ['المقيس عليه', 'المَقِيسُ عَلَيْهِ', 'al-maqis ʿalayh', 'case analogized upon', 'ق ي س', 'مركب إضافي'],
      ['الاستنباط', 'الِاسْتِنْبَاطُ', 'al-istinbat', 'derivation', 'ن ب ط', 'استفعال'],
      ['النظر', 'النَّظَرُ', 'al-nazar', 'systematic reasoning', 'ن ظ ر', 'فَعَل'],
      ['الترجيح', 'التَّرْجِيحُ', 'al-tarjih', 'preference', 'ر ج ح', 'تفعيل'],
      ['المناسبة', 'المُنَاسَبَةُ', 'al-munasabah', 'suitability', 'ن س ب', 'مفاعلة'],
      ['التأثير', 'التَّأْثِيرُ', 'al-taʾthir', 'causal effect', 'أ ث ر', 'تفعيل'],
      ['الدوران', 'الدَّوَرَانُ', 'al-dawaran', 'concomitance', 'د و ر', 'فَعَلَان'],
      ['الطرد', 'الطَّرْدُ', 'al-tard', 'constant correlation', 'ط ر د', 'فَعْل'],
      ['السبر', 'السَّبْرُ', 'al-sabr', 'analytical probing', 'س ب ر', 'فَعْل'],
      ['التقسيم', 'التَّقْسِيمُ', 'al-taqsim', 'classification', 'ق س م', 'تفعيل'],
      ['المجتهد', 'المُجْتَهِدُ', 'al-mujtahid', 'jurist-exercising ijtihad', 'ج ه د', 'اسم فاعل'],
      ['المقلد', 'المُقَلِّدُ', 'al-muqallid', 'follower of precedent', 'ق ل د', 'اسم فاعل'],
      ['الفتوى', 'الفَتْوَى', 'al-fatwa', 'legal verdict', 'ف ت ي', 'فَعْلَى'],
      ['الدليل', 'الدَّلِيلُ', 'al-dalil', 'evidence', 'د ل ل', 'فعيل'],
      ['الإجماع', 'الإِجْمَاعُ', 'al-ijmaʿ', 'consensus', 'ج م ع', 'إفعال'],
      ['الاستصلاح', 'الِاسْتِصْلَاحُ', 'al-istislah', 'consideration of welfare', 'ص ل ح', 'استفعال'],
    ],
    verbs: [
      ['قاس', 'قَاسَ', 'qasa', 'made analogy', 'ق ي س', 'فعل ماضٍ ثلاثي أجوف'],
      ['اجتهد', 'اجْتَهَدَ', 'ijtahada', 'exerted legal reasoning', 'ج ه د', 'فعل ماضٍ مزيد (افتعل)'],
      ['استنبط', 'اسْتَنْبَطَ', 'istanbata', 'derived', 'ن ب ط', 'فعل ماضٍ مزيد (استفعل)'],
      ['رجح', 'رَجَّحَ', 'rajjaha', 'preferred one view', 'ر ج ح', 'فعل ماضٍ مزيد (فعّل)'],
      ['علل', 'عَلَّلَ', 'ʿallala', 'identified cause', 'ع ل ل', 'فعل ماضٍ مزيد (فعّل)'],
      ['اعتبر', 'اعْتَبَرَ', 'iʿtabara', 'considered', 'ع ب ر', 'فعل ماضٍ مزيد (افتعل)'],
      ['الحق', 'أَلْحَقَ', 'alhaqa', 'attached/extended ruling', 'ل ح ق', 'فعل ماضٍ مزيد (أفعل)'],
      ['الغى', 'أَلْغَى', 'algha', 'nullified', 'ل غ و', 'فعل ماضٍ مزيد (أفعل)'],
      ['قارن', 'قَارَنَ', 'qarana', 'compared', 'ق ر ن', 'فعل ماضٍ مزيد (فاعل)'],
      ['حكم', 'حَكَمَ', 'hakama', 'issued judgment', 'ح ك م', 'فعل ماضٍ ثلاثي مجرد'],
    ],
    particles: [
      ['إذا', 'إِذَا', 'idha', 'when', '—', 'ظرف يتضمن معنى الشرط'],
      ['لو', 'لَوْ', 'law', 'if (counterfactual)', '—', 'حرف شرط'],
      ['إن', 'إِنْ', 'in', 'if', '—', 'حرف شرط'],
      ['حتى', 'حَتَّى', 'hatta', 'until', '—', 'حرف غاية'],
      ['ثم', 'ثُمَّ', 'thumma', 'then', '—', 'حرف عطف'],
      ['او', 'أَوْ', 'aw', 'or', '—', 'حرف عطف'],
    ],
  },
};

function mapTuple(week: number, tuple: TermTuple, category: MasaarTermCategory, wordType: string, irab: string): MasaarTermInput {
  const [arabicText, vowelled, transliteration, translation, root, sarf] = tuple;
  return {
    arabicText,
    transliteration,
    translation,
    metadata: {
      category,
      vowelled,
      root,
      wordType,
      irab,
      sarf,
      passageWeek: week,
    },
  };
}

const MASAAR_TERMS_BY_WEEK: Record<number, MasaarTermInput[]> = Object.fromEntries(
  Object.entries(WEEKLY_TUPLES).map(([weekText, tuples]) => {
    const week = Number(weekText);
    const weekTerms: MasaarTermInput[] = [
      ...tuples.nouns.map((tuple) =>
        mapTuple(week, tuple, 'NOUN', 'noun', 'اسم معرب يُرفع بالضمة ويُنصب بالفتحة ويُجر بالكسرة بحسب الموقع'),
      ),
      ...tuples.verbs.map((tuple) => mapTuple(week, tuple, 'VERB', 'verb', 'فعل ماضٍ مبني على الفتح')),
      ...tuples.particles.map((tuple) => mapTuple(week, tuple, 'PARTICLE', 'particle', 'حرف مبني لا محل له من الإعراب')),
    ];
    return [week, weekTerms];
  }),
) as Record<number, MasaarTermInput[]>;

export async function seedMasaarTerms() {
  console.log("🌱 Seeding al-Masār Arabic terms (Usul al-Shashi vocabulary)...");

  const course = await prisma.course.findUnique({
    where: { id: MASAAR_COURSE_ID },
    include: { units: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!course) {
    throw new Error(`Course not found: ${MASAAR_COURSE_ID}`);
  }

  if (course.units.length < 8) {
    throw new Error(`Expected 8 units for ${MASAAR_COURSE_ID}, found ${course.units.length}`);
  }

  await prisma.arabicTerm.deleteMany({
    where: { unitId: { in: course.units.map((u) => u.id) } },
  });

  let totalCreated = 0;

  for (const unit of course.units) {
    const week = unit.orderIndex + 1;
    const terms = MASAAR_TERMS_BY_WEEK[week] ?? [];

    if (terms.length === 0) {
      console.warn(`⚠️ No terms defined for week ${week} (${unit.title})`);
      continue;
    }

    await prisma.arabicTerm.createMany({
      data: terms.map((termData) => ({
        arabicText: termData.arabicText,
        transliteration: termData.transliteration,
        translation: termData.translation,
        metadata: termData.metadata,
        unitId: unit.id,
      })),
    });
    totalCreated += terms.length;

    console.log(`   ✅ Week ${week}: created ${terms.length} Arabic terms`);
  }

  console.log(`🎉 Completed al-Masār terms seed: ${totalCreated} Arabic terms across 8 weeks.`);
}

async function main() {
  try {
    await seedMasaarTerms();
  } catch (error) {
    console.error('❌ Error seeding al-Masār terms:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
