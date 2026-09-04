/**
 * Mock interview selection — deterministic and balanced.
 *
 * - Difficulty mapping:
 *   beginner = beginner only; intermediate = beginner+intermediate;
 *   advanced = intermediate+advanced; mixed = all.
 * - Focus `mixed` round-robins across categories (fundamentals → … → scenarios)
 *   so a 10-question mock touches many areas instead of the first category.
 * - Focus on one category takes that category in canonical `order`.
 * - `seed` rotates the starting offset so consecutive mocks vary without
 *   randomness (callers pass mockHistory.length). Default 0 = first mock.
 */
import { DifficultyLevel } from '@/types/content';
import { InterviewCategory, InterviewQuestion, MockAnswer, MockConfig, MockRecord } from '@/types/interview';
import { INTERVIEW_CATEGORIES } from '@/content/interview';
import { scoreMock } from './scoring';

const CATEGORY_ORDER: InterviewCategory[] = INTERVIEW_CATEGORIES.sort((a, b) => a.order - b.order).map(
  (c) => c.id
);

function allowedDifficulties(difficulty: MockConfig['difficulty']): DifficultyLevel[] {
  switch (difficulty) {
    case 'beginner':
      return ['beginner'];
    case 'intermediate':
      return ['beginner', 'intermediate'];
    case 'advanced':
      return ['intermediate', 'advanced'];
    case 'mixed':
    default:
      return ['beginner', 'intermediate', 'advanced'];
  }
}

export function filterMockPool(
  all: InterviewQuestion[],
  config: Pick<MockConfig, 'difficulty' | 'focus'>
): InterviewQuestion[] {
  const allowed = new Set(allowedDifficulties(config.difficulty));
  return all
    .filter((q) => allowed.has(q.difficulty))
    .filter((q) => config.focus === 'mixed' || q.category === config.focus)
    .sort((a, b) => a.order - b.order);
}

export function selectMockQuestions(
  all: InterviewQuestion[],
  config: MockConfig,
  seed = 0
): InterviewQuestion[] {
  const pool = filterMockPool(all, config);
  if (pool.length === 0) return [];
  const count = Math.min(config.count, pool.length);
  if (config.focus !== 'mixed') {
    const offset = ((seed % pool.length) + pool.length) % pool.length;
    return Array.from({ length: count }, (_, i) => pool[(offset + i) % pool.length]);
  }
  const byCategory = new Map<InterviewCategory, InterviewQuestion[]>();
  for (const cat of CATEGORY_ORDER) byCategory.set(cat, []);
  for (const q of pool) byCategory.get(q.category)?.push(q);
  const groups = CATEGORY_ORDER.map((cat) => byCategory.get(cat) ?? []).filter((g) => g.length > 0);
  if (groups.length === 0) return [];
  const start = ((seed % groups.length) + groups.length) % groups.length;
  const picked: InterviewQuestion[] = [];
  const pointers = groups.map(() => 0);
  let progress = true;
  while (picked.length < count && progress) {
    progress = false;
    for (let offset = 0; offset < groups.length && picked.length < count; offset++) {
      const gi = (start + offset) % groups.length;
      const ptr = pointers[gi];
      if (ptr < groups[gi].length) {
        picked.push(groups[gi][ptr]);
        pointers[gi] += 1;
        progress = true;
      }
    }
  }
  return picked.slice(0, count);
}

export function createMockRecord(
  questions: InterviewQuestion[],
  answers: MockAnswer[],
  config: MockConfig,
  startedAt: string,
  finishedAt?: string
): MockRecord {
  const { score } = scoreMock(answers);
  const end = finishedAt ?? new Date().toISOString();
  return {
    id: `mock-${Date.parse(startedAt) || Date.now()}`,
    startedAt,
    finishedAt: end,
    config,
    questionIds: questions.map((q) => q.id),
    answers,
    score,
  };
}
