/**
 * Cheat Sheet resolution + filtering (Phase 15).
 *
 * Pure functions over the metadata in `src/content/cheatsheet/`:
 * - `resolveEntry()` turns a metadata entry into display data by looking
 *   up the Command Encyclopedia (source of truth), lessons, and guides.
 *   Unresolvable references resolve to null and are skipped by the UI —
 *   never rendered as broken links.
 * - `filterCheatSheet()` is the tiny in-page filter (token-AND over the
 *   entry's own text). Global discovery stays in the unified search engine.
 * - `safetyFor()` reuses `classifyCommand()` — the same source of truth
 *   as Troubleshooting — so risk labels never drift between pages.
 */
import { GIT_COMMANDS, TROUBLESHOOTING_GUIDES } from '@/content/git';
import { getLessonRoute } from '@/content/github';
import { CHEAT_SHEET_SECTIONS, CheatEntry, CheatSheetSection } from '@/content/cheatsheet/cheatSheet';
import { CommandSafetyLevel, LocalText } from '@/types/content';
import { getCommandById, tokenizeQuery } from '@/utils/commandSearch';
import { classifyCommand } from '@/utils/troubleshootingSearch';

export interface ResolvedEntry {
  key: string;
  command: string;
  purpose: LocalText;
  caveat?: LocalText;
  safety: CommandSafetyLevel;
  commandRoute: string | null;
  learnRoute: string | null;
  guideRoute: string | null;
}

function guideRoute(guideId: string | undefined): string | null {
  if (!guideId) return null;
  const guide = TROUBLESHOOTING_GUIDES.find((g) => g.id === guideId);
  return guide ? `/troubleshooting/git/${guide.slug}` : null;
}

function lessonRoute(lessonId: string | undefined): string | null {
  if (!lessonId) return null;
  return getLessonRoute(lessonId)?.path ?? null;
}

export function resolveEntry(sectionId: string, index: number, entry: CheatEntry): ResolvedEntry | null {
  const key = `${sectionId}:${index}`;
  if (entry.kind === 'command') {
    const cmd = getCommandById(GIT_COMMANDS, entry.commandId);
    if (!cmd) return null;
    return {
      key,
      command: cmd.syntax,
      purpose: { en: cmd.whatItDoes, bn: cmd.whatItDoesBn ?? cmd.whatItDoes },
      safety: classifyCommand(cmd.syntax).level,
      commandRoute: `/commands/git/${cmd.slug}`,
      learnRoute: null,
      guideRoute: null,
    };
  }
  const commandRoute = entry.linkCommandId
    ? (() => {
        const cmd = getCommandById(GIT_COMMANDS, entry.linkCommandId);
        return cmd ? `/commands/git/${cmd.slug}` : null;
      })()
    : null;
  return {
    key,
    command: entry.command,
    purpose: entry.purpose,
    caveat: entry.caveat,
    safety: classifyCommand(entry.command).level,
    commandRoute,
    learnRoute: lessonRoute(entry.linkLessonId),
    guideRoute: guideRoute(entry.linkGuideId),
  };
}

export interface ResolvedSection {
  section: CheatSheetSection;
  entries: ResolvedEntry[];
}

export function resolveSections(): ResolvedSection[] {
  return CHEAT_SHEET_SECTIONS.map((section) => ({
    section,
    entries: section.entries
      .map((entry, index) => resolveEntry(section.id, index, entry))
      .filter((e): e is ResolvedEntry => e !== null),
  })).filter((s) => s.entries.length > 0);
}

/**
 * In-page filter: every content token must appear in the entry's command,
 * purpose, caveat, or section title (either language). Commands are never
 * altered — matching is case-insensitive substring only.
 */
export function filterSections(query: string, resolved: ResolvedSection[]): ResolvedSection[] {
  const tokens = tokenizeQuery(query).filter((t) => t.length > 1);
  if (tokens.length === 0) return resolved;
  const hay = (entry: ResolvedEntry, title: LocalText): string =>
    [entry.command, entry.purpose.en, entry.purpose.bn, entry.caveat?.en ?? '', entry.caveat?.bn ?? '', title.en, title.bn]
      .join('\n')
      .toLowerCase();
  return resolved
    .map((s) => ({ ...s, entries: s.entries.filter((e) => tokens.every((t) => hay(e, s.section.title).includes(t))) }))
    .filter((s) => s.entries.length > 0);
}

export function safetyFor(command: string): CommandSafetyLevel {
  return classifyCommand(command).level;
}
