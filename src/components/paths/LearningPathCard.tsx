import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { useTranslation } from '@/i18n/context';
import { LearningPath, PathProgressSummary } from '@/types/learningPath';
import { ListOrdered, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface LearningPathCardProps {
  path: LearningPath;
  summary: PathProgressSummary;
}

export function formatDuration(totalMinutes: number, isBn: boolean): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (isBn) {
    if (hours === 0) return `${minutes} মিনিট`;
    return minutes === 0 ? `${hours} ঘণ্টা` : `${hours} ঘণ্টা ${minutes} মিনিট`;
  }
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

export function pathDuration(path: LearningPath): number {
  return path.steps.reduce((sum, s) => sum + s.estimatedMinutes, 0);
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({ path, summary }) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.paths;

  return (
    <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <DifficultyBadge difficulty={path.difficulty} size="sm" />
        {summary.complete ? (
          <Badge variant="success" size="sm">
            <CheckCircle2 size={12} />
            <span>{p.completedBadge}</span>
          </Badge>
        ) : summary.started ? (
          <Badge variant="primary" size="sm">{p.inProgressBadge}</Badge>
        ) : (
          <Badge variant="outline" size="sm">{p.notStartedBadge}</Badge>
        )}
      </div>

      <div>
        <h3 className="title-lg" style={{ margin: 0 }}>{isBn ? path.title.bn : path.title.en}</h3>
        <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--space-1)' }}>
          {isBn ? path.description.bn : path.description.en}
        </p>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-1)' }}>
          <span className="label-sm">
            {summary.requiredCompleted}/{summary.requiredTotal} {p.stepsLabel}
          </span>
          <span className="label-sm font-mono">{summary.percent}%</span>
        </div>
        <ProgressBar value={summary.percent} height={8} color="primary" />
      </div>

      <div className="body-sm" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', color: 'var(--md-sys-color-on-surface-variant)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ListOrdered size={14} /> {path.steps.length} {p.stepsLabel}
        </span>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <Link to={`/learn/paths/${path.id}`} style={{ textDecoration: 'none' }}>
          <Button variant={summary.started && !summary.complete ? 'filled' : 'tonal'} size="md" iconRight={<ArrowRight size={16} />}>
            {summary.complete ? p.reviewButton : summary.started ? p.continueButton : p.startButton}
          </Button>
        </Link>
      </div>
    </Card>
  );
};
