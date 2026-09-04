/**
 * PracticeSession — Task → Attempt → Validate → Explain → Retry → Master.
 *
 * Owns per-task attempt state, progressive hints, timing, scoring, XP and
 * achievement side-effects. Content stays in `src/content/practice/`.
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lightbulb, RotateCcw } from 'lucide-react';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { Callout } from '@/components/feedback/Callout/Callout';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';
import { getCommandById } from '@/utils/commandSearch';
import { GIT_COMMANDS } from '@/content/git';
import { resolveLessonLinks } from '@/content/github';
import { TROUBLESHOOTING_GUIDES } from '@/content/git';
import { getScenarioBySlug } from '@/utils/troubleshootingSearch';
import { GIT_WORKFLOWS } from '@/content/git/workflows';
import { scoreExercise } from '@/features/practice/scoring';
import { getUnlockedAchievementsForPractice } from '@/features/gamification/achievements';
import { PRACTICE_EXERCISES } from '@/content/practice';
import { usePracticeProgress } from '@/features/practice/progress';
import { PracticeExercise, TaskAttempt } from '@/types/practice';
import { TaskRunner } from './TaskRunner';
import { PracticeResultCard } from './PracticeResultCard';

export interface PracticeSessionProps {
  exercise: PracticeExercise;
  prevExercise?: PracticeExercise;
  nextExercise?: PracticeExercise;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({ exercise, prevExercise, nextExercise }) => {
  const { language, t } = useTranslation();
  const isBn = language === 'bn';
  const { awardXp, grantAchievements, progress } = useGamification();
  const { progress: practiceProgress, recordAttempt } = usePracticeProgress();

  const [taskIndex, setTaskIndex] = useState(0);
  const [attempts, setAttempts] = useState<TaskAttempt[]>([]);
  const [hintsShown, setHintsShown] = useState(0);
  const [finished, setFinished] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [startedAt] = useState(() => Date.now());

  const L = (text: { en: string; bn?: string }) => (isBn && text.bn ? text.bn : text.en);
  const totalTasks = exercise.tasks.length;
  const task = exercise.tasks[taskIndex];
  const completed = attempts.length === totalTasks;

  const completion = useMemo(() => {
    if (!finished) return null;
    return scoreExercise(attempts, hintsShown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const handlePass = (retries: number) => {
    setAttempts((prev) => [...prev, { taskId: task.id, passed: true, retries, hintsShown }]);
  };

  const handleNext = () => {
    if (taskIndex + 1 >= totalTasks) {
      finishWith(attempts);
    } else {
      setTaskIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = () => {
    const finalAttempts = [...attempts, { taskId: task.id, passed: false, retries: 0, hintsShown }];
    if (taskIndex + 1 >= totalTasks) {
      finishWith(finalAttempts);
    } else {
      setAttempts(finalAttempts);
      setTaskIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const finishWith = (finalAttempts: TaskAttempt[]) => {
    const { score } = scoreExercise(finalAttempts, hintsShown);
    const record = recordAttempt({
      exerciseId: exercise.id,
      score,
      hintsUsed: hintsShown,
      completed: true,
    });
    if (record.isFirstCompletion) {
      awardXp(exercise.xpReward, `practice:${exercise.id}`);
      setEarnedXp(exercise.xpReward);
    }
    // Achievements from the updated completion set.
    const completedIds = [
      ...Object.entries({ ...practiceProgress, [exercise.id]: { completed: true } } as Record<string, { completed?: boolean }>)
        .filter(([, v]) => v.completed)
        .map(([id]) => id),
    ];
    const byCategory: Record<string, { completed: number; total: number }> = {};
    for (const ex of PRACTICE_EXERCISES) {
      const bucket = (byCategory[ex.category] ??= { completed: 0, total: 0 });
      bucket.total += 1;
      if (completedIds.includes(ex.id)) bucket.completed += 1;
    }
    grantAchievements(
      getUnlockedAchievementsForPractice(
        completedIds,
        byCategory,
        progress.unlockedAchievementIds,
        PRACTICE_EXERCISES.map((e) => ({ id: e.id, category: e.category, difficulty: e.difficulty }))
      )
    );
    setAttempts(finalAttempts);
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetSession = () => {
    setTaskIndex(0);
    setAttempts([]);
    setHintsShown(0);
    setFinished(false);
    setEarnedXp(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const relatedCommandLinks = (exercise.relatedCommands ?? [])
    .map((id) => getCommandById(GIT_COMMANDS, id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const lessonLinks = resolveLessonLinks(exercise.relatedLessons);
  const scenarioLinks = (exercise.relatedScenarios ?? [])
    .map((id) => getScenarioBySlug(TROUBLESHOOTING_GUIDES, id))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const workflowLinks = (exercise.relatedWorkflows ?? [])
    .map((id) => GIT_WORKFLOWS.find((w) => w.id === id))
    .filter((w): w is NonNullable<typeof w> => Boolean(w));

  if (finished && completion) {
    return (
      <PracticeResultCard
        score={completion.score}
        band={completion.band}
        tasksPassed={attempts.filter((a) => a.passed).length}
        tasksTotal={totalTasks}
        hintsUsed={hintsShown}
        retries={attempts.reduce((s, a) => s + a.retries, 0)}
        xpEarned={earnedXp}
        durationMs={Date.now() - startedAt}
        prevExercise={prevExercise}
        nextExercise={nextExercise}
        onRetry={resetSession}
        relatedCommands={relatedCommandLinks}
        lessonLinks={lessonLinks}
        scenarioLinks={scenarioLinks}
        workflowLinks={workflowLinks}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Header: progress + meta */}
      <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Badge variant="secondary" size="sm">
            {t.pages.practice.taskOf
              .replace('{current}', String(Math.min(taskIndex + 1, totalTasks)))
              .replace('{total}', String(totalTasks))}
          </Badge>
          <Badge variant="outline" size="sm">{exercise.difficulty}</Badge>
          <Badge variant="outline" size="sm">+{exercise.xpReward} XP</Badge>
          <span style={{ marginLeft: 'auto' }} className="label-sm font-mono">
            {completed ? totalTasks : attempts.length}/{totalTasks}
          </span>
        </div>
        <ProgressBar value={Math.round((attempts.length / totalTasks) * 100)} height={6} color="primary" />
        <div>
          <h2 className="title-lg" style={{ margin: 0 }}>{L(exercise.objective)}</h2>
          <p className="body-md" style={{ margin: 'var(--space-1) 0 0', color: 'var(--md-sys-color-on-surface-variant)' }}>
            {L(exercise.description)}
          </p>
        </div>
        {exercise.hints.length > 0 && (
          <div>
            {hintsShown < exercise.hints.length ? (
              <Button
                variant="text"
                size="sm"
                iconLeft={<Lightbulb size={14} />}
                onClick={() => setHintsShown((h) => h + 1)}
              >
                {t.pages.practice.showHint} ({hintsShown}/{exercise.hints.length})
              </Button>
            ) : null}
            {exercise.hints.slice(0, hintsShown).map((hint, i) => (
              <Callout key={i} type="note" title={`${t.pages.practice.hint} ${i + 1}`}>
                {L(hint)}
              </Callout>
            ))}
          </div>
        )}
      </Card>

      {/* Current task */}
      <Card
        variant="elevated"
        padding="lg"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        aria-live="polite"
      >
        <div>
          <span className="label-sm" style={{ color: 'var(--md-sys-color-primary)' }}>
            {t.pages.practice.taskOf.replace('{current}', String(taskIndex + 1)).replace('{total}', String(totalTasks))}
          </span>
          <h3 className="title-md" style={{ margin: '4px 0 0' }}>{L(task.prompt)}</h3>
        </div>
        <TaskRunner
          key={`${exercise.id}:${task.id}`}
          task={task}
          exerciseId={exercise.id}
          difficulty={exercise.difficulty}
          taskNumber={taskIndex + 1}
          taskCount={totalTasks}
          onPass={handlePass}
          onNext={handleNext}
        />
      </Card>

      {/* Footer nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <Button
          variant="outlined"
          size="sm"
          iconLeft={<ArrowLeft size={14} />}
          disabled={taskIndex === 0}
          onClick={() => setTaskIndex((i) => Math.max(0, i - 1))}
        >
          {t.pages.practice.previousTask}
        </Button>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="text" size="sm" iconLeft={<RotateCcw size={14} />} onClick={resetSession}>
            {t.pages.practice.restartExercise}
          </Button>
          {taskIndex + 1 < totalTasks && (
            <Button
              variant="text"
              size="sm"
              iconRight={<ArrowRight size={14} />}
              onClick={handleSkip}
            >
              {t.pages.practice.skipTask}
            </Button>
          )}
        </div>
      </div>

      {/* Related links */}
      <Card variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <span className="label-md">{t.pages.practice.keepExploring}</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {relatedCommandLinks.map((cmd) => (
            <Link key={cmd.id} to={`/commands/git/${cmd.slug}`} className="code-inline font-mono" style={{ textDecoration: 'none' }}>
              {cmd.command}
            </Link>
          ))}
          {lessonLinks.map(({ route, lesson }) => (
            <Link key={lesson.id} to={route.path} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}>
              {isBn && lesson.titleBn ? lesson.titleBn : lesson.title}
            </Link>
          ))}
          {scenarioLinks.map((g) => (
            <Link key={g.id} to={`/troubleshooting/git/${g.slug}`} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}>
              {isBn ? g.title.bn : g.title.en}
            </Link>
          ))}
          {workflowLinks.map((w) => (
            <Link key={w.id} to="/workflows" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}>
              {isBn && w.titleBn ? w.titleBn : w.title}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );

};
