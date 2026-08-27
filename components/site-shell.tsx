import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  ["Why Continuity", "/why-continuity"],
  ["Technology", "/technology"],
  ["Research", "/research"],
  ["Applications", "/applications"],
  ["Company", "/company"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="siteHeader">
        <div className="siteHeaderInner">
          <Link className="brand" href="/" aria-label="Cairn Continuum home">
            <span className="cairnMark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>
              CAIRN <b>CONTINUUM</b>
            </span>
          </Link>
          <nav className="mainNav" aria-label="Primary navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <Link className="contactButton" href="/contact">
            Contact
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="siteFooter">
        <div className="footerInner">
          <div className="footerBrand">CAIRN <span>CONTINUUM</span></div>
          <div>Continuity infrastructure for persistent machine intelligence.</div>
          <div>© 2026 Cairn Continuum LLC</div>
        </div>
      </footer>
    </>
  );
}
