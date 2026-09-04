/**
 * Pure pointer-traversal helpers over InternalsRepo.
 * No mutation, no I/O — cycle-safe graph walks for the explorer UI.
 */
import {
  GitObjectNode,
  HeadState,
  InternalsRepo,
  ObjectKind,
} from './models';

export function getObject(repo: InternalsRepo, id: string): GitObjectNode | undefined {
  return repo.objects[id];
}

export function objectKind(repo: InternalsRepo, id: string): ObjectKind | undefined {
  return repo.objects[id]?.kind;
}

/** Shorten an id for display (already short in the teaching dataset). */
export function shortId(id: string): string {
  return id.length > 7 ? id.slice(0, 7) : id;
}

/** Resolve a ref name to the commit it (transitively) points at. Tags unwrap to their target commit. */
export function resolveRef(repo: InternalsRepo, name: string): string | undefined {
  const ref = repo.refs.find((r) => r.name === name);
  if (!ref) return undefined;
  let current = ref.target;
  const seen = new Set<string>([current]);
  for (let i = 0; i < 8; i += 1) {
    const obj = repo.objects[current];
    if (!obj) return undefined;
    if (obj.kind === 'commit') return current;
    if (obj.kind === 'tag') {
      if (seen.has(obj.target)) return undefined;
      seen.add(obj.target);
      current = obj.target;
      continue;
    }
    return undefined; // branches never point at blobs/trees
  }
  return undefined;
}

export interface HeadResolution {
  head: HeadState;
  /** Branch name when attached, undefined when detached. */
  ref?: string;
  /** Commit HEAD resolves to. */
  commit?: string;
}

/** Resolve HEAD through the symbolic layer to a branch (attached) or commit (detached). */
export function resolveHead(repo: InternalsRepo): HeadResolution {
  if (repo.head.kind === 'detached') {
    const obj = repo.objects[repo.head.target];
    return {
      head: repo.head,
      commit: obj?.kind === 'commit' ? repo.head.target : undefined,
    };
  }
  const commit = resolveRef(repo, repo.head.target);
  return { head: repo.head, ref: repo.head.target, commit };
}

export function commitParents(repo: InternalsRepo, commitId: string): string[] {
  const obj = repo.objects[commitId];
  return obj?.kind === 'commit' ? [...obj.parents] : [];
}

/** All commit ids reachable by walking parent links from the given tips (cycle-safe). */
export function reachableFrom(repo: InternalsRepo, tips: string[]): Set<string> {
  const seen = new Set<string>();
  const stack = [...tips];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    if (seen.has(current)) continue;
    const obj = repo.objects[current];
    if (!obj || obj.kind !== 'commit') continue;
    seen.add(current);
    stack.push(...obj.parents);
  }
  return seen;
}

export function isReachable(repo: InternalsRepo, fromTips: string[], commitId: string): boolean {
  return reachableFrom(repo, fromTips).has(commitId);
}

/** Branch tips (local branches) as entry points for whole-history walks. */
export function branchTips(repo: InternalsRepo): string[] {
  return repo.refs.filter((r) => r.kind === 'branch').map((r) => r.target);
}

export interface PointerTarget {
  /** Human-readable hop label, e.g. "parent", "tree", "branch main". Never translated (technical). */
  via: string;
  /** Destination node id (object id or ref name or HEAD). */
  to: string;
}

/**
 * Everything that points at the given node: refs, child commits (as parents),
 * tree entries, tag objects, and reflog mentions. Powers "what points to it".
 */
export function pointersTo(repo: InternalsRepo, id: string): PointerTarget[] {
  const out: PointerTarget[] = [];
  if (repo.head.kind === 'symbolic' && repo.head.target === id) {
    out.push({ via: 'HEAD (symbolic)', to: 'HEAD' });
  }
  if (repo.head.kind === 'detached' && repo.head.target === id) {
    out.push({ via: 'HEAD (detached)', to: 'HEAD' });
  }
  for (const ref of repo.refs) {
    if (ref.target === id) out.push({ via: `${ref.kind} ref`, to: ref.name });
  }
  for (const obj of Object.values(repo.objects)) {
    if (obj.kind === 'commit' && obj.parents.includes(id)) {
      out.push({ via: 'parent of', to: obj.id });
    }
    if (obj.kind === 'tree') {
      for (const e of obj.entries) {
        if (e.target === id) out.push({ via: `tree entry "${e.name}" of`, to: obj.id });
      }
    }
    if (obj.kind === 'tag' && obj.target === id) {
      out.push({ via: 'tag object', to: obj.id });
    }
  }
  for (const entry of repo.reflog) {
    if (entry.to === id || entry.from === id) {
      out.push({ via: `reflog ${entry.ref}@{${entry.index}}`, to: `${entry.ref}@{${entry.index}}` });
    }
  }
  return out;
}

export type TraceNodeKind = 'head' | 'ref' | 'commit' | 'tree' | 'blob' | 'tag' | 'reflog';

export interface TraceNode {
  kind: TraceNodeKind;
  /** Node id: object id, ref name, "HEAD", or "HEAD@{n}". */
  id: string;
  /** Outgoing hop label. */
  via: string;
}

/**
 * Outgoing hops from any traceable node — the engine behind "follow the pointer".
 * Examples: HEAD → main → C3 → parent C2 / tree T3 → src tree → main.js blob.
 */
export function outgoingHops(repo: InternalsRepo, kind: TraceNodeKind, id: string): TraceNode[] {
  if (kind === 'head') {
    if (repo.head.kind === 'symbolic') {
      return [{ kind: 'ref', id: repo.head.target, via: 'branch' }];
    }
    return [{ kind: 'commit', id: repo.head.target, via: 'detached at' }];
  }
  if (kind === 'ref') {
    const ref = repo.refs.find((r) => r.name === id);
    if (!ref) return [];
    const obj = repo.objects[ref.target];
    if (!obj) return [];
    if (obj.kind === 'commit') return [{ kind: 'commit', id: ref.target, via: `${ref.kind}` }];
    if (obj.kind === 'tag') return [{ kind: 'tag', id: ref.target, via: 'tag object' }];
    return [];
  }
  if (kind === 'commit') {
    const obj = repo.objects[id];
    if (!obj || obj.kind !== 'commit') return [];
    const hops: TraceNode[] = obj.parents.map((p, i) => ({
      kind: 'commit' as const,
      id: p,
      via: obj.parents.length > 1 ? `parent ${i + 1}` : 'parent',
    }));
    hops.push({ kind: 'tree', id: obj.tree, via: 'tree' });
    return hops;
  }
  if (kind === 'tree') {
    const obj = repo.objects[id];
    if (!obj || obj.kind !== 'tree') return [];
    return obj.entries.map((e) => ({
      kind: (e.targetKind === 'blob' ? 'blob' : 'tree') as TraceNodeKind,
      id: e.target,
      via: e.name,
    }));
  }
  if (kind === 'tag') {
    const obj = repo.objects[id];
    if (!obj || obj.kind !== 'tag') return [];
    const target = repo.objects[obj.target];
    return [
      {
        kind: (target?.kind === 'commit' ? 'commit' : 'blob') as TraceNodeKind,
        id: obj.target,
        via: 'target',
      },
    ];
  }
  if (kind === 'reflog') {
    const match = /^(.+)@\{(\d+)\}$/.exec(id);
    if (!match) return [];
    const entry = repo.reflog.find((e) => e.ref === match[1] && e.index === Number(match[2]));
    if (!entry) return [];
    const target = repo.objects[entry.to];
    return [
      {
        kind: (target?.kind === 'commit' ? 'commit' : 'blob') as TraceNodeKind,
        id: entry.to,
        via: 'points to',
      },
    ];
  }
  return []; // blobs are leaves
}

/** Starting points offered by follow-the-pointer mode. */
export function traceStarts(): TraceNode[] {
  return [
    { kind: 'head', id: 'HEAD', via: 'start' },
    { kind: 'commit', id: 'C3', via: 'start' },
    { kind: 'ref', id: 'origin/main', via: 'start' },
  ];
}
