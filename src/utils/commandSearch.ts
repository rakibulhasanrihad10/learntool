import { DetailedCommand, DifficultyLevel } from '@/types/content';

/**
 * Client-side search & filter engine for the Git Command Encyclopedia.
 *
 * Pure functions — no React, no side effects — so they can be unit-tested
 * in isolation and reused by CommandsPage, CommandDetailPage, and SearchModal.
 */

export interface CommandFilters {
  category?: string; // 'All' (or undefined) means no category constraint
  difficulty?: DifficultyLevel | 'All';
  frequentlyUsed?: boolean; // true = only frequently used; false/undefined = no constraint
}

function normalize(value: string | undefined | null): string {
  return (value ?? '').toLowerCase().trim();
}

/** Split a raw query into lowercase tokens, dropping empties. */
export function tokenizeQuery(query: string): string[] {
  return normalize(query).split(/[\s,;]+/).filter(Boolean);
}

/**
 * Collect every searchable string for a command into one flat list.
 * Covers bilingual fields so Bangla queries match too.
 */
export function getSearchableFields(cmd: DetailedCommand): string[] {
  const fields: (string | undefined)[] = [
    cmd.command,
    cmd.id,
    cmd.slug,
    cmd.title,
    cmd.titleBn,
    cmd.whatItDoes,
    cmd.whatItDoesBn,
    cmd.whenToUse,
    cmd.whenToUseBn,
    cmd.whenNotToUse,
    cmd.whenNotToUseBn,
    cmd.syntax,
    cmd.whatHappensInternally,
    cmd.whatHappensInternallyBn,
    cmd.category,
    cmd.difficulty,
    ...(cmd.aliases ?? []),
    ...(cmd.searchKeywords ?? []),
    ...(cmd.tags ?? []),
    ...(cmd.commonOptions ?? []).flatMap((o) => [o.flag, o.description, o.descriptionBn]),
    ...(cmd.examples ?? []).flatMap((e) => [e.command, e.description, e.descriptionBn]),
  ];
  return fields.filter((f): f is string => typeof f === 'string' && f.length > 0);
}

function commandMatchesToken(cmd: DetailedCommand, token: string): boolean {
  const t = normalize(token);
  if (!t) return true;
  // Fast path: short tokens (e.g. "co", "st") match aliases / command names exactly.
  if ((cmd.aliases ?? []).some((a) => normalize(a) === t)) return true;
  const haystack = getSearchableFields(cmd).map(normalize);
  return haystack.some((field) => field.includes(t));
}

/**
 * Multi-field, case-insensitive, token-tolerant search.
 * Every token in the query must match at least one field (AND semantics).
 * Empty/blank queries return the full list (sorted by `order`).
 */
export function searchCommands(query: string, commands: DetailedCommand[]): DetailedCommand[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return sortByOrder(commands);
  return sortByOrder(commands.filter((cmd) => tokens.every((t) => commandMatchesToken(cmd, t))));
}

/** Composable structural filters (category / difficulty / frequently-used). */
export function filterCommands(commands: DetailedCommand[], filters: CommandFilters): DetailedCommand[] {
  const { category, difficulty, frequentlyUsed } = filters;
  return sortByOrder(
    commands.filter((cmd) => {
      if (category && normalize(category) !== 'all' && normalize(cmd.category) !== normalize(category)) {
        return false;
      }
      if (difficulty && difficulty !== 'All' && cmd.difficulty !== difficulty) {
        return false;
      }
      if (frequentlyUsed === true && cmd.frequentlyUsed !== true) {
        return false;
      }
      return true;
    })
  );
}

/** Apply structural filters first, then the text query — the standard pipeline. */
export function searchAndFilter(
  commands: DetailedCommand[],
  query: string,
  filters: CommandFilters
): DetailedCommand[] {
  return searchCommands(query, filterCommands(commands, filters));
}

/** Lookup helpers used by detail pages and related-command chips. */
export function getCommandBySlug(commands: DetailedCommand[], slug: string): DetailedCommand | undefined {
  const s = normalize(slug);
  return commands.find((c) => normalize(c.slug) === s || normalize(c.id) === s);
}

export function getCommandById(commands: DetailedCommand[], id: string): DetailedCommand | undefined {
  const target = normalize(id);
  return commands.find((c) => normalize(c.id) === target || normalize(c.slug) === target);
}

/**
 * Resolve `relatedCommands` ids into command objects.
 * Unknown ids (e.g. future commands) are silently skipped.
 */
export function getRelatedCommands(command: DetailedCommand, all: DetailedCommand[]): DetailedCommand[] {
  const ids = command.relatedCommands ?? [];
  const resolved: DetailedCommand[] = [];
  for (const id of ids) {
    const found = getCommandById(all, id);
    if (found && found.id !== command.id) resolved.push(found);
  }
  return resolved;
}

/** Previous / next navigation following the canonical `order` sequence. */
export function getAdjacentCommands(
  command: DetailedCommand,
  all: DetailedCommand[]
): { prev: DetailedCommand | undefined; next: DetailedCommand | undefined } {
  const sorted = sortByOrder(all);
  const idx = sorted.findIndex((c) => c.id === command.id);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? sorted[idx - 1] : undefined,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : undefined,
  };
}

/** Stable display ordering — commands without an explicit order sink to the end. */
export function sortByOrder(commands: DetailedCommand[]): DetailedCommand[] {
  return [...commands].sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
}
