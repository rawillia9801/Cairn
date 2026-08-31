import { ArchitectureFlow, MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function Technology(){
  return <main>
    <MissionHeader eyebrow="Technology" title="Keep the history separate from the model." description="Cairn is designed so the system's trusted history, sources and recovery process do not live only inside the AI model that happens to be running today." telemetry={[
      <>EVENT HISTORY · <strong>APPEND-ONLY</strong></>,<>SOURCES · <strong>LINKED</strong></>,<>CHECKPOINTS · <strong>VERIFIABLE</strong></>,<>MODEL CHANGE · <strong>SUPPORTED</strong></>
    ]}/>

    <Section eyebrow="How it fits together / 01" title="The model can change. The continuity layer stays with the system." description="The AI model does the thinking. Cairn keeps the history and recovery record underneath it."><ArchitectureFlow/></Section>

    <Section eyebrow="Core pieces / 02" title="Keep the original record first. Build summaries and working memory on top of it." description="The point is simple: a later summary should never become the only version of what happened.">
      <div className="info-grid">{[
        ['01','Append-only event history','Important events are added in order with links to what came before, where the information came from and integrity data that helps detect tampering.'],
        ['02','Original files stay addressable','Original documents and artifacts remain available so a later summary does not replace the source material.'],
        ['03','Memory linked back to evidence','Working memory, summaries and conclusions can point back to the records that support them.'],
        ['04','Verified checkpoints','Recovery points can be checked before the system resumes after a move, failure or restore.'],
        ['05','State reconstruction','The current working state is rebuilt from verified history instead of being trusted just because a summary says it is correct.'],
        ['06','Model transition','A replacement model can recover prior state and unfinished commitments without having to imitate the old model word for word.'],
      ].map(([n,t,p])=><article className="info-card" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    </Section>

    <Section eyebrow="What Cairn is not / 03" title="This is more than adding memory to a chatbot." description="Memory tools are useful. Cairn is focused on what happens when the model changes, the system moves or recovery has to be trusted.">
      <div className="info-grid">{[
        ['A','Not a personality prompt','Telling a new model who it is does not prove that it recovered the old system correctly.'],
        ['B','Not just vector memory','Search and retrieval help with recall, but they do not automatically preserve the order of events or which record should be trusted.'],
        ['C','Not just workflow checkpointing','Restarting a process is different from carrying years of history across a model replacement.'],
      ].map(([n,t,p])=><article className="info-card" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    </Section>

    <PageCTA title="See what parts of this architecture have already been tested." href="/research" label="Research"/>
  </main>;
}
