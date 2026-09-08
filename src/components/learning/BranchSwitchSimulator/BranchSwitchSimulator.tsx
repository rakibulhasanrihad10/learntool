import React, { useState } from 'react';
import { GitBranch, Folder, FileText, Check, Copy, Sparkles, Terminal, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import './BranchSwitchSimulator.css';

interface BranchSwitchSimulatorProps {
  title?: string;
  titleBn?: string;
}

type BranchName = 'main' | 'feature';
type CommandStyle = 'switch' | 'checkout';

export const BranchSwitchSimulator: React.FC<BranchSwitchSimulatorProps> = ({ title, titleBn }) => {
  const { language } = useTranslation();
  const isBn = language === 'bn';

  const [currentBranch, setCurrentBranch] = useState<BranchName>('feature');
  const [commandStyle, setCommandStyle] = useState<CommandStyle>('switch');
  const [typedCommand, setTypedCommand] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastAction, setLastAction] = useState<string>('git switch feature');
  const [terminalOutput, setTerminalOutput] = useState<string>(
    "Switched to branch 'feature'\nYour branch is up to date with 'origin/feature'."
  );
  const [terminalError, setTerminalError] = useState<string | null>(null);

  const switchBranch = (target: BranchName, style: CommandStyle = commandStyle) => {
    if (target === currentBranch) {
      const cmd = style === 'switch' ? `git switch ${target}` : `git checkout ${target}`;
      setLastAction(cmd);
      setTerminalOutput(`Already on '${target}'`);
      setTerminalError(null);
      return;
    }

    const cmd = style === 'switch' ? `git switch ${target}` : `git checkout ${target}`;
    setLastAction(cmd);
    setCurrentBranch(target);
    setTerminalError(null);

    if (target === 'main') {
      setTerminalOutput(
        `Switched to branch 'main'\nYour branch is up to date with 'origin/main'.`
      );
    } else {
      setTerminalOutput(
        `Switched to branch 'feature'\nYour branch is up to date with 'origin/feature'.`
      );
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = typedCommand.trim().toLowerCase();
    if (!clean) return;

    if (clean === 'git switch feature' || clean === 'git checkout feature') {
      const style = clean.startsWith('git switch') ? 'switch' : 'checkout';
      setCommandStyle(style);
      switchBranch('feature', style);
      setTypedCommand('');
    } else if (clean === 'git switch main' || clean === 'git checkout main' || clean === 'git checkout master') {
      const style = clean.startsWith('git switch') ? 'switch' : 'checkout';
      setCommandStyle(style);
      switchBranch('main', style);
      setTypedCommand('');
    } else if (clean === 'git branch') {
      setLastAction('git branch');
      if (currentBranch === 'main') {
        setTerminalOutput(`* main\n  feature`);
      } else {
        setTerminalOutput(`  main\n* feature`);
      }
      setTerminalError(null);
      setTypedCommand('');
    } else if (clean === 'ls' || clean === 'dir') {
      setLastAction('ls');
      if (currentBranch === 'feature') {
        setTerminalOutput(`README.md   feature1.txt   index.html   styles.css`);
      } else {
        setTerminalOutput(`README.md   index.html   styles.css`);
      }
      setTerminalError(null);
      setTypedCommand('');
    } else {
      setLastAction(clean);
      setTerminalOutput(`git: '${clean}' is not a recognized demo command.\nTry: 'git switch main' or 'git switch feature'`);
      setTerminalError(isBn ? 'সঠিক কমান্ড লিখুন (যেমন: git switch main)' : "Try: 'git switch main' or 'git switch feature'");
      setTypedCommand('');
    }
  };

  const handleCopy = () => {
    const text = `$ ${lastAction}\n${terminalOutput}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="branch-switcher">
      {/* Header */}
      <div className="branch-switcher__header">
        <div className="branch-switcher__title-wrap">
          <GitBranch size={18} className="text-primary" />
          <h3 className="branch-switcher__title font-bold">
            {isBn ? (titleBn || 'ইন্টারেক্টিভ সিমুলেটর: ফাইল উধাও ও ফিরে আসার পরীক্ষা') : (title || 'Interactive Simulator: The Disappearing File Experiment')}
          </h3>
        </div>
        <span className="branch-switcher__badge">
          {isBn ? 'হাতে-কলমে পরীক্ষা' : 'Hands-On Experiment'}
        </span>
      </div>

      <p className="branch-switcher__subtitle body-sm text-muted">
        {isBn
          ? 'নিচের কমান্ডগুলোতে ক্লিক করে বা টাইপ করে ব্রাঞ্চ পরিবর্তন করুন এবং দেখুন বাম পাশের ফোল্ডারে feature1.txt কীভাবে মুহূর্তের মধ্যে উধাও হয়ে যায় ও ফিরে আসে!'
          : 'Switch branches by clicking the action buttons or typing in the terminal. Watch feature1.txt physically vanish from your computer folder on the left when you switch to main!'}
      </p>

      {/* Control Bar */}
      <div className="branch-switcher__controls">
        {/* Style Selector */}
        <div className="branch-switcher__style-toggle">
          <span className="text-xs font-semibold text-muted">
            {isBn ? 'সিনট্যাক্স পদ্ধতি:' : 'Syntax Style:'}
          </span>
          <div className="branch-switcher__pill-group">
            <button
              type="button"
              className={`branch-switcher__pill-btn ${commandStyle === 'switch' ? 'branch-switcher__pill-btn--active' : ''}`}
              onClick={() => setCommandStyle('switch')}
            >
              {isBn ? 'আধুনিক (git switch)' : 'Modern (git switch)'}
            </button>
            <button
              type="button"
              className={`branch-switcher__pill-btn ${commandStyle === 'checkout' ? 'branch-switcher__pill-btn--active' : ''}`}
              onClick={() => setCommandStyle('checkout')}
            >
              {isBn ? 'ক্লাসিক (git checkout)' : 'Classic (git checkout)'}
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="branch-switcher__action-buttons">
          <button
            type="button"
            className={`branch-switcher__action-btn ${currentBranch === 'main' ? 'branch-switcher__action-btn--selected' : ''}`}
            onClick={() => switchBranch('main')}
          >
            <ArrowRight size={14} />
            <span className="font-mono">
              {commandStyle === 'switch' ? 'git switch main' : 'git checkout main'}
            </span>
            {currentBranch === 'main' && (
              <span className="branch-switcher__tag-active">{isBn ? 'সক্রিয়' : 'Active'}</span>
            )}
          </button>

          <button
            type="button"
            className={`branch-switcher__action-btn ${currentBranch === 'feature' ? 'branch-switcher__action-btn--selected' : ''}`}
            onClick={() => switchBranch('feature')}
          >
            <ArrowRight size={14} />
            <span className="font-mono">
              {commandStyle === 'switch' ? 'git switch feature' : 'git checkout feature'}
            </span>
            {currentBranch === 'feature' && (
              <span className="branch-switcher__tag-active">{isBn ? 'সক্রিয়' : 'Active'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-Side Playground */}
      <div className="branch-switcher__playground">
        {/* Left: Simulated Computer Directory */}
        <div className="branch-switcher__panel branch-switcher__folder-panel">
          <div className="branch-switcher__panel-header">
            <Folder size={16} className="text-primary" />
            <span className="font-semibold text-sm">
              {isBn ? 'আপনার কম্পিউটারের লোকাল ফোল্ডার (Working Directory)' : 'Your Computer Folder (Working Directory)'}
            </span>
            <span className="branch-switcher__folder-branch-indicator font-mono text-xs">
              {currentBranch === 'main' ? 'on: main' : 'on: feature'}
            </span>
          </div>

          <div className="branch-switcher__folder-contents">
            {/* Stable Common Files */}
            <div className="branch-switcher__file-item">
              <FileText size={15} className="text-muted" />
              <span className="font-mono text-sm">index.html</span>
              <span className="branch-switcher__file-status text-xs text-muted">
                {isBn ? 'উভয় ব্রাঞ্চে আছে' : 'common'}
              </span>
            </div>

            <div className="branch-switcher__file-item">
              <FileText size={15} className="text-muted" />
              <span className="font-mono text-sm">styles.css</span>
              <span className="branch-switcher__file-status text-xs text-muted">
                {isBn ? 'উভয় ব্রাঞ্চে আছে' : 'common'}
              </span>
            </div>

            <div className="branch-switcher__file-item">
              <FileText size={15} className="text-muted" />
              <span className="font-mono text-sm">README.md</span>
              <span className="branch-switcher__file-status text-xs text-muted">
                {isBn ? 'উভয় ব্রাঞ্চে আছে' : 'common'}
              </span>
            </div>

            {/* The Disappearing / Reappearing File */}
            {currentBranch === 'feature' ? (
              <div className="branch-switcher__file-item branch-switcher__file-item--feature branch-switcher__file-item--appear">
                <div className="branch-switcher__file-name-wrap">
                  <FileText size={15} className="text-success" />
                  <span className="font-mono text-sm font-bold text-success">feature1.txt</span>
                </div>
                <div className="branch-switcher__file-badge-group">
                  <Eye size={13} className="text-success" />
                  <span className="branch-switcher__badge-present">
                    {isBn ? 'ফোল্ডারে দৃশ্যমান!' : 'Present in folder!'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="branch-switcher__file-item branch-switcher__file-item--ghost">
                <div className="branch-switcher__file-name-wrap">
                  <EyeOff size={15} className="text-error" />
                  <span className="font-mono text-sm text-error strike-through">feature1.txt</span>
                </div>
                <span className="branch-switcher__badge-vanished text-xs font-semibold">
                  {isBn ? 'উধাও হয়ে গেছে! (main-এ নেই)' : 'Disappeared! (not in main)'}
                </span>
              </div>
            )}
          </div>

          <div className="branch-switcher__folder-footer text-xs">
            {currentBranch === 'feature' ? (
              <span className="text-success">
                {isBn
                  ? '✓ feature1.txt এখন আপনার লোকাল হার্ডড্রাইভে ফিজিক্যালি উপস্থিত।'
                  : '✓ feature1.txt is physically present on your computer drive.'}
              </span>
            ) : (
              <span className="text-error">
                {isBn
                  ? '✕ main ব্রাঞ্চে সুইচ করায় feature1.txt সাময়িকভাবে মুছে গেছে।'
                  : '✕ Switching to main temporarily removed feature1.txt from your drive.'}
              </span>
            )}
          </div>
        </div>

        {/* Right: Git Branch & Commit DAG */}
        <div className="branch-switcher__panel branch-switcher__graph-panel">
          <div className="branch-switcher__panel-header">
            <GitBranch size={16} className="text-primary" />
            <span className="font-semibold text-sm">
              {isBn ? 'গিটের হিস্ট্রি ও HEAD পয়েন্টার' : 'Git History & HEAD Pointer'}
            </span>
          </div>

          <div className="branch-switcher__graph-body">
            {/* Visual Branch Paths */}
            <div className="branch-switcher__dag">
              {/* Common Base */}
              <div className="branch-switcher__commit-node">
                <div className="node-circle node-circle--done">C1</div>
                <span className="node-label font-mono text-xs">Init</span>
              </div>

              <div className="node-line" />

              <div className="branch-switcher__commit-node">
                <div className="node-circle node-circle--done">C2</div>
                <span className="node-label font-mono text-xs">Base</span>
              </div>

              <div className="dag-fork">
                {/* Main Branch Line */}
                <div className="dag-branch-row">
                  <div className="node-line fork-line--top" />
                  <div className={`branch-switcher__commit-node ${currentBranch === 'main' ? 'node--active' : ''}`}>
                    <div className="node-circle node-circle--main">C3</div>
                    <span className="node-label font-mono text-xs">Docs</span>
                  </div>

                  {/* main label */}
                  <div className="branch-pill branch-pill--main">
                    main
                  </div>

                  {/* HEAD marker if on main */}
                  {currentBranch === 'main' && (
                    <div className="head-pointer-badge">
                      <span>HEAD</span>
                    </div>
                  )}
                </div>

                {/* Feature Branch Line */}
                <div className="dag-branch-row">
                  <div className="node-line fork-line--bottom" />
                  <div className={`branch-switcher__commit-node ${currentBranch === 'feature' ? 'node--active' : ''}`}>
                    <div className="node-circle node-circle--feature">C4</div>
                    <span className="node-label font-mono text-xs">+feature1</span>
                  </div>

                  {/* feature label */}
                  <div className="branch-pill branch-pill--feature">
                    feature
                  </div>

                  {/* HEAD marker if on feature */}
                  {currentBranch === 'feature' && (
                    <div className="head-pointer-badge">
                      <span>HEAD</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="branch-switcher__pointer-status font-mono text-xs">
              <span className="text-muted">Current HEAD: </span>
              <strong className="text-primary font-bold">
                HEAD ➔ {currentBranch}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Bar */}
      <div className="branch-switcher__terminal">
        <div className="branch-switcher__term-top">
          <div className="branch-switcher__term-dots" aria-hidden="true">
            <span className="term-dot term-dot--red" />
            <span className="term-dot term-dot--yellow" />
            <span className="term-dot term-dot--green" />
          </div>
          <span className="font-mono text-xs text-muted">
            $ {lastAction}
          </span>
          <button
            type="button"
            className="branch-switcher__copy-btn"
            onClick={handleCopy}
            title={isBn ? 'কপি করুন' : 'Copy'}
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="branch-switcher__term-body font-mono text-xs">
          <pre className="branch-switcher__term-text">{terminalOutput}</pre>
        </div>

        {/* Interactive CLI input */}
        <form onSubmit={handleCommandSubmit} className="branch-switcher__term-input-row">
          <Terminal size={14} className="text-muted" />
          <span className="font-mono text-xs text-success">$</span>
          <input
            type="text"
            className="branch-switcher__term-input font-mono text-xs"
            placeholder={isBn ? 'কমান্ড টাইপ করুন (যেমন: git switch main, ls, git branch)...' : 'Type a command (e.g. git switch main, ls, git branch)...'}
            value={typedCommand}
            onChange={(e) => setTypedCommand(e.target.value)}
          />
          <button type="submit" className="branch-switcher__term-submit-btn text-xs">
            {isBn ? 'রান করুন' : 'Run'}
          </button>
        </form>
        {terminalError && (
          <div className="branch-switcher__term-error text-xs text-error font-mono">
            {terminalError}
          </div>
        )}
      </div>

      {/* The Key Insight / Aha! Moment */}
      <div className="branch-switcher__insight">
        <div className="branch-switcher__insight-head">
          <Sparkles size={16} className="text-warning flex-shrink-0" />
          <span className="font-bold text-sm">
            {isBn ? 'মূল উপলব্ধি (The "Aha!" Moment):' : 'The Key Insight (The "Aha!" Moment):'}
          </span>
        </div>
        <p className="body-sm text-on-surface">
          {currentBranch === 'main' ? (
            isBn ? (
              <>
                লক্ষ্য করুন, <code>git switch main</code> দেওয়ার সাথে সাথে বাম পাশের ফোল্ডারে <strong>feature1.txt</strong> মুহূর্তের মধ্যে উধাও হয়ে গেছে! গিট আপনার ফাইল ডিলিট করেনি—বরং গিট আপনার কম্পিউটারের ফোল্ডারের ফাইলগুলোকে <code>main</code> ব্রাঞ্চের স্ন্যাপশট অনুযায়ী সাজিয়ে দিয়েছে।
              </>
            ) : (
              <>
                Notice how running <code>git switch main</code> caused <strong>feature1.txt</strong> to instantly vanish from your computer folder on the left! Git didn't delete your code—it physically swapped the contents of your working directory to match the commit history tracked by <code>main</code>.
              </>
            )
          ) : (
            isBn ? (
              <>
                আবার <code>git switch feature</code> দেওয়ার সাথে সাথে <strong>feature1.txt</strong> ফোল্ডারে ফিরে এসেছে! কারণ এই ব্রাঞ্চের পয়েন্টার সেই স্ন্যাপশটকে নির্দেশ করছে যাতে এই ফাইলটি সংরক্ষিত ছিল।
              </>
            ) : (
              <>
                Switching to <code>feature</code> immediately restored <strong>feature1.txt</strong> to your folder! Because Git moved <code>HEAD</code> to point to the <code>feature</code> branch, bringing all its committed files back to life.
              </>
            )
          )}
        </p>
      </div>
    </div>
  );
};
