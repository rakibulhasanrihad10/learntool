import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Terminal, Wrench, Search } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './MobileNav.css';

export interface MobileNavProps {
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenSearch }) => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t.nav.home, icon: LayoutDashboard, exact: true },
    { path: '/learn', label: t.nav.learn, icon: BookOpen },
    { path: '/commands', label: t.nav.commands, icon: Terminal },
    { path: '/troubleshooting', label: t.nav.troubleshooting, icon: Wrench },
  ];

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              cn('mobile-nav__item', isActive && 'mobile-nav__item--active')
            }
          >
            <Icon size={20} className="mobile-nav__icon" />
            <span className="mobile-nav__label label-sm">{item.label}</span>
          </NavLink>
        );
      })}

      <button
        type="button"
        className="mobile-nav__item mobile-nav__search-btn"
        onClick={onOpenSearch}
        aria-label="Search"
      >
        <Search size={20} className="mobile-nav__icon" />
        <span className="mobile-nav__label label-sm">Search</span>
      </button>
    </nav>
  );
};
