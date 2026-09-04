import { Command, LearningModule, TroubleshootingScenario, Workflow } from '@/types/content';

export interface GitFeatureState {
  currentModuleId: string | null;
  activeLessonId: string | null;
  bookmarkedCommandIds: string[];
  completedLessonIds: string[];
}

export interface GitCurriculumBundle {
  modules: LearningModule[];
  commands: Command[];
  workflows: Workflow[];
  troubleshooting: TroubleshootingScenario[];
}
