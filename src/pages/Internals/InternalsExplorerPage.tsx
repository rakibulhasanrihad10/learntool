import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Chip } from '@/components/common/Chip/Chip';
import { CodeBlock } from '@/components/data-display/CodeBlock/CodeBlock';
import { CommandBlock } from '@/components/data-display/CommandBlock/CommandBlock';
import { CommitGraph } from '@/components/simulation/CommitGraph/CommitGraph';
import { useTranslation } from '@/i18n/context';
import { LocalText } from '@/types/content';
import { INTERNALS_REPO } from '@/features/internals/dataset';
import { internalsToSimState } from '@/features/internals/adapter';
import {
  getObject,
  outgoingHops,
  pointersTo,
  resolveHead,
  traceStarts,
  TraceNode,
  TraceNodeKind,
} from '@/features/internals/traversal';
import { ConceptId } from '@/features/internals/models';
import { INTERNALS_CONCEPTS, INTERNALS_MISCONCEPTIONS } from '@/content/git/internalsShared';
import { getLessonRoute } from '@/content/github';
import { Boxes, Network, ListTree, TerminalSquare, BookOpen } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Static graph layout (educational dataset is fixed by design)        */
/* ------------------------------------------------------------------ */

interface GraphNode {
  kind: TraceNodeKind;
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
}

const NODE_W = 92;
const NODE_H = 40;

const GRAPH_NODES: GraphNode[] = [
  { kind: 'head', id: 'HEAD', label: 'HEAD', sub: 'pointer', x: 24, y: 16 },
  { kind: 'ref', id: 'main', label: 'main', sub: 'branch', x: 164, y: 16 },
  { kind: 'ref', id: 'feature', label: 'feature', sub: 'branch', x: 304, y: 16 },
  { kind: 'ref', id: 'origin/main', label: 'origin/main', sub: 'tracking', x: 444, y: 16 },
  { kind: 'ref', id: 'v1.0', label: 'v1.0', sub: 'tag ref', x: 584, y: 16 },
  { kind: 'tag', id: 'G1', label: 'G1', sub: 'tag obj', x: 584, y: 104 },
  { kind: 'commit', id: 'C1', label: 'C1', sub: 'commit', x: 24, y: 192 },
  { kind: 'commit', id: 'C2', label: 'C2', sub: 'commit', x: 164, y: 192 },
  { kind: 'commit', id: 'C3', label: 'C3', sub: 'commit', x: 304, y: 192 },
  { kind: 'commit', id: 'M1', label: 'M1', sub: 'merge', x: 444, y: 192 },
  { kind: 'commit', id: 'F1', label: 'F1', sub: 'commit', x: 304, y: 280 },
  { kind: 'commit', id: 'F2', label: 'F2', sub: 'commit', x: 444, y: 280 },
  { kind: 'tree', id: 'T1', label: 'T1', sub: 'tree', x: 94, y: 368 },
  { kind: 'tree', id: 'T3', label: 'T3', sub: 'tree', x: 274, y: 368 },
  { kind: 'tree', id: 'T2', label: 'T2', sub: 'tree', x: 454, y: 368 },
  { kind: 'blob', id: 'B1', label: 'B1', sub: 'blob', x: 24, y: 456 },
  { kind: 'blob', id: 'B2', label: 'B2', sub: 'blob', x: 164, y: 456 },
  { kind: 'blob', id: 'B3', label: 'B3', sub: 'blob', x: 304, y: 456 },
  { kind: 'blob', id: 'B4', label: 'B4', sub: 'blob', x: 444, y: 456 },
  { kind: 'blob', id: 'B5', label: 'B5', sub: 'blob', x: 584, y: 456 },
];

interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}

const GRAPH_EDGES: GraphEdge[] = [
  { from: 'HEAD', to: 'main' },
  { from: 'main', to: 'M1' },
  { from: 'feature', to: 'F2' },
  { from: 'origin/main', to: 'C3' },
  { from: 'v1.0', to: 'G1' },
  { from: 'G1', to: 'C3' },
  { from: 'M1', to: 'C3', label: 'parent 1' },
  { from: 'M1', to: 'F2', label: 'parent 2' },
  { from: 'F2', to: 'F1', label: 'parent' },
  { from: 'F1', to: 'C2', label: 'parent' },
  { from: 'C3', to: 'C2', label: 'parent' },
  { from: 'C2', to: 'C1', label: 'parent' },
  { from: 'C1', to: 'T1', label: 'tree' },
  { from: 'C2', to: 'T1', label: 'tree' },
  { from: 'C3', to: 'T3', label: 'tree' },
  { from: 'F1', to: 'T3', label: 'tree' },
  { from: 'F2', to: 'T3', label: 'tree' },
  { from: 'M1', to: 'T3', label: 'tree' },
  { from: 'T1', to: 'B1', label: 'README' },
  { from: 'T1', to: 'B3', label: 'pkg' },
  { from: 'T3', to: 'B2', label: 'README' },
  { from: 'T3', to: 'B3', label: 'pkg' },
  { from: 'T3', to: 'T2', label: 'src' },
  { from: 'T2', to: 'B4', label: 'main.js' },
  { from: 'T2', to: 'B5', label: 'utils' },
];

const KIND_COLORS: Record<TraceNodeKind, string> = {
  head: 'var(--md-sys-color-tertiary-container)',
  ref: 'var(--md-sys-color-primary-container)',
  commit: 'var(--md-sys-color-surface-container-high)',
  tree: 'var(--md-sys-color-secondary-container)',
  blob: 'var(--md-sys-color-surface-container)',
  tag: 'var(--md-sys-color-primary-container)',
  reflog: 'var(--md-sys-color-surface-container)',
};

const PLUMBING: { command: string; slug: string; concept: LocalText }[] = [
  { command: 'git cat-file -p <object>', slug: 'cat-file', concept: { en: 'Pretty-print any object: blob bytes, tree listings, or full commit records.', bn: 'যেকোনো অবজেক্ট সুন্দরভাবে দেখুন: ব্লব বাইট, ট্রি তালিকা বা পূর্ণ কমিট রেকর্ড।' } },
  { command: 'git rev-parse HEAD', slug: 'rev-parse', concept: { en: 'Resolve any reference expression to the raw object ID it points at.', bn: 'যেকোনো রেফারেন্স এক্সপ্রেশন সমাধান করে কাঁচা অবজেক্ট ID দেখুন।' } },
  { command: 'git ls-tree HEAD', slug: 'ls-tree', concept: { en: 'List a tree object: names mapped to blob and subtree IDs.', bn: 'ট্রি অবজেক্ট তালিকা করুন: ব্লব ও সাবট্রি ID-তে নাম ম্যাপ করা।' } },
  { command: 'git show-ref', slug: 'show-ref', concept: { en: 'Display every reference and the object each currently points to.', bn: 'প্রতিটি রেফারেন্স ও বর্তমানে যে অবজেক্টের দিকে যায় তা দেখুন।' } },
  { command: 'git update-ref refs/heads/<name> <sha>', slug: 'update-ref', concept: { en: 'Move a reference directly — the primitive behind branch, reset, and symbolic-ref.', bn: 'সরাসরি রেফারেন্স সরান — ব্রাঞ্চ, রিসেট ও সিম্বলিক-ref এর পেছনে আদিম ক্রিয়া।' } },
  { command: 'git reflog', slug: 'reflog', concept: { en: 'Read the local journal of reference movements for recovery.', bn: 'পুনরুদ্ধারে রেফারেন্স নড়াচড়ার লোকাল জার্নাল পড়ুন।' } },
  { command: 'git count-objects -v', slug: 'count-objects', concept: { en: 'Report loose objects, packs, and disk usage of the object store.', bn: 'অবজেক্ট স্টোরের লুজ অবজেক্ট, প্যাক ও ডিস্ক ব্যবহার রিপোর্ট করুন।' } },
  { command: 'git gc', slug: 'gc', concept: { en: 'Pack, prune expired entries, and collect long-unreachable objects.', bn: 'প্যাক করুন, মেয়াদোত্তীর্ণ এন্ট্রি ছাঁটুন, দীর্ঘ-অপ্রাপ্য অবজেক্ট সংগ্রহ করুন।' } },
];

export const InternalsExplorerPage: React.FC = () => {
  const { language, t } = useTranslation();
  const s = t.pages.internals;
  const isBn = language === 'bn';
  const L = (text: LocalText) => (isBn ? text.bn : text.en);

  const [conceptId, setConceptId] = useState<ConceptId>('commit');
  const [selected, setSelected] = useState<TraceNode>({ kind: 'commit', id: 'M1', via: 'start' });
  const [trail, setTrail] = useState<TraceNode[]>([{ kind: 'head', id: 'HEAD', via: 'start' }]);

  useEffect(() => {
    document.title = `${s.title} | GitVerse`;
  }, [s.title]);

  const simState = useMemo(() => internalsToSimState(INTERNALS_REPO), []);
  const concept = INTERNALS_CONCEPTS.find((c) => c.id === conceptId) ?? INTERNALS_CONCEPTS[0];
  const nodeById = useMemo(() => new Map(GRAPH_NODES.map((n) => [n.id, n])), []);

  const selectedHops = outgoingHops(INTERNALS_REPO, selected.kind, selected.id);
  const selectedIncoming = selected.kind === 'head' ? [] : pointersTo(INTERNALS_REPO, selected.id);
  const trailHead = trail[trail.length - 1];
  const trailHops = outgoingHops(INTERNALS_REPO, trailHead.kind, trailHead.id);
  const headRes = resolveHead(INTERNALS_REPO);

  const pickFromGraph = (kind: TraceNodeKind, id: string) => {
    setSelected({ kind, id, via: 'graph' });
  };

  const startTrail = (kind: TraceNodeKind, id: string) => {
    setTrail([{ kind, id, via: 'start' }]);
  };

  const pushHop = (hop: TraceNode) => {
    setTrail((prev) => [...prev, hop]);
    setSelected({ kind: hop.kind, id: hop.id, via: hop.via });
  };

  const lessonLink = (lessonId: string, label: string) => {
    const route = getLessonRoute(lessonId);
    if (!route) return null;
    return (
      <Link key={lessonId} to={route.path} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600, textDecoration: 'none' }}>
        {label} →
      </Link>
    );
  };

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Breadcrumb
          items={[
            { label: t.nav.learn, labelBn: 'লার্নিং ট্র্যাকস', path: '/learn' },
            { label: s.title, isCurrent: true },
          ]}
        />

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div>
            <Badge variant="primary" size="md">
              <Boxes size={14} />
              <span>{s.badge}</span>
            </Badge>
          </div>
          <h1 className="headline-lg">{s.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {s.subtitle}
          </p>
          <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            HEAD → {headRes.ref ?? headRes.commit} · {INTERNALS_REPO.refs.length} refs · {Object.keys(INTERNALS_REPO.objects).length} objects · {INTERNALS_REPO.reflog.length} reflog entries
          </p>
        </div>

        {/* 1. Concept selector */}
        <section aria-labelledby="internals-concepts">
          <h2 id="internals-concepts" className="title-lg" style={{ marginBottom: 'var(--space-1)' }}>{s.conceptsTitle}</h2>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 0 }}>{s.conceptsHint}</p>
          <div role="group" aria-label={s.conceptsTitle} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            {INTERNALS_CONCEPTS.map((c) => (
              <Chip
                key={c.id}
                selected={conceptId === c.id}
                onClick={() => setConceptId(c.id)}
                aria-pressed={conceptId === c.id}
              >
                {L(c.title)}
              </Chip>
            ))}
          </div>
          <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h3 className="title-md" style={{ margin: 0 }}>{L(concept.title)}</h3>
            {[
              { label: s.detailWhat, text: concept.what },
              { label: s.detailPointsTo, text: concept.pointsTo },
              { label: s.detailPointedBy, text: concept.pointedBy },
              { label: s.detailWhy, text: concept.why },
            ].map((row) => (
              <div key={row.label}>
                <span className="label-sm" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 700 }}>{row.label}</span>
                <p className="body-md" style={{ margin: '2px 0 0' }}>{L(row.text)}</p>
              </div>
            ))}
          </Card>
        </section>

        {/* 2. Object graph */}
        <section aria-labelledby="internals-graph">
          <h2 id="internals-graph" className="title-lg" style={{ marginBottom: 'var(--space-1)' }}>{s.graphTitle}</h2>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 0 }}>{s.graphHint}</p>
          <div style={{ overflowX: 'auto', border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--md-sys-color-surface-container-lowest)' }}>
            <svg
              width={700}
              height={512}
              viewBox="0 0 700 512"
              role="img"
              aria-label={isBn
                ? 'অবজেক্ট গ্রাফ: HEAD থেকে main, feature, origin/main রেফ; C1 থেকে M1 কমিট; T1-T3 ট্রি; B1-B5 ব্লব।'
                : 'Object graph: HEAD to main, feature and origin/main refs; commits C1 to M1; trees T1-T3; blobs B1-B5.'}
              style={{ display: 'block', minWidth: '640px' }}
            >
              {GRAPH_EDGES.map((e, i) => {
                const a = nodeById.get(e.from);
                const b = nodeById.get(e.to);
                if (!a || !b) return null;
                const x1 = a.x + NODE_W / 2;
                const y1 = a.y + NODE_H;
                const x2 = b.x + NODE_W / 2;
                const y2 = b.y;
                const hot = selected.id === e.from || selected.id === e.to;
                return (
                  <g key={i}>
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={hot ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'}
                      strokeWidth={hot ? 2.5 : 1.5}
                    />
                    {e.label && (
                      <text x={(x1 + x2) / 2 + 4} y={(y1 + y2) / 2} fontSize={10} fill="var(--md-sys-color-on-surface-variant)">
                        {e.label}
                      </text>
                    )}
                  </g>
                );
              })}
              {GRAPH_NODES.map((n) => {
                const active = selected.kind === n.kind && selected.id === n.id;
                return (
                  <g
                    key={n.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${n.label}, ${n.sub}${active ? (isBn ? ', নির্বাচিত' : ', selected') : ''}`}
                    aria-pressed={active}
                    onClick={() => pickFromGraph(n.kind, n.id)}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault();
                        pickFromGraph(n.kind, n.id);
                      }
                    }}
                    style={{ cursor: 'pointer', outline: active ? '2px solid var(--md-sys-color-primary)' : undefined, outlineOffset: 2 }}
                  >
                    <rect
                      x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx={10}
                      fill={KIND_COLORS[n.kind]}
                      stroke={active ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'}
                      strokeWidth={active ? 3 : 1.5}
                    />
                    <text x={n.x + NODE_W / 2} y={n.y + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--md-sys-color-on-surface)">
                      {n.label}
                    </text>
                    <text x={n.x + NODE_W / 2} y={n.y + 32} textAnchor="middle" fontSize={10} fill="var(--md-sys-color-on-surface-variant)">
                      {n.sub}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <details style={{ marginTop: 'var(--space-2)' }}>
            <summary className="label-sm" style={{ cursor: 'pointer', color: 'var(--md-sys-color-primary)' }}>
              {s.graphAltSummary}
            </summary>
            <ul className="body-sm" style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: 'var(--space-5)' }}>
              {GRAPH_NODES.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => pickFromGraph(n.kind, n.id)}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--md-sys-color-primary)', cursor: 'pointer', font: 'inherit', textAlign: 'left' }}
                  >
                    <span className="font-mono">{n.label}</span> ({n.sub})
                  </button>
                </li>
              ))}
            </ul>
          </details>

          {/* Selection detail */}
          <Card variant="outlined" padding="md" style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} aria-live="polite">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Badge variant="secondary" size="sm">{selected.kind}</Badge>
              <code className="font-mono title-md">{selected.id}</code>
              {(() => {
                const obj = selected.kind !== 'head' && selected.kind !== 'ref' && selected.kind !== 'reflog'
                  ? getObject(INTERNALS_REPO, selected.id)
                  : undefined;
                if (obj?.kind === 'commit') return <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{obj.message}</span>;
                if (obj?.kind === 'blob') return <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{(obj.fileName as string)} · {(obj.bytes as number)} bytes</span>;
                if (obj?.kind === 'tag') return <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{(obj.name as string)}</span>;
                return null;
              })()}
            </div>
            {selectedHops.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{s.followNext}</span>
                {selectedHops.map((h) => (
                  <Button
                    key={`${h.kind}:${h.id}:${h.via}`}
                    variant="tonal"
                    size="sm"
                    onClick={() => setSelected({ kind: h.kind, id: h.id, via: h.via })}
                  >
                    {h.via} → <span className="font-mono">{h.id}</span>
                  </Button>
                ))}
              </div>
            )}
            {selectedIncoming.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{s.detailPointedBy}</span>
                {selectedIncoming.slice(0, 8).map((p, i) => (
                  <Badge key={`${p.via}:${p.to}:${i}`} variant="outline" size="sm">
                    {p.via} {p.to}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* 3. Follow the pointer */}
        <section aria-labelledby="internals-follow">
          <h2 id="internals-follow" className="title-lg" style={{ marginBottom: 'var(--space-1)' }}>
            <Network size={18} style={{ verticalAlign: '-3px', marginRight: 'var(--space-2)' }} aria-hidden="true" />
            {s.followTitle}
          </h2>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 0 }}>{s.followHint}</p>
          <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{s.followStart}</span>
              {traceStarts().map((st) => (
                <Button key={`${st.kind}:${st.id}`} variant="tonal" size="sm" onClick={() => startTrail(st.kind, st.id)}>
                  <span className="font-mono">{st.id}</span>
                </Button>
              ))}
              <span style={{ flex: 1 }} />
              <Button variant="text" size="sm" onClick={() => setTrail((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))} disabled={trail.length <= 1}>
                {s.followBack}
              </Button>
              <Button variant="text" size="sm" onClick={() => startTrail('head', 'HEAD')}>
                {s.followReset}
              </Button>
            </div>
            <nav aria-label={s.followPath} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
              {trail.map((t, i) => (
                <React.Fragment key={`${t.kind}:${t.id}:${i}`}>
                  {i > 0 && <span aria-hidden="true" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>→</span>}
                  <Badge variant={i === trail.length - 1 ? 'primary' : 'secondary'} size="sm">
                    <span className="font-mono">{t.id}</span>
                  </Badge>
                  {i > 0 && (
                    <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>({t.via})</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
            <div aria-live="polite" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{s.followNext}</span>
              {trailHops.length > 0 ? (
                trailHops.map((h) => (
                  <Button key={`${h.kind}:${h.id}:${h.via}`} variant="outlined" size="sm" onClick={() => pushHop(h)}>
                    {h.via} → <span className="font-mono">{h.id}</span>
                  </Button>
                ))
              ) : (
                <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{s.followEmpty}</span>
              )}
            </div>
          </Card>
        </section>

        {/* 4. Commit DAG (Phase 6 reuse) */}
        <section aria-labelledby="internals-dag">
          <h2 id="internals-dag" className="title-lg" style={{ marginBottom: 'var(--space-2)' }}>
            <ListTree size={18} style={{ verticalAlign: '-3px', marginRight: 'var(--space-2)' }} aria-hidden="true" />
            {s.dagTitle}
          </h2>
          <CommitGraph state={simState} />
          <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{s.dagCaption}</p>
        </section>

        {/* 5. Mental model summary */}
        <section aria-labelledby="internals-summary">
          <h2 id="internals-summary" className="title-lg" style={{ marginBottom: 'var(--space-2)' }}>{s.summaryTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              ['Working Tree', 'git add', 'Index', 'git commit', 'Commit', 'Tree', 'Blobs'],
              ['HEAD', '→', 'Branch', '→', 'Commit', '→', 'Parent'],
              ['Remote', '→', 'Remote-tracking ref', '→', 'Local branch'],
            ].map((flow, i) => (
              <Card key={i} variant="outlined" padding="md">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }} role="list" aria-label={`${s.summaryTitle} ${i + 1}`}>
                  {flow.map((token, j) => (
                    token === '→' ? (
                      <span key={j} aria-hidden="true" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 700 }}>→</span>
                    ) : token.startsWith('git ') ? (
                      <span key={j} className="label-sm font-mono" role="listitem" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 700 }}>{token}</span>
                    ) : (
                      <Badge key={j} variant={j === 0 ? 'primary' : 'secondary'} size="md">
                        <span role="listitem">{token}</span>
                      </Badge>
                    )
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 6. Plumbing reference */}
        <section aria-labelledby="internals-plumbing">
          <h2 id="internals-plumbing" className="title-lg" style={{ marginBottom: 'var(--space-1)' }}>
            <TerminalSquare size={18} style={{ verticalAlign: '-3px', marginRight: 'var(--space-2)' }} aria-hidden="true" />
            {s.plumbingTitle}
          </h2>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 0 }}>{s.plumbingHint}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-3)' }}>
            {PLUMBING.map((p) => (
              <Card key={p.slug} variant="filled" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <CommandBlock command={p.command} />
                <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
                  <strong>{s.plumbingConcept}: </strong>{L(p.concept)}
                </p>
                <Link to={`/commands/git/${p.slug}`} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem' }}>
                  {s.plumbingOpenRef} →
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* 7. Misconceptions */}
        <section aria-labelledby="internals-myths">
          <h2 id="internals-myths" className="title-lg" style={{ marginBottom: 'var(--space-1)' }}>{s.mythsTitle}</h2>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 0 }}>{s.mythsHint}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {INTERNALS_MISCONCEPTIONS.map((m, i) => (
              <details key={i} style={{ border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }} className="body-md">
                  <span className="label-sm" style={{ color: 'var(--md-sys-color-error)', marginRight: 'var(--space-2)' }}>{s.mythLabel}</span>
                  {L(m.myth)}
                </summary>
                <p className="body-md" style={{ margin: 'var(--space-2) 0 0' }}>
                  <span className="label-sm" style={{ color: 'var(--md-sys-color-success)', marginRight: 'var(--space-2)' }}>{s.realityLabel}</span>
                  {L(m.reality)}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 8. Connections */}
        <section aria-labelledby="internals-links">
          <h2 id="internals-links" className="title-lg" style={{ marginBottom: 'var(--space-2)' }}>
            <BookOpen size={18} style={{ verticalAlign: '-3px', marginRight: 'var(--space-2)' }} aria-hidden="true" />
            {s.linksTitle}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
            <Card variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <h3 className="title-md" style={{ margin: 0 }}>{s.lessonsTitle}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {lessonLink('git.internals.how-git-thinks', 'How Git Thinks')}
                {lessonLink('git.internals.blob-objects', 'Blob Objects')}
                {lessonLink('git.internals.reflog', 'Reflog')}
                {lessonLink('git.internals.reachability', 'Reachability')}
              </div>
            </Card>
            <Card variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <h3 className="title-md" style={{ margin: 0 }}>{s.troubleshootingTitle}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <Link to="/troubleshooting/git/detached-head" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                  {isBn ? 'ডিটাচড HEAD' : 'Detached HEAD'} →
                </Link>
                <Link to="/troubleshooting/git/recover-commit" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                  {isBn ? 'মুছে যাওয়া কমিট উদ্ধার' : 'Recover Deleted Commit'} →
                </Link>
                <Link to="/troubleshooting/git/reset-hard" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                  {isBn ? 'ভুল reset --hard' : 'Accidental reset --hard'} →
                </Link>
              </div>
            </Card>
            <Card variant="outlined" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <h3 className="title-md" style={{ margin: 0 }}>{s.simulatorTitle}</h3>
              <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>{s.simulatorText}</p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <Link to="/workflows/everyday-git?scenario=rebase" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                  {isBn ? 'রিবেস ডেমো' : 'Rebase demo'} →
                </Link>
                <Link to="/workflows/everyday-git?scenario=merge" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                  {isBn ? 'মার্জ ডেমো' : 'Merge demo'} →
                </Link>
              </div>
              <h3 className="title-md" style={{ margin: 'var(--space-2) 0 0' }}>{s.githubTitle}</h3>
              <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>{s.githubText}</p>
              {lessonLink('github.pr.merging-pr', isBn ? 'PR মার্জ করা' : 'Merging a Pull Request')}
            </Card>
          </div>
        </section>

        {/* Code view of the teaching repo */}
        <section aria-label="HEAD">
          <CodeBlock
            code={`HEAD → main → M1 (merge: C3 + F2)\norigin/main → C3   (fetch pending)\nreflog: HEAD@{0..2} — merge, checkout, commit`}
            language="text"
          />
        </section>
      </div>
    </PageContainer>
  );
};
