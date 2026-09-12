import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { Button } from '@/components/common/Button/Button';
import { InterviewQuestion } from '@/types/content';
import { useTranslation } from '@/i18n/context';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './InterviewQuestionCard.css';

export interface InterviewQuestionCardProps {
  item: InterviewQuestion;
  className?: string;
  showBadges?: boolean;
}

export const InterviewQuestionCard: React.FC<InterviewQuestionCardProps> = ({
  item,
  className,
  showBadges = false,
}) => {
  const { language } = useTranslation();
  const [isRevealed, setIsRevealed] = useState(false);

  const question = (language === 'bn' && item.questionBn) ? item.questionBn : item.question;
  const answer = (language === 'bn' && item.answerBn) ? item.answerBn : item.answer;
  const keyPoints = (language === 'bn' && item.keyPointsBn) ? item.keyPointsBn : item.keyPoints;

  return (
    <Card className={cn('gv-interview-card', !showBadges && 'gv-interview-card--compact', className)} padding="md" variant="filled">
      {showBadges && (
        <div className="gv-interview-card__badges">
          <DifficultyBadge difficulty={item.difficulty} size="sm" />
          <Badge variant="secondary" size="sm">{item.category}</Badge>
        </div>
      )}

      <div className="gv-interview-card__main-row">
        <div className="gv-interview-card__question">
          <div className="gv-interview-card__icon" aria-hidden="true">
            <HelpCircle size={18} />
          </div>
          <h3 className="gv-interview-card__prompt title-md">{question}</h3>
        </div>

        <Button
          variant="tonal"
          size="sm"
          onClick={() => setIsRevealed((prev) => !prev)}
          iconRight={isRevealed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          aria-expanded={isRevealed}
          className="gv-interview-card__toggle-btn"
        >
          {isRevealed
            ? (language === 'bn' ? 'উত্তর লুকান' : 'Hide Answer')
            : (language === 'bn' ? 'উত্তর দেখুন' : 'Reveal Answer')}
        </Button>
      </div>

      {isRevealed && (
        <div className="gv-interview-card__answer animate-fade-in">
          <div className="gv-interview-card__answer-text body-md">
            <p>{answer}</p>
          </div>

          {keyPoints && keyPoints.length > 0 && (
            <div className="gv-interview-card__key-points">
              <div className="gv-interview-card__key-points-title label-sm">
                <Lightbulb size={14} aria-hidden="true" />
                <span>{language === 'bn' ? 'কী পয়েন্টসমূহ:' : 'Key Points to Mention:'}</span>
              </div>
              <ul className="gv-interview-card__points-list">
                {keyPoints.map((point, idx) => (
                  <li key={idx} className="body-sm">
                    <CheckCircle size={14} className="gv-interview-card__point-icon" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.followUpQuestions && item.followUpQuestions.length > 0 && (
            <div className="gv-interview-card__followups">
              <span className="label-sm gv-interview-card__followups-title">
                {language === 'bn' ? 'সম্ভাব্য ফলো-আপ প্রশ্ন:' : 'Potential Follow-up Questions:'}
              </span>
              <ul className="body-sm gv-interview-card__followup-list">
                {item.followUpQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
