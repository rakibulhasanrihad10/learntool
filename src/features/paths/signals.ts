/**
 * Learning signals — a read-only snapshot composed from the EXISTING
 * progress stores. No new storage is created here:
 * - lessons / troubleshooting-resolves / workflow reviews → gamification
 *   (`completedLessonIds`, `learningProgress`)
 * - practice → `gitverse_practice_progress`
 * - interview → `gitverse_interview_progress` + `gitverse_interview_mocks`
 * - skill assessment → gamification quiz record (`passQuiz`)
 */
import { useMemo } from 'react';
import { useGamification } from '@/features/gamification/useGamification';
import { usePracticeProgress } from '@/features/practice/progress';
import { useInterviewProgress } from '@/features/interview/progress';
import { InterviewProgress, MockHistoryEntry } from '@/types/interview';
import { LearningProgress } from '@/types/gamification';
import { PracticeProgress } from '@/types/practice';

/** Quiz-style id marking a finished skill assessment (via existing passQuiz). */
export const ASSESSMENT_QUIZ_ID = 'git.assessment.skill';

/** Reviewed questions in one interview category that complete an interview step. */
export const INTERVIEW_STEP_THRESHOLD = 4;

export interface LearningSignals {
  completedLessonIds: Set<string>;
  learningProgress: Record<string, LearningProgress>;
  practice: PracticeProgress;
  interview: InterviewProgress;
  mockHistory: MockHistoryEntry[];
  assessmentPassed: boolean;
}

export function useLearningSignals(): LearningSignals {
  const { progress: gameProgress, isQuizPassed } = useGamification();
  const { progress: practice } = usePracticeProgress();
  const { progress: interview, mockHistory } = useInterviewProgress();

  return useMemo<LearningSignals>(
    () => ({
      completedLessonIds: new Set(gameProgress.completedLessonIds),
      learningProgress: gameProgress.learningProgress,
      practice,
      interview,
      mockHistory,
      assessmentPassed: isQuizPassed(ASSESSMENT_QUIZ_ID),
    }),
    [gameProgress, practice, interview, mockHistory, isQuizPassed]
  );
}

/** How many questions of an interview category the learner reviewed. */
export function interviewReviewedCount(
  signals: LearningSignals,
  questionIds: string[]
): number {
  return questionIds.filter((id) => signals.interview[id]?.reviewed).length;
}
