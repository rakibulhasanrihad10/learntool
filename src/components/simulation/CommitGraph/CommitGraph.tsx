import React, { useMemo } from 'react';
import { useTranslation } from '@/i18n/context';
import { GitSimulationState, SimCommit } from '@/features/simulation/models';
import { localTip } from '@/features/simulation/engine';
import { branchesAt, headDescription, trackingAt } from '@/features/simulation/selectors';
import './CommitGraph.css';

export interface CommitGraphProps {
  state: GitSimulationState;
  className?: string;
}

const LANE_H = 56;
const DEPTH_W = 116;
const PAD_X = 30;
const PAD_TOP = 44;
const NODE_R = 13;

interface PlacedNode {
  commit: SimCommit;
  x: number;
  y: number;
  lane: number;
  depth: number;
}

function computeDepth(commits: SimCommit[]): Map<string, number> {
  const depth = new Map<string, number>();
  const visit = (id: string, trail: string[] = []): number => {
    const cached = depth.get(id);
    if (cached !== undefined) return cached;
    if (trail.includes(id)) return 0; // safety: never loop forever
    const c = commits.find((k) => k.id === id);
    const d = c && c.parents.length > 0 ? Math.max(...c.parents.map((p) => visit(p, [...trail, id]))) + 1 : 0;
    depth.set(id, d);
    return d;
  };
  for (const c of commits) visit(c.id);
  return depth;
}

/**
 * Lightweight SVG commit graph: nodes for commits, edges for parent links,
 * badges for branches / HEAD / remote-tracking refs, merge markers.
 * A <details> text alternative keeps the graph usable with screen readers.
 */
export const CommitGraph: React.FC<CommitGraphProps> = ({ state, className }) => {
  const { language, t } = useTranslation();
  const s = t.pages.simulator;

  const { nodes, edges, width, height, laneCount } = useMemo(() => {
    const commits = state.commits;
    const depth = computeDepth(commits);
    const branchOrder = Object.keys(state.localBranches);

    // Lane assignment: tips take their branch lane; others inherit the
    // smallest lane among their children (keeps main straight, forks splayed).
    const children = new Map<string, string[]>();
    for (const c of commits) {
      for (const p of c.parents) {
        children.set(p, [...(children.get(p) ?? []), c.id]);
      }
    }
    const laneOf = new Map<string, number>();
    for (const [name, tip] of Object.entries(state.localBranches)) {
      laneOf.set(tip, Math.max(0, branchOrder.indexOf(name)));
    }
    const byDepthDesc = [...commits].sort((a, b) => (depth.get(b.id) ?? 0) - (depth.get(a.id) ?? 0));
    for (const c of byDepthDesc) {
      if (laneOf.has(c.id)) continue;
      const kids = children.get(c.id) ?? [];
      const kidLanes = kids.map((k) => laneOf.get(k)).filter((l): l is number => l !== undefined);
      laneOf.set(c.id, kidLanes.length > 0 ? Math.min(...kidLanes) : 0);
    }
    // Unreachable leftovers (e.g. abandoned pre-rebase commits) get own lanes.
    let extraLane = branchOrder.length;
    for (const c of commits) {
      if (!laneOf.has(c.id)) laneOf.set(c.id, extraLane++);
    }

    const nodes: PlacedNode[] = commits.map((commit) => {
      const lane = laneOf.get(commit.id) ?? 0;
      const d = depth.get(commit.id) ?? 0;
      return { commit, lane, depth: d, x: PAD_X + d * DEPTH_W, y: PAD_TOP + lane * LANE_H };
    });
    const byId = new Map(nodes.map((n) => [n.commit.id, n]));
    const edges: { x1: number; y1: number; x2: number; y2: number; merge: boolean }[] = [];
    for (const n of nodes) {
      for (const p of n.commit.parents) {
        const parent = byId.get(p);
        if (parent) edges.push({ x1: parent.x, y1: parent.y, x2: n.x, y2: n.y, merge: n.commit.parents.length > 1 });
      }
    }
    const maxDepth = Math.max(0, ...nodes.map((n) => n.depth));
    const maxLane = Math.max(0, ...nodes.map((n) => n.lane));
    return {
      nodes,
      edges,
      width: PAD_X * 2 + maxDepth * DEPTH_W + 190,
      height: PAD_TOP + (maxLane + 1) * LANE_H + 40,
      laneCount: maxLane + 1,
    };
  }, [state]);

  const tip = localTip(state);
  const textLines = [...nodes]
    .sort((a, b) => b.depth - a.depth)
    .map((n) => {
      const labels = [...branchesAt(state, n.commit.id), ...trackingAt(state, n.commit.id)];
      if (n.commit.id === tip) labels.push('HEAD');
      return `${n.commit.id}: ${n.commit.message}${labels.length > 0 ? ` (${labels.join(', ')})` : ''}`;
    });

  return (
    <div className={`sim-graph${className ? ` ${className}` : ''}`}>
      <h3 className="title-md sim-graph__title">{s.commitGraph}</h3>
      <div className="sim-graph__scroll">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={headDescription(state, language)}
          className="sim-graph__svg"
        >
          {/* lane guides */}
          {Array.from({ length: laneCount }, (_, i) => (
            <line
              key={i}
              x1={0}
              y1={PAD_TOP + i * LANE_H}
              x2={width}
              y2={PAD_TOP + i * LANE_H}
              className="sim-graph__lane"
            />
          ))}
          {/* edges */}
          {edges.map((e, i) => (
            <line
              key={i}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              className={e.merge ? 'sim-graph__edge sim-graph__edge--merge' : 'sim-graph__edge'}
            />
          ))}
          {/* nodes */}
          {nodes.map((n) => {
            const isTip = n.commit.id === tip;
            const branchBadges = branchesAt(state, n.commit.id);
            const trackBadges = trackingAt(state, n.commit.id);
            const isMerge = n.commit.parents.length > 1;
            return (
              <g key={n.commit.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isTip ? NODE_R + 3 : NODE_R}
                  className={`sim-graph__node${isTip ? ' sim-graph__node--head' : ''}${isMerge ? ' sim-graph__node--merge' : ''}`}
                />
                <text x={n.x} y={n.y + 4} textAnchor="middle" className="sim-graph__node-label">
                  {n.commit.id.length > 4 ? n.commit.id.slice(0, 4) : n.commit.id}
                </text>
                {branchBadges.map((b, bi) => (
                  <g key={b}>
                    <rect
                      x={n.x + 20}
                      y={n.y - 12 + bi * 22}
                      width={b.length * 8 + 20}
                      height={18}
                      rx={9}
                      className={b === state.currentBranch ? 'sim-graph__badge sim-graph__badge--current' : 'sim-graph__badge'}
                    />
                    <text x={n.x + 30} y={n.y + 1 + bi * 22} className="sim-graph__badge-label">{b}</text>
                  </g>
                ))}
                {isTip && (
                  <text x={n.x} y={n.y - 22} textAnchor="middle" className="sim-graph__head-label">HEAD</text>
                )}
                {trackBadges.map((b, bi) => (
                  <g key={b}>
                    <rect
                      x={n.x - 8}
                      y={n.y + 16 + bi * 20}
                      width={b.length * 7.5 + 16}
                      height={16}
                      rx={8}
                      className="sim-graph__badge sim-graph__badge--tracking"
                    />
                    <text x={n.x} y={n.y + 28.5 + bi * 20} textAnchor="middle" className="sim-graph__badge-label sim-graph__badge-label--tracking">{b}</text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <details className="sim-graph__alt">
        <summary className="label-sm sim-graph__alt-summary">{s.graphTextVersion}</summary>
        <p className="body-sm sim-graph__alt-head">{headDescription(state, language)}</p>
        <ul className="body-sm sim-graph__alt-list">
          {textLines.map((line) => (
            <li key={line} className="font-mono">{line}</li>
          ))}
        </ul>
      </details>
    </div>
  );
};
