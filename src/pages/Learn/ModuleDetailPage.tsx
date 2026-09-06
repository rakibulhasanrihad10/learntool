import React, { useEffect, useMemo, useState } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { QuizCard } from '@/components/evaluation/QuizCard/QuizCard';
import { getModuleBySlug, getLessonById, GITHUB_MODULES } from '@/content/github';
import { GIT_MODULES } from '@/content/structure/gitModules';
import { QuizQuestion, Lesson, LearningModule } from '@/types/content';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award,
  Trophy,
  XCircle,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

export const ModuleDetailPage: React.FC = () => {
  const { subjectId, moduleId } = useParams<{ subjectId: string; moduleId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useTranslation();
  const { isLessonCompleted, passQuiz, isQuizPassed } = useGamification();
  const navigate = useNavigate();

  const isBn = language === 'bn';
  const moduleData = getModuleBySlug(subjectId ?? 'git', moduleId ?? '');

  const isQuizQueryParam = searchParams.get('quiz') === 'true';
  const [quizStarted, setQuizStarted] = useState<boolean>(isQuizQueryParam);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { selectedOptionId: string; isCorrect: boolean }>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (isQuizQueryParam) {
      setQuizStarted(true);
    }
  }, [isQuizQueryParam]);

  const metaTitle = moduleData
    ? isBn
      ? moduleData.titleBn ?? moduleData.title
      : moduleData.title
    : t.pages.notFound.title;
  const metaDescription = moduleData
    ? isBn
      ? moduleData.descriptionBn ?? moduleData.description
      : moduleData.description
    : undefined;

  useEffect(() => {
    setPageMeta({ title: metaTitle, description: metaDescription });
  }, [metaTitle, metaDescription]);

  // Aggregate all quizzes from the module's lessons
  const moduleQuizzes = useMemo(() => {
    if (!moduleData) return [];
    return moduleData.lessons
      .map((lesson) => {
        const fullLesson = getLessonById(lesson.id);
        return fullLesson?.quiz
          ? {
              lesson,
              quiz: fullLesson.quiz,
            }
          : null;
      })
      .filter((item): item is { lesson: Lesson; quiz: QuizQuestion } => item !== null);
  }, [moduleData]);

  // Subject modules lookup (Git vs GitHub)
  const subjectModules: LearningModule[] = useMemo(() => {
    if (!moduleData) return [];
    return moduleData.subjectId === 'github' ? GITHUB_MODULES : GIT_MODULES;
  }, [moduleData]);

  // Previous and Next module lookup with seamless subject bridging
  const { prevModule, nextModule } = useMemo(() => {
    if (!moduleData || subjectModules.length === 0) return { prevModule: null, nextModule: null };
    const currentIndex = subjectModules.findIndex((m) => m.id === moduleData.id);
    const prev = currentIndex > 0 ? subjectModules[currentIndex - 1] : null;
    let next = currentIndex !== -1 && currentIndex < subjectModules.length - 1
      ? subjectModules[currentIndex + 1]
      : null;

    // If at the end of Git modules (Module 13), seamlessly bridge to GitHub Module 1
    if (!next && moduleData.subjectId === 'git' && GITHUB_MODULES.length > 0) {
      next = GITHUB_MODULES[0];
    }

    return { prevModule: prev, nextModule: next };
  }, [moduleData, subjectModules]);

  if (!moduleData) {
    return (
      <PageContainer maxWidth="sm" className="animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
        <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <h2 className="title-md">{isBn ? 'মডিউল পাওয়া যায়নি' : 'Module Not Found'}</h2>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {isBn
              ? 'অনুরোধকৃত মডিউলটি কারিকুলামে খুঁজে পাওয়া যায়নি।'
              : 'The requested module could not be located in the curriculum.'}
          </p>
          <Button variant="filled" size="md" onClick={() => navigate('/learn')}>
            {t.pages.notFound.exploreLearn}
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const title = isBn && moduleData.titleBn ? moduleData.titleBn : moduleData.title;
  const description = isBn && moduleData.descriptionBn ? moduleData.descriptionBn : moduleData.description;

  // Completion & Quiz stats
  const completedLessonsCount = moduleData.lessons.filter((l) => isLessonCompleted(l.id)).length;
  const lessonProgressPercent = Math.round((completedLessonsCount / moduleData.lessons.length) * 100);
  const passedQuizzesCount = moduleQuizzes.filter((item) => isQuizPassed(item.quiz.id)).length;

  const currentQuizItem = moduleQuizzes[currentQuizIndex];
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;

  const handleAnswerQuestion = (optId: string, isCorrect: boolean) => {
    if (!currentQuizItem) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuizItem.quiz.id]: { selectedOptionId: optId, isCorrect },
    }));
    if (isCorrect) {
      passQuiz(currentQuizItem.quiz.id);
    }
  };

  const handleStartQuiz = () => {
    setSearchParams({ quiz: 'true' });
    setQuizStarted(true);
    setIsFinished(false);
    setCurrentQuizIndex(0);
  };

  const handleExitQuiz = () => {
    setSearchParams({});
    setQuizStarted(false);
    setIsFinished(false);
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setCurrentQuizIndex(0);
    setIsFinished(false);
  };

  const breadcrumbItems = [
    { label: t.nav.learn, labelBn: 'লার্নিং ট্র্যাকস', path: '/learn' },
    { label: moduleData.subjectId === 'github' ? 'GitHub' : 'Git', labelBn: moduleData.subjectId === 'github' ? 'গিটহাব' : 'গিট', path: '/learn' },
    { label: title, labelBn: title, isCurrent: true },
  ];

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Module Header Card */}
        <Card
          variant="elevated"
          padding="lg"
          style={{
            background: 'linear-gradient(135deg, var(--md-sys-color-surface-container-low), var(--md-sys-color-surface-container))',
            border: '1px solid var(--md-sys-color-outline-variant)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Badge variant="primary" size="sm">
                  {isBn ? `মডিউল ${moduleData.order}` : `Module ${moduleData.order}`}
                </Badge>
                <Badge variant="outline" size="sm">{moduleData.difficulty}</Badge>
              </div>
              <h1 className="headline-md" style={{ color: 'var(--md-sys-color-on-surface)' }}>{title}</h1>
            </div>

            <Button
              variant="tonal"
              size="sm"
              iconLeft={<ArrowLeft size={14} />}
              onClick={() => navigate('/learn')}
            >
              {isBn ? 'সমস্ত ট্র্যাক' : 'All Tracks'}
            </Button>
          </div>

          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {description}
          </p>

          {/* Module Progress Bar */}
          <div style={{ maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              <span>
                {isBn
                  ? `অগ্রগতি: ${completedLessonsCount} / ${moduleData.lessons.length} সম্পন্ন`
                  : `Progress: ${completedLessonsCount} / ${moduleData.lessons.length} completed`}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>{lessonProgressPercent}%</span>
            </div>
            <ProgressBar value={lessonProgressPercent} height={7} color="primary" />
          </div>
        </Card>

        {/* ACTIVE QUIZ RUNNER VIEW */}
        {quizStarted && moduleQuizzes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Quiz Runner Header Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <Button
                variant="outlined"
                size="sm"
                iconLeft={<ArrowLeft size={14} />}
                onClick={handleExitQuiz}
              >
                {isBn ? 'মডিউল পাঠ্যতালিকায় ফিরে যান' : 'Back to Module Lessons'}
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {isBn
                    ? `সঠিক উত্তর: ${correctCount} / ${Object.keys(answers).length}`
                    : `Score: ${correctCount} / ${Object.keys(answers).length}`}
                </span>
                <Badge variant={correctCount === moduleQuizzes.length ? 'success' : 'primary'} size="sm">
                  {Math.round((correctCount / Math.max(1, moduleQuizzes.length)) * 100)}%
                </Badge>
              </div>
            </div>

            {/* If Quiz is NOT finished: Display Question Stepper & QuizCard */}
            {!isFinished ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Question Stepper Indicator */}
                <Card variant="filled" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Award size={18} color="#f59e0b" />
                      <span className="title-sm">
                        {isBn
                          ? `মডিউল নলেজ চেক — প্রশ্ন ${currentQuizIndex + 1} / ${moduleQuizzes.length}`
                          : `Module Knowledge Check — Question ${currentQuizIndex + 1} of ${moduleQuizzes.length}`}
                      </span>
                    </div>

                    {currentQuizItem && (
                      <Link
                        to={`/learn/${moduleData.subjectId}/${moduleData.slug}/${currentQuizItem.lesson.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--md-sys-color-primary)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <BookOpen size={13} />
                        {isBn ? 'সম্পর্কিত পাঠ দেখুন' : 'View Lesson'} ↗
                      </Link>
                    )}
                  </div>

                  {/* Step Buttons */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {moduleQuizzes.map((item, idx) => {
                      const isCurrent = idx === currentQuizIndex;
                      const answered = answers[item.quiz.id];
                      let bgColor = 'var(--md-sys-color-surface-container-high)';
                      let textColor = 'var(--md-sys-color-on-surface-variant)';
                      let borderStyle = '1px solid var(--md-sys-color-outline-variant)';

                      if (answered) {
                        if (answered.isCorrect) {
                          bgColor = 'var(--md-sys-color-success-container)';
                          textColor = 'var(--md-sys-color-on-success-container)';
                        } else {
                          bgColor = 'var(--md-sys-color-error-container)';
                          textColor = 'var(--md-sys-color-on-error-container)';
                        }
                      }
                      if (isCurrent) {
                        borderStyle = '2px solid var(--md-sys-color-primary)';
                      }

                      return (
                        <button
                          key={item.quiz.id}
                          type="button"
                          onClick={() => setCurrentQuizIndex(idx)}
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: 'var(--radius-sm)',
                            border: borderStyle,
                            background: bgColor,
                            color: textColor,
                            fontWeight: isCurrent ? 700 : 500,
                            cursor: 'pointer',
                            fontSize: '0.8125rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 150ms ease',
                          }}
                          aria-label={`Question ${idx + 1}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </Card>

                {/* The Current Quiz Card */}
                {currentQuizItem && (
                  <QuizCard
                    key={currentQuizItem.quiz.id}
                    question={currentQuizItem.quiz}
                    currentIndex={currentQuizIndex}
                    totalQuestions={moduleQuizzes.length}
                    onAnswer={handleAnswerQuestion}
                  />
                )}

                {/* Navigation Controls between questions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                  <Button
                    variant="outlined"
                    size="md"
                    disabled={currentQuizIndex === 0}
                    onClick={() => setCurrentQuizIndex((prev) => Math.max(0, prev - 1))}
                    iconLeft={<ArrowLeft size={16} />}
                  >
                    {isBn ? 'পূর্ববর্তী প্রশ্ন' : 'Previous Question'}
                  </Button>

                  {currentQuizIndex < moduleQuizzes.length - 1 ? (
                    <Button
                      variant="filled"
                      size="md"
                      onClick={() => setCurrentQuizIndex((prev) => prev + 1)}
                      iconRight={<ArrowRight size={16} />}
                    >
                      {isBn ? 'পরবর্তী প্রশ্ন' : 'Next Question'}
                    </Button>
                  ) : (
                    <Button
                      variant="filled"
                      size="md"
                      onClick={() => setIsFinished(true)}
                      iconRight={<Trophy size={16} />}
                    >
                      {isBn ? 'ফলাফল দেখুন' : 'Complete & View Results'}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              /* RESULTS & COMPLETION SCREEN */
              <Card
                variant="elevated"
                padding="lg"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-6)',
                  background: 'linear-gradient(135deg, var(--md-sys-color-surface-container), var(--md-sys-color-surface-container-high))',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                }}
              >
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trophy size={36} />
                  </div>

                  <h2 className="headline-sm" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                    {isBn ? 'মডিউল নলেজ চেক সমাপ্ত!' : 'Knowledge Check Completed!'}
                  </h2>

                  <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '500px' }}>
                    {correctCount === moduleQuizzes.length
                      ? (isBn
                          ? 'অসাধারণ! আপনি এই মডিউলের সমস্ত প্রশ্ন সঠিকভাবে সম্পন্ন করেছেন।'
                          : 'Outstanding! You answered every question correctly and mastered this module.')
                      : (isBn
                          ? `আপনি ${moduleQuizzes.length}টির মধ্যে ${correctCount}টি প্রশ্নের সঠিক উত্তর দিয়েছেন। প্রয়োজনে নিচের পাঠগুলো পুনরায় দেখে নিন!`
                          : `You scored ${correctCount} out of ${moduleQuizzes.length}. Review the topics below to solidify any tricky concepts!`)}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                    <div style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--md-sys-color-surface-container-highest)' }}>
                      <span className="title-md" style={{ color: 'var(--md-sys-color-primary)' }}>
                        {Math.round((correctCount / moduleQuizzes.length) * 100)}%
                      </span>
                      <div className="label-xs" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {isBn ? 'স্কোর' : 'Score'}
                      </div>
                    </div>

                    <div style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--md-sys-color-surface-container-highest)' }}>
                      <span className="title-md" style={{ color: correctCount === moduleQuizzes.length ? 'var(--md-sys-color-success)' : 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {correctCount}/{moduleQuizzes.length}
                      </span>
                      <div className="label-xs" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {isBn ? 'সঠিক উত্তর' : 'Correct Answers'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions Review Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <h3 className="title-sm" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                    {isBn ? 'প্রশ্নের পর্যালোচনা ও পাঠ লিঙ্ক' : 'Question Breakdown & Review'}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {moduleQuizzes.map((item, idx) => {
                      const ans = answers[item.quiz.id];
                      const isCorrect = ans?.isCorrect ?? false;
                      const localizedQ = isBn && item.quiz.questionBn ? item.quiz.questionBn : item.quiz.question;
                      const lessonTitle = isBn && item.lesson.titleBn ? item.lesson.titleBn : item.lesson.title;

                      return (
                        <div
                          key={item.quiz.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 'var(--space-3)',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                            border: '1px solid var(--md-sys-color-outline-variant)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: '240px' }}>
                            {isCorrect ? (
                              <CheckCircle2 size={20} color="var(--md-sys-color-success)" style={{ flexShrink: 0 }} />
                            ) : (
                              <XCircle size={20} color="var(--md-sys-color-error)" style={{ flexShrink: 0 }} />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span className="body-sm" style={{ fontWeight: 500, color: 'var(--md-sys-color-on-surface)' }}>
                                {idx + 1}. {localizedQ}
                              </span>
                              <span className="label-xs" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                {isBn ? `সম্পর্কিত পাঠ: ${lessonTitle}` : `From: ${lessonTitle}`}
                              </span>
                            </div>
                          </div>

                          <Link
                            to={`/learn/${moduleData.subjectId}/${moduleData.slug}/${item.lesson.slug}`}
                            style={{
                              textDecoration: 'none',
                              fontSize: '0.8125rem',
                              color: 'var(--md-sys-color-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 500,
                            }}
                          >
                            <BookOpen size={14} />
                            {isBn ? 'পাঠ দেখুন' : 'Review Lesson'} →
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Result Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: 'var(--space-4)' }}>
                  <Button
                    variant="outlined"
                    size="md"
                    iconLeft={<RotateCcw size={16} />}
                    onClick={handleRetakeQuiz}
                  >
                    {isBn ? 'পুনরায় কুইজ দিন' : 'Retake Knowledge Check'}
                  </Button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Button
                      variant="tonal"
                      size="md"
                      onClick={handleExitQuiz}
                    >
                      {isBn ? 'মডিউলে ফিরে যান' : 'Back to Module'}
                    </Button>

                    {nextModule && (
                      <Button
                        variant="filled"
                        size="md"
                        iconRight={<ArrowRight size={16} />}
                        onClick={() => navigate(`/learn/${nextModule.subjectId}/${nextModule.slug}`)}
                      >
                        {isBn ? `পরবর্তী মডিউল: ${nextModule.titleBn ?? nextModule.title}` : `Next Module: ${nextModule.title}`}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : (
          /* STANDARD MODULE OVERVIEW & LESSON LIST VIEW */
          <>
            {/* Lessons List Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className="title-lg">{t.pages.learn.moduleHeader}</h2>
                <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {moduleData.lessons.length} {t.pages.learn.lessonCount}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {moduleData.lessons.map((lesson, idx) => {
                  const isCompleted = isLessonCompleted(lesson.id);
                  const lessonTitle = isBn && lesson.titleBn ? lesson.titleBn : lesson.title;
                  const lessonSummary = isBn && lesson.summaryBn ? lesson.summaryBn : lesson.summary;

                  return (
                    <Card
                      key={lesson.id}
                      variant="filled"
                      padding="md"
                      interactive
                      onClick={() => navigate(`/learn/${moduleData.subjectId}/${moduleData.slug}/${lesson.slug}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-4)',
                        borderLeft: isCompleted
                          ? '4px solid var(--md-sys-color-success)'
                          : '4px solid var(--md-sys-color-outline-variant)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: isCompleted
                              ? 'var(--md-sys-color-success-container)'
                              : 'var(--md-sys-color-surface-container-high)',
                            color: isCompleted
                              ? 'var(--md-sys-color-on-success-container)'
                              : 'var(--md-sys-color-on-surface)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            flexShrink: 0,
                          }}
                        >
                          {isCompleted ? <CheckCircle2 size={20} /> : `${idx + 1}`}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <h3 className="title-sm" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                            {lessonTitle}
                          </h3>
                          {lessonSummary && (
                            <p className="body-xs" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                              {lessonSummary}
                            </p>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <Button variant="text" size="sm" iconRight={<ArrowRight size={14} />}>
                          {isCompleted ? (isBn ? 'রিভিউ' : 'Review') : (isBn ? 'শুরু করুন' : 'Start')}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Consolidated Module Knowledge Check Card */}
            {moduleQuizzes.length > 0 && (
              <Card
                variant="elevated"
                padding="lg"
                style={{
                  background: 'linear-gradient(135deg, var(--md-sys-color-surface-container), var(--md-sys-color-surface-container-high))',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(245, 158, 11, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f59e0b',
                        flexShrink: 0,
                      }}
                    >
                      <Award size={26} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <h3 className="title-md" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                          {isBn ? 'মডিউল নলেজ চেক' : 'Module Knowledge Check'}
                        </h3>
                        <Badge variant="primary" size="sm">
                          {moduleQuizzes.length} {isBn ? 'টি প্রশ্ন' : 'Questions'}
                        </Badge>
                      </div>

                      <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {isBn
                          ? 'এই মডিউলের সমস্ত মূল ধারণাগুলো একসাথে যাচাই করে আপনার প্রস্তুতি ও দক্ষতা নিশ্চিত করুন।'
                          : 'Consolidated checkpoint to test and validate your understanding across all lessons in this module.'}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    iconRight={<ArrowRight size={16} />}
                    onClick={handleStartQuiz}
                  >
                    {passedQuizzesCount === moduleQuizzes.length
                      ? (isBn ? 'আবার কুইজ দিন' : 'Retake Knowledge Check')
                      : (isBn ? 'নলেজ চেক শুরু করুন' : 'Start Knowledge Check')}
                  </Button>
                </div>

                {/* Progress indicators for quizzes */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    borderTop: '1px solid var(--md-sys-color-outline-variant)',
                    paddingTop: 'var(--space-3)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-2)',
                  }}
                >
                  <span>
                    {isBn
                      ? `অগ্রগতি: ${passedQuizzesCount} / ${moduleQuizzes.length} টি প্রশ্ন পাস হয়েছে`
                      : `Completion: ${passedQuizzesCount} of ${moduleQuizzes.length} questions passed`}
                  </span>

                  <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} />
                    {Math.round((passedQuizzesCount / Math.max(1, moduleQuizzes.length)) * 100)}% {isBn ? 'সম্পন্ন' : 'Mastered'}
                  </span>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Bottom Module-to-Module Navigation Bar */}
        {!quizStarted && (prevModule || nextModule) && (
          <nav
            aria-label="Module Navigation"
            style={{
              display: 'grid',
              gridTemplateColumns: prevModule && nextModule ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-4)',
            }}
          >
            {prevModule && (
              <Card
                variant="outlined"
                padding="md"
                interactive
                onClick={() => navigate(`/learn/${prevModule.subjectId}/${prevModule.slug}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <ArrowLeft size={20} color="var(--md-sys-color-primary)" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <span className="label-xs" style={{ color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {isBn ? '← পূর্ববর্তী মডিউল' : '← Previous Module'}
                  </span>
                  <span className="title-sm" style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {prevModule.order ? `Module ${prevModule.order}: ` : ''}{isBn ? (prevModule.titleBn ?? prevModule.title) : prevModule.title}
                  </span>
                </div>
              </Card>
            )}

            {nextModule && (
              <Card
                variant="filled"
                padding="md"
                interactive
                onClick={() => navigate(`/learn/${nextModule.subjectId}/${nextModule.slug}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                  border: '1px solid var(--md-sys-color-primary)',
                  background: 'linear-gradient(135deg, var(--md-sys-color-surface-container), var(--md-sys-color-surface-container-high))',
                  marginLeft: !prevModule ? 'auto' : undefined,
                  maxWidth: !prevModule ? '500px' : undefined,
                  width: !prevModule ? '100%' : undefined,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <span className="label-xs" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {isBn ? 'পরবর্তী মডিউল →' : 'Next Module →'}
                  </span>
                  <span className="title-sm" style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {nextModule.order ? `Module ${nextModule.order}: ` : ''}{isBn ? (nextModule.titleBn ?? nextModule.title) : nextModule.title}
                  </span>
                </div>
                <ArrowRight size={20} color="var(--md-sys-color-primary)" style={{ flexShrink: 0 }} />
              </Card>
            )}
          </nav>
        )}
      </div>
    </PageContainer>
  );
};
