import Link from 'next/link';
import { MissionHeader, PageCTA, Section } from '../../components/mission-control';

export default function ResearchResults(){
  return <main>
    <MissionHeader
      eyebrow="Research Results · August 2026"
      title={<>Measured evidence.<br/>Narrow claims.</>}
      description="Cairn's research program is designed to test continuity claims before treating them as architecture facts. This page publishes the results we can currently support, the conditions under which they were measured, and the limits of those findings."
      telemetry={[
        <>Q1 · <strong>SUPPORTED</strong></>,
        <>Q2 T1 · <strong>SUPPORTED</strong></>,
        <>Q2 T2 · <strong>SUPPORTED</strong></>,
        <>Q3 · <strong>OPEN</strong></>
      ]}
    />

    <Section eyebrow="Evidence policy / 01" title="The result is public. The engineering workspace does not need to be the destination." description="These summaries expose the measured finding, test conditions, failure behavior and claim boundary without sending visitors into the project's working repository. Detailed reproducibility records remain maintained as project evidence.">
      <div className="research-principle">
        <div>
          <span>PUBLICATION RULE</span>
          <h3>Publish what was demonstrated — including limitations.</h3>
        </div>
        <p>Successful trials are not treated as universal proof. Partial results remain partial. Failed checks are preserved. Each result below states what the experiment supports and what it does not establish.</p>
      </div>
    </Section>

    <Section eyebrow="Q1 Trial 001 / 02" title="Cross-model continuity survived a cognition-engine change." description="The first Q1 trial tested whether materially different cognition engines could reconstruct the same predefined operational state from the same continuity package." >
      <div id="q1-trial-001" className="research-prose-grid">
        <article>
          <span>RESULT</span>
          <h3>Supported in the controlled synthetic trial.</h3>
          <p>Two materially different model families reconstructed the same authoritative state, unresolved commitments, revision relationships and resumption baseline.</p>
          <p>The measured outcome contained zero unsupported authoritative-state claims and zero pairwise interpretation divergence on the predefined assertions used by the trial.</p>
        </article>
        <article>
          <span>WHY IT MATTERS</span>
          <h3>Operational continuity did not depend on one specific model family.</h3>
          <p>The experiment supports the narrower proposition that sufficiently explicit systems-layer continuity data can survive a cognition-engine replacement without forcing the new engine to invent the prior operational state from prose memory alone.</p>
          <p>A provenance shortfall observed in the trial was retained in the evidence rather than corrected after results were known.</p>
        </article>
      </div>
      <div className="research-question-panel">
        <span>CLAIM BOUNDARY</span>
        <h2>This was not a test of identical personality or identical reasoning.</h2>
        <p>The result supports recovery of defined operational continuity for the synthetic test package. It does not show that two different models will think, phrase answers, prioritize information or behave identically in open-ended situations.</p>
      </div>
    </Section>

    <Section eyebrow="Q1 Trial 002 / 03" title="Minimum-sufficient provenance remained portable across model families." description="The follow-up tightened the question: could a smaller structured provenance package carry enough evidence for materially different engines to recover the required provenance set?">
      <div id="q1-trial-002" className="research-prose-grid">
        <article>
          <span>RESULT</span>
          <h3>Supported across two complete engine arms; one arm remained partial.</h3>
          <p>Claude and Grok met every preregistered engine-level target and produced zero pairwise divergence in the required provenance set.</p>
          <p>Gemini remains recorded as a partial result rather than being silently excluded from the program history.</p>
        </article>
        <article>
          <span>INTERPRETATION</span>
          <h3>Portability improved when continuity evidence was explicit and structured.</h3>
          <p>The result strengthens Q1's systems-layer argument: a replacement cognition engine does not need every historical token in order to recover the tested provenance relationships when those relationships are represented directly.</p>
        </article>
      </div>
    </Section>

    <Section eyebrow="Q2 Trial 001 / 04" title="A million-event history did not require a million-event ordinary recovery replay." description="Q2 asks whether long-lived authoritative history can remain recoverable without forcing normal resume operations to reread history from genesis every time.">
      <div id="q2-trial-001" className="info-grid">
        <article className="info-card"><span>1,000,000</span><h3>Lifetime events</h3><p>The largest required Trial 001 profile contained one million protected synthetic events.</p></article>
        <article className="info-card"><span>10,000</span><h3>Checkpoint tail</h3><p>Verified checkpoint recovery reconstructed the same terminal baseline while replaying a 10,000-event tail rather than the full million-event history.</p></article>
        <article className="info-card"><span>232</span><h3>Relevant events applied</h3><p>Dependency-aware recovery applied only the tail events capable of changing the authoritative state or unresolved commitments in the 1M profile.</p></article>
        <article className="info-card"><span>0</span><h3>Silent false verifications</h3><p>Deliberate checkpoint, dependency-index and protected-history corruption did not silently return a falsely verified state.</p></article>
      </div>
      <div className="research-question-panel">
        <span>TRIAL 001 CONCLUSION</span>
        <h2>Bounded ordinary recovery was supported for the controlled workload.</h2>
        <p>Trial 001 established that verified recovery could begin from a recent trusted checkpoint and process only subsequent history while still reproducing the same deterministic authoritative baseline as full verified replay.</p>
      </div>
    </Section>

    <Section eyebrow="Q2 Trial 002 / 05" title="Fixed-age recovery stayed effectively flat while lifetime history grew 10×." description="Trial 002 removed the main ambiguity left by percentage-based checkpoints. The recovery tail was fixed at exactly 10,000 events while total history grew from 100,000 to 1,000,000 events.">
      <div id="q2-trial-002" className="architecture-panel">
        <div className="panel-bar"><span>PRIMARY FIXED-AGE RESULT</span><b>● SUPPORTED</b></div>
        <div className="architecture-grid">
          <article><span>100K HISTORY</span><h3>73.733 ms</h3><p>Verified fixed-age checkpoint recovery P50 with a 10,000-event tail.</p></article>
          <article><span>1M HISTORY</span><h3>73.741 ms</h3><p>Verified fixed-age checkpoint recovery P50 with the same 10,000-event tail.</p></article>
          <article><span>FULL REPLAY · 100K</span><h3>679.994 ms</h3><p>Origin-to-terminal verified audit path at 100,000 lifetime events.</p></article>
          <article><span>FULL REPLAY · 1M</span><h3>6,811.583 ms</h3><p>Origin-to-terminal verified audit path after lifetime history increased 10×.</p></article>
          <article><span>LATENCY RATIO</span><h3>1.0001</h3><p>Measured fixed-age 1M/100K P50 ratio. The preregistered maximum for support was 2.0.</p></article>
          <article><span>PRE-CHECKPOINT READS</span><h3>0</h3><p>Ordinary Strategy B recovery performed zero pre-checkpoint event-body reads at both required scales.</p></article>
        </div>
      </div>

      <div className="research-prose-grid">
        <article>
          <span>DEPENDENCY-AWARE RECOVERY</span>
          <h3>Semantic work remained tiny relative to lifetime history.</h3>
          <p>Dependency-aware recovery applied 229 relevant events at the 100K scale and 232 relevant events at the 1M scale while reproducing the same authoritative terminal baseline.</p>
        </article>
        <article>
          <span>INTEGRITY</span>
          <h3>Corruption was detected and handled without silent acceptance.</h3>
          <p>Controlled corruption of checkpoint metadata, dependency data and protected history produced zero silent false-verification outcomes. Corrupted acceleration artifacts were rejected and recovery either fell back safely or failed closed.</p>
        </article>
      </div>

      <div className="research-question-panel">
        <span>SUPPORTED CLAIM</span>
        <h2>For this workload, ordinary recovery cost was governed by checkpoint age rather than lifetime history.</h2>
        <p>Full verified replay continued to grow with total history. Ordinary verified checkpoint recovery remained bounded by the fixed 10,000-event tail and stayed approximately constant across the required 100K → 1M scale ladder.</p>
      </div>
    </Section>

    <Section eyebrow="Limitations / 06" title="What these results do not prove." description="The program is deliberately conservative about where a measured systems result stops being evidence and starts becoming speculation.">
      <div className="research-limit-grid">
        <article><strong>Controlled synthetic workloads.</strong><p>The event distributions are deterministic research fixtures, not every possible production workload.</p></article>
        <article><strong>CI is not a production SLO.</strong><p>Measured latency came from hosted CI runners and should be interpreted as scaling evidence, not a guaranteed service latency.</p></article>
        <article><strong>No universal model equivalence.</strong><p>Q1 demonstrates recovery of predefined operational state and provenance, not identical reasoning or behavior between models.</p></article>
        <article><strong>Full audit still matters.</strong><p>Checkpoint and dependency-aware recovery are ordinary resume paths. Origin-to-terminal verification remains the full historical audit path.</p></article>
        <article><strong>Q2 has not claimed 10M.</strong><p>The required fixed-age Trial 002 ladder ended at one million lifetime events. Ten million remains an extended research target.</p></article>
        <article><strong>Q3 is still open.</strong><p>Structured provenance has not yet been experimentally compared against brute-force long-context history under the full preregistered Q3 program.</p></article>
      </div>
    </Section>

    <Section eyebrow="Next validation / 07" title="Q3 remains the next major comparison." description="The next open question is not whether structured provenance sounds cleaner. It is whether it measurably outperforms brute-force long-context history under controlled migration, corruption and recovery tests.">
      <div className="research-question-panel">
        <span>OPEN RESEARCH QUESTION</span>
        <h2>Does structured provenance provide a measurable reliability advantage over simply carrying more context?</h2>
        <p>Q3 will remain labeled open until that comparison is actually performed and scored.</p>
      </div>
    </Section>

    <section className="research-note-close">
      <span>CAIRN CONTINUUM · RESEARCH EVIDENCE</span>
      <p>Preserve the history.<br/>Measure the recovery.<br/><strong>Publish only the claim the evidence earns.</strong></p>
      <div className="research-question-links">
        <Link href="/research">Return to Research →</Link>
        <Link href="/technology">Explore the architecture →</Link>
      </div>
    </section>

    <PageCTA title="See where persistent continuity becomes operationally valuable." href="/applications" label="Applications"/>
  </main>;
}
