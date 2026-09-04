/**
 * Interview progress: localStorage-backed, keyed by stable question ids.
 * Mirrors practice progress: crash-resilient reads, progress never blocks UI.
 */
import { useCallback, useState } from 'react';
import { storage } from '@/utils/storage';
import { InterviewProgress, MockHistoryEntry, QuestionProgress, SelfRating } from '@/types/interview';

export const INTERVIEW_PROGRESS_KEY = 'gitverse_interview_progress';
export const INTERVIEW_MOCK_HISTORY_KEY = 'gitverse_interview_mocks';

export function loadInterviewProgress(): InterviewProgress {
  return storage.get<InterviewProgress>(INTERVIEW_PROGRESS_KEY, {});
}

function saveInterviewProgress(progress: InterviewProgress): void {
  storage.set(INTERVIEW_PROGRESS_KEY, progress);
}

export interface QuestionAttempt {
  questionId: string;
  /** Objective kinds: whether the chosen option was correct. */
  correct?: boolean | null;
  /** Open kinds: honest self-rating. */
  selfRating?: SelfRating | null;
}

/**
 * Record one question attempt. Reviewed = attempted. Returns whether this
 * was the question's first completion (used for +5 XP upstream).
 */
export function recordQuestionAttempt(
  prev: InterviewProgress,
  attempt: QuestionAttempt
): { progress: InterviewProgress; isFirstCompletion: boolean } {
  const now = new Date().toISOString();
  const existing = prev[attempt.questionId];
  const isFirstCompletion = !existing?.reviewed;
  const entry: QuestionProgress = {
    attempts: (existing?.attempts ?? 0) + 1,
    lastSelfRating: attempt.selfRating ?? existing?.lastSelfRating,
    everCorrect: (existing?.everCorrect ?? false) || attempt.correct === true,
    reviewed: true,
    lastAttemptAt: now,
  };
  const progress = { ...prev, [attempt.questionId]: entry };
  saveInterviewProgress(progress);
  return { progress, isFirstCompletion };
}

export function loadMockHistory(): MockHistoryEntry[] {
  return storage.get<MockHistoryEntry[]>(INTERVIEW_MOCK_HISTORY_KEY, []);
}

function saveMockHistory(history: MockHistoryEntry[]): void {
  storage.set(INTERVIEW_MOCK_HISTORY_KEY, history);
}

export function appendMockHistory(
  prev: MockHistoryEntry[],
  entry: MockHistoryEntry,
  limit = 20
): { history: MockHistoryEntry[]; isFirstCompletion: boolean } {
  const isFirstCompletion = prev.length === 0;
  const history = [...prev, entry].slice(-limit);
  saveMockHistory(history);
  return { history, isFirstCompletion };
}

export function useInterviewProgress() {
  const [progress, setProgress] = useState<InterviewProgress>(loadInterviewProgress);
  const [mockHistory, setMockHistory] = useState<MockHistoryEntry[]>(loadMockHistory);

  const recordQuestion = useCallback(
    (attempt: QuestionAttempt) => {
      const result = recordQuestionAttempt(progress, attempt);
      setProgress(result.progress);
      return { isFirstCompletion: result.isFirstCompletion };
    },
    [progress]
  );

  const recordQuestions = useCallback(
    (attempts: QuestionAttempt[]) => {
      let current = progress;
      let firstCompletions = 0;
      for (const attempt of attempts) {
        const result = recordQuestionAttempt(current, attempt);
        current = result.progress;
        if (result.isFirstCompletion) firstCompletions += 1;
      }
      setProgress(current);
      return { firstCompletions };
    },
    [progress]
  );

  const recordMock = useCallback(
    (entry: MockHistoryEntry) => {
      const result = appendMockHistory(mockHistory, entry);
      setMockHistory(result.history);
      return { isFirstCompletion: result.isFirstCompletion };
    },
    [mockHistory]
  );

  const resetAll = useCallback(() => {
    setProgress({});
    saveInterviewProgress({});
    setMockHistory([]);
    saveMockHistory([]);
  }, []);

  return { progress, mockHistory, recordQuestion, recordQuestions, recordMock, resetAll };
}
