/**
 * Cheat Sheet collections: workflow recipes, comparisons, undo situations.
 * All routes reference existing pages; all guide/lesson ids are verified
 * against the current catalogs.
 */
import { LocalText } from '@/types/content';

const L = (en: string, bn: string): LocalText => ({ en, bn });

export interface WorkflowRecipe {
  id: string;
  title: LocalText;
  lines: string[];
  note?: LocalText;
  route: string;
}

export const WORKFLOW_RECIPES: WorkflowRecipe[] = [
  {
    id: 'recipe-daily',
    title: L('Daily workflow', 'দৈনন্দিন প্রবাহ'),
    lines: ['git status', 'git add <file>', 'git commit -m "message"', 'git push'],
    note: L(
      'Stage files individually — git add . stages surprises too.',
      'ফাইল আলাদা স্টেজ করুন — git add . অপ্রত্যাশিতও স্টেজ করে।'
    ),
    route: '/workflows/everyday-git',
  },
  {
    id: 'recipe-feature',
    title: L('Create a feature branch', 'ফিচার ব্রাঞ্চ তৈরি'),
    lines: ['git fetch origin', 'git switch -c feature/my-feature'],
    note: L('Fetch first so the branch starts from fresh history.', 'আগে fetch করুন যাতে ব্রাঞ্চ নতুন হিস্ট্রি থেকে শুরু হয়।'),
    route: '/learn/git/branching',
  },
  {
    id: 'recipe-update',
    title: L('Update your local branch', 'লোকাল ব্রাঞ্চ হালনাগাদ'),
    lines: ['git fetch origin', 'git switch main', 'git pull --ff-only origin main'],
    note: L('--ff-only refuses to invent a merge when history diverged.', 'হিস্ট্রি ডাইভার্জ হলে --ff-only মার্জ বানাতে অস্বীকার করে।'),
    route: '/learn/git/remote-and-github',
  },
  {
    id: 'recipe-merge',
    title: L('Merge a feature', 'ফিচার মার্জ'),
    lines: ['git switch main', 'git pull', 'git merge feature/my-feature', 'git push'],
    note: L('Sync main before merging, so the merge includes the latest.', 'মার্জের আগে main সিঙ্ক করুন, যাতে সর্বশেষ অন্তর্ভুক্ত হয়।'),
    route: '/learn/git/merging',
  },
  {
    id: 'recipe-pr',
    title: L('Propose with a pull request', 'পুল রিকোয়েস্টে প্রস্তাব'),
    lines: ['git push -u origin feature/my-feature'],
    note: L('Then open the pull request on GitHub for review.', 'তারপর রিভিউয়ে গিটহাবে পুল রিকোয়েস্ট খুলুন।'),
    route: '/workflows/github-pr',
  },
];

export interface CommandComparison {
  id: string;
  title: LocalText;
  difference: LocalText;
  useA: LocalText;
  useB: LocalText;
  learnRoute: string;
}

export const COMMAND_COMPARISONS: CommandComparison[] = [
  {
    id: 'cmp-switch-checkout',
    title: L('git switch vs git checkout', 'git switch বনাম git checkout'),
    difference: L('switch only moves branches; checkout also restores files.', 'switch শুধু ব্রাঞ্চ বদলায়; checkout ফাইলও ফেরায়।'),
    useA: L('Use switch for everyday branch moves.', 'দৈনন্দিন ব্রাঞ্চ বদলে switch ব্যবহার করুন।'),
    useB: L('Use checkout only when you need its file-restoring forms.', 'ফাইল-ফেরানো রূপ দরকার হলেই checkout ব্যবহার করুন।'),
    learnRoute: '/learn/git/branching',
  },
  {
    id: 'cmp-restore-reset',
    title: L('git restore vs git reset', 'git restore বনাম git reset'),
    difference: L('restore targets files; reset moves branches and history.', 'restore ফাইলে কাজ করে; reset ব্রাঞ্চ ও হিস্ট্রি সরায়।'),
    useA: L('Use restore to unstage or discard file changes.', 'আনস্টেজ বা ফাইল পরিবর্তন বাতিলে restore ব্যবহার করুন।'),
    useB: L('Use reset when you mean to move the branch pointer.', 'ব্রাঞ্চ পয়েন্টার সরানোই উদ্দেশ্য হলে reset ব্যবহার করুন।'),
    learnRoute: '/learn/git/undo-and-recovery',
  },
  {
    id: 'cmp-reset-revert',
    title: L('git reset vs git revert', 'git reset বনাম git revert'),
    difference: L('reset rewrites history; revert adds a new undoing commit.', 'reset হিস্ট্রি পুনর্লেখে; revert নতুন আনডু কমিট যোগ করে।'),
    useA: L('Use reset for private, unpushed mistakes.', 'ব্যক্তিগত, পুশ-না-করা ভুলে reset ব্যবহার করুন।'),
    useB: L('Use revert for anything already pushed or shared.', 'পুশড বা শেয়ার্ড কিছুর জন্য revert ব্যবহার করুন।'),
    learnRoute: '/troubleshooting/git/undo-last-commit',
  },
  {
    id: 'cmp-fetch-pull',
    title: L('git fetch vs git pull', 'git fetch বনাম git pull'),
    difference: L('fetch only downloads; pull downloads and integrates.', 'fetch শুধু ডাউনলোড করে; pull ডাউনলোড ও একীভূত করে।'),
    useA: L('Use fetch to look before you integrate.', 'একীভূতের আগে দেখতে fetch ব্যবহার করুন।'),
    useB: L('Use pull when you are ready to merge or fast-forward now.', 'এখনই মার্জ বা ফাস্ট-ফরোয়ার্ডে প্রস্তুত হলে pull ব্যবহার করুন।'),
    learnRoute: '/learn/git/remote-and-github',
  },
  {
    id: 'cmp-merge-rebase',
    title: L('git merge vs git rebase', 'git merge বনাম git rebase'),
    difference: L('merge joins histories; rebase replays yours onto a new base.', 'merge হিস্ট্রি জোড়া দেয়; rebase আপনারটা নতুন বেসে রিপ্লে করে।'),
    useA: L('Use merge to preserve the true shared story.', 'সত্য শেয়ার্ড গল্প সংরক্ষণে merge ব্যবহার করুন।'),
    useB: L('Use rebase for private branches you want linear.', 'লিনিয়ার চাওয়া ব্যক্তিগত ব্রাঞ্চে rebase ব্যবহার করুন।'),
    learnRoute: '/learn/git/rebasing',
  },
  {
    id: 'cmp-origin-upstream',
    title: L('origin vs upstream', 'origin বনাম upstream'),
    difference: L('origin is usually your fork; upstream is the original project.', 'origin সাধারণত আপনার ফোর্ক; upstream মূল প্রজেক্ট।'),
    useA: L('Push your work to origin.', 'কাজ origin-এ পুশ করুন।'),
    useB: L('Fetch updates from upstream.', 'upstream থেকে হালনাগাদ আনুন।'),
    learnRoute: '/learn/github/basics',
  },
];

export interface UndoSituation {
  id: string;
  situation: LocalText;
  command: string;
  explanation: LocalText;
  guideId: string;
}

export const UNDO_SITUATIONS: UndoSituation[] = [
  {
    id: 'undo-staged-wrong',
    situation: L('I staged the wrong file.', 'ভুল ফাইল স্টেজ করেছি।'),
    command: 'git restore --staged <file>',
    explanation: L('Unstages the file; its changes stay in your worktree.', 'ফাইল আনস্টেজ করে; পরিবর্তন ওয়ার্কট্রিতে থাকে।'),
    guideId: 'git.troubleshooting.staged-file',
  },
  {
    id: 'undo-unstage',
    situation: L('I want to unstage a file.', 'ফাইল আনস্টেজ করতে চাই।'),
    command: 'git restore --staged <file>',
    explanation: L('The safe inverse of staging — nothing is deleted.', 'স্টেজিংয়ের নিরাপদ বিপরীত — কিছু মোছে না।'),
    guideId: 'git.troubleshooting.staged-file',
  },
  {
    id: 'undo-discard-file',
    situation: L('I changed a file and want to discard the changes.', 'ফাইল বদলে পরিবর্তন বাতিল করতে চাই।'),
    command: 'git restore <file>',
    explanation: L('Throws away unstaged changes in that file.', 'ফাইলের আনস্টেজড পরিবর্তন ফেলে দেয়।'),
    guideId: 'git.troubleshooting.deleted-changes',
  },
  {
    id: 'undo-latest-keep',
    situation: L('I want to undo the latest commit but keep changes.', 'শেষ কমিট আনডু করে পরিবর্তন রাখতে চাই।'),
    command: 'git reset --soft HEAD~1',
    explanation: L('Moves the branch back; work stays staged.', 'ব্রাঞ্চ পিছিয়ে দেয়; কাজ স্টেজড থাকে।'),
    guideId: 'git.troubleshooting.undo-last-commit',
  },
  {
    id: 'undo-pushed',
    situation: L('I want to undo a commit safely after pushing.', 'পুশের পর নিরাপদে কমিট আনডু করতে চাই।'),
    command: 'git revert HEAD',
    explanation: L('Adds a new commit that undoes the old one.', 'পুরনোটা আনডু করা নতুন কমিট যোগ করে।'),
    guideId: 'git.troubleshooting.undo-last-commit',
  },
  {
    id: 'undo-deleted-branch',
    situation: L('I accidentally deleted a branch.', 'ভুলে ব্রাঞ্চ মুছে ফেলেছি।'),
    command: 'git reflog',
    explanation: L('Find the tip hash, then recreate the branch there.', 'টিপ হ্যাশ খুঁজে সেখানে ব্রাঞ্চ পুনর্গঠন করুন।'),
    guideId: 'git.troubleshooting.deleted-branch',
  },
  {
    id: 'undo-lost-commit',
    situation: L('I lost a commit.', 'কমিট হারিয়ে ফেলেছি।'),
    command: 'git reflog',
    explanation: L('Every moved HEAD position is listed — follow the trail.', 'HEAD-এর প্রতিটি অবস্থান তালিকাভুক্ত — সূত্র ধরুন।'),
    guideId: 'git.troubleshooting.recover-commit',
  },
  {
    id: 'undo-pushed-wrong',
    situation: L('I pushed the wrong commit.', 'ভুল কমিট পুশ করেছি।'),
    command: 'git revert HEAD',
    explanation: L('Revert publicly, push the fix, tell the team.', 'প্রকাশ্যে revert করুন, ফিক্স পুশ করে টিমকে জানান।'),
    guideId: 'git.troubleshooting.undo-last-commit',
  },
  {
    id: 'undo-reflog',
    situation: L('I need to recover using reflog.', 'reflog দিয়ে উদ্ধার দরকার।'),
    command: 'git reflog',
    explanation: L('Your safety net: recent HEAD positions with hashes.', 'নিরাপত্তা জাল: হ্যাশসহ সাম্প্রতিক HEAD অবস্থান।'),
    guideId: 'git.troubleshooting.recover-commit',
  },
];
