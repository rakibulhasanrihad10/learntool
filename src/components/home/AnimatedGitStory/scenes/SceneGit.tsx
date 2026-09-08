import React from 'react';
import { RotateCcw, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '@/i18n/context';

export const SceneGit: React.FC = () => {
  const { t } = useTranslation();
  const s = t.home.story.scene2;

  return (
    <div className="scene-container scene-git animate-fade-in" role="region" aria-label={s.title}>
      {/* Problem Alert Banner */}
      <div className="scene-git__problem-alert animate-shake">
        <div className="scene-git__alert-icon" aria-hidden="true">
          <XCircle size={18} />
        </div>
        <div className="scene-git__alert-content">
          <span className="scene-git__alert-title">{s.problem}</span>
          <span className="scene-git__alert-sub">{s.undoFailed}</span>
        </div>
      </div>

      {/* Git Appears: Visual Commit Timeline */}
      <div className="scene-git__timeline-card animate-slide-up">
        <div className="scene-git__card-head">
          <div className="scene-git__badge">
            <Sparkles size={14} aria-hidden="true" />
            <span>Git History Checkpoints</span>
          </div>
          <span className="scene-git__restore-pill animate-pulse">
            <RotateCcw size={13} aria-hidden="true" />
            <span>{s.restoreAction}</span>
          </span>
        </div>

        {/* Commit Chain Nodes */}
        <div className="scene-git__chain">
          {/* Commit 1 */}
          <div className="scene-git__node">
            <div className="scene-git__dot" />
            <div className="scene-git__node-info">
              <span className="font-mono text-xs text-muted">c1a40f</span>
              <span className="text-sm font-medium">v1: Initial setup</span>
            </div>
          </div>

          <div className="scene-git__connector" aria-hidden="true" />

          {/* Commit 2 (Restored Target) */}
          <div className="scene-git__node scene-git__node--active">
            <div className="scene-git__dot scene-git__dot--active">
              <CheckCircle2 size={14} aria-hidden="true" />
            </div>
            <div className="scene-git__node-info">
              <span className="font-mono text-xs text-success">e82d1b (HEAD)</span>
              <span className="text-sm font-bold text-success">v2: Working login ✓</span>
            </div>
          </div>

          <div className="scene-git__connector scene-git__connector--faded" aria-hidden="true" />

          {/* Commit 3 (Broken) */}
          <div className="scene-git__node scene-git__node--broken">
            <div className="scene-git__dot scene-git__dot--broken">
              <XCircle size={14} aria-hidden="true" />
            </div>
            <div className="scene-git__node-info">
              <span className="font-mono text-xs text-danger">f904ac</span>
              <span className="text-sm text-muted line-through">v3: Broken edit</span>
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
