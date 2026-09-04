import { DifficultyLevel, SubjectId } from './content';

/**
 * Application Modes:
 * - 'learning': Deep understanding, concept tutorials, structured lessons, visualizations, quizzes
 * - 'reference': Fast lookup, syntax, flags, copyable snippets, related workflows
 */
export type ModeType = 'learning' | 'reference';

export interface BreadcrumbItemMeta {
  label: string;
  labelBn?: string;
  path: string;
  isCurrent?: boolean;
}

export interface LearningPageMeta {
  id: string; // e.g., "git.branching.basics"
  subjectId: SubjectId;
  moduleId: string;
  lessonId?: string;
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  route: string;
  order: number;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  prerequisites?: string[];
  tags: string[];
  mode?: ModeType;
}

export interface PageMeta {
  id: string;
  titleKey: string;
  subtitleKey?: string;
  route: string;
  section: 'core' | 'reference' | 'practiceAndPrep';
  iconName: string;
}
