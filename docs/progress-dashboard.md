# Progress Dashboard (`/progress`) — Derived Read Model

> One understandable learner dashboard over the existing learning,
> practice, interview, troubleshooting, and learning-path systems.

## Source of truth (authoritative stores)

| Data | Store | Key |
|---|---|---|
| Lessons, cookbook resolves, workflow/explorer reviews | gamification `completedLessonIds` + `learningProgress` | `gitverse_gamification_progress` |
| Practice attempts/scores | `PracticeProgress` | `gitverse_practice_progress` |
| Interview reviews + mocks | `InterviewProgress`, `MockHistoryEntry[]` | `gitverse_interview_progress`, `gitverse_interview_mocks` |
| Assessment pass | quiz record `git.assessment.skill` | gamification store |
| XP / level / streak / achievements / daily | gamification | same store |

`src/features/progress/dashboard.ts` persists **nothing**. `buildDashboard(signals, game)`
is pure: identical inputs always produce an identical dashboard.

## Overall progress — three numbers, never one

Combining curriculum, labs, and interview prep into a single percent
would be misleading, so the overview shows three separate figures:

- **Curriculum Progress** — required *lesson-type* learning-path steps
  done/total. Lesson steps only, so practice/interview work counted in
  the other cards is never double-counted here.
- **Skill Practice** — practice exercises completed/total + average best.
- **Practice Readiness** — the existing interview readiness level from
  `computeReadiness()` + questions reviewed/total. Wording never promises
  real-interview outcomes.

## Current item priority (deterministic)

1. Active learning-path step (`getContinueTarget`)
2. Most recently touched in-progress lesson
3. Most recently attempted incomplete exercise
4. Weak-area review link
5. First path as starting point

## Weak areas

Topics scoring below 60. Topics with real activity (attempts, reviews,
lessons) outrank untouched ones — a poor practice average deserves
attention before a blank slate. Each area carries evidence, never just
a score:

- `practice-score` (average best + attempt count)
- `lessons-incomplete` (done/total)
- `interview-low` (reviewed/total)
- `cookbook-untouched` / `not-started`

plus up to four stable-ID routes (lesson / practice / cookbook / interview).

## Recommendation priority

1. Continue active path step → 2. oldest in-progress lesson →
3. weakest attempted practice category (<70 avg), or first exercise when
none attempted → 4. unresolved cookbook guide in the lowest weak topic →
5. weakest interview category → 6. next unstarted path.
Capped at 6, de-duplicated by route, stable bilingual titles from content.

## Recent activity

Newest-first from real timestamps only (`completedAt`, `lastAttemptAt`,
`finishedAt`). XP is shown only when the award is deterministic:
+50 lesson/cookbook/workflow completions (`XP_CONFIG.lessonCompleted`),
exercise `xpReward` (its `completedAt` exists only on first completion),
+5 interview review with exactly one attempt. Mocks and unknown cases
show no XP rather than a guess.

## Files

```
src/features/progress/dashboard.ts       model + pure builders + useProgressDashboard()
src/features/progress/dashboard.test.ts  17 tests (empty/mixed/complete states, determinism)
src/components/progress/ProgressCards.tsx RecommendationCard / WeakAreaCard / ActivityItemRow / ProgressEmptyState
src/pages/Progress/ProgressPage.tsx      /progress — 10 sections, mobile-first order
```
