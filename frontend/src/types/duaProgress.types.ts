/**
 * Du'ā & 99 Names Progress — Type Definitions
 *
 * These types back the ChildDuaProgressPage and ChildNamesProgressPage views.
 * They are designed to match the expected shape from Khwarizmi's
 * GET /api/v1/flashcards/progress?subjectTag=DUA|99NAMES endpoint.
 */

export type SrsStatus = 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED';

export interface DuaProgressItem {
  id: string;
  name: string;           // front text — occasion/name (e.g. "Before eating")
  arabicText?: string;    // frontArabic
  transliteration?: string;
  translation?: string;   // back text
  stageTag: string;       // "F1" | "F2" | "CB1" … "CB8"
  status: SrsStatus;
  nextReviewDate?: string;
  totalReviews: number;
  correctReviews: number;
}

export interface NameProgressItem {
  id: string;             // flashcard ID from backend (empty string = not yet seeded)
  number: number;         // 1–99
  arabic: string;
  transliteration: string;
  meaning: string;
  stageTag: string;
  status: SrsStatus;
  nextReviewDate?: string;
  totalReviews: number;
  correctReviews: number;
}

// ── API response shapes ──────────────────────────────────────────────────────

export interface DuaProgressApiResponse {
  items: DuaProgressItem[];
  total: number;
  dueCount: number;
}

export interface NamesProgressApiResponse {
  items: NameProgressItem[];
  total: number;
  masteredCount: number;
  dueCount: number;
}

// ── UI helpers ───────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  SrsStatus,
  { label: string; cardClass: string; badgeClass: string; emoji: string }
> = {
  NEW: {
    label: 'Not Started',
    cardClass: 'bg-gray-50 border-gray-200',
    badgeClass: 'bg-gray-100 text-gray-600',
    emoji: '⚪',
  },
  LEARNING: {
    label: 'Learning',
    cardClass: 'bg-blue-50 border-blue-200',
    badgeClass: 'bg-blue-100 text-blue-700',
    emoji: '🔵',
  },
  REVIEWING: {
    label: 'Reviewing',
    cardClass: 'bg-amber-50 border-amber-200',
    badgeClass: 'bg-amber-100 text-amber-700',
    emoji: '🟡',
  },
  MASTERED: {
    label: 'Mastered',
    cardClass: 'bg-emerald-50 border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    emoji: '🟢',
  },
};

export const STAGE_LABELS: Record<string, string> = {
  F1: 'Foundation 1 (Age 4–5)',
  F2: 'Foundation 2 (Age 5–6)',
  CB1: 'Coursebook 1 (Age 6–7)',
  CB2: 'Coursebook 2 (Age 7–8)',
  CB3: 'Coursebook 3 (Age 8–9)',
  CB4: 'Coursebook 4 (Age 9–10)',
  CB5: 'Coursebook 5 (Age 10–11)',
  CB6: 'Coursebook 6 (Age 11–12)',
  CB7: 'Coursebook 7 (Age 12–13)',
  CB8: 'Coursebook 8 (Age 13–14)',
};

export const STAGE_ORDER = ['F1', 'F2', 'CB1', 'CB2', 'CB3', 'CB4', 'CB5', 'CB6', 'CB7', 'CB8'];
