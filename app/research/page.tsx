import { MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function Research(){
  const objectives = [
    ['OBJ-01','Continuity ledger & provenance','Design append-only history and test alteration, deletion, reordering, duplication and partial-write corruption.'],
    ['OBJ-02','State reconstruction & memory separation','Define which information remains verbatim versus derived and recover predefined state assertions and unresolved commitments.'],
    ['OBJ-03','Model & hardware transition','Test materially different model configurations plus controlled host migration.'],
    ['OBJ-04','Continuity evaluation framework','Measure resumption accuracy, decision recovery, provenance accuracy, tamper detection and revision without historical erasure.'],
    ['OBJ-05','Failure & security testing','Simulate abrupt termination, provider loss, corrupted derived memory, replay attempts, restore scenarios and unauthorized history modification.'],
  ];
  return <main>
    <MissionHeader eyebrow="Research Program" title={<>Test the boundary.<br/>Measure what survives.</>} description="The central research risk is that a new cognition engine may interpret preserved history differently even when systems-layer state is perfect." telemetry={[
      <>MODEL CHANGE · <strong>TEST</strong></>,<>HOST MIGRATION · <strong>TEST</strong></>,<>MEMORY CORRUPTION · <strong>TEST</strong></>,<>TAMPER DETECTION · <strong>TEST</strong></>
    ]}/>
    <Section eyebrow="Technical objectives / 01" title="We are testing the boundary, not assuming the answer." description="Preserving bytes is not enough. The research is designed to identify which continuity guarantees can be deterministic at the systems layer and which remain model-dependent.">
      <div className="architecture-panel"><div className="panel-bar"><span>PHASE I OBJECTIVE BOARD</span><b>● ACTIVE PROGRAM</b></div><div className="architecture-grid">
        {objectives.map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}
        <article><span>RISK</span><h3>Behavioral continuity</h3><p>State preservation may be perfect while model interpretation still changes materially. That boundary must be quantified.</p></article>
      </div></div>
    </Section>
    <Section eyebrow="Experiment matrix / 02" title="Failure is part of the test plan." description="The continuity layer is evaluated under deliberate transition, corruption and recovery conditions.">
      <div className="info-grid">{[
        ['01','Model replacement','Compare recovery of commitments and provenance after cognition-engine change.'],
        ['02','Host migration','Measure state equivalence after controlled infrastructure movement.'],
        ['03','Derived-memory corruption','Verify that original history remains authoritative when summaries or caches are damaged.'],
        ['04','Provider failure','Test whether continuity can survive the loss of a model provider or session.'],
        ['05','History tampering','Detect deliberate mutation, deletion, reorder and replay attempts.'],
        ['06','Backup restoration','Restore from verified state and measure recovery correctness.'],
      ].map(([n,t,p])=><article className="info-card" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    </Section>
    <PageCTA title="See where persistent continuity becomes operationally valuable." href="/applications" label="Applications"/>
  </main>;
}
