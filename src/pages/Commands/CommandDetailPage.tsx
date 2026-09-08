import React, { useEffect } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { CodeBlock } from '@/components/data-display/CodeBlock/CodeBlock';
import { Callout } from '@/components/feedback/Callout/Callout';
import {
  Terminal,
  Star,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  FlaskConical,
  HelpCircle,
  Wrench,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { GIT_COMMANDS, TROUBLESHOOTING_GUIDES } from '@/content/git';
import { resolveLessonLinks } from '@/content/github';
import { getCommandBySlug, getAdjacentCommands } from '@/utils/commandSearch';
import { getScenariosForCommand } from '@/utils/troubleshootingSearch';
import { demoForCommand } from '@/features/simulation/engine';

const sectionTitleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  margin: 0,
};

export const CommandDetailPage: React.FC = () => {
  const { commandSlug } = useParams<{ commandSlug: string }>();
  const { language, t } = useTranslation();
  const navigate = useNavigate();
  const isBn = language === 'bn';

  const command = commandSlug ? getCommandBySlug(GIT_COMMANDS, commandSlug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [commandSlug]);

  useEffect(() => {
    setPageMeta({
      title: command ? command.command : 'Command not found',
      description: command ? (isBn && command.whatItDoesBn ? command.whatItDoesBn : command.whatItDoes) : undefined,
    });
  }, [command, isBn]);

  if (!command) {
    return (
      <PageContainer maxWidth="sm" className="animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
        <h1 className="headline-md">{t.pages.commandDetail.notFound}</h1>
        <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--space-2)' }}>
          {t.pages.commandDetail.notFoundHint}
        </p>
        <Link to="/commands" style={{ display: 'inline-block', marginTop: 'var(--space-4)', color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
          ← {t.pages.commandDetail.backToCommands}
        </Link>
      </PageContainer>
    );
  }

  const { prev, next } = getAdjacentCommands(command, GIT_COMMANDS);
  const demo = demoForCommand(command.slug);
  const troubleshooting = getScenariosForCommand(command.slug, TROUBLESHOOTING_GUIDES).slice(0, 4);

  const localized = (en: string, bn?: string) => (isBn && bn ? bn : en);

  const lessonLinks = resolveLessonLinks(command.relatedLessons);

  const interviewAsProps = command.interviewInsight
    ? {
        question: localized(command.interviewInsight.question, command.interviewInsight.questionBn),
        answer: localized(command.interviewInsight.answer, command.interviewInsight.answerBn),
      }
    : null;

  return (
    <PageContainer maxWidth="md" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Breadcrumb
          items={[
            { label: isBn ? 'কমান্ড' : 'Commands', path: '/commands' },
            { label: command.command, isCurrent: true },
          ]}
        />

        {/* 1. Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Badge variant="secondary" size="sm">{command.category}</Badge>
            <DifficultyBadge difficulty={command.difficulty} size="sm" />
            {command.frequentlyUsed && (
              <Badge variant="primary" size="sm">
                <Star size={12} />
                <span>{t.pages.commandDetail.frequentlyUsed}</span>
              </Badge>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--md-sys-color-primary-container)',
              color: 'var(--md-sys-color-on-primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Terminal size={24} />
            </div>
            <div>
              <h1 className="headline-lg font-mono" style={{ margin: 0 }}>{command.command}</h1>
              <p className="title-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
                {localized(command.title, command.titleBn)}
              </p>
            </div>
          </div>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
            {localized(command.whatItDoes, command.whatItDoesBn)}
          </p>
          {demo && (
            <div>
              <Button
                variant="tonal"
                size="sm"
                iconLeft={<FlaskConical size={14} />}
                onClick={() => navigate(`/workflows/everyday-git?scenario=${demo.scenario}&step=${demo.step}`)}
              >
                {t.pages.commandDetail.openDemo}
              </Button>
            </div>
          )}
        </div>

        {/* 2. What it does */}
        <Card variant="filled" padding="lg">
          <h2 className="title-md" style={sectionTitleStyle}>{t.pages.commandDetail.whatItDoes}</h2>
          <p className="body-md" style={{ marginTop: 'var(--space-2)', marginBottom: 0 }}>
            {localized(command.whatItDoes, command.whatItDoesBn)}
          </p>
        </Card>

        {/* 3. When to use / When NOT to use */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          <Card variant="filled" padding="lg">
            <h2 className="title-md" style={sectionTitleStyle}>
              <CheckCircle2 size={18} color="var(--md-sys-color-primary)" />
              {t.pages.commandDetail.whenToUse}
            </h2>
            <p className="body-md" style={{ marginTop: 'var(--space-2)', marginBottom: 0 }}>
              {localized(command.whenToUse, command.whenToUseBn)}
            </p>
          </Card>
          {command.whenNotToUse && (
            <Card variant="outlined" padding="lg" style={{ borderColor: 'var(--md-sys-color-error)' }}>
              <h2 className="title-md" style={sectionTitleStyle}>
                <AlertTriangle size={18} color="var(--md-sys-color-error)" />
                {t.pages.commandDetail.whenNotToUse}
              </h2>
              <p className="body-md" style={{ marginTop: 'var(--space-2)', marginBottom: 0 }}>
                {localized(command.whenNotToUse, command.whenNotToUseBn)}
              </p>
            </Card>
          )}
        </div>

        {/* 4. Syntax */}
        <div>
          <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-2)' }}>
            {t.pages.commandDetail.syntax}
          </h2>
          <CodeBlock code={command.syntax} language="bash" />
        </div>

        {/* 5. Practical Examples */}
        {command.examples.length > 0 && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-3)' }}>
              {t.pages.commandDetail.examples}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {command.examples.map((ex, idx) => (
                <Card key={idx} variant="filled" padding="lg">
                  <p className="body-md" style={{ marginTop: 0, fontWeight: 600 }}>
                    {localized(ex.description, ex.descriptionBn)}
                  </p>
                  <CodeBlock code={ex.command} language="bash" />
                  {ex.output && (
                    <details style={{ marginTop: 'var(--space-2)' }}>
                      <summary className="label-sm" style={{ cursor: 'pointer', color: 'var(--md-sys-color-primary)' }}>
                        Output
                      </summary>
                      <pre
                        className="font-mono"
                        style={{
                          marginTop: 'var(--space-2)',
                          padding: 'var(--space-3)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--md-sys-color-surface-container-high)',
                          fontSize: '0.8125rem',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {ex.output}
                      </pre>
                    </details>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 6. Common Options */}
        {command.commonOptions.length > 0 && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-2)' }}>
              {t.pages.commandDetail.options}
            </h2>
            <Card variant="outlined" padding="md">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                      <th style={{ padding: 'var(--space-2)', whiteSpace: 'nowrap' }}>Flag</th>
                      <th style={{ padding: 'var(--space-2)' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {command.commonOptions.map((opt, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                        <td style={{ padding: 'var(--space-2)', whiteSpace: 'nowrap' }}>
                          <code className="code-inline font-mono">{opt.flag}</code>
                        </td>
                        <td style={{ padding: 'var(--space-2)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                          {localized(opt.description, opt.descriptionBn)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 7. Common Mistakes */}
        {command.commonMistakes && command.commonMistakes.length > 0 && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-3)' }}>
              <AlertTriangle size={18} />
              {t.pages.commandDetail.mistakes}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {command.commonMistakes.map((m, idx) => (
                <Callout key={idx} type="warning" title={localized(m.mistake, m.mistakeBn)}>
                  <strong>{t.pages.commandDetail.howToAvoid}: </strong>
                  {localized(m.howToAvoid, m.howToAvoidBn)}
                </Callout>
              ))}
            </div>
          </div>
        )}

        {/* 8. Internal Mechanics */}
        <details>
          <summary className="title-md" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Cpu size={18} />
            {t.pages.commandDetail.internals}
          </summary>
          <Card variant="filled" padding="lg" style={{ marginTop: 'var(--space-2)' }}>
            <p className="body-md" style={{ margin: 0 }}>
              {localized(command.whatHappensInternally, command.whatHappensInternallyBn)}
            </p>
          </Card>
        </details>

        {/* 9. Interview Insight */}
        {interviewAsProps && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-2)' }}>
              <HelpCircle size={18} />
              {t.pages.commandDetail.interview}
            </h2>
            <Card variant="filled" padding="lg">
              <p className="title-sm" style={{ marginTop: 0, fontWeight: 700 }}>{interviewAsProps.question}</p>
              <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{interviewAsProps.answer}</p>
            </Card>
          </div>
        )}

        {/* 10b. Related Troubleshooting */}
        {troubleshooting.length > 0 && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-2)' }}>
              <Wrench size={18} />
              {t.pages.commandDetail.relatedTroubleshooting}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {troubleshooting.map((g) => (
                <Link
                  key={g.id}
                  to={`/troubleshooting/git/${g.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    textDecoration: 'none',
                    color: 'var(--md-sys-color-on-surface)',
                  }}
                >
                  <span className="body-md" style={{ fontWeight: 600 }}>
                    {isBn ? g.title.bn : g.title.en}
                  </span>
                  <ChevronRight size={14} style={{ flexShrink: 0, color: 'var(--md-sys-color-on-surface-variant)' }} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 11. Related Lessons + 12. Learn More CTA */}
        {lessonLinks.length > 0 && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-2)' }}>
              <BookOpen size={18} />
              {t.pages.commandDetail.relatedLessons}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {lessonLinks.map(({ route, lesson }) => (
                <Link
                  key={lesson.id}
                  to={route.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    textDecoration: 'none',
                    color: 'var(--md-sys-color-on-surface)',
                  }}
                >
                  <span className="body-md" style={{ fontWeight: 600 }}>
                    {localized(lesson.title, lesson.titleBn)}
                  </span>
                  <span className="label-sm" style={{ color: 'var(--md-sys-color-primary)', whiteSpace: 'nowrap' }}>
                    {t.pages.commandDetail.learnMore} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 13. Previous / Next */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          {prev ? (
            <button
              type="button"
              onClick={() => navigate(`/commands/git/${prev.slug}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                background: 'transparent',
                color: 'var(--md-sys-color-on-surface)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <ArrowLeft size={16} />
              <span>
                <span className="label-sm" style={{ display: 'block', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {t.pages.commandDetail.prevCommand}
                </span>
                <code className="font-mono" style={{ fontSize: '0.875rem' }}>{prev.command}</code>
              </span>
            </button>
          ) : <span />}
          {next ? (
            <button
              type="button"
              onClick={() => navigate(`/commands/git/${next.slug}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                background: 'transparent',
                color: 'var(--md-sys-color-on-surface)',
                cursor: 'pointer',
                textAlign: 'right',
              }}
            >
              <span>
                <span className="label-sm" style={{ display: 'block', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {t.pages.commandDetail.nextCommand}
                </span>
                <code className="font-mono" style={{ fontSize: '0.875rem' }}>{next.command}</code>
              </span>
              <ArrowRight size={16} />
            </button>
          ) : <span />}
        </div>
      </div>
    </PageContainer>
  );
};
