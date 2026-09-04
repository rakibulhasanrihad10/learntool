import { DifficultyLevel } from './content';

export type ChallengeType =
  | 'command_recall'
  | 'concept_question'
  | 'troubleshooting'
  | 'multiple_choice'
  | 'practical_task';

export type ContentStatus = 'not_started' | 'in_progress' | 'completed';

export interface UserLevel {
  level: number;
  title: string;
  titleBn: string;
  minXp: number;
  maxXp: number;
  currentLevelXp: number;
  xpRequiredForNextLevel: number;
  progressPercent: number;
}

export interface LearningProgress {
  contentId: string; // e.g. "git.fundamentals.intro"
  status: ContentStatus;
  progressPercent: number;
  startedAt?: string;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface Achievement {
  id: string; // e.g. "first_commit"
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  iconName: string;
  category: 'progress' | 'streak' | 'mastery' | 'career';
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  history: string[]; // List of active date strings
}

export interface DailyChallenge {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  type: ChallengeType;
  difficulty: DifficultyLevel;
  xpReward: number;
  date: string; // YYYY-MM-DD
  isCompleted: boolean;
  contentRef?: string;
  targetCommand?: string;
  /** Practice exercise id (e.g. `git.practice.basic-commit`) for a full hands-on version. */
  practiceRef?: string;
  options?: { id: string; text: string; textBn?: string; isCorrect: boolean }[];
  hint?: string;
  hintBn?: string;
}

export interface UserProgress {
  totalXp: number;
  level: number;
  streak: Streak;
  completedLessonIds: string[]; // Content IDs
  completedChallengeIds: string[];
  unlockedAchievementIds: string[];
  learningProgress: Record<string, LearningProgress>;
  lastUpdated: string;
}

export interface XPConfig {
  lessonCompleted: number;
  moduleCompleted: number;
  quizPassed: number;
  practiceLabCompleted: number;
  dailyChallenge: number;
  streakBonus: number;
}
