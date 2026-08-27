import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "../components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://cairncontinuum.com"),
  title: {
    default: "Cairn Continuum — Persistent AI Continuity Infrastructure",
    template: "%s — Cairn Continuum",
  },
  description:
    "Cairn Continuum develops model-independent continuity infrastructure for persistent AI systems.",
  openGraph: {
    title: "Cairn Continuum",
    description: "Continuity infrastructure for persistent machine intelligence.",
    url: "https://cairncontinuum.com",
    siteName: "Cairn Continuum",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
