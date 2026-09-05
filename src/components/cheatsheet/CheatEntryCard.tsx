import React from 'react';
import { Link } from 'react-router-dom';
import { CopyButton } from '@/components/common/CopyButton/CopyButton';
import { SafetyBadge } from '@/components/troubleshooting/SafetyBadge/SafetyBadge';
import { useTranslation } from '@/i18n/context';
import { ResolvedEntry } from '@/features/cheatsheet/cheatsheet';
import { TriangleAlert, ChevronRight } from 'lucide-react';

/**
 * One copy-first command row. Destructive entries stay visually quiet —
 * the SafetyBadge (icon + text, never color alone) carries the warning,
 * plus a caveat line and a recovery link where the metadata provides one.
 */
export const CheatEntryCard: React.FC<{ entry: ResolvedEntry }> = ({ entry }) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.cheatsheet;
  const link = entry.guideRoute ?? entry.learnRoute ?? entry.commandRoute;
  const linkLabel = entry.guideRoute ? p.fixGuide : entry.learnRoute ? p.learnMore : p.reference;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        border: '1px solid var(--md-sys-color-outline-variant)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <code
          className="font-mono"
          aria-label={`${p.commandLabel}: ${entry.command}`}
          style={{ fontSize: '0.875rem', fontWeight: 700, overflowWrap: 'anywhere' }}
        >
          {entry.command}
        </code>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
          {entry.safety !== 'safe' && <SafetyBadge level={entry.safety} />}
          <CopyButton text={entry.command} variant="tonal" size="md" />
        </span>
      </div>
      <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
        {isBn ? entry.purpose.bn : entry.purpose.en}
      </p>
      {entry.caveat && (
        <p className="body-sm" style={{ margin: 0, display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          <TriangleAlert size={14} aria-hidden="true" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{isBn ? entry.caveat.bn : entry.caveat.en}</span>
        </p>
      )}
      {link && (
        <Link
          to={link}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '2px',
            fontSize: '0.8125rem', fontWeight: 600,
            color: 'var(--md-sys-color-primary)', textDecoration: 'none',
          }}
        >
          {linkLabel}
          <ChevronRight size={13} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
};
