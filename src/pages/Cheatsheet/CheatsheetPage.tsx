import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { CommandCard } from '@/components/data-display/CommandCard/CommandCard';
import { FileText, Printer, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/context';

export const CheatsheetPage: React.FC = () => {
  const { t } = useTranslation();

  const cheatSections = [
    {
      title: 'Config & Setup',
      commands: [
        { cmd: 'git config --global user.name "Your Name"', desc: 'Set global author username' },
        { cmd: 'git config --global user.email "you@example.com"', desc: 'Set global author email address' },
        { cmd: 'git config --global init.defaultBranch main', desc: 'Configure default branch to main' },
      ],
    },
    {
      title: 'Save & Inspect',
      commands: [
        { cmd: 'git status -s', desc: 'Display short-format status' },
        { cmd: 'git diff --staged', desc: 'Review changes currently staged for commit' },
        { cmd: 'git commit -m "feat: descriptive message"', desc: 'Commit staged changes with message' },
      ],
    },
    {
      title: 'Branch & Rebase',
      commands: [
        { cmd: 'git switch -c <branch>', desc: 'Create and jump to new branch' },
        { cmd: 'git branch -d <branch>', desc: 'Safely delete fully merged local branch' },
        { cmd: 'git rebase main', desc: 'Replay current commits on top of main' },
      ],
    },
  ];

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Badge variant="primary" size="md">
                <FileText size={14} />
                <span>{t.pages.cheatsheet.badge}</span>
              </Badge>
            </div>
            <h1 className="headline-lg">{t.pages.cheatsheet.title}</h1>
            <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t.pages.cheatsheet.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Link to="/cheatsheet/git" style={{ textDecoration: 'none' }}>
              <Button
                variant="primary"
                size="md"
                iconRight={<ArrowRight size={16} />}
              >
                {t.pages.cheatsheet.git?.title || 'Git Cheatsheet'}
              </Button>
            </Link>
            <Button
              variant="tonal"
              size="md"
              iconLeft={<Printer size={16} />}
              onClick={() => window.print()}
            >
              Print Cheatsheet
            </Button>
          </div>
        </div>

        {/* Cheat Sheet Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
          {cheatSections.map((sec, idx) => (
            <Card key={idx} variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <h2 className="title-md" style={{ color: 'var(--md-sys-color-on-surface)', borderBottom: '1px solid var(--md-sys-color-outline-variant)', paddingBottom: 'var(--space-2)' }}>
                {sec.title}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {sec.commands.map((c, cIdx) => (
                  <CommandCard
                    key={cIdx}
                    command={c.cmd}
                    explanation={c.desc}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
