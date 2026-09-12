import React, { useState } from 'react';
import { GitMerge, FileText, Check, AlertTriangle, Copy, RotateCcw, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import './MergeConflictSimulator.css';

interface MergeConflictSimulatorProps {
  title?: string;
  titleBn?: string;
}

type SimStage = 'preview' | 'conflict' | 'resolved' | 'committed';
type ResolutionChoice = 'current' | 'incoming' | 'both';

export const MergeConflictSimulator: React.FC<MergeConflictSimulatorProps> = ({ title, titleBn }) => {
  const { language } = useTranslation();
  const isBn = language === 'bn';

  const [stage, setStage] = useState<SimStage>('preview');
  const [choice, setChoice] = useState<ResolutionChoice | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMergeClick = () => {
    setStage('conflict');
  };

  const handleResolve = (chosen: ResolutionChoice) => {
    setChoice(chosen);
    setStage('resolved');
  };

  const handleCommit = () => {
    setStage('committed');
  };

  const handleReset = () => {
    setStage('preview');
    setChoice(null);
  };

  const getResolvedText = () => {
    if (choice === 'current') return 'Hello! Welcome to GitVerse.';
    if (choice === 'incoming') return 'Hey everyone! Welcome to CodeCraft.';
    return 'Hello! Welcome to GitVerse.\nHey everyone! Welcome to CodeCraft.';
  };

  const handleCopy = () => {
    let text = '$ git merge feature-welcome\n';
    if (stage === 'conflict') {
      text += 'Auto-merging welcome.txt\nCONFLICT (content): Merge conflict in welcome.txt\nAutomatic merge failed; fix conflicts and then commit the result.';
    } else if (stage === 'committed') {
      text += '$ git add welcome.txt\n$ git commit -m "Merge branch \'feature-welcome\'"\n[main 7f2d1a] Merge branch \'feature-welcome\'';
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="conflict-sim">
      {/* Header */}
      <div className="conflict-sim__header">
        <div className="conflict-sim__title-wrap">
          <GitMerge size={18} className="text-primary" />
          <h3 className="conflict-sim__title font-bold">
            {isBn
              ? (titleBn || 'হাতে-কলমে পরীক্ষা: মার্জ কনফ্লিক্ট কীভাবে সমাধান করবেন?')
              : (title || 'Hands-on Sandbox: Solving a Merge Conflict Step-by-Step')}
          </h3>
        </div>
        <span className="conflict-sim__badge">
          {isBn ? 'সহজ উদাহরণ' : 'Beginner Friendly'}
        </span>
      </div>

      <p className="conflict-sim__subtitle body-sm text-muted">
        {isBn
          ? 'একটি সহজ টেক্সট ফাইল (welcome.txt) দিয়ে দেখুন কীভাবে দুটি ব্রাঞ্চ একই লাইনে ভিন্ন লেখা তৈরি করায় কনফ্লিক্ট তৈরি হয়, এবং গিট কেন কোড মুছে না ফেলে আপনাকে পছন্দ করতে বলে।'
          : 'See what happens when two branches change the exact same line in a simple text file (welcome.txt). Watch Git protect your code instead of blindly overwriting it!'}
      </p>

      {/* Stepper Progress Indicator */}
      <div className="conflict-sim__stepper">
        <div className={`step-item ${stage === 'preview' ? 'step-item--active' : 'step-item--done'}`}>
          <span className="step-num">1</span>
          <span className="step-name">{isBn ? 'দুটো ব্রাঞ্চের ফাইল' : '1. Two Versions'}</span>
        </div>
        <div className="step-divider" />
        <div className={`step-item ${stage === 'conflict' ? 'step-item--active' : stage === 'resolved' || stage === 'committed' ? 'step-item--done' : ''}`}>
          <span className="step-num">2</span>
          <span className="step-name">{isBn ? 'মার্জ ও সংঘর্ষ' : '2. The Clash'}</span>
        </div>
        <div className="step-divider" />
        <div className={`step-item ${stage === 'resolved' ? 'step-item--active' : stage === 'committed' ? 'step-item--done' : ''}`}>
          <span className="step-num">3</span>
          <span className="step-name">{isBn ? 'সঠিক লাইন পছন্দ' : '3. Pick Winner'}</span>
        </div>
        <div className="step-divider" />
        <div className={`step-item ${stage === 'committed' ? 'step-item--active' : ''}`}>
          <span className="step-num">4</span>
          <span className="step-name">{isBn ? 'মার্জ সম্পন্ন' : '4. Complete!'}</span>
        </div>
      </div>

      {/* Stage 1: The Two Versions */}
      {stage === 'preview' && (
        <div className="conflict-sim__preview-grid">
          {/* Main branch card */}
          <div className="branch-card branch-card--main">
            <div className="branch-card__header">
              <span className="branch-pill branch-pill--main">main branch (You)</span>
              <span className="font-mono text-xs text-muted">welcome.txt (Line 1)</span>
            </div>
            <div className="branch-card__body font-mono">
              <span className="line-num">1</span>
              <span className="line-content text-primary font-bold">Hello! Welcome to GitVerse.</span>
            </div>
          </div>

          <div className="conflict-sim__vs">VS</div>

          {/* Feature branch card */}
          <div className="branch-card branch-card--feature">
            <div className="branch-card__header">
              <span className="branch-pill branch-pill--feature">feature branch (Teammate)</span>
              <span className="font-mono text-xs text-muted">welcome.txt (Line 1)</span>
            </div>
            <div className="branch-card__body font-mono">
              <span className="line-num">1</span>
              <span className="line-content text-success font-bold">Hey everyone! Welcome to CodeCraft.</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Button for Stage 1 */}
      {stage === 'preview' && (
        <div className="conflict-sim__action-bar">
          <button type="button" className="btn-merge-action" onClick={handleMergeClick}>
            <GitMerge size={16} />
            <span>{isBn ? 'মার্জ করার চেষ্টা করুন (git merge feature-welcome)' : 'Try to Merge (git merge feature-welcome)'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Stage 2 & 3: Conflict Encountered */}
      {(stage === 'conflict' || stage === 'resolved') && (
        <div className="conflict-sim__conflict-view">
          {/* Warning Banner */}
          <div className="conflict-sim__alert">
            <AlertTriangle size={18} className="text-warning flex-shrink-0" />
            <div>
              <strong className="text-sm">
                {isBn ? 'মার্জ থেমে গেছে: গিট কনফ্লিক্ট শনাক্ত করেছে!' : 'Merge Paused: Git detected a conflict!'}
              </strong>
              <p className="text-xs text-muted" style={{ margin: '2px 0 0 0' }}>
                {isBn
                  ? 'গিট আপনার কোনো লেখা ডিলিট বা ওভাররাইট করেনি। গিট আপনাকে ফাইলে মার্কার (<<<<<<<) দিয়ে দেখিয়েছে কোনটি আপনার লেখা আর কোনটি সহকর্মীর লেখা।'
                  : 'Git refused to overwrite your code. Instead, it opened welcome.txt and inserted conflict markers so YOU can decide which line to keep.'}
              </p>
            </div>
          </div>

          {/* Conflict Resolution Buttons */}
          <div className="conflict-sim__choices-bar">
            <span className="text-xs font-semibold text-muted">
              {isBn ? 'আপনার সিদ্ধান্ত বেছে নিন:' : 'Choose which line you want:'}
            </span>
            <div className="choice-buttons">
              <button
                type="button"
                className={`choice-btn ${choice === 'current' ? 'choice-btn--active' : ''}`}
                onClick={() => handleResolve('current')}
              >
                <Check size={14} />
                <span>{isBn ? '১. শুধু main-এর লাইন রাখুন (GitVerse)' : '1. Accept Current (GitVerse)'}</span>
              </button>
              <button
                type="button"
                className={`choice-btn ${choice === 'incoming' ? 'choice-btn--active' : ''}`}
                onClick={() => handleResolve('incoming')}
              >
                <Check size={14} />
                <span>{isBn ? '২. শুধু feature-এর লাইন রাখুন (CodeCraft)' : '2. Accept Incoming (CodeCraft)'}</span>
              </button>
              <button
                type="button"
                className={`choice-btn ${choice === 'both' ? 'choice-btn--active' : ''}`}
                onClick={() => handleResolve('both')}
              >
                <Check size={14} />
                <span>{isBn ? '৩. দুটো লাইনই রাখুন (Keep Both)' : '3. Accept Both Lines'}</span>
              </button>
            </div>
          </div>

          {/* Interactive File Editor View */}
          <div className="conflict-sim__editor">
            <div className="editor-top">
              <FileText size={14} className="text-primary" />
              <span className="font-mono text-xs">welcome.txt</span>
              <span className="editor-status text-xs">
                {stage === 'conflict'
                  ? (isBn ? 'কনফ্লিক্ট মোডে আছে' : 'Conflicted')
                  : (isBn ? '✓ সমাধান করা হয়েছে' : '✓ Resolved')}
              </span>
            </div>

            <div className="editor-body font-mono text-xs">
              {stage === 'conflict' ? (
                <div className="conflict-code">
                  <div className="code-line code-line--marker code-line--head">
                    {'<<<<<<< HEAD (Current change on main)'}
                  </div>
                  <div className="code-line code-line--ours">
                    Hello! Welcome to GitVerse.
                  </div>
                  <div className="code-line code-line--marker code-line--divider">
                    {'======='}
                  </div>
                  <div className="code-line code-line--theirs">
                    Hey everyone! Welcome to CodeCraft.
                  </div>
                  <div className="code-line code-line--marker code-line--incoming">
                    {'>>>>>>> feature-welcome (Incoming change)'}
                  </div>
                </div>
              ) : (
                <div className="resolved-code">
                  <pre style={{ margin: 0, color: '#10b981', fontWeight: 600 }}>
                    {getResolvedText()}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* If resolved, show commit step */}
          {stage === 'resolved' && (
            <div className="conflict-sim__commit-bar">
              <div className="text-xs text-success font-semibold">
                {isBn
                  ? '✓ কনফ্লিক্ট মার্কারগুলো মুছে ফেলা হয়েছে এবং ফাইলটি প্রস্তুত!'
                  : '✓ Conflict markers deleted! The file is clean and ready to finalize.'}
              </div>
              <button type="button" className="btn-finalize-action" onClick={handleCommit}>
                <CheckCircle2 size={16} />
                <span>{isBn ? 'মার্জ কমিট করুন (git commit)' : 'Finalize Merge (git commit)'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stage 4: Successfully Committed */}
      {stage === 'committed' && (
        <div className="conflict-sim__success-card">
          <div className="success-icon-wrap">
            <ShieldCheck size={28} className="text-success" />
          </div>
          <h4 className="font-bold text-base text-success" style={{ margin: 0 }}>
            {isBn ? 'অভিনন্দন! মার্জ কনফ্লিক্ট সফলভাবে সমাধান হয়েছে!' : 'Congratulations! Merge Conflict Safely Resolved!'}
          </h4>
          <p className="body-sm text-muted" style={{ margin: '4px 0 0 0', maxWidth: '500px' }}>
            {isBn
              ? 'আপনি নিজের চোখে দেখলেন গিট কোনো কোড হারিয়ে যেতে দেয়নি। আপনি নিজেই সঠিক লাইনটি বেছে নিয়ে মার্জ সম্পন্ন করলেন।'
              : 'You saw firsthand that Git never lost any data. You inspected the options, picked the winner, and safely finalized the merge!'}
          </p>

          <div className="final-file-view font-mono text-xs">
            <div className="final-file-header">
              <FileText size={13} />
              <span>welcome.txt (Saved in Local Repository)</span>
            </div>
            <pre className="final-file-text">{getResolvedText()}</pre>
          </div>

          <button type="button" className="btn-reset" onClick={handleReset}>
            <RotateCcw size={14} />
            <span>{isBn ? 'আবার পরীক্ষা করুন' : 'Try Again'}</span>
          </button>
        </div>
      )}

      {/* Terminal Bar */}
      <div className="conflict-sim__terminal">
        <div className="conflict-sim__term-top">
          <div className="conflict-sim__term-dots">
            <span className="term-dot term-dot--red" />
            <span className="term-dot term-dot--yellow" />
            <span className="term-dot term-dot--green" />
          </div>
          <span className="font-mono text-xs text-muted">
            $ git merge feature-welcome
          </span>
          <button type="button" className="conflict-sim__copy-btn" onClick={handleCopy} title="Copy command">
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="conflict-sim__term-body font-mono text-xs">
          {stage === 'preview' && (
            <span className="text-muted"># Click 'Try to Merge' above to simulate running git merge</span>
          )}
          {stage === 'conflict' && (
            <div className="text-error">
              Auto-merging welcome.txt<br />
              CONFLICT (content): Merge conflict in welcome.txt<br />
              Automatic merge failed; fix conflicts and then commit the result.
            </div>
          )}
          {stage === 'resolved' && (
            <div className="text-warning">
              $ git add welcome.txt<br />
              # Conflict marked as resolved! Now ready to run git commit.
            </div>
          )}
          {stage === 'committed' && (
            <div className="text-success">
              $ git commit -m "Merge branch 'feature-welcome'"<br />
              [main 7f2d1a] Merge branch 'feature-welcome'<br />
              Your branch is ahead of 'origin/main' by 2 commits.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
