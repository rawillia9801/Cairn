import Link from 'next/link';
import { MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function Research(){
  const objectives = [
    ['01','Keep a trustworthy history','Test whether important events can be preserved in order and whether tampering, deletion or corruption can be detected.'],
    ['02','Rebuild the current state','Test whether the system can recover what is true now, what is unfinished and what changed over time.'],
    ['03','Survive model and hardware changes','Test what happens when the AI model, provider or machine underneath the system changes.'],
    ['04','Measure the results','Score recovery accuracy, source tracing, unfinished work, tamper detection and model-to-model differences.'],
    ['05','Test failure on purpose','Break checkpoints, damage derived memory, alter history and simulate provider loss to see whether recovery stays trustworthy.'],
  ];

  return <main>
    <MissionHeader eyebrow="Research" title={<>Do the tests.<br/>Show the results.</>} description="Cairn is built around a hard question: can an AI system keep a trustworthy history even when the model underneath it changes? We are testing that directly instead of assuming the answer." telemetry={[
      <>MODEL CHANGE · <strong>TESTED</strong></>,<>RECOVERY · <strong>MEASURED</strong></>,<>CORRUPTION · <strong>TESTED</strong></>,<>RESULTS · <strong>PUBLISHED</strong></>
    ]}/>

    <Section eyebrow="What we are testing / 01" title="Five things have to work for continuity to mean anything." description="The research focuses on practical questions: can the history be trusted, can the system recover, and can a different model continue from the same record?">
      <div className="architecture-panel"><div className="panel-bar"><span>RESEARCH PROGRAM</span><b>● ACTIVE</b></div><div className="architecture-grid">
        {objectives.map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}
        <article><span>LIMIT</span><h3>Different models may still think differently</h3><p>Even with the same preserved history, a replacement model may interpret some things differently. That is part of what we measure.</p></article>
      </div></div>
    </Section>

    <Section eyebrow="How we test it / 02" title="We deliberately create the kinds of changes that should be hard." description="The system is tested under model changes, infrastructure moves, damaged memory, provider loss and altered history.">
      <div className="info-grid">{[
        ['01','Replace the model','Give a different AI model the same preserved history and compare what it recovers.'],
        ['02','Move the system','Change the host or infrastructure and check whether the recovered state still matches.'],
        ['03','Damage derived memory','Corrupt summaries or cached memory and verify that the original history still wins.'],
        ['04','Lose a provider','Test whether continuity can survive losing the model provider or the active session.'],
        ['05','Tamper with history','Delete, reorder or alter protected records and verify that the change is detected.'],
        ['06','Restore from backup','Recover from a verified state and compare the result with the expected baseline.'],
      ].map(([n,t,p])=><article className="info-card" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    </Section>

    <Section eyebrow="The three big questions / 03" title="These are the questions that can make or break the idea." description="Q1 asks whether continuity survives a model change. Q2 asks whether recovery still works as history becomes very large. Q3 will compare structured history with simply giving a model a huge amount of old context.">
      <div className="info-grid">{[
        ['Q1','Can a different model pick up the same work?','We test whether different model families recover the same state, unfinished commitments and source relationships from the same preserved history.'],
        ['Q2','Can recovery stay fast as the history grows?','We test whether normal recovery can start from a trusted checkpoint instead of replaying everything from the beginning.'],
        ['Q3','Is structured history better than just carrying more context?','This is the next major comparison. We have not marked it complete because the full test has not been run yet.'],
      ].map(([n,t,p])=><article className="info-card" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    </Section>

    <Section eyebrow="What we have learned so far / 04" title="Some of those questions now have real answers." description="These results came from controlled synthetic tests. They are useful evidence, not promises about every future production system.">
      <div className="info-grid">
        <article className="info-card">
          <span>Q1 · SUPPORTED</span>
          <h3>Different model families recovered the same operational state</h3>
          <p>In Trial 001, two materially different model families recovered the same predefined state, unfinished commitments, revisions and resume point from the same preserved package.</p>
          <p>Trial 002 then tested whether a smaller structured source package could remain portable. Claude and Grok met every required target. Gemini remains recorded as a partial result.</p>
          <p><Link href="/research/results#q1-trial-001">Trial 001 results →</Link> · <Link href="/research/results#q1-trial-002">Trial 002 results →</Link></p>
        </article>

        <article className="info-card">
          <span>Q2 · TRIAL 001 SUPPORTED</span>
          <h3>A million-event history did not require a million-event normal recovery</h3>
          <p>At one million lifetime events, verified checkpoint recovery rebuilt the same final state while replaying only the most recent 10,000 events. The dependency-aware path needed just 232 relevant events.</p>
          <p><Link href="/research/results#q2-trial-001">View Trial 001 results →</Link></p>
        </article>

        <article className="info-card">
          <span>Q2 · TRIAL 002 SUPPORTED</span>
          <h3>Recovery stayed almost unchanged while total history grew 10×</h3>
          <p>We held the recovery window at exactly 10,000 events while lifetime history grew from 100,000 to 1,000,000 events. Full replay grew from about 680 ms to about 6.8 seconds. Fixed-age recovery stayed about 73.7 ms at both sizes.</p>
          <p>Corruption tests produced zero silent false verifications.</p>
          <p><Link href="/research/results#q2-trial-002">View Trial 002 results →</Link></p>
        </article>

        <article className="info-card">
          <span>Q3 · NEXT</span>
          <h3>Structured history versus brute-force context</h3>
          <p>This test is still open. We will compare the two approaches directly instead of claiming one is better before the data exists.</p>
          <p><Link href="/research/results">See the current results →</Link></p>
        </article>
      </div>
    </Section>

    <Section eyebrow="Research notes / 05" title="Why this problem matters beyond Cairn." description="Research Notes connect the engineering work to larger questions about AI safety, accountability and long-lived systems.">
      <Link className="featured-research-note" href="/research/continuity-is-part-of-ai-safety">
        <div className="featured-note-meta"><span>RESEARCH NOTE 001</span><b>AUGUST 2026</b></div>
        <div className="featured-note-body">
          <div>
            <small>AI SAFETY · ACCOUNTABILITY · CONTINUITY</small>
            <h3>Continuity Is Part of AI Safety</h3>
            <p>Bill Gates recently wrote about the difficult choices ahead as AI becomes more capable and autonomous. This note looks at one part of that challenge: keeping a trustworthy history as models and infrastructure change.</p>
          </div>
          <span className="featured-note-arrow">→</span>
        </div>
      </Link>
    </Section>

    <PageCTA title="Read the completed test results in plain language." href="/research/results" label="Research Results"/>
  </main>;
}
