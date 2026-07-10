/**
 * ChildNamesProgressPage — 99 Names of Allāh cross-stage mastery grid.
 *
 * Design: visually stunning calligraphic grid, status-tinted cards,
 * milestone celebrations, child-first touch targets.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildAuthStore } from '@/stores/childAuthStore';
import { useDuaProgressStore } from '@/stores/duaProgressStore';
import { STATUS_CONFIG } from '@/types/duaProgress.types';
import type { NameProgressItem, SrsStatus } from '@/types/duaProgress.types';

// ── Static 99 Names dataset ──────────────────────────────────────────────────

interface StaticName {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
}

const ALL_99_NAMES: StaticName[] = [
  { number: 1,  arabic: 'ٱلرَّحْمَٰن',               transliteration: 'Ar-Raḥmān',          meaning: 'The Most Gracious' },
  { number: 2,  arabic: 'ٱلرَّحِيم',                  transliteration: 'Ar-Raḥīm',           meaning: 'The Most Merciful' },
  { number: 3,  arabic: 'ٱلْمَلِك',                   transliteration: 'Al-Malik',            meaning: 'The King' },
  { number: 4,  arabic: 'ٱلْقُدُّوس',                transliteration: 'Al-Quddūs',           meaning: 'The Most Holy' },
  { number: 5,  arabic: 'ٱلسَّلَام',                 transliteration: 'As-Salām',            meaning: 'The Source of Peace' },
  { number: 6,  arabic: 'ٱلْمُؤْمِن',                transliteration: "Al-Mu'min",           meaning: 'The Guardian of Faith' },
  { number: 7,  arabic: 'ٱلْمُهَيْمِن',              transliteration: 'Al-Muhaymin',         meaning: 'The Protector' },
  { number: 8,  arabic: 'ٱلْعَزِيز',                 transliteration: "Al-'Azīz",            meaning: 'The Almighty' },
  { number: 9,  arabic: 'ٱلْجَبَّار',                transliteration: 'Al-Jabbār',           meaning: 'The Compeller' },
  { number: 10, arabic: 'ٱلْمُتَكَبِّر',             transliteration: 'Al-Mutakabbir',       meaning: 'The Supreme' },
  { number: 11, arabic: 'ٱلْخَالِق',                 transliteration: 'Al-Khāliq',           meaning: 'The Creator' },
  { number: 12, arabic: 'ٱلْبَارِئ',                 transliteration: "Al-Bāri'",            meaning: 'The Originator' },
  { number: 13, arabic: 'ٱلْمُصَوِّر',               transliteration: 'Al-Muṣawwir',         meaning: 'The Fashioner' },
  { number: 14, arabic: 'ٱلْغَفَّار',                transliteration: 'Al-Ghaffār',          meaning: 'The Forgiver' },
  { number: 15, arabic: 'ٱلْقَهَّار',                transliteration: 'Al-Qahhār',           meaning: 'The Subduer' },
  { number: 16, arabic: 'ٱلْوَهَّاب',                transliteration: 'Al-Wahhāb',           meaning: 'The Bestower' },
  { number: 17, arabic: 'ٱلرَّزَّاق',                transliteration: 'Ar-Razzāq',           meaning: 'The Provider' },
  { number: 18, arabic: 'ٱلْفَتَّاح',                transliteration: 'Al-Fattāḥ',           meaning: 'The Opener' },
  { number: 19, arabic: 'ٱلْعَلِيم',                 transliteration: "Al-'Alīm",            meaning: 'The All-Knowing' },
  { number: 20, arabic: 'ٱلْقَابِض',                 transliteration: 'Al-Qābiḍ',           meaning: 'The Restrainer' },
  { number: 21, arabic: 'ٱلْبَاسِط',                 transliteration: 'Al-Bāsiṭ',           meaning: 'The Expander' },
  { number: 22, arabic: 'ٱلْخَافِض',                 transliteration: 'Al-Khāfiḍ',          meaning: 'The Abaser' },
  { number: 23, arabic: 'ٱلرَّافِع',                 transliteration: "Ar-Rāfi'",            meaning: 'The Exalter' },
  { number: 24, arabic: 'ٱلْمُعِزّ',                 transliteration: "Al-Mu'izz",           meaning: 'The Bestower of Honour' },
  { number: 25, arabic: 'ٱلْمُذِلّ',                 transliteration: 'Al-Mudhill',          meaning: 'The Humiliator' },
  { number: 26, arabic: 'ٱلسَّمِيع',                 transliteration: "As-Samī'",            meaning: 'The All-Hearing' },
  { number: 27, arabic: 'ٱلْبَصِير',                 transliteration: 'Al-Baṣīr',            meaning: 'The All-Seeing' },
  { number: 28, arabic: 'ٱلْحَكَم',                  transliteration: 'Al-Ḥakam',            meaning: 'The Judge' },
  { number: 29, arabic: 'ٱلْعَدْل',                  transliteration: "Al-'Adl",             meaning: 'The Just' },
  { number: 30, arabic: 'ٱللَّطِيف',                 transliteration: 'Al-Laṭīf',            meaning: 'The Subtle' },
  { number: 31, arabic: 'ٱلْخَبِير',                 transliteration: 'Al-Khabīr',           meaning: 'The All-Aware' },
  { number: 32, arabic: 'ٱلْحَلِيم',                 transliteration: 'Al-Ḥalīm',            meaning: 'The Forbearing' },
  { number: 33, arabic: 'ٱلْعَظِيم',                 transliteration: "Al-'Aẓīm",            meaning: 'The Magnificent' },
  { number: 34, arabic: 'ٱلْغَفُور',                 transliteration: 'Al-Ghafūr',           meaning: 'The Forgiving' },
  { number: 35, arabic: 'ٱلشَّكُور',                 transliteration: 'Ash-Shakūr',          meaning: 'The Appreciative' },
  { number: 36, arabic: 'ٱلْعَلِيّ',                 transliteration: "Al-'Alī",             meaning: 'The Most High' },
  { number: 37, arabic: 'ٱلْكَبِير',                 transliteration: 'Al-Kabīr',            meaning: 'The Greatest' },
  { number: 38, arabic: 'ٱلْحَفِيظ',                 transliteration: 'Al-Ḥafīẓ',            meaning: 'The Guardian' },
  { number: 39, arabic: 'ٱلْمُقِيت',                 transliteration: 'Al-Muqīt',            meaning: 'The Sustainer' },
  { number: 40, arabic: 'ٱلْحَسِيب',                 transliteration: 'Al-Ḥasīb',            meaning: 'The Reckoner' },
  { number: 41, arabic: 'ٱلْجَلِيل',                 transliteration: 'Al-Jalīl',            meaning: 'The Majestic' },
  { number: 42, arabic: 'ٱلْكَرِيم',                 transliteration: 'Al-Karīm',            meaning: 'The Generous' },
  { number: 43, arabic: 'ٱلرَّقِيب',                 transliteration: 'Ar-Raqīb',            meaning: 'The Watchful' },
  { number: 44, arabic: 'ٱلْمُجِيب',                 transliteration: 'Al-Mujīb',            meaning: 'The Responsive' },
  { number: 45, arabic: 'ٱلْوَاسِع',                 transliteration: "Al-Wāsi'",            meaning: 'The All-Encompassing' },
  { number: 46, arabic: 'ٱلْحَكِيم',                 transliteration: 'Al-Ḥakīm',            meaning: 'The Wise' },
  { number: 47, arabic: 'ٱلْوَدُود',                 transliteration: 'Al-Wadūd',             meaning: 'The Loving' },
  { number: 48, arabic: 'ٱلْمَجِيد',                 transliteration: 'Al-Majīd',            meaning: 'The Glorious' },
  { number: 49, arabic: 'ٱلْبَاعِث',                 transliteration: "Al-Bā'ith",           meaning: 'The Resurrector' },
  { number: 50, arabic: 'ٱلشَّهِيد',                 transliteration: 'Ash-Shahīd',          meaning: 'The Witness' },
  { number: 51, arabic: 'ٱلْحَقّ',                   transliteration: 'Al-Ḥaqq',             meaning: 'The Truth' },
  { number: 52, arabic: 'ٱلْوَكِيل',                 transliteration: 'Al-Wakīl',            meaning: 'The Trustee' },
  { number: 53, arabic: 'ٱلْقَوِيّ',                 transliteration: 'Al-Qawī',             meaning: 'The Strong' },
  { number: 54, arabic: 'ٱلْمَتِين',                 transliteration: 'Al-Matīn',            meaning: 'The Firm' },
  { number: 55, arabic: 'ٱلْوَلِيّ',                 transliteration: 'Al-Walī',             meaning: 'The Protecting Friend' },
  { number: 56, arabic: 'ٱلْحَمِيد',                 transliteration: 'Al-Ḥamīd',            meaning: 'The Praised' },
  { number: 57, arabic: 'ٱلْمُحْصِي',                transliteration: 'Al-Muḥṣī',            meaning: 'The All-Counter' },
  { number: 58, arabic: 'ٱلْمُبْدِئ',                transliteration: "Al-Mubdi'",           meaning: 'The Originator' },
  { number: 59, arabic: 'ٱلْمُعِيد',                 transliteration: "Al-Mu'īd",            meaning: 'The Restorer' },
  { number: 60, arabic: 'ٱلْمُحْيِي',                transliteration: 'Al-Muḥyī',            meaning: 'The Giver of Life' },
  { number: 61, arabic: 'ٱلْمُمِيت',                 transliteration: 'Al-Mumīt',            meaning: 'The Taker of Life' },
  { number: 62, arabic: 'ٱلْحَيّ',                   transliteration: 'Al-Ḥayy',             meaning: 'The Ever-Living' },
  { number: 63, arabic: 'ٱلْقَيُّوم',               transliteration: 'Al-Qayyūm',           meaning: 'The Self-Subsisting' },
  { number: 64, arabic: 'ٱلْوَاجِد',                 transliteration: 'Al-Wājid',            meaning: 'The Finder' },
  { number: 65, arabic: 'ٱلْمَاجِد',                 transliteration: 'Al-Mājid',            meaning: 'The Glorious' },
  { number: 66, arabic: 'ٱلْوَاحِد',                 transliteration: 'Al-Wāḥid',            meaning: 'The Unique' },
  { number: 67, arabic: 'ٱلْأَحَد',                  transliteration: 'Al-Aḥad',             meaning: 'The One' },
  { number: 68, arabic: 'ٱلصَّمَد',                  transliteration: 'Aṣ-Ṣamad',            meaning: 'The Eternal' },
  { number: 69, arabic: 'ٱلْقَادِر',                 transliteration: 'Al-Qādir',            meaning: 'The Capable' },
  { number: 70, arabic: 'ٱلْمُقْتَدِر',              transliteration: 'Al-Muqtadir',         meaning: 'The Powerful' },
  { number: 71, arabic: 'ٱلْمُقَدِّم',               transliteration: 'Al-Muqaddim',         meaning: 'The Expediter' },
  { number: 72, arabic: 'ٱلْمُؤَخِّر',               transliteration: "Al-Mu'akhkhir",       meaning: 'The Delayer' },
  { number: 73, arabic: 'ٱلْأَوَّل',                 transliteration: 'Al-Awwal',            meaning: 'The First' },
  { number: 74, arabic: 'ٱلْآخِر',                   transliteration: 'Al-Ākhir',            meaning: 'The Last' },
  { number: 75, arabic: 'ٱلظَّاهِر',                 transliteration: 'Az-Ẓāhir',            meaning: 'The Manifest' },
  { number: 76, arabic: 'ٱلْبَاطِن',                 transliteration: 'Al-Bāṭin',            meaning: 'The Hidden' },
  { number: 77, arabic: 'ٱلْوَالِي',                 transliteration: 'Al-Wālī',             meaning: 'The Governor' },
  { number: 78, arabic: 'ٱلْمُتَعَالِي',             transliteration: "Al-Muta'ālī",         meaning: 'The Self-Exalted' },
  { number: 79, arabic: 'ٱلْبَرّ',                   transliteration: 'Al-Barr',             meaning: 'The Righteous' },
  { number: 80, arabic: 'ٱلتَّوَّاب',                transliteration: 'At-Tawwāb',           meaning: 'The Relenting' },
  { number: 81, arabic: 'ٱلْمُنْتَقِم',              transliteration: 'Al-Muntaqim',         meaning: 'The Avenger' },
  { number: 82, arabic: 'ٱلْعَفُوّ',                 transliteration: "Al-'Afūw",            meaning: 'The Pardoner' },
  { number: 83, arabic: 'ٱلرَّءُوف',                 transliteration: "Ar-Ra'ūf",            meaning: 'The Compassionate' },
  { number: 84, arabic: 'مَالِكُ ٱلْمُلْك',          transliteration: 'Mālik ul-Mulk',       meaning: 'Owner of Sovereignty' },
  { number: 85, arabic: 'ذُو ٱلْجَلَالِ وَٱلْإِكْرَام', transliteration: 'Dhul-Jalāl wal-Ikrām', meaning: 'Lord of Majesty and Bounty' },
  { number: 86, arabic: 'ٱلْمُقْسِط',                transliteration: 'Al-Muqsiṭ',           meaning: 'The Equitable' },
  { number: 87, arabic: 'ٱلْجَامِع',                 transliteration: "Al-Jāmi'",            meaning: 'The Gatherer' },
  { number: 88, arabic: 'ٱلْغَنِيّ',                 transliteration: 'Al-Ghanī',            meaning: 'The Self-Sufficient' },
  { number: 89, arabic: 'ٱلْمُغْنِي',                transliteration: 'Al-Mughnī',           meaning: 'The Enricher' },
  { number: 90, arabic: 'ٱلْمَانِع',                 transliteration: "Al-Māni'",            meaning: 'The Preventer' },
  { number: 91, arabic: 'ٱلضَّارّ',                  transliteration: 'Aḍ-Ḍārr',             meaning: 'The Distresser' },
  { number: 92, arabic: 'ٱلنَّافِع',                 transliteration: "An-N\u0101fi'",            meaning: 'The Benefiter' },
  { number: 93, arabic: 'ٱلنُّور',                   transliteration: 'An-Nūr',              meaning: 'The Light' },
  { number: 94, arabic: 'ٱلْهَادِي',                 transliteration: 'Al-Hādī',             meaning: 'The Guide' },
  { number: 95, arabic: 'ٱلْبَدِيع',                 transliteration: "Al-Badī'",            meaning: 'The Incomparable' },
  { number: 96, arabic: 'ٱلْبَاقِي',                 transliteration: 'Al-Bāqī',             meaning: 'The Everlasting' },
  { number: 97, arabic: 'ٱلْوَارِث',                 transliteration: 'Al-Wārith',           meaning: 'The Inheritor' },
  { number: 98, arabic: 'ٱلرَّشِيد',                 transliteration: 'Ar-Rashīd',           meaning: 'The Guide to Right Path' },
  { number: 99, arabic: 'ٱلصَّبُور',                 transliteration: 'Aṣ-Ṣabūr',            meaning: 'The Patient' },
];

function getStageTag(num: number): string {
  if (num <= 5)  return 'F1';
  if (num <= 10) return 'F2';
  if (num <= 20) return 'CB1';
  if (num <= 30) return 'CB2';
  if (num <= 40) return 'CB3';
  if (num <= 55) return 'CB4';
  if (num <= 70) return 'CB5';
  if (num <= 85) return 'CB6';
  return 'CB7';
}

// ── Merge static data with live SRS progress ─────────────────────────────────

function mergeNamesWithProgress(
  liveItems: NameProgressItem[]
): NameProgressItem[] {
  const liveMap = new Map<number, NameProgressItem>(
    liveItems.map((item) => [item.number, item])
  );

  return ALL_99_NAMES.map((name) => {
    const live = liveMap.get(name.number);
    if (live) return live;
    return {
      id: '',
      number: name.number,
      arabic: name.arabic,
      transliteration: name.transliteration,
      meaning: name.meaning,
      stageTag: getStageTag(name.number),
      status: 'NEW' as SrsStatus,
      totalReviews: 0,
      correctReviews: 0,
    };
  });
}

// ── Progress ring ─────────────────────────────────────────────────────────────

function ProgressRing({ mastered, total, size = 100 }: { mastered: number; total: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (mastered / total) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#ffffff33" strokeWidth={8} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#ffffff" strokeWidth={8} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-bold text-white leading-none">{mastered}</p>
        <p className="text-xs text-green-200">/ {total}</p>
      </div>
    </div>
  );
}

// ── Single name card ──────────────────────────────────────────────────────────

function NameCard({
  item,
  onPractice,
}: {
  item: NameProgressItem;
  onPractice: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { cardClass, badgeClass, emoji } = STATUS_CONFIG[item.status];

  return (
    <button
      className={`relative rounded-2xl border p-3 text-center transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] min-h-[44px] ${cardClass} ${expanded ? 'col-span-1' : ''}`}
      onClick={() => setExpanded((v) => !v)}
      aria-expanded={expanded}
      aria-label={`${item.transliteration}: ${item.meaning}. Status: ${STATUS_CONFIG[item.status].label}`}
    >
      {/* Number badge */}
      <span className="absolute top-2 left-2 text-[10px] font-bold text-gray-400">
        #{item.number}
      </span>

      {/* Stage badge */}
      <span className="absolute top-2 right-2 text-[9px] font-bold text-gray-400 bg-white/60 px-1 rounded">
        {item.stageTag}
      </span>

      {/* Arabic name — large, calligraphic */}
      <p
        className="font-arabic text-xl sm:text-2xl text-gray-800 leading-loose mt-3"
        dir="rtl"
        lang="ar"
      >
        {item.arabic}
      </p>

      {/* Transliteration */}
      <p className="text-xs font-semibold text-gray-600 mt-1 leading-snug">
        {item.transliteration}
      </p>

      {/* Meaning */}
      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.meaning}</p>

      {/* Status pill */}
      <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
        {emoji}
      </span>

      {/* Expanded practice button */}
      {expanded && item.id && (
        <div
          className="mt-3 pt-3 border-t border-black/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full py-2 px-3 bg-[#1a5632] text-white text-xs font-bold rounded-lg hover:bg-[#154526] transition min-h-[44px]"
            onClick={() => onPractice(item.id)}
          >
            📚 Practice
          </button>
        </div>
      )}
    </button>
  );
}

// ── Milestone banner ──────────────────────────────────────────────────────────

function MilestoneBanner({ mastered }: { mastered: number }) {
  const milestones = [
    { at: 99, emoji: '🏆', msg: "Masha'Allah! All 99 Names mastered! 🌟" },
    { at: 75, emoji: '💪', msg: "75 names done — almost there, keep going!" },
    { at: 50, emoji: '🎉', msg: "Halfway there — 50 Names of Allāh memorised!" },
    { at: 25, emoji: '⭐', msg: "25 Names mastered — great start!" },
  ];

  const banner = milestones.find((m) => mastered >= m.at);
  if (!banner || mastered === 0) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 text-center text-white shadow-md">
      <div className="text-4xl mb-1">{banner.emoji}</div>
      <p className="font-bold">{banner.msg}</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ChildNamesProgressPage() {
  const navigate = useNavigate();
  const { member } = useChildAuthStore();
  const { namesItems, namesDueCount, isLoading, fetchNamesProgress } = useDuaProgressStore();

  useEffect(() => {
    if (member?.id) void fetchNamesProgress(member.id);
  }, [member?.id, fetchNamesProgress]);

  // Merge live progress with static 99-names list
  const merged = mergeNamesWithProgress(namesItems);
  const mastered = merged.filter((n) => n.status === 'MASTERED').length;

  const handlePractice = (flashcardId: string) => {
    navigate('/child/flashcards', { state: { practiceCardId: flashcardId } });
  };

  const handlePracticeDue = () => {
    navigate('/child/flashcards', { state: { subjectTag: '99NAMES', mode: 'review' } });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-[#1a5632] to-[#0d3320] rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-heading font-bold">
              99 Names of Allāh ✨
            </h1>
            <p className="text-green-100 text-sm mt-1">
              {isLoading ? 'Loading…' : `${mastered} of 99 names mastered`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ProgressRing mastered={mastered} total={99} size={96} />
            {namesDueCount > 0 && (
              <button
                onClick={handlePracticeDue}
                className="flex-shrink-0 px-4 py-2.5 bg-amber-400 text-amber-900 font-bold text-sm rounded-xl hover:bg-amber-300 transition min-h-[44px]"
              >
                ⏰ Practice Due ({namesDueCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Milestone celebration ── */}
      <MilestoneBanner mastered={mastered} />

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Names grid ── */}
      {!isLoading && (
        <>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            {(['MASTERED', 'REVIEWING', 'LEARNING', 'NEW'] as SrsStatus[]).map((s) => {
              const { emoji, label, badgeClass } = STATUS_CONFIG[s];
              const count = merged.filter((n) => n.status === s).length;
              return (
                <span key={s} className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${badgeClass}`}>
                  {emoji} {label} ({count})
                </span>
              );
            })}
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
            role="list"
            aria-label="99 Names of Allāh"
          >
            {merged.map((item) => (
              <div key={item.number} role="listitem">
                <NameCard item={item} onPractice={handlePractice} />
              </div>
            ))}
          </div>

          {/* Practice all due CTA (bottom) */}
          {namesDueCount > 0 && (
            <button
              onClick={handlePracticeDue}
              className="w-full py-4 bg-[#1a5632] text-white font-bold text-lg rounded-2xl hover:bg-[#154526] transition shadow-sm min-h-[44px]"
            >
              🌟 Practice Due Names ({namesDueCount})
            </button>
          )}
        </>
      )}
    </div>
  );
}
