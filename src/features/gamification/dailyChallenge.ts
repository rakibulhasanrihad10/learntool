import { DailyChallenge } from '@/types/gamification';
import { XP_CONFIG } from './config';
import { getTodayDateString } from './streakSystem';

/**
 * Mock Daily Challenge for Demonstration
 */
export const TODAY_CHALLENGE: DailyChallenge = {
  id: 'dc-2026-patch-add',
  title: 'Interactive Staging (Patch Mode)',
  titleBn: 'ইন্টারেক্টিভ স্টেজিং (প্যাচ মোড)',
  description: 'How do you selectively review and stage parts (hunks) of a modified file without adding everything at once?',
  descriptionBn: 'পুরো ফাইল একসাথে স্টেজ না করে শুধুমাত্র নির্দিষ্ট অংশ কীভাবে নির্বাচন ও স্টেজ করবেন?',
  type: 'command_recall',
  difficulty: 'intermediate',
  xpReward: XP_CONFIG.dailyChallenge,
  date: getTodayDateString(),
  isCompleted: false,
  contentRef: 'git.fundamentals.recording-changes',
  targetCommand: 'git add -p',
  practiceRef: 'git.practice.command-stage-first-change',
  hint: 'Use the interactive patch flag with git add.',
  hintBn: 'git add কমান্ডের সাথে ইন্টারেক্টিভ প্যাচ ফ্ল্যাগ ব্যবহার করুন।',
  options: [
    { id: 'opt-1', text: 'git add --all', isCorrect: false },
    { id: 'opt-2', text: 'git add -p', isCorrect: true },
    { id: 'opt-3', text: 'git commit -a', isCorrect: false },
    { id: 'opt-4', text: 'git stage --force', isCorrect: false },
  ],
};
