import { MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function Company(){
  return <main>
    <MissionHeader eyebrow="Company" title="Building continuity infrastructure for long-lived AI." description="Cairn Continuum is a Virginia technology company developing and validating continuity infrastructure for persistent machine intelligence across model, provider and hardware change." telemetry={[
      <>FOUNDED · <strong>AUG 2026</strong></>,<>JURISDICTION · <strong>VIRGINIA</strong></>,<>STAGE · <strong>R&D</strong></>,<>FOCUS · <strong>AI SYSTEMS INFRASTRUCTURE</strong></>
    ]}/>

    <Section eyebrow="Company status / 01" title="Independent research. Deliberate engineering." description="Cairn is being developed as a long-term technical program. External funding can accelerate the work, but the research direction and engineering program do not depend on any single grant, partner or provider.">
      <div className="company-status-grid">
        <article className="status-card"><div className="status-icon">✓</div><span>COMPANY</span><strong>Active</strong><div className="status-progress"><i/></div><p>Cairn Continuum LLC is an active Virginia technology company with an established domain and operating infrastructure.</p></article>
        <article className="status-card"><div className="status-icon">◆</div><span>RESEARCH PROGRAM</span><strong>Active</strong><div className="status-progress"><i/></div><p>Research and prototype work is underway across continuity, provenance, reconstruction, migration and recovery.</p></article>
        <article className="status-card"><div className="status-icon">▤</div><span>INFRASTRUCTURE FOUNDATION</span><strong>Validated</strong><div className="status-progress"><i/></div><p>Core preservation, backup and control-plane foundations have been validated before higher-level runtime work advances.</p></article>
        <article className="status-card"><div className="status-icon">→</div><span>ENGINEERING APPROACH</span><strong>Staged</strong><div className="status-progress"><i/></div><p>Major capabilities are introduced behind explicit validation gates so measured evidence comes before public claims.</p></article>
      </div>
    </Section>

    <Section eyebrow="Mission / 02" title="Build the continuity layer long-lived AI systems are missing." description="Cairn Continuum is focused on model-independent historical authority, provenance, state reconstruction, migration and recovery.">
      <div className="info-grid">
        <article className="info-card"><span>COMPANY</span><h3>Research & prototype development</h3><p>Early-stage technical R&D focused on proving which continuity properties can survive changes in the models and infrastructure beneath a long-lived AI system.</p></article>
        <article className="info-card"><span>RESEARCH</span><h3>Continuity across change</h3><p>The core question is which operational continuity properties can become measurable and substantially independent of the inference engine.</p></article>
        <article className="info-card"><span>COMMERCIAL PATH</span><h3>Runtime, SDK & managed service</h3><p>Potential commercialization includes self-hosted enterprise infrastructure, developer APIs and licensed embedded continuity runtimes.</p></article>
      </div>
    </Section>

    <Section eyebrow="Founding team / 03" title="Small team. Systems-first execution." description="The company combines hands-on technical development with focused business operations and plans to add independent evaluation and security expertise as the research program expands.">
      <div className="info-grid">
        <article className="info-card"><span>FOUNDER / TECHNICAL LEAD</span><h3>Robert Williams</h3><p>Hands-on experience across production web applications, multi-tenant SaaS, AI-enabled voice services, Linux/VPS infrastructure, telephony, databases, authentication, API integrations and cloud deployment.</p></article>
        <article className="info-card"><span>CO-FOUNDER / BUSINESS OPERATIONS</span><h3>Cristy Rambo-Smith</h3><p>Business operations, company administration and execution support as Cairn’s research and commercial foundation expands.</p></article>
        <article className="info-card"><span>PLANNED EXPERTISE</span><h3>Independent evaluation & security</h3><p>ML evaluation and security/cryptography expertise are planned for cross-model benchmark design, threat modeling, key management and tamper-evidence review.</p></article>
      </div>
    </Section>

    <PageCTA title="Research, technical collaboration or partnership inquiry?" href="/contact" label="Contact Cairn"/>
  </main>;
}
