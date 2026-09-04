import {
  TroubleshootingCategory,
  TroubleshootingGuide,
} from '@/types/content';

/**
 * Troubleshooting & Recovery Cookbook — data only, no UI.
 *
 * Conventions:
 * - id:   'git.troubleshooting.<slug>' (stable, used for progress/XP)
 * - slug: '<slug>' → /troubleshooting/git/<slug>
 * - `commands` reference existing GIT_COMMANDS slugs (unresolvable entries are
 *   rendered as plain code, never as broken links).
 * - `lessons` reference FUNDAMENTALS_LESSONS ids.
 * - Git syntax, flags, paths and hashes stay in English in both languages.
 */

export const TROUBLESHOOTING_CATEGORIES: TroubleshootingCategory[] = [
  { id: 'everyday-mistakes', title: { en: 'Everyday Mistakes', bn: 'দৈনন্দিন ভুল' } },
  { id: 'undo-recovery', title: { en: 'Undo & Recovery', bn: 'আনডু ও রিকভারি' } },
  { id: 'branch-problems', title: { en: 'Branch Problems', bn: 'ব্রাঞ্চ সমস্যা' } },
  { id: 'merge-conflicts', title: { en: 'Merge Conflicts', bn: 'মার্জ কনফ্লিক্ট' } },
  { id: 'rebase-conflicts', title: { en: 'Rebase Conflicts', bn: 'রিবেস কনফ্লিক্ট' } },
  { id: 'remote-push', title: { en: 'Remote & Push Problems', bn: 'রিমোট ও পুশ সমস্যা' } },
  { id: 'commit-problems', title: { en: 'Commit Problems', bn: 'কমিট সমস্যা' } },
  { id: 'working-tree', title: { en: 'Working Tree Problems', bn: 'ওয়ার্কিং ট্রি সমস্যা' } },
  { id: 'detached-head', title: { en: 'Detached HEAD', bn: 'ডিটাচড HEAD' } },
  { id: 'history-recovery', title: { en: 'History Recovery', bn: 'হিস্ট্রি রিকভারি' } },
  { id: 'collaboration', title: { en: 'Collaboration Problems', bn: 'সহযোগিতা সমস্যা' } },
  { id: 'github-workflow', title: { en: 'GitHub Workflow Problems', bn: 'গিটহাব ওয়ার্কফ্লো সমস্যা' } },
  { id: 'security', title: { en: 'Security Mistakes', bn: 'নিরাপত্তা ভুল' } },
];

const L = {
  workingDirectory: 'git.fundamentals.working-directory',
  stagingArea: 'git.fundamentals.staging-area',
  commit: 'git.fundamentals.commit',
  branch: 'git.fundamentals.branch',
  head: 'git.fundamentals.head',
  remote: 'git.fundamentals.remote-repository',
  local: 'git.fundamentals.local-repository',
  threeAreas: 'git.fundamentals.three-areas',
};

export const TROUBLESHOOTING_GUIDES_A: TroubleshootingGuide[] = [
  {
    id: 'git.troubleshooting.wrong-branch',
    slug: 'wrong-branch',
    title: { en: 'I committed to the wrong branch', bn: 'ভুল ব্রাঞ্চে কমিট করে ফেলেছি' },
    shortDescription: {
      en: 'Your work is safe, but it lives on the wrong pointer. The fix depends on one question: is it pushed yet?',
      bn: 'আপনার কাজ নিরাপদ, কিন্তু ভুল পয়েন্টারে আছে। সমাধান একটি প্রশ্নের উপর নির্ভর করে: এটা কি পুশ হয়েছে?',
    },
    category: 'branch-problems',
    difficulty: 'intermediate',
    severity: 'medium',
    symptoms: [
      { en: 'git log shows your commit on main instead of your feature branch.', bn: 'git log দেখায় আপনার কমিট ফিচার ব্রাঞ্চের বদলে main-এ আছে।' },
      { en: 'Switching to the feature branch does not show your changes.', bn: 'ফিচার ব্রাঞ্চে গেলেও আপনার পরিবর্তন দেখা যায় না।' },
    ],
    sightings: [
      { command: 'git log --oneline -n 3', output: '9f3a2c1 (HEAD -> main) Add login validation\n7d1e0a4 Merge pull request #42\n3b8c9d2 Fix header spacing' },
    ],
    diagnosis: {
      en: 'A commit belongs to whichever branch pointer it was created on. Nothing is lost — the commit object is fine. Recovery means giving that commit a home on the right branch and moving the wrong pointer back.',
      bn: 'কমিট যে ব্রাঞ্চ পয়েন্টারে তৈরি হয় সেটারই হয়। কিছু হারায়নি — কমিট অবজেক্ট ঠিক আছে। রিকভারি মানে কমিটটিকে সঠিক ব্রাঞ্চে ঠিকানা দেওয়া এবং ভুল পয়েন্টার পিছিয়ে নেওয়া।',
    },
    likelyCauses: [
      { en: 'You forgot to create or switch to the feature branch before committing.', bn: 'কমিটের আগে ফিচার ব্রাঞ্চ তৈরি বা সেখানে যেতে ভুলে গেছেন।' },
      { en: 'You created the new branch from the wrong base after committing.', bn: 'কমিটের পর ভুল বেস থেকে নতুন ব্রাঞ্চ তৈরি করেছেন।' },
    ],
    checks: [
      { label: { en: 'Confirm which branch holds the commit.', bn: 'নিশ্চিত হোন কোন ব্রাঞ্চে কমিট আছে।' }, command: 'git log --oneline -n 3' },
      { label: { en: 'Check whether the commit exists on the remote (pushed?).', bn: 'কমিট রিমোটে আছে কিনা দেখুন (পুশ হয়েছে?)।' }, command: 'git status' },
    ],
    fix: {
      title: { en: 'Move the commit when it is NOT pushed yet', bn: 'পুশ না হলে কমিট সরিয়ে নিন' },
      steps: [
        { en: 'Create the correct branch exactly where you are — this gives your commit its proper home.', bn: 'ঠিক যেখানে আছেন সেখানে সঠিক ব্রাঞ্চ তৈরি করুন — এতে কমিটটি সঠিক ঠিকানা পায়।' },
        { en: 'Switch back to the wrong branch and move its pointer back one commit. Safe now, because the commit lives on the new branch.', bn: 'ভুল ব্রাঞ্চে ফিরে পয়েন্টার এক কমিট পিছিয়ে নিন। এখন নিরাপদ, কারণ কমিট নতুন ব্রাঞ্চে আছে।' },
        { en: 'Verify both branches, then continue working on the feature branch.', bn: 'দুটি ব্রাঞ্চ যাচাই করুন, তারপর ফিচার ব্রাঞ্চে কাজ চালিয়ে যান।' },
      ],
      commands: ['git switch -c feature-login', 'git switch main', 'git reset --hard HEAD~1', 'git log --oneline -n 3'],
    },
    alternatives: [
      {
        title: { en: 'If the commit is already pushed', bn: 'কমিট ইতিমধ্যে পুশ হলে' },
        detail: {
          en: 'Do not reset shared history. Instead, cherry-pick the commit onto the correct branch, push that, then revert the commit on the wrong branch so teammates stay in sync.',
          bn: 'শেয়ার্ড হিস্ট্রি রিসেট করবেন না। বরং কমিটটি সঠিক ব্রাঞ্চে cherry-pick করে পুশ করুন, তারপর ভুল ব্রাঞ্চে revert করুন যাতে সহকর্মীরা সিঙ্কে থাকে।',
        },
        commands: ['git switch feature-login', 'git cherry-pick main', 'git switch main', 'git revert HEAD'],
      },
    ],
    warnings: [
      { level: 'danger', text: { en: 'git reset --hard permanently discards the working tree state at that pointer. Only use it here because the commit is preserved on the new branch — and never on pushed, shared history.', bn: 'git reset --hard ঐ পয়েন্টারের ওয়ার্কিং ট্রি স্থায়ীভাবে মুছে দেয়। এখানে শুধু ব্যবহার করুন কারণ কমিট নতুন ব্রাঞ্চে সংরক্ষিত — পুশ করা শেয়ার্ড হিস্ট্রিতে কখনো নয়।' } },
    ],
    verify: [
      { en: 'git log on the feature branch shows your commit.', bn: 'ফিচার ব্রাঞ্চে git log দিলে আপনার কমিট দেখায়।' },
      { en: 'git log on main no longer shows it, and git status is clean.', bn: 'main-এ git log আর দেখায় না, এবং git status পরিষ্কার।' },
    ],
    diagram: {
      before: ['main → C1 → C2 → C3 (your commit, wrong home)', 'feature → C2'],
      after: ['main → C1 → C2', 'feature → C2 → C3 (right home)'],
      caption: { en: 'The commit moves homes; no work is rewritten.', bn: 'কমিট ঠিকানা বদলায়; কোনো কাজ পুনর্লেখা হয় না।' },
    },
    commands: ['switch', 'branch', 'reset', 'log', 'status'],
    lessons: [L.branch, L.head],
    scenarios: ['undo-last-commit', 'deleted-branch'],
    tags: ['branch', 'wrong branch', 'misplaced commit', 'reset'],
    searchKeywords: ['wrong branch', 'misplaced commit', 'commit wrong place', 'move commit', 'commit on main by mistake'],
    safeForBeginners: false,
    popular: true,
    order: 1,
  },
  {
    id: 'git.troubleshooting.staged-file',
    slug: 'staged-file',
    title: { en: 'I accidentally staged a file', bn: 'ভুলে একটি ফাইল স্টেজ করে ফেলেছি' },
    shortDescription: {
      en: 'Staging is fully reversible. Unstage the file — your edits stay exactly where they are.',
      bn: 'স্টেজিং সম্পূর্ণ বিপরীতমুখী। ফাইল আনস্টেজ করুন — আপনার এডিট ঠিক যেখানে আছে সেখানেই থাকবে।',
    },
    category: 'everyday-mistakes',
    difficulty: 'beginner',
    severity: 'low',
    symptoms: [
      { en: 'git status lists the file under "Changes to be committed" but you are not ready to commit it.', bn: 'git status ফাইলটিকে "Changes to be committed"-এর নিচে দেখায় কিন্তু আপনি কমিট করতে প্রস্তুত নন।' },
    ],
    sightings: [
      { command: 'git status', output: 'Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\tmodified:   debug-notes.txt' },
    ],
    diagnosis: {
      en: 'git add copies the file into the staging index. Unstaging removes that copy from the index — it never touches your working-tree file.',
      bn: 'git add ফাইলটি স্টেজিং ইনডেক্সে কপি করে। আনস্টেজ করলে ইনডেক্স থেকে কপি সরে — আপনার ওয়ার্কিং-ট্রি ফাইলে হাত দেয় না।',
    },
    likelyCauses: [
      { en: 'Running git add . without checking git status first.', bn: 'git status না দেখে git add . চালানো।' },
    ],
    checks: [
      { label: { en: 'See exactly what is staged.', bn: 'ঠিক কী স্টেজড আছে দেখুন।' }, command: 'git status' },
      { label: { en: 'Review the staged content before unstaging.', bn: 'আনস্টেজ করার আগে স্টেজড কনটেন্ট পর্যালোচনা করুন।' }, command: 'git diff --staged' },
    ],
    fix: {
      title: { en: 'Unstage the file, keep your edits', bn: 'ফাইল আনস্টেজ করুন, এডিট রেখে দিন' },
      steps: [
        { en: 'Unstage just that file. Your edits remain in the working directory as unstaged changes.', bn: 'শুধু ঐ ফাইল আনস্টেজ করুন। আপনার এডিট ওয়ার্কিং ডিরেক্টরিতে আনস্টেজড হিসেবে থাকে।' },
        { en: 'Run git status to confirm the file moved back under "Changes not staged".', bn: 'git status চালিয়ে নিশ্চিত হোন ফাইল "Changes not staged"-এ ফিরেছে।' },
      ],
      commands: ['git restore --staged debug-notes.txt', 'git status'],
    },
    alternatives: [
      {
        title: { en: 'Older Git versions', bn: 'পুরনো গিট সংস্করণ' },
        detail: {
          en: 'On Git older than 2.23 the equivalent is git reset HEAD <file>. It unstages without touching your edits — same result, older spelling.',
          bn: '২.২৩-এর পুরনো গিটে সমতুল্য হলো git reset HEAD <file>। এডিট না ছুঁয়ে আনস্টেজ করে — একই ফল, পুরনো বানান।',
        },
        commands: ['git reset HEAD debug-notes.txt'],
      },
    ],
    warnings: [],
    verify: [
      { en: 'git status shows the file under "Changes not staged for commit".', bn: 'git status ফাইলটিকে "Changes not staged for commit"-এ দেখায়।' },
      { en: 'Opening the file confirms your edits are intact.', bn: 'ফাইল খুলে নিশ্চিত হোন এডিট অক্ষত আছে।' },
    ],
    commands: ['restore', 'status', 'reset'],
    lessons: [L.stagingArea, L.threeAreas],
    scenarios: ['deleted-changes', 'undo-last-commit'],
    tags: ['staging', 'unstage', 'add'],
    searchKeywords: ['unstage', 'accidentally staged', 'remove from staging', 'unadd file', 'staged by mistake'],
    safeForBeginners: true,
    popular: true,
    order: 2,
  },
  {
    id: 'git.troubleshooting.undo-last-commit',
    slug: 'undo-last-commit',
    title: { en: 'How do I undo my last commit?', bn: 'শেষ কমিটটি কীভাবে বাতিল করব?' },
    shortDescription: {
      en: 'Three softness levels: keep changes staged, keep them unstaged, or discard them. Pushed commits need revert instead.',
      bn: 'তিনটি মাত্রা: পরিবর্তন স্টেজড রাখুন, আনস্টেজড রাখুন, বা মুছে দিন। পুশ করা কমিটে revert দরকার।',
    },
    category: 'undo-recovery',
    difficulty: 'beginner',
    severity: 'medium',
    symptoms: [
      { en: 'Your last commit message has a typo, misses a file, or should not exist yet.', bn: 'শেষ কমিট মেসেজে ভুল, ফাইল বাদ পড়েছে, বা এখনো থাকা উচিত নয়।' },
    ],
    sightings: [
      { command: 'git log --oneline -n 2', output: 'a1b2c3d (HEAD -> main) Fix logni validation\n9f8e7d6 Add login form' },
    ],
    diagnosis: {
      en: 'Undoing means moving the branch pointer back one commit. The question is only what should happen to the changes inside that commit: stay staged (--soft), become unstaged (--mixed, the default), or be thrown away (--hard).',
      bn: 'আনডু মানে ব্রাঞ্চ পয়েন্টার এক কমিট পিছিয়ে নেওয়া। প্রশ্ন শুধু কমিটের ভেতরের পরিবর্তনের কী হবে: স্টেজড থাকবে (--soft), আনস্টেজড হবে (--mixed, ডিফল্ট), নাকি ফেলে দেওয়া হবে (--hard)।',
    },
    likelyCauses: [
      { en: 'Committing too early, with a typo, or before reviewing the diff.', bn: 'তাড়াতাড়ি কমিট, ভুল বানান, বা diff না দেখে কমিট।' },
    ],
    checks: [
      { label: { en: 'Confirm it really is the tip commit.', bn: 'নিশ্চিত হোন এটাই টিপ কমিট।' }, command: 'git log --oneline -n 2' },
      { label: { en: 'Check if it is already pushed (ahead/behind info).', bn: 'পুশ হয়েছে কিনা দেখুন (ahead/behind তথ্য)।' }, command: 'git status' },
    ],
    fix: {
      title: { en: 'Undo locally, keeping your work', bn: 'কাজ রেখে লোকালি বাতিল করুন' },
      steps: [
        { en: 'Keep the changes staged (best for fixing a message or adding one more file): git reset --soft HEAD~1.', bn: 'পরিবর্তন স্টেজড রাখুন (মেসেজ ঠিক বা আরেকটি ফাইল যোগে সেরা): git reset --soft HEAD~1।' },
        { en: 'Or keep the changes unstaged (default, best for re-editing): git reset HEAD~1.', bn: 'অথবা পরিবর্তন আনস্টেজড রাখুন (ডিফল্ট, পুনরায় এডিটে সেরা): git reset HEAD~1।' },
        { en: 'Only if you are sure the work is worthless, discard everything: git reset --hard HEAD~1.', bn: 'কাজ মূল্যহীন নিশ্চিত হলেই সব মুছুন: git reset --hard HEAD~1।' },
      ],
      commands: ['git reset --soft HEAD~1', 'git reset HEAD~1', 'git reset --hard HEAD~1'],
    },
    alternatives: [
      {
        title: { en: 'If the commit is already pushed', bn: 'কমিট পুশ হয়ে গেলে' },
        detail: {
          en: 'Never reset pushed, shared history. Create a new commit that undoes it with git revert HEAD, then push normally. Teammates stay in sync because history only moves forward.',
          bn: 'পুশ করা শেয়ার্ড হিস্ট্রি কখনো রিসেট করবেন না। git revert HEAD দিয়ে বাতিলকারী নতুন কমিট বানিয়ে স্বাভাবিকভাবে পুশ করুন। হিস্ট্রি শুধু এগোয় বলে সহকর্মীরা সিঙ্কে থাকে।',
        },
        commands: ['git revert HEAD', 'git push'],
      },
      {
        title: { en: 'If only the message is wrong (unpushed)', bn: 'শুধু মেসেজ ভুল হলে (আনপুশড)' },
        detail: {
          en: 'Keep the commit and rewrite just its message with git commit --amend. Only for commits nobody else has yet.',
          bn: 'কমিট রেখে শুধু মেসেজ পুনর্লিখন করুন git commit --amend দিয়ে। শুধু অন্য কেউ এখনো পায়নি এমন কমিটে।',
        },
        commands: ['git commit --amend -m "Fix login validation"'],
      },
    ],
    warnings: [
      { level: 'danger', text: { en: 'git reset --hard permanently destroys uncommitted work and the undone commit. There is no undo for the discarded part — staged or committed recovery via reflog only covers commits, not working-tree edits.', bn: 'git reset --hard আনকমিটেড কাজ ও বাতিল কমিট স্থায়ীভাবে ধ্বংস করে। মুছে ফেলা অংশের আনডু নেই — reflog দিয়ে শুধু কমিট উদ্ধার হয়, ওয়ার্কিং-ট্রি এডিট নয়।' } },
      { level: 'caution', text: { en: 'Never --soft/--mixed/--hard a commit others have already pulled. Their history will diverge from yours.', bn: 'অন্যরা ইতিমধ্যে পুল করেছে এমন কমিটে --soft/--mixed/--hard করবেন না। তাদের হিস্ট্রি আপনার থেকে ডাইভার্জ করবে।' } },
    ],
    verify: [
      { en: 'git log no longer shows the commit; git status shows your files back as staged or modified.', bn: 'git log আর কমিট দেখায় না; git status ফাইলগুলো স্টেজড বা modified হিসেবে ফিরিয়ে দেখায়।' },
    ],
    diagram: {
      before: ['main → C1 → C2 (HEAD, the commit to undo)'],
      after: ['main → C1 (HEAD)', 'changes back in staging / working tree (except --hard)'],
      caption: { en: 'The pointer moves back; the fate of the changes is your choice.', bn: 'পয়েন্টার পিছোয়; পরিবর্তনের ভাগ্য আপনার পছন্দ।' },
    },
    commands: ['reset', 'status', 'log'],
    lessons: [L.commit, L.local],
    scenarios: ['wrong-branch', 'reset-hard', 'remove-file-from-commit'],
    tags: ['undo', 'reset', 'revert', 'amend', 'soft mixed hard'],
    searchKeywords: ['undo commit', 'undo last commit', 'revert commit', 'uncommit', 'remove last commit', 'fix commit message', 'amend'],
    safeForBeginners: true,
    popular: true,
    order: 3,
  },
  {
    id: 'git.troubleshooting.deleted-changes',
    slug: 'deleted-changes',
    title: { en: 'I accidentally deleted my changes', bn: 'ভুলে আমার পরিবর্তন মুছে ফেলেছি' },
    shortDescription: {
      en: 'Recovery depends on where the changes lived: staged, committed, or never saved. Git cannot always help — honesty first.',
      bn: 'রিকভারি নির্ভর করে পরিবর্তন কোথায় ছিল: স্টেজড, কমিটেড, নাকি কখনো সেভ হয়নি। গিট সবসময় সাহায্য করতে পারে না — আগে সৎ থাকি।',
    },
    category: 'working-tree',
    difficulty: 'intermediate',
    severity: 'high',
    symptoms: [
      { en: 'Your edits are gone after a restore, checkout, or reset — or a file was deleted.', bn: 'restore, checkout বা reset-এর পর এডিট উধাও — বা ফাইল মুছে গেছে।' },
    ],
    sightings: [
      { command: 'git status', output: 'nothing to commit, working tree clean' },
    ],
    diagnosis: {
      en: 'Git only protects what it has snapshotted. Staged content lives in the index, committed content lives in history — both recoverable. Changes that were never staged or committed existed only on your disk, and Git has no copy to give back.',
      bn: 'গিট শুধু স্ন্যাপশট নেওয়া জিনিস রক্ষা করে। স্টেজড কনটেন্ট ইনডেক্সে, কমিটেড কনটেন্ট হিস্ট্রিতে থাকে — দুটোই উদ্ধারযোগ্য। কখনো স্টেজ বা কমিট না হওয়া পরিবর্তন শুধু ডিস্কে ছিল, ফেরত দেওয়ার মতো কপি গিটের নেই।',
    },
    likelyCauses: [
      { en: 'git restore / git checkout -- <file> discarding edits.', bn: 'git restore / git checkout -- <file> দিয়ে এডিট বাতিল।' },
      { en: 'git reset --hard or git clean removing work.', bn: 'git reset --hard বা git clean দিয়ে কাজ মুছে ফেলা।' },
      { en: 'Deleting a file that was never committed.', bn: 'কখনো কমিট না হওয়া ফাইল মুছে ফেলা।' },
    ],
    checks: [
      { label: { en: 'Is anything still staged?', bn: 'কিছু এখনো স্টেজড আছে কি?' }, command: 'git status' },
      { label: { en: 'Did a previous commit contain the work?', bn: 'আগের কোনো কমিটে কাজটি ছিল কি?' }, command: 'git log --oneline -n 5' },
    ],
    fix: {
      title: { en: 'Recover from the newest snapshot Git has', bn: 'গিটের সবচেয়ে নতুন স্ন্যাপশট থেকে উদ্ধার করুন' },
      steps: [
        { en: 'If the file was staged, restore the staged copy back into the working tree.', bn: 'ফাইল স্টেজড থাকলে স্টেজড কপি ওয়ার্কিং ট্রিতে ফিরিয়ে আনুন।' },
        { en: 'If it was committed before, restore that committed version (you will redo only the newest edits).', bn: 'আগে কমিট হয়ে থাকলে কমিটেড সংস্করণ ফিরিয়ে আনুন (শুধু নতুন এডিট আবার করবেন)।' },
        { en: 'If it was never staged or committed, check your editor or IDE local history, backups, and the OS trash — Git itself has nothing to restore.', bn: 'কখনো স্টেজ বা কমিট না হলে এডিটর/IDE লোকাল হিস্ট্রি, ব্যাকআপ ও OS ট্র্যাশ দেখুন — গিটের কাছে ফেরানোর কিছু নেই।' },
      ],
      commands: ['git restore --source=:0 -- app.js', 'git restore --source=HEAD~1 -- app.js', 'git status'],
    },
    alternatives: [
      {
        title: { en: 'Recover a deleted-but-committed file', bn: 'মুছে ফেলা কিন্তু কমিটেড ফাইল উদ্ধার' },
        detail: {
          en: 'If the file existed in HEAD, checking it out of history brings it back as a new working-tree change you can keep.',
          bn: 'ফাইল HEAD-এ থাকলে হিস্ট্রি থেকে চেকআউট করলে নতুন ওয়ার্কিং-ট্রি পরিবর্তন হিসেবে ফিরে আসে যা রেখে দিতে পারেন।',
        },
        commands: ['git restore --source=HEAD -- deleted-file.txt'],
      },
    ],
    warnings: [
      { level: 'caution', text: { en: 'Stop writing new commits or resets until you finish recovering — every new operation can narrow your options.', bn: 'উদ্ধার শেষ না হওয়া পর্যন্ত নতুন কমিট বা রিসেট বন্ধ রাখুন — প্রতিটি নতুন অপারেশন বিকল্প সংকুচিত করতে পারে।' } },
    ],
    verify: [
      { en: 'The file is back on disk; git status shows it as modified or untracked.', bn: 'ফাইল ডিস্কে ফিরেছে; git status modified বা untracked দেখায়।' },
    ],
    commands: ['restore', 'status', 'diff', 'log'],
    lessons: [L.workingDirectory, L.stagingArea],
    scenarios: ['staged-file', 'reset-hard', 'recover-commit'],
    tags: ['deleted', 'lost changes', 'restore', 'recover file'],
    searchKeywords: ['deleted my changes', 'lost changes', 'recover deleted file', 'restore file', 'accidentally deleted', 'discarded changes'],
    safeForBeginners: false,
    order: 4,
  },
  {
    id: 'git.troubleshooting.merge-conflict',
    slug: 'merge-conflict',
    title: { en: 'How do I resolve a merge conflict?', bn: 'মার্জ কনফ্লিক্ট কীভাবে সমাধান করব?' },
    shortDescription: {
      en: 'A conflict is Git asking for a human decision. Read the markers, choose the right code, mark resolved, finish the merge.',
      bn: 'কনফ্লিক্ট মানে গিট মানুষের সিদ্ধান্ত চায়। মার্কার পড়ুন, সঠিক কোড বেছে নিন, resolved চিহ্নিত করে মার্জ শেষ করুন।',
    },
    category: 'merge-conflicts',
    difficulty: 'intermediate',
    severity: 'medium',
    symptoms: [
      { en: 'Merge stops with "CONFLICT (content): Merge conflict in <file>".', bn: 'মার্জ "CONFLICT (content): Merge conflict in <file>" বলে থেমে যায়।' },
      { en: 'Conflicted files contain <<<<<<<, =======, >>>>>>> markers.', bn: 'কনফ্লিক্টেড ফাইলে <<<<<<<, =======, >>>>>>> মার্কার থাকে।' },
    ],
    sightings: [
      { command: 'git merge feature', output: 'Auto-merging app.js\nCONFLICT (content): Merge conflict in app.js\nAutomatic merge failed; fix conflicts and then commit the result.' },
    ],
    diagnosis: {
      en: 'Both branches changed the same lines since their common ancestor, so no algorithm can safely choose. Git pauses mid-merge, marks both versions in the file, and waits for you — the merge is unfinished, nothing is broken yet.',
      bn: 'কমন অ্যানসেস্টরের পর উভয় ব্রাঞ্চ একই লাইন বদলেছে, তাই কোনো অ্যালগরিদম নিরাপদে বেছে নিতে পারে না। গিট মার্জের মাঝে থেমে ফাইলে দুটি সংস্করণ চিহ্নিত করে আপনার অপেক্ষা করে — মার্জ অসমাপ্ত, এখনো কিছু ভাঙেনি।',
    },
    likelyCauses: [
      { en: 'Two branches edited the same hunk of the same file.', bn: 'দুটি ব্রাঞ্চ একই ফাইলের একই অংশ এডিট করেছে।' },
      { en: 'One side deleted a file the other side modified.', bn: 'এক পক্ষ ফাইল মুছেছে, অন্য পক্ষ পরিবর্তন করেছে।' },
    ],
    checks: [
      { label: { en: 'List exactly which files need decisions.', bn: 'ঠিক কোন ফাইলে সিদ্ধান্ত দরকার দেখুন।' }, command: 'git status' },
      { label: { en: 'See both versions side by side.', bn: 'দুটি সংস্করণ পাশাপাশি দেখুন।' }, command: 'git diff' },
    ],
    fix: {
      title: { en: 'Resolve, mark, and finish', bn: 'সমাধান, চিহ্নিতকরণ ও সমাপ্তি' },
      steps: [
        { en: 'Open each conflicted file. Between <<<<<<< HEAD and ======= is your branch; between ======= and >>>>>>> is the incoming branch.', bn: 'প্রতিটি কনফ্লিক্টেড ফাইল খুলুন। <<<<<<< HEAD ও ======= এর মাঝে আপনার ব্রাঞ্চ; ======= ও >>>>>>> এর মাঝে আগত ব্রাঞ্চ।' },
        { en: 'Edit the file into the correct final code and delete all marker lines.', bn: 'ফাইল এডিট করে সঠিক চূড়ান্ত কোড বানান এবং সব মার্কার লাইন মুছুন।' },
        { en: 'Stage each resolved file — staging is how you tell Git "this one is decided".', bn: 'প্রতিটি সমাধানকৃত ফাইল স্টেজ করুন — স্টেজিংই গিটকে বলে "এটা সিদ্ধান্ত হয়েছে"।' },
        { en: 'Complete the merge commit and review the result with git log.', bn: 'মার্জ কমিট সম্পন্ন করে git log দিয়ে ফল পর্যালোচনা করুন।' },
      ],
      commands: ['git status', 'git add app.js', 'git commit', 'git log --oneline --graph -n 3'],
    },
    alternatives: [
      {
        title: { en: 'Bail out cleanly with --abort', bn: '--abort দিয়ে পরিষ্কারভাবে বেরিয়ে আসুন' },
        detail: {
          en: 'If the conflict is bigger than expected, git merge --abort cancels the whole merge and returns your branch to its pre-merge state. Nothing is half-merged afterwards.',
          bn: 'কনফ্লিক্ট প্রত্যাশার বড় হলে git merge --abort পুরো মার্জ বাতিল করে ব্রাঞ্চকে প্রি-মার্জ অবস্থায় ফেরায়। পরে কিছু অর্ধ-মার্জড থাকে না।',
        },
        commands: ['git merge --abort', 'git status'],
      },
    ],
    warnings: [
      { level: 'caution', text: { en: 'Never commit a file that still contains <<<<<<< markers — search for them before staging.', bn: '<<<<<<< মার্কারসহ ফাইল কখনো কমিট করবেন না — স্টেজের আগে খুঁজে দেখুন।' } },
    ],
    verify: [
      { en: 'git status is clean and git log shows a merge commit with two parents.', bn: 'git status পরিষ্কার এবং git log দুই প্যারেন্টের মার্জ কমিট দেখায়।' },
    ],
    commands: ['merge', 'status', 'add', 'commit', 'log'],
    lessons: [L.branch, 'github.team.resolve-collaboration-conflicts'],
    scenarios: ['rebase-conflict', 'pull-conflict', 'diverged'],
    simulator: { scenario: 'merge' },
    tags: ['merge', 'conflict', 'markers', 'abort'],
    searchKeywords: ['merge conflict', 'conflict markers', 'automatic merge failed', 'resolve conflict', 'both modified', 'merge abort'],
    safeForBeginners: true,
    popular: true,
    order: 5,
  },
  {
    id: 'git.troubleshooting.rebase-conflict',
    slug: 'rebase-conflict',
    title: { en: 'The rebase stopped with a conflict — now what?', bn: 'রিবেস কনফ্লিক্টে থেমে গেছে — এখন কী?' },
    shortDescription: {
      en: 'Rebase replays commits one by one, so you resolve the same way as a merge — then continue the replay instead of committing.',
      bn: 'রিবেস কমিট একে একে রিপ্লে করে, তাই মার্জের মতোই সমাধান — তবে কমিট না করে রিপ্লে চালিয়ে যান।',
    },
    category: 'rebase-conflicts',
    difficulty: 'advanced',
    severity: 'medium',
    symptoms: [
      { en: 'Rebase halts: "error: could not apply <commit>... Resolve all conflicts manually, mark them as resolved...".', bn: 'রিবেস থামে: "error: could not apply <commit>... Resolve all conflicts manually..."।' },
      { en: 'git status says "rebase in progress" and you are mid-replay.', bn: 'git status বলে "rebase in progress" এবং আপনি রিপ্লের মাঝে আছেন।' },
    ],
    sightings: [
      { command: 'git rebase main', output: 'Auto-merging app.js\nCONFLICT (content): Merge conflict in app.js\nerror: could not apply f1e2d3c... Add dark mode\nResolve all conflicts manually, mark them as resolved with "git add", then run "git rebase --continue".' },
    ],
    diagnosis: {
      en: 'Unlike merge (one join), rebase replays each of your commits onto the new base, and any single replay can conflict. The key difference: you must NOT run git commit — the replayed commit already exists conceptually. You resolve, stage, and continue the replay.',
      bn: 'মার্জের (একটি যুক্তি) বিপরীতে রিবেস আপনার প্রতিটি কমিট নতুন বেসে রিপ্লে করে, এবং যেকোনো রিপ্লেতে কনফ্লিক্ট হতে পারে। মূল পার্থক্য: git commit চালাবেন না — রিপ্লে হওয়া কমিট ধারণাগতভাবে আছেই। সমাধান, স্টেজ, রিপ্লে চালিয়ে যান।',
    },
    likelyCauses: [
      { en: 'The base branch changed the same lines your replayed commits touch.', bn: 'বেস ব্রাঞ্চ সেই লাইন বদলেছে যা রিপ্লে হওয়া কমিট ছোঁয়।' },
    ],
    checks: [
      { label: { en: 'Confirm you are mid-rebase and see conflicted files.', bn: 'নিশ্চিত হোন রিবেসের মাঝে আছেন ও কনফ্লিক্টেড ফাইল দেখছেন।' }, command: 'git status' },
    ],
    fix: {
      title: { en: 'Resolve and continue the replay', bn: 'সমাধান করে রিপ্লে চালিয়ে যান' },
      steps: [
        { en: 'Resolve the markers exactly like a merge conflict.', bn: 'মার্জ কনফ্লিক্টের মতোই মার্কার সমাধান করুন।' },
        { en: 'Stage the resolved files with git add (do not commit).', bn: 'সমাধানকৃত ফাইল git add দিয়ে স্টেজ করুন (কমিট নয়)।' },
        { en: 'Continue the replay. Repeat resolve → add → continue for every stopped commit.', bn: 'রিপ্লে চালিয়ে যান। থামা প্রতিটি কমিটে সমাধান → add → continue পুনরাবৃত্তি করুন।' },
      ],
      commands: ['git add app.js', 'git rebase --continue', 'git log --oneline --graph -n 4'],
    },
    alternatives: [
      {
        title: { en: 'Abort back to safety', bn: 'নিরাপদে বাতিল করে ফিরুন' },
        detail: {
          en: 'git rebase --abort cancels the entire replay and restores your branch exactly as before the rebase. Use it freely when the conflict chain feels too deep.',
          bn: 'git rebase --abort পুরো রিপ্লে বাতিল করে ব্রাঞ্চকে রিবেসের আগের মতো ফিরিয়ে দেয়। কনফ্লিক্ট শৃঙ্খল গভীর মনে হলে নির্দ্বিধায় ব্যবহার করুন।',
        },
        commands: ['git rebase --abort', 'git status'],
      },
    ],
    warnings: [
      { level: 'caution', text: { en: 'Do not run git commit during a conflicted rebase — it creates a stray commit inside the replay. Stage and continue instead.', bn: 'কনফ্লিক্টেড রিবেস চলাকালে git commit চালাবেন না — রিপ্লের ভেতরে ভ্রান্ত কমিট তৈরি হয়। বরং স্টেজ করে continue করুন।' } },
      { level: 'caution', text: { en: 'Rebase rewrites the replayed commits. If they were already pushed and shared, prefer merging instead.', bn: 'রিবেস রিপ্লে হওয়া কমিট পুনর্লিখন করে। পুশ করা শেয়ার্ড হলে বরং মার্জ করুন।' } },
    ],
    verify: [
      { en: 'Rebase finishes ("Successfully rebased") and git log shows a linear history.', bn: 'রিবেস শেষ হয় ("Successfully rebased") এবং git log লিনিয়ার হিস্ট্রি দেখায়।' },
    ],
    commands: ['rebase', 'status', 'add', 'log'],
    lessons: [L.branch, 'git.internals.rebase-rewrites-history', 'git.internals.dag-structure'],
    scenarios: ['merge-conflict', 'diverged', 'force-push'],
    simulator: { scenario: 'rebase' },
    tags: ['rebase', 'conflict', 'continue', 'abort', 'replay'],
    searchKeywords: ['rebase conflict', 'could not apply', 'rebase continue', 'rebase abort', 'rebase in progress', 'rebase stopped'],
    safeForBeginners: false,
    order: 6,
  },
  {
    id: 'git.troubleshooting.detached-head',
    slug: 'detached-head',
    title: { en: 'Why am I in detached HEAD?', bn: 'ডিটাচড HEAD-এ কেন আছি?' },
    shortDescription: {
      en: 'HEAD is pointing at a commit instead of a branch. Nothing is broken — but new commits here have no branch to keep them.',
      bn: 'HEAD ব্রাঞ্চের বদলে কমিটকে নির্দেশ করছে। কিছু ভাঙেনি — তবে এখানে নতুন কমিট রাখার ব্রাঞ্চ নেই।',
    },
    category: 'detached-head',
    difficulty: 'beginner',
    severity: 'low',
    symptoms: [
      { en: 'Git prints "You are in detached HEAD state" after checkout.', bn: 'checkout-এর পর গিট "You are in detached HEAD state" দেখায়।' },
      { en: 'git status shows "HEAD detached at <commit>" instead of a branch name.', bn: 'git status ব্রাঞ্চ নামের বদলে "HEAD detached at <commit>" দেখায়।' },
    ],
    sightings: [
      { command: 'git checkout a1b2c3d', output: 'Note: switching to \'a1b2c3d\'.\nYou are in \'detached HEAD\' state...' },
    ],
    diagnosis: {
      en: 'Normally HEAD points to a branch, which points to a commit. Checking out a raw commit hash points HEAD directly at the commit — detached from any branch. You can look around safely, but commits made here belong to no branch and are easy to lose when you switch away.',
      bn: 'সাধারণত HEAD ব্রাঞ্চকে, ব্রাঞ্চ কমিটকে নির্দেশ করে। কাঁচা কমিট হ্যাশ চেকআউট করলে HEAD সরাসরি কমিটে যায় — কোনো ব্রাঞ্চ থেকে বিচ্ছিন্ন। নিরাপদে ঘুরে দেখতে পারেন, তবে এখানে করা কমিট কোনো ব্রাঞ্চের নয় এবং সরে গেলে হারানো সহজ।',
    },
    likelyCauses: [
      { en: 'Checking out a commit hash, tag, or remote-tracking ref directly.', bn: 'সরাসরি কমিট হ্যাশ, ট্যাগ বা রিমোট-ট্র্যাকিং রেফ চেকআউট।' },
    ],
    checks: [
      { label: { en: 'See where HEAD is.', bn: 'HEAD কোথায় দেখুন।' }, command: 'git status' },
      { label: { en: 'See if you made commits while detached.', bn: 'ডিটাচড অবস্থায় কমিট করেছেন কিনা দেখুন।' }, command: 'git log --oneline -n 3' },
    ],
    fix: {
      title: { en: 'Keep your work, then go home', bn: 'কাজ রেখে ঘরে ফিরুন' },
      steps: [
        { en: 'If you made commits worth keeping, create a branch right here — the branch pointer preserves them instantly.', bn: 'রাখার মতো কমিট করলে ঠিক এখানে ব্রাঞ্চ তৈরি করুন — ব্রাঞ্চ পয়েন্টার তাৎক্ষণিক সংরক্ষণ করে।' },
        { en: 'If you made no commits, simply switch back to your branch. Nothing is lost.', bn: 'কমিট না করলে শুধু ব্রাঞ্চে ফিরে যান। কিছু হারায় না।' },
      ],
      commands: ['git switch -c recovery-branch', 'git switch main', 'git log --oneline -n 3'],
    },
    alternatives: [],
    warnings: [],
    verify: [
      { en: 'git status shows "On branch <name>" again.', bn: 'git status আবার "On branch <name>" দেখায়।' },
    ],
    commands: ['switch', 'checkout', 'log', 'branch', 'status'],
    lessons: [L.head, L.branch, 'git.internals.head-deep-dive'],
    scenarios: ['recover-commit', 'deleted-branch'],
    simulator: { scenario: 'merge' },
    tags: ['detached head', 'checkout', 'head', 'branch'],
    searchKeywords: ['detached head', 'detached HEAD state', 'head detached', 'checkout commit', 'not on any branch'],
    safeForBeginners: true,
    popular: true,
    order: 7,
  },
  {
    id: 'git.troubleshooting.push-rejected',
    slug: 'push-rejected',
    title: { en: 'Why was my push rejected?', bn: 'পুশ কেন প্রত্যাখ্যাত হলো?' },
    shortDescription: {
      en: 'The remote moved while you worked. Fetch first, look at what is new, then integrate — never force by default.',
      bn: 'আপনি কাজ করার সময় রিমোট এগিয়েছে। আগে fetch করুন, নতুন কী দেখুন, তারপর একীভূত করুন — ডিফল্টে কখনো ফোর্স নয়।',
    },
    category: 'remote-push',
    difficulty: 'beginner',
    severity: 'medium',
    symptoms: [
      { en: 'Push fails with "[rejected] ... non-fast-forward" or "fetch first".', bn: 'পুশ "[rejected] ... non-fast-forward" বা "fetch first" বলে ব্যর্থ হয়।' },
    ],
    sightings: [
      { command: 'git push origin main', output: '! [rejected] main -> main (non-fast-forward)\nerror: failed to push some refs\nhint: Updates were rejected because the remote contains work that you do not have locally.' },
    ],
    diagnosis: {
      en: 'Push only moves the remote pointer forward. Someone else pushed commits you lack, so accepting yours would orphan theirs. Git refuses rather than destroy work — the rejection is protection, not a bug.',
      bn: 'Push রিমোট পয়েন্টার শুধু এগিয়ে নেয়। অন্য কেউ আপনার নেই এমন কমিট পুশ করেছে, তাই আপনারটা নিলে তাদেরটা এতিম হবে। গিট কাজ ধ্বংস না করে প্রত্যাখ্যান করে — প্রত্যাখ্যান সুরক্ষা, বাগ নয়।',
    },
    likelyCauses: [
      { en: 'A teammate pushed to the same branch before you did.', bn: 'আপনার আগে সহকর্মী একই ব্রাঞ্চে পুশ করেছে।' },
      { en: 'Commits were pushed from another of your machines.', bn: 'আপনার অন্য মেশিন থেকে কমিট পুশ হয়েছে।' },
    ],
    checks: [
      { label: { en: 'Download the remote state without touching your work.', bn: 'কাজ না ছুঁয়ে রিমোট অবস্থা ডাউনলোড করুন।' }, command: 'git fetch' },
      { label: { en: 'See exactly which commits you are missing.', bn: 'ঠিক কোন কমিট আপনার নেই দেখুন।' }, command: 'git log HEAD..origin/main --oneline' },
    ],
    fix: {
      title: { en: 'Fetch, review, then integrate', bn: 'Fetch, পর্যালোচনা, তারপর একীভূত' },
      steps: [
        { en: 'Fetch to update your remote-tracking refs (safe, changes nothing of yours).', bn: 'রিমোট-ট্র্যাকিং রেফ আপডেটে fetch করুন (নিরাপদ, আপনার কিছু বদলায় না)।' },
        { en: 'Read the missing commits. If they are simple and yours is too, integrate with rebase for a linear story...', bn: 'অনুপস্থিত কমিট পড়ুন। দুটোই সরল হলে লিনিয়ার গল্পে rebase দিয়ে একীভূত করুন...' },
        { en: '...or merge if you want the join recorded. Then push again — it will fast-forward now.', bn: '...অথবা যুক্তি রেকর্ড চাইলে মার্জ করুন। তারপর আবার পুশ করুন — এবার ফাস্ট-ফরোয়ার্ড হবে।' },
      ],
      commands: ['git fetch', 'git log HEAD..origin/main --oneline', 'git pull --rebase', 'git push'],
    },
    alternatives: [
      {
        title: { en: 'Merge instead of rebase', bn: 'রিবেসের বদলে মার্জ' },
        detail: {
          en: 'If your branch is shared or long-lived, git pull (merge) records the integration explicitly instead of rewriting your commits. Both are legitimate — pick per team convention.',
          bn: 'ব্রাঞ্চ শেয়ার্ড বা দীর্ঘজীবী হলে git pull (merge) একীভূতকরণ স্পষ্ট রেকর্ড করে, কমিট পুনর্লিখন না করে। দুটোই বৈধ — টিম কনভেনশনে বেছে নিন।',
        },
        commands: ['git pull', 'git push'],
      },
    ],
    warnings: [
      { level: 'danger', text: { en: 'Do not "fix" a rejection with git push --force. It would erase your teammates’ commits from the remote. Force has its own dedicated warning scenario — read it before ever typing it.', bn: 'প্রত্যাখ্যান git push --force দিয়ে "ঠিক" করবেন না। এতে সহকর্মীদের কমিট রিমোট থেকে মুছে যাবে। ফোর্সের আলাদা সতর্কতা দৃশ্যপট আছে — টাইপের আগে পড়ুন।' } },
    ],
    verify: [
      { en: 'Push succeeds and git status says up to date with origin.', bn: 'পুশ সফল হয় এবং git status origin-এর সাথে আপ টু ডেট বলে।' },
    ],
    commands: ['push', 'fetch', 'pull', 'status', 'log'],
    lessons: [L.remote, 'github.repositories.push-to-github', 'github.team.sync-before-work'],
    scenarios: ['behind-remote', 'diverged', 'force-push'],
    simulator: { scenario: 'fetch-pull' },
    tags: ['push', 'rejected', 'non-fast-forward', 'fetch first', 'remote'],
    searchKeywords: ['push rejected', 'non-fast-forward', 'fetch first', 'failed to push', 'rejected main', 'updates were rejected'],
    safeForBeginners: true,
    popular: true,
    order: 8,
  },
  {
    id: 'git.troubleshooting.force-push',
    slug: 'force-push',
    title: { en: 'Force push: what it destroys and the safer way', bn: 'ফোর্স পুশ: কী ধ্বংস করে ও নিরাপদ উপায়' },
    shortDescription: {
      en: 'Force push overwrites remote history. Understand exactly what you erase — then prefer --force-with-lease on private branches only.',
      bn: 'ফোর্স পুশ রিমোট হিস্ট্রি ওভাররাইট করে। ঠিক কী মুছছেন বুঝুন — তারপর শুধু ব্যক্তিগত ব্রাঞ্চে --force-with-lease ব্যবহার করুন।',
    },
    category: 'remote-push',
    difficulty: 'advanced',
    severity: 'critical',
    symptoms: [
      { en: 'You are tempted to push after a rebase or reset and normal push is rejected.', bn: 'রিবেস বা রিসেটের পর পুশ করতে চান কিন্তু স্বাভাবিক পুশ প্রত্যাখ্যাত।' },
    ],
    sightings: [
      { command: 'git push origin feature', output: '! [rejected] feature -> feature (non-fast-forward)' },
    ],
    diagnosis: {
      en: 'A normal push only fast-forwards the remote. --force removes that guard: the remote branch is set to your tip no matter who else pushed. Commits only on the remote become unreachable — for everyone, not just you.',
      bn: 'স্বাভাবিক পুশ রিমোটকে শুধু ফাস্ট-ফরোয়ার্ড করে। --force সেই পাহারা সরায়: অন্য কে পুশ করুক, রিমোট ব্রাঞ্চ আপনার টিপে বসে। শুধু রিমোটে থাকা কমিট অপ্রাপ্য হয় — শুধু আপনার নয়, সবার জন্য।',
    },
    likelyCauses: [
      { en: 'Rebasing or amending commits that were already pushed.', bn: 'পুশ করা কমিটে রিবেস বা amend।' },
    ],
    checks: [
      { label: { en: 'See who else is on this branch before even thinking about force.', bn: 'ফোর্স ভাবার আগেই দেখুন ব্রাঞ্চে আর কে আছে।' }, command: 'git log HEAD..origin/feature --oneline' },
      { label: { en: 'Confirm the branch is yours alone (no shared base, no open PRs from others).', bn: 'নিশ্চিত হোন ব্রাঞ্চ শুধু আপনার (শেয়ার্ড বেস নেই, অন্যের খোলা PR নেই)।' }, command: 'git status' },
    ],
    fix: {
      title: { en: 'The deliberately careful way', bn: 'সচেতন সতর্ক উপায়' },
      steps: [
        { en: 'Prefer avoiding force entirely: merge instead of rebasing shared work.', bn: 'ফোর্স পুরো এড়ানোই শ্রেয়: শেয়ার্ড কাজে রিবেস না করে মার্জ করুন।' },
        { en: 'If the branch is truly private, use --force-with-lease: it aborts when someone else pushed since your last fetch, instead of silently erasing them.', bn: 'ব্রাঞ্চ সত্যিই ব্যক্তিগত হলে --force-with-lease ব্যবহার করুন: শেষ fetch-এর পর কেউ পুশ করলে চুপচাপ মোছার বদলে বাতিল করে।' },
        { en: 'Tell your collaborators immediately after rewriting anything they might have pulled.', bn: 'তারা পুল করে থাকতে পারে এমন কিছু পুনর্লিখনের পর সহকর্মীদের সাথে সাথে জানান।' },
      ],
      commands: ['git push --force-with-lease origin feature'],
    },
    alternatives: [],
    warnings: [
      { level: 'danger', text: { en: 'git push --force on a shared branch (main, develop, any team branch) can permanently strand your teammates’ work. Treat it as a last resort requiring explicit team agreement — never as a shortcut past a rejection.', bn: 'শেয়ার্ড ব্রাঞ্চে (main, develop, যেকোনো টিম ব্রাঞ্চ) git push --force সহকর্মীদের কাজ স্থায়ীভাবে ভাসিয়ে দিতে পারে। স্পষ্ট টিম সম্মতি ছাড়া শেষ উপায় হিসেবে দেখুন — প্রত্যাখ্যান এড়ানোর শর্টকাট হিসেবে কখনো নয়।' } },
      { level: 'caution', text: { en: '--force-with-lease is safer, not safe: it still rewrites history, only refusing when it detects newer remote work.', bn: '--force-with-lease নিরাপদতর, নিরাপদ নয়: এটি হিস্ট্রি পুনর্লিখন করেই, শুধু নতুন রিমোট কাজ শনাক্তে প্রত্যাখ্যান করে।' } },
    ],
    verify: [
      { en: 'The remote tip matches your local tip and every teammate confirms they re-synced.', bn: 'রিমোট টিপ লোকাল টিপের সাথে মেলে এবং প্রতিটি সহকর্মী পুনরায় সিঙ্ক নিশ্চিত করে।' },
    ],
    commands: ['push', 'fetch', 'log'],
    lessons: [L.remote],
    scenarios: ['push-rejected', 'diverged', 'rebase-conflict'],
    tags: ['force push', 'force-with-lease', 'rewrite history', 'danger'],
    searchKeywords: ['force push', 'force-with-lease', 'push force', 'overwrite remote', 'push rejected force'],
    safeForBeginners: false,
    order: 9,
  },
  {
    id: 'git.troubleshooting.nothing-to-commit',
    slug: 'nothing-to-commit',
    title: { en: 'Git says "nothing to commit" — but I changed things?', bn: 'গিট বলে "nothing to commit" — কিন্তু আমি তো বদলেছি?' },
    shortDescription: {
      en: 'Five usual suspects: no real change, ignored files, already committed, wrong folder, or identical content.',
      bn: 'পাঁচ সন্দেহভাজন: বাস্তব পরিবর্তন নেই, ignored ফাইল, ইতিমধ্যে কমিটেড, ভুল ফোল্ডার, বা অভিন্ন কনটেন্ট।',
    },
    category: 'working-tree',
    difficulty: 'beginner',
    severity: 'low',
    symptoms: [
      { en: 'git status reports a clean tree although you expected modifications.', bn: 'পরিবর্তন আশা করলেও git status পরিষ্কার ট্রি জানায়।' },
    ],
    sightings: [
      { command: 'git status', output: 'On branch main\nnothing to commit, working tree clean' },
    ],
    diagnosis: {
      en: 'Git compares content, not your memory of editing. A clean status means the working tree truly matches HEAD — or Git is looking somewhere else (different directory, ignored file, or an already-committed change).',
      bn: 'গিট আপনার এডিটের স্মৃতি নয়, কনটেন্ট তুলনা করে। পরিষ্কার status মানে ওয়ার্কিং ট্রি সত্যিই HEAD-এর সাথে মেলে — অথবা গিট অন্য কোথাও দেখছে (ভিন্ন ডিরেক্টরি, ignored ফাইল, বা ইতিমধ্যে কমিটেড পরিবর্তন)।',
    },
    likelyCauses: [
      { en: 'Edits were saved in a different folder, or never saved at all.', bn: 'এডিট ভিন্ন ফোল্ডারে সেভ হয়েছে, বা আদৌ সেভ হয়নি।' },
      { en: 'The file is ignored by .gitignore.', bn: 'ফাইল .gitignore দ্বারা ignored।' },
      { en: 'The change is already committed, or the file content is byte-identical.', bn: 'পরিবর্তন ইতিমধ্যে কমিটেড, বা ফাইল কনটেন্ট বাইট-অভিন্ন।' },
    ],
    checks: [
      { label: { en: 'Confirm branch and cleanliness.', bn: 'ব্রাঞ্চ ও পরিষ্কারতা নিশ্চিত করুন।' }, command: 'git status' },
      { label: { en: 'Look for unstaged and staged diffs explicitly.', bn: 'আনস্টেজড ও স্টেজড diff স্পষ্ট দেখুন।' }, command: 'git diff' },
      { label: { en: 'Check staged diff too — your change may already be staged.', bn: 'স্টেজড diff-ও দেখুন — পরিবর্তন ইতিমধ্যে স্টেজড হতে পারে।' }, command: 'git diff --staged' },
      { label: { en: 'Ask Git whether the file is ignored.', bn: 'গিটকে জিজ্ঞেস করুন ফাইল ignored কিনা।' }, command: 'git check-ignore -v config.local.js' },
    ],
    fix: {
      title: { en: 'Find where your change actually went', bn: 'পরিবর্তন আসলে কোথায় গেল খুঁজুন' },
      steps: [
        { en: 'Verify you saved the file and are in the right repository directory.', bn: 'যাচাই করুন ফাইল সেভ হয়েছে এবং সঠিক রিপোজিটরি ডিরেক্টরিতে আছেন।' },
        { en: 'If ignored, decide deliberately: edit .gitignore, or force-add only if the file truly belongs in history.', bn: 'ignored হলে সচেতন সিদ্ধান্ত নিন: .gitignore এডিট করুন, অথবা ফাইল সত্যিই হিস্ট্রিতে থাকার মতো হলে force-add করুন।' },
        { en: 'If already committed, find it in git log — there is nothing to commit because the work is done.', bn: 'ইতিমধ্যে কমিট হলে git log-এ খুঁজুন — কাজ শেষ বলে কমিটের কিছু নেই।' },
      ],
      commands: ['git log --oneline -n 5', 'git check-ignore -v config.local.js'],
    },
    alternatives: [],
    warnings: [
      { level: 'info', text: { en: '"Nothing to commit" is information, not an error. It is Git telling you the tree already matches — usually good news.', bn: '"Nothing to commit" তথ্য, এরর নয়। গিট বলছে ট্রি ইতিমধ্যে মিলে গেছে — সাধারণত সুখবর।' } },
    ],
    verify: [
      { en: 'You can point at the change: in the log, in the diff, or in .gitignore — mystery solved either way.', bn: 'পরিবর্তন দেখাতে পারেন: log-এ, diff-এ, বা .gitignore-এ — যেভাবেই রহস্য সমাধান।' },
    ],
    commands: ['status', 'diff', 'log'],
    lessons: [L.workingDirectory, L.stagingArea],
    scenarios: ['staged-file', 'deleted-changes'],
    tags: ['nothing to commit', 'clean tree', 'ignored', 'status'],
    searchKeywords: ['nothing to commit', 'working tree clean', 'changes not showing', 'gitignore', 'file ignored', 'already committed'],
    safeForBeginners: true,
    order: 10,
  },
];
