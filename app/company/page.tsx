import { MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function Company(){
  return <main>
    <MissionHeader eyebrow="Company" title="AI should be able to change without losing its history." description="Cairn Continuum began from a simple concern: increasingly capable AI systems may outlive the models, providers and machines beneath them. We are building the continuity layer that could let those systems improve, move and recover without silently starting over." telemetry={[
      <>FOUNDED · <strong>AUG 2026</strong></>,<>BASE · <strong>VIRGINIA</strong></>,<>TODAY · <strong>RESEARCH + PROTOTYPING</strong></>,<>DIRECTION · <strong>MODEL-INDEPENDENT CONTINUITY</strong></>
    ]}/>

    <Section eyebrow="Why this path / 01" title="The intelligence will change. The history should not disappear with it." description="AI systems are moving from short-lived sessions toward long-running agents that accumulate decisions, obligations, evidence and operational context. The infrastructure underneath them is far less permanent.">
      <div className="info-grid">
        <article className="info-card"><span>THE SHIFT</span><h3>Systems are becoming long-lived</h3><p>An AI that works across months or years can accumulate unfinished work, exceptions, decisions, relationships and evidence that matter beyond a single session.</p></article>
        <article className="info-card"><span>THE INSTABILITY</span><h3>Models and infrastructure are temporary</h3><p>Models improve. Providers change. Hardware fails. Hosts move. A durable system cannot assume that the cognition engine operating today will still exist tomorrow.</p></article>
        <article className="info-card"><span>THE IDEA</span><h3>History needs its own authority</h3><p>Cairn separates preserved operational history from the replaceable model interpreting it, so new understanding can be added without silently rewriting what actually happened.</p></article>
      </div>
    </Section>

    <Section eyebrow="Today / 02" title="First, prove what continuity can actually survive." description="The work today is intentionally narrow and measurable: determine which properties can remain stable across changes in cognition and infrastructure, and quantify where that stability breaks down.">
      <div className="company-status-grid">
        <article className="status-card"><div className="status-icon">◆</div><span>HISTORY + PROVENANCE</span><strong>Under test</strong><div className="status-progress"><i/></div><p>Append-only history, content-addressed originals and provenance links are being designed so evidence can remain attributable across system change.</p></article>
        <article className="status-card"><div className="status-icon">⇄</div><span>CROSS-MODEL RECOVERY</span><strong>Under test</strong><div className="status-progress"><i/></div><p>Benchmark work measures whether different cognition engines can recover the same authoritative state, unresolved commitments and revision history.</p></article>
        <article className="status-card"><div className="status-icon">▤</div><span>RECONSTRUCTION</span><strong>Under test</strong><div className="status-progress"><i/></div><p>Recovery is being evaluated under host changes, corrupted derived memory, provider loss and deliberate historical tampering.</p></article>
        <article className="status-card"><div className="status-icon">✓</div><span>CLAIM DISCIPLINE</span><strong>Evidence first</strong><div className="status-progress"><i/></div><p>The objective is not to assume continuity works. It is to establish what can be demonstrated, what remains model-dependent and what fails.</p></article>
      </div>
    </Section>

    <Section eyebrow="Tomorrow / 03" title="A continuity substrate that can travel with the system." description="If the research holds, Cairn could become infrastructure beneath many kinds of AI systems rather than a feature tied to one model, vendor or interface.">
      <div className="info-grid">
        <article className="info-card"><span>MODEL INDEPENDENCE</span><h3>Change the cognition engine</h3><p>A stronger or more appropriate model could replace the current one while reconstructing from a verified historical baseline instead of beginning from a blank operational state.</p></article>
        <article className="info-card"><span>INFRASTRUCTURE INDEPENDENCE</span><h3>Move without starting over</h3><p>Providers, hosts and hardware could change while continuity records, provenance and unresolved work remain portable and independently verifiable.</p></article>
        <article className="info-card"><span>LONGER HORIZON</span><h3>Continuity beyond one interface</h3><p>The same continuity foundation could eventually support enterprise agents, developer systems, robotics and other long-lived forms of machine intelligence as their capabilities and physical interfaces evolve.</p></article>
      </div>
    </Section>

    <Section eyebrow="What we want to achieve / 04" title="Persistent intelligence that does not silently start over." description="The long-term goal is not to freeze an AI system in place. It is to let the system change while preserving a trustworthy path back to its own operational history.">
      <div className="info-grid">
        <article className="info-card"><span>VERIFIABLE CONTINUITY</span><h3>Know what actually happened</h3><p>Preserve original evidence, sequence, provenance and revisions so recovery starts from attributable history rather than an untraceable summary.</p></article>
        <article className="info-card"><span>PORTABLE CONTINUITY</span><h3>Reduce dependence on one model or vendor</h3><p>Make historical state and recovery semantics portable enough that a long-lived system is not forced to lose its operational past when technology underneath it changes.</p></article>
        <article className="info-card"><span>ACCOUNTABLE AUTONOMY</span><h3>Let capability grow with evidence</h3><p>As AI systems become more capable, provide the provenance, recovery and auditability needed to understand actions and preserve responsibility without treating permanent centralized control as the only form of safety.</p></article>
      </div>
    </Section>

    <Section eyebrow="Founding team / 05" title="Small team. Long horizon." description="Cairn Continuum is being built as an independent research and engineering company with a systems-first approach and a deliberately long-term view of persistent machine intelligence.">
      <div className="info-grid">
        <article className="info-card"><span>FOUNDER / TECHNICAL LEAD</span><h3>Robert Williams</h3><p>Hands-on experience across production web applications, multi-tenant SaaS, AI-enabled voice services, Linux/VPS infrastructure, telephony, databases, authentication, API integrations and cloud deployment.</p></article>
        <article className="info-card"><span>CO-FOUNDER / BUSINESS OPERATIONS</span><h3>Cristy Rambo-Smith</h3><p>Business operations, company administration and execution support as Cairn’s research, infrastructure and commercial foundation expand.</p></article>
        <article className="info-card"><span>GROWING THE TEAM</span><h3>Independent evaluation & security</h3><p>As the research program expands, Cairn plans to add ML evaluation and security/cryptography expertise for benchmark design, threat modeling, key management and tamper-evidence review.</p></article>
      </div>
    </Section>

    <PageCTA title="Interested in the research, the architecture or where this could go?" href="/contact" label="Contact Cairn"/>
  </main>;
}
