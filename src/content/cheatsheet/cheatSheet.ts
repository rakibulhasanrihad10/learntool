/**
 * Cheat Sheet metadata — a curated quick-reference layer (Phase 15).
 *
 * The Command Encyclopedia (GIT_COMMANDS) remains the source of truth:
 * entries reference existing command/lesson/guide ids and routes are
 * resolved, never duplicated. Snippet lines are exact, valid Git syntax
 * (always English, never translated); only purposes and notes are bilingual.
 *
 * Omitted deliberately: stash and tag references — no stash/tag commands
 * exist in the encyclopedia, and this layer invents no content.
 */
import { LocalText } from '@/types/content';

export type CheatEntry =
  /** Full encyclopedia reference: syntax, purpose, and detail link resolve. */
  | { kind: 'command'; commandId: string }
  /**
   * One exact command line (variant or composition). Must be valid Git.
   * Links point at the closest existing command/lesson/guide.
   */
  | {
      kind: 'snippet';
      command: string;
      purpose: LocalText;
      caveat?: LocalText;
      linkCommandId?: string;
      linkLessonId?: string;
      linkGuideId?: string;
    };

export interface CheatSheetSection {
  id: string;
  title: LocalText;
  description: LocalText;
  entries: CheatEntry[];
  /** Deeper learning destination for the section. */
  learnRoute: string;
  learnLabel: LocalText;
}

export interface QuickAction {
  id: string;
  intent: LocalText;
  /** Exact command text shown (and copied). */
  command: string;
  route: string;
}

const L = (en: string, bn: string): LocalText => ({ en, bn });

export const CHEAT_SHEET_SECTIONS: CheatSheetSection[] = [
  {
    id: 'setup',
    title: L('Repository Setup', 'রিপোজিটরি সেটআপ'),
    description: L('Start or copy a repository.', 'রিপোজিটরি শুরু বা কপি করুন।'),
    learnRoute: '/learn/git/fundamentals',
    learnLabel: L('Learn repositories', 'রিপোজিটরি শিখুন'),
    entries: [
      { kind: 'command', commandId: 'git.init' },
      { kind: 'command', commandId: 'git.clone' },
      { kind: 'command', commandId: 'git.config' },
      {
        kind: 'snippet',
        command: 'git config --global user.name "Your Name"',
        purpose: L('Set the author name on your commits.', 'কমিটে লেখকের নাম সেট করুন।'),
      },
      {
        kind: 'snippet',
        command: 'git config --global user.email "you@example.com"',
        purpose: L('Set the author email on your commits.', 'কমিটে লেখকের ইমেইল সেট করুন।'),
      },
    ],
  },
  {
    id: 'everyday',
    title: L('Everyday Workflow', 'দৈনন্দিন প্রবাহ'),
    description: L('The loop you repeat all day: inspect, stage, commit, share.', 'সারাদিনের চক্র: দেখুন, স্টেজ, কমিট, শেয়ার।'),
    learnRoute: '/workflows/everyday-git',
    learnLabel: L('Learn the everyday workflow', 'দৈনন্দিন প্রবাহ শিখুন'),
    entries: [
      { kind: 'command', commandId: 'git.status' },
      {
        kind: 'snippet',
        command: 'git add <file>',
        purpose: L('Stage one file precisely — prefer this over git add .', 'একটি ফাইল নির্ভুল স্টেজ করুন — git add . এর চেয়ে এটাই ভালো।'),
        linkCommandId: 'git.add',
      },
      {
        kind: 'snippet',
        command: 'git commit -m "message"',
        purpose: L('Seal staged changes with a clear message.', 'স্পষ্ট বার্তায় স্টেজড পরিবর্তন সিল করুন।'),
        linkCommandId: 'git.commit',
      },
      { kind: 'command', commandId: 'git.push' },
      {
        kind: 'snippet',
        command: 'git stash push -m "wip"',
        purpose: L('Shelve mid-edit work to switch context safely.', 'নিরাপদে প্রসঙ্গ বদলাতে এডিটের মাঝে কাজ তাকে তুলুন।'),
        linkCommandId: 'git.stash',
      },
      {
        kind: 'snippet',
        command: 'git stash pop',
        purpose: L('Restore the newest stash and drop it from the stack.', 'সর্বশেষ স্ট্যাশ ফিরিয়ে স্ট্যাক থেকে সরান।'),
        linkCommandId: 'git.stash',
      },
    ],
  },
  {
    id: 'inspect',
    title: L('Inspect & Review', 'নিরীক্ষণ ও পর্যালোচনা'),
    description: L('Read changes and history before acting.', 'কাজের আগে পরিবর্তন ও হিস্ট্রি পড়ুন।'),
    learnRoute: '/learn/git/everyday-workflow',
    learnLabel: L('Learn inspection', 'নিরীক্ষণ শিখুন'),
    entries: [
      { kind: 'command', commandId: 'git.diff' },
      {
        kind: 'snippet',
        command: 'git diff --staged',
        purpose: L('Review exactly what the next commit will contain.', 'পরের কমিটে ঠিক কী থাকবে তা পর্যালোচনা করুন।'),
        linkCommandId: 'git.diff',
      },
      { kind: 'command', commandId: 'git.log' },
      {
        kind: 'snippet',
        command: 'git log --oneline',
        purpose: L('Compact one-line-per-commit history.', 'প্রতি কমিটে এক লাইনে সংক্ষিপ্ত হিস্ট্রি।'),
        linkCommandId: 'git.log',
      },
      {
        kind: 'snippet',
        command: 'git log --graph --oneline --all',
        purpose: L('Branching history as an ASCII graph.', 'ASCII গ্রাফে ব্রাঞ্চিং হিস্ট্রি।'),
        linkCommandId: 'git.log',
      },
      { kind: 'command', commandId: 'git.show' },
    ],
  },
  {
    id: 'branching',
    title: L('Branching', 'ব্রাঞ্চিং'),
    description: L('Isolate work on movable pointers.', 'চলমান পয়েন্টারে কাজ আলাদা করুন।'),
    learnRoute: '/learn/git/branching',
    learnLabel: L('Learn branching', 'ব্রাঞ্চিং শিখুন'),
    entries: [
      { kind: 'command', commandId: 'git.branch' },
      {
        kind: 'snippet',
        command: 'git switch -c <name>',
        purpose: L('Create and move to a new branch in one step.', 'এক ধাপে নতুন ব্রাঞ্চ তৈরি ও যান।'),
        linkCommandId: 'git.switch',
      },
      { kind: 'command', commandId: 'git.switch' },
      {
        kind: 'snippet',
        command: 'git branch -d <name>',
        purpose: L('Safely delete a fully merged branch.', 'সম্পূর্ণ মার্জড ব্রাঞ্চ নিরাপদে মুছুন।'),
        linkCommandId: 'git.branch',
      },
      {
        kind: 'snippet',
        command: 'git branch -D <name>',
        purpose: L('Force-delete a branch, merged or not.', 'মার্জ হোক বা না হোক, জোর করে মুছুন।'),
        caveat: L('Unmerged work on the branch becomes hard to find.', 'ব্রাঞ্চের অমার্জড কাজ খুঁজে পাওয়া কঠিন হয়।'),
        linkCommandId: 'git.branch',
        linkGuideId: 'git.troubleshooting.deleted-branch',
      },
      {
        kind: 'snippet',
        command: 'git branch -a',
        purpose: L('List local and remote-tracking branches.', 'লোকাল ও রিমোট-ট্র্যাকিং ব্রাঞ্চ তালিকা করুন।'),
        linkCommandId: 'git.branch',
      },
    ],
  },
  {
    id: 'staging',
    title: L('Staging & Committing', 'স্টেজিং ও কমিট'),
    description: L('Curate precise commits.', 'নির্ভুল কমিট সাজান।'),
    learnRoute: '/learn/git/fundamentals',
    learnLabel: L('Learn staging', 'স্টেজিং শিখুন'),
    entries: [
      { kind: 'command', commandId: 'git.add' },
      { kind: 'command', commandId: 'git.restore' },
      {
        kind: 'snippet',
        command: 'git restore --staged <file>',
        purpose: L('Unstage a file without touching its changes.', 'পরিবর্তন না ছুঁয়ে ফাইল আনস্টেজ করুন।'),
        linkCommandId: 'git.restore',
        linkGuideId: 'git.troubleshooting.staged-file',
      },
      { kind: 'command', commandId: 'git.commit' },
      {
        kind: 'snippet',
        command: 'git commit --amend',
        purpose: L('Fold new staged work into the last commit.', 'নতুন স্টেজড কাজ শেষ কমিটে যোগ করুন।'),
        caveat: L('Only amend commits you have not pushed yet.', 'শুধু পুশ না-করা কমিট সংশোধন করুন।'),
        linkCommandId: 'git.commit',
      },
    ],
  },
  {
    id: 'remote',
    title: L('Remote Repositories', 'রিমোট রিপোজিটরি'),
    description: L('Share history with a server. origin is a convention, not a keyword.', 'সার্ভারে হিস্ট্রি শেয়ার করুন। origin প্রথা, কীওয়ার্ড নয়।'),
    learnRoute: '/learn/git/remote-and-github',
    learnLabel: L('Learn remotes', 'রিমোট শিখুন'),
    entries: [
      { kind: 'command', commandId: 'git.remote' },
      {
        kind: 'snippet',
        command: 'git remote -v',
        purpose: L('Show the URLs your remotes point to.', 'রিমোট কোন URL-এ দেখায় তা দেখুন।'),
        linkCommandId: 'git.remote',
      },
      {
        kind: 'snippet',
        command: 'git remote add origin <url>',
        purpose: L('Connect your repository to a server.', 'রিপোজিটরি সার্ভারে সংযুক্ত করুন।'),
        linkCommandId: 'git.remote',
      },
      { kind: 'command', commandId: 'git.fetch' },
      {
        kind: 'snippet',
        command: 'git fetch origin',
        purpose: L('Download remote work without changing your branches.', 'ব্রাঞ্চ না বদলে রিমোট কাজ ডাউনলোড করুন।'),
        linkCommandId: 'git.fetch',
      },
      { kind: 'command', commandId: 'git.pull' },
      {
        kind: 'snippet',
        command: 'git pull --ff-only origin main',
        purpose: L('Integrate only when history moves straight — never force a merge.', 'হিস্ট্রি সোজা এগোলেই একীভূত করুন — জোর করে মার্জ নয়।'),
        linkCommandId: 'git.pull',
      },
      {
        kind: 'snippet',
        command: 'git push -u origin main',
        purpose: L('Publish and remember the upstream for next time.', 'প্রকাশ করুন ও পরের জন্য upstream মনে রাখুন।'),
        linkCommandId: 'git.push',
      },
    ],
  },
  {
    id: 'merge-rebase',
    title: L('Merge & Rebase', 'মার্জ ও রিবেস'),
    description: L('Join lines of work — or replay yours on top.', 'কাজের লাইন জোড়া দিন — বা আপনারটা ওপরে রিপ্লে করুন।'),
    learnRoute: '/learn/git/merging',
    learnLabel: L('Learn merging', 'মার্জিং শিখুন'),
    entries: [
      { kind: 'command', commandId: 'git.merge' },
      {
        kind: 'snippet',
        command: 'git merge <branch>',
        purpose: L('Join another branch into the current one.', 'অন্য ব্রাঞ্চ বর্তমানে জোড়া দিন।'),
        linkCommandId: 'git.merge',
        linkGuideId: 'git.troubleshooting.merge-conflict',
      },
      { kind: 'command', commandId: 'git.rebase' },
      {
        kind: 'snippet',
        command: 'git rebase <branch>',
        purpose: L('Replay private commits onto a fresh base.', 'ব্যক্তিগত কমিট নতুন বেসে রিপ্লে করুন।'),
        caveat: L('Only rebase branches nobody else shares.', 'শুধু নিজের অব্যবহৃত ব্রাঞ্চ রিবেস করুন।'),
        linkCommandId: 'git.rebase',
        linkGuideId: 'git.troubleshooting.rebase-conflict',
      },
    ],
  },
  {
    id: 'undo',
    title: L('Undo & Recovery', 'আনডু ও রিকভারি'),
    description: L('Fix mistakes at the right level of force.', 'সঠিক মাত্রায় ভুল ঠিক করুন।'),
    learnRoute: '/learn/git/undo-and-recovery',
    learnLabel: L('Learn recovery', 'রিকভারি শিখুন'),
    entries: [
      {
        kind: 'snippet',
        command: 'git restore <file>',
        purpose: L('Discard unstaged file changes.', 'আনস্টেজড ফাইল পরিবর্তন বাতিল করুন।'),
        linkCommandId: 'git.restore',
        linkGuideId: 'git.troubleshooting.deleted-changes',
      },
      {
        kind: 'snippet',
        command: 'git reset --soft HEAD~1',
        purpose: L('Undo the last commit, keep everything staged.', 'শেষ কমিট আনডু করুন, সব স্টেজড রাখুন।'),
        linkCommandId: 'git.reset',
        linkGuideId: 'git.troubleshooting.undo-last-commit',
      },
      { kind: 'command', commandId: 'git.reset' },
      {
        kind: 'snippet',
        command: 'git reset --hard HEAD~1',
        purpose: L('Discard the last commit and all its changes.', 'শেষ কমিট ও সব পরিবর্তন বাতিল করুন।'),
        caveat: L('Destroyed work is only recoverable via reflog — and only for a while.', 'মোছা কাজ শুধু reflog-এ উদ্ধারযোগ্য — তাও কিছুদিন।'),
        linkCommandId: 'git.reset',
        linkGuideId: 'git.troubleshooting.reset-hard',
      },
      {
        kind: 'snippet',
        command: 'git revert HEAD',
        purpose: L('Safely undo a pushed commit with a new commit.', 'নতুন কমিটে পুশড কমিট নিরাপদে আনডু করুন।'),
        linkCommandId: 'git.revert',
        linkGuideId: 'git.troubleshooting.undo-last-commit',
      },
      { kind: 'command', commandId: 'git.revert' },
      { kind: 'command', commandId: 'git.reflog' },
    ],
  },
  {
    id: 'github',
    title: L('GitHub Workflow', 'গিটহাব প্রবাহ'),
    description: L('Fork, branch, propose, review, merge.', 'ফোর্ক, ব্রাঞ্চ, প্রস্তাব, রিভিউ, মার্জ।'),
    learnRoute: '/workflows/github-pr',
    learnLabel: L('Learn the PR workflow', 'PR প্রবাহ শিখুন'),
    entries: [
      {
        kind: 'snippet',
        command: 'git clone <fork-url>',
        purpose: L('Copy your fork to this machine.', 'ফোর্ক এই মেশিনে কপি করুন।'),
        linkCommandId: 'git.clone',
      },
      {
        kind: 'snippet',
        command: 'git remote add upstream <url>',
        purpose: L('Track the original project alongside your fork.', 'ফোর্কের পাশে মূল প্রজেক্ট ট্র্যাক করুন।'),
        linkCommandId: 'git.remote',
        linkLessonId: 'github.basics.origin-and-upstream',
      },
      {
        kind: 'snippet',
        command: 'git fetch upstream',
        purpose: L('Download the latest from the original project.', 'মূল প্রজেক্টের সর্বশেষ ডাউনলোড করুন।'),
        linkCommandId: 'git.fetch',
      },
      {
        kind: 'snippet',
        command: 'git push origin <branch>',
        purpose: L('Publish your branch, then open a pull request.', 'ব্রাঞ্চ প্রকাশ করে পুল রিকোয়েস্ট খুলুন।'),
        linkCommandId: 'git.push',
        linkLessonId: 'github.pr.create-pull-request',
      },
    ],
  },
  {
    id: 'internals',
    title: L('Advanced / Internals', 'অ্যাডভান্সড / ইন্টারনালস'),
    description: L('Inspect what Git actually stores.', 'গিট আসলে কী সংরক্ষণ করে তা দেখুন।'),
    learnRoute: '/git/internals',
    learnLabel: L('Explore internals', 'ইন্টারনালস ঘুরুন'),
    entries: [
      { kind: 'command', commandId: 'git.cat-file' },
      {
        kind: 'snippet',
        command: 'git cat-file -p <hash>',
        purpose: L('Pretty-print any object by its hash.', 'হ্যাশে যেকোনো অবজেক্ট সুন্দর করে দেখুন।'),
        linkCommandId: 'git.cat-file',
      },
      { kind: 'command', commandId: 'git.count-objects' },
      {
        kind: 'snippet',
        command: 'git count-objects -vH',
        purpose: L('Report object-store size in human-readable form.', 'অবজেক্ট-স্টোর আকার মানব-পাঠযোগ্য রূপে রিপোর্ট করুন।'),
        linkCommandId: 'git.count-objects',
      },
      { kind: 'command', commandId: 'git.gc' },
      { kind: 'command', commandId: 'git.tag' },
      {
        kind: 'snippet',
        command: 'git tag -a v1.0.0 -m "Release"',
        purpose: L('Mark this commit as an annotated release.', 'এই কমিট অ্যানোটেটেড রিলিজে চিহ্নিত করুন।'),
        linkCommandId: 'git.tag',
      },
      {
        kind: 'snippet',
        command: 'git push origin v1.0.0',
        purpose: L('Publish the tag — plain push never sends tags.', 'ট্যাগ প্রকাশ করুন — সাধারণ পুশ ট্যাগ পাঠায় না।'),
        linkCommandId: 'git.tag',
      },
    ],
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'qa-init', intent: L('Start a repository', 'রিপোজিটরি শুরু'), command: 'git init', route: '/commands/git/init' },
  { id: 'qa-clone', intent: L('Clone a repository', 'রিপোজিটরি ক্লোন'), command: 'git clone <url>', route: '/commands/git/clone' },
  { id: 'qa-status', intent: L('Check changes', 'পরিবর্তন দেখুন'), command: 'git status', route: '/commands/git/status' },
  { id: 'qa-stage', intent: L('Stage changes', 'পরিবর্তন স্টেজ'), command: 'git add <file>', route: '/commands/git/add' },
  { id: 'qa-commit', intent: L('Commit changes', 'পরিবর্তন কমিট'), command: 'git commit -m "message"', route: '/commands/git/commit' },
  { id: 'qa-branch', intent: L('Create a branch', 'ব্রাঞ্চ তৈরি'), command: 'git switch -c <name>', route: '/commands/git/switch' },
  { id: 'qa-switch', intent: L('Switch branches', 'ব্রাঞ্চ বদলান'), command: 'git switch <name>', route: '/commands/git/switch' },
  { id: 'qa-push', intent: L('Push changes', 'পরিবর্তন পুশ'), command: 'git push', route: '/commands/git/push' },
  { id: 'qa-fetch', intent: L('Fetch remote changes', 'রিমোট পরিবর্তন আনুন'), command: 'git fetch origin', route: '/commands/git/fetch' },
  { id: 'qa-pull', intent: L('Pull changes', 'পরিবর্তন পুল'), command: 'git pull', route: '/commands/git/pull' },
  { id: 'qa-merge', intent: L('Merge a branch', 'ব্রাঞ্চ মার্জ'), command: 'git merge <branch>', route: '/commands/git/merge' },
  { id: 'qa-rebase', intent: L('Rebase a branch', 'ব্রাঞ্চ রিবেস'), command: 'git rebase <branch>', route: '/commands/git/rebase' },
  { id: 'qa-undo', intent: L('Undo a commit', 'কমিট আনডু'), command: 'git reset --soft HEAD~1', route: '/troubleshooting/git/undo-last-commit' },
  { id: 'qa-stash', intent: L('Shelve changes', 'পরিবর্তন সরিয়ে রাখুন'), command: 'git stash push -m "wip"', route: '/commands/git/stash' },
  { id: 'qa-recover', intent: L('Recover lost work', 'হারানো কাজ উদ্ধার'), command: 'git reflog', route: '/troubleshooting/git/recover-commit' },
  { id: 'qa-pr', intent: L('Work with GitHub', 'গিটহাবে কাজ'), command: 'git push origin <branch>', route: '/workflows/github-pr' },
];
