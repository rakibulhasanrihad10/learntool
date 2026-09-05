import React, { useState, useEffect } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { CommandBlock } from '@/components/data-display/CommandBlock/CommandBlock';
import { GitPullRequest, ArrowRight, ArrowLeft, CheckCircle2, Lightbulb, Sparkles, FlaskConical } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { GIT_WORKFLOWS } from '@/content/git';

export const WorkflowsPage: React.FC = () => {
  const { language, t } = useTranslation();

  useEffect(() => {
    setPageMeta({ title: t.pages.workflows.title, description: t.pages.workflows.subtitle });
  }, [t.pages.workflows.title, t.pages.workflows.subtitle]);
  const navigate = useNavigate();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const isBn = language === 'bn';
  const featuredWorkflow = GIT_WORKFLOWS[0];

  const otherWorkflows = [
    {
      title: 'Feature Branch Workflow',
      titleBn: 'ফিচার ব্রাঞ্চ ওয়ার্কফ্লো',
      scenario: 'Standard industry process for creating isolated feature branches, creating Pull Requests, and merging with peer reviews.',
      scenarioBn: 'প্রধান কোডবেস নিরাপদ রেখে প্রতিটি ফিচারের জন্য আলাদা ব্রাঞ্চ তৈরি ও পিআর রিভিউয়ের মাধ্যমে মার্জ করা।',
      level: 'Essential',
      steps: ['Create branch from main', 'Commit isolated changes', 'Push to remote', 'Open PR & Pass CI'],
    },
    {
      title: 'Trunk-Based Development',
      titleBn: 'ট্রাঙ্ক-বেসড ডেভেলপমেন্ট',
      scenario: 'High-velocity workflow where developers merge short-lived branches into main multiple times a day behind feature flags.',
      scenarioBn: 'খুব দ্রুতগতিতে ছোট ছোট ব্রাঞ্চ তৈরি করে দিনে একাধিকবার টেস্ট পাস করিয়ে মেইন ব্রাঞ্চে মার্জ করার পদ্ধতি।',
      level: 'Modern Practice',
      steps: ['Short-lived branch (<24h)', 'Automated testing', 'Fast-forward merge', 'Zero stale branches'],
    },
    {
      title: 'Rebasing & History Squashing',
      titleBn: 'রিবেসিং ও হিস্ট্রি স্কোয়াশ',
      scenario: 'Keep a clean linear git history before merging into protected branches by squashing messy work-in-progress commits.',
      scenarioBn: 'অপ্রয়োজনীয় অগোছালো কমিটগুলো একত্র (Squash) করে একটি পরিচ্ছন্ন লিনিয়ার হিস্ট্রি বজায় রাখা।',
      level: 'Intermediate',
      steps: ['Fetch latest main', 'Interactive rebase (git rebase -i)', 'Fix conflicts cleanly', 'Push with lease'],
    },
  ];

  const currentStep = featuredWorkflow.steps[activeStepIndex];

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Badge variant="primary" size="md">
              <GitPullRequest size={14} />
              <span>{t.pages.workflows.badge}</span>
            </Badge>
            <Badge variant="outline" size="sm">
              <Sparkles size={12} />
              <span>{isBn ? 'ইন্টারেক্টিভ ওয়ার্কফ্লো' : 'Interactive Guide'}</span>
            </Badge>
          </div>
          <h1 className="headline-lg">{t.pages.workflows.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {t.pages.workflows.subtitle}
          </p>
        </div>

        {/* Interactive Simulator CTA */}
        <Card
          variant="filled"
          padding="lg"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            border: '1px solid var(--md-sys-color-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <FlaskConical size={28} color="var(--md-sys-color-primary)" style={{ flexShrink: 0 }} />
            <div>
              <div className="title-md" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                {t.pages.simulator.title}
              </div>
              <div className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {t.pages.simulator.subtitle}
              </div>
            </div>
          </div>
          <Button
            variant="filled"
            size="md"
            iconRight={<ArrowRight size={16} />}
            onClick={() => navigate('/workflows/everyday-git')}
          >
            {t.pages.simulator.tryItAction}
          </Button>
        </Card>

        {/* GitHub Collaboration CTA */}
        <Card
          variant="filled"
          padding="lg"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            border: '1px solid var(--md-sys-color-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <GitPullRequest size={28} color="var(--md-sys-color-primary)" style={{ flexShrink: 0 }} />
            <div>
              <div className="title-md" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                {t.pages.github.title}
              </div>
              <div className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {t.pages.github.subtitle}
              </div>
            </div>
          </div>
          <Button
            variant="filled"
            size="md"
            iconRight={<ArrowRight size={16} />}
            onClick={() => navigate('/workflows/github-pr')}
          >
            {t.pages.github.simulatorBadge}
          </Button>
        </Card>

        {/* Featured Interactive Workflow Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <span className="label-sm" style={{ color: 'var(--md-sys-color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Featured Production Blueprint
              </span>
              <h2 className="headline-sm" style={{ marginTop: 'var(--space-1)', color: 'var(--md-sys-color-on-surface)' }}>
                {isBn && featuredWorkflow.titleBn ? featuredWorkflow.titleBn : featuredWorkflow.title}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Badge variant="secondary" size="sm">
                Step {activeStepIndex + 1} of {featuredWorkflow.steps.length}
              </Badge>
              <Badge variant="outline" size="sm">{featuredWorkflow.difficulty}</Badge>
            </div>
          </div>

          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {isBn && featuredWorkflow.scenarioBn ? featuredWorkflow.scenarioBn : featuredWorkflow.scenario}
          </p>

          {/* Step Timeline Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            overflowX: 'auto',
            padding: 'var(--space-2) 0',
          }}>
            {featuredWorkflow.steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;
              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setActiveStepIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: isActive
                      ? '1px solid var(--md-sys-color-primary)'
                      : '1px solid var(--md-sys-color-outline-variant)',
                    backgroundColor: isActive
                      ? 'var(--md-sys-color-primary-container)'
                      : isPast
                      ? 'var(--md-sys-color-surface-container-high)'
                      : 'var(--md-sys-color-surface-container-low)',
                    color: isActive
                      ? 'var(--md-sys-color-on-primary-container)'
                      : 'var(--md-sys-color-on-surface-variant)',
                    fontSize: '0.8125rem',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 150ms ease',
                  }}
                >
                  {isPast ? (
                    <CheckCircle2 size={14} color="var(--md-sys-color-success)" />
                  ) : (
                    <span>{idx + 1}.</span>
                  )}
                  <span>{step.command ? (step.command.split(' ')[1] || step.command) : step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Details Card */}
          <Card
            variant="elevated"
            padding="lg"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              background: 'var(--md-sys-color-surface-container-low)',
              border: '1px solid var(--md-sys-color-outline-variant)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div>
                <span className="label-xs font-mono" style={{ color: 'var(--md-sys-color-primary)' }}>
                  STEP {currentStep.stepNumber} / {featuredWorkflow.steps.length}
                </span>
                <h3 className="title-lg" style={{ color: 'var(--md-sys-color-on-surface)', marginTop: '4px' }}>
                  {isBn && currentStep.titleBn ? currentStep.titleBn : currentStep.title}
                </h3>
              </div>
            </div>

            <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.7 }}>
              {isBn && currentStep.descriptionBn ? currentStep.descriptionBn : currentStep.description}
            </p>

            {/* Command Display */}
            {currentStep.command && (
              <div>
                <span className="label-xs font-mono" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '4px', display: 'block' }}>
                  TERMINAL COMMAND:
                </span>
                <CommandBlock command={currentStep.command} />
              </div>
            )}

            {/* Pro Tip Callout */}
            {currentStep.proTip && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--md-sys-color-surface-container)',
                borderLeft: '4px solid #f59e0b',
              }}>
                <Lightbulb size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.875rem' }}>
                  <strong style={{ color: 'var(--md-sys-color-on-surface)' }}>
                    {isBn ? 'প্রো টিপ: ' : 'Pro Tip: '}
                  </strong>
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {isBn && currentStep.proTipBn ? currentStep.proTipBn : currentStep.proTip}
                  </span>
                </div>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
              <Button
                variant="outlined"
                size="sm"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                iconLeft={<ArrowLeft size={14} />}
              >
                {isBn ? 'পূর্ববর্তী ধাপ' : 'Previous Step'}
              </Button>

              <Button
                variant="filled"
                size="sm"
                disabled={activeStepIndex === featuredWorkflow.steps.length - 1}
                onClick={() => setActiveStepIndex((prev) => Math.min(featuredWorkflow.steps.length - 1, prev + 1))}
                iconRight={<ArrowRight size={14} />}
              >
                {isBn ? 'পরবর্তী ধাপ' : 'Next Step'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Additional Team Workflows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 className="title-lg" style={{ color: 'var(--md-sys-color-on-surface)' }}>
            {isBn ? 'অন্যান্য টিম ওয়ার্কফ্লো ব্লুপ্রিন্ট' : 'More Team Workflow Blueprints'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
            {otherWorkflows.map((wf, idx) => (
              <Card
                key={idx}
                variant="filled"
                padding="lg"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 'var(--space-4)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Badge variant="secondary" size="sm">{wf.level}</Badge>
                  </div>
                  <h3 className="title-md" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                    {isBn ? wf.titleBn : wf.title}
                  </h3>
                  <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {isBn ? wf.scenarioBn : wf.scenario}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
                    {wf.steps.map((step, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface)' }}>
                        <CheckCircle2 size={14} color="var(--md-sys-color-primary)" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
