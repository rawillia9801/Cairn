import Link from 'next/link';
import type { ReactNode } from 'react';

export function MissionHeader({ eyebrow, title, description, actions, telemetry = [] }: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  telemetry?: ReactNode[];
}) {
  return <>
    <header className="mission-header">
      <div>
        <div className="mission-eyebrow"><span/> {eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="mission-actions">{actions}</div> : null}
    </header>
    {telemetry.length ? <div className="telemetry-strip" aria-label="System telemetry">
      <div className="telemetry-lead"><i/> SYSTEM ONLINE</div>
      {telemetry.map((item, i) => <div className="telemetry-item" key={i}>{item}</div>)}
    </div> : null}
  </>;
}

export function MetricGrid({ items }: { items: { label:string; value:string; note:string }[] }) {
  return <div className="metric-grid">{items.map(item => <article key={item.label}>
    <span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small>
  </article>)}</div>;
}

export function Section({ eyebrow, title, description, children, className = '' }: {
  eyebrow?: string; title?: ReactNode; description?: ReactNode; children?: ReactNode; className?: string;
}) {
  return <section className={`mission-section ${className}`}>
    {(eyebrow || title || description) ? <div className="section-heading">
      <div>{eyebrow ? <div className="mission-eyebrow"><span/>{eyebrow}</div> : null}{title ? <h2>{title}</h2> : null}</div>
      {description ? <p>{description}</p> : null}
    </div> : null}
    {children}
  </section>;
}

export function ArchitectureFlow() {
  const modules = [
    ['01','Append-only history','Original events remain intact. New interpretations are appended rather than substituted.'],
    ['02','Provenance','State claims trace to source events, artifacts, actors and versions.'],
    ['03','Verified checkpoints','Recovery points can be cryptographically validated before resume or migration.'],
    ['04','State reconstruction','Authoritative state is rebuilt from evidence rather than trusted mutable summaries.'],
    ['05','Model transition','A replacement model rehydrates state without being required to imitate old outputs.'],
    ['06','Failure recovery','Recovery is tested across abrupt termination, corrupted memory and provider loss.'],
  ];
  return <div className="architecture-panel">
    <div className="panel-bar"><span>CAIRN / REFERENCE ARCHITECTURE</span><b>● SYSTEM NOMINAL</b></div>
    <div className="architecture-flow">
      <div className="architecture-node"><small>COGNITION ENGINE A</small><strong>Model / Provider / Host</strong></div>
      <i>→</i>
      <div className="architecture-node core"><small>AUTHORITATIVE LAYER</small><strong>CAIRN CONTINUITY</strong></div>
      <i>→</i>
      <div className="architecture-node"><small>COGNITION ENGINE B</small><strong>Replacement / Upgrade</strong></div>
    </div>
    <div className="architecture-grid">{modules.map(([num,title,text]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
  </div>;
}

export function PageCTA({ title, href, label }: {title:string; href:string; label:string}) {
  return <div className="page-cta"><div><span>CAIRN CONTINUUM</span><h2>{title}</h2></div><Link className="button primary" href={href}>{label}</Link></div>;
}
