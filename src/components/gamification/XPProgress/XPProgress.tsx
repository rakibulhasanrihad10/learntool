import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { LevelBadge } from '../LevelBadge/LevelBadge';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Sparkles } from 'lucide-react';
import { UserLevel } from '@/types/gamification';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './XPProgress.css';

export interface XPProgressProps {
  userLevel: UserLevel;
  totalXp: number;
  className?: string;
}

export const XPProgress: React.FC<XPProgressProps> = ({
  userLevel,
  totalXp,
  className,
}) => {
  const { language } = useTranslation();
  const title = language === 'bn' ? userLevel.titleBn : userLevel.title;

  return (
    <Card className={cn('m3-xp-progress', className)} padding="md" variant="filled">
      <div className="m3-xp-progress__header">
        <div className="m3-xp-progress__level-info">
          <LevelBadge level={userLevel.level} size="md" />
          <div>
            <div className="m3-xp-progress__level-title title-sm">{title}</div>
            <div className="m3-xp-progress__level-subtitle label-xs">
              Level {userLevel.level}
            </div>
          </div>
        </div>

        <div className="m3-xp-progress__total-xp">
          <Sparkles size={14} className="m3-xp-progress__sparkle" />
          <span className="label-sm font-mono">{totalXp} XP</span>
        </div>
      </div>

      <div className="m3-xp-progress__bar-section">
        <ProgressBar
          value={userLevel.currentLevelXp}
          max={userLevel.maxXp - userLevel.minXp}
          height={6}
          color="primary"
        />
        <div className="m3-xp-progress__meta body-xs">
          <span>{userLevel.currentLevelXp} / {userLevel.maxXp - userLevel.minXp} XP</span>
          <span>{userLevel.xpRequiredForNextLevel} XP to Level {userLevel.level + 1}</span>
        </div>
      </div>
    </Card>
  );
};
