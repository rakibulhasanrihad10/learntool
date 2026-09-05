import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { CopyButton } from '@/components/common/CopyButton/CopyButton';
import { SafetyBadge } from '@/components/troubleshooting/SafetyBadge/SafetyBadge';
import { useTranslation } from '@/i18n/context';
import { safetyFor } from '@/features/cheatsheet/cheatsheet';
import { CommandComparison, UndoSituation, WorkflowRecipe } from '@/content/cheatsheet/cheatSheetExtras';
import { TROUBLESHOOTING_GUIDES } from '@/content/git';
import { ArrowDown, ChevronRight } from 'lucide-react';

/* ---------------- workflow recipe ---------------- */

export const RecipeCard: React.FC<{ recipe: WorkflowRecipe }> = ({ recipe }) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const block = recipe.lines.join('\n');
  return (
    <Card variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)' }}>
        <strong className="title-sm">{isBn ? recipe.title.bn : recipe.title.en}</strong>
        <CopyButton text={block} variant="tonal" size="md" />
      </div>
      <pre
        className="font-mono"
        style={{
          margin: 0, padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--md-sys-color-surface-container-highest)',
          fontSize: '0.8125rem', overflowX: 'auto', whiteSpace: 'pre',
        }}
      >
        {block}
      </pre>
      {recipe.note && (
        <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
          {isBn ? recipe.note.bn : recipe.note.en}
        </p>
      )}
      <Link
        to={recipe.route}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
      >
        {t.pages.cheatsheet.learnMore}
        <ChevronRight size={13} aria-hidden="true" />
      </Link>
    </Card>
  );
};

/* ---------------- comparison ---------------- */

export const ComparisonCard: React.FC<{ comparison: CommandComparison }> = ({ comparison }) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  return (
    <Card variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <code className="font-mono" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
        {isBn ? comparison.title.bn : comparison.title.en}
      </code>
      <p className="body-sm" style={{ margin: 0 }}>
        <strong>{t.pages.cheatsheet.keyDifference}: </strong>
        {isBn ? comparison.difference.bn : comparison.difference.en}
      </p>
      <ul className="body-sm" style={{ margin: 0, paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <li>{isBn ? comparison.useA.bn : comparison.useA.en}</li>
        <li>{isBn ? comparison.useB.bn : comparison.useB.en}</li>
      </ul>
      <Link
        to={comparison.learnRoute}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
      >
        {t.pages.cheatsheet.learnMore}
        <ChevronRight size={13} aria-hidden="true" />
      </Link>
    </Card>
  );
};

/* ---------------- undo situation ---------------- */

export const UndoCard: React.FC<{ situation: UndoSituation }> = ({ situation }) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.cheatsheet;
  const guide = TROUBLESHOOTING_GUIDES.find((g) => g.id === situation.guideId);
  const safety = safetyFor(situation.command);
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
        padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        border: '1px solid var(--md-sys-color-outline-variant)',
      }}
    >
      <strong className="body-md">{isBn ? situation.situation.bn : situation.situation.en}</strong>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <code className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 700, overflowWrap: 'anywhere' }}>
          {situation.command}
        </code>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
          {safety !== 'safe' && <SafetyBadge level={safety} />}
          <CopyButton text={situation.command} variant="tonal" size="md" />
        </span>
      </div>
      <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
        {isBn ? situation.explanation.bn : situation.explanation.en}
      </p>
      {guide && (
        <Link
          to={`/troubleshooting/git/${guide.slug}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
        >
          {p.fixGuide}
          <ChevronRight size={13} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
};

/* ---------------- GitHub flow diagram (text, no API) ---------------- */

const FLOW_STEPS = [
  'Fork',
  'Clone',
  'Create branch',
  'Make changes',
  'Commit',
  'Push',
  'Open Pull Request',
  'Review',
  'Merge',
];

export const GitHubFlow: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Card variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'stretch' }}>
      <strong className="title-sm" style={{ marginBottom: 'var(--space-2)' }}>{t.pages.cheatsheet.githubFlowTitle}</strong>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {FLOW_STEPS.map((step, i) => (
          <li key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <code
              className="font-mono"
              style={{
                padding: 'var(--space-1) var(--space-3)', borderRadius: '999px',
                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                fontSize: '0.8125rem', fontWeight: 600,
              }}
            >
              {step}
            </code>
            {i < FLOW_STEPS.length - 1 && (
              <ArrowDown size={14} aria-hidden="true" style={{ margin: '2px 0', color: 'var(--md-sys-color-on-surface-variant)' }} />
            )}
          </li>
        ))}
      </ol>
      <Link
        to="/workflows/github-pr"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: 'var(--space-2)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
      >
        {t.pages.cheatsheet.learnMore}
        <ChevronRight size={13} aria-hidden="true" />
      </Link>
    </Card>
  );
};
