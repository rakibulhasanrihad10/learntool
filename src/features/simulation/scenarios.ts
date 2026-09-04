/**
 * Guided simulation scenarios (bilingual scripts + deterministic initial states).
 *
 * To add a new scenario (e.g. "git revert"): define an initial
 * GitSimulationState, append ScenarioSteps that dispatch existing SimActions
 * (extend the engine first if you need a new action), and register the scenario
 * in SIM_SCENARIOS. The WorkflowPlayer renders it with zero extra UI work.
 */
import { createEverydayInitial } from './engine';
import { GitSimulationState, LangText, SimScenario } from './models';

const txt = (en: string, bn: string): LangText => ({ en, bn });

const BASE_FILES: GitSimulationState['files'] = [
  { name: 'README.md', workStatus: 'clean', staged: false },
  { name: 'app.js', workStatus: 'clean', staged: false },
  { name: 'package.json', workStatus: 'clean', staged: false },
];

const files = () => BASE_FILES.map((f) => ({ ...f }));

/* ------------------------------------------------------------------ */
/* Scenario 1 — Everyday Git Workflow                                 */
/* ------------------------------------------------------------------ */

const everyday: SimScenario = {
  id: 'everyday',
  title: txt('Everyday Git Workflow', 'দৈনন্দিন গিট ওয়ার্কফ্লো'),
  subtitle: txt(
    'Status → edit → diff → add → commit → log → push. The loop you will run dozens of times a day.',
    'Status → এডিট → diff → add → commit → log → push। প্রতিদিন বহুবার চালানো চক্র।'
  ),
  intro: txt(
    'You are on branch main with a clean tree. Both local and remote agree on C1. Work through each step to publish one small change.',
    'আপনি main ব্রাঞ্চে পরিষ্কার ট্রি নিয়ে আছেন। লোকাল ও রিমোট উভয়ে C1-এ একমত। একটি ছোট পরিবর্তন প্রকাশ করতে প্রতিটি ধাপ অনুসরণ করুন।'
  ),
  initial: createEverydayInitial(),
  steps: [
    {
      id: 'everyday-status',
      title: txt('1. Check repository status', '১. রিপোজিটরির অবস্থা যাচাই করুন'),
      explanation: txt(
        'Before touching anything, confirm you are on the right branch with a clean tree. git status is read-only and always safe.',
        'কিছু ধরার আগে নিশ্চিত হোন সঠিক ব্রাঞ্চে ও পরিষ্কার ট্রিতে আছেন। git status শুধু পড়ে — সবসময় নিরাপদ।'
      ),
      command: 'git status',
      action: { type: 'status' },
      expectedResult: txt('A clean report: on main, up to date, nothing to commit.', 'পরিষ্কার রিপোর্ট: main-এ, আপ টু ডেট, কমিটের কিছু নেই।'),
      whyItMatters: txt('Every confident Git session starts with status. It answers: where am I, and is anything unfinished?', 'প্রতিটি আত্মবিশ্বাসী গিট সেশন status দিয়ে শুরু হয়। এটি বলে: আমি কোথায়, এবং কিছু অসমাপ্ত আছে কি?'),
      learnMoreLessonId: 'git.fundamentals.working-directory',
    },
    {
      id: 'everyday-modify',
      title: txt('2. Modify a file', '২. একটি ফাইল পরিবর্তন করুন'),
      explanation: txt(
        'You edit README.md in your editor. This happens outside Git — the file is now dirty, but nothing is staged or saved.',
        'এডিটরে README.md পরিবর্তন করলেন। এটি গিটের বাইরে ঘটে — ফাইল এখন নোংরা, কিন্তু কিছু স্টেজ বা সেভ হয়নি।'
      ),
      command: '# Edit README.md in your editor',
      action: { type: 'modify', file: 'README.md' },
      expectedResult: txt('README.md turns Modified in the Working Directory panel.', 'ওয়ার্কিং ডিরেক্টরি প্যানেলে README.md Modified হয়।'),
      whyItMatters: txt('Git tracks your edits without owning them. Until you stage, your work lives only on your disk.', 'গিট আপনার এডিট ট্র্যাক করে কিন্তু মালিকানা নেয় না। স্টেজ না করা পর্যন্ত কাজ শুধু আপনার ডিস্কে থাকে।'),
      learnMoreLessonId: 'git.fundamentals.working-directory',
    },
    {
      id: 'everyday-diff',
      title: txt('3. Inspect the changes', '৩. পরিবর্তন পর্যালোচনা করুন'),
      explanation: txt(
        'Review exactly what changed before staging. Professionals catch stray debug code here — never after committing.',
        'স্টেজ করার আগে ঠিক কী বদলেছে তা পর্যালোচনা করুন। পেশাদাররা এখানেই ভুল ডিবাগ কোড ধরেন — কমিটের পরে নয়।'
      ),
      command: 'git diff',
      action: { type: 'diff' },
      expectedResult: txt('A line-by-line diff of README.md appears in the terminal.', 'টার্মিনালে README.md-এর লাইন-বাই-লাইন diff দেখায়।'),
      whyItMatters: txt('Diff is your code review with yourself. Never stage what you have not read.', 'Diff আপনার নিজের সাথে কোড রিভিউ। না পড়ে কখনো স্টেজ করবেন না।'),
      learnMoreLessonId: 'git.fundamentals.staging-area',
    },
    {
      id: 'everyday-add',
      title: txt('4. Stage the change', '৪. পরিবর্তন স্টেজ করুন'),
      explanation: txt(
        'Move the reviewed change into the Staging Area. This curates — but does not yet save — the next commit.',
        'পর্যালোচিত পরিবর্তন স্টেজিং এরিয়ায় নিন। এটি পরবর্তী কমিট সাজায় — কিন্তু এখনো সেভ করে না।'
      ),
      command: 'git add README.md',
      action: { type: 'stage', files: ['README.md'] },
      expectedResult: txt('README.md moves from Working Directory to Staging Area.', 'README.md ওয়ার্কিং ডিরেক্টরি থেকে স্টেজিং এরিয়ায় যায়।'),
      whyItMatters: txt('Staging lets you split messy editing sessions into small, logical commits.', 'স্টেজিং অগোছালো এডিটিংকে ছোট, যৌক্তিক কমিটে ভাগ করতে দেয়।'),
      learnMoreLessonId: 'git.fundamentals.staging-area',
    },
    {
      id: 'everyday-commit',
      title: txt('5. Commit the change', '৫. পরিবর্তন কমিট করুন'),
      explanation: txt(
        'Freeze the staged snapshot into permanent local history with a clear imperative message.',
        'পরিষ্কার ইম্পারেটিভ মেসেজসহ স্টেজড স্ন্যাপশট স্থায়ী লোকাল হিস্ট্রিতে সংরক্ষণ করুন।'
      ),
      command: 'git commit -m "Update README"',
      action: { type: 'commit', message: 'Update README' },
      expectedResult: txt('Commit C2 appears on main; HEAD follows; staging empties.', 'main-এ C2 কমিট দেখায়; HEAD অনুসরণ করে; স্টেজিং খালি হয়।'),
      whyItMatters: txt('Commits are permanent checkpoints. Small atomic commits make bugs easy to find and undo.', 'কমিট স্থায়ী চেকপয়েন্ট। ছোট atomic কমিটে বাগ খোঁজা ও বাতিল সহজ হয়।'),
      learnMoreLessonId: 'git.fundamentals.commit',
    },
    {
      id: 'everyday-log',
      title: txt('6. Inspect history', '৬. হিস্ট্রি পর্যালোচনা করুন'),
      explanation: txt(
        'Verify your new commit sits cleanly on top of main before sharing it with anyone.',
        'কারো সাথে শেয়ার করার আগে যাচাই করুন নতুন কমিট main-এর শীর্ষে পরিষ্কারভাবে বসেছে।'
      ),
      command: 'git log --oneline -n 3',
      action: { type: 'log' },
      expectedResult: txt('C2 (HEAD, main) listed above C1.', 'C1-এর ওপরে C2 (HEAD, main) তালিকাভুক্ত।'),
      whyItMatters: txt('Reading history before pushing catches mistakes while they are still private.', 'পুশের আগে হিস্ট্রি পড়লে ভুল ধরা পড়ে যখন তা এখনো ব্যক্তিগত।'),
      learnMoreLessonId: 'git.fundamentals.local-repository',
    },
    {
      id: 'everyday-push',
      title: txt('7. Push to remote', '৭. রিমোটে পুশ করুন'),
      explanation: txt(
        'Upload C2 so the server — and your teammates — see exactly what you see.',
        'C2 আপলোড করুন যাতে সার্ভার — ও সহকর্মীরা — ঠিক যা দেখেন আপনিও তাই দেখেন।'
      ),
      command: 'git push origin main',
      action: { type: 'push' },
      expectedResult: txt('Remote main advances to C2; local and remote match again.', 'রিমোট main C2-তে এগোয়; লোকাল ও রিমোট আবার মিলে যায়।'),
      whyItMatters: txt('Unpushed commits exist on one laptop. Pushed commits are backed up and reviewable.', 'আনপুশড কমিট এক ল্যাপটপে থাকে। পুশড কমিট ব্যাকআপ ও রিভিউযোগ্য।'),
      learnMoreLessonId: 'git.fundamentals.remote-repository',
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Scenario 2 — Merge                                                */
/* ------------------------------------------------------------------ */

const mergeInitial: GitSimulationState = {
  files: files(),
  commits: [
    { id: 'C1', message: 'Initial commit', parents: [] },
    { id: 'C2', message: 'Setup project', parents: ['C1'] },
    { id: 'C3', message: 'Add homepage', parents: ['C2'] },
    { id: 'F1', message: 'Add login form', parents: ['C2'] },
    { id: 'F2', message: 'Validate login input', parents: ['F1'] },
  ],
  localBranches: { main: 'C3', feature: 'F2' },
  remoteTracking: { 'origin/main': 'C2' },
  serverBranches: { main: 'C2' },
  serverOnly: [],
  currentBranch: 'feature',
  seq: 4,
};

const merge: SimScenario = {
  id: 'merge',
  title: txt('Merge Branches', 'ব্রাঞ্চ মার্জ'),
  subtitle: txt(
    'Join a finished feature branch back into main and watch the merge commit appear.',
    'সমাপ্ত ফিচার ব্রাঞ্চ main-এ যুক্ত করুন ও মার্জ কমিটের আবির্ভাব দেখুন।'
  ),
  intro: txt(
    'main (C3) and feature (F2) diverged from C2. You are on feature. Switch to main and merge the feature in.',
    'main (C3) ও feature (F2) C2 থেকে ডাইভার্জ করেছে। আপনি feature-এ আছেন। main-এ গিয়ে ফিচার মার্জ করুন।'
  ),
  initial: mergeInitial,
  steps: [
    {
      id: 'merge-switch',
      title: txt('1. Switch to main', '১. main-এ যান'),
      explanation: txt(
        'Merges land on the branch you have checked out. HEAD must point at main before merging into it.',
        'মার্জ সেই ব্রাঞ্চে হয় যেটি চেকআউট করা। মার্জের আগে HEAD-কে main-এ থাকতে হবে।'
      ),
      command: 'git switch main',
      action: { type: 'switch', branch: 'main' },
      expectedResult: txt('HEAD → main → C3. The working tree now reflects main.', 'HEAD → main → C3। ওয়ার্কিং ট্রি এখন main প্রতিফলিত করে।'),
      whyItMatters: txt('git switch only moves HEAD and files — history is untouched.', 'git switch শুধু HEAD ও ফাইল সরায় — হিস্ট্রি অক্ষত থাকে।'),
      learnMoreLessonId: 'git.fundamentals.branch',
    },
    {
      id: 'merge-run',
      title: txt('2. Merge the feature branch', '২. ফিচার ব্রাঞ্চ মার্জ করুন'),
      explanation: txt(
        'Both sides moved since C2, so Git cannot fast-forward — it records a merge commit with two parents.',
        'C2-এর পর উভয় দিক এগিয়েছে, তাই গিট ফাস্ট-ফরোয়ার্ড পারবে না — দুটি প্যারেন্টসহ মার্জ কমিট রেকর্ড করবে।'
      ),
      command: 'git merge feature',
      action: { type: 'merge', source: 'feature' },
      expectedResult: txt("Merge commit C4 appears on main with parents C3 and F2. feature still points at F2.", 'main-এ C4 মার্জ কমিট দেখায়, প্যারেন্ট C3 ও F2। feature এখনো F2-তে।'),
      whyItMatters: txt('Merge preserves both histories honestly — nothing is rewritten, the join itself is recorded.', 'মার্জ উভয় হিস্ট্রি সৎভাবে সংরক্ষণ করে — কিছু পুনর্লিখিত হয় না, যুক্ত হওয়াটাই রেকর্ড হয়।'),
      learnMoreLessonId: 'git.fundamentals.branch',
    },
    {
      id: 'merge-log',
      title: txt('3. Read the joined history', '৩. যুক্ত হিস্ট্রি পড়ুন'),
      explanation: txt(
        'The graph now shows two lines converging at C4. HEAD, main, and the merge commit line up.',
        'গ্রাফে এখন দুটি লাইন C4-এ মিলেছে। HEAD, main ও মার্জ কমিট এক সারিতে।'
      ),
      command: 'git log --oneline --graph --all',
      action: { type: 'log' },
      expectedResult: txt('C4 [merge] listed with main and HEAD labels.', 'C4 [merge] main ও HEAD লেবেলসহ তালিকাভুক্ত।'),
      whyItMatters: txt('Graph literacy turns merge anxiety into routine reading.', 'গ্রাফ পড়তে পারলে মার্জ-ভীতি নিয়মিত পড়ায় পরিণত হয়।'),
      learnMoreLessonId: 'git.fundamentals.branch',
    },
    {
      id: 'merge-push',
      title: txt('4. Push the merge', '৪. মার্জ পুশ করুন'),
      explanation: txt(
        'The merge commit is local until pushed. The server accepts it because it extends known history.',
        'পুশ না হওয়া পর্যন্ত মার্জ কমিট লোকাল। পরিচিত হিস্ট্রি বাড়ায় বলে সার্ভার তা গ্রহণ করে।'
      ),
      command: 'git push origin main',
      action: { type: 'push' },
      expectedResult: txt('Remote main advances to C4.', 'রিমোট main C4-তে এগোয়।'),
      whyItMatters: txt('Sharing the merge — not just the feature — is what unblocks the team.', 'শুধু ফিচার নয়, মার্জ শেয়ার করাই টিমকে আনব্লক করে।'),
      learnMoreLessonId: 'git.fundamentals.remote-repository',
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Scenario 3 — Rebase                                               */
/* ------------------------------------------------------------------ */

const rebaseInitial: GitSimulationState = {
  files: files(),
  commits: [
    { id: 'C1', message: 'Initial commit', parents: [] },
    { id: 'C2', message: 'Setup project', parents: ['C1'] },
    { id: 'C3', message: 'Hotfix header', parents: ['C2'] },
    { id: 'F1', message: 'Add dark mode', parents: ['C2'] },
    { id: 'F2', message: 'Polish dark mode toggle', parents: ['F1'] },
  ],
  localBranches: { main: 'C3', feature: 'F2' },
  remoteTracking: { 'origin/main': 'C3' },
  serverBranches: { main: 'C3' },
  serverOnly: [],
  currentBranch: 'feature',
  seq: 4,
};

const rebase: SimScenario = {
  id: 'rebase',
  title: txt('Rebase onto main', 'main-এর ওপর রিব্যাস'),
  subtitle: txt(
    'Replay feature commits onto the latest main for a clean linear history.',
    'পরিষ্কার লিনিয়ার হিস্ট্রির জন্য ফিচার কমিট সর্বশেষ main-এর ওপর রিপ্লে করুন।'
  ),
  intro: txt(
    'feature (F1→F2) was built on C2, but main has since moved to C3. Rebase replays your work onto the new base.',
    'feature (F1→F2) C2-এর ওপর তৈরি, কিন্তু main ইতিমধ্যে C3-তে গেছে। রিব্যাস আপনার কাজ নতুন বেসের ওপর রিপ্লে করে।'
  ),
  initial: rebaseInitial,
  steps: [
    {
      id: 'rebase-log-before',
      title: txt('1. See the forked history', '১. দ্বিখণ্ডিত হিস্ট্রি দেখুন'),
      explanation: txt(
        'Notice the fork: main went C2→C3 while feature went C2→F1→F2. Merging now would add a merge bubble.',
        'ফোর্ক লক্ষ্য করুন: main গেছে C2→C3, feature গেছে C2→F1→F2। এখন মার্জ করলে মার্জ বাবল তৈরি হবে।'
      ),
      command: 'git log --oneline --graph --all',
      action: { type: 'log' },
      expectedResult: txt('Two lines visible from C2: main at C3, feature at F2.', 'C2 থেকে দুটি লাইন: main C3-তে, feature F2-তে।'),
      whyItMatters: txt('You can only choose rebase vs merge if you can see the fork.', 'ফোর্ক দেখতে পারলেই rebase বনাম merge বেছে নেওয়া যায়।'),
      learnMoreLessonId: 'git.fundamentals.branch',
    },
    {
      id: 'rebase-run',
      title: txt('2. Rebase feature onto main', '২. main-এর ওপর feature রিব্যাস করুন'),
      explanation: txt(
        'Git re-applies F1 and F2 on top of C3, minting new ids F1′ and F2′. Same changes, new identities.',
        'গিট F1 ও F2 কে C3-এর ওপর পুনরায় প্রয়োগ করে নতুন id দেয় F1′ ও F2′। একই পরিবর্তন, নতুন পরিচয়।'
      ),
      command: 'git rebase main',
      action: { type: 'rebase', onto: 'main' },
      expectedResult: txt('feature becomes C3 → F1′ → F2′. History is linear.', 'feature হয় C3 → F1′ → F2′। হিস্ট্রি লিনিয়ার।'),
      whyItMatters: txt('Linear history reads like a story. But the new hashes mean old links to F1/F2 no longer resolve.', 'লিনিয়ার হিস্ট্রি গল্পের মতো পড়া যায়। তবে নতুন হ্যাশ মানে F1/F2-এর পুরনো লিঙ্ক আর কাজ করবে না।'),
      learnMoreLessonId: 'git.fundamentals.branch',
    },
    {
      id: 'rebase-log-after',
      title: txt('3. Confirm the linear history', '৩. লিনিয়ার হিস্ট্রি নিশ্চিত করুন'),
      explanation: txt(
        'One straight line now: no merge commit, no bubble. Compare with the fork you saw in step 1.',
        'এখন একটি সরলরেখা: মার্জ কমিট নেই, বাবল নেই। ধাপ ১-এর ফোর্কের সাথে তুলনা করুন।'
      ),
      command: 'git log --oneline --graph --all',
      action: { type: 'log' },
      expectedResult: txt('Single chain C1 → C2 → C3 → F1′ → F2′ with feature and HEAD at the tip.', 'একক চেইন C1 → C2 → C3 → F1′ → F2′, feature ও HEAD শীর্ষে।'),
      whyItMatters: txt('Verifying after rewriting is a habit that prevents lost work.', 'পুনর্লিখনের পর যাচাই হারানো কাজ রোধ করে।'),
      learnMoreLessonId: 'git.fundamentals.branch',
    },
    {
      id: 'rebase-switch',
      title: txt('4. Switch to main', '৪. main-এ যান'),
      explanation: txt(
        'With feature rebased, main can now simply catch up — no merge commit will be needed.',
        'feature রিব্যাস হওয়ায় main এখন শুধু এগিয়ে যাবে — মার্জ কমিট দরকার হবে না।'
      ),
      command: 'git switch main',
      action: { type: 'switch', branch: 'main' },
      expectedResult: txt('HEAD → main → C3.', 'HEAD → main → C3।'),
      whyItMatters: txt('Rebase is preparation; the payoff comes when main adopts the clean line.', 'রিব্যাস প্রস্তুতি; main পরিষ্কার লাইন গ্রহণ করলেই ফল পাওয়া যায়।'),
      learnMoreLessonId: 'git.fundamentals.head',
    },
    {
      id: 'rebase-merge',
      title: txt('5. Merge — watch it fast-forward', '৫. মার্জ করুন — ফাস্ট-ফরোয়ার্ড দেখুন'),
      explanation: txt(
        'Because feature now extends main directly, Git slides main forward to F2′ instead of creating a merge commit.',
        'feature এখন সরাসরি main বাড়ায় বলে মার্জ কমিট না বানিয়ে গিট main এগিয়ে F2′-তে নেয়।'
      ),
      command: 'git merge feature',
      action: { type: 'merge', source: 'feature' },
      expectedResult: txt('main fast-forwards C3 → F2′. No merge commit.', 'main ফাস্ট-ফরোয়ার্ড করে C3 → F2′। মার্জ কমিট নেই।'),
      whyItMatters: txt('Rebase + fast-forward is how teams keep main readable without losing any change.', 'রিব্যাস + ফাস্ট-ফরোয়ার্ডে টিম main পাঠযোগ্য রাখে, কোনো পরিবর্তন না হারিয়ে।'),
      learnMoreLessonId: 'git.fundamentals.branch',
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Scenario 4 — Fetch vs Pull                                         */
/* ------------------------------------------------------------------ */

const fetchPullInitial: GitSimulationState = {
  files: files(),
  commits: [{ id: 'C1', message: 'Initial commit', parents: [] }],
  localBranches: { main: 'C1' },
  remoteTracking: { 'origin/main': 'C1' },
  serverBranches: { main: 'C1' },
  serverOnly: [],
  currentBranch: 'main',
  seq: 2,
};

const fetchPull: SimScenario = {
  id: 'fetch-pull',
  title: txt('Fetch vs Pull', 'Fetch বনাম Pull'),
  subtitle: txt(
    'See why fetch never touches your work — and what pull adds on top.',
    'দেখুন কেন fetch আপনার কাজে হাত দেয় না — আর pull এর ওপর কী যোগ করে।'
  ),
  intro: txt(
    'Your main matches the server at C1. A teammate is about to push something new. Watch what each command does — and does not do.',
    'আপনার main সার্ভারের সাথে C1-এ মিলে আছে। একজন সহকর্মী নতুন কিছু পুশ করতে যাচ্ছেন। প্রতিটি কমান্ড কী করে — আর কী করে না — লক্ষ্য করুন।'
  ),
  initial: fetchPullInitial,
  steps: [
    {
      id: 'fetchpull-teammate',
      title: txt('1. A teammate pushes C2', '১. একজন সহকর্মী C2 পুশ করেন'),
      explanation: txt(
        'Someone else publishes a commit. Crucially: absolutely nothing changes on your machine yet — not even your view of the remote.',
        'অন্য কেউ কমিট প্রকাশ করেন। গুরুত্বপূর্ণ: আপনার মেশিনে এখনো কিছু বদলায়নি — রিমোট সম্পর্কে আপনার ধারণাও নয়।'
      ),
      command: '# teammate runs: git push',
      action: { type: 'teammate-push', message: 'Add API docs' },
      expectedResult: txt('No panel changes. The server secretly moved to C2.', 'কোনো প্যানেল বদলায় না। সার্ভার গোপনে C2-তে গেছে।'),
      whyItMatters: txt('Remote work is invisible until you ask about it. Git never interrupts you with surprise downloads.', 'জিজ্ঞেস না করা পর্যন্ত রিমোট কাজ অদৃশ্য। গিট হঠাৎ ডাউনলোডে আপনাকে বিরক্ত করে না।'),
      learnMoreLessonId: 'git.fundamentals.remote-repository',
    },
    {
      id: 'fetchpull-fetch',
      title: txt('2. Fetch the news', '২. খবর Fetch করুন'),
      explanation: txt(
        'Download everything new and update origin/main — while your branch, files, and staging stay exactly as they were.',
        'সব নতুন ডাউনলোড করে origin/main আপডেট করুন — আপনার ব্রাঞ্চ, ফাইল ও স্টেজিং ঠিক আগের মতোই থাকে।'
      ),
      command: 'git fetch',
      action: { type: 'fetch' },
      expectedResult: txt('C2 arrives; origin/main → C2. main stays at C1. Files untouched.', 'C2 এসেছে; origin/main → C2। main C1-তেই। ফাইল অক্ষত।'),
      whyItMatters: txt('Fetch separates learning from deciding. Review first, integrate when ready — never by surprise.', 'Fetch জানা ও সিদ্ধান্ত আলাদা করে। আগে পর্যালোচনা, প্রস্তুত হলে একীভূত — কখনো হঠাৎ নয়।'),
      learnMoreLessonId: 'git.fundamentals.remote-repository',
    },
    {
      id: 'fetchpull-status',
      title: txt('3. Confirm your work is untouched', '৩. নিশ্চিত হোন আপনার কাজ অক্ষত'),
      explanation: txt(
        'Status proves the key fetch guarantee: downloads happened, yet your branch and files did not move.',
        'Status fetch-এর মূল গ্যারান্টি প্রমাণ করে: ডাউনলোড হয়েছে, তবু আপনার ব্রাঞ্চ ও ফাইল নড়েনি।'
      ),
      command: 'git status',
      action: { type: 'status' },
      expectedResult: txt('Still on main at C1, tree clean — despite C2 existing locally now.', 'এখনো main-এ C1-তে, ট্রি পরিষ্কার — যদিও C2 এখন লোকালি আছে।'),
      whyItMatters: txt('This is the sentence to memorize: fetch never merges.', 'এই বাক্যটি মুখস্থ করুন: fetch কখনো মার্জ করে না।'),
      learnMoreLessonId: 'git.fundamentals.remote-repository',
    },
    {
      id: 'fetchpull-pull',
      title: txt('4. Pull to integrate', '৪. একীভূত করতে Pull করুন'),
      explanation: txt(
        'Pull = fetch + integrate. With nothing of your own on top, integration is a clean fast-forward to C2.',
        'Pull = fetch + integrate। ওপরে আপনার নিজস্ব কিছু না থাকায় একীভূতকরণ C2-তে পরিষ্কার ফাস্ট-ফরোয়ার্ড।'
      ),
      command: 'git pull',
      action: { type: 'pull' },
      expectedResult: txt('main fast-forwards to C2. Local, tracking, and server all agree.', 'main ফাস্ট-ফরোয়ার্ড করে C2-তে। লোকাল, ট্র্যাকিং ও সার্ভার সব একমত।'),
      whyItMatters: txt('Prefer fetch when you want to look first; use pull when you are ready to move.', 'আগে দেখতে চাইলে fetch; সরতে প্রস্তুত হলে pull।'),
      learnMoreLessonId: 'git.fundamentals.remote-repository',
    },
    {
      id: 'fetchpull-log',
      title: txt('5. Read the final history', '৫. চূড়ান্ত হিস্ট্রি পড়ুন'),
      explanation: txt(
        'One straight line: C1 → C2 with main, origin/main, and HEAD together. No merge commit was needed.',
        'একটি সরলরেখা: C1 → C2, main, origin/main ও HEAD একসাথে। মার্জ কমিট দরকার হয়নি।'
      ),
      command: 'git log --oneline --graph --all',
      action: { type: 'log' },
      expectedResult: txt('C2 carries the main, origin/main, and HEAD labels.', 'C2 main, origin/main ও HEAD লেবেল বহন করে।'),
      whyItMatters: txt('Every sync ends with reading. Aligned labels mean a healthy, shared history.', 'প্রতিটি সিঙ্ক পড়া দিয়ে শেষ হয়। সারিবদ্ধ লেবেল মানে সুস্থ, শেয়ার্ড হিস্ট্রি।'),
      learnMoreLessonId: 'git.fundamentals.remote-repository',
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Registry                                                           */
/* ------------------------------------------------------------------ */

export const SIM_SCENARIOS: SimScenario[] = [everyday, merge, rebase, fetchPull];

export function getScenario(id: string): SimScenario {
  return SIM_SCENARIOS.find((s) => s.id === id) ?? everyday;
}

/**
 * Map a lesson content id to the scenario that demonstrates it.
 * Used for "Try it interactively →" links in Learning Mode.
 */
export function scenarioForLesson(lessonId: string): string {
  if (lessonId.includes('remote')) return 'fetch-pull';
  if (lessonId.includes('rebase')) return 'rebase';
  if (lessonId.includes('branch') || lessonId.includes('head')) return 'merge';
  if (lessonId.startsWith('github.')) {
    if (
      lessonId.includes('pull-request') ||
      lessonId.includes('review') ||
      lessonId.includes('merge') ||
      lessonId.includes('branch')
    ) {
      return 'merge';
    }
    if (
      lessonId.includes('push') ||
      lessonId.includes('fetch') ||
      lessonId.includes('sync') ||
      lessonId.includes('fork') ||
      lessonId.includes('upstream') ||
      lessonId.includes('remote') ||
      lessonId.includes('clone') ||
      lessonId.includes('collaboration')
    ) {
      return 'fetch-pull';
    }
  }
  return 'everyday';
}
