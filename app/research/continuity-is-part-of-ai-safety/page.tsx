import Link from 'next/link';
import { MissionHeader, Section } from '../../components/mission-control';

const responses = [
  {
    concern: 'More autonomous AI systems may do things their designers did not expect.',
    response: 'A preserved history can show what happened, what information was used and what changed afterward.'
  },
  {
    concern: 'More capable systems may be harder for people to watch every moment.',
    response: 'Clear limits, trusted state and a traceable record can make oversight less dependent on someone watching every step live.'
  },
  {
    concern: 'Models, providers and infrastructure will change quickly.',
    response: 'Cairn keeps continuity separate from the replaceable model so changing the technology does not automatically erase the system history.'
  },
  {
    concern: 'Failures, attacks or damaged memory can make a system hard to trust.',
    response: 'Preserved originals, verified checkpoints and recovery from trusted history can help the system detect bad state and recover more safely.'
  },
  {
    concern: 'AI may become concentrated in a small number of platforms.',
    response: 'Portable history and recovery could reduce dependence on any one model provider.'
  },
  {
    concern: 'Trust will matter more as AI takes on more important work.',
    response: 'Cairn is testing whether trust can rely more on a durable record of what happened and less on a model explaining itself after the fact.'
  },
];

export default function ContinuityIsPartOfAISafety(){
  return <main>
    <MissionHeader
      eyebrow="Research Note 001 · August 2026"
      title={<>Continuity is part<br/>of AI safety.</>}
      description={<>Bill Gates recently wrote about a turbulent period ahead as AI becomes more capable and autonomous. Cairn focuses on one part of that larger problem: if an AI system is going to last, can we keep a trustworthy record of what it did even when the model and infrastructure underneath it change?</>}
      telemetry={[
        <>ACCOUNTABILITY · <strong>TRACEABLE</strong></>,
        <>RECOVERY · <strong>VERIFIABLE</strong></>,
        <>MODEL CHANGE · <strong>PORTABLE</strong></>,
        <>HISTORY · <strong>PRESERVED</strong></>
      ]}
    />

    <Section className="research-note-lead">
      <div className="research-note-source">
        <span>CONTEXT</span>
        <p>This note responds to themes raised in Bill Gates's essay <em>A Turbulent AI Era and Critical Choices to Make</em>. We agree with the basic point that society should not wait until highly autonomous AI is everywhere before building better ways to understand, recover and govern these systems.</p>
        <a href="https://www.gatesnotes.com/a-turbulent-ai-era-and-critical-choices-to-make" target="_blank" rel="noreferrer">Read the original essay ↗</a>
      </div>
      <div className="research-note-thesis">
        <span>CAIRN POSITION</span>
        <h2>More capable AI needs more than better models.</h2>
        <p>It also needs a trustworthy record: what happened, what the system knew at the time, what changed, what authority it used and whether a later recovery still points back to the same history.</p>
      </div>
    </Section>

    <Section eyebrow="The missing piece / 01" title="AI can change quickly. Its responsibilities may last much longer." description="A model can be replaced in an afternoon. A system may keep working for years. That gap creates a problem that a better model alone does not solve.">
      <div className="research-prose-grid">
        <article>
          <h3>Long-running systems collect unfinished responsibilities.</h3>
          <p>An AI system that works for weeks, months or years may build up unfinished tasks, decisions, exceptions, user preferences and evidence. If the model changes, simply keeping the database does not prove the replacement model understood those responsibilities correctly.</p>
        </article>
        <article>
          <h3>Memory is not the same as history.</h3>
          <p>Summaries, vector databases and model-generated memories are useful, but they are still interpretations. They can be incomplete, changed or understood differently by another model. A trustworthy system needs the original record underneath them.</p>
        </article>
      </div>
    </Section>

    <Section eyebrow="Accountability / 02" title="Control and accountability are not the same thing." description="A system can have limits on what it is allowed to do and still need a reliable record of what it actually did.">
      <div className="research-principle">
        <div>
          <span>PRINCIPLE</span>
          <h3>The more authority a system has, the stronger its record should be.</h3>
        </div>
        <p>More capable AI may need tighter permission boundaries, better recovery and stronger auditing. But safety should not depend only on permanent human supervision. A useful goal is accountable autonomy: let a system act within clear limits while keeping enough evidence for people to understand important actions later.</p>
      </div>
    </Section>

    <Section eyebrow="Where Cairn fits / 03" title="Cairn is aimed at one specific part of the larger AI safety problem." description="It does not try to solve every risk created by advanced AI. It focuses on preserving a trustworthy history across change, failure and recovery.">
      <div className="research-response-grid">
        {responses.map((item, index) => <article key={item.concern}>
          <span>{String(index + 1).padStart(2,'0')}</span>
          <div><small>CONCERN</small><p>{item.concern}</p></div>
          <div><small>CAIRN DIRECTION</small><p>{item.response}</p></div>
        </article>)}
      </div>
    </Section>

    <Section eyebrow="What Cairn does not solve / 04" title="Continuity is important, but it is not every part of AI safety." description="Keeping a trustworthy history does not make every other AI problem disappear.">
      <div className="research-limit-grid">
        <article><strong>It does not guarantee good decisions.</strong><p>Cairn cannot guarantee that an AI system will always choose the correct action.</p></article>
        <article><strong>It does not solve job displacement.</strong><p>Continuity infrastructure does not answer the economic questions created by AI.</p></article>
        <article><strong>It is not a deepfake detector.</strong><p>Cairn is focused on the history of long-running systems, not every form of synthetic media.</p></article>
        <article><strong>It does not require a person to approve every step.</strong><p>The design is not based on a human reviewing every internal action before the system can continue.</p></article>
      </div>
    </Section>

    <Section eyebrow="The open question / 05" title="How much continuity can actually survive a model change?" description="That is something we have to test, not something we can answer with a slogan.">
      <div className="research-question-panel">
        <span>OPEN RESEARCH QUESTION</span>
        <h2>How much of a long-running AI system's working history can be made independent of the model?</h2>
        <p>If the original history, source links, unfinished commitments and verified recovery state can survive a model change, then long-lived AI gains something ordinary model memory does not provide: a defensible record of what carried forward.</p>
        <div className="research-question-links">
          <Link href="/technology">See how Cairn works →</Link>
          <Link href="/research">See the research →</Link>
        </div>
      </div>
    </Section>

    <section className="research-note-close">
      <span>CAIRN CONTINUUM</span>
      <p>Cairn may sleep. Cairn may move.<br/>Cairn may be upgraded.<br/><strong>Cairn does not start over.</strong></p>
    </section>
  </main>;
}
