# Learning Paths — Curriculum Orchestration & Mastery

> Paths answer: "What should I learn first?", "What next?", "Am I ready
> to move on?", "What still needs practice?" They connect
> Learn → Practice → Troubleshoot → Reference → Assess → Interview
> into one coherent progression.

## Architecture

A Learning Path is an **orchestration layer, not a content engine**.
It references existing stable content IDs and opens existing experiences.
No content, progress store, search engine, or assessment engine is duplicated.

```
src/types/learningPath.ts          LearningPath / LearningPathStep / mastery types
src/content/paths/                 Path data (gitBeginner / gitIntermediate / gitAdvanced / index)
  buildPath.ts                     Shared step builder (stable `<pathId>.<slug>` ids)
src/features/paths/
  signals.ts                       useLearningSignals() — read-only snapshot of EXISTING stores
  progress.ts                      isStepComplete / stepRoute / summarizePath / getContinueTarget
  mastery.ts                       Topic mastery scores + levels
  recommend.ts                     getNextSteps / getWhatNextForLesson / weak-area reviews
  search.ts                        searchLearningPaths() for global search
  paths.test.ts                    19 tests (schema, refs, progress, mastery, search, i18n)
src/components/paths/             LearningPathCard / PathCurriculum / MasteryPanel / WhatNextCard
src/pages/Paths/                  PathsPage (/learn/paths) / PathDetailPage (/learn/paths/:pathId)
```

## Models

### LearningPath

`id` (`git-beginner`), `subjectId`, `difficulty`, localized `title` /
`description`, `outcomes[]`, `prerequisites` (path ids, guidance only),
`icon`, `order`, `tags`, ordered `steps[]`. Future subjects follow
`<subject>-<level>` (e.g. `linux-beginner`) — no code changes needed
beyond a new data file + registry entry.

### LearningPathStep

`id` (`<pathId>.<slug>`), `pathId`, `order`, `type`, `contentId`,
optional `route` override, localized `title` / `description` /
`whyItMatters`, `estimatedMinutes`, `required`, `prerequisites`
(step ids **within the same path**, earlier steps only), `tags`.

Step types and their `contentId` contract:

| type | contentId | opens |
|---|---|---|
| `lesson` | CurriculumLesson id | `getLessonRoute()` → lesson page |
| `practice` | exercise id | `/practice/<suffix>` |
| `workflow` | workflow id + explicit `route` | workflow page |
| `troubleshooting` | guide id | `/troubleshooting/git/<slug>` |
| `assessment` | `git.assessment.skill` | `/practice/assessment` |
| `interview` | `interview:<category>` | `/interview/git/<category>` |
| `command` | GIT_COMMANDS id | `/commands/git/<slug>` |
| `explorer` | `git.internals.explorer` + explicit `route` | `/git/internals` |

## Progress & completion

Completion is **derived, never stored separately**:

- lesson / troubleshooting / workflow / explorer / command →
  id present in gamification `completedLessonIds`. Troubleshooting
  "Mark as Resolved" and workflow/explorer "Mark as reviewed" both
  record there (same pattern, same +50 XP convention).
- practice → exercise `completed` in `gitverse_practice_progress`.
- interview → ≥ 4 reviewed questions in the step's category
  (`INTERVIEW_STEP_THRESHOLD`; fewer when the category is smaller).
- assessment → `passQuiz('git.assessment.skill')`, recorded by
  `AssessmentPage` on finish through the existing quiz store.

`summarizePath()` yields required/total counts, percent over **required**
steps, `currentStepId` (first required incomplete step with met
prerequisites, else first required incomplete), per-step status
(`completed` / `current` / `available` / `suggested`), `started`, and
`lastActivityAt` (freshest timestamp among referenced records).
Prerequisites guide — steps stay navigable ("suggested", never locked).

Path completion grants +150 XP and `path_<level>_complete` once
(see `pathCompletionAchievementId()`).

## Mastery ("GitVerse Learning Mastery")

Educational estimate per topic (fundamentals, branching, remote,
recovery, internals, collaboration), computed from existing records:

```
score = 40·lessonRatio + 30·practiceScore + 15·cookbookRatio + 15·interviewRatio
practiceScore = 0.5·completedRatio + 0.5·(avgBestScore ÷ 100 over attempted)
```

Levels: `not-started` (<1) · `learning` (<40) · `practicing` (<60) ·
`familiar` (<80) · `strong` (≥80). UI always carries the disclaimer
that this is a learning estimate, **not a certification**, and
completion visuals are called "GitVerse Completion Summary" — never
certificates.

## Recommendations (deterministic)

- Continue Learning (Home + `/learn/paths`): most recently active
  started-but-incomplete path → first unstarted path → undefined when
  everything is complete (`getContinueTarget`).
- Up next: current step + following incomplete steps (`getNextSteps`).
- Lesson "What Next?": first incomplete step after the lesson in each
  containing path, plus upcoming practice/cookbook/interview steps
  (`getWhatNextForLesson`, rendered by `WhatNextCard` on the lesson page).
- Weak areas: lowest topics below 60 → first incomplete lesson,
  first cookbook guide, and interview category routes.

## How to add a new path

1. Create `src/content/paths/<subject><Level>.ts` using `buildSteps()`.
2. Reference **only verified stable ids** (see the inventory in
   `paths.test.ts` — the "every step reference exists" test fails the
   build on dangling references).
3. Workflow/explorer steps **must** carry an explicit `route`.
4. Prerequisites must name earlier steps of the same path.
5. Register in `src/content/paths/index.ts`; add a completion
   achievement id mapping in `PathDetailPage.tsx` + catalog entry.
6. Every user-facing string needs `en` + `bn`; commands, flags,
   syntax, filenames, branch names, and hashes stay in English.

## Example

```ts
// src/content/paths/gitBeginner.ts
const STEPS = buildSteps('git-beginner', [
  { slug: 'commit', type: 'lesson', contentId: 'git.fundamentals.commit',
    titleEn: 'What is a Commit?', titleBn: 'কমিট কী?',
    descEn: '...', descBn: '...', whyEn: '...', whyBn: '...',
    minutes: 12, prerequisites: ['repository', 'staging-area'],
    tags: ['fundamentals'] },
  { slug: 'first-commit', type: 'practice', contentId: 'git.practice.basic-commit',
    /* ... */ minutes: 10, prerequisites: ['commit'], tags: ['hands-on'] },
]);
```
