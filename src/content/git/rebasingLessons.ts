import { CurriculumLesson } from '@/types/content';

/**
 * Module 5: Rebasing & History Rewriting Lessons
 *
 * Crafted specifically for beginners with simple, relatable examples:
 * - Demystifying Rebase vs Merge (notebook page relocation vs ribbon knot)
 * - The Golden Rule of Rebasing (never rewrite shared public history)
 * - Interactive Rebase (git rebase -i) for squashing messy WIP commits
 * - Handling rebase pauses, conflicts, and the --abort safety valve
 */
export const REBASING_LESSONS: CurriculumLesson[] = [
  {
    id: 'git.rebasing.basics',
    moduleId: 'git-rebasing',
    slug: 'rebase-fundamentals',
    order: 1,
    durationMinutes: 15,
    difficulty: 'intermediate',
    title: 'Rebase vs Merge',
    titleBn: 'রিবেস বনাম মার্জ',
    summary: 'Master the difference between rebase and merge using the building analogy, understand why commit hashes change, and learn the safe 3-step workflow.',
    summaryBn: 'ভবন ও ছাদের উপমার মাধ্যমে রিবেস ও মার্জের পার্থক্য, কমিট হ্যাশ কেন পরিবর্তিত হয় এবং ৩ ধাপের নিরাপদ রিবেস রুটিন শিখুন।',
    learningObjectives: [
      'Understand the building & rooftop analogy: why rebase literally changes the foundation (base)',
      'Demystify commit hashes and understand why rebase generates brand-new SHA IDs',
      'Master the "Where to Stand" rule: destination for merge vs. source for rebase',
      'Follow the safe 3-step daily routine used by professional software engineers',
      'Remember the Golden Rule of Git Rebase: Never rebase shared public branches',
    ],
    learningObjectivesBn: [
      'ভবন ও ছাদের উপমা: রিবেস কীভাবে আক্ষরিক অর্থেই কাজের ভিত্তি বা বেস পরিবর্তন করে তা বোঝা',
      'কমিট হ্যাশের রহস্য উন্মোচন এবং রিবেসে কেন নতুন হ্যাশ আইডি তৈরি হয় তা জানা',
      '"কোথায় দাঁড়িয়ে কমান্ড চালাবেন" নিয়ম: মার্জে গন্তব্য ব্রাঞ্চ বনাম রিবেসে উৎস ব্রাঞ্চ',
      'পেশাদার সফটওয়্যার ইঞ্জিনিয়ারদের অনুসৃত ৩ ধাপের নিরাপদ রিবেস রুটিন শেখা',
      'রিবেসের সুবর্ণ নিয়ম (Golden Rule): পাবলিক বা শেয়ার্ড ব্রাঞ্চে কখনো রিবেস না করা',
    ],
    keyTakeaways: [
      'Merge ties branches together with an extra merge commit (diamond timeline).',
      'Rebase does not move commits: it extracts their changes and replays them on top of a new base.',
      'Replayed commits receive brand-new SHA hashes because their parent commit changed (B1 ➔ B1\').',
      'The Core Mental Model: Change the parent ➔ recreate the commit ➔ get a new hash.',
      'Where to stand: Run "git merge" on the destination branch (main), but run "git rebase" on your feature branch.',
      'The Golden Rule: Only rebase your local private branch; never rewrite shared public history.',
    ],
    sections: [
      {
        id: 'sec-rebase-concept',
        title: 'The Multi-Story Building Analogy: Why is it Called Re-BASE?',
        titleBn: 'ভবন ও ছাদের উপমা: এর নাম "রি-বেস" (Re-BASE) কেন?',
        blocks: [
          {
            type: 'paragraph',
            text: 'Imagine the main branch is a multi-story building. When you branched off to start your feature, main was a 3-story building: Floor 1 [A1] ➔ Floor 2 [A2] ➔ Floor 3 [A3]. On top of Floor 3, you built two penthouse rooms: Room 1 [B1] and Room 2 [B2]. Meanwhile, your teammates continued constructing main, adding Floor 4 [A4] and Floor 5 [A5]. Now, your branch is behind main.',
            textBn: 'main ব্রাঞ্চটিকে একটি বহুতল ভবনের মতো কল্পনা করুন। আপনি যখন আপনার ফিচার ব্রাঞ্চ শুরু করেছিলেন, তখন main ছিল ৩ তলা বিশিষ্ট একটি ভবন: তলা ১ [A1] ➔ তলা ২ [A2] ➔ তলা ৩ [A3]। ৩ তলার ওপর আপনি নিজের দুটি ঘর তৈরি করলেন: ঘর ১ [B1] এবং ঘর ২ [B2]। এর মধ্যে আপনার সহকর্মীরা মূল ভবনে আরও দুটি নতুন তলা ৪ [A4] এবং ৫ [A5] তৈরি করে ফেলেছেন। অর্থাৎ আপনার ব্রাঞ্চটি এখন main থেকে পিছিয়ে আছে।',
          },
          {
            type: 'keyConcept',
            title: 'Merge vs. Rebase: Two Different Ways to Connect',
            titleBn: 'মার্জ বনাম রিবেস: সংযুক্ত করার দুটি ভিন্ন উপায়',
            text: '• The Merge Way (Building an External Bridge):\nGit keeps your rooms [B1, B2] sitting on Floor 3 [A3], and builds an external bridge (a special "Merge Commit" [M]) connecting them directly to Floor 5 [A5]. Both historical paths remain visible as a fork.\n\n• The Rebase Way (Lifting to the New Rooftop - Re-BASE):\nGit literally changes your foundation (BASE)! It identifies the changes introduced in your rooms [B1, B2] and replays them one-by-one right on top of Floor 5 [A5]. The result is a single, beautiful straight building with zero clutter!',
            textBn: '• মার্জ পদ্ধতি (বাইরে দিয়ে সেতু জোড়া দেওয়া):\nআপনার ঘরগুলোকে [B1, B2] ৩ তলাতেই [A3] রেখে গিট ৫ তলার [A5] সাথে একটি সংযোগকারী সেতু (একটি বিশেষ "মার্জ কমিট" [M]) তৈরি করে। ফলে শাখাটি বাঁকা হয়ে গিয়ে দুটো পথই দৃশ্যমান থাকে।\n\n• রিবেস পদ্ধতি (নতুন ছাদে পরিবর্তন রি-প্লে করা - Re-BASE):\nগিট আক্ষরিক অর্থেই আপনার কাজের ভিত্তি (BASE) পরিবর্তন করে! গিট আপনার ঘরগুলোর [B1, B2] পরিবর্তনগুলোকে তুলে নিয়ে সোজা ৫ তলার [A5] নতুন ছাদের ওপর একে একে পুনরায় প্রয়োগ করে। এর ফলে কোনো অপ্রয়োজনীয় সেতু ছাড়া পুরো ভবনটি একটি সোজা সরলরেখায় পরিণত হয়!',
          },
          {
            type: 'rebaseAnimation',
            title: 'Interactive Rebase Visualizer: The Replay & New Parent Model',
            titleBn: 'ইন্টারেক্টিভ রিবেস অ্যানিমেশন: পরিবর্তন রি-প্লে ও নতুন প্যারেন্ট মডেল',
          },
        ],
      },
      {
        id: 'sec-commit-hashes',
        title: 'Parents, Replays, and Hashes: Why Rebase Recreates Commits',
        titleBn: 'প্যারেন্ট, রি-প্লে এবং হ্যাশ: রিবেসে কেন নতুন কমিট তৈরি হয়',
        blocks: [
          {
            type: 'paragraph',
            text: 'To truly understand Git, you need to understand how commits link together: **commits form an ancestry chain where every commit points backward to its Parent**.',
            textBn: 'গিটকে গভীরভাবে বুঝতে হলে কমিটের পারস্পরিক সংযোগ বোঝা জরুরি: **প্রতিটি কমিট একটি বংশলতিকার মতো কাজ করে, যেখানে চাইল্ড কমিট তার পেছনের প্যারেন্ট (Parent) কমিটের দিকে নির্দেশ করে**।',
          },
          {
            type: 'keyConcept',
            title: 'The Parent-Child Architecture in Git',
            titleBn: 'গিটে প্যারেন্ট-চাইল্ড কাঠামোর নিয়ম',
            text: '• Regular Commits have 1 Parent: A standard commit simply remembers the single commit directly preceding it.\n• Merge Commits have 2 Parents: A merge commit ties two branches together, so it points backward to two parents (one on each branch)!\n• Commits look backward, not forward: A commit never knows who its future children will be; it only stores a pointer to its parent.',
            textBn: '• সাধারণ কমিটের থাকে ১টি প্যারেন্ট: প্রতিটি সাধারণ কমিট তার ঠিক আগের একক কমিটটিকে চিনে রাখে।\n• মার্জ কমিটের থাকে ২টি প্যারেন্ট: মার্জ কমিট যেহেতু দুটি ভিন্ন শাখাকে জোড়া দেয়, তাই এর দুজন প্যারেন্ট থাকে (উভয় ব্রাঞ্চের সর্বশেষ মাথা)!\n• কমিট সবসময় পেছনে তাকায়: কোনো কমিটই জানে না ভবিষ্যতে তার ওপর কে চাইল্ড হয়ে আসবে; সে কেবল মনে রাখে: "আমার আগের প্যারেন্ট কে?"।',
          },
          {
            type: 'keyConcept',
            title: 'How Git Calculates a Hash (The Digital DNA)',
            titleBn: 'গিট কীভাবে হ্যাশ গণনা করে (কমিটের ডিজিটাল ডিএনএ)',
            text: 'Git generates a unique cryptographic ID (Commit Hash, e.g. "a1b2c3d...") for every commit using a mathematical formula based on 3 things:\n1. The Author, Timestamp, and Commit Message\n2. The exact code changes (diff)\n3. The exact Hash of its PARENT commit!\n\nBecause the parent\'s identity is baked directly into the formula, if you change who the parent commit is, the Hash MUST change!',
            textBn: 'গিট মূলত ৩টি তথ্যের ওপর ভিত্তি করে গাণিতিক ফর্মুলায় প্রতিটি কমিটের অনন্য ডিজিটাল হ্যাশ (যেমন "a1b2c3d...") গণনা করে:\n১. লেখক, তারিখ এবং কমিট মেসেজ\n২. কোডে যে পরিবর্তনগুলো (Diff) করা হয়েছে\n৩. এই কমিটের ঠিক আগের প্যারেন্ট (Parent) কমিটের হ্যাশ আইডি!\n\nযেহেতু প্যারেন্টের হ্যাশ সরাসরি এই ফর্মুলার মধ্যে অন্তর্ভুক্ত থাকে, তাই প্যারেন্ট বদলে দিলে গিট সম্পূর্ণ নতুন একটি হ্যাশ আইডি তৈরি করতে বাধ্য হয়!',
          },
          {
            type: 'callout',
            variant: 'note',
            title: 'Tracing the Replay: Why Commits B1 & B2 Become B1\' & B2\'',
            titleBn: 'রি-প্লে ট্র্যাকিং: কেন B1 ও B2 পরিবর্তিত হয়ে B1\' ও B2\' হয়',
            text: 'Here is the exact step-by-step process of what Git does during "git rebase main":\n\n1. Before Rebase:\n   • main: [A1] ➔ [A2] ➔ [A3] ➔ [A4] ➔ [A5]\n   • your feature: [B1] (Parent: A3) ➔ [B2] (Parent: B1)\n\n2. When you run "git rebase main":\n   Git does NOT literally move the old B1 and B2 objects. Instead:\n   • Step A: Git takes the changes introduced by B1 and applies them on top of A5 ➔ creates brand-new commit [B1\'] with Parent A5!\n   • Step B: Git takes the changes introduced by B2 and applies them on top of B1\' ➔ creates brand-new commit [B2\'] with Parent B1\'!\n\n3. The Result:\n   • [A5] ➔ [B1\'] ➔ [B2\']\n   Even though B1\' and B2\' introduce the same code changes, their parent ancestry was rewritten, so Git generates brand-new commit hashes (e.g. B1 had hash 4f2a18c, but B1\' gets hash 9e7d32b).',
            textBn: '"git rebase main" চালানোর সময় গিট ভেতরে ভেতরে কী করে তা লক্ষ্য করুন:\n\n১. রিবেসের আগে:\n   • main ব্রাঞ্চ: [A1] ➔ [A2] ➔ [A3] ➔ [A4] ➔ [A5]\n   • আপনার ফিচার ব্রাঞ্চ: [B1] (প্যারেন্ট: A3) ➔ [B2] (প্যারেন্ট: B1)\n\n২. যখন আপনি "git rebase main" চালাবেন:\n   গিট পুরোনো B1 এবং B2 অবজেক্টকে আক্ষরিক অর্থে টেনে নিয়ে যায় না। বরং:\n   • ধাপ ক: গিট B1-এর কোড পরিবর্তনগুলো নিয়ে A5-এর ওপর প্রয়োগ করে ➔ নতুন কমিট [B1\'] তৈরি করে যার প্যারেন্ট এখন A5!\n   • ধাপ খ: এরপর B2-এর কোড পরিবর্তনগুলো নিয়ে B1\'-এর ওপর প্রয়োগ করে ➔ নতুন কমিট [B2\'] তৈরি করে যার প্যারেন্ট এখন B1\'!\n\n৩. ফলাফল:\n   • [A5] ➔ [B1\'] ➔ [B2\']\n   যদিও B1\' এবং B2\'-তে একই পরিবর্তন রয়েছে, কিন্তু তাদের প্যারেন্ট পরিবর্তিত হওয়ার কারণে গিট তাদের সম্পূর্ণ নতুন হ্যাশ আইডি দেয় (যেমন B1-এর হ্যাশ যদি হতো 4f2a18c, B1\'-এর নতুন হ্যাশ হবে 9e7d32b)।',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The Core Mental Model of Git Rebase',
            titleBn: 'গিট রিবেসের মূল চিন্তাভাবনা (Core Mental Model)',
            text: '• Rebase does NOT move existing commits. It recreates them on a new base.\n• The Golden Formula: Change the parent ➔ recreate the commit ➔ get a new hash.\n• Why this matters for conflicts: Because Git replays your changes commit-by-commit, you resolve conflicts incrementally at each step (first B1\', then B2\')!',
            textBn: '• রিবেস পুরোনো কমিটকে টেনে সরায় না; এটি নতুন বেসের ওপর তাদের পুনরায় তৈরি করে।\n• সুবর্ণ সূত্র: প্যারেন্ট পরিবর্তন ➔ কমিট পুনর্নির্মাণ ➔ নতুন হ্যাশ লাভ।\n• কনফ্লিক্ট বোঝার ক্ষেত্রে এর গুরুত্ব: যেহেতু গিট একটি একটি করে কমিটের পরিবর্তন রি-প্লে করে, তাই কনফ্লিক্ট দেখা দিলেও ধাপে ধাপে (প্রথমে B1\', তারপর B2\') প্রতিটি কমিটে তা সহজে সমাধান করা যায়!',
          },
        ],
      },
      {
        id: 'sec-where-to-stand',
        title: 'Where to Stand: The Golden Command Rule',
        titleBn: 'কোথায় দাঁড়িয়ে কমান্ড চালাবেন: মার্জ বনাম রিবেসের সুবর্ণ নিয়ম',
        blocks: [
          {
            type: 'paragraph',
            text: 'A common question for Git learners is: "Which branch do I switch to before running merge or rebase?" Here is the universal rule:',
            textBn: 'গিট শেখার সময় অনেকেরই প্রশ্ন থাকে: "মার্জ বা রিবেস চালানোর আগে আমি ঠিক কোন ব্রাঞ্চে সুইচ করব?" নিচে সহজ ও স্পষ্ট নিয়মটি দেওয়া হলো:',
          },
          {
            type: 'keyConcept',
            title: 'The Rule of Location',
            titleBn: 'অবস্থানের নিয়ম',
            text: '• For MERGE: Stand on the DESTINATION branch (where you want code to arrive).\n  Example: To pull feature into main ➔ git switch main && git merge my-feature\n\n• For REBASE: Stand on the SOURCE branch (the one you want to move).\n  Example: To lift your feature onto main\'s newest roof ➔ git switch my-feature && git rebase main',
            textBn: '• মার্জ (Merge) করার নিয়ম: গন্তব্য (Destination) ব্রাঞ্চে দাঁড়ান (যেখানে কোড আনতে চান)।\n  উদাহরণ: ফিচার ব্রাঞ্চের কোড main-এ একীভূত করতে চাইলে ➔ git switch main && git merge my-feature\n\n• রিবেস (Rebase) করার নিয়ম: আপনার উৎস (Source) ব্রাঞ্চে দাঁড়ান (যাকে সরাতে চান)।\n  উদাহরণ: আপনার ফিচার ব্রাঞ্চকে main-এর নতুন মাথায় তুলতে চাইলে ➔ git switch my-feature && git rebase main',
          },
        ],
      },
      {
        id: 'sec-rebase-walkthrough',
        title: 'The Safe 3-Step Routine Used by Professionals',
        titleBn: 'পেশাদার ডেভেলপারদের ৩ ধাপের নিরাপদ রিবেস রুটিন',
        blocks: [
          {
            type: 'paragraph',
            text: 'Before opening a Pull Request or pushing your code, professional software developers run this exact 3-step routine to ensure their branch is fresh, conflict-free, and linear:',
            textBn: 'প্রতিদিনের সফটওয়্যার ডেভেলপমেন্টে কোনো পিআর (Pull Request) খোলার আগে বা কোড পুশ করার আগে ডেভেলপাররা এই ৩টি ধাপ হুবহু অনুসরণ করেন:',
          },
          {
            type: 'command',
            command: 'git switch main && git pull origin main',
            description: 'Step 1: Switch to main and download the freshest building floors from your team.',
            descriptionBn: 'ধাপ ১: main ব্রাঞ্চে যান এবং টিমের সবার করা সর্বশেষ আপডেট লোকাল মেশিনে নামিয়ে নিন।',
          },
          {
            type: 'command',
            command: 'git switch feature-login',
            description: 'Step 2: Switch back onto your own private feature branch.',
            descriptionBn: 'ধাপ ২: আবার আপনার নিজের ফিচার ব্রাঞ্চে ফিরে আসুন (যেখানে আপনার কাজ রয়েছে)।',
          },
          {
            type: 'command',
            command: 'git rebase main',
            description: 'Step 3: Rebase your feature branch atop main. Git replays your commits right on the newest rooftop!',
            descriptionBn: 'ধাপ ৩: main-এর ওপর আপনার ফিচার ব্রাঞ্চটি রিবেস করুন। গিট আপনার কমিটগুলোকে নতুন আপডেটের শীর্ষে সাজিয়ে দেবে!',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'What if you encounter a conflict during rebase?',
            titleBn: 'রিবেস চলাকালে কনফ্লিক্ট দেখা দিলে কী করবেন?',
            text: 'Do not panic! Git pauses at the conflicting commit.\n1. Open the conflicting file and fix the code.\n2. Stage the resolved file: git add <file>\n3. Tell Git to continue: git rebase --continue\n\nEmergency Exit: If you ever feel overwhelmed or make a mistake, run "git rebase --abort" to instantly return to your exact starting state without losing anything!',
            textBn: 'ঘাবড়ানোর কিছু নেই! গিট কনফ্লিক্ট হওয়া নির্দিষ্ট কমিটে সাময়িকভাবে থেমে যায়।\n১. ফাইলটি খুলে সমাধান করুন।\n২. সমাধান করা ফাইল স্টেজ করুন: git add <file>\n৩. গিটকে সামনে এগোতে বলুন: git rebase --continue\n\nজরুরি পরিত্রাণ: যদি কোনো কারণে আটকে যান বা জটিল মনে হয়, তবে "git rebase --abort" কমান্ডটি চালালেই কোনো ক্ষতি ছাড়াই নিমিষে আগের অক্ষত অবস্থায় ফিরে যাবেন!',
          },
        ],
      },
      {
        id: 'sec-comparison-matrix',
        title: 'Summary: When to Merge vs. When to Rebase',
        titleBn: 'সারসংক্ষেপ: কখন মার্জ করবেন আর কখন রিবেস করবেন',
        blocks: [
          {
            type: 'paragraph',
            text: 'Both tools are indispensable—engineering teams leverage both depending on the context:',
            textBn: 'দুটি কমান্ডই অত্যন্ত দরকারি এবং টিমগুলো কাজের প্রেক্ষাপট অনুযায়ী দুটোই ব্যবহার করে:',
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Use Rebase locally: When working on your private feature branch to pull in latest main updates and keep your history clean and straight.',
              'Use Merge for PRs / main integrations: When merging a completed feature branch into main, preserving the pull request history and team chronology.',
              'Rebase creates clean history: No noisy "Merge branch main into feature" commits cluttering your commit log.',
              'Merge preserves true chronology: Reflects the exact historical order of when branches were created and merged.',
            ],
            itemsBn: [
              'লোকাল ব্রাঞ্চে রিবেস ব্যবহার করুন: আপনার ফিচার ব্রাঞ্চে কাজ করার সময় মেইনের নতুন আপডেট নিজের ব্রাঞ্চে টেনে এনে হিস্টোরি সোজা রাখতে।',
              'পিআর / মূল শাখায় মার্জ ব্যবহার করুন: যখন সম্পন্ন হওয়া একটি ফিচার মূল শাখায় একীভূত করা হয়।',
              'রিবেস পরিচ্ছন্ন ইতিহাস দেয়: "Merge branch main into feature" জাতীয় অপ্রয়োজনীয় কমিটে হিস্টোরি ভরে যায় না।',
              'মার্জ বাস্তব সময়ের ঘটনা ধরে রাখে: কে কখন কোন ব্রাঞ্চে কাজ করেছিল তার হুবহু রেকর্ড থাকে।',
            ],
          },
        ],
      },
      {
        id: 'sec-golden-rule',
        title: 'The Golden Rule of Rebasing',
        titleBn: 'রিবেসের সুবর্ণ নিয়ম (The Golden Rule)',
        blocks: [
          {
            type: 'callout',
            variant: 'danger',
            title: 'Never Rebase a Public / Shared Branch!',
            titleBn: 'অন্যদের সাথে শেয়ার করা পাবলিক ব্রাঞ্চে কখনোই রিবেস চালাবেন না!',
            text: 'Golden Rule: NEVER rebase commits that have already been pushed to a public or shared branch (like main or a team-shared staging branch).\n\nWhy? Because rebase creates BRAND-NEW commit hashes (e.g., Commit [B1] is recreated as [B1\'] with a new hash). If a teammate has already based their work on the original commit [B1], rebasing replaces that commit with a different hash. When they pull, Git will become confused and create duplicate commits and painful conflicts for everyone!',
            textBn: 'গোল্ডেন রুল: রিমোট রিপোজিটরির কোনো পাবলিক বা শেয়ার্ড ব্রাঞ্চে (যেমন main বা টিমের সবার ব্রাঞ্চ) পুশ করার পর কখনো রিবেস করবেন না।\n\nকেন? কারণ রিবেস সম্পূর্ণ নতুন কমিট হ্যাশ তৈরি করে (যেমন: কমিট [B1] নতুন হ্যাশসহ [B1\'] হিসেবে পুনর্নির্মিত হয়)। আপনার সহকর্মীরা যদি মূল কমিট [B1]-এর ওপর ভিত্তি করে কাজ শুরু করে থাকেন, আপনার রিবেস সেই আইডিকে পরিবর্তন করে দেবে। ফলে তারা যখন পুল করবে, গিট বিভ্রান্ত হয়ে ডুপ্লিকেট কমিট সৃষ্টি করবে এবং সবার জন্য বড় ধরনের ঝামেলা তৈরি করবে!',
          },
          {
            type: 'paragraph',
            text: 'Rule of Thumb: Rebase your own private local feature branch all you want before opening a Pull Request. Once code is merged into main and shared with the world, treat history as permanent and sacred.',
            textBn: 'সহজ সূত্র: আপনার ব্যক্তিগত লোকাল ফিচার ব্রাঞ্চে পিআর ওপেন করার আগে আপনি যত ইচ্ছা রিবেস করতে পারেন। কিন্তু কোড একবার main-এ চলে গেলে এবং অন্যরা তা নামিয়ে নিলে সেই হিস্টোরিকে অপরিবর্তনীয় ও স্থায়ী হিসেবে গণ্য করুন।',
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-rebase-vs-merge',
      subjectId: 'git',
      question: 'Why would a developer prefer "git rebase" over "git merge", and what is the Golden Rule of Rebasing?',
      questionBn: 'একজন ডেভেলপার "git merge"-এর পরিবর্তে কেন "git rebase" পছন্দ করতে পারেন, এবং রিবেসের সুবর্ণ নিয়মটি কী?',
      answer: 'Developers prefer "git rebase" because it eliminates unnecessary merge commits (like "Merge branch \'main\' into feature") and creates a linear, single-line commit history that is easy to read, bisect, and review. The Golden Rule of Rebasing is to NEVER rebase commits that have already been pushed to a shared public branch, because rebase rewrites commit hashes and will corrupt your teammates\' commit histories.',
      answerBn: 'ডেভেলপাররা "git rebase" পছন্দ করেন কারণ এটি অপ্রয়োজনীয় মার্জ কমিট তৈরি হওয়া রোধ করে এবং একটি পরিচ্ছন্ন, লিনিয়ার ইতিহাস উপহার দেয় যা সহজে রিড, বাইসেক্ট এবং রিভিউ করা যায়। রিবেসের সুবর্ণ নিয়ম হলো: অন্যদের সাথে শেয়ার করা কোনো পাবলিক ব্রাঞ্চে কখনো রিবেস চালানো যাবে না, কারণ রিবেস কমিট হ্যাশ পরিবর্তন করে সহকর্মীদের কাজের ইতিহাসকে বিশৃঙ্খল করে ফেলে।',
      category: 'Architecture',
      difficulty: 'intermediate',
      keyPoints: [
        'Rebase produces linear history with zero diamond forks or clutter merge commits',
        'Rebase rewinds, moves base to target tip, and replays commits with new hashes',
        'Golden Rule: Never rebase commits pushed to shared public branches',
        'Safe usage: Rebase your private local feature branch before opening a PR',
      ],
      keyPointsBn: [
        'রিবেস লিনিয়ার ইতিহাস দেয় এবং অপ্রয়োজনীয় মার্জ কমিট তৈরি হতে দেয় না',
        'রিবেস পুরোনো বেসে ফিরে গিয়ে নতুন মাথায় নতুন হ্যাশসহ কমিট রি-প্লে করে',
        'গোল্ডেন রুল: পাবলিক বা শেয়ার্ড ব্রাঞ্চে পুশ করা কমিটে কখনো রিবেস নয়',
        'নিরাপদ ব্যবহার: পিআর খোলার আগে নিজের প্রাইভেট লোকাল ব্রাঞ্চে রিবেস করা',
      ],
      followUpQuestions: [
        'What is the difference between git pull and git pull --rebase?',
        'If you encounter a conflict during git rebase, what command moves to the next commit after resolving?',
      ],
    },
    quiz: {
      id: 'quiz-rebase-basics-1',
      subjectId: 'git',
      difficulty: 'intermediate',
      question: 'What happens to the commit hashes of your feature branch when you run "git rebase main"?',
      questionBn: '"git rebase main" কমান্ডটি চালালে আপনার ফিচার ব্রাঞ্চের কমিট হ্যাশগুলোর কী ঘটে?',
      options: [
        { id: 'opt-1', text: 'The hashes stay exactly identical', textBn: 'হ্যাশগুলো একদম অপরিবর্তিত থাকে', isCorrect: false },
        { id: 'opt-2', text: 'Git generates brand-new commit hashes because their parent commits changed', textBn: 'যেহেতু প্যারেন্ট পরিবর্তিত হয়েছে, গিট ব্র্যান্ড-নিউ কমিট হ্যাশ তৈরি করে', isCorrect: true },
        { id: 'opt-3', text: 'The commits are deleted without replacement', textBn: 'কমিটগুলো কোনো বিকল্প ছাড়াই মুছে ফেলা হয়', isCorrect: false },
        { id: 'opt-4', text: 'Git converts all commits into untracked files', textBn: 'গিট সব কমিটকে আনট্র্যাকড ফাইলে রূপান্তর করে', isCorrect: false },
      ],
      explanation: 'Because a commit\'s SHA-1 hash is computed using its parent\'s hash, moving the commits onto a new base fundamentally changes their parentage. Therefore, Git creates brand-new commit objects with new hashes.',
      explanationBn: 'যেহেতু প্রতিটি কমিটের SHA-1 হ্যাশ তার প্যারেন্ট কমিটের ওপর নির্ভর করে গণনা করা হয়, তাই নতুন বেসের ওপর বসানোর ফলে প্যারেন্ট পরিবর্তিত হয়ে নতুন হ্যাশ তৈরি হয়।',
    },
  },
  {
    id: 'git.rebasing.interactive',
    moduleId: 'git-rebasing',
    slug: 'interactive-rebase',
    order: 2,
    durationMinutes: 20,
    difficulty: 'intermediate',
    title: 'Interactive Rebase (git rebase -i)',
    titleBn: 'ইন্টারেক্টিভ রিবেস (git rebase -i)',
    summary: 'Squash messy commits, edit messages, reorder commits, and drop dead code before opening a Pull Request.',
    summaryBn: 'একাধিক অপ্রয়োজনীয় কমিট একত্র (Squash) করা ও পিআর ওপেনের আগে হিস্টোরি পরিচ্ছন্ন রাখা।',
    learningObjectives: [
      'Understand the purpose of interactive rebase: crafting clean, professional commits',
      'Learn the primary rebase verbs: pick, squash, fixup, reword, and drop',
      'Distinguish between squash (combines and keeps message) and fixup (combines and discards message)',
      'Safely navigate rebase conflicts using --continue and --abort',
    ],
    learningObjectivesBn: [
      'ইন্টারেক্টিভ রিবেসের উদ্দেশ্য বোঝা: পরিচ্ছন্ন ও পেশাদার কমিট তৈরি করা',
      'রিবেসের মূল ভার্বগুলো জানা: pick, squash, fixup, reword ও drop',
      'squash (মেসেজসহ জোড়া দেওয়া) এবং fixup (মেসেজ ছাড়া জোড়া দেওয়া)-এর পার্থক্য বোঝা',
      '--continue এবং --abort ব্যবহার করে নিরাপদে রিবেস কনফ্লিক্ট সামলানো',
    ],
    keyTakeaways: [
      'Interactive rebase is your local pre-PR tidy-up tool.',
      '"pick" keeps a commit; "squash" melts into previous and combines messages; "fixup" melts and discards the message.',
      'The interactive todo list executes from top to bottom (oldest to newest).',
      'If anything goes wrong or gets confusing, "git rebase --abort" restores your exact original state.',
    ],
    sections: [
      {
        id: 'sec-why-interactive',
        title: 'The Real-World Problem: Messy Commit Histories',
        titleBn: 'বাস্তব সমস্যা: অগোছালো কমিট হিস্টোরি',
        blocks: [
          {
            type: 'paragraph',
            text: 'While coding, it is natural to make quick, messy commits: "wip", "fix typo in button", "forgot to import css", "testing something". Making frequent commits is great while developing, but pushing 8 messy commits to your team\'s Pull Request makes code review difficult.',
            textBn: 'কোডিং করার সময় প্রায়ই ছোট ছোট অগোছালো কমিট হয়ে থাকে: "wip", "fix typo", "forgot to import css", ইত্যাদি। কাজ করার সময়ে ঘন ঘন কমিট করা ভালো অভ্যাস হলেও পিআরে (Pull Request) এমন ৮-১০টি খসড়া কমিট পাঠালে কোড রিভিউ করা অন্যদের জন্য কঠিন হয়ে পড়ে।',
          },
          {
            type: 'keyConcept',
            title: 'The Solution: git rebase -i',
            titleBn: 'সমাধান: git rebase -i (ইন্টারেক্টিভ রিবেস)',
            text: 'Interactive Rebase allows you to rewrite your last N local commits before sharing them with the team.\n\nCommand syntax:\ngit rebase -i HEAD~3\n(This opens an interactive editor containing your last 3 commits).',
            textBn: 'ইন্টারেক্টিভ রিবেস আপনাকে অন্যদের সাথে কোড শেয়ার করার আগেই লোকাল শেষ N-সংখ্যক কমিট সাজিয়ে নেওয়ার সুযোগ দেয়।\n\nকমান্ড সিনট্যাক্স:\ngit rebase -i HEAD~3\n(এটি আপনার শেষ ৩টি কমিট নিয়ে একটি ইন্টারেক্টিভ এডিটর খুলে দেবে)।',
          },
        ],
      },
      {
        id: 'sec-verbs-guide',
        title: 'The 5 Core Verbs You Need to Know',
        titleBn: '৫টি মূল ভার্ব যা আপনার জানা প্রয়োজন',
        blocks: [
          {
            type: 'paragraph',
            text: 'When Git opens the todo file, each line starts with a verb telling Git what to do with that commit:',
            textBn: 'গিট যখন টু-ডু ফাইলটি খোলে, প্রতিটি লাইনের শুরুতে একটি করে অ্যাকশন শব্দ (Verb) থাকে যা গিটকে বলে ওই কমিটের সাথে কী করতে হবে:',
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'pick (p): Keep the commit as is (the default).',
              'reword (r): Keep the commit contents, but pause so you can rewrite the commit message.',
              'squash (s): Melt this commit into the one directly above it, and combine both commit messages.',
              'fixup (f): Melt this commit into the one directly above it, and silently discard this commit\'s message (ideal for typo fixes!).',
              'drop (d): Completely delete this commit and its changes from history.',
            ],
            itemsBn: [
              'pick (p): কমিটটি যেমন আছে তেমনই বহাল রাখা (ডিফল্ট)।',
              'reword (r): কমিটের কোড ঠিক রেখে শুধু কমিট মেসেজটি নতুন করে লেখা।',
              'squash (s): এই কমিটটিকে তার ঠিক আগের কমিটের সাথে জুড়ে দেওয়া এবং উভয় মেসেজ একত্র করা।',
              'fixup (f): এই কমিটটিকে আগের কমিটের সাথে জুড়ে দেওয়া এবং এর অপ্রয়োজনীয় টাইপো মেসেজটি ফেলে দেওয়া (সবচেয়ে জনপ্রিয়!)।',
              'drop (d): পুরো কমিট এবং এর পরিবর্তনগুলোকে হিস্টোরি থেকে সম্পূর্ণরূপে মুছে ফেলা।',
            ],
          },
        ],
      },
      {
        id: 'sec-rebase-simulator',
        title: 'Interactive Rebase Sandbox: Try It Yourself!',
        titleBn: 'ইন্টারেক্টিভ রিবেস স্যান্ডবক্স: নিজে নিজে অনুশীলন করুন!',
        blocks: [
          {
            type: 'paragraph',
            text: 'In this hands-on simulator, you have 3 commits on your local branch. Notice how selecting "fixup" merges the minor typo fixes into your base feature commit:',
            textBn: 'নিচের সিমুলেটরে আপনার লোকাল ব্রাঞ্চে ৩টি কমিট রয়েছে। "fixup" নির্বাচন করে ছোটখাটো টাইপো ফিক্সগুলোকে মূল ফিচার কমিটের সাথে একীভূত করে দেখুন:',
          },
          {
            type: 'interactiveRebaseSimulator',
            title: 'Interactive Rebase Sandbox',
            titleBn: 'ইন্টারেক্টিভ রিবেস স্যান্ডবক্স',
          },
        ],
      },
      {
        id: 'sec-rebase-conflicts',
        title: 'Handling Conflicts & The Safe Escape Hatch',
        titleBn: 'কনফ্লিক্ট সমাধান ও নিরাপদ প্রস্থানের পথ',
        blocks: [
          {
            type: 'paragraph',
            text: 'Just like merging, if two replayed commits touched the exact same line, Git will pause the rebase and notify you.',
            textBn: 'মার্জিংয়ের মতো রিবেসের সময়ও যদি একই লাইনে দুটি আলাদা কোড অ্যাপ্লাই হতে যায়, গিট সাময়িকভাবে থেমে যাবে এবং আপনাকে জানাবে।',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'The 3 Rebase Navigation Commands',
            titleBn: 'রিবেস চলাকালীন ৩টি জরুরি কমান্ড',
            text: '1. Fixed the conflict? Stage and continue:\n   git add <file>\n   git rebase --continue\n\n2. Want to skip this specific commit?\n   git rebase --skip\n\n3. Feeling overwhelmed? The Panic Button:\n   git rebase --abort\n   (Instantly cancels everything and returns your branch to the exact state before you typed git rebase!)',
            textBn: '১. কনফ্লিক্ট সমাধান শেষ হলে স্টেজ করে এগিয়ে যান:\n   git add <file>\n   git rebase --continue\n\n২. এই নির্দিষ্ট কমিটটি বাদ দিতে চান?\n   git rebase --skip\n\n৩. কোনো সংশয় তৈরি হলে? প্যানিক বাটন:\n   git rebase --abort\n   (মুহূর্তেই পুরো রিবেস বাতিল করে ব্রাঞ্চটিকে রিবেস শুরুর পূর্বের অবিকল অবস্থায় ফিরিয়ে আনবে!)',
          },
        ],
      },
    ],
    interviewQuestion: {
      id: 'iq-squash-vs-fixup',
      subjectId: 'git',
      question: 'What is the exact difference between "squash" and "fixup" in an interactive rebase (git rebase -i)?',
      questionBn: 'ইন্টারেক্টিভ রিবেসে (git rebase -i) "squash" এবং "fixup"-এর মধ্যে মূল পার্থক্য কী?',
      answer: 'Both "squash" and "fixup" combine the commit\'s code changes into the commit directly above it. The difference is how they handle the commit message: "squash" prompts you to concatenate and edit the commit messages together, whereas "fixup" silently discards the current commit\'s message, keeping only the previous commit\'s message. "fixup" is preferred when cleaning up minor typos or micro-fixes.',
      answerBn: '"squash" এবং "fixup" উভয়ই বর্তমান কমিটের কোড পরিবর্তনগুলোকে তার ঠিক আগের কমিটের সাথে একীভূত করে। তাদের পার্থক্য হলো কমিট মেসেজ ব্যবহারে: "squash" উভয় কমিটের মেসেজকে জোড়া দিয়ে আপনাকে এডিট করার সুযোগ দেয়, আর "fixup" বর্তমান কমিটের মেসেজটি ফেলে দিয়ে কেবল আগের মূল মেসেজটি অক্ষত রাখে। ছোটখাটো টাইপো বা বাগফিক্স পরিষ্কার করার জন্য "fixup" সবচেয়ে উপযুক্ত।',
      category: 'Workflow',
      difficulty: 'intermediate',
      keyPoints: [
        'Both verbs combine commit changes into the immediate predecessor commit',
        '"squash" prompts to combine both commit messages in your editor',
        '"fixup" discards the commit message silently, preserving only the parent message',
        'Use fixup for minor typo corrections, formatting tweaks, and test adjustments',
      ],
      keyPointsBn: [
        'উভয় ভার্বই কোড পরিবর্তনগুলোকে সরাসরি আগের কমিটের সাথে একীভূত করে',
        '"squash" উভয় কমিটের মেসেজ একত্র করে এডিট করার সুবিধা দেয়',
        '"fixup" মেসেজটি বাতিল করে কেবল আগের মেসেজটি রেখে দেয়',
        'টাইপো বা ছোটখাটো ফরম্যাটিং পরিবর্তনের জন্য fixup আদর্শ',
      ],
      followUpQuestions: [
        'How can you abort an interactive rebase if a conflict cannot be solved?',
        'Can the first commit in an interactive rebase todo list be marked as squash or fixup?',
      ],
    },
    quiz: {
      id: 'quiz-rebase-interactive-1',
      subjectId: 'git',
      difficulty: 'intermediate',
      question: 'Which interactive rebase command combines a commit with the previous one while discarding its commit message?',
      questionBn: 'কোন ইন্টারেক্টিভ রিবেস কমান্ডটি একটি কমিটকে তার আগেরটির সাথে যুক্ত করে কিন্তু এর মেসেজটি বাতিল করে?',
      options: [
        { id: 'opt-1', text: 'reword', textBn: 'reword', isCorrect: false },
        { id: 'opt-2', text: 'squash', textBn: 'squash', isCorrect: false },
        { id: 'opt-3', text: 'fixup', textBn: 'fixup', isCorrect: true },
        { id: 'opt-4', text: 'drop', textBn: 'drop', isCorrect: false },
      ],
      explanation: '"fixup" combines the changes into the previous commit and silently discards the current commit message. "squash" also combines changes, but asks you to combine the commit messages.',
      explanationBn: '"fixup" পরিবর্তনগুলোকে আগের কমিটের সাথে যুক্ত করে এবং বর্তমানের মেসেজটি বাদ দেয়। "squash" পরিবর্তন যুক্ত করলেও মেসেজ এডিট করতে বলে।',
    },
  },
];
