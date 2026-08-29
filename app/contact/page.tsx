import { MissionHeader, Section } from '../components/mission-control';

export default function Contact(){
  return <main>
    <MissionHeader eyebrow="Contact" title="Talk to Cairn Continuum." description="Research, technical collaboration, partnerships and general company inquiries." telemetry={[
      <>GENERAL · <strong>OPEN</strong></>,<>RESEARCH · <strong>OPEN</strong></>,<>PARTNERSHIPS · <strong>OPEN</strong></>,<>LOCATION · <strong>VIRGINIA</strong></>
    ]}/>
    <Section className="contact-stage" eyebrow="Contact channels / 01" title="Choose the right channel." description="All three addresses are active company contact points.">
      <div className="info-grid contact-grid">
        <a className="info-card contact-card" href="mailto:hello@cairncontinuum.com"><span>GENERAL</span><h3>hello@cairncontinuum.com</h3><p>General company inquiries and introductions.</p></a>
        <a className="info-card contact-card" href="mailto:research@cairncontinuum.com"><span>RESEARCH</span><h3>research@cairncontinuum.com</h3><p>Technical research, evaluation and collaboration discussions.</p></a>
        <a className="info-card contact-card" href="mailto:contact@cairncontinuum.com"><span>PARTNERSHIPS</span><h3>contact@cairncontinuum.com</h3><p>Partnerships, business operations and general correspondence.</p></a>
      </div>
    </Section>
  </main>;
}
