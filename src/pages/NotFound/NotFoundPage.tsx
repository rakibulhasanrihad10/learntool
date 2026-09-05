import React from 'react';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Button } from '@/components/common/Button/Button';
import { GitFork, ArrowLeft, BookOpen, Terminal, Search } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PageContainer maxWidth="sm" className="animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--md-sys-color-surface-container-low)',
          border: '1px solid var(--md-sys-color-outline-variant)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--md-sys-color-error-container)',
            color: 'var(--md-sys-color-on-error-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GitFork size={32} />
        </div>

        <h1 className="headline-lg">{t.pages.notFound.title}</h1>
        <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {t.pages.notFound.subtitle}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
          <Button
            variant="filled"
            size="md"
            iconLeft={<ArrowLeft size={16} />}
            onClick={() => navigate('/')}
          >
            {t.pages.notFound.action}
          </Button>
          <Button
            variant="outlined"
            size="md"
            iconLeft={<BookOpen size={16} />}
            onClick={() => navigate('/learn')}
          >
            {t.pages.notFound.exploreLearn}
          </Button>
          <Button
            variant="outlined"
            size="md"
            iconLeft={<Terminal size={16} />}
            onClick={() => navigate('/commands')}
          >
            {t.pages.notFound.exploreCommands}
          </Button>
          <Button
            variant="text"
            size="md"
            iconLeft={<Search size={16} />}
            onClick={() => navigate('/search')}
          >
            {t.pages.notFound.openSearch}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
