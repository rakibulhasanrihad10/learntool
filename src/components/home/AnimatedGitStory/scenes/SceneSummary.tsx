import React from 'react';
import { ArrowRight, Code2, Database, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';

export const SceneSummary: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const s = t.home.story.scene5;

  return (
    <div className="scene-container scene-summary animate-fade-in" role="region" aria-label={s.title}>
      {/* 3-Step Formula Flow */}
      <div className="scene-summary__flow">
        {/* Code */}
        <div className="scene-summary__flow-item">
          <div className="scene-summary__icon-box scene-summary__icon-box--code">
            <Code2 size={24} aria-hidden="true" />
          </div>
          <span className="title-sm">{s.formulaCode}</span>
        </div>

        <span className="scene-summary__arrow" aria-hidden="true">→</span>

        {/* Git */}
        <div className="scene-summary__flow-item">
          <div className="scene-summary__icon-box scene-summary__icon-box--git">
            <Database size={24} aria-hidden="true" />
          </div>
          <span className="title-sm">{s.formulaGit}</span>
        </div>

        <span className="scene-summary__arrow" aria-hidden="true">→</span>

        {/* GitHub */}
        <div className="scene-summary__flow-item">
          <div className="scene-summary__icon-box scene-summary__icon-box--github">
            <Globe size={24} aria-hidden="true" />
          </div>
          <span className="title-sm">{s.formulaGitHub}</span>
        </div>
      </div>

      {/* Final Punchline */}
      <div className="scene-summary__conclusion">
        <h4 className="title-md scene-summary__punchline">
          {s.punchline}
        </h4>

        {/* Primary CTA */}
        <Button
          variant="filled"
          size="lg"
          className="scene-summary__cta animate-bounce-subtle"
          iconRight={<ArrowRight size={18} />}
          onClick={() => navigate('/learn/git/fundamentals/what-is-git')}
        >
          {s.startCta}
        </Button>
      </div>
    </div>
  );
};
