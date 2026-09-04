/**
 * PracticeResultCard — end-of-exercise summary: score band, XP, task/hint
 * stats, mistakes review entry, and next steps (retry, next, links).
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, RotateCcw } from 'lucide-react';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { useTranslation } from '@/i18n/context';
import { DetailedCommand } from '@/types/content';
import { PracticeExercise, ScoreBand } from '@/types/practice';
import { ResolvedLessonLink } from '@/content/github/githubModules';
import { TroubleshootingGuide } from '@/types/content';
import { Workflow } from '@/types/content';

export interface PracticeResultCardProps {
  score: number;
  band: ScoreBand;
  tasksPassed: number;
  tasksTotal: number;
  hintsUsed: number;
  retries: number;
  xpEarned: number;
  durationMs: number;
  prevExercise?: PracticeExercise;
  nextExercise?: PracticeExercise;
  onRetry: () => void;
  relatedCommands: DetailedCommand[];
  lessonLinks: ResolvedLessonLink[];
  scenarioLinks: TroubleshootingGuide[];
  workflowLinks: Workflow[];
}

const BAND_VARIANT: Record<ScoreBand, 'success' | 'primary' | 'warning' | 'error'> = {
  mastered: 'success',
  strong: 'primary',
  'needs-practice': 'warning',
  review: 'error',
};

function formatDuration(ms: number, isBn: boolean): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (isBn) {
    const digits = (n: number) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);
    if (minutes === 0) return `${digits(seconds)} সেকেন্ড`;
    return `${digits(minutes)} মিনিট ${digits(seconds)} সেকেন্ড`;
  }
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export const PracticeResultCard: React.FC<PracticeResultCardProps> = ({
  score,
  band,
  tasksPassed,
  tasksTotal,
  hintsUsed,
  retries,
  xpEarned,
  durationMs,
  prevExercise,
  nextExercise,
  onRetry,
  relatedCommands,
  lessonLinks,
  scenarioLinks,
  workflowLinks,
}) => {
  const { language, t } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.practice;

  const bandLabel =
    band === 'mastered' ? p.bandMastered
    : band === 'strong' ? p.bandStrong
    : band === 'needs-practice' ? p.bandNeedsPractice
    : p.bandReview;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }} aria-live="polite">
      <Card variant="elevated" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center', textAlign: 'center' }}>
        <Award size={40} color="var(--md-sys-color-primary)" aria-hidden="true" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <h2 className="headline-md" style={{ margin: 0 }}>{p.exerciseComplete}</h2>
          <Badge variant={BAND_VARIANT[band]} size="md">{bandLabel}</Badge>
        </div>
        <div className="headline-lg font-mono" aria-label={`${p.score}: ${score}/100`}>
          {score}<span style={{ fontSize: '1.25rem', color: 'var(--md-sys-color-on-surface-variant)' }}>/100</span>
        </div>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <ProgressBar value={score} height={8} color="primary" />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }} className="body-sm">
          <span>{p.tasksPassed}: <strong>{tasksPassed}/{tasksTotal}</strong></span>
          <span>{p.hintsUsedLabel}: <strong>{hintsUsed}</strong></span>
          <span>{p.retriesLabel}: <strong>{retries}</strong></span>
          <span>{p.timeTaken}: <strong>{formatDuration(durationMs, isBn)}</strong></span>
          {xpEarned > 0 && (
            <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 700 }}>+{xpEarned} XP</span>
          )}
        </div>
        {band === 'review' || band === 'needs-practice' ? (
          <p className="body-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '480px' }}>
            {p.reviewRecommended}
          </p>
        ) : null}
      </Card>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="outlined" size="md" iconLeft={<RotateCcw size={16} />} onClick={onRetry}>
          {p.retryExercise}
        </Button>
        {prevExercise && (
          <Link to={`/practice/${prevExercise.id.split('.').pop()}`} style={{ textDecoration: 'none' }}>
            <Button variant="text" size="md" iconLeft={<ArrowLeft size={16} />}>
              {p.prevExercise}
            </Button>
          </Link>
        )}
        {nextExercise && (
          <Link to={`/practice/${nextExercise.id.split('.').pop()}`} style={{ textDecoration: 'none' }}>
            <Button variant="filled" size="md" iconRight={<ArrowRight size={16} />}>
              {p.nextExercise}
            </Button>
          </Link>
        )}
      </div>

      {(relatedCommands.length > 0 || lessonLinks.length > 0 || scenarioLinks.length > 0 || workflowLinks.length > 0) && (
        <Card variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span className="label-md">{p.keepExploring}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {relatedCommands.map((cmd) => (
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
      )}
    </div>
  );
};
