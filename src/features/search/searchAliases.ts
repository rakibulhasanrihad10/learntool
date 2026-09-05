/**
 * Deterministic concept expansion for natural queries (Phase 14).
 *
 * Maps everyday words to the technical tokens GitVerse content actually
 * uses. Expansion is OR-within-token (any expansion may satisfy the token)
 * while tokens keep AND semantics across the query. All expansions point
 * at real catalog vocabulary — commands, slugs, tags, keywords.
 */

/** token → equivalent technical tokens (lowercase, no duplicates of key). */
export const QUERY_EXPANSIONS: Record<string, string[]> = {
  undo: ['reset', 'revert', 'restore', 'undo'],
  uncommit: ['reset', 'revert'],
  unstage: ['restore', 'reset'],
  revert: ['revert', 'reset'],
  download: ['fetch', 'pull', 'clone'],
  get: ['fetch', 'pull', 'clone'],
  receive: ['fetch', 'pull'],
  send: ['push'],
  upload: ['push'],
  publish: ['push', 'pull-request'],
  share: ['push', 'pull-request'],
  copy: ['clone', 'branch'],
  duplicate: ['clone', 'branch'],
  delete: ['reset', 'restore', 'revert', 'branch'],
  remove: ['restore', 'reset', 'revert'],
  discard: ['restore', 'reset', 'checkout'],
  fix: ['troubleshooting', 'recovery', 'conflict'],
  broken: ['troubleshooting', 'recovery', 'conflict'],
  mistake: ['recovery', 'restore', 'reset', 'revert'],
  lost: ['reflog', 'recovery', 'recover'],
  recover: ['reflog', 'recovery', 'restore', 'recover'],
  save: ['commit', 'stash', 'add'],
  record: ['commit'],
  snapshot: ['commit'],
  history: ['log', 'history', 'reflog'],
  see: ['show', 'log', 'status', 'diff'],
  view: ['show', 'log', 'status', 'diff'],
  check: ['status', 'show', 'log', 'diff'],
  compare: ['diff'],
  differences: ['diff'],
  changes: ['diff', 'status', 'log'],
  combine: ['merge', 'rebase'],
  join: ['merge'],
  replay: ['rebase'],
  rewrite: ['rebase', 'reset'],
  sync: ['fetch', 'pull', 'push'],
  update: ['fetch', 'pull'],
  contribute: ['fork', 'pull-request', 'clone'],
  propose: ['pull-request'],
  review: ['review', 'pull-request'],
  collaborate: ['pull-request', 'fork', 'clone'],
  remote: ['remote', 'origin', 'upstream', 'fetch', 'pull', 'push'],
  server: ['remote', 'origin', 'push', 'fetch'],
  online: ['remote', 'push', 'github'],
  pointer: ['branch', 'reference', 'head'],
  marker: ['tag', 'branch', 'reference'],
  label: ['tag', 'branch'],
  whereami: ['head', 'status', 'branch'],
  beginners: ['beginner', 'fundamentals'],
  start: ['beginner', 'fundamentals', 'init'],
  roadmap: ['path', 'beginner', 'intermediate', 'advanced'],
  learn: ['path', 'lesson', 'fundamentals'],
  test: ['practice', 'assessment', 'mock', 'interview'],
  exam: ['assessment', 'interview', 'mock'],
  prepare: ['interview', 'practice', 'assessment'],
  questions: ['interview'],
  job: ['interview'],
  storage: ['objects', 'packfiles', 'database'],
  files: ['blob', 'tree', 'objects'],
  folders: ['tree'],
  directories: ['tree'],
  under: ['internals', 'objects', 'plumbing'],
  hood: ['internals', 'plumbing'],
  inside: ['internals', 'objects'],
  secure: ['secret', 'security'],
  leak: ['secret', 'security'],
  password: ['secret', 'security'],
  key: ['secret', 'reflog', 'security'],
};

/**
 * Stopwords carry no content signal in Git queries. Removed before
 * matching (but kept for display/highlight decisions by callers).
 */
export const STOPWORDS: Set<string> = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'do', 'does', 'for',
  'from', 'git', 'how', 'i', 'in', 'is', 'it', 'my', 'of', 'on', 'or',
  'the', 'to', 'vs', 'versus', 'what', 'why', 'with', 'you', 'your',
  'কি', 'কী', 'কেন', 'কিভাবে', 'করতে',
]);

export function expandToken(token: string): string[] {
  const t = token.toLowerCase().trim();
  if (!t) return [];
  const expansions = QUERY_EXPANSIONS[t] ?? [];
  return [t, ...expansions.filter((e) => e !== t)];
}
