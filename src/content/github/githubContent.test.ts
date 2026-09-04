import { describe, it, expect } from 'vitest';
import { GIT_COMMANDS } from '@/content/git/commands';
import { getCommandById } from '@/utils/commandSearch';
import { getScenariosForCommand } from '@/utils/troubleshootingSearch';
import { TROUBLESHOOTING_GUIDES } from '@/content/git';
import { getUnlockedAchievementsForLesson } from '@/features/gamification/achievements';
import { searchGithubConcepts } from '@/utils/githubSearch';
import {
  ALL_CURRICULUM_LESSONS,
  ALL_GITHUB_LESSONS,
  ALL_MODULES,
  GITHUB_MODULES,
  getLessonById,
  getLessonMetaById,
  getLessonRoute,
  getModuleBySlug,
  resolveLessonLinks,
} from './githubModules';
import { GITHUB_SEARCH_ENTRIES } from './githubSearchIndex';
import { GITHUB_WORKFLOWS } from './githubWorkflows';

describe('github curriculum — structure', () => {
  it('ships six modules with thirty-nine lessons and stable ids', () => {
    expect(GITHUB_MODULES).toHaveLength(6);
    expect(ALL_GITHUB_LESSONS).toHaveLength(39);
    const ids = ALL_GITHUB_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith('github.'))).toBe(true);
    const slugs = ALL_GITHUB_LESSONS.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('orders lessons sequentially within each module', () => {
    for (const mod of GITHUB_MODULES) {
      const orders = mod.lessons.map((l) => l.order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
      expect(mod.lessons.every((l) => l.moduleId === mod.id)).toBe(true);
    }
  });

  it('looks up modules and lessons by id or slug', () => {
    expect(getModuleBySlug('github', 'pull-requests')?.id).toBe('github-pull-requests');
    expect(getModuleBySlug('github', 'github-pull-requests')?.slug).toBe('pull-requests');
    expect(getModuleBySlug('github', 'nope')).toBeUndefined();
    expect(getModuleBySlug('git', 'pull-requests')).toBeUndefined();
    expect(getLessonById('github.pr.what-is-a-pull-request')?.slug).toBe('what-is-a-pull-request');
    expect(getLessonById('git.fundamentals.branch')?.id).toBe('git.fundamentals.branch');
    expect(getLessonById('nope')).toBeUndefined();
  });
});

describe('github curriculum — lesson routing', () => {
  it('routes github lessons to /learn/github/... paths', () => {
    expect(getLessonRoute('github.pr.what-is-a-pull-request')).toEqual({
      subjectId: 'github',
      moduleSlug: 'pull-requests',
      lessonSlug: 'what-is-a-pull-request',
      path: '/learn/github/pull-requests/what-is-a-pull-request',
    });
  });

  it('keeps git lesson routes intact', () => {
    expect(getLessonRoute('git.fundamentals.branch')?.path).toBe('/learn/git/fundamentals/branch');
  });

  it('returns null for unknown lessons (invalid routes)', () => {
    expect(getLessonRoute('github.nope.missing')).toBeNull();
  });

  it('resolves link lists while skipping unknown ids', () => {
    const links = resolveLessonLinks(['github.pr.what-is-a-pull-request', 'git.fundamentals.branch', 'nope']);
    expect(links).toHaveLength(2);
    expect(links[0].route.path).toBe('/learn/github/pull-requests/what-is-a-pull-request');
  });
});

describe('github curriculum — workflows', () => {
  it('ships the eight specified collaboration workflows', () => {
    const ids = GITHUB_WORKFLOWS.map((w) => w.id);
    for (const expected of [
      'github.workflow.create-repository',
      'github.workflow.clone-repository',
      'github.workflow.feature-branch',
      'github.workflow.pull-request',
      'github.workflow.code-review',
      'github.workflow.merge-pull-request',
      'github.workflow.sync-branch',
      'github.workflow.resolve-pr-conflict',
    ]) {
      expect(ids).toContain(expected);
    }
    expect(GITHUB_WORKFLOWS.every((w) => w.subjectId === 'github')).toBe(true);
    expect(GITHUB_WORKFLOWS.every((w) => w.steps.length > 0)).toBe(true);
  });
});

describe('github curriculum — search', () => {
  it.each([
    ['what is PR', '/learn/github/pull-requests/what-is-a-pull-request'],
    ['fork vs clone', '/learn/github/collaboration/fork-vs-clone'],
    ['origin upstream', '/learn/github/basics/origin-and-upstream'],
    ['code review', '/learn/github/pull-requests/reviewing-changes'],
    ['PR rejected', '/troubleshooting/git/push-rejected'],
    ['GitHub workflow', '/learn/github/team-workflows/github-flow'],
  ])('resolves "%s" → %s', (query, route) => {
    const results = searchGithubConcepts(query, GITHUB_SEARCH_ENTRIES);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].route).toBe(route);
  });

  it('returns nothing for blank or gibberish queries', () => {
    expect(searchGithubConcepts('   ', GITHUB_SEARCH_ENTRIES)).toHaveLength(0);
    expect(searchGithubConcepts('zzz-no-such-concept-zzz', GITHUB_SEARCH_ENTRIES)).toHaveLength(0);
  });
});

describe('github curriculum — relationships', () => {
  it('links lessons to real reference commands', () => {
    const lesson = getLessonById('github.repositories.clone-repository')!;
    expect(lesson.relatedCommands).toContain('git.clone');
    for (const cmdId of lesson.relatedCommands ?? []) {
      expect(getCommandById(GIT_COMMANDS, cmdId), cmdId).toBeDefined();
    }
  });

  it('links lessons to real git lessons', () => {
    const lesson = getLessonById('github.basics.origin-and-upstream')!;
    for (const lessonId of lesson.relatedLessons ?? []) {
      expect(getLessonMetaById(lessonId) ?? getLessonById(lessonId), lessonId).toBeDefined();
    }
  });

  it('keeps command → troubleshooting relationships working', () => {
    expect(getScenariosForCommand('push', TROUBLESHOOTING_GUIDES).length).toBeGreaterThan(0);
  });

  it('resolves bilingual lesson copy', () => {
    for (const lesson of ALL_GITHUB_LESSONS) {
      expect(lesson.titleBn!.length).toBeGreaterThan(0);
      expect(lesson.summaryBn!.length).toBeGreaterThan(0);
      for (const section of lesson.sections) {
        expect(section.titleBn!.length).toBeGreaterThan(0);
      }
    }
    expect(ALL_MODULES.length).toBeGreaterThan(GITHUB_MODULES.length);
    expect(ALL_CURRICULUM_LESSONS.length).toBeGreaterThanOrEqual(ALL_GITHUB_LESSONS.length);
  });
});

describe('github — progress and achievements', () => {
  it('unlocks collaboration basics on the first github lesson', () => {
    expect(
      getUnlockedAchievementsForLesson('github.basics.what-is-github', [], [])
    ).toEqual(['collaboration_basics']);
  });

  it('unlocks pr_ready on pull-request lessons and review_apprentice on review', () => {
    expect(
      getUnlockedAchievementsForLesson('github.pr.merging-pr', ['github.basics.what-is-github'], ['collaboration_basics'])
    ).toEqual(['pr_ready']);
    expect(
      getUnlockedAchievementsForLesson('github.pr.reviewing-changes', [], [])
    ).toEqual(['collaboration_basics', 'pr_ready', 'review_apprentice']);
  });

  it('unlocks workflow master only after all team lessons complete', () => {
    const five = [
      'github.team.feature-branch-workflow',
      'github.team.pull-request-workflow',
      'github.team.github-flow',
      'github.team.sync-before-work',
      'github.team.handling-review-changes',
    ];
    expect(
      getUnlockedAchievementsForLesson('github.team.resolve-collaboration-conflicts', five, [])
    ).toContain('workflow_master');
    expect(
      getUnlockedAchievementsForLesson('github.team.github-flow', [], [])
    ).not.toContain('workflow_master');
  });

  it('grants nothing new for git lessons or already-unlocked ids', () => {
    expect(getUnlockedAchievementsForLesson('git.fundamentals.branch', [], [])).toEqual([]);
    expect(
      getUnlockedAchievementsForLesson('github.basics.what-is-github', [], ['collaboration_basics'])
    ).toEqual([]);
  });
});
