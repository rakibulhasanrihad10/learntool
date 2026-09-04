import { PracticeExercise } from '@/types/practice';
import { tokenizeQuery } from './commandSearch';

/**
 * Natural-language search over the practice curriculum.
 * Same token-AND semantics as the other search engines: every query token
 * must appear somewhere in the exercise's searchable text.
 */

function normalize(value: string | undefined | null): string {
  return (value ?? '').toLowerCase().trim();
}

function exerciseMatchesToken(exercise: PracticeExercise, token: string): boolean {
  const t = normalize(token);
  if (!t) return true;
  const haystack = [
    exercise.id,
    exercise.title.en,
    exercise.title.bn,
    exercise.description.en,
    exercise.description.bn,
    exercise.objective.en,
    exercise.objective.bn,
    exercise.category,
    exercise.difficulty,
    ...exercise.tags,
    ...exercise.keywords,
    ...exercise.tasks.flatMap((task) => {
      if (task.kind === 'select') return task.options.map((o) => `${o.label} ${o.labelBn ?? ''}`);
      if (task.kind === 'order') return task.items.map((i) => `${i.label} ${i.labelBn ?? ''}`);
      if (task.kind === 'complete') return [task.prefix, ...task.acceptedAnswers];
      return [];
    }),
  ]
    .map(normalize)
    .filter((f) => f.length > 0);
  return haystack.some((field) => field.includes(t));
}

/** Best matches first (more matched weight on title/tags), stable by order. */
export function searchPractice(query: string, exercises: PracticeExercise[]): PracticeExercise[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];
  const scored = exercises
    .map((exercise) => {
      const titleHay = normalize(`${exercise.title.en} ${exercise.title.bn} ${exercise.tags.join(' ')} ${exercise.keywords.join(' ')}`);
      const titleHits = tokens.filter((t) => titleHay.includes(t)).length;
      const matched = tokens.every((t) => exerciseMatchesToken(exercise, t));
      return { exercise, matched, titleHits };
    })
    .filter((s) => s.matched)
    .sort((a, b) => b.titleHits - a.titleHits || a.exercise.order - b.exercise.order);
  return scored.map((s) => s.exercise);
}
