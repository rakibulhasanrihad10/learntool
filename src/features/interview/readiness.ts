/**
 * Interview readiness — deterministic, explainable, no hidden signals.
 *
 * Inputs: question progress map + mock history.
 * - coverage = reviewed questions / total questions.
 * - avgMock = mean score of the last 3 finished mocks (undefined if none).
 * - per-question success: objective everCorrect → 1/0; open knew → 1,
 *   partial → 0.6, review/unattempted → 0.
 * - per-category score = 0.5 × coverage + 0.5 × mean success; the two
 *   lowest-scoring attempted-or-not categories are reported as weak areas.
 *
 * Levels:
 * - advanced: coverage ≥ 70% and (no mocks or avgMock ≥ 85).
 * - ready:    coverage ≥ 50% and (no mocks or avgMock ≥ 70).
 * - developing: coverage ≥ 20% or at least one mock finished.
 * - beginner: everything else.
 */
import { INTERVIEW_QUESTIONS } from '@/content/interview';
import { InterviewCategory, InterviewProgress, InterviewReadinessLevel, MockHistoryEntry } from '@/types/interview';

export interface ReadinessResult {
  level: InterviewReadinessLevel;
  reviewedCount: number;
  total: number;
  coveragePct: number;
  avgMockScore: number | undefined;
  mocksFinished: number;
  weakCategories: InterviewCategory[];
  categoryScores: Record<InterviewCategory, { reviewed: number; total: number; score: number }>;
}

export const INTERVIEW_READINESS_META: Record<InterviewReadinessLevel, { en: string; bn: string }> = {
  beginner: { en: 'Getting Started — review the fundamentals', bn: 'শুরু — মৌলিক বিষয়গুলো দেখুন' },
  developing: { en: 'Developing — keep answering across categories', bn: 'উন্নয়নশীল — সব বিভাগে উত্তর চালিয়ে যান' },
  ready: { en: 'Interview Ready — hold this level with mocks', bn: 'ইন্টারভিউ প্রস্তুত — মক দিয়ে ধরে রাখুন' },
  advanced: { en: 'Advanced — you can explain Git under pressure', bn: 'অ্যাডভান্সড — চাপের মধ্যেও গিট ব্যাখ্যা করতে পারেন' },
};

function successOf(questionId: string, progress: InterviewProgress): number {
  const entry = progress[questionId];
  if (!entry) return 0;
  if (entry.everCorrect) return 1;
  switch (entry.lastSelfRating) {
    case 'knew':
      return 1;
    case 'partial':
      return 0.6;
    default:
      return 0;
  }
}

export function computeReadiness(
  progress: InterviewProgress,
  mockHistory: MockHistoryEntry[]
): ReadinessResult {
  const total = INTERVIEW_QUESTIONS.length;
  const reviewedCount = INTERVIEW_QUESTIONS.filter((q) => progress[q.id]?.reviewed).length;
  const coveragePct = total === 0 ? 0 : Math.round((reviewedCount / total) * 100);
  const recent = mockHistory.slice(-3);
  const avgMockScore =
    recent.length === 0
      ? undefined
      : Math.round(recent.reduce((sum, m) => sum + m.score, 0) / recent.length);

  const categoryScores = {} as ReadinessResult['categoryScores'];
  const categories = Array.from(new Set(INTERVIEW_QUESTIONS.map((q) => q.category)));
  for (const category of categories) {
    const items = INTERVIEW_QUESTIONS.filter((q) => q.category === category);
    const reviewed = items.filter((q) => progress[q.id]?.reviewed).length;
    const coverage = items.length === 0 ? 0 : reviewed / items.length;
    const meanSuccess =
      items.length === 0
        ? 0
        : items.reduce((sum, q) => sum + successOf(q.id, progress), 0) / items.length;
    categoryScores[category] = {
      reviewed,
      total: items.length,
      score: Math.round((0.5 * coverage + 0.5 * meanSuccess) * 100) / 100,
    };
  }

  const weakCategories = [...categories]
    .sort((a, b) => categoryScores[a].score - categoryScores[b].score)
    .slice(0, 2);

  const coverage = total === 0 ? 0 : reviewedCount / total;
  let level: InterviewReadinessLevel = 'beginner';
  if (coverage >= 0.7 && (avgMockScore === undefined || avgMockScore >= 85)) level = 'advanced';
  else if (coverage >= 0.5 && (avgMockScore === undefined || avgMockScore >= 70)) level = 'ready';
  else if (coverage >= 0.2 || mockHistory.length > 0) level = 'developing';

  return {
    level,
    reviewedCount,
    total,
    coveragePct,
    avgMockScore,
    mocksFinished: mockHistory.length,
    weakCategories,
    categoryScores,
  };
}
