export interface UnitCompletionProgress {
  videoCompleted?: boolean | null;
  readingCompleted?: boolean | null;
  quizCompleted?: boolean | null;
}

export function isUnitComplete(progress?: UnitCompletionProgress | null): boolean {
  return Boolean(progress?.readingCompleted);
}

export function getUnitProgressStatus(
  progress?: UnitCompletionProgress | null
): 'not_started' | 'in_progress' | 'completed' {
  if (!progress) {
    return 'not_started';
  }

  if (isUnitComplete(progress)) {
    return 'completed';
  }

  if (progress.videoCompleted || progress.readingCompleted || progress.quizCompleted) {
    return 'in_progress';
  }

  return 'not_started';
}
