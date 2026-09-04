/**
 * Skill Assessment items — curated references into existing exercise tasks.
 * Content lives in exactly one place (the exercises); the assessment only
 * points at it. Six sections × three items; two items run the simulator inline.
 */
import { AssessmentItem } from '@/types/practice';

export const ASSESSMENT_ITEMS: AssessmentItem[] = [
  // Fundamentals
  { id: 'assess-f1', section: 'fundamentals', exerciseId: 'git.practice.initialize-repository', taskId: 't1' },
  { id: 'assess-f2', section: 'fundamentals', exerciseId: 'git.practice.command-inspect-status', taskId: 't1' },
  { id: 'assess-f3', section: 'fundamentals', exerciseId: 'git.practice.working-tree-vs-staging', taskId: 't1' },
  // Branching
  { id: 'assess-b1', section: 'branching', exerciseId: 'git.practice.command-identify-current-branch', taskId: 't1' },
  { id: 'assess-b2', section: 'branching', exerciseId: 'git.practice.switch-branches', taskId: 't2' },
  { id: 'assess-b3', section: 'branching', exerciseId: 'git.practice.create-feature-branch', taskId: 't1' },
  // Merging / rebasing
  { id: 'assess-m1', section: 'merging-rebasing', exerciseId: 'git.practice.command-fast-forward-merge', taskId: 't1' },
  { id: 'assess-m2', section: 'merging-rebasing', exerciseId: 'git.practice.merge-conflict-flow', taskId: 't1' },
  { id: 'assess-m3', section: 'merging-rebasing', exerciseId: 'git.practice.command-rebase-rewrites-history', taskId: 't1' },
  // Remote
  { id: 'assess-r1', section: 'remote', exerciseId: 'git.practice.command-fetch-vs-pull', taskId: 't1' },
  { id: 'assess-r2', section: 'remote', exerciseId: 'git.practice.command-connect-remote', taskId: 't1' },
  { id: 'assess-r3', section: 'remote', exerciseId: 'git.practice.fetch-changes', taskId: 't1' },
  // Recovery
  { id: 'assess-rec1', section: 'recovery', exerciseId: 'git.practice.command-undo-unwanted-change', taskId: 't1' },
  { id: 'assess-rec2', section: 'recovery', exerciseId: 'git.practice.recover-deleted-branch', taskId: 't1' },
  { id: 'assess-rec3', section: 'recovery', exerciseId: 'git.practice.command-recover-lost-commit', taskId: 't2' },
  // Internals
  { id: 'assess-i1', section: 'internals', exerciseId: 'git.practice.command-follow-head', taskId: 't1' },
  { id: 'assess-i2', section: 'internals', exerciseId: 'git.practice.command-interpret-graph', taskId: 't1' },
  { id: 'assess-i3', section: 'internals', exerciseId: 'git.practice.command-interpret-graph', taskId: 't2' },
];
