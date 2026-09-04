/**
 * Educational Git-internals model.
 *
 * A SMALL, deterministic, client-side-only picture of a repository's object
 * database plus references. It is intentionally not a real Git implementation:
 * no filesystem access, no shell execution, no network, no real hashing.
 * IDs are short readable labels ("C3", "T3", "B1") standing in for SHA hashes.
 */
import { LocalText } from '@/types/content';

export type ObjectKind = 'blob' | 'tree' | 'commit' | 'tag';

export interface BlobNode {
  kind: 'blob';
  /** Short label standing in for the SHA hash, e.g. "B1". Never translated. */
  id: string;
  /** File this content came from, e.g. "README.md". Never translated. */
  fileName: string;
  bytes: number;
  note: LocalText;
}

export interface TreeEntry {
  /** Entry name, e.g. "src". Never translated. */
  name: string;
  targetKind: 'blob' | 'tree';
  /** Target object id. Never translated. */
  target: string;
}

export interface TreeNode {
  kind: 'tree';
  id: string;
  entries: TreeEntry[];
}

export interface CommitNode {
  kind: 'commit';
  id: string;
  message: string;
  author: string;
  /** Parent commit ids — two entries for merge commits. Never translated. */
  parents: string[];
  /** Root tree id. Never translated. */
  tree: string;
  merge?: boolean;
}

export interface TagNode {
  kind: 'tag';
  id: string;
  /** Tag name, e.g. "v1.0". Never translated. */
  name: string;
  target: string;
  annotated: boolean;
  message?: string;
}

export type GitObjectNode = BlobNode | TreeNode | CommitNode | TagNode;

export type RefKind = 'branch' | 'remote-tracking' | 'tag-ref';

export interface GitRefNode {
  /** Ref name, e.g. "main" or "origin/main". Never translated. */
  name: string;
  kind: RefKind;
  /** Target object id (commits) — tags may target the tag object. */
  target: string;
}

export type HeadState =
  | { kind: 'symbolic'; target: string }
  | { kind: 'detached'; target: string };

export interface ReflogEntry {
  /** Ref name, e.g. "HEAD". Never translated. */
  ref: string;
  index: number;
  from: string | null;
  to: string;
  reason: LocalText;
}

export interface IndexEntry {
  /** Working-tree path. Never translated. */
  path: string;
  /** Staged blob id. Never translated. */
  blob: string;
}

export interface InternalsRepo {
  objects: Record<string, GitObjectNode>;
  refs: GitRefNode[];
  head: HeadState;
  reflog: ReflogEntry[];
  index: IndexEntry[];
  workingTree: string[];
}

/** Selectable concepts in the explorer (matches INTERNALS_CONCEPTS ids). */
export type ConceptId =
  | 'working-tree'
  | 'index'
  | 'commit'
  | 'tree'
  | 'blob'
  | 'branch'
  | 'head'
  | 'remote-tracking'
  | 'reflog'
  | 'tag'
  | 'object-db';
