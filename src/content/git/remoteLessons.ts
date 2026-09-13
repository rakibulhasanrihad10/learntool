import { CurriculumLesson } from '@/types/content';

/**
 * Module 6: Remote Repositories & GitHub (git-remote)
 *
 * Designed with a crystal-clear 3-tier mental model:
 * 1. Remote GitHub server (origin)
 * 2. Local remote-tracking branch (origin/main)
 * 3. Local working branch (main)
 *
 * Covers fetch vs pull, remote tracking, PR anatomy, code review etiquette,
 * and fork-upstream synchronization with 100% bilingual parity.
 */
export const REMOTE_LESSONS: CurriculumLesson[] = [
  {
    id: 'git.remote.fetch-vs-pull',
    moduleId: 'git-remote',
    slug: 'fetch-vs-pull',
    order: 1,
    durationMinutes: 12,
    difficulty: 'intermediate',
    title: 'Fetch vs. Pull: How They Work',
    titleBn: 'Fetch বনাম Pull সহজ ব্যাখ্যা',
    summary: 'Why git fetch is non-destructive while git pull executes a merge or rebase automatically.',
    summaryBn: 'git fetch কেন নিরাপদ এবং pull কীভাবে কাজ করে।',
    learningObjectives: [
      'Understand the 3 tiers: Remote Repository, Remote-Tracking Branch (origin/main), and Local Branch (main)',
      'Explain why git fetch is 100% non-destructive and never touches your working files',
      'Inspect incoming remote commits safely before merging with git log and git diff',
      'Understand the formula: git pull = git fetch + git merge (or rebase)',
    ],
    learningObjectivesBn: [
      '৩টি স্তর বোঝা: রিমোট রিপোজিটরি, রিমোট-ট্র্যাকিং ব্রাঞ্চ (origin/main) ও লোকাল ব্রাঞ্চ (main)',
      'git fetch কেন ১০০% নিরাপদ এবং কীভাবে এটি লোকাল ফাইলে হাত না দিয়ে কেবল তথ্য আনে তা ব্যাখ্যা করা',
      'মার্জ করার আগেই git log ও git diff দিয়ে রিমোটের পরিবর্তন নিরাপদে যাচাই করা',
      'git pull = git fetch + git merge সূত্রের প্রকৃত অভ্যন্তরীণ রূপ বোঝা',
    ],
    keyTakeaways: [
      'git fetch downloads commits to your local origin/main tracking reference without modifying your working files.',
      'origin/main is a read-only local bookmark of the remote state.',
      'git pull combines fetch and merge into one command, which can cause unexpected merge conflicts if you have uncommitted work.',
      'Safe professional habit: fetch first, inspect with git log HEAD..origin/main, then merge.',
    ],
    sections: [
      {
        id: 'sec-three-tiers',
        title: 'The 3-Tier Mental Model: Remote, Tracking, and Local',
        titleBn: '৩-স্তরের মানসিক মডেল: রিমোট, ট্র্যাকিং ও লোকাল',
        blocks: [
          {
            type: 'paragraph',
            text: 'One of the most frequent points of confusion for Git learners is assuming Git has only two places: "my computer" and "GitHub". In reality, Git uses a sophisticated 3-tier architecture to make working offline smooth and safe.',
            textBn: 'গিট শেখার ক্ষেত্রে সবচেয়ে বড় ভুল ধারণা হলো মনে করা যে গিট-এ কেবল দুটি জায়গা আছে: "আমার কম্পিউটার" এবং "গিটহাব"। প্রকৃতপক্ষে, অফলাইনে নির্বিঘ্নে ও নিরাপদে কাজ করার জন্য গিট একটি ৩-স্তরের আর্কিটেকচার ব্যবহার করে।',
          },
          {
            type: 'keyConcept',
            title: 'The 3 Tiers of Remote Collaboration',
            titleBn: 'রিমোট কলাবোরেশনের ৩টি স্তর',
            text: '1. Remote Repository (GitHub/GitLab):\n   The central server hosting the shared project repository (aliased as "origin").\n\n2. Local Remote-Tracking Reference (origin/main):\n   A read-only bookmark stored inside your local .git directory (under refs/remotes/origin/main). It represents the remote state the LAST time your computer communicated with GitHub.\n\n3. Local Branch (main) & Working Tree:\n   Your actual local branch (refs/heads/main) where you write code, edit files, and create commits.',
            textBn: '১. রিমোট রিপোজিটরি (GitHub/GitLab):\n   কেন্দ্রীয় ক্লাউড সার্ভার যেখানে টিমমেটদের শেয়ার করা কোড থাকে (ডিফল্ট নাম "origin")।\n\n২. লোকাল রিমোট-ট্র্যাকিং রেফারেন্স (origin/main):\n   আপনার কম্পিউটারের .git ফোল্ডারে সংরক্ষিত একটি রিড-অনলি বুকমার্ক। এটি নির্দেশ করে শেষবার যখন আপনার কম্পিউটার গিটহাবের সাথে কথা বলেছিল, তখন গিটহাবে কী ছিল।\n\n৩. লোকাল ব্রাঞ্চ (main) ও ওয়ার্কিং ফাইল:\n   আপনার কম্পিউটারের নিজস্ব ব্রাঞ্চ যেখানে আপনি কোড লিখছেন, ফাইল এডিট করছেন এবং নিজের কমিট বানাচ্ছেন।',
            commands: [
              {
                command: 'git remote -v',
                description: 'View the remote URLs linked to your local repository.',
                descriptionBn: 'আপনার লোকাল রিপোর সাথে যুক্ত রিমোট ইউআরএলগুলো দেখুন।',
              },
              {
                command: 'git branch -a',
                description: 'List all local branches and remote-tracking branches (in red).',
                descriptionBn: 'সমস্ত লোকাল এবং রিমোট-ট্র্যাকিং ব্রাঞ্চের তালিকা দেখুন।',
              },
            ],
          },
        ],
      },
      {
        id: 'sec-safe-fetch',
        title: 'Why git fetch is 100% Safe (Non-Destructive)',
        titleBn: 'git fetch কেন ১০০% নিরাপদ ও অহিংস',
        blocks: [
          {
            type: 'paragraph',
            text: 'When you run "git fetch origin", Git contacts GitHub, downloads all new commits that your teammates pushed, and updates your local "origin/main" bookmark.\n\nCrucially, git fetch NEVER touches your working tree, your staged files, or your local "main" branch pointer. Even if you have unsaved edits in your editor, running git fetch will never overwrite or conflict with your code.',
            textBn: 'আপনি যখন "git fetch origin" চালান, গিট গিটহাব সার্ভারের সাথে যোগাযোগ করে, টিমমেটদের পুশ করা নতুন কমিটগুলো ডাউনলোড করে এবং আপনার মেশিনের "origin/main" বুকমার্কটি আপডেট করে।\n\nসবচেয়ে গুরুত্বপূর্ণ বিষয় হলো: git fetch কখনোই আপনার লোকাল ফাইল, স্টেজড ফাইল বা লোকাল "main" পয়েন্টারে স্পর্শ করে না। এমনকি আপনার ফাইলে সেভ না করা কোড থাকলেও git fetch কখনোই কোনো কনফ্লিক্ট বা ডেটা লস তৈরি করে না।',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Professional Workflow: Inspect Before Merging',
            titleBn: 'প্রফেশনাল পদ্ধতি: মার্জ করার আগেই চেক করুন',
            text: 'Running git fetch allows you to inspect what teammates wrote BEFORE deciding to merge it:\n\n• git log HEAD..origin/main --oneline (Show incoming commits)\n• git diff main origin/main (Show exact file modifications incoming)',
            textBn: 'git fetch চালানোর ফলে আপনি মার্জ করার আগেই দেখতে পারেন অন্যরা কী কোড লিখেছে:\n\n• git log HEAD..origin/main --oneline (আগত নতুন কমিটগুলোর তালিকা)\n• git diff main origin/main (কোন কোন ফাইলে কী পরিবর্তন হয়েছে তার ডিটেইলস)',
          },
        ],
      },
      {
        id: 'sec-interactive-fetch-pull',
        title: 'Interactive Simulation: Fetch vs Pull in Action',
        titleBn: 'ইন্টারেক্টিভ সিমুলেটর: Fetch বনাম Pull লাইভ ডেমো',
        blocks: [
          {
            type: 'paragraph',
            text: 'Use the visualizer below to test what happens when teammates push new code to GitHub. Observe how "git fetch" updates only the middle tracking branch (origin/main), and how "git merge" brings those commits into your local workspace.',
            textBn: 'নিচের সিমুলেটরটি ব্যবহার করে দেখুন টিমমেটরা গিটহাবে নতুন কোড দিলে কী ঘটে। লক্ষ্য করুন কীভাবে "git fetch" শুধুমাত্র মাঝের origin/main বুকমার্ক আপডেট করে, এবং কীভাবে "git merge" সেই কোড লোকাল স্পেসে নিয়ে আসে।',
          },
          {
            type: 'fetchPullSimulator',
            title: 'Interactive 3-Tier Fetch vs Pull Visualizer',
            titleBn: 'ইন্টারেক্টিভ ৩-স্তরের Fetch বনাম Pull সিমুলেটর',
          },
        ],
      },
      {
        id: 'sec-pull-anatomy',
        title: 'What git pull Really Does (and git pull --rebase)',
        titleBn: 'git pull প্রকৃতপক্ষে কী করে (এবং git pull --rebase)',
        blocks: [
          {
            type: 'paragraph',
            text: 'Now that you understand the 3 tiers, the mystery of "git pull" is solved. git pull is simply a shortcut that executes two separate commands sequentially:',
            textBn: 'এখন আপনি ৩টি স্তর বুঝতে পেরেছেন, তাই "git pull"-এর রহস্যও পরিষ্কার। git pull মূলত দুটি আলাদা কমান্ড একের পর এক চালানোর একটি শর্টকাট:',
          },
          {
            type: 'code',
            language: 'bash',
            code: '# What git pull actually does behind the scenes:\ngit fetch origin\ngit merge origin/main',
            filename: 'terminal.sh',
          },
          {
            type: 'paragraph',
            text: 'Because git pull immediately invokes a merge, if you and a teammate edited the same file, you will suddenly find yourself in a merge conflict right in your editor while trying to pull.\n\nFurthermore, if you made local commits, git pull will generate an unnecessary "Merge branch \'main\' of github.com" commit, cluttering the project history.',
            textBn: 'যেহেতু git pull সাথে সাথেই একটি মার্জ শুরু করে দেয়, তাই আপনি এবং আপনার টিমমেট একই ফাইলে কাজ করলে পুল করার সাথে সাথেই আপনার এডিটরে আচমকা মার্জ কনফ্লিক্ট বেঁধে যেতে পারে।\n\nএছাড়া আপনার যদি লোকাল কমিট থাকে, তবে git pull একটি অপ্রয়োজনীয় "Merge branch \'main\' of github.com" কমিট বানিয়ে প্রজেক্ট হিস্ট্রি এলোমেলো করে ফেলে।',
          },
          {
            type: 'keyConcept',
            title: 'Cleaner History: git pull --rebase',
            titleBn: 'পরিচ্ছন্ন ইতিহাস: git pull --rebase',
            text: 'Many engineering teams enforce "git pull --rebase". Instead of creating a noisy merge commit, Git replays your local unpushed commits on top of the newly fetched origin/main commits, keeping the git log completely linear and clean.',
            textBn: 'অনেক সফটওয়্যার কোম্পানি "git pull --rebase" বাধ্যতামূলক করে। এতে কোনো গোলমেলে মার্জ কমিট তৈরি হয় না; বরং গিট আপনার নতুন লোকাল কমিটগুলোকে ফেচ করা origin/main-এর ওপর নতুন করে বসিয়ে দেয়, ফলে গিট লগ একদম সোজা ও পরিষ্কার থাকে।',
            commands: [
              {
                command: 'git pull --rebase origin main',
                description: 'Fetch remote changes and replay your local commits linearly.',
                descriptionBn: 'রিমোট পরিবর্তন ফেচ করে আপনার লোকাল কমিটগুলো সোজা লাইনে সাজিয়ে নেয়।',
              },
              {
                command: 'git config --global pull.rebase true',
                description: 'Configure Git to always rebase on pull automatically.',
                descriptionBn: 'প্রতিবার পুল করার সময় স্বয়ংক্রিয়ভাবে রিবেস করার গ্লোবাল সেটিং।',
              },
            ],
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-remote-fetch-vs-pull',
      subjectId: 'git',
      question: 'Why would a developer prefer "git fetch" over "git pull", and what is a remote-tracking branch?',
      questionBn: 'প্রফেশনাল ডেভেলপাররা "git pull"-এর চেয়ে "git fetch" কেন বেশি পছন্দ করেন, এবং রিমোট-ট্র্যাকিং ব্রাঞ্চ কী?',
      category: 'Remote Collaboration',
      difficulty: 'intermediate',
      answer: 'git fetch is 100% non-destructive: it downloads remote objects and updates the local remote-tracking reference (origin/main) without modifying the working directory or active branch pointer. This allows developers to inspect incoming changes with "git log HEAD..origin/main" or "git diff" before integrating. In contrast, "git pull" combines fetch and merge immediately, which can trigger unexpected merge conflicts or create noisy merge commits if local changes exist.',
      answerBn: 'git fetch সম্পূর্ণ নিরাপদ ও অহিংস: এটি রিমোট থেকে ডেটা ডাউনলোড করে লোকাল রিমোট-ট্র্যাকিং রেফারেন্স (origin/main) আপডেট করে, কিন্তু সক্রিয় লোকাল ব্রাঞ্চ বা এডিটরের ফাইলে কোনো পরিবর্তন করে না। এর ফলে "git log HEAD..origin/main" বা "git diff" দিয়ে নিরাপদে পরিবর্তনের ধরন দেখে নিয়ে মার্জ করার সিদ্ধান্ত নেওয়া যায়। অন্যদিকে "git pull" সরাসরি ফেচ ও মার্জ একসাথে করে ফেলে, যা অপ্রত্যাশিত কনফ্লিক্ট বা অনাবশ্যক মার্জ কমিট তৈরি করতে পারে।',
      keyPoints: [
        'origin/main is a local read-only cache of the remote branch.',
        'git fetch is non-destructive: it never modifies working tree or HEAD.',
        'git pull = git fetch + git merge (or rebase).',
        'Inspect first: git log HEAD..origin/main shows incoming commits before merging.',
      ],
      keyPointsBn: [
        'origin/main হলো রিমোট ব্রাঞ্চের একটি লোকাল রিড-অনলি ক্যাশ/বুকমার্ক।',
        'git fetch নিরাপদ: এটি কখনোই লোকাল ফাইল বা HEAD পরিবর্তন করে না।',
        'git pull = git fetch + git merge (বা rebase)।',
        'আগে দেখুন: "git log HEAD..origin/main" দিয়ে মার্জের আগেই আগত কমিট দেখা যায়।',
      ],
    },
    quiz: {
      id: 'quiz-git-remote-fetch-vs-pull',
      subjectId: 'git',
      difficulty: 'intermediate',
      question: 'You ran "git fetch origin". What happened to the files in your current working directory?',
      questionBn: 'আপনি টার্মিনালে "git fetch origin" চালালেন। আপনার বর্তমান ওয়ার্কিং ডিরেক্টরির ফাইলগুলোতে কী পরিবর্তন হলো?',
      explanation: 'git fetch only downloads commits to the local remote-tracking reference (origin/main) in .git. It never modifies your working files, staging area, or checked-out branch pointer.',
      explanationBn: 'git fetch শুধুমাত্র .git-এর ভেতরের লোকাল রিমোট-ট্র্যাকিং ব্রাঞ্চ (origin/main) আপডেট করে। এটি আপনার ওয়ার্কিং ফাইল, স্টেজিং এরিয়া বা লোকাল ব্রাঞ্চে বিন্দুমাত্র হাত দেয় না।',
      options: [
        {
          id: 'opt-1',
          text: 'Nothing. git fetch never modifies working files or current local branch.',
          textBn: 'কিছুই হয়নি। git fetch কখনোই লোকাল ফাইল বা বর্তমান লোকাল ব্রাঞ্চ পরিবর্তন করে না।',
          isCorrect: true,
          explanation: 'Correct! git fetch is completely non-destructive and only updates the origin/main tracking reference.',
          explanationBn: 'সঠিক! git fetch সম্পূর্ণ নিরাপদ এবং এটি কেবল origin/main ট্র্যাকিং রেফারেন্স আপডেট করে।',
        },
        {
          id: 'opt-2',
          text: 'All modified files were automatically overwritten with remote versions.',
          textBn: 'রিমোটের নতুন ফাইল দিয়ে লোকাল ফাইলগুলো স্বয়ংক্রিয়ভাবে প্রতিস্থাপিত হয়ে গেছে।',
          isCorrect: false,
          explanation: 'Incorrect. git fetch never touches working tree files. That would be a destructive action.',
          explanationBn: 'ভুল। git fetch কখনোই ওয়ার্কিং ফাইলগুলোতে হাত দেয় না।',
        },
        {
          id: 'opt-3',
          text: 'Git created a merge commit on your local main branch.',
          textBn: 'গিট লোকাল main ব্রাঞ্চে একটি মার্জ কমিট তৈরি করেছে।',
          isCorrect: false,
          explanation: 'Incorrect. git fetch does not merge. A merge commit only happens during git merge or git pull.',
          explanationBn: 'ভুল। git fetch মার্জ করে না। মার্জ কমিট কেবল git merge বা git pull-এর সময় তৈরি হতে পারে।',
        },
        {
          id: 'opt-4',
          text: 'Your uncommitted local changes were moved to the stash.',
          textBn: 'আপনার সেভ না করা পরিবর্তনগুলো স্ট্যাশে জমা হয়ে গেছে।',
          isCorrect: false,
          explanation: 'Incorrect. git fetch does not interact with the stash.',
          explanationBn: 'ভুল। git fetch স্ট্যাশের সাথে কোনো কাজ করে না।',
        },
      ],
    },
  },
  {
    id: 'git.remote.github-prs',
    moduleId: 'git-remote',
    slug: 'pull-requests',
    order: 2,
    durationMinutes: 15,
    difficulty: 'intermediate',
    title: 'Pull Requests & Collaboration',
    titleBn: 'পুল রিকোয়েস্ট ও টিম কলাবোরেশন',
    summary: 'Creating clear PR descriptions, requesting reviews, handling feedback, and syncing forks.',
    summaryBn: 'সঠিক পিআর ডেসক্রিপশন, কোড রিভিউ, ফিডব্যাক হ্যান্ডলিং এবং ফর্ক সিঙ্ক।',
    learningObjectives: [
      'Understand the difference between Direct Clone (internal team) and Fork & Pull (open source)',
      'Structure high-impact PRs with clear titles, problem-solution descriptions, and test plans',
      'Leverage Draft PRs to signal work-in-progress and avoid premature notifications',
      'Follow the golden rule of PR reviews: push updates to the same branch without closing the PR',
      'Sync a forked repository with the upstream source repository',
    ],
    learningObjectivesBn: [
      'সরাসরি ক্লোন (কোম্পানি টিম) বনাম ফর্ক ও পুল (ওপেন সোর্স)-এর পার্থক্য বোঝা',
      'স্পষ্ট শিরোনাম, সমস্যা-সমাধানের বিবরণ ও টেস্ট প্ল্যান দিয়ে দারুণ PR তৈরি করা',
      'ড্রাফট PR ব্যবহার করে কাজ চলাকালীন অকাল নোটিফিকেশন রোধ করা',
      'PR রিভিউয়ের গোল্ডেন রুল: PR বন্ধ না করে একই ব্রাঞ্চে নতুন কমিট পুশ করা',
      'আপস্ট্রিম মূল রিপোজিটরির সাথে নিজের ফর্ক সিঙ্ক করার সঠিক নিয়ম শেখা',
    ],
    keyTakeaways: [
      'Fork when you lack write access (open source); clone directly when you are an authorized team member.',
      'A great PR explains WHY the change was made, not just what files were touched.',
      'Never close a PR to address review comments! Just push new commits to the existing branch.',
      'Draft PRs keep CI and reviewers focused until code is mature and ready for scrutiny.',
      'Sync your fork with upstream: git fetch upstream && git merge upstream/main.',
    ],
    sections: [
      {
        id: 'sec-fork-vs-clone',
        title: 'Fork vs Direct Clone: Choosing the Right Strategy',
        titleBn: 'ফর্ক বনাম সরাসরি ক্লোন: সঠিক পদ্ধতি নির্বাচন',
        blocks: [
          {
            type: 'paragraph',
            text: 'Before you can create a Pull Request, you must obtain a copy of the repository. But should you "git clone" directly, or should you click "Fork" on GitHub first?',
            textBn: 'একটি পুল রিকোয়েস্ট তৈরি করার আগে আপনার কাছে রিপোজিটরির একটি কপি থাকতে হবে। কিন্তু আপনি কি সরাসরি "git clone" করবেন, নাকি প্রথমে গিটহাবে গিয়ে "Fork" বাটনে চাপবেন?',
          },
          {
            type: 'keyConcept',
            title: 'The Fork vs. Clone Decision Rule',
            titleBn: 'ফর্ক বনাম ক্লোনের মূল নিয়ম',
            text: '• Internal Team / Company Repository (Direct Clone):\n  If you have write permissions to the repository, you clone directly. You create a feature branch (e.g. feature/checkout-flow) and push your branch directly to the same repository.\n\n• Open Source / External Repository (Fork & Clone):\n  If you do NOT have write permissions, you click "Fork" on GitHub to create your own personal copy under your username (e.g. github.com/your-username/react). You clone your fork, create a branch, push to your fork, and submit a PR from your fork to the original repository.',
            textBn: '• অফিস / কোম্পানির নিজস্ব প্রজেক্ট (সরাসরি ক্লোন):\n  যদি আপনার রিপোজিটরিতে রাইট পারমিশন থাকে, তবে সরাসরি ক্লোন করুন। এরপর একটি ফিচার ব্রাঞ্চ (যেমন feature/checkout-flow) বানিয়ে সরাসরি সেই রিপোতেই পুশ করুন এবং PR দিন।\n\n• ওপেন সোর্স বা বাইরের প্রজেক্ট (ফর্ক ও ক্লোন):\n  যদি আপনার মূল রিপোতে সরাসরি পুশ করার অধিকার না থাকে, তবে গিটহাবে গিয়ে "Fork" করুন। এতে আপনার প্রোফাইলে ঐ প্রজেক্টের একটি হুবহু কপি তৈরি হবে। এবার আপনার ফর্কটি ক্লোন করুন, ব্রাঞ্চ বানিয়ে পুশ করুন এবং মূল প্রজেক্টে PR সাবমিট করুন।',
          },
        ],
      },
      {
        id: 'sec-pr-anatomy',
        title: 'The Anatomy of a 5-Star Pull Request',
        titleBn: 'একটি চমৎকার পুল রিকোয়েস্টের মূল উপাদান',
        blocks: [
          {
            type: 'paragraph',
            text: 'Senior engineers love reviewing good PRs, and dread reviewing bad ones. A PR titled "fix" that touches 85 files with no description will sit unattended for weeks. A crisp, well-structured PR often gets approved in minutes.',
            textBn: 'সিনিয়র ইঞ্জিনিয়াররা গোছানো PR রিভিউ করতে পছন্দ করেন এবং বিশৃঙ্খল PR অপছন্দ করেন। যদি PR-এর টাইটেল হয় "fix" এবং কোনো বর্ণনা ছাড়া ৮৫টি ফাইল পরিবর্তন থাকে, তবে কেউ তা রিভিউ করতে চাইবে না। অথচ গোছানো PR কয়েক মিনিটেই অ্যাপ্রুভ হয়ে যায়।',
          },
          {
            type: 'keyConcept',
            title: 'The 4 Pillars of a Great PR Description',
            titleBn: 'একটি দারুণ PR ডেসক্রিপশনের ৪টি স্তম্ভ',
            text: '1. Semantic Title:\n   feat(cart): add coupon discount code validation (#142)\n\n2. The "Why" (Context & Motivation):\n   "Users could previously enter expired coupons and cause checkout errors. This PR validates coupon expiry before payment processing."\n\n3. Proof & Verification:\n   Include before/after screenshots or GIFs for UI changes. For backend, mention: "Added 4 unit tests in coupon.test.ts, all passing."\n\n4. Reviewer Checklist:\n   [x] Tested on desktop and mobile\n   [x] No console warnings\n   [x] Updated API documentation',
            textBn: '১. স্পষ্ট শিরোনাম (Semantic Title):\n   feat(cart): add coupon discount code validation (#142)\n\n২. পরিবর্তনের কারণ (The "Why"):\n   "মেয়াদোত্তীর্ণ কুপন কোড দিলে পেমেন্ট ফেইল হতো। এই PR পেমেন্ট প্রক্রিয়ার আগেই কুপনের মেয়াদ যাচাই করে।"\n\n৩. প্রমাণের স্ক্রিনশট বা টেস্ট ফলাফল:\n   ইউআই পরিবর্তনের ক্ষেত্রে Before/After স্ক্রিনশট বা GIF দিন। ব্যাকএন্ডের ক্ষেত্রে লিখুন: "৪টি ইউনিট টেস্ট যোগ করা হয়েছে এবং সবগুলো সফলভাবে পাস করেছে।"\n\n৪. চেকলিস্ট:\n   [x] ডেস্কটপ ও মোবাইলে টেস্ট করা হয়েছে\n   [x] কনসোলে কোনো এরর নেই\n   [x] এপিআই ডকুমেন্টেশন আপডেট করা হয়েছে',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Use Draft PRs for Work in Progress',
            titleBn: 'চলমান কাজের জন্য Draft PR ব্যবহার করুন',
            text: 'When opening a PR that is not yet ready for final merge, choose "Create Draft Pull Request". Draft PRs cannot be accidentally merged, and they let teammates inspect your architectural direction without bombarding them with review notification emails.',
            textBn: 'যদি আপনার কাজ এখনো শতভাগ শেষ না হয়, তবে "Create Draft Pull Request" সিলেক্ট করুন। ড্রাফট পিআর ভুলবশত মার্জ করা যায় না, এবং এটি টিমমেটদের অযথা নোটিফিকেশন না পাঠিয়েই কোডের প্রাথমিক রূপ দেখানোর সুযোগ দেয়।',
          },
        ],
      },
      {
        id: 'sec-golden-rule-reviews',
        title: 'The Golden Rule of Handling Review Feedback',
        titleBn: 'কোড রিভিউ ফিডব্যাক সামলানোর গোল্ডেন রুল',
        blocks: [
          {
            type: 'paragraph',
            text: 'When a reviewer reviews your PR, they typically choose one of three actions on GitHub:\n\n• Comment: General feedback or questions without blocking merge.\n• Approve: Code looks great, ready to be merged!\n• Request Changes: The reviewer found bugs, security holes, or architectural issues that MUST be fixed before merge.',
            textBn: 'গিটহাবে রিভিউ করার সময় রিভিউয়াররা সাধারণত ৩টি অপশনের একটি বেছে নেন:\n\n• Comment: সাধারণ মন্তব্য বা প্রশ্ন, যা মার্জ করা আটকায় না।\n• Approve: কোড চমৎকার হয়েছে, মার্জ করার জন্য প্রস্তুত!\n• Request Changes: কোডে কোনো বাগ, নিরাপত্তা সমস্যা বা ত্রুটি আছে যা মার্জ করার আগে অবশ্যই ঠিক করতে হবে।',
          },
          {
            type: 'callout',
            variant: 'important',
            title: 'GOLDEN RULE: Never Close the PR!',
            titleBn: 'গোল্ডেন রুল: কখনোই PR ক্লোজ করবেন না!',
            text: 'Beginners often make the mistake of closing the PR, making a new branch, and opening a whole new PR when asked for changes. This destroys all conversation history!\n\nInstead: simply make the required code changes on your local machine, commit them to the SAME branch, and run "git push origin <branch-name>". GitHub will automatically update the existing PR with your new commits!',
            textBn: 'অনেক নতুন ডেভেলপার রিভিউয়ার পরিবর্তন চাইলে ভয় পেয়ে পুরনো PR বন্ধ করে দেন এবং নতুন ব্রাঞ্চ খুলে আবার নতুন PR তৈরি করেন। এতে আলোচনার সমস্ত ইতিহাস মুছে যায়!\n\nসঠিক নিয়ম: আপনার কম্পিউটারে কোড ঠিক করুন, একই ব্রাঞ্চে কমিট করুন এবং "git push origin <branch-name>" চালান। গিটহাব স্বয়ংক্রিয়ভাবে বিদ্যমান PR-এ আপনার নতুন কমিটগুলো যুক্ত করে দেবে!',
          },
          {
            type: 'keyConcept',
            title: 'Syncing a Fork with Upstream',
            titleBn: 'আপস্ট্রিম মূল প্রজেক্টের সাথে ফর্ক সিঙ্ক করা',
            text: 'When working on a fork, the original repository will continue moving forward. To keep your fork in sync with upstream changes:',
            textBn: 'ফর্ক করা প্রজেক্টে কাজ করার সময় মূল রিপোজিটরিতে অন্যরা প্রতিনিয়ত নতুন কোড যুক্ত করতে পারে। নিজের ফর্ককে আপডেটেড রাখতে:',
            commands: [
              {
                command: 'git remote add upstream https://github.com/original-owner/repo.git',
                description: 'Link the original repository as the "upstream" remote (one-time setup).',
                descriptionBn: 'মূল রিপোজিটরিটিকে "upstream" হিসেবে যুক্ত করুন (একবার করলেই হয়)।',
              },
              {
                command: 'git fetch upstream',
                description: 'Download the latest commits from the original repository.',
                descriptionBn: 'মূল রিপোজিটরির সর্বশেষ কমিটগুলো ডাউনলোড করুন।',
              },
              {
                command: 'git merge upstream/main',
                description: 'Merge the latest upstream code into your local main branch.',
                descriptionBn: 'আপনার লোকাল main ব্রাঞ্চে আপস্ট্রিমের নতুন কোড মার্জ করে নিন।',
              },
            ],
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-remote-pr-workflow',
      subjectId: 'git',
      question: 'A senior reviewer clicks "Request Changes" on your Pull Request. What are the exact steps you should take to resolve the review?',
      questionBn: 'আপনার পুল রিকোয়েস্টে একজন সিনিয়র ডেভেলপার "Request Changes" দিলেন। এই রিভিউ সমাধান করার সঠিক ধাপগুলো কী কী?',
      category: 'Collaboration & PRs',
      difficulty: 'intermediate',
      answer: '1. Read and understand the feedback; ask clarifying questions respectfully on the specific code lines if needed.\n2. Do NOT close the PR. Switch to the existing local feature branch.\n3. Make the necessary code modifications, write or update tests, and verify locally.\n4. Create a clean commit (e.g., "fix: address PR review comments for error handling").\n5. Push the commit to the same remote branch (git push origin <branch-name>). GitHub updates the PR automatically.\n6. Reply to the reviewer comments explaining how the issue was fixed, and click the "Re-request review" button.',
      answerBn: '১. রিভিউ মন্তব্যগুলো ভালোভাবে পড়ে বুঝুন; কোনো অস্পষ্টতা থাকলে ঐ লাইনেই বিনয়ের সাথে প্রশ্ন করুন।\n২. কখনোই PR বন্ধ করবেন না। আপনার লোকাল সেই ফিচার ব্রাঞ্চেই থাকুন।\n৩. কোডের ত্রুটি ঠিক করুন, টেস্ট আপডেট করুন এবং লোকাল মেশিনে চালিয়ে নিশ্চিত হোন।\n৪. একটি স্পষ্ট কমিট মেসেজ দিয়ে কমিট করুন (যেমন: "fix: address PR review feedback for validation")।\n৫. একই রিমোট ব্রাঞ্চে পুশ করুন (git push origin <branch-name>); গিটহাব নিজ থেকেই PR আপডেট করে নেবে।\n৬. প্রতিটি মন্তব্যের উত্তরে জানান কীভাবে সমাধান করেছেন এবং "Re-request review" বাটনে ক্লিক করুন।',
      keyPoints: [
        'Never close and re-open PRs; maintain the review thread and discussion history.',
        'Push commits directly to the existing branch; the PR updates automatically.',
        'Acknowledge comments politely and explain the solution.',
        'Use "Re-request review" when all points are addressed.',
      ],
      keyPointsBn: [
        'কখনোই PR বন্ধ করে নতুন PR খুলবেন না; আলোচনার ধারাবাহিকতা রক্ষা করুন।',
        'একই ব্রাঞ্চে নতুন কমিট পুশ করলেই PR আপডেট হয়ে যায়।',
        'প্রতিটি কমেন্টের উত্তর দিন এবং কীভাবে সমাধান করেছেন তা বুঝিয়ে বলুন।',
        'সব পয়েন্ট সমাধান শেষে রিভিউয়ারকে আবার রিভিউ করার জন্য "Re-request review" দিন।',
      ],
    },
    quiz: {
      id: 'quiz-git-remote-pr-workflow',
      subjectId: 'git',
      difficulty: 'intermediate',
      question: 'You opened a Pull Request on GitHub. A reviewer requested a small bug fix in your code. What should you do next?',
      questionBn: 'আপনি গিটহাবে একটি PR দিয়েছেন। একজন রিভিউয়ার কোডের একটি ছোট বাগ ঠিক করতে বললেন। আপনার পরবর্তী সঠিক পদক্ষেপ কী?',
      explanation: 'Always make changes on your local machine on the same feature branch, commit them, and push to the same branch. GitHub automatically updates the existing PR while preserving the review discussion history.',
      explanationBn: 'সর্বদা লোকাল মেশিনে একই ফিচার ব্রাঞ্চে পরিবর্তন করে কমিট করুন এবং পুশ করুন। এতে পর্যালোচনার আলোচনা বজায় রেখেই বিদ্যমান PR স্বয়ংক্রিয়ভাবে আপডেট হয়ে যায়।',
      options: [
        {
          id: 'opt-1',
          text: 'Fix the bug locally on the same branch, commit, and push. The PR updates automatically.',
          textBn: 'লোকাল মেশিনে একই ব্রাঞ্চে বাগ ঠিক করে কমিট ও পুশ করুন। PR নিজে থেকেই আপডেট হয়ে যাবে।',
          isCorrect: true,
          explanation: 'Correct! Pushing new commits to the same branch updates the open PR seamlessly without losing comment history.',
          explanationBn: 'সঠিক! একই ব্রাঞ্চে নতুন কমিট পুশ করলেই বিদ্যমান PR আপডেট হয়ে যায় এবং কমেন্টের ইতিহাস অক্ষত থাকে।',
        },
        {
          id: 'opt-2',
          text: 'Close the Pull Request, delete your branch, and create a brand new PR from scratch.',
          textBn: 'PR-টি বন্ধ করে দিন, ব্রাঞ্চ ডিলিট করুন এবং শুরু থেকে একদম নতুন একটি PR খুলুন।',
          isCorrect: false,
          explanation: 'Incorrect. Closing the PR deletes the conversation history and wastes reviewer time.',
          explanationBn: 'ভুল। PR বন্ধ করলে পর্যালোচনার সমস্ত ইতিহাস মুছে যায় এবং সময় নষ্ট হয়।',
        },
        {
          id: 'opt-3',
          text: 'Email the fixed file directly to the reviewer.',
          textBn: 'ঠিক করা ফাইলটি সরাসরি রিভিউয়ারকে ইমেইলে পাঠিয়ে দিন।',
          isCorrect: false,
          explanation: 'Incorrect. All code reviews in modern workflows happen through Git and GitHub PRs.',
          explanationBn: 'ভুল। আধুনিক সফটওয়্যার ইঞ্জিনিয়ারিংয়ে সমস্ত রিভিউ গিট ও গিটহাব PR-এর মাধ্যমেই হয়।',
        },
        {
          id: 'opt-4',
          text: 'Merge the PR yourself without waiting for the reviewer to approve.',
          textBn: 'রিভিউয়ারের অনুমোদনের অপেক্ষা না করে নিজেই PR মার্জ করে দিন।',
          isCorrect: false,
          explanation: 'Incorrect. Bypassing review policies violates team collaboration rules and breaks build stability.',
          explanationBn: 'ভুল। রিভিউয়ারের অনুমোদন ছাড়া মার্জ করা টিম নিয়ম ও কোয়ালিটি রুলের পরিপন্থী।',
        },
      ],
    },
  },
];
