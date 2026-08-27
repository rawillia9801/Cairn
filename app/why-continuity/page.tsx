import { MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function WhyContinuity(){
  return <main>
    <MissionHeader eyebrow="Why Continuity" title="Memory is not continuity." description="For a short-lived chat, retrieving recent context may be enough. For an AI system expected to operate for years, it is not." telemetry={[
      <>SESSION MEMORY · <strong>TEMPORARY</strong></>,<>VECTOR RETRIEVAL · <strong>PARTIAL</strong></>,<>AUTHORITATIVE HISTORY · <strong>REQUIRED</strong></>,<>RECOVERY · <strong>TESTABLE</strong></>
    ]}/>
    <Section eyebrow="Scenario / 01" title="Imagine an AI system that works with you for five years." description="During that time the model changes, the host moves, a provider becomes unavailable, derived memory is revised and hardware eventually fails.">
      <div className="info-grid">
        {[
          ['01','What actually happened?','Can the system distinguish original history from a later summary or interpretation?'],
          ['02','What remains unresolved?','Can it recover prior commitments, obligations and unfinished work?'],
          ['03','What can be proven?','Can important state claims trace back to source events and original artifacts?'],
          ['04','What survives replacement?','Can continuity persist even when the model, host or provider does not?'],
          ['05','What was later interpretation?','Can new conclusions be appended without erasing earlier understanding?'],
          ['06','Can recovery be verified?','Can a restored system prove that it resumed from a valid historical state?'],
        ].map(([n,t,p])=><article className="info-card" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}
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
