import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { CopyButton } from '@/components/common/CopyButton/CopyButton';
import { FileText, Printer, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { GIT_COMMANDS } from '@/content/git';
import { getCommandBySlug } from '@/utils/commandSearch';

interface CheatsheetSection {
  title: string;
  titleBn: string;
  slugs: string[];
}

const CHEAT_SECTIONS: CheatsheetSection[] = [
  { title: 'Repository Setup', titleBn: 'রিপোজিটরি সেটআপ', slugs: ['init', 'clone'] },
  { title: 'Inspect', titleBn: 'নিরীক্ষণ', slugs: ['status', 'log', 'diff', 'show'] },
  { title: 'Stage & Commit', titleBn: 'স্টেজ ও কমিট', slugs: ['add', 'commit'] },
  { title: 'Branch', titleBn: 'ব্রাঞ্চ', slugs: ['branch', 'switch', 'checkout'] },
  { title: 'Merge & Rebase', titleBn: 'মার্জ ও রিব্যাস', slugs: ['merge', 'rebase'] },
  { title: 'Remote', titleBn: 'রিমোট', slugs: ['remote', 'fetch', 'pull', 'push'] },
  { title: 'Undo & Recovery', titleBn: 'আনডু ও রিকভারি', slugs: ['restore', 'reset'] },
];

export const GitCheatsheetPage: React.FC = () => {
  const { language, t } = useTranslation();
  const isBn = language === 'bn';

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
            <h1 className="headline-lg">{t.pages.cheatsheet.git.title}</h1>
            <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
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
          {CHEAT_SECTIONS.map((sec) => {
            const entries = sec.slugs
              .map((slug) => getCommandBySlug(GIT_COMMANDS, slug))
              .filter((c): c is (typeof GIT_COMMANDS)[number] => Boolean(c));
            if (entries.length === 0) return null;

            return (
              <Card key={sec.title} variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <h2 className="title-md" style={{ color: 'var(--md-sys-color-on-surface)', borderBottom: '1px solid var(--md-sys-color-outline-variant)', paddingBottom: 'var(--space-2)', margin: 0 }}>
                  {isBn ? sec.titleBn : sec.title}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {entries.map((cmd) => (
                    <div
                      key={cmd.id}
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
                        <code className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 700 }}>{cmd.syntax}</code>
                        <CopyButton text={cmd.syntax} variant="icon" size="sm" />
                      </div>
                      <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {isBn && cmd.whatItDoesBn ? cmd.whatItDoesBn : cmd.whatItDoes}
                      </p>
                      <Link
                        to={`/commands/git/${cmd.slug}`}
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
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};
