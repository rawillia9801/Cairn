import { MissionHeader, PageCTA, Section } from '../components/mission-control';

const scenarios = [
  ['01','Long-running AI assistants','An assistant reaches month 18. The model underneath it is retired, but unfinished work, prior decisions and commitments still matter.','Months to years','Keep working after a model change'],
  ['02','Business automation','A workflow crosses teams, models and systems. Months later, someone still needs to know what happened and why.','Days to years','Keep a traceable work history'],
  ['03','Robotics & autonomous systems','A physical system gets new sensors, new compute or a new model. The hardware changes, but the history should not have to start over.','Missions to years','Carry state across hardware changes'],
  ['04','High-accountability AI','An operator needs to show what changed, when it changed and what evidence supports the current state.','Long-lived','Make important actions explainable'],
  ['05','Developer agents','A software agent works across weeks of code changes, permissions, environments, deployments and model upgrades.','Days to months','Resume reliably after change'],
  ['06','Products with built-in continuity','A product keeps its own continuity layer underneath the AI experience so the model can evolve without losing the system history.','Product lifecycle','Keep history independent of one model'],
];

export default function Applications(){
  return <main>
    <MissionHeader eyebrow="Applications" title={<>For AI systems<br/>that have to last.</>} description="Cairn is meant for situations where losing history, restarting from scratch or being locked to one model becomes a real operational problem." telemetry={[
      <>AGENTS · <strong>LONG-RUNNING</strong></>,<>BUSINESS · <strong>TRACEABLE</strong></>,<>ROBOTICS · <strong>PORTABLE</strong></>,<>RECOVERY · <strong>VERIFIABLE</strong></>
    ]}/>

    <Section eyebrow="Where this matters / 01" title="The longer an AI system runs, the more its past starts to matter." description="These are examples of where a lost or unreliable history can become expensive, confusing or unsafe.">
      <div className="scenario-grid">{scenarios.map(([n,t,p,life,benefit])=><article className="scenario-card" key={n}>
        <span>{n}</span><h3>{t}</h3><p>{p}</p>
        <div className="scenario-meta"><div><small>HOW LONG IT RUNS</small><b>{life}</b></div><div><small>WHY CONTINUITY HELPS</small><b><i/>{benefit}</b></div></div>
      </article>)}</div>
    </Section>

    <PageCTA title="See what Cairn has already tested and what is still open." href="/research" label="Research"/>
  </main>;
}
