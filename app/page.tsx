import Link from 'next/link';
import { ArchitectureFlow, PageCTA } from './components/mission-control';

function ContinuityMissionViewport(){
  return <div className="story-viewport" role="img" aria-label="Cairn continuity mission viewport showing verified history passing from one replaceable cognition engine through the Cairn continuity substrate to a replacement cognition engine">
    <div className="viewport-art" aria-hidden="true"/>
    <div className="viewport-scan" aria-hidden="true"/>

    <div className="viewport-topline">
      <span>CAIRN / CONTINUITY MISSION VIEWPORT</span>
      <b><i/> PATH VERIFIED</b>
    </div>

    <div className="mission-flow" aria-hidden="true">
      <div className="mission-node model-a">
        <small>COGNITION A</small>
        <strong>MODEL / HOST A</strong>
        <span>replaceable</span>
      </div>

      <div className="mission-connector connector-a"><i/><i/><i/></div>

      <div className="mission-core">
        <div className="core-orbit orbit-one"/>
        <div className="core-orbit orbit-two"/>
        <div className="core-pulse"/>
        <div className="core-label">
          <small>AUTHORITATIVE LAYER</small>
          <strong>CAIRN</strong>
          <span>CONTINUITY SUBSTRATE</span>
        </div>
      </div>

      <div className="mission-connector connector-b"><i/><i/><i/></div>

      <div className="mission-node model-b">
        <small>COGNITION B</small>
        <strong>REPLACEMENT MODEL</strong>
        <span>resumes from evidence</span>
      </div>

      <div className="checkpoint-card">
        <span className="checkpoint-mark">✓</span>
        <div><small>CHECKPOINT</small><strong>CRYPTOGRAPHICALLY VERIFIED</strong></div>
      </div>

      <div className="ledger-rail">
        <div className="ledger-label"><small>APPEND-ONLY HISTORY</small><b>ORIGINAL RECORD PRESERVED</b></div>
        <div className="ledger-line"><i/><i/><i/><i/><i/><i/></div>
        <div className="ledger-meta"><span>EVENTS</span><span>PROVENANCE</span><span>COMMITMENTS</span><span>RECOVERY</span></div>
      </div>
    </div>

    <div className="viewport-caption">
      <span>LIVE CONCEPT</span>
      <b>Model changes. History does not silently reset.</b>
    </div>
  </div>;
}

export default function HomePage(){
  return <main className="story-home">
    <section className="story-hero">
      <div className="story-hero-copy">
        <div className="story-overline"><span/> THE CONTINUITY PROBLEM</div>
        <h1>What happens when an AI<br/><em>outlives the model that made it?</em></h1>
        <p className="story-deck">AI systems are beginning to live longer than the sessions, models, providers and machines underneath them. Cairn Continuum is being built for what comes next.</p>
        <div className="hero-actions">
          <a className="button primary" href="#story-begins">Follow the story</a>
          <Link className="button" href="/technology">Explore the architecture</Link>
        </div>
      </div>

      <ContinuityMissionViewport/>
    </section>

    <div className="story-status" aria-label="Cairn system principles">
      <div className="story-status-lead"><i/> SYSTEM ONLINE</div>
      <div><span>HISTORY</span><b>Append-only</b></div>
      <div><span>COGNITION</span><b>Replaceable</b></div>
      <div><span>PROVENANCE</span><b>Traceable</b></div>
      <div><span>RECOVERY</span><b>Verifiable</b></div>
    </div>

    <section className="story-chapter" id="story-begins">
      <div className="chapter-number">01</div>
      <div className="chapter-copy">
        <div className="story-overline"><span/> YEAR ONE</div>
        <h2>The system begins to accumulate a life.</h2>
        <p className="chapter-lead">Not a human life — an operational history.</p>
        <p>It learns how a business works. It makes decisions. It records exceptions. It starts tasks that will not finish today. It forms commitments that matter tomorrow. It gathers evidence for why a decision was made, and it carries forward work that is still unresolved.</p>
        <p>For a while, everything appears durable because the same model, session and infrastructure are still there.</p>
      </div>
      <aside className="chapter-aside">
        <span>THE RECORD GROWS</span>
        <strong>Events</strong>
        <strong>Decisions</strong>
        <strong>Commitments</strong>
        <strong>Evidence</strong>
        <strong>Unresolved work</strong>
      </aside>
    </section>

    <section className="story-turn">
      <div className="turn-line"></div>
      <div className="turn-copy">
        <div className="story-overline"><span/> THEN SOMETHING CHANGES</div>
        <h2>The intelligence underneath it does not stay still.</h2>
        <p>That is not a failure. Models should improve. Providers will change. Hardware will be replaced. Systems will move.</p>
      </div>
      <div className="change-sequence">
        <article><span>YEAR 02</span><b>Model upgrade</b><p>A stronger cognition engine replaces the original.</p></article>
        <article><span>YEAR 03</span><b>Provider migration</b><p>The original service is no longer the best place to run.</p></article>
        <article><span>YEAR 04</span><b>Host replacement</b><p>Compute moves to new hardware and a new environment.</p></article>
        <article><span>YEAR 05</span><b>Recovery event</b><p>A failure forces reconstruction from preserved state.</p></article>
      </div>
    </section>

    <section className="story-question">
      <div className="question-copy">
        <div className="story-overline light"><span/> THE HIDDEN PROBLEM</div>
        <h2>The data may survive.<br/>But did the continuity survive?</h2>
        <p>A transcript can survive. A vector database can survive. A checkpoint can survive. A summary can survive.</p>
        <p>But after the model changes, can the system still prove what actually happened? Can it recover unfinished commitments? Can it distinguish an original event from a later interpretation? Can it tell which state is authoritative instead of merely plausible?</p>
      </div>
      <div className="question-stack">
        <div><span>01</span><p>What happened?</p></div>
        <div><span>02</span><p>Why did it happen?</p></div>
        <div><span>03</span><p>What remains unresolved?</p></div>
        <div><span>04</span><p>What can be trusted after reconstruction?</p></div>
      </div>
    </section>

    <section className="story-chapter cairn-arrives">
      <div className="chapter-number">02</div>
      <div className="chapter-copy">
        <div className="story-overline"><span/> THIS IS WHERE CAIRN BEGINS</div>
        <h2>Separate continuity from cognition.</h2>
        <p className="chapter-lead">Let the model change without giving the model sole authority over the past.</p>
        <p>Cairn is being designed as a continuity substrate beneath the inference engine: an append-only historical record, provenance-linked state, preserved originals, verifiable checkpoints and a reconstruction process that survives model and infrastructure transitions.</p>
        <p>The goal is not to freeze an AI system in place. The goal is to let it improve, move and recover <strong>without silently starting over.</strong></p>
      </div>
      <div className="cairn-principle">
        <span>CORE PRINCIPLE</span>
        <blockquote>Original history is never silently rewritten.<br/><b>New understanding is appended.</b></blockquote>
      </div>
    </section>

    <section className="story-architecture">
      <div className="story-section-heading">
        <div>
          <div className="story-overline"><span/> UNDER THE STORY / THE SYSTEM</div>
          <h2>One continuity layer.<br/>Many possible cognition engines.</h2>
        </div>
        <p>This is the systems architecture intended to make the narrative above technically possible.</p>
      </div>
      <ArchitectureFlow/>
      <div className="story-link-row"><Link href="/technology">Go deeper into the technology →</Link></div>
    </section>

    <section className="story-research">
      <div className="research-index">03</div>
      <div>
        <div className="story-overline"><span/> THE RESEARCH QUESTION</div>
        <h2>How much continuity can actually be made model-independent?</h2>
        <p>That answer cannot be assumed. A replacement model may interpret the same preserved history differently even when the systems layer is perfect.</p>
        <p>Cairn’s research is designed to measure that boundary: which properties can be guaranteed by infrastructure, which remain dependent on the cognition engine, and how recovery changes when the model, provider or host changes.</p>
        <Link className="button primary" href="/research">See the research program</Link>
      </div>
    </section>

    <section className="story-ending">
      <div className="story-overline light"><span/> THE END GOAL</div>
      <h2>Cairn may sleep. Cairn may move.<br/>Cairn may be upgraded.<br/><em>Cairn does not start over.</em></h2>
      <p>Persistent intelligence needs more than memory. It needs a history it can return to, a state it can reconstruct, and evidence it can trust.</p>
    </section>

    <PageCTA title="See why continuity becomes infrastructure once AI systems are expected to last." href="/why-continuity" label="Why continuity matters"/>
  </main>;
}
