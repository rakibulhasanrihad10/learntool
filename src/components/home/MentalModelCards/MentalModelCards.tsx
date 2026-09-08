import React from 'react';
import { Database, Globe, Users, Sparkles } from 'lucide-react';
import { Card } from '@/components/common/Card/Card';
import { useTranslation } from '@/i18n/context';
import './MentalModelCards.css';

export const MentalModelCards: React.FC = () => {
  const { t } = useTranslation();
  const m = t.home.mentalModel;

  return (
    <section className="mental-model-section" aria-labelledby="mental-model-title">
      <div className="mental-model-section__header">
        <span className="label-sm mental-model-section__tagline">{m.tagline}</span>
        <h2 id="mental-model-title" className="title-lg mental-model-section__headline">
          {m.headline}
        </h2>
      </div>

      {/* 3 Core Distinction Cards */}
      <div className="mental-model-cards-grid">
        {/* Card 1: Git */}
        <Card variant="filled" padding="lg" className="mental-card mental-card--git">
          <div className="mental-card__icon-box mental-card__icon-box--git">
            <Database size={24} aria-hidden="true" />
          </div>
          <div className="mental-card__content">
            <div className="mental-card__header-row">
              <h3 className="title-md">{m.gitTitle}</h3>
              <span className="mental-card__motto font-mono">{m.gitMotto}</span>
            </div>
            <p className="body-md text-muted">{m.gitRole}</p>
          </div>
        </Card>

        {/* Card 2: GitHub */}
        <Card variant="filled" padding="lg" className="mental-card mental-card--github">
          <div className="mental-card__icon-box mental-card__icon-box--github">
            <Globe size={24} aria-hidden="true" />
          </div>
          <div className="mental-card__content">
            <div className="mental-card__header-row">
              <h3 className="title-md">{m.githubTitle}</h3>
              <span className="mental-card__motto font-mono">{m.githubMotto}</span>
            </div>
            <p className="body-md text-muted">{m.githubRole}</p>
          </div>
        </Card>

        {/* Card 3: Together */}
        <Card variant="filled" padding="lg" className="mental-card mental-card--together">
          <div className="mental-card__icon-box mental-card__icon-box--together">
            <Users size={24} aria-hidden="true" />
          </div>
          <div className="mental-card__content">
            <div className="mental-card__header-row">
              <h3 className="title-md">{m.togetherTitle}</h3>
              <span className="mental-card__motto font-mono">{m.togetherMotto}</span>
            </div>
            <p className="body-md text-muted">{m.togetherRole}</p>
          </div>
        </Card>
      </div>

      {/* Distinction Callout Banner */}
      <div className="mental-model-callout">
        <Sparkles size={18} className="text-primary flex-shrink-0" aria-hidden="true" />
        <p className="body-md font-medium text-on-surface">
          {m.distinctionCallout}
        </p>
      </div>
    </section>
  );
};
