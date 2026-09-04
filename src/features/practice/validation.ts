/**
 * Deterministic, state-based validation for practice exercises.
 *
 * Every rule is a pure function of GitSimulationState — validation NEVER
 * compares typed strings and NEVER touches a real repository. Rules describe
 * the resulting repository shape (branches, commits, files, remotes), so any
 * action sequence reaching the right state passes.
 */
import { LangText, ValidationRule } from '@/types/practice';
import { GitSimulationState } from '@/features/simulation/models';
import { isAncestor } from '@/features/simulation/engine';

export interface RuleVerdict {
  pass: boolean;
  rule: ValidationRule;
  label: LangText;
}

export function commitsReachable(state: GitSimulationState, tipId: string | undefined): Set<string> {
  const seen = new Set<string>();
  const stack: string[] = tipId ? [tipId] : [];
  while (stack.length > 0) {
    const id = stack.pop() as string;
    if (seen.has(id)) continue;
    const commit = state.commits.find((c) => c.id === id);
    if (!commit) continue;
    seen.add(id);
    stack.push(...commit.parents);
  }
  return seen;
}

function tipOf(state: GitSimulationState, branch: string): string | undefined {
  return state.localBranches[branch];
}

/** Human-readable rule description (bilingual). Technical identifiers stay in English. */
export function describeRule(rule: ValidationRule): LangText {
  switch (rule.rule) {
    case 'tipIs':
      return { en: `'${rule.branch}' still points at ${rule.commit}`, bn: `'${rule.branch}' এখনও ${rule.commit}-এ আছে` };
    case 'trackingEqualsServer':
      return { en: `'origin/${rule.branch}' matches the remote server state`, bn: `'origin/${rule.branch}' রিমোট সার্ভারের সাথে মিলেছে` };
    case 'currentBranchIs':
      return { en: `On branch '${rule.branch}'`, bn: `'${rule.branch}' ব্রাঞ্চে থাকা` };
    case 'branchExists':
      return { en: `Branch '${rule.branch}' exists`, bn: `'${rule.branch}' ব্রাঞ্চ রয়েছে` };
    case 'branchAbsent':
      return { en: `Branch '${rule.branch}' is gone`, bn: `'${rule.branch}' ব্রাঞ্চ মুছে গেছে` };
    case 'commitCountMin':
      return { en: `At least ${rule.count} commits in history`, bn: `হিস্ট্রিতে কমপক্ষে ${rule.count}টি কমিট` };
    case 'commitCountExact':
      return { en: `Exactly ${rule.count} commits in history`, bn: `হিস্ট্রিতে ঠিক ${rule.count}টি কমিট` };
    case 'tipHasParents':
      return {
        en: `Tip of '${rule.branch}' has ${rule.count} parent${rule.count === 1 ? '' : 's'}`,
        bn: `'${rule.branch}'-এর টিপে ${rule.count}টি প্যারেন্ট`,
      };
    case 'tipsEqual':
      return { en: `'${rule.branchA}' and '${rule.branchB}' point at the same commit`, bn: `'${rule.branchA}' ও '${rule.branchB}' একই কমিটে আছে` };
    case 'descendsFrom':
      return { en: `'${rule.branch}' contains the history of '${rule.ancestorBranch}'`, bn: `'${rule.branch}'-এ '${rule.ancestorBranch}'-এর হিস্ট্রি রয়েছে` };
    case 'fileIs': {
      const bits: string[] = [];
      const bitsBn: string[] = [];
      if (rule.workStatus) {
        bits.push(`is ${rule.workStatus}`);
        bitsBn.push(`${rule.workStatus === 'clean' ? 'পরিষ্কার' : rule.workStatus === 'modified' ? 'পরিবর্তিত' : 'মুছে ফেলা'}`);
      }
      if (rule.staged !== undefined) {
        bits.push(rule.staged ? 'staged' : 'unstaged');
        bitsBn.push(rule.staged ? 'স্টেজড' : 'আনস্টেজড');
      }
      return { en: `'${rule.file}' ${bits.join(' and ') || 'exists'}`, bn: `'${rule.file}' ${bitsBn.join(' ও ') || 'রয়েছে'}` };
    }
    case 'treeIsClean':
      return { en: 'Working tree is clean (nothing staged or modified)', bn: 'ওয়ার্কিং ট্রি পরিষ্কার (কিছু স্টেজড বা পরিবর্তিত নেই)' };
    case 'remoteInSync':
      return { en: `Remote '${rule.branch}' matches local '${rule.branch}'`, bn: `রিমোট '${rule.branch}' লোকালের সাথে মিলেছে` };
    case 'trackingInSync':
      return { en: `'origin/${rule.branch}' matches local '${rule.branch}'`, bn: `'origin/${rule.branch}' লোকালের সাথে মিলেছে` };
    case 'serverHasBranch':
      return { en: `Remote has branch '${rule.branch}'`, bn: `রিমোটে '${rule.branch}' ব্রাঞ্চ রয়েছে` };
  }
}

export function evaluateRule(state: GitSimulationState, rule: ValidationRule): RuleVerdict {
  const label = describeRule(rule);
  let pass = false;
  switch (rule.rule) {
    case 'tipIs':
      pass = tipOf(state, rule.branch) === rule.commit;
      break;
    case 'trackingEqualsServer':
      pass =
        state.remoteTracking[`origin/${rule.branch}`] !== undefined &&
        state.remoteTracking[`origin/${rule.branch}`] === state.serverBranches[rule.branch];
      break;
    case 'currentBranchIs':
      pass = state.currentBranch === rule.branch;
      break;
    case 'branchExists':
      pass = rule.branch in state.localBranches;
      break;
    case 'branchAbsent':
      pass = !(rule.branch in state.localBranches);
      break;
    case 'commitCountMin':
      pass = state.commits.length >= rule.count;
      break;
    case 'commitCountExact':
      pass = state.commits.length === rule.count;
      break;
    case 'tipHasParents': {
      const tip = tipOf(state, rule.branch);
      const commit = state.commits.find((c) => c.id === tip);
      pass = commit !== undefined && commit.parents.length === rule.count;
      break;
    }
    case 'tipsEqual':
      pass =
        tipOf(state, rule.branchA) !== undefined &&
        tipOf(state, rule.branchA) === tipOf(state, rule.branchB);
      break;
    case 'descendsFrom': {
      const tip = tipOf(state, rule.branch);
      const base = tipOf(state, rule.ancestorBranch);
      pass = tip !== undefined && base !== undefined && isAncestor(state.commits, base, tip);
      break;
    }
    case 'fileIs': {
      const file = state.files.find((f) => f.name === rule.file);
      pass =
        file !== undefined &&
        (rule.workStatus === undefined || file.workStatus === rule.workStatus) &&
        (rule.staged === undefined || file.staged === rule.staged);
      break;
    }
    case 'treeIsClean':
      pass = state.files.every((f) => f.workStatus === 'clean' && !f.staged);
      break;
    case 'remoteInSync': {
      const tip = tipOf(state, rule.branch);
      pass = tip !== undefined && state.serverBranches[rule.branch] === tip;
      break;
    }
    case 'trackingInSync': {
      const tip = tipOf(state, rule.branch);
      pass = tip !== undefined && state.remoteTracking[`origin/${rule.branch}`] === tip;
      break;
    }
    case 'serverHasBranch':
      pass = rule.branch in state.serverBranches;
      break;
  }
  return { pass, rule, label };
}

export interface ValidationReport {
  passed: boolean;
  /** All rules pass AND at least one rule exists. */
  verdicts: RuleVerdict[];
}

export function evaluateAllRules(
  state: GitSimulationState,
  rules: ValidationRule[]
): ValidationReport {
  const verdicts = rules.map((rule) => evaluateRule(state, rule));
  return {
    passed: rules.length > 0 && verdicts.every((v) => v.pass),
    verdicts,
  };
}

/** Commits the user created beyond a baseline (for "what changed" summaries). */
export function newCommitsSince(baseline: GitSimulationState, current: GitSimulationState): string[] {
  const before = new Set(baseline.commits.map((c) => c.id));
  return current.commits.filter((c) => !before.has(c.id)).map((c) => c.id);
}
