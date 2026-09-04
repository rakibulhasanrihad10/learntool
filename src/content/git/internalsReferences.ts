import { CurriculumLesson } from '@/types/content';

/**
 * Module 3 — References (git-internals-references)
 * What references are, branches, HEAD deep-dive, remote-tracking, tags, reflog.
 */
export const INTERNALS_REFERENCES_LESSONS: CurriculumLesson[] = [
  {
    id: 'git.internals.what-is-a-reference',
    moduleId: 'git-internals-references',
    slug: 'what-is-a-reference',
    order: 1,
    durationMinutes: 8,
    difficulty: 'intermediate',
    title: 'What Is a Reference?',
    titleBn: 'রেফারেন্স কী?',
    summary: 'References are human names for object IDs. Learn the ref namespace and why indirection makes Git flexible.',
    summaryBn: 'রেফারেন্স হলো অবজেক্ট ID-এর মানব-পাঠযোগ্য নাম। ref নেমস্পেস ও কেন পরোক্ষ নির্দেশনা গিটকে নমনীয় করে শিখুন।',
    learningObjectives: [
      'Define a reference as a name → object ID mapping',
      'Read the refs/heads, refs/tags, refs/remotes namespaces',
      'Explain symbolic references',
    ],
    learningObjectivesBn: [
      'নাম → অবজেক্ট ID ম্যাপিং হিসেবে রেফারেন্সের সংজ্ঞা দেওয়া',
      'refs/heads, refs/tags, refs/remotes নেমস্পেস পড়া',
      'সিম্বলিক রেফারেন্স ব্যাখ্যা করা',
    ],
    keyTakeaways: [
      'A reference maps a readable name to one object hash.',
      'refs/heads/* are branches, refs/tags/* are tags, refs/remotes/* mirror remotes.',
      'Symbolic references point at other references — HEAD → main is the famous one.',
    ],
    sections: [
      {
        id: 'sec-refs',
        title: 'Names for Hashes',
        titleBn: 'হ্যাশের নাম',
        blocks: [
          {
            type: 'paragraph',
            text: 'Nobody wants to type 9f3a2c1e… to talk about their work. References give stable human names to moving object IDs: main always means "the tip of main, wherever it currently is." Under .git/refs, each reference is a small file (or a line in packed-refs) holding one hash — plus special symbolic refs like HEAD that point at other refs instead of objects.',
            textBn: 'কাজের কথা বলতে 9f3a2c1e… টাইপ করতে কেউ চায় না। রেফারেন্স চলমান অবজেক্ট ID-কে স্থিতিশীল মানব-নাম দেয়: main সবসময় মানে "main-এর শীর্ষ, এখন যেখানেই থাকুক"। .git/refs-এর অধীনে প্রতিটি রেফারেন্স একটি হ্যাশ ধারণকারী ছোট ফাইল (বা packed-refs-এ লাইন) — সাথে HEAD-এর মতো বিশেষ সিম্বলিক রেফ যা অবজেক্টের বদলে অন্য রেফের দিকে যায়।',
          },
          {
            type: 'command',
            command: 'git show-ref',
            description: 'List every reference and the object it currently points to.',
            descriptionBn: 'প্রতিটি রেফারেন্স ও বর্তমানে যে অবজেক্টের দিকে যায় তা তালিকা করুন।',
          },
        ],
      },
    ],
    relatedCommands: ['git.branch', 'git.log'],
    relatedLessons: ['git.fundamentals.branch'],
  },
  {
    id: 'git.internals.branch-references',
    moduleId: 'git-internals-references',
    slug: 'branch-references',
    order: 2,
    durationMinutes: 8,
    difficulty: 'intermediate',
    title: 'Branch References',
    titleBn: 'ব্রাঞ্চ রেফারেন্স',
    summary: 'Branches as refs/heads entries: creation, movement, deletion, and why two branches may share one tip.',
    summaryBn: 'refs/heads এন্ট্রি হিসেবে ব্রাঞ্চ: তৈরি, সরণ, মুছে ফেলা, এবং কেন দুটি ব্রাঞ্চ একটি টিপ ভাগ করতে পারে।',
    learningObjectives: [
      'Locate a branch as refs/heads/<name>',
      'Explain which operations move branch refs',
      'Explain what deleting a branch does and does not destroy',
    ],
    learningObjectivesBn: [
      'refs/heads/<name> হিসেবে ব্রাঞ্চ খোঁজা',
      'ব্যাখ্যা করা কোন অপারেশন ব্রাঞ্চ রেফ সরায়',
      'ব্যাখ্যা করা ব্রাঞ্চ মুছলে কী ধ্বংস হয় ও হয় না',
    ],
    keyTakeaways: [
      'Branch main is the file .git/refs/heads/main containing one hash.',
      'Commit, merge, and reset move it; log, diff, and fetch never do.',
      'Deleting a branch removes the name — commits survive until unreachable and collected.',
    ],
    sections: [
      {
        id: 'sec-branch-ref',
        title: 'Life of a Branch Ref',
        titleBn: 'ব্রাঞ্চ রেফের জীবন',
        blocks: [
          {
            type: 'paragraph',
            text: 'Creating a branch writes one hash into a new file. Committing while it is checked out rewrites that file with the new tip. Deleting the branch removes the file — the commits it pointed to remain in the object database, reachable or not, until garbage collection.',
            textBn: 'ব্রাঞ্চ তৈরি মানে নতুন ফাইলে একটি হ্যাশ লেখা। চেক-আউট থাকতে কমিট করলে নতুন টিপ দিয়ে ফাইল পুনর্লিখিত হয়। ব্রাঞ্চ মুছলে ফাইল যায় — যে কমিটের দিকে ছিল তা অবজেক্ট ডাটাবেসে থাকে, পৌঁছানো যাক বা না যাক, গারবেজ কালেকশন পর্যন্ত।',
          },
          {
            type: 'code',
            code: 'main     → C3\nfeature  → C3   (shared tip: two names, one commit)',
            language: 'text',
          },
        ],
      },
    ],
    relatedCommands: ['git.branch', 'git.switch', 'git.reset'],
    relatedLessons: ['git.fundamentals.branch'],
  },
  {
    id: 'git.internals.head-deep-dive',
    moduleId: 'git-internals-references',
    slug: 'head-deep-dive',
    order: 3,
    durationMinutes: 10,
    difficulty: 'advanced',
    title: 'HEAD In Depth',
    titleBn: 'HEAD গভীরভাবে',
    summary: 'HEAD mechanics: symbolic vs detached, what checkout writes, and the safe recovery pattern.',
    summaryBn: 'HEAD মেকানিক্স: সিম্বলিক বনাম বিচ্ছিন্ন, চেকআউট কী লেখে, ও নিরাপদ পুনরুদ্ধার প্যাটার্ন।',
    learningObjectives: [
      'Read .git/HEAD in both attached and detached states',
      'Explain what checkout and switch write to HEAD',
      'Recover detached HEAD work by creating a branch',
    ],
    learningObjectivesBn: [
      'সংযুক্ত ও বিচ্ছিন্ন উভয় অবস্থায় .git/HEAD পড়া',
      'ব্যাখ্যা করা checkout ও switch HEAD-এ কী লেখে',
      'ব্রাঞ্চ তৈরি করে ডিটাচড HEAD কাজ উদ্ধার করা',
    ],
    keyTakeaways: [
      'Attached HEAD contains "ref: refs/heads/<branch>"; detached HEAD contains a raw hash.',
      'Switching branches rewrites HEAD; committing advances the branch HEAD points to.',
      'Lost in detached HEAD? git switch -c <name> preserves everything instantly.',
    ],
    sections: [
      {
        id: 'sec-head-file',
        title: 'A 40-Byte File That Runs the Show',
        titleBn: 'শো চালানো ৪০-বাইট ফাইল',
        blocks: [
          {
            type: 'code',
            code: '# attached:\nref: refs/heads/main\n\n# detached:\na1b2c3d4e5f6...',
            language: 'text',
          },
          {
            type: 'paragraph',
            text: 'That is the entire mechanism. When HEAD holds a ref path, Git resolves the branch to find your commit, and new commits advance that branch. When HEAD holds a raw hash, commits dangle with no branch to advance — which is precisely why detached work feels precarious and why naming a branch fixes it immediately.',
            textBn: 'পুরো কৌশল এটাই। HEAD-এ ref পথ থাকলে গিট ব্রাঞ্চ সমাধান করে কমিট খোঁজে, নতুন কমিট সেই ব্রাঞ্চ এগিয়ে নেয়। HEAD-এ কাঁচা হ্যাশ থাকলে কমিট ঝুলে থাকে এগোনোর ব্রাঞ্চ ছাড়া — ঠিক তাই ডিটাচড কাজ অনিশ্চিত লাগে, এবং ব্রাঞ্চ নাম দিলে সাথে সাথে ঠিক হয়।',
          },
          {
            type: 'callout',
            variant: 'tip',
            title: 'Recover from detached HEAD',
            titleBn: 'ডিটাচড HEAD থেকে উদ্ধার',
            text: 'Create a branch exactly where you are: git switch -c recovery. The full recovery recipe lives in the troubleshooting guide — open it from the links below.',
            textBn: 'ঠিক যেখানে আছেন সেখানে ব্রাঞ্চ তৈরি করুন: git switch -c recovery। পূর্ণ পুনরুদ্ধার রেসিপি ট্রাবলশুটিং গাইডে — নিচের লিঙ্ক থেকে খুলুন।',
          },
        ],
      },
    ],
    relatedCommands: ['git.switch', 'git.checkout', 'git.log'],
    relatedLessons: ['git.fundamentals.head'],
  },
  {
    id: 'git.internals.remote-tracking-references',
    moduleId: 'git-internals-references',
    slug: 'remote-tracking-references',
    order: 4,
    durationMinutes: 10,
    difficulty: 'intermediate',
    title: 'Remote-Tracking References',
    titleBn: 'রিমোট-ট্র্যাকিং রেফারেন্স',
    summary: 'origin/main is your local memory of the remote — updated by fetch, read by you, moved by push and pull.',
    summaryBn: 'origin/main হলো রিমোটের লোকাল স্মৃতি — fetch-এ আপডেট, আপনার পড়া, push ও pull-এ সরণ।',
    learningObjectives: [
      'Distinguish main, origin/main, and the remote’s main',
      'Explain which commands move tracking refs',
      'Use tracking refs to preview integration safely',
    ],
    learningObjectivesBn: [
      'main, origin/main ও রিমোটের main আলাদা করা',
      'ব্যাখ্যা করা কোন কমান্ড ট্র্যাকিং রেফ সরায়',
      'নিরাপদে একীভূতকরণ পূর্বরূপে ট্র্যাকিং রেফ ব্যবহার করা',
    ],
    keyTakeaways: [
      'Three different things share one name: local main, origin/main, remote main.',
      'fetch updates tracking refs; push advances them on success; pull moves them then integrates.',
      'Compare HEAD against origin/main before merging — never merge blind.',
    ],
    sections: [
      {
        id: 'sec-three-mains',
        title: 'Three Mains, One Name',
        titleBn: 'তিন main, এক নাম',
        blocks: [
          {
            type: 'code',
            code: 'main → C3            (yours, moves when you commit)\norigin/main → C5    (memory, moves on fetch/push)\nremote main → C5    (theirs, you never touch it directly)',
            language: 'text',
          },
          {
            type: 'paragraph',
            text: 'Confusion ends when you see all three. Your main moves when you commit. origin/main moves when fetch downloads or push succeeds — it is a photograph, possibly stale. The remote’s actual main moves when anyone with access pushes. git status "behind/ahead" messages are just arithmetic between your main and your photograph.',
            textBn: 'তিনটি দেখলেই বিভ্রান্তি শেষ। কমিটে আপনার main সরে। fetch ডাউনলোড বা push সফলে origin/main সরে — এটি ছবি, সম্ভবত পুরনো। অ্যাক্সেস থাকা যে কেউ পুশ করলে রিমোটের আসল main সরে। git status-এর "behind/ahead" বার্তা আপনার main ও ছবির মধ্যে পাটিগণিত মাত্র।',
          },
        ],
      },
    ],
    relatedCommands: ['git.fetch', 'git.pull', 'git.push', 'git.status'],
    relatedLessons: ['git.fundamentals.remote-repository'],
  },
  {
    id: 'git.internals.lightweight-vs-annotated-tags',
    moduleId: 'git-internals-references',
    slug: 'lightweight-vs-annotated-tags',
    order: 5,
    durationMinutes: 8,
    difficulty: 'intermediate',
    title: 'Lightweight vs Annotated Tags',
    titleBn: 'হালকা বনাম অ্যানোটেটেড ট্যাগ',
    summary: 'Two ways to name a commit: a bare pointer for convenience, or a full object for releases that must be verifiable.',
    summaryBn: 'কমিটের নামের দুই উপায়: সুবিধায় খালি পয়েন্টার, বা যাচাইযোগ্য হতে হবে এমন রিলিজে পূর্ণ অবজেক্ট।',
    learningObjectives: [
      'Contrast lightweight and annotated tags structurally',
      'Choose the right kind for releases vs bookmarks',
      'Explain why tags do not move like branches',
    ],
    learningObjectivesBn: [
      'গাঠনিকভাবে হালকা ও অ্যানোটেটেড ট্যাগের তুলনা করা',
      'রিলিজ বনাম বুকমার্কে সঠিক ধরন বেছে নেওয়া',
      'ব্যাখ্যা করা কেন ট্যাগ ব্রাঞ্চের মতো সরে না',
    ],
    keyTakeaways: [
      'Lightweight tag = bare ref to a commit. Annotated tag = tag object with message and tagger.',
      'Tag releases with annotated tags; bookmark experiments with lightweight ones.',
      'Tags are fixed milestones — committing never advances them.',
    ],
    sections: [
      {
        id: 'sec-tags-use',
        title: 'Milestones, Not Branches',
        titleBn: 'মাইলফলক, ব্রাঞ্চ নয়',
        blocks: [
          {
            type: 'code',
            code: 'v1.0\n ↓\nC10   (stays here forever; new commits go elsewhere)',
            language: 'text',
          },
          {
            type: 'paragraph',
            text: 'Use annotated tags for anything the future must trust — releases, milestones, stable versions — because the message, tagger, and checksum travel with the name. Use lightweight tags as personal sticky notes. And unlike branches, committing never moves a tag: a milestone that slides is not a milestone.',
            textBn: 'ভবিষ্যৎ যাতে বিশ্বাস করে এমন সবকিছুতে অ্যানোটেটেড ট্যাগ ব্যবহার করুন — রিলিজ, মাইলফলক, স্থিতিশীল সংস্করণ — কারণ বার্তা, ট্যাগার ও চেকসাম নামের সাথে যায়। ব্যক্তিগত স্টিকি নোটে হালকা ট্যাগ ব্যবহার করুন। আর ব্রাঞ্চের বিপরীতে, কমিট ট্যাগ সরায় না: যে মাইলফলক সরে তা মাইলফলক নয়।',
          },
        ],
      },
    ],
    relatedCommands: ['git.log'],
    relatedLessons: ['git.fundamentals.commit'],
  },
  {
    id: 'git.internals.reflog',
    moduleId: 'git-internals-references',
    slug: 'reflog',
    order: 6,
    durationMinutes: 12,
    difficulty: 'advanced',
    title: 'Reflog',
    titleBn: 'রিফ্লগ',
    summary: 'A local, expiring journal of every reference movement — your safety net for resets, rebases, and deleted branches.',
    summaryBn: 'প্রতিটি রেফারেন্স নড়াচড়ার লোকাল, মেয়াদি জার্নাল — রিসেট, রিবেস ও মোছা ব্রাঞ্চের নিরাপত্তা জাল।',
    learningObjectives: [
      'Read HEAD@{n} entries as reference movements',
      'Recover commits, branches, and botched resets via reflog',
      'State reflog limits: local, expiring, not a backup',
    ],
    learningObjectivesBn: [
      'HEAD@{n} এন্ট্রি রেফারেন্স নড়াচড়া হিসেবে পড়া',
      'reflog দিয়ে কমিট, ব্রাঞ্চ ও ভুল রিসেট উদ্ধার করা',
      'রিফ্লগ সীমা বলা: লোকাল, মেয়াদি, ব্যাকআপ নয়',
    ],
    keyTakeaways: [
      'Reflog records where HEAD and branches pointed after every movement.',
      'Lost commits are usually one git reset --hard <hash-from-reflog> away.',
      'Local only, expires (default ~90 days), never synced — not a backup.',
    ],
    sections: [
      {
        id: 'sec-journal',
        title: 'The Flight Recorder',
        titleBn: 'ফ্লাইট রেকর্ডার',
        blocks: [
          {
            type: 'paragraph',
            text: 'Every time HEAD or a branch moves — commit, reset, merge, rebase, checkout — Git appends a reflog entry recording the old and new values. Deleted branches and "lost" commits are therefore rarely lost: their hashes sit in .git/logs waiting to be re-pointed at.',
            textBn: 'HEAD বা ব্রাঞ্চ যতবার সরে — কমিট, রিসেট, মার্জ, রিবেস, চেকআউট — গিট পুরনো ও নতুন মান রেকর্ড করে রিফ্লগ এন্ট্রি যোগ করে। মোছা ব্রাঞ্চ ও "হারানো" কমিট তাই কদাচিৎ হারায়: .git/logs-এ হ্যাশ পুনরায় নির্দেশের অপেক্ষায় থাকে।',
          },
          {
            type: 'code',
            code: 'HEAD@{0}: reset: moving to HEAD~2\nHEAD@{1}: commit: fix login validation\nHEAD@{2}: checkout: moving from main to feature',
            language: 'text',
          },
          {
            type: 'command',
            command: 'git reflog',
            description: 'Read the local journal of reference movements.',
            descriptionBn: 'রেফারেন্স নড়াচড়ার লোকাল জার্নাল পড়ুন।',
          },
        ],
      },
      {
        id: 'sec-limits',
        title: 'Local, Expiring, Not a Backup',
        titleBn: 'লোকাল, মেয়াদি, ব্যাকআপ নয়',
        blocks: [
          {
            type: 'callout',
            variant: 'warning',
            title: 'Three limits that matter',
            titleBn: 'গুরুত্বপূর্ণ তিনটি সীমা',
            text: 'Reflog lives only in your clone — pushing shares nothing of it. Entries expire (about 90 days by default, 30 for unreachable objects). And it journals references, not working-tree files: uncommitted edits destroyed by reset --hard are not in any log.',
            textBn: 'রিফ্লগ শুধু আপনার ক্লোনে থাকে — পুশে এর কিছু ভাগ হয় না। এন্ট্রির মেয়াদ শেষ হয় (ডিফল্টে ~৯০ দিন, অপ্রাপ্য অবজেক্টে ৩০)। আর এটি রেফারেন্সের জার্নাল, ওয়ার্কিং-ট্রি ফাইলের নয়: reset --hard-এ ধ্বংস আনকমিটেড এডিট কোনো লগে নেই।',
          },
        ],
      },
    ],
    relatedCommands: ['git.log', 'git.reset', 'git.switch'],
    relatedLessons: ['git.fundamentals.head'],
  },
];
