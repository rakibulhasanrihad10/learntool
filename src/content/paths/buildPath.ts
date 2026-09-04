/**
 * Shared builder for learning path data files — keeps step definitions
 * compact while guaranteeing stable ids (`<pathId>.<slug>`), order,
 * and namespaced prerequisites.
 */
import { LearningPathStep, LearningPathStepType } from '@/types/learningPath';

export interface StepDef {
  slug: string;
  type: LearningPathStepType;
  contentId: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  whyEn: string;
  whyBn: string;
  minutes: number;
  required?: boolean;
  prerequisites?: string[];
  tags?: string[];
  route?: string;
}

export function buildSteps(pathId: string, defs: StepDef[]): LearningPathStep[] {
  return defs.map((d, i) => ({
    id: `${pathId}.${d.slug}`,
    pathId,
    order: i + 1,
    type: d.type,
    contentId: d.contentId,
    ...(d.route ? { route: d.route } : {}),
    title: { en: d.titleEn, bn: d.titleBn },
    description: { en: d.descEn, bn: d.descBn },
    whyItMatters: { en: d.whyEn, bn: d.whyBn },
    estimatedMinutes: d.minutes,
    required: d.required ?? true,
    prerequisites: (d.prerequisites ?? []).map((p) => `${pathId}.${p}`),
    tags: d.tags ?? [],
  }));
}
