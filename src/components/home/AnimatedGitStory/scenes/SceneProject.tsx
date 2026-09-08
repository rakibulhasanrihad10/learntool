import React from 'react';
import { FileCode2, Folder, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/i18n/context';

export const SceneProject: React.FC = () => {
  const { t } = useTranslation();
  const s = t.home.story.scene1;

  return (
    <div className="scene-container scene-project animate-fade-in" role="region" aria-label={s.title}>
      <div className="scene-project__editor-window">
        {/* Window Header */}
        <div className="scene-project__window-header">
          <div className="scene-project__window-dots" aria-hidden="true">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <span className="scene-project__window-title">📁 my-awesome-project</span>
        </div>

        {/* Project Files */}
        <div className="scene-project__content">
          <div className="scene-project__file-tree">
            <div className="scene-project__file-item">
              <Folder size={16} className="text-muted" aria-hidden="true" />
              <span className="font-mono">src/</span>
            </div>

            <div className="scene-project__file-item scene-project__file-item--active">
              <FileCode2 size={16} className="text-primary" aria-hidden="true" />
              <span className="font-mono">{s.fileName}</span>
              <span className="scene-project__status-badge animate-pulse">{s.statusModified}</span>
            </div>

            <div className="scene-project__file-item">
              <FileCode2 size={16} className="text-muted" aria-hidden="true" />
              <span className="font-mono">login.js</span>
            </div>

            <div className="scene-project__file-item">
              <FileCode2 size={16} className="text-muted" aria-hidden="true" />
              <span className="font-mono">home.js</span>
            </div>
          </div>

          {/* Chaos piling up */}
          <div className="scene-project__chaos-overlay animate-slide-up">
            <div className="scene-project__chaos-header">
              <AlertCircle size={14} className="text-warning" aria-hidden="true" />
              <span>{s.chaosLabel}</span>
            </div>
            <div className="scene-project__chaos-tags">
              <span className="chaos-tag">app_v1.js</span>
              <span className="chaos-tag">app_v2_working.js</span>
              <span className="chaos-tag">app_final.js</span>
              <span className="chaos-tag chaos-tag--highlight">app_final_real_final.js</span>
            </div>
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
