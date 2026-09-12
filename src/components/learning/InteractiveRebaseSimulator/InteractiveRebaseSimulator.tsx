import React, { useState } from 'react';
import {
  GitCommit,
  Check,
  Copy,
  RotateCcw,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import './InteractiveRebaseSimulator.css';

interface InteractiveRebaseSimulatorProps {
  title?: string;
  titleBn?: string;
}

type Verb = 'pick' | 'squash' | 'fixup' | 'drop';

interface SimCommit {
  id: string;
  hash: string;
  message: string;
  messageBn: string;
  verb: Verb;
  author: string;
}

const INITIAL_COMMITS: SimCommit[] = [
  {
    id: 'c1',
    hash: 'e2b4a1c',
    message: 'feat: add user profile card layout',
    messageBn: 'feat: ইউজার প্রোফাইল কার্ড লেআউট তৈরি',
    verb: 'pick',
    author: 'You',
  },
  {
    id: 'c2',
    hash: '7f9c3d2',
    message: 'fix: typo in profile bio label',
    messageBn: 'fix: বায়ো লেবেলের বানান ভুল ঠিক করা',
    verb: 'fixup',
    author: 'You',
  },
  {
    id: 'c3',
    hash: 'a1d8f4e',
    message: 'style: adjust avatar border and padding',
    messageBn: 'style: অ্যাভাটার বর্ডার ও প্যাডিং সমন্বয়',
    verb: 'fixup',
    author: 'You',
  },
];

export const InteractiveRebaseSimulator: React.FC<InteractiveRebaseSimulatorProps> = ({
  title,
  titleBn,
}) => {
  const { language } = useTranslation();
  const isBn = language === 'bn';

  const [commits, setCommits] = useState<SimCommit[]>(INITIAL_COMMITS);
  const [isExecuted, setIsExecuted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVerbChange = (commitId: string, newVerb: Verb) => {
    if (isExecuted) return;
    setCommits((prev) =>
      prev.map((c, index) => {
        // First commit cannot be squash/fixup (must have a previous commit to merge into)
        if (index === 0 && (newVerb === 'squash' || newVerb === 'fixup')) {
          return c;
        }
        return c.id === commitId ? { ...c, verb: newVerb } : c;
      })
    );
  };

  const handleExecute = () => {
    setIsExecuted(true);
  };

  const handleReset = () => {
    setCommits(INITIAL_COMMITS);
    setIsExecuted(false);
  };

  // Calculate resulting commits after execution
  const activeCommits = commits.filter((c) => c.verb !== 'drop');
  const hasSquashed = commits.slice(1).some((c) => c.verb === 'squash' || c.verb === 'fixup');
  const resultingCount = activeCommits.reduce((acc, c, idx) => {
    if (idx === 0) return 1;
    if (c.verb === 'pick') return acc + 1;
    return acc; // squash or fixup joins previous
  }, 0);

  const handleCopyCommand = () => {
    const todoList = commits.map((c) => `${c.verb} ${c.hash} ${c.message}`).join('\n');
    const text = `$ git rebase -i HEAD~3\n\n# Git TODO list:\n${todoList}\n\n# Executing rebase...\nSuccessfully rebased and updated refs/heads/feature-profile.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rebase-sim">
      {/* Header */}
      <div className="rebase-sim__header">
        <div className="rebase-sim__title-group">
          <div className="rebase-sim__badge">
            <Terminal size={14} />
            <span>git rebase -i</span>
          </div>
          <h4 className="title-md rebase-sim__title">
            {isBn
              ? titleBn || 'ইন্টারেক্টিভ রিবেস সিমুলেটর: ক্লিন হিস্টোরি তৈরি করুন'
              : title || 'Interactive Rebase Sandbox: Clean Your Commit History'}
          </h4>
        </div>

        <div className="rebase-sim__actions">
          <button
            type="button"
            className="rebase-sim__btn-icon"
            onClick={handleCopyCommand}
            title={isBn ? 'কমান্ড কপি করুন' : 'Copy command'}
            aria-label="Copy command"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
          <button
            type="button"
            className="rebase-sim__btn-icon"
            onClick={handleReset}
            title={isBn ? 'রিসেট করুন' : 'Reset sandbox'}
            aria-label="Reset sandbox"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Intro scenario */}
      <div className="rebase-sim__context">
        <p className="body-sm" style={{ margin: 0 }}>
          {isBn ? (
            <>
              <strong>বাস্তব দৃশ্যপট:</strong> আপনি ফিচার ব্রাঞ্চে কাজ করার সময় ৩টি এলোমেলো কমিট করেছেন। পিআর ওপেন করার আগে নিচের অ্যাকশনগুলো (Verb) পরিবর্তন করে অপ্রয়োজনীয় টাইপো ফিক্সগুলো মূল কমিটের সাথে <strong>Squash / Fixup</strong> করুন!
            </>
          ) : (
            <>
              <strong>Real-World Scenario:</strong> You made 3 trial-and-error commits while building a feature. Before opening a Pull Request, select an action verb for each commit to clean them up into <strong>1 professional commit</strong>!
            </>
          )}
        </p>
      </div>

      {/* Editor & Execution Container */}
      {!isExecuted ? (
        <div className="rebase-sim__editor">
          <div className="rebase-sim__editor-banner">
            <div className="rebase-sim__editor-file">
              <span className="rebase-sim__file-dot" />
              <span>git-rebase-todo (HEAD~3)</span>
            </div>
            <span className="rebase-sim__editor-hint label-xs">
              {isBn ? 'কমিটগুলোর অ্যাকশন পরিবর্তন করুন:' : 'Configure verbs (oldest commit at top):'}
            </span>
          </div>

          <div className="rebase-sim__commit-list">
            {commits.map((commit, index) => {
              const isFirst = index === 0;
              return (
                <div
                  key={commit.id}
                  className={`rebase-sim__commit-row rebase-sim__commit-row--${commit.verb}`}
                >
                  <div className="rebase-sim__verb-selector">
                    <button
                      type="button"
                      className={`verb-pill verb-pill--pick ${commit.verb === 'pick' ? 'verb-pill--active' : ''}`}
                      onClick={() => handleVerbChange(commit.id, 'pick')}
                      title="Keep this commit"
                    >
                      pick
                    </button>
                    {!isFirst && (
                      <>
                        <button
                          type="button"
                          className={`verb-pill verb-pill--fixup ${commit.verb === 'fixup' ? 'verb-pill--active' : ''}`}
                          onClick={() => handleVerbChange(commit.id, 'fixup')}
                          title="Melt into previous commit and discard this message"
                        >
                          fixup
                        </button>
                        <button
                          type="button"
                          className={`verb-pill verb-pill--squash ${commit.verb === 'squash' ? 'verb-pill--active' : ''}`}
                          onClick={() => handleVerbChange(commit.id, 'squash')}
                          title="Melt into previous commit and combine messages"
                        >
                          squash
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className={`verb-pill verb-pill--drop ${commit.verb === 'drop' ? 'verb-pill--active' : ''}`}
                      onClick={() => handleVerbChange(commit.id, 'drop')}
                      title="Discard this commit completely"
                    >
                      drop
                    </button>
                  </div>

                  <div className="rebase-sim__commit-info">
                    <span className="rebase-sim__commit-hash">{commit.hash}</span>
                    <span className="rebase-sim__commit-msg">
                      {isBn ? commit.messageBn : commit.message}
                    </span>
                  </div>

                  <div className="rebase-sim__commit-badge">
                    {commit.verb === 'pick' && (
                      <span className="label-xs text-info">
                        {isFirst ? (isBn ? 'বেস কমিট' : 'Base commit') : (isBn ? 'আলাদা থাকবে' : 'Kept separate')}
                      </span>
                    )}
                    {commit.verb === 'fixup' && (
                      <span className="label-xs text-success">
                        {isBn ? 'আগের কমিটে মিশবে (মেসেজ ছাড়া)' : 'Melts into previous (silent)'}
                      </span>
                    )}
                    {commit.verb === 'squash' && (
                      <span className="label-xs text-warning">
                        {isBn ? 'আগের কমিটে মিশবে (মেসেজসহ)' : 'Melts into previous (keep msg)'}
                      </span>
                    )}
                    {commit.verb === 'drop' && (
                      <span className="label-xs text-danger">
                        {isBn ? 'মুছে ফেলা হবে' : 'Will be dropped'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="rebase-sim__footer">
            <div className="rebase-sim__summary-hint">
              <Sparkles size={16} className="text-warning flex-shrink-0" />
              <span className="body-xs">
                {isBn ? (
                  hasSquashed ? (
                    `রিবেস চালানোর পর ৩টি কমিট স্কোয়াশ হয়ে মাত্র ${resultingCount}টি পরিচ্ছন্ন কমিটে রূপান্তর হবে!`
                  ) : (
                    'সবগুলো pick রাখা হয়েছে—কোনো কমিট মেল্ট হবে না।'
                  )
                ) : hasSquashed ? (
                  `Executing will squash 3 messy commits into ${resultingCount} clean, professional commit!`
                ) : (
                  'All set to pick. Select "fixup" on commits 2 and 3 to squash them!'
                )}
              </span>
            </div>

            <button
              type="button"
              className="rebase-sim__execute-btn"
              onClick={handleExecute}
            >
              <ArrowRight size={16} />
              <span>{isBn ? 'রিবেস চালান (git rebase -i)' : 'Execute Rebase (git rebase -i)'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Result State: Clean Linear History */
        <div className="rebase-sim__result animate-fade-in">
          <div className="rebase-sim__success-banner">
            <CheckCircle2 size={20} className="text-success" />
            <div style={{ flex: 1 }}>
              <div className="title-sm" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                {isBn
                  ? 'ইন্টারেক্টিভ রিবেস সফলভাবে সম্পন্ন হয়েছে!'
                  : 'Interactive Rebase Completed Successfully!'}
              </div>
              <div className="body-xs" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {isBn
                  ? 'আপনার হিস্টোরি এখন একদম পরিচ্ছন্ন এবং পিআর (PR) ওপেন করার জন্য প্রস্তুত।'
                  : 'Your commit timeline is now clean, linear, and ready for team review.'}
              </div>
            </div>
          </div>

          {/* Terminal log simulation */}
          <div className="rebase-sim__terminal">
            <div className="rebase-sim__term-line text-muted">
              $ git rebase -i HEAD~3
            </div>
            <div className="rebase-sim__term-line text-info">
              [detached HEAD 9c4a1e8] feat: add user profile card layout & styling
            </div>
            <div className="rebase-sim__term-line">
              &nbsp;2 files changed, 48 insertions(+), 3 deletions(-)
            </div>
            <div className="rebase-sim__term-line text-success">
              Successfully rebased and updated refs/heads/feature-profile.
            </div>
          </div>

          {/* Before vs After Visual Comparison */}
          <div className="rebase-sim__compare-grid">
            <div className="rebase-sim__compare-card rebase-sim__compare-card--before">
              <div className="rebase-sim__compare-head">
                <span className="label-xs text-danger font-bold">
                  {isBn ? 'পূর্বে: ৩টি অগোছালো কমিট' : 'BEFORE: 3 Messy Commits'}
                </span>
              </div>
              <ul className="rebase-sim__timeline-list">
                <li className="rebase-sim__timeline-item">
                  <GitCommit size={14} className="text-muted" />
                  <code>e2b4a1c</code> feat: add user profile card layout
                </li>
                <li className="rebase-sim__timeline-item text-danger">
                  <GitCommit size={14} />
                  <code>7f9c3d2</code> fix: typo in profile bio label
                </li>
                <li className="rebase-sim__timeline-item text-danger">
                  <GitCommit size={14} />
                  <code>a1d8f4e</code> style: adjust avatar border and padding
                </li>
              </ul>
            </div>

            <div className="rebase-sim__compare-card rebase-sim__compare-card--after">
              <div className="rebase-sim__compare-head">
                <span className="label-xs text-success font-bold">
                  {isBn ? 'বর্তমানে: ১টি পরিচ্ছন্ন লিনিয়ার কমিট' : 'AFTER: 1 Clean Linear Commit'}
                </span>
                <span className="badge badge--success label-xs">PR Ready</span>
              </div>
              <ul className="rebase-sim__timeline-list">
                <li className="rebase-sim__timeline-item text-success font-bold">
                  <GitCommit size={14} />
                  <code>9c4a1e8</code> feat: add user profile card layout & styling
                </li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
            <button
              type="button"
              className="rebase-sim__btn-secondary"
              onClick={handleReset}
            >
              <RotateCcw size={14} />
              <span>{isBn ? 'অন্যান্য Verb দিয়ে পুনরায় পরীক্ষা করুন' : 'Try Another Verb Combination'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
