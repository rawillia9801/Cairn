import Link from "next/link";
import type { ReactNode } from "react";

export function MissionHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="missionHeader">
      <div className="missionHeading">
        <div className="missionEyebrow"><span aria-hidden="true" />{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="missionActions">{actions}</div> : null}
    </header>
  );
}

export function TelemetryStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="telemetryStrip" aria-label="Cairn system telemetry">
      <div className="telemetryLead"><i aria-hidden="true" /> SYSTEM ONLINE</div>
      {items.map((item) => (
        <div className="telemetryItem" key={item.label}>
          <span>{item.label}</span><strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: ReactNode; body?: ReactNode }) {
  return (
    <div className="sectionHeading">
      <div>
        <div className="sectionEyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {body ? <div className="sectionIntro">{body}</div> : null}
    </div>
  );
}

export function MetricGrid({ items }: { items: { label: string; value: string; detail: string }[] }) {
  return (
    <div className="metricGrid">
      {items.map((item) => (
        <article key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <small>{item.detail}</small>
        </article>
      ))}
    </div>
  );
}

export function MissionTabs({ active }: { active: string }) {
  const tabs = [
    ["Overview", "/"],
    ["Why Continuity", "/why-continuity"],
    ["Technology", "/technology"],
    ["Research", "/research"],
    ["Applications", "/applications"],
    ["Company", "/company"],
  ] as const;
  return (
    <nav className="missionTabs" aria-label="Cairn mission sections">
      {tabs.map(([label, href]) => (
        <Link className={label === active ? "missionTab active" : "missionTab"} href={href} key={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function ArchitectureFlow() {
  return (
    <div className="architecturePanel">
      <div className="instrumentHeader">
        <span>REFERENCE ARCHITECTURE / CONTINUITY PATH</span>
        <b>MODEL-INDEPENDENT</b>
      </div>
      <div className="architectureFlow">
        <div className="architectureNode mutedNode"><small>COGNITION ENGINE A</small><strong>Model / Provider / Host</strong></div>
        <div className="flowConnector"><span>01</span><i>→</i></div>
        <div className="architectureNode cairnNode"><small>AUTHORITATIVE SYSTEM LAYER</small><strong>CAIRN CONTINUITY</strong><em>ledger · provenance · state · checkpoints</em></div>
        <div className="flowConnector"><span>02</span><i>→</i></div>
        <div className="architectureNode mutedNode"><small>COGNITION ENGINE B</small><strong>Replacement / Upgrade</strong></div>
      </div>
      <div className="instrumentFooter">
        <span>Original history retained</span><span>State reconstructed from evidence</span><span>New cognition engine rehydrated</span>
      </div>
    </div>
  );
}
