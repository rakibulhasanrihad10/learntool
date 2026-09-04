import { XPConfig } from '@/types/gamification';

/**
 * Centralized XP Balance Configuration
 *
 * Designed so point values are never hardcoded inside UI components.
 */
export const XP_CONFIG: XPConfig = {
  lessonCompleted: 50,
  moduleCompleted: 200,
  quizPassed: 75,
  practiceLabCompleted: 100,
  dailyChallenge: 60,
  streakBonus: 25,
};

/**
 * Level Thresholds & Titles
 */
export interface LevelMetadata {
  level: number;
  title: string;
  titleBn: string;
  requiredXp: number;
}

export const LEVEL_TIERS: LevelMetadata[] = [
  { level: 1, title: 'Git Novice', titleBn: 'গিট শিক্ষানবিস', requiredXp: 0 },
  { level: 2, title: 'Snapshot Stager', titleBn: 'স্ন্যাপশট স্টেজার', requiredXp: 150 },
  { level: 3, title: 'Branch Weaver', titleBn: 'ব্রাঞ্চ কারিগর', requiredXp: 350 },
  { level: 4, title: 'Merge Master', titleBn: 'মার্জ ওস্তাদ', requiredXp: 650 },
  { level: 5, title: 'Rebase Tactician', titleBn: 'রিবেস কুশলী', requiredXp: 1050 },
  { level: 6, title: 'Reflog Rescuer', titleBn: 'রেফলগ উদ্ধারকারী', requiredXp: 1550 },
  { level: 7, title: 'Plumbing Architect', titleBn: 'প্লাম্বিং আর্কিটেক্ট', requiredXp: 2200 },
  { level: 8, title: 'GitVerse Grandmaster', titleBn: 'গিটভার্স গ্র্যান্ডমাস্টার', requiredXp: 3000 },
];
