import React, { useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';
import { useTranslation } from '@/i18n/context';
import { ArrowRight, ArrowDown, RotateCcw, FileText, HardDrive, Cloud, Layers, Sparkles } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './GitStateVisualizer.css';

export interface GitStateVisualizerProps {
  initialStep?: number;
  initialState?: 'working' | 'staging' | 'local' | 'remote';
  className?: string;
}

interface StepInfo {
  command: string;
  action: { en: string; bn: string };
  explanation: { en: string; bn: string };
  workingFiles: string[];
  stagedFiles: string[];
  localCommits: string[];
  remoteCommits: string[];
}

const SIMULATION_STEPS: StepInfo[] = [
  {
    command: '# Clean working state',
    action: { en: '1. Modify Files', bn: '১. ফাইলে পরিবর্তন করুন' },
    explanation: {
      en: 'You are editing files in your editor. Git notices files are modified, but they are only on your filesystem in the Working Directory.',
      bn: 'আপনি এডিটরে ফাইলে পরিবর্তন করছেন। গিট পরিবর্তন শনাক্ত করে, কিন্তু এটি এখনও শুধু আপনার কম্পিউটারের ফাইল সিস্টেমে (Working Directory) রয়েছে।',
    },
    workingFiles: ['app.js (modified)', 'index.html (modified)'],
    stagedFiles: [],
    localCommits: ['c1: initial commit'],
    remoteCommits: ['c1: initial commit'],
  },
  {
    command: 'git add .',
    action: { en: '2. git add . (Stage)', bn: '২. git add . (স্টেজিং)' },
    explanation: {
      en: 'git add copies file snapshots into the Staging Area (index). This acts as a staging dock where you assemble and curate your upcoming commit.',
      bn: 'git add ফাইলের স্ন্যাপশট স্টেজিং এরিয়াতে (index) যুক্ত করে। এটি একটি প্রস্তুতি মঞ্চ যেখানে আপনি পরবর্তী কমিটের জন্য ফাইল নির্বাচন করেন।',
    },
    workingFiles: [],
    stagedFiles: ['app.js', 'index.html'],
    localCommits: ['c1: initial commit'],
    remoteCommits: ['c1: initial commit'],
  },
  {
    command: 'git commit -m "feat: user login"',
    action: { en: '3. git commit (Save)', bn: '৩. git commit (সংরক্ষণ)' },
    explanation: {
      en: 'git commit bundles all staged changes into a permanent cryptographic snapshot in your Local Repository (.git). The staging index is now clean.',
      bn: 'git commit স্টেজিং এরিয়ার সব পরিবর্তনকে একটি স্থায়ী স্ন্যাপশট হিসেবে লোকাল রিপোজিটরিতে (.git) সংরক্ষণ করে। স্টেজিং এরিয়া এখন ফাঁকা।',
    },
    workingFiles: [],
    stagedFiles: [],
    localCommits: ['c1: initial commit', 'c2: feat: user login (HEAD)'],
    remoteCommits: ['c1: initial commit'],
  },
  {
    command: 'git push origin main',
    action: { en: '4. git push (Sync)', bn: '৪. git push (সিঙ্ক)' },
    explanation: {
      en: 'git push uploads your new local commits to the Remote Repository (e.g. GitHub). Now your team and the remote server have your exact snapshot.',
      bn: 'git push আপনার লোকাল কমিটগুলোকে রিমোট রিপোজিটরিতে (যেমন GitHub) আপলোড করে। এখন আপনার রিমোট সার্ভার এবং সহকর্মীরা একই কোড দেখতে পাবে।',
    },
    workingFiles: [],
    stagedFiles: [],
    localCommits: ['c1: initial commit', 'c2: feat: user login (HEAD)'],
    remoteCommits: ['c1: initial commit', 'c2: feat: user login (main)'],
  },
];

export const GitStateVisualizer: React.FC<GitStateVisualizerProps> = ({
  initialStep = 0,
  initialState,
  className,
}) => {
  const { language } = useTranslation();
  const getStartingStep = () => {
    if (initialState === 'staging') return 1;
    if (initialState === 'local') return 2;
    if (initialState === 'remote') return 3;
    return initialStep;
  };
  const [currentStepIndex, setCurrentStepIndex] = useState(getStartingStep);

  const step = SIMULATION_STEPS[currentStepIndex];

  return (
    <div className={cn('gv-git-visualizer', className)}>
      <div className="gv-git-visualizer__header">
        <div className="gv-git-visualizer__title-row">
          <Layers size={18} className="gv-git-visualizer__icon" aria-hidden="true" />
          <h3 className="title-sm gv-git-visualizer__title">
            {language === 'bn' ? 'গিটের ৩টি মূল স্তর ও রিমোট সিঙ্ক মেন্টাল মডেল' : "Git's Three Main Areas & Remote Sync Mental Model"}
          </h3>
        </div>
        <div className="gv-git-visualizer__badge-row">
          <Badge variant="primary" size="sm">Interactive Model</Badge>
        </div>
      </div>

      {/* 4 Environment Columns */}
      <div className="gv-git-visualizer__stages">
        {/* Stage 1: Working Directory */}
        <div className={cn('gv-stage', currentStepIndex === 0 && 'gv-stage--active')}>
          <div className="gv-stage__header">
            <FileText size={16} />
            <span className="label-sm">Working Directory</span>
          </div>
          <div className="gv-stage__body">
            <span className="gv-stage__sublabel caption">Files on local disk</span>
            <div className="gv-stage__items">
              {step.workingFiles.length > 0 ? (
                step.workingFiles.map((file, idx) => (
                  <div key={idx} className="gv-stage__item gv-stage__item--modified font-mono">
                    {file}
                  </div>
                ))
              ) : (
                <span className="gv-stage__empty caption">Clean working tree</span>
              )}
            </div>
          </div>
        </div>

        {/* Transition 1 -> 2 */}
        <div className="gv-transition">
          <div className="gv-transition__command font-mono">git add</div>
          <ArrowRight className="gv-transition__arrow-h" size={16} />
          <ArrowDown className="gv-transition__arrow-v" size={16} />
        </div>

        {/* Stage 2: Staging Area */}
        <div className={cn('gv-stage', currentStepIndex === 1 && 'gv-stage--active')}>
          <div className="gv-stage__header">
            <Layers size={16} />
            <span className="label-sm">Staging Area (Index)</span>
          </div>
          <div className="gv-stage__body">
            <span className="gv-stage__sublabel caption">Ready for commit</span>
            <div className="gv-stage__items">
              {step.stagedFiles.length > 0 ? (
                step.stagedFiles.map((file, idx) => (
                  <div key={idx} className="gv-stage__item gv-stage__item--staged font-mono">
                    {file}
                  </div>
                ))
              ) : (
                <span className="gv-stage__empty caption">Empty staging index</span>
              )}
            </div>
          </div>
        </div>

        {/* Transition 2 -> 3 */}
        <div className="gv-transition">
          <div className="gv-transition__command font-mono">git commit</div>
          <ArrowRight className="gv-transition__arrow-h" size={16} />
          <ArrowDown className="gv-transition__arrow-v" size={16} />
        </div>

        {/* Stage 3: Local Repository */}
        <div className={cn('gv-stage', currentStepIndex === 2 && 'gv-stage--active')}>
          <div className="gv-stage__header">
            <HardDrive size={16} />
            <span className="label-sm">Local Repo (.git)</span>
          </div>
          <div className="gv-stage__body">
            <span className="gv-stage__sublabel caption">Permanent snapshot history</span>
            <div className="gv-stage__items">
              {step.localCommits.map((commit, idx) => (
                <div key={idx} className="gv-stage__item gv-stage__item--commit font-mono">
                  {commit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transition 3 -> 4 */}
        <div className="gv-transition">
          <div className="gv-transition__command font-mono">git push</div>
          <ArrowRight className="gv-transition__arrow-h" size={16} />
          <ArrowDown className="gv-transition__arrow-v" size={16} />
        </div>

        {/* Stage 4: Remote Repository */}
        <div className={cn('gv-stage', currentStepIndex === 3 && 'gv-stage--active')}>
          <div className="gv-stage__header">
            <Cloud size={16} />
            <span className="label-sm">Remote (GitHub)</span>
          </div>
          <div className="gv-stage__body">
            <span className="gv-stage__sublabel caption">Shared origin replica</span>
            <div className="gv-stage__items">
              {step.remoteCommits.map((commit, idx) => (
                <div key={idx} className="gv-stage__item gv-stage__item--remote font-mono">
                  {commit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="gv-git-visualizer__explanation">
        <div className="gv-git-visualizer__active-command font-mono">
          <Sparkles size={14} />
          <span>{step.command}</span>
        </div>
        <p className="gv-git-visualizer__explanation-text body-sm">
          {language === 'bn' ? step.explanation.bn : step.explanation.en}
        </p>
      </div>

      {/* Step Controls */}
      <div className="gv-git-visualizer__controls">
        <div className="gv-git-visualizer__buttons">
          {SIMULATION_STEPS.map((s, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={currentStepIndex === idx ? 'primary' : 'outlined'}
              onClick={() => setCurrentStepIndex(idx)}
            >
              {language === 'bn' ? s.action.bn : s.action.en}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          variant="tertiary"
          iconLeft={<RotateCcw size={14} />}
          onClick={() => setCurrentStepIndex(0)}
          aria-label="Reset simulation"
        >
          {language === 'bn' ? 'রিসেট' : 'Reset'}
        </Button>
      </div>
    </div>
  );
};
