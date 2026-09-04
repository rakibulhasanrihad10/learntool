import { describe, it, expect } from 'vitest';
import { GIT_COMMANDS } from '@/content/git/commands';
import { GIT_MODULES } from '@/content/structure/gitModules';
import {
  ALL_CURRICULUM_LESSONS,
  getLessonById,
  getLessonRoute,
  resolveLessonLinks,
} from '@/content/github/githubModules';
import { getCommandById, getCommandBySlug, searchCommands } from '@/utils/commandSearch';
import { getLessonsForScenario } from '@/utils/troubleshootingSearch';
import { getUnlockedAchievementsForLesson } from '@/features/gamification/achievements';
import { searchGithubConcepts } from '@/utils/githubSearch';
import { CurriculumLesson } from '@/types/content';
import { INTERNALS_MENTAL_MODEL_LESSONS } from './internalsMentalModel';
import { INTERNALS_OBJECTS_LESSONS } from './internalsObjects';
import { INTERNALS_REFERENCES_LESSONS } from './internalsReferences';
import { INTERNALS_HISTORY_LESSONS } from './internalsHistory';
import { INTERNALS_STORAGE_LESSONS } from './internalsStorage';
import { INTERNALS_MISCONCEPTIONS, INTERNALS_SEARCH_ENTRIES } from './internalsShared';

const ALL_INTERNALS = [
  ...INTERNALS_MENTAL_MODEL_LESSONS,
  ...INTERNALS_OBJECTS_LESSONS,
  ...INTERNALS_REFERENCES_LESSONS,
  ...INTERNALS_HISTORY_LESSONS,
  ...INTERNALS_STORAGE_LESSONS,
];

const MODULE_IDS = [
  'git-internals-mental-model',
  'git-internals-objects',
  'git-internals-references',
  'git-internals-history',
  'git-internals-storage',
];

describe('internals curriculum — structure', () => {
  it('ships five modules with twenty-nine lessons and stable ids', () => {
    expect(ALL_INTERNALS).toHaveLength(29);
    const ids = ALL_INTERNALS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith('git.internals.'))).toBe(true);
    const slugs = ALL_INTERNALS.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('registers five git modules with unique slugs and sequential orders', () => {
    const modules = GIT_MODULES.filter((m) => MODULE_IDS.includes(m.id));
    expect(modules).toHaveLength(5);
    expect(new Set(modules.map((m) => m.slug)).size).toBe(5);
    for (const mod of modules) {
      expect(mod.subjectId).toBe('git');
      const orders = mod.lessons.map((l) => l.order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
      expect(mod.lessons.every((l) => l.moduleId === mod.id)).toBe(true);
    }
  });

  it('exposes every lesson through the shared curriculum registry (progress integration)', () => {
    for (const lesson of ALL_INTERNALS) {
      const found = getLessonById(lesson.id);
      expect(found?.id, lesson.id).toBe(lesson.id);
      expect(ALL_CURRICULUM_LESSONS.some((l) => l.id === lesson.id)).toBe(true);
    }
    expect(getLessonById('git.internals.nope')).toBeUndefined();
  });

  it('routes internals lessons to /learn/git/... paths', () => {
    expect(getLessonRoute('git.internals.how-git-thinks')?.path).toBe('/learn/git/mental-model/how-git-thinks');
    expect(getLessonRoute('git.internals.reflog')?.path).toBe('/learn/git/references/reflog');
    expect(getLessonRoute('git.internals.nope')).toBeNull();
  });
});

describe('internals curriculum — bilingual content resolution', () => {
  it('provides English and Bangla titles, summaries, objectives, and sections', () => {
    for (const lesson of ALL_INTERNALS) {
      expect(lesson.title.length, `${lesson.id} title`).toBeGreaterThan(0);
      expect(lesson.titleBn?.length, `${lesson.id} titleBn`).toBeGreaterThan(0);
      expect(lesson.summary.length, `${lesson.id} summary`).toBeGreaterThan(0);
      expect(lesson.summaryBn?.length, `${lesson.id} summaryBn`).toBeGreaterThan(0);
      expect(lesson.learningObjectives.length).toBeGreaterThan(0);
      expect(lesson.learningObjectivesBn?.length).toBe(lesson.learningObjectives.length);
      expect(lesson.sections.length).toBeGreaterThan(0);
      for (const section of lesson.sections) {
        expect(section.titleBn?.length, `${lesson.id}/${section.id} titleBn`).toBeGreaterThan(0);
        expect(section.blocks.length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps commands, hashes, and identifiers untranslated', () => {
    const blob = ALL_INTERNALS.find((l) => l.id === 'git.internals.blob-objects') as CurriculumLesson;
    const dump = JSON.stringify(blob);
    expect(dump).toContain('README.md');
    // No Bangla digits or translated command names leak into code blocks
    for (const lesson of ALL_INTERNALS) {
      for (const section of lesson.sections) {
        for (const block of section.blocks) {
          if (block.type === 'code') {
            expect(/[\u0980-\u09FF]/.test(block.code), `${lesson.id} code`).toBe(false);
          }
          if (block.type === 'command') {
            expect(/[\u0980-\u09FF]/.test(block.command), `${lesson.id} command`).toBe(false);
          }
        }
      }
    }
  });
});

describe('internals curriculum — relationships', () => {
  it('links lessons only to real reference commands', () => {
    for (const lesson of ALL_INTERNALS) {
      for (const cmdId of lesson.relatedCommands ?? []) {
        expect(getCommandById(GIT_COMMANDS, cmdId), `${lesson.id} → ${cmdId}`).toBeDefined();
      }
    }
  });

  it('links lessons only to resolvable curriculum lessons', () => {
    for (const lesson of ALL_INTERNALS) {
      const links = resolveLessonLinks(lesson.relatedLessons);
      expect(links.length, `${lesson.id} relatedLessons`).toBe(lesson.relatedLessons?.length ?? 0);
    }
  });

  it('connects troubleshooting guides to internals lessons', () => {
    const detached = getLessonsForScenario(
      { lessons: ['git.internals.head-deep-dive'] } as never,
      ALL_CURRICULUM_LESSONS
    );
    expect(detached.map((l) => l.id)).toContain('git.internals.head-deep-dive');
  });
});

describe('internals curriculum — quizzes', () => {
  it('ships valid quizzes with exactly one correct bilingual option', () => {
    const quizzed = ALL_INTERNALS.filter((l) => l.quiz);
    expect(quizzed.length).toBeGreaterThanOrEqual(7);
    for (const lesson of quizzed) {
      const quiz = lesson.quiz!;
      expect(quiz.questionBn?.length, `${lesson.id} quiz Bn`).toBeGreaterThan(0);
      expect(quiz.explanationBn?.length, `${lesson.id} explanation Bn`).toBeGreaterThan(0);
      expect(quiz.options.filter((o) => o.isCorrect)).toHaveLength(1);
      for (const opt of quiz.options) {
        expect(opt.textBn?.length, `${lesson.id}/${opt.id} textBn`).toBeGreaterThan(0);
      }
    }
  });

  it('covers the spec-mandated branch, index, and HEAD questions', () => {
    const byId = (id: string) => ALL_INTERNALS.find((l) => l.id === id)?.quiz;
    expect(byId('git.internals.branches-are-references')?.options.find((o) => o.isCorrect)?.text).toMatch(/reference/i);
    expect(byId('git.internals.working-tree-index-repository')?.options.find((o) => o.isCorrect)?.text).toMatch(/ndex/);
    expect(byId('git.internals.head-symbolic-references')?.options.find((o) => o.isCorrect)?.text).toMatch(/checkout|position/i);
  });
});

describe('internals curriculum — search', () => {
  it('resolves the spec example queries to lessons or the explorer', () => {
    const routes = (q: string) =>
      searchGithubConcepts(q, INTERNALS_SEARCH_ENTRIES).map((e) => e.route);
    expect(routes('what is blob')[0]).toBe('/learn/git/git-objects/blob-objects');
    expect(routes('branch pointer')[0]).toBe('/learn/git/references/branch-references');
    expect(routes('what is HEAD')[0]).toBe('/learn/git/references/head-deep-dive');
    expect(routes('recover deleted commit')[0]).toBe('/learn/git/references/reflog');
    expect(routes('git index')[0]).toBe('/learn/git/mental-model/working-tree-index-repository');
    expect(routes('git object database')[0]).toBe('/learn/git/storage-maintenance/object-database');
    expect(routes('how git stores files')[0]).toBe('/learn/git/git-objects/objects-overview');
  });

  it('finds plumbing commands by concept keywords', () => {
    expect(searchCommands('plumbing', GIT_COMMANDS).map((c) => c.slug)).toContain('cat-file');
    expect(getCommandBySlug(GIT_COMMANDS, 'rev-parse')?.id).toBe('git.rev-parse');
    expect(getCommandBySlug(GIT_COMMANDS, 'nope')).toBeUndefined();
  });
});

describe('internals curriculum — progress integration', () => {
  it('unlocks internals achievements on completion (never on page open)', () => {
    expect(getUnlockedAchievementsForLesson('git.internals.how-git-thinks', [], [])).toEqual([
      'internals_explorer',
    ]);
    expect(
      getUnlockedAchievementsForLesson('git.internals.dag-structure', [], ['internals_explorer'])
    ).toEqual(['graph_mastery']);
    expect(getUnlockedAchievementsForLesson('git.fundamentals.branch', [], [])).toEqual([]);
  });

  it('grants reference-model completion only after all six references lessons', () => {
    const five = [
      'git.internals.what-is-a-reference',
      'git.internals.branch-references',
      'git.internals.head-deep-dive',
      'git.internals.remote-tracking-references',
      'git.internals.lightweight-vs-annotated-tags',
    ];
    expect(
      getUnlockedAchievementsForLesson('git.internals.reflog', five, ['internals_explorer'])
    ).toEqual(['reference_model_complete']);
    expect(
      getUnlockedAchievementsForLesson('git.internals.reflog', [], [])
    ).toEqual(['internals_explorer']);
  });
});

describe('internals curriculum — misconceptions', () => {
  it('covers all ten spec myths with bilingual corrections', () => {
    expect(INTERNALS_MISCONCEPTIONS).toHaveLength(10);
    for (const m of INTERNALS_MISCONCEPTIONS) {
      expect(m.myth.en.length).toBeGreaterThan(0);
      expect(m.myth.bn.length).toBeGreaterThan(0);
      expect(m.reality.en.length).toBeGreaterThan(0);
      expect(m.reality.bn.length).toBeGreaterThan(0);
    }
  });
});
