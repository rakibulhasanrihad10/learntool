/**
 * Unified search index — metadata only (Phase 14).
 *
 * Built once per session from the existing catalogs and cached in module
 * state (no localStorage reads, no rebuilds per keystroke). Every item
 * references an existing stable content id + its real route.
 */
import { ALL_MODULES, getLessonRoute } from '@/content/github';
import { GIT_COMMANDS, TROUBLESHOOTING_GUIDES, TROUBLESHOOTING_CATEGORIES } from '@/content/git';
import { GIT_WORKFLOWS } from '@/content/git/workflows';
import { GITHUB_WORKFLOWS } from '@/content/github/githubWorkflows';
import { GITHUB_SEARCH_ENTRIES } from '@/content/github/githubSearchIndex';
import { INTERNALS_SEARCH_ENTRIES } from '@/content/git/internalsShared';
import { PRACTICE_EXERCISES } from '@/content/practice';
import { INTERVIEW_QUESTIONS } from '@/content/interview';
import { LEARNING_PATHS } from '@/content/paths';
import { SearchIndexItem } from './searchTypes';

function text(en: string, bn?: string): { en: string; bn: string } {
  return { en, bn: bn ?? en };
}

function buildIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];

  for (const cmd of GIT_COMMANDS) {
    items.push({
      id: cmd.id,
      type: 'command',
      title: text(cmd.title, cmd.titleBn),
      description: text(cmd.whatItDoes, cmd.whatItDoesBn),
      route: `/commands/git/${cmd.slug}`,
      category: cmd.category,
      tags: cmd.tags ?? [],
      keywords: cmd.searchKeywords ?? [],
      aliases: cmd.aliases ?? [],
      techTerms: [
        cmd.command,
        cmd.id,
        cmd.slug,
        cmd.syntax,
        ...(cmd.commonOptions ?? []).map((o) => o.flag),
        ...(cmd.examples ?? []).map((e) => e.command),
      ].filter(Boolean),
      difficulty: cmd.difficulty,
      order: cmd.order ?? 999,
    });
  }

  for (const mod of ALL_MODULES) {
    for (const lesson of mod.lessons) {
      const route = getLessonRoute(lesson.id)?.path;
      if (!route) continue;
      items.push({
        id: lesson.id,
        type: 'lesson',
        title: text(lesson.title, lesson.titleBn),
        description: text(lesson.summary ?? '', lesson.summaryBn),
        route,
        category: mod.slug,
        topic: text(mod.title, mod.titleBn),
        tags: [],
        keywords: [mod.title, lesson.title],
        aliases: [lesson.slug],
        techTerms: [lesson.id, lesson.slug],
        difficulty: lesson.difficulty,
        order: lesson.order,
      });
    }
  }

  for (const w of GIT_WORKFLOWS) {
    items.push({
      id: w.id,
      type: 'workflow',
      title: text(w.title, w.titleBn),
      description: text(w.scenario, w.scenarioBn),
      route: '/workflows/everyday-git',
      category: w.category,
      tags: w.tags ?? [],
      keywords: [w.title, w.category, 'workflow', 'everyday'],
      aliases: [],
      techTerms: [w.id],
      difficulty: w.difficulty,
      order: 0,
    });
  }

  for (const w of GITHUB_WORKFLOWS) {
    items.push({
      id: w.id,
      type: 'workflow',
      title: text(w.title, w.titleBn),
      description: text(w.scenario, w.scenarioBn),
      // Rendered by the PR page's workflow-guides section.
      route: '/workflows/github-pr',
      category: w.category,
      tags: w.tags ?? [],
      keywords: [w.title, w.category, 'workflow', 'github', 'pull request'],
      aliases: [],
      techTerms: [w.id],
      difficulty: w.difficulty,
      order: 1,
    });
  }

  const catTitle = (id: string): string =>
    TROUBLESHOOTING_CATEGORIES.find((c) => c.id === id)?.title.en ?? id;

  for (const g of TROUBLESHOOTING_GUIDES) {
    items.push({
      id: g.id,
      type: 'troubleshooting',
      title: g.title,
      description: g.shortDescription,
      route: `/troubleshooting/git/${g.slug}`,
      category: g.category,
      topic: { en: catTitle(g.category), bn: catTitle(g.category) },
      tags: g.tags ?? [],
      keywords: [...(g.searchKeywords ?? []), ...g.symptoms.map((s) => s.en)],
      aliases: [g.slug],
      techTerms: [g.id, g.slug, ...(g.commands ?? []), ...(g.fix?.commands ?? [])],
      difficulty: g.difficulty,
      order: g.order ?? 999,
    });
  }

  for (const e of PRACTICE_EXERCISES) {
    items.push({
      id: e.id,
      type: 'practice',
      title: { en: e.title.en, bn: e.title.bn },
      description: { en: e.objective.en, bn: e.objective.bn },
      route: `/practice/${e.id.split('.').pop()}`,
      category: e.category,
      tags: e.tags ?? [],
      keywords: e.keywords ?? [],
      aliases: [],
      techTerms: [e.id],
      difficulty: e.difficulty,
      order: e.order,
    });
  }

  for (const q of INTERVIEW_QUESTIONS) {
    items.push({
      id: q.id,
      type: 'interview',
      title: q.question,
      description: q.shortAnswer,
      route: `/interview/git/${q.category}`,
      category: q.category,
      tags: q.tags ?? [],
      keywords: [q.category, q.type],
      aliases: [],
      techTerms: [q.id],
      difficulty: q.difficulty,
      order: q.order,
    });
  }

  for (const entry of INTERNALS_SEARCH_ENTRIES) {
    // Search-only helper ids (git.internals.search.*) are excluded from
    // paths; here they are legitimate discovery pointers with real routes.
    items.push({
      id: entry.id,
      type: 'internals',
      title: text(entry.title, entry.titleBn),
      description: text(entry.subtitle, entry.subtitleBn),
      route: entry.route,
      category: 'internals',
      tags: [],
      keywords: entry.keywords ?? [],
      aliases: [],
      techTerms: [entry.id],
      difficulty: 'advanced',
      order: 999,
    });
  }

  for (const entry of GITHUB_SEARCH_ENTRIES) {
    items.push({
      id: entry.id,
      type: 'github',
      title: text(entry.title, entry.titleBn),
      description: text(entry.subtitle, entry.subtitleBn),
      route: entry.route,
      category: 'github',
      tags: [],
      keywords: entry.keywords ?? [],
      aliases: [],
      techTerms: [entry.id],
      order: 999,
    });
  }

  for (const path of LEARNING_PATHS) {
    items.push({
      id: `path:${path.id}`,
      type: 'path',
      title: path.title,
      description: path.description,
      route: `/learn/paths/${path.id}`,
      category: path.subjectId,
      tags: path.tags ?? [],
      keywords: [...path.tags, ...path.outcomes.flatMap((o) => [o.en, o.bn])],
      aliases: [],
      techTerms: [path.id],
      difficulty: path.difficulty,
      order: path.order,
    });
  }

  items.push(
    {
      id: 'cheatsheet:git',
      type: 'cheatsheet',
      title: { en: 'Git Cheatsheet', bn: 'গিট চিটশিট' },
      description: {
        en: 'Every essential Git command on one printable page.',
        bn: 'এক পৃষ্ঠায় সব প্রয়োজনীয় গিট কমান্ড।',
      },
      route: '/cheatsheet/git',
      category: 'cheatsheet',
      tags: ['cheatsheet', 'quick reference', 'printable'],
      keywords: ['cheat sheet', 'quick reference', 'all commands', 'printable', 'commands'],
      aliases: [],
      techTerms: [],
      order: 0,
    },
    {
      id: 'cheatsheet:all',
      type: 'cheatsheet',
      title: { en: 'All Cheatsheets', bn: 'সব চিটশিট' },
      description: {
        en: 'Browse every quick-reference cheatsheet.',
        bn: 'সব কুইক-রেফারেন্স চিটশিট দেখুন।',
      },
      route: '/cheatsheet',
      category: 'cheatsheet',
      tags: ['cheatsheet'],
      keywords: ['cheat sheet', 'quick reference'],
      aliases: [],
      techTerms: [],
      order: 1,
    }
  );

  return items;
}

let cached: SearchIndexItem[] | undefined;

export function getSearchIndex(): SearchIndexItem[] {
  if (!cached) cached = buildIndex();
  return cached;
}

/** Test hook — rebuilds the index (cached module state is otherwise reused). */
export function rebuildSearchIndex(): SearchIndexItem[] {
  cached = buildIndex();
  return cached;
}
