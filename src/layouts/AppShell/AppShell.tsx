import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary/ErrorBoundary';
import { TopBar } from '@/layouts/TopBar/TopBar';
import { Sidebar } from '@/layouts/Sidebar/Sidebar';
import { MobileNav } from '@/layouts/MobileNav/MobileNav';
import { SearchModal } from '@/components/search/SearchModal/SearchModal';
import { InstallBanner, NetworkBanner, UpdateBanner } from '@/pwa/PwaBanners';
import { useTranslation } from '@/i18n/context';
import { storage } from '@/utils/storage';
import { cn } from '@/utils/classnames';
import './AppShell.css';

export const SIDEBAR_COLLAPSED_KEY = 'gitverse_sidebar_collapsed';

export const AppShell: React.FC = () => {
  const { language } = useTranslation();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() =>
    storage.get<boolean>(SIDEBAR_COLLAPSED_KEY, false)
  );
  const [isHovered, setIsHovered] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      storage.set(SIDEBAR_COLLAPSED_KEY, next);
      return next;
    });
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen((prev) => !prev);
    } else {
      toggleSidebarCollapse();
    }
  };

  // Global Ctrl+K / Cmd+K listener, plus `/` outside text inputs.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) return;
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={cn(
        'app-shell',
        isCollapsed && 'app-shell--sidebar-collapsed',
        isCollapsed && isHovered && 'app-shell--sidebar-hover-expanded'
      )}
    >
      <a href="#main-content" className="skip-link">
        {language === 'bn' ? 'মূল কন্টেন্টে যান' : 'Skip to main content'}
      </a>
      {/* Top Application Bar */}
      <TopBar
        onToggleSidebar={handleToggleSidebar}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Container Layout */}
      <div className="app-shell__body">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          isHovered={isHovered}
          onToggleCollapse={toggleSidebarCollapse}
          onHoverChange={setIsHovered}
        />

        {/* Content Outlet */}
        <main id="main-content" className="app-shell__main" tabIndex={-1}>
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenSearch={() => setSearchOpen(true)} />

      {/* PWA status banners (network / install / update) */}
      <div className="pwa-banners">
        <UpdateBanner />
        <InstallBanner />
        <NetworkBanner />
      </div>

      {/* Global Search Dialog */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
};
