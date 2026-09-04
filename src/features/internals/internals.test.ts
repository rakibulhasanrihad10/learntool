import { describe, it, expect } from 'vitest';
import { INTERNALS_REPO, detachedRepo } from './dataset';
import {
  branchTips,
  commitParents,
  getObject,
  isReachable,
  objectKind,
  outgoingHops,
  pointersTo,
  reachableFrom,
  resolveHead,
  resolveRef,
  shortId,
  traceStarts,
} from './traversal';
import { internalsToSimState } from './adapter';

describe('internals dataset integrity', () => {
  it('every outgoing reference resolves to an existing object', () => {
    for (const obj of Object.values(INTERNALS_REPO.objects)) {
      if (obj.kind === 'commit') {
        for (const p of obj.parents) expect(getObject(INTERNALS_REPO, p), `parent ${p}`).toBeDefined();
        expect(getObject(INTERNALS_REPO, obj.tree), `tree ${obj.tree}`).toBeDefined();
      }
      if (obj.kind === 'tree') {
        for (const e of obj.entries) expect(getObject(INTERNALS_REPO, e.target), `entry ${e.name}`).toBeDefined();
      }
      if (obj.kind === 'tag') {
        expect(getObject(INTERNALS_REPO, obj.target), `tag target ${obj.target}`).toBeDefined();
      }
    }
    for (const ref of INTERNALS_REPO.refs) {
      expect(getObject(INTERNALS_REPO, ref.target), `ref ${ref.name}`).toBeDefined();
    }
  });

  it('has the canonical shape: merge on main, feature fork, lagging origin/main', () => {
    expect(resolveRef(INTERNALS_REPO, 'main')).toBe('M1');
    expect(resolveRef(INTERNALS_REPO, 'feature')).toBe('F2');
    expect(resolveRef(INTERNALS_REPO, 'origin/main')).toBe('C3');
    expect(resolveRef(INTERNALS_REPO, 'v1.0')).toBe('C3'); // annotated tag unwraps
    expect(resolveRef(INTERNALS_REPO, 'nope')).toBeUndefined();
  });
});

describe('HEAD resolution', () => {
  it('resolves symbolic HEAD through the branch to a commit', () => {
    const r = resolveHead(INTERNALS_REPO);
    expect(r.head.kind).toBe('symbolic');
    expect(r.ref).toBe('main');
    expect(r.commit).toBe('M1');
  });

  it('resolves detached HEAD directly to a commit with no branch', () => {
    const r = resolveHead(detachedRepo());
    expect(r.head.kind).toBe('detached');
    expect(r.ref).toBeUndefined();
    expect(r.commit).toBe('C3');
  });
});

describe('object relationships', () => {
  it('reports commit parents including both merge parents', () => {
    expect(commitParents(INTERNALS_REPO, 'M1')).toEqual(['C3', 'F2']);
    expect(commitParents(INTERNALS_REPO, 'C1')).toEqual([]);
    expect(commitParents(INTERNALS_REPO, 'B1')).toEqual([]);
    expect(commitParents(INTERNALS_REPO, 'missing')).toEqual([]);
  });

  it('distinguishes object kinds', () => {
    expect(objectKind(INTERNALS_REPO, 'B1')).toBe('blob');
    expect(objectKind(INTERNALS_REPO, 'T3')).toBe('tree');
    expect(objectKind(INTERNALS_REPO, 'C3')).toBe('commit');
    expect(objectKind(INTERNALS_REPO, 'G1')).toBe('tag');
    expect(objectKind(INTERNALS_REPO, 'missing')).toBeUndefined();
  });

  it('lists everything pointing at a node (refs, parents, entries, tags, reflog)', () => {
    const toC3 = pointersTo(INTERNALS_REPO, 'C3');
    const vias = toC3.map((p) => p.via);
    expect(vias).toContain('remote-tracking ref'); // origin/main→C3; no branch points here
    expect(toC3.some((p) => p.to === 'origin/main')).toBe(true);
    expect(toC3.some((p) => p.via === 'parent of' && p.to === 'M1')).toBe(true);
    expect(toC3.some((p) => p.via === 'tag object')).toBe(true); // G1 targets C3
    expect(toC3.some((p) => p.via.startsWith('reflog'))).toBe(true);
    // B3 shared across trees is pointed at by multiple entries
    expect(pointersTo(INTERNALS_REPO, 'B3').filter((p) => p.via.startsWith('tree entry')).length).toBeGreaterThanOrEqual(2);
    // blobs are leaves for outgoing hops but still listable
    expect(pointersTo(INTERNALS_REPO, 'B1').length).toBeGreaterThan(0);
  });
});

describe('reachability', () => {
  it('walks parent links from branch tips', () => {
    const reached = reachableFrom(INTERNALS_REPO, branchTips(INTERNALS_REPO));
    expect([...reached].sort()).toEqual(['C1', 'C2', 'C3', 'F1', 'F2', 'M1']);
  });

  it('answers isReachable queries used by recovery/gc lessons', () => {
    const tip = (ref: string) => resolveRef(INTERNALS_REPO, ref) as string;
    expect(isReachable(INTERNALS_REPO, [tip('main')], 'C1')).toBe(true);
    expect(isReachable(INTERNALS_REPO, [tip('feature')], 'C1')).toBe(true);
    expect(isReachable(INTERNALS_REPO, [tip('feature')], 'M1')).toBe(false);
    expect(isReachable(INTERNALS_REPO, [tip('main')], 'F2')).toBe(true); // via merge parent
  });

  it('is cycle-safe and tolerant of unknown tips', () => {
    expect(reachableFrom(INTERNALS_REPO, ['missing'])).toEqual(new Set());
    expect(isReachable(INTERNALS_REPO, [], 'C1')).toBe(false);
  });
});

describe('follow-the-pointer traversal', () => {
  it('offers HEAD, commit, and remote-tracking starts', () => {
    expect(traceStarts().map((s) => s.id)).toEqual(['HEAD', 'C3', 'origin/main']);
  });

  it('traces HEAD → main → M1 → parents/tree', () => {
    const fromHead = outgoingHops(INTERNALS_REPO, 'head', 'HEAD');
    expect(fromHead).toEqual([{ kind: 'ref', id: 'main', via: 'branch' }]);
    const fromMain = outgoingHops(INTERNALS_REPO, 'ref', 'main');
    expect(fromMain).toEqual([{ kind: 'commit', id: 'M1', via: 'branch' }]);
    const fromM1 = outgoingHops(INTERNALS_REPO, 'commit', 'M1');
    expect(fromM1).toContainEqual({ kind: 'commit', id: 'C3', via: 'parent 1' });
    expect(fromM1).toContainEqual({ kind: 'commit', id: 'F2', via: 'parent 2' });
    expect(fromM1).toContainEqual({ kind: 'tree', id: 'T3', via: 'tree' });
  });

  it('traces trees down to blobs (T3 → src → main.js blob)', () => {
    const entries = outgoingHops(INTERNALS_REPO, 'tree', 'T3');
    expect(entries).toContainEqual({ kind: 'blob', id: 'B2', via: 'README.md' });
    const src = outgoingHops(INTERNALS_REPO, 'tree', 'T2');
    expect(src).toContainEqual({ kind: 'blob', id: 'B4', via: 'main.js' });
    expect(outgoingHops(INTERNALS_REPO, 'blob', 'B4')).toEqual([]); // leaves
  });

  it('traces tags and reflog entries to commits', () => {
    expect(outgoingHops(INTERNALS_REPO, 'tag', 'G1')).toEqual([{ kind: 'commit', id: 'C3', via: 'target' }]);
    expect(outgoingHops(INTERNALS_REPO, 'reflog', 'HEAD@{0}')).toEqual([
      { kind: 'commit', id: 'M1', via: 'points to' },
    ]);
  });

  it('handles unknown nodes gracefully (invalid routes/ids)', () => {
    expect(outgoingHops(INTERNALS_REPO, 'commit', 'missing')).toEqual([]);
    expect(outgoingHops(INTERNALS_REPO, 'ref', 'missing')).toEqual([]);
    expect(outgoingHops(INTERNALS_REPO, 'tree', 'B1')).toEqual([]);
    expect(outgoingHops(INTERNALS_REPO, 'reflog', 'nope')).toEqual([]);
    expect(shortId('abcdef123456')).toBe('abcdef1');
    expect(shortId('C3')).toBe('C3');
  });
});

describe('CommitGraph adapter (Phase 6 reuse, no second graph engine)', () => {
  it('projects commits, branches, and tracking refs onto simulation state', () => {
    const sim = internalsToSimState(INTERNALS_REPO);
    expect(sim.commits.map((c) => c.id).sort()).toEqual(['C1', 'C2', 'C3', 'F1', 'F2', 'M1']);
    expect(sim.localBranches).toEqual({ main: 'M1', feature: 'F2' });
    expect(sim.remoteTracking).toEqual({ 'origin/main': 'C3' });
    expect(sim.currentBranch).toBe('main');
    const m1 = sim.commits.find((c) => c.id === 'M1');
    expect(m1?.parents).toEqual(['C3', 'F2']); // merge preserved for graph rendering
    expect(sim.files).toEqual([]);
  });
});
