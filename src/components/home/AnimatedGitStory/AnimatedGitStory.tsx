import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';
import { useTranslation } from '@/i18n/context';
import { SCENE_DURATIONS, TOTAL_SCENES, SceneId } from './animation';
import { SceneProject } from './scenes/SceneProject';
import { SceneGit } from './scenes/SceneGit';
import { SceneBranches } from './scenes/SceneBranches';
import { SceneGitHub } from './scenes/SceneGitHub';
import { SceneSummary } from './scenes/SceneSummary';
import './AnimatedGitStory.css';

export const AnimatedGitStory: React.FC = () => {
  const { t } = useTranslation();
  const storyText = t.home.story;

  // Reduced motion preference detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const [currentScene, setCurrentScene] = useState<SceneId>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(!prefersReducedMotion);
  const timerRef = useRef<number | null>(null);

  const clearStoryTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Advances to the next scene or loops back to 0
  const advanceScene = useCallback(() => {
    setCurrentScene((prev) => ((prev + 1) % TOTAL_SCENES) as SceneId);
  }, []);

  // Auto-play schedule based on individual scene durations
  useEffect(() => {
    clearStoryTimer();

    if (!isPlaying || prefersReducedMotion) {
      return;
    }

    const duration = SCENE_DURATIONS[currentScene];
    timerRef.current = window.setTimeout(() => {
      advanceScene();
    }, duration);

    return () => clearStoryTimer();
  }, [currentScene, isPlaying, prefersReducedMotion, clearStoryTimer, advanceScene]);

  // Manual scene selection
  const handleSelectScene = (index: number) => {
    clearStoryTimer();
    setIsPlaying(false);
    setCurrentScene(index as SceneId);
  };

  // Play / Pause toggle
  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Replay from start
  const handleReplay = () => {
    clearStoryTimer();
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const sceneTitles = [
    storyText.scene1.badge,
    storyText.scene2.badge,
    storyText.scene3.badge,
    storyText.scene4.badge,
    storyText.scene5.badge,
  ];

  return (
    <section className="animated-git-story" aria-label="Interactive Visual Story of Git and GitHub">
      {/* Header Banner */}
      <div className="animated-git-story__header">
        <Badge variant="primary" size="sm" className="animated-git-story__badge">
          <Sparkles size={14} aria-hidden="true" />
          <span>{storyText.badge}</span>
        </Badge>
        <h2 className="title-md animated-git-story__headline">
          {storyText.headline}
        </h2>
      </div>

      {/* Main Stage Frame */}
      <div className="animated-git-story__frame">
        {/* Active Scene Display */}
        <div className="animated-git-story__stage">
          {currentScene === 0 && <SceneProject />}
          {currentScene === 1 && <SceneGit />}
          {currentScene === 2 && <SceneBranches />}
          {currentScene === 3 && <SceneGitHub />}
          {currentScene === 4 && <SceneSummary />}
        </div>

        {/* Screen Reader Live Region */}
        <div className="sr-only" aria-live="polite">
          {storyText.sceneLabel} {currentScene + 1}: {sceneTitles[currentScene]}
        </div>

        {/* Accessibility notification for reduced motion */}
        {prefersReducedMotion && (
          <p className="animated-git-story__reduced-motion-notice caption">
            {storyText.reducedMotionNote}
          </p>
        )}

        {/* Bottom Navigation & Controls Toolbar */}
        <div className="animated-git-story__toolbar">
          {/* Scene Switcher Buttons */}
          <div className="animated-git-story__scenes-nav" role="tablist" aria-label="Story Scenes">
            {SCENE_DURATIONS.map((_, index) => {
              const isActive = currentScene === index;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-current={isActive ? 'step' : undefined}
                  className={`animated-git-story__scene-btn ${
                    isActive ? 'animated-git-story__scene-btn--active' : ''
                  }`}
                  onClick={() => handleSelectScene(index)}
                  title={`${storyText.sceneLabel} ${index + 1}: ${sceneTitles[index]}`}
                >
                  <span className="animated-git-story__scene-num">{index + 1}</span>
                  <span className="animated-git-story__scene-label">{sceneTitles[index]}</span>
                  {isActive && isPlaying && !prefersReducedMotion && (
                    <span
                      className="animated-git-story__scene-progress"
                      style={{ animationDuration: `${SCENE_DURATIONS[index]}ms` }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Playback Controls */}
          <div className="animated-git-story__controls">
            {!prefersReducedMotion && (
              <Button
                variant="icon"
                size="sm"
                className="animated-git-story__ctrl-btn"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? storyText.pause : storyText.play}
                title={isPlaying ? storyText.pause : storyText.play}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </Button>
            )}

            <Button
              variant="icon"
              size="sm"
              className="animated-git-story__ctrl-btn"
              onClick={handleReplay}
              aria-label={storyText.replay}
              title={storyText.replay}
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
