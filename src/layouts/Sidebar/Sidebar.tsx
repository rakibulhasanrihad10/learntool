import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  GitPullRequest,
  Wrench,
  HelpCircle,
  Code2,
  FileText,
  X,
  Layers,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Route,
  Gauge,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { GIT_MODULES } from '@/content/structure/gitModules';
import { cn } from '@/utils/classnames';
import './Sidebar.css';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t, language } = useTranslation();
  const location = useLocation();
  const isLearnActive = location.pathname.startsWith('/learn');
  const [learnExpanded, setLearnExpanded] = useState(true);

  interface SidebarNavItem {
    path: string;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: string;
    exact?: boolean;
    isLearnSection?: boolean;
  }

  interface SidebarSection {
    title: string;
    items: SidebarNavItem[];
  }

  const navigationSections: SidebarSection[] = [
    {
      title: t.nav.sections.core,
      items: [
        { path: '/', label: t.nav.home, icon: LayoutDashboard, exact: true },
        { path: '/progress', label: t.nav.progress, icon: Gauge },
        { path: '/learn', label: t.nav.learn, icon: BookOpen, badge: '8 Modules', isLearnSection: true },
        { path: '/learn/paths', label: t.nav.paths, icon: Route, badge: '3 Paths' },
      ],
    },
    {
      title: t.nav.sections.reference,
      items: [
        { path: '/commands', label: t.nav.commands, icon: Terminal, badge: 'Index' },
        { path: '/workflows', label: t.nav.workflows, icon: GitPullRequest },
        { path: '/troubleshooting', label: t.nav.troubleshooting, icon: Wrench, badge: 'Fixes' },
      ],
    },
    {
      title: t.nav.sections.practiceAndPrep,
      items: [
        { path: '/practice', label: t.nav.practice, icon: Code2, badge: 'Lab' },
        { path: '/interview', label: t.nav.interview, icon: HelpCircle },
        { path: '/cheatsheet', label: t.nav.cheatsheet, icon: FileText },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={cn('sidebar', isOpen && 'sidebar--open')}>
        <div className="sidebar__header">
          <div className="sidebar__track-select">
            <div className="sidebar__track-icon">
              <Layers size={18} />
            </div>
            <div className="sidebar__track-info">
              <span className="label-sm sidebar__track-label">Active Subject</span>
              <span className="title-sm sidebar__track-name">Git & GitHub</span>
            </div>
          </div>

          <Button
            variant="icon"
            size="sm"
            className="sidebar__close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </Button>
        </div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          {navigationSections.map((section, idx) => (
            <div key={idx} className="sidebar__section">
              <span className="sidebar__section-title label-sm">
                {section.title}
              </span>

              <ul className="sidebar__list">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isItemLearn = item.isLearnSection;

                  return (
                    <li key={item.path} className="sidebar__list-item">
                      <div className="sidebar__link-wrapper">
                        <NavLink
                          to={item.path}
                          end={item.exact}
                          className={({ isActive }) =>
                            cn(
                              'sidebar__link',
                              (isActive || (isItemLearn && isLearnActive)) && 'sidebar__link--active'
                            )
                          }
                          onClick={() => {
                            if (window.innerWidth < 1024 && !isItemLearn) {
                              onClose();
                            }
                          }}
                        >
                          <span className="sidebar__active-indicator" aria-hidden="true" />
                          <Icon size={18} className="sidebar__link-icon" />
                          <span className="sidebar__link-label body-md">{item.label}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              size="sm"
                              className="sidebar__link-badge"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </NavLink>

                        {/* Expand/Collapse Toggle for Learn section */}
                        {isItemLearn && (
                          <button
                            type="button"
                            className="sidebar__sub-toggle"
                            onClick={(e) => {
                              e.preventDefault();
                              setLearnExpanded((prev) => !prev);
                            }}
                            aria-label={learnExpanded ? 'Collapse modules' : 'Expand modules'}
                          >
                            {learnExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        )}
                      </div>

                      {/* Nested Learn Modules Tree */}
                      {isItemLearn && learnExpanded && (
                        <ul className="sidebar__sub-list animate-slide-down">
                          {GIT_MODULES.map((mod) => {
                            const modPath = `/learn/git/${mod.slug}`;
                            const isModActive = location.pathname.startsWith(modPath);
                            const modTitle = language === 'bn' ? mod.titleBn : mod.title;

                            return (
                              <li key={mod.id} className="sidebar__sub-item">
                                <NavLink
                                  to={modPath}
                                  className={cn(
                                    'sidebar__sub-link body-sm',
                                    isModActive && 'sidebar__sub-link--active'
                                  )}
                                  onClick={() => {
                                    if (window.innerWidth < 1024) {
                                      onClose();
                                    }
                                  }}
                                >
                                  <GitBranch size={13} className="sidebar__sub-icon" />
                                  <span className="sidebar__sub-label">{modTitle}</span>
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Scalable future subjects footer preview */}
        <div className="sidebar__footer">
          <div className="sidebar__future-box">
            <span className="label-sm sidebar__future-title">Upcoming CS Subjects</span>
            <div className="sidebar__future-tags">
              <span className="sidebar__future-tag">Linux</span>
              <span className="sidebar__future-tag">Docker</span>
              <span className="sidebar__future-tag">SQL</span>
              <span className="sidebar__future-tag">System Design</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
