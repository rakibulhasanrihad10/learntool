import React, { useEffect } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import {
  Terminal,
  ArrowRight,
  GitBranch,
  FolderGit2,
  RotateCcw,
  CloudUpload,
  History,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    setPageMeta({ title: 'GitVerse', description: t.dashboard.welcomeSubtitle });
  }, [t.dashboard.welcomeSubtitle]);
  const navigate = useNavigate();

  return (
    <PageContainer maxWidth="lg" className="home-page animate-fade-in">
      {/* 1. Hero / Welcome Banner */}
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-hero__content">
          <div className="home-hero__badge-row">
            <Badge variant="secondary" size="md">
              <Sparkles size={13} />
              <span>Interactive Learning Architecture</span>
            </Badge>
            <Badge variant="outline" size="md">Interactive Simulator & Labs</Badge>
          </div>

          <h1 id="hero-title" className="home-hero__title display-sm">
            {t.dashboard.welcomeTitle}
          </h1>

          <p className="home-hero__subtitle body-lg">
            {t.dashboard.welcomeSubtitle}
          </p>

          <div className="home-hero__actions">
            <Button
              variant="filled"
              size="lg"
              iconRight={<ArrowRight size={18} />}
              onClick={() => navigate('/learn/paths')}
            >
              {t.dashboard.heroCtaPrimary}
            </Button>
            <Button
              variant="outlined"
              size="lg"
              iconLeft={<Terminal size={18} />}
              onClick={() => navigate('/commands')}
            >
              {t.dashboard.heroCtaSecondary}
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Quick Access Hub */}
      <section className="home-section" aria-labelledby="quick-access-title">
        <div className="home-section__header">
          <div>
            <h2 id="quick-access-title" className="title-lg">{t.dashboard.quickAccess.title}</h2>
            <p className="body-sm home-section__subtitle">{t.dashboard.quickAccess.subtitle}</p>
          </div>
          <Button variant="text" size="sm" onClick={() => navigate('/commands')}>
            {t.common.actions.viewAll}
          </Button>
        </div>

        <div className="home-quick-grid">
          <Card
            variant="filled"
            padding="md"
            interactive
            className="home-quick-card"
            onClick={() => navigate('/commands')}
          >
            <div className="home-quick-card__icon home-quick-card__icon--primary">
              <FolderGit2 size={22} />
            </div>
            <div className="home-quick-card__content">
              <h3 className="title-sm">{t.dashboard.quickAccess.gitInitTitle}</h3>
              <p className="body-sm">{t.dashboard.quickAccess.gitInitDesc}</p>
            </div>
          </Card>

          <Card
            variant="filled"
            padding="md"
            interactive
            className="home-quick-card"
            onClick={() => navigate('/workflows')}
          >
            <div className="home-quick-card__icon home-quick-card__icon--secondary">
              <GitBranch size={22} />
            </div>
            <div className="home-quick-card__content">
              <h3 className="title-sm">{t.dashboard.quickAccess.branchingTitle}</h3>
              <p className="body-sm">{t.dashboard.quickAccess.branchingDesc}</p>
            </div>
          </Card>

          <Card
            variant="filled"
            padding="md"
            interactive
            className="home-quick-card"
            onClick={() => navigate('/troubleshooting')}
          >
            <div className="home-quick-card__icon home-quick-card__icon--tertiary">
              <RotateCcw size={22} />
            </div>
            <div className="home-quick-card__content">
              <h3 className="title-sm">{t.dashboard.quickAccess.undoMistakesTitle}</h3>
              <p className="body-sm">{t.dashboard.quickAccess.undoMistakesDesc}</p>
            </div>
          </Card>

          <Card
            variant="filled"
            padding="md"
            interactive
            className="home-quick-card"
            onClick={() => navigate('/workflows')}
          >
            <div className="home-quick-card__icon home-quick-card__icon--success">
              <CloudUpload size={22} />
            </div>
            <div className="home-quick-card__content">
              <h3 className="title-sm">{t.dashboard.quickAccess.remoteSyncTitle}</h3>
              <p className="body-sm">{t.dashboard.quickAccess.remoteSyncDesc}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Recently Explored / Activity Log */}
      <section className="home-section" aria-labelledby="recent-activity-title">
        <div className="home-section__header">
          <div>
            <h2 id="recent-activity-title" className="title-lg">{t.dashboard.recentItems.title}</h2>
            <p className="body-sm home-section__subtitle">{t.dashboard.recentItems.subtitle}</p>
          </div>
        </div>

        <EmptyState
          icon={<History size={26} />}
          title="History Ready"
          description={t.dashboard.recentItems.emptyState}
          action={
            <Button variant="outlined" size="sm" onClick={() => navigate('/commands')}>
              Browse Commands
            </Button>
          }
        />
      </section>
    </PageContainer>
  );
};
