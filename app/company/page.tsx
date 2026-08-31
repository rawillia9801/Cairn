import { MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function Company(){
  return <main>
    <MissionHeader eyebrow="Company" title="AI should be able to change without losing its history." description="Cairn Continuum started with one simple question: what happens when an AI system lasts longer than the model, provider or machine running it? We are building a continuity layer so those systems can improve, move and recover without losing their past." telemetry={[
      <>FOUNDED · <strong>AUG 2026</strong></>,<>BASE · <strong>VIRGINIA</strong></>,<>TODAY · <strong>RESEARCH + PROTOTYPING</strong></>,<>DIRECTION · <strong>MODEL-INDEPENDENT CONTINUITY</strong></>
    ]}/>

    <Section eyebrow="Why this matters / 01" title="The technology underneath AI will keep changing." description="AI systems are beginning to work for longer periods of time. The models and machines underneath them will not stay the same forever.">
      <div className="info-grid">
        <article className="info-card"><span>THE SHIFT</span><h3>AI systems are becoming long-lived</h3><p>A system that works for months or years can build up unfinished work, decisions, exceptions, relationships and evidence that still matter later.</p></article>
        <article className="info-card"><span>THE PROBLEM</span><h3>The model will eventually change</h3><p>Models improve. Providers change. Hardware fails. A system that lasts cannot assume the same AI model will always be there.</p></article>
        <article className="info-card"><span>THE IDEA</span><h3>Keep the history outside the model</h3><p>Cairn keeps the operational history separate from the model reading it, so a new model can pick up from the same record instead of starting from a blank slate.</p></article>
      </div>
    </Section>

    <Section eyebrow="What we are doing now / 02" title="First, prove what actually works." description="We are testing the hard parts before treating them as solved: can history survive a model change, can recovery be trusted, and where do the limits show up?">
      <div className="company-status-grid">
        <article className="status-card"><div className="status-icon">◆</div><span>HISTORY + SOURCES</span><strong>Under test</strong><div className="status-progress"><i/></div><p>We are testing ways to keep original records and the sources behind important state changes intact over time.</p></article>
        <article className="status-card"><div className="status-icon">⇄</div><span>CROSS-MODEL RECOVERY</span><strong>Active benchmark</strong><div className="status-progress"><i/></div><p>We test whether different AI models can rebuild the same working state, unfinished commitments and revision history from the same preserved record.</p></article>
        <article className="status-card"><div className="status-icon">▤</div><span>RECOVERY</span><strong>Under test</strong><div className="status-progress"><i/></div><p>We test recovery after provider changes, machine changes, damaged summaries and deliberate history tampering.</p></article>
        <article className="status-card"><div className="status-icon">✓</div><span>RESULTS</span><strong>Evidence first</strong><div className="status-progress"><i/></div><p>If a test works, we say what it showed. If it fails or only partly works, we keep that result too.</p></article>
      </div>
    </Section>

    <Section eyebrow="Where this could go / 03" title="A continuity layer that can move with the system." description="If the research continues to hold up, Cairn could sit underneath many kinds of AI systems instead of belonging to one model, vendor or product.">
      <div className="info-grid">
        <article className="info-card"><span>CHANGE THE MODEL</span><h3>Upgrade without losing the past</h3><p>A better model could replace the current one and resume from a verified history instead of beginning again.</p></article>
        <article className="info-card"><span>MOVE THE SYSTEM</span><h3>Change providers or hardware</h3><p>The history and recovery process are being designed to travel across providers, hosts and hardware without silently resetting the system.</p></article>
        <article className="info-card"><span>LONGER TERM</span><h3>Use the same idea beyond one interface</h3><p>The same foundation could eventually support business agents, developer tools, robotics and other AI systems that need to last.</p></article>
      </div>
    </Section>

    <Section eyebrow="The goal / 04" title="Let AI improve without making it forget its own past." description="Cairn is not about keeping one model alive forever. It is about preserving a trustworthy record when the model changes.">
      <div className="info-grid">
        <article className="info-card"><span>TRUSTED HISTORY</span><h3>Know what actually happened</h3><p>Keep the original records, their order and their sources so recovery is based on evidence instead of a summary that may have changed.</p></article>
        <article className="info-card"><span>PORTABLE HISTORY</span><h3>Depend less on one vendor</h3><p>Make the system's past portable enough that changing the technology underneath it does not mean losing years of work.</p></article>
        <article className="info-card"><span>ACCOUNTABILITY</span><h3>Keep a record of important actions</h3><p>As AI systems become more capable, preserve enough evidence to understand what they did, why it happened and what still needs attention.</p></article>
      </div>
    </Section>

    <Section eyebrow="Founding team / 05" title="Small team. Long horizon." description="Cairn Continuum is being built as an independent research and engineering company focused on a problem we expect to matter more as AI systems become longer-lived.">
      <div className="info-grid">
        <article className="info-card"><span>FOUNDER / TECHNICAL LEAD</span><h3>Robert Williams</h3><p>Hands-on experience across production web applications, multi-tenant SaaS, AI-enabled voice services, Linux/VPS infrastructure, telephony, databases, authentication, API integrations and cloud deployment.</p></article>
        <article className="info-card"><span>CO-FOUNDER / BUSINESS OPERATIONS</span><h3>Cristy Rambo-Smith</h3><p>Business operations, company administration and execution support as Cairn's research, infrastructure and commercial foundation expand.</p></article>
        <article className="info-card"><span>GROWING THE TEAM</span><h3>Independent evaluation & security</h3><p>As the research grows, Cairn plans to add outside evaluation and security expertise to challenge the design and test the parts that need independent review.</p></article>
      </div>
    </Section>

    <PageCTA title="Interested in the research, the technology or where this could go?" href="/contact" label="Contact Cairn"/>
  </main>;
}
