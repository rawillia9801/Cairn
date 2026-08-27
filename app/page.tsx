import Link from 'next/link';
import { ArchitectureFlow, MetricGrid, MissionHeader, PageCTA, Section } from './components/mission-control';

export default function HomePage(){
  return <main>
    <MissionHeader
      eyebrow="Cairn Continuity Systems / R&D"
      title={<>Persistent intelligence needs a persistent foundation.</>}
      description={<>Cairn Continuum is developing model-independent continuity infrastructure for long-lived AI systems — preserving authoritative history, provenance, checkpoints, commitments and recoverable state as models, hardware, providers and environments change.</>}
      actions={<><Link className="button primary" href="/technology">Explore technology</Link><Link className="button" href="/why-continuity">Why continuity?</Link></>}
      telemetry={[
        <><strong>HISTORY</strong> · APPEND-ONLY</>,
        <><strong>MODEL LAYER</strong> · REPLACEABLE</>,
        <><strong>PROVENANCE</strong> · TRACEABLE</>,
        <><strong>RECOVERY</strong> · VERIFIED</>,
      ]}
    />

    <MetricGrid items={[
      {label:'Entity',value:'Cairn Continuum LLC',note:'Virginia · Active'},
      {label:'Stage',value:'Research & Prototype',note:'Founded August 2026'},
      {label:'Architecture',value:'Model Independent',note:'Continuity-first systems layer'},
      {label:'Research focus',value:'Cross-model continuity',note:'Measurable recovery & provenance'},
    ]}/>

    <div className="hero-viewport">
      <div className="hero-copy">
        <div className="kicker">MISSION / CONTINUITY INFRASTRUCTURE</div>
        <h2>Models are replaceable.<br/><em>Continuity shouldn’t be.</em></h2>
        <p>AI systems are becoming long-lived, but their history is still commonly tied to a session, provider thread, vector store, mutable summary, or application checkpoint. Cairn separates continuity from cognition so the underlying model can change without silently rewriting what came before.</p>
        <div className="hero-actions"><Link className="button primary" href="/technology">Open architecture</Link><Link className="button" href="/research">View research program</Link></div>
      </div>
      <div className="viewport-card">
        <img src="/cairn-continuity-hero.webp" alt="Concept visualization of Cairn's persistent AI continuity infrastructure" />
        <div className="viewport-label">MISSION VIEWPORT / CONTINUITY SUBSTRATE</div>
        <div className="viewport-status"><i/> PROVENANCE LINK ACTIVE</div>
      </div>
    </div>

    <Section eyebrow="Architecture / 01" title={<>Continuity separated from cognition.</>} description={<>The model can improve, move or be replaced. Cairn is intended to preserve the authoritative history underneath it.</>}>
      <ArchitectureFlow/>
    </Section>

    <Section eyebrow="Why it matters / 02" title={<>Long-lived AI needs more than memory.</>} description={<>Persistence answers “can I retrieve something?” Continuity asks “what actually happened, what is authoritative, and can the system recover it after change or failure?”</>}>
      <div className="info-grid">
        {[
          ['01','Persistent AI agents','Long-running assistants and agent systems that must survive model upgrades and provider transitions.'],
          ['02','Enterprise automation','Workflows where prior commitments, decisions and supporting evidence must remain traceable.'],
          ['03','Robotics & autonomous systems','Continuity that can persist as compute, sensors, hosts or physical embodiment change.'],
          ['04','High-accountability AI','Systems where operators need evidence of what changed, when it changed and why.'],
          ['05','Model migration','A stable continuity substrate can reduce dependence on any one inference provider.'],
          ['06','Recovery','Verified checkpoints and original-history preservation provide a stronger basis for restoration.'],
        ].map(([n,t,p])=><article className="info-card" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}
      </div>
    </Section>

    <Section eyebrow="Core principle / 03" title={<>Original history is never silently rewritten.</>} description={<>New understanding is appended. Later interpretation can evolve without replacing the original record.</>} />

    <PageCTA title="See the research question Cairn is built to test." href="/research" label="Research program"/>
  </main>;
}
