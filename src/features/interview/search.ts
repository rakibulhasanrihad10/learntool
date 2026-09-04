/**
 * Interview search helper — mirrors commandSearch/githubSearch patterns.
 * Searches question text, short answers, tags, and option labels.
 * Git syntax stays English; matching is case-insensitive on both languages.
 */
import { INTERVIEW_QUESTIONS } from '@/content/interview';
import { InterviewQuestion } from '@/types/interview';

export interface InterviewSearchResult {
  question: InterviewQuestion;
  score: number;
}

export function searchInterviewQuestions(query: string, limit = 8): InterviewSearchResult[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const tokens = needle.split(/\s+/);
  const scored: InterviewSearchResult[] = [];
  for (const question of INTERVIEW_QUESTIONS) {
    const haystack = [
      question.id,
      question.question.en,
      question.question.bn,
      question.shortAnswer.en,
      question.shortAnswer.bn,
      question.explanation.en,
      ...(question.tags ?? []),
      ...(question.options ?? []).map((o) => o.label),
    ]
      .join('\n')
      .toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (!token) continue;
      if (question.id.toLowerCase().includes(token)) score += 6;
      else if (haystack.includes(token)) score += token.length >= 4 ? 3 : 1;
      else {
        score = 0;
        break;
      }
    }
    if (score > 0) scored.push({ question, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.question.order - b.question.order).slice(0, limit);
}
