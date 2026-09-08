import React, { useState } from 'react';
import { Info, Copy, Check, Terminal, Eye, EyeOff } from 'lucide-react';
import { InteractiveDiffLine } from '@/types/content';
import { useTranslation } from '@/i18n/context';
import './InteractiveDiff.css';

export interface InteractiveDiffProps {
  filename?: string;
  lines: InteractiveDiffLine[];
  summaryNote?: string;
  summaryNoteBn?: string;
}

export const InteractiveDiff: React.FC<InteractiveDiffProps> = ({
  filename = 'terminal output: git diff',
  lines,
  summaryNote,
  summaryNoteBn,
}) => {
  const { language } = useTranslation();
  const isBn = language === 'bn';

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Full clean raw code for copy action
  const rawCode = lines.map((l) => l.text).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLineClick = (index: number) => {
    if (selectedLineIndex === index) {
      setSelectedLineIndex(null);
    } else {
      setSelectedLineIndex(index);
      if (!showBreakdown) {
        setShowBreakdown(true);
      }
    }
  };

  const getLineTypeClass = (type?: string, isSelected?: boolean) => {
    let base = 'interactive-diff__code-line';
    if (type === 'deleted') base += ' interactive-diff__code-line--deleted';
    else if (type === 'added') base += ' interactive-diff__code-line--added';
    else if (type === 'header') base += ' interactive-diff__code-line--header';
    else base += ' interactive-diff__code-line--context';

    if (isSelected) base += ' interactive-diff__code-line--selected';
    return base;
  };

  return (
    <div className="interactive-diff-container" role="region" aria-label="Interactive Git Diff Viewer">
      {/* Terminal Top Window Bar */}
      <div className="interactive-diff__window-bar">
        <div className="interactive-diff__window-dots" aria-hidden="true">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>

        <div className="interactive-diff__title">
          <Terminal size={14} className="interactive-diff__term-icon" aria-hidden="true" />
          <span className="font-mono label-sm">{filename}</span>
        </div>

        <div className="interactive-diff__actions">
          {/* (i) Line Breakdown Toggle Button */}
          <button
            type="button"
            className={`interactive-diff__toggle-btn ${showBreakdown ? 'interactive-diff__toggle-btn--active' : ''}`}
            onClick={() => setShowBreakdown((prev) => !prev)}
            aria-expanded={showBreakdown}
            title={showBreakdown ? (isBn ? 'ব্যাখ্যা লুকান' : 'Hide explanation') : (isBn ? 'প্রতিটি লাইনের ব্যাখ্যা দেখুন' : 'Explore what each line means')}
          >
            <Info size={14} aria-hidden="true" />
            <span>
              {showBreakdown
                ? (isBn ? 'ব্যাখ্যা লুকান' : 'Hide Breakdown')
                : (isBn ? 'লাইনের অর্থ জানুন (i)' : 'Line-by-Line Breakdown (i)')}
            </span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            className="interactive-diff__copy-btn"
            onClick={handleCopy}
            title={isBn ? 'ডিফ কপি করুন' : 'Copy diff'}
            aria-label={isBn ? 'ডিফ কপি করুন' : 'Copy diff'}
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="interactive-diff__code-view">
        <pre className="interactive-diff__pre font-mono">
          {lines.map((line, idx) => {
            const isSelected = selectedLineIndex === idx;
            return (
              <div
                key={idx}
                className={getLineTypeClass(line.type, isSelected)}
                onClick={() => handleLineClick(idx)}
                title={isBn ? 'বিস্তারিত দেখতে ক্লিক করুন' : 'Click to highlight explanation'}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLineClick(idx);
                  }
                }}
              >
                <span className="interactive-diff__line-no" aria-hidden="true">
                  {idx + 1}
                </span>
                <span className="interactive-diff__line-content">{line.text}</span>
                <span className="interactive-diff__line-info-badge" aria-hidden="true">
                  <Info size={12} />
                </span>
              </div>
            );
          })}
        </pre>
      </div>

      {/* Quick Summary Pill Bar (Always Visible) */}
      <div className="interactive-diff__quick-bar">
        <div className="interactive-diff__legend">
          <span className="interactive-diff__legend-item interactive-diff__legend-item--del">
            <span className="legend-indicator indicator--del" />
            <span><strong>- (Red)</strong> {isBn ? 'মুছে ফেলা লাইন' : 'Removed line'}</span>
          </span>

          <span className="interactive-diff__legend-item interactive-diff__legend-item--add">
            <span className="legend-indicator indicator--add" />
            <span><strong>+ (Green)</strong> {isBn ? 'নতুন যোগ করা লাইন' : 'Added line'}</span>
          </span>

          <span className="interactive-diff__legend-item interactive-diff__legend-item--header">
            <span className="legend-indicator indicator--header" />
            <span><strong>Headers</strong> {isBn ? 'গিটের নিজস্ব তথ্য (উপেক্ষাযোগ্য)' : 'Internal metadata (can ignore)'}</span>
          </span>
        </div>

        <button
          type="button"
          className="interactive-diff__hint-btn"
          onClick={() => setShowBreakdown((p) => !p)}
        >
          {showBreakdown ? <EyeOff size={13} /> : <Eye size={13} />}
          <span>
            {showBreakdown
              ? (isBn ? 'ব্যাখ্যা বন্ধ করুন' : 'Close Details')
              : (isBn ? 'কোন লাইনের কী কাজ? (ক্লিক করুন)' : 'What does each line mean? (Click here)')}
          </span>
        </button>
      </div>

      {/* Expandable Breakdown Drawer / Panel */}
      {showBreakdown && (
        <div className="interactive-diff__breakdown-panel animate-slide-down">
          <div className="interactive-diff__breakdown-head">
            <div className="interactive-diff__breakdown-badge">
              <Info size={14} className="text-primary" />
              <span>
                {isBn ? 'প্রতিটি লাইনের সহজ অর্থ' : 'What Each Line Really Means'}
              </span>
            </div>
            <p className="caption text-muted">
              {isBn
                ? (summaryNoteBn || 'বাস্তব কাজে ৯৯% সময় শুধু লাল ও সবুজ লাইনই দেখতে হয়। বাকি টেকনিক্যাল লাইনগুলো কী বোঝায় তা জানতে নিচের তালিকাটি দেখুন:')
                : (summaryNote || 'In everyday work, 99% of the time you only look at red and green lines. Here is what the technical headers mean if you are curious:')}
            </p>
          </div>

          <div className="interactive-diff__table-wrap">
            <table className="interactive-diff__table">
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>{isBn ? 'টার্মিনাল লাইন' : 'Line in Diff'}</th>
                  <th style={{ width: '47%' }}>{isBn ? 'প্রকৃত অর্থ ও কাজ' : 'Plain English Meaning'}</th>
                  <th style={{ width: '15%' }}>{isBn ? 'গুরুত্ব' : 'Importance'}</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => {
                  const isSelected = selectedLineIndex === idx;
                  const importance = line.importance || (line.type === 'header' ? 'ignore' : 'vital');
                  return (
                    <tr
                      key={idx}
                      className={`interactive-diff__tr ${isSelected ? 'interactive-diff__tr--selected' : ''}`}
                      onClick={() => setSelectedLineIndex(idx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="font-mono text-xs interactive-diff__td-code">
                        <span className="interactive-diff__row-num">#{idx + 1}</span>
                        <code>{line.text}</code>
                      </td>
                      <td className="body-sm">
                        {isBn ? line.explanationBn : line.explanation}
                      </td>
                      <td>
                        {importance === 'vital' && (
                          <span className="importance-badge importance-badge--vital">
                            {isBn ? 'গুরুত্বপূর্ণ' : 'Crucial'}
                          </span>
                        )}
                        {importance === 'ignore' && (
                          <span className="importance-badge importance-badge--ignore">
                            {isBn ? 'উপেক্ষা করুন' : 'Safe to Ignore'}
                          </span>
                        )}
                        {importance === 'context' && (
                          <span className="importance-badge importance-badge--context">
                            {isBn ? 'রেফারেন্স' : 'Context'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
