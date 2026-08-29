import { MissionHeader, PageCTA, Section } from '../components/mission-control';

const timeline = [
  ['01','Initial work begins','The system begins recording decisions, sources, outcomes and unresolved work.','What actually happened?','Do we still have the original, append-only record?'],
  ['02','Model upgrade','A stronger cognition engine replaces the original without needing to erase the past.','What remains unresolved?','Which commitments, obligations and unfinished work still matter?'],
  ['03','Provider migration','The system moves to new infrastructure while history and provenance must remain portable.','What can be proven?','Can important state claims still trace back to source events and artifacts?'],
  ['04','Host move','Compute, storage or deployment environment changes underneath the system.','What survives replacement?','Which state is authoritative after the move?'],
  ['05','Recovery event','Failure, corruption or provider loss forces the system to reconstruct and resume.','Can recovery be verified?','Can the restored system prove it resumed from valid historical state?'],
];

export default function WhyContinuity(){
  return <main>
    <MissionHeader eyebrow="Why Continuity" title="Memory is not continuity." description="For a short-lived chat, retrieving recent context may be enough. For an AI system expected to operate for years, it is not." telemetry={[
      <>SESSION MEMORY · <strong>TEMPORARY</strong></>,<>VECTOR RETRIEVAL · <strong>PARTIAL</strong></>,<>AUTHORITATIVE HISTORY · <strong>REQUIRED</strong></>,<>RECOVERY · <strong>TESTABLE</strong></>
    ]}/>

    <Section eyebrow="Scenario / 01" title="Imagine an AI system that works with you for five years." description="Models improve. Providers change. Hosts move. Failures happen. Continuity asks whether the authoritative record survives all of it.">
      <div className="continuity-timeline">
        {timeline.map(([n,title,text,q,a]) => <article className="timeline-stop" key={n}>
          <div className="time-node">{n}</div>
          <span>{n === '01' ? 'YEAR 1' : n === '05' ? 'YEAR 5+' : `YEAR ${n}`}</span>
          <h3>{title}</h3>
          <p>{text}</p>
          <div className="timeline-question"><small>CONTINUITY QUESTION</small><b>{q}</b><p>{a}</p></div>
        </article>)}
      </div>
      <div className="memory-banner">
        <div><span>THE DIFFERENCE THAT MATTERS</span><h3>Memory can be revised. History must remain attributable.</h3></div>
        <p>Summaries can change and models can reinterpret prior events. Cairn is aimed at preserving what happened, where a later conclusion came from, and how authoritative state can be reconstructed after change.</p>
      </div>
    </Section>

    <Section eyebrow="Persistence vs continuity / 02" title="Existing tools solve pieces of the problem." description="Threads, vector databases, summaries and workflow checkpoints are useful. Cairn is aimed at the layer that determines what historical state is authoritative across change.">
      <div className="architecture-panel"><div className="panel-bar"><span>CONTINUITY GAP ANALYSIS</span><b>● REVIEWED</b></div><div className="architecture-grid">
        <article><span>THREADS</span><h3>Conversation state</h3><p>Useful for session continuity; often provider-specific.</p></article>
        <article><span>VECTOR MEMORY</span><h3>Semantic retrieval</h3><p>Useful for recall; does not inherently preserve chronology or authority.</p></article>
        <article><span>CHECKPOINTS</span><h3>Workflow resume</h3><p>Useful for process recovery; not necessarily cross-model historical continuity.</p></article>
        <article><span>SUMMARIES</span><h3>Compressed interpretation</h3><p>Useful for efficiency; mutable summaries can obscure what was original.</p></article>
        <article><span>CAIRN</span><h3>Continuity substrate</h3><p>History, provenance, checkpoints, reconstruction and transition semantics.</p></article>
        <article><span>RESEARCH</span><h3>Measured boundary</h3><p>Behavioral continuity is tested rather than assumed.</p></article>
      </div></div>
    </Section>
    <PageCTA title="See the architecture behind the continuity layer." href="/technology" label="Technology"/>
  </main>;
}
