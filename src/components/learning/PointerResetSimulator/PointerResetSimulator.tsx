import React, { useState } from 'react';
import { GitCommit, History, RotateCcw, Sparkles, Check, Copy, AlertTriangle, Layers, FileCode } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import './PointerResetSimulator.css';

interface PointerResetSimulatorProps {
  title?: string;
  titleBn?: string;
}

type ResetMode = 'mixed' | 'soft' | 'hard';

interface CommitItem {
  id: string;
  hash: string;
  message: string;
  messageBn: string;
  addedFile: string;
}

const COMMITS: CommitItem[] = [
  { id: 'C1', hash: '1a8f9b2', message: 'Initial project setup', messageBn: 'প্রাথমিক প্রজেক্ট সেটআপ', addedFile: 'index.html' },
  { id: 'C2', hash: '4c7e2d1', message: 'Add navigation component', messageBn: 'ন্যাভিগেশন কম্পোনেন্ট তৈরি', addedFile: 'nav.js' },
  { id: 'C3', hash: '9b3d5f8', message: 'Add client login form', messageBn: 'ক্লায়েন্ট লগইন ফর্ম যোগ', addedFile: 'login.html' },
  { id: 'C4', hash: '5e2c1a0', message: 'Fix auth styling bug', messageBn: 'অথেনটিকেশন স্টাইলিং বাগ ফিক্স', addedFile: 'auth.css' },
];

export const PointerResetSimulator: React.FC<PointerResetSimulatorProps> = ({ title, titleBn }) => {
  const { language } = useTranslation();
  const isBn = language === 'bn';

  // 0 = C4 (latest), 1 = C3 (HEAD~1), 2 = C2 (HEAD~2)
  const [stepBack, setStepBack] = useState<number>(0);
  const [resetMode, setResetMode] = useState<ResetMode>('mixed');
  const [copied, setCopied] = useState(false);

  const activeIndex = 3 - stepBack; // 3 for C4, 2 for C3, 1 for C2
  const activeCommit = COMMITS[activeIndex];

  const getCommand = () => {
    if (stepBack === 0) return 'git status';
    const flag = resetMode === 'mixed' ? '' : `--${resetMode} `;
    return `git reset ${flag}HEAD~${stepBack}`.trim();
  };

  const getTerminalOutput = () => {
    if (stepBack === 0) {
      return `On branch main\nYour branch is up to date with 'origin/main'.\nnothing to commit, working tree clean`;
    }

    if (resetMode === 'soft') {
      const files = COMMITS.slice(activeIndex + 1).map((c) => c.addedFile);
      return `HEAD is now at ${activeCommit.hash} ${activeCommit.message}\n(Changes remain STAGED in green and ready to re-commit):\n${files.map((f) => `  staged: ${f}`).join('\n')}`;
    }

    if (resetMode === 'mixed') {
      const files = COMMITS.slice(activeIndex + 1).map((c) => c.addedFile);
      return `Unstaged changes after reset:\n${files.map((f) => `M\t${f}`).join('\n')}\nHEAD is now at ${activeCommit.hash} ${activeCommit.message}`;
    }

    // hard
    return `HEAD is now at ${activeCommit.hash} ${activeCommit.message}\n(Discarded uncommitted working tree changes permanently)`;
  };

  const handleCopy = () => {
    const text = `$ ${getCommand()}\n${getTerminalOutput()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pointer-reset">
      {/* Header */}
      <div className="pointer-reset__header">
        <div className="pointer-reset__title-wrap">
          <History size={18} className="text-primary" />
          <h3 className="pointer-reset__title font-bold">
            {isBn
              ? (titleBn || 'ইন্টারেক্টিভ সিমুলেটর: পয়েন্টার টাইম-ট্রাভেল (HEAD~1 ও HEAD~2)')
              : (title || 'Interactive Simulator: Pointer Time-Travel (HEAD~1 & HEAD~2)')}
          </h3>
        </div>
        <span className="pointer-reset__badge">
          {isBn ? 'পয়েন্টার শিফটিং' : 'Pointer Manipulation'}
        </span>
      </div>

      <p className="pointer-reset__subtitle body-sm text-muted">
        {isBn
          ? 'নিচের বাটনে ক্লিক করে ব্রাঞ্চ পয়েন্টারটিকে ১টি বা ২টি কমিট পেছনে নিয়ে যান এবং লক্ষ্য করুন গিট কিন্তু কমিট মুছে ফেলে না—কেবল পয়েন্টারটিকে পেছনের দিকে ঘুরিয়ে দেয়!'
          : 'Click the buttons below to rewind your branch pointer by 1 or 2 commits. Watch how Git doesn’t delete your commits—it simply slides the branch pointer backward along the chain!'}
      </p>

      {/* Control Actions */}
      <div className="pointer-reset__controls">
        {/* Step Selector */}
        <div className="pointer-reset__step-buttons">
          <button
            type="button"
            className={`pointer-reset__btn ${stepBack === 0 ? 'pointer-reset__btn--active' : ''}`}
            onClick={() => setStepBack(0)}
          >
            <GitCommit size={14} />
            <span className="font-mono">HEAD (Latest: C4)</span>
          </button>

          <button
            type="button"
            className={`pointer-reset__btn ${stepBack === 1 ? 'pointer-reset__btn--active' : ''}`}
            onClick={() => setStepBack(1)}
          >
            <RotateCcw size={14} />
            <span className="font-mono">git reset HEAD~1 (C3)</span>
          </button>

          <button
            type="button"
            className={`pointer-reset__btn ${stepBack === 2 ? 'pointer-reset__btn--active' : ''}`}
            onClick={() => setStepBack(2)}
          >
            <RotateCcw size={14} />
            <span className="font-mono">git reset HEAD~2 (C2)</span>
          </button>
        </div>

        {/* Reset Mode Selector */}
        <div className="pointer-reset__mode-selector">
          <span className="text-xs font-semibold text-muted">
            {isBn ? 'রিসেট মোড:' : 'Reset Mode:'}
          </span>
          <div className="pointer-reset__pill-group">
            <button
              type="button"
              className={`pointer-reset__pill-btn ${resetMode === 'mixed' ? 'pointer-reset__pill-btn--active' : ''}`}
              onClick={() => setResetMode('mixed')}
              title={isBn ? 'ডিফল্ট: ফাইল আনস্টেজ অবস্থায় ফোল্ডারে থাকে' : 'Default: keeps modified files in folder unstaged'}
            >
              --mixed ({isBn ? 'ডিফল্ট' : 'default'})
            </button>
            <button
              type="button"
              className={`pointer-reset__pill-btn ${resetMode === 'soft' ? 'pointer-reset__pill-btn--active' : ''}`}
              onClick={() => setResetMode('soft')}
              title={isBn ? 'ফাইলগুলো স্টেজড অবস্থায় রাখে' : 'Keeps files staged in green'}
            >
              --soft ({isBn ? 'স্টেজড' : 'staged'})
            </button>
            <button
              type="button"
              className={`pointer-reset__pill-btn ${resetMode === 'hard' ? 'pointer-reset__pill-btn--hard' : ''}`}
              onClick={() => setResetMode('hard')}
              title={isBn ? 'সতর্কতা: ফাইল ডিলিট হয়ে যায়!' : 'Caution: permanently discards edits!'}
            >
              --hard ({isBn ? 'মুছে ফেলা' : 'discard'})
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Commit Chain Graphic */}
      <div className="pointer-reset__graph-container">
        <div className="pointer-reset__graph-label">
          <Layers size={14} className="text-primary" />
          <span className="font-semibold text-xs">
            {isBn ? 'কমিট চেইন ও পয়েন্টারের অবস্থান' : 'Commit History Chain & Pointer Position'}
          </span>
        </div>

        <div className="pointer-reset__chain">
          {COMMITS.map((commit, idx) => {
            const isPointerHere = idx === activeIndex;
            const isAhead = idx > activeIndex;

            return (
              <React.Fragment key={commit.id}>
                <div
                  className={`pointer-reset__node-wrapper ${isPointerHere ? 'node-wrapper--active' : ''} ${isAhead ? 'node-wrapper--ahead' : ''}`}
                  onClick={() => setStepBack(3 - idx)}
                  role="button"
                  tabIndex={0}
                >
                  {/* Floating Pointer Pill */}
                  {isPointerHere && (
                    <div className="pointer-reset__floating-pointer">
                      <div className="head-pill">HEAD</div>
                      <div className="branch-pill">main</div>
                      <div className="pointer-arrow" />
                    </div>
                  )}

                  <div className={`commit-bubble ${isPointerHere ? 'commit-bubble--active' : ''} ${isAhead ? 'commit-bubble--dim' : ''}`}>
                    <span className="commit-bubble__id font-mono">{commit.id}</span>
                  </div>

                  <span className="commit-hash font-mono text-xs">{commit.hash}</span>
                  <span className="commit-msg text-xs">
                    {isBn ? commit.messageBn : commit.message}
                  </span>

                  {isAhead && (
                    <span className="commit-status-ahead text-xs">
                      {isBn ? 'পয়েন্টারের সামনে' : 'ahead of pointer'}
                    </span>
                  )}
                </div>

                {idx < COMMITS.length - 1 && (
                  <div className={`commit-connector ${idx >= activeIndex ? 'commit-connector--ahead' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Local Areas State Inspection */}
      <div className="pointer-reset__inspection">
        <div className="pointer-reset__area-card">
          <div className="area-card__title">
            <FileCode size={14} />
            <span>{isBn ? 'ফাইল ও লোকাল এরিয়া অবস্থা' : 'File & Local Area Status'}</span>
          </div>

          <div className="area-card__body body-sm">
            {stepBack === 0 ? (
              <div className="status-clean text-success">
                {isBn
                  ? '✓ আপনার ওয়ার্কিং ডিরেক্টরি সম্পূর্ণ পরিষ্কার। সমস্ত ৪টি ফিচার স্থায়ীভাবে main ব্রাঞ্চে সংরক্ষিত।'
                  : '✓ Working directory is clean. All 4 features are safely committed on main.'}
              </div>
            ) : (
              <div className="status-rewound">
                <p style={{ margin: 0, marginBottom: '6px' }}>
                  {isBn ? (
                    <>
                      পয়েন্টারটি এখন <strong>{activeCommit.id} ({activeCommit.hash})</strong>-এ অবস্থান করছে।
                    </>
                  ) : (
                    <>
                      The branch pointer is now resting on <strong>{activeCommit.id} ({activeCommit.hash})</strong>.
                    </>
                  )}
                </p>

                {resetMode === 'soft' && (
                  <div className="mode-badge-info mode-badge--soft">
                    {isBn
                      ? '• --soft মোড: পেছানো কমিটের ফাইলগুলো স্টেজিং এরিয়ায় (staged) সবুজ রঙে প্রস্তুত রাখা হয়েছে।'
                      : '• --soft mode: Changes from rewound commits are safely kept in your Staging Area, ready to re-commit.'}
                  </div>
                )}

                {resetMode === 'mixed' && (
                  <div className="mode-badge-info mode-badge--mixed">
                    {isBn
                      ? '• --mixed মোড: পেছানো কমিটের ফাইলগুলো ওয়ার্কিং ডিরেক্টরিতে আনস্টেজড (unstaged) হিসেবে রাখা হয়েছে।'
                      : '• --mixed mode: Changes from rewound commits remain in your Working Directory as unstaged edits.'}
                  </div>
                )}

                {resetMode === 'hard' && (
                  <div className="mode-badge-info mode-badge--hard">
                    <AlertTriangle size={14} className="text-error" />
                    <span>
                      {isBn
                        ? '• --hard মোড: পেছানো কমিটের ফাইলগুলো আপনার কম্পিউটার থেকে স্থায়ীভাবে মুছে দেওয়া হয়েছে!'
                        : '• --hard mode: Changes from rewound commits were permanently deleted from your working directory!'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal View */}
      <div className="pointer-reset__terminal">
        <div className="pointer-reset__term-top">
          <div className="pointer-reset__term-dots">
            <span className="term-dot term-dot--red" />
            <span className="term-dot term-dot--yellow" />
            <span className="term-dot term-dot--green" />
          </div>
          <span className="font-mono text-xs text-muted">$ {getCommand()}</span>
          <button type="button" className="pointer-reset__copy-btn" onClick={handleCopy} title="Copy output">
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>
        <div className="pointer-reset__term-body font-mono text-xs">
          <pre className="pointer-reset__term-text">{getTerminalOutput()}</pre>
        </div>
      </div>

      {/* Insight */}
      <div className="pointer-reset__insight">
        <div className="pointer-reset__insight-head">
          <Sparkles size={16} className="text-warning flex-shrink-0" />
          <span className="font-bold text-sm">
            {isBn ? 'পয়েন্টারের মূল রহস্য (The Mental Model):' : 'The Core Mental Model:'}
          </span>
        </div>
        <p className="body-sm text-on-surface" style={{ margin: 0 }}>
          {stepBack === 0 ? (
            isBn ? (
              <>
                স্বাভাবিক অবস্থায় <code>HEAD</code> নির্দেশ করে <code>main</code> ব্রাঞ্চকে, এবং <code>main</code> নির্দেশ করে সর্বশেষ কমিট <strong>C4</strong>-কে।
              </>
            ) : (
              <>
                In normal development, <code>HEAD</code> points to the <code>main</code> branch label, and <code>main</code> points to the tip commit <strong>C4</strong>.
              </>
            )
          ) : (
            isBn ? (
              <>
                লক্ষ্য করুন, <code>git reset HEAD~{stepBack}</code> কিন্তু গিট থেকে কমিট মুছে দেয়নি! এটি শুধুমাত্র <code>main</code> ব্রাঞ্চের পয়েন্টারটিকে <strong>{activeCommit.id}</strong>-এ পেছনের দিকে সরিয়ে নিয়েছে। গিট এভাবে নিমেষেই পয়েন্টার ঘুরিয়ে টাইম-ট্রাভেল করে।
              </>
            ) : (
              <>
                Notice that running <code>git reset HEAD~{stepBack}</code> did not delete the commit from Git! It simply moved the <code>main</code> branch pointer backward to <strong>{activeCommit.id}</strong>. The commits still exist in Git's object database.
              </>
            )
          )}
        </p>
      </div>
    </div>
  );
};
