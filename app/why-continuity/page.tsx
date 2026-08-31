import { MissionHeader, PageCTA, Section } from '../components/mission-control';

const timeline = [
  ['01','The work begins','The system starts recording decisions, sources, outcomes and unfinished work.','What actually happened?','Do we still have the original record?'],
  ['02','The model changes','A stronger AI model replaces the original.','What is still unfinished?','Which commitments and tasks still matter?'],
  ['03','The provider changes','The system moves to a different provider.','Can we still trace the past?','Can important decisions still be tied back to their sources?'],
  ['04','The hardware changes','Compute or storage moves to a different environment.','What survived the move?','Which version of the current state should be trusted?'],
  ['05','Something fails','A failure or damaged state forces the system to recover.','Can we trust the recovery?','Can the restored system show that it resumed from a valid record?'],
];

export default function WhyContinuity(){
  return <main>
    <MissionHeader eyebrow="Why Continuity" title="Memory is useful. Continuity is bigger." description="For a short chat, remembering recent context may be enough. For an AI system expected to work for years or decades, it is not." telemetry={[
      <>SESSION MEMORY · <strong>TEMPORARY</strong></>,<>RETRIEVAL · <strong>PARTIAL</strong></>,<>HISTORY · <strong>PRESERVED</strong></>,<>RECOVERY · <strong>TESTABLE</strong></>
    ]}/>

    <Section eyebrow="Imagine this / 01" title="Imagine an AI system that stays with you for decades." description="Over that time, models will change. Providers will change. Hardware will fail and be replaced. The system may move, upgrade and recover many times. Its history, decisions, unfinished work and commitments should not disappear when the technology underneath it changes.">
      <div className="continuity-timeline">
        {timeline.map(([n,title,text,q,a]) => <article className="timeline-stop" key={n}>
          <div className="time-node">{n}</div>
          <span>STAGE {n}</span>
          <h3>{title}</h3>
          <p>{text}</p>
          <div className="timeline-question"><small>KEY QUESTION</small><b>{q}</b><p>{a}</p></div>
        </article>)}
      </div>
      <div className="memory-banner">
        <div><span>THE DIFFERENCE THAT MATTERS</span><h3>Memory can change. The original history should not.</h3></div>
        <p>Summaries can be rewritten and a new model may interpret old events differently. Cairn is aimed at keeping the original record, the source behind important conclusions and a reliable way to rebuild the current state.</p>
      </div>
    </Section>

    <Section eyebrow="What existing tools already do / 02" title="A lot of useful tools solve part of the problem." description="Conversation threads, vector search, summaries and workflow checkpoints all help. Cairn is focused on the missing piece: keeping a trustworthy history when the model or infrastructure changes.">
      <div className="architecture-panel"><div className="panel-bar"><span>WHERE THE TOOLS FIT</span><b>● CONTINUITY VIEW</b></div><div className="architecture-grid">
        <article><span>THREADS</span><h3>Keep a conversation going</h3><p>Useful inside a session or product, but often tied to one provider.</p></article>
        <article><span>VECTOR MEMORY</span><h3>Find relevant information</h3><p>Useful for recall, but it does not automatically preserve the order of events or which record is authoritative.</p></article>
        <article><span>CHECKPOINTS</span><h3>Restart a process</h3><p>Useful for resuming a workflow, but not necessarily for carrying years of history across a model change.</p></article>
        <article><span>SUMMARIES</span><h3>Compress what happened</h3><p>Useful for speed, but a summary is still an interpretation of the original record.</p></article>
        <article><span>CAIRN</span><h3>Keep the trusted history underneath</h3><p>Preserved history, linked sources, checkpoints, recovery and model transition.</p></article>
        <article><span>RESEARCH</span><h3>Test what actually survives</h3><p>We measure the limits instead of assuming the answer.</p></article>
      </div></div>
    </Section>

    <PageCTA title="See the technology behind the continuity layer." href="/technology" label="Technology"/>
  </main>;
}
