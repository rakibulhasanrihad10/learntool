import { LocalText } from '@/types/content';
import type { ConceptId } from '@/features/internals/models';

/**
 * Shared Internals content: explorer concepts, misconceptions, search entries.
 * Single source of truth — consumed by the Internals Explorer page, the
 * misconceptions lesson, and the search index. No UI here.
 */

export interface InternalsConcept {
  id: ConceptId;
  title: LocalText;
  what: LocalText;
  pointsTo: LocalText;
  pointedBy: LocalText;
  why: LocalText;
}

export const INTERNALS_CONCEPTS: InternalsConcept[] = [
  {
    id: 'working-tree',
    title: { en: 'Working Tree', bn: 'ওয়ার্কিং ট্রি' },
    what: {
      en: 'The checked-out files on disk that you edit directly — the only area you ever touch by hand.',
      bn: 'ডিস্কে চেক-আউট করা ফাইল যা সরাসরি এডিট করেন — হাতে ছোঁয়ার একমাত্র ক্ষেত্র।',
    },
    pointsTo: {
      en: 'Nothing in Git — it is the source that git add reads from.',
      bn: 'গিটে কিছু নয় — এটি উৎস যা থেকে git add পড়ে।',
    },
    pointedBy: {
      en: 'Nothing points at it; checkouts materialize commit trees into it.',
      bn: 'কিছু এর দিকে যায় না; চেকআউট কমিট ট্রি এতে বাস্তবায়ন করে।',
    },
    why: {
      en: 'Every change begins here. Clean tree = safe to switch, merge, or rebase.',
      bn: 'প্রতিটি পরিবর্তন এখানে শুরু। পরিষ্কার ট্রি = সুইচ, মার্জ বা রিবেসে নিরাপদ।',
    },
  },
  {
    id: 'index',
    title: { en: 'Index (Staging Area)', bn: 'ইনডেক্স (স্টেজিং এরিয়া)' },
    what: {
      en: 'The proposed next commit: a flat list of blob hashes and paths in .git/index.',
      bn: 'প্রস্তাবিত পরবর্তী কমিট: .git/index-এ ব্লব হ্যাশ ও পথের সমতল তালিকা।',
    },
    pointsTo: {
      en: 'Blob objects staged for the next commit.',
      bn: 'পরবর্তী কমিটে স্টেজড ব্লব অবজেক্ট।',
    },
    pointedBy: {
      en: 'git add writes it; git commit reads it; git status and git diff compare against it.',
      bn: 'git add লেখে; git commit পড়ে; git status ও git diff এর সাথে তুলনা করে।',
    },
    why: {
      en: 'The index lets you curate exactly what the next snapshot contains.',
      bn: 'ইনডেক্স পরবর্তী স্ন্যাপশটে ঠিক কী থাকবে তা সাজাতে দেয়।',
    },
  },
  {
    id: 'commit',
    title: { en: 'Commit', bn: 'কমিট' },
    what: {
      en: 'An immutable snapshot record: one tree, parent list, author, committer, message.',
      bn: 'অপরিবর্তনীয় স্ন্যাপশট রেকর্ড: একটি ট্রি, প্যারেন্ট তালিকা, লেখক, কমিটার, বার্তা।',
    },
    pointsTo: {
      en: 'Its tree snapshot and its parent commit(s).',
      bn: 'এর ট্রি স্ন্যাপশট ও প্যারেন্ট কমিট(গুলো)।',
    },
    pointedBy: {
      en: 'Branch refs, tags, child commits (as parents), HEAD transitively, reflog entries.',
      bn: 'ব্রাঞ্চ রেফ, ট্যাগ, চাইল্ড কমিট (প্যারেন্ট হিসেবে), HEAD পরোক্ষভাবে, রিফ্লগ এন্ট্রি।',
    },
    why: {
      en: 'Commits are the units of history — everything references, recovers, or rewrites them.',
      bn: 'কমিট ইতিহাসের একক — সবকিছু রেফারেন্স, উদ্ধার বা পুনর্লেখে এদের।',
    },
  },
  {
    id: 'tree',
    title: { en: 'Tree', bn: 'ট্রি' },
    what: {
      en: 'A directory listing: names mapped to blob or subtree object IDs.',
      bn: 'ডিরেক্টরি তালিকা: ব্লব বা সাবট্রি অবজেক্ট ID-তে নাম ম্যাপ করা।',
    },
    pointsTo: {
      en: 'Blob objects and nested tree objects.',
      bn: 'ব্লব অবজেক্ট ও নেস্টেড ট্রি অবজেক্ট।',
    },
    pointedBy: {
      en: 'Commits (root tree) and parent trees (subdirectories).',
      bn: 'কমিট (রুট ট্রি) ও প্যারেন্ট ট্রি (সাবডিরেক্টরি)।',
    },
    why: {
      en: 'Trees give blobs their names and hierarchy — without them, content has no structure.',
      bn: 'ট্রি ব্লবকে নাম ও শ্রেণিবিন্যাস দেয় — ছাড়া কন্টেন্টের কাঠামো নেই।',
    },
  },
  {
    id: 'blob',
    title: { en: 'Blob', bn: 'ব্লব' },
    what: {
      en: 'Raw file bytes with no name, path, or timestamp.',
      bn: 'নাম, পথ বা সময় ছাড়া কাঁচা ফাইল বাইট।',
    },
    pointsTo: {
      en: 'Nothing — blobs are leaves of the object graph.',
      bn: 'কিছু নয় — ব্লব অবজেক্ট গ্রাফের পাতা।',
    },
    pointedBy: {
      en: 'Tree entries and the index.',
      bn: 'ট্রি এন্ট্রি ও ইনডেক্স।',
    },
    why: {
      en: 'Identical content anywhere shares one blob — deduplication for free.',
      bn: 'যেকোনো জায়গার একই কন্টেন্ট একটি ব্লব ভাগ করে — বিনামূল্যে ডিডুপ্লিকেশন।',
    },
  },
  {
    id: 'branch',
    title: { en: 'Branch Reference', bn: 'ব্রাঞ্চ রেফারেন্স' },
    what: {
      en: 'A movable 41-byte pointer: a file under refs/heads holding one commit hash.',
      bn: 'চলমান ৪১-বাইট পয়েন্টার: একটি কমিট হ্যাশ ধারণকারী refs/heads-এর ফাইল।',
    },
    pointsTo: {
      en: 'Its tip commit.',
      bn: 'এর টিপ কমিট।',
    },
    pointedBy: {
      en: 'HEAD (when checked out); conceptually, the developers who advance it.',
      bn: 'HEAD (চেক-আউট থাকলে); ধারণাগতভাবে এগিয়ে নেওয়া ডেভেলপাররা।',
    },
    why: {
      en: 'Cheap isolation: new timelines cost bytes, not copies.',
      bn: 'সস্তা আলাদাকরণ: নতুন টাইমলাইনে বাইট খরচ, কপি নয়।',
    },
  },
  {
    id: 'head',
    title: { en: 'HEAD', bn: 'HEAD' },
    what: {
      en: 'A pointer recording your current position — usually a branch, sometimes a raw commit.',
      bn: 'বর্তমান অবস্থান রেকর্ড করা পয়েন্টার — সাধারণত ব্রাঞ্চ, কখনো কাঁচা কমিট।',
    },
    pointsTo: {
      en: 'The checked-out branch (attached) or a commit directly (detached).',
      bn: 'চেক-আউট ব্রাঞ্চ (সংযুক্ত) বা সরাসরি কমিট (বিচ্ছিন্ন)।',
    },
    pointedBy: {
      en: 'Nothing points at HEAD — every operation reads it to know where you are.',
      bn: 'HEAD-এর দিকে কিছু যায় না — আপনি কোথায় তা জানতে প্রতিটি অপারেশন পড়ে।',
    },
    why: {
      en: 'HEAD is how Git knows what "current" means for commit, merge, and status.',
      bn: 'কমিট, মার্জ ও status-এ "বর্তমান" মানে কী তা HEAD দিয়ে গিট জানে।',
    },
  },
  {
    id: 'remote-tracking',
    title: { en: 'Remote-Tracking Reference', bn: 'রিমোট-ট্র্যাকিং রেফারেন্স' },
    what: {
      en: 'Your local memory of a remote branch (origin/main): a photograph, possibly stale.',
      bn: 'রিমোট ব্রাঞ্চের লোকাল স্মৃতি (origin/main): ছবি, সম্ভবত পুরনো।',
    },
    pointsTo: {
      en: 'The commit the remote had at your last fetch, pull, or push.',
      bn: 'শেষ fetch, pull বা push-এ রিমোটে থাকা কমিট।',
    },
    pointedBy: {
      en: 'Nothing user-facing — fetch, pull, and push maintain it automatically.',
      bn: 'ব্যবহারকারী-মুখী কিছু নয় — fetch, pull ও push স্বয়ংক্রিয় রক্ষণ করে।',
    },
    why: {
      en: 'Compare against it before integrating — never merge blind.',
      bn: 'একীভূতের আগে এর সাথে তুলনা করুন — কখনো অন্ধ মার্জ নয়।',
    },
  },
  {
    id: 'reflog',
    title: { en: 'Reflog', bn: 'রিফ্লগ' },
    what: {
      en: 'A local, expiring journal of reference movements in .git/logs.',
      bn: '.git/logs-এ রেফারেন্স নড়াচড়ার লোকাল, মেয়াদি জার্নাল।',
    },
    pointsTo: {
      en: 'Historical (ref, old-value, new-value) entries — a timeline of pointers.',
      bn: 'ঐতিহাসিক (ref, পুরনো-মান, নতুন-মান) এন্ট্রি — পয়েন্টারের টাইমলাইন।',
    },
    pointedBy: {
      en: 'Only you, when recovering. Nothing in normal operation reads it.',
      bn: 'শুধু আপনি, উদ্ধারের সময়। স্বাভাবিক অপারেশনে কিছু পড়ে না।',
    },
    why: {
      en: 'The safety net behind reset, rebase, and branch-deletion recovery.',
      bn: 'রিসেট, রিবেস ও ব্রাঞ্চ-মোছা উদ্ধারের পেছনে নিরাপত্তা জাল।',
    },
  },
  {
    id: 'tag',
    title: { en: 'Tag', bn: 'ট্যাগ' },
    what: {
      en: 'A fixed human name for one commit — lightweight pointer or annotated object.',
      bn: 'এক কমিটের স্থির মানব-নাম — হালকা পয়েন্টার বা অ্যানোটেটেড অবজেক্ট।',
    },
    pointsTo: {
      en: 'One commit (directly, or via a tag object).',
      bn: 'এক কমিট (সরাসরি, বা ট্যাগ অবজেক্ট হয়ে)।',
    },
    pointedBy: {
      en: 'Release tooling and humans — never advancing branches.',
      bn: 'রিলিজ টুলিং ও মানুষ — কখনো এগিয়ে যাওয়া ব্রাঞ্চ নয়।',
    },
    why: {
      en: 'Milestones that must not move: releases, stable versions, audit points.',
      bn: 'সরানো উচিত নয় এমন মাইলফলক: রিলিজ, স্থিতিশীল সংস্করণ, অডিট পয়েন্ট।',
    },
  },
  {
    id: 'object-db',
    title: { en: 'Object Database', bn: 'অবজেক্ট ডাটাবেস' },
    what: {
      en: '.git/objects: every blob, tree, commit, and tag, addressed by content hash.',
      bn: '.git/objects: প্রতিটি ব্লব, ট্রি, কমিট ও ট্যাগ, কন্টেন্ট হ্যাশে ঠিকানাযুক্ত।',
    },
    pointsTo: {
      en: 'Internally linked objects; externally, everything points here.',
      bn: 'অভ্যন্তরীণ যুক্ত অবজেক্ট; বাইরে থেকে সবকিছু এখানে যায়।',
    },
    pointedBy: {
      en: 'Refs, HEAD, index, and working-tree checkouts all resolve through it.',
      bn: 'রেফ, HEAD, ইনডেক্স ও ওয়ার্কিং-ট্রি চেকআউট সব এর মাধ্যমে সমাধান হয়।',
    },
    why: {
      en: 'The single source of truth that cloning copies and checkout materializes.',
      bn: 'একমাত্র সত্যের উৎস যা ক্লোন কপি করে ও চেকআউট বাস্তবায়ন করে।',
    },
  },
];

export interface InternalsMisconception {
  myth: LocalText;
  reality: LocalText;
}

export const INTERNALS_MISCONCEPTIONS: InternalsMisconception[] = [
  {
    myth: { en: 'Branch = folder', bn: 'ব্রাঞ্চ = ফোল্ডার' },
    reality: { en: 'Branch একটি folder নয়; এটি একটি commit-কে নির্দেশ করা movable reference।', bn: 'ব্রাঞ্চ ফোল্ডার নয়; এটি কমিটের দিকে নির্দেশ করা চলমান রেফারেন্স।' },
  },
  {
    myth: { en: 'Commit stores a full copy of every file', bn: 'কমিট প্রতিটি ফাইলের পূর্ণ কপি রাখে' },
    reality: { en: 'A commit points to a tree; unchanged content is shared via identical blobs, never duplicated.', bn: 'কমিট ট্রির দিকে নির্দেশ করে; অপরিবর্তিত কন্টেন্ট একই ব্লবে ভাগ হয়, ডুপ্লিকেট হয় না।' },
  },
  {
    myth: { en: 'HEAD is a branch', bn: 'HEAD একটি ব্রাঞ্চ' },
    reality: { en: 'HEAD is a pointer that normally points at a branch — and can point directly at a commit.', bn: 'HEAD একটি পয়েন্টার যা সাধারণত ব্রাঞ্চের দিকে যায় — এবং সরাসরি কমিটের দিকেও যেতে পারে।' },
  },
  {
    myth: { en: 'origin/main is the remote branch itself', bn: 'origin/main-ই রিমোট ব্রাঞ্চ' },
    reality: { en: 'origin/main is your local memory of the remote at last fetch — possibly stale.', bn: 'origin/main শেষ fetch-এ রিমোটের লোকাল স্মৃতি — সম্ভবত পুরনো।' },
  },
  {
    myth: { en: 'git add uploads files', bn: 'git add ফাইল আপলোড করে' },
    reality: { en: 'git add stages content into the local index; nothing leaves your machine.', bn: 'git add লোকাল ইনডেক্সে কন্টেন্ট স্টেজ করে; মেশিন থেকে কিছু যায় না।' },
  },
  {
    myth: { en: 'git fetch changes my current branch', bn: 'git fetch বর্তমান ব্রাঞ্চ বদলায়' },
    reality: { en: 'fetch only updates remote-tracking references and downloads objects.', bn: 'fetch শুধু রিমোট-ট্র্যাকিং রেফারেন্স আপডেট করে ও অবজেক্ট ডাউনলোড করে।' },
  },
  {
    myth: { en: 'git pull is just git fetch', bn: 'git pull শুধু git fetch' },
    reality: { en: 'pull is fetch plus an integration step — merge or rebase.', bn: 'pull হলো fetch সাথে একীভূতকরণ ধাপ — মার্জ বা রিবেস।' },
  },
  {
    myth: { en: 'Rebase moves the original commits', bn: 'রিবেস মূল কমিট সরায়' },
    reality: { en: 'Rebase creates new commits and moves the branch pointer; originals linger until collected.', bn: 'রিবেস নতুন কমিট তৈরি করে ও ব্রাঞ্চ পয়েন্টার সরায়; মূলগুলো সংগ্রহ পর্যন্ত থাকে।' },
  },
  {
    myth: { en: 'Reflog is a backup', bn: 'রিফ্লগ ব্যাকআপ' },
    reality: { en: 'Reflog is a local, expiring journal of reference movements — not an archive.', bn: 'রিফ্লগ রেফারেন্স নড়াচড়ার লোকাল, মেয়াদি জার্নাল — আর্কাইভ নয়।' },
  },
  {
    myth: { en: 'GitHub is Git', bn: 'গিটহাবই গিট' },
    reality: { en: 'GitHub hosts Git repositories; Git works fully without it.', bn: 'গিটহাব গিট রিপোজিটরি হোস্ট করে; গিট ছাড়াই পুরোপুরি চলে।' },
  },
];

export interface InternalsSearchEntry {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  keywords: string[];
  route: string;
}

/** Structured metadata so §33 example queries resolve to the right lesson or explorer. */
export const INTERNALS_SEARCH_ENTRIES: InternalsSearchEntry[] = [
  {
    id: 'git.internals.search.objects',
    title: 'Git Objects',
    titleBn: 'গিট অবজেক্ট',
    subtitle: 'Git Objects Overview — internals lesson',
    subtitleBn: 'গিট অবজেক্ট পরিচিতি — ইন্টারনালস পাঠ',
    keywords: ['how git stores files', 'git objects', 'object types', 'blob tree commit tag'],
    route: '/learn/git/git-objects/objects-overview',
  },
  {
    id: 'git.internals.search.blob',
    title: 'Blob Objects',
    titleBn: 'ব্লব অবজেক্ট',
    subtitle: 'Blob Objects — internals lesson',
    subtitleBn: 'ব্লব অবজেক্ট — ইন্টারনালস পাঠ',
    keywords: ['what is blob', 'blob object', 'file content storage'],
    route: '/learn/git/git-objects/blob-objects',
  },
  {
    id: 'git.internals.search.tree',
    title: 'Tree Objects',
    titleBn: 'ট্রি অবজেক্ট',
    subtitle: 'Tree Objects — internals lesson',
    subtitleBn: 'ট্রি অবজেক্ট — ইন্টারনালস পাঠ',
    keywords: ['git tree', 'tree object', 'directory listing snapshot'],
    route: '/learn/git/git-objects/tree-objects',
  },
  {
    id: 'git.internals.search.branch-pointer',
    title: 'Branch References',
    titleBn: 'ব্রাঞ্চ রেফারেন্স',
    subtitle: 'Branch References — internals lesson',
    subtitleBn: 'ব্রাঞ্চ রেফারেন্স — ইন্টারনালস পাঠ',
    keywords: ['branch pointer', 'what is a branch really', 'branch reference', 'branches are references'],
    route: '/learn/git/references/branch-references',
  },
  {
    id: 'git.internals.search.head',
    title: 'HEAD',
    titleBn: 'HEAD',
    subtitle: 'HEAD In Depth — internals lesson',
    subtitleBn: 'HEAD গভীরভাবে — ইন্টারনালস পাঠ',
    keywords: ['what is head', 'detached head meaning', 'head pointer', 'symbolic reference'],
    route: '/learn/git/references/head-deep-dive',
  },
  {
    id: 'git.internals.search.reflog',
    title: 'Reflog',
    titleBn: 'রিফ্লগ',
    subtitle: 'Reflog — internals lesson',
    subtitleBn: 'রিফ্লগ — ইন্টারনালস পাঠ',
    keywords: ['recover deleted commit', 'reflog', 'lost commit recovery', 'undo reset hard'],
    route: '/learn/git/references/reflog',
  },
  {
    id: 'git.internals.search.index',
    title: 'Working Tree / Index',
    titleBn: 'ওয়ার্কিং ট্রি / ইনডেক্স',
    subtitle: 'Working Tree, Index, Repository — internals lesson',
    subtitleBn: 'ওয়ার্কিং ট্রি, ইনডেক্স, রিপোজিটরি — ইন্টারনালস পাঠ',
    keywords: ['git index', 'staging area internals', 'what is the index', 'three areas'],
    route: '/learn/git/mental-model/working-tree-index-repository',
  },
  {
    id: 'git.internals.search.object-db',
    title: 'Object Database',
    titleBn: 'অবজেক্ট ডাটাবেস',
    subtitle: 'Object Database — internals lesson',
    subtitleBn: 'অবজেক্ট ডাটাবেস — ইন্টারনালস পাঠ',
    keywords: ['git object database', '.git objects', 'where git stores', 'content addressed storage'],
    route: '/learn/git/storage-maintenance/object-database',
  },
  {
    id: 'git.internals.search.explorer',
    title: 'Git Internals Explorer',
    titleBn: 'গিট ইন্টারনালস এক্সপ্লোরার',
    subtitle: 'Interactive object graph and pointer tracer',
    subtitleBn: 'ইন্টারেক্টিভ অবজেক্ট গ্রাফ ও পয়েন্টার ট্রেসার',
    keywords: ['internals explorer', 'object graph', 'follow the pointer', 'git mental model', 'plumbing commands'],
    route: '/git/internals',
  },
  {
    id: 'git.internals.search.dag',
    title: 'Commit Graph & DAG',
    titleBn: 'কমিট গ্রাফ ও DAG',
    subtitle: 'DAG Structure — internals lesson',
    subtitleBn: 'DAG কাঠামো — ইন্টারনালস পাঠ',
    keywords: ['dag', 'directed acyclic graph', 'commit graph', 'why history branches'],
    route: '/learn/git/commit-history/dag-structure',
  },
];
