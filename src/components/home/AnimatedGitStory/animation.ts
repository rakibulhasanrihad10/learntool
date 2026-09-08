/**
 * Timing & configuration for the 5-scene Animated Git Story
 * Total runtime: 17 seconds (3s + 4s + 4s + 3s + 3s)
 */

export const SCENE_DURATIONS: readonly number[] = [3000, 4000, 4000, 3000, 3000];

export const TOTAL_SCENES = SCENE_DURATIONS.length;

export type SceneId = 0 | 1 | 2 | 3 | 4;

export interface SceneMeta {
  id: SceneId;
  durationMs: number;
  badgeKey: 'scene1' | 'scene2' | 'scene3' | 'scene4' | 'scene5';
}

export const SCENES_META: readonly SceneMeta[] = [
  { id: 0, durationMs: SCENE_DURATIONS[0], badgeKey: 'scene1' },
  { id: 1, durationMs: SCENE_DURATIONS[1], badgeKey: 'scene2' },
  { id: 2, durationMs: SCENE_DURATIONS[2], badgeKey: 'scene3' },
  { id: 3, durationMs: SCENE_DURATIONS[3], badgeKey: 'scene4' },
  { id: 4, durationMs: SCENE_DURATIONS[4], badgeKey: 'scene5' },
];
