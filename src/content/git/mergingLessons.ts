import { CurriculumLesson } from '@/types/content';

/**
 * Module 4: Merging & Conflict Resolution Lessons
 *
 * Designed with ultra-simple, relatable examples for beginners:
 * explaining fast-forward vs 3-way merges, why Git never silently overwrites files,
 * conflict marker anatomy, and interactive conflict resolution.
 */
export const MERGING_LESSONS: CurriculumLesson[] = [
  {
    id: 'git.merging.types',
    moduleId: 'git-merging',
    slug: 'merge-types',
    order: 1,
    durationMinutes: 12,
    difficulty: 'intermediate',
    title: 'Fast-Forward vs 3-Way Merge',
    titleBn: 'ফাস্ট-ফরোয়ার্ড বনাম ৩-ওয়ে মার্জ',
    summary: 'Understand common ancestor commits and why merge commits are created.',
    summaryBn: 'কমন অ্যানসেস্টর কমিট ও মার্জ কমিটের গঠন।',
    learningObjectives: [
      'Understand what merging means: bringing isolated timelines together',
      'Explain a Fast-Forward merge and why it creates zero merge commits',
      'Explain a 3-Way Merge when two branches touch different files',
      'Recognize merge commits with two parent references',
    ],
    learningObjectivesBn: [
      'মার্জিং কী তা বোঝা: আলাদা টাইমলাইনগুলোকে একত্রে যুক্ত করা',
      'ফাস্ট-ফরোয়ার্ড মার্জ কী এবং কেন এতে নতুন মার্জ কমিট লাগে না তা ব্যাখ্যা করা',
      'দুটি ব্রাঞ্চ আলাদা ফাইলে কাজ করলে কীভাবে ৩-ওয়ে মার্জ হয় তা বোঝা',
      'দুটি প্যারেন্ট রেফারেন্সযুক্ত মার্জ কমিট শনাক্ত করা',
    ],
    keyTakeaways: [
      'Fast-forward happens when main has no new commits: Git simply slides the pointer forward.',
      '3-Way Merge happens when both branches diverged: Git uses the common base snapshot to combine them.',
      'A merge commit is special because it points back to TWO parent commits.',
      'Different files merge automatically without conflicts.',
    ],
    sections: [
      {
        id: 'sec-merge-basics',
        title: 'What is Merging? (Bringing Timelines Together)',
        titleBn: 'মার্জিং কী? (টাইমলাইন একত্রিত করা)',
        blocks: [
          {
            type: 'paragraph',
            text: 'Once you finish developing a feature in your isolated branch, you need to bring those changes back into your main branch. This process is called merging.',
            textBn: 'আপনার আলাদা ফিচার ব্রাঞ্চে কাজ শেষ হলে সেই পরিবর্তনগুলোকে মূল main ব্রাঞ্চের সাথে যুক্ত করতে হয়। এই প্রক্রিয়াটিকে বলা হয় মার্জিং (Merging)।',
          },
          {
            type: 'keyConcept',
            title: 'The 2 Steps to Merge',
            titleBn: 'মার্জ করার ২টি সহজ ধাপ',
            text: 'Always remember: you merge the incoming branch INTO your current branch.\n\n1. Step 1: Switch to the branch that should RECEIVE the changes (usually main):\n   git switch main (or git checkout main)\n\n2. Step 2: Merge the feature branch into it:\n   git merge feature',
            textBn: 'সর্বদা মনে রাখবেন: আপনি যে ব্রাঞ্চে দাঁড়িয়ে আছেন, সেখানে অন্য ব্রাঞ্চের পরিবর্তন আনা হয়।\n\n১. ধাপ ১: যে ব্রাঞ্চে পরিবর্তন গ্রহণ করবেন (সাধারণত main), সেটিতে সুইচ করুন:\n   git switch main\n\n২. ধাপ ২: এবার ফিচার ব্রাঞ্চটিকে মার্জ করুন:\n   git merge feature',
            commands: [
              {
                command: 'git switch main',
                description: 'Step 1: Check out the destination branch first.',
                descriptionBn: 'ধাপ ১: প্রথমে যে ব্রাঞ্চে মার্জ করবেন সেটিতে যান।',
              },
              {
                command: 'git merge feature-login',
                description: 'Step 2: Pull all commits from feature-login into main.',
                descriptionBn: 'ধাপ ২: feature-login-এর সমস্ত কমিট main-এ মার্জ করুন।',
              },
            ],
          },
        ],
      },
      {
        id: 'sec-fast-forward',
        title: 'Type 1: The Fast-Forward Merge (Clean & Linear)',
        titleBn: 'টাইপ ১: ফাস্ট-ফরোয়ার্ড মার্জ (সরল ও দ্রুত)',
        blocks: [
          {
            type: 'paragraph',
            text: 'Imagine reading a book. You place a bookmark on page 10 (main). You keep reading on a sticky note up to page 13 (feature). Meanwhile, nobody else touched the book.',
            textBn: 'মনে করুন আপনি একটি বই পড়ছেন। আপনি ১০ নম্বর পৃষ্ঠায় বুকমার্ক (main) রাখলেন। এরপর আপনি একটি আলাদা চিরকুটে আরও ৩ পৃষ্ঠা পড়ে ১৩ নম্বর পৃষ্ঠায় (feature) পৌঁছালেন। এই সময়ে অন্য কেউ বইটি স্পর্শ করেনি।',
          },
          {
            type: 'keyConcept',
            title: 'How Fast-Forward Works',
            titleBn: 'ফাস্ট-ফরোয়ার্ড কীভাবে কাজ করে',
            text: 'When you run "git merge feature", Git looks at the history. Since main did not create any new commits while you were away, Git does not need to do any complex calculations!\n\nGit simply slides the main pointer forward to point to page 13. There is no new merge commit created—the timeline stays completely linear.',
            textBn: 'আপনি যখন "git merge feature" চালান, গিট পেছনের ইতিহাস দেখে। যেহেতু আপনি অন্য ব্রাঞ্চে কাজ করার সময় মূল main ব্রাঞ্চে নতুন কোনো কমিট হয়নি, তাই গিটের জটিল কিছু করার প্রয়োজন হয় না!\n\nগিট কেবল main পয়েন্টারটিকে সরাসরি এগিয়ে নিয়ে নতুন কমিটের ওপর বসিয়ে দেয়। এখানে কোনো অতিরিক্ত মার্জ কমিট তৈরি হয় না—ইতিহাস একদম সোজা লাইনে থাকে।',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Zero Risk of Conflict',
            titleBn: 'কনফ্লিক্টের কোনো সম্ভাবনা নেই',
            text: 'A Fast-Forward merge NEVER has merge conflicts because the target branch has not changed. It is simply catching up to the latest commit.',
            textBn: 'ফাস্ট-ফরোয়ার্ড মার্জে কখনোই কোনো কনফ্লিক্ট হয় না, কারণ মূল ব্রাঞ্চের কোনো পরিবর্তন হয়নি। এটি কেবল নতুন কমিটের সাথে তাল মিলিয়ে পয়েন্টার এগিয়ে নেয়।',
          },
        ],
      },
      {
        id: 'sec-three-way-merge',
        title: 'Type 2: The 3-Way Merge (Diverged Timelines)',
        titleBn: 'টাইপ ২: ৩-ওয়ে মার্জ (আলাদা ফাইলে কাজ)',
        blocks: [
          {
            type: 'paragraph',
            text: 'Now imagine a team scenario: You branched off to create footer.txt on your branch. At the same time, your teammate added header.txt directly on main. Both branches have moved forward with independent commits!',
            textBn: 'এবার একটি বাস্তব টিম কাজের কথা ভাবুন: আপনি আপনার ব্রাঞ্চে footer.txt তৈরি করতে গেলেন। একই সময়ে আপনার সহকর্মী মূল main ব্রাঞ্চে header.txt তৈরি করলেন। অর্থাৎ উভয় ব্রাঞ্চেই নতুন নতুন কমিট তৈরি হয়েছে!',
          },
          {
            type: 'keyConcept',
            title: 'Why It Is Called a "3-Way" Merge',
            titleBn: 'কেন একে "৩-ওয়ে" মার্জ বলা হয়',
            text: 'To combine these two branches, Git looks at 3 snapshots:\n1. The Common Ancestor (the base commit before both branches split)\n2. Your branch snapshot (added footer.txt)\n3. The main branch snapshot (added header.txt)\n\nBecause you both touched completely DIFFERENT files, Git combines them automatically! It creates a special "Merge Commit" that has two parent commits.',
            textBn: 'এই দুটি ব্রাঞ্চকে যুক্ত করতে গিট ৩টি স্ন্যাপশট পর্যবেক্ষণ করে:\n১. কমন অ্যানসেস্টর (উভয় ব্রাঞ্চ আলাদা হওয়ার আগের মূল বেস কমিট)\n২. আপনার ব্রাঞ্চের স্ন্যাপশট (footer.txt যোগ হয়েছে)\n৩. main ব্রাঞ্চের স্ন্যাপশট (header.txt যোগ হয়েছে)\n\nযেহেতু আপনারা দুজন সম্পূর্ণ ভিন্ন ফাইলে কাজ করেছেন, গিট কোনো ঝামেলা ছাড়াই স্বয়ংক্রিয়ভাবে দুটি কাজকে একত্র করে দেয়! এরপর গিট একটি নতুন "মার্জ কমিট" তৈরি করে যার দুটি প্যারেন্ট থাকে।',
          },
          {
            type: 'callout',
            variant: 'note',
            title: 'Auto-Merging Magic',
            titleBn: 'অটো-মার্জের সুবিধা',
            text: 'As long as developers work on different files (or even different sections of the same file), Git merges everything automatically without asking for help.',
            textBn: 'যতক্ষণ ডেভেলপাররা আলাদা ফাইলে (কিংবা একই ফাইলের ভিন্ন লাইনে) কাজ করেন, গিট স্বয়ংক্রিয়ভাবে সবকিছু মার্জ করে দেয়।',
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-fast-forward-vs-3way',
      subjectId: 'git',
      category: 'merging',
      difficulty: 'intermediate',
      question: 'What is the difference between a Fast-Forward merge and a 3-Way merge in Git?',
      questionBn: 'গিটে ফাস্ট-ফরোয়ার্ড মার্জ এবং ৩-ওয়ে মার্জের মধ্যে পার্থক্য কী?',
      answer: 'A Fast-Forward merge occurs when the destination branch has not diverged from the source branch. Git simply advances the branch pointer forward without creating a new commit. A 3-Way merge occurs when both branches have diverged with independent commits. Git compares the common ancestor commit, branch A, and branch B, automatically combines changes across non-overlapping files, and creates a dedicated merge commit with two parents.',
      answerBn: 'ফাস্ট-ফরোয়ার্ড মার্জ তখন ঘটে যখন মূল ব্রাঞ্চে কোনো নতুন কমিট হয়নি; গিট কেবল ব্রাঞ্চ পয়েন্টারটিকে সরাসরি এগিয়ে দেয় এবং কোনো নতুন কমিট তৈরি করে না। অন্যদিকে ৩-ওয়ে মার্জ তখন ঘটে যখন উভয় ব্রাঞ্চেই আলাদা আলাদা কমিট থাকে। গিট কমন অ্যানসেস্টর, ব্রাঞ্চ A এবং ব্রাঞ্চ B-এর তুলনা করে ভিন্ন ফাইলগুলোকে স্বয়ংক্রিয়ভাবে একত্র করে এবং দুটি প্যারেন্টসহ একটি নতুন মার্জ কমিট তৈরি করে।',
      keyPoints: [
        'Fast-Forward: No divergence, linear history, no merge commit created',
        '3-Way Merge: Diverged branches, requires a common ancestor comparison',
        '3-Way Merge creates a merge commit with two parent references',
        'Auto-merge succeeds when changes touch different files',
      ],
      keyPointsBn: [
        'ফাস্ট-ফরোয়ার্ড: কোনো ডাইভারজেন্স নেই, সরল ইতিহাস, কোনো নতুন মার্জ কমিট হয় না',
        '৩-ওয়ে মার্জ: উভয় ব্রাঞ্চে নতুন কাজ হয়েছে, কমন অ্যানসেস্টরের সাথে তুলনা করা হয়',
        '৩-ওয়ে মার্জে দুটি প্যারেন্টযুক্ত একটি নতুন মার্জ কমিট তৈরি হয়',
        'ভিন্ন ফাইলে পরিবর্তন হলে স্বয়ংক্রিয়ভাবে অটো-মার্জ সফল হয়',
      ],
      followUpQuestions: [
        'Can you force Git to create a merge commit even during a fast-forward merge? (Yes, with git merge --no-ff)',
      ],
    },
    quiz: {
      id: 'quiz-merge-types',
      subjectId: 'git',
      difficulty: 'intermediate',
      question: 'Under what condition does Git perform a Fast-Forward merge instead of a 3-Way merge?',
      questionBn: 'কোন পরিস্থিতিতে গিট ৩-ওয়ে মার্জের বদলে একটি ফাস্ট-ফরোয়ার্ড মার্জ সম্পন্ন করে?',
      options: [
        {
          id: 'opt-a',
          text: 'When both branches have modified the exact same files',
          textBn: 'যখন উভয় ব্রাঞ্চেই একই ফাইল এডিট করা হয়েছে',
          isCorrect: false,
        },
        {
          id: 'opt-b',
          text: 'When the target branch (main) has no new commits since the feature branch was created',
          textBn: 'যখন ফিচার ব্রাঞ্চ তৈরির পর থেকে মূল target ব্রাঞ্চে (main) নতুন কোনো কমিট হয়নি',
          isCorrect: true,
        },
        {
          id: 'opt-c',
          text: 'When you are connected to GitHub with high-speed internet',
          textBn: 'যখন হাই-স্পিড ইন্টারনেটে গিটহাবের সাথে যুক্ত থাকেন',
          isCorrect: false,
        },
        {
          id: 'opt-d',
          text: 'When you run git commit -m "Fast forward"',
          textBn: 'যখন আপনি git commit -m "Fast forward" কমান্ড দেন',
          isCorrect: false,
        },
      ],
      explanation: 'A Fast-Forward merge is possible only when the receiving branch has not added any commits since the branch split. Git just advances the pointer forward to the tip of the feature branch.',
      explanationBn: 'ফাস্ট-ফরোয়ার্ড মার্জ কেবল তখনই সম্ভব যখন ব্রাঞ্চ আলাদা হওয়ার পর মূল ব্রাঞ্চে কোনো নতুন কমিট হয়নি। গিট কেবল পয়েন্টারটিকে সরাসরি এগিয়ে নিয়ে যায়।',
    },
  },
  {
    id: 'git.merging.conflicts',
    moduleId: 'git-merging',
    slug: 'resolving-conflicts',
    order: 2,
    durationMinutes: 15,
    difficulty: 'intermediate',
    title: 'Diagnosing & Resolving Merge Conflicts',
    titleBn: 'মার্জ কনফ্লিক্ট নির্ণয় ও সমাধান',
    summary: 'Read conflict markers (<<<<<<<, =======, >>>>>>>) and complete merges cleanly.',
    summaryBn: 'কনফ্লিক্ট মার্কার বোঝা ও সঠিক সমাধান স্টেজ করা।',
    learningObjectives: [
      'Understand the Overwrite Issue: Why Git refuses to silently destroy code',
      'Read and decode conflict markers (<<<<<<<, =======, >>>>>>>)',
      'Resolve conflicts step-by-step using an interactive conflict editor',
      'Use git merge --abort to safely cancel a merge in an emergency',
    ],
    learningObjectivesBn: [
      'ওভাররাইট সমস্যা বোঝা: গিট কেন কখনো কাউকে না জানিয়ে কোড মুছে ফেলে না',
      'কনফ্লিক্ট মার্কার (<<<<<<<, =======, >>>>>>>) পড়ে অর্থ বুঝতে পারা',
      'ইন্টারেক্টিভ এডিটরের সাহায্যে ধাপে ধাপে কনফ্লিক্ট সমাধান করা',
      'জরুরি পরিস্থিতিতে git merge --abort দিয়ে মার্জ বাতিল করে নিরাপদ অবস্থায় ফেরা',
    ],
    keyTakeaways: [
      'A merge conflict is NOT a bug; it is Git’s safety net preventing accidental code loss.',
      '<<<<<<< HEAD shows your current code; >>>>>>> shows the incoming teammate code.',
      'To resolve: pick the text you want, delete the marker lines, then git add and git commit.',
      'You can always cancel a merge cleanly with git merge --abort.',
    ],
    sections: [
      {
        id: 'sec-the-overwrite-issue',
        title: 'The Overwrite Issue: Why Conflicts Happen',
        titleBn: 'ওভাররাইট সমস্যা: কনফ্লিক্ট কেন ঘটে?',
        blocks: [
          {
            type: 'paragraph',
            text: 'Beginners often wonder: "Why can\'t Git just merge everything automatically? Why did it stop and show an error?"',
            textBn: 'নতুনরা প্রায়ই ভাবেন: "গিট কেন নিজে নিজে সবকিছু মার্জ করে দেয় না? কেন হঠাৎ থেমে গিয়ে কনফ্লিক্ট দেখায়?"',
          },
          {
            type: 'keyConcept',
            title: 'Why Git Refuses to Overwrite (The Safety Guard)',
            titleBn: 'গিট কেন ওভাররাইট করতে অস্বীকার করে (নিরাপত্তা নীতি)',
            text: 'Imagine a simple file called welcome.txt:\n• On main, you changed Line 1 to: "Hello! Welcome to GitVerse."\n• On feature, your teammate changed Line 1 to: "Hey everyone! Welcome to CodeCraft."\n\nIf Git tried to guess and blindly overwrote one sentence with the other, one person\'s hard work would be silently destroyed!\n\nTo protect your team, Git deliberately stops the merge, leaves both versions in the file, and asks YOU to decide.',
            textBn: 'একটি সাধারণ টেক্সট ফাইল welcome.txt-এর কথা ভাবুন:\n• main ব্রাঞ্চে আপনি ১ নম্বর লাইনে লিখেছেন: "Hello! Welcome to GitVerse."\n• feature ব্রাঞ্চে আপনার সহকর্মী একই লাইনে লিখেছেন: "Hey everyone! Welcome to CodeCraft."\n\nগিট যদি নিজে নিজে সিদ্ধান্ত নিয়ে যেকোনো একজনের লেখা দিয়ে অন্যজনের লেখা মুছে দিত (overwrite), তবে একজনের পরিশ্রমের কোড চিরতরে হারিয়ে যেত!\n\nআপনার কোড নিরাপদ রাখতে গিট থামে, ফাইলে দুটি লেখাই অক্ষত রাখে এবং আপনাকে বলে: "আমি সিদ্ধান্ত নিতে পারছি না, আপনি দেখে বলুন কোনটা রাখবেন।"',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Remember This Golden Rule',
            titleBn: 'এই মূল সত্যটি মনে রাখুন',
            text: 'Merge conflicts are NOT mistakes or broken code. They are simply Git asking you: "Two people edited this same line—which one should we keep?"',
            textBn: 'মার্জ কনফ্লিক্ট কোনো ত্রুটি বা ভুল নয়। এটি কেবল গিট-এর একটি প্রশ্ন: "দুজন মানুষ একই লাইনে আলাদা কথা লিখেছেন—আমরা কোনটি রাখব?"',
          },
        ],
      },
      {
        id: 'sec-anatomy-markers',
        title: 'Anatomy of Conflict Markers: <<<<<<< and >>>>>>>',
        titleBn: 'কনফ্লিক্ট মার্কারের পরিচয়: <<<<<<< এবং >>>>>>>',
        blocks: [
          {
            type: 'paragraph',
            text: 'When a conflict happens, Git pauses and writes special markers directly inside the conflicting file:',
            textBn: 'কনফ্লিক্ট তৈরি হলে গিট থেমে যায় এবং সরাসরি আক্রান্ত ফাইলের ভেতর বিশেষ চিহ্ন লিখে দেয়:',
          },
          {
            type: 'keyConcept',
            title: 'Decoding the 3 Markers',
            titleBn: 'চিহ্নগুলোর সহজ অর্থ',
            text: '<<<<<<< HEAD\nHello! Welcome to GitVerse.  <-- Your code on the current branch (main)\n=======\nHey everyone! Welcome to CodeCraft.  <-- Incoming code from the feature branch\n>>>>>>> feature-welcome\n\n1. <<<<<<< HEAD: Starts your current branch\'s version.\n2. =======: The dividing line between the two versions.\n3. >>>>>>> branch-name: Ends the incoming branch\'s version.',
            textBn: '<<<<<<< HEAD\nHello! Welcome to GitVerse.  <-- আপনার বর্তমান ব্রাঞ্চের (main) কোড\n=======\nHey everyone! Welcome to CodeCraft.  <-- অন্য ব্রাঞ্চ (feature) থেকে আসা কোড\n>>>>>>> feature-welcome\n\n১. <<<<<<< HEAD: আপনার বর্তমান ব্রাঞ্চের লেখার শুরু নির্দেশ করে।\n২. =======: দুটি লেখার মাঝখানের সীমানা নির্দেশ করে।\n৩. >>>>>>> branch-name: অন্য ব্রাঞ্চ থেকে আসা লেখার সমাপ্তি নির্দেশ করে।',
          },
        ],
      },
      {
        id: 'sec-interactive-resolver',
        title: 'Interactive Sandbox: Resolve a Conflict Yourself',
        titleBn: 'ইন্টারেক্টিভ স্যান্ডবক্স: নিজের হাতে কনফ্লিক্ট সমাধান করুন',
        blocks: [
          {
            type: 'paragraph',
            text: 'Try resolving a merge conflict yourself in the interactive sandbox below. Click "Try to Merge" to trigger the clash, choose which line to keep, and finalize the merge commit!',
            textBn: 'নিচের ইন্টারেক্টিভ স্যান্ডবক্সে নিজের হাতে মার্জ কনফ্লিক্ট সমাধানের অভিজ্ঞতা নিন। "Try to Merge" বাটনে ক্লিক করে কনফ্লিক্ট তৈরি করুন, আপনার পছন্দের লাইনটি বেছে নিন এবং মার্জ কমিট সম্পন্ন করুন!',
          },
          {
            type: 'mergeConflictSimulator',
            title: 'Hands-on Sandbox: Solving a Merge Conflict Step-by-Step',
            titleBn: 'হাতে-কলমে পরীক্ষা: মার্জ কনফ্লিক্ট কীভাবে সমাধান করবেন?',
          },
        ],
      },
      {
        id: 'sec-resolution-steps',
        title: 'The 4 Steps to Resolve Any Conflict',
        titleBn: 'যেকোনো কনফ্লিক্ট সমাধানের ৪টি সহজ ধাপ',
        blocks: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Step 1: Open the conflicted file in VS Code or your text editor.',
              'Step 2: Decide which lines you want to keep, and delete the <<<<<<<, =======, and >>>>>>> marker lines.',
              'Step 3: Tell Git the conflict is solved by staging the file: git add welcome.txt',
              'Step 4: Complete the merge by committing: git commit',
            ],
            itemsBn: [
              'ধাপ ১: VS Code বা টেক্সট এডিটরে কনফ্লিক্ট হওয়া ফাইলটি খুলুন।',
              'ধাপ ২: যে লাইনটি রাখতে চান সেটি রেখে <<<<<<<, =======, এবং >>>>>>> মার্কার লাইনগুলো মুছে ফাইল সেভ করুন।',
              'ধাপ ৩: ফাইল স্টেজ করে গিটকে জানান সমস্যা সমাধান হয়েছে: git add welcome.txt',
              'ধাপ ৪: কমিট করে মার্জ সম্পন্ন করুন: git commit',
            ],
          },
          {
            type: 'keyConcept',
            title: 'The Emergency Escape Hatch: git merge --abort',
            titleBn: 'জরুরি পালানোর রাস্তা: git merge --abort',
            text: 'If you ever encounter a confusing conflict and feel overwhelmed or not ready to resolve it, don\'t panic!\n\nRun "git merge --abort".\n\nGit will instantly cancel the merge and rewind your project back to exactly how it was before you typed git merge, with zero changes or damage.',
            textBn: 'যদি কখনো অনেক বড় জটিল কনফ্লিক্ট দেখে ভয় পান বা তৎক্ষণাৎ সমাধান করতে না চান, তবে ঘাবড়াবেন না!\n\nসহজেই চালান: "git merge --abort"।\n\nগিট সাথে সাথে মার্জ প্রক্রিয়া বাতিল করে আপনার প্রজেক্টকে ঠিক আগের নিখুঁত অবস্থায় ফিরিয়ে আনবে, যেন কিছুই ঘটেনি।',
            commands: [
              {
                command: 'git merge --abort',
                description: 'Safely cancel the merge and return your repository to the pre-merge state.',
                descriptionBn: 'মার্জ সম্পূর্ণ বাতিল করে পূর্বের নিরাপদ অবস্থায় ফিরে যান।',
              },
            ],
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-merge-conflicts',
      subjectId: 'git',
      category: 'merging',
      difficulty: 'intermediate',
      question: 'What causes a merge conflict in Git, and how do you resolve it?',
      questionBn: 'গিটে মার্জ কনফ্লিক্ট কেন হয়, এবং এটি কীভাবে সমাধান করা হয়?',
      answer: 'A merge conflict occurs when two branches modify the same line of code in the same file independently, or when one branch edits a file that another branch deleted. Git refuses to guess which change should win to prevent silent data loss. Git inserts conflict markers (<<<<<<< HEAD, =======, >>>>>>>) into the file. To resolve it, a developer manually selects the desired content, deletes the conflict markers, stages the file with "git add", and finalizes the merge commit with "git commit".',
      answerBn: 'মার্জ কনফ্লিক্ট ঘটে যখন দুটি ব্রাঞ্চ একই ফাইলের একই লাইনে আলাদা পরিবর্তন করে, অথবা এক ব্রাঞ্চ যে ফাইল ডিলিট করেছে অন্য ব্রাঞ্চ তা এডিট করেছে। কোনো কোড যাতে হারিয়ে না যায় তাই গিট নিজে নিজে সিদ্ধান্ত না নিয়ে ফাইলে কনফ্লিক্ট মার্কার (<<<<<<<, =======, >>>>>>>) বসিয়ে দেয়। সমাধান করতে ডেভেলপার কাঙ্ক্ষিত লেখাটি রেখে মার্কারগুলো মুছে ফেলে, "git add" দিয়ে স্টেজ করে এবং "git commit" চালিয়ে মার্জ সম্পন্ন করে।',
      keyPoints: [
        'Occurs when overlapping edits happen on the exact same lines',
        'Git refuses to silently overwrite code to prevent data loss',
        'Markers: <<<<<<< (current branch), ======= (divider), >>>>>>> (incoming)',
        'Resolution: edit file, remove markers, git add, and git commit',
        'Abort cleanly at any time with git merge --abort',
      ],
      keyPointsBn: [
        'একই ফাইলের একই লাইনে পরস্পরবিরোধী পরিবর্তন হলে ঘটে',
        'কোড হারানোর ঝুঁকি এড়াতে গিট অন্ধভাবে ওভাররাইট করতে অস্বীকৃতি জানায়',
        'মার্কার: <<<<<<< (বর্তমান ব্রাঞ্চ), ======= (বিভাজক), >>>>>>> (আগত ব্রাঞ্চ)',
        'সমাধান: ফাইল এডিট করে মার্কার মুছে ফেলা, git add ও git commit করা',
        'যেকোনো সময় git merge --abort দিয়ে নিরাপদে মার্জ বাতিল করা যায়',
      ],
      followUpQuestions: [
        'What is the difference between git merge --abort and git reset --hard HEAD?',
      ],
    },
    quiz: {
      id: 'quiz-merge-conflicts',
      subjectId: 'git',
      difficulty: 'intermediate',
      question: 'In a merge conflict, what does the line "=======" represent inside the conflicted file?',
      questionBn: 'মার্জ কনফ্লিক্টের সময় আক্রান্ত ফাইলের ভেতরে "=======" লাইনটি কী নির্দেশ করে?',
      options: [
        {
          id: 'opt-a',
          text: 'An error message indicating your hard drive is full',
          textBn: 'হার্ডডিস্ক পূর্ণ হয়ে গেছে নির্দেশকারী একটি এরর',
          isCorrect: false,
        },
        {
          id: 'opt-b',
          text: 'The divider separating your current branch code from the incoming branch code',
          textBn: 'আপনার বর্তমান ব্রাঞ্চের কোড এবং অন্য ব্রাঞ্চ থেকে আসা কোডের মধ্যকার বিভাজন রেখা',
          isCorrect: true,
        },
        {
          id: 'opt-c',
          text: 'A comment line you should leave in your code forever',
          textBn: 'একটি কমেন্ট যা কোডের ভেতর আজীবন রেখে দিতে হবে',
          isCorrect: false,
        },
        {
          id: 'opt-d',
          text: 'The location where Git deleted your file',
          textBn: 'যে জায়গায় গিট আপনার ফাইলটি ডিলিট করেছে',
          isCorrect: false,
        },
      ],
      explanation: 'In conflict markers, "=======" is the divider. The text above it (under <<<<<<< HEAD) is your current branch version, and the text below it (above >>>>>>>) is the incoming version.',
      explanationBn: 'কনফ্লিক্ট মার্কারে "=======" হলো বিভাজন রেখা। এর উপরের অংশ (<<<<<<< HEAD-এর নিচে) আপনার বর্তমান ব্রাঞ্চের কোড এবং নিচের অংশ অন্য ব্রাঞ্চ থেকে আসা কোড।',
    },
  },
];
