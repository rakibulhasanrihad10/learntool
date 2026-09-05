import React, { useEffect, useMemo } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { CopyButton } from '@/components/common/CopyButton/CopyButton';
import { SafetyBadge } from '@/components/troubleshooting/SafetyBadge/SafetyBadge';
import { FileText, Printer, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { CHEAT_SHEET_SECTIONS } from '@/content/cheatsheet/cheatSheet';
import { resolveEntry } from '@/features/cheatsheet/cheatsheet';

/**
 * Dense printable command grid. Driven by the same cheat-sheet metadata
 * as /cheatsheet, but renders only encyclopedia command references —
 * one syntax line, one purpose, copy, and a detail link per row.
 */
export const GitCheatsheetPage: React.FC = () => {
  const { language, t } = useTranslation();

  useEffect(() => {
    setPageMeta({ title: t.pages.cheatsheet.git.title, description: t.pages.cheatsheet.git.subtitle });
  }, [t.pages.cheatsheet.git.title, t.pages.cheatsheet.git.subtitle]);
  const isBn = language === 'bn';

  const sections = useMemo(
    () =>
      CHEAT_SHEET_SECTIONS.map((section) => ({
        section,
        entries: section.entries
          .map((entry, index) =>
            entry.kind === 'command' ? resolveEntry(section.id, index, entry) : null
          )
          .filter((e): e is NonNullable<typeof e> => e !== null),
      })).filter((s) => s.entries.length > 0),
    []
  );

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Breadcrumb
          items={[
            { label: t.pages.cheatsheet.title, path: '/cheatsheet' },
            { label: t.pages.cheatsheet.git.title, isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Badge variant="primary" size="md">
                <FileText size={14} />
                <span>{t.pages.cheatsheet.git.badge}</span>
              </Badge>
            </div>
            <h1 className="headline-lg" style={{ margin: 0 }}>{t.pages.cheatsheet.git.title}</h1>
            <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
              {t.pages.cheatsheet.git.subtitle}
            </p>
          </div>

          <Button
            variant="tonal"
            size="md"
            iconLeft={<Printer size={16} />}
            onClick={() => window.print()}
          >
            {t.pages.cheatsheet.git.print}
          </Button>
        </div>

        {/* Cheat Sheet Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
          {sections.map(({ section, entries }) => (
            <Card key={section.id} variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <h2 className="title-md" style={{ color: 'var(--md-sys-color-on-surface)', borderBottom: '1px solid var(--md-sys-color-outline-variant)', paddingBottom: 'var(--space-2)', margin: 0 }}>
                {isBn ? section.title.bn : section.title.en}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {entries.map((entry) => (
                  <div
                    key={entry.key}
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
                      <code className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 700, overflowWrap: 'anywhere' }}>{entry.command}</code>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                        {entry.safety !== 'safe' && <SafetyBadge level={entry.safety} />}
                        <CopyButton text={entry.command} variant="icon" size="sm" />
                      </span>
                    </div>
                    <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
                      {isBn ? entry.purpose.bn : entry.purpose.en}
                    </p>
                    {entry.commandRoute && (
                      <Link
                        to={entry.commandRoute}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--md-sys-color-primary)',
                          textDecoration: 'none',
                        }}
                      >
                        {t.pages.cheatsheet.git.viewDetail}
                        <ChevronRight size={13} />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
