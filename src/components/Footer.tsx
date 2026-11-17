import Link from "next/link";
import { navLinks, site } from "@/data/site";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-sand-200">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-2xl font-semibold tracking-[0.3em] text-ivory">{site.name}</p>
          <p className="mt-2 font-serif text-lg italic text-brass-light">{site.philosophy}</p>
        </div>
        <nav className="flex gap-8 text-sm" aria-label="Footer">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ivory">
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-6 text-xs text-sand-400">
          © {new Date().getFullYear()} {site.name}. Financial project portfolio.
        </Container>
      </div>
    </footer>
  );
}
