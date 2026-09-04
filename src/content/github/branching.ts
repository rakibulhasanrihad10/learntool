import { CurriculumLesson } from '@/types/content';

/**
 * Module 3 — Branch-Based Development (subject: github)
 * Why branches, feature branches, naming, staying updated, merging,
 * and deleting merged branches — with GitHub collaboration in view.
 */
export const GITHUB_BRANCHING_LESSONS: CurriculumLesson[] = [
  {
    id: 'github.branching.why-use-branches',
    moduleId: 'github-branching',
    slug: 'why-use-branches',
    order: 1,
    durationMinutes: 6,
    difficulty: 'beginner',
    title: 'Why Use Branches?',
    titleBn: 'ব্রাঞ্চ কেন ব্যবহার করবেন?',
    summary: 'Branches isolate work in progress so main always stays releasable — the foundation every team workflow builds on.',
    summaryBn: 'ব্রাঞ্চ চলমান কাজ আলাদা রাখে যাতে main সবসময় রিলিজযোগ্য থাকে — প্রতিটি টিম ওয়ার্কফ্লোর ভিত্তি।',
    learningObjectives: [
      'Explain what problem branches solve for teams',
      'Describe main as the always-releasable line',
      'Contrast branching with committing straight to main',
    ],
    learningObjectivesBn: [
      'ব্রাঞ্চ টিমের কোন সমস্যা সমাধান করে তা ব্যাখ্যা করা',
      'main-কে সবসময়-রিলিজযোগ্য লাইন হিসেবে বর্ণনা করা',
      'সরাসরি main-এ কমিটের সাথে ব্রাঞ্চিংয়ের তুলনা করা',
    ],
    keyTakeaways: [
      'A branch is a movable pointer — creating one costs almost nothing.',
      'Isolated branches let experiments fail without endangering main.',
      'Pull requests review branches, so branch quality becomes team quality.',
    ],
    sections: [
      {
        id: 'sec-why',
        title: 'Isolation Makes Teamwork Safe',
        titleBn: 'আলাদাকরণ টিমওয়ার্ক নিরাপদ করে',
        blocks: [
          {
            type: 'paragraph',
            text: 'Without branches, every developer writes directly onto the same line of history — one broken commit blocks everyone. Branches give each unit of work its own timeline that joins main only after review. The cost of a branch is a 41-byte file; the value is fearless parallel work.',
            textBn: 'ব্রাঞ্চ ছাড়া প্রতিটি ডেভেলপার একই হিস্ট্রি লাইনে লেখে — একটি ভাঙা কমিট সবাইকে আটকায়। ব্রাঞ্চ প্রতিটি কাজের নিজস্ব টাইমলাইন দেয় যা রিভিউয়ের পর main-এ যুক্ত হয়। ব্রাঞ্চের খরচ ৪১-বাইট ফাইল; মূল্য নির্ভীক সমান্তরাল কাজ।',
          },
        ],
      },
    ],
    relatedCommands: ['git.branch', 'git.switch'],
    relatedLessons: ['git.fundamentals.branch'],
  },
  {
    id: 'github.branching.feature-branches',
    moduleId: 'github-branching',
    slug: 'feature-branches',
    order: 2,
    durationMinutes: 8,
    difficulty: 'beginner',
    title: 'Feature Branches',
    titleBn: 'ফিচার ব্রাঞ্চ',
    summary: 'One branch per unit of work: create it from fresh main, commit there, push it, and open a pull request from it.',
    summaryBn: 'প্রতি কাজে একটি ব্রাঞ্চ: নতুন main থেকে তৈরি, সেখানে কমিট, পুশ, ও সেখান থেকে পুল রিকোয়েস্ট খুলুন।',
    learningObjectives: [
      'Create a feature branch from updated main',
      'Keep all related commits on the branch',
      'Push the branch to share it for review',
    ],
    learningObjectivesBn: [
      'আপডেটেড main থেকে ফিচার ব্রাঞ্চ তৈরি করা',
      'সম্পর্কিত সব কমিট ব্রাঞ্চে রাখা',
      'রিভিউয়ে শেয়ার করতে ব্রাঞ্চ পুশ করা',
    ],
    keyTakeaways: [
      'Start every branch from freshly pulled main to minimize later conflicts.',
      'A feature branch should contain one reviewable unit of work.',
      'Push early so the branch is backed up and visible — pushing is not merging.',
    ],
    sections: [
      {
        id: 'sec-lifecycle',
        title: 'A Branch’s Short Life',
        titleBn: 'ব্রাঞ্চের সংক্ষিপ্ত জীবন',
        blocks: [
          {
            type: 'command',
            command: 'git switch -c feature/login',
            description: 'Create and move to the feature branch in one step.',
            descriptionBn: 'এক ধাপে ফিচার ব্রাঞ্চ তৈরি করে সেখানে যান।',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Sync main, then branch from it.',
              'Commit the feature in small, logical steps.',
              'Push the branch with -u to back it up and share it.',
              'Open a pull request when the work is reviewable.',
              'Merge, then delete the branch — its job is done.',
            ],
            itemsBn: [
              'main সিঙ্ক করে সেখান থেকে ব্রাঞ্চ করুন।',
              'ছোট, যৌক্তিক ধাপে ফিচার কমিট করুন।',
              '-u দিয়ে ব্রাঞ্চ পুশ করে ব্যাকআপ ও শেয়ার করুন।',
              'কাজ রিভিউযোগ্য হলে পুল রিকোয়েস্ট খুলুন।',
              'মার্জ করে ব্রাঞ্চ মুছুন — কাজ শেষ।',
            ],
          },
        ],
      },
    ],
    relatedCommands: ['git.switch', 'git.branch', 'git.push', 'git.commit'],
    relatedLessons: ['git.fundamentals.branch'],
  },
  {
    id: 'github.branching.naming-branches',
    moduleId: 'github-branching',
    slug: 'naming-branches',
    order: 3,
    durationMinutes: 6,
    difficulty: 'beginner',
    title: 'Naming Branches',
    titleBn: 'ব্রাঞ্চের নামকরণ',
    summary: 'Branch names are team communication. Short, lowercase, hyphenated names with a type prefix scale from solo projects to large teams.',
    summaryBn: 'ব্রাঞ্চ নাম টিম যোগাযোগ। টাইপ প্রিফিক্সসহ সংক্ষিপ্ত, ছোট হাতের, হাইফেনযুক্ত নাম একক প্রজেক্ট থেকে বড় টিমে স্কেল করে।',
    learningObjectives: [
      'Apply a type-prefix naming convention',
      'Explain why branch names should be short and searchable',
      'Avoid names that confuse tooling or teammates',
    ],
    learningObjectivesBn: [
      'টাইপ-প্রিফিক্স নামকরণ প্রচলন প্রয়োগ করা',
      'ব্রাঞ্চ নাম সংক্ষিপ্ত ও সার্চযোগ্য হওয়া উচিত কেন তা ব্যাখ্যা করা',
      'টুলিং বা সহকর্মীকে বিভ্রান্ত করে এমন নাম এড়ানো',
    ],
    keyTakeaways: [
      'Prefix with intent: feature/, fix/, hotfix/, docs/, chore/, experiment/.',
      'Use lowercase with hyphens; avoid spaces and special characters.',
      'Reference the issue number when your team tracks work that way.',
    ],
    sections: [
      {
        id: 'sec-naming',
        title: 'Names Teammates Can Scan',
        titleBn: 'সহকর্মীরা স্ক্যান করতে পারে এমন নাম',
        blocks: [
          {
            type: 'code',
            code: 'feature/login-password-reset\nfix/header-overlap-mobile\nhotfix/payment-timeout\ndocs/api-auth-guide',
            language: 'text',
          },
          {
            type: 'paragraph',
            text: 'A reviewer deciding which of twelve open branches to look at first reads names, not commits. feature/login-password-reset promises scope at a glance; temp-final-v2-fixed promises confusion.',
            textBn: 'বারোটি খোলা ব্রাঞ্চের কোনটি আগে দেখবেন ঠিক করা রিভিউয়ার কমিট নয়, নাম পড়েন। feature/login-password-reset এক নজরে স্কোপ জানায়; temp-final-v2-fixed বিভ্রান্তি জানায়।',
          },
        ],
      },
    ],
    relatedLessons: ['github.branching.feature-branches'],
  },
  {
    id: 'github.branching.keep-branches-updated',
    moduleId: 'github-branching',
    slug: 'keep-branches-updated',
    order: 4,
    durationMinutes: 8,
    difficulty: 'intermediate',
    title: 'Keeping Branches Updated',
    titleBn: 'ব্রাঞ্চ হালনাগাদ রাখা',
    summary: 'Long-lived branches rot. Regularly fold main into your branch — by merge or rebase — so the final pull request stays small and honest.',
    summaryBn: 'দীর্ঘজীবী ব্রাঞ্চ পচে। নিয়মিত main ব্রাঞ্চে ভাঁজুন — মার্জ বা রিবেসে — যাতে চূড়ান্ত পুল রিকোয়েস্ট ছোট ও সৎ থাকে।',
    learningObjectives: [
      'Explain why stale branches cause painful merges',
      'Update a branch with merge and with rebase',
      'Choose between the two per team convention',
    ],
    learningObjectivesBn: [
      'পুরনো ব্রাঞ্চ কেন কষ্টকর মার্জ ঘটায় তা ব্যাখ্যা করা',
      'মার্জ ও রিবেসে ব্রাঞ্চ আপডেট করা',
      'টিম প্রচলনে দুটির মধ্যে বেছে নেওয়া',
    ],
    keyTakeaways: [
      'Update from main often — small integrations beat one giant merge.',
      'Merging main in preserves history; rebasing onto main keeps it linear.',
      'Never rebase commits teammates already pulled.',
    ],
    sections: [
      {
        id: 'sec-update',
        title: 'Two Ways to Stay Fresh',
        titleBn: 'সতেজ থাকার দুটি উপায়',
        blocks: [
          {
            type: 'command',
            command: 'git fetch origin && git merge origin/main',
            description: 'Fold the latest main into your branch, recording a merge.',
            descriptionBn: 'সর্বশেষ main ব্রাঞ্চে ভাঁজ করে মার্জ রেকর্ড করুন।',
          },
          {
            type: 'command',
            command: 'git fetch origin && git rebase origin/main',
            description: 'Replay your commits onto the latest main for a linear story.',
            descriptionBn: 'লিনিয়ার গল্পে সর্বশেষ main-এর ওপর কমিট রিপ্লে করুন।',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Rebase rewrites',
            titleBn: 'রিবেস পুনর্লিখন করে',
            text: 'Rebase gives your branch new commit identities, so it requires a careful push afterwards and is only safe on branches nobody else has pulled.',
            textBn: 'রিবেস ব্রাঞ্চে নতুন কমিট পরিচয় দেয়, তাই পরে সতর্ক পুশ দরকার এবং শুধু অন্য কেউ পুল করেনি এমন ব্রাঞ্চে নিরাপদ।',
          },
        ],
      },
    ],
    relatedCommands: ['git.fetch', 'git.merge', 'git.rebase', 'git.pull'],
    relatedLessons: ['git.fundamentals.branch', 'git.fundamentals.remote-repository'],
  },
  {
    id: 'github.branching.merging-branches',
    moduleId: 'github-branching',
    slug: 'merging-branches',
    order: 5,
    durationMinutes: 8,
    difficulty: 'beginner',
    title: 'Merging Branches',
    titleBn: 'ব্রাঞ্চ মার্জ করা',
    summary: 'Merging joins two lines of history. Learn fast-forwards, merge commits, and why GitHub pull requests usually do the merging for you.',
    summaryBn: 'মার্জিং ইতিহাসের দুটি লাইন যুক্ত করে। ফাস্ট-ফরোয়ার্ড, মার্জ কমিট শিখুন এবং কেন গিটহাব পুল রিকোয়েস্ট সাধারণত মার্জ করে দেয়।',
    learningObjectives: [
      'Distinguish fast-forward from true merges',
      'Explain what a merge commit records',
      'Describe where merging happens in a PR workflow',
    ],
    learningObjectivesBn: [
      'ফাস্ট-ফরোয়ার্ড ও সত্যিকারের মার্জের পার্থক্য করা',
      'মার্জ কমিট কী রেকর্ড করে তা ব্যাখ্যা করা',
      'PR ওয়ার্কফ্লোতে মার্জ কোথায় হয় তা বর্ণনা করা',
    ],
    keyTakeaways: [
      'Fast-forward slides a pointer; a true merge records a join commit with two parents.',
      'On GitHub, clicking Merge runs the same operation on the server.',
      'A clean, updated branch merges without drama — staleness causes conflicts.',
    ],
    sections: [
      {
        id: 'sec-merge',
        title: 'Joining Histories',
        titleBn: 'ইতিহাস যুক্ত করা',
        blocks: [
          {
            type: 'command',
            command: 'git switch main && git merge feature/login',
            description: 'Join the reviewed branch into main locally.',
            descriptionBn: 'রিভিউড ব্রাঞ্চ লোকালি main-এ যুক্ত করুন।',
          },
          {
            type: 'paragraph',
            text: 'In team workflows you rarely type this yourself: the pull request’s Merge button performs the join on GitHub after review and checks pass. Understanding the operation still matters — it tells you what that button actually does to history.',
            textBn: 'টিম ওয়ার্কফ্লোতে নিজে এটা টাইপ কমই করেন: পুল রিকোয়েস্টের Merge বোতাম রিভিউ ও চেক পাসের পর গিটহাবে যুক্ত করে। অপারেশন বোঝা তবু জরুরি — বোতাম হিস্ট্রিতে আসলে কী করে তা জানায়।',
          },
        ],
      },
    ],
    relatedCommands: ['git.merge', 'git.log'],
    relatedLessons: ['git.fundamentals.branch', 'github.pr.merging-pr'],
  },
  {
    id: 'github.branching.delete-merged-branches',
    moduleId: 'github-branching',
    slug: 'delete-merged-branches',
    order: 6,
    durationMinutes: 6,
    difficulty: 'beginner',
    title: 'Deleting Merged Branches',
    titleBn: 'মার্জড ব্রাঞ্চ মোছা',
    summary: 'A merged branch has served its purpose. Delete it locally and remotely to keep the branch list honest — safely.',
    summaryBn: 'মার্জড ব্রাঞ্চের কাজ শেষ। ব্রাঞ্চ তালিকা সৎ রাখতে লোকালি ও রিমোটে নিরাপদে মুছুন।',
    learningObjectives: [
      'Delete merged branches locally and on GitHub',
      'Explain why -d is safe and -D is not',
      'Prune stale remote-tracking references',
    ],
    learningObjectivesBn: [
      'লোকালি ও গিটহাবে মার্জড ব্রাঞ্চ মোছা',
      'কেন -d নিরাপদ ও -D নয় তা ব্যাখ্যা করা',
      'পুরনো রিমোট-ট্র্যাকিং রেফারেন্স পরিষ্কার করা',
    ],
    keyTakeaways: [
      'git branch -d only deletes fully merged branches — it refuses otherwise.',
      'Delete the GitHub copy too, or the branch list lies forever.',
      'git fetch --prune clears local memories of deleted remote branches.',
    ],
    sections: [
      {
        id: 'sec-delete',
        title: 'Clean Up After Merging',
        titleBn: 'মার্জের পর পরিষ্কার করুন',
        blocks: [
          {
            type: 'command',
            command: 'git branch -d feature/login',
            description: 'Delete locally — Git refuses if anything is unmerged.',
            descriptionBn: 'লোকালি মুছুন — কিছু আনমার্জড থাকলে গিট প্রত্যাখ্যান করে।',
          },
          {
            type: 'command',
            command: 'git push origin --delete feature/login',
            description: 'Delete the GitHub copy of the branch.',
            descriptionBn: 'ব্রাঞ্চের গিটহাব কপি মুছুন।',
          },
          {
            type: 'command',
            command: 'git fetch --prune',
            description: 'Forget remote-tracking refs for deleted branches.',
            descriptionBn: 'মোছা ব্রাঞ্চের রিমোট-ট্র্যাকিং রেফ ভুলে যান।',
          },
        ],
      },
    ],
    relatedCommands: ['git.branch', 'git.push', 'git.fetch'],
    relatedLessons: ['github.branching.feature-branches'],
  },
];
