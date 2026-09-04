/**
 * Topic mastery — "GitVerse Learning Mastery", an educational estimate
 * built only from existing progress records. Deterministic by design:
 *
 *   score = 40 × lessonRatio + 30 × practiceScore + 15 × cookbookRatio + 15 × interviewRatio
 *
 * where practiceScore = 0.5 × completedRatio + 0.5 × (avg best score ÷ 100
 * over attempted exercises, 0 when none attempted). Levels:
 * 0 started-nothing → not-started · <40 → learning · <60 → practicing ·
 * <80 → familiar · ≥80 → strong.
 *
 * Wording never claims certification — see MASTERY_DISCLAIMER usage in UI.
 */
import { ALL_MODULES } from '@/content/github';
import { PRACTICE_EXERCISES } from '@/content/practice';
import { TROUBLESHOOTING_GUIDES } from '@/content/git';
import { INTERVIEW_QUESTIONS } from '@/content/interview';
import { LocalText } from '@/types/content';
import { MasteryLevel, TopicMastery } from '@/types/learningPath';
import { LearningSignals } from './signals';

export interface MasteryTopicDef {
  id: string;
  title: LocalText;
  lessonPrefixes: string[];
  practiceCategories: string[];
  troubleshootingCategories: string[];
  interviewCategories: string[];
}

export const MASTERY_TOPICS: MasteryTopicDef[] = [
  {
    id: 'fundamentals',
    title: { en: 'Git Fundamentals', bn: 'গিট মৌলিক বিষয়' },
    lessonPrefixes: ['git.fundamentals.'],
    practiceCategories: ['fundamentals', 'everyday'],
    troubleshootingCategories: ['everyday-mistakes', 'working-tree', 'commit-problems'],
    interviewCategories: ['fundamentals', 'commands'],
  },
  {
    id: 'branching',
    title: { en: 'Branching & History', bn: 'ব্রাঞ্চিং ও হিস্ট্রি' },
    lessonPrefixes: ['git.branching.', 'git.merging.', 'git.rebasing.'],
    practiceCategories: ['branching', 'merging', 'rebasing'],
    troubleshootingCategories: ['branch-problems', 'merge-conflicts', 'rebase-conflicts'],
    interviewCategories: ['branching'],
  },
  {
    id: 'remote',
    title: { en: 'Remote Workflow', bn: 'রিমোট প্রবাহ' },
    lessonPrefixes: ['git.remote.'],
    practiceCategories: ['remote'],
    troubleshootingCategories: ['remote-push'],
    interviewCategories: ['remote'],
  },
  {
    id: 'recovery',
    title: { en: 'Undo & Recovery', bn: 'আনডু ও রিকভারি' },
    lessonPrefixes: ['git.recovery.'],
    practiceCategories: ['recovery'],
    troubleshootingCategories: ['undo-recovery', 'history-recovery', 'detached-head'],
    interviewCategories: ['troubleshooting'],
  },
  {
    id: 'internals',
    title: { en: 'Git Internals', bn: 'গিট ইন্টারনালস' },
    lessonPrefixes: ['git.internals.', 'git.advanced.'],
    practiceCategories: ['internals'],
    troubleshootingCategories: [],
    interviewCategories: ['internals'],
  },
  {
    id: 'collaboration',
    title: { en: 'GitHub Collaboration', bn: 'গিটহাব সহযোগিতা' },
    lessonPrefixes: ['github.'],
    practiceCategories: ['github'],
    troubleshootingCategories: ['collaboration', 'github-workflow', 'security'],
    interviewCategories: ['scenarios'],
  },
];

export const MASTERY_LEVEL_META: Record<MasteryLevel, LocalText> = {
  'not-started': { en: 'Not started', bn: 'শুরু হয়নি' },
  learning: { en: 'Learning', bn: 'শিখছেন' },
  practicing: { en: 'Practicing', bn: 'অনুশীলন করছেন' },
  familiar: { en: 'Familiar', bn: 'পরিচিত' },
  strong: { en: 'Strong', bn: 'শক্তিশালী' },
};

export function levelForScore(score: number, started: boolean): MasteryLevel {
  if (!started || score < 1) return 'not-started';
  if (score < 40) return 'learning';
  if (score < 60) return 'practicing';
  if (score < 80) return 'familiar';
  return 'strong';
}

/** Every lesson id across all modules (git + github + internals). */
const EVERY_LESSON_ID: string[] = ALL_MODULES.flatMap((m) => m.lessons.map((l) => l.id));

export function computeMastery(signals: LearningSignals): TopicMastery[] {
  return MASTERY_TOPICS.map((topic) => {
    const lessonIds = EVERY_LESSON_ID.filter((id) =>
      topic.lessonPrefixes.some((prefix) => id.startsWith(prefix))
    );
    const lessonsDone = lessonIds.filter((id) => signals.completedLessonIds.has(id)).length;

    const exercises = PRACTICE_EXERCISES.filter((e) => topic.practiceCategories.includes(e.category));
    const attempted = exercises.filter((e) => (signals.practice[e.id]?.attempts ?? 0) > 0);
    const practiceDone = exercises.filter((e) => signals.practice[e.id]?.completed).length;
    const avgBest =
      attempted.length === 0
        ? 0
        : attempted.reduce((sum, e) => sum + (signals.practice[e.id]?.bestScore ?? 0), 0) /
          attempted.length;

    const guides = TROUBLESHOOTING_GUIDES.filter((g) =>
      topic.troubleshootingCategories.includes(g.category)
    );
    const guidesDone = guides.filter((g) => signals.completedLessonIds.has(g.id)).length;

    const questions = INTERVIEW_QUESTIONS.filter((q) => topic.interviewCategories.includes(q.category));
    const questionsDone = questions.filter((q) => signals.interview[q.id]?.reviewed).length;

    const lessonRatio = lessonIds.length === 0 ? 0 : lessonsDone / lessonIds.length;
    const practiceScore =
      exercises.length === 0
        ? 0
        : 0.5 * (practiceDone / exercises.length) + 0.5 * (avgBest / 100);
    const cookbookRatio = guides.length === 0 ? 0 : guidesDone / guides.length;
    const interviewRatio = questions.length === 0 ? 0 : questionsDone / questions.length;

    const score = Math.round(
      40 * lessonRatio + 30 * practiceScore + 15 * cookbookRatio + 15 * interviewRatio
    );
    const started = lessonsDone + practiceDone + guidesDone + questionsDone > 0;

    return {
      topicId: topic.id,
      title: topic.title,
      score,
      level: levelForScore(score, started),
      lessonsDone,
      lessonsTotal: lessonIds.length,
      practiceDone,
      practiceTotal: exercises.length,
    };
  });
}
