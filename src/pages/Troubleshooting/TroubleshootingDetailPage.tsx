import React, { useEffect } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Callout } from '@/components/feedback/Callout/Callout';
import { CodeBlock } from '@/components/data-display/CodeBlock/CodeBlock';
import { TerminalPreview } from '@/components/data-display/TerminalPreview/TerminalPreview';
import { SafetyBadge } from '@/components/troubleshooting/SafetyBadge/SafetyBadge';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Link2,
  ListChecks,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';
import {
  GIT_COMMANDS,
  TROUBLESHOOTING_CATEGORIES,
  TROUBLESHOOTING_GUIDES,
} from '@/content/git';
import { ALL_CURRICULUM_LESSONS, getLessonRoute } from '@/content/github';
import {
  classifyCommand,
  getAdjacentScenarios,
  getCommandsForScenario,
  getLessonsForScenario,
  getRelatedScenarios,
  getScenarioBySlug,
} from '@/utils/troubleshootingSearch';

const sectionTitleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  margin: 0,
};

export const TroubleshootingDetailPage: React.FC = () => {
  const { scenarioSlug } = useParams<{ scenarioSlug: string }>();
  const { language, t } = useTranslation();
  const navigate = useNavigate();
  const { completeLesson, isLessonCompleted } = useGamification();
  const isBn = language === 'bn';
  const ts = t.pages.troubleshooting;

  const guide = scenarioSlug ? getScenarioBySlug(TROUBLESHOOTING_GUIDES, scenarioSlug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [scenarioSlug]);

  const pageTitle = guide ? (isBn ? guide.title.bn : guide.title.en) : ts.notFound;
  const pageDescription = guide ? (isBn ? guide.shortDescription.bn : guide.shortDescription.en) : ts.notFoundHint;
  useEffect(() => {
    setPageMeta({ title: pageTitle, description: pageDescription });
  }, [pageTitle, pageDescription]);

  if (!guide) {
    return (
      <PageContainer maxWidth="sm" className="animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
        <h1 className="headline-md">{ts.notFound}</h1>
        <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--space-2)' }}>
          {ts.notFoundHint}
        </p>
        <Link to="/troubleshooting" style={{ display: 'inline-block', marginTop: 'var(--space-4)', color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
          ← {ts.backToAll}
        </Link>
      </PageContainer>
    );
  }

  const L = (text: { en: string; bn: string }) => (isBn ? text.bn : text.en);
  const category = TROUBLESHOOTING_CATEGORIES.find((c) => c.id === guide.category);
  const { prev, next } = getAdjacentScenarios(guide, TROUBLESHOOTING_GUIDES);
  const related = getRelatedScenarios(guide, TROUBLESHOOTING_GUIDES);
  const { found: relatedCommands, missing: plainCommands } = getCommandsForScenario(guide, GIT_COMMANDS);
  const lessonLinks = getLessonsForScenario(guide, ALL_CURRICULUM_LESSONS)
    .map((lesson) => ({ lesson, route: getLessonRoute(lesson.id) }))
    .filter((entry): entry is { lesson: (typeof ALL_CURRICULUM_LESSONS)[number]; route: NonNullable<ReturnType<typeof getLessonRoute>> } => entry.route !== null);
  const resolved = isLessonCompleted(guide.id);
  const severityVariant = guide.severity === 'low' ? 'secondary' as const : guide.severity === 'medium' ? 'warning' as const : 'error' as const;
  const severityLabel =
    guide.severity === 'low' ? ts.severityLow
    : guide.severity === 'medium' ? ts.severityMedium
    : guide.severity === 'high' ? ts.severityHigh : ts.severityCritical;

  return (
    <PageContainer maxWidth="md" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Breadcrumb
          items={[
            { label: ts.title, path: '/troubleshooting' },
            { label: L(guide.title), isCurrent: true },
          ]}
        />

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Badge variant={severityVariant} size="sm">{severityLabel}</Badge>
            <Badge variant="secondary" size="sm">
              {guide.difficulty === 'beginner' ? t.common.badges.beginner : guide.difficulty === 'intermediate' ? t.common.badges.intermediate : t.common.badges.advanced}
            </Badge>
            {category && <Badge variant="secondary" size="sm">{L(category.title)}</Badge>}
            {guide.safeForBeginners && (
              <Badge variant="primary" size="sm">
                <ShieldCheck size={12} />
                <span>{ts.safeBadge}</span>
              </Badge>
            )}
          </div>
          <h1 className="headline-lg" style={{ margin: 0 }}>{L(guide.title)}</h1>
          <p className="body-lg" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
            {L(guide.shortDescription)}
          </p>
          <div>
            <Button
              variant={resolved ? 'tonal' : 'filled'}
              size="sm"
              disabled={resolved}
              onClick={() => completeLesson(guide.id)}
              iconLeft={resolved ? <CheckCircle2 size={14} /> : undefined}
            >
              {resolved ? ts.resolvedLabel : ts.markResolved}
            </Button>
          </div>
        </div>

        {/* Problem */}
        <Card variant="filled" padding="lg">
          <h2 className="title-md" style={sectionTitleStyle}>
            <AlertTriangle size={18} color="var(--md-sys-color-warning)" />
            {ts.problem}
          </h2>
          <ul style={{ margin: 'var(--space-2) 0 0', paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {guide.symptoms.map((s, i) => (
              <li key={i} className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{L(s)}</li>
            ))}
          </ul>
        </Card>

        {/* What You Might See */}
        {guide.sightings.length > 0 && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-3)' }}>{ts.whatYouSee}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {guide.sightings.map((s, i) => (
                <TerminalPreview key={i} command={s.command} output={s.output} copyable={false} />
              ))}
            </div>
          </div>
        )}

        {/* What Happened */}
        <div>
          <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-2)' }}>{ts.whatHappened}</h2>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.7 }}>
            {L(guide.diagnosis)}
          </p>
          {guide.likelyCauses.length > 0 && (
            <ul style={{ margin: 'var(--space-2) 0 0', paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {guide.likelyCauses.map((c, i) => (
                <li key={i} className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{L(c)}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Before / After diagram */}
        {guide.diagram && (
          <Card variant="outlined" padding="lg">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
              <div>
                <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Before</span>
                <pre className="font-mono" style={{ margin: 'var(--space-1) 0 0', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--md-sys-color-surface-container-low)', fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>
                  {guide.diagram.before.join('\n')}
                </pre>
              </div>
              <div>
                <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>After</span>
                <pre className="font-mono" style={{ margin: 'var(--space-1) 0 0', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--md-sys-color-surface-container-low)', fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>
                  {guide.diagram.after.join('\n')}
                </pre>
              </div>
            </div>
            <p className="body-sm" style={{ margin: 'var(--space-2) 0 0', color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
              {L(guide.diagram.caption)}
            </p>
          </Card>
        )}

        {/* Diagnose */}
        <div>
          <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-3)' }}>
            <Stethoscope size={18} />
            {ts.diagnose}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {guide.checks.map((check, i) => (
              <Card key={i} variant="filled" padding="md">
                <p className="body-md" style={{ margin: '0 0 var(--space-2)', fontWeight: 600 }}>
                  <span className="font-mono" style={{ color: 'var(--md-sys-color-primary)', marginRight: 'var(--space-2)' }}>{i + 1}.</span>
                  {L(check.label)}
                </p>
                <CodeBlock code={`$ ${check.command}`} language="bash" />
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Fix */}
        <div>
          <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-2)' }}>
            <CheckCircle2 size={18} color="var(--md-sys-color-success)" />
            {ts.recommendedFix}: {L(guide.fix.title)}
          </h2>
          <ol style={{ margin: '0 0 var(--space-3)', paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {guide.fix.steps.map((step, i) => (
              <li key={i} className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.65 }}>{L(step)}</li>
            ))}
          </ol>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {guide.fix.commands.map((cmd, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <CodeBlock code={`$ ${cmd}`} language="bash" />
                <SafetyBadge level={classifyCommand(cmd).level} />
              </div>
            ))}
          </div>
        </div>

        {/* Alternatives */}
        {guide.alternatives.length > 0 && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-3)' }}>{ts.alternativeFixes}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {guide.alternatives.map((alt, i) => (
                <Card key={i} variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <h3 className="title-sm" style={{ margin: 0 }}>{L(alt.title)}</h3>
                  <p className="body-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.65 }}>{L(alt.detail)}</p>
                  {alt.commands.map((cmd, j) => (
                    <div key={j} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                      <CodeBlock code={`$ ${cmd}`} language="bash" />
                      <SafetyBadge level={classifyCommand(cmd).level} />
                    </div>
                  ))}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Be Careful */}
        {guide.warnings.length > 0 && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-3)' }}>
              <AlertTriangle size={18} color="var(--md-sys-color-error)" />
              {ts.beCareful}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {guide.warnings.map((w, i) => (
                <Callout
                  key={i}
                  type={w.level === 'danger' ? 'danger' : w.level === 'caution' ? 'warning' : 'note'}
                >
                  {L(w.text)}
                </Callout>
              ))}
            </div>
          </div>
        )}

        {/* Verify */}
        <Card variant="filled" padding="lg">
          <h2 className="title-md" style={sectionTitleStyle}>
            <ListChecks size={18} color="var(--md-sys-color-primary)" />
            {ts.verify}
          </h2>
          <ul style={{ margin: 'var(--space-2) 0 0', paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {guide.verify.map((v, i) => (
              <li key={i} className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{L(v)}</li>
            ))}
          </ul>
        </Card>

        {/* Related Commands */}
        {(relatedCommands.length > 0 || plainCommands.length > 0) && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-2)' }}>
              <Link2 size={18} />
              {ts.relatedCommands}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {relatedCommands.map((cmd) => (
                <Link
                  key={cmd.id}
                  to={`/commands/git/${cmd.slug}`}
                  className="code-inline font-mono"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {cmd.command}
                  <ChevronRight size={13} />
                </Link>
              ))}
              {plainCommands.map((cmd) => (
                <code key={cmd} className="code-inline font-mono">{cmd}</code>
              ))}
            </div>
          </div>
        )}

        {/* Learn the Concept */}
        {lessonLinks.length > 0 && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-2)' }}>
              <BookOpen size={18} />
              {ts.relatedLessons}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {lessonLinks.map(({ lesson, route }) => (
                <Link
                  key={lesson.id}
                  to={route.path}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--md-sys-color-outline-variant)',
                    textDecoration: 'none', color: 'var(--md-sys-color-on-surface)',
                  }}
                >
                  <span className="body-md" style={{ fontWeight: 600 }}>
                    {isBn && lesson.titleBn ? lesson.titleBn : lesson.title}
                  </span>
                  <span className="label-sm" style={{ color: 'var(--md-sys-color-primary)', whiteSpace: 'nowrap' }}>
                    {ts.learnConcept} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Try Interactively */}
        {guide.simulator && (
          <Card variant="outlined" padding="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', border: '1px solid var(--md-sys-color-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <FlaskConical size={24} color="var(--md-sys-color-primary)" style={{ flexShrink: 0 }} />
              <span className="title-sm" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                {ts.tryInteractively} →
              </span>
            </div>
            <Button
              variant="tonal"
              size="md"
              onClick={() => navigate(`/workflows/everyday-git?scenario=${guide.simulator!.scenario}`)}
            >
              {t.pages.simulator.tryItAction}
            </Button>
          </Card>
        )}

        {/* Related Scenarios */}
        {related.length > 0 && (
          <div>
            <h2 className="title-md" style={{ ...sectionTitleStyle, marginBottom: 'var(--space-2)' }}>
              <SearchCheck size={18} />
              {ts.relatedScenarios}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/troubleshooting/git/${r.slug}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--md-sys-color-outline-variant)',
                    textDecoration: 'none', color: 'var(--md-sys-color-on-surface)',
                  }}
                >
                  <span className="body-md" style={{ fontWeight: 600 }}>{isBn ? r.title.bn : r.title.en}</span>
                  <ChevronRight size={14} style={{ flexShrink: 0, color: 'var(--md-sys-color-on-surface-variant)' }} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          {prev ? (
            <button
              type="button"
              onClick={() => navigate(`/troubleshooting/git/${prev.slug}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--md-sys-color-outline-variant)', background: 'transparent', color: 'var(--md-sys-color-on-surface)', cursor: 'pointer', textAlign: 'left' }}
            >
              <ArrowLeft size={16} />
              <span>
                <span className="label-sm" style={{ display: 'block', color: 'var(--md-sys-color-on-surface-variant)' }}>{ts.prevScenario}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{isBn ? prev.title.bn : prev.title.en}</span>
              </span>
            </button>
          ) : <span />}
          {next ? (
            <button
              type="button"
              onClick={() => navigate(`/troubleshooting/git/${next.slug}`)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--md-sys-color-outline-variant)', background: 'transparent', color: 'var(--md-sys-color-on-surface)', cursor: 'pointer', textAlign: 'right' }}
            >
              <span>
                <span className="label-sm" style={{ display: 'block', color: 'var(--md-sys-color-on-surface-variant)' }}>{ts.nextScenario}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{isBn ? next.title.bn : next.title.en}</span>
              </span>
              <ArrowRight size={16} />
            </button>
          ) : <span />}
        </div>
      </div>
    </PageContainer>
  );
};
