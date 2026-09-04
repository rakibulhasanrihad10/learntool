/**
 * TaskRunner — renders one practice task by kind and reports completion.
 *
 * - select: adapted QuizCard (options mapped to QuizQuestion shape)
 * - order: keyboard-accessible reorder list (move up/down buttons)
 * - complete: command-blank input, exact match (Git syntax is exact)
 * - simulate: live simulator (RepositoryState + CommandPanel + Check/Reset)
 *
 * Contract: calls onPass(retries) exactly once when the task passes, then
 * shows the explanation with a Continue button that calls onNext().
 */
import React, { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Callout } from '@/components/feedback/Callout/Callout';
import { TerminalPreview } from '@/components/data-display/TerminalPreview/TerminalPreview';
import { QuizCard } from '@/components/evaluation/QuizCard/QuizCard';
import { RepositoryState } from '@/components/simulation/RepositoryState/RepositoryState';
import { CommitGraph } from '@/components/simulation/CommitGraph/CommitGraph';
import { CommandPanel } from '@/components/simulation/CommandPanel/CommandPanel';
import { useTranslation } from '@/i18n/context';
import { useFreePlay } from '@/features/simulation/useGitSimulation';
import { evaluateAllRules } from '@/features/practice/validation';
import { DifficultyLevel } from '@/types/content';
import { PracticeTask } from '@/types/practice';

export interface TaskRunnerProps {
  task: PracticeTask;
  exerciseId: string;
  difficulty: DifficultyLevel;
  taskNumber: number;
  taskCount: number;
  onPass: (retries: number) => void;
  onNext: () => void;
}

function useLocalText() {
  const { language } = useTranslation();
  return (text: { en: string; bn?: string }) =>
    language === 'bn' && text.bn ? text.bn : text.en;
}

function useItemText() {
  const { language } = useTranslation();
  return (item: { label: string; labelBn?: string }) =>
    language === 'bn' && item.labelBn ? item.labelBn : item.label;
}

function SnapshotView({ task }: { task: PracticeTask }) {
  if (!task.stateSnapshot) return null;
  if (task.snapshotView === 'graph') {
    return (
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <CommitGraph state={task.stateSnapshot} />
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 'var(--space-3)' }}>
      <RepositoryState state={task.stateSnapshot} />
    </div>
  );
}

function PassedBanner({
  explanation, onNext, isLast,
}: {
  explanation: string;
  onNext: () => void;
  isLast: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
      <Callout type="tip" title={t.pages.practice.correct}>
        {explanation}
      </Callout>
      <div>
        <Button variant="filled" size="md" onClick={onNext} iconRight={<CheckCircle2 size={16} />}>
          {isLast ? t.pages.practice.finishExercise : t.pages.practice.nextTask}
        </Button>
      </div>
    </div>
  );
}

function SelectRunner(props: Omit<TaskRunnerProps, 'onPass'> & { task: Extract<PracticeTask, { kind: 'select' }>; onPass: (retries: number) => void }) {
  const { task, exerciseId, difficulty, taskNumber, taskCount, onPass, onNext } = props;
  const localize = useLocalText();
  const [wrongCount, setWrongCount] = useState(0);
  const [passed, setPassed] = useState(false);

  const quiz = useMemo(
    () => ({
      id: `${exerciseId}:${task.id}`,
      subjectId: 'git' as const,
      difficulty,
      question: localize(task.prompt),
      explanation: localize(task.explanation),
      options: task.options.map((o) => ({
        id: o.id,
        text: o.label,
        textBn: o.labelBn,
        isCorrect: o.correct,
      })),
    }),
    [exerciseId, task, difficulty, localize]
  );

  if (passed) {
    return <PassedBanner explanation={localize(task.explanation)} onNext={onNext} isLast={taskNumber === taskCount} />;
  }

  return (
    <>
      <SnapshotView task={task} />
      <QuizCard
        question={quiz}
        currentIndex={taskNumber - 1}
        totalQuestions={taskCount}
        onAnswer={(_optionId, isCorrect) => {
          if (isCorrect) {
            onPass(wrongCount);
            setPassed(true);
          } else {
            setWrongCount((c) => c + 1);
          }
        }}
      />
    </>
  );
}

function OrderRunner(props: Omit<TaskRunnerProps, 'onPass'> & { task: Extract<PracticeTask, { kind: 'order' }>; onPass: (retries: number) => void }) {
  const { task, taskNumber, taskCount, onPass, onNext } = props;
  const { t } = useTranslation();
  const localize = useLocalText();
  const itemText = useItemText();
  const [order, setOrder] = useState<string[]>(() => task.items.map((i) => i.id));
  const [wrongCount, setWrongCount] = useState(0);
  const [failed, setFailed] = useState(false);
  const [passed, setPassed] = useState(false);

  const move = (index: number, delta: -1 | 1) => {
    const next = [...order];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setFailed(false);
  };

  const check = () => {
    const correct = task.correctOrder.every((id, i) => order[i] === id);
    if (correct) {
      onPass(wrongCount);
      setPassed(true);
    } else {
      setWrongCount((c) => c + 1);
      setFailed(true);
    }
  };

  if (passed) {
    return <PassedBanner explanation={localize(task.explanation)} onNext={onNext} isLast={taskNumber === taskCount} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <SnapshotView task={task} />
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {order.map((id, index) => {
          const item = task.items.find((i) => i.id === id)!;
          return (
            <li
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
              }}
            >
              <span
                className="label-md font-mono"
                aria-hidden="true"
                style={{
                  minWidth: '1.75rem',
                  height: '1.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: 'var(--md-sys-color-primary-container)',
                  color: 'var(--md-sys-color-on-primary-container)',
                }}
              >
                {index + 1}
              </span>
              <span className="body-md" style={{ flex: 1 }}>{itemText(item)}</span>
              <Button
                variant="icon"
                size="sm"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                aria-label={`${t.pages.practice.moveUp}: ${itemText(item)}`}
              >
                <ArrowUp size={16} />
              </Button>
              <Button
                variant="icon"
                size="sm"
                disabled={index === order.length - 1}
                onClick={() => move(index, 1)}
                aria-label={`${t.pages.practice.moveDown}: ${itemText(item)}`}
              >
                <ArrowDown size={16} />
              </Button>
            </li>
          );
        })}
      </ol>
      {failed && (
        <Callout type="warning" title={t.pages.practice.notQuite}>
          {t.pages.practice.orderHint}
        </Callout>
      )}
      <div>
        <Button variant="filled" size="md" onClick={check}>
          {t.pages.practice.checkAnswer}
        </Button>
      </div>
    </div>
  );
}

function CompleteRunner(props: Omit<TaskRunnerProps, 'onPass'> & { task: Extract<PracticeTask, { kind: 'complete' }>; onPass: (retries: number) => void }) {
  const { task, taskNumber, taskCount, onPass, onNext } = props;
  const { t } = useTranslation();
  const localize = useLocalText();
  const [value, setValue] = useState('');
  const [wrongCount, setWrongCount] = useState(0);
  const [failed, setFailed] = useState(false);
  const [passed, setPassed] = useState(false);

  const check = () => {
    const normalized = value.trim();
    if (task.acceptedAnswers.some((a) => a === normalized)) {
      onPass(wrongCount);
      setPassed(true);
    } else {
      setWrongCount((c) => c + 1);
      setFailed(true);
    }
  };

  if (passed) {
    return <PassedBanner explanation={localize(task.explanation)} onNext={onNext} isLast={taskNumber === taskCount} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <SnapshotView task={task} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--code-border)',
          backgroundColor: 'var(--code-bg)',
          color: 'var(--code-text)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span aria-hidden="true" style={{ color: '#38bdf8' }}>$</span>
        <span>{task.prefix}</span>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setFailed(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') check();
          }}
          placeholder={task.placeholder ?? '___'}
          aria-label={localize(task.prompt)}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1,
            minWidth: '8rem',
            background: 'transparent',
            border: 'none',
            borderBottom: '2px solid var(--md-sys-color-primary)',
            color: 'inherit',
            font: 'inherit',
            outline: 'none',
            padding: '2px 4px',
          }}
        />
      </div>
      {failed && (
        <Callout type="warning" title={t.pages.practice.notQuite}>
          {t.pages.practice.completeHint}
        </Callout>
      )}
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <Button variant="filled" size="md" onClick={check} disabled={value.trim().length === 0}>
          {t.pages.practice.checkAnswer}
        </Button>
      </div>
    </div>
  );
}

function SimulateRunner(props: Omit<TaskRunnerProps, 'onPass'> & { task: Extract<PracticeTask, { kind: 'simulate' }>; onPass: (retries: number) => void }) {
  const { task, taskNumber, taskCount, onPass, onNext } = props;
  const { language, t } = useTranslation();
  const localize = useLocalText();
  const play = useFreePlay(task.setup);
  const [wrongCount, setWrongCount] = useState(0);
  const [failed, setFailed] = useState(false);
  const [passed, setPassed] = useState(false);

  const report = evaluateAllRules(play.state, task.validation);

  const check = () => {
    if (report.passed) {
      onPass(wrongCount);
      setPassed(true);
    } else {
      setWrongCount((c) => c + 1);
      setFailed(true);
    }
  };

  const resetTask = () => {
    play.reset();
    setFailed(false);
  };

  if (passed) {
    return (
      <>
        <RepositoryState state={play.state} highlight={play.lastResult?.changes ?? []} />
        <PassedBanner explanation={localize(task.explanation)} onNext={onNext} isLast={taskNumber === taskCount} />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <RepositoryState state={play.state} highlight={play.lastResult?.changes ?? []} />

      <Card variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h4 className="label-md">{t.pages.practice.goalChecklist}</h4>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {report.verdicts.map((v, i) => (
            <li key={i} className="body-sm" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {v.pass ? (
                <CheckCircle2 size={16} color="var(--md-sys-color-success)" aria-label={t.pages.practice.met} />
              ) : (
                <XCircle size={16} color="var(--md-sys-color-on-surface-variant)" aria-label={t.pages.practice.unmet} />
              )}
              <span>{language === 'bn' ? v.label.bn : v.label.en}</span>
            </li>
          ))}
        </ul>
      </Card>

      <CommandPanel state={play.state} onRun={(action) => { play.run(action); setFailed(false); }} />

      {play.lastResult && (
        <TerminalPreview
          command={play.lastResult.terminal.command}
          output={language === 'bn' ? play.lastResult.terminal.outputBn : play.lastResult.terminal.outputEn}
          title={t.pages.simulator.terminalTitle}
          copyable={false}
        />
      )}

      {failed && (
        <Callout type="warning" title={t.pages.practice.notQuite}>
          {t.pages.practice.simHint}
        </Callout>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Button variant="filled" size="md" onClick={check}>
          {t.pages.practice.checkAnswer}
        </Button>
        <Button variant="text" size="md" onClick={resetTask} iconLeft={<RotateCcw size={16} />}>
          {t.pages.simulator.resetSim}
        </Button>
      </div>
    </div>
  );
}

export const TaskRunner: React.FC<TaskRunnerProps> = (props) => {
  switch (props.task.kind) {
    case 'select':
      return <SelectRunner {...props} task={props.task} />;
    case 'order':
      return <OrderRunner {...props} task={props.task} />;
    case 'complete':
      return <CompleteRunner {...props} task={props.task} />;
    case 'simulate':
      return <SimulateRunner {...props} task={props.task} />;
  }
};
