import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import { TriangleAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Focused route-level error boundary: one feature failing must not blank
 * the whole app. Offers retry (resets state) plus safe navigation targets.
 * No stack traces reach the user; details go to the console only.
 */
class ErrorBoundaryInner extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    console.error('[GitVerse] Route error captured:', error);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;
    return <ErrorFallback onRetry={this.handleRetry} />;
  }
}

const ErrorFallback: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  return (
    <PageContainer maxWidth="sm" className="animate-fade-in">
      <Card
        variant="filled"
        padding="lg"
        role="alert"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'flex-start', marginTop: 'var(--space-8)' }}
      >
        <span aria-hidden="true" style={{ color: 'var(--md-sys-color-error)' }}>
          <TriangleAlert size={28} />
        </span>
        <h1 className="headline-md" style={{ margin: 0 }}>
          {isBn ? 'কিছু ভুল হয়েছে' : 'Something went wrong'}
        </h1>
        <p className="body-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
          {isBn
            ? 'এই পাতা লোড করা যায়নি। আপনার সংরক্ষিত অগ্রগতি নিরাপদ আছে।'
            : 'This view could not be loaded. Your saved progress is safe.'}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button variant="filled" size="md" onClick={onRetry}>
            {isBn ? 'আবার চেষ্টা করুন' : 'Try again'}
          </Button>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="tonal" size="md">{t.pages.notFound.action}</Button>
          </Link>
          <Link to="/learn" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" size="md">{t.pages.notFound.exploreLearn}</Button>
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
};

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => (
  <ErrorBoundaryInner>{children}</ErrorBoundaryInner>
);
