import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Terminal,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Hash,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import './RebaseAnimation.css';

interface RebaseAnimationProps {
  title?: string;
  titleBn?: string;
}

interface SceneInfo {
  id: number;
  title: string;
  titleBn: string;
  durationMs: number;
  command?: string;
  headline: string;
  headlineBn: string;
  description: string;
  descriptionBn: string;
}

const SCENES: SceneInfo[] = [
  {
    id: 1,
    title: 'Feature Starts',
    titleBn: 'ফিচার শাখা তৈরি',
    durationMs: 3200,
    headline: 'Your feature starts from commit A3',
    headlineBn: 'A3 কমিট থেকে আপনার ফিচার ব্রাঞ্চ শুরু হয়েছিল',
    description: 'You created feature commits B1 and B2 on top of main commit A3.',
    descriptionBn: 'main-এর A3 কমিটের ওপর ভিত্তি করে আপনি B1 ও B2 কমিট তৈরি করেছেন।',
  },
  {
    id: 2,
    title: 'Main Advances',
    titleBn: 'মেইন ব্রাঞ্চের অগ্রগতি',
    durationMs: 3200,
    headline: 'Meanwhile, main moved forward with A4 and A5',
    headlineBn: 'এর মধ্যে সহকর্মীরা main-এ নতুন কমিট A4 ও A5 যুক্ত করেছেন',
    description: 'Your teammates pushed new work to main. Your feature branch is now behind.',
    descriptionBn: 'টিমের অন্যরা কাজ শেষ করে main-এ পুশ করেছেন। ফলে আপনার ফিচার ব্রাঞ্চটি পিছিয়ে পড়েছে।',
  },
  {
    id: 3,
    title: 'Run Rebase',
    titleBn: 'রিবেস কমান্ড চালানো',
    durationMs: 2600,
    command: 'git rebase main',
    headline: 'Run "git rebase main" from your feature branch',
    headlineBn: 'ফিচার ব্রাঞ্চে দাঁড়িয়ে "git rebase main" কমান্ডটি চালান',
    description: 'Concept: "Extract my feature changes and replay them on top of the newest main."',
    descriptionBn: 'মূল বার্তা: "আমার ফিচারের কাজগুলো আলাদা করে নিয়ে মেইনের সর্বশেষ মাথায় পুনরায় প্রয়োগ করো।"',
  },
  {
    id: 4,
    title: 'Replay B1 ➔ B1\'',
    titleBn: 'B1 ➔ B1\' পুনর্নির্মাণ',
    durationMs: 4000,
    headline: 'Parent changed to A5 ➔ Brand-new commit B1\' is born',
    headlineBn: 'প্যারেন্ট বদলে A5 হলো ➔ সম্পূর্ণ নতুন কমিট B1\' জন্ম নিল',
    description: 'Git does NOT drag B1. It extracts B1\'s diff, replays it onto A5, and creates B1\' with a new hash!',
    descriptionBn: 'গিট B1-কে টেনে সরায় না। B1-এর পরিবর্তন নিয়ে A5-এর ওপর প্রয়োগ করে নতুন হ্যাশসহ B1\' তৈরি করে!',
  },
  {
    id: 5,
    title: 'Replay B2 ➔ B2\'',
    titleBn: 'B2 ➔ B2\' পুনর্নির্মাণ',
    durationMs: 3600,
    headline: 'Parent changed to B1\' ➔ Brand-new commit B2\' is born',
    headlineBn: 'প্যারেন্ট বদলে B1\' হলো ➔ নতুন হ্যাশসহ কমিট B2\' তৈরি হলো',
    description: 'Next, B2\'s changes are replayed on top of B1\'. B2\' receives its own new cryptographic hash.',
    descriptionBn: 'এরপর B2-এর পরিবর্তনগুলো B1\'-এর ওপর রি-প্লে করা হয়। B2\'-ও পায় সম্পূর্ণ নতুন ডিজিটাল হ্যাশ।',
  },
  {
    id: 6,
    title: 'The Mental Model',
    titleBn: 'সুবর্ণ শিক্ষণীয় মডেল',
    durationMs: 4500,
    headline: 'Rebase doesn\'t move your commits. It recreates them on a new parent.',
    headlineBn: 'রিবেস পুরোনো কমিটকে সরায় না। এটি নতুন প্যারেন্টের ওপর তাদের পুনর্নির্মাণ করে।',
    description: 'Golden Rule: Change the parent ➔ recreate the commit ➔ get a new hash.',
    descriptionBn: 'সুবর্ণ সূত্র: প্যারেন্ট পরিবর্তন ➔ কমিট পুনর্নির্মাণ ➔ ব্র্যান্ড-নিউ হ্যাশ লাভ।',
  },
];

export const RebaseAnimation: React.FC<RebaseAnimationProps> = ({ title, titleBn }) => {
  const { language } = useTranslation();
  const isBn = language === 'bn';

  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedAtRef = useRef<number>(0);

  const scene = SCENES[currentScene - 1];

  // Advance scene helper
  const goToNextScene = useCallback(() => {
    setCurrentScene((prev) => (prev < SCENES.length ? prev + 1 : 1));
    setProgress(0);
    startTimeRef.current = Date.now();
    pausedAtRef.current = 0;
  }, []);

  const goToPrevScene = useCallback(() => {
    setCurrentScene((prev) => (prev > 1 ? prev - 1 : SCENES.length));
    setProgress(0);
    startTimeRef.current = Date.now();
    pausedAtRef.current = 0;
  }, []);

  const selectScene = (sceneNum: number) => {
    setCurrentScene(sceneNum);
    setProgress(0);
    startTimeRef.current = Date.now();
    pausedAtRef.current = 0;
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      pausedAtRef.current = Date.now() - startTimeRef.current;
      setIsPlaying(false);
    } else {
      startTimeRef.current = Date.now() - pausedAtRef.current;
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setCurrentScene(1);
    setProgress(0);
    startTimeRef.current = Date.now();
    pausedAtRef.current = 0;
    setIsPlaying(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if container is active/focused or hovered
      if (!containerRef.current?.contains(document.activeElement)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        goToNextScene();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        goToPrevScene();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextScene, goToPrevScene, isPlaying]);

  // Autoplay ticker loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now() - pausedAtRef.current;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const targetDuration = scene.durationMs;
      const currentPct = Math.min(100, (elapsed / targetDuration) * 100);
      setProgress(currentPct);

      if (elapsed >= targetDuration) {
        goToNextScene();
      } else {
        timerRef.current = requestAnimationFrame(tick);
      }
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isPlaying, currentScene, scene.durationMs, goToNextScene]);

  return (
    <div
      ref={containerRef}
      className="rebase-anim"
      tabIndex={0}
      role="region"
      aria-label={isBn ? 'ইন্টারেক্টিভ রিবেস ভিজ্যুয়ালাইজার' : 'Interactive Rebase Visualizer'}
    >
      {/* Header bar */}
      <div className="rebase-anim__header">
        <div className="rebase-anim__title-group">
          <div className="rebase-anim__icon-circle">
            <GitBranch size={18} />
          </div>
          <div>
            <h4 className="rebase-anim__title">
              {isBn
                ? (titleBn || 'ইন্টারেক্টিভ রিবেস অ্যানিমেশন: পরিবর্তন রি-প্লে ও নতুন প্যারেন্ট মডেল')
                : (title || 'Interactive Rebase Visualizer: The Replay & New Parent Model')}
            </h4>
            <p className="rebase-anim__subtitle">
              {isBn
                ? 'দেখুন কীভাবে রিবেস পুরোনো কমিটকে না সরিয়ে নতুন প্যারেন্টের ওপর নতুন হ্যাশসহ পুনর্নির্মাণ করে'
                : 'Watch how rebase recreates your commits on a new parent rather than moving them'}
            </p>
          </div>
        </div>

        <div className="rebase-anim__badge">
          <Sparkles size={13} />
          <span>{isBn ? `দৃশ্য ${currentScene} / ${SCENES.length}` : `Scene ${currentScene} of ${SCENES.length}`}</span>
        </div>
      </div>

      {/* Main Canvas with Graph */}
      <div className="rebase-anim__canvas-card">
        {/* Top Status & Command Banner */}
        <div className="rebase-anim__banner">
          {scene.command ? (
            <div className="rebase-anim__cmd-pill animate-pulse">
              <Terminal size={14} />
              <code>{scene.command}</code>
            </div>
          ) : (
            <span className="rebase-anim__scene-tag">
              {isBn ? scene.titleBn : scene.title}
            </span>
          )}

          <div className="rebase-anim__headline-text">
            <strong>{isBn ? scene.headlineBn : scene.headline}</strong>
          </div>
        </div>

        {/* SVG Commit Graph Visualizer */}
        <div className="rebase-anim__svg-wrap">
          <svg
            className="rebase-anim__svg"
            viewBox="0 0 620 164"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              <linearGradient id="featureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              <linearGradient id="rebaseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* --- BRANCH LABELS --- */}
            <g className="rebase-anim__branch-labels">
              <rect x="12" y="18" width="54" height="24" rx="4" fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth="1" />
              <text x="39" y="34" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold">main</text>

              {/* Feature branch label moves dynamically */}
              {currentScene <= 3 && (
                <g className="rebase-anim__feature-label">
                  <rect x="195" y="106" width="58" height="24" rx="4" fill="rgba(139, 92, 246, 0.18)" stroke="#8b5cf6" strokeWidth="1" />
                  <text x="224" y="122" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="bold">feature</text>
                </g>
              )}
              {currentScene >= 4 && (
                <g className="rebase-anim__feature-rebased-label">
                  <rect
                    x={currentScene === 4 ? 470 : 540}
                    y="18"
                    width="62"
                    height="24"
                    rx="4"
                    fill="rgba(16, 185, 129, 0.2)"
                    stroke="#10b981"
                    strokeWidth="1.2"
                  />
                  <text
                    x={currentScene === 4 ? 501 : 571}
                    y="34"
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    feature
                  </text>
                </g>
              )}
            </g>

            {/* --- MAIN BRANCH CONNECTING LINE --- */}
            {/* A1 to A3 */}
            <path
              d="M 100 30 L 240 30"
              stroke="#3b82f6"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* A3 to A5 (Visible from Scene 2 onwards) */}
            {currentScene >= 2 && (
              <path
                d="M 240 30 L 380 30"
                stroke="#06b6d4"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="rebase-anim__edge-draw"
              />
            )}

            {/* --- OLD FEATURE BRANCH BRANCHING LINE --- */}
            {/* From A3 (240, 30) curving down to B1 (280, 118) */}
            <path
              d="M 240 30 C 255 30, 260 118, 280 118"
              stroke={currentScene >= 4 ? '#64748b' : '#8b5cf6'}
              strokeWidth={currentScene >= 4 ? 2 : 3}
              strokeDasharray={currentScene >= 4 ? '4 4' : 'none'}
              opacity={currentScene >= 4 ? 0.35 : 0.85}
              fill="none"
              strokeLinecap="round"
            />

            {/* B1 (280, 118) to B2 (350, 118) */}
            <path
              d="M 280 118 L 350 118"
              stroke={currentScene >= 5 ? '#64748b' : '#8b5cf6'}
              strokeWidth={currentScene >= 5 ? 2 : 3}
              strokeDasharray={currentScene >= 5 ? '4 4' : 'none'}
              opacity={currentScene >= 5 ? 0.35 : 0.85}
              fill="none"
              strokeLinecap="round"
            />

            {/* --- REPLAY PULSE CURVES (When Replaying B1 ➔ B1' and B2 ➔ B2') --- */}
            {currentScene === 4 && (
              <g className="rebase-anim__replay-pulse">
                <path
                  d="M 280 100 C 290 45, 390 85, 440 40"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  fill="none"
                  className="rebase-anim__dash-flow"
                />
                <circle cx="360" cy="65" r="4" fill="#10b981" filter="url(#glowEffect)" />
                <text x="365" y="78" fill="#10b981" fontSize="11" fontWeight="bold">
                  replaying B1 diff onto A5...
                </text>
              </g>
            )}

            {currentScene === 5 && (
              <g className="rebase-anim__replay-pulse">
                <path
                  d="M 350 100 C 370 50, 460 75, 510 40"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  fill="none"
                  className="rebase-anim__dash-flow"
                />
                <circle cx="430" cy="70" r="4" fill="#10b981" filter="url(#glowEffect)" />
                <text x="435" y="82" fill="#10b981" fontSize="11" fontWeight="bold">
                  replaying B2 diff onto B1&apos;...
                </text>
              </g>
            )}

            {/* --- REBASED STRAIGHT CONNECTION LINES --- */}
            {/* A5 (380, 30) to B1' (450, 30) */}
            {currentScene >= 4 && (
              <path
                d="M 380 30 L 450 30"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="rebase-anim__edge-draw"
              />
            )}

            {/* B1' (450, 30) to B2' (520, 30) */}
            {currentScene >= 5 && (
              <path
                d="M 450 30 L 520 30"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="rebase-anim__edge-draw"
              />
            )}

            {/* ================= COMMIT NODES ================= */}

            {/* NODE A1 */}
            <g transform="translate(100, 30)">
              <circle r="15" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
              <text y="4" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">A1</text>
              <text y="26" textAnchor="middle" fill="#94a3b8" fontSize="9">Floor 1</text>
            </g>

            {/* NODE A2 */}
            <g transform="translate(170, 30)">
              <circle r="15" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
              <text y="4" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">A2</text>
              <text y="26" textAnchor="middle" fill="#94a3b8" fontSize="9">Floor 2</text>
            </g>

            {/* NODE A3 (Fork Point) */}
            <g transform="translate(240, 30)">
              <circle r="16" fill="#1e293b" stroke="#3b82f6" strokeWidth={currentScene <= 2 ? 3 : 2} />
              <text y="4" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">A3</text>
              <text y="26" textAnchor="middle" fill="#94a3b8" fontSize="9">Floor 3</text>
            </g>

            {/* NODE A4 (Appears in Scene 2) */}
            {currentScene >= 2 && (
              <g transform="translate(310, 30)" className="rebase-anim__node-enter">
                <circle r="15" fill="#1e293b" stroke="#06b6d4" strokeWidth="2.5" />
                <text y="4" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">A4</text>
                <text y="26" textAnchor="middle" fill="#06b6d4" fontSize="9">Floor 4</text>
              </g>
            )}

            {/* NODE A5 (Appears in Scene 2, becomes the NEW BASE) */}
            {currentScene >= 2 && (
              <g transform="translate(380, 30)" className="rebase-anim__node-enter">
                <circle
                  r="17"
                  fill="#1e293b"
                  stroke={currentScene >= 3 ? '#10b981' : '#06b6d4'}
                  strokeWidth={currentScene >= 3 ? 3 : 2.5}
                  filter={currentScene >= 3 ? 'url(#glowEffect)' : 'none'}
                />
                <text y="4" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">A5</text>
                <text y="26" textAnchor="middle" fill={currentScene >= 3 ? '#34d399' : '#06b6d4'} fontSize="9" fontWeight="bold">
                  {currentScene >= 3 ? (isBn ? 'নতুন বেস' : 'New Base') : 'Floor 5'}
                </text>
              </g>
            )}

            {/* OLD NODE B1 (Feature) */}
            <g
              transform="translate(280, 118)"
              opacity={currentScene >= 4 ? 0.35 : 1}
              className={currentScene === 4 ? 'rebase-anim__node-source' : ''}
            >
              <circle
                r="15"
                fill="#1e293b"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeDasharray={currentScene >= 4 ? '3 3' : 'none'}
              />
              <text y="4" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">B1</text>
              <text y="25" textAnchor="middle" fill="#c4b5fd" fontSize="9">
                {currentScene >= 4 ? '(old)' : 'Room 1'}
              </text>
              <text y="36" textAnchor="middle" fill="#a78bfa" fontSize="8" fontFamily="monospace">
                7a3f91c
              </text>
            </g>

            {/* OLD NODE B2 (Feature) */}
            <g
              transform="translate(350, 118)"
              opacity={currentScene >= 5 ? 0.35 : 1}
              className={currentScene === 5 ? 'rebase-anim__node-source' : ''}
            >
              <circle
                r="15"
                fill="#1e293b"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeDasharray={currentScene >= 5 ? '3 3' : 'none'}
              />
              <text y="4" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">B2</text>
              <text y="25" textAnchor="middle" fill="#c4b5fd" fontSize="9">
                {currentScene >= 5 ? '(old)' : 'Room 2'}
              </text>
              <text y="36" textAnchor="middle" fill="#a78bfa" fontSize="8" fontFamily="monospace">
                4bd21fa
              </text>
            </g>

            {/* RECREATED NODE B1' (Appears in Scene 4 onwards) */}
            {currentScene >= 4 && (
              <g transform="translate(450, 30)" className="rebase-anim__node-recreated">
                <circle
                  r="17"
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth="3"
                  filter={currentScene === 4 ? 'url(#glowEffect)' : 'none'}
                />
                <text y="4" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="bold">B1'</text>
                <text y="26" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">
                  {isBn ? 'নতুন কমিট' : 'Recreated'}
                </text>
                <text y="38" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="monospace">
                  c82e4d1
                </text>
              </g>
            )}

            {/* RECREATED NODE B2' (Appears in Scene 5 onwards) */}
            {currentScene >= 5 && (
              <g transform="translate(520, 30)" className="rebase-anim__node-recreated">
                <circle
                  r="17"
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth="3"
                  filter={currentScene === 5 ? 'url(#glowEffect)' : 'none'}
                />
                <text y="4" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="bold">B2'</text>
                <text y="26" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">
                  {isBn ? 'নতুন কমিট' : 'Recreated'}
                </text>
                <text y="38" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="monospace">
                  e91ac73
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* --- DYNAMIC EDUCATIONAL INSPECTION CARD --- */}
        <div className="rebase-anim__inspection">
          {currentScene <= 3 && (
            <div className="rebase-anim__info-box">
              <div className="rebase-anim__info-desc body-sm">
                {isBn ? scene.descriptionBn : scene.description}
              </div>
              <div className="rebase-anim__hash-row">
                <span className="rebase-anim__pill">
                  <strong>B1</strong> {isBn ? 'প্যারেন্ট:' : 'Parent:'} <code>A3</code> | {isBn ? 'হ্যাশ:' : 'Hash:'} <code>7a3f91c</code>
                </span>
                <span className="rebase-anim__pill">
                  <strong>B2</strong> {isBn ? 'প্যারেন্ট:' : 'Parent:'} <code>B1</code> | {isBn ? 'হ্যাশ:' : 'Hash:'} <code>4bd21fa</code>
                </span>
              </div>
            </div>
          )}

          {currentScene === 4 && (
            <div className="rebase-anim__comparison-card animate-fade-in">
              <div className="rebase-anim__comp-header">
                <RefreshCw size={14} className="rebase-anim__spin-icon" />
                <span>{isBn ? 'B1 পরিবর্তনের রি-প্লে ও হ্যাশ পরিবর্তন' : 'Replaying B1 Changes & Hash Transformation'}</span>
              </div>

              <div className="rebase-anim__comp-grid">
                <div className="rebase-anim__comp-col old">
                  <span className="rebase-anim__comp-tag">{isBn ? 'মূল কমিট (Original)' : 'Original Commit'}</span>
                  <div className="rebase-anim__comp-name">Commit B1</div>
                  <div className="rebase-anim__comp-detail">{isBn ? 'প্যারেন্ট:' : 'Parent:'} <code>A3</code></div>
                  <div className="rebase-anim__comp-detail hash">
                    <Hash size={12} /> <code>7a3f91c</code>
                  </div>
                </div>

                <div className="rebase-anim__comp-arrow">
                  <ArrowRight size={20} />
                  <span className="body-xs">{isBn ? 'পরিবর্তন প্রয়োগ' : 'diff applied'}</span>
                </div>

                <div className="rebase-anim__comp-col new">
                  <span className="rebase-anim__comp-tag new-badge">{isBn ? 'পুনর্নির্মিত (Recreated)' : 'Recreated Commit'}</span>
                  <div className="rebase-anim__comp-name">Commit B1'</div>
                  <div className="rebase-anim__comp-detail highlight">
                    {isBn ? 'নতুন প্যারেন্ট:' : 'New Parent:'} <code>A5</code>
                  </div>
                  <div className="rebase-anim__comp-detail hash highlight">
                    <Hash size={12} /> <code>c82e4d1</code>
                  </div>
                </div>
              </div>

              <div className="rebase-anim__comp-footer body-xs">
                💡 {isBn
                  ? 'যেহেতু প্যারেন্ট A3 থেকে বদলে A5 হয়েছে, তাই গিট সম্পূর্ণ নতুন হ্যাশ c82e4d1 তৈরি করেছে!'
                  : 'Because the parent changed from A3 to A5, Git calculated a brand-new cryptographic hash c82e4d1!'}
              </div>
            </div>
          )}

          {currentScene === 5 && (
            <div className="rebase-anim__comparison-card animate-fade-in">
              <div className="rebase-anim__comp-header">
                <RefreshCw size={14} className="rebase-anim__spin-icon" />
                <span>{isBn ? 'B2 পরিবর্তনের রি-প্লে ও নতুন প্যারেন্ট চেইন' : 'Replaying B2 Changes & Parent Chaining'}</span>
              </div>

              <div className="rebase-anim__comp-grid">
                <div className="rebase-anim__comp-col old">
                  <span className="rebase-anim__comp-tag">{isBn ? 'মূল কমিট' : 'Original Commit'}</span>
                  <div className="rebase-anim__comp-name">Commit B2</div>
                  <div className="rebase-anim__comp-detail">{isBn ? 'প্যারেন্ট:' : 'Parent:'} <code>B1</code></div>
                  <div className="rebase-anim__comp-detail hash">
                    <Hash size={12} /> <code>4bd21fa</code>
                  </div>
                </div>

                <div className="rebase-anim__comp-arrow">
                  <ArrowRight size={20} />
                  <span className="body-xs">{isBn ? 'B1\'-এর ওপর প্রয়োগ' : 'applied to B1\''}</span>
                </div>

                <div className="rebase-anim__comp-col new">
                  <span className="rebase-anim__comp-tag new-badge">{isBn ? 'পুনর্নির্মিত' : 'Recreated Commit'}</span>
                  <div className="rebase-anim__comp-name">Commit B2'</div>
                  <div className="rebase-anim__comp-detail highlight">
                    {isBn ? 'নতুন প্যারেন্ট:' : 'New Parent:'} <code>B1'</code>
                  </div>
                  <div className="rebase-anim__comp-detail hash highlight">
                    <Hash size={12} /> <code>e91ac73</code>
                  </div>
                </div>
              </div>

              <div className="rebase-anim__comp-footer body-xs">
                💡 {isBn
                  ? 'B2\'-এর নতুন প্যারেন্ট এখন B1\'। চেইনের প্যারেন্ট পরিবর্তিত হওয়ায় B2\'-এর হ্যাশও পরিবর্তিত হয়েছে!'
                  : 'B2\' now points backward to B1\' as its parent, receiving its own new cryptographic hash!'}
              </div>
            </div>
          )}

          {currentScene === 6 && (
            <div className="rebase-anim__takeaway-card animate-fade-in">
              <div className="rebase-anim__takeaway-badge">
                <CheckCircle2 size={16} />
                <span>{isBn ? 'সুবর্ণ শিক্ষণীয় সূত্র (Core Mental Model)' : 'The Golden Mental Model'}</span>
              </div>

              <div className="rebase-anim__takeaway-formula">
                <div className="rebase-anim__step-pill">
                  <span className="rebase-anim__step-num">1</span>
                  <span>{isBn ? 'নতুন প্যারেন্ট (A5)' : 'New Parent (A5)'}</span>
                </div>
                <ArrowRight size={16} className="text-muted" />
                <div className="rebase-anim__step-pill active">
                  <span className="rebase-anim__step-num">2</span>
                  <span>{isBn ? 'কমিট পুনর্নির্মাণ (B1\', B2\')' : 'Recreated Commits (B1\', B2\')'}</span>
                </div>
                <ArrowRight size={16} className="text-muted" />
                <div className="rebase-anim__step-pill active-green">
                  <span className="rebase-anim__step-num">3</span>
                  <span>{isBn ? 'নতুন হ্যাশ (c82e4d1...)' : 'New Hashes (c82e4d1...)'}</span>
                </div>
              </div>

              <p className="rebase-anim__takeaway-quote">
                &ldquo;{isBn
                  ? 'রিবেস আপনার কমিটগুলোকে সরায় না। এটি নতুন বেসের ওপর পরিবর্তনগুলো পুনরায় তৈরি করে নতুন হ্যাশ উপহার দেয়।'
                  : 'Rebase doesn\'t move your existing commits. It recreates your commits on a new parent, which gives them new commit hashes.'}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="rebase-anim__progress-track" aria-hidden="true">
          <div
            className="rebase-anim__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Playback Controls & Scene Stepper */}
      <div className="rebase-anim__controls">
        <div className="rebase-anim__playback-btns">
          <button
            type="button"
            className="rebase-anim__btn-icon"
            onClick={handleTogglePlay}
            title={isPlaying ? (isBn ? 'বিরতি (Space)' : 'Pause (Space)') : (isBn ? 'চালান (Space)' : 'Play (Space)')}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} />}
          </button>

          <button
            type="button"
            className="rebase-anim__btn-icon"
            onClick={handleRestart}
            title={isBn ? 'পুনরায় শুরু করুন (R)' : 'Restart from Scene 1 (R)'}
            aria-label="Restart"
          >
            <RotateCcw size={16} />
          </button>

          <div className="rebase-anim__step-nav">
            <button
              type="button"
              className="rebase-anim__btn-nav"
              onClick={goToPrevScene}
              title={isBn ? 'আগের দৃশ্য (Left Arrow)' : 'Previous Scene (Left Arrow)'}
            >
              <ChevronLeft size={16} />
              <span>{isBn ? 'আগে' : 'Prev'}</span>
            </button>
            <button
              type="button"
              className="rebase-anim__btn-nav"
              onClick={goToNextScene}
              title={isBn ? 'পরের দৃশ্য (Right Arrow)' : 'Next Scene (Right Arrow)'}
            >
              <span>{isBn ? 'পরে' : 'Next'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Scene Indicator Dots / Stepper */}
        <div className="rebase-anim__stepper" role="tablist" aria-label="Scenes">
          {SCENES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={currentScene === s.id}
              className={`rebase-anim__dot ${currentScene === s.id ? 'is-active' : ''}`}
              onClick={() => selectScene(s.id)}
              title={`${isBn ? s.titleBn : s.title} (${s.id}/${SCENES.length})`}
            >
              <span className="rebase-anim__dot-num">{s.id}</span>
              <span className="rebase-anim__dot-label">
                {isBn ? s.titleBn : s.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
