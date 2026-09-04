import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { ChangedArea, SimResult } from '@/features/simulation/models';
import './StateChangeSummary.css';

export interface StateChangeSummaryProps {
  result: SimResult | null;
  expectedEn?: string;
  expectedBn?: string;
  whyEn?: string;
  whyBn?: string;
  learnMoreLessonId?: string;
}

const AREA_KEYS: Record<ChangedArea, 'areaWorking' | 'areaStaging' | 'areaLocal' | 'areaRemote' | 'areaTracking'> = {
  working: 'areaWorking',
  staging: 'areaStaging',
  local: 'areaLocal',
  remote: 'areaRemote',
  tracking: 'areaTracking',
};

/**
 * "What happened? / What changed? / Remember / Learn more" explanation panel.
 * Rendered inside an aria-live region by callers so screen readers announce
 * every simulation change.
 */
export const StateChangeSummary: React.FC<StateChangeSummaryProps> = ({
  result,
  expectedEn,
  expectedBn,
  whyEn,
  whyBn,
  learnMoreLessonId,
}) => {
  const { language, t } = useTranslation();
  const s = t.pages.simulator;
  const isBn = language === 'bn';

  if (!result) return null;

  return (
    <Card
      variant={result.ok ? 'filled' : 'outlined'}
      padding="lg"
      className={`sim-summary${result.ok ? '' : ' sim-summary--failed'}`}
      style={result.ok ? undefined : { borderColor: 'var(--md-sys-color-error)' }}
    >
      <div className="sim-summary__headline">
        {result.ok
          ? <CheckCircle2 size={18} color="var(--md-sys-color-success)" aria-hidden="true" />
          : <XCircle size={18} color="var(--md-sys-color-error)" aria-hidden="true" />}
        <h3 className="title-md sim-summary__title">{s.whatHappened}</h3>
      </div>

      <p className="body-md sim-summary__text">
        <strong>{isBn ? result.title.bn : result.title.en}</strong>
        {' '}{isBn ? result.detail.bn : result.detail.en}
      </p>

      {result.changes.length > 0 && (
        <div className="sim-summary__row">
          <span className="label-sm sim-summary__label">{s.whatChanged}</span>
          <div className="sim-summary__chips">
            {result.changes.map((area) => (
              <Badge key={area} variant="secondary" size="sm">{s[AREA_KEYS[area]]}</Badge>
            ))}
          </div>
        </div>
      )}

      {(expectedEn || whyEn) && (
        <div className="sim-summary__row">
          {expectedEn && (
            <p className="body-sm sim-summary__text">
              <strong>{s.expected}: </strong>{isBn && expectedBn ? expectedBn : expectedEn}
            </p>
          )}
          {whyEn && (
            <p className="body-sm sim-summary__text">
              <strong>{s.whyMatters}: </strong>{isBn && whyBn ? whyBn : whyEn}
            </p>
          )}
        </div>
      )}

      <div className="sim-summary__remember">
        <Lightbulb size={16} aria-hidden="true" />
        <p className="body-sm sim-summary__text">
          <strong>{s.remember}: </strong>{isBn ? result.remember.bn : result.remember.en}
        </p>
      </div>

      {learnMoreLessonId && (
        <Link to={`/learn/git/fundamentals/${learnMoreLessonId.replace('git.fundamentals.', '')}`} className="sim-summary__learnmore">
          {s.learnMore} →
        </Link>
      )}
    </Card>
  );
};
