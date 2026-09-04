/**
 * Interview question bank registry — data only, no UI.
 *
 * Conventions:
 * - id:   'git.interview.<slug>' (stable, used for progress/XP)
 * - Category pages live at /interview/git/<categoryId>.
 * - `relatedCommands` reference GIT_COMMANDS ids; unknown ids are skipped
 *   by resolvers (rendered as plain code, never broken links).
 * - `relatedLessons` reference CurriculumLesson ids (any subject).
 * - `relatedTroubleshooting` reference TroubleshootingGuide ids.
 * - `relatedPractice` reference practice exercise ids.
 * - `relatedInternals` reference internals CurriculumLesson ids.
 */
import { DifficultyLevel, LocalText } from '@/types/content';
import { InterviewCategory, InterviewQuestion } from '@/types/interview';
import { CORE_QUESTIONS } from './questionsCore';
import { COMMAND_QUESTIONS } from './questionsCommands';
import { HISTORY_QUESTIONS } from './questionsHistory';
import { RECOVERY_QUESTIONS } from './questionsRecovery';

/** Complete bank, canonical order. */
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  ...CORE_QUESTIONS,
  ...COMMAND_QUESTIONS,
  ...HISTORY_QUESTIONS,
  ...RECOVERY_QUESTIONS,
].sort((a, b) => a.order - b.order);

export interface InterviewCategoryMeta {
  id: InterviewCategory;
  title: LocalText;
  blurb: LocalText;
  order: number;
}

export const INTERVIEW_CATEGORIES: InterviewCategoryMeta[] = [
  {
    id: 'fundamentals',
    title: { en: 'Fundamentals', bn: 'মৌলিক বিষয়' },
    blurb: { en: 'What Git is, snapshots, and the three areas.', bn: 'গিট কী, স্ন্যাপশট ও তিনটি ক্ষেত্র।' },
    order: 1,
  },
  {
    id: 'commands',
    title: { en: 'Commands', bn: 'কমান্ড' },
    blurb: { en: 'Everyday commands and exactly what each one does.', bn: 'দৈনন্দিন কমান্ড ও প্রতিটি ঠিক কী করে।' },
    order: 2,
  },
  {
    id: 'branching',
    title: { en: 'Branching & History', bn: 'ব্রাঞ্চিং ও হিস্ট্রি' },
    blurb: { en: 'Pointers, merges, rebases, and reading the graph.', bn: 'পয়েন্টার, মার্জ, রিবেস ও গ্রাফ পড়া।' },
    order: 3,
  },
  {
    id: 'remote',
    title: { en: 'Remote & Collaboration', bn: 'রিমোট ও সহযোগিতা' },
    blurb: { en: 'Remotes, syncing, forks, reviews, and team habits.', bn: 'রিমোট, সিঙ্ক, ফোর্ক, রিভিউ ও টিম অভ্যাস।' },
    order: 4,
  },
  {
    id: 'troubleshooting',
    title: { en: 'Troubleshooting', bn: 'ট্রাবলশুটিং' },
    blurb: { en: 'Recover calmly when Git goes wrong.', bn: 'গিট ভুল হলে শান্তভাবে পুনরুদ্ধার।' },
    order: 5,
  },
  {
    id: 'internals',
    title: { en: 'Git Internals', bn: 'গিট ইন্টারনালস' },
    blurb: { en: 'Objects, references, DAGs, and honest storage limits.', bn: 'অবজেক্ট, রেফারেন্স, DAG ও সৎ স্টোরেজ সীমা।' },
    order: 6,
  },
  {
    id: 'scenarios',
    title: { en: 'Mixed Scenarios', bn: 'মিশ্র দৃশ্যপট' },
    blurb: { en: 'Real situations blending commands, judgment, and teamwork.', bn: 'কমান্ড, বিচার ও টিমওয়ার্ক মেশানো বাস্তব পরিস্থিতি।' },
    order: 7,
  },
];

export function getInterviewQuestion(idOrSlug: string): InterviewQuestion | undefined {
  const needle = idOrSlug.toLowerCase().trim();
  return INTERVIEW_QUESTIONS.find(
    (q) => q.id.toLowerCase() === needle || q.id.toLowerCase().endsWith(`.${needle}`)
  );
}

export function getQuestionsByCategory(category: InterviewCategory): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.category === category).sort((a, b) => a.order - b.order);
}

export interface InterviewFilters {
  category?: InterviewCategory | 'all';
  difficulty?: DifficultyLevel | 'all';
  type?: InterviewQuestion['type'] | 'all';
  reviewedOnly?: boolean;
  reviewedIds?: Set<string>;
}

export function filterInterviewQuestions(
  questions: InterviewQuestion[],
  filters: InterviewFilters
): InterviewQuestion[] {
  return questions.filter((q) => {
    if (filters.category && filters.category !== 'all' && q.category !== filters.category) return false;
    if (filters.difficulty && filters.difficulty !== 'all' && q.difficulty !== filters.difficulty) return false;
    if (filters.type && filters.type !== 'all' && q.type !== filters.type) return false;
    if (filters.reviewedOnly && !(filters.reviewedIds?.has(q.id) ?? false)) return false;
    return true;
  });
}

export function getAdjacentQuestions(questionId: string): {
  prev: InterviewQuestion | undefined;
  next: InterviewQuestion | undefined;
} {
  const idx = INTERVIEW_QUESTIONS.findIndex((q) => q.id === questionId);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? INTERVIEW_QUESTIONS[idx - 1] : undefined,
    next: idx < INTERVIEW_QUESTIONS.length - 1 ? INTERVIEW_QUESTIONS[idx + 1] : undefined,
  };
}
