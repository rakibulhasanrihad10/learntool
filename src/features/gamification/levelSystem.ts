import { UserLevel } from '@/types/gamification';
import { LEVEL_TIERS, LevelMetadata } from './config';

/**
 * Calculates current level details given total user XP
 */
export function calculateUserLevel(totalXp: number): UserLevel {
  const safeXp = Math.max(0, totalXp);

  let currentTier: LevelMetadata = LEVEL_TIERS[0];
  let nextTier: LevelMetadata | null = LEVEL_TIERS[1] || null;

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (safeXp >= LEVEL_TIERS[i].requiredXp) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || null;
    } else {
      break;
    }
  }

  const minXp = currentTier.requiredXp;
  const maxXp = nextTier ? nextTier.requiredXp : minXp + 1000;

  const currentLevelXp = safeXp - minXp;
  const span = maxXp - minXp;
  const xpRequiredForNextLevel = Math.max(0, maxXp - safeXp);
  const progressPercent = Math.min(100, Math.round((currentLevelXp / span) * 100));

  return {
    level: currentTier.level,
    title: currentTier.title,
    titleBn: currentTier.titleBn,
    minXp,
    maxXp,
    currentLevelXp,
    xpRequiredForNextLevel,
    progressPercent,
  };
}
