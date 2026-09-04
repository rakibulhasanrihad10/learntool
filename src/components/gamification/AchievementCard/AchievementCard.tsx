import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Achievement } from '@/types/gamification';
import { useTranslation } from '@/i18n/context';
import { Award, Lock, Sparkles, Check } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './AchievementCard.css';

export interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  className,
}) => {
  const { language } = useTranslation();
  const title = language === 'bn' ? achievement.titleBn : achievement.title;
  const description = language === 'bn' ? achievement.descriptionBn : achievement.description;

  return (
    <Card
      className={cn(
        'm3-achievement-card',
        achievement.isUnlocked && 'm3-achievement-card--unlocked',
        className
      )}
      padding="md"
      variant="filled"
    >
      <div className="m3-achievement-card__icon-wrapper">
        {achievement.isUnlocked ? (
          <div className="m3-achievement-card__icon m3-achievement-card__icon--unlocked">
            <Award size={22} />
          </div>
        ) : (
          <div className="m3-achievement-card__icon m3-achievement-card__icon--locked">
            <Lock size={18} />
          </div>
        )}
      </div>

      <div className="m3-achievement-card__content">
        <div className="m3-achievement-card__title-row">
          <h4 className="title-sm m3-achievement-card__title">{title}</h4>
          <div className="m3-achievement-card__reward">
            <Sparkles size={12} className="m3-achievement-card__sparkle" />
            <span className="label-xs font-mono">+{achievement.xpReward} XP</span>
          </div>
        </div>

        <p className="body-xs m3-achievement-card__desc">{description}</p>

        <div className="m3-achievement-card__footer">
          {achievement.isUnlocked ? (
            <Badge variant="success" size="sm">
              <Check size={12} />
              <span>Unlocked</span>
            </Badge>
          ) : (
            <Badge variant="neutral" size="sm">
              <Lock size={11} />
              <span>Locked</span>
            </Badge>
          )}
          <span className="label-xs m3-achievement-card__category">
            {achievement.category}
          </span>
        </div>
      </div>
    </Card>
  );
};
