export * from './fundamentalsLessons';
export * from './commands';
export * from './workflows';
export * from './troubleshooting';
export * from './troubleshootingB';
import { TROUBLESHOOTING_GUIDES_A } from './troubleshooting';
import { TROUBLESHOOTING_GUIDES_B } from './troubleshootingB';
import { TroubleshootingGuide } from '@/types/content';

/** Complete cookbook, canonical order. */
export const TROUBLESHOOTING_GUIDES: TroubleshootingGuide[] = [
  ...TROUBLESHOOTING_GUIDES_A,
  ...TROUBLESHOOTING_GUIDES_B,
].sort((a, b) => a.order - b.order);
