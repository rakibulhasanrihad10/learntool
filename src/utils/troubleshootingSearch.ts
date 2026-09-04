import { DetailedCommand } from '@/types/content';
import {
  CommandSafetyLevel,
  DecisionTree,
  DifficultyLevel,
  LocalText,
  TroubleshootingCategoryId,
  TroubleshootingGuide,
  CurriculumLesson,
} from '@/types/content';
import { getCommandById, tokenizeQuery } from './commandSearch';

/**
 * Search, filter, relationship and decision-tree engine for the
 * Troubleshooting & Recovery Cookbook. Pure functions — no React.
 */

export interface TroubleshootingFilters {
  category?: TroubleshootingCategoryId | 'All';
  difficulty?: DifficultyLevel | 'All';
  beginnerSafe?: boolean; // true = only beginner-safe guides
}

function normalize(value: string | undefined | null): string {
  return (value ?? '').toLowerCase().trim();
}

function textFields(t: LocalText | undefined): string[] {
  if (!t) return [];
  return [t.en, t.bn].filter((s) => s.length > 0);
}

function getSearchableFields(guide: TroubleshootingGuide): string[] {
  const fields: string[] = [
    guide.id,
    guide.slug,
    guide.category,
    guide.difficulty,
    guide.severity,
    ...textFields(guide.title),
    ...textFields(guide.shortDescription),
    ...guide.symptoms.flatMap((s) => textFields(s)),
    ...guide.sightings.flatMap((s) => [s.command, s.output]),
    ...textFields(guide.diagnosis),
    ...guide.likelyCauses.flatMap((c) => textFields(c)),
    ...guide.checks.flatMap((c) => [...textFields(c.label), c.command]),
    ...textFields(guide.fix.title),
    ...guide.fix.steps.flatMap((s) => textFields(s)),
    ...guide.fix.commands,
    ...guide.alternatives.flatMap((a) => [...textFields(a.title), ...textFields(a.detail), ...a.commands]),
    ...guide.warnings.flatMap((w) => textFields(w.text)),
    ...guide.verify.flatMap((v) => textFields(v)),
    ...guide.commands,
    ...guide.tags,
    ...guide.searchKeywords,
  ];
  return fields.filter((f) => f.length > 0);
}

function guideMatchesToken(guide: TroubleshootingGuide, token: string): boolean {
  const t = normalize(token);
  if (!t) return true;
  return getSearchableFields(guide).some((field) => normalize(field).includes(t));
}

/**
 * Relevance weight of one token inside a guide. Title/slug hits outrank
 * keyword/tag hits, which outrank body-text hits — so "force push" surfaces
 * the force-push guide above guides that merely mention force push.
 */
function tokenScore(guide: TroubleshootingGuide, token: string): number {
  const t = normalize(token);
  if (!t) return 0;
  const has = (v: string | undefined) => normalize(v).includes(t);
  if (has(guide.slug) || has(guide.id)) return 5;
  if (has(guide.title.en) || has(guide.title.bn)) return 4;
  if (
    guide.searchKeywords.some((k) => has(k)) ||
    guide.tags.some((k) => has(k)) ||
    guide.symptoms.some((s) => has(s.en) || has(s.bn))
  ) {
    return 3;
  }
  return guideMatchesToken(guide, token) ? 1 : 0;
}

/**
 * Natural-problem search: every query token must match at least one field
 * (AND semantics), ranked by relevance (title > keywords/symptoms > body),
 * ties broken by canonical order. Blank queries return the full library.
 */
export function searchScenarios(query: string, guides: TroubleshootingGuide[]): TroubleshootingGuide[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return sortByOrder(guides);
  const scored = guides
    .map((guide) => ({ guide, score: tokens.reduce((sum, t) => sum + tokenScore(guide, t), 0) }))
    .filter((s) => tokens.every((t) => tokenScore(s.guide, t) > 0));
  scored.sort((a, b) => b.score - a.score || a.guide.order - b.guide.order);
  return scored.map((s) => s.guide);
}

export function filterScenarios(
  guides: TroubleshootingGuide[],
  filters: TroubleshootingFilters
): TroubleshootingGuide[] {
  const { category, difficulty, beginnerSafe } = filters;
  return sortByOrder(
    guides.filter((g) => {
      if (category && category !== 'All' && g.category !== category) return false;
      if (difficulty && difficulty !== 'All' && g.difficulty !== difficulty) return false;
      if (beginnerSafe === true && g.safeForBeginners !== true) return false;
      return true;
    })
  );
}

export function searchAndFilterScenarios(
  guides: TroubleshootingGuide[],
  query: string,
  filters: TroubleshootingFilters
): TroubleshootingGuide[] {
  return searchScenarios(query, filterScenarios(guides, filters));
}

export function sortByOrder(guides: TroubleshootingGuide[]): TroubleshootingGuide[] {
  return [...guides].sort((a, b) => a.order - b.order);
}

export function getScenarioBySlug(
  guides: TroubleshootingGuide[],
  slug: string
): TroubleshootingGuide | undefined {
  const s = normalize(slug);
  return guides.find((g) => normalize(g.slug) === s || normalize(g.id) === s);
}

export function getScenarioById(
  guides: TroubleshootingGuide[],
  id: string
): TroubleshootingGuide | undefined {
  return getScenarioBySlug(guides, id);
}

export function getAdjacentScenarios(
  guide: TroubleshootingGuide,
  guides: TroubleshootingGuide[]
): { prev: TroubleshootingGuide | undefined; next: TroubleshootingGuide | undefined } {
  const sorted = sortByOrder(guides);
  const idx = sorted.findIndex((g) => g.id === guide.id);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? sorted[idx - 1] : undefined,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : undefined,
  };
}

export function getRelatedScenarios(
  guide: TroubleshootingGuide,
  guides: TroubleshootingGuide[]
): TroubleshootingGuide[] {
  const out: TroubleshootingGuide[] = [];
  for (const slug of guide.scenarios ?? []) {
    const found = getScenarioBySlug(guides, slug);
    if (found && found.id !== guide.id) out.push(found);
  }
  return out;
}

/* ---------------- command ↔ scenario relationships ---------------- */

export interface ResolvedScenarioCommands {
  /** Commands that exist in the Reference Mode encyclopedia (linkable). */
  found: DetailedCommand[];
  /** Command lines with no encyclopedia page (rendered as plain code). */
  missing: string[];
}

/** Resolve a guide's `commands` against GIT_COMMANDS (order-preserving, deduped). */
export function getCommandsForScenario(
  guide: TroubleshootingGuide,
  commands: DetailedCommand[]
): ResolvedScenarioCommands {
  const found: DetailedCommand[] = [];
  const missing: string[] = [];
  const seen = new Set<string>();
  for (const raw of guide.commands ?? []) {
    const key = normalize(raw);
    if (seen.has(key)) continue;
    seen.add(key);
    const cmd = getCommandById(commands, raw);
    if (cmd && !found.some((f) => f.id === cmd.id)) found.push(cmd);
    else missing.push(raw);
  }
  return { found, missing };
}

/** All guides that reference a command (by slug or id) — for CommandDetailPage. */
export function getScenariosForCommand(
  commandSlugOrId: string,
  guides: TroubleshootingGuide[]
): TroubleshootingGuide[] {
  const target = normalize(commandSlugOrId);
  return sortByOrder(
    guides.filter((g) =>
      (g.commands ?? []).some((c) => {
        const n = normalize(c);
        return n === target || n === `git.${target}` || normalize(`git.${c}`) === target;
      })
    )
  );
}

/** Resolve a guide's `lessons` against FUNDAMENTALS_LESSONS. */
export function getLessonsForScenario(
  guide: TroubleshootingGuide,
  lessons: CurriculumLesson[]
): CurriculumLesson[] {
  const out: CurriculumLesson[] = [];
  for (const id of guide.lessons ?? []) {
    const found = lessons.find((l) => normalize(l.id) === normalize(id) || normalize(l.slug) === normalize(id));
    if (found && !out.some((o) => o.id === found.id)) out.push(found);
  }
  return out;
}

/* ---------------- decision trees ---------------- */

export function getDecisionTree(trees: DecisionTree[], id: string): DecisionTree | undefined {
  return trees.find((t) => t.id === id);
}

/**
 * Resolve a decision option hop. Returns either the next node or a terminal
 * `{ scenarioSlug }` hop (`next: 'scenario:<slug>'`).
 */
export function resolveDecisionHop(
  tree: DecisionTree,
  nodeId: string,
  optionIndex: number
): { kind: 'node'; nodeId: string } | { kind: 'scenario'; slug: string } | null {
  const node = tree.nodes.find((n) => n.id === nodeId);
  if (!node) return null;
  const option = node.options[optionIndex];
  if (!option) return null;
  if (option.next.startsWith('scenario:')) {
    return { kind: 'scenario', slug: option.next.slice('scenario:'.length) };
  }
  const targetExists = tree.nodes.some((n) => n.id === option.next);
  return targetExists ? { kind: 'node', nodeId: option.next } : null;
}

/* ---------------- command safety classification ---------------- */

export interface SafetyInfo {
  level: CommandSafetyLevel;
}

const SAFE_PREFIXES = [
  'git status',
  'git log',
  'git diff',
  'git show',
  'git reflog',
  'git branch -r',
  'git branch --list',
  'git remote -v',
  'git check-ignore',
  'git cherry-pick --no-commit',
];

const USUALLY_SAFE_PREFIXES = [
  'git fetch',
  'git branch',
  'git switch',
  'git stash list',
  'git cherry-pick',
];

/**
 * Classify a command line by risk. Conservative by design: anything unlisted
 * is treated as potentially destructive, and labels use hedging language.
 */
export function classifyCommand(command: string): SafetyInfo {
  const cmd = normalize(command).replace(/^(#.*)/, '').trim();
  const bare = cmd.replace(/^git\s+/, '');

  if (/--force\b/.test(bare) && bare.startsWith('push')) return { level: 'high-risk' };
  if (/(^|\s)-f(\s|$)/.test(` ${bare} `) && bare.startsWith('push')) return { level: 'high-risk' };
  if (/\bfilter-(branch|repo)\b/.test(bare)) return { level: 'high-risk' };
  if (/^rebase\s+(-i|--interactive)/.test(bare)) return { level: 'high-risk' };
  if (/^reset\s+--hard/.test(bare)) return { level: 'destructive' };
  if (/^reset\b/.test(bare)) return { level: 'destructive' };
  if (/^restore\b/.test(bare)) return { level: 'destructive' };
  if (/^clean\b/.test(bare)) return { level: 'destructive' };
  if (/^rebase\b/.test(bare)) return { level: 'destructive' };
  if (/^rm\b/.test(bare) && !/--cached/.test(bare)) return { level: 'destructive' };
  if (/^checkout\s+--?\s/.test(bare) || /^checkout\s+\S+\s+--\s/.test(bare)) return { level: 'destructive' };

  if (SAFE_PREFIXES.some((p) => cmd.startsWith(p))) return { level: 'safe' };
  if (USUALLY_SAFE_PREFIXES.some((p) => cmd.startsWith(p))) return { level: 'usually-safe' };
  if (/^commit\b|^add\b|^merge\b|^pull\b|^push\b|^revert\b|^remote\b/.test(bare)) return { level: 'usually-safe' };
  return { level: 'destructive' };
}
