import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Compass, RotateCcw, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { DecisionTree } from '@/types/content';
import { resolveDecisionHop } from '@/utils/troubleshootingSearch';
import './DecisionHelper.css';

export interface DecisionHelperProps {
  tree: DecisionTree;
  /** Resolve a scenario slug to its display title (current language). */
  getScenarioTitle: (slug: string) => string | undefined;
}

/**
 * Deterministic decision-tree walkthrough (not a chatbot): one question at a
 * time, keyboard-accessible option buttons, restart any time, terminal hops
 * link to the matching recovery guide.
 */
export const DecisionHelper: React.FC<DecisionHelperProps> = ({ tree, getScenarioTitle }) => {
  const { language, t } = useTranslation();
  const isBn = language === 'bn';
  const [nodeId, setNodeId] = useState<string>(tree.startNode);
  const [terminalSlug, setTerminalSlug] = useState<string | null>(null);
  const [depth, setDepth] = useState(0);

  const node = tree.nodes.find((n) => n.id === nodeId);

  const choose = (optionIndex: number) => {
    const hop = resolveDecisionHop(tree, nodeId, optionIndex);
    if (!hop) return;
    if (hop.kind === 'scenario') {
      setTerminalSlug(hop.slug);
    } else {
      setNodeId(hop.nodeId);
      setDepth((d) => d + 1);
    }
  };

  const restart = () => {
    setNodeId(tree.startNode);
    setTerminalSlug(null);
    setDepth(0);
  };

  return (
    <Card variant="outlined" padding="lg" className="decision-helper">
      <div className="decision-helper__head">
        <Compass size={18} aria-hidden="true" className="decision-helper__icon" />
        <div>
          <h3 className="title-md decision-helper__title">
            {isBn ? tree.title.bn : tree.title.en}
          </h3>
          <p className="body-sm decision-helper__subtitle">
            {isBn ? tree.subtitle.bn : tree.subtitle.en}
          </p>
        </div>
      </div>

      <div aria-live="polite">
        {terminalSlug === null && node && (
          <div className="decision-helper__step">
            <p className="body-md decision-helper__question">
              {isBn ? node.question.bn : node.question.en}
            </p>
            <div className="decision-helper__options" role="group" aria-label={isBn ? node.question.bn : node.question.en}>
              {node.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="decision-helper__option"
                  onClick={() => choose(idx)}
                >
                  <span>{isBn ? opt.label.bn : opt.label.en}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
            {depth > 0 && (
              <Button variant="text" size="sm" onClick={restart} iconLeft={<RotateCcw size={14} />}>
                {t.pages.troubleshooting.decisionRestart}
              </Button>
            )}
          </div>
        )}

        {terminalSlug !== null && (
          <div className="decision-helper__result">
            <span className="label-sm decision-helper__leads">
              {t.pages.troubleshooting.decisionLeadsTo}
            </span>
            <Link to={`/troubleshooting/git/${terminalSlug}`} className="decision-helper__link">
              {getScenarioTitle(terminalSlug) ?? terminalSlug}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Button variant="text" size="sm" onClick={restart} iconLeft={<RotateCcw size={14} />}>
              {t.pages.troubleshooting.decisionRestart}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
