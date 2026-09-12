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
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Tooltip } from '@/components/common/Tooltip/Tooltip';
import { GIT_MODULES } from '@/content/structure/gitModules';
import { LEARNING_PATHS } from '@/content/paths';
import { cn } from '@/utils/classnames';
import './Sidebar.css';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  isHovered?: boolean;
  onToggleCollapse?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  isHovered = false,
  onToggleCollapse,
  onHoverChange,
}) => {
  const { t, language } = useTranslation();
  const location = useLocation();
  const isLearnActive = location.pathname.startsWith('/learn');
  const isBn = language === 'bn';

  // Effective desktop expansion: expanded if not collapsed, or if hovered while in collapsed state
  const isEffectivelyExpanded = !isCollapsed || isHovered;

  // Smart context-aware expansion: collapsed on /, auto-expands on /learn, respects manual user toggle
  const [userToggled, setUserToggled] = useState(false);
  const [learnExpanded, setLearnExpanded] = useState(() => isLearnActive);

  React.useEffect(() => {
    if (!userToggled) {
      setLearnExpanded(isLearnActive);
    }
  }, [isLearnActive, userToggled]);

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
        {
          path: '/learn',
          label: t.nav.learn,
          icon: BookOpen,
          badge: `${GIT_MODULES.length} Modules`,
          isLearnSection: true,
        },
        {
          path: '/learn/paths',
          label: t.nav.paths,
          icon: Route,
          badge: `${LEARNING_PATHS.length} Paths`,
        },
      ],
    },
    {
      title: t.nav.sections.reference,
      items: [
        { path: '/commands', label: t.nav.commands, icon: Terminal, badge: 'Index' },
        {
          path: '/workflows',
          label: t.nav.workflows,
          icon: GitPullRequest,
          badge: isBn ? 'ইন্টারেক্টিভ' : 'Interactive',
        },
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

      <aside
        className={cn(
          'sidebar',
          isOpen && 'sidebar--open',
          isCollapsed && 'sidebar--collapsed',
          isCollapsed && isHovered && 'sidebar--hover-expanded'
        )}
        onMouseEnter={() => {
          if (isCollapsed) {
            onHoverChange?.(true);
          }
        }}
        onMouseLeave={() => {
          if (isCollapsed) {
            onHoverChange?.(false);
          }
        }}
      >
        <div className="sidebar__header">
          {isEffectivelyExpanded ? (
            <>
              <div className="sidebar__track-select">
                <div className="sidebar__track-icon">
                  <Layers size={18} />
                </div>
                <div className="sidebar__track-info">
                  <span className="label-sm sidebar__track-label">Active Subject</span>
                  <span className="title-sm sidebar__track-name">Git & GitHub</span>
                </div>
              </div>

              <div className="sidebar__header-actions">
                {/* Desktop collapse toggle */}
                <Tooltip
                  content={isBn ? 'সাইডবার ছোট করুন' : 'Collapse sidebar'}
                  position="bottom"
                  className="sidebar__desktop-toggle-tooltip"
                >
                  <Button
                    variant="icon"
                    size="sm"
                    className="sidebar__collapse-btn"
                    onClick={onToggleCollapse}
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose size={18} />
                  </Button>
                </Tooltip>

                {/* Mobile close button */}
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
            </>
          ) : (
            /* Collapsed Icon Strip Header */
            <div className="sidebar__track-select sidebar__track-select--collapsed">
              <Tooltip
                content={isBn ? 'সাইডবার প্রসারিত করুন' : 'Expand sidebar'}
                position="right"
              >
                <button
                  type="button"
                  className="sidebar__icon-strip-toggle"
                  onClick={onToggleCollapse}
                  aria-label="Expand sidebar"
                >
                  <Layers size={20} />
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          {navigationSections.map((section, idx) => (
            <div key={idx} className="sidebar__section">
              {isEffectivelyExpanded ? (
                <span className="sidebar__section-title label-sm">
                  {section.title}
                </span>
              ) : (
                <div className="sidebar__section-divider" aria-hidden="true" />
              )}

              <ul className="sidebar__list">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isItemLearn = item.isLearnSection;

                  const linkContent = (
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) =>
                        cn(
                          'sidebar__link',
                          (isActive || (isItemLearn && isLearnActive)) && 'sidebar__link--active',
                          !isEffectivelyExpanded && 'sidebar__link--icon-only'
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

                      {isEffectivelyExpanded && (
                        <>
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
                        </>
                      )}
                    </NavLink>
                  );

                  return (
                    <li key={item.path} className="sidebar__list-item">
                      <div className="sidebar__link-wrapper">
                        {!isEffectivelyExpanded ? (
                          <Tooltip
                            content={item.badge ? `${item.label} (${item.badge})` : item.label}
                            position="right"
                          >
                            {linkContent}
                          </Tooltip>
                        ) : (
                          linkContent
                        )}

                        {/* Expand/Collapse Toggle for Learn section (only when expanded) */}
                        {isItemLearn && isEffectivelyExpanded && (
                          <button
                            type="button"
                            className="sidebar__sub-toggle"
                            onClick={(e) => {
                              e.preventDefault();
                              setUserToggled(true);
                              setLearnExpanded((prev) => !prev);
                            }}
                            aria-label={learnExpanded ? 'Collapse modules' : 'Expand modules'}
                          >
                            {learnExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        )}
                      </div>

                      {/* Nested Learn Modules Tree (only when expanded) */}
                      {isItemLearn && learnExpanded && isEffectivelyExpanded && (
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

        {/* Dedicated Bottom Collapse / Expand Toggle Mechanism */}
        <div className="sidebar__footer">
          <button
            type="button"
            className={cn(
              'sidebar__collapse-toggle-btn',
              !isEffectivelyExpanded && 'sidebar__collapse-toggle-btn--collapsed'
            )}
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {!isEffectivelyExpanded ? (
              <Tooltip content={isBn ? 'সাইডবার প্রসারিত করুন' : 'Expand sidebar'} position="right">
                <span className="sidebar__collapse-icon-wrap">
                  <PanelLeftOpen size={18} />
                </span>
              </Tooltip>
            ) : (
              <>
                <PanelLeftClose size={18} />
                <span className="body-sm font-medium">
                  {isBn ? 'সাইডবার ছোট করুন' : 'Collapse sidebar'}
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
