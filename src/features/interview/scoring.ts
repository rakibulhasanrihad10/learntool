/**
 * Interview scoring — deterministic, no AI grading, ever.
 *
 * - Objective kinds (`choice` / `state` / `graph` with options):
 *   exactly one option has `correct: true`; score is 100 or 0.
 * - Open kinds (`conceptual` / `scenario` / `compare`):
 *   learner self-rates honestly: knew = 100, partial = 70, review = 0.
 *   This mirrors practice scoring (100 first-try / 70 retry / 0 fail).
 */
import { InterviewQuestion, MockAnswer, SelfRating } from '@/types/interview';

export const SELF_RATING_SCORES: Record<SelfRating, number> = {
  knew: 100,
  partial: 70,
  review: 0,
};

export function isObjectiveQuestion(question: Pick<InterviewQuestion, 'options'>): boolean {
  return Array.isArray(question.options) && question.options.length > 0;
}

export function scoreObjective(
  question: Pick<InterviewQuestion, 'options'>,
  selectedOptionId: string | null | undefined
): boolean {
  if (!selectedOptionId || !isObjectiveQuestion(question)) return false;
  const chosen = question.options!.find((o) => o.id === selectedOptionId);
  return chosen?.correct === true;
}

export function scoreOpen(selfRating: SelfRating | null | undefined): number {
  if (!selfRating) return 0;
  return SELF_RATING_SCORES[selfRating] ?? 0;
}

export function scoreMockAnswer(answer: MockAnswer): number {
  if (answer.correct !== null && answer.correct !== undefined) {
    return answer.correct ? 100 : 0;
  }
  return scoreOpen(answer.selfRating);
}

export function scoreMock(answers: MockAnswer[]): { score: number; correctCount: number; total: number } {
  const total = answers.length;
  if (total === 0) return { score: 0, correctCount: 0, total: 0 };
  const points = answers.map(scoreMockAnswer);
  const correctCount = points.filter((p) => p >= 70).length;
  const score = Math.round(points.reduce((sum, p) => sum + p, 0) / total);
  return { score, correctCount, total };
}
