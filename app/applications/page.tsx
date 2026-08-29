import { MissionHeader, PageCTA, Section } from '../components/mission-control';

const scenarios = [
  ['01','Persistent AI agents','A long-running assistant reaches month 18. The underlying model is retired, but unresolved work, prior decisions and commitments still matter.','Months to years','Resume without silent reset'],
  ['02','Enterprise automation','A workflow crosses teams, models and systems. Audit questions arrive months later and the original evidence still needs to be traceable.','Days to years','Traceable operational history'],
  ['03','Robotics & autonomous systems','A physical platform gets new sensors and compute hardware. The body changes; the continuity layer should not have to start over.','Missions to years','Portable state across hardware'],
  ['04','High-accountability AI','An operator must prove what changed, when it changed, why it changed and which evidence supports the current state.','Long-lived','Trust through provenance'],
  ['05','Developer agents','A software agent maintains multi-week work across tool permissions, environment changes, deployments and model upgrades.','Days to months','Reliable resume semantics'],
  ['06','Embedded continuity runtimes','A product embeds continuity infrastructure beneath its own AI experience so cognition can evolve without losing historical authority.','Product lifecycle','Durable intelligence layer'],
];

export default function Applications(){
  return <main>
    <MissionHeader eyebrow="Applications" title={<>Infrastructure for AI<br/>that has to last.</>} description="Cairn is intended for systems where continuity, provenance, migration and recovery become operational requirements rather than optional product features." telemetry={[
      <>AGENTS · <strong>PERSISTENT</strong></>,<>ENTERPRISE · <strong>TRACEABLE</strong></>,<>ROBOTICS · <strong>PORTABLE</strong></>,<>RECOVERY · <strong>VERIFIABLE</strong></>
    ]}/>
    <Section eyebrow="Operational scenarios / 01" title="The longer an AI system operates, the more continuity becomes infrastructure." description="These are not feature categories. They are situations where silent history loss, ambiguous reconstruction or provider dependence becomes operationally expensive.">
      <div className="scenario-grid">{scenarios.map(([n,t,p,life,benefit])=><article className="scenario-card" key={n}>
        <span>{n}</span><h3>{t}</h3><p>{p}</p>
        <div className="scenario-meta"><div><small>OPERATING HORIZON</small><b>{life}</b></div><div><small>CONTINUITY VALUE</small><b><i/>{benefit}</b></div></div>
      </article>)}</div>
    </Section>
    <PageCTA title="See how Cairn is testing the boundary between preserved state and actual continuity." href="/research" label="Research program"/>
  </main>;
}
