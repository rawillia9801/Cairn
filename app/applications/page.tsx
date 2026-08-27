import { MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function Applications(){
  return <main>
    <MissionHeader eyebrow="Applications" title={<>Infrastructure for AI<br/>that has to last.</>} description="Cairn is intended for systems where continuity, provenance, migration and recovery become operational requirements rather than optional product features." telemetry={[
      <>AGENTS · <strong>PERSISTENT</strong></>,<>ENTERPRISE · <strong>TRACEABLE</strong></>,<>ROBOTICS · <strong>PORTABLE</strong></>,<>RECOVERY · <strong>VERIFIABLE</strong></>
    ]}/>
    <Section eyebrow="Deployment domains / 01" title="Long-lived systems accumulate history, obligations and state." description="The longer an AI system operates, the more expensive silent history loss or ambiguous recovery becomes.">
      <div className="info-grid">{[
        ['01','Persistent AI agents','Long-running assistants and agents that must survive model upgrades and provider transitions.'],
        ['02','Enterprise automation','Workflows where decisions, commitments and supporting evidence must remain traceable after infrastructure changes.'],
        ['03','Robotics & autonomous systems','Continuity that can survive changes in compute hardware, sensors, deployment environment or embodiment.'],
        ['04','High-accountability AI','Systems where operators need evidence of what changed, what remains authoritative and how state was derived.'],
        ['05','Developer agents','Software agents that maintain multi-day or multi-month work and need trustworthy resume semantics.'],
        ['06','Future embedded runtimes','Continuity infrastructure that can be licensed or embedded into long-lived autonomous systems.'],
      ].map(([n,t,p])=><article className="info-card" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    </Section>
    <PageCTA title="Meet the company building the continuity layer." href="/company" label="Company"/>
  </main>;
}
