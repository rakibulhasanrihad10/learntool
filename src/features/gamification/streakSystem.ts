import { Streak } from '@/types/gamification';

/**
 * Returns today's ISO date string (YYYY-MM-DD)
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns yesterday's ISO date string (YYYY-MM-DD)
 */
export function getYesterdayDateString(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Updates streak with today's activity
 */
export function recordStreakActivity(currentStreak: Streak): Streak {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (currentStreak.lastActiveDate === today) {
    // Already active today
    return currentStreak;
  }

  let newCurrent = currentStreak.currentStreak;

  if (currentStreak.lastActiveDate === yesterday) {
    // Active yesterday: increment streak
    newCurrent += 1;
  } else if (!currentStreak.lastActiveDate) {
    // Brand new streak
    newCurrent = 1;
  } else {
    // Missed a day: reset streak to 1
    newCurrent = 1;
  }

  const newLongest = Math.max(currentStreak.longestStreak, newCurrent);
  const updatedHistory = Array.from(new Set([...currentStreak.history, today]));

  return {
    currentStreak: newCurrent,
    longestStreak: newLongest,
    lastActiveDate: today,
    history: updatedHistory,
  };
}
