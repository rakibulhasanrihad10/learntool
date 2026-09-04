import { LangText } from '@/features/simulation/models';

/**
 * Pull Request simulator — deterministic, client-side only.
 *
 * Models the GitHub collaboration loop (never real Git, never network):
 * branch → commits → push → PR (draft/open) → review → changes →
 * fix → approve → merge → sync. No GitHub account, no API.
 */

export type PrStatus =
  | 'none'
  | 'draft'
  | 'open'
  | 'changes-requested'
  | 'updated'
  | 'approved'
  | 'merged'
  | 'closed';

export interface PrComment {
  id: string;
  author: 'reviewer' | 'you';
  kind: 'praise' | 'suggestion' | 'blocker';
  text: LangText;
  resolved: boolean;
}

export interface PrCheck {
  id: string;
  name: string;
  status: 'pending' | 'pass' | 'fail';
}

export interface PrSimState {
  mainSynced: boolean;
  branchCreated: boolean;
  commits: number;
  pushed: boolean;
  prStatus: PrStatus;
  comments: PrComment[];
  checks: PrCheck[];
  localMainSynced: boolean;
  seq: number;
}

export const PR_INITIAL_STATE: PrSimState = {
  mainSynced: false,
  branchCreated: false,
  commits: 0,
  pushed: false,
  prStatus: 'none',
  comments: [],
  checks: [],
  localMainSynced: false,
  seq: 1,
};

export type PrActionType =
  | 'sync-main'
  | 'create-branch'
  | 'commit'
  | 'push'
  | 'open-draft'
  | 'open-pr'
  | 'mark-ready'
  | 'add-comment'
  | 'request-changes'
  | 'push-fix'
  | 'approve'
  | 'merge'
  | 'sync-local'
  | 'close-pr';

export interface PrAction {
  type: PrActionType;
}

export interface PrTerminal {
  command: string;
  outputEn: string;
  outputBn: string;
}

export interface PrResult {
  ok: boolean;
  title: LangText;
  detail: LangText;
  terminal: PrTerminal;
}

const txt = (en: string, bn: string): LangText => ({ en, bn });

function clone(s: PrSimState): PrSimState {
  return {
    ...s,
    comments: s.comments.map((c) => ({ ...c, text: { ...c.text } })),
    checks: s.checks.map((c) => ({ ...c })),
  };
}

function fail(command: string, title: LangText, detail: LangText): { state: PrSimState; result: PrResult } {
  // state is filled in by the caller (applyPrAction returns previous state)
  return {
    state: null as unknown as PrSimState,
    result: { ok: false, title, detail, terminal: { command, outputEn: title.en, outputBn: title.bn } },
  };
}

const PASS_CHECKS: PrCheck[] = [
  { id: 'tests', name: 'Tests', status: 'pass' },
  { id: 'lint', name: 'Lint', status: 'pass' },
  { id: 'build', name: 'Build', status: 'pass' },
];

/**
 * Apply one PR simulator action. Pure: never mutates input, no side effects.
 * Invalid actions return ok:false with a teaching explanation.
 */
export function applyPrAction(prev: PrSimState, action: PrAction): { state: PrSimState; result: PrResult } {
  switch (action.type) {
    case 'sync-main': {
      if (prev.mainSynced) {
        return { state: prev, result: { ok: true, title: txt('main is already in sync.', 'main ইতিমধ্যে সিঙ্কড।'), detail: txt('Nothing new arrived since your last sync.', 'শেষ সিঙ্কের পর নতুন কিছু আসেনি।'), terminal: { command: 'git switch main && git pull', outputEn: 'Already up to date.', outputBn: 'ইতিমধ্যে হালনাগাদ।' } } };
      }
      const state = clone(prev);
      state.mainSynced = true;
      return {
        state,
        result: {
          ok: true,
          title: txt('main is now in sync with the team.', 'main এখন টিমের সাথে সিঙ্কড।'),
          detail: txt('You fetched and integrated the latest main. Every branch you create from here starts fresh — stale bases cause most PR conflicts.', 'সর্বশেষ main fetch ও একীভূত করেছেন। এখান থেকে তৈরি প্রতিটি ব্রাঞ্চ নতুন শুরু করে — পুরনো বেসই বেশিরভাগ PR কনফ্লিক্টের কারণ।'),
          terminal: { command: 'git switch main && git pull', outputEn: 'Updating a1b2c3d..e4f5a6b\nFast-forward', outputBn: 'আপডেট হচ্ছে a1b2c3d..e4f5a6b\nFast-forward' },
        },
      };
    }
    case 'create-branch': {
      if (!prev.mainSynced) {
        const f = fail('git switch -c feature/login', txt('Sync main first.', 'আগে main সিঙ্ক করুন।'), txt('Branching from a stale main bakes conflicts into your PR before you write a line. Sync, then branch.', 'পুরনো main থেকে ব্রাঞ্চ করলে এক লাইন লেখার আগেই PR-এ কনফ্লিক্ট ঢোকে। সিঙ্ক করে তারপর ব্রাঞ্চ করুন।'));
        return { state: prev, result: f.result };
      }
      if (prev.branchCreated) {
        const f = fail('git switch -c feature/login', txt('The branch already exists.', 'ব্রাঞ্চ ইতিমধ্যে আছে।'), txt('You are already working on feature/login.', 'আপনি ইতিমধ্যে feature/login-এ কাজ করছেন।'));
        return { state: prev, result: f.result };
      }
      const state = clone(prev);
      state.branchCreated = true;
      return {
        state,
        result: {
          ok: true,
          title: txt('Created feature/login from fresh main.', 'নতুন main থেকে feature/login তৈরি।'),
          detail: txt('One branch, one reviewable unit of work. Nothing is shared yet — branching is local and free.', 'এক ব্রাঞ্চ, একটি রিভিউযোগ্য কাজ। এখনো কিছু শেয়ার হয়নি — ব্রাঞ্চিং লোকাল ও বিনামূল্য।'),
          terminal: { command: 'git switch -c feature/login', outputEn: "Switched to a new branch 'feature/login'", outputBn: "নতুন ব্রাঞ্চ 'feature/login'-এ যাওয়া হয়েছে" },
        },
      };
    }
    case 'commit': {
      if (!prev.branchCreated) {
        const f = fail('git commit -m "Add login form"', txt('Create the branch first.', 'আগে ব্রাঞ্চ তৈরি করুন।'), txt('Commits need a home. Create feature/login, then commit there.', 'কমিটের ঠিকানা দরকার। feature/login তৈরি করে সেখানে কমিট করুন।'));
        return { state: prev, result: f.result };
      }
      const state = clone(prev);
      state.commits += 1;
      state.pushed = false;
      return {
        state,
        result: {
          ok: true,
          title: txt(`Committed change #${state.commits} on feature/login.`, `feature/login-এ ${state.commits} নম্বর পরিবর্তন কমিট।`),
          detail: txt('Small, logical commits make review fast: each one should be understandable on its own.', 'ছোট, যৌক্তিক কমিট রিভিউ দ্রুত করে: প্রতিটি নিজে বোধগম্য হওয়া উচিত।'),
          terminal: { command: 'git add -p && git commit -m "Add login form"', outputEn: `[feature/login c${state.seq + 10}d4e5f] Add login form\n 1 file changed`, outputBn: `[feature/login c${state.seq + 10}d4e5f] Add login form\n 1টি ফাইল পরিবর্তিত` },
        },
      };
    }
    case 'push': {
      if (!prev.branchCreated || prev.commits === 0) {
        const f = fail('git push -u origin feature/login', txt('Nothing to push yet.', 'পুশ করার মতো এখনো কিছু নেই।'), txt('Create the branch and commit at least one change first.', 'আগে ব্রাঞ্চ তৈরি করে অন্তত একটি পরিবর্তন কমিট করুন।'));
        return { state: prev, result: f.result };
      }
      if (prev.pushed) {
        const f = fail('git push -u origin feature/login', txt('Already pushed — no new commits.', 'ইতিমধ্যে পুশড — নতুন কমিট নেই।'), txt('Push again after your next commit.', 'পরের কমিটের পর আবার পুশ করুন।'));
        return { state: prev, result: f.result };
      }
      const state = clone(prev);
      state.pushed = true;
      return {
        state,
        result: {
          ok: true,
          title: txt('Branch published to GitHub.', 'ব্রাঞ্চ গিটহাবে প্রকাশিত।'),
          detail: txt('Pushing shares and backs up — it does not merge. Your work is now visible for review but main is untouched.', 'পুশ শেয়ার ও ব্যাকআপ করে — মার্জ করে না। কাজ এখন রিভিউয়ে দৃশ্যমান কিন্তু main অক্ষত।'),
          terminal: { command: 'git push -u origin feature/login', outputEn: '* [new branch] feature/login -> feature/login\nBranch set up to track origin/feature/login.', outputBn: '* [নতুন ব্রাঞ্চ] feature/login -> feature/login\norigin/feature/login ট্র্যাক সেট হয়েছে।' },
        },
      };
    }
    case 'open-draft':
    case 'open-pr': {
      const wantDraft = action.type === 'open-draft';
      if (!prev.pushed) {
        const f = fail(wantDraft ? 'Open draft pull request' : 'Open pull request', txt('Push the branch first.', 'আগে ব্রাঞ্চ পুশ করুন।'), txt('GitHub can only propose what it has received. Push, then open the PR.', 'গিটহাব শুধু পাওয়া জিনিস প্রস্তাব করতে পারে। পুশ করে PR খুলুন।'));
        return { state: prev, result: f.result };
      }
      if (prev.prStatus !== 'none') {
        const f = fail('Open pull request', txt('A pull request is already open.', 'পুল রিকোয়েস্ট ইতিমধ্যে খোলা।'), txt('Pushing more commits updates the existing PR automatically.', 'আরো কমিট পুশে বিদ্যমান PR স্বয়ংক্রিয় আপডেট হয়।'));
        return { state: prev, result: f.result };
      }
      const state = clone(prev);
      state.prStatus = wantDraft ? 'draft' : 'open';
      state.checks = PASS_CHECKS.map((c) => ({ ...c }));
      return {
        state,
        result: {
          ok: true,
          title: wantDraft ? txt('Draft pull request opened.', 'ড্রাফট পুল রিকোয়েস্ট খোলা হয়েছে।') : txt('Pull request opened for review.', 'রিভিউয়ে পুল রিকোয়েস্ট খোলা হয়েছে।'),
          detail: wantDraft
            ? txt('The draft says "not ready to merge yet" — and GitHub enforces it by disabling merge. Perfect for early direction feedback.', 'ড্রাফট বলে "এখনো মার্জের জন্য প্রস্তুত নয়" — গিটহাব মার্জ নিষ্ক্রিয় করে তা কার্যকর করে। আগাম দিকনির্দেশ মতামতে উপযুক্ত।')
            : txt('Reviewers are notified and automated checks start running. The base/compare header and diff decide how seriously it gets read.', 'রিভিউয়াররা জানতে পারেন ও স্বয়ংক্রিয় চেক চলতে শুরু করে। বেস/compare হেডার ও diff কত গুরুত্বে পড়া হবে ঠিক করে।'),
          terminal: { command: wantDraft ? 'gh pr create --draft' : 'gh pr create', outputEn: wantDraft ? 'Draft pull request #42 opened: feature/login → main' : 'Pull request #42 opened: feature/login → main\nChecks: Tests ✓ Lint ✓ Build ✓', outputBn: wantDraft ? 'ড্রাফট পুল রিকোয়েস্ট #42 খোলা হয়েছে' : 'পুল রিকোয়েস্ট #42 খোলা হয়েছে\nচেক: Tests ✓ Lint ✓ Build ✓' },
        },
      };
    }
    case 'mark-ready': {
      if (prev.prStatus !== 'draft') {
        const f = fail('Mark ready for review', txt('Only drafts can be marked ready.', 'শুধু ড্রাফট প্রস্তুত চিহ্নিত করা যায়।'), txt(prev.prStatus === 'none' ? 'Open a draft PR first.' : 'This PR already left draft state.', prev.prStatus === 'none' ? 'আগে ড্রাফট PR খুলুন।' : 'এই PR ইতিমধ্যে ড্রাফট অবস্থা পেরিয়েছে।'));
        return { state: prev, result: f.result };
      }
      const state = clone(prev);
      state.prStatus = 'open';
      return {
        state,
        result: {
          ok: true,
          title: txt('Marked ready for review.', 'রিভিউয়ে প্রস্তুত চিহ্নিত।'),
          detail: txt('Checks are green and the diff is complete — reviewers are now expected to engage.', 'চেক সবুজ ও diff সম্পূর্ণ — এখন রিভিউয়ারদের যুক্ত হওয়া প্রত্যাশিত।'),
          terminal: { command: 'Mark ready for review', outputEn: 'Pull request #42 is now open for review.', outputBn: 'পুল রিকোয়েস্ট #42 এখন রিভিউয়ে খোলা।' },
        },
      };
    }
    case 'add-comment': {
      if (prev.prStatus !== 'open' && prev.prStatus !== 'updated') {
        const f = fail('Reviewer comments', txt('Comments need an open PR.', 'মন্তব্যে খোলা PR দরকার।'), txt('Open (or mark ready) the pull request first.', 'আগে পুল রিকোয়েস্ট খুলুন (বা প্রস্তুত করুন)।'));
        return { state: prev, result: f.result };
      }
      const state = clone(prev);
      state.seq += 1;
      state.comments.push({
        id: `c${state.seq}`,
        author: 'reviewer',
        kind: 'praise',
        text: txt('Nice structure — the helper keeps both paths readable. One suggestion below.', 'সুন্দর কাঠামো — হেলপার দুটি পথ পাঠযোগ্য রেখেছে। নিচে একটি পরামর্শ।'),
        resolved: true,
      });
      return {
        state,
        result: {
          ok: true,
          title: txt('Reviewer left an encouraging comment.', 'রিভিউয়ার উৎসাহব্যঞ্জক মন্তব্য রেখেছেন।'),
          detail: txt('Not all feedback blocks. Praise and suggestions keep momentum while the real discussion continues.', 'সব মতামত আটকায় না। প্রশংসা ও পরামর্শ আসল আলোচনা চলতে গতিশীল রাখে।'),
          terminal: { command: 'Reviewer comment', outputEn: '💬 "Nice structure — one suggestion below."', outputBn: '💬 "সুন্দর কাঠামো — নিচে একটি পরামর্শ।"' },
        },
      };
    }
    case 'request-changes': {
      if (prev.prStatus !== 'open' && prev.prStatus !== 'updated') {
        const f = fail('Request changes', txt('There is no open PR to block.', 'আটকানোর মতো খোলা PR নেই।'), txt('Open the pull request first.', 'আগে পুল রিকোয়েস্ট খুলুন।'));
        return { state: prev, result: f.result };
      }
      const state = clone(prev);
      state.seq += 1;
      state.prStatus = 'changes-requested';
      state.comments.push({
        id: `c${state.seq}`,
        author: 'reviewer',
        kind: 'blocker',
        text: txt('Blocking: token expiry is hardcoded to 24h — please make it configurable with a test.', 'ব্লকিং: টোকেন মেয়াদ 24h হার্ডকোডড — কনফিগারযোগ্য করে টেস্টসহ দিন।'),
        resolved: false,
      });
      return {
        state,
        result: {
          ok: true,
          title: txt('Reviewer requested changes — merge is blocked.', 'রিভিউয়ার পরিবর্তন চেয়েছেন — মার্জ আটকে গেছে।'),
          detail: txt('Changes Requested is a brake, not a rejection. Exactly one thread blocks, with a clear reason and a path forward.', 'Changes Requested ব্রেক, প্রত্যাখ্যান নয়। ঠিক একটি থ্রেড আটকায়, স্পষ্ট কারণ ও পথসহ।'),
          terminal: { command: 'Request changes', outputEn: '⛔ Changes requested: 1 blocking thread\nMerge blocked until resolved.', outputBn: '⛔ পরিবর্তন চাওয়া হয়েছে: ১টি ব্লকিং থ্রেড\nসমাধান না হওয়া পর্যন্ত মার্জ আটকে।' },
        },
      };
    }
    case 'push-fix': {
      if (prev.prStatus !== 'changes-requested' && prev.prStatus !== 'open' && prev.prStatus !== 'updated') {
        const f = fail('Push fix commits', txt('There is nothing to fix yet.', 'ঠিক করার মতো এখনো কিছু নেই।'), txt('Fixes follow review feedback on an open PR.', 'ফিক্স খোলা PR-এ রিভিউ মতামতের পরে আসে।'));
        return { state: prev, result: f.result };
      }
      const blockers = prev.comments.filter((c) => c.kind === 'blocker' && !c.resolved);
      const state = clone(prev);
      state.commits += 1;
      state.pushed = true;
      state.prStatus = 'updated';
      state.checks = PASS_CHECKS.map((c) => ({ ...c }));
      for (const c of state.comments) {
        if (c.kind === 'blocker') c.resolved = true;
      }
      return {
        state,
        result: {
          ok: true,
          title: txt(`Pushed fix — PR updated (${blockers.length} thread${blockers.length === 1 ? '' : 's'} addressed).`, `ফিক্স পুশ — PR আপডেট (${blockers.length}টি থ্রেড সামলানো)।`),
          detail: txt('Fix commits land on the same branch, so the PR updates itself and checks re-run. Reviewers see exactly what changed since their last look.', 'ফিক্স কমিট একই ব্রাঞ্চে আসে, তাই PR নিজে আপডেট হয় ও চেক পুনরায় চলে। রিভিউয়াররা শেষ দেখার পর ঠিক কী বদলেছে দেখেন।'),
          terminal: { command: 'git commit -m "Make token expiry configurable" && git push', outputEn: 'PR #42 updated — 1 new commit\nChecks: Tests ✓ Lint ✓ Build ✓', outputBn: 'PR #42 আপডেট — ১টি নতুন কমিট\nচেক: Tests ✓ Lint ✓ Build ✓' },
        },
      };
    }
    case 'approve': {
      if (prev.prStatus !== 'open' && prev.prStatus !== 'updated') {
        const f = fail('Approve pull request', txt('Nothing approvable right now.', 'এখন অনুমোদনযোগ্য কিছু নেই।'), txt(prev.prStatus === 'none' ? 'Open a pull request first.' : 'Resolve the current state first — drafts and blocked PRs cannot be approved.', prev.prStatus === 'none' ? 'আগে পুল রিকোয়েস্ট খুলুন।' : 'আগে বর্তমান অবস্থা সমাধান করুন — ড্রাফট ও ব্লকড PR অনুমোদন যায় না।'));
        return { state: prev, result: f.result };
      }
      const unresolved = prev.comments.filter((c) => c.kind === 'blocker' && !c.resolved);
      if (unresolved.length > 0) {
        const f = fail('Approve pull request', txt('Blocking threads are still open.', 'ব্লকিং থ্রেড এখনো খোলা।'), txt('Address every blocker (push-fix) before approval can land.', 'অনুমোদনের আগে প্রতিটি ব্লকার সামলান (push-fix)।'));
        return { state: prev, result: f.result };
      }
      const state = clone(prev);
      state.prStatus = 'approved';
      return {
        state,
        result: {
          ok: true,
          title: txt('Approved — reviewer accepts responsibility.', 'অনুমোদিত — রিভিউয়ার দায় নিলেন।'),
          detail: txt('Approval unlocks merging; it does not merge. The reviewer is saying: I read this and would debug it at midnight.', 'অনুমোদন মার্জ উন্মুক্ত করে; মার্জ করে না। রিভিউয়ার বলছেন: এটা পড়েছি, মধ্যরাতে ডিবাগ করব।'),
          terminal: { command: 'Approve pull request', outputEn: '✓ Approved by reviewer\nReady to merge.', outputBn: '✓ রিভিউয়ার অনুমোদন করেছেন\nমার্জে প্রস্তুত।' },
        },
      };
    }
    case 'merge': {
      if (prev.prStatus !== 'approved') {
        const f = fail('Merge pull request', txt('Merge is locked until approval.', 'অনুমোদন না হওয়া পর্যন্ত মার্জ তালাবদ্ধ।'), txt('Branch rules require review approval plus green checks. Finish review first.', 'ব্রাঞ্চ নিয়মে রিভিউ অনুমোদন ও সবুজ চেক দরকার। আগে রিভিউ শেষ করুন।'));
        return { state: prev, result: f.result };
      }
      const state = clone(prev);
      state.prStatus = 'merged';
      return {
        state,
        result: {
          ok: true,
          title: txt('Merged into main — the loop closes.', 'main-এ মার্জ — চক্র সম্পূর্ণ।'),
          detail: txt('GitHub performed the join on the server using the repository strategy. The feature branch has served its purpose and can now be deleted.', 'গিটহাব রিপোজিটরি কৌশলে সার্ভারে যুক্ত করেছে। ফিচার ব্রাঞ্চের কাজ শেষ, এখন মুছে ফেলা যায়।'),
          terminal: { command: 'Merge pull request #42', outputEn: '✓ Merged feature/login into main\nBranch can now be safely deleted.', outputBn: '✓ feature/login main-এ মার্জ হয়েছে\nব্রাঞ্চ এখন নিরাপদে মোছা যায়।' },
        },
      };
    }
    case 'sync-local': {
      if (prev.prStatus !== 'merged') {
        const f = fail('git switch main && git pull', txt('Nothing to sync yet.', 'সিঙ্ক করার মতো এখনো কিছু নেই।'), txt('Sync your local main after the PR merges.', 'PR মার্জের পর লোকাল main সিঙ্ক করুন।'));
        return { state: prev, result: f.result };
      }
      if (prev.localMainSynced) {
        return { state: prev, result: { ok: true, title: txt('Local main is already current.', 'লোকাল main ইতিমধ্যে হালনাগাদ।'), detail: txt('Your machine matches the team. Start the next branch whenever ready.', 'মেশিন টিমের সাথে মিলে গেছে। প্রস্তুত হলে পরের ব্রাঞ্চ শুরু করুন।'), terminal: { command: 'git switch main && git pull', outputEn: 'Already up to date.', outputBn: 'ইতিমধ্যে হালনাগাদ।' } } };
      }
      const state = clone(prev);
      state.localMainSynced = true;
      return {
        state,
        result: {
          ok: true,
          title: txt('Local main synchronized with the team.', 'লোকাল main টিমের সাথে সিঙ্কড।'),
          detail: txt('Pulling after the merge brings the joined history home. Your next branch starts from the true latest — the loop is ready to repeat.', 'মার্জের পর পুল যুক্ত হিস্ট্রি ঘরে আনে। পরের ব্রাঞ্চ সত্যিকারের সর্বশেষ থেকে শুরু — চক্র পুনরাবৃত্তিতে প্রস্তুত।'),
          terminal: { command: 'git switch main && git pull', outputEn: 'Updating a1b2c3d..m7e8r9g\nFast-forward — 3 new commits', outputBn: 'আপডেট হচ্ছে a1b2c3d..m7e8r9g\nFast-forward — ৩টি নতুন কমিট' },
        },
      };
    }
    case 'close-pr': {
      if (prev.prStatus !== 'open' && prev.prStatus !== 'changes-requested' && prev.prStatus !== 'updated' && prev.prStatus !== 'draft') {
        const f = fail('Close pull request', txt('There is no open proposal to close.', 'বন্ধ করার মতো খোলা প্রস্তাব নেই।'), txt('Closing ends a proposal without merging — but first there must be one.', 'বন্ধ করা মার্জ ছাড়া প্রস্তাব শেষ করে — তবে আগে একটি থাকতে হবে।'));
        return { state: prev, result: f.result };
      }
      const state = clone(prev);
      state.prStatus = 'closed';
      return {
        state,
        result: {
          ok: true,
          title: txt('Pull request closed without merging.', 'মার্জ ছাড়া পুল রিকোয়েস্ট বন্ধ।'),
          detail: txt('Closing is a normal, healthy outcome for superseded ideas. The discussion stays searchable; nothing entered main.', 'অপ্রচলিত ধারণায় বন্ধ করা স্বাভাবিক, সুস্থ ফল। আলোচনা সার্চযোগ্য থাকে; main-এ কিছু ঢোকেনি।'),
          terminal: { command: 'Close pull request', outputEn: 'Pull request #42 closed.', outputBn: 'পুল রিকোয়েস্ট #42 বন্ধ হয়েছে।' },
        },
      };
    }
  }
}

/* ------------------------------------------------------------------ */
/* Guided scenario: "You are working on a login feature." (§24)        */
/* ------------------------------------------------------------------ */

export interface PrStep {
  id: string;
  title: LangText;
  explanation: LangText;
  command: string;
  action: PrAction;
  expected: LangText;
  whyItMatters: LangText;
  learnMoreLessonId?: string;
}

export const PR_LOGIN_SCENARIO: PrStep[] = [
  {
    id: 'pr-sync', title: txt('1. Start from main — synced', '১. main থেকে শুরু — সিঙ্কড'), command: 'git switch main && git pull',
    explanation: txt('Every session opens by syncing main. You fetch the team’s latest and integrate before writing a line.', 'প্রতিটি সেশন main সিঙ্কে খোলে। এক লাইন লেখার আগে টিমের সর্বশেষ fetch ও একীভূত করুন।'),
    action: { type: 'sync-main' },
    expected: txt('Local main matches the team — a trustworthy base.', 'লোকাল main টিমের সাথে মেলে — বিশ্বস্ত বেস।'),
    whyItMatters: txt('Stale starts cause most PR conflicts. Five minutes of sync prevents five hours of merging.', 'পুরনো শুরু বেশিরভাগ PR কনফ্লিক্ট ঘটায়। পাঁচ মিনিট সিঙ্ক পাঁচ ঘণ্টা মার্জ বাঁচায়।'),
    learnMoreLessonId: 'github.team.sync-before-work',
  },
  {
    id: 'pr-branch', title: txt('2. Create feature/login', '২. feature/login তৈরি'), command: 'git switch -c feature/login',
    explanation: txt('One branch for one reviewable unit: the login feature. Created from the fresh main you just synced.', 'একটি রিভিউযোগ্য কাজে এক ব্রাঞ্চ: লগইন ফিচার। সদ্য সিঙ্কড main থেকে তৈরি।'),
    action: { type: 'create-branch' },
    expected: txt('HEAD moves to feature/login; main is untouched.', 'HEAD feature/login-এ যায়; main অক্ষত।'),
    whyItMatters: txt('Isolation lets the feature fail safely while main stays releasable.', 'আলাদাকরণ main রিলিজযোগ্য রেখে ফিচার নিরাপদে ব্যর্থ হতে দেয়।'),
    learnMoreLessonId: 'github.branching.feature-branches',
  },
  {
    id: 'pr-commit', title: txt('3. Make changes and commit', '৩. পরিবর্তন ও কমিট'), command: 'git add -p && git commit -m "Add login form"',
    explanation: txt('Build the login form in small, logical commits on the branch.', 'ব্রাঞ্চে ছোট, যৌক্তিক কমিটে লগইন ফর্ম তৈরি করুন।'),
    action: { type: 'commit' },
    expected: txt('A commit lands on feature/login only.', 'কমিট শুধু feature/login-এ আসে।'),
    whyItMatters: txt('Reviewers read commits; small ones get fast, careful reviews.', 'রিভিউয়াররা কমিট পড়েন; ছোটগুলো দ্রুত, যত্নশীল রিভিউ পায়।'),
    learnMoreLessonId: 'github.team.feature-branch-workflow',
  },
  {
    id: 'pr-push', title: txt('4. Push the branch', '৪. ব্রাঞ্চ পুশ করুন'), command: 'git push -u origin feature/login',
    explanation: txt('Publish with tracking. This shares and backs up — main still knows nothing about your work.', 'ট্র্যাকিংসহ প্রকাশ করুন। এতে শেয়ার ও ব্যাকআপ হয় — main এখনো কাজ সম্পর্কে কিছু জানে না।'),
    action: { type: 'push' },
    expected: txt('GitHub now hosts feature/login; tracking is wired.', 'গিটহাব এখন feature/login হোস্ট করে; ট্র্যাকিং যুক্ত।'),
    whyItMatters: txt('Pushing early protects against laptop disasters and invites early eyes.', 'তাড়াতাড়ি পুশ ল্যাপটপ বিপর্যয় থেকে রক্ষা করে ও আগাম দৃষ্টি আনে।'),
    learnMoreLessonId: 'github.repositories.push-to-github',
  },
  {
    id: 'pr-draft', title: txt('5. Open a draft PR', '৫. ড্রাফট PR খুলুন'), command: 'Open draft pull request',
    explanation: txt('Open early as a draft to get direction feedback while the form is still taking shape.', 'ফর্ম গড়ার সময় দিকনির্দেশ মতামতে ড্রাফট হিসেবে তাড়াতাড়ি খুলুন।'),
    action: { type: 'open-draft' },
    expected: txt('PR #42 exists in Draft — visible, unmergeable.', 'PR #42 ড্রাফটে আছে — দৃশ্যমান, অমার্জযোগ্য।'),
    whyItMatters: txt('Drafts turn "is this the right approach?" from a meeting into a visible artifact.', 'ড্রাফট "পদ্ধতি ঠিক কি?" প্রশ্নকে মিটিং থেকে দৃশ্যমান বস্তুতে বদলায়।'),
    learnMoreLessonId: 'github.pr.draft-pull-requests',
  },
  {
    id: 'pr-ready', title: txt('6. Mark ready for review', '৬. রিভিউয়ে প্রস্তুত করুন'), command: 'Mark ready for review',
    explanation: txt('The form works and checks are green. Convert the draft so reviewers know their attention counts now.', 'ফর্ম কাজ করে ও চেক সবুজ। ড্রাফট রূপান্তর করুন যাতে রিভিউয়াররা জানেন মনোযোগ এখন গণ্য।'),
    action: { type: 'mark-ready' },
    expected: txt('PR #42 is Open and awaiting review.', 'PR #42 খোলা ও রিভিউয়ের অপেক্ষায়।'),
    whyItMatters: txt('Ready means complete: green checks, full diff, real description. Respect reviewers’ time.', 'প্রস্তুত মানে সম্পূর্ণ: সবুজ চেক, পূর্ণ diff, বাস্তব বর্ণনা। রিভিউয়ারদের সময় সম্মান করুন।'),
    learnMoreLessonId: 'github.pr.create-pull-request',
  },
  {
    id: 'pr-comment', title: txt('7. Reviewer comments', '৭. রিভিউয়ার মন্তব্য'), command: 'Reviewer comment',
    explanation: txt('A teammate reads the diff and leaves an encouraging note plus one suggestion. Nothing blocks yet.', 'সহকর্মী diff পড়ে উৎসাহব্যঞ্জক নোট ও একটি পরামর্শ রাখেন। এখনো কিছু আটকায় না।'),
    action: { type: 'add-comment' },
    expected: txt('A resolved praise thread appears on the PR.', 'PR-এ সমাধানকৃত প্রশংসা থ্রেড দেখায়।'),
    whyItMatters: txt('Good reviews teach, not just gatekeep. Praise orients the author before critique lands.', 'ভালো রিভিউ শেখায়, শুধু পাহারা দেয় না। প্রশংসা সমালোচনার আগে লেখককে দিশা দেয়।'),
    learnMoreLessonId: 'github.pr.reviewing-changes',
  },
  {
    id: 'pr-changes', title: txt('8. Reviewer requests a change', '৮. রিভিউয়ার পরিবর্তন চান'), command: 'Request changes',
    explanation: txt('The token expiry is hardcoded — a genuine blocker. The PR enters Changes Requested; merging locks.', 'টোকেন মেয়াদ হার্ডকোডড — আসল ব্লকার। PR Changes Requested-এ যায়; মার্জ তালাবদ্ধ হয়।'),
    action: { type: 'request-changes' },
    expected: txt('One blocking thread; merge button disabled.', 'একটি ব্লকিং থ্রেড; মার্জ বোতাম নিষ্ক্রিয়।'),
    whyItMatters: txt('Change requests protect main from known defects. A brake, not a verdict on your worth.', 'পরিবর্তন অনুরোধ main-কে জানা ত্রুটি থেকে রক্ষা করে। ব্রেক, আপনার মূল্যের রায় নয়।'),
    learnMoreLessonId: 'github.pr.requesting-changes',
  },
  {
    id: 'pr-fix', title: txt('9. Push the fix', '৯. ফিক্স পুশ করুন'), command: 'git commit -m "Make token expiry configurable" && git push',
    explanation: txt('Address the thread with a fix commit on the same branch. The PR updates itself and checks re-run.', 'একই ব্রাঞ্চে ফিক্স কমিটে থ্রেড সামলান। PR নিজে আপডেট হয় ও চেক পুনরায় চলে।'),
    action: { type: 'push-fix' },
    expected: txt('New commit on the PR; blockers resolved; checks green.', 'PR-এ নতুন কমিট; ব্লকার সমাধান; চেক সবুজ।'),
    whyItMatters: txt('Fixes as new commits keep history reviewable — reviewers diff the fix, not the whole PR again.', 'নতুন কমিটে ফিক্স হিস্ট্রি রিভিউযোগ্য রাখে — রিভিউয়াররা ফিক্স diff করেন, পুরো PR আবার নয়।'),
    learnMoreLessonId: 'github.team.handling-review-changes',
  },
  {
    id: 'pr-checks', title: txt('10. CI checks pass', '১০. CI চেক পাস'), command: 'Checks: Tests ✓ Lint ✓ Build ✓',
    explanation: txt('Automated checks ran against the updated branch: tests, lint, build — all green. Machines verify what humans cannot read at scale.', 'আপডেটেড ব্রাঞ্চে স্বয়ংক্রিয় চেক চলেছে: টেস্ট, লিন্ট, বিল্ড — সব সবুজ। মানুষ স্কেলে পড়তে পারে না মেশিন তা যাচাই করে।'),
    action: { type: 'approve' },
    expected: txt('Approval lands on a green, resolved PR.', 'সবুজ, সমাধানকৃত PR-এ অনুমোদন আসে।'),
    whyItMatters: txt('This step pairs human judgment (approve) with machine verification (checks) — GitHub merges only when both agree.', 'এই ধাপ মানব বিচার (অনুমোদন) ও মেশিন যাচাই (চেক) জোড়া দেয় — দুটো একমত হলেই গিটহাব মার্জ করে।'),
    learnMoreLessonId: 'github.pr.approving-pr',
  },
  {
    id: 'pr-merge', title: txt('11. PR is merged', '১১. PR মার্জ হয়েছে'), command: 'Merge pull request #42',
    explanation: txt('With approval and green checks, the merge joins feature/login into main on the server.', 'অনুমোদন ও সবুজ চেকে মার্জ feature/login-কে সার্ভারে main-এ যুক্ত করে।'),
    action: { type: 'merge' },
    expected: txt('main contains the login feature; the branch is deletable.', 'main-এ লগইন ফিচার আছে; ব্রাঞ্চ মোছা যায়।'),
    whyItMatters: txt('Merging is the finish line the whole workflow pointed at — reviewed, checked, joined.', 'মার্জ সেই সমাপ্তি রেখা যেদিকে পুরো ওয়ার্কফ্লো ছিল — রিভিউড, চেকড, যুক্ত।'),
    learnMoreLessonId: 'github.pr.merging-pr',
  },
  {
    id: 'pr-sync', title: txt('12. Local main is synchronized', '১২. লোকাল main সিঙ্কড'), command: 'git switch main && git pull',
    explanation: txt('Pull the merged main home. Your machine matches the team again, ready for the next branch.', 'মার্জড main ঘরে আনুন। মেশিন আবার টিমের সাথে মিলে, পরের ব্রাঞ্চে প্রস্তুত।'),
    action: { type: 'sync-local' },
    expected: txt('Local main fast-forwards to include the feature.', 'ফিচারসহ লোকাল main ফাস্ট-ফরোয়ার্ড হয়।'),
    whyItMatters: txt('Every loop ends where the next begins: a synced main. Repeat forever.', 'প্রতিটি চক্র শেষ হয় পরের শুরুতে: সিঙ্কড main। চিরকাল পুনরাবৃত্তি করুন।'),
    learnMoreLessonId: 'github.team.sync-before-work',
  },
];

/** Replay the first n guided steps from the initial state (deterministic). */
export function replayPrScenario(upto: number): { state: PrSimState; results: PrResult[] } {
  const clamped = Math.max(0, Math.min(upto, PR_LOGIN_SCENARIO.length));
  let state: PrSimState = { ...PR_INITIAL_STATE, comments: [], checks: [] };
  const results: PrResult[] = [];
  for (let i = 0; i < clamped; i++) {
    const applied = applyPrAction(state, PR_LOGIN_SCENARIO[i].action);
    state = applied.state;
    results.push(applied.result);
  }
  return { state, results };
}

/** Pipeline stages for the workflow visualizer, derived from live state. */
export type PrStageState = 'done' | 'active' | 'todo';

export interface PrStage {
  id: string;
  labelEn: string;
  labelBn: string;
  state: PrStageState;
}

export function derivePipeline(state: PrSimState): PrStage[] {
  const reviewActive =
    state.prStatus === 'open' || state.prStatus === 'changes-requested' || state.prStatus === 'updated';
  const merged = state.prStatus === 'merged';
  return [
    { id: 'local', labelEn: 'Local Repository', labelBn: 'লোকাল রিপোজিটরি', state: state.branchCreated ? 'done' : state.mainSynced ? 'active' : 'todo' },
    { id: 'branch', labelEn: 'Feature Branch', labelBn: 'ফিচার ব্রাঞ্চ', state: state.branchCreated ? (state.pushed ? 'done' : 'active') : 'todo' },
    { id: 'push', labelEn: 'Push', labelBn: 'পুশ', state: state.pushed ? 'done' : state.commits > 0 ? 'active' : 'todo' },
    { id: 'github', labelEn: 'GitHub', labelBn: 'গিটহাব', state: state.prStatus !== 'none' ? 'done' : state.pushed ? 'active' : 'todo' },
    { id: 'pr', labelEn: 'Pull Request', labelBn: 'পুল রিকোয়েস্ট', state: merged ? 'done' : state.prStatus !== 'none' && state.prStatus !== 'closed' ? 'active' : state.prStatus === 'closed' ? 'done' : 'todo' },
    { id: 'review', labelEn: 'Review', labelBn: 'রিভিউ', state: state.prStatus === 'approved' || merged ? 'done' : reviewActive ? 'active' : 'todo' },
    { id: 'checks', labelEn: 'Checks', labelBn: 'চেক', state: state.checks.length > 0 && state.checks.every((c) => c.status === 'pass') ? (merged ? 'done' : 'active') : state.prStatus !== 'none' ? 'active' : 'todo' },
    { id: 'merge', labelEn: 'Merge', labelBn: 'মার্জ', state: merged ? 'done' : state.prStatus === 'approved' ? 'active' : 'todo' },
    { id: 'main', labelEn: 'main', labelBn: 'main', state: state.localMainSynced ? 'done' : merged ? 'active' : 'todo' },
  ];
}

/** Mock diff for the login feature (predefined example, not parsed). */
export interface PrDiffLine {
  kind: 'context' | 'add' | 'del' | 'hunk';
  text: string;
}

export const PR_MOCK_DIFF: PrDiffLine[] = [
  { kind: 'hunk', text: '@@ -12,7 +12,9 @@ validateSession(req)' },
  { kind: 'context', text: '  const user = await findUser(req.session.id);' },
  { kind: 'del', text: '-  const oldValue = readCache(user.id);' },
  { kind: 'add', text: '+  const newValue = readCache(user.id, { ttl: 60 });' },
  { kind: 'context', text: '  if (!user) throw new AuthError("unknown session");' },
  { kind: 'add', text: '+  assertTokenExpiry(user.token, config.tokenTtl);' },
  { kind: 'context', text: '  return user;' },
];
