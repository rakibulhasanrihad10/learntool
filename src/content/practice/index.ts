/**
 * Practice curriculum registry — data only, no UI.
 * Exercises live in per-area files; this module composes the catalog,
 * category metadata, and lookup helpers used by pages and search.
 */
import { LangText, PracticeCategory, PracticeExercise } from '@/types/practice';
import { CORE_EXERCISES } from './exercisesCore';
import { COLLAB_EXERCISES } from './exercisesCollab';
import { RECOVERY_EXERCISES } from './exercisesRecovery';

export { ASSESSMENT_ITEMS } from './assessmentItems';
export type { AssessmentItem } from '@/types/practice';

/** Complete curriculum, canonical order. */
export const PRACTICE_EXERCISES: PracticeExercise[] = [
  ...CORE_EXERCISES,
  ...COLLAB_EXERCISES,
  ...RECOVERY_EXERCISES,
].sort((a, b) => a.order - b.order);

export interface PracticeCategoryMeta {
  id: PracticeCategory;
  titleKey:
    | 'catFundamentals'
    | 'catEveryday'
    | 'catBranching'
    | 'catMerging'
    | 'catRebasing'
    | 'catRemote'
    | 'catGithub'
    | 'catRecovery'
    | 'catInternals';
  blurb: LangText;
  order: number;
}

export const PRACTICE_CATEGORIES: PracticeCategoryMeta[] = [
  {
    id: 'fundamentals',
    titleKey: 'catFundamentals',
    blurb: { en: 'Init, status, add, commit, log — the vocabulary of Git.', bn: 'Init, status, add, commit, log — গিটের শব্দভাণ্ডার।' },
    order: 1,
  },
  {
    id: 'everyday',
    titleKey: 'catEveryday',
    blurb: { en: 'The daily loop: inspect, review, stage, commit, share.', bn: 'দৈনন্দিন চক্র: পরিদর্শন, পর্যালোচনা, স্টেজ, কমিট, শেয়ার।' },
    order: 2,
  },
  {
    id: 'branching',
    titleKey: 'catBranching',
    blurb: { en: 'Create branches, move HEAD, and run feature workflows.', bn: 'ব্রাঞ্চ তৈরি, HEAD সরানো ও ফিচার ওয়ার্কফ্লো চালানো।' },
    order: 3,
  },
  {
    id: 'merging',
    titleKey: 'catMerging',
    blurb: { en: 'Join histories: fast-forwards, merge commits, conflicts.', bn: 'হিস্ট্রি যুক্ত করা: ফাস্ট-ফরোয়ার্ড, মার্জ কমিট, কনফ্লিক্ট।' },
    order: 4,
  },
  {
    id: 'rebasing',
    titleKey: 'catRebasing',
    blurb: { en: 'Replay commits for linear history — and respect the golden rule.', bn: 'লিনিয়ার হিস্ট্রিতে কমিট রিপ্লে — ও গোল্ডেন রুল মেনে চলা।' },
    order: 5,
  },
  {
    id: 'remote',
    titleKey: 'catRemote',
    blurb: { en: 'Remotes, push, fetch, and pull without surprises.', bn: 'বিস্ময় ছাড়া রিমোট, পুশ, fetch ও পুল।' },
    order: 6,
  },
  {
    id: 'github',
    titleKey: 'catGithub',
    blurb: { en: 'Forks, remotes, reviews, and the pull-request loop.', bn: 'ফোর্ক, রিমোট, রিভিউ ও পুল-রিকোয়েস্ট চক্র।' },
    order: 7,
  },
  {
    id: 'recovery',
    titleKey: 'catRecovery',
    blurb: { en: 'Undo safely and recover what matters with the reflog.', bn: 'নিরাপদে আনডু ও রিফ্লগে গুরুত্বপূর্ণ উদ্ধার।' },
    order: 8,
  },
  {
    id: 'internals',
    titleKey: 'catInternals',
    blurb: { en: 'Read graphs like maps: HEAD, parents, reachability.', bn: 'মানচিত্রের মতো গ্রাফ পড়ুন: HEAD, প্যারেন্ট, রিচেবিলিটি।' },
    order: 9,
  },
];

export function getExerciseById(idOrSlug: string): PracticeExercise | undefined {
  const needle = idOrSlug.toLowerCase().trim();
  return PRACTICE_EXERCISES.find(
    (e) => e.id.toLowerCase() === needle || e.id.toLowerCase().endsWith(`.${needle}`)
  );
}

export function getAdjacentExercises(exerciseId: string): {
  prev: PracticeExercise | undefined;
  next: PracticeExercise | undefined;
} {
  const idx = PRACTICE_EXERCISES.findIndex((e) => e.id === exerciseId);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? PRACTICE_EXERCISES[idx - 1] : undefined,
    next: idx < PRACTICE_EXERCISES.length - 1 ? PRACTICE_EXERCISES[idx + 1] : undefined,
  };
}
