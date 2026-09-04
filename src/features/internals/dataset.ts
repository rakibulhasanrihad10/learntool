/**
 * Canonical teaching repository for the Internals Explorer.
 *
 * Shape mirrors the spec's canonical examples:
 *       F1 → F2
 *      /
 * C1 → C2 → C3 → M1   (main; M1 merges feature)
 *            ↑
 *        origin/main lags at C3 (fetch has not run yet)
 *
 * Short ids ("C3", "T3", "B1") stand in for real SHA hashes.
 */
import { GitObjectNode, InternalsRepo } from './models';

const objects: Record<string, GitObjectNode> = {
  B1: {
    kind: 'blob',
    id: 'B1',
    fileName: 'README.md',
    bytes: 412,
    note: { en: 'Original README bytes, shared by C1 and C2.', bn: 'মূল README বাইট, C1 ও C2 ভাগ করে।' },
  },
  B2: {
    kind: 'blob',
    id: 'B2',
    fileName: 'README.md',
    bytes: 438,
    note: { en: 'Edited README bytes first appearing in C3.', bn: 'সম্পাদিত README বাইট, প্রথম C3-এ এসেছে।' },
  },
  B3: {
    kind: 'blob',
    id: 'B3',
    fileName: 'package.json',
    bytes: 196,
    note: { en: 'Unchanged since C1 — one blob serves three commits.', bn: 'C1 থেকে অপরিবর্তিত — একটি ব্লব তিন কমিটে কাজ করে।' },
  },
  B4: {
    kind: 'blob',
    id: 'B4',
    fileName: 'src/main.js',
    bytes: 1024,
    note: { en: 'Login form implementation added on the feature branch.', bn: 'ফিচার ব্রাঞ্চে যোগ করা লগইন ফর্ম বাস্তবায়ন।' },
  },
  B5: {
    kind: 'blob',
    id: 'B5',
    fileName: 'src/utils.js',
    bytes: 388,
    note: { en: 'Validation helpers added alongside the login form.', bn: 'লগইন ফর্মের সাথে যোগ করা যাচাইকরণ হেলপার।' },
  },
  T1: {
    kind: 'tree',
    id: 'T1',
    entries: [
      { name: 'README.md', targetKind: 'blob', target: 'B1' },
      { name: 'package.json', targetKind: 'blob', target: 'B3' },
    ],
  },
  T2: {
    kind: 'tree',
    id: 'T2',
    entries: [
      { name: 'main.js', targetKind: 'blob', target: 'B4' },
      { name: 'utils.js', targetKind: 'blob', target: 'B5' },
    ],
  },
  T3: {
    kind: 'tree',
    id: 'T3',
    entries: [
      { name: 'README.md', targetKind: 'blob', target: 'B2' },
      { name: 'package.json', targetKind: 'blob', target: 'B3' },
      { name: 'src', targetKind: 'tree', target: 'T2' },
    ],
  },
  C1: {
    kind: 'commit',
    id: 'C1',
    message: 'Initial commit',
    author: 'you',
    parents: [],
    tree: 'T1',
  },
  C2: {
    kind: 'commit',
    id: 'C2',
    message: 'Add project scaffolding',
    author: 'you',
    parents: ['C1'],
    tree: 'T1',
  },
  C3: {
    kind: 'commit',
    id: 'C3',
    message: 'Update README',
    author: 'you',
    parents: ['C2'],
    tree: 'T3',
  },
  F1: {
    kind: 'commit',
    id: 'F1',
    message: 'Add login form',
    author: 'you',
    parents: ['C2'],
    tree: 'T3',
  },
  F2: {
    kind: 'commit',
    id: 'F2',
    message: 'Validate login input',
    author: 'you',
    parents: ['F1'],
    tree: 'T3',
  },
  M1: {
    kind: 'commit',
    id: 'M1',
    message: "Merge branch 'feature'",
    author: 'you',
    parents: ['C3', 'F2'],
    tree: 'T3',
    merge: true,
  },
  G1: {
    kind: 'tag',
    id: 'G1',
    name: 'v1.0',
    target: 'C3',
    annotated: true,
    message: 'Release 1.0',
  },
};

export const INTERNALS_REPO: InternalsRepo = {
  objects,
  refs: [
    { name: 'main', kind: 'branch', target: 'M1' },
    { name: 'feature', kind: 'branch', target: 'F2' },
    { name: 'origin/main', kind: 'remote-tracking', target: 'C3' },
    { name: 'v1.0', kind: 'tag-ref', target: 'G1' },
  ],
  head: { kind: 'symbolic', target: 'main' },
  reflog: [
    { ref: 'HEAD', index: 0, from: 'C3', to: 'M1', reason: { en: 'merge feature: Merge branch feature', bn: 'মার্জ feature: ব্রাঞ্চ মার্জ' } },
    { ref: 'HEAD', index: 1, from: 'F2', to: 'C3', reason: { en: 'checkout: moving from feature to main', bn: 'চেকআউট: feature থেকে main-এ যাওয়া' } },
    { ref: 'HEAD', index: 2, from: 'F1', to: 'F2', reason: { en: 'commit: Validate login input', bn: 'কমিট: লগইন ইনপুট যাচাই' } },
  ],
  index: [
    { path: 'README.md', blob: 'B2' },
    { path: 'package.json', blob: 'B3' },
  ],
  workingTree: ['README.md', 'package.json', 'src/main.js', 'src/utils.js'],
};

/** A detached-HEAD variant used by tests and the follow-pointer demo. */
export function detachedRepo(): InternalsRepo {
  return {
    ...INTERNALS_REPO,
    head: { kind: 'detached', target: 'C3' },
  };
}
