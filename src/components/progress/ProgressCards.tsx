import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FlaskConical,
  Wrench,
  MessagesSquare,
  GitMerge,
  Target,
  Trophy,
  Zap,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import {
  ActivityItem,
  ActivityKind,
  Recommendation,
  WeakArea,
  WeakReason,
} from '@/features/progress/dashboard';
import { MASTERY_LEVEL_META } from '@/features/paths/mastery';

/* ---------------- shared helpers ---------------- */

export function formatActivityDate(iso: string, isBn: boolean): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const locale = isBn ? 'bn-BD' : 'en-US';
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  const absolute = date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  if (diffDays <= 0) return isBn ? `আজ · ${absolute}` : `Today · ${absolute}`;
  if (diffDays === 1) return isBn ? `গতকাল · ${absolute}` : `Yesterday · ${absolute}`;
  if (diffDays < 7) return isBn ? `${diffDays} দিন আগে` : `${diffDays}d ago`;
  return absolute;
}

const KIND_ICONS: Record<Recommendation['kind'], typeof BookOpen> = {
  path: GitMerge,
  lesson: BookOpen,
  practice: FlaskConical,
  troubleshooting: Wrench,
  interview: MessagesSquare,
};

const ACTIVITY_ICONS: Record<ActivityKind, typeof BookOpen> = {
  lesson: BookOpen,
  troubleshooting: Wrench,
  workflow: GitMerge,
  practice: FlaskConical,
  interview: MessagesSquare,
  mock: Target,
  daily: Zap,
};

/* ---------------- RecommendationCard ---------------- */

export const RecommendationCard: React.FC<{ rec: Recommendation }> = ({ rec }) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.progress;
  const Icon = KIND_ICONS[rec.kind];
  const kindLabel =
    rec.kind === 'path' ? p.recKindPath
    : rec.kind === 'lesson' ? p.recKindLesson
    : rec.kind === 'practice' ? p.recKindPractice
    : rec.kind === 'troubleshooting' ? p.recKindTroubleshooting
    : p.recKindInterview;

  return (
    <Card variant="filled" padding="md" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
      <span
        aria-hidden="true"
        style={{
          width: '36px', height: '36px', borderRadius: 'var(--radius-md)', flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'var(--md-sys-color-primary-container)',
          color: 'var(--md-sys-color-on-primary-container)',
        }}
      >
        <Icon size={18} />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          <strong className="title-sm">{isBn ? rec.title.bn : rec.title.en}</strong>
          <Badge variant="secondary" size="sm">{kindLabel}</Badge>
        </div>
        <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
          {isBn ? rec.detail.bn : rec.detail.en}
        </p>
        <div>
          <Link to={rec.route} style={{ textDecoration: 'none' }}>
            <Button variant="tonal" size="sm" iconRight={<ArrowRight size={14} />}>
              {p.startAction}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

/* ---------------- WeakAreaCard ---------------- */

function reasonText(reason: WeakReason, isBn: boolean): string {
  switch (reason.kind) {
    case 'practice-score':
      return isBn
        ? `অনুশীলন গড় ${reason.avgBest} (${reason.attempts} বার চেষ্টা)`
        : `Practice averages ${reason.avgBest} over ${reason.attempts} attempts`;
    case 'lessons-incomplete':
      return isBn
        ? `${reason.total}টি পাঠের ${reason.total - reason.done}টি বাকি`
        : `${reason.total - reason.done} of ${reason.total} lessons unfinished`;
    case 'interview-low':
      return isBn
        ? `ইন্টারভিউ প্রশ্ন দেখা হয়েছে ${reason.reviewed}/${reason.total}`
        : `Only ${reason.reviewed}/${reason.total} interview questions reviewed`;
    case 'cookbook-untouched':
      return isBn ? 'রিকভারি রেসিপি এখনো দেখা হয়নি' : 'Recovery recipes not yet reviewed';
    case 'not-started':
      return isBn ? 'এখনো শুরু হয়নি' : 'No activity yet';
  }
}

export const WeakAreaCard: React.FC<{ weak: WeakArea }> = ({ weak }) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.progress;
  const { topic } = weak;

  const links = [
    weak.lessonRoute && { label: p.reviewLesson, route: weak.lessonRoute },
    weak.practiceRoute && { label: p.reviewPractice, route: weak.practiceRoute },
    weak.troubleshootingRoute && { label: p.reviewCookbook, route: weak.troubleshootingRoute },
    weak.interviewRoute && { label: p.reviewInterview, route: weak.interviewRoute },
  ].filter((l): l is { label: string; route: string } => Boolean(l));

  return (
    <Card variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <strong className="title-sm">{isBn ? topic.title.bn : topic.title.en}</strong>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="label-sm font-mono">{topic.score}%</span>
          <Badge variant={topic.level === 'strong' ? 'success' : topic.level === 'familiar' ? 'primary' : 'outline'} size="sm">
            {isBn ? MASTERY_LEVEL_META[topic.level].bn : MASTERY_LEVEL_META[topic.level].en}
          </Badge>
        </span>
      </div>
      <ul className="body-sm" style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--md-sys-color-on-surface-variant)' }}>
        <li key="why" style={{ listStyle: 'none', marginLeft: 'calc(-1 * var(--space-4))' }}>
          <span className="label-sm">{p.whyLabel}: </span>
        </li>
        {weak.reasons.map((r, i) => (
          <li key={i}>{reasonText(r, isBn)}</li>
        ))}
      </ul>
      {links.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {links.map((l) => (
            <Link key={l.route} to={l.route} style={{ textDecoration: 'none' }}>
              <Button variant="text" size="sm" iconRight={<ArrowRight size={14} />}>{l.label}</Button>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};

/* ---------------- ActivityItemRow ---------------- */

export const ActivityItemRow: React.FC<{ item: ActivityItem }> = ({ item }) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const Icon = ACTIVITY_ICONS[item.kind];
  const kindLabel =
    item.kind === 'lesson' ? t.pages.paths.typeLesson
    : item.kind === 'troubleshooting' ? t.pages.paths.typeTroubleshooting
    : item.kind === 'workflow' ? t.pages.paths.typeWorkflow
    : item.kind === 'practice' ? t.pages.paths.typePractice
    : item.kind === 'interview' ? t.pages.paths.typeInterview
    : item.kind === 'mock' ? t.pages.progress.activityMock
    : t.pages.progress.activityDaily;

  return (
    <li style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', padding: 'var(--space-2) 0' }}>
      <span
        aria-hidden="true"
        style={{
          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'var(--md-sys-color-surface-container-highest)',
          color: 'var(--md-sys-color-on-surface-variant)',
        }}
      >
        <Icon size={16} />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
        <span className="body-md" style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {isBn ? item.title.bn : item.title.en}
        </span>
        <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge variant="outline" size="sm">{kindLabel}</Badge>
          <time dateTime={item.at}>{formatActivityDate(item.at, isBn)}</time>
        </span>
      </div>
    </li>
  );
};

/* ---------------- shared empty state ---------------- */

export const ProgressEmptyState: React.FC<{ icon: React.ReactNode; title: string; body: string; actionLabel: string; actionTo: string }> = ({
  icon, title, body, actionLabel, actionTo,
}) => (
  <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
    <span aria-hidden="true" style={{ color: 'var(--md-sys-color-primary)' }}>{icon}</span>
    <strong className="title-md">{title}</strong>
    <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{body}</p>
    <Link to={actionTo} style={{ textDecoration: 'none' }}>
      <Button variant="filled" size="sm" iconRight={<ArrowRight size={16} />}>{actionLabel}</Button>
    </Link>
  </Card>
);

export const TrophyIcon: React.FC = () => <Trophy size={22} />;
export const RetryIcon: React.FC = () => <RotateCcw size={14} />;
