/**
 * Architectural contracts for the future Interactive Git Graph Visualizer
 *
 * Designed to support Canvas/SVG rendering of Working Directory -> Staging Area ->
 * Local Repository -> Remote Repository pipeline without altering AppShell layout.
 */

export type GitZone = 'working-tree' | 'staging-area' | 'local-repo' | 'remote-repo';

export interface VisualCommitNode {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  timestamp: number;
  parents: string[];
  branches: string[];
  tags: string[];
  isHead?: boolean;
}

export interface VisualBranchPointer {
  name: string;
  targetCommitHash: string;
  isCurrent: boolean;
  isRemote: boolean;
}

export interface GitVisualizerState {
  zone: GitZone;
  commits: VisualCommitNode[];
  branches: VisualBranchPointer[];
  headPointer: string;
  stagedFiles: string[];
  modifiedFiles: string[];
  untrackedFiles: string[];
}
