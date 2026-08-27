import { MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function Company(){
  return <main>
    <MissionHeader eyebrow="Company" title="Cairn Continuum LLC" description="A Virginia technology company developing continuity infrastructure for persistent machine intelligence." telemetry={[
      <>FOUNDED · <strong>AUG 2026</strong></>,<>JURISDICTION · <strong>VIRGINIA</strong></>,<>STAGE · <strong>R&D</strong></>,<>FOCUS · <strong>AI SYSTEMS INFRASTRUCTURE</strong></>
    ]}/>
    <Section eyebrow="Mission / 01" title="Build the continuity layer long-lived AI systems are missing." description="Cairn Continuum is focused on model-independent historical authority, provenance, state reconstruction, migration and recovery.">
      <div className="info-grid">
        <article className="info-card"><span>COMPANY</span><h3>Research & prototype development</h3><p>The company is in early-stage technical development with foundational infrastructure and research framing underway.</p></article>
        <article className="info-card"><span>RESEARCH</span><h3>Continuity across change</h3><p>The core question is whether operational continuity can become measurable and substantially independent of the inference engine.</p></article>
        <article className="info-card"><span>COMMERCIAL PATH</span><h3>Runtime, SDK & managed service</h3><p>Potential commercialization includes self-hosted enterprise infrastructure, developer APIs and licensed embedded continuity runtimes.</p></article>
      </div>
    </Section>
    <Section eyebrow="Founding team / 02" title="Small team. Systems-first execution." description="The company combines hands-on technical development with focused business operations and plans to add independent evaluation and security expertise as the research program expands.">
      <div className="info-grid">
        <article className="info-card"><span>FOUNDER / TECHNICAL LEAD</span><h3>Robert Williams</h3><p>Hands-on experience across production web applications, multi-tenant SaaS, AI-enabled voice services, Linux/VPS infrastructure, telephony, databases, authentication, API integrations and cloud deployment.</p></article>
        <article className="info-card"><span>CO-FOUNDER / BUSINESS OPERATIONS</span><h3>Cristy Rambo-Smith</h3><p>Business operations, company administration and execution support as Cairn’s research and commercial foundation expands.</p></article>
        <article className="info-card"><span>PLANNED EXPERTISE</span><h3>Independent evaluation & security</h3><p>ML evaluation and security/cryptography expertise are planned for cross-model benchmark design, threat modeling, key management and tamper-evidence review.</p></article>
      </div>
    </Section>
    <Section eyebrow="Current status / 03" title="Built deliberately, before genesis." description="The continuity runtime itself has intentionally not yet been initialized while host preservation, recovery and infrastructure gates are completed first.">
      <div className="metric-grid">
        <article><span>Company formation</span><strong>Complete</strong><small>Virginia LLC active</small></article>
        <article><span>NSF Project Pitch</span><strong>Submitted</strong><small>SBIR program review pending</small></article>
        <article><span>Infrastructure</span><strong>In progress</strong><small>Continuity control plane preparation</small></article>
        <article><span>Continuity runtime</span><strong>Next phase</strong><small>Architecture before initialization</small></article>
      </div>
    </Section>
    <PageCTA title="Research, technical collaboration or partnership inquiry?" href="/contact" label="Contact Cairn"/>
  </main>;
}
