import { MissionHeader, PageCTA, Section } from '../components/mission-control';

export default function Company(){
  return <main>
    <MissionHeader eyebrow="Company" title="Built deliberately, before genesis." description="Cairn Continuum is a Virginia technology company developing continuity infrastructure for persistent machine intelligence. Preservation and host-preparation gates are being completed before runtime initialization." telemetry={[
      <>FOUNDED · <strong>AUG 2026</strong></>,<>JURISDICTION · <strong>VIRGINIA</strong></>,<>STAGE · <strong>R&D</strong></>,<>FOCUS · <strong>AI SYSTEMS INFRASTRUCTURE</strong></>
    ]}/>

    <Section eyebrow="Company status / 01" title="A real foundation exists before the continuity runtime begins." description="The host is already substantially prepared and preservation-tested. The initialization boundary remains intentionally uncrossed.">
      <div className="company-status-grid">
        <article className="status-card"><div className="status-icon">✓</div><span>COMPANY FORMATION</span><strong>Complete</strong><div className="status-progress"><i/></div><p>Virginia LLC active; company domain and operating email established.</p></article>
        <article className="status-card"><div className="status-icon">↗</div><span>RESEARCH / GRANT</span><strong>Submitted</strong><div className="status-progress"><i/></div><p>NSF Project Pitch submitted; Phase I budget and supporting materials prepared.</p></article>
        <article className="status-card"><div className="status-icon">▤</div><span>HOST FOUNDATION</span><strong>Validated</strong><div className="status-progress"><i/></div><p>Phase 0A, Phase 0B and Phase 0C-A are complete and accepted. Major preservation and backup procedures have been validated.</p></article>
        <article className="status-card"><div className="status-icon">→</div><span>NEXT HOST GATE</span><strong>Phase 0C-B</strong><div className="status-progress"><i/></div><p>Remaining host remediation and completion work comes before any Cairn runtime initialization.</p></article>
      </div>
    </Section>

    <Section eyebrow="Mission / 02" title="Build the continuity layer long-lived AI systems are missing." description="Cairn Continuum is focused on model-independent historical authority, provenance, state reconstruction, migration and recovery.">
      <div className="info-grid">
        <article className="info-card"><span>COMPANY</span><h3>Research & prototype development</h3><p>Early-stage technical R&D backed by a preservation-tested control-plane foundation and a deliberately staged initialization process.</p></article>
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
