import Link from "next/link";
import Container from "@/components/Container";
import ContactSection from "@/components/ContactSection";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/projects";
import { interests, site } from "@/data/site";

export default function Home() {
  return (
    <>
      <Hero />
      <Philosophy />
      <Interests />
      <Projects />
      <About />
      <ContactSection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory pt-40 pb-28 sm:pt-48 sm:pb-36">
      {/* Decorative ledger grid (no data). */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,var(--color-sand-100)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-sand-100)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_70%_40%,black_20%,transparent_70%)]"
        aria-hidden
      />
      <Container className="relative">
        <div className="fade-up">
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-brass uppercase">
            <span className="h-px w-8 bg-brass" aria-hidden />
            Financial Project Portfolio
          </p>
        </div>
        <div className="fade-up" style={{ animationDelay: "100ms" }}>
          <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[1.08] font-medium text-navy-900 sm:text-6xl lg:text-7xl">
            Hi, welcome to my financial project portfolio.
          </h1>
        </div>
        <div className="fade-up" style={{ animationDelay: "200ms" }}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-stone-600 sm:text-xl">
            I am <span className="font-medium text-navy-900">Yao</span>, an {site.program} candidate
            at {site.school}.
          </p>
        </div>
        <div className="fade-up mt-12 flex flex-wrap gap-4" style={{ animationDelay: "300ms" }}>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 bg-navy-900 px-7 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-navy-700"
          >
            View projects <span aria-hidden>→</span>
          </Link>
          <Link
            href="/#about"
            className="inline-flex items-center border border-navy-900/20 px-7 py-3.5 text-sm font-medium tracking-wide text-navy-900 transition-colors hover:border-navy-900"
          >
            About me
          </Link>
        </div>
      </Container>
    </section>
  );
}

function Philosophy() {
  return (
    <section className="bg-navy-900 py-24 sm:py-32">
      <Container>
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-brass-light uppercase">
            Personal Philosophy
          </p>
          <blockquote className="mt-8 font-serif text-4xl leading-tight text-ivory italic sm:text-6xl">
            “Professional in Finance,
            <br className="hidden sm:block" /> Endurance in Life.”
          </blockquote>
          <div className="mx-auto mt-10 h-px w-16 bg-brass-light/60" aria-hidden />
        </Reveal>
      </Container>
    </section>
  );
}

function Interests() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Areas of Interest"
            title="Where finance meets decisions"
            intro="The areas I am focusing on through my studies and the projects in this portfolio."
          />
        </Reveal>
        <div className="mt-16 grid gap-px overflow-hidden border border-sand-200 bg-sand-200 sm:grid-cols-2 lg:grid-cols-4">
          {interests.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} className="h-full">
              <div className="group h-full bg-ivory p-8 transition-colors duration-300 hover:bg-white">
                <span className="font-serif text-lg text-brass">0{i + 1}</span>
                <h3 className="mt-6 font-serif text-2xl text-navy-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="bg-sand-50 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Selected Projects"
              title="Project portfolio"
              intro="Each project is labeled with its current status. Planned projects show their intended scope only. Results are added once the work is complete."
            />
          </Reveal>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 120} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <Container className="grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionHeading eyebrow="About" title="Yao" />
          <p className="mt-6 font-serif text-2xl leading-snug text-brass italic">
            {site.philosophy}
          </p>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-7">
          <div className="space-y-6 text-base leading-relaxed text-stone-600 sm:text-lg">
            <p>
              I am an {site.program} candidate at {site.school}. My interests are in FP&amp;A,
              strategic finance, financial modeling, and financial analytics.
            </p>
            <p>
              This portfolio brings together my financial projects in one place. Each project
              follows the same structure: the business problem, the methodology, the analysis, the
              findings, and what they mean for the business.
            </p>
            <p>
              Projects are published as they progress, and their status is always shown, so it is
              clear what is finished, what is underway, and what is still planned.
            </p>
          </div>
          <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-sand-200 bg-sand-200 sm:grid-cols-2">
            <div className="bg-ivory p-6">
              <dt className="text-xs tracking-[0.2em] text-brass uppercase">Program</dt>
              <dd className="mt-2 font-serif text-xl text-navy-900">{site.program}</dd>
            </div>
            <div className="bg-ivory p-6">
              <dt className="text-xs tracking-[0.2em] text-brass uppercase">University</dt>
              <dd className="mt-2 font-serif text-xl text-navy-900">{site.school}</dd>
            </div>
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
