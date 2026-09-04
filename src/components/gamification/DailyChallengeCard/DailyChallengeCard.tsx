import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Sparkles, CheckCircle2, HelpCircle, Check, Flame } from 'lucide-react';
import { DailyChallenge } from '@/types/gamification';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './DailyChallengeCard.css';

export interface DailyChallengeCardProps {
  challenge: DailyChallenge;
  onComplete: (challengeId: string) => void;
  className?: string;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  challenge,
  onComplete,
  className,
}) => {
  const { language } = useTranslation();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const title = language === 'bn' ? challenge.titleBn : challenge.title;
  const description = language === 'bn' ? challenge.descriptionBn : challenge.description;

  const handleOptionClick = (optionId: string) => {
    if (challenge.isCompleted) return;
    setSelectedOptionId(optionId);
    setFeedback(null);
  };

  const handleVerify = () => {
    if (!selectedOptionId) return;

    const chosenOption = challenge.options?.find((o) => o.id === selectedOptionId);
    if (chosenOption?.isCorrect) {
      onComplete(challenge.id);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <Card className={cn('m3-daily-challenge', className)} padding="lg" variant="elevated">
      <div className="m3-daily-challenge__header">
        <div className="m3-daily-challenge__badge-row">
          <Badge variant="warning" size="sm">
            <Flame size={12} />
            <span>{language === 'bn' ? 'আজকের চ্যালেঞ্জ' : 'Daily Challenge'}</span>
          </Badge>
          <Badge variant="outline" size="sm">
            {challenge.type.replace('_', ' ')}
          </Badge>
        </div>

        <div className="m3-daily-challenge__reward">
          <Sparkles size={14} className="m3-daily-challenge__sparkle" />
          <span className="label-sm font-mono">+{challenge.xpReward} XP</span>
        </div>
      </div>

      <div className="m3-daily-challenge__body">
        <h3 className="title-md m3-daily-challenge__title">{title}</h3>
        <p className="body-md m3-daily-challenge__desc">{description}</p>

        {challenge.options && (
          <div className="m3-daily-challenge__options">
            {challenge.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCompletedCorrect = challenge.isCompleted && option.isCorrect;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={cn(
                    'm3-daily-challenge__option-btn font-mono',
                    isSelected && 'm3-daily-challenge__option-btn--selected',
                    isCompletedCorrect && 'm3-daily-challenge__option-btn--correct'
                  )}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={challenge.isCompleted}
                >
                  <span className="m3-daily-challenge__option-bullet">
                    {isCompletedCorrect || (challenge.isCompleted && isSelected && option.isCorrect) ? (
                      <Check size={14} />
                    ) : (
                      <span />
                    )}
                  </span>
                  <span className="m3-daily-challenge__option-text">{option.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="m3-daily-challenge__hint body-xs">
            <HelpCircle size={14} />
            <span>
              {language === 'bn'
                ? challenge.hintBn || 'আবার চেষ্টা করুন! সঠিক ফ্ল্যাগটি খুঁজুন।'
                : challenge.hint || 'Try again! Look for the interactive patch flag.'}
            </span>
          </div>
        )}
      </div>

      <div className="m3-daily-challenge__footer">
        {challenge.isCompleted ? (
          <div className="m3-daily-challenge__completed-badge" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <CheckCircle2 size={18} color="var(--md-sys-color-success)" />
            <span className="label-sm">
              {language === 'bn' ? 'চ্যালেঞ্জ সম্পন্ন হয়েছে (+৬০ XP অর্জিত!)' : 'Challenge Completed (+60 XP earned!)'}
            </span>
            {challenge.practiceRef && (
              <Link
                to={`/practice/${challenge.practiceRef.split('.').pop()}`}
                style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
              >
                {language === 'bn' ? 'পূর্ণ অনুশীলন খুলুন →' : 'Open full exercise →'}
              </Link>
            )}
          </div>
        ) : (
          <Button
            variant="filled"
            size="md"
            disabled={!selectedOptionId}
            onClick={handleVerify}
          >
            {language === 'bn' ? 'উত্তর যাচাই করুন' : 'Submit & Verify Answer'}
          </Button>
        )}
      </div>
    </Card>
  );
};
