/**
 * Practice scoring — deliberately simple and documented.
 *
 * Per task: 100 on a first-try pass, 70 on a pass after retries, 0 on failure.
 * Exercise score = task average, minus 5 per hint revealed (floor 0).
 * Bands: 100 mastered · 80–99 strong · 60–79 needs-practice · below 60 review.
 */
import {
  AssessmentSectionId,
  AssessmentSectionResult,
  OverallLevel,
  ScoreBand,
  SectionLevel,
  TaskAttempt,
} from '@/types/practice';

export const HINT_PENALTY = 5;
export const RETRY_PASS_SCORE = 70;

export function scoreTask(attempt: Pick<TaskAttempt, 'passed' | 'retries'>): number {
  if (!attempt.passed) return 0;
  return attempt.retries === 0 ? 100 : RETRY_PASS_SCORE;
}

export function scoreExercise(attempts: TaskAttempt[], hintsUsed: number): { score: number; band: ScoreBand } {
  if (attempts.length === 0) return { score: 0, band: 'review' };
  const average = attempts.reduce((sum, a) => sum + scoreTask(a), 0) / attempts.length;
  const score = Math.max(0, Math.round(average - HINT_PENALTY * hintsUsed));
  return { score, band: bandForScore(score) };
}

export function bandForScore(score: number): ScoreBand {
  if (score >= 100) return 'mastered';
  if (score >= 80) return 'strong';
  if (score >= 60) return 'needs-practice';
  return 'review';
}

/* ---------------- Skill Assessment ---------------- */

export interface AssessmentAnswer {
  itemId: string;
  section: AssessmentSectionId;
  correct: boolean;
}

export function scoreAssessment(answers: AssessmentAnswer[]): AssessmentSectionResult[] {
  const sections: AssessmentSectionId[] = [
    'fundamentals',
    'branching',
    'merging-rebasing',
    'remote',
    'recovery',
    'internals',
  ];
  return sections.map((section) => {
    const items = answers.filter((a) => a.section === section);
    const correct = items.filter((a) => a.correct).length;
    const ratio = items.length === 0 ? 0 : correct / items.length;
    const level: SectionLevel = ratio >= 0.8 ? 'strong' : ratio >= 0.6 ? 'developing' : 'needs-practice';
    return { section, correct, total: items.length, level };
  });
}

export function overallLevel(results: AssessmentSectionResult[]): OverallLevel {
  const answered = results.filter((r) => r.total > 0);
  if (answered.length === 0) return 'git-novice';
  const mean = answered.reduce((sum, r) => sum + r.correct / r.total, 0) / answered.length;
  if (mean >= 0.85) return 'confident-practitioner';
  if (mean >= 0.65) return 'intermediate-practitioner';
  if (mean >= 0.4) return 'developing-practitioner';
  return 'git-novice';
}

export const OVERALL_LEVEL_META: Record<OverallLevel, { en: string; bn: string }> = {
  'git-novice': { en: 'Git Novice — keep practicing the fundamentals', bn: 'গিট শিক্ষানবিশ — মৌলিক বিষয়গুলো অনুশীলন চালিয়ে যান' },
  'developing-practitioner': { en: 'Developing Practitioner', bn: 'উন্নয়নশীল অনুশীলনকারী' },
  'intermediate-practitioner': { en: 'Intermediate Git Practitioner', bn: 'মধ্যবর্তী গিট অনুশীলনকারী' },
  'confident-practitioner': { en: 'Confident Git Practitioner', bn: 'আত্মবিশ্বাসী গিট অনুশীলনকারী' },
};
