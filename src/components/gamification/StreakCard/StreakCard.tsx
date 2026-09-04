import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Flame, Award } from 'lucide-react';
import { Streak } from '@/types/gamification';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './StreakCard.css';

export interface StreakCardProps {
  streak: Streak;
  className?: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streak, className }) => {
  const { language } = useTranslation();

  // Days of the week initials
  const dayNamesEn = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayNamesBn = ['সো', 'ম', 'বু', 'বৃ', 'শু', 'শ', 'র'];
  const dayNames = language === 'bn' ? dayNamesBn : dayNamesEn;

  return (
    <Card className={cn('m3-streak-card', className)} padding="md" variant="filled">
      <div className="m3-streak-card__header">
        <div className="m3-streak-card__main">
          <div className="m3-streak-card__icon-wrapper">
            <Flame size={24} className="m3-streak-card__flame" />
          </div>
          <div>
            <div className="m3-streak-card__count headline-sm">
              {streak.currentStreak} {language === 'bn' ? 'দিনের স্ট্রিক' : 'Day Streak'}
            </div>
            <div className="m3-streak-card__subtitle body-xs">
              {language === 'bn' ? 'নিয়মিত অনুশীলন জারি রাখুন!' : 'Keep learning every day!'}
            </div>
          </div>
        </div>

        <div className="m3-streak-card__longest body-xs">
          <Award size={14} />
          <span>Best: {streak.longestStreak} days</span>
        </div>
      </div>

      <div className="m3-streak-card__week-track">
        {dayNames.map((d, index) => {
          const isActive = index < Math.min(7, streak.currentStreak);
          return (
            <div key={index} className="m3-streak-card__day">
              <div
                className={cn(
                  'm3-streak-card__day-dot',
                  isActive && 'm3-streak-card__day-dot--active'
                )}
              >
                {isActive && <Flame size={12} />}
              </div>
              <span className="m3-streak-card__day-label">{d}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
