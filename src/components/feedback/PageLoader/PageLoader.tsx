import React from 'react';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { useTranslation } from '@/i18n/context';

/**
 * Layout-preserving fallback for lazy-loaded routes. No fake delays —
 * React shows it only while the chunk loads. Text (not a spinner) keeps
 * it calm, bilingual, and reduced-motion safe.
 */
export const PageLoader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer maxWidth="lg">
      <div
        role="status"
        aria-live="polite"
        className="body-lg"
        style={{ padding: 'var(--space-12) 0', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}
      >
        {t.common.actions.loading}
      </div>
    </PageContainer>
  );
};
