import { MissionHeader, Section } from '../components/mission-control';

export default function Contact(){
  return <main>
    <MissionHeader eyebrow="Contact" title="Talk to Cairn Continuum." description="Questions about the research, the technology, partnerships or the company are welcome." telemetry={[
      <>GENERAL · <strong>OPEN</strong></>,<>RESEARCH · <strong>OPEN</strong></>,<>PARTNERSHIPS · <strong>OPEN</strong></>,<>LOCATION · <strong>VIRGINIA</strong></>
    ]}/>

    <Section className="contact-stage" eyebrow="Contact / 01" title="Use whichever address fits best." description="All three addresses are active.">
      <div className="info-grid contact-grid">
        <a className="info-card contact-card" href="mailto:hello@cairncontinuum.com"><span>GENERAL</span><h3>hello@cairncontinuum.com</h3><p>Introductions, questions and general company inquiries.</p></a>
        <a className="info-card contact-card" href="mailto:research@cairncontinuum.com"><span>RESEARCH</span><h3>research@cairncontinuum.com</h3><p>Research, testing, evaluation and technical collaboration.</p></a>
        <a className="info-card contact-card" href="mailto:contact@cairncontinuum.com"><span>PARTNERSHIPS</span><h3>contact@cairncontinuum.com</h3><p>Partnerships, business discussions and company correspondence.</p></a>
      </div>
    </Section>
  </main>;
}
