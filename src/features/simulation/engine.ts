/**
 * Deterministic educational Git simulation engine.
 *
 * Pure functions only: `applyAction(state, action)` never mutates its input and
 * never touches the filesystem, shell, or network. Every behaviour here is a
 * deliberate simplification documented for learners — NOT real Git.
 */
import {
  ChangedArea,
  GitSimulationState,
  LangText,
  SimAction,
  SimCommit,
  SimResult,
  SimTerminal,
} from './models';

const txt = (en: string, bn: string): LangText => ({ en, bn });

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function cloneState(state: GitSimulationState): GitSimulationState {
  return {
    files: state.files.map((f) => ({ ...f })),
    commits: state.commits.map((c) => ({ ...c, parents: [...c.parents] })),
    localBranches: { ...state.localBranches },
    remoteTracking: { ...state.remoteTracking },
    serverBranches: { ...state.serverBranches },
    serverOnly: state.serverOnly.map((c) => ({ ...c, parents: [...c.parents] })),
    currentBranch: state.currentBranch,
    seq: state.seq,
  };
}

function findCommit(commits: SimCommit[], id: string): SimCommit | undefined {
  return commits.find((c) => c.id === id);
}

/** True when `ancestorId` is reachable from `tipId` by following parent links. */
export function isAncestor(commits: SimCommit[], ancestorId: string, tipId: string): boolean {
  if (ancestorId === tipId) return true;
  const visited = new Set<string>();
  const stack: string[] = [tipId];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    if (current === ancestorId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    const commit = findCommit(commits, current);
    if (commit) stack.push(...commit.parents);
  }
  return false;
}

/** Commits reachable from `tip` but NOT from `base` (oldest first). Used by rebase. */
export function exclusiveCommits(commits: SimCommit[], base: string, tip: string): SimCommit[] {
  const exclusive: SimCommit[] = [];
  const visited = new Set<string>();
  const stack: string[] = [tip];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    if (visited.has(current)) continue;
    visited.add(current);
    if (isAncestor(commits, current, base)) continue;
    const commit = findCommit(commits, current);
    if (!commit) continue;
    exclusive.push(commit);
    stack.push(...commit.parents);
  }
  return exclusive.reverse();
}

export function localTip(state: GitSimulationState): string {
  return state.localBranches[state.currentBranch];
}

export function trackingTip(state: GitSimulationState, branch: string): string | undefined {
  return state.remoteTracking[`origin/${branch}`];
}

export function isClean(state: GitSimulationState): boolean {
  return state.files.every((f) => f.workStatus === 'clean' && !f.staged);
}

function fail(actionCommand: string, title: LangText, detail: LangText, remember: LangText): SimResult {
  return { ok: false, title, detail, remember, terminal: { command: actionCommand, outputEn: title.en, outputBn: title.bn }, changes: [] };
}

/* ------------------------------------------------------------------ */
/* Simulated terminal renderers (presentation only)                   */
/* ------------------------------------------------------------------ */

export function renderStatus(state: GitSimulationState, lang: 'en' | 'bn'): string {
  const L = lang === 'bn';
  const lines: string[] = [];
  lines.push(L ? `main শাখায় ${state.currentBranch}` : `On branch ${state.currentBranch}`);
  const track = trackingTip(state, state.currentBranch);
  const tip = localTip(state);
  if (track && track !== tip) {
    lines.push(L ? `আপনার ব্রাঞ্চ origin/${state.currentBranch} থেকে এগিয়ে আছে` : `Your branch is ahead of 'origin/${state.currentBranch}'`);
  } else if (track) {
    lines.push(L ? `আপনার ব্রাঞ্চ origin/${state.currentBranch} এর সাথে আপ টু ডেট` : `Your branch is up to date with 'origin/${state.currentBranch}'`);
  }
  const staged = state.files.filter((f) => f.staged);
  const unstaged = state.files.filter((f) => !f.staged && f.workStatus !== 'clean');
  if (staged.length === 0 && unstaged.length === 0) {
    lines.push(L ? 'কমিট করার মতো কিছু নেই, ওয়ার্কিং ট্রি পরিষ্কার' : 'nothing to commit, working tree clean');
  } else {
    if (staged.length > 0) {
      lines.push(L ? 'কমিটের জন্য স্টেজড:' : 'Changes to be committed:');
      for (const f of staged) lines.push(`\t${f.workStatus === 'deleted' ? (L ? 'ডিলিট:' : 'deleted:') : (L ? 'পরিবর্তিত:' : 'modified:')}   ${f.name}`);
    }
    if (unstaged.length > 0) {
      lines.push(L ? 'কমিটের জন্য স্টেজ করা হয়নি:' : 'Changes not staged for commit:');
      for (const f of unstaged) lines.push(`\t${f.workStatus === 'deleted' ? (L ? 'ডিলিট:' : 'deleted:') : (L ? 'পরিবর্তিত:' : 'modified:')}   ${f.name}`);
    }
  }
  return lines.join('\n');
}

export function renderDiff(state: GitSimulationState, lang: 'en' | 'bn'): string {
  const L = lang === 'bn';
  const dirty = state.files.filter((f) => !f.staged && f.workStatus !== 'clean');
  if (dirty.length === 0) {
    return L ? 'ওয়ার্কিং ট্রিতে কোনো আনস্টেজড পরিবর্তন নেই' : 'no unstaged changes in the working tree';
  }
  const out: string[] = [];
  for (const f of dirty) {
    out.push(`diff --git a/${f.name} b/${f.name}`);
    if (f.workStatus === 'deleted') {
      out.push(L ? `--- a/${f.name} (মুছে ফেলা হয়েছে)` : `--- a/${f.name} (deleted)`);
    } else {
      out.push(`--- a/${f.name}`);
      out.push(`+++ b/${f.name}`);
      out.push(L ? '... লাইন-বাই-লাইন পরিবর্তন (সিমুলেটেড)' : '... line-by-line changes (simulated)');
    }
  }
  return out.join('\n');
}

function commitLabels(state: GitSimulationState, id: string): string[] {
  const labels: string[] = [];
  for (const [name, tip] of Object.entries(state.localBranches)) {
    if (tip === id) labels.push(name);
  }
  if (localTip(state) === id) labels.push('HEAD');
  for (const [name, tip] of Object.entries(state.remoteTracking)) {
    if (tip === id) labels.push(name);
  }
  return labels;
}

export function renderLog(state: GitSimulationState, lang: 'en' | 'bn'): string {
  const L = lang === 'bn';
  const depth = new Map<string, number>();
  const visit = (id: string): number => {
    const cached = depth.get(id);
    if (cached !== undefined) return cached;
    const c = findCommit(state.commits, id);
    const d = c && c.parents.length > 0 ? Math.max(...c.parents.map(visit)) + 1 : 0;
    depth.set(id, d);
    return d;
  };
  const ordered = [...state.commits].sort((a, b) => visit(b.id) - visit(a.id));
  if (ordered.length === 0) return L ? 'কোনো কমিট নেই' : 'no commits yet';
  return (
    (L ? '(সরলীকৃত গ্রাফ — নতুন কমিট সবার উপরে)\n' : '(simplified graph — newest first)\n') +
    ordered
      .map((c) => {
        const labels = commitLabels(state, c.id);
        const tag = labels.length > 0 ? ` (${labels.join(', ')})` : '';
        const mergeMark = c.parents.length > 1 ? (L ? ' [মার্জ]' : ' [merge]') : '';
        return `* ${c.id} ${c.message}${tag}${mergeMark}`;
      })
      .join('\n')
  );
}

/* ------------------------------------------------------------------ */
/* Action application                                                 */
/* ------------------------------------------------------------------ */

function describeAction(action: SimAction): string {
  switch (action.type) {
    case 'modify': return `# edit ${action.file} in your editor`;
    case 'delete-file': return `# delete ${action.file}`;
    case 'stage': return action.files ? `git add ${action.files.join(' ')}` : 'git add .';
    case 'commit': return `git commit -m "${action.message}"`;
    case 'push': return 'git push';
    case 'teammate-push': return '# teammate runs: git push';
    case 'fetch': return 'git fetch';
    case 'pull': return 'git pull';
    case 'switch': return `git switch ${action.branch}`;
    case 'create-branch': return `git switch -c ${action.branch}`;
    case 'merge': return `git merge ${action.source}`;
    case 'rebase': return `git rebase ${action.onto}`;
    case 'status': return 'git status';
    case 'diff': return 'git diff';
    case 'log': return 'git log --oneline --graph --all';
  }
}

/**
 * Apply one simulation action. Returns the next state plus an educational
 * result. Read-only actions (status/diff/log) return an equal-but-fresh state.
 */
export function applyAction(prev: GitSimulationState, action: SimAction): { state: GitSimulationState; result: SimResult } {
  const state = cloneState(prev);
  const cmd = describeAction(action);

  const term = (outputEn: string, outputBn: string): SimTerminal => ({ command: cmd, outputEn, outputBn });

  switch (action.type) {
    /* ---------------- read-only ---------------- */
    case 'status': {
      return {
        state,
        result: {
          ok: true,
          title: txt('Checked the repository status.', 'রিপোজিটরির অবস্থা যাচাই করা হয়েছে।'),
          detail: txt(
            'git status only inspects — it never changes files, staging, or history. Run it before and after every operation.',
            'git status শুধু পর্যবেক্ষণ করে — এটি ফাইল, স্টেজিং বা হিস্ট্রি বদলায় না। প্রতিটি কাজের আগে ও পরে এটি চালান।'
          ),
          remember: txt('Status is always safe to run.', 'Status চালানো সবসময় নিরাপদ।'),
          terminal: term(renderStatus(state, 'en'), renderStatus(state, 'bn')),
          changes: [],
        },
      };
    }
    case 'diff': {
      return {
        state,
        result: {
          ok: true,
          title: txt('Inspected unstaged line changes.', 'আনস্টেজড লাইন পরিবর্তন পর্যালোচনা করা হয়েছে।'),
          detail: txt(
            'git diff compares the Working Directory against the Staging Area. Staged files are intentionally hidden here — use git diff --staged for those.',
            'git diff ওয়ার্কিং ডিরেক্টরির সাথে স্টেজিং এরিয়ার তুলনা করে। স্টেজড ফাইল এখানে দেখায় না — সেগুলোর জন্য git diff --staged ব্যবহার করুন।'
          ),
          remember: txt('Review with diff before you stage.', 'স্টেজ করার আগে diff দিয়ে পর্যালোচনা করুন।'),
          terminal: term(renderDiff(state, 'en'), renderDiff(state, 'bn')),
          changes: [],
        },
      };
    }
    case 'log': {
      return {
        state,
        result: {
          ok: true,
          title: txt('Inspected the commit history.', 'কমিট হিস্ট্রি পর্যালোচনা করা হয়েছে।'),
          detail: txt(
            'git log walks backwards from HEAD through parent links. Labels show where each branch, remote-tracking ref, and HEAD currently point.',
            'git log HEAD থেকে প্যারেন্ট লিঙ্ক ধরে পেছনে হাঁটে। লেবেলগুলো দেখায় প্রতিটি ব্রাঞ্চ, রিমোট-ট্র্যাকিং রেফ ও HEAD এখন কোথায় আছে।'
          ),
          remember: txt('History is a graph of snapshots, not a list of diffs.', 'হিস্ট্রি ডিফের তালিকা নয় — স্ন্যাপশটের গ্রাফ।'),
          terminal: term(renderLog(state, 'en'), renderLog(state, 'bn')),
          changes: [],
        },
      };
    }

    /* ---------------- working tree ---------------- */
    case 'modify': {
      const file = state.files.find((f) => f.name === action.file);
      if (!file) return { state: prev, result: fail(cmd, txt(`No file named ${action.file} exists.`, `${action.file} নামে কোনো ফাইল নেই।`), txt('Pick one of the files shown in the Working Directory.', 'ওয়ার্কিং ডিরেক্টরিতে দেখানো ফাইলগুলোর একটি বেছে নিন।'), txt('You can only edit files that exist.', 'শুধু বিদ্যমান ফাইল এডিট করা যায়।')) };
      if (file.workStatus !== 'clean' || file.staged) {
        return { state: prev, result: fail(cmd, txt(`${action.file} already has uncommitted changes.`, `${action.file}-এ ইতিমধ্যে আনকমিটেড পরিবর্তন আছে।`), txt('Stage and commit the current changes before editing the file again.', 'আবার এডিট করার আগে বর্তমান পরিবর্তন স্টেজ ও কমিট করুন।'), txt('One logical change per commit keeps history clean.', 'প্রতি কমিটে একটি যৌক্তিক পরিবর্তন হিস্ট্রি পরিষ্কার রাখে।')) };
      }
      file.workStatus = 'modified';
      const changes: ChangedArea[] = ['working'];
      return {
        state,
        result: {
          ok: true,
          title: txt(`${action.file} was modified in the Working Directory.`, `${action.file} ওয়ার্কিং ডিরেক্টরিতে পরিবর্তন করা হয়েছে।`),
          detail: txt(
            'Editing happens outside Git. Git notices the file differs from the last commit, but nothing is staged or saved yet.',
            'এডিটিং গিটের বাইরে ঘটে। গিট শনাক্ত করে ফাইলটি শেষ কমিট থেকে আলাদা, কিন্তু এখনো কিছু স্টেজ বা সেভ হয়নি।'
          ),
          remember: txt('Modified files are not safe yet — they live only on your disk.', 'পরিবর্তিত ফাইল এখনো নিরাপদ নয় — এগুলো শুধু আপনার ডিস্কে আছে।'),
          terminal: term(`# ${action.file} edited — run git status to see it`, `# ${action.file} এডিট করা হয়েছে — দেখতে git status চালান`),
          changes,
        },
      };
    }
    case 'delete-file': {
      const file = state.files.find((f) => f.name === action.file);
      if (!file) return { state: prev, result: fail(cmd, txt(`No file named ${action.file} exists.`, `${action.file} নামে কোনো ফাইল নেই।`), txt('Pick one of the files shown in the Working Directory.', 'ওয়ার্কিং ডিরেক্টরিতে দেখানো ফাইলগুলোর একটি বেছে নিন।'), txt('You can only delete files that exist.', 'শুধু বিদ্যমান ফাইল মুছে ফেলা যায়।')) };
      if (file.workStatus !== 'clean' || file.staged) {
        return { state: prev, result: fail(cmd, txt(`${action.file} already has uncommitted changes.`, `${action.file}-এ ইতিমধ্যে আনকমিটেড পরিবর্তন আছে।`), txt('Resolve the pending changes first.', 'আগে অমীমাংসিত পরিবর্তনের নিষ্পত্তি করুন।'), txt('Finish one change before starting another.', 'আরেকটি শুরু করার আগে একটি শেষ করুন।')) };
      }
      file.workStatus = 'deleted';
      return {
        state,
        result: {
          ok: true,
          title: txt(`${action.file} was deleted from the Working Directory.`, `${action.file} ওয়ার্কিং ডিরেক্টরি থেকে মুছে ফেলা হয়েছে।`),
          detail: txt(
            'Deletion is also just a working-tree change until staged. git status will list the file as deleted.',
            'স্টেজ না করা পর্যন্ত ডিলিশনও শুধু ওয়ার্কিং-ট্রি পরিবর্তন। git status ফাইলটিকে deleted হিসেবে দেখাবে।'
          ),
          remember: txt('Deleted files can be restored until committed — stage deliberately.', 'কমিট না হওয়া পর্যন্ত মুছে ফেলা ফাইল ফিরিয়ে আনা যায় — ভেবেচিন্তে স্টেজ করুন।'),
          terminal: term(`# ${action.file} deleted — run git status to see it`, `# ${action.file} মুছে ফেলা হয়েছে — দেখতে git status চালান`),
          changes: ['working'],
        },
      };
    }
    case 'stage': {
      const targets = action.files
        ? state.files.filter((f) => action.files!.includes(f.name))
        : state.files.filter((f) => !f.staged && f.workStatus !== 'clean');
      if (targets.length === 0) {
        return { state: prev, result: fail(cmd, txt('Nothing to stage — the working tree matches the index.', 'স্টেজ করার মতো কিছু নেই — ওয়ার্কিং ট্রি ইনডেক্সের সাথে মিলে গেছে।'), txt('Modify a file first, then stage it.', 'আগে একটি ফাইল পরিবর্তন করুন, তারপর স্টেজ করুন।'), txt('Staging does not create a commit — it prepares the next one.', 'Staging কোনো commit তৈরি করে না — এটি পরবর্তী commit প্রস্তুত করে।')) };
      }
      for (const f of targets) f.staged = true;
      const names = targets.map((f) => f.name).join(', ');
      return {
        state,
        result: {
          ok: true,
          title: txt(`${names} moved to the Staging Area.`, `${names} স্টেজিং এরিয়ায় নেওয়া হয়েছে।`),
          detail: txt(
            'git add snapshots the current file contents into the index. The working tree is untouched — staging only curates what the next commit will contain.',
            'git add ফাইলের বর্তমান কনটেন্টের স্ন্যাপশট ইনডেক্সে নেয়। ওয়ার্কিং ট্রি অপরিবর্তিত থাকে — স্টেজিং শুধু পরবর্তী কমিটে কী থাকবে তা নির্ধারণ করে।'
          ),
          remember: txt('Staging does not create a commit. It prepares the exact changes the next commit will include.', 'Staging কোনো commit তৈরি করে না। এটি পরবর্তী commit-এ কোন changes অন্তর্ভুক্ত হবে তা নির্ধারণ করে।'),
          terminal: term(`# staged: ${names}`, `# স্টেজড: ${names}`),
          changes: ['staging', 'working'],
        },
      };
    }
    case 'commit': {
      const staged = state.files.filter((f) => f.staged);
      if (staged.length === 0) {
        return { state: prev, result: fail(cmd, txt('Nothing staged — git commit needs staged changes.', 'কিছু স্টেজড নেই — git commit এর জন্য স্টেজড পরিবর্তন দরকার।'), txt('Run git add first to move changes into the Staging Area.', 'আগে git add চালিয়ে পরিবর্তন স্টেজিং এরিয়ায় নিন।'), txt('Empty commits teach nothing — stage a real change.', 'খালি কমিট থেকে কিছু শেখা যায় না — বাস্তব পরিবর্তন স্টেজ করুন।')) };
      }
      const id = `C${state.seq++}`;
      const parent = localTip(state);
      state.commits.push({ id, message: action.message, parents: [parent] });
      state.localBranches[state.currentBranch] = id;
      for (const f of staged) {
        f.staged = false;
        if (f.workStatus === 'deleted') {
          state.files = state.files.filter((x) => x !== f);
        } else {
          f.workStatus = 'clean';
        }
      }
      return {
        state,
        result: {
          ok: true,
          title: txt(`Created commit ${id} on ${state.currentBranch}.`, `${state.currentBranch}-এ ${id} কমিট তৈরি হয়েছে।`),
          detail: txt(
            `The staged snapshot became a permanent commit with parent ${parent}. ${state.currentBranch} and HEAD now point at ${id}; staging is empty again.`,
            `স্টেজড স্ন্যাপশট প্যারেন্ট ${parent} সহ স্থায়ী কমিটে পরিণত হয়েছে। ${state.currentBranch} ও HEAD এখন ${id}-কে নির্দেশ করে; স্টেজিং আবার খালি।`
          ),
          remember: txt('A commit is a permanent snapshot — but so far it exists only on your machine.', 'কমিট একটি স্থায়ী স্ন্যাপশট — তবে এখনো এটি শুধু আপনার মেশিনে আছে।'),
          terminal: term(`[${state.currentBranch} ${id}] ${action.message}\n ${staged.length} file(s) changed`, `[${state.currentBranch} ${id}] ${action.message}\n ${staged.length}টি ফাইল পরিবর্তিত`),
          changes: ['staging', 'local'],
        },
      };
    }

    /* ---------------- remote ---------------- */
    case 'push': {
      const tip = localTip(state);
      const server = state.serverBranches[state.currentBranch];
      if (!server) {
        state.serverBranches[state.currentBranch] = tip;
        state.remoteTracking[`origin/${state.currentBranch}`] = tip;
        return {
          state,
          result: {
            ok: true,
            title: txt(`Published ${state.currentBranch} to the remote for the first time.`, `${state.currentBranch} প্রথমবার রিমোটে প্রকাশ করা হয়েছে।`),
            detail: txt(
              'The server had no such branch, so it accepted your history and created it. Your remote-tracking ref was set up as well.',
              'সার্ভারে এই ব্রাঞ্চ ছিল না, তাই এটি আপনার হিস্ট্রি গ্রহণ করে ব্রাঞ্চ তৈরি করেছে। রিমোট-ট্র্যাকিং রেফও সেট হয়েছে।'
            ),
            remember: txt('Push uploads commits; it never changes your local state.', 'Push কমিট আপলোড করে; এটি আপনার লোকাল অবস্থা বদলায় না।'),
            terminal: term(`* [new branch] ${tip} -> ${state.currentBranch}`, `* [নতুন ব্রাঞ্চ] ${tip} -> ${state.currentBranch}`),
            changes: ['remote', 'tracking'],
          },
        };
      }
      if (server === tip) {
        return {
          state,
          result: {
            ok: true,
            title: txt('Everything up-to-date — nothing to push.', 'সব আপ-টু-ডেট — পুশ করার মতো কিছু নেই।'),
            detail: txt(
              'The remote branch already points at your local tip. Push only transfers commits the server is missing.',
              'রিমোট ব্রাঞ্চ ইতিমধ্যে আপনার লোকাল টিপকে নির্দেশ করে। Push শুধু সার্ভারে না থাকা কমিট পাঠায়।'
            ),
            remember: txt('If push says up-to-date, your work is already shared.', 'Push আপ-টু-ডেট বললে আপনার কাজ ইতিমধ্যে শেয়ার হয়েছে।'),
            terminal: term('Everything up-to-date', 'সব আপ-টু-ডেট'),
            changes: [],
          },
        };
      }
      if (!isAncestor(state.commits, server, tip)) {
        return { state: prev, result: fail(cmd, txt('Push rejected — the remote has commits you lack (non-fast-forward).', 'Push প্রত্যাখ্যাত — রিমোটে এমন কমিট আছে যা আপনার নেই (non-fast-forward)।'), txt('Run git fetch, integrate the remote changes, then push again.', 'git fetch চালিয়ে রিমোট পরিবর্তন একীভূত করুন, তারপর আবার পুশ করুন।'), txt('Never force-push shared branches to fix a rejection.', 'প্রত্যাখ্যান এড়াতে শেয়ার্ড ব্রাঞ্চে ফোর্স-পুশ করবেন না।')) };
      }
      state.serverBranches[state.currentBranch] = tip;
      state.remoteTracking[`origin/${state.currentBranch}`] = tip;
      return {
        state,
        result: {
          ok: true,
          title: txt(`Uploaded local commits — remote ${state.currentBranch} now matches.`, 'লোকাল কমিট আপলোড হয়েছে — রিমোট এখন মিলে গেছে।'),
          detail: txt(
            'Push uploads the commit objects the server was missing and moves the remote branch pointer forward. Local history is untouched.',
            'Push সার্ভারে না থাকা কমিট অবজেক্ট আপলোড করে রিমোট ব্রাঞ্চ পয়েন্টার এগিয়ে দেয়। লোকাল হিস্ট্রি অপরিবর্তিত থাকে।'
          ),
          remember: txt('Push shares history; it does not rewrite it.', 'Push হিস্ট্রি শেয়ার করে; এটি পুনর্লিখন করে না।'),
          terminal: term(`   ${server}..${tip}  ${state.currentBranch} -> ${state.currentBranch}`, `   ${server}..${tip}  ${state.currentBranch} -> ${state.currentBranch}`),
          changes: ['remote', 'tracking'],
        },
      };
    }
    case 'teammate-push': {
      const id = `C${state.seq++}`;
      const serverTip = state.serverBranches[state.currentBranch] ?? localTip(state);
      const commit: SimCommit = { id, message: action.message, parents: [serverTip] };
      state.serverOnly.push(commit);
      state.serverBranches[state.currentBranch] = id;
      return {
        state,
        result: {
          ok: true,
          title: txt(`A teammate pushed ${id} to the remote. Your machine is unchanged.`, `একজন সহকর্মী রিমোটে ${id} পুশ করেছেন। আপনার মেশিন অপরিবর্তিত।`),
          detail: txt(
            'This action simulates someone else — nothing on your computer changed. Your branches, files, and even remote-tracking refs are exactly as before.',
            'এই অ্যাকশন অন্য কারো কাজ অনুকরণ করে — আপনার কম্পিউটারে কিছু বদলায়নি। আপনার ব্রাঞ্চ, ফাইল, এমনকি রিমোট-ট্র্যাকিং রেফও আগের মতোই আছে।'
          ),
          remember: txt('Remote activity is invisible until you fetch.', 'Fetch না করা পর্যন্ত রিমোট কার্যকলাপ অদৃশ্য থাকে।'),
          terminal: term(`# teammate: [main ${id}] ${action.message}\n# To github.com:team/repo.git`, `# সহকর্মী: [main ${id}] ${action.message}`),
          changes: [],
        },
      };
    }
    case 'fetch': {
      const fresh = state.serverOnly.filter((c) => !findCommit(state.commits, c.id));
      for (const c of fresh) state.commits.push({ ...c, parents: [...c.parents] });
      state.serverOnly = [];
      for (const [branch, tip] of Object.entries(state.serverBranches)) {
        state.remoteTracking[`origin/${branch}`] = tip;
      }
      if (fresh.length === 0) {
        return {
          state,
          result: {
            ok: true,
            title: txt('Fetched — the remote had nothing new.', 'Fetch সম্পন্ন — রিমোটে নতুন কিছু ছিল না।'),
            detail: txt(
              'Fetch asked the server for new objects and updated remote-tracking refs. Your branches and files never move during a fetch.',
              'Fetch সার্ভারের কাছে নতুন অবজেক্ট চায় ও রিমোট-ট্র্যাকিং রেফ আপডেট করে। Fetch চলাকালে আপনার ব্রাঞ্চ ও ফাইল কখনো নড়ে না।'
            ),
            remember: txt('Fetch downloads; it never merges.', 'Fetch ডাউনলোড করে; এটি কখনো মার্জ করে না।'),
            terminal: term('Already up to date (tracking refs checked)', 'ইতিমধ্যে আপ টু ডেট (ট্র্যাকিং রেফ যাচাই করা হয়েছে)'),
            changes: ['tracking'],
          },
        };
      }
      const names = fresh.map((c) => c.id).join(', ');
      return {
        state,
        result: {
          ok: true,
          title: txt(`Fetched ${names} — your branch did NOT move.`, `${names} Fetch হয়েছে — আপনার ব্রাঞ্চ নড়েনি।`),
          detail: txt(
            `New objects arrived and origin/${state.currentBranch} advanced, but ${state.currentBranch} still points where it did. Your files are untouched — integration is a separate, deliberate step.`,
            `নতুন অবজেক্ট এসেছে ও origin/${state.currentBranch} এগিয়েছে, কিন্তু ${state.currentBranch} আগের জায়গাতেই আছে। আপনার ফাইল অক্ষত — একীভূতকরণ আলাদা, সচেতন পদক্ষেপ।`
          ),
          remember: txt('After fetch, you decide when — and how — to integrate.', 'Fetch-এর পর কখন ও কীভাবে একীভূত করবেন তা আপনিই ঠিক করেন।'),
          terminal: term(`From simulated-remote\n * [new commit] ${names} -> origin/${state.currentBranch}`, `সিমুলেটেড-রিমোট থেকে\n * [নতুন কমিট] ${names} -> origin/${state.currentBranch}`),
          changes: ['tracking', 'local'],
        },
      };
    }
    case 'pull': {
      if (!isClean(state)) {
        return { state: prev, result: fail(cmd, txt('Pull blocked — you have uncommitted changes.', 'Pull আটকে গেছে — আপনার আনকমিটেড পরিবর্তন আছে।'), txt('Commit or discard your working-tree changes first; pull refuses to merge over dirty files.', 'আগে ওয়ার্কিং-ট্রি পরিবর্তন কমিট বা বাতিল করুন; নোংরা ফাইলের ওপর pull মার্জ করতে চায় না।'), txt('Clean tree first, integrate second.', 'আগে ট্রি পরিষ্কার, তারপর একীভূত।')) };
      }
      // fetch phase
      const fresh = state.serverOnly.filter((c) => !findCommit(state.commits, c.id));
      for (const c of fresh) state.commits.push({ ...c, parents: [...c.parents] });
      state.serverOnly = [];
      for (const [branch, tip] of Object.entries(state.serverBranches)) {
        state.remoteTracking[`origin/${branch}`] = tip;
      }
      const tip = localTip(state);
      const srvTip = state.serverBranches[state.currentBranch];
      if (!srvTip || srvTip === tip) {
        return {
          state,
          result: {
            ok: true,
            title: txt('Pulled — already up to date.', 'Pull সম্পন্ন — ইতিমধ্যে আপ টু ডেট।'),
            detail: txt(
              'Pull runs fetch first, then integrates. Here the fetch found nothing new, so there was nothing to merge.',
              'Pull প্রথমে fetch চালায়, তারপর একীভূত করে। এখানে fetch নতুন কিছু পায়নি, তাই মার্জ করার কিছু ছিল না।'
            ),
            remember: txt('pull = fetch + integrate (usually merge).', 'pull = fetch + integrate (সাধারণত merge)।'),
            terminal: term('Already up to date.', 'ইতিমধ্যে আপ টু ডেট।'),
            changes: ['tracking'],
          },
        };
      }
      if (isAncestor(state.commits, tip, srvTip)) {
        state.localBranches[state.currentBranch] = srvTip;
        return {
          state,
          result: {
            ok: true,
            title: txt(`Pulled — ${state.currentBranch} fast-forwarded to ${srvTip}.`, `Pull হয়েছে — ${state.currentBranch} ফাস্ট-ফরোয়ার্ড করে ${srvTip}-এ গেছে।`),
            detail: txt(
              'Pull fetched first, then saw your branch had no new work of its own — so it simply slid the branch pointer forward. No merge commit was needed.',
              'Pull প্রথমে fetch করেছে, তারপর দেখেছে আপনার ব্রাঞ্চে নিজস্ব নতুন কাজ নেই — তাই শুধু ব্রাঞ্চ পয়েন্টার এগিয়ে দিয়েছে। কোনো মার্জ কমিট দরকার হয়নি।'
            ),
            remember: txt('Not every pull creates a merge commit — fast-forwards stay linear.', 'প্রতিটি pull মার্জ কমিট বানায় না — ফাস্ট-ফরোয়ার্ড লিনিয়ার থাকে।'),
            terminal: term(`Updating ${tip}..${srvTip}\nFast-forward`, `আপডেট হচ্ছে ${tip}..${srvTip}\nFast-forward`),
            changes: ['tracking', 'local'],
          },
        };
      }
      const id = `C${state.seq++}`;
      state.commits.push({ id, message: `Merge remote-tracking branch 'origin/${state.currentBranch}'`, parents: [tip, srvTip] });
      state.localBranches[state.currentBranch] = id;
      return {
        state,
        result: {
          ok: true,
          title: txt(`Pulled — merged origin/${state.currentBranch} into ${id}.`, `Pull হয়েছে — origin/${state.currentBranch} ${id}-তে মার্জ হয়েছে।`),
          detail: txt(
            'Both sides had new work, so after fetching, pull created a merge commit with two parents: your tip and the remote tip.',
            'উভয় দিকে নতুন কাজ ছিল, তাই fetch-এর পর pull দুটি প্যারেন্টসহ একটি মার্জ কমিট বানিয়েছে: আপনার টিপ ও রিমোট টিপ।'
          ),
          remember: txt('Diverged pull = fetch + 3-way merge.', 'ডাইভার্জড pull = fetch + 3-way merge।'),
          terminal: term(`Merge made by the 'merge' strategy.\n ${tip} + ${srvTip} -> ${id}`, `মার্জ কৌশলে মার্জ সম্পন্ন।\n ${tip} + ${srvTip} -> ${id}`),
          changes: ['tracking', 'local'],
        },
      };
    }

    /* ---------------- branches ---------------- */
    case 'switch': {
      if (!state.localBranches[action.branch]) {
        return { state: prev, result: fail(cmd, txt(`Branch '${action.branch}' does not exist.`, `'${action.branch}' নামে কোনো ব্রাঞ্চ নেই।`), txt('Create it first, or check the branch name spelling.', 'আগে এটি তৈরি করুন বা নামের বানান যাচাই করুন।'), txt('Switching never creates branches.', 'সুইচিং কখনো ব্রাঞ্চ তৈরি করে না।')) };
      }
      if (action.branch === state.currentBranch) {
        return { state: prev, result: fail(cmd, txt(`Already on '${action.branch}'.`, `ইতিমধ্যে '${action.branch}'-এ আছেন।`), txt('HEAD is already pointing here — nothing to do.', 'HEAD ইতিমধ্যে এখানে আছে — কিছু করার নেই।'), txt('Check git status if you feel lost.', 'হারিয়ে গেলে git status দেখুন।')) };
      }
      if (!isClean(state)) {
        return { state: prev, result: fail(cmd, txt('Switch blocked — your working tree is dirty.', 'সুইচ আটকে গেছে — ওয়ার্কিং ট্রি নোংরা।'), txt('Commit or discard your changes first. Switching branches rewrites working-tree files, and Git protects uncommitted work.', 'আগে পরিবর্তন কমিট বা বাতিল করুন। ব্রাঞ্চ বদলালে ওয়ার্কিং-ট্রি ফাইল পুনর্লিখিত হয়, তাই গিট আনকমিটেড কাজ রক্ষা করে।'), txt('Clean tree, then switch.', 'আগে ট্রি পরিষ্কার, তারপর সুইচ।')) };
      }
      const from = state.currentBranch;
      state.currentBranch = action.branch;
      return {
        state,
        result: {
          ok: true,
          title: txt(`HEAD now points to ${action.branch}.`, `HEAD এখন ${action.branch}-কে নির্দেশ করে।`),
          detail: txt(
            `Switched from ${from} to ${action.branch}. HEAD follows the branch pointer, and the working tree now reflects ${action.branch}'s latest commit. The other branch is untouched.`,
            `${from} থেকে ${action.branch}-এ যাওয়া হয়েছে। HEAD ব্রাঞ্চ পয়েন্টার অনুসরণ করে, এবং ওয়ার্কিং ট্রি এখন ${action.branch}-এর সর্বশেষ কমিট প্রতিফলিত করে। অন্য ব্রাঞ্চ অক্ষত আছে।`
          ),
          remember: txt('HEAD points to your current location — HEAD is not itself a branch.', 'HEAD আপনার বর্তমান অবস্থান নির্দেশ করে — HEAD নিজে কোনো ব্রাঞ্চ নয়।'),
          terminal: term(`Switched to branch '${action.branch}'`, `'${action.branch}' ব্রাঞ্চে যাওয়া হয়েছে`),
          changes: ['working'],
        },
      };
    }
    case 'create-branch': {
      if (state.localBranches[action.branch]) {
        return { state: prev, result: fail(cmd, txt(`Branch '${action.branch}' already exists.`, `'${action.branch}' ব্রাঞ্চ ইতিমধ্যে আছে।`), txt('Pick a fresh name, or switch to the existing branch.', 'নতুন নাম বেছে নিন বা বিদ্যমান ব্রাঞ্চে সুইচ করুন।'), txt('Branch names must be unique in a repository.', 'রিপোজিটরিতে ব্রাঞ্চের নাম অনন্য হতে হবে।')) };
      }
      state.localBranches[action.branch] = localTip(state);
      return {
        state,
        result: {
          ok: true,
          title: txt(`Created branch ${action.branch} — you are still on ${state.currentBranch}.`, `${action.branch} ব্রাঞ্চ তৈরি হয়েছে — আপনি এখনো ${state.currentBranch}-এ আছেন।`),
          detail: txt(
            'Creating a branch only writes a new 41-byte pointer at the current commit. HEAD does not move — use git switch to move to it.',
            'ব্রাঞ্চ তৈরি মানে বর্তমান কমিটে নতুন ৪১-বাইট পয়েন্টার লেখা। HEAD নড়ে না — সেখানে যেতে git switch ব্যবহার করুন।'
          ),
          remember: txt('Branches are cheap pointers, not copies.', 'ব্রাঞ্চ কপি নয় — সস্তা পয়েন্টার।'),
          terminal: term(`# branch '${action.branch}' created at ${localTip(state)}`, `# '${action.branch}' ব্রাঞ্চ ${localTip(state)}-তে তৈরি হয়েছে`),
          changes: ['local'],
        },
      };
    }
    case 'merge': {
      if (!state.localBranches[action.source]) {
        return { state: prev, result: fail(cmd, txt(`Branch '${action.source}' does not exist.`, `'${action.source}' নামে কোনো ব্রাঞ্চ নেই।`), txt('Check the branch name and try again.', 'ব্রাঞ্চের নাম যাচাই করে আবার চেষ্টা করুন।'), txt('You can only merge branches that exist.', 'শুধু বিদ্যমান ব্রাঞ্চ মার্জ করা যায়।')) };
      }
      if (action.source === state.currentBranch) {
        return { state: prev, result: fail(cmd, txt('Cannot merge a branch into itself.', 'একটি ব্রাঞ্চকে নিজের মধ্যে মার্জ করা যায় না।'), txt('Pick a different source branch.', 'অন্য সোর্স ব্রাঞ্চ বেছে নিন।'), txt('Merge always joins two different lines of history.', 'মার্জ সবসময় দুটি ভিন্ন হিস্ট্রি যুক্ত করে।')) };
      }
      if (!isClean(state)) {
        return { state: prev, result: fail(cmd, txt('Merge blocked — your working tree is dirty.', 'মার্জ আটকে গেছে — ওয়ার্কিং ট্রি নোংরা।'), txt('Commit or discard your changes first so the merge starts from a clean slate.', 'আগে পরিবর্তন কমিট বা বাতিল করুন যাতে পরিষ্কার অবস্থা থেকে মার্জ শুরু হয়।'), txt('Merges deserve a clean starting point.', 'মার্জ পরিষ্কার অবস্থা থেকে শুরু করা উচিত।')) };
      }
      const cTip = localTip(state);
      const sTip = state.localBranches[action.source];
      if (cTip === sTip) {
        return {
          state,
          result: {
            ok: true,
            title: txt('Already up to date — both branches point at the same commit.', 'ইতিমধ্যে আপ টু ডেট — উভয় ব্রাঞ্চ একই কমিটে আছে।'),
            detail: txt('There is nothing to join, so Git creates nothing.', 'যুক্ত করার কিছু নেই, তাই গিট কিছু তৈরি করে না।'),
            remember: txt('No divergence, no merge commit.', 'ডাইভারজেন্স নেই, মার্জ কমিট নেই।'),
            terminal: term('Already up to date.', 'ইতিমধ্যে আপ টু ডেট।'),
            changes: [],
          },
        };
      }
      if (isAncestor(state.commits, cTip, sTip)) {
        state.localBranches[state.currentBranch] = sTip;
        return {
          state,
          result: {
            ok: true,
            title: txt(`Fast-forwarded ${state.currentBranch} to ${sTip} — no merge commit needed.`, `${state.currentBranch} ফাস্ট-ফরোয়ার্ড করে ${sTip}-এ গেছে — মার্জ কমিট দরকার হয়নি।`),
            detail: txt(
              `Your branch had no new commits of its own, so Git simply slid ${state.currentBranch} forward to ${sTip}. Not every merge creates a merge commit.`,
              `আপনার ব্রাঞ্চে নিজস্ব নতুন কমিট ছিল না, তাই গিট শুধু ${state.currentBranch} এগিয়ে ${sTip}-তে নিয়েছে। প্রতিটি মার্জে মার্জ কমিট তৈরি হয় না।`
            ),
            remember: txt('Fast-forward = catch up without a merge commit.', 'Fast-forward = মার্জ কমিট ছাড়াই এগিয়ে যাওয়া।'),
            terminal: term(`Updating ${cTip}..${sTip}\nFast-forward`, `আপডেট হচ্ছে ${cTip}..${sTip}\nFast-forward`),
            changes: ['local'],
          },
        };
      }
      if (isAncestor(state.commits, sTip, cTip)) {
        return {
          state,
          result: {
            ok: true,
            title: txt(`Already up to date — ${action.source} is behind ${state.currentBranch}.`, `ইতিমধ্যে আপ টু ডেট — ${action.source} ${state.currentBranch} থেকে পিছিয়ে।`),
            detail: txt('Everything in the source branch is already contained in your branch.', 'সোর্স ব্রাঞ্চের সবকিছু ইতিমধ্যে আপনার ব্রাঞ্চে আছে।'),
            remember: txt('Merging an ancestor changes nothing.', 'অ্যানসেস্টর মার্জ করলে কিছু বদলায় না।'),
            terminal: term('Already up to date.', 'ইতিমধ্যে আপ টু ডেট।'),
            changes: [],
          },
        };
      }
      const id = `C${state.seq++}`;
      state.commits.push({ id, message: `Merge branch '${action.source}'`, parents: [cTip, sTip] });
      state.localBranches[state.currentBranch] = id;
      return {
        state,
        result: {
          ok: true,
          title: txt(`Created merge commit ${id} on ${state.currentBranch}.`, `${state.currentBranch}-এ ${id} মার্জ কমিট তৈরি হয়েছে।`),
          detail: txt(
            `Both branches had diverged, so Git combined them: ${id} has two parents — ${cTip} (yours) and ${sTip} (${action.source}). ${action.source} itself is unchanged.`,
            `উভয় ব্রাঞ্চ ডাইভার্জ করেছিল, তাই গিট সেগুলো একত্র করেছে: ${id}-এর দুটি প্যারেন্ট — ${cTip} (আপনার) ও ${sTip} (${action.source})। ${action.source} নিজে অপরিবর্তিত আছে।`
          ),
          remember: txt('A merge commit joins two histories while preserving both.', 'মার্জ কমিট উভয় হিস্ট্রি সংরক্ষণ করে দুটিকে যুক্ত করে।'),
          terminal: term(`Merge made by the 'merge' strategy.\n ${cTip} + ${sTip} -> ${id}`, `মার্জ কৌশলে মার্জ সম্পন্ন।\n ${cTip} + ${sTip} -> ${id}`),
          changes: ['local'],
        },
      };
    }
    case 'rebase': {
      if (!state.localBranches[action.onto]) {
        return { state: prev, result: fail(cmd, txt(`Branch '${action.onto}' does not exist.`, `'${action.onto}' নামে কোনো ব্রাঞ্চ নেই।`), txt('Check the branch name and try again.', 'ব্রাঞ্চের নাম যাচাই করে আবার চেষ্টা করুন।'), txt('You can only rebase onto branches that exist.', 'শুধু বিদ্যমান ব্রাঞ্চের ওপর রিব্যাস করা যায়।')) };
      }
      if (action.onto === state.currentBranch) {
        return { state: prev, result: fail(cmd, txt('Cannot rebase a branch onto itself.', 'একটি ব্রাঞ্চকে নিজের ওপর রিব্যাস করা যায় না।'), txt('Pick a different base branch.', 'অন্য বেস ব্রাঞ্চ বেছে নিন।'), txt('Rebase needs a new base to replay onto.', 'রিব্যাসের জন্য নতুন বেস দরকার।')) };
      }
      if (!isClean(state)) {
        return { state: prev, result: fail(cmd, txt('Rebase blocked — your working tree is dirty.', 'রিব্যাস আটকে গেছে — ওয়ার্কিং ট্রি নোংরা।'), txt('Commit or discard your changes first.', 'আগে পরিবর্তন কমিট বা বাতিল করুন।'), txt('History surgery needs a clean table.', 'হিস্ট্রি সার্জারির জন্য পরিষ্কার টেবিল দরকার।')) };
      }
      const base = state.localBranches[action.onto];
      const tip = localTip(state);
      if (tip === base) {
        return {
          state,
          result: {
            ok: true,
            title: txt('Already up to date — both tips match.', 'ইতিমধ্যে আপ টু ডেট — উভয় টিপ মিলে গেছে।'),
            detail: txt('There is nothing to replay.', 'রিপ্লে করার কিছু নেই।'),
            remember: txt('No divergence, no rebase.', 'ডাইভারজেন্স নেই, রিব্যাস নেই।'),
            terminal: term('Current branch is up to date.', 'বর্তমান ব্রাঞ্চ আপ টু ডেট।'),
            changes: [],
          },
        };
      }
      if (isAncestor(state.commits, tip, base)) {
        state.localBranches[state.currentBranch] = base;
        return {
          state,
          result: {
            ok: true,
            title: txt(`Fast-forwarded ${state.currentBranch} to ${base} — nothing to replay.`, `${state.currentBranch} ফাস্ট-ফরোয়ার্ড করে ${base}-এ গেছে — রিপ্লে করার কিছু ছিল না।`),
            detail: txt(
              'Your branch had no unique commits, so Git simply moved the pointer forward instead of replaying anything.',
              'আপনার ব্রাঞ্চে অনন্য কমিট ছিল না, তাই রিপ্লে না করে গিট শুধু পয়েন্টার এগিয়ে দিয়েছে।'
            ),
            remember: txt('Rebase with no unique commits is just a fast-forward.', 'অনন্য কমিট না থাকলে রিব্যাস শুধু ফাস্ট-ফরোয়ার্ড।'),
            terminal: term(`Updating ${tip}..${base}\nFast-forward`, `আপডেট হচ্ছে ${tip}..${base}\nFast-forward`),
            changes: ['local'],
          },
        };
      }
      const toReplay = exclusiveCommits(state.commits, base, tip);
      let parent = base;
      const replayed: string[] = [];
      for (const orig of toReplay) {
        const newId = `${orig.id}'`;
        state.commits.push({ id: newId, message: orig.message, parents: [parent] });
        parent = newId;
        replayed.push(`${orig.id} → ${newId}`);
      }
      state.localBranches[state.currentBranch] = parent;
      return {
        state,
        result: {
          ok: true,
          title: txt(`Replayed ${toReplay.length} commit(s) onto ${action.onto} — history is linear again.`, `${toReplay.length}টি কমিট ${action.onto}-এর ওপর রিপ্লে হয়েছে — হিস্ট্রি আবার লিনিয়ার।`),
          detail: txt(
            `Each commit was re-applied on top of ${base}, minting new ids (${replayed.join(', ')}). The old commits still exist in this simulation for comparison — in real Git they would eventually be garbage-collected.`,
            `প্রতিটি কমিট ${base}-এর ওপর পুনরায় প্রয়োগ করে নতুন id দেওয়া হয়েছে (${replayed.join(', ')})। তুলনার জন্য পুরনো কমিট এই সিমুলেশনে রয়ে গেছে — বাস্তব গিটে এগুলো শেষে মুছে যেত।`
          ),
          remember: txt('Rebase rewrites history: replayed commits get NEW identities. Be careful when rebasing commits that have already been shared with others.', 'রিব্যাস হিস্ট্রি পুনর্লিখন করে: রিপ্লে হওয়া কমিট নতুন পরিচয় পায়। ইতিমধ্যে অন্যদের সাথে শেয়ার করা কমিট রিব্যাস করতে সতর্ক থাকুন।'),
          terminal: term(`Successfully rebased and updated refs/heads/${state.currentBranch}.`, `সফলভাবে রিব্যাস করে refs/heads/${state.currentBranch} আপডেট হয়েছে।`),
          changes: ['local'],
        },
      };
    }
  }
}

/** Convenience: a pristine everyday-workflow starting point. */
export function createEverydayInitial(): GitSimulationState {
  return {
    files: [
      { name: 'README.md', workStatus: 'clean', staged: false },
      { name: 'app.js', workStatus: 'clean', staged: false },
      { name: 'package.json', workStatus: 'clean', staged: false },
    ],
    commits: [{ id: 'C1', message: 'Initial commit', parents: [] }],
    localBranches: { main: 'C1' },
    remoteTracking: { 'origin/main': 'C1' },
    serverBranches: { main: 'C1' },
    serverOnly: [],
    currentBranch: 'main',
    seq: 2,
  };
}

/** Map a command slug to a suggested demo scenario (Reference Mode links). */
export function demoForCommand(slug: string): { scenario: 'everyday' | 'merge' | 'rebase' | 'fetch-pull'; step: number } | null {
  switch (slug) {
    case 'status':
    case 'diff':
    case 'add':
    case 'commit':
    case 'log':
    case 'push':
      return { scenario: 'everyday', step: 7 };
    case 'fetch':
    case 'pull':
      return { scenario: 'fetch-pull', step: 5 };
    case 'switch':
    case 'merge':
    case 'branch':
    case 'checkout':
      return { scenario: 'merge', step: 4 };
    case 'rebase':
    case 'reset':
      return { scenario: 'rebase', step: 5 };
    default:
      return null;
  }
}

export type { ChangedArea };
