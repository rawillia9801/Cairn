import { ArchitectureFlow, MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function Technology(){
  return <main>
    <MissionHeader eyebrow="Technology" title="Continuity is a systems layer." description="Cairn is designed to keep historical authority, provenance, recovery and state reconstruction outside the replaceable cognition engine." telemetry={[
      <>EVENT LEDGER · <strong>APPEND-ONLY</strong></>,<>PROVENANCE · <strong>LINKED</strong></>,<>CHECKPOINTS · <strong>VERIFIABLE</strong></>,<>MODEL TRANSITION · <strong>DECOUPLED</strong></>
    ]}/>
    <Section eyebrow="Reference architecture / 01" title="A stable continuity substrate underneath replaceable intelligence." description="The cognition engine can change while the continuity substrate remains responsible for authoritative history and recovery semantics."><ArchitectureFlow/></Section>
    <Section eyebrow="Core modules / 02" title="Evidence first. Derived state second." description="The system is intended to preserve original evidence independently from later model-generated interpretation.">
      <div className="info-grid">{[
        ['01','Append-only event ledger','Continuity-significant events record predecessor linkage, sources, actor/process, time, schema version and integrity metadata.'],
        ['02','Content-addressed originals','Original artifacts remain independently addressable so derived summaries never become the only record.'],
        ['03','Provenance-linked memory','Episodic, semantic, working and reflective memory can coexist without losing evidence behind later conclusions.'],
        ['04','Cryptographic checkpoints','Recovery points can be validated before resume, migration, rollback or restoration.'],
        ['05','State reconstruction','Current authoritative state is derived from verified historical evidence rather than assumed from mutable summaries.'],
        ['06','Transition protocol','A replacement cognition engine rehydrates prior commitments and state without being required to imitate old outputs.'],
      ].map(([n,t,p])=><article className="info-card" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    </Section>
    <Section eyebrow="What Cairn is not / 03" title="Not another memory wrapper." description="Cairn sits below the model-facing memory experience and focuses on historical authority, recovery and migration.">
      <div className="info-grid">{[
        ['A','Not a personality prompt','Continuity is not simulated by telling a replacement model who it is.'],
        ['B','Not just vector memory','Retrieval is useful, but retrieval alone does not establish authoritative history.'],
        ['C','Not just workflow checkpointing','Resuming a process is different from continuity across cognition-engine replacement.'],
      ].map(([n,t,p])=><article className="info-card" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    </Section>
    <PageCTA title="See how the architecture is being tested." href="/research" label="Research program"/>
  </main>;
}
