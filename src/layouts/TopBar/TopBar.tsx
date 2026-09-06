import React, { useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import { SearchButton } from '@/components/search/SearchButton/SearchButton';
import { Sun, Moon, Globe, Menu, GitBranch, BookOpen, Compass, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useGamification } from '@/features/gamification/useGamification';
import { Tooltip } from '@/components/common/Tooltip/Tooltip';
import { Badge } from '@/components/common/Badge/Badge';
import { Link } from 'react-router-dom';
import { ModeType } from '@/types/metadata';
import { ALL_MODULES } from '@/content/github';
import './TopBar.css';

export interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, onOpenSearch }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { progress } = useGamification();
  const [activeMode, setActiveMode] = useState<ModeType>('learning');

  const totalCurriculumLessons = ALL_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = progress.completedLessonIds.length;
  const overallPercent = totalCurriculumLessons > 0
    ? Math.min(100, Math.round((completedCount / totalCurriculumLessons) * 100))
    : 0;

  const toggleMode = () => {
    setActiveMode((prev) => (prev === 'learning' ? 'reference' : 'learning'));
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <Button
          variant="icon"
          size="md"
          className="topbar__menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </Button>

        <Link to="/" className="topbar__brand">
          <div className="topbar__brand-icon">
            <GitBranch size={20} />
          </div>
          <div className="topbar__brand-text">
            <div className="topbar__brand-row">
              <span className="title-md topbar__brand-title">GitVerse</span>
              <Badge variant="primary" size="sm" className="topbar__brand-version">v1.0</Badge>
            </div>
            <span className="label-sm topbar__brand-subtitle">
              {t.common.appTagline}
            </span>
          </div>
        </Link>
      </div>

      <div className="topbar__center">
        <SearchButton onClick={onOpenSearch} />
      </div>

      <div className="topbar__right">
        {/* Learning vs Reference Mode Indicator/Toggle */}
        <Tooltip
          content={
            activeMode === 'learning'
              ? `${t.common.mode.learning} — ${language === 'bn' ? 'কনসেপ্ট ও পাঠ্যক্রম' : 'Deep structured learning'}`
              : `${t.common.mode.reference} — ${language === 'bn' ? 'কমান্ড ও দ্রুত অনুসন্ধান' : 'Fast lookup & syntax'}`
          }
        >
          <button
            type="button"
            className="topbar__mode-btn"
            onClick={toggleMode}
            aria-label={t.common.mode.activeMode}
          >
            {activeMode === 'learning' ? (
              <>
                <BookOpen size={14} className="topbar__mode-icon" />
                <span className="label-xs">{t.common.mode.learning}</span>
              </>
            ) : (
              <>
                <Compass size={14} className="topbar__mode-icon" />
                <span className="label-xs">{t.common.mode.reference}</span>
              </>
            )}
          </button>
        </Tooltip>

        {/* Overall Curriculum Completion Percentage */}
        <Tooltip
          content={
            language === 'bn'
              ? `সামগ্রিক অগ্রগতি: ${completedCount}/${totalCurriculumLessons} পাঠ সম্পন্ন (${overallPercent}%)`
              : `Overall Progress: ${completedCount}/${totalCurriculumLessons} lessons completed (${overallPercent}%)`
          }
        >
          <Link to="/progress" className="topbar__progress-link" aria-label="Learning Progress">
            <CheckCircle2 size={14} color="var(--md-sys-color-primary)" />
            <span className="label-xs font-mono topbar__progress-percent">{overallPercent}%</span>
          </Link>
        </Tooltip>

        {/* Language Switcher */}
        <Tooltip content={t.common.language.toggle}>
          <Button
            variant="tonal"
            size="sm"
            onClick={toggleLanguage}
            className="topbar__action-btn topbar__lang-btn"
            aria-label={t.common.language.toggle}
            iconLeft={<Globe size={15} />}
          >
            <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
          </Button>
        </Tooltip>

        {/* Theme Switcher */}
        <Tooltip content={resolvedTheme === 'dark' ? t.common.theme.light : t.common.theme.dark}>
          <Button
            variant="icon"
            size="md"
            onClick={toggleTheme}
            className="topbar__action-btn"
            aria-label={t.common.theme.toggle}
          >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </Tooltip>
      </div>
    </header>
  );
};
