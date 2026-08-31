import Link from 'next/link';
import { ArchitectureFlow, PageCTA } from './components/mission-control';

function ContinuityMissionViewport(){
  return <div className="story-viewport" role="img" aria-label="Cairn continuity mission viewport showing verified history passing from one replaceable cognition engine through the Cairn continuity layer to a replacement cognition engine">
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
          <small>TRUSTED HISTORY</small>
          <strong>CAIRN</strong>
          <span>CONTINUITY LAYER</span>
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
        <div><small>CHECKPOINT</small><strong>VERIFIED BEFORE RECOVERY</strong></div>
      </div>

      <div className="ledger-rail">
        <div className="ledger-label"><small>APPEND-ONLY HISTORY</small><b>ORIGINAL RECORD PRESERVED</b></div>
        <div className="ledger-line"><i/><i/><i/><i/><i/><i/></div>
        <div className="ledger-meta"><span>EVENTS</span><span>SOURCES</span><span>COMMITMENTS</span><span>RECOVERY</span></div>
      </div>
    </div>

    <div className="viewport-caption">
      <span>LIVE CONCEPT</span>
      <b>The model can change. The history should not disappear.</b>
    </div>
  </div>;
}

export default function HomePage(){
  return <main className="story-home">
    <section className="story-hero">
      <div className="story-hero-copy">
        <div className="story-overline"><span/> THE CONTINUITY PROBLEM</div>
        <h1>What happens when an AI<br/><em>outlives the model that made it?</em></h1>
        <p className="story-deck">AI systems are starting to stay useful longer than the models, providers and machines underneath them. Cairn Continuum is being built so their history does not vanish when those parts change.</p>
        <div className="hero-actions">
          <a className="button primary" href="#story-begins">Follow the story</a>
          <Link className="button" href="/technology">See how it works</Link>
        </div>
      </div>

      <ContinuityMissionViewport/>
    </section>

    <div className="story-status" aria-label="Cairn system principles">
      <div className="story-status-lead"><i/> SYSTEM ONLINE</div>
      <div><span>HISTORY</span><b>Preserved</b></div>
      <div><span>MODEL</span><b>Replaceable</b></div>
      <div><span>SOURCES</span><b>Traceable</b></div>
      <div><span>RECOVERY</span><b>Verifiable</b></div>
    </div>

    <section className="story-chapter" id="story-begins">
      <div className="chapter-number">01</div>
      <div className="chapter-copy">
        <div className="story-overline"><span/> YEAR ONE</div>
        <h2>The system starts building a history.</h2>
        <p className="chapter-lead">Not a human life — a record of the work it has done.</p>
        <p>It learns how a business works. It makes decisions. It records exceptions. It starts tasks that will not finish today. It makes commitments that still matter tomorrow. It keeps the evidence behind those decisions and carries forward work that is not finished yet.</p>
        <p>At first, this seems simple because the same model and the same infrastructure are still running.</p>
      </div>
      <aside className="chapter-aside">
        <span>THE RECORD GROWS</span>
        <strong>Events</strong>
        <strong>Decisions</strong>
        <strong>Commitments</strong>
        <strong>Evidence</strong>
        <strong>Unfinished work</strong>
      </aside>
    </section>

    <section className="story-turn">
      <div className="turn-line"></div>
      <div className="turn-copy">
        <div className="story-overline"><span/> THEN SOMETHING CHANGES</div>
        <h2>The intelligence underneath it does not stay the same.</h2>
        <p>That is normal. Models improve. Providers change. Hardware gets replaced. Systems move.</p>
      </div>
      <div className="change-sequence">
        <article><span>YEAR 02</span><b>Model upgrade</b><p>A stronger model replaces the original.</p></article>
        <article><span>YEAR 03</span><b>Provider move</b><p>The system moves to a different AI provider.</p></article>
        <article><span>YEAR 04</span><b>New hardware</b><p>Compute moves to a different machine or environment.</p></article>
        <article><span>YEAR 05</span><b>Recovery</b><p>A failure forces the system to rebuild its working state.</p></article>
      </div>
    </section>

    <section className="story-question">
      <div className="question-copy">
        <div className="story-overline light"><span/> THE HIDDEN PROBLEM</div>
        <h2>The files may survive.<br/>But did the system really pick up where it left off?</h2>
        <p>A transcript can survive. A database can survive. A summary can survive.</p>
        <p>But after the model changes, can the system still prove what actually happened? Can it recover unfinished work? Can it tell the difference between the original record and a later interpretation? Can it know which version of the current state should be trusted?</p>
      </div>
      <div className="question-stack">
        <div><span>01</span><p>What happened?</p></div>
        <div><span>02</span><p>Why did it happen?</p></div>
        <div><span>03</span><p>What is still unfinished?</p></div>
        <div><span>04</span><p>What can be trusted after recovery?</p></div>
      </div>
    </section>

    <section className="story-chapter cairn-arrives">
      <div className="chapter-number">02</div>
      <div className="chapter-copy">
        <div className="story-overline"><span/> THIS IS WHERE CAIRN BEGINS</div>
        <h2>Keep the history separate from the model.</h2>
        <p className="chapter-lead">Let the model change without letting it become the only authority on the past.</p>
        <p>Cairn is being designed as a continuity layer underneath the AI model. It keeps an append-only history, links important state back to its sources, preserves original records, creates checkpoints that can be verified, and gives a replacement model a reliable way to resume.</p>
        <p>The goal is not to freeze an AI system in place. The goal is to let it improve, move and recover <strong>without silently starting over.</strong></p>
      </div>
      <div className="cairn-principle">
        <span>CORE PRINCIPLE</span>
        <blockquote>The original history is not silently rewritten.<br/><b>New understanding is added on top of it.</b></blockquote>
      </div>
    </section>

    <section className="story-architecture">
      <div className="story-section-heading">
        <div>
          <div className="story-overline"><span/> UNDER THE STORY / THE SYSTEM</div>
          <h2>One continuity layer.<br/>Many possible AI models.</h2>
        </div>
        <p>The diagram below shows the system we are building to make that possible.</p>
      </div>
      <ArchitectureFlow/>
      <div className="story-link-row"><Link href="/technology">See how the technology works →</Link></div>
    </section>

    <section className="story-research">
      <div className="research-index">03</div>
      <div>
        <div className="story-overline"><span/> THE RESEARCH QUESTION</div>
        <h2>How much of an AI system's continuity can survive a model change?</h2>
        <p>We do not want to assume the answer. A replacement model can read the same history and still interpret parts of it differently.</p>
        <p>So Cairn is testing the problem directly: what can be preserved reliably, what changes with the model, and what happens when the model, provider or hardware changes.</p>
        <Link className="button primary" href="/research">See what we are testing</Link>
      </div>
    </section>

    <section className="story-ending">
      <div className="story-overline light"><span/> THE END GOAL</div>
      <h2>Cairn may sleep. Cairn may move.<br/>Cairn may be upgraded.<br/><em>Cairn does not start over.</em></h2>
      <p>Long-lived AI needs more than memory. It needs a history it can return to, a state it can rebuild, and evidence it can trust.</p>
    </section>

    <PageCTA title="See why this starts to matter once AI systems are expected to last." href="/why-continuity" label="Why continuity matters"/>
  </main>;
}
