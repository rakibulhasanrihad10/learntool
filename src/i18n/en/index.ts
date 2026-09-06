import { TranslationSchema } from '@/types/i18n';
import { enCommon } from './common';
import { enNav } from './nav';
import { enHome } from './home';
import { enDashboard } from './dashboard';
import { enPages } from './pages';
import { enGamification } from './gamification';

export const en: TranslationSchema = {
  common: enCommon,
  nav: enNav,
  gamification: enGamification,
  home: enHome,
  dashboard: enDashboard,
  pages: enPages,
};
