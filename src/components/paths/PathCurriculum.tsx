import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FlaskConical,
  GitPullRequest,
  Wrench,
  Target,
  MessagesSquare,
  Terminal,
  Boxes,
  CheckCircle2,
  Circle,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import { LearningPath, LearningPathStep, LearningPathStepType, PathProgressSummary } from '@/types/learningPath';
import { stepRoute } from '@/features/paths/progress';
import { useGamification } from '@/features/gamification/useGamification';

const STEP_ICONS: Record<LearningPathStepType, typeof BookOpen> = {
  lesson: BookOpen,
  practice: FlaskConical,
  workflow: GitPullRequest,
  troubleshooting: Wrench,
  assessment: Target,
  interview: MessagesSquare,
  command: Terminal,
  explorer: Boxes,
};

export interface PathCurriculumProps {
  path: LearningPath;
  summary: PathProgressSummary;
}

/**
 * Curriculum list + simple vertical map: numbered nodes, connector line,
 * and status that never relies on color alone (icon + label).
 */
export const PathCurriculum: React.FC<PathCurriculumProps> = ({ path, summary }) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.paths;
  const { completeLesson, isLessonCompleted } = useGamification();

  const ordered = [...path.steps].sort((a, b) => a.order - b.order);

  const typeLabel = (type: LearningPathStepType): string => {
    const map: Record<LearningPathStepType, string> = {
      lesson: p.typeLesson,
      practice: p.typePractice,
      workflow: p.typeWorkflow,
      troubleshooting: p.typeTroubleshooting,
      assessment: p.typeAssessment,
      interview: p.typeInterview,
      command: p.typeCommand,
      explorer: p.typeExplorer,
    };
    return map[type];
  };

  const renderStepAction = (step: LearningPathStep, route: string | null) => {
    // Review-type steps (workflow/explorer) complete via explicit marking,
    // reusing the lesson-completion store — same pattern as troubleshooting.
    const isReviewType = step.type === 'workflow' || step.type === 'explorer';
    const done = summary.statusByStep[step.id] === 'completed';
    return (
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
        {route && (
          <Link to={route} style={{ textDecoration: 'none' }}>
            <Button variant={summary.statusByStep[step.id] === 'current' ? 'filled' : 'tonal'} size="sm" iconRight={<ArrowRight size={14} />}>
              {p.openStep}
            </Button>
          </Link>
        )}
        {isReviewType && !done && (
          <Button
            variant="outlined"
            size="sm"
            onClick={() => completeLesson(step.contentId)}
            disabled={isLessonCompleted(step.contentId)}
          >
            {isBn ? 'পর্যালোচিত চিহ্নিত করুন' : 'Mark as reviewed'}
          </Button>
        )}
      </div>
    );
  };

  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      {ordered.map((step, idx) => {
        const status = summary.statusByStep[step.id];
        const Icon = STEP_ICONS[step.type];
        const route = stepRoute(step);
        const isLast = idx === ordered.length - 1;
        const prereqTitles = step.prerequisites
          .map((id) => ordered.find((s) => s.id === id))
          .filter((s): s is LearningPathStep => Boolean(s))
          .map((s) => (isBn ? s.title.bn : s.title.en));

        return (
          <li
            key={step.id}
            style={{ display: 'flex', gap: 'var(--space-3)', position: 'relative', paddingBottom: isLast ? 0 : 'var(--space-4)' }}
          >
            {/* Node + connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }} aria-hidden="true">
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    status === 'completed'
                      ? 'var(--md-sys-color-primary)'
                      : status === 'current'
                        ? 'var(--md-sys-color-tertiary-container)'
                        : 'var(--md-sys-color-surface-container-highest)',
                  color: status === 'completed' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
                  border: status === 'current' ? '2px solid var(--md-sys-color-primary)' : '2px solid transparent',
                }}
              >
                {status === 'completed' ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </span>
              {!isLast && (
                <span style={{ width: '2px', flex: 1, minHeight: '16px', backgroundColor: 'var(--md-sys-color-outline-variant)' }} />
              )}
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', paddingBottom: 'var(--space-1)', minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="label-sm font-mono" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {step.order}
                </span>
                <Badge variant="secondary" size="sm">{typeLabel(step.type)}</Badge>
                {status === 'completed' && (
                  <Badge variant="success" size="sm">
                    <CheckCircle2 size={12} />
                    <span>{p.statusCompleted}</span>
                  </Badge>
                )}
                {status === 'current' && (
                  <Badge variant="tertiary" size="sm">
                    <Circle size={12} />
                    <span>{p.statusCurrent}</span>
                  </Badge>
                )}
                {status === 'suggested' && (
                  <Badge variant="outline" size="sm">
                    <Lock size={12} />
                    <span>{p.statusSuggested}</span>
                  </Badge>
                )}
                {!step.required && (
                  <Badge variant="outline" size="sm">{p.optionalBadge}</Badge>
                )}
              </div>
              <strong className="title-sm">{isBn ? step.title.bn : step.title.en}</strong>
              <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
                {isBn ? step.description.bn : step.description.en}
              </p>
              <p className="body-sm" style={{ margin: 0 }}>
                <em>{isBn ? step.whyItMatters.bn : step.whyItMatters.en}</em>
              </p>
              {status === 'suggested' && prereqTitles.length > 0 && (
                <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
                  {p.suggestedHint}: {prereqTitles.join(', ')}
                </p>
              )}
              {renderStepAction(step, route)}
            </div>
          </li>
        );
      })}
    </ol>
  );
};
