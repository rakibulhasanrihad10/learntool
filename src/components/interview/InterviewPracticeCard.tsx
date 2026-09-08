import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import { InterviewQuestion, SelfRating } from '@/types/interview';
import { QuestionAttempt } from '@/features/interview/progress';
import { scoreObjective } from '@/features/interview/scoring';
import { RepositoryState } from '@/components/simulation/RepositoryState/RepositoryState';
import { CommitGraph } from '@/components/simulation/CommitGraph/CommitGraph';
import { TROUBLESHOOTING_GUIDES } from '@/content/git';
import { GIT_MODULES } from '@/content/structure/gitModules';
import { GITHUB_MODULES } from '@/content/github';
import { PRACTICE_EXERCISES } from '@/content/practice';
import { CheckCircle, Eye, RotateCcw } from 'lucide-react';

export interface InterviewPracticeCardProps {
  question: InterviewQuestion;
  reviewed: boolean;
  onAttempt: (attempt: QuestionAttempt) => void;
}

function lessonPath(lessonId: string): string | undefined {
  for (const mod of [...GIT_MODULES, ...GITHUB_MODULES]) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return `/learn/${mod.subjectId}/${mod.slug}/${lesson.slug}`;
  }
  return undefined;
}

export const InterviewPracticeCard: React.FC<InterviewPracticeCardProps> = ({
  question,
  reviewed,
  onAttempt,
}) => {
  const { language } = useTranslation();
  const isBn = language === 'bn';
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState<SelfRating | null>(null);

  const q = isBn ? question.question.bn : question.question.en;
  const short = isBn ? question.shortAnswer.bn : question.shortAnswer.en;
  const expl = isBn ? question.explanation.bn : question.explanation.en;
  const tip = isBn ? question.interviewTip.bn : question.interviewTip.en;
  const mistake = isBn ? question.commonMistake.bn : question.commonMistake.en;
  const exampleNote = question.exampleNote
    ? isBn && question.exampleNote.bn
      ? question.exampleNote.bn
      : question.exampleNote.en
    : undefined;

  const hasOptions = Array.isArray(question.options) && question.options.length > 0;

  const handleCheck = () => {
    if (!selected) return;
    const correct = scoreObjective(question, selected);
    setChecked(correct);
    setRevealed(true);
    onAttempt({ questionId: question.id, correct });
  };

  const handleRate = (rating: SelfRating) => {
    setRated(rating);
    setRevealed(true);
    onAttempt({ questionId: question.id, selfRating: rating });
  };

  const handleReset = () => {
    setSelected(null);
    setChecked(null);
    setRevealed(false);
    setRated(null);
  };

  const troubleshootingLinks = question.relatedTroubleshooting
    .map((id) => {
      const g = TROUBLESHOOTING_GUIDES.find((t) => t.id === id);
      return g
        ? { id, label: isBn ? g.title.bn : g.title.en, path: `/troubleshooting/git/${g.slug}` }
        : undefined;
    })
    .filter((x): x is { id: string; label: string; path: string } => Boolean(x));
  const lessonLinks = [...question.relatedLessons, ...question.relatedInternals]
    .map((id) => {
      const path = lessonPath(id);
      return path ? { id, label: id, path } : undefined;
    })
    .filter((x): x is { id: string; label: string; path: string } => Boolean(x));
  const practiceLinks = question.relatedPractice
    .map((id) => {
      const e = PRACTICE_EXERCISES.find((p) => p.id === id);
      return e
        ? { id, label: isBn ? e.title.bn : e.title.en, path: `/practice/${e.id.split('.').pop()}` }
        : undefined;
    })
    .filter((x): x is { id: string; label: string; path: string } => Boolean(x));

  return (
    <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <DifficultyBadge difficulty={question.difficulty} size="sm" />
        <Badge variant="secondary" size="sm">{question.category}</Badge>
        <Badge variant="outline" size="sm">{question.type}</Badge>
        {reviewed && (
          <Badge variant="success" size="sm">
            <CheckCircle size={12} />
            <span>{isBn ? 'পর্যালোচিত' : 'Reviewed'}</span>
          </Badge>
        )}
      </div>

      <h3 className="title-md">{q}</h3>

      {question.stateSnapshot && (
        <div>
          {question.snapshotView === 'graph' ? (
            <CommitGraph state={question.stateSnapshot} />
          ) : (
            <RepositoryState state={question.stateSnapshot} />
          )}
        </div>
      )}

      {hasOptions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} role="radiogroup" aria-label={q}>
          {question.options!.map((opt) => (
            <label
              key={opt.id}
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                alignItems: 'flex-start',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--md-sys-color-surface-container)',
                cursor: 'pointer',
                border:
                  checked !== null && opt.correct
                    ? '2px solid var(--md-sys-color-primary)'
                    : '2px solid transparent',
              }}
            >
              <input
                type="radio"
                name={`interview-${question.id}`}
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => {
                  setSelected(opt.id);
                  setChecked(null);
                }}
                disabled={checked !== null}
              />
              <code>{opt.label}</code>
            </label>
          ))}
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="filled" size="sm" onClick={handleCheck} disabled={!selected || checked !== null}>
              {isBn ? 'যাচাই করুন' : 'Check answer'}
            </Button>
            {(checked !== null || revealed) && (
              <Button variant="text" size="sm" onClick={handleReset} iconRight={<RotateCcw size={14} />}>
                {isBn ? 'পুনরায় চেষ্টা' : 'Retry'}
              </Button>
            )}
          </div>
          {checked !== null && (
            <p className="body-sm" style={{ color: checked ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)' }}>
              {checked
                ? isBn
                  ? 'সঠিক — নিচে ব্যাখ্যা দেখুন।'
                  : 'Correct — see the explanation below.'
                : isBn
                  ? 'এখনো হয়নি — ব্যাখ্যা পড়ে আবার চেষ্টা করুন।'
                  : 'Not quite — read the explanation and retry.'}
            </p>
          )}
        </div>
      )}

      {!hasOptions && !revealed && (
        <div>
          <Button variant="tonal" size="sm" onClick={() => setRevealed(true)} iconRight={<Eye size={14} />}>
            {isBn ? 'উত্তর দেখুন' : 'Reveal answer'}
          </Button>
        </div>
      )}

      {revealed && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ backgroundColor: 'var(--md-sys-color-surface-container)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--md-sys-color-primary)', display: 'block', marginBottom: '2px' }}>
              {isBn ? 'সাক্ষাৎকার-প্রস্তুত উত্তর:' : 'Interview-ready answer:'}
            </strong>
            <p className="body-md">{short}</p>
            <p className="body-sm" style={{ marginTop: 'var(--space-2)', color: 'var(--md-sys-color-on-surface-variant)' }}>{expl}</p>
          </div>
          {question.exampleCommand && (
            <div>
              <code style={{ display: 'block', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--md-sys-color-surface-container-highest)', borderRadius: 'var(--radius-sm)' }}>
                {question.exampleCommand}
              </code>
              {exampleNote && <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{exampleNote}</p>}
            </div>
          )}
          <p className="body-sm">💡 <strong>{isBn ? 'টিপ:' : 'Tip:'}</strong> {tip}</p>
          <p className="body-sm">⚠️ <strong>{isBn ? 'ভুল:' : 'Mistake:'}</strong> {mistake}</p>

          {!hasOptions && !rated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span className="label-sm">{isBn ? 'সৎ স্ব-মূল্যায়ন (কোনো AI গ্রেডিং নয়):' : 'Honest self-rating (no AI grading):'}</span>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <Button variant="tonal" size="sm" onClick={() => handleRate('knew')}>
                  {isBn ? 'জানতাম' : 'I knew it'}
                </Button>
                <Button variant="tonal" size="sm" onClick={() => handleRate('partial')}>
                  {isBn ? 'আংশিক' : 'Partially'}
                </Button>
                <Button variant="outlined" size="sm" onClick={() => handleRate('review')}>
                  {isBn ? 'পর্যালোচনা দরকার' : 'Need review'}
                </Button>
              </div>
            </div>
          )}
          {!hasOptions && rated && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <Badge variant="success" size="sm">{rated}</Badge>
              <Button variant="text" size="sm" onClick={handleReset} iconRight={<RotateCcw size={14} />}>
                {isBn ? 'আবার রেট করুন' : 'Re-rate'}
              </Button>
            </div>
          )}
        </div>
      )}

      {(troubleshootingLinks.length > 0 || lessonLinks.length > 0 || practiceLinks.length > 0) && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }} className="body-sm">
          {troubleshootingLinks.map((l) => (
            <Link key={l.id} to={l.path} style={{ color: 'var(--md-sys-color-primary)' }}>{l.label}</Link>
          ))}
          {lessonLinks.map((l) => (
            <Link key={l.id} to={l.path} style={{ color: 'var(--md-sys-color-primary)' }}>{l.id}</Link>
          ))}
          {practiceLinks.map((l) => (
            <Link key={l.id} to={l.path} style={{ color: 'var(--md-sys-color-primary)' }}>{l.label}</Link>
          ))}
        </div>
      )}
    </Card>
  );
};
