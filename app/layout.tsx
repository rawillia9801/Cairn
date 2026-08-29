import './globals.css';
import './story.css';
import './story-fallback.css';
import Link from 'next/link';

export const metadata = {
  title: 'Cairn Continuum — Persistent AI Continuity Infrastructure',
  description: 'Model-independent continuity infrastructure for persistent AI systems.'
};

const nav = [
  ['Why Continuity','/why-continuity'],
  ['Technology','/technology'],
  ['Research','/research'],
  ['Applications','/applications'],
  ['Company','/company'],
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <Link className="brand" href="/">
              <span className="brand-mark" aria-hidden="true"><i/><i/><i/><i/></span>
              <span>CAIRN <b>CONTINUUM</b></span>
            </Link>
            <nav className="site-nav" aria-label="Primary">
              {nav.map(([label,href]) => <Link key={href} href={href}>{label}</Link>)}
            </nav>
            <Link className="contact-link" href="/contact">Contact</Link>
          </header>
          {children}
          <footer className="site-footer">
            <div><b>CAIRN CONTINUUM</b><span>Continuity infrastructure for persistent machine intelligence.</span></div>
            <div>Virginia, United States</div>
            <div>© 2026 Cairn Continuum LLC</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
