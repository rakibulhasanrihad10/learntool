import React, { useState } from 'react';
import {
  Cloud,
  Laptop,
  Bookmark,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Zap,
  Eye,
  GitMerge,
  DownloadCloud,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './FetchPullSimulator.css';

interface FetchPullSimulatorProps {
  title?: string;
  titleBn?: string;
}

interface Commit {
  id: string;
  hash: string;
  message: string;
  messageBn: string;
  author: string;
}

const INITIAL_COMMITS: Commit[] = [
  { id: 'c1', hash: '8f2a1b0', message: 'Initial project setup', messageBn: 'প্রজেক্ট ইনিশিয়ালাইজেশন', author: 'You' },
  { id: 'c2', hash: '4e9c3d1', message: 'Add landing page layout', messageBn: 'ল্যান্ডিং পেজ লেআউট তৈরি', author: 'You' },
];

const NEW_REMOTE_COMMITS: Commit[] = [
  { id: 'c3', hash: 'b3f810c', message: 'feat: add user profile page', messageBn: 'ফিচার: ইউজার প্রোফাইল পেজ', author: 'Sarah (Teammate)' },
  { id: 'c4', hash: 'c4e1a92', message: 'fix: responsive navbar links', messageBn: 'ফিক্স: ন্যাভবার লিঙ্ক রেসপনসিভ', author: 'Alex (Teammate)' },
];

export const FetchPullSimulator: React.FC<FetchPullSimulatorProps> = ({ title, titleBn }) => {
  const { language } = useTranslation();
  const isBn = language === 'bn';

  // State
  const [remoteHasNewCommits, setRemoteHasNewCommits] = useState(false);
  const [trackingFetched, setTrackingFetched] = useState(false);
  const [localMerged, setLocalMerged] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'terminal'>('visual');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '$ git status\nOn branch main\nYour branch is up to date with \'origin/main\'.\nnothing to commit, working tree clean',
  ]);

  const addTerminalLog = (cmd: string, output: string) => {
    setTerminalLogs((prev) => [...prev, `$ ${cmd}\n${output}`]);
  };

  // Action 1: Teammate pushes to GitHub
  const handleTeammatePush = () => {
    setRemoteHasNewCommits(true);
    addTerminalLog(
      '# Remote event (Sarah & Alex pushed 2 commits to GitHub)',
      'Remote origin now contains commits: b3f810c (C3) and c4e1a92 (C4).\nNotice: Your machine does not know about this yet!'
    );
  };

  // Action 2: Run git fetch
  const handleFetch = () => {
    if (!remoteHasNewCommits) {
      addTerminalLog('git fetch origin', 'From github.com:company/repo\nAlready up to date.');
      return;
    }

    setTrackingFetched(true);
    addTerminalLog(
      'git fetch origin',
      'remote: Enumerating objects: 8, done.\nremote: Counting objects: 100% (8/8), done.\nremote: Compressing objects: 100% (5/5), done.\nFrom github.com:company/repo\n   4e9c3d1..c4e1a92  main       -> origin/main\n\n[SUCCESS] Local remote-tracking branch "origin/main" updated to c4e1a92.\n[NOTE] Your local "main" branch is untouched! Working directory is safe.'
    );
  };

  // Action 3: Inspect with git log or diff
  const handleInspectLog = () => {
    if (!trackingFetched) {
      addTerminalLog(
        'git log main..origin/main --oneline',
        '# Output is empty because origin/main has not been fetched yet!'
      );
      return;
    }
    if (localMerged) {
      addTerminalLog(
        'git log main..origin/main --oneline',
        '# Output is empty because local main is already up to date with origin/main!'
      );
      return;
    }

    addTerminalLog(
      'git log main..origin/main --oneline',
      'c4e1a92 (origin/main) fix: responsive navbar links (Alex)\nb3f810c feat: add user profile page (Sarah)\n\n[SAFE INSPECTION] You can review these 2 incoming commits before merging!'
    );
    setActiveTab('terminal');
  };

  // Action 4: Run git merge origin/main
  const handleMerge = () => {
    if (!trackingFetched) {
      addTerminalLog(
        'git merge origin/main',
        'Already up to date. (You must run "git fetch origin" first to download remote commits!)'
      );
      return;
    }
    if (localMerged) {
      addTerminalLog('git merge origin/main', 'Already up to date.');
      return;
    }

    setLocalMerged(true);
    addTerminalLog(
      'git merge origin/main',
      'Updating 4e9c3d1..c4e1a92\nFast-forward\n profile.tsx | 42 ++++++++++++++++++++++++++++++\n navbar.tsx  | 14 +++++++---\n 2 files changed, 51 insertions(+), 5 deletions(-)\n\n[SUCCESS] Local main has fast-forwarded to c4e1a92! Working directory updated.'
    );
  };

  // Action 5: Run git pull directly (Fetch + Merge in one go)
  const handlePull = () => {
    if (!remoteHasNewCommits) {
      addTerminalLog('git pull origin main', 'From github.com:company/repo\nAlready up to date.');
      return;
    }

    setTrackingFetched(true);
    setLocalMerged(true);
    addTerminalLog(
      'git pull origin main',
      'remote: Enumerating objects: 8, done.\nremote: Compressing objects: 100% (5/5), done.\nFrom github.com:company/repo\n   4e9c3d1..c4e1a92  main       -> origin/main\nUpdating 4e9c3d1..c4e1a92\nFast-forward\n profile.tsx | 42 ++++++++++++++++++++++++++++++\n navbar.tsx  | 14 +++++++---\n 2 files changed, 51 insertions(+), 5 deletions(-)\n\n[EXPLANATION] "git pull" executed 2 operations behind the scenes:\n  1. "git fetch origin" (downloaded commits to origin/main)\n  2. "git merge origin/main" (merged origin/main into local main)!'
    );
  };

  // Reset
  const handleReset = () => {
    setRemoteHasNewCommits(false);
    setTrackingFetched(false);
    setLocalMerged(false);
    setTerminalLogs([
      '$ git status\nOn branch main\nYour branch is up to date with \'origin/main\'.\nnothing to commit, working tree clean',
    ]);
  };

  // Computed commits for each tier
  const remoteCommits = remoteHasNewCommits
    ? [...INITIAL_COMMITS, ...NEW_REMOTE_COMMITS]
    : INITIAL_COMMITS;

  const trackingCommits = trackingFetched && remoteHasNewCommits
    ? [...INITIAL_COMMITS, ...NEW_REMOTE_COMMITS]
    : INITIAL_COMMITS;

  const localCommits = localMerged && trackingFetched && remoteHasNewCommits
    ? [...INITIAL_COMMITS, ...NEW_REMOTE_COMMITS]
    : INITIAL_COMMITS;

  return (
    <div className="fetch-pull-sim" tabIndex={0} aria-label="Interactive Fetch vs Pull Simulator">
      {/* Header */}
      <div className="fetch-pull-sim__header">
        <div className="fetch-pull-sim__title-group">
          <div className="fetch-pull-sim__icon-circle">
            <DownloadCloud size={20} aria-hidden="true" />
          </div>
          <div>
            <h3 className="fetch-pull-sim__title">
              {isBn && titleBn ? titleBn : (title || 'Interactive Fetch vs Pull Visual Simulator')}
            </h3>
            <p className="fetch-pull-sim__subtitle">
              {isBn
                ? 'রিমোট GitHub, লোকাল origin/main ও লোকাল main-এর ৩-স্তরের লাইভ সিমুলেশন'
                : 'Live 3-Tier Simulation: Remote GitHub, Local origin/main, and Local main'}
            </p>
          </div>
        </div>

        <div className="fetch-pull-sim__tab-toggle">
          <button
            type="button"
            className={cn('fetch-pull-sim__tab-btn', activeTab === 'visual' && 'is-active')}
            onClick={() => setActiveTab('visual')}
          >
            <DownloadCloud size={14} />
            <span>{isBn ? 'ভিজ্যুয়াল ডায়াগ্রাম' : 'Visual Diagram'}</span>
          </button>
          <button
            type="button"
            className={cn('fetch-pull-sim__tab-btn', activeTab === 'terminal' && 'is-active')}
            onClick={() => setActiveTab('terminal')}
          >
            <Terminal size={14} />
            <span>{isBn ? 'টার্মিনাল আউটপুট' : 'Terminal Output'}</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      {activeTab === 'visual' ? (
        <div className="fetch-pull-sim__body">
          {/* Quick Guidance Banner */}
          <div className="fetch-pull-sim__insight-banner">
            <ShieldCheck size={18} className="fetch-pull-sim__shield-icon" />
            <div className="fetch-pull-sim__insight-text">
              <strong>{isBn ? 'গোল্ডেন রুল:' : 'Golden Rule:'}</strong>{' '}
              {isBn
                ? 'git fetch কখনোই আপনার লোকাল কোড বা ফাইলে হাত দেয় না। এটি কেবল origin/main রিডিং আপডেট করে।'
                : 'git fetch never touches your working tree or uncommitted files. It only updates the local mirror bookmark (origin/main).'}
            </div>
          </div>

          {/* 3-Tier Architecture Flow */}
          <div className="fetch-pull-sim__tiers-grid">
            {/* TIER 1: Remote GitHub */}
            <div className="fetch-pull-sim__tier-card fetch-pull-sim__tier-card--remote">
              <div className="fetch-pull-sim__tier-header">
                <div className="fetch-pull-sim__tier-tag">
                  <Cloud size={14} />
                  <span>{isBn ? '১. রিমোট সার্ভার' : '1. Remote Server'}</span>
                </div>
                <div className="fetch-pull-sim__tier-badge remote">GitHub (origin)</div>
              </div>
              <div className="fetch-pull-sim__tier-branch">
                <span className="fetch-pull-sim__ref-pill remote">main</span>
                <span className="fetch-pull-sim__commit-count">
                  {remoteCommits.length} {isBn ? 'কমিট' : 'commits'}
                </span>
              </div>
              <div className="fetch-pull-sim__commit-stack">
                {remoteCommits.map((c, i) => (
                  <div
                    key={c.id}
                    className={cn(
                      'fetch-pull-sim__commit-node',
                      i >= 2 && 'is-new-remote animate-pop'
                    )}
                  >
                    <div className="fetch-pull-sim__commit-left">
                      <span className="fetch-pull-sim__commit-hash">{c.hash}</span>
                      <span className="fetch-pull-sim__commit-msg">
                        {isBn ? c.messageBn : c.message}
                      </span>
                    </div>
                    <span className="fetch-pull-sim__commit-author">{c.author}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connecting Flow 1 */}
            <div className="fetch-pull-sim__connector">
              <div className="fetch-pull-sim__flow-pill">
                <span>git fetch</span>
                <ArrowRight className="fetch-pull-sim__flow-arrow desktop" size={16} />
                <ArrowDown className="fetch-pull-sim__flow-arrow mobile" size={16} />
              </div>
            </div>

            {/* TIER 2: Local Remote-Tracking Branch (origin/main) */}
            <div className="fetch-pull-sim__tier-card fetch-pull-sim__tier-card--tracking">
              <div className="fetch-pull-sim__tier-header">
                <div className="fetch-pull-sim__tier-tag">
                  <Bookmark size={14} />
                  <span>{isBn ? '২. লোকাল বুকমার্ক' : '2. Local Mirror Bookmark'}</span>
                </div>
                <div className="fetch-pull-sim__tier-badge tracking">origin/main</div>
              </div>
              <div className="fetch-pull-sim__tier-branch">
                <span className="fetch-pull-sim__ref-pill tracking">refs/remotes/origin/main</span>
                <span className="fetch-pull-sim__commit-count">
                  {trackingCommits.length} {isBn ? 'কমিট' : 'commits'}
                </span>
              </div>
              <div className="fetch-pull-sim__commit-stack">
                {trackingCommits.map((c, i) => (
                  <div
                    key={c.id}
                    className={cn(
                      'fetch-pull-sim__commit-node',
                      i >= 2 && 'is-fetched animate-pop'
                    )}
                  >
                    <div className="fetch-pull-sim__commit-left">
                      <span className="fetch-pull-sim__commit-hash">{c.hash}</span>
                      <span className="fetch-pull-sim__commit-msg">
                        {isBn ? c.messageBn : c.message}
                      </span>
                    </div>
                    <span className="fetch-pull-sim__commit-author">{c.author}</span>
                  </div>
                ))}
              </div>
              {remoteHasNewCommits && !trackingFetched && (
                <div className="fetch-pull-sim__behind-pill">
                  {isBn ? '⚠️ রিমোট থেকে ২ কমিট পিছিয়ে (আনফেচড)' : '⚠️ 2 commits behind remote (Unfetched)'}
                </div>
              )}
            </div>

            {/* Connecting Flow 2 */}
            <div className="fetch-pull-sim__connector">
              <div className="fetch-pull-sim__flow-pill merge">
                <span>git merge</span>
                <ArrowRight className="fetch-pull-sim__flow-arrow desktop" size={16} />
                <ArrowDown className="fetch-pull-sim__flow-arrow mobile" size={16} />
              </div>
            </div>

            {/* TIER 3: Local Working Branch (main) */}
            <div className="fetch-pull-sim__tier-card fetch-pull-sim__tier-card--local">
              <div className="fetch-pull-sim__tier-header">
                <div className="fetch-pull-sim__tier-tag">
                  <Laptop size={14} />
                  <span>{isBn ? '৩. লোকাল ওয়ার্কস্পেস' : '3. Local Workspace'}</span>
                </div>
                <div className="fetch-pull-sim__tier-badge local">HEAD -&gt; main</div>
              </div>
              <div className="fetch-pull-sim__tier-branch">
                <span className="fetch-pull-sim__ref-pill local">refs/heads/main</span>
                <span className="fetch-pull-sim__commit-count">
                  {localCommits.length} {isBn ? 'কমিট' : 'commits'}
                </span>
              </div>
              <div className="fetch-pull-sim__commit-stack">
                {localCommits.map((c, i) => (
                  <div
                    key={c.id}
                    className={cn(
                      'fetch-pull-sim__commit-node',
                      i >= 2 && 'is-merged animate-pop'
                    )}
                  >
                    <div className="fetch-pull-sim__commit-left">
                      <span className="fetch-pull-sim__commit-hash">{c.hash}</span>
                      <span className="fetch-pull-sim__commit-msg">
                        {isBn ? c.messageBn : c.message}
                      </span>
                    </div>
                    <span className="fetch-pull-sim__commit-author">{c.author}</span>
                  </div>
                ))}
              </div>
              {trackingFetched && !localMerged && (
                <div className="fetch-pull-sim__safe-status">
                  <CheckCircle2 size={13} color="#10b981" />
                  <span>
                    {isBn
                      ? 'নিরাপদ: origin/main ফেচ হয়েছে কিন্তু লোকাল ফাইল অক্ষত!'
                      : 'Safe: origin/main is ready, but local files untouched!'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Terminal View */
        <div className="fetch-pull-sim__terminal-wrap">
          <div className="fetch-pull-sim__terminal-bar">
            <div className="fetch-pull-sim__terminal-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="fetch-pull-sim__terminal-title">bash — ~/projects/my-git-app</span>
          </div>
          <div className="fetch-pull-sim__terminal-screen">
            {terminalLogs.map((log, idx) => (
              <pre key={idx} className="fetch-pull-sim__terminal-line">
                {log}
              </pre>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Controls Bar */}
      <div className="fetch-pull-sim__controls">
        <div className="fetch-pull-sim__btn-group">
          {/* Step 1: Simulate Teammate Push */}
          <button
            type="button"
            className="fetch-pull-sim__action-btn push"
            onClick={handleTeammatePush}
            disabled={remoteHasNewCommits}
          >
            <Cloud size={15} />
            <span>{isBn ? '১. টিমমেট পুশ (সিমুলেট)' : '1. Simulate Teammate Push'}</span>
          </button>

          {/* Step 2: git fetch origin */}
          <button
            type="button"
            className="fetch-pull-sim__action-btn fetch"
            onClick={handleFetch}
            disabled={!remoteHasNewCommits || trackingFetched}
          >
            <DownloadCloud size={15} />
            <span>git fetch origin</span>
          </button>

          {/* Step 3: Inspect Diff / Log */}
          <button
            type="button"
            className="fetch-pull-sim__action-btn inspect"
            onClick={handleInspectLog}
            disabled={!trackingFetched || localMerged}
          >
            <Eye size={15} />
            <span>git log main..origin/main</span>
          </button>

          {/* Step 4: git merge origin/main */}
          <button
            type="button"
            className="fetch-pull-sim__action-btn merge"
            onClick={handleMerge}
            disabled={!trackingFetched || localMerged}
          >
            <GitMerge size={15} />
            <span>git merge origin/main</span>
          </button>

          {/* Alternative: git pull in one click */}
          <button
            type="button"
            className="fetch-pull-sim__action-btn pull"
            onClick={handlePull}
            disabled={!remoteHasNewCommits || localMerged}
            title={isBn ? 'fetch + merge একসাথে' : 'Fetch + merge in one step'}
          >
            <Zap size={15} />
            <span>git pull (Direct)</span>
          </button>
        </div>

        <button
          type="button"
          className="fetch-pull-sim__reset-btn"
          onClick={handleReset}
          title={isBn ? 'রিসেট করুন' : 'Reset Simulation'}
        >
          <RotateCcw size={15} />
          <span>{isBn ? 'রিসেট' : 'Reset'}</span>
        </button>
      </div>
    </div>
  );
};
