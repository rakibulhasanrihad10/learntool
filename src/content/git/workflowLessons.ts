import { CurriculumLesson } from '@/types/content';

/**
 * Module 2: Everyday Workflow & Inspection Lessons
 *
 * Rich curriculum lessons covering diff inspection, .gitignore patterns, and history log navigation.
 */
export const WORKFLOW_LESSONS: CurriculumLesson[] = [
  {
    id: 'git.workflow.diff-inspection',
    moduleId: 'git-workflow',
    slug: 'diff-inspection',
    order: 1,
    durationMinutes: 12,
    difficulty: 'beginner',
    title: 'Viewing Differences (git diff)',
    titleBn: 'পরিবর্তন পর্যালোচনা (git diff)',
    summary: 'Inspect unstaged changes vs staged index changes with surgical precision.',
    summaryBn: 'আনস্টেজড ও স্টেজড পরিবর্তনের তফাত নিখুঁতভাবে দেখা।',
    learningObjectives: [],
    learningObjectivesBn: [],
    keyTakeaways: [],
    relatedCommands: ['git.diff', 'git.status', 'git.add'],
    sections: [
      {
        id: 'sec-diff-mental-model',
        title: 'The Mental Model: What Does Git Diff Compare?',
        titleBn: 'মূল ধারণা: git diff ঠিক কী তুলনা করে?',
        blocks: [
          {
            type: 'paragraph',
            text: 'One of the most common points of confusion for beginners is that git diff does not just show "what changed" in general. Git is built around three distinct local areas (Working Directory, Staging Area, and Local Repository), so git diff needs to know which two states you want to compare.',
            textBn: 'নতুনদের জন্য সবচেয়ে বড় বিভ্রান্তি হলো ভাবা যে git diff সাধারণভাবে শুধু "কী পরিবর্তন হলো" তা দেখায়। কিন্তু গিট তিনটি আলাদা লোকাল এরিয়া (Working Directory, Staging Area, এবং Local Repository) নিয়ে কাজ করে। তাই git diff চালানোর সময় বুঝতে হয় আপনি কোন দুটি এরিয়ার মধ্যে তুলনা করছেন।',
          },
          {
            type: 'keyConcept',
            title: '1. git diff (Unstaged Changes)',
            titleBn: '১. git diff (আনস্টেজড পরিবর্তন)',
            text: 'Compares your Working Directory directly against the Staging Area (Index).\n\nIt answers: "What modifications have I typed in my editor that I have NOT yet staged with git add?" If you stage all your changes, running plain git diff will return completely empty!',
            textBn: 'আপনার ওয়ার্কিং ডিরেক্টরিকে সরাসরি স্টেজিং এরিয়ার (Index) সাথে তুলনা করে।\n\nএটি উত্তর দেয়: "আমি এডিটরে কী কী পরিবর্তন করেছি যা এখনো git add দিয়ে স্টেজ করিনি?" আপনি যদি সব পরিবর্তন স্টেজ করে ফেলেন, তবে সাধারণ git diff চালালে টার্মিনালে কিছুই দেখাবে না!',
            commands: [
              {
                command: 'git diff',
                description: 'Shows unstaged differences between working tree and staging area.',
                descriptionBn: 'ওয়ার্কিং ডিরেক্টরি এবং স্টেজিং এরিয়ার মধ্যকার আনস্টেজড পরিবর্তন দেখায়।',
              },
            ],
          },
          {
            type: 'keyConcept',
            title: '2. git diff --staged (Staged Changes)',
            titleBn: '২. git diff --staged (স্টেজড পরিবর্তন)',
            text: 'Compares the Staging Area against your last commit (HEAD).\n\nIt answers: "What changes are prepared in the waiting room, ready to become the next commit?" (Note: git diff --cached is an identical older synonym).',
            textBn: 'স্টেজিং এরিয়ার সাথে আপনার সর্বশেষ কমিটের (HEAD) তুলনা করে।\n\nএটি উত্তর দেয়: "অপেক্ষার ঘরে (Staging Area) কোন কোন পরিবর্তন প্রস্তুত আছে যা আমার পরবর্তী কমিটে যুক্ত হতে যাচ্ছে?" (উল্লেখ্য: git diff --cached একই কাজ করে)।',
            commands: [
              {
                command: 'git diff --staged',
                description: 'Shows staged differences that are queued up for the next commit.',
                descriptionBn: 'পরবর্তী কমিটের জন্য প্রস্তুত স্টেজড পরিবর্তনগুলো প্রদর্শন করে।',
              },
            ],
          },
          {
            type: 'keyConcept',
            title: '3. git diff HEAD (Everything Changed)',
            titleBn: '৩. git diff HEAD (মোট পরিবর্তন)',
            text: 'Compares your current Working Directory directly against the last commit (HEAD), combining both staged and unstaged edits into a single unified view.',
            textBn: 'আপনার বর্তমান ওয়ার্কিং ডিরেক্টরির সাথে সর্বশেষ কমিটের (HEAD) সরাসরি তুলনা করে। ফলে স্টেজড এবং আনস্টেজড উভয় পরিবর্তন একসাথে দেখা যায়।',
            commands: [
              {
                command: 'git diff HEAD',
                description: 'Shows all changes in your working tree relative to the latest commit.',
                descriptionBn: 'সর্বশেষ কমিটের সাপেক্ষে ফাইলের সমস্ত পরিবর্তন একসাথে দেখায়।',
              },
            ],
          },
          {
            type: 'visualizer',
            initialState: 'staging',
          },
        ],
      },
      {
        id: 'sec-anatomy-of-a-diff',
        title: 'Deconstructing Unified Diff Output',
        titleBn: 'ইউনিফাইড ডিফের আউটপুট বিশ্লেষণ',
        blocks: [
          {
            type: 'paragraph',
            text: 'When you run git diff, the terminal prints a unified diff. At first glance it can look cryptic, but it follows an exact, logical format:',
            textBn: 'যখন আপনি git diff চালান, টার্মিনাল একটি "Unified Diff" প্রদর্শন করে। প্রথম দেখায় এটি জটিল মনে হলেও এটি একটি অত্যন্ত সুশৃঙ্খল নিয়ম মেনে চলে:',
          },
          {
            type: 'code',
            language: 'diff',
            filename: 'terminal output: git diff',
            code: `diff --git a/src/auth.js b/src/auth.js
index 83a21b4..f4091c2 100644
--- a/src/auth.js
+++ b/src/auth.js
@@ -14,6 +14,7 @@ function login(user, pass) {
     validate(user);
-    logDebug("Insecure raw password: " + pass);
+    // Hash securely before authentication
+    const hashed = hashPassword(pass);
     return db.findUser(user, hashed);
 }`,
          },
          {
            type: 'callout',
            variant: 'note',
            title: 'How to Read Each Line',
            titleBn: 'প্রতিটি লাইন কীভাবে পড়তে হয়',
            text: '• diff --git a/file b/file: Git compares version "a" (baseline) with version "b" (new edits).\n• --- a/src/auth.js: The source file before edits (associated with "-" minus signs).\n• +++ b/src/auth.js: The updated file after edits (associated with "+" plus signs).\n• @@ -14,6 +14,7 @@: The hunk header. In version "a", line 14 began a 6-line section. In version "b", line 14 begins a 7-line section.\n• Red line with -: Line removed or replaced.\n• Green line with +: Line added or new.',
            textBn: '• diff --git a/file b/file: গিট ভার্সন "a" (আগের অবস্থা) এর সাথে ভার্সন "b" (নতুন অবস্থা) তুলনা করছে।\n• --- a/src/auth.js: পরিবর্তনের পূর্ববর্তী মূল ফাইল (যা "-" চিহ্ন দ্বারা দেখানো হয়)।\n• +++ b/src/auth.js: পরিবর্তনের পরবর্তী হালনাগাদ ফাইল (যা "+" চিহ্ন দ্বারা দেখানো হয়)।\n• @@ -14,6 +14,7 @@: হাঙ্ক হেডার (Hunk Header)। পূর্ববর্তী ফাইলে ১৪ নম্বর লাইনে ৬টি লাইন ছিল, নতুন ফাইলে ১৪ নম্বর লাইন থেকে ৭টি লাইন শুরু হয়েছে।\n• লাল রঙের - লাইন: মুছে ফেলা বা পরিবর্তিত পূর্ববর্তী লাইন।\n• সবুজ রঙের + লাইন: নতুন যোগ করা কোড।',
          },
        ],
      },
      {
        id: 'sec-essential-flags',
        title: 'Essential Everyday Flags',
        titleBn: 'দৈনন্দিন কাজে প্রয়োজনীয় ফ্ল্যাগসমূহ',
        blocks: [
          {
            type: 'paragraph',
            text: 'Professionals rarely just run git diff. These precision flags help you review code quickly without getting overwhelmed by giant walls of text:',
            textBn: 'পেশাদার ডেভেলপাররা শুধু সাধারণ git diff ব্যবহার করেন না। বিশাল কোডবেসে দ্রুত পর্যালোচনার জন্য এই ফ্ল্যাগগুলো অত্যন্ত কার্যকর:',
          },
          {
            type: 'command',
            command: 'git diff --stat',
            description: 'Shows a concise numerical summary: which files changed and how many lines were inserted (+) or deleted (-).',
            descriptionBn: 'একটি সংক্ষিপ্ত পরিসংখ্যান দেখায়: কোন কোন ফাইল বদলেছে এবং কত লাইন যোগ (+) বা বিয়োগ (-) হয়েছে।',
          },
          {
            type: 'command',
            command: 'git diff path/to/file.js',
            description: 'Restricts diff inspection to a single file, ignoring all other modified files.',
            descriptionBn: 'অন্যান্য ফাইল বাদ দিয়ে কেবল একটি নির্দিষ্ট ফাইলের পরিবর্তন পর্যবেক্ষণ করে।',
          },
          {
            type: 'command',
            command: 'git diff -w',
            description: 'Ignores whitespace and indentation differences so you only see actual code logic changes.',
            descriptionBn: 'হোয়াইটস্পেস বা ইনডেন্টেশনের পরিবর্তন উপেক্ষা করে শুধু মূল কোডের পরিবর্তন দেখায়।',
          },
          {
            type: 'command',
            command: 'git diff main..feature-branch',
            description: 'Compares the tips of two branches to preview all differences before opening a pull request.',
            descriptionBn: 'দুটি ভিন্ন ব্রাঞ্চের মধ্যে তুলনা করে মার্জ বা পিআর করার আগে পার্থক্য পর্যালোচনা করে।',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Professional Workflow Tip',
            titleBn: 'পেশাদারদের জন্য গুরুত্বপূর্ণ পরামর্শ',
            text: 'Always run `git diff` before staging with `git add`, and run `git diff --staged` right before committing. This self-review habit catches accidental console.log calls, sensitive API tokens, and formatting slips before they pollute your history.',
            textBn: 'git add করার আগে সবসময় `git diff` চালিয়ে নিজে নিজে কোড রিভিউ করে নিন, এবং কমিট করার ঠিক আগে `git diff --staged` দেখে নিন। এই সহজ অভ্যাসটি অনিচ্ছাকৃত ডিবাগ কোড, গোপন API কি এবং ভুল ফরম্যাটিং হিস্ট্রিতে চলে যাওয়া প্রতিরোধ করে।',
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-diff-vs-staged',
      subjectId: 'git',
      category: 'everyday-workflow',
      difficulty: 'beginner',
      question: 'What is the exact difference between "git diff" and "git diff --staged"?',
      questionBn: '"git diff" এবং "git diff --staged"-এর মধ্যে সুনির্দিষ্ট পার্থক্য কী?',
      answer: 'git diff compares your unstaged Working Directory changes against the Staging Area (index). Once you stage files using git add, git diff will show nothing for those files. In contrast, git diff --staged (or --cached) compares the Staging Area against the last commit (HEAD), revealing exactly what will be included in the upcoming commit.',
      answerBn: 'git diff আপনার ওয়ার্কিং ডিরেক্টরির আনস্টেজড পরিবর্তনের সাথে স্টেজিং এরিয়ার (Index) তুলনা করে। একবার git add দিয়ে ফাইল স্টেজ করে ফেললে git diff আর কিছু দেখায় না। পক্ষান্তরে, git diff --staged (বা --cached) স্টেজিং এরিয়ার সাথে সর্বশেষ কমিটের (HEAD) তুলনা করে, যা নিশ্চিত করে যে পরবর্তী কমিটে ঠিক কী সংরক্ষিত হতে যাচ্ছে।',
      keyPoints: [
        'git diff = Working Directory vs Staging Area (Index)',
        'git diff --staged = Staging Area (Index) vs HEAD',
        'git diff HEAD = Working Directory vs HEAD (both staged & unstaged)',
      ],
      keyPointsBn: [
        'git diff = ওয়ার্কিং ডিরেক্টরি বনাম স্টেজিং এরিয়া (আনস্টেজড পরিবর্তন)',
        'git diff --staged = স্টেজিং এরিয়া বনাম HEAD (পরবর্তী কমিটের পরিবর্তন)',
        'git diff HEAD = ওয়ার্কিং ডিরেক্টরি বনাম HEAD (মোট পরিবর্তন)',
      ],
    },
    quiz: {
      id: 'quiz-diff-empty',
      subjectId: 'git',
      difficulty: 'beginner',
      question: 'You modified app.js, ran "git add app.js", and then executed "git diff". The terminal outputs nothing. Why?',
      questionBn: 'আপনি app.js পরিবর্তন করে "git add app.js" চালালেন এবং এরপর "git diff" লিখলেন। টার্মিনালে কোনো আউটপুট এলো না। কেন?',
      options: [
        {
          id: 'opt-1',
          text: 'Because git diff only compares Working Directory against the Staging Area; since you staged your changes, there are no unstaged differences.',
          textBn: 'কারণ git diff কেবল ওয়ার্কিং ডিরেক্টরির সাথে স্টেজিং এরিয়া তুলনা করে; যেহেতু আপনি ফাইলটি স্টেজ করেছেন, তাই কোনো আনস্টেজড পরিবর্তন অবশিষ্ট নেই।',
          isCorrect: true,
          explanation: 'Exactly right! To inspect files after staging them, you must use "git diff --staged" (or "git diff --cached").',
          explanationBn: 'একদম সঠিক! ফাইল স্টেজ করার পর পরিবর্তন দেখতে হলে "git diff --staged" চালাতে হয়।',
        },
        {
          id: 'opt-2',
          text: 'Because git add automatically created a commit, clearing your changes.',
          textBn: 'কারণ git add স্বয়ংক্রিয়ভাবে কমিট তৈরি করে ফাইল মুছে দিয়েছে।',
          isCorrect: false,
          explanation: 'git add only stages changes; it never commits them.',
          explanationBn: 'git add কেবল স্টেজ করে, কখনোই স্বয়ংক্রিয়ভাবে কমিট করে না।',
        },
        {
          id: 'opt-3',
          text: 'Because git diff only works on remote GitHub repositories.',
          textBn: 'কারণ git diff কেবল রিমোট গিটহাব রিপোজিটরিতে কাজ করে।',
          isCorrect: false,
          explanation: 'git diff is completely local and does not need any internet connection.',
          explanationBn: 'git diff সম্পূর্ণ লোকাল কমান্ড এবং এর জন্য ইন্টারনেটের প্রয়োজন নেই।',
        },
        {
          id: 'opt-4',
          text: 'Because git diff requires root admin privileges to view code.',
          textBn: 'কারণ git diff দেখার জন্য রুট অ্যাডমিন প্রিভিলেজ প্রয়োজন।',
          isCorrect: false,
          explanation: 'Git commands run with standard user file permissions.',
          explanationBn: 'গিট স্বাভাবিক ইউজার পারমিশনেই চলে।',
        },
      ],
      explanation: 'git diff inspects unstaged differences. Once a file is in the Staging Area, check it with git diff --staged.',
      explanationBn: 'git diff কেবল আনস্টেজড পরিবর্তন দেখে। ফাইল স্টেজিং এরিয়াতে চলে গেলে git diff --staged ব্যবহার করতে হয়।',
    },
  },
  {
    id: 'git.workflow.gitignore',
    moduleId: 'git-workflow',
    slug: 'gitignore-best-practices',
    order: 2,
    durationMinutes: 10,
    difficulty: 'beginner',
    title: '.gitignore Rules & Patterns',
    titleBn: '.gitignore নিয়ম ও প্যাটার্ন',
    summary: 'Prevent committing secrets, build artifacts, node_modules, and OS files.',
    summaryBn: 'সিক্রেট ফাইল, বিল্ড আর্টফ্যাক্ট ও অপ্রয়োজনীয় ফাইল বাদ রাখা।',
    learningObjectives: [],
    learningObjectivesBn: [],
    keyTakeaways: [],
    relatedCommands: ['git.status', 'git.add'],
    sections: [
      {
        id: 'sec-gitignore-purpose',
        title: 'Why Do We Need .gitignore?',
        titleBn: '.gitignore কেন প্রয়োজন?',
        blocks: [
          {
            type: 'paragraph',
            text: 'Not every file in your project belongs in version control. Build outputs (dist/, build/), package manager dependencies (node_modules/), operating system debris (.DS_Store, Thumbs.db), and sensitive credentials (.env) must never be checked into Git.',
            textBn: 'প্রজেক্টের প্রতিটি ফাইল ভার্সন কন্ট্রোলে সেভ করা উচিত নয়। যেমন: বিল্ড আউটপুট (dist/), ডিপেন্ডেন্সি ফোল্ডার (node_modules/), অপারেটিং সিস্টেমের ফাইল (.DS_Store), এবং গোপন ক্রেডেনশিয়াল (.env)—এগুলো কখনোই গিটে কমিট করা যাবে না।',
          },
          {
            type: 'code',
            language: 'gitignore',
            filename: '.gitignore',
            code: `# Environment secrets (NEVER commit!)
.env
.env.local
*.pem

# Dependencies
node_modules/
vendor/

# Build artifacts
dist/
build/
*.log

# OS metadata
.DS_Store
Thumbs.db`,
          },
        ],
      },
      {
        id: 'sec-gitignore-pitfalls',
        title: 'Common Pitfall: Ignoring Already-Tracked Files',
        titleBn: 'সাধারণ ভুল: ইতিমধ্যে ট্র্যাক করা ফাইল উপেক্ষা করা',
        blocks: [
          {
            type: 'paragraph',
            text: 'A common frustration occurs when you add a file to .gitignore, but Git keeps tracking changes to it anyway. This happens because .gitignore ONLY prevents untracked files from being added. If a file was already committed in the past, Git will continue to track it.',
            textBn: 'অনেকেই যে সমস্যায় পড়েন তা হলো .gitignore-এ কোনো ফাইルの নাম লেখার পরও গিট সেটির পরিবর্তন ট্র্যাক করতে থাকে। কারণ হলো .gitignore কেবল নতুন untracked ফাইলকে যোগ হওয়া থেকে আটকায়। কোনো ফাইল যদি অতীতে একবার কমিট করা হয়ে গিয়ে থাকে, তবে গিট সেটিকে ট্র্যাক করতেই থাকবে।',
          },
          {
            type: 'command',
            command: 'git rm --cached <file>',
            description: 'Untracks the file from Git index while safely keeping the actual file on your computer disk.',
            descriptionBn: 'ফাইলটিকে কম্পিউটার থেকে না মুছে কেবল গিটের ট্র্যাকিং তালিকা থেকে নিরাপদে সরিয়ে দেয়।',
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-gitignore-cached',
      subjectId: 'git',
      category: 'everyday-workflow',
      difficulty: 'beginner',
      question: 'How do you tell Git to ignore a file that is already committed without deleting it from your local disk?',
      questionBn: 'একটি ফাইলকে লোকাল ডিস্ক থেকে ডিলিট না করে কীভাবে গিটের ট্র্যাকিং থেকে বাদ দেবেন?',
      answer: 'Add the file path to .gitignore, then run "git rm --cached <file>". The --cached flag removes the file snapshot from the Git index while keeping the physical file intact in your working directory. Finally, commit the removal.',
      answerBn: 'প্রথমে ফাইলটি .gitignore-এ লিখুন, এরপর "git rm --cached <file>" কমান্ড চালান। --cached ফ্ল্যাগটি ফাইলটিকে ফিজিক্যালি না মুছে কেবল গিটের ইনডেক্স থেকে সরিয়ে দেয়। এরপর একটি কমিট করুন।',
      keyPoints: [
        '.gitignore only affects untracked files',
        'git rm --cached removes from index but preserves working tree',
        'Commit the staged untracking to complete the change',
      ],
    },
    quiz: {
      id: 'quiz-gitignore-already-tracked',
      subjectId: 'git',
      difficulty: 'beginner',
      question: 'You added .env to .gitignore, but "git status" still lists changes in .env. What command resolves this safely?',
      questionBn: 'আপনি .gitignore-এ .env যুক্ত করেছেন, কিন্তু "git status" এখনও সেটির পরিবর্তন দেখাচ্ছে। নিরাপদ সমাধান কোনটি?',
      options: [
        {
          id: 'opt-1',
          text: 'git rm --cached .env',
          textBn: 'git rm --cached .env',
          isCorrect: true,
          explanation: 'Correct! It removes .env from Git tracking while preserving your secrets safely on disk.',
          explanationBn: 'সঠিক! এটি ডিস্কের ফাইল না মুছে কেবল গিটের ট্র্যাকিং থেকে ফাইলটি বাদ দেয়।',
        },
        {
          id: 'opt-2',
          text: 'git delete .env',
          textBn: 'git delete .env',
          isCorrect: false,
          explanation: 'There is no "git delete" command.',
        },
        {
          id: 'opt-3',
          text: 'git clean -f',
          textBn: 'git clean -f',
          isCorrect: false,
          explanation: 'git clean removes untracked files entirely from disk!',
        },
      ],
      explanation: 'Use git rm --cached to untrack previously committed files without deleting them.',
      explanationBn: 'ডিস্ক থেকে ফাইল না মুছে ট্র্যাকিং বন্ধ করতে git rm --cached ব্যবহার করুন।',
    },
  },
  {
    id: 'git.workflow.history-log',
    moduleId: 'git-workflow',
    slug: 'log-and-history',
    order: 3,
    durationMinutes: 12,
    difficulty: 'beginner',
    title: 'Navigating Commit History (git log)',
    titleBn: 'কমিট ইতিহাস দেখা (git log)',
    summary: 'Format commit logs into compact one-line visual graphs.',
    summaryBn: 'সহজে কমিট লগ দেখা ও অন-লাইন গ্রাফ তৈরি।',
    learningObjectives: [],
    learningObjectivesBn: [],
    keyTakeaways: [],
    relatedCommands: ['git.log'],
    sections: [
      {
        id: 'sec-log-basics',
        title: 'The Terminal Time Machine',
        titleBn: 'টার্মিনাল টাইম মেশিন',
        blocks: [
          {
            type: 'paragraph',
            text: 'git log is your project ledger. It lists every commit that has ever been made, including cryptographic hash identifiers, author names, timestamps, and messages.',
            textBn: 'git log হলো আপনার প্রজেক্টের খতিয়ান বা ডায়েরি। এটি শুরু থেকে আজ পর্যন্ত করা প্রতিটি কমিটের ক্রিপ্টোগ্রাফিক হ্যাশ, লেখকের নাম, সময় এবং বার্তা তালিকাভুক্ত করে।',
          },
          {
            type: 'command',
            command: 'git log --oneline',
            description: 'Compresses each commit into a single line: 7-character short hash plus the commit title.',
            descriptionBn: 'প্রতিটি কমিটকে একটি লাইনে সংক্ষেপ করে: ৭ অক্ষরের শর্ট হ্যাশ এবং কমিট মেসেজ।',
          },
          {
            type: 'command',
            command: 'git log --oneline --graph --all',
            description: 'Draws an ASCII tree showing how branches diverge and merge across all references.',
            descriptionBn: 'একটি ভিজ্যুয়াল ASCII ট্রি এঁকে দেখায় ব্রাঞ্চগুলো কীভাবে আলাদা হয়েছে ও মার্জ হয়েছে।',
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-log-vs-reflog',
      subjectId: 'git',
      category: 'everyday-workflow',
      difficulty: 'intermediate',
      question: 'What is the key difference between "git log" and "git reflog"?',
      questionBn: '"git log" এবং "git reflog"-এর মূল পার্থক্য কী?',
      answer: 'git log navigates the commit ancestry reachable from the current commit/branch. git reflog (reference log) records every time HEAD changed position locally (including resets, branch checkouts, and amended commits). Reflog is your safety net to recover seemingly lost commits.',
      answerBn: 'git log বর্তমান ব্রাঞ্চের দৃশ্যমান কমিট হিস্ট্রি দেখায়। আর git reflog আপনার লোকাল কম্পিউটারে HEAD-এর প্রতিটি নড়াচড়া (চেকআউট, রিসেট, রিবেস) রেকর্ড রাখে। ফলে কোনো কমিট হারিয়ে গেলে reflog দিয়ে তা উদ্ধার করা যায়।',
      keyPoints: [
        'git log = public commit ancestry tree',
        'git reflog = private local chronological record of HEAD movement',
      ],
    },
    quiz: {
      id: 'quiz-log-oneline',
      subjectId: 'git',
      difficulty: 'beginner',
      question: 'Which flag produces a compact single-line view of each commit?',
      questionBn: 'কোন ফ্ল্যাগটি প্রতিটি কমিটের জন্য একটি সংক্ষিপ্ত এক-লাইনের ভিউ তৈরি করে?',
      options: [
        {
          id: 'opt-1',
          text: '--oneline',
          textBn: '--oneline',
          isCorrect: true,
          explanation: 'git log --oneline is the most popular way to view recent commits compactly.',
        },
        {
          id: 'opt-2',
          text: '--compact',
          textBn: '--compact',
          isCorrect: false,
        },
        {
          id: 'opt-3',
          text: '--summary',
          textBn: '--summary',
          isCorrect: false,
        },
      ],
      explanation: 'Use git log --oneline for clean, readable commit summaries.',
    },
  },
];
