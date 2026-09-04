import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { CommandBlock } from '@/components/data-display/CommandBlock/CommandBlock';
import { GitPullRequest, FlaskConical, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { GITHUB_WORKFLOWS } from '@/content/github';
import { GIT_COMMANDS, TROUBLESHOOTING_GUIDES } from '@/content/git';
import { getCommandById } from '@/utils/commandSearch';
import { getScenariosForCommand } from '@/utils/troubleshootingSearch';
import { getLessonMetaById, getLessonRoute } from '@/content/github';
import { PrSimulator } from '@/components/github/PrSimulator';
import { PrSandbox } from '@/components/github/PrSandbox';

/**
 * /workflows/github-pr — GitHub collaboration experience: guided PR simulator
 * (login feature, Draft → Merged), free-play sandbox, workflow guides, and
 * cross-links into Learning / Reference / Troubleshooting modes.
 */
export const GitHubPrPage: React.FC = () => {
  const { language, t } = useTranslation();
  const isBn = language === 'bn';
  const g = t.pages.github;
  const [openGuide, setOpenGuide] = useState<string | null>(GITHUB_WORKFLOWS[0]?.id ?? null);

  useEffect(() => {
    document.title = `${g.metaTitle} | GitVerse`;
  }, [g.metaTitle]);

  const lessonIds = [
    'github.pr.what-is-a-pull-request',
    'github.pr.reviewing-changes',
    'github.collaboration.contributing-open-source',
    'github.team.github-flow',
  ];
  const commandIds = ['git.clone', 'git.push', 'git.pull', 'git.fetch'];
  const troubleshooting = [
    ...getScenariosForCommand('push', TROUBLESHOOTING_GUIDES),
    ...getScenariosForCommand('merge', TROUBLESHOOTING_GUIDES),
  ]
    .filter((gd, i, arr) => arr.findIndex((x) => x.id === gd.id) === i)
    .slice(0, 4);

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Breadcrumb
          items={[
            { label: t.pages.workflows.title, path: '/workflows' },
            { label: isBn ? g.title : g.title, isCurrent: true },
          ]}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Badge variant="primary" size="md">
              <GitPullRequest size={14} />
              <span>{g.badge}</span>
            </Badge>
            <Badge variant="secondary" size="sm">
              <FlaskConical size={12} />
              <span>{g.simulatorBadge}</span>
            </Badge>
            <Badge variant="secondary" size="sm">
              <ShieldCheck size={12} />
              <span>{t.pages.simulator.simulatedNote}</span>
            </Badge>
          </div>
          <h1 className="headline-lg">{g.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {g.subtitle}
          </p>
        </div>

        {/* Guided simulator */}
        <section aria-label={g.guidedTitle} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <h2 className="title-lg" style={{ margin: '0 0 var(--space-1)' }}>{g.guidedTitle}</h2>
            <p className="body-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>{g.guidedSubtitle}</p>
          </div>
          <PrSimulator />
        </section>

        {/* Sandbox */}
        <section aria-label={g.sandboxTitle} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <h2 className="title-lg" style={{ margin: '0 0 var(--space-1)' }}>{g.sandboxTitle}</h2>
            <p className="body-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>{g.sandboxSubtitle}</p>
          </div>
          <PrSandbox />
        </section>

        {/* Workflow guides */}
        <section aria-label={g.guidesTitle} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div>
            <h2 className="title-lg" style={{ margin: '0 0 var(--space-1)' }}>{g.guidesTitle}</h2>
            <p className="body-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>{g.guidesSubtitle}</p>
          </div>
          {GITHUB_WORKFLOWS.map((wf) => {
            const open = openGuide === wf.id;
            return (
              <Card key={wf.id} variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <button
                  type="button"
                  onClick={() => setOpenGuide(open ? null : wf.id)}
                  aria-expanded={open}
                  style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}
                >
                  <span>
                    <span className="title-md" style={{ display: 'block', color: 'var(--md-sys-color-on-surface)' }}>
                      {isBn && wf.titleBn ? wf.titleBn : wf.title}
                    </span>
                    <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                      {isBn && wf.scenarioBn ? wf.scenarioBn : wf.scenario}
                    </span>
                  </span>
                  <Badge variant="secondary" size="sm">{wf.steps.length} {isBn ? 'ধাপ' : 'steps'}</Badge>
                </button>
                {open && (
                  <ol style={{ margin: 'var(--space-2) 0 0', paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {wf.steps.map((step) => (
                      <li key={step.stepNumber} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                        <span className="body-md" style={{ fontWeight: 600 }}>
                          {isBn && step.titleBn ? step.titleBn : step.title}
                        </span>
                        <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                          {isBn && step.descriptionBn ? step.descriptionBn : step.description}
                        </span>
                        {step.command && <CommandBlock command={step.command} />}
                      </li>
                    ))}
                  </ol>
                )}
              </Card>
            );
          })}
        </section>

        {/* Cross-links */}
        <section aria-label={g.linksTitle} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          <Card variant="filled" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <h3 className="title-md" style={{ margin: 0 }}>{g.linksLessons}</h3>
            {lessonIds.map((id) => {
              const route = getLessonRoute(id);
              const meta = getLessonMetaById(id);
              if (!route || !meta) return null;
              return (
                <Link key={id} to={route.path} style={{ color: 'var(--md-sys-color-primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                  → {isBn && meta.titleBn ? meta.titleBn : meta.title}
                </Link>
              );
            })}
          </Card>
          <Card variant="filled" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <h3 className="title-md" style={{ margin: 0 }}>{g.linksCommands}</h3>
            {commandIds.map((id) => {
              const cmd = getCommandById(GIT_COMMANDS, id);
              if (!cmd) return null;
              return (
                <Link key={id} to={`/commands/git/${cmd.slug}`} className="code-inline font-mono" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
                  {cmd.command}
                </Link>
              );
            })}
          </Card>
          <Card variant="filled" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <h3 className="title-md" style={{ margin: 0 }}>{g.linksTroubleshooting}</h3>
            {troubleshooting.map((gd) => (
              <Link key={gd.id} to={`/troubleshooting/git/${gd.slug}`} style={{ color: 'var(--md-sys-color-primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                → {isBn ? gd.title.bn : gd.title.en}
              </Link>
            ))}
          </Card>
        </section>
      </div>
    </PageContainer>
  );
};
