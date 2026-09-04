/**
 * Adapter: project the internals teaching repo onto GitSimulationState so the
 * Phase 6 CommitGraph renders the commit DAG with zero duplicated graph code.
 * Read-only projection — the explorer never mutates simulation state.
 */
import { GitSimulationState } from '@/features/simulation/models';
import { InternalsRepo } from './models';

export function internalsToSimState(repo: InternalsRepo): GitSimulationState {
  const commits = Object.values(repo.objects)
    .filter((o) => o.kind === 'commit')
    .map((o) => {
      if (o.kind !== 'commit') throw new Error('unreachable');
      return { id: o.id, message: o.message, parents: [...o.parents] };
    });

  const localBranches: Record<string, string> = {};
  const remoteTracking: Record<string, string> = {};
  for (const ref of repo.refs) {
    if (ref.kind === 'branch') localBranches[ref.name] = ref.target;
    if (ref.kind === 'remote-tracking') remoteTracking[ref.name] = ref.target;
  }

  const currentBranch =
    repo.head.kind === 'symbolic' && localBranches[repo.head.target] !== undefined
      ? repo.head.target
      : Object.keys(localBranches)[0] ?? 'main';

  return {
    files: [],
    commits,
    localBranches,
    remoteTracking,
    serverBranches: {},
    serverOnly: [],
    currentBranch,
    seq: 1000,
  };
}
