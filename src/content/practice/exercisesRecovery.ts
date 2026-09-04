/**
 * Practice exercises — undo & recovery, Git internals.
 */
import { GitSimulationState } from '@/features/simulation/models';
import { PracticeExercise } from '@/types/practice';

const BASE_FILES: GitSimulationState['files'] = [
  { name: 'README.md', workStatus: 'clean', staged: false },
  { name: 'app.js', workStatus: 'clean', staged: false },
  { name: 'package.json', workStatus: 'clean', staged: false },
];

const cleanFiles = () => BASE_FILES.map((f) => ({ ...f }));

export const RECOVERY_EXERCISES: PracticeExercise[] = [
  /* ---------------- Undo & Recovery (26–28) ---------------- */
  {
    id: 'git.practice.command-undo-unwanted-change',
    category: 'recovery',
    difficulty: 'beginner',
    order: 26,
    estimatedMinutes: 8,
    xpReward: 10,
    tags: ['reset', 'undo', 'soft', 'command'],
    keywords: ['undo commit keep changes', 'soft reset', 'uncommit'],
    title: { en: 'Undo an Unwanted Change', bn: 'অবাঞ্ছিত পরিবর্তন বাতিল করুন' },
    description: {
      en: 'Pick the reset mode that undoes the commit but keeps your work staged and safe.',
      bn: 'কমিট বাতিল করে কাজ স্টেজড ও নিরাপদ রাখা রিসেট মোড বেছে নিন।',
    },
    objective: {
      en: 'Undo the last local commit without losing any work.',
      bn: 'কোনো কাজ না হারিয়ে শেষ লোকাল কমিট বাতিল করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'You committed too early but the work is good. Which reset keeps everything staged?',
          bn: 'তাড়াতাড়ি কমিট করেছেন কিন্তু কাজ ভালো। কোন রিসেট সব স্টেজড রাখে?',
        },
        explanation: {
          en: '--soft moves only the branch pointer back. Index and working tree stay exactly as they were.',
          bn: '--soft শুধু ব্রাঞ্চ পয়েন্টার পেছনে নেয়। ইনডেক্স ও ওয়ার্কিং ট্রি ঠিক থাকে।',
        },
        options: [
          { id: 'soft', label: 'git reset --soft HEAD~1', correct: true },
          { id: 'mixed', label: 'git reset --mixed HEAD~1', correct: false },
          { id: 'hard', label: 'git reset --hard HEAD~1', correct: false },
          { id: 'revert', label: 'git revert --no-commit', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'complete',
        prefix: 'git reset',
        placeholder: '___ HEAD~1   (keep work staged)',
        prompt: {
          en: 'Complete the flag that undoes the last commit while keeping changes staged.',
          bn: 'পরিবর্তন স্টেজড রেখে শেষ কমিট বাতিল করা ফ্ল্যাগটি সম্পূর্ণ করুন।',
        },
        explanation: {
          en: '--soft rewinds the pointer only. --mixed would unstage; --hard would destroy work.',
          bn: '--soft শুধু পয়েন্টার পেছনে নেয়। --mixed আনস্টেজ করত; --hard কাজ ধ্বংস করত।',
        },
        acceptedAnswers: ['--soft'],
      },
      {
        id: 't3',
        kind: 'select',
        prompt: {
          en: 'The bad commit is already pushed and shared. What now?',
          bn: 'খারাপ কমিট ইতিমধ্যে পুশ ও শেয়ার্ড। এখন কী?',
        },
        explanation: {
          en: 'Never reset shared history. git revert records a NEW commit that undoes the change — safe for everyone.',
          bn: 'শেয়ার্ড হিস্ট্রি কখনো রিসেট নয়। git revert পরিবর্তন বাতিল করা নতুন কমিট রেকর্ড করে — সবার জন্য নিরাপদ।',
        },
        options: [
          { id: 'revert', label: 'git revert the commit, then push', labelBn: 'কমিট revert করে পুশ', correct: true },
          { id: 'hardpush', label: 'git reset --hard, then force-push', labelBn: 'git reset --hard, তারপর ফোর্স-পুশ', correct: false },
          { id: 'delete', label: 'Delete the branch and start over', labelBn: 'ব্রাঞ্চ মুছে নতুন শুরু', correct: false },
          { id: 'ignore', label: 'Leave it — history cannot be fixed', labelBn: 'রেখে দিন — হিস্ট্রি ঠিক হয় না', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'Soft touches the least, hard touches the most. You want to keep everything.',
        bn: 'Soft সবচেয়ে কম ছোঁয়, hard সবচেয়ে বেশি। আপনি সব রাখতে চান।',
      },
      {
        en: 'Pushed history belongs to the team — only additive fixes are safe there.',
        bn: 'পুশড হিস্ট্রি টিমের — সেখানে শুধু সংযোজনমূলক ফিক্স নিরাপদ।',
      },
    ],
    relatedCommands: ['git.reset'],
    relatedLessons: ['git.fundamentals.commit'],
    relatedScenarios: ['git.troubleshooting.undo-last-commit', 'git.troubleshooting.reset-hard'],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.recover-deleted-branch',
    category: 'recovery',
    difficulty: 'intermediate',
    order: 27,
    estimatedMinutes: 10,
    xpReward: 20,
    tags: ['reflog', 'branch', 'recover', 'order'],
    keywords: ['deleted branch', 'restore branch', 'lost branch'],
    title: { en: 'Recover a Deleted Branch', bn: 'মুছে যাওয়া ব্রাঞ্চ উদ্ধার করুন' },
    description: {
      en: 'A branch with needed commits was deleted. Find its tip in the reflog and rebuild it.',
      bn: 'দরকারি কমিটসহ ব্রাঞ্চ মোছা হয়েছে। রিফ্লগে টিপ খুঁজে পুনর্নির্মাণ করুন।',
    },
    objective: {
      en: 'Order the recovery and name the mechanism that makes it possible.',
      bn: 'পুনরুদ্ধার ক্রমে সাজান ও সম্ভব করা কৌশলের নাম বলুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'feature/login was deleted yesterday with unique commits. What Git mechanism can still locate its old tip?',
          bn: 'অনন্য কমিটসহ feature/login গতকাল মোছা হয়েছে। কোন গিট কৌশল পুরনো টিপ খুঁজতে পারে?',
        },
        explanation: {
          en: 'Deleting a branch removes only the pointer. The reflog journal still records where it pointed.',
          bn: 'ব্রাঞ্চ মোছা শুধু পয়েন্টার সরায়। রিফ্লগ জার্নালে কোথায় ছিল তা এখনো আছে।',
        },
        options: [
          { id: 'reflog', label: 'The reflog journal', labelBn: 'রিফ্লগ জার্নাল', correct: true },
          { id: 'stash', label: 'The stash list', labelBn: 'স্ট্যাশ তালিকা', correct: false },
          { id: 'remote', label: 'The remote server backup', labelBn: 'রিমোট সার্ভার ব্যাকআপ', correct: false },
          { id: 'gc', label: 'git gc recovery mode', labelBn: 'git gc রিকভারি মোড', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'order',
        prompt: {
          en: 'Order the branch recovery steps.',
          bn: 'ব্রাঞ্চ পুনরুদ্ধার ধাপ ক্রমে সাজান।',
        },
        explanation: {
          en: 'Inspect the journal first, identify the tip hash, then recreate the pointer. Never skip verification.',
          bn: 'আগে জার্নাল পরিদর্শন, টিপ হ্যাশ শনাক্ত, তারপর পয়েন্টার পুনর্নির্মাণ। যাচাই কখনো বাদ নয়।',
        },
        items: [
          { id: 'reflog', label: 'Run git reflog', labelBn: 'git reflog চালান' },
          { id: 'identify', label: 'Identify the old tip hash', labelBn: 'পুরনো টিপ হ্যাশ শনাক্ত করুন' },
          { id: 'recreate', label: 'Recreate the branch at that hash', labelBn: 'হ্যাশে ব্রাঞ্চ পুনর্নির্মাণ করুন' },
          { id: 'verify', label: 'Verify with git log', labelBn: 'git log দিয়ে যাচাই করুন' },
        ],
        correctOrder: ['reflog', 'identify', 'recreate', 'verify'],
      },
    ],
    hints: [
      {
        en: 'Deleting removes the label, not the commits. Where does Git write down pointer moves?',
        bn: 'মোছা লেবেল সরায়, কমিট নয়। পয়েন্টার নড়াচড়া গিট কোথায় লিখে রাখে?',
      },
    ],
    relatedCommands: ['git.branch'],
    relatedLessons: ['git.fundamentals.branch'],
    relatedScenarios: ['git.troubleshooting.deleted-branch', 'git.troubleshooting.recover-commit'],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.command-recover-lost-commit',
    category: 'recovery',
    difficulty: 'advanced',
    order: 28,
    estimatedMinutes: 10,
    xpReward: 30,
    tags: ['reflog', 'reset-hard', 'danger', 'command'],
    keywords: ['lost commit', 'hard reset recovery', 'reflog expiry'],
    title: { en: 'Recover a Lost Commit Using Reflog', bn: 'রিফ্লগে হারানো কমিট উদ্ধার করুন' },
    description: {
      en: 'A hard reset orphaned good commits. Use the journal honestly — within its limits.',
      bn: 'হার্ড রিসেট ভালো কমিট এতিম করেছে। সীমার মধ্যে থেকে সৎভাবে জার্নাল ব্যবহার করুন।',
    },
    objective: {
      en: 'Inspect the reflog and state exactly what it can and cannot recover.',
      bn: 'রিফ্লগ পরিদর্শন করে ঠিক কী উদ্ধার পারে ও পারে না বলুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'complete',
        prefix: 'git',
        placeholder: '___',
        prompt: {
          en: 'Complete the command that shows the journal of reference movements.',
          bn: 'রেফারেন্স নড়াচড়ার জার্নাল দেখানো কমান্ডটি সম্পূর্ণ করুন।',
        },
        explanation: {
          en: 'git reflog lists HEAD@{n} entries with old and new values — your map back to orphaned commits.',
          bn: 'git reflog পুরনো ও নতুন মানসহ HEAD@{n} এন্ট্রি তালিকা করে — এতিম কমিটে ফেরার মানচিত্র।',
        },
        acceptedAnswers: ['reflog'],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'Which statement about the reflog is TRUE?',
          bn: 'রিফ্লগ সম্পর্কে কোন বক্তব্য সত্য?',
        },
        explanation: {
          en: 'The reflog is local, expires (roughly 90/30 days), and journals references — never working-tree files.',
          bn: 'রিফ্লগ লোকাল, মেয়াদোত্তীর্ণ হয় (~৯০/৩০ দিন), রেফারেন্সের জার্নাল — ওয়ার্কিং-ট্রি ফাইলের নয়।',
        },
        options: [
          { id: 'local', label: 'Local and expiring; it cannot restore uncommitted file edits', labelBn: 'লোকাল ও মেয়াদি; আনকমিটেড ফাইল এডিট ফেরাতে পারে না', correct: true },
          { id: 'remote', label: 'Synced to the remote as a backup', labelBn: 'ব্যাকআপে রিমোটে সিঙ্ক হয়', correct: false },
          { id: 'forever', label: 'Keeps every commit forever', labelBn: 'প্রতিটি কমিট চিরকাল রাখে', correct: false },
          { id: 'files', label: 'Records working-tree file contents', labelBn: 'ওয়ার্কিং-ট্রি ফাইল কন্টেন্ট রেকর্ড করে', correct: false },
        ],
      },
      {
        id: 't3',
        kind: 'select',
        prompt: {
          en: 'git reset --hard destroyed uncommitted edits that were never staged. Can the reflog bring them back?',
          bn: 'git reset --hard কখনো স্টেজ না হওয়া আনকমিটেড এডিট ধ্বংস করেছে। রিফ্লগ ফেরাতে পারবে?',
        },
        explanation: {
          en: 'No. The reflog journals reference movements, not file bytes. Uncommitted content was never an object.',
          bn: 'না। রিফ্লগ রেফারেন্স নড়াচড়ার জার্নাল, ফাইল বাইটের নয়। আনকমিটেড কন্টেন্ট কখনো অবজেক্ট ছিল না।',
        },
        options: [
          { id: 'no', label: 'No — they were never stored as objects', labelBn: 'না — এগুলো অবজেক্টে সংরক্ষিত হয়নি', correct: true },
          { id: 'yes', label: 'Yes — reflog keeps everything', labelBn: 'হ্যাঁ — রিফ্লগ সব রাখে', correct: false },
          { id: 'gc', label: 'Yes — after running git gc', labelBn: 'হ্যাঁ — git gc চালালে', correct: false },
          { id: 'push', label: 'Yes — by fetching from origin', labelBn: 'হ্যাঁ — origin থেকে fetch করে', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'Journals record movements of pointers. What was never a pointer target?',
        bn: 'জার্নাল পয়েন্টার নড়াচড়া রেকর্ড করে। কী কখনো পয়েন্টার লক্ষ্য ছিল না?',
      },
    ],
    relatedCommands: ['git.reset'],
    relatedLessons: ['git.internals.reflog', 'git.internals.unreachable-objects-expiry'],
    relatedScenarios: ['git.troubleshooting.reset-hard', 'git.troubleshooting.recover-commit'],
    relatedWorkflows: [],
  },
  /* ---------------- Internals (29–30) ---------------- */
  {
    id: 'git.practice.command-follow-head',
    category: 'internals',
    difficulty: 'intermediate',
    order: 29,
    estimatedMinutes: 8,
    xpReward: 20,
    tags: ['head', 'graph', 'pointer', 'command'],
    keywords: ['follow head', 'where is head', 'symbolic ref'],
    title: { en: 'Follow HEAD Through a Repository', bn: 'রিপোজিটরিতে HEAD অনুসরণ করুন' },
    description: {
      en: 'Read a live commit graph and trace exactly where HEAD sits.',
      bn: 'লাইভ কমিট গ্রাফ পড়ে HEAD ঠিক কোথায় আছে অনুসরণ করুন।',
    },
    objective: {
      en: 'Resolve HEAD → branch → commit on a real graph.',
      bn: 'আসল গ্রাফে HEAD → ব্রাঞ্চ → কমিট সমাধান করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'The graph shows HEAD on feature, feature on C3, main on C2. Where is HEAD, ultimately?',
          bn: 'গ্রাফে HEAD feature-এ, feature C3-তে, main C2-তে। শেষ পর্যন্ত HEAD কোথায়?',
        },
        explanation: {
          en: 'HEAD → feature → C3. Resolution follows the symbolic layer first, then lands on a commit.',
          bn: 'HEAD → feature → C3। সমাধান আগে সিম্বলিক স্তর অনুসরণ করে, তারপর কমিটে নামে।',
        },
        stateSnapshot: {
          files: cleanFiles(),
          commits: [
            { id: 'C1', message: 'Initial commit', parents: [] },
            { id: 'C2', message: 'Homepage copy', parents: ['C1'] },
            { id: 'C3', message: 'Login form', parents: ['C2'] },
          ],
          localBranches: { main: 'C2', feature: 'C3' },
          remoteTracking: { 'origin/main': 'C2' },
          serverBranches: { main: 'C2' },
          serverOnly: [],
          currentBranch: 'feature',
          seq: 4,
        },
        snapshotView: 'graph',
        options: [
          { id: 'c3', label: 'Commit C3, via branch feature', labelBn: 'C3 কমিট, feature ব্রাঞ্চ হয়ে', correct: true },
          { id: 'c2', label: 'Commit C2, via branch main', labelBn: 'C2 কমিট, main ব্রাঞ্চ হয়ে', correct: false },
          { id: 'origin', label: 'origin/main directly', labelBn: 'সরাসরি origin/main', correct: false },
          { id: 'detached', label: 'Detached at C1', labelBn: 'C1-তে ডিটাচড', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'You commit now. Which reference moves?',
          bn: 'এখন কমিট করলেন। কোন রেফারেন্স নড়বে?',
        },
        explanation: {
          en: 'HEAD resolves to feature, so feature advances to the new commit. main and origin/main stay exactly where they are.',
          bn: 'HEAD feature-এ সমাধান হয়, তাই feature নতুন কমিটে এগোয়। main ও origin/main ঠিক থাকে।',
        },
        options: [
          { id: 'feature', label: 'feature advances; HEAD follows it', labelBn: 'feature এগোয়; HEAD অনুসরণ করে', correct: true },
          { id: 'main', label: 'main advances instead', labelBn: 'বদলে main এগোয়', correct: false },
          { id: 'all', label: 'All branches advance together', labelBn: 'সব ব্রাঞ্চ একসাথে এগোয়', correct: false },
          { id: 'head', label: 'HEAD moves but no branch does', labelBn: 'HEAD সরে কিন্তু ব্রাঞ্চ নয়', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'HEAD is a pointer to a pointer. Follow both hops.',
        bn: 'HEAD পয়েন্টারের পয়েন্টার। দুটি হপ অনুসরণ করুন।',
      },
    ],
    relatedCommands: ['git.switch', 'git.log'],
    relatedLessons: ['git.internals.head-deep-dive', 'git.internals.commit-graphs'],
    relatedScenarios: ['git.troubleshooting.detached-head'],
    relatedWorkflows: [],
  },
  {
    id: 'git.practice.command-interpret-graph',
    category: 'internals',
    difficulty: 'advanced',
    order: 30,
    estimatedMinutes: 10,
    xpReward: 30,
    tags: ['graph', 'merge', 'parents', 'dag', 'command'],
    keywords: ['read commit graph', 'merge parents', 'which parent'],
    title: { en: 'Interpret a Commit Graph', bn: 'কমিট গ্রাফ ব্যাখ্যা করুন' },
    description: {
      en: 'Read parents, merges, and reachability straight off the graph like a map.',
      bn: 'মানচিত্রের মতো গ্রাফ থেকে প্যারেন্ট, মার্জ ও রিচেবিলিটি পড়ুন।',
    },
    objective: {
      en: 'Identify merge structure and explain rebase identity from graph evidence.',
      bn: 'মার্জ কাঠামো শনাক্ত করুন ও গ্রাফ প্রমাণে রিবেস পরিচয় ব্যাখ্যা করুন।',
    },
    tasks: [
      {
        id: 't1',
        kind: 'select',
        prompt: {
          en: 'Merge commit M has two incoming edges: from C3 (main side) and F2 (feature side). What does that prove?',
          bn: 'মার্জ কমিট M-এর দুটি আগত এজ: C3 (main পক্ষ) ও F2 (feature পক্ষ) থেকে। এতে কী প্রমাণ হয়?',
        },
        explanation: {
          en: 'M records both lines as parents — first-parent mainline plus the merged-in feature. Both histories survive inside M.',
          bn: 'M উভয় লাইন প্যারেন্টে রেকর্ড করে — ফার্স্ট-প্যারেন্ট mainline ও মার্জড ফিচার। উভয় হিস্ট্রি M-এ বেঁচে থাকে।',
        },
        stateSnapshot: {
          files: cleanFiles(),
          commits: [
            { id: 'C1', message: 'Initial commit', parents: [] },
            { id: 'C3', message: 'Homepage copy', parents: ['C1'] },
            { id: 'F2', message: 'Login form', parents: ['C1'] },
            { id: 'M', message: "Merge branch 'feature'", parents: ['C3', 'F2'] },
          ],
          localBranches: { main: 'M', feature: 'F2' },
          remoteTracking: { 'origin/main': 'M' },
          serverBranches: { main: 'M' },
          serverOnly: [],
          currentBranch: 'main',
          seq: 5,
        },
        snapshotView: 'graph',
        options: [
          { id: 'both', label: 'M joins both histories; C3 and F2 are its parents', labelBn: 'M উভয় হিস্ট্রি যুক্ত করে; C3 ও F2 প্যারেন্ট', correct: true },
          { id: 'ff', label: 'This was a fast-forward; M is redundant', labelBn: 'এটি ফাস্ট-ফরোয়ার্ড; M অপ্রয়োজনীয়', correct: false },
          { id: 'rebase', label: 'F2 was rebased onto C3', labelBn: 'F2 C3-এর ওপর রিবেস হয়েছে', correct: false },
          { id: 'lost', label: 'C3 was discarded by the merge', labelBn: 'মার্জে C3 বাতিল হয়েছে', correct: false },
        ],
      },
      {
        id: 't2',
        kind: 'select',
        prompt: {
          en: 'After rebasing feature onto main, the graph shows F1′ where F1 was. Same changes — why a new identity?',
          bn: 'feature main-এর ওপর রিবেসের পর গ্রাফে F1-এর জায়গায় F1′। একই পরিবর্তন — নতুন পরিচয় কেন?',
        },
        explanation: {
          en: 'Identity covers parents and timestamps too. New base means new bytes hashed — F1′ merely resembles F1.',
          bn: 'পরিচয়ে প্যারেন্ট ও টাইমস্ট্যাম্পও থাকে। নতুন বেস মানে নতুন বাইট হ্যাশ — F1′ শুধু F1-এর মতো।',
        },
        options: [
          { id: 'hash', label: 'Different parents/timestamps hash differently', labelBn: 'ভিন্ন প্যারেন্ট/টাইমস্ট্যাম্প ভিন্ন হ্যাশ করে', correct: true },
          { id: 'moved', label: 'Git moved the original object', labelBn: 'গিট মূল অবজেক্ট সরিয়েছে', correct: false },
          { id: 'renamed', label: 'Only the branch label changed', labelBn: 'শুধু ব্রাঞ্চ লেবেল বদলেছে', correct: false },
          { id: 'squash', label: 'Rebase always squashes into one commit', labelBn: 'রিবেস সবসময় এক কমিটে স্কোয়াশ করে', correct: false },
        ],
      },
    ],
    hints: [
      {
        en: 'Edges are parent links. Count the edges into M.',
        bn: 'এজ প্যারেন্ট লিঙ্ক। M-এ এজ গুনুন।',
      },
      {
        en: 'A hash covers everything about a commit — including where it sits.',
        bn: 'হ্যাশ কমিটের সবকিছু আচ্ছাদন করে — কোথায় বসে তাও।',
      },
    ],
    relatedCommands: ['git.log', 'git.merge', 'git.rebase'],
    relatedLessons: ['git.internals.dag-structure', 'git.internals.rebase-rewrites-history', 'git.internals.commit-graphs'],
    relatedScenarios: ['git.troubleshooting.diverged'],
    relatedWorkflows: [],
  },
];
