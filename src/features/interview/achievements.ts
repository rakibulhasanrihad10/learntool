/**
 * Pure interview achievement rules — unit-testable, no side effects.
 * XP is granted upstream (gamification context): +5 per first question
 * completion, +25 per first mock completion (see prompt 11 rules).
 */
import { MockHistoryEntry } from '@/types/interview';

export const INTERVIEW_ACHIEVEMENT_IDS = [
  'interview_first_answer',
  'interview_10_reviewed',
  'interview_30_reviewed',
  'interview_60_reviewed',
  'interview_mock_first',
  'interview_mock_high_score',
  'interview_ready',
] as const;

export function getUnlockedAchievementsForInterview(
  reviewedQuestionIds: string[],
  mockHistory: MockHistoryEntry[],
  alreadyUnlocked: string[]
): string[] {
  const unlocked: string[] = [];
  const grant = (id: string) => {
    if (!alreadyUnlocked.includes(id) && !unlocked.includes(id)) unlocked.push(id);
  };
  const reviewed = new Set(reviewedQuestionIds).size;
  if (reviewed >= 1) grant('interview_first_answer');
  if (reviewed >= 10) grant('interview_10_reviewed');
  if (reviewed >= 30) grant('interview_30_reviewed');
  if (reviewed >= 60) grant('interview_60_reviewed');
  if (mockHistory.length >= 1) grant('interview_mock_first');
  if (mockHistory.some((m) => m.score >= 80)) grant('interview_mock_high_score');
  if (reviewed >= 20 && mockHistory.length >= 1) grant('interview_ready');
  return unlocked;
}
