/**
 * Learning path search — mirrors the interview/command search pattern.
 * Matches titles, descriptions, outcomes, tags, and roadmap-style keywords
 * ("roadmap", "path", "learn git", "beginner", "advanced", "track").
 */
import { LEARNING_PATHS } from '@/content/paths';
import { LearningPath } from '@/types/learningPath';

export interface PathSearchResult {
  path: LearningPath;
  score: number;
}

const KEYWORD_ALIASES: { keyword: string; pathIds: string[] }[] = [
  { keyword: 'roadmap', pathIds: ['git-beginner', 'git-intermediate', 'git-advanced'] },
  { keyword: 'path', pathIds: ['git-beginner', 'git-intermediate', 'git-advanced'] },
  { keyword: 'track', pathIds: ['git-beginner', 'git-intermediate', 'git-advanced'] },
  { keyword: 'journey', pathIds: ['git-beginner', 'git-intermediate', 'git-advanced'] },
  { keyword: 'beginner', pathIds: ['git-beginner'] },
  { keyword: 'intermediate', pathIds: ['git-intermediate'] },
  { keyword: 'advanced', pathIds: ['git-advanced'] },
  { keyword: 'start', pathIds: ['git-beginner'] },
];

export function searchLearningPaths(query: string, limit = 3): PathSearchResult[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const tokens = needle.split(/\s+/);
  const scored: PathSearchResult[] = [];

  for (const path of LEARNING_PATHS) {
    const haystack = [
      path.id,
      path.title.en,
      path.title.bn,
      path.description.en,
      path.description.bn,
      ...path.tags,
      ...path.outcomes.flatMap((o) => [o.en, o.bn]),
    ]
      .join('\n')
      .toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (!token) continue;
      if (path.id === token || path.id.replace(/-/g, ' ') === needle) score += 8;
      else if (path.title.en.toLowerCase().includes(token)) score += 5;
      else if (haystack.includes(token)) score += token.length >= 4 ? 3 : 1;
      else {
        const alias = KEYWORD_ALIASES.find((a) => a.keyword === token);
        if (alias && alias.pathIds.includes(path.id)) score += 4;
        else {
          score = 0;
          break;
        }
      }
    }
    if (score > 0) scored.push({ path, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.path.order - b.path.order).slice(0, limit);
}
