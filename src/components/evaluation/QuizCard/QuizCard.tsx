import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { CodeBlock } from '@/components/data-display/CodeBlock/CodeBlock';
import { QuizQuestion } from '@/types/content';
import { useTranslation } from '@/i18n/context';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './QuizCard.css';

export interface QuizCardProps {
  question: QuizQuestion;
  onAnswer?: (optionId: string, isCorrect: boolean) => void;
  currentIndex?: number;
  totalQuestions?: number;
  className?: string;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  onAnswer,
  currentIndex,
  totalQuestions,
  className,
}) => {
  const { language } = useTranslation();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const localizedQuestion = (language === 'bn' && question.questionBn) ? question.questionBn : question.question;
  const localizedExplanation = (language === 'bn' && question.explanationBn) ? question.explanationBn : question.explanation;

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;
    setIsSubmitted(true);
    const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
    if (selectedOption && onAnswer) {
      onAnswer(selectedOption.id, selectedOption.isCorrect);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
  const isSelectedCorrect = selectedOption?.isCorrect ?? false;

  return (
    <Card className={cn('gv-quiz-card', className)} padding="lg" variant="elevated">
      <header className="gv-quiz-card__header">
        <div className="gv-quiz-card__meta">
          <DifficultyBadge difficulty={question.difficulty} size="sm" />
          {currentIndex !== undefined && totalQuestions !== undefined && (
            <span className="gv-quiz-card__progress label-sm">
              {language === 'bn'
                ? `প্রশ্ন ${currentIndex + 1} / ${totalQuestions}`
                : `Question ${currentIndex + 1} of ${totalQuestions}`}
            </span>
          )}
        </div>
      </header>

      <div className="gv-quiz-card__question">
        <h3 className="gv-quiz-card__prompt title-md">{localizedQuestion}</h3>
        {question.codeSnippet && (
          <CodeBlock code={question.codeSnippet} language="bash" showLineNumbers={false} />
        )}
      </div>

      <div className="gv-quiz-card__options" role="radiogroup" aria-label="Quiz Answer Options">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const showAsCorrect = isSubmitted && option.isCorrect;
          const showAsIncorrect = isSubmitted && isSelected && !option.isCorrect;
          const optionText = (language === 'bn' && option.textBn) ? option.textBn : option.text;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isSubmitted}
              onClick={() => handleSelectOption(option.id)}
              className={cn(
                'gv-quiz-option',
                isSelected && 'gv-quiz-option--selected',
                showAsCorrect && 'gv-quiz-option--correct',
                showAsIncorrect && 'gv-quiz-option--incorrect'
              )}
            >
              <span className="gv-quiz-option__indicator" aria-hidden="true">
                {showAsCorrect ? (
                  <CheckCircle2 size={18} />
                ) : showAsIncorrect ? (
                  <XCircle size={18} />
                ) : (
                  <span className="gv-quiz-option__letter">{String.fromCharCode(65 + index)}</span>
                )}
              </span>
              <span className="gv-quiz-option__text body-md">{optionText}</span>
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div
          className={cn(
            'gv-quiz-card__feedback',
            isSelectedCorrect ? 'gv-quiz-card__feedback--correct' : 'gv-quiz-card__feedback--incorrect'
          )}
        >
          <div className="gv-quiz-card__feedback-header">
            {isSelectedCorrect ? (
              <>
                <CheckCircle2 size={18} />
                <span className="label-md">
                  {language === 'bn' ? 'সঠিক উত্তর!' : 'Correct! Great job!'}
                </span>
              </>
            ) : (
              <>
                <XCircle size={18} />
                <span className="label-md">
                  {language === 'bn' ? 'ভুল উত্তর, আবার চেষ্টা করুন!' : 'Incorrect. Review below:'}
                </span>
              </>
            )}
          </div>
          {localizedExplanation && (
            <p className="gv-quiz-card__explanation body-sm">{localizedExplanation}</p>
          )}
        </div>
      )}

      <footer className="gv-quiz-card__footer">
        {!isSubmitted ? (
          <Button
            variant="primary"
            disabled={!selectedOptionId}
            onClick={handleSubmit}
            iconRight={<ArrowRight size={16} />}
          >
            {language === 'bn' ? 'উত্তর যাচাই করুন' : 'Submit Answer'}
          </Button>
        ) : (
          <Button variant="outlined" onClick={handleReset}>
            {language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}
          </Button>
        )}
      </footer>
    </Card>
  );
};
