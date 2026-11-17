import { contactLinks } from "@/data/site";
import Container from "./Container";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function ContactSection() {
  const links = contactLinks.filter((l) => l.href);
  return (
    <section id="contact" className="bg-navy-900 py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Contact"
            title="Let's connect"
            intro="I welcome conversations about FP&A, strategic finance, financial modeling, and analytics, as well as feedback on the projects in this portfolio."
          />
        </Reveal>
        <Reveal delay={120} className="mt-12">
          {links.length > 0 ? (
            <ul
              className={`grid gap-px overflow-hidden border border-white/10 bg-white/10 ${
                links.length === 1 ? "max-w-md" : links.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
              }`}
            >
              {links.map((l) => (
                <li key={l.label} className="bg-navy-900">
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group block p-8 transition-colors hover:bg-navy-800"
                  >
                    <p className="text-xs tracking-[0.2em] text-brass-light uppercase">{l.label}</p>
                    <p className="mt-3 text-ivory group-hover:underline">{l.value || l.href}</p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-xl border-l border-brass-light/50 pl-5 text-sm leading-relaxed text-sand-200">
              Contact details will be added soon.
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
