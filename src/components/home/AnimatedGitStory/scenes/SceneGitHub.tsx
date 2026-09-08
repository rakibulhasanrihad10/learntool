import React from 'react';
import { Laptop, Cloud, UploadCloud } from 'lucide-react';
import { useTranslation } from '@/i18n/context';

export const SceneGitHub: React.FC = () => {
  const { t } = useTranslation();
  const s = t.home.story.scene4;

  return (
    <div className="scene-container scene-github animate-fade-in" role="region" aria-label={s.title}>
      {/* Dual Cards: Local vs Cloud */}
      <div className="scene-github__split">
        {/* Local Card (Git) */}
        <div className="scene-github__card scene-github__card--local">
          <div className="scene-github__card-head">
            <div className="scene-github__icon-wrap scene-github__icon-wrap--local">
              <Laptop size={20} aria-hidden="true" />
            </div>
            <div>
              <span className="label-sm text-primary">Tool on Your Machine</span>
              <h4 className="title-sm">{s.localTitle}</h4>
            </div>
          </div>
          <p className="body-sm text-muted">{s.localRole}</p>
          <div className="scene-github__pills">
            <span className="tag-pill font-mono">.git/ history</span>
            <span className="tag-pill font-mono">local branches</span>
          </div>
        </div>

        {/* Transfer Stream */}
        <div className="scene-github__transfer">
          <div className="scene-github__transfer-line">
            <div className="scene-github__particle animate-particle" aria-hidden="true" />
          </div>
          <div className="scene-github__command-pill animate-pulse">
            <UploadCloud size={14} aria-hidden="true" />
            <span className="font-mono text-xs">{s.pushAction}</span>
          </div>
        </div>

        {/* Cloud Card (GitHub) */}
        <div className="scene-github__card scene-github__card--cloud">
          <div className="scene-github__card-head">
            <div className="scene-github__icon-wrap scene-github__icon-wrap--cloud">
              <Cloud size={20} aria-hidden="true" />
            </div>
            <div>
              <span className="label-sm text-secondary">Platform on the Internet</span>
              <h4 className="title-sm">{s.cloudTitle}</h4>
            </div>
          </div>
          <p className="body-sm text-muted">{s.cloudRole}</p>
          <div className="scene-github__pills">
            <span className="tag-pill font-mono">github.com/repo</span>
            <span className="tag-pill font-mono">pull requests</span>
          </div>
        </div>
      </div>

      {/* Educational Caption */}
      <div className="scene-caption">
        <p className="body-md font-medium">{s.caption}</p>
      </div>
    </div>
  );
};
