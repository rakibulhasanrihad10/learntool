import { Achievement } from '@/types/gamification';

/** Lesson ids gating the Reference Model Complete achievement (all 6 references lessons). */
export const INTERNALS_REFERENCES_LESSON_IDS = [
  'git.internals.what-is-a-reference',
  'git.internals.branch-references',
  'git.internals.head-deep-dive',
  'git.internals.remote-tracking-references',
  'git.internals.lightweight-vs-annotated-tags',
  'git.internals.reflog',
];

/** Team Workflow lesson ids gating the GitHub Workflow Master achievement. */
export const GITHUB_TEAM_WORKFLOW_LESSON_IDS = [
  'github.team.feature-branch-workflow',
  'github.team.pull-request-workflow',
  'github.team.github-flow',
  'github.team.sync-before-work',
  'github.team.handling-review-changes',
  'github.team.resolve-collaboration-conflicts',
];

/**
 * Pure rule: which achievement ids a lesson completion unlocks.
 * Used by gamificationContext.completeLesson and unit-tested directly —
 * no XP is awarded for merely opening pages, only for completions.
 */
export function getUnlockedAchievementsForLesson(
  contentId: string,
  completedLessonIds: string[],
  alreadyUnlocked: string[]
): string[] {
  const unlocked: string[] = [];
  const grant = (id: string) => {
    if (!alreadyUnlocked.includes(id) && !unlocked.includes(id)) unlocked.push(id);
  };
  if (contentId.startsWith('github.')) grant('collaboration_basics');
  if (contentId.startsWith('github.pr.')) grant('pr_ready');
  if (contentId === 'github.pr.reviewing-changes') grant('review_apprentice');
  if (contentId.startsWith('github.team.')) {
    const completedSet = new Set([...completedLessonIds, contentId]);
    if (GITHUB_TEAM_WORKFLOW_LESSON_IDS.every((id) => completedSet.has(id))) {
      grant('workflow_master');
    }
  }
  if (contentId.startsWith('git.internals.')) grant('internals_explorer');
  if (
    contentId === 'git.internals.dag-structure' ||
    contentId === 'git.internals.reachability' ||
    contentId === 'git.internals.commit-graphs'
  ) {
    grant('graph_mastery');
  }
  if (contentId.startsWith('git.internals.')) {
    const completedSet = new Set([...completedLessonIds, contentId]);
    if (INTERNALS_REFERENCES_LESSON_IDS.every((id) => completedSet.has(id))) {
      grant('reference_model_complete');
    }
  }
  return unlocked;
}

/** Categories counting toward the core beginner + intermediate curriculum. */
export const CORE_PRACTICE_CATEGORIES = [
  'fundamentals',
  'everyday',
  'branching',
  'merging',
  'rebasing',
  'remote',
  'github',
  'recovery',
] as const;

export interface PracticeExerciseSummary {
  id: string;
  category: string;
  difficulty: string;
}

/**
 * Pure rule: which practice achievements a practice history unlocks.
 * `completedIds` are completed practice exercise ids; `byCategory` maps a
 * practice category to its completed/total counts; `catalog` is the full
 * exercise list (for the core-curriculum check). Unit-tested directly —
 * XP is only granted through the gamification context on completion.
 */
export function getUnlockedAchievementsForPractice(
  completedIds: string[],
  byCategory: Record<string, { completed: number; total: number }>,
  alreadyUnlocked: string[],
  catalog: PracticeExerciseSummary[] = []
): string[] {
  const unlocked: string[] = [];
  const grant = (id: string) => {
    if (!alreadyUnlocked.includes(id) && !unlocked.includes(id)) unlocked.push(id);
  };
  const done = (category: string) => byCategory[category] ?? { completed: 0, total: 0 };
  const allDone = (category: string) => {
    const stats = done(category);
    return stats.total > 0 && stats.completed >= stats.total;
  };
  const commandCount = completedIds.filter((id) => id.includes('.command-')).length;

  if (completedIds.length >= 1) grant('first_practice');
  if (commandCount >= 10) grant('command_apprentice');
  if (done('branching').completed >= 4) grant('branch_builder');
  if (allDone('merging')) grant('merge_master');
  if (allDone('recovery')) grant('recovery_specialist');
  if (allDone('internals')) grant('internals_practitioner');
  if (catalog.length > 0) {
    const doneSet = new Set(completedIds);
    const coreComplete = catalog
      .filter(
        (e) =>
          (CORE_PRACTICE_CATEGORIES as readonly string[]).includes(e.category) &&
          e.difficulty !== 'advanced'
      )
      .every((e) => doneSet.has(e.id));
    if (coreComplete) grant('git_practitioner');
  }
  return unlocked;
}

/**
 * Initial Catalog of Achievements
 */
export const ACHIEVEMENTS_CATALOG: Achievement[] = [
  {
    id: 'first_commit',
    title: 'First Commit',
    titleBn: 'প্রথম কমিট',
    description: 'Complete your first Git lesson and understand snapshots.',
    descriptionBn: 'আপনার প্রথম গিট পাঠ সম্পন্ন করুন এবং স্ন্যাপশট সম্পর্কে জানুন।',
    iconName: 'GitCommit',
    category: 'progress',
    xpReward: 50,
    isUnlocked: false,
  },
  {
    id: 'branch_explorer',
    title: 'Branch Explorer',
    titleBn: 'ব্রাঞ্চ এক্সপ্লোরার',
    description: 'Complete the Branching & Merging track and master pointers.',
    descriptionBn: 'ব্রাঞ্চিং ও মার্জিং ট্র্যাক সম্পন্ন করুন ও পয়েন্টার নিয়ন্ত্রণ শিখুন।',
    iconName: 'GitBranch',
    category: 'progress',
    xpReward: 100,
    isUnlocked: false,
  },
  {
    id: 'conflict_resolver',
    title: 'Conflict Resolver',
    titleBn: 'কনফ্লিক্ট সমাধানকারী',
    description: 'Successfully diagnose and resolve a simulated merge conflict.',
    descriptionBn: 'সিমুলেটেড মার্জ কনফ্লিক্ট শনাক্ত ও নির্ভুলভাবে সমাধান করুন।',
    iconName: 'GitMerge',
    category: 'mastery',
    xpReward: 100,
    isUnlocked: false,
  },
  {
    id: 'git_regular',
    title: 'Git Regular',
    titleBn: 'নিয়মিত লার্নার',
    description: 'Maintain an active daily learning streak of 3 days or more.',
    descriptionBn: 'টানা ৩ দিন বা তার বেশি সক্রিয় লার্নিং স্ট্রিক বজায় রাখুন।',
    iconName: 'Flame',
    category: 'streak',
    xpReward: 150,
    isUnlocked: false,
  },
  {
    id: 'clean_rebaser',
    title: 'Clean Rebaser',
    titleBn: 'ক্লিন রিবেসার',
    description: 'Squash commits and maintain a linear commit history with rebase.',
    descriptionBn: 'কমিট স্কোয়াশ করুন এবং রিবেসের মাধ্যমে লিনিয়ার হিস্টোরি বজায় রাখুন।',
    iconName: 'GitPullRequest',
    category: 'mastery',
    xpReward: 150,
    isUnlocked: false,
  },
  {
    id: 'pr_ready',
    title: 'Pull Request Ready',
    titleBn: 'পুল রিকোয়েস্ট প্রস্তুত',
    description: 'Complete the Pull Requests track and understand proposal-based collaboration.',
    descriptionBn: 'পুল রিকোয়েস্ট ট্র্যাক সম্পন্ন করুন এবং প্রস্তাব-ভিত্তিক সহযোগিতা বুঝুন।',
    iconName: 'GitPullRequest',
    category: 'progress',
    xpReward: 100,
    isUnlocked: false,
  },
  {
    id: 'collaboration_basics',
    title: 'Collaboration Basics',
    titleBn: 'সহযোগিতার ভিত্তি',
    description: 'Finish your first GitHub lesson and start thinking like a teammate.',
    descriptionBn: 'প্রথম গিটহাব পাঠ শেষ করুন এবং সহকর্মীর মতো ভাবতে শুরু করুন।',
    iconName: 'Users',
    category: 'progress',
    xpReward: 50,
    isUnlocked: false,
  },
  {
    id: 'review_apprentice',
    title: 'Code Review Apprentice',
    titleBn: 'কোড রিভিউ শিক্ষানবিস',
    description: 'Complete the code review lesson and learn to give feedback that teaches.',
    descriptionBn: 'কোড রিভিউ পাঠ সম্পন্ন করুন এবং শেখায় এমন মতামত দিতে শিখুন।',
    iconName: 'MessageSquareHeart',
    category: 'mastery',
    xpReward: 100,
    isUnlocked: false,
  },
  {
    id: 'workflow_master',
    title: 'GitHub Workflow Master',
    titleBn: 'গিটহাব ওয়ার্কফ্লো মাস্টার',
    description: 'Complete every Team Workflows lesson, from feature branches to conflict resolution.',
    descriptionBn: 'ফিচার ব্রাঞ্চ থেকে কনফ্লিক্ট সমাধান পর্যন্ত প্রতিটি টিম ওয়ার্কফ্লো পাঠ সম্পন্ন করুন।',
    iconName: 'Workflow',
    category: 'mastery',
    xpReward: 150,
    isUnlocked: false,
  },
  {
    id: 'internals_explorer',
    title: 'Git Internals Explorer',
    titleBn: 'গিট ইন্টারনালস এক্সপ্লোরার',
    description: 'Complete your first Git Internals lesson and see beneath the commands.',
    descriptionBn: 'প্রথম গিট ইন্টারনালস পাঠ সম্পন্ন করুন এবং কমান্ডের নিচে দেখুন।',
    iconName: 'Boxes',
    category: 'progress',
    xpReward: 50,
    isUnlocked: false,
  },
  {
    id: 'graph_mastery',
    title: 'Commit Graph Mastery',
    titleBn: 'কমিট গ্রাফ দক্ষতা',
    description: 'Master commit graphs, reachability, and DAG structure.',
    descriptionBn: 'কমিট গ্রাফ, রিচেবিলিটি ও DAG কাঠামো আয়ত্ত করুন।',
    iconName: 'Workflow',
    category: 'mastery',
    xpReward: 100,
    isUnlocked: false,
  },
  {
    id: 'reference_model_complete',
    title: 'Reference Model Complete',
    titleBn: 'রেফারেন্স মডেল সম্পূর্ণ',
    description: 'Complete every References lesson, from branch refs to the reflog safety net.',
    descriptionBn: 'ব্রাঞ্চ ref থেকে রিফ্লগ নিরাপত্তা জাল পর্যন্ত প্রতিটি রেফারেন্স পাঠ সম্পন্ন করুন।',
    iconName: 'Signpost',
    category: 'mastery',
    xpReward: 150,
    isUnlocked: false,
  },
  {
    id: 'first_practice',
    title: 'First Practice',
    titleBn: 'প্রথম অনুশীলন',
    description: 'Complete your first practice exercise in the lab.',
    descriptionBn: 'ল্যাবে আপনার প্রথম অনুশীলন সম্পন্ন করুন।',
    iconName: 'FlaskConical',
    category: 'progress',
    xpReward: 25,
    isUnlocked: false,
  },
  {
    id: 'command_apprentice',
    title: 'Command Apprentice',
    titleBn: 'কমান্ড শিক্ষানবিশ',
    description: 'Complete 10 command-focused practice exercises.',
    descriptionBn: 'কমান্ড-কেন্দ্রিক ১০টি অনুশীলন সম্পন্ন করুন।',
    iconName: 'Terminal',
    category: 'mastery',
    xpReward: 100,
    isUnlocked: false,
  },
  {
    id: 'branch_builder',
    title: 'Branch Builder',
    titleBn: 'ব্রাঞ্চ নির্মাতা',
    description: 'Complete beginner branching exercises and switch with confidence.',
    descriptionBn: 'প্রাথমিক ব্রাঞ্চিং অনুশীলন সম্পন্ন করুন ও আত্মবিশ্বাসের সাথে সুইচ করুন।',
    iconName: 'GitBranch',
    category: 'mastery',
    xpReward: 100,
    isUnlocked: false,
  },
  {
    id: 'merge_master',
    title: 'Merge Master',
    titleBn: 'মার্জ মাস্টার',
    description: 'Complete every merging exercise, conflicts included.',
    descriptionBn: 'কনফ্লিক্টসহ প্রতিটি মার্জিং অনুশীলন সম্পন্ন করুন।',
    iconName: 'GitMerge',
    category: 'mastery',
    xpReward: 150,
    isUnlocked: false,
  },
  {
    id: 'recovery_specialist',
    title: 'Recovery Specialist',
    titleBn: 'রিকভারি বিশেষজ্ঞ',
    description: 'Complete every undo and recovery exercise without fear.',
    descriptionBn: 'নির্ভয়ে প্রতিটি আনডু ও রিকভারি অনুশীলন সম্পন্ন করুন।',
    iconName: 'LifeBuoy',
    category: 'mastery',
    xpReward: 150,
    isUnlocked: false,
  },
  {
    id: 'internals_practitioner',
    title: 'Git Internals Practitioner',
    titleBn: 'গিট ইন্টারনালস অনুশীলনকারী',
    description: 'Complete the Git Internals practice set and read graphs like maps.',
    descriptionBn: 'গিট ইন্টারনালস অনুশীলন সেট সম্পন্ন করুন ও মানচিত্রের মতো গ্রাফ পড়ুন।',
    iconName: 'Boxes',
    category: 'mastery',
    xpReward: 100,
    isUnlocked: false,
  },
  {
    id: 'git_practitioner',
    title: 'Git Practitioner',
    titleBn: 'গিট অনুশীলনকারী',
    description: 'Complete the core beginner and intermediate practice curriculum.',
    descriptionBn: 'মূল প্রাথমিক ও মধ্যবর্তী অনুশীলন পাঠ্যক্রম সম্পন্ন করুন।',
    iconName: 'Award',
    category: 'career',
    xpReward: 200,
    isUnlocked: false,
  },
  {
    id: 'interview_ready',
    title: 'Interview Ready',
    titleBn: 'ইন্টারভিউ প্রস্তুত',
    description: 'Review 20 interview questions and finish a mock interview with honest self-ratings.',
    descriptionBn: '২০টি ইন্টারভিউ প্রশ্ন পর্যালোচনা করুন ও সৎ স্ব-মূল্যায়নে একটি মক শেষ করুন।',
    iconName: 'Award',
    category: 'career',
    xpReward: 200,
    isUnlocked: false,
  },
  {
    id: 'interview_first_answer',
    title: 'First Interview Answer',
    titleBn: 'প্রথম ইন্টারভিউ উত্তর',
    description: 'Answer your first interview question honestly — self-rating counts.',
    descriptionBn: 'প্রথম ইন্টারভিউ প্রশ্নের সৎ উত্তর দিন — স্ব-মূল্যায়ন গণ্য হয়।',
    iconName: 'MessageSquareHeart',
    category: 'career',
    xpReward: 25,
    isUnlocked: false,
  },
  {
    id: 'interview_10_reviewed',
    title: 'Interview Warm-up',
    titleBn: 'ইন্টারভিউ ওয়ার্ম-আপ',
    description: 'Review 10 interview questions across any topics.',
    descriptionBn: 'যেকোনো বিষয়ে ১০টি ইন্টারভিউ প্রশ্ন পর্যালোচনা করুন।',
    iconName: 'MessagesSquare',
    category: 'career',
    xpReward: 50,
    isUnlocked: false,
  },
  {
    id: 'interview_30_reviewed',
    title: 'Confident Explainer',
    titleBn: 'আত্মবিশ্বাসী ব্যাখ্যাকারী',
    description: 'Review 30 interview questions — you can explain Git, not just use it.',
    descriptionBn: '৩০টি ইন্টারভিউ প্রশ্ন পর্যালোচনা করুন — শুধু ব্যবহার নয়, গিট ব্যাখ্যা করতে পারেন।',
    iconName: 'Mic',
    category: 'career',
    xpReward: 100,
    isUnlocked: false,
  },
  {
    id: 'interview_60_reviewed',
    title: 'Git Storyteller',
    titleBn: 'গিট গল্পকার',
    description: 'Review 60 interview questions across fundamentals, commands, history, and internals.',
    descriptionBn: 'মৌলিক, কমান্ড, হিস্ট্রি ও ইন্টারনালসে ৬০টি ইন্টারভিউ প্রশ্ন পর্যালোচনা করুন।',
    iconName: 'BookOpen',
    category: 'career',
    xpReward: 150,
    isUnlocked: false,
  },
  {
    id: 'interview_mock_first',
    title: 'First Mock Interview',
    titleBn: 'প্রথম মক ইন্টারভিউ',
    description: 'Finish your first timed-style mock interview run.',
    descriptionBn: 'প্রথম মক ইন্টারভিউ রান শেষ করুন।',
    iconName: 'Timer',
    category: 'career',
    xpReward: 100,
    isUnlocked: false,
  },
  {
    id: 'path_beginner_complete',
    title: 'Git Beginner Complete',
    titleBn: 'গিট বিগিনার সম্পূর্ণ',
    description: 'Finish every required step of the Git Beginner path, ending with the skill assessment.',
    descriptionBn: 'দক্ষতা মূল্যায়নসহ গিট বিগিনার পাথের প্রতিটি আবশ্যক ধাপ শেষ করুন।',
    iconName: 'Route',
    category: 'career',
    xpReward: 200,
    isUnlocked: false,
  },
  {
    id: 'path_intermediate_complete',
    title: 'Git Intermediate Complete',
    titleBn: 'গিট ইন্টারমিডিয়েট সম্পূর্ণ',
    description: 'Finish every required step of the Git Intermediate path: merging, collaboration, and recovery.',
    descriptionBn: 'গিট ইন্টারমিডিয়েট পাথের প্রতিটি আবশ্যক ধাপ শেষ করুন: মার্জিং, সহযোগিতা ও রিকভারি।',
    iconName: 'Route',
    category: 'career',
    xpReward: 250,
    isUnlocked: false,
  },
  {
    id: 'path_advanced_complete',
    title: 'Git Advanced Complete',
    titleBn: 'গিট অ্যাডভান্সড সম্পূর্ণ',
    description: 'Finish every required step of the Git Advanced path, from objects to senior interview prep.',
    descriptionBn: 'অবজেক্ট থেকে সিনিয়র ইন্টারভিউ প্রস্তুতি পর্যন্ত গিট অ্যাডভান্সড পাথের প্রতিটি আবশ্যক ধাপ শেষ করুন।',
    iconName: 'Route',
    category: 'career',
    xpReward: 300,
    isUnlocked: false,
  },
  {
    id: 'interview_mock_high_score',
    title: 'Mock High Scorer',
    titleBn: 'মক উচ্চ স্কোরার',
    description: 'Score 80 or more on any mock interview run.',
    descriptionBn: 'যেকোনো মক ইন্টারভিউ রানে ৮০ বা বেশি স্কোর করুন।',
    iconName: 'Trophy',
    category: 'career',
    xpReward: 150,
    isUnlocked: false,
  },
];
