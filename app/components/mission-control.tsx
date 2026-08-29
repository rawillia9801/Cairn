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
  const services = [
    ['01','Append-only history','Original events remain immutable and time-ordered. New understanding is appended, never silently substituted.'],
    ['02','Provenance','Claims remain traceable to sources, actors, models, versions and time.'],
    ['03','Content-addressed originals','Original artifacts remain independently addressable by cryptographic content identity.'],
    ['04','State reconstruction','Authoritative state is rebuilt from verified evidence rather than trusted mutable summaries.'],
    ['05','Verifiable checkpoints','Recovery points can be cryptographically validated before resume, migration or rollback.'],
    ['06','Recovery & transition','A replacement cognition engine can resume without state loss or forced imitation of old outputs.'],
  ];
  const persistence = [
    ['Immutable persistence','History cannot be silently overwritten.'],
    ['Cryptographic integrity','Objects and checkpoints can be hashed, linked and verified.'],
    ['Portable recovery','Verified state can move across hosts and providers.'],
    ['Operational resilience','The system is designed for failure, restoration and long-term change.'],
  ];

  return <div className="tech-architecture">
    <div className="tech-bar"><span>CAIRN / REFERENCE ARCHITECTURE</span><b>● CONTINUITY SUBSTRATE NOMINAL</b></div>
    <div className="tech-layer-label">Replaceable cognition layer</div>
    <div className="tech-cognition">
      <div className="tech-engine"><span>COGNITION ENGINE A</span><strong>Model / Provider / Host A</strong></div>
      <div className="tech-arrow">→</div>
      <div className="tech-core"><span>AUTHORITATIVE CONTINUITY LAYER</span><strong>CAIRN CONTINUITY</strong><small>Independent of any single model</small></div>
      <div className="tech-arrow">→</div>
      <div className="tech-engine"><span>COGNITION ENGINE B</span><strong>Replacement / Upgrade</strong></div>
    </div>
    <div className="tech-layer-label">Continuity services</div>
    <div className="tech-services">{services.map(([n,t,p]) => <article className="tech-service" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    <div className="tech-layer-label">Verified persistence</div>
    <div className="tech-persistence">{persistence.map(([t,p]) => <article key={t}><b><i/>{t}</b><p>{p}</p></article>)}</div>
  </div>;
}

export function PageCTA({ title, href, label }: {title:string; href:string; label:string}) {
  return <div className="page-cta"><div><span>CAIRN CONTINUUM</span><h2>{title}</h2></div><Link className="button primary" href={href}>{label}</Link></div>;
}
