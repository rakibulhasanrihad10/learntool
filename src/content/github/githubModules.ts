import { CurriculumLesson, LearningModule, Lesson } from '@/types/content';
import { GIT_MODULES } from '@/content/structure/gitModules';
import { FUNDAMENTALS_LESSONS } from '@/content/git/fundamentalsLessons';
import { WORKFLOW_LESSONS } from '@/content/git/workflowLessons';
import { BRANCHING_LESSONS } from '@/content/git/branchingLessons';
import { MERGING_LESSONS } from '@/content/git/mergingLessons';
import { REBASING_LESSONS } from '@/content/git/rebasingLessons';
import { GITHUB_FUNDAMENTALS_LESSONS } from './fundamentals';
import { GITHUB_REPOSITORIES_LESSONS } from './repositories';
import { GITHUB_BRANCHING_LESSONS } from './branching';
import { GITHUB_PR_LESSONS } from './pullRequests';
import { GITHUB_COLLABORATION_LESSONS } from './collaboration';
import { GITHUB_TEAM_WORKFLOWS_LESSONS } from './teamWorkflows';
import { INTERNALS_MENTAL_MODEL_LESSONS } from '@/content/git/internalsMentalModel';
import { INTERNALS_OBJECTS_LESSONS } from '@/content/git/internalsObjects';
import { INTERNALS_REFERENCES_LESSONS } from '@/content/git/internalsReferences';
import { INTERNALS_HISTORY_LESSONS } from '@/content/git/internalsHistory';
import { INTERNALS_STORAGE_LESSONS } from '@/content/git/internalsStorage';

/**
 * GitHub & Collaboration curriculum (subject: github).
 * Reuses the exact LearningModule / Lesson / CurriculumLesson contracts —
 * no parallel content model. LessonViewPage renders these through the same
 * blocks pipeline as Git lessons.
 */
export const ALL_GITHUB_LESSONS: CurriculumLesson[] = [
  ...GITHUB_FUNDAMENTALS_LESSONS,
  ...GITHUB_REPOSITORIES_LESSONS,
  ...GITHUB_BRANCHING_LESSONS,
  ...GITHUB_PR_LESSONS,
  ...GITHUB_COLLABORATION_LESSONS,
  ...GITHUB_TEAM_WORKFLOWS_LESSONS,
];

export const GITHUB_MODULES: LearningModule[] = [
  {
    id: 'github-fundamentals',
    subjectId: 'github',
    slug: 'basics',
    title: 'GitHub Fundamentals',
    titleBn: 'গিটহাব ফান্ডামেন্টালস',
    description: 'What GitHub is, how it differs from Git, remotes, origin/upstream, repository anatomy, and visibility.',
    descriptionBn: 'গিটহাব কী, গিট থেকে পার্থক্য, রিমোট, origin/upstream, রিপোজিটরি গঠন ও দৃশ্যমানতা।',
    icon: 'Github',
    difficulty: 'beginner',
    order: 1,
    lessons: GITHUB_FUNDAMENTALS_LESSONS,
  },
  {
    id: 'github-repositories',
    subjectId: 'github',
    slug: 'repositories',
    title: 'Working with GitHub Repositories',
    titleBn: 'গিটহাব রিপোজিটরি নিয়ে কাজ',
    description: 'Create, connect, clone, push, fetch, and pull — the six moves between your machine and GitHub.',
    descriptionBn: 'তৈরি, সংযোগ, ক্লোন, পুশ, fetch ও পুল — মেশিন ও গিটহাবের মধ্যে ছয় চাল।',
    icon: 'FolderGit2',
    difficulty: 'beginner',
    order: 2,
    lessons: GITHUB_REPOSITORIES_LESSONS,
  },
  {
    id: 'github-branching',
    subjectId: 'github',
    slug: 'branching',
    title: 'Branch-Based Development',
    titleBn: 'ব্রাঞ্চ-ভিত্তিক ডেভেলপমেন্ট',
    description: 'Why branches exist, feature branches, naming, staying updated, merging, and cleaning up.',
    descriptionBn: 'ব্রাঞ্চ কেন, ফিচার ব্রাঞ্চ, নামকরণ, হালনাগাদ থাকা, মার্জ ও পরিষ্কার।',
    icon: 'GitBranch',
    difficulty: 'beginner',
    order: 3,
    lessons: GITHUB_BRANCHING_LESSONS,
  },
  {
    id: 'github-pull-requests',
    subjectId: 'github',
    slug: 'pull-requests',
    title: 'Pull Requests',
    titleBn: 'পুল রিকোয়েস্ট',
    description: 'Proposals, descriptions, drafts, reviews, approvals, merges, and graceful closes.',
    descriptionBn: 'প্রস্তাব, বর্ণনা, ড্রাফট, রিভিউ, অনুমোদন, মার্জ ও মর্যাদাপূর্ণ সমাপ্তি।',
    icon: 'GitPullRequest',
    difficulty: 'intermediate',
    order: 4,
    lessons: GITHUB_PR_LESSONS,
  },
  {
    id: 'github-collaboration',
    subjectId: 'github',
    slug: 'collaboration',
    title: 'Collaboration',
    titleBn: 'সহযোগিতা',
    description: 'Permissions, forks, fork vs clone, upstream wiring, open-source contribution, and fork sync.',
    descriptionBn: 'অনুমতি, ফোর্ক, ফোর্ক বনাম ক্লোন, আপস্ট্রিম সংযোগ, ওপেন-সোর্স অবদান ও ফোর্ক সিঙ্ক।',
    icon: 'Users',
    difficulty: 'beginner',
    order: 5,
    lessons: GITHUB_COLLABORATION_LESSONS,
  },
  {
    id: 'github-team-workflows',
    subjectId: 'github',
    slug: 'team-workflows',
    title: 'Team Workflows',
    titleBn: 'টিম ওয়ার্কফ্লো',
    description: 'Feature-branch, PR, and GitHub Flow rhythms plus syncing, review handling, and conflict resolution.',
    descriptionBn: 'ফিচার-ব্রাঞ্চ, PR ও গিটহাব ফ্লো ছন্দ সাথে সিঙ্ক, রিভিউ সামলানো ও কনফ্লিক্ট সমাধান।',
    icon: 'Workflow',
    difficulty: 'intermediate',
    order: 6,
    lessons: GITHUB_TEAM_WORKFLOWS_LESSONS,
  },
];

/* ------------------------------------------------------------------ */
/* Cross-subject curriculum helpers (single source of truth for routes) */
/* ------------------------------------------------------------------ */

export const ALL_MODULES: LearningModule[] = [...GIT_MODULES, ...GITHUB_MODULES];

export const ALL_CURRICULUM_LESSONS: CurriculumLesson[] = [
  ...FUNDAMENTALS_LESSONS,
  ...WORKFLOW_LESSONS,
  ...BRANCHING_LESSONS,
  ...MERGING_LESSONS,
  ...REBASING_LESSONS,
  ...ALL_GITHUB_LESSONS,
  ...INTERNALS_MENTAL_MODEL_LESSONS,
  ...INTERNALS_OBJECTS_LESSONS,
  ...INTERNALS_REFERENCES_LESSONS,
  ...INTERNALS_HISTORY_LESSONS,
  ...INTERNALS_STORAGE_LESSONS,
];

export function getModuleBySlug(subjectId: string, moduleSlugOrId: string): LearningModule | undefined {
  return ALL_MODULES.find(
    (m) =>
      m.subjectId === subjectId &&
      (m.slug === moduleSlugOrId || m.id === moduleSlugOrId)
  );
}

export function getLessonById(lessonIdOrSlug: string): CurriculumLesson | undefined {
  return ALL_CURRICULUM_LESSONS.find(
    (l) => l.id === lessonIdOrSlug || l.slug === lessonIdOrSlug
  );
}

/** Lightweight metadata lookup across both subjects (module lessons arrays). */
export function getLessonMetaById(lessonIdOrSlug: string): Lesson | undefined {
  for (const mod of ALL_MODULES) {
    const found = mod.lessons.find((l) => l.id === lessonIdOrSlug || l.slug === lessonIdOrSlug);
    if (found) return found;
  }
  return undefined;
}

export interface LessonRoute {
  subjectId: string;
  moduleSlug: string;
  lessonSlug: string;
  path: string;
}

/** Resolve any lesson content id to its canonical /learn/:subject/:module/:lesson route. */
export function getLessonRoute(lessonIdOrSlug: string): LessonRoute | null {
  for (const mod of ALL_MODULES) {
    const lesson = mod.lessons.find((l) => l.id === lessonIdOrSlug || l.slug === lessonIdOrSlug);
    if (lesson) {
      return {
        subjectId: mod.subjectId,
        moduleSlug: mod.slug,
        lessonSlug: lesson.slug,
        path: `/learn/${mod.subjectId}/${mod.slug}/${lesson.slug}`,
      };
    }
  }
  return null;
}

export interface ResolvedLessonLink {
  route: LessonRoute;
  lesson: Lesson;
}

/** Resolve lesson content ids to linkable entries (unknown ids skipped). */
export function resolveLessonLinks(ids: string[] | undefined): ResolvedLessonLink[] {
  const out: ResolvedLessonLink[] = [];
  for (const id of ids ?? []) {
    const route = getLessonRoute(id);
    const lesson = route ? getLessonMetaById(id) : undefined;
    if (!route || !lesson) continue;
    if (out.some((o) => o.lesson.id === lesson.id)) continue;
    out.push({ route, lesson });
  }
  return out;
}
