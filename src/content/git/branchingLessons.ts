import { CurriculumLesson } from '@/types/content';

/**
 * Module 3: Branching & Switching Lessons
 *
 * Rich curriculum lessons covering branch pointers, HEAD navigation,
 * and modern branch management (git switch vs git checkout).
 */
export const BRANCHING_LESSONS: CurriculumLesson[] = [
  {
    id: 'git.branching.what-are-branches',
    moduleId: 'git-branching',
    slug: 'what-are-branches',
    order: 1,
    durationMinutes: 10,
    difficulty: 'intermediate',
    title: 'Understanding Branch Pointers',
    titleBn: 'ব্রাঞ্চ পয়েন্টারের ধারণা',
    summary: 'Why Git branches are instantaneous and lightweight (just a commit hash in a file).',
    summaryBn: 'গিট ব্রাঞ্চ কেন অত্যন্ত দ্রুত ও হালকা।',
    learningObjectives: [
      'Understand the Live App Safety principle for branching',
      'Explain why a Git branch is a movable pointer rather than a folder copy',
      'Define HEAD and identify the active branch using git branch',
      'Explain how branch pointers advance with commits and move with git reset',
    ],
    learningObjectivesBn: [
      'ব্রাঞ্চিংয়ের লাইভ অ্যাপ সেফটি মূলনীতি বোঝা',
      'গিট ব্রাঞ্চ কেন ফোল্ডার কপি নয় বরং মুভেবল পয়েন্টার তা ব্যাখ্যা করা',
      'HEAD-এর সংজ্ঞা দেওয়া এবং git branch দিয়ে সক্রিয় ব্রাঞ্চ শনাক্ত করা',
      'কমিটের সাথে ব্রাঞ্চ পয়েন্টার কীভাবে এগিয়ে যায় এবং git reset দিয়ে কীভাবে সরে তা বোঝা',
    ],
    keyTakeaways: [
      'A Git branch is a lightweight pointer to a commit, not a heavy copy of your codebase.',
      'The Live App Safety rule: Never experiment on main; use branches to keep production code safe.',
      'HEAD is the dynamic marker that tells Git which branch and commit you are currently working on.',
      'The asterisk (*) in git branch marks the active branch currently pointed to by HEAD.',
    ],
    sections: [
      {
        id: 'sec-live-app-safety',
        title: 'The Core Purpose: Keeping Your Codebase Safe',
        titleBn: 'মূল উদ্দেশ্য: কোডবেস সুরক্ষিত রাখা (লাইভ অ্যাপ সেফটি)',
        blocks: [
          {
            type: 'paragraph',
            text: 'In Git, branches and pointers are the underlying mechanisms that allow you to develop features, fix bugs, and experiment with your codebase in complete isolation.',
            textBn: 'গিটে ব্রাঞ্চ এবং পয়েন্টার হলো এমন মূল ভিত্তি যা আপনাকে সম্পূর্ণ স্বাধীনভাবে নতুন ফিচার তৈরি, বাগ ফিক্স এবং কোডবেসে পরীক্ষানিরীক্ষা করার সুযোগ দেয়।',
          },
          {
            type: 'keyConcept',
            title: 'The "Live App Safety" Scenario',
            titleBn: '"লাইভ অ্যাপ সেফটি" প্রেক্ষাপট',
            text: 'Imagine you have built a fully functional web application for a client that is running smoothly and actively used by real users on the main (or master) branch.\n\nIf you write new, experimental features directly on this live code, you risk introducing bugs, breaking critical workflows, or crashing the site for active customers.\n\nTo prevent this, Git allows you to branch off from the current stable snapshot into an independent, isolated timeline (e.g. a feature branch). You can freely edit files, add features, and break code in this isolated branch without affecting the live site. Once verified bug-free, you safely integrate or merge it back.',
            textBn: 'কল্পনা করুন আপনি ক্লায়েন্টের জন্য একটি লাইভ ওয়েব অ্যাপ্লিকেশন তৈরি করেছেন, যা এখন main (বা master) ব্রাঞ্চ থেকে প্রোডাকশনে সচল এবং আসল ব্যবহারকারীরা প্রতিদিন এটি ব্যবহার করছেন।\n\nআপনি যদি সরাসরি এই লাইভ কোডের ওপর নতুন বা পরীক্ষামূলক ফিচার লিখতে যান, তবে যেকোনো ছোটখাটো বাগে পুরো সাইট ক্র্যাশ করতে পারে এবং ব্যবহারকারীরা ভোগান্তিতে পড়তে পারেন।\n\nএটি প্রতিরোধ করতে গিট আপনাকে বর্তমান স্থিতিশীল স্ন্যাপশট থেকে একটি সম্পূর্ণ স্বাধীন ও বিচ্ছিন্ন টাইমলাইনে (Branch) কাজ করার সুযোগ দেয়। আপনি মূল সাইটের কোনো ক্ষতি না করেই স্বাধীনভাবে কোড পরিবর্তন, পরীক্ষা বা মুছে ফেলতে পারেন। কাজ নিখুঁতভাবে শেষ হলে নিরাপদে তা মূল কোডে মার্জ (Merge) করা যায়।',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Golden Rule of Branching',
            titleBn: 'ব্রাঞ্চিংয়ের সুবর্ণ নিয়ম',
            text: 'Treat your main branch as production-ready code at all times. All new work, bug fixes, and experiments should happen on dedicated feature branches.',
            textBn: 'main ব্রাঞ্চকে সর্বদা প্রোডাকশনের জন্য প্রস্তুত হিসেবে বিবেচনা করুন। নতুন সব কাজ, বাগ ফিক্স ও পরীক্ষা-নিরীক্ষা আলাদা ফিচার ব্রাঞ্চে সম্পন্ন করুন।',
          },
        ],
      },
      {
        id: 'sec-head-pointer',
        title: 'What is HEAD? Your "You Are Here" Marker',
        titleBn: 'HEAD কী? আপনার অবস্থান নির্দেশক মার্কার',
        blocks: [
          {
            type: 'keyConcept',
            title: 'Understanding HEAD and Branch References',
            titleBn: 'HEAD এবং ব্রাঞ্চ রেফারেন্স বোঝা',
            text: 'In Git, HEAD is a dynamic pointer that represents "where you currently are" in your project. It acts as an active marker showing your current position in the repository commit history or active branch.\n\nMost of the time, HEAD points to a branch pointer (e.g. HEAD -> main), and that branch pointer points to the latest commit snapshot.',
            textBn: 'গিটে HEAD হলো একটি ডায়নামিক পয়েন্টার যা নির্দেশ করে "আপনি বর্তমানে প্রজেক্টের ঠিক কোথায় অবস্থান করছেন"। এটি রিপোজিটরির কমিট ইতিহাস বা সক্রিয় ব্রাঞ্চে আপনার বর্তমান অবস্থানের সক্রিয় মার্কার হিসেবে কাজ করে।\n\nবেশিরভাগ সময় HEAD সরাসরি কোনো ব্রাঞ্চ পয়েন্টারকে নির্দেশ করে (যেমন: HEAD -> main), এবং সেই ব্রাঞ্চ পয়েন্টারটি আবার সেই ব্রাঞ্চের সর্বশেষ কমিট স্ন্যাপশটকে নির্দেশ করে।',
            commands: [
              {
                command: 'git branch',
                description: 'Lists all local branches. The branch HEAD currently points to is highlighted with an asterisk (*).',
                descriptionBn: 'সব লোকাল ব্রাঞ্চ তালিকাভুক্ত করে। HEAD বর্তমানে যে ব্রাঞ্চে আছে তা তারকা (*) চিহ্ন দিয়ে দেখানো হয়।',
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'When you run git branch, Git lists every local branch in your repository. The active branch where HEAD is currently parked is marked with an asterisk (*) and highlighted in bright text.',
            textBn: 'আপনি যখন git branch কমান্ড চালান, গিট আপনার রিপোজিটরির প্রতিটি লোকাল ব্রাঞ্চের তালিকা দেখায়। HEAD বর্তমানে যে ব্রাঞ্চে অবস্থান করছে, তার পাশে একটি তারকা (*) চিহ্ন এবং উজ্জ্বল রং দিয়ে তা চিহ্নিত করা থাকে।',
          },
        ],
      },
      {
        id: 'sec-moving-pointers',
        title: 'How Branch Pointers Move with Commits & Resets',
        titleBn: 'কমিট ও রিসেটের সাথে ব্রাঞ্চ পয়েন্টার কীভাবে সরে',
        blocks: [
          {
            type: 'paragraph',
            text: 'Git branches are not heavy duplicates of files on disk. A branch is simply a 41-byte text file containing a 40-character commit hash! When you create a new commit, Git automatically advances the active branch pointer forward to the new commit snapshot.',
            textBn: 'গিট ব্রাঞ্চ কম্পিউটারের ডিস্কে ফাইলের কোনো ভারী ডুপ্লিকেট কপি নয়। একটি ব্রাঞ্চ হলো কেবল একটি ৪১ বাইটের টেক্সট ফাইল যা ৪০ অক্ষরের একটি কমিট হ্যাশ ধারণ করে! আপনি যখনই নতুন কমিট করেন, গিট স্বয়ংক্রিয়ভাবে সেই সক্রিয় ব্রাঞ্চ পয়েন্টারটিকে নতুন কমিটের দিকে এক ধাপ এগিয়ে দেয়।',
          },
          {
            type: 'keyConcept',
            title: 'Manipulating Pointers with git reset',
            titleBn: 'git reset দিয়ে পয়েন্টার পেছানো',
            text: 'When you want to undo your changes, you use the HEAD pointer to specify how far back to move. For example, running git reset referencing HEAD~1 tells Git to move the branch pointer exactly one commit backward from its current position.\n\nDepending on the reset mode (--soft, --mixed, or --hard), Git will either keep your modified files staged, unstage them, or completely discard them.',
            textBn: 'পূর্বের কোনো অবস্থায় ফিরে যেতে চাইলে (undo) গিট HEAD পয়েন্টারকে রেফারেন্স হিসেবে ব্যবহার করে। উদাহরণস্বরূপ, HEAD~1 নির্দেশ করে git reset চালালে গিট বর্তমান ব্রাঞ্চ পয়েন্টারটিকে ঠিক এক ধাপ পেছনের কমিটে সরিয়ে নেয়।\n\nরিসেটের ধরন অনুযায়ী (--soft, --mixed, বা --hard), গিট ফাইলগুলোকে স্টেজিং এরিয়ায় রাখতে পারে, আনস্টেজ করতে পারে অথবা সম্পূর্ণ মুছে ফেলতে পারে।',
            commands: [
              {
                command: 'git reset --soft HEAD~1',
                description: 'Moves the branch pointer 1 commit backward while keeping all file changes staged.',
                descriptionBn: 'ব্রাঞ্চ পয়েন্টার ১টি কমিট পেছনে নেয় কিন্তু সমস্ত ফাইলের পরিবর্তন স্টেজিং এরিয়ায় রাখে।',
              },
              {
                command: 'git reset --hard HEAD~1',
                description: 'Moves the branch pointer 1 commit backward and discards all changes in working directory and staging.',
                descriptionBn: 'পয়েন্টার ১টি কমিট পেছনে নেয় এবং ওয়ার্কিং ডিরেক্টরি ও স্টেজিংয়ের সব পরিবর্তন মুছে ফেলে।',
              },
            ],
          },
          {
            type: 'pointerResetSimulator',
            title: 'Interactive Simulator: Pointer Time-Travel (HEAD~1 & HEAD~2)',
            titleBn: 'ইন্টারেক্টিভ সিমুলেটর: পয়েন্টার টাইম-ট্রাভেল (HEAD~1 ও HEAD~2)',
          },
          {
            type: 'callout',
            variant: 'important',
            title: 'Pointer Caution',
            titleBn: 'পয়েন্টার ব্যবহারে সতর্কতা',
            text: 'Using git reset --hard rewrites your working directory to the targeted commit. Any uncommitted edits that were not saved in Git will be permanently lost.',
            textBn: 'git reset --hard ব্যবহার করলে আপনার বর্তমান ফাইলগুলো সরাসরি লক্ষ্যবস্তু কমিটের অবস্থায় চলে যায়। গিট-এ সেভ না থাকা আনকমিটেড কাজ চিরতরে হারিয়ে যাবে।',
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-branch-pointers',
      subjectId: 'git',
      category: 'branching',
      difficulty: 'intermediate',
      question: 'What is HEAD in Git, and how does it relate to branch pointers?',
      questionBn: 'গিটে HEAD কী, এবং ব্রাঞ্চ পয়েন্টারের সাথে এর সম্পর্ক কী?',
      answer: 'HEAD is a symbolic reference in Git that tracks your current working location. In standard workflows, HEAD points to a branch pointer (e.g. refs/heads/main), which in turn points to the latest commit in that branch. When you commit, Git advances the active branch pointer and HEAD moves with it. If you check out a commit directly instead of a branch, HEAD enters a detached state.',
      answerBn: 'HEAD হলো গিটের একটি সিম্বলিক রেফারেন্স যা রিপোজিটরিতে আপনার বর্তমান কাজের অবস্থান নির্দেশ করে। স্বাভাবিক ওয়ার্কফ্লোতে HEAD একটি ব্রাঞ্চ পয়েন্টারকে পয়েন্ট করে (যেমন refs/heads/main), যা আবার সেই ব্রাঞ্চের সর্বশেষ কমিটকে নির্দেশ করে। কমিট করার সাথে সাথে ব্রাঞ্চ পয়েন্টার এগিয়ে যায় এবং HEAD-ও এগিয়ে যায়। ব্রাঞ্চ ছাড়া সরাসরি কোনো কমিটে গেলে HEAD ডিটাচড (detached) অবস্থায় চলে যায়।',
      keyPoints: [
        'HEAD acts as the dynamic "You Are Here" pointer in the repository',
        'Normally points to a branch name, which points to the latest commit hash',
        'Automatically advances forward whenever a new commit is made',
        'Direct checkout of commit hashes leads to a "detached HEAD" state',
      ],
      keyPointsBn: [
        'HEAD রিপোজিটরিতে "You Are Here" ডট বা মার্কারের মতো কাজ করে',
        'সাধারণত এটি একটি ব্রাঞ্চ নামকে নির্দেশ করে, যা আবার সর্বশেষ কমিট হ্যাশকে নির্দেশ করে',
        'নতুন কমিট তৈরির সাথে সাথে এটি স্বয়ংক্রিয়ভাবে এগিয়ে যায়',
        'সরাসরি কমিট হ্যাশ চেকআউট করলে "detached HEAD" অবস্থা তৈরি হয়',
      ],
      followUpQuestions: [
        'What happens when you run git reset HEAD~1 versus git checkout HEAD~1?',
      ],
    },
    quiz: {
      id: 'quiz-what-are-branches',
      subjectId: 'git',
      difficulty: 'intermediate',
      question: 'What does an asterisk (*) next to a branch name in the output of "git branch" signify?',
      questionBn: '"git branch" কমান্ডের আউটপুটে কোনো ব্রাঞ্চের নামের পাশে তারকা (*) চিহ্ন কী নির্দেশ করে?',
      options: [
        {
          id: 'opt-a',
          text: 'The branch has uncommitted changes in the staging area',
          textBn: 'স্টেজিং এরিয়ায় ব্রাঞ্চটির আনকমিটেড পরিবর্তন রয়েছে',
          isCorrect: false,
        },
        {
          id: 'opt-b',
          text: 'The HEAD pointer is currently pointing to this branch (active branch)',
          textBn: 'HEAD বর্তমানে এই ব্রাঞ্চের দিকে পয়েন্ট করে আছে (সক্রিয় ব্রাঞ্চ)',
          isCorrect: true,
        },
        {
          id: 'opt-c',
          text: 'The branch is locked and cannot be merged',
          textBn: 'ব্রাঞ্চটি লক করা আছে এবং এটি মার্জ করা যাবে না',
          isCorrect: false,
        },
        {
          id: 'opt-d',
          text: 'The branch is synchronized with remote GitHub origin',
          textBn: 'ব্রাঞ্চটি রিমোট গিটহাব অরিজিনের সাথে সিঙ্ক করা আছে',
          isCorrect: false,
        },
      ],
      explanation: 'In the output of git branch, the asterisk (*) and colored highlight denote the active branch where HEAD is currently parked.',
      explanationBn: 'git branch কমান্ডের আউটপুটে থাকা তারকা (*) চিহ্ন এবং হাইলাইটেড রং নির্দেশ করে যে HEAD বর্তমানে সেই সক্রিয় ব্রাঞ্চের ওপর অবস্থান করছে।',
    },
  },
  {
    id: 'git.branching.creating-switching',
    moduleId: 'git-branching',
    slug: 'creating-branches',
    order: 2,
    durationMinutes: 12,
    difficulty: 'intermediate',
    title: 'Creating & Switching (git switch vs checkout)',
    titleBn: 'ব্রাঞ্চ তৈরি ও পরিবর্তন (git switch)',
    summary: 'Master modern branch commands (git switch -c) over overloaded legacy checkout.',
    summaryBn: 'আধুনিক গিট সুইচ কমান্ড দিয়ে ব্রাঞ্চ পরিচালনা।',
    learningObjectives: [
      'Create and switch branches using traditional git branch and git checkout',
      'Observe pointer isolation with the disappearing file experiment',
      'Understand why git checkout was overloaded and why git switch was introduced',
      'Adopt modern git switch and git switch -c commands for everyday workflows',
    ],
    learningObjectivesBn: [
      'ঐতিহ্যবাহী git branch ও git checkout দিয়ে ব্রাঞ্চ তৈরি ও পরিবর্তন করা',
      'ফাইল উধাও ও ফিরে আসার পরীক্ষার মাধ্যমে পয়েন্টার আইসোলেশন পর্যবেক্ষণ করা',
      'git checkout কেন অতিরিক্ত কাজে ব্যবহৃত হতো এবং কেন git switch আনা হয়েছে তা বোঝা',
      'দৈনন্দিন কাজের জন্য আধুনিক git switch ও git switch -c কমান্ড আয়ত্ত করা',
    ],
    keyTakeaways: [
      'git branch <name> only creates a pointer; it does not switch your active branch.',
      'git checkout <name> moves HEAD, physically swapping files in your folder to match the destination branch.',
      'git checkout was overloaded with both branch switching and file restoration.',
      'Modern Git (2019+) cleanly separates responsibilities: git switch for branches and git restore for files.',
    ],
    sections: [
      {
        id: 'sec-classic-workflow',
        title: 'The Classic Workflow: git branch and git checkout',
        titleBn: 'ঐতিহ্যবাহী পদ্ধতি: git branch এবং git checkout',
        blocks: [
          {
            type: 'paragraph',
            text: 'In universal Git workflows taught worldwide, creating and activating a new branch requires two distinct steps:',
            textBn: 'বিশ্বব্যাপী শেখানো সাধারণ গিট ওয়ার্কফ্লোতে একটি নতুন ব্রাঞ্চ তৈরি ও সক্রিয় করতে দুটি পৃথক ধাপ অনুসরণ করা হয়:',
          },
          {
            type: 'keyConcept',
            title: 'Step 1: Creating a Branch with git branch',
            titleBn: 'ধাপ ১: git branch দিয়ে ব্রাঞ্চ তৈরি',
            text: 'Running git branch feature creates an independent branch pointer named feature. It points to the exact same commit snapshot as your current branch.\n\nCrucial Detail: Running this command does NOT step into the new branch yet! HEAD remains sitting on main.',
            textBn: 'git branch feature কমান্ড চালালে feature নামে একটি নতুন ব্রাঞ্চ পয়েন্টার তৈরি হয়। এটি বর্তমান ব্রাঞ্চের একই কমিট স্ন্যাপশটকে নির্দেশ করে।\n\nগুরুত্বপূর্ণ বিষয়: এই কমান্ড চালালেই কিন্তু আপনি নতুন ব্রাঞ্চে প্রবেশ করছেন না! HEAD তখনও main ব্রাঞ্চেই অবস্থান করে।',
            commands: [
              {
                command: 'git branch feature',
                description: 'Creates a new branch pointer named "feature" pointing to the current commit.',
                descriptionBn: 'বর্তমান কমিটকে নির্দেশ করে "feature" নামে একটি নতুন ব্রাঞ্চ পয়েন্টার তৈরি করে।',
              },
            ],
          },
          {
            type: 'keyConcept',
            title: 'Step 2: Switching Branches with git checkout',
            titleBn: 'ধাপ ২: git checkout দিয়ে ব্রাঞ্চে যাওয়া',
            text: 'Running git checkout feature shifts the HEAD pointer from main to feature. Git instantly updates the files in your local Working Directory to match the exact snapshot of the feature branch.\n\nNow, any new commits you create belong strictly to the feature branch timeline.',
            textBn: 'git checkout feature কমান্ড দিলে HEAD পয়েন্টার main থেকে সরে feature ব্রাঞ্চের ওপর বসে। গিট তাৎক্ষণিকভাবে আপনার লোকাল ফোল্ডারের ফাইলগুলোকে feature ব্রাঞ্চের স্ন্যাপশটের সাথে হুবহু মিলিয়ে আপডেট করে দেয়।\n\nএখন থেকে আপনার তৈরি করা নতুন যেকোনো কমিট শুধুমাত্র feature ব্রাঞ্চের টাইমলাইনেই যুক্ত হবে।',
            commands: [
              {
                command: 'git checkout feature',
                description: 'Switches the active branch to "feature" by moving the HEAD pointer.',
                descriptionBn: 'HEAD পয়েন্টার সরিয়ে দিয়ে সক্রিয় ব্রাঞ্চকে "feature"-এ পরিবর্তন করে।',
              },
            ],
          },
        ],
      },
      {
        id: 'sec-disappearing-file',
        title: 'The Visual "Aha!" Experiment (The Disappearing File)',
        titleBn: 'দৃশ্যমান উপলব্ধি: ফাইল উধাও ও ফিরে আসার পরীক্ষা',
        blocks: [
          {
            type: 'paragraph',
            text: 'To truly understand how pointer isolation works in your computer folder, walk through this famous hands-on experiment:',
            textBn: 'পয়েন্টার আইসোলেশন কীভাবে আপনার কম্পিউটারের ফোল্ডারে কাজ করে তা গভীরভাবে বোঝার জন্য এই বাস্তব পরীক্ষাটি করুন:',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Switch to your new branch: git checkout feature',
              'Create a new file called feature1.txt and commit it: git add feature1.txt && git commit -m "Add feature1"',
              'Now switch back to main: git checkout main',
              'Look at your folder in File Explorer or VS Code: feature1.txt has instantly disappeared! It is not deleted—it simply does not exist in the history tracked by the main branch pointer.',
              'Switch back to your feature branch: git checkout feature. Like magic, feature1.txt instantly reappears!',
            ],
            itemsBn: [
              'আপনার নতুন ব্রাঞ্চে যান: git checkout feature',
              'feature1.txt নামে একটি নতুন ফাইল তৈরি করে কমিট করুন: git add feature1.txt && git commit -m "Add feature1"',
              'এবার মূল ব্রাঞ্চে ফিরে যান: git checkout main',
              'আপনার ফাইল ম্যানেজার বা VS Code-এ তাকান: feature1.txt ফাইলটি মুহূর্তের মধ্যে গায়েব হয়ে গেছে! এটি মুছে যায়নি, বরং main ব্রাঞ্চের ইতিহাসে এই ফাইলের কোনো অস্তিত্ব নেই।',
              'আবার ফিচার ব্রাঞ্চে ফিরে যান: git checkout feature। সাথে সাথে ফোল্ডারে feature1.txt ফাইলটি ফিরে আসবে!',
            ],
          },
          {
            type: 'callout',
            variant: 'note',
            title: 'Why Files Disappear and Reappear',
            titleBn: 'ফাইল কেন উধাও হয় এবং ফিরে আসে',
            text: 'Git is not making duplicate folders on your drive. It actively swaps the contents of your working directory in milliseconds to match whatever commit snapshot HEAD is pointing to.',
            textBn: 'গিট আপনার ড্রাইভে কোনো ডুপ্লিকেট ফোল্ডার তৈরি করে না। HEAD পয়েন্টার যে স্ন্যাপশটকে নির্দেশ করছে, মিলি-সেকেন্ডের মধ্যে গিট আপনার লোকাল ফোল্ডারের ফাইলগুলোকে ঠিক সেই স্ন্যাপশট অনুযায়ী সাজিয়ে দেয়।',
          },
          {
            type: 'branchSwitchSimulator',
            title: 'Interactive Simulator: The Disappearing File Experiment',
            titleBn: 'ইন্টারেক্টিভ সিমুলেটর: ফাইল উধাও ও ফিরে আসার পরীক্ষা',
          },
        ],
      },
      {
        id: 'sec-modern-switch',
        title: 'The Modern Solution: git switch vs. git checkout',
        titleBn: 'আধুনিক সমাধান: git switch বনাম git checkout',
        blocks: [
          {
            type: 'paragraph',
            text: 'Historically, developers found git checkout confusing and risky because it was overloaded with two completely unrelated responsibilities:',
            textBn: 'ঐতিহাসিকভাবে ডেভেলপারদের কাছে git checkout বিভ্রান্তিকর ও ঝুঁকিপূর্ণ মনে হতো, কারণ এটি দুটি সম্পূর্ণ ভিন্ন কাজের জন্য ব্যবহৃত হতো:',
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Navigating branches: git checkout <branch> (Safe: switches branches)',
              'Discarding file changes: git checkout -- <file> (Dangerous: permanently deletes uncommitted edits!)',
            ],
            itemsBn: [
              'ব্রাঞ্চে যাওয়া: git checkout <branch> (নিরাপদ: ব্রাঞ্চ পরিবর্তন করে)',
              'ফাইলের পরিবর্তন বাতিল: git checkout -- <file> (ঝুঁকিপূর্ণ: সেভ না করা কোড চিরতরে মুছে দেয়!)',
            ],
          },
          {
            type: 'paragraph',
            text: 'A simple typo like git checkout file.txt instead of git checkout feature could accidentally discard your unsaved code! To solve this, Git 2.23 (2019) cleanly separated these concerns into two dedicated commands:',
            textBn: 'git checkout feature লিখতে গিয়ে অসাবধানতাবশত টাইপো হয়ে git checkout file.txt হয়ে গেলে ফাইলের সব আনকমিটেড কোড স্থায়ীভাবে মুছে যেত! এই সমস্যার সমাধানে গিট ২.২৩ (২০১৯)-এ দায়িত্ব দুটি আলাদা করা হয়:',
          },
          {
            type: 'keyConcept',
            title: 'git switch (Modern Standard)',
            titleBn: 'git switch (আধুনিক মানদণ্ড)',
            text: 'git switch is dedicated EXCLUSIVELY to switching and creating branches. It cannot touch or discard file contents, making it 100% safe from accidental file loss.\n\nYou can create and switch to a new branch in a single command using the -c (--create) flag.',
            textBn: 'git switch শুধুমাত্র ব্রাঞ্চ তৈরি ও পরিবর্তনের জন্য নির্দিষ্ট। এটি ফাইলের ভেতরের কোড কখনোই মুছে ফেলতে পারে না, যা ভুলবশত কোড হারানোর ঝুঁকি শূন্যে নামিয়ে আনে।\n\nআপনি -c (--create) ফ্ল্যাগ দিয়ে এক কমান্ডেই নতুন ব্রাঞ্চ তৈরি ও তাতে সুইচ করতে পারেন।',
            commands: [
              {
                command: 'git switch feature',
                description: 'Switches to an existing branch named "feature".',
                descriptionBn: 'বিদ্যমান "feature" ব্রাঞ্চে সুইচ করে।',
              },
              {
                command: 'git switch -c feature',
                description: 'Creates a new branch named "feature" and switches to it in one single command.',
                descriptionBn: 'এক কমান্ডেই "feature" নামে নতুন ব্রাঞ্চ তৈরি করে এবং তাতে সুইচ করে।',
              },
              {
                command: 'git switch -',
                description: 'Switches back to your previous branch (like the back button on your browser).',
                descriptionBn: 'পূর্বের ব্রাঞ্চে দ্রুত ফিরে যায় (ব্রাউজারের ব্যাক বাটনের মতো)।',
              },
            ],
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Summary Comparison',
            titleBn: 'সংক্ষিপ্ত তুলনা',
            text: '• Switch branch: git switch <name> (older: git checkout <name>)\n• Create & switch: git switch -c <name> (older: git checkout -b <name>)\n• Discard file changes: git restore <file> (older: git checkout -- <file>)',
            textBn: '• ব্রাঞ্চ পরিবর্তন: git switch <name> (পুরোনো: git checkout <name>)\n• তৈরি ও পরিবর্তন: git switch -c <name> (পুরোনো: git checkout -b <name>)\n• ফাইলের পরিবর্তন বাতিল: git restore <file> (পুরোনো: git checkout -- <file>)',
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-switch-vs-checkout',
      subjectId: 'git',
      category: 'branching',
      difficulty: 'intermediate',
      question: 'Why did Git introduce "git switch" and "git restore" when "git checkout" already worked?',
      questionBn: 'আগে থেকেই "git checkout" কাজ করতে থাকলে গিট কেন "git switch" এবং "git restore" চালু করল?',
      answer: 'git checkout was heavily overloaded, performing two fundamentally different jobs: navigating branch pointers and discarding uncommitted working tree modifications. If a branch name matched a filename or a typo occurred, developers risked accidentally wiping out uncommitted work permanently. To adhere to the Single Responsibility Principle and protect users, Git 2.23 introduced "git switch" strictly for branches and "git restore" strictly for file contents.',
      answerBn: 'git checkout কমান্ডটি অতিরিক্ত ও পরস্পরবিরোধী কাজে ব্যবহৃত হতো: ব্রাঞ্চ পরিবর্তন করা এবং ফাইলের সেভ না করা পরিবর্তন মুছে ফেলা। কোনো ব্রাঞ্চের নামের সাথে ফাইলের নামের মিল থাকলে বা টাইপো হলে সেভ না করা কোড চিরতরে হারিয়ে যাওয়ার মারাত্মক ঝুঁকি থাকত। দায়িত্বের স্পষ্টতা ও নিরাপত্তার জন্য গিট ২.২৩ ভার্সনে ব্রাঞ্চের জন্য "git switch" এবং ফাইলের জন্য "git restore" আনা হয়।',
      keyPoints: [
        'git checkout violated the Single Responsibility Principle by doing branch navigation and file restoration',
        'Typo accidents in git checkout could cause permanent uncommitted code loss',
        'git switch is 100% focused on branches (-c creates and switches)',
        'git restore handles discarding and staging file modifications safely',
      ],
      keyPointsBn: [
        'git checkout ব্রাঞ্চ ও ফাইল রিস্টোর দুটো বিপরীতমুখী কাজ করে দায়িত্বের স্বচ্ছতা নষ্ট করেছিল',
        'টাইপোজনিত ভুলের কারণে আনকমিটেড কাজ চিরতরে মুছে যাওয়ার ঝুঁকি থাকত',
        'git switch শুধুমাত্র ব্রাঞ্চ পরিচালনায় নিবেদিত (-c দিয়ে তৈরি ও সুইচ হয়)',
        'git restore নিরাপদে ফাইল রিস্টোর ও আনস্টেজ করার কাজ পরিচালনা করে',
      ],
      followUpQuestions: [
        'How does git switch -c compare to git checkout -b?',
      ],
    },
    quiz: {
      id: 'quiz-creating-switching',
      subjectId: 'git',
      difficulty: 'intermediate',
      question: 'Which modern Git command creates a new branch named "login-ui" and immediately switches to it?',
      questionBn: 'কোন আধুনিক গিট কমান্ডটি "login-ui" নামে একটি নতুন ব্রাঞ্চ তৈরি করে সাথে সাথেই সেটিতে সুইচ করে?',
      options: [
        {
          id: 'opt-a',
          text: 'git branch -c login-ui',
          textBn: 'git branch -c login-ui',
          isCorrect: false,
        },
        {
          id: 'opt-b',
          text: 'git switch -b login-ui',
          textBn: 'git switch -b login-ui',
          isCorrect: false,
        },
        {
          id: 'opt-c',
          text: 'git switch -c login-ui',
          textBn: 'git switch -c login-ui',
          isCorrect: true,
        },
        {
          id: 'opt-d',
          text: 'git checkout -c login-ui',
          textBn: 'git checkout -c login-ui',
          isCorrect: false,
        },
      ],
      explanation: 'In modern Git, "git switch -c <name>" (where -c stands for --create) creates a new branch and switches to it in one atomic step. The legacy syntax was "git checkout -b <name>".',
      explanationBn: 'আধুনিক গিটে "git switch -c <name>" (-c মানে create) এক কমান্ডেই নতুন ব্রাঞ্চ তৈরি করে এবং তাতে সুইচ করে। পুরোনো সিনট্যাক্স ছিল "git checkout -b <name>"।',
    },
  },
];
