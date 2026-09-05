# Content Expansion & Quality Pass (Phase 16)

> Quality-first: fill genuine gaps, correct errors, strengthen links.
> No new engines, no duplicate content, no invented behavior.

## Gaps filled

- **Command Encyclopedia (27 → 31):** `git revert` (safe shared undo),
  `git stash` (shelving + pop vs apply), `git tag` (lightweight vs
  annotated, release publishing), `git config` (identity +
  system/global/local levels). Full bilingual entries: purpose, usage,
  internals, examples, options, mistakes, interview insight, relations.
- **Troubleshooting (20 → 23):** `unrelated-histories` (merge-base
  explanation + allow-or-reclone), `stale-remote-tracking` (prune +
  photograph model), `gitignore-tracked` (tracked-vs-ignored boundary).
- **Practice Labs (30 → 33):** `stash-changes` (everyday: select + order
  + pop/apply), `configure-identity` (fundamentals: select + precedence
  order), `revert-pushed-commit` (recovery: select + complete + audit).
  XP follows the difficulty rule (10/20/30); select tasks keep exactly
  one correct option; non-command labels carry Bangla.
- **Interview (80 → 86):** `reset-vs-revert`, `origin-vs-upstream`,
  `detached-head-meaning`, `fast-forward-vs-three-way`,
  `cmd-stash-pop-vs-apply`, `tag-lightweight-vs-annotated`.

## Verified already-correct (no changes)

- Hashing: object-ids lesson teaches SHA-1-common / SHA-256-exists
  accurately; no "always SHA-1" claim stands alone.
- `switch` vs `checkout`: switch entry explains checkout's dual legacy
  role without declaring it wrong; checkout entry retains branch switching.
- Terminology: working tree / working directory are introduced as paired
  names for one concept, not randomly swapped.
- `fetch` (never touches the tree), reset modes, reflog limits.

## Cross-linking

- New commands referenced from cheat sheet sections, quick actions
  (+stash), undo situations (revert), practice `relatedCommands`, and
  interview `relatedCommands`.
- New guides referenced from undo situations? No — cookbook links live
  in practice `relatedScenarios` where topical (`undo-last-commit`
  retained) and in guide `scenarios` adjacency.
- Search discovers everything automatically (index builds from
  catalogs); representative queries covered by tests.
- Mastery needs no mapping changes (existing categories reused);
  learning paths deliberately untouched (beginner stays approachable,
  existing users' percentages stable).

## Integrity validation

- New lightweight validator: every interview `related*` id must resolve
  (commands, all-module lessons, guides, exercises) — covers all 86.
- Updated counts: practice 30→33, interview 80→86, readiness thresholds
  re-expressed proportionally (18/43/61).
- Cheat sheet tests extended (revert/stash/tag/config presence).

## Deferred (genuine gaps, lower priority)

- `cherry-pick` / `worktree` / `blame` encyclopedia entries and
  submodule coverage: real Git, but niche next to the filled gaps;
  prose mentions remain accurate without dedicated pages.
- Path steps for the new commands: fits via search/cheat sheet/mastery
  today; path edits would shift existing users' progress.
