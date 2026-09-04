/**
 * Practice exercises — fundamentals, everyday workflow, branching.
 * Data only. Every exercise has a stable id (`git.practice.<slug>`).
 * Git syntax, filenames, branch names and hashes stay in English.
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

export const CORE_EXERCISES: PracticeExercise[] = [
  /* ---------------- Fundamentals (1–5) ---------------- */
  {
    id: 'git.practice.initialize-repository',
    category: 'fundamentals',
    difficulty: 'beginner',
    order: 1,
    estimatedMinutes: 5,
    xpReward: 10,
    tags: ['init', 'clone', 'setup', 'command'],
    keywords: ['start new repo', 'create repository', 'first command'],
    title: { en: 'Initialize a Repository', bn: 'রিপোজিটরি শুরু করুন' },
    description: {
      en: 'Know which command creates a local repository — and which one copies an existing remote.',
      bn: 'জানুন কোন কমান্ড লোকাল রিপোজিটরি তৈরি করে — আর কোনটি বিদ্যমান রিমোট কপি করে।',
    },
    objective: {
      en: 'Choose git init for new projects and git clone for existing ones.',
      bn: 'নতুন প্রজেক্টে git init এবং বিদ্যমান প্রজেক্টে git clone বেছে নিন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'You just created an empty folder for a brand-new project. Which command turns it into a Git repository?',
          bn: 'একেবারে নতুন প্রজেক্টের জন্য খালি ফোল্ডার বানালেন। কোন কমান্ড এটিকে গিট রিপোজিটরি বানাবে?',
        },
        explanation: {
          en: 'git init creates a new repository in place. git clone copies an existing remote — there is nothing to copy yet.',
          bn: 'git init যথাস্থানে নতুন রিপোজিটরি তৈরি করে। git clone বিদ্যমান রিমোট কপি করে — এখনো কপি করার মতো কিছু নেই।',
        },
        options: [
          { id: 'init', label: 'git init', correct: true },
          { id: 'clone', label: 'git clone <url>', correct: false },
          { id: 'status', label: 'git status', correct: false },
          { id: 'branch', label: 'git branch', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'complete',
        prefix: 'git',
        placeholder: '___ https://github.com/team/app.git',
        prompt: {
          en: 'Complete the command that copies an existing GitHub repository to your machine.',
          bn: 'বিদ্যমান গিটহাব রিপোজিটরি মেশিনে কপি করার কমান্ডটি সম্পূর্ণ করুন।',
        },
        explanation: {
          en: 'git clone downloads the full history and sets up the origin remote for you.',
          bn: 'git clone সম্পূর্ণ হিস্ট্রি ডাউনলোড করে এবং origin রিমোট সেট করে দেয়।',
        },
        acceptedAnswers: ['clone'],
      },
    ],
    hints: [
      {
        en: 'One command creates, the other copies. Which situation are you in?',
        bn: 'একটি কমান্ড তৈরি করে, অন্যটি কপি করে। আপনি কোন পরিস্থিতিতে আছেন?',
      },
      {
        en: 'A new empty folder has no remote to copy from — so cloning makes no sense yet.',
        bn: 'নতুন খালি ফোল্ডারে কপি করার মতো রিমোট নেই — তাই ক্লোন এখন অর্থহীন।',
      },
    ],
    relatedCommands: ['git.init', 'git.clone'],
    relatedLessons: ['git.fundamentals.what-is-git', 'git.fundamentals.repository'],
    relatedScenarios: [],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.command-inspect-status',
    category: 'fundamentals',
    difficulty: 'beginner',
    order: 2,
    estimatedMinutes: 5,
    xpReward: 10,
    tags: ['status', 'inspect', 'command'],
    keywords: ['changed files', 'see changes', 'working tree state'],
    title: { en: 'Inspect Repository Status', bn: 'রিপোজিটরি অবস্থা দেখুন' },
    description: {
      en: 'Learn to read the current state of your working tree before doing anything else.',
      bn: 'অন্য কিছু করার আগে ওয়ার্কিং ট্রির বর্তমান অবস্থা পড়তে শিখুন।',
    },
    objective: {
      en: 'Use git status to see changed, staged, and untracked files.',
      bn: 'পরিবর্তিত, স্টেজড ও আনট্র্যাকড ফাইল দেখতে git status ব্যবহার করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'You want to see which files have changed. Which command should you use?',
          bn: 'কোন ফাইলগুলো বদলেছে দেখতে চান। কোন কমান্ড ব্যবহার করবেন?',
        },
        explanation: {
          en: 'git status reports the working tree: modified, staged, and untracked files. The others change history instead of showing it.',
          bn: 'git status ওয়ার্কিং ট্রি জানায়: পরিবর্তিত, স্টেজড ও আনট্র্যাকড ফাইল। অন্যগুলো দেখানোর বদলে হিস্ট্রি বদলায়।',
        },
        options: [
          { id: 'status', label: 'git status', correct: true },
          { id: 'commit', label: 'git commit', correct: false },
          { id: 'push', label: 'git push', correct: false },
          { id: 'branch', label: 'git branch', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'complete',
        prefix: 'git status',
        placeholder: '___',
        prompt: {
          en: 'Complete the flag for the compact two-letter status view.',
          bn: 'সংক্ষিপ্ত দুই-অক্ষরের স্ট্যাটাস ভিউয়ের ফ্ল্যাগটি সম্পূর্ণ করুন।',
        },
        explanation: {
          en: 'git status -s shows a compact view: M for modified, ?? for untracked, one or two letters per file.',
          bn: 'git status -s সংক্ষিপ্ত ভিউ দেখায়: পরিবর্তিতে M, আনট্র্যাকডে ??, প্রতি ফাইলে এক বা দুই অক্ষর।',
        },
        acceptedAnswers: ['-s', '--short'],
      },
    ],
    hints: [
      {
        en: 'Status is always safe — it only looks, never changes anything.',
        bn: 'Status সবসময় নিরাপদ — এটি শুধু দেখে, কিছু বদলায় না।',
      },
    ],
    relatedCommands: ['git.status'],
    relatedLessons: ['git.fundamentals.working-directory'],
    relatedScenarios: ['git.troubleshooting.nothing-to-commit'],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.command-stage-first-change',
    category: 'fundamentals',
    difficulty: 'beginner',
    order: 3,
    estimatedMinutes: 8,
    xpReward: 10,
    tags: ['add', 'stage', 'index', 'simulation', 'command'],
    keywords: ['stage file', 'git add', 'staging area'],
    title: { en: 'Stage Your First Change', bn: 'প্রথম পরিবর্তন স্টেজ করুন' },
    description: {
      en: 'Move a modified file from the Working Directory into the Staging Area in the simulator.',
      bn: 'সিমুলেটরে পরিবর্তিত ফাইল ওয়ার্কিং ডিরেক্টরি থেকে স্টেজিং এরিয়ায় নিন।',
    },
    objective: {
      en: 'Stage README.md so it is ready for the next commit.',
      bn: 'README.md স্টেজ করুন যাতে পরবর্তী কমিটের জন্য প্রস্তুত হয়।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'simulate',
        prompt: {
          en: 'README.md is modified. Stage it — run any actions you need, then Check.',
          bn: 'README.md পরিবর্তিত হয়েছে। এটি স্টেজ করুন — প্রয়োজনীয় অ্যাকশন চালিয়ে Check চাপুন।',
        },
        explanation: {
          en: 'Staging snapshots the file into the index without committing. The working tree is untouched.',
          bn: 'স্টেজিং ফাইলটি কমিট না করে ইনডেক্সে স্ন্যাপশট করে। ওয়ার্কিং ট্রি অক্ষত থাকে।',
        },
        setup: baseState({
          files: [
            { name: 'README.md', workStatus: 'modified', staged: false },
            { name: 'app.js', workStatus: 'clean', staged: false },
            { name: 'package.json', workStatus: 'clean', staged: false },
          ],
        }),
        validation: [{ rule: 'fileIs', file: 'README.md', staged: true }],
      },
    ],
    hints: [
      {
        en: 'Think about the Git area you need to update.',
        bn: 'কোন গিট এলাকা আপডেট করতে হবে ভাবুন।',
      },
      {
        en: 'You need to move the change from the Working Tree into the Staging Area.',
        bn: 'পরিবর্তন ওয়ার্কিং ট্রি থেকে স্টেজিং এরিয়ায় নিতে হবে।',
      },
      {
        en: 'Which command updates the index? Try staging README.md.',
        bn: 'কোন কমান্ড ইনডেক্স আপডেট করে? README.md স্টেজ করে দেখুন।',
      },
    ],
    relatedCommands: ['git.add', 'git.status'],
    relatedLessons: ['git.fundamentals.staging-area'],
    relatedScenarios: ['git.troubleshooting.staged-file'],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.basic-commit',
    category: 'fundamentals',
    difficulty: 'beginner',
    order: 4,
    estimatedMinutes: 8,
    xpReward: 10,
    tags: ['commit', 'snapshot', 'simulation', 'command'],
    keywords: ['create commit', 'save changes', 'commit message'],
    title: { en: 'Create Your First Commit', bn: 'প্রথম কমিট তৈরি করুন' },
    description: {
      en: 'Turn staged changes into a permanent snapshot on your current branch.',
      bn: 'স্টেজড পরিবর্তন বর্তমান ব্রাঞ্চে স্থায়ী স্ন্যাপশটে পরিণত করুন।',
    },
    objective: {
      en: 'Commit the staged change so history grows by one commit and the tree is clean.',
      bn: 'স্টেজড পরিবর্তন কমিট করুন যাতে হিস্ট্রি এক কমিট বাড়ে ও ট্রি পরিষ্কার হয়।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'simulate',
        prompt: {
          en: 'app.js is staged. Commit it — then Check.',
          bn: 'app.js স্টেজড আছে। এটি কমিট করুন — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'A commit freezes the staged snapshot with a parent link. Staging empties and the tree is clean.',
          bn: 'কমিট স্টেজড স্ন্যাপশট প্যারেন্ট লিঙ্কসহ হিমায়িত করে। স্টেজিং খালি হয় ও ট্রি পরিষ্কার হয়।',
        },
        setup: baseState({
          files: [
            { name: 'README.md', workStatus: 'clean', staged: false },
            { name: 'app.js', workStatus: 'modified', staged: true },
            { name: 'package.json', workStatus: 'clean', staged: false },
          ],
        }),
        validation: [{ rule: 'commitCountMin', count: 2 }, { rule: 'treeIsClean' }],
      },
    ],
    hints: [
      {
        en: 'A commit records whatever is staged right now.',
        bn: 'কমিট এখন যা স্টেজড আছে তা রেকর্ড করে।',
      },
      {
        en: 'Use the commit action with a short message describing the change.',
        bn: 'পরিবর্তন বর্ণনা করে সংক্ষিপ্ত বার্তাসহ কমিট অ্যাকশন ব্যবহার করুন।',
      },
    ],
    relatedCommands: ['git.commit', 'git.add'],
    relatedLessons: ['git.fundamentals.commit'],
    relatedScenarios: [],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.command-inspect-history',
    category: 'fundamentals',
    difficulty: 'beginner',
    order: 5,
    estimatedMinutes: 5,
    xpReward: 10,
    tags: ['log', 'history', 'command'],
    keywords: ['see commits', 'commit history', 'past changes'],
    title: { en: 'Inspect Commit History', bn: 'কমিট হিস্ট্রি দেখুন' },
    description: {
      en: 'Read the project timeline with git log and its compact views.',
      bn: 'git log ও এর সংক্ষিপ্ত ভিউ দিয়ে প্রজেক্ট টাইমলাইন পড়ুন।',
    },
    objective: {
      en: 'Choose git log and its one-line flag for browsing history.',
      bn: 'হিস্ট্রি দেখতে git log ও এর এক-লাইন ফ্ল্যাগ বেছে নিন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'Which command shows the list of past commits on the current branch?',
          bn: 'বর্তমান ব্রাঞ্চে অতীত কমিটের তালিকা কোন কমান্ড দেখায়?',
        },
        explanation: {
          en: 'git log walks backwards from HEAD through parent links. git show inspects one object; git status shows the working tree.',
          bn: 'git log HEAD থেকে প্যারেন্ট লিঙ্ক ধরে পেছনে হাঁটে। git show একটি অবজেক্ট দেখে; git status ওয়ার্কিং ট্রি দেখায়।',
        },
        options: [
          { id: 'log', label: 'git log', correct: true },
          { id: 'show', label: 'git show', correct: false },
          { id: 'status', label: 'git status', correct: false },
          { id: 'fetch', label: 'git fetch', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'complete',
        prefix: 'git log',
        placeholder: '___',
        prompt: {
          en: 'Complete the flag that shows each commit on a single compact line.',
          bn: 'প্রতিটি কমিট এক সংক্ষিপ্ত লাইনে দেখানো ফ্ল্যাগটি সম্পূর্ণ করুন।',
        },
        explanation: {
          en: '--oneline compresses each commit to one line: short hash plus subject. Combine with --graph for branch visuals.',
          bn: '--oneline প্রতিটি কমিট এক লাইনে সংকুচিত করে: সংক্ষিপ্ত হ্যাশ ও বিষয়। ব্রাঞ্চ ভিজ্যুয়ালের জন্য --graph যোগ করুন।',
        },
        acceptedAnswers: ['--oneline'],
      },
    ],
    hints: [
      {
        en: 'History lives in commits, and one command is built to walk them.',
        bn: 'হিস্ট্রি কমিটে থাকে, এবং একটি কমান্ড সেগুলো হাঁটতে তৈরি।',
      },
    ],
    relatedCommands: ['git.log'],
    relatedLessons: ['git.fundamentals.commit'],
    relatedScenarios: [],
    relatedWorkflows: [],
  },
  /* ---------------- Everyday Workflow (6–9) ---------------- */
  {
    id: 'git.practice.command-everyday-flow',
    category: 'everyday',
    difficulty: 'beginner',
    order: 6,
    estimatedMinutes: 12,
    xpReward: 10,
    tags: ['workflow', 'daily', 'order', 'simulation', 'command'],
    keywords: ['daily workflow', 'normal git flow', 'steps order'],
    title: { en: 'Complete the Everyday Git Workflow', bn: 'দৈনন্দিন গিট ওয়ার্কফ্লো সম্পন্ন করুন' },
    description: {
      en: 'Order the daily loop correctly, then run it end-to-end in the simulator.',
      bn: 'দৈনন্দিন চক্র সঠিক ক্রমে সাজান, তারপর সিমুলেটরে শেষ পর্যন্ত চালান।',
    },
    objective: {
      en: 'Go from a modified file to a pushed commit: inspect, review, stage, commit, publish.',
      bn: 'পরিবর্তিত ফাইল থেকে পুশড কমিটে যান: পরিদর্শন, পর্যালোচনা, স্টেজ, কমিট, প্রকাশ।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'order',
        prompt: {
          en: 'Put these actions in the correct order for a normal Git workflow.',
          bn: 'সাধারণ গিট ওয়ার্কফ্লোর জন্য এই কাজগুলো সঠিক ক্রমে সাজান।',
        },
        explanation: {
          en: 'Inspect first, review the diff, stage deliberately, commit atomically, then push to share.',
          bn: 'আগে পরিদর্শন, diff পর্যালোচনা, সচেতন স্টেজ, পারমাণবিক কমিট, তারপর শেয়ারে পুশ।',
        },
        items: [
          { id: 'inspect', label: 'Inspect changes', labelBn: 'পরিবর্তন পরিদর্শন' },
          { id: 'stage', label: 'Stage changes', labelBn: 'পরিবর্তন স্টেজ' },
          { id: 'commit', label: 'Commit changes', labelBn: 'পরিবর্তন কমিট' },
          { id: 'push', label: 'Push changes', labelBn: 'পরিবর্তন পুশ' },
        ],
        correctOrder: ['inspect', 'stage', 'commit', 'push'],
      },
      {
        id: 't2',
        kind: 'simulate',
        prompt: {
          en: 'README.md is modified. Take it all the way to the remote — then Check.',
          bn: 'README.md পরিবর্তিত হয়েছে। একেবারে রিমোট পর্যন্ত নিন — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'Stage, commit, and push in sequence. The remote tip should match your local tip when you finish.',
          bn: 'ক্রমানুসারে স্টেজ, কমিট ও পুশ করুন। শেষে রিমোট টিপ লোকাল টিপের সাথে মিলতে হবে।',
        },
        setup: baseState({
          files: [
            { name: 'README.md', workStatus: 'modified', staged: false },
            { name: 'app.js', workStatus: 'clean', staged: false },
            { name: 'package.json', workStatus: 'clean', staged: false },
          ],
        }),
        validation: [
          { rule: 'treeIsClean' },
          { rule: 'commitCountMin', count: 2 },
          { rule: 'remoteInSync', branch: 'main' },
        ],
      },
    ],
    hints: [
      {
        en: 'Read before you stage, stage before you commit, commit before you share.',
        bn: 'স্টেজের আগে পড়ুন, কমিটের আগে স্টেজ করুন, শেয়ারের আগে কমিট করুন।',
      },
      {
        en: 'The simulator accepts the same actions in the same order: stage, commit, push.',
        bn: 'সিমুলেটর একই ক্রমে একই অ্যাকশন নেয়: স্টেজ, কমিট, পুশ।',
      },
    ],
    prerequisites: ['git.practice.command-stage-first-change', 'git.practice.basic-commit'],
    relatedCommands: ['git.status', 'git.diff', 'git.add', 'git.commit', 'git.push'],
    relatedLessons: ['git.fundamentals.working-directory', 'git.fundamentals.staging-area', 'git.fundamentals.commit'],
    relatedScenarios: [],
    relatedWorkflows: ['git.workflow.everyday'],
  },
  {
    id: 'git.practice.command-inspect-before-commit',
    category: 'everyday',
    difficulty: 'beginner',
    order: 7,
    estimatedMinutes: 6,
    xpReward: 10,
    tags: ['diff', 'review', 'command'],
    keywords: ['review changes', 'unstaged diff', 'line changes'],
    title: { en: 'Inspect Changes Before Committing', bn: 'কমিটের আগে পরিবর্তন পরিদর্শন করুন' },
    description: {
      en: 'Use git diff to review exactly what you are about to stage — and --staged for what you already did.',
      bn: 'স্টেজ করতে যাওয়া ঠিক কী তা পর্যালোচনায় git diff ব্যবহার করুন — আর যা করেছেন তার জন্য --staged।',
    },
    objective: {
      en: 'Distinguish unstaged diffs from staged diffs.',
      bn: 'আনস্টেজড diff ও স্টেজড diff আলাদা করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'Which command shows your unstaged working-tree changes line by line?',
          bn: 'আনস্টেজড ওয়ার্কিং-ট্রি পরিবর্তন লাইন ধরে কোন কমান্ড দেখায়?',
        },
        explanation: {
          en: 'git diff compares the working tree against the staging area. Staged changes are hidden here on purpose.',
          bn: 'git diff ওয়ার্কিং ট্রির সাথে স্টেজিং এরিয়ার তুলনা করে। স্টেজড পরিবর্তন এখানে ইচ্ছাকৃত লুকানো থাকে।',
        },
        options: [
          { id: 'diff', label: 'git diff', correct: true },
          { id: 'status', label: 'git status', correct: false },
          { id: 'log', label: 'git log', correct: false },
          { id: 'show', label: 'git show HEAD', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'complete',
        prefix: 'git diff',
        placeholder: '___',
        prompt: {
          en: 'Complete the flag that shows already-staged changes instead.',
          bn: 'ইতিমধ্যে-স্টেজড পরিবর্তন দেখানো ফ্ল্যাগটি সম্পূর্ণ করুন।',
        },
        explanation: {
          en: '--staged (or --cached) flips the comparison: staging area versus the last commit.',
          bn: '--staged (বা --cached) তুলনা উল্টায়: স্টেজিং এরিয়া বনাম শেষ কমিট।',
        },
        acceptedAnswers: ['--staged', '--cached'],
      },
    ],
    hints: [
      {
        en: 'One flag looks at what you have not staged yet; the other looks at what you have.',
        bn: 'এক ফ্ল্যাগ এখনো স্টেজ করেননি তা দেখে; অন্যটি যা করেছেন তা দেখে।',
      },
    ],
    relatedCommands: ['git.diff', 'git.status'],
    relatedLessons: ['git.fundamentals.staging-area'],
    relatedScenarios: [],
    relatedWorkflows: ['git.workflow.everyday'],
  },
  {
    id: 'git.practice.command-commit-multiple-safely',
    category: 'everyday',
    difficulty: 'beginner',
    order: 8,
    estimatedMinutes: 8,
    xpReward: 10,
    tags: ['commit', 'atomic', 'simulation', 'command'],
    keywords: ['multiple files', 'atomic commit', 'stage all'],
    title: { en: 'Commit Multiple Changes Safely', bn: 'নিরাপদে একাধিক পরিবর্তন কমিট করুন' },
    description: {
      en: 'Two files changed at once. Review, stage, and commit them as one clean atomic unit.',
      bn: 'একসাথে দুটি ফাইল বদলেছে। পর্যালোচনা, স্টেজ ও এক পরিষ্কার পারমাণবিক এককে কমিট করুন।',
    },
    objective: {
      en: 'Finish with both files committed, a clean tree, and one new commit.',
      bn: 'উভয় ফাইল কমিটেড, পরিষ্কার ট্রি ও একটি নতুন কমিট নিয়ে শেষ করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'Two unrelated files changed. What makes the best single commit here?',
          bn: 'দুটি সম্পর্কহীন ফাইল বদলেছে। এখানে সেরা একক কমিট কী হবে?',
        },
        explanation: {
          en: 'An atomic commit does one logical thing. If the two edits truly belong together, one commit is right; otherwise split them.',
          bn: 'পারমাণবিক কমিট একটি যৌক্তিক কাজ করে। দুটি এডিট সত্যিই একসাথে থাকলে একটি কমিট ঠিক; নইলে ভাগ করুন।',
        },
        options: [
          { id: 'atomic', label: 'One commit covering one logical change', labelBn: 'এক যৌক্তিক পরিবর্তনের একটি কমিট', correct: true },
          { id: 'dump', label: 'One giant commit with everything plus debug logs', labelBn: 'ডিবাগ লগসহ সবকিছুর বিশাল কমিট', correct: false },
          { id: 'empty', label: 'An empty commit with just a message', labelBn: 'শুধু বার্তাসহ খালি কমিট', correct: false },
          { id: 'push', label: 'Skip committing and push the files directly', labelBn: 'কমিট বাদে সরাসরি ফাইল পুশ', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'simulate',
        prompt: {
          en: 'Both files belong to one fix. Stage and commit them together — then Check.',
          bn: 'উভয় ফাইল একটি ফিক্সের। একসাথে স্টেজ ও কমিট করুন — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'Staging everything and committing once records a single atomic snapshot for this fix.',
          bn: 'সব স্টেজ করে একবার কমিটে এই ফিক্সের এক পারমাণবিক স্ন্যাপশট রেকর্ড হয়।',
        },
        setup: baseState({
          files: [
            { name: 'README.md', workStatus: 'modified', staged: false },
            { name: 'app.js', workStatus: 'modified', staged: false },
            { name: 'package.json', workStatus: 'clean', staged: false },
          ],
        }),
        validation: [{ rule: 'commitCountMin', count: 2 }, { rule: 'treeIsClean' }],
      },
    ],
    hints: [
      {
        en: 'The simulator stages everything dirty when you run stage with no file filter.',
        bn: 'ফাইল ফিল্টার ছাড়া স্টেজ চালালে সিমুলেটর সব নোংরা স্টেজ করে।',
      },
    ],
    relatedCommands: ['git.add', 'git.commit', 'git.status'],
    relatedLessons: ['git.fundamentals.commit', 'git.fundamentals.staging-area'],
    relatedScenarios: [],
    relatedWorkflows: ['git.workflow.everyday'],
  },
  {
    id: 'git.practice.working-tree-vs-staging',
    category: 'everyday',
    difficulty: 'beginner',
    order: 9,
    estimatedMinutes: 6,
    xpReward: 10,
    tags: ['mental-model', 'staging', 'prediction'],
    keywords: ['where is file', 'staged vs unstaged', 'three areas'],
    title: { en: 'Understand Working Tree vs Staging Area', bn: 'ওয়ার্কিং ট্রি বনাম স্টেজিং এরিয়া বুঝুন' },
    description: {
      en: 'Look at a real repository snapshot and say exactly where each file lives.',
      bn: 'বাস্তব রিপোজিটরি স্ন্যাপশট দেখে প্রতিটি ফাইল ঠিক কোথায় আছে বলুন।',
    },
    objective: {
      en: 'Tell staged, unstaged, and clean files apart at a glance.',
      bn: 'এক নজরে স্টেজড, আনস্টেজড ও পরিষ্কার ফাইল আলাদা করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'In the snapshot, app.js is modified and staged. Where does its new content live right now?',
          bn: 'স্ন্যাপশটে app.js পরিবর্তিত ও স্টেজড। এর নতুন কন্টেন্ট এখন কোথায় আছে?',
        },
        explanation: {
          en: 'Staged content lives in the index as a snapshot, while the working tree keeps the same edits. Nothing is committed yet.',
          bn: 'স্টেজড কন্টেন্ট ইনডেক্সে স্ন্যাপশট হিসেবে থাকে, ওয়ার্কিং ট্রিতে একই এডিট থাকে। এখনো কিছু কমিট হয়নি।',
        },
        stateSnapshot: {
          files: [
            { name: 'README.md', workStatus: 'clean', staged: false },
            { name: 'app.js', workStatus: 'modified', staged: true },
            { name: 'package.json', workStatus: 'clean', staged: false },
          ],
          commits: [{ id: 'C1', message: 'Initial commit', parents: [] }],
          localBranches: { main: 'C1' },
          remoteTracking: { 'origin/main': 'C1' },
          serverBranches: { main: 'C1' },
          serverOnly: [],
          currentBranch: 'main',
          seq: 2,
        },
        options: [
          { id: 'index', label: 'In the staging index (and the working tree)', labelBn: 'স্টেজিং ইনডেক্সে (ও ওয়ার্কিং ট্রিতে)', correct: true },
          { id: 'commit', label: 'In a new commit already', labelBn: 'ইতিমধ্যে নতুন কমিটে', correct: false },
          { id: 'remote', label: 'On the remote server', labelBn: 'রিমোট সার্ভারে', correct: false },
          { id: 'gone', label: 'Nowhere — staging deleted it', labelBn: 'কোথাও না — স্টেজিং মুছে দিয়েছে', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'Unstaged edits that were never added or committed live…',
          bn: 'কখনো add বা commit না হওয়া আনস্টেজড এডিট থাকে…',
        },
        explanation: {
          en: 'Only on your disk. Git has no copy until you stage — which is why uncommitted work can be truly lost.',
          bn: 'শুধু আপনার ডিস্কে। স্টেজ না করা পর্যন্ত গিটের কাছে কপি নেই — তাই আনকমিটেড কাজ সত্যিই হারাতে পারে।',
        },
        options: [
          { id: 'disk', label: 'Only on your disk, outside any snapshot', labelBn: 'শুধু ডিস্কে, কোনো স্ন্যাপশটের বাইরে', correct: true },
          { id: 'index', label: 'Secretly in the staging area', labelBn: 'গোপনে স্টেজিং এরিয়ায়', correct: false },
          { id: 'reflog', label: 'In the reflog automatically', labelBn: 'স্বয়ংক্রিয়ভাবে রিফ্লগে', correct: false },
          { id: 'remote', label: 'Backed up on the remote', labelBn: 'রিমোটে ব্যাকআপ আছে', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'Staging copies content into the index. Committing freezes it into history. What has happened so far?',
        bn: 'স্টেজিং কন্টেন্ট ইনডেক্সে কপি করে। কমিট ইতিহাসে হিমায়িত করে। এখন পর্যন্ত কী ঘটেছে?',
      },
    ],
    relatedCommands: ['git.status', 'git.diff'],
    relatedLessons: ['git.fundamentals.working-directory', 'git.fundamentals.staging-area', 'git.fundamentals.three-areas'],
    relatedScenarios: ['git.troubleshooting.deleted-changes'],
    relatedWorkflows: [],
  },
  /* ---------------- Branching (10–13) ---------------- */
  {
    id: 'git.practice.create-feature-branch',
    category: 'branching',
    difficulty: 'beginner',
    order: 10,
    estimatedMinutes: 8,
    xpReward: 10,
    tags: ['branch', 'switch', 'simulation', 'command'],
    keywords: ['new branch', 'feature branch', 'create branch'],
    title: { en: 'Create a Feature Branch', bn: 'ফিচার ব্রাঞ্চ তৈরি করুন' },
    description: {
      en: 'Branch off main and move onto the new branch so new work stays isolated.',
      bn: 'main থেকে ব্রাঞ্চ করে নতুন ব্রাঞ্চে যান যাতে নতুন কাজ আলাদা থাকে।',
    },
    objective: {
      en: 'End on a new feature/login branch pointing at the same commit as main.',
      bn: 'main-এর একই কমিটে থাকা নতুন feature/login ব্রাঞ্চে শেষ করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'simulate',
        prompt: {
          en: 'Create feature/login and switch to it — then Check.',
          bn: 'feature/login তৈরি করে সেখানে যান — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'Creating the branch writes a new pointer; switching moves HEAD to it. Both branches share commit C1 until they diverge.',
          bn: 'ব্রাঞ্চ তৈরি নতুন পয়েন্টার লেখে; সুইচ HEAD সেখানে নেয়। ডাইভার্জ না হওয়া পর্যন্ত উভয় ব্রাঞ্চ C1 ভাগ করে।',
        },
        setup: baseState(),
        validation: [{ rule: 'branchExists', branch: 'feature/login' }, { rule: 'currentBranchIs', branch: 'feature/login' }],
      },
    ],
    hints: [
      {
        en: 'A branch is just a pointer. Create it, then move HEAD to it.',
        bn: 'ব্রাঞ্চ শুধু পয়েন্টার। তৈরি করুন, তারপর HEAD সেখানে নিন।',
      },
      {
        en: 'The simulator has separate create-branch and switch actions.',
        bn: 'সিমুলেটরে create-branch ও switch আলাদা অ্যাকশন আছে।',
      },
    ],
    prerequisites: ['git.practice.basic-commit'],
    relatedCommands: ['git.branch', 'git.switch'],
    relatedLessons: ['git.fundamentals.branch'],
    relatedScenarios: [],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.switch-branches',
    category: 'branching',
    difficulty: 'beginner',
    order: 11,
    estimatedMinutes: 8,
    xpReward: 10,
    tags: ['switch', 'head', 'simulation', 'command'],
    keywords: ['change branch', 'move head', 'switch branch'],
    title: { en: 'Switch Between Branches', bn: 'ব্রাঞ্চ বদলান' },
    description: {
      en: 'Move HEAD between two existing branches and observe what follows it.',
      bn: 'দুটি বিদ্যমান ব্রাঞ্চের মধ্যে HEAD সরান ও কী অনুসরণ করে দেখুন।',
    },
    objective: {
      en: 'Switch from main to the feature branch cleanly.',
      bn: 'main থেকে ফিচার ব্রাঞ্চে পরিষ্কারভাবে যান।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'simulate',
        prompt: {
          en: 'You are on main. Switch to feature/login — then Check.',
          bn: 'আপনি main-এ আছেন। feature/login-এ যান — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'Switching rewrites the working tree to the target tip and moves HEAD. The clean tree makes this completely safe.',
          bn: 'সুইচ টার্গেট টিপে ওয়ার্কিং ট্রি পুনর্লিখন করে ও HEAD সরায়। পরিষ্কার ট্রি এটিকে সম্পূর্ণ নিরাপদ করে।',
        },
        setup: baseState({
          commits: [
            { id: 'C1', message: 'Initial commit', parents: [] },
            { id: 'C2', message: 'Login form', parents: ['C1'] },
          ],
          localBranches: { main: 'C1', feature: 'C2' },
          seq: 3,
        }),
        validation: [{ rule: 'currentBranchIs', branch: 'feature' }],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'After switching, what does HEAD point to?',
          bn: 'সুইচের পর HEAD কী নির্দেশ করে?',
        },
        explanation: {
          en: 'HEAD follows the branch pointer: HEAD → feature/login → C2. HEAD is not itself a branch.',
          bn: 'HEAD ব্রাঞ্চ পয়েন্টার অনুসরণ করে: HEAD → feature/login → C2। HEAD নিজে ব্রাঞ্চ নয়।',
        },
        options: [
          { id: 'branch', label: 'The feature/login branch (which points at C2)', labelBn: 'feature/login ব্রাঞ্চ (যা C2-তে আছে)', correct: true },
          { id: 'main', label: 'Still main, branches never move HEAD', labelBn: 'এখনো main, ব্রাঞ্চ HEAD সরায় না', correct: false },
          { id: 'remote', label: 'origin/feature directly', labelBn: 'সরাসরি origin/feature', correct: false },
          { id: 'none', label: 'Nothing — HEAD is empty after a switch', labelBn: 'কিছু না — সুইচের পর HEAD খালি', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'Switching is safe here because the tree is clean.',
        bn: 'ট্রি পরিষ্কার বলে এখানে সুইচ নিরাপদ।',
      },
    ],
    relatedCommands: ['git.switch', 'git.branch'],
    relatedLessons: ['git.fundamentals.branch', 'git.fundamentals.head'],
    relatedScenarios: [],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.command-identify-current-branch',
    category: 'branching',
    difficulty: 'beginner',
    order: 12,
    estimatedMinutes: 6,
    xpReward: 10,
    tags: ['branch', 'head', 'status', 'command'],
    keywords: ['which branch', 'current branch', 'where am i'],
    title: { en: 'Identify the Current Branch', bn: 'বর্তমান ব্রাঞ্চ চিনুন' },
    description: {
      en: 'Read a repository snapshot and say exactly where HEAD is.',
      bn: 'রিপোজিটরি স্ন্যাপশট পড়ে HEAD ঠিক কোথায় বলুন।',
    },
    objective: {
      en: 'Distinguish local branches, HEAD, and remote-tracking refs.',
      bn: 'লোকাল ব্রাঞ্চ, HEAD ও রিমোট-ট্র্যাকিং ref আলাদা করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'The snapshot shows HEAD on feature, which points at C2, while main points at C1. Which branch are you on?',
          bn: 'স্ন্যাপশটে HEAD feature-এ, যা C2-তে, আর main C1-তে। আপনি কোন ব্রাঞ্চে আছেন?',
        },
        explanation: {
          en: 'HEAD determines your branch: it follows feature/login, so you are on feature — even though main exists too.',
          bn: 'HEAD ব্রাঞ্চ নির্ধারণ করে: এটি feature/login অনুসরণ করে, তাই আপনি feature-এ — main থাকলেও।',
        },
        stateSnapshot: {
          files: cleanFiles(),
          commits: [
            { id: 'C1', message: 'Initial commit', parents: [] },
            { id: 'C2', message: 'Login form', parents: ['C1'] },
          ],
          localBranches: { main: 'C1', feature: 'C2' },
          remoteTracking: { 'origin/main': 'C1' },
          serverBranches: { main: 'C1' },
          serverOnly: [],
          currentBranch: 'feature',
          seq: 3,
        },
        options: [
          { id: 'feature', label: 'feature (HEAD follows it)', labelBn: 'feature (HEAD এটি অনুসরণ করে)', correct: true },
          { id: 'main', label: 'main (it was created first)', labelBn: 'main (এটি আগে তৈরি)', correct: false },
          { id: 'origin', label: 'origin/main (it tracks the remote)', labelBn: 'origin/main (এটি রিমোট ট্র্যাক করে)', correct: false },
          { id: 'detached', label: 'Detached HEAD (no branch)', labelBn: 'ডিটাচড HEAD (ব্রাঞ্চ নেই)', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'Fastest way to confirm your branch any time?',
          bn: 'যেকোনো সময় ব্রাঞ্চ নিশ্চিতের দ্রুততম উপায়?',
        },
        explanation: {
          en: 'git status always opens with "On branch …". Make it muscle memory before every operation.',
          bn: 'git status সবসময় "On branch …" দিয়ে শুরু করে। প্রতিটি অপারেশনের আগে অভ্যাস করুন।',
        },
        options: [
          { id: 'status', label: 'git status', correct: true },
          { id: 'push', label: 'git push and see what happens', labelBn: 'git push করে দেখুন কী হয়', correct: false },
          { id: 'merge', label: 'git merge --abort', correct: false },
          { id: 'reflog', label: 'git reflog', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'Follow HEAD: whichever branch it points at is where you are.',
        bn: 'HEAD অনুসরণ করুন: যে ব্রাঞ্চের দিকে আছে সেখানেই আপনি।',
      },
    ],
    relatedCommands: ['git.status', 'git.branch'],
    relatedLessons: ['git.fundamentals.branch', 'git.fundamentals.head'],
    relatedScenarios: ['git.troubleshooting.detached-head'],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.feature-branch-workflow',
    category: 'branching',
    difficulty: 'intermediate',
    order: 13,
    estimatedMinutes: 12,
    xpReward: 20,
    tags: ['branch', 'commit', 'push', 'workflow', 'simulation'],
    keywords: ['full branch workflow', 'feature to remote', 'capstone branching'],
    title: { en: 'Complete a Feature Branch Workflow', bn: 'ফিচার ব্রাঞ্চ ওয়ার্কফ্লো সম্পন্ন করুন' },
    description: {
      en: 'Branch, switch, commit, and publish — the full journey from main to a shared feature branch.',
      bn: 'ব্রাঞ্চ, সুইচ, কমিট ও প্রকাশ — main থেকে শেয়ার্ড ফিচার ব্রাঞ্চ পর্যন্ত পূর্ণ যাত্রা।',
    },
    objective: {
      en: 'End on feature/login with at least one new commit, published to the remote.',
      bn: 'অন্তত একটি নতুন কমিটসহ feature/login-এ শেষ করুন, রিমোটে প্রকাশিত।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'simulate',
        prompt: {
          en: 'From clean main: branch, switch, change, commit, and push feature/login — then Check.',
          bn: 'পরিষ্কার main থেকে: ব্রাঞ্চ, সুইচ, পরিবর্তন, কমিট ও feature/login পুশ করুন — তারপর Check চাপুন।',
        },
        explanation: {
          en: 'The branch isolates work, the commit freezes it, and the push shares it. The remote now has a branch it never had.',
          bn: 'ব্রাঞ্চ কাজ আলাদা করে, কমিট হিমায়িত করে, পুশ শেয়ার করে। রিমোটে এখন এমন ব্রাঞ্চ যা কখনো ছিল না।',
        },
        setup: baseState(),
        validation: [
          { rule: 'branchExists', branch: 'feature/login' },
          { rule: 'currentBranchIs', branch: 'feature/login' },
          { rule: 'commitCountMin', count: 2 },
          { rule: 'serverHasBranch', branch: 'feature/login' },
        ],
      },
    ],
    hints: [
      {
        en: 'Order matters: you cannot commit before staging, or push before committing.',
        bn: 'ক্রম গুরুত্বপূর্ণ: স্টেজের আগে কমিট নয়, কমিটের আগে পুশ নয়।',
      },
      {
        en: 'Edit a file first — a branch alone has nothing new to commit.',
        bn: 'আগে ফাইল এডিট করুন — শুধু ব্রাঞ্চে কমিটের নতুন কিছু নেই।',
      },
      {
        en: 'Sequence: create-branch → switch → modify → stage → commit → push.',
        bn: 'ক্রম: create-branch → switch → modify → stage → commit → push।',
      },
    ],
    prerequisites: ['git.practice.create-feature-branch', 'git.practice.basic-commit'],
    relatedCommands: ['git.branch', 'git.switch', 'git.add', 'git.commit', 'git.push'],
    relatedLessons: ['git.fundamentals.branch', 'git.fundamentals.commit'],
    relatedScenarios: [],
    relatedWorkflows: [],
  },
];
