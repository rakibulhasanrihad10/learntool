import { describe, it, expect } from 'vitest';
import {
  ACHIEVEMENTS_CATALOG,
  CORE_PRACTICE_CATEGORIES,
  getUnlockedAchievementsForPractice,
} from './achievements';
import { PRACTICE_EXERCISES } from '@/content/practice';

const catalog = PRACTICE_EXERCISES.map((e) => ({
  id: e.id,
  category: e.category,
  difficulty: e.difficulty,
}));

function byCategory(completedIds: string[]) {
  const stats: Record<string, { completed: number; total: number }> = {};
  for (const ex of PRACTICE_EXERCISES) {
    const bucket = (stats[ex.category] ??= { completed: 0, total: 0 });
    bucket.total += 1;
    if (completedIds.includes(ex.id)) bucket.completed += 1;
  }
  return stats;
}

describe('practice achievements — catalog', () => {
  it('defines all seven practice achievements bilingually', () => {
    for (const id of [
      'first_practice',
      'command_apprentice',
      'branch_builder',
      'merge_master',
      'recovery_specialist',
      'internals_practitioner',
      'git_practitioner',
    ]) {
      const achievement = ACHIEVEMENTS_CATALOG.find((a) => a.id === id);
      expect(achievement, id).toBeDefined();
      expect(achievement!.titleBn.length).toBeGreaterThan(0);
      expect(achievement!.descriptionBn.length).toBeGreaterThan(0);
      expect(achievement!.xpReward).toBeGreaterThan(0);
    }
  });
});

describe('practice achievements — unlock rules', () => {
  it('grants first_practice on any first completion', () => {
    expect(getUnlockedAchievementsForPractice(['git.practice.basic-commit'], byCategory(['git.practice.basic-commit']), [])).toEqual([
      'first_practice',
    ]);
  });

  it('grants command_apprentice after ten command exercises', () => {
    const nine = PRACTICE_EXERCISES.filter((e) => e.id.includes('.command-')).slice(0, 9).map((e) => e.id);
    expect(getUnlockedAchievementsForPractice(nine, byCategory(nine), ['first_practice'])).toEqual([]);
    const ten = PRACTICE_EXERCISES.filter((e) => e.id.includes('.command-')).slice(0, 10).map((e) => e.id);
    expect(getUnlockedAchievementsForPractice(ten, byCategory(ten), ['first_practice'])).toEqual([
      'command_apprentice',
    ]);
  });

  it('grants branch_builder after four branching completions', () => {
    const ids = [
      'git.practice.create-feature-branch',
      'git.practice.switch-branches',
      'git.practice.command-identify-current-branch',
      'git.practice.feature-branch-workflow',
    ];
    expect(
      getUnlockedAchievementsForPractice(ids, byCategory(ids), ['first_practice'])
    ).toEqual(['branch_builder']);
  });

  it('grants merge_master, recovery_specialist, internals_practitioner on category completion', () => {
    const merging = PRACTICE_EXERCISES.filter((e) => e.category === 'merging').map((e) => e.id);
    expect(getUnlockedAchievementsForPractice(merging, byCategory(merging), []).filter((id) => id === 'merge_master')).toEqual([
      'merge_master',
    ]);
    const recovery = PRACTICE_EXERCISES.filter((e) => e.category === 'recovery').map((e) => e.id);
    expect(getUnlockedAchievementsForPractice(recovery, byCategory(recovery), []).filter((id) => id === 'recovery_specialist')).toEqual([
      'recovery_specialist',
    ]);
    const internals = PRACTICE_EXERCISES.filter((e) => e.category === 'internals').map((e) => e.id);
    expect(getUnlockedAchievementsForPractice(internals, byCategory(internals), []).filter((id) => id === 'internals_practitioner')).toEqual([
      'internals_practitioner',
    ]);
  });

  it('grants git_practitioner only after the full core curriculum', () => {
    const coreIds = PRACTICE_EXERCISES.filter(
      (e) => (CORE_PRACTICE_CATEGORIES as readonly string[]).includes(e.category) && e.difficulty !== 'advanced'
    ).map((e) => e.id);
    expect(coreIds.length).toBeGreaterThan(10);
    expect(
      getUnlockedAchievementsForPractice(coreIds, byCategory(coreIds), [], catalog)
    ).toContain('git_practitioner');
    expect(
      getUnlockedAchievementsForPractice(coreIds.slice(1), byCategory(coreIds.slice(1)), [], catalog)
    ).not.toContain('git_practitioner');
  });

  it('never re-grants already unlocked achievements', () => {
    const ids = PRACTICE_EXERCISES.map((e) => e.id);
    expect(
      getUnlockedAchievementsForPractice(ids, byCategory(ids), [
        'first_practice',
        'command_apprentice',
        'branch_builder',
        'merge_master',
        'recovery_specialist',
        'internals_practitioner',
        'git_practitioner',
      ])
    ).toEqual([]);
  });
});
