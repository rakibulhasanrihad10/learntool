import React from 'react';
import { GitMerge, User } from 'lucide-react';
import { useTranslation } from '@/i18n/context';

export const SceneBranches: React.FC = () => {
  const { t } = useTranslation();
  const s = t.home.story.scene3;

  return (
    <div className="scene-container scene-branches animate-fade-in" role="region" aria-label={s.title}>
      {/* Developer Collaboration Header */}
      <div className="scene-branches__devs-bar">
        <div className="scene-branches__dev-pill scene-branches__dev-pill--a">
          <User size={14} aria-hidden="true" />
          <span>{s.devA}</span>
        </div>
        <div className="scene-branches__dev-pill scene-branches__dev-pill--b">
          <User size={14} aria-hidden="true" />
          <span>{s.devB}</span>
        </div>
      </div>

      {/* Visual Branch Diagram Container */}
      <div className="scene-branches__diagram-card">
        {/* SVG Git Graph */}
        <div className="scene-branches__graph-container">
          <svg
            className="scene-branches__svg"
            viewBox="0 0 540 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Main Baseline Line */}
            <path
              d="M 40 80 L 140 80 M 380 80 L 490 80"
              stroke="var(--md-sys-color-outline-variant)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Feature A Branch Curve (Top) */}
            <path
              d="M 140 80 C 180 80, 200 35, 250 35 L 320 35 C 350 35, 360 80, 390 80"
              stroke="var(--md-sys-color-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="4 2"
              className="animate-branch-line"
            />

            {/* Bug Fix Branch Curve (Bottom) */}
            <path
              d="M 140 80 C 180 80, 200 125, 250 125 L 320 125 C 350 125, 360 80, 390 80"
              stroke="var(--md-sys-color-tertiary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="4 2"
              className="animate-branch-line"
            />

            {/* Main Commit 1 */}
            <circle cx="40" cy="80" r="8" fill="var(--md-sys-color-surface-container-high)" stroke="var(--md-sys-color-primary)" strokeWidth="3" />
            <text x="40" y="105" textAnchor="middle" fill="var(--md-sys-color-on-surface-variant)" fontSize="11" fontFamily="monospace">c1</text>

            {/* Fork Commit 2 */}
            <circle cx="140" cy="80" r="8" fill="var(--md-sys-color-surface-container-high)" stroke="var(--md-sys-color-primary)" strokeWidth="3" />
            <text x="140" y="105" textAnchor="middle" fill="var(--md-sys-color-on-surface-variant)" fontSize="11" fontFamily="monospace">c2</text>

            {/* Feature A Commit (Top) */}
            <circle cx="280" cy="35" r="9" fill="var(--md-sys-color-primary)" stroke="var(--md-sys-color-on-primary)" strokeWidth="2" />
            <text x="280" y="20" textAnchor="middle" fill="var(--md-sys-color-primary)" fontSize="11" fontWeight="bold">feat: auth</text>

            {/* Bug Fix Commit (Bottom) */}
            <circle cx="280" cy="125" r="9" fill="var(--md-sys-color-tertiary)" stroke="var(--md-sys-color-on-tertiary)" strokeWidth="2" />
            <text x="280" y="152" textAnchor="middle" fill="var(--md-sys-color-tertiary)" fontSize="11" fontWeight="bold">fix: login</text>

            {/* Merge Commit (Right) */}
            <circle cx="390" cy="80" r="10" fill="var(--md-sys-color-success)" stroke="var(--md-sys-color-surface)" strokeWidth="3" />
            <text x="390" y="105" textAnchor="middle" fill="var(--md-sys-color-success)" fontSize="11" fontWeight="bold">merge</text>

            {/* Main Updated Tip */}
            <circle cx="490" cy="80" r="8" fill="var(--md-sys-color-surface-container-high)" stroke="var(--md-sys-color-primary)" strokeWidth="3" />
            <text x="490" y="105" textAnchor="middle" fill="var(--md-sys-color-on-surface-variant)" fontSize="11" fontFamily="monospace">main</text>
          </svg>
        </div>

        {/* Merge Cleanly Tag */}
        <div className="scene-branches__status-row">
          <div className="scene-branches__badge">
            <GitMerge size={14} aria-hidden="true" />
            <span>{s.mergeLabel}</span>
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
