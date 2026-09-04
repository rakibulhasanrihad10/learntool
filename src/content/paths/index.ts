/**
 * Learning path registry — data only, no UI.
 * Paths reference existing stable content ids; see `src/types/learningPath.ts`.
 */
import { LearningPath } from '@/types/learningPath';
import { GIT_BEGINNER_PATH } from './gitBeginner';
import { GIT_INTERMEDIATE_PATH } from './gitIntermediate';
import { GIT_ADVANCED_PATH } from './gitAdvanced';

export { GIT_BEGINNER_PATH, GIT_INTERMEDIATE_PATH, GIT_ADVANCED_PATH };

export const LEARNING_PATHS: LearningPath[] = [
  GIT_BEGINNER_PATH,
  GIT_INTERMEDIATE_PATH,
  GIT_ADVANCED_PATH,
].sort((a, b) => a.order - b.order);

export function getLearningPath(pathId: string): LearningPath | undefined {
  return LEARNING_PATHS.find((p) => p.id === pathId);
}

export function getPathsBySubject(subjectId: string): LearningPath[] {
  return LEARNING_PATHS.filter((p) => p.subjectId === subjectId).sort((a, b) => a.order - b.order);
}

/** All paths (across subjects) containing a step that references `contentId`. */
export function getPathsForContent(contentId: string): LearningPath[] {
  return LEARNING_PATHS.filter((p) => p.steps.some((s) => s.contentId === contentId));
}

export function getAdjacentPaths(pathId: string): {
  prev: LearningPath | undefined;
  next: LearningPath | undefined;
} {
  const idx = LEARNING_PATHS.findIndex((p) => p.id === pathId);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? LEARNING_PATHS[idx - 1] : undefined,
    next: idx < LEARNING_PATHS.length - 1 ? LEARNING_PATHS[idx + 1] : undefined,
  };
}
