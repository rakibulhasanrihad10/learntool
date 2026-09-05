import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Terminal,
  GitPullRequest,
  Wrench,
  FlaskConical,
  MessagesSquare,
  Boxes,
  Github,
  Route,
  FileText,
  Gauge,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { useTranslation } from '@/i18n/context';
import { SearchIndexItem, SearchResultType } from '@/features/search/searchTypes';

export const TYPE_ICONS: Record<SearchResultType | 'page', typeof BookOpen> = {
  lesson: BookOpen,
  command: Terminal,
  workflow: GitPullRequest,
  troubleshooting: Wrench,
  practice: FlaskConical,
  interview: MessagesSquare,
  internals: Boxes,
  github: Github,
  path: Route,
  cheatsheet: FileText,
  page: Gauge,
};

export function typeLabel(type: SearchResultType | 'page', t: ReturnType<typeof useTranslation>['t']): string {
  const s = t.common.search;
  switch (type) {
    case 'lesson': return s.lessonsGroup;
    case 'command': return s.commandsGroup;
    case 'workflow': return s.workflowsGroup;
    case 'troubleshooting': return s.troubleshootingGroup;
    case 'practice': return s.practiceGroup;
    case 'interview': return s.interviewGroup;
    case 'internals': return s.internalsGroup;
    case 'github': return s.githubGroup;
    case 'path': return t.nav.paths;
    case 'cheatsheet': return s.cheatsheetsGroup;
    case 'page': return t.nav.progress;
  }
}

/**
 * Accessible match highlighting. Wraps query-token spans in <mark> —
 * visual emphasis only, the underlying text (including command syntax)
 * is never modified or translated.
 */
export const Highlight: React.FC<{ text: string; tokens: string[] }> = ({ text, tokens }) => {
  const terms = tokens.filter((t) => t.length >= 2);
  if (terms.length === 0) return <>{text}</>;
  const pattern = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  );
  const parts = text.split(pattern);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <mark key={i}>{part}</mark> : <React.Fragment key={i}>{part}</React.Fragment>
      )}
    </>
  );
};

export interface SearchResultCardProps {
  item: SearchIndexItem;
  tokens?: string[];
  related?: SearchIndexItem[];
  onNavigate?: () => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  item,
  tokens = [],
  related = [],
  onNavigate,
}) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const Icon = TYPE_ICONS[item.type];
  const title = isBn ? item.title.bn : item.title.en;
  const description = isBn ? item.description.bn : item.description.en;

  return (
    <Card variant="filled" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
        <span
          aria-hidden="true"
          style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-md)', flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--md-sys-color-surface-container-highest)',
            color: 'var(--md-sys-color-on-surface-variant)',
          }}
        >
          <Icon size={18} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge variant="secondary" size="sm">{typeLabel(item.type, t)}</Badge>
            {item.difficulty && <DifficultyBadge difficulty={item.difficulty} size="sm" />}
          </div>
          <Link
            to={item.route}
            onClick={onNavigate}
            className="title-md"
            style={{ color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
          >
            {item.type === 'command' ? <code><Highlight text={title} tokens={tokens} /></code> : <Highlight text={title} tokens={tokens} />}
          </Link>
          <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
            <Highlight text={description} tokens={tokens} />
          </p>
          {related.length > 0 && (
            <p className="body-sm" style={{ margin: 0 }}>
              <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {t.pages.search.relatedLabel}:{' '}
              </span>
              {related.map((r, i) => (
                <React.Fragment key={r.id}>
                  <Link to={r.route} onClick={onNavigate} style={{ color: 'var(--md-sys-color-primary)' }}>
                    {isBn ? r.title.bn : r.title.en}
                  </Link>
                  {i < related.length - 1 ? ' · ' : ''}
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
        <Link
          to={item.route}
          onClick={onNavigate}
          aria-label={`${title}`}
          style={{ color: 'var(--md-sys-color-on-surface-variant)', flexShrink: 0, marginTop: 'var(--space-1)' }}
        >
          <ArrowRight size={16} />
        </Link>
      </div>
    </Card>
  );
};
