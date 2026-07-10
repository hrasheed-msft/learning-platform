/**
 * ChildDuaProgressPage — Cross-stage Du'ā memorisation progress view.
 *
 * Design: child-first, Islamic aesthetic, grouped by maktab stage,
 * collapsible sections, per-item expand/practice.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useChildAuthStore } from '@/stores/childAuthStore';
import { useDuaProgressStore } from '@/stores/duaProgressStore';
import {
  STATUS_CONFIG,
  STAGE_LABELS,
  STAGE_ORDER,
} from '@/types/duaProgress.types';
import type { DuaProgressItem, SrsStatus } from '@/types/duaProgress.types';

// ── Stage grouping ───────────────────────────────────────────────────────────

function groupByStage(items: DuaProgressItem[]): Map<string, DuaProgressItem[]> {
  const map = new Map<string, DuaProgressItem[]>();
  for (const stage of STAGE_ORDER) {
    map.set(stage, []);
  }
  for (const item of items) {
    const tag = item.stageTag ?? 'F1';
    if (!map.has(tag)) map.set(tag, []);
    map.get(tag)!.push(item);
  }
  return map;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SrsStatus }) {
  const { emoji, label, badgeClass } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
      {emoji} {label}
    </span>
  );
}

function DuaItem({
  item,
  onPractice,
}: {
  item: DuaProgressItem;
  onPractice: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { cardClass } = STATUS_CONFIG[item.status];

  return (
    <div className={`rounded-xl border p-4 transition ${cardClass}`}>
      {/* Row: tap to expand */}
      <button
        className="w-full text-left flex items-start justify-between gap-3 min-h-[44px]"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} ${item.name}`}
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-snug">{item.name}</p>
          {item.arabicText && (
            <p
              className="text-gray-600 text-base mt-1 font-arabic leading-relaxed"
              dir="rtl"
              lang="ar"
            >
              {item.arabicText}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={item.status} />
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-black/5 space-y-2">
          {item.arabicText && (
            <p
              className="text-xl font-arabic text-gray-800 text-right leading-loose"
              dir="rtl"
              lang="ar"
            >
              {item.arabicText}
            </p>
          )}
          {item.transliteration && (
            <p className="text-sm italic text-gray-500">{item.transliteration}</p>
          )}
          {item.translation && (
            <p className="text-sm text-gray-700">{item.translation}</p>
          )}
          {item.totalReviews > 0 && (
            <p className="text-xs text-gray-400">
              {item.correctReviews}/{item.totalReviews} correct reviews
            </p>
          )}
          <button
            onClick={() => onPractice(item.id)}
            className="mt-2 w-full py-2 px-4 bg-[#1a5632] text-white text-sm font-semibold rounded-lg hover:bg-[#154526] transition min-h-[44px]"
          >
            📚 Practice this Du'ā
          </button>
        </div>
      )}
    </div>
  );
}

function StageSection({
  stage,
  items,
  onPractice,
}: {
  stage: string;
  items: DuaProgressItem[];
  onPractice: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const label = STAGE_LABELS[stage] ?? stage;
  const mastered = items.filter((i) => i.status === 'MASTERED').length;

  return (
    <section aria-label={label}>
      <button
        className="w-full flex items-center justify-between gap-3 py-3 px-1 min-h-[44px] group"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          {open ? (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#1a5632]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1a5632]" />
          )}
          <h2 className="text-base font-bold text-gray-800 group-hover:text-[#1a5632] transition">
            {label}
          </h2>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          {mastered}/{items.length} mastered
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 col-span-full pl-8">
              No du'ās in this stage yet.
            </p>
          ) : (
            items.map((item) => (
              <DuaItem key={item.id} item={item} onPractice={onPractice} />
            ))
          )}
        </div>
      )}
    </section>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ChildDuaProgressPage() {
  const navigate = useNavigate();
  const { member } = useChildAuthStore();
  const { duaItems, duaDueCount, isLoading, fetchDuaProgress } = useDuaProgressStore();

  useEffect(() => {
    if (member?.id) void fetchDuaProgress(member.id);
  }, [member?.id, fetchDuaProgress]);

  const total = duaItems.length;
  const mastered = duaItems.filter((i) => i.status === 'MASTERED').length;
  const masteryPct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  const grouped = groupByStage(duaItems);
  const populatedStages = STAGE_ORDER.filter((s) => (grouped.get(s)?.length ?? 0) > 0);

  const handlePractice = (flashcardId: string) => {
    navigate('/child/flashcards', { state: { practiceCardId: flashcardId } });
  };

  const handlePracticeAllDue = () => {
    navigate('/child/flashcards', { state: { subjectTag: 'DUA', mode: 'review' } });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-[#1a5632] to-[#0d3320] rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">My Du'ās 🕋</h1>
            <p className="text-green-100 text-sm mt-1">
              {isLoading
                ? "Loading your du\u2019\u0101s\u2026"
                : total > 0
                ? `${mastered} of ${total} mastered`
                : "Your du\u2019\u0101s will appear here as you learn them"}
            </p>
          </div>
          {duaDueCount > 0 && (
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-amber-900 font-bold text-sm rounded-full">
              ⏰ {duaDueCount} due today
            </span>
          )}
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-green-100 mb-1">
              <span>Overall mastery</span>
              <span className="font-bold text-white">{masteryPct}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${masteryPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2].map((j) => (
                  <div key={j} className="h-20 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Stage sections ── */}
      {!isLoading && (
        <>
          {populatedStages.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
              <div className="text-5xl mb-4">🕋</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No du'ās yet!</h2>
              <p className="text-gray-500 max-w-sm mx-auto">
                Du'ās will appear here as your maktab curriculum is set up. Keep learning!
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 divide-y divide-gray-100">
              {populatedStages.map((stage) => (
                <StageSection
                  key={stage}
                  stage={stage}
                  items={grouped.get(stage) ?? []}
                  onPractice={handlePractice}
                />
              ))}
            </div>
          )}

          {/* ── Practice all due CTA ── */}
          {duaDueCount > 0 && (
            <button
              onClick={handlePracticeAllDue}
              className="w-full py-4 bg-[#1a5632] text-white font-bold text-lg rounded-2xl hover:bg-[#154526] transition shadow-sm min-h-[44px]"
            >
              🌙 Practice All Due Du'ās ({duaDueCount})
            </button>
          )}
        </>
      )}
    </div>
  );
}
