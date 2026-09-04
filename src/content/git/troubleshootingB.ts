import { DecisionTree, TroubleshootingGuide } from '@/types/content';

const L = {
  workingDirectory: 'git.fundamentals.working-directory',
  stagingArea: 'git.fundamentals.staging-area',
  commit: 'git.fundamentals.commit',
  branch: 'git.fundamentals.branch',
  head: 'git.fundamentals.head',
  remote: 'git.fundamentals.remote-repository',
  local: 'git.fundamentals.local-repository',
};

export const TROUBLESHOOTING_GUIDES_B: TroubleshootingGuide[] = [
  {
    id: 'git.troubleshooting.remove-file-from-commit',
    slug: 'remove-file-from-commit',
    title: { en: 'Remove a file from the last commit', bn: 'শেষ কমিট থেকে ফাইল সরান' },
    shortDescription: {
      en: 'Three different goals: keep the file locally, pretend it was never committed, or handle an already-pushed commit.',
      bn: 'তিনটি ভিন্ন লক্ষ্য: ফাইল লোকালি রাখুন, কখনো কমিট হয়নি ভান করুন, বা পুশ করা কমিট সামলান।',
    },
    category: 'commit-problems',
    difficulty: 'intermediate',
    severity: 'medium',
    symptoms: [
      { en: 'Your last commit contains a file it should not — a debug file, build output, or personal notes.', bn: 'শেষ কমিটে থাকা উচিত নয় এমন ফাইল আছে — ডিবাগ ফাইল, বিল্ড আউটপুট বা ব্যক্তিগত নোট।' },
    ],
    sightings: [
      { command: 'git show --stat HEAD', output: 'commit c4d5e6f Add login validation\n app.js        | 42 +++++++++++++\n debug-notes.txt | 15 +++++\n 2 files changed' },
    ],
    diagnosis: {
      en: 'A commit is a snapshot of the staging area at commit time. Removing a file means building a corrected snapshot — either by amending (unpushed) or by a follow-up commit (pushed). If the file is a secret, this scenario alone is not enough.',
      bn: 'কমিট হলো কমিট সময়ে স্টেজিং এরিয়ার স্ন্যাপশট। ফাইল সরানো মানে সংশোধিত স্ন্যাপশট বানানো — amend দিয়ে (আনপুশড) বা ফলো-আপ কমিট দিয়ে (পুশড)। ফাইল গোপন হলে শুধু এই দৃশ্যপট যথেষ্ট নয়।',
    },
    likelyCauses: [
      { en: 'git add . swept in a file that was never meant for history.', bn: 'git add . হিস্ট্রিতে যাওয়ার অযোগ্য ফাইল টেনে এনেছে।' },
    ],
    checks: [
      { label: { en: 'Confirm the file is really in the tip commit.', bn: 'নিশ্চিত হোন ফাইল সত্যিই টিপ কমিটে আছে।' }, command: 'git show --stat HEAD' },
      { label: { en: 'Check whether the commit is pushed.', bn: 'কমিট পুশ হয়েছে কিনা দেখুন।' }, command: 'git status' },
    ],
    fix: {
      title: { en: 'Unpushed: unstage from history, keep on disk', bn: 'আনপুশড: হিস্ট্রি থেকে আনস্টেজ, ডিস্কে রাখুন' },
      steps: [
        { en: 'Remove the file from tracking but keep your local copy, then fold the result into the same commit.', bn: 'লোকাল কপি রেখে ট্র্যাকিং থেকে ফাইল সরান, তারপর ফল একই কমিটে ভাঁজ করুন।' },
        { en: 'Add the filename to .gitignore so it never sneaks in again, and amend once more.', bn: '.gitignore-এ ফাইলের নাম যোগ করুন যাতে আর না ঢোকে, এবং আরেকবার amend করুন।' },
      ],
      commands: ['git rm --cached debug-notes.txt', 'git commit --amend --no-edit', 'git log --stat -n 1'],
    },
    alternatives: [
      {
        title: { en: 'If the commit is already pushed', bn: 'কমিট পুশ হয়ে গেলে' },
        detail: {
          en: 'Do not amend shared history. Remove the file in a new commit and push that. The old snapshot still exists in history — acceptable for ordinary files, never for secrets.',
          bn: 'শেয়ার্ড হিস্ট্রি amend করবেন না। নতুন কমিটে ফাইল সরিয়ে পুশ করুন। পুরনো স্ন্যাপশট হিস্ট্রিতে থাকে — সাধারণ ফাইলে গ্রহণযোগ্য, গোপন তথ্যে কখনো নয়।',
        },
        commands: ['git rm --cached debug-notes.txt', 'git commit -m "Remove debug notes from tracking"', 'git push'],
      },
    ],
    warnings: [
      { level: 'caution', text: { en: 'If the file contains passwords, tokens, or keys, stop here and open the dedicated secret scenario — ordinary removal leaves the secret readable in history.', bn: 'ফাইলে পাসওয়ার্ড, টোকেন বা কী থাকলে এখানে থামুন ও গোপন তথ্যের আলাদা দৃশ্যপট খুলুন — সাধারণ অপসারণে গোপন তথ্য হিস্ট্রিতে পাঠযোগ্য থাকে।' } },
    ],
    verify: [
      { en: 'git show --stat HEAD no longer lists the file, and the file still exists on your disk.', bn: 'git show --stat HEAD আর ফাইল দেখায় না, এবং ফাইল ডিস্কে আছে।' },
    ],
    commands: ['commit', 'status', 'restore'],
    lessons: [L.commit, L.stagingArea],
    scenarios: ['committed-secret', 'undo-last-commit'],
    tags: ['remove file', 'amend', 'rm cached', 'gitignore'],
    searchKeywords: ['remove file from commit', 'rm cached', 'file in commit by mistake', 'amend remove file', 'untrack file'],
    safeForBeginners: false,
    order: 11,
  },
  {
    id: 'git.troubleshooting.committed-secret',
    slug: 'committed-secret',
    title: { en: 'I accidentally committed a secret', bn: 'ভুলে গোপন তথ্য কমিট করে ফেলেছি' },
    shortDescription: {
      en: 'Deleting it later does not erase history. Revoke the credential FIRST — then clean up, deliberately and together.',
      bn: 'পরে মুছলেও হিস্ট্রি মোছে না। আগে ক্রেডেনশিয়াল বাতিল করুন — তারপর সচেতনভাবে, একসাথে পরিষ্কার করুন।',
    },
    category: 'security',
    difficulty: 'intermediate',
    severity: 'critical',
    symptoms: [
      { en: 'An API key, password, or token is visible in git log, git show, or a pushed commit.', bn: 'API কী, পাসওয়ার্ড বা টোকেন git log, git show বা পুশড কমিটে দেখা যাচ্ছে।' },
    ],
    sightings: [
      { command: 'git show HEAD', output: 'commit e7f8a9b Add payment integration\n+const STRIPE_KEY = "sk_live_51H..."' },
    ],
    diagnosis: {
      en: 'Every commit is a permanent snapshot, and pushes copy it to servers and teammates. A follow-up commit that deletes the secret only hides it from the tip — the original snapshot stays readable in history. Assume the secret is compromised the moment it was pushed.',
      bn: 'প্রতিটি কমিট স্থায়ী স্ন্যাপশট, এবং পুশ তা সার্ভার ও সহকর্মীদের কাছে কপি করে। গোপন তথ্য মোছা ফলো-আপ কমিট শুধু টিপ থেকে লুকায় — মূল স্ন্যাপশট হিস্ট্রিতে পাঠযোগ্য থাকে। পুশ হওয়া মাত্র গোপন তথ্য আপস হয়েছে ধরে নিন।',
    },
    likelyCauses: [
      { en: 'Missing .gitignore entry combined with git add ..', bn: '.gitignore এন্ট্রি না থাকা ও git add . এর সমন্বয়।' },
      { en: 'Hardcoded credentials instead of environment variables.', bn: 'এনভায়রনমেন্ট ভেরিয়েবলের বদলে হার্ডকোডেড ক্রেডেনশিয়াল।' },
    ],
    checks: [
      { label: { en: 'Confirm exactly which commits expose the secret.', bn: 'ঠিক কোন কমিট গোপন তথ্য প্রকাশ করে নিশ্চিত হোন।' }, command: 'git log -S "sk_live" --oneline' },
      { label: { en: 'Check whether those commits reached any remote.', bn: 'কমিটগুলো কোনো রিমোটে পৌঁছেছে কিনা দেখুন।' }, command: 'git status' },
    ],
    fix: {
      title: { en: 'Revoke first, clean second', bn: 'আগে বাতিল, পরে পরিষ্কার' },
      steps: [
        { en: 'Immediately revoke or rotate the exposed credential in its provider dashboard. This is the actual fix — everything else is cleanup.', bn: 'সাথে সাথে প্রোভাইডার ড্যাশবোর্ডে প্রকাশিত ক্রেডেনশিয়াল বাতিল বা রোটেট করুন। এটাই আসল সমাধান — বাকি সব পরিষ্কার।' },
        { en: 'Remove the secret from the working tree and .gitignore the file so it cannot return.', bn: 'ওয়ার্কিং ট্রি থেকে গোপন তথ্য সরান এবং ফাইল .gitignore করুন যাতে ফিরতে না পারে।' },
        { en: 'If pushed, coordinate with your team before rewriting history — then purge the file from history with a dedicated tool and force-push deliberately, together.', bn: 'পুশ হলে হিস্ট্রি পুনর্লিখনের আগে টিমের সাথে সমন্বয় করুন — তারপর ডেডিকেটেড টুলে ফাইল মুছে সচেতনভাবে একসাথে ফোর্স-পুশ করুন।' },
      ],
      commands: ['git rm --cached .env', 'git commit -m "Remove exposed credentials"', 'git push'],
    },
    alternatives: [
      {
        title: { en: 'Never-pushed secret (simplest case)', bn: 'কখনো পুশ না হওয়া গোপন তথ্য (সহজতম)' },
        detail: {
          en: 'If the commit exists only on your machine, amend it out or reset it away, then verify with git log -S. No coordination needed — but still rotate the secret if it ever touched a shared service.',
          bn: 'কমিট শুধু আপনার মেশিনে থাকলে amend বা reset দিয়ে সরান, তারপর git log -S দিয়ে যাচাই করুন। সমন্বয় দরকার নেই — তবে শেয়ার্ড সার্ভিস ছুঁয়ে থাকলে তবু রোটেট করুন।',
        },
        commands: ['git rm --cached .env', 'git commit --amend --no-edit'],
      },
    ],
    warnings: [
      { level: 'danger', text: { en: 'A later commit that deletes the secret does NOT remove it from history. Anyone with the old commit id can still read it. Revocation is mandatory, not optional.', bn: 'গোপন তথ্য মোছা পরের কমিট হিস্ট্রি থেকে সরায় না। পুরনো কমিট id জানা যে কেউ পড়তে পারে। বাতিল বাধ্যতামূলক, ঐচ্ছিক নয়।' } },
      { level: 'caution', text: { en: 'History surgery on pushed branches strands collaborators. Announce, agree, and re-sync together.', bn: 'পুশড ব্রাঞ্চে হিস্ট্রি সার্জারি সহকর্মীদের ভাসিয়ে দেয়। ঘোষণা, সম্মতি ও একসাথে পুনরায় সিঙ্ক করুন।' } },
    ],
    verify: [
      { en: 'The credential no longer works (revoked), and git log -S finds no trace in reachable history.', bn: 'ক্রেডেনশিয়াল আর কাজ করে না (বাতিল), এবং git log -S পৌঁছযোগ্য হিস্ট্রিতে কোনো চিহ্ন পায় না।' },
      { en: '.env (or equivalent) is ignored and secret scanning passes on the next push.', bn: '.env (বা সমতুল্য) ignored এবং পরের পুশে সিক্রেট স্ক্যানিং পাস করে।' },
    ],
    commands: ['status', 'log'],
    lessons: [L.commit],
    scenarios: ['remove-file-from-commit', 'force-push'],
    tags: ['secret', 'credentials', 'security', 'api key', 'env'],
    searchKeywords: ['committed secret', 'api key in commit', 'password in git', 'remove secret from history', 'env file committed', 'token leaked'],
    safeForBeginners: false,
    order: 12,
  },
  {
    id: 'git.troubleshooting.recover-commit',
    slug: 'recover-commit',
    title: { en: 'Recover a deleted or lost commit', bn: 'মুছে যাওয়া বা হারানো কমিট উদ্ধার করুন' },
    shortDescription: {
      en: 'Git remembers where your pointers have been. The reflog is your local safety net — inspect, identify, re-attach.',
      bn: 'গিট মনে রাখে পয়েন্টার কোথায় ছিল। reflog আপনার লোকাল নিরাপত্তা জাল — পরিদর্শন, শনাক্ত, পুনঃসংযোগ।',
    },
    category: 'history-recovery',
    difficulty: 'intermediate',
    severity: 'high',
    symptoms: [
      { en: 'A commit you need is gone from git log after a reset, amend, or bad rebase.', bn: 'রিসেট, amend বা ভুল রিবেসের পর দরকারি কমিট git log থেকে উধাও।' },
    ],
    sightings: [
      { command: 'git log --oneline -n 3', output: 'c1d2e3f (HEAD -> main) Old work\n...your recent commit is missing...' },
    ],
    diagnosis: {
      en: 'Reset and amend move pointers; they rarely delete objects immediately. The reflog — a local journal of every move HEAD and your branches made — still references the "lost" commit. Recovery means finding that reference and pointing a branch at it again.',
      bn: 'রিসেট ও amend পয়েন্টার সরায়; অবজেক্ট সাথে সাথে মোছে না। reflog — HEAD ও ব্রাঞ্চের প্রতিটি নড়াচড়ার লোকাল জার্নাল — "হারানো" কমিটের রেফারেন্স ধরে রাখে। রিকভারি মানে রেফারেন্স খুঁজে ব্রাঞ্চ আবার সেখানে বসানো।',
    },
    likelyCauses: [
      { en: 'git reset --hard, a mistaken amend, or an aborted rebase moved the pointer away.', bn: 'git reset --hard, ভুল amend বা বাতিল রিবেস পয়েন্টার সরিয়ে দিয়েছে।' },
    ],
    checks: [
      { label: { en: 'Open the journal of recent pointer moves.', bn: 'সাম্প্রতিক পয়েন্টার নড়াচড়ার জার্নাল খুলুন।' }, command: 'git reflog --oneline -n 10' },
      { label: { en: 'Inspect a candidate before trusting it.', bn: 'বিশ্বাসের আগে প্রার্থী পরিদর্শন করুন।' }, command: 'git show <commit-id> --stat' },
    ],
    fix: {
      title: { en: 'Find it, verify it, re-attach it', bn: 'খুঁজুন, যাচাই করুন, পুনঃসংযোগ করুন' },
      steps: [
        { en: 'Read git reflog and find the lost commit id and its message.', bn: 'git reflog পড়ে হারানো কমিট id ও মেসেজ খুঁজুন।' },
        { en: 'Inspect it with git show to confirm it holds your work.', bn: 'git show দিয়ে পরিদর্শন করে নিশ্চিত হোন কাজটি আছে।' },
        { en: 'Point a branch at it (new recovery branch is safest), then verify with git log.', bn: 'সেখানে ব্রাঞ্চ বসান (নতুন রিকভারি ব্রাঞ্চ নিরাপদতম), তারপর git log দিয়ে যাচাই করুন।' },
      ],
      commands: ['git reflog --oneline -n 10', 'git show a1b2c3d --stat', 'git branch recovery a1b2c3d', 'git log --oneline recovery -n 3'],
    },
    alternatives: [
      {
        title: { en: 'Cherry-pick instead of branching', bn: 'ব্রাঞ্চের বদলে cherry-pick' },
        detail: {
          en: 'If you only need the changes (not the original commit object), cherry-pick the lost id onto your current branch. Same content, new commit.',
          bn: 'শুধু পরিবর্তন দরকার হলে (মূল কমিট অবজেক্ট নয়) হারানো id বর্তমান ব্রাঞ্চে cherry-pick করুন। একই কনটেন্ট, নতুন কমিট।',
        },
        commands: ['git cherry-pick a1b2c3d'],
      },
    ],
    warnings: [
      { level: 'caution', text: { en: 'The reflog is local to your machine and entries expire (around 90 days by default). It is a safety net, not a backup — never rely on it as your only copy.', bn: 'reflog আপনার মেশিনের লোকাল এবং এন্ট্রি মেয়াদোত্তীর্ণ হয় (ডিফল্টে ~৯০ দিন)। এটি নিরাপত্তা জাল, ব্যাকআপ নয় — একমাত্র কপি হিসেবে নির্ভর করবেন না।' } },
    ],
    verify: [
      { en: 'The recovery branch log shows your commit with its original message.', bn: 'রিকভারি ব্রাঞ্চ log মূল মেসেজসহ কমিট দেখায়।' },
    ],
    diagram: {
      before: ['main → C1 (HEAD, commit C2 lost from view)'],
      after: ['main → C1', 'recovery → C2 (found via reflog)'],
      caption: { en: 'A new pointer rescues the orphaned commit.', bn: 'নতুন পয়েন্টার এতিম কমিট উদ্ধার করে।' },
    },
    commands: ['log', 'show', 'branch', 'checkout'],
    lessons: [L.local, L.commit, 'git.internals.reflog'],
    scenarios: ['deleted-branch', 'reset-hard'],
    tags: ['reflog', 'recover', 'lost commit', 'reset'],
    searchKeywords: ['recover deleted commit', 'reflog', 'lost commit', 'undo reset hard', 'find lost commit', 'commit disappeared'],
    safeForBeginners: true,
    order: 13,
  },
  {
    id: 'git.troubleshooting.deleted-branch',
    slug: 'deleted-branch',
    title: { en: 'I accidentally deleted a branch', bn: 'ভুলে ব্রাঞ্চ মুছে ফেলেছি' },
    shortDescription: {
      en: 'Deleting a branch only removes the pointer, not the commits. Find the tip in the reflog and re-create the pointer.',
      bn: 'ব্রাঞ্চ মোছা শুধু পয়েন্টার সরায়, কমিট নয়। reflog-এ টিপ খুঁজে পয়েন্টার পুনরায় তৈরি করুন।',
    },
    category: 'branch-problems',
    difficulty: 'intermediate',
    severity: 'medium',
    symptoms: [
      { en: 'git branch no longer lists your branch after -d or -D.', bn: '-d বা -D-এর পর git branch আর ব্রাঞ্চ দেখায় না।' },
    ],
    sightings: [
      { command: 'git branch', output: '* main\n  hotfix-header' },
    ],
    diagnosis: {
      en: 'A branch is a 41-byte file holding one commit id. Deleting it removes that file — the commits themselves stay until garbage collection. Note git branch -d refuses unmerged branches; -D overrides that guard, which is usually how accidents happen.',
      bn: 'ব্রাঞ্চ একটি ৪১-বাইট ফাইল যা একটি কমিট id ধরে। মোছা মানে ফাইল সরানো — কমিট গার্বেজ কালেকশন পর্যন্ত থাকে। git branch -d আনমার্জড ব্রাঞ্চে প্রত্যাখ্যান করে; -D সেই পাহারা ওভাররাইড করে, দুর্ঘটনা সাধারণত এভাবেই হয়।',
    },
    likelyCauses: [
      { en: 'Force-deleting (-D) an unmerged branch, or deleting before pushing.', bn: 'আনমার্জড ব্রাঞ্চে ফোর্স-ডিলিট (-D), বা পুশের আগে মোছা।' },
    ],
    checks: [
      { label: { en: 'Search the reflog for the branch tip.', bn: 'reflog-এ ব্রাঞ্চ টিপ খুঁজুন।' }, command: 'git reflog --oneline -n 15' },
      { label: { en: 'Check whether the branch still exists on the remote.', bn: 'ব্রাঞ্চ রিমোটে এখনো আছে কিনা দেখুন।' }, command: 'git branch -r' },
    ],
    fix: {
      title: { en: 'Re-create the pointer at the old tip', bn: 'পুরনো টিপে পয়েন্টার পুনরায় তৈরি করুন' },
      steps: [
        { en: 'Find the tip commit id in the reflog (or use origin/<branch> if it was pushed).', bn: 'reflog-এ টিপ কমিট id খুঁজুন (পুশ হলে origin/<branch> ব্যবহার করুন)।' },
        { en: 'Create the branch again at exactly that commit — this restores the pointer, and the whole history behind it.', bn: 'ঠিক সেই কমিটে ব্রাঞ্চ আবার তৈরি করুন — পয়েন্টার ফেরে, পেছনের পুরো হিস্ট্রিসহ।' },
      ],
      commands: ['git branch feature-login a1b2c3d', 'git log --oneline feature-login -n 3'],
    },
    alternatives: [
      {
        title: { en: 'If it was pushed, just track it again', bn: 'পুশ হলে শুধু আবার ট্র্যাক করুন' },
        detail: {
          en: 'A pushed branch still lives on the remote. Fetch and switch to its name — Git re-creates the local tracking branch automatically.',
          bn: 'পুশড ব্রাঞ্চ রিমোটে বেঁচে আছে। fetch করে নামে switch করুন — গিট লোকাল ট্র্যাকিং ব্রাঞ্চ স্বয়ংক্রিয় পুনরায় তৈরি করে।',
        },
        commands: ['git fetch', 'git switch feature-login'],
      },
    ],
    warnings: [
      { level: 'info', text: { en: 'Prefer git branch -d (safe delete) in future: it only deletes fully merged branches, so this accident becomes nearly impossible.', bn: 'ভবিষ্যতে git branch -d (নিরাপদ ডিলিট) ব্যবহার করুন: এটি শুধু সম্পূর্ণ মার্জড ব্রাঞ্চ মোছে, ফলে দুর্ঘটনা প্রায় অসম্ভব হয়।' } },
    ],
    verify: [
      { en: 'git branch lists it again and its log shows your work.', bn: 'git branch আবার দেখায় এবং log আপনার কাজ দেখায়।' },
    ],
    diagram: {
      before: ['main → C1 → C3', '(feature pointer deleted; F1 → F2 orphaned but present)'],
      after: ['main → C1 → C3', 'feature → F2 (pointer restored)'],
      caption: { en: 'Pointers are cheap to rebuild; commits were never gone.', bn: 'পয়েন্টার পুনর্নির্মাণ সস্তা; কমিট কখনো যায়নি।' },
    },
    commands: ['branch', 'log', 'switch', 'fetch'],
    lessons: [L.branch],
    scenarios: ['recover-commit', 'wrong-branch'],
    tags: ['delete branch', 'recover branch', 'reflog', '-D'],
    searchKeywords: ['deleted branch', 'recover branch', 'restore branch', 'branch -D accident', 'branch disappeared'],
    safeForBeginners: true,
    order: 14,
  },
  {
    id: 'git.troubleshooting.wrong-remote',
    slug: 'wrong-remote',
    title: { en: 'Push goes nowhere — wrong remote URL?', bn: 'পুশ কোথাও যায় না — ভুল রিমোট URL?' },
    shortDescription: {
      en: 'A mistyped or stale remote URL sends your work to the wrong place (or nowhere). Inspect, correct, verify.',
      bn: 'ভুল বা পুরনো রিমোট URL কাজ ভুল জায়গায় পাঠায় (বা কোথাও নয়)। পরিদর্শন, সংশোধন, যাচাই।',
    },
    category: 'remote-push',
    difficulty: 'beginner',
    severity: 'low',
    symptoms: [
      { en: 'Push fails with "repository not found", or succeeds but the code never appears on GitHub.', bn: 'পুশ "repository not found" বলে ব্যর্থ, বা সফল হলেও কোড গিটহাবে দেখায় না।' },
    ],
    sightings: [
      { command: 'git remote -v', output: 'origin\tgit@github.com:team/wrong-repo.git (fetch)\norigin\tgit@github.com:team/wrong-repo.git (push)' },
    ],
    diagnosis: {
      en: 'The name origin is just a nickname for a URL stored in your config. Cloning with a typo, renaming a repository, or copying config between projects leaves the nickname pointing somewhere wrong.',
      bn: 'origin নামটি কনফিগে সংরক্ষিত URL-এর ডাকনাম মাত্র। ভুলে ক্লোন, রিপোজিটরি পুনর্নাম, বা প্রজেক্টে কনফিগ কপি ডাকনামকে ভুল জায়গায় বসিয়ে দেয়।',
    },
    likelyCauses: [
      { en: 'Typo in the clone URL, or the repository was renamed/moved.', bn: 'ক্লোন URL-এ ভুল বানান, বা রিপোজিটরি পুনর্নাম/স্থানান্তর।' },
    ],
    checks: [
      { label: { en: 'Read the stored fetch and push URLs.', bn: 'সংরক্ষিত fetch ও push URL পড়ুন।' }, command: 'git remote -v' },
    ],
    fix: {
      title: { en: 'Point origin at the right repository', bn: 'origin সঠিক রিপোজিটরিতে বসান' },
      steps: [
        { en: 'Copy the correct URL from your GitHub repository page (SSH or HTTPS, matching your setup).', bn: 'গিটহাব রিপোজিটরি পেজ থেকে সঠিক URL কপি করুন (আপনার সেটআপে SSH বা HTTPS)।' },
        { en: 'Update the URL, then read it back to confirm.', bn: 'URL আপডেট করে ফিরে পড়ে নিশ্চিত হোন।' },
        { en: 'Fetch once to prove the connection works before pushing.', bn: 'পুশের আগে একবার fetch করে সংযোগ প্রমাণ করুন।' },
      ],
      commands: ['git remote set-url origin git@github.com:team/correct-repo.git', 'git remote -v', 'git fetch'],
    },
    alternatives: [],
    warnings: [],
    verify: [
      { en: 'git remote -v shows the correct URL and git fetch succeeds.', bn: 'git remote -v সঠিক URL দেখায় এবং git fetch সফল হয়।' },
    ],
    commands: ['remote', 'fetch'],
    lessons: [L.remote],
    scenarios: ['push-rejected', 'remote-branch-missing'],
    tags: ['remote', 'url', 'origin', 'repository not found'],
    searchKeywords: ['wrong remote', 'remote url', 'repository not found', 'set-url origin', 'push wrong repo'],
    safeForBeginners: true,
    order: 15,
  },
  {
    id: 'git.troubleshooting.pull-conflict',
    slug: 'pull-conflict',
    title: { en: 'My pull stopped with conflicts', bn: 'পুল কনফ্লিক্টে থেমে গেছে' },
    shortDescription: {
      en: 'Pull fetched fine — its integrate half needs decisions. Resolve like a merge (or continue a rebase), matching your pull mode.',
      bn: 'পুলের fetch ঠিক হয়েছে — integrate অর্ধেকে সিদ্ধান্ত দরকার। পুল মোড মিলিয়ে মার্জের মতো সমাধান (বা রিবেস continue) করুন।',
    },
    category: 'merge-conflicts',
    difficulty: 'intermediate',
    severity: 'medium',
    symptoms: [
      { en: 'git pull ends with CONFLICT markers instead of updating cleanly.', bn: 'পরিষ্কার আপডেটের বদলে git pull CONFLICT মার্কারে শেষ হয়।' },
    ],
    sightings: [
      { command: 'git pull origin main', output: 'Auto-merging app.js\nCONFLICT (content): Merge conflict in app.js\nAutomatic merge failed; fix conflicts and then commit the result.' },
    ],
    diagnosis: {
      en: 'Pull is fetch plus integrate. The fetch half already succeeded — new commits are safely local. Only the integrate half (merge by default, rebase with --rebase) hit overlapping edits and paused for your decision. Pull itself is not dangerous; it just surfaced a real divergence.',
      bn: 'পুল হলো fetch যোগ integrate। fetch অর্ধেক সফল — নতুন কমিট নিরাপদে লোকাল। শুধু integrate অর্ধেক (ডিফল্টে merge, --rebase-এ rebase) ওভারল্যাপিং এডিটে আপনার সিদ্ধান্তে থেমেছে। পুল নিজে বিপজ্জনক নয়; বাস্তব ডাইভারজেন্স সামনে এনেছে মাত্র।',
    },
    likelyCauses: [
      { en: 'You and a teammate edited the same lines before syncing.', bn: 'সিঙ্কের আগে আপনি ও সহকর্মী একই লাইন এডিট করেছেন।' },
    ],
    checks: [
      { label: { en: 'Confirm which mode pull used and which files conflict.', bn: 'পুল কোন মোডে ছিল ও কোন ফাইল কনফ্লিক্ট নিশ্চিত করুন।' }, command: 'git status' },
    ],
    fix: {
      title: { en: 'Finish the integration pull started', bn: 'পুল শুরু করা একীভূতকরণ শেষ করুন' },
      steps: [
        { en: 'Resolve each conflicted file (same marker technique as any merge).', bn: 'প্রতিটি কনফ্লিক্টেড ফাইল সমাধান করুন (যেকোনো মার্জের মার্কার কৌশল)।' },
        { en: 'Merge mode: stage everything and commit to complete the merge.', bn: 'মার্জ মোড: সব স্টেজ করে কমিট দিয়ে মার্জ সম্পন্ন করুন।' },
        { en: 'Rebase mode (you pulled with --rebase): stage and run git rebase --continue instead — never commit mid-rebase.', bn: 'রিবেস মোড (--rebase দিয়ে পুল): স্টেজ করে git rebase --continue চালান — রিবেসের মাঝে কখনো কমিট নয়।' },
      ],
      commands: ['git add app.js', 'git commit', 'git rebase --continue'],
    },
    alternatives: [
      {
        title: { en: 'Abort the integration, keep the download', bn: 'একীভূতকরণ বাতিল, ডাউনলোড রাখুন' },
        detail: {
          en: 'Merge mode: git merge --abort. Rebase mode: git rebase --abort. Either way your branch returns to pre-pull state while the fetched commits stay available for a calmer retry.',
          bn: 'মার্জ মোড: git merge --abort। রিবেস মোড: git rebase --abort। যেভাবেই ব্রাঞ্চ প্রি-পুল অবস্থায় ফেরে, fetch করা কমিট শান্ত পুনরায় চেষ্টার জন্য থাকে।',
        },
        commands: ['git merge --abort', 'git status'],
      },
    ],
    warnings: [
      { level: 'caution', text: { en: 'Match your finish to your pull mode. Committing during a rebase-mode pull (or continuing during a merge-mode pull) creates a mess that is tedious to unwind.', bn: 'সমাপ্তি পুল মোডের সাথে মিলান। রিবেস-মোড পুলে কমিট (বা মার্জ-মোড পুলে continue) জট তৈরি করে যা খোলা কষ্টকর।' } },
    ],
    verify: [
      { en: 'git status is clean and your branch contains both your work and the remote work.', bn: 'git status পরিষ্কার এবং ব্রাঞ্চে আপনার ও রিমোট উভয় কাজ আছে।' },
    ],
    commands: ['pull', 'fetch', 'status', 'merge'],
    lessons: [L.remote, 'github.team.resolve-collaboration-conflicts'],
    scenarios: ['merge-conflict', 'rebase-conflict'],
    simulator: { scenario: 'fetch-pull' },
    tags: ['pull', 'conflict', 'fetch', 'integrate'],
    searchKeywords: ['pull conflict', 'pull failed conflict', 'automatic merge failed pull', 'pull rebase conflict'],
    safeForBeginners: true,
    order: 16,
  },
  {
    id: 'git.troubleshooting.remote-branch-missing',
    slug: 'remote-branch-missing',
    title: { en: 'The branch exists on remote but not on my machine', bn: 'ব্রাঞ্চ রিমোটে আছে কিন্তু মেশিনে নেই' },
    shortDescription: {
      en: 'Your clone is older than the branch. Fetch to learn about it, then let Git create the local tracking branch.',
      bn: 'আপনার ক্লোন ব্রাঞ্চের পুরনো। fetch করে জানুন, তারপর গিটকে লোকাল ট্র্যাকিং ব্রাঞ্চ বানাতে দিন।',
    },
    category: 'collaboration',
    difficulty: 'beginner',
    severity: 'low',
    symptoms: [
      { en: 'A teammate says "just switch to feature-x" but git switch feature-x says the branch does not exist.', bn: 'সহকর্মী বলে "feature-x-তে যান" কিন্তু git switch feature-x বলে ব্রাঞ্চ নেই।' },
    ],
    sightings: [
      { command: 'git switch feature-x', output: "fatal: invalid reference: feature-x" },
    ],
    diagnosis: {
      en: 'Local branches and remote-tracking branches (origin/*) are separate lists. Your machine only knows branches that existed at clone/fetch time. The branch exists on the server; your remote-tracking list is simply out of date.',
      bn: 'লোকাল ব্রাঞ্চ ও রিমোট-ট্র্যাকিং ব্রাঞ্চ (origin/*) আলাদা তালিকা। মেশিন শুধু ক্লোন/fetch সময়ে থাকা ব্রাঞ্চ জানে। ব্রাঞ্চ সার্ভারে আছে; আপনার রিমোট-ট্র্যাকিং তালিকা পুরনো।',
    },
    likelyCauses: [
      { en: 'The branch was created remotely after your last fetch.', bn: 'শেষ fetch-এর পর ব্রাঞ্চ রিমোটে তৈরি হয়েছে।' },
    ],
    checks: [
      { label: { en: 'Update your picture of the remote.', bn: 'রিমোটের ছবি আপডেট করুন।' }, command: 'git fetch' },
      { label: { en: 'List what the remote actually has.', bn: 'রিমোটে আসলে কী আছে তালিকা করুন।' }, command: 'git branch -r' },
    ],
    fix: {
      title: { en: 'Fetch, then switch by name', bn: 'Fetch, তারপর নামে switch' },
      steps: [
        { en: 'Fetch so origin/* includes the new branch.', bn: 'fetch করুন যাতে origin/*-এ নতুন ব্রাঞ্চ আসে।' },
        { en: 'Switch using just the short name — modern Git creates the local tracking branch for you.', bn: 'শুধু ছোট নামে switch করুন — আধুনিক গিট লোকাল ট্র্যাকিং ব্রাঞ্চ বানিয়ে দেয়।' },
      ],
      commands: ['git fetch', 'git branch -r', 'git switch feature-x'],
    },
    alternatives: [
      {
        title: { en: 'Explicit tracking (older Git or custom names)', bn: 'স্পষ্ট ট্র্যাকিং (পুরনো গিট বা কাস্টম নাম)' },
        detail: {
          en: 'Create your own local name tracking the remote explicitly. Useful when you want a different local name or an old Git needs spelling out.',
          bn: 'রিমোট স্পষ্ট ট্র্যাক করে নিজের লোকাল নাম তৈরি করুন। ভিন্ন লোকাল নাম চাইলে বা পুরনো গিটে কাজে লাগে।',
        },
        commands: ['git switch -c my-copy origin/feature-x'],
      },
    ],
    warnings: [],
    verify: [
      { en: 'git status shows "On branch feature-x" tracking origin/feature-x.', bn: 'git status "On branch feature-x" ও origin/feature-x ট্র্যাকিং দেখায়।' },
    ],
    commands: ['fetch', 'branch', 'switch'],
    lessons: [L.remote],
    scenarios: ['behind-remote', 'wrong-remote'],
    tags: ['remote branch', 'tracking', 'fetch', 'checkout remote'],
    searchKeywords: ['branch not found locally', 'remote branch missing', 'switch remote branch', 'branch -r', 'track remote branch', 'invalid reference'],
    safeForBeginners: true,
    order: 17,
  },
  {
    id: 'git.troubleshooting.behind-remote',
    slug: 'behind-remote',
    title: { en: '"Your branch is behind origin" — what does that mean?', bn: '"Your branch is behind origin" — মানে কী?' },
    shortDescription: {
      en: 'Behind is a position, not a failure. The remote has commits you lack — look at them first, then catch up deliberately.',
      bn: 'Behind অবস্থান, ব্যর্থতা নয়। রিমোটে আপনার নেই এমন কমিট আছে — আগে দেখুন, তারপর সচেতনভাবে এগিয়ে যান।',
    },
    category: 'remote-push',
    difficulty: 'beginner',
    severity: 'low',
    symptoms: [
      { en: 'git status says your branch is behind origin/main by N commits.', bn: 'git status বলে ব্রাঞ্চ origin/main থেকে N কমিট পিছিয়ে।' },
    ],
    sightings: [
      { command: 'git status', output: 'On branch main\nYour branch is behind \'origin/main\' by 2 commits, and can be fast-forwarded.\n  (use "git pull" to update your local branch)' },
    ],
    diagnosis: {
      en: 'Three pointers tell the story: your branch, the remote-tracking ref (origin/main, your last fetch’s photo), and the actual remote. "Behind" means origin/main points at commits your branch does not contain yet. If it also says "can be fast-forwarded", you have no conflicting work — catching up is trivial.',
      bn: 'তিনটি পয়েন্টার গল্প বলে: আপনার ব্রাঞ্চ, রিমোট-ট্র্যাকিং রেফ (origin/main, শেষ fetch-এর ছবি), এবং আসল রিমোট। "Behind" মানে origin/main এমন কমিটে যা ব্রাঞ্চে এখনো নেই। "can be fast-forwarded" থাকলে বিরোধী কাজ নেই — এগিয়ে যাওয়া তুচ্ছ।',
    },
    likelyCauses: [
      { en: 'Teammates pushed while you were working elsewhere.', bn: 'আপনি অন্যত্র কাজ করার সময় সহকর্মীরা পুশ করেছে।' },
    ],
    checks: [
      { label: { en: 'Refresh your photo of the remote.', bn: 'রিমোটের ছবি রিফ্রেশ করুন।' }, command: 'git fetch' },
      { label: { en: 'Read the commits you are missing before moving.', bn: 'সরার আগে অনুপস্থিত কমিট পড়ুন।' }, command: 'git log HEAD..origin/main --oneline' },
    ],
    fix: {
      title: { en: 'Look first, then catch up', bn: 'আগে দেখুন, তারপর এগোন' },
      steps: [
        { en: 'Fetch and read the missing commits — never pull blind if the message surprises you.', bn: 'fetch করে অনুপস্থিত কমিট পড়ুন — বার্তা চমকে দিলে অন্ধভাবে পুল নয়।' },
        { en: 'If the log looks like work you want, pull to fast-forward your branch onto it.', bn: 'log কাঙ্ক্ষিত কাজ মনে হলে পুল করে ব্রাঞ্চ ফাস্ট-ফরোয়ার্ড করুন।' },
      ],
      commands: ['git fetch', 'git log HEAD..origin/main --oneline', 'git pull'],
    },
    alternatives: [],
    warnings: [
      { level: 'info', text: { en: 'Being behind is routine, not an emergency. The skill is reading before integrating — exactly what this sequence trains.', bn: 'পিছিয়ে থাকা নিয়মিত, জরুরি নয়। দক্ষতা হলো একীভূতের আগে পড়া — এই ক্রম ঠিক সেটাই শেখায়।' } },
    ],
    verify: [
      { en: 'git status says up to date with origin.', bn: 'git status origin-এর সাথে আপ টু ডেট বলে।' },
    ],
    diagram: {
      before: ['main → C1 (you)', 'origin/main → C1 → C2 → C3 (teammates)'],
      after: ['main → C1 → C2 → C3 (fast-forwarded)', 'origin/main → C3'],
      caption: { en: 'Catching up slides your pointer forward — nothing rewritten.', bn: 'এগিয়ে যাওয়া পয়েন্টার সামনে নেয় — কিছু পুনর্লিখিত নয়।' },
    },
    commands: ['fetch', 'pull', 'status', 'log'],
    lessons: [L.remote, 'github.team.sync-before-work', 'git.internals.remote-tracking-references'],
    scenarios: ['push-rejected', 'diverged'],
    simulator: { scenario: 'fetch-pull' },
    tags: ['behind', 'origin', 'fast-forward', 'pull'],
    searchKeywords: ['branch is behind', 'behind origin', 'can be fast-forwarded', 'update local branch', 'catch up remote'],
    safeForBeginners: true,
    order: 18,
  },
  {
    id: 'git.troubleshooting.diverged',
    slug: 'diverged',
    title: { en: '"Your branch and origin have diverged" — pick a strategy', bn: '"Branch ও origin diverged" — কৌশল বেছে নিন' },
    shortDescription: {
      en: 'Both sides moved. Neither fast-forward works — you must choose: merge the histories or replay yours on top.',
      bn: 'উভয় দিক এগিয়েছে। কোনো ফাস্ট-ফরোয়ার্ড চলবে না — বেছে নিন: হিস্ট্রি মার্জ বা আপনারটা ওপরে রিপ্লে।',
    },
    category: 'collaboration',
    difficulty: 'intermediate',
    severity: 'medium',
    symptoms: [
      { en: 'git status reports ahead AND behind counts at once.', bn: 'git status একসাথে ahead ও behind সংখ্যা জানায়।' },
    ],
    sightings: [
      { command: 'git status', output: 'On branch feature\nYour branch and \'origin/feature\' have diverged,\nand have 1 and 2 different commits each, respectively.' },
    ],
    diagnosis: {
      en: 'Your branch grew commit L1 while the remote grew R1 (and maybe more) from the same base C2. No pointer can simply slide forward — the two lines must be joined (merge) or one replayed onto the other (rebase). The choice shapes permanent history, so it deserves a minute of thought.',
      bn: 'একই বেস C2 থেকে ব্রাঞ্চে L1, রিমোটে R1 (হয়তো আরও) বেড়েছে। কোনো পয়েন্টার শুধু এগোতে পারে না — দুটি লাইন যুক্ত (merge) বা একটি অন্যটির ওপর রিপ্লে (rebase) করতে হবে। পছন্দ স্থায়ী হিস্ট্রি গড়ে, তাই এক মিনিট ভাবা উচিত।',
    },
    likelyCauses: [
      { en: 'Parallel work on the same branch, or a rebase/amend after pushing.', bn: 'একই ব্রাঞ্চে সমান্তরাল কাজ, বা পুশের পর রিবেস/amend।' },
    ],
    checks: [
      { label: { en: 'Draw both sides before choosing.', bn: 'বাছার আগে দুটি দিক আঁকুন।' }, command: 'git log --oneline --graph --all -n 8' },
      { label: { en: 'Confirm nobody rewrote shared history without telling you.', bn: 'কেউ না জানিয়ে শেয়ার্ড হিস্ট্রি পুনর্লিখন করেনি নিশ্চিত হোন।' }, command: 'git fetch' },
    ],
    fix: {
      title: { en: 'Merge: the honest, always-safe join', bn: 'মার্জ: সৎ, সর্বদা-নিরাপদ যুক্তি' },
      steps: [
        { en: 'Merge origin into your branch, creating a merge commit that preserves both lines exactly.', bn: 'origin ব্রাঞ্চে মার্জ করে উভয় লাইন হুবহু সংরক্ষণকারী মার্জ কমিট বানান।' },
        { en: 'Resolve any conflicts with the standard technique, then push the joined history.', bn: 'মানক কৌশলে কনফ্লিক্ট সমাধান করে যুক্ত হিস্ট্রি পুশ করুন।' },
      ],
      commands: ['git pull', 'git push'],
    },
    alternatives: [
      {
        title: { en: 'Rebase: the clean line (private branches only)', bn: 'রিবেস: পরিষ্কার লাইন (শুধু ব্যক্তিগত ব্রাঞ্চ)' },
        detail: {
          en: 'Replay your commits onto the remote tip for linear history. Only when the branch is yours alone — then push with --force-with-lease and tell anyone watching the branch.',
          bn: 'লিনিয়ার হিস্ট্রিতে রিমোট টিপে কমিট রিপ্লে করুন। শুধু ব্রাঞ্চ একান্ত আপনার হলে — তারপর --force-with-lease দিয়ে পুশ করে ব্রাঞ্চ দেখা সবাইকে জানান।',
        },
        commands: ['git pull --rebase', 'git push --force-with-lease'],
      },
    ],
    warnings: [
      { level: 'caution', text: { en: 'Rebasing a shared diverged branch multiplies confusion: every teammate must re-sync. Default to merge unless the branch is provably private.', bn: 'শেয়ার্ড ডাইভার্জড ব্রাঞ্চ রিবেস বিভ্রান্তি বাড়ায়: প্রতিটি সহকর্মীকে পুনরায় সিঙ্ক করতে হয়। ব্রাঞ্চ প্রমাণিত ব্যক্তিগত না হলে মার্জ ডিফল্ট করুন।' } },
    ],
    verify: [
      { en: 'git status is clean and up to date; the graph shows one joined line.', bn: 'git status পরিষ্কার ও আপ টু ডেট; গ্রাফ একটি যুক্ত লাইন দেখায়।' },
    ],
    diagram: {
      before: ['      L1 (you)', '     /', 'C1 → C2', '     \\', '      R1 (remote)'],
      after: ['merge:  C1 → C2 → M (parents L1, R1)', 'rebase: C1 → C2 → R1 → L1′ (only if private)'],
      caption: { en: 'Same fork, two philosophies: preserve both lines, or replay one.', bn: 'একই ফোর্ক, দুই দর্শন: উভয় লাইন সংরক্ষণ, বা একটি রিপ্লে।' },
    },
    commands: ['pull', 'merge', 'rebase', 'status', 'log'],
    lessons: [L.remote, L.branch, 'github.team.resolve-collaboration-conflicts', 'git.internals.dag-structure', 'git.internals.rebase-rewrites-history'],
    scenarios: ['behind-remote', 'push-rejected', 'rebase-conflict'],
    simulator: { scenario: 'fetch-pull' },
    tags: ['diverged', 'ahead behind', 'merge vs rebase', 'strategy'],
    searchKeywords: ['diverged', 'have diverged', 'ahead and behind', 'different commits each', 'merge or rebase'],
    safeForBeginners: false,
    order: 19,
  },
  {
    id: 'git.troubleshooting.reset-hard',
    slug: 'reset-hard',
    title: { en: 'I ran git reset --hard — what did I lose?', bn: 'git reset --hard চালিয়ে ফেলেছি — কী হারালাম?' },
    shortDescription: {
      en: 'Committed work is still rescuable via reflog; uncommitted edits are likely gone. Learn the boundary, then recover what remains.',
      bn: 'কমিটেড কাজ reflog দিয়ে উদ্ধারযোগ্য; আনকমিটেড এডিট সম্ভবত গেছে। সীমা শিখুন, তারপর অবশিষ্ট উদ্ধার করুন।',
    },
    category: 'undo-recovery',
    difficulty: 'intermediate',
    severity: 'high',
    symptoms: [
      { en: 'After git reset --hard, commits and uncommitted edits vanished from git log and git status.', bn: 'git reset --hard-এর পর কমিট ও আনকমিটেড এডিট git log ও git status থেকে উধাও।' },
    ],
    sightings: [
      { command: 'git reset --hard HEAD~2', output: 'HEAD is now at c1d2e3f Old work' },
    ],
    diagnosis: {
      en: 'Two things happened at once: the branch pointer jumped back (abandoning commits — recoverable through the reflog), AND the index plus working tree were overwritten to match (destroying uncommitted edits — no Git copy exists to restore). The critical distinction: reflog rescues pointers and commits, never arbitrary working-tree data.',
      bn: 'একসাথে দুটি ঘটেছে: ব্রাঞ্চ পয়েন্টার পিছিয়ে গেছে (কমিট পরিত্যক্ত — reflog দিয়ে উদ্ধারযোগ্য), এবং ইনডেক্স যোগ ওয়ার্কিং ট্রি মিলিয়ে ওভাররাইট হয়েছে (আনকমিটেড এডিট ধ্বংস — ফেরানোর গিট কপি নেই)। মূল পার্থক্য: reflog পয়েন্টার ও কমিট উদ্ধার করে, কখনো খুচরো ওয়ার্কিং-ট্রি ডেটা নয়।',
    },
    likelyCauses: [
      { en: 'Copy-pasting reset --hard as a generic "undo", or targeting the wrong ref.', bn: 'সাধারণ "আনডু" হিসেবে reset --hard কপি-পেস্ট, বা ভুল ref লক্ষ্য।' },
    ],
    checks: [
      { label: { en: 'Check whether the abandoned commits are still referenced.', bn: 'পরিত্যক্ত কমিট এখনো রেফারেন্সড কিনা দেখুন।' }, command: 'git reflog --oneline -n 10' },
      { label: { en: 'Confirm the working tree state.', bn: 'ওয়ার্কিং ট্রি অবস্থা নিশ্চিত করুন।' }, command: 'git status' },
    ],
    fix: {
      title: { en: 'Rescue the commits; mourn the edits', bn: 'কমিট উদ্ধার করুন; এডিটের শোক করুন' },
      steps: [
        { en: 'Find the abandoned tip in the reflog and point a recovery branch at it.', bn: 'reflog-এ পরিত্যক্ত টিপ খুঁজে সেখানে রিকভারি ব্রাঞ্চ বসান।' },
        { en: 'Cherry-pick or merge what you still need back onto your working branch.', bn: 'দরকারি অংশ cherry-pick বা মার্জ করে ওয়ার্কিং ব্রাঞ্চে ফেরান।' },
        { en: 'For uncommitted edits: check editor local history and backups now — Git cannot help there.', bn: 'আনকমিটেড এডিটে: এখনই এডিটর লোকাল হিস্ট্রি ও ব্যাকআপ দেখুন — সেখানে গিট সাহায্য করতে পারে না।' },
      ],
      commands: ['git reflog --oneline -n 10', 'git branch recovery a1b2c3d', 'git cherry-pick a1b2c3d'],
    },
    alternatives: [
      {
        title: { en: 'Prevent the next one', bn: 'পরেরটি প্রতিরোধ করুন' },
        detail: {
          en: 'Make --hard unnecessary: commit early and often (even "WIP" commits you squash later), and prefer --soft/--mixed which never touch working-tree files. A committed mistake is a recoverable mistake.',
          bn: '--hard অপ্রয়োজনীয় বানান: তাড়াতাড়ি ও ঘন ঘন কমিট করুন (পরে squash করা "WIP" কমিটও), এবং --soft/--mixed ব্যবহার করুন যা ওয়ার্কিং-ট্রি ফাইলে হাত দেয় না। কমিটেড ভুল উদ্ধারযোগ্য ভুল।',
        },
        commands: ['git reset --soft HEAD~1'],
      },
    ],
    warnings: [
      { level: 'danger', text: { en: 'Uncommitted working-tree edits destroyed by --hard have no Git backup. Reflog, fsck, and prayers cannot reconstruct bytes Git never stored.', bn: '--hard-এ ধ্বংস আনকমিটেড ওয়ার্কিং-ট্রি এডিটের গিট ব্যাকআপ নেই। reflog, fsck বা প্রার্থনা গিট কখনো সংরক্ষণ না করা বাইট পুনর্গঠন করতে পারে না।' } },
    ],
    verify: [
      { en: 'Recovery branch contains the rescued commits; you can state exactly what, if anything, is permanently gone.', bn: 'রিকভারি ব্রাঞ্চে উদ্ধারকৃত কমিট আছে; স্থায়ীভাবে কী গেছে ঠিক বলতে পারেন।' },
    ],
    commands: ['reset', 'status', 'log'],
    lessons: [L.commit, L.local, 'git.internals.what-is-a-reference', 'git.internals.reflog'],
    scenarios: ['recover-commit', 'deleted-changes', 'undo-last-commit'],
    tags: ['reset hard', 'lost work', 'reflog', 'destructive'],
    searchKeywords: ['reset hard', 'accidentally reset', 'reset hard lost', 'undo reset hard', 'HEAD is now at'],
    safeForBeginners: false,
    order: 20,
  },
];

export const DECISION_TREES: DecisionTree[] = [
  {
    id: 'undo-helper',
    title: { en: 'I want to undo something', bn: 'কিছু বাতিল করতে চাই' },
    subtitle: { en: 'Answer one question — land on the right recovery guide.', bn: 'একটি প্রশ্নের উত্তর দিন — সঠিক রিকভারি গাইডে পৌঁছান।' },
    startNode: 'undo-q1',
    nodes: [
      {
        id: 'undo-q1',
        question: { en: 'What are you trying to undo?', bn: 'কী বাতিল করতে চান?' },
        options: [
          { label: { en: 'Changes in my files (not staged, not committed)', bn: 'ফাইলের পরিবর্তন (স্টেজড নয়, কমিটেড নয়)' }, next: 'scenario:deleted-changes' },
          { label: { en: 'Staged changes I am not ready to commit', bn: 'স্টেজড পরিবর্তন যা কমিট করতে প্রস্তুত নই' }, next: 'scenario:staged-file' },
          { label: { en: 'My last commit (not pushed yet)', bn: 'শেষ কমিট (এখনো পুশ হয়নি)' }, next: 'scenario:undo-last-commit' },
          { label: { en: 'A commit I already pushed', bn: 'ইতিমধ্যে পুশ করা কমিট' }, next: 'undo-pushed-q' },
          { label: { en: 'Rewrite shared history (rebase / force-push territory)', bn: 'শেয়ার্ড হিস্ট্রি পুনর্লিখন (রিবেস / ফোর্স-পুশ এলাকা)' }, next: 'scenario:force-push' },
        ],
      },
      {
        id: 'undo-pushed-q',
        question: { en: 'Pushed history needs care. Which approach fits?', bn: 'পুশড হিস্ট্রিতে যত্ন দরকার। কোন পদ্ধতি মানায়?' },
        options: [
          { label: { en: 'Revert it safely with a new commit (recommended)', bn: 'নতুন কমিটে নিরাপদে revert করুন (প্রস্তাবিত)' }, next: 'scenario:undo-last-commit' },
          { label: { en: 'Rewrite it — only if the branch is truly private', bn: 'পুনর্লিখন করুন — শুধু ব্রাঞ্চ সত্যিই ব্যক্তিগত হলে' }, next: 'scenario:force-push' },
        ],
      },
    ],
  },
  {
    id: 'push-helper',
    title: { en: 'My push was rejected', bn: 'পুশ প্রত্যাখ্যাত হয়েছে' },
    subtitle: { en: 'Match the message you saw — get the matching fix.', bn: 'দেখা বার্তা মিলান — মানানসই সমাধান পান।' },
    startNode: 'push-q1',
    nodes: [
      {
        id: 'push-q1',
        question: { en: 'What does Git tell you?', bn: 'গিট কী বলে?' },
        options: [
          { label: { en: '"rejected", "non-fast-forward" or "fetch first"', bn: '"rejected", "non-fast-forward" বা "fetch first"' }, next: 'scenario:push-rejected' },
          { label: { en: '"Your branch is behind origin"', bn: '"Your branch is behind origin"' }, next: 'scenario:behind-remote' },
          { label: { en: '"Your branch and origin have diverged"', bn: '"Your branch and origin have diverged"' }, next: 'scenario:diverged' },
          { label: { en: 'Conflicts appeared during pull', bn: 'পুল চলাকালে কনফ্লিক্ট দেখা দিয়েছে' }, next: 'scenario:pull-conflict' },
        ],
      },
    ],
  },
];
