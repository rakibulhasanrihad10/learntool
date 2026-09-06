import { TranslationSchema } from '@/types/i18n';
import { bnCommon } from './common';
import { bnNav } from './nav';
import { bnHome } from './home';
import { bnDashboard } from './dashboard';
import { bnPages } from './pages';
import { bnGamification } from './gamification';

export const bn: TranslationSchema = {
  common: bnCommon,
  nav: bnNav,
  gamification: bnGamification,
  home: bnHome,
  dashboard: bnDashboard,
  pages: bnPages,
};
