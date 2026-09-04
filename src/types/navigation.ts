import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  labelKey: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
}

export interface NavSection {
  titleKey: string;
  items: NavItem[];
}
