import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Achievement,
  DailyChallenge,
  LearningProgress,
  UserLevel,
  UserProgress,
} from '@/types/gamification';
import { storage } from '@/utils/storage';
import { calculateUserLevel } from './levelSystem';
import { getTodayDateString, recordStreakActivity } from './streakSystem';
import { ACHIEVEMENTS_CATALOG, getUnlockedAchievementsForLesson } from './achievements';
import { TODAY_CHALLENGE } from './dailyChallenge';
import { XP_CONFIG } from './config';

const STORAGE_KEY = 'gitverse_gamification_progress';

const INITIAL_PROGRESS: UserProgress = {
  totalXp: 0,
  level: 1,
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    history: [],
  },
  completedLessonIds: [],
  completedChallengeIds: [],
  unlockedAchievementIds: [],
  learningProgress: {},
  lastUpdated: new Date().toISOString(),
};

export interface GamificationContextValue {
  progress: UserProgress;
  userLevel: UserLevel;
  achievements: Achievement[];
  dailyChallenge: DailyChallenge;
  completeLesson: (contentId: string) => void;
  completeDailyChallenge: (challengeId: string) => void;
  isLessonCompleted: (contentId: string) => boolean;
  getLessonProgress: (contentId: string) => LearningProgress | undefined;
  passQuiz: (quizId: string) => void;
  isQuizPassed: (quizId: string) => boolean;
  awardXp: (amount: number, reason?: string) => void;
  grantAchievements: (ids: string[]) => void;
  resetProgress: () => void;
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    return storage.get<UserProgress>(STORAGE_KEY, INITIAL_PROGRESS);
  });

  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(() => {
    const isCompleted = progress.completedChallengeIds.includes(TODAY_CHALLENGE.id);
    return { ...TODAY_CHALLENGE, isCompleted };
  });

  // Sync to storage
  useEffect(() => {
    storage.set(STORAGE_KEY, progress);
  }, [progress]);

  const userLevel = useMemo(() => {
    return calculateUserLevel(progress.totalXp);
  }, [progress.totalXp]);

  const achievements = useMemo(() => {
    return ACHIEVEMENTS_CATALOG.map((item) => ({
      ...item,
      isUnlocked: progress.unlockedAchievementIds.includes(item.id),
    }));
  }, [progress.unlockedAchievementIds]);

  const completeLesson = (contentId: string) => {
    setProgress((prev) => {
      if (prev.completedLessonIds.includes(contentId)) {
        return prev;
      }

      const updatedStreak = recordStreakActivity(prev.streak);
      const newXp = prev.totalXp + XP_CONFIG.lessonCompleted;
      const completedList = [...prev.completedLessonIds, contentId];

      // Check for first commit achievement
      const newAchievements = [...prev.unlockedAchievementIds];
      if (!newAchievements.includes('first_commit')) {
        newAchievements.push('first_commit');
      }

      // Check for branch explorer if branching lesson completed
      if (contentId.startsWith('git.branching') && !newAchievements.includes('branch_explorer')) {
        newAchievements.push('branch_explorer');
      }

      // GitHub collaboration achievements (pure rules, no content imports)
      for (const id of getUnlockedAchievementsForLesson(contentId, completedList, newAchievements)) {
        newAchievements.push(id);
      }

      const updatedLearningProgress: Record<string, LearningProgress> = {
        ...prev.learningProgress,
        [contentId]: {
          contentId,
          status: 'completed',
          progressPercent: 100,
          completedAt: getTodayDateString(),
          lastAccessedAt: getTodayDateString(),
        },
      };

      return {
        ...prev,
        totalXp: newXp,
        level: calculateUserLevel(newXp).level,
        streak: updatedStreak,
        completedLessonIds: completedList,
        unlockedAchievementIds: newAchievements,
        learningProgress: updatedLearningProgress,
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const completeDailyChallenge = (challengeId: string) => {
    if (dailyChallenge.isCompleted) return;

    setProgress((prev) => {
      const updatedStreak = recordStreakActivity(prev.streak);
      const newXp = prev.totalXp + dailyChallenge.xpReward;
      const completedList = Array.from(new Set([...prev.completedChallengeIds, challengeId]));

      return {
        ...prev,
        totalXp: newXp,
        level: calculateUserLevel(newXp).level,
        streak: updatedStreak,
        completedChallengeIds: completedList,
        lastUpdated: new Date().toISOString(),
      };
    });

    setDailyChallenge((prev) => ({ ...prev, isCompleted: true }));
  };

  const isLessonCompleted = (contentId: string) => {
    return progress.completedLessonIds.includes(contentId);
  };

  const getLessonProgress = (contentId: string) => {
    return progress.learningProgress[contentId];
  };

  const passQuiz = (quizId: string) => {
    setProgress((prev) => {
      if (prev.completedChallengeIds.includes(quizId)) return prev;
      const updatedStreak = recordStreakActivity(prev.streak);
      const newXp = prev.totalXp + XP_CONFIG.quizPassed;
      const completedList = [...prev.completedChallengeIds, quizId];

      return {
        ...prev,
        totalXp: newXp,
        level: calculateUserLevel(newXp).level,
        streak: updatedStreak,
        completedChallengeIds: completedList,
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const isQuizPassed = (quizId: string) => {
    return progress.completedChallengeIds.includes(quizId);
  };

  const grantAchievements = (ids: string[]) => {
    if (ids.length === 0) return;
    setProgress((prev) => {
      const fresh = ids.filter(
        (id) =>
          !prev.unlockedAchievementIds.includes(id) &&
          ACHIEVEMENTS_CATALOG.some((a) => a.id === id)
      );
      if (fresh.length === 0) return prev;
      return {
        ...prev,
        unlockedAchievementIds: [...prev.unlockedAchievementIds, ...fresh],
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const awardXp = (amount: number, _reason?: string) => {
    setProgress((prev) => {
      const newXp = prev.totalXp + amount;
      return {
        ...prev,
        totalXp: newXp,
        level: calculateUserLevel(newXp).level,
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const resetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    setDailyChallenge({ ...TODAY_CHALLENGE, isCompleted: false });
    storage.set(STORAGE_KEY, INITIAL_PROGRESS);
  };

  const value = useMemo<GamificationContextValue>(
    () => ({
      progress,
      userLevel,
      achievements,
      dailyChallenge,
      completeLesson,
      completeDailyChallenge,
      isLessonCompleted,
      getLessonProgress,
      passQuiz,
      isQuizPassed,
      awardXp,
      grantAchievements,
      resetProgress,
    }),
    [
      progress,
      userLevel,
      achievements,
      dailyChallenge,
    ]
  );

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};

export const useGamification = (): GamificationContextValue => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
