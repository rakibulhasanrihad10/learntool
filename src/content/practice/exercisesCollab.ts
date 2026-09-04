/**
 * Practice exercises — merging, rebasing, remote workflow, GitHub.
 */
import { GitSimulationState } from '@/features/simulation/models';
import { PracticeExercise } from '@/types/practice';

const BASE_FILES: GitSimulationState['files'] = [
  { name: 'README.md', workStatus: 'clean', staged: false },
  { name: 'app.js', workStatus: 'clean', staged: false },
  { name: 'package.json', workStatus: 'clean', staged: false },
];

const cleanFiles = () => BASE_FILES.map((f) => ({ ...f }));

function baseState(overrides: Partial<GitSimulationState> = {}): GitSimulationState {
  return {
    files: cleanFiles(),
    commits: [{ id: 'C1', message: 'Initial commit', parents: [] }],
    localBranches: { main: 'C1' },
    remoteTracking: { 'origin/main': 'C1' },
    serverBranches: { main: 'C1' },
    serverOnly: [],
    currentBranch: 'main',
    seq: 2,
    ...overrides,
  };
}

export const COLLAB_EXERCISES: PracticeExercise[] = [
  /* ---------------- Merging (14–16) ---------------- */
  {
    id: 'git.practice.merge-feature',
    category: 'merging',
    difficulty: 'intermediate',
    order: 14,
    estimatedMinutes: 10,
    xpReward: 20,
    tags: ['merge', 'divergence', 'simulation', 'command'],
    keywords: ['join branches', 'merge commit', 'combine histories'],
    title: { en: 'Merge a Feature Branch', bn: 'ফিচার ব্রাঞ্চ মার্জ করুন' },
    description: {
      en: 'Two branches diverged. Join them with a real merge commit on main.',
      bn: 'দুটি ব্রাঞ্চ ডাইভার্জ করেছে। main-এ আসল মার্জ কমিটে যুক্ত করুন।',
    },
    objective: {
      en: 'Produce a merge commit on main with two parents.',
      bn: 'দুই প্যারেন্টসহ main-এ মার্জ কমিট তৈরি করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'simulate',
        prompt: {
          en: 'main (C2) and feature (C3) diverged from C1. Merge feature into main — then Check.',
          bn: 'main (C2) ও feature (C3) C1 থেকে ডাইভার্জ করেছে। feature main-এ মার্জ করুন — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'Neither side contains the other, so Git records a merge commit with both parents. Both histories survive.',
          bn: 'কোনো পক্ষ অন্যকে ধারণ করে না, তাই গিট উভয় প্যারেন্টসহ মার্জ কমিট রেকর্ড করে। উভয় হিস্ট্রি বেঁচে থাকে।',
        },
        setup: baseState({
          commits: [
            { id: 'C1', message: 'Initial commit', parents: [] },
            { id: 'C2', message: 'Homepage copy', parents: ['C1'] },
            { id: 'C3', message: 'Login form', parents: ['C1'] },
          ],
          localBranches: { main: 'C2', feature: 'C3' },
          remoteTracking: { 'origin/main': 'C2' },
          serverBranches: { main: 'C2' },
          currentBranch: 'main',
          seq: 4,
        }),
        validation: [{ rule: 'tipHasParents', branch: 'main', count: 2 }],
      },
    ],
    hints: [
      {
        en: 'Merging joins the source branch into your current branch. Where are you, and what should join it?',
        bn: 'মার্জ সোর্স ব্রাঞ্চ বর্তমান ব্রাঞ্চে যুক্ত করে। আপনি কোথায়, আর কী যুক্ত হওয়া উচিত?',
      },
      {
        en: 'You are on main. Merge the feature branch into it.',
        bn: 'আপনি main-এ আছেন। ফিচার ব্রাঞ্চ এতে মার্জ করুন।',
      },
    ],
    prerequisites: ['git.practice.create-feature-branch'],
    relatedCommands: ['git.merge', 'git.status'],
    relatedLessons: ['git.fundamentals.branch'],
    relatedScenarios: ['git.troubleshooting.merge-conflict'],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.command-fast-forward-merge',
    category: 'merging',
    difficulty: 'intermediate',
    order: 15,
    estimatedMinutes: 8,
    xpReward: 20,
    tags: ['merge', 'fast-forward', 'simulation', 'command'],
    keywords: ['no merge commit', 'linear merge', 'catch up branch'],
    title: { en: 'Understand Fast-Forward Merge', bn: 'ফাস্ট-ফরোয়ার্ড মার্জ বুঝুন' },
    description: {
      en: 'When one branch has no unique work, merging just slides the pointer — no merge commit appears.',
      bn: 'এক ব্রাঞ্চে অনন্য কাজ না থাকলে মার্জ শুধু পয়েন্টার এগিয়ে দেয় — মার্জ কমিট আসে না।',
    },
    objective: {
      en: 'Fast-forward main to feature with history unchanged in size.',
      bn: 'হিস্ট্রি আকার অপরিবর্তিত রেখে main ফিচারে ফাস্ট-ফরোয়ার্ড করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'main is at C1 and feature is at C2 (child of C1). What will merging feature into main produce?',
          bn: 'main C1-তে ও feature C2-তে (C1-এর সন্তান)। feature main-এ মার্জে কী হবে?',
        },
        explanation: {
          en: 'main has nothing of its own, so Git slides it forward to C2. Fast-forward needs no merge commit.',
          bn: 'main-এর নিজস্ব কিছু নেই, তাই গিট এগিয়ে C2-তে নেয়। ফাস্ট-ফরোয়ার্ডে মার্জ কমিট দরকার নেই।',
        },
        options: [
          { id: 'ff', label: 'Fast-forward: main slides to C2, no new commit', labelBn: 'ফাস্ট-ফরোয়ার্ড: main C2-তে যায়, নতুন কমিট নেই', correct: true },
          { id: 'merge', label: 'A merge commit with two parents', labelBn: 'দুই প্যারেন্টের মার্জ কমিট', correct: false },
          { id: 'rebase', label: 'An automatic rebase of C1', labelBn: 'C1-এর স্বয়ংক্রিয় রিবেস', correct: false },
          { id: 'reject', label: 'A rejection — histories differ', labelBn: 'প্রত্যাখ্যান — হিস্ট্রি আলাদা', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'simulate',
        prompt: {
          en: 'Prove it: merge feature into main — then Check.',
          bn: 'প্রমাণ করুন: feature main-এ মার্জ করুন — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'Both branches now point at C2 and the commit count is unchanged — the signature of a fast-forward.',
          bn: 'উভয় ব্রাঞ্চ এখন C2-তে ও কমিট সংখ্যা অপরিবর্তিত — ফাস্ট-ফরোয়ার্ডের স্বাক্ষর।',
        },
        setup: baseState({
          commits: [
            { id: 'C1', message: 'Initial commit', parents: [] },
            { id: 'C2', message: 'Login form', parents: ['C1'] },
          ],
          localBranches: { main: 'C1', feature: 'C2' },
          currentBranch: 'main',
          seq: 3,
        }),
        validation: [{ rule: 'tipsEqual', branchA: 'main', branchB: 'feature' }, { rule: 'commitCountExact', count: 2 }],
      },
    ],
    hints: [
      {
        en: 'Fast-forward is possible when your branch has no commits of its own.',
        bn: 'ব্রাঞ্চে নিজস্ব কমিট না থাকলে ফাস্ট-ফরোয়ার্ড সম্ভব।',
      },
    ],
    relatedCommands: ['git.merge', 'git.log'],
    relatedLessons: ['git.fundamentals.branch'],
    relatedScenarios: [],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.merge-conflict-flow',
    category: 'merging',
    difficulty: 'intermediate',
    order: 16,
    estimatedMinutes: 8,
    xpReward: 20,
    tags: ['conflict', 'markers', 'diagnose', 'command'],
    keywords: ['conflict markers', 'merge stopped', 'resolve conflict'],
    title: { en: 'Resolve a Simulated Merge Conflict', bn: 'সিমুলেটেড মার্জ কনফ্লিক্ট সমাধান করুন' },
    description: {
      en: 'A merge stopped with conflict markers. Decide the safe path through it.',
      bn: 'কনফ্লিক্ট মার্কারে মার্জ থেমেছে। নিরাপদ পথ নির্ধারণ করুন।',
    },
    objective: {
      en: 'Choose resolution over destruction when teammates’ work is involved.',
      bn: 'সহকর্মীদের কাজ জড়িত থাকলে ধ্বংসের বদলে সমাধান বেছে নিন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'To FINISH the merge after editing the conflicted files, what must happen next?',
          bn: 'কনফ্লিক্টেড ফাইল এডিটের পর মার্জ শেষ করতে পরবর্তী কী হতে হবে?',
        },
        explanation: {
          en: 'Resolved files must be staged, then committed to complete the merge commit. Skipping the commit leaves the merge unfinished.',
          bn: 'সমাধানকৃত ফাইল স্টেজ করে কমিট করতে হবে মার্জ কমিট সম্পন্নে। কমিট বাদে মার্জ অসমাপ্ত থাকে।',
        },
        options: [
          { id: 'addcommit', label: 'Stage the resolved files, then commit', labelBn: 'সমাধানকৃত ফাইল স্টেজ করে কমিট', correct: true },
          { id: 'push', label: 'Push immediately — the remote resolves it', labelBn: 'সাথে সাথে পুশ — রিমোট সমাধান করে', correct: false },
          { id: 'delete', label: 'Delete the conflicted files', labelBn: 'কনফ্লিক্টেড ফাইল মুছে ফেলা', correct: false },
          { id: 'force', label: 'Force-push over the conflict', labelBn: 'কনফ্লিক্টের ওপর ফোর্স-পুশ', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'The conflict is bigger than expected and you want out cleanly. Safest escape?',
          bn: 'কনফ্লিক্ট প্রত্যাশার বড় ও পরিষ্কার বেরোতে চান। নিরাপদ পলায়ন?',
        },
        explanation: {
          en: 'git merge --abort cancels the merge and restores the pre-merge state. Nothing is half-merged afterwards.',
          bn: 'git merge --abort মার্জ বাতিল করে প্রি-মার্জ অবস্থা ফেরায়। পরে কিছু অর্ধ-মার্জড থাকে না।',
        },
        options: [
          { id: 'abort', label: 'git merge --abort', correct: true },
          { id: 'hard', label: 'git reset --hard origin/main', correct: false },
          { id: 'rebase', label: 'git rebase --continue', correct: false },
          { id: 'close', label: 'Close the terminal and hope', labelBn: 'টার্মিনাল বন্ধ করে আশা', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'Markers are a question, not damage. Answer them by editing, then tell Git you are done.',
        bn: 'মার্কার প্রশ্ন, ক্ষতি নয়। এডিট করে উত্তর দিন, তারপর গিটকে জানান শেষ।',
      },
    ],
    relatedCommands: ['git.merge', 'git.status', 'git.add'],
    relatedLessons: ['git.fundamentals.branch'],
    relatedScenarios: ['git.troubleshooting.merge-conflict'],
    relatedWorkflows: [],
  },
  /* ---------------- Rebasing (17–18) ---------------- */
  {
    id: 'git.practice.rebase-feature',
    category: 'rebasing',
    difficulty: 'intermediate',
    order: 17,
    estimatedMinutes: 10,
    xpReward: 20,
    tags: ['rebase', 'linear', 'simulation'],
    keywords: ['replay commits', 'linear history', 'rebase onto main'],
    title: { en: 'Rebase a Feature Branch', bn: 'ফিচার ব্রাঞ্চ রিবেস করুন' },
    description: {
      en: 'Replay feature commits onto the latest main for a clean linear history.',
      bn: 'পরিষ্কার লিনিয়ার হিস্ট্রিতে সর্বশেষ main-এর ওপর ফিচার কমিট রিপ্লে করুন।',
    },
    objective: {
      en: 'End with feature descending from main’s tip.',
      bn: 'main-এর টিপ থেকে feature নেমে শেষ করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'simulate',
        prompt: {
          en: 'feature (F1) sits on old C1 while main moved to C2. Rebase feature onto main — then Check.',
          bn: 'feature (F1) পুরনো C1-তে আর main C2-তে গেছে। feature main-এর ওপর রিবেস করুন — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'Rebase replays F1 onto C2 as a new commit. The branch now descends from main — linear history, new identities.',
          bn: 'রিবেস F1 C2-এর ওপর নতুন কমিটে রিপ্লে করে। ব্রাঞ্চ এখন main থেকে নামে — লিনিয়ার হিস্ট্রি, নতুন পরিচয়।',
        },
        setup: baseState({
          commits: [
            { id: 'C1', message: 'Initial commit', parents: [] },
            { id: 'C2', message: 'Homepage copy', parents: ['C1'] },
            { id: 'F1', message: 'Login form', parents: ['C1'] },
          ],
          localBranches: { main: 'C2', feature: 'F1' },
          remoteTracking: { 'origin/main': 'C2' },
          serverBranches: { main: 'C2' },
          currentBranch: 'feature',
          seq: 3,
        }),
        validation: [{ rule: 'descendsFrom', branch: 'feature', ancestorBranch: 'main' }, { rule: 'commitCountMin', count: 4 }],
      },
    ],
    hints: [
      {
        en: 'Rebase needs a clean tree and a different base branch. You have both.',
        bn: 'রিবেসে পরিষ্কার ট্রি ও ভিন্ন বেস ব্রাঞ্চ দরকার। দুটোই আছে।',
      },
      {
        en: 'You are on feature. Replay it onto main.',
        bn: 'আপনি feature-এ আছেন। main-এর ওপর রিপ্লে করুন।',
      },
    ],
    prerequisites: ['git.practice.merge-feature'],
    relatedCommands: ['git.rebase', 'git.log'],
    relatedLessons: ['git.fundamentals.branch'],
    relatedScenarios: ['git.troubleshooting.rebase-conflict'],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.command-rebase-rewrites-history',
    category: 'rebasing',
    difficulty: 'advanced',
    order: 18,
    estimatedMinutes: 8,
    xpReward: 30,
    tags: ['rebase', 'identity', 'golden-rule', 'graph', 'command'],
    keywords: ['new commit hashes', 'rewritten history', 'never rebase shared'],
    title: { en: 'Understand Why Rebase Rewrites History', bn: 'কেন রিবেস হিস্ট্রি পুনর্লেখে বুঝুন' },
    description: {
      en: 'Read a rebased graph and internalize the golden rule of rebasing.',
      bn: 'রিবেসড গ্রাফ পড়ুন ও রিবেসের গোল্ডেন রুল আত্মস্থ করুন।',
    },
    objective: {
      en: 'Explain new commit identities and when rebasing is forbidden.',
      bn: 'নতুন কমিট পরিচয় ব্যাখ্যা করুন ও কখন রিবেস নিষেধ তা বলুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'After rebasing, the graph shows F1′ (child of C2) while old F1 (child of C1) still exists. Why is F1′ a NEW commit?',
          bn: 'রিবেসের পর গ্রাফে F1′ (C2-এর সন্তান) দেখায় আর পুরনো F1 (C1-এর সন্তান) আছে। F1′ নতুন কমিট কেন?',
        },
        explanation: {
          en: 'A commit’s identity includes its parent. Different parent means different hash — replaying always mints new commits.',
          bn: 'কমিট পরিচয়ে প্যারেন্ট থাকে। ভিন্ন প্যারেন্ট মানে ভিন্ন হ্যাশ — রিপ্লে সবসময় নতুন কমিট তৈরি করে।',
        },
        stateSnapshot: {
          files: cleanFiles(),
          commits: [
            { id: 'C1', message: 'Initial commit', parents: [] },
            { id: 'C2', message: 'Homepage copy', parents: ['C1'] },
            { id: 'F1', message: 'Login form', parents: ['C1'] },
            { id: 'F1’', message: 'Login form', parents: ['C2'] },
          ],
          localBranches: { main: 'C2', feature: 'F1’' },
          remoteTracking: { 'origin/main': 'C2' },
          serverBranches: { main: 'C2' },
          serverOnly: [],
          currentBranch: 'feature',
          seq: 4,
        },
        snapshotView: 'graph',
        options: [
          { id: 'parent', label: 'Its parent changed, so its hash changed', labelBn: 'প্যারেন্ট বদলেছে, তাই হ্যাশ বদলেছে', correct: true },
          { id: 'moved', label: 'Git physically moved the original object', labelBn: 'গিট মূল অবজেক্ট সরিয়েছে', correct: false },
          { id: 'renamed', label: 'Only the branch name changed', labelBn: 'শুধু ব্রাঞ্চ নাম বদলেছে', correct: false },
          { id: 'merged', label: 'It absorbed C2 in a merge commit', labelBn: 'মার্জ কমিটে C2 শুষে নিয়েছে', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'Your teammate already pulled feature with old F1. You rebased and force-pushed F1′. What happens to them?',
          bn: 'সহকর্মী পুরনো F1-সহ feature পুল করেছে। আপনি রিবেস করে F1′ ফোর্স-পুশ করলেন। তাদের কী হবে?',
        },
        explanation: {
          en: 'Their history still points at F1 while the remote moved on — a divergent mess only painful merges fix. Never rebase shared branches.',
          bn: 'তাদের হিস্ট্রি F1-তে আর রিমোট এগিয়েছে — ডাইভার্জড জট যা শুধু কষ্টকর মার্জ ঠিক করে। শেয়ার্ড ব্রাঞ্চ কখনো রিবেস নয়।',
        },
        options: [
          { id: 'diverge', label: 'Their history diverges painfully from the rewritten remote', labelBn: 'তাদের হিস্ট্রি পুনর্লিখিত রিমোট থেকে কষ্টে ডাইভার্জ করে', correct: true },
          { id: 'auto', label: 'Git auto-updates their clone silently', labelBn: 'গিট নীরবে তাদের ক্লোন আপডেট করে', correct: false },
          { id: 'safe', label: 'Nothing — force-push is always safe', labelBn: 'কিছু না — ফোর্স-পুশ সবসময় নিরাপদ', correct: false },
          { id: 'delete', label: 'Their local commits are deleted', labelBn: 'তাদের লোকাল কমিট মুছে যায়', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'Identity in Git comes from content plus parents. Change either, get a stranger.',
        bn: 'গিটে পরিচয় আসে কন্টেন্ট ও প্যারেন্ট থেকে। যেকোনো বদলান, অপরিচিত পাবেন।',
      },
    ],
    relatedCommands: ['git.rebase', 'git.log'],
    relatedLessons: ['git.internals.rebase-rewrites-history', 'git.fundamentals.branch'],
    relatedScenarios: ['git.troubleshooting.rebase-conflict'],
    relatedWorkflows: [],
  },
  /* ---------------- Remote Workflow (19–22) ---------------- */
  {
    id: 'git.practice.command-connect-remote',
    category: 'remote',
    difficulty: 'beginner',
    order: 19,
    estimatedMinutes: 6,
    xpReward: 10,
    tags: ['remote', 'origin', 'command'],
    keywords: ['add remote', 'origin url', 'connect github'],
    title: { en: 'Connect a Repository to a Remote', bn: 'রিপোজিটরি রিমোটে যুক্ত করুন' },
    description: {
      en: 'Name your remote and learn to verify where push and fetch actually go.',
      bn: 'রিমোটের নাম দিন ও পুশ-ফেচ আসলে কোথায় যায় যাচাই করতে শিখুন।',
    },
    objective: {
      en: 'Explain origin and verify remote URLs.',
      bn: 'origin ব্যাখ্যা করুন ও রিমোট URL যাচাই করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'What is "origin" in a typical clone?',
          bn: 'সাধারণ ক্লোনে "origin" কী?',
        },
        explanation: {
          en: 'origin is just the default nickname for the remote you cloned from — a convention, not a keyword.',
          bn: 'origin শুধু ক্লোন করা রিমোটের ডিফল্ট ডাকনাম — প্রচলন, কি-ওয়ার্ড নয়।',
        },
        options: [
          { id: 'nick', label: 'The default nickname for the cloned remote', labelBn: 'ক্লোনড রিমোটের ডিফল্ট ডাকনাম', correct: true },
          { id: 'main', label: 'Always the main branch itself', labelBn: 'সবসময় main ব্রাঞ্চ নিজে', correct: false },
          { id: 'github', label: 'A reserved GitHub keyword', labelBn: 'সংরক্ষিত গিটহাব কি-ওয়ার্ড', correct: false },
          { id: 'server', label: 'The physical server hostname', labelBn: 'ভৌত সার্ভার হোস্টনেম', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'complete',
        prefix: 'git remote',
        placeholder: '___',
        prompt: {
          en: 'Complete the flag that lists remote names with their URLs.',
          bn: 'রিমোট নাম URL-সহ তালিকা করা ফ্ল্যাগটি সম্পূর্ণ করুন।',
        },
        explanation: {
          en: 'git remote -v shows each remote with fetch and push URLs. Verify before pushing somewhere new.',
          bn: 'git remote -v প্রতিটি রিমোট fetch ও push URL-সহ দেখায়। নতুন কোথাও পুশের আগে যাচাই করুন।',
        },
        acceptedAnswers: ['-v', '--verbose'],
      },
    ],
    hints: [
      {
        en: 'Nicknames are conveniences. One flag makes Git show you what they point at.',
        bn: 'ডাকনাম সুবিধা। এক ফ্ল্যাগে গিট দেখায় সেগুলো কী নির্দেশ করে।',
      },
    ],
    relatedCommands: ['git.remote'],
    relatedLessons: ['git.fundamentals.remote-repository'],
    relatedScenarios: ['git.troubleshooting.wrong-remote'],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.push-feature',
    category: 'remote',
    difficulty: 'beginner',
    order: 20,
    estimatedMinutes: 8,
    xpReward: 10,
    tags: ['push', 'remote', 'tracking', 'simulation', 'command'],
    keywords: ['publish branch', 'upload commits', 'share work'],
    title: { en: 'Push a Feature Branch', bn: 'ফিচার ব্রাঞ্চ পুশ করুন' },
    description: {
      en: 'Publish a local-only branch so the remote and your tracking ref both catch up.',
      bn: 'শুধু-লোকাল ব্রাঞ্চ প্রকাশ করুন যাতে রিমোট ও ট্র্যাকিং ref উভয়ে এগোয়।',
    },
    objective: {
      en: 'Push feature so server, tracking ref, and local tip all agree.',
      bn: 'feature পুশ করুন যাতে সার্ভার, ট্র্যাকিং ref ও লোকাল টিপ একমত হয়।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'simulate',
        prompt: {
          en: 'feature (C2) exists only locally. Publish it — then Check.',
          bn: 'feature (C2) শুধু লোকালি আছে। প্রকাশ করুন — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'The first push creates the remote branch and sets up origin/feature. All three pointers now agree.',
          bn: 'প্রথম পুশ রিমোট ব্রাঞ্চ তৈরি করে ও origin/feature সেট করে। তিনটি পয়েন্টার এখন একমত।',
        },
        setup: baseState({
          commits: [
            { id: 'C1', message: 'Initial commit', parents: [] },
            { id: 'C2', message: 'Login form', parents: ['C1'] },
          ],
          localBranches: { main: 'C1', feature: 'C2' },
          remoteTracking: { 'origin/main': 'C1' },
          serverBranches: { main: 'C1' },
          currentBranch: 'feature',
          seq: 3,
        }),
        validation: [
          { rule: 'serverHasBranch', branch: 'feature' },
          { rule: 'remoteInSync', branch: 'feature' },
          { rule: 'trackingInSync', branch: 'feature' },
        ],
      },
    ],
    hints: [
      {
        en: 'Pushing sends what the server lacks. What is the server missing here?',
        bn: 'পুশ সার্ভারে নেই তা পাঠায়। এখানে সার্ভারে কী নেই?',
      },
      {
        en: 'You are on feature. A plain push publishes the current branch.',
        bn: 'আপনি feature-এ আছেন। সাধারণ পুশ বর্তমান ব্রাঞ্চ প্রকাশ করে।',
      },
    ],
    prerequisites: ['git.practice.create-feature-branch'],
    relatedCommands: ['git.push', 'git.branch'],
    relatedLessons: ['git.fundamentals.remote-repository'],
    relatedScenarios: [],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.fetch-changes',
    category: 'remote',
    difficulty: 'intermediate',
    order: 21,
    estimatedMinutes: 8,
    xpReward: 20,
    tags: ['fetch', 'tracking', 'simulation'],
    keywords: ['download commits', 'see remote work', 'update tracking'],
    title: { en: 'Fetch Remote Changes', bn: 'রিমোট পরিবর্তন Fetch করুন' },
    description: {
      en: 'A teammate pushed. Download their work safely — without moving your branch an inch.',
      bn: 'সহকর্মী পুশ করেছে। নিরাপদে কাজ ডাউনলোড করুন — ব্রাঞ্চ একচুল না নাড়িয়ে।',
    },
    objective: {
      en: 'Fetch so origin/main matches the server while local main stays put.',
      bn: 'Fetch করুন যাতে origin/main সার্ভারের সাথে মেলে আর লোকাল main স্থির থাকে।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'simulate',
        prompt: {
          en: 'The server moved to C2 but you still sit on C1. Fetch — then Check.',
          bn: 'সার্ভার C2-তে গেছে কিন্তু আপনি C1-তে। Fetch করুন — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'Fetch downloads C2 and advances origin/main. Your branch, files, and staging never move during a fetch.',
          bn: 'Fetch C2 ডাউনলোড করে origin/main এগিয়ে দেয়। fetch-এ ব্রাঞ্চ, ফাইল ও স্টেজিং কখনো নড়ে না।',
        },
        setup: baseState({
          commits: [{ id: 'C1', message: 'Initial commit', parents: [] }],
          remoteTracking: { 'origin/main': 'C1' },
          serverBranches: { main: 'C2' },
          serverOnly: [{ id: 'C2', message: 'Teammate docs', parents: ['C1'] }],
          currentBranch: 'main',
          seq: 3,
        }),
        validation: [
          { rule: 'trackingEqualsServer', branch: 'main' },
          { rule: 'tipIs', branch: 'main', commit: 'C1' },
          { rule: 'treeIsClean' },
        ],
      },
    ],
    hints: [
      {
        en: 'Fetching is pure download. Which action only downloads?',
        bn: 'Fetch খাঁটি ডাউনলোড। কোন অ্যাকশন শুধু ডাউনলোড করে?',
      },
    ],
    relatedCommands: ['git.fetch', 'git.status'],
    relatedLessons: ['git.fundamentals.remote-repository'],
    relatedScenarios: ['git.troubleshooting.behind-remote'],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.command-fetch-vs-pull',
    category: 'remote',
    difficulty: 'intermediate',
    order: 22,
    estimatedMinutes: 6,
    xpReward: 20,
    tags: ['fetch', 'pull', 'merge', 'command'],
    keywords: ['fetch versus pull', 'does fetch merge', 'integrate remote'],
    title: { en: 'Understand Fetch vs Pull', bn: 'Fetch বনাম Pull বুঝুন' },
    description: {
      en: 'One downloads, the other downloads and integrates. Never confuse them again.',
      bn: 'একটি ডাউনলোড করে, অন্যটি ডাউনলোড ও একীভূত করে। আর কখনো গুলিয়ে ফেলবেন না।',
    },
    objective: {
      en: 'State exactly what each command changes — and what it never touches.',
      bn: 'প্রতিটি কমান্ড ঠিক কী বদলায় — আর কী কখনো ছোঁয় না — বলুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'Which statement about git fetch is TRUE?',
          bn: 'git fetch সম্পর্কে কোন বক্তব্য সত্য?',
        },
        explanation: {
          en: 'Fetch only downloads objects and updates remote-tracking refs. Merging is a separate, deliberate step.',
          bn: 'Fetch শুধু অবজেক্ট ডাউনলোড করে ও রিমোট-ট্র্যাকিং ref আপডেট করে। মার্জ আলাদা, সচেতন ধাপ।',
        },
        options: [
          { id: 'dl', label: 'It downloads and updates tracking refs, never merging', labelBn: 'ডাউনলোড করে ও ট্র্যাকিং ref আপডেট করে, কখনো মার্জ নয়', correct: true },
          { id: 'merge', label: 'It merges remote changes into your branch', labelBn: 'রিমোট পরিবর্তন ব্রাঞ্চে মার্জ করে', correct: false },
          { id: 'push', label: 'It uploads your commits first', labelBn: 'আগে কমিট আপলোড করে', correct: false },
          { id: 'clean', label: 'It discards uncommitted changes', labelBn: 'আনকমিটেড পরিবর্তন মুছে দেয়', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'After git fetch, origin/main moved to C2 but your main is still on C1. Did your branch move?',
          bn: 'git fetch-এর পর origin/main C2-তে গেল কিন্তু main C1-তে। ব্রাঞ্চ কি নড়েছে?',
        },
        explanation: {
          en: 'No. Your branch only moves when you integrate — merge, rebase, or pull. Fetch alone changes nothing of yours.',
          bn: 'না। একীভূত করলেই ব্রাঞ্চ নড়ে — মার্জ, রিবেস বা পুলে। শুধু fetch-এ আপনার কিছু বদলায় না।',
        },
        stateSnapshot: {
          files: cleanFiles(),
          commits: [
            { id: 'C1', message: 'Initial commit', parents: [] },
            { id: 'C2', message: 'Teammate docs', parents: ['C1'] },
          ],
          localBranches: { main: 'C1' },
          remoteTracking: { 'origin/main': 'C2' },
          serverBranches: { main: 'C2' },
          serverOnly: [],
          currentBranch: 'main',
          seq: 3,
        },
        options: [
          { id: 'no', label: 'No — only origin/main moved; main is still C1', labelBn: 'না — শুধু origin/main নড়েছে; main C1-তে', correct: true },
          { id: 'yes', label: 'Yes — fetch fast-forwards your branch', labelBn: 'হ্যাঁ — fetch ব্রাঞ্চ ফাস্ট-ফরোয়ার্ড করে', correct: false },
          { id: 'both', label: 'Both moved together automatically', labelBn: 'উভয়ে স্বয়ংক্রিয় একসাথে নড়েছে', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'Download versus download-plus-integrate. Which word is missing from fetch?',
        bn: 'ডাউনলোড বনাম ডাউনলোড-যোগ-একীভূত। fetch-এ কোন শব্দ নেই?',
      },
    ],
    relatedCommands: ['git.fetch', 'git.pull'],
    relatedLessons: ['git.fundamentals.remote-repository'],
    relatedScenarios: ['git.troubleshooting.behind-remote'],
    relatedWorkflows: [],
  },
  /* ---------------- GitHub (23–25) ---------------- */
  {
    id: 'git.practice.command-fork-clone-pr-flow',
    category: 'github',
    difficulty: 'beginner',
    order: 23,
    estimatedMinutes: 8,
    xpReward: 10,
    tags: ['fork', 'clone', 'pr', 'workflow', 'command'],
    keywords: ['contribute open source', 'fork then clone', 'pr steps order'],
    title: { en: 'Fork → Clone → Branch → PR', bn: 'ফোর্ক → ক্লোন → ব্রাঞ্চ → PR' },
    description: {
      en: 'Order the outside-contributor workflow and nail the origin/upstream distinction.',
      bn: 'বাইরের-অবদানকারী ওয়ার্কফ্লো ক্রমে সাজান ও origin/upstream পার্থক্য আয়ত্ত করুন।',
    },
    objective: {
      en: 'Sequence fork, clone, branch, push, and PR — knowing where each points.',
      bn: 'ফোর্ক, ক্লোন, ব্রাঞ্চ, পুশ ও PR ক্রমে সাজান — প্রতিটি কোথায় যায় জেনে।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'order',
        prompt: {
          en: 'Put the open-source contribution flow in order.',
          bn: 'ওপেন-সোর্স অবদান প্রবাহ ক্রমে সাজান।',
        },
        explanation: {
          en: 'Fork on GitHub first (so you can push), clone your fork, branch, push, then open the PR.',
          bn: 'আগে গিটহাবে ফোর্ক (যাতে পুশ পারেন), ফোর্ক ক্লোন, ব্রাঞ্চ, পুশ, তারপর PR খুলুন।',
        },
        items: [
          { id: 'fork', label: 'Fork the repo on GitHub', labelBn: 'গিটহাবে রেপো ফোর্ক করুন' },
          { id: 'clone', label: 'Clone your fork locally', labelBn: 'ফোর্ক লোকালি ক্লোন করুন' },
          { id: 'branch', label: 'Create a feature branch', labelBn: 'ফিচার ব্রাঞ্চ তৈরি করুন' },
          { id: 'pushpr', label: 'Push and open a pull request', labelBn: 'পুশ করে পুল রিকোয়েস্ট খুলুন' },
        ],
        correctOrder: ['fork', 'clone', 'branch', 'pushpr'],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'In your fork workflow, what does upstream point to?',
          bn: 'ফোর্ক ওয়ার্কফ্লোতে upstream কী নির্দেশ করে?',
        },
        explanation: {
          en: 'upstream conventionally points at the original project you forked from; origin points at your fork.',
          bn: 'upstream প্রচলিতভাবে মূল প্রজেক্ট নির্দেশ করে যেখান থেকে ফোর্ক করেছেন; origin আপনার ফোর্ক নির্দেশ করে।',
        },
        options: [
          { id: 'orig', label: 'The original project repository', labelBn: 'মূল প্রজেক্ট রিপোজিটরি', correct: true },
          { id: 'fork', label: 'Your personal fork', labelBn: 'আপনার ব্যক্তিগত ফোর্ক', correct: false },
          { id: 'local', label: 'Your local main branch', labelBn: 'আপনার লোকাল main ব্রাঞ্চ', correct: false },
          { id: 'ci', label: 'The CI server', labelBn: 'CI সার্ভার', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'You cannot push to a repo you do not own — so what must come before cloning?',
        bn: 'মালিকানা নেই এমন রেপোতে পুশ পারবেন না — তাই ক্লোনের আগে কী আসতে হবে?',
      },
    ],
    relatedCommands: ['git.clone', 'git.remote', 'git.push'],
    relatedLessons: ['github.collaboration.fork-vs-clone', 'github.collaboration.configuring-upstream'],
    relatedScenarios: [],
    relatedWorkflows: ['github.workflow.feature-branch', 'github.workflow.pull-request'],
  },
  {
    id: 'git.practice.command-origin-vs-upstream',
    category: 'github',
    difficulty: 'beginner',
    order: 24,
    estimatedMinutes: 5,
    xpReward: 10,
    tags: ['origin', 'upstream', 'remote', 'command'],
    keywords: ['add upstream', 'fork remote', 'track original'],
    title: { en: 'Understand origin vs upstream', bn: 'origin বনাম upstream বুঝুন' },
    description: {
      en: 'Wire a fork to its original project and keep the two remotes straight.',
      bn: 'ফোর্ক মূল প্রজেক্টে যুক্ত করুন ও দুটি রিমোট আলাদা রাখুন।',
    },
    objective: {
      en: 'Add an upstream remote pointing at the original repository.',
      bn: 'মূল রিপোজিটরি নির্দেশ করে upstream রিমোট যোগ করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'After cloning your fork, which remote should track the ORIGINAL project?',
          bn: 'ফোর্ক ক্লোনের পর কোন রিমোট মূল প্রজেক্ট ট্র্যাক করবে?',
        },
        explanation: {
          en: 'origin already points at your fork. Add upstream for the original so you can fetch its updates.',
          bn: 'origin ইতিমধ্যে ফোর্ক নির্দেশ করে। মূলের আপডেট আনতে upstream যোগ করুন।',
        },
        options: [
          { id: 'upstream', label: 'upstream → original project', labelBn: 'upstream → মূল প্রজেক্ট', correct: true },
          { id: 'origin2', label: 'A second origin → original project', labelBn: 'দ্বিতীয় origin → মূল প্রজেক্ট', correct: false },
          { id: 'main', label: 'No remote — just use main', labelBn: 'রিমোট নয় — শুধু main', correct: false },
          { id: 'push', label: 'Push tracking is automatic', labelBn: 'পুশ ট্র্যাকিং স্বয়ংক্রিয়', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'complete',
        prefix: 'git remote',
        placeholder: '___ upstream https://github.com/original/app.git',
        prompt: {
          en: 'Complete the command that registers the original project as a remote.',
          bn: 'মূল প্রজেক্ট রিমোট হিসেবে নিবন্ধন করা কমান্ডটি সম্পূর্ণ করুন।',
        },
        explanation: {
          en: 'git remote add <name> <url> registers a new nickname. Upstream is the conventional name for the original.',
          bn: 'git remote add <name> <url> নতুন ডাকনাম নিবন্ধন করে। মূলের প্রচলিত নাম upstream।',
        },
        acceptedAnswers: ['add'],
      },
    ],
    hints: [
      {
        en: 'Remotes are nicknames. Which verb creates a new one?',
        bn: 'রিমোট ডাকনাম। কোন ক্রিয়া নতুন তৈরি করে?',
      },
    ],
    relatedCommands: ['git.remote', 'git.fetch'],
    relatedLessons: ['github.collaboration.configuring-upstream', 'github.basics.origin-and-upstream'],
    relatedScenarios: [],
    relatedWorkflows: ['github.workflow.clone-repository'],
  },
  {
    id: 'git.practice.command-respond-to-review',
    category: 'github',
    difficulty: 'intermediate',
    order: 25,
    estimatedMinutes: 8,
    xpReward: 20,
    tags: ['review', 'pr', 'collaboration', 'command'],
    keywords: ['changes requested', 'address feedback', 're-review'],
    title: { en: 'Respond to PR Changes', bn: 'PR পরিবর্তনে সাড়া দিন' },
    description: {
      en: 'A reviewer requested changes. Address them properly and get the PR mergeable again.',
      bn: 'রিভিউয়ার পরিবর্তন চেয়েছে। সঠিকভাবে সামলান ও PR আবার মার্জযোগ্য করুন।',
    },
    objective: {
      en: 'Push fixes and re-request review — never rewrite shared history to do it.',
      bn: 'ফিক্স পুশ করে পুনরায় রিভিউ চান — এতে শেয়ার্ড হিস্ট্রি পুনর্লিখন কখনো নয়।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'Review says "changes requested" on your PR branch. What is the correct next move?',
          bn: 'PR ব্রাঞ্চে রিভিউ "পরিবর্তন চাওয়া হয়েছে" বলেছে। সঠিক পরবর্তী পদক্ষেপ কী?',
        },
        explanation: {
          en: 'Fix on the same branch, commit, and push — the PR updates itself. Then re-request review so it gets a second look.',
          bn: 'একই ব্রাঞ্চে ঠিক করুন, কমিট ও পুশ করুন — PR নিজে আপডেট হয়। তারপর পুনরায় রিভিউ চান যাতে দ্বিতীয় দৃষ্টি পায়।',
        },
        options: [
          { id: 'fix', label: 'Push fix commits, then re-request review', labelBn: 'ফিক্স কমিট পুশ করে পুনরায় রিভিউ চান', correct: true },
          { id: 'close', label: 'Close the PR and open an identical one', labelBn: 'PR বন্ধ করে একই আরেকটি খুলুন', correct: false },
          { id: 'force', label: 'Rebase and force-push to hide the history', labelBn: 'রিবেস ও ফোর্স-পুশে হিস্ট্রি লুকান', correct: false },
          { id: 'merge', label: 'Merge it anyway — reviews are optional', labelBn: 'তবু মার্জ করুন — রিভিউ ঐচ্ছিক', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'Why is force-pushing the shared PR branch to "clean up" a bad idea?',
          bn: 'শেয়ার্ড PR ব্রাঞ্চে "পরিষ্কারে" ফোর্স-পুশ কেন খারাপ ধারণা?',
        },
        explanation: {
          en: 'Reviewers may have already pulled it. Rewriting shared history strands their work and invalidates review context.',
          bn: 'রিভিউয়াররা ইতিমধ্যে পুল করে থাকতে পারে। শেয়ার্ড হিস্ট্রি পুনর্লিখনে তাদের কাজ আটকে যায় ও রিভিউ প্রেক্ষাপট বাতিল হয়।',
        },
        options: [
          { id: 'strand', label: 'It rewrites history others may already have', labelBn: 'অন্যের থাকা হিস্ট্রি পুনর্লেখে', correct: true },
          { id: 'slow', label: 'It makes the push slower', labelBn: 'পুশ ধীর করে', correct: false },
          { id: 'checks', label: 'It disables CI checks forever', labelBn: 'CI চেক চিরতরে নিষ্ক্রিয় করে', correct: false },
          { id: 'merge', label: 'It auto-merges without approval', labelBn: 'অনুমোদন ছাড়া স্বয়ং-মার্জ করে', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'Review is a conversation on the same branch. What keeps the conversation intact?',
        bn: 'রিভিউ একই ব্রাঞ্চে আলাপ। কী আলাপ অক্ষত রাখে?',
      },
    ],
    relatedCommands: ['git.push', 'git.commit'],
    relatedLessons: ['github.pr.requesting-changes', 'github.team.handling-review-changes'],
    relatedScenarios: ['git.troubleshooting.pull-conflict'],
    relatedWorkflows: ['github.workflow.pull-request', 'github.workflow.code-review'],
  },
];
