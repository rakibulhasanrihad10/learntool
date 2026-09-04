/**
 * Practice progress: localStorage-backed, keyed by stable exercise ids.
 * Mirrors the existing progress architecture (see gamificationContext):
 * no backend, crash-resilient reads, progress never blocks rendering.
 */
import { useCallback, useState } from 'react';
import { storage } from '@/utils/storage';
import { ExerciseProgress, PracticeProgress } from '@/types/practice';

export const PRACTICE_STORAGE_KEY = 'gitverse_practice_progress';

export function loadPracticeProgress(): PracticeProgress {
  return storage.get<PracticeProgress>(PRACTICE_STORAGE_KEY, {});
}

function savePracticeProgress(progress: PracticeProgress): void {
  storage.set(PRACTICE_STORAGE_KEY, progress);
}

export interface AttemptRecord {
  exerciseId: string;
  score: number;
  hintsUsed: number;
  completed: boolean;
}

/**
 * Record one attempt. Returns the stored entry plus whether this attempt
 * set a new best score (used to decide XP awards upstream).
 */
export function recordPracticeAttempt(
  prev: PracticeProgress,
  record: AttemptRecord
): { progress: PracticeProgress; isNewBest: boolean; isFirstCompletion: boolean } {
  const now = new Date().toISOString();
  const existing = prev[record.exerciseId];
  const isNewBest = !existing || record.score > existing.bestScore;
  const isFirstCompletion = record.completed && !(existing?.completed ?? false);
  const entry: ExerciseProgress = {
    attempts: (existing?.attempts ?? 0) + 1,
    bestScore: Math.max(existing?.bestScore ?? 0, record.score),
    completed: (existing?.completed ?? false) || record.completed,
    completedAt: isFirstCompletion ? now : existing?.completedAt,
    lastAttemptAt: now,
    hintsUsed: Math.max(existing?.hintsUsed ?? 0, record.hintsUsed),
  };
  const progress = { ...prev, [record.exerciseId]: entry };
  savePracticeProgress(progress);
  return { progress, isNewBest, isFirstCompletion };
}

export function practiceStats(progress: PracticeProgress): {
  completedCount: number;
  totalAttempts: number;
  averageBest: number;
} {
  const entries = Object.values(progress);
  const completedCount = entries.filter((e) => e.completed).length;
  const totalAttempts = entries.reduce((sum, e) => sum + e.attempts, 0);
  const averageBest =
    entries.length === 0 ? 0 : Math.round(entries.reduce((sum, e) => sum + e.bestScore, 0) / entries.length);
  return { completedCount, totalAttempts, averageBest };
}

export function usePracticeProgress() {
  const [progress, setProgress] = useState<PracticeProgress>(loadPracticeProgress);

  const recordAttempt = useCallback(
    (record: AttemptRecord) => {
      const result = recordPracticeAttempt(progress, record);
      setProgress(result.progress);
      return { isNewBest: result.isNewBest, isFirstCompletion: result.isFirstCompletion };
    },
    [progress]
  );

  const resetAll = useCallback(() => {
    setProgress({});
    savePracticeProgress({});
  }, []);

  return { progress, recordAttempt, resetAll };
}
