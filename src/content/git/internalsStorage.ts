import { CurriculumLesson } from '@/types/content';

/**
 * Module 5 — Storage & Maintenance (git-internals-storage)
 * Object database, loose objects, packfiles, gc, unreachable objects.
 */
export const INTERNALS_STORAGE_LESSONS: CurriculumLesson[] = [
  {
    id: 'git.internals.object-database',
    moduleId: 'git-internals-storage',
    slug: 'object-database',
    order: 1,
    durationMinutes: 10,
    difficulty: 'advanced',
    title: 'Object Database',
    titleBn: 'অবজেক্ট ডাটাবেস',
    summary: '.git/objects as Git’s storage: what lives there, how objects are found, and what else lives beside them.',
    summaryBn: 'গিটের স্টোরেজ হিসেবে .git/objects: সেখানে কী থাকে, অবজেক্ট কীভাবে পাওয়া যায়, পাশে আর কী থাকে।',
    learningObjectives: [
      'Map .git/objects, refs, HEAD, and index to their roles',
      'Explain hash-based lookup conceptually',
      'Distinguish the database from the working tree completely',
    ],
    learningObjectivesBn: [
      '.git/objects, refs, HEAD ও ইনডেক্সকে ভূমিকায় ম্যাপ করা',
      'ধারণাগতভাবে হ্যাশ-ভিত্তিক লুকআপ ব্যাখ্যা করা',
      'ডাটাবেসকে ওয়ার্কিং ট্রি থেকে সম্পূর্ণ আলাদা করা',
    ],
    keyTakeaways: [
      '.git/objects holds every blob, tree, commit, and tag by content hash.',
      '.git/refs, HEAD, index, and logs are the pointers and staging around it.',
      'Cloning copies this database; checking out materializes from it.',
    ],
    sections: [
      {
        id: 'sec-db',
        title: 'What .git Contains',
        titleBn: '.git-এ কী আছে',
        blocks: [
          {
            type: 'code',
            code: '.git/\n├── objects/   (the database: blobs, trees, commits, tags)\n├── refs/      (branches and tags: names → hashes)\n├── HEAD       (where you are)\n├── index      (proposed next commit)\n└── logs/      (reflog journals)',
            language: 'text',
          },
          {
            type: 'paragraph',
            text: 'Think of .git as two halves: objects/ is the immutable content store, and everything else is mutable pointers and staging. No lesson in recovery, branching, or remotes makes sense until this split is clear — operations either write new objects (safe, additive) or move pointers (fast, sometimes destructive).',
            textBn: '.git-কে দুই অর্ধেক ভাবুন: objects/ অপরিবর্তনীয় কন্টেন্ট স্টোর, বাকি সব পরিবর্তনশীল পয়েন্টার ও স্টেজিং। এই বিভাজন স্পষ্ট না হওয়া পর্যন্ত রিকভারি, ব্রাঞ্চিং বা রিমোটের কোনো পাঠ অর্থপূর্ণ হয় না — অপারেশন হয় নতুন অবজেক্ট লেখে (নিরাপদ, সংযোজনমূলক) নয়তো পয়েন্টার সরায় (দ্রুত, কখনো ধ্বংসাত্মক)।',
          },
          {
            type: 'callout',
            variant: 'note',
            title: 'Conceptual tour only',
            titleBn: 'শুধু ধারণাগত সফর',
            text: 'You never need to open .git by hand. This map exists so commands stop feeling magical — every behavior traces to objects plus pointers.',
            textBn: 'হাতে .git খোলার দরকার নেই। এই মানচিত্র যাতে কমান্ড জাদুকরী না লাগে — প্রতিটি আচরণ অবজেক্ট সাথে পয়েন্টারে ফেরে।',
          },
        ],
      },
    ],
    relatedCommands: ['git.status', 'git.log'],
    relatedLessons: ['git.fundamentals.what-is-git', 'git.fundamentals.local-repository'],
  },
  {
    id: 'git.internals.loose-objects',
    moduleId: 'git-internals-storage',
    slug: 'loose-objects',
    order: 2,
    durationMinutes: 8,
    difficulty: 'advanced',
    title: 'Loose Objects',
    titleBn: 'লুজ অবজেক্ট',
    summary: 'Fresh objects start life as individual compressed files. Fast to write, wasteful at scale — hence packing.',
    summaryBn: 'নতুন অবজেক্ট আলাদা সংকুচিত ফাইলে জীবন শুরু করে। লিখতে দ্রুত, স্কেলে অপচয় — তাই প্যাকিং।',
    learningObjectives: [
      'Explain loose object layout (fan-out by hash prefix)',
      'Explain why fresh writes use loose format',
      'Predict when loose objects get packed',
    ],
    learningObjectivesBn: [
      'লুজ অবজেক্ট বিন্যাস ব্যাখ্যা করা (হ্যাশ প্রিফিক্সে ফ্যান-আউট)',
      'ব্যাখ্যা করা কেন নতুন লেখা লুজ ফরম্যাটে হয়',
      'অনুমান করা কখন লুজ অবজেক্ট প্যাক হয়',
    ],
    keyTakeaways: [
      'One compressed file per object, filed under the first two hash characters.',
      'Loose format optimizes for write speed right after commit.',
      'Periodic packing trades a little CPU for a lot of disk and transfer savings.',
    ],
    sections: [
      {
        id: 'sec-loose',
        title: 'One File Per Object',
        titleBn: 'প্রতি অবজেক্টে এক ফাইল',
        blocks: [
          {
            type: 'code',
            code: '.git/objects/\n├── 9f/\n│   └── 3a2c1e…   (one object)\n├── ab/\n│   └── 12cd34…   (one object)\n└── pack/          (packed archives live here)',
            language: 'text',
          },
          {
            type: 'paragraph',
            text: 'Each new object lands as its own zlib-compressed file, sharded into 256 fan-out directories by hash prefix so no folder grows unbounded. This is the fastest possible write path for commit, add, and fetch — and the reason repositories self-optimize into packfiles later.',
            textBn: 'প্রতিটি নতুন অবজেক্ট নিজের zlib-সংকুচিত ফাইলে আসে, হ্যাশ প্রিফিক্সে ২৫৬ ফ্যান-আউট ডিরেক্টরিতে ভাগ করে যাতে ফোল্ডার অসীম না বাড়ে। কমিট, add ও fetch-এর দ্রুততম লেখা পথ এটাই — এবং রিপোজিটরি পরে নিজে প্যাকফাইলে অপ্টিমাইজ হওয়ার কারণ এটাই।',
          },
        ],
      },
    ],
    relatedCommands: ['git.commit', 'git.fetch'],
    relatedLessons: ['git.fundamentals.local-repository'],
  },
  {
    id: 'git.internals.packfiles',
    moduleId: 'git-internals-storage',
    slug: 'packfiles',
    order: 3,
    durationMinutes: 8,
    difficulty: 'advanced',
    title: 'Packfiles — Conceptual Overview',
    titleBn: 'প্যাকফাইল — ধারণাগত পরিচিতি',
    summary: 'Why Git packs objects for storage and transfer efficiency — without binary-format internals.',
    summaryBn: 'স্টোরেজ ও ট্রান্সফার দক্ষতায় গিট কেন অবজেক্ট প্যাক করে — বাইনারি-ফরম্যাট অভ্যন্তর ছাড়াই।',
    learningObjectives: [
      'Explain the storage and transfer motives for packing',
      'Describe deltas-against-similar-objects at concept level',
      'Explain why packing never changes history semantics',
    ],
    learningObjectivesBn: [
      'প্যাকিংয়ের স্টোরেজ ও ট্রান্সফার উদ্দেশ্য ব্যাখ্যা করা',
      'ধারণা স্তরে সদৃশ-অবজেক্টের বিরুদ্ধে ডেল্টা বর্ণনা করা',
      'ব্যাখ্যা করা কেন প্যাকিং হিস্ট্রি অর্থ বদলায় না',
    ],
    keyTakeaways: [
      'Packfiles bundle many objects with delta compression for disk and network efficiency.',
      'Packing is a storage optimization — the object model above it is unchanged.',
      'Clone and fetch transfer packs; your commands behave identically either way.',
    ],
    sections: [
      {
        id: 'sec-pack',
        title: 'Efficiency Without Changing Meaning',
        titleBn: 'অর্থ না বদলে দক্ষতা',
        blocks: [
          {
            type: 'paragraph',
            text: 'Thousands of loose files waste inodes and bandwidth, so Git periodically repacks: similar objects stored as deltas against each other inside .git/objects/pack archives with an index for instant lookup. Crucially, this changes storage only — every object still addresses, hashes, and behaves exactly as before. Cloning a repository mostly means downloading its packs.',
            textBn: 'হাজারো লুজ ফাইল ইনোড ও ব্যান্ডউইথ নষ্ট করে, তাই গিট পর্যায়ক্রমে পুনঃপ্যাক করে: সদৃশ অবজেক্ট .git/objects/pack আর্কাইভে একে অপরের বিরুদ্ধে ডেল্টায়, তাৎক্ষণিক লুকআপে ইনডেক্সসহ। গুরুত্বপূর্ণ: এতে শুধু স্টোরেজ বদলায় — প্রতিটি অবজেক্ট ঠিক আগের মতো ঠিকানা, হ্যাশ ও আচরণ করে। রিপোজিটরি ক্লোন মানে মূলত এর প্যাক ডাউনলোড।',
          },
          {
            type: 'callout',
            variant: 'note',
            title: 'No binary internals here',
            titleBn: 'এখানে বাইনারি অভ্যন্তর নেই',
            text: 'Pack headers, offsets, and delta opcodes are implementation details for Git developers. Users need one sentence: packs make storage and transfer cheap while history stays identical.',
            textBn: 'প্যাক হেডার, অফসেট ও ডেল্টা অপকোড গিট ডেভেলপারদের বাস্তবায়ন বিবরণ। ব্যবহারকারীর এক বাক্য দরকার: হিস্ট্রি এক রেখে প্যাক স্টোরেজ ও ট্রান্সফার সস্তা করে।',
          },
        ],
      },
    ],
    relatedCommands: ['git.fetch', 'git.commit'],
    relatedLessons: ['git.fundamentals.local-repository'],
  },
  {
    id: 'git.internals.garbage-collection',
    moduleId: 'git-internals-storage',
    slug: 'garbage-collection',
    order: 4,
    durationMinutes: 10,
    difficulty: 'advanced',
    title: 'Garbage Collection',
    titleBn: 'গারবেজ কালেকশন',
    summary: 'git gc tidies the database: packs loose objects, prunes the long-unreachable, and respects reflog grace periods.',
    summaryBn: 'git gc ডাটাবেস গোছায়: লুজ অবজেক্ট প্যাক করে, দীর্ঘ-অপ্রাপ্য ছাঁটে, রিফ্লগ গ্রেস পিরিয়ড মানে।',
    learningObjectives: [
      'Explain what git gc does conceptually',
      'Explain why collection is safe (reachability + expiry)',
      'Know when to run gc manually vs letting Git do it',
    ],
    learningObjectivesBn: [
      'ধারণাগতভাবে git gc কী করে তা ব্যাখ্যা করা',
      'ব্যাখ্যা করা কেন সংগ্রহ নিরাপদ (রিচেবিলিটি + মেয়াদ)',
      'জানা কখন হাতে gc চালাবেন বনাম গিটকে করতে দেবেন',
    ],
    keyTakeaways: [
      'gc packs, prunes expired reflog entries, and deletes long-unreachable objects.',
      'Reachable content is never a collection candidate — safety is structural.',
      'Git auto-gcs when clutter accumulates; manual runs are rarely needed.',
    ],
    sections: [
      {
        id: 'sec-gc',
        title: 'Tidying With Guarantees',
        titleBn: 'গ্যারান্টিসহ গোছানো',
        blocks: [
          {
            type: 'paragraph',
            text: 'git gc does three safe things: it packs loose objects for efficiency, drops reflog entries past their expiry, and deletes objects that have been unreachable beyond grace periods. Reachable history — everything any reference can walk to — is never touched. Git also triggers this housekeeping automatically when it notices enough clutter, which is why most users never run gc by hand.',
            textBn: 'git gc তিনটি নিরাপদ কাজ করে: দক্ষতায় লুজ অবজেক্ট প্যাক করে, মেয়াদোত্তীর্ণ রিফ্লগ এন্ট্রি ফেলে, গ্রেস পিরিয়ড পেরোনো অপ্রাপ্য অবজেক্ট মোছে। পৌঁছানো ইতিহাস — কোনো রেফারেন্স যা হাঁটতে পারে — কখনো ছোঁয়া হয় না। যথেষ্ট জঞ্জাল দেখলে গিট স্বয়ংক্রিয় এই গৃহস্থালি চালায়, তাই বেশিরভাগ ব্যবহারকারী হাতে gc চালান না।',
          },
          {
            type: 'command',
            command: 'git gc',
            description: 'Manually trigger housekeeping (usually unnecessary).',
            descriptionBn: 'হাতে গৃহস্থালি চালান (সাধারণত অপ্রয়োজনীয়)।',
          },
        ],
      },
    ],
    quiz: {
      id: 'quiz-gc-safety',
      subjectId: 'git',
      difficulty: 'advanced',
      question: 'Why can git gc never delete commits on your current branches?',
      questionBn: 'git gc বর্তমান ব্রাঞ্চের কমিট কেন মুছতে পারে না?',
      options: [
        { id: 'opt-a', text: 'Because gc only runs on remote servers', textBn: 'কারণ gc শুধু রিমোট সার্ভারে চলে', isCorrect: false },
        { id: 'opt-b', text: 'Because reachable objects are never collection candidates', textBn: 'কারণ পৌঁছানো অবজেক্ট কখনো সংগ্রহ প্রার্থী নয়', isCorrect: true },
        { id: 'opt-c', text: 'Because branches lock their files on disk', textBn: 'কারণ ব্রাঞ্চ ডিস্কে ফাইল লক করে', isCorrect: false },
        { id: 'opt-d', text: 'Because gc requires an internet connection to verify', textBn: 'কারণ gc যাচাইয়ে ইন্টারনেট দরকার', isCorrect: false },
      ],
      explanation: 'Collection only targets long-unreachable objects. Anything a reference can reach is structurally protected.',
      explanationBn: 'সংগ্রহ শুধু দীর্ঘ-অপ্রাপ্য অবজেক্ট লক্ষ্য করে। রেফারেন্স যা পৌঁছাতে পারে তা গাঠনিকভাবে সুরক্ষিত।',
    },
    relatedCommands: ['git.log', 'git.reset'],
    relatedLessons: ['git.fundamentals.commit'],
  },
  {
    id: 'git.internals.unreachable-objects-expiry',
    moduleId: 'git-internals-storage',
    slug: 'unreachable-objects-expiry',
    order: 5,
    durationMinutes: 8,
    difficulty: 'advanced',
    title: 'Unreachable Objects, Expiry & gc',
    titleBn: 'অপ্রাপ্য অবজেক্ট, মেয়াদ ও gc',
    summary: 'Unreachable does not mean gone: reflog grace, expiry timers, and the honest limits of recovery.',
    summaryBn: 'অপ্রাপ্য মানে চলে যাওয়া নয়: রিফ্লগ গ্রেস, মেয়াদ টাইমার ও উদ্ধারের সৎ সীমা।',
    learningObjectives: [
      'Explain the lifecycle: reachable → unreachable → expired → collected',
      'State default reflog expiry windows honestly',
      'Explain what recovery can and cannot promise',
    ],
    learningObjectivesBn: [
      'জীবনচক্র ব্যাখ্যা করা: পৌঁছানো → অপ্রাপ্য → মেয়াদোত্তীর্ণ → সংগৃহীত',
      'ডিফল্ট রিফ্লগ মেয়াদ উইন্ডো সৎভাবে বলা',
      'ব্যাখ্যা করা উদ্ধার কী প্রতিশ্রুতি দিতে পারে ও পারে না',
    ],
    keyTakeaways: [
      'Unreachable objects linger through reflog grace (~90 days reachable history, ~30 unreachable).',
      'Recovery is realistic inside the window, dishonest to promise beyond it.',
      'Uncommitted working-tree content was never an object — nothing can recover what was never stored.',
    ],
    sections: [
      {
        id: 'sec-expiry',
        title: 'The Honest Timeline',
        titleBn: 'সৎ সময়রেখা',
        blocks: [
          {
            type: 'paragraph',
            text: 'An abandoned commit does not vanish: while any reflog entry references it (roughly 90 days for reachable history, 30 for unreachable), recovery is straightforward. Past expiry, garbage collection may finally delete it. And the hard boundary: content that was never committed was never an object at all — reset --hard on uncommitted work destroys bytes no database ever held.',
            textBn: 'পরিত্যক্ত কমিট উধাও হয় না: কোনো রিফ্লগ এন্ট্রি রেফারেন্স করা পর্যন্ত (পৌঁছানো হিস্ট্রিতে ~৯০ দিন, অপ্রাপ্যে ৩০) উদ্ধার সোজা। মেয়াদের পর গারবেজ কালেকশন মুছতে পারে। আর কঠিন সীমা: কখনো কমিট না হওয়া কন্টেন্ট অবজেক্টই ছিল না — আনকমিটেড কাজে reset --hard এমন বাইট ধ্বংস করে যা কোনো ডাটাবেসে ছিল না।',
          },
          {
            type: 'callout',
            variant: 'danger',
            title: 'Do not promise indefinite recoverability',
            titleBn: 'অনির্দিষ্ট উদ্ধারযোগ্যতার প্রতিশ্রুতি দেবেন না',
            text: 'Reflog plus grace periods make recent mistakes reversible — that is the whole promise, and its entire limit. Teach expiry dates as confidently as recovery commands.',
            textBn: 'রিফ্লগ সাথে গ্রেস পিরিয়ড সাম্প্রতিক ভুল ফেরতযোগ্য করে — এটাই পুরো প্রতিশ্রুতি, ও এর সম্পূর্ণ সীমা। উদ্ধার কমান্ডের মতো আত্মবিশ্বাসে মেয়াদ তারিখ শেখান।',
          },
        ],
      },
    ],
    relatedCommands: ['git.reset', 'git.log'],
    relatedLessons: ['git.fundamentals.commit'],
  },
];
