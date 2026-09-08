import React, { useState } from 'react';
import { Play, Sparkles, Check, Copy, ArrowRight, Layers, FileText } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import './DiffSimulator.css';

type DiffCommandType = 'unstaged' | 'staged' | 'head';

interface DiffSimulationData {
  command: string;
  labelEn: string;
  labelBn: string;
  descriptionEn: string;
  descriptionBn: string;
  comparingEn: string;
  comparingBn: string;
  areas: {
    working: boolean;
    staging: boolean;
    head: boolean;
  };
  output: string;
  insightEn: string;
  insightBn: string;
}

const SIMULATIONS: Record<DiffCommandType, DiffSimulationData> = {
  unstaged: {
    command: 'git diff',
    labelEn: 'git diff (Unstaged)',
    labelBn: 'git diff (আনস্টেজড)',
    descriptionEn: 'Compares Working Directory against Staging Area',
    descriptionBn: 'ওয়ার্কিং ডিরেক্টরি বনাম স্টেজিং এরিয়া',
    comparingEn: 'Comparing: Working Directory ⟷ Staging Area',
    comparingBn: 'তুলনা হচ্ছে: ওয়ার্কিং ডিরেক্টরি ⟷ স্টেজিং এরিয়া',
    areas: { working: true, staging: true, head: false },
    output: `diff --git a/notes.txt b/notes.txt
--- a/notes.txt
+++ b/notes.txt
@@ -0,0 +1 @@
+ Learn Git basics`,
    insightEn: 'Only notes.txt appears! Why? Because demo.txt was already staged with git add, so it has ZERO unstaged modifications. git diff ONLY checks what you haven\'t staged yet.',
    insightBn: 'এখানে কেবল notes.txt এসেছে! কারণ demo.txt আগেই git add দিয়ে স্টেজ করা হয়েছে, তাই সেখানে কোনো আনস্টেজড পরিবর্তন নেই। git diff কেবল আনস্টেজড পরিবর্তনই দেখে।',
  },
  staged: {
    command: 'git diff --staged',
    labelEn: 'git diff --staged',
    labelBn: 'git diff --staged (স্টেজড)',
    descriptionEn: 'Compares Staging Area against Last Commit (HEAD)',
    descriptionBn: 'স্টেজিং এরিয়া বনাম সর্বশেষ কমিট (HEAD)',
    comparingEn: 'Comparing: Staging Area ⟷ Last Commit (HEAD)',
    comparingBn: 'তুলনা হচ্ছে: স্টেজিং এরিয়া ⟷ সর্বশেষ কমিট (HEAD)',
    areas: { working: false, staging: true, head: true },
    output: `diff --git a/demo.txt b/demo.txt
--- a/demo.txt
+++ b/demo.txt
@@ -1 +1 @@
- Hello World
+ Welcome to GitVerse!`,
    insightEn: 'Only demo.txt appears! Why? Because this command exclusively inspects the waiting room (Staging Area) against your last commit. notes.txt was never staged, so it is completely excluded.',
    insightBn: 'এখানে কেবল demo.txt এসেছে! কারণ এই কমান্ডটি শুধু স্টেজিং এরিয়ার সাথে সর্বশেষ কমিটের তুলনা করে। notes.txt এখনো স্টেজ করা হয়নি, তাই তা এখানে আসবে না।',
  },
  head: {
    command: 'git diff HEAD',
    labelEn: 'git diff HEAD (Everything)',
    labelBn: 'git diff HEAD (মোট পরিবর্তন)',
    descriptionEn: 'Compares Working Directory against Last Commit (HEAD)',
    descriptionBn: 'ওয়ার্কিং ডিরেক্টরি বনাম সর্বশেষ কমিট (HEAD)',
    comparingEn: 'Comparing: Working Directory ⟷ Last Commit (HEAD)',
    comparingBn: 'তুলনা হচ্ছে: ওয়ার্কিং ডিরেক্টরি ⟷ সর্বশেষ কমিট (HEAD)',
    areas: { working: true, staging: false, head: true },
    output: `diff --git a/demo.txt b/demo.txt
--- a/demo.txt
+++ b/demo.txt
@@ -1 +1 @@
- Hello World
+ Welcome to GitVerse!

diff --git a/notes.txt b/notes.txt
--- a/notes.txt
+++ b/notes.txt
@@ -0,0 +1 @@
+ Learn Git basics`,
    insightEn: 'BOTH files appear! git diff HEAD shows the grand total of everything that has changed on your computer since the last commit, regardless of whether it was staged or not.',
    insightBn: 'উভয় ফাইলই এখানে এসেছে! git diff HEAD শেষ কমিটের পর আপনার মোট সমস্ত পরিবর্তন একসাথে দেখায় — তা স্টেজ করা থাকুক বা না থাকুক।',
  },
};

export interface DiffSimulatorProps {
  title?: string;
  titleBn?: string;
}

export const DiffSimulator: React.FC<DiffSimulatorProps> = ({
  title,
  titleBn,
}) => {
  const { language } = useTranslation();
  const isBn = language === 'bn';

  const [activeCommand, setActiveCommand] = useState<DiffCommandType>('unstaged');
  const [copied, setCopied] = useState(false);

  const current = SIMULATIONS[activeCommand];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="diff-simulator" role="region" aria-label="Interactive Diff Simulator">
      {/* Header */}
      <div className="diff-simulator__header">
        <div className="diff-simulator__badge">
          <Sparkles size={14} className="text-primary" aria-hidden="true" />
          <span>{isBn ? 'ইন্টারেক্টিভ সিমুলেটর' : 'Interactive Playground'}</span>
        </div>
        <h3 className="diff-simulator__title title-md">
          {isBn
            ? (titleBn || 'হাতে-কলমে পরীক্ষা: ৩টি কমান্ড কীভাবে কাজ করে?')
            : (title || 'Interactive Lab: Test the 3 Commands Live')}
        </h3>
        <p className="diff-simulator__subtitle body-sm text-muted">
          {isBn
            ? 'আমাদের প্রজেক্টে দুটি ফাইল আছে: demo.txt স্টেজ করা হয়েছে, কিন্তু notes.txt এখনো আনস্টেজড আছে। নিচের বোতামগুলোতে ক্লিক করে দেখুন আউটপুট কীভাবে পরিবর্তিত হয়:'
            : 'Suppose we have two files: demo.txt is staged, but notes.txt is unstaged. Click each button to see what happens in real time:'}
        </p>
      </div>

      {/* 3 Git Local Areas Visualization */}
      <div className="diff-simulator__areas-row">
        {/* Area 1: Working Directory */}
        <div className={`diff-area-card ${current.areas.working ? 'diff-area-card--active' : ''}`}>
          <div className="diff-area-card__badge">
            <span className="diff-area-card__dot dot--working" />
            <span>{isBn ? '১. ওয়ার্কিং ডিরেক্টরি' : '1. Working Tree'}</span>
          </div>
          <div className="diff-area-card__file">
            <FileText size={14} className="text-warning flex-shrink-0" style={{ marginTop: '2px' }} />
            <div className="diff-area-card__file-details">
              <span className="font-mono text-xs font-bold">notes.txt</span>
              <span className="tag-pill tag-pill--unstaged">{isBn ? 'আনস্টেজড' : 'Unstaged edit'}</span>
            </div>
          </div>
        </div>

        <div className="diff-simulator__arrow-connector" aria-hidden="true">
          <ArrowRight size={16} />
          <span className="font-mono text-xxs">git add</span>
        </div>

        {/* Area 2: Staging Area */}
        <div className={`diff-area-card ${current.areas.staging ? 'diff-area-card--active' : ''}`}>
          <div className="diff-area-card__badge">
            <span className="diff-area-card__dot dot--staging" />
            <span>{isBn ? '২. স্টেজিং এরিয়া' : '2. Staging Area'}</span>
          </div>
          <div className="diff-area-card__file">
            <FileText size={14} className="text-success flex-shrink-0" style={{ marginTop: '2px' }} />
            <div className="diff-area-card__file-details">
              <span className="font-mono text-xs font-bold">demo.txt</span>
              <span className="tag-pill tag-pill--staged">{isBn ? 'স্টেজড' : 'Staged (Ready)'}</span>
            </div>
          </div>
        </div>

        <div className="diff-simulator__arrow-connector" aria-hidden="true">
          <ArrowRight size={16} />
          <span className="font-mono text-xxs">git commit</span>
        </div>

        {/* Area 3: HEAD */}
        <div className={`diff-area-card ${current.areas.head ? 'diff-area-card--active' : ''}`}>
          <div className="diff-area-card__badge">
            <span className="diff-area-card__dot dot--head" />
            <span>{isBn ? '৩. সর্বশেষ কমিট (HEAD)' : '3. Last Commit (HEAD)'}</span>
          </div>
          <div className="diff-area-card__file">
            <Layers size={14} className="text-primary flex-shrink-0" style={{ marginTop: '2px' }} />
            <div className="diff-area-card__file-details">
              <span className="font-mono text-xs font-bold">demo.txt</span>
              <span className="tag-pill tag-pill--head font-mono">v1: "Hello World"</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Comparison Status Banner */}
      <div className="diff-simulator__comparison-banner">
        <span className="diff-simulator__comparison-tag">
          {isBn ? current.comparingBn : current.comparingEn}
        </span>
      </div>

      {/* Command Selector Buttons */}
      <div className="diff-simulator__tabs" role="tablist" aria-label="Git Diff Commands">
        {(Object.keys(SIMULATIONS) as DiffCommandType[]).map((key) => {
          const item = SIMULATIONS[key];
          const isActive = activeCommand === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`diff-simulator__tab-btn ${isActive ? 'diff-simulator__tab-btn--active' : ''}`}
              onClick={() => setActiveCommand(key)}
            >
              <Play size={13} className={isActive ? 'text-primary' : 'text-muted'} aria-hidden="true" />
              <span className="font-mono">{item.command}</span>
            </button>
          );
        })}
      </div>

      {/* Terminal Display */}
      <div className="diff-simulator__terminal">
        <div className="diff-simulator__term-top">
          <div className="diff-simulator__term-dots" aria-hidden="true">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>

          <span className="font-mono text-xs text-muted">
            $ {current.command}
          </span>

          <button
            type="button"
            className="diff-simulator__term-copy"
            onClick={handleCopy}
            title={isBn ? 'কপি করুন' : 'Copy output'}
            aria-label={isBn ? 'কপি করুন' : 'Copy output'}
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="diff-simulator__term-body">
          <pre className="diff-simulator__term-code font-mono">
            {current.output.split('\n').map((line, idx) => {
              let lineClass = 'term-line--context';
              if (line.startsWith('---') || line.startsWith('+++') || line.startsWith('diff --git') || line.startsWith('@@')) {
                lineClass = 'term-line--header';
              } else if (line.startsWith('-')) {
                lineClass = 'term-line--deleted';
              } else if (line.startsWith('+')) {
                lineClass = 'term-line--added';
              }
              return (
                <div key={idx} className={`term-line ${lineClass}`}>
                  {line}
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* The Key Insight / Aha! Moment */}
      <div className="diff-simulator__insight">
        <div className="diff-simulator__insight-head">
          <Sparkles size={16} className="text-warning flex-shrink-0" aria-hidden="true" />
          <span className="font-bold text-sm">
            {isBn ? 'মূল রহস্য (কেন এমন আউটপুট এলো?):' : 'The Key Insight (Why this output?):'}
          </span>
        </div>
        <p className="body-sm text-on-surface">
          {isBn ? current.insightBn : current.insightEn}
        </p>
      </div>
    </div>
  );
};
