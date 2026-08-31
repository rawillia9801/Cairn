import Link from 'next/link';
import { MissionHeader, PageCTA, Section } from '../../components/mission-control';

export default function ResearchResults(){
  return <main>
    <MissionHeader
      eyebrow="Research Results · August 2026"
      title={<>What we tested.<br/>What happened.</>}
      description="This page explains the current Cairn research results in plain language. It includes what worked, what only partly worked, the important numbers and the limits of each result."
      telemetry={[
        <>Q1 · <strong>SUPPORTED</strong></>,
        <>Q2 T1 · <strong>SUPPORTED</strong></>,
        <>Q2 T2 · <strong>SUPPORTED</strong></>,
        <>Q3 · <strong>OPEN</strong></>
      ]}
    />

    <Section eyebrow="How to read this page / 01" title="We report the result, the numbers and the limits." description="A successful test tells us something useful, but it does not prove that every possible version of the problem is solved.">
      <div className="research-principle">
        <div>
          <span>OUR RULE</span>
          <h3>Say what the test showed. Do not stretch it further.</h3>
        </div>
        <p>If a test passes, we explain what passed. If part of a test is incomplete or fails, that stays in the record too. The goal is to make the results useful without overselling them.</p>
      </div>
    </Section>

    <Section eyebrow="Q1 Trial 001 / 02" title="Different model families recovered the same working state." description="The first Q1 test asked whether a replacement AI model could pick up from the same preserved history without inventing a different version of the current state." >
      <div id="q1-trial-001" className="research-prose-grid">
        <article>
          <span>WHAT HAPPENED</span>
          <h3>The test was supported.</h3>
          <p>Two materially different model families recovered the same predefined operational state, the same unfinished commitments, the same revision relationships and the same resume point.</p>
          <p>Neither model added unsupported claims to the authoritative state, and the two models did not disagree on the predefined assertions being scored.</p>
        </article>
        <article>
          <span>WHY IT MATTERS</span>
          <h3>The system did not depend on one specific model family to remember where it was.</h3>
          <p>This supports the idea that important working state can live outside the model and be handed to a replacement model in a form it can recover reliably.</p>
          <p>One source-tracing weakness showed up in the trial. We kept that weakness in the result instead of rewriting the test after seeing it.</p>
        </article>
      </div>
      <div className="research-question-panel">
        <span>WHAT THIS DOES NOT MEAN</span>
        <h2>Different models are still different.</h2>
        <p>This test was about recovering defined operational state. It does not mean two different AI models will have the same personality, reasoning style, wording or judgment in open-ended situations.</p>
      </div>
    </Section>

    <Section eyebrow="Q1 Trial 002 / 03" title="A smaller structured source package also worked across model families." description="The follow-up asked whether the replacement model really needed a huge amount of historical text, or whether a smaller structured package could carry the important source relationships.">
      <div id="q1-trial-002" className="research-prose-grid">
        <article>
          <span>WHAT HAPPENED</span>
          <h3>Two complete model arms passed. One remained partial.</h3>
          <p>Claude and Grok met every required target and recovered the same required source relationships.</p>
          <p>Gemini remains recorded as a partial result. We did not quietly remove it because the other two performed better.</p>
        </article>
        <article>
          <span>WHY IT MATTERS</span>
          <h3>A replacement model did not need every old token to recover the tested relationships.</h3>
          <p>When the important history and its sources were represented directly, the completed model arms could recover the required evidence without being given the entire past as one giant block of context.</p>
        </article>
      </div>
    </Section>

    <Section eyebrow="Q2 Trial 001 / 04" title="A million-event history did not require a million-event normal recovery." description="Q2 asks whether a long-lived system can recover efficiently as its history grows, instead of rereading everything from the beginning every time it resumes.">
      <div id="q2-trial-001" className="info-grid">
        <article className="info-card"><span>1,000,000</span><h3>Total events</h3><p>The largest required Trial 001 test contained one million protected synthetic events.</p></article>
        <article className="info-card"><span>10,000</span><h3>Events replayed from the checkpoint</h3><p>Verified checkpoint recovery rebuilt the same final state while reading only the most recent 10,000-event tail.</p></article>
        <article className="info-card"><span>232</span><h3>Relevant events applied</h3><p>The dependency-aware path only had to apply 232 events that could actually change the final state or unfinished commitments.</p></article>
        <article className="info-card"><span>0</span><h3>Silent false verifications</h3><p>When checkpoints, dependency data and protected history were deliberately damaged, none of the corruption tests silently returned a false verified state.</p></article>
      </div>
      <div className="research-question-panel">
        <span>WHAT WE LEARNED</span>
        <h2>Normal recovery can start from a trusted recent point instead of replaying the whole history.</h2>
        <p>For this controlled workload, checkpoint recovery rebuilt the same final state as full replay while doing far less work.</p>
      </div>
    </Section>

    <Section eyebrow="Q2 Trial 002 / 05" title="Recovery time barely changed while total history grew 10×." description="Trial 002 made the test stricter. We kept the recovery window fixed at exactly 10,000 events while the total lifetime history grew from 100,000 to 1,000,000 events.">
      <div id="q2-trial-002" className="architecture-panel">
        <div className="panel-bar"><span>MAIN RESULT</span><b>● SUPPORTED</b></div>
        <div className="architecture-grid">
          <article><span>100K TOTAL HISTORY</span><h3>73.733 ms</h3><p>Verified checkpoint recovery with a 10,000-event recovery window.</p></article>
          <article><span>1M TOTAL HISTORY</span><h3>73.741 ms</h3><p>Verified checkpoint recovery with the same 10,000-event recovery window.</p></article>
          <article><span>FULL REPLAY · 100K</span><h3>679.994 ms</h3><p>Time to verify and replay the entire 100,000-event history.</p></article>
          <article><span>FULL REPLAY · 1M</span><h3>6,811.583 ms</h3><p>Time to verify and replay the entire one-million-event history.</p></article>
          <article><span>RECOVERY RATIO</span><h3>1.0001</h3><p>The 1M recovery time divided by the 100K recovery time. The test allowed anything up to 2.0.</p></article>
          <article><span>OLD EVENT BODIES READ</span><h3>0</h3><p>Normal checkpoint recovery did not reread event bodies from before the checkpoint at either required scale.</p></article>
        </div>
      </div>

      <div className="research-prose-grid">
        <article>
          <span>DEPENDENCY-AWARE RECOVERY</span>
          <h3>Only a few hundred tail events actually mattered to the final state.</h3>
          <p>The dependency-aware path applied 229 relevant events at 100K total history and 232 relevant events at 1M total history while still rebuilding the same final state.</p>
        </article>
        <article>
          <span>CORRUPTION TESTS</span>
          <h3>Damaged recovery data was detected instead of silently trusted.</h3>
          <p>We deliberately damaged checkpoint data, dependency data and protected history. The system rejected the bad data and either recovered safely or stopped instead of pretending the result was valid.</p>
        </article>
      </div>

      <div className="research-question-panel">
        <span>WHAT WE LEARNED</span>
        <h2>For this test, normal recovery depended on how much happened since the checkpoint — not on how large the entire history had become.</h2>
        <p>Full replay became roughly 10× slower when total history grew 10×. Fixed-window recovery stayed almost exactly the same.</p>
      </div>
    </Section>

    <Section eyebrow="Important limits / 06" title="What these tests do not prove." description="The results are encouraging, but there are still clear limits to what we can say from them.">
      <div className="research-limit-grid">
        <article><strong>The workloads were synthetic.</strong><p>They were controlled research fixtures built so the tests could be repeated exactly. Real systems may have different event patterns.</p></article>
        <article><strong>The timing came from CI runners.</strong><p>The milliseconds on this page show how the approaches scaled in the test environment. They are not a promised production response time.</p></article>
        <article><strong>Q1 does not mean all models are interchangeable.</strong><p>The models recovered the predefined operational state. They can still reason and behave differently.</p></article>
        <article><strong>Full-history audit still matters.</strong><p>Fast checkpoint recovery is for normal resume. A full origin-to-current verification remains a different and more expensive operation.</p></article>
        <article><strong>Q2 has not tested the fixed-age design at 10 million events yet.</strong><p>The required Trial 002 ladder ended at one million events. Ten million remains an extended target.</p></article>
        <article><strong>Q3 is still open.</strong><p>We have not yet completed the direct comparison between structured history and brute-force long context.</p></article>
      </div>
    </Section>

    <Section eyebrow="What comes next / 07" title="Q3 is the next major comparison." description="The next question is straightforward: does structured history actually outperform simply giving the model more and more old context?">
      <div className="research-question-panel">
        <span>NEXT QUESTION</span>
        <h2>Is structured, source-linked history more reliable than brute-force long context?</h2>
        <p>We will keep Q3 marked open until that comparison is run and scored.</p>
      </div>
    </Section>

    <section className="research-note-close">
      <span>CAIRN CONTINUUM · RESEARCH RESULTS</span>
      <p>Keep the history.<br/>Test the recovery.<br/><strong>Say what the results actually show.</strong></p>
      <div className="research-question-links">
        <Link href="/research">Return to Research →</Link>
        <Link href="/technology">See how Cairn works →</Link>
      </div>
    </section>

    <PageCTA title="See where long-lived continuity could become useful in the real world." href="/applications" label="Applications"/>
  </main>;
}
