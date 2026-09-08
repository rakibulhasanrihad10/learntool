import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { getLessonById, getModuleBySlug, GITHUB_MODULES } from '@/content/github';
import { GIT_MODULES } from '@/content/structure/gitModules';
import { CurriculumLesson, ContentBlock, LearningModule } from '@/types/content';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';

// UI & Learning Components
import { LessonHeader } from '@/components/learning/LessonHeader/LessonHeader';
import { KeyConcept } from '@/components/learning/KeyConcept/KeyConcept';
import { PreviousNextNavigation } from '@/components/learning/PreviousNextNavigation/PreviousNextNavigation';
import { GitStateVisualizer } from '@/components/learning/GitStateVisualizer/GitStateVisualizer';
import { InteractiveDiff } from '@/components/learning/InteractiveDiff/InteractiveDiff';
import { DiffSimulator } from '@/components/learning/DiffSimulator/DiffSimulator';
import { BranchSwitchSimulator } from '@/components/learning/BranchSwitchSimulator/BranchSwitchSimulator';
import { PointerResetSimulator } from '@/components/learning/PointerResetSimulator/PointerResetSimulator';
import { QuizCard } from '@/components/evaluation/QuizCard/QuizCard';
import { InterviewQuestionCard } from '@/components/evaluation/InterviewQuestionCard/InterviewQuestionCard';
import { CodeBlock } from '@/components/data-display/CodeBlock/CodeBlock';
import { CommandBlock } from '@/components/data-display/CommandBlock/CommandBlock';
import { Callout } from '@/components/feedback/Callout/Callout';

import {
  CheckCircle2,
  Check,
  Sparkles,
  ListOrdered,
  HelpCircle,
  Award,
  FlaskConical,
  ArrowRight,
} from 'lucide-react';
import { scenarioForLesson } from '@/features/simulation/scenarios';
import { setPageMeta } from '@/utils/pageMeta';

export const LessonViewPage: React.FC = () => {
  const { subjectId, moduleId, lessonId } = useParams<{ subjectId: string; moduleId: string; lessonId: string }>();
  const { language, t } = useTranslation();
  const { completeLesson, isLessonCompleted, passQuiz } = useGamification();
  const navigate = useNavigate();

  const currentModule = getModuleBySlug(subjectId ?? 'git', moduleId ?? '');

  const lessonIndex = currentModule
    ? currentModule.lessons.findIndex((l) => l.slug === lessonId || l.id === lessonId)
    : -1;

  const currentLessonMetadata = lessonIndex !== -1 && currentModule
    ? currentModule.lessons[lessonIndex]
    : null;

  // Search full curriculum lesson content across subjects (Git + GitHub)
  const curriculumLesson: CurriculumLesson | undefined = getLessonById(lessonId ?? '');


  const prevLesson = lessonIndex > 0 && currentModule
    ? currentModule.lessons[lessonIndex - 1]
    : null;

  const nextLesson = currentModule && lessonIndex < currentModule.lessons.length - 1
    ? currentModule.lessons[lessonIndex + 1]
    : null;

  // Next module lookup across the curriculum (when on the final lesson of a module)
  const nextModule = React.useMemo(() => {
    if (!currentModule) return null;
    const modules: LearningModule[] = currentModule.subjectId === 'github' ? GITHUB_MODULES : GIT_MODULES;
    const currentIndex = modules.findIndex((m) => m.id === currentModule.id);
    if (currentIndex !== -1 && currentIndex < modules.length - 1) {
      return modules[currentIndex + 1];
    }
    if (currentModule.subjectId === 'git' && GITHUB_MODULES.length > 0) {
      return GITHUB_MODULES[0];
    }
    return null;
  }, [currentModule]);

  const isBn = language === 'bn';

  // Dynamic document metadata from the lesson itself
  useEffect(() => {
    if (currentLessonMetadata) {
      const pageTitle = isBn && currentLessonMetadata.titleBn
        ? currentLessonMetadata.titleBn
        : currentLessonMetadata.title;
      const pageDescription = isBn && currentLessonMetadata.summaryBn
        ? currentLessonMetadata.summaryBn
        : currentLessonMetadata.summary;
      setPageMeta({ title: pageTitle, description: pageDescription });
    }
  }, [currentLessonMetadata, isBn]);

  if (!currentModule || !currentLessonMetadata) {
    return (
      <PageContainer maxWidth="sm" className="animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
        <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <h2 className="title-md">{isBn ? 'পাঠ খুঁজে পাওয়া যায়নি' : 'Lesson Not Found'}</h2>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {isBn
              ? 'অনুরোধকৃত পাঠটি এই মডিউলে বিদ্যমান নেই।'
              : 'The requested lesson could not be found in the current module.'}
          </p>
          <Button variant="filled" size="md" onClick={() => navigate('/learn')}>
            {t.pages.notFound.exploreLearn}
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const isCompleted = isLessonCompleted(currentLessonMetadata.id);
  const lessonTitle = isBn && currentLessonMetadata.titleBn ? currentLessonMetadata.titleBn : currentLessonMetadata.title;
  const lessonSummary = isBn && currentLessonMetadata.summaryBn ? currentLessonMetadata.summaryBn : currentLessonMetadata.summary;
  const moduleTitle = isBn && currentModule.titleBn ? currentModule.titleBn : currentModule.title;

  const lessonBasePath = `/learn/${currentModule.subjectId}/${currentModule.slug}`;
  const breadcrumbItems = [
    { label: t.nav.learn, labelBn: 'লার্নিং ট্র্যাকস', path: '/learn' },
    { label: moduleTitle, labelBn: moduleTitle, path: lessonBasePath },
    { label: lessonTitle, labelBn: lessonTitle, isCurrent: true },
  ];

  const handleToggleComplete = () => {
    if (!isCompleted) {
      completeLesson(currentLessonMetadata.id);
    }
  };

  const prevTitle = prevLesson
    ? (isBn && prevLesson.titleBn ? prevLesson.titleBn : prevLesson.title)
    : '';

  const nextTitle = nextLesson
    ? (isBn && nextLesson.titleBn ? nextLesson.titleBn : nextLesson.title)
    : '';

  const scenarioId = scenarioForLesson(currentLessonMetadata.id);

  // Render individual content block
  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'paragraph': {
        const text = isBn && block.textBn ? block.textBn : block.text;
        return (
          <p
            key={index}
            className="body-md"
            style={{
              lineHeight: 1.8,
              color: 'var(--md-sys-color-on-surface)',
              margin: '0 0 var(--space-3) 0',
            }}
          >
            {text}
          </p>
        );
      }

      case 'heading': {
        const text = isBn && block.textBn ? block.textBn : block.text;
        return (
          <h3
            key={index}
            className="title-md"
            style={{
              marginTop: 'var(--space-4)',
              marginBottom: 'var(--space-2)',
              color: 'var(--md-sys-color-on-surface)',
            }}
          >
            {text}
          </h3>
        );
      }

      case 'code':
        return (
          <div key={index} style={{ margin: 'var(--space-3) 0' }}>
            <CodeBlock
              code={block.code}
              language={block.language || 'bash'}
              filename={block.filename}
            />
          </div>
        );

      case 'command': {
        const description = isBn && block.descriptionBn ? block.descriptionBn : block.description;
        return (
          <div key={index} style={{ margin: 'var(--space-3) 0' }}>
            <CommandBlock
              command={block.command}
              description={description}
            />
          </div>
        );
      }

      case 'callout': {
        const title = isBn && block.titleBn ? block.titleBn : block.title;
        const text = isBn && block.textBn ? block.textBn : block.text;
        return (
          <div key={index} style={{ margin: 'var(--space-4) 0' }}>
            <Callout type={block.variant} title={title}>
              {text}
            </Callout>
          </div>
        );
      }

      case 'list': {
        const items = isBn && block.itemsBn ? block.itemsBn : block.items;
        return block.ordered ? (
          <ol
            key={index}
            style={{
              paddingLeft: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              margin: 'var(--space-2) 0 var(--space-4) 0',
              color: 'var(--md-sys-color-on-surface)',
            }}
          >
            {items.map((item, i) => (
              <li key={i} className="body-md">{item}</li>
            ))}
          </ol>
        ) : (
          <ul
            key={index}
            style={{
              paddingLeft: 'var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              margin: 'var(--space-2) 0 var(--space-4) 0',
              color: 'var(--md-sys-color-on-surface)',
            }}
          >
            {items.map((item, i) => (
              <li key={i} className="body-md">{item}</li>
            ))}
          </ul>
        );
      }

      case 'keyConcept': {
        const title = isBn && block.titleBn ? block.titleBn : block.title;
        const text = isBn && block.textBn ? block.textBn : block.text;
        return (
          <div key={index} style={{ margin: 'var(--space-4) 0' }}>
            <KeyConcept
              title={title}
              conceptKey={block.conceptKey}
              showBadge={block.showBadge}
            >
              <div style={{ whiteSpace: 'pre-line' }}>{text}</div>
              {block.commands && block.commands.length > 0 && (
                <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {block.commands.map((cmd, cIdx) => (
                    <CommandBlock
                      key={cIdx}
                      command={cmd.command}
                      description={isBn && cmd.descriptionBn ? cmd.descriptionBn : cmd.description}
                    />
                  ))}
                </div>
              )}
            </KeyConcept>
          </div>
        );
      }

      case 'visualizer':
        return (
          <div key={index} style={{ margin: 'var(--space-5) 0' }}>
            <GitStateVisualizer initialState={block.initialState} />
          </div>
        );

      case 'interactiveDiff':
        return (
          <div key={index} style={{ margin: 'var(--space-4) 0' }}>
            <InteractiveDiff
              filename={block.filename}
              lines={block.lines}
              summaryNote={block.summaryNote}
              summaryNoteBn={block.summaryNoteBn}
            />
          </div>
        );

      case 'diffSimulator':
        return (
          <div key={index} style={{ margin: 'var(--space-4) 0' }}>
            <DiffSimulator
              title={block.title}
              titleBn={block.titleBn}
            />
          </div>
        );

      case 'branchSwitchSimulator':
        return (
          <div key={index} style={{ margin: 'var(--space-4) 0' }}>
            <BranchSwitchSimulator
              title={block.title}
              titleBn={block.titleBn}
            />
          </div>
        );

      case 'pointerResetSimulator':
        return (
          <div key={index} style={{ margin: 'var(--space-4) 0' }}>
            <PointerResetSimulator
              title={block.title}
              titleBn={block.titleBn}
            />
          </div>
        );

      case 'interviewInsight': {
        const qText = isBn && block.questionBn ? block.questionBn : block.question;
        const aText = isBn && block.answerBn ? block.answerBn : block.answer;
        const pts: string[] = (isBn && block.keyPointsBn ? block.keyPointsBn : (block.keyPoints ?? []));
        return (
          <div key={index} style={{ margin: 'var(--space-4) 0' }}>
            <InterviewQuestionCard
              item={{
                id: `insight-${index}`,
                subjectId: currentModule.subjectId,
                question: qText,
                answer: aText,
                category: 'Architecture',
                difficulty: 'intermediate',
                keyPoints: pts,
              }}
            />
          </div>
        );
      }

      case 'quiz':
        return (
          <div key={index} style={{ margin: 'var(--space-5) 0' }}>
            <QuizCard
              question={block.quiz}
              onAnswer={(_optId, isCorrect) => {
                if (isCorrect) passQuiz(block.quiz.id);
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const moduleQuizzes = currentModule
    ? currentModule.lessons
        .map((l) => getLessonById(l.id)?.quiz)
        .filter((q): q is NonNullable<typeof q> => Boolean(q))
    : [];

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Structured Lesson Header */}
        <LessonHeader
          title={lessonTitle}
          moduleTitle={moduleTitle}
          difficulty={currentLessonMetadata.difficulty}
          summary={lessonSummary}
          isCompleted={isCompleted}
        />

        {/* Main Content Layout with Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 'var(--space-6)', alignItems: 'start' }}>
          {/* Main Column */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Curriculum Sections & Blocks */}
            {curriculumLesson && curriculumLesson.sections && curriculumLesson.sections.length > 0 ? (
              curriculumLesson.sections.map((section) => {
                const sectionTitle = isBn && section.titleBn ? section.titleBn : section.title;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-3)',
                      paddingBottom: 'var(--space-4)',
                      borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                    }}
                  >
                    {sectionTitle && (
                      <h2 className="title-lg" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                        {sectionTitle}
                      </h2>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {section.blocks.map((block, bIdx) => renderBlock(block, bIdx))}
                    </div>
                  </section>
                );
              })
            ) : (
              // Fallback for lessons not yet fully expanded with sections
              <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <h2 className="title-md">{isBn ? 'পাঠের বিবরণ' : 'Lesson Overview'}</h2>
                <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {lessonSummary}
                </p>
              </Card>
            )}

            {/* Interview Insight Section (if present) */}
            {curriculumLesson?.interviewQuestion && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <HelpCircle size={18} color="var(--md-sys-color-primary)" />
                  <h3 className="title-md" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                    {isBn ? 'ইন্টারভিউ ইনসাইট' : 'Interview Insight'}
                  </h3>
                </div>
                <InterviewQuestionCard item={curriculumLesson.interviewQuestion} />
              </div>
            )}

            {/* Try it interactively → simulator deep-link (only if lesson has a practical simulation) */}
            {scenarioId && (
              <Card
                variant="outlined"
                padding="md"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 'var(--space-3)',
                  border: '1px solid var(--md-sys-color-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <FlaskConical size={24} color="var(--md-sys-color-primary)" style={{ flexShrink: 0 }} />
                  <div>
                    <div className="title-sm" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                      {t.pages.simulator.tryItTitle} →
                    </div>
                    <div className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                      {t.pages.simulator.tryItSubtitle}
                    </div>
                  </div>
                </div>
                <Button
                  variant="tonal"
                  size="md"
                  onClick={() => {
                    const stepParam = currentLessonMetadata?.id?.includes('diff-inspection')
                      ? '&step=3'
                      : currentLessonMetadata?.id?.includes('history-log')
                        ? '&step=6'
                        : '';
                    navigate(`/workflows/everyday-git?scenario=${scenarioId}${stepParam}`);
                  }}
                >
                  {t.pages.simulator.tryItAction}
                </Button>
              </Card>
            )}

            {/* Lesson Completion & Gamification Trigger */}
            <Card
              variant="filled"
              padding="md"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
                background: isCompleted
                  ? 'var(--md-sys-color-surface-container)'
                  : 'linear-gradient(135deg, var(--md-sys-color-surface-container), var(--md-sys-color-surface-container-high))',
                border: isCompleted
                  ? '1px solid var(--md-sys-color-outline-variant)'
                  : '1px solid var(--md-sys-color-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                {isCompleted ? (
                  <CheckCircle2 size={28} color="var(--md-sys-color-success)" />
                ) : (
                  <Sparkles size={28} color="#f59e0b" />
                )}
                <div>
                  <div className="title-sm">
                    {isCompleted
                      ? (isBn ? 'পাঠ সম্পন্ন হয়েছে!' : 'Lesson Completed!')
                      : (isBn ? 'পাঠ সমাপ্তি নিশ্চিত করুন' : 'Finish this lesson')}
                  </div>
                  <div className="body-xs" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {isCompleted
                      ? (isBn ? 'পাঠটি সফলভাবে সম্পন্ন হয়েছে ও সংরক্ষিত হয়েছে' : 'Lesson completed and saved to your progress')
                      : (isBn ? 'আপনার অগ্রগতি সংরক্ষণ করতে সমাপ্ত চিহ্নিত করুন' : 'Mark as complete to record your learning progress')}
                  </div>
                </div>
              </div>

              <Button
                variant={isCompleted ? 'tonal' : 'filled'}
                size="md"
                onClick={handleToggleComplete}
                disabled={isCompleted}
                iconLeft={isCompleted ? <Check size={16} /> : <CheckCircle2 size={16} />}
              >
                {isCompleted ? t.common.actions.completed : t.common.actions.markComplete}
              </Button>
            </Card>

            {/* Previous & Next Lesson Navigation */}
            <PreviousNextNavigation
              prev={prevLesson ? {
                title: prevTitle,
                url: `${lessonBasePath}/${prevLesson.slug}`,
              } : undefined}
              next={
                nextLesson
                  ? {
                      title: nextTitle,
                      url: `${lessonBasePath}/${nextLesson.slug}`,
                    }
                  : moduleQuizzes.length > 0
                  ? {
                      title: isBn
                        ? `মডিউল নলেজ চেক (${moduleQuizzes.length}টি প্রশ্ন)`
                        : `Module Knowledge Check (${moduleQuizzes.length} Questions)`,
                      sublabel: isBn ? 'পরবর্তী ধাপ' : 'Next Step',
                      url: `${lessonBasePath}?quiz=true`,
                    }
                  : nextModule
                  ? {
                      title: nextModule.order ? `Module ${nextModule.order}: ` + (isBn ? (nextModule.titleBn ?? nextModule.title) : nextModule.title) : (isBn ? (nextModule.titleBn ?? nextModule.title) : nextModule.title),
                      sublabel: isBn ? 'পরবর্তী মডিউল' : 'Next Module',
                      url: `/learn/${nextModule.subjectId}/${nextModule.slug}`,
                    }
                  : undefined
              }
            />

            {/* Advance to Next Module Bridge when on the final lesson of a module */}
            {!nextLesson && nextModule && (
              <Card
                variant="filled"
                padding="md"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 'var(--space-3)',
                  background: 'linear-gradient(135deg, var(--md-sys-color-surface-container), var(--md-sys-color-surface-container-high))',
                  border: '1px solid var(--md-sys-color-primary)',
                  marginTop: 'var(--space-4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--md-sys-color-primary-container)',
                      color: 'var(--md-sys-color-on-primary-container)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ArrowRight size={20} />
                  </div>
                  <div>
                    <div className="title-sm" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                      {isBn
                        ? `পরবর্তী মডিউল: ${nextModule.order ? `Module ${nextModule.order} — ` : ''}${nextModule.titleBn ?? nextModule.title}`
                        : `Next Module: ${nextModule.order ? `Module ${nextModule.order} — ` : ''}${nextModule.title}`}
                    </div>
                    <div className="body-xs" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                      {isBn
                        ? `মডিউল ${nextModule.order} এর ${nextModule.lessons.length}টি পাঠে সরাসরি এগিয়ে যান`
                        : `Skip ahead directly to ${nextModule.lessons.length} lessons in Module ${nextModule.order}`}
                    </div>
                  </div>
                </div>

                <Button
                  variant="filled"
                  size="md"
                  iconRight={<ArrowRight size={16} />}
                  onClick={() => navigate(`/learn/${nextModule.subjectId}/${nextModule.slug}`)}
                >
                  {isBn ? 'পরবর্তী মডিউলে যান' : 'Advance to Next Module'}
                </Button>
              </Card>
            )}
          </article>

          {/* Module Lessons Table of Contents Sidebar */}
          <aside>
            <Card
              variant="filled"
              padding="md"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                position: 'sticky',
                top: 'calc(var(--topbar-height) + 16px)',
                maxHeight: 'calc(100vh - var(--topbar-height) - 32px)',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', borderBottom: '1px solid var(--md-sys-color-outline-variant)', paddingBottom: 'var(--space-2)' }}>
                <ListOrdered size={16} color="var(--md-sys-color-primary)" />
                <span className="title-sm">{isBn ? 'মডিউলের পাঠসমূহ' : 'Module Lessons'}</span>
                <span className="label-xs font-mono" style={{ marginLeft: 'auto', opacity: 0.7 }}>
                  {currentModule.lessons.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {currentModule.lessons.map((lesson, idx) => {
                  const isCurrent = lesson.id === currentLessonMetadata.id;
                  const isItemCompleted = isLessonCompleted(lesson.id);
                  const titleText = isBn && lesson.titleBn ? lesson.titleBn : lesson.title;

                  return (
                    <Link
                      key={lesson.id}
                      to={`${lessonBasePath}/${lesson.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                        textDecoration: 'none',
                        color: isCurrent
                          ? 'var(--md-sys-color-primary)'
                          : 'var(--md-sys-color-on-surface-variant)',
                        backgroundColor: isCurrent
                          ? 'var(--md-sys-color-primary-container)'
                          : 'transparent',
                        fontWeight: isCurrent ? 600 : 400,
                        transition: 'background-color 150ms ease',
                      }}
                    >
                      {isItemCompleted ? (
                        <CheckCircle2 size={14} color="var(--md-sys-color-success)" style={{ flexShrink: 0 }} />
                      ) : (
                        <span style={{ fontSize: '0.6875rem', opacity: 0.6, width: '14px', flexShrink: 0, textAlign: 'center' }}>
                          {idx + 1}
                        </span>
                      )}
                      <span style={{
                        flex: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {titleText}
                      </span>
                    </Link>
                  );
                })}

                {moduleQuizzes.length > 0 && (
                  <Link
                    to={`${lessonBasePath}?quiz=true`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: '8px 10px',
                      marginTop: 'var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8125rem',
                      textDecoration: 'none',
                      color: 'var(--md-sys-color-primary)',
                      borderTop: '1px dashed var(--md-sys-color-outline-variant)',
                      fontWeight: 600,
                      transition: 'background-color 150ms ease',
                    }}
                  >
                    <Award size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isBn ? `নলেজ চেক (${moduleQuizzes.length})` : `Knowledge Check (${moduleQuizzes.length})`}
                    </span>
                  </Link>
                )}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
};
