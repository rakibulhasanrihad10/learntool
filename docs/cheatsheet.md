# Cheat Sheet — Quick Reference Layer (Phase 15)

> Copy-first reference for users who know what they want to do.
> The Command Encyclopedia (`GIT_COMMANDS`) is the source of truth;
> this layer curates, never duplicates.

## Architecture

```
src/content/cheatsheet/
  cheatSheet.ts        CheatSheetSection[] · CheatEntry · QUICK_ACTIONS (metadata only)
  cheatSheetExtras.ts  WORKFLOW_RECIPES · COMMAND_COMPARISONS · UNDO_SITUATIONS
  cheatSheet.test.ts   12 tests (resolution, dupes, safety, routes, filter, i18n)
src/features/cheatsheet/cheatsheet.ts
  resolveEntry()       metadata → display data via encyclopedia/lesson/guide lookups
  resolveSections()    whole-page resolution (unresolvable refs skipped, never broken)
  filterSections()     tiny in-page token-AND filter (global discovery stays in search)
  safetyFor()          classifyCommand() — same source of truth as Troubleshooting
src/components/cheatsheet/
  CheatEntryCard       code + copy + purpose + caveat + SafetyBadge + learn/fix link
  CheatCollections     RecipeCard · ComparisonCard · UndoCard · GitHubFlow
src/pages/Cheatsheet/
  CheatsheetPage       full experience: quick actions, filter, sections, recipes,
                       comparisons, undo, GitHub flow
  GitCheatsheetPage    dense printable command grid, driven by the same metadata
```

## Entry model

- `{ kind: 'command', commandId }` — syntax, purpose, and detail link
  resolve from the encyclopedia. Copied text is exactly `cmd.syntax`.
- `{ kind: 'snippet', command, purpose, caveat?, linkCommandId?,
  linkLessonId?, linkGuideId? }` — one exact, valid Git line (variants
  like `git log --oneline`, compositions like `git switch -c <name>`).
  Every link id is validated by tests; unresolvable links are omitted.

## Safety

Risk labels come from `classifyCommand()` — identical to Troubleshooting.
`safe` entries show no badge (less noise); `usually-safe`,
`destructive`, and `high-risk` entries show the existing `SafetyBadge`
(icon + text, never color alone) plus a caveat line and, where the
metadata provides one, a recovery-guide link. Destructive rows are
deliberately visually quiet.

## Deliberate omissions

Stash and tag quick references are omitted: no stash/tag commands exist
in the encyclopedia, and this layer invents no content. `git blame` is
omitted for the same reason.
