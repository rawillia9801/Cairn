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
    ['01','Preserved event history','Important events stay in order. New information is added instead of silently replacing the old record.'],
    ['02','Source tracing','Important claims can point back to where they came from, who or what created them, and when.'],
    ['03','Original records preserved','Original files and artifacts remain independently available instead of being replaced by summaries.'],
    ['04','Rebuild current state','The system can rebuild what is true now from verified history instead of trusting a mutable summary.'],
    ['05','Verified checkpoints','Recovery points can be checked before the system resumes after a move, failure or restore.'],
    ['06','Model change & recovery','A replacement AI model can resume from the same trusted history without having to copy the old model word for word.'],
  ];
  const persistence = [
    ['History cannot be silently overwritten','The original record stays intact.'],
    ['Integrity can be checked','Important objects and checkpoints can be verified for unexpected changes.'],
    ['Recovery can move','Trusted state can be carried across hosts and providers.'],
    ['Failure is part of the design','The system is built with restoration and long-term change in mind.'],
  ];

  return <div className="tech-architecture">
    <div className="tech-bar"><span>CAIRN / REFERENCE ARCHITECTURE</span><b>● CONTINUITY LAYER ONLINE</b></div>
    <div className="tech-layer-label">AI model layer</div>
    <div className="tech-cognition">
      <div className="tech-engine"><span>MODEL A</span><strong>Current model / provider / host</strong></div>
      <div className="tech-arrow">→</div>
      <div className="tech-core"><span>TRUSTED HISTORY + RECOVERY</span><strong>CAIRN CONTINUITY</strong><small>Kept separate from any one model</small></div>
      <div className="tech-arrow">→</div>
      <div className="tech-engine"><span>MODEL B</span><strong>Replacement / upgrade</strong></div>
    </div>
    <div className="tech-layer-label">What Cairn keeps</div>
    <div className="tech-services">{services.map(([n,t,p]) => <article className="tech-service" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    <div className="tech-layer-label">What that enables</div>
    <div className="tech-persistence">{persistence.map(([t,p]) => <article key={t}><b><i/>{t}</b><p>{p}</p></article>)}</div>
  </div>;
}

export function PageCTA({ title, href, label }: {title:string; href:string; label:string}) {
  return <div className="page-cta"><div><span>CAIRN CONTINUUM</span><h2>{title}</h2></div><Link className="button primary" href={href}>{label}</Link></div>;
}
