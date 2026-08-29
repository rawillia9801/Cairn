import Link from 'next/link';
import { MissionHeader, Section } from '../../components/mission-control';

const responses = [
  {
    concern: 'Increasingly autonomous systems may behave in ways their designers did not anticipate.',
    response: 'Append-only history and provenance can preserve evidence of what occurred, what informed it, and what changed afterward.'
  },
  {
    concern: 'More capable systems may become harder to supervise continuously.',
    response: 'Explicit authority boundaries, verifiable state, and attributable transitions can make oversight less dependent on constant human observation.'
  },
  {
    concern: 'Models, providers, and infrastructure will change rapidly.',
    response: 'Cairn separates continuity from the replaceable cognition layer so that migration does not automatically erase operational history.'
  },
  {
    concern: 'Failures, compromises, or corrupted memory can undermine trust.',
    response: 'Content-addressed originals, cryptographically verifiable checkpoints, and reconstruction from authoritative evidence are designed to support recovery.'
  },
  {
    concern: 'AI capability may become concentrated in a small number of platforms.',
    response: 'Model-independent continuity can reduce dependence on any single cognition provider by making verified history and recovery portable.'
  },
  {
    concern: 'Trust will become more important as systems take on consequential work.',
    response: 'Cairn is investigating whether trust can rest more heavily on verifiable records and less on a model simply explaining itself after the fact.'
  },
];

export default function ContinuityIsPartOfAISafety(){
  return <main>
    <MissionHeader
      eyebrow="Research Note 001 · August 2026"
      title={<>Continuity is part<br/>of AI safety.</>}
      description={<>Bill Gates recently described a turbulent period ahead as AI systems become more capable, autonomous, and deeply integrated into society. Many of the risks he identifies deserve serious engineering attention. At Cairn Continuum, our work focuses on one part of that challenge: whether increasingly capable AI systems can remain attributable, recoverable, and accountable across changes in models, infrastructure, and time.</>}
      telemetry={[
        <>ACCOUNTABILITY · <strong>PROVENANCE</strong></>,
        <>RECOVERY · <strong>VERIFIABLE</strong></>,
        <>MODEL CHANGE · <strong>PORTABLE</strong></>,
        <>HISTORY · <strong>APPEND-ONLY</strong></>
      ]}
    />

    <Section className="research-note-lead">
      <div className="research-note-source">
        <span>CONTEXT</span>
        <p>This note responds to themes raised in Bill Gates’s essay <em>A Turbulent AI Era and Critical Choices to Make</em>. It is not a rebuttal. We agree with the premise that society should not wait until highly autonomous systems are ubiquitous before building the infrastructure needed to govern them responsibly.</p>
        <a href="https://www.gatesnotes.com/a-turbulent-ai-era-and-critical-choices-to-make" target="_blank" rel="noreferrer">Read the original essay ↗</a>
      </div>
      <div className="research-note-thesis">
        <span>CAIRN POSITION</span>
        <h2>More capable AI needs more than better models.</h2>
        <p>It needs durable evidence: what happened, what the system knew, what changed, which authority was exercised, and whether recovery or migration preserved the same operational history.</p>
      </div>
    </Section>

    <Section eyebrow="The missing layer / 01" title="Capability is advancing faster than continuity infrastructure." description="A model can be replaced in an afternoon. A long-lived system may operate for years. The gap between those timescales creates an accountability problem that model quality alone cannot solve.">
      <div className="research-prose-grid">
        <article>
          <h3>Persistent systems accumulate obligations.</h3>
          <p>An AI system that works over weeks, months, or years may accumulate unresolved commitments, evidence, decisions, exceptions, user preferences, and operational context. If the cognition engine changes, simply preserving a database does not prove that the new system reconstructed those obligations correctly.</p>
        </article>
        <article>
          <h3>Memory is not the same as history.</h3>
          <p>Summaries, vector stores, caches, and model-generated recollections are useful, but they are derived representations. They can be incomplete, revised, corrupted, or interpreted differently by another model. Accountability requires an authoritative historical layer beneath those conveniences.</p>
        </article>
      </div>
    </Section>

    <Section eyebrow="Accountability / 02" title="Control and accountability are not synonyms." description="One area where we believe the public conversation deserves further development is the distinction between controlling an intelligent system and making that system accountable for consequential actions.">
      <div className="research-principle">
        <div>
          <span>PRINCIPLE</span>
          <h3>Safeguards should scale with demonstrated risk and authority.</h3>
        </div>
        <p>Greater capability can justify stronger evidence requirements, tighter authority boundaries, better recovery mechanisms, and more rigorous auditing. It does not follow that every increase in intelligence must automatically require broader permanent control. The engineering goal should be accountable autonomy: systems that can act within defined authority while leaving durable, inspectable evidence behind.</p>
      </div>
    </Section>

    <Section eyebrow="Engineering response / 03" title="Where Cairn can contribute." description="Cairn does not claim to solve every risk raised in the broader AI debate. It targets a narrower systems problem: preserving attributable continuity across change, failure, and recovery.">
      <div className="research-response-grid">
        {responses.map((item, index) => <article key={item.concern}>
          <span>{String(index + 1).padStart(2,'0')}</span>
          <div><small>CONCERN</small><p>{item.concern}</p></div>
          <div><small>CAIRN RESEARCH DIRECTION</small><p>{item.response}</p></div>
        </article>)}
      </div>
    </Section>

    <Section eyebrow="Scope discipline / 04" title="What Cairn does not claim to solve." description="Credible safety research requires being explicit about the boundary of the claim.">
      <div className="research-limit-grid">
        <article><strong>Not alignment in a box.</strong><p>Cairn cannot guarantee that an intelligent system will always choose the correct action.</p></article>
        <article><strong>Not a solution to displacement.</strong><p>Continuity infrastructure does not resolve labor-market disruption or the distribution of economic gains from AI.</p></article>
        <article><strong>Not a deepfake detector.</strong><p>Cairn’s provenance work concerns the history and evidence of persistent systems, not every form of synthetic media abuse.</p></article>
        <article><strong>Not permanent human supervision.</strong><p>The architecture is not premised on a human reviewing every internal step before a system can operate.</p></article>
      </div>
    </Section>

    <Section eyebrow="Research question / 05" title="Can continuity itself become a safety primitive?" description="The central technical question remains empirical, not philosophical.">
      <div className="research-question-panel">
        <span>OPEN RESEARCH QUESTION</span>
        <h2>How much operational continuity can actually be made model-independent?</h2>
        <p>If authoritative history, provenance, original evidence, unresolved commitments, and verified recovery state can survive a change in cognition engine, then long-lived AI systems gain something conventional model memory does not provide: a defensible account of what persisted.</p>
        <div className="research-question-links">
          <Link href="/technology">Explore the architecture →</Link>
          <Link href="/research">Return to the research program →</Link>
        </div>
      </div>
    </Section>

    <section className="research-note-close">
      <span>CAIRN CONTINUUM</span>
      <p>Cairn may sleep. Cairn may move.<br/>Cairn may be upgraded.<br/><strong>Cairn does not start over.</strong></p>
    </section>
  </main>;
}
